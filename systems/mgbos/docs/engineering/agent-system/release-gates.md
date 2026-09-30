# Release gates and CI

This setup adds checks; it does not deploy, change GitHub branch protection or prove operational readiness. Follow the existing [release/recovery runbook](../../runbooks/release-and-recovery.md) and [readiness register](../operational-readiness.md).

| Gate                | Evidence                                                                            | Blocking condition                                                                            |
| ------------------- | ----------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| Scope and integrity | Authorized diff, risk class, canonical contracts                                    | Unrelated changes, unresolved money/access/history defect                                     |
| Agent governance    | New workflow `Agent Governance / agent-governance`                                  | Invalid contracts, skills, references or eval baseline; guard regression failure              |
| Migration history   | `Agent Governance / migration-immutability`                                         | Existing base migration altered, removed, renamed or type-changed; missing comparison history |
| Application         | Existing `MGBOS Foundation / application`                                           | Applicable check, build or production HTTP smoke fails                                        |
| Database            | Existing `MGBOS Foundation / database` plus relevant upgrade/command tests          | Applicable replay, pgTAP, generated-type or transaction check fails                           |
| Review and evidence | Exact revision review, findings resolved, current hosted runs                       | Stale revision, missing evidence, unsupported independent-review claim                        |
| Operations          | Verified target isolation, staging, backup/restore, monitoring owner, recovery plan | Any required operational evidence missing                                                     |
| Execution authority | Explicit scope for concrete action                                                  | No authorization or action prohibited by workspace policy                                     |

For local instruction-only changes, validate instructions and guards; do not reset a database or claim application acceptance. Hosted Foundation checks remain unchanged and continue to run under their existing triggers. Verify actual GitHub check context names on a real run before configuring required checks; YAML alone does not enforce merging policy.

## Local checks from repository root

```sh
python -m pip install -r scripts/governance/requirements.txt
python scripts/governance/validate-agent-governance.py
python -m unittest discover -s scripts/governance -p 'test_*.py'
node --test scripts/governance/migration-immutability.test.mjs
node scripts/governance/check-migration-immutability.mjs --base origin/main
```

The migration guard protects every file already present under `systems/mgbos/supabase/migrations/` at the base commit, including metadata/mode changes. This conservative policy does not guess which migrations were deployed. Additive migrations are allowed; semantic SQL safety remains a database/review gate. Local default compares base to the Git index and working tree (including untracked migrations); CI supplies an explicit head commit.

Pull requests compare the actual base SHA with head SHA, not only a merge-base that could miss a concurrent migration edit. Pushes compare event `before` with `after`; dispatch compares HEAD with its first parent and is not a replacement for PR review. Checkout fetches full history. Missing or all-zero base fails closed. Never use `pull_request_target` to run untrusted change code with elevated credentials.

Changing a guard or workflow requires human review of its diff and negative tests; these scripts cannot defend against their own malicious replacement. Require reviews/branch protection in GitHub as a separately authorized configuration task. No bypass flag or retroactive rewrite exemption is supplied.

## Pull request preflight and gate criteria

Before opening or updating an MGBOS PR, agents must ensure:

1. **PR Title Format:** Must follow Conventional Commits format (`type(scope): description`), e.g., `fix(mgbos): harden Phase 1 operating spine`.
2. **PR Body:** Must not be empty.
3. **Scope Isolation:** MGBOS runtime changes must remain strictly system-scoped (`systems/mgbos/**`). Do not mix cross-system documentation, roadmaps, or other systems into an MGBOS runtime PR.
4. **Local Preflight Commands:**
   ```sh
   # Scope isolation and PR gate verification (from repository root):
   node --test scripts/governance/pr-scope.test.mjs
   node scripts/governance/check-pr-scope.mjs <base-sha> <head-sha>

   # Application verification (from systems/mgbos):
   pnpm check
   ```
