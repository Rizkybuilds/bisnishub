import { getCorsHeaders } from '../_shared/cors.ts';
import { getAdminClient } from '../_shared/supabaseClient.ts';

// Size surcharges mapping (Berdasarkan HPP distributor NSA)
const SIZE_SURCHARGES: Record<string, number> = {
  'XXL': 5000,
  '2XL': 5000,
  '3XL': 10000,
  '4XL': 15000,
  '5XL': 20000,
};

function getSizeSurcharge(size?: string): number {
  if (!size) return 0;
  const clean = String(size).toUpperCase().trim();
  return SIZE_SURCHARGES[clean] || 0;
}

// Berat per garmen dalam gram
const GARMENT_WEIGHT_MAP: Record<string, number> = {
  'TS-BLK-3600': 180,
  '3600': 180,
  '30S': 180,
  'TS-BLK-7200': 220,
  '7200': 220,
  '24S': 220,
  'DEFAULT': 220,
  'PACKAGING': 30
};

function getItemWeight(sku: string, garment: string): number {
  const cleanSku = (sku || '').toUpperCase();
  const cleanGarment = (garment || '').toUpperCase();
  if (cleanSku.includes('3600') || cleanGarment.includes('30S') || cleanGarment.includes('3600')) {
    return GARMENT_WEIGHT_MAP['3600'];
  }
  return GARMENT_WEIGHT_MAP['7200'];
}

// Perhitungan Billable Weight Standar Logistik Indonesia (Toleransi 1.200g = 1kg)
function calculateBillableKg(totalGrams: number): number {
  if (totalGrams <= 1200) return 1;
  return Math.ceil((totalGrams - 200) / 1000);
}

// 4 Zona Tarif Pengiriman Standar (HPP Ekspedisi dari Sentra Citayam / Depok / Jabar)
const SHIPPING_ZONE_RATES: Record<string, { rate: number; name: string }> = {
  'jabodetabek_jabar': { rate: 10000, name: 'Jabodetabek & Jawa Barat' },
  'jawa_lainnya': { rate: 15000, name: 'Jawa Tengah, Jawa Timur, & DIY' },
  'luar_jawa_kota': { rate: 28000, name: 'Luar Jawa — Kota Besar' },
  'luar_jawa_timur': { rate: 45000, name: 'Luar Jawa — Wilayah Timur' }
};

function detectShippingZone(city = '', zoneId = ''): { id: string; rate: number; name: string } {
  if (zoneId && SHIPPING_ZONE_RATES[zoneId]) {
    return { id: zoneId, ...SHIPPING_ZONE_RATES[zoneId] };
  }
  const c = city.toLowerCase();
  if (
    c.includes('jakarta') || c.includes('bogor') || c.includes('depok') || 
    c.includes('tangerang') || c.includes('bekasi') || c.includes('bandung') || 
    c.includes('cimahi') || c.includes('cirebon') || c.includes('sukabumi') || 
    c.includes('tasik') || c.includes('garut') || c.includes('jawa barat')
  ) {
    return { id: 'jabodetabek_jabar', ...SHIPPING_ZONE_RATES['jabodetabek_jabar'] };
  }
  if (
    c.includes('jawa tengah') || c.includes('jawa timur') || c.includes('diy') || 
    c.includes('jogja') || c.includes('yogyakarta') || c.includes('semarang') || 
    c.includes('solo') || c.includes('surabaya') || c.includes('malang') || 
    c.includes('kediri') || c.includes('banyuwangi')
  ) {
    return { id: 'jawa_lainnya', ...SHIPPING_ZONE_RATES['jawa_lainnya'] };
  }
  if (
    c.includes('sumatera') || c.includes('medan') || c.includes('palembang') || 
    c.includes('padang') || c.includes('pekanbaru') || c.includes('lampung') || 
    c.includes('bali') || c.includes('denpasar') || c.includes('pontianak') || 
    c.includes('banjarmasin') || c.includes('samarinda') || c.includes('makassar') || 
    c.includes('manado')
  ) {
    return { id: 'luar_jawa_kota', ...SHIPPING_ZONE_RATES['luar_jawa_kota'] };
  }
  return { id: 'luar_jawa_timur', ...SHIPPING_ZONE_RATES['luar_jawa_timur'] };
}

