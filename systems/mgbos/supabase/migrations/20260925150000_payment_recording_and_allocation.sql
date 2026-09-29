-- Migration: 20260925150000_payment_recording_and_allocation.sql
-- Description: MGBOS-015 Payment Recording & Allocation (Cash-In to Invoices & Ledger Reconciliation)
-- Specification: MultiGraph Business OS — Sprint 5 (Cash Movements & Analytical Ledger)

begin;

-- ============================================================================
-- 1. Tables for Payment Domain
-- ============================================================================

create table if not exists app.payments (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references app.organizations(id) on delete restrict,
  brand_id uuid not null references app.brands(id) on delete restrict,
  customer_account_id uuid references app.customer_accounts(id) on delete restrict,
  payment_number text not null,
  payment_method text not null check(payment_method in ('BANK_TRANSFER','QRIS','CASH','GIRO','PAYMENT_GATEWAY','OTHER')),
  status text not null default 'CONFIRMED' check(status in ('DRAFT','CONFIRMED','REJECTED','REVERSED')),
  amount bigint not null check(amount > 0),
  allocated_amount bigint not null default 0 check(allocated_amount >= 0 and allocated_amount <= amount),
  currency text not null default 'IDR' check(currency = 'IDR'),
  payment_date date not null default current_date,
  received_at timestamptz not null default now(),
  reference_number text,
  destination_bank text,
  destination_account_number text,
  payer_name text,
  payer_bank text,
  payer_account_number text,
  proof_file_url text,
  notes text,
  created_by_user_id uuid not null references app.users(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(organization_id, payment_number)
);

create table if not exists app.payment_allocations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references app.organizations(id) on delete restrict,
  payment_id uuid not null references app.payments(id) on delete restrict,
  invoice_id uuid not null references app.invoices(id) on delete restrict,
  amount bigint not null check(amount > 0),
  notes text,
  created_at timestamptz not null default now(),
  unique(payment_id, invoice_id)
);

create table if not exists app.payment_audit (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references app.organizations(id) on delete restrict,
  payment_id uuid not null references app.payments(id) on delete cascade,
  actor_id uuid not null references app.users(id) on delete restrict,
  action text not null,
  details jsonb not null default '{}',
  created_at timestamptz not null default now()
);

-- ============================================================================
-- 2. Indexes
-- ============================================================================

create index if not exists idx_payments_org_brand_date on app.payments(organization_id, brand_id, payment_date desc);
create index if not exists idx_payments_customer on app.payments(customer_account_id);
create index if not exists idx_payments_status on app.payments(status);
create index if not exists idx_payment_allocations_payment on app.payment_allocations(payment_id);
create index if not exists idx_payment_allocations_invoice on app.payment_allocations(invoice_id);
create index if not exists idx_payment_audit_payment on app.payment_audit(payment_id, created_at desc);

-- ============================================================================
-- 3. Row Level Security (RLS)
-- ============================================================================

alter table app.payments enable row level security;
alter table app.payment_allocations enable row level security;
alter table app.payment_audit enable row level security;

create policy "Allow service_role full access to payments"
  on app.payments for all to service_role using (true) with check (true);

create policy "Allow organization members to view payments"
  on app.payments for select to authenticated
  using (
    exists (
      select 1 from app.organization_members om
      join app.users u on u.id = om.user_id
      where om.organization_id = payments.organization_id
        and u.auth_user_id = auth.uid()
        and om.status = 'ACTIVE'
    )
  );

create policy "Allow service_role full access to payment_allocations"
  on app.payment_allocations for all to service_role using (true) with check (true);

create policy "Allow organization members to view payment allocations"
  on app.payment_allocations for select to authenticated
  using (
    exists (
      select 1 from app.organization_members om
      join app.users u on u.id = om.user_id
      where om.organization_id = payment_allocations.organization_id
        and u.auth_user_id = auth.uid()
        and om.status = 'ACTIVE'
    )
  );

create policy "Allow service_role full access to payment_audit"
  on app.payment_audit for all to service_role using (true) with check (true);

create policy "Allow organization members to view payment audit"
  on app.payment_audit for select to authenticated
  using (
    exists (
      select 1 from app.organization_members om
      join app.users u on u.id = om.user_id
      where om.organization_id = payment_audit.organization_id
        and u.auth_user_id = auth.uid()
        and om.status = 'ACTIVE'
    )
  );

