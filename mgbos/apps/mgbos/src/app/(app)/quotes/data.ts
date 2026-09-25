import 'server-only';
import { assertPermission } from '@mgbos/auth';
import { requirementContext, readRows } from '../requirements/data';
export async function quoteContext() {
  const ctx = await requirementContext();
  assertPermission(ctx.session, 'quotes:read');
  return ctx;
}
export { readRows };
export interface QuoteRow {
  id: string;
  quote_number: string;
  current_version_id: string;
  customer_account_id: string;
  requirement_id: string;
}
export interface QuoteVersionRow {
  id: string;
  quote_id: string;
  version_number: number;
  requirement_version_id: string;
  status: string;
  subtotal: string;
  discount_total: string;
  shipping_total: string;
  grand_total: string;
  estimated_cost_total: string;
  estimated_gross_profit: string;
  pricing_guard: string;
  valid_until: string;
  terms_snapshot: { payment_terms: string; lead_time: string; notes: string };
  customer_snapshot: { display_name: string };
}
export interface CostRow {
  cost_type: string;
  description: string;
  quantity: number;
  unit_cost: string;
  total_cost?: string;
}
export interface RequirementChoice {
  id: string;
  versionId: string;
  title: string;
  quantity: number;
  unit: string;
  customerId: string | null;
}
export const rupiah = (value: string | bigint) =>
  'Rp ' + BigInt(value).toLocaleString('id-ID');
export function marginText(profit: string | bigint, revenue: string | bigint) {
  const bps = (BigInt(profit) * 10000n) / BigInt(revenue);
  const abs = bps < 0n ? -bps : bps;
  return `${bps < 0n ? '-' : ''}${abs / 100n},${(abs % 100n).toString().padStart(2, '0')}%`;
}
