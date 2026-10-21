/**
 * BISNISHUB — R5 D06 Catalog Preflight Execution Runner (Candidate A)
 *
 * Standalone, zero-external-dependency runner for executing the authoritative
 * Q1–Q8 PostgreSQL catalog preflight query package in a disposable CI environment.
 *
 * Tracking: Issue #60 / IC-INT02-001 / WP-INT02-001A/B
 * Contract: BisnisHub R5 Contract Freeze v0.4c
 * Approved SQL SHA-256: 62d4b6a8f347e6a2f1edbf617d3d3fc1aa686591b8308f0fa3dd71952b2aa7e1
 */

import { spawnSync } from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

export const APPROVED_SQL_SHA256 =
  '62d4b6a8f347e6a2f1edbf617d3d3fc1aa686591b8308f0fa3dd71952b2aa7e1';
export const APPROVED_SQL_BYTE_SIZE = 30218;
export const CANONICAL_LOCAL_HOST = '127.0.0.1';
export const CANONICAL_LOCAL_PORT = 55432;
export const CANONICAL_LOCAL_DATABASE = 'postgres';
export const CANONICAL_LOCAL_USER = 'postgres';
export const CANONICAL_LOCAL_PROJECT_ID = 'mgbos-foundation';
export const CANONICAL_CONTAINER_NAME = 'supabase_db_mgbos-foundation';
export const CANONICAL_CONTAINER_INTERNAL_PORT = 5432;
export const CANONICAL_LOCAL_SERVICE_ROLE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';
export const STATEMENT_TIMEOUT_MS = 15000;
export const LOCK_TIMEOUT_MS = 5000;

/**
 * Prohibited libpq environment variables that can redirect connection routing,
 * load external service files or password files, or alter authentication.
 */
export const PROHIBITED_LIBPQ_VARS = [
  'PGHOSTADDR',
  'PGSERVICE',
  'PGSERVICEFILE',
  'PGPASSFILE',
  'PGSYSCONFDIR',
  'PGSSLCERT',
  'PGSSLKEY',
  'PGSSLROOTCERT',
  'PGSSLCRL',
  'PGTARGETSESSIONATTRS',
];

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const SQL_ASSET_PATH = path.join(
  __dirname,
  'sql',
  'r5-d06-catalog-preflight.sql',
);
const DEFAULT_EVIDENCE_DIR = path.join(
  __dirname,
  '..',
  '.qa-evidence',
  'r5-preflight',
);

/**
 * Exact canonical module definitions matching r5-d06-catalog-preflight.sql byte-for-byte.
 */
export const CANONICAL_MODULE_SPECS = [
  {
    key: 'q1',
    name: 'MODULE Q1: ENGINE, DATABASE & SESSION PROVENANCE',
    expectedHeaders: [
      'database_engine_version',
      'server_version_num',
      'target_database_name',
      'session_connected_user',
      'physical_session_user',
      'active_search_path',
      'server_address',
      'server_port',
      'optional_project_id_setting',
      'optional_environment_setting',
    ],
    signatureCol: 'database_engine_version',
  },
  {
    key: 'q2',
    name: 'MODULE Q2: ROLE INVENTORY, ATTRIBUTES & BYPASSRLS',
    expectedHeaders: [
      'rolname',
      'rolsuper',
      'rolinherit',
      'rolcreaterole',
      'rolcreatedb',
      'rolcanlogin',
      'rolreplication',
      'rolbypassrls',
      'rolconnlimit',
      'rolconfig',
    ],
    signatureCol: 'rolname',
  },
  {
    key: 'q3',
    name: 'MODULE Q3: ROLE MEMBERSHIP, INHERITANCE & SET OPTIONS (VERSION-AWARE)',
    expectedHeaders: [
      'parent_role',
      'member_role',
      'admin_option',
      'inherit_option_pg16',
      'set_option_pg16',
      'grantor_role',
      'is_member',
      'has_usage',
    ],
    signatureCol: 'parent_role',
  },
  {
    key: 'q4',
    name: 'MODULE Q4: SCHEMA OWNERSHIP & SAFE USAGE/CREATE PRIVILEGES',
    expectedHeaders: [
      'schema_name',
      'schema_owner',
      'schema_acl',
      'service_role_usage',
      'service_role_create',
      'finance_owner_usage',
      'finance_owner_create',
    ],
    signatureCol: 'schema_name',
  },
  {
    key: 'q5a',
    name: 'MODULE Q5A: RELATION SECURITY METADATA, RLS FLAGS & OBJECT-TYPE VERIFICATION',
    expectedHeaders: [
      'table_schema',
      'table_name',
      'actual_relkind',
      'object_type_status',
      'relation_owner',
      'rls_enabled',
      'rls_forced',
      'raw_relation_acl',
      'target_role',
      'can_select',
      'can_insert',
      'can_update',
      'can_delete',
    ],
    signatureCol: 'actual_relkind',
  },
  {
    key: 'q5b',
    name: 'MODULE Q5B: SENSITIVE COLUMN-LEVEL PRIVILEGE EVALUATION',
    expectedHeaders: [
      'table_schema',
      'table_name',
      'col_name',
      'target_role',
      'can_update_column',
    ],
    signatureCol: 'can_update_column',
  },
  {
    key: 'q5c',
    name: "MODULE Q5C: SEQUENCE PRIVILEGES IN SCHEMA 'app'",
    expectedHeaders: [
      'sequence_name',
      'target_role',
      'can_use_sequence',
      'can_update_sequence',
    ],
    signatureCol: 'can_use_sequence',
  },
  {
    key: 'q5d',
    name: 'MODULE Q5D: DEFAULT PRIVILEGES IN RELEVANT SCHEMAS (pg_default_acl)',
    expectedHeaders: [
      'grantor_role',
      'target_schema',
      'object_type',
      'default_acl',
    ],
    signatureCol: 'object_type',
  },
  {
    key: 'q6',
    name: 'MODULE Q6: SENSITIVE & PRIVATE FUNCTION EXPOSURE & DIRECT CALLABILITY',
    expectedHeaders: [
      'target_schema',
      'func_name',
      'name_authority',
      'function_oid',
      'argument_signature',
      'function_owner',
      'is_security_definer',
      'search_path_config',
      'raw_function_acl',
      'public_schema_usage',
      'service_role_schema_usage',
      'finance_owner_schema_usage',
      'public_can_execute',
      'anon_can_execute',
      'authenticated_can_execute',
      'service_role_can_execute',
      'finance_owner_can_execute',
      'service_role_direct_callability',
    ],
    signatureCol: 'service_role_direct_callability',
  },
  {
    key: 'q7',
    name: 'MODULE Q7: PRIVILEGED WRITER GRAPH & EVIDENCE-AWARE CLASSIFICATION',
    expectedHeaders: [
      'writer_or_caller',
      'edge_type',
      'trigger_source_relation',
      'target_object',
      'operation_type',
      'source_evidence_status',
      'source_pin',
      'caller_owner',
      'caller_is_secdef',
      'caller_owner_has_effective_privilege',
      'edge_catalog_evaluation',
    ],
    signatureCol: 'caller_owner_has_effective_privilege',
  },
  {
    key: 'q8',
    name: 'MODULE Q8: SAFE DIAGNOSTIC DISCOVERY PROBES (FAIL-CLOSED EVALUATION)',
    expectedHeaders: [
      'probe_id',
      'probe_category',
      'probe_description',
      'observed_discovery_result',
      'oracle_governance_guidance',
    ],
    signatureCol: 'probe_id',
  },
];

/**
 * Output allowlists for sanitizing free-form or sensitive fields from evidence output.
 */
