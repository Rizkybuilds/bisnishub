import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

describe('local database command boundary', () => {
  it.each([
    ['reset', '--linked'],
    ['reset', '--db-url', 'postgres://example.invalid/remote'],
    ['start', '--workdir', '..'],
    ['push'],
  ])('rejects unsafe or unsupported arguments: %j', (...args) => {
    const script = fileURLToPath(new URL('./database.mjs', import.meta.url));
    const result = spawnSync(process.execPath, [script, ...args], {
      encoding: 'utf8',
    });
    expect(result.status).toBe(1);
    expect(result.stderr).toContain(
      'Only the local MGBOS database is supported',
    );
    expect(result.stdout).toBe('');
  });
});
