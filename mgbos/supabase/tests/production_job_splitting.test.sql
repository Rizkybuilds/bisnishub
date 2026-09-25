begin;
select plan(21);

create temporary table prod_ctx as select
  (select id from app.organizations where code='multigraph-group') org,
  (select id from app.brands where code='TS') brand,
  (select id from app.brands where code='SQ') squeegee_brand,
  (select id from app.users where email='founder@multigraph.id') owner_actor,
  (select id from app.customer_accounts where status='ACTIVE' limit 1) customer;

-- Create Operations and QC test actors
insert into app.users(id, name, email) values
  ('77777777-0000-4000-8000-000000000011', 'Ops Tester', 'ops-tester@local.invalid'),
  ('77777777-0000-4000-8000-000000000012', 'QC Tester', 'qc-tester@local.invalid');

insert into app.organization_members(organization_id, user_id, role_id)
select org, '77777777-0000-4000-8000-000000000011', (select id from app.roles where organization_id=org and code='OPERATIONS') from prod_ctx;

insert into app.organization_members(organization_id, user_id, role_id)
select org, '77777777-0000-4000-8000-000000000012', (select id from app.roles where organization_id=org and code='QC') from prod_ctx;

-- Setup full upstream pipeline: Requirement -> Quote -> Accept -> Order Contract
create temporary table prod_req as select app.create_requirement_with_initial_version(
  p_organization_id => org,
  p_brand_id => brand,
  p_title => 'Job Splitting Pilot',
  p_summary => '100 pcs Event Tees',
  p_customer_account_id => customer,
  p_quantity => 100,
  p_actor_id => owner_actor
) result from prod_ctx;

select app.transition_requirement_status(org, (result->>'requirement_id')::uuid, 'READY', owner_actor) from prod_ctx, prod_req;

create temporary table prod_quote as select app.save_quote_version(
  p_organization_id => org,
  p_actor_id => owner_actor,
  p_request_id => '55555555-0000-4000-8000-000000000001',
  p_requirement_version_id => (result->>'version_id')::uuid,
  p_customer_id => customer,
  p_unit_price => 110000,
  p_discount => 0,
  p_shipping => 200000,
  p_costs => jsonb_build_array(
    jsonb_build_object('cost_type', 'GARMENT', 'description', 'Blanks Cotton Combed', 'quantity', 100, 'unit_cost', 45000),
    jsonb_build_object('cost_type', 'PRINTING', 'description', 'DTF Print A3', 'quantity', 100, 'unit_cost', 25000)
  ),
  p_valid_until => current_date + 14,
  p_terms => 'DP 50%',
  p_lead_time => '10 working days',
  p_notes => 'Job splitting quote'
) result from prod_ctx, prod_req;

select app.mark_quote_sent(org, owner_actor, (result->>'version_id')::uuid) from prod_ctx, prod_quote;
select app.mark_quote_accepted(org, owner_actor, (result->>'version_id')::uuid, 'WHATSAPP', null, 'Confirmed by client') from prod_ctx, prod_quote;

create temporary table prod_order as select app.create_order_from_quote(
  p_organization_id => org,
  p_actor_id => owner_actor,
  p_request_id => '44444444-0000-4000-8000-000000000001',
  p_quote_version_id => (result->>'version_id')::uuid,
  p_shipping_address => jsonb_build_object(
    'recipient_name', 'Budi Purchasing',
    'phone', '081234567890',
    'street', 'Jl. Gatot Subroto No. 40',
    'city', 'Jakarta Selatan'
  )
) result from prod_ctx, prod_quote;

-- Retrieve order_item_id
create temporary table prod_order_item as select id as order_item_id
from app.order_items
where order_id = (select (result->>'order_id')::uuid from prod_order)
limit 1;

-- 1. Test Authority for Job Creation
-- QC cannot create production jobs
select throws_ok(
  $q$select app.create_production_job(
    org, '77777777-0000-4000-8000-000000000012', (result->>'order_id')::uuid,
    'GARMENT', 'Pengadaan Kaos Polos'
  ) from prod_ctx, prod_order$q$,
  'P0001',
  'Not authorized to create production jobs',
  'QC user rejected from creating production jobs'
);

