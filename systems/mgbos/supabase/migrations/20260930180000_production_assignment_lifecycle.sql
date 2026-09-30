-- Migration: 20260930180000_production_assignment_lifecycle.sql
-- Description: MGBOS Phase 1 P0-04 Assignment Acceptance / Reassignment Lifecycle
-- Specification: MultiGraph Business OS — Sprint 4 / Backlog P0-04
--
-- Implements authoritative lifecycle for Production Assignment:
--   - Active assignment uniqueness constraint (AC-09)
--   - accept_production_assignment: ASSIGNED -> ACCEPTED with timestamp and job sync (AC-01..AC-04, AC-12)
--   - decline_production_assignment: ASSIGNED -> DECLINED, job returns to READY (AC-05..AC-07)
--   - cancel_production_assignment: ASSIGNED/ACCEPTED -> CANCELLED, job returns to READY
--   - reassign_production_job: atomic reassignment with cancellation of old assignment (AC-08)
--   - transition_production_job_status coordination with active assignment

begin;

-- ============================================================================
-- 1. Active Assignment Uniqueness Constraint (AC-09)
-- Prevents two contradictory active assignments for the same production job.
-- ============================================================================
create unique index if not exists uidx_production_assignments_active
  on app.production_assignments(production_job_id)
  where status in ('ASSIGNED', 'ACCEPTED');

-- ============================================================================
-- 2. Stored Procedure: accept_production_assignment (AC-01..AC-04, AC-10..AC-12)
-- ============================================================================
create or replace function app.accept_production_assignment(
  p_organization_id uuid,
  p_actor_id uuid,
  p_assignment_id uuid
) returns jsonb language plpgsql security definer set search_path=app,pg_temp as $$
declare
  v_role text;
  v_assign app.production_assignments%rowtype;
  v_job app.production_jobs%rowtype;
begin
  -- 1. Actor authorization (AC-10, AC-11)
  v_role := app.production_actor_role(p_organization_id, p_actor_id);
  if v_role not in ('OWNER','ADMIN','OPERATIONS') then
    raise exception 'Not authorized to accept production assignments';
  end if;

  -- 2. Lock assignment
  select * into v_assign
  from app.production_assignments
  where id = p_assignment_id
  for update;

  if not found then
    raise exception 'Production assignment not found';
  end if;

  -- 3. Lock parent job & verify tenancy (AC-11)
  select * into v_job
  from app.production_jobs
  where id = v_assign.production_job_id and organization_id = p_organization_id
  for update;

  if not found then
    raise exception 'Production job not found in organization';
  end if;

  -- 4. Idempotency: Duplicate acceptance is safe (AC-12)
  if v_assign.status = 'ACCEPTED' then
    return jsonb_build_object(
      'assignment_id', v_assign.id,
      'job_id', v_job.id,
      'status', v_assign.status,
      'accepted_at', v_assign.accepted_at,
      'already_accepted', true
    );
  end if;

  -- 5. Status check: only ASSIGNED can be accepted (AC-01)
  if v_assign.status <> 'ASSIGNED' then
    raise exception 'Cannot accept assignment with status %: only ASSIGNED assignments can be accepted', v_assign.status;
  end if;

  -- 6. Update assignment status and accepted_at (AC-02, AC-03)
  update app.production_assignments
  set status = 'ACCEPTED',
      accepted_at = coalesce(accepted_at, now())
  where id = v_assign.id
  returning * into v_assign;

  -- 7. Coordinate production job status to ACCEPTED (AC-04)
  if v_job.status = 'ASSIGNED' then
    update app.production_jobs
    set status = 'ACCEPTED',
        updated_at = now()
    where id = v_job.id;
  end if;

  -- 8. Audit log
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
end; $$;

