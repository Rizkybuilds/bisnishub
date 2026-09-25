'use server';

import { revalidatePath } from 'next/cache';
import { checkPermission } from '@mgbos/auth';
import {
  recordPaymentSchema,
  allocateExistingPaymentSchema,
  revertPaymentSchema,
} from '@mgbos/validation';
import { paymentContext } from './data';

export interface PaymentActionResult {
  success?: boolean;
  error?: string;
  paymentId?: string;
  paymentNumber?: string;
}

export async function recordPaymentAction(
  input: unknown,
): Promise<PaymentActionResult> {
  try {
    const ctx = await paymentContext();
    const permission = checkPermission(ctx.session, 'payments:record');
    if (!permission.allowed) return { error: permission.error };

    const parsed = recordPaymentSchema.safeParse(input);
    if (!parsed.success) {
      return {
        error:
          parsed.error.issues[0]?.message ??
          'Periksa data pencatatan pembayaran.',
      };
    }

    const d = parsed.data;

    const response = await fetch(
      ctx.endpoint + '/rpc/record_payment_and_allocate',
      {
        method: 'POST',
        headers: ctx.headers,
        body: JSON.stringify({
          p_organization_id: ctx.session.organization.id,
          p_actor_id: ctx.session.user.id,
          p_brand_id: d.brandId,
          p_payment_method: d.paymentMethod,
          p_amount: d.amount.toString(),
          p_payment_date: d.paymentDate ?? null,
          p_reference_number: d.referenceNumber ?? null,
          p_destination_bank: d.destinationBank ?? null,
          p_destination_account_number: d.destinationAccountNumber ?? null,
          p_payer_name: d.payerName ?? null,
          p_payer_bank: d.payerBank ?? null,
          p_payer_account_number: d.payerAccountNumber ?? null,
          p_proof_file_url: d.proofFileUrl ?? null,
          p_notes: d.notes ?? null,
          p_allocations: d.allocations.map((a) => ({
            invoice_id: a.invoiceId,
            amount: a.amount.toString(),
            notes: a.notes ?? null,
          })),
          p_customer_account_id: d.customerAccountId ?? null,
        }),
      },
    );

    if (!response.ok) {
      const err = await response.json().catch(() => null);
      return {
        error: err?.message ?? 'Gagal mencatat pembayaran di database sistem.',
      };
    }

    const res = await response.json();

    revalidatePath('/payments');
    revalidatePath('/invoices');
    revalidatePath('/orders');

    return {
      success: true,
      paymentId: res.payment_id,
      paymentNumber: res.payment_number,
    };
  } catch (err: unknown) {
    return {
      error:
        err instanceof Error
          ? err.message
          : 'Terjadi kendala sistem tak terduga.',
    };
  }
}

export async function allocateExistingPaymentAction(
  input: unknown,
): Promise<PaymentActionResult> {
  try {
    const ctx = await paymentContext();
    const permission = checkPermission(ctx.session, 'payments:record');
    if (!permission.allowed) return { error: permission.error };

    const parsed = allocateExistingPaymentSchema.safeParse(input);
    if (!parsed.success) {
      return {
        error:
          parsed.error.issues[0]?.message ?? 'Periksa data alokasi pembayaran.',
      };
    }

    const d = parsed.data;

    const response = await fetch(
      ctx.endpoint + '/rpc/allocate_existing_payment',
      {
        method: 'POST',
        headers: ctx.headers,
        body: JSON.stringify({
          p_organization_id: ctx.session.organization.id,
          p_actor_id: ctx.session.user.id,
          p_payment_id: d.paymentId,
          p_invoice_id: d.invoiceId,
          p_amount: d.amount.toString(),
          p_notes: d.notes ?? null,
        }),
      },
    );

    if (!response.ok) {
      const err = await response.json().catch(() => null);
      return {
        error: err?.message ?? 'Gagal mengalokasikan pembayaran ke invoice.',
      };
    }

    revalidatePath('/payments');
    revalidatePath(`/payments/${d.paymentId}`);
    revalidatePath('/invoices');
    revalidatePath(`/invoices/${d.invoiceId}`);
    revalidatePath('/orders');

    return { success: true, paymentId: d.paymentId };
  } catch (err: unknown) {
    return {
      error:
        err instanceof Error
          ? err.message
          : 'Terjadi kendala sistem tak terduga.',
    };
  }
}

export async function revertPaymentAction(
  input: unknown,
): Promise<PaymentActionResult> {
  try {
    const ctx = await paymentContext();
    const permission = checkPermission(ctx.session, 'payments:revert');
    if (!permission.allowed) return { error: permission.error };

    const parsed = revertPaymentSchema.safeParse(input);
    if (!parsed.success) {
      return {
        error:
          parsed.error.issues[0]?.message ??
          'Alasan pembatalan pembayaran tidak valid.',
      };
    }

    const d = parsed.data;

    const response = await fetch(ctx.endpoint + '/rpc/revert_payment', {
      method: 'POST',
      headers: ctx.headers,
      body: JSON.stringify({
        p_organization_id: ctx.session.organization.id,
        p_actor_id: ctx.session.user.id,
        p_payment_id: d.paymentId,
        p_reason: d.reason,
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => null);
      return {
        error: err?.message ?? 'Gagal membatalkan pembayaran di database.',
      };
    }

    const res = await response.json();

    revalidatePath('/payments');
    revalidatePath(`/payments/${d.paymentId}`);
    revalidatePath('/invoices');
    revalidatePath('/orders');

    return {
      success: true,
      paymentId: res.payment_id,
      paymentNumber: res.payment_number,
    };
  } catch (err: unknown) {
    return {
      error:
        err instanceof Error
          ? err.message
          : 'Terjadi kendala sistem tak terduga.',
    };
  }
}
