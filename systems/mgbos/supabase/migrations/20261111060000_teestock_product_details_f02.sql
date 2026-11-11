-- F02: verified garment specifications and measured size guide.
-- Keep existing published rows readable; writes to publish require complete details.
begin;
alter table app.teestock_catalog_products
  add column details jsonb not null default '{}'::jsonb
  check (jsonb_typeof(details) = 'object');

create or replace function app.save_teestock_catalog_product(
  p_org uuid,
  p_actor uuid,
  p_product uuid,
  p_expected_version integer,
  p_payload jsonb
) returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  v_brand uuid;
  v_id uuid;
  v_version integer;
  v_variants jsonb;
  v_status text;
  v_rights text;
  v_sample text;
  v_mockup text;
  v_artwork text;
  v_details jsonb;
begin
  if coalesce(app.inventory_actor_role(p_org, p_actor), '') not in ('OWNER','ADMIN') then
    raise exception 'Catalog write access denied';
  end if;
  select id into v_brand from app.brands
    where organization_id = p_org and code = 'TS' and status = 'ACTIVE';
  if v_brand is null then raise exception 'TeeStock brand not available'; end if;
  if p_expected_version is null or p_expected_version < 0 then
    raise exception 'Version required';
  end if;
  if jsonb_typeof(p_payload) is distinct from 'object' then
    raise exception 'Invalid catalog payload';
  end if;
  v_variants := p_payload -> 'variants';
  v_details := coalesce(p_payload -> 'details', '{}'::jsonb);
  v_status := p_payload ->> 'status';
  v_rights := p_payload ->> 'rightsStatus';
  v_sample := p_payload ->> 'sampleStatus';
  v_mockup := nullif(p_payload ->> 'mockupPath','');
  v_artwork := nullif(p_payload ->> 'artworkPath','');

  if coalesce(p_payload->>'slug','') !~ '^[a-z0-9]+(-[a-z0-9]+)*$'
    or length(p_payload->>'slug') > 80
    or length(btrim(coalesce(p_payload->>'title',''))) not between 3 and 120
    or length(btrim(coalesce(p_payload->>'collectionName',''))) not between 2 and 80
    or length(coalesce(p_payload->>'description','')) > 3000
    or v_status not in ('DRAFT','PUBLISHED','ARCHIVED')
    or v_rights not in ('PENDING','APPROVED')
    or v_sample not in ('PENDING','PASSED')
    or jsonb_typeof(v_variants) is distinct from 'array'
    or jsonb_array_length(v_variants) not between 1 and 40 then
      raise exception 'Invalid catalog fields';
  end if;

  if v_mockup is not null and v_mockup !~ '^[0-9a-f-]{36}/[0-9a-f-]{36}/[0-9a-f-]{36}\.(png|jpg|webp)$' then
    raise exception 'Invalid mockup path';
  end if;
  if v_artwork is not null and v_artwork !~ '^[0-9a-f-]{36}/[0-9a-f-]{36}/[0-9a-f-]{36}\.(png|pdf)$' then
    raise exception 'Invalid print artwork path';
  end if;
  if (v_mockup is not null and v_mockup not like p_org::text || '/' || v_brand::text || '/%')
    or (v_artwork is not null and v_artwork not like p_org::text || '/' || v_brand::text || '/%') then
    raise exception 'Asset belongs to another organization or brand';
  end if;
  if exists (
    select 1 from jsonb_array_elements(v_variants) item
    where jsonb_typeof(item) is distinct from 'object'
      or coalesce(item->>'sku','') !~ '^[A-Z0-9-]{3,40}$'
      or coalesce(item->>'size','') not in ('S','M','L','XL','XXL')
      or length(btrim(coalesce(item->>'color',''))) not between 2 and 50
      or jsonb_typeof(item->'priceIdr') is distinct from 'number'
      or coalesce(item->>'priceIdr','') !~ '^[0-9]{1,10}$'
      or jsonb_typeof(item->'costIdr') is distinct from 'number'
      or coalesce(item->>'costIdr','') !~ '^[0-9]{1,10}$'
  ) then raise exception 'Invalid catalog variant'; end if;
  if (
    select count(distinct item->>'sku') from jsonb_array_elements(v_variants) item
  ) <> jsonb_array_length(v_variants) then raise exception 'Duplicate variant SKU'; end if;
  if exists (
    select 1 from jsonb_array_elements(v_variants) item
    where (item->>'priceIdr')::bigint <= 0
      or (item->>'costIdr')::bigint > (item->>'priceIdr')::bigint
  ) then raise exception 'Invalid variant price or cost'; end if;
  if jsonb_typeof(v_details) is distinct from 'object'
    or length(coalesce(v_details->>'material','')) > 160
    or length(coalesce(v_details->>'fit','')) > 80
    or length(coalesce(v_details->>'care','')) > 600
  then raise exception 'Invalid product details'; end if;

  if v_status = 'PUBLISHED' then
    if length(btrim(coalesce(v_details->>'material',''))) not between 3 and 160
      or length(btrim(coalesce(v_details->>'fit',''))) not between 3 and 80
      or length(btrim(coalesce(v_details->>'care',''))) not between 10 and 600
      or jsonb_typeof(v_details->'productionDays') is distinct from 'number'
      or coalesce(v_details->>'productionDays','') !~ '^[0-9]{1,2}$'
      or jsonb_typeof(v_details->'sizeChart') is distinct from 'array'
    then raise exception 'Verified product details required to publish'; end if;

    if (v_details->>'productionDays')::integer not between 1 and 45
      or jsonb_array_length(v_details->'sizeChart') not between 1 and 5
    then raise exception 'Invalid production estimate or size chart'; end if;

    if exists (
      select 1 from jsonb_array_elements(v_details->'sizeChart') row
      where jsonb_typeof(row) is distinct from 'object'
        or coalesce(row->>'size','') not in ('S','M','L','XL','XXL')
        or jsonb_typeof(row->'widthCm') is distinct from 'number'
        or coalesce(row->>'widthCm','') !~ '^[0-9]{1,3}(\.[0-9]{1,2})?$'
        or jsonb_typeof(row->'lengthCm') is distinct from 'number'
        or coalesce(row->>'lengthCm','') !~ '^[0-9]{1,3}(\.[0-9]{1,2})?$'
    ) then raise exception 'Invalid physical measurements'; end if;
    if exists (
      select 1 from jsonb_array_elements(v_details->'sizeChart') row
      where (row->>'widthCm')::numeric not between 20 and 150
        or (row->>'lengthCm')::numeric not between 20 and 150
    ) then raise exception 'Physical measurements out of range'; end if;
    if (select count(distinct row->>'size')
      from jsonb_array_elements(v_details->'sizeChart') row)
      <> jsonb_array_length(v_details->'sizeChart')
      or exists (
        select 1 from jsonb_array_elements(v_variants) variant
        where not exists (
          select 1 from jsonb_array_elements(v_details->'sizeChart') row
          where row->>'size' = variant->>'size'
        )
      )
    then raise exception 'Size chart must cover all product variants'; end if;
  end if;

  if v_status = 'PUBLISHED' and (
    v_rights <> 'APPROVED' or v_sample <> 'PASSED'
    or v_mockup is null or v_artwork is null
    or exists (
      select 1 from jsonb_array_elements(v_variants) item
      where (item->>'costIdr')::bigint <= 0
    )
  ) then raise exception 'Rights, sample, artwork, mockup, and costing required to publish'; end if;

  if p_product is null then
    if p_expected_version <> 0 then raise exception 'New catalog version must be zero'; end if;
    insert into app.teestock_catalog_products (
      organization_id, brand_id, slug, title, collection_name, description,
      mockup_path, artwork_path, rights_status, sample_status, status,
      availability_mode, variants, details, created_by, updated_by
    ) values (
      p_org, v_brand, p_payload->>'slug', btrim(p_payload->>'title'),
      btrim(p_payload->>'collectionName'), coalesce(p_payload->>'description',''),
      v_mockup, v_artwork, v_rights, v_sample, v_status,
      'MADE_TO_ORDER', v_variants, v_details, p_actor, p_actor
    ) returning id, version into v_id, v_version;
  else
    update app.teestock_catalog_products set
      slug = p_payload->>'slug',
      title = btrim(p_payload->>'title'),
      collection_name = btrim(p_payload->>'collectionName'),
      description = coalesce(p_payload->>'description',''),
      mockup_path = v_mockup,
      artwork_path = v_artwork,
      rights_status = v_rights,
      sample_status = v_sample,
      status = v_status,
      variants = v_variants,
      details = v_details,
      updated_by = p_actor,
      updated_at = now(),
      version = version + 1
    where id = p_product and organization_id = p_org
      and brand_id = v_brand and version = p_expected_version
    returning id, version into v_id, v_version;
    if v_id is null then raise exception 'Catalog record changed or unavailable'; end if;
  end if;
  return jsonb_build_object('id', v_id, 'version', v_version);
end;
$$;

commit;
