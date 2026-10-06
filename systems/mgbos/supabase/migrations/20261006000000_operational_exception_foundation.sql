-- Migration: 20261006000000_operational_exception_foundation.sql
-- Description: MGBOS Founder Control P2-A / WP-P2A-01 Operational Exception Foundation
-- Specification: MultiGraph Business OS — Founder Control P2-A Technical Implementation Plan v1.0
--
-- Implements:
--   - Authoritative app.operational_exceptions table with controlled vocabularies and integrity constraints
--   - Append-only app.operational_exception_audit table with receipt immutability trigger
--   - Active business deduplication constraint via partial unique index
--   - Idempotent request receipt index
--   - Actor role authorization helper app.operational_exception_actor_role
--   - Governed SECURITY DEFINER command functions:
--       * app.open_operational_exception
--       * app.acknowledge_operational_exception
--       * app.assign_operational_exception
--       * app.reassign_operational_exception
--       * app.change_operational_exception_severity
--       * app.resolve_operational_exception (enforces Owner-only ACCEPTED_RISK)
--       * app.dismiss_operational_exception
--       * app.reopen_operational_exception
--   - Organization isolation and foreign-key integrity across source domains

begin;

-- ============================================================================
-- 1. Main Table: app.operational_exceptions
-- ============================================================================

create table if not exists app.operational_exceptions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references app.organizations(id) on delete cascade,
  brand_id uuid references app.brands(id) on delete set null,
  order_id uuid references app.orders(id) on delete set null,

  exception_category text not null check (
    exception_category in (
      'COMMERCIAL', 'FINANCIAL', 'PRODUCTION', 'VENDOR', 'QUALITY',
      'FULFILLMENT', 'INVENTORY_PROCUREMENT', 'DATA_INTEGRITY',
      'AUTOMATION_IMPACT', 'POLICY_COMPLIANCE', 'OTHER'
    )
  ),

  exception_type text not null check (
    exception_type in (
      'production.deadline_breached',
      'vendor.commitment_problem',
      'quality.qc_failed',
      'fulfillment.delivery_problem',
      'financial.receivable_past_due',
      'financial.actual_cost_missing',
      'financial.margin_exception',
      'other.operational_abnormality'
    )
  ),

  status text not null default 'OPEN' check (
    status in ('OPEN', 'ACKNOWLEDGED', 'RESOLVED', 'DISMISSED')
  ),

  severity text not null check (
    severity in ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')
  ),

  source_kind text not null check (
    source_kind in (
      'DETERMINISTIC_RULE', 'HUMAN_REPORT', 'AUTOMATION_SIGNAL',
      'EXTERNAL_SIGNAL', 'RECONCILIATION'
    )
  ),

  primary_resource_type text not null check (
    primary_resource_type in (
      'ORDER', 'PRODUCTION_JOB', 'PRODUCTION_ASSIGNMENT',
      'QC_INSPECTION', 'INVOICE', 'SHIPMENT'
    )
  ),

  primary_resource_id uuid not null,

  summary text not null check (char_length(trim(summary)) between 5 and 240),
  business_impact text not null check (char_length(trim(business_impact)) between 5 and 2000),
  root_cause text check (root_cause is null or char_length(trim(root_cause)) between 5 and 2000),

  responsible_role_code text not null check (
    responsible_role_code in ('OWNER', 'ADMIN', 'SALES', 'OPERATIONS', 'FINANCE', 'QC')
  ),

  responsible_user_id uuid references app.users(id) on delete set null,

  opening_evidence jsonb not null default '{}'::jsonb,
  other_category_reason text check (
    other_category_reason is null or char_length(trim(other_category_reason)) between 10 and 1000
  ),

  detected_at timestamptz,
  opened_at timestamptz not null default now(),
  acknowledged_at timestamptz,
  closed_at timestamptz,

  resolution_type text check (
    resolution_type is null or resolution_type in (
      'REMEDIATED', 'WORKAROUND', 'SOURCE_CORRECTED', 'ACCEPTED_RISK', 'SUPERSEDED'
    )
  ),

  resolution_summary text check (
    resolution_summary is null or char_length(trim(resolution_summary)) between 5 and 2000
  ),

  closure_evidence jsonb,

  dismissal_reason text check (
    dismissal_reason is null or dismissal_reason in (
      'FALSE_POSITIVE', 'DUPLICATE', 'NOT_APPLICABLE', 'OPENED_IN_ERROR'
    )
  ),

  duplicate_of_exception_id uuid references app.operational_exceptions(id) on delete set null,
  superseded_by_exception_id uuid references app.operational_exceptions(id) on delete set null,

  current_revision bigint not null default 1 check (current_revision >= 1),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- Constraint: Detected time cannot be after opened time
  constraint chk_operational_exceptions_detected_at check (
    detected_at is null or detected_at <= opened_at
  ),

  -- Constraint: OTHER category reason is required iff exception_type is other.operational_abnormality
  constraint chk_operational_exceptions_other_reason check (
    (exception_type = 'other.operational_abnormality' and other_category_reason is not null) or
    (exception_type <> 'other.operational_abnormality' and other_category_reason is null)
  ),

  -- Constraint: Deterministic category mapping (Section 21)
  constraint chk_operational_exceptions_category_mapping check (
    (exception_type = 'production.deadline_breached' and exception_category = 'PRODUCTION') or
    (exception_type = 'vendor.commitment_problem' and exception_category = 'VENDOR') or
    (exception_type = 'quality.qc_failed' and exception_category = 'QUALITY') or
    (exception_type = 'fulfillment.delivery_problem' and exception_category = 'FULFILLMENT') or
    (exception_type = 'financial.receivable_past_due' and exception_category = 'FINANCIAL') or
    (exception_type = 'financial.actual_cost_missing' and exception_category = 'FINANCIAL') or
    (exception_type = 'financial.margin_exception' and exception_category = 'FINANCIAL') or
    (exception_type = 'other.operational_abnormality' and exception_category = 'OTHER')
  ),

  -- Constraint: Deterministic primary resource type mapping (Section 26)
  constraint chk_operational_exceptions_resource_type_mapping check (
    (exception_type = 'production.deadline_breached' and primary_resource_type = 'PRODUCTION_JOB') or
    (exception_type = 'vendor.commitment_problem' and primary_resource_type = 'PRODUCTION_ASSIGNMENT') or
    (exception_type = 'quality.qc_failed' and primary_resource_type = 'QC_INSPECTION') or
    (exception_type = 'fulfillment.delivery_problem' and primary_resource_type = 'SHIPMENT') or
    (exception_type = 'financial.receivable_past_due' and primary_resource_type = 'INVOICE') or
    (exception_type = 'financial.actual_cost_missing' and primary_resource_type = 'PRODUCTION_JOB') or
    (exception_type = 'financial.margin_exception' and primary_resource_type = 'ORDER') or
    (exception_type = 'other.operational_abnormality' and primary_resource_type in ('ORDER', 'PRODUCTION_JOB', 'PRODUCTION_ASSIGNMENT', 'QC_INSPECTION', 'INVOICE', 'SHIPMENT'))
  ),

  -- Constraint: Conditional status coherence (Section 78)
  constraint chk_operational_exceptions_status_coherence check (
    (status = 'OPEN' and closed_at is null and resolution_type is null and resolution_summary is null and dismissal_reason is null) or
    (status = 'ACKNOWLEDGED' and responsible_user_id is not null and acknowledged_at is not null and closed_at is null and resolution_type is null and resolution_summary is null and dismissal_reason is null) or
    (status = 'RESOLVED' and closed_at is not null and resolution_type is not null and resolution_summary is not null and dismissal_reason is null) or
    (status = 'DISMISSED' and closed_at is not null and dismissal_reason is not null and resolution_type is null and resolution_summary is null)
  ),

  -- Constraint: Closure target reference integrity (Section 79)
  constraint chk_operational_exceptions_superseded check (
    (resolution_type = 'SUPERSEDED' and superseded_by_exception_id is not null) or
    ((resolution_type is null or resolution_type <> 'SUPERSEDED') and superseded_by_exception_id is null)
  ),
  constraint chk_operational_exceptions_duplicate check (
    (dismissal_reason = 'DUPLICATE' and duplicate_of_exception_id is not null) or
    ((dismissal_reason is null or dismissal_reason <> 'DUPLICATE') and duplicate_of_exception_id is null)
  ),

  -- Constraint: Self-reference rejection (Section 80)
  constraint chk_operational_exceptions_no_self_ref check (
    (duplicate_of_exception_id is null or duplicate_of_exception_id <> id) and
    (superseded_by_exception_id is null or superseded_by_exception_id <> id)
  )
);

