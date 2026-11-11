-- Little Treat Kitchen OS v3 / dedicated Supabase project ONLY.
-- REVIEW BEFORE EXECUTION. Not applied to any existing MGBOS project.
-- Bootstrap manually in a NEW and empty Little Treat project.
-- NO self-enrollment. Initial owner is inserted from SQL editor after creating Auth account:
--   insert into public.lt_members(user_id, role) values ('<AUTH_UID>'::uuid, 'owner');
-- Staff accounts are created from Supabase Auth admin UI and whitelisted in lt_members.
-- Do NOT place service role keys or owner passwords in the frontend.

create extension if not exists pgcrypto;
create table if not exists public.lt_members (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('owner','staff')),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.lt_products (
  id uuid primary key default gen_random_uuid(),
  sku text not null unique check (char_length(sku) between 2 and 48),
  name text not null check (char_length(name) between 2 and 140),
  category text not null check (category in ('coffee','banana','dimsum','other')),
  recipe_key text,
  price numeric(12,2) not null default 0 check (price>=0),
  active boolean not null default true,
  created_at timestamptz not null default now()
);
create table if not exists public.lt_materials (
  id uuid primary key default gen_random_uuid(),
  name text not null unique check (char_length(name) between 2 and 140),
  unit text not null check (unit in ('g','ml','pcs')),
  qty_on_hand numeric(14,3) not null default 0 check (qty_on_hand >=0),
  min_stock numeric(14,3) not null default 0 check (min_stock>=0),
  active boolean not null default true,
  created_at timestamptz not null default now()
);
create table if not exists public.lt_material_costs (
  material_id uuid primary key references public.lt_materials(id) on delete cascade,
  avg_cost_per_unit numeric(14,4) not null default 0 check (avg_cost_per_unit>=0),
  updated_at timestamptz not null default now()
);
create table if not exists public.lt_bom (
  product_id uuid not null references public.lt_products(id) on delete cascade,
  material_id uuid not null references public.lt_materials(id) on delete restrict,
  qty_per_unit numeric(14,3) not null check (qty_per_unit>0),
  primary key (product_id,material_id)
);

create table if not exists public.lt_orders (
  id uuid primary key default gen_random_uuid(),
  order_ref text not null check (char_length(order_ref) between 1 and 80),
  channel text not null check (channel in ('GoFood','GrabFood','ShopeeFood','Langsung','Lainnya')),
  status text not null default 'new' check (status in ('new','preparing','ready','handed_off','cancelled')),
  note text not null default '' check (char_length(note)<=500),
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now(),
  ready_at timestamptz,
  handed_off_at timestamptz,
  cancelled_at timestamptz
);
create index if not exists lt_orders_status_idx on public.lt_orders(status,created_at desc);
create index if not exists lt_orders_handoff_idx on public.lt_orders(handed_off_at) where handed_off_at is not null;
create table if not exists public.lt_order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.lt_orders(id) on delete restrict,
  product_id uuid not null references public.lt_products(id) on delete restrict,
  qty integer not null check (qty between 1 and 100),
  note text not null default '' check (char_length(note)<=300)
);
create index if not exists lt_order_items_order_idx on public.lt_order_items(order_id);

create table if not exists public.lt_order_financials (
  order_id uuid primary key references public.lt_orders(id) on delete restrict,
  gross numeric(14,2) not null check (gross >=0),
  cogs numeric(14,2) not null default 0 check (cogs>=0),
  discount numeric(14,2) not null default 0 check (discount>=0),
  platform_fee numeric(14,2) not null default 0 check (platform_fee>=0),
  other_fee numeric(14,2) not null default 0 check (other_fee>=0),
  fees_confirmed boolean not null default false,
  payout_received_at date,
  updated_at timestamptz not null default now(),
  constraint nonnegative_net check (discount+platform_fee+other_fee<=gross)
);
create table if not exists public.lt_stock_moves (
  id uuid primary key default gen_random_uuid(),
  material_id uuid not null references public.lt_materials(id),
  qty_delta numeric(14,3) not null check (qty_delta <> 0),
  reason text not null check (reason in ('purchase','opening','order','waste','adjustment')),
  order_id uuid references public.lt_orders(id),
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now()
);
create index if not exists lt_stock_moves_material_idx on public.lt_stock_moves(material_id,created_at desc);

