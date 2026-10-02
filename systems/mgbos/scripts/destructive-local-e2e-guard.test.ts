import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it, vi } from 'vitest';
// @ts-expect-error TS7016: untyped JS module
// prettier-ignore
import { CANONICAL_LOCAL_SERVICE_ROLE_KEY, CANONICAL_LOCAL_SUPABASE_ORIGIN, REQUIRED_DESTRUCTIVE_OPT_IN_ENV, REQUIRED_DESTRUCTIVE_OPT_IN_VALUE, createDestructiveLocalSupabaseFetch, resolveDestructiveLocalE2EEnvironment } from './destructive-local-e2e-guard.mjs';

describe('Destructive Local E2E Execution Guard (CP-007C)', () => {
  describe('resolveDestructiveLocalE2EEnvironment', () => {
    it('rejects when opt-in acknowledgement is missing', () => {
      expect(() => resolveDestructiveLocalE2EEnvironment({})).toThrow(
        /missing or invalid MGBOS_DESTRUCTIVE_LOCAL_E2E acknowledgement/,
      );
    });

    it.each([['true'], ['yes'], ['0'], [''], ['TRUE'], ['2'], ['enabled']])(
      'rejects non-"1" opt-in acknowledgement value: %j',
      (val) => {
        expect(() =>
          resolveDestructiveLocalE2EEnvironment({
            [REQUIRED_DESTRUCTIVE_OPT_IN_ENV]: val,
          }),
        ).toThrow(
          /missing or invalid MGBOS_DESTRUCTIVE_LOCAL_E2E acknowledgement/,
        );
      },
    );

    it('allows canonical local default when opt-in is valid', () => {
      const env = resolveDestructiveLocalE2EEnvironment({
        [REQUIRED_DESTRUCTIVE_OPT_IN_ENV]: REQUIRED_DESTRUCTIVE_OPT_IN_VALUE,
      });
      expect(env.baseUrl).toBe(CANONICAL_LOCAL_SUPABASE_ORIGIN);
      expect(env.serviceRoleKey).toBe(CANONICAL_LOCAL_SERVICE_ROLE_KEY);
    });

    it('allows explicit canonical local URL with or without trailing slash', () => {
      const env1 = resolveDestructiveLocalE2EEnvironment({
        [REQUIRED_DESTRUCTIVE_OPT_IN_ENV]: REQUIRED_DESTRUCTIVE_OPT_IN_VALUE,
        NEXT_PUBLIC_SUPABASE_URL: 'http://127.0.0.1:55431',
      });
      expect(env1.baseUrl).toBe(CANONICAL_LOCAL_SUPABASE_ORIGIN);

      const env2 = resolveDestructiveLocalE2EEnvironment({
        [REQUIRED_DESTRUCTIVE_OPT_IN_ENV]: REQUIRED_DESTRUCTIVE_OPT_IN_VALUE,
        NEXT_PUBLIC_SUPABASE_URL: 'http://127.0.0.1:55431/',
      });
      expect(env2.baseUrl).toBe(CANONICAL_LOCAL_SUPABASE_ORIGIN);
    });

    it('allows explicit canonical local service role key', () => {
      const env = resolveDestructiveLocalE2EEnvironment({
        [REQUIRED_DESTRUCTIVE_OPT_IN_ENV]: REQUIRED_DESTRUCTIVE_OPT_IN_VALUE,
        SUPABASE_SERVICE_ROLE_KEY: CANONICAL_LOCAL_SERVICE_ROLE_KEY,
      });
      expect(env.serviceRoleKey).toBe(CANONICAL_LOCAL_SERVICE_ROLE_KEY);
    });

    it.each([
      ['https://example.supabase.co'],
      ['https://project-id.supabase.co'],
      ['http://example.com:55431'],
      ['http://192.168.1.100:55431'],
      ['http://10.0.0.1:55431'],
      ['http://0.0.0.0:55431'],
    ])('rejects non-canonical hosted or remote URLs: %j', (url) => {
      expect(() =>
        resolveDestructiveLocalE2EEnvironment({
          [REQUIRED_DESTRUCTIVE_OPT_IN_ENV]: REQUIRED_DESTRUCTIVE_OPT_IN_VALUE,
          NEXT_PUBLIC_SUPABASE_URL: url,
        }),
      ).toThrow(/violates local security invariants/);
    });

    it.each([
      ['http://127.0.0.1:54321'],
      ['http://127.0.0.1:8000'],
      ['http://127.0.0.1:3000'],
      ['http://127.0.0.1:55432'],
    ])('rejects non-canonical local port: %j', (url) => {
      expect(() =>
        resolveDestructiveLocalE2EEnvironment({
          [REQUIRED_DESTRUCTIVE_OPT_IN_ENV]: REQUIRED_DESTRUCTIVE_OPT_IN_VALUE,
          NEXT_PUBLIC_SUPABASE_URL: url,
        }),
      ).toThrow(/violates local security invariants/);
    });

    it('rejects localhost hostname in place of explicit 127.0.0.1', () => {
      expect(() =>
        resolveDestructiveLocalE2EEnvironment({
          [REQUIRED_DESTRUCTIVE_OPT_IN_ENV]: REQUIRED_DESTRUCTIVE_OPT_IN_VALUE,
          NEXT_PUBLIC_SUPABASE_URL: 'http://localhost:55431',
        }),
      ).toThrow(/violates local security invariants/);
    });

    it('rejects HTTPS local-looking URL', () => {
      expect(() =>
        resolveDestructiveLocalE2EEnvironment({
          [REQUIRED_DESTRUCTIVE_OPT_IN_ENV]: REQUIRED_DESTRUCTIVE_OPT_IN_VALUE,
          NEXT_PUBLIC_SUPABASE_URL: 'https://127.0.0.1:55431',
        }),
      ).toThrow(/violates local security invariants/);
    });

    it.each([
      ['http://user:pass@127.0.0.1:55431', 'credentials'],
      ['http://127.0.0.1:55431?param=1', 'query'],
      ['http://127.0.0.1:55431#section', 'fragment'],
      ['http://127.0.0.1:55431/extra-path', 'path'],
    ])('rejects URL with extra component (%s): %j', (url) => {
      expect(() =>
        resolveDestructiveLocalE2EEnvironment({
          [REQUIRED_DESTRUCTIVE_OPT_IN_ENV]: REQUIRED_DESTRUCTIVE_OPT_IN_VALUE,
          NEXT_PUBLIC_SUPABASE_URL: url,
        }),
      ).toThrow(/violates local security invariants/);
    });

    it('rejects non-local service role key and never leaks the secret canary', () => {
      const canarySecret = 'super-secret-production-canary-key-999';
      let caughtError: Error | null = null;
      try {
        resolveDestructiveLocalE2EEnvironment({
          [REQUIRED_DESTRUCTIVE_OPT_IN_ENV]: REQUIRED_DESTRUCTIVE_OPT_IN_VALUE,
          SUPABASE_SERVICE_ROLE_KEY: canarySecret,
        });
      } catch (err) {
        caughtError = err as Error;
      }
      expect(caughtError).not.toBeNull();
      expect(caughtError!.message).toContain(
        'SUPABASE_SERVICE_ROLE_KEY must not be overridden with a non-canonical credential',
      );
      expect(caughtError!.message).not.toContain(canarySecret);
    });
  });

  describe('createDestructiveLocalSupabaseFetch', () => {
    const validEnv = {
      baseUrl: CANONICAL_LOCAL_SUPABASE_ORIGIN,
      serviceRoleKey: CANONICAL_LOCAL_SERVICE_ROLE_KEY,
    };

    it('blocks off-origin URL before underlying fetch is invoked', async () => {
      const mockFetch = vi.fn();
      const guardedFetch = createDestructiveLocalSupabaseFetch(
        validEnv,
        mockFetch,
      );

      await expect(
        guardedFetch('https://example.supabase.co/rest/v1/users'),
      ).rejects.toThrow(/blocked request to non-local origin/);
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('blocks off-port loopback URL before underlying fetch is invoked', async () => {
      const mockFetch = vi.fn();
      const guardedFetch = createDestructiveLocalSupabaseFetch(
        validEnv,
        mockFetch,
      );

      await expect(
        guardedFetch('http://127.0.0.1:8080/rest/v1/users'),
      ).rejects.toThrow(/blocked request to non-local origin/);
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('forces redirect = "error" on canonical local requests', async () => {
      const mockFetch = vi
        .fn()
        .mockResolvedValue(new Response('{}', { status: 200 }));
      const guardedFetch = createDestructiveLocalSupabaseFetch(
        validEnv,
        mockFetch,
      );

      await guardedFetch('http://127.0.0.1:55431/rest/v1/rpc/test', {
        method: 'POST',
        redirect: 'follow', // caller attempted follow
      });

      expect(mockFetch).toHaveBeenCalledOnce();
      const callArgs = mockFetch.mock.calls[0]!;
      expect(callArgs[1]?.redirect).toBe('error');
    });

    it('allows relative path and resolves against canonical origin', async () => {
      const mockFetch = vi
        .fn()
        .mockResolvedValue(new Response('{}', { status: 200 }));
      const guardedFetch = createDestructiveLocalSupabaseFetch(
        validEnv,
        mockFetch,
      );

      await guardedFetch('/rest/v1/users');
      expect(mockFetch).toHaveBeenCalledOnce();
      expect(mockFetch.mock.calls[0]![1]?.redirect).toBe('error');
    });
  });

  describe('source code protection checks (no bare fetch regression)', () => {
    const protectedScripts = [
      './verify-happy-path-e2e.mjs',
      './verify-e2e-flow.mjs',
      './test-document-concurrency.mjs',
    ];

    it.each(protectedScripts)(
      'ensures %s imports shared guard and contains no bare fetch()',
      (relativePath) => {
        const filePath = fileURLToPath(new URL(relativePath, import.meta.url));
        const source = readFileSync(filePath, 'utf8');

        expect(source).toContain('resolveDestructiveLocalE2EEnvironment');
        expect(source).toContain('createDestructiveLocalSupabaseFetch');

        // Strip comments and check that no bare fetch( calls remain
        const strippedSource = source
          .replace(/\/\*[\s\S]*?\*\//g, '')
          .replace(/\/\/.*/g, '');

        // Match fetch( that is not guardedFetch( or customFetch(
        const bareFetchMatches = [
          ...strippedSource.matchAll(/(?<!guarded|custom)fetch\s*\(/g),
        ];
        expect(bareFetchMatches).toHaveLength(0);
      },
    );
  });

  describe('script-level negative integration (spawning actual node processes)', () => {
    const protectedScripts = [
      './verify-happy-path-e2e.mjs',
      './verify-e2e-flow.mjs',
      './test-document-concurrency.mjs',
    ];

    it.each(protectedScripts)(
      '%s fails closed without MGBOS_DESTRUCTIVE_LOCAL_E2E acknowledgement',
      (relativePath) => {
        const scriptPath = fileURLToPath(
          new URL(relativePath, import.meta.url),
        );
        const result = spawnSync(process.execPath, [scriptPath], {
          encoding: 'utf8',
          env: {
            ...process.env,
            MGBOS_DESTRUCTIVE_LOCAL_E2E: undefined,
          },
        });

        expect(result.status).not.toBe(0);
        const combinedOutput = (result.stdout || '') + (result.stderr || '');
        expect(combinedOutput).toContain('MGBOS_DESTRUCTIVE_LOCAL_E2E');
      },
    );

    it.each(protectedScripts)(
      '%s fails closed on hosted URL and never echoes secret canary',
      (relativePath) => {
        const scriptPath = fileURLToPath(
          new URL(relativePath, import.meta.url),
        );
        const canarySecret = 'canary-super-secret-key-do-not-leak';
        const result = spawnSync(process.execPath, [scriptPath], {
          encoding: 'utf8',
          env: {
            ...process.env,
            MGBOS_DESTRUCTIVE_LOCAL_E2E: '1',
            NEXT_PUBLIC_SUPABASE_URL: 'https://example.supabase.co',
            SUPABASE_SERVICE_ROLE_KEY: canarySecret,
          },
        });

        expect(result.status).not.toBe(0);
        const combinedOutput = (result.stdout || '') + (result.stderr || '');
        expect(combinedOutput).toContain('violates local security invariants');
        expect(combinedOutput).not.toContain(canarySecret);
      },
    );
  });
});
