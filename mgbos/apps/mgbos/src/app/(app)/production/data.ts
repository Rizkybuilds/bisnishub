import 'server-only';
import { assertPermission } from '@mgbos/auth';
import { requirementContext, readRows } from '../requirements/data';

export async function productionContext() {
  const ctx = await requirementContext();
  assertPermission(ctx.session, 'production:read');
  return ctx;
}

export { readRows };

export interface ProductionJobRow {
  id: string;
  organization_id: string;
  brand_id: string;
  order_id: string;
  job_number: string;
  job_type: string;
  title: string;
  status: string;
  priority: string;
  target_completion_date: string | null;
  estimated_cost: string;
  committed_cost: string | null;
  actual_cost: string | null;
  currency: string;
  specification: Record<string, unknown>;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProductionJobItemRow {
  id: string;
  production_job_id: string;
  order_item_id: string;
  quantity: number;
  notes: string | null;
}

export interface ProductionAssignmentRow {
  id: string;
  production_job_id: string;
  executor_type: string;
  assigned_brand_id: string | null;
  vendor_name: string | null;
  assigned_cost: string;
  status: string;
  assigned_at: string;
  accepted_at: string | null;
  notes: string | null;
}

export interface ProductionJobAuditRow {
  id: string;
  production_job_id: string;
  actor_id: string;
  action: string;
  details: Record<string, unknown>;
  created_at: string;
}

export interface QcInspectionRow {
  id: string;
  organization_id: string;
  production_job_id: string;
  inspector_id: string;
  inspection_number: string;
  result: string;
  sample_size: number;
  defect_count: number;
  defect_category: string | null;
  defect_severity: string | null;
  checklist_snapshot: Record<string, unknown>;
  rework_instructions: string | null;
  notes: string | null;
  inspected_at: string;
  created_at: string;
}

export const rupiah = (value: string | bigint | number | null | undefined) => {
  if (value === null || value === undefined) return '-';
  return 'Rp ' + BigInt(value).toLocaleString('id-ID');
};
