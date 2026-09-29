begin;
create table app.quotes (
 id uuid primary key default gen_random_uuid(),
 organization_id uuid not null references app.organizations(id) on delete restrict,
 brand_id uuid not null references app.brands(id) on delete restrict,
 customer_account_id uuid not null references app.customer_accounts(id) on delete restrict,
 requirement_id uuid not null references app.requirements(id) on delete restrict,
 quote_number text not null, current_version_id uuid,
 created_at timestamptz not null default now(),
 unique(organization_id,quote_number)
);
create table app.quote_versions (
 id uuid primary key default gen_random_uuid(), quote_id uuid not null references app.quotes(id) on delete restrict,
 version_number integer not null check(version_number>0),
 requirement_version_id uuid not null references app.requirement_versions(id) on delete restrict,
 status text not null default 'DRAFT' check(status in ('DRAFT','SENT','ACCEPTED','REJECTED','EXPIRED','SUPERSEDED','CANCELLED')),
 currency text not null default 'IDR' check(currency='IDR'),
 subtotal bigint not null check(subtotal>0), discount_total bigint not null check(discount_total>=0 and discount_total<subtotal),
 shipping_total bigint not null check(shipping_total>=0), grand_total bigint not null check(grand_total>0),
 estimated_cost_total bigint not null check(estimated_cost_total>0), estimated_gross_profit bigint not null,
 pricing_guard text not null check(pricing_guard in ('TARGET','CAUTION','WARNING','APPROVAL_REQUIRED')),
 terms_snapshot jsonb not null, customer_snapshot jsonb not null,
 valid_until date not null, created_by_user_id uuid not null references app.users(id) on delete restrict,
 request_id uuid not null, request_payload jsonb not null,
 created_at timestamptz not null default now(), sent_at timestamptz,
 unique(quote_id,version_number), unique(quote_id,id), unique(created_by_user_id,request_id),
 check(grand_total::numeric=subtotal::numeric-discount_total+shipping_total),
 check(estimated_gross_profit::numeric=subtotal::numeric-discount_total-estimated_cost_total)
);
alter table app.quotes add constraint quote_current_version_fk foreign key(id,current_version_id) references app.quote_versions(quote_id,id) deferrable initially deferred;
create table app.quote_items (
 id uuid primary key default gen_random_uuid(), quote_version_id uuid not null references app.quote_versions(id) on delete restrict,
 description text not null, quantity integer not null check(quantity>0), unit text not null,
 unit_price bigint not null check(unit_price>=0), discount_total bigint not null check(discount_total>=0),
 subtotal bigint not null check(subtotal>0), specification jsonb not null,
 position integer not null default 1, unique(quote_version_id,position)
);
create table app.quote_cost_components (
 id uuid primary key default gen_random_uuid(), quote_item_id uuid not null references app.quote_items(id) on delete restrict,
 cost_type text not null check(cost_type in ('GARMENT','PRINTING','EMBROIDERY','LABEL','PACKAGING','SHIPPING','VENDOR','LABOR','OTHER','BUFFER')),
 description text not null, quantity integer not null check(quantity>0),
 unit_cost bigint not null check(unit_cost>=0), total_cost bigint not null check(total_cost>=0)
);
create table app.quote_price_approvals (
 id uuid primary key default gen_random_uuid(), quote_version_id uuid not null unique references app.quote_versions(id) on delete restrict,
 approved_by_user_id uuid not null references app.users(id) on delete restrict,
 reason text not null check(length(btrim(reason))>=5), created_at timestamptz not null default now()
);
create table app.quote_audit (
 id uuid primary key default gen_random_uuid(), organization_id uuid not null references app.organizations(id) on delete restrict,
 quote_version_id uuid not null references app.quote_versions(id) on delete restrict,
 actor_id uuid not null references app.users(id) on delete restrict, action text not null,
 details jsonb not null default '{}', created_at timestamptz not null default now()
);
create index on app.quotes(organization_id,brand_id,created_at desc);
create index on app.quote_cost_components(quote_item_id);
create index on app.quote_audit(quote_version_id,created_at);

