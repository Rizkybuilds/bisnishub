import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import {
  mkdtempSync,
  mkdirSync,
  writeFileSync,
  rmSync,
  renameSync,
  symlinkSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { checkMigrations } from "./check-migration-immutability.mjs";

function fixture(t) {
  const cwd = mkdtempSync(join(tmpdir(), "mgbos-migration-test-"));
  t.after(() => rmSync(cwd, { recursive: true, force: true }));
  const git = (...args) =>
    execFileSync("git", args, {
      cwd,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    }).trim();
  git("init", "-q");
  git("config", "user.name", "Governance Test");
  git("config", "user.email", "governance-test@example.invalid");
  git("config", "commit.gpgsign", "false");
  git("config", "core.autocrlf", "false");
  git("config", "core.hooksPath", "no-hooks");
  const dir = join(cwd, "mgbos/supabase/migrations");
  mkdirSync(dir, { recursive: true });
  const original = join(dir, "20260101000000_initial.sql");
  writeFileSync(original, "select 1;\n");
  git("add", ".");
  git("commit", "-qm", "base");
  return { cwd, git, dir, original, base: git("rev-parse", "HEAD") };
}

test("unchanged and additive migrations pass in commit and working-tree modes", (t) => {
  const f = fixture(t);
  assert.deepEqual(checkMigrations(f).violations, []);
  writeFileSync(join(f.dir, "20260102000000_new.sql"), "select 2;\n");
  assert.deepEqual(checkMigrations(f).violations, []);
  f.git("add", ".");
  f.git("commit", "-qm", "new migration");
  assert.deepEqual(checkMigrations({ ...f, head: "HEAD" }).violations, []);
});

function relocate(f) {
  const parent = join(f.cwd, "systems/mgbos/supabase");
  mkdirSync(parent, { recursive: true });
  const dir = join(parent, "migrations");
  renameSync(f.dir, dir);
  return dir;
}

test("whole-root relocation preserves history and rollback remains protected", (t) => {
  const f = fixture(t);
  const dir = relocate(f);
  f.git("add", "-A");
  assert.deepEqual(checkMigrations(f).violations, []);
  f.git("commit", "-qm", "relocate");
  assert.deepEqual(checkMigrations({ ...f, head: "HEAD" }).violations, []);
  assert.deepEqual(checkMigrations({ cwd: f.cwd, base: "HEAD", head: f.base }).violations, []);
  const relocatedBase = f.git("rev-parse", "HEAD");
  writeFileSync(join(dir, "20260102000000_new.sql"), "select 2;\n");
  f.git("add", "-A");
  assert.deepEqual(checkMigrations({ ...f, base: relocatedBase }).violations, []);
  writeFileSync(join(dir, "20260101000000_initial.sql"), "select 9;\n");
  assert.ok(checkMigrations({ ...f, base: relocatedBase }).violations.length);
});

for (const change of ["edit", "delete", "rename", "mode", "duplicate", "split", "hidden-index"]) {
  test(`relocation rejects ${change}`, (t) => {
    const f = fixture(t);
    const dir = relocate(f);
    const moved = join(dir, "20260101000000_initial.sql");
    if (change === "edit") writeFileSync(moved, "select 9;\n");
    if (change === "delete") rmSync(moved);
    if (change === "rename") renameSync(moved, join(dir, "renamed.sql"));
    if (["duplicate", "split"].includes(change)) {
      mkdirSync(f.dir, { recursive: true });
      writeFileSync(join(f.dir, change === "duplicate" ? "20260101000000_initial.sql" : "20260102000000_other.sql"), "select 1;\n");
    }
    if (change === "hidden-index") writeFileSync(moved, "select 8;\n");
    f.git("add", "-A");
    if (change === "mode") f.git("update-index", "--chmod=+x", "systems/mgbos/supabase/migrations/20260101000000_initial.sql");
    if (change === "hidden-index") writeFileSync(moved, "select 1;\n");
    assert.ok(checkMigrations(f).violations.length > 0);
    f.git("commit", "-qm", change);
    assert.ok(checkMigrations({ ...f, head: "HEAD" }).violations.length > 0);
  });
}

for (const change of ["edit", "delete", "rename", "mode"]) {
  test(`existing migration ${change} fails`, (t) => {
    const f = fixture(t);
    if (change === "edit") writeFileSync(f.original, "select 999;\n");
    if (change === "delete") rmSync(f.original);
    if (change === "rename") renameSync(f.original, join(f.dir, "renamed.sql"));
    if (change === "mode")
      f.git(
        "update-index",
        "--chmod=+x",
        "mgbos/supabase/migrations/20260101000000_initial.sql",
      );
    assert.ok(checkMigrations(f).violations.length > 0);
    if (change !== "mode") f.git("add", "-A");
    f.git("commit", "-qm", change);
    assert.ok(checkMigrations({ ...f, head: "HEAD" }).violations.length > 0);
  });
}

test("staged edit cannot hide behind restored working file", (t) => {
  const f = fixture(t);
  writeFileSync(f.original, "select 8;\n");
  f.git("add", ".");
  writeFileSync(f.original, "select 1;\n");
  assert.ok(checkMigrations(f).violations.length > 0);
});

test("missing, zero and unknown refs fail closed", (t) => {
  const f = fixture(t);
  for (const base of [undefined, "0".repeat(40), "missing-ref"])
    assert.throws(() => checkMigrations({ ...f, base }));
  assert.throws(() => checkMigrations({ ...f, head: "missing-ref" }));
});

test("base-tip comparison catches a migration added on base after divergence", (t) => {
  const f = fixture(t);
  const earlier = f.base;
  writeFileSync(join(f.dir, "20260103000000_base_only.sql"), "select 3;\n");
  f.git("add", ".");
  f.git("commit", "-qm", "base moves");
  assert.ok(
    checkMigrations({ cwd: f.cwd, base: "HEAD", head: earlier }).violations
      .length > 0,
  );
});

test("unrelated legacy migration changes are outside MGBOS guard scope", (t) => {
  const f = fixture(t);
  mkdirSync(join(f.cwd, "legacy"), { recursive: true });
  writeFileSync(join(f.cwd, "legacy/test.sql"), "select 77;\n");
  assert.deepEqual(checkMigrations(f).violations, []);
});

test(
  "symlink migration is rejected without following its target",
  { skip: process.platform === "win32" },
  (t) => {
    const f = fixture(t);
    symlinkSync(f.original, join(f.dir, "linked.sql"));
    assert.throws(() => checkMigrations(f), /symlink/);
    f.git("add", ".");
    f.git("commit", "-qm", "link");
    assert.ok(checkMigrations({ ...f, head: "HEAD" }).violations.length > 0);
  },
);

test("committed symlink mode is rejected on every platform", (t) => {
  const f = fixture(t);
  const blob = f.git(
    "rev-parse",
    "HEAD:mgbos/supabase/migrations/20260101000000_initial.sql",
  );
  f.git(
    "update-index",
    "--add",
    "--cacheinfo",
    `120000,${blob},mgbos/supabase/migrations/link.sql`,
  );
  f.git("commit", "-qm", "synthetic symlink entry");
  assert.ok(checkMigrations({ ...f, head: "HEAD" }).violations.length > 0);
});
