'use server';

import { revalidatePath } from 'next/cache';
import { checkPermission } from '@mgbos/auth';
import {
  createVendorSchema,
  upsertVendorRateCardSchema,
} from '@mgbos/validation';
import { vendorContext } from './data';

export interface VendorActionResult {
  success?: boolean;
  error?: string;
  vendorId?: string;
  rateCardId?: string;
}

export async function createVendorAction(
  input: unknown,
): Promise<VendorActionResult> {
  try {
    const ctx = await vendorContext();
    const permission = checkPermission(ctx.session, 'vendors:create');
    if (!permission.allowed) return { error: permission.error };

    const parsed = createVendorSchema.safeParse(input);
    if (!parsed.success) {
      return {
        error: parsed.error.issues[0]?.message ?? 'Periksa data vendor.',
      };
    }

    const d = parsed.data;

    const response = await fetch(ctx.endpoint + '/rpc/create_vendor', {
      method: 'POST',
      headers: ctx.headers,
      body: JSON.stringify({
        p_organization_id: ctx.session.organization.id,
        p_actor_id: ctx.session.user.id,
        p_code: d.code,
        p_name: d.name,
        p_category: d.category,
        p_contact_person: d.contactPerson ?? null,
        p_phone: d.phone ?? null,
        p_email: d.email ?? null,
        p_address: d.address ?? null,
        p_lead_time_days: d.leadTimeDays,
        p_payment_terms: d.paymentTerms,
        p_notes: d.notes ?? null,
      }),
    });

    const result: unknown = await response.json();
    if (!response.ok) {
      return {
        error:
          result && typeof result === 'object' && 'message' in result
            ? String(result.message)
            : 'Gagal mendaftarkan vendor.',
      };
    }

    revalidatePath('/vendors');

    return {
      success: true,
      vendorId: typeof result === 'string' ? result : undefined,
    };
  } catch {
    return {
      error: 'Koneksi gagal saat mendaftarkan vendor. Coba lagi.',
    };
  }
}

export async function upsertVendorRateCardAction(
  input: unknown,
): Promise<VendorActionResult> {
  try {
    const ctx = await vendorContext();
    const permission = checkPermission(ctx.session, 'vendors:update');
    if (!permission.allowed) return { error: permission.error };

    const parsed = upsertVendorRateCardSchema.safeParse(input);
    if (!parsed.success) {
      return {
        error: parsed.error.issues[0]?.message ?? 'Periksa data rate card.',
      };
    }

    const d = parsed.data;

    const response = await fetch(
      ctx.endpoint + '/rpc/upsert_vendor_rate_card',
      {
        method: 'POST',
        headers: ctx.headers,
        body: JSON.stringify({
          p_organization_id: ctx.session.organization.id,
          p_actor_id: ctx.session.user.id,
          p_vendor_id: d.vendorId,
          p_service_code: d.serviceCode,
          p_description: d.description,
          p_unit: d.unit,
          p_unit_cost: d.unitCost.toString(),
          p_min_order_quantity: d.minOrderQuantity,
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
            : 'Gagal memperbarui rate card vendor.',
      };
    }

    revalidatePath('/vendors');
    revalidatePath(`/vendors/${d.vendorId}`);

    return {
      success: true,
      rateCardId: typeof result === 'string' ? result : undefined,
    };
  } catch {
    return {
      error: 'Koneksi gagal saat memperbarui rate card vendor. Coba lagi.',
    };
  }
}
