begin;

-- ============================================================================
-- 1. Helper function: invoice actor role & organization billing settings
-- ============================================================================
alter table app.organizations add column if not exists billing_settings jsonb not null default '{}'::jsonb;

create or replace function app.invoice_actor_role(
  p_organization_id uuid,
  p_actor_id uuid
) returns text language sql stable security definer set search_path=app,pg_temp as $$
  select r.code
  from app.organization_members om
  join app.roles r on r.id = om.role_id
  join app.users u on u.id = om.user_id
  join app.organizations o on o.id = om.organization_id
  where om.organization_id = p_organization_id
    and om.user_id = p_actor_id
    and om.status = 'ACTIVE'
    and u.status = 'ACTIVE'
    and o.status = 'ACTIVE'
  limit 1;
$$;

-- ============================================================================
-- 2. Commercial Invoices Table
-- ============================================================================
create table if not exists app.invoices (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references app.organizations(id) on delete restrict,
  brand_id uuid not null references app.brands(id) on delete restrict,
  order_id uuid not null references app.orders(id) on delete restrict,
  customer_account_id uuid not null references app.customer_accounts(id) on delete restrict,
  invoice_number text not null,
  invoice_type text not null check(invoice_type in ('DOWN_PAYMENT','PROGRESS','FINAL_PAYMENT','FULL_PAYMENT','RETENTION')),
  status text not null default 'DRAFT' check(status in ('DRAFT','ISSUED','PARTIALLY_PAID','PAID','OVERDUE','VOID','CANCELLED')),
  currency text not null default 'IDR' check(currency='IDR'),
  amount_subtotal bigint not null check(amount_subtotal >= 0),
  amount_tax bigint not null default 0 check(amount_tax >= 0),
  amount_shipping bigint not null default 0 check(amount_shipping >= 0),
  amount_total bigint not null check(amount_total > 0),
  amount_paid bigint not null default 0 check(amount_paid >= 0 and amount_paid <= amount_total),
  balance_due bigint not null check(balance_due >= 0 and balance_due <= amount_total),
  due_date date not null,
  issued_at timestamptz,
  paid_at timestamptz,
  bank_account_snapshot jsonb not null default '{}',
  customer_snapshot jsonb not null default '{}',
  payment_instructions text,
  notes text,
  created_by_user_id uuid not null references app.users(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(organization_id, invoice_number),
  check(balance_due::numeric = amount_total::numeric - amount_paid::numeric),
  check(amount_total::numeric = amount_subtotal::numeric + amount_tax::numeric + amount_shipping::numeric)
);

create index if not exists idx_invoices_org_order on app.invoices(organization_id, order_id);
create index if not exists idx_invoices_customer on app.invoices(customer_account_id);
create index if not exists idx_invoices_status on app.invoices(organization_id, status);
create index if not exists idx_invoices_due_date on app.invoices(organization_id, due_date);

-- ============================================================================
-- 3. Invoice Items Table
-- ============================================================================
create table if not exists app.invoice_items (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid not null references app.invoices(id) on delete cascade,
  order_item_id uuid references app.order_items(id) on delete set null,
  description text not null,
  quantity integer not null default 1 check(quantity > 0),
  unit_price bigint not null check(unit_price >= 0),
  subtotal bigint not null check(subtotal >= 0),
  notes text,
  created_at timestamptz not null default now(),
  check(subtotal::numeric = unit_price::numeric * quantity::numeric)
);

create index if not exists idx_invoice_items_invoice on app.invoice_items(invoice_id);

-- ============================================================================
-- 4. Invoice Audit Log
-- ============================================================================
create table if not exists app.invoice_audit (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references app.organizations(id) on delete restrict,
  invoice_id uuid not null references app.invoices(id) on delete cascade,
  actor_id uuid not null references app.users(id) on delete restrict,
  action text not null,
  details jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create index if not exists idx_invoice_audit_invoice on app.invoice_audit(invoice_id, created_at asc);

-- ============================================================================
-- 5. Immutability Guard Trigger: Protect Issued Invoices
-- ============================================================================
create or replace function app.invoice_snapshot_guard() returns trigger language plpgsql set search_path=app,pg_temp as $$
begin
  if TG_OP = 'UPDATE' then
    -- Draft invoices can be updated freely
    if OLD.status = 'DRAFT' then
      return NEW;
    end if;

    -- Once ISSUED or later, financial figures and frozen coordinates are immutable
    if (to_jsonb(NEW) - array['status','amount_paid','balance_due','paid_at','updated_at'])
       is distinct from
       (to_jsonb(OLD) - array['status','amount_paid','balance_due','paid_at','updated_at']) then
      raise exception 'Issued invoices are immutable; amounts, customer details, and bank snapshots cannot be altered. Void and reissue instead.';
    end if;

    return NEW;
  end if;

  if TG_OP = 'DELETE' then
    if OLD.status <> 'DRAFT' then
      raise exception 'Cannot delete issued invoice %; use void_invoice instead', OLD.invoice_number;
    end if;
    return OLD;
  end if;

  return null;
end; $$;

drop trigger if exists trg_invoice_snapshot_guard on app.invoices;
create trigger trg_invoice_snapshot_guard
  before update or delete on app.invoices
  for each row execute function app.invoice_snapshot_guard();

-- ============================================================================
-- 6. Stored Procedure: create_invoice_for_order
-- ============================================================================
create or replace function app.create_invoice_for_order(
  p_organization_id uuid,
  p_actor_id uuid,
  p_order_id uuid,
  p_invoice_type text,
  p_amount_subtotal bigint,
  p_amount_shipping bigint default 0,
  p_amount_tax bigint default 0,
  p_due_date date default null,
  p_payment_instructions text default null,
  p_notes text default null,
  p_items jsonb default null
) returns jsonb language plpgsql security definer set search_path=app,pg_temp as $$
declare
  role_code text;
  ord app.orders%rowtype;
  inv_id uuid := gen_random_uuid();
  inv_num text;
  inv_type_clean text;
  calc_total bigint;
  current_invoiced bigint;
  bank_snapshot jsonb;
  org_billing jsonb;
  org_legal_name text;
  item_rec jsonb;
  item_subtotal bigint;
  item_qty integer;
  item_price bigint;
  item_desc text;
begin
  role_code := app.invoice_actor_role(p_organization_id, p_actor_id);
  if role_code is null or role_code not in ('OWNER','ADMIN','FINANCE','SALES') then
    raise exception 'Not authorized to create invoices';
  end if;

  inv_type_clean := upper(trim(coalesce(p_invoice_type, '')));
  if inv_type_clean not in ('DOWN_PAYMENT','PROGRESS','FINAL_PAYMENT','FULL_PAYMENT','RETENTION') then
    raise exception 'Invalid invoice type: %', inv_type_clean;
  end if;

  select * into ord from app.orders
  where id = p_order_id and organization_id = p_organization_id
  for update;

  if not found then
    raise exception 'Order contract not found';
  end if;

  if ord.status in ('CANCELLED') then
    raise exception 'Cannot create invoice for cancelled order';
  end if;

  -- Retrieve and validate verified bank coordinate from organization settings
  select legal_name, billing_settings into org_legal_name, org_billing
  from app.organizations
  where id = p_organization_id and status = 'ACTIVE';

  if not found then
    raise exception 'Active organization not found';
  end if;

  if org_billing is null or
     (org_billing->>'bank_name') is null or trim(org_billing->>'bank_name') = '' or
     (org_billing->>'account_number') is null or trim(org_billing->>'account_number') = '' or
     (org_billing->>'account_name') is null or trim(org_billing->>'account_name') = '' or
     coalesce((org_billing->>'is_verified')::boolean, false) = false then
    raise exception 'Organisasi belum memiliki konfigurasi rekening bank terverifikasi. Konfigurasikan rekening terlebih dahulu sebelum membuat faktur.';
  end if;

  bank_snapshot := jsonb_build_object(
    'bank_name', trim(org_billing->>'bank_name'),
    'account_number', trim(org_billing->>'account_number'),
    'account_name', trim(org_billing->>'account_name'),
    'branch', nullif(trim(coalesce(org_billing->>'branch', '')), ''),
    'qris_enabled', coalesce((org_billing->>'qris_enabled')::boolean, false)
  );

  if p_amount_subtotal < 0 then
    raise exception 'Subtotal cannot be negative';
  end if;

  calc_total := p_amount_subtotal + coalesce(p_amount_shipping, 0) + coalesce(p_amount_tax, 0);
  if calc_total <= 0 then
    raise exception 'Total invoice amount must be positive';
  end if;

  -- Verify active non-void invoices ceiling against order grand total
  select coalesce(sum(amount_total), 0) into current_invoiced
  from app.invoices
  where order_id = ord.id
    and organization_id = p_organization_id
    and status not in ('VOID','CANCELLED');

  if (current_invoiced + calc_total) > ord.grand_total then
    raise exception 'Total invoiced amounts (Rp %) would exceed order grand total (Rp %)',
      (current_invoiced + calc_total)::text, ord.grand_total::text;
  end if;

  -- Generate canonical invoice number: TS-INV-2026-000001
  inv_num := app.generate_document_number(p_organization_id, ord.brand_id, 'INV', extract(year from now())::integer, 6);

  insert into app.invoices (
    id, organization_id, brand_id, order_id, customer_account_id,
    invoice_number, invoice_type, status, currency,
    amount_subtotal, amount_tax, amount_shipping, amount_total,
    amount_paid, balance_due, due_date,
    bank_account_snapshot, customer_snapshot,
    payment_instructions, notes, created_by_user_id
  ) values (
    inv_id, p_organization_id, ord.brand_id, ord.id, ord.customer_account_id,
    inv_num, inv_type_clean, 'DRAFT', 'IDR',
    p_amount_subtotal, coalesce(p_amount_tax, 0), coalesce(p_amount_shipping, 0), calc_total,
    0, calc_total, coalesce(p_due_date, current_date + 7),
    bank_snapshot, ord.customer_snapshot,
    coalesce(p_payment_instructions, 'Mohon cantumkan nomor invoice saat transfer. Konfirmasi via WhatsApp.'),
    p_notes, p_actor_id
  );

  -- Insert invoice line items if provided, or generate milestone line item
  if p_items is not null and jsonb_typeof(p_items) = 'array' and jsonb_array_length(p_items) > 0 then
    for item_rec in select * from jsonb_array_elements(p_items) loop
      item_desc := trim(coalesce(item_rec->>'description', 'Item Tagihan'));
      item_qty := coalesce((item_rec->>'quantity')::integer, 1);
      item_price := coalesce((item_rec->>'unit_price')::bigint, 0);
      item_subtotal := item_price * item_qty;

      insert into app.invoice_items (
        invoice_id, order_item_id, description,
        quantity, unit_price, subtotal, notes
      ) values (
        inv_id,
        nullif(item_rec->>'order_item_id', '')::uuid,
        item_desc,
        item_qty,
        item_price,
        item_subtotal,
        item_rec->>'notes'
      );
    end loop;
  else
    insert into app.invoice_items (
      invoice_id, order_item_id, description,
      quantity, unit_price, subtotal
    ) values (
      inv_id,
      null,
      case inv_type_clean
        when 'DOWN_PAYMENT' then 'Pembayaran Uang Muka (Down Payment 50%) Pesanan ' || ord.order_number
        when 'FINAL_PAYMENT' then 'Pelunasan Akhir (Final Payment) Pesanan ' || ord.order_number
        when 'FULL_PAYMENT' then 'Pembayaran Penuh 100% Pesanan ' || ord.order_number
        else 'Termin Tagihan ' || inv_type_clean || ' Pesanan ' || ord.order_number
      end,
      1,
      p_amount_subtotal,
      p_amount_subtotal
    );
  end if;

  insert into app.invoice_audit (
    organization_id, invoice_id, actor_id, action, details
  ) values (
    p_organization_id, inv_id, p_actor_id, 'invoice.created',
    jsonb_build_object(
      'invoice_number', inv_num,
      'invoice_type', inv_type_clean,
      'amount_total', calc_total,
      'order_id', ord.id
    )
  );

  return jsonb_build_object(
    'invoice_id', inv_id,
    'invoice_number', inv_num,
    'amount_total', calc_total,
    'status', 'DRAFT'
  );
end; $$;

-- ============================================================================
-- 7. Stored Procedure: issue_invoice
-- ============================================================================
create or replace function app.issue_invoice(
  p_organization_id uuid,
  p_actor_id uuid,
  p_invoice_id uuid
) returns jsonb language plpgsql security definer set search_path=app,pg_temp as $$
declare
  role_code text;
  inv app.invoices%rowtype;
begin
  role_code := app.invoice_actor_role(p_organization_id, p_actor_id);
  if role_code is null or role_code not in ('OWNER','ADMIN','FINANCE') then
    raise exception 'Not authorized to issue formal invoices';
  end if;

  select * into inv from app.invoices
  where id = p_invoice_id and organization_id = p_organization_id
  for update;

  if not found then
    raise exception 'Invoice not found';
  end if;

  if inv.status <> 'DRAFT' then
    raise exception 'Only DRAFT invoices may be officially issued (current: %)', inv.status;
  end if;

  if inv.bank_account_snapshot is null or
     (inv.bank_account_snapshot->>'bank_name') is null or trim(inv.bank_account_snapshot->>'bank_name') = '' or
     (inv.bank_account_snapshot->>'account_number') is null or trim(inv.bank_account_snapshot->>'account_number') = '' or
     (inv.bank_account_snapshot->>'account_name') is null or trim(inv.bank_account_snapshot->>'account_name') = '' then
    raise exception 'Invoice tidak dapat diterbitkan tanpa konfigurasi rekening pembayaran yang valid.';
  end if;

  update app.invoices
  set status = 'ISSUED',
      issued_at = now(),
      updated_at = now()
  where id = inv.id;

  insert into app.invoice_audit (
    organization_id, invoice_id, actor_id, action, details
  ) values (
    p_organization_id, inv.id, p_actor_id, 'invoice.issued',
    jsonb_build_object('invoice_number', inv.invoice_number, 'issued_at', now())
  );

  return jsonb_build_object(
    'invoice_id', inv.id,
    'invoice_number', inv.invoice_number,
    'status', 'ISSUED'
  );
end; $$;

-- ============================================================================
-- 8. Stored Procedure: void_invoice
-- ============================================================================
create or replace function app.void_invoice(
  p_organization_id uuid,
  p_actor_id uuid,
  p_invoice_id uuid,
  p_reason text default null
) returns jsonb language plpgsql security definer set search_path=app,pg_temp as $$
declare
  role_code text;
  inv app.invoices%rowtype;
begin
  role_code := app.invoice_actor_role(p_organization_id, p_actor_id);
  if role_code is null or role_code not in ('OWNER','ADMIN','FINANCE') then
    raise exception 'Not authorized to void invoices';
  end if;

  select * into inv from app.invoices
  where id = p_invoice_id and organization_id = p_organization_id
  for update;

  if not found then
    raise exception 'Invoice not found';
  end if;

  if inv.status in ('VOID','CANCELLED') then
    raise exception 'Invoice is already %', inv.status;
  end if;

  if inv.amount_paid > 0 then
    raise exception 'Cannot void invoice with recorded payments (Rp %); de-allocate payments first', inv.amount_paid::text;
  end if;

  update app.invoices
  set status = 'VOID',
      updated_at = now()
  where id = inv.id;

  insert into app.invoice_audit (
    organization_id, invoice_id, actor_id, action, details
  ) values (
    p_organization_id, inv.id, p_actor_id, 'invoice.voided',
    jsonb_build_object('invoice_number', inv.invoice_number, 'reason', p_reason)
  );

  return jsonb_build_object(
    'invoice_id', inv.id,
    'invoice_number', inv.invoice_number,
    'status', 'VOID'
  );
end; $$;

commit;