export const OUTPUT_ALLOWLISTS = {
  q1: [
    'server_version_num',
    'target_database_name',
    'session_connected_user',
    'physical_session_user',
    'active_search_path',
    'server_port',
    'optional_project_id_setting',
    'optional_environment_setting',
  ],
  q2: [
    'rolname',
    'rolsuper',
    'rolinherit',
    'rolcreaterole',
    'rolcreatedb',
    'rolcanlogin',
    'rolreplication',
    'rolbypassrls',
    'rolconnlimit',
  ],
  q3: [
    'parent_role',
    'member_role',
    'admin_option',
    'inherit_option_pg16',
    'set_option_pg16',
    'grantor_role',
    'is_member',
    'has_usage',
  ],
  q4: [
    'schema_name',
    'schema_owner',
    'service_role_usage',
    'service_role_create',
    'finance_owner_usage',
    'finance_owner_create',
  ],
  q5a: [
    'table_schema',
    'table_name',
    'actual_relkind',
    'object_type_status',
    'relation_owner',
    'rls_enabled',
    'rls_forced',
    'target_role',
    'can_select',
    'can_insert',
    'can_update',
    'can_delete',
  ],
  q5b: [
    'table_schema',
    'table_name',
    'col_name',
    'target_role',
    'can_update_column',
  ],
  q5c: [
    'sequence_name',
    'target_role',
    'can_use_sequence',
    'can_update_sequence',
  ],
  q5d: ['grantor_role', 'target_schema', 'object_type'],
  q6: [
    'target_schema',
    'func_name',
    'name_authority',
    'argument_signature',
    'function_owner',
    'is_security_definer',
    'public_schema_usage',
    'service_role_schema_usage',
    'finance_owner_schema_usage',
    'public_can_execute',
    'anon_can_execute',
    'authenticated_can_execute',
    'service_role_can_execute',
    'finance_owner_can_execute',
    'service_role_direct_callability',
  ],
  q7: [
    'writer_or_caller',
    'edge_type',
    'trigger_source_relation',
    'target_object',
    'operation_type',
    'source_evidence_status',
    'caller_owner',
    'caller_is_secdef',
    'caller_owner_has_effective_privilege',
    'edge_catalog_evaluation',
  ],
  q8: [
    'probe_id',
    'probe_category',
    'probe_description',
    'observed_discovery_result',
    'oracle_governance_guidance',
  ],
};

/**
 * Verifies the byte-level and cryptographic integrity of the SQL asset.
 * @param {string} filePath
 * @returns {{ byteSize: number, sha256: string }}
 */
export function verifySqlAssetIntegrity(filePath = SQL_ASSET_PATH) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`SQL asset file not found at: ${filePath}`);
  }
  const buf = fs.readFileSync(filePath);
  const hash = crypto.createHash('sha256').update(buf).digest('hex');

  if (buf.length !== APPROVED_SQL_BYTE_SIZE) {
    throw new Error(
      `SQL asset size mismatch: expected exact ${APPROVED_SQL_BYTE_SIZE} bytes, got ${buf.length} bytes.`,
    );
  }
  if (hash !== APPROVED_SQL_SHA256) {
    throw new Error(
      `SQL asset SHA-256 mismatch: expected ${APPROVED_SQL_SHA256}, got ${hash}.`,
    );
  }

  return { byteSize: buf.length, sha256: hash };
}

/**
 * Validates the Supabase configuration file (supabase/config.toml).
 * Rejects missing files, malformed sections, duplicate conflicting settings,
 * wrong project_id, or incorrect database port.
 *
 * @param {string} configPath
 * @param {{ isVerifyOnly?: boolean }} [options={}]
 * @returns {{ projectId: string, dbPort: number, configPath: string }}
 */
export function validateSupabaseConfig(configPath, options = {}) {
  const isVerifyOnly = options.isVerifyOnly === true;

  if (!fs.existsSync(configPath)) {
    if (!isVerifyOnly) {
      throw new Error(
        'Execution rejected: required configuration file supabase/config.toml is missing (CONFIG_FILE_NOT_FOUND).',
      );
    }
    return {
      projectId: 'NOT_EVALUATED_CONFIG_MISSING',
      dbPort: 0,
      configPath,
    };
  }

  const rawContent = fs.readFileSync(configPath, 'utf8');
  const lines = rawContent.split(/\r?\n/);

  let currentSection = null;
  const sectionsObserved = new Set();
  const rootSettings = new Map();
  const sectionSettings = new Map();

  for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
    const rawLine = lines[lineIdx];
    const lineNum = lineIdx + 1;

    // Remove comments while respecting double-quoted strings
    let inQuote = false;
    let commentIdx = -1;
    for (let i = 0; i < rawLine.length; i++) {
      const ch = rawLine[i];
      if (ch === '"' && (i === 0 || rawLine[i - 1] !== '\\')) {
        inQuote = !inQuote;
      } else if (ch === '#' && !inQuote) {
        commentIdx = i;
        break;
      }
    }

    const trimmed = (
      commentIdx !== -1 ? rawLine.slice(0, commentIdx) : rawLine
    ).trim();
    if (!trimmed) continue;

    // Check section header: [section] or [section.subsection]
    if (trimmed.startsWith('[')) {
      const match = trimmed.match(/^\[([a-zA-Z0-9_\.-]+)\]$/);
      if (!match) {
        throw new Error(
          `Config validation failed: malformed section header at line ${lineNum} (MALFORMED_SECTION_HEADER).`,
        );
      }
      const sectionName = match[1];
      if (sectionsObserved.has(sectionName)) {
        throw new Error(
          `Config validation failed: duplicate section [${sectionName}] at line ${lineNum} (DUPLICATE_SECTION).`,
        );
      }
      sectionsObserved.add(sectionName);
      currentSection = sectionName;
      sectionSettings.set(currentSection, new Map());
      continue;
    }

    // Check key = value
    const kvMatch = trimmed.match(/^([a-zA-Z0-9_-]+)\s*=\s*(.+)$/);
    if (!kvMatch) {
      throw new Error(
        `Config validation failed: malformed TOML key-value syntax at line ${lineNum} (MALFORMED_TOML_SYNTAX).`,
      );
    }

    const key = kvMatch[1].trim();
    const valStr = kvMatch[2].trim();

    let val = valStr;
    if (valStr.startsWith('"') && valStr.endsWith('"')) {
      val = valStr.slice(1, -1);
    } else if (!isNaN(Number(valStr))) {
      val = Number(valStr);
    } else if (valStr === 'true') {
      val = true;
    } else if (valStr === 'false') {
      val = false;
    }

    if (!currentSection) {
      if (rootSettings.has(key)) {
        throw new Error(
          `Config validation failed: duplicate root setting '${key}' at line ${lineNum} (DUPLICATE_SETTING).`,
        );
      }
      rootSettings.set(key, val);
    } else {
      const secMap = sectionSettings.get(currentSection);
      if (secMap.has(key)) {
        throw new Error(
          `Config validation failed: duplicate setting '${key}' in [${currentSection}] at line ${lineNum} (DUPLICATE_SETTING).`,
        );
      }
      secMap.set(key, val);
    }
  }

  // 1. Validate root project_id
  const projectId = rootSettings.get('project_id');
  if (!projectId || projectId !== CANONICAL_LOCAL_PROJECT_ID) {
    throw new Error(
      `Config validation failed: project_id must be '${CANONICAL_LOCAL_PROJECT_ID}' (UNEXPECTED_PROJECT_ID).`,
    );
  }

  // 2. Validate [db] section exists
  if (!sectionsObserved.has('db') || !sectionSettings.has('db')) {
    throw new Error(
      'Config validation failed: missing required [db] section (MISSING_DB_SECTION).',
    );
  }

  // 3. Validate [db] port setting
  const dbMap = sectionSettings.get('db');
  const port = dbMap.get('port');
  if (port === undefined || port === null) {
    throw new Error(
      'Config validation failed: missing port setting under [db] (MISSING_DB_PORT).',
    );
  }
  if (Number(port) !== CANONICAL_LOCAL_PORT) {
    throw new Error(
      `Config validation failed: [db].port must be ${CANONICAL_LOCAL_PORT} (PORT_CONFIGURATION_MISMATCH).`,
    );
  }

  return {
    projectId,
    dbPort: Number(port),
    configPath,
  };
}

/**
 * Validates the environment against hostile or redirecting libpq variables,
 * and constructs a minimal, isolated subprocess environment for psql execution.
 * Enforces canonical local endpoint parameters (127.0.0.1:55432, postgres@postgres).
 *
 * @param {Record<string, string | undefined>} [env=process.env]
 * @returns {Record<string, string>}
 */
