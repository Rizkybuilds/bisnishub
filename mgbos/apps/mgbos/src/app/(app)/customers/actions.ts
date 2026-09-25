'use server';

import { revalidatePath } from 'next/cache';
import { requireAuth } from '@/lib/session.server';
import { serverEnvironment } from '@/lib/env.server';
import { publicEnvironment } from '@/lib/env.client';
import {
  createCustomerAccountSchema,
  createCustomerContactSchema,
} from '@mgbos/validation';
import { checkPermission } from '@mgbos/auth';

export interface CreateCustomerState {
  success?: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
}

export async function createCustomerAction(
  _prevState: CreateCustomerState,
  formData: FormData,
): Promise<CreateCustomerState> {
  const session = await requireAuth();
  const permCheck = checkPermission(session, 'customers:create');
  if (!permCheck.allowed) {
    return { success: false, error: permCheck.error };
  }

  const supabaseUrl =
    publicEnvironment.NEXT_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:55431';
  const serviceKey = serverEnvironment.SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceKey) {
    return {
      success: false,
      error: 'Supabase credentials are not configured on the server',
    };
  }

  const accountType = (formData.get('accountType') as string) || 'PERSON';
  const displayName = (formData.get('displayName') as string) || '';
  const legalName = (formData.get('legalName') as string) || null;
  const primaryEmail = (formData.get('primaryEmail') as string) || null;
  const primaryPhone = (formData.get('primaryPhone') as string) || null;
  const taxId = (formData.get('taxId') as string) || null;

  // Contact person details
  const contactName = (formData.get('contactName') as string) || '';
  const contactPosition = (formData.get('contactPosition') as string) || null;
  const contactEmail = (formData.get('contactEmail') as string) || null;
  const contactPhone = (formData.get('contactPhone') as string) || null;

  // Validate account
  const accountValidation = createCustomerAccountSchema.safeParse({
    organizationId: session.organization.id,
    accountType,
    displayName,
    legalName,
    primaryEmail: primaryEmail || undefined,
    primaryPhone: primaryPhone || undefined,
    taxId: taxId || undefined,
    status: 'ACTIVE',
  });

  if (!accountValidation.success) {
    const issues = accountValidation.error.issues;
    const fieldErrors: Record<string, string> = {};
    for (const issue of issues) {
      const field = issue.path[0]?.toString() || 'form';
      fieldErrors[field] = issue.message;
    }
    return {
      success: false,
      error: issues[0]?.message || 'Data customer tidak valid',
      fieldErrors,
    };
  }

  // If contact name provided, validate contact
  if (contactName.trim()) {
    const contactValidation = createCustomerContactSchema.safeParse({
      name: contactName,
      email: contactEmail || undefined,
      phone: contactPhone || undefined,
      position: contactPosition || undefined,
      isPrimary: true,
    });

    if (!contactValidation.success) {
      return {
        success: false,
        error:
          contactValidation.error.issues[0]?.message ||
          'Data kontak tidak valid',
      };
    }
  }

  const endpoint = `${supabaseUrl.replace(/\/+$/, '')}/rest/v1`;
  const headers: Record<string, string> = {
    apikey: serviceKey,
    Authorization: `Bearer ${serviceKey}`,
    'Content-Type': 'application/json',
    'Accept-Profile': 'app',
    'Content-Profile': 'app',
  };

  try {
    // 1. Resolve active brand id
    const brandRes = await fetch(
      `${endpoint}/brands?organization_id=eq.${session.organization.id}&code=eq.${session.activeBrand.code}&select=id`,
      { headers, cache: 'no-store' },
    );
    const brands = brandRes.ok ? await brandRes.json() : [];
    const brandId = brands[0]?.id || null;

    // 2. Call atomic RPC create_customer_with_contact
    const rpcRes = await fetch(`${endpoint}/rpc/create_customer_with_contact`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        p_organization_id: session.organization.id,
        p_brand_id: brandId,
        p_account_type: accountValidation.data.accountType,
        p_display_name: accountValidation.data.displayName,
        p_legal_name: accountValidation.data.legalName || null,
        p_primary_email: accountValidation.data.primaryEmail || null,
        p_primary_phone: accountValidation.data.primaryPhone || null,
        p_tax_id: accountValidation.data.taxId || null,
        p_contact_name: contactName.trim() || null,
        p_contact_position: contactPosition?.trim() || null,
        p_contact_email: contactEmail?.trim() || null,
        p_contact_phone: contactPhone?.trim() || null,
        p_customer_segment:
          accountValidation.data.accountType === 'COMPANY'
            ? 'CORPORATE'
            : 'RETAIL',
        p_actor_id: session.user.id,
      }),
    });

    if (!rpcRes.ok) {
      const errObj = await rpcRes.json().catch(() => ({}));
      return {
        success: false,
        error: errObj.message || 'Gagal membuat akun customer secara atomik',
      };
    }

    revalidatePath('/customers');
    return { success: true };
  } catch (err: unknown) {
    const msg =
      err instanceof Error
        ? err.message
        : 'Kesalahan sistem saat membuat customer';
    return { success: false, error: msg };
  }
}