-- Active business deduplication constraint: at most one active exception per org + type + resource (Section 36 & 81)
create unique index if not exists uidx_operational_exceptions_active
  on app.operational_exceptions (
    organization_id,
    exception_type,
    primary_resource_type,
    primary_resource_id
  )
  where status in ('OPEN', 'ACKNOWLEDGED');

-- High-performance query indexes (Section 81)
create index if not exists idx_operational_exceptions_org_status_opened
  on app.operational_exceptions (organization_id, status, opened_at desc);

create index if not exists idx_operational_exceptions_org_severity_status
  on app.operational_exceptions (organization_id, severity, status);

create index if not exists idx_operational_exceptions_org_brand_status_opened
  on app.operational_exceptions (organization_id, brand_id, status, opened_at desc);

create index if not exists idx_operational_exceptions_org_order_status
  on app.operational_exceptions (organization_id, order_id, status);

create index if not exists idx_operational_exceptions_org_resource
  on app.operational_exceptions (organization_id, primary_resource_type, primary_resource_id);

create index if not exists idx_operational_exceptions_responsible_user_status
  on app.operational_exceptions (responsible_user_id, status);

-- ============================================================================
-- 2. Audit Table: app.operational_exception_audit (Sections 43, 44, 48)
-- ============================================================================

create table if not exists app.operational_exception_audit (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references app.organizations(id) on delete cascade,
  operational_exception_id uuid not null references app.operational_exceptions(id) on delete cascade,
  actor_id uuid not null references app.users(id) on delete cascade,

  action text not null check (
    action in (
      'exception.opened',
      'exception.open_deduplicated',
      'exception.acknowledged',
      'exception.assigned',
      'exception.reassigned',
      'exception.severity_changed',
      'exception.resolved',
      'exception.dismissed',
      'exception.reopened'
    )
  ),

  from_status text check (from_status is null or from_status in ('OPEN', 'ACKNOWLEDGED', 'RESOLVED', 'DISMISSED')),
  to_status text check (to_status is null or to_status in ('OPEN', 'ACKNOWLEDGED', 'RESOLVED', 'DISMISSED')),

  request_id uuid not null,
  request_payload jsonb not null default '{}'::jsonb,
  result_snapshot jsonb not null default '{}'::jsonb,
  details jsonb not null default '{}'::jsonb,

  created_at timestamptz not null default now()
);

-- Command receipt uniqueness: one effect per organization + actor + request_id (Section 44)
create unique index if not exists uidx_operational_exception_audit_receipt
  on app.operational_exception_audit (
    organization_id,
    actor_id,
    request_id
  );

create index if not exists idx_operational_exception_audit_exception_created
  on app.operational_exception_audit (
    operational_exception_id,
    created_at asc
  );

-- Trigger: Audit Immutability Guard (Section 48)
create or replace function app.operational_exception_audit_immutable()
returns trigger language plpgsql as $$
begin
  raise exception 'Operational exception audit rows are append-only and cannot be updated or deleted';
end;
$$;

create trigger trg_operational_exception_audit_immutable
  before update or delete on app.operational_exception_audit
  for each row execute function app.operational_exception_audit_immutable();

-- ============================================================================
-- 3. Row Level Security & Access Grants (Section 50)
-- ============================================================================

alter table app.operational_exceptions enable row level security;
alter table app.operational_exception_audit enable row level security;

create or replace function app.can_read_operational_exceptions(
  p_organization_id uuid
) returns boolean language plpgsql stable security definer set search_path=app,pg_temp as $$
begin
  return exists (
    select 1 from app.organization_members om
    join app.roles r on r.id = om.role_id
    join app.users u on u.id = om.user_id
    join app.organizations o on o.id = om.organization_id
    where om.organization_id = p_organization_id
      and u.auth_user_id = auth.uid()
      and om.status = 'ACTIVE'
      and u.status = 'ACTIVE'
      and o.status = 'ACTIVE'
      and r.code in ('OWNER', 'ADMIN')
  );
end;
$$;

revoke execute on function app.can_read_operational_exceptions(uuid) from public, anon;
grant execute on function app.can_read_operational_exceptions(uuid) to authenticated, service_role;

create policy "Allow service_role to view operational_exceptions"
  on app.operational_exceptions for select to service_role using (true);

create policy "Allow owners and admins to view operational_exceptions"
  on app.operational_exceptions for select to authenticated
  using (
    app.can_read_operational_exceptions(organization_id)
  );

create policy "Allow service_role to view operational_exception_audit"
  on app.operational_exception_audit for select to service_role using (true);

create policy "Allow owners and admins to view operational_exception_audit"
  on app.operational_exception_audit for select to authenticated
  using (
    app.can_read_operational_exceptions(organization_id)
  );

grant usage on schema app to authenticated;
grant select on app.operational_exceptions to authenticated, service_role;
grant select on app.operational_exception_audit to authenticated, service_role;

revoke insert, update, delete, truncate on app.operational_exceptions from public, anon, authenticated, service_role;
revoke insert, update, delete, truncate on app.operational_exception_audit from public, anon, authenticated, service_role;

-- ============================================================================
-- 4. Authorization Helper Function (Section 51)
-- ============================================================================

create or replace function app.operational_exception_actor_role(
  p_organization_id uuid,
  p_actor_id uuid
) returns text language plpgsql stable security definer set search_path=app,pg_temp as $$
declare
  v_role text;
begin
  select r.code into v_role
  from app.organization_members om
  join app.roles r on r.id = om.role_id
  join app.users u on u.id = om.user_id
  join app.organizations o on o.id = om.organization_id
  where om.organization_id = p_organization_id
    and om.user_id = p_actor_id
    and om.status = 'ACTIVE'
    and u.status = 'ACTIVE'
    and o.status = 'ACTIVE'
  limit 1;

  if v_role is null then
    raise exception 'Active organization membership required';
  end if;

  return v_role;
end;
$$;

-- ============================================================================
-- 5. Command Function: open_operational_exception (Sections 56..59)
-- ============================================================================

create or replace function app.open_operational_exception(
  p_organization_id uuid,
  p_actor_id uuid,
  p_request_id uuid,
  p_exception_type text,
  p_severity text,
  p_source_kind text,
  p_primary_resource_type text,
  p_primary_resource_id uuid,
  p_responsible_role_code text,
  p_summary text,
  p_business_impact text,
  p_observation text default null,
  p_responsible_user_id uuid default null,
  p_root_cause text default null,
  p_detected_at timestamptz default null,
  p_other_category_reason text default null,
  p_supplementary_evidence jsonb default '{}'::jsonb
) returns jsonb language plpgsql security definer set search_path=app,pg_temp as $$
declare
  v_actor_role text;
  v_prior_audit app.operational_exception_audit%rowtype;
  v_normalized_payload jsonb;
  v_category text;
  v_brand_id uuid;
  v_order_id uuid;
  v_source_snapshot jsonb;
  v_existing app.operational_exceptions%rowtype;
  v_new_exception app.operational_exceptions%rowtype;
  v_opening_evidence jsonb;
  v_result_snapshot jsonb;
  v_resp_role text;
