/**
 * TeeStock Payment Gateway Dynamic Adapter Layer
 * Supports Manual QRIS (WhatsApp verification), Midtrans Snap (Dynamic QRIS/VA), and Mock Instant Gateway
 */

export const PAYMENT_PROVIDERS = {
  MANUAL_QRIS: 'manual_qris',
  MIDTRANS_SNAP: 'midtrans_snap',
  MOCK_INSTANT: 'mock_instant'
};

export const PAYMENT_METHODS = [
  {
    id: PAYMENT_PROVIDERS.MANUAL_QRIS,
    name: 'QRIS & Transfer Bank (Manual)',
    badge: 'Bebas Biaya Admin',
    badgeColor: 'bg-ts-green/20 text-ts-green border-ts-green/40',
    description: 'Scan barcode QRIS atau transfer BCA resmi + kode unik 3-digit. Konfirmasi via WhatsApp.',
    isDefault: true
  },
  {
    id: PAYMENT_PROVIDERS.MIDTRANS_SNAP,
    name: 'QRIS Otomatis & Virtual Account (Midtrans)',
    badge: 'Verifikasi Instan 24 Jam',
    badgeColor: 'bg-sky-500/20 text-sky-400 border-sky-500/40',
    description: 'Bayar instan via GoPay, ShopeePay, QRIS Dinamis, BCA/Mandiri/BRI/BNI Virtual Account.',
    isDefault: false
  }
];

/**
 * Dynamically inject Midtrans Snap JS SDK
 */
export function loadMidtransScript(clientKey, isProduction = false) {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      return resolve(null);
    }

    if (window.snap) {
      return resolve(window.snap);
    }

    const scriptId = 'midtrans-snap-script';
    const existingScript = document.getElementById(scriptId);
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(window.snap));
      existingScript.addEventListener('error', (err) => reject(err));
      return;
    }

    const script = document.createElement('script');
    script.id = scriptId;
    script.src = isProduction 
      ? 'https://app.midtrans.com/snap/snap.js'
      : 'https://app.sandbox.midtrans.com/snap/snap.js';
    script.setAttribute('data-client-key', clientKey || '');
    script.async = true;

    script.onload = () => resolve(window.snap);
    script.onerror = (err) => reject(new Error('Gagal memuat script pembayaran Midtrans Snap: ' + err.message));

    document.head.appendChild(script);
  });
}

/**
 * Format order details into standard Midtrans Snap transaction parameter
 */
export function formatMidtransTransactionParameter(order) {
  const items = (order.items || []).map((item, idx) => ({
    id: String(item.sku || item.product_sku || `ITEM-${idx + 1}`).slice(0, 50),
    price: Math.round(Number(item.price || item.unit_price || 0)),
    quantity: Math.max(1, Number(item.qty || 1)),
    name: String(item.name || item.product_name || 'Kaos TeeStock').slice(0, 50)
  }));

  // Append shipping fee item if exists
  if (order.shipping_fee && Number(order.shipping_fee) > 0) {
    items.push({
      id: 'SHIPPING-FEE',
      price: Math.round(Number(order.shipping_fee)),
      quantity: 1,
      name: `Ongkir (${order.shipping_zone || 'Reguler'})`
    });
  }

  // Handle discounts as negative item if present
  if (order.discount_amount && Number(order.discount_amount) > 0) {
    items.push({
      id: 'DISCOUNT-VOUCHER',
      price: -Math.round(Number(order.discount_amount)),
      quantity: 1,
      name: 'Diskon Promosi / Voucher'
    });
  }

  const grossAmount = Math.round(Number(order.total_amount || order.price || 0));

  return {
    transaction_details: {
      order_id: String(order.order_number || order.id),
      gross_amount: grossAmount
    },
    customer_details: {
      first_name: String(order.customer_name || order.customer || 'Pelanggan').slice(0, 50),
      phone: String(order.customer_phone || order.phone || '').slice(0, 30),
      billing_address: {
        address: String(order.customer_address || order.address || '').slice(0, 200),
        city: String(order.customer_city || order.city || '').slice(0, 100)
      }
    },
    item_details: items,
    enabled_payments: [
      'gopay',
      'shopeepay',
      'qris',
      'bca_va',
      'mandiri_va',
      'bni_va',
      'bri_va',
      'other_va'
    ]
  };
}

