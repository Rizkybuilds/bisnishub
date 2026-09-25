'use server';

import { revalidatePath } from 'next/cache';
import { checkPermission } from '@mgbos/auth';
import { recordActualJobCostSchema } from '@mgbos/validation';
import { ledgerContext } from './data';

export interface LedgerActionResult {
  success?: boolean;
  error?: string;
  jobId?: string;
  jobNumber?: string;
  orderId?: string;
  actualCost?: string;
  variance?: string;
  ledgerNumber?: string;
}

export async function recordActualJobCostAction(
  input: unknown,
): Promise<LedgerActionResult> {
  try {
    const ctx = await ledgerContext();
    const permission = checkPermission(ctx.session, 'ledger:manage_cost');
    if (!permission.allowed) return { error: permission.error };

    const parsed = recordActualJobCostSchema.safeParse(input);
    if (!parsed.success) {
      return {
        error:
          parsed.error.issues[0]?.message ??
          'Periksa data pencatatan biaya aktual SPK.',
      };
    }

    const d = parsed.data;

    const response = await fetch(ctx.endpoint + '/rpc/record_actual_job_cost', {
      method: 'POST',
      headers: ctx.headers,
      body: JSON.stringify({
        p_organization_id: ctx.session.organization.id,
        p_actor_id: ctx.session.user.id,
        p_job_id: d.jobId,
        p_actual_cost: d.actualCost.toString(),
        p_notes: d.notes ?? null,
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => null);
      return {
        error:
          err?.message ?? 'Gagal mencatat realisasi biaya aktual di database.',
      };
    }

    const res = await response.json();

    revalidatePath('/ledger');
    revalidatePath('/orders');
    if (res.order_id) {
      revalidatePath(`/orders/${res.order_id}`);
    }
    revalidatePath('/production');
    revalidatePath(`/production/${d.jobId}`);

    return {
      success: true,
      jobId: res.job_id,
      jobNumber: res.job_number,
      orderId: res.order_id,
      actualCost: res.actual_cost?.toString(),
      variance: res.variance?.toString(),
      ledgerNumber: res.ledger_number,
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
