import 'server-only';

import { createHmac } from 'node:crypto';
import { headers } from 'next/headers';
import { publicEnvironment } from './env.client';
import { serverEnvironment } from './env.server';
import type { GuestCheckoutPayload } from './guest-checkout';

export type GuestOrderResult =
  | { success: true; orderNumber: string; totalIdr: number; isRetry: boolean }
  | { success: false; error: string };

const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function checkoutEnabled(): boolean {
  return process.env.TEESTOCK_CHECKOUT_ENABLED === 'true';
}

/**
 * Guest calls never get the service key. It is usable only on the server and
 * only when the store owner explicitly enables checkout and its integration.
 */
export async function createGuestOrder(
  input: GuestCheckoutPayload,
): Promise<GuestOrderResult> {
  const disabled = (): GuestOrderResult => ({
    success: false,
    error: 'Checkout belum dibuka. Tidak ada pesanan yang dibuat.',
  });
  if (!checkoutEnabled()) return disabled();

  const base = publicEnvironment.NEXT_PUBLIC_SUPABASE_URL;
  const key = serverEnvironment.SUPABASE_SERVICE_ROLE_KEY;
  const actor = process.env.TEESTOCK_CHECKOUT_ACTOR_ID;
  const secret = process.env.TEESTOCK_CHECKOUT_RATE_SECRET;
  const orgCode = process.env.TEESTOCK_CATALOG_ORG_CODE || 'multigraph-group';

  if (
    !base ||
    !key ||
    !actor ||
    !uuidPattern.test(actor) ||
    !secret ||
    secret.length < 32 ||
    !/^[a-z0-9-]{2,64}$/.test(orgCode)
  ) {
    return disabled();
  }

  // The reverse proxy should overwrite this address header. It provides a
  // best-effort per-client limit; a separate global DB cap also applies.
  const reqHeaders = await headers();
  const forwarded =
    reqHeaders.get('x-vercel-forwarded-for') ||
    reqHeaders.get('x-forwarded-for') ||
    reqHeaders.get('x-real-ip');
  const ip = forwarded?.split(',')[0]?.trim();
  if (!ip || !/^[0-9a-fA-F:.]{3,45}$/.test(ip)) {
    return {
      success: false,
      error: 'Identifikasi koneksi checkout gagal. Coba lagi.',
    };
  }
  const rateKey = createHmac('sha256', secret).update(ip).digest('hex');
  const endpoint = base.replace(/\/+$/, '') + '/rest/v1';
  const dbHeaders = {
    apikey: key,
    Authorization: 'Bearer ' + key,
    'Accept-Profile': 'app',
    'Content-Profile': 'app',
    'Content-Type': 'application/json',
  };

  try {
    const orgQuery = new URLSearchParams({
      code: 'eq.' + orgCode,
      status: 'eq.ACTIVE',
      select: 'id',
      limit: '1',
    });
    const orgResponse = await fetch(endpoint + '/organizations?' + orgQuery, {
      headers: dbHeaders,
      cache: 'no-store',
    });
    if (!orgResponse.ok) return disabled();
    const organizations = (await orgResponse.json()) as { id: string }[];
    if (!organizations[0]?.id) return disabled();

    const brandQuery = new URLSearchParams({
      organization_id: 'eq.' + organizations[0].id,
      code: 'eq.TS',
      status: 'eq.ACTIVE',
      select: 'id',
      limit: '1',
    });
    const brandResponse = await fetch(endpoint + '/brands?' + brandQuery, {
      headers: dbHeaders,
      cache: 'no-store',
    });
    if (!brandResponse.ok) return disabled();
    const brands = (await brandResponse.json()) as { id: string }[];
    if (!brands[0]?.id) return disabled();

    const response = await fetch(
      endpoint + '/rpc/create_teestock_guest_order',
      {
        method: 'POST',
        cache: 'no-store',
        headers: dbHeaders,
        body: JSON.stringify({
          p_org: organizations[0].id,
          p_brand: brands[0].id,
          p_actor: actor,
          p_request: input.requestId,
          p_name: input.name,
          p_phone: input.phone,
          p_email: input.email,
          p_items: input.items,
          p_rate_key: rateKey,
        }),
      },
    );
    if (!response.ok) {
      const raw = (await response.json().catch(() => null)) as {
        message?: string;
      } | null;
      const reason = raw?.message || '';
      if (reason.includes('price changed')) {
        return {
          success: false,
          error: 'Harga produk berubah. Perbarui keranjang lalu coba lagi.',
        };
      }
      if (
        reason.includes('Checkout limit reached') ||
        reason.includes('Checkout daily limit reached')
      ) {
        return {
          success: false,
          error: 'Batas pesanan sementara tercapai. Hubungi TeeStock.',
        };
      }
      if (
        reason.includes('Product not available') ||
        reason.includes('SKU is not available')
      ) {
        return {
          success: false,
          error: 'Produk atau varian sudah tidak tersedia. Perbarui keranjang.',
        };
      }
      if (reason.includes('request token was already used')) {
        return {
          success: false,
          error:
            'Checkout berubah. Muat ulang halaman sebelum mencoba kembali.',
        };
      }
      return {
        success: false,
        error: 'Pesanan belum berhasil dicatat. Silakan coba lagi.',
      };
    }
    const result = (await response.json()) as {
      order_number?: string;
      total_idr?: number;
      is_retry?: boolean;
    };
    if (
      typeof result.order_number !== 'string' ||
      !/^TS-O-[0-9]{4}-[0-9]{4,}$/.test(result.order_number) ||
      !Number.isSafeInteger(result.total_idr) ||
      (result.total_idr ?? 0) < 1
    ) {
      return {
        success: false,
        error: 'Respons server tidak valid. Hubungi TeeStock.',
      };
    }
    return {
      success: true,
      orderNumber: result.order_number,
      totalIdr: result.total_idr!,
      isRetry: result.is_retry === true,
    };
  } catch {
    return {
      success: false,
      error:
        'Koneksi checkout terputus. Coba kirim ulang tanpa mengubah keranjang.',
    };
  }
}