begin
  -- 1. Authorization: Only active OWNER and ADMIN members may open exceptions (Section 57)
  v_actor_role := app.operational_exception_actor_role(p_organization_id, p_actor_id);
  if v_actor_role not in ('OWNER', 'ADMIN') then
    raise exception 'Not authorized to open operational exceptions';
  end if;

  -- 2. Build normalized request payload for idempotency checking
  v_normalized_payload := jsonb_build_object(
    'command', 'open_operational_exception',
    'exception_type', p_exception_type,
    'severity', p_severity,
    'source_kind', p_source_kind,
    'primary_resource_type', p_primary_resource_type,
    'primary_resource_id', p_primary_resource_id,
    'responsible_role_code', p_responsible_role_code,
    'summary', trim(p_summary),
    'business_impact', trim(p_business_impact),
    'observation', case when p_observation is not null then trim(p_observation) else null end,
    'responsible_user_id', p_responsible_user_id,
    'root_cause', case when p_root_cause is not null then trim(p_root_cause) else null end,
    'detected_at', p_detected_at,
    'other_category_reason', case when p_other_category_reason is not null then trim(p_other_category_reason) else null end,
    'supplementary_evidence', coalesce(p_supplementary_evidence, '{}'::jsonb)
  );

  -- Serialize concurrent requests using deterministic request-scoped advisory transaction lock
  perform pg_advisory_xact_lock(hashtextextended(
    'oe_req:' || p_organization_id::text || ':' || p_actor_id::text || ':' || p_request_id::text,
    0
  ));

  -- 3. Idempotency Check on existing request receipt
  select * into v_prior_audit
  from app.operational_exception_audit
  where organization_id = p_organization_id
    and actor_id = p_actor_id
    and request_id = p_request_id;

  if found then
    if v_prior_audit.action in ('exception.opened', 'exception.open_deduplicated')
       and v_prior_audit.request_payload = v_normalized_payload then
      return v_prior_audit.result_snapshot || jsonb_build_object('is_retry', true);
    else
      raise exception 'Idempotency conflict: request_id already used with different payload or command';
    end if;
  end if;

  -- 4. Validate input vocabularies
  if p_source_kind not in ('HUMAN_REPORT', 'RECONCILIATION') then
    raise exception 'Source kind % is not authorized for manual opening in WP01', p_source_kind;
  end if;

  if p_severity not in ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL') then
    raise exception 'Invalid severity: %', p_severity;
  end if;

  if p_responsible_role_code not in ('OWNER', 'ADMIN', 'SALES', 'OPERATIONS', 'FINANCE', 'QC') then
    raise exception 'Invalid responsible role code: %', p_responsible_role_code;
  end if;

  if p_detected_at is not null and p_detected_at > now() then
    raise exception 'detected_at cannot be in the future';
  end if;

  if p_observation is not null and char_length(p_observation) > 4000 then
    raise exception 'Observation exceeds maximum allowed length of 4000 characters';
  end if;

  if p_supplementary_evidence is not null and octet_length(p_supplementary_evidence::text) > 16384 then
    raise exception 'Supplementary evidence exceeds maximum allowed size (16 KiB)';
  end if;

  -- 5. Deterministic Category Derivation & Resource Type Validation (Sections 21 & 26)
  case p_exception_type
    when 'production.deadline_breached' then
      v_category := 'PRODUCTION';
      if p_primary_resource_type <> 'PRODUCTION_JOB' then
        raise exception 'Exception type % requires primary_resource_type PRODUCTION_JOB', p_exception_type;
      end if;
    when 'vendor.commitment_problem' then
      v_category := 'VENDOR';
      if p_primary_resource_type <> 'PRODUCTION_ASSIGNMENT' then
        raise exception 'Exception type % requires primary_resource_type PRODUCTION_ASSIGNMENT', p_exception_type;
      end if;
    when 'quality.qc_failed' then
      v_category := 'QUALITY';
      if p_primary_resource_type <> 'QC_INSPECTION' then
        raise exception 'Exception type % requires primary_resource_type QC_INSPECTION', p_exception_type;
      end if;
    when 'fulfillment.delivery_problem' then
      v_category := 'FULFILLMENT';
      if p_primary_resource_type <> 'SHIPMENT' then
        raise exception 'Exception type % requires primary_resource_type SHIPMENT', p_exception_type;
      end if;
    when 'financial.receivable_past_due' then
      v_category := 'FINANCIAL';
      if p_primary_resource_type <> 'INVOICE' then
        raise exception 'Exception type % requires primary_resource_type INVOICE', p_exception_type;
      end if;
    when 'financial.actual_cost_missing' then
      v_category := 'FINANCIAL';
      if p_primary_resource_type <> 'PRODUCTION_JOB' then
        raise exception 'Exception type % requires primary_resource_type PRODUCTION_JOB', p_exception_type;
      end if;
    when 'financial.margin_exception' then
      v_category := 'FINANCIAL';
      if p_primary_resource_type <> 'ORDER' then
        raise exception 'Exception type % requires primary_resource_type ORDER', p_exception_type;
      end if;
    when 'other.operational_abnormality' then
      v_category := 'OTHER';
      if p_primary_resource_type not in ('ORDER', 'PRODUCTION_JOB', 'PRODUCTION_ASSIGNMENT', 'QC_INSPECTION', 'INVOICE', 'SHIPMENT') then
        raise exception 'Unsupported primary_resource_type % for other.operational_abnormality', p_primary_resource_type;
      end if;
      if p_other_category_reason is null or char_length(trim(p_other_category_reason)) < 10 then
        raise exception 'other_category_reason is required for other.operational_abnormality (min 10 characters)';
      end if;
    else
      raise exception 'Unknown exception type: %', p_exception_type;
  end case;

  if p_exception_type <> 'other.operational_abnormality' and p_other_category_reason is not null then
    raise exception 'other_category_reason must be null when exception_type is not other.operational_abnormality';
  end if;

  -- 6. Authoritative Primary Resource Lookup & Organization Isolation (Sections 28, 29, 32)
  case p_primary_resource_type
    when 'ORDER' then
      declare
        v_order app.orders%rowtype;
      begin
        select * into v_order from app.orders where id = p_primary_resource_id;
        if not found or v_order.organization_id <> p_organization_id then
          raise exception 'Primary resource ORDER % not found in organization', p_primary_resource_id;
        end if;
        v_brand_id := v_order.brand_id;
        v_order_id := v_order.id;
        v_source_snapshot := jsonb_build_object(
          'resource_type', 'ORDER',
          'order_number', v_order.order_number,
          'status', v_order.status,
          'grand_total', v_order.grand_total
        );
      end;

    when 'PRODUCTION_JOB' then
      declare
        v_job app.production_jobs%rowtype;
      begin
        select * into v_job from app.production_jobs where id = p_primary_resource_id;
        if not found or v_job.organization_id <> p_organization_id then
          raise exception 'Primary resource PRODUCTION_JOB % not found in organization', p_primary_resource_id;
        end if;
        v_brand_id := v_job.brand_id;
        v_order_id := v_job.order_id;
        v_source_snapshot := jsonb_build_object(
          'resource_type', 'PRODUCTION_JOB',
          'job_number', v_job.job_number,
          'status', v_job.status,
          'target_completion_date', v_job.target_completion_date,
          'estimated_cost', v_job.estimated_cost,
          'committed_cost', v_job.committed_cost,
          'actual_cost', v_job.actual_cost
        );
      end;

    when 'PRODUCTION_ASSIGNMENT' then
      declare
        v_pa app.production_assignments%rowtype;
        v_pj app.production_jobs%rowtype;
      begin
        select * into v_pa from app.production_assignments where id = p_primary_resource_id;
        if not found then
          raise exception 'Primary resource PRODUCTION_ASSIGNMENT % not found', p_primary_resource_id;
        end if;
        select * into v_pj from app.production_jobs where id = v_pa.production_job_id;
        if not found or v_pj.organization_id <> p_organization_id then
          raise exception 'Primary resource PRODUCTION_ASSIGNMENT % does not belong to organization', p_primary_resource_id;
        end if;
        v_brand_id := v_pj.brand_id;
        v_order_id := v_pj.order_id;
        v_source_snapshot := jsonb_build_object(
          'resource_type', 'PRODUCTION_ASSIGNMENT',
          'assignment_id', v_pa.id,
          'status', v_pa.status,
          'vendor_id', v_pa.vendor_id,
          'job_number', v_pj.job_number,
          'assigned_cost', v_pa.assigned_cost,
          'assigned_at', v_pa.assigned_at,
          'accepted_at', v_pa.accepted_at
        );
      end;

    when 'QC_INSPECTION' then
      declare
        v_qc app.qc_inspections%rowtype;
        v_pj app.production_jobs%rowtype;
      begin
        select * into v_qc from app.qc_inspections where id = p_primary_resource_id;
        if not found then
          raise exception 'Primary resource QC_INSPECTION % not found', p_primary_resource_id;
        end if;
        select * into v_pj from app.production_jobs where id = v_qc.production_job_id;
        if not found or v_pj.organization_id <> p_organization_id then
          raise exception 'Primary resource QC_INSPECTION % does not belong to organization', p_primary_resource_id;
        end if;
        v_brand_id := v_pj.brand_id;
        v_order_id := v_pj.order_id;
        v_source_snapshot := jsonb_build_object(
          'resource_type', 'QC_INSPECTION',
          'inspection_number', v_qc.inspection_number,
          'result', v_qc.result,
          'defect_category', v_qc.defect_category,
          'defect_severity', v_qc.defect_severity,
          'inspected_at', v_qc.inspected_at,
          'job_number', v_pj.job_number
        );
      end;

    when 'INVOICE' then
      declare
        v_inv app.invoices%rowtype;
      begin
        select * into v_inv from app.invoices where id = p_primary_resource_id;
        if not found or v_inv.organization_id <> p_organization_id then
          raise exception 'Primary resource INVOICE % not found in organization', p_primary_resource_id;
        end if;
        v_brand_id := v_inv.brand_id;
        v_order_id := v_inv.order_id;
        v_source_snapshot := jsonb_build_object(
          'resource_type', 'INVOICE',
          'invoice_number', v_inv.invoice_number,
          'status', v_inv.status,
          'due_date', v_inv.due_date,
          'amount_total', v_inv.amount_total,
          'balance_due', v_inv.balance_due,
          'order_id', v_inv.order_id
        );
      end;

    when 'SHIPMENT' then
      declare
        v_shp app.shipments%rowtype;
      begin
        select * into v_shp from app.shipments where id = p_primary_resource_id;
        if not found or v_shp.organization_id <> p_organization_id then
          raise exception 'Primary resource SHIPMENT % not found in organization', p_primary_resource_id;
        end if;
        v_brand_id := v_shp.brand_id;
        v_order_id := v_shp.order_id;
        v_source_snapshot := jsonb_build_object(
          'resource_type', 'SHIPMENT',
          'shipment_number', v_shp.shipment_number,
          'status', v_shp.status,
          'courier_name', v_shp.courier_name,
          'tracking_number', v_shp.tracking_number,
          'dispatch_date', v_shp.dispatch_date,
          'delivered_date', v_shp.delivered_date
        );
      end;
  end case;

  -- 7. Validate responsible principal if provided (Sections 18 & 64)
  if p_responsible_user_id is not null then
    v_resp_role := app.operational_exception_actor_role(p_organization_id, p_responsible_user_id);
    if v_resp_role not in ('OWNER', 'ADMIN') then
      raise exception 'Responsible principal must be an active OWNER or ADMIN in the organization';
    end if;
  end if;

  -- 8. Concurrency Protection & Business Deduplication (Sections 35, 36, 39, 47)
  -- Take transaction advisory lock based on business dedup fingerprint
  perform pg_advisory_xact_lock(hashtextextended(
    'oe_dedup:' ||
    p_organization_id::text || ':' ||
    p_exception_type || ':' ||
    p_primary_resource_type || ':' ||
    p_primary_resource_id::text,
    0
  ));

  select * into v_existing
  from app.operational_exceptions
  where organization_id = p_organization_id
    and exception_type = p_exception_type
    and primary_resource_type = p_primary_resource_type
    and primary_resource_id = p_primary_resource_id
    and status in ('OPEN', 'ACKNOWLEDGED')
  for update;

  if found then
    -- Business duplicate suppressed: return existing active exception and record receipt
    v_result_snapshot := jsonb_build_object(
      'exception_id', v_existing.id,
      'status', v_existing.status,
      'severity', v_existing.severity,
      'current_revision', v_existing.current_revision,
      'is_retry', false,
      'is_existing_active_exception', true
    );

    insert into app.operational_exception_audit (
      organization_id, operational_exception_id, actor_id,
      action, from_status, to_status,
      request_id, request_payload, result_snapshot, details
    ) values (
      p_organization_id, v_existing.id, p_actor_id,
      'exception.open_deduplicated', v_existing.status, v_existing.status,
      p_request_id, v_normalized_payload, v_result_snapshot,
      jsonb_build_object('surviving_exception_id', v_existing.id, 'status', v_existing.status)
    );

    return v_result_snapshot;
  end if;

  -- 9. Insert New Operational Exception
  v_opening_evidence := jsonb_build_object(
    'source_snapshot', v_source_snapshot,
    'observation', p_observation,
    'supplementary_evidence', coalesce(p_supplementary_evidence, '{}'::jsonb)
  );

  insert into app.operational_exceptions (
    organization_id, brand_id, order_id,
    exception_category, exception_type, status, severity,
    source_kind, primary_resource_type, primary_resource_id,
    summary, business_impact, root_cause,
    responsible_role_code, responsible_user_id,
    opening_evidence, other_category_reason,
    detected_at, opened_at, current_revision
  ) values (
    p_organization_id, v_brand_id, v_order_id,
    v_category, p_exception_type, 'OPEN', p_severity,
    p_source_kind, p_primary_resource_type, p_primary_resource_id,
    trim(p_summary), trim(p_business_impact), case when p_root_cause is not null then trim(p_root_cause) else null end,
    p_responsible_role_code, p_responsible_user_id,
    v_opening_evidence, case when p_other_category_reason is not null then trim(p_other_category_reason) else null end,
    p_detected_at, now(), 1
  ) returning * into v_new_exception;

  v_result_snapshot := jsonb_build_object(
    'exception_id', v_new_exception.id,
    'status', 'OPEN',
    'severity', v_new_exception.severity,
    'current_revision', 1,
    'is_retry', false,
    'is_existing_active_exception', false
  );

  -- 10. Record Audit Receipt
  insert into app.operational_exception_audit (
    organization_id, operational_exception_id, actor_id,
    action, from_status, to_status,
    request_id, request_payload, result_snapshot, details
  ) values (
    p_organization_id, v_new_exception.id, p_actor_id,
    'exception.opened', null, 'OPEN',
    p_request_id, v_normalized_payload, v_result_snapshot,
    jsonb_build_object(
      'exception_type', p_exception_type,
      'severity', p_severity,
      'source_kind', p_source_kind,
      'responsible_role_code', p_responsible_role_code,
      'responsible_user_id', p_responsible_user_id
    )
  );

  return v_result_snapshot;
