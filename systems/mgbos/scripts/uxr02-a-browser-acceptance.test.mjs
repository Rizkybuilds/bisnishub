/**
 * MultiGraph Business OS — UXR02-A Browser Acceptance Harness Reliability Tests
 *
 * Verifies that the QA harness and trace verification system fail closed on:
 * - Incorrect application candidate SHA
 * - Invalid or missing application tree SHA
 * - Incorrect harness SHA drift
 * - Invalid or missing harness tree SHA
 * - Missing or malformed trace files
 * - Missing mandatory cases or AC scenarios
 * - Case status failures or skipped cases falsely marked PASS
 * - Incomplete or unverified fixture cleanup
 * - Missing browser provenance
 * - Negative control mode mismatches and exit status contradictions
 * - Credential and secret disclosures
 * - Fault proxy lifecycle, logging, and routing behavior
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import {
  CrmFaultProxy,
  EXPECTED_PR68_HEAD_SHA,
  MANDATORY_UXR02_AC_IDS,
  MANDATORY_UXR02_CASE_IDS,
  verifyTraceFile,
} from './uxr02-a-browser-acceptance.mjs';

function createMockValidTrace({
  appSha = EXPECTED_PR68_HEAD_SHA,
  appTreeSha = '1'.repeat(40),
  harnessSha = '2'.repeat(40),
  harnessTreeSha = '3'.repeat(40),
  overall = 'PASS',
  mode = 'normal',
  verifiedAbsent = true,
  missingCase = null,
  failingCase = null,
  missingAc = null,
  leakSecret = false,
} = {}) {
  const cases = {};
  for (const cid of MANDATORY_UXR02_CASE_IDS) {
    if (cid === missingCase) continue;
    cases[cid] = {
      status: cid === failingCase ? 'FAIL' : 'PASS',
      details: 'Mock case result',
    };
  }

  const acceptanceMatrix = {};
  for (const ac of MANDATORY_UXR02_AC_IDS) {
    if (ac === missingAc) continue;
    acceptanceMatrix[ac] = {
      status: 'PASS',
      description: `Acceptance criteria ${ac}`,
    };
  }

  return {
    version: '1.0.0',
    mode,
    overall,
    targetApp: {
      expectedCheckoutSha: EXPECTED_PR68_HEAD_SHA,
      actualCheckoutSha: appSha,
      treeSha: appTreeSha,
    },
    provenance: {
      appSha,
      appTreeSha,
      harnessSha,
      harnessTreeSha,
      browser: {
        product: 'Chromium Headless',
        browserVersion: '130.0.0.0',
        userAgent: 'Mozilla/5.0 Chrome Headless',
        protocolVersion: '1.3',
      },
      timestamp: new Date().toISOString(),
    },
    cases,
    acceptanceMatrix,
    cleanup: {
      attempted: true,
      status: verifiedAbsent ? 'CLEANED_AND_ABSENT' : 'RESOURCE_NOT_ABSENT',
      verifiedAbsent,
    },
    failure: null,
    sanitized: !leakSecret,
    ...(leakSecret
      ? { leakedToken: 'sb_secret_super_secret_admin_token_99999999' }
      : {}),
  };
}

test('verifyTraceFile: accepts valid normal execution trace', () => {
  const tmpDir = mkdtempSync(path.join(tmpdir(), 'uxr02-test-'));
  const tracePath = path.join(tmpDir, 'trace.json');
  try {
    const validTrace = createMockValidTrace();
    writeFileSync(tracePath, JSON.stringify(validTrace), 'utf8');

    const result = verifyTraceFile(tracePath, {
      expectedMode: 'normal',
      exitStatus: 0,
      expectedCheckoutSha: EXPECTED_PR68_HEAD_SHA,
      expectedHarnessSha: '2'.repeat(40),
    });

    assert.equal(result.valid, true);
    assert.equal(result.code, 'TRACE_VERIFIED');
  } finally {
    rmSync(tmpDir, { recursive: true, force: true });
  }
});

test('verifyTraceFile: rejects missing trace file', () => {
  const result = verifyTraceFile('/non/existent/trace.json');
  assert.equal(result.valid, false);
  assert.equal(result.code, 'TRACE_NOT_FOUND');
});

test('verifyTraceFile: rejects malformed JSON trace', () => {
  const tmpDir = mkdtempSync(path.join(tmpdir(), 'uxr02-test-'));
  const tracePath = path.join(tmpDir, 'trace.json');
  try {
    writeFileSync(tracePath, '{ not valid json', 'utf8');
    const result = verifyTraceFile(tracePath);
    assert.equal(result.valid, false);
    assert.equal(result.code, 'TRACE_MALFORMED');
  } finally {
    rmSync(tmpDir, { recursive: true, force: true });
  }
});

test('verifyTraceFile: rejects candidate checkout SHA drift', () => {
  const tmpDir = mkdtempSync(path.join(tmpdir(), 'uxr02-test-'));
  const tracePath = path.join(tmpDir, 'trace.json');
  try {
    const trace = createMockValidTrace({ appSha: 'b'.repeat(40) });
    writeFileSync(tracePath, JSON.stringify(trace), 'utf8');

    const result = verifyTraceFile(tracePath, {
      expectedCheckoutSha: EXPECTED_PR68_HEAD_SHA,
    });

    assert.equal(result.valid, false);
    assert.equal(result.code, 'CHECKOUT_SHA_MISMATCH');
  } finally {
    rmSync(tmpDir, { recursive: true, force: true });
  }
});

test('verifyTraceFile: rejects invalid or missing application tree SHA', () => {
  const tmpDir = mkdtempSync(path.join(tmpdir(), 'uxr02-test-'));
  const tracePath = path.join(tmpDir, 'trace.json');
  try {
    const trace = createMockValidTrace({ appTreeSha: 'short_invalid' });
    writeFileSync(tracePath, JSON.stringify(trace), 'utf8');

    const result = verifyTraceFile(tracePath, {
      expectedCheckoutSha: EXPECTED_PR68_HEAD_SHA,
    });

    assert.equal(result.valid, false);
    assert.equal(result.code, 'APP_TREE_SHA_INVALID');
  } finally {
    rmSync(tmpDir, { recursive: true, force: true });
  }
});

test('verifyTraceFile: rejects harness SHA drift', () => {
  const tmpDir = mkdtempSync(path.join(tmpdir(), 'uxr02-test-'));
  const tracePath = path.join(tmpDir, 'trace.json');
  try {
    const trace = createMockValidTrace({ harnessSha: 'e'.repeat(40) });
    writeFileSync(tracePath, JSON.stringify(trace), 'utf8');

    const result = verifyTraceFile(tracePath, {
      expectedCheckoutSha: EXPECTED_PR68_HEAD_SHA,
      expectedHarnessSha: 'f'.repeat(40),
    });

    assert.equal(result.valid, false);
    assert.equal(result.code, 'HARNESS_SHA_MISMATCH');
  } finally {
    rmSync(tmpDir, { recursive: true, force: true });
  }
});

test('verifyTraceFile: rejects invalid or missing harness tree SHA', () => {
  const tmpDir = mkdtempSync(path.join(tmpdir(), 'uxr02-test-'));
  const tracePath = path.join(tmpDir, 'trace.json');
  try {
    const trace = createMockValidTrace({ harnessTreeSha: null });
    writeFileSync(tracePath, JSON.stringify(trace), 'utf8');

    const result = verifyTraceFile(tracePath, {
      expectedCheckoutSha: EXPECTED_PR68_HEAD_SHA,
    });

    assert.equal(result.valid, false);
    assert.equal(result.code, 'HARNESS_TREE_SHA_INVALID');
  } finally {
    rmSync(tmpDir, { recursive: true, force: true });
  }
});

test('verifyTraceFile: rejects trace when overall is FAIL in normal mode', () => {
  const tmpDir = mkdtempSync(path.join(tmpdir(), 'uxr02-test-'));
  const tracePath = path.join(tmpDir, 'trace.json');
  try {
    const trace = createMockValidTrace({ overall: 'FAIL' });
    writeFileSync(tracePath, JSON.stringify(trace), 'utf8');

    const result = verifyTraceFile(tracePath, { expectedMode: 'normal' });
    assert.equal(result.valid, false);
    assert.equal(result.code, 'OVERALL_NOT_PASS');
  } finally {
    rmSync(tmpDir, { recursive: true, force: true });
  }
});

test('verifyTraceFile: rejects non-zero exit status for normal mode', () => {
  const tmpDir = mkdtempSync(path.join(tmpdir(), 'uxr02-test-'));
  const tracePath = path.join(tmpDir, 'trace.json');
  try {
    const trace = createMockValidTrace();
    writeFileSync(tracePath, JSON.stringify(trace), 'utf8');

    const result = verifyTraceFile(tracePath, {
      expectedMode: 'normal',
      exitStatus: 1,
    });
    assert.equal(result.valid, false);
    assert.equal(result.code, 'EXIT_STATUS_NONZERO');
  } finally {
    rmSync(tmpDir, { recursive: true, force: true });
  }
});

test('verifyTraceFile: rejects missing mandatory case scenario', () => {
  const tmpDir = mkdtempSync(path.join(tmpdir(), 'uxr02-test-'));
  const tracePath = path.join(tmpDir, 'trace.json');
  try {
    const trace = createMockValidTrace({
      missingCase: 'AC_A01_LEADS_EMPTY_STATE',
    });
    writeFileSync(tracePath, JSON.stringify(trace), 'utf8');

    const result = verifyTraceFile(tracePath, { expectedMode: 'normal' });
    assert.equal(result.valid, false);
    assert.equal(result.code, 'MISSING_MANDATORY_CASE');
  } finally {
    rmSync(tmpDir, { recursive: true, force: true });
  }
});

test('verifyTraceFile: rejects individual case failure', () => {
  const tmpDir = mkdtempSync(path.join(tmpdir(), 'uxr02-test-'));
  const tracePath = path.join(tmpDir, 'trace.json');
  try {
    const trace = createMockValidTrace({
      failingCase: 'AC_A06_LEADS_POINTER_FILTER_RESET',
    });
    writeFileSync(tracePath, JSON.stringify(trace), 'utf8');

    const result = verifyTraceFile(tracePath, { expectedMode: 'normal' });
    assert.equal(result.valid, false);
    assert.equal(result.code, 'CASE_STATUS_NOT_PASS');
  } finally {
    rmSync(tmpDir, { recursive: true, force: true });
  }
});

test('verifyTraceFile: rejects missing AC matrix requirement', () => {
  const tmpDir = mkdtempSync(path.join(tmpdir(), 'uxr02-test-'));
  const tracePath = path.join(tmpDir, 'trace.json');
  try {
    const trace = createMockValidTrace({ missingAc: 'AC-A09' });
    writeFileSync(tracePath, JSON.stringify(trace), 'utf8');

    const result = verifyTraceFile(tracePath, { expectedMode: 'normal' });
    assert.equal(result.valid, false);
    assert.equal(result.code, 'AC_NOT_SATISFIED');
  } finally {
    rmSync(tmpDir, { recursive: true, force: true });
  }
});

test('verifyTraceFile: rejects unverified fixture absence', () => {
  const tmpDir = mkdtempSync(path.join(tmpdir(), 'uxr02-test-'));
  const tracePath = path.join(tmpDir, 'trace.json');
  try {
    const trace = createMockValidTrace({ verifiedAbsent: false });
    writeFileSync(tracePath, JSON.stringify(trace), 'utf8');

    const result = verifyTraceFile(tracePath, { expectedMode: 'normal' });
    assert.equal(result.valid, false);
    assert.equal(result.code, 'CLEANUP_NOT_VERIFIED');
  } finally {
    rmSync(tmpDir, { recursive: true, force: true });
  }
});

test('verifyTraceFile: rejects missing browser provenance', () => {
  const tmpDir = mkdtempSync(path.join(tmpdir(), 'uxr02-test-'));
  const tracePath = path.join(tmpDir, 'trace.json');
  try {
    const trace = createMockValidTrace();
    delete trace.provenance.browser;
    writeFileSync(tracePath, JSON.stringify(trace), 'utf8');

    const result = verifyTraceFile(tracePath, { expectedMode: 'normal' });
    assert.equal(result.valid, false);
    assert.equal(result.code, 'BROWSER_PROVENANCE_MISSING');
  } finally {
    rmSync(tmpDir, { recursive: true, force: true });
  }
});

test('verifyTraceFile: rejects credential leakage in trace', () => {
  const tmpDir = mkdtempSync(path.join(tmpdir(), 'uxr02-test-'));
  const tracePath = path.join(tmpDir, 'trace.json');
  try {
    const trace = createMockValidTrace({ leakSecret: true });
    writeFileSync(tracePath, JSON.stringify(trace), 'utf8');

    const result = verifyTraceFile(tracePath, { expectedMode: 'normal' });
    assert.equal(result.valid, false);
    assert.equal(result.code, 'SENSITIVE_DATA_DISCLOSED');
  } finally {
    rmSync(tmpDir, { recursive: true, force: true });
  }
});

test('verifyTraceFile: verifies intentional negative control mode and cleanup', () => {
  const tmpDir = mkdtempSync(path.join(tmpdir(), 'uxr02-test-'));
  const tracePath = path.join(tmpDir, 'trace.json');
  try {
    const negTrace = {
      version: '1.0.0',
      mode: 'intentional-broken-control',
      overall: 'FAIL',
      provenance: {
        appSha: EXPECTED_PR68_HEAD_SHA,
        appTreeSha: '1'.repeat(40),
        harnessSha: '2'.repeat(40),
        harnessTreeSha: '3'.repeat(40),
      },
      cleanup: {
        attempted: true,
        verifiedAbsent: true,
        status: 'CLEANED_AND_ABSENT',
      },
      failure: {
        stage: 'NEGATIVE_CONTROL',
        code: 'INTENTIONAL_NEGATIVE_CONTROL_TRIGGERED',
        message: 'Intentional negative control error',
      },
    };
    writeFileSync(tracePath, JSON.stringify(negTrace), 'utf8');

    // Valid negative control
    const passResult = verifyTraceFile(tracePath, {
      expectedMode: 'intentional-broken-control',
      exitStatus: 1,
      expectedCheckoutSha: EXPECTED_PR68_HEAD_SHA,
    });
    assert.equal(passResult.valid, true);
    assert.equal(passResult.code, 'TRACE_VERIFIED');

    // Contradictory exit status 0 fails
    const failStatusResult = verifyTraceFile(tracePath, {
      expectedMode: 'intentional-broken-control',
      exitStatus: 0,
    });
    assert.equal(failStatusResult.valid, false);
    assert.equal(
      failStatusResult.code,
      'EXIT_STATUS_ZERO_FOR_NEGATIVE_CONTROL',
    );

    // Contradictory overall PASS fails
    negTrace.overall = 'PASS';
    writeFileSync(tracePath, JSON.stringify(negTrace), 'utf8');
    const failOverallResult = verifyTraceFile(tracePath, {
      expectedMode: 'intentional-broken-control',
      exitStatus: 1,
    });
    assert.equal(failOverallResult.valid, false);
    assert.equal(failOverallResult.code, 'NEGATIVE_CONTROL_MISMATCH');

    // Negative control without verified cleanup fails
    negTrace.overall = 'FAIL';
    negTrace.cleanup.verifiedAbsent = false;
    writeFileSync(tracePath, JSON.stringify(negTrace), 'utf8');
    const failCleanupResult = verifyTraceFile(tracePath, {
      expectedMode: 'intentional-broken-control',
      exitStatus: 1,
    });
    assert.equal(failCleanupResult.valid, false);
    assert.equal(
      failCleanupResult.code,
      'CLEANUP_NOT_VERIFIED_IN_NEGATIVE_CONTROL',
    );
  } finally {
    rmSync(tmpDir, { recursive: true, force: true });
  }
});

test('CrmFaultProxy: starts, injects fault, decrements, logs requests, and closes cleanly', async () => {
  const proxy = new CrmFaultProxy({ targetOrigin: 'http://127.0.0.1:55431' });
  const proxyOrigin = await proxy.start();
  assert.ok(proxyOrigin.startsWith('http://127.0.0.1:'));

  try {
    proxy.setFaultRule({
      method: 'GET',
      pathPrefix: '/rest/v1/leads',
      statusCode: 500,
      body: JSON.stringify({ error: 'simulated_fault' }),
      remaining: 1,
    });

    // Request the proxy endpoint
    const res = await fetch(`${proxyOrigin}/rest/v1/leads?select=id`, {
      headers: {
        authorization: 'Bearer mock_token',
        apikey: 'mock_key',
      },
    });
    assert.equal(res.status, 500);
    const json = await res.json();
    assert.equal(json.error, 'simulated_fault');
    assert.equal(res.headers.get('x-mgbos-fault-injected'), '1');

    // Rule consumed: next request to /rest/v1/leads has no remaining rule
    assert.equal(proxy.rules.length, 0);

    // Verify proxy request logging (AC-A07 verification)
    const logEntries = proxy.getRequestLog({
      method: 'GET',
      pathPrefix: '/rest/v1/leads',
    });
    assert.equal(logEntries.length, 1);
    assert.equal(logEntries[0].method, 'GET');
    assert.equal(logEntries[0].faultInjected, true);
    assert.equal(logEntries[0].headers.authorization, 'Bearer mock_token');
  } finally {
    await proxy.close();
  }
});
