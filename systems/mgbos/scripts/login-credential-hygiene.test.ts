import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const loginFormPath = 'apps/mgbos/src/app/(auth)/login/LoginForm.tsx';

describe('SEC-01 login form credential hygiene', () => {
  it('does not embed credential field default values', () => {
    const source = readFileSync(loginFormPath, 'utf8');
    expect(source).toContain('name="email"');
    expect(source).toContain('name="password"');
    expect(source).not.toMatch(/\b(?:defaultValue|value)\s*=/);
  });
});
