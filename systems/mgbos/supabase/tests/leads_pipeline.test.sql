begin;
select plan(12);

-- 1. Verify app.leads table exists
select has_table('app', 'leads', 'app.leads table exists');

-- 2. Verify seeded leads count
select results_eq(
    'select count(*)::int from app.leads',
    ARRAY[3],
    'Seeded leads total exactly 3 records'
);

-- 3. Verify Lead 1 has auto-generated canonical document number format
select ok(
    (select lead_number ~ '^TS-L-\d{4}-\d{6}$' from app.leads where title = 'Kaos Komunitas Motor 75 Pcs'),
    'Lead 1 has canonical format {BRAND}-L-{YEAR}-{SEQUENCE}'
);

-- 4. Verify Lead 1 is NEW and has WhatsApp channel
select results_eq(
    'select l.status, c.code from app.leads l
     join app.channels c on l.channel_id = c.id
     where l.title = ''Kaos Komunitas Motor 75 Pcs''',
    $$ select 'NEW'::text, 'WHATSAPP'::text $$,
    'Lead 1 has status NEW and originated from WHATSAPP channel'
);

-- 5. Verify Lead 2 is QUALIFIED and linked to PT ABC customer account
select results_eq(
    'select l.status, l.qualification_result, l.qualification_score, ca.display_name from app.leads l
     join app.customer_accounts ca on l.customer_account_id = ca.id
     where l.title = ''Polo Shirt Seragam PT ABC 120 Pcs''',
    $$ select 'QUALIFIED'::text, 'QUALIFIED'::text, 90::integer, 'PT ABC'::text $$,
    'Lead 2 is QUALIFIED with score 90 and linked to PT ABC'
);

-- 6. Verify Lead 3 is DISQUALIFIED with reason SPAM
select results_eq(
    'select status, qualification_result, disqualification_reason from app.leads
     where title = ''Tawaran Kerjasama Promosi''',
    $$ select 'DISQUALIFIED'::text, 'DISQUALIFIED'::text, 'SPAM'::text $$,
    'Lead 3 is DISQUALIFIED with SPAM reason'
);

-- 7. Verify automatic trigger assigns lead_number on insert
insert into app.leads (
    organization_id,
    brand_id,
    channel_id,
    title
) values (
    (select id from app.organizations where code = 'multigraph-group'),
    (select id from app.brands where code = 'TS'),
    (select id from app.channels where code = 'WHATSAPP'),
    'Test Trigger Lead'
);

select ok(
    (select lead_number ~ '^TS-L-\d{4}-\d{6}$' from app.leads where title = 'Test Trigger Lead'),
    'Trigger automatically generates lead_number for new leads'
);

-- 8. Verify invalid status violates check constraint
select throws_ok(
    'insert into app.leads (
        organization_id, brand_id, channel_id, title, status
    ) values (
        (select id from app.organizations where code = ''multigraph-group''),
        (select id from app.brands where code = ''TS''),
        (select id from app.channels where code = ''WHATSAPP''),
        ''Bad Lead'',
        ''INVALID_STATUS''
    )',
    '23514',
    NULL,
    'Invalid lead status violates check constraint'
);

-- 9. Verify invalid disqualification_reason violates check constraint
select throws_ok(
    'insert into app.leads (
        organization_id, brand_id, channel_id, title, status, disqualification_reason
    ) values (
        (select id from app.organizations where code = ''multigraph-group''),
        (select id from app.brands where code = ''TS''),
        (select id from app.channels where code = ''WHATSAPP''),
        ''Bad Reason'',
        ''DISQUALIFIED'',
        ''NOT_A_REASON''
    )',
    '23514',
    NULL,
    'Invalid disqualification reason violates check constraint'
);

-- 10. Verify negative estimated_quantity violates check constraint
select throws_ok(
    'insert into app.leads (
        organization_id, brand_id, channel_id, title, estimated_quantity
    ) values (
        (select id from app.organizations where code = ''multigraph-group''),
        (select id from app.brands where code = ''TS''),
        (select id from app.channels where code = ''WHATSAPP''),
        ''Negative Quantity'',
        -5
    )',
    '23514',
    NULL,
    'Negative estimated quantity violates check constraint'
);

-- 11. Verify lead querying isolated by brand
select results_eq(
    'select count(*)::int from app.leads l
     join app.brands b on l.brand_id = b.id
     where b.code = ''MG''',
    ARRAY[1],
    'MultiGraph brand has exactly 1 lead'
);

-- 12. Verify duplicate lead_number violates unique constraint
select throws_ok(
    'insert into app.leads (
        organization_id, brand_id, channel_id, title, lead_number
    ) values (
        (select id from app.organizations where code = ''multigraph-group''),
        (select id from app.brands where code = ''TS''),
        (select id from app.channels where code = ''WHATSAPP''),
        ''Duplicate Number'',
        (select lead_number from app.leads where title = ''Kaos Komunitas Motor 75 Pcs'')
    )',
    '23505',
    NULL,
    'Duplicate lead_number violates uq_leads_org_lead_number'
);

select * from finish();
rollback;