export function buildIsolatedPsqlEnvironment(env = process.env) {
  // 1. Audit and fail-closed on prohibited libpq variables
  for (const varName of PROHIBITED_LIBPQ_VARS) {
    if (env[varName] !== undefined && env[varName] !== '') {
      throw new Error(
        `Execution rejected: prohibited libpq routing variable '${varName}' detected (HOSTILE_LIBPQ_ROUTING_VARIABLE).`,
      );
    }
  }

  // 2. Audit canonical parameter overrides if present in ambient environment
  if (env.PGHOST && env.PGHOST !== CANONICAL_LOCAL_HOST) {
    throw new Error(
      `Execution rejected: PGHOST must not point to external host (HOSTILE_LIBPQ_ROUTING_VARIABLE). Expected '${CANONICAL_LOCAL_HOST}'.`,
    );
  }
  if (env.PGPORT && String(env.PGPORT) !== String(CANONICAL_LOCAL_PORT)) {
    throw new Error(
      `Execution rejected: PGPORT must match canonical local port (HOSTILE_LIBPQ_ROUTING_VARIABLE). Expected '${CANONICAL_LOCAL_PORT}'.`,
    );
  }
  if (env.PGDATABASE && env.PGDATABASE !== CANONICAL_LOCAL_DATABASE) {
    throw new Error(
      `Execution rejected: PGDATABASE must match canonical database (HOSTILE_LIBPQ_ROUTING_VARIABLE). Expected '${CANONICAL_LOCAL_DATABASE}'.`,
    );
  }
  if (env.PGUSER && env.PGUSER !== CANONICAL_LOCAL_USER) {
    throw new Error(
      `Execution rejected: PGUSER must match canonical user (HOSTILE_LIBPQ_ROUTING_VARIABLE). Expected '${CANONICAL_LOCAL_USER}'.`,
    );
  }

  // Case-insensitive audit for PG* variables to prevent mixed-case or platform bypasses
  for (const [k, v] of Object.entries(env)) {
    if (v !== undefined && v !== '' && /^PG/i.test(k)) {
      const upperKey = k.toUpperCase();
      if (PROHIBITED_LIBPQ_VARS.includes(upperKey)) {
        throw new Error(
          `Execution rejected: prohibited libpq routing variable '${k}' detected (HOSTILE_LIBPQ_ROUTING_VARIABLE).`,
        );
      }
      if (upperKey === 'PGHOST' && v !== CANONICAL_LOCAL_HOST) {
        throw new Error(
          `Execution rejected: PGHOST must not point to external host (HOSTILE_LIBPQ_ROUTING_VARIABLE). Expected '${CANONICAL_LOCAL_HOST}'.`,
        );
      }
      if (upperKey === 'PGPORT' && String(v) !== String(CANONICAL_LOCAL_PORT)) {
        throw new Error(
          `Execution rejected: PGPORT must match canonical local port (HOSTILE_LIBPQ_ROUTING_VARIABLE). Expected '${CANONICAL_LOCAL_PORT}'.`,
        );
      }
      if (upperKey === 'PGDATABASE' && v !== CANONICAL_LOCAL_DATABASE) {
        throw new Error(
          `Execution rejected: PGDATABASE must match canonical database (HOSTILE_LIBPQ_ROUTING_VARIABLE). Expected '${CANONICAL_LOCAL_DATABASE}'.`,
        );
      }
      if (upperKey === 'PGUSER' && v !== CANONICAL_LOCAL_USER) {
        throw new Error(
          `Execution rejected: PGUSER must match canonical user (HOSTILE_LIBPQ_ROUTING_VARIABLE). Expected '${CANONICAL_LOCAL_USER}'.`,
        );
      }
    }
  }

  // 3. Construct minimal environment containing only safe OS runtime variables
  const SAFE_OS_KEYS = [
    'PATH',
    'PATHEXT',
    'SYSTEMROOT',
    'WINDIR',
    'COMSPEC',
    'HOME',
    'USERPROFILE',
    'USER',
    'SHELL',
    'TMP',
    'TEMP',
    'TMPDIR',
    'LANG',
    'LC_ALL',
  ];

  const isolatedEnv = {};
  for (const [k, v] of Object.entries(env)) {
    if (
      v !== undefined &&
      SAFE_OS_KEYS.some((safeKey) => safeKey.toLowerCase() === k.toLowerCase())
    ) {
      isolatedEnv[k] = v;
    }
  }

  // 4. Inject canonical connection parameters
  isolatedEnv.PGHOST = CANONICAL_LOCAL_HOST;
  isolatedEnv.PGPORT = String(CANONICAL_LOCAL_PORT);
  isolatedEnv.PGDATABASE = CANONICAL_LOCAL_DATABASE;
  isolatedEnv.PGUSER = CANONICAL_LOCAL_USER;
  isolatedEnv.PGPASSWORD = 'postgres';
  isolatedEnv.PGCONNECT_TIMEOUT = '5';
  isolatedEnv.PGSSLMODE = 'disable';
  isolatedEnv.PGOPTIONS = `-c statement_timeout=${STATEMENT_TIMEOUT_MS} -c lock_timeout=${LOCK_TIMEOUT_MS}`;

  return isolatedEnv;
}

/**
 * Constructs an isolated, minimal environment for Docker CLI invocations.
 * Strips all remote daemon routing variables and enforces DOCKER_CONTEXT=default.
 *
 * @param {Record<string, string | undefined>} [env=process.env]
 * @returns {Record<string, string>}
 */
export function buildIsolatedDockerEnvironment(env = process.env) {
  const SAFE_OS_KEYS = [
    'PATH',
    'PATHEXT',
    'SYSTEMROOT',
    'WINDIR',
    'COMSPEC',
    'HOME',
    'USERPROFILE',
    'USER',
    'SHELL',
    'TMP',
    'TEMP',
    'TMPDIR',
    'LANG',
    'LC_ALL',
  ];

  const isolated = {};
  for (const [k, v] of Object.entries(env)) {
    if (
      v !== undefined &&
      SAFE_OS_KEYS.some((safeKey) => safeKey.toLowerCase() === k.toLowerCase())
    ) {
      isolated[k] = v;
    }
  }

  isolated.DOCKER_CONTEXT = 'default';
  return isolated;
}

/**
 * Validates environment variables, repo provenance, and approved commit input.
 * @param {string} [explicitCommitSha]
 * @param {Record<string, string | undefined>} [env=process.env]
 * @param {{ verifyOnly?: boolean, allowLocalDevMock?: boolean }} [options={}]
 * @returns {{ commitSha: string, repository: string, gitRef: string, isCI: boolean, runnerEnv: string }}
 */
