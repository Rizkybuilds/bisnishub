begin;
alter table app.quote_versions add column issuer_snapshot jsonb not null default '{}'::jsonb;
create function app.capture_quote_issuer() returns trigger language plpgsql set search_path=app,pg_temp as $$
begin
 select jsonb_build_object('brand_name',b.name,'brand_code',b.code,'organization_name',o.display_name)
 into NEW.issuer_snapshot from app.quotes q join app.brands b on b.id=q.brand_id join app.organizations o on o.id=q.organization_id where q.id=NEW.quote_id;
 if NEW.issuer_snapshot is null then raise exception 'Quote issuer not found'; end if;
 return NEW;
end; $$;
revoke all on function app.capture_quote_issuer() from public,anon,authenticated;
create trigger quote_capture_issuer before insert on app.quote_versions for each row execute function app.capture_quote_issuer();
commit;
