-- Test Suite: order_replay_org_isolation.test.sql
-- Description: pgTAP tests for C-SEC-02 (R4) B2B and Retail Order Replay Organization Isolation
-- Covers Acceptance Criteria: AC-001 through AC-010 (ORG-01 to ORG-10)

begin;
select plan(65);

-- ============================================================================
-- 1. Database Privilege Catalog Verification (ORG-08 Fail-Closed Hardening)
-- ============================================================================

-- B2B create_order_from_quote: anonymous and authenticated strictly denied
select ok(
  not has_function_privilege('anon', 'app.create_order_from_quote(uuid,uuid,uuid,uuid,jsonb,jsonb,jsonb,text)', 'EXECUTE'),
  'ORG-08: anon denied EXECUTE on app.create_order_from_quote'
);
select ok(
  not has_function_privilege('authenticated', 'app.create_order_from_quote(uuid,uuid,uuid,uuid,jsonb,jsonb,jsonb,text)', 'EXECUTE'),
  'ORG-08: authenticated denied EXECUTE on app.create_order_from_quote'
);
select ok(
  not has_function_privilege('public', 'app.create_order_from_quote(uuid,uuid,uuid,uuid,jsonb,jsonb,jsonb,text)', 'EXECUTE'),
  'ORG-08: public denied EXECUTE on app.create_order_from_quote'
);
select ok(
  has_function_privilege('service_role', 'app.create_order_from_quote(uuid,uuid,uuid,uuid,jsonb,jsonb,jsonb,text)', 'EXECUTE'),
  'ORG-08: service_role granted EXECUTE on app.create_order_from_quote'
);

-- Retail create_retail_order: anonymous and authenticated strictly denied
select ok(
  not has_function_privilege('anon', 'app.create_retail_order(uuid,uuid,uuid,uuid,jsonb,uuid,jsonb,bigint,text,boolean,text,text,text)', 'EXECUTE'),
  'ORG-08: anon denied EXECUTE on app.create_retail_order'
);
select ok(
  not has_function_privilege('authenticated', 'app.create_retail_order(uuid,uuid,uuid,uuid,jsonb,uuid,jsonb,bigint,text,boolean,text,text,text)', 'EXECUTE'),
  'ORG-08: authenticated denied EXECUTE on app.create_retail_order'
);
select ok(
  not has_function_privilege('public', 'app.create_retail_order(uuid,uuid,uuid,uuid,jsonb,uuid,jsonb,bigint,text,boolean,text,text,text)', 'EXECUTE'),
  'ORG-08: public denied EXECUTE on app.create_retail_order'
);
select ok(
  has_function_privilege('service_role', 'app.create_retail_order(uuid,uuid,uuid,uuid,jsonb,uuid,jsonb,bigint,text,boolean,text,text,text)', 'EXECUTE'),
  'ORG-08: service_role granted EXECUTE on app.create_retail_order'
);

-- Direct low-privilege RPC execution denial tests (R4-QA-04)
set local role anon;
select throws_ok(
  $q$
    select app.create_order_from_quote(
      'a2222222-2222-4000-8000-000000000001'::uuid,
      'a1111111-1111-4000-8000-000000000001'::uuid,
      gen_random_uuid(),
      gen_random_uuid(),
      '{}'::jsonb
    )
  $q$,
  '42501',
  null,
  'ORG-08: Direct RPC execution of create_order_from_quote as anon is denied with 42501'
);

select throws_ok(
  $q$
    select app.create_retail_order(
      'a2222222-2222-4000-8000-000000000001'::uuid,
      'a1111111-1111-4000-8000-000000000001'::uuid,
      'a2222222-2222-4000-8000-000000000002'::uuid,
      'a2222222-2222-4000-8000-000000000005'::uuid,
      '[]'::jsonb
    )
  $q$,
  '42501',
  null,
  'ORG-08: Direct RPC execution of create_retail_order as anon is denied with 42501'
);

set local role authenticated;
select throws_ok(
  $q$
    select app.create_order_from_quote(
      'a2222222-2222-4000-8000-000000000001'::uuid,
      'a1111111-1111-4000-8000-000000000001'::uuid,
      gen_random_uuid(),
      gen_random_uuid(),
      '{}'::jsonb
    )
  $q$,
  '42501',
  null,
  'ORG-08: Direct RPC execution of create_order_from_quote as authenticated is denied with 42501'
);

select throws_ok(
  $q$
    select app.create_retail_order(
      'a2222222-2222-4000-8000-000000000001'::uuid,
      'a1111111-1111-4000-8000-000000000001'::uuid,
      'a2222222-2222-4000-8000-000000000002'::uuid,
      'a2222222-2222-4000-8000-000000000005'::uuid,
      '[]'::jsonb
    )
  $q$,
  '42501',
  null,
  'ORG-08: Direct RPC execution of create_retail_order as authenticated is denied with 42501'
);

reset role;


-- ============================================================================
-- 2. Multi-Tenant Test Context Setup (Two Organizations, Shared & Scoped Users)
-- ============================================================================

-- Create Synthetic Org 2
insert into app.organizations (id, code, legal_name, display_name)
values ('a2222222-2222-4000-8000-000000000001', 'sec02-org-beta', 'PT Beta Sejahtera', 'Beta Corp');

insert into app.brands (id, organization_id, code, name, slug)
values ('a2222222-2222-4000-8000-000000000002', 'a2222222-2222-4000-8000-000000000001', 'BETA', 'Beta Brand', 'beta-brand');