export function verifyEnvironmentIdentity(
  explicitCommitSha,
  env = process.env,
  options = {},
) {
  const isCI = env.GITHUB_ACTIONS === 'true';
  const runnerEnv = env.RUNNER_ENVIRONMENT;
  const isVerifyOnly = options.verifyOnly === true;
  const allowLocalDevMock = options.allowLocalDevMock === true;

  // 1. Secrets Hygiene: Rejection of cloud credentials and hostile routing variables
  if (env.SUPABASE_ACCESS_TOKEN) {
    throw new Error(
      'Execution rejected: SUPABASE_ACCESS_TOKEN must not be present in preflight execution.',
    );
  }
  const rawUrl = env.NEXT_PUBLIC_SUPABASE_URL;
  if (rawUrl && rawUrl !== 'http://127.0.0.1:55431') {
    throw new Error(
      'Execution rejected: NEXT_PUBLIC_SUPABASE_URL is set to unauthorized origin (UNAUTHORIZED_SUPABASE_URL_ORIGIN).',
    );
  }
  const rawKey = env.SUPABASE_SERVICE_ROLE_KEY;
  if (rawKey && rawKey !== CANONICAL_LOCAL_SERVICE_ROLE_KEY) {
    throw new Error(
      'Execution rejected: SUPABASE_SERVICE_ROLE_KEY must not be overridden with non-canonical credentials.',
    );
  }

  // Audit for hostile libpq routing variables
  for (const varName of PROHIBITED_LIBPQ_VARS) {
    if (env[varName] !== undefined && env[varName] !== '') {
      throw new Error(
        `Execution rejected: prohibited libpq routing variable '${varName}' detected (HOSTILE_LIBPQ_ROUTING_VARIABLE).`,
      );
    }
  }
  if (env.PGHOST && env.PGHOST !== CANONICAL_LOCAL_HOST) {
    throw new Error(
      'Execution rejected: PGHOST must not point to external host (HOSTILE_LIBPQ_ROUTING_VARIABLE).',
    );
  }
  if (env.PGPORT && String(env.PGPORT) !== String(CANONICAL_LOCAL_PORT)) {
    throw new Error(
      'Execution rejected: PGPORT must match canonical local port (HOSTILE_LIBPQ_ROUTING_VARIABLE).',
    );
  }
  if (env.PGDATABASE && env.PGDATABASE !== CANONICAL_LOCAL_DATABASE) {
    throw new Error(
      'Execution rejected: PGDATABASE must match canonical database (HOSTILE_LIBPQ_ROUTING_VARIABLE).',
    );
  }
  if (env.PGUSER && env.PGUSER !== CANONICAL_LOCAL_USER) {
    throw new Error(
      'Execution rejected: PGUSER must match canonical user (HOSTILE_LIBPQ_ROUTING_VARIABLE).',
    );
  }

  // Audit Docker daemon variables
  if (env.DOCKER_HOST) {
    const dh = env.DOCKER_HOST.trim();
    const isLocalSocket =
      dh === 'unix:///var/run/docker.sock' ||
      dh === '/var/run/docker.sock' ||
      dh.startsWith('npipe://');
    if (!isLocalSocket) {
      throw new Error(
        'Execution rejected: remote or non-local DOCKER_HOST detected (REMOTE_DOCKER_HOST_PROHIBITED).',
      );
    }
  }
  if (env.DOCKER_CONTEXT && env.DOCKER_CONTEXT.trim() !== 'default') {
    throw new Error(
      'Execution rejected: non-default DOCKER_CONTEXT detected (REMOTE_DOCKER_CONTEXT_PROHIBITED).',
    );
  }
  if (env.DOCKER_CONFIG) {
    throw new Error(
      'Execution rejected: custom DOCKER_CONFIG detected (CUSTOM_DOCKER_CONFIG_PROHIBITED).',
    );
  }
  if (env.DOCKER_TLS_VERIFY || env.DOCKER_CERT_PATH || env.DOCKER_TLS) {
    throw new Error(
      'Execution rejected: remote Docker TLS configuration detected (REMOTE_DOCKER_TLS_PROHIBITED).',
    );
  }

  // 2. Execution Context Check
  // In full execution mode, only GitHub-hosted CI is authorized unless explicitly mocked in tests
  if (!isVerifyOnly && !allowLocalDevMock) {
    if (!isCI || runnerEnv !== 'github-hosted') {
      throw new Error(
        `Execution rejected: Candidate A execution is authorized exclusively on a GitHub-hosted CI runner (RUNNER_ENVIRONMENT=github-hosted). Current environment: isCI=${isCI}, runnerEnv=${runnerEnv}`,
      );
    }
  }

  // 3. Repository and Ref Provenance
  const repository =
    env.GITHUB_REPOSITORY ?? (isCI ? '' : 'Rizkybuilds/bisnishub');
  if (isCI && repository !== 'Rizkybuilds/bisnishub') {
    throw new Error(
      'Execution rejected: GITHUB_REPOSITORY is not authorized (UNAUTHORIZED_REPOSITORY_PROVENANCE). Must be Rizkybuilds/bisnishub.',
    );
  }
  const gitRef = env.GITHUB_REF ?? (isCI ? '' : 'refs/heads/main');
  if (isCI && gitRef !== 'refs/heads/main') {
    throw new Error(
      'Execution rejected: GITHUB_REF is not authorized (UNAUTHORIZED_GIT_REF). Must be refs/heads/main.',
    );
  }

  // 4. Commit SHA Validation
  const commitSha =
    explicitCommitSha ?? env.MGBOS_PREFLIGHT_APPROVED_COMMIT_SHA;
  if (!commitSha || !/^[0-9a-f]{40}$/.test(commitSha)) {
    throw new Error(
      'Execution rejected: missing or invalid approved commit SHA (INVALID_COMMIT_SHA_FORMAT). Must be exact 40 lowercase hex characters.',
    );
  }

  // 5. Current Git Revision Check
  const gitRev = spawnSync('git', ['rev-parse', 'HEAD'], {
    cwd: __dirname,
    encoding: 'utf8',
  });
  if (gitRev.status !== 0 || !gitRev.stdout) {
    throw new Error(
      'Execution rejected: failed to determine git HEAD revision.',
    );
  }
  const actualHead = gitRev.stdout.trim();
  if (actualHead !== commitSha) {
    throw new Error(
      'Execution rejected: checked-out git HEAD does not match approved commit SHA (HEAD_COMMIT_MISMATCH).',
    );
  }

  // 6. Local Supabase Configuration Verification
  const configPath = path.join(__dirname, '..', 'supabase', 'config.toml');
  validateSupabaseConfig(configPath, { isVerifyOnly });

  // 7. Absence of remote project-ref
  const tempDir = path.join(__dirname, '..', 'supabase', '.temp');
  if (fs.existsSync(path.join(tempDir, 'project-ref'))) {
    throw new Error(
      'Execution rejected: supabase/.temp/project-ref detected (REMOTE_PROJECT_LINKING_PROHIBITED). Remote project linking is strictly prohibited.',
    );
  }

  return {
    commitSha,
    repository: repository || 'Rizkybuilds/bisnishub',
    gitRef: gitRef || 'refs/heads/main',
    isCI,
    runnerEnv: runnerEnv || 'local',
  };
}

/**
 * Strict RFC 4180 CSV parser for psql --csv output.
 * Enforces:
 * 1. Immediate delimiter or newline following a closing quote (no rogue trailing characters).
 * 2. No unescaped double-quotes inside unquoted fields.
 * 3. Complete closure of all opened quoted fields before EOF.
 *
 * @param {string} csvText
 * @returns {string[][]}
 */
export function parseCsvRows(csvText) {
  const rows = [];
  let currentRow = [];
  let currentField = '';
  let insideQuotes = false;
  let quoteClosed = false;

  for (let i = 0; i < csvText.length; i++) {
    const char = csvText[i];
    const nextChar = csvText[i + 1];

    if (insideQuotes) {
      if (char === '"') {
        if (nextChar === '"') {
          currentField += '"';
          i++; // skip escaped quote
        } else {
          insideQuotes = false;
          quoteClosed = true;
        }
      } else {
        currentField += char;
      }
    } else if (quoteClosed) {
      // In RFC 4180, once a quoted field closes, only a delimiter (',') or line break is allowed.
      if (char === ',') {
        currentRow.push(currentField);
        currentField = '';
        quoteClosed = false;
      } else if (char === '\r' || char === '\n') {
        if (char === '\r' && nextChar === '\n') i++;
        currentRow.push(currentField);
        currentField = '';
        quoteClosed = false;
        if (
          currentRow.length > 0 &&
          !(currentRow.length === 1 && currentRow[0] === '')
        ) {
          rows.push(currentRow);
        }
        currentRow = [];
      } else {
        throw new Error(
          `CSV parser error: unexpected character after closing quote at index ${i} (UNEXPECTED_CHAR_AFTER_QUOTE). Expected delimiter or newline.`,
        );
      }
    } else {
      // Unquoted field parsing
      if (char === '"') {
        if (currentField.length === 0) {
          insideQuotes = true;
        } else {
          throw new Error(
            `CSV parser error: unescaped quote inside unquoted field at index ${i} (UNESCAPED_QUOTE_IN_FIELD).`,
          );
        }
      } else if (char === ',') {
        currentRow.push(currentField);
        currentField = '';
      } else if (char === '\r' || char === '\n') {
        if (char === '\r' && nextChar === '\n') i++;
        currentRow.push(currentField);
        currentField = '';
        if (
          currentRow.length > 0 &&
          !(currentRow.length === 1 && currentRow[0] === '')
        ) {
          rows.push(currentRow);
        }
        currentRow = [];
      } else {
        currentField += char;
      }
    }
  }

  if (insideQuotes) {
    throw new Error(
      'CSV parser error: unclosed quote at end of input (UNCLOSED_QUOTE_AT_EOF).',
    );
  }

  if (currentField !== '' || currentRow.length > 0 || quoteClosed) {
    currentRow.push(currentField);
    if (
      currentRow.length > 0 &&
      !(currentRow.length === 1 && currentRow[0] === '')
    ) {
      rows.push(currentRow);
    }
  }

  return rows;
}

/**
 * Standalone Docker container identity, port-binding, and isolation verification.
 * Inspects the disposable Supabase database container via fixed-argument docker inspect,
 * asserting expected container name, project label, 127.0.0.1:55432 loopback binding,
 * absence of persistent external host bind mounts, and fresh container lifecycle.
 *
 * @param {string | number} preStartupEpoch
 * @param {{
 *   mockDockerExecutor?: (args: string[]) => string,
 *   containerName?: string,
 *   expectedProjectId?: string,
 *   canonicalPort?: number,
 * }} [options={}]
 * @returns {{
 *   isDockerVerified: boolean,
 *   containerId: string,
 *   containerName: string,
 *   projectId: string,
 *   hostIp: string,
 *   hostPort: number,
 *   internalPort: number,
 *   startedAt: string,
 *   startedAtEpoch: number
 * }}
 */
