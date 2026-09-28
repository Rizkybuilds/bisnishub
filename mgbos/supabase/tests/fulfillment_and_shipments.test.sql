begin;
select plan(17);

create temporary table shp_ctx as select
  (select id from app.organizations where code='multigraph-group') org,
  (select id from app.brands where code='TS') brand,
  (select id from app.users where email='founder@multigraph.id') owner_actor,
  (select id from app.customer_accounts where status='ACTIVE' limit 1) customer;

-- 1. Table structure assertions
select has_table('app', 'shipments', 'Table app.shipments exists');
select has_table('app', 'shipment_items', 'Table app.shipment_items exists');
select has_table('app', 'shipment_audit', 'Table app.shipment_audit exists');

-- 2. Setup full pipeline: Requirement -> Quote -> Order Contract (100 pcs)
create temporary table shp_req as select app.create_requirement_with_initial_version(
  p_organization_id => org,
  p_brand_id => brand,
  p_title => 'Fulfillment Pipeline Test',
  p_summary => '100 pcs Custom Heavyweight Tees for Delivery Order',
  p_customer_account_id => customer,
  p_quantity => 100,
  p_actor_id => owner_actor
) result from shp_ctx;

select app.transition_requirement_status(org, (result->>'requirement_id')::uuid, 'READY', owner_actor) from shp_ctx, shp_req;

create temporary table shp_quote as select app.save_quote_version(
  p_organization_id => org,
  p_actor_id => owner_actor,
  p_request_id => '77777777-0000-4000-8000-000000000099'::uuid,
  p_requirement_version_id => (result->>'version_id')::uuid,
  p_customer_id => customer,
  p_unit_price => 120000::bigint,
  p_discount => 0::bigint,
  p_shipping => 200000::bigint,
  p_costs => jsonb_build_array(
    jsonb_build_object('cost_type', 'GARMENT', 'description', 'Blanks', 'quantity', 100, 'unit_cost', 50000)
  ),
  p_valid_until => (current_date + 14)::date,
  p_terms => 'DP 50%',
  p_lead_time => '10 days',
  p_notes => 'Shipment pipeline quote'
) result from shp_ctx, shp_req;

select app.mark_quote_sent(org, owner_actor, (result->>'version_id')::uuid) from shp_ctx, shp_quote;
select app.mark_quote_accepted(org, owner_actor, (result->>'version_id')::uuid, 'WHATSAPP', null, 'Confirmed for DO') from shp_ctx, shp_quote;

create temporary table shp_order as select app.create_order_from_quote(
  p_organization_id => org,
  p_actor_id => owner_actor,
  p_request_id => '88888888-0000-4000-8000-000000000099'::uuid,
  p_quote_version_id => (result->>'version_id')::uuid,
  p_shipping_address => jsonb_build_object(
    'recipient_name', 'Andi Pratama',
    'phone', '081234567890',
    'street', 'Jl. Merdeka No. 45',
    'city', 'Bandung',
    'province', 'Jawa Barat',
    'postal_code', '40115',
    'courier_service', 'JNT CARGO'
  )
) result from shp_ctx, shp_quote;

-- Retrieve order item ID
create temporary table shp_item as select
  id as item_id,
  order_id
from app.order_items
where order_id = (select (result->>'order_id')::uuid from shp_order)
limit 1;

-- 3. Create Delivery Order 1 (Partial 60 pcs out of 100)
create temporary table shp_do1 as select app.create_delivery_order(
  p_organization_id => (select org from shp_ctx),
  p_actor_id => (select owner_actor from shp_ctx),
  p_order_id => (select order_id from shp_item),
  p_courier_name => 'JNT',
  p_courier_service => 'CARGO',
  p_items => jsonb_build_array(
    jsonb_build_object('order_item_id', (select item_id from shp_item), 'quantity', 60, 'notes', 'Batch 1')
  ),
  p_package_weight_grams => 15000,
  p_package_count => 2,
  p_notes => 'Pengiriman Parsial Batch 1 (60 pcs)'
) result;

select is(
  (select (result->>'status') from shp_do1),
  'READY_TO_DISPATCH',
  'Delivery Order created in READY_TO_DISPATCH status'
);

select ok(
  (select (result->>'shipment_number') from shp_do1) ~ '^TS-DO-\d{4}-\d{6}$',
  'Delivery Order number follows canonical format {BRAND}-DO-{YEAR}-{SEQUENCE}'
);

-- 4. Verify Shipping Address snapshot was frozen on DO
select results_eq(
  $$ select shipping_address_snapshot->>'recipient_name', shipping_address_snapshot->>'city'
     from app.shipments
     where id = (select (result->>'shipment_id')::uuid from shp_do1) $$,
  $$ values('Andi Pratama', 'Bandung') $$,
  'Delivery order inherits frozen shipping address snapshot from parent order'
);