insert into app.roles (id, organization_id, code, name)
values
  ('a2222222-2222-4000-8000-000000000003', 'a2222222-2222-4000-8000-000000000001', 'SALES', 'Sales Beta'),
  ('a2222222-2222-4000-8000-000000000004', 'a2222222-2222-4000-8000-000000000001', 'OWNER', 'Owner Beta');

insert into app.customer_accounts (id, organization_id, account_type, display_name, legal_name, primary_email, status)
values ('a2222222-2222-4000-8000-000000000005', 'a2222222-2222-4000-8000-000000000001', 'COMPANY', 'Customer Beta', 'PT Klien Beta', 'klien2@beta.invalid', 'ACTIVE');

insert into app.customer_brand_relationships (customer_account_id, brand_id)
values ('a2222222-2222-4000-8000-000000000005', 'a2222222-2222-4000-8000-000000000002');

-- Context table with Org 1 and Org 2
create temporary table test_ctx as select
  (select id from app.organizations where code = 'multigraph-group') as org1,
  (select id from app.brands where code = 'TS') as brand1,
  (select id from app.customer_accounts where organization_id = (select id from app.organizations where code = 'multigraph-group') and status = 'ACTIVE' limit 1) as cust1,
  'a2222222-2222-4000-8000-000000000001'::uuid as org2,
  'a2222222-2222-4000-8000-000000000002'::uuid as brand2,
  'a2222222-2222-4000-8000-000000000005'::uuid as cust2;

-- Test Users:
-- User A: Sales actor in BOTH Org 1 and Org 2
insert into app.users (id, name, email) values
  ('a1111111-1111-4000-8000-000000000001', 'Dual-Org Sales Actor', 'dual-sales@sec02.invalid'),
  ('a1111111-1111-4000-8000-000000000002', 'QC Actor Org 1', 'qc-actor@sec02.invalid');

-- Membership for User A in Org 1 (OWNER) and Org 2 (OWNER)
insert into app.organization_members (organization_id, user_id, role_id)
select org1, 'a1111111-1111-4000-8000-000000000001', (select id from app.roles where organization_id = org1 and code = 'OWNER') from test_ctx;

insert into app.organization_members (organization_id, user_id, role_id)
values ('a2222222-2222-4000-8000-000000000001', 'a1111111-1111-4000-8000-000000000001', 'a2222222-2222-4000-8000-000000000004');

-- Membership for User B in Org 1 (QC - Denied for orders:create)
insert into app.organization_members (organization_id, user_id, role_id)
select org1, 'a1111111-1111-4000-8000-000000000002', (select id from app.roles where organization_id = org1 and code = 'QC') from test_ctx;

-- Setup B2B Quote in Org 1
create temporary table test_b2b_req as select app.create_requirement_with_initial_version(
  p_organization_id => org1,
  p_brand_id => brand1,
  p_title => 'SEC02 Test B2B Requirement',
  p_summary => '50 pcs Custom Hoodies',
  p_customer_account_id => cust1,
  p_quantity => 50,
  p_actor_id => 'a1111111-1111-4000-8000-000000000001'
) result from test_ctx;

select app.transition_requirement_status(org1, (result->>'requirement_id')::uuid, 'READY', 'a1111111-1111-4000-8000-000000000001')
from test_ctx, test_b2b_req;

create temporary table test_b2b_quote as select app.save_quote_version(
  p_organization_id => org1,
  p_actor_id => 'a1111111-1111-4000-8000-000000000001',
  p_request_id => 'b1111111-1111-4000-8000-000000000001',
  p_requirement_version_id => (result->>'version_id')::uuid,
  p_customer_id => cust1,
  p_unit_price => 150000,
  p_discount => 0,
  p_shipping => 50000,
  p_costs => jsonb_build_array(
    jsonb_build_object('cost_type', 'GARMENT', 'description', 'Fleece Cotton', 'quantity', 50, 'unit_cost', 80000)
  ),
  p_valid_until => current_date + 14,
  p_terms => 'DP 50%',
  p_lead_time => '10 hari',
  p_notes => 'SEC02 Quote Org 1'
) result from test_ctx, test_b2b_req;

select app.mark_quote_sent(org1, 'a1111111-1111-4000-8000-000000000001', (result->>'version_id')::uuid)
from test_ctx, test_b2b_quote;

select app.mark_quote_accepted(
  org1,
  'a1111111-1111-4000-8000-000000000001',
  (result->>'version_id')::uuid,
  'DIRECT',
  null,
  'Customer accepted'
) from test_ctx, test_b2b_quote;

-- Setup Retail Inventory SKU in Org 1
create temporary table test_retail_sku as select app.create_inventory_item(
  p_organization_id => org1,
  p_actor_id => 'a1111111-1111-4000-8000-000000000001',
  p_brand_id => brand1,
  p_sku => 'SEC02-RETAIL-SKU-1',
  p_name => 'SEC02 Retail Cotton Tee L',
  p_category => 'BLANK_GARMENT',
  p_unit => 'pcs',
  p_cost_price => 35000::bigint,
  p_min_stock_alert => 10,
  p_initial_stock => 50,
  p_location_code => 'MAIN_WORKSHOP'
) result from test_ctx;


-- ============================================================================
-- 3. B2B Authorized Creation & Multi-Tenant Isolation (ORG-01, ORG-02)
-- ============================================================================

