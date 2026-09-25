'use server';

import { revalidatePath } from 'next/cache';
import { requireAuth } from '@/lib/session.server';
import { serverEnvironment } from '@/lib/env.server';
import { publicEnvironment } from '@/lib/env.client';
import {
  createLeadSchema,
  qualifyLeadSchema,
  disqualifyLeadSchema,
  convertLeadSchema,
} from '@mgbos/validation';
import { evaluateLeadQualification } from '@mgbos/domain';
import { checkPermission } from '@mgbos/auth';

export interface LeadActionState {
  success?: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
}

export async function createLeadAction(
  _prevState: LeadActionState,
  formData: FormData,
): Promise<LeadActionState> {
  const session = await requireAuth();
  const permCheck = checkPermission(session, 'leads:create');
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

  const endpoint = `${supabaseUrl.replace(/\/+$/, '')}/rest/v1`;
  const headers: Record<string, string> = {
    apikey: serviceKey,
    Authorization: `Bearer ${serviceKey}`,
    'Content-Type': 'application/json',
    'Accept-Profile': 'app',
    'Content-Profile': 'app',
    Prefer: 'return=representation',
  };

  // Find active brand id
  const brandRes = await fetch(
    `${endpoint}/brands?organization_id=eq.${session.organization.id}&code=eq.${session.activeBrand.code}&select=id`,
    { headers, cache: 'no-store' },
  );
  const brands = brandRes.ok ? await brandRes.json() : [];
  const brandId = brands[0]?.id;

  if (!brandId) {
    return { success: false, error: 'Brand aktif tidak ditemukan' };
  }

  const channelCode = (formData.get('channelCode') as string) || 'WHATSAPP';
  const channelRes = await fetch(
    `${endpoint}/channels?organization_id=eq.${session.organization.id}&code=eq.${channelCode}&select=id`,
    { headers, cache: 'no-store' },
  );
  const channels = channelRes.ok ? await channelRes.json() : [];
  const channelId = channels[0]?.id;

  if (!channelId) {
    return { success: false, error: 'Channel sumber lead tidak valid' };
  }

  const title = (formData.get('title') as string) || '';
  const contactName = (formData.get('contactName') as string) || null;
  const companyName = (formData.get('companyName') as string) || null;
  const email = (formData.get('email') as string) || null;
  const phone = (formData.get('phone') as string) || null;
  const rawInquiry = (formData.get('rawInquiry') as string) || null;
  const qtyStr = formData.get('estimatedQuantity') as string;
  const budgetStr = formData.get('estimatedBudget') as string;

  const estimatedQuantity =
    qtyStr && parseInt(qtyStr, 10) > 0 ? parseInt(qtyStr, 10) : null;
  const estimatedBudget =
    budgetStr && parseInt(budgetStr, 10) > 0 ? parseInt(budgetStr, 10) : null;

  const validation = createLeadSchema.safeParse({
    organizationId: session.organization.id,
    brandId,
    channelId,
    title,
    contactName: contactName || undefined,
    companyName: companyName || undefined,
    email: email || undefined,
    phone: phone || undefined,
    rawInquiry: rawInquiry || undefined,
    estimatedQuantity: estimatedQuantity || undefined,
    estimatedBudget: estimatedBudget || undefined,
  });

  if (!validation.success) {
    const issues = validation.error.issues;
    const fieldErrors: Record<string, string> = {};
    for (const issue of issues) {
      const field = issue.path[0]?.toString() || 'form';
      fieldErrors[field] = issue.message;
    }
    return {
      success: false,
      error: issues[0]?.message || 'Data lead tidak valid',
      fieldErrors,
    };
  }

  // Pre-evaluate qualification
  const evalResult = evaluateLeadQualification({
    contactName,
    email,
    phone,
    rawInquiry,
    estimatedQuantity,
  });

  const leadPayload = {
    organization_id: session.organization.id,
    brand_id: brandId,
    channel_id: channelId,
    title: title.trim(),
    contact_name: contactName?.trim() || null,
    company_name: companyName?.trim() || null,
    email: email?.trim() || null,
    phone: phone?.trim() || null,
    raw_inquiry: rawInquiry?.trim() || null,
    estimated_quantity: estimatedQuantity,
    estimated_budget: estimatedBudget,
    status: 'NEW',
    qualification_score: evalResult.score,
    qualification_notes: evalResult.notes,
  };

  const createRes = await fetch(`${endpoint}/leads`, {
    method: 'POST',
    headers,
    body: JSON.stringify(leadPayload),
  });

  if (!createRes.ok) {
    const errText = await createRes.text();
    return { success: false, error: `Gagal membuat lead: ${errText}` };
  }

  revalidatePath('/leads');
  return { success: true };
}

