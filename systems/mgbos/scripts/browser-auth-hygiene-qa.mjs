import assert from 'node:assert/strict';
import { AsyncLocalStorage } from 'node:async_hooks';
import { spawn, spawnSync } from 'node:child_process';
import { randomBytes, randomUUID } from 'node:crypto';
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  renameSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Never log credentials, browser request bodies, JWTs, cookie values or tokens.
const root = fileURLToPath(new URL('../', import.meta.url));
const harnessContextStorage = new AsyncLocalStorage();
export const CANONICAL_API_ORIGIN = 'http://127.0.0.1:55431';
export const CANONICAL_APP_ORIGIN = 'http://127.0.0.1:3101';

export const EXPECTED_POSITIVE_CASE_IDS = Object.freeze([
  'AUTH-BLANK-01',
  'AUTH-INVALID-01',
  'AUTH-DENY-01',
  'AUTH-VALID-01',
  'AUTH-LOGOUT-01',
  'AUTH-AFTER-LOGOUT-01',
  'AUTH-INVALID-TOKEN-SETUP-01',
  'AUTH-INVALID-TOKEN-01',
]);

export const EXPECTED_NEGATIVE_PRE_LOGIN_CASE_IDS = Object.freeze([
  'AUTH-BLANK-01',
  'AUTH-INVALID-01',
  'AUTH-DENY-01',
]);

