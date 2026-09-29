begin;

-- ============================================================================
-- 1. Vendors Directory
-- ============================================================================
create table if not exists app.vendors (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references app.organizations(id) on delete restrict,
  code text not null,
  name text not null,
  category text not null check(category in ('GARMENT_SUPPLIER','PRINT_STUDIO','EMBROIDERY','PACKAGING','TRIMS_LABELS','LOGISTICS','OTHER')),
  contact_person text,
  phone text,
  email text,
  address text,
  lead_time_days integer not null default 3 check(lead_time_days >= 0),
  rating numeric(3,2) not null default 5.00 check(rating >= 0 and rating <= 5),
  status text not null default 'ACTIVE' check(status in ('ACTIVE','INACTIVE','SUSPENDED')),
  payment_terms text not null default 'COD' check(payment_terms in ('COD','NET_7','NET_14','NET_30','DP_50_50')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(organization_id, code)
);

create index if not exists idx_vendors_org_category on app.vendors(organization_id, category);
create index if not exists idx_vendors_status on app.vendors(organization_id, status);

-- ============================================================================
-- 2. Vendor Rate Cards
-- ============================================================================
create table if not exists app.vendor_rate_cards (
  id uuid primary key default gen_random_uuid(),
  vendor_id uuid not null references app.vendors(id) on delete cascade,
  service_code text not null,
  description text not null,
  unit text not null check(unit in ('meter','pcs','cm','sheet','roll','lot')),
  unit_cost bigint not null check(unit_cost >= 0),
  min_order_quantity integer not null default 1 check(min_order_quantity >= 1),
  is_active boolean not null default true,
  effective_date date not null default current_date,
  notes text,
  created_at timestamptz not null default now(),
  unique(vendor_id, service_code)
);

create index if not exists idx_rate_cards_vendor on app.vendor_rate_cards(vendor_id);

-- ============================================================================
-- 3. Enhance Production Assignments with Vendor Reference
-- ============================================================================
alter table app.production_assignments
  add column if not exists vendor_id uuid references app.vendors(id) on delete set null;

-- ============================================================================
-- 4. QC Inspections & Defect Tracking
-- ============================================================================
create table if not exists app.qc_inspections (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references app.organizations(id) on delete restrict,
  production_job_id uuid not null references app.production_jobs(id) on delete cascade,
  inspector_id uuid not null references app.users(id) on delete restrict,
  inspection_number text not null,
  result text not null check(result in ('PASS','REWORK','REJECTED')),
  sample_size integer not null default 1 check(sample_size >= 1),
  defect_count integer not null default 0 check(defect_count >= 0),
  defect_category text check(defect_category in ('FABRIC','PRINT_MISALIGNMENT','COLOR_SHIFT','ADHESION','SIZING','FINISHING_PACKAGING','OTHER')),
  defect_severity text check(defect_severity in ('MINOR','MAJOR','CRITICAL')),
  checklist_snapshot jsonb not null default '{}',
  rework_instructions text,
  notes text,
  inspected_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique(organization_id, inspection_number)
);

create index if not exists idx_qc_job on app.qc_inspections(production_job_id);
create index if not exists idx_qc_org on app.qc_inspections(organization_id, inspected_at desc);

-- ============================================================================
-- 5. Updated Production Job Status Transition with QC Role Support
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
-- 6. Stored Procedure: create_vendor
-- ============================================================================
create or replace function app.create_vendor(
  p_organization_id uuid,
  p_actor_id uuid,
  p_code text,
  p_name text,
  p_category text,
  p_contact_person text default null,
  p_phone text default null,
  p_email text default null,
  p_address text default null,
  p_lead_time_days integer default 3,
  p_payment_terms text default 'COD',
  p_notes text default null
) returns uuid language plpgsql security definer set search_path=app,pg_temp as $$
declare
  role_code text;
  v_id uuid := gen_random_uuid();
  code_clean text;
  name_clean text;
  cat_clean text;
  terms_clean text;
begin
  role_code := app.production_actor_role(p_organization_id, p_actor_id);
  if role_code not in ('OWNER','ADMIN','OPERATIONS') then
    raise exception 'Not authorized to manage vendors';
  end if;

  code_clean := upper(trim(coalesce(p_code, '')));
  name_clean := trim(coalesce(p_name, ''));
  cat_clean := upper(trim(coalesce(p_category, '')));
  terms_clean := upper(trim(coalesce(p_payment_terms, 'COD')));

  if length(code_clean) < 3 then
    raise exception 'Vendor code must be at least 3 characters';
  end if;

  if length(name_clean) < 2 then
    raise exception 'Vendor name must be at least 2 characters';
  end if;

  if cat_clean not in ('GARMENT_SUPPLIER','PRINT_STUDIO','EMBROIDERY','PACKAGING','TRIMS_LABELS','LOGISTICS','OTHER') then
    raise exception 'Invalid vendor category: %', cat_clean;
  end if;

  if terms_clean not in ('COD','NET_7','NET_14','NET_30','DP_50_50') then
    raise exception 'Invalid payment terms: %', terms_clean;
  end if;

  if p_lead_time_days < 0 then
    raise exception 'Lead time days cannot be negative';
  end if;

  insert into app.vendors (
    id, organization_id, code, name, category,
    contact_person, phone, email, address,
    lead_time_days, payment_terms, notes
  ) values (
    v_id, p_organization_id, code_clean, name_clean, cat_clean,
    p_contact_person, p_phone, p_email, p_address,
    coalesce(p_lead_time_days, 3), terms_clean, p_notes
  );

  return v_id;
end; $$;

-- ============================================================================
-- 7. Stored Procedure: upsert_vendor_rate_card
-- ============================================================================
create or replace function app.upsert_vendor_rate_card(
  p_organization_id uuid,
  p_actor_id uuid,
  p_vendor_id uuid,
  p_service_code text,
  p_description text,
  p_unit text,
  p_unit_cost bigint,
  p_min_order_quantity integer default 1,
  p_notes text default null
) returns uuid language plpgsql security definer set search_path=app,pg_temp as $$
declare
  role_code text;
  v app.vendors%rowtype;
  rc_id uuid;
  svc_clean text;
  unit_clean text;
begin
  role_code := app.production_actor_role(p_organization_id, p_actor_id);
  if role_code not in ('OWNER','ADMIN','OPERATIONS') then
    raise exception 'Not authorized to manage vendor rate cards';
  end if;

  select * into v from app.vendors
  where id = p_vendor_id and organization_id = p_organization_id;

  if not found then
    raise exception 'Vendor not found in organization';
  end if;

  svc_clean := upper(trim(coalesce(p_service_code, '')));
  unit_clean := lower(trim(coalesce(p_unit, '')));

  if length(svc_clean) < 2 then
    raise exception 'Service code must be at least 2 characters';
  end if;

  if length(trim(coalesce(p_description, ''))) < 3 then
    raise exception 'Description must be at least 3 characters';
  end if;

  if unit_clean not in ('meter','pcs','cm','sheet','roll','lot') then
    raise exception 'Invalid unit of measure: %', unit_clean;
  end if;

  if p_unit_cost < 0 then
    raise exception 'Unit cost cannot be negative';
  end if;

  if coalesce(p_min_order_quantity, 1) < 1 then
    raise exception 'Minimum order quantity must be at least 1';
  end if;

  insert into app.vendor_rate_cards (
    vendor_id, service_code, description, unit,
    unit_cost, min_order_quantity, notes
  ) values (
    p_vendor_id, svc_clean, trim(p_description), unit_clean,
    p_unit_cost, coalesce(p_min_order_quantity, 1), p_notes
  )
  on conflict (vendor_id, service_code) do update set
    description = excluded.description,
    unit = excluded.unit,
    unit_cost = excluded.unit_cost,
    min_order_quantity = excluded.min_order_quantity,
    notes = excluded.notes,
    is_active = true
  returning id into rc_id;

  return rc_id;
end; $$;

-- ============================================================================
-- 8. Stored Procedure: record_qc_inspection
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

  -- Insert QC inspection record
  insert into app.qc_inspections (
    id, organization_id, production_job_id, inspector_id,
    inspection_number, result, sample_size, defect_count,
    defect_category, defect_severity, checklist_snapshot,
    rework_instructions, notes, inspected_at
  ) values (
    inspection_id, p_organization_id, job.id, p_actor_id,
    qc_num, result_clean, coalesce(p_sample_size, 1), coalesce(p_defect_count, 0),
    cat_clean, sev_clean, coalesce(p_checklist_snapshot, '{}'::jsonb),
    p_rework_instructions, p_notes, now()
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
    'result', result_clean,
    'job_id', job.id
  );
end; $$;

commit;
