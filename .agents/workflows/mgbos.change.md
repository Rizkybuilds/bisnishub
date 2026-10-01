---
description: Execute a governed MGBOS engineering change through the BisnisHub Engineering AI Control Plane.
---

# MGBOS Governed Change

Execute an MGBOS engineering change through the BisnisHub Engineering AI Control Plane.

Treat the text supplied with this workflow invocation as the requested engineering objective.

Do not interpret this workflow as deployment, production-database, merge, or external-action authorization.

---

## Phase 1 — Establish repository truth

Before editing:

1. Inspect repository status, branch, current revision, and dirty files.
2. Preserve unrelated work.
3. Confirm the target is the official MGBOS workspace:
   `systems/mgbos/`.
4. Read:
   - `AGENTS.md`
   - `systems/mgbos/AGENTS.md`
   - `docs/engineering/engineering-ai-control-plane.md`
   - `docs/engineering/runtime-adapter-architecture.md`
   - `systems/mgbos/docs/engineering/agent-system/workflow.md`
5. Read only additional canonical sources required by the actual task.

If target workspace is ambiguous, stop the affected flow with:

`REQUIRED_SOURCE_MISSING`

or another appropriate routing failure.

---

## Phase 2 — Classify the work

Use:

`.agents/routing/task-types.yaml`

Determine:

- routing profile;
- primary task type;
- all material concerns;
- effective risk;
- required roles;
- required Expertise;
- candidate Skills;
- assurance requirements;
- stop conditions.

The effective risk must be at least the highest applicable task, concern, capability, environment, or policy floor.

Never classify downward merely to simplify execution.

---

## Phase 3 — Load specialist knowledge

Use:

`.agents/expertise/registry.yaml`

Load the minimum sufficient set of required ACTIVE Expertise.

Expertise does not grant authority.

Then select only the Skills required by the actual execution layer.

Read each selected `SKILL.md` before applying it.

Do not load all Skills.

---

## Phase 4 — Planner pass

Activate role:

`planner`

Read:

`.agents/roles/planner.md`

For material work, establish an Implementation Contract conforming to:

`.agents/contracts/implementation-contract.schema.json`

It must identify at least:

- objective;
- base revision;
- workspace;
- allowed scope;
- exclusions;
- canonical sources;
- task type;
- concerns;
- effective risk;
- required roles;
- required Expertise;
- invariants;
- acceptance criteria;
- planned verification;
- stop conditions.

Do not claim implementation exists.

For small routine work where repository policy permits a compact process, record equivalent bounded scope and acceptance criteria without unnecessary ceremony.

---

## Phase 5 — Work Package

Before material implementation, establish one Work Package conforming to:

`.agents/contracts/work-package.schema.json`

The Work Package must identify:

- implementation contract;
- Engineer writer;
- base revision;
- branch;
- worktree;
- allowed paths;
- forbidden paths;
- required Expertise;
- selected Skills;
- acceptance criteria;
- required checks;
- stop conditions.

Enforce:

ONE WRITER = ONE BRANCH = ONE WORKTREE = ONE BOUNDED SCOPE.

Do not allow concurrent writers to edit overlapping mutable scope.

---

## Phase 6 — Engineer pass

Activate role:

`engineer`

Read:

`.agents/roles/engineer.md`

Implement only the accepted Work Package.

Before every material scope expansion, stop and update planning instead of silently continuing.

Preserve:

- authenticated command boundaries;
- authorization;
- organization isolation;
- integer money;
- independent lifecycle state machines;
- immutable history;
- migration immutability;
- idempotency;
- transactional integrity;
- canonical MGBOS authority.

Do not bypass MGBOS through UI, AI, n8n, direct unrestricted database mutation, or service credentials.

---

## Phase 7 — Engineer verification

Run focused checks required by:

- Work Package;
- routing concerns;
- target system instructions;
- affected canonical invariants.

Use the correct environment.

Do not use production as test infrastructure.

Record exact commands or procedures and actual outcomes.

Valid outcomes include:

- PASS
- FAIL
- BLOCKED
- NOT_RUN

Do not convert missing environment into PASS.

---

## Phase 8 — Engineering Report

Produce an Engineering Report conforming to:

`.agents/contracts/engineering-report.schema.json`

Record:

- exact revision or dirty fingerprint;
- actual files changed;
- implementation summary;
- decisions;
- invariants preserved;
- scope drift;
- checks run;
- checks not run;
- failures;
- limitations;
- residual risk;
- allowed next action.

