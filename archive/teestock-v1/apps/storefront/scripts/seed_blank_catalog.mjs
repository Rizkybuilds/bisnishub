import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://tovslowsopqtuxmrogeu.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_8iRmZUulGLChIPZhFXn_rg_QuHlmpA4';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const BLANK_PRODUCTS = [
  {
    sku: 'TS-BLK-7200',
    name: 'New States Apparel Premium Cotton 7200 (24s)',
    series: 'blank',
    series_name: 'NSA Blank Apparel',
    series_color: '#EBE3D5',
    niche: 'Kaos Polos Combed 24s Regular Fit 7200',
    batch: 'Katalog Polos',
    template: 'blank',
    status: 'active',
    license_source: 'Distributor Resmi NSA (Cititex)',
    file_path: 'https://tovslowsopqtuxmrogeu.supabase.co/storage/v1/object/public/Blank/7200/black/ghost-front.png',
    colors: 'Black, White, Sport Grey, Navy, Maroon, Red, Royal Blue, Irish Green, Daisy, Forest Green, Charcoal, Gold, Dark Chocolate, Military Green, Carolina Blue, Orange, Light Pink, Sand, Purple, Black Heather, Navy Heather, Red Heather, Dark Green Heather, Burgundy Heather, Aqua Sky, Butter, Green Ash, Lilac, Salmon, Mustard, Lime, Chestnut, Sapphire, Heliconia',
    sizes: 'S, M, L, XL, 2XL, 3XL, 4XL, 5XL',
    price_retail: 45000,
    price_reseller: 43000,
    cost_blank: 42000,
    cost_dtf: 0,
    featured: true,
    seo_title: 'Kaos Polos New States Apparel Premium Cotton 7200 24s Original Cititex — TeeStock',
    description: 'Kaos polos New States Apparel (NSA) Premium Cotton 7200 katun combed 24s (gramasi 180 g/m²). Rajutan tubular tanpa sambungan samping, jahitan rantai rapi, kerah rib tebal anti-melar, sangat adem dan nyaman untuk daily wear maupun sablon distro.'
  },
  {
    sku: 'TS-BLK-3600',
    name: 'New States Apparel Softstyle 3600 (30s)',
    series: 'blank',
    series_name: 'NSA Blank Apparel',
    series_color: '#EBE3D5',
    niche: 'Kaos Polos Ring Spun 30s Softstyle 3600',
    batch: 'Katalog Polos',
    template: 'softstyle_30s',
    status: 'active',
    license_source: 'Distributor Resmi NSA (Cititex)',
    file_path: 'https://tovslowsopqtuxmrogeu.supabase.co/storage/v1/object/public/Blank/3600/ghost-front/black.png',
    colors: 'White, Black, Red, Navy, Royal Blue, Maroon, Irish Green, Sport Grey, Charcoal, Forest Green, Dark Chocolate, Daisy, Heliconia, Orange, Sand, Carolina Blue, Lime, Light Pink, Sapphire, Purple, Gold, Chestnut, Military Green, Aqua Sky, Lilac, Butter, Green Ash, Salmon, Mustard',
    sizes: 'S, M, L, XL, 2XL',
    price_retail: 40000,
    price_reseller: 38000,
    cost_blank: 37000,
    cost_dtf: 0,
    featured: true,
    seo_title: 'Kaos Polos New States Apparel Softstyle 3600 30s Original Cititex — TeeStock',
    description: 'Kaos polos New States Apparel (NSA) Softstyle 3600 100% Ring Spun Cotton 30s (gramasi 150 g/m²). Rajutan tubular built-up tanpa sambungan samping, jahitan rantai rapi, kerah rib kokoh anti-melar, sangat adem, ringan, dan lembut untuk iklim tropis maupun sablon DTF.'
  },
  {
    sku: 'TS-BLK-7280',
    name: 'New States Apparel Premium Cotton Long Sleeve 7280 (24s)',
    series: 'blank',
    series_name: 'NSA Blank Apparel',
    series_color: '#EBE3D5',
    niche: 'Kaos Polos Lengan Panjang 24s Long Sleeve 7280',
    batch: 'Katalog Polos',
    template: 'blank',
    status: 'active',
    license_source: 'Distributor Resmi NSA (Cititex)',
    file_path: 'https://tovslowsopqtuxmrogeu.supabase.co/storage/v1/object/public/Blank/7200/black/ghost-front.png',
    colors: 'Black, White, Sport Grey, Navy, Maroon, Red, Royal Blue, Irish Green, Daisy, Forest Green, Charcoal, Gold, Dark Chocolate, Military Green, Carolina Blue, Orange, Light Pink, Sand, Purple, Black Heather, Navy Heather, Red Heather, Dark Green Heather, Burgundy Heather, Aqua Sky, Butter, Green Ash, Lilac, Salmon, Mustard, Lime, Chestnut, Sapphire, Heliconia',
    sizes: 'S, M, L, XL, 2XL, 3XL, 4XL, 5XL',
    price_retail: 59000,
    price_reseller: 57000,
    cost_blank: 56000,
    cost_dtf: 0,
    featured: false,
    seo_title: 'Kaos Polos New States Apparel Long Sleeve 7280 24s Original Cititex — TeeStock',
    description: 'Kaos polos lengan panjang New States Apparel (NSA) Premium Cotton Long Sleeve 7280 combed 24s (gramasi 180 g/m²). Dilengkapi rib manset elastis tebal di pergelangan tangan, tubular construction tanpa sambungan samping.'
  },
  {
    sku: 'TS-BLK-72Y00',
    name: 'New States Apparel Premium Cotton Youth Kids 72Y00 (24s)',
    series: 'blank',
    series_name: 'NSA Blank Apparel',
    series_color: '#EBE3D5',
    niche: 'Kaos Polos Anak 24s Youth Kids 72Y00',
    batch: 'Katalog Polos',
    template: 'blank',
    status: 'active',
    license_source: 'Distributor Resmi NSA (Cititex)',
    file_path: 'https://tovslowsopqtuxmrogeu.supabase.co/storage/v1/object/public/Blank/7200/black/ghost-front.png',
    colors: 'Black, White, Sport Grey, Navy, Maroon, Red, Royal Blue, Irish Green, Daisy, Forest Green, Charcoal, Gold, Dark Chocolate, Military Green, Carolina Blue, Orange, Light Pink, Sand, Purple, Black Heather, Navy Heather, Red Heather, Dark Green Heather, Burgundy Heather, Aqua Sky, Butter, Green Ash, Lilac, Salmon, Mustard, Lime, Chestnut, Sapphire, Heliconia',
    sizes: 'XS, S, M, L, XL',
    price_retail: 36000,
    price_reseller: 34000,
    cost_blank: 33000,
    cost_dtf: 0,
    featured: false,
    seo_title: 'Kaos Polos Anak New States Apparel Youth Kids 72Y00 24s Original — TeeStock',
    description: 'Kaos polos anak New States Apparel (NSA) Youth 72Y00 katun combed 24s (180 g/m²). Single-needle collar, 1x1 cotton rib leher, bahan sangat halus, adem, dan aman untuk kulit si kecil.'
  },
  {
    sku: 'TS-BLK-7250',
    name: 'New States Apparel Premium Cotton Ringer 7250 (24s)',
    series: 'blank',
    series_name: 'NSA Blank Apparel',
    series_color: '#EBE3D5',
    niche: 'Kaos Polos Ringer Retro Contrast 24s 7250',
    batch: 'Katalog Polos',
    template: 'blank',
    status: 'active',
    license_source: 'Distributor Resmi NSA (Cititex)',
    file_path: 'https://tovslowsopqtuxmrogeu.supabase.co/storage/v1/object/public/Blank/7200/white/ghost-front.png',
    colors: 'White-Black, White-Navy, White-Maroon, White-Red, White-Forest Green, White-Gold, White-Royal Blue, Sport Grey-Black, Sport Grey-Navy, Sport Grey-Maroon, Sport Grey-Red',
    sizes: 'S, M, L, XL, 2XL',
    price_retail: 48000,
    price_reseller: 46000,
    cost_blank: 45000,
    cost_dtf: 0,
    featured: false,
    seo_title: 'Kaos Polos Ringer New States Apparel 7250 Retro Vintage — TeeStock',
    description: 'Kaos polos ringer New States Apparel (NSA) 7250 combed 24s (180 g/m²). Aksen warna kontras retro 70s pada leher dan ujung lengan, tubular construction tanpa sambungan samping.'
  },
  {
    sku: 'TS-BLK-7260',
    name: 'New States Apparel Premium Cotton Raglan 3/4 7260 (24s)',
    series: 'blank',
    series_name: 'NSA Blank Apparel',
    series_color: '#EBE3D5',
    niche: 'Kaos Polos Raglan 3/4 Baseball 24s 7260',
    batch: 'Katalog Polos',
    template: 'blank',
    status: 'active',
    license_source: 'Distributor Resmi NSA (Cititex)',
    file_path: 'https://tovslowsopqtuxmrogeu.supabase.co/storage/v1/object/public/Blank/7200/white/ghost-front.png',
    colors: 'White-Black, White-Navy, White-Maroon, White-Red, White-Forest Green, White-Gold, White-Royal Blue, Sport Grey-Black, Sport Grey-Navy, Sport Grey-Maroon, Sport Grey-Red',
    sizes: 'S, M, L, XL, 2XL',
    price_retail: 58000,
    price_reseller: 56000,
    cost_blank: 55000,
    cost_dtf: 0,
    featured: false,
    seo_title: 'Kaos Polos Raglan 3/4 New States Apparel 7260 Baseball Style — TeeStock',
    description: 'Kaos polos raglan 3/4 New States Apparel (NSA) 7260 combed 24s (180 g/m²). Potongan raglan lengan 3/4 dua warna gaya baseball kasual sporty, tubular construction.'
  }
];

