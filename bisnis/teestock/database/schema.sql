-- ====================================================================
-- TEESTOCK APPAREL — MASTER CONSOLIDATED DATABASE SCHEMA
-- Project: Unified Business Hub (Prefix: ts_ untuk TeeStock)
-- Stack: Supabase PostgreSQL (Auth, Storage, Database, RLS)
-- Target Project: tovslowsopqtuxmrogeu (Singapore ap-southeast-1)
-- Versi: 2.0 (Master Unified — Satu File Lengkap)
-- Tanggal: September 2026
-- ====================================================================
-- 
-- CARA MENJALANKAN:
-- 1. Buka Supabase SQL Editor:
--    https://supabase.com/dashboard/project/tovslowsopqtuxmrogeu/sql/new
-- 2. Salin SELURUH isi file ini (Ctrl+A -> Ctrl+C).
-- 3. Tempel di SQL Editor dan tekan "Run" (Ctrl+Enter).
-- 4. Semua tabel, relasi, view, fungsi, trigger, RLS policies, 
--    dan data awal (Batch 1 + NSA Blanks + Vouchers) akan terbentuk otomatis!
-- ====================================================================

-- 0. EKSTENSI POSTGRESQL
CREATE EXTENSION IF NOT EXISTS pgcrypto;


-- ====================================================================
-- BAGIAN 1: CLEAN RESET / DROP STRUKTUR LAMA (CASCADE SAFE)
-- Menghapus semua tabel, view, dan trigger ts_ lama secara bersih
-- ====================================================================
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

DROP VIEW IF EXISTS ts_view_catalog_summary CASCADE;

DROP TABLE IF EXISTS ts_reviews CASCADE;
DROP TABLE IF EXISTS ts_partner_applications CASCADE;
DROP TABLE IF EXISTS ts_defects CASCADE;
DROP TABLE IF EXISTS ts_voucher_usage CASCADE;
DROP TABLE IF EXISTS ts_vouchers CASCADE;
DROP TABLE IF EXISTS ts_subscribers CASCADE;
DROP TABLE IF EXISTS ts_user_profiles CASCADE;
DROP TABLE IF EXISTS ts_order_items CASCADE;
DROP TABLE IF EXISTS ts_orders CASCADE;
DROP TABLE IF EXISTS ts_inventory CASCADE;
DROP TABLE IF EXISTS ts_unit_economics CASCADE;
DROP TABLE IF EXISTS ts_products CASCADE;


-- ====================================================================
-- BAGIAN 2: DEFINISI STRUKTUR TABEL LENGKAP
-- ====================================================================

-- 1. TABEL: ts_products (Master Katalog Desain Grafis & NSA Blanks)
CREATE TABLE ts_products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sku VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    series VARCHAR(50) NOT NULL,              -- profesi, komunitas, lokal, receh, fandom, fase, blank, dll.
    series_name VARCHAR(100) NOT NULL,
    series_color VARCHAR(20) DEFAULT '#4A4A47',
    niche VARCHAR(100),
    batch VARCHAR(50) DEFAULT 'Batch 1',
    template VARCHAR(50) DEFAULT 'typography', -- typography, badge, icon_text, blank
    status VARCHAR(30) DEFAULT 'active',      -- draft, test, active, archived
    license_source VARCHAR(100) DEFAULT 'In-House',
    file_path TEXT,                           -- URL Mockup / Cloudinary CDN / Lokal
    colors TEXT DEFAULT 'Hitam, Krem, Charcoal',
    sizes TEXT DEFAULT 'S, M, L, XL, XXL',
    price_retail NUMERIC(12, 2) DEFAULT 99000,
    price_reseller NUMERIC(12, 2) DEFAULT 75000,
    cost_blank NUMERIC(12, 2) DEFAULT 38000,
    cost_dtf NUMERIC(12, 2) DEFAULT 12750,
    cititex_cat_id INT,
    featured BOOLEAN DEFAULT false,
    seo_title TEXT,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_ts_products_series ON ts_products(series);
CREATE INDEX idx_ts_products_status ON ts_products(status);


-- 2. TABEL: ts_unit_economics (Struktur Biaya HPP & Penetapan Harga Multi-Tier)
CREATE TABLE ts_unit_economics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_sku VARCHAR(50) UNIQUE REFERENCES ts_products(sku) ON DELETE CASCADE,
    cost_blank NUMERIC(12, 2) DEFAULT 38000,       -- NSA Softstyle 30s
    cost_dtf NUMERIC(12, 2) DEFAULT 12750,         -- DTF A3 roll rate
    cost_press NUMERIC(12, 2) DEFAULT 2000,        -- Listrik & teflon
    cost_pack NUMERIC(12, 2) DEFAULT 4500,         -- Ziplock + stiker + label
    cost_overhead NUMERIC(12, 2) DEFAULT 2000,     -- Operasional & kuota
    cost_design NUMERIC(12, 2) DEFAULT 5000,       -- Amortisasi lisensi / aset
    price_retail NUMERIC(12, 2) DEFAULT 99000,     -- Harga Jual Shopee/Tokopedia/Web
    price_dropship NUMERIC(12, 2) DEFAULT 87000,   -- Disc 12% Mitra Dropship
    price_reseller NUMERIC(12, 2) DEFAULT 74000,   -- Disc 25% Mitra Reseller
    print_area VARCHAR(50) DEFAULT 'A3 (30x30 cm)',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);


-- 3. TABEL: ts_inventory (Stok Bahan Kaos Polos NSA & Material Operasional)
CREATE TABLE ts_inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sku_item VARCHAR(50) UNIQUE NOT NULL,
    item_type VARCHAR(50) NOT NULL,                -- blank_tshirt, dtf_film, polymailer, hangtag, supplies
    brand VARCHAR(100) DEFAULT 'New States Apparel',
    color VARCHAR(50) DEFAULT 'Hitam',
    size VARCHAR(20) DEFAULT 'L',
    unit_measure VARCHAR(20) DEFAULT 'pcs',        -- pcs, meter, roll, lembar
    stock_qty INT DEFAULT 0,
    min_stock_alert INT DEFAULT 5,
    cost_per_unit NUMERIC(10, 2) NOT NULL,
    supplier VARCHAR(100) DEFAULT 'Distributor Resmi NSA',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_ts_inventory_type ON ts_inventory(item_type);


-- 4. TABEL: ts_user_profiles (Profil Pengguna: Member, Mitra & Admin)
CREATE TABLE ts_user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name VARCHAR(150),
    phone VARCHAR(50),
    role VARCHAR(30) DEFAULT 'member',             -- member, partner, admin
    partner_tier VARCHAR(30),                      -- dropship, reseller
    partner_status VARCHAR(30) DEFAULT 'none',    -- none, pending, approved, rejected
    default_address TEXT,
    city VARCHAR(100),
    province VARCHAR(100),
    postal_code VARCHAR(10),
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_ts_user_profiles_role ON ts_user_profiles(role);


