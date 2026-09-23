-- Apply after backup and staging verification. No business rows are deleted.
BEGIN;
-- SECURITY DEFINER changes current_user to the function owner; never use it as caller authorization.
CREATE OR REPLACE FUNCTION public.is_admin() RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path=public,pg_temp AS $$
 SELECT coalesce(auth.role()='service_role',false) OR EXISTS (SELECT 1 FROM public.ts_user_profiles WHERE id=auth.uid() AND role='admin');
$$;
ALTER TABLE public.ts_orders
 ADD COLUMN IF NOT EXISTS subtotal numeric(12,2),
 ADD COLUMN IF NOT EXISTS shipping_fee numeric(12,2) NOT NULL DEFAULT 0,
 ADD COLUMN IF NOT EXISTS unique_code numeric(12,2) NOT NULL DEFAULT 0,
 ADD COLUMN IF NOT EXISTS payment_method text,
 ADD COLUMN IF NOT EXISTS courier text,
 ADD COLUMN IF NOT EXISTS payment_status text NOT NULL DEFAULT 'unpaid',
 ADD COLUMN IF NOT EXISTS inventory_deducted boolean NOT NULL DEFAULT false;

-- Existing payment history must be reconciled rather than posting it a second time.
ALTER TABLE public.ts_orders ADD COLUMN IF NOT EXISTS payment_reconciliation_required boolean NOT NULL DEFAULT true;
ALTER TABLE public.ts_orders ALTER COLUMN payment_reconciliation_required SET DEFAULT false;

ALTER TABLE public.ts_cash_ledger ADD COLUMN IF NOT EXISTS business_unit text NOT NULL DEFAULT 'teestock',
 ADD COLUMN IF NOT EXISTS proof_receipt_ref text,
 ADD COLUMN IF NOT EXISTS settlement_status text NOT NULL DEFAULT 'cleared';
ALTER TABLE public.ts_cash_ledger DROP CONSTRAINT IF EXISTS ts_cash_ledger_type_check;
ALTER TABLE public.ts_cash_ledger ADD CONSTRAINT ts_cash_ledger_type_check CHECK(type IN ('CASH_IN','CASH_OUT','INTER_TRANSFER','CAPITAL_INJECTION','FOUNDER_PRIVE'));
ALTER TABLE public.ts_procurements ADD COLUMN IF NOT EXISTS inventory_items jsonb NOT NULL DEFAULT '[]';
REVOKE INSERT, UPDATE, DELETE ON public.ts_orders, public.ts_order_items, public.ts_products, public.ts_inventory, public.ts_settings, public.ts_cash_ledger, public.ts_procurements FROM anon;
REVOKE SELECT ON public.ts_orders, public.ts_order_items, public.ts_inventory, public.ts_cash_ledger, public.ts_procurements FROM anon;

DO $$ DECLARE t text; p record; BEGIN
 FOREACH t IN ARRAY ARRAY['ts_orders','ts_order_items','ts_products','ts_inventory','ts_settings','ts_cash_ledger','ts_procurements'] LOOP
  EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY',t);
  FOR p IN SELECT policyname FROM pg_policies WHERE schemaname='public' AND tablename=t AND policyname IN
   ('manage_orders_all','manage_order_items_all','manage_products_all','manage_inventory_all','manage_settings_all','manage_cash_ledger_all','manage_procurements_all','audit_admin_access','public_read_inventory') LOOP
   EXECUTE format('DROP POLICY %I ON public.%I',p.policyname,t);
  END LOOP;
  EXECUTE format('CREATE POLICY audit_admin_access ON public.%I FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin())',t);
 END LOOP;
END $$;
-- Legacy views execute with the caller's permissions so they cannot bypass RLS.
DO $$ DECLARE v record; BEGIN
 FOR v IN SELECT viewname FROM pg_views WHERE schemaname='public' AND viewname IN ('ts_view_catalog_summary','ts_view_founder_wealth') LOOP
  EXECUTE format('ALTER VIEW public.%I SET (security_invoker=true)',v.viewname);
 END LOOP;
