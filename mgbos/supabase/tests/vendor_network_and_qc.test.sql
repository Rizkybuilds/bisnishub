begin;
select plan(26);

create temporary table vqc_ctx as select
  (select id from app.organizations where code='multigraph-group') org,
  (select id from app.brands where code='TS') brand,
  (select id from app.users where email='founder@multigraph.id') owner_actor,
  (select id from app.customer_accounts where status='ACTIVE' limit 1) customer;

-- Create Ops and QC test users
insert into app.users(id, name, email) values
  ('88888888-0000-4000-8000-000000000001', 'Vendor Ops', 'vendor-ops@local.invalid'),
  ('88888888-0000-4000-8000-000000000002', 'Inspector Gadget', 'inspector@local.invalid')
on conflict (id) do nothing;

insert into app.organization_members(organization_id, user_id, role_id)
select org, '88888888-0000-4000-8000-000000000001', (select id from app.roles where organization_id=org and code='OPERATIONS') from vqc_ctx
on conflict do nothing;

insert into app.organization_members(organization_id, user_id, role_id)
select org, '88888888-0000-4000-8000-000000000002', (select id from app.roles where organization_id=org and code='QC') from vqc_ctx
on conflict do nothing;

-- 1. Test app.create_vendor by OPERATIONS
create temporary table test_vendor as select app.create_vendor(
  p_organization_id => org,
  p_actor_id => '88888888-0000-4000-8000-000000000001',
  p_code => 'VND-NSA-01',
  p_name => 'PT Mulia Kaos Blanks',
  p_category => 'GARMENT_SUPPLIER',
  p_contact_person => 'Budi Santoso',
  p_phone => '08123456789',
  p_email => 'sales@muliakaos.co.id',
  p_lead_time_days => 2,
  p_payment_terms => 'NET_14',
  p_notes => 'Official NSA distributor'
) v_id from vqc_ctx;

select ok((select count(*) from app.vendors where code='VND-NSA-01') = 1, 'Vendor successfully created');
select is((select category from app.vendors where code='VND-NSA-01'), 'GARMENT_SUPPLIER', 'Vendor category recorded');
select is((select payment_terms from app.vendors where code='VND-NSA-01'), 'NET_14', 'Vendor payment terms recorded');

-- 2. Test create_vendor unauthorized role (QC cannot manage vendors)
select throws_ok(
  format('select app.create_vendor(%L, %L, %L, %L, %L)',
    (select org from vqc_ctx),
    '88888888-0000-4000-8000-000000000002', -- QC role
    'VND-ERR-01',
    'Bad Vendor',
    'OTHER'
  ),
  'Not authorized to manage vendors',
  'QC role cannot create vendors'
);

-- 3. Test upsert_vendor_rate_card
create temporary table test_rc as select app.upsert_vendor_rate_card(
  p_organization_id => org,
  p_actor_id => '88888888-0000-4000-8000-000000000001',
  p_vendor_id => (select v_id from test_vendor),
  p_service_code => 'NSA_7200_WHITE_L',
  p_description => 'New States Apparel 7200 Premium Cotton White L',
  p_unit => 'pcs',
  p_unit_cost => 42000,
  p_min_order_quantity => 12,
  p_notes => 'Minimum 1 dozen'
) rc_id from vqc_ctx;

select ok((select count(*) from app.vendor_rate_cards where service_code='NSA_7200_WHITE_L') = 1, 'Rate card created');
select is((select unit_cost from app.vendor_rate_cards where service_code='NSA_7200_WHITE_L'), 42000::bigint, 'Rate card unit cost is Zero-Float bigint');

-- Update rate card (upsert test)
select app.upsert_vendor_rate_card(
  p_organization_id => org,
  p_actor_id => '88888888-0000-4000-8000-000000000001',
  p_vendor_id => (select v_id from test_vendor),
  p_service_code => 'NSA_7200_WHITE_L',
  p_description => 'New States Apparel 7200 Premium Cotton White L (Adjusted)',
  p_unit => 'pcs',
  p_unit_cost => 43500,
  p_min_order_quantity => 12
) from vqc_ctx;

