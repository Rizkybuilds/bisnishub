import 'server-only';
import { assertPermission } from '@mgbos/auth';
import { requirementContext, readRows } from '../requirements/data';

export async function vendorContext() {
  const ctx = await requirementContext();
  assertPermission(ctx.session, 'vendors:read');
  return ctx;
}

export { readRows };

export interface VendorRow {
  id: string;
  organization_id: string;
  code: string;
  name: string;
  category: string;
  contact_person: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  lead_time_days: number;
  rating: number;
  status: string;
  payment_terms: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface VendorRateCardRow {
  id: string;
  vendor_id: string;
  service_code: string;
  description: string;
  unit: string;
  unit_cost: string;
  min_order_quantity: number;
  is_active: boolean;
  effective_date: string;
  notes: string | null;
  created_at: string;
}

export const rupiah = (value: string | bigint | number | null | undefined) => {
  if (value === null || value === undefined) return '-';
  return 'Rp ' + BigInt(value).toLocaleString('id-ID');
};