-- ORG-01: Authorized B2B creation stays within requested authenticated organization
create temporary table b2b_order_1 as select app.create_order_from_quote(
  p_organization_id => org1,
  p_actor_id => 'a1111111-1111-4000-8000-000000000001',
  p_request_id => 'd1111111-1111-4000-8000-000000000001',
  p_quote_version_id => (result->>'version_id')::uuid,
  p_shipping_address => jsonb_build_object(
    'recipient_name', 'Budi Purchasing',
    'phone', '08123456789',
    'street', 'Jl. Industri Garmen No. 12',
    'city', 'Bandung'
  )
) result from test_ctx, test_b2b_quote;

select ok(
  (select (result->>'order_id') from b2b_order_1) is not null,
  'ORG-01: B2B order created in Org 1 with valid order_id'
);

select is(
  (select organization_id from app.orders where id = (select (result->>'order_id')::uuid from b2b_order_1)),
  (select org1 from test_ctx),
  'ORG-01: Stored order belongs strictly to Org 1'
);

select is(
  (select status from app.orders where id = (select (result->>'order_id')::uuid from b2b_order_1)),
  'CONFIRMED',
  'ORG-01: Order status is CONFIRMED'
);

-- ORG-02: Denied B2B role is rejected without order/audit/item side effects
select throws_ok(
  $q$
    select app.create_order_from_quote(
      p_organization_id => (select org1 from test_ctx),
      p_actor_id => 'a1111111-1111-4000-8000-000000000002', -- User B (QC role)
      p_request_id => 'd1111111-1111-4000-8000-000000000002',
      p_quote_version_id => (select (result->>'version_id')::uuid from test_b2b_quote),
      p_shipping_address => '{"recipient_name":"Denied","phone":"08111111","street":"Denied St","city":"Jakarta"}'::jsonb
    )
  $q$,
  'P0001',
  'Not authorized to create orders',
  'ORG-02: Denied role (QC) rejected from creating B2B orders'
);

select is(
  (select count(*)::integer from app.orders where organization_id = (select org1 from test_ctx)),
  1,
  'ORG-02: No duplicate or extra order created on role denial'
);

select is(
  (select count(*)::integer from app.order_audit where actor_id = 'a1111111-1111-4000-8000-000000000002'),
  0,
  'ORG-02: No audit record created on denied role attempt'
);


-- ============================================================================
-- 4. B2B Same-Org Replay vs Foreign-Org Replay Denial (ORG-03, ORG-04)
-- ============================================================================

-- ORG-03: Same actor and organization B2B retry returns original order without duplicates
create temporary table b2b_replay_same as select app.create_order_from_quote(
  p_organization_id => org1,
  p_actor_id => 'a1111111-1111-4000-8000-000000000001',
  p_request_id => 'd1111111-1111-4000-8000-000000000001', -- same request_id
  p_quote_version_id => (result->>'version_id')::uuid,
  p_shipping_address => jsonb_build_object(
    'recipient_name', 'Budi Purchasing',
    'phone', '08123456789',
    'street', 'Jl. Industri Garmen No. 12',
    'city', 'Bandung'
  )
) result from test_ctx, test_b2b_quote;

select is(
  (select (result->>'is_retry')::boolean from b2b_replay_same),
  true,
  'ORG-03: Same actor and org replay returns is_retry = true'
);

select is(
  (select (result->>'order_id') from b2b_replay_same),
  (select (result->>'order_id') from b2b_order_1),
  'ORG-03: Replay returns identical owned order_id'
);

select is(
  (select count(*)::integer from app.orders where organization_id = (select org1 from test_ctx)),
  1,
  'ORG-03: Order table count unchanged on idempotent replay'
);

-- Quote version idempotency replay in same organization
create temporary table b2b_replay_quote as select app.create_order_from_quote(
  p_organization_id => org1,
  p_actor_id => 'a1111111-1111-4000-8000-000000000001',
  p_request_id => gen_random_uuid(), -- new request_id, but already-ordered quote version
  p_quote_version_id => (result->>'version_id')::uuid,
  p_shipping_address => jsonb_build_object(
    'recipient_name', 'Budi Purchasing',
    'phone', '08123456789',
    'street', 'Jl. Industri Garmen No. 12',
    'city', 'Bandung'
  )
) result from test_ctx, test_b2b_quote;

select is(
  (select (result->>'is_retry')::boolean from b2b_replay_quote),
  true,
  'ORG-03: Quote-version replay returns is_retry = true'
);

-- ORG-04: Foreign-organization B2B replay or quote reference fails closed with generic denial
select throws_ok(
  $q$
    select app.create_order_from_quote(
      p_organization_id => (select org2 from test_ctx), -- Org 2!
      p_actor_id => 'a1111111-1111-4000-8000-000000000001', -- User A (Sales in Org 2)
      p_request_id => 'd1111111-1111-4000-8000-000000000001', -- request_id belonging to Org 1 order!
      p_quote_version_id => (select (result->>'version_id')::uuid from test_b2b_quote),
      p_shipping_address => '{"recipient_name":"Attacker","phone":"08111111","street":"Jl. Cross Org 1","city":"Jakarta"}'::jsonb
    )
  $q$,
  'P0001',
  'Unauthorized or request invalid',
  'ORG-04: Cross-organization B2B replay by request_id fails closed with generic non-disclosing error'
);