select is((select unit_cost from app.vendor_rate_cards where service_code='NSA_7200_WHITE_L'), 43500::bigint, 'Rate card updated on conflict');

-- 4. Setup an Order and Production Job for QC Testing
create temporary table vqc_req as select app.create_requirement_with_initial_version(
  p_organization_id => org,
  p_brand_id => brand,
  p_title => 'QC Pipeline Test',
  p_summary => '50 pcs Polos',
  p_customer_account_id => customer,
  p_quantity => 50,
  p_actor_id => owner_actor
) result from vqc_ctx;

select app.transition_requirement_status(org, (result->>'requirement_id')::uuid, 'READY', owner_actor) from vqc_ctx, vqc_req;

create temporary table vqc_quote as select app.save_quote_version(
  p_organization_id => org,
  p_actor_id => owner_actor,
  p_request_id => '55555555-0000-4000-8000-000000000002',
  p_requirement_version_id => (result->>'version_id')::uuid,
  p_customer_id => customer,
  p_unit_price => 120000,
  p_discount => 0,
  p_shipping => 50000,
  p_costs => jsonb_build_array(
    jsonb_build_object('cost_type', 'GARMENT', 'description', 'Blanks', 'quantity', 50, 'unit_cost', 45000)
  ),
  p_valid_until => current_date + 14,
  p_terms => 'COD',
  p_lead_time => '7 days',
  p_notes => 'QC test quote'
) result from vqc_ctx, vqc_req;

select app.mark_quote_sent(org, owner_actor, (result->>'version_id')::uuid) from vqc_ctx, vqc_quote;
select app.mark_quote_accepted(org, owner_actor, (result->>'version_id')::uuid, 'DIRECT', null, 'Confirmed') from vqc_ctx, vqc_quote;

create temporary table vqc_order as select app.create_order_from_quote(
  p_organization_id => org,
  p_actor_id => owner_actor,
  p_request_id => '44444444-0000-4000-8000-000000000002',
  p_quote_version_id => (result->>'version_id')::uuid,
  p_shipping_address => jsonb_build_object(
    'recipient_name', 'Budi Client',
    'phone', '081122334455',
    'street', 'Jl. Merdeka No. 10',
    'city', 'Bandung'
  )
) result from vqc_ctx, vqc_quote;

-- Create Production Job
create temporary table vqc_job as select app.create_production_job(
  p_organization_id => org,
  p_actor_id => owner_actor,
  p_order_id => (result->>'order_id')::uuid,
  p_job_type => 'PRINTING',
  p_title => 'DTF Print Front Chest',
  p_estimated_cost => 1250000,
  p_items => jsonb_build_array(
    jsonb_build_object(
      'order_item_id', (select id from app.order_items where order_id = (result->>'order_id')::uuid limit 1),
      'quantity', 50
    )
  )
) result from vqc_ctx, vqc_order;

select ok((result->>'job_id') is not null, 'Production job created for QC testing') from vqc_job;

-- Advance Job: PLANNED -> READY -> ASSIGNED -> ACCEPTED -> IN_PRODUCTION -> AWAITING_QC
select app.transition_production_job_status(org, owner_actor, (result->>'job_id')::uuid, 'READY') from vqc_ctx, vqc_job;
select app.assign_production_job(org, owner_actor, (result->>'job_id')::uuid, 'VENDOR', 'Bintang DTF', null, 1200000) from vqc_ctx, vqc_job;
select app.transition_production_job_status(org, owner_actor, (result->>'job_id')::uuid, 'ACCEPTED') from vqc_ctx, vqc_job;
select app.transition_production_job_status(org, owner_actor, (result->>'job_id')::uuid, 'IN_PRODUCTION') from vqc_ctx, vqc_job;
select app.transition_production_job_status(org, owner_actor, (result->>'job_id')::uuid, 'AWAITING_QC') from vqc_ctx, vqc_job;

