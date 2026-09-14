import { getCorsHeaders } from '../_shared/cors.ts';
import { getAdminClient } from '../_shared/supabaseClient.ts';

// 🛡️ Anti-Abuse: In-Memory Rate Limiter per Client IP (Mencegah spam ulasan)
const RATE_LIMIT_WINDOW_MS = 3600_000; // 1 jam
const MAX_REQUESTS_PER_WINDOW = 10; // Maksimal 10 ulasan per jam per IP
const ipReviewHistory = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  if (!ip || ip === 'unknown') return false;
  const now = Date.now();
  const timestamps = (ipReviewHistory.get(ip) || []).filter(t => now - t < RATE_LIMIT_WINDOW_MS);
  if (timestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    return true;
  }
  timestamps.push(now);
  ipReviewHistory.set(ip, timestamps);
  if (ipReviewHistory.size > 2000) {
    for (const [k, v] of ipReviewHistory.entries()) {
      if (v.every(t => now - t >= RATE_LIMIT_WINDOW_MS)) {
        ipReviewHistory.delete(k);
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
        message: 'Batas pengiriman ulasan tercapai. Silakan coba lagi dalam 1 jam.' 
      }),
      { status: 429, headers: { ...cors, 'Content-Type': 'application/json', 'Retry-After': '3600' } }
    );
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ status: 'error', message: 'Method tidak diizinkan. Gunakan POST.' }),
      { status: 405, headers: { ...cors, 'Content-Type': 'application/json' } }
    );
  }

  try {
    const body = await req.json();
    const {
      productSku = '',
      authorName = '',
      rating = 5,
      content = '',
      garmentType = null,
      sizeOrdered = null,
      userStats = null,
      orderNumber = null,
      phoneLast4 = null
    } = body;

    const cleanSku = String(productSku || '').trim();
    const cleanAuthor = String(authorName || '').trim().slice(0, 100);
    const cleanContent = String(content || '').trim().slice(0, 1000);
    const numRating = Math.round(Number(rating));

    // 1. Validasi Input Dasar
    if (!cleanSku) {
      return new Response(
        JSON.stringify({ status: 'error', message: 'SKU produk wajib disertakan.' }),
        { status: 400, headers: { ...cors, 'Content-Type': 'application/json' } }
      );
    }

    if (!cleanAuthor || cleanAuthor.length < 2) {
      return new Response(
        JSON.stringify({ status: 'error', message: 'Nama pengulas minimal 2 karakter.' }),
        { status: 400, headers: { ...cors, 'Content-Type': 'application/json' } }
      );
    }

    if (isNaN(numRating) || numRating < 1 || numRating > 5) {
      return new Response(
        JSON.stringify({ status: 'error', message: 'Rating harus berupa angka antara 1 dan 5 bintang.' }),
        { status: 400, headers: { ...cors, 'Content-Type': 'application/json' } }
      );
    }

    if (!cleanContent || cleanContent.length < 5) {
      return new Response(
        JSON.stringify({ status: 'error', message: 'Ulasan minimal terdiri dari 5 karakter.' }),
        { status: 400, headers: { ...cors, 'Content-Type': 'application/json' } }
      );
    }

    const adminClient = getAdminClient();

    // 2. Verifikasi Keberadaan Produk di Database / Katalog Resmi
    const { data: dbProduct } = await adminClient
      .from('ts_products')
      .select('sku, name, status')
      .eq('sku', cleanSku)
      .maybeSingle();

    const isOfficialBlank = cleanSku === 'TS-BLK-3600' || cleanSku === 'TS-BLK-7200';
    if (!dbProduct && !isOfficialBlank) {
      return new Response(
        JSON.stringify({ status: 'error', message: `Produk dengan SKU '${cleanSku}' tidak ditemukan.` }),
        { status: 400, headers: { ...cors, 'Content-Type': 'application/json' } }
      );
    }

    // 3. Verifikasi Otentikasi Pengguna (JWT Bearer Token jika login)
    let verifiedUserId: string | null = null;
    const authHeader = req.headers.get('Authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.replace('Bearer ', '').trim();
      if (token) {
        try {
          const { data: userData } = await adminClient.auth.getUser(token);
          if (userData?.user?.id) {
            verifiedUserId = userData.user.id;
          }
        } catch (_) {
          // Token invalid, tetap perlakukan sebagai guest
        }
      }
    }

    // 4. Verifikasi Status Pembeli (Verified Buyer Check Otoritatif Server)
    let isVerified = false;
    let roleBadge = 'Ulasan Komunitas';

    // 4a. Cek via Akun Terdaftar (User Login)
    if (verifiedUserId) {
      const { data: memberOrders } = await adminClient
        .from('ts_orders')
        .select('id, status, ts_order_items!inner(product_sku)')
        .eq('user_id', verifiedUserId)
        .in('status', ['paid', 'processing', 'completed', 'shipped'])
        .eq('ts_order_items.product_sku', cleanSku)
        .limit(1);

      if (memberOrders && memberOrders.length > 0) {
        isVerified = true;
        roleBadge = 'Verified Buyer';
      }
    }

    // 4b. Cek via Bukti No. Pesanan & 4-Digit No. HP (Guest Order Validation)
    if (!isVerified && orderNumber && phoneLast4) {
      const cleanOrder = String(orderNumber).trim().toUpperCase();
      const cleanLast4 = String(phoneLast4).replace(/\D/g, '');

      if (cleanOrder && cleanLast4.length === 4) {
        const { data: guestOrders } = await adminClient
          .from('ts_orders')
          .select('id, customer_phone, status, ts_order_items!inner(product_sku)')
          .eq('order_number', cleanOrder)
          .in('status', ['paid', 'processing', 'completed', 'shipped'])
          .eq('ts_order_items.product_sku', cleanSku)
          .limit(1);

        if (guestOrders && guestOrders.length > 0) {
          const phoneDigits = String(guestOrders[0].customer_phone || '').replace(/\D/g, '');
          if (phoneDigits.endsWith(cleanLast4)) {
            isVerified = true;
            roleBadge = 'Verified Buyer';
          }
        }
      }
    }

    // 5. Simpan Ulasan ke Database ts_reviews via Service Role
    const { data: insertedReview, error: insertError } = await adminClient
      .from('ts_reviews')
      .insert([{
        product_sku: cleanSku,
        user_id: verifiedUserId,
        author_name: cleanAuthor,
        role_badge: roleBadge,
        rating: numRating,
        garment_type: garmentType ? String(garmentType).slice(0, 100) : null,
        size_ordered: sizeOrdered ? String(sizeOrdered).slice(0, 20) : null,
        user_stats: userStats ? String(userStats).slice(0, 100) : null,
        content: cleanContent,
        is_verified: isVerified,
        helpful_count: 0
      }])
      .select()
      .single();

    if (insertError) {
      console.error('Database insert error for ts_reviews:', insertError);
      return new Response(
        JSON.stringify({ status: 'error', message: 'Gagal menyimpan ulasan ke database.' }),
        { status: 500, headers: { ...cors, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        status: 'success',
        message: isVerified 
          ? 'Terima kasih! Ulasan Anda telah terverifikasi sebagai Pembeli Resmi (Verified Buyer).' 
          : 'Terima kasih! Ulasan Anda berhasil dikirimkan ke komunitas TeeStock.',
        data: insertedReview
      }),
      { status: 200, headers: { ...cors, 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    console.error('Submit review function error:', err);
    return new Response(
      JSON.stringify({ status: 'error', message: 'Gagal memproses ulasan. Periksa data Anda.' }),
      { status: 500, headers: { ...cors, 'Content-Type': 'application/json' } }
    );
  }
});