end;
$$;

-- ============================================================================
-- 6. Command Function: acknowledge_operational_exception (Sections 60..61)
-- ============================================================================

create or replace function app.acknowledge_operational_exception(
  p_organization_id uuid,
  p_actor_id uuid,
  p_request_id uuid,
  p_exception_id uuid,
  p_expected_revision bigint,
  p_note text default null
) returns jsonb language plpgsql security definer set search_path=app,pg_temp as $$
declare
  v_actor_role text;
  v_prior_audit app.operational_exception_audit%rowtype;
  v_normalized_payload jsonb;
  v_ex app.operational_exceptions%rowtype;
  v_responsible_user_id uuid;
  v_result_snapshot jsonb;
begin
  -- 1. Authorization
  v_actor_role := app.operational_exception_actor_role(p_organization_id, p_actor_id);
  if v_actor_role not in ('OWNER', 'ADMIN') then
    raise exception 'Not authorized to acknowledge operational exceptions';
  end if;

  -- 2. Normalized payload for idempotency
  v_normalized_payload := jsonb_build_object(
    'command', 'acknowledge_operational_exception',
    'exception_id', p_exception_id,
    'expected_revision', p_expected_revision,
    'note', case when p_note is not null then trim(p_note) else null end
  );

  -- Serialize concurrent requests using deterministic request-scoped advisory transaction lock
  perform pg_advisory_xact_lock(hashtextextended(
    'oe_req:' || p_organization_id::text || ':' || p_actor_id::text || ':' || p_request_id::text,
    0
  ));

  select * into v_prior_audit
  from app.operational_exception_audit
  where organization_id = p_organization_id
    and actor_id = p_actor_id
    and request_id = p_request_id;

  if found then
    if v_prior_audit.action = 'exception.acknowledged'
       and v_prior_audit.request_payload = v_normalized_payload then
      return v_prior_audit.result_snapshot || jsonb_build_object('is_retry', true);
    else
      raise exception 'Idempotency conflict: request_id already used with different payload or command';
    end if;
  end if;

  -- 3. Lock exception
  select * into v_ex
  from app.operational_exceptions
  where id = p_exception_id and organization_id = p_organization_id
  for update;

  if not found then
    raise exception 'Operational exception % not found in organization', p_exception_id;
  end if;

  -- 4. Optimistic revision check
  if v_ex.current_revision <> p_expected_revision then
    raise exception 'Stale revision: expected %, got %', p_expected_revision, v_ex.current_revision;
  end if;

  -- 5. Status check
  if v_ex.status <> 'OPEN' then
    raise exception 'Cannot acknowledge exception with status %: only OPEN exceptions can be acknowledged', v_ex.status;
  end if;

  -- 6. Ownership assignment rule (Section 61)
  if v_ex.responsible_user_id is null then
    v_responsible_user_id := p_actor_id;
  elsif v_ex.responsible_user_id <> p_actor_id then
    raise exception 'Cannot acknowledge: exception is already assigned to a different principal';
  else
    v_responsible_user_id := v_ex.responsible_user_id;
  end if;

  -- 7. Update exception
  update app.operational_exceptions
  set status = 'ACKNOWLEDGED',
      acknowledged_at = now(),
      responsible_user_id = v_responsible_user_id,
      current_revision = current_revision + 1,
      updated_at = now()
  where id = v_ex.id
  returning * into v_ex;

  v_result_snapshot := jsonb_build_object(
    'exception_id', v_ex.id,
    'status', 'ACKNOWLEDGED',
    'severity', v_ex.severity,
    'responsible_user_id', v_ex.responsible_user_id,
    'current_revision', v_ex.current_revision,
    'is_retry', false
  );

  -- 8. Audit receipt
  insert into app.operational_exception_audit (
    organization_id, operational_exception_id, actor_id,
    action, from_status, to_status,
    request_id, request_payload, result_snapshot, details
  ) values (
    p_organization_id, v_ex.id, p_actor_id,
    'exception.acknowledged', 'OPEN', 'ACKNOWLEDGED',
    p_request_id, v_normalized_payload, v_result_snapshot,
    jsonb_build_object('note', p_note, 'responsible_user_id', v_responsible_user_id)
  );

  return v_result_snapshot;
