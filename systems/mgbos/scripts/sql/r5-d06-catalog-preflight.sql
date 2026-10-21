-- ============================================================================
-- BISNISHUB — R5 D06 AUTHORITATIVE POSTGRESQL CATALOG PREFLIGHT PACKAGE
-- ============================================================================
-- Tracking: Issue #60 / IC-INT02-001 / WP-INT02-001A / WP-INT02-001B
-- Contract Candidate: R5 Contract Freeze v0.4c (SHA-256: 74ab3911386fff1f...)
-- Repository Baseline: Rizkybuilds/bisnishub @ de3c640103fec5fa0049f4fddcbc287b73a8bc70
-- Mode: STRICTLY READ-ONLY TRANSACTION / NO MUTATIONS / DISCOVERY-SAFE
-- ============================================================================

BEGIN TRANSACTION READ ONLY;

-- ============================================================================
-- MODULE Q1: ENGINE, DATABASE & SESSION PROVENANCE
-- ============================================================================
SELECT 
  version() AS database_engine_version,
  current_setting('server_version_num')::integer AS server_version_num,
  current_database() AS target_database_name,
  current_user AS session_connected_user,
  session_user AS physical_session_user,
  current_setting('search_path') AS active_search_path,
  inet_server_addr() AS server_address,
  inet_server_port() AS server_port,
  current_setting('app.settings.project_id', true) AS optional_project_id_setting,
  current_setting('app.settings.environment', true) AS optional_environment_setting;

-- ============================================================================
-- MODULE Q2: ROLE INVENTORY, ATTRIBUTES & BYPASSRLS
-- ============================================================================
SELECT 
  rolname,
  rolsuper,
  rolinherit,
  rolcreaterole,
  rolcreatedb,
  rolcanlogin,
  rolreplication,
  rolbypassrls,
  rolconnlimit,
  rolconfig
FROM pg_roles
WHERE rolname IN (
  'postgres', 'supabase_admin', 'authenticator', 
  'service_role', 'authenticated', 'anon', 'mgbos_finance_owner'
)
ORDER BY rolname;

-- ============================================================================
-- MODULE Q3: ROLE MEMBERSHIP, INHERITANCE & SET OPTIONS (VERSION-AWARE)
-- ============================================================================
SELECT 
  r.rolname AS parent_role,
  m.rolname AS member_role,
  a.admin_option,
  to_jsonb(a) ->> 'inherit_option' AS inherit_option_pg16,
  to_jsonb(a) ->> 'set_option' AS set_option_pg16,
  pg_get_userbyid(a.grantor) AS grantor_role,
  pg_has_role(m.oid, r.oid, 'MEMBER') AS is_member,
  pg_has_role(m.oid, r.oid, 'USAGE') AS has_usage
FROM pg_auth_members a
JOIN pg_roles r ON r.oid = a.roleid
JOIN pg_roles m ON m.oid = a.member
WHERE r.rolname IN ('postgres', 'service_role', 'authenticated', 'anon', 'mgbos_finance_owner', 'supabase_admin')
   OR m.rolname IN ('postgres', 'service_role', 'authenticated', 'anon', 'mgbos_finance_owner', 'supabase_admin')
ORDER BY parent_role, member_role;

-- ============================================================================
-- MODULE Q4: SCHEMA OWNERSHIP & SAFE USAGE/CREATE PRIVILEGES
-- ============================================================================
WITH target_schemas AS (
  SELECT unnest(ARRAY['app', 'mgbos_finance_private', 'public', 'auth', 'extensions']) AS nspname
)
SELECT 
  ts.nspname AS schema_name,
  CASE WHEN n.oid IS NULL THEN 'SCHEMA_NOT_PRESENT' ELSE pg_get_userbyid(n.nspowner) END AS schema_owner,
  CASE WHEN n.oid IS NULL THEN 'SCHEMA_NOT_PRESENT' ELSE array_to_string(n.nspacl, ', ') END AS schema_acl,
  CASE 
    WHEN n.oid IS NULL THEN 'SCHEMA_NOT_PRESENT'
    WHEN NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'service_role') THEN 'ROLE_NOT_PRESENT'
    ELSE has_schema_privilege('service_role', n.oid, 'USAGE')::text 
  END AS service_role_usage,
  CASE 
    WHEN n.oid IS NULL THEN 'SCHEMA_NOT_PRESENT'
    WHEN NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'service_role') THEN 'ROLE_NOT_PRESENT'
    ELSE has_schema_privilege('service_role', n.oid, 'CREATE')::text 
  END AS service_role_create,
  CASE 
    WHEN n.oid IS NULL THEN 'SCHEMA_NOT_PRESENT'
    WHEN NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'mgbos_finance_owner') THEN 'ROLE_NOT_PRESENT'
    ELSE has_schema_privilege('mgbos_finance_owner', n.oid, 'USAGE')::text 
  END AS finance_owner_usage,
  CASE 
    WHEN n.oid IS NULL THEN 'SCHEMA_NOT_PRESENT'
    WHEN NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'mgbos_finance_owner') THEN 'ROLE_NOT_PRESENT'
    ELSE has_schema_privilege('mgbos_finance_owner', n.oid, 'CREATE')::text 
  END AS finance_owner_create