export function verifyDockerContainerIdentity(preStartupEpoch, options = {}) {
  const expectedPreEpoch = Number(preStartupEpoch);
  if (!preStartupEpoch || isNaN(expectedPreEpoch) || expectedPreEpoch <= 0) {
    throw new Error(
      'Docker verification failed: missing or invalid preStartupEpoch (INVALID_PRE_STARTUP_EPOCH). Pre-startup epoch timestamp must be recorded prior to database startup.',
    );
  }

  const env = options.env ?? process.env;

  // 1. Audit Docker environment variables for remote targeting
  if (env.DOCKER_HOST) {
    const dh = env.DOCKER_HOST.trim();
    const isLocalSocket =
      dh === 'unix:///var/run/docker.sock' ||
      dh === '/var/run/docker.sock' ||
      dh.startsWith('npipe://');
    if (!isLocalSocket) {
      throw new Error(
        'Docker verification failed: remote or non-local DOCKER_HOST detected (REMOTE_DOCKER_HOST_PROHIBITED).',
      );
    }
  }

  if (env.DOCKER_CONTEXT && env.DOCKER_CONTEXT.trim() !== 'default') {
    throw new Error(
      'Docker verification failed: non-default DOCKER_CONTEXT detected (REMOTE_DOCKER_CONTEXT_PROHIBITED).',
    );
  }

  if (env.DOCKER_CONFIG) {
    throw new Error(
      'Docker verification failed: custom DOCKER_CONFIG detected (CUSTOM_DOCKER_CONFIG_PROHIBITED).',
    );
  }

  if (env.DOCKER_TLS_VERIFY || env.DOCKER_CERT_PATH || env.DOCKER_TLS) {
    throw new Error(
      'Docker verification failed: remote Docker TLS configuration detected (REMOTE_DOCKER_TLS_PROHIBITED).',
    );
  }

  const containerName = options.containerName ?? CANONICAL_CONTAINER_NAME;
  const expectedProjectId =
    options.expectedProjectId ?? CANONICAL_LOCAL_PROJECT_ID;
  const canonicalPort = options.canonicalPort ?? CANONICAL_LOCAL_PORT;

  let stdout = '';
  const dockerArgs = [
    '--context=default',
    'inspect',
    '--type=container',
    containerName,
  ];
  if (typeof options.mockDockerExecutor === 'function') {
    stdout = options.mockDockerExecutor(dockerArgs);
  } else {
    // Fixed argument array execution with isolated Docker environment - no shell interpolation
    const isolatedDockerEnv = buildIsolatedDockerEnvironment(env);
    const execResult = spawnSync('docker', dockerArgs, {
      env: isolatedDockerEnv,
      encoding: 'utf8',
      maxBuffer: 10 * 1024 * 1024,
    });

    if (execResult.error) {
      throw new Error(
        'Docker inspection failed: unable to spawn docker process (DOCKER_SPAWN_ERROR).',
      );
    }
    if (execResult.status !== 0) {
      throw new Error(
        `Docker inspection failed: container inspect returned non-zero exit status (DOCKER_INSPECT_FAILURE). ExitCode: ${execResult.status}`,
      );
    }
    stdout = execResult.stdout;
  }

  // 1. Parse JSON inspection payload
  let inspectList;
  try {
    inspectList = JSON.parse(stdout);
  } catch {
    throw new Error(
      'Docker inspection failed: malformed JSON returned by docker inspect (INVALID_DOCKER_INSPECT_PAYLOAD).',
    );
  }

  if (!Array.isArray(inspectList) || inspectList.length !== 1) {
    throw new Error(
      'Docker inspection failed: expected inspect list with exactly one container (INVALID_DOCKER_INSPECT_PAYLOAD).',
    );
  }

  const container = inspectList[0];

  // Validate container ID format (64-character lowercase hex string)
  if (
    !container.Id ||
    typeof container.Id !== 'string' ||
    !/^[0-9a-f]{64}$/.test(container.Id)
  ) {
    throw new Error(
      'Docker inspection failed: missing or invalid container ID (INVALID_CONTAINER_ID).',
    );
  }

  // 2. Container running state
  if (!container.State || container.State.Running !== true) {
    throw new Error(
      'Docker inspection failed: database container is not running (CONTAINER_NOT_RUNNING).',
    );
  }

  // 3. Container identity & project association
  const rawName = container.Name ?? '';
  const normalizedName = rawName.startsWith('/') ? rawName.slice(1) : rawName;
  if (normalizedName !== containerName) {
    throw new Error(
      'Docker inspection failed: container name mismatch (CONTAINER_NAME_MISMATCH).',
    );
  }

  const projectLabel = container.Config?.Labels?.['com.supabase.cli.project'];
  if (!projectLabel || projectLabel !== expectedProjectId) {
    throw new Error(
      'Docker inspection failed: project label mismatch (PROJECT_ASSOCIATION_MISMATCH).',
    );
  }

  // 4. Actual Port Publishing & Loopback Host Binding
  const portKey = `${CANONICAL_CONTAINER_INTERNAL_PORT}/tcp`;
  const portBindings =
    container.NetworkSettings?.Ports?.[portKey] ??
    container.HostConfig?.PortBindings?.[portKey];

  if (!Array.isArray(portBindings) || portBindings.length !== 1) {
    throw new Error(
      'Docker inspection failed: expected exactly one port binding for database (AMBIGUOUS_OR_MISSING_PORT_BINDING).',
    );
  }

  const binding = portBindings[0];
  const hostIp = binding?.HostIp;
  const hostPort = Number(binding?.HostPort);

  // Must be loopback: 127.0.0.1 or ::1
  if (hostIp !== '127.0.0.1' && hostIp !== '::1') {
    throw new Error(
      'Docker inspection failed: non-loopback host binding detected (NON_LOOPBACK_HOST_BINDING). Database port must bind exclusively to 127.0.0.1.',
    );
  }

  // Must match canonical local port: 55432
  if (hostPort !== canonicalPort) {
    throw new Error(
      'Docker inspection failed: host port does not match expected canonical port (UNEXPECTED_HOST_PORT).',
    );
  }

  // Verify no unexpected external port exposures exist on the database container
  const allPorts = container.NetworkSettings?.Ports ?? {};
  for (const [exposedPort, bindings] of Object.entries(allPorts)) {
    if (
      exposedPort !== portKey &&
      Array.isArray(bindings) &&
      bindings.length > 0
    ) {
      for (const b of bindings) {
        if (b.HostIp && b.HostIp !== '127.0.0.1' && b.HostIp !== '::1') {
          throw new Error(
            'Docker inspection failed: extraneous non-loopback port exposed (NON_LOOPBACK_HOST_BINDING).',
          );
        }
      }
    }
  }

  // 5. Reject Unexpected Persistent External Mounts & Pre-existing Container State
  const mounts = container.Mounts ?? [];
  for (const m of mounts) {
    if (m.Destination === '/var/lib/postgresql/data') {
      if (m.Type === 'bind') {
        throw new Error(
          'Docker inspection failed: host bind mount detected on postgres data directory (PERSISTENT_BIND_MOUNT_DETECTED). Disposable contract requires ephemeral storage.',
        );
      }
    }
  }

  // Container start time must post-date preStartupEpoch
  const startedAtStr = container.State?.StartedAt;
  const startedAtDate = new Date(startedAtStr);
  const startedAtEpoch = Math.floor(startedAtDate.getTime() / 1000);
  if (isNaN(startedAtEpoch) || startedAtEpoch <= 0) {
    throw new Error(
      'Docker inspection failed: unable to parse container start timestamp (INVALID_CONTAINER_START_TIME).',
    );
  }

  if (startedAtEpoch < expectedPreEpoch) {
    throw new Error(
      'Docker inspection failed: container started prior to workflow execution epoch (PRE_EXISTING_CONTAINER_DETECTED). Stale container violates disposable isolation.',
    );
  }

  return {
    isDockerVerified: true,
    containerId: container.Id,
    containerName: normalizedName,
    projectId: projectLabel,
    hostIp,
    hostPort,
    internalPort: CANONICAL_CONTAINER_INTERNAL_PORT,
    startedAt: startedAtStr,
    startedAtEpoch,
  };
}

/**
 * Standalone read-only identity and freshness probe.
 * Verifies that the connected session is indeed postgres@postgres on the container internal port,
 * and that pg_postmaster_start_time strictly post-dates the pre-startup epoch.
 *
 * @param {Record<string, string>} psqlEnv
 * @param {string | number} preStartupEpoch
 * @param {{ mockExecutor?: (sql: string, env: Record<string, string>) => string }} [options={}]
 * @returns {{
 *   isFreshInstanceConfirmed: boolean,
 *   currentDatabase: string,
 *   currentUser: string,
 *   sessionUser: string,
 *   serverAddr: string,
 *   serverPort: number,
 *   postmasterStartTime: string,
 *   postmasterEpoch: number
 * }}
 */
