-- Migration: 20260930190000_fulfillment_readiness_guard.sql
-- Description: MGBOS Phase 1 P0-05 Fulfillment Readiness Guard
-- Specification: MultiGraph Business OS — Sprint 4 / Backlog P0-05
--
-- Enforces production readiness and QC clearance before creating Delivery Orders:
--   - AC-01: Ready work (READY_FOR_HANDOFF or COMPLETED with PASS QC) can be shipped
--   - AC-02: Unfinished production (PLANNED..IN_PRODUCTION) blocks shipment
--   - AC-03: AWAITING_QC blocks shipment
--   - AC-04: REWORK blocks shipment
--   - AC-05: QC rejection / ON_HOLD blocks shipment
--   - AC-06: Shipment quantity ceiling remains strictly enforced
--   - AC-07: Cancelled jobs do not block fulfillment
--   - AC-08: Partial shipment verified against requested items
--   - AC-09: Operator receives descriptive blocker error message
--   - AC-10: Delivered shipment immutability preserved

begin;

create or replace function app.create_delivery_order(
  p_organization_id uuid,
  p_actor_id uuid,
  p_order_id uuid,
  p_courier_name text,
  p_courier_service text default null,
  p_items jsonb default '[]'::jsonb,
  p_package_weight_grams integer default null,
  p_package_count integer default 1,
  p_notes text default null
) returns jsonb language plpgsql security definer set search_path=app,pg_temp as $$
declare
  v_role text;
  v_order app.orders%rowtype;
  v_do_num text;
  v_shipment_id uuid;
  v_item jsonb;
  v_order_item app.order_items%rowtype;
  v_shipped_so_far integer;
  v_requested_qty integer;
  v_item_count integer := 0;
  v_total_qty integer := 0;

  -- Readiness blocker variables
  v_block_job_id uuid;
  v_block_job_number text;
  v_block_job_status text;
  v_block_item_desc text;
  v_block_qc_num text;
  v_block_qc_res text;