const SENSITIVE_VALUE_PATTERNS = [
  /\beyJ[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\b/,
  /\bsb_(?:secret|publishable)_[A-Za-z0-9_-]+\b/,
  /\bsbp_[A-Za-z0-9_-]+\b/,
  /\bBearer\s+[A-Za-z0-9._~+/=-]+\b/i,
  /\bmgbos_session\s*=\s*[^\s;,"']+/i,
  /\b(?:SUPABASE_SERVICE_ROLE_KEY|SERVICE_ROLE_KEY|ANON_KEY|NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)\s*[:=]\s*[^\s,"']+/i,
  /\bpostgres(?:ql)?:\/\/[^\s"'<>]+/i,
  /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i,
];

export class QaError extends Error {
  constructor(stage, code, message, details = {}) {
    super(message);
    this.name = 'QaError';
    this.stage = stage;
    this.code = code;
    this.details = details;
  }
}

function throwIfSignalAborted(signal, fallbackStage = 'BROWSER_AUTH') {
  if (!signal?.aborted) return;
  if (signal.reason instanceof QaError) {
    throw signal.reason;
  }
  throw new QaError(
    fallbackStage,
    'PROCESS_SIGNAL_TERMINATED',
    'QA harness execution aborted',
  );
}

const sleep = (ms, signal, fallbackStage = 'BROWSER_AUTH') =>
  new Promise((resolve, reject) => {
    if (signal?.aborted) {
      try {
        throwIfSignalAborted(signal, fallbackStage);
      } catch (error) {
        reject(error);
      }
      return;
    }
    const onAbort = () => {
      clearTimeout(timer);
      try {
        throwIfSignalAborted(signal, fallbackStage);
      } catch (error) {
        reject(error);
      }
    };
    const timer = setTimeout(() => {
      signal?.removeEventListener('abort', onAbort);
      resolve();
    }, ms);
    signal?.addEventListener('abort', onAbort, { once: true });
  });

export function assertProcessAlive(proc, processName, stage) {
  if (!proc) return;
  if (proc.exitCode !== null || proc.signalCode !== null) {
    throw new QaError(
      stage,
      'CHILD_PROCESS_TERMINATED',
      `${processName} process terminated unexpectedly`,
      {
        process: processName,
        exitCode: proc.exitCode,
        signal: proc.signalCode,
      },
    );
  }
}

export async function until(
  fn,
  label,
  ms = 30000,
  { checkHealth, signal, stage = 'BROWSER_AUTH' } = {},
) {
  const deadline = Date.now() + ms;
  let lastError;
  while (Date.now() < deadline) {
    throwIfSignalAborted(signal, stage);
    if (checkHealth) {
      await checkHealth();
    }
    try {
      const result = await fn();
      throwIfSignalAborted(signal, stage);
      if (result) return result;
    } catch (error) {
      if (error instanceof QaError) {
        throw error;
      }
      throwIfSignalAborted(signal, stage);
      // Page navigations temporarily destroy the execution context.
      lastError = error;
    }
    if (checkHealth) {
      await checkHealth();
    }
    await sleep(250, signal, stage);
  }
  throwIfSignalAborted(signal, stage);
  if (checkHealth) {
    await checkHealth();
  }
  if (lastError instanceof QaError) {
    throw lastError;
  }
  throw new Error(`Timed out: ${label}`);
}

export function parseEnvLines(text) {
  return Object.fromEntries(
    text.split(/\r?\n/).flatMap((line) => {
      const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
      return match ? [[match[1], match[2].replace(/^"|"$/g, '')]] : [];
    }),
  );
}

const SAFE_IDENTIFIER_PATTERN = /^[A-Za-z0-9][A-Za-z0-9_-]{0,127}$/;
const LOOPBACK_HTTP_ORIGIN_PATTERN =
  /^http:\/\/127\.0\.0\.1:([1-9][0-9]{0,4})$/;

export function isSafeIdentifier(value) {
  return typeof value === 'string' && SAFE_IDENTIFIER_PATTERN.test(value);
}

export function assertLoopbackHttpOrigin(originInput, options = {}) {
  const {
    stage = 'FIXTURE_CREATION',
    code = 'NONLOCAL_TARGET_BLOCKED',
    message = 'Refusing a nonlocal or malformed target origin',
  } = typeof options === 'string' ? { stage: options } : options;
  if (
    typeof originInput !== 'string' ||
    originInput.length === 0 ||
    originInput !== originInput.trim() ||
    !LOOPBACK_HTTP_ORIGIN_PATTERN.test(originInput)
  ) {
    throw new QaError(stage, code, message);
  }
  let parsed;
  try {
    parsed = new URL(originInput);
  } catch {
    throw new QaError(stage, code, message);
  }
  const portNum = Number(parsed.port);
  if (
    parsed.protocol !== 'http:' ||
    parsed.hostname !== '127.0.0.1' ||
    parsed.username !== '' ||
    parsed.password !== '' ||
    parsed.pathname !== '/' ||
    parsed.search !== '' ||
    parsed.hash !== '' ||
    parsed.origin !== originInput ||
    !Number.isInteger(portNum) ||
    portNum < 1 ||
    portNum > 65535
  ) {
    throw new QaError(stage, code, message);
  }
  return originInput;
}

export function assertConsistentSupabaseEnv(apiOrigin, env, options = {}) {
  const {
    stage = 'FIXTURE_CREATION',
    code = 'NONLOCAL_TARGET_BLOCKED',
    message = 'Refusing a nonlocal Supabase target',
  } = typeof options === 'string' ? { stage: options } : options;
  assertLoopbackHttpOrigin(apiOrigin, { stage, code, message });
  if (!env || typeof env !== 'object') {
    return;
  }
  for (const key of ['NEXT_PUBLIC_SUPABASE_URL', 'SUPABASE_URL']) {
    const candidate = env[key];
    if (candidate !== undefined && candidate !== null && candidate !== '') {
      assertLoopbackHttpOrigin(String(candidate), { stage, code, message });
      if (String(candidate) !== apiOrigin) {
        throw new QaError(stage, code, message);
      }
    }
  }
}

export function resolveLoopbackRequestUrl(
  apiOrigin,
  route,
  {
    stage = 'FIXTURE_CREATION',
    code = 'NONLOCAL_TARGET_BLOCKED',
    message = 'Refusing a nonlocal or malformed request URL',
  } = {},
) {
  const validatedOrigin = assertLoopbackHttpOrigin(apiOrigin, {
    stage,
    code,
    message,
  });
  if (
    typeof route !== 'string' ||
    !route.startsWith('/') ||
    route.startsWith('//') ||
    /[\\\r\n\0@#]/.test(route)
  ) {
    throw new QaError(stage, code, message);
  }
  const [routePathname] = route.split('?');
  const pathSegments = routePathname.split('/');
  if (pathSegments.some((segment) => segment === '..' || segment === '.')) {
    throw new QaError(stage, code, message);
  }
  let url;
  try {
    url = new URL(route, validatedOrigin);
  } catch {
    throw new QaError(stage, code, message);
  }
  if (
    url.origin !== validatedOrigin ||
    url.protocol !== 'http:' ||
    url.hostname !== '127.0.0.1' ||
    url.username !== '' ||
    url.password !== '' ||
    url.hash !== '' ||
    `${url.origin}${url.pathname}${url.search}` !== `${validatedOrigin}${route}`
  ) {
    throw new QaError(stage, code, message);
  }
  return url;
}

export function isValidConfirmedMembershipResponse(
  memberships,
  { expectedUserId, expectedOrganizationId, expectedRoleId } = {},
) {
  if (
    !isSafeIdentifier(expectedUserId) ||
    !isSafeIdentifier(expectedOrganizationId) ||
    !isSafeIdentifier(expectedRoleId)
  ) {
    return false;
  }
  if (!Array.isArray(memberships) || memberships.length !== 1) {
    return false;
  }
  const record = memberships[0];
  if (!record || typeof record !== 'object' || Array.isArray(record)) {
    return false;
  }
  if (
    typeof record.user_id !== 'string' ||
    typeof record.organization_id !== 'string' ||
    typeof record.role_id !== 'string'
  ) {
    return false;
  }
  if (record.status !== undefined && record.status !== 'ACTIVE') {
    return false;
  }
  return (
    record.user_id === expectedUserId &&
    record.organization_id === expectedOrganizationId &&
    record.role_id === expectedRoleId
  );
}

export function localStatus({
  workdir = root,
  api = CANONICAL_API_ORIGIN,
  env = process.env,
  spawnSyncFn = spawnSync,
} = {}) {
  assertConsistentSupabaseEnv(api, env, {
    stage: 'LOCAL_STATUS',
    code: 'LOCAL_STATUS_FAILED',
    message: 'Refusing a nonlocal Supabase target',
  });
  const binary = path.join(
    workdir,
    'node_modules',
    'supabase',
    'dist',
    'supabase.js',
  );
  const output = spawnSyncFn(
    process.execPath,
    [binary, 'status', '-o', 'env', '--workdir', workdir],
    {
      cwd: workdir,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
      timeout: 30000,
    },
  );
  if (output.error?.code === 'ETIMEDOUT') {
    throw new QaError(
      'LOCAL_STATUS',
      'LOCAL_STATUS_TIMED_OUT',
      'Disposable Supabase status check timed out',
    );
  }
  if (output.status !== 0) {
    throw new QaError(
      'LOCAL_STATUS',
      'LOCAL_STATUS_FAILED',
      'Disposable Supabase is unavailable',
    );
  }
  const parsed = parseEnvLines(output.stdout ?? '');
  if (parsed.API_URL !== api || !parsed.ANON_KEY || !parsed.SERVICE_ROLE_KEY) {
    throw new QaError(
      'LOCAL_STATUS',
      'LOCAL_STATUS_FAILED',
      'Local Supabase identity or keys could not be verified',
    );
  }
  assertLoopbackHttpOrigin(parsed.API_URL, {
    stage: 'LOCAL_STATUS',
    code: 'LOCAL_STATUS_FAILED',
    message: 'Refusing a nonlocal Supabase target',
  });
  if (
    parsed.DB_URL &&
    !/^postgres(?:ql)?:\/\/(?:[^@]+@)?127\.0\.0\.1:55432\//.test(parsed.DB_URL)
  ) {
    throw new QaError(
      'LOCAL_STATUS',
      'LOCAL_STATUS_FAILED',
      'Refusing nonlocal database identity',
    );
  }
  return parsed;
}

const SYNTHETIC_FIXTURE_EMAIL_PATTERN =
  /^ci-auth-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}@example\.test$/i;
const AUTH_RECONCILIATION_PER_PAGE = 1000;
const AUTH_RECONCILIATION_MAX_PAGES = 25;
const DEFAULT_CREATION_QUIESCENCE_TIMEOUT_MS = 50;
const activeHarnessInvocations = new Set();
const fixtureCapabilities = new WeakMap();

export const FIXTURE_MUTATION_STAGES = Object.freeze([
  'auth',
  'profile',
  'membership',
]);

const FIXTURE_MUTATION_ENDPOINTS = Object.freeze({
  auth: 'POST /auth/v1/admin/users',
  profile: 'POST /rest/v1/users',
  membership: 'POST /rest/v1/organization_members',
});

function createMutationStageState(endpoint) {
  return {
    endpoint,
    status: 'NOT_STARTED',
    dispatched: false,
    confirmed: false,
    ambiguous: false,
  };
}

function getActiveOwnerInvocationContext() {
  const activeContext = harnessContextStorage.getStore();
  if (
    !activeContext ||
    typeof activeContext !== 'object' ||
    typeof activeContext.invocationId !== 'symbol' ||
    activeContext.invalidated ||
    !activeHarnessInvocations.has(activeContext.invocationId)
  ) {
    return null;
  }
  return activeContext;
}

export async function withFixtureInvocation(callback, options = {}) {
  if (typeof callback !== 'function') {
    throw new QaError(
      'FIXTURE_CREATION',
      'FIXTURE_CREATION_FAILED',
      'Standalone fixture invocation requires a callback function',
    );
  }
  const invocationId = Symbol('mgbos-qa-standalone-invocation');
  const capabilities = new Set();
  const invocationContext = {
    invocationId,
    kind: 'standalone',
    capabilities,
    scopeTeardownInProgress: false,
    invalidated: false,
  };
  activeHarnessInvocations.add(invocationId);
  try {
    return await harnessContextStorage.run(invocationContext, async () => {
      let callbackResult;
      let callbackError = null;
      let callbackThrew = false;
      try {
        callbackResult = await callback();
      } catch (error) {
        callbackError = error;
        callbackThrew = true;
      }

      invocationContext.scopeTeardownInProgress = true;
      const ownedCapabilities = Array.from(capabilities);

      // Phase 1: Immediately signal cancellation and freeze in-flight mutation ambiguity
      // across all owned capabilities that have not yet finished cleanup.
      for (const capability of ownedCapabilities) {
        if (!capability.cleanupCompleted) {
          capability.scopeTeardownRequested = true;
          if (capability.creationInProgress) {
            capability.teardownTriggeredWhileCreating = true;
          }
          for (const stageKey of FIXTURE_MUTATION_STAGES) {
            if (
              capability.dispatchedStages.has(stageKey) &&
              !capability.confirmedStages.has(stageKey)
            ) {
              capability.stickyAmbiguousStages.add(stageKey);
            }
          }
          if (
            capability.stickyAmbiguousStages.size > 0 ||
            capability.creationInProgress
          ) {
            finalizeFailedFixtureMutations(capability.fixtureRef);
          }
          capability.creationAbortController?.abort?.(
            new QaError(
              'FIXTURE_CREATION',
              'PROCESS_SIGNAL_TERMINATED',
              'Standalone fixture invocation scope exit cancelled in-flight fixture creation',
            ),
          );
        }
      }

      // Phase 2: Supervised, bounded cleanup/reconciliation for all owned capabilities
      // while the owning AsyncLocalStorage context and capability remain valid.
      const cleanupResults = [];
      const cleanupFailures = [];

      const recordCapabilityOutcome = (capability, result, error) => {
        const fixtureAmbiguous = getAmbiguousMutationStages(
          capability.fixtureRef,
        );
        const capabilityAmbiguous = FIXTURE_MUTATION_STAGES.filter(
          (stageKey) =>
            capability.stickyAmbiguousStages.has(stageKey) ||
            (capability.dispatchedStages.has(stageKey) &&
              !capability.confirmedStages.has(stageKey)),
        );
        const ambiguousMutations = Array.from(
          new Set([
            ...(Array.isArray(result?.ambiguousMutations)
              ? result.ambiguousMutations
              : []),
            ...fixtureAmbiguous,
            ...capabilityAmbiguous,
          ]),
        ).filter((stageKey) => ALLOWED_MUTATION_STAGES.has(stageKey));

        if (error) {
          const entry = {
            attempted: true,
            status: 'FAIL',
            code: 'FIXTURE_CLEANUP_FAILED',
            reason: 'FIXTURE_CLEANUP_FAILED',
            ...(ambiguousMutations.length > 0 ? { ambiguousMutations } : {}),
          };
          cleanupResults.push(entry);
          cleanupFailures.push(entry);
          return;
        }

        const status = allowlistedString(
          result?.status,
          ALLOWED_CLEANUP_STATUSES,
          'FAIL',
        );
        if (status === 'SKIPPED') {
          cleanupResults.push({ attempted: false, status: 'SKIPPED' });
          return;
        }
        if (
          status === 'PASS' &&
          ambiguousMutations.length === 0 &&
          !hasAmbiguousFixtureMutation(capability.fixtureRef) &&
          !capability.teardownTriggeredWhileCreating &&
          !capability.creationInProgress
        ) {
          cleanupResults.push({ attempted: true, status: 'PASS' });
          return;
        }
        if (status === 'FAIL') {
          const entry = {
            attempted: true,
            status: 'FAIL',
            code: 'FIXTURE_CLEANUP_FAILED',
            reason: 'FIXTURE_CLEANUP_FAILED',
            ...(ambiguousMutations.length > 0 ? { ambiguousMutations } : {}),
          };
          cleanupResults.push(entry);
          cleanupFailures.push(entry);
          return;
        }
        const reason =
          ambiguousMutations.length > 0 ||
          hasAmbiguousFixtureMutation(capability.fixtureRef)
            ? 'MUTATION_OUTCOME_AMBIGUOUS'
            : allowlistedString(
                result?.reason,
                ALLOWED_CLEANUP_REASONS,
                'FIXTURE_QUIESCENCE_TIMEOUT',
              );
        const entry = {
          attempted: true,
          status: 'UNVERIFIED',
          code: 'FIXTURE_CLEANUP_UNVERIFIED',
          reason,
          ...(ambiguousMutations.length > 0 ? { ambiguousMutations } : {}),
          ...(typeof result?.executionQuiesced === 'boolean'
            ? { executionQuiesced: result.executionQuiesced }
            : {}),
        };
        cleanupResults.push(entry);
        cleanupFailures.push(entry);
      };

      for (const capability of ownedCapabilities) {
        if (capability.cleanupInProgress && capability.cleanupPromise) {
          try {
            const res = await capability.cleanupPromise;
            recordCapabilityOutcome(capability, res, null);
          } catch (cleanupErr) {
            recordCapabilityOutcome(capability, null, cleanupErr);
          }
          continue;
        }

        if (capability.cleanupCompleted) {
          recordCapabilityOutcome(
            capability,
            capability.lastCleanupResult,
            capability.lastCleanupError,
          );
          continue;
        }

        const fixture = capability.fixtureRef;
        const hasClaimedResources = Boolean(
          fixture &&
          typeof fixture === 'object' &&
          (fixture.profile ||
            fixture.auth ||
            fixture.organizationId ||
            fixture.roleId ||
            fixture.membership ||
            fixture.membershipCreated ||
            fixture.mutationStarted ||
            hasAmbiguousFixtureMutation(fixture)),
        );

        if (!capability.activated) {
          if (
            !hasClaimedResources &&
            fixture &&
            typeof fixture.email === 'string' &&
            fixture.email === capability.originalEmail &&
            SYNTHETIC_FIXTURE_EMAIL_PATTERN.test(capability.originalEmail)
          ) {
            capability.cleanupRequested = true;
            capability.cleanupCompleted = true;
            capability.invalidated = true;
            const skipResult = { attempted: false, status: 'SKIPPED' };
            capability.lastCleanupResult = skipResult;
            recordCapabilityOutcome(capability, skipResult, null);
          } else {
            const tamperErr = new QaError(
              'CLEANUP',
              'FIXTURE_CLEANUP_FAILED',
              'Refusing to exit standalone fixture invocation with tampered unactivated fixture state',
            );
            capability.cleanupRequested = true;
            capability.cleanupCompleted = true;
            capability.invalidated = true;
            capability.lastCleanupError = tamperErr;
            recordCapabilityOutcome(capability, null, tamperErr);
          }
          continue;
        }

        const cleanupOptions = {
          api: capability.apiOrigin ?? CANONICAL_API_ORIGIN,
          env: options?.env ?? capability.env,
          fetchFn:
            options?.fetchFn ??
            capability.fetchFn ??
            capability.fixtureRef?.fetchFn ??
            fetch,
        };
        const effectivePageSize = options?.pageSize ?? capability.pageSize;
        if (effectivePageSize !== undefined) {
          cleanupOptions.pageSize = effectivePageSize;
        }
        const effectiveMaxPages = options?.maxPages ?? capability.maxPages;
        if (effectiveMaxPages !== undefined) {
          cleanupOptions.maxPages = effectiveMaxPages;
        }
        const effectiveQuiescenceTimeoutMs =
          options?.creationQuiescenceTimeoutMs ??
          capability.creationQuiescenceTimeoutMs;
        if (effectiveQuiescenceTimeoutMs !== undefined) {
          cleanupOptions.creationQuiescenceTimeoutMs =
            effectiveQuiescenceTimeoutMs;
        }

        try {
          const res = await cleanup(
            capability.serviceKey,
            capability.fixtureRef,
            cleanupOptions,
          );
          recordCapabilityOutcome(capability, res, null);
        } catch (cleanupErr) {
          recordCapabilityOutcome(capability, null, cleanupErr);
        }
      }

      if (cleanupFailures.length === 0) {
        if (callbackThrew) {
          throw callbackError;
        }
        return callbackResult;
      }

      if (
        callbackThrew &&
        cleanupFailures.length === 1 &&
        ownedCapabilities.some((cap) => cap.lastCleanupError === callbackError)
      ) {
        throw callbackError;
      }

      const hasHardCleanupFailure = cleanupFailures.some(
        (entry) => entry.status === 'FAIL',
      );
      const cleanupCode = hasHardCleanupFailure
        ? 'FIXTURE_CLEANUP_FAILED'
        : 'FIXTURE_CLEANUP_UNVERIFIED';
      const cleanupStatus = hasHardCleanupFailure ? 'FAIL' : 'UNVERIFIED';
      const allAmbiguousMutations = Array.from(
        new Set(
          cleanupFailures.flatMap((entry) =>
            Array.isArray(entry.ambiguousMutations)
              ? entry.ambiguousMutations
              : [],
          ),
        ),
      );
      const primaryReason = hasHardCleanupFailure
        ? 'FIXTURE_CLEANUP_FAILED'
        : allAmbiguousMutations.length > 0
          ? 'MUTATION_OUTCOME_AMBIGUOUS'
          : (cleanupFailures.find((entry) => typeof entry.reason === 'string')
              ?.reason ?? 'FIXTURE_QUIESCENCE_TIMEOUT');

      const details = {
        cleanupStatus,
        cleanupReason: primaryReason,
        ...(allAmbiguousMutations.length > 0
          ? { ambiguousMutations: allAmbiguousMutations }
          : {}),
        cleanupResults,
        cleanupFailures,
      };

      let sanitizedCallbackFailure = null;
      if (callbackThrew) {
        sanitizedCallbackFailure = classifyFailure(
          'QA_EXECUTION',
          callbackError,
        );
        details.priorStage = sanitizedCallbackFailure.stage;
        details.priorCode = sanitizedCallbackFailure.code;
      }

      const scopeError = new QaError(
        'CLEANUP',
        cleanupCode,
        hasHardCleanupFailure
          ? 'Standalone fixture invocation cleanup verification failed'
          : `Standalone fixture invocation cleanup remained unverified (${primaryReason})`,
        details,
      );
      scopeError.cleanupStatus = cleanupStatus;
      scopeError.cleanupReason = primaryReason;
      scopeError.cleanupResults = cleanupResults;
      scopeError.cleanupFailures = cleanupFailures;
      if (allAmbiguousMutations.length > 0) {
        scopeError.ambiguousMutations = allAmbiguousMutations;
      }
      if (sanitizedCallbackFailure) {
        scopeError.callbackFailure = sanitizedCallbackFailure;
        const sanitizedCause = new QaError(
          sanitizedCallbackFailure.stage,
          sanitizedCallbackFailure.code,
          `Callback failed (${sanitizedCallbackFailure.stage}/${sanitizedCallbackFailure.code}) prior to standalone scope-exit cleanup failure`,
        );
        Object.defineProperty(scopeError, 'cause', {
          value: sanitizedCause,
          enumerable: false,
          configurable: true,
          writable: true,
        });
      }
      throw scopeError;
    });
  } finally {
    invocationContext.invalidated = true;
    activeHarnessInvocations.delete(invocationId);
    for (const capability of capabilities) {
      capability.invalidated = true;
      capability.creationAbortController?.abort?.(
        new QaError(
          'FIXTURE_CREATION',
          'PROCESS_SIGNAL_TERMINATED',
          'Standalone fixture invocation scope exited',
        ),
      );
    }
  }
}

export const runFixtureInvocation = withFixtureInvocation;

function registerFixtureCapability(fixture, email, password) {
  const activeContext = getActiveOwnerInvocationContext();
  const capability = {
    capabilityId: Symbol('fixture-ownership-capability'),
    fixtureRef: fixture,
    harnessInvocationId: activeContext?.invocationId ?? null,
    originalEmail: email,
    originalPassword: password,
    apiOrigin: null,
    serviceKey: null,
    fetchFn: null,
    env: undefined,
    pageSize: undefined,
    maxPages: undefined,
    creationQuiescenceTimeoutMs: undefined,
    activated: false,
    creationInProgress: false,
    creationPromise: null,
    creationAbortController: new AbortController(),
    cleanupRequested: false,
    cleanupReconciling: false,
    cleanupInProgress: false,
    cleanupCompleted: false,
    cleanupPromise: null,
    lastCleanupResult: null,
    lastCleanupError: null,
    teardownTriggeredWhileCreating: false,
    scopeTeardownRequested: false,
    invalidated: activeContext === null,
    dispatchedStages: new Set(),
    confirmedStages: new Set(),
    stickyAmbiguousStages: new Set(),
    confirmedAuthId: null,
    confirmedProfileId: null,
    confirmedOrganizationId: null,
    confirmedRoleId: null,
    confirmedMembership: false,
  };
  fixtureCapabilities.set(fixture, capability);
  if (activeContext?.capabilities instanceof Set) {
    activeContext.capabilities.add(capability);
  }
  return capability;
}

export function createFixtureState() {
  const email = `ci-auth-${randomUUID()}@example.test`;
  const password = randomBytes(32).toString('base64url');
  const fixture = {
    email,
    password,
    auth: null,
    profile: null,
    organizationId: null,
    roleId: null,
    membershipCreated: false,
    mutationStarted: false,
    pendingMutation: false,
    mutationOutcomeAmbiguous: false,
    ambiguousMutations: [],
    mutations: {
      auth: createMutationStageState(FIXTURE_MUTATION_ENDPOINTS.auth),
      profile: createMutationStageState(FIXTURE_MUTATION_ENDPOINTS.profile),
      membership: createMutationStageState(
        FIXTURE_MUTATION_ENDPOINTS.membership,
      ),
    },
  };
  registerFixtureCapability(fixture, email, password);
  return fixture;
}

function ensureFixtureMutationTracking(fixture) {
  if (!fixture || typeof fixture !== 'object') {
    return;
  }
  if (!fixture.mutations || typeof fixture.mutations !== 'object') {
    fixture.mutations = {};
  }
  for (const stageKey of FIXTURE_MUTATION_STAGES) {
    const existing = fixture.mutations[stageKey];
    if (!existing || typeof existing !== 'object') {
      fixture.mutations[stageKey] = createMutationStageState(
        FIXTURE_MUTATION_ENDPOINTS[stageKey],
      );
    } else {
      if (typeof existing.endpoint !== 'string') {
        existing.endpoint = FIXTURE_MUTATION_ENDPOINTS[stageKey];
      }
      if (typeof existing.status !== 'string') {
        existing.status = 'NOT_STARTED';
      }
      existing.dispatched = Boolean(existing.dispatched);
      existing.confirmed = Boolean(existing.confirmed);
      existing.ambiguous = Boolean(existing.ambiguous);
    }
  }
  if (typeof fixture.mutationOutcomeAmbiguous !== 'boolean') {
    fixture.mutationOutcomeAmbiguous = false;
  }
  if (!Array.isArray(fixture.ambiguousMutations)) {
    fixture.ambiguousMutations = [];
  }
}

function syncFixtureMutationSummary(fixture) {
  if (!fixture || typeof fixture !== 'object') {
    return;
  }
  ensureFixtureMutationTracking(fixture);
  const capability = fixtureCapabilities.get(fixture);
  const ambiguousStages = FIXTURE_MUTATION_STAGES.filter((stageKey) => {
    const state = fixture.mutations[stageKey];
    const capabilityAmbiguous = Boolean(
      capability &&
      (capability.stickyAmbiguousStages.has(stageKey) ||
        (capability.dispatchedStages.has(stageKey) &&
          !capability.confirmedStages.has(stageKey))),
    );
    if (capability?.stickyAmbiguousStages.has(stageKey) && state) {
      state.status = 'AMBIGUOUS';
      state.dispatched = true;
      state.confirmed = false;
      state.ambiguous = true;
    }
    return Boolean(
      capabilityAmbiguous ||
      (state &&
        (state.ambiguous === true ||
          state.status === 'DISPATCHED' ||
          state.status === 'AMBIGUOUS' ||
          (state.dispatched === true && state.confirmed !== true))),
    );
  });
  fixture.ambiguousMutations = ambiguousStages;
  fixture.mutationOutcomeAmbiguous = ambiguousStages.length > 0;
  fixture.pendingMutation = FIXTURE_MUTATION_STAGES.some(
    (stageKey) => fixture.mutations[stageKey]?.status === 'DISPATCHED',
  );
}

function getAmbiguousMutationStages(fixture) {
  if (!fixture || typeof fixture !== 'object') {
    return [];
  }
  syncFixtureMutationSummary(fixture);
  return [...fixture.ambiguousMutations];
}

function hasAmbiguousFixtureMutation(fixture) {
  if (!fixture || typeof fixture !== 'object') {
    return false;
  }
  return (
    fixture.mutationOutcomeAmbiguous === true ||
    getAmbiguousMutationStages(fixture).length > 0
  );
}

function prepareFixtureMutation(fixture, stageKey) {
  ensureFixtureMutationTracking(fixture);
  const state = fixture.mutations[stageKey];
  const capability = fixtureCapabilities.get(fixture);
  if (
    state &&
    !state.dispatched &&
    !state.confirmed &&
    !capability?.stickyAmbiguousStages.has(stageKey)
  ) {
    state.status = 'PREPARED';
    state.dispatched = false;
    state.confirmed = false;
    state.ambiguous = false;
  }
  syncFixtureMutationSummary(fixture);
}

function markFixtureMutationDispatched(fixture, stageKey) {
  ensureFixtureMutationTracking(fixture);
  const capability = fixtureCapabilities.get(fixture);
  if (capability) {
    capability.dispatchedStages.add(stageKey);
  }
  const state = fixture.mutations[stageKey];
  state.status = 'DISPATCHED';
  state.dispatched = true;
  state.confirmed = false;
  state.ambiguous = true;
  fixture.mutationStarted = true;
  syncFixtureMutationSummary(fixture);
}

function markFixtureMutationConfirmed(fixture, stageKey) {
  ensureFixtureMutationTracking(fixture);
  const capability = fixtureCapabilities.get(fixture);
  const state = fixture.mutations[stageKey];
  if (
    state?.status === 'AMBIGUOUS' ||
    capability?.stickyAmbiguousStages.has(stageKey) ||
    capability?.cleanupReconciling ||
    capability?.cleanupCompleted ||
    capability?.invalidated
  ) {
    if (capability) {
      capability.dispatchedStages.add(stageKey);
      capability.stickyAmbiguousStages.add(stageKey);
    }
    if (state) {
      state.status = 'AMBIGUOUS';
      state.dispatched = true;
      state.confirmed = false;
      state.ambiguous = true;
    }
    syncFixtureMutationSummary(fixture);
    return;
  }
  if (capability) {
    capability.dispatchedStages.add(stageKey);
    capability.confirmedStages.add(stageKey);
  }
  state.status = 'CONFIRMED';
  state.dispatched = true;
  state.confirmed = true;
  state.ambiguous = false;
  syncFixtureMutationSummary(fixture);
}

function finalizeFailedFixtureMutations(fixture) {
  if (!fixture || typeof fixture !== 'object') {
    return;
  }
  ensureFixtureMutationTracking(fixture);
  const capability = fixtureCapabilities.get(fixture);
  for (const stageKey of FIXTURE_MUTATION_STAGES) {
    const state = fixture.mutations[stageKey];
    if (!state) continue;
    const dispatchedInCapability = Boolean(
      capability?.dispatchedStages.has(stageKey),
    );
    const confirmedInCapability = Boolean(
      capability?.confirmedStages.has(stageKey),
    );
    const stickyInCapability = Boolean(
      capability?.stickyAmbiguousStages.has(stageKey),
    );
    if (
      state.status === 'PREPARED' &&
      !state.dispatched &&
      !dispatchedInCapability &&
      !stickyInCapability
    ) {
      state.status = 'FAILED_BEFORE_DISPATCH';
      state.dispatched = false;
      state.confirmed = false;
      state.ambiguous = false;
    } else if (
      stickyInCapability ||
      state.status === 'DISPATCHED' ||
      state.status === 'AMBIGUOUS' ||
      (state.dispatched && !state.confirmed) ||
      (dispatchedInCapability && !confirmedInCapability)
    ) {
      capability?.stickyAmbiguousStages.add(stageKey);
      state.status = 'AMBIGUOUS';
      state.dispatched = true;
      state.confirmed = false;
      state.ambiguous = true;
    }
  }
  syncFixtureMutationSummary(fixture);
}

function combineAbortSignals(primarySignal, secondarySignal) {
  if (!primarySignal) {
    return secondarySignal;
  }
  if (!secondarySignal) {
    return primarySignal;
  }
  if (typeof AbortSignal.any === 'function') {
    return AbortSignal.any([primarySignal, secondarySignal]);
  }
  const controller = new AbortController();
  const onAbort = () =>
    controller.abort(primarySignal.reason ?? secondarySignal.reason);
  if (primarySignal.aborted || secondarySignal.aborted) {
    onAbort();
  } else {
    primarySignal.addEventListener('abort', onAbort, { once: true });
    secondarySignal.addEventListener('abort', onAbort, { once: true });
  }
  return controller.signal;
}

function createRequestSignal(signal, timeoutMs = 15000) {
  const timeoutSignal = AbortSignal.timeout(timeoutMs);
  if (!signal) {
    return timeoutSignal;
  }
  if (typeof AbortSignal.any === 'function') {
    return AbortSignal.any([signal, timeoutSignal]);
  }
  const controller = new AbortController();
  const onAbort = () => controller.abort(signal.reason ?? timeoutSignal.reason);
  if (signal.aborted || timeoutSignal.aborted) {
    onAbort();
  } else {
    signal.addEventListener('abort', onAbort, { once: true });
    timeoutSignal.addEventListener('abort', onAbort, { once: true });
  }
  return controller.signal;
}

export async function db(
  key,
  route,
  {
    method = 'GET',
    body,
    schema,
    api = CANONICAL_API_ORIGIN,
    env,
    fetchFn = fetch,
    signal,
    requestSignal,
    stage = 'FIXTURE_CREATION',
    onBeforeDispatch,
    allowStatuses = [],
    returnRawResponse = false,
  } = {},
) {
  assertConsistentSupabaseEnv(api, env, {
    stage,
    code: 'NONLOCAL_TARGET_BLOCKED',
  });
  const url = resolveLoopbackRequestUrl(api, route, {
    stage,
    code: 'NONLOCAL_TARGET_BLOCKED',
  });
  if (typeof key !== 'string' || key.trim().length === 0) {
    throw new QaError(
      stage,
      stage === 'CLEANUP'
        ? 'FIXTURE_CLEANUP_FAILED'
        : 'FIXTURE_CREATION_FAILED',
      'Refusing privileged disposable database request without service key',
    );
  }
  throwIfSignalAborted(signal, stage);
  const headers = {
    apikey: key,
    Authorization: `Bearer ${key}`,
    'Content-Type': 'application/json',
    Prefer: 'return=representation',
  };
  if (schema) {
    headers['Accept-Profile'] = schema;
    headers['Content-Profile'] = schema;
  }
  const effectiveRequestSignal = requestSignal ?? signal;
  const serializedBody = body === undefined ? undefined : JSON.stringify(body);
  const fetchSignal = createRequestSignal(effectiveRequestSignal, 15000);
  throwIfSignalAborted(signal, stage);
  if (typeof onBeforeDispatch === 'function') {
    onBeforeDispatch();
  }
  let response;
  try {
    response = await fetchFn(url, {
      method,
      headers,
      body: serializedBody,
      signal: fetchSignal,
    });
  } catch (error) {
    if (signal?.aborted) {
      throwIfSignalAborted(signal, stage);
    }
    if (effectiveRequestSignal?.aborted) {
      throwIfSignalAborted(effectiveRequestSignal, stage);
    }
    throw error;
  }
  const allowedStatus =
    Array.isArray(allowStatuses) && allowStatuses.includes(response.status);
  if (!response.ok && !allowedStatus) {
    if (signal?.aborted) {
      throwIfSignalAborted(signal, stage);
    }
    if (effectiveRequestSignal?.aborted) {
      throwIfSignalAborted(effectiveRequestSignal, stage);
    }
    throw new Error(
      `Disposable database operation failed: HTTP ${response.status}`,
    );
  }
  if (returnRawResponse) {
    return response;
  }
  if (response.status === 204 || allowedStatus) {
    return null;
  }
  try {
    return await response.json();
  } catch (error) {
    if (signal?.aborted) {
      throwIfSignalAborted(signal, stage);
    }
    if (effectiveRequestSignal?.aborted) {
      throwIfSignalAborted(effectiveRequestSignal, stage);
    }
    throw error;
  }
}

export async function cleanup(
  key,
  fixture,
  {
    api = CANONICAL_API_ORIGIN,
    fetchFn,
    env,
    pageSize = AUTH_RECONCILIATION_PER_PAGE,
    maxPages = AUTH_RECONCILIATION_MAX_PAGES,
    creationQuiescenceTimeoutMs = DEFAULT_CREATION_QUIESCENCE_TIMEOUT_MS,
  } = {},
) {
  assertConsistentSupabaseEnv(api, env, {
    stage: 'CLEANUP',
    code: 'NONLOCAL_TARGET_BLOCKED',
  });
  const effectiveFetchFn = fetchFn ?? fixture?.fetchFn ?? fetch;
  if (!key || !fixture || typeof fixture !== 'object') {
    return { attempted: false, status: 'SKIPPED' };
  }
  if (typeof key !== 'string' || key.trim().length === 0) {
    throw new QaError(
      'CLEANUP',
      'FIXTURE_CLEANUP_FAILED',
      'Synthetic fixture cleanup requires a valid service key',
    );
  }
  if (
    typeof pageSize !== 'number' ||
    !Number.isInteger(pageSize) ||
    pageSize < 1 ||
    pageSize > AUTH_RECONCILIATION_PER_PAGE ||
    typeof maxPages !== 'number' ||
    !Number.isInteger(maxPages) ||
    maxPages < 1 ||
    maxPages > 100 ||
    typeof creationQuiescenceTimeoutMs !== 'number' ||
    !Number.isFinite(creationQuiescenceTimeoutMs) ||
    creationQuiescenceTimeoutMs < 0 ||
    creationQuiescenceTimeoutMs > 30000
  ) {
    throw new QaError(
      'CLEANUP',
      'FIXTURE_CLEANUP_FAILED',
      'Refusing synthetic fixture cleanup with invalid pagination or quiescence bounds',
    );
  }

  const hasClaimedResources = Boolean(
    fixture.profile ||
    fixture.auth ||
    fixture.organizationId ||
    fixture.roleId ||
    fixture.membership ||
    fixture.membershipCreated ||
    fixture.mutationStarted ||
    hasAmbiguousFixtureMutation(fixture),
  );

  // Enforce non-forgeable current-run ownership capability and active caller context before any server query or deletion.
  const capability = fixtureCapabilities.get(fixture);
  const activeContext = getActiveOwnerInvocationContext();
  if (!capability || capability.fixtureRef !== fixture) {
    throw new QaError(
      'CLEANUP',
      'FIXTURE_CLEANUP_FAILED',
      'Refusing to delete fixture resources without verified current-run ownership capability',
    );
  }
  if (
    !activeContext ||
    capability.harnessInvocationId === null ||
    capability.harnessInvocationId !== activeContext.invocationId
  ) {
    throw new QaError(
      'CLEANUP',
      'FIXTURE_CLEANUP_FAILED',
      'Refusing synthetic fixture cleanup outside the owning active invocation context',
    );
  }
  if (
    capability.invalidated ||
    capability.cleanupRequested ||
    capability.cleanupInProgress ||
    capability.cleanupCompleted
  ) {
    throw new QaError(
      'CLEANUP',
      'FIXTURE_CLEANUP_FAILED',
      'Refusing to reuse an expired or already-consumed fixture ownership capability',
    );
  }

  if (!capability.activated) {
    if (
      !hasClaimedResources &&
      typeof fixture.email === 'string' &&
      fixture.email === capability.originalEmail &&
      SYNTHETIC_FIXTURE_EMAIL_PATTERN.test(capability.originalEmail)
    ) {
      capability.cleanupRequested = true;
      capability.cleanupCompleted = true;
      capability.invalidated = true;
      const skipResult = { attempted: false, status: 'SKIPPED' };
      capability.lastCleanupResult = skipResult;
      capability.creationAbortController.abort(
        new QaError(
          'FIXTURE_CREATION',
          'PROCESS_SIGNAL_TERMINATED',
          'Synthetic fixture capability was already cleaned up before creation',
        ),
      );
      return skipResult;
    }
    const unprovisionedError = new QaError(
      'CLEANUP',
      'FIXTURE_CLEANUP_FAILED',
      'Refusing to clean up an unprovisioned or tampered synthetic fixture state',
    );
    capability.cleanupRequested = true;
    capability.cleanupCompleted = true;
    capability.invalidated = true;
    capability.lastCleanupError = unprovisionedError;
    throw unprovisionedError;
  }

  if (capability.apiOrigin !== api || capability.serviceKey !== key) {
    throw new QaError(
      'CLEANUP',
      'FIXTURE_CLEANUP_FAILED',
      'Refusing synthetic fixture cleanup with mismatched target origin or service key',
    );
  }

  const creationInFlightAtEntry =
    capability.creationInProgress || capability.teardownTriggeredWhileCreating;
  for (const stageKey of FIXTURE_MUTATION_STAGES) {
    if (
      capability.dispatchedStages.has(stageKey) &&
      !capability.confirmedStages.has(stageKey)
    ) {
      capability.stickyAmbiguousStages.add(stageKey);
    }
  }
  if (capability.stickyAmbiguousStages.size > 0) {
    finalizeFailedFixtureMutations(fixture);
  }
  capability.cleanupRequested = true;
  capability.cleanupInProgress = true;
  capability.creationAbortController.abort(
    new QaError(
      'FIXTURE_CREATION',
      'PROCESS_SIGNAL_TERMINATED',
      'Synthetic fixture creation cancelled by cleanup lifecycle barrier',
    ),
  );
  const cleanupExecutionPromise = (async () => {
    try {
      let creationQuiesced = !creationInFlightAtEntry;
      if (creationInFlightAtEntry && capability.creationPromise) {
        creationQuiesced = await Promise.race([
          capability.creationPromise.then(
            () => !capability.creationInProgress,
            () => !capability.creationInProgress,
          ),
          new Promise((resolve) =>
            setTimeout(() => resolve(false), creationQuiescenceTimeoutMs),
          ),
        ]);
      }
      if (
        creationInFlightAtEntry ||
        !creationQuiesced ||
        capability.creationInProgress
      ) {
        finalizeFailedFixtureMutations(fixture);
      }
      capability.cleanupReconciling = true;

      // Always bind reconciliation and deletion to the immutable current-run email from capability.
      const syntheticEmail = capability.originalEmail;
      let failed = false;
      if (
        typeof syntheticEmail !== 'string' ||
        !SYNTHETIC_FIXTURE_EMAIL_PATTERN.test(syntheticEmail) ||
        typeof fixture.email !== 'string' ||
        fixture.email !== syntheticEmail
      ) {
        failed = true;
      }

      const attempt = async (operation) => {
        try {
          await operation();
        } catch {
          failed = true;
        }
      };

      const verifySingleAuthUserById = async (candidateId) => {
        const response = await db(
          key,
          `/auth/v1/admin/users/${encodeURIComponent(candidateId)}`,
          {
            api,
            env,
            fetchFn: effectiveFetchFn,
            stage: 'CLEANUP',
            allowStatuses: [404],
            returnRawResponse: true,
          },
        );
        if (response.status !== 200) {
          return {
            verified: false,
            status: response.status,
            contradictory: false,
          };
        }
        const payload = await response.json();
        const userObj =
          payload && typeof payload === 'object' && !Array.isArray(payload)
            ? (payload.user ?? payload)
            : null;
        if (
          userObj &&
          typeof userObj === 'object' &&
          !Array.isArray(userObj) &&
          typeof userObj.id === 'string' &&
          userObj.id === candidateId &&
          typeof userObj.email === 'string' &&
          userObj.email === syntheticEmail
        ) {
          return { verified: true, status: 200, contradictory: false };
        }
        return { verified: false, status: 200, contradictory: true };
      };

      // 1. Verify synthetic auth identity ownership (never trust unverified or mutated fixture.auth).
      const providedAuthId =
        fixture.auth !== undefined && fixture.auth !== null
          ? fixture.auth
          : null;
      let verifiedProvidedAuthId = null;
      let verifiedAuthId = null;
      let contradictoryAuthDetected = false;

      if (providedAuthId !== null) {
        if (
          !isSafeIdentifier(providedAuthId) ||
          (capability.confirmedAuthId !== null &&
            providedAuthId !== capability.confirmedAuthId) ||
          (capability.confirmedAuthId === null &&
            !capability.dispatchedStages.has('auth'))
        ) {
          failed = true;
        } else {
          await attempt(async () => {
            const check = await verifySingleAuthUserById(providedAuthId);
            if (check.verified) {
              verifiedProvidedAuthId = providedAuthId;
            } else {
              failed = true;
              if (check.contradictory) {
                contradictoryAuthDetected = true;
              }
            }
          });
        }
      }

      // Also bounded-reconcile across all auth user pages so auth-only or email-only resources
      // beyond page 1 (>1000 users) are found and incomplete/duplicated pagination fails closed.
      await attempt(async () => {
        const seenAuthUserIds = new Set();
        const matchingAuthUsers = [];
        let declaredTotal = null;
        let declaredLastPage = null;
        let paginationComplete = false;

        for (let page = 1; page <= maxPages; page += 1) {
          const authPayload = await db(
            key,
            `/auth/v1/admin/users?per_page=${pageSize}&page=${page}`,
            {
              api,
              env,
              fetchFn: effectiveFetchFn,
              stage: 'CLEANUP',
            },
          );
          const isArrayPayload = Array.isArray(authPayload);
          const isObjectPayload =
            Boolean(authPayload) &&
            typeof authPayload === 'object' &&
            !isArrayPayload;
          const users = isArrayPayload
            ? authPayload
            : isObjectPayload && Array.isArray(authPayload.users)
              ? authPayload.users
              : null;
          if (!users) {
            failed = true;
            break;
          }

          if (isObjectPayload) {
            if (
              authPayload.truncated === true ||
              authPayload.incomplete === true
            ) {
              failed = true;
            }
            const rawTotal = authPayload.total ?? authPayload.total_users;
            if (rawTotal !== undefined && rawTotal !== null) {
              if (
                typeof rawTotal !== 'number' ||
                !Number.isInteger(rawTotal) ||
                rawTotal < 0 ||
                (declaredTotal !== null && declaredTotal !== rawTotal)
              ) {
                failed = true;
                break;
              }
              declaredTotal = rawTotal;
            }
            const rawLastPage = authPayload.lastPage ?? authPayload.last_page;
            if (rawLastPage !== undefined && rawLastPage !== null) {
              if (
                typeof rawLastPage !== 'number' ||
                !Number.isInteger(rawLastPage) ||
                rawLastPage < 0 ||
                (declaredLastPage !== null && declaredLastPage !== rawLastPage)
              ) {
                failed = true;
                break;
              }
              declaredLastPage = rawLastPage;
            }
          }

          const rawNextPage = isObjectPayload
            ? (authPayload.nextPage ?? authPayload.next_page)
            : undefined;
          let hasExplicitNextPage = false;
          if (
            rawNextPage !== undefined &&
            rawNextPage !== null &&
            rawNextPage !== '' &&
            rawNextPage !== false &&
            rawNextPage !== 0
          ) {
            if (
              typeof rawNextPage !== 'number' ||
              !Number.isInteger(rawNextPage) ||
              rawNextPage !== page + 1
            ) {
              failed = true;
              break;
            }
            hasExplicitNextPage = true;
          }

          const rawHasMore = isObjectPayload
            ? (authPayload.hasMore ?? authPayload.has_more)
            : undefined;
          let hasMoreFlag = false;
          if (rawHasMore !== undefined && rawHasMore !== null) {
            if (typeof rawHasMore !== 'boolean') {
              failed = true;
              break;
            }
            hasMoreFlag = rawHasMore;
          }

          if (users.length > pageSize) {
            failed = true;
          }

          let pageHadDuplicateIds = false;
          let newIdsOnPage = 0;
          for (const candidate of users) {
            if (
              !candidate ||
              typeof candidate !== 'object' ||
              Array.isArray(candidate) ||
              !isSafeIdentifier(candidate.id) ||
              typeof candidate.email !== 'string' ||
              candidate.email.length === 0
            ) {
              failed = true;
              continue;
            }
            if (seenAuthUserIds.has(candidate.id)) {
              failed = true;
              pageHadDuplicateIds = true;
            } else {
              seenAuthUserIds.add(candidate.id);
              newIdsOnPage += 1;
            }
            if (
              (verifiedProvidedAuthId !== null &&
                candidate.id === verifiedProvidedAuthId &&
                candidate.email !== syntheticEmail) ||
              (capability.confirmedAuthId !== null &&
                candidate.id === capability.confirmedAuthId &&
                candidate.email !== syntheticEmail)
            ) {
              failed = true;
              contradictoryAuthDetected = true;
              verifiedProvidedAuthId = null;
            }
            if (candidate.email === syntheticEmail) {
              if (!matchingAuthUsers.some((item) => item.id === candidate.id)) {
                matchingAuthUsers.push(candidate);
              } else {
                failed = true;
              }
            }
          }

          const moreByTotal =
            declaredTotal !== null && seenAuthUserIds.size < declaredTotal;
          const moreByLastPage =
            declaredLastPage !== null && page < declaredLastPage;
          const fullPage = users.length === pageSize;
          const needsMorePages =
            hasExplicitNextPage ||
            hasMoreFlag ||
            moreByTotal ||
            moreByLastPage ||
            fullPage;

          if (
            users.length === 0 &&
            (hasExplicitNextPage ||
              hasMoreFlag ||
              moreByTotal ||
              moreByLastPage)
          ) {
            failed = true;
            break;
          }
          if (pageHadDuplicateIds && newIdsOnPage === 0) {
            failed = true;
            break;
          }
          if (needsMorePages) {
            if (page >= maxPages) {
              failed = true;
              break;
            }
            continue;
          }

          if (
            declaredTotal !== null &&
            seenAuthUserIds.size !== declaredTotal
          ) {
            failed = true;
            break;
          }
          if (
            declaredLastPage !== null &&
            page !== declaredLastPage &&
            !(declaredLastPage === 0 && seenAuthUserIds.size === 0)
          ) {
            failed = true;
            break;
          }
          paginationComplete = true;
          break;
        }

        if (!paginationComplete) {
          failed = true;
        }

        if (matchingAuthUsers.length > 1 || contradictoryAuthDetected) {
          failed = true;
          contradictoryAuthDetected = true;
          verifiedAuthId = null;
          return;
        }

        if (matchingAuthUsers.length === 1) {
          const matched = matchingAuthUsers[0];
          if (!isSafeIdentifier(matched?.id)) {
            failed = true;
            contradictoryAuthDetected = true;
            verifiedAuthId = null;
            return;
          }
          if (
            (verifiedProvidedAuthId !== null &&
              verifiedProvidedAuthId !== matched.id) ||
            (capability.confirmedAuthId !== null &&
              capability.confirmedAuthId !== matched.id)
          ) {
            failed = true;
            contradictoryAuthDetected = true;
            verifiedAuthId = null;
            return;
          }
          if (verifiedProvidedAuthId === matched.id) {
            verifiedAuthId = matched.id;
            return;
          }
          const singleCheck = await verifySingleAuthUserById(matched.id);
          if (singleCheck.verified) {
            verifiedAuthId = matched.id;
          } else {
            failed = true;
            contradictoryAuthDetected = true;
            verifiedAuthId = null;
          }
          return;
        }

        // matchingAuthUsers.length === 0 across inspected pages
        if (verifiedProvidedAuthId !== null) {
          failed = true;
          verifiedAuthId = verifiedProvidedAuthId;
          return;
        }
        if (capability.confirmedAuthId !== null && !contradictoryAuthDetected) {
          failed = true;
          const confirmedCheck = await verifySingleAuthUserById(
            capability.confirmedAuthId,
          );
          if (confirmedCheck.verified) {
            verifiedAuthId = capability.confirmedAuthId;
          }
          return;
        }
        if (
          capability.confirmedStages.has('auth') ||
          fixture.mutations?.auth?.confirmed === true
        ) {
          failed = true;
        }
      });

      if (
        verifiedAuthId === null &&
        !contradictoryAuthDetected &&
        capability.confirmedAuthId !== null
      ) {
        await attempt(async () => {
          const confirmedCheck = await verifySingleAuthUserById(
            capability.confirmedAuthId,
          );
          if (confirmedCheck.verified) {
            verifiedAuthId = capability.confirmedAuthId;
          }
        });
      }

      // 2. Verify application profile ownership (id, synthetic email, and linked verifiedAuthId).
      const providedProfileId =
        fixture.profile !== undefined && fixture.profile !== null
          ? fixture.profile
          : null;
      let verifiedProvidedProfileId = null;
      let verifiedProfileId = null;

      const isValidSyntheticProfileRow = (row, expectedId = null) =>
        Boolean(
          row &&
          typeof row === 'object' &&
          !Array.isArray(row) &&
          isSafeIdentifier(row.id) &&
          (expectedId === null || row.id === expectedId) &&
          (capability.confirmedProfileId === null ||
            row.id === capability.confirmedProfileId) &&
          typeof row.email === 'string' &&
          row.email === syntheticEmail &&
          isSafeIdentifier(row.auth_user_id) &&
          verifiedAuthId !== null &&
          row.auth_user_id === verifiedAuthId,
        );

      if (providedProfileId !== null) {
        if (
          !isSafeIdentifier(providedProfileId) ||
          (capability.confirmedProfileId !== null &&
            providedProfileId !== capability.confirmedProfileId) ||
          (capability.confirmedProfileId === null &&
            !capability.dispatchedStages.has('profile'))
        ) {
          failed = true;
        } else {
          await attempt(async () => {
            const rowsById = await db(
              key,
              `/rest/v1/users?id=eq.${encodeURIComponent(providedProfileId)}&select=id,auth_user_id,email`,
              {
                schema: 'app',
                api,
                env,
                fetchFn: effectiveFetchFn,
                stage: 'CLEANUP',
              },
            );
            if (
              Array.isArray(rowsById) &&
              rowsById.length === 1 &&
              isValidSyntheticProfileRow(rowsById[0], providedProfileId)
            ) {
              verifiedProvidedProfileId = providedProfileId;
            } else {
              failed = true;
            }
          });
        }
      }

      await attempt(async () => {
        const rowsByEmail = await db(
          key,
          `/rest/v1/users?email=eq.${encodeURIComponent(syntheticEmail)}&select=id,auth_user_id,email`,
          {
            schema: 'app',
            api,
            env,
            fetchFn: effectiveFetchFn,
            stage: 'CLEANUP',
          },
        );
        if (!Array.isArray(rowsByEmail)) {
          failed = true;
          verifiedProfileId = null;
          return;
        }
        if (rowsByEmail.length > 1) {
          failed = true;
          verifiedProfileId = null;
          return;
        }
        if (rowsByEmail.length === 1) {
          const emailRow = rowsByEmail[0];
          if (!isValidSyntheticProfileRow(emailRow)) {
            failed = true;
            verifiedProfileId = null;
            return;
          }
          if (
            verifiedProvidedProfileId !== null &&
            verifiedProvidedProfileId !== emailRow.id
          ) {
            failed = true;
            verifiedProfileId = null;
            return;
          }
          if (verifiedProvidedProfileId === emailRow.id) {
            verifiedProfileId = emailRow.id;
            return;
          }
          const rowsById = await db(
            key,
            `/rest/v1/users?id=eq.${encodeURIComponent(emailRow.id)}&select=id,auth_user_id,email`,
            {
              schema: 'app',
              api,
              env,
              fetchFn: effectiveFetchFn,
              stage: 'CLEANUP',
            },
          );
          if (
            Array.isArray(rowsById) &&
            rowsById.length === 1 &&
            isValidSyntheticProfileRow(rowsById[0], emailRow.id)
          ) {
            verifiedProfileId = emailRow.id;
          } else {
            failed = true;
            verifiedProfileId = null;
          }
          return;
        }
        if (
          verifiedProvidedProfileId !== null ||
          capability.confirmedProfileId !== null ||
          capability.confirmedStages.has('profile') ||
          fixture.mutations?.profile?.confirmed === true
        ) {
          failed = true;
          verifiedProfileId = null;
        }
      });

      // 3. Verify organization membership ownership and association with verifiedProfileId, organizationId, and roleId.
      if (
        fixture.organizationId !== undefined &&
        fixture.organizationId !== null &&
        (!isSafeIdentifier(fixture.organizationId) ||
          (capability.confirmedOrganizationId !== null &&
            fixture.organizationId !== capability.confirmedOrganizationId))
      ) {
        failed = true;
      }
      if (
        fixture.roleId !== undefined &&
        fixture.roleId !== null &&
        (!isSafeIdentifier(fixture.roleId) ||
          (capability.confirmedRoleId !== null &&
            fixture.roleId !== capability.confirmedRoleId))
      ) {
        failed = true;
      }

      const expectedOrganizationId =
        capability.confirmedOrganizationId ??
        (isSafeIdentifier(fixture.organizationId)
          ? fixture.organizationId
          : null);
      const expectedRoleId =
        capability.confirmedRoleId ??
        (isSafeIdentifier(fixture.roleId) ? fixture.roleId : null);

      if (fixture.membership !== undefined && fixture.membership !== null) {
        const mRef = fixture.membership;
        if (
          typeof mRef !== 'object' ||
          Array.isArray(mRef) ||
          !verifiedProfileId ||
          mRef.user_id !== verifiedProfileId ||
          !expectedOrganizationId ||
          mRef.organization_id !== expectedOrganizationId ||
          !isSafeIdentifier(mRef.role_id) ||
          (expectedRoleId !== null && mRef.role_id !== expectedRoleId) ||
          (mRef.status !== undefined && mRef.status !== 'ACTIVE')
        ) {
          failed = true;
        }
      }

      let verifiedMembership = null;
      if (verifiedProfileId !== null) {
        await attempt(async () => {
          const membershipRows = await db(
            key,
            `/rest/v1/organization_members?user_id=eq.${encodeURIComponent(verifiedProfileId)}&select=organization_id,user_id,role_id,status`,
            {
              schema: 'app',
              api,
              env,
              fetchFn: effectiveFetchFn,
              stage: 'CLEANUP',
            },
          );
          if (!Array.isArray(membershipRows)) {
            failed = true;
            return;
          }
          if (membershipRows.length > 1) {
            failed = true;
            return;
          }
          if (membershipRows.length === 1) {
            const mRow = membershipRows[0];
            const validMembershipRow = Boolean(
              mRow &&
              typeof mRow === 'object' &&
              !Array.isArray(mRow) &&
              mRow.user_id === verifiedProfileId &&
              isSafeIdentifier(mRow.organization_id) &&
              expectedOrganizationId !== null &&
              mRow.organization_id === expectedOrganizationId &&
              isSafeIdentifier(mRow.role_id) &&
              (expectedRoleId === null || mRow.role_id === expectedRoleId) &&
              (mRow.status === undefined || mRow.status === 'ACTIVE'),
            );
            if (validMembershipRow) {
              verifiedMembership = {
                user_id: mRow.user_id,
                organization_id: mRow.organization_id,
                role_id: mRow.role_id,
              };
            } else {
              failed = true;
            }
            return;
          }
          if (
            capability.confirmedMembership === true ||
            capability.confirmedStages.has('membership') ||
            fixture.membershipCreated === true ||
            fixture.mutations?.membership?.confirmed === true
          ) {
            failed = true;
          }
        });
      } else if (
        capability.confirmedMembership === true ||
        capability.confirmedStages.has('membership') ||
        fixture.membershipCreated === true ||
        fixture.mutations?.membership?.confirmed === true
      ) {
        failed = true;
      }

      // 4. Execute strictly scoped deletions only for ownership-verified current-run synthetic resources.
      if (verifiedMembership !== null) {
        await attempt(() =>
          db(
            key,
            `/rest/v1/organization_members?user_id=eq.${encodeURIComponent(verifiedMembership.user_id)}&organization_id=eq.${encodeURIComponent(verifiedMembership.organization_id)}&role_id=eq.${encodeURIComponent(verifiedMembership.role_id)}`,
            {
              method: 'DELETE',
              schema: 'app',
              api,
              env,
              fetchFn: effectiveFetchFn,
              stage: 'CLEANUP',
            },
          ),
        );
      }

      if (verifiedProfileId !== null && verifiedAuthId !== null) {
        await attempt(() =>
          db(
            key,
            `/rest/v1/users?id=eq.${encodeURIComponent(verifiedProfileId)}&email=eq.${encodeURIComponent(syntheticEmail)}&auth_user_id=eq.${encodeURIComponent(verifiedAuthId)}`,
            {
              method: 'DELETE',
              schema: 'app',
              api,
              env,
              fetchFn: effectiveFetchFn,
              stage: 'CLEANUP',
            },
          ),
        );
      }

      if (verifiedAuthId !== null) {
        await attempt(() =>
          db(
            key,
            `/auth/v1/admin/users/${encodeURIComponent(verifiedAuthId)}`,
            {
              method: 'DELETE',
              api,
              env,
              fetchFn: effectiveFetchFn,
              stage: 'CLEANUP',
              allowStatuses: [404],
            },
          ),
        );
      }

      // 5. Post-deletion absence verification for verified synthetic resources.
      if (verifiedMembership !== null) {
        await attempt(async () => {
          const remainingMemberships = await db(
            key,
            `/rest/v1/organization_members?user_id=eq.${encodeURIComponent(verifiedMembership.user_id)}&organization_id=eq.${encodeURIComponent(verifiedMembership.organization_id)}&role_id=eq.${encodeURIComponent(verifiedMembership.role_id)}&select=user_id`,
            {
              schema: 'app',
              api,
              env,
              fetchFn: effectiveFetchFn,
              stage: 'CLEANUP',
            },
          );
          assert.deepEqual(
            remainingMemberships,
            [],
            'Synthetic organization membership must be absent',
          );
        });
      }

      if (verifiedProfileId !== null) {
        await attempt(async () => {
          const remaining = await db(
            key,
            `/rest/v1/users?id=eq.${encodeURIComponent(verifiedProfileId)}&select=id`,
            {
              schema: 'app',
              api,
              env,
              fetchFn: effectiveFetchFn,
              stage: 'CLEANUP',
            },
          );
          assert.deepEqual(remaining, [], 'Synthetic profile must be absent');
        });
        await attempt(async () => {
          const remainingByEmail = await db(
            key,
            `/rest/v1/users?email=eq.${encodeURIComponent(syntheticEmail)}&select=id`,
            {
              schema: 'app',
              api,
              env,
              fetchFn: effectiveFetchFn,
              stage: 'CLEANUP',
            },
          );
          assert.deepEqual(
            remainingByEmail,
            [],
            'Synthetic profile by email must be absent',
          );
        });
      }

      if (verifiedAuthId !== null) {
        await attempt(async () => {
          const response = await db(
            key,
            `/auth/v1/admin/users/${encodeURIComponent(verifiedAuthId)}`,
            {
              api,
              env,
              fetchFn: effectiveFetchFn,
              stage: 'CLEANUP',
              allowStatuses: [404],
              returnRawResponse: true,
            },
          );
          assert.equal(
            response.status,
            404,
            'Synthetic auth user must be absent',
          );
        });
      }

      const capabilityAmbiguousStages = FIXTURE_MUTATION_STAGES.filter(
        (stageKey) =>
          capability.stickyAmbiguousStages.has(stageKey) ||
          (capability.dispatchedStages.has(stageKey) &&
            !capability.confirmedStages.has(stageKey)),
      );
      const fixtureAmbiguousStages = getAmbiguousMutationStages(fixture);
      if (
        capabilityAmbiguousStages.some(
          (stageKey) => !fixtureAmbiguousStages.includes(stageKey),
        )
      ) {
        failed = true;
      }

      if (failed) {
        throw new QaError(
          'CLEANUP',
          'FIXTURE_CLEANUP_FAILED',
          'Synthetic fixture cleanup verification failed',
        );
      }
      if (
        hasAmbiguousFixtureMutation(fixture) ||
        capabilityAmbiguousStages.length > 0
      ) {
        const unverifiedResult = {
          attempted: true,
          status: 'UNVERIFIED',
          reason: 'MUTATION_OUTCOME_AMBIGUOUS',
          ambiguousMutations: Array.from(
            new Set([...fixtureAmbiguousStages, ...capabilityAmbiguousStages]),
          ),
        };
        capability.lastCleanupResult = unverifiedResult;
        return unverifiedResult;
      }
      if (
        creationInFlightAtEntry ||
        !creationQuiesced ||
        capability.creationInProgress
      ) {
        const quiescenceResult = {
          attempted: true,
          status: 'UNVERIFIED',
          reason: 'FIXTURE_QUIESCENCE_TIMEOUT',
          executionQuiesced: creationQuiesced && !capability.creationInProgress,
        };
        capability.lastCleanupResult = quiescenceResult;
        return quiescenceResult;
      }
      const passResult = { attempted: true, status: 'PASS' };
      capability.lastCleanupResult = passResult;
      return passResult;
    } catch (cleanupError) {
      capability.lastCleanupError = cleanupError;
      throw cleanupError;
    } finally {
      capability.cleanupInProgress = false;
      capability.cleanupCompleted = true;
      capability.invalidated = true;
    }
  })();
  cleanupExecutionPromise.catch(() => {});
  capability.cleanupPromise = cleanupExecutionPromise;
  return cleanupExecutionPromise;
}

export async function createFixture(
  key,
  {
    api = CANONICAL_API_ORIGIN,
    env,
    fetchFn = fetch,
    signal,
    drainSignal,
    fixture: providedFixture,
    deferCleanup,
    pageSize,
    maxPages,
    creationQuiescenceTimeoutMs,
  } = {},
) {
  assertConsistentSupabaseEnv(api, env, {
    stage: 'FIXTURE_CREATION',
    code: 'NONLOCAL_TARGET_BLOCKED',
  });
  if (typeof key !== 'string' || key.trim().length === 0) {
    throw new QaError(
      'FIXTURE_CREATION',
      'FIXTURE_CREATION_FAILED',
      'Synthetic fixture creation requires a valid service key',
    );
  }
  const activeContext = getActiveOwnerInvocationContext();
  if (!activeContext) {
    throw new QaError(
      'FIXTURE_CREATION',
      'FIXTURE_CREATION_FAILED',
      'Refusing synthetic fixture creation outside an active withFixtureInvocation or runQaHarness owner context',
    );
  }
  const effectiveSignal = signal ?? activeContext.signal;
  const effectiveDrainSignal =
    drainSignal ?? activeContext.drainSignal ?? effectiveSignal;
  const effectiveDeferCleanup =
    deferCleanup ?? activeContext.deferCleanup ?? false;

  let fixture;
  if (providedFixture !== undefined && providedFixture !== null) {
    if (typeof providedFixture !== 'object' || Array.isArray(providedFixture)) {
      throw new QaError(
        'FIXTURE_CREATION',
        'FIXTURE_CREATION_FAILED',
        'Refusing invalid synthetic fixture state reference',
      );
    }
    fixture = providedFixture;
  } else if (activeContext.fixture) {
    fixture = activeContext.fixture;
  } else {
    fixture = createFixtureState();
  }

  const capability = fixtureCapabilities.get(fixture);
  if (
    !capability ||
    capability.fixtureRef !== fixture ||
    capability.invalidated ||
    capability.activated ||
    capability.creationInProgress ||
    capability.cleanupRequested ||
    capability.cleanupInProgress ||
    capability.cleanupCompleted ||
    capability.scopeTeardownRequested ||
    activeContext.scopeTeardownInProgress ||
    capability.harnessInvocationId === null ||
    capability.harnessInvocationId !== activeContext.invocationId
  ) {
    throw new QaError(
      'FIXTURE_CREATION',
      'FIXTURE_CREATION_FAILED',
      'Refusing synthetic fixture creation without an unused current-run ownership capability',
    );
  }
  activeContext.capabilities?.add?.(capability);

  ensureFixtureMutationTracking(fixture);
  if (
    typeof fixture.email !== 'string' ||
    fixture.email !== capability.originalEmail ||
    !SYNTHETIC_FIXTURE_EMAIL_PATTERN.test(capability.originalEmail) ||
    typeof fixture.password !== 'string' ||
    fixture.password !== capability.originalPassword ||
    fixture.auth !== null ||
    fixture.profile !== null ||
    fixture.organizationId !== null ||
    fixture.roleId !== null ||
    fixture.membershipCreated !== false ||
    fixture.mutationStarted !== false ||
    fixture.pendingMutation !== false ||
    hasAmbiguousFixtureMutation(fixture)
  ) {
    capability.invalidated = true;
    throw new QaError(
      'FIXTURE_CREATION',
      'FIXTURE_CREATION_FAILED',
      'Refusing mutated or pre-populated synthetic fixture state before creation',
    );
  }

  capability.activated = true;
  capability.creationInProgress = true;
  capability.apiOrigin = api;
  capability.serviceKey = key;
  capability.fetchFn = fetchFn;
  capability.env = env;
  if (pageSize !== undefined) {
    capability.pageSize = pageSize;
  }
  if (maxPages !== undefined) {
    capability.maxPages = maxPages;
  }
  if (creationQuiescenceTimeoutMs !== undefined) {
    capability.creationQuiescenceTimeoutMs = creationQuiescenceTimeoutMs;
  }
  let resolveCreationSettled;
  capability.creationPromise = new Promise((resolve) => {
    resolveCreationSettled = resolve;
  });
  const markCreationSettled = () => {
    if (capability.creationInProgress) {
      capability.creationInProgress = false;
    }
    resolveCreationSettled?.();
  };
  const lifecycleSignal = combineAbortSignals(
    effectiveSignal,
    capability.creationAbortController.signal,
  );
  const lifecycleDrainSignal = combineAbortSignals(
    effectiveDrainSignal,
    capability.creationAbortController.signal,
  );
  const assertCreationOpen = () => {
    if (
      capability.cleanupRequested ||
      capability.cleanupReconciling ||
      capability.cleanupInProgress ||
      capability.cleanupCompleted ||
      capability.scopeTeardownRequested ||
      activeContext.scopeTeardownInProgress ||
      capability.invalidated ||
      activeContext.invalidated ||
      !activeHarnessInvocations.has(activeContext.invocationId)
    ) {
      throw new QaError(
        'FIXTURE_CREATION',
        'PROCESS_SIGNAL_TERMINATED',
        'Synthetic fixture creation aborted because cleanup or capability invalidation has begun',
      );
    }
    throwIfSignalAborted(lifecycleSignal, 'FIXTURE_CREATION');
  };

  const syntheticEmail = capability.originalEmail;
  const syntheticPassword = capability.originalPassword;

  Object.defineProperty(fixture, 'fetchFn', {
    value: fetchFn,
    enumerable: false,
    configurable: true,
    writable: true,
  });

  const creationExecutionPromise = (async () => {
    try {
      prepareFixtureMutation(fixture, 'auth');

      let org;
      let role;
      try {
        assertCreationOpen();
        const orgRows = await db(
          key,
          '/rest/v1/organizations?select=id&status=eq.ACTIVE&limit=1',
          {
            schema: 'app',
            api,
            env,
            fetchFn,
            signal: lifecycleSignal,
            requestSignal: lifecycleSignal,
            stage: 'FIXTURE_CREATION',
            onBeforeDispatch: () => assertCreationOpen(),
          },
        );
        assertCreationOpen();
        org = Array.isArray(orgRows) ? orgRows[0] : null;
        assert.ok(
          org && isSafeIdentifier(org.id),
          'Disposable organization missing',
        );
        capability.confirmedOrganizationId = org.id;
        fixture.organizationId = org.id;
        assertCreationOpen();
        const roleRows = await db(
          key,
          `/rest/v1/roles?select=id&organization_id=eq.${encodeURIComponent(org.id)}&code=eq.OWNER&limit=1`,
          {
            schema: 'app',
            api,
            env,
            fetchFn,
            signal: lifecycleSignal,
            requestSignal: lifecycleSignal,
            stage: 'FIXTURE_CREATION',
            onBeforeDispatch: () => assertCreationOpen(),
          },
        );
        assertCreationOpen();
        role = Array.isArray(roleRows) ? roleRows[0] : null;
        assert.ok(
          role && isSafeIdentifier(role.id),
          'Disposable OWNER role missing',
        );
        capability.confirmedRoleId = role.id;
        fixture.roleId = role.id;
      } catch (error) {
        markCreationSettled();
        finalizeFailedFixtureMutations(fixture);
        if (
          !effectiveDeferCleanup &&
          !capability.cleanupRequested &&
          !capability.scopeTeardownRequested &&
          !activeContext.scopeTeardownInProgress
        ) {
          await cleanup(key, fixture, { api, env, fetchFn }).catch(() => {});
        }
        if (lifecycleSignal?.aborted) {
          throwIfSignalAborted(lifecycleSignal, 'FIXTURE_CREATION');
        }
        if (error instanceof QaError) {
          throw error;
        }
        throw new QaError(
          'FIXTURE_CREATION',
          'FIXTURE_CREATION_FAILED',
          error instanceof Error
            ? error.message
            : 'Disposable seed lookup failed',
        );
      }

      try {
        prepareFixtureMutation(fixture, 'auth');
        assertCreationOpen();
        const user = await db(key, '/auth/v1/admin/users', {
          method: 'POST',
          body: {
            email: syntheticEmail,
            password: syntheticPassword,
            email_confirm: true,
          },
          api,
          env,
          fetchFn,
          signal: lifecycleSignal,
          requestSignal: lifecycleDrainSignal,
          stage: 'FIXTURE_CREATION',
          onBeforeDispatch: () => {
            assertCreationOpen();
            markFixtureMutationDispatched(fixture, 'auth');
          },
        });
        assert.ok(
          user &&
            typeof user === 'object' &&
            !Array.isArray(user) &&
            isSafeIdentifier(user.id) &&
            user.email === syntheticEmail,
          'Synthetic identity creation failed',
        );
        capability.confirmedAuthId = user.id;
        fixture.auth = user.id;
        markFixtureMutationConfirmed(fixture, 'auth');

        prepareFixtureMutation(fixture, 'profile');
        assertCreationOpen();
        const profiles = await db(key, '/rest/v1/users', {
          method: 'POST',
          schema: 'app',
          body: {
            auth_user_id: capability.confirmedAuthId,
            name: 'CI Synthetic Operator',
            email: syntheticEmail,
            status: 'ACTIVE',
          },
          api,
          env,
          fetchFn,
          signal: lifecycleSignal,
          requestSignal: lifecycleDrainSignal,
          stage: 'FIXTURE_CREATION',
          onBeforeDispatch: () => {
            assertCreationOpen();
            markFixtureMutationDispatched(fixture, 'profile');
          },
        });
        const createdProfile =
          Array.isArray(profiles) && profiles.length === 1 ? profiles[0] : null;
        assert.ok(
          createdProfile &&
            typeof createdProfile === 'object' &&
            !Array.isArray(createdProfile) &&
            isSafeIdentifier(createdProfile.id) &&
            createdProfile.email === syntheticEmail &&
            createdProfile.auth_user_id === capability.confirmedAuthId,
          'Synthetic app user creation failed',
        );
        capability.confirmedProfileId = createdProfile.id;
        fixture.profile = createdProfile.id;
        markFixtureMutationConfirmed(fixture, 'profile');

        prepareFixtureMutation(fixture, 'membership');
        assertCreationOpen();
        const memberships = await db(key, '/rest/v1/organization_members', {
          method: 'POST',
          schema: 'app',
          body: {
            organization_id: org.id,
            user_id: capability.confirmedProfileId,
            role_id: role.id,
            status: 'ACTIVE',
          },
          api,
          env,
          fetchFn,
          signal: lifecycleSignal,
          requestSignal: lifecycleDrainSignal,
          stage: 'FIXTURE_CREATION',
          onBeforeDispatch: () => {
            assertCreationOpen();
            markFixtureMutationDispatched(fixture, 'membership');
          },
        });
        assert.ok(
          isValidConfirmedMembershipResponse(memberships, {
            expectedUserId: capability.confirmedProfileId,
            expectedOrganizationId: org.id,
            expectedRoleId: role.id,
          }),
          'Synthetic organization membership creation failed',
        );
        capability.confirmedMembership = true;
        markFixtureMutationConfirmed(fixture, 'membership');
        fixture.membershipCreated = true;
        assertCreationOpen();
        return fixture;
      } catch (error) {
        markCreationSettled();
        finalizeFailedFixtureMutations(fixture);
        if (
          !effectiveDeferCleanup &&
          !capability.cleanupRequested &&
          !capability.scopeTeardownRequested &&
          !activeContext.scopeTeardownInProgress
        ) {
          await cleanup(key, fixture, { api, env, fetchFn }).catch(() => {});
        }
        if (lifecycleSignal?.aborted) {
          throwIfSignalAborted(lifecycleSignal, 'FIXTURE_CREATION');
        }
        if (error instanceof QaError) {
          throw error;
        }
        throw new QaError(
          'FIXTURE_CREATION',
          'FIXTURE_CREATION_FAILED',
          error instanceof Error
            ? error.message
            : 'Synthetic fixture creation failed',
        );
      }
    } finally {
      markCreationSettled();
    }
  })();
  creationExecutionPromise.catch(() => {});
  return creationExecutionPromise;
}

class Cdp {
  constructor(url, { app = CANONICAL_APP_ORIGIN } = {}) {
    this.url = url;
    this.app = app;
    this.id = 0;
    this.pending = new Map();
    this.requests = [];
    this.closed = false;
    this.closeReason = null;
  }

  async connect() {
    this.ws = new WebSocket(this.url);
    await new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(
          new QaError(
            'BROWSER_START',
            'CDP_CONNECT_TIMED_OUT',
            'Timed out connecting to Chromium DevTools WebSocket',
          ),
        );
      }, 15000);
      this.ws.addEventListener(
        'open',
        () => {
          clearTimeout(timer);
          resolve();
        },
        { once: true },
      );
      this.ws.addEventListener(
        'error',
        () => {
          clearTimeout(timer);
          reject(
            new QaError(
              'BROWSER_START',
              'CDP_SOCKET_ERROR',
              'Chromium DevTools WebSocket connection error',
            ),
          );
        },
        { once: true },
      );
    });

    this.ws.addEventListener('message', (event) => {
      let packet;
      try {
        packet = JSON.parse(String(event.data));
      } catch {
        return;
      }
      if (packet.method === 'Network.requestWillBeSent') {
        try {
          const url = new URL(packet.params.request.url);
          if (url.origin === this.app) {
            this.requests.push({
              method: packet.params.request.method,
              path: url.pathname,
            });
          }
        } catch {
          // Non-HTTP events are not stored.
        }
      }
      if (!packet.id) return;
      const pending = this.pending.get(packet.id);
      if (!pending) return;
      clearTimeout(pending.timer);
      this.pending.delete(packet.id);
      if (packet.error) {
        pending.reject(new Error(`CDP command failed: ${pending.method}`));
      } else {
        pending.resolve(packet.result);
      }
    });

    const markClosed = (reason) => {
      this.closed = true;
      this.closeReason = this.closeReason ?? reason;
      for (const [, entry] of this.pending) {
        clearTimeout(entry.timer);
        entry.reject(
          new QaError(
            'BROWSER_AUTH',
            'CDP_CONNECTION_CLOSED',
            `Chromium DevTools connection closed (${this.closeReason})`,
          ),
        );
      }
      this.pending.clear();
    };

    this.ws.addEventListener('close', () => markClosed('socket_close'));
    this.ws.addEventListener('error', () => markClosed('socket_error'));

    await this.send('Page.enable');
    await this.send('Runtime.enable');
    await this.send('Network.enable');
  }

  assertConnected(stage = 'BROWSER_AUTH') {
    if (this.closed) {
      throw new QaError(
        stage,
        'CDP_CONNECTION_CLOSED',
        `Chromium DevTools connection closed (${this.closeReason ?? 'closed'})`,
      );
    }
  }

  send(method, params = {}) {
    this.assertConnected();
    return new Promise((resolve, reject) => {
      const id = ++this.id;
      const timer = setTimeout(() => {
        this.pending.delete(id);
        reject(
          new QaError(
            'BROWSER_AUTH',
            'CDP_COMMAND_TIMED_OUT',
            `Browser protocol timed out: ${method}`,
            { cdpMethod: method },
          ),
        );
      }, 15000);
      this.pending.set(id, { method, resolve, reject, timer });
      try {
        this.ws.send(JSON.stringify({ id, method, params }));
      } catch {
        clearTimeout(timer);
        this.pending.delete(id);
        reject(
          new QaError(
            'BROWSER_AUTH',
            'CDP_CONNECTION_CLOSED',
            `Failed to send CDP command: ${method}`,
            { cdpMethod: method },
          ),
        );
      }
    });
  }

  async eval(expression) {
    const response = await this.send('Runtime.evaluate', {
      expression,
      awaitPromise: true,
      returnByValue: true,
    });
    if (response.exceptionDetails) {
      throw new Error('Browser assertion expression failed');
    }
    return response.result?.value;
  }

  async goto(route, expected = route, { checkHealth, signal } = {}) {
    throwIfSignalAborted(signal, 'BROWSER_AUTH');
    const before = await this.eval('performance.timeOrigin');
    throwIfSignalAborted(signal, 'BROWSER_AUTH');
    await this.send('Page.navigate', { url: `${this.app}${route}` });
    await until(
      async () => {
        const state = await this.eval(`({
          route: location.pathname,
          origin: performance.timeOrigin,
          ready: document.readyState
        })`);
        return (
          state.origin !== before &&
          state.route === expected &&
          state.ready !== 'loading'
        );
      },
      `Navigation ${route}`,
      30000,
      { checkHealth, signal, stage: 'BROWSER_AUTH' },
    );
  }

  posts(route) {
    return this.requests.filter(
      (request) => request.method === 'POST' && request.path === route,
    ).length;
  }

  async session() {
    const response = await this.send('Network.getCookies', {
      urls: [this.app],
    });
    return response.cookies
      .filter((cookie) => cookie.name === 'mgbos_session')
      .map((cookie) => ({
        httpOnly: cookie.httpOnly,
        sameSite: cookie.sameSite,
        secure: cookie.secure,
      }));
  }

  async screenshot(file) {
    const { data } = await this.send('Page.captureScreenshot', {
      format: 'png',
    });
    writeFileSync(file, Buffer.from(data, 'base64'));
  }

  close() {
    this.closed = true;
    this.closeReason = this.closeReason ?? 'explicit_close';
    for (const [, entry] of this.pending) {
      clearTimeout(entry.timer);
      entry.reject(
        new QaError(
          'BROWSER_AUTH',
          'CDP_CONNECTION_CLOSED',
          `Chromium DevTools connection closed (${this.closeReason})`,
        ),
      );
    }
    this.pending.clear();
    try {
      this.ws?.close();
    } catch {
      // Ignore close errors during teardown.
    }
  }
}

