-- Migration: 20260925160000_analytical_ledger_and_margin_realization.sql
-- Description: MGBOS-016 Analytical Financial Events, Pass-Through Courier Separation & Margin Realization
-- Specification: MultiGraph Business OS — Sprint 5 Finale (Analytical Ledger & Margin Analytics)

begin;

-- ============================================================================
-- 1. Financial Ledger Entries Table
-- ============================================================================

create table if not exists app.financial_ledger_entries (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references app.organizations(id) on delete restrict,
  brand_id uuid not null references app.brands(id) on delete restrict,
  order_id uuid references app.orders(id) on delete restrict,
  entry_number text not null,
  entry_type text not null check(entry_type in (
    'ORDER_COMMITTED',
    'INVOICE_ISSUED',
    'PAYMENT_RECEIVED',
    'PAYMENT_REVERSED',
    'PRODUCTION_COMMITTED',
    'PRODUCTION_ACTUAL_SETTLED',
    'SHIPPING_ESCROW_RECORDED',
    'COURIER_EXPENSE_DISBURSED',
    'MARGIN_REALIZATION_SNAPSHOT'
  )),
  category text not null check(category in (
    'REVENUE',
    'COST_OF_GOODS',
    'PASS_THROUGH_SHIPPING',
    'CASH_MOVEMENT',
    'ADJUSTMENT'
  )),
  amount bigint not null check(amount >= 0),
  direction text not null check(direction in ('DEBIT','CREDIT')),
  currency text not null default 'IDR' check(currency = 'IDR'),
  reference_id uuid,
  reference_document text,
  metadata jsonb not null default '{}',
  notes text,
  created_by_user_id uuid not null references app.users(id) on delete restrict,
  created_at timestamptz not null default now(),
  unique(organization_id, entry_number)
);

-- Indexes
create index if not exists idx_financial_ledger_org_brand on app.financial_ledger_entries(organization_id, brand_id, created_at desc);
create index if not exists idx_financial_ledger_order on app.financial_ledger_entries(order_id);
create index if not exists idx_financial_ledger_type on app.financial_ledger_entries(entry_type);
create index if not exists idx_financial_ledger_category on app.financial_ledger_entries(category);
create index if not exists idx_financial_ledger_reference on app.financial_ledger_entries(reference_id);

-- RLS
alter table app.financial_ledger_entries enable row level security;

create policy "Allow service_role full access to financial_ledger_entries"
  on app.financial_ledger_entries for all to service_role using (true) with check (true);

create policy "Allow organization members to view financial ledger entries"
  on app.financial_ledger_entries for select to authenticated
  using (
    exists (
      select 1 from app.organization_members om
      join app.users u on u.id = om.user_id
      where om.organization_id = financial_ledger_entries.organization_id
        and u.auth_user_id = auth.uid()
        and om.status = 'ACTIVE'
    )
  );

-- Immutability Guard: Ledger entries can never be modified or deleted
create or replace function app.financial_ledger_immutability_guard()
returns trigger language plpgsql set search_path=app,pg_temp as $$
begin
  raise exception 'Financial ledger entries are strictly immutable and append-only';
end;
$$;

create trigger trg_financial_ledger_immutability
  before update or delete on app.financial_ledger_entries
  for each row execute function app.financial_ledger_immutability_guard();

-- ============================================================================
-- 2. Stored Procedure: record_actual_job_cost
-- ============================================================================

create or replace function app.record_actual_job_cost(
  p_organization_id uuid,
  p_actor_id uuid,
  p_job_id uuid,
  p_actual_cost bigint,
  p_notes text default null
) returns jsonb language plpgsql security definer set search_path=app,pg_temp as $$
declare
  v_role text;
  v_job app.production_jobs%rowtype;
  v_order app.orders%rowtype;
  v_led_num text;
  v_variance bigint;