FROM target_schemas ts
LEFT JOIN pg_namespace n ON n.nspname = ts.nspname
ORDER BY ts.nspname;

-- ============================================================================
-- MODULE Q5A: RELATION SECURITY METADATA, RLS FLAGS & OBJECT-TYPE VERIFICATION
-- ============================================================================
WITH explicit_contract_relations AS (
  SELECT * FROM (VALUES 
    -- Baseline core tables
    ('app', 'payments'),
    ('app', 'payment_allocations'),
    ('app', 'payment_audit'),
    ('app', 'financial_ledger_entries'),
    ('app', 'invoices'),
    ('app', 'invoice_items'),
    ('app', 'invoice_audit'),
    ('app', 'orders'),
    -- Governed v0.4c target tables in schema 'app'
    ('app', 'payment_command_executions'),
    ('app', 'payment_write_gate')
  ) AS ecr(table_schema, table_name)
),
private_schema_relations AS (
  -- Dynamic discovery of all relations physically present in mgbos_finance_private
  SELECT n.nspname::text AS table_schema, c.relname::text AS table_name
  FROM pg_class c
  JOIN pg_namespace n ON n.oid = c.relnamespace
  WHERE n.nspname = 'mgbos_finance_private' AND c.relkind IN ('r', 'p', 'v', 'm')
),
expected_private_stubs AS (
  -- Normative private relation from R5 Contract Freeze v0.4c §2.2B line 107
  SELECT * FROM (VALUES 
    ('mgbos_finance_private', 'tx_financial_claims')
  ) AS eps(table_schema, table_name)
),
all_target_relations AS (
  SELECT table_schema, table_name FROM explicit_contract_relations
  UNION
  SELECT table_schema, table_name FROM private_schema_relations
  UNION
  SELECT table_schema, table_name FROM expected_private_stubs
)
SELECT 
  atr.table_schema,
  atr.table_name,
  COALESCE(c.relkind::text, 'RELATION_NOT_PRESENT') AS actual_relkind,
  -- Strict distinction between ordinary table ('r') and partitioned table ('p')
  CASE 
    WHEN c.oid IS NULL THEN 'RELATION_NOT_PRESENT'
    WHEN c.relkind = 'r' THEN 'EXPECTED_ORDINARY_TABLE_PRESENT'
    WHEN c.relkind = 'p' THEN 'PARTITIONED_TABLE_MISMATCH'
    ELSE 'OBJECT_TYPE_MISMATCH'
  END AS object_type_status,
  CASE WHEN c.oid IS NULL THEN 'RELATION_NOT_PRESENT' ELSE pg_get_userbyid(c.relowner) END AS relation_owner,
  CASE WHEN c.oid IS NULL THEN 'RELATION_NOT_PRESENT' ELSE c.relrowsecurity::text END AS rls_enabled,
  CASE WHEN c.oid IS NULL THEN 'RELATION_NOT_PRESENT' ELSE c.relforcerowsecurity::text END AS rls_forced,
  CASE 
    WHEN c.oid IS NULL THEN 'RELATION_NOT_PRESENT'
    WHEN c.relacl IS NULL THEN 'UNMODIFIED_DEFAULT_ACL'
    ELSE array_to_string(c.relacl, ', ')
  END AS raw_relation_acl,
  r_spec.rolname AS target_role,
  CASE 
    WHEN r.oid IS NULL THEN 'ROLE_NOT_PRESENT'
    WHEN c.oid IS NULL THEN 'RELATION_NOT_PRESENT'
    ELSE has_table_privilege(r.oid, c.oid, 'SELECT')::text 
  END AS can_select,
  CASE 
    WHEN r.oid IS NULL THEN 'ROLE_NOT_PRESENT'
    WHEN c.oid IS NULL THEN 'RELATION_NOT_PRESENT'
    ELSE has_table_privilege(r.oid, c.oid, 'INSERT')::text 
  END AS can_insert,
  CASE 
    WHEN r.oid IS NULL THEN 'ROLE_NOT_PRESENT'
    WHEN c.oid IS NULL THEN 'RELATION_NOT_PRESENT'
    ELSE has_table_privilege(r.oid, c.oid, 'UPDATE')::text 
  END AS can_update,
  CASE 
    WHEN r.oid IS NULL THEN 'ROLE_NOT_PRESENT'
    WHEN c.oid IS NULL THEN 'RELATION_NOT_PRESENT'
    ELSE has_table_privilege(r.oid, c.oid, 'DELETE')::text 
  END AS can_delete
