'use server';

import { revalidatePath } from 'next/cache';
import { checkPermission } from '@mgbos/auth';
import {
  createInvoiceSchema,
  issueInvoiceSchema,
  voidInvoiceSchema,
} from '@mgbos/validation';
import { invoiceContext } from './data';

export interface InvoiceActionResult {
  success?: boolean;
  error?: string;
  invoiceId?: string;
  invoiceNumber?: string;
}

export async function createInvoiceAction(
  input: unknown,
): Promise<InvoiceActionResult> {
  try {
    const ctx = await invoiceContext();
    const permission = checkPermission(ctx.session, 'invoices:create');
    if (!permission.allowed) return { error: permission.error };

    const parsed = createInvoiceSchema.safeParse(input);
    if (!parsed.success) {
      return {
        error:
          parsed.error.issues[0]?.message ?? 'Periksa data pembuatan invoice.',
      };
    }

    const d = parsed.data;

    const response = await fetch(
      ctx.endpoint + '/rpc/create_invoice_for_order',
      {
        method: 'POST',
        headers: ctx.headers,
        body: JSON.stringify({
          p_organization_id: ctx.session.organization.id,
          p_actor_id: ctx.session.user.id,
          p_order_id: d.orderId,
          p_invoice_type: d.invoiceType,
          p_amount_subtotal: d.amountSubtotal.toString(),
          p_amount_shipping: d.amountShipping.toString(),
          p_amount_tax: d.amountTax.toString(),
          p_due_date: d.dueDate ?? null,
          p_payment_instructions: d.paymentInstructions ?? null,
          p_notes: d.notes ?? null,
          p_items: d.items
            ? d.items.map((i) => ({
                ...i,
                unit_price: i.unit_price.toString(),
              }))
            : null,
        }),
      },
    );

    const result: unknown = await response.json();
    if (!response.ok) {
      return {
        error:
          result && typeof result === 'object' && 'message' in result
            ? String(result.message)
            : 'Gagal membuat invoice.',
      };
    }

    if (!result || typeof result !== 'object' || !('invoice_id' in result)) {
      return { error: 'Respons pembuatan invoice tidak valid.' };
    }

    const data = result as { invoice_id: string; invoice_number: string };

    revalidatePath('/invoices');
    revalidatePath(`/orders/${d.orderId}`);

    return {
      success: true,
      invoiceId: data.invoice_id,
      invoiceNumber: data.invoice_number,
    };
  } catch {
    return {
      error: 'Koneksi gagal saat membuat invoice. Coba lagi.',
    };
  }
}

export async function issueInvoiceAction(
  input: unknown,
): Promise<InvoiceActionResult> {
  try {
    const ctx = await invoiceContext();
    const permission = checkPermission(ctx.session, 'invoices:issue');
    if (!permission.allowed) return { error: permission.error };

    const parsed = issueInvoiceSchema.safeParse(input);
    if (!parsed.success) {
      return {
        error:
          parsed.error.issues[0]?.message ?? 'Periksa data penerbitan invoice.',
      };
    }

    const d = parsed.data;

    const response = await fetch(ctx.endpoint + '/rpc/issue_invoice', {
      method: 'POST',
      headers: ctx.headers,
      body: JSON.stringify({
        p_organization_id: ctx.session.organization.id,
        p_actor_id: ctx.session.user.id,
        p_invoice_id: d.invoiceId,
      }),
    });

    const result: unknown = await response.json();
    if (!response.ok) {
      return {
        error:
          result && typeof result === 'object' && 'message' in result
            ? String(result.message)
            : 'Gagal menerbitkan invoice resmi.',
      };
    }

    revalidatePath('/invoices');
    revalidatePath(`/invoices/${d.invoiceId}`);

    return { success: true, invoiceId: d.invoiceId };
  } catch {
    return {
      error: 'Koneksi gagal saat menerbitkan invoice. Coba lagi.',
    };
  }
}

export async function voidInvoiceAction(
  input: unknown,
): Promise<InvoiceActionResult> {
  try {
    const ctx = await invoiceContext();
    const permission = checkPermission(ctx.session, 'invoices:void');
    if (!permission.allowed) return { error: permission.error };

    const parsed = voidInvoiceSchema.safeParse(input);
    if (!parsed.success) {
      return {
        error:
          parsed.error.issues[0]?.message ?? 'Periksa data pembatalan invoice.',
      };
    }

    const d = parsed.data;

    const response = await fetch(ctx.endpoint + '/rpc/void_invoice', {
      method: 'POST',
      headers: ctx.headers,
      body: JSON.stringify({
        p_organization_id: ctx.session.organization.id,
        p_actor_id: ctx.session.user.id,
        p_invoice_id: d.invoiceId,
        p_reason: d.reason,
      }),
    });

    const result: unknown = await response.json();
    if (!response.ok) {
      return {
        error:
          result && typeof result === 'object' && 'message' in result
            ? String(result.message)
            : 'Gagal membatalkan invoice.',
      };
    }

    revalidatePath('/invoices');
    revalidatePath(`/invoices/${d.invoiceId}`);

    return { success: true, invoiceId: d.invoiceId };
  } catch {
    return {
      error: 'Koneksi gagal saat membatalkan invoice. Coba lagi.',
    };
  }
}