begin
  -- 1. Authorization check
  v_role := app.production_actor_role(p_organization_id, p_actor_id);
  if v_role not in ('OWNER','ADMIN','FINANCE','OPERATIONS') then
    raise exception 'Unauthorized to record actual job cost';
  end if;

  if p_actual_cost < 0 then
    raise exception 'Actual cost must be greater than or equal to 0';
  end if;

  -- 2. Lock job
  select * into v_job
  from app.production_jobs
  where id = p_job_id and organization_id = p_organization_id
  for update;

  if not found then
    raise exception 'Production job not found in this organization';
  end if;

  -- 3. Lock order
  select * into v_order
  from app.orders
  where id = v_job.order_id and organization_id = p_organization_id
  for update;

  if not found then
    raise exception 'Associated order not found';
  end if;

  -- 4. Calculate cost variance against committed cost (or estimated cost)
  v_variance := p_actual_cost - coalesce(v_job.committed_cost, v_job.estimated_cost);

  -- 5. Update production job
  update app.production_jobs
  set actual_cost = p_actual_cost,
      updated_at = now()
  where id = v_job.id;

  -- 6. Generate ledger entry number
  v_led_num := app.generate_document_number(p_organization_id, v_job.brand_id, 'LED');

  -- 7. Insert financial ledger entry
  insert into app.financial_ledger_entries (
    organization_id,
    brand_id,
    order_id,
    entry_number,
    entry_type,
    category,
    amount,
    direction,
    reference_id,
    reference_document,
    metadata,
    notes,
    created_by_user_id
  ) values (
    p_organization_id,
    v_job.brand_id,
    v_job.order_id,
    v_led_num,
    'PRODUCTION_ACTUAL_SETTLED',
    'COST_OF_GOODS',
    p_actual_cost,
    'DEBIT',
    v_job.id,
    v_job.job_number,
    jsonb_build_object(
      'job_id', v_job.id,
      'job_number', v_job.job_number,
      'job_type', v_job.job_type,
      'estimated_cost', v_job.estimated_cost,
      'committed_cost', v_job.committed_cost,
      'actual_cost', p_actual_cost,
      'variance', v_variance
    ),
    coalesce(p_notes, 'Realisasi biaya modal aktual SPK produksi'),
    p_actor_id
  );

  -- 8. Audit log on production job
  insert into app.production_job_audit (
    organization_id,
    production_job_id,
    actor_id,
    action,
    details
  ) values (
    p_organization_id,
    v_job.id,
    p_actor_id,
    'job.actual_cost_settled',
    jsonb_build_object(
      'actual_cost', p_actual_cost,
      'variance', v_variance,
      'ledger_entry', v_led_num,
      'notes', p_notes
    )
  );

  return jsonb_build_object(
    'job_id', v_job.id,
    'job_number', v_job.job_number,
    'order_id', v_job.order_id,
    'actual_cost', p_actual_cost,
    'committed_cost', v_job.committed_cost,
    'variance', v_variance,
    'ledger_number', v_led_num
  );
end;
$$;

-- ============================================================================
-- 3. Automatic Triggers for Ledger Event Recording
-- ============================================================================

-- A. Order Confirmation Ledger Event
create or replace function app.trg_order_confirmed_ledger_event()
returns trigger language plpgsql security definer set search_path=app,pg_temp as $$
declare
  v_led_num text;
begin
  if TG_OP = 'INSERT' then
    v_led_num := app.generate_document_number(NEW.organization_id, NEW.brand_id, 'LED');
    
    insert into app.financial_ledger_entries (
      organization_id,
      brand_id,
      order_id,
      entry_number,
      entry_type,
      category,
      amount,
      direction,
      reference_id,
      reference_document,
      metadata,
      notes,
      created_by_user_id
    ) values (
      NEW.organization_id,
      NEW.brand_id,
      NEW.id,
      v_led_num,
      'ORDER_COMMITTED',
      'REVENUE',
      (NEW.subtotal - NEW.discount_total),
      'CREDIT',
      NEW.id,
      NEW.order_number,
      jsonb_build_object(
        'order_number', NEW.order_number,
        'subtotal', NEW.subtotal,
        'discount_total', NEW.discount_total,
        'net_product_revenue', (NEW.subtotal - NEW.discount_total),
        'shipping_total', NEW.shipping_total,
        'grand_total', NEW.grand_total,
        'estimated_cost_total', NEW.estimated_cost_total,
        'estimated_gross_profit', NEW.estimated_gross_profit
      ),
      'Kontrak pesanan resmi dikonfirmasi',
      NEW.created_by_user_id
    );
  end if;
  return NEW;