FROM all_target_relations atr
CROSS JOIN (
  VALUES ('anon'), ('authenticated'), ('service_role'), ('mgbos_finance_owner')
) AS r_spec(rolname)
LEFT JOIN pg_roles r ON r.rolname = r_spec.rolname
LEFT JOIN pg_namespace n ON n.nspname = atr.table_schema
LEFT JOIN pg_class c ON c.relnamespace = n.oid AND c.relname = atr.table_name
ORDER BY atr.table_schema, atr.table_name, r_spec.rolname;

-- ============================================================================
-- MODULE Q5B: SENSITIVE COLUMN-LEVEL PRIVILEGE EVALUATION
-- ============================================================================
SELECT 
  col.table_schema,
  col.table_name,
  col.col_name,
  r_spec.rolname AS target_role,
  CASE 
    WHEN r.oid IS NULL THEN 'ROLE_NOT_PRESENT'
    WHEN c.oid IS NULL THEN 'TABLE_NOT_PRESENT'
    WHEN NOT EXISTS (SELECT 1 FROM pg_attribute a WHERE a.attrelid = c.oid AND a.attname = col.col_name AND NOT a.attisdropped) THEN 'COLUMN_NOT_PRESENT'
    ELSE has_column_privilege(r.oid, c.oid, col.col_name, 'UPDATE')::text 
  END AS can_update_column
FROM (
  VALUES 
    ('app', 'invoices', 'amount_paid'),
    ('app', 'invoices', 'balance_due'),
    ('app', 'invoices', 'status'),
    ('app', 'invoices', 'paid_at'),
    ('app', 'payments', 'amount'),
    ('app', 'payments', 'allocated_amount'),
    ('app', 'payments', 'status'),
    ('app', 'payments', 'payment_number')
) AS col(table_schema, table_name, col_name)
CROSS JOIN (VALUES ('service_role'), ('mgbos_finance_owner')) AS r_spec(rolname)
LEFT JOIN pg_roles r ON r.rolname = r_spec.rolname
LEFT JOIN pg_namespace n ON n.nspname = col.table_schema
LEFT JOIN pg_class c ON c.relnamespace = n.oid AND c.relname = col.table_name
ORDER BY col.table_name, col.col_name, r_spec.rolname;

-- ============================================================================
-- MODULE Q5C: SEQUENCE PRIVILEGES IN SCHEMA 'app'
-- ============================================================================
SELECT 
  c.relname AS sequence_name,
  r_spec.rolname AS target_role,
  CASE 
    WHEN r.oid IS NULL THEN 'ROLE_NOT_PRESENT'
    ELSE has_sequence_privilege(r.oid, c.oid, 'USAGE')::text 
  END AS can_use_sequence,
  CASE 
    WHEN r.oid IS NULL THEN 'ROLE_NOT_PRESENT'
    ELSE has_sequence_privilege(r.oid, c.oid, 'UPDATE')::text 
  END AS can_update_sequence
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
CROSS JOIN (VALUES ('service_role'), ('mgbos_finance_owner')) AS r_spec(rolname)
LEFT JOIN pg_roles r ON r.rolname = r_spec.rolname
WHERE n.nspname = 'app' AND c.relkind = 'S'
ORDER BY c.relname, r_spec.rolname;

-- ============================================================================
-- MODULE Q5D: DEFAULT PRIVILEGES IN RELEVANT SCHEMAS (pg_default_acl)
-- ============================================================================
SELECT 
  pg_get_userbyid(d.defaclrole) AS grantor_role,
  COALESCE(n.nspname, 'GLOBAL_DEFAULT') AS target_schema,
  d.defaclobjtype AS object_type,
  CASE 
    WHEN d.defaclacl IS NULL THEN 'UNMODIFIED_DEFAULT_ACL'
    ELSE array_to_string(d.defaclacl, ', ')
  END AS default_acl
FROM pg_default_acl d
LEFT JOIN pg_namespace n ON n.oid = d.defaclnamespace
WHERE n.nspname IN ('app', 'mgbos_finance_private') OR d.defaclnamespace = 0
ORDER BY target_schema, grantor_role, object_type;