create table if not exists public.lt_purchases (
  id uuid primary key default gen_random_uuid(),
  description text not null check (char_length(description) between 1 and 200),
  kind text not null check (kind in ('ingredient','packaging','equipment','operating')),
  amount numeric(14,2) not null check (amount>0),
  purchased_on date not null,
  material_id uuid references public.lt_materials(id),
  material_qty numeric(14,3) check (material_qty>0),
  received_on date,
  asset_life_months integer check (asset_life_months between 1 and 240),
  asset_salvage numeric(14,2) not null default 0 check (asset_salvage>=0),
  service_on date,
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now(),
  constraint inventory_pair check ((material_id is null and material_qty is null) or (material_id is not null and material_qty is not null)),
  constraint purchase_kind_details check (
    (kind in ('ingredient','packaging') and asset_life_months is null and service_on is null) or
    (kind='equipment' and material_id is null and asset_life_months is not null and service_on is not null and service_on >= purchased_on and asset_salvage<amount) or
    (kind='operating' and material_id is null and asset_life_months is null and service_on is null)
  ),
  constraint receipt_not_early check (received_on is null or received_on>=purchased_on)
);
create table if not exists public.lt_daily_closings (
  day date primary key,
  orders_completed integer not null,
  gross numeric(14,2) not null,
  discounts numeric(14,2) not null,
  platform_fees numeric(14,2) not null,
  other_fees numeric(14,2) not null,
  cogs numeric(14,2) not null,
  operating_expenses numeric(14,2) not null,
  purchases_paid numeric(14,2) not null,
  payouts_received numeric(14,2) not null,
  missing_financials integer not null,
  still_open_orders integer not null,
  note text not null default '',
  closed_by uuid not null references auth.users(id),
  closed_at timestamptz not null default now()
);

-- Explicit privileges: authenticated only. RLS still applies to every exposed table.
revoke all on all tables in schema public from anon;
grant select on public.lt_members, public.lt_products, public.lt_materials, public.lt_bom,
  public.lt_orders, public.lt_order_items, public.lt_stock_moves to authenticated;
grant select on public.lt_material_costs,public.lt_order_financials,public.lt_purchases to authenticated;
grant update(discount,platform_fee,other_fee,fees_confirmed,payout_received_at,updated_at)
  on public.lt_order_financials to authenticated;
grant select,insert,update,delete on public.lt_products,public.lt_bom to authenticated;
grant insert on public.lt_materials to authenticated;
grant update(name,unit,min_stock,active) on public.lt_materials to authenticated;
grant select on public.lt_daily_closings to authenticated;
-- No direct UPDATE/INSERT of orders/items/stock moves/closings to authenticated: only validated RPC.
alter table public.lt_members enable row level security;
alter table public.lt_products enable row level security;
alter table public.lt_materials enable row level security;
alter table public.lt_material_costs enable row level security;
alter table public.lt_bom enable row level security;
alter table public.lt_orders enable row level security;
alter table public.lt_order_items enable row level security;
alter table public.lt_order_financials enable row level security;
alter table public.lt_stock_moves enable row level security;
alter table public.lt_purchases enable row level security;
alter table public.lt_daily_closings enable row level security;