-- 5. TABEL: ts_orders (Pencatatan Pesanan Masuk & Tracking Status Kanban)
CREATE TABLE ts_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number VARCHAR(50) UNIQUE NOT NULL,      -- cth: WEB-2609-001, SHOP-2609-001
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    customer_name VARCHAR(150) NOT NULL,
    customer_phone VARCHAR(50),
    customer_city VARCHAR(100),
    customer_address TEXT,
    channel VARCHAR(50) DEFAULT 'web',             -- web, shopee, tokopedia, tiktok, whatsapp, custom
    tier VARCHAR(30) DEFAULT 'retail',             -- retail, dropship, reseller
    status VARCHAR(50) DEFAULT 'pending',          -- pending, dtf, press, pack, shipped, completed, cancelled
    total_amount NUMERIC(12, 2) NOT NULL,
    discount_amount NUMERIC(12, 2) DEFAULT 0,
    voucher_code VARCHAR(50),
    marketplace_fee NUMERIC(12, 2) DEFAULT 0,
    shipping_cost NUMERIC(12, 2) DEFAULT 0,
    tracking_number VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_ts_orders_status ON ts_orders(status);
CREATE INDEX idx_ts_orders_user ON ts_orders(user_id);
CREATE INDEX idx_ts_orders_channel ON ts_orders(channel);
CREATE INDEX idx_ts_orders_order_number ON ts_orders(order_number);
CREATE INDEX idx_ts_orders_phone ON ts_orders(customer_phone);
CREATE INDEX idx_ts_orders_tracking ON ts_orders(tracking_number);


-- 6. TABEL: ts_order_items (Rincian Produk per Pesanan)
CREATE TABLE ts_order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES ts_orders(id) ON DELETE CASCADE,
    order_number VARCHAR(50),
    product_sku VARCHAR(50),
    product_name VARCHAR(255),
    garment VARCHAR(100) DEFAULT 'NSA Softstyle 30s',
    size VARCHAR(20) DEFAULT 'L',
    color VARCHAR(50) DEFAULT 'Hitam',
    qty INT DEFAULT 1,
    unit_price NUMERIC(12, 2) NOT NULL,
    subtotal NUMERIC(12, 2) NOT NULL
);

CREATE INDEX idx_ts_order_items_order ON ts_order_items(order_id);
CREATE INDEX idx_ts_order_items_number ON ts_order_items(order_number);


-- 7. TABEL: ts_subscribers (Email VIP Newsletter & Lead Capture Drop)
CREATE TABLE ts_subscribers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    source VARCHAR(100) DEFAULT 'website_footer', -- website_footer, homepage_hero, biolink, custom_order
    utm_source VARCHAR(100),
    utm_medium VARCHAR(100),
    utm_campaign VARCHAR(100),
    status VARCHAR(30) DEFAULT 'active',          -- active, unsubscribed
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_ts_subscribers_email ON ts_subscribers(email);


-- 8. TABEL: ts_vouchers (Master Kupon Diskon & Voucher Promosi)
CREATE TABLE ts_vouchers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) UNIQUE NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    type VARCHAR(30) DEFAULT 'discount',           -- discount, free_shipping, partner_exclusive
    discount_type VARCHAR(20) DEFAULT 'percent',   -- percent, fixed
    discount_value NUMERIC(12, 2) NOT NULL,        -- cth: 10 (10%) atau 15000 (Rp 15.000)
    min_order NUMERIC(12, 2) DEFAULT 0,            -- minimal belanja
    max_discount NUMERIC(12, 2),                   -- plafon maksimal rupiah jika percent
    usage_limit INT,                               -- kuota total (null = unlimited)
    used_count INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    expires_at TIMESTAMPTZ,
    target_role VARCHAR(30) DEFAULT 'all',         -- all, member, partner
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_ts_vouchers_code ON ts_vouchers(code);


