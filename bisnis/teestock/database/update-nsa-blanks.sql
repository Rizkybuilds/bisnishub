-- ====================================================================
-- TEESTOCK APPAREL — MIGRATION: 12 NSA CITITEX BLANK PRODUCTS
-- Jalankan query ini di Supabase SQL Editor:
-- https://supabase.com/dashboard/project/tovslowsopqtuxmrogeu/sql/new
-- ====================================================================

-- 1. Insert/Update 12 Produk Blank NSA ke ts_products
INSERT INTO ts_products (sku, name, series, series_name, series_color, niche, batch, template, status, license_source, file_path, colors, sizes, seo_title, description)
VALUES
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
  series = EXCLUDED.series,
  series_name = EXCLUDED.series_name,
  file_path = EXCLUDED.file_path,
  colors = EXCLUDED.colors,
  sizes = EXCLUDED.sizes,
  seo_title = EXCLUDED.seo_title,
  description = EXCLUDED.description,
  updated_at = NOW();

-- 2. Insert/Update Unit Economics Kaos Polos Blank NSA
INSERT INTO ts_unit_economics (product_sku, cost_blank, cost_dtf, cost_press, cost_pack, cost_overhead, cost_design, price_retail, price_dropship, price_reseller, print_area)
VALUES
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
  cost_pack = EXCLUDED.cost_pack,
  cost_overhead = EXCLUDED.cost_overhead,
  cost_design = EXCLUDED.cost_design,
  price_retail = EXCLUDED.price_retail,
  price_dropship = EXCLUDED.price_dropship,
  price_reseller = EXCLUDED.price_reseller,
  print_area = EXCLUDED.print_area,
  updated_at = NOW();

-- 3. Insert Starter Inventory Bahan Polos NSA di Supabase
INSERT INTO ts_inventory (sku_item, item_type, brand, color, size, stock_qty, min_stock_alert, unit_cost)
VALUES
('NSA-30S-BLK-M', 'blank_tshirt', 'New States Apparel', 'Hitam', 'M', 5, 2, 38000),
('NSA-30S-BLK-L', 'blank_tshirt', 'New States Apparel', 'Hitam', 'L', 5, 2, 38000),
('NSA-30S-BLK-XL', 'blank_tshirt', 'New States Apparel', 'Hitam', 'XL', 3, 2, 38000),
('NSA-30S-CRM-M', 'blank_tshirt', 'New States Apparel', 'Krem', 'M', 3, 2, 38000),
('NSA-30S-CRM-L', 'blank_tshirt', 'New States Apparel', 'Krem', 'L', 3, 2, 38000),
('NSA-24S-BLK-L', 'blank_tshirt', 'New States Apparel', 'Hitam', 'L', 4, 2, 48000),
('NSA-20S-BLK-L', 'blank_tshirt', 'New States Apparel', 'Hitam', 'L', 3, 2, 65000)
ON CONFLICT (sku_item) DO UPDATE SET
  stock_qty = EXCLUDED.stock_qty,
  unit_cost = EXCLUDED.unit_cost,
  updated_at = NOW();
