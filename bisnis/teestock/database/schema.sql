-- ====================================================================
-- TEESTOCK APPAREL — MASTER SUPABASE POSTGRESQL SCHEMA
-- Project: Unified Business Hub (Prefix: ts_ untuk TeeStock)
-- Updated: September 2026
-- ====================================================================

-- 1. TABEL: ts_products (Master Katalog Desain)
CREATE TABLE IF NOT EXISTS ts_products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sku VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    series VARCHAR(50) NOT NULL, -- profesi, komunitas, lokal, fase, fandom, receh, squad, kampus, momen
    series_name VARCHAR(100) NOT NULL,
    series_color VARCHAR(20) DEFAULT '#4A4A47',
    niche VARCHAR(100),
    batch VARCHAR(50) DEFAULT 'Batch 1',
    template VARCHAR(50) DEFAULT 'typography', -- typography, badge, icon_text
    status VARCHAR(30) DEFAULT 'active', -- draft, test, active, archived
    license_source VARCHAR(100) DEFAULT 'In-House',
    file_path TEXT,
    colors TEXT DEFAULT 'Hitam, Krem, Charcoal',
    sizes TEXT DEFAULT 'S, M, L, XL, XXL',
    seo_title TEXT,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. TABEL: ts_unit_economics (Struktur Biaya & Penetapan Harga)
CREATE TABLE IF NOT EXISTS ts_unit_economics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_sku VARCHAR(50) UNIQUE REFERENCES ts_products(sku) ON DELETE CASCADE,
    cost_blank NUMERIC(12, 2) DEFAULT 38000,       -- NSA Softstyle 30s
    cost_dtf NUMERIC(12, 2) DEFAULT 12750,         -- DTF A3 roll rate
    cost_press NUMERIC(12, 2) DEFAULT 2000,        -- Listrik & teflon
    cost_pack NUMERIC(12, 2) DEFAULT 4500,         -- Ziplock + stiker + label
    cost_overhead NUMERIC(12, 2) DEFAULT 2000,     -- Operasional
    cost_design NUMERIC(12, 2) DEFAULT 5000,       -- Amortisasi lisensi
    price_retail NUMERIC(12, 2) DEFAULT 99000,     -- Harga Shopee/Tokopedia
    price_dropship NUMERIC(12, 2) DEFAULT 87000,   -- Disc 12%
    price_reseller NUMERIC(12, 2) DEFAULT 74000,   -- Disc 25%
    print_area VARCHAR(20) DEFAULT 'A3 (30x30 cm)',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TABEL: ts_inventory (Stok Bahan Polos & Material Operasional)
CREATE TABLE IF NOT EXISTS ts_inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sku_item VARCHAR(50) UNIQUE NOT NULL,
    item_type VARCHAR(50) NOT NULL, -- blank_tshirt, dtf_film, polymailer, hangtag
    brand VARCHAR(100) DEFAULT 'New State Apparel',
    color VARCHAR(50) DEFAULT 'Hitam',
    size VARCHAR(20) DEFAULT 'L',
    stock_qty INT DEFAULT 0,
    min_stock_alert INT DEFAULT 5,
    unit_cost NUMERIC(12, 2) DEFAULT 38000,
    supplier VARCHAR(100) DEFAULT 'Vendor Resmi NSA',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TABEL: ts_orders (Pencatatan Pesanan Masuk)
CREATE TABLE IF NOT EXISTS ts_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number VARCHAR(50) UNIQUE NOT NULL,
    customer_name VARCHAR(150) NOT NULL,
    customer_phone VARCHAR(50),
    customer_city VARCHAR(100),
    channel VARCHAR(50) DEFAULT 'shopee', -- shopee, tokopedia, tiktok, whatsapp, custom
    tier VARCHAR(30) DEFAULT 'retail',    -- retail, dropship, reseller
    status VARCHAR(50) DEFAULT 'pending', -- pending, design_ready, printing_dtf, pressing, packing, shipped, completed, cancelled
    total_amount NUMERIC(12, 2) NOT NULL,
    marketplace_fee NUMERIC(12, 2) DEFAULT 0,
    shipping_cost NUMERIC(12, 2) DEFAULT 0,
    tracking_number VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. TABEL: ts_order_items (Rincian Item per Pesanan)