create policy lt_self_member on public.lt_members for select to authenticated
using (user_id=(select auth.uid()));
create policy lt_product_read on public.lt_products for select to authenticated
using (exists(select 1 from public.lt_members m where m.user_id=(select auth.uid()) and m.active));
create policy lt_material_read on public.lt_materials for select to authenticated
using (exists(select 1 from public.lt_members m where m.user_id=(select auth.uid()) and m.active));
create policy lt_bom_read on public.lt_bom for select to authenticated
using (exists(select 1 from public.lt_members m where m.user_id=(select auth.uid()) and m.active));
create policy lt_order_read on public.lt_orders for select to authenticated
using (exists(select 1 from public.lt_members m where m.user_id=(select auth.uid()) and m.active));
create policy lt_item_read on public.lt_order_items for select to authenticated
using (exists(select 1 from public.lt_members m where m.user_id=(select auth.uid()) and m.active));
create policy lt_move_read on public.lt_stock_moves for select to authenticated
using (exists(select 1 from public.lt_members m where m.user_id=(select auth.uid()) and m.active));
-- Owner-only financial tables, prices and editing product/BOM/stock master.
create policy lt_cost_owner on public.lt_material_costs for all to authenticated
using (exists(select 1 from public.lt_members m where m.user_id=(select auth.uid()) and m.role='owner' and m.active))
with check (exists(select 1 from public.lt_members m where m.user_id=(select auth.uid()) and m.role='owner' and m.active));
create policy lt_fin_owner on public.lt_order_financials for all to authenticated
using (exists(select 1 from public.lt_members m where m.user_id=(select auth.uid()) and m.role='owner' and m.active))
with check (exists(select 1 from public.lt_members m where m.user_id=(select auth.uid()) and m.role='owner' and m.active));
create policy lt_purchase_owner on public.lt_purchases for all to authenticated
using (exists(select 1 from public.lt_members m where m.user_id=(select auth.uid()) and m.role='owner' and m.active))
with check (exists(select 1 from public.lt_members m where m.user_id=(select auth.uid()) and m.role='owner' and m.active));
create policy lt_close_owner on public.lt_daily_closings for select to authenticated
using (exists(select 1 from public.lt_members m where m.user_id=(select auth.uid()) and m.role='owner' and m.active));
create policy lt_product_owner_write on public.lt_products for all to authenticated
using (exists(select 1 from public.lt_members m where m.user_id=(select auth.uid()) and m.role='owner' and m.active))
with check (exists(select 1 from public.lt_members m where m.user_id=(select auth.uid()) and m.role='owner' and m.active));
create policy lt_material_owner_write on public.lt_materials for all to authenticated
using (exists(select 1 from public.lt_members m where m.user_id=(select auth.uid()) and m.role='owner' and m.active))
with check (exists(select 1 from public.lt_members m where m.user_id=(select auth.uid()) and m.role='owner' and m.active));
create policy lt_bom_owner_write on public.lt_bom for all to authenticated
using (exists(select 1 from public.lt_members m where m.user_id=(select auth.uid()) and m.role='owner' and m.active))
with check (exists(select 1 from public.lt_members m where m.user_id=(select auth.uid()) and m.role='owner' and m.active));
-- Prevent direct raw stock edits by staff AND owner: only receive or fulfil via RPC.
-- No public API privilege on on_hand, material cost, gross, COGS or purchase rows.
-- Only validated RPCs modify those fields; staff cannot bypass this via REST.
-- No direct INSERT/UPDATE stock movements, and no direct INSERT/UPDATE orders.

-- Authenticated RPCs with strict role checks. SECURITY DEFINER required for atomic
-- order + stock + HPP writes that cannot be permitted to staff through direct table grants.
-- SET search_path='' and schema-qualify all objects. Explicit role checks before writes.
create or replace function public.lt_create_order(
  p_order_ref text,p_channel text,p_note text,p_lines jsonb
) returns uuid language plpgsql security definer set search_path='' as $$
declare
  v_uid uuid := auth.uid();
  v_role text;
  v_order_id uuid;
  v_gross numeric(14,2) := 0;
  v_line jsonb;
  v_product record;
  v_qty integer;
  v_count integer := 0;
begin
  select m.role into v_role from public.lt_members m where m.user_id=v_uid and m.active;
  if v_role not in ('owner','staff') or v_role is null then raise exception 'Akses ditolak'; end if;
  if p_channel not in ('GoFood','GrabFood','ShopeeFood','Langsung','Lainnya')
     or char_length(trim(coalesce(p_order_ref,''))) not between 1 and 80
     or char_length(coalesce(p_note,''))>500 then raise exception 'Input pesanan salah'; end if;
  if jsonb_typeof(p_lines)<>'array' or jsonb_array_length(p_lines) not between 1 and 30 then raise exception 'Isi 1–30 baris produk'; end if;

  insert into public.lt_orders(order_ref,channel,note,created_by)
  values (trim(p_order_ref),p_channel,coalesce(p_note,''),v_uid)
  returning id into v_order_id;
  for v_line in select value from jsonb_array_elements(p_lines) loop
    v_count := v_count + 1;
    if jsonb_typeof(v_line)<>'object' or not (v_line ? 'product_id') or not (v_line ? 'qty')
       then raise exception 'Baris produk tidak valid'; end if;
    v_qty := (v_line->>'qty')::integer;
    if v_qty not between 1 and 100 then raise exception 'Jumlah per menu harus 1–100'; end if;
    select p.id,p.price into v_product from public.lt_products p
      where p.id=(v_line->>'product_id')::uuid and p.active;
    if not found then raise exception 'Menu tidak tersedia'; end if;
    insert into public.lt_order_items(order_id,product_id,qty,note)
      values(v_order_id,v_product.id,v_qty,left(coalesce(v_line->>'note',''),300));
    v_gross := v_gross + v_product.price*v_qty;
  end loop;
  insert into public.lt_order_financials(order_id,gross)
  values(v_order_id,v_gross);
  return v_order_id;
