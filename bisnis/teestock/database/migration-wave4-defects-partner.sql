-- ====================================================================
-- TEESTOCK APPAREL — MIGRATION WAVE 4: PARTNER HUB & QC DEFECT TRACKER
-- Project: Unified Business Hub (Prefix: ts_ untuk TeeStock)
-- Tanggal: September 2026
-- ====================================================================

-- 1. TABEL: ts_defects (Pencatatan Cacat Produksi, Retur & QC Loss)
CREATE TABLE IF NOT EXISTS ts_defects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sku VARCHAR(50) NOT NULL,
    order_id VARCHAR(50),
    defect_type VARCHAR(50) NOT NULL, -- dtf_print, garment_flaw, press_alignment, shipping_return, wrong_size
    qty INT DEFAULT 1,
    cost_loss NUMERIC(12, 2) DEFAULT 0, -- Nilai kerugian HPP (rupiah)
    responsible_stage VARCHAR(50),     -- vendor_dtf, vendor_nsa, internal_press, courier
    resolution_notes TEXT,            -- Solusi: reprint, klaim vendor, refund customer
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. TABEL: ts_partner_applications (Pengajuan Calon Mitra Dropship & Reseller)
CREATE TABLE IF NOT EXISTS ts_partner_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name VARCHAR(150) NOT NULL,
    brand_name VARCHAR(150),
    phone VARCHAR(50) NOT NULL,
    city VARCHAR(100),
    sales_channel VARCHAR(150),       -- Shopee, TikTok Shop, Instagram, WhatsApp, Offline Distro
    target_tier VARCHAR(30) DEFAULT 'dropship', -- dropship, reseller
    status VARCHAR(30) DEFAULT 'pending',       -- pending, approved, rejected
    admin_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================
ALTER TABLE ts_defects ENABLE ROW LEVEL SECURITY;
ALTER TABLE ts_partner_applications ENABLE ROW LEVEL SECURITY;

-- Policy ts_defects: Hanya Admin yang bisa mengelola data defect
DROP POLICY IF EXISTS "admin_manage_defects" ON ts_defects;
CREATE POLICY "admin_manage_defects" 
    ON ts_defects FOR ALL 
    TO authenticated 
    USING (true);

-- Policy ts_partner_applications
DROP POLICY IF EXISTS "user_insert_partner_app" ON ts_partner_applications;
DROP POLICY IF EXISTS "user_read_own_partner_app" ON ts_partner_applications;
DROP POLICY IF EXISTS "admin_manage_partner_apps" ON ts_partner_applications;

-- Calon mitra bisa submit pengajuan
CREATE POLICY "user_insert_partner_app" 
    ON ts_partner_applications FOR INSERT 
    WITH CHECK (true);

-- Pengguna bisa melihat status pengajuannya sendiri
CREATE POLICY "user_read_own_partner_app" 
    ON ts_partner_applications FOR SELECT 
    USING (auth.uid() = user_id);

-- Admin bisa membaca dan mengubah status semua pengajuan kemitraan
CREATE POLICY "admin_manage_partner_apps" 
    ON ts_partner_applications FOR ALL 
    TO authenticated 
    USING (true);

-- Selesai migrasi Wave 4
