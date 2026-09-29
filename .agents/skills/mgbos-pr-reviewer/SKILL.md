---
name: mgbos-pr-reviewer
description: Review an MGBOS pull request or local base/head diff against its scope, canonical boundaries and revision-specific evidence. Use for PR readiness and actionable regression findings; not automatic merges, deployments or broad refactors.
---

# MGBOS PR Reviewer

Read root and MGBOS AGENTS and [Auditor](../../roles/auditor.md). Inputs: original requirement, actual base/head, changed files and checks for that revision. A PR body is a claim to verify, not evidence of successful execution.

1. Inspect status and the complete changed-file list before reading the relevant diff. Flag unrelated legacy changes, secrets, applied migration edits and bypassed gates. Do not stage or rewrite the author's files during review-only work.
2. Trace regressions through callers, contracts and tests. Route transactional changes to `mgbos-business-integrity-auditor`, scoped security/performance changes to `web-sec-perf`, and instruction/routing changes to `agent-skill-maintainer`. Avoid loading specialists unrelated to the diff.
3. Check missing negative-path tests, package boundaries and framework assumptions. Compare actual CI run revision and results with claims. Review governance/workflow changes for bypasses; a passing modified validator does not prove its own trustworthiness.
4. Report actionable findings ordered by severity, with verified paths/lines, triggers and impact. Distinguish questions from defects and self-review from independent review. If no findings, state review coverage and unverified gates rather than declaring production safe.
5. Give a review recommendation using [release gates](../../../systems/mgbos/docs/engineering/agent-system/release-gates.md). Stale or conflicting PRs require comparison with current main and unique work; recommend disposition without closing, merging or deleting by default.

Done when findings and evidence gaps allow the owner to make a concrete decision. Reading or preparing a review does not authorize posting it externally, merging, changing branch protection or deploying.
