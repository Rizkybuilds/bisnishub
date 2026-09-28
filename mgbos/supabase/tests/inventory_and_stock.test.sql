begin;
select plan(21);

create temporary table inv_ctx as select
  (select id from app.organizations where code='multigraph-group') org,
  (select id from app.brands where code='TS') brand,
  (select id from app.users where email='founder@multigraph.id') owner_actor,
  (select id from app.customer_accounts where status='ACTIVE' limit 1) customer;

-- 1. Table structure assertions
select has_table('app', 'inventory_items', 'Table app.inventory_items exists');
select has_table('app', 'inventory_levels', 'Table app.inventory_levels exists');
select has_table('app', 'inventory_mutations', 'Table app.inventory_mutations exists');
select has_table('app', 'inventory_reservations', 'Table app.inventory_reservations exists');

-- 2. Create Master Inventory Item: Blank Garment NSA 7200 Black L (initial stock 50)
create temporary table inv_item1 as select app.create_inventory_item(
  p_organization_id => org,
  p_actor_id => owner_actor,
  p_brand_id => brand,
  p_sku => 'TS-NSA-7200-BLK-L',
  p_name => 'Kaos Polos NSA 7200 Black L',
  p_category => 'BLANK_GARMENT',
  p_unit => 'pcs',
  p_attributes => jsonb_build_object('color', 'Black', 'size', 'L', 'brand', 'NSA 7200'),
  p_cost_price => 38000::bigint,
  p_min_stock_alert => 15,
  p_initial_stock => 50,
  p_location_code => 'MAIN_WORKSHOP',
  p_bin_location => 'RACK-A1'
) result from inv_ctx;

select is(
  (select (result->>'sku') from inv_item1),
  'TS-NSA-7200-BLK-L',
  'Master inventory item created with SKU TS-NSA-7200-BLK-L'
);

select results_eq(
  $$ select quantity_on_hand, quantity_reserved from app.inventory_levels where inventory_item_id = (select (result->>'inventory_item_id')::uuid from inv_item1) $$,
  $$ values (50, 0) $$,
  'Inventory level initialized to 50 on-hand and 0 reserved'
);

select results_eq(
  $$ select mutation_type, quantity_change, quantity_on_hand_after from app.inventory_mutations where inventory_item_id = (select (result->>'inventory_item_id')::uuid from inv_item1) limit 1 $$,
  $$ values ('STOCK_OPNAME'::text, 50, 50) $$,
  'Initial stock mutation recorded in append-only ledger'
);

-- 3. Inbound Purchase Mutation (+50 units)
create temporary table inv_inbound as select app.record_inventory_mutation(
  p_organization_id => (select org from inv_ctx),
  p_actor_id => (select owner_actor from inv_ctx),
  p_inventory_item_id => (select (result->>'inventory_item_id')::uuid from inv_item1),
  p_mutation_type => 'INBOUND_PURCHASE',
  p_quantity => 50,
  p_location_code => 'MAIN_WORKSHOP',
  p_reference_type => 'PO',
  p_notes => 'Restock NSA Blanks dari Supplier'
) result;

select is(
  (select (result->>'quantity_on_hand')::int from inv_inbound),
  100,
  'Inbound purchase increases quantity_on_hand to 100'
);

-- 4. Setup Order for Stock Reservation
create temporary table inv_req as select app.create_requirement_with_initial_version(
  p_organization_id => org,
  p_brand_id => brand,
  p_title => 'Inventory Reservation Test Req',
  p_summary => '40 pcs Custom Graphic Tees',
  p_customer_account_id => customer,
  p_quantity => 40,
  p_actor_id => owner_actor
) result from inv_ctx;

select app.transition_requirement_status(org, (result->>'requirement_id')::uuid, 'READY', owner_actor) from inv_ctx, inv_req;