CREATE TABLE IF NOT EXISTS ts_order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES ts_orders(id) ON DELETE CASCADE,
    product_sku VARCHAR(50),
    product_name VARCHAR(255),
    size VARCHAR(20) DEFAULT 'L',
    color VARCHAR(50) DEFAULT 'Hitam',
    qty INT DEFAULT 1,
    unit_price NUMERIC(12, 2) NOT NULL,
    subtotal NUMERIC(12, 2) NOT NULL
);

-- ====================================================================
-- VIEW OTOMATIS: ts_view_catalog_summary
-- Menggabungkan data produk + unit economics + auto-hitung margin
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
    u.cost_blank,
    u.cost_dtf,
    u.cost_press,
    u.cost_pack,
    u.cost_overhead,
    u.cost_design,
    (u.cost_blank + u.cost_dtf + u.cost_press + u.cost_pack + u.cost_overhead + u.cost_design) AS total_hpp,
    u.price_retail,
    u.price_dropship,
    u.price_reseller,
    -- Profit bersih retail setelah potongan Shopee 6.5%
    ROUND((u.price_retail * 0.935) - (u.cost_blank + u.cost_dtf + u.cost_press + u.cost_pack + u.cost_overhead + u.cost_design), 2) AS net_profit_retail,
    ROUND((((u.price_retail * 0.935) - (u.cost_blank + u.cost_dtf + u.cost_press + u.cost_pack + u.cost_overhead + u.cost_design)) / NULLIF(u.price_retail, 0)) * 100, 1) AS net_margin_pct
FROM ts_products p
LEFT JOIN ts_unit_economics u ON p.sku = u.product_sku;

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Supabase secara default mewajibkan RLS untuk keamanan API.
-- Kita buka akses read/write penuh untuk key 'anon' internal kamu.
-- ====================================================================
ALTER TABLE ts_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE ts_unit_economics ENABLE ROW LEVEL SECURITY;
ALTER TABLE ts_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE ts_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE ts_order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read ts_products" ON ts_products FOR SELECT USING (true);
CREATE POLICY "Allow public insert ts_products" ON ts_products FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update ts_products" ON ts_products FOR UPDATE USING (true);
CREATE POLICY "Allow public delete ts_products" ON ts_products FOR DELETE USING (true);

CREATE POLICY "Allow public read ts_unit_economics" ON ts_unit_economics FOR SELECT USING (true);
CREATE POLICY "Allow public insert ts_unit_economics" ON ts_unit_economics FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update ts_unit_economics" ON ts_unit_economics FOR UPDATE USING (true);
CREATE POLICY "Allow public delete ts_unit_economics" ON ts_unit_economics FOR DELETE USING (true);

CREATE POLICY "Allow public read ts_inventory" ON ts_inventory FOR SELECT USING (true);
CREATE POLICY "Allow public insert ts_inventory" ON ts_inventory FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update ts_inventory" ON ts_inventory FOR UPDATE USING (true);

CREATE POLICY "Allow public read ts_orders" ON ts_orders FOR SELECT USING (true);
CREATE POLICY "Allow public insert ts_orders" ON ts_orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update ts_orders" ON ts_orders FOR UPDATE USING (true);

CREATE POLICY "Allow public read ts_order_items" ON ts_order_items FOR SELECT USING (true);
CREATE POLICY "Allow public insert ts_order_items" ON ts_order_items FOR INSERT WITH CHECK (true);

-- ====================================================================
-- SEED DATA AWAL: BATCH 1 HERO DESIGNS & INVENTORY
-- Otomatis terisi agar database kamu langsung siap pakai
-- ====================================================================