end;
$$;

-- ============================================================================
-- 7. Command Function: assign_operational_exception (Section 62)
-- ============================================================================

create or replace function app.assign_operational_exception(
  p_organization_id uuid,
  p_actor_id uuid,
  p_request_id uuid,
  p_exception_id uuid,
  p_expected_revision bigint,
  p_responsible_role_code text,
  p_responsible_user_id uuid,
  p_reason text default null
) returns jsonb language plpgsql security definer set search_path=app,pg_temp as $$
declare
  v_actor_role text;
  v_prior_audit app.operational_exception_audit%rowtype;
  v_normalized_payload jsonb;
  v_ex app.operational_exceptions%rowtype;
  v_target_role text;
  v_result_snapshot jsonb;
begin
  -- 1. Authorization
  v_actor_role := app.operational_exception_actor_role(p_organization_id, p_actor_id);
  if v_actor_role not in ('OWNER', 'ADMIN') then
    raise exception 'Not authorized to assign operational exceptions';
  end if;

  -- 2. Idempotency check
  v_normalized_payload := jsonb_build_object(
    'command', 'assign_operational_exception',
    'exception_id', p_exception_id,
    'expected_revision', p_expected_revision,
    'responsible_role_code', p_responsible_role_code,
    'responsible_user_id', p_responsible_user_id,
    'reason', case when p_reason is not null then trim(p_reason) else null end
  );

  -- Serialize concurrent requests using deterministic request-scoped advisory transaction lock
  perform pg_advisory_xact_lock(hashtextextended(
    'oe_req:' || p_organization_id::text || ':' || p_actor_id::text || ':' || p_request_id::text,
    0
  ));

  select * into v_prior_audit
  from app.operational_exception_audit
  where organization_id = p_organization_id
    and actor_id = p_actor_id
    and request_id = p_request_id;

  if found then
    if v_prior_audit.action = 'exception.assigned'
       and v_prior_audit.request_payload = v_normalized_payload then
      return v_prior_audit.result_snapshot || jsonb_build_object('is_retry', true);
    else
      raise exception 'Idempotency conflict: request_id already used with different payload or command';
    end if;
  end if;

  -- 3. Lock exception
  select * into v_ex
  from app.operational_exceptions
  where id = p_exception_id and organization_id = p_organization_id
  for update;

  if not found then
    raise exception 'Operational exception % not found in organization', p_exception_id;
  end if;

  -- 4. Optimistic revision check
  if v_ex.current_revision <> p_expected_revision then
    raise exception 'Stale revision: expected %, got %', p_expected_revision, v_ex.current_revision;
  end if;

  -- 5. Status check: only OPEN unassigned exceptions can be assigned (Section 62)
  if v_ex.status <> 'OPEN' then
    raise exception 'Cannot assign exception with status %: only OPEN exceptions can be assigned', v_ex.status;
  end if;

  if v_ex.responsible_user_id is not null then
    raise exception 'Exception already has an assigned principal; use reassign instead';
  end if;

  -- 6. Validate target principal
  if p_responsible_role_code not in ('OWNER', 'ADMIN', 'SALES', 'OPERATIONS', 'FINANCE', 'QC') then
    raise exception 'Invalid responsible role code: %', p_responsible_role_code;
  end if;

  v_target_role := app.operational_exception_actor_role(p_organization_id, p_responsible_user_id);
  if v_target_role not in ('OWNER', 'ADMIN') then
    raise exception 'Responsible principal must be an active OWNER or ADMIN in the organization';
  end if;

  -- 7. Update exception (state remains OPEN)
  update app.operational_exceptions
  set responsible_role_code = p_responsible_role_code,
      responsible_user_id = p_responsible_user_id,
      current_revision = current_revision + 1,
      updated_at = now()
  where id = v_ex.id
  returning * into v_ex;

  v_result_snapshot := jsonb_build_object(
    'exception_id', v_ex.id,
    'status', v_ex.status,
    'responsible_role_code', v_ex.responsible_role_code,
    'responsible_user_id', v_ex.responsible_user_id,
    'current_revision', v_ex.current_revision,
    'is_retry', false
  );

  -- 8. Audit receipt
  insert into app.operational_exception_audit (
    organization_id, operational_exception_id, actor_id,
    action, from_status, to_status,
    request_id, request_payload, result_snapshot, details
  ) values (
    p_organization_id, v_ex.id, p_actor_id,
    'exception.assigned', v_ex.status, v_ex.status,
    p_request_id, v_normalized_payload, v_result_snapshot,
    jsonb_build_object(
      'responsible_role_code', p_responsible_role_code,
      'responsible_user_id', p_responsible_user_id,
      'reason', p_reason
    )
  );

  return v_result_snapshot;
end;
$$;

-- ============================================================================
-- 8. Command Function: reassign_operational_exception (Sections 63..64)
-- ============================================================================

create or replace function app.reassign_operational_exception(
  p_organization_id uuid,
  p_actor_id uuid,
  p_request_id uuid,
  p_exception_id uuid,
  p_expected_revision bigint,
  p_new_responsible_role_code text,
  p_new_responsible_user_id uuid,
  p_reason text
) returns jsonb language plpgsql security definer set search_path=app,pg_temp as $$
declare
  v_actor_role text;
  v_prior_audit app.operational_exception_audit%rowtype;
  v_normalized_payload jsonb;
  v_ex app.operational_exceptions%rowtype;
  v_target_role text;
  v_old_role text;
  v_old_user uuid;
  v_result_snapshot jsonb;