/**
 * Primary Payment Session Dispatcher
 */
export async function createPaymentSession(order, providerId = PAYMENT_PROVIDERS.MANUAL_QRIS, options = {}) {
  const cleanProvider = providerId || PAYMENT_PROVIDERS.MANUAL_QRIS;

  // 1. MANUAL QRIS (Existing standard flow)
  if (cleanProvider === PAYMENT_PROVIDERS.MANUAL_QRIS) {
    return {
      status: 'pending',
      provider: PAYMENT_PROVIDERS.MANUAL_QRIS,
      orderId: order.order_number || order.id,
      grossAmount: order.total_amount || order.price,
      uniqueCode: order.unique_code || order.uniqueCode || 0,
      requiresManualVerification: true,
      message: 'Silakan transfer ke rekening resmi atau scan QRIS'
    };
  }

  // 2. MOCK INSTANT (For automated testing / local sandbox verification)
  if (cleanProvider === PAYMENT_PROVIDERS.MOCK_INSTANT) {
    return {
      status: 'success',
      provider: PAYMENT_PROVIDERS.MOCK_INSTANT,
      orderId: order.order_number || order.id,
      grossAmount: order.total_amount || order.price,
      transactionId: `MOCK-TX-${Date.now()}`,
      paidAt: new Date().toISOString(),
      requiresManualVerification: false,
      message: 'Pembayaran instan berhasil disimulasikan'
    };
  }

  // 3. MIDTRANS SNAP GATEWAY
  if (cleanProvider === PAYMENT_PROVIDERS.MIDTRANS_SNAP) {
    const clientKey = options.clientKey || (typeof import.meta !== 'undefined' && import.meta.env?.VITE_MIDTRANS_CLIENT_KEY);
    const isProduction = options.isProduction || (typeof import.meta !== 'undefined' && import.meta.env?.VITE_MIDTRANS_IS_PRODUCTION === 'true');

    // If client key is not configured, gracefully fallback to sandbox simulation
    if (!clientKey) {
      return {
        status: 'simulation',
        provider: PAYMENT_PROVIDERS.MIDTRANS_SNAP,
        orderId: order.order_number || order.id,
        grossAmount: order.total_amount || order.price,
        token: `SNAP-SIM-${Date.now()}`,
        isSimulated: true,
        message: 'Mode simulasi sandbox payment gateway aktif (API Key belum dipasang)'
      };
    }

    try {
      await loadMidtransScript(clientKey, isProduction);
      const parameter = formatMidtransTransactionParameter(order);

      return {
        status: 'ready',
        provider: PAYMENT_PROVIDERS.MIDTRANS_SNAP,
        orderId: order.order_number || order.id,
        parameter,
        isSimulated: false,
        message: 'Midtrans Snap siap diluncurkan'
      };
    } catch (err) {
      // Fallback safely to manual QRIS on network error
      return {
        status: 'fallback',
        provider: PAYMENT_PROVIDERS.MANUAL_QRIS,
        orderId: order.order_number || order.id,
        grossAmount: order.total_amount || order.price,
        uniqueCode: order.unique_code || order.uniqueCode || 0,
        requiresManualVerification: true,
        message: 'Koneksi payment gateway bermasalah, beralih ke verifikasi QRIS manual'
      };
    }
  }

  throw new Error(`Payment provider tidak dikenali: ${cleanProvider}`);
}

/**
 * Standard Web Crypto SHA-512 Hash Generator (Universal for Browser & Node 18+)
 */
export async function calculateSha512(payload) {
  if (typeof globalThis !== 'undefined' && globalThis.crypto?.subtle) {
    const encoder = new TextEncoder();
    const data = encoder.encode(payload);
    const hashBuffer = await globalThis.crypto.subtle.digest('SHA-512', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
  return '';
}

/**
 * Midtrans Webhook SHA-512 Signature Verifier
 * Used for webhook validation as per OWASP and api-backend-engineer guidelines
 */
export async function verifyMidtransSignature(orderId, statusCode, grossAmount, signatureKey, serverKey) {
  if (!orderId || !statusCode || !grossAmount || !signatureKey || !serverKey) {
    return false;
  }

  const payload = `${orderId}${statusCode}${grossAmount}${serverKey}`;
  const hash = await calculateSha512(payload);

  return hash.toLowerCase() === String(signatureKey).toLowerCase();
}
