-- Migration: 20260924020000_document_sequences.sql
-- Description: Collision-safe, atomic document sequences schema and generator
-- Specification: MGBOS 0.2.1 Logical Data Model & MGBOS 0.5.4 (MGBOS-004)

-- 1. Document Sequences (Per-brand, per-type, per-year atomic counters)
create table if not exists app.document_sequences (
    id uuid primary key default gen_random_uuid(),
    organization_id uuid not null references app.organizations(id) on delete cascade,
    brand_id uuid not null references app.brands(id) on delete cascade,
    document_type text not null,
    year integer not null check (year >= 2020),
    last_number bigint not null default 0 check (last_number >= 0),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    constraint uq_document_sequences unique (organization_id, brand_id, document_type, year)
);

-- Index for high-frequency concurrent lookups
create index if not exists idx_document_sequences_lookup 
    on app.document_sequences (organization_id, brand_id, document_type, year);

-- Enable Row Level Security (RLS)
alter table app.document_sequences enable row level security;

-- RLS Policies
create policy "Allow service_role full access to document_sequences"
    on app.document_sequences
    for all
    to service_role
    using (true)
    with check (true);

create policy "Allow organization members to view document sequences"
    on app.document_sequences
    for select
    to authenticated
    using (
        exists (
            select 1 from app.organization_members om
            join app.users u on u.id = om.user_id
            where om.organization_id = document_sequences.organization_id
              and u.auth_user_id = auth.uid()
              and om.status = 'ACTIVE'
        )
    );

-- 2. Atomic Sequence Generator Function
create or replace function app.next_document_sequence(
    p_organization_id uuid,
    p_brand_id uuid,
    p_document_type text,
    p_year integer default extract(year from now())::integer
) returns bigint
language plpgsql
security definer
set search_path = app, public
as $$
declare
    v_next bigint;
    v_clean_type text;
begin
    v_clean_type := upper(trim(p_document_type));
    if length(v_clean_type) = 0 then
        raise exception 'Document type cannot be empty';
    end if;

    insert into app.document_sequences (organization_id, brand_id, document_type, year, last_number, updated_at)
    values (p_organization_id, p_brand_id, v_clean_type, p_year, 1, now())
    on conflict (organization_id, brand_id, document_type, year)
    do update set
        last_number = app.document_sequences.last_number + 1,
        updated_at = now()
    returning last_number into v_next;

    return v_next;
end;
$$;

-- 3. Formatted Document Number Generator Function ({BRAND}-{TYPE}-{YEAR}-{SEQUENCE})
create or replace function app.generate_document_number(
    p_organization_id uuid,
    p_brand_id uuid,
    p_document_type text,
    p_year integer default extract(year from now())::integer,
    p_pad_length integer default 6
) returns text
language plpgsql
security definer
set search_path = app, public
as $$
declare
    v_brand_code text;
    v_seq bigint;
    v_clean_type text;
begin
    v_clean_type := upper(trim(p_document_type));
    if length(v_clean_type) = 0 then
        raise exception 'Document type cannot be empty';
    end if;

    select code into v_brand_code
    from app.brands
    where id = p_brand_id and organization_id = p_organization_id;

    if not found then
        raise exception 'Brand % not found in organization %', p_brand_id, p_organization_id;
    end if;

    v_seq := app.next_document_sequence(p_organization_id, p_brand_id, v_clean_type, p_year);

    return format('%s-%s-%s-%s', upper(v_brand_code), v_clean_type, p_year, lpad(v_seq::text, p_pad_length, '0'));
end;
$$;

-- Privileges & Grants
grant all on app.document_sequences to service_role;
grant execute on function app.next_document_sequence to authenticated, service_role;
grant execute on function app.generate_document_number to authenticated, service_role;