end;
$$;

drop trigger if exists trg_orders_ledger_event on app.orders;
create trigger trg_orders_ledger_event
  after insert on app.orders
  for each row execute function app.trg_order_confirmed_ledger_event();

-- B. Invoice Issuance Ledger Event (Revenue & Courier Escrow)
create or replace function app.trg_invoice_issued_ledger_event()
returns trigger language plpgsql security definer set search_path=app,pg_temp as $$
declare
  v_led_num text;
begin
  if (TG_OP = 'UPDATE' and OLD.status = 'DRAFT' and NEW.status = 'ISSUED') or
     (TG_OP = 'INSERT' and NEW.status = 'ISSUED') then
    
    -- 1. Log Invoice Revenue Commitment
    v_led_num := app.generate_document_number(NEW.organization_id, NEW.brand_id, 'LED');
    insert into app.financial_ledger_entries (
      organization_id,
      brand_id,
      order_id,
      entry_number,
      entry_type,
      category,
      amount,
      direction,
      reference_id,
      reference_document,
      metadata,
      notes,
      created_by_user_id
    ) values (
      NEW.organization_id,
      NEW.brand_id,
      NEW.order_id,
      v_led_num,
      'INVOICE_ISSUED',
      'REVENUE',
      NEW.amount_subtotal,
      'CREDIT',
      NEW.id,
      NEW.invoice_number,
      jsonb_build_object(
        'invoice_number', NEW.invoice_number,
        'invoice_type', NEW.invoice_type,
        'amount_subtotal', NEW.amount_subtotal,
        'amount_shipping', NEW.amount_shipping,
        'amount_total', NEW.amount_total
      ),
      'Faktur komersial resmi diterbitkan',
      NEW.created_by_user_id
    );

    -- 2. Log Courier Shipping Escrow if amount_shipping > 0
    if NEW.amount_shipping > 0 then
      v_led_num := app.generate_document_number(NEW.organization_id, NEW.brand_id, 'LED');
      insert into app.financial_ledger_entries (
        organization_id,
        brand_id,
        order_id,
        entry_number,
        entry_type,
        category,
        amount,
        direction,
        reference_id,
        reference_document,
        metadata,
        notes,
        created_by_user_id
      ) values (
        NEW.organization_id,
        NEW.brand_id,
        NEW.order_id,
        v_led_num,
        'SHIPPING_ESCROW_RECORDED',
        'PASS_THROUGH_SHIPPING',
        NEW.amount_shipping,
        'CREDIT',
        NEW.id,
        NEW.invoice_number,
        jsonb_build_object(
          'invoice_number', NEW.invoice_number,
          'amount_shipping', NEW.amount_shipping,
          'escrow_net_margin', 0
        ),
        'Dana titipan ongkir kurir eksternal (Pass-through escrow, net margin Rp 0)',
        NEW.created_by_user_id
      );
    end if;

  end if;
  return NEW;
end;
$$;

drop trigger if exists trg_invoices_ledger_event on app.invoices;
create trigger trg_invoices_ledger_event
  after insert or update on app.invoices
  for each row execute function app.trg_invoice_issued_ledger_event();

-- C. Payment Confirmed / Reversed Ledger Event
create or replace function app.trg_payment_ledger_event()
returns trigger language plpgsql security definer set search_path=app,pg_temp as $$
declare
  v_led_num text;
  v_alloc app.payment_allocations%rowtype;
  v_order_id uuid;
