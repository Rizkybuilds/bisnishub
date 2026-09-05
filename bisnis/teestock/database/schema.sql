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
    series VARCHAR(50) NOT NULL, -- profesi, komunitas, lokal, fase, fandom, receh, squad, kampus, momen, blank
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
-- Supabase mewajibkan RLS untuk keamanan API.
-- Publik (anon) hanya boleh READ katalog dan unit economics (storefront).
-- Operasi tulis dan data sensitif (orders, inventory) hanya untuk authenticated (admin).
-- ====================================================================
ALTER TABLE ts_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE ts_unit_economics ENABLE ROW LEVEL SECURITY;
ALTER TABLE ts_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE ts_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE ts_order_items ENABLE ROW LEVEL SECURITY;

-- ts_products (Katalog publik baca, admin tulis)
CREATE POLICY "anon_read_products" ON ts_products FOR SELECT USING (true);
CREATE POLICY "auth_insert_products" ON ts_products FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "auth_update_products" ON ts_products FOR UPDATE TO authenticated USING (true);
CREATE POLICY "auth_delete_products" ON ts_products FOR DELETE TO authenticated USING (true);

-- ts_unit_economics (Harga publik baca, admin tulis)
CREATE POLICY "anon_read_unit_economics" ON ts_unit_economics FOR SELECT USING (true);
CREATE POLICY "auth_insert_unit_economics" ON ts_unit_economics FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "auth_update_unit_economics" ON ts_unit_economics FOR UPDATE TO authenticated USING (true);
CREATE POLICY "auth_delete_unit_economics" ON ts_unit_economics FOR DELETE TO authenticated USING (true);

-- ts_inventory (Stok — hanya admin)
CREATE POLICY "auth_read_inventory" ON ts_inventory FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth_insert_inventory" ON ts_inventory FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "auth_update_inventory" ON ts_inventory FOR UPDATE TO authenticated USING (true);
CREATE POLICY "auth_delete_inventory" ON ts_inventory FOR DELETE TO authenticated USING (true);

-- ts_orders (Pesanan & Data Pelanggan — hanya admin)
CREATE POLICY "auth_read_orders" ON ts_orders FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth_insert_orders" ON ts_orders FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "auth_update_orders" ON ts_orders FOR UPDATE TO authenticated USING (true);
CREATE POLICY "auth_delete_orders" ON ts_orders FOR DELETE TO authenticated USING (true);

-- ts_order_items (Detail Item Pesanan — hanya admin)
CREATE POLICY "auth_read_order_items" ON ts_order_items FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth_insert_order_items" ON ts_order_items FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "auth_update_order_items" ON ts_order_items FOR UPDATE TO authenticated USING (true);
CREATE POLICY "auth_delete_order_items" ON ts_order_items FOR DELETE TO authenticated USING (true);

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
('TS-FAS-001', 'Anak Kos Survival Mode', 'fase', 'TeeStock Fase', '#4F7C74', 'Anak Kos, Rantau', 'Batch 2', 'icon_text', 'test', 'In-House', 'bisnis/teestock/desain/fase/anak-kos.png', 'Dusty Teal, Hitam, Krem', 'S, M, L, XL', 'Kaos Anak Kos Survival Mode Tanggal Tua Lucu Distro — TeeStock Fase', 'Kaos seragam resmi pejuang tanggal tua penikmat mie instan kuah bumbu setengah.'),