create function app.quote_actor_role(p_org uuid,p_actor uuid) returns text language plpgsql security definer set search_path=app,pg_temp as $$
declare result text;
begin
 select r.code into result from app.organization_members m
 join app.users u on u.id=m.user_id and u.status='ACTIVE'
 join app.organizations o on o.id=m.organization_id and o.status='ACTIVE'
 join app.roles r on r.id=m.role_id and r.organization_id=m.organization_id
 where m.organization_id=p_org and m.user_id=p_actor and m.status='ACTIVE';
 if result is null then raise exception 'Active organization membership required'; end if;
 return result;
end; $$;
create function app.quote_snapshot_guard() returns trigger language plpgsql set search_path=app,pg_temp as $$
begin
 if TG_TABLE_NAME='quote_versions' and TG_OP='UPDATE' then
   if (to_jsonb(NEW)-array['status','sent_at']) is distinct from (to_jsonb(OLD)-array['status','sent_at']) then raise exception 'Quote snapshot is immutable; create a revision'; end if;
   if OLD.sent_at is not null and NEW.sent_at is distinct from OLD.sent_at then raise exception 'Sent timestamp is immutable'; end if;
   return NEW;
 end if;
 raise exception 'Quote history is append-only';
end; $$;
create trigger quote_version_guard before update or delete on app.quote_versions for each row execute function app.quote_snapshot_guard();
create trigger quote_item_guard before update or delete on app.quote_items for each row execute function app.quote_snapshot_guard();
create trigger quote_cost_guard before update or delete on app.quote_cost_components for each row execute function app.quote_snapshot_guard();
create trigger quote_approval_guard before update or delete on app.quote_price_approvals for each row execute function app.quote_snapshot_guard();
create trigger quote_audit_guard before update or delete on app.quote_audit for each row execute function app.quote_snapshot_guard();

create function app.save_quote_version(
 p_organization_id uuid,p_actor_id uuid,p_request_id uuid,p_requirement_version_id uuid,p_customer_id uuid,
 p_unit_price bigint,p_discount bigint,p_shipping bigint,p_costs jsonb,p_valid_until date,p_terms text,p_lead_time text,p_notes text,
 p_quote_id uuid default null,p_expected_version_id uuid default null
) returns jsonb language plpgsql security definer set search_path=app,pg_temp as $$
declare
 role_code text; req app.requirements%rowtype; rv app.requirement_versions%rowtype; q app.quotes%rowtype;
 old_version app.quote_versions%rowtype; customer app.customer_accounts%rowtype;
 payload jsonb; existing app.quote_versions%rowtype; c jsonb; cost numeric:=0; sub numeric; rev numeric; grand numeric; profit numeric; guard text;
 quote_id uuid; version_id uuid:=gen_random_uuid(); item_id uuid:=gen_random_uuid(); num integer:=1;