function chromeExecutable() {
  for (const name of [
    process.env.CHROME_BIN,
    process.env.CHROME_PATH,
    'google-chrome',
    'google-chrome-stable',
    'chromium',
    'chromium-browser',
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  ]) {
    if (!name) continue;
    if (process.platform !== 'win32') {
      const probe = spawnSync('which', [name], { encoding: 'utf8' });
      if (probe.status === 0) return probe.stdout.trim();
    }
    if (existsSync(name)) return name;
  }
  throw new QaError(
    'BROWSER_START',
    'BROWSER_START_FAILED',
    'Chromium is unavailable in isolated QA runner',
  );
}

export async function startBrowser({
  app = CANONICAL_APP_ORIGIN,
  spawnFn = spawn,
  fetchFn = fetch,
  signal,
} = {}) {
  throwIfSignalAborted(signal, 'BROWSER_START');
  assertLoopbackHttpOrigin(app, 'BROWSER_START');
  const profile = mkdtempSync(path.join(tmpdir(), 'mgbos-ci-cdp-'));
  const browser = spawnFn(
    chromeExecutable(),
    [
      '--headless=new',
      '--no-sandbox',
      '--disable-gpu',
      '--no-first-run',
      '--disable-background-networking',
      '--remote-debugging-address=127.0.0.1',
      '--remote-debugging-port=0',
      '--host-resolver-rules=MAP * ~NOTFOUND, EXCLUDE localhost, EXCLUDE 127.0.0.1',
      `--user-data-dir=${profile}`,
      'about:blank',
    ],
    {
      stdio: 'ignore',
      detached: process.platform !== 'win32',
    },
  );
  try {
    const filename = path.join(profile, 'DevToolsActivePort');
    const port = await until(
      () => {
        if (browser.exitCode !== null || browser.signalCode !== null) {
          throw new QaError(
            'BROWSER_START',
            'BROWSER_START_FAILED',
            'Headless Chromium exited before DevTools endpoint became ready',
            {
              process: 'browser',
              exitCode: browser.exitCode,
              signal: browser.signalCode,
            },
          );
        }
        return existsSync(filename)
          ? Number(readFileSync(filename, 'utf8').split('\n')[0])
          : false;
      },
      'Local browser debugging endpoint',
      20000,
      { signal, stage: 'BROWSER_START' },
    );
    throwIfSignalAborted(signal, 'BROWSER_START');
    const response = await fetchFn(
      `http://127.0.0.1:${port}/json/new?${encodeURIComponent(`${app}/login`)}`,
      { method: 'PUT', signal },
    );
    assert.ok(response.ok, 'Browser debugging target unavailable');
    const target = await response.json();
    assert.ok(
      target.webSocketDebuggerUrl?.startsWith('ws://127.0.0.1:'),
      'Browser debugging must bind to loopback',
    );
    const cdp = new Cdp(target.webSocketDebuggerUrl, { app });
    await cdp.connect();
    throwIfSignalAborted(signal, 'BROWSER_START');
    return { browser, cdp, profile };
  } catch (error) {
    await terminateSubprocess(browser, {
      initialSignal: 'SIGTERM',
      forceSignal: 'SIGKILL',
      graceMs: 2000,
    }).catch(() => {});
    try {
      rmSync(profile, {
        recursive: true,
        force: true,
        maxRetries: 5,
        retryDelay: 100,
      });
    } catch {
      // Best-effort cleanup on failed browser startup.
    }
    if (error instanceof QaError) {
      throw error;
    }
    throw new QaError(
      'BROWSER_START',
      'BROWSER_START_FAILED',
      error instanceof Error
        ? error.message
        : 'Headless Chromium failed to initialize DevTools session',
    );
  }
}