-- Insert Produk Batch 1
INSERT INTO ts_products (sku, name, series, series_name, series_color, niche, batch, template, status, license_source, file_path, colors, sizes, seo_title, description)
VALUES
('TS-PRO-001', 'Commit & Pray', 'profesi', 'TeeStock Profesi', '#4A4A47', 'Programmer, IT, Developer', 'Batch 1', 'typography', 'active', 'In-House', 'bisnis/teestock/desain/profesi/commit-pray.png', 'Hitam, Krem, Charcoal', 'S, M, L, XL, XXL, 3XL', 'Kaos Programmer IT Commit and Pray Katun Combed 30s New State Apparel — TeeStock Profesi', 'TeeStock Profesi Series — Commit & Pray. Kaos wajib para software engineer saat push production hari Jumat.'),
('TS-PRO-002', 'Feature Not a Bug', 'profesi', 'TeeStock Profesi', '#4A4A47', 'Programmer, QA, IT', 'Batch 1', 'icon_text', 'active', 'In-House', 'bisnis/teestock/desain/profesi/feature-not-bug.png', 'Hitam, Charcoal, Abu Hangat', 'S, M, L, XL, XXL', 'Baju Kaos Coding IT Not a Bug Feature New State Apparel Combed 30s — TeeStock Profesi', 'TeeStock Profesi Series — Jawaban diplomatis terbaik saat demo produk ke client.'),
('TS-KOM-001', '7 Summits Penikmat 3000 MDPL', 'komunitas', 'TeeStock Komunitas', '#6B7057', 'Pendaki, Outdoor, Hiking', 'Batch 1', 'badge', 'active', 'In-House', 'bisnis/teestock/desain/komunitas/3000-mdpl.png', 'Olive, Hitam, Krem', 'S, M, L, XL, XXL, 3XL', 'Kaos Gunung Pendaki 7 Summits Penikmat 3000 MDPL Outdoor Distro — TeeStock Komunitas', 'TeeStock Komunitas Series — Lencana grafis pendaki gunung sejati bertema 7 Summits Indonesia.'),
('TS-KOM-002', 'Born to Hike Forced to Work', 'komunitas', 'TeeStock Komunitas', '#6B7057', 'Outdoor, Camp, Pendaki', 'Batch 1', 'badge', 'active', 'Etsy (Commercial POD)', 'bisnis/teestock/desain/komunitas/born-to-hike.png', 'Hitam, Charcoal, Olive', 'S, M, L, XL, XXL', 'Kaos Outdoor Petualang Born to Hike Forced to Work NSA Combed 30s — TeeStock Komunitas', 'TeeStock Komunitas Series — Jeritan hati pecinta alam yang pikirannya masih tertinggal di tenda pos 3.'),
('TS-LOK-001', 'Wong Jowo Ojo Ilang Jawane', 'lokal', 'TeeStock Lokal', '#D9A441', 'Bahasa Daerah, Jawa, Local Pride', 'Batch 1', 'typography', 'active', 'In-House', 'bisnis/teestock/desain/lokal/wong-jowo.png', 'Hitam, Krem, Abu Hangat', 'S, M, L, XL, XXL', 'Kaos Kata Jawa Wong Jowo Ojo Ilang Jawane Filosofi Jawa Distro — TeeStock Lokal', 'TeeStock Lokal Series — Pengingat akar budaya dengan sentuhan tipografi streetwear modern.'),
('TS-LOK-002', 'Urang Sunda Asli Kujang Pride', 'lokal', 'TeeStock Lokal', '#D9A441', 'Sunda, Jawa Barat, Local Pride', 'Batch 1', 'badge', 'active', 'In-House', 'bisnis/teestock/desain/lokal/urang-sunda.png', 'Hitam, Krem, Navy', 'S, M, L, XL, XXL', 'Kaos Urang Sunda Asli Lambang Kujang Jawa Barat Bandung Distro — TeeStock Lokal', 'TeeStock Lokal Series — Lencana siluet Kujang minimalis berpadu tipografi elegan.'),
('TS-REC-001', 'Quarter Life Crisis with Iced Coffee', 'receh', 'TeeStock Receh/Sarkas', '#C1673D', 'Gen Z, Humor, Kopi', 'Batch 2', 'typography', 'draft', 'In-House', 'bisnis/teestock/desain/receh/crisis-coffee.png', 'Hitam, Krem, Terracotta', 'S, M, L, XL, XXL', 'Kaos Kata Lucu Quarter Life Crisis Iced Coffee Sarkas Gen Z — TeeStock Receh', 'Meratapi masa depan tapi tetap harus ditemani es kopi susu gula aren.'),
('TS-FAS-001', 'Anak Kos Survival Mode', 'fase', 'TeeStock Fase', '#4F7C74', 'Anak Kos, Rantau', 'Batch 2', 'icon_text', 'test', 'In-House', 'bisnis/teestock/desain/fase/anak-kos.png', 'Dusty Teal, Hitam, Krem', 'S, M, L, XL', 'Kaos Anak Kos Survival Mode Tanggal Tua Lucu Distro — TeeStock Fase', 'Kaos seragam resmi pejuang tanggal tua penikmat mie instan kuah bumbu setengah.')
ON CONFLICT (sku) DO NOTHING;

