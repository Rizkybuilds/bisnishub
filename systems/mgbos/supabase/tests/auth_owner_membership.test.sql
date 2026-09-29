begin;
select plan(7);

-- 1-2. Verify tables exist
select has_table('app', 'users', 'app.users table exists');
select has_table('app', 'organization_members', 'app.organization_members table exists');

-- 3. Verify founder user exists in app.users
select results_eq(
    'select count(*)::int from app.users where email = ''founder@multigraph.id'' and status = ''ACTIVE''',
    ARRAY[1],
    'Founder user exists in app.users and is ACTIVE'
);

-- 4. Verify founder is linked to auth.users
select is(
    (select auth_user_id from app.users where email = 'founder@multigraph.id'),
    '00000000-0000-0000-0000-000000000099'::uuid,
    'Founder app.users record is linked to auth.users id'
);

-- 5. Verify founder has OWNER membership in MultiGraph Group
select results_eq(
    'select count(*)::int from app.organization_members om
     join app.organizations o on om.organization_id = o.id
     join app.users u on om.user_id = u.id
     join app.roles r on om.role_id = r.id
     where o.code = ''multigraph-group''
       and u.email = ''founder@multigraph.id''
       and r.code = ''OWNER''
       and om.status = ''ACTIVE''',
    ARRAY[1],
    'Founder holds ACTIVE OWNER membership in MultiGraph Group'
);

-- 6. Verify duplicate membership for same user in same org fails
select throws_ok(
    'insert into app.organization_members (organization_id, user_id, role_id) values (
        (select id from app.organizations where code = ''multigraph-group''),
        (select id from app.users where email = ''founder@multigraph.id''),
        (select id from app.roles where code = ''ADMIN'' and organization_id = (select id from app.organizations where code = ''multigraph-group''))
    )',
    '23505',
    NULL,
    'Duplicate organization membership for same user violates unique constraint'
);

-- 7. Verify anon cannot access app.users
select ok(not has_table_privilege('anon', 'app.users', 'SELECT'), 'anon cannot select from app.users');

select * from finish();
rollback;
