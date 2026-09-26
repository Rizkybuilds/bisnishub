import 'server-only';
import { assertPermission } from '@mgbos/auth';
import { requirementContext, readRows } from '../requirements/data';

export async function orderContext() {
  const ctx = await requirementContext();
  assertPermission(ctx.session, 'orders:read');
  return ctx;
}

export { readRows };

export interface OrderRow {
  id: string;
  order_number: string;
  order_type: 'CUSTOM_B2B' | 'RETAIL_DIRECT';
  status: string;
  currency: string;
  subtotal: string;
  discount_total: string;
  shipping_total: string;
  grand_total: string;
  estimated_cost_total: string;
  estimated_gross_profit: string;
  customer_snapshot: {
    display_name: string;
    legal_name?: string;
    email?: string;
    phone?: string;
  };
  shipping_address_snapshot: {
    recipient_name: string;
    phone: string;
    street: string;
    city: string;
    province?: string;
    postal_code?: string;
    courier_service?: string;
    notes?: string;
  };
  billing_address_snapshot?: Record<string, unknown>;
  payment_terms_snapshot: {
    payment_terms?: string;
    lead_time?: string;
    notes?: string;
    order_notes?: string;
  };
  source_quote_id: string | null;
  source_quote_version_id: string | null;
  confirmed_at: string;
  created_at: string;
}

export interface OrderItemRow {
  id: string;
  order_id: string;
  position: number;
  inventory_item_id?: string | null;
  description: string;
  quantity: number;
  unit: string;
  unit_price: string;
  discount_total: string;
  subtotal: string;
  specification_snapshot: Record<string, unknown>;
  created_at: string;
}

export interface OrderAuditRow {
  id: string;
  order_id: string;
  actor_id: string;
  action: string;
  details: Record<string, unknown>;
  created_at: string;
}

export const rupiah = (value: string | bigint | number) =>
  'Rp ' + BigInt(value).toLocaleString('id-ID');

export interface RetailItemOption {
  id: string;
  sku: string;
  name: string;
  unit: string;
  category: string;
  cost_price: string;
  quantity_on_hand: number;
  quantity_reserved: number;
  quantity_available: number;
}
