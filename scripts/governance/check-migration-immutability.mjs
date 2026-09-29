import { execFileSync } from "node:child_process";
import { existsSync, lstatSync, readdirSync, realpathSync } from "node:fs";
import { isAbsolute, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const migrationDirs = ["mgbos/supabase/migrations", "systems/mgbos/supabase/migrations"];

function git(cwd, args) {
  return execFileSync("git", args, {
    cwd,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
}

function commit(cwd, ref) {
  if (!ref || /^0+$/.test(ref))
    throw new Error(
      "A non-zero existing base/head commit is required; fetch comparison history.",
    );
  return git(cwd, [
    "rev-parse",
    "--verify",
    "--end-of-options",
    `${ref}^{commit}`,
  ]).trim();
}

function tree(cwd, sha) {
  const records = git(cwd, ["ls-tree", "-r", "-z", sha, "--", ...migrationDirs])
    .split("\0")
    .filter(Boolean);
  return new Map(
    records.map((record) => {
      const tab = record.indexOf("\t");
      const [mode, type, oid] = record.slice(0, tab).split(" ");
      return [record.slice(tab + 1), { mode, type, oid }];
    }),
  );
}

function ensureDirectory(cwd, directory) {
  const absolute = resolve(cwd, directory);
  const rel = relative(realpathSync(cwd), realpathSync(absolute));
  if (isAbsolute(rel) || rel === ".." || rel.startsWith(`..${sep}`))
    throw new Error(`Migration directory escapes repository: ${directory}`);
  let current = cwd;
  for (const part of directory.split("/")) {
    current = join(current, part);
    if (lstatSync(current).isSymbolicLink())
      throw new Error(`Symlink directory is forbidden: ${directory}`);
  }
}

function workingTree(cwd) {
  const result = new Map();

  function visit(directory) {
    for (const entry of readdirSync(join(cwd, directory), {
      withFileTypes: true,
    })) {
      const path = `${directory}/${entry.name}`;
      if (entry.isSymbolicLink())
        throw new Error(`Migration symlink is forbidden: ${path}`);
      if (entry.isDirectory()) {
        visit(path);
        continue;
      }
      if (!entry.isFile()) throw new Error(`Non-file migration entry: ${path}`);
      // Git normalizes CRLF according to attributes; compare canonical Git blobs.
      const oid = git(cwd, [
        "hash-object",
        `--path=${path}`,
        "--",
        path,
      ]).trim();
      result.set(path, { mode: "100644", type: "blob", oid });
    }
  }
  for (const migrationDir of migrationDirs) {
    if (!existsSync(join(cwd, migrationDir))) continue;
    ensureDirectory(cwd, migrationDir);
    visit(migrationDir);
  }
  return result;
}

function canonical(entries, violations) {
  const roots = new Set();
  const normalized = new Map();
  for (const [path, entry] of entries) {
    const root = migrationDirs.find((dir) => path.startsWith(`${dir}/`));
    if (!root) throw new Error(`Unknown migration root: ${path}`);
    roots.add(root);
    const name = path.slice(root.length + 1);
    if (normalized.has(name)) violations.push(`${name}: duplicate migration across roots`);
    normalized.set(name, entry);
  }
  if (roots.size > 1) violations.push("Migration history must live in one canonical root; split/duplicate roots are forbidden");
  return normalized;
}

function compare(base, head) {
  const violations = [];
  base = canonical(base, violations);
  head = canonical(head, violations);
  for (const [path, old] of base) {
    const next = head.get(path);
    if (!next) violations.push(`${path}: deleted or renamed`);
    else if (
      old.oid !== next.oid ||
      old.mode !== next.mode ||
      old.type !== next.type
    )
      violations.push(`${path}: content or file type/mode changed`);
  }
  for (const [path, entry] of head) {
    if (entry.type !== "blob" || !["100644", "100755"].includes(entry.mode))
      violations.push(`${path}: migration must be a regular file`);
  }
  return violations;
}

export function checkMigrations({ cwd = process.cwd(), base, head }) {
  const root = git(cwd, ["rev-parse", "--show-toplevel"]).trim();
  const baseSha = commit(root, base);
  const before = tree(root, baseSha);
  if (head) {
    const headSha = commit(root, head);
    return {
      base: baseSha,
      head: headSha,
      protectedFiles: before.size,
      violations: compare(before, tree(root, headSha)),
    };
  }
  const current = workingTree(root);
  // Check staged state too: an edit hidden by an unstaged restoration must fail.
  const index = new Map();
  for (const record of git(root, [
    "ls-files",
    "--stage",
    "-z",
    "--",
    ...migrationDirs,
  ])
    .split("\0")
    .filter(Boolean)) {
    const tab = record.indexOf("\t");
    const [mode, oid, stage] = record.slice(0, tab).split(" ");
    if (stage !== "0")
      throw new Error(
        "Unmerged migration index; resolve conflicts before validation.",
      );
    index.set(record.slice(tab + 1), { mode, type: "blob", oid });
  }
  // Honor staged modes on platforms whose executable bit is not represented in stat.
  for (const [path, entry] of current) {
    if (index.has(path)) entry.mode = index.get(path).mode;
    if (process.platform !== "win32")
      entry.mode =
        lstatSync(join(root, path)).mode & 0o111 ? "100755" : "100644";
  }
  return {
    base: baseSha,
    head: "index + working tree",
    protectedFiles: before.size,
    violations: [
      ...new Set([...compare(before, index), ...compare(before, current)]),
    ],
  };
}

function main() {
  const args = process.argv.slice(2);
  const options = {};
  for (let i = 0; i < args.length; i += 2) {
    if (
      !["--base", "--head"].includes(args[i]) ||
      !args[i + 1] ||
      args[i + 1].startsWith("--") ||
      options[args[i].slice(2)]
    )
      throw new Error(
        "Usage: node check-migration-immutability.mjs --base <ref> [--head <ref>]",
      );
    options[args[i].slice(2)] = args[i + 1];
  }
  const result = checkMigrations(options);
  if (result.violations.length)
    throw new Error(
      `Migration history is immutable; add a corrective migration:\n${result.violations.join("\n")}`,
    );
  console.log(
    `PASS: ${result.protectedFiles} existing migrations unchanged (${result.base} -> ${result.head}).`,
  );
}

if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  try {
    main();
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
