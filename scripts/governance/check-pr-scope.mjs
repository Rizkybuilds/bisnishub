import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

// Shared coordination files may accompany a system move. Other systems and
// business content remain isolated from MGBOS implementation changes.
const coordination = /^(?:AGENTS\.md|README\.md|GEMINI\.md|package\.json|\.gitignore|\.github\/CODEOWNERS|\.github\/workflows\/(?:agent-governance|repository-integrity)\.yml|scripts\/governance\/[^/]+|docs\/(?:project-index\.md|engineering\/[^/]+|decisions\/[^/]+)|\.agents\/(?:skills|roles|evals)\/.*)$/;
export function checkScope(files) {
  const isMgbos = (file) => /^(?:mgbos\/|systems\/mgbos\/|\.github\/workflows\/mgbos-)/.test(file);
  if (!files.some(isMgbos)) return [];
  return files.filter((file) => !isMgbos(file) && !coordination.test(file));
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const [base, head] = process.argv.slice(2);
  if (!/^[0-9a-f]{40}$/.test(base ?? '') || !/^[0-9a-f]{40}$/.test(head ?? '')) {
    throw new Error('Explicit full base and head commit SHAs are required');
  }
  // --no-renames includes BOTH ends of a move, so moving unrelated code into
  // MGBOS cannot disguise a cross-system change as a rename.
  const files = execFileSync('git', ['diff', '--no-renames', '--name-only', '-z', `${base}...${head}`], { encoding: 'utf8' }).split('\0').filter(Boolean);
  const violations = checkScope(files);
  if (violations.length) {
    console.error('MGBOS changes include unrelated paths:\n' + violations.join('\n'));
    process.exitCode = 1;
  } else console.log('PASS: system scope isolation');
}