begin
  if (TG_OP = 'UPDATE' and OLD.status <> 'CONFIRMED' and NEW.status = 'CONFIRMED') or
     (TG_OP = 'INSERT' and NEW.status = 'CONFIRMED') then
    
    -- Lookup first allocated order if exists
    select i.order_id into v_order_id
    from app.payment_allocations pa
    join app.invoices i on i.id = pa.invoice_id
    where pa.payment_id = NEW.id
    limit 1;

    v_led_num := app.generate_document_number(NEW.organization_id, NEW.brand_id, 'LED');

    insert into app.financial_ledger_entries (
      organization_id,
      brand_id,
      order_id,
      entry_number,
      entry_type,
      category,
      amount,
      direction,
      reference_id,
      reference_document,
      metadata,
      notes,
      created_by_user_id
    ) values (
      NEW.organization_id,
      NEW.brand_id,
      v_order_id,
      v_led_num,
      'PAYMENT_RECEIVED',
      'CASH_MOVEMENT',
      NEW.amount,
      'DEBIT',
      NEW.id,
      NEW.payment_number,
      jsonb_build_object(
        'payment_number', NEW.payment_number,
        'payment_method', NEW.payment_method,
        'allocated_amount', NEW.allocated_amount,
        'destination_bank', NEW.destination_bank,
        'reference_number', NEW.reference_number
      ),
      'Kas masuk terkonfirmasi ke rekening holding',
      NEW.created_by_user_id
    );

  elsif TG_OP = 'UPDATE' and OLD.status = 'CONFIRMED' and NEW.status = 'REVERSED' then

    select i.order_id into v_order_id
    from app.payment_allocations pa
    join app.invoices i on i.id = pa.invoice_id
    where pa.payment_id = NEW.id
    limit 1;

    v_led_num := app.generate_document_number(NEW.organization_id, NEW.brand_id, 'LED');

    insert into app.financial_ledger_entries (
      organization_id,
      brand_id,
      order_id,
      entry_number,
      entry_type,
      category,
      amount,
      direction,
      reference_id,
      reference_document,
      metadata,
      notes,
      created_by_user_id
    ) values (
      NEW.organization_id,
      NEW.brand_id,
      v_order_id,
      v_led_num,
      'PAYMENT_REVERSED',
      'CASH_MOVEMENT',
      NEW.amount,
      'CREDIT',
      NEW.id,
      NEW.payment_number,
      jsonb_build_object(
        'payment_number', NEW.payment_number,
        'payment_method', NEW.payment_method,
        'reversal_status', 'REVERSED'
      ),
      'Pembatalan mutasi kas masuk (Reversal)',
      NEW.created_by_user_id
    );

  end if;
  return NEW;
end;
$$;

drop trigger if exists trg_payments_ledger_event on app.payments;
create trigger trg_payments_ledger_event
  after insert or update on app.payments
  for each row execute function app.trg_payment_ledger_event();

-- ============================================================================
-- 4. Analytical View: order_financial_summaries
-- ============================================================================

