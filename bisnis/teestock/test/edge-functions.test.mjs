/**
 * Comprehensive Automated Test Suite for TeeStock Edge Functions & Webhook Security
 * Uses Node.js native https to ensure fast, reliable IPv4/IPv6 dual-stack resolution on Windows
 * Run via: node test/edge-functions.test.mjs
 */

import https from 'node:https';

const CHECKOUT_URL = 'https://tovslowsopqtuxmrogeu.supabase.co/functions/v1/create-checkout';
const WEBHOOK_URL = 'https://tovslowsopqtuxmrogeu.supabase.co/functions/v1/midtrans-webhook';
const ANON_KEY = 'sb_publishable_8iRmZUulGLChIPZhFXn_rg_QuHlmpA4';

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition, testName, details = '') {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✅ [PASS] ${testName}`);
  } else {
    failedTests++;
    console.error(`  ❌ [FAIL] ${testName} ${details ? `(${details})` : ''}`);
  }
}

function makeRequest(urlStr, options = {}) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(urlStr);
    const postData = options.body ? (typeof options.body === 'string' ? options.body : JSON.stringify(options.body)) : null;

    const reqOptions = {
      hostname: parsed.hostname,
      port: parsed.port || 443,
      path: parsed.pathname + parsed.search,
      method: options.method || 'GET',
      headers: {
        'apikey': ANON_KEY,
        ...(postData ? { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(postData) } : {}),
        ...(options.headers || {})
      },
      timeout: 15000
    };

    const req = https.request(reqOptions, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        let json = null;
        try {
          json = JSON.parse(data);
        } catch (_) {}
        resolve({
          status: res.statusCode,
          headers: res.headers,
          data: json,
          raw: data
        });
      });
    });

    req.on('error', (err) => reject(err));
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timed out after 15s'));
    });

    if (postData) {
      req.write(postData);
    }
    req.end();
  });
}

async function runSuite() {
  console.log('================================================================');
  console.log('🧪 TEESTOCK EDGE FUNCTIONS & SECURITY AUTOMATED TEST SUITE');
  console.log('================================================================\n');

  // ---------------------------------------------------------------------------
  // 1. Zero-Trust SKU Validation (Inactive / Non-existent SKU)
  // ---------------------------------------------------------------------------
  console.log('1. Menguji Penolakan SKU Tidak Aktif / Liar (Zero-Trust SKU)...');
  try {
    const res = await makeRequest(CHECKOUT_URL, {
      method: 'POST',
      body: {
        customer: { name: 'Audit User', phone: '08123456789', address: 'Jl. Tes', city: 'Jakarta' },
        items: [{ sku: 'TS-INVALID-NONEXISTENT', qty: 1 }],
        paymentMethod: 'manual_qris'
      }
    });

    assert(res.status === 400, 'HTTP Status harus 400 Bad Request untuk SKU liar', `Diterima: ${res.status}`);
    assert(
      res.data?.status === 'error' && res.data?.message.includes('TS-INVALID-NONEXISTENT'),
      'Pesan error harus secara spesifik menyebut SKU yang ditolak',
      res.raw
    );
  } catch (err) {
    assert(false, 'Request Zero-Trust SKU harus dapat dieksekusi', err.message);
  }

  // ---------------------------------------------------------------------------
  // 2. Server-Authoritative Price & Shipping Calculation
  // ---------------------------------------------------------------------------
  console.log('\n2. Menguji Server-Authoritative Pricing & Shipping Fee...');
  try {
    const res = await makeRequest(CHECKOUT_URL, {
      method: 'POST',
      headers: { 'Origin': 'https://teestockapparel.vercel.app' },
      body: {
        customer: { name: 'Audit User', phone: '08123456789', address: 'Jl. Merdeka', city: 'Jakarta Pusat' },
        items: [{ sku: 'TS-BLK-7200', price: 1000, qty: 1 }], // Manipulasi harga client Rp 1.000
        shipping: { fee: 0, courier: 'J&T Express' }, // Manipulasi ongkir client Rp 0
        paymentMethod: 'manual_qris'
      }
    });

    assert(res.status === 200, 'Checkout berhasil diproses oleh server otoritatif', `Diterima: ${res.status}`);
    assert(res.data?.data?.subtotal === 52000, 'Subtotal harus dihitung sesuai katalog resmi (Rp 52.000)', `Diterima: ${res.data?.data?.subtotal}`);
    assert(res.data?.data?.shippingFee === 10000, 'Ongkir harus dihitung berdasarkan zona Jabodetabek (Rp 10.000)', `Diterima: ${res.data?.data?.shippingFee}`);
    assert(res.data?.data?.uniqueCode >= 100 && res.data?.data?.uniqueCode <= 999, 'Kode unik 3-digit harus digenerate server (100-999)', `Diterima: ${res.data?.data?.uniqueCode}`);
    assert(
      res.data?.data?.grandTotal === 52000 + 10000 + res.data?.data?.uniqueCode,
      'Grand Total harus sama persis dengan subtotal + ongkir + uniqueCode',
      `Diterima: ${res.data?.data?.grandTotal}`
    );
  } catch (err) {
    assert(false, 'Request Authoritative Pricing harus dapat dieksekusi', err.message);
  }

  // ---------------------------------------------------------------------------
  // 3. User ID Spoofing Protection
  // ---------------------------------------------------------------------------
  console.log('\n3. Menguji Proteksi Identitas Pengguna (User ID Spoofing)...');
  try {
    const res = await makeRequest(CHECKOUT_URL, {
      method: 'POST',
      body: {
        userId: 'attacker-injected-uuid-999', // Injeksi ID palsu tanpa token JWT
        customer: { name: 'Audit User', phone: '08123456789', address: 'Jl. Merdeka', city: 'Jakarta' },
        items: [{ sku: 'TS-BLK-7200', qty: 1 }],
        paymentMethod: 'manual_qris'
      }
    });

    assert(
      res.data?.data?.userId === null,
      'userId palsu dari body harus diabaikan dan diset null jika tidak ada JWT valid',
      `Diterima: ${res.data?.data?.userId}`
    );
  } catch (err) {
    assert(false, 'Request User ID Spoofing harus dapat dieksekusi', err.message);
  }

  // ---------------------------------------------------------------------------
  // 3b. Midtrans Snap Token Live Generation
  // ---------------------------------------------------------------------------
  console.log('\n3b. Menguji Inisialisasi Sesi Midtrans Snap Token...');
  try {
    const res = await makeRequest(CHECKOUT_URL, {
      method: 'POST',
      headers: { 'Origin': 'https://teestockapparel.vercel.app' },
      body: {
        customer: { name: 'Budi Santoso', phone: '08123456789', address: 'Jl. Merdeka No. 5', city: 'Jakarta Pusat' },
        items: [{ sku: 'TS-BLK-7200', qty: 1 }],
        paymentMethod: 'midtrans_snap'
      }
    });

    assert(res.status === 200, 'Inisialisasi checkout Midtrans Snap berhasil', `Diterima: ${res.status}`);
    assert(Boolean(res.data?.data?.snapToken), 'Snap Token resmi berhasil terbit dari Midtrans', `Diterima: ${res.data?.data?.snapToken}`);
    assert(Boolean(res.data?.data?.redirectUrl), 'Redirect URL resmi berhasil terbit dari Midtrans', `Diterima: ${res.data?.data?.redirectUrl}`);
  } catch (err) {
    assert(false, 'Request Midtrans Snap Token harus dapat dieksekusi', err.message);
  }

  // ---------------------------------------------------------------------------
  // 4. CORS Whitelist & Strict Domain Filtering
  // ---------------------------------------------------------------------------
  console.log('\n4. Menguji CORS Whitelist & Strict Domain Filtering...');
  try {
    // 4a. Domain resmi produksi
    const resProd = await makeRequest(CHECKOUT_URL, {
      method: 'OPTIONS',
      headers: { 'Origin': 'https://teestockapparel.vercel.app' }
    });
    assert(
      resProd.headers['access-control-allow-origin'] === 'https://teestockapparel.vercel.app',
      'Domain produksi TeeStock harus diizinkan CORS',
      resProd.headers['access-control-allow-origin']
    );

    // 4b. Domain preview Vercel TeeStock
    const resPreview = await makeRequest(CHECKOUT_URL, {
      method: 'OPTIONS',
      headers: { 'Origin': 'https://teestock-git-preview-test.vercel.app' }
    });
    assert(
      resPreview.headers['access-control-allow-origin'] === 'https://teestock-git-preview-test.vercel.app',
      'Preview Vercel TeeStock harus diizinkan CORS',
      resPreview.headers['access-control-allow-origin']
    );

    // 4c. Domain liar / project Vercel pihak ketiga
    const resAttacker = await makeRequest(CHECKOUT_URL, {
      method: 'OPTIONS',
      headers: { 'Origin': 'https://attacker-random-project.vercel.app' }
    });
    assert(
      resAttacker.headers['access-control-allow-origin'] !== 'https://attacker-random-project.vercel.app',
      'Domain luar (attacker.vercel.app) harus ditolak CORS',
      resAttacker.headers['access-control-allow-origin']
    );
  } catch (err) {
    assert(false, 'Request CORS OPTIONS harus dapat dieksekusi', err.message);
  }

  // ---------------------------------------------------------------------------
  // 5. Midtrans Webhook Signature Security
  // ---------------------------------------------------------------------------
  console.log('\n5. Menguji Keamanan Webhook Midtrans (Signature Verification)...');
  try {
    // Kirim payload dengan signature palsu/acak
    const resHook = await makeRequest(WEBHOOK_URL, {
      method: 'POST',
      body: {
        order_id: 'TS-TEST-ORDER',
        status_code: '200',
        gross_amount: '50000.00',
        signature_key: 'invalid-fake-signature-key-1234567890abcdef',
        transaction_status: 'settlement'
      }
    });

    assert(resHook.status === 401, 'Webhook harus menolak signature palsu dengan HTTP 401', `Diterima: ${resHook.status}`);
    assert(
      (resHook.data?.message || resHook.raw || '').toLowerCase().includes('signature'),
      'Pesan error webhook harus menyebut signature tidak valid',
      resHook.raw
    );
  } catch (err) {
    assert(false, 'Request Webhook Test harus dapat dieksekusi', err.message);
  }

  // ---------------------------------------------------------------------------
  // 6. Ringkasan Hasil Suite
  // ---------------------------------------------------------------------------
  console.log('\n================================================================');
  console.log(`📊 HASIL PENGUJIAN: ${passedTests}/${totalTests} UJI LULUS (${Math.round((passedTests/totalTests)*100)}%)`);
  if (failedTests === 0) {
    console.log('🎉 SEMUA PENGUJIAN KEAMANAN & ARSITEKTUR BACKEND SUKSES 100%!');
  } else {
    console.error(`⚠️ ADA ${failedTests} PENGUJIAN YANG GAGAL.`);
  }
  console.log('================================================================\n');

  if (failedTests > 0) {
    process.exit(1);
  }
}

runSuite();