end $$;

create or replace function public.lt_transition_order(
 p_order_id uuid,p_action text
) returns text language plpgsql security definer set search_path='' as $$
declare
  v_uid uuid := auth.uid();
  v_role text;
  v_order public.lt_orders%rowtype;
  v_mat record;
  v_cogs numeric(14,2):=0;
  v_bad integer;
begin
  select role into v_role from public.lt_members where user_id=v_uid and active;
  if v_role not in ('owner','staff') or v_role is null then raise exception 'Akses ditolak'; end if;
  select * into v_order from public.lt_orders where id=p_order_id for update;
  if not found then raise exception 'Pesanan tidak ditemukan'; end if;
  if p_action='start' and v_order.status='new' then
    update public.lt_orders set status='preparing' where id=p_order_id;
    return 'preparing';
  elsif p_action='cancel' and v_order.status in ('new','preparing') then
    update public.lt_orders set status='cancelled',cancelled_at=now() where id=p_order_id;
    return 'cancelled';
  elsif p_action='handoff' and v_order.status='ready' then
    update public.lt_orders set status='handed_off',handed_off_at=now() where id=p_order_id;
    return 'handed_off';
  elsif p_action='ready' and v_order.status in ('new','preparing') then
    -- No sale without a BOM for every product. Missing BOM can silently hide HPP.
    select count(*) into v_bad
      from public.lt_order_items oi
      where oi.order_id=p_order_id
        and not exists(select 1 from public.lt_bom b where b.product_id=oi.product_id);
    if v_bad>0 then raise exception 'Resep biaya menu belum disiapkan'; end if;
    -- Lock materials in deterministic order to prevent double-spending inventory.
    for v_mat in
      select b.material_id,sum(b.qty_per_unit*oi.qty)::numeric(14,3) as need
      from public.lt_order_items oi join public.lt_bom b on b.product_id=oi.product_id
      where oi.order_id=p_order_id group by b.material_id order by b.material_id
    loop
      perform 1 from public.lt_materials m where m.id=v_mat.material_id for update;
      if not found then raise exception 'Bahan tidak ditemukan'; end if;
      if (select qty_on_hand from public.lt_materials where id=v_mat.material_id)<v_mat.need then
         raise exception 'Stok bahan tidak cukup'; end if;
      if not exists(select 1 from public.lt_material_costs where material_id=v_mat.material_id)
        then raise exception 'Harga bahan belum dilengkapi'; end if;
      select v_cogs + v_mat.need*c.avg_cost_per_unit into v_cogs
      from public.lt_material_costs c where c.material_id=v_mat.material_id;
      update public.lt_materials set qty_on_hand=qty_on_hand-v_mat.need where id=v_mat.material_id;
      insert into public.lt_stock_moves(material_id,qty_delta,reason,order_id,created_by)
      values(v_mat.material_id,-v_mat.need,'order',p_order_id,v_uid);
    end loop;
    update public.lt_order_financials set cogs=round(v_cogs,2),updated_at=now() where order_id=p_order_id;
    update public.lt_orders set status='ready',ready_at=now() where id=p_order_id;
    return 'ready';
  else
    raise exception 'Transisi tidak diperbolehkan dari status saat ini';
  end if;
end $$;

