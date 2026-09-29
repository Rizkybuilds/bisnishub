begin;
select plan(16);

-- 1-6. Verify tables and functions exist
select has_table('app', 'requirements', 'app.requirements table exists');
select has_table('app', 'requirement_versions', 'app.requirement_versions table exists');
select has_function('app', 'create_requirement_with_initial_version', 'app.create_requirement_with_initial_version exists');
select has_function('app', 'create_new_requirement_version', 'app.create_new_requirement_version exists');
select has_function('app', 'lock_requirement_version', 'app.lock_requirement_version exists');
select has_function('app', 'transition_requirement_status', 'app.transition_requirement_status exists');

-- Provision test roles and users for role authority checks
insert into app.users (id, name, email, status)
values ('123e4567-e89b-12d3-a456-426614174092'::uuid, 'QC Requirement Test User', 'qc.req@multigraph.id', 'ACTIVE');

insert into app.organization_members (organization_id, user_id, role_id, status)
values (
    (select id from app.organizations where code = 'multigraph-group'),
    '123e4567-e89b-12d3-a456-426614174092'::uuid,
    (select id from app.roles where code = 'QC' and organization_id = (select id from app.organizations where code = 'multigraph-group')),
    'ACTIVE'
);

insert into app.users (id, name, email, status)
values ('123e4567-e89b-12d3-a456-426614174093'::uuid, 'Ops Requirement Test User', 'ops.req@multigraph.id', 'ACTIVE');

insert into app.organization_members (organization_id, user_id, role_id, status)
values (
    (select id from app.organizations where code = 'multigraph-group'),
    '123e4567-e89b-12d3-a456-426614174093'::uuid,
    (select id from app.roles where code = 'OPERATIONS' and organization_id = (select id from app.organizations where code = 'multigraph-group')),
    'ACTIVE'
);

-- 7. Test atomic requirement creation with v1 initial version
select is(
    (select (app.create_requirement_with_initial_version(
        (select id from app.organizations where code = 'multigraph-group'),
        (select id from app.brands where code = 'TS'),
        'Kebutuhan Kaos Reuni Akbar 2026',
        'Kaos Cotton Combed 24s Navy dengan Sablon DTF A3',
        100,
        'PCS',
        7500000,
        null,
        '{"garment": {"type": "tshirt", "color": "navy"}}'::jsonb,
        (select id from app.leads limit 1),
        null,
        (select id from app.users where email = 'founder@multigraph.id')
    ))->>'version_number')::integer,
    1,
    'Requirement successfully created with initial version 1'
);

-- 8. Verify auto-generated requirement document number format (TS-REQ-YYYY-XXXXXX)
select matches(
    (select requirement_number from app.requirements where title = 'Kebutuhan Kaos Reuni Akbar 2026'),
    '^TS-REQ-\d{4}-\d{6}$',
    'Requirement number matches canonical format TS-REQ-YYYY-XXXXXX'
);

-- 9. Test adding a new version (v2) creates version 2 and updates current_version_id
select is(
    (select (app.create_new_requirement_version(
        (select id from app.organizations where code = 'multigraph-group'),
        (select id from app.requirements where title = 'Kebutuhan Kaos Reuni Akbar 2026'),
        'Revisi kuantiti menjadi 150 pcs dan tambah packaging custom box',
        150,
        'PCS',
        10500000,
        null,
        '{"garment": {"type": "tshirt", "color": "navy"}, "packaging": {"custom_box": true}}'::jsonb,
        '123e4567-e89b-12d3-a456-426614174093'::uuid -- OPERATIONS actor is permitted
    ))->>'version_number')::integer,
    2,
    'New requirement version 2 successfully created by OPERATIONS actor'
);

-- 10. Verify v1 is preserved untouched
select is(
    (select quantity from app.requirement_versions 
     where requirement_id = (select id from app.requirements where title = 'Kebutuhan Kaos Reuni Akbar 2026')
       and version_number = 1),
    100,
    'Version 1 remains preserved with original quantity 100'
);

-- 11. Test locking requirement version
select is(
    (select (app.lock_requirement_version(
        (select id from app.organizations where code = 'multigraph-group'),
        (select id from app.requirement_versions 
         where requirement_id = (select id from app.requirements where title = 'Kebutuhan Kaos Reuni Akbar 2026')
           and version_number = 1),
        'Quotation TS-Q-2026-000001 diterbitkan menggunakan versi 1',
        (select id from app.users where email = 'founder@multigraph.id')
    ))->>'is_locked')::boolean,
    true,
    'Requirement version 1 successfully locked'
);

-- 12. Test immutability: updating a locked version throws exception
select throws_ok(
    'update app.requirement_versions 
     set summary = ''Perubahan ilegal pada versi yang sudah dikunci''
     where requirement_id = (select id from app.requirements where title = ''Kebutuhan Kaos Reuni Akbar 2026'')
       and version_number = 1',
    NULL,
    'Cannot modify locked requirement version (immutable commercial snapshot)',
    'Immutability trigger blocks updates to locked requirement version'
);

-- 13. Test state machine: transition requirement from DRAFT to READY, then reject illegal transition to DRAFT
select is(
    (select status from app.transition_requirement_status(
        (select id from app.organizations where code = 'multigraph-group'),
        (select id from app.requirements where title = 'Kebutuhan Kaos Reuni Akbar 2026'),
        'READY',
        (select id from app.users where email = 'founder@multigraph.id')
    )),
    'READY'::text,
    'Requirement transitions from DRAFT to READY'
);

select throws_ok(
    'select app.transition_requirement_status(
        (select id from app.organizations where code = ''multigraph-group''),
        (select id from app.requirements where title = ''Kebutuhan Kaos Reuni Akbar 2026''),
        ''DRAFT'',
        (select id from app.users where email = ''founder@multigraph.id'')
    )',
    NULL,
    'Invalid transition from READY to DRAFT',
    'Cannot transition backwards from READY to DRAFT'
);

-- 14. Test role authority guard: QC cannot create requirements
select throws_ok(
    'select app.create_requirement_with_initial_version(
        (select id from app.organizations where code = ''multigraph-group''),
        (select id from app.brands where code = ''TS''),
        ''Unauthorized QC Requirement'',
        ''Summary'',
        50,
        ''PCS'',
        null,
        null,
        ''{}''::jsonb,
        null,
        null,
        ''123e4567-e89b-12d3-a456-426614174092''::uuid
    )',
    NULL,
    'Unauthorized: role QC cannot create requirements',
    'QC role is forbidden from creating requirements'
);

-- 15. Test role authority guard: QC cannot lock requirement versions
select throws_ok(
    'select app.lock_requirement_version(
        (select id from app.organizations where code = ''multigraph-group''),
        (select id from app.requirement_versions 
         where requirement_id = (select id from app.requirements where title = ''Kebutuhan Kaos Reuni Akbar 2026'')
           and version_number = 2),
        ''Ilegal lock attempt by QC'',
        ''123e4567-e89b-12d3-a456-426614174092''::uuid
    )',
    NULL,
    'Unauthorized: role QC cannot lock requirement versions',
    'QC role is forbidden from locking requirement versions'
);

select * from finish();
rollback;
