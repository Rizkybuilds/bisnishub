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
const TRACK_PATH = '/functions/v1/track-order';
const REVIEW_PATH = '/functions/v1/submit-review';
const RPC_ORDER_PATH = '/rest/v1/rpc/create_order_transactional';
const RPC_VOUCHER_PATH = '/rest/v1/rpc/increment_voucher_usage';
const RPC_TRACK_PATH = '/rest/v1/rpc/track_guest_order';
const RPC_INCREMENT_REVIEW_PATH = '/rest/v1/rpc/increment_review_helpful';
const RPC_VOTE_REVIEW_PATH = '/rest/v1/rpc/vote_review_helpful';
const REVIEWS_TABLE_PATH = '/rest/v1/ts_reviews';
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
  // 1. Direct PostgREST RPC Access Blocked (SECURITY DEFINER Privilege Check)
  // ---------------------------------------------------------------------------
  console.log('1. Menguji Pemblokiran Akses Publik Langsung ke Database RPCs...');
  
  // 1a. create_order_transactional
  try {
    const resOrderRpc = await makeRequest(RPC_ORDER_PATH, {
      method: 'POST',
      body: { p_order: {}, p_items: [] }
    });
    const isBlocked = resOrderRpc.status === 404 || resOrderRpc.status === 401 || resOrderRpc.status === 403;
    assert(isBlocked, 'create_order_transactional harus diblokir dari anon (404/401/403)', `Status: ${resOrderRpc.status}`);
  } catch (err) {
    assert(false, 'Request RPC create_order_transactional harus dieksekusi', err.message);
  }

  // 1b. increment_voucher_usage
  try {
    const resVoucherRpc = await makeRequest(RPC_VOUCHER_PATH, {
      method: 'POST',
      body: { voucher_code: 'TESTPROMO' }
    });
    const isBlocked = resVoucherRpc.status === 404 || resVoucherRpc.status === 401 || resVoucherRpc.status === 403;
    assert(isBlocked, 'increment_voucher_usage harus diblokir dari anon (404/401/403)', `Status: ${resVoucherRpc.status}`);
  } catch (err) {
    assert(false, 'Request RPC increment_voucher_usage harus dieksekusi', err.message);
  }

  // 1c. track_guest_order
  try {
    const resTrackRpc = await makeRequest(RPC_TRACK_PATH, {
      method: 'POST',
      body: { p_order_no: 'TS-TEST-0000', p_phone_last4: '1234' }
    });
    const isBlocked = resTrackRpc.status === 404 || resTrackRpc.status === 401 || resTrackRpc.status === 403;
    assert(isBlocked, 'track_guest_order harus diblokir dari anon (404/401/403)', `Status: ${resTrackRpc.status}`);
  } catch (err) {
    assert(false, 'Request RPC track_guest_order harus dieksekusi', err.message);
  }

  // 1d. ts_reviews direct public insert blocked by RLS
  try {
    const resReviewDirect = await makeRequest(REVIEWS_TABLE_PATH, {
      method: 'POST',
      body: {
        product_sku: 'TS-BLK-7200',
        author_name: 'Attacker',
        content: 'Fake Review Direct Insert',
        is_verified: true,
        role_badge: 'Verified Buyer'
      }
    });
    const isBlocked = resReviewDirect.status === 401 || resReviewDirect.status === 403 || resReviewDirect.status === 404;
    assert(isBlocked, 'Direct insert ke ts_reviews via anon key harus ditolak RLS (401/403)', `Status: ${resReviewDirect.status}`);
  } catch (err) {
    assert(false, 'Request direct insert ts_reviews harus dieksekusi', err.message);
  }

  // 1e. increment_review_helpful (Direct unauthenticated counter increment blocked)
  try {
    const resIncHelpful = await makeRequest(RPC_INCREMENT_REVIEW_PATH, {
      method: 'POST',
      body: { review_id: '00000000-0000-0000-0000-000000000000' }
    });
    const isBlocked = resIncHelpful.status === 404 || resIncHelpful.status === 401 || resIncHelpful.status === 403;
    assert(isBlocked, 'increment_review_helpful harus diblokir dari anon (404/401/403)', `Status: ${resIncHelpful.status}`);
  } catch (err) {
    assert(false, 'Request RPC increment_review_helpful harus dieksekusi', err.message);
  }

  // 1f. vote_review_helpful (Audited 1-vote-per-identity RPC accessible and validates inputs)
  try {
    const resVoteRpc = await makeRequest(RPC_VOTE_REVIEW_PATH, {
      method: 'POST',
      body: {
        p_review_id: '00000000-0000-0000-0000-000000000000',
        p_voter_id: 'test_voter_unit'
      }
    });
    // Menghasilkan 200 dengan payload { success: false, message: 'Ulasan tidak ditemukan' }
    const isValidResponse = resVoteRpc.status === 200 && resVoteRpc.data?.success === false;
    assert(isValidResponse, 'vote_review_helpful dapat diakses dan memvalidasi eksistensi ulasan', `Status: ${resVoteRpc.status}, Msg: ${resVoteRpc.data?.message}`);
  } catch (err) {
    assert(false, 'Request RPC vote_review_helpful harus dieksekusi', err.message);
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
  // 5. Edge Function track-order Security & Validation
  // ---------------------------------------------------------------------------
  console.log('\n5. Menguji Edge Function track-order (Privacy & Validation)...');
  try {
    // 5a. Request tanpa 4-digit nomor HP
    const resNoPhone = await makeRequest(TRACK_PATH, {
      method: 'POST',
      body: { orderNumber: 'TS-260914-A7FC', phoneLast4: '' }
    });
    assert(resNoPhone.status === 400, 'track-order harus tolak request tanpa 4-digit nomor HP (HTTP 400)', `Status: ${resNoPhone.status}`);

    // 5b. Request dengan nomor pesanan acak / tidak ada
    const resNotFound = await makeRequest(TRACK_PATH, {
      method: 'POST',
      body: { orderNumber: 'TS-999999-XXXX', phoneLast4: '9999' }
    });
    assert(resNotFound.status === 404, 'track-order harus respons 404 untuk kombinasi tidak cocok/tidak ada', `Status: ${resNotFound.status}`);
  } catch (err) {
    assert(false, 'Request track-order test harus dapat dieksekusi', err.message);
  }

  // ---------------------------------------------------------------------------
  // 6. Edge Function submit-review Validation
  // ---------------------------------------------------------------------------
  console.log('\n6. Menguji Edge Function submit-review (Input Validation)...');
  try {
    // 6a. Rating di luar range 1-5
    const resBadRating = await makeRequest(REVIEW_PATH, {
      method: 'POST',
      body: {
        productSku: 'TS-BLK-7200',
        authorName: 'Penilai',
        rating: 10,
        content: 'Review dengan rating tidak valid'
      }
    });
    assert(resBadRating.status === 400, 'submit-review harus tolak rating di luar 1-5 (HTTP 400)', `Status: ${resBadRating.status}`);

    // 6b. Konten ulasan terlalu pendek
    const resShortContent = await makeRequest(REVIEW_PATH, {
      method: 'POST',
      body: {
        productSku: 'TS-BLK-7200',
        authorName: 'Penilai',
        rating: 5,
        content: 'Hi'
      }
    });
    assert(resShortContent.status === 400, 'submit-review harus tolak ulasan < 5 karakter (HTTP 400)', `Status: ${resShortContent.status}`);
  } catch (err) {
    assert(false, 'Request submit-review test harus dapat dieksekusi', err.message);
  }

  // ---------------------------------------------------------------------------
  // 7. Mutating Cloud Order Flow (Diisolasi dengan RUN_MUTATING_TESTS=true)
  // ---------------------------------------------------------------------------
  if (process.env.RUN_MUTATING_TESTS === 'true') {
    console.log('\n7. Menguji Mutating Order Flow (Authoritative Pricing & Snap Token)...');
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
  // Ringkasan Hasil Suite
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

runSuite().catch((err) => {
  console.error('Fatal suite runner error:', err);
  process.exit(1);
});