async function seed() {
  console.log('Seeding 6 NSA blank models to Supabase Cloud...');

  for (const prod of BLANK_PRODUCTS) {
    // 1. Upsert ts_products
    const { error: prodErr } = await supabase
      .from('ts_products')
      .upsert(prod, { onConflict: 'sku' });

    if (prodErr) {
      console.error(`Error upserting product ${prod.sku}:`, prodErr);
    } else {
      console.log(`✓ Product ${prod.sku} upserted successfully`);
    }

    // 2. Upsert ts_unit_economics
    const unitEcon = {
      product_sku: prod.sku,
      cost_blank: prod.cost_blank,
      cost_dtf: 0,
      cost_press: 0,
      cost_pack: 3500,
      cost_overhead: 1000,
      cost_design: 0,
      price_retail: prod.price_retail,
      price_dropship: prod.price_reseller,
      price_reseller: prod.price_reseller,
      print_area: 'Polos (No Print)'
    };

    const { error: econErr } = await supabase
      .from('ts_unit_economics')
      .upsert(unitEcon, { onConflict: 'product_sku' });

    if (econErr) {
      console.warn(`Notice upserting unit economics for ${prod.sku}:`, econErr.message);
    } else {
      console.log(`✓ Unit economics for ${prod.sku} upserted successfully`);
    }
  }

  console.log('Seeding completed!');
}

seed();
