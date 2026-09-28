import 'server-only';
import { assertPermission } from '@mgbos/auth';
import { requirementContext, readRows } from '../requirements/data';
import type { ShipmentStatus } from '@mgbos/domain';

export async function shipmentContext() {
  const ctx = await requirementContext();
  assertPermission(ctx.session, 'shipments:read');
  return ctx;
}

export { readRows };

export interface ShippingAddressSnapshot {
  recipient_name?: string;
  phone?: string;
  street?: string;
  city?: string;
  province?: string;
  postal_code?: string;
  courier_service?: string;
  notes?: string;
}

export interface ShipmentRow {
  id: string;
  organization_id: string;
  brand_id: string;
  order_id: string;
  customer_account_id: string;
  shipment_number: string;
  status: ShipmentStatus;
  courier_name: string;
  courier_service: string | null;
  tracking_number: string | null;
  package_weight_grams: number | null;
  package_count: number;
  actual_shipping_cost: string;
  shipping_address_snapshot: ShippingAddressSnapshot;
  dispatch_date: string | null;
  delivered_date: string | null;
  notes: string | null;
  created_by_user_id: string;
  created_at: string;
  updated_at: string;
}

export interface ShipmentItemRow {
  id: string;
  shipment_id: string;
  order_item_id: string;
  quantity: number;
  notes: string | null;
  created_at: string;
}

export interface ShipmentAuditRow {
  id: string;
  organization_id: string;
  shipment_id: string;
  actor_id: string;
  action: string;
  metadata: Record<string, unknown>;
  created_at: string;
}

export const rupiah = (value: string | bigint | number | null | undefined) => {
  if (value === null || value === undefined) return '-';
  return 'Rp ' + BigInt(value).toLocaleString('id-ID');
};