select is((select status from app.production_jobs where id = (select (result->>'job_id')::uuid from vqc_job)), 'AWAITING_QC', 'Job advanced to AWAITING_QC');

-- 5. Test QC Inspection with Result = REWORK
create temporary table qc_rework_res as select app.record_qc_inspection(
  p_organization_id => org,
  p_actor_id => '88888888-0000-4000-8000-000000000002', -- QC Actor
  p_production_job_id => (result->>'job_id')::uuid,
  p_result => 'REWORK',
  p_sample_size => 10,
  p_defect_count => 3,
  p_defect_category => 'PRINT_MISALIGNMENT',
  p_defect_severity => 'MAJOR',
  p_checklist_snapshot => jsonb_build_object('alignment_check', false, 'adhesion_check', true),
  p_rework_instructions => 'Press ulang sablon bagian dada dengan margin lurus 7 cm dari kerah',
  p_notes => '3 dari 10 sampel miring lebih dari 1 cm'
) res from vqc_ctx, vqc_job;

select ok((res->>'inspection_id') is not null, 'QC rework inspection created') from qc_rework_res;
select is((res->>'result'), 'REWORK', 'QC result is REWORK') from qc_rework_res;
select is((select status from app.production_jobs where id = (select (result->>'job_id')::uuid from vqc_job)), 'REWORK', 'Job status automatically transitioned to REWORK');
select is((select defect_category from app.qc_inspections where id = (select (res->>'inspection_id')::uuid from qc_rework_res)), 'PRINT_MISALIGNMENT', 'Defect category stored in QC inspection');
select is((select defect_severity from app.qc_inspections where id = (select (res->>'inspection_id')::uuid from qc_rework_res)), 'MAJOR', 'Defect severity stored in QC inspection');

-- 6. Rework flow: REWORK -> IN_PRODUCTION -> AWAITING_QC -> PASS
select app.transition_production_job_status(org, owner_actor, (result->>'job_id')::uuid, 'IN_PRODUCTION', 'Rework in progress') from vqc_ctx, vqc_job;
select app.transition_production_job_status(org, owner_actor, (result->>'job_id')::uuid, 'AWAITING_QC', 'Rework finished, requesting re-inspection') from vqc_ctx, vqc_job;

create temporary table qc_pass_res as select app.record_qc_inspection(
  p_organization_id => org,
  p_actor_id => '88888888-0000-4000-8000-000000000002', -- QC Actor
  p_production_job_id => (result->>'job_id')::uuid,
  p_result => 'PASS',
  p_sample_size => 10,
  p_defect_count => 0,
  p_checklist_snapshot => jsonb_build_object('alignment_check', true, 'adhesion_check', true, 'wash_fastness', true),
  p_notes => 'Semua 10 sampel lolos toleransi cetak dan presisi posisi'
) res from vqc_ctx, vqc_job;

select ok((res->>'inspection_id') is not null, 'QC pass inspection created') from qc_pass_res;
select is((res->>'result'), 'PASS', 'QC result is PASS') from qc_pass_res;
select matches((res->>'inspection_number'), '^TS-QC-\d{4}-\d{6}$', 'Canonical QC document number follows TS-QC-YYYY-XXXXXX format') from qc_pass_res;
select is((select status from app.production_jobs where id = (select (result->>'job_id')::uuid from vqc_job)), 'READY_FOR_HANDOFF', 'Job status automatically transitioned to READY_FOR_HANDOFF');
select ok((select count(*) from app.production_job_audit where production_job_id = (select (result->>'job_id')::uuid from vqc_job) and action = 'job.qc_inspection') >= 2, 'QC audits recorded in production job audit log');

