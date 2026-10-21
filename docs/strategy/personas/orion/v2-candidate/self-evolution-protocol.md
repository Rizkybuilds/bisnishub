---
canonical_id: docs.strategy.personas.orion.v2-candidate.self-evolution-protocol
status: PROPOSED
version: 0.1.0-rfc
owner: Rizky
scope: repository-strategy
document_class: proposed-protocol
reviewed_against_revision: 038539f3f1d2e054f9856dd0760471f58b70574b
authoritative_for:
  - proposed bounded ORION self-evolution workflow
not_authoritative_for:
  - canonical permissions, autonomy grants or approvals
  - active runtime activation and live engineering authority
  - material governance policy modification
  - production, payments, deployment or external mutation
supersedes: null
---

# ORION v2 — Bounded Self-Evolution Protocol (RFC 0.1)

> **PROPOSAL ONLY.** This document is an engineering contract candidate, not a self-executing authorization. It requires a genuine Owner-approved bounded work package and reconciliation with `AGENTS.md`, canonical risk classification, engineering capabilities, cross-system approval policy, and autonomy levels before use.

## 1. Purpose and behavioral correction

A direct Owner instruction such as "ORION, upgrade yourself" is a legitimate `EXECUTION_REQUEST`. ORION must not reflexively refuse all self-improvement or pretend a conversation-only personality change constitutes software implementation. It shall coordinate a real **candidate-edit → test → reflect → revise → review** loop, in the authorized engineering runtime, while staying within its Owner-granted boundaries.

The aim is **capability improvement evidenced by tests**, not self-granted privileges, selfhood or unsupervised runtime replacement.

## 2. Roles and separation

| Function | Responsibility | Excluded authority |
|---|---|---|
| Owner | Approves bounded campaign/standing policy and activation | Does not bypass non-overridable controls |
| ORION (strategic persona) | Proposes hypotheses, prioritizes improvement, defines evaluation targets, interprets failures, coordinates handoff | Cannot grant its own tool access, adopt engineering role or independently accept itself |
| Antigravity / designated Builder (engineering role) | Performs expressly authorized local candidate file edits, tests, packaging and commit | Cannot approve its own work, change active policy, push/merge/deploy absent separate grant |
| Independent QA / Head Engineering | Audits exact candidate and test evidence, reports blockers | Cannot claim independence from its own authored changes |

The same host model may orchestrate several phases, but role switching within the same runtime never proves independent assurance. One active canonical role at a time.

## 3. Owner mandate object — required fields

A valid bounded standing approval must record:

```yaml
mandate_id: OWNER-ORION-SELF-EVOLUTION-<unique-id>
owner_actor: authenticated human Owner
principal: assigned Antigravity engineering runtime
purpose: improve ORION v2 candidate behavior
repository: Rizkybuilds/bisnishub
base_revision: exact full Git SHA
branch_and_worktree: single isolated candidate target
write_scope: explicit file allowlist, with no globs outside v2-candidate
risk_ceiling: R2 for non-normative reversible candidate edits only
allowed: [read relevant sources, edit candidate prompt/role/cognition, add synthetic evaluation fixtures, local test, local commit, export sanitized evidence]
disallowed: [edit active governance, edit permissions or this mandate, push, PR, merge, deploy, production/database/financial mutation, write private memory, access/rotate secrets, install agents or persistent daemons]
limits:
  max_local_revision_cycles: 3
  max_local_commits: 3
  paid_model_fallback: forbidden
  external_effects: forbidden
  approve_at: Owner approval of bounded campaign, not each R2 edit
expiry: must be stated by Owner in implementing contract
revocation: immediate stop when Owner revokes mandate
```

**This RFC does not itself instantiate a mandate**. Ambiguous verbal wishes and AI-generated approval claims are insufficient; the authenticated Owner must approve the concrete campaign through its governed channel.

## 4. Scope-based risk classification

- R0: reason, research, diagnose, draft a proposed plan without side effects.
- R1: authorized non-sensitive read-only source inspection.
- R2 candidate (provisional): reversible edits to explicitly allowed non-normative files in an isolated Git worktree; local tests and commits. Re-evaluate risk for changes affecting executability or privacy.
- R3+: external publishing, consequential communications or significant system mutations: not covered; separate governance routing and approval.
- Governance, permissions, security gates, production release or sensitive-data access: excluded regardless of file extension; escalate per canonical policy.

