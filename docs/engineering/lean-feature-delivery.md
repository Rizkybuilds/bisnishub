---
canonical_id: docs.engineering.lean-feature-delivery
status: ACTIVE
version: 1.0
owner: Rizky
scope: repository
document_class: standard
effective_from: 2026-11-11
authoritative_for:
  - default feature-development workflow
  - proportional engineering process
  - direct GitHub implementation and minimal handoffs
  - applicable lightweight verification and reporting
---

# BisnisHub — Lean Feature Delivery (ACTIVE)

**Owner decision (2026-11-11):** Build and ship one usable feature at a time. This is the **default operating procedure for new work** across TeeStock, MultiGraph/MGBOS and other BisnisHub projects. Optimize for working software, solo-founder time and clarity; not document volume or agent orchestration.

This policy **supersedes the procedural/ceremonial requirements** of older Engineering AI Control Plane, Vibe Engineering and agent-workflow documents **for new feature work**. Those documents remain available as reference and for expressly resumed legacy packages. Technical invariants, relevant automated checks, security boundaries and environment permissions remain in force. This does not silently reclassify payment, access-control or production changes as low risk.

## One-feature loop

1. **Request:** Owner names a feature or bug and intended behavior.
2. **Inspect:** Engineer checks current source, affected contracts and branch state. Use only enough context to avoid breaking existing behavior.
3. **Build:** Implement the smallest complete working slice. ChatGPT may act as the direct GitHub writer when connected and authorized; Antigravity, ATLAS, ORION and additional roles are **optional**, never mandatory handoff stages.
4. **Verify:** Run focused relevant checks, assess visible UI/UX, authorization/data boundaries and regressions. Report any test not executed; never call it PASS.
5. **Ship:** Commit with a clear message. Use a PR when branch protection, concurrent work or consequence makes it appropriate. Merge/deploy only with applicable permissions and checks. Return a concise link, outcome, tests and caveats.

## What is no longer required by default

- No mandatory change package (VECP), implementation contract, work package, release packet, continuity checkpoint, role-routing ceremony, independent-agent handoff or post-merge reflection for routine changes.
- No new PRD, ADR, roadmap document, status report or governance revision for a normal small feature. Update user-facing docs, specifications or an ADR **only when the actual change warrants it** (e.g. new architecture decision, API/contract, migration, important operating procedure).
- No mandatory multi-agent planner/auditor/QA sequence. One engineer may build and self-review; never mislabel self-review as independent.
- Do not halt routine work just because a legacy routing profile or work-package ID does not exist.

## Minimal safety bar (never optional)

- Preserve existing work; do not reset, delete, overwrite, or refactor unrelated files.
- Keep authentication/authorization, tenant isolation, validated server-side writes, secret handling and sensitive-data safeguards intact.
- For financial/order state, preserve integer money, auditability, duplicate prevention, consistent transitions and customer-to-order isolation.
- Database changes use versioned migrations and compatible rollout; never alter applied migrations or run destructive/production operations by inference.
- Run suitable tests for changed behavior and negative cases, especially payment, access control, migrations, security and cross-organization data.
- Production deploy, real customer financial changes, destructive database operations and privileged access require separate explicit authorization and verified environment/rollback.
- CI, protected-branch rules and GitHub permissions still apply. Do not bypass or delete safety tests merely to accelerate delivery.

## Effort proportional to risk

**Routine:** layout, copy, accessibility, non-sensitive CRUD with existing authorization patterns, tests and small bug fixes. Brief request + implementation + focused verification + commit/PR.

**Elevated:** identity, permissions/RLS, payment and financial records, migrations, data deletion, shared platform contracts, credentials, security mechanisms, deployment or production operations. Clarify the design and impacts, keep changes isolated, run relevant negative/regression tests, use review/PR where required and request authorization for consequential actions. Extra human or independent review only when genuinely required by risk or existing protection.

## QRIS checkout direction (product decision, not an implemented feature)

Initial commerce should use the **existing merchant QRIS** and **manual owner verification**, not a new automatic payment gateway. An order remains unpaid until an authorized administrator confirms the actual receipt on the merchant side. Uploaded screenshots and matching last-three-digit amounts are **hints, not proof**. Any amount adjustment or unique-code scheme must be evaluated against QRIS provider rules, consumer disclosure, collisions, rounding, expiration and store margin before implementation. Never auto-mark orders paid from the displayed amount alone.

## Completion response

Keep it short: **feature shipped / not shipped**, changed files or PR/commit link, checks passed/not run, blockers and next useful feature. No large ceremonial reports.
