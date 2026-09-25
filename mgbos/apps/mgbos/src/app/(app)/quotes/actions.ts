'use server';
import { revalidatePath } from 'next/cache';
import { checkPermission } from '@mgbos/auth';
import { saveQuoteSchema } from '@mgbos/validation';
import { quoteContext } from './data';
export interface QuoteResult {
  success?: boolean;
  error?: string;
  quoteId?: string;
}
export async function saveQuote(input: unknown): Promise<QuoteResult> {
  try {
    const ctx = await quoteContext();
    const permission = checkPermission(ctx.session, 'quotes:create');
    if (!permission.allowed) return { error: permission.error };
    const parsed = saveQuoteSchema.safeParse(input);
    if (!parsed.success)
      return {
        error: parsed.error.issues[0]?.message ?? 'Periksa data penawaran.',
      };
    const d = parsed.data;
    const response = await fetch(ctx.endpoint + '/rpc/save_quote_version', {
      method: 'POST',
      headers: ctx.headers,
      body: JSON.stringify({
        p_organization_id: ctx.session.organization.id,
        p_actor_id: ctx.session.user.id,
        p_request_id: d.requestId,
        p_quote_id: d.quoteId,
        p_expected_version_id: d.expectedVersionId,
        p_requirement_version_id: d.requirementVersionId,
        p_customer_id: d.customerId,
        p_unit_price: d.unitPrice,
        p_discount: d.discount,
        p_shipping: d.shipping,
        p_costs: d.costs,
        p_valid_until: d.validUntil,
        p_terms: d.terms,
        p_lead_time: d.leadTime,
        p_notes: d.notes,
      }),
    });
    const result: unknown = await response.json();
    if (!response.ok)
      return {
        error:
          result && typeof result === 'object' && 'message' in result
            ? String(result.message)
            : 'Gagal menyimpan penawaran.',
      };
    if (!result || typeof result !== 'object' || !('quote_id' in result))
      return { error: 'Respons penyimpanan tidak dikenali.' };
    revalidatePath('/quotes');
    return { success: true, quoteId: String(result.quote_id) };
  } catch {
    return {
      error:
        'Penyimpanan belum dapat dipastikan. Coba lagi dengan form yang sama; permintaan yang sama tidak akan membuat versi ganda.',
    };
  }
}
export async function quoteCommand(
  _state: QuoteResult,
  form: FormData,
): Promise<QuoteResult> {
  try {
    const ctx = await quoteContext();
    const operation = form.get('operation');
    if (
      operation !== 'approve' &&
      operation !== 'send' &&
      operation !== 'accept'
    )
      return { error: 'Perintah tidak valid.' };
    const check = checkPermission(
      ctx.session,
      operation === 'approve'
        ? 'quotes:approve'
        : operation === 'accept'
          ? 'quotes:accept'
          : 'quotes:send',
    );
    if (!check.allowed) return { error: check.error };
    const id = form.get('versionId');
    if (typeof id !== 'string' || !/^[0-9a-f-]{36}$/i.test(id))
      return { error: 'Versi tidak valid.' };
    const reason = form.get('reason');
    const method = form.get('acceptanceMethod') || 'WHATSAPP';
    const notes = form.get('acceptanceNotes');
    const rpcName =
      operation === 'approve'
        ? 'approve_quote_price'
        : operation === 'accept'
          ? 'mark_quote_accepted'
          : 'mark_quote_sent';

    const rpcBody: Record<string, unknown> = {
      p_organization_id: ctx.session.organization.id,
      p_actor_id: ctx.session.user.id,
      p_version_id: id,
    };
    if (operation === 'approve') {
      rpcBody.p_reason = typeof reason === 'string' ? reason.trim() : '';
    } else if (operation === 'accept') {
      rpcBody.p_acceptance_method =
        typeof method === 'string' ? method.trim() : 'WHATSAPP';
      rpcBody.p_notes = typeof notes === 'string' ? notes.trim() : null;
    }

    const response = await fetch(ctx.endpoint + '/rpc/' + rpcName, {
      method: 'POST',
      headers: ctx.headers,
      body: JSON.stringify(rpcBody),
    });
    const result: unknown = await response.json();
    if (!response.ok)
      return {
        error:
          result && typeof result === 'object' && 'message' in result
            ? String(result.message)
            : 'Perubahan ditolak.',
      };
    revalidatePath('/quotes');
    revalidatePath('/requirements');
    return { success: true };
  } catch {
    return {
      error:
        'Tidak dapat memproses perubahan. Muat ulang untuk memeriksa status.',
    };
  }
}