export async function terminateSubprocess(
  proc,
  { initialSignal = 'SIGTERM', forceSignal = 'SIGKILL', graceMs = 3000 } = {},
) {
  if (!proc) {
    return { terminated: true, forced: false };
  }
  if (proc.exitCode !== null || proc.signalCode !== null) {
    return { terminated: true, forced: false };
  }

  const waitForProcessExit = (timeoutMs) =>
    new Promise((resolve) => {
      if (proc.exitCode !== null || proc.signalCode !== null) {
        resolve(true);
        return;
      }
      let settled = false;
      const done = (exited) => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        proc.removeListener?.('exit', onExit);
        proc.removeListener?.('close', onExit);
        resolve(exited);
      };
      const onExit = () => done(true);
      const timer = setTimeout(() => done(false), timeoutMs);
      proc.once?.('exit', onExit);
      proc.once?.('close', onExit);
    });

  const sendKill = (signal) => {
    if (
      process.platform !== 'win32' &&
      typeof proc.pid === 'number' &&
      proc.pid > 0
    ) {
      try {
        process.kill(-proc.pid, signal);
        return;
      } catch {
        // Fall back to direct child kill if process group kill is unavailable.
      }
    }
    if (
      process.platform === 'win32' &&
      typeof proc.pid === 'number' &&
      proc.pid > 0
    ) {
      spawnSync('taskkill', ['/PID', String(proc.pid), '/T', '/F'], {
        stdio: 'ignore',
        timeout: 5000,
      });
    }
    try {
      proc.kill(signal);
    } catch {
      // Ignore if already exited.
    }
  };

  sendKill(initialSignal);
  const exitedGracefully = await waitForProcessExit(graceMs);
  if (exitedGracefully) {
    return { terminated: true, forced: false };
  }

  sendKill(forceSignal);
  const exitedAfterForce = await waitForProcessExit(graceMs);
  return {
    terminated:
      exitedAfterForce || proc.exitCode !== null || proc.signalCode !== null,
    forced: true,
  };
}