-- Katalog Resmi Blank Apparel (Original New States Apparel Cititex)
('TS-BLK-3600', 'New States Apparel Softstyle 3600', 'blank', 'NSA Blank Apparel', '#EBE3D5', 'Kaos Polos Ring Spun 30s Tubular', 'Katalog Polos', 'blank', 'active', 'Official Cititex', 'https://cititex.com/api/uploads/category/album/front_side/87-Black.jpg', 'Hitam, Putih, Charcoal, Navy, Maroon, Sport Grey, Forest Green, Royal Blue, Red, Irish Green, Daisy, Heliconia, Sand, Orange, Mustard', 'S, M, L, XL, XXL, 3XL', 'Kaos Polos NSA Softstyle 3600 Combed 30s New States Apparel Cititex — TeeStock', 'Kaos polos New States Apparel Softstyle 3600. 100% Ring Spun Cotton 30s, 150 g/m2. Lembut, adem, jahitan rantai rapi tanpa jahitan samping (tubular/built-up). Cocok untuk daily casual wear maupun disablon DTF.'),
('TS-BLK-7200', 'New States Apparel Premium Cotton 7200', 'blank', 'NSA Blank Apparel', '#EBE3D5', 'Kaos Polos Combed 24s Regular Fit', 'Katalog Polos', 'blank', 'active', 'Official Cititex', 'https://cititex.com/api/uploads/category/album/front_side/99-Black.jpg', 'Black, White, Navy, Maroon, Sport Grey, Forest Green, Charcoal, Salmon, Aqua Sky, Gold, Royal Blue, Red', 'S, M, L, XL, XXL, 3XL', 'Kaos Polos NSA Premium Cotton 7200 24s New States Apparel Cititex — TeeStock', 'Kaos polos New States Apparel Premium Cotton 7200. 100% Cotton Combed 24s, 180 g/m2. Bahan lebih tebal, kokoh, dan presisi. Potongan regular fit dengan kenyamanan premium.'),
('TS-BLK-5400', 'New States Apparel Heavyweight 5400', 'blank', 'NSA Blank Apparel', '#EBE3D5', 'Kaos Polos Streetwear 20s Boxy Fit', 'Katalog Polos', 'blank', 'active', 'Official Cititex', 'https://cititex.com/api/uploads/category/album/front_side/95-Black.jpg', 'Black, White, Navy, Sport Grey, Maroon, Gold, Dark Green', 'S, M, L, XL, XXL, 3XL', 'Kaos Polos NSA Heavyweight 5400 20s Boxy Fit New States Apparel Cititex — TeeStock', 'Kaos polos New States Apparel Heavyweight 5400. 100% Cotton 20s, 210 g/m2. Karakter kain berat, kaku, dan tebal khas streetwear boxy vintage look. Kerah leher tebal anti-melar.'),
('TS-BLK-7280', 'New States Apparel Long Sleeve 7280', 'blank', 'NSA Blank Apparel', '#EBE3D5', 'Kaos Polos Lengan Panjang Rib 24s', 'Katalog Polos', 'blank', 'active', 'Official Cititex', 'https://cititex.com/api/uploads/category/album/front_side/94-Black.jpg', 'Black, White, Navy, Sport Grey, Maroon, Charcoal, Forest Green', 'S, M, L, XL, XXL, 3XL', 'Kaos Polos Lengan Panjang NSA 7280 24s Manset Rib Cititex — TeeStock', 'Kaos polos New States Apparel Premium Cotton Long Sleeve 7280. 100% Cotton 24s dengan rib manset elastis di pergelangan tangan. Melindungi dari sinar matahari dan udara dingin.'),
('TS-BLK-5480', 'New States Apparel Heavyweight Long Sleeve 5480', 'blank', 'NSA Blank Apparel', '#EBE3D5', 'Kaos Polos Lengan Panjang 20s Heavy', 'Katalog Polos', 'blank', 'active', 'Official Cititex', 'https://cititex.com/api/uploads/category/album/front_side/124-Black.jpg', 'Black, White, Sport Grey, Navy', 'S, M, L, XL, XXL', 'Kaos Polos NSA Heavyweight Long Sleeve 5480 20s Cititex — TeeStock', 'Kaos lengan panjang New States Apparel Heavyweight 5480. Bahan tebal 20s, potongan boxier fit dengan manset rib rapat. Sangat dicari untuk gaya streetwear musim sejuk.'),
('TS-BLK-7250', 'New States Apparel Ringer Tee 7250', 'blank', 'NSA Blank Apparel', '#EBE3D5', 'Kaos Polos Retro Ringer Dua Warna', 'Katalog Polos', 'blank', 'active', 'Official Cititex', 'https://cititex.com/api/uploads/category/album/front_side/97-White-Black.jpg', 'White-Black, White-Red, White-Navy, White-Forest Green, White-Gold, Sport Grey-Black', 'S, M, L, XL, XXL', 'Kaos Polos NSA Ringer 7250 Retro Dua Warna Combed 24s Cititex — TeeStock', 'Kaos polos New States Apparel Premium Cotton Ringer 7250. Desain retro vintage dengan kombinasi rib leher dan lengan berbeda warna. 100% Combed Cotton 24s lembut.'),
('TS-BLK-7260', 'New States Apparel Raglan 3/4 7260', 'blank', 'NSA Blank Apparel', '#EBE3D5', 'Kaos Polos Raglan Tiga Perempat', 'Katalog Polos', 'blank', 'active', 'Official Cititex', 'https://cititex.com/api/uploads/category/album/front_side/98-White-Black.jpg', 'White-Black, White-Red, White-Navy, White-Forest Green, Sport Grey-Black, Sport Grey-Navy', 'S, M, L, XL, XXL', 'Kaos Polos NSA Raglan 3-4 7260 Katun 24s Cititex — TeeStock', 'Kaos polos New States Apparel Premium Cotton Raglan 3/4 7260. Potongan lengan raglan diagonal 3/4 klasik. Bahan katun 24s nyaman untuk aktivitas kasual dan santai.'),
('TS-BLK-8100', 'New States Apparel Polo Shirt 8100', 'blank', 'NSA Blank Apparel', '#EBE3D5', 'Wangki Polo Pique Cotton Berkerah', 'Katalog Polos', 'blank', 'active', 'Official Cititex', 'https://cititex.com/api/uploads/category/album/front_side/96-Black.jpg', 'Black, White, Navy, Red, Maroon, Sport Grey, Royal Blue, Forest Green', 'S, M, L, XL, XXL', 'Kaos Polo NSA 8100 Wangki Pique Cotton Berkerah Cititex — TeeStock', 'Kaos polo New States Apparel Premium Cotton Polo Shirt 8100. Rajutan kain pique pori klasik dengan 2 kancing berukir elegan. Rapi untuk seragam kantor dan event semi-formal.'),
('TS-BLK-9500', 'New States Apparel Hoodie 9500', 'blank', 'NSA Blank Apparel', '#EBE3D5', 'Sweatshirt Hoodie Fleece Tebal', 'Katalog Polos', 'blank', 'active', 'Official Cititex', 'https://cititex.com/api/uploads/category/album/front_side/103-Black.jpg', 'Black, Sport Grey, Navy, Maroon, Forest Green', 'S, M, L, XL, XXL', 'Jaket Hoodie Polos NSA 9500 Super Blend Fleece 270 Cititex — TeeStock', 'Jaket hoodie New States Apparel Super Blend Hooded Sweatshirt 9500. 50% Cotton / 50% Polyester Fleece 270 g/m2. Kantung kangguru ganda, tali serut senada, permukaan luar halus dan dalam hangat lembut.'),
('TS-BLK-9000', 'New States Apparel Crewneck 9000', 'blank', 'NSA Blank Apparel', '#EBE3D5', 'Sweatshirt Crewneck Fleece Kerah Bulat', 'Katalog Polos', 'blank', 'active', 'Official Cititex', 'https://cititex.com/api/uploads/category/album/front_side/118-Black.jpg', 'Black, Sport Grey, Navy, Maroon', 'S, M, L, XL, XXL', 'Sweatshirt Crewneck Polos NSA 9000 Fleece 270 Cititex — TeeStock', 'Sweatshirt kerah bulat New States Apparel Super Blend Crewneck 9000. Bahan fleece katun premium 270 g/m2 tanpa tudung. Manset rib rajut tebal dan jahitan ganda kokoh.'),
('TS-BLK-2700', 'New States Apparel Performance Dri-Fit 2700', 'blank', 'NSA Blank Apparel', '#EBE3D5', 'Kaos Olahraga Quick-Dry Performance', 'Katalog Polos', 'blank', 'active', 'Official Cititex', 'https://cititex.com/api/uploads/category/album/front_side/130-Black.jpg', 'Black, White, Navy, Red, Royal Blue, Neon Green', 'S, M, L, XL, XXL', 'Baju Kaos Olahraga Polos NSA Dri-Fit 2700 Running Gym Cititex — TeeStock', 'Kaos olahraga New States Apparel Performance Dri-Fit 2700. 100% Polyester micro-mesh pori halus. Cepat kering (quick-dry), sejuk, dan elastis. Pilihan terbaik untuk running, gym, dan futsal.'),
('TS-BLK-72Y00', 'New States Apparel Youth T-Shirt 72Y00', 'blank', 'NSA Blank Apparel', '#EBE3D5', 'Kaos Polos Anak Katun Combed 24s', 'Katalog Polos', 'blank', 'active', 'Official Cititex', 'https://cititex.com/api/uploads/category/album/front_side/129-Black.jpg', 'Black, White, Navy, Red, Royal Blue, Daisy, Heliconia', 'YXS, YS, YM, YL, YXL', 'Kaos Polos Anak NSA Youth 72Y00 Katun 24s Cititex — TeeStock', 'Kaos polos anak New States Apparel Youth 72Y00. 100% Premium Cotton Combed 24s aman dan nyaman untuk kulit anak-anak. Kerah rib elastis dan tanpa jahitan samping.')
ON CONFLICT (sku) DO UPDATE SET
  name = EXCLUDED.name,
  file_path = EXCLUDED.file_path,
  colors = EXCLUDED.colors,
  sizes = EXCLUDED.sizes,
  description = EXCLUDED.description;

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
('TS-FAS-001', 38000, 12750, 2000, 4500, 2000, 5000, 89000, 78000, 67000, 'A3 (30x30 cm)'),

