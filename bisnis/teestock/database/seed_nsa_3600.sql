-- ====================================================================
-- TEESTOCK APPAREL — NSA 3600 (30s) SOFTSTYLE SEED
-- Target: Supabase PostgreSQL (ts_products & ts_unit_economics)
-- Assets: Hosted on Supabase Storage bucket [Blank/3600/ghost-front/] & [Blank/7200/]
-- ====================================================================

BEGIN;

-- 1. INSERT / UPSERT PRODUK NSA 3600 SOFTSTYLE
INSERT INTO ts_products (
    sku, name, series, series_name, series_color, niche, batch, template,
    status, license_source, file_path, colors, sizes, price_retail,
    price_reseller, cost_blank, cost_dtf, featured, seo_title, description
) VALUES
(
    'TS-BLK-3600',
    'New States Apparel Softstyle 3600',
    'blank',
    'NSA Blank Apparel',
    '#EBE3D5',
    'Kaos Polos Ring Spun 30s Softstyle 3600',
    'Katalog Polos',
    'blank',
    'active',
    'Distributor Resmi NSA (Cititex)',
    'https://tovslowsopqtuxmrogeu.supabase.co/storage/v1/object/public/Blank/3600/ghost-front/black.png',
    'White, Black, Red, Navy, Royal Blue, Maroon, Irish Green, Sport Grey, Charcoal, Forest Green, Dark Chocolate, Daisy, Heliconia, Orange, Sand, Carolina Blue, Lime, Light Pink, Sapphire, Purple, Gold, Chestnut, Military Green, Aqua Sky, Lilac, Butter, Green Ash, Salmon',
    'S, M, L, XL, 2XL',
    37000, -- Harga retail dasar warna (White otomatis Rp 34.000 di web)
    35000, -- Harga reseller / grosir ≥12 pcs dasar warna (White otomatis Rp 32.000)
    30000, -- Modal dasar vendor partai (White Rp 27.000)
    0,
    true,
    'Kaos Polos New States Apparel Softstyle 3600 30s Original Cititex — TeeStock',
    'Kaos polos New States Apparel (NSA) Softstyle 3600 100% Ring Spun Cotton 30s (gramasi 150 g/m²). Rajutan tubular built-up tanpa sambungan samping, jahitan rantai rapi, kerah rib kokoh anti-melar, sangat adem, ringan, dan lembut untuk iklim tropis maupun sablon DTF.'
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

-- 2. INSERT / UPSERT UNIT ECONOMICS NSA 3600
INSERT INTO ts_unit_economics (
    product_sku, cost_blank, cost_dtf, cost_press, cost_pack,
    cost_overhead, cost_design, price_retail, price_dropship,
    price_reseller, print_area
) VALUES
(
    'TS-BLK-3600',
    30000, -- Modal vendor HPP partai (Color) / Rp 27.000 (White)
    0,     -- Tanpa sablon
    0,     -- Tanpa biaya press
    3500,  -- Biaya kemasan polymailer + thank you card
    1500,  -- Listrik & operasional
    0,     -- Tanpa biaya desain
    37000, -- Harga retail (Color Rp 37.000 / White Rp 34.000)
    35000, -- Harga dropship / grosir lusinan (Color Rp 35.000 / White Rp 32.000)
    35000, -- Harga reseller (Color Rp 35.000 / White Rp 32.000, partai ≥72 Rp 32.000 / Rp 29.000)
    'Polos (No Print)'
)
ON CONFLICT (product_sku) DO UPDATE SET
    cost_blank = EXCLUDED.cost_blank,
    price_retail = EXCLUDED.price_retail,
    price_dropship = EXCLUDED.price_dropship,
    price_reseller = EXCLUDED.price_reseller;

COMMIT;
