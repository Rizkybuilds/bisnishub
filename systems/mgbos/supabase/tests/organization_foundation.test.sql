begin;
select plan(11);

-- 1-5. Verify tables exist in app schema
select has_table('app', 'organizations', 'app.organizations table exists');
select has_table('app', 'brands', 'app.brands table exists');
select has_table('app', 'business_lines', 'app.business_lines table exists');
select has_table('app', 'channels', 'app.channels table exists');
select has_table('app', 'roles', 'app.roles table exists');

-- 6. Verify MultiGraph Group organization
select results_eq(
    'select count(*)::int from app.organizations where code = ''multigraph-group'' and status = ''ACTIVE''',
    ARRAY[1],
    'MultiGraph Group holding organization exists and is ACTIVE'
);

-- 7. Verify exactly 5 holding brands are seeded
select results_eq(
    'select count(*)::int from app.brands where status = ''ACTIVE''',
    ARRAY[5],
    'Exactly 5 holding brands are seeded and ACTIVE'
);

-- 8. Verify Custom Atelier business line for TeeStock
select results_eq(
    'select count(*)::int from app.business_lines bl join app.brands b on bl.brand_id = b.id where b.code = ''TS'' and bl.code = ''CUSTOM_ATELIER''',
    ARRAY[1],
    'TeeStock Custom Atelier business line is seeded'
);

-- 9. Verify 5 global channels
select results_eq(
    'select count(*)::int from app.channels where status = ''ACTIVE''',
    ARRAY[5],
    'Exactly 5 group-wide channels are seeded'
);

-- 10. Verify 6 authority roles
select results_eq(
    'select count(*)::int from app.roles where code in (''OWNER'', ''ADMIN'', ''SALES'', ''OPERATIONS'', ''FINANCE'', ''QC'')',
    ARRAY[6],
    'Exactly 6 core authority roles are seeded'
);

-- 11. Verify duplicate brand code constraint on same organization fails
select throws_ok(
    'insert into app.brands (organization_id, code, name, slug) values ((select id from app.organizations where code = ''multigraph-group''), ''TS'', ''Duplicate TeeStock'', ''dup-ts'')',
    '23505',
    NULL,
    'Duplicate brand code within same organization violates unique constraint'
);

select * from finish();
rollback;