-- ============================================================================
-- MODULE Q6: SENSITIVE & PRIVATE FUNCTION EXPOSURE & DIRECT CALLABILITY
-- ============================================================================
WITH app_targeted_functions AS (
  SELECT 'app'::text AS target_schema, unnest(ARRAY[
    -- Normative stored procedures/functions; payment_write_gate table removed
    'payment_actor_role',
    'record_payment_and_allocate',
    'allocate_existing_payment',
    'revert_payment',
    'create_retail_order',
    'issue_payment_intent_v1',
    'record_payment_command_v1',
    'recover_payment_intent_v1',
    'list_payment_intents_v1',
    'issue_invoice',
    'void_invoice',
    'payment_snapshot_guard',
    'financial_ledger_immutability_guard',
    'trg_payment_ledger_event',
    'trg_invoice_issued_ledger_event',
    'trg_order_confirmed_ledger_event',
    'record_actual_job_cost'
  ]) AS func_name,
  'NORMATIVE_CONTRACT_IDENTIFIER'::text AS name_authority
),
private_schema_functions AS (
  -- Dynamic discovery of all actual functions in mgbos_finance_private
  SELECT n.nspname::text AS target_schema, p.proname::text AS func_name,
         'CATALOG_OBSERVED_PRIVATE_ROUTINE'::text AS name_authority
  FROM pg_proc p
  JOIN pg_namespace n ON n.oid = p.pronamespace
  WHERE n.nspname = 'mgbos_finance_private'
),
illustrative_private_stubs AS (
  -- Illustrative helper names (UNCONFIRMED - NOT normative in R5 Contract Freeze v0.4c)
  SELECT 'mgbos_finance_private'::text AS target_schema, unnest(ARRAY[
    '_record_payment_core',
    '_verify_payment_claim',
    '_allocate_core',
    '_revert_core'
  ]) AS func_name,
  'ILLUSTRATIVE_UNCONFIRMED_HELPER'::text AS name_authority
),
all_catalog_targets AS (
  SELECT target_schema, func_name, name_authority FROM app_targeted_functions
  UNION
  SELECT target_schema, func_name, name_authority FROM private_schema_functions
  UNION
  SELECT target_schema, func_name, name_authority FROM illustrative_private_stubs
)
SELECT 
  act.target_schema,
  act.func_name,
  act.name_authority,
  p.oid AS function_oid,
  COALESCE(pg_get_function_identity_arguments(p.oid), 'FUNCTION_NOT_PRESENT') AS argument_signature,
  CASE WHEN p.oid IS NOT NULL THEN pg_get_userbyid(p.proowner) ELSE 'NOT_PRESENT' END AS function_owner,
  CASE WHEN p.oid IS NOT NULL THEN p.prosecdef::text ELSE 'NOT_PRESENT' END AS is_security_definer,
  CASE WHEN p.oid IS NOT NULL THEN COALESCE(array_to_string(p.proconfig, ', '), 'DEFAULT') ELSE 'NOT_PRESENT' END AS search_path_config,
  CASE 
    WHEN p.oid IS NULL THEN 'NOT_PRESENT'
    WHEN p.proacl IS NULL THEN 'UNMODIFIED_DEFAULT_ACL'
    ELSE array_to_string(p.proacl, ', ') 
  END AS raw_function_acl,
  -- Schema USAGE Prerequisite Checks
  CASE WHEN n.oid IS NULL THEN 'SCHEMA_NOT_PRESENT' ELSE has_schema_privilege('public', n.oid, 'USAGE')::text END AS public_schema_usage,
  CASE 
    WHEN n.oid IS NULL THEN 'SCHEMA_NOT_PRESENT'
    WHEN NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'service_role') THEN 'ROLE_NOT_PRESENT'
    ELSE has_schema_privilege('service_role', n.oid, 'USAGE')::text 
  END AS service_role_schema_usage,
  CASE 
    WHEN n.oid IS NULL THEN 'SCHEMA_NOT_PRESENT'
    WHEN NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'mgbos_finance_owner') THEN 'ROLE_NOT_PRESENT'
    ELSE has_schema_privilege('mgbos_finance_owner', n.oid, 'USAGE')::text 
  END AS finance_owner_schema_usage,
  -- Effective EXECUTE Checks Across Key Roles
  CASE 
    WHEN p.oid IS NULL THEN 'FUNCTION_NOT_PRESENT'
    ELSE has_function_privilege('public', p.oid, 'EXECUTE')::text 
  END AS public_can_execute,
  CASE 
    WHEN p.oid IS NULL THEN 'FUNCTION_NOT_PRESENT'
    WHEN NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN 'ROLE_NOT_PRESENT'
    ELSE has_function_privilege('anon', p.oid, 'EXECUTE')::text 
  END AS anon_can_execute,
  CASE 
    WHEN p.oid IS NULL THEN 'FUNCTION_NOT_PRESENT'
    WHEN NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN 'ROLE_NOT_PRESENT'
    ELSE has_function_privilege('authenticated', p.oid, 'EXECUTE')::text 
  END AS authenticated_can_execute,
  CASE 
    WHEN p.oid IS NULL THEN 'FUNCTION_NOT_PRESENT'
    WHEN NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'service_role') THEN 'ROLE_NOT_PRESENT'
    ELSE has_function_privilege('service_role', p.oid, 'EXECUTE')::text 
  END AS service_role_can_execute,
  CASE 
    WHEN p.oid IS NULL THEN 'FUNCTION_NOT_PRESENT'
    WHEN NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'mgbos_finance_owner') THEN 'ROLE_NOT_PRESENT'
    ELSE has_function_privilege('mgbos_finance_owner', p.oid, 'EXECUTE')::text 
  END AS finance_owner_can_execute,
  -- Composite Direct-Callability Oracle
  CASE 
    WHEN p.oid IS NULL THEN 'FUNCTION_NOT_PRESENT'
    WHEN n.oid IS NULL THEN 'SCHEMA_NOT_PRESENT'
    WHEN NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'service_role') THEN 'ROLE_NOT_PRESENT'
    WHEN has_schema_privilege('service_role', n.oid, 'USAGE') AND has_function_privilege('service_role', p.oid, 'EXECUTE') THEN 'DIRECTLY_CALLABLE'
    ELSE 'CALL_DENIED'
  END AS service_role_direct_callability
