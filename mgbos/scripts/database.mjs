import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import path from 'node:path';

if (process.platform === 'win32') {
  const dockerBin = 'C:\\Program Files\\Docker\\Docker\\resources\\bin';
  if (existsSync(dockerBin) && !process.env.PATH?.includes(dockerBin)) {
    process.env.PATH = `${dockerBin};${process.env.PATH ?? ''}`;
  }
}

const root = fileURLToPath(new URL('../', import.meta.url));
const commands = {
  start: ['start'],
  stop: ['stop'],
  reset: ['db', 'reset', '--local'],
  test: ['test', 'db', '--local'],
  types: ['gen', 'types', 'typescript', '--local', '--schema', 'app,internal'],
};
const [command, ...extra] = process.argv.slice(2);
if (!Object.hasOwn(commands, command ?? '') || extra.length) {
  console.error(
    'Use start, stop, reset, test, or types without extra arguments. Only the local MGBOS database is supported.',
  );
  process.exit(1);
}
const executable = path.join(
  root,
  'node_modules',
  'supabase',
  'dist',
  'supabase.js',
);
const result = spawnSync(
  process.execPath,
  [executable, ...commands[command], '--workdir', root],
  {
    cwd: root,
    encoding: 'utf8',
    stdio: command === 'types' ? ['ignore', 'pipe', 'inherit'] : 'inherit',
  },
);
if (result.error) console.error(result.error.message);
if (result.status !== 0) process.exit(result.status ?? 1);
if (command === 'types') {
  mkdirSync(path.join(root, 'packages/database/generated'), {
    recursive: true,
  });
  writeFileSync(
    path.join(root, 'packages/database/generated/database.types.ts'),
    result.stdout,
  );
}