-- Insert Unit Economics per SKU
INSERT INTO ts_unit_economics (product_sku, cost_blank, cost_dtf, cost_press, cost_pack, cost_overhead, cost_design, price_retail, price_dropship, price_reseller, print_area)
VALUES
('TS-PRO-001', 38000, 12750, 2000, 4500, 2000, 5000, 99000, 87000, 74000, 'A3 (30x30 cm)'),
('TS-PRO-002', 38000, 12750, 2000, 4500, 2000, 5000, 99000, 87000, 74000, 'A3 (30x30 cm)'),
('TS-KOM-001', 38000, 12750, 2000, 4500, 2000, 5000, 99000, 87000, 74000, 'A3 (30x30 cm)'),
('TS-KOM-002', 38000, 12750, 2000, 4500, 2000, 5000, 99000, 87000, 74000, 'A3 (30x30 cm)'),
('TS-LOK-001', 38000, 12750, 2000, 4500, 2000, 5000, 89000, 78000, 67000, 'A3 (30x30 cm)'),
('TS-LOK-002', 38000, 12750, 2000, 4500, 2000, 5000, 89000, 78000, 67000, 'A3 (30x30 cm)'),
('TS-REC-001', 38000, 12750, 2000, 4500, 2000, 5000, 89000, 78000, 67000, 'A3 (30x30 cm)'),
('TS-FAS-001', 38000, 12750, 2000, 4500, 2000, 5000, 89000, 78000, 67000, 'A3 (30x30 cm)')
ON CONFLICT DO NOTHING;

-- Starter Inventory Blank NSA Softstyle 30s
INSERT INTO ts_inventory (sku_item, item_type, brand, color, size, stock_qty, min_stock_alert, unit_cost)
VALUES
('NSA-30S-BLK-M', 'blank_tshirt', 'New State Apparel', 'Hitam', 'M', 5, 2, 38000),
('NSA-30S-BLK-L', 'blank_tshirt', 'New State Apparel', 'Hitam', 'L', 5, 2, 38000),
('NSA-30S-BLK-XL', 'blank_tshirt', 'New State Apparel', 'Hitam', 'XL', 3, 2, 38000),
('NSA-30S-CRM-M', 'blank_tshirt', 'New State Apparel', 'Krem', 'M', 3, 2, 38000),
('NSA-30S-CRM-L', 'blank_tshirt', 'New State Apparel', 'Krem', 'L', 3, 2, 38000)
ON CONFLICT (sku_item) DO NOTHING;
