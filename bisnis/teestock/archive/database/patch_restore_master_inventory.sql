DO $$ BEGIN RAISE EXCEPTION 'Deprecated unsafe patch. Use database/migrations/20260922_audit_hardening.sql instead.'; END $$;
-- ====================================================================
-- BISNISHUB & TEESTOCK APPAREL — MASTER INVENTORY INITIALIZATION & HEALING
-- Target: Cloud Supabase PostgreSQL (ts_inventory & ts_settings)
-- Deskripsi: Memulihkan 337 SKU Master garmen NSA, DTF Drop #01, dan kemasan
--            dengan stok awal 0 (live clean state) jika data database terhapus.
-- ====================================================================

BEGIN;

-- 1. Pastikan Kebijakan RLS Aktif & Mengizinkan Akses Web App
ALTER TABLE public.ts_inventory ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_inventory" ON public.ts_inventory;
DROP POLICY IF EXISTS "manage_inventory_all" ON public.ts_inventory;
CREATE POLICY "public_read_inventory" ON public.ts_inventory FOR SELECT USING (true);
CREATE POLICY "manage_inventory_all" ON public.ts_inventory FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE public.ts_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_read_settings" ON public.ts_settings;
DROP POLICY IF EXISTS "manage_settings_all" ON public.ts_settings;
CREATE POLICY "anon_read_settings" ON public.ts_settings FOR SELECT USING (true);
CREATE POLICY "manage_settings_all" ON public.ts_settings FOR ALL USING (true) WITH CHECK (true);

-- 2. Bersihkan SKU Demo Lama yang Tidak Digunakan
DELETE FROM public.ts_inventory WHERE sku_item IN (
  'TS-PRO-001', 'TS-PRO-002', 'TS-KOM-001', 'TS-KOM-002', 
  'TS-LOK-001', 'TS-LOK-002', 'TS-REC-001', 'TS-FAN-001'
);

-- 3. Inisialisasi Master DTF Films (Drop #01 + Roll 58cm) dengan Stok 0
INSERT INTO public.ts_inventory (sku_item, item_type, brand, color, size, unit_measure, stock_qty, min_stock_alert, cost_per_unit, supplier)
VALUES
  ('TS-STM-001', 'dtf_film', 'Film DTF Raw Identity // Statement Tee', 'Sablon DTF', 'A3', 'lembar', 0, 2, 12500, 'Vendor DTF Partner'),
  ('TS-STM-002', 'dtf_film', 'Film DTF Quiet Confidence // Monolith Tee', 'Sablon DTF', 'A3', 'lembar', 0, 2, 12500, 'Vendor DTF Partner'),
  ('TS-SUB-001', 'dtf_film', 'Film DTF Tokyo Underground 94 // Bootleg Tee', 'Sablon DTF', 'A3', 'lembar', 0, 2, 12500, 'Vendor DTF Partner'),
  ('TS-SUB-002', 'dtf_film', 'Film DTF Echoes of Concrete // Skate Archive Tee', 'Sablon DTF', 'A3', 'lembar', 0, 2, 12500, 'Vendor DTF Partner'),
  ('TS-OUT-001', 'dtf_film', 'Film DTF Deep Forest // Expedition Tee', 'Sablon DTF', 'A3', 'lembar', 0, 2, 12500, 'Vendor DTF Partner'),
  ('TS-OUT-002', 'dtf_film', 'Film DTF Pine Needle // Botanical Archive Tee', 'Sablon DTF', 'A3', 'lembar', 0, 2, 12500, 'Vendor DTF Partner'),
  ('DTF-ROLL-58CM', 'dtf_film', 'Roll Film DTF 58 cm x 100 m', 'Transparan', 'Roll 58 cm', 'meter', 0, 10, 30000, 'Vendor DTF Partner')
ON CONFLICT (sku_item) DO UPDATE SET
  stock_qty = EXCLUDED.stock_qty,
  cost_per_unit = EXCLUDED.cost_per_unit,
  supplier = EXCLUDED.supplier,
  updated_at = NOW();

-- 4. Inisialisasi Material Kemasan MultiGraph dengan Stok 0
INSERT INTO public.ts_inventory (sku_item, item_type, brand, color, size, unit_measure, stock_qty, min_stock_alert, cost_per_unit, supplier)
VALUES
  ('MAT-POLY-30X40', 'supplies', 'Polymailer Hitam Doff 30x40 cm', 'Standard', 'Standard', 'pcs', 0, 20, 800, 'MultiGraph Packaging & Printing'),
  ('MAT-STICKER-VP', 'supplies', 'Stiker Vinyl Unboxing 6x6 cm', 'Standard', 'Standard', 'pcs', 0, 25, 600, 'MultiGraph Packaging & Printing'),
  ('MAT-CARE-A6', 'supplies', 'Care Card & Thank You Insert A6', 'Standard', 'Standard', 'pcs', 0, 20, 400, 'MultiGraph Packaging & Printing'),
  ('MAT-HANGTAG-01', 'supplies', 'Hangtag Distro Kraft Tebal', 'Standard', 'Standard', 'pcs', 0, 20, 500, 'MultiGraph Packaging & Printing'),
  ('MAT-TEFLON-SHEET', 'supplies', 'Kertas Teflon Heat Press', 'Standard', 'Standard', 'lembar', 0, 2, 25000, 'MultiGraph Packaging & Printing'),
  ('MAT-LAKBAN-FRAGILE', 'supplies', 'Lakban Fragile & Bening', 'Standard', 'Standard', 'roll', 0, 2, 15000, 'MultiGraph Packaging & Printing')
ON CONFLICT (sku_item) DO UPDATE SET
  stock_qty = EXCLUDED.stock_qty,
  cost_per_unit = EXCLUDED.cost_per_unit,
  supplier = EXCLUDED.supplier,
  updated_at = NOW();

COMMIT;
