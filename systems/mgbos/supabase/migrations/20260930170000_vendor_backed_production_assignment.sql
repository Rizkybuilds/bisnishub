-- Migration: 20260930170000_vendor_backed_production_assignment.sql
-- Description: MGBOS Phase 1 P0-03 Vendor-Backed Production Assignment
-- Specification: MultiGraph Business OS — Sprint 4 / Sprint 13 Evolution / Backlog P0-03
--
-- Enables canonical vendor-backed assignment:
--   - assign_production_job accepts p_vendor_id uuid
--   - validates vendor exists in active organization
--   - validates vendor is ACTIVE (AC-03, AC-04, AC-05)
--   - persists vendor_id on app.production_assignments (AC-02)
--   - preserves vendor_name as immutable historical snapshot (AC-09)
--   - preserves internal assignment compatibility (AC-06)
--   - preserves committed_cost on production_jobs (AC-07)

begin;

-- 1. Drop previous 8-parameter function signature to prevent overload ambiguity
drop function if exists app.assign_production_job(uuid,uuid,uuid,text,text,uuid,bigint,text);

-- 2. Create evolved 9-parameter function signature accepting p_vendor_id
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

  -- 3. Validate executor type
  exec_type_clean := upper(trim(coalesce(p_executor_type, '')));
  if exec_type_clean not in ('INTERNAL','VENDOR') then
    raise exception 'Executor type must be INTERNAL or VENDOR';
  end if;

  -- 4. Validate internal vs vendor executor (AC-03, AC-04, AC-05, AC-06)
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
      -- Canonical vendor directory lookup (AC-01, AC-04, AC-05)
      select * into v_vendor
      from app.vendors
      where id = p_vendor_id and organization_id = p_organization_id;

      if not found then
        raise exception 'Vendor not found in organization';
      end if;

      -- Inactive vendor guard (AC-03)
      if v_vendor.status <> 'ACTIVE' then
        raise exception 'Vendor % is not ACTIVE (status: %)', v_vendor.name, v_vendor.status;
      end if;

      v_vendor_id := v_vendor.id;
      -- Preserve vendor_name as historical snapshot (AC-09)
      v_vendor_name := coalesce(nullif(trim(p_vendor_name), ''), v_vendor.name);
    else
      -- Fallback text vendor for backwards compatibility
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

  -- 6. Insert production assignment (AC-02, AC-07, AC-09)
  insert into app.production_assignments (
    id, production_job_id, executor_type, assigned_brand_id,
    vendor_id, vendor_name, assigned_cost, status, notes
  ) values (
    assign_id, job.id, exec_type_clean, p_assigned_brand_id,
    v_vendor_id, v_vendor_name, p_assigned_cost, 'ASSIGNED', p_notes
  );

  -- 7. Update production job status & committed cost (AC-07)
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
      'cost', p_assigned_cost,
      'vendor_id', v_vendor_id,
      'vendor_name', v_vendor_name,
      'assigned_brand_id', p_assigned_brand_id
    )
  );

  return assign_id;
end; $$;

-- 3. Permissions & Grants
revoke all on function app.assign_production_job(uuid,uuid,uuid,text,text,uuid,bigint,text,uuid) from public,anon,authenticated,service_role;
grant execute on function app.assign_production_job(uuid,uuid,uuid,text,text,uuid,bigint,text,uuid) to service_role;

commit;
