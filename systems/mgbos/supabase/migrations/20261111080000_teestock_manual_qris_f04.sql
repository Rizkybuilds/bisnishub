-- TeeStock F04: owner-verified QRIS settlement using canonical MGBOS payment ledger.
-- No payment gateway, customer-side settlement action, unique-amount surcharge,
-- production initiation, or automatic confirmation of order status.
begin;

create table app.teestock_qris_receipts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references app.organizations(id) on delete restrict,
  brand_id uuid not null references app.brands(id) on delete restrict,
  invoice_id uuid not null unique references app.invoices(id) on delete restrict,
  payment_id uuid unique references app.payments(id) on delete restrict,
  merchant_name text not null check (length(merchant_name) between 2 and 100),
  merchant_reference text not null check (length(merchant_reference) between 6 and 100),
  amount_idr bigint not null check (amount_idr > 0),
  verified_by uuid not null references app.users(id) on delete restrict,
  verified_at timestamptz not null default now(),
  constraint uq_teestock_qris_merchant_reference unique (
    organization_id,brand_id,merchant_reference
  )
);
create index idx_teestock_qris_receipts_invoice
  on app.teestock_qris_receipts(organization_id,invoice_id);

alter table app.teestock_qris_receipts enable row level security;
revoke all on table app.teestock_qris_receipts from public,anon,authenticated;
grant select,insert,update on table app.teestock_qris_receipts to service_role;
create policy teestock_qris_receipts_service
  on app.teestock_qris_receipts for all to service_role
  using (true) with check (true);

create function app.confirm_teestock_qris_payment(
  p_org uuid,
  p_actor uuid,
  p_invoice uuid,
  p_amount bigint,
  p_merchant_name text,
  p_merchant_reference text,
  p_verified_bank_statement boolean
) returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  v_invoice app.invoices%rowtype;
  v_order app.orders%rowtype;
  v_merchant text;
  v_reference text;
  v_record jsonb;
  v_payment uuid;
  v_payment_number text;
begin
  -- The website cannot call this RPC. An authorized OWNER/ADMIN must actively
  -- attest they checked their own merchant settlement ledger.
  if coalesce(app.payment_actor_role(p_org,p_actor),'') not in ('OWNER','ADMIN') then
    raise exception 'Only an owner or admin may verify TeeStock QRIS';
  end if;
  if p_verified_bank_statement is distinct from true then
    raise exception 'Merchant settlement verification is required';
  end if;

  v_merchant := btrim(coalesce(p_merchant_name,''));
  v_reference := upper(btrim(coalesce(p_merchant_reference,'')));
  if length(v_merchant) not between 2 and 100
    or length(v_reference) not between 6 and 100
    or v_reference !~ '^[A-Z0-9][A-Z0-9./:_-]*$'
    or p_amount is null or p_amount <= 0
  then raise exception 'Invalid QRIS verification details'; end if;

  select * into v_invoice from app.invoices
    where organization_id = p_org and id = p_invoice for update;
  if not found or v_invoice.status is distinct from 'ISSUED'
    or v_invoice.amount_paid <> 0
    or v_invoice.balance_due <> v_invoice.amount_total
    or v_invoice.amount_total <> p_amount then
    raise exception 'Invoice must be wholly unpaid and amount must match';
  end if;

  select * into v_order from app.orders
    where id = v_invoice.order_id and organization_id = p_org
      and brand_id = v_invoice.brand_id for update;
  if not found or v_order.request_payload->>'source' is distinct from 'TEESTOCK_WEB'
    or v_order.order_type <> 'RETAIL_DIRECT'
    or v_order.status <> 'DRAFT'
    or v_order.grand_total <> v_invoice.amount_total
  then raise exception 'Not an eligible unpaid TeeStock website order'; end if;

  -- Atomic deduplication by invoice and external merchant transaction reference.
  -- If canonical recording fails, the receipt claim is rolled back as well.
  insert into app.teestock_qris_receipts(
    organization_id,brand_id,invoice_id,merchant_name,merchant_reference,
    amount_idr,verified_by
  ) values(
    p_org,v_invoice.brand_id,p_invoice,v_merchant,v_reference,p_amount,p_actor
  );

  -- Reuse the existing, audited MGBOS cash-and-invoice allocation command.
  v_record := app.record_payment_and_allocate(
    p_organization_id => p_org,
    p_actor_id => p_actor,
    p_brand_id => v_invoice.brand_id,
    p_payment_method => 'QRIS',
    p_amount => v_invoice.amount_total,
    p_payment_date => current_date,
    p_reference_number => v_reference,
    p_destination_bank => v_merchant,
    p_notes => 'TeeStock manual QRIS: owner verified merchant transaction. No automatic payment detection.',
    p_allocations => jsonb_build_array(
      jsonb_build_object('invoice_id',p_invoice,'amount',v_invoice.amount_total,
        'notes','Owner-verified QRIS merchant settlement')
    ),
    p_customer_account_id => v_invoice.customer_account_id
  );

  v_payment := (v_record->>'payment_id')::uuid;
  v_payment_number := v_record->>'payment_number';
  if v_payment is null or v_payment_number is null then
    raise exception 'Payment ledger did not return a canonical receipt';
  end if;
  update app.teestock_qris_receipts
    set payment_id = v_payment
    where invoice_id = p_invoice and organization_id = p_org;

  return jsonb_build_object(
    'invoice_id',p_invoice,
    'payment_id',v_payment,
    'payment_number',v_payment_number,
    'order_number',v_order.order_number,
    'amount_idr',v_invoice.amount_total,
    'invoice_status','PAID'
  );
end;
$$;
revoke all on function app.confirm_teestock_qris_payment(
  uuid,uuid,uuid,bigint,text,text,boolean
) from public,anon,authenticated;
grant execute on function app.confirm_teestock_qris_payment(
  uuid,uuid,uuid,bigint,text,text,boolean
) to service_role;


-- Prevent the generic payment recorder from allocating a QRIS receipt
-- to an unpaid TeeStock web invoice without an owner-verified merchant claim.
create function app.teestock_qris_allocation_guard()
returns trigger language plpgsql set search_path = '' as $$
declare
  v_payment app.payments%rowtype;
begin
  if exists (
    select 1 from app.invoices inv
    join app.orders ord on ord.id = inv.order_id
    where inv.id = new.invoice_id and inv.organization_id = new.organization_id
      and ord.request_payload->>'source' = 'TEESTOCK_WEB'
  ) then
    select * into v_payment from app.payments
      where id = new.payment_id and organization_id = new.organization_id;
    if v_payment.payment_method = 'QRIS' and not exists (
      select 1 from app.teestock_qris_receipts receipt
      where receipt.invoice_id = new.invoice_id
        and receipt.organization_id = new.organization_id
        and receipt.brand_id = v_payment.brand_id
        and receipt.merchant_reference = v_payment.reference_number
        and receipt.amount_idr = v_payment.amount
        and receipt.verified_by = v_payment.created_by_user_id
    ) then
      raise exception 'TeeStock QRIS payment requires verified merchant settlement';
    end if;
  end if;
  return new;
end;
$$;
create trigger teestock_qris_allocation_before_insert
  before insert on app.payment_allocations for each row
  execute function app.teestock_qris_allocation_guard();
revoke all on function app.teestock_qris_allocation_guard() from public,anon,authenticated;

commit;