create or replace function public.lt_record_purchase(
 p_description text,p_kind text,p_amount numeric,p_purchased_on date,
 p_material_id uuid default null,p_qty numeric default null,p_received_on date default null,
 p_life_months integer default null,p_salvage numeric default 0,p_service_on date default null
) returns uuid language plpgsql security definer set search_path='' as $$
declare
 v_uid uuid:=auth.uid();v_owner boolean;v_id uuid;v_oldqty numeric;v_oldprice numeric;v_cost numeric;
begin
 select exists(select 1 from public.lt_members where user_id=v_uid and role='owner' and active) into v_owner;
 if not v_owner then raise exception 'Hanya owner'; end if;
 if p_received_on is not null and p_received_on>(now() at time zone 'Asia/Jakarta')::date then raise exception 'Belum bisa terima stok di masa depan'; end if;
 if p_kind not in ('ingredient','packaging','equipment','operating') or p_amount<=0 or p_amount>100000000000
   or length(trim(coalesce(p_description,''))) not between 1 and 200
   or p_purchased_on is null then raise exception 'Pembelian tidak valid'; end if;
 if p_material_id is not null and (p_qty is null or p_qty<=0) then raise exception 'Jumlah bahan harus lebih dari 0'; end if;
 if p_kind not in ('ingredient','packaging') and p_material_id is not null then raise exception 'Barang stok hanya bahan/kemasan'; end if;
 insert into public.lt_purchases(description,kind,amount,purchased_on,material_id,material_qty,received_on,asset_life_months,asset_salvage,service_on,created_by)
 values(trim(p_description),p_kind,p_amount,p_purchased_on,p_material_id,p_qty,p_received_on,p_life_months,coalesce(p_salvage,0),p_service_on,v_uid)
 returning id into v_id;
 if p_material_id is not null and p_received_on is not null then
   select qty_on_hand into v_oldqty from public.lt_materials where id=p_material_id for update;
   if not found then raise exception 'Bahan tidak ditemukan'; end if;
   select avg_cost_per_unit into v_oldprice from public.lt_material_costs where material_id=p_material_id for update;
   if not found then
     insert into public.lt_material_costs(material_id,avg_cost_per_unit) values (p_material_id,0);
     v_oldprice:=0;
   end if;
   v_cost:=(v_oldqty*v_oldprice+p_amount)/ (v_oldqty+p_qty);
   update public.lt_material_costs set avg_cost_per_unit=round(v_cost,4),updated_at=now() where material_id=p_material_id;
   update public.lt_materials set qty_on_hand=qty_on_hand+p_qty where id=p_material_id;
   insert into public.lt_stock_moves(material_id,qty_delta,reason,created_by)
      values(p_material_id,p_qty,'purchase',v_uid);
 end if;
 return v_id;
end $$;

create or replace function public.lt_receive_purchase(
 p_purchase_id uuid,p_received_on date
) returns boolean language plpgsql security definer set search_path='' as $$
declare
 v_uid uuid:=auth.uid();v_owner boolean;v_p public.lt_purchases%rowtype;v_qty numeric;v_price numeric;v_cost numeric;
begin
 select exists(select 1 from public.lt_members where user_id=v_uid and role='owner' and active) into v_owner;
 if not v_owner then raise exception 'Hanya owner'; end if;
 select * into v_p from public.lt_purchases where id=p_purchase_id for update;
 if not found or v_p.material_id is null or v_p.received_on is not null
    or p_received_on is null or p_received_on < v_p.purchased_on
    or p_received_on>(now() at time zone 'Asia/Jakarta')::date then
   raise exception 'Pembelian tidak dapat diterima'; end if;
 select qty_on_hand into v_qty from public.lt_materials where id=v_p.material_id for update;
 if not found then raise exception 'Bahan tidak ditemukan'; end if;
 select avg_cost_per_unit into v_price from public.lt_material_costs where material_id=v_p.material_id for update;
 if not found then
   insert into public.lt_material_costs(material_id,avg_cost_per_unit) values(v_p.material_id,0);
   v_price:=0;
 end if;
 v_cost:=(v_qty*v_price+v_p.amount)/(v_qty+v_p.material_qty);
 update public.lt_material_costs set avg_cost_per_unit=round(v_cost,4),updated_at=now() where material_id=v_p.material_id;
 update public.lt_materials set qty_on_hand=qty_on_hand+v_p.material_qty where id=v_p.material_id;
 update public.lt_purchases set received_on=p_received_on where id=v_p.id;
 insert into public.lt_stock_moves(material_id,qty_delta,reason,created_by) values(v_p.material_id,v_p.material_qty,'purchase',v_uid);
 return true;