-- 7. Test QC Inspection with Result = REJECTED -> ON_HOLD
insert into app.users(id, name, email) values
  ('88888888-0000-4000-8000-000000000003', 'Sales Guy', 'sales@local.invalid')
on conflict (id) do nothing;

insert into app.organization_members(organization_id, user_id, role_id)
select org, '88888888-0000-4000-8000-000000000003', (select id from app.roles where organization_id=org and code='SALES') from vqc_ctx
on conflict do nothing;

create temporary table vqc_job2 as select app.create_production_job(
  p_organization_id => org,
  p_actor_id => owner_actor,
  p_order_id => (result->>'order_id')::uuid,
  p_job_type => 'PACKAGING',
  p_title => 'Hangtag & Polymailer',
  p_estimated_cost => 150000
) result from vqc_ctx, vqc_order;

select ok((result->>'job_id') is not null, 'Production job 2 created for QC rejected testing') from vqc_job2;

select app.transition_production_job_status(org, owner_actor, (result->>'job_id')::uuid, 'READY') from vqc_ctx, vqc_job2;
select app.assign_production_job(org, owner_actor, (result->>'job_id')::uuid, 'INTERNAL', null, (select id from app.brands where code='TS')) from vqc_ctx, vqc_job2;
select app.transition_production_job_status(org, owner_actor, (result->>'job_id')::uuid, 'ACCEPTED') from vqc_ctx, vqc_job2;
select app.transition_production_job_status(org, owner_actor, (result->>'job_id')::uuid, 'IN_PRODUCTION') from vqc_ctx, vqc_job2;
select app.transition_production_job_status(org, owner_actor, (result->>'job_id')::uuid, 'AWAITING_QC') from vqc_ctx, vqc_job2;

select is((select status from app.production_jobs where id = (select (result->>'job_id')::uuid from vqc_job2)), 'AWAITING_QC', 'Job 2 advanced to AWAITING_QC');

-- Unauthorized role cannot perform QC
select throws_ok(
  format('select app.record_qc_inspection(%L, %L, %L, %L)',
    (select org from vqc_ctx),
    '88888888-0000-4000-8000-000000000003', -- SALES role
    (select (result->>'job_id')::uuid from vqc_job2),
    'PASS'
  ),
  'Not authorized to record QC inspection',
  'Sales role cannot record QC inspection'
);

-- Reject job
create temporary table qc_reject_res as select app.record_qc_inspection(
  p_organization_id => org,
  p_actor_id => '88888888-0000-4000-8000-000000000002', -- QC Actor
  p_production_job_id => (result->>'job_id')::uuid,
  p_result => 'REJECTED',
  p_sample_size => 5,
  p_defect_count => 5,
  p_defect_category => 'FINISHING_PACKAGING',
  p_defect_severity => 'CRITICAL',
  p_notes => 'Polymailer rusak dan salah ukuran hangtag'
) res from vqc_ctx, vqc_job2;

select ok((res->>'inspection_id') is not null, 'QC rejected inspection created') from qc_reject_res;
select is((res->>'result'), 'REJECTED', 'QC result is REJECTED') from qc_reject_res;
select is((select status from app.production_jobs where id = (select (result->>'job_id')::uuid from vqc_job2)), 'ON_HOLD', 'Job status automatically transitioned to ON_HOLD');

-- Throws if trying to inspect job that is already ON_HOLD (not AWAITING_QC)
select throws_ok(
  format('select app.record_qc_inspection(%L, %L, %L, %L)',
    (select org from vqc_ctx),
    '88888888-0000-4000-8000-000000000002',
    (select (result->>'job_id')::uuid from vqc_job2),
    'PASS'
  ),
  'Job must be in AWAITING_QC status to perform inspection (current: ON_HOLD)',
  'Cannot inspect job not in AWAITING_QC status'
);

select * from finish();
rollback;