-- 5. Test Over-Shipping Guard (Try to schedule 50 pcs when remaining is 40)
select throws_matching(
  format(
    $$ select app.create_delivery_order('%s', '%s', '%s', 'JNT', 'CARGO', jsonb_build_array(jsonb_build_object('order_item_id', '%s', 'quantity', 50))) $$,
    (select org from shp_ctx),
    (select owner_actor from shp_ctx),
    (select order_id from shp_item),
    (select item_id from shp_item)
  ),
  'exceeds remaining unshipped quota',
  'Over-shipping quantity is strictly blocked by ceiling guard'
);

-- 6. Dispatch Shipment 1 (Add tracking number and actual cost Rp 150.000)
create temporary table shp_dispatch as select app.dispatch_shipment(
  p_organization_id => (select org from shp_ctx),
  p_actor_id => (select owner_actor from shp_ctx),
  p_shipment_id => (select (result->>'shipment_id')::uuid from shp_do1),
  p_tracking_number => 'JNT-9988776655',
  p_actual_shipping_cost => 150000::bigint,
  p_notes => 'Paket diserahkan ke kurir J&T Cargo'
) result;

select is(
  (select (result->>'status') from shp_dispatch),
  'DISPATCHED',
  'Shipment successfully transitioned to DISPATCHED'
);

select is(
  (select (result->>'tracking_number') from shp_dispatch),
  'JNT-9988776655',
  'Tracking number successfully recorded on shipment'
);

-- 7. Verify Ledger Entry for Courier Expense Disbursed
select results_eq(
  $$ select entry_type, category, amount, direction
     from app.financial_ledger_entries
     where reference_id = (select (result->>'shipment_id')::uuid from shp_do1) $$,
  $$ values('COURIER_EXPENSE_DISBURSED', 'PASS_THROUGH_SHIPPING', 150000::bigint, 'DEBIT') $$,
  'Actual courier expense disbursed recorded in financial ledger'
);

-- 8. Mark Shipment 1 Delivered
create temporary table shp_delivered as select app.mark_shipment_delivered(
  p_organization_id => (select org from shp_ctx),
  p_actor_id => (select owner_actor from shp_ctx),
  p_shipment_id => (select (result->>'shipment_id')::uuid from shp_do1),
  p_delivered_date => now(),
  p_notes => 'Diterima oleh Pak Satpam'
) result;

select is(
  (select (result->>'status') from shp_delivered),
  'DELIVERED',
  'Shipment transitioned to DELIVERED'
);

-- 9. Immutability Guard: Delivered shipment cannot be modified or deleted
select throws_matching(
  format(
    $$ update app.shipments set courier_name = 'SICEPAT' where id = '%s' $$,
    (select (result->>'shipment_id')::uuid from shp_do1)
  ),
  'permanently immutable',
  'Delivered shipment details cannot be modified'
);

select throws_matching(
  format(
    $$ delete from app.shipments where id = '%s' $$,
    (select (result->>'shipment_id')::uuid from shp_do1)
  ),
  'Cannot delete active or dispatched shipment',
  'Delivered shipment cannot be deleted'
);

-- 10. Schedule Remaining 40 pcs as Shipment 2
create temporary table shp_do2 as select app.create_delivery_order(
  p_organization_id => (select org from shp_ctx),
  p_actor_id => (select owner_actor from shp_ctx),
  p_order_id => (select order_id from shp_item),
  p_courier_name => 'SICEPAT',
  p_items => jsonb_build_array(
    jsonb_build_object('order_item_id', (select item_id from shp_item), 'quantity', 40, 'notes', 'Batch 2 final')
  ),
  p_notes => 'Batch 2 remaining 40 pcs'
) result;

select is(
  (select (result->>'status') from shp_do2),
  'READY_TO_DISPATCH',
  'Shipment 2 for remaining 40 pcs created'
);

-- 11. Test Cancel Shipment 2
create temporary table shp_cancelled as select app.cancel_shipment(
  p_organization_id => (select org from shp_ctx),
  p_actor_id => (select owner_actor from shp_ctx),
  p_shipment_id => (select (result->>'shipment_id')::uuid from shp_do2),
  p_reason => 'Pelanggan minta ganti ekspedisi ke Lalamove'
) result;

select is(
  (select (result->>'status') from shp_cancelled),
  'CANCELLED',
  'Shipment 2 successfully cancelled'
);

-- 12. Verify cancellation freed up the 40 pcs quota (can create DO again for 40 pcs)
create temporary table shp_do3 as select app.create_delivery_order(
  p_organization_id => (select org from shp_ctx),
  p_actor_id => (select owner_actor from shp_ctx),
  p_order_id => (select order_id from shp_item),
  p_courier_name => 'LALAMOVE',
  p_items => jsonb_build_array(
    jsonb_build_object('order_item_id', (select item_id from shp_item), 'quantity', 40)
  ),
  p_notes => 'Re-scheduled Batch 2 with Lalamove'
) result;

select is(
  (select (result->>'status') from shp_do3),
  'READY_TO_DISPATCH',
  'Cancelling shipment safely restored available unshipped quota'
);

-- 13. Audit trail verification
select ok(
  (select count(*) from app.shipment_audit where shipment_id = (select (result->>'shipment_id')::uuid from shp_do1)) >= 3,
  'Audit trail recorded all lifecycle events for shipment 1 (created, dispatched, delivered)'
);

select * from finish();
rollback;