-- ============================================================================
-- 4. Role Check Helper
-- ============================================================================

create or replace function app.payment_actor_role(p_org uuid, p_actor uuid)
returns text language plpgsql security definer set search_path=app,pg_temp as $$
declare
  result text;
begin
  select r.code into result
  from app.organization_members m
  join app.users u on u.id = m.user_id and u.status = 'ACTIVE'
  join app.organizations o on o.id = m.organization_id and o.status = 'ACTIVE'
  join app.roles r on r.id = m.role_id and r.organization_id = m.organization_id
  where m.organization_id = p_org and m.user_id = p_actor and m.status = 'ACTIVE';

  if result is null then
    raise exception 'Active organization membership required';
  end if;

  return result;
end; $$;

-- ============================================================================
-- 5. Immutability Trigger Guard
-- ============================================================================

create or replace function app.payment_snapshot_guard()
returns trigger language plpgsql set search_path=app,pg_temp as $$
begin
  if TG_OP = 'UPDATE' then
    if OLD.status = 'CONFIRMED' then
      -- Amount, payment_number, currency, brand, org are strictly immutable
      if NEW.amount is distinct from OLD.amount or
         NEW.payment_number is distinct from OLD.payment_number or
         NEW.currency is distinct from OLD.currency or
         NEW.brand_id is distinct from OLD.brand_id or
         NEW.organization_id is distinct from OLD.organization_id then
        raise exception 'Confirmed payments are immutable; amount, currency, and document numbers cannot be altered. Revert payment instead.';
      end if;
    elsif OLD.status = 'REVERSED' then
      if NEW.status is distinct from 'REVERSED' then
        raise exception 'Reversed payments cannot be reactivated';
      end if;
    end if;
    return NEW;
  elsif TG_OP = 'DELETE' then
    if OLD.status in ('CONFIRMED','REVERSED') then
      raise exception 'Cannot delete confirmed or reversed payment %; use revert_payment instead', OLD.payment_number;
    end if;
    return OLD;
  end if;

  return null;
end; $$;

drop trigger if exists trg_payment_snapshot_guard on app.payments;
create trigger trg_payment_snapshot_guard
  before update or delete on app.payments
  for each row execute function app.payment_snapshot_guard();

-- ============================================================================
-- 6. Stored Procedure: record_payment_and_allocate
-- ============================================================================

create or replace function app.record_payment_and_allocate(
  p_organization_id uuid,
  p_actor_id uuid,
  p_brand_id uuid,
  p_payment_method text,
  p_amount bigint,
  p_payment_date date default current_date,
  p_reference_number text default null,
  p_destination_bank text default null,
  p_destination_account_number text default null,
  p_payer_name text default null,
  p_payer_bank text default null,
  p_payer_account_number text default null,
  p_proof_file_url text default null,
  p_notes text default null,
  p_allocations jsonb default '[]',
  p_customer_account_id uuid default null
) returns jsonb language plpgsql security definer set search_path=app,pg_temp as $$
declare
  role_code text;
  pay_id uuid := gen_random_uuid();
  pay_num text;
  method_clean text;
  alloc_rec jsonb;
  alloc_item_inv_id uuid;
  alloc_item_amount bigint;
  alloc_item_notes text;
  total_allocated bigint := 0;
  inv app.invoices%rowtype;
  new_inv_paid bigint;
  new_inv_balance bigint;
  new_inv_status text;
  cust_id uuid := p_customer_account_id;
