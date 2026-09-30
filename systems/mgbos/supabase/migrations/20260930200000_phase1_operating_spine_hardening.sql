-- Migration: 20260930200000_phase1_operating_spine_hardening.sql
-- Description: Phase 1 Operating Spine Hardening (F1 Authorization Fail-Closed, F2 Shipment Duplicate Item Ceiling, F3 QC Evidence Required, F5 Normalized Lock Hierarchy, F6 Reassignment Idempotency)
-- Context: PR #15 Recovery / Operating Spine Audit Corrections

-- ============================================================================
-- 1. Schema Enhancements: Production Assignments Request Idempotency (F6)
-- ============================================================================

alter table app.production_assignments
  add column if not exists request_id uuid,
  add column if not exists request_payload jsonb;

create index if not exists idx_production_assignments_request
  on app.production_assignments(production_job_id, request_id)
  where request_id is not null;

-- ============================================================================
-- 2. Hardened Actor Role Helpers (F1 - Fail-Closed Semantics)
-- ============================================================================

-- Order Actor Role
create or replace function app.order_actor_role(
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

-- Shipment Actor Role
create or replace function app.shipment_actor_role(
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
-- 3. Stored Procedure: transition_order_status (F1 Hardened)
-- ============================================================================

create or replace function app.transition_order_status(
  p_organization_id uuid,
  p_actor_id uuid,
  p_order_id uuid,
  p_target_status text,
  p_reason text default null
) returns jsonb language plpgsql security definer set search_path=app,pg_temp as $$
declare
  v_role text;
  v_order app.orders%rowtype;
  v_target_clean text;
  v_open_jobs integer;
  v_open_shipments integer;
  v_unpaid_invoices integer;
begin
  -- 1. Actor authorization & active organization isolation (AC-05, AC-06, F1 fail-closed)
  v_role := app.order_actor_role(p_organization_id, p_actor_id);
  if v_role is null or v_role not in ('OWNER', 'ADMIN') then
    raise exception 'Unauthorized to update order status';
  end if;

  v_target_clean := upper(trim(coalesce(p_target_status, '')));
  if v_target_clean not in ('DRAFT', 'CONFIRMED', 'ACTIVE', 'ON_HOLD', 'COMPLETED', 'CANCELLED') then
    raise exception 'Invalid target order status: %', p_target_status;
  end if;

  if p_reason is not null and length(p_reason) > 1000 then
    raise exception 'Transition reason exceeds maximum 1000 characters';
  end if;

  -- 2. Lock order row for update within tenant boundary
  select * into v_order
  from app.orders
  where id = p_order_id and organization_id = p_organization_id
  for update;

  if not found then
    raise exception 'Order not found in this organization';
  end if;

  -- Idempotency check: if already in target status, return cleanly
  if v_order.status = v_target_clean then
    return jsonb_build_object(
      'order_id', v_order.id,
      'order_number', v_order.order_number,
      'old_status', v_order.status,
      'new_status', v_order.status,
      'already_in_status', true
    );
  end if;

  -- 3. Business State Machine Transition Guard (AC-01..AC-04)
  if v_order.status = 'DRAFT' and v_target_clean not in ('CONFIRMED', 'CANCELLED') then
    raise exception 'Illegal transition from DRAFT to %: orders can only be confirmed or cancelled from draft', v_target_clean;
  elsif v_order.status = 'CONFIRMED' and v_target_clean not in ('ACTIVE', 'ON_HOLD', 'CANCELLED') then
    raise exception 'Illegal transition from CONFIRMED to %: confirmed orders can advance to ACTIVE, ON_HOLD, or CANCELLED', v_target_clean;
  elsif v_order.status = 'ACTIVE' and v_target_clean not in ('ON_HOLD', 'COMPLETED', 'CANCELLED') then
    raise exception 'Illegal transition from ACTIVE to %: active orders can advance to ON_HOLD, COMPLETED, or CANCELLED', v_target_clean;
  elsif v_order.status = 'ON_HOLD' and v_target_clean not in ('ACTIVE', 'CANCELLED') then
    raise exception 'Illegal transition from ON_HOLD to %: on-hold orders can only resume to ACTIVE or be CANCELLED', v_target_clean;
  elsif v_order.status = 'COMPLETED' then
    raise exception 'Terminal state violation: completed orders cannot change status';
  elsif v_order.status = 'CANCELLED' then
    raise exception 'Terminal state violation: cancelled orders cannot change status';
  end if;

  -- 4. Precondition check for COMPLETED status (AC-03)
  if v_target_clean = 'COMPLETED' then
    -- Check for open (non-terminal) production jobs
    select count(*) into v_open_jobs
    from app.production_jobs
    where order_id = v_order.id
      and status not in ('COMPLETED', 'CANCELLED');

    if v_open_jobs > 0 then
      raise exception 'Cannot complete order: % production jobs are still in progress', v_open_jobs;
    end if;

    -- Check for open (non-terminal) shipments
    select count(*) into v_open_shipments
    from app.shipments
    where order_id = v_order.id
      and status not in ('DELIVERED', 'CANCELLED', 'RETURNED');

    if v_open_shipments > 0 then
      raise exception 'Cannot complete order: % shipments are not yet delivered or completed', v_open_shipments;
    end if;

    -- Check for unpaid invoices
    select count(*) into v_unpaid_invoices
    from app.invoices
    where order_id = v_order.id
      and status not in ('PAID', 'CANCELLED', 'VOID');

    if v_unpaid_invoices > 0 then
      raise exception 'Cannot complete order: % invoices have outstanding balance due', v_unpaid_invoices;
    end if;
  end if;

  -- 5. Cancellation guards (AC-04)
  if v_target_clean = 'CANCELLED' then
    if exists (
      select 1 from app.production_jobs
      where order_id = v_order.id and status in ('IN_PRODUCTION', 'AWAITING_QC', 'READY_FOR_HANDOFF', 'COMPLETED')
    ) then
      raise exception 'Cannot cancel order: work is already in production or completed';
    end if;

    if exists (
      select 1 from app.shipments
      where order_id = v_order.id and status in ('DISPATCHED', 'DELIVERED')
    ) then
      raise exception 'Cannot cancel order: items have already been dispatched or delivered';
    end if;

    -- Cancel all draft/ready/assigned production jobs
    update app.production_jobs
    set status = 'CANCELLED', updated_at = now()
    where order_id = v_order.id and status in ('DRAFT', 'PLANNED', 'READY', 'ASSIGNED', 'ACCEPTED');

    -- Cancel pending delivery orders
    update app.shipments
    set status = 'CANCELLED', updated_at = now()
    where order_id = v_order.id and status in ('DRAFT', 'READY_TO_DISPATCH');
  end if;

  -- 6. Apply state transition
  update app.orders
  set status = v_target_clean,
      confirmed_at = case when v_target_clean = 'CONFIRMED' and confirmed_at is null then now() else confirmed_at end,
      updated_at = now()
  where id = v_order.id;

  -- 7. Record immutable audit log
  insert into app.order_audit (
    organization_id,
    order_id,
    actor_id,
    action,
    details
  ) values (
    p_organization_id,
    v_order.id,
    p_actor_id,
    'order.status_transitioned',
    jsonb_build_object(
      'order_number', v_order.order_number,
      'actor_role', v_role,
      'previous_status', v_order.status,
      'new_status', v_target_clean,
      'reason', p_reason
    )
  );

  return jsonb_build_object(
    'order_id', v_order.id,
    'order_number', v_order.order_number,
    'old_status', v_order.status,
    'new_status', v_target_clean,
    'already_in_status', false
  );
end;
$$;

-- ============================================================================
-- 4. Stored Procedure: transition_production_job_status (F3 QC Evidence & F5 Lock Order)
-- ============================================================================

create or replace function app.transition_production_job_status(
  p_organization_id uuid,
  p_actor_id uuid,
  p_job_id uuid,
  p_to_status text,
  p_reason text default null
) returns text language plpgsql security definer set search_path=app,pg_temp as $$
declare
  role_code text;
  job app.production_jobs%rowtype;
  to_clean text;
  allowed boolean := false;
  v_assign app.production_assignments%rowtype;
  v_latest_qc_result text;
begin
  -- 1. Authorization check (F1 fail-closed)
  role_code := app.production_actor_role(p_organization_id, p_actor_id);
  if role_code is null or role_code not in ('OWNER','ADMIN','OPERATIONS','QC') then
    raise exception 'Not authorized to update production job status';
  end if;

  to_clean := upper(trim(coalesce(p_to_status, '')));

  -- 2. Lock parent job for update first (F5 Lock Hierarchy)
  select * into job from app.production_jobs
  where id = p_job_id and organization_id = p_organization_id
  for update;

  if not found then
    raise exception 'Production job not found';
  end if;

  -- Allowed status transitions
  if job.status = to_clean then
    return job.status;
  end if;

  -- QC role can only advance jobs from AWAITING_QC to READY_FOR_HANDOFF, REWORK, or ON_HOLD
  if role_code = 'QC' and not (job.status = 'AWAITING_QC' and to_clean in ('READY_FOR_HANDOFF','REWORK','ON_HOLD')) then
    raise exception 'QC role may only transition jobs from AWAITING_QC to READY_FOR_HANDOFF, REWORK, or ON_HOLD';
  end if;

  case job.status
    when 'DRAFT' then
      if to_clean in ('PLANNED','READY','CANCELLED') then allowed := true; end if;
    when 'PLANNED' then
      if to_clean in ('READY','CANCELLED') then allowed := true; end if;
    when 'READY' then
      if to_clean in ('ASSIGNED','PLANNED','CANCELLED') then allowed := true; end if;
    when 'ASSIGNED' then
      if to_clean in ('ACCEPTED','READY','CANCELLED') then allowed := true; end if;
    when 'ACCEPTED' then
      if to_clean in ('IN_PRODUCTION','ON_HOLD','CANCELLED') then allowed := true; end if;
    when 'IN_PRODUCTION' then
      if to_clean in ('AWAITING_QC','ON_HOLD','CANCELLED') then allowed := true; end if;
    when 'AWAITING_QC' then
      if to_clean in ('READY_FOR_HANDOFF','REWORK','ON_HOLD','CANCELLED') then allowed := true; end if;
    when 'REWORK' then
      if to_clean in ('IN_PRODUCTION','AWAITING_QC','ON_HOLD','CANCELLED') then allowed := true; end if;
    when 'READY_FOR_HANDOFF' then
      if to_clean in ('COMPLETED','ON_HOLD','CANCELLED') then allowed := true; end if;
    when 'ON_HOLD' then
      if to_clean in ('ACCEPTED','IN_PRODUCTION','AWAITING_QC','READY_FOR_HANDOFF','CANCELLED') then allowed := true; end if;
    when 'COMPLETED' then
      allowed := false;
    when 'CANCELLED' then
      allowed := false;
    else
      allowed := false;
  end case;

  if not allowed then
    raise exception 'Invalid production job transition from % to %', job.status, to_clean;
  end if;

  -- F3 Guard: READY_FOR_HANDOFF requires authoritative QC PASS evidence
  if to_clean = 'READY_FOR_HANDOFF' then
    select result into v_latest_qc_result
    from app.qc_inspections
    where production_job_id = job.id
    order by inspected_at desc, created_at desc, inspection_number desc, id desc
    limit 1;

    if v_latest_qc_result is null or v_latest_qc_result <> 'PASS' then
      raise exception 'Cannot transition job to READY_FOR_HANDOFF without authoritative QC PASS inspection (latest QC: %)',
        coalesce(v_latest_qc_result, 'NONE');
    end if;
  end if;

  -- 3. Lock and update linked assignment second (F5 Lock Hierarchy)
  if to_clean = 'CANCELLED' then
    select * into v_assign
    from app.production_assignments
    where production_job_id = job.id and status in ('ASSIGNED', 'ACCEPTED')
    for update;

    if found then
      update app.production_assignments
      set status = 'CANCELLED'
      where id = v_assign.id;
    end if;
  end if;

  -- Update job
  update app.production_jobs
  set status = to_clean, updated_at = now()
  where id = job.id;

  -- Audit log
  insert into app.production_job_audit (
    organization_id, production_job_id, actor_id, action, details
  ) values (
    p_organization_id, job.id, p_actor_id, 'job.status_transitioned',
    jsonb_build_object(
      'from_status', job.status,
      'to_status', to_clean,
      'reason', p_reason
    )
  );

  return to_clean;
end;
$$;

-- ============================================================================
-- 5. Stored Procedures: Production Assignment Lifecycle (F5 Normalized Lock Order)
-- ============================================================================

-- Accept Production Assignment
create or replace function app.accept_production_assignment(
  p_organization_id uuid,
  p_actor_id uuid,
  p_assignment_id uuid
) returns jsonb language plpgsql security definer set search_path=app,pg_temp as $$
declare
  v_role text;
  v_assign app.production_assignments%rowtype;
  v_job app.production_jobs%rowtype;
  v_job_id uuid;
begin
  -- 1. Authorization (F1 fail-closed)
  v_role := app.production_actor_role(p_organization_id, p_actor_id);
  if v_role is null or v_role not in ('OWNER','ADMIN','OPERATIONS') then
    raise exception 'Not authorized to accept production assignments';
  end if;

  -- 2. Lookup assignment to find parent job
  select production_job_id into v_job_id
  from app.production_assignments
  where id = p_assignment_id;

  if not found then
    raise exception 'Production assignment not found';
  end if;

  -- 3. Lock parent job for update first (F5 Lock Hierarchy)
  select * into v_job
  from app.production_jobs
  where id = v_job_id and organization_id = p_organization_id
  for update;

  if not found then
    raise exception 'Production job not found in organization';
  end if;

  -- 4. Lock assignment for update second (F5 Lock Hierarchy)
  select * into v_assign
  from app.production_assignments
  where id = p_assignment_id and production_job_id = v_job.id
  for update;

  if not found then
    raise exception 'Production assignment not found for this job';
  end if;

  -- 5. Idempotent return if already ACCEPTED (AC-03)
  if v_assign.status = 'ACCEPTED' then
    return jsonb_build_object(
      'assignment_id', v_assign.id,
      'job_id', v_job.id,
      'status', 'ACCEPTED',
      'accepted_at', v_assign.accepted_at,
      'already_accepted', true
    );
  end if;

  -- 6. Status check: only ASSIGNED can be accepted
  if v_assign.status <> 'ASSIGNED' then
    raise exception 'Cannot accept assignment with status %: only ASSIGNED assignments can be accepted', v_assign.status;
  end if;

  -- 7. Update assignment status and accepted_at
  update app.production_assignments
  set status = 'ACCEPTED',
      accepted_at = coalesce(accepted_at, now())
  where id = v_assign.id
  returning * into v_assign;

  -- 8. Coordinate production job status to ACCEPTED
  if v_job.status = 'ASSIGNED' then
    update app.production_jobs
    set status = 'ACCEPTED',
        updated_at = now()
    where id = v_job.id;
  end if;

  -- 9. Audit log
  insert into app.production_job_audit (
    organization_id, production_job_id, actor_id, action, details
  ) values (
    p_organization_id, v_job.id, p_actor_id, 'assignment.accepted',
    jsonb_build_object(
      'assignment_id', v_assign.id,
      'executor_type', v_assign.executor_type,
      'vendor_id', v_assign.vendor_id,
      'vendor_name', v_assign.vendor_name,
      'assigned_brand_id', v_assign.assigned_brand_id,
      'assigned_cost', v_assign.assigned_cost,
      'accepted_at', v_assign.accepted_at
    )
  );

  return jsonb_build_object(
    'assignment_id', v_assign.id,
    'job_id', v_job.id,
    'status', v_assign.status,
    'accepted_at', v_assign.accepted_at,
    'already_accepted', false
  );
end;
$$;

-- Decline Production Assignment
create or replace function app.decline_production_assignment(
  p_organization_id uuid,
  p_actor_id uuid,
  p_assignment_id uuid,
  p_reason text default null
) returns jsonb language plpgsql security definer set search_path=app,pg_temp as $$
declare
  v_role text;
  v_assign app.production_assignments%rowtype;
  v_job app.production_jobs%rowtype;
  v_job_id uuid;
begin
  -- 1. Authorization (F1 fail-closed)
  v_role := app.production_actor_role(p_organization_id, p_actor_id);
  if v_role is null or v_role not in ('OWNER','ADMIN','OPERATIONS') then
    raise exception 'Not authorized to decline production assignments';
  end if;

  -- 2. Lookup assignment to find parent job
  select production_job_id into v_job_id
  from app.production_assignments
  where id = p_assignment_id;

  if not found then
    raise exception 'Production assignment not found';
  end if;

  -- 3. Lock parent job for update first (F5 Lock Hierarchy)
  select * into v_job
  from app.production_jobs
  where id = v_job_id and organization_id = p_organization_id
  for update;

  if not found then
    raise exception 'Production job not found in organization';
  end if;

  -- 4. Lock assignment for update second (F5 Lock Hierarchy)
  select * into v_assign
  from app.production_assignments
  where id = p_assignment_id and production_job_id = v_job.id
  for update;

  if not found then
    raise exception 'Production assignment not found for this job';
  end if;

  if v_assign.status <> 'ASSIGNED' then
    raise exception 'Cannot decline assignment with status %: only ASSIGNED assignments can be declined', v_assign.status;
  end if;

  -- Update assignment status to DECLINED
  update app.production_assignments
  set status = 'DECLINED',
      notes = case when p_reason is not null then coalesce(notes || ' | ', '') || 'Ditolak: ' || p_reason else notes end
  where id = v_assign.id
  returning * into v_assign;

  -- Revert job status back to READY and reset committed_cost to NULL
  update app.production_jobs
  set status = 'READY',
      committed_cost = null,
      updated_at = now()
  where id = v_job.id;

  -- Audit log
  insert into app.production_job_audit (
    organization_id, production_job_id, actor_id, action, details
  ) values (
    p_organization_id, v_job.id, p_actor_id, 'assignment.declined',
    jsonb_build_object(
      'assignment_id', v_assign.id,
      'executor_type', v_assign.executor_type,
      'vendor_id', v_assign.vendor_id,
      'vendor_name', v_assign.vendor_name,
      'reason', p_reason
    )
  );

  return jsonb_build_object(
    'assignment_id', v_assign.id,
    'job_id', v_job.id,
    'status', v_assign.status,
    'job_status', 'READY'
  );
end;
$$;

-- Cancel Production Assignment
create or replace function app.cancel_production_assignment(
  p_organization_id uuid,
  p_actor_id uuid,
  p_assignment_id uuid,
  p_reason text default null
) returns jsonb language plpgsql security definer set search_path=app,pg_temp as $$
declare
  v_role text;
  v_assign app.production_assignments%rowtype;
  v_job app.production_jobs%rowtype;
  v_job_id uuid;
begin
  -- 1. Authorization (F1 fail-closed)
  v_role := app.production_actor_role(p_organization_id, p_actor_id);
  if v_role is null or v_role not in ('OWNER','ADMIN','OPERATIONS') then
    raise exception 'Not authorized to cancel production assignments';
  end if;

  -- 2. Lookup assignment to find parent job
  select production_job_id into v_job_id
  from app.production_assignments
  where id = p_assignment_id;

  if not found then
    raise exception 'Production assignment not found';
  end if;

  -- 3. Lock parent job for update first (F5 Lock Hierarchy)
  select * into v_job
  from app.production_jobs
  where id = v_job_id and organization_id = p_organization_id
  for update;

  if not found then
    raise exception 'Production job not found in organization';
  end if;

  -- 4. Lock assignment for update second (F5 Lock Hierarchy)
  select * into v_assign
  from app.production_assignments
  where id = p_assignment_id and production_job_id = v_job.id
  for update;

  if not found then
    raise exception 'Production assignment not found for this job';
  end if;

  if v_assign.status not in ('ASSIGNED', 'ACCEPTED') then
    raise exception 'Cannot cancel assignment with status %: only ASSIGNED or ACCEPTED assignments can be cancelled', v_assign.status;
  end if;

  if v_job.status in ('IN_PRODUCTION', 'AWAITING_QC', 'READY_FOR_HANDOFF', 'COMPLETED') then
    raise exception 'Cannot cancel assignment: production job % has already advanced to %', v_job.job_number, v_job.status;
  end if;

  -- Update assignment status to CANCELLED
  update app.production_assignments
  set status = 'CANCELLED',
      notes = case when p_reason is not null then coalesce(notes || ' | ', '') || 'Dibatalkan: ' || p_reason else notes end
  where id = v_assign.id
  returning * into v_assign;

  -- Reset job status to READY and committed_cost to null
  update app.production_jobs
  set status = 'READY',
      committed_cost = null,
      updated_at = now()
  where id = v_job.id;

  -- Audit log
  insert into app.production_job_audit (
    organization_id, production_job_id, actor_id, action, details
  ) values (
    p_organization_id, v_job.id, p_actor_id, 'assignment.cancelled',
    jsonb_build_object(
      'assignment_id', v_assign.id,
      'executor_type', v_assign.executor_type,
      'vendor_id', v_assign.vendor_id,
      'vendor_name', v_assign.vendor_name,
      'reason', p_reason
    )
  );

  return jsonb_build_object(
    'assignment_id', v_assign.id,
    'job_id', v_job.id,
    'status', v_assign.status,
    'job_status', 'READY'
  );
end;
$$;

-- ============================================================================
-- 6. Stored Procedure: reassign_production_job (F6 Idempotency & F5 Lock Order)
-- ============================================================================

create or replace function app.reassign_production_job(
  p_organization_id uuid,
  p_actor_id uuid,
  p_job_id uuid,
  p_executor_type text,
  p_vendor_name text default null,
  p_assigned_brand_id uuid default null,
  p_assigned_cost bigint default 0,
  p_notes text default null,
  p_vendor_id uuid default null,
  p_reason text default null,
  p_request_id uuid default null,
  p_expected_assignment_id uuid default null
) returns uuid language plpgsql security definer set search_path=app,pg_temp as $$
declare
  v_role text;
  v_job app.production_jobs%rowtype;
  v_old_assign app.production_assignments%rowtype;
  v_existing_assign app.production_assignments%rowtype;
  v_new_assign_id uuid := gen_random_uuid();
  v_payload jsonb;
  v_vendor app.vendors%rowtype;
  v_brand app.brands%rowtype;
  v_vendor_name_clean text;
begin
  -- 1. Authorization (F1 fail-closed)
  v_role := app.production_actor_role(p_organization_id, p_actor_id);
  if v_role is null or v_role not in ('OWNER','ADMIN','OPERATIONS') then
    raise exception 'Not authorized to reassign production jobs';
  end if;

  -- 2. Advisory lock on request_id if supplied (F6 Idempotency)
  if p_request_id is not null then
    perform pg_advisory_xact_lock(hashtextextended(p_actor_id::text || p_request_id::text, 0));
  end if;

  -- 3. Lock parent job for update first (F5 Lock Hierarchy)
  select * into v_job
  from app.production_jobs
  where id = p_job_id and organization_id = p_organization_id
  for update;

  if not found then
    raise exception 'Production job not found';
  end if;

  if v_job.status in ('IN_PRODUCTION', 'AWAITING_QC', 'READY_FOR_HANDOFF', 'COMPLETED', 'CANCELLED') then
    raise exception 'Cannot reassign production job in % status', v_job.status;
  end if;

  -- Construct canonical request payload
  v_payload := jsonb_build_object(
    'executor_type', upper(trim(coalesce(p_executor_type, ''))),
    'vendor_name', p_vendor_name,
    'vendor_id', p_vendor_id,
    'assigned_brand_id', p_assigned_brand_id,
    'assigned_cost', p_assigned_cost,
    'notes', p_notes,
    'reason', p_reason
  );

  -- 4. Check existing idempotent request by request_id (F6)
  if p_request_id is not null then
    select * into v_existing_assign
    from app.production_assignments
    where production_job_id = p_job_id and request_id = p_request_id;

    if found then
      if v_existing_assign.request_payload = v_payload then
        return v_existing_assign.id;
      else
        raise exception 'Idempotent request conflict: request_id has already been used with different payload';
      end if;
    end if;
  end if;

  -- 5. Find current active assignment
  select * into v_old_assign
  from app.production_assignments
  where production_job_id = p_job_id and status in ('ASSIGNED', 'ACCEPTED')
  for update;

  -- Validate expected assignment state if specified
  if p_expected_assignment_id is not null then
    if not found or v_old_assign.id <> p_expected_assignment_id then
      raise exception 'Stale assignment state: expected assignment % but found %',
        p_expected_assignment_id, coalesce(v_old_assign.id::text, 'none');
    end if;
  end if;

  -- Cancel existing active assignment if found
  if found then
    update app.production_assignments
    set status = 'CANCELLED',
        notes = case when p_reason is not null then coalesce(notes || ' | ', '') || 'Dibatalkan: ' || p_reason else notes end
    where id = v_old_assign.id;

    insert into app.production_job_audit (
      organization_id, production_job_id, actor_id, action, details
    ) values (
      p_organization_id, v_job.id, p_actor_id, 'assignment.cancelled',
      jsonb_build_object(
        'assignment_id', v_old_assign.id,
        'executor_type', v_old_assign.executor_type,
        'vendor_id', v_old_assign.vendor_id,
        'vendor_name', v_old_assign.vendor_name,
        'reason', coalesce(p_reason, 'Reassigned to new executor')
      )
    );
  end if;

  -- 6. Validate new executor
  if upper(trim(coalesce(p_executor_type, ''))) = 'INTERNAL' then
    if p_assigned_brand_id is not null then
      select * into v_brand
      from app.brands
      where id = p_assigned_brand_id and organization_id = p_organization_id and status = 'ACTIVE';

      if not found then
        raise exception 'Active internal brand not found in organization';
      end if;
    end if;
    v_vendor_name_clean := null;
  elsif upper(trim(coalesce(p_executor_type, ''))) = 'VENDOR' then
    if p_vendor_id is not null then
      select * into v_vendor
      from app.vendors
      where id = p_vendor_id and organization_id = p_organization_id and status = 'ACTIVE';

      if not found then
        raise exception 'Active vendor not found in organization';
      end if;

      v_vendor_name_clean := coalesce(nullif(trim(p_vendor_name), ''), v_vendor.name);
    else
      v_vendor_name_clean := nullif(trim(p_vendor_name), '');
      if v_vendor_name_clean is null then
        raise exception 'Vendor name is required for vendor assignment';
      end if;
    end if;
  else
    raise exception 'Executor type must be INTERNAL or VENDOR';
  end if;

  -- 7. Insert new assignment with idempotency payload
  insert into app.production_assignments (
    id,
    production_job_id,
    executor_type,
    assigned_brand_id,
    vendor_name,
    vendor_id,
    assigned_cost,
    status,
    notes,
    request_id,
    request_payload
  ) values (
    v_new_assign_id,
    v_job.id,
    upper(trim(p_executor_type)),
    p_assigned_brand_id,
    v_vendor_name_clean,
    p_vendor_id,
    coalesce(p_assigned_cost, 0),
    'ASSIGNED',
    p_notes,
    p_request_id,
    v_payload
  );

  -- 8. Update job committed cost and status
  update app.production_jobs
  set status = 'ASSIGNED',
      committed_cost = coalesce(p_assigned_cost, 0),
      updated_at = now()
  where id = v_job.id;

  -- 9. Audit log
  insert into app.production_job_audit (
    organization_id, production_job_id, actor_id, action, details
  ) values (
    p_organization_id, v_job.id, p_actor_id, 'assignment.created',
    jsonb_build_object(
      'assignment_id', v_new_assign_id,
      'executor_type', upper(trim(p_executor_type)),
      'vendor_id', p_vendor_id,
      'vendor_name', v_vendor_name_clean,
      'assigned_cost', coalesce(p_assigned_cost, 0),
      'reassigned_from', v_old_assign.id,
      'request_id', p_request_id
    )
  );

  return v_new_assign_id;
end;
$$;

-- ============================================================================
-- 7. Stored Procedure: create_delivery_order (F1, F2 Duplicate Ceiling & F3 QC Evidence)
-- ============================================================================

drop function if exists app.create_delivery_order(uuid, uuid, uuid, text, text, integer, integer, text, jsonb);

create or replace function app.create_delivery_order(
  p_organization_id uuid,
  p_actor_id uuid,
  p_order_id uuid,
  p_courier_name text,
  p_courier_service text default null,
  p_items jsonb default '[]'::jsonb,
  p_package_weight_grams integer default null,
  p_package_count integer default 1,
  p_notes text default null
) returns jsonb language plpgsql security definer set search_path=app,pg_temp as $$
declare
  v_role text;
  v_order app.orders%rowtype;
  v_shipment_id uuid;
  v_do_num text;
  v_agg_item record;
  v_item jsonb;
  v_order_item app.order_items%rowtype;
  v_shipped_so_far bigint;
  v_total_qty integer := 0;
  v_item_count integer := 0;
  v_requested_qty integer;
  v_block_job_id uuid;
  v_block_job_number text;
  v_block_job_status text;
  v_block_qc_num text;
  v_block_qc_res text;
  v_latest_qc_result text;
begin
  -- 1. Authorization check (F1 fail-closed)
  v_role := app.shipment_actor_role(p_organization_id, p_actor_id);
  if v_role is null or v_role not in ('OWNER', 'ADMIN', 'OPERATIONS') then
    raise exception 'Unauthorized to create delivery orders';
  end if;

  -- 2. Validate courier name
  if nullif(trim(p_courier_name), '') is null then
    raise exception 'Courier name is required';
  end if;

  -- 3. Lock parent order for update
  select * into v_order
  from app.orders
  where id = p_order_id and organization_id = p_organization_id
  for update;

  if not found then
    raise exception 'Order not found in this organization';
  end if;

  if v_order.status not in ('CONFIRMED', 'ACTIVE') then
    raise exception 'Cannot create delivery order for order in % status (must be CONFIRMED or ACTIVE)', v_order.status;
  end if;

  if jsonb_array_length(p_items) = 0 then
    raise exception 'Delivery order must contain at least one item';
  end if;

  -- F3 Guard 0: Check for uncompleted order-level jobs (jobs not linked to a specific item, like packaging)
  select pj.id, pj.job_number, pj.status
  into v_block_job_id, v_block_job_number, v_block_job_status
  from app.production_jobs pj
  where pj.order_id = v_order.id
    and pj.organization_id = p_organization_id
    and pj.status <> 'CANCELLED'
    and pj.status not in ('READY_FOR_HANDOFF', 'COMPLETED')
    and not exists (
      select 1 from app.production_job_items pji where pji.production_job_id = pj.id
    )
  limit 1;

  if found then
    raise exception 'Cannot create delivery order: Production job % (%) for order % is currently % (required: READY_FOR_HANDOFF or COMPLETED)',
      v_block_job_number, v_block_job_id, v_order.order_number, v_block_job_status;
  end if;

  -- Check for unresolved QC inspections on order-level jobs (AC-03..AC-05)
  select qi.inspection_number, qi.result, pj.job_number
  into v_block_qc_num, v_block_qc_res, v_block_job_number
  from app.qc_inspections qi
  join app.production_jobs pj on pj.id = qi.production_job_id
  where pj.order_id = v_order.id
    and pj.organization_id = p_organization_id
    and pj.status <> 'CANCELLED'
    and not exists (
      select 1 from app.production_job_items pji where pji.production_job_id = pj.id
    )
    and qi.result in ('REWORK', 'REJECTED')
    and not exists (
      select 1 from app.qc_inspections qi2
      where qi2.production_job_id = pj.id
        and qi2.result = 'PASS'
        and (qi2.inspected_at > qi.inspected_at or (qi2.inspected_at = qi.inspected_at and qi2.inspection_number > qi.inspection_number))
    )
  limit 1;

  if found then
    raise exception 'Cannot create delivery order: Production job % for order % has unresolved QC inspection % with result %',
      v_block_job_number, v_order.order_number, v_block_qc_num, v_block_qc_res;
  end if;

  -- 4. F2 Ceiling & F3 QC Validation: Aggregate requested quantities per order_item_id
  for v_agg_item in
    select
      (item->>'order_item_id')::uuid as order_item_id,
      sum((item->>'quantity')::integer) as total_qty
    from jsonb_array_elements(p_items) as item
    group by (item->>'order_item_id')::uuid
  loop
    if v_agg_item.total_qty <= 0 then
      raise exception 'Total requested quantity for order item % must be greater than zero', v_agg_item.order_item_id;
    end if;

    -- Lock and verify order item belongs to this order
    select * into v_order_item
    from app.order_items
    where id = v_agg_item.order_item_id and order_id = v_order.id
    for update;

    if not found then
      raise exception 'Order item % does not exist in order %', v_agg_item.order_item_id, v_order.order_number;
    end if;

    -- F3 Guard 1: Verify all linked production jobs are READY_FOR_HANDOFF or COMPLETED
    select pj.job_number, pj.status into v_block_job_number, v_block_job_status
    from app.production_job_items pji
    join app.production_jobs pj on pj.id = pji.production_job_id
    where pji.order_item_id = v_order_item.id
      and pj.status not in ('READY_FOR_HANDOFF', 'COMPLETED', 'CANCELLED')
    limit 1;

    if found then
      raise exception 'Cannot create delivery order: Production job % (%) for order % is currently % (required: READY_FOR_HANDOFF or COMPLETED)',
        v_block_job_number, v_block_job_number, v_order.order_number, v_block_job_status;
    end if;

    -- F3 Guard 2: Verify all linked production jobs have authoritative QC PASS evidence
    select qi.inspection_number, qi.result, pj.job_number
    into v_block_qc_num, v_block_qc_res, v_block_job_number
    from app.production_job_items pji
    join app.production_jobs pj on pj.id = pji.production_job_id
    cross join lateral (
      select result, inspection_number
      from app.qc_inspections
      where production_job_id = pj.id
      order by inspected_at desc, created_at desc, inspection_number desc, id desc
      limit 1
    ) qi
    where pji.order_item_id = v_order_item.id
      and pj.status in ('READY_FOR_HANDOFF', 'COMPLETED')
      and qi.result in ('REWORK', 'REJECTED')
    limit 1;

    if found then
      raise exception 'Cannot create delivery order: Production job % for item "%" has unresolved QC inspection % with result %',
        v_block_job_number, v_order_item.description, v_block_qc_num, v_block_qc_res;
    end if;

    -- F2 Ceiling Guard: Aggregate total previously shipped + total requested in this payload
    select coalesce(sum(si.quantity), 0) into v_shipped_so_far
    from app.shipment_items si
    join app.shipments s on s.id = si.shipment_id
    where si.order_item_id = v_order_item.id
      and s.status not in ('CANCELLED', 'RETURNED');

    if (v_shipped_so_far + v_agg_item.total_qty) > v_order_item.quantity then
      raise exception 'Requested quantity (%) exceeds remaining unshipped quota (%) for item %',
        v_agg_item.total_qty, (v_order_item.quantity - v_shipped_so_far), v_order_item.description;
    end if;
  end loop;

  -- 5. Generate canonical DO document number
  v_do_num := app.generate_document_number(p_organization_id, v_order.brand_id, 'DO');

  -- 6. Create Shipment Header in READY_TO_DISPATCH status
  insert into app.shipments (
    organization_id,
    brand_id,
    order_id,
    customer_account_id,
    shipment_number,
    status,
    courier_name,
    courier_service,
    package_weight_grams,
    package_count,
    shipping_address_snapshot,
    notes,
    created_by_user_id
  ) values (
    p_organization_id,
    v_order.brand_id,
    v_order.id,
    v_order.customer_account_id,
    v_do_num,
    'READY_TO_DISPATCH',
    upper(trim(p_courier_name)),
    nullif(trim(p_courier_service), ''),
    p_package_weight_grams,
    coalesce(p_package_count, 1),
    v_order.shipping_address_snapshot,
    p_notes,
    p_actor_id
  ) returning id into v_shipment_id;

  -- 7. Insert Shipment Items
  for v_item in select * from jsonb_array_elements(p_items)
  loop
    v_requested_qty := (v_item->>'quantity')::integer;

    insert into app.shipment_items (
      shipment_id,
      order_item_id,
      quantity,
      notes
    ) values (
      v_shipment_id,
      (v_item->>'order_item_id')::uuid,
      v_requested_qty,
      v_item->>'notes'
    );

    v_item_count := v_item_count + 1;
    v_total_qty := v_total_qty + v_requested_qty;
  end loop;

  -- 8. Audit log
  insert into app.shipment_audit (
    organization_id, shipment_id, actor_id, action, metadata
  ) values (
    p_organization_id, v_shipment_id, p_actor_id, 'shipment.created',
    jsonb_build_object(
      'shipment_number', v_do_num,
      'order_id', v_order.id,
      'order_number', v_order.order_number,
      'courier_name', upper(trim(p_courier_name)),
      'package_count', coalesce(p_package_count, 1),
      'item_count', v_item_count,
      'total_quantity', v_total_qty
    )
  );

  return jsonb_build_object(
    'shipment_id', v_shipment_id,
    'shipment_number', v_do_num,
    'status', 'READY_TO_DISPATCH',
    'item_count', v_item_count,
    'total_quantity', v_total_qty
  );
end;
$$;

-- Dispatch Shipment (F1 fail-closed)
create or replace function app.dispatch_shipment(
  p_organization_id uuid,
  p_actor_id uuid,
  p_shipment_id uuid,
  p_tracking_number text default null,
  p_actual_shipping_cost bigint default null,
  p_notes text default null
) returns jsonb language plpgsql security definer set search_path=app,pg_temp as $$
declare
  v_role text;
  v_shipment app.shipments%rowtype;
  v_clean_tracking text;
  v_led_num text;
begin
  -- 1. Authorization check (F1 fail-closed)
  v_role := app.shipment_actor_role(p_organization_id, p_actor_id);
  if v_role is null or v_role not in ('OWNER', 'ADMIN', 'OPERATIONS', 'FINANCE') then
    raise exception 'Unauthorized to dispatch shipments';
  end if;

  -- 2. Lock shipment
  select * into v_shipment
  from app.shipments
  where id = p_shipment_id and organization_id = p_organization_id
  for update;

  if not found then
    raise exception 'Shipment not found in organization';
  end if;

  if v_shipment.status not in ('DRAFT', 'READY_TO_DISPATCH') then
    raise exception 'Cannot dispatch shipment currently in % status', v_shipment.status;
  end if;

  v_clean_tracking := nullif(trim(coalesce(p_tracking_number, v_shipment.tracking_number, '')), '');

  -- External couriers require tracking number
  if v_shipment.courier_name not in ('INTERNAL', 'INTERNAL_COURIER', 'PICKUP', 'CUSTOMER_PICKUP') then
    if v_clean_tracking is null then
      raise exception 'Tracking number is required for courier %', v_shipment.courier_name;
    end if;
  end if;

  -- 3. Update shipment
  update app.shipments
  set status = 'DISPATCHED',
      tracking_number = v_clean_tracking,
      actual_shipping_cost = coalesce(p_actual_shipping_cost, actual_shipping_cost),
      dispatch_date = now(),
      notes = coalesce(p_notes, notes),
      updated_at = now()
  where id = v_shipment.id;

  -- 4. Audit trail
  insert into app.shipment_audit (
    organization_id,
    shipment_id,
    actor_id,
    action,
    metadata
  ) values (
    p_organization_id,
    v_shipment.id,
    p_actor_id,
    'shipment.dispatched',
    jsonb_build_object(
      'tracking_number', v_clean_tracking,
      'actual_shipping_cost', coalesce(p_actual_shipping_cost, v_shipment.actual_shipping_cost),
      'dispatch_date', now()
    )
  );

  -- 5. If actual shipping cost disbursed, record into financial ledger
  if coalesce(p_actual_shipping_cost, v_shipment.actual_shipping_cost) > 0 then
    v_led_num := app.generate_document_number(p_organization_id, v_shipment.brand_id, 'LED');
    
    insert into app.financial_ledger_entries (
      organization_id,
      brand_id,
      order_id,
      entry_number,
      entry_type,
      category,
      amount,
      direction,
      reference_id,
      reference_document,
      metadata,
      notes,
      created_by_user_id
    ) values (
      p_organization_id,
      v_shipment.brand_id,
      v_shipment.order_id,
      v_led_num,
      'COURIER_EXPENSE_DISBURSED',
      'PASS_THROUGH_SHIPPING',
      coalesce(p_actual_shipping_cost, v_shipment.actual_shipping_cost),
      'DEBIT',
      v_shipment.id,
      v_shipment.shipment_number,
      jsonb_build_object(
        'courier_name', v_shipment.courier_name,
        'tracking_number', v_clean_tracking,
        'actual_shipping_cost', coalesce(p_actual_shipping_cost, v_shipment.actual_shipping_cost)
      ),
      'Pengeluaran ongkir riil serah terima kurir ekspedisi (Pass-through reimbursement)',
      p_actor_id
    );
  end if;

  return jsonb_build_object(
    'shipment_id', v_shipment.id,
    'shipment_number', v_shipment.shipment_number,
    'status', 'DISPATCHED',
    'tracking_number', v_clean_tracking,
    'actual_shipping_cost', coalesce(p_actual_shipping_cost, v_shipment.actual_shipping_cost)
  );
end;
$$;

-- Mark Shipment Delivered (F1 fail-closed)
create or replace function app.mark_shipment_delivered(
  p_organization_id uuid,
  p_actor_id uuid,
  p_shipment_id uuid,
  p_delivered_date timestamptz default null,
  p_notes text default null
) returns jsonb language plpgsql security definer set search_path=app,pg_temp as $$
declare
  v_role text;
  v_shipment app.shipments%rowtype;
  v_delivery_time timestamptz;
begin
  -- 1. Authorization check (F1 fail-closed)
  v_role := app.shipment_actor_role(p_organization_id, p_actor_id);
  if v_role is null or v_role not in ('OWNER', 'ADMIN', 'OPERATIONS') then
    raise exception 'Unauthorized to update shipment status';
  end if;

  -- 2. Lock shipment
  select * into v_shipment
  from app.shipments
  where id = p_shipment_id and organization_id = p_organization_id
  for update;

  if not found then
    raise exception 'Shipment not found in organization';
  end if;

  if v_shipment.status = 'DELIVERED' then
    return jsonb_build_object(
      'shipment_id', v_shipment.id,
      'shipment_number', v_shipment.shipment_number,
      'status', 'DELIVERED',
      'already_delivered', true
    );
  end if;

  if v_shipment.status <> 'DISPATCHED' then
    raise exception 'Only DISPATCHED shipments can be marked as DELIVERED (current: %)', v_shipment.status;
  end if;

  v_delivery_time := coalesce(p_delivered_date, now());

  -- 3. Update shipment status
  update app.shipments
  set status = 'DELIVERED',
      delivered_date = v_delivery_time,
      notes = coalesce(p_notes, notes),
      updated_at = now()
  where id = v_shipment.id;

  -- 4. Audit trail
  insert into app.shipment_audit (
    organization_id,
    shipment_id,
    actor_id,
    action,
    metadata
  ) values (
    p_organization_id,
    v_shipment.id,
    p_actor_id,
    'shipment.delivered',
    jsonb_build_object(
      'delivered_date', v_delivery_time,
      'notes', p_notes
    )
  );

  return jsonb_build_object(
    'shipment_id', v_shipment.id,
    'shipment_number', v_shipment.shipment_number,
    'status', 'DELIVERED',
    'delivered_date', v_delivery_time
  );
end;
$$;

-- Cancel Shipment (F1 fail-closed)
create or replace function app.cancel_shipment(
  p_organization_id uuid,
  p_actor_id uuid,
  p_shipment_id uuid,
  p_reason text default null
) returns jsonb language plpgsql security definer set search_path=app,pg_temp as $$
declare
  v_role text;
  v_shipment app.shipments%rowtype;
begin
  -- 1. Authorization check (F1 fail-closed)
  v_role := app.shipment_actor_role(p_organization_id, p_actor_id);
  if v_role is null or v_role not in ('OWNER', 'ADMIN', 'OPERATIONS') then
    raise exception 'Unauthorized to cancel shipment';
  end if;

  -- 2. Lock shipment
  select * into v_shipment
  from app.shipments
  where id = p_shipment_id and organization_id = p_organization_id
  for update;

  if not found then
    raise exception 'Shipment not found in organization';
  end if;

  if v_shipment.status in ('DELIVERED', 'CANCELLED', 'RETURNED') then
    raise exception 'Cannot cancel shipment with status %', v_shipment.status;
  end if;

  -- 3. Update status
  update app.shipments
  set status = 'CANCELLED',
      notes = case when p_reason is not null then coalesce(notes || ' | ', '') || 'Batal: ' || p_reason else notes end,
      updated_at = now()
  where id = v_shipment.id;

  -- 4. Audit trail
  insert into app.shipment_audit (
    organization_id,
    shipment_id,
    actor_id,
    action,
    metadata
  ) values (
    p_organization_id,
    v_shipment.id,
    p_actor_id,
    'shipment.cancelled',
    jsonb_build_object('reason', p_reason)
  );

  return jsonb_build_object(
    'shipment_id', v_shipment.id,
    'shipment_number', v_shipment.shipment_number,
    'status', 'CANCELLED'
  );
end;
$$;

-- ============================================================================
-- 9. Stored Procedure: record_qc_inspection (Deterministic Ordering via clock_timestamp)
-- ============================================================================

create or replace function app.record_qc_inspection(
  p_organization_id uuid,
  p_actor_id uuid,
  p_production_job_id uuid,
  p_result text,
  p_sample_size integer default 1,
  p_defect_count integer default 0,
  p_defect_category text default null,
  p_defect_severity text default null,
  p_checklist_snapshot jsonb default '{}',
  p_rework_instructions text default null,
  p_notes text default null
) returns jsonb language plpgsql security definer set search_path=app,pg_temp as $$
declare
  role_code text;
  job app.production_jobs%rowtype;
  inspection_id uuid := gen_random_uuid();
  qc_num text;
  result_clean text;
  cat_clean text;
  sev_clean text;
  audit_details jsonb;
begin
  role_code := app.production_actor_role(p_organization_id, p_actor_id);
  if role_code is null or role_code not in ('OWNER','ADMIN','OPERATIONS','QC') then
    raise exception 'Not authorized to record QC inspection';
  end if;

  select * into job from app.production_jobs
  where id = p_production_job_id and organization_id = p_organization_id
  for update;

  if not found then
    raise exception 'Production job not found';
  end if;

  if job.status <> 'AWAITING_QC' then
    raise exception 'Job must be in AWAITING_QC status to perform inspection (current: %)', job.status;
  end if;

  result_clean := upper(trim(coalesce(p_result, '')));
  if result_clean not in ('PASS','REWORK','REJECTED') then
    raise exception 'QC result must be PASS, REWORK, or REJECTED';
  end if;

  if coalesce(p_sample_size, 1) < 1 then
    raise exception 'Sample size must be at least 1';
  end if;

  if coalesce(p_defect_count, 0) < 0 then
    raise exception 'Defect count cannot be negative';
  end if;

  cat_clean := nullif(upper(trim(coalesce(p_defect_category, ''))), '');
  sev_clean := nullif(upper(trim(coalesce(p_defect_severity, ''))), '');

  if result_clean = 'REWORK' or coalesce(p_defect_count, 0) > 0 then
    if cat_clean is null or cat_clean not in ('FABRIC','PRINT_MISALIGNMENT','COLOR_SHIFT','ADHESION','SIZING','FINISHING_PACKAGING','OTHER') then
      raise exception 'Valid defect category required when defects are found or rework requested';
    end if;

    if sev_clean is null or sev_clean not in ('MINOR','MAJOR','CRITICAL') then
      raise exception 'Valid defect severity required when defects are found or rework requested';
    end if;
  end if;

  if result_clean = 'REWORK' and coalesce(length(trim(p_rework_instructions)), 0) < 5 then
    raise exception 'Detailed rework instructions are required when marking job for rework';
  end if;

  -- Generate canonical QC inspection document number: TS-QC-2026-000001
  qc_num := app.generate_document_number(p_organization_id, job.brand_id, 'QC', extract(year from now())::integer, 6);

  -- Insert QC inspection record with clock_timestamp() for deterministic ordering
  insert into app.qc_inspections (
    id, organization_id, production_job_id, inspector_id,
    inspection_number, result, sample_size, defect_count,
    defect_category, defect_severity, checklist_snapshot,
    rework_instructions, notes, inspected_at
  ) values (
    inspection_id, p_organization_id, job.id, p_actor_id,
    qc_num, result_clean, coalesce(p_sample_size, 1), coalesce(p_defect_count, 0),
    cat_clean, sev_clean, coalesce(p_checklist_snapshot, '{}'::jsonb),
    p_rework_instructions, p_notes, clock_timestamp()
  );

  -- Automatic state progression based on QC outcome
  if result_clean = 'PASS' then
    perform app.transition_production_job_status(
      p_organization_id, p_actor_id, job.id, 'READY_FOR_HANDOFF',
      'QC Inspection PASS: ' || qc_num
    );
  elsif result_clean = 'REWORK' then
    perform app.transition_production_job_status(
      p_organization_id, p_actor_id, job.id, 'REWORK',
      'QC Rework: ' || cat_clean || ' (' || sev_clean || ') - ' || coalesce(p_rework_instructions, '')
    );
  elsif result_clean = 'REJECTED' then
    perform app.transition_production_job_status(
      p_organization_id, p_actor_id, job.id, 'ON_HOLD',
      'QC Rejected: ' || cat_clean || ' (' || sev_clean || ') - Job held for executive review'
    );
  end if;

  -- Record production job audit
  audit_details := jsonb_build_object(
    'inspection_number', qc_num,
    'result', result_clean,
    'sample_size', p_sample_size,
    'defect_count', p_defect_count,
    'defect_category', cat_clean,
    'defect_severity', sev_clean
  );

  insert into app.production_job_audit (
    organization_id, production_job_id, actor_id, action, details
  ) values (
    p_organization_id, job.id, p_actor_id, 'job.qc_inspection', audit_details
  );

  return jsonb_build_object(
    'inspection_id', inspection_id,
    'inspection_number', qc_num,
    'job_id', job.id,
    'result', result_clean,
    'status', case
      when result_clean = 'PASS' then 'READY_FOR_HANDOFF'
      when result_clean = 'REWORK' then 'REWORK'
      when result_clean = 'REJECTED' then 'ON_HOLD'
    end
  );
end;
$$;

-- Revoke & Grant permissions
revoke all on function app.order_actor_role(uuid,uuid),
  app.shipment_actor_role(uuid,uuid),
  app.transition_order_status(uuid,uuid,uuid,text,text),
  app.transition_production_job_status(uuid,uuid,uuid,text,text),
  app.accept_production_assignment(uuid,uuid,uuid),
  app.decline_production_assignment(uuid,uuid,uuid,text),
  app.cancel_production_assignment(uuid,uuid,uuid,text),
  app.reassign_production_job(uuid,uuid,uuid,text,text,uuid,bigint,text,uuid,text,uuid,uuid),
  app.create_delivery_order(uuid,uuid,uuid,text,text,jsonb,integer,integer,text),
  app.dispatch_shipment(uuid,uuid,uuid,text,bigint,text),
  app.mark_shipment_delivered(uuid,uuid,uuid,timestamptz,text),
  app.cancel_shipment(uuid,uuid,uuid,text),
  app.record_qc_inspection(uuid,uuid,uuid,text,integer,integer,text,text,jsonb,text,text)
from public, anon, authenticated, service_role;

grant execute on function app.order_actor_role(uuid,uuid),
  app.shipment_actor_role(uuid,uuid),
  app.transition_order_status(uuid,uuid,uuid,text,text),
  app.transition_production_job_status(uuid,uuid,uuid,text,text),
  app.accept_production_assignment(uuid,uuid,uuid),
  app.decline_production_assignment(uuid,uuid,uuid,text),
  app.cancel_production_assignment(uuid,uuid,uuid,text),
  app.reassign_production_job(uuid,uuid,uuid,text,text,uuid,bigint,text,uuid,text,uuid,uuid),
  app.create_delivery_order(uuid,uuid,uuid,text,text,jsonb,integer,integer,text),
  app.dispatch_shipment(uuid,uuid,uuid,text,bigint,text),
  app.mark_shipment_delivered(uuid,uuid,uuid,timestamptz,text),
  app.cancel_shipment(uuid,uuid,uuid,text),
  app.record_qc_inspection(uuid,uuid,uuid,text,integer,integer,text,text,jsonb,text,text)
to service_role;