select throws_ok(
  $q$
    select app.create_order_from_quote(
      p_organization_id => (select org2 from test_ctx), -- Org 2!
      p_actor_id => 'a1111111-1111-4000-8000-000000000001', -- User A (Sales in Org 2)
      p_request_id => gen_random_uuid(), -- fresh request_id
      p_quote_version_id => (select (result->>'version_id')::uuid from test_b2b_quote), -- quote version of Org 1!
      p_shipping_address => '{"recipient_name":"Attacker","phone":"08111111","street":"Jl. Cross Org 2","city":"Jakarta"}'::jsonb
    )
  $q$,
  'P0001',
  'Unauthorized or request invalid',
  'ORG-04: Cross-organization quote version replay fails closed with generic non-disclosing error'
);

select is(
  (select count(*)::integer from app.orders where organization_id = (select org2 from test_ctx)),
  0,
  'ORG-04: Zero orders exist in Org 2 after denied foreign replay attempts'
);


-- ============================================================================
-- 5. Retail Authorized Creation & Multi-Tenant Isolation (ORG-05, ORG-06)
-- ============================================================================

-- ORG-05: Authorized retail creation preserves scoped order/invoice/stock semantics
create temporary table retail_order_1 as select app.create_retail_order(
  p_organization_id => org1,
  p_actor_id => 'a1111111-1111-4000-8000-000000000001',
  p_brand_id => brand1,
  p_customer_account_id => cust1,
  p_items => jsonb_build_array(
    jsonb_build_object(
      'inventory_item_id', (select (result->>'inventory_item_id')::uuid from test_retail_sku),
      'quantity', 4,
      'unit_price', 65000::bigint,
      'discount_total', 0::bigint,
      'notes', 'Pembelian ritel kaos'
    )
  ),
  p_request_id => 'e1111111-1111-4000-8000-000000000001',
  p_shipping_cost => 10000::bigint,
  p_notes => 'Retail test order 1',
  p_auto_pay => false
) result from test_ctx;

select ok(
  (select (result->>'order_id') from retail_order_1) is not null,
  'ORG-05: Retail order created in Org 1 with valid order_id'
);

select is(
  (select order_type from app.orders where id = (select (result->>'order_id')::uuid from retail_order_1)),
  'RETAIL_DIRECT',
  'ORG-05: Order type is RETAIL_DIRECT and belongs to Org 1'
);

select is(
  (select invoice_type from app.invoices where id = (select (result->>'invoice_id')::uuid from retail_order_1)),
  'FULL_PAYMENT',
  'ORG-05: Commercial invoice automatically issued in Org 1'
);

-- ORG-06: Retail denied role or foreign related object is rejected without side effects
select throws_ok(
  $q$
    select app.create_retail_order(
      p_organization_id => (select org1 from test_ctx),
      p_actor_id => 'a1111111-1111-4000-8000-000000000002', -- User B (QC role)
      p_brand_id => (select brand1 from test_ctx),
      p_customer_account_id => (select cust1 from test_ctx),
      p_items => jsonb_build_array(
        jsonb_build_object(
          'inventory_item_id', (select (result->>'inventory_item_id')::uuid from test_retail_sku),
          'quantity', 1,
          'unit_price', 65000::bigint
        )
      ),
      p_request_id => gen_random_uuid()
    )
  $q$,
  'P0001',
  'Unauthorized to create retail orders',
  'ORG-06: Denied role (QC) rejected from creating retail orders'
);

-- Foreign customer account from Org 2 used in Org 1 creation
select throws_ok(
  $q$
    select app.create_retail_order(
      p_organization_id => (select org1 from test_ctx),
      p_actor_id => 'a1111111-1111-4000-8000-000000000001',
      p_brand_id => (select brand1 from test_ctx),
      p_customer_account_id => (select cust2 from test_ctx), -- Customer from Org 2!
      p_items => jsonb_build_array(
        jsonb_build_object(
          'inventory_item_id', (select (result->>'inventory_item_id')::uuid from test_retail_sku),
          'quantity', 1,
          'unit_price', 65000::bigint
        )
      ),
      p_request_id => gen_random_uuid()
    )
  $q$,
  'P0001',
  'Active customer account required',
  'ORG-06: Foreign customer account from Org 2 rejected in Org 1'
);

select is(
  (select count(*)::integer from app.orders where organization_id = (select org1 from test_ctx) and order_type = 'RETAIL_DIRECT'),
  1,
  'ORG-06: Retail order count in Org 1 remains 1 after denied attempts'
);


-- ============================================================================
-- 6. Retail Same-Org Replay vs Foreign Replay Denial (ORG-07)
-- ============================================================================

-- ORG-07: Own-organization retail replay preserves original result
create temporary table retail_replay_same as select app.create_retail_order(
  p_organization_id => org1,
  p_actor_id => 'a1111111-1111-4000-8000-000000000001',
  p_brand_id => brand1,
  p_customer_account_id => cust1,
  p_items => jsonb_build_array(
    jsonb_build_object(
      'inventory_item_id', (select (result->>'inventory_item_id')::uuid from test_retail_sku),
      'quantity', 4,
      'unit_price', 65000::bigint
    )
  ),
  p_request_id => 'e1111111-1111-4000-8000-000000000001', -- same request_id
  p_shipping_cost => 10000::bigint,
  p_auto_pay => false
) result from test_ctx;

select is(
  (select (result->>'is_idempotent')::boolean from retail_replay_same),
  true,
  'ORG-07: Retail replay returns is_idempotent = true'
);