-- Happy path: Operations creates Job 1 (GARMENT)
create temporary table prod_job_1 as select app.create_production_job(
  p_organization_id => org,
  p_actor_id => '77777777-0000-4000-8000-000000000011',
  p_order_id => (o.result->>'order_id')::uuid,
  p_job_type => 'GARMENT',
  p_title => 'Pengadaan Kaos Polos Combed 24s 100 pcs',
  p_estimated_cost => 4500000,
  p_specification => '{"sizes": {"M": 40, "L": 40, "XL": 20}}'::jsonb,
  p_items => jsonb_build_array(jsonb_build_object('order_item_id', oi.order_item_id, 'quantity', 100)),
  p_priority => 'HIGH',
  p_target_date => current_date + 4,
  p_notes => 'Pastikan warna Black Jet pekat'
) result from prod_ctx c, prod_order o, prod_order_item oi;

-- Check Job 1 fields
select ok(
  (select (result->>'job_number') like 'TS-J-%' from prod_job_1),
  'Production job receives canonical document number TS-J-YYYY-XXXXXX'
);

select is(
  (select status from app.production_jobs where id = (select (result->>'job_id')::uuid from prod_job_1)),
  'PLANNED',
  'Production job starts in PLANNED status'
);

select is(
  (select job_type from app.production_jobs where id = (select (result->>'job_id')::uuid from prod_job_1)),
  'GARMENT',
  'Job type is GARMENT'
);

select is(
  (select estimated_cost from app.production_jobs where id = (select (result->>'job_id')::uuid from prod_job_1)),
  4500000::bigint,
  'Estimated cost preserved in bigint'
);

select is(
  (select count(*)::integer from app.production_job_items where production_job_id = (select (result->>'job_id')::uuid from prod_job_1)),
  1,
  'Order item linked in production_job_items'
);

-- Happy path: Operations creates Job 2 (PRINTING)
create temporary table prod_job_2 as select app.create_production_job(
  p_organization_id => org,
  p_actor_id => '77777777-0000-4000-8000-000000000011',
  p_order_id => (o.result->>'order_id')::uuid,
  p_job_type => 'PRINTING',
  p_title => 'Cetak & Press DTF Meteran A3 Front',
  p_estimated_cost => 2500000,
  p_specification => '{"placement": "FRONT_CHEST", "dimensions": "28x40 cm", "film_type": "PET Cold Peel"}'::jsonb,
  p_items => jsonb_build_array(jsonb_build_object('order_item_id', oi.order_item_id, 'quantity', 100)),
  p_priority => 'HIGH',
  p_target_date => current_date + 7
) result from prod_ctx c, prod_order o, prod_order_item oi;

select is(
  (select count(*)::integer from app.production_jobs where order_id = (select (result->>'order_id')::uuid from prod_order)),
  2,
  'Order split into 2 distinct production jobs'
);

-- 2. State Machine Transitions
-- QC cannot transition status from PLANNED
select throws_ok(
  $q$select app.transition_production_job_status(
    org, '77777777-0000-4000-8000-000000000012', (result->>'job_id')::uuid, 'READY'
  ) from prod_ctx, prod_job_1$q$,
  'P0001',
  'QC role may only transition jobs from AWAITING_QC to READY_FOR_HANDOFF, REWORK, or ON_HOLD',
  'QC user rejected from transitioning production status'
);

-- Illegal jump: PLANNED to COMPLETED
select throws_ok(
  $q$select app.transition_production_job_status(
    org, '77777777-0000-4000-8000-000000000011', (result->>'job_id')::uuid, 'COMPLETED'
  ) from prod_ctx, prod_job_1$q$,
  'P0001',
  'Invalid production job transition from PLANNED to COMPLETED',
  'Illegal state transition rejected'
);