begin
  -- 1. Authorization
  v_actor_role := app.operational_exception_actor_role(p_organization_id, p_actor_id);
  if v_actor_role not in ('OWNER', 'ADMIN') then
    raise exception 'Not authorized to reassign operational exceptions';
  end if;

  if p_reason is null or char_length(trim(p_reason)) < 5 then
    raise exception 'Reassignment reason is required (min 5 characters)';
  end if;

  -- 2. Idempotency check
  v_normalized_payload := jsonb_build_object(
    'command', 'reassign_operational_exception',
    'exception_id', p_exception_id,
    'expected_revision', p_expected_revision,
    'new_responsible_role_code', p_new_responsible_role_code,
    'new_responsible_user_id', p_new_responsible_user_id,
    'reason', trim(p_reason)
  );

  -- Serialize concurrent requests using deterministic request-scoped advisory transaction lock
  perform pg_advisory_xact_lock(hashtextextended(
    'oe_req:' || p_organization_id::text || ':' || p_actor_id::text || ':' || p_request_id::text,
    0
  ));

  select * into v_prior_audit
  from app.operational_exception_audit
  where organization_id = p_organization_id
    and actor_id = p_actor_id
    and request_id = p_request_id;

  if found then
    if v_prior_audit.action = 'exception.reassigned'
       and v_prior_audit.request_payload = v_normalized_payload then
      return v_prior_audit.result_snapshot || jsonb_build_object('is_retry', true);
    else
      raise exception 'Idempotency conflict: request_id already used with different payload or command';
    end if;
  end if;

  -- 3. Lock exception
  select * into v_ex
  from app.operational_exceptions
  where id = p_exception_id and organization_id = p_organization_id
  for update;

  if not found then
    raise exception 'Operational exception % not found in organization', p_exception_id;
  end if;

  -- 4. Optimistic revision check
  if v_ex.current_revision <> p_expected_revision then
    raise exception 'Stale revision: expected %, got %', p_expected_revision, v_ex.current_revision;
  end if;

  -- 5. Status check: OPEN or ACKNOWLEDGED
  if v_ex.status not in ('OPEN', 'ACKNOWLEDGED') then
    raise exception 'Cannot reassign exception with status %: only OPEN or ACKNOWLEDGED exceptions can be reassigned', v_ex.status;
  end if;

  -- 6. Validate target principal
  if p_new_responsible_role_code not in ('OWNER', 'ADMIN', 'SALES', 'OPERATIONS', 'FINANCE', 'QC') then
    raise exception 'Invalid responsible role code: %', p_new_responsible_role_code;
  end if;

  v_target_role := app.operational_exception_actor_role(p_organization_id, p_new_responsible_user_id);
  if v_target_role not in ('OWNER', 'ADMIN') then
    raise exception 'Responsible principal must be an active OWNER or ADMIN in the organization';
  end if;

  v_old_role := v_ex.responsible_role_code;
  v_old_user := v_ex.responsible_user_id;

  -- 7. Update exception (status preserved)
  update app.operational_exceptions
  set responsible_role_code = p_new_responsible_role_code,
      responsible_user_id = p_new_responsible_user_id,
      current_revision = current_revision + 1,
      updated_at = now()
  where id = v_ex.id
  returning * into v_ex;

  v_result_snapshot := jsonb_build_object(
    'exception_id', v_ex.id,
    'status', v_ex.status,
    'responsible_role_code', v_ex.responsible_role_code,
    'responsible_user_id', v_ex.responsible_user_id,
    'current_revision', v_ex.current_revision,
    'is_retry', false
  );

  -- 8. Audit receipt
  insert into app.operational_exception_audit (
    organization_id, operational_exception_id, actor_id,
    action, from_status, to_status,
    request_id, request_payload, result_snapshot, details
  ) values (
    p_organization_id, v_ex.id, p_actor_id,
    'exception.reassigned', v_ex.status, v_ex.status,
    p_request_id, v_normalized_payload, v_result_snapshot,
    jsonb_build_object(
      'previous_role', v_old_role,
      'previous_user', v_old_user,
      'new_role', p_new_responsible_role_code,
      'new_user', p_new_responsible_user_id,
      'reason', trim(p_reason)
    )
  );

  return v_result_snapshot;
end;
$$;

-- ============================================================================
-- 9. Command Function: change_operational_exception_severity (Section 65)
-- ============================================================================

create or replace function app.change_operational_exception_severity(
  p_organization_id uuid,
  p_actor_id uuid,
  p_request_id uuid,
  p_exception_id uuid,
  p_expected_revision bigint,
  p_new_severity text,
  p_reason text
) returns jsonb language plpgsql security definer set search_path=app,pg_temp as $$
declare
  v_actor_role text;
  v_prior_audit app.operational_exception_audit%rowtype;
  v_normalized_payload jsonb;
  v_ex app.operational_exceptions%rowtype;
  v_old_severity text;
  v_result_snapshot jsonb;
begin
  -- 1. Authorization
  v_actor_role := app.operational_exception_actor_role(p_organization_id, p_actor_id);
  if v_actor_role not in ('OWNER', 'ADMIN') then
    raise exception 'Not authorized to change operational exception severity';
  end if;

  if p_new_severity not in ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL') then
    raise exception 'Invalid severity: %', p_new_severity;
  end if;

  if p_reason is null or char_length(trim(p_reason)) < 5 then
    raise exception 'Severity change reason is required (min 5 characters)';
  end if;

  -- 2. Idempotency check
  v_normalized_payload := jsonb_build_object(
    'command', 'change_operational_exception_severity',
    'exception_id', p_exception_id,
    'expected_revision', p_expected_revision,
    'new_severity', p_new_severity,
    'reason', trim(p_reason)
  );

  -- Serialize concurrent requests using deterministic request-scoped advisory transaction lock
  perform pg_advisory_xact_lock(hashtextextended(
    'oe_req:' || p_organization_id::text || ':' || p_actor_id::text || ':' || p_request_id::text,
    0
  ));

  select * into v_prior_audit
  from app.operational_exception_audit
  where organization_id = p_organization_id
    and actor_id = p_actor_id
    and request_id = p_request_id;

  if found then
    if v_prior_audit.action = 'exception.severity_changed'
       and v_prior_audit.request_payload = v_normalized_payload then
      return v_prior_audit.result_snapshot || jsonb_build_object('is_retry', true);
    else
      raise exception 'Idempotency conflict: request_id already used with different payload or command';
    end if;
  end if;

  -- 3. Lock exception
  select * into v_ex
  from app.operational_exceptions
  where id = p_exception_id and organization_id = p_organization_id
  for update;

  if not found then
    raise exception 'Operational exception % not found in organization', p_exception_id;
  end if;

  -- 4. Optimistic revision check
  if v_ex.current_revision <> p_expected_revision then
    raise exception 'Stale revision: expected %, got %', p_expected_revision, v_ex.current_revision;
  end if;

  -- 5. Status check: OPEN or ACKNOWLEDGED
  if v_ex.status not in ('OPEN', 'ACKNOWLEDGED') then
    raise exception 'Cannot change severity of exception with status %: only OPEN or ACKNOWLEDGED exceptions can be modified', v_ex.status;
  end if;

  -- 6. Severity no-op check
  if v_ex.severity = p_new_severity then
    raise exception 'New severity must be different from current severity';
  end if;

  v_old_severity := v_ex.severity;

  -- 7. Update exception
  update app.operational_exceptions
  set severity = p_new_severity,
      current_revision = current_revision + 1,
      updated_at = now()
  where id = v_ex.id
  returning * into v_ex;

  v_result_snapshot := jsonb_build_object(
    'exception_id', v_ex.id,
    'status', v_ex.status,
    'severity', v_ex.severity,
    'current_revision', v_ex.current_revision,
    'is_retry', false
  );

  -- 8. Audit receipt
  insert into app.operational_exception_audit (
    organization_id, operational_exception_id, actor_id,
    action, from_status, to_status,
    request_id, request_payload, result_snapshot, details
  ) values (
    p_organization_id, v_ex.id, p_actor_id,
    'exception.severity_changed', v_ex.status, v_ex.status,
    p_request_id, v_normalized_payload, v_result_snapshot,
    jsonb_build_object(
      'previous_severity', v_old_severity,
      'new_severity', p_new_severity,
      'reason', trim(p_reason)
    )
  );

  return v_result_snapshot;
end;
$$;

-- ============================================================================
-- 10. Command Function: resolve_operational_exception (Sections 55, 66..68)
-- ============================================================================

create or replace function app.resolve_operational_exception(
  p_organization_id uuid,
  p_actor_id uuid,
  p_request_id uuid,
  p_exception_id uuid,
  p_expected_revision bigint,
  p_resolution_type text,
  p_resolution_summary text,
  p_closure_evidence jsonb default '{}'::jsonb,
  p_superseded_by_exception_id uuid default null
) returns jsonb language plpgsql security definer set search_path=app,pg_temp as $$
declare
  v_actor_role text;
  v_prior_audit app.operational_exception_audit%rowtype;
  v_normalized_payload jsonb;
  v_ex app.operational_exceptions%rowtype;
  v_target_ex app.operational_exceptions%rowtype;
  v_old_status text;
  v_result_snapshot jsonb;
