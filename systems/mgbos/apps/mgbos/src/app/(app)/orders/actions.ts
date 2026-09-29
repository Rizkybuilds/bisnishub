'use server';

import { revalidatePath } from 'next/cache';
import { checkPermission } from '@mgbos/auth';
import {
  createOrderFromQuoteSchema,
  createRetailOrderSchema,
} from '@mgbos/validation';
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

export interface CreateRetailOrderResult {
  success?: boolean;
  error?: string;
  orderId?: string;
  orderNumber?: string;
  invoiceId?: string;
  invoiceNumber?: string;
  paymentId?: string;
  paymentNumber?: string;
  isPaid?: boolean;
}

export async function createRetailOrderAction(
  input: unknown,
): Promise<CreateRetailOrderResult> {
  try {
    const ctx = await orderContext();
    const permission = checkPermission(ctx.session, 'orders:create');
    if (!permission.allowed) return { error: permission.error };

    const parsed = createRetailOrderSchema.safeParse(input);
    if (!parsed.success) {
      return {
        error: parsed.error.issues[0]?.message ?? 'Periksa data pesanan ritel.',
      };
    }

    const d = parsed.data;
    let brandId = d.brandId;
    if (!brandId) {
      const brandRes = await fetch(
        `${ctx.endpoint}/brands?organization_id=eq.${ctx.session.organization.id}&code=eq.${encodeURIComponent(ctx.session.activeBrand.code)}&select=id`,
        { headers: ctx.headers },
      );
      const brands = (await brandRes.json()) as { id: string }[];
      brandId = brands[0]?.id;
    }
    if (!brandId) {
      return { error: 'Brand aktif tidak ditemukan.' };
    }

    const requestId = crypto.randomUUID();

    const response = await fetch(ctx.endpoint + '/rpc/create_retail_order', {
      method: 'POST',
      headers: ctx.headers,
      body: JSON.stringify({
        p_organization_id: ctx.session.organization.id,
        p_actor_id: ctx.session.user.id,
        p_brand_id: brandId,
        p_request_id: requestId,
        p_customer_account_id: d.customerAccountId,
        p_items: d.items.map((i) => ({
          inventory_item_id: i.inventoryItemId,
          quantity: i.quantity,
          unit_price: Number(i.unitPrice),
          discount_total: Number(i.discountTotal || 0),
          notes: i.notes ?? null,
        })),
        p_shipping_address: d.shippingAddress ?? null,
        p_shipping_cost: Number(d.shippingCost || 0),
        p_notes: d.notes ?? null,
        p_auto_pay: d.autoPay ?? false,
        p_payment_method: d.paymentMethod ?? 'CASH',
        p_payment_reference: d.paymentReference ?? null,
        p_payment_bank: d.paymentBank ?? null,
      }),
    });

    const result: unknown = await response.json();
    if (!response.ok) {
      return {
        error:
          result && typeof result === 'object' && 'message' in result
            ? String(result.message)
            : 'Gagal membuat pesanan ritel.',
      };
    }

    if (!result || typeof result !== 'object' || !('order_id' in result)) {
      return { error: 'Respons pembuatan pesanan ritel tidak valid.' };
    }

    const data = result as {
      order_id: string;
      order_number: string;
      invoice_id?: string;
      invoice_number?: string;
      payment_id?: string;
      payment_number?: string;
      is_paid?: boolean;
    };

    revalidatePath('/orders');
    revalidatePath('/inventory');
    revalidatePath('/invoices');
    revalidatePath('/payments');
    revalidatePath('/ledger');

    return {
      success: true,
      orderId: data.order_id,
      orderNumber: data.order_number,
      invoiceId: data.invoice_id,
      invoiceNumber: data.invoice_number,
      paymentId: data.payment_id,
      paymentNumber: data.payment_number,
      isPaid: data.is_paid,
    };
  } catch {
    return {
      error:
        'Koneksi gagal. Coba lagi; idempotent token akan mencegah pesanan ganda.',
    };
  }
}