-- ORG-07: Foreign replay denied without identifying response
select throws_ok(
  $q$
    select app.create_retail_order(
      p_organization_id => (select org2 from test_ctx), -- Org 2!
      p_actor_id => 'a1111111-1111-4000-8000-000000000001', -- User A (Sales in Org 2)
      p_brand_id => (select brand2 from test_ctx),
      p_customer_account_id => (select cust2 from test_ctx),
      p_items => '[]'::jsonb,
      p_request_id => 'e1111111-1111-4000-8000-000000000001' -- request_id from Org 1 retail order!
    )
  $q$,
  'P0001',
  'Unauthorized or request invalid',
  'ORG-07: Cross-organization retail replay fails closed with generic non-disclosing error'
);

select is(
  (select count(*)::integer from app.orders where organization_id = (select org2 from test_ctx)),
  0,
  'ORG-07: Zero retail orders exist in Org 2 after denied foreign replay'
);


-- ============================================================================
-- 7. Concurrent / Unique Replay Collision Isolation (ORG-09, ORG-10)
-- ============================================================================

-- ORG-09: Direct collision attempt simulating duplicate insert fails closed with non-disclosing error
select throws_ok(
  $q$
    -- Directly invoke create_order_from_quote with conflicting request_id on another org
    select app.create_order_from_quote(
      p_organization_id => (select org2 from test_ctx),
      p_actor_id => 'a1111111-1111-4000-8000-000000000001',
      p_request_id => 'd1111111-1111-4000-8000-000000000001',
      p_quote_version_id => gen_random_uuid(),
      p_shipping_address => '{"recipient_name":"Colliding","phone":"081234567","street":"Jl. Test","city":"Bandung"}'::jsonb
    )
  $q$,
  'P0001',
  'Unauthorized or request invalid',
  'ORG-09: Colliding request_id on cross-tenant boundary yields non-disclosing denial'
);

-- ORG-10: Error message verification across all denied paths strictly nondisclosing
do $$
declare
  v_err_msg text;
begin
  begin
    perform app.create_order_from_quote(
      p_organization_id => 'a2222222-2222-4000-8000-000000000001'::uuid,
      p_actor_id => 'a1111111-1111-4000-8000-000000000001'::uuid,
      p_request_id => 'd1111111-1111-4000-8000-000000000001'::uuid,
      p_quote_version_id => gen_random_uuid(),
      p_shipping_address => '{"recipient_name":"Test","phone":"081234","street":"Jl. Test","city":"Bandung"}'::jsonb
    );
  exception when others then
    v_err_msg := SQLERRM;
  end;

  if v_err_msg is null or v_err_msg not like '%Unauthorized or request invalid%' then
    raise exception 'ORG-10: Expected generic non-disclosing error, got: %', v_err_msg;
  end if;

  if v_err_msg like '%multigraph%' or v_err_msg like '%TS-O-%' or v_err_msg like '%unique%' then
    raise exception 'ORG-10: Leaked internal tenant or constraint details in error: %', v_err_msg;
  end if;
end;
$$;

select ok(true, 'ORG-10: Tenant nondisclosure verified; error message leaks no foreign organization or constraint data');

-- ============================================================================
-- 8. Genuine INSERT unique_violation Collision Isolation (R4-QA-02)
-- ============================================================================

-- Setup second B2B accepted quote for genuine unique collision test
create temporary table test_b2b_req_2 as select app.create_requirement_with_initial_version(
  p_organization_id => org1,
  p_brand_id => brand1,
  p_title => 'SEC02 Test B2B Collision Requirement',
  p_summary => '25 pcs Custom Polos',
  p_customer_account_id => cust1,
  p_quantity => 25,
  p_actor_id => 'a1111111-1111-4000-8000-000000000001'
) result from test_ctx;

select app.transition_requirement_status(org1, (result->>'requirement_id')::uuid, 'READY', 'a1111111-1111-4000-8000-000000000001')
from test_ctx, test_b2b_req_2;

create temporary table test_b2b_quote_2 as select app.save_quote_version(
  p_organization_id => org1,
  p_actor_id => 'a1111111-1111-4000-8000-000000000001',
  p_request_id => 'b1111111-1111-4000-8000-000000000002',
  p_requirement_version_id => (result->>'version_id')::uuid,
  p_customer_id => cust1,
  p_unit_price => 120000,
  p_discount => 0,
  p_shipping => 25000,
  p_costs => jsonb_build_array(
    jsonb_build_object('cost_type', 'GARMENT', 'description', 'Polo Cotton', 'quantity', 25, 'unit_cost', 60000)
  ),
  p_valid_until => current_date + 14,
  p_terms => 'DP 50%',
  p_lead_time => '7 hari',
  p_notes => 'SEC02 Quote 2 Org 1'
) result from test_ctx, test_b2b_req_2;

select app.mark_quote_sent(org1, 'a1111111-1111-4000-8000-000000000001', (result->>'version_id')::uuid)
from test_ctx, test_b2b_quote_2;

select app.mark_quote_accepted(
  org1,
  'a1111111-1111-4000-8000-000000000001',
  (result->>'version_id')::uuid,
  'DIRECT',
  null,
  'Customer accepted quote 2'
) from test_ctx, test_b2b_quote_2;

-- Pre-insert an order that intentionally occupies order_number 'TS-O-2026-000003'
insert into app.orders (
  id, organization_id, brand_id, customer_account_id,
  order_number, status, currency, subtotal, discount_total,
  shipping_total, grand_total, estimated_cost_total, estimated_gross_profit,
  customer_snapshot, shipping_address_snapshot, payment_terms_snapshot,
  created_by_user_id, request_id, order_type
)
select
  gen_random_uuid(), org1, brand1, cust1,
  'TS-O-2026-000003', 'CONFIRMED', 'IDR', 100000, 0,
  10000, 110000, 50000, 50000,
  '{"name":"Pre-colliding Order"}'::jsonb,
  '{"recipient_name":"Test","phone":"081234","street":"Jl. Test No. 1","city":"Bandung"}'::jsonb,
  '{"terms":"CASH"}'::jsonb,
  'a1111111-1111-4000-8000-000000000001', gen_random_uuid(), 'RETAIL_DIRECT'