create or replace view app.order_financial_summaries as
with inv_agg as (
  select
    i.order_id,
    count(i.id) filter (where i.status not in ('VOID','CANCELLED')) as active_invoice_count,
    coalesce(sum(i.amount_total) filter (where i.status not in ('VOID','CANCELLED')), 0) as total_invoiced,
    coalesce(sum(i.amount_paid) filter (where i.status not in ('VOID','CANCELLED')), 0) as total_invoiced_paid,
    coalesce(sum(i.balance_due) filter (where i.status not in ('VOID','CANCELLED')), 0) as total_balance_due,
    coalesce(sum(i.amount_shipping) filter (where i.status not in ('VOID','CANCELLED')), 0) as total_shipping_invoiced
  from app.invoices i
  group by i.order_id
),
pay_agg as (
  select
    i.order_id,
    coalesce(sum(pa.amount), 0) as total_cash_received
  from app.payment_allocations pa
  join app.invoices i on i.id = pa.invoice_id
  join app.payments p on p.id = pa.payment_id
  where p.status = 'CONFIRMED'
  group by i.order_id
),
job_agg as (
  select
    pj.order_id,
    count(pj.id) as total_jobs_count,
    count(pj.id) filter (where pj.status = 'COMPLETED') as completed_jobs_count,
    coalesce(sum(pj.estimated_cost), 0) as total_jobs_estimated_cost,
    coalesce(sum(coalesce(pj.committed_cost, pj.estimated_cost)), 0) as total_committed_cost,
    coalesce(sum(coalesce(pj.actual_cost, pj.committed_cost, pj.estimated_cost)), 0) as total_effective_cost,
    coalesce(sum(pj.actual_cost), 0) as total_actual_cost,
    bool_and(pj.actual_cost is not null) as all_costs_settled
  from app.production_jobs pj
  where pj.status <> 'CANCELLED'
  group by pj.order_id
)
select
  o.id as order_id,
  o.organization_id,
  o.brand_id,
  b.code as brand_code,
  b.name as brand_name,
  o.customer_account_id,
  coalesce(o.customer_snapshot->>'display_name', 'Customer') as customer_name,
  o.order_number,
  o.status as order_status,
  o.confirmed_at,
  o.currency,
  o.subtotal,
  o.discount_total,
  (o.subtotal - o.discount_total) as net_product_revenue,
  o.shipping_total as courier_shipping_fee,
  o.grand_total,
  coalesce(inv.total_invoiced, 0)::bigint as total_invoiced,
  coalesce(inv.total_balance_due, 0)::bigint as total_balance_due,
  coalesce(pay.total_cash_received, 0)::bigint as total_cash_received,
  case
    when coalesce(inv.total_invoiced, 0) = 0 then 'UNBILLED'
    when coalesce(inv.total_invoiced, 0) < o.grand_total then 'PARTIALLY_INVOICED'
    when coalesce(pay.total_cash_received, 0) = 0 then 'AWAITING_PAYMENT'
    when coalesce(pay.total_cash_received, 0) < o.grand_total then 'PARTIALLY_PAID'
    else 'PAID'
  end as billing_status,
  o.estimated_cost_total as estimated_cost,
  coalesce(j.total_committed_cost, o.estimated_cost_total)::bigint as committed_cost,
  coalesce(j.total_actual_cost, 0)::bigint as actual_cost,
  coalesce(j.total_effective_cost, o.estimated_cost_total)::bigint as effective_cost,
  coalesce(j.all_costs_settled, false) as is_cost_settled,
  o.estimated_gross_profit,
  ((o.subtotal - o.discount_total) - coalesce(j.total_effective_cost, o.estimated_cost_total))::bigint as realized_gross_profit,
  case
    when (o.subtotal - o.discount_total) > 0 then
      round((o.estimated_gross_profit::numeric / (o.subtotal - o.discount_total)::numeric) * 100, 2)
    else 0
  end as estimated_margin_pct,
  case
    when (o.subtotal - o.discount_total) > 0 then
      round((((o.subtotal - o.discount_total) - coalesce(j.total_effective_cost, o.estimated_cost_total))::numeric / (o.subtotal - o.discount_total)::numeric) * 100, 2)
    else 0
  end as realized_margin_pct,
  0::bigint as courier_shipping_margin,
  case
    when (o.subtotal - o.discount_total) <= 0 then 'CRITICAL'
    when ((((o.subtotal - o.discount_total) - coalesce(j.total_effective_cost, o.estimated_cost_total))::numeric / (o.subtotal - o.discount_total)::numeric) * 100) >= 35 then 'HEALTHY'
    when ((((o.subtotal - o.discount_total) - coalesce(j.total_effective_cost, o.estimated_cost_total))::numeric / (o.subtotal - o.discount_total)::numeric) * 100) >= 25 then 'MODERATE'
    when ((((o.subtotal - o.discount_total) - coalesce(j.total_effective_cost, o.estimated_cost_total))::numeric / (o.subtotal - o.discount_total)::numeric) * 100) >= 20 then 'LOW_MARGIN'
    else 'CRITICAL'
  end as margin_health
from app.orders o
join app.brands b on b.id = o.brand_id
left join inv_agg inv on inv.order_id = o.id
left join pay_agg pay on pay.order_id = o.id
left join job_agg j on j.order_id = o.id;

alter view app.order_financial_summaries set (security_invoker = true);

commit;