-- ============================================================================
-- 3. Stored Procedure: decline_production_assignment (AC-05..AC-07)
-- ============================================================================
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
begin
  -- 1. Authorization (AC-10, AC-11)
  v_role := app.production_actor_role(p_organization_id, p_actor_id);
  if v_role not in ('OWNER','ADMIN','OPERATIONS') then
    raise exception 'Not authorized to decline production assignments';
  end if;

  -- 2. Lock assignment
  select * into v_assign
  from app.production_assignments
  where id = p_assignment_id
  for update;

  if not found then
    raise exception 'Production assignment not found';
  end if;

  -- 3. Lock parent job & verify tenancy
  select * into v_job
  from app.production_jobs
  where id = v_assign.production_job_id and organization_id = p_organization_id
  for update;

  if not found then
    raise exception 'Production job not found in organization';
  end if;

  -- 4. Status check: only ASSIGNED can be declined (AC-05)
  if v_assign.status <> 'ASSIGNED' then
    raise exception 'Cannot decline assignment with status %: only ASSIGNED assignments can be declined', v_assign.status;
  end if;

  -- 5. Update assignment to DECLINED (AC-06: historical evidence retained)
  update app.production_assignments
  set status = 'DECLINED',
      notes = case 
        when p_reason is not null and length(trim(p_reason)) > 0 then
          coalesce(notes || E'\n[Ditolak: ' || trim(p_reason) || ']', '[Ditolak: ' || trim(p_reason) || ']')
        else notes
      end
  where id = v_assign.id
  returning * into v_assign;

  -- 6. Coordinate job back to READY so it can be reassigned (AC-07, AC-08)
  if v_job.status in ('ASSIGNED', 'READY') then
    update app.production_jobs
    set status = 'READY',
        updated_at = now()
    where id = v_job.id;
  end if;

  -- 7. Audit log (preserving previous cost evidence, Section 53)
  insert into app.production_job_audit (
    organization_id, production_job_id, actor_id, action, details
  ) values (
    p_organization_id, v_job.id, p_actor_id, 'assignment.declined',
    jsonb_build_object(
      'assignment_id', v_assign.id,
      'executor_type', v_assign.executor_type,
      'vendor_id', v_assign.vendor_id,
      'vendor_name', v_assign.vendor_name,
      'declined_cost', v_assign.assigned_cost,
      'reason', p_reason
    )
  );

  return jsonb_build_object(
    'assignment_id', v_assign.id,
    'job_id', v_job.id,
    'status', v_assign.status,
    'reason', p_reason
  );
end; $$;

-- ============================================================================
-- 4. Stored Procedure: cancel_production_assignment
-- ============================================================================
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
begin
  -- 1. Authorization
  v_role := app.production_actor_role(p_organization_id, p_actor_id);
  if v_role not in ('OWNER','ADMIN','OPERATIONS') then
    raise exception 'Not authorized to cancel production assignments';
  end if;

  -- 2. Lock assignment
  select * into v_assign
  from app.production_assignments
  where id = p_assignment_id
  for update;

  if not found then
    raise exception 'Production assignment not found';
  end if;

  -- 3. Lock parent job & verify tenancy
  select * into v_job
  from app.production_jobs
  where id = v_assign.production_job_id and organization_id = p_organization_id
  for update;

  if not found then
    raise exception 'Production job not found in organization';
  end if;

  -- 4. Status check: cannot cancel if already terminal
  if v_assign.status in ('DECLINED', 'CANCELLED') then
    raise exception 'Assignment is already %', v_assign.status;
  end if;

  -- Cannot cancel if job is already in physical production or beyond
  if v_job.status in ('IN_PRODUCTION', 'AWAITING_QC', 'REWORK', 'READY_FOR_HANDOFF', 'COMPLETED') then
    raise exception 'Cannot cancel assignment because production job is already %', v_job.status;
  end if;

  -- 5. Update assignment to CANCELLED
  update app.production_assignments
  set status = 'CANCELLED',
      notes = case 
        when p_reason is not null and length(trim(p_reason)) > 0 then
          coalesce(notes || E'\n[Dibatalkan: ' || trim(p_reason) || ']', '[Dibatalkan: ' || trim(p_reason) || ']')
        else notes
      end
  where id = v_assign.id
  returning * into v_assign;

  -- 6. Coordinate job back to READY
  if v_job.status in ('ASSIGNED', 'ACCEPTED') then
    update app.production_jobs
    set status = 'READY',
        updated_at = now()
    where id = v_job.id;
  end if;

  -- 7. Audit log
  insert into app.production_job_audit (
    organization_id, production_job_id, actor_id, action, details
  ) values (
    p_organization_id, v_job.id, p_actor_id, 'assignment.cancelled',
    jsonb_build_object(
      'assignment_id', v_assign.id,
      'executor_type', v_assign.executor_type,
      'vendor_id', v_assign.vendor_id,
      'vendor_name', v_assign.vendor_name,
      'cancelled_cost', v_assign.assigned_cost,
      'reason', p_reason
    )
  );

  return jsonb_build_object(
    'assignment_id', v_assign.id,
    'job_id', v_job.id,
    'status', v_assign.status,
    'reason', p_reason
  );
end; $$;

-- ============================================================================
-- 5. Updated Stored Procedure: assign_production_job (AC-08, AC-09)
-- Guards against conflicting active assignments.
-- ============================================================================
create or replace function app.assign_production_job(
  p_organization_id uuid,
  p_actor_id uuid,
  p_job_id uuid,
  p_executor_type text,
  p_vendor_name text default null,
  p_assigned_brand_id uuid default null,
  p_assigned_cost bigint default 0,
  p_notes text default null,
  p_vendor_id uuid default null
) returns uuid language plpgsql security definer set search_path=app,pg_temp as $$
declare
  role_code text;
  job app.production_jobs%rowtype;
  assign_id uuid := gen_random_uuid();
  exec_type_clean text;
  v_vendor app.vendors%rowtype;
  v_vendor_id uuid := null;
  v_vendor_name text := null;
  v_brand app.brands%rowtype;
  v_active_assign_id uuid;
  v_active_status text;
