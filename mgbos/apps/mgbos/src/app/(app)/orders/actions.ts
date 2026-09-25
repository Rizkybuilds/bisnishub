'use server';

import { revalidatePath } from 'next/cache';
import { checkPermission } from '@mgbos/auth';
import { createOrderFromQuoteSchema } from '@mgbos/validation';
import { orderContext } from './data';

export interface CreateOrderResult {
  success?: boolean;
  error?: string;
  orderId?: string;
  orderNumber?: string;
  isRetry?: boolean;
}

export async function createOrderFromQuoteAction(
  input: unknown,
): Promise<CreateOrderResult> {
  try {
    const ctx = await orderContext();
    const permission = checkPermission(ctx.session, 'orders:create');
    if (!permission.allowed) return { error: permission.error };

    const parsed = createOrderFromQuoteSchema.safeParse(input);
    if (!parsed.success) {
      return {
        error: parsed.error.issues[0]?.message ?? 'Periksa data pesanan.',
      };
    }

    const d = parsed.data;
    const requestId = crypto.randomUUID();

    const response = await fetch(
      ctx.endpoint + '/rpc/create_order_from_quote',
      {
        method: 'POST',
        headers: ctx.headers,
        body: JSON.stringify({
          p_organization_id: ctx.session.organization.id,
          p_actor_id: ctx.session.user.id,
          p_request_id: requestId,
          p_quote_version_id: d.quoteVersionId,
          p_shipping_address: d.shippingAddress,
          p_billing_address: d.billingAddress ?? null,
          p_payment_terms_override: d.paymentTermsOverride ?? null,
          p_notes: d.notes ?? null,
        }),
      },
    );

    const result: unknown = await response.json();
    if (!response.ok) {
      return {
        error:
          result && typeof result === 'object' && 'message' in result
            ? String(result.message)
            : 'Gagal membuat kontrak pesanan.',
      };
    }

    if (!result || typeof result !== 'object' || !('order_id' in result)) {
      return { error: 'Respons pembuatan order tidak valid.' };
    }

    const orderData = result as {
      order_id: string;
      order_number: string;
      is_retry?: boolean;
    };

    revalidatePath('/orders');
    revalidatePath('/quotes');

    return {
      success: true,
      orderId: orderData.order_id,
      orderNumber: orderData.order_number,
      isRetry: orderData.is_retry,
    };
  } catch {
    return {
      error:
        'Koneksi gagal. Coba lagi; idempotent token akan mencegah pesanan ganda.',
    };
  }
}