// Multiplier Kurir
const COURIER_MULTIPLIERS: Record<string, number> = {
  'jne': 1.05,
  'anteraja': 0.95,
  'jnt': 1.0,
  'sicepat': 1.0
};

function calculateBundleDiscount(graphicQty: number, role = 'retail'): number {
  if (role === 'reseller' || role === 'dropship') return 0;
  if (!graphicQty || graphicQty < 2) return 0;
  if (graphicQty >= 3) return 14000 * graphicQty; // Rp 42.000 untuk 3 pcs (@Rp 85.000)
  if (graphicQty === 2) return 18000; // Rp 18.000 untuk 2 pcs (@Rp 90.000)
  return 0;
}

function generateOrderNumber(): string {
  const now = new Date();
  const yy = String(now.getFullYear()).slice(-2);
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const randomHex = Math.floor(Math.random() * 0xFFFF).toString(16).toUpperCase().padStart(4, '0');
  return `TS-${yy}${mm}${dd}-${randomHex}`;
}

// 🛡️ Anti-Abuse: In-Memory Rate Limiter per Client IP (Mencegah brute force / spam flood)
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 menit
const MAX_REQUESTS_PER_WINDOW = 15; // Maksimal 15 percobaan checkout per menit per IP
const ipRequestHistory = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  if (!ip || ip === 'unknown') return false;
  const now = Date.now();
  const timestamps = (ipRequestHistory.get(ip) || []).filter(t => now - t < RATE_LIMIT_WINDOW_MS);
  if (timestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    return true;
  }
  timestamps.push(now);
  ipRequestHistory.set(ip, timestamps);
  if (ipRequestHistory.size > 2000) {
    for (const [k, v] of ipRequestHistory.entries()) {
      if (v.every(t => now - t >= RATE_LIMIT_WINDOW_MS)) {
        ipRequestHistory.delete(k);
      }
    }
  }
  return false;
}