export function assertSanitizedEvidence(evidence, forbiddenValues = []) {
  const serialized = JSON.stringify(evidence);
  if (typeof serialized !== 'string' || serialized.length === 0) {
    throw new QaError(
      'ARTIFACT_WRITE',
      'ARTIFACT_SERIALIZATION_FAILED',
      'Evidence payload could not be serialized to JSON',
    );
  }
  const dynamicForbidden = forbiddenValues.filter(
    (value) => typeof value === 'string' && value.trim().length >= 6,
  );
  for (const secret of dynamicForbidden) {
    if (serialized.includes(secret)) {
      throw new QaError(
        'ARTIFACT_WRITE',
        'ARTIFACT_SENSITIVE_DATA_BLOCKED',
        'Refusing to persist evidence containing runtime credential material',
      );
    }
  }
  for (const pattern of SENSITIVE_VALUE_PATTERNS) {
    if (pattern.test(serialized)) {
      throw new QaError(
        'ARTIFACT_WRITE',
        'ARTIFACT_SENSITIVE_DATA_BLOCKED',
        'Refusing to persist evidence matching sensitive credential pattern',
      );
    }
  }
  return serialized;
}

export function writeSanitizedTrace(
  tracePath,
  evidence,
  {
    forbiddenValues = [],
    writeFileSyncFn = writeFileSync,
    renameSyncFn = renameSync,
    readFileSyncFn = readFileSync,
    rmSyncFn = rmSync,
  } = {},
) {
  const serialized = `${assertSanitizedEvidence(evidence, forbiddenValues)}\n`;
  const dir = path.dirname(tracePath);
  mkdirSync(dir, { recursive: true });
  const tempPath = `${tracePath}.tmp-${process.pid}-${Date.now()}-${randomUUID().slice(0, 8)}`;
  try {
    writeFileSyncFn(tempPath, serialized, 'utf8');
    renameSyncFn(tempPath, tracePath);
  } catch {
    try {
      rmSyncFn(tempPath, { force: true });
    } catch {
      // Ignore temp file cleanup error.
    }
    throw new QaError(
      'ARTIFACT_WRITE',
      'TRACE_WRITE_FAILED',
      'Failed to atomically write sanitized trace artifact',
    );
  }

  let verifiedText;
  try {
    verifiedText = readFileSyncFn(tracePath, 'utf8');
  } catch {
    throw new QaError(
      'ARTIFACT_WRITE',
      'TRACE_READBACK_FAILED',
      'Failed to read back trace artifact after write',
    );
  }
  try {
    const parsed = JSON.parse(verifiedText);
    if (!parsed || typeof parsed !== 'object' || !Array.isArray(parsed.cases)) {
      throw new Error('Malformed trace payload');
    }
  } catch {
    throw new QaError(
      'ARTIFACT_WRITE',
      'TRACE_CORRUPT_AFTER_WRITE',
      'Trace artifact readback validation failed',
    );
  }
}

