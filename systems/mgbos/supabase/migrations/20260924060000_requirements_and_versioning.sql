-- Migration: 20260924060000_requirements_and_versioning.sql
-- Description: Requirement Aggregate and Immutable Versioning Engine schema
-- Specification: MGBOS 0.2.1 Logical Data Model & MGBOS 0.3 Business State Machines (MGBOS-007)

-- 1. Requirements Parent Table
create table if not exists app.requirements (
    id uuid primary key default gen_random_uuid(),
    organization_id uuid not null references app.organizations(id) on delete restrict,
    brand_id uuid not null references app.brands(id) on delete restrict,
    lead_id uuid references app.leads(id) on delete set null,
    customer_account_id uuid references app.customer_accounts(id) on delete set null,
    requirement_number text not null,
    title text not null,
    status text not null default 'DRAFT' check (status in ('DRAFT', 'NEEDS_INFORMATION', 'READY', 'LOCKED', 'CANCELLED')),
    current_version_id uuid, -- Foreign key defined below after version table exists
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    archived_at timestamptz,
    constraint uq_requirements_org_req_number unique (organization_id, requirement_number)
);

-- 2. Requirement Versions Table (Immutable Snapshots)
create table if not exists app.requirement_versions (
    id uuid primary key default gen_random_uuid(),
    requirement_id uuid not null references app.requirements(id) on delete cascade,
    version_number integer not null check (version_number >= 1),
    summary text not null,
    quantity integer check (quantity is null or quantity > 0),
    unit text not null default 'PCS',
    target_budget bigint check (target_budget is null or target_budget >= 0),
    currency char(3) not null default 'IDR',
    target_date date,
    specification jsonb not null default '{}'::jsonb,
    completeness_score integer check (completeness_score is null or (completeness_score >= 0 and completeness_score <= 100)),
    is_locked boolean not null default false,
    locked_at timestamptz,
    locked_reason text,
    created_by_user_id uuid references app.users(id) on delete set null,
    created_at timestamptz not null default now(),
    constraint uq_requirement_versions unique (requirement_id, version_number)
);

-- Add Foreign Key from requirements.current_version_id to requirement_versions.id
alter table app.requirements 
    drop constraint if exists fk_requirements_current_version;
alter table app.requirements 
    add constraint fk_requirements_current_version 
    foreign key (current_version_id) 
    references app.requirement_versions(id) 
    on delete set null;

-- 3. Indexes for Search & Lookups
create index if not exists idx_requirements_org_brand_status 
    on app.requirements (organization_id, brand_id, status);
create index if not exists idx_requirements_lead_id 
    on app.requirements (lead_id);
create index if not exists idx_requirements_customer_id 
    on app.requirements (customer_account_id);
create index if not exists idx_requirements_number 
    on app.requirements (requirement_number);
create index if not exists idx_requirement_versions_lookup 
    on app.requirement_versions (requirement_id, version_number desc);

-- 4. Automatic Canonical Requirement Number Generator Trigger
create or replace function app.trg_requirements_generate_number()
returns trigger
language plpgsql
security definer
set search_path = app, public
as $$
begin
    if NEW.requirement_number is null or trim(NEW.requirement_number) = '' then
        NEW.requirement_number := app.generate_document_number(
            NEW.organization_id,
            NEW.brand_id,
            'REQ',
            extract(year from coalesce(NEW.created_at, now()))::integer,
            6
        );
    end if;
    return NEW;
end;
$$;

drop trigger if exists trg_requirements_before_insert on app.requirements;
create trigger trg_requirements_before_insert
    before insert on app.requirements
    for each row
    execute function app.trg_requirements_generate_number();

-- 5. Immutability Trigger for Requirement Versions
create or replace function app.trg_requirement_version_immutability()
returns trigger
language plpgsql
security definer
set search_path = app, public
as $$
begin
    if TG_OP = 'UPDATE' then
        -- Locked versions cannot be modified under any circumstances
        if OLD.is_locked and (
            NEW.summary <> OLD.summary or
            NEW.quantity is distinct from OLD.quantity or
            NEW.unit <> OLD.unit or
            NEW.target_budget is distinct from OLD.target_budget or
            NEW.target_date is distinct from OLD.target_date or
            NEW.specification <> OLD.specification
        ) then
            raise exception 'Cannot modify locked requirement version (immutable commercial snapshot)';
        end if;

        -- Core version identity (requirement_id, version_number) is permanently immutable
        if NEW.requirement_id <> OLD.requirement_id or NEW.version_number <> OLD.version_number then
            raise exception 'Requirement version identity (requirement_id, version_number) is immutable';
        end if;
    elsif TG_OP = 'DELETE' then
        if OLD.is_locked then
            raise exception 'Cannot delete locked requirement version (immutable commercial snapshot)';
        end if;
    end if;
    return NEW;
