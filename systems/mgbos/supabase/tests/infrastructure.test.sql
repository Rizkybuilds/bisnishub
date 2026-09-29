begin;
select plan(4);
select has_schema('app');
select has_schema('internal');
select ok(not has_schema_privilege('anon', 'internal', 'USAGE'), 'anon cannot access internal');
select ok(not has_schema_privilege('authenticated', 'internal', 'USAGE'), 'authenticated cannot access internal');
select * from finish();
rollback;
