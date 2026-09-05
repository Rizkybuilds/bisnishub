/**
 * TeeStock — Cloud Supabase Sync CLI
 * 
 * Penggunaan:
 * 1. Jika punya Service Role Key:
 *    set SUPABASE_SERVICE_ROLE_KEY=your_key_here
 *    node sync-supabase.mjs
 * 
 * 2. Tanpa key service_role:
 *    Jalankan file SQL 'update-nsa-blanks.sql' di Supabase SQL Editor:
 *    https://supabase.com/dashboard/project/tovslowsopqtuxmrogeu/sql/new
 */

import { SEED_PRODUCTS } from '../web/src/constants/seedData.js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://tovslowsopqtuxmrogeu.supabase.co';
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function run() {
  console.log("=== TEESTOCK CLOUD SUPABASE SYNC ===");
  console.log("Target Project:", SUPABASE_URL);

  if (!SERVICE_KEY) {
    console.log("\n⚠️  SUPABASE_SERVICE_ROLE_KEY tidak terdeteksi di environment.");
    console.log("ℹ️  Tabel ts_products memiliki Row Level Security (RLS) di mana public/anon key hanya memiliki izin READ.");
    console.log("\n📋 CARA UPDATE CLOUD SUPABASE:");
    console.log("1. Buka browser: https://supabase.com/dashboard/project/tovslowsopqtuxmrogeu/sql/new");
    console.log("2. Copy isi file: bisnis/teestock/database/update-nsa-blanks.sql");
    console.log("3. Paste dan klik tombol 'Run' (Ctrl + Enter).");
    console.log("\nSelesai! Seluruh 12 produk Blank NSA Cititex akan langsung tersinkronisasi ke Cloud.");
    return;
  }

  console.log("🚀 Service role key terdeteksi. Memulai sinkronisasi otomatis...");

  const headers = {
    'apikey': SERVICE_KEY,
    'Authorization': `Bearer ${SERVICE_KEY}`,
    'Content-Type': 'application/json',
    'Prefer': 'resolution=merge-duplicates,return=representation'
  };

  const blankProducts = SEED_PRODUCTS.filter(p => p.series === 'blank');
  console.log(`Mengirim ${blankProducts.length} produk blank ke ts_products...`);

  const prodRows = blankProducts.map(p => ({
    sku: p.sku,
    name: p.name,
    series: p.series,
    series_name: p.seriesName || p.series,
    series_color: '#EBE3D5',
    niche: p.niche,
    batch: 'Katalog Polos',
    template: 'blank',
    status: 'active',
    license_source: 'Official Cititex',
    file_path: p.filePath,
    colors: p.colors,
    sizes: p.sizes,
    seo_title: `Kaos Polos NSA ${p.name} Cititex — TeeStock`,
    description: p.description
  }));

  const res1 = await fetch(`${SUPABASE_URL}/rest/v1/ts_products?on_conflict=sku`, {
    method: 'POST',
    headers,
    body: JSON.stringify(prodRows)
  });

  if (!res1.ok) {
    console.error("Gagal sync ts_products:", await res1.text());
    return;
  }
  console.log("✅ Sukses sync ts_products!");

  const ueRows = blankProducts.map(p => ({
    product_sku: p.sku,
    cost_blank: p.costBlank,
    cost_dtf: 0,
    cost_press: 0,
    cost_pack: 3500,
    cost_overhead: 1500,
    cost_design: 0,
    price_retail: p.priceRetail,
    price_dropship: Math.round(p.priceRetail * 0.9),
    price_reseller: p.priceReseller,
    print_area: 'Polos (No Print)'
  }));

  const res2 = await fetch(`${SUPABASE_URL}/rest/v1/ts_unit_economics?on_conflict=product_sku`, {
    method: 'POST',
    headers,
    body: JSON.stringify(ueRows)
  });

  if (!res2.ok) {
    console.error("Gagal sync ts_unit_economics:", await res2.text());
    return;
  }
  console.log("✅ Sukses sync ts_unit_economics!");
  console.log("🎉 Sinkronisasi Cloud Supabase Selesai 100%!");
}

run().catch(console.error);