-- Valid progression: PLANNED to READY
select is(
  (select app.transition_production_job_status(
    org, '77777777-0000-4000-8000-000000000011', (result->>'job_id')::uuid, 'READY', 'Artwork and specs verified'
  ) from prod_ctx, prod_job_1),
  'READY',
  'Job 1 successfully advanced to READY'
);

-- 3. Executor Assignment
-- Assign Job 1 to external vendor
select lives_ok(
  $q$select app.assign_production_job(
    p_organization_id => org,
    p_actor_id => '77777777-0000-4000-8000-000000000011',
    p_job_id => (result->>'job_id')::uuid,
    p_executor_type => 'VENDOR',
    p_vendor_name => 'PT Mulia Garmen Blanks',
    p_assigned_cost => 4400000,
    p_notes => 'Diskon volume 100 pcs'
  ) from prod_ctx, prod_job_1$q$,
  'Job 1 assigned to external vendor'
);

-- Job 1 status is now ASSIGNED and committed_cost is updated
select is(
  (select status from app.production_jobs where id = (select (result->>'job_id')::uuid from prod_job_1)),
  'ASSIGNED',
  'Job status updated to ASSIGNED'
);

select is(
  (select committed_cost from app.production_jobs where id = (select (result->>'job_id')::uuid from prod_job_1)),
  4400000::bigint,
  'Committed cost recorded accurately'
);

-- Assign Job 2 internally to holding partner Squeegee Studios
select lives_ok(
  $q$select app.assign_production_job(
    p_organization_id => org,
    p_actor_id => '77777777-0000-4000-8000-000000000011',
    p_job_id => (result->>'job_id')::uuid,
    p_executor_type => 'INTERNAL',
    p_assigned_brand_id => squeegee_brand,
    p_assigned_cost => 2400000,
    p_notes => 'Internal holding transfer to Squeegee'
  ) from prod_ctx, prod_job_2$q$,
  'Job 2 assigned internally to Squeegee Studios'
);

-- Advance Job 1 through full manufacturing pipeline
select is(
  (select app.transition_production_job_status(
    org, '77777777-0000-4000-8000-000000000011', (result->>'job_id')::uuid, 'ACCEPTED'
  ) from prod_ctx, prod_job_1),
  'ACCEPTED',
  'Job 1 accepted by vendor'
);

select is(
  (select app.transition_production_job_status(
    org, '77777777-0000-4000-8000-000000000011', (result->>'job_id')::uuid, 'IN_PRODUCTION'
  ) from prod_ctx, prod_job_1),
  'IN_PRODUCTION',
  'Job 1 production started'
);

select is(
  (select app.transition_production_job_status(
    org, '77777777-0000-4000-8000-000000000011', (result->>'job_id')::uuid, 'AWAITING_QC'
  ) from prod_ctx, prod_job_1),
  'AWAITING_QC',
  'Job 1 finished and awaiting QC inspection'
);

select is(
  (select app.transition_production_job_status(
    org, '77777777-0000-4000-8000-000000000011', (result->>'job_id')::uuid, 'READY_FOR_HANDOFF'
  ) from prod_ctx, prod_job_1),
  'READY_FOR_HANDOFF',
  'Job 1 passed QC and ready for handoff'
);

select is(
  (select app.transition_production_job_status(
    org, '77777777-0000-4000-8000-000000000011', (result->>'job_id')::uuid, 'COMPLETED'
  ) from prod_ctx, prod_job_1),
  'COMPLETED',
  'Job 1 completed'
);

-- Completed is terminal
select throws_ok(
  $q$select app.transition_production_job_status(
    org, '77777777-0000-4000-8000-000000000011', (result->>'job_id')::uuid, 'IN_PRODUCTION'
  ) from prod_ctx, prod_job_1$q$,
  'P0001',
  'Invalid production job transition from COMPLETED to IN_PRODUCTION',
  'Terminal completed job cannot be transitioned'
);

-- Check audit trail
select ok(
  (select count(*)::integer >= 6 from app.production_job_audit where production_job_id = (select (result->>'job_id')::uuid from prod_job_1)),
  'Audit trail recorded for each job creation, assignment, and status transition'
);

select * from finish();
rollback;
