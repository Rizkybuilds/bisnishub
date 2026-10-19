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
export const CANONICAL_LOCAL_SERVICE_ROLE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';
export const STATEMENT_TIMEOUT_MS = 15000;
export const LOCK_TIMEOUT_MS = 5000;

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
    name: 'MODULE Q5C: SEQUENCE PRIVILEGES IN SCHEMA app',
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

  // 1. Secrets Hygiene: Rejection of cloud credentials
  if (env.SUPABASE_ACCESS_TOKEN) {
    throw new Error(
      'Execution rejected: SUPABASE_ACCESS_TOKEN must not be present in preflight execution.',
    );
  }
  const rawUrl = env.NEXT_PUBLIC_SUPABASE_URL;
  if (rawUrl && rawUrl !== 'http://127.0.0.1:55431') {
    throw new Error(
      `Execution rejected: NEXT_PUBLIC_SUPABASE_URL is set to unauthorized origin: ${rawUrl}`,
    );
  }
  const rawKey = env.SUPABASE_SERVICE_ROLE_KEY;
  if (rawKey && rawKey !== CANONICAL_LOCAL_SERVICE_ROLE_KEY) {
    throw new Error(
      'Execution rejected: SUPABASE_SERVICE_ROLE_KEY must not be overridden with non-canonical credentials.',
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
      `Execution rejected: GITHUB_REPOSITORY (${repository}) is not authorized. Must be Rizkybuilds/bisnishub.`,
    );
  }
  const gitRef = env.GITHUB_REF ?? (isCI ? '' : 'refs/heads/main');
  if (isCI && gitRef !== 'refs/heads/main') {
    throw new Error(
      `Execution rejected: GITHUB_REF (${gitRef}) is not authorized. Must be refs/heads/main.`,
    );
  }

  // 4. Commit SHA Validation
  const commitSha =
    explicitCommitSha ?? env.MGBOS_PREFLIGHT_APPROVED_COMMIT_SHA;
  if (!commitSha || !/^[0-9a-f]{40}$/.test(commitSha)) {
    throw new Error(
      `Execution rejected: missing or invalid approved commit SHA. Must be exact 40 lowercase hex characters, got: ${commitSha}`,
    );
  }

  // 5. Current Git Revision Check
  const gitRev = spawnSync('git', ['rev-parse', 'HEAD'], {
    encoding: 'utf8',
  });
  if (gitRev.status !== 0 || !gitRev.stdout) {
    throw new Error('Execution rejected: failed to determine git HEAD revision.');
  }
  const actualHead = gitRev.stdout.trim();
  if (actualHead !== commitSha) {
    throw new Error(
      `Execution rejected: checked-out git HEAD (${actualHead}) does not match approved commit SHA (${commitSha}).`,
    );
  }

  // 6. Local Supabase Configuration Verification
  const configPath = path.join(__dirname, '..', 'supabase', 'config.toml');
  if (fs.existsSync(configPath)) {
    const configContent = fs.readFileSync(configPath, 'utf8');
    if (!configContent.includes('port = 55432')) {
      throw new Error(
        'Execution rejected: supabase/config.toml does not configure expected database port 55432.',
      );
    }
  }

  // 7. Absence of remote project-ref
  const tempDir = path.join(__dirname, '..', 'supabase', '.temp');
  if (fs.existsSync(path.join(tempDir, 'project-ref'))) {
    throw new Error(
      'Execution rejected: supabase/.temp/project-ref detected. Remote project linking is strictly prohibited.',
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
 * Robust RFC 4180 CSV parser for psql --csv output.
 * @param {string} csvText
 * @returns {string[][]}
 */
export function parseCsvRows(csvText) {
  const rows = [];
  let currentRow = [];
  let currentField = '';
  let insideQuotes = false;

  for (let i = 0; i < csvText.length; i++) {
    const char = csvText[i];
    const nextChar = csvText[i + 1];

    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        currentField += '"';
        i++; // skip escaped quote
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (char === ',' && !insideQuotes) {
      currentRow.push(currentField);
      currentField = '';
    } else if ((char === '\r' || char === '\n') && !insideQuotes) {
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

  if (currentField !== '' || currentRow.length > 0) {
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
            `Parser error: duplicate module header detected for ${spec.key} at row ${rIdx + 1}.`,
          );
        }
        throw new Error(
          `Parser error: out-of-order or skipped module header. Expected index ${currentModuleIdx + 1} (${CANONICAL_MODULE_SPECS[currentModuleIdx + 1]?.key}), got index ${matchedSpecIdx} (${spec.key}) at row ${rIdx + 1}.`,
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
        `Parser error: unexpected data row before first canonical module header at row ${rIdx + 1}: ${JSON.stringify(row)}`,
      );
    }

    // Check row width against the current module's expected headers
    if (row.length !== currentModuleSpec.expectedHeaders.length) {
      throw new Error(
        `Parser error: row width mismatch in ${currentModuleSpec.key} at row ${rIdx + 1}. Expected ${currentModuleSpec.expectedHeaders.length} columns, got ${row.length} columns: ${JSON.stringify(row)}`,
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
      `Parser error: incomplete catalog execution. Missing ${missing.length} module headers: ${missing.join(', ')}.`,
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
      throw new Error(`Probe validation error: duplicate probe_id detected: '${id}'.`);
    }
    seen.add(id);
  }

  // Check for unexpected probe IDs
  for (const id of observedIds) {
    if (!expectedIds.includes(id)) {
      throw new Error(`Probe validation error: unexpected probe_id observed: '${id}'.`);
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

  const mdPath = path.join(outputDir, 'catalog-preflight-summary.md');
  const mdContent = [
    '# MGBOS R5 D06 Catalog Preflight Summary Report',
    '',
    `- **Execution Timestamp:** ${evidencePayload.provenance.execution_timestamp}`,
    `- **Verified Commit SHA:** \`${evidencePayload.provenance.target_commit_sha}\``,
    `- **Preflight Disposition:** **${evidencePayload.derived_status.preflight_disposition}**`,
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
  const verifyOnly = args.includes('--verify-only');
  const allowLocalDevMock = args.includes('--allow-local-dev-mock');
  let commitArg = null;
  const commitIdx = args.indexOf('--approved-commit-sha');
  if (commitIdx !== -1 && args[commitIdx + 1]) {
    commitArg = args[commitIdx + 1];
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
    allowLocalDevMock,
  });
  console.log(
    `   Provenance confirmed: repo=${envIdentity.repository}, commit=${envIdentity.commitSha}, runner=${envIdentity.runnerEnv}`,
  );

  if (verifyOnly) {
    console.log(
      'Static verification complete (--verify-only mode). No database connection opened.',
    );
    return;
  }

  // 3. Database Session Execution via psql
  console.log(
    `3. Connecting to local disposable database (${CANONICAL_LOCAL_HOST}:${CANONICAL_LOCAL_PORT})...`,
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

  const psqlEnv = {
    ...process.env,
    PGPASSWORD: 'postgres',
    PGOPTIONS: `-c statement_timeout=${STATEMENT_TIMEOUT_MS} -c lock_timeout=${LOCK_TIMEOUT_MS}`,
  };

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

  // 4. Parse Results & Evaluate
  console.log('4. Parsing and grouping catalog results...');
  const parsedRows = parseCsvRows(execResult.stdout);
  const rawModules = groupRowsByModule(parsedRows);
  const { evaluations, disposition } = evaluateQ8Probes(rawModules.q8);
  const sanitizedModules = applyOutputAllowlist(rawModules);

  // 5. Structure Final Evidence Payload
  const evidencePayload = {
    provenance: {
      workflow_run_id: process.env.GITHUB_RUN_ID ?? 'local-manual',
      repository: envIdentity.repository,
      git_ref: envIdentity.gitRef,
      target_commit_sha: envIdentity.commitSha,
      execution_timestamp: jobStartTime.toISOString(),
      candidate: 'CANDIDATE_A_CI_LOCAL',
    },
    environment_identity: {
      host_endpoint: `${CANONICAL_LOCAL_HOST}:${CANONICAL_LOCAL_PORT}`,
      database_name: CANONICAL_LOCAL_DATABASE,
      is_fresh_instance_confirmed: true,
    },
    raw_module_results: sanitizedModules,
    probe_evaluations: evaluations,
    derived_status: {
      preflight_disposition: disposition,
      r5_security_disclaimer:
        'BASELINE_OBSERVATION_ONLY_DOES_NOT_PROVE_R5_SECURITY_OR_CONCURRENCY',
    },
  };

  // 6. Output Artifacts
  console.log('5. Writing sanitized evidence artifacts...');
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
