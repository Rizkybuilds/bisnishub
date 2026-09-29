'use server';

import { revalidatePath } from 'next/cache';
import { checkPermission } from '@mgbos/auth';
import {
  createProductionJobSchema,
  transitionProductionJobSchema,
  assignProductionJobSchema,
  recordQcInspectionSchema,
} from '@mgbos/validation';
import { productionContext } from './data';

export interface ProductionActionResult {
  success?: boolean;
  error?: string;
  jobId?: string;
  jobNumber?: string;
}

export async function createProductionJobAction(
  input: unknown,
): Promise<ProductionActionResult> {
  try {
    const ctx = await productionContext();
    const permission = checkPermission(ctx.session, 'production:create');
    if (!permission.allowed) return { error: permission.error };

    const parsed = createProductionJobSchema.safeParse(input);
    if (!parsed.success) {
      return {
        error: parsed.error.issues[0]?.message ?? 'Periksa data job produksi.',
      };
    }

    const d = parsed.data;

    const response = await fetch(ctx.endpoint + '/rpc/create_production_job', {
      method: 'POST',
      headers: ctx.headers,
      body: JSON.stringify({
        p_organization_id: ctx.session.organization.id,
        p_actor_id: ctx.session.user.id,
        p_order_id: d.orderId,
        p_job_type: d.jobType,
        p_title: d.title,
        p_estimated_cost: d.estimatedCost.toString(),
        p_specification: d.specification,
        p_items: d.items,
        p_priority: d.priority,
        p_target_date: d.targetDate ?? null,
        p_notes: d.notes ?? null,
      }),
    });

    const result: unknown = await response.json();
    if (!response.ok) {
      return {
        error:
          result && typeof result === 'object' && 'message' in result
            ? String(result.message)
            : 'Gagal membuat job produksi.',
      };
    }

    if (!result || typeof result !== 'object' || !('job_id' in result)) {
      return { error: 'Respons pembuatan job tidak dikenali.' };
    }

    const data = result as { job_id: string; job_number: string };

    revalidatePath('/production');
    revalidatePath(`/orders/${d.orderId}`);

    return {
      success: true,
      jobId: data.job_id,
      jobNumber: data.job_number,
    };
  } catch {
    return {
      error: 'Koneksi gagal saat membuat job produksi. Coba lagi.',
    };
  }
}

export async function transitionProductionJobAction(
  input: unknown,
): Promise<ProductionActionResult> {
  try {
    const ctx = await productionContext();
    const permission = checkPermission(ctx.session, 'production:update');
    if (!permission.allowed) return { error: permission.error };

    const parsed = transitionProductionJobSchema.safeParse(input);
    if (!parsed.success) {
      return {
        error:
          parsed.error.issues[0]?.message ?? 'Periksa transisi status job.',
      };
    }

    const d = parsed.data;

    const response = await fetch(
      ctx.endpoint + '/rpc/transition_production_job_status',
      {
        method: 'POST',
        headers: ctx.headers,
        body: JSON.stringify({
          p_organization_id: ctx.session.organization.id,
          p_actor_id: ctx.session.user.id,
          p_job_id: d.jobId,
          p_to_status: d.toStatus,
          p_reason: d.reason ?? null,
        }),
      },
    );

    const result: unknown = await response.json();
    if (!response.ok) {
      return {
        error:
          result && typeof result === 'object' && 'message' in result
            ? String(result.message)
            : 'Gagal memperbarui status job produksi.',
      };
    }

    revalidatePath('/production');
    revalidatePath(`/production/${d.jobId}`);

    return { success: true, jobId: d.jobId };
  } catch {
    return {
      error: 'Koneksi gagal saat memperbarui status job. Coba lagi.',
    };
  }
}

export async function assignProductionJobAction(
  input: unknown,
): Promise<ProductionActionResult> {
  try {
    const ctx = await productionContext();
    const permission = checkPermission(ctx.session, 'production:assign');
    if (!permission.allowed) return { error: permission.error };

    const parsed = assignProductionJobSchema.safeParse(input);
    if (!parsed.success) {
      return {
        error: parsed.error.issues[0]?.message ?? 'Periksa data penugasan job.',
      };
    }

    const d = parsed.data;

    const response = await fetch(ctx.endpoint + '/rpc/assign_production_job', {
      method: 'POST',
      headers: ctx.headers,
      body: JSON.stringify({
        p_organization_id: ctx.session.organization.id,
        p_actor_id: ctx.session.user.id,
        p_job_id: d.jobId,
        p_executor_type: d.executorType,
        p_vendor_name: d.vendorName ?? null,
        p_assigned_brand_id: d.assignedBrandId ?? null,
        p_assigned_cost: d.assignedCost.toString(),
        p_notes: d.notes ?? null,
      }),
    });

    const result: unknown = await response.json();
    if (!response.ok) {
      return {
        error:
          result && typeof result === 'object' && 'message' in result
            ? String(result.message)
            : 'Gagal menugaskan job produksi.',
      };
    }

    revalidatePath('/production');
    revalidatePath(`/production/${d.jobId}`);

    return { success: true, jobId: d.jobId };
  } catch {
    return {
      error: 'Koneksi gagal saat menugaskan job produksi. Coba lagi.',
    };
  }
}

export async function recordQcInspectionAction(
  input: unknown,
): Promise<ProductionActionResult> {
  try {
    const ctx = await productionContext();
    const permission = checkPermission(ctx.session, 'qc:create');
    if (!permission.allowed) return { error: permission.error };

    const parsed = recordQcInspectionSchema.safeParse(input);
    if (!parsed.success) {
      return {
        error: parsed.error.issues[0]?.message ?? 'Periksa data inspeksi QC.',
      };
    }

    const d = parsed.data;

    const response = await fetch(ctx.endpoint + '/rpc/record_qc_inspection', {
      method: 'POST',
      headers: ctx.headers,
      body: JSON.stringify({
        p_organization_id: ctx.session.organization.id,
        p_actor_id: ctx.session.user.id,
        p_production_job_id: d.productionJobId,
        p_result: d.result,
        p_sample_size: d.sampleSize,
        p_defect_count: d.defectCount,
        p_defect_category: d.defectCategory ?? null,
        p_defect_severity: d.defectSeverity ?? null,
        p_checklist_snapshot: d.checklistSnapshot,
        p_rework_instructions: d.reworkInstructions ?? null,
        p_notes: d.notes ?? null,
      }),
    });

    const result: unknown = await response.json();
    if (!response.ok) {
      return {
        error:
          result && typeof result === 'object' && 'message' in result
            ? String(result.message)
            : 'Gagal mencatat hasil inspeksi QC.',
      };
    }

    revalidatePath('/production');
    revalidatePath(`/production/${d.productionJobId}`);

    return {
      success: true,
      jobId: d.productionJobId,
    };
  } catch {
    return {
      error: 'Koneksi gagal saat mencatat inspeksi QC. Coba lagi.',
    };
  }
}
