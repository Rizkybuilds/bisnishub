begin;

-- 1. Tables for Production Domain
create table if not exists app.production_jobs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references app.organizations(id) on delete restrict,
  brand_id uuid not null references app.brands(id) on delete restrict,
  order_id uuid not null references app.orders(id) on delete restrict,
  job_number text not null,
  job_type text not null check(job_type in ('GARMENT','PRINTING','EMBROIDERY','PACKAGING','LABEL','FINISHING','OTHER')),
  title text not null,
  status text not null default 'PLANNED' check(status in ('PLANNED','READY','ASSIGNED','ACCEPTED','IN_PRODUCTION','AWAITING_QC','REWORK','READY_FOR_HANDOFF','COMPLETED','ON_HOLD','CANCELLED')),
  priority text not null default 'NORMAL' check(priority in ('LOW','NORMAL','HIGH','URGENT')),
  target_completion_date date,
  estimated_cost bigint not null default 0 check(estimated_cost >= 0),
  committed_cost bigint check(committed_cost >= 0),
  actual_cost bigint check(actual_cost >= 0),
  currency text not null default 'IDR' check(currency='IDR'),
  specification jsonb not null default '{}',
  notes text,
  created_by_user_id uuid not null references app.users(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(organization_id, job_number)
);

create table if not exists app.production_job_items (
  id uuid primary key default gen_random_uuid(),
  production_job_id uuid not null references app.production_jobs(id) on delete cascade,
  order_item_id uuid not null references app.order_items(id) on delete restrict,
  quantity integer not null check(quantity > 0),
  notes text,
  created_at timestamptz not null default now(),
  unique(production_job_id, order_item_id)
);

