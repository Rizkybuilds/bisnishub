BEGIN;

-- Procurement inserts immediately post stock and cash. Preserve their source
-- document until an explicit, auditable reversal workflow exists.
CREATE OR REPLACE FUNCTION public.protect_procurement_posting() RETURNS trigger
LANGUAGE plpgsql SET search_path=public AS $$
BEGIN
 RAISE EXCEPTION 'Pengadaan sudah tercatat pada stok dan kas. Gunakan proses koreksi, bukan menghapus atau mengubah transaksi.';
END $$;
DROP TRIGGER IF EXISTS protect_procurement_posting ON public.ts_procurements;
CREATE TRIGGER protect_procurement_posting BEFORE UPDATE OR DELETE ON public.ts_procurements
 FOR EACH ROW EXECUTE FUNCTION public.protect_procurement_posting();

CREATE OR REPLACE FUNCTION public.cancel_unpaid_order(p_order_number text, p_reason text DEFAULT '') RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE o public.ts_orders;
BEGIN
 IF NOT public.is_admin() THEN RAISE EXCEPTION 'Administrator required'; END IF;
 SELECT * INTO o FROM public.ts_orders WHERE order_number=p_order_number FOR UPDATE;
 IF NOT FOUND THEN RAISE EXCEPTION 'Pesanan tidak ditemukan'; END IF;
 IF o.payment_reconciliation_required THEN RAISE EXCEPTION 'Pesanan historis perlu rekonsiliasi terlebih dahulu'; END IF;
 IF o.payment_status <> 'unpaid' OR o.inventory_deducted THEN
  RAISE EXCEPTION 'Pesanan sudah dibayar atau memakai stok. Selesaikan pengembalian dana dan koreksi stok terlebih dahulu';
 END IF;
 IF o.payment_method IS NOT NULL AND o.payment_method NOT IN ('manual_qris','bank_transfer','manual_transfer') THEN
  RAISE EXCEPTION 'Batalkan pembayaran melalui penyedia pembayaran terlebih dahulu';
 END IF;
 IF o.status='cancelled' THEN RETURN; END IF;
 IF o.status NOT IN ('pending_payment','pending') THEN RAISE EXCEPTION 'Pesanan sudah dalam proses produksi'; END IF;
 UPDATE public.ts_orders SET status='cancelled',
  notes=concat_ws(' | ',nullif(notes,''),'Dibatalkan: '||coalesce(nullif(trim(p_reason),''),'Oleh admin')),
  updated_at=now() WHERE id=o.id;
END $$;
REVOKE ALL ON FUNCTION public.cancel_unpaid_order(text,text) FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.cancel_unpaid_order(text,text) TO authenticated;

-- Apply the same invariant to direct table updates, including old clients.
-- Refund webhook handling remains separate and requires ledger reconciliation.
CREATE OR REPLACE FUNCTION public.protect_order_cancellation() RETURNS trigger
LANGUAGE plpgsql SET search_path=public AS $$
BEGIN
 IF NEW.status='cancelled' AND OLD.status IS DISTINCT FROM 'cancelled'
 AND NEW.payment_status <> 'refunded'
 AND (OLD.payment_status <> 'unpaid' OR OLD.inventory_deducted OR OLD.status NOT IN ('pending_payment','pending')) THEN
  RAISE EXCEPTION 'Pesanan sudah dibayar atau diproduksi; pembatalan memerlukan rekonsiliasi';
 END IF;
 RETURN NEW;
END $$;
DROP TRIGGER IF EXISTS protect_order_cancellation ON public.ts_orders;
CREATE TRIGGER protect_order_cancellation BEFORE UPDATE ON public.ts_orders
 FOR EACH ROW EXECUTE FUNCTION public.protect_order_cancellation();
COMMIT;
