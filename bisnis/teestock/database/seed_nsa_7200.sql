-- ====================================================================
-- TEESTOCK APPAREL — NSA 7200 (24s) & MASTER CATALOG SEED
-- Target: Supabase PostgreSQL (ts_products & ts_unit_economics)
-- Assets: Hosted directly on Supabase Storage bucket [Blank/7200/]
-- ====================================================================

BEGIN;

-- 1. INSERT / UPSERT PRODUK NSA 7200 PREMIUM COTTON
INSERT INTO ts_products (
    sku, name, series, series_name, series_color, niche, batch, template,
    status, license_source, file_path, colors, sizes, price_retail,
    price_reseller, cost_blank, cost_dtf, featured, seo_title, description
) VALUES
(
    'TS-BLK-7200',
    'New States Apparel Premium Cotton 7200',
    'blank',
    'NSA Blank Apparel',
    '#EBE3D5',
    'Kaos Polos Combed 24s Regular Fit 7200',
    'Katalog Polos',
    'blank',
    'active',
    'Distributor Resmi NSA (Cititex)',
    'https://tovslowsopqtuxmrogeu.supabase.co/storage/v1/object/public/Blank/7200/black/ghost-front.png',
    'Black, White, Sport Grey, Navy, Maroon, Red, Royal Blue, Irish Green, Daisy, Forest Green, Charcoal, Gold, Dark Chocolate, Military Green, Carolina Blue, Orange, Light Pink, Sand, Purple, Black Heather, Navy Heather, Red Heather, Dark Green Heather, Burgundy Heather, Aqua Sky, Butter, Green Ash, Lilac, Salmon, Mustard, Lime, Chestnut, Sapphire, Heliconia',
    'S, M, L, XL, 2XL, 3XL, 4XL, 5XL',
    52000, -- Harga retail dasar warna (White otomatis Rp 49.000 di web)
    44000, -- Harga reseller dasar warna (White otomatis Rp 41.000 di web)
    42000, -- Modal dasar vendor warna (White Rp 39.000)
    0,
    true,
    'Kaos Polos New States Apparel Premium Cotton 7200 24s Original Cititex — TeeStock',
    'Kaos polos New States Apparel (NSA) Premium Cotton 7200 katun combed 24s (gramasi 180 g/m²). Rajutan tubular tanpa sambungan samping, jahitan rantai rapi, kerah rib tebal anti-melar, sangat adem dan nyaman untuk daily wear maupun sablon distro.'
)
ON CONFLICT (sku) DO UPDATE SET
    name = EXCLUDED.name,
    file_path = EXCLUDED.file_path,
    colors = EXCLUDED.colors,
    sizes = EXCLUDED.sizes,
    price_retail = EXCLUDED.price_retail,
    price_reseller = EXCLUDED.price_reseller,
    cost_blank = EXCLUDED.cost_blank,
    description = EXCLUDED.description;

-- 2. INSERT / UPSERT UNIT ECONOMICS NSA 7200
INSERT INTO ts_unit_economics (
    product_sku, cost_blank, cost_dtf, cost_press, cost_pack,
    cost_overhead, cost_design, price_retail, price_dropship,
    price_reseller, print_area
) VALUES
(
    'TS-BLK-7200',
    42000, -- Modal vendor (Color)
    0,     -- Tanpa sablon
    0,     -- Tanpa biaya press
    3500,  -- Biaya kemasan polymailer + thank you card
    1500,  -- Listrik & operasional
    0,     -- Tanpa biaya desain
    52000, -- Harga jual retail (Untung bersih Rp 10.000)
    44000, -- Harga dropship (Untung bersih Rp 2.000)
    44000, -- Harga mitra reseller (Untung bersih Rp 2.000)
    'Polos (No Print)'
)
ON CONFLICT (product_sku) DO UPDATE SET
    cost_blank = EXCLUDED.cost_blank,
    price_retail = EXCLUDED.price_retail,
    price_dropship = EXCLUDED.price_dropship,
    price_reseller = EXCLUDED.price_reseller;

COMMIT;