begin
  -- 1. Actor authorization
  role_code := app.production_actor_role(p_organization_id, p_actor_id);
  if role_code not in ('OWNER','ADMIN','OPERATIONS') then
    raise exception 'Not authorized to assign production jobs';
  end if;

  -- 2. Lock job row
  select * into job from app.production_jobs
  where id = p_job_id and organization_id = p_organization_id
  for update;

  if not found then
    raise exception 'Production job not found in organization';
  end if;

  if job.status not in ('PLANNED','READY','ASSIGNED') then
    raise exception 'Can only assign job in PLANNED, READY, or ASSIGNED status';
  end if;

  -- 2b. Prevent conflicting active assignments (AC-09)
  select id, status into v_active_assign_id, v_active_status
  from app.production_assignments
  where production_job_id = job.id and status in ('ASSIGNED', 'ACCEPTED')
  limit 1;

  if found then
    raise exception 'Production job already has an active assignment (%) with status %. Decline or cancel it before assigning again.', v_active_assign_id, v_active_status;
  end if;

  -- 3. Validate executor type
  exec_type_clean := upper(trim(coalesce(p_executor_type, '')));
  if exec_type_clean not in ('INTERNAL','VENDOR') then
    raise exception 'Executor type must be INTERNAL or VENDOR';
  end if;

  -- 4. Validate internal vs vendor executor
  if exec_type_clean = 'INTERNAL' then
    if p_assigned_brand_id is null then
      raise exception 'Assigned brand required for internal execution';
    end if;

    select * into v_brand
    from app.brands
    where id = p_assigned_brand_id and organization_id = p_organization_id and status = 'ACTIVE';

    if not found then
      raise exception 'Assigned internal brand not found or not active in organization';
    end if;

    v_vendor_id := null;
    v_vendor_name := null;

  elsif exec_type_clean = 'VENDOR' then
    if p_vendor_id is not null then
      select * into v_vendor
      from app.vendors
      where id = p_vendor_id and organization_id = p_organization_id;

      if not found then
        raise exception 'Vendor not found in organization';
      end if;

      if v_vendor.status <> 'ACTIVE' then
        raise exception 'Vendor % is not ACTIVE (status: %)', v_vendor.name, v_vendor.status;
      end if;

      v_vendor_id := v_vendor.id;
      v_vendor_name := coalesce(nullif(trim(p_vendor_name), ''), v_vendor.name);
    else
      if coalesce(length(trim(p_vendor_name)), 0) < 2 then
        raise exception 'Vendor name or valid vendor_id required for external vendor execution';
      end if;
      v_vendor_id := null;
      v_vendor_name := trim(p_vendor_name);
    end if;

    p_assigned_brand_id := null;
  end if;

  -- 5. Cost validation
  if p_assigned_cost < 0 then
    raise exception 'Assigned cost cannot be negative';
  end if;

  -- 6. Insert production assignment
  insert into app.production_assignments (
    id, production_job_id, executor_type, assigned_brand_id,
    vendor_id, vendor_name, assigned_cost, status, notes
  ) values (
    assign_id, job.id, exec_type_clean, p_assigned_brand_id,
    v_vendor_id, v_vendor_name, p_assigned_cost, 'ASSIGNED', p_notes
  );

  -- 7. Update production job status & committed cost
  update app.production_jobs
  set status = 'ASSIGNED',
      committed_cost = p_assigned_cost,
      updated_at = now()
  where id = job.id;

  -- 8. Record audit log
  insert into app.production_job_audit (
    organization_id, production_job_id, actor_id, action, details
  ) values (
    p_organization_id, job.id, p_actor_id, 'job.assigned',
    jsonb_build_object(
      'assignment_id', assign_id,
      'executor_type', exec_type_clean,
      'vendor_id', v_vendor_id,
      'vendor_name', v_vendor_name,
      'assigned_brand_id', p_assigned_brand_id,
      'assigned_cost', p_assigned_cost
    )
  );

  return assign_id;
end; $$;

-- ============================================================================
-- 6. Stored Procedure: reassign_production_job (AC-08)
-- Cancels active assignment and establishes new assignment atomically.
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
  p_reason text default null
) returns uuid language plpgsql security definer set search_path=app,pg_temp as $$
declare
  v_role text;
  v_old_assign app.production_assignments%rowtype;
  v_new_assign_id uuid;