export function executeIdentityAndFreshnessProbe(
  psqlEnv,
  preStartupEpoch,
  options = {},
) {
  if (
    !preStartupEpoch ||
    isNaN(Number(preStartupEpoch)) ||
    Number(preStartupEpoch) <= 0
  ) {
    throw new Error(
      'Identity probe rejected: missing or invalid preStartupEpoch (INVALID_PRE_STARTUP_EPOCH). Pre-startup epoch timestamp must be recorded prior to database startup.',
    );
  }

  if (!psqlEnv || typeof psqlEnv !== 'object') {
    throw new Error(
      'Identity probe rejected: missing or invalid psqlEnv parameter (INVALID_PSQL_ENV).',
    );
  }

  // Audit psqlEnv to ensure connection isolation
  for (const varName of PROHIBITED_LIBPQ_VARS) {
    if (psqlEnv[varName] !== undefined && psqlEnv[varName] !== '') {
      throw new Error(
        `Identity probe rejected: prohibited libpq routing variable '${varName}' detected in execution environment (HOSTILE_LIBPQ_ROUTING_VARIABLE).`,
      );
    }
  }
  if (psqlEnv.PGHOST && psqlEnv.PGHOST !== CANONICAL_LOCAL_HOST) {
    throw new Error(
      'Identity probe rejected: PGHOST must match canonical local host (HOSTILE_LIBPQ_ROUTING_VARIABLE).',
    );
  }
  if (
    psqlEnv.PGPORT &&
    String(psqlEnv.PGPORT) !== String(CANONICAL_LOCAL_PORT)
  ) {
    throw new Error(
      'Identity probe rejected: PGPORT must match canonical local port (HOSTILE_LIBPQ_ROUTING_VARIABLE).',
    );
  }
  if (psqlEnv.PGDATABASE && psqlEnv.PGDATABASE !== CANONICAL_LOCAL_DATABASE) {
    throw new Error(
      'Identity probe rejected: PGDATABASE must match canonical database (HOSTILE_LIBPQ_ROUTING_VARIABLE).',
    );
  }
  if (psqlEnv.PGUSER && psqlEnv.PGUSER !== CANONICAL_LOCAL_USER) {
    throw new Error(
      'Identity probe rejected: PGUSER must match canonical user (HOSTILE_LIBPQ_ROUTING_VARIABLE).',
    );
  }

  const expectedPreEpoch = Number(preStartupEpoch);
  const probeSql =
    'SELECT current_database(), current_user, session_user, inet_server_addr()::text, inet_server_port(), pg_postmaster_start_time()::text;';

  let stdout = '';
  if (typeof options.mockExecutor === 'function') {
    stdout = options.mockExecutor(probeSql, psqlEnv);
  } else {
    const psqlArgs = [
      '-h',
      CANONICAL_LOCAL_HOST,
      '-p',
      String(CANONICAL_LOCAL_PORT),
      '-U',
      CANONICAL_LOCAL_USER,
      '-d',
      CANONICAL_LOCAL_DATABASE,
      '-v',
      'ON_ERROR_STOP=1',
      '-X',
      '--csv',
      '-c',
      probeSql,
    ];

    const result = spawnSync('psql', psqlArgs, {
      env: psqlEnv,
      encoding: 'utf8',
      maxBuffer: 1024 * 1024,
    });

    if (result.error) {
      throw new Error(
        'Identity probe failed: unable to spawn psql process (PSQL_SPAWN_ERROR).',
      );
    }
    if (result.status !== 0) {
      throw new Error(
        `Identity probe failed: psql exited with code ${result.status} (PSQL_EXIT_NON_ZERO).`,
      );
    }
    stdout = result.stdout;
  }

  const rows = parseCsvRows(stdout);
  if (rows.length < 2) {
    throw new Error(
      'Identity probe failed: unexpected row count returned from identity probe (INVALID_PROBE_ROW_COUNT).',
    );
  }

  const [headers, dataRow] = rows;
  const expectedHeaders = [
    'current_database',
    'current_user',
    'session_user',
    'inet_server_addr',
    'inet_server_port',
    'pg_postmaster_start_time',
  ];

  if (
    headers.length !== expectedHeaders.length ||
    !expectedHeaders.every((h, idx) => headers[idx] === h)
  ) {
    throw new Error(
      'Identity probe failed: unexpected headers from identity probe (INVALID_PROBE_HEADERS).',
    );
  }

  const record = {};
  headers.forEach((h, i) => {
    record[h] = dataRow[i];
  });

  // 1. Assert database identity
  if (record.current_database !== 'postgres') {
    throw new Error(
      "Identity probe assertion failed: current_database must be 'postgres' (UNEXPECTED_DATABASE_NAME).",
    );
  }

  // 2. Assert connected user
  if (record.current_user !== 'postgres') {
    throw new Error(
      "Identity probe assertion failed: current_user must be 'postgres' (UNEXPECTED_CURRENT_USER).",
    );
  }

  // 3. Assert session user
  if (record.session_user !== 'postgres') {
    throw new Error(
      "Identity probe assertion failed: session_user must be 'postgres' (UNEXPECTED_SESSION_USER).",
    );
  }

  // 4. Assert server port matches container internal port (5432 or host-mapped 55432)
  const portNum = Number(record.inet_server_port);
  if (portNum !== 5432 && portNum !== CANONICAL_LOCAL_PORT) {
    throw new Error(
      'Identity probe assertion failed: server port does not match expected container internal port or local port (PORT_MISMATCH).',
    );
  }

  // 5. Assert postmaster start time post-dates pre-startup epoch
  const postmasterDate = new Date(record.pg_postmaster_start_time);
  const postmasterEpoch = Math.floor(postmasterDate.getTime() / 1000);
  if (isNaN(postmasterEpoch) || postmasterEpoch <= 0) {
    throw new Error(
      'Identity probe assertion failed: unable to parse pg_postmaster_start_time (INVALID_POSTMASTER_START_TIME).',
    );
  }

  if (postmasterEpoch < expectedPreEpoch) {
    throw new Error(
      'Identity probe assertion failed: postmaster start time does not post-date pre-startup epoch (STALE_INSTANCE_DETECTED). Stale or pre-existing database instance detected.',
    );
  }

  return {
    isFreshInstanceConfirmed: true,
    currentDatabase: record.current_database,
    currentUser: record.current_user,
    sessionUser: record.session_user,
    serverAddr: record.inet_server_addr,
    serverPort: portNum,
    postmasterStartTime: record.pg_postmaster_start_time,
    postmasterEpoch,
  };
}

/**
 * Organizes parsed CSV rows into structured module objects by strict header detection.
 * Enforces sequential module arrival, row-width checks, command-status filtering, and zero missing modules.
 * @param {string[][]} rows
 * @returns {Record<string, Record<string, string>[]>}
 */
export function groupRowsByModule(rows) {
  const result = {};
  const modulesObserved = [];
  let currentModuleIdx = -1;
  let currentModuleSpec = null;
  let currentHeaders = null;

  for (let rIdx = 0; rIdx < rows.length; rIdx++) {
    const row = rows[rIdx];

    // Filter out standard psql command status outputs (e.g. BEGIN, SET, ROLLBACK)
    if (
      row.length === 1 &&
      /^(BEGIN|COMMIT|ROLLBACK|SET|SHOW)/i.test(row[0].trim())
    ) {
      continue;
    }

    // Check if this row is a module header by matching against CANONICAL_MODULE_SPECS
    const matchedSpecIdx = CANONICAL_MODULE_SPECS.findIndex((spec) => {
      if (row.length !== spec.expectedHeaders.length) return false;
      return (
        row.includes(spec.signatureCol) &&
        row.every((col, i) => col === spec.expectedHeaders[i])
      );
    });

    if (matchedSpecIdx !== -1) {
      const spec = CANONICAL_MODULE_SPECS[matchedSpecIdx];

      // Enforce strict sequential order: must be next expected index (currentModuleIdx + 1)
      if (matchedSpecIdx !== currentModuleIdx + 1) {
        if (modulesObserved.includes(spec.key)) {
          throw new Error(
            `Parser error: duplicate module header detected for ${spec.key} at row ${rIdx + 1} (DUPLICATE_MODULE_HEADER).`,
          );
        }
        throw new Error(
          `Parser error: out-of-order or skipped module header (OUT_OF_ORDER_MODULE_HEADER). Expected index ${currentModuleIdx + 1} (${CANONICAL_MODULE_SPECS[currentModuleIdx + 1]?.key}), got index ${matchedSpecIdx} (${spec.key}) at row ${rIdx + 1}.`,
        );
      }

      currentModuleIdx = matchedSpecIdx;
      currentModuleSpec = spec;
      currentHeaders = row;
      modulesObserved.push(spec.key);
      result[spec.key] = [];
      continue;
    }

    // If we have not matched any header yet, and row is not command status, reject
    if (!currentModuleSpec || !currentHeaders) {
      throw new Error(
        `Parser error: unexpected data row before first canonical module header at row ${rIdx + 1} (UNEXPECTED_PRE_HEADER_ROW).`,
      );
    }

    // Check row width against the current module's expected headers
    if (row.length !== currentModuleSpec.expectedHeaders.length) {
      throw new Error(
        `Parser error: row width mismatch in ${currentModuleSpec.key} at row ${rIdx + 1} (ROW_WIDTH_MISMATCH). Expected ${currentModuleSpec.expectedHeaders.length} columns, got ${row.length} columns.`,
      );
    }

    // Map row to record object
    const record = {};
    currentHeaders.forEach((colName, colIdx) => {
      record[colName] = row[colIdx];
    });
    result[currentModuleSpec.key].push(record);
  }

  // Assert that exactly all 11 modules were observed
  if (modulesObserved.length !== CANONICAL_MODULE_SPECS.length) {
    const missing = CANONICAL_MODULE_SPECS.filter(
      (s) => !modulesObserved.includes(s.key),
    ).map((s) => s.key);
    throw new Error(
      `Parser error: incomplete catalog execution (INCOMPLETE_CATALOG_EXECUTION). Missing ${missing.length} module headers: ${missing.join(', ')}.`,
    );
  }

  return result;
}