begin
 role_code:=app.quote_actor_role(p_organization_id,p_actor_id);
 if role_code not in ('OWNER','ADMIN','SALES') then raise exception 'Not authorized to create quotes'; end if;
 if p_request_id is null then raise exception 'Request ID required'; end if;
 payload:=jsonb_build_object('org',p_organization_id,'requirement',p_requirement_version_id,'customer',p_customer_id,'unit_price',p_unit_price::text,'discount',p_discount::text,'shipping',p_shipping::text,'costs',p_costs,'until',p_valid_until,'terms',p_terms,'lead_time',p_lead_time,'notes',p_notes,'quote',p_quote_id,'expected',p_expected_version_id);
 perform pg_advisory_xact_lock(hashtextextended(p_actor_id::text||p_request_id::text,0));
 select * into existing from app.quote_versions where created_by_user_id=p_actor_id and request_id=p_request_id;
 if found then
   if existing.request_payload is distinct from payload then raise exception 'Request ID was already used for different data'; end if;
   return jsonb_build_object('quote_id',existing.quote_id,'version_id',existing.id);
 end if;
 select * into rv from app.requirement_versions where id=p_requirement_version_id;
 select * into req from app.requirements where id=rv.requirement_id and organization_id=p_organization_id for update;
 if not found or req.status='CANCELLED' or req.current_version_id is distinct from rv.id then raise exception 'Current active requirement version required'; end if;
 if not exists(select 1 from app.brands where id=req.brand_id and organization_id=p_organization_id and status='ACTIVE') then raise exception 'Active brand required'; end if;
 select * into customer from app.customer_accounts where id=p_customer_id and organization_id=p_organization_id and status='ACTIVE';
 if not found then raise exception 'Active customer in this organization required'; end if;
 if req.customer_account_id is not null and req.customer_account_id<>p_customer_id then raise exception 'Customer must match requirement'; end if;
 if rv.quantity is null or rv.quantity<=0 then raise exception 'Requirement quantity required'; end if;
 if p_unit_price is null or p_discount is null or p_shipping is null or least(p_unit_price,p_discount,p_shipping)<0 then raise exception 'Invalid quote amounts'; end if;
 if p_valid_until is null or p_valid_until < (now() at time zone 'Asia/Jakarta')::date then raise exception 'Validity date must not be in the past'; end if;
 if coalesce(length(btrim(p_terms)),0)<2 or length(p_terms)>2000 or coalesce(length(btrim(p_lead_time)),0)<1 or length(p_lead_time)>200 or p_notes is null or length(p_notes)>2000 then raise exception 'Invalid quote terms'; end if;
 if jsonb_typeof(p_costs) is distinct from 'array' then raise exception 'Cost components required'; end if;
 if jsonb_array_length(p_costs) not between 1 and 30 then raise exception 'Cost components required'; end if;
 for c in select value from jsonb_array_elements(p_costs) loop
   if coalesce(c->>'cost_type','') not in ('GARMENT','PRINTING','EMBROIDERY','LABEL','PACKAGING','SHIPPING','VENDOR','LABOR','OTHER','BUFFER') or coalesce(length(btrim(c->>'description')),0)<2 or length(c->>'description')>200 then raise exception 'Invalid cost component'; end if;
   if coalesce(c->>'quantity','') !~ '^[0-9]+$' or coalesce(c->>'unit_cost','') !~ '^[0-9]+$' then raise exception 'Cost must use nonnegative integers'; end if;
   if (c->>'quantity')::numeric not between 1 and 2147483647 or (c->>'unit_cost')::numeric>9223372036854775807 then raise exception 'Cost amount out of range'; end if;
   cost:=cost+(c->>'quantity')::numeric*(c->>'unit_cost')::numeric;
 end loop;
 sub:=rv.quantity::numeric*p_unit_price; rev:=sub-p_discount; grand:=rev+p_shipping; profit:=rev-cost;
 if rev<=0 or cost<=0 or sub>9223372036854775807 or cost>9223372036854775807 or grand>9223372036854775807 then raise exception 'Invalid net revenue or estimated cost'; end if;
 guard:=case when profit*100<rev*20 then 'APPROVAL_REQUIRED' when profit*100<rev*25 then 'WARNING' when profit*100<rev*30 then 'CAUTION' else 'TARGET' end;
 if p_quote_id is not null then
   select * into q from app.quotes where id=p_quote_id and organization_id=p_organization_id for update;
   if not found or q.current_version_id is distinct from p_expected_version_id then raise exception 'Quote changed; reload before revising'; end if;
   if q.requirement_id<>req.id or q.brand_id<>req.brand_id or q.customer_account_id<>p_customer_id then raise exception 'Revision must keep requirement, brand and customer'; end if;
   select * into old_version from app.quote_versions where id=q.current_version_id;
   if old_version.status in ('ACCEPTED','CANCELLED') then raise exception 'Cannot revise terminal quote'; end if;
   quote_id:=q.id; num:=old_version.version_number+1;
   if old_version.status in ('DRAFT','SENT') then
     update app.quote_versions set status='SUPERSEDED' where id=old_version.id;
     insert into app.quote_audit(organization_id,quote_version_id,actor_id,action) values(p_organization_id,old_version.id,p_actor_id,'quote.superseded');
   end if;
 else
   if p_expected_version_id is not null then raise exception 'Unexpected previous version'; end if;
   insert into app.quotes(organization_id,brand_id,customer_account_id,requirement_id,quote_number)
   values(p_organization_id,req.brand_id,p_customer_id,req.id,app.generate_document_number(p_organization_id,req.brand_id,'QUO',extract(year from now())::integer,6)) returning id into quote_id;
 end if;
 insert into app.quote_versions(id,quote_id,version_number,requirement_version_id,subtotal,discount_total,shipping_total,grand_total,estimated_cost_total,estimated_gross_profit,pricing_guard,terms_snapshot,customer_snapshot,valid_until,created_by_user_id,request_id,request_payload)
 values(version_id,quote_id,num,rv.id,sub::bigint,p_discount,p_shipping,grand::bigint,cost::bigint,profit::bigint,guard,jsonb_build_object('payment_terms',p_terms,'lead_time',p_lead_time,'notes',p_notes),jsonb_build_object('display_name',customer.display_name,'legal_name',customer.legal_name,'email',customer.primary_email,'phone',customer.primary_phone),p_valid_until,p_actor_id,p_request_id,payload);
 insert into app.quote_items(id,quote_version_id,description,quantity,unit,unit_price,discount_total,subtotal,specification)
 values(item_id,version_id,rv.summary,rv.quantity,rv.unit,p_unit_price,p_discount,rev::bigint,rv.specification);
 for c in select value from jsonb_array_elements(p_costs) loop
   insert into app.quote_cost_components(quote_item_id,cost_type,description,quantity,unit_cost,total_cost)
   values(item_id,c->>'cost_type',c->>'description',(c->>'quantity')::integer,(c->>'unit_cost')::bigint,((c->>'quantity')::numeric*(c->>'unit_cost')::numeric)::bigint);
 end loop;
 update app.quotes set current_version_id=version_id where id=quote_id;
 insert into app.quote_audit(organization_id,quote_version_id,actor_id,action,details) values(p_organization_id,version_id,p_actor_id,case when num=1 then 'quote.created' else 'quote.revision_created' end,jsonb_build_object('pricing_guard',guard));
 return jsonb_build_object('quote_id',quote_id,'version_id',version_id);
