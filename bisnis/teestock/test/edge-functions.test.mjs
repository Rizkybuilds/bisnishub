/**
 * Automated Security & Integration Test Suite for TeeStock Edge Functions & RPC
 *
 * Safe execution:
 * - Read-only / Security rejection tests (Zero-Trust, CORS, Webhook Signature, Direct RPC blocking) run by default.
 * - Mutating live order tests only run when RUN_MUTATING_TESTS=true is specified.
 *
 * Run via: node test/edge-functions.test.mjs
 */

import https from 'node:https';

const SUPABASE_HOST = process.env.TEST_SUPABASE_HOST || 'tovslowsopqtuxmrogeu.supabase.co';
const CHECKOUT_PATH = '/functions/v1/create-checkout';
const WEBHOOK_PATH = '/functions/v1/midtrans-webhook';
const RPC_PATH = '/rest/v1/rpc/create_order_transactional';
const ANON_KEY = process.env.TEST_ANON_KEY || 'sb_publishable_8iRmZUulGLChIPZhFXn_rg_QuHlmpA4';

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

function makeRequest(path, options = {}) {
  return new Promise((resolve, reject) => {
    const postData = options.body ? (typeof options.body === 'string' ? options.body : JSON.stringify(options.body)) : null;

    const reqOptions = {
      hostname: SUPABASE_HOST,
      port: 443,
      path: path,
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
  console.log('🛡️ TEESTOCK SECURITY & EDGE FUNCTIONS REGRESSION GUARD');
  console.log('================================================================\n');

  // ---------------------------------------------------------------------------
  // 1. P0: Direct PostgREST RPC Access Blocked (SECURITY DEFINER Privilege Check)
  // ---------------------------------------------------------------------------
  console.log('1. Menguji Pemblokiran Akses Publik Langsung ke create_order_transactional (P0 RPC Lock)...');
  try {
    const resRpc = await makeRequest(RPC_PATH, {
      method: 'POST',
      body: { p_order: {}, p_items: [] }
    });

    // PostgREST mengembalikan 404 (schema cache hidden) atau 401/403 jika anonim tidak memiliki izin EXECUTE
    const isBlocked = resRpc.status === 404 || resRpc.status === 401 || resRpc.status === 403;
    assert(
      isBlocked,
      'Akses RPC publik langsung via anon key harus diblokir (404/401/403)',
      `Status diterima: ${resRpc.status}`
    );
  } catch (err) {
    assert(false, 'Request verifikasi privilege RPC harus dapat dieksekusi', err.message);
  }

  // ---------------------------------------------------------------------------
  // 2. Zero-Trust SKU Validation (Inactive / Fake SKU Rejected)
  // ---------------------------------------------------------------------------
  console.log('\n2. Menguji Penolakan SKU Tidak Aktif / Liar (Zero-Trust SKU)...');
  try {
    const res = await makeRequest(CHECKOUT_PATH, {
      method: 'POST',
      body: {
        customer: { name: 'Audit User', phone: '08123456789', address: 'Jl. Tes', city: 'Jakarta' },
        items: [{ sku: 'TS-INVALID-NONEXISTENT', qty: 1 }],
        paymentMethod: 'manual_qris'
      }
    });

    assert(res.status === 400, 'HTTP Status harus 400 Bad Request untuk SKU liar', `Diterima: ${res.status}`);
    assert(
      res.data?.status === 'error' && res.data?.message?.includes('TS-INVALID-NONEXISTENT'),
      'Pesan error harus secara spesifik menyebut SKU yang ditolak',
      res.raw
    );
  } catch (err) {
    assert(false, 'Request Zero-Trust SKU harus dapat dieksekusi', err.message);
  }

  // ---------------------------------------------------------------------------
  // 3. CORS Whitelist & Strict Domain Filtering
  // ---------------------------------------------------------------------------
  console.log('\n3. Menguji CORS Whitelist & Strict Domain Filtering...');
  try {
    // 3a. Domain resmi produksi
    const resProd = await makeRequest(CHECKOUT_PATH, {
      method: 'OPTIONS',
      headers: { 'Origin': 'https://teestockapparel.vercel.app' }
    });
    assert(
      resProd.headers['access-control-allow-origin'] === 'https://teestockapparel.vercel.app',
      'Domain produksi TeeStock harus diizinkan CORS'
    );

    // 3b. Domain preview Vercel TeeStock
    const resPreview = await makeRequest(CHECKOUT_PATH, {
      method: 'OPTIONS',
      headers: { 'Origin': 'https://teestock-git-preview-test.vercel.app' }
    });
    assert(
      resPreview.headers['access-control-allow-origin'] === 'https://teestock-git-preview-test.vercel.app',
      'Preview Vercel TeeStock harus diizinkan CORS'
    );

    // 3c. Domain liar / project Vercel pihak ketiga
    const resAttacker = await makeRequest(CHECKOUT_PATH, {
      method: 'OPTIONS',
      headers: { 'Origin': 'https://attacker-random-project.vercel.app' }
    });
    assert(
      resAttacker.headers['access-control-allow-origin'] !== 'https://attacker-random-project.vercel.app',
      'Domain luar (attacker.vercel.app) harus ditolak CORS'
    );
  } catch (err) {
    assert(false, 'Request CORS OPTIONS harus dapat dieksekusi', err.message);
  }

  // ---------------------------------------------------------------------------
  // 4. Midtrans Webhook Signature Security
  // ---------------------------------------------------------------------------
  console.log('\n4. Menguji Keamanan Webhook Midtrans (Signature Verification)...');
  try {
    const resHook = await makeRequest(WEBHOOK_PATH, {
      method: 'POST',
      body: {
        order_id: 'TS-NONEXISTENT-TEST',
        status_code: '200',
        gross_amount: '50000.00',
        signature_key: 'invalid-fake-signature-key-1234567890abcdef',
        transaction_status: 'settlement'
      }
    });

    assert(resHook.status === 401, 'Webhook harus menolak signature palsu dengan HTTP 401', `Diterima: ${resHook.status}`);
    assert(
      (resHook.data?.message || resHook.raw || '').toLowerCase().includes('signature'),
      'Pesan error webhook harus menyebut signature tidak valid'
    );
  } catch (err) {
    assert(false, 'Request Webhook Test harus dapat dieksekusi', err.message);
  }

  // ---------------------------------------------------------------------------
  // 5. Mutating Cloud Order Flow (Diisolasi dengan RUN_MUTATING_TESTS=true)
  // ---------------------------------------------------------------------------
  if (process.env.RUN_MUTATING_TESTS === 'true') {
    console.log('\n5. Menguji Mutating Order Flow (Authoritative Pricing & Snap Token)...');
    try {
      const res = await makeRequest(CHECKOUT_PATH, {
        method: 'POST',
        headers: { 'Origin': 'https://teestockapparel.vercel.app' },
        body: {
          customer: { name: '[AUTO-TEST-CLEANUP]', phone: '08123456789', address: 'Jl. Uji Keamanan', city: 'Jakarta Pusat' },
          items: [{ sku: 'TS-BLK-7200', price: 1000, qty: 1 }],
          shipping: { fee: 0, courier: 'J&T Express' },
          paymentMethod: 'manual_qris'
        }
      });

      assert(res.status === 200, 'Checkout berhasil diproses oleh server otoritatif', `Diterima: ${res.status}`);
      assert(res.data?.data?.subtotal === 52000, 'Subtotal dihitung sesuai katalog resmi (Rp 52.000)');
      assert(res.data?.data?.shippingFee === 10000, 'Ongkir dihitung berdasarkan zona Jabodetabek (Rp 10.000)');
      assert(res.data?.data?.uniqueCode >= 100 && res.data?.data?.uniqueCode <= 999, 'Kode unik 3-digit digenerate server');
      assert(res.data?.data?.userId === null, 'userId palsu dari body diabaikan dan diset null');
    } catch (err) {
      assert(false, 'Mutating test gagal dieksekusi', err.message);
    }
  } else {
    console.log('\nℹ️ Uji mutating pembuatan order dilewati untuk melindungi database produksi dari polusi.');
    console.log('   (Gunakan `RUN_MUTATING_TESTS=true node test/edge-functions.test.mjs` di environment staging)');
  }

  // ---------------------------------------------------------------------------
  // 6. Ringkasan Hasil Suite
  // ---------------------------------------------------------------------------
  console.log('\n================================================================');
  console.log(`📊 HASIL PENGUJIAN: ${passedTests}/${totalTests} UJI LULUS (${Math.round((passedTests/totalTests)*100)}%)`);
  if (failedTests === 0) {
    console.log('🎉 SELURUH SISTEM KEAMANAN & ARSITEKTUR BACKEND TERVERIFIKASI AMAN 100%!');
  } else {
    console.error(`⚠️ ADA ${failedTests} PENGUJIAN YANG GAGAL.`);
  }
  console.log('================================================================\n');

  if (failedTests > 0) {
    process.exit(1);
  }
}

runSuite();
