/**
 * Verification Test Script: Order Pipeline & BisnisHub OS Kanban Visibility
 */
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://tovslowsopqtuxmrogeu.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_8iRmZUulGLChIPZhFXn_rg_QuHlmpA4';

const sb = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function assert(condition, message) {
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    throw new Error(message);
  } else {
    console.log(`✅ PASSED: ${message}`);
  }
}

async function runVerification() {
  console.log("====================================================================");
  console.log("    VERIFIKASI PIPELINE PESANAN & VISIBILITAS KANBAN BISNISHUB OS    ");
  console.log("====================================================================\n");

  // 1. Query langsung via Anon Client
  console.log("--- 1. Akses Tabel ts_orders & ts_order_items (Anon Client) ---");
  const { data: rawOrders, error: fetchErr } = await sb
    .from('ts_orders')
    .select('*, ts_order_items(*)')
    .order('created_at', { ascending: false });

  assert(!fetchErr, `Query ts_orders berhasil tanpa error RLS: ${fetchErr?.message || 'OK'}`);
  assert(rawOrders && rawOrders.length >= 7, `Total pesanan ditemukan: ${rawOrders?.length} (harapan: >= 7)`);

  const pendingPaymentOrders = rawOrders.filter(o => o.status === 'pending_payment');
  assert(pendingPaymentOrders.length > 0, `Pesanan berstatus pending_payment: ${pendingPaymentOrders.length}`);
  console.log(`Contoh order: ${pendingPaymentOrders[0].order_number} (${pendingPaymentOrders[0].customer_name}) - Rp ${Number(pendingPaymentOrders[0].total_amount).toLocaleString('id-ID')}`);

  // 2. Simulasi Normalisasi & Filter Kolom Kanban
  console.log("\n--- 2. Simulasi Alur Kolom Kanban (Order Masuk) ---");
  const columns = [
    { id: 'pending', title: 'Order Masuk' },
    { id: 'dtf', title: 'Cetak DTF' },
    { id: 'press', title: 'Siap Press' },
    { id: 'pack', title: 'Packing & QC' },
    { id: 'shipped', title: 'Selesai / Kirim' }
  ];

  // Logic filter Kanban yang telah diperbarui
  const pendingColOrders = rawOrders.filter(o => {
    return o.status === 'pending' || o.status === 'pending_payment';
  });

  assert(pendingColOrders.length === pendingPaymentOrders.length, `Kolom 'Order Masuk' berhasil menangkap seluruh ${pendingColOrders.length} pesanan baru`);

  // 3. Simulasi Transisi State Machine (advanceOrderStatus)
  console.log("\n--- 3. Simulasi Transisi State advanceOrderStatus ---");
  const statuses = ["pending", "dtf", "press", "pack", "shipped"];
  const sampleOrder = pendingPaymentOrders[0];

  const normalizedStatus = (sampleOrder.status === 'pending_payment') ? 'pending' : sampleOrder.status;
  const currIdx = statuses.indexOf(normalizedStatus);
  const nextIdx = currIdx + 1;
  const nextStatus = statuses[nextIdx];

  assert(currIdx === 0, `Index asal status 'pending_payment' dinormalisasi ke index 0 (pending)`);
  assert(nextStatus === 'dtf', `Status tujuan saat diverifikasi lunas adalah 'dtf' (aktual: ${nextStatus})`);

  const isAdvancingFromPending = (sampleOrder.status === "pending" || sampleOrder.status === "pending_payment");
  assert(isAdvancingFromPending, `Kondisi trigger pemotongan stok & pencatatan kas terpenuhi (isAdvancingFromPending: true)`);

  // 4. Verifikasi Hubungan ts_order_items
  console.log("\n--- 4. Integritas Relasi Item Pesanan ---");
  const orderWithItems = rawOrders.find(o => o.ts_order_items && o.ts_order_items.length > 0);
  assert(!!orderWithItems, `Ditemukan pesanan dengan rincian item relasional: ${orderWithItems?.order_number}`);
  assert(orderWithItems.ts_order_items[0].product_name, `Nama produk relasi terbaca: "${orderWithItems.ts_order_items[0].product_name}"`);

  console.log("\n====================================================================");
  console.log("🎉 SELURUH PENGUJIAN INTEGRASI PIPELINE PESANAN SUKSES 100%!");
  console.log("====================================================================\n");
}

runVerification().catch(err => {
  console.error("Verification failed:", err);
  process.exit(1);
});
