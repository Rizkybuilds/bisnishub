-- Require completed handoff and fee verification before owner records payout.
-- Prevent future-dated payout timestamps. Runs as caller (no RLS bypass).
create or replace function public.lt_guard_payout()
returns trigger language plpgsql security invoker set search_path='' as $guard$
begin
 if new.payout_received_at is not null then
   if new.payout_received_at > (now() at time zone 'Asia/Jakarta')::date
      then raise exception 'Tanggal payout tidak boleh di masa depan'; end if;
   if not new.fees_confirmed
      then raise exception 'Verifikasi biaya platform sebelum konfirmasi payout'; end if;
   if not exists (
     select 1 from public.lt_orders o
     where o.id=new.order_id and o.status='handed_off'
   ) then raise exception 'Payout hanya untuk pesanan yang telah diserahkan'; end if;
 end if;
 return new;
end $guard$;
revoke all on function public.lt_guard_payout() from PUBLIC,anon,authenticated;
drop trigger if exists lt_guard_payout_trg on public.lt_order_financials;
create trigger lt_guard_payout_trg before insert or update of payout_received_at,fees_confirmed
on public.lt_order_financials for each row execute function public.lt_guard_payout();
