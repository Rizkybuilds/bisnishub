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
      subtotal,
      created_at
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
      (v_item->>'subtotal')::numeric,
      NOW()
    );
    v_item_count := v_item_count + 1;
  END LOOP;

  -- 3. Transaksi Penggunaan Voucher (Bila ada)
  IF p_voucher_code IS NOT NULL AND TRIM(p_voucher_code) <> '' AND p_voucher_discount > 0 THEN
    SELECT id INTO v_voucher_id 
    FROM public.ts_vouchers 
    WHERE code = UPPER(TRIM(p_voucher_code)) 
      AND is_active = true 
      AND (expires_at IS NULL OR expires_at > NOW())
    LIMIT 1;

    IF v_voucher_id IS NOT NULL THEN
      -- Update jumlah pemakaian voucher
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
