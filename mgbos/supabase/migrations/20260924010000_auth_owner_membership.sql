-- Migration: 20260924010000_auth_owner_membership.sql
-- Description: Users and Organization Memberships schema
-- Specification: MGBOS 0.2.1 Logical Data Model & MGBOS 0.5.4 (MGBOS-003)

-- 1. Users (Business Profile linked to Supabase Auth)
create table if not exists app.users (
    id uuid primary key default gen_random_uuid(),
    auth_user_id uuid unique references auth.users(id) on delete set null,
    name text not null,
    email text not null unique,
    phone text,
    status text not null default 'ACTIVE' check (status in ('ACTIVE', 'INACTIVE', 'SUSPENDED')),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    archived_at timestamptz
);

-- 2. Organization Members (Multi-tenant membership linking users to organizations with roles)
create table if not exists app.organization_members (
    id uuid primary key default gen_random_uuid(),
    organization_id uuid not null references app.organizations(id) on delete cascade,
    user_id uuid not null references app.users(id) on delete cascade,
    role_id uuid not null references app.roles(id) on delete restrict,
    status text not null default 'ACTIVE' check (status in ('ACTIVE', 'INACTIVE', 'INVITED')),
    joined_at timestamptz not null default now(),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    archived_at timestamptz,
    constraint uq_org_members_org_user unique (organization_id, user_id)
);

-- Foreign Key Indexes for high-performance lookup
create index if not exists idx_users_auth_user_id on app.users(auth_user_id);
create index if not exists idx_org_members_organization_id on app.organization_members(organization_id);
create index if not exists idx_org_members_user_id on app.organization_members(user_id);
create index if not exists idx_org_members_role_id on app.organization_members(role_id);

-- Enable Row Level Security (RLS)
alter table app.users enable row level security;
alter table app.organization_members enable row level security;

-- Grants: Grant schema and table access to service_role (server-side authority)
grant all on all tables in schema app to service_role;
grant all on all sequences in schema app to service_role;
