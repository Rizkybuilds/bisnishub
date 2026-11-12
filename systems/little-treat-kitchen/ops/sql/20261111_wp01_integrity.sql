-- LITTLE TREAT WP-01 · transactional idempotency and actual cash payouts.
-- Apply ONLY to the dedicated project ujmojkgipvckwdegcoph.
-- Additive migration. No existing purchases, orders or daily closings are removed.
-- Previously recorded lt_order_financials.payout_received_at is preserved
-- for historical compatibility, but is NOT used as actual cash received.

create schema if not exists lt_private;
revoke all on schema lt_private from public,anon,authenticated;

create table if not exists public.lt_mutation_receipts (
  request_id uuid primary key,
  actor uuid not null references auth.users(id),
  kind text not null check (kind in ('purchase','waste','order','payout')),
  payload_hash text not null check (length(payload_hash)=32),
  result_id uuid,
  created_at timestamptz not null default now()
);
alter table public.lt_mutation_receipts enable row level security;
revoke all on public.lt_mutation_receipts from public, anon, authenticated;

create table if not exists public.lt_payout_receipts (
  id uuid primary key default gen_random_uuid(),
  channel text not null check (channel in ('GoFood','GrabFood','ShopeeFood','Lainnya')),
  received_on date not null,
  amount numeric(14,2) not null check (amount>0 and amount<=999999999999.99),
  statement_ref text not null check (length(btrim(statement_ref)) between 2 and 100),
  note text not null default '' check (length(note)<=500),
  recorded_by uuid not null references auth.users(id),
  created_at timestamptz not null default now()
);
create unique index if not exists lt_payout_receipts_ref_unique
  on public.lt_payout_receipts(channel, lower(btrim(statement_ref)));
create index if not exists lt_payout_receipts_date_idx
  on public.lt_payout_receipts(received_on);
alter table public.lt_payout_receipts enable row level security;
revoke all on public.lt_payout_receipts from public,anon,authenticated;
grant select on public.lt_payout_receipts to authenticated;
create policy lt_payout_owner_read on public.lt_payout_receipts
 for select to authenticated
 using(exists(select 1 from public.lt_members m
   where m.user_id=(select auth.uid()) and m.role='owner' and m.active));

-- This helper has SECURITY INVOKER, lives in a non-exposed schema, and can
-- only be called from the role-checked SECURITY DEFINER transaction RPCs.
create or replace function lt_private.claim_mutation(
 p_request_id uuid, p_kind text, p_payload jsonb
) returns uuid language plpgsql security invoker set search_path='' as $fn$
declare
 v_actor uuid := auth.uid();
 v_hash text;
 v_existing public.lt_mutation_receipts%rowtype;
begin
 if v_actor is null or p_request_id is null or p_payload is null
   or p_kind not in ('purchase','waste','order','payout')
   then raise exception 'Permintaan transaksi tidak valid'; end if;
 v_hash:=pg_catalog.md5(p_payload::text);
 -- Unique constraint locks duplicate concurrent requests. The second
 -- transaction waits for the first to commit/rollback before reading.
 insert into public.lt_mutation_receipts(request_id,actor,kind,payload_hash)
 values(p_request_id,v_actor,p_kind,v_hash) on conflict(request_id) do nothing;
 if found then return null; end if;
 select * into v_existing from public.lt_mutation_receipts
   where request_id=p_request_id;
 if not found or v_existing.actor<>v_actor or v_existing.kind<>p_kind
    or v_existing.payload_hash<>v_hash
   then raise exception 'ID permintaan telah dipakai untuk transaksi berbeda'; end if;
 if v_existing.result_id is null
   then raise exception 'Hasil transaksi belum diketahui, periksa catatan'; end if;
 return v_existing.result_id;
end $fn$;
revoke all on function lt_private.claim_mutation(uuid,text,jsonb)
 from public,anon,authenticated;