from test_ctx;

-- Record baseline counts before collision attempt
create temporary table b2b_collision_pre as select
  (select count(*)::integer from app.orders where organization_id = (select org1 from test_ctx)) as orders_count,
  (select count(*)::integer from app.order_items oi join app.orders o on o.id = oi.order_id where o.organization_id = (select org1 from test_ctx)) as items_count,
  (select count(*)::integer from app.order_audit where organization_id = (select org1 from test_ctx)) as audit_count;

-- ORG-09: Collision source established: pre-inserted order occupies TS-O-2026-000003
select is(
  (select count(*)::integer from app.orders where organization_id = (select org1 from test_ctx) and order_number = 'TS-O-2026-000003'),
  1,
  'ORG-09: Collision source established: Pre-inserted order occupies TS-O-2026-000003'
);

-- ORG-09: Uniqueness constraint provenance: direct insert with duplicate order_number triggers 23505 unique_violation
select throws_ok(
  $q$
    insert into app.orders (
      id, organization_id, brand_id, customer_account_id,
      order_number, status, currency, subtotal, discount_total,
      shipping_total, grand_total, estimated_cost_total, estimated_gross_profit,
      customer_snapshot, shipping_address_snapshot, payment_terms_snapshot,
      created_by_user_id, request_id, order_type
    )
    select
      gen_random_uuid(), org1, brand1, cust1,
      'TS-O-2026-000003', 'CONFIRMED', 'IDR', 100000, 0,
      10000, 110000, 50000, 50000,
      '{}'::jsonb,
      '{"recipient_name":"Test","phone":"081234","street":"Jl. Test No. 1","city":"Bandung"}'::jsonb,
      '{"terms":"CASH"}'::jsonb,
      'a1111111-1111-4000-8000-000000000001', gen_random_uuid(), 'RETAIL_DIRECT'
    from test_ctx;
  $q$,
  '23505',
  null,
  'ORG-09: Collision provenance verified: Duplicate TS-O-2026-000003 directly violates unique constraint (23505)'
);

-- ORG-09: Genuine uniqueness collision on orders_organization_id_order_number_key in create_order_from_quote
select throws_ok(
  $q$
    select app.create_order_from_quote(
      p_organization_id => (select org1 from test_ctx),
      p_actor_id => 'a1111111-1111-4000-8000-000000000001',
      p_request_id => 'f1111111-1111-4000-8000-000000000001',
      p_quote_version_id => (select (result->>'version_id')::uuid from test_b2b_quote_2),
      p_shipping_address => '{"recipient_name":"Colliding B2B","phone":"081234567","street":"Jl. Test","city":"Bandung"}'::jsonb
    )
  $q$,
  'P0001',
  'Unauthorized or request invalid',
  'ORG-09: Genuine B2B unique order_number constraint violation handled fail-closed with generic denial'
);

select is(
  (select count(*)::integer from app.orders where organization_id = (select org1 from test_ctx)),
  (select orders_count from b2b_collision_pre),
  'ORG-09: Genuine B2B unique violation causes zero new orders'
);

select is(
  (select count(*)::integer from app.order_items oi join app.orders o on o.id = oi.order_id where o.organization_id = (select org1 from test_ctx)),
  (select items_count from b2b_collision_pre),
  'ORG-09: Genuine B2B unique violation causes zero new order items'
);

select is(
  (select count(*)::integer from app.order_audit where organization_id = (select org1 from test_ctx)),
  (select audit_count from b2b_collision_pre),
  'ORG-09: Genuine B2B unique violation causes zero new audit entries'
);

-- Causal Provenance for B2B: Remove colliding row and verify identical invocation succeeds
delete from app.orders where organization_id = (select org1 from test_ctx) and order_number = 'TS-O-2026-000003';
update app.document_sequences set last_number = 2
where organization_id = (select org1 from test_ctx)
  and brand_id = (select brand1 from test_ctx)
  and document_type = 'O';

create temporary table b2b_collision_causal_resolved as select app.create_order_from_quote(
  p_organization_id => org1,
  p_actor_id => 'a1111111-1111-4000-8000-000000000001',
  p_request_id => 'f1111111-1111-4000-8000-000000000001',
  p_quote_version_id => (select (result->>'version_id')::uuid from test_b2b_quote_2),
  p_shipping_address => '{"recipient_name":"Causal Proof B2B","phone":"081234567","street":"Jl. Test","city":"Bandung"}'::jsonb
) result from test_ctx;

select ok(
  (select (result->>'order_id') from b2b_collision_causal_resolved) is not null,
  'ORG-09: Causal provenance: create_order_from_quote succeeds immediately once colliding order_number is removed'
);

select is(
  (select (result->>'order_number') from b2b_collision_causal_resolved),
  'TS-O-2026-000003',
  'ORG-09: Causal provenance: Resolved B2B order receives the previously colliding TS-O-2026-000003'
);

