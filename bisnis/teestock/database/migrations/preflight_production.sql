-- Read-only production inspection. This does not back up the database or deploy changes.
BEGIN TRANSACTION READ ONLY;

SELECT current_database() AS database_name, current_setting('server_version') AS postgres_version;

SELECT name AS required_table, to_regclass('public.' || name) IS NOT NULL AS present
FROM unnest(ARRAY['ts_user_profiles','ts_orders','ts_order_items','ts_products',
 'ts_inventory','ts_settings','ts_cash_ledger','ts_procurements','ts_vouchers']) AS name;

SELECT table_name,column_name,data_type,is_nullable,column_default
FROM information_schema.columns
WHERE table_schema='public' AND table_name IN ('ts_orders','ts_order_items','ts_inventory',
 'ts_cash_ledger','ts_procurements','ts_user_profiles','ts_vouchers')
ORDER BY table_name,ordinal_position;

SELECT tablename,policyname,roles,cmd,qual,with_check
FROM pg_policies WHERE schemaname='public' AND tablename LIKE 'ts_%'
ORDER BY tablename,policyname;

SELECT event_object_table,trigger_name,action_timing,event_manipulation,action_statement
FROM information_schema.triggers
WHERE event_object_schema='public' AND event_object_table IN ('ts_orders','ts_inventory','ts_procurements','ts_user_profiles')
ORDER BY event_object_table,trigger_name;

SELECT count(*) FILTER (WHERE role='admin') AS admin_profile_count FROM public.ts_user_profiles;
SELECT status,count(*) AS orders FROM public.ts_orders GROUP BY status ORDER BY status;
SELECT type,count(*) AS ledger_rows FROM public.ts_cash_ledger GROUP BY type ORDER BY type;
SELECT count(*) AS procurement_rows FROM public.ts_procurements;

SELECT proname,pg_get_function_identity_arguments(p.oid) AS arguments,
 prosecdef AS security_definer,proacl AS grants,pg_get_functiondef(p.oid) AS definition
FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace
WHERE n.nspname='public' AND proname IN ('is_admin','create_order_transactional',
 'transition_order','confirm_manual_payment','cancel_unpaid_order','post_order_cash');

COMMIT;