const ALLOWED_TRACE_MODES = new Set(['normal', 'intentional-broken-login']);
const ALLOWED_TRACE_OVERALL = new Set(['PASS', 'FAIL', 'INCOMPLETE']);
const ALLOWED_TRACE_STAGES = new Set([
  'STARTUP',
  'LOCAL_STATUS',
  'APP_BUILD',
  'FIXTURE_CREATION',
  'APP_START',
  'BROWSER_START',
  'BROWSER_AUTH',
  'COMPLETED',
  'CLEANUP',
  'ARTIFACT_WRITE',
  'QA_EXECUTION',
]);
const ALLOWED_FAILURE_CODES = new Set([
  'TRACE_INCOMPLETE_OR_ABORTED',
  'NONLOCAL_TARGET_BLOCKED',
  'LOCAL_STATUS_FAILED',
  'LOCAL_STATUS_TIMED_OUT',
  'BUILD_TIMED_OUT',
  'BUILD_FAILED',
  'FIXTURE_CREATION_FAILED',
  'APP_PORT_ALREADY_IN_USE',
  'APP_START_FAILED',
  'APP_START_TIMED_OUT',
  'BROWSER_START_FAILED',
  'BROWSER_START_TIMED_OUT',
  'CDP_CONNECT_TIMED_OUT',
  'CDP_SOCKET_ERROR',
  'CDP_CONNECTION_CLOSED',
  'CDP_COMMAND_TIMED_OUT',
  'BROWSER_NAVIGATION_TIMED_OUT',
  'AUTH_LOGIN_FORM_TIMEOUT',
  'AUTH_INVALID_LOGIN_ERROR_NOT_SHOWN',
  'AUTH_LOGIN_POST_NOT_OBSERVED',
  'AUTH_VALID_LOGIN_DID_NOT_COMPLETE',
  'AUTH_LOGOUT_TIMEOUT',
  'AUTH_ASSERTION_FAILED',
  'CHILD_PROCESS_TERMINATED',
  'PROCESS_SIGNAL_TERMINATED',
  'FIXTURE_CLEANUP_FAILED',
  'FIXTURE_CLEANUP_UNVERIFIED',
  'SUBPROCESS_TEARDOWN_FAILED',
  'ARTIFACT_SERIALIZATION_FAILED',
  'ARTIFACT_SENSITIVE_DATA_BLOCKED',
  'TRACE_WRITE_FAILED',
  'TRACE_READBACK_FAILED',
  'TRACE_CORRUPT_AFTER_WRITE',
  'QA_EXECUTION_FAILED',
]);
const ALLOWED_PROCESS_NAMES = new Set(['application', 'browser']);
const ALLOWED_SIGNALS = new Set([
  'SIGINT',
  'SIGTERM',
  'SIGHUP',
  'SIGKILL',
  'SIGABRT',
  'SIGQUIT',
]);
const ALLOWED_CLEANUP_STATUSES = new Set([
  'PASS',
  'FAIL',
  'UNVERIFIED',
  'SKIPPED',
  'PENDING',
]);
const ALLOWED_CLEANUP_REASONS = new Set([
  'MUTATION_OUTCOME_AMBIGUOUS',
  'FIXTURE_QUIESCENCE_TIMEOUT',
  'FIXTURE_CLEANUP_FAILED',
]);
const ALLOWED_MUTATION_STAGES = new Set(FIXTURE_MUTATION_STAGES);
const ALLOWED_CASE_IDS = new Set([
  ...EXPECTED_POSITIVE_CASE_IDS,
  ...EXPECTED_NEGATIVE_PRE_LOGIN_CASE_IDS,
]);

function allowlistedString(value, allowedSet, fallback = null) {
  return typeof value === 'string' && allowedSet.has(value) ? value : fallback;
}

export function classifyFailure(stage, error) {
  const fallbackStage = allowlistedString(
    stage,
    ALLOWED_TRACE_STAGES,
    'QA_EXECUTION',
  );
  if (error instanceof QaError) {
    const resolvedStage = allowlistedString(
      error.stage || fallbackStage,
      ALLOWED_TRACE_STAGES,
      fallbackStage,
    );
    const resolvedCode = allowlistedString(
      error.code,
      ALLOWED_FAILURE_CODES,
      'QA_EXECUTION_FAILED',
    );
    const result = {
      stage: resolvedStage,
      code: resolvedCode,
    };
    const safeProcess = allowlistedString(
      error.details?.process,
      ALLOWED_PROCESS_NAMES,
      null,
    );
    if (safeProcess) {
      result.process = safeProcess;
    }
    if (
      (typeof error.details?.exitCode === 'number' &&
        Number.isInteger(error.details.exitCode)) ||
      error.details?.exitCode === null
    ) {
      result.exitCode = error.details.exitCode;
    }
    const safeSignal = allowlistedString(
      error.details?.signal,
      ALLOWED_SIGNALS,
      null,
    );
    if (safeSignal) {
      result.signal = safeSignal;
    }
    const safeCaseId = allowlistedString(
      error.details?.failedCaseId,
      ALLOWED_CASE_IDS,
      null,
    );
    if (safeCaseId) {
      result.failedCaseId = safeCaseId;
    }
    const safePriorStage = allowlistedString(
      error.details?.priorStage,
      ALLOWED_TRACE_STAGES,
      null,
    );
    if (safePriorStage) {
      result.priorStage = safePriorStage;
    }
    const safePriorCode = allowlistedString(
      error.details?.priorCode,
      ALLOWED_FAILURE_CODES,
      null,
    );
    if (safePriorCode) {
      result.priorCode = safePriorCode;
    }
    return result;
  }

  const message = error instanceof Error ? error.message : '';
  const code =
    message === 'Timed out: Authenticated dashboard'
      ? 'AUTH_VALID_LOGIN_DID_NOT_COMPLETE'
      : message === 'Timed out: Invalid login error'
        ? 'AUTH_INVALID_LOGIN_ERROR_NOT_SHOWN'
        : message === 'Timed out: Login form'
          ? 'AUTH_LOGIN_FORM_TIMEOUT'
          : message === 'Timed out: Logout'
            ? 'AUTH_LOGOUT_TIMEOUT'
            : message === 'Timed out: Local MGBOS health'
              ? 'APP_START_TIMED_OUT'
              : message === 'Timed out: Local browser debugging endpoint'
                ? 'BROWSER_START_TIMED_OUT'
                : message.startsWith('Timed out: Navigation ')
                  ? 'BROWSER_NAVIGATION_TIMED_OUT'
                  : message.startsWith(
                        'Authentication invariant not satisfied:',
                      )
                    ? 'AUTH_ASSERTION_FAILED'
                    : fallbackStage === 'APP_BUILD'
                      ? 'BUILD_FAILED'
                      : fallbackStage === 'FIXTURE_CREATION'
                        ? 'FIXTURE_CREATION_FAILED'
                        : 'QA_EXECUTION_FAILED';
  return { stage: fallbackStage, code };
}

function recordResult(cases, caseId, passed, proof = {}) {
  cases.push({
    caseId,
    verdict: passed ? 'PASS' : 'FAIL',
    timestamp: new Date().toISOString(),
    proof,
  });
  if (!passed) {
    throw new QaError(
      'BROWSER_AUTH',
      'AUTH_ASSERTION_FAILED',
      `Authentication invariant not satisfied: ${caseId}`,
      { failedCaseId: caseId },
    );
  }
}

const MUTATING_ARRAY_METHODS = new Set([
  'copyWithin',
  'fill',
  'pop',
  'push',
  'reverse',
  'shift',
  'sort',
  'splice',
  'unshift',
]);

async function raceWithSignal(fn, signal, assertActive) {
  assertActive();
  let onAbort;
  const abortPromise = new Promise((_, reject) => {
    onAbort = () => {
      try {
        assertActive();
      } catch (error) {
        reject(error);
        return;
      }
      reject(
        new QaError(
          'BROWSER_AUTH',
          'PROCESS_SIGNAL_TERMINATED',
          'QA harness execution aborted',
        ),
      );
    };
    if (signal?.aborted) {
      onAbort();
      return;
    }
    signal?.addEventListener('abort', onAbort, { once: true });
  });
  abortPromise.catch(() => {});
  const operationPromise = Promise.resolve().then(() => {
    assertActive();
    return fn();
  });
  operationPromise.catch(() => {});
  try {
    const result = await Promise.race([operationPromise, abortPromise]);
    assertActive();
    return result;
  } finally {
    if (onAbort) {
      signal?.removeEventListener('abort', onAbort);
    }
  }
}

function createGuardedCdp(rawCdp, assertActive, signal) {
  if (!rawCdp) return rawCdp;
  return {
    assertConnected(stage = 'BROWSER_AUTH') {
      assertActive();
      return rawCdp.assertConnected?.(stage);
    },
    posts(route) {
      return rawCdp.posts(route);
    },
    async send(method, params = {}) {
      return raceWithSignal(
        () => rawCdp.send(method, params),
        signal,
        assertActive,
      );
    },
    async eval(expression) {
      return raceWithSignal(
        () => rawCdp.eval(expression),
        signal,
        assertActive,
      );
    },
    async goto(route, expected = route, options = {}) {
      return raceWithSignal(
        () => rawCdp.goto(route, expected, { ...options, signal }),
        signal,
        assertActive,
      );
    },
    async session() {
      return raceWithSignal(() => rawCdp.session(), signal, assertActive);
    },
    async screenshot(file) {
      return raceWithSignal(
        () => rawCdp.screenshot(file),
        signal,
        assertActive,
      );
    },
    close() {
      return rawCdp.close?.();
    },
  };
}

function createGuardedCases(rawCases, assertActive) {
  return new Proxy(rawCases, {
    get(target, prop, receiver) {
      const value = Reflect.get(target, prop, receiver);
      if (typeof prop === 'string' && MUTATING_ARRAY_METHODS.has(prop)) {
        return (...args) => {
          assertActive();
          return value.apply(target, args);
        };
      }
      return typeof value === 'function' ? value.bind(target) : value;
    },
    set(target, prop, value, receiver) {
      assertActive();
      return Reflect.set(target, prop, value, receiver);
    },
    defineProperty(target, prop, descriptor) {
      assertActive();
      return Reflect.defineProperty(target, prop, descriptor);
    },
    deleteProperty(target, prop) {
      assertActive();
      return Reflect.deleteProperty(target, prop);
    },
  });
}

function deepFreeze(value) {
  if (!value || typeof value !== 'object' || Object.isFrozen(value)) {
    return value;
  }
  Object.freeze(value);
  for (const key of Object.keys(value)) {
    deepFreeze(value[key]);
  }
  return value;
}

export async function runBrowser(
  cdp,
  fixture,
  {
    cases,
    artifactDir,
    negativeControl = false,
    app = CANONICAL_APP_ORIGIN,
    checkHealth,
    loginTimeoutMs = 30000,
    signal,
  },
) {
  assertLoopbackHttpOrigin(app, 'BROWSER_AUTH');
  const ensureHealthy = async () => {
    throwIfSignalAborted(signal, 'BROWSER_AUTH');
    if (checkHealth) await checkHealth();
    if (typeof cdp.assertConnected === 'function') {
      cdp.assertConnected('BROWSER_AUTH');
    }
  };

  await ensureHealthy();
  await cdp.send('Network.clearBrowserCookies');
  await cdp.goto('/login', '/login', { checkHealth: ensureHealthy, signal });
  await until(
    () => cdp.eval('Boolean(document.querySelector(\'input[name="email"]\'))'),
    'Login form',
    30000,
    { checkHealth: ensureHealthy, signal, stage: 'BROWSER_AUTH' },
  );

  const empty = await cdp.eval(`(() => {
    const email = document.querySelector('input[name="email"]');
    const password = document.querySelector('input[name="password"]');
    return Boolean(email && password &&
      email.value === '' && password.value === '' &&
      !email.hasAttribute('value') && !password.hasAttribute('value') &&
      email.required && password.required &&
      !document.querySelector('.auth-card footer'));
  })()`);
  recordResult(
    cases,
    'AUTH-BLANK-01',
    empty && (await cdp.session()).length === 0,
    {
      route: '/login',
      emptyInputs: empty,
    },
  );
  await cdp.screenshot(path.join(artifactDir, 'anonymous-login.png'));

  const submit = async (email, password) => {
    await cdp.eval(`(() => {
      const form = document.querySelector('form');
      const put = (name, value) => {
        const input = form.querySelector('[name="' + name + '"]');
        Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')
          .set.call(input, value);
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
      };
      put('email', ${JSON.stringify(email)});
      put('password', ${JSON.stringify(password)});
      form.requestSubmit(form.querySelector('button[type="submit"]'));
      return true;
    })()`);
  };

  const invalidPosts = cdp.posts('/login');
  await submit('ci-invalid@example.test', randomUUID());
  await until(
    () =>
      cdp.eval(
        'location.pathname === "/login" && Boolean(document.querySelector(\'[role="alert"]\'))',
      ),
    'Invalid login error',
    30000,
    { checkHealth: ensureHealthy, signal, stage: 'BROWSER_AUTH' },
  );
  const invalidPostObserved = cdp.posts('/login') > invalidPosts;
  recordResult(
    cases,
    'AUTH-INVALID-01',
    invalidPostObserved && (await cdp.session()).length === 0,
    { route: '/login', formPostObserved: invalidPostObserved },
  );

  for (const route of ['/dashboard', '/orders', '/exceptions']) {
    await cdp.goto(route, '/login', { checkHealth: ensureHealthy, signal });
  }
  recordResult(cases, 'AUTH-DENY-01', (await cdp.session()).length === 0, {
    routes: ['/dashboard', '/orders', '/exceptions'],
    finalRoute: '/login',
  });

  const validPosts = cdp.posts('/login');
  await submit(
    fixture.email,
    negativeControl ? `${fixture.password}${randomUUID()}` : fixture.password,
  );
  try {
    await until(
      async () => {
        const state = await cdp.eval(`({
          pathname: location.pathname,
          ready: document.readyState,
          authenticated:
            location.pathname === "/dashboard" &&
            document.body.innerText.includes("CI Synthetic Operator"),
          rejectedOnLogin:
            location.pathname === "/login" &&
            document.readyState !== "loading" &&
            Boolean(document.querySelector('[role="alert"]'))
        })`);
        if (state && typeof state === 'object') {
          if (state.authenticated) return true;
          if (cdp.posts('/login') > validPosts && state.rejectedOnLogin) {
            const rejectedSession = await cdp.session();
            cases.push({
              caseId: 'AUTH-VALID-01',
              verdict: 'FAIL',
              timestamp: new Date().toISOString(),
              proof: {
                route: '/login',
                formPostObserved: true,
                sessionCookiePresent: rejectedSession.length === 1,
                httpOnly: rejectedSession[0]?.httpOnly === true,
                sameSiteLax: rejectedSession[0]?.sameSite === 'Lax',
              },
            });
            throw new QaError(
              'BROWSER_AUTH',
              'AUTH_VALID_LOGIN_DID_NOT_COMPLETE',
              'Timed out: Authenticated dashboard',
            );
          }
        }
        return Boolean(state === true);
      },
      'Authenticated dashboard',
      loginTimeoutMs,
      { checkHealth: ensureHealthy, signal, stage: 'BROWSER_AUTH' },
    );
  } catch (error) {
    if (error instanceof QaError) {
      throw error;
    }
    await ensureHealthy();
    const validPostObserved = cdp.posts('/login') > validPosts;
    const currentSession = await cdp.session();
    if (!validPostObserved) {
      throw new QaError(
        'BROWSER_AUTH',
        'AUTH_LOGIN_POST_NOT_OBSERVED',
        'Login form submission was not observed before dashboard timeout',
      );
    }
    cases.push({
      caseId: 'AUTH-VALID-01',
      verdict: 'FAIL',
      timestamp: new Date().toISOString(),
      proof: {
        route: '/login',
        formPostObserved: true,
        sessionCookiePresent: currentSession.length === 1,
        httpOnly: currentSession[0]?.httpOnly === true,
        sameSiteLax: currentSession[0]?.sameSite === 'Lax',
      },
    });
    throw new QaError(
      'BROWSER_AUTH',
      'AUTH_VALID_LOGIN_DID_NOT_COMPLETE',
      'Timed out: Authenticated dashboard',
    );
  }

  const session = await cdp.session();
  const validPostObserved = cdp.posts('/login') > validPosts;
  recordResult(
    cases,
    'AUTH-VALID-01',
    validPostObserved &&
      session.length === 1 &&
      session[0].httpOnly === true &&
      session[0].sameSite === 'Lax',
    {
      route: '/dashboard',
      formPostObserved: validPostObserved,
      sessionCookiePresent: session.length === 1,
      httpOnly: session[0]?.httpOnly === true,
      sameSiteLax: session[0]?.sameSite === 'Lax',
    },
  );

  const logoutPosts = cdp.posts('/dashboard');
  const pressed = await cdp.eval(`(() => {
    const form = [...document.querySelectorAll('form')].find(
      (item) => item.querySelector('button')?.textContent?.includes('Keluar'),
    );
    if (!form) return false;
    form.requestSubmit();
    return true;
  })()`);
  if (!pressed) {
    throw new QaError(
      'BROWSER_AUTH',
      'AUTH_ASSERTION_FAILED',
      'Authentication invariant not satisfied: AUTH-LOGOUT-01',
      { failedCaseId: 'AUTH-LOGOUT-01' },
    );
  }
  await until(
    () => cdp.eval('location.pathname === "/login"'),
    'Logout',
    30000,
    {
      checkHealth: ensureHealthy,
      signal,
      stage: 'BROWSER_AUTH',
    },
  );
  const logoutPostObserved = cdp.posts('/dashboard') > logoutPosts;
  recordResult(
    cases,
    'AUTH-LOGOUT-01',
    logoutPostObserved && (await cdp.session()).length === 0,
    { route: '/login', logoutPostObserved, sessionCookiePresent: false },
  );

  await cdp.goto('/dashboard', '/login', {
    checkHealth: ensureHealthy,
    signal,
  });
  recordResult(
    cases,
    'AUTH-AFTER-LOGOUT-01',
    (await cdp.session()).length === 0,
    {
      finalRoute: '/login',
    },
  );

  // Invalid token rejection is not proof of revoking an earlier valid JWT.
  const invalidToken = `ci-invalid-${randomUUID()}`;
  const inserted = await cdp.send('Network.setCookie', {
    name: 'mgbos_session',
    value: invalidToken,
    url: app,
    httpOnly: true,
    sameSite: 'Lax',
    secure: false,
  });
  const cookieJar = await cdp.send('Network.getCookies', { urls: [app] });
  const cookieInstalled =
    inserted.success === true &&
    cookieJar.cookies.some(
      (cookie) =>
        cookie.name === 'mgbos_session' && cookie.value === invalidToken,
    );
  // Cookie values must never be retained in traces or console output.
  recordResult(cases, 'AUTH-INVALID-TOKEN-SETUP-01', cookieInstalled, {
    testCookieInstalled: cookieInstalled,
  });
  await cdp.goto('/dashboard', '/login', {
    checkHealth: ensureHealthy,
    signal,
  });
  recordResult(
    cases,
    'AUTH-INVALID-TOKEN-01',
    await cdp.eval('location.pathname === "/login"'),
    { finalRoute: '/login', priorValidJwtRevocationTested: false },
  );
  await cdp.send('Network.clearBrowserCookies');
}