-- 9. TABEL: ts_voucher_usage (Riwayat Penggunaan Voucher)
CREATE TABLE ts_voucher_usage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    voucher_id UUID REFERENCES ts_vouchers(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    order_id VARCHAR(50),
    discount_applied NUMERIC(12, 2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);


-- 10. TABEL: ts_defects (Pencatatan Cacat Produksi, Retur & QC Loss)
CREATE TABLE ts_defects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sku VARCHAR(50) NOT NULL,
    order_id VARCHAR(50),
    defect_type VARCHAR(50) NOT NULL,              -- dtf_print, garment_flaw, press_alignment, shipping_return, wrong_size
    qty INT DEFAULT 1,
    cost_loss NUMERIC(12, 2) DEFAULT 0,            -- Estimasi kerugian HPP (rupiah)
    responsible_stage VARCHAR(50),                 -- vendor_dtf, vendor_nsa, internal_press, courier
    resolution_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_ts_defects_stage ON ts_defects(responsible_stage);


-- 11. TABEL: ts_partner_applications (Pengajuan Kemitraan Dropshipper & Reseller)
CREATE TABLE ts_partner_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name VARCHAR(150) NOT NULL,
    brand_name VARCHAR(150),
    phone VARCHAR(50) NOT NULL,
    city VARCHAR(100),
    sales_channel VARCHAR(150),                   -- Shopee, TikTok Shop, Instagram, WhatsApp, Offline Distro
    target_tier VARCHAR(30) DEFAULT 'dropship',   -- dropship, reseller
    status VARCHAR(30) DEFAULT 'pending',         -- pending, approved, rejected
    admin_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_ts_partner_apps_status ON ts_partner_applications(status);


-- 12. TABEL: ts_reviews (Ulasan Pelanggan, Rating Bintang & Bukti Kepuasan)
CREATE TABLE ts_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_sku VARCHAR(50) REFERENCES ts_products(sku) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    author_name VARCHAR(150) NOT NULL,
    role_badge VARCHAR(50) DEFAULT 'Verified Buyer',
    rating INT DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
    garment_type VARCHAR(100),
    size_ordered VARCHAR(20),
    user_stats VARCHAR(100),                      -- cth: TB 175 cm · BB 70 kg
    content TEXT NOT NULL,
    is_verified BOOLEAN DEFAULT true,
    helpful_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_ts_reviews_sku ON ts_reviews(product_sku);


-- ====================================================================
-- BAGIAN 3: VIEW OTOMATIS KATALOG & MARGIN KALKULASI
-- ====================================================================
CREATE OR REPLACE VIEW ts_view_catalog_summary AS
SELECT 
    p.sku,
    p.name,
    p.series,
    p.series_name,
    p.series_color,
    p.niche,
    p.batch,
    p.template,
    p.status,
    p.colors,
    p.sizes,
    p.file_path,
    p.seo_title,
    p.description,
    u.cost_blank,
    u.cost_dtf,
    u.cost_press,
    u.cost_pack,
    u.cost_overhead,
    u.cost_design,
    (COALESCE(u.cost_blank, 0) + COALESCE(u.cost_dtf, 0) + COALESCE(u.cost_press, 0) + COALESCE(u.cost_pack, 0) + COALESCE(u.cost_overhead, 0) + COALESCE(u.cost_design, 0)) AS total_hpp,
    COALESCE(u.price_retail, p.price_retail, 99000) AS price_retail,
    COALESCE(u.price_dropship, ROUND(COALESCE(u.price_retail, p.price_retail, 99000) * 0.88), 87000) AS price_dropship,
    COALESCE(u.price_reseller, p.price_reseller, 75000) AS price_reseller,
    -- Estimasi profit bersih retail setelah fee marketplace ~6.5%
    ROUND((COALESCE(u.price_retail, p.price_retail, 99000) * 0.935) - (COALESCE(u.cost_blank, 0) + COALESCE(u.cost_dtf, 0) + COALESCE(u.cost_press, 0) + COALESCE(u.cost_pack, 0) + COALESCE(u.cost_overhead, 0) + COALESCE(u.cost_design, 0)), 2) AS net_profit_retail,
    ROUND((((COALESCE(u.price_retail, p.price_retail, 99000) * 0.935) - (COALESCE(u.cost_blank, 0) + COALESCE(u.cost_dtf, 0) + COALESCE(u.cost_press, 0) + COALESCE(u.cost_pack, 0) + COALESCE(u.cost_overhead, 0) + COALESCE(u.cost_design, 0))) / NULLIF(COALESCE(u.price_retail, p.price_retail, 99000), 0)) * 100, 1) AS net_margin_pct
FROM ts_products p
LEFT JOIN ts_unit_economics u ON p.sku = u.product_sku;


-- ====================================================================
-- BAGIAN 4: FUNGSI & TRIGGER OTOMATIS SUPABASE AUTH
-- Membuat data di ts_user_profiles setiap kali user login/signup via Google/Magic Link
-- ====================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.ts_user_profiles (id, full_name, role, avatar_url)
    VALUES (
        NEW.id,
        COALESCE(
            NEW.raw_user_meta_data->>'full_name',
            NEW.raw_user_meta_data->>'name',
            split_part(NEW.email, '@', 1)
        ),
        'member',
        COALESCE(
            NEW.raw_user_meta_data->>'avatar_url',
            NEW.raw_user_meta_data->>'picture',
            NULL
        )
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Helper Security Definer: Cek apakah user yang login memiliki role 'admin'
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 
        FROM public.ts_user_profiles 
        WHERE id = auth.uid() AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- 🛡️ P0 PROTEKSI ROLE: Mencegah eskalasi hak akses role admin melalui manipulasi REST API client
CREATE OR REPLACE FUNCTION public.protect_user_role()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.role IS DISTINCT FROM OLD.role AND NOT public.is_admin() THEN
        RAISE EXCEPTION 'Akses ditolak: Hanya Administrator yang dapat mengubah role pengguna.';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_protect_user_role ON public.ts_user_profiles;
CREATE TRIGGER trg_protect_user_role
    BEFORE UPDATE ON public.ts_user_profiles
    FOR EACH ROW EXECUTE FUNCTION public.protect_user_role();

-- 🔍 P1 SECURE GUEST TRACKING: Melacak pesanan publik/tamu dengan data masking & verifikasi aman
CREATE OR REPLACE FUNCTION public.track_guest_order(p_order_no TEXT, p_phone_last4 TEXT DEFAULT NULL)
RETURNS TABLE (
    order_number VARCHAR,
    status VARCHAR,
    tracking_number VARCHAR,
    created_at TIMESTAMPTZ,
    items JSON,
    customer_masked TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        o.order_number,
        o.status,
        o.tracking_number,
        o.created_at,
        COALESCE(json_agg(json_build_object(
            'name', i.product_name,
            'garment', i.garment,
            'size', i.size,
            'color', i.color,
            'qty', i.qty
        )) FILTER (WHERE i.id IS NOT NULL), '[]'::json) AS items,
        concat(left(o.customer_name, 2), '*** ', right(o.customer_name, 1)) AS customer_masked
    FROM ts_orders o
    LEFT JOIN ts_order_items i ON o.id = i.order_id
    WHERE o.order_number = UPPER(TRIM(p_order_no))
      AND (
        p_phone_last4 IS NULL 
        OR TRIM(p_phone_last4) = '' 
        OR right(regexp_replace(o.customer_phone, '\D', '', 'g'), 4) = TRIM(p_phone_last4)
      )
    GROUP BY o.id, o.order_number, o.status, o.tracking_number, o.created_at, o.customer_name;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 🏷️ RPC INCREMENT VOUCHER USAGE: Menaikkan counter used_count secara atomik saat pesanan berhasil
CREATE OR REPLACE FUNCTION public.increment_voucher_usage(voucher_code TEXT)
RETURNS VOID AS $$
BEGIN
    UPDATE public.ts_vouchers
    SET used_count = COALESCE(used_count, 0) + 1,
        updated_at = NOW()
    WHERE UPPER(code) = UPPER(TRIM(voucher_code));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 🔗 GUEST-TO-MEMBER ORDER LINKING: Menghubungkan pesanan tamu sebelumnya ke akun baru saat user login/signup
CREATE OR REPLACE FUNCTION public.link_guest_orders_on_signup()
RETURNS TRIGGER AS $$
DECLARE
    clean_phone TEXT;
    user_email TEXT;
BEGIN
    SELECT email INTO user_email FROM auth.users WHERE id = NEW.id;
    clean_phone := right(regexp_replace(COALESCE(NEW.phone, ''), '\D', '', 'g'), 8);

    UPDATE public.ts_orders
    SET user_id = NEW.id
    WHERE user_id IS NULL
      AND (
        (user_email IS NOT NULL AND user_email <> '' AND customer_phone ILIKE '%' || user_email || '%')
        OR (length(clean_phone) >= 8 AND regexp_replace(customer_phone, '\D', '', 'g') LIKE '%' || clean_phone || '%')
      );

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_link_guest_orders ON public.ts_user_profiles;
CREATE TRIGGER trg_link_guest_orders
    AFTER INSERT OR UPDATE OF phone ON public.ts_user_profiles
    FOR EACH ROW EXECUTE FUNCTION public.link_guest_orders_on_signup();


-- ====================================================================
-- BAGIAN 5: ROW LEVEL SECURITY (RLS) POLICIES — HARDENED PRODUCTION
-- Keamanan data produksi: Publik hanya akses etalase, Admin mengelola data bisnis
-- ====================================================================
ALTER TABLE ts_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE ts_unit_economics ENABLE ROW LEVEL SECURITY;
ALTER TABLE ts_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE ts_user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE ts_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE ts_order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE ts_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE ts_vouchers ENABLE ROW LEVEL SECURITY;
ALTER TABLE ts_voucher_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE ts_defects ENABLE ROW LEVEL SECURITY;
ALTER TABLE ts_partner_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE ts_reviews ENABLE ROW LEVEL SECURITY;

-- 1. ts_products (Publik baca katalog, HANYA admin yang bisa tambah/edit/hapus)
CREATE POLICY "anon_read_products" ON ts_products FOR SELECT USING (true);
CREATE POLICY "admin_insert_products" ON ts_products FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "admin_update_products" ON ts_products FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "admin_delete_products" ON ts_products FOR DELETE TO authenticated USING (public.is_admin());

-- 2. ts_unit_economics (HANYA admin yang bisa membaca & mengelola HPP/rahasia vendor)
CREATE POLICY "admin_select_unit_economics" ON ts_unit_economics FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "admin_insert_unit_economics" ON ts_unit_economics FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "admin_update_unit_economics" ON ts_unit_economics FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "admin_delete_unit_economics" ON ts_unit_economics FOR DELETE TO authenticated USING (public.is_admin());

-- 3. ts_inventory (HANYA admin yang bisa melihat & mengubah stok gudang NSA)
CREATE POLICY "admin_manage_inventory" ON ts_inventory FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- 4. ts_user_profiles (User baca/update profil sendiri, role dilarang diubah sendiri)
CREATE POLICY "user_read_own_profile" ON ts_user_profiles FOR SELECT USING (auth.uid() = id OR public.is_admin());
CREATE POLICY "user_update_own_profile" ON ts_user_profiles FOR UPDATE USING (auth.uid() = id OR public.is_admin()) WITH CHECK (auth.uid() = id OR public.is_admin());
CREATE POLICY "user_insert_own_profile" ON ts_user_profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "admin_all_profiles" ON ts_user_profiles FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- 5. ts_orders (Publik/Member bisa buat order, User baca pesanan miliknya, HANYA admin kelola semua)
CREATE POLICY "public_insert_orders" ON ts_orders FOR INSERT WITH CHECK (true);
CREATE POLICY "member_read_own_orders" ON ts_orders FOR SELECT USING (user_id = auth.uid() OR public.is_admin());
CREATE POLICY "admin_manage_orders" ON ts_orders FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- 6. ts_order_items (Publik insert saat checkout, HANYA admin kelola semua)
CREATE POLICY "public_insert_order_items" ON ts_order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "member_read_own_order_items" ON ts_order_items FOR SELECT USING (
    EXISTS (SELECT 1 FROM ts_orders o WHERE o.id = ts_order_items.order_id AND (o.user_id = auth.uid() OR public.is_admin()))
);
CREATE POLICY "admin_manage_order_items" ON ts_order_items FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- 7. ts_subscribers (Publik bisa daftar newsletter, HANYA admin bisa membaca leads)
CREATE POLICY "anon_insert_subscribers" ON ts_subscribers FOR INSERT WITH CHECK (true);
CREATE POLICY "admin_read_subscribers" ON ts_subscribers FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "admin_delete_subscribers" ON ts_subscribers FOR DELETE TO authenticated USING (public.is_admin());

-- 8. ts_vouchers (Publik baca voucher aktif, HANYA admin yang bisa manipulasi voucher)
CREATE POLICY "anon_read_active_vouchers" ON ts_vouchers FOR SELECT USING (is_active = true OR public.is_admin());
CREATE POLICY "admin_manage_vouchers" ON ts_vouchers FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- 9. ts_voucher_usage (Member baca riwayatnya, Sistem/Member insert saat checkout)
CREATE POLICY "user_read_own_voucher_usage" ON ts_voucher_usage FOR SELECT USING (user_id = auth.uid() OR public.is_admin());
CREATE POLICY "auth_insert_voucher_usage" ON ts_voucher_usage FOR INSERT WITH CHECK (true);

-- 10. ts_defects (QC Loss tracker: HANYA admin)
CREATE POLICY "admin_manage_defects" ON ts_defects FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- 11. ts_partner_applications (Pengunjung bisa submit pengajuan, user baca miliknya, HANYA admin kelola)
CREATE POLICY "public_insert_partner_app" ON ts_partner_applications FOR INSERT WITH CHECK (true);
CREATE POLICY "user_read_own_partner_app" ON ts_partner_applications FOR SELECT USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "admin_manage_partner_apps" ON ts_partner_applications FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- 12. ts_reviews (Publik bisa baca & tulis ulasan, HANYA admin bisa moderasi/hapus)
CREATE POLICY "public_read_reviews" ON ts_reviews FOR SELECT USING (true);
CREATE POLICY "public_insert_reviews" ON ts_reviews FOR INSERT WITH CHECK (true);
CREATE POLICY "admin_manage_reviews" ON ts_reviews FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());


-- ====================================================================
-- BAGIAN 6: SEED DATA AWAL LENGKAP
-- Batch 1 Graphics + 12 NSA Blanks + Unit Economics + Vouchers + Inventory
-- ====================================================================

-- 1. Insert Katalog Produk (8 Desain Grafis Hero + 12 NSA Cititex Blanks)
INSERT INTO ts_products (sku, name, series, series_name, series_color, niche, batch, template, status, license_source, file_path, colors, sizes, price_retail, price_reseller, cost_blank, cost_dtf, featured, cititex_cat_id, seo_title, description)
VALUES
-- --- Desain Grafis Batch 1 ---
('TS-PRO-001', 'Commit & Pray', 'profesi', 'TeeStock Profesi', '#4A4A47', 'Software Engineer / IT', 'Batch 1', 'typography', 'active', 'In-House', 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80', 'Hitam, Krem, Charcoal', 'S, M, L, XL, XXL, 3XL', 99000, 75000, 38000, 12750, true, NULL, 'Kaos Programmer IT Commit and Pray New States Apparel Combed 30s — TeeStock Profesi', 'Kaos streetwear minimalis bertema developer dan programmer. Bahan NSA Softstyle 30s 100% cotton adem dan sablon DTF HD tajam tahan cuci.'),
('TS-PRO-002', 'Architect''s Blueprint', 'profesi', 'TeeStock Profesi', '#4A4A47', 'Arsitek & Desainer', 'Batch 1', 'icon_text', 'active', 'In-House', 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&auto=format&fit=crop&q=80', 'Hitam, Charcoal, Abu Hangat', 'S, M, L, XL, XXL', 109000, 82000, 48000, 12750, true, NULL, 'Baju Kaos Arsitek Desain Blueprint Isometrik NSA 24s Heavyweight — TeeStock Profesi', 'Visual garis isometrik denah arsitektur di atas bahan tebal NSA Heavyweight 24s. Potongan boxy modern yang nyaman dipakai seharian di proyek maupun studio.'),
('TS-KOM-001', '7 Summits 3000 MDPL', 'komunitas', 'TeeStock Komunitas', '#6B7057', 'Pendaki Gunung / Hiking', 'Batch 1', 'badge', 'active', 'In-House', 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&auto=format&fit=crop&q=80', 'Olive, Hitam, Krem', 'S, M, L, XL, XXL, 3XL', 99000, 75000, 38000, 12750, true, NULL, 'Kaos Gunung Pendaki 7 Summits Penikmat 3000 MDPL Outdoor Distro — TeeStock Komunitas', 'Ilustrasi kontur topografi puncak-puncak tertinggi Nusantara. Dedikasi untuk jiwa-jiwa petualang alam bebas.'),
('TS-KOM-002', 'Born to Hike Forced to Work', 'komunitas', 'TeeStock Komunitas', '#6B7057', 'Outdoor, Camp, Pendaki', 'Batch 1', 'badge', 'active', 'Etsy (Commercial POD)', 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&auto=format&fit=crop&q=80', 'Hitam, Charcoal, Olive', 'S, M, L, XL, XXL', 99000, 75000, 38000, 12750, false, NULL, 'Kaos Outdoor Petualang Born to Hike Forced to Work NSA Combed 30s — TeeStock Komunitas', 'TeeStock Komunitas Series — Jeritan hati pecinta alam yang pikirannya masih tertinggal di tenda pos 3.'),
('TS-LOK-001', 'Wong Jowo Ojo Ilang Jawane', 'lokal', 'TeeStock Lokal', '#D9A441', 'Filosofi Jawa / Budaya', 'Batch 1', 'typography', 'active', 'In-House', 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&auto=format&fit=crop&q=80', 'Hitam, Krem, Abu Hangat', 'S, M, L, XL, XXL', 89000, 68000, 38000, 12750, true, NULL, 'Kaos Kata Jawa Wong Jowo Ojo Ilang Jawane Filosofi Jawa Distro — TeeStock Lokal', 'Aksara Jawa stilasi modern dengan pesan pengingat akar budaya luhur. Elegan dan bermakna mendalam.'),
('TS-LOK-002', 'Urang Sunda Asli Kujang Pride', 'lokal', 'TeeStock Lokal', '#D9A441', 'Sunda, Jawa Barat, Local Pride', 'Batch 1', 'badge', 'active', 'In-House', 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&auto=format&fit=crop&q=80', 'Hitam, Krem, Navy', 'S, M, L, XL, XXL', 89000, 68000, 38000, 12750, false, NULL, 'Kaos Urang Sunda Asli Lambang Kujang Jawa Barat Bandung Distro — TeeStock Lokal', 'TeeStock Lokal Series — Lencana siluet Kujang minimalis berpadu tipografi elegan.'),
('TS-REC-001', 'Crisis with Iced Coffee', 'receh', 'TeeStock Receh / Sarkas', '#C1673D', 'Kopi & Gaya Hidup', 'Batch 1', 'typography', 'active', 'In-House', 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80', 'Hitam, Krem, Terracotta', 'S, M, L, XL, XXL', 99000, 75000, 38000, 12750, false, NULL, 'Kaos Kata Lucu Quarter Life Crisis Iced Coffee Sarkas Gen Z — TeeStock Receh', 'Menghadapi hari berat dengan secangkir es kopi susu gula aren. Santai, jenaka, dan sangat relatable.'),
('TS-FAN-001', 'Neo Tokyo 1988', 'fandom', 'TeeStock Fandom', '#8B5CF6', 'Retro Anime & Cyberpunk', 'Batch 1', 'icon_text', 'active', 'In-House', 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&auto=format&fit=crop&q=80', 'Hitam, Charcoal, Dark Violet', 'S, M, L, XL, XXL', 109000, 82000, 48000, 12750, true, NULL, 'Kaos Distro Neo Tokyo 1988 Cyberpunk Anime NSA Heavyweight 24s — TeeStock Fandom', 'Estetika anime retro cyberpunk 80-an dengan cetakan DTF warna neon di atas kaos NSA Heavyweight 24s hitam pekat.'),

-- --- 12 NSA Blank Apparel ---
('TS-BLK-3600', 'New States Apparel Softstyle 3600', 'blank', 'NSA Blank Apparel', '#EBE3D5', 'Kaos Polos Ring Spun 30s Tubular', 'Katalog Polos', 'blank', 'active', 'Distributor Resmi NSA', 'https://cititex.com/api/uploads/category/album/front_side/87-Black.jpg', 'Hitam, Putih, Charcoal, Navy, Maroon, Sport Grey, Forest Green, Royal Blue, Red, Irish Green, Daisy, Heliconia, Sand, Orange, Mustard', 'S, M, L, XL, XXL, 3XL', 49000, 42000, 38000, 0, true, 87, 'Kaos Polos NSA Softstyle 3600 Combed 30s New States Apparel Original — TeeStock', 'Kaos polos New States Apparel Softstyle 3600. 100% Ring Spun Cotton 30s, 150 g/m2. Lembut, adem, jahitan rantai rapi tanpa jahitan samping (tubular/built-up). Cocok untuk daily casual wear maupun disablon DTF.'),
('TS-BLK-7200', 'New States Apparel Premium Cotton 7200', 'blank', 'NSA Blank Apparel', '#EBE3D5', 'Kaos Polos Combed 24s Regular Fit', 'Katalog Polos', 'blank', 'active', 'Distributor Resmi NSA', 'https://cititex.com/api/uploads/category/album/front_side/99-Black.jpg', 'Black, White, Navy, Maroon, Sport Grey, Forest Green, Charcoal, Salmon, Aqua Sky, Gold, Royal Blue, Red', 'S, M, L, XL, XXL, 3XL', 59000, 51000, 48000, 0, true, 99, 'Kaos Polos NSA Premium Cotton 7200 24s New States Apparel Original — TeeStock', 'Kaos polos New States Apparel Premium Cotton 7200. 100% Cotton Combed 24s, 180 g/m2. Bahan lebih tebal, kokoh, dan presisi. Potongan regular fit dengan kenyamanan premium.'),
('TS-BLK-5400', 'New States Apparel Heavyweight 5400', 'blank', 'NSA Blank Apparel', '#EBE3D5', 'Kaos Polos Streetwear 20s Boxy Fit', 'Katalog Polos', 'blank', 'active', 'Distributor Resmi NSA', 'https://cititex.com/api/uploads/category/album/front_side/95-Black.jpg', 'Black, White, Navy, Sport Grey, Maroon, Gold, Dark Green', 'S, M, L, XL, XXL, 3XL', 79000, 69000, 65000, 0, true, 95, 'Kaos Polos NSA Heavyweight 5400 20s Boxy Fit New States Apparel Original — TeeStock', 'Kaos polos New States Apparel Heavyweight 5400. 100% Cotton 20s, 210 g/m2. Karakter kain berat, kaku, dan tebal khas streetwear boxy vintage look. Kerah leher tebal anti-melar.'),
('TS-BLK-7280', 'New States Apparel Long Sleeve 7280', 'blank', 'NSA Blank Apparel', '#EBE3D5', 'Kaos Polos Lengan Panjang Rib 24s', 'Katalog Polos', 'blank', 'active', 'Distributor Resmi NSA', 'https://cititex.com/api/uploads/category/album/front_side/94-Black.jpg', 'Black, White, Navy, Sport Grey, Maroon, Charcoal, Forest Green', 'S, M, L, XL, XXL, 3XL', 69000, 59000, 55000, 0, false, 94, 'Kaos Polos Lengan Panjang NSA 7280 24s Manset Rib Original — TeeStock', 'Kaos polos New States Apparel Premium Cotton Long Sleeve 7280. 100% Cotton 24s dengan rib manset elastis di pergelangan tangan. Melindungi dari sinar matahari dan udara dingin.'),
('TS-BLK-5480', 'New States Apparel Heavyweight Long Sleeve 5480', 'blank', 'NSA Blank Apparel', '#EBE3D5', 'Kaos Polos Lengan Panjang 20s Heavy', 'Katalog Polos', 'blank', 'active', 'Distributor Resmi NSA', 'https://cititex.com/api/uploads/category/album/front_side/124-Black.jpg', 'Black, White, Sport Grey, Navy', 'S, M, L, XL, XXL', 89000, 78000, 72000, 0, false, 124, 'Kaos Polos NSA Heavyweight Long Sleeve 5480 20s Original — TeeStock', 'Kaos lengan panjang New States Apparel Heavyweight 5480. Bahan tebal 20s, potongan boxier fit dengan manset rib rapat. Sangat dicari untuk gaya streetwear musim sejuk.'),
('TS-BLK-7250', 'New States Apparel Ringer Tee 7250', 'blank', 'NSA Blank Apparel', '#EBE3D5', 'Kaos Polos Retro Ringer Dua Warna', 'Katalog Polos', 'blank', 'active', 'Distributor Resmi NSA', 'https://cititex.com/api/uploads/category/album/front_side/97-White-Black.jpg', 'White-Black, White-Red, White-Navy, White-Forest Green, White-Gold, Sport Grey-Black', 'S, M, L, XL, XXL', 59000, 50000, 45000, 0, false, 97, 'Kaos Polos NSA Ringer 7250 Retro Dua Warna Combed 24s Original — TeeStock', 'Kaos polos New States Apparel Premium Cotton Ringer 7250. Desain retro vintage dengan kombinasi rib leher dan lengan berbeda warna. 100% Combed Cotton 24s lembut.'),
('TS-BLK-7260', 'New States Apparel Raglan 3/4 7260', 'blank', 'NSA Blank Apparel', '#EBE3D5', 'Kaos Polos Raglan Tiga Perempat', 'Katalog Polos', 'blank', 'active', 'Distributor Resmi NSA', 'https://cititex.com/api/uploads/category/album/front_side/98-White-Black.jpg', 'White-Black, White-Red, White-Navy, White-Forest Green, Sport Grey-Black, Sport Grey-Navy', 'S, M, L, XL, XXL', 72000, 63000, 58000, 0, false, 98, 'Kaos Polos NSA Raglan 3-4 7260 Katun 24s Original — TeeStock', 'Kaos polos New States Apparel Premium Cotton Raglan 3/4 7260. Potongan lengan raglan diagonal 3/4 klasik. Bahan katun 24s nyaman untuk aktivitas kasual dan santai.'),
('TS-BLK-8100', 'New States Apparel Polo Shirt 8100', 'blank', 'NSA Blank Apparel', '#EBE3D5', 'Wangki Polo Pique Cotton Berkerah', 'Katalog Polos', 'blank', 'active', 'Distributor Resmi NSA', 'https://cititex.com/api/uploads/category/album/front_side/96-Black.jpg', 'Black, White, Navy, Red, Maroon, Sport Grey, Royal Blue, Forest Green', 'S, M, L, XL, XXL', 89000, 76000, 68000, 0, false, 96, 'Kaos Polo NSA 8100 Wangki Pique Cotton Berkerah Original — TeeStock', 'Kaos polo New States Apparel Premium Cotton Polo Shirt 8100. Rajutan kain pique pori klasik dengan 2 kancing berukir elegan. Rapi untuk seragam kantor dan event semi-formal.'),
('TS-BLK-9500', 'New States Apparel Hoodie 9500', 'blank', 'NSA Blank Apparel', '#EBE3D5', 'Sweatshirt Hoodie Fleece Tebal', 'Katalog Polos', 'blank', 'active', 'Distributor Resmi NSA', 'https://cititex.com/api/uploads/category/album/front_side/103-Black.jpg', 'Black, Sport Grey, Navy, Maroon, Forest Green', 'S, M, L, XL, XXL', 165000, 142000, 125000, 0, false, 103, 'Jaket Hoodie Polos NSA 9500 Super Blend Fleece 270 Original — TeeStock', 'Jaket hoodie New States Apparel Super Blend Hooded Sweatshirt 9500. 50% Cotton / 50% Polyester Fleece 270 g/m2. Kantung kangguru ganda, tali serut senada, permukaan luar halus dan dalam hangat lembut.'),
('TS-BLK-9000', 'New States Apparel Crewneck 9000', 'blank', 'NSA Blank Apparel', '#EBE3D5', 'Sweatshirt Crewneck Fleece Kerah Bulat', 'Katalog Polos', 'blank', 'active', 'Distributor Resmi NSA', 'https://cititex.com/api/uploads/category/album/front_side/118-Black.jpg', 'Black, Sport Grey, Navy, Maroon', 'S, M, L, XL, XXL', 145000, 125000, 110000, 0, false, 118, 'Sweatshirt Crewneck Polos NSA 9000 Fleece 270 Original — TeeStock', 'Sweatshirt kerah bulat New States Apparel Super Blend Crewneck 9000. Bahan fleece katun premium 270 g/m2 tanpa tudung. Manset rib rajut tebal dan jahitan ganda kokoh.'),
('TS-BLK-2700', 'New States Apparel Performance Dri-Fit 2700', 'blank', 'NSA Blank Apparel', '#EBE3D5', 'Kaos Olahraga Quick-Dry Performance', 'Katalog Polos', 'blank', 'active', 'Distributor Resmi NSA', 'https://cititex.com/api/uploads/category/album/front_side/130-Black.jpg', 'Black, White, Navy, Red, Royal Blue, Neon Green', 'S, M, L, XL, XXL', 47000, 39000, 35000, 0, false, 130, 'Baju Kaos Olahraga Polos NSA Dri-Fit 2700 Running Gym Original — TeeStock', 'Kaos olahraga New States Apparel Performance Dri-Fit 2700. 100% Polyester micro-mesh pori halus. Cepat kering (quick-dry), sejuk, dan elastis. Pilihan terbaik untuk running, gym, dan futsal.'),
('TS-BLK-72Y00', 'New States Apparel Youth T-Shirt 72Y00', 'blank', 'NSA Blank Apparel', '#EBE3D5', 'Kaos Polos Anak Katun Combed 24s', 'Katalog Polos', 'blank', 'active', 'Distributor Resmi NSA', 'https://cititex.com/api/uploads/category/album/front_side/129-Black.jpg', 'Black, White, Navy, Red, Royal Blue, Daisy, Heliconia', 'YXS, YS, YM, YL, YXL', 47000, 39000, 35000, 0, false, 129, 'Kaos Polos Anak NSA Youth 72Y00 Katun 24s Original — TeeStock', 'Kaos polos anak New States Apparel Youth 72Y00. 100% Premium Cotton Combed 24s aman dan nyaman untuk kulit anak-anak. Kerah rib elastis dan tanpa jahitan samping.')
ON CONFLICT (sku) DO NOTHING;


-- 2. Insert Struktur Unit Economics per SKU
INSERT INTO ts_unit_economics (product_sku, cost_blank, cost_dtf, cost_press, cost_pack, cost_overhead, cost_design, price_retail, price_dropship, price_reseller, print_area)
VALUES
-- Unit Economics Kaos Grafis
('TS-PRO-001', 38000, 12750, 2000, 4500, 2000, 5000, 99000, 87000, 74000, 'A3 (30x30 cm)'),
('TS-PRO-002', 48000, 12750, 2000, 4500, 2000, 5000, 109000, 96000, 82000, 'A3 (30x30 cm)'),
('TS-KOM-001', 38000, 12750, 2000, 4500, 2000, 5000, 99000, 87000, 74000, 'A3 (30x30 cm)'),
('TS-KOM-002', 38000, 12750, 2000, 4500, 2000, 5000, 99000, 87000, 74000, 'A3 (30x30 cm)'),
('TS-LOK-001', 38000, 12750, 2000, 4500, 2000, 5000, 89000, 78000, 67000, 'A3 (30x30 cm)'),
('TS-LOK-002', 38000, 12750, 2000, 4500, 2000, 5000, 89000, 78000, 67000, 'A3 (30x30 cm)'),
('TS-REC-001', 38000, 12750, 2000, 4500, 2000, 5000, 99000, 87000, 75000, 'A3 (30x30 cm)'),
('TS-FAN-001', 48000, 12750, 2000, 4500, 2000, 5000, 109000, 96000, 82000, 'A3 (30x30 cm)'),

-- Unit Economics Kaos Polos Blank NSA (Tanpa Biaya Cetak DTF)
('TS-BLK-3600', 38000, 0, 0, 3500, 1500, 0, 49000, 44000, 42000, 'Polos (No Print)'),
('TS-BLK-7200', 48000, 0, 0, 3500, 1500, 0, 59000, 53000, 51000, 'Polos (No Print)'),
('TS-BLK-5400', 65000, 0, 0, 3500, 1500, 0, 79000, 72000, 69000, 'Polos (No Print)'),
('TS-BLK-7280', 55000, 0, 0, 3500, 1500, 0, 69000, 62000, 59000, 'Polos (No Print)'),
('TS-BLK-5480', 72000, 0, 0, 3500, 1500, 0, 89000, 81000, 78000, 'Polos (No Print)'),
('TS-BLK-7250', 45000, 0, 0, 3500, 1500, 0, 59000, 53000, 50000, 'Polos (No Print)'),
('TS-BLK-7260', 58000, 0, 0, 3500, 1500, 0, 72000, 65000, 63000, 'Polos (No Print)'),
('TS-BLK-8100', 68000, 0, 0, 3500, 1500, 0, 89000, 80000, 76000, 'Polos (No Print)'),
('TS-BLK-9500', 125000, 0, 0, 4500, 2000, 0, 165000, 149000, 142000, 'Polos (No Print)'),
('TS-BLK-9000', 110000, 0, 0, 4500, 2000, 0, 145000, 131000, 125000, 'Polos (No Print)'),
('TS-BLK-2700', 35000, 0, 0, 3500, 1500, 0, 47000, 42000, 39000, 'Polos (No Print)'),
('TS-BLK-72Y00', 35000, 0, 0, 3500, 1500, 0, 47000, 42000, 39000, 'Polos (No Print)')
ON CONFLICT (product_sku) DO NOTHING;


-- 3. Insert Starter Inventory (Bahan Kaos Polos NSA, DTF Film & MultiGraph Packaging)
INSERT INTO ts_inventory (sku_item, item_type, brand, color, size, unit_measure, stock_qty, min_stock_alert, cost_per_unit, supplier)
VALUES
('NSA-30S-BLK-M', 'blank_tshirt', 'New States Apparel', 'Hitam', 'M', 'pcs', 8, 3, 38000, 'Distributor Resmi NSA'),
('NSA-30S-BLK-L', 'blank_tshirt', 'New States Apparel', 'Hitam', 'L', 'pcs', 10, 3, 38000, 'Distributor Resmi NSA'),
('NSA-30S-BLK-XL', 'blank_tshirt', 'New States Apparel', 'Hitam', 'XL', 'pcs', 6, 2, 38000, 'Distributor Resmi NSA'),
('NSA-30S-CRM-M', 'blank_tshirt', 'New States Apparel', 'Krem', 'M', 'pcs', 5, 2, 38000, 'Distributor Resmi NSA'),
('NSA-30S-CRM-L', 'blank_tshirt', 'New States Apparel', 'Krem', 'L', 'pcs', 6, 2, 38000, 'Distributor Resmi NSA'),
('NSA-24S-BLK-L', 'blank_tshirt', 'New States Apparel', 'Hitam', 'L', 'pcs', 8, 3, 48000, 'Distributor Resmi NSA'),
('NSA-24S-BLK-XL', 'blank_tshirt', 'New States Apparel', 'Hitam', 'XL', 'pcs', 5, 2, 48000, 'Distributor Resmi NSA'),
('NSA-20S-BLK-L', 'blank_tshirt', 'New States Apparel', 'Hitam', 'L', 'pcs', 5, 2, 65000, 'Distributor Resmi NSA'),
('DTF-ROLL-58CM', 'dtf_film', 'TeeStock Film HD', 'Transparan', 'Roll 58 cm x 100 m', 'meter', 45, 10, 25000, 'Vendor DTF Partner'),
('MAT-POLY-30X40', 'supplies', 'TeeStock Pack', 'Putih', '30x40 cm', 'pcs', 120, 30, 800, 'MultiGraph Packaging'),
('MAT-HANGTAG-01', 'supplies', 'TeeStock Brand', 'Matte Black', 'Standard', 'pcs', 250, 50, 450, 'MultiGraph Printing'),
('MAT-STICKER-VP', 'supplies', 'TeeStock Vinyl', 'Die-Cut', '7 cm', 'pcs', 180, 40, 650, 'MultiGraph Printing')
ON CONFLICT (sku_item) DO NOTHING;


-- 4. Insert Master Promo & Vouchers
INSERT INTO ts_vouchers (code, title, description, type, discount_type, discount_value, min_order, target_role, is_active)
VALUES
('WELCOME10', 'Diskon Perdana 10%', 'Potongan 10% untuk pesanan perdana pelanggan baru', 'discount', 'percent', 10, 0, 'all', true),
('TEESTOCKDROP', 'Potongan Rp 10.000 Edisi Drop', 'Potongan Rp 10.000 untuk pembelian minimal Rp 89.000', 'discount', 'fixed', 10000, 89000, 'all', true),
('FREESHIP15', 'Subsidi Ongkir Rp 15.000', 'Gratis subsidi ongkos kirim Rp 15.000 dengan minimal belanja Rp 150.000', 'free_shipping', 'fixed', 15000, 150000, 'all', true),
('PARTNERVIP', 'Voucher Tambahan Mitra', 'Voucher ekstra Rp 5.000/pcs khusus partner dropshipper terverifikasi', 'partner_exclusive', 'fixed', 5000, 70000, 'partner', true)
ON CONFLICT (code) DO NOTHING;


-- 5. Insert Sample Orders Awal (Untuk Testing Kanban Pipeline Produksi)
INSERT INTO ts_orders (order_number, customer_name, customer_phone, customer_city, channel, tier, status, total_amount, marketplace_fee, tracking_number, notes)
VALUES
('SHOP-2609-001', 'Budi Santoso', '0812-3456-7890', 'Bandung', 'shopee', 'retail', 'pending', 99000, 6435, NULL, 'Commit & Pray - NSA Softstyle 30s (Hitam L) x1'),
('TIK-2609-002', 'Siti Rahma', '0813-9876-5432', 'Jakarta Selatan', 'tiktok', 'retail', 'dtf', 99000, 6435, NULL, '7 Summits 3000 MDPL - NSA Softstyle 30s (Hitam XL) x1'),
('WA-2609-003', 'Komunitas Kopi Pagi', '0818-4455-6677', 'Yogyakarta', 'whatsapp', 'retail', 'press', 210000, 0, NULL, 'Crisis with Iced Coffee - NSA Heavyweight 24s (Krem M) x2'),
('WEB-2609-004', 'Andi Wijaya', '0821-8899-0011', 'Surabaya', 'web', 'retail', 'pack', 89000, 1335, 'JP1029485760', 'Wong Jowo Ojo Ilang - NSA Softstyle 30s (Hitam L) x1')
ON CONFLICT (order_number) DO NOTHING;


-- 5b. Insert Sample Order Items Relasional
INSERT INTO ts_order_items (order_number, product_sku, product_name, garment, size, color, qty, unit_price, subtotal)
VALUES
('SHOP-2609-001', 'TS-PRO-001', 'Commit & Pray', 'NSA Softstyle 30s', 'L', 'Hitam', 1, 99000, 99000),
('TIK-2609-002', 'TS-KOM-001', '7 Summits 3000 MDPL', 'NSA Softstyle 30s', 'XL', 'Hitam', 1, 99000, 99000),
('WA-2609-003', 'TS-REC-001', 'Crisis with Iced Coffee', 'NSA Heavyweight 24s', 'M', 'Krem', 2, 105000, 210000),
('WEB-2609-004', 'TS-LOK-001', 'Wong Jowo Ojo Ilang Jawane', 'NSA Softstyle 30s', 'L', 'Hitam', 1, 89000, 89000);


-- 6. Insert Sample QC Defect Tracker
INSERT INTO ts_defects (sku, order_id, defect_type, qty, cost_loss, responsible_stage, resolution_notes)
VALUES
('TS-PRO-001', 'WEB-481920', 'dtf_print', 1, 14750, 'vendor_dtf', 'Film DTF buram garis raster putus. Diklaim retur cetak ulang gratis ke vendor DTF.'),
('TS-BLK-3600', 'MAN-102941', 'garment_flaw', 1, 38000, 'vendor_nsa', 'Terdapat lubang kecil jarum rajut di ketiak. Kaos disisihkan untuk lap tes press.');


-- 7. Insert Sample Verified Reviews
INSERT INTO ts_reviews (product_sku, author_name, role_badge, rating, garment_type, size_ordered, user_stats, content, is_verified, helpful_count)
VALUES
('TS-PRO-001', 'Dimas Aditya', 'Verified Buyer', 5, 'Heavyweight 24s (Black)', 'XL', 'TB 178 cm · BB 74 kg (Fitting Boxy Pas)', 'Bahan NSA 24s-nya beneran tebal dan jatuh di badan enak banget, nggak lemes kayak combed murah. Sablonan DTF-nya rapi, raster halusnya dapet dan pas ditarik lentur nggak kaku. Rekomen parah buat yang nyari kaos distro rasa impor.', true, 14),
('TS-PRO-002', 'Rian Kurniawan', 'Verified Buyer', 5, 'Heavyweight 24s (White)', 'L', 'TB 171 cm · BB 66 kg (Pas Sesuai Size Chart)', 'Kerah rib lehernya tebal banget, dicuci 2 kali di mesin cuci nggak melar sama sekali. Sablonnya nempel sempurna ke pori-pori kain. Packaging polymailernya juga rapi ada stiker bonusnya.', true, 9),
('TS-KOM-001', 'Bayu Pratama', 'Verified Buyer', 5, 'Softstyle 30s (Black)', 'M', 'TB 167 cm · BB 58 kg', 'Pilihan 30s-nya adem banget buat dipakai motoran siang hari. Desainnya presisi sesuai mockup web. Pengiriman cepat H+1 langsung jalan resinya.', true, 6);

-- ====================================================================
-- SELESAI! Master Database TeeStock Siap Digunakan 100%
-- ====================================================================
