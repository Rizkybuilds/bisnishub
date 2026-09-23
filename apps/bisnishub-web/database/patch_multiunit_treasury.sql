DO $$ BEGIN RAISE EXCEPTION 'Deprecated unsafe patch. Use database/migrations/20260922_audit_hardening.sql instead.'; END $$;
-- ==============================================================================
-- 🏛️ BISNISHUB OS & MULTIGRAPH HOLDING: MULTI-UNIT TREASURY & CFO UPGRADE
-- File: patch_multiunit_treasury.sql
-- 
-- Jalankan skrip ini di: Supabase Dashboard -> SQL Editor
-- 
-- Manfaat Patch Ini:
-- 1. Menambahkan kolom multi-unit ke ts_cash_ledger (business_unit, proof_receipt_ref, settlement_status)
-- 2. Memperluas jenis transaksi (INTER_TRANSFER, CAPITAL_INJECTION, FOUNDER_PRIVE)
-- 3. Mendaftarkan voucher peluncuran resmi FOUNDER30 ke ts_vouchers
-- 4. Memastikan RLS policy mengizinkan sinkronisasi dari BisnisHub OS
-- ==============================================================================

-- 1. UPDATE STRUKTUR TABEL ts_cash_ledger
-- ------------------------------------------------------------------------------
-- Hapus constraint type lama yang hanya mengizinkan CASH_IN & CASH_OUT
ALTER TABLE public.ts_cash_ledger DROP CONSTRAINT IF EXISTS ts_cash_ledger_type_check;

-- Tambahkan constraint type baru yang mendukung multi-unit treasury & transfer
ALTER TABLE public.ts_cash_ledger 
ADD CONSTRAINT ts_cash_ledger_type_check 
CHECK (type IN ('CASH_IN', 'CASH_OUT', 'INTER_TRANSFER', 'CAPITAL_INJECTION', 'FOUNDER_PRIVE'));

-- Tambahkan kolom identitas unit bisnis (teestock, multigraph, holding, founder)
ALTER TABLE public.ts_cash_ledger 
ADD COLUMN IF NOT EXISTS business_unit VARCHAR(50) DEFAULT 'teestock';

-- Tambahkan kolom bukti nota / kwitansi / nomor referensi mutasi
ALTER TABLE public.ts_cash_ledger 
ADD COLUMN IF NOT EXISTS proof_receipt_ref VARCHAR(100);

-- Tambahkan kolom status settlement (cleared / pending)
ALTER TABLE public.ts_cash_ledger 
ADD COLUMN IF NOT EXISTS settlement_status VARCHAR(20) DEFAULT 'cleared';

-- Buat indeks pencarian cepat untuk performa dashboard CFO
CREATE INDEX IF NOT EXISTS idx_ts_cash_ledger_business_unit ON public.ts_cash_ledger(business_unit);
CREATE INDEX IF NOT EXISTS idx_ts_cash_ledger_settlement ON public.ts_cash_ledger(settlement_status);

-- ------------------------------------------------------------------------------
-- 2. UPDATE KEAMANAN & RLS POLICY UNTUK ts_cash_ledger
-- ------------------------------------------------------------------------------
ALTER TABLE public.ts_cash_ledger ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "manage_cash_ledger_all" ON public.ts_cash_ledger;
DROP POLICY IF EXISTS "admin_all_cash_ledger" ON public.ts_cash_ledger;
DROP POLICY IF EXISTS "public_read_cash_ledger" ON public.ts_cash_ledger;

-- Izinkan pembacaan dan pencatatan kas dari BisnisHub OS
CREATE POLICY "manage_cash_ledger_all" ON public.ts_cash_ledger 
FOR ALL USING (true) WITH CHECK (true);

-- ------------------------------------------------------------------------------
-- 3. DAFTARKAN VOUCHER PELUNCURAN FOUNDER30 KE ts_vouchers
-- ------------------------------------------------------------------------------
INSERT INTO public.ts_vouchers (
    code,
    title,
    description,
    type,
    discount_type,
    discount_value,
    min_order,
    max_discount,
    usage_limit,
    used_count,
    is_active,
    target_role
)
VALUES (
    'FOUNDER30',
    'Apresiasi Founder Drop Rp 20.000 OFF',
    'Harga perdana Rp 79.000 khusus 30 pembeli pertama Drop #01 Origins',
    'discount',
    'fixed',
    20000,
    99000,
    20000,
    30,
    0,
    true,
    'all'
)
ON CONFLICT (code) DO UPDATE 
SET discount_value = 20000,
    min_order = 99000,
    usage_limit = 30,
    is_active = true;