begin
  -- 1. Authorization
  v_actor_role := app.operational_exception_actor_role(p_organization_id, p_actor_id);
  if v_actor_role not in ('OWNER', 'ADMIN') then
    raise exception 'Not authorized to resolve operational exceptions';
  end if;

  -- 2. Validate resolution inputs
  if p_resolution_type not in ('REMEDIATED', 'WORKAROUND', 'SOURCE_CORRECTED', 'ACCEPTED_RISK', 'SUPERSEDED') then
    raise exception 'Invalid resolution type: %', p_resolution_type;
  end if;

  -- ACCEPTED_RISK Guard (Section 55): OWNER authority strictly required
  if p_resolution_type = 'ACCEPTED_RISK' and v_actor_role <> 'OWNER' then
    raise exception 'Accepted risk resolution requires OWNER authority';
  end if;

  if p_resolution_summary is null or char_length(trim(p_resolution_summary)) < 5 then
    raise exception 'Resolution summary is required (min 5 characters)';
  end if;

  -- 3. Idempotency check
  v_normalized_payload := jsonb_build_object(
    'command', 'resolve_operational_exception',
    'exception_id', p_exception_id,
    'expected_revision', p_expected_revision,
    'resolution_type', p_resolution_type,
    'resolution_summary', trim(p_resolution_summary),
    'closure_evidence', coalesce(p_closure_evidence, '{}'::jsonb),
    'superseded_by_exception_id', p_superseded_by_exception_id
  );

  -- Serialize concurrent requests using deterministic request-scoped advisory transaction lock
  perform pg_advisory_xact_lock(hashtextextended(
    'oe_req:' || p_organization_id::text || ':' || p_actor_id::text || ':' || p_request_id::text,
    0
  ));

  select * into v_prior_audit
  from app.operational_exception_audit
  where organization_id = p_organization_id
    and actor_id = p_actor_id
    and request_id = p_request_id;

  if found then
    if v_prior_audit.action = 'exception.resolved'
       and v_prior_audit.request_payload = v_normalized_payload then
      return v_prior_audit.result_snapshot || jsonb_build_object('is_retry', true);
    else
      raise exception 'Idempotency conflict: request_id already used with different payload or command';
    end if;
  end if;

  -- 4. Lock exception
  select * into v_ex
  from app.operational_exceptions
  where id = p_exception_id and organization_id = p_organization_id
  for update;

  if not found then
    raise exception 'Operational exception % not found in organization', p_exception_id;
  end if;

  -- 5. Optimistic revision check
  if v_ex.current_revision <> p_expected_revision then
    raise exception 'Stale revision: expected %, got %', p_expected_revision, v_ex.current_revision;
  end if;

  -- 6. Status check: OPEN or ACKNOWLEDGED
  if v_ex.status not in ('OPEN', 'ACKNOWLEDGED') then
    raise exception 'Cannot resolve exception with status %: only OPEN or ACKNOWLEDGED exceptions can be resolved', v_ex.status;
  end if;

  -- 7. Validate SUPERSEDED target (Section 68)
  if p_resolution_type = 'SUPERSEDED' then
    if p_superseded_by_exception_id is null then
      raise exception 'superseded_by_exception_id is required when resolution_type is SUPERSEDED';
    end if;
    if p_superseded_by_exception_id = v_ex.id then
      raise exception 'Exception cannot supersede itself';
    end if;

    select * into v_target_ex
    from app.operational_exceptions
    where id = p_superseded_by_exception_id and organization_id = p_organization_id;

    if not found then
      raise exception 'Superseding exception % not found in organization', p_superseded_by_exception_id;
    end if;
    if v_target_ex.status not in ('OPEN', 'ACKNOWLEDGED') then
      raise exception 'Superseding exception % must be in active status (OPEN or ACKNOWLEDGED)', p_superseded_by_exception_id;
    end if;
  else
    if p_superseded_by_exception_id is not null then
      raise exception 'superseded_by_exception_id must be null when resolution_type is not SUPERSEDED';
    end if;
  end if;

  v_old_status := v_ex.status;

  -- 8. Update exception to RESOLVED
  update app.operational_exceptions
  set status = 'RESOLVED',
      resolution_type = p_resolution_type,
      resolution_summary = trim(p_resolution_summary),
      closure_evidence = coalesce(p_closure_evidence, '{}'::jsonb),
      superseded_by_exception_id = p_superseded_by_exception_id,
      closed_at = now(),
      current_revision = current_revision + 1,
      updated_at = now()
  where id = v_ex.id
  returning * into v_ex;

  v_result_snapshot := jsonb_build_object(
    'exception_id', v_ex.id,
    'status', 'RESOLVED',
    'resolution_type', v_ex.resolution_type,
    'current_revision', v_ex.current_revision,
    'is_retry', false
  );

  -- 9. Audit receipt
  insert into app.operational_exception_audit (
    organization_id, operational_exception_id, actor_id,
    action, from_status, to_status,
    request_id, request_payload, result_snapshot, details
  ) values (
    p_organization_id, v_ex.id, p_actor_id,
    'exception.resolved', v_old_status, 'RESOLVED',
    p_request_id, v_normalized_payload, v_result_snapshot,
    jsonb_build_object(
      'resolution_type', p_resolution_type,
      'resolution_summary', trim(p_resolution_summary),
      'closure_evidence', coalesce(p_closure_evidence, '{}'::jsonb),
      'superseded_by_exception_id', p_superseded_by_exception_id
    )
  );

  return v_result_snapshot;
end;
$$;

-- ============================================================================
-- 11. Command Function: dismiss_operational_exception (Sections 69..70)
-- ============================================================================

create or replace function app.dismiss_operational_exception(
  p_organization_id uuid,
  p_actor_id uuid,
  p_request_id uuid,
  p_exception_id uuid,
  p_expected_revision bigint,
  p_dismissal_reason text,
  p_reason_summary text,
  p_closure_evidence jsonb default '{}'::jsonb,
  p_duplicate_of_exception_id uuid default null
) returns jsonb language plpgsql security definer set search_path=app,pg_temp as $$
declare
  v_actor_role text;
  v_prior_audit app.operational_exception_audit%rowtype;
  v_normalized_payload jsonb;
  v_ex app.operational_exceptions%rowtype;
  v_target_ex app.operational_exceptions%rowtype;
  v_old_status text;
  v_merged_closure_evidence jsonb;
  v_result_snapshot jsonb;
begin
  -- 1. Authorization
  v_actor_role := app.operational_exception_actor_role(p_organization_id, p_actor_id);
  if v_actor_role not in ('OWNER', 'ADMIN') then
    raise exception 'Not authorized to dismiss operational exceptions';
  end if;

  if p_dismissal_reason not in ('FALSE_POSITIVE', 'DUPLICATE', 'NOT_APPLICABLE', 'OPENED_IN_ERROR') then
    raise exception 'Invalid dismissal reason: %', p_dismissal_reason;
  end if;

  if p_reason_summary is null or char_length(trim(p_reason_summary)) < 5 then
    raise exception 'Dismissal reason summary is required (min 5 characters)';
  end if;

  -- 2. Idempotency check
  v_normalized_payload := jsonb_build_object(
    'command', 'dismiss_operational_exception',
    'exception_id', p_exception_id,
    'expected_revision', p_expected_revision,
    'dismissal_reason', p_dismissal_reason,
    'reason_summary', trim(p_reason_summary),
    'closure_evidence', coalesce(p_closure_evidence, '{}'::jsonb),
    'duplicate_of_exception_id', p_duplicate_of_exception_id
  );

  -- Serialize concurrent requests using deterministic request-scoped advisory transaction lock
  perform pg_advisory_xact_lock(hashtextextended(
    'oe_req:' || p_organization_id::text || ':' || p_actor_id::text || ':' || p_request_id::text,
    0
  ));

  select * into v_prior_audit
  from app.operational_exception_audit
  where organization_id = p_organization_id
    and actor_id = p_actor_id
    and request_id = p_request_id;

  if found then
    if v_prior_audit.action = 'exception.dismissed'
       and v_prior_audit.request_payload = v_normalized_payload then
      return v_prior_audit.result_snapshot || jsonb_build_object('is_retry', true);
    else
      raise exception 'Idempotency conflict: request_id already used with different payload or command';
    end if;
  end if;

  -- 3. Lock exception
  select * into v_ex
  from app.operational_exceptions
  where id = p_exception_id and organization_id = p_organization_id
  for update;

  if not found then
    raise exception 'Operational exception % not found in organization', p_exception_id;
  end if;

  -- 4. Optimistic revision check
  if v_ex.current_revision <> p_expected_revision then
    raise exception 'Stale revision: expected %, got %', p_expected_revision, v_ex.current_revision;
  end if;

  -- 5. Status check: OPEN or ACKNOWLEDGED
  if v_ex.status not in ('OPEN', 'ACKNOWLEDGED') then
    raise exception 'Cannot dismiss exception with status %: only OPEN or ACKNOWLEDGED exceptions can be dismissed', v_ex.status;
  end if;

  -- 6. Validate DUPLICATE target (Section 70)
  if p_dismissal_reason = 'DUPLICATE' then
    if p_duplicate_of_exception_id is null then
      raise exception 'duplicate_of_exception_id is required when dismissal_reason is DUPLICATE';
    end if;
    if p_duplicate_of_exception_id = v_ex.id then
      raise exception 'Exception cannot be duplicate of itself';
    end if;

    select * into v_target_ex
    from app.operational_exceptions
    where id = p_duplicate_of_exception_id and organization_id = p_organization_id;

    if not found then
      raise exception 'Duplicate target exception % not found in organization', p_duplicate_of_exception_id;
    end if;
  else
    if p_duplicate_of_exception_id is not null then
      raise exception 'duplicate_of_exception_id must be null when dismissal_reason is not DUPLICATE';
    end if;
  end if;

  v_old_status := v_ex.status;
  v_merged_closure_evidence := coalesce(p_closure_evidence, '{}'::jsonb) || jsonb_build_object('reason_summary', trim(p_reason_summary));

  -- 7. Update exception to DISMISSED
  update app.operational_exceptions
  set status = 'DISMISSED',
      dismissal_reason = p_dismissal_reason,
      resolution_summary = null,
      resolution_type = null,
      closure_evidence = v_merged_closure_evidence,
      duplicate_of_exception_id = p_duplicate_of_exception_id,
      closed_at = now(),
      current_revision = current_revision + 1,
      updated_at = now()
  where id = v_ex.id
  returning * into v_ex;

  v_result_snapshot := jsonb_build_object(
    'exception_id', v_ex.id,
    'status', 'DISMISSED',
    'dismissal_reason', v_ex.dismissal_reason,
    'current_revision', v_ex.current_revision,
    'is_retry', false
  );

  -- 8. Audit receipt
  insert into app.operational_exception_audit (
    organization_id, operational_exception_id, actor_id,
    action, from_status, to_status,
    request_id, request_payload, result_snapshot, details
  ) values (
    p_organization_id, v_ex.id, p_actor_id,
    'exception.dismissed', v_old_status, 'DISMISSED',
    p_request_id, v_normalized_payload, v_result_snapshot,
    jsonb_build_object(
      'dismissal_reason', p_dismissal_reason,
      'reason_summary', trim(p_reason_summary),
      'closure_evidence', v_merged_closure_evidence,
      'duplicate_of_exception_id', p_duplicate_of_exception_id
    )
  );

  return v_result_snapshot;
