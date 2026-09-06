-- ====================================================================
-- TEESTOCK APPAREL — MIGRATION WAVE 3: VOUCHERS & PROMOTIONS
-- Project: Unified Business Hub (Prefix: ts_ untuk TeeStock)
-- Tanggal: September 2026
-- ====================================================================

-- 1. TABEL: ts_vouchers (Master Voucher & Kode Promo)
CREATE TABLE IF NOT EXISTS ts_vouchers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) UNIQUE NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    type VARCHAR(30) DEFAULT 'discount',       -- discount, free_shipping, partner_exclusive
    discount_type VARCHAR(20) DEFAULT 'percent', -- percent, fixed
    discount_value NUMERIC(12, 2) NOT NULL,    -- cth: 10 (10%) atau 15000 (Rp 15.000)
    min_order NUMERIC(12, 2) DEFAULT 0,        -- minimal belanja dalam rupiah
    max_discount NUMERIC(12, 2),               -- batas maksimal potongan rupiah jika percent
    usage_limit INT,                           -- batas total pemakaian kupon (null = unlimited)
    used_count INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    expires_at TIMESTAMPTZ,                    -- tanggal kadaluarsa (null = permanen)
    target_role VARCHAR(30) DEFAULT 'all',     -- all, member, partner
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. TABEL: ts_voucher_usage (Riwayat Penggunaan Voucher)
CREATE TABLE IF NOT EXISTS ts_voucher_usage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    voucher_id UUID REFERENCES ts_vouchers(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    order_id VARCHAR(50),
    discount_applied NUMERIC(12, 2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================
ALTER TABLE ts_vouchers ENABLE ROW LEVEL SECURITY;
ALTER TABLE ts_voucher_usage ENABLE ROW LEVEL SECURITY;

-- Policy ts_vouchers
DROP POLICY IF EXISTS "anon_read_active_vouchers" ON ts_vouchers;
DROP POLICY IF EXISTS "admin_manage_vouchers" ON ts_vouchers;

-- Publik & Member bisa membaca voucher yang sedang aktif untuk validasi kode di keranjang
CREATE POLICY "anon_read_active_vouchers" 
    ON ts_vouchers FOR SELECT 
    USING (is_active = true);

-- Admin dapat membaca, menambah, mengubah, dan menghapus seluruh voucher
CREATE POLICY "admin_manage_vouchers" 
    ON ts_vouchers FOR ALL 
    TO authenticated 
    USING (
        EXISTS (
            SELECT 1 FROM ts_user_profiles p 
            WHERE p.id = auth.uid() AND p.role = 'admin'
        )
    );

-- Policy ts_voucher_usage
DROP POLICY IF EXISTS "user_read_own_voucher_usage" ON ts_voucher_usage;
DROP POLICY IF EXISTS "auth_insert_voucher_usage" ON ts_voucher_usage;

-- Pengguna bisa melihat riwayat pemakaian voucher miliknya
CREATE POLICY "user_read_own_voucher_usage" 
    ON ts_voucher_usage FOR SELECT 
    USING (user_id = auth.uid());

-- Sistem/pengguna authenticated bisa insert pemakaian voucher saat checkout
CREATE POLICY "auth_insert_voucher_usage" 
    ON ts_voucher_usage FOR INSERT 
    WITH CHECK (true);

-- ====================================================================
-- SEED DATA AWAL: VOUCHER PELUNCURAN & PROMO TEESTOCK
-- ====================================================================
INSERT INTO ts_vouchers (code, title, description, type, discount_type, discount_value, min_order, target_role, is_active)
VALUES
('WELCOME10', 'Diskon Perdana 10%', 'Potongan 10% untuk pesanan perdana pelanggan baru', 'discount', 'percent', 10, 0, 'all', true),
('TEESTOCKDROP', 'Potongan Rp 10.000 Edisi Drop', 'Potongan Rp 10.000 untuk pembelian minimal Rp 89.000', 'discount', 'fixed', 10000, 89000, 'all', true),
('FREESHIP15', 'Subsidi Ongkir Rp 15.000', 'Gratis subsidi ongkos kirim Rp 15.000 dengan minimal belanja Rp 150.000', 'free_shipping', 'fixed', 15000, 150000, 'all', true),
('PARTNERVIP', 'Voucher Tambahan Mitra', 'Voucher ekstra Rp 5.000/pcs khusus partner dropshipper terverifikasi', 'partner_exclusive', 'fixed', 5000, 70000, 'partner', true)
ON CONFLICT (code) DO UPDATE SET
  title = EXCLUDED.title,
  discount_value = EXCLUDED.discount_value,
  min_order = EXCLUDED.min_order,
  is_active = EXCLUDED.is_active;

-- Selesai migrasi Wave 3 Vouchers
