begin;
select plan(18);

-- 1-3. Verify functions exist
select has_function('app', 'transition_lead_status', 'app.transition_lead_status exists');
select has_function('app', 'convert_lead_to_customer', 'app.convert_lead_to_customer exists');
select has_function('app', 'create_customer_with_contact', 'app.create_customer_with_contact exists');

-- Provision test roles and users for role-based authority testing (Issue 3)
insert into app.users (id, name, email, status)
values ('123e4567-e89b-12d3-a456-426614174090'::uuid, 'QC Inspector Test', 'qc.test@multigraph.id', 'ACTIVE');

insert into app.organization_members (organization_id, user_id, role_id, status)
values (
    (select id from app.organizations where code = 'multigraph-group'),
    '123e4567-e89b-12d3-a456-426614174090'::uuid,
    (select id from app.roles where code = 'QC' and organization_id = (select id from app.organizations where code = 'multigraph-group')),
    'ACTIVE'
);

insert into app.users (id, name, email, status)
values ('123e4567-e89b-12d3-a456-426614174091'::uuid, 'Finance Specialist Test', 'finance.test@multigraph.id', 'ACTIVE');

insert into app.organization_members (organization_id, user_id, role_id, status)
values (
    (select id from app.organizations where code = 'multigraph-group'),
    '123e4567-e89b-12d3-a456-426614174091'::uuid,
    (select id from app.roles where code = 'FINANCE' and organization_id = (select id from app.organizations where code = 'multigraph-group')),
    'ACTIVE'
);

-- 4. Test transition: Lead 1 (NEW -> QUALIFYING)
select is(
    (select status from app.transition_lead_status(
        (select id from app.organizations where code = 'multigraph-group'),
        (select id from app.leads where title = 'Kaos Komunitas Motor 75 Pcs'),
        'QUALIFYING'
    )),
    'QUALIFYING'::text,
    'Lead 1 successfully transitions from NEW to QUALIFYING'
);

-- 5. Test transition: Lead 1 (QUALIFYING -> QUALIFIED)
select is(
    (select status from app.transition_lead_status(
        (select id from app.organizations where code = 'multigraph-group'),
        (select id from app.leads where title = 'Kaos Komunitas Motor 75 Pcs'),
        'QUALIFIED',
        'QUALIFIED',
        85,
        'Kualifikasi diverifikasi dalam tes'
    )),
    'QUALIFIED'::text,
    'Lead 1 successfully transitions from QUALIFYING to QUALIFIED'
);

-- 6. Test idempotency: transitioning to QUALIFIED again returns existing record
select is(
    (select status from app.transition_lead_status(
        (select id from app.organizations where code = 'multigraph-group'),
        (select id from app.leads where title = 'Kaos Komunitas Motor 75 Pcs'),
        'QUALIFIED'
    )),
    'QUALIFIED'::text,
    'Transitioning to same status is idempotent'
);

-- 7. Test guard: illegal transition from QUALIFIED to NEW throws exception
select throws_ok(
    'select app.transition_lead_status(
        (select id from app.organizations where code = ''multigraph-group''),
        (select id from app.leads where title = ''Kaos Komunitas Motor 75 Pcs''),
        ''NEW''
    )',
    NULL,
    'Invalid transition from QUALIFIED to NEW; use convert_lead_to_customer to convert',
    'Cannot transition backwards from QUALIFIED to NEW'
);

-- 8. Test completeness guard: cannot qualify lead without contact method
insert into app.leads (
    organization_id, brand_id, channel_id, title, raw_inquiry
) values (
    (select id from app.organizations where code = 'multigraph-group'),
    (select id from app.brands where code = 'TS'),
    (select id from app.channels where code = 'WHATSAPP'),
    'Incomplete Anonymous Lead',
    'Inquiry tanpa no hp dan tanpa email'
);

select throws_ok(
    'select app.transition_lead_status(
        (select id from app.organizations where code = ''multigraph-group''),
        (select id from app.leads where title = ''Incomplete Anonymous Lead''),
        ''QUALIFIED''
    )',
    NULL,
    'Cannot qualify lead: valid contact method (phone or email) is required',
    'Cannot qualify lead without phone or email'
);

-- 9. [P1 Issue 2 Guard] Direct transition to CONVERTED via transition_lead_status throws exception
select throws_ok(
    'select app.transition_lead_status(
        (select id from app.organizations where code = ''multigraph-group''),
        (select id from app.leads where title = ''Kaos Komunitas Motor 75 Pcs''),
        ''CONVERTED''
    )',
    NULL,
    'Cannot transition lead directly to CONVERTED; conversion must be performed through app.convert_lead_to_customer',
    'transition_lead_status prohibits direct CONVERTED status transition'
);

-- 10. [P1 Issue 1 Guard] Cannot convert a NEW lead to customer
insert into app.leads (
    organization_id, brand_id, channel_id, title, raw_inquiry, contact_name, phone, status
) values (
    (select id from app.organizations where code = 'multigraph-group'),
    (select id from app.brands where code = 'TS'),
    (select id from app.channels where code = 'WHATSAPP'),
    'New Raw Inbound Lead',
    'Tanya harga polo bordir',
    'Pak Joko',
    '081234567890',
    'NEW'
);