begin
  role_code := app.payment_actor_role(p_organization_id, p_actor_id);
  if role_code is null or role_code not in ('OWNER','ADMIN','FINANCE') then
    raise exception 'Not authorized to record payments';
  end if;

  if p_amount <= 0 then
    raise exception 'Payment amount must be greater than zero';
  end if;

  method_clean := upper(trim(coalesce(p_payment_method, '')));
  if method_clean not in ('BANK_TRANSFER','QRIS','CASH','GIRO','PAYMENT_GATEWAY','OTHER') then
    raise exception 'Invalid payment method: %', method_clean;
  end if;

  if not exists (select 1 from app.brands where id = p_brand_id and organization_id = p_organization_id and status = 'ACTIVE') then
    raise exception 'Active brand required';
  end if;

  -- Validate allocations if provided
  if p_allocations is not null and jsonb_typeof(p_allocations) = 'array' and jsonb_array_length(p_allocations) > 0 then
    for alloc_rec in select * from jsonb_array_elements(p_allocations) loop
      alloc_item_inv_id := (alloc_rec->>'invoice_id')::uuid;
      alloc_item_amount := (alloc_rec->>'amount')::bigint;

      if alloc_item_amount <= 0 then
        raise exception 'Allocated amount must be positive';
      end if;

      total_allocated := total_allocated + alloc_item_amount;
    end loop;

    if total_allocated > p_amount then
      raise exception 'Total allocations (Rp %) exceed payment amount (Rp %)', total_allocated::text, p_amount::text;
    end if;
  end if;

  -- Generate canonical payment number: TS-PAY-2026-000001
  pay_num := app.generate_document_number(p_organization_id, p_brand_id, 'PAY', extract(year from now())::integer, 6);

  -- If customer was not specified on payment, infer from first invoice if available
  if cust_id is null and p_allocations is not null and jsonb_typeof(p_allocations) = 'array' and jsonb_array_length(p_allocations) > 0 then
    select customer_account_id into cust_id
    from app.invoices
    where id = (p_allocations->0->>'invoice_id')::uuid and organization_id = p_organization_id;
  end if;

  -- 1. Insert payment record first
  insert into app.payments (
    id, organization_id, brand_id, customer_account_id, payment_number,
    payment_method, status, amount, allocated_amount, currency,
    payment_date, received_at, reference_number, destination_bank,
    destination_account_number, payer_name, payer_bank, payer_account_number,
    proof_file_url, notes, created_by_user_id
  ) values (
    pay_id, p_organization_id, p_brand_id, cust_id, pay_num,
    method_clean, 'CONFIRMED', p_amount, total_allocated, 'IDR',
    coalesce(p_payment_date, current_date), now(), p_reference_number, p_destination_bank,
    p_destination_account_number, p_payer_name, p_payer_bank, p_payer_account_number,
    p_proof_file_url, p_notes, p_actor_id
  );

  -- 2. Process allocations and update invoices
  if p_allocations is not null and jsonb_typeof(p_allocations) = 'array' and jsonb_array_length(p_allocations) > 0 then
    for alloc_rec in select * from jsonb_array_elements(p_allocations) loop
      alloc_item_inv_id := (alloc_rec->>'invoice_id')::uuid;
      alloc_item_amount := (alloc_rec->>'amount')::bigint;
      alloc_item_notes := alloc_rec->>'notes';

      select * into inv from app.invoices
      where id = alloc_item_inv_id and organization_id = p_organization_id
      for update;

      if not found then
        raise exception 'Invoice % not found', alloc_item_inv_id;
      end if;

      if inv.status not in ('ISSUED','PARTIALLY_PAID') then
        raise exception 'Cannot allocate payment to invoice % in status %', inv.invoice_number, inv.status;
      end if;

      if alloc_item_amount > inv.balance_due then
        raise exception 'Allocation amount (Rp %) exceeds invoice % balance due (Rp %)',
          alloc_item_amount::text, inv.invoice_number, inv.balance_due::text;
      end if;

      new_inv_paid := inv.amount_paid + alloc_item_amount;
      new_inv_balance := inv.amount_total - new_inv_paid;
      if new_inv_balance = 0 then
        new_inv_status := 'PAID';
      else
        new_inv_status := 'PARTIALLY_PAID';
      end if;

      update app.invoices
      set amount_paid = new_inv_paid,
          balance_due = new_inv_balance,
          status = new_inv_status,
          paid_at = case when new_inv_status = 'PAID' then now() else paid_at end,
          updated_at = now()
      where id = inv.id;

      insert into app.payment_allocations (
        organization_id, payment_id, invoice_id, amount, notes
      ) values (
        p_organization_id, pay_id, inv.id, alloc_item_amount, alloc_item_notes
      );

      insert into app.invoice_audit (
        organization_id, invoice_id, actor_id, action, details
      ) values (
        p_organization_id, inv.id, p_actor_id, 'invoice.payment_allocated',
        jsonb_build_object(
          'payment_id', pay_id,
          'payment_number', pay_num,
          'allocated_amount', alloc_item_amount,
          'previous_paid', inv.amount_paid,
          'new_paid', new_inv_paid,
          'balance_due', new_inv_balance,
          'new_status', new_inv_status
        )
      );
    end loop;
  end if;

  -- Insert payment audit
  insert into app.payment_audit (
    organization_id, payment_id, actor_id, action, details
  ) values (
    p_organization_id, pay_id, p_actor_id, 'payment.recorded',
    jsonb_build_object(
      'payment_number', pay_num,
      'amount', p_amount,
      'allocated_amount', total_allocated,
      'unallocated_amount', p_amount - total_allocated,
      'payment_method', method_clean,
      'reference_number', p_reference_number
    )
  );

  return jsonb_build_object(
    'payment_id', pay_id,
    'payment_number', pay_num,
    'status', 'CONFIRMED',
    'amount', p_amount,
    'allocated_amount', total_allocated,
    'unallocated_amount', p_amount - total_allocated
  );