end $$;

create or replace function public.lt_close_day(p_day date,p_note text default '')
returns jsonb language plpgsql security definer set search_path='' as $$
declare
 v_uid uuid:=auth.uid();v_owner boolean;v_agg record;v_exp numeric;v_paid numeric;v_payout numeric;v_missing integer;v_open integer;
begin
 select exists(select 1 from public.lt_members where user_id=v_uid and role='owner' and active) into v_owner;
 if not v_owner then raise exception 'Hanya owner'; end if;
 if p_day is null or p_day>(now() at time zone 'Asia/Jakarta')::date then raise exception 'Tanggal closing tidak valid'; end if;
 select count(*)::integer as cnt,coalesce(sum(f.gross),0) as gross,
   coalesce(sum(f.discount),0) as discounts,coalesce(sum(f.platform_fee),0) as fees,
   coalesce(sum(f.other_fee),0) as other,coalesce(sum(f.cogs),0) as cogs
 into v_agg
 from public.lt_orders o join public.lt_order_financials f on f.order_id=o.id
 where o.status='handed_off' and (o.handed_off_at at time zone 'Asia/Jakarta')::date=p_day;
 select count(*) into v_missing
 from public.lt_orders o join public.lt_order_financials f on f.order_id=o.id
 where o.status='handed_off' and (o.handed_off_at at time zone 'Asia/Jakarta')::date=p_day and not f.fees_confirmed;
 select count(*) into v_open from public.lt_orders o
 where o.status in ('new','preparing','ready') and (o.created_at at time zone 'Asia/Jakarta')::date<=p_day;
 select coalesce(sum(amount),0) into v_exp from public.lt_purchases
   where kind='operating' and purchased_on=p_day;
 select coalesce(sum(amount),0) into v_paid from public.lt_purchases where purchased_on=p_day;
 select coalesce(sum(gross-discount-platform_fee-other_fee),0) into v_payout
 from public.lt_order_financials where payout_received_at=p_day;
 insert into public.lt_daily_closings(day,orders_completed,gross,discounts,platform_fees,other_fees,cogs,
  operating_expenses,purchases_paid,payouts_received,missing_financials,still_open_orders,note,closed_by)
 values(p_day,v_agg.cnt,v_agg.gross,v_agg.discounts,v_agg.fees,v_agg.other,v_agg.cogs,
  v_exp,v_paid,v_payout,v_missing,v_open,left(coalesce(p_note,''),500),v_uid)
 on conflict(day) do update set orders_completed=excluded.orders_completed,gross=excluded.gross,
  discounts=excluded.discounts,platform_fees=excluded.platform_fees,other_fees=excluded.other_fees,
  cogs=excluded.cogs,operating_expenses=excluded.operating_expenses,purchases_paid=excluded.purchases_paid,
  payouts_received=excluded.payouts_received,missing_financials=excluded.missing_financials,
  still_open_orders=excluded.still_open_orders,note=excluded.note,closed_by=excluded.closed_by,closed_at=now();
 return pg_catalog.jsonb_build_object('day',p_day,'completed',v_agg.cnt,'missing_financials',v_missing,'still_open_orders',v_open);
end $$;

revoke all on function public.lt_create_order(text,text,text,jsonb) from public,anon;
revoke all on function public.lt_transition_order(uuid,text) from public,anon;
revoke all on function public.lt_record_purchase(text,text,numeric,date,uuid,numeric,date,integer,numeric,date) from public,anon;
revoke all on function public.lt_receive_purchase(uuid,date) from public,anon;
revoke all on function public.lt_close_day(date,text) from public,anon;
grant execute on function public.lt_create_order(text,text,text,jsonb),
 public.lt_transition_order(uuid,text),
 public.lt_record_purchase(text,text,numeric,date,uuid,numeric,date,integer,numeric,date),
 public.lt_receive_purchase(uuid,date),
 public.lt_close_day(date,text) to authenticated;