-- ------------------------------------------------------------------------------
-- 4. INSERT DATA MUTASI AWAL MULTI-UNIT JIKA BELUM ADA
-- ------------------------------------------------------------------------------
INSERT INTO public.ts_cash_ledger (
    transaction_no, transaction_date, business_unit, type, category, amount, 
    source_account, destination_account, related_id, proof_receipt_ref, description, settlement_status
)
VALUES 
(
    'TX-CAP-001', '2026-09-10', 'teestock', 'CAPITAL_INJECTION', 'capital_injection', 5000000,
    'wallet_founder', 'wallet_teestock', 'FOUNDER-EQUITY-01', 'BCA-MUTASI-99011',
    'Injeksi modal kerja awal founder untuk peluncuran perdana TeeStock Batch #01', 'cleared'
),
(
    'TX-PRESS-01', '2026-09-10', 'teestock', 'CASH_OUT', 'capex_purchase', 2500000,
    'wallet_teestock', 'Vendor Mesin Heat Press', 'ASSET-PRESS-01', 'KWITANSI-MESIN-0821',
    'Pembelian Aset CAPEX: Mesin Heat Press High-Pressure 38x38 cm (155°C)', 'cleared'
),
(
    'TX-PO-NSA-01', '2026-09-12', 'teestock', 'CASH_OUT', 'blank_garment', 456000,
    'wallet_teestock', 'Cititex Rawamangun', 'PO-CITITEX-260901', 'NOTA-CITITEX-4412',
    'Belanja Bahan: 12 pcs NSA Heavyweight 24s (Hitam & Putih L/XL)', 'cleared'
),
(
    'TX-DTF-01', '2026-09-13', 'teestock', 'CASH_OUT', 'dtf_printing', 140000,
    'wallet_teestock', 'Cahaya Digital DTF Senen', 'PO-DTF-260901', 'NOTA-DTF-0912',
    'Cetak DTF Roll 58 cm x 4 meter (Artwork Drop #01 Origins)', 'cleared'
),
(
    'TX-INTER-001', '2026-09-14', 'teestock', 'INTER_TRANSFER', 'unboxing_packaging', 60000,
    'wallet_teestock', 'wallet_multigraph', 'MG-INVOICE-001', 'BH-INTER-TRANSFER-01',
    'Pembayaran paket unboxing kemasan (20 pack: hangtag 310gsm, stiker vinyl, polymailer) ke MultiGraph', 'cleared'
),
(
    'TX-MAT-MG-01', '2026-09-14', 'multigraph', 'CASH_OUT', 'raw_materials_packaging', 95000,
    'wallet_multigraph', 'Toko Kemasan Grosir Mangga Dua', 'PO-MG-POLY-01', 'INV-SHOPEE-8891',
    'Belanja Bahan Baku: 100 pcs Polymailer Hitam Doff 30x40 cm & isolasi segel', 'cleared'
),
(
    'TX-ORD-TS-1001', '2026-09-15', 'teestock', 'CASH_IN', 'sales_retail', 198000,
    'Midtrans QRIS (Settlement H+1)', 'wallet_teestock', 'TS-2026-0901', 'MIDTRANS-SETTLE-8819',
    'Penjualan Web: 2x Kaos Raw Identity Origins L/XL (Bima Arya Pratama)', 'cleared'
),
(
    'TX-B2B-MG-01', '2026-09-15', 'multigraph', 'CASH_IN', 'b2b_packaging_dp', 150000,
    'Transfer Mandiri Klien B2B', 'wallet_multigraph', 'MG-ORDER-B2B-001', 'MUTASI-MANDIRI-449',
    'DP 50% Cetak 200 pcs Stiker Vinyl Die-Cut Kopi Titik Temu', 'cleared'
)
ON CONFLICT (transaction_no) DO NOTHING;
