'use server';
import { revalidatePath } from 'next/cache';
import { checkPermission, type MgbosPermission } from '@mgbos/auth';
import {
  createRequirementSchema,
  createRequirementVersionSchema,
  lockRequirementVersionSchema,
  transitionRequirementStatusSchema,
} from '@mgbos/validation';
import { requirementContext, readRows } from './data';
import { atelierSpecificationFromForm } from './atelierForm';
import { customAtelierRequirementSchema } from '@mgbos/validation';
import { ATELIER_SCHEMA } from '@mgbos/domain';

export interface RequirementActionState {
  success?: boolean;
  error?: string;
  id?: string;
}
const value = (f: FormData, key: string) => {
  const v = f.get(key);
  return typeof v === 'string' ? v.trim() : '';
};
export async function requirementAction(
  _previous: RequirementActionState,
  form: FormData,
): Promise<RequirementActionState> {
  try {
    const ctx = await requirementContext();
    const operation = value(form, 'operation');
    const permissions: Record<string, MgbosPermission> = {
      create: 'requirements:create',
      revise: 'requirements:version',
      lock: 'requirements:lock',
      transition: 'requirements:update',
    };
    const permission = permissions[operation];
    if (!permission) return { error: 'Action tidak valid.' };
    const check = checkPermission(ctx.session, permission);
    if (!check.allowed) return { error: check.error };
    const requirementId = value(form, 'requirementId');
    let rpc: string;
    let args: Record<string, unknown> = {
      p_organization_id: ctx.session.organization.id,
      p_actor_id: ctx.session.user.id,
    };
    if (operation === 'create' || operation === 'revise') {
      const budget = value(form, 'targetBudget');
      if (budget && !/^\d+$/.test(budget))
        return { error: 'Anggaran harus berupa rupiah bulat tanpa pemisah.' };
      const qty = value(form, 'quantity');
      if (qty && !/^\d+$/.test(qty))
        return { error: 'Jumlah harus bilangan bulat positif.' };
      // Preserve structured specifications when a generic version is revised.
      let specification: Record<string, unknown> = {};
      if (operation === 'revise') {
        const parents = await readRows<RequirementRow>(
          'requirements?id=eq.' +
            encodeURIComponent(requirementId) +
            '&organization_id=eq.' +
            ctx.session.organization.id +
            '&select=id,current_version_id',
          ctx,
        );
        const parent = parents[0];
        if (!parent) return { error: 'Requirement tidak ditemukan.' };
        if (parent.current_version_id) {
          const versions = await readRows<{
            specification: Record<string, unknown>;
          }>(
            'requirement_versions?id=eq.' +
              parent.current_version_id +
              '&select=specification',
            ctx,
          );
          specification = versions[0]?.specification ?? {};
        }
      }
      if (value(form, 'specificationMode') === 'atelier') {
        if (ctx.session.activeBrand.code !== 'TS')
          return { error: 'Custom Atelier hanya tersedia untuk TeeStock.' };
        specification = atelierSpecificationFromForm(form);
      }
      if (specification.schemaCode === ATELIER_SCHEMA) {
        const atelier = customAtelierRequirementSchema.safeParse({
          specification,
          quantity: qty ? Number(qty) : null,
          unit: value(form, 'unit'),
        });
        if (!atelier.success)
          return {
            error:
              atelier.error.issues[0]?.message ?? 'Spesifikasi tidak valid.',
          };
        specification = atelier.data.specification;
      }
      const payload = {
        summary: value(form, 'summary'),
        quantity: qty ? Number(qty) : null,
        unit: value(form, 'unit') || 'PCS',
        targetBudget: budget ? BigInt(budget) : null,
        targetDate: value(form, 'targetDate') || null,
        specification,
      };
      let brandId: string | undefined;
      if (operation === 'create') {
        const brands = await readRows<{ id: string }>(
          'brands?organization_id=eq.' +
            ctx.session.organization.id +
            '&code=eq.' +
            encodeURIComponent(ctx.session.activeBrand.code) +
            '&status=eq.ACTIVE&select=id',
          ctx,
        );
        brandId = brands[0]?.id;
      }
      const parsed =
        operation === 'create'
          ? createRequirementSchema.safeParse({
              ...payload,
              organizationId: ctx.session.organization.id,
              brandId,
              title: value(form, 'title'),
              leadId: value(form, 'leadId') || null,
              customerAccountId: value(form, 'customerAccountId') || null,
            })
          : createRequirementVersionSchema.safeParse({
              ...payload,
              requirementId,
            });
      if (!parsed.success)
        return {
          error: parsed.error.issues[0]?.message || 'Data tidak valid.',
        };
      const data = parsed.data;
      args = {
        ...args,
        p_summary: data.summary,
        p_quantity: data.quantity,
        p_unit: data.unit,
        p_target_budget: data.targetBudget?.toString() ?? null,
        p_target_date: data.targetDate,
        p_specification: data.specification,
      };
      if (operation === 'create') {
        rpc = 'create_requirement_with_initial_version';
        args = {
          ...args,
          p_brand_id: brandId,
          p_title: value(form, 'title'),
          p_lead_id: value(form, 'leadId') || null,
          p_customer_account_id: value(form, 'customerAccountId') || null,
        };
      } else {
        rpc = 'create_new_requirement_version';
        args.p_requirement_id = requirementId;
      }
    } else if (operation === 'lock') {
      const parsed = lockRequirementVersionSchema.safeParse({
        versionId: value(form, 'versionId'),
        reason: value(form, 'reason'),
      });
      if (!parsed.success) return { error: parsed.error.issues[0]?.message };
      rpc = 'lock_requirement_version';
      args = {
        ...args,
        p_version_id: parsed.data.versionId,
        p_reason: parsed.data.reason,
      };
    } else {
      const parsed = transitionRequirementStatusSchema.safeParse({
        requirementId,
        targetStatus: value(form, 'targetStatus'),
      });
      if (!parsed.success) return { error: parsed.error.issues[0]?.message };
      rpc = 'transition_requirement_status';
      args = {
        ...args,
        p_requirement_id: requirementId,
        p_target_status: parsed.data.targetStatus,
      };
    }
    const response = await fetch(ctx.endpoint + '/rpc/' + rpc, {
      method: 'POST',
      headers: ctx.headers,
      body: JSON.stringify(args),
    });
    const result: unknown = await response.json();
    if (!response.ok) {
      const message =
        result && typeof result === 'object' && 'message' in result
          ? String(result.message)
          : 'Gagal menyimpan requirement.';
      return { error: message };
    }
    revalidatePath('/requirements');
    return { success: true };
  } catch {
    return {
      error:
        'Tidak dapat menyimpan requirement. Periksa koneksi dan coba lagi.',
    };
  }
}
import type { RequirementRow } from './data';