begin
  -- 1. Actor authorization
  v_role := app.shipment_actor_role(p_organization_id, p_actor_id);
  if v_role not in ('OWNER', 'ADMIN', 'OPERATIONS', 'FINANCE') then
    raise exception 'Unauthorized to create delivery orders';
  end if;

  if p_courier_name is null or trim(p_courier_name) = '' then
    raise exception 'Courier name is required';
  end if;

  if jsonb_array_length(p_items) = 0 then
    raise exception 'Shipment must contain at least one order item';
  end if;

  -- 2. Lock Order
  select * into v_order
  from app.orders
  where id = p_order_id and organization_id = p_organization_id
  for update;

  if not found then
    raise exception 'Order % not found in organization', p_order_id;
  end if;

  if v_order.status in ('DRAFT', 'CANCELLED') then
    raise exception 'Cannot create delivery order for order in % status', v_order.status;
  end if;

  -- 3. P0-05 Fulfillment Readiness Guards: Order-level production jobs
  -- Check for any order-level jobs (jobs without specific item allocations) that are unfinished (AC-02..AC-05)
  select pj.id, pj.job_number, pj.status
  into v_block_job_id, v_block_job_number, v_block_job_status
  from app.production_jobs pj
  where pj.order_id = v_order.id
    and pj.organization_id = p_organization_id
    and pj.status <> 'CANCELLED'
    and pj.status not in ('READY_FOR_HANDOFF', 'COMPLETED')
    and not exists (
      select 1 from app.production_job_items pji where pji.production_job_id = pj.id
    )
  limit 1;

  if found then
    raise exception 'Cannot create delivery order: Production job % (%) for order % is currently % (required: READY_FOR_HANDOFF or COMPLETED)',
      v_block_job_number, v_block_job_id, v_order.order_number, v_block_job_status;
  end if;

  -- Check for unresolved QC inspections on order-level jobs (AC-03..AC-05)
  select qi.inspection_number, qi.result, pj.job_number
  into v_block_qc_num, v_block_qc_res, v_block_job_number
  from app.qc_inspections qi
  join app.production_jobs pj on pj.id = qi.production_job_id
  where pj.order_id = v_order.id
    and pj.organization_id = p_organization_id
    and pj.status <> 'CANCELLED'
    and not exists (
      select 1 from app.production_job_items pji where pji.production_job_id = pj.id
    )
    and qi.result in ('REWORK', 'REJECTED')
    and not exists (
      select 1 from app.qc_inspections qi2
      where qi2.production_job_id = pj.id
        and qi2.result = 'PASS'
        and qi2.inspected_at > qi.inspected_at
    )
  limit 1;

  if found then
    raise exception 'Cannot create delivery order: Production job % for order % has unresolved QC inspection % with result %',
      v_block_job_number, v_order.order_number, v_block_qc_num, v_block_qc_res;
  end if;

  -- 4. P0-05 Fulfillment Readiness Guards: Item-level production jobs
  -- Validate each requested item before creating the header
  for v_item in select * from jsonb_array_elements(p_items)
  loop
    v_requested_qty := (v_item->>'quantity')::integer;
    if v_requested_qty <= 0 then
      raise exception 'Item quantity must be greater than zero';
    end if;

    select * into v_order_item
    from app.order_items
    where id = (v_item->>'order_item_id')::uuid and order_id = v_order.id;

    if not found then
      raise exception 'Order item % does not belong to order %', v_item->>'order_item_id', v_order.order_number;
    end if;

    -- Check if this specific item has active production jobs that are unfinished (AC-02..AC-05, AC-08)
    select pj.id, pj.job_number, pj.status, v_order_item.description
    into v_block_job_id, v_block_job_number, v_block_job_status, v_block_item_desc
    from app.production_job_items pji
    join app.production_jobs pj on pj.id = pji.production_job_id
    where pji.order_item_id = v_order_item.id
      and pj.organization_id = p_organization_id
      and pj.status <> 'CANCELLED'
      and pj.status not in ('READY_FOR_HANDOFF', 'COMPLETED')
    limit 1;

    if found then
      raise exception 'Cannot create delivery order: Production job % (%) for item "%" is currently % (required: READY_FOR_HANDOFF or COMPLETED)',
        v_block_job_number, v_block_job_id, v_block_item_desc, v_block_job_status;
    end if;

    -- Check for unresolved QC inspections on this item's production jobs (AC-03..AC-05)
    select qi.inspection_number, qi.result, pj.job_number
    into v_block_qc_num, v_block_qc_res, v_block_job_number
    from app.qc_inspections qi
    join app.production_jobs pj on pj.id = qi.production_job_id
    join app.production_job_items pji on pji.production_job_id = pj.id
    where pji.order_item_id = v_order_item.id
      and pj.organization_id = p_organization_id
      and pj.status <> 'CANCELLED'
      and qi.result in ('REWORK', 'REJECTED')
      and not exists (
        select 1 from app.qc_inspections qi2
        where qi2.production_job_id = pj.id
          and qi2.result = 'PASS'
          and qi2.inspected_at > qi.inspected_at
      )
    limit 1;

    if found then
      raise exception 'Cannot create delivery order: Production job % for item "%" has unresolved QC inspection % with result %',
        v_block_job_number, v_order_item.description, v_block_qc_num, v_block_qc_res;
    end if;

    -- Ceiling Guard: Calculate total already scheduled/shipped across active shipments (AC-06)
    select coalesce(sum(si.quantity), 0) into v_shipped_so_far
    from app.shipment_items si
    join app.shipments s on s.id = si.shipment_id
    where si.order_item_id = v_order_item.id
      and s.status not in ('CANCELLED', 'RETURNED');

    if (v_shipped_so_far + v_requested_qty) > v_order_item.quantity then
      raise exception 'Requested quantity (%) exceeds remaining unshipped quota (%) for item %',
        v_requested_qty, (v_order_item.quantity - v_shipped_so_far), v_order_item.description;
    end if;
  end loop;

  -- 5. Generate canonical DO document number
  v_do_num := app.generate_document_number(p_organization_id, v_order.brand_id, 'DO');

  -- 6. Create Shipment Header in READY_TO_DISPATCH status
  insert into app.shipments (
    organization_id,
    brand_id,
    order_id,
    customer_account_id,
    shipment_number,
    status,
    courier_name,
    courier_service,
    package_weight_grams,
    package_count,
    shipping_address_snapshot,
    notes,
    created_by_user_id
  ) values (
    p_organization_id,
    v_order.brand_id,
    v_order.id,
    v_order.customer_account_id,
    v_do_num,
    'READY_TO_DISPATCH',
    upper(trim(p_courier_name)),
    nullif(trim(p_courier_service), ''),
    p_package_weight_grams,
    coalesce(p_package_count, 1),
    v_order.shipping_address_snapshot,
    p_notes,
    p_actor_id
  ) returning id into v_shipment_id;

  -- 7. Insert Shipment Items
  for v_item in select * from jsonb_array_elements(p_items)
  loop
    v_requested_qty := (v_item->>'quantity')::integer;

    insert into app.shipment_items (
      shipment_id,
      order_item_id,
      quantity,
      notes
    ) values (
      v_shipment_id,
      (v_item->>'order_item_id')::uuid,
      v_requested_qty,
      v_item->>'notes'
    );

    v_item_count := v_item_count + 1;
    v_total_qty := v_total_qty + v_requested_qty;
  end loop;

  -- 8. Audit log
  insert into app.shipment_audit (
    organization_id, shipment_id, actor_id, action, metadata
  ) values (
    p_organization_id, v_shipment_id, p_actor_id, 'shipment.created',
    jsonb_build_object(
      'shipment_number', v_do_num,
      'order_id', v_order.id,
      'courier', upper(trim(p_courier_name)),
      'items_count', v_item_count,
      'total_quantity', v_total_qty
    )
  );

  return jsonb_build_object(
    'shipment_id', v_shipment_id,
    'shipment_number', v_do_num,
    'status', 'READY_TO_DISPATCH',
    'total_items', v_item_count,
    'total_quantity', v_total_qty
  );
end; $$;

revoke all on function app.create_delivery_order(uuid,uuid,uuid,text,text,jsonb,integer,integer,text) from public,anon,authenticated,service_role;
grant execute on function app.create_delivery_order(uuid,uuid,uuid,text,text,jsonb,integer,integer,text) to service_role;

commit;
