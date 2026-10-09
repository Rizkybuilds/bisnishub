import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const loginSource = readFileSync(
  fileURLToPath(
    new URL('../apps/mgbos/src/app/(auth)/login/LoginForm.tsx', import.meta.url),
  ),
  'utf8',
);

const loginInputs = loginSource.match(/<input\b[\s\S]*?\/>/g) ?? [];

describe('SEC-01 login form credential hygiene (Issue #57 Scope A)', () => {
  it.each(['email', 'password'])('does not prefill %s', (fieldName) => {
    const fieldAttribute = `name="${fieldName}"`;
    const input = loginInputs.find((tag) => tag.includes(fieldAttribute));

    expect(input).toBeDefined();
    expect(input).not.toMatch(/\b(?:defaultValue|value)\s*=/);
  });
});