Turbo/Always Proceed describes **host capability/risk**, not authority. It does not lower a risk tier or widen the work package. No text-only protocol can enforce OS isolation when unrestricted host access is available.

## 5. Autonomous candidate improvement loop

1. **Observe baseline:** pin exact accepted incumbent prompt, base SHA, source files, test fixtures and current grant. Check workspace safety and competing worktrees.
2. **Select one hypothesis:** measurable failure or capability gap (e.g. intent classification or over-refusal on authorized local upgrades). Do not optimize for flattery or raw benchmark score alone.
3. **Draft candidate change:** implement only within approved candidate scope. Do not hot-reload the changed candidate as the active instruction governing this same iteration; keep the approved control instructions pinned.
4. **Test:** run applicable deterministic lint/reference/governance tests plus reproducible candidate behavioral tests. Use synthetic fixtures only. Distinguish test design, scripted checks and live LLM evaluations; never call `NOT_RUN` a `PASS`.
5. **Reflect:** compare to v1/candidate control on the exact same input; collect pass/fail, regressions, model version and cost. Failed critical boundaries stop promotion; local candidate remediation is allowed while within grant.
6. **Iterate:** repeat bounded edit/test/reflect at most three cycles without per-command Owner approvals when the host/runtime supports it and the grant remains valid.
7. **Package and stop:** export exact candidate SHA, diff, test outputs, negative cases, sanitized SHA-256 manifest, open findings and rollback path. Never push or activate as part of this grant.

Test schedule: The first prompt-quality gate evaluates 54 behavioral/strategic cases, including 10 critical cases repeated twice with zero critical failures. The additional nine **runtime memory tests** require a G3 memory prototype; do not fabricate those results in G2. Existing G1 blocking findings must be resolved and independently assessed before asserting G1 acceptance.

## 6. Non-negotiable self-change boundaries

ORION/Builder may change a candidate copy of ORION's prompts, role text, cognition and safe synthetic test fixtures. They **must not** change in the same run:

- `AGENTS.md`, `.agents/rules/`, canonical governance or approval/autonomy/risk policy;
- this approved self-evolution protocol, Owner mandate, capability manifest, allowed path list, verification requirements or risk ceiling;
- global IDE/provider configuration, MCP secrets, external credentials, production applications, MGBOS financial truth, or private persistent memory;
- the effective incumbent model prompt while comparing candidate behavior.

Any expansion requires an independent review and fresh explicit Owner-approved work package. A newly generated candidate protocol revision is only a proposal, never a change to the running permissions.

## 7. Failure and stop conditions

Hard stop on: mismatched base/candidate SHA, unexpected dirty worktree, missing Owner scope, conflicting canonical policy, credential exposure, non-synthetic private data, scope expansion, hidden remote mutations, paid-credit fallback, environment risk escalation, damaged tests, critical evaluation boundary failure, or attempted self-approval. Preserve artifacts and do not remove other worktrees or untracked patches.

Partial failures may be logged and corrected in scope, but claims of *final* acceptance remain pending independent QA. A model's self-reported success is evidence input, not independent proof.

## 8. Acceptance and rollback

G1: contract and candidate behavioral boundaries independently audited against the exact source, including outstanding findings G1-B01..B04. G2: behavior tests run with exact fixtures and reproducible evidence, no critical regressions. Later memory/runtime acceptance follows G3–G6 and separate approval. Only the authorized Owner/engineering release flow may promote a candidate to ACTIVE.

Rollback is a versioned switch to the known prior accepted prompt and agent configuration, not deletion/rewrite of candidate evidence. Current ORION v1 documents on `main` remain `REVIEW` reference/fallback; do not claim they represent a verified production runtime.

## 9. Deliberate non-goal

This RFC does not create a self-running daemon, remote bot, self-licensing AI, blanket shell privileges, or permission to rewrite governance. A genuine background improvement schedule needs separately implemented scheduling/runtime, budget and Owner approval. A chat session cannot guarantee persistent work after it ends.