function buildSafeTraceDiagnostics(report, safeExitStatus) {
  const rawFailure =
    report?.failure &&
    typeof report.failure === 'object' &&
    !Array.isArray(report.failure)
      ? report.failure
      : null;
  const rawCleanup =
    report?.cleanup &&
    typeof report.cleanup === 'object' &&
    !Array.isArray(report.cleanup)
      ? report.cleanup
      : null;

  const ambiguousMutations = Array.isArray(rawCleanup?.ambiguousMutations)
    ? rawCleanup.ambiguousMutations.filter((item) =>
        allowlistedString(item, ALLOWED_MUTATION_STAGES, null),
      )
    : null;

  return {
    mode: allowlistedString(report?.mode, ALLOWED_TRACE_MODES, null),
    overall: allowlistedString(report?.overall, ALLOWED_TRACE_OVERALL, null),
    stage: allowlistedString(report?.stage, ALLOWED_TRACE_STAGES, null),
    failureStage: allowlistedString(
      rawFailure?.stage,
      ALLOWED_TRACE_STAGES,
      null,
    ),
    failureCode: allowlistedString(
      rawFailure?.code,
      ALLOWED_FAILURE_CODES,
      null,
    ),
    process: allowlistedString(
      rawFailure?.process,
      ALLOWED_PROCESS_NAMES,
      null,
    ),
    exitCode:
      typeof rawFailure?.exitCode === 'number' &&
      Number.isInteger(rawFailure.exitCode)
        ? rawFailure.exitCode
        : null,
    signal: allowlistedString(rawFailure?.signal, ALLOWED_SIGNALS, null),
    cleanupStatus: allowlistedString(
      rawCleanup?.status,
      ALLOWED_CLEANUP_STATUSES,
      null,
    ),
    cleanupReason: allowlistedString(
      rawCleanup?.reason,
      ALLOWED_CLEANUP_REASONS,
      null,
    ),
    ambiguousMutations,
    executionQuiesced:
      typeof rawCleanup?.executionQuiesced === 'boolean'
        ? rawCleanup.executionQuiesced
        : null,
    casesRecorded: Array.isArray(report?.cases) ? report.cases.length : null,
    exitStatus: safeExitStatus,
  };
}

export function validateTraceReport(report, { expectedMode, exitStatus } = {}) {
  const safeExitStatus =
    typeof exitStatus === 'number' && Number.isInteger(exitStatus)
      ? exitStatus
      : null;

  if (!report || typeof report !== 'object' || Array.isArray(report)) {
    return {
      valid: false,
      code: 'TRACE_CORRUPT',
      summary: 'Trace report is not a JSON object',
      diagnostics: { exitStatus: safeExitStatus },
    };
  }

  try {
    assertSanitizedEvidence(report);
  } catch {
    return {
      valid: false,
      code: 'TRACE_SENSITIVE_DATA_DETECTED',
      summary: 'Sensitive or credential-like pattern detected in trace report',
      diagnostics: { exitStatus: safeExitStatus },
    };
  }

  const diagnostics = buildSafeTraceDiagnostics(report, safeExitStatus);
  try {
    assertSanitizedEvidence(diagnostics);
  } catch {
    return {
      valid: false,
      code: 'TRACE_SENSITIVE_DATA_DETECTED',
      summary: 'Sensitive or credential-like pattern detected in trace report',
      diagnostics: { exitStatus: safeExitStatus },
    };
  }

  if (
    typeof report.checkoutSha !== 'string' ||
    report.checkoutSha.trim().length === 0 ||
    !Array.isArray(report.cases)
  ) {
    return {
      valid: false,
      code: 'TRACE_CORRUPT',
      summary: 'Trace report is missing required provenance or cases structure',
      diagnostics,
    };
  }

  if (report.overall === 'INCOMPLETE') {
    return {
      valid: false,
      code: 'TRACE_INCOMPLETE_OR_ABORTED',
      summary: 'Trace report indicates an incomplete or aborted execution',
      diagnostics,
    };
  }

  if (expectedMode !== undefined && !ALLOWED_TRACE_MODES.has(expectedMode)) {
    return {
      valid: false,
      code: 'UNSUPPORTED_EXPECTED_MODE',
      summary: 'Unsupported expectedMode argument',
      diagnostics,
    };
  }

  if (expectedMode && report.mode !== expectedMode) {
    return {
      valid: false,
      code: 'TRACE_MODE_MISMATCH',
      summary: 'Trace report mode does not match expected execution mode',
      diagnostics,
    };
  }

  if (report.failure?.code === 'FIXTURE_CLEANUP_FAILED') {
    return {
      valid: false,
      code: 'FIXTURE_CLEANUP_NOT_VERIFIED',
      summary: 'Expected fixture cleanup status PASS',
      diagnostics,
    };
  }

  if (report.failure?.code === 'SUBPROCESS_TEARDOWN_FAILED') {
    return {
      valid: false,
      code: 'SUBPROCESS_TEARDOWN_NOT_VERIFIED',
      summary:
        'Subprocess or temporary profile teardown did not complete cleanly',
      diagnostics,
    };
  }

  if (
    report.failure?.code === 'FIXTURE_CLEANUP_UNVERIFIED' ||
    report.cleanup?.status === 'UNVERIFIED'
  ) {
    return {
      valid: false,
      code: 'FIXTURE_CLEANUP_NOT_VERIFIED',
      summary: 'Expected fixture cleanup status PASS',
      diagnostics,
    };
  }

  const verifyCleanupAndTeardown = () => {
    if (report.cleanup?.status !== 'PASS') {
      return {
        valid: false,
        code: 'FIXTURE_CLEANUP_NOT_VERIFIED',
        summary: 'Expected fixture cleanup status PASS',
        diagnostics,
      };
    }
    if (
      report.cleanup?.browserTerminated !== true ||
      report.cleanup?.applicationTerminated !== true ||
      report.cleanup?.profileRemoved !== true ||
      report.cleanup?.executionQuiesced !== true
    ) {
      return {
        valid: false,
        code: 'SUBPROCESS_TEARDOWN_NOT_VERIFIED',
        summary:
          'Subprocess or temporary profile teardown did not complete cleanly',
        diagnostics,
      };
    }
    return null;
  };

  if (expectedMode === 'normal') {
    if (safeExitStatus !== null && safeExitStatus !== 0) {
      return {
        valid: false,
        code: 'POSITIVE_EXIT_STATUS_NONZERO',
        summary: 'Positive browser-auth run exited with nonzero status',
        diagnostics,
      };
    }
    if (report.overall !== 'PASS' || report.failure !== undefined) {
      return {
        valid: false,
        code: 'POSITIVE_RUN_FAILED',
        summary: 'Positive browser-auth trace did not record overall PASS',
        diagnostics,
      };
    }
    const cleanupErr = verifyCleanupAndTeardown();
    if (cleanupErr) return cleanupErr;
    const caseIds = report.cases.map((item) => item?.caseId);
    const allPassed =
      caseIds.length === EXPECTED_POSITIVE_CASE_IDS.length &&
      EXPECTED_POSITIVE_CASE_IDS.every(
        (id, index) =>
          caseIds[index] === id && report.cases[index]?.verdict === 'PASS',
      );
    if (!allPassed) {
      return {
        valid: false,
        code: 'POSITIVE_CASES_INCOMPLETE',
        summary: 'Positive browser-auth trace is missing required PASS cases',
        diagnostics,
      };
    }
    return {
      valid: true,
      code: 'POSITIVE_TRACE_VERIFIED',
      summary: 'Positive browser-auth trace verified',
      diagnostics,
    };
  }

  if (expectedMode === 'intentional-broken-login') {
    if (safeExitStatus !== null && safeExitStatus === 0) {
      return {
        valid: false,
        code: 'NEGATIVE_CONTROL_UNEXPECTED_ZERO_EXIT',
        summary: 'Intentional broken-login control unexpectedly exited 0',
        diagnostics,
      };
    }
    if (report.overall !== 'FAIL') {
      return {
        valid: false,
        code: 'NEGATIVE_CONTROL_OVERALL_MISMATCH',
        summary: 'Expected negative-control overall FAIL',
        diagnostics,
      };
    }
    if (
      report.failure?.stage !== 'BROWSER_AUTH' ||
      report.failure?.code !== 'AUTH_VALID_LOGIN_DID_NOT_COMPLETE'
    ) {
      return {
        valid: false,
        code: 'NEGATIVE_CONTROL_CLASSIFICATION_MISMATCH',
        summary:
          'Expected BROWSER_AUTH/AUTH_VALID_LOGIN_DID_NOT_COMPLETE classification',
        diagnostics,
      };
    }
    const cleanupErr = verifyCleanupAndTeardown();
    if (cleanupErr) return cleanupErr;
    const expectedIds = [
      ...EXPECTED_NEGATIVE_PRE_LOGIN_CASE_IDS,
      'AUTH-VALID-01',
    ];
    const actualIds = report.cases.map((item) => item?.caseId);
    const preLoginPassed =
      actualIds.length === expectedIds.length &&
      EXPECTED_NEGATIVE_PRE_LOGIN_CASE_IDS.every(
        (id, index) =>
          actualIds[index] === id && report.cases[index]?.verdict === 'PASS',
      );
    const validLoginCase = report.cases[3];
    const validLoginRejected =
      validLoginCase?.caseId === 'AUTH-VALID-01' &&
      validLoginCase?.verdict === 'FAIL' &&
      validLoginCase?.proof?.formPostObserved === true &&
      validLoginCase?.proof?.sessionCookiePresent === false;
    if (!preLoginPassed || !validLoginRejected) {
      return {
        valid: false,
        code: 'NEGATIVE_CONTROL_CASE_PROVENANCE_MISMATCH',
        summary:
          'Negative-control trace did not prove pre-login PASS cases followed by AUTH-VALID-01 form-post rejection',
        diagnostics,
      };
    }
    return {
      valid: true,
      code: 'NEGATIVE_CONTROL_TRACE_VERIFIED',
      summary:
        'Negative-control verified: broken login is rejected by the harness for the expected reason',
      diagnostics,
    };
  }

  return {
    valid: false,
    code: 'UNSUPPORTED_EXPECTED_MODE',
    summary: 'Unsupported expectedMode argument',
    diagnostics,
  };
}

export function verifyTraceFile(
  tracePath,
  { expectedMode, exitStatus, readFileSyncFn = readFileSync } = {},
) {
  const safeExitStatus =
    typeof exitStatus === 'number' && Number.isInteger(exitStatus)
      ? exitStatus
      : null;

  if (typeof tracePath !== 'string' || tracePath.trim().length === 0) {
    return {
      valid: false,
      code: 'TRACE_MISSING',
      summary: 'Trace artifact path is missing',
      diagnostics: { exitStatus: safeExitStatus },
    };
  }
  if (!existsSync(tracePath)) {
    return {
      valid: false,
      code: 'TRACE_MISSING',
      summary: 'Trace artifact is missing',
      diagnostics: { exitStatus: safeExitStatus },
    };
  }
  let raw;
  try {
    raw = readFileSyncFn(tracePath, 'utf8');
  } catch {
    return {
      valid: false,
      code: 'TRACE_UNREADABLE',
      summary: 'Trace artifact could not be read',
      diagnostics: { exitStatus: safeExitStatus },
    };
  }
  if (typeof raw !== 'string' || raw.trim().length === 0) {
    return {
      valid: false,
      code: 'TRACE_CORRUPT',
      summary: 'Trace artifact is empty',
      diagnostics: { exitStatus: safeExitStatus },
    };
  }
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return {
      valid: false,
      code: 'TRACE_CORRUPT',
      summary: 'Trace artifact is not valid JSON',
      diagnostics: { exitStatus: safeExitStatus },
    };
  }
  return validateTraceReport(parsed, {
    expectedMode,
    exitStatus: safeExitStatus,
  });
}

function defaultBuildApp({ env, workdir = root, spawnSyncFn = spawnSync }) {
  const build = spawnSyncFn('pnpm', ['--filter', '@mgbos/app', 'build'], {
    cwd: workdir,
    env,
    // Build output is intentionally suppressed: no environment or key values in CI logs.
    stdio: 'ignore',
    timeout: 180000,
    shell: process.platform === 'win32',
  });
  if (build.error?.code === 'ETIMEDOUT') {
    throw new QaError(
      'APP_BUILD',
      'BUILD_TIMED_OUT',
      'Isolated app build timed out',
    );
  }
  if (build.status !== 0) {
    throw new QaError(
      'APP_BUILD',
      'BUILD_FAILED',
      'Isolated app build failed',
      {
        exitCode: build.status ?? null,
        signal: build.signal ?? null,
      },
    );
  }
}

async function defaultStartApp({
  env,
  workdir = root,
  app = CANONICAL_APP_ORIGIN,
  spawnFn = spawn,
  fetchFn = fetch,
  signal,
}) {
  throwIfSignalAborted(signal, 'APP_START');
  assertLoopbackHttpOrigin(app, 'APP_START');
  try {
    const staleProbe = await fetchFn(`${app}/health`, {
      signal: AbortSignal.timeout(1000),
    });
    if (staleProbe.ok) {
      throw new QaError(
        'APP_START',
        'APP_PORT_ALREADY_IN_USE',
        'Application port 3101 is already serving responses before startup',
      );
    }
  } catch (error) {
    if (error instanceof QaError) throw error;
    // Expected when no prior server is listening on port 3101.
  }

  throwIfSignalAborted(signal, 'APP_START');
  const application = spawnFn('pnpm', ['--filter', '@mgbos/app', 'start'], {
    cwd: workdir,
    env,
    stdio: 'ignore',
    detached: process.platform !== 'win32',
    shell: process.platform === 'win32',
  });
  try {
    await until(
      async () => {
        if (application.exitCode !== null || application.signalCode !== null) {
          throw new QaError(
            'APP_START',
            'APP_START_FAILED',
            'Application server exited during startup',
            {
              process: 'application',
              exitCode: application.exitCode,
              signal: application.signalCode,
            },
          );
        }
        const response = await fetchFn(`${app}/health`, {
          signal: AbortSignal.timeout(1500),
        });
        return response.ok;
      },
      'Local MGBOS health',
      30000,
      { signal, stage: 'APP_START' },
    );
    return application;
  } catch (error) {
    await terminateSubprocess(application, {
      initialSignal: 'SIGTERM',
      forceSignal: 'SIGKILL',
      graceMs: 3000,
    }).catch(() => {});
    throw error;
  }
}

