-- Migration: 20260924040000_leads_pipeline.sql
-- Description: Inbound Leads Pipeline and Qualification Engine schema
-- Specification: MGBOS 0.2.1 Logical Data Model & MGBOS 0.3 Business State Machines / MGBOS 0.5.1 (MGBOS-006)

-- 1. Inbound Leads Table
create table if not exists app.leads (
    id uuid primary key default gen_random_uuid(),
    organization_id uuid not null references app.organizations(id) on delete restrict,
    brand_id uuid not null references app.brands(id) on delete restrict,
    business_line_id uuid references app.business_lines(id) on delete set null,
    channel_id uuid not null references app.channels(id) on delete restrict,
    customer_account_id uuid references app.customer_accounts(id) on delete set null,
    customer_contact_id uuid references app.customer_contacts(id) on delete set null,
    lead_number text not null,
    title text not null,
    contact_name text,
    company_name text,
    email text,
    phone text,
    raw_inquiry text,
    estimated_quantity integer check (estimated_quantity is null or estimated_quantity >= 0),
    estimated_budget bigint check (estimated_budget is null or estimated_budget >= 0),
    status text not null default 'NEW' check (status in ('NEW', 'CONTACTED', 'QUALIFYING', 'QUALIFIED', 'DISQUALIFIED', 'CONVERTED', 'LOST')),
    qualification_result text check (qualification_result is null or qualification_result in ('QUALIFIED', 'DISQUALIFIED')),
    qualification_score integer check (qualification_score is null or (qualification_score >= 0 and qualification_score <= 100)),
    qualification_notes text,
    disqualification_reason text check (disqualification_reason is null or disqualification_reason in ('OUT_OF_SCOPE', 'SPAM', 'INVALID_CONTACT', 'QUANTITY_NOT_SUPPORTED', 'DEADLINE_IMPOSSIBLE', 'BUDGET_MISMATCH', 'OTHER')),
    assigned_user_id uuid references app.users(id) on delete set null,
    created_at timestamptz not null default now(),
    contacted_at timestamptz,
    qualified_at timestamptz,
    disqualified_at timestamptz,
    converted_at timestamptz,
    lost_at timestamptz,
    lost_reason text,
    updated_at timestamptz not null default now(),
    archived_at timestamptz,
    constraint uq_leads_org_lead_number unique (organization_id, lead_number)
);

-- 2. Indexes for Pipeline Performance
create index if not exists idx_leads_organization_id on app.leads(organization_id);
create index if not exists idx_leads_brand_status_created on app.leads(brand_id, status, created_at desc);
create index if not exists idx_leads_channel_id on app.leads(channel_id);
create index if not exists idx_leads_customer_account_id on app.leads(customer_account_id);
create index if not exists idx_leads_assigned_user_id on app.leads(assigned_user_id);
create index if not exists idx_leads_lead_number on app.leads(lead_number);

-- 3. Automatic Canonical Lead Number Generator Trigger
create or replace function app.trg_leads_generate_number()
returns trigger
language plpgsql
security definer
set search_path = app, public
as $$
begin
    if NEW.lead_number is null or trim(NEW.lead_number) = '' then
        NEW.lead_number := app.generate_document_number(
            NEW.organization_id,
            NEW.brand_id,
            'L',
            extract(year from coalesce(NEW.created_at, now()))::integer,
            6
        );
    end if;
    return NEW;
end;
$$;

drop trigger if exists trg_leads_before_insert on app.leads;
create trigger trg_leads_before_insert
    before insert on app.leads
    for each row
    execute function app.trg_leads_generate_number();

-- 4. Enable Row Level Security (RLS)
alter table app.leads enable row level security;

-- 4.1 Service Role full access
create policy "Allow service_role full access to leads"
    on app.leads for all to service_role using (true) with check (true);

-- 4.2 Organization members access
create policy "Allow org members to view leads"
    on app.leads for select to authenticated
    using (
        exists (
            select 1 from app.organization_members om
            join app.users u on u.id = om.user_id
            where om.organization_id = leads.organization_id
              and u.auth_user_id = auth.uid()
              and om.status = 'ACTIVE'
        )
    );

create policy "Allow org members to insert leads"
    on app.leads for insert to authenticated
    with check (
        exists (
            select 1 from app.organization_members om
            join app.users u on u.id = om.user_id
            where om.organization_id = leads.organization_id
              and u.auth_user_id = auth.uid()
              and om.status = 'ACTIVE'
        )
    );

create policy "Allow org members to update leads"
    on app.leads for update to authenticated
    using (
        exists (
            select 1 from app.organization_members om
            join app.users u on u.id = om.user_id
            where om.organization_id = leads.organization_id
              and u.auth_user_id = auth.uid()
              and om.status = 'ACTIVE'
        )
    )
    with check (
        exists (
            select 1 from app.organization_members om
            join app.users u on u.id = om.user_id
            where om.organization_id = leads.organization_id
              and u.auth_user_id = auth.uid()
              and om.status = 'ACTIVE'
        )
    );

-- 5. Grant permissions to service_role
grant all on app.leads to service_role;
