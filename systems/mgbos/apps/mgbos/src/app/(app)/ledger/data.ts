import 'server-only';
import { assertPermission } from '@mgbos/auth';
import { requirementContext, readRows } from '../requirements/data';

export async function ledgerContext() {
  const ctx = await requirementContext();
  assertPermission(ctx.session, 'ledger:read');
  return ctx;
}

export { readRows };

export interface OrderFinancialSummaryRow {
  order_id: string;
  organization_id: string;
  brand_id: string;
  brand_code: string;
  brand_name: string;
  customer_account_id: string;
  customer_name: string;
  order_number: string;
  order_status: string;
  confirmed_at: string;
  currency: string;
  subtotal: string | number;
  discount_total: string | number;
  net_product_revenue: string | number;
  courier_shipping_fee: string | number;
  grand_total: string | number;
  total_invoiced: string | number;
  total_balance_due: string | number;
  total_cash_received: string | number;
  billing_status: string;
  estimated_cost: string | number;
  committed_cost: string | number;
  actual_cost: string | number;
  effective_cost: string | number;
  is_cost_settled: boolean;
  estimated_gross_profit: string | number;
  realized_gross_profit: string | number;
  estimated_margin_pct: number;
  realized_margin_pct: number;
  courier_shipping_margin: string | number;
  margin_health: 'HEALTHY' | 'MODERATE' | 'LOW_MARGIN' | 'CRITICAL';
}

export interface FinancialLedgerEntryRow {
  id: string;
  organization_id: string;
  brand_id: string;
  order_id: string | null;
  entry_number: string;
  entry_type: string;
  category: string;
  amount: string | number;
  direction: 'DEBIT' | 'CREDIT';
  currency: string;
  reference_id: string | null;
  reference_document: string | null;
  metadata: Record<string, unknown>;
  notes: string | null;
  created_by_user_id: string;
  created_at: string;
}

export { rupiah, percent } from './formatters';