select throws_ok(
    'select app.convert_lead_to_customer(
        (select id from app.organizations where code = ''multigraph-group''),
        (select id from app.leads where title = ''New Raw Inbound Lead''),
        true,
        null
    )',
    NULL,
    'Cannot convert lead: lead status must be QUALIFIED (current status is NEW)',
    'convert_lead_to_customer rejects NEW leads without qualification'
);

-- 11. [P1 Issue 1 Guard] Cannot convert a QUALIFYING lead to customer
update app.leads
set status = 'QUALIFYING'
where title = 'New Raw Inbound Lead';

select throws_ok(
    'select app.convert_lead_to_customer(
        (select id from app.organizations where code = ''multigraph-group''),
        (select id from app.leads where title = ''New Raw Inbound Lead''),
        true,
        null
    )',
    NULL,
    'Cannot convert lead: lead status must be QUALIFIED (current status is QUALIFYING)',
    'convert_lead_to_customer rejects QUALIFYING leads without qualification'
);

-- 12. [P2 Issue 3 Role Guard] QC role cannot transition lead status
select throws_ok(
    'select app.transition_lead_status(
        (select id from app.organizations where code = ''multigraph-group''),
        (select id from app.leads where title = ''New Raw Inbound Lead''),
        ''LOST'',
        null,
        null,
        null,
        null,
        ''Budget tidak cocok'',
        null,
        ''123e4567-e89b-12d3-a456-426614174090''::uuid
    )',
    NULL,
    'Unauthorized: role QC cannot transition lead status',
    'QC role is forbidden from transitioning lead status'
);

-- 13. [P2 Issue 3 Role Guard] QC role cannot convert leads
select throws_ok(
    'select app.convert_lead_to_customer(
        (select id from app.organizations where code = ''multigraph-group''),
        (select id from app.leads where title = ''Kaos Komunitas Motor 75 Pcs''),
        true,
        null,
        ''123e4567-e89b-12d3-a456-426614174090''::uuid
    )',
    NULL,
    'Unauthorized: role QC cannot convert leads',
    'QC role is forbidden from converting leads to customers'
);

-- 14. [P2 Issue 3 Role Guard] FINANCE role cannot create customer accounts
select throws_ok(
    'select app.create_customer_with_contact(
        (select id from app.organizations where code = ''multigraph-group''),
        (select id from app.brands where code = ''TS''),
        ''PERSON'',
        ''Finance Unauthorized Customer'',
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        ''STANDARD'',
        ''123e4567-e89b-12d3-a456-426614174091''::uuid
    )',
    NULL,
    'Unauthorized: role FINANCE cannot create customer accounts',
    'FINANCE role is forbidden from creating customer accounts'
);

-- 15. Test atomic lead conversion succeeds on QUALIFIED lead with authorized OWNER actor
select is(
    (select (app.convert_lead_to_customer(
        (select id from app.organizations where code = 'multigraph-group'),
        (select id from app.leads where title = 'Kaos Komunitas Motor 75 Pcs'),
        true,
        null,
        (select id from app.users where email = 'founder@multigraph.id')
    ))->>'success')::boolean,
    true,
    'Atomic lead conversion succeeds for QUALIFIED lead with authorized OWNER actor'
);

-- 16. Test conversion idempotency: calling convert on already converted lead does not duplicate
select is(
    (select (app.convert_lead_to_customer(
        (select id from app.organizations where code = 'multigraph-group'),
        (select id from app.leads where title = 'Kaos Komunitas Motor 75 Pcs'),
        true,
        null,
        (select id from app.users where email = 'founder@multigraph.id')
    ))->>'already_converted')::boolean,
    true,
    'Converting an already converted lead is idempotent and returns existing account'
);

-- 17. Test terminal state: CONVERTED lead cannot transition to other statuses
select throws_ok(
    'select app.transition_lead_status(
        (select id from app.organizations where code = ''multigraph-group''),
        (select id from app.leads where title = ''Kaos Komunitas Motor 75 Pcs''),
        ''QUALIFYING''
    )',
    NULL,
    'Cannot transition lead: lead is already CONVERTED (terminal state)',
    'Cannot transition a CONVERTED lead'
);

-- 18. [P1 Issue 1 Guard] Cannot convert a QUALIFIED lead with missing contact method
insert into app.leads (
    organization_id, brand_id, channel_id, title, raw_inquiry, contact_name, phone, email, status
) values (
    (select id from app.organizations where code = 'multigraph-group'),
    (select id from app.brands where code = 'TS'),
    (select id from app.channels where code = 'WHATSAPP'),
    'Contactless Qualified Lead',
    'Order 500 pcs',
    'Tanpa Kontak',
    null,
    null,
    'QUALIFIED'
);

select throws_ok(
    'select app.convert_lead_to_customer(
        (select id from app.organizations where code = ''multigraph-group''),
        (select id from app.leads where title = ''Contactless Qualified Lead''),
        true,
        null
    )',
    NULL,
    'Cannot convert lead: valid contact method (phone or email) is required',
    'convert_lead_to_customer rejects QUALIFIED lead lacking contact method'
);

select * from finish();
rollback;