create or replace function public.lt_record_purchase_v2(
 p_request_id uuid,
 p_description text, p_kind text, p_amount numeric, p_purchased_on date,
 p_material_id uuid default null, p_qty numeric default null,
 p_received_on date default null, p_life_months integer default null,
 p_salvage numeric default 0, p_service_on date default null
) returns uuid language plpgsql security definer set search_path='' as $fn$
declare
 v_uid uuid:=auth.uid(); v_id uuid; v_payload jsonb;
begin
 if not exists (select 1 from public.lt_members
   where user_id=v_uid and role='owner' and active)
   then raise exception 'Hanya owner'; end if;
 v_payload:=pg_catalog.jsonb_build_object(
  'description',p_description,'kind',p_kind,'amount',p_amount,
  'purchased_on',p_purchased_on,'material_id',p_material_id,'qty',p_qty,
  'received_on',p_received_on,'life_months',p_life_months,
  'salvage',p_salvage,'service_on',p_service_on);
 v_id:=lt_private.claim_mutation(p_request_id,'purchase',v_payload);
 if v_id is not null then return v_id; end if;
 v_id:=public.lt_record_purchase(p_description,p_kind,p_amount,p_purchased_on,
   p_material_id,p_qty,p_received_on,p_life_months,p_salvage,p_service_on);
 update public.lt_mutation_receipts set result_id=v_id where request_id=p_request_id;
 return v_id;
end $fn$;

create or replace function public.lt_record_waste_v2(
 p_request_id uuid, p_material_id uuid, p_qty numeric, p_note text default ''
) returns uuid language plpgsql security definer set search_path='' as $fn$
declare v_uid uuid:=auth.uid();v_id uuid;v_payload jsonb;
begin
 if not exists(select 1 from public.lt_members
   where user_id=v_uid and role in ('owner','staff') and active)
   then raise exception 'Akses ditolak'; end if;
 v_payload:=pg_catalog.jsonb_build_object(
  'material_id',p_material_id,'qty',p_qty,'note',p_note);
 v_id:=lt_private.claim_mutation(p_request_id,'waste',v_payload);
 if v_id is not null then return v_id; end if;
 v_id:=public.lt_record_waste(p_material_id,p_qty,p_note);
 update public.lt_mutation_receipts set result_id=v_id where request_id=p_request_id;
 return v_id;
end $fn$;

create or replace function public.lt_create_order_v2(
 p_request_id uuid, p_order_ref text, p_channel text, p_note text, p_lines jsonb
) returns uuid language plpgsql security definer set search_path='' as $fn$
declare v_uid uuid:=auth.uid();v_id uuid;v_payload jsonb;
begin
 if not exists(select 1 from public.lt_members
   where user_id=v_uid and role in ('owner','staff') and active)
   then raise exception 'Akses ditolak'; end if;
 v_payload:=pg_catalog.jsonb_build_object(
  'order_ref',p_order_ref,'channel',p_channel,'note',p_note,'lines',p_lines);
 v_id:=lt_private.claim_mutation(p_request_id,'order',v_payload);
 if v_id is not null then return v_id; end if;
 v_id:=public.lt_create_order(p_order_ref,p_channel,p_note,p_lines);
 update public.lt_mutation_receipts set result_id=v_id where request_id=p_request_id;
 return v_id;
end $fn$;

