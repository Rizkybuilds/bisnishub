/**
 * Destructive Local E2E Execution Guard (CP-007C)
 *
 * Ensures that service-role destructive verification and concurrency scripts
 * can only execute against the canonical local Supabase instance
 * (http://127.0.0.1:55431) with explicit human/runtime opt-in.
 */

export const CANONICAL_LOCAL_SUPABASE_ORIGIN = 'http://127.0.0.1:55431';
export const CANONICAL_LOCAL_SERVICE_ROLE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';
export const REQUIRED_DESTRUCTIVE_OPT_IN_ENV = 'MGBOS_DESTRUCTIVE_LOCAL_E2E';
export const REQUIRED_DESTRUCTIVE_OPT_IN_VALUE = '1';

/**
 * Validates the execution environment for destructive local E2E scripts.
 *
 * Fails closed if:
 * - MGBOS_DESTRUCTIVE_LOCAL_E2E !== '1'
 * - NEXT_PUBLIC_SUPABASE_URL is non-local or structurally invalid
 * - SUPABASE_SERVICE_ROLE_KEY is present and differs from canonical demo key
 *
 * @param {Record<string, string | undefined>} [env=process.env]
 * @returns {{ baseUrl: string, serviceRoleKey: string }}
 */
export function resolveDestructiveLocalE2EEnvironment(env = process.env) {
  const optIn = env[REQUIRED_DESTRUCTIVE_OPT_IN_ENV];
  if (optIn !== REQUIRED_DESTRUCTIVE_OPT_IN_VALUE) {
    throw new Error(
      `Destructive local E2E execution rejected: missing or invalid ${REQUIRED_DESTRUCTIVE_OPT_IN_ENV} acknowledgement. ` +
        `Expected exact value "${REQUIRED_DESTRUCTIVE_OPT_IN_VALUE}", got ${optIn === undefined ? 'undefined' : JSON.stringify(optIn)}. ` +
        `This script intentionally mutates disposable local MGBOS data and must be explicitly acknowledged. ` +
        `See docs/runbooks/local-database.md for usage.`,
    );
  }

  const rawUrl = env.NEXT_PUBLIC_SUPABASE_URL;
  if (rawUrl !== undefined && rawUrl !== '') {
    let parsed;
    try {
      parsed = new URL(rawUrl);
    } catch (err) {
      throw new Error(
        `Destructive local E2E execution rejected: NEXT_PUBLIC_SUPABASE_URL is not a valid URL: ${err.message}`,
      );
    }

    if (
      parsed.protocol !== 'http:' ||
      parsed.hostname !== '127.0.0.1' ||
      parsed.port !== '55431' ||
      (parsed.pathname !== '/' && parsed.pathname !== '') ||
      parsed.username !== '' ||
      parsed.password !== '' ||
      parsed.search !== '' ||
      parsed.hash !== ''
    ) {
      throw new Error(
        `Destructive local E2E execution rejected: NEXT_PUBLIC_SUPABASE_URL must resolve strictly to canonical local origin "${CANONICAL_LOCAL_SUPABASE_ORIGIN}". ` +
          `Configured URL violates local security invariants.`,
      );
    }
  }

  const rawKey = env.SUPABASE_SERVICE_ROLE_KEY;
  if (
    rawKey !== undefined &&
    rawKey !== '' &&
    rawKey !== CANONICAL_LOCAL_SERVICE_ROLE_KEY
  ) {
    throw new Error(
      `Destructive local E2E execution rejected: SUPABASE_SERVICE_ROLE_KEY must not be overridden with a non-canonical credential.`,
    );
  }

  return {
    baseUrl: CANONICAL_LOCAL_SUPABASE_ORIGIN,
    serviceRoleKey: CANONICAL_LOCAL_SERVICE_ROLE_KEY,
  };
}

/**
 * Creates a guarded fetch function that blocks any requests to non-local origins
 * and prevents following HTTP redirects to arbitrary network targets.
 *
 * @param {{ baseUrl: string, serviceRoleKey: string }} resolvedEnvironment
 * @param {typeof fetch} [customFetch=globalThis.fetch]
 * @returns {typeof fetch}
 */
export function createDestructiveLocalSupabaseFetch(
  resolvedEnvironment,
  customFetch = globalThis.fetch,
) {
  if (
    !resolvedEnvironment ||
    resolvedEnvironment.baseUrl !== CANONICAL_LOCAL_SUPABASE_ORIGIN
  ) {
    throw new Error(
      `createDestructiveLocalSupabaseFetch requires a validated local environment with origin "${CANONICAL_LOCAL_SUPABASE_ORIGIN}".`,
    );
  }

  return async function destructiveLocalFetch(input, init = {}) {
    let urlString;
    if (input instanceof Request) {
      urlString = input.url;
    } else if (typeof input === 'string') {
      urlString = input;
    } else if (input && typeof input.href === 'string') {
      urlString = input.href;
    } else {
      urlString = String(input);
    }

    let parsed;
    try {
      parsed = new URL(urlString, CANONICAL_LOCAL_SUPABASE_ORIGIN);
    } catch (err) {
      throw new Error(
        `Destructive local fetch blocked invalid request URL: ${err.message}`,
      );
    }

    if (parsed.origin !== CANONICAL_LOCAL_SUPABASE_ORIGIN) {
      throw new Error(
        `Destructive local fetch blocked request to non-local origin "${parsed.origin}". ` +
          `Only "${CANONICAL_LOCAL_SUPABASE_ORIGIN}" is authorized.`,
      );
    }

    const guardedInit = {
      ...init,
      redirect: 'error',
    };

    return customFetch(input, guardedInit);
  };
}