create temporary table inv_quote as select app.save_quote_version(
  p_organization_id => org,
  p_actor_id => owner_actor,
  p_request_id => '99999999-0000-4000-8000-000000000001'::uuid,
  p_requirement_version_id => (result->>'version_id')::uuid,
  p_customer_id => customer,
  p_unit_price => 110000::bigint,
  p_discount => 0::bigint,
  p_shipping => 50000::bigint,
  p_costs => jsonb_build_array(
    jsonb_build_object('cost_type', 'GARMENT', 'description', 'Blanks', 'quantity', 40, 'unit_cost', 38000)
  ),
  p_valid_until => (current_date + 7)::date,
  p_terms => 'Lunas DP',
  p_lead_time => '5 days',
  p_notes => 'Stock reservation quote'
) result from inv_ctx, inv_req;

select app.mark_quote_sent(org, owner_actor, (result->>'version_id')::uuid) from inv_ctx, inv_quote;
select app.mark_quote_accepted(org, owner_actor, (result->>'version_id')::uuid, 'WHATSAPP', null, 'Confirmed') from inv_ctx, inv_quote;

create temporary table inv_order as select app.create_order_from_quote(
  p_organization_id => org,
  p_actor_id => owner_actor,
  p_request_id => '99999999-0000-4000-8000-000000000002'::uuid,
  p_quote_version_id => (result->>'version_id')::uuid,
  p_shipping_address => jsonb_build_object(
    'recipient_name', 'Customer Test',
    'phone', '081111111111',
    'street', 'Jl. Sukajadi',
    'city', 'Bandung',
    'province', 'Jawa Barat',
    'postal_code', '40161',
    'courier_service', 'JNT REG'
  )
) result from inv_ctx, inv_quote;

create temporary table inv_order_item as select
  id as item_id,
  order_id
from app.order_items
where order_id = (select (result->>'order_id')::uuid from inv_order)
limit 1;

-- 5. Reserve Stock for Order (40 units)
create temporary table inv_res as select app.reserve_inventory_for_order(
  p_organization_id => (select org from inv_ctx),
  p_actor_id => (select owner_actor from inv_ctx),
  p_order_id => (select order_id from inv_order_item),
  p_items => jsonb_build_array(
    jsonb_build_object(
      'inventory_item_id', (select (result->>'inventory_item_id')::uuid from inv_item1),
      'quantity', 40,
      'order_item_id', (select item_id from inv_order_item),
      'location_code', 'MAIN_WORKSHOP'
    )
  ),
  p_notes => 'Alokasi bahan kaos NSA 40 pcs untuk pesanan'
) result;

select is(
  (select (result->>'status') from inv_res),
  'RESERVED',
  'Reservation procedure succeeded with status RESERVED'
);

select results_eq(
  $$ select quantity_on_hand, quantity_reserved, (quantity_on_hand - quantity_reserved) as available from app.inventory_levels where inventory_item_id = (select (result->>'inventory_item_id')::uuid from inv_item1) $$,
  $$ values (100, 40, 60) $$,
  'Inventory level reflects 100 on hand, 40 reserved, and 60 available'
);

-- 6. Anti-Overselling Guard: Try to reserve 70 units when only 60 are available -> must throw exception
select throws_matching(
  format(
    $$ select app.reserve_inventory_for_order(
      '%s'::uuid, '%s'::uuid, '%s'::uuid,
      jsonb_build_array(jsonb_build_object('inventory_item_id', '%s'::uuid, 'quantity', 70, 'location_code', 'MAIN_WORKSHOP'))
    ) $$,
    (select org from inv_ctx),
    (select owner_actor from inv_ctx),
    (select order_id from inv_order_item),
    (select (result->>'inventory_item_id')::uuid from inv_item1)
  ),
  'Stok tidak mencukupi',
  'Anti-overselling guard throws exception when requested stock exceeds unreserved availability'
);

-- 7. Consume Reserved Inventory for Production/Order Fulfillment
create temporary table inv_consumed as select app.consume_inventory_for_order(
  p_organization_id => (select org from inv_ctx),
  p_actor_id => (select owner_actor from inv_ctx),
  p_order_id => (select order_id from inv_order_item),
  p_notes => 'Bahan NSA 40 pcs diproses ke sablon DTF & press'
) result;

select is(
  (select (result->>'status') from inv_consumed),
  'CONSUMED',
  'Reservation consumption succeeded with status CONSUMED'
);