-- Pre-insert colliding order for Retail collision test: occupies 'TS-O-2026-000004'
insert into app.orders (
  id, organization_id, brand_id, customer_account_id,
  order_number, status, currency, subtotal, discount_total,
  shipping_total, grand_total, estimated_cost_total, estimated_gross_profit,
  customer_snapshot, shipping_address_snapshot, payment_terms_snapshot,
  created_by_user_id, request_id, order_type
)
select
  gen_random_uuid(), org1, brand1, cust1,
  'TS-O-2026-000004', 'CONFIRMED', 'IDR', 100000, 0,
  10000, 110000, 50000, 50000,
  '{"name":"Pre-colliding Retail Order"}'::jsonb,
  '{"recipient_name":"Test","phone":"081234","street":"Jl. Test No. 2","city":"Bandung"}'::jsonb,
  '{"terms":"CASH"}'::jsonb,
  'a1111111-1111-4000-8000-000000000001', gen_random_uuid(), 'RETAIL_DIRECT'
from test_ctx;

-- Baseline for Retail collision
create temporary table retail_collision_pre as select
  (select count(*)::integer from app.orders where organization_id = (select org1 from test_ctx)) as orders_count,
  (select count(*)::integer from app.order_items oi join app.orders o on o.id = oi.order_id where o.organization_id = (select org1 from test_ctx)) as items_count,
  (select count(*)::integer from app.order_audit where organization_id = (select org1 from test_ctx)) as audit_count,
  (select count(*)::integer from app.invoices where organization_id = (select org1 from test_ctx)) as invoice_count,
  (select count(*)::integer from app.inventory_reservations where organization_id = (select org1 from test_ctx)) as res_count;

-- ORG-09: Retail collision source established
select is(
  (select count(*)::integer from app.orders where organization_id = (select org1 from test_ctx) and order_number = 'TS-O-2026-000004'),
  1,
  'ORG-09: Retail collision source verified: TS-O-2026-000004 remains occupied in Org 1'
);

-- ORG-09: Uniqueness constraint provenance for Retail: direct insert triggers 23505
select throws_ok(
  $q$
    insert into app.orders (
      id, organization_id, brand_id, customer_account_id,
      order_number, status, currency, subtotal, discount_total,
      shipping_total, grand_total, estimated_cost_total, estimated_gross_profit,
      customer_snapshot, shipping_address_snapshot, payment_terms_snapshot,
      created_by_user_id, request_id, order_type
    )
    select
      gen_random_uuid(), org1, brand1, cust1,
      'TS-O-2026-000004', 'CONFIRMED', 'IDR', 100000, 0,
      10000, 110000, 50000, 50000,
      '{}'::jsonb,
      '{"recipient_name":"Test","phone":"081234","street":"Jl. Test No. 2","city":"Bandung"}'::jsonb,
      '{"terms":"CASH"}'::jsonb,
      'a1111111-1111-4000-8000-000000000001', gen_random_uuid(), 'RETAIL_DIRECT'
    from test_ctx;
  $q$,
  '23505',
  null,
  'ORG-09: Retail collision provenance verified: Duplicate TS-O-2026-000004 directly violates unique constraint (23505)'
);

-- ORG-09: Genuine uniqueness collision on orders_organization_id_order_number_key in create_retail_order
select throws_ok(
  $q$
    select app.create_retail_order(
      p_organization_id => (select org1 from test_ctx),
      p_actor_id => 'a1111111-1111-4000-8000-000000000001',
      p_brand_id => (select brand1 from test_ctx),
      p_customer_account_id => (select cust1 from test_ctx),
      p_items => jsonb_build_array(
        jsonb_build_object(
          'inventory_item_id', (select (result->>'inventory_item_id')::uuid from test_retail_sku),
          'quantity', 1,
          'unit_price', 65000::bigint
        )
      ),
      p_request_id => 'f1111111-1111-4000-8000-000000000002',
      p_auto_pay => false
    )
  $q$,
  'P0001',
  'Unauthorized or request invalid',
  'ORG-09: Genuine Retail unique order_number constraint violation handled fail-closed with generic denial'
);

select is(
  (select count(*)::integer from app.orders where organization_id = (select org1 from test_ctx)),
  (select orders_count from retail_collision_pre),
  'ORG-09: Genuine Retail unique violation causes zero new orders'
);

select is(
  (select count(*)::integer from app.order_items oi join app.orders o on o.id = oi.order_id where o.organization_id = (select org1 from test_ctx)),
  (select items_count from retail_collision_pre),
  'ORG-09: Genuine Retail unique violation causes zero new order items'
);

select is(
  (select count(*)::integer from app.order_audit where organization_id = (select org1 from test_ctx)),
  (select audit_count from retail_collision_pre),
  'ORG-09: Genuine Retail unique violation causes zero new audit entries'
);

select is(
  (select count(*)::integer from app.invoices where organization_id = (select org1 from test_ctx)),
  (select invoice_count from retail_collision_pre),
  'ORG-09: Genuine Retail unique violation causes zero new invoices'
);

select is(
  (select count(*)::integer from app.inventory_reservations where organization_id = (select org1 from test_ctx)),
  (select res_count from retail_collision_pre),
  'ORG-09: Genuine Retail unique violation causes zero new inventory reservations'
);

-- Causal Provenance for Retail: Remove colliding row and verify identical invocation succeeds
delete from app.orders where organization_id = (select org1 from test_ctx) and order_number = 'TS-O-2026-000004';
update app.document_sequences set last_number = 3
where organization_id = (select org1 from test_ctx)
  and brand_id = (select brand1 from test_ctx)
  and document_type = 'O';

