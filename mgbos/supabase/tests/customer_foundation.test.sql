begin;
select plan(12);

-- 1-5. Verify all 5 customer foundation tables exist
select has_table('app', 'customer_accounts', 'app.customer_accounts table exists');
select has_table('app', 'customer_contacts', 'app.customer_contacts table exists');
select has_table('app', 'customer_brand_relationships', 'app.customer_brand_relationships table exists');
select has_table('app', 'addresses', 'app.addresses table exists');
select has_table('app', 'customer_addresses', 'app.customer_addresses table exists');

-- 6. Verify seeded company customer PT ABC exists
select results_eq(
    'select account_type, display_name, legal_name, status from app.customer_accounts where display_name = ''PT ABC''',
    $$ select 'COMPANY'::text, 'PT ABC'::text, 'PT ABC Kreatif Nusantara'::text, 'ACTIVE'::text $$,
    'Seeded company customer PT ABC exists with COMPANY account type'
);

-- 7. Verify PT ABC has 2 contacts (Budi - Purchasing, Sari - Finance)
select results_eq(
    'select count(*)::int from app.customer_contacts cc
     join app.customer_accounts ca on cc.customer_account_id = ca.id
     where ca.display_name = ''PT ABC''',
    ARRAY[2],
    'PT ABC has exactly 2 contacts'
);

-- 8. Verify primary contact for PT ABC is Budi Santoso
select results_eq(
    'select cc.name, cc.position, cc.is_primary from app.customer_contacts cc
     join app.customer_accounts ca on cc.customer_account_id = ca.id
     where ca.display_name = ''PT ABC'' and cc.is_primary = true',
    $$ select 'Budi Santoso'::text, 'Purchasing Manager'::text, true $$,
    'Budi Santoso is the primary contact for PT ABC'
);

-- 9. Verify PT ABC has multi-brand relationships (TS + MG)
select results_eq(
    'select count(*)::int from app.customer_brand_relationships cbr
     join app.customer_accounts ca on cbr.customer_account_id = ca.id
     where ca.display_name = ''PT ABC''',
    ARRAY[2],
    'PT ABC is linked to 2 holding brands (TS and MG)'
);

-- 10. Verify seeded person customer Rendra Pratama exists
select results_eq(
    'select account_type, display_name, status from app.customer_accounts where display_name = ''Rendra Pratama''',
    $$ select 'PERSON'::text, 'Rendra Pratama'::text, 'ACTIVE'::text $$,
    'Seeded person customer Rendra Pratama exists with PERSON account type'
);

-- 11. Verify invalid account_type violates check constraint
select throws_ok(
    'insert into app.customer_accounts (
        organization_id, account_type, display_name
    ) values (
        (select id from app.organizations where code = ''multigraph-group''),
        ''INVALID_TYPE'',
        ''Bad Account''
    )',
    '23514',
    NULL,
    'Invalid account_type violates check constraint'
);

-- 12. Verify duplicate customer-brand relationship violates unique constraint
select throws_ok(
    'insert into app.customer_brand_relationships (
        customer_account_id, brand_id
    ) values (
        (select id from app.customer_accounts where display_name = ''PT ABC''),
        (select id from app.brands where code = ''TS'')
    )',
    '23505',
    NULL,
    'Duplicate customer-brand relationship violates unique constraint'
);

select * from finish();
rollback;
