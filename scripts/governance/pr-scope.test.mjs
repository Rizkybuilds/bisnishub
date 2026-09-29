import test from 'node:test';
import assert from 'node:assert/strict';
import { checkScope } from './check-pr-scope.mjs';

test('whole workspace move and explicit coordination paths are allowed', () => {
  assert.deepEqual(checkScope(['mgbos/package.json', 'systems/mgbos/package.json', 'package.json', '.agents/roles/contracts.json', '.github/workflows/agent-governance.yml', 'scripts/governance/validate-agent-governance.py', 'docs/engineering/repository-layout.md', 'AGENTS.md']), []);
});
for (const root of ['mgbos/', 'systems/mgbos/']) {
  for (const unrelated of ['bisnis/teestock/README.md', 'systems/kaskita/package.json', 'archive/old.ts', 'apps/bisnishub-web/a.ts', 'packages/shared/a.ts', 'scripts/deploy.mjs', '.github/workflows/kaskita.yml', '.agents/agent-skill-audit.md']) {
    test(`${root} rejects unrelated ${unrelated}`, () => {
      assert.deepEqual(checkScope([root + 'package.json', unrelated]), [unrelated]);
    });
  }
}
test('non-MGBOS maintenance remains independently scoped', () => {
  assert.deepEqual(checkScope(['apps/bisnishub-web/a.ts', 'archive/old.ts']), []);
});

test('MGBOS prose may accompany cross-system repository maintenance', () => {
  assert.deepEqual(checkScope(['systems/mgbos/docs/architecture/model.md', 'systems/jarvis/docs/charter.md', 'tools/assistant/main.py']), []);
});
for (const mgbos of ['systems/mgbos/docs/helper.mjs', 'systems/mgbos/AGENTS.md', 'systems/mgbos/apps/mgbos/page.tsx', '.github/workflows/mgbos-foundation.yml']) {
  test(`documentation does not hide isolated change: ${mgbos}`, () => {
    assert.deepEqual(checkScope([mgbos, 'systems/mgbos/docs/model.md', 'systems/kaskita/app.ts']), ['systems/kaskita/app.ts']);
  });
}