end;
$$;

-- ============================================================================
-- 12. Command Function: reopen_operational_exception (Sections 71..74)
-- ============================================================================

create or replace function app.reopen_operational_exception(
  p_organization_id uuid,
  p_actor_id uuid,
  p_request_id uuid,
  p_exception_id uuid,
  p_expected_revision bigint,
  p_reason text,
  p_supporting_evidence jsonb default '{}'::jsonb
) returns jsonb language plpgsql security definer set search_path=app,pg_temp as $$
declare
  v_actor_role text;
  v_prior_audit app.operational_exception_audit%rowtype;
  v_normalized_payload jsonb;
  v_ex app.operational_exceptions%rowtype;
  v_old_status text;
  v_old_resolution_type text;
  v_old_dismissal_reason text;
  v_old_resolution_summary text;
  v_result_snapshot jsonb;
begin
  -- 1. Authorization
  v_actor_role := app.operational_exception_actor_role(p_organization_id, p_actor_id);
  if v_actor_role not in ('OWNER', 'ADMIN') then
    raise exception 'Not authorized to reopen operational exceptions';
  end if;

  if p_reason is null or char_length(trim(p_reason)) < 5 then
    raise exception 'Reopen reason is required (min 5 characters)';
  end if;

  -- 2. Idempotency check
  v_normalized_payload := jsonb_build_object(
    'command', 'reopen_operational_exception',
    'exception_id', p_exception_id,
    'expected_revision', p_expected_revision,
    'reason', trim(p_reason),
    'supporting_evidence', coalesce(p_supporting_evidence, '{}'::jsonb)
  );

  -- Serialize concurrent requests using deterministic request-scoped advisory transaction lock
  perform pg_advisory_xact_lock(hashtextextended(
    'oe_req:' || p_organization_id::text || ':' || p_actor_id::text || ':' || p_request_id::text,
    0
  ));

  select * into v_prior_audit
  from app.operational_exception_audit
  where organization_id = p_organization_id
    and actor_id = p_actor_id
    and request_id = p_request_id;

  if found then
    if v_prior_audit.action = 'exception.reopened'
       and v_prior_audit.request_payload = v_normalized_payload then
      return v_prior_audit.result_snapshot || jsonb_build_object('is_retry', true);
    else
      raise exception 'Idempotency conflict: request_id already used with different payload or command';
    end if;
  end if;

  -- 3. Lock exception
  select * into v_ex
  from app.operational_exceptions
  where id = p_exception_id and organization_id = p_organization_id
  for update;

  if not found then
    raise exception 'Operational exception % not found in organization', p_exception_id;
  end if;

  -- 4. Optimistic revision check
  if v_ex.current_revision <> p_expected_revision then
    raise exception 'Stale revision: expected %, got %', p_expected_revision, v_ex.current_revision;
  end if;

  -- 5. Status check: only RESOLVED or DISMISSED exceptions can be reopened
  if v_ex.status not in ('RESOLVED', 'DISMISSED') then
    raise exception 'Cannot reopen exception with status %: only RESOLVED or DISMISSED exceptions can be reopened', v_ex.status;
  end if;

  -- 6. Reopen Dedup Guard (Section 74): Verify no other active exception owns the same fingerprint
  if exists (
    select 1 from app.operational_exceptions
    where organization_id = v_ex.organization_id
      and exception_type = v_ex.exception_type
      and primary_resource_type = v_ex.primary_resource_type
      and primary_resource_id = v_ex.primary_resource_id
      and status in ('OPEN', 'ACKNOWLEDGED')
      and id <> v_ex.id
  ) then
    raise exception 'Cannot reopen: another active operational exception already exists for this resource and abnormality';
  end if;

  v_old_status := v_ex.status;
  v_old_resolution_type := v_ex.resolution_type;
  v_old_dismissal_reason := v_ex.dismissal_reason;
  v_old_resolution_summary := v_ex.resolution_summary;

  -- 7. Reset closure projection and return to OPEN (Sections 72 & 73)
  -- Responsible principal and logical role are retained
  update app.operational_exceptions
  set status = 'OPEN',
      resolution_type = null,
      resolution_summary = null,
      closure_evidence = null,
      dismissal_reason = null,
      duplicate_of_exception_id = null,
      superseded_by_exception_id = null,
      closed_at = null,
      acknowledged_at = null,
      current_revision = current_revision + 1,
      updated_at = now()
  where id = v_ex.id
  returning * into v_ex;

  v_result_snapshot := jsonb_build_object(
    'exception_id', v_ex.id,
    'status', 'OPEN',
    'severity', v_ex.severity,
    'current_revision', v_ex.current_revision,
    'is_retry', false
  );

  -- 8. Audit receipt preserves historical closure fact
  insert into app.operational_exception_audit (
    organization_id, operational_exception_id, actor_id,
    action, from_status, to_status,
    request_id, request_payload, result_snapshot, details
  ) values (
    p_organization_id, v_ex.id, p_actor_id,
    'exception.reopened', v_old_status, 'OPEN',
    p_request_id, v_normalized_payload, v_result_snapshot,
    jsonb_build_object(
      'prior_status', v_old_status,
      'prior_resolution_type', v_old_resolution_type,
      'prior_dismissal_reason', v_old_dismissal_reason,
      'prior_resolution_summary', v_old_resolution_summary,
      'reason', trim(p_reason),
      'supporting_evidence', coalesce(p_supporting_evidence, '{}'::jsonb)
    )
  );

  return v_result_snapshot;
end;
$$;

-- ============================================================================
-- 13. Revoke / Grant on Stored Procedures
-- ============================================================================

revoke all on function app.operational_exception_actor_role(uuid, uuid) from public, anon, authenticated;
grant execute on function app.operational_exception_actor_role(uuid, uuid) to service_role;

revoke all on function app.open_operational_exception from public, anon, authenticated;
grant execute on function app.open_operational_exception to service_role;

revoke all on function app.acknowledge_operational_exception from public, anon, authenticated;
grant execute on function app.acknowledge_operational_exception to service_role;

revoke all on function app.assign_operational_exception from public, anon, authenticated;
grant execute on function app.assign_operational_exception to service_role;

revoke all on function app.reassign_operational_exception from public, anon, authenticated;
grant execute on function app.reassign_operational_exception to service_role;

revoke all on function app.change_operational_exception_severity from public, anon, authenticated;
grant execute on function app.change_operational_exception_severity to service_role;

revoke all on function app.resolve_operational_exception from public, anon, authenticated;
grant execute on function app.resolve_operational_exception to service_role;

revoke all on function app.dismiss_operational_exception from public, anon, authenticated;
grant execute on function app.dismiss_operational_exception to service_role;

revoke all on function app.reopen_operational_exception from public, anon, authenticated;
grant execute on function app.reopen_operational_exception to service_role;

commit;