end;
$$;

drop trigger if exists trg_requirement_versions_immutable on app.requirement_versions;
create trigger trg_requirement_versions_immutable
    before update or delete on app.requirement_versions
    for each row
    execute function app.trg_requirement_version_immutability();

-- 6. Enable Row Level Security (RLS)
alter table app.requirements enable row level security;
alter table app.requirement_versions enable row level security;

-- 6.1 Service Role full access
create policy "Allow service_role full access to requirements"
    on app.requirements for all to service_role using (true) with check (true);
create policy "Allow service_role full access to requirement_versions"
    on app.requirement_versions for all to service_role using (true) with check (true);

-- 6.2 Organization members access
create policy "Allow org members to view requirements"
    on app.requirements for select to authenticated
    using (
        exists (
            select 1 from app.organization_members om
            join app.users u on u.id = om.user_id
            where om.organization_id = requirements.organization_id
              and u.auth_user_id = auth.uid()
              and om.status = 'ACTIVE'
        )
    );

create policy "Allow org members to view requirement versions"
    on app.requirement_versions for select to authenticated
    using (
        exists (
            select 1 from app.requirements r
            join app.organization_members om on om.organization_id = r.organization_id
            join app.users u on u.id = om.user_id
            where r.id = requirement_versions.requirement_id
              and u.auth_user_id = auth.uid()
              and om.status = 'ACTIVE'
        )
    );

-- 7. Atomic Stored Procedure: Create Requirement with Initial Version (v1)
create or replace function app.create_requirement_with_initial_version(
    p_organization_id uuid,
    p_brand_id uuid,
    p_title text,
    p_summary text,
    p_quantity integer default null,
    p_unit text default 'PCS',
    p_target_budget bigint default null,
    p_target_date date default null,
    p_specification jsonb default '{}'::jsonb,
    p_lead_id uuid default null,
    p_customer_account_id uuid default null,
    p_actor_id uuid default null
) returns jsonb
language plpgsql
security definer
set search_path = app, public
as $$
declare
    v_req_id uuid;
    v_ver_id uuid;
    v_req_number text;
    v_actor_role text;
    v_clean_title text := trim(p_title);
    v_clean_summary text := trim(p_summary);
begin
    -- 1. Authority validation
    if p_actor_id is not null then
        select r.code into v_actor_role
        from app.organization_members om
        join app.roles r on om.role_id = r.id
        where om.user_id = p_actor_id and om.organization_id = p_organization_id and om.status = 'ACTIVE';

        if v_actor_role is null then
            raise exception 'Actor % does not have active membership in organization %', p_actor_id, p_organization_id;
        end if;

        if v_actor_role not in ('OWNER', 'ADMIN', 'SALES') then
            raise exception 'Unauthorized: role % cannot create requirements', v_actor_role;
        end if;
    end if;

    if length(v_clean_title) = 0 then
        raise exception 'Title cannot be empty';
    end if;
    if length(v_clean_summary) = 0 then
        raise exception 'Version summary cannot be empty';
    end if;

    -- 2. Insert parent requirement
    insert into app.requirements (
        organization_id,
        brand_id,
        lead_id,
        customer_account_id,
        requirement_number,
        title,
        status
    ) values (
        p_organization_id,
        p_brand_id,
        p_lead_id,
        p_customer_account_id,
        '', -- Trigger will generate canonical requirement_number
        v_clean_title,
        'DRAFT'
    ) returning id, requirement_number into v_req_id, v_req_number;

    -- 3. Insert initial version (v1)
    insert into app.requirement_versions (
        requirement_id,
        version_number,
        summary,
        quantity,
        unit,
        target_budget,
        currency,
        target_date,
        specification,
        created_by_user_id
    ) values (
        v_req_id,
        1,
        v_clean_summary,
        p_quantity,
        coalesce(trim(p_unit), 'PCS'),
        p_target_budget,
        'IDR',
        p_target_date,
        coalesce(p_specification, '{}'::jsonb),
        p_actor_id
    ) returning id into v_ver_id;

    -- 4. Link current_version_id back to parent
    update app.requirements
    set current_version_id = v_ver_id
    where id = v_req_id;

    return jsonb_build_object(
        'success', true,
        'requirement_id', v_req_id,
        'requirement_number', v_req_number,
        'version_id', v_ver_id,
        'version_number', 1
    );
