import 'server-only';
import { assertPermission } from '@mgbos/auth';
import { requirementContext, readRows } from '../requirements/data';

export async function paymentContext() {
  const ctx = await requirementContext();
  assertPermission(ctx.session, 'payments:read');
  return ctx;
}

export { readRows };

export interface PaymentRow {
  id: string;
  organization_id: string;
  brand_id: string;
  customer_account_id: string | null;
  payment_number: string;
  payment_method: string;
  status: string;
  amount: string;
  allocated_amount: string;
  unallocated_amount?: string;
  currency: string;
  payment_date: string;
  received_at: string;
  reference_number: string | null;
  destination_bank: string | null;
  destination_account_number: string | null;
  payer_name: string | null;
  payer_bank: string | null;
  payer_account_number: string | null;
  proof_file_url: string | null;
  notes: string | null;
  created_by_user_id: string;
  created_at: string;
  updated_at: string;
}

export interface PaymentAllocationRow {
  id: string;
  organization_id: string;
  payment_id: string;
  invoice_id: string;
  amount: string;
  notes: string | null;
  created_at: string;
}

export interface PaymentAuditRow {
  id: string;
  organization_id: string;
  payment_id: string;
  actor_id: string;
  action: string;
  details: Record<string, unknown>;
  created_at: string;
}

export const rupiah = (value: string | bigint | number | null | undefined) => {
  if (value === null || value === undefined) return '-';
  try {
    return 'Rp ' + BigInt(value).toLocaleString('id-ID');
  } catch {
    return 'Rp 0';
  }
};

export const getUnallocated = (p: {
  amount: string | bigint | number;
  allocated_amount: string | bigint | number;
}): bigint => {
  try {
    const total = BigInt(p.amount);
    const allocated = BigInt(p.allocated_amount);
    const diff = total - allocated;
    return diff > 0n ? diff : 0n;
  } catch {
    return 0n;
  }
};