export async function qualifyLeadAction(
  _prevState: LeadActionState,
  formData: FormData,
): Promise<LeadActionState> {
  const session = await requireAuth();
  const permCheck = checkPermission(session, 'leads:qualify');
  if (!permCheck.allowed) {
    return { success: false, error: permCheck.error };
  }

  const supabaseUrl =
    publicEnvironment.NEXT_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:55431';
  const serviceKey = serverEnvironment.SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceKey) {
    return { success: false, error: 'Database credentials missing' };
  }

  const leadId = formData.get('leadId') as string;
  const qualificationNotes =
    (formData.get('qualificationNotes') as string) || null;
  const scoreStr = formData.get('qualificationScore') as string;
  const qualificationScore = scoreStr ? parseInt(scoreStr, 10) : 85;

  const validation = qualifyLeadSchema.safeParse({
    leadId,
    qualificationNotes: qualificationNotes || undefined,
    qualificationScore,
  });

  if (!validation.success) {
    return {
      success: false,
      error:
        validation.error.issues[0]?.message || 'Data kualifikasi tidak valid',
    };
  }

  const endpoint = `${supabaseUrl.replace(/\/+$/, '')}/rest/v1`;
  const headers: Record<string, string> = {
    apikey: serviceKey,
    Authorization: `Bearer ${serviceKey}`,
    'Content-Type': 'application/json',
    'Accept-Profile': 'app',
    'Content-Profile': 'app',
  };

  const rpcRes = await fetch(`${endpoint}/rpc/transition_lead_status`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      p_organization_id: session.organization.id,
      p_lead_id: leadId,
      p_target_status: 'QUALIFIED',
      p_qualification_result: 'QUALIFIED',
      p_qualification_score: qualificationScore,
      p_qualification_notes:
        qualificationNotes ||
        'Kualifikasi disetujui (memenuhi syarat pesanan).',
      p_actor_id: session.user.id,
    }),
  });

  if (!rpcRes.ok) {
    const errObj = await rpcRes.json().catch(() => ({}));
    return {
      success: false,
      error: errObj.message || 'Gagal memperbarui status lead',
    };
  }

  revalidatePath('/leads');
  return { success: true };
}

export async function disqualifyLeadAction(
  _prevState: LeadActionState,
  formData: FormData,
): Promise<LeadActionState> {
  const session = await requireAuth();
  const permCheck = checkPermission(session, 'leads:disqualify');
  if (!permCheck.allowed) {
    return { success: false, error: permCheck.error };
  }

  const supabaseUrl =
    publicEnvironment.NEXT_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:55431';
  const serviceKey = serverEnvironment.SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceKey) {
    return { success: false, error: 'Database credentials missing' };
  }

  const leadId = formData.get('leadId') as string;
  const reason = (formData.get('reason') as string) || '';
  const notes = (formData.get('qualificationNotes') as string) || '';

  const validation = disqualifyLeadSchema.safeParse({
    leadId,
    reason,
    qualificationNotes: notes,
  });

  if (!validation.success) {
    return {
      success: false,
      error:
        validation.error.issues[0]?.message ||
        'Data diskualifikasi tidak valid',
    };
  }

  const endpoint = `${supabaseUrl.replace(/\/+$/, '')}/rest/v1`;
  const headers: Record<string, string> = {
    apikey: serviceKey,
    Authorization: `Bearer ${serviceKey}`,
    'Content-Type': 'application/json',
    'Accept-Profile': 'app',
    'Content-Profile': 'app',
  };

  const rpcRes = await fetch(`${endpoint}/rpc/transition_lead_status`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      p_organization_id: session.organization.id,
      p_lead_id: leadId,
      p_target_status: 'DISQUALIFIED',
      p_qualification_result: 'DISQUALIFIED',
      p_disqualification_reason: reason,
      p_qualification_notes: notes,
      p_actor_id: session.user.id,
    }),
  });

  if (!rpcRes.ok) {
    const errObj = await rpcRes.json().catch(() => ({}));
    return {
      success: false,
      error: errObj.message || 'Gagal mendiskualifikasi lead',
    };
  }

  revalidatePath('/leads');
  return { success: true };
}

export async function convertLeadAction(
  _prevState: LeadActionState,
  formData: FormData,
): Promise<LeadActionState> {
  const session = await requireAuth();
  const permCheck = checkPermission(session, 'leads:convert');
  if (!permCheck.allowed) {
    return { success: false, error: permCheck.error };
  }

  const supabaseUrl =
    publicEnvironment.NEXT_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:55431';
  const serviceKey = serverEnvironment.SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceKey) {
    return { success: false, error: 'Database credentials missing' };
  }

  const leadId = (formData.get('leadId') as string) || '';
  const customerAccountId =
    (formData.get('customerAccountId') as string) || null;
  const createNewAccount = formData.get('createNewAccount') === 'true';

  const validation = convertLeadSchema.safeParse({
    leadId,
    customerAccountId,
    createNewAccount,
  });

  if (!validation.success) {
    return {
      success: false,
      error: validation.error.issues[0]?.message || 'Data konversi tidak valid',
    };
  }

  const endpoint = `${supabaseUrl.replace(/\/+$/, '')}/rest/v1`;
  const headers: Record<string, string> = {
    apikey: serviceKey,
    Authorization: `Bearer ${serviceKey}`,
    'Content-Type': 'application/json',
    'Accept-Profile': 'app',
    'Content-Profile': 'app',
  };

  const rpcRes = await fetch(`${endpoint}/rpc/convert_lead_to_customer`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      p_organization_id: session.organization.id,
      p_lead_id: leadId,
      p_create_new_account: createNewAccount,
      p_customer_account_id: customerAccountId || null,
      p_actor_id: session.user.id,
    }),
  });

  if (!rpcRes.ok) {
    const errObj = await rpcRes.json().catch(() => ({}));
    return {
      success: false,
      error: errObj.message || 'Gagal mengonversi status lead ke customer',
    };
  }

  revalidatePath('/leads');
  revalidatePath('/customers');
  return { success: true };
}