export async function runQaHarness({
  workdir = root,
  api = CANONICAL_API_ORIGIN,
  app = CANONICAL_APP_ORIGIN,
  negativeControl = process.env.MGBOS_QA_NEGATIVE_CONTROL === '1',
  artifactDir = path.join(
    workdir,
    '.qa-evidence',
    'browser-auth',
    negativeControl ? 'negative-control' : 'positive',
  ),
  localStatusFn = localStatus,
  buildAppFn = defaultBuildApp,
  createFixtureFn = createFixture,
  startAppFn = defaultStartApp,
  startBrowserFn = startBrowser,
  runBrowserFn = runBrowser,
  cleanupFn = cleanup,
  terminateSubprocessFn = terminateSubprocess,
  writeFileSyncFn = writeFileSync,
  renameSyncFn = renameSync,
  readFileSyncFn = readFileSync,
  rmSyncFn = rmSync,
  loginTimeoutMs = 30000,
  quiescenceTimeoutMs = 5000,
  fixtureDrainTimeoutMs = 5000,
} = {}) {
  mkdirSync(artifactDir, { recursive: true });
  const tracePath = path.join(artifactDir, 'trace.json');
  const git = spawnSync('git', ['rev-parse', 'HEAD'], {
    cwd: workdir,
    encoding: 'utf8',
    timeout: 5000,
  });
  const cases = [];
  const evidence = {
    checkoutSha: git.status === 0 ? git.stdout.trim() : 'unknown',
    ciEventSha: process.env.GITHUB_SHA ?? null,
    cases,
    mode: negativeControl ? 'intentional-broken-login' : 'normal',
    stage: 'STARTUP',
    failure: {
      stage: 'STARTUP',
      code: 'TRACE_INCOMPLETE_OR_ABORTED',
    },
    cleanup: {
      attempted: false,
      status: 'PENDING',
      browserTerminated: true,
      applicationTerminated: true,
      profileRemoved: true,
      executionQuiesced: true,
    },
    overall: 'INCOMPLETE',
  };

  let localKey;
  let anonKey;
  let initialFixture;
  let fixture;
  let application;
  let browser;
  let failure = false;
  let stage = 'LOCAL_STATUS';
  let tearingDown = false;
  let finalized = false;
  let signalError = null;
  const invocationId = Symbol('mgbos-qa-harness-invocation');
  const harnessCapabilities = new Set();
  const abortController = new AbortController();
  const { signal } = abortController;
  const drainAbortController = new AbortController();
  const { signal: drainSignal } = drainAbortController;

  const assertActive = (activeStage = stage) => {
    if (signalError) {
      throw signalError;
    }
    throwIfSignalAborted(signal, activeStage);
    if (tearingDown || finalized) {
      throw new QaError(
        activeStage,
        'PROCESS_SIGNAL_TERMINATED',
        'QA harness execution is no longer active',
      );
    }
  };

  const guardedCases = createGuardedCases(cases, () =>
    assertActive('BROWSER_AUTH'),
  );

  const getForbiddenValues = () => {
    const initialCapability = initialFixture
      ? fixtureCapabilities.get(initialFixture)
      : null;
    const activeCapability = fixture ? fixtureCapabilities.get(fixture) : null;
    return [
      localKey,
      anonKey,
      initialFixture?.password,
      initialFixture?.email,
      initialCapability?.originalPassword,
      initialCapability?.originalEmail,
      fixture?.password,
      fixture?.email,
      activeCapability?.originalPassword,
      activeCapability?.originalEmail,
    ];
  };

  const persistTraceCheckpoint = () => {
    if (finalized) return;
    writeSanitizedTrace(tracePath, evidence, {
      forbiddenValues: getForbiddenValues(),
      writeFileSyncFn,
      renameSyncFn,
      readFileSyncFn,
      rmSyncFn,
    });
  };

  const enterStage = (nextStage) => {
    assertActive(nextStage);
    stage = nextStage;
    evidence.stage = nextStage;
    evidence.failure = {
      stage: nextStage,
      code: 'TRACE_INCOMPLETE_OR_ABORTED',
    };
    try {
      persistTraceCheckpoint();
    } catch {
      // Final write in finally will classify any persistent write failure.
    }
  };

  try {
    persistTraceCheckpoint();
  } catch (error) {
    failure = true;
    evidence.stage = 'ARTIFACT_WRITE';
    evidence.failure = classifyFailure('ARTIFACT_WRITE', error);
    evidence.overall = 'FAIL';
    finalized = true;
    deepFreeze(evidence);
    return { evidence, failure: true, tracePath };
  }

  let rejectOnSignal;
  const signalPromise = new Promise((_, reject) => {
    rejectOnSignal = reject;
  });
  // Avoid unhandled rejection if signalPromise is never raced or settles late.
  signalPromise.catch(() => {});

  const onSignal = (receivedSignal) => {
    if (signalError || tearingDown || finalized) {
      return;
    }
    const activeStage = stage === 'COMPLETED' ? 'CLEANUP' : stage;
    signalError = new QaError(
      activeStage,
      'PROCESS_SIGNAL_TERMINATED',
      `QA harness received termination signal ${receivedSignal}`,
      { signal: receivedSignal },
    );
    failure = true;
    evidence.stage = activeStage;
    evidence.failure = classifyFailure(activeStage, signalError);
    abortController.abort(signalError);
    try {
      browser?.cdp?.close?.();
    } catch {
      // Ignore close errors during signal cancellation.
    }
    try {
      persistTraceCheckpoint();
    } catch {
      // Best-effort synchronous write on signal.
    }
    rejectOnSignal(signalError);
  };

  const trackedSignals = ['SIGINT', 'SIGTERM', 'SIGHUP'];
  for (const sig of trackedSignals) {
    process.on(sig, onSignal);
  }
  const onIpcMessage = (message) => {
    if (
      message &&
      typeof message === 'object' &&
      message.type === 'QA_TEST_SIGNAL' &&
      trackedSignals.includes(message.signal)
    ) {
      onSignal(message.signal);
    }
  };
  process.on('message', onIpcMessage);

  let executionPromise;
  const harnessContext = {
    invocationId,
    capabilities: harnessCapabilities,
    invalidated: false,
    signal,
    drainSignal,
    deferCleanup: true,
    get fixture() {
      return fixture;
    },
  };
  activeHarnessInvocations.add(invocationId);
  try {
    executionPromise = harnessContextStorage.run(harnessContext, async () => {
      enterStage('LOCAL_STATUS');
      assertConsistentSupabaseEnv(api, process.env, {
        stage: 'LOCAL_STATUS',
        code: 'LOCAL_STATUS_FAILED',
      });
      assertLoopbackHttpOrigin(app, {
        stage: 'LOCAL_STATUS',
        code: 'LOCAL_STATUS_FAILED',
      });
      const local = await localStatusFn({ workdir, api, signal });
      assertActive('LOCAL_STATUS');
      if (
        !local ||
        typeof local !== 'object' ||
        assertLoopbackHttpOrigin(local.API_URL, {
          stage: 'LOCAL_STATUS',
          code: 'LOCAL_STATUS_FAILED',
        }) !== api ||
        typeof local.SERVICE_ROLE_KEY !== 'string' ||
        local.SERVICE_ROLE_KEY.trim().length === 0 ||
        typeof local.ANON_KEY !== 'string' ||
        local.ANON_KEY.trim().length === 0 ||
        (local.DB_URL !== undefined &&
          (typeof local.DB_URL !== 'string' ||
            !/^postgres(?:ql)?:\/\/(?:[^@/\s]+@)?127\.0\.0\.1:\d+\//.test(
              local.DB_URL,
            )))
      ) {
        throw new QaError(
          'LOCAL_STATUS',
          'LOCAL_STATUS_FAILED',
          'Disposable local Supabase status validation failed',
        );
      }
      localKey = local.SERVICE_ROLE_KEY;
      anonKey = local.ANON_KEY;
      const env = {
        ...process.env,
        NEXT_PUBLIC_SUPABASE_URL: api,
        NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: anonKey,
        SUPABASE_SERVICE_ROLE_KEY: localKey,
        NEXT_TELEMETRY_DISABLED: '1',
      };

      enterStage('APP_BUILD');
      await buildAppFn({ env, workdir, signal });
      assertActive('APP_BUILD');

      enterStage('FIXTURE_CREATION');
      initialFixture = createFixtureState();
      fixture = initialFixture;
      const createdFixture = await createFixtureFn(localKey, {
        api,
        signal,
        drainSignal,
        fixture,
        deferCleanup: true,
      });
      if (
        createdFixture &&
        typeof createdFixture === 'object' &&
        createdFixture !== fixture
      ) {
        if (fixtureCapabilities.has(createdFixture) || cleanupFn === cleanup) {
          fixture = createdFixture;
        } else {
          Object.assign(fixture, createdFixture);
        }
      }
      assertActive('FIXTURE_CREATION');

      enterStage('APP_START');
      application = await startAppFn({ env, workdir, app, signal });
      assertActive('APP_START');

      enterStage('BROWSER_START');
      browser = await startBrowserFn({ app, signal });
      assertActive('BROWSER_START');

      enterStage('BROWSER_AUTH');
      const guardedCdp = createGuardedCdp(
        browser.cdp,
        () => assertActive('BROWSER_AUTH'),
        signal,
      );
      const checkHealth = () => {
        assertActive('BROWSER_AUTH');
        assertProcessAlive(application, 'application', 'BROWSER_AUTH');
        assertProcessAlive(browser?.browser, 'browser', 'BROWSER_AUTH');
      };
      await runBrowserFn(guardedCdp, fixture, {
        cases: guardedCases,
        artifactDir,
        negativeControl,
        app,
        checkHealth,
        loginTimeoutMs,
        signal,
      });

      assertActive('BROWSER_AUTH');
      stage = 'COMPLETED';
      evidence.stage = stage;
      delete evidence.failure;
    });
    executionPromise.catch(() => {});

    await Promise.race([executionPromise, signalPromise]);
  } catch (error) {
    const effectiveError = signalError ?? error;
    failure = true;
    evidence.stage =
      effectiveError instanceof QaError && effectiveError.stage
        ? allowlistedString(effectiveError.stage, ALLOWED_TRACE_STAGES, stage)
        : stage;
    evidence.failure = classifyFailure(stage, effectiveError);
  } finally {
    for (const sig of trackedSignals) {
      process.removeListener(sig, onSignal);
    }
    process.removeListener('message', onIpcMessage);
    tearingDown = true;
    if (!signal.aborted) {
      abortController.abort(
        signalError ??
          new QaError(
            stage,
            'PROCESS_SIGNAL_TERMINATED',
            'QA harness entering teardown',
          ),
      );
    }

    try {
      browser?.cdp?.close?.();
    } catch {
      // Ignore CDP close errors during teardown.
    }

    let executionQuiesced = true;
    if (executionPromise) {
      executionQuiesced = await Promise.race([
        executionPromise.then(
          () => true,
          () => true,
        ),
        new Promise((resolve) =>
          setTimeout(() => resolve(false), quiescenceTimeoutMs),
        ),
      ]);
    }

    const fixtureQuiescenceUnverified =
      !executionQuiesced &&
      (stage === 'FIXTURE_CREATION' || Boolean(fixture?.pendingMutation));

    // When fixture creation exceeds quiescenceTimeoutMs, executionQuiesced remains
    // permanently false (fail-closed), but we await a bounded fixture drain window
    // before cleanupFn and before returning so compensating cleanup never relies
    // on unawaited post-return callbacks cut off by process.exit().
    if (
      fixtureQuiescenceUnverified &&
      executionPromise &&
      fixtureDrainTimeoutMs > 0
    ) {
      await Promise.race([
        executionPromise.then(
          () => true,
          () => true,
        ),
        new Promise((resolve) =>
          setTimeout(() => resolve(false), fixtureDrainTimeoutMs),
        ),
      ]);
    }
    if (!drainSignal.aborted) {
      drainAbortController.abort(
        signalError ??
          new QaError(
            stage,
            'PROCESS_SIGNAL_TERMINATED',
            'QA harness fixture drain window expired',
          ),
      );
    }
    if (fixtureQuiescenceUnverified && executionPromise) {
      await Promise.race([
        executionPromise.then(
          () => true,
          () => true,
        ),
        new Promise((resolve) => setTimeout(() => resolve(false), 25)),
      ]);
    }

    // Checkpoint execution state after in-flight work quiesces/drains and before teardown.
    try {
      persistTraceCheckpoint();
    } catch {
      // Final write in finally will classify any persistent write failure.
    }

    let browserTerminated = true;
    let applicationTerminated = true;
    let profileRemoved = true;

    if (browser?.browser) {
      try {
        const result = await terminateSubprocessFn(browser.browser, {
          initialSignal: 'SIGTERM',
          forceSignal: 'SIGKILL',
          graceMs: 3000,
        });
        browserTerminated = Boolean(result?.terminated);
      } catch {
        browserTerminated = false;
      }
    }

    if (browser?.profile) {
      try {
        rmSyncFn(browser.profile, {
          recursive: true,
          force: true,
          maxRetries: 5,
          retryDelay: 100,
        });
      } catch {
        profileRemoved = false;
      }
    }

    if (application) {
      try {
        const result = await terminateSubprocessFn(application, {
          initialSignal: 'SIGTERM',
          forceSignal: 'SIGKILL',
          graceMs: 5000,
        });
        applicationTerminated = Boolean(result?.terminated);
      } catch {
        applicationTerminated = false;
      }
    }

    const ambiguousMutations = getAmbiguousMutationStages(fixture);
    const mutationOutcomeAmbiguous =
      hasAmbiguousFixtureMutation(fixture) || ambiguousMutations.length > 0;
    let cleanupAttempted = Boolean(localKey && fixture);
    let cleanupStatus = cleanupAttempted ? 'PASS' : 'SKIPPED';
    let cleanupReason = null;
    if (cleanupAttempted) {
      try {
        const cleanupResult = await harnessContextStorage.run(
          harnessContext,
          () => cleanupFn(localKey, fixture, { api }),
        );
        if (
          cleanupResult &&
          typeof cleanupResult === 'object' &&
          typeof cleanupResult.status === 'string'
        ) {
          cleanupStatus = allowlistedString(
            cleanupResult.status,
            ALLOWED_CLEANUP_STATUSES,
            'FAIL',
          );
        }
        if (cleanupStatus === 'FAIL') {
          failure = true;
          cleanupReason = 'FIXTURE_CLEANUP_FAILED';
        } else if (
          fixtureQuiescenceUnverified ||
          mutationOutcomeAmbiguous ||
          cleanupStatus === 'UNVERIFIED'
        ) {
          failure = true;
          cleanupStatus = 'UNVERIFIED';
          cleanupReason = mutationOutcomeAmbiguous
            ? 'MUTATION_OUTCOME_AMBIGUOUS'
            : allowlistedString(
                cleanupResult?.reason,
                ALLOWED_CLEANUP_REASONS,
                'FIXTURE_QUIESCENCE_TIMEOUT',
              );
        }
      } catch {
        failure = true;
        cleanupStatus = 'FAIL';
        cleanupReason = 'FIXTURE_CLEANUP_FAILED';
        evidence.failure = {
          stage: 'CLEANUP',
          code: 'FIXTURE_CLEANUP_FAILED',
          ...(evidence.failure
            ? {
                priorStage: allowlistedString(
                  evidence.failure.stage,
                  ALLOWED_TRACE_STAGES,
                  'QA_EXECUTION',
                ),
                priorCode: allowlistedString(
                  evidence.failure.code,
                  ALLOWED_FAILURE_CODES,
                  'QA_EXECUTION_FAILED',
                ),
              }
            : {}),
        };
      }
    } else if (fixtureQuiescenceUnverified || mutationOutcomeAmbiguous) {
      failure = true;
      cleanupStatus = 'UNVERIFIED';
      cleanupReason = mutationOutcomeAmbiguous
        ? 'MUTATION_OUTCOME_AMBIGUOUS'
        : 'FIXTURE_QUIESCENCE_TIMEOUT';
    }

    harnessContext.invalidated = true;
    activeHarnessInvocations.delete(invocationId);
    for (const cap of harnessCapabilities) {
      cap.invalidated = true;
      cap.creationAbortController?.abort?.(
        new QaError(
          stage,
          'PROCESS_SIGNAL_TERMINATED',
          'QA harness invocation scope exited',
        ),
      );
    }

    if (
      !browserTerminated ||
      !applicationTerminated ||
      !profileRemoved ||
      !executionQuiesced
    ) {
      failure = true;
      if (evidence.failure?.code !== 'FIXTURE_CLEANUP_FAILED') {
        evidence.failure = {
          stage: 'CLEANUP',
          code: 'SUBPROCESS_TEARDOWN_FAILED',
          ...(evidence.failure
            ? {
                priorStage: allowlistedString(
                  evidence.failure.stage,
                  ALLOWED_TRACE_STAGES,
                  'QA_EXECUTION',
                ),
                priorCode: allowlistedString(
                  evidence.failure.code,
                  ALLOWED_FAILURE_CODES,
                  'QA_EXECUTION_FAILED',
                ),
              }
            : {}),
        };
      }
    }

    if (cleanupStatus === 'UNVERIFIED') {
      failure = true;
      if (!evidence.failure) {
        evidence.failure = {
          stage: 'CLEANUP',
          code: 'FIXTURE_CLEANUP_UNVERIFIED',
        };
      }
      evidence.failure.cleanupStatus = 'UNVERIFIED';
      evidence.failure.cleanupUncertainty = mutationOutcomeAmbiguous
        ? 'Dispatched synthetic fixture mutation outcome was not confirmed before response failure or cancellation; point-in-time absence query cannot rule out a late server commit.'
        : 'Synthetic fixture creation did not quiesce within the bounded timeout before cleanup verification.';
      if (ambiguousMutations.length > 0) {
        evidence.failure.ambiguousMutations = [...ambiguousMutations];
      }
    }

    evidence.cleanup = {
      attempted: cleanupAttempted,
      status: cleanupStatus,
      browserTerminated,
      applicationTerminated,
      profileRemoved,
      executionQuiesced,
      ...(cleanupReason ? { reason: cleanupReason } : {}),
      ...(ambiguousMutations.length > 0
        ? { ambiguousMutations: [...ambiguousMutations] }
        : {}),
    };
    evidence.overall = failure ? 'FAIL' : 'PASS';

    try {
      persistTraceCheckpoint();
    } catch (error) {
      failure = true;
      evidence.overall = 'FAIL';
      evidence.failure = classifyFailure('ARTIFACT_WRITE', error);
    }
    finalized = true;
    deepFreeze(evidence);
  }

  return { evidence, failure, tracePath };
}

function readFlagValue(argv, flag) {
  const index = argv.indexOf(flag);
  if (index === -1 || index + 1 >= argv.length) {
    return undefined;
  }
  return argv[index + 1];
}

export async function runCli(argv = process.argv.slice(2)) {
  const verifyIndex = argv.indexOf('--verify-trace');
  if (verifyIndex !== -1) {
    const tracePath = argv[verifyIndex + 1];
    const modeIndex = argv.indexOf('--expected-mode');
    const expectedMode = modeIndex !== -1 ? argv[modeIndex + 1] : undefined;
    const statusIndex = argv.indexOf('--exit-status');
    const exitStatus =
      statusIndex !== -1 && argv[statusIndex + 1] !== undefined
        ? Number.parseInt(argv[statusIndex + 1], 10)
        : undefined;
    const safeExitStatus = Number.isNaN(exitStatus)
      ? null
      : (exitStatus ?? null);
    const result = verifyTraceFile(tracePath, {
      expectedMode,
      exitStatus: safeExitStatus ?? undefined,
    });
    const candidatePayload = {
      code: typeof result.code === 'string' ? result.code : 'TRACE_CORRUPT',
      valid: result.valid === true,
      summary:
        typeof result.summary === 'string'
          ? result.summary
          : 'Trace validation failed',
      diagnostics:
        result.diagnostics &&
        typeof result.diagnostics === 'object' &&
        !Array.isArray(result.diagnostics)
          ? result.diagnostics
          : { exitStatus: safeExitStatus },
    };
    let payload;
    try {
      payload = assertSanitizedEvidence(candidatePayload);
    } catch {
      payload = JSON.stringify({
        code: 'TRACE_SENSITIVE_DATA_DETECTED',
        valid: false,
        summary:
          'Sensitive or credential-like pattern detected in trace report',
        diagnostics: { exitStatus: safeExitStatus },
      });
      console.error(payload);
      return 1;
    }
    if (!result.valid) {
      console.error(payload);
      return 1;
    }
    console.log(payload);
    return 0;
  }

  const harnessOptions = {};
  const cliWorkdir = readFlagValue(argv, '--workdir');
  if (cliWorkdir) {
    harnessOptions.workdir = path.resolve(cliWorkdir);
  }
  const cliArtifactDir = readFlagValue(argv, '--artifact-dir');
  if (cliArtifactDir) {
    harnessOptions.artifactDir = path.resolve(cliArtifactDir);
  }
  const cliApiOrigin = readFlagValue(argv, '--api-origin');
  if (cliApiOrigin) {
    harnessOptions.api = cliApiOrigin;
  }
  const cliQuiescenceTimeout = readFlagValue(argv, '--quiescence-timeout-ms');
  if (cliQuiescenceTimeout !== undefined) {
    const parsed = Number.parseInt(cliQuiescenceTimeout, 10);
    if (!Number.isNaN(parsed) && parsed > 0) {
      harnessOptions.quiescenceTimeoutMs = parsed;
    }
  }
  const cliFixtureDrainTimeout = readFlagValue(
    argv,
    '--fixture-drain-timeout-ms',
  );
  if (cliFixtureDrainTimeout !== undefined) {
    const parsed = Number.parseInt(cliFixtureDrainTimeout, 10);
    if (!Number.isNaN(parsed) && parsed >= 0) {
      harnessOptions.fixtureDrainTimeoutMs = parsed;
    }
  }

  const { evidence, failure } = await runQaHarness(harnessOptions);
  if (failure) {
    const safeStage = allowlistedString(
      evidence.failure?.stage,
      ALLOWED_TRACE_STAGES,
      'UNKNOWN',
    );
    const safeCode = allowlistedString(
      evidence.failure?.code,
      ALLOWED_FAILURE_CODES,
      'QA_EXECUTION_FAILED',
    );
    console.error(
      `Browser-auth QA failed (${safeStage}:${safeCode}); review sanitized case evidence.`,
    );
    return 1;
  }
  console.log('Browser-auth QA passed in disposable local environment.');
  return 0;
}

const invokedPath = process.argv[1] ? path.resolve(process.argv[1]) : null;
const currentPath = fileURLToPath(import.meta.url);
if (invokedPath && invokedPath === currentPath) {
  const exitCode = await runCli();
  process.exit(exitCode);
}
