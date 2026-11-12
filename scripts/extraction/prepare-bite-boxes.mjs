#!/usr/bin/env node
// Prepares a standalone, non-production Bite Boxes candidate from tracked Little Treat files.
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const src = "systems/little-treat-kitchen/";
const arg = process.argv[2];
if (!arg || arg.startsWith("-")) throw Error("Usage: node scripts/extraction/prepare-bite-boxes.mjs /absolute/new/output");
const target = path.resolve(arg);
if (target === root || target === path.join(root, src) || target.startsWith(path.join(root, src))) {
  throw Error("Refusing to write within the source directory");
}
if (fs.existsSync(target)) throw Error("Output exists; choose a new path (never delete automatically)");
const tracked = execFileSync("git", ["ls-files", "-z", "--", src], { cwd: root })
  .toString("utf8").split("\0").filter(Boolean);
if (tracked.length < 35) throw Error("Expected at least 35 tracked app files");
const files = [];
for (const sourcePath of tracked) {
  if (!sourcePath.startsWith(src)) throw Error("Unexpected tracked path");
  const relative = sourcePath.slice(src.length);
  if (!relative || relative.startsWith("/") || relative.split("/").includes("..")) throw Error("Unsafe file path");
  const from = path.join(root, sourcePath);
  if (!fs.lstatSync(from).isFile()) throw Error("Refuse non-regular source file: " + sourcePath);
  const to = path.join(target, "apps", "little-treat-kitchen", relative);
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.copyFileSync(from, to);
  const data = fs.readFileSync(to);
  files.push({ path: "apps/little-treat-kitchen/" + relative, bytes: data.length,
    sha256: crypto.createHash("sha256").update(data).digest("hex") });
}
const write = (name, value) => {
  const file = path.join(target, name);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, value, "utf8");
};
const app = path.join(target, "apps", "little-treat-kitchen");
const allowed = ["index.html", "ops.html", "ops.js", "ops.css", "ops-visual.css",
  "ops-config.js", "recipes.js", "menu-costing.js", "icon.svg"];
for (const f of allowed) {
  const from = path.join(app, f);
  if (!fs.existsSync(from)) throw Error("Missing publication asset: " + f);
  if (f === "ops-config.js") continue;
  const to = path.join(target, "static-preview", f);
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.copyFileSync(from, to);
}
write("static-preview/.nojekyll", "");
write("static-preview/ops-config.js", [
  "// Preview is deliberately disabled: do not connect to the production database.",
  'window.LT_OPS_CONFIG={url:"https://example.invalid",publishableKey:"sb_publishable_STAGING_NOT_CONFIGURED"};'
].join("\n") + "\n");
const staticFiles = fs.readdirSync(path.join(target, "static-preview")).sort();
const expected = [".nojekyll", ...allowed].sort();
if (JSON.stringify(staticFiles) !== JSON.stringify(expected)) throw Error("Static preview allowlist mismatch");
const previewConfig = fs.readFileSync(path.join(target, "static-preview/ops-config.js"), "utf8");
const sourceConfig = fs.readFileSync(path.join(app, "ops-config.js"), "utf8");
if (sourceConfig === previewConfig || /ujmojkgipvckwdegcoph/.test(previewConfig)) {
  throw Error("Staging preview must not target the production Supabase project");
}
write("README.md", [
  "# Bite Boxes - repository extraction preview",
  "",
  "This is a NON-PRODUCTION portable code export, not a new GitHub repository or hosting deployment.",
  "The first app is apps/little-treat-kitchen. The copied app includes tracked tests and SQL reference scripts.",
  "static-preview contains an allowlisted set of public assets and a deliberately invalid Supabase configuration.",
  "Node 22: run npm test. Do not run included SQL files against a live database.",
  "Until separately approved cutover, live source and publication remain in Rizkybuilds/bisnishub.",
  "Business and brand documentation remains in BisnisHub until canonical ownership is reconciled.",
  "See docs/MIGRATION.md before pushing to a new repository."
].join("\n") + "\n");
write("AGENTS.md", [
  "# Bite Boxes contributor and AI guidance",
  "Inspect, implement one feature, test, then report. Keep review proportional to risk.",
  "Do not touch production Supabase, alter RLS, move secrets, or switch URLs without separate authorization.",
  "Protect owner/staff permissions, order idempotency, stock and financial data integrity.",
  "Preview config is intentionally invalid. Do not report working login or production readiness from static tests.",
  "Keep BisnisHub publication intact until separately tested, approved cutover."
].join("\n") + "\n");
write("docs/MIGRATION.md", [
  "# Bite Boxes extraction acceptance",
  "",
  "SOURCE: Rizkybuilds/bisnishub, systems/little-treat-kitchen on a recorded Git revision.",
  "The original Little Treat Supabase project stays separate from MGBOS; do not reset or migrate production data.",
  "",
  "1. Verify export-manifest.json and source revision; import with agreed repo visibility and access.",
  "2. Preserve useful historical Git provenance via a separate reviewed disposable-clone/path-filter process.",
  "3. Run npm test and independently verify branch CI in the target repository.",
  "4. Provision a separate staging database and test users; validate browser, owner/staff, mobile, and financial workflows.",
  "5. Confirm proper static release allowlist, auth origin configuration and rollback.",
  "6. Obtain explicit approval before changing public URLs or disabling BisnisHub deployment.",
  "",
  "No file archive preserves Git history by itself. Preserve old PR links and source history in BisnisHub.",
  "The source app contains a public browser publishable key; the preview asset intentionally does not use it.",
  "Do not duplicate business truth: Food Ventures documentation stays canonically owned by BisnisHub until migrated."
].join("\n") + "\n");
write("package.json", JSON.stringify({
  name: "bite-boxes-source-preview", private: true, version: "0.0.0",
  engines: { node: ">=22 <23" },
  scripts: { test: "node --test apps/little-treat-kitchen/*.test.cjs" }
}, null, 2) + "\n");
write(".gitignore", ["node_modules/", ".env", ".env.*", "!.env.example", ".vercel/",
  "coverage/", "dist/", "*.log", ".tmp/", "tmp/"].join("\n") + "\n");
write(".github/workflows/ci.yml", [
  "name: Bite Boxes Kitchen Tests",
  "on:",
  "  pull_request:",
  "  push:",
  "    branches: [main]",
  "  workflow_dispatch:",
  "permissions:",
  "  contents: read",
  "jobs:",
  "  kitchen-tests:",
  "    runs-on: ubuntu-24.04",
  "    steps:",
  "      - uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683 # v4.2.2",
  "        with:",
  "          persist-credentials: false",
  "      - uses: actions/setup-node@49933ea5288caeca8642d1e84afbd3f7d6820020 # v4.4.0",
  "        with:",
  "          node-version: '22'",
  "      - run: npm test"
].join("\n") + "\n");
const sha = execFileSync("git", ["rev-parse", "HEAD"], { cwd: root }).toString("utf8").trim();
write("export-manifest.json", JSON.stringify({
  purpose: "non-production-preview", sourceRepository: "Rizkybuilds/bisnishub",
  sourceRevision: sha, sourcePath: src, destinationPath: "apps/little-treat-kitchen/",
  fileCount: files.length, files, staticPreviewAllowlist: expected
}, null, 2) + "\n");
console.log(JSON.stringify({ target, sourceRevision: sha, files: files.length, previewAssets: staticFiles.length }));
