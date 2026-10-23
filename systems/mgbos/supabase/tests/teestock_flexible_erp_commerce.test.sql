begin;
select plan(10);

-- 1. Setup Test Context
create temporary table test_ctx as select
  (select id from app.organizations where code = 'multigraph-group') as org,
  (select id from app.brands where code = 'TS') as brand,
  (select id from app.users where email = 'founder@multigraph.id') as owner_actor;

-- 2. Test calculate_unit_hpp
select is(
  app.calculate_unit_hpp(32000::bigint, 12500::bigint, 3000::bigint, 1500::bigint),
  49000::bigint,
  'calculate_unit_hpp returns correct sum of blank, dtf, packaging, and overhead'
);

-- 3. Insert Pricing Rule for product 'slow-sunday'
insert into app.pricing_rules (
  organization_id,
  product_id,
  base_price,
  compare_at_price,
  currency,
  is_active
) values (
  (select org from test_ctx),
  'slow-sunday',
  99000,
  129000,
  'IDR',
  true
);

select is(
  (select count(*) from app.pricing_rules where product_id = 'slow-sunday' and organization_id = (select org from test_ctx)),
  1::bigint,
  'Dynamic pricing rule inserted successfully for slow-sunday'
);

-- 4. Test get_effective_pricing without promo code
create temporary table price_no_promo as select
  app.get_effective_pricing(
    (select org from test_ctx),
    'slow-sunday',
    null,
    2
  ) as result;

select is(
  (select (result->>'base_unit_price')::bigint from price_no_promo),
  99000::bigint,
  'get_effective_pricing reads base_unit_price dynamically'
);

select is(
  (select (result->>'final_total')::bigint from price_no_promo),
  198000::bigint,
  'get_effective_pricing calculates subtotal correctly for 2 items'
);

-- 5. Insert Promotion: 10% OFF Voucher 'LAUNCH10'
insert into app.promotions (
  organization_id,
  code,
  discount_type,
  discount_value,
  min_order_amount,
  min_quantity,
  is_active
) values (
  (select org from test_ctx),
  'LAUNCH10',
  'PERCENTAGE',
  10,
  0,
  1,
  true
);

-- 6. Test get_effective_pricing with valid 10% promo
create temporary table price_with_promo as select
  app.get_effective_pricing(
    (select org from test_ctx),
    'slow-sunday',
    'LAUNCH10',
    1
  ) as result;

select is(
  (select (result->>'promo_applied')::boolean from price_with_promo),
  true,
  'get_effective_pricing applies valid active promo code'
);

select is(
  (select (result->>'discount_total')::bigint from price_with_promo),
  9900::bigint,
  '10% discount correctly computed on Rp 99.000 (Rp 9.900)'
);

select is(
  (select (result->>'final_total')::bigint from price_with_promo),
  89100::bigint,
  'Final total after 10% discount is Rp 89.100'
);

-- 7. Test Negative: Invalid/Expired promo code
create temporary table price_invalid_promo as select
  app.get_effective_pricing(
    (select org from test_ctx),
    'slow-sunday',
    'EXPIRED999',
    1
  ) as result;

select is(
  (select (result->>'promo_applied')::boolean from price_invalid_promo),
  false,
  'Invalid promo code is rejected gracefully without applying discount'
);

-- 8. Test Product BOM Insertion
insert into app.product_bom (
  organization_id,
  product_id,
  blank_unit_cost,
  print_area_category,
  dtf_print_cost,
  packaging_cost,
  overhead_allocation
) values (
  (select org from test_ctx),
  'slow-sunday',
  35000,
  'A3',
  12500,
  3000,
  1500
);

select is(
  (select count(*) from app.product_bom where product_id = 'slow-sunday'),
  1::bigint,
  'Product BOM configured for slow-sunday'
);

select * from finish();
rollback;