FROM all_catalog_targets act
LEFT JOIN pg_namespace n ON n.nspname = act.target_schema
LEFT JOIN pg_proc p ON p.pronamespace = n.oid AND p.proname = act.func_name
ORDER BY act.target_schema, act.name_authority, act.func_name, argument_signature;

-- ============================================================================
-- MODULE Q7: PRIVILEGED WRITER GRAPH & EVIDENCE-AWARE CLASSIFICATION
-- ============================================================================
WITH privileged_writer_manifest AS (
  SELECT * FROM (VALUES 
    -- 1. Declared Target Financial Effects (Status: DECLARED - Not Assumed as Demonstrated Direct DML)
    ('app', 'record_payment_command_v1', NULL, NULL, 'app', 'payments', 'DECLARED_FINANCIAL_EFFECT', 'INSERT', 'DECLARED', 'R5 Target Specification §2.1 L43 / WP-INT02-001A'),
    ('app', 'record_payment_command_v1', NULL, NULL, 'app', 'payment_allocations', 'DECLARED_FINANCIAL_EFFECT', 'INSERT', 'DECLARED', 'R5 Target Specification §2.1 L46 / WP-INT02-001A'),
    ('app', 'record_payment_command_v1', NULL, NULL, 'app', 'invoices', 'DECLARED_FINANCIAL_EFFECT', 'UPDATE', 'DECLARED', 'R5 Target Specification §2.1 L47 / WP-INT02-001A'),
    ('app', 'record_payment_command_v1', NULL, NULL, 'app', 'payment_audit', 'DECLARED_FINANCIAL_EFFECT', 'INSERT', 'DECLARED', 'R5 Target Specification §2.1 L48 / WP-INT02-001A'),
    ('app', 'record_payment_command_v1', NULL, NULL, 'app', 'invoice_audit', 'DECLARED_FINANCIAL_EFFECT', 'INSERT', 'DECLARED', 'R5 Target Specification §2.1 L48 / WP-INT02-001A'),
    ('app', 'record_payment_command_v1', NULL, NULL, 'app', 'financial_ledger_entries', 'DECLARED_FINANCIAL_EFFECT', 'INSERT', 'DECLARED', 'R5 Target Specification §2.1 L49 / WP-INT02-001A'),
    ('app', 'record_payment_command_v1', NULL, NULL, 'app', 'payment_command_executions', 'DECLARED_FINANCIAL_EFFECT', 'INSERT', 'DECLARED', 'R5 Target Specification §2.1 L50, §2.2A L89'),
    -- R5-QA-06: Gate Row-Lock Dependency (SELECT ... FOR SHARE requires SELECT + UPDATE on at least one column)
    ('app', 'record_payment_command_v1', NULL, NULL, 'app', 'payment_write_gate', 'DECLARED_LOCK_DEPENDENCY', 'SELECT_FOR_SHARE', 'DECLARED', 'R5 Target Specification §2.1 L51, §2.3 L118'),
    ('app', 'record_payment_command_v1', NULL, NULL, 'mgbos_finance_private', 'tx_financial_claims', 'DECLARED_CLAIM_LIFECYCLE', 'INSERT', 'DECLARED', 'R5 Target Specification §2.2B L107-L108'),

    -- 2. Verified Baseline Payment Recording Procedures (Status: VERIFIED_WITH_EVIDENCE)
    ('app', 'record_payment_and_allocate', NULL, NULL, 'app', 'payments', 'DIRECT_TABLE_DML', 'INSERT', 'VERIFIED_WITH_EVIDENCE', '20260925150000#L269-L281'),
    ('app', 'record_payment_and_allocate', NULL, NULL, 'app', 'payment_allocations', 'DIRECT_TABLE_DML', 'INSERT', 'VERIFIED_WITH_EVIDENCE', '20260925150000#L323-L327'),
    ('app', 'record_payment_and_allocate', NULL, NULL, 'app', 'invoices', 'DIRECT_TABLE_DML', 'UPDATE', 'VERIFIED_WITH_EVIDENCE', '20260925150000#L315-L321'),
    ('app', 'record_payment_and_allocate', NULL, NULL, 'app', 'payment_audit', 'DIRECT_TABLE_DML', 'INSERT', 'VERIFIED_WITH_EVIDENCE', '20260925150000#L347-L359'),
    ('app', 'record_payment_and_allocate', NULL, NULL, 'app', 'invoice_audit', 'DIRECT_TABLE_DML', 'INSERT', 'VERIFIED_WITH_EVIDENCE', '20260925150000#L329-L342'),

    -- 3. Verified Baseline Allocation Procedure (Status: VERIFIED_WITH_EVIDENCE)
    ('app', 'allocate_existing_payment', NULL, NULL, 'app', 'payment_allocations', 'DIRECT_TABLE_DML', 'INSERT', 'VERIFIED_WITH_EVIDENCE', '20260925150000#L452-L460'),
    ('app', 'allocate_existing_payment', NULL, NULL, 'app', 'payments', 'DIRECT_TABLE_DML', 'UPDATE', 'VERIFIED_WITH_EVIDENCE', '20260925150000#L461-L464'),
    ('app', 'allocate_existing_payment', NULL, NULL, 'app', 'invoices', 'DIRECT_TABLE_DML', 'UPDATE', 'VERIFIED_WITH_EVIDENCE', '20260925150000#L444-L450'),

    -- 4. Verified Baseline Reversal Procedure (Status: VERIFIED_WITH_EVIDENCE)
    ('app', 'revert_payment', NULL, NULL, 'app', 'payments', 'DIRECT_TABLE_DML', 'UPDATE', 'VERIFIED_WITH_EVIDENCE', '20260925150000#L583-L589'),
    ('app', 'revert_payment', NULL, NULL, 'app', 'invoices', 'DIRECT_TABLE_DML', 'UPDATE', 'VERIFIED_WITH_EVIDENCE', '20260925150000#L557-L563'),

    -- 5. Verified Baseline Retail Order Procedure (Status: VERIFIED_WITH_EVIDENCE)
    ('app', 'create_retail_order', NULL, NULL, 'app', 'orders', 'DIRECT_TABLE_DML', 'INSERT', 'VERIFIED_WITH_EVIDENCE', '20261015150000#L248-L270'),
    ('app', 'create_retail_order', NULL, NULL, 'app', 'invoices', 'DIRECT_TABLE_DML', 'INSERT', 'VERIFIED_WITH_EVIDENCE', '20261015150000#L351-L397'),
    ('app', 'create_retail_order', NULL, NULL, 'app', 'record_payment_and_allocate', 'FUNCTION_INVOCATION', 'EXECUTE', 'VERIFIED_WITH_EVIDENCE', '20261015150000#L584-L600'),

    -- 6. Verified Baseline Invoicing Procedures (Status: VERIFIED_WITH_EVIDENCE)
    ('app', 'issue_invoice', NULL, NULL, 'app', 'invoices', 'DIRECT_TABLE_DML', 'UPDATE', 'VERIFIED_WITH_EVIDENCE', '20260925140000#L350-L355'),
    ('app', 'void_invoice', NULL, NULL, 'app', 'invoices', 'DIRECT_TABLE_DML', 'UPDATE', 'VERIFIED_WITH_EVIDENCE', '20260925140000#L404-L408'),

    -- 7. Verified Baseline Production Cost Settlement (Status: VERIFIED_WITH_EVIDENCE)
    ('app', 'record_actual_job_cost', NULL, NULL, 'app', 'production_jobs', 'DIRECT_TABLE_DML', 'UPDATE', 'VERIFIED_WITH_EVIDENCE', '20260925160000#L136-L139'),
    ('app', 'record_actual_job_cost', NULL, NULL, 'app', 'financial_ledger_entries', 'DIRECT_TABLE_DML', 'INSERT', 'VERIFIED_WITH_EVIDENCE', '20260925160000#L145-L181'),

    -- 8. Verified Baseline Ledger Triggers (Status: VERIFIED_WITH_EVIDENCE)
    ('app', 'trg_order_confirmed_ledger_event', 'app', 'orders', 'app', 'financial_ledger_entries', 'TRIGGER_BINDING', 'INSERT', 'VERIFIED_WITH_EVIDENCE', '20260925160000#L228-L266 & L271-L274'),
    ('app', 'trg_invoice_issued_ledger_event', 'app', 'invoices', 'app', 'financial_ledger_entries', 'TRIGGER_BINDING', 'INSERT', 'VERIFIED_WITH_EVIDENCE', '20260925160000#L286-L359 & L366-L369'),
    ('app', 'trg_payment_ledger_event', 'app', 'payments', 'app', 'financial_ledger_entries', 'TRIGGER_BINDING', 'INSERT', 'VERIFIED_WITH_EVIDENCE', '20260925160000#L391-L469 & L476-L479')
  ) AS pwm(fn_schema, fn_name, src_schema, src_rel, dst_schema, dst_obj, edge_type, op_type, source_evidence_status, source_pin)
)
SELECT 
  pwm.fn_name AS writer_or_caller,
  pwm.edge_type,
  COALESCE(pwm.src_rel, 'PROCEDURAL_INVOCATION') AS trigger_source_relation,
  pwm.dst_obj AS target_object,
  pwm.op_type AS operation_type,
  pwm.source_evidence_status,
  pwm.source_pin,
  CASE WHEN p_caller.oid IS NULL THEN 'CALLER_NOT_PRESENT' ELSE pg_get_userbyid(p_caller.proowner) END AS caller_owner,
  CASE WHEN p_caller.oid IS NULL THEN 'CALLER_NOT_PRESENT' ELSE p_caller.prosecdef::text END AS caller_is_secdef,
  -- Effective Execution or Mutation Privilege (R5-QA-06 Dual Lock Privilege Oracle)
  CASE 
    WHEN p_caller.oid IS NULL THEN 'CALLER_NOT_PRESENT'
    WHEN pwm.edge_type = 'FUNCTION_INVOCATION' THEN (
      CASE 
        WHEN p_target.oid IS NULL THEN 'TARGET_FUNCTION_NOT_PRESENT'
        WHEN p_caller.prosecdef = false THEN 'INVOKER_CALLER_PRIVS_APPLY'
        ELSE has_function_privilege(p_caller.proowner, p_target.oid, 'EXECUTE')::text 
      END
    )
    WHEN pwm.edge_type = 'DECLARED_LOCK_DEPENDENCY' THEN (
      CASE 
        WHEN c_dst.oid IS NULL THEN 'TARGET_RELATION_NOT_PRESENT'
        WHEN p_caller.prosecdef = false THEN 'INVOKER_CALLER_PRIVS_APPLY'
        WHEN has_table_privilege(p_caller.proowner, c_dst.oid, 'SELECT') 
             AND has_any_column_privilege(p_caller.proowner, c_dst.oid, 'UPDATE') 
          THEN 'LOCK_PRIVILEGES_PRESENT'
        ELSE 'LOCK_PRIVILEGES_INSUFFICIENT'
      END
    )
    ELSE (
      CASE 
        WHEN c_dst.oid IS NULL THEN 'TARGET_RELATION_NOT_PRESENT'
        WHEN p_caller.prosecdef = false THEN 'INVOKER_CALLER_PRIVS_APPLY'
        ELSE has_table_privilege(p_caller.proowner, c_dst.oid, pwm.op_type)::text 
      END
    )
  END AS caller_owner_has_effective_privilege,
  -- Distinct Catalog Evidence vs Source Classification
  CASE 
    WHEN p_caller.oid IS NULL THEN 'CALLER_NOT_PRESENT'
    WHEN pwm.edge_type = 'FUNCTION_INVOCATION' AND p_target.oid IS NULL THEN 'TARGET_FUNCTION_NOT_PRESENT'
    WHEN pwm.edge_type NOT IN ('FUNCTION_INVOCATION') AND c_dst.oid IS NULL THEN 'TARGET_RELATION_NOT_PRESENT'
    -- Catalog Trigger Binding
    WHEN pwm.edge_type = 'TRIGGER_BINDING' AND EXISTS (
      SELECT 1 FROM pg_trigger tg 
      WHERE tg.tgfoid = p_caller.oid AND tg.tgrelid = c_src.oid
    ) THEN 'CATALOG_TRIGGER_BINDING_OBSERVED'
    -- Catalog Dependency Entry
    WHEN pwm.edge_type = 'FUNCTION_INVOCATION' AND EXISTS (
      SELECT 1 FROM pg_depend d 
      WHERE d.classid = 'pg_proc'::regclass AND d.objid = p_caller.oid 
        AND d.refclassid = 'pg_proc'::regclass AND d.refobjid = p_target.oid
    ) THEN 'CATALOG_DEPENDENCY_OBSERVED'
    WHEN pwm.edge_type = 'DIRECT_TABLE_DML' AND EXISTS (
      SELECT 1 FROM pg_depend d 
      WHERE d.classid = 'pg_proc'::regclass AND d.objid = p_caller.oid 
        AND d.refclassid = 'pg_class'::regclass AND d.refobjid = c_dst.oid
    ) THEN 'CATALOG_DEPENDENCY_OBSERVED'
    -- Catalog-Absent Source Verification
    WHEN pwm.source_evidence_status = 'VERIFIED_WITH_EVIDENCE' THEN 'CATALOG_ABSENT_SOURCE_VERIFIED'
    WHEN pwm.source_evidence_status = 'DECLARED' THEN 'CATALOG_ABSENT_TARGET_DECLARED'
    ELSE 'SOURCE_EDGE_UNVERIFIED'
  END AS edge_catalog_evaluation
