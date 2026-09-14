import { getCorsHeaders } from '../_shared/cors.ts';
import { getAdminClient } from '../_shared/supabaseClient.ts';

// 🛡️ Anti-Abuse: In-Memory Rate Limiter per Client IP (Mencegah brute force nomor pesanan & PIN HP)
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 menit
const MAX_REQUESTS_PER_WINDOW = 15; // Maksimal 15 percobaan tracking per menit per IP
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
        message: 'Terlalu banyak permintaan pelacakan dalam waktu singkat. Silakan tunggu 1 menit.' 
      }),
      { status: 429, headers: { ...cors, 'Content-Type': 'application/json', 'Retry-After': '60' } }
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
    const { orderNumber = '', phoneLast4 = '' } = body;

    const cleanOrder = String(orderNumber || '').trim().toUpperCase();
    const cleanLast4 = String(phoneLast4 || '').replace(/\D/g, '');

    // 1. Validasi Keberadaan dan Format Data
    if (!cleanOrder || cleanOrder.length > 50) {
      return new Response(
        JSON.stringify({ 
          status: 'error', 
          message: 'Nomor pesanan wajib diisi dengan format yang valid (contoh: TS-260914-XXXX).' 
        }),
        { status: 400, headers: { ...cors, 'Content-Type': 'application/json' } }
      );
    }

    if (cleanLast4.length !== 4) {
      return new Response(
        JSON.stringify({ 
          status: 'error', 
          message: 'Demi privasi, masukkan tepat 4 digit terakhir nomor HP yang Anda daftarkan saat memesan.' 
        }),
        { status: 400, headers: { ...cors, 'Content-Type': 'application/json' } }
      );
    }

    // 2. Query ke PostgreSQL RPC track_guest_order secara aman via Admin Client
    const adminClient = getAdminClient();
    const { data, error } = await adminClient.rpc('track_guest_order', {
      p_order_no: cleanOrder,
      p_phone_last4: cleanLast4
    });

    if (error || !data || data.length === 0) {
      return new Response(
        JSON.stringify({ 
          status: 'error', 
          message: 'Pesanan tidak ditemukan atau 4 digit terakhir nomor HP tidak cocok.' 
        }),
        { status: 404, headers: { ...cors, 'Content-Type': 'application/json' } }
      );
    }

    const order = data[0];

    return new Response(
      JSON.stringify({
        status: 'success',
        data: {
          order_number: order.order_number,
          status: order.status,
          tracking_number: order.tracking_number,
          created_at: order.created_at,
          customer_masked: order.customer_masked,
          items: order.items || []
        }
      }),
      { status: 200, headers: { ...cors, 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    console.error('Track order function error:', err);
    return new Response(
      JSON.stringify({ 
        status: 'error', 
        message: 'Gagal memproses pelacakan pesanan. Silakan periksa format data Anda.' 
      }),
      { status: 500, headers: { ...cors, 'Content-Type': 'application/json' } }
    );
  }
});