end; $$;

-- ============================================================================
-- 7. Stored Procedure: allocate_existing_payment
-- ============================================================================

create or replace function app.allocate_existing_payment(
  p_organization_id uuid,
  p_actor_id uuid,
  p_payment_id uuid,
  p_invoice_id uuid,
  p_amount bigint,
  p_notes text default null
) returns jsonb language plpgsql security definer set search_path=app,pg_temp as $$
declare
  role_code text;
  pay app.payments%rowtype;
  inv app.invoices%rowtype;
  new_inv_paid bigint;
  new_inv_balance bigint;
  new_inv_status text;
  available_unallocated bigint;
begin
  role_code := app.payment_actor_role(p_organization_id, p_actor_id);
  if role_code is null or role_code not in ('OWNER','ADMIN','FINANCE') then
    raise exception 'Not authorized to allocate payments';
  end if;

  if p_amount <= 0 then
    raise exception 'Allocation amount must be greater than zero';
  end if;

  select * into pay from app.payments
  where id = p_payment_id and organization_id = p_organization_id
  for update;

  if not found then
    raise exception 'Payment not found';
  end if;

  if pay.status <> 'CONFIRMED' then
    raise exception 'Cannot allocate payment in status %', pay.status;
  end if;

  available_unallocated := pay.amount - pay.allocated_amount;
  if p_amount > available_unallocated then
    raise exception 'Allocation amount (Rp %) exceeds available unallocated funds (Rp %)',
      p_amount::text, available_unallocated::text;
  end if;

  select * into inv from app.invoices
  where id = p_invoice_id and organization_id = p_organization_id
  for update;

  if not found then
    raise exception 'Invoice not found';
  end if;

  if inv.status not in ('ISSUED','PARTIALLY_PAID') then
    raise exception 'Cannot allocate payment to invoice % in status %', inv.invoice_number, inv.status;
  end if;

  if p_amount > inv.balance_due then
    raise exception 'Allocation amount (Rp %) exceeds invoice % balance due (Rp %)',
      p_amount::text, inv.invoice_number, inv.balance_due::text;
  end if;

  new_inv_paid := inv.amount_paid + p_amount;
  new_inv_balance := inv.amount_total - new_inv_paid;
  if new_inv_balance = 0 then
    new_inv_status := 'PAID';
  else
    new_inv_status := 'PARTIALLY_PAID';
  end if;

  update app.invoices
  set amount_paid = new_inv_paid,
      balance_due = new_inv_balance,
      status = new_inv_status,
      paid_at = case when new_inv_status = 'PAID' then now() else paid_at end,
      updated_at = now()
  where id = inv.id;

  insert into app.payment_allocations (
    organization_id, payment_id, invoice_id, amount, notes
  ) values (
    p_organization_id, pay.id, inv.id, p_amount, p_notes
  )
  on conflict (payment_id, invoice_id) do update set
    amount = app.payment_allocations.amount + excluded.amount,
    notes = coalesce(excluded.notes, app.payment_allocations.notes);

  update app.payments
  set allocated_amount = pay.allocated_amount + p_amount,
      updated_at = now()
  where id = pay.id;

  insert into app.invoice_audit (
    organization_id, invoice_id, actor_id, action, details
  ) values (
    p_organization_id, inv.id, p_actor_id, 'invoice.payment_allocated',
    jsonb_build_object(
      'payment_id', pay.id,
      'payment_number', pay.payment_number,
      'allocated_amount', p_amount,
      'new_paid', new_inv_paid,
      'balance_due', new_inv_balance,
      'new_status', new_inv_status
    )
  );

  insert into app.payment_audit (
    organization_id, payment_id, actor_id, action, details
  ) values (
    p_organization_id, pay.id, p_actor_id, 'payment.allocated',
    jsonb_build_object(
      'invoice_id', inv.id,
      'invoice_number', inv.invoice_number,
      'amount', p_amount,
      'new_allocated_total', pay.allocated_amount + p_amount
    )
  );

  return jsonb_build_object(
    'payment_id', pay.id,
    'invoice_id', inv.id,
    'allocated_amount', p_amount,
    'invoice_status', new_inv_status,
    'invoice_balance_due', new_inv_balance
  );