FROM privileged_writer_manifest pwm
LEFT JOIN pg_namespace n_fn ON n_fn.nspname = pwm.fn_schema
LEFT JOIN pg_proc p_caller ON p_caller.pronamespace = n_fn.oid AND p_caller.proname = pwm.fn_name
LEFT JOIN pg_namespace n_src ON n_src.nspname = pwm.src_schema
LEFT JOIN pg_class c_src ON c_src.relnamespace = n_src.oid AND c_src.relname = pwm.src_rel
LEFT JOIN pg_namespace n_dst ON n_dst.nspname = pwm.dst_schema
LEFT JOIN pg_class c_dst ON c_dst.relnamespace = n_dst.oid AND c_dst.relname = pwm.dst_obj
LEFT JOIN pg_proc p_target ON p_target.pronamespace = n_dst.oid AND p_target.proname = pwm.dst_obj
ORDER BY pwm.dst_obj, pwm.fn_name;

-- ============================================================================
-- MODULE Q8: SAFE DIAGNOSTIC DISCOVERY PROBES (FAIL-CLOSED EVALUATION)
-- ============================================================================
SELECT 
  probe_id,
  probe_category,
  probe_description,
  observed_discovery_result,
  oracle_governance_guidance
FROM (
  -- Probe 1: Baseline inspection of service_role table DML on payments
  SELECT 
    'PRB-BASE-01' AS probe_id,
    'BASELINE_EXPOSURE_CHECK' AS probe_category,
    'service_role holds INSERT on app.payments (Expected baseline exposure; target R5 denies)' AS probe_description,
    CASE 
      WHEN NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'service_role') THEN 'ROLE_NOT_PRESENT'
      WHEN NOT EXISTS (SELECT 1 FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace WHERE n.nspname = 'app' AND c.relname = 'payments') THEN 'TABLE_NOT_PRESENT'
      WHEN has_table_privilege('service_role', 'app.payments', 'INSERT') THEN 'EXPECTED_BASELINE_EXPOSURE'
      ELSE 'DIRECT_DML_DENIED'
    END AS observed_discovery_result,
    'BASELINE_OBSERVED: Baseline database is writable and NOT R5-safe. Traffic freeze mandatory prior to Migration A.' AS oracle_governance_guidance

  UNION ALL

  -- Probe 2: Legacy payment function presence (CORRECTED QA-FINAL-04 ORACLE)
  SELECT 
    'PRB-BASE-02',
    'LEGACY_DENIAL_STUB_DISCOVERY',
    'app.record_payment_and_allocate presence in catalog',
    CASE 
      WHEN EXISTS (SELECT 1 FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace WHERE n.nspname = 'app' AND p.proname = 'record_payment_and_allocate') 
      THEN 'PRESENT_BODY_SEMANTICS_UNVERIFIED_BY_CATALOG'
      ELSE 'NOT_PRESENT'
    END,
    'CORRECTED ORACLE: Presence expected in baseline (mutating) AND post-Migration A (permanent denial stub). Catalog existence alone cannot prove body is non-mutating; pg_proc definition audit required.'

  UNION ALL

  -- Target Probe 1: Versioned RPC presence (strictly discovery; no security pass)
  SELECT 
    'PRB-TGT-01',
    'TARGET_OBJECT_DISCOVERY',
    'app.issue_payment_intent_v1 catalog presence (Target requirement; baseline lacks)',
    CASE 
      WHEN EXISTS (SELECT 1 FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace WHERE n.nspname = 'app' AND p.proname = 'issue_payment_intent_v1') THEN 'PRESENT_NOT_SECURITY_VERIFIED'
      ELSE 'NOT_PRESENT'
    END,
    'TARGET DISCOVERY: Existence confirms migration deployment only; does not prove authorization or single-execution enforcement.'

  UNION ALL

  -- Target Probe 2: Versioned recording command presence
  SELECT 
    'PRB-TGT-02',
    'TARGET_OBJECT_DISCOVERY',
    'app.record_payment_command_v1 catalog presence (Target requirement; baseline lacks)',
    CASE 
      WHEN EXISTS (SELECT 1 FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace WHERE n.nspname = 'app' AND p.proname = 'record_payment_command_v1') THEN 'PRESENT_NOT_SECURITY_VERIFIED'
      ELSE 'NOT_PRESENT'
    END,
    'TARGET DISCOVERY: Gated interface; must deny writes under closed gate (P0001).'

  UNION ALL

  -- Target Probe 3: Private finance owner role existence
  SELECT 
    'PRB-TGT-03',
    'TARGET_OBJECT_DISCOVERY',
    'mgbos_finance_owner role catalog presence (Target requirement; baseline lacks)',
    CASE 
      WHEN EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'mgbos_finance_owner') THEN 'PRESENT_NOT_SECURITY_VERIFIED'
      ELSE 'NOT_PRESENT'
    END,
    'TARGET DISCOVERY: Presence required before ALTER FUNCTION ... OWNER TO can execute.'
) AS probes
ORDER BY probe_id;

ROLLBACK;