select results_eq(
  $$ select quantity_on_hand, quantity_reserved from app.inventory_levels where inventory_item_id = (select (result->>'inventory_item_id')::uuid from inv_item1) $$,
  $$ values (60, 0) $$,
  'Consumption reduced quantity_on_hand to 60 and cleared quantity_reserved to 0'
);

select results_eq(
  $$ select status from app.inventory_reservations where order_id = (select order_id from inv_order_item) $$,
  $$ values ('CONSUMED'::text) $$,
  'Reservation record updated to CONSUMED'
);

-- 8. Stock Opname (Physical count 58, variance -2 defect)
create temporary table inv_opname as select app.perform_stock_opname(
  p_organization_id => (select org from inv_ctx),
  p_actor_id => (select owner_actor from inv_ctx),
  p_inventory_item_id => (select (result->>'inventory_item_id')::uuid from inv_item1),
  p_actual_physical_count => 58,
  p_location_code => 'MAIN_WORKSHOP',
  p_reason => 'Stock opname mingguan: 2 pcs cacat kain bolong'
) result;

select is(
  (select (result->>'adjusted_on_hand')::int from inv_opname),
  58,
  'Stock opname adjusted quantity_on_hand to physical count of 58'
);

select is(
  (select (result->>'difference')::int from inv_opname),
  -2,
  'Stock opname variance calculated as -2'
);

-- 9. Mutation Ledger Immutability Guard
select throws_matching(
  format(
    $$ update app.inventory_mutations set notes = 'tampered' where inventory_item_id = '%s'::uuid $$,
    (select (result->>'inventory_item_id')::uuid from inv_item1)
  ),
  'Inventory mutation log is append-only and strictly immutable',
  'Trigger blocks UPDATE on inventory mutations ledger'
);

select throws_matching(
  format(
    $$ delete from app.inventory_mutations where inventory_item_id = '%s'::uuid $$,
    (select (result->>'inventory_item_id')::uuid from inv_item1)
  ),
  'Inventory mutation log is append-only and strictly immutable',
  'Trigger blocks DELETE on inventory mutations ledger'
);

-- 10. Test Reservation Release on DTF Material item
create temporary table inv_item2 as select app.create_inventory_item(
  p_organization_id => org,
  p_actor_id => owner_actor,
  p_brand_id => brand,
  p_sku => 'MAT-DTF-PET-FILM-100M',
  p_name => 'Roll DTF PET Film 58cm x 100m',
  p_category => 'PRINT_MATERIAL',
  p_unit => 'roll',
  p_cost_price => 650000::bigint,
  p_min_stock_alert => 2,
  p_initial_stock => 10
) result from inv_ctx;

select app.reserve_inventory_for_order(
  p_organization_id => (select org from inv_ctx),
  p_actor_id => (select owner_actor from inv_ctx),
  p_order_id => (select order_id from inv_order_item),
  p_items => jsonb_build_array(
    jsonb_build_object(
      'inventory_item_id', (select (result->>'inventory_item_id')::uuid from inv_item2),
      'quantity', 3,
      'location_code', 'MAIN_WORKSHOP'
    )
  ),
  p_notes => 'Reservasi 3 roll film DTF'
);

select results_eq(
  $$ select quantity_on_hand, quantity_reserved from app.inventory_levels where inventory_item_id = (select (result->>'inventory_item_id')::uuid from inv_item2) $$,
  $$ values (10, 3) $$,
  'DTF film level shows 10 on-hand and 3 reserved'
);

create temporary table inv_release as select app.release_inventory_reservation(
  p_organization_id => (select org from inv_ctx),
  p_actor_id => (select owner_actor from inv_ctx),
  p_order_id => (select order_id from inv_order_item),
  p_reason => 'Pesanan dibatalkan / dialihkan material alternatif'
) result;

select is(
  (select (result->>'status') from inv_release),
  'RELEASED',
  'Reservation release procedure returned status RELEASED'
);

select results_eq(
  $$ select quantity_on_hand, quantity_reserved from app.inventory_levels where inventory_item_id = (select (result->>'inventory_item_id')::uuid from inv_item2) $$,
  $$ values (10, 0) $$,
  'Reserved count restored to 0 after release'
);

select * from finish();
rollback;
