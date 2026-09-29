-- Migration: 20260924030000_customer_foundation.sql
-- Description: Customer Accounts, Contacts, Brand Relationships, and Addresses schema
-- Specification: MGBOS 0.2.1 Logical Data Model & MGBOS 0.5.2 / 0.5.4 (MGBOS-005)

-- 1. Customer Accounts (Root customer entity across the holding)
create table if not exists app.customer_accounts (
    id uuid primary key default gen_random_uuid(),
    organization_id uuid not null references app.organizations(id) on delete restrict,
    account_type text not null default 'PERSON' check (account_type in ('PERSON', 'COMPANY')),
    display_name text not null,
    legal_name text,
    primary_email text,
    primary_phone text,
    tax_id text,
    status text not null default 'ACTIVE' check (status in ('ACTIVE', 'INACTIVE', 'ARCHIVED')),
    customer_since date not null default current_date,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    archived_at timestamptz
);

-- 2. Customer Contacts (Multiple individuals per customer account, especially for companies)
create table if not exists app.customer_contacts (
    id uuid primary key default gen_random_uuid(),
    customer_account_id uuid not null references app.customer_accounts(id) on delete cascade,
    name text not null,
    email text,
    phone text,
    position text,
    is_primary boolean not null default false,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    archived_at timestamptz
);

-- 3. Customer Brand Relationships (One customer can interact with multiple holding brands)
create table if not exists app.customer_brand_relationships (
    id uuid primary key default gen_random_uuid(),
    customer_account_id uuid not null references app.customer_accounts(id) on delete cascade,
    brand_id uuid not null references app.brands(id) on delete restrict,
    customer_segment text not null default 'STANDARD',
    relationship_status text not null default 'ACTIVE' check (relationship_status in ('PROSPECT', 'ACTIVE', 'DORMANT', 'CHURNED')),
    first_interaction_at timestamptz not null default now(),
    last_interaction_at timestamptz not null default now(),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    constraint uq_customer_brand unique (customer_account_id, brand_id)
);

-- 4. Master Addresses (Normalized physical addresses)
create table if not exists app.addresses (
    id uuid primary key default gen_random_uuid(),
    recipient_name text not null,
    phone text not null,
    address_line_1 text not null,
    address_line_2 text,
    district text,
    city text not null,
    province text not null,
    postal_code text not null,
    country_code char(2) not null default 'ID',
    latitude numeric,
    longitude numeric,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    archived_at timestamptz
);

-- 5. Customer Addresses (M:N linking customer accounts to master addresses)
create table if not exists app.customer_addresses (
    id uuid primary key default gen_random_uuid(),
    customer_account_id uuid not null references app.customer_accounts(id) on delete cascade,
    address_id uuid not null references app.addresses(id) on delete cascade,
    address_type text not null default 'SHIPPING' check (address_type in ('BILLING', 'SHIPPING', 'OFFICE', 'WAREHOUSE', 'OTHER')),
    is_default boolean not null default false,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    constraint uq_customer_address unique (customer_account_id, address_id, address_type)
);

-- Indexes for optimal lookup performance
create index if not exists idx_customer_accounts_org_id on app.customer_accounts(organization_id);
create index if not exists idx_customer_accounts_email on app.customer_accounts(primary_email);
create index if not exists idx_customer_accounts_phone on app.customer_accounts(primary_phone);
create index if not exists idx_customer_contacts_account on app.customer_contacts(customer_account_id);
create index if not exists idx_customer_brand_account on app.customer_brand_relationships(customer_account_id);
create index if not exists idx_customer_brand_brand on app.customer_brand_relationships(brand_id);
create index if not exists idx_customer_addresses_account on app.customer_addresses(customer_account_id);
create index if not exists idx_customer_addresses_address on app.customer_addresses(address_id);

-- Enable Row Level Security (RLS)
alter table app.customer_accounts enable row level security;
alter table app.customer_contacts enable row level security;
alter table app.customer_brand_relationships enable row level security;
alter table app.addresses enable row level security;
alter table app.customer_addresses enable row level security;

-- RLS Policies for service_role
create policy "Allow service_role full access to customer_accounts"
    on app.customer_accounts for all to service_role using (true) with check (true);

create policy "Allow service_role full access to customer_contacts"
    on app.customer_contacts for all to service_role using (true) with check (true);

create policy "Allow service_role full access to customer_brand_relationships"
    on app.customer_brand_relationships for all to service_role using (true) with check (true);

create policy "Allow service_role full access to addresses"
    on app.addresses for all to service_role using (true) with check (true);

create policy "Allow service_role full access to customer_addresses"
    on app.customer_addresses for all to service_role using (true) with check (true);

-- RLS Policies for authenticated users (scoped to organization membership)
create policy "Allow org members to view customer_accounts"
    on app.customer_accounts for select to authenticated
    using (
        exists (
            select 1 from app.organization_members om
            join app.users u on u.id = om.user_id
            where om.organization_id = customer_accounts.organization_id
              and u.auth_user_id = auth.uid()
              and om.status = 'ACTIVE'
        )
    );

create policy "Allow org members to insert customer_accounts"
    on app.customer_accounts for insert to authenticated
    with check (
        exists (
            select 1 from app.organization_members om
            join app.users u on u.id = om.user_id
            where om.organization_id = customer_accounts.organization_id
              and u.auth_user_id = auth.uid()
              and om.status = 'ACTIVE'
        )
    );

create policy "Allow org members to update customer_accounts"
    on app.customer_accounts for update to authenticated
    using (
        exists (
            select 1 from app.organization_members om
            join app.users u on u.id = om.user_id
            where om.organization_id = customer_accounts.organization_id
              and u.auth_user_id = auth.uid()
              and om.status = 'ACTIVE'
        )
    );

create policy "Allow org members to view customer_contacts"
    on app.customer_contacts for select to authenticated
    using (
        exists (
            select 1 from app.customer_accounts ca
            join app.organization_members om on om.organization_id = ca.organization_id
            join app.users u on u.id = om.user_id
            where ca.id = customer_contacts.customer_account_id
              and u.auth_user_id = auth.uid()
              and om.status = 'ACTIVE'
        )
    );

create policy "Allow org members to view customer_brand_relationships"
    on app.customer_brand_relationships for select to authenticated
    using (
        exists (
            select 1 from app.customer_accounts ca
            join app.organization_members om on om.organization_id = ca.organization_id
            join app.users u on u.id = om.user_id
            where ca.id = customer_brand_relationships.customer_account_id
              and u.auth_user_id = auth.uid()
              and om.status = 'ACTIVE'
        )
    );

create policy "Allow org members to view customer_addresses"
    on app.customer_addresses for select to authenticated
    using (
        exists (
            select 1 from app.customer_accounts ca
            join app.organization_members om on om.organization_id = ca.organization_id
            join app.users u on u.id = om.user_id
            where ca.id = customer_addresses.customer_account_id
              and u.auth_user_id = auth.uid()
              and om.status = 'ACTIVE'
        )
    );

-- Table Grants
grant all on app.customer_accounts to service_role;
grant all on app.customer_contacts to service_role;
grant all on app.customer_brand_relationships to service_role;
grant all on app.addresses to service_role;
grant all on app.customer_addresses to service_role;

grant select, insert, update on app.customer_accounts to authenticated;
grant select, insert, update, delete on app.customer_contacts to authenticated;
grant select, insert, update, delete on app.customer_brand_relationships to authenticated;
grant select, insert, update on app.addresses to authenticated;
grant select, insert, update, delete on app.customer_addresses to authenticated;
