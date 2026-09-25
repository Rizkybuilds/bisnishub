import 'server-only';
import { getSession } from '@/lib/session.server';
import { hasPermission } from '@mgbos/auth';
import { serverEnvironment } from '@/lib/env.server';
import { publicEnvironment } from '@/lib/env.client';
import { buildQuotationDocument, type QuotationSource } from './document';
export class DocumentAccessError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}
export async function loadQuotation(quoteId: string, versionId: string) {
  const session = await getSession();
  if (!session)
    throw new DocumentAccessError(401, 'Silakan masuk terlebih dahulu.');
  if (!hasPermission(session.role.code, 'quotes:read'))
    throw new DocumentAccessError(403, 'Akun tidak memiliki akses penawaran.');
  const uuid =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuid.test(quoteId) || !uuid.test(versionId))
    throw new DocumentAccessError(404, 'Dokumen tidak ditemukan.');
  const base = publicEnvironment.NEXT_PUBLIC_SUPABASE_URL,
    key = serverEnvironment.SUPABASE_SERVICE_ROLE_KEY;
  if (!base || !key) throw new Error('Database belum dikonfigurasi.');
  async function rows<T>(path: string): Promise<T[]> {
    const r = await fetch(base + '/rest/v1/' + path, {
      headers: {
        apikey: key!,
        Authorization: 'Bearer ' + key,
        'Accept-Profile': 'app',
      },
      cache: 'no-store',
    });
    if (!r.ok) throw new Error('Dokumen belum dapat dimuat.');
    return r.json() as Promise<T[]>;
  }
  const parent = (
    await rows<{
      id: string;
      quote_number: string;
      current_version_id: string;
    }>(
      'quotes?id=eq.' +
        quoteId +
        '&organization_id=eq.' +
        session.organization.id +
        '&select=id,quote_number,current_version_id',
    )
  )[0];
  if (!parent) throw new DocumentAccessError(404, 'Dokumen tidak ditemukan.');
  const v = (
    await rows<{
      id: string;
      version_number: number;
      status: string;
      created_at: string;
      valid_until: string;
      issuer_snapshot: QuotationSource['issuer'];
      customer_snapshot: QuotationSource['customer'];
      terms_snapshot: QuotationSource['terms'];
      subtotal: string;
      discount_total: string;
      shipping_total: string;
      grand_total: string;
    }>(
      'quote_versions?id=eq.' +
        versionId +
        '&quote_id=eq.' +
        parent.id +
        '&select=id,version_number,status,created_at,valid_until,issuer_snapshot,customer_snapshot,terms_snapshot,subtotal:subtotal::text,discount_total:discount_total::text,shipping_total:shipping_total::text,grand_total:grand_total::text',
    )
  )[0];
  if (!v) throw new DocumentAccessError(404, 'Versi tidak ditemukan.');
  const items = await rows<{
    description: string;
    quantity: number;
    unit: string;
    unit_price: string;
    subtotal: string;
    specification: Record<string, unknown>;
  }>(
    'quote_items?quote_version_id=eq.' +
      v.id +
      '&select=description,quantity,unit,unit_price:unit_price::text,subtotal:subtotal::text,specification&order=position',
  );
  const today = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Jakarta',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
  return buildQuotationDocument(
    {
      quoteNumber: parent.quote_number,
      versionId: v.id,
      versionNumber: v.version_number,
      isCurrent: parent.current_version_id === v.id,
      status: v.status,
      createdAt: v.created_at,
      validUntil: v.valid_until,
      issuer: v.issuer_snapshot,
      customer: v.customer_snapshot,
      terms: v.terms_snapshot,
      subtotal: v.subtotal,
      discount: v.discount_total,
      shipping: v.shipping_total,
      total: v.grand_total,
      items: items.map((i) => ({
        description: i.description,
        quantity: i.quantity,
        unit: i.unit,
        unitPrice: i.unit_price,
        subtotal: i.subtotal,
        specification: i.specification,
      })),
    },
    today,
  );
}