end; $$;

-- ============================================================================
-- 8. Stored Procedure: revert_payment
-- ============================================================================

create or replace function app.revert_payment(
  p_organization_id uuid,
  p_actor_id uuid,
  p_payment_id uuid,
  p_reason text
) returns jsonb language plpgsql security definer set search_path=app,pg_temp as $$
declare
  role_code text;
  pay app.payments%rowtype;
  alloc app.payment_allocations%rowtype;
  inv app.invoices%rowtype;
  new_inv_paid bigint;
  new_inv_balance bigint;
  new_inv_status text;
begin
  role_code := app.payment_actor_role(p_organization_id, p_actor_id);
  if role_code is null or role_code not in ('OWNER','ADMIN','FINANCE') then
    raise exception 'Not authorized to revert payments';
  end if;

  if coalesce(length(trim(p_reason)), 0) < 5 then
    raise exception 'Reversal reason must be at least 5 characters';
  end if;

  select * into pay from app.payments
  where id = p_payment_id and organization_id = p_organization_id
  for update;

  if not found then
    raise exception 'Payment not found';
  end if;

  if pay.status <> 'CONFIRMED' then
    raise exception 'Only CONFIRMED payments can be reverted (current: %)', pay.status;
  end if;

  -- Loop through all allocations and deduct from invoices
  for alloc in select * from app.payment_allocations where payment_id = pay.id loop
    select * into inv from app.invoices
    where id = alloc.invoice_id and organization_id = p_organization_id
    for update;

    if found then
      new_inv_paid := greatest(0, inv.amount_paid - alloc.amount);
      new_inv_balance := inv.amount_total - new_inv_paid;
      
      if new_inv_paid = 0 then
        new_inv_status := 'ISSUED';
      else
        new_inv_status := 'PARTIALLY_PAID';
      end if;

      update app.invoices
      set amount_paid = new_inv_paid,
          balance_due = new_inv_balance,
          status = new_inv_status,
          paid_at = case when new_inv_status = 'PAID' then paid_at else null end,
          updated_at = now()
      where id = inv.id;

      insert into app.invoice_audit (
        organization_id, invoice_id, actor_id, action, details
      ) values (
        p_organization_id, inv.id, p_actor_id, 'invoice.payment_reverted',
        jsonb_build_object(
          'payment_id', pay.id,
          'payment_number', pay.payment_number,
          'deducted_amount', alloc.amount,
          'new_paid', new_inv_paid,
          'balance_due', new_inv_balance,
          'new_status', new_inv_status,
          'reason', trim(p_reason)
        )
      );
    end if;
  end loop;

  -- Mark payment as REVERSED
  update app.payments
  set status = 'REVERSED',
      allocated_amount = 0,
      notes = case when notes is null or notes = '' then 'REVERSED: ' || trim(p_reason) else notes || ' | REVERSED: ' || trim(p_reason) end,
      updated_at = now()
  where id = pay.id;

  insert into app.payment_audit (
    organization_id, payment_id, actor_id, action, details
  ) values (
    p_organization_id, pay.id, p_actor_id, 'payment.reverted',
    jsonb_build_object('reason', trim(p_reason))
  );

  return jsonb_build_object(
    'payment_id', pay.id,
    'payment_number', pay.payment_number,
    'status', 'REVERSED'
  );
end; $$;

-- ============================================================================
-- 9. Privileges & Grants
-- ============================================================================

grant all on app.payments to service_role;
grant all on app.payment_allocations to service_role;
grant all on app.payment_audit to service_role;

grant execute on function app.payment_actor_role(uuid, uuid) to authenticated, service_role;
grant execute on function app.record_payment_and_allocate to authenticated, service_role;
grant execute on function app.allocate_existing_payment to authenticated, service_role;
grant execute on function app.revert_payment to authenticated, service_role;

commit;