create temporary table retail_collision_causal_resolved as select app.create_retail_order(
  p_organization_id => org1,
  p_actor_id => 'a1111111-1111-4000-8000-000000000001',
  p_brand_id => brand1,
  p_customer_account_id => cust1,
  p_items => jsonb_build_array(
    jsonb_build_object(
      'inventory_item_id', (select (result->>'inventory_item_id')::uuid from test_retail_sku),
      'quantity', 1,
      'unit_price', 65000::bigint
    )
  ),
  p_request_id => 'f1111111-1111-4000-8000-000000000002',
  p_auto_pay => false
) result from test_ctx;

select ok(
  (select (result->>'order_id') from retail_collision_causal_resolved) is not null,
  'ORG-09: Causal provenance: create_retail_order succeeds immediately once colliding order_number is removed'
);

select is(
  (select (result->>'order_number') from retail_collision_causal_resolved),
  'TS-O-2026-000004',
  'ORG-09: Causal provenance: Resolved Retail order receives the previously colliding TS-O-2026-000004'
);


-- ============================================================================
-- 9. Committed Response Lost & Retry Isolation (R4-QA-03 / ORG-10)
-- ============================================================================

-- ORG-10: Committed response lost scenario for B2B order
create temporary table b2b_retry_lost as select app.create_order_from_quote(
  p_organization_id => org1,
  p_actor_id => 'a1111111-1111-4000-8000-000000000001',
  p_request_id => 'd1111111-1111-4000-8000-000000000001',
  p_quote_version_id => (result->>'version_id')::uuid,
  p_shipping_address => '{"recipient_name":"Budi","phone":"0812","street":"Jl. Bandung","city":"Bandung"}'::jsonb
) result from test_ctx, test_b2b_quote;

select is(
  (select (result->>'order_id') from b2b_retry_lost),
  (select (result->>'order_id') from b2b_order_1),
  'ORG-10: Committed lost-response B2B retry in same org returns original order_id'
);

select is(
  (select (result->>'is_retry')::boolean from b2b_retry_lost),
  true,
  'ORG-10: Committed lost-response B2B retry returns is_retry = true'
);

select throws_ok(
  $q$
    select app.create_order_from_quote(
      p_organization_id => (select org2 from test_ctx),
      p_actor_id => 'a1111111-1111-4000-8000-000000000001',
      p_request_id => 'd1111111-1111-4000-8000-000000000001',
      p_quote_version_id => gen_random_uuid(),
      p_shipping_address => '{"recipient_name":"Attacker","phone":"0812","street":"Jl. Bandung","city":"Bandung"}'::jsonb
    )
  $q$,
  'P0001',
  'Unauthorized or request invalid',
  'ORG-10: Committed lost-response B2B retry in foreign org fails closed with generic denial'
);

-- ORG-10: Committed response lost scenario for Retail order
create temporary table retail_retry_lost as select app.create_retail_order(
  p_organization_id => org1,
  p_actor_id => 'a1111111-1111-4000-8000-000000000001',
  p_brand_id => brand1,
  p_customer_account_id => cust1,
  p_items => jsonb_build_array(
    jsonb_build_object(
      'inventory_item_id', (select (result->>'inventory_item_id')::uuid from test_retail_sku),
      'quantity', 4,
      'unit_price', 65000::bigint
    )
  ),
  p_request_id => 'e1111111-1111-4000-8000-000000000001'
) result from test_ctx;

select is(
  (select (result->>'order_id') from retail_retry_lost),
  (select (result->>'order_id') from retail_order_1),
  'ORG-10: Committed lost-response Retail retry in same org returns original order_id'
);

select is(
  (select (result->>'is_idempotent')::boolean from retail_retry_lost),
  true,
  'ORG-10: Committed lost-response Retail retry returns is_idempotent = true'
);

select throws_ok(
  $q$
    select app.create_retail_order(
      p_organization_id => (select org2 from test_ctx),
      p_actor_id => 'a1111111-1111-4000-8000-000000000001',
      p_brand_id => (select brand2 from test_ctx),
      p_customer_account_id => (select cust2 from test_ctx),
      p_items => '[]'::jsonb,
      p_request_id => 'e1111111-1111-4000-8000-000000000001'
    )
  $q$,
  'P0001',
  'Unauthorized or request invalid',
  'ORG-10: Committed lost-response Retail retry in foreign org fails closed with generic denial'
);


-- ============================================================================
-- 10. Negative Assurance: Foreign Org Zero Side Effects (R4-QA-04)
-- ============================================================================

select is(
  (select count(*)::integer from app.orders where organization_id = (select org2 from test_ctx)),
  0,
  'ORG-10: Zero orders exist in Org 2 across all tests'
);

select is(
  (select count(*)::integer from app.order_items oi join app.orders o on o.id = oi.order_id where o.organization_id = (select org2 from test_ctx)),
  0,
  'ORG-10: Zero order items exist in Org 2 across all tests'
);

select is(
  (select count(*)::integer from app.order_audit where organization_id = (select org2 from test_ctx)),
  0,
  'ORG-10: Zero order audit records exist in Org 2 across all tests'
);

select is(
  (select count(*)::integer from app.invoices where organization_id = (select org2 from test_ctx)),
  0,
  'ORG-10: Zero invoices exist in Org 2 across all tests'
);

select is(
  (select count(*)::integer from app.inventory_reservations where organization_id = (select org2 from test_ctx)),
  0,
  'ORG-10: Zero inventory reservations exist in Org 2 across all tests'
);

select * from finish();
rollback;