-- Unit Economics Kaos Polos Blank NSA (Tanpa Biaya DTF / Direct Packing)
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
ON CONFLICT (product_sku) DO UPDATE SET
  cost_blank = EXCLUDED.cost_blank,
  cost_dtf = EXCLUDED.cost_dtf,
  cost_press = EXCLUDED.cost_press,
  price_retail = EXCLUDED.price_retail,
  price_reseller = EXCLUDED.price_reseller;

-- Starter Inventory Blank NSA Softstyle 30s & Premium 24s
INSERT INTO ts_inventory (sku_item, item_type, brand, color, size, stock_qty, min_stock_alert, unit_cost)
VALUES
('NSA-30S-BLK-M', 'blank_tshirt', 'New States Apparel', 'Hitam', 'M', 5, 2, 38000),
('NSA-30S-BLK-L', 'blank_tshirt', 'New States Apparel', 'Hitam', 'L', 5, 2, 38000),
('NSA-30S-BLK-XL', 'blank_tshirt', 'New States Apparel', 'Hitam', 'XL', 3, 2, 38000),
('NSA-30S-CRM-M', 'blank_tshirt', 'New States Apparel', 'Krem', 'M', 3, 2, 38000),
('NSA-30S-CRM-L', 'blank_tshirt', 'New States Apparel', 'Krem', 'L', 3, 2, 38000),
('NSA-24S-BLK-L', 'blank_tshirt', 'New States Apparel', 'Hitam', 'L', 4, 2, 48000),
('NSA-20S-BLK-L', 'blank_tshirt', 'New States Apparel', 'Hitam', 'L', 3, 2, 65000)
ON CONFLICT (sku_item) DO NOTHING;