END $$;
DROP POLICY IF EXISTS audit_catalog_read ON public.ts_products;
CREATE POLICY audit_catalog_read ON public.ts_products FOR SELECT TO anon,authenticated USING (status='active');
GRANT SELECT ON public.ts_products TO anon,authenticated;
DROP POLICY IF EXISTS user_insert_own_profile ON public.ts_user_profiles;
CREATE POLICY user_insert_own_profile ON public.ts_user_profiles FOR INSERT TO authenticated WITH CHECK (auth.uid()=id AND role='member');
CREATE OR REPLACE FUNCTION public.protect_user_role() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path=public,pg_temp AS $$
BEGIN
 IF auth.role()='service_role' OR auth.uid() IS NULL THEN RETURN NEW; END IF;
 IF NEW.role IS DISTINCT FROM OLD.role AND NOT public.is_admin() THEN RAISE EXCEPTION 'Only administrators may change roles'; END IF;
 RETURN NEW;
END $$;
DROP TRIGGER IF EXISTS trg_protect_user_role ON public.ts_user_profiles;
CREATE TRIGGER trg_protect_user_role BEFORE UPDATE ON public.ts_user_profiles FOR EACH ROW EXECUTE FUNCTION public.protect_user_role();
-- ==============================================================================
-- 🔒 TRANSAKSI ATOMIK PESANAN & ITEM TEESTOCK (create_order_transactional)
-- Menjamin penyimpanan header pesanan, rincian item, dan penggunaan voucher
-- dieksekusi dalam satu transaksi atomik. Jika ada item yang gagal, seluruh
-- pesanan di-ROLLBACK otomatis sehingga tidak ada order yatim (orphaned orders).
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.create_order_transactional(
  p_order jsonb,
  p_items jsonb,
  p_voucher_code text DEFAULT NULL,
  p_voucher_discount numeric DEFAULT 0
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_order_id uuid;
  v_item jsonb;
  v_voucher_id uuid;
  v_usage_limit int;
  v_used_count int;
  v_item_count int := 0;
BEGIN
  -- Validasi keberadaan payload
  IF p_order IS NULL OR p_items IS NULL OR jsonb_array_length(p_items) = 0 THEN
    RAISE EXCEPTION 'Payload pesanan atau rincian item tidak boleh kosong.';
  END IF;

  -- 1. Insert Order Header
  INSERT INTO public.ts_orders (
    id,
    order_number,
    user_id,
    customer_name,
    customer_phone,
    customer_city,
    customer_address,
    channel,
    tier,
    status,
    total_amount,
    discount_amount,
    voucher_code,
    notes,
    created_at,
    updated_at
  ) VALUES (
    (p_order->>'id')::uuid,
    p_order->>'order_number',
    CASE
      WHEN p_order->>'user_id' IS NOT NULL AND p_order->>'user_id' <> '' AND p_order->>'user_id' <> 'null'
      THEN (p_order->>'user_id')::uuid
      ELSE NULL
    END,
    p_order->>'customer_name',
    p_order->>'customer_phone',
    p_order->>'customer_city',
    p_order->>'customer_address',
    COALESCE(p_order->>'channel', 'web'),
    COALESCE(p_order->>'tier', 'retail'),
    'pending_payment',
    (p_order->>'total_amount')::numeric,
    COALESCE((p_order->>'discount_amount')::numeric, 0),
    p_order->>'voucher_code',
    p_order->>'notes',
    NOW(),
    NOW()
  ) RETURNING id INTO v_order_id;

  -- 2. Insert Order Items Atomik
  UPDATE public.ts_orders SET
    subtotal = (p_order->>'subtotal')::numeric,
    shipping_fee = COALESCE((p_order->>'shipping_fee')::numeric, 0),
    unique_code = COALESCE((p_order->>'unique_code')::numeric, 0),
    payment_method = p_order->>'payment_method'
  WHERE id = v_order_id;

  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    INSERT INTO public.ts_order_items (
      order_id,
      order_number,
      product_sku,
      product_name,
      garment,
      size,
      color,
      qty,
      unit_price,
      subtotal
    ) VALUES (
      v_order_id,
      p_order->>'order_number',
      v_item->>'product_sku',
      v_item->>'product_name',
      COALESCE(v_item->>'garment', 'NSA Heavyweight 24s'),
      COALESCE(v_item->>'size', 'L'),
      COALESCE(v_item->>'color', 'Hitam'),
      (v_item->>'qty')::int,
      (v_item->>'unit_price')::numeric,
      (v_item->>'subtotal')::numeric
    );
    v_item_count := v_item_count + 1;
  END LOOP;

  -- 3. Transaksi Penggunaan Voucher (Bila ada)
  IF p_voucher_code IS NOT NULL AND TRIM(p_voucher_code) <> '' AND p_voucher_discount > 0 THEN
    -- Lock baris voucher secara eksklusif (FOR UPDATE) untuk mencegah race condition
    SELECT id, usage_limit, used_count
    INTO v_voucher_id, v_usage_limit, v_used_count
    FROM public.ts_vouchers
    WHERE code = UPPER(TRIM(p_voucher_code))
      AND is_active = true
      AND (expires_at IS NULL OR expires_at > NOW())
    FOR UPDATE;

    IF v_voucher_id IS NULL THEN
      RAISE EXCEPTION 'Voucher tidak valid atau masa berlaku telah habis.';
    END IF;

    IF v_usage_limit IS NOT NULL AND COALESCE(v_used_count, 0) >= v_usage_limit THEN
      RAISE EXCEPTION 'Batas total kuota pemakaian voucher telah tercapai.';
    END IF;

    -- Update jumlah pemakaian voucher secara atomik
    UPDATE public.ts_vouchers
    SET used_count = COALESCE(used_count, 0) + 1,
        updated_at = NOW()
    WHERE id = v_voucher_id;

    -- Catat log pemakaian voucher
    INSERT INTO public.ts_voucher_usage (
      voucher_id,
      user_id,
      order_id,
      discount_applied,
      created_at
    ) VALUES (
      v_voucher_id,
      CASE
        WHEN p_order->>'user_id' IS NOT NULL AND p_order->>'user_id' <> '' AND p_order->>'user_id' <> 'null'
        THEN (p_order->>'user_id')::uuid
        ELSE NULL
      END,
      p_order->>'order_number',
      p_voucher_discount,
      NOW()
    );
  END IF;

  RETURN jsonb_build_object(
    'success', true,
    'order_id', v_order_id,
    'order_number', p_order->>'order_number',
    'items_count', v_item_count
  );
EXCEPTION
  WHEN OTHERS THEN
    RAISE EXCEPTION 'Transaksi pesanan gagal: %', SQLERRM;
END;
$$;

-- 🔒 Keamanan Ketat SECURITY DEFINER:
-- 1. Kunci search_path untuk mencegah eksploitasi search_path hijacking
ALTER FUNCTION public.create_order_transactional(jsonb, jsonb, text, numeric)
  SET search_path = public, pg_temp;

-- 2. Cabut seluruh izin eksekusi dari PUBLIC, anon, dan authenticated untuk mencegah bypass Edge Function via PostgREST RPC
REVOKE EXECUTE ON FUNCTION public.create_order_transactional(jsonb, jsonb, text, numeric)
  FROM PUBLIC, anon, authenticated;

-- 3. Berikan izin eksekusi HANYA kepada service_role (Supabase Edge Functions / Backend Admin)
GRANT EXECUTE ON FUNCTION public.create_order_transactional(jsonb, jsonb, text, numeric)
  TO service_role;


CREATE OR REPLACE FUNCTION public.transition_order(p_order_number text,p_status text,p_materials jsonb DEFAULT '[]') RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path=public,pg_temp AS $$
DECLARE o public.ts_orders; m record; n int; stages text[]:=ARRAY['pending','dtf','press','pack','shipped']; BEGIN
 IF NOT public.is_admin() THEN RAISE EXCEPTION 'Administrator required'; END IF;
 SELECT * INTO STRICT o FROM public.ts_orders WHERE order_number=p_order_number FOR UPDATE;
 IF o.status=p_status THEN RETURN; END IF;
 IF o.payment_status<>'paid' THEN RAISE EXCEPTION 'Payment must be confirmed'; END IF;
 IF array_position(stages,o.status) IS NULL OR array_position(stages,p_status) IS NULL OR abs(array_position(stages,o.status)-array_position(stages,p_status))<>1 THEN RAISE EXCEPTION 'Invalid status transition'; END IF;
 IF p_status IN ('dtf','press') AND NOT o.inventory_deducted THEN
  IF p_materials IS NULL OR jsonb_typeof(p_materials)<>'array' OR jsonb_array_length(p_materials)=0 THEN RAISE EXCEPTION 'Materials required'; END IF;
  IF EXISTS(SELECT 1 FROM jsonb_to_recordset(p_materials) AS x(sku text,qty int) WHERE x.sku IS NULL OR x.sku='' OR x.qty IS NULL OR x.qty<=0) THEN RAISE EXCEPTION 'Invalid material'; END IF;
  FOR m IN SELECT x.sku,sum(x.qty) qty FROM jsonb_to_recordset(p_materials) AS x(sku text,qty int) GROUP BY x.sku ORDER BY x.sku LOOP
   IF m.qty IS NULL OR m.qty<=0 OR m.sku IS NULL THEN RAISE EXCEPTION 'Invalid material'; END IF;
   UPDATE public.ts_inventory SET stock_qty=stock_qty-m.qty,updated_at=now() WHERE sku_item=m.sku AND stock_qty>=m.qty;
   GET DIAGNOSTICS n=ROW_COUNT;
   IF n<>1 THEN RAISE EXCEPTION 'Insufficient stock for %',m.sku; END IF;
  END LOOP;
  UPDATE public.ts_orders SET inventory_deducted=true WHERE id=o.id;
 END IF;
 UPDATE public.ts_orders SET status=p_status,updated_at=now() WHERE id=o.id;
END $$;
REVOKE ALL ON FUNCTION public.transition_order(text,text,jsonb) FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.transition_order(text,text,jsonb) TO authenticated;
CREATE OR REPLACE FUNCTION public.confirm_manual_payment(p_order_number text) RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path=public,pg_temp AS $$
DECLARE o public.ts_orders; BEGIN
 IF NOT public.is_admin() THEN RAISE EXCEPTION 'Administrator required'; END IF;
 SELECT * INTO STRICT o FROM public.ts_orders WHERE order_number=p_order_number FOR UPDATE;
 IF o.payment_reconciliation_required THEN RAISE EXCEPTION 'Historical order requires payment reconciliation'; END IF;
 IF o.payment_status='paid' THEN RETURN; END IF;
 IF o.status='cancelled' OR o.payment_status='refunded' THEN RAISE EXCEPTION 'Cancelled or refunded order'; END IF;
 IF o.payment_method IS NOT NULL AND o.payment_method NOT IN ('manual_qris','bank_transfer','manual_transfer') THEN RAISE EXCEPTION 'Gateway payment must be verified by webhook'; END IF;
 UPDATE public.ts_orders SET payment_status='paid',status=CASE WHEN status='pending_payment' THEN 'pending' ELSE status END,updated_at=now() WHERE id=o.id;
END $$;
REVOKE ALL ON FUNCTION public.confirm_manual_payment(text) FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.confirm_manual_payment(text) TO authenticated;
CREATE OR REPLACE FUNCTION public.apply_procurement_moving_average() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path=public,pg_temp AS $$
DECLARE m record; current_row public.ts_inventory; unit_name text; wallet text; category_name text; BEGIN
 IF NEW.total_cost<=0 OR NEW.qty<=0 THEN RAISE EXCEPTION 'Positive procurement cost and quantity required'; END IF;
 IF jsonb_typeof(NEW.inventory_items)<>'array' THEN RAISE EXCEPTION 'Invalid inventory receipt'; END IF;
 IF EXISTS(SELECT 1 FROM jsonb_to_recordset(NEW.inventory_items) AS x(sku text,qty int,unit_cost numeric) WHERE x.sku IS NULL OR x.sku='' OR x.qty IS NULL OR x.qty<=0 OR x.unit_cost IS NULL OR x.unit_cost<0) THEN RAISE EXCEPTION 'Invalid inventory receipt'; END IF;
 FOR m IN SELECT x.sku,sum(x.qty) qty,sum(x.qty*x.unit_cost)/sum(x.qty) unit_cost FROM jsonb_to_recordset(NEW.inventory_items) AS x(sku text,qty int,unit_cost numeric) GROUP BY x.sku ORDER BY x.sku LOOP
  IF m.sku IS NULL OR m.qty IS NULL OR m.qty<=0 OR m.unit_cost IS NULL OR m.unit_cost<0 THEN RAISE EXCEPTION 'Invalid inventory receipt'; END IF;
  SELECT * INTO current_row FROM public.ts_inventory WHERE sku_item=m.sku FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Create inventory SKU % before receiving stock',m.sku; END IF;
  UPDATE public.ts_inventory SET stock_qty=stock_qty+m.qty,cost_per_unit=round((greatest(stock_qty,0)*cost_per_unit+m.qty*m.unit_cost)/(greatest(stock_qty,0)+m.qty),2),updated_at=now() WHERE sku_item=m.sku;
 END LOOP;
 unit_name:=CASE NEW.payment_source WHEN 'multigraph_bank' THEN 'multigraph' WHEN 'holding_treasury' THEN 'holding' WHEN 'personal_pocket' THEN 'founder' ELSE 'teestock' END;
 wallet:='wallet_'||unit_name;
 category_name:=CASE NEW.item_type WHEN 'dtf_film' THEN 'dtf_printing' WHEN 'design_license' THEN 'design_license' WHEN 'supplies' THEN 'unboxing_packaging' WHEN 'packaging' THEN 'unboxing_packaging' WHEN 'sticker_vendor' THEN 'unboxing_packaging' ELSE 'blank_garment' END;
 INSERT INTO public.ts_cash_ledger(transaction_no,transaction_date,business_unit,type,category,amount,source_account,destination_account,related_id,description)
 VALUES('PO-'||NEW.procurement_no,CURRENT_DATE,unit_name,'CASH_OUT',category_name,NEW.total_cost,wallet,left(NEW.supplier_name,50),NEW.procurement_no,'Procurement receipt') ON CONFLICT(transaction_no) DO NOTHING;
 RETURN NEW;
END $$;
DROP TRIGGER IF EXISTS trg_procurement_moving_average ON public.ts_procurements;
CREATE TRIGGER trg_procurement_moving_average AFTER INSERT ON public.ts_procurements FOR EACH ROW EXECUTE FUNCTION public.apply_procurement_moving_average();
CREATE OR REPLACE FUNCTION public.post_order_cash() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path=public,pg_temp AS $$
DECLARE revenue numeric; BEGIN
 IF NEW.payment_status='paid' AND OLD.payment_status IS DISTINCT FROM 'paid' THEN
  IF NEW.payment_reconciliation_required THEN RAISE EXCEPTION 'Historical order requires payment reconciliation'; END IF;
  revenue:=greatest(NEW.total_amount-NEW.shipping_fee-NEW.unique_code,0);
  IF revenue > 0 THEN
  INSERT INTO public.ts_cash_ledger(transaction_no,transaction_date,business_unit,type,category,amount,source_account,destination_account,related_id,description)
  VALUES ('PAY-'||NEW.order_number,CURRENT_DATE,'teestock','CASH_IN','sales_retail',revenue,'wallet_teestock','wallet_teestock',NEW.order_number,'Confirmed order payment') ON CONFLICT(transaction_no) DO NOTHING;
  END IF;
  IF NEW.shipping_fee>0 THEN
   INSERT INTO public.ts_cash_ledger(transaction_no,transaction_date,business_unit,type,category,amount,source_account,destination_account,related_id,description)
   VALUES ('SHIP-IN-'||NEW.order_number,CURRENT_DATE,'teestock','CASH_IN','shipping_escrow',NEW.shipping_fee,'wallet_teestock','wallet_teestock',NEW.order_number,'Courier funds received') ON CONFLICT(transaction_no) DO NOTHING;
  END IF;
  IF NEW.unique_code>0 THEN
   INSERT INTO public.ts_cash_ledger(transaction_no,transaction_date,business_unit,type,category,amount,source_account,destination_account,related_id,description)
   VALUES ('CODE-'||NEW.order_number,CURRENT_DATE,'teestock','CASH_IN','unique_code',NEW.unique_code,'wallet_teestock','wallet_teestock',NEW.order_number,'Payment reconciliation code') ON CONFLICT(transaction_no) DO NOTHING;
  END IF;
 END IF;
 IF NEW.status='shipped' AND OLD.status IS DISTINCT FROM 'shipped' AND NEW.shipping_fee>0 THEN
  INSERT INTO public.ts_cash_ledger(transaction_no,transaction_date,business_unit,type,category,amount,source_account,destination_account,related_id,description)
  VALUES ('SHIP-OUT-'||NEW.order_number,CURRENT_DATE,'teestock','CASH_OUT','courier_shipping',NEW.shipping_fee,'wallet_teestock','courier',NEW.order_number,'Courier funds paid') ON CONFLICT(transaction_no) DO NOTHING;
 END IF;
 RETURN NEW;
END $$;
DROP TRIGGER IF EXISTS audit_post_order_cash ON public.ts_orders;
CREATE TRIGGER audit_post_order_cash AFTER UPDATE ON public.ts_orders FOR EACH ROW EXECUTE FUNCTION public.post_order_cash();
COMMIT;
