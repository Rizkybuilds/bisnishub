import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const loginFormPath = 'apps/mgbos/src/app/(auth)/login/LoginForm.tsx';
const loginPagePath = 'apps/mgbos/src/app/(auth)/login/page.tsx';

describe('SEC-01 login form credential hygiene', () => {
  it('does not embed credential field default values', () => {
    const source = readFileSync(loginFormPath, 'utf8');
    expect(source).toContain('name="email"');
    expect(source).toContain('name="password"');
    expect(source).not.toMatch(/\b(?:defaultValue|value)\s*=/);
  });

  it('does not disclose the seeded account on the anonymous login page', () => {
    const source = readFileSync(loginPagePath, 'utf8');
    expect(source).toContain('<LoginForm />');
    expect(source).not.toMatch(/akun lokal bawaan seed/i);
    expect(source).not.toMatch(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i);
  });
});