begin
  -- 1. Authorization
  v_role := app.production_actor_role(p_organization_id, p_actor_id);
  if v_role not in ('OWNER','ADMIN','OPERATIONS') then
    raise exception 'Not authorized to reassign production jobs';
  end if;

  -- 2. Find and cancel any active assignment
  select * into v_old_assign
  from app.production_assignments
  where production_job_id = p_job_id and status in ('ASSIGNED', 'ACCEPTED')
  for update;

  if found then
    perform app.cancel_production_assignment(
      p_organization_id,
      p_actor_id,
      v_old_assign.id,
      coalesce(p_reason, 'Reassigned to new executor')
    );
  end if;

  -- 3. Call assign_production_job for the new assignment
  v_new_assign_id := app.assign_production_job(
    p_organization_id,
    p_actor_id,
    p_job_id,
    p_executor_type,
    p_vendor_name,
    p_assigned_brand_id,
    p_assigned_cost,
    p_notes,
    p_vendor_id
  );

  return v_new_assign_id;
end; $$;

-- ============================================================================
-- 7. Coordinate transition_production_job_status with assignments (AC-04)
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
begin
  role_code := app.production_actor_role(p_organization_id, p_actor_id);
  if role_code not in ('OWNER','ADMIN','OPERATIONS','QC') then
    raise exception 'Not authorized to update production job status';
  end if;

  select * into job from app.production_jobs
  where id = p_job_id and organization_id = p_organization_id
  for update;

  if not found then
    raise exception 'Production job not found';
  end if;

  to_clean := upper(trim(coalesce(p_to_status, '')));

  if job.status = to_clean then
    return to_clean;
  end if;

  -- QC role can only advance jobs from AWAITING_QC to READY_FOR_HANDOFF, REWORK, or ON_HOLD
  if role_code = 'QC' and not (job.status = 'AWAITING_QC' and to_clean in ('READY_FOR_HANDOFF','REWORK','ON_HOLD')) then
    raise exception 'QC role may only transition jobs from AWAITING_QC to READY_FOR_HANDOFF, REWORK, or ON_HOLD';
  end if;

  -- State machine check
  case job.status
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
  end case;

  if not allowed then
    raise exception 'Invalid production job transition from % to %', job.status, to_clean;
  end if;

  -- Automatic coordination with active assignments (AC-04)
  if to_clean = 'ACCEPTED' and job.status = 'ASSIGNED' then
    select * into v_assign
    from app.production_assignments
    where production_job_id = job.id and status = 'ASSIGNED'
    for update;

    if found then
      update app.production_assignments
      set status = 'ACCEPTED',
          accepted_at = coalesce(accepted_at, now())
      where id = v_assign.id;
    end if;

  elsif to_clean = 'READY' and job.status = 'ASSIGNED' then
    select * into v_assign
    from app.production_assignments
    where production_job_id = job.id and status = 'ASSIGNED'
    for update;

    if found then
      update app.production_assignments
      set status = 'CANCELLED',
          notes = coalesce(notes || E'\n[Dibatalkan saat job kembali ke READY]', '[Dibatalkan saat job kembali ke READY]')
      where id = v_assign.id;
    end if;

  elsif to_clean = 'CANCELLED' then
    select * into v_assign
    from app.production_assignments
    where production_job_id = job.id and status in ('ASSIGNED', 'ACCEPTED')
    for update;

    if found then
      update app.production_assignments
      set status = 'CANCELLED',
          notes = coalesce(notes || E'\n[Dibatalkan karena job dibatalkan]', '[Dibatalkan karena job dibatalkan]')
      where id = v_assign.id;
    end if;
  end if;

  update app.production_jobs
  set status = to_clean,
      updated_at = now()
  where id = job.id;

  insert into app.production_job_audit (
    organization_id, production_job_id, actor_id, action, details
  ) values (
    p_organization_id, job.id, p_actor_id, 'job.status_transition',
    jsonb_build_object('from', job.status, 'to', to_clean, 'reason', p_reason)
  );

  return to_clean;
end; $$;

-- ============================================================================
-- 8. Permissions & Grants
-- ============================================================================
revoke all on function app.accept_production_assignment(uuid,uuid,uuid) from public,anon,authenticated,service_role;
revoke all on function app.decline_production_assignment(uuid,uuid,uuid,text) from public,anon,authenticated,service_role;
revoke all on function app.cancel_production_assignment(uuid,uuid,uuid,text) from public,anon,authenticated,service_role;
revoke all on function app.reassign_production_job(uuid,uuid,uuid,text,text,uuid,bigint,text,uuid,text) from public,anon,authenticated,service_role;

grant execute on function app.accept_production_assignment(uuid,uuid,uuid) to service_role;
grant execute on function app.decline_production_assignment(uuid,uuid,uuid,text) to service_role;
grant execute on function app.cancel_production_assignment(uuid,uuid,uuid,text) to service_role;
grant execute on function app.reassign_production_job(uuid,uuid,uuid,text,text,uuid,bigint,text,uuid,text) to service_role;

commit;