end;
$$;

-- 8. Atomic Stored Procedure: Create New Immutable Requirement Version (v2, v3, ...)
create or replace function app.create_new_requirement_version(
    p_organization_id uuid,
    p_requirement_id uuid,
    p_summary text,
    p_quantity integer default null,
    p_unit text default 'PCS',
    p_target_budget bigint default null,
    p_target_date date default null,
    p_specification jsonb default '{}'::jsonb,
    p_actor_id uuid default null
) returns jsonb
language plpgsql
security definer
set search_path = app, public
as $$
declare
    v_req app.requirements%rowtype;
    v_next_version integer;
    v_ver_id uuid;
    v_actor_role text;
    v_clean_summary text := trim(p_summary);
begin
    -- 1. Authority validation
    if p_actor_id is not null then
        select r.code into v_actor_role
        from app.organization_members om
        join app.roles r on om.role_id = r.id
        where om.user_id = p_actor_id and om.organization_id = p_organization_id and om.status = 'ACTIVE';

        if v_actor_role is null then
            raise exception 'Actor % does not have active membership in organization %', p_actor_id, p_organization_id;
        end if;

        if v_actor_role not in ('OWNER', 'ADMIN', 'SALES', 'OPERATIONS') then
            raise exception 'Unauthorized: role % cannot create requirement versions', v_actor_role;
        end if;
    end if;

    if length(v_clean_summary) = 0 then
        raise exception 'Version summary cannot be empty';
    end if;

    -- 2. Lock parent requirement row FOR UPDATE
    select * into v_req
    from app.requirements
    where id = p_requirement_id and organization_id = p_organization_id
    for update;

    if not found then
        raise exception 'Requirement not found or access denied';
    end if;

    if v_req.status = 'CANCELLED' then
        raise exception 'Cannot add new version to CANCELLED requirement';
    end if;

    -- 3. Calculate next version number atomically
    select coalesce(max(version_number), 0) + 1 into v_next_version
    from app.requirement_versions
    where requirement_id = p_requirement_id;

    -- 4. Insert new immutable version
    insert into app.requirement_versions (
        requirement_id,
        version_number,
        summary,
        quantity,
        unit,
        target_budget,
        currency,
        target_date,
        specification,
        created_by_user_id
    ) values (
        p_requirement_id,
        v_next_version,
        v_clean_summary,
        p_quantity,
        coalesce(trim(p_unit), 'PCS'),
        p_target_budget,
        'IDR',
        p_target_date,
        coalesce(p_specification, '{}'::jsonb),
        p_actor_id
    ) returning id into v_ver_id;

    -- 5. Update parent requirement pointer & refresh status if it was locked
    update app.requirements
    set
        current_version_id = v_ver_id,
        status = case when status = 'LOCKED' then 'READY' else status end,
        updated_at = now()
    where id = p_requirement_id;

    return jsonb_build_object(
        'success', true,
        'requirement_id', p_requirement_id,
        'version_id', v_ver_id,
        'version_number', v_next_version
    );
end;
$$;

-- 9. Atomic Stored Procedure: Lock Requirement Version
create or replace function app.lock_requirement_version(
    p_organization_id uuid,
    p_version_id uuid,
    p_reason text,
    p_actor_id uuid default null
) returns jsonb
language plpgsql
security definer
set search_path = app, public
as $$
declare
    v_ver app.requirement_versions%rowtype;
    v_req app.requirements%rowtype;
    v_actor_role text;
    v_clean_reason text := trim(p_reason);