end; $$;

create function app.approve_quote_price(p_organization_id uuid,p_actor_id uuid,p_version_id uuid,p_reason text)
returns uuid language plpgsql security definer set search_path=app,pg_temp as $$
declare q app.quotes%rowtype; v app.quote_versions%rowtype; approved uuid;
begin
 if app.quote_actor_role(p_organization_id,p_actor_id)<>'OWNER' then raise exception 'Only OWNER may approve pricing override'; end if;
 if coalesce(length(btrim(p_reason)),0)<5 or length(p_reason)>2000 then raise exception 'Approval reason must contain 5 to 2000 characters'; end if;
 select quotes.* into q from app.quotes quotes join app.quote_versions ver on ver.quote_id=quotes.id where ver.id=p_version_id and quotes.organization_id=p_organization_id for update of quotes;
 if not found or q.current_version_id<>p_version_id then raise exception 'Only current draft may be approved'; end if;
 select * into v from app.quote_versions where id=p_version_id;
 if v.status<>'DRAFT' or v.pricing_guard<>'APPROVAL_REQUIRED' then raise exception 'Only below-floor draft requires override'; end if;
 select id into approved from app.quote_price_approvals where quote_version_id=p_version_id;
 if found then return approved; end if;
 insert into app.quote_price_approvals(quote_version_id,approved_by_user_id,reason) values(p_version_id,p_actor_id,btrim(p_reason)) returning id into approved;
 insert into app.quote_audit(organization_id,quote_version_id,actor_id,action,details) values(p_organization_id,p_version_id,p_actor_id,'quote.price_override_approved',jsonb_build_object('reason',btrim(p_reason),'approval_id',approved));
 return approved;
