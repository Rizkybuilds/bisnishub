DO $$ BEGIN RAISE EXCEPTION 'Deprecated unsafe patch. Use database/migrations/20260922_audit_hardening.sql instead.'; END $$;
-- ==============================================================================
-- 📦 BISNISHUB OS & TEESTOCK: PEMBERSIHAN DATA FIKTIF KATALOG & UPGRADE RLS PIM
-- File: patch_clean_catalog_pim.sql
-- Target: https://supabase.com/dashboard/project/tovslowsopqtuxmrogeu/sql/new
-- ==============================================================================

-- 1. BERIKAN AKSES MANAJEMEN PENUH KE TABEL ts_products
ALTER TABLE public.ts_products ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "manage_products_all" ON public.ts_products;
DROP POLICY IF EXISTS "admin_insert_products" ON public.ts_products;
DROP POLICY IF EXISTS "admin_update_products" ON public.ts_products;
DROP POLICY IF EXISTS "admin_delete_products" ON public.ts_products;
DROP POLICY IF EXISTS "public_read_products" ON public.ts_products;
DROP POLICY IF EXISTS "anon_read_products" ON public.ts_products;

-- Izinkan publik membaca katalog dan BisnisHub Admin mengelola produk live
CREATE POLICY "manage_products_all" ON public.ts_products 
  FOR ALL 
  TO public, anon, authenticated 
  USING (true) 
  WITH CHECK (true);

-- 2. BERSIHKAN SEMUA DATA PRODUK & DESAIN DEMO FIKTIF
DELETE FROM public.ts_products WHERE sku IN (
  'TS-STM-001', 'TS-STM-002',
  'TS-SUB-001', 'TS-SUB-002',
  'TS-OUT-001', 'TS-OUT-002',
  'TS-PRO-001', 'TS-PRO-002',
  'TS-KOM-001', 'TS-KOM-002',
  'TS-LOK-001', 'TS-LOK-002',
  'TS-REC-001', 'TS-FAN-001'
);

-- 3. PASTIKAN KOLOM-KOLOM MODEL SOURCING TERSEDIA
ALTER TABLE public.ts_products ADD COLUMN IF NOT EXISTS design_source TEXT DEFAULT 'in_house';
ALTER TABLE public.ts_products ADD COLUMN IF NOT EXISTS design_cost NUMERIC DEFAULT 0;
ALTER TABLE public.ts_products ADD COLUMN IF NOT EXISTS amortization_target NUMERIC DEFAULT 25;
ALTER TABLE public.ts_products ADD COLUMN IF NOT EXISTS creator_name TEXT;
ALTER TABLE public.ts_products ADD COLUMN IF NOT EXISTS creator_handle TEXT;
ALTER TABLE public.ts_products ADD COLUMN IF NOT EXISTS royalty_amount NUMERIC DEFAULT 0;
ALTER TABLE public.ts_products ADD COLUMN IF NOT EXISTS creator_payout_account TEXT;
ALTER TABLE public.ts_products ADD COLUMN IF NOT EXISTS license_source TEXT;
