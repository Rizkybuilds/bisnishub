begin;
select plan(10);

-- Clear test transaction state for isolated counter testing
truncate table app.document_sequences;

-- 1. Verify table exists
select has_table('app', 'document_sequences', 'app.document_sequences table exists');

-- 2. Verify functions exist
select has_function('app', 'next_document_sequence', ARRAY['uuid', 'uuid', 'text', 'integer'], 'app.next_document_sequence exists');
select has_function('app', 'generate_document_number', ARRAY['uuid', 'uuid', 'text', 'integer', 'integer'], 'app.generate_document_number exists');

-- 3. Test next_document_sequence increments monotonically (starts at 1)
select is(
    (select app.next_document_sequence(
        (select id from app.organizations where code = 'multigraph-group'),
        (select id from app.brands where code = 'TS'),
        'L',
        2026
    )),
    1::bigint,
    'First sequence generation for TS-L-2026 returns 1'
);

-- 4. Test next_document_sequence increments to 2
select is(
    (select app.next_document_sequence(
        (select id from app.organizations where code = 'multigraph-group'),
        (select id from app.brands where code = 'TS'),
        'L',
        2026
    )),
    2::bigint,
    'Second sequence generation for TS-L-2026 returns 2'
);

-- 5. Test brand isolation (MG starts at 1)
select is(
    (select app.next_document_sequence(
        (select id from app.organizations where code = 'multigraph-group'),
        (select id from app.brands where code = 'MG'),
        'L',
        2026
    )),
    1::bigint,
    'Brand isolation: MG-L-2026 starts at 1 independently of TS'
);

-- 6. Test document type isolation (TS-Q-2026 starts at 1)
select is(
    (select app.next_document_sequence(
        (select id from app.organizations where code = 'multigraph-group'),
        (select id from app.brands where code = 'TS'),
        'Q',
        2026
    )),
    1::bigint,
    'DocType isolation: TS-Q-2026 starts at 1 independently of TS-L'
);

-- 7. Test year isolation (TS-L-2027 starts at 1)
select is(
    (select app.next_document_sequence(
        (select id from app.organizations where code = 'multigraph-group'),
        (select id from app.brands where code = 'TS'),
        'L',
        2027
    )),
    1::bigint,
    'Year isolation: TS-L-2027 starts at 1 independently of 2026'
);

-- 8. Test formatted number generator
select is(
    (select app.generate_document_number(
        (select id from app.organizations where code = 'multigraph-group'),
        (select id from app.brands where code = 'TS'),
        'L',
        2026,
        6
    )),
    'TS-L-2026-000003'::text,
    'generate_document_number returns TS-L-2026-000003 for next sequence'
);

-- 9. Verify invalid brand raises error
select throws_ok(
    'select app.generate_document_number(
        (select id from app.organizations where code = ''multigraph-group''),
        ''00000000-0000-0000-0000-000000000001''::uuid,
        ''L'',
        2026,
        6
    )',
    NULL,
    NULL,
    'Generating document number for nonexistent brand raises exception'
);

select * from finish();
rollback;