/**
 * Evaluates Q8 probes against deterministic baseline expectations.
 * Rejects duplicate, unexpected, or missing probes fail-closed.
 * @param {Record<string, string>[]} q8Rows
 * @returns {{ evaluations: Record<string, any>, disposition: string }}
 */
export function evaluateQ8Probes(q8Rows) {
  const EXPECTED_PROBES = {
    'PRB-BASE-01': 'EXPECTED_BASELINE_EXPOSURE',
    'PRB-BASE-02': 'PRESENT_BODY_SEMANTICS_UNVERIFIED_BY_CATALOG',
    'PRB-TGT-01': 'NOT_PRESENT',
    'PRB-TGT-02': 'NOT_PRESENT',
    'PRB-TGT-03': 'NOT_PRESENT',
  };

  const expectedIds = Object.keys(EXPECTED_PROBES);
  const observedIds = q8Rows.map((r) => r.probe_id);

  // Check for duplicate probe IDs
  const seen = new Set();
  for (const id of observedIds) {
    if (seen.has(id)) {
      throw new Error(
        'Probe validation error: duplicate probe_id detected (DUPLICATE_PROBE_ID).',
      );
    }
    seen.add(id);
  }

  // Check for unexpected probe IDs
  for (const id of observedIds) {
    if (!expectedIds.includes(id)) {
      throw new Error(
        'Probe validation error: unexpected probe_id observed (UNEXPECTED_PROBE_ID).',
      );
    }
  }

  const evaluations = {};
  let allMatched = true;

  for (const [probeId, expectedVal] of Object.entries(EXPECTED_PROBES)) {
    const row = q8Rows.find((r) => r.probe_id === probeId);
    if (!row) {
      evaluations[probeId] = {
        raw_observed_result: 'NOT_FOUND_IN_OUTPUT',
        baseline_conformance: 'UNEXPECTED_STATE',
        oracle_guidance: 'Probe row missing from Q8 result set.',
      };
      allMatched = false;
      continue;
    }

    const observed = row.observed_discovery_result;
    const matches = observed === expectedVal;
    if (!matches) allMatched = false;

    evaluations[probeId] = {
      probe_category: row.probe_category,
      probe_description: row.probe_description,
      raw_observed_result: observed,
      baseline_conformance: matches
        ? 'MATCHES_BASELINE_EXPECTATION'
        : 'UNEXPECTED_STATE',
      oracle_guidance: row.oracle_governance_guidance,
    };
  }

  const disposition = allMatched
    ? 'BASELINE_CONFIRMED_UNMIGRATED'
    : 'BASELINE_MISMATCH_FAIL';

  return { evaluations, disposition };
}

/**
 * Filters catalog results against approved per-module allowlists to prevent leakage.
 * @param {Record<string, Record<string, string>[]>} rawModules
 * @returns {Record<string, Record<string, string>[]>}
 */
export function applyOutputAllowlist(rawModules) {
  const sanitized = {};
  for (const [modKey, rows] of Object.entries(rawModules)) {
    const allowedCols = OUTPUT_ALLOWLISTS[modKey] || [];
    sanitized[modKey] = rows.map((row) => {
      const filteredRow = {};
      for (const col of allowedCols) {
        if (Object.prototype.hasOwnProperty.call(row, col)) {
          filteredRow[col] = row[col];
        }
      }
      return filteredRow;
    });
  }
  return sanitized;
}

/**
 * Escapes characters for safe Markdown table cell rendering.
 * @param {any} val
 * @returns {string}
 */
export function escapeMarkdownCell(val) {
  if (val === null || val === undefined) return '';
  return String(val)
    .replace(/\\/g, '\\\\')
    .replace(/\|/g, '\\|')
    .replace(/\r?\n/g, ' ')
    .trim();
}

/**
 * Constructs the canonical evidence payload structure with strict freshness attestation.
 * In --verify-only mode, is_fresh_instance_confirmed is unconditionally "NOT_EVALUATED_OFFLINE_VERIFY_ONLY".
 * In live execution, it records the verified boolean result from executeIdentityAndFreshnessProbe.
 *
 * @param {object} params
 * @returns {object}
 */
export function createEvidencePayload({
  envIdentity,
  dockerAttestation = null,
  identityAttestation = null,
  isVerifyOnly = false,
  sanitizedModules = {},
  evaluations = {},
  disposition = 'STATIC_VERIFIED_ONLY',
  jobStartTime = new Date(),
}) {
  return {
    provenance: {
      workflow_run_id: process.env.GITHUB_RUN_ID ?? 'local-manual',
      repository: envIdentity?.repository ?? 'Rizkybuilds/bisnishub',
      git_ref: envIdentity?.gitRef ?? 'refs/heads/main',
      target_commit_sha: envIdentity?.commitSha ?? 'UNKNOWN',
      execution_timestamp: jobStartTime.toISOString(),
      candidate: 'CANDIDATE_A_CI_LOCAL',
    },
    environment_identity: {
      host_endpoint: `${CANONICAL_LOCAL_HOST}:${CANONICAL_LOCAL_PORT}`,
      database_name:
        identityAttestation?.currentDatabase ?? CANONICAL_LOCAL_DATABASE,
      current_user:
        identityAttestation?.currentUser ??
        (isVerifyOnly ? 'NOT_EVALUATED_OFFLINE_VERIFY_ONLY' : 'NOT_EVALUATED'),
      session_user:
        identityAttestation?.sessionUser ??
        (isVerifyOnly ? 'NOT_EVALUATED_OFFLINE_VERIFY_ONLY' : 'NOT_EVALUATED'),
      server_port:
        identityAttestation?.serverPort ??
        (isVerifyOnly ? 'NOT_EVALUATED_OFFLINE_VERIFY_ONLY' : 'NOT_EVALUATED'),
      postmaster_start_time:
        identityAttestation?.postmasterStartTime ??
        (isVerifyOnly ? 'NOT_EVALUATED_OFFLINE_VERIFY_ONLY' : 'NOT_EVALUATED'),
      docker_verification: isVerifyOnly
        ? 'NOT_EVALUATED_OFFLINE_VERIFY_ONLY'
        : {
            is_docker_verified: dockerAttestation?.isDockerVerified ?? false,
            container_name: dockerAttestation?.containerName ?? 'NOT_EVALUATED',
            project_id: dockerAttestation?.projectId ?? 'NOT_EVALUATED',
            host_binding: dockerAttestation
              ? `${dockerAttestation.hostIp}:${dockerAttestation.hostPort}`
              : 'NOT_EVALUATED',
            internal_port: dockerAttestation?.internalPort ?? 0,
            started_at: dockerAttestation?.startedAt ?? 'NOT_EVALUATED',
          },
      is_fresh_instance_confirmed: isVerifyOnly
        ? 'NOT_EVALUATED_OFFLINE_VERIFY_ONLY'
        : (identityAttestation?.isFreshInstanceConfirmed ?? false),
    },
    raw_module_results: sanitizedModules,
    probe_evaluations: evaluations,
    derived_status: {
      preflight_disposition: isVerifyOnly
        ? 'STATIC_VERIFIED_ONLY'
        : disposition,
      r5_security_disclaimer:
        'BASELINE_OBSERVATION_ONLY_DOES_NOT_PROVE_R5_SECURITY_OR_CONCURRENCY',
    },
  };
}

