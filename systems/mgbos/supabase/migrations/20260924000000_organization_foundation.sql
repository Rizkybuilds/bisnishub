-- Migration: 20260924000000_organization_foundation.sql
-- Description: Core Organization, Brand, Business Line, Channel, and Role schema
-- Specification: MGBOS 0.2.1 Logical Data Model & MGBOS 0.5.4 (MGBOS-002)

-- 1. Organizations (Holding Level)
create table if not exists app.organizations (
    id uuid primary key default gen_random_uuid(),
    code text not null unique,
    legal_name text not null,
    display_name text not null,
    timezone text not null default 'Asia/Jakarta',
    base_currency char(3) not null default 'IDR',
    status text not null default 'ACTIVE' check (status in ('ACTIVE', 'INACTIVE', 'ARCHIVED')),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    archived_at timestamptz
);

-- 2. Brands (Operating Brands under Holding)
create table if not exists app.brands (
    id uuid primary key default gen_random_uuid(),
    organization_id uuid not null references app.organizations(id) on delete restrict,
    code text not null,
    name text not null,
    slug text not null,
    domain text,
    description text,
    status text not null default 'ACTIVE' check (status in ('ACTIVE', 'INACTIVE', 'ARCHIVED')),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    archived_at timestamptz,
    constraint uq_brands_org_code unique (organization_id, code),
    constraint uq_brands_org_slug unique (organization_id, slug)
);

-- 3. Business Lines (Service/Model Tiers per Brand)
create table if not exists app.business_lines (
    id uuid primary key default gen_random_uuid(),
    brand_id uuid not null references app.brands(id) on delete restrict,
    code text not null,
    name text not null,
    description text,
    status text not null default 'ACTIVE' check (status in ('ACTIVE', 'INACTIVE', 'ARCHIVED')),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    archived_at timestamptz,
    constraint uq_business_lines_brand_code unique (brand_id, code)
);

-- 4. Channels (Transaction Origination Channels - Group-wide)
create table if not exists app.channels (
    id uuid primary key default gen_random_uuid(),
    organization_id uuid not null references app.organizations(id) on delete restrict,
    code text not null,
    name text not null,
    channel_type text not null check (channel_type in ('MESSAGING', 'WEB', 'SOCIAL', 'DIRECT', 'MARKETPLACE', 'API')),
    status text not null default 'ACTIVE' check (status in ('ACTIVE', 'INACTIVE', 'ARCHIVED')),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    archived_at timestamptz,
    constraint uq_channels_org_code unique (organization_id, code)
);

-- 5. Roles (Organizational Authority Roles)
create table if not exists app.roles (
    id uuid primary key default gen_random_uuid(),
    organization_id uuid not null references app.organizations(id) on delete restrict,
    code text not null,
    name text not null,
    description text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    constraint uq_roles_org_code unique (organization_id, code)
);

-- Foreign Key Indexes for high-performance lookup
create index if not exists idx_brands_organization_id on app.brands(organization_id);
create index if not exists idx_business_lines_brand_id on app.business_lines(brand_id);
create index if not exists idx_channels_organization_id on app.channels(organization_id);
create index if not exists idx_roles_organization_id on app.roles(organization_id);

-- Enable Row Level Security (RLS) on all business tables
alter table app.organizations enable row level security;
alter table app.brands enable row level security;
alter table app.business_lines enable row level security;
alter table app.channels enable row level security;
alter table app.roles enable row level security;

-- Grants: Grant schema and table access to service_role (server-side authority)
grant usage on schema app to service_role;
grant all on all tables in schema app to service_role;
grant all on all sequences in schema app to service_role;
alter default privileges in schema app grant all on tables to service_role;
alter default privileges in schema app grant all on sequences to service_role;
