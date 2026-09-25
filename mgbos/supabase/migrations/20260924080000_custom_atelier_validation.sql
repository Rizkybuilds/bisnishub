begin;
-- Validate new typed snapshots without rewriting historical generic requirements.
create function app.trg_validate_custom_atelier()
returns trigger language plpgsql set search_path = app, pg_temp as $$
declare
 s jsonb := NEW.specification;
 g jsonb;
 d jsonb;
 val jsonb;
 k text;
 total numeric := 0;
 seen text[] := '{}';
begin
 if not (s ? 'schemaCode') then return NEW; end if;
 if s->>'schemaCode' is distinct from 'teestock.custom_atelier.v1' then
   raise exception 'Unsupported requirement specification schema';
 end if;
 if not exists(select 1 from app.requirements r join app.brands b on b.id=r.brand_id where r.id=NEW.requirement_id and b.code='TS') then
   raise exception 'Custom Atelier requires TeeStock brand';
 end if;
 if NEW.quantity is null or NEW.quantity <= 0 or NEW.unit <> 'PCS' then raise exception 'Custom Atelier requires a positive PCS quantity'; end if;
 g := s->'garment';
 if jsonb_typeof(g) is distinct from 'object' then raise exception 'Invalid garment'; end if;
 if coalesce(g->>'type','') not in ('T-Shirt','Oversized T-Shirt','Polo Shirt','Hoodie','Crewneck','Jersey','Shirt','Other')
 or coalesce(g->>'fit','') not in ('Regular','Oversized','Slim','Custom','N/A') then raise exception 'Invalid garment type or fit'; end if;
 foreach k in array array['material','color','blankPreference'] loop
   if jsonb_typeof(g->k) is distinct from 'string' or length(g->>k)>(case when k='blankPreference' then 200 else 120 end)
   or (k<>'blankPreference' and length(btrim(g->>k))=0) then raise exception 'Invalid garment text'; end if;
 end loop;
 if not(g ? 'gsm') then raise exception 'Missing GSM field'; end if;
 if g->'gsm' <> 'null'::jsonb then
   if jsonb_typeof(g->'gsm') <> 'number' or (g->>'gsm')::numeric <> trunc((g->>'gsm')::numeric) or (g->>'gsm')::numeric not between 1 and 2000 then raise exception 'Invalid GSM'; end if;
 end if;
 if not(s ? 'sizes') then raise exception 'Missing size breakdown'; end if;
 if s->'sizes' <> 'null'::jsonb then
   if jsonb_typeof(s->'sizes') <> 'object' then raise exception 'Invalid size breakdown'; end if;
   if exists(select 1 from jsonb_object_keys(s->'sizes') t(key) where key not in ('S','M','L','XL','XXL')) then raise exception 'Unsupported size'; end if;
   foreach k in array array['S','M','L','XL','XXL'] loop
     val := s->'sizes'->k;
     if jsonb_typeof(val) is distinct from 'number' then raise exception 'Invalid size quantity'; end if;
     if val::text::numeric <> trunc(val::text::numeric) or val::text::numeric not between 0 and 2147483647 then raise exception 'Invalid size quantity'; end if;
     total := total + val::text::numeric;
   end loop;
   if total <> NEW.quantity then raise exception 'Size total must match requirement quantity'; end if;
 end if;
 if jsonb_typeof(s->'decorations') is distinct from 'array' then raise exception 'Invalid decorations'; end if;
 if jsonb_array_length(s->'decorations')>7 then raise exception 'Too many decorations'; end if;
 for d in select value from jsonb_array_elements(s->'decorations') loop
   if coalesce(d->>'location','') not in ('Front','Back','Left Chest','Right Chest','Left Sleeve','Right Sleeve','Custom')
   or coalesce(d->>'method','') not in ('Screen Printing','DTF','DTG','Embroidery','Heat Transfer','Other') then raise exception 'Invalid decoration location or method'; end if;
   if d->>'location'=any(seen) then raise exception 'Duplicate decoration location'; end if;
   seen := array_append(seen,d->>'location');
   foreach k in array array['widthCm','heightCm','colors'] loop
     val:=d->k;
     if val is null then raise exception 'Missing decoration dimension'; end if;
     if val <> 'null'::jsonb then
       if jsonb_typeof(val)<>'number' then raise exception 'Invalid decoration dimension'; end if;
       if val::text::numeric<=0 or val::text::numeric>(case when k='colors' then 100 else 300 end)
       or (k='colors' and val::text::numeric<>trunc(val::text::numeric)) then raise exception 'Invalid decoration dimension'; end if;
     end if;
   end loop;
   foreach k in array array['artworkReference','notes'] loop
     if jsonb_typeof(d->k) is distinct from 'string' or length(d->>k)>(case when k='artworkReference' then 500 else 2000 end) then raise exception 'Invalid decoration text'; end if;
   end loop;
 end loop;
 if jsonb_typeof(s->'customization') is distinct from 'string' or length(s->>'customization')>2000 then raise exception 'Invalid customization'; end if;
 return NEW;
end;
$$;
revoke all on function app.trg_validate_custom_atelier() from public, anon, authenticated;
create trigger trg_validate_custom_atelier before insert on app.requirement_versions for each row execute function app.trg_validate_custom_atelier();
commit;