/**
 * Generates structured JSON and Markdown summary evidence files using sanitized allowlists.
 * @param {any} evidencePayload
 * @param {string} outputDir
 */
export function writeEvidenceArtifacts(
  evidencePayload,
  outputDir = DEFAULT_EVIDENCE_DIR,
) {
  fs.mkdirSync(outputDir, { recursive: true });

  const jsonPath = path.join(outputDir, 'catalog-preflight-report.json');
  fs.writeFileSync(jsonPath, JSON.stringify(evidencePayload, null, 2), 'utf8');

  const mdRows = Object.entries(evidencePayload.probe_evaluations).map(
    ([id, evalData]) =>
      `| **${escapeMarkdownCell(id)}** | ${escapeMarkdownCell(evalData.probe_category)} | \`${escapeMarkdownCell(evalData.raw_observed_result)}\` | **${escapeMarkdownCell(evalData.baseline_conformance)}** | ${escapeMarkdownCell(evalData.oracle_guidance)} |`,
  );

  const modCounts = Object.entries(evidencePayload.raw_module_results).map(
    ([mod, rows]) => `- **${mod.toUpperCase()}:** ${rows.length} rows recorded`,
  );

  const dockerStatus =
    typeof evidencePayload.environment_identity.docker_verification === 'object'
      ? evidencePayload.environment_identity.docker_verification
          ?.is_docker_verified
        ? 'CONFIRMED_DISPOSABLE_LOOPBACK'
        : 'FAILED'
      : String(evidencePayload.environment_identity.docker_verification);

  const mdPath = path.join(outputDir, 'catalog-preflight-summary.md');
  const mdContent = [
    '# MGBOS R5 D06 Catalog Preflight Summary Report',
    '',
    `- **Execution Timestamp:** ${evidencePayload.provenance.execution_timestamp}`,
    `- **Verified Commit SHA:** \`${evidencePayload.provenance.target_commit_sha}\``,
    `- **Preflight Disposition:** **${evidencePayload.derived_status.preflight_disposition}**`,
    `- **Docker Container Verified:** \`${dockerStatus}\``,
    `- **Fresh Instance Confirmed:** \`${evidencePayload.environment_identity.is_fresh_instance_confirmed}\``,
    `- **Disclaimer:** ${evidencePayload.derived_status.r5_security_disclaimer}`,
    '',
    '## Q8 Diagnostic Probes Summary',
    '',
    '| Probe ID | Category | Observed Result | Baseline Conformance | Guidance |',
    '| :--- | :--- | :--- | :--- | :--- |',
    ...mdRows,
    '',
    '## Module Result Counts',
    '',
    ...modCounts,
    '',
  ].join('\n');

  fs.writeFileSync(mdPath, mdContent, 'utf8');
}

/**
 * Main execution entrypoint.
 */
export async function main() {
  const jobStartTime = new Date();
  const args = process.argv.slice(2);
  let verifyOnly = false;
  let commitArg = null;

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--verify-only') {
      verifyOnly = true;
    } else if (arg === '--approved-commit-sha') {
      i++;
      if (i >= args.length || !args[i]) {
        console.error(
          'FATAL: --approved-commit-sha requires a 40-hex commit SHA argument (MISSING_COMMIT_SHA_ARGUMENT).',
        );
        process.exit(1);
      }
      commitArg = args[i];
    } else {
      console.error(
        'FATAL: Unrecognized argument. Only --verify-only and --approved-commit-sha <sha> are allowed (UNRECOGNIZED_CLI_ARGUMENT).',
      );
      process.exit(1);
    }
  }

  console.log('--- MGBOS R5 D06 Catalog Preflight Execution Runner ---');

  // 1. Static SQL Integrity Check
  console.log('1. Verifying SQL asset integrity...');
  const sqlIntegrity = verifySqlAssetIntegrity();
  console.log(
    `   SQL asset verified: ${sqlIntegrity.byteSize} bytes, SHA-256: ${sqlIntegrity.sha256}`,
  );

  // 2. Environment & Revision Check
  console.log('2. Verifying environment identity and commit authorization...');
  const envIdentity = verifyEnvironmentIdentity(commitArg, process.env, {
    verifyOnly,
  });
  console.log(
    `   Provenance confirmed: repo=${envIdentity.repository}, commit=${envIdentity.commitSha}, runner=${envIdentity.runnerEnv}`,
  );

  if (verifyOnly) {
    console.log(
      'Static verification complete (--verify-only mode). No database connection opened.',
    );
    console.log(
      '   is_fresh_instance_confirmed: "NOT_EVALUATED_OFFLINE_VERIFY_ONLY"',
    );
    return;
  }

  // 3. Docker Container Identity & Isolation Verification
  const preStartupEpoch = process.env.MGBOS_PREFLIGHT_PRE_STARTUP_EPOCH;
  console.log(
    '3. Verifying Docker container identity, loopback binding, and disposable isolation...',
  );
  const dockerAttestation = verifyDockerContainerIdentity(preStartupEpoch);
  console.log(
    `   Docker container verified: ${dockerAttestation.containerName} (${dockerAttestation.projectId}), bound to ${dockerAttestation.hostIp}:${dockerAttestation.hostPort}`,
  );

  // 4. Database Session Execution via psql
  console.log(
    `4. Connecting to local disposable database (${CANONICAL_LOCAL_HOST}:${CANONICAL_LOCAL_PORT})...`,
  );

  const psqlEnv = buildIsolatedPsqlEnvironment(process.env);

  // 4a. Execute Standalone Database Identity & Freshness Probe
  console.log(
    '   Executing database identity and freshness attestation probe...',
  );
  const identityAttestation = executeIdentityAndFreshnessProbe(
    psqlEnv,
    preStartupEpoch,
  );
  console.log(
    `   Identity confirmed: db=${identityAttestation.currentDatabase}, user=${identityAttestation.currentUser}, port=${identityAttestation.serverPort}, started=${identityAttestation.postmasterStartTime}`,
  );

  // 4b. Execute Authoritative Q1–Q8 Catalog Preflight Package
  console.log(
    '   Executing authoritative Q1–Q8 catalog preflight SQL package...',
  );
  const psqlArgs = [
    '-h',
    CANONICAL_LOCAL_HOST,
    '-p',
    String(CANONICAL_LOCAL_PORT),
    '-U',
    CANONICAL_LOCAL_USER,
    '-d',
    CANONICAL_LOCAL_DATABASE,
    '-v',
    'ON_ERROR_STOP=1',
    '-X',
    '--csv',
    '-f',
    SQL_ASSET_PATH,
  ];

  const execResult = spawnSync('psql', psqlArgs, {
    env: psqlEnv,
    encoding: 'utf8',
    maxBuffer: 32 * 1024 * 1024,
  });

  if (execResult.error) {
    console.error(
      `Preflight execution error during psql process spawn. Category: PROCESS_SPAWN_ERROR`,
    );
    throw new Error('Database execution failed to launch psql process.');
  }

  if (execResult.status !== 0) {
    console.error(
      `Preflight execution failed. Category: SQL_EXECUTION_FAILURE, ExitCode: ${execResult.status}`,
    );
    throw new Error(
      `psql preflight execution failed with exit code ${execResult.status}.`,
    );
  }

  // 5. Parse Results & Evaluate
  console.log('5. Parsing and grouping catalog results...');
  const parsedRows = parseCsvRows(execResult.stdout);
  const rawModules = groupRowsByModule(parsedRows);
  const { evaluations, disposition } = evaluateQ8Probes(rawModules.q8);
  const sanitizedModules = applyOutputAllowlist(rawModules);

  // 6. Structure Final Evidence Payload
  const evidencePayload = createEvidencePayload({
    envIdentity,
    dockerAttestation,
    identityAttestation,
    isVerifyOnly: false,
    sanitizedModules,
    evaluations,
    disposition,
    jobStartTime,
  });

  // 7. Output Artifacts
  console.log('6. Writing sanitized evidence artifacts...');
  writeEvidenceArtifacts(evidencePayload);
  console.log(`Preflight execution finished. Disposition: ${disposition}`);

  if (disposition !== 'BASELINE_CONFIRMED_UNMIGRATED') {
    process.exit(2);
  }
}

// Auto-run if executed as script
if (
  process.argv[1] &&
  url.fileURLToPath(import.meta.url) === path.resolve(process.argv[1])
) {
  main().catch((err) => {
    console.error('FATAL:', err.message);
    process.exit(1);
  });
}