Deno.serve(async (req: Request) => {
  const cors = getCorsHeaders(req);

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: cors });
  }

  // Cek Rate Limit per IP
  const clientIp = req.headers.get('cf-connecting-ip') || 
                   req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 
                   'unknown';

  if (isRateLimited(clientIp)) {
    return new Response(
      JSON.stringify({ 
        status: 'error', 
        message: 'Terlalu banyak permintaan transaksi dalam waktu singkat. Silakan tunggu 1 menit.' 
      }),
      { status: 429, headers: { ...cors, 'Content-Type': 'application/json', 'Retry-After': '60' } }
    );
  }

  try {
    const body = await req.json();
    const {
      items = [],
      customer = {},
      shipping = {},
      paymentMethod = 'manual_qris',
      voucherCode = null,
      notes = null
    } = body;

    // 1. Validasi Input Dasar
    if (!Array.isArray(items) || items.length === 0) {
      return new Response(
        JSON.stringify({ status: 'error', message: 'Keranjang belanja kosong atau tidak valid.' }),
        { status: 400, headers: { ...cors, 'Content-Type': 'application/json' } }
      );
    }

    const customerName = String(customer.name || customer.customerName || '').trim();
    const customerPhone = String(customer.phone || '').trim();
    const customerCity = String(customer.city || '').trim();
    const customerAddress = String(customer.address || '').trim();

    if (!customerName || !customerPhone) {
      return new Response(
        JSON.stringify({ status: 'error', message: 'Nama dan nomor telepon penerima wajib diisi.' }),
        { status: 400, headers: { ...cors, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = getAdminClient();

    // 2. Proteksi Spam Order Pending: Batasi maksimal 5 pesanan berstatus pending_payment per nomor telepon
    const { count: pendingCount } = await supabase
      .from('ts_orders')
      .select('id', { count: 'exact', head: true })
      .eq('customer_phone', customerPhone)
      .eq('status', 'pending_payment');

    if (pendingCount && pendingCount >= 5) {
      return new Response(
        JSON.stringify({
          status: 'error',
          message: 'Nomor telepon ini memiliki 5 pesanan tertunda yang belum diselesaikan pembayarannya. Silakan selesaikan pesanan sebelumnya terlebih dahulu atau hubungi CS kami.'
        }),
        { status: 429, headers: { ...cors, 'Content-Type': 'application/json' } }
      );
    }

    // 3. Ekstraksi Identitas User dari JWT Authorization Header (Zero Trust pada body.userId)
    let verifiedUserId: string | null = null;
    const authHeader = req.headers.get('Authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.replace('Bearer ', '').trim();
      if (token && token !== 'undefined' && token !== 'null') {
        try {
          const { data: { user } } = await supabase.auth.getUser(token);
          if (user && user.id) {
            verifiedUserId = user.id;
          }
        } catch (authErr) {
          console.warn('Gagal memverifikasi JWT user:', authErr);
        }
      }
    }

    // 3. Verifikasi Harga & Produk Otoritatif dari Database ts_products (Zero-Trust)
    const requestedSkus = items.map((i: any) => String(i.sku || i.product_sku || i.id || '').trim()).filter(Boolean);
    const { data: dbProducts, error: prodErr } = await supabase
      .from('ts_products')
      .select('sku, name, price_retail, price_reseller, series, status')
      .in('sku', requestedSkus);

    if (prodErr) {
      return new Response(
        JSON.stringify({ status: 'error', message: `Gagal membaca katalog produk: ${prodErr.message}` }),
        { status: 500, headers: { ...cors, 'Content-Type': 'application/json' } }
      );
    }

    const productMap = new Map<string, any>();
    if (dbProducts) {
      dbProducts.forEach((p: any) => {
        if (p.status === 'active') {
          productMap.set(p.sku, p);
        }
      });
    }

    let calculatedSubtotal = 0;
    let graphicCount = 0;
    let totalOrderGrams = GARMENT_WEIGHT_MAP['PACKAGING'];
    const verifiedOrderItems: any[] = [];

    for (const item of items) {
      const qty = Math.max(1, Math.min(100, Number(item.qty || item.quantity) || 1));
      const sku = String(item.sku || item.product_sku || item.id || '').trim();
      const dbProduct = productMap.get(sku);

      let baseUnitPrice = 0;
      let productName = '';
      let isGraphic = true;
      const garment = String(item.garment || 'NSA Heavyweight 24s');

      if (dbProduct) {
        baseUnitPrice = Number(dbProduct.price_retail) || 99000;
        productName = dbProduct.name;
        isGraphic = dbProduct.series !== 'blank';
      } else if (sku === 'TS-BLK-3600' || sku === 'TS-BLK-7200') {
        // Blanks NSA 3600 & 7200 resmi
        const isWhite = String(item.color || '').toLowerCase().includes('putih') || 
                        String(item.color || '').toLowerCase().includes('white');
        if (sku === 'TS-BLK-3600') {
          baseUnitPrice = isWhite ? 34000 : 37000;
          productName = 'New States Apparel Softstyle 30s';
        } else {
          baseUnitPrice = isWhite ? 49000 : 52000;
          productName = 'New States Apparel Premium Cotton 7200';
        }
        isGraphic = false;
      } else {
        // Zero-Trust: SKU tidak dikenal atau tidak aktif -> Tolak langsung dengan HTTP 400!
        return new Response(
          JSON.stringify({ 
            status: 'error', 
            message: `Produk dengan SKU '${sku}' tidak ditemukan di katalog atau sudah tidak aktif.` 
          }),
          { status: 400, headers: { ...cors, 'Content-Type': 'application/json' } }
        );
      }

      const surcharge = getSizeSurcharge(item.size);
      const finalUnitPrice = baseUnitPrice + surcharge;
      const itemSubtotal = finalUnitPrice * qty;

      if (isGraphic) {
        graphicCount += qty;
      }

      const unitWeight = getItemWeight(sku, garment);
      totalOrderGrams += unitWeight * qty;
      calculatedSubtotal += itemSubtotal;

      verifiedOrderItems.push({
        product_sku: sku,
        product_name: productName,
        garment: garment,
        size: item.size || 'L',
        color: item.color || 'Hitam',
        qty,
        unit_price: finalUnitPrice,
        subtotal: itemSubtotal
      });
    }

    // 4. Kalkulasi Diskon Bundling Otoritatif di Server
    const bundleDiscount = calculateBundleDiscount(graphicCount, 'retail');

    // 5. Validasi Voucher Otoritatif dari Database ts_vouchers
    let voucherDiscount = 0;
    let validatedVoucherCode: string | null = null;

    if (voucherCode) {
      const cleanCode = String(voucherCode).trim().toUpperCase();
      const { data: voucherData, error: voucherErr } = await supabase
        .from('ts_vouchers')
        .select('id, code, discount_type, discount_value, min_order, max_discount, usage_limit, used_count, is_active, expires_at')
        .eq('code', cleanCode)
        .maybeSingle();

      if (voucherErr || !voucherData) {
        return new Response(
          JSON.stringify({ status: 'error', message: `Kupon voucher '${cleanCode}' tidak valid atau tidak terdaftar.` }),
          { status: 400, headers: { ...cors, 'Content-Type': 'application/json' } }
        );
      }

      if (!voucherData.is_active) {
        return new Response(
          JSON.stringify({ status: 'error', message: `Kupon voucher '${cleanCode}' sudah tidak aktif.` }),
          { status: 400, headers: { ...cors, 'Content-Type': 'application/json' } }
        );
      }

      if (voucherData.expires_at && new Date(voucherData.expires_at) < new Date()) {
        return new Response(
          JSON.stringify({ status: 'error', message: `Kupon voucher '${cleanCode}' telah kedaluwarsa.` }),
          { status: 400, headers: { ...cors, 'Content-Type': 'application/json' } }
        );
      }

      if (voucherData.usage_limit && voucherData.used_count >= voucherData.usage_limit) {
        return new Response(
          JSON.stringify({ status: 'error', message: `Kuota penggunaan voucher '${cleanCode}' telah habis.` }),
          { status: 400, headers: { ...cors, 'Content-Type': 'application/json' } }
        );
      }

      const minOrder = Number(voucherData.min_order) || 0;
      if (calculatedSubtotal < minOrder) {
        return new Response(
          JSON.stringify({ 
            status: 'error', 
            message: `Voucher '${cleanCode}' membutuhkan minimal belanja Rp ${minOrder.toLocaleString('id-ID')}.` 
          }),
          { status: 400, headers: { ...cors, 'Content-Type': 'application/json' } }
        );
      }

      if (voucherData.discount_type === 'percent') {
        const rawDisc = Math.round(calculatedSubtotal * (Number(voucherData.discount_value) / 100));
        const maxDisc = Number(voucherData.max_discount) || Infinity;
        voucherDiscount = Math.min(rawDisc, maxDisc);
      } else {
        voucherDiscount = Math.min(calculatedSubtotal, Number(voucherData.discount_value));
      }

      validatedVoucherCode = cleanCode;
    }

    const totalDiscount = bundleDiscount + voucherDiscount;

    // 6. Kalkulasi Ongkir Otoritatif di Server (Zero Trust pada shipping.fee client)
    const matchedZone = detectShippingZone(customerCity, shipping.zoneId);
    const billableKg = calculateBillableKg(totalOrderGrams);
    const courierKey = String(shipping.courierId || shipping.courier || 'jnt').toLowerCase();
    const courierMultiplier = COURIER_MULTIPLIERS[courierKey] || 1.0;
    const authoritativeShippingFee = Math.round(matchedZone.rate * billableKg * courierMultiplier);

    // 7. Kode Unik untuk Verifikasi QRIS Manual (100 - 999)
    let uniqueCode = 0;
    if (paymentMethod === 'manual_qris') {
      uniqueCode = Math.floor(100 + Math.random() * 900);
    }

    const grandTotal = Math.max(0, calculatedSubtotal - totalDiscount + authoritativeShippingFee + uniqueCode);
    const orderNumber = generateOrderNumber();
    const orderUuid = crypto.randomUUID();

    const summaryNotes = notes || verifiedOrderItems.map(
      i => `${i.product_name} (${i.color} ${i.size}) x${i.qty}`
    ).join('; ');

    // 8. Request Midtrans Snap Token Terlebih Dahulu (Bila metode midtrans_snap)
    let snapToken = null;
    let redirectUrl = null;

    if (paymentMethod === 'midtrans_snap') {
      const serverKey = Deno.env.get('MIDTRANS_SERVER_KEY');
      if (!serverKey) {
        console.error('Configuration error: MIDTRANS_SERVER_KEY is missing from environment.');
        return new Response(
          JSON.stringify({ 
            status: 'error', 
            message: 'Konfigurasi pembayaran server belum lengkap. Hubungi admin toko.' 
          }),
          { status: 500, headers: { ...cors, 'Content-Type': 'application/json' } }
        );
      }

      const isProduction = Deno.env.get('MIDTRANS_IS_PRODUCTION') === 'true' || serverKey.startsWith('Mid-server-');
      const snapApiUrl = isProduction
        ? 'https://app.midtrans.com/snap/v1/transactions'
        : 'https://app.sandbox.midtrans.com/snap/v1/transactions';

      // Midtrans membatasi panjang item_details name maksimal 50 karakter
      const midtransItems: Array<{ id: string; price: number; quantity: number; name: string }> = verifiedOrderItems.map((item, idx) => ({
        id: String(item.product_sku || `ITEM-${idx + 1}`).slice(0, 45),
        price: Math.round(item.unit_price),
        quantity: item.qty,
        name: String(item.product_name || 'Kaos TeeStock').slice(0, 45)
      }));

      if (authoritativeShippingFee > 0) {
        const cleanZone = String(matchedZone.name || 'Reguler')
          .replace(/[()&]/g, ' ')
          .replace(/\s+/g, ' ')
          .trim();
        midtransItems.push({
          id: 'SHIPPING-FEE',
          price: Math.round(authoritativeShippingFee),
          quantity: 1,
          name: `Ongkir - ${cleanZone}`.slice(0, 45)
        });
      }

      if (totalDiscount > 0) {
        midtransItems.push({
          id: 'DISCOUNT-TOTAL',
          price: -Math.round(totalDiscount),
          quantity: 1,
          name: 'Diskon Paket / Voucher'.slice(0, 45)
        });
      }

      // Rekonsiliasi Matematis: sum(item_details) WAJIB sama persis dengan gross_amount
      const targetGross = Math.round(grandTotal);
      const itemsSum = midtransItems.reduce((acc, it) => acc + (it.price * it.quantity), 0);
      if (itemsSum !== targetGross) {
        const diff = targetGross - itemsSum;
        midtransItems.push({
          id: 'ADJUSTMENT',
          price: diff,
          quantity: 1,
          name: 'Penyesuaian'.slice(0, 45)
        });
      }

      // Pembersihan nomor telepon (hanya digit, 9-19 digit) dan alamat (hapus tautan markdown)
      const cleanCustomerPhone = customerPhone.replace(/[^0-9+]/g, '').slice(0, 19) || '08123456789';
      const cleanCustomerAddress = customerAddress
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
        .replace(/[<>[\]]/g, '')
        .slice(0, 190);
      const cleanCustomerCity = customerCity.replace(/[()]/g, '').slice(0, 90);

      const snapPayload: Record<string, any> = {
        transaction_details: {
          order_id: orderNumber,
          gross_amount: targetGross
        },
        customer_details: {
          first_name: customerName.slice(0, 50),
          phone: cleanCustomerPhone,
          billing_address: {
            address: cleanCustomerAddress,
            city: cleanCustomerCity
          }
        },
        item_details: midtransItems
      };

      try {
        const authHeader = 'Basic ' + btoa(`${serverKey}:`);
        let snapRes = await fetch(snapApiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': authHeader
          },
          body: JSON.stringify(snapPayload)
        });

        // Jika 401 unauthorized, coba endpoint alternatif (Sandbox <-> Production)
        if (snapRes.status === 401) {
          const alternateUrl = isProduction
            ? 'https://app.sandbox.midtrans.com/snap/v1/transactions'
            : 'https://app.midtrans.com/snap/v1/transactions';
          console.warn(`Midtrans 401 on ${snapApiUrl}, mencoba endpoint alternatif: ${alternateUrl}`);
          const altRes = await fetch(alternateUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'Authorization': authHeader
            },
            body: JSON.stringify(snapPayload)
          });
          if (altRes.ok) {
            snapRes = altRes;
          }
        }

        if (snapRes.ok) {
          const snapData = await snapRes.json();
          snapToken = snapData.token;
          redirectUrl = snapData.redirect_url;
        } else {
          const snapErrText = await snapRes.text();
          console.error('Midtrans Snap API Error:', snapRes.status, snapErrText);
          // Gagalkan transaksi sebelum pesanan dicatat di DB untuk mencegah order yatim
          return new Response(
            JSON.stringify({
              status: 'error',
              message: `Gagal membuat sesi pembayaran Midtrans (${snapRes.status}). Silakan coba lagi atau gunakan metode QRIS Manual.`
            }),
            { status: 502, headers: { ...cors, 'Content-Type': 'application/json' } }
          );
        }
      } catch (snapEx: any) {
        console.error('Midtrans network exception:', snapEx);
        return new Response(
          JSON.stringify({
            status: 'error',
            message: `Gagal terhubung ke gateway pembayaran Midtrans: ${snapEx.message || 'Koneksi terputus'}. Silakan coba lagi atau gunakan metode QRIS Manual.`
          }),
          { status: 502, headers: { ...cors, 'Content-Type': 'application/json' } }
        );
      }
    }

    // 9. Transaksi Database Atomik (via RPC PostgreSQL create_order_transactional)
    const orderHeaderData = {
      id: orderUuid,
      order_number: orderNumber,
      user_id: verifiedUserId,
      customer_name: customerName,
      customer_phone: customerPhone,
      customer_city: customerCity,
      customer_address: customerAddress,
      channel: 'web',
      tier: 'retail',
      total_amount: grandTotal,
      discount_amount: totalDiscount,
      voucher_code: validatedVoucherCode,
      notes: summaryNotes,
    };

    const orderItemsData = verifiedOrderItems.map(item => ({
      ...item,
      order_number: orderNumber
    }));

    // Eksekusi fungsi RPC transaksi atomik
    const { data: rpcResult, error: rpcErr } = await supabase.rpc('create_order_transactional', {
      p_order: orderHeaderData,
      p_items: orderItemsData,
      p_voucher_code: validatedVoucherCode,
      p_voucher_discount: voucherDiscount
    });

    if (rpcErr) {
      console.error('RPC create_order_transactional error:', rpcErr);
      return new Response(
        JSON.stringify({
          status: 'error',
          message: `Gagal memproses transaksi pesanan secara atomik: ${rpcErr.message}`
        }),
        { status: 500, headers: { ...cors, 'Content-Type': 'application/json' } }
      );
    }

    // 10. Kembalikan Respons Otoritatif Server
    return new Response(
      JSON.stringify({
        status: 'success',
        data: {
          orderNumber,
          orderUuid,
          subtotal: calculatedSubtotal,
          discountAmount: totalDiscount,
          shippingFee: authoritativeShippingFee,
          shippingZone: matchedZone.name,
          billableWeightKg: billableKg,
          uniqueCode,
          grandTotal,
          paymentMethod,
          userId: verifiedUserId,
          snapToken,
          redirectUrl,
          items: verifiedOrderItems
        }
      }),
      {
        status: 200,
        headers: { ...cors, 'Content-Type': 'application/json' }
      }
    );

  } catch (err: any) {
    console.error('Checkout error:', err);
    return new Response(
      JSON.stringify({ status: 'error', message: err.message || 'Terjadi kesalahan internal checkout.' }),
      { status: 500, headers: { ...cors, 'Content-Type': 'application/json' } }
    );
  }
});