The Engineering Report describes actual work.

It does not retroactively rewrite the Implementation Contract.

---

## Phase 9 — Audit pass

If routing requires audit, activate:

`auditor`

Read:

`.agents/roles/auditor.md`

Review the exact implementation revision and raw evidence.

Do not rely only on the Engineer summary.

For relevant transaction/business-integrity changes, load:

`mgbos-business-integrity-auditor`

For PR/diff review, load:

`mgbos-pr-reviewer`

Default Auditor behavior is read-only review.

Do not silently fix implementation while claiming to remain Auditor.

---

## Phase 10 — Assurance independence

Determine factual review independence.

If this same Antigravity execution implemented the code and now reviews it:

`independence = SELF_REVIEW`

If routing requires:

`INDEPENDENT_REQUIRED`

self-review may still identify defects but does not satisfy the gate.

Record the unresolved requirement.

Do not fabricate a second identity or agent label to claim independence.

---

## Phase 11 — Assurance Report

Produce an Assurance Report conforming to:

`.agents/contracts/assurance-report.schema.json`

Bind it to the exact reviewed revision.

Record:

- reviewer;
- independence;
- risk;
- review coverage;
- findings;
- unverified areas;
- residual risk;
- assurance status;
- allowed next action.

Any later implementation change invalidates affected assurance.

---

## Phase 12 — QA pass

If required, activate:

`qa`

Read:

`.agents/roles/qa.md`

Verify the exact candidate revision against acceptance criteria.

Use:

`.agents/contracts/verification-matrix.schema.json`

Test relevant:

- normal paths;
- denied paths;
- cross-organization paths;
- illegal states;
- money boundaries;
- duplicate execution;
- retry;
- concurrency;
- atomicity;
- migration upgrade/replay;
- external failure;
- recovery;

as applicable to the resolved route.

Do not run unrelated destructive checks merely to increase test count.

---

## Phase 13 — Verification Matrix

Produce a Verification Matrix.

Each verification case must reference one or more acceptance criteria.

Overall PASS requires all required represented cases to actually PASS and no required gate to remain unverified.

Never convert:

`BLOCKED`

or:

`NOT_RUN`

into PASS.

---

## Phase 14 — Fix loop

If Auditor or QA finds a blocker:

1. Switch explicitly back to Engineer role.
2. Apply only authorized corrections.
3. Generate a new implementation revision.
4. Update Engineering Report evidence.
5. Re-run affected QA.
6. Re-run affected assurance.

Previous revision-bound evidence does not certify changed code.

---

## Phase 15 — Release preparation

Do not enter this phase unless release preparation is actually part of the requested work.

Activate:

`release-operator`

Read:

`.agents/roles/release-operator.md`

and:

`systems/mgbos/docs/engineering/agent-system/release-gates.md`

Prepare a Release Packet conforming to:

`.agents/contracts/release-packet.schema.json`

using:

- clean candidate revision;
- applicable Assurance Report;
- Verification Matrix;
- current CI;
- target identity;
- recovery evidence;
- explicit blockers.

---

## Phase 16 — Release boundary

A Release Packet recommendation of:

`READY_FOR_AUTHORIZED_RELEASE`

means readiness evidence is satisfied.

It does not itself authorize:

- merge;
- deployment;
- branch deletion;
- production database mutation;
- customer/vendor communication.

Respect repository permissions and explicit action authority.

MGBOS remote/production database prohibitions remain in force.

---

## Phase 17 — Final response

Summarize:

- active role(s) actually performed;
- runtime/provider identity;
- task type;
- concerns;
- effective risk;
- exact revision;
- files changed;
- checks actually run;
- checks not run;
- audit status;
- QA status;
- independence status;
- blockers;
- artifacts produced;
- allowed next action.

Do not claim stages that did not occur.

---

## Mandatory stop behavior

Do not silently continue the affected flow when any of these materially apply:

- CANONICAL_CONFLICT
- UNKNOWN_HIGH_RISK
- SCOPE_EXPANSION_REQUIRED
- REQUIRED_SOURCE_MISSING
- PERMISSION_UNCLEAR
- ENVIRONMENT_UNVERIFIED
- FINANCIAL_INVARIANT_AMBIGUOUS
- REQUIRED_EVIDENCE_UNAVAILABLE
- SECURITY_BOUNDARY_UNCLEAR
- UNRELATED_WORK_COLLISION

A truthful BLOCKED result is preferable to invented completion.
