begin;
create table app.design_assets (
 id uuid primary key default gen_random_uuid(),
 organization_id uuid not null references app.organizations(id),
 brand_id uuid not null references app.brands(id),
 code text not null check(code ~ '^DEMO-[A-Z0-9-]{2,32}$'),
 is_demo boolean not null default true check(is_demo),
 status text not null default 'DRAFT' check(status='DRAFT'),
 current_version integer not null default 1 check(current_version>0),
 created_at timestamptz not null default now(),
 unique(organization_id,code)
);
create table app.design_asset_versions (
 id uuid primary key default gen_random_uuid(),
 asset_id uuid not null references app.design_assets(id),
 version_number integer not null check(version_number>0),
 title text not null check(length(btrim(title)) between 2 and 120),
 theme text not null check(theme in ('CREATIVE','COFFEE','BASIC','CUSTOM')),
 story text not null check(length(story)<=2000),
 placement text not null check(placement in ('FRONT','BACK','NONE')),
 created_by uuid not null references app.users(id),
 request_id uuid not null,
 request_payload jsonb not null,
 created_at timestamptz not null default now(),
 unique(asset_id,version_number), unique(created_by,request_id)
);
alter table app.design_assets add constraint design_current_version_fk foreign key(id,current_version)
 references app.design_asset_versions(asset_id,version_number) deferrable initially deferred;
create index on app.design_assets(organization_id,brand_id,created_at desc,id);

create function app.design_history_guard() returns trigger language plpgsql set search_path='' as $$
begin raise exception 'Design history is immutable'; end; $$;
create trigger design_version_immutable before update or delete on app.design_asset_versions for each row execute function app.design_history_guard();
create trigger design_asset_no_delete before delete on app.design_assets for each row execute function app.design_history_guard();

create function app.save_demo_design(p_org uuid,p_actor uuid,p_request uuid,p_asset uuid,p_expected integer,p_data jsonb)
 returns uuid language plpgsql security definer set search_path='' as $$
declare a app.design_assets; old app.design_asset_versions; b uuid; payload jsonb; next_version integer;
begin
 if app.quote_actor_role(p_org,p_actor) not in ('OWNER','ADMIN') then raise exception 'Design access denied'; end if;
 select id into b from app.brands where organization_id=p_org and code='TS' and status='ACTIVE';
 if b is null then raise exception 'Active TeeStock brand required'; end if;
 if p_request is null or p_expected is null then raise exception 'Request and expected revision required'; end if;
 if jsonb_typeof(p_data) is distinct from 'object' or
    coalesce(p_data->>'code','') !~ '^DEMO-[A-Z0-9-]{2,32}$' or
    coalesce(length(btrim(p_data->>'title')),0) not between 2 and 120 or
    coalesce(p_data->>'theme','') not in ('CREATIVE','COFFEE','BASIC','CUSTOM') or
    coalesce(p_data->>'placement','') not in ('FRONT','BACK','NONE') or
    jsonb_typeof(p_data->'story') is distinct from 'string' or length(p_data->>'story')>2000 then
   raise exception 'Invalid design metadata';
 end if;
 payload:=jsonb_build_object('org',p_org,'asset',p_asset,'expected',p_expected,'data',p_data);
 perform pg_advisory_xact_lock(hashtextextended(p_actor::text||p_request::text,0));
 select * into old from app.design_asset_versions where created_by=p_actor and request_id=p_request;
 if found then
   if old.request_payload is distinct from payload then raise exception 'Request payload mismatch'; end if;
   return old.asset_id;
 end if;
 if p_asset is null then
   if p_expected<>0 then raise exception 'Expected revision must be zero'; end if;
   insert into app.design_assets(organization_id,brand_id,code) values(p_org,b,p_data->>'code') returning * into a;
   next_version:=1;
 else
   select * into a from app.design_assets where id=p_asset and organization_id=p_org and brand_id=b for update;
   if not found then raise exception 'Design not found'; end if;
   if a.current_version<>p_expected then raise exception 'Design changed; reload before revising'; end if;
   if a.code<>p_data->>'code' then raise exception 'Design code is immutable'; end if;
   next_version:=a.current_version+1;
   update app.design_assets set current_version=next_version where id=a.id;
 end if;
 insert into app.design_asset_versions(asset_id,version_number,title,theme,story,placement,created_by,request_id,request_payload)
 values(a.id,next_version,btrim(p_data->>'title'),p_data->>'theme',p_data->>'story',p_data->>'placement',p_actor,p_request,payload);
 return a.id;
end; $$;
alter table app.design_assets enable row level security;
alter table app.design_asset_versions enable row level security;
revoke all on app.design_assets,app.design_asset_versions from public,anon,authenticated,service_role;
grant select on app.design_assets,app.design_asset_versions to service_role;
revoke all on function app.design_history_guard(), app.save_demo_design(uuid,uuid,uuid,uuid,integer,jsonb) from public,anon,authenticated,service_role;
grant execute on function app.save_demo_design(uuid,uuid,uuid,uuid,integer,jsonb) to service_role;
commit;