begin
    -- 1. Authority validation
    if p_actor_id is not null then
        select r.code into v_actor_role
        from app.organization_members om
        join app.roles r on om.role_id = r.id
        where om.user_id = p_actor_id and om.organization_id = p_organization_id and om.status = 'ACTIVE';

        if v_actor_role is null then
            raise exception 'Actor % does not have active membership in organization %', p_actor_id, p_organization_id;
        end if;

        if v_actor_role not in ('OWNER', 'ADMIN', 'SALES') then
            raise exception 'Unauthorized: role % cannot lock requirement versions', v_actor_role;
        end if;
    end if;

    if length(v_clean_reason) = 0 then
        raise exception 'Lock reason cannot be empty';
    end if;

    -- 2. Select and lock version
    select * into v_ver
    from app.requirement_versions
    where id = p_version_id
    for update;

    if not found then
        raise exception 'Requirement version not found';
    end if;

    -- Verify organization ownership
    select * into v_req
    from app.requirements
    where id = v_ver.requirement_id and organization_id = p_organization_id
    for update;

    if not found then
        raise exception 'Requirement does not belong to specified organization';
    end if;

    -- 3. Lock version
    update app.requirement_versions
    set
        is_locked = true,
        locked_at = now(),
        locked_reason = v_clean_reason
    where id = p_version_id;

    -- 4. Update parent status to LOCKED
    update app.requirements
    set
        status = 'LOCKED',
        updated_at = now()
    where id = v_req.id;

    return jsonb_build_object(
        'success', true,
        'requirement_id', v_req.id,
        'version_id', p_version_id,
        'is_locked', true
    );
end;
$$;

-- 10. Atomic Stored Procedure: Transition Requirement Status
create or replace function app.transition_requirement_status(
    p_organization_id uuid,
    p_requirement_id uuid,
    p_target_status text,
    p_actor_id uuid default null
) returns app.requirements
language plpgsql
security definer
set search_path = app, public
as $$
declare
    v_req app.requirements%rowtype;
    v_target text := upper(trim(p_target_status));
    v_actor_role text;
begin
    -- 1. Authority validation
    if p_actor_id is not null then
        select r.code into v_actor_role
        from app.organization_members om
        join app.roles r on om.role_id = r.id
        where om.user_id = p_actor_id and om.organization_id = p_organization_id and om.status = 'ACTIVE';

        if v_actor_role is null then
            raise exception 'Actor % does not have active membership in organization %', p_actor_id, p_organization_id;
        end if;

        if v_actor_role not in ('OWNER', 'ADMIN', 'SALES') then
            raise exception 'Unauthorized: role % cannot transition requirement status', v_actor_role;
        end if;
    end if;

    -- 2. Lock requirement row
    select * into v_req
    from app.requirements
    where id = p_requirement_id and organization_id = p_organization_id
    for update;

    if not found then
        raise exception 'Requirement not found or access denied';
    end if;

    if v_req.status = v_target then
        return v_req;
    end if;

    -- 3. State machine validation
    -- DRAFT -> NEEDS_INFORMATION, READY, CANCELLED
    -- NEEDS_INFORMATION -> DRAFT, READY, CANCELLED
    -- READY -> NEEDS_INFORMATION, LOCKED, CANCELLED
    -- LOCKED -> CANCELLED
    -- CANCELLED -> (Terminal)
    if v_req.status = 'DRAFT' and v_target not in ('NEEDS_INFORMATION', 'READY', 'CANCELLED') then
        raise exception 'Invalid transition from DRAFT to %', v_target;
    elsif v_req.status = 'NEEDS_INFORMATION' and v_target not in ('DRAFT', 'READY', 'CANCELLED') then
        raise exception 'Invalid transition from NEEDS_INFORMATION to %', v_target;
    elsif v_req.status = 'READY' and v_target not in ('NEEDS_INFORMATION', 'LOCKED', 'CANCELLED') then
        raise exception 'Invalid transition from READY to %', v_target;
    elsif v_req.status = 'LOCKED' and v_target <> 'CANCELLED' then
        raise exception 'Cannot transition LOCKED requirement except to CANCELLED; create a new version instead';
    elsif v_req.status = 'CANCELLED' then
        raise exception 'Cannot transition CANCELLED requirement (terminal state)';
    end if;

    -- Update requirement status
    update app.requirements
    set
        status = v_target,
        updated_at = now()
    where id = p_requirement_id
    returning * into v_req;

    return v_req;
end;
$$;

-- Grant execution privileges to service_role
grant execute on function app.create_requirement_with_initial_version to service_role;
grant execute on function app.create_new_requirement_version to service_role;
grant execute on function app.lock_requirement_version to service_role;
grant execute on function app.transition_requirement_status to service_role;
