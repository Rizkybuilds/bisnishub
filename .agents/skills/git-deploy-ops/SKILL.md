---
name: git-deploy-ops
description: >-
  Menyiapkan dan memverifikasi Git, PR, rilis aplikasi, Edge Functions, dan
  migrasi sesuai target legacy atau MGBOS. Gunakan untuk pekerjaan rilis dan
  deployment yang diminta, dengan batas database lokal MGBOS tetap berlaku.
argument-hint: "[deploy, migrate, or release]"
---

# Git, Release & Migration Operations

Prepare and verify a release for the explicitly selected application and environment. Do not infer a deployment request from an implementation, review or Skill-maintenance request.

## Identify the target

- Inspect Git status, current branch/remotes, package scripts, deployment files and applicable `AGENTS.md`. Preserve unrelated tracked and untracked work.
- **Legacy storefront:** `bisnis/teestock/web`; **legacy admin:** `apps/bisnishub-web`. Verify live project linkage and build root before deployment; saved domain names and historical CLI examples are not current target evidence.
- **MGBOS:** `mgbos/`, with its own pnpm workspace and local Supabase. Root `dev:mgbos`/`build:mgbos` currently target the Vite prototype `apps/mgbos/`; inspect scripts rather than using their labels as workspace identity.
- Root `supabase` links to legacy TeeStock. MGBOS commands must never traverse it. MGBOS instructions forbid remote resets, production schema changes, production seeding and hard-delete of history.

## Prepare a reviewable change

Use an isolated branch/worktree when needed. Default new branch names to `codex/` unless the user specifies otherwise. Stage only explicit files in scope, inspect the staged diff and preserve existing staged work. Do not use blanket staging or push to main as a default recipe.

Use the selected workspace's dependency manager and lockfile. Read CI definitions and required checks; report local and hosted results separately. A local build does not certify the database or deployment.

For MGBOS application changes, follow its `pnpm check`, production smoke and applicable local database gates. For legacy changes, use the inspected app scripts and affected shared consumers. Instruction-only maintenance uses focused document/Skill validation.

Before a requested release, prepare the exact artifact, target, validation evidence and recovery path. Existing user authorization persists; ask only when a required target/approval remains genuinely missing, after the result is concrete and reviewable.

## Deploy and verify within authorized scope

Confirm the selected project, environment, branch/commit and configuration names without exposing secret values. Do not assume Vite configuration applies to Next.js or that a browser-visible PIN establishes server authorization.

Deploy the scoped component through its verified project workflow. Verify deployed identity, health, relevant user flow and logs. Distinguish an editor upload, a build, an accepted deployment and a working endpoint. If creating a PR, attach it to the task using the available app tool.

## Database and Edge Functions

For MGBOS, use only its local scripts with the actual runbook and migrations. Reset is for authorized local reproducibility or an explicit reset request, never a generic release step.

For separately authorized legacy production SQL, confirm the exact project and migration history, create and restore-test a structural/data snapshot, apply the reviewed migration, then validate preserved rows, RPC behavior, authorization and relevant transaction flows. Use new migrations; do not edit applied history or choose a SQL directory solely from an old example.

Deploy an Edge Function only to the verified project within the requested scope; then check endpoint and logs. Do not batch unrelated function releases.

## Recovery and completion

Choose a known compatible application artifact for rollback and consider schema compatibility. Prefer forward repair migrations for data changes. Do not provide destructive DROP statements as a universal database rollback strategy, and do not restore over newer transactions without an explicit recovery plan.

Report changed/released components, revision, checks actually run, target, deployment verification and unresolved failures. If work ends at preparation or a blocked gate, say so explicitly.
