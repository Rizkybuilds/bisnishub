import { describe, expect, it } from 'vitest';
import { parsePublicEnvironment, parseServerEnvironment } from './env';
describe('environment boundary', () => {
  it('rejects a legacy service role JWT in public configuration', () => {
    const payload = btoa(JSON.stringify({ role: 'service_role' }));
    expect(() =>
      parsePublicEnvironment({
        NEXT_PUBLIC_SUPABASE_URL: 'http://127.0.0.1:55431',
        NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: `eyJhbGciOiJIUzI1NiJ9.${payload}.test`,
      }),
    ).toThrow('Invalid environment');
  });
  it('rejects non-HTTP application URLs', () => {
    expect(() =>
      parseServerEnvironment({ MGBOS_APP_URL: 'ftp://example.com' }),
    ).toThrow('Invalid environment');
  });
  it('allows unconnected bootstrap without fabricated credentials', () => {
    expect(
      parsePublicEnvironment({
        NEXT_PUBLIC_SUPABASE_URL: '',
        NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: '',
      }),
    ).toEqual({
      NEXT_PUBLIC_SUPABASE_URL: undefined,
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: undefined,
    });
  });
  it('strips server secrets from public output', () => {
    const result = parsePublicEnvironment({
      NEXT_PUBLIC_SUPABASE_URL: 'http://127.0.0.1:55431',
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: 'test-public-key',
      SUPABASE_SERVICE_ROLE_KEY: 'private-canary',
    });
    expect(JSON.stringify(result)).not.toContain('private-canary');
  });
  it('rejects partially configured connections', () => {
    expect(() =>
      parsePublicEnvironment({
        NEXT_PUBLIC_SUPABASE_URL: 'http://127.0.0.1:55431',
      }),
    ).toThrow('Invalid environment');
  });
  it('rejects secret keys in public variables', () => {
    expect(() =>
      parsePublicEnvironment({
        NEXT_PUBLIC_SUPABASE_URL: 'http://127.0.0.1:55431',
        NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: 'sb_secret_canary',
      }),
    ).toThrow('Invalid environment');
  });
  it('does not leak malformed values in errors', () => {
    expect(() =>
      parseServerEnvironment({ MGBOS_APP_URL: 'secret-canary' }),
    ).toThrow(
      'Invalid environment configuration. Check variable names and formats in .env.example.',
    );
  });
});
