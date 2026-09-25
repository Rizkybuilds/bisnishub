import 'server-only';
import { assertPermission } from '@mgbos/auth';
import { requirementContext, readRows } from '../requirements/data';

export async function invoiceContext() {
  const ctx = await requirementContext();
  assertPermission(ctx.session, 'invoices:read');
  return ctx;
}

export { readRows };

export interface InvoiceRow {
  id: string;
  organization_id: string;
  brand_id: string;
  order_id: string;
  customer_account_id: string;
  invoice_number: string;
  invoice_type: string;
  status: string;
  currency: string;
  amount_subtotal: string;
  amount_tax: string;
  amount_shipping: string;
  amount_total: string;
  amount_paid: string;
  balance_due: string;
  due_date: string;
  issued_at: string | null;
  paid_at: string | null;
  bank_account_snapshot: {
    bank_name?: string;
    account_number?: string;
    account_name?: string;
    branch?: string;
    qris_enabled?: boolean;
  };
  customer_snapshot: {
    display_name?: string;
    legal_name?: string | null;
    email?: string | null;
    phone?: string | null;
  };
  payment_instructions: string | null;
  notes: string | null;
  created_by_user_id: string;
  created_at: string;
  updated_at: string;
}

export interface InvoiceItemRow {
  id: string;
  invoice_id: string;
  order_item_id: string | null;
  description: string;
  quantity: number;
  unit_price: string;
  subtotal: string;
  notes: string | null;
  created_at: string;
}

export interface InvoiceAuditRow {
  id: string;
  organization_id: string;
  invoice_id: string;
  actor_id: string;
  action: string;
  details: Record<string, unknown>;
  created_at: string;
}

export const rupiah = (value: string | bigint | number | null | undefined) => {
  if (value === null || value === undefined) return '-';
  return 'Rp ' + BigInt(value).toLocaleString('id-ID');
};
