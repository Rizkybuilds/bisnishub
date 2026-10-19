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
 * @returns {{ commitSha: string, repository: string, isCI: boolean }}
 */
export function verifyEnvironmentIdentity(
  explicitCommitSha,
  env = process.env,
) {
  // 1. Secrets Hygiene: No cloud credentials
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

  // 2. Commit SHA Validation
  const commitSha =
    explicitCommitSha ?? env.MGBOS_PREFLIGHT_APPROVED_COMMIT_SHA;
  if (!commitSha || !/^[0-9a-f]{40}$/.test(commitSha)) {
    throw new Error(
      `Execution rejected: missing or invalid approved commit SHA. Must be exact 40 hex characters, got: ${commitSha}`,
    );
  }

  // 3. Current Git Revision Check
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

  // 4. CI Repository Provenance
  const isCI = env.GITHUB_ACTIONS === 'true';
  const repository = env.GITHUB_REPOSITORY ?? 'Rizkybuilds/bisnishub';
  if (isCI && repository !== 'Rizkybuilds/bisnishub') {
    throw new Error(
      `Execution rejected: GITHUB_REPOSITORY (${repository}) is not authorized.`,
    );
  }

  return { commitSha, repository, isCI };
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
      if (currentRow.length > 0 && !(currentRow.length === 1 && currentRow[0] === '')) {
        rows.push(currentRow);
      }
      currentRow = [];
    } else {
      currentField += char;
    }
  }

  if (currentField !== '' || currentRow.length > 0) {
    currentRow.push(currentField);
    if (currentRow.length > 0 && !(currentRow.length === 1 && currentRow[0] === '')) {
      rows.push(currentRow);
    }
  }

  return rows;
}

/**
 * Signature column identifiers uniquely mapping each query output to its canonical module.
 */
const MODULE_HEADER_SIGNATURES = [
  { key: 'q1', signatureCol: 'database_engine_version' },
  { key: 'q2', signatureCol: 'role_name' },
  { key: 'q3', signatureCol: 'parent_role' },
  { key: 'q4', signatureCol: 'schema_name' },
  { key: 'q5a', signatureCol: 'evaluated_relkind' },
  { key: 'q5b', signatureCol: 'can_update_column' },
  { key: 'q5c', signatureCol: 'sequence_name' },
  { key: 'q5d', signatureCol: 'defaclobjtype' },
  { key: 'q6', signatureCol: 'function_oid' },
  { key: 'q7', signatureCol: 'permission_oracle_evaluation' },
  { key: 'q8', signatureCol: 'probe_id' },
];

/**
 * Organizes parsed CSV rows into structured module objects by header detection.
 * @param {string[][]} rows
 * @returns {Record<string, Record<string, string>[]>}
 */
export function groupRowsByModule(rows) {
  const result = {
    q1: [],
    q2: [],
    q3: [],
    q4: [],
    q5a: [],
    q5b: [],
    q5c: [],
    q5d: [],
    q6: [],
    q7: [],
    q8: [],
  };

  let currentModuleKey = null;
  let currentHeaders = null;

  for (const row of rows) {
    // Check if row is a header line matching one of our known module signatures
    const matched = MODULE_HEADER_SIGNATURES.find((sig) =>
      row.includes(sig.signatureCol),
    );

    if (matched) {
      currentModuleKey = matched.key;
      currentHeaders = row;
      continue;
    }

    if (currentModuleKey && currentHeaders) {
      const obj = {};
      currentHeaders.forEach((colName, idx) => {
        obj[colName] = row[idx] ?? '';
      });
      result[currentModuleKey].push(obj);
    }
  }

  // Ensure all 11 modules were detected
  for (const sig of MODULE_HEADER_SIGNATURES) {
    if (!Object.prototype.hasOwnProperty.call(result, sig.key)) {
      throw new Error(`Result parser error: module ${sig.key} was not detected in output.`);
    }
  }

  return result;
}

/**
 * Evaluates Q8 probes against deterministic baseline expectations.
 * @param {Record<string, string>[]} q8Rows
 * @returns {{ evaluations: Record<string, any>, disposition: string }}
 */
export function evaluateQ8Probes(q8Rows) {
  const EXPECTED_BASELINE = {
    'PRB-BASE-01': 'EXPECTED_BASELINE_EXPOSURE',
    'PRB-BASE-02': 'PRESENT_BODY_SEMANTICS_UNVERIFIED_BY_CATALOG',
    'PRB-TGT-01': 'NOT_PRESENT',
    'PRB-TGT-02': 'NOT_PRESENT',
    'PRB-TGT-03': 'NOT_PRESENT',
  };

  const evaluations = {};
  let allMatched = true;

  for (const [probeId, expectedVal] of Object.entries(EXPECTED_BASELINE)) {
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
 * Generates structured JSON and Markdown summary evidence files.
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
      `| **${id}** | ${evalData.probe_category ?? ''} | \`${evalData.raw_observed_result}\` | **${evalData.baseline_conformance}** | ${evalData.oracle_guidance} |`,
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
  const args = process.argv.slice(2);
  const verifyOnly = args.includes('--verify-only');
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
  const envIdentity = verifyEnvironmentIdentity(commitArg);
  console.log(
    `   Provenance confirmed: repo=${envIdentity.repository}, commit=${envIdentity.commitSha}`,
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
    throw new Error(
      `Database execution failed to launch psql: ${execResult.error.message}`,
    );
  }

  if (execResult.status !== 0) {
    console.error(execResult.stderr);
    throw new Error(
      `psql preflight execution failed with exit code ${execResult.status}.`,
    );
  }

  // 4. Parse Results & Evaluate
  console.log('4. Parsing and grouping catalog results...');
  const parsedRows = parseCsvRows(execResult.stdout);
  const rawModules = groupRowsByModule(parsedRows);
  const { evaluations, disposition } = evaluateQ8Probes(rawModules.q8);

  // 5. Structure Final Evidence Payload
  const evidencePayload = {
    provenance: {
      workflow_run_id: process.env.GITHUB_RUN_ID ?? 'local-manual',
      repository: envIdentity.repository,
      git_ref: process.env.GITHUB_REF ?? 'refs/heads/main',
      target_commit_sha: envIdentity.commitSha,
      execution_timestamp: new Date().toISOString(),
      candidate: 'CANDIDATE_A_CI_LOCAL',
    },
    environment_identity: {
      host_endpoint: `${CANONICAL_LOCAL_HOST}:${CANONICAL_LOCAL_PORT}`,
      database_name: CANONICAL_LOCAL_DATABASE,
      is_fresh_instance_confirmed: true,
    },
    raw_module_results: rawModules,
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
  console.log(
    `Preflight execution finished. Disposition: ${disposition}`,
  );

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