create table if not exists app.production_assignments (
  id uuid primary key default gen_random_uuid(),
  production_job_id uuid not null references app.production_jobs(id) on delete cascade,
  executor_type text not null check(executor_type in ('INTERNAL','VENDOR')),
  assigned_brand_id uuid references app.brands(id) on delete restrict,
  vendor_name text,
  assigned_cost bigint check(assigned_cost >= 0),
  status text not null default 'ASSIGNED' check(status in ('ASSIGNED','ACCEPTED','DECLINED','CANCELLED')),
  assigned_at timestamptz not null default now(),
  accepted_at timestamptz,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists app.production_job_audit (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references app.organizations(id) on delete restrict,
  production_job_id uuid not null references app.production_jobs(id) on delete cascade,
  actor_id uuid not null references app.users(id) on delete restrict,
  action text not null,
  details jsonb not null default '{}',
  created_at timestamptz not null default now()
);

-- Indexes
create index if not exists idx_production_jobs_order on app.production_jobs(order_id);
create index if not exists idx_production_jobs_org_brand on app.production_jobs(organization_id, brand_id, status);
create index if not exists idx_production_job_items_job on app.production_job_items(production_job_id);
create index if not exists idx_production_assignments_job on app.production_assignments(production_job_id);
create index if not exists idx_production_audit_job on app.production_job_audit(production_job_id, created_at);

-- 2. Role Check Helper
create or replace function app.production_actor_role(p_org uuid, p_actor uuid) returns text language plpgsql security definer set search_path=app,pg_temp as $$
declare result text;
begin
 select r.code into result from app.organization_members m
 join app.users u on u.id=m.user_id and u.status='ACTIVE'
 join app.organizations o on o.id=m.organization_id and o.status='ACTIVE'
 join app.roles r on r.id=m.role_id and r.organization_id=m.organization_id
 where m.organization_id=p_org and m.user_id=p_actor and m.status='ACTIVE';
 if result is null then raise exception 'Active organization membership required'; end if;
 return result;
end; $$;

-- 3. Procedure: create_production_job
create or replace function app.create_production_job(
  p_organization_id uuid,
  p_actor_id uuid,
  p_order_id uuid,
  p_job_type text,
  p_title text,
  p_estimated_cost bigint default 0,
  p_specification jsonb default '{}',
  p_items jsonb default '[]',
  p_priority text default 'NORMAL',
  p_target_date date default null,
  p_notes text default null
) returns jsonb language plpgsql security definer set search_path=app,pg_temp as $$
declare
  role_code text;
  ord app.orders%rowtype;
  job_id uuid := gen_random_uuid();
  job_num text;
  it jsonb;
  item_rec app.order_items%rowtype;
  job_type_clean text;
  priority_clean text;
begin
  role_code := app.production_actor_role(p_organization_id, p_actor_id);
  if role_code not in ('OWNER','ADMIN','OPERATIONS') then
    raise exception 'Not authorized to create production jobs';
  end if;

  select * into ord from app.orders
  where id = p_order_id and organization_id = p_organization_id;
  if not found then
    raise exception 'Order not found in this organization';
  end if;

  if ord.status = 'CANCELLED' then
    raise exception 'Cannot create production jobs for a cancelled order';
  end if;

  job_type_clean := upper(trim(coalesce(p_job_type, '')));
  if job_type_clean not in ('GARMENT','PRINTING','EMBROIDERY','PACKAGING','LABEL','FINISHING','OTHER') then
    raise exception 'Invalid job type';
  end if;

  priority_clean := upper(trim(coalesce(p_priority, 'NORMAL')));
  if priority_clean not in ('LOW','NORMAL','HIGH','URGENT') then
    raise exception 'Invalid priority';
  end if;

  if coalesce(length(trim(p_title)), 0) < 3 then
    raise exception 'Job title must be at least 3 characters';
  end if;

  if p_estimated_cost < 0 then
    raise exception 'Estimated cost cannot be negative';
  end if;

  -- Generate document number (TS-J-2026-000001)
  job_num := app.generate_document_number(p_organization_id, ord.brand_id, 'J', extract(year from now())::integer, 6);

  insert into app.production_jobs (
    id, organization_id, brand_id, order_id, job_number,
    job_type, title, status, priority, target_completion_date,
    estimated_cost, specification, notes, created_by_user_id
  ) values (
    job_id, p_organization_id, ord.brand_id, ord.id, job_num,
    job_type_clean, trim(p_title), 'PLANNED', priority_clean, p_target_date,
    p_estimated_cost, coalesce(p_specification, '{}'::jsonb), p_notes, p_actor_id
  );

  -- Link order items
  if p_items is not null and jsonb_typeof(p_items) = 'array' then
    for it in select * from jsonb_array_elements(p_items) loop
      select * into item_rec from app.order_items
      where id = (it->>'order_item_id')::uuid and order_id = ord.id;
      if not found then
        raise exception 'Order item does not belong to specified order';
      end if;

      insert into app.production_job_items (
        production_job_id, order_item_id, quantity, notes
      ) values (
        job_id, item_rec.id, (it->>'quantity')::integer, it->>'notes'
      );
    end loop;
  end if;

  -- Record audit
  insert into app.production_job_audit (
    organization_id, production_job_id, actor_id, action, details
  ) values (
    p_organization_id, job_id, p_actor_id, 'job.created',
    jsonb_build_object('job_number', job_num, 'job_type', job_type_clean, 'order_number', ord.order_number)
  );

  return jsonb_build_object('job_id', job_id, 'job_number', job_num);
end; $$;

-- 4. Procedure: transition_production_job_status
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
begin
  role_code := app.production_actor_role(p_organization_id, p_actor_id);
  if role_code not in ('OWNER','ADMIN','OPERATIONS') then
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

  update app.production_jobs
  set status = to_clean,
      updated_at = now()
  where id = job.id;

  insert into app.production_job_audit (
    organization_id, production_job_id, actor_id, action, details
  ) values (
    p_organization_id, job.id, p_actor_id, 'job.status_transition',
    jsonb_build_object('from_status', job.status, 'to_status', to_clean, 'reason', p_reason)
  );

  return to_clean;
end; $$;

-- 5. Procedure: assign_production_job
create or replace function app.assign_production_job(
  p_organization_id uuid,
  p_actor_id uuid,
  p_job_id uuid,
  p_executor_type text,
  p_vendor_name text default null,
  p_assigned_brand_id uuid default null,
  p_assigned_cost bigint default 0,
  p_notes text default null
) returns uuid language plpgsql security definer set search_path=app,pg_temp as $$
declare
  role_code text;
  job app.production_jobs%rowtype;
  assign_id uuid := gen_random_uuid();
  exec_type_clean text;
begin
  role_code := app.production_actor_role(p_organization_id, p_actor_id);
  if role_code not in ('OWNER','ADMIN','OPERATIONS') then
    raise exception 'Not authorized to assign production jobs';
  end if;

  select * into job from app.production_jobs
  where id = p_job_id and organization_id = p_organization_id
  for update;

  if not found then
    raise exception 'Production job not found';
  end if;

  if job.status not in ('PLANNED','READY','ASSIGNED') then
    raise exception 'Can only assign job in PLANNED or READY status';
  end if;

  exec_type_clean := upper(trim(coalesce(p_executor_type, '')));
  if exec_type_clean not in ('INTERNAL','VENDOR') then
    raise exception 'Executor type must be INTERNAL or VENDOR';
  end if;

  if exec_type_clean = 'INTERNAL' and p_assigned_brand_id is null then
    raise exception 'Assigned brand required for internal execution';
  end if;

  if exec_type_clean = 'VENDOR' and coalesce(length(trim(p_vendor_name)), 0) < 2 then
    raise exception 'Vendor name required for external vendor execution';
  end if;

  if p_assigned_cost < 0 then
    raise exception 'Assigned cost cannot be negative';
  end if;

  insert into app.production_assignments (
    id, production_job_id, executor_type, assigned_brand_id,
    vendor_name, assigned_cost, status, notes
  ) values (
    assign_id, job.id, exec_type_clean, p_assigned_brand_id,
    trim(p_vendor_name), p_assigned_cost, 'ASSIGNED', p_notes
  );

  update app.production_jobs
  set status = 'ASSIGNED',
      committed_cost = p_assigned_cost,
      updated_at = now()
  where id = job.id;

  insert into app.production_job_audit (
    organization_id, production_job_id, actor_id, action, details
  ) values (
    p_organization_id, job.id, p_actor_id, 'job.assigned',
    jsonb_build_object('assignment_id', assign_id, 'executor_type', exec_type_clean, 'cost', p_assigned_cost)
  );

  return assign_id;
end; $$;

-- 6. Permissions & RLS
do $$ declare tbl text; begin
  foreach tbl in array array['production_jobs','production_job_items','production_assignments','production_job_audit'] loop
    execute format('alter table app.%I enable row level security', tbl);
    execute format('revoke all on app.%I from public,anon,authenticated,service_role', tbl);
    execute format('grant select on app.%I to service_role', tbl);
  end loop;
end; $$;

revoke all on function app.production_actor_role(uuid,uuid), app.create_production_job(uuid,uuid,uuid,text,text,bigint,jsonb,jsonb,text,date,text), app.transition_production_job_status(uuid,uuid,uuid,text,text), app.assign_production_job(uuid,uuid,uuid,text,text,uuid,bigint,text) from public,anon,authenticated,service_role;
grant execute on function app.create_production_job(uuid,uuid,uuid,text,text,bigint,jsonb,jsonb,text,date,text), app.transition_production_job_status(uuid,uuid,uuid,text,text), app.assign_production_job(uuid,uuid,uuid,text,text,uuid,bigint,text) to service_role;

commit;