end; $$;

create function app.mark_quote_sent(p_organization_id uuid,p_actor_id uuid,p_version_id uuid)
returns uuid language plpgsql security definer set search_path=app,pg_temp as $$
declare q app.quotes%rowtype; v app.quote_versions%rowtype; req app.requirements%rowtype;
begin
 if app.quote_actor_role(p_organization_id,p_actor_id) not in ('OWNER','ADMIN','SALES') then raise exception 'Not authorized to send quotes'; end if;
 -- Lock requirement before quote, matching revision/creation lock order.
 select r.* into req from app.requirements r join app.quotes quotes on quotes.requirement_id=r.id join app.quote_versions ver on ver.quote_id=quotes.id where ver.id=p_version_id and quotes.organization_id=p_organization_id for update of r;
 if not found then raise exception 'Quote not found'; end if;
 select quotes.* into q from app.quotes quotes join app.quote_versions ver on ver.quote_id=quotes.id where ver.id=p_version_id and quotes.organization_id=p_organization_id for update of quotes;
 select * into v from app.quote_versions where id=p_version_id;
 if q.current_version_id<>v.id then raise exception 'Only current quote version may be sent'; end if;
 if v.status='SENT' then return v.id; end if;
 if v.status<>'DRAFT' then raise exception 'Only draft quote may be sent'; end if;
 if v.valid_until<(now() at time zone 'Asia/Jakarta')::date then raise exception 'Quote has expired'; end if;
 if req.current_version_id<>v.requirement_version_id or req.status not in ('READY','LOCKED') then raise exception 'Requirement must be current and READY or LOCKED'; end if;
 if not exists(select 1 from app.customer_accounts where id=q.customer_account_id and organization_id=p_organization_id and status='ACTIVE') or not exists(select 1 from app.brands where id=q.brand_id and organization_id=p_organization_id and status='ACTIVE') then raise exception 'Active customer and brand required'; end if;
 if v.pricing_guard='APPROVAL_REQUIRED' and not exists(select 1 from app.quote_price_approvals where quote_version_id=v.id) then raise exception 'Owner approval required below 20 percent margin'; end if;
 perform app.lock_requirement_version(p_organization_id,v.requirement_version_id,'Referenced by sent quote '||q.quote_number,p_actor_id);
 update app.quote_versions set status='SENT',sent_at=now() where id=v.id;
 insert into app.quote_audit(organization_id,quote_version_id,actor_id,action) values(p_organization_id,v.id,p_actor_id,'quote.sent');
 return v.id;
end; $$;

do $$ declare name text; begin
 foreach name in array array['quotes','quote_versions','quote_items','quote_cost_components','quote_price_approvals','quote_audit'] loop
   execute format('alter table app.%I enable row level security',name);
   execute format('revoke all on app.%I from public,anon,authenticated,service_role',name);
   execute format('grant select on app.%I to service_role',name);
 end loop;
end; $$;
revoke all on function app.quote_actor_role(uuid,uuid), app.quote_snapshot_guard(), app.save_quote_version(uuid,uuid,uuid,uuid,uuid,bigint,bigint,bigint,jsonb,date,text,text,text,uuid,uuid), app.approve_quote_price(uuid,uuid,uuid,text), app.mark_quote_sent(uuid,uuid,uuid) from public,anon,authenticated,service_role;
grant execute on function app.save_quote_version(uuid,uuid,uuid,uuid,uuid,bigint,bigint,bigint,jsonb,date,text,text,text,uuid,uuid), app.approve_quote_price(uuid,uuid,uuid,text), app.mark_quote_sent(uuid,uuid,uuid) to service_role;
commit;