create or replace function public.lt_record_payout(
 p_request_id uuid, p_channel text, p_received_on date,
 p_amount numeric, p_statement_ref text, p_note text default ''
) returns uuid language plpgsql security definer set search_path='' as $fn$
declare v_uid uuid:=auth.uid();v_id uuid;v_payload jsonb;
begin
 if not exists(select 1 from public.lt_members
   where user_id=v_uid and role='owner' and active)
   then raise exception 'Hanya owner'; end if;
 if p_channel not in ('GoFood','GrabFood','ShopeeFood','Lainnya') or p_received_on is null
  or p_received_on>(now() at time zone 'Asia/Jakarta')::date
  or p_amount is null or p_amount<=0 or p_amount>999999999999.99
  or length(btrim(coalesce(p_statement_ref,''))) not between 2 and 100
  or length(coalesce(p_note,''))>500
  then raise exception 'Data payout tidak valid'; end if;
 v_payload:=pg_catalog.jsonb_build_object(
  'channel',p_channel,'received_on',p_received_on,'amount',p_amount,
  'statement_ref',btrim(p_statement_ref),'note',coalesce(p_note,''));
 v_id:=lt_private.claim_mutation(p_request_id,'payout',v_payload);
 if v_id is not null then return v_id; end if;
 insert into public.lt_payout_receipts(channel,received_on,amount,statement_ref,note,recorded_by)
 values(p_channel,p_received_on,p_amount,btrim(p_statement_ref),coalesce(p_note,''),v_uid)
 returning id into v_id;
 update public.lt_mutation_receipts set result_id=v_id where request_id=p_request_id;
 return v_id;
end $fn$;

-- Snapshot current finance computation with one substantive change:
-- payouts_received uses ACTUAL bank/platform disbursements, not derived sales.
create or replace function public.lt_close_day(p_day date,p_note text default '')
returns jsonb language plpgsql security definer set search_path='' as $fn$
declare
 v_uid uuid:=auth.uid();v_owner boolean;v_agg record;v_exp numeric;v_paid numeric;v_payout numeric;v_waste numeric;v_missing integer;v_open integer;
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
 select coalesce(sum(cost),0) into v_waste from public.lt_waste_events
   where (created_at at time zone 'Asia/Jakarta')::date=p_day;
 select coalesce(sum(amount),0) into v_exp from public.lt_purchases
   where kind='operating' and purchased_on=p_day;
 select coalesce(sum(amount),0) into v_paid from public.lt_purchases where purchased_on=p_day;
 select coalesce(sum(amount),0) into v_payout from public.lt_payout_receipts
   where received_on=p_day;
 insert into public.lt_daily_closings(day,orders_completed,gross,discounts,platform_fees,other_fees,cogs,
  waste_cost,operating_expenses,purchases_paid,payouts_received,missing_financials,still_open_orders,note,closed_by)
 values(p_day,v_agg.cnt,v_agg.gross,v_agg.discounts,v_agg.fees,v_agg.other,v_agg.cogs,
  v_waste,v_exp,v_paid,v_payout,v_missing,v_open,left(coalesce(p_note,''),500),v_uid)
 on conflict(day) do update set orders_completed=excluded.orders_completed,gross=excluded.gross,
  discounts=excluded.discounts,platform_fees=excluded.platform_fees,other_fees=excluded.other_fees,
  cogs=excluded.cogs,waste_cost=excluded.waste_cost,operating_expenses=excluded.operating_expenses,purchases_paid=excluded.purchases_paid,
  payouts_received=excluded.payouts_received,missing_financials=excluded.missing_financials,
  still_open_orders=excluded.still_open_orders,note=excluded.note,closed_by=excluded.closed_by,closed_at=now();
 return pg_catalog.jsonb_build_object('day',p_day,'completed',v_agg.cnt,'missing_financials',v_missing,'still_open_orders',v_open,'actual_payouts',v_payout);
end $fn$;

revoke all on function public.lt_record_purchase_v2(uuid,text,text,numeric,date,uuid,numeric,date,integer,numeric,date) from public,anon;
revoke all on function public.lt_record_waste_v2(uuid,uuid,numeric,text) from public,anon;
revoke all on function public.lt_create_order_v2(uuid,text,text,text,jsonb) from public,anon;
revoke all on function public.lt_record_payout(uuid,text,date,numeric,text,text) from public,anon;
grant execute on function public.lt_record_purchase_v2(uuid,text,text,numeric,date,uuid,numeric,date,integer,numeric,date),
 public.lt_record_waste_v2(uuid,uuid,numeric,text),
 public.lt_create_order_v2(uuid,text,text,text,jsonb),
 public.lt_record_payout(uuid,text,date,numeric,text,text)
 to authenticated;
