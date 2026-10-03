---
canonical_id: docs.engineering.vibe-engineering.implementation-contract-template
status: ACTIVE
version: 1.1.1
owner: Rizky
author: OpenAI / ChatGPT
approver: Rizky
scope: repository-engineering
document_class: standard
effective_from: 2026-10-03

authoritative_for:
  - vibe engineering implementation-contract authoring procedure
  - vibe engineering work-package authoring procedure
  - vibe engineering schema-aware contract preparation
  - vibe engineering planning-to-builder handoff
  - vibe engineering semantic contract validation
  - vibe engineering implementation baseline discipline
  - vibe engineering builder startup requirements
  - vibe engineering implementation stop behavior

last_reviewed: 2026-10-03
reviewed_against_revision: 26871da802706fba5bc033576fbb0a487f6c9255
review_cadence: quarterly

depends_on:
  - ./README.md
  - ./state-and-vocabulary.md
  - ./operating-model.md
  - ./session-protocol.md
  - ./change-package-template.md
  - ../../governance/documentation-constitution.md
  - ../../governance/canonical-source-map.md
  - ../../governance/cross-system-risk-classification.md
  - ../../governance/evidence-provenance-model.md
  - ../../governance/approval-policy.md
  - ../engineering-ai-control-plane.md
  - ../../../.agents/contracts/README.md
  - ../../../.agents/contracts/implementation-contract.schema.json
  - ../../../.agents/contracts/work-package.schema.json
  - ../../../.agents/routing/README.md
  - ../../../.agents/routing/task-types.yaml
  - ../../../.agents/expertise/registry.yaml
  - ../../../.agents/capabilities/README.md
  - ../../../.agents/roles/contracts.json
  - ../../../AGENTS.md

supersedes: null
---

# Vibe Engineering Implementation Contract & Work Package Authoring Standard

## 1. Purpose

This document explains how Vibe Engineering prepares the canonical:

```text
Implementation Contract
```

and:

```text
Work Package
```

used by the BisnisHub Engineering AI Control Plane.

The goal is to transform an accepted engineering objective into machine-valid, semantically correct, bounded implementation work.

Canonical flow:

```text
OWNER INTENT
    ↓
VIBE CHANGE PACKAGE
    ↓
CANONICAL ROUTING
    ↓
IMPLEMENTATION CONTRACT
    ↓
WORK PACKAGE
    ↓
ENGINEER / BUILDER
```

The schemas remain authoritative.

This document explains how to use them safely.

---

# 2. Canonical Schema Authority

The canonical schemas are:

```text
.agents/contracts/implementation-contract.schema.json
.agents/contracts/work-package.schema.json
```

If this document conflicts with those schemas:

```text
SCHEMA
WINS
```

for structural validity.

If a schema-valid artifact conflicts with canonical routing, risk, authority, or system semantics:

```text
CANONICAL SEMANTIC OWNER
WINS
```

Therefore:

```text
SCHEMA VALID
≠
SEMANTICALLY VALID
```

---

# 3. Contracts Are Not Authority Grants

An Implementation Contract saying:

```text
READY_FOR_IMPLEMENTATION
```

does not grant:

```text
remote repository mutation
merge
deployment
production access
database mutation
business action
payment
customer communication
```

The contract defines engineering intent and boundaries.

Permission and approval remain independently governed.

---

# 4. Contracts Are Not Vibe Change Packages

Preserve:

```text
VECP
=
human coordination envelope
```

and:

```text
Implementation Contract
=
canonical intended engineering work
```

and:

```text
Work Package
=
one bounded executable writer slice
```

Do not combine the three into one oversized artifact.

---

# 5. Required Preparation Before Contract Authoring

Before creating an Implementation Contract, the Planner SHOULD have resolved:

```text
repository
target system
workspace
planning baseline
canonical sources
current state
target state
dependency closure
routing profile
task type
concerns
effective risk
required roles
required expertise
assurance requirement
scope
acceptance criteria
planned checks
stop conditions
```

If those prerequisites are materially unresolved:

```text
DO NOT
emit READY_FOR_IMPLEMENTATION
```

---

# 6. Active Role

Implementation Contract is produced under the canonical:

```text
planner
```

role.

The schema enforces:

```json
"created_by": {
  "role": "planner"
}
```

The Vibe `HEAD_FUNCTION` may perform the planning work, but the formal active role remains:

```text
planner
```

---

# 7. Runtime / Provider Identity

The Implementation Contract may record:

```text
identity
runtime
provider
```

These fields describe who/what created the artifact.

They do not grant authority.

Example:

```json
{
  "role": "planner",
  "identity": "head-engineering-session",
  "runtime": "ChatGPT",
  "provider": "OpenAI"
}
```

Provider identity MUST NOT alter contract semantics.

---

# 8. One Active Role

Contract creation occurs under:

```text
planner
```

Work Package execution occurs under:

```text
engineer
```

Do not model one execution as:

```text
planner + engineer + auditor + qa
```

simultaneously.

Role transitions require handoff.

---

# 9. Routing Must Exist Before Implementation Contract

Before a Vibe-generated implementation contract becomes implementation-ready:

```text
TARGET SYSTEM
    ↓
MATCHING ACTIVE ROUTING PROFILE
    ↓
RESOLVED ROUTE
    ↓
IMPLEMENTATION CONTRACT
```

If no active matching profile exists:

```text
VE_STOP.ROUTING_PROFILE_UNAVAILABLE
```

Do not fabricate the route.

---

# 10. Never Borrow Another System's Profile

Forbidden:

```text
target_system
repository-engineering

routing.profile
mgbos
```

when canonical routing only binds:

```text
mgbos
→ systems/mgbos/
```

Likewise:

```text
target_system
jarvis

routing.profile
mgbos
```

is invalid unless canonical routing explicitly says so.

A non-empty schema string is not semantic routing proof.

---

# 11. Unsupported Target Behavior

If the target system has no active routing profile:

```text
DO NOT
create a misleading READY_FOR_IMPLEMENTATION contract
```

Instead keep planning at the Vibe Change Package or applicable bootstrap-governance level.

Correct:

```text
VE_OBJECTIVE.BLOCKED

STOP_REASON
VE_STOP.ROUTING_PROFILE_UNAVAILABLE
```

until a valid route exists.

---

# 12. Bootstrap Governance

A missing routing profile may itself require a repository-governance change.

That change must be performed through existing ACTIVE governance.

Do not pretend the future profile already exists in order to create itself.

Canonical bootstrap principle:

```text
CURRENT GOVERNANCE
creates
FUTURE ROUTING CAPABILITY
```

not:

```text
FUTURE ROUTING CAPABILITY
pretends to authorize itself
```

---

# 13. Implementation Contract Required Fields

Current schema requires:

```text
schema_version
artifact_type
artifact_id
state
created_at
created_by
repository
workspace
target_system
base_revision
objective
scope
routing
risk
canonical_sources
invariants
acceptance_criteria
planned_checks
stop_conditions
work_package_ids
```

Optional schema fields include:

```text
supersedes
dependencies
decision_required
notes
```

Do not add arbitrary top-level fields.

The schema uses:

```text
additionalProperties: false
```

---

# 14. `schema_version`

Current required value:

```json
"schema_version": 1
```

Do not invent:

```json
"schema_version": "1.1.1"
```

The document version and contract-schema version are separate concepts.

---

# 15. `artifact_type`

Implementation Contract requires:

```json
"artifact_type": "IMPLEMENTATION_CONTRACT"
```

Exact spelling matters.

---

# 16. `artifact_id`

Pattern:

```text
IC-<semantic-id>
```

Schema pattern:

```text
^IC-[A-Za-z0-9][A-Za-z0-9._-]*$
```

Good:

```text
IC-mgbos-payment-allocation-v2
```

Bad:

```text
IC 27
```

---

# 17. Implementation Contract State

Current allowed states:

```text
PLANNED
READY_FOR_IMPLEMENTATION
BLOCKED
SUPERSEDED
CANCELLED
```

Do not add:

```text
IN_PROGRESS
COMPLETED
READY_TO_MERGE
LOCAL_PASS
```

Those are not valid Implementation Contract states.

---

# 18. `PLANNED`

Use when:

> The contract exists as structured planning but is not yet ready for implementation.

Possible reasons:

- acceptance still being refined;
- dependency unresolved;
- Owner decision pending;
- Work Package not yet ready.

Do not use `PLANNED` to hide a known hard blocker when `BLOCKED` is more truthful.

---

# 19. `READY_FOR_IMPLEMENTATION`

Use only when the contract is:

```text
structurally valid
+
semantically valid
+
properly routed
+
risk-resolved
+
bounded
+
implementation-ready
```

It does not grant execution authority by itself.

---

# 20. `BLOCKED`

Use when material contract conditions prevent safe implementation.

Examples:

```text
required source missing
dependency unresolved
Owner decision unresolved
routing unavailable
permission boundary unclear
```

The reason should be captured in:

```text
stop_conditions
decision_required
notes
```

as applicable.

---

# 21. `SUPERSEDED`

Use when a replacement Implementation Contract takes authority for the intended work.

Preserve:

```text
supersedes
```

lineage where applicable.

Do not silently overwrite completed/historical contract meaning.

---

# 22. `CANCELLED`

Use when the planned change is intentionally abandoned before implementation authority is exercised.

Cancellation is not implementation failure.

---

# 23. `created_at`

Must be an ISO date-time string.

Example:

```json
"created_at": "2026-10-03T03:00:00Z"
```

Use actual artifact creation time.

Do not copy example timestamps into real artifacts.

---

# 24. `created_by`

Required:

```text
role
identity
```

Optional:

```text
runtime
provider
```

Role is schema-fixed to:

```text
planner
```

---

# 25. `repository`

Use canonical repository identity.

Example:

```json
"repository": "Rizkybuilds/bisnishub"
```

Do not use only a local folder name if the repository identity is known.

---

# 26. `workspace`

`workspace` identifies the relevant repository workspace/root.

Example for MGBOS:

```json
"workspace": "systems/mgbos/"
```

Repository-level workspace may be:

```json
"workspace": "."
```

but workspace and routing profile must remain semantically compatible.

---

# 27. `target_system`

Identify the semantic system being changed.

Example:

```json
"target_system": "mgbos"
```

Do not use:

```text
repository-engineering
```

with:

```text
mgbos
```

profile merely to satisfy schema.

---

# 28. Target / Workspace / Profile Compatibility

Semantic validation MUST check:

```text
target_system
+
workspace
+
routing.profile
```

Example valid:

```text
target_system = mgbos
workspace = systems/mgbos/
routing.profile = mgbos
```

Example invalid:

```text
target_system = repository-engineering
workspace = .
routing.profile = mgbos
```

even though every field is syntactically valid.

---

# 29. Implementation Contract — `base_revision`

Schema form:

```json
"base_revision": {
  "sha": "<revision>",
  "branch": "main"
}
```

Required:

```text
sha
```

Optional:

```text
branch
```

Use the exact implementation baseline.

---

# 30. Baseline Must Be Fresh Enough

Before implementation begins, compare:

```text
contract base_revision
```

against actual execution workspace.

If materially stale:

```text
VE_STOP.STALE_BASELINE
```

Do not let Builder silently reinterpret the contract against a different repository state.

---

# 31. `supersedes`

Optional.

Use only when this contract replaces another contract.

Example:

```json
"supersedes": "IC-mgbos-payment-allocation-v1"
```

Do not use it for unrelated predecessor roadmap packages.

---

# 32. `objective`

The objective must be a bounded engineering outcome.

Good:

```text
Prevent duplicate payment allocation under concurrent retries while preserving existing authorization rules.
```

Weak:

```text
Improve payments.
```

The objective should not contain multiple unrelated projects.

---

# 33. `scope`

Implementation Contract scope requires:

```text
allowed_paths
excluded_paths
explicit_non_goals
```

All three are required by current schema.

---

# 34. `scope.allowed_paths`

Define paths implementation may change.

Good:

```json
"allowed_paths": [
  "systems/mgbos/src/payments/**",
  "systems/mgbos/tests/payments/**"
]
```

The scope should be broad enough to implement correctly but narrow enough to detect drift.

---

# 35. `scope.excluded_paths`

Explicitly protect areas not allowed to change.

Example:

```json
"excluded_paths": [
  ".github/workflows/**",
  ".agents/**",
  "systems/jarvis/**"
]
```

Do not assume exclusions are obvious.

---

# 36. `scope.explicit_non_goals`

State semantic exclusions.

Example:

```json
"explicit_non_goals": [
  "Do not change payment authorization policy.",
  "Do not introduce production deployment.",
  "Do not modify JARVIS runtime."
]
```

Paths alone do not express all non-goals.

---

# 37. Scope Expansion

If correct implementation requires paths outside allowed scope:

```text
STOP
```

Use:

```text
SCOPE_EXPANSION_REQUIRED
```

or applicable upstream condition.

Do not let Builder expand scope silently.

---

# 38. `routing`

Required routing fields:

```text
profile
primary_task_type
concerns
roles
required_expertise
```

Optional:

```text
skill_candidates
```

These values must come from canonical routing.

Do not invent plausible-sounding values.

---

# 39. `routing.profile`

Use an active matching routing profile.

At the reviewed baseline:

```text
mgbos
```

is the active profile for:

```text
systems/mgbos/
```

This observation may change later.

Always consult current routing registry.

---

# 40. `routing.primary_task_type`

Use a registered task type.

Example currently present in routing documentation:

```text
backend-command-change
```

Do not type:

```text
general-coding
```

unless actually registered.

---

# 41. `routing.concerns`

Use registered concerns only.

Example from current routing documentation:

```text
financial-truth
authorization
concurrency-idempotency
```

Concerns affect routing composition.

They are not informal tags.

---

# 42. `routing.roles`

Preserve canonical required roles.

Example:

```json
"roles": [
  "planner",
  "engineer",
  "auditor",
  "qa"
]
```

This is a workflow requirement list.

It does not mean all roles are simultaneously active.

---

# 43. `routing.required_expertise`

Use registered expertise IDs.

Schema pattern:

```text
EXP-###
```

Example:

```json
"required_expertise": [
  "EXP-002",
  "EXP-003",
  "EXP-005",
  "EXP-006",
  "EXP-007",
  "EXP-011"
]
```

The selected IDs must match current registry and actual route.

---

# 44. `routing.skill_candidates`

Optional.

Use actual Skill identifiers.

Skill candidate means:

```text
possible reusable procedure
```

not:

```text
required authority
```

---

# 45. `risk`

Required fields:

```text
effective_level
reasons
```

Optional:

```text
affected_capabilities
```

Risk meanings remain owned by the cross-system risk policy.

---

# 46. `risk.effective_level`

Allowed:

```text
R0
R1
R2
R3
R4
R5
```

Do not create local values.

The contract must preserve resolved effective risk.

---

# 47. `risk.reasons`

Explain why the risk applies.

Example:

```json
"reasons": [
  "The change affects financial truth.",
  "Authorization behavior is involved.",
  "Concurrent duplicate execution could corrupt payment allocation."
]
```

Reasons should explain the route.

They should not override canonical risk.

---

# 48. `risk.affected_capabilities`

Optional.

Use when actual engineering capability impact is known.

Do not invent capability identifiers.

If not relevant or not resolved:

omit the field.

---

# 49. No Silent Risk Downgrade

Builder MUST NOT decide:

```text
This is only three lines, so R5 becomes R2.
```

Risk belongs to consequence.

If new information suggests higher risk:

```text
stop
re-route
amend contract
```

---

# 50. `canonical_sources`

At least one canonical source is required.

List only sources that actually govern the change.

Example:

```json
"canonical_sources": [
  "systems/mgbos/docs/architecture/business-invariants.md",
  "docs/governance/cross-system-risk-classification.md",
  ".agents/contracts/README.md"
]
```

Do not include historical notes as canonical sources.

---

# 51. Canonical Source Availability

Before implementation:

```text
required canonical sources
must be available
```

If not:

```text
REQUIRED_SOURCE_MISSING
```

or applicable stop condition.

Do not substitute implementation reports for missing canonical specification.

---

# 52. `invariants`

List properties that must remain true.

Example:

```json
"invariants": [
  "Payment allocation must remain organization-scoped.",
  "Authorization must be enforced server-side.",
  "A retry must not create duplicate allocation."
]
```

Invariants should be testable/reviewable where practical.

---

# 53. `acceptance_criteria`

Implementation Contract acceptance criteria are objects.

Required:

```text
id
description
```

Optional:

```text
blocking
```

ID pattern:

```text
AC-001
AC-002
AC-003
```

---

# 54. Implementation Contract — Acceptance Criteria

Good:

```json
{
  "id": "AC-001",
  "description": "Concurrent retries for the same logical allocation do not create duplicate allocation records.",
  "blocking": true
}
```

Weak:

```json
{
  "id": "AC-001",
  "description": "Payments work."
}
```

---

# 55. Blocking Acceptance Criterion

Use:

```json
"blocking": true
```

for criteria whose failure prevents acceptable completion.

Omitting `blocking` does not automatically mean failure is safe.

Use intentional semantics.

---

# 56. Negative Acceptance Criteria

Security, governance, and high-risk work SHOULD include explicit negative behavior where material.

Example:

```text
Unauthorized callers cannot allocate payment.
```

Negative requirements may use normal `AC-###` IDs.

Do not invent a second incompatible ID schema if canonical tooling expects `AC-###`.

---

# 57. `planned_checks`

Each planned check requires:

```text
id
description
```

Optional:

```text
environment
```

ID pattern:

```text
CHK-001
CHK-002
```

---

# 58. Planned Check Is Not Evidence

Example:

```json
{
  "id": "CHK-001",
  "description": "Run payment allocation concurrency regression tests.",
  "environment": "local"
}
```

This means:

```text
must be run
```

not:

```text
already passed
```

---

# 59. Check Environment

Where relevant, identify:

```text
local
ci
staging
production
```

or another explicit environment.

Do not claim CI evidence from a locally planned check.

---

# 60. `stop_conditions`

List stop conditions relevant to this implementation.

Examples may include upstream:

```text
SCOPE_EXPANSION_REQUIRED
PERMISSION_UNCLEAR
REQUIRED_SOURCE_MISSING
DEPENDENCY_UNRESOLVED
REQUIRED_EVIDENCE_UNAVAILABLE
UNRELATED_WORK_COLLISION
```

and Vibe-local coordination stop such as:

```text
VE_STOP.STALE_BASELINE
```

when applicable.

---

# 61. Stop Conditions Are Operational Boundaries

Builder MUST understand:

> Encountering a declared stop condition means stop and report, not improvise around it.

Do not turn stop conditions into warnings.

---

# 62. `dependencies`

Optional.

Implementation Contract dependencies may reference external requirements or work dependencies using unique strings.

Keep them meaningful.

Do not duplicate Work Package dependency semantics unnecessarily.

---

# 63. `work_package_ids`

Implementation Contract holds Work Package IDs.

Pattern:

```text
WP-<semantic-id>
```

Example:

```json
"work_package_ids": [
  "WP-mgbos-payment-allocation-command"
]
```

---

# 64. `decision_required`

Optional object.

Required inside the object:

```text
required
```

Optional:

```text
question
```

Example:

```json
"decision_required": {
  "required": true,
  "question": "Should allocation conflicts fail the request or enter a reconciliation queue?"
}
```

---

# 65. Owner Decision Is Not Approval Evidence

`decision_required` records a planning decision need.

It does not create canonical approval evidence.

Do not write:

```json
"decision_required": {
  "required": false
}
```

because the Owner said "gas" if an actual unresolved material decision still exists.

---

# 66. `notes`

Optional list of unique strings.

Use for non-authoritative clarification.

Do not hide:

- scope changes;
- risk exceptions;
- authority changes;
- acceptance changes;

inside `notes`.

Those belong in their actual semantic fields or contract amendment.

---

# 67. Implementation Contract Semantic Validation

After schema validation, perform semantic validation.

Minimum questions:

```text
Does target_system match workspace?

Does routing.profile match target system?

Does task type exist?

Do concerns exist?

Do expertise IDs exist?

Does risk satisfy routing floor?

Do canonical sources actually govern the change?

Does scope cover acceptance criteria?

Do checks test the acceptance criteria?

Do stop conditions match material failure modes?

Does the baseline match the intended implementation state?

Does the contract require authority it does not possess?
```

---

# 68. Schema PASS ≠ Route PASS

This is a hard Vibe invariant.

A contract can pass JSON Schema while still containing:

```text
target_system = repository-engineering

workspace = .

routing.profile = mgbos
```

That artifact is:

```text
STRUCTURALLY VALID
SEMANTICALLY INVALID
```

It MUST NOT become `READY_FOR_IMPLEMENTATION`.

---

# 69. Schema PASS ≠ Evidence PASS

A contract contains intended work.

It proves nothing was implemented.

Do not use contract existence as implementation evidence.

---

# 70. Work Package Purpose

A Work Package answers:

> What exact bounded slice may one Engineer execute?

The Work Package is the primary Builder execution boundary.

Canonical rule:

```text
ONE WORK PACKAGE
→
ONE ACTIVE WRITER
→
ONE BRANCH
→
ONE WORKTREE
→
ONE BOUNDED MUTABLE SCOPE
```

by default.

---

# 71. Work Package Required Fields

Current schema requires:

```text
schema_version
artifact_type
artifact_id
implementation_contract_id
state
writer
base_revision
branch
worktree
objective
scope
risk
required_expertise
acceptance_criteria
required_checks
stop_conditions
handoff_to
```

Optional:

```text
selected_skills
dependencies
```

No arbitrary properties.

---

# 72. Work Package `schema_version`

Current value:

```json
"schema_version": 1
```

---

# 73. Work Package `artifact_type`

Required:

```json
"artifact_type": "WORK_PACKAGE"
```

---

# 74. Work Package `artifact_id`

Pattern:

```text
WP-<semantic-id>
```

Example:

```text
WP-mgbos-payment-allocation-command
```

---

# 75. `implementation_contract_id`

Must point to the parent contract.

Example:

```json
"implementation_contract_id": "IC-mgbos-payment-allocation-v2"
```

Do not create orphan Work Packages.

---

# 76. Work Package State

Allowed:

```text
READY
IN_PROGRESS
BLOCKED
COMPLETED
SUPERSEDED
CANCELLED
```

Do not add:

```text
LOCAL_PASS
PR_CREATED
READY_TO_MERGE
```

---

# 77. `READY`

Use when the package is properly bounded and may enter implementation under applicable authority.

`READY` does not mean:

```text
permission granted for every possible tool action
```

---

# 78. `IN_PROGRESS`

Use while the assigned Engineer is actively executing the bounded package.

---

# 79. Work Package `BLOCKED`

Use when implementation cannot safely continue.

Record the actual blocker through report/handoff/context.

Do not continue editing outside scope merely to remove the blocker.

---

# 80. `COMPLETED`

A Work Package may become `COMPLETED` when:

```text
its bounded implementation work is finished
+
required Engineer reporting is produced
```

It does not mean:

```text
audit passed
QA passed
merged
released
```

---

# 81. Work Package `SUPERSEDED`

Use when another Work Package replaces this execution slice.

Do not silently mutate historical completed package semantics.

---

# 82. Work Package `CANCELLED`

Use when assigned work is intentionally abandoned.

---

# 83. `writer`

Required:

```text
role
identity
```

Optional:

```text
runtime
```

Role is schema-fixed:

```text
engineer
```

Example:

```json
"writer": {
  "role": "engineer",
  "identity": "antigravity-builder",
  "runtime": "Antigravity"
}
```

---

# 84. Writer Is Not Provider Policy

The writer identity may change:

```text
Antigravity
Codex
Claude Code
Hermes
```

without altering:

- scope;
- risk;
- acceptance;
- permission;
- canonical semantics.

---

# 85. Work Package — `base_revision`

Unlike Implementation Contract, Work Package uses a string:

```json
"base_revision": "0123456789abcdef0123456789abcdef01234567"
```

Do not use an object here.

This distinction matters.

---

# 86. Work Package Baseline Startup Check

Before editing, Builder MUST compare:

```text
actual workspace revision
vs
base_revision
```

If materially mismatched:

```text
VE_STOP.STALE_BASELINE
```

and stop/reconcile.

---

# 87. `branch`

Name the implementation branch.

Example:

```json
"branch": "mgbos/payment-allocation-idempotency"
```

Actual repository naming conventions still apply.

---

# 88. `worktree`

Identify the actual workspace/worktree.

Example:

```json
"worktree": "mgbos-payment-allocation-wt"
```

A worktree identity does not prove:

- database isolation;
- environment isolation;
- secret isolation.

---

# 89. Work Package `objective`

The Work Package objective should be narrower than or equal to the Implementation Contract objective.

It MUST NOT expand the parent mission.

---

# 90. Work Package `scope`

Required:

```text
allowed_paths
forbidden_paths
```

Unlike Implementation Contract, Work Package does not contain `explicit_non_goals`.

Those remain inherited context from the parent contract.

---

# 91. `scope.allowed_paths`

These are the paths the writer may modify.

Builder MUST treat them as a write boundary.

---

# 92. `scope.forbidden_paths`

Explicitly list high-risk or unrelated paths the writer must not modify.

This is especially useful when broad allowed globs might otherwise create ambiguity.

---

# 93. Scope Collision

If another active writer owns an overlapping path:

```text
UNRELATED_WORK_COLLISION
```

or applicable stop condition.

Do not race multiple AI writers across the same mutable scope.

---

# 94. Work Package `risk`

Allowed:

```text
R0
R1
R2
R3
R4
R5
```

It should preserve the applicable parent/effective risk.

Builder MUST NOT silently lower it.

---

# 95. `required_expertise`

Use the expertise IDs required for this Work Package.

The set may be equal to or narrower than the parent route where the slice permits, but MUST NOT omit expertise required for the slice's actual concerns.

---

# 96. `selected_skills`

Optional.

Only include Skills actually selected for execution.

Do not load every candidate Skill.

Use minimum sufficient context.

---

# 97. Work Package — `acceptance_criteria`

Current schema uses:

```text
array of strings
```

not acceptance-criterion objects.

Preferred values:

```json
"acceptance_criteria": [
  "AC-001",
  "AC-002"
]
```

when referencing parent Implementation Contract criteria.

This preserves traceability.

---

# 98. Do Not Duplicate Criterion Meaning

Avoid:

```json
"acceptance_criteria": [
  "AC-001 - slightly rewritten criterion"
]
```

if the canonical parent already defines AC-001.

Prefer the stable ID.

The parent contract owns the actual description.

---

# 99. `required_checks`

Current Work Package schema uses:

```text
array of strings
```

Preferred:

```json
"required_checks": [
  "CHK-001",
  "CHK-002"
]
```

where those IDs reference parent planned checks.

---

# 100. `dependencies`

Optional.

Dependencies are Work Package IDs.

Example:

```json
"dependencies": [
  "WP-mgbos-payment-schema"
]
```

Do not put arbitrary external dependency text here.

Use the parent contract for broader dependency description.

---

# 101. `stop_conditions`

Preserve applicable contract/routing stop conditions.

Work Package may add slice-specific conditions when needed.

It MUST NOT remove a mandatory parent stop condition merely for convenience.

---

# 102. `handoff_to`

Required.

Current allowed values:

```text
auditor
qa
```

At least one is required.

Example:

```json
"handoff_to": [
  "auditor",
  "qa"
]
```

---

# 103. Handoff Does Not Imply Independence

A Work Package containing:

```json
"handoff_to": ["auditor"]
```

does not mean the future review is independent.

Assurance independence depends on actual execution facts.

---

# 104. Builder Startup Protocol

Before implementation, Builder MUST verify:

```text
repository
workspace
branch
worktree
base revision
parent contract
Work Package state
allowed paths
forbidden paths
required sources
stop conditions
```

Material mismatch means:

```text
STOP
```

not silent adaptation.

---

# 105. Builder Must Read Canonical Sources Selectively

The Builder should receive:

```text
parent contract
Work Package
relevant canonical sources
relevant implementation files
tests/schemas/validators
```

Do not inject the entire documentation repository automatically.

Use minimum sufficient context.

---

# 106. Builder Authority

Builder may make normal implementation decisions within the accepted technical boundary.

Builder MUST NOT silently change:

```text
objective
target system
architecture authority
risk
permission
approval requirement
acceptance criteria
canonical semantics
scope boundary
```

---

# 107. Builder Discovers Higher Risk

If implementation reveals a higher-risk concern:

```text
STOP
```

Report the finding.

Planner must re-route/reclassify as needed.

Do not continue under the lower contract risk.

---

# 108. Builder Discovers Missing Dependency

If a required dependency was not included:

```text
DEPENDENCY_UNRESOLVED
```

or applicable stop condition.

Do not silently widen into a multi-system change.

---

# 109. Builder Discovers Scope Expansion

If a required file lies outside `allowed_paths`:

```text
SCOPE_EXPANSION_REQUIRED
```

Stop.

Request contract/Work Package amendment.

---

# 110. Builder Encounters Unclear Permission

Use:

```text
PERMISSION_UNCLEAR
```

and stop consequential execution.

Tool availability is not permission.

---

# 111. Builder Encounters Unverified Environment

Use:

```text
ENVIRONMENT_UNVERIFIED
```

when environment identity materially affects safety.

Do not run destructive/remote actions against an uncertain environment.

---

# 112. Builder Encounters Missing Evidence Mechanism

If required verification cannot be executed:

```text
REQUIRED_EVIDENCE_UNAVAILABLE
```

or applicable stop condition.

Do not fabricate PASS.

---

# 113. Implementation Changes Evidence Mechanism

If the Work Package modifies:

```text
CI
test harness
validator
routing enforcement
permission resolver
gateway
security checker
```

the Engineering Report should explicitly disclose:

```text
evidence mechanism changed
```

The later Auditor must not trust self-pass alone.

---

# 114. Builder Output

After implementation, Builder should produce or support a canonical:

```text
Engineering Report
```

with actual:

```text
revision
files changed
implementation summary
checks run
checks not run
limitations
known failures
handoff
```

The Work Package itself does not become implementation evidence.

---

# 115. Work Package Completion

Do not set:

```text
COMPLETED
```

before the bounded implementation slice has ended.

But Work Package completion still does not mean:

```text
ASSURANCE SATISFIED
VERIFICATION PASS
MERGED
```

---

# 116. Contract Amendment

If the intended objective/scope materially changes:

```text
amend or replace
Implementation Contract
```

according to canonical contract semantics.

Do not rewrite an old accepted contract after implementation merely to match reality.

---

# 117. Work Package Amendment

If implementation slice changes materially:

```text
amend or supersede
Work Package
```

as appropriate.

Scope creep should remain visible.

---

# 118. Example Policy

Examples in this document are:

```text
synthetic
non-executable
```

They demonstrate structure and semantic consistency.

They MUST NOT be copied into real execution without replacing:

```text
revision
branch
paths
task type
concerns
risk
expertise
capabilities
criteria
checks
```

with current repository truth.

---

# 119. Schema-Aligned Semantic Example

The following example intentionally uses:

```text
target_system = mgbos
workspace = systems/mgbos/
routing.profile = mgbos
```

so the target/profile relationship is semantically coherent with the current routing model.

The scenario is illustrative.

---

# 120. Full Implementation Contract Example

```json
{
  "schema_version": 1,
  "artifact_type": "IMPLEMENTATION_CONTRACT",
  "artifact_id": "IC-mgbos-payment-allocation-idempotency",
  "state": "READY_FOR_IMPLEMENTATION",
  "created_at": "2026-10-03T03:00:00Z",
  "created_by": {
    "role": "planner",
    "identity": "head-engineering-session",
    "runtime": "ChatGPT",
    "provider": "OpenAI"
  },
  "repository": "Rizkybuilds/bisnishub",
  "workspace": "systems/mgbos/",
  "target_system": "mgbos",
  "base_revision": {
    "sha": "0123456789abcdef0123456789abcdef01234567",
    "branch": "main"
  },
  "supersedes": null,
  "objective": "Prevent duplicate payment allocation under concurrent retries while preserving authorization, organization isolation, and historical financial integrity.",
  "scope": {
    "allowed_paths": [
      "systems/mgbos/src/payments/**",
      "systems/mgbos/tests/payments/**"
    ],
    "excluded_paths": [
      ".agents/**",
      ".github/workflows/**",
      "systems/jarvis/**"
    ],
    "explicit_non_goals": [
      "Do not change payment approval policy.",
      "Do not introduce production deployment.",
      "Do not modify JARVIS runtime behavior."
    ]
  },
  "routing": {
    "profile": "mgbos",
    "primary_task_type": "backend-command-change",
    "concerns": [
      "financial-truth",
      "authorization",
      "concurrency-idempotency"
    ],
    "roles": [
      "planner",
      "engineer",
      "auditor",
      "qa"
    ],
    "required_expertise": [
      "EXP-002",
      "EXP-003",
      "EXP-005",
      "EXP-006",
      "EXP-007",
      "EXP-011"
    ]
  },
  "risk": {
    "effective_level": "R5",
    "reasons": [
      "The change affects financial truth.",
      "Authorization and organization boundaries are part of the command path.",
      "Concurrent retries could create duplicate financial allocation if idempotency fails."
    ]
  },
  "canonical_sources": [
    "docs/governance/cross-system-risk-classification.md",
    "systems/mgbos/docs/architecture/business-invariants.md",
    "systems/mgbos/docs/architecture/permission-authorization-model.md",
    ".agents/contracts/README.md",
    ".agents/routing/README.md"
  ],
  "invariants": [
    "Payment allocation remains organization-scoped.",
    "Authorization remains enforced on the server-side command path.",
    "The same logical allocation cannot create duplicate financial allocation under retries.",
    "Historical financial records are not silently rewritten."
  ],
  "acceptance_criteria": [
    {
      "id": "AC-001",
      "description": "Concurrent retries for the same logical payment allocation do not create duplicate allocation records.",
      "blocking": true
    },
    {
      "id": "AC-002",
      "description": "Unauthorized callers cannot perform payment allocation through the governed command path.",
      "blocking": true
    },
    {
      "id": "AC-003",
      "description": "Organization isolation remains enforced for payment allocation reads and writes.",
      "blocking": true
    }
  ],
  "planned_checks": [
    {
      "id": "CHK-001",
      "description": "Run focused payment allocation idempotency and concurrency regression tests.",
      "environment": "local"
    },
    {
      "id": "CHK-002",
      "description": "Run negative authorization and cross-organization isolation tests for the affected command path.",
      "environment": "local"
    },
    {
      "id": "CHK-003",
      "description": "Run the applicable MGBOS foundation and repository governance CI checks for the candidate revision.",
      "environment": "ci"
    }
  ],
  "stop_conditions": [
    "VE_STOP.STALE_BASELINE",
    "SCOPE_EXPANSION_REQUIRED",
    "DEPENDENCY_UNRESOLVED",
    "PERMISSION_UNCLEAR",
    "ENVIRONMENT_UNVERIFIED",
    "REQUIRED_EVIDENCE_UNAVAILABLE",
    "UNRELATED_WORK_COLLISION"
  ],
  "dependencies": [],
  "work_package_ids": [
    "WP-mgbos-payment-allocation-command"
  ],
  "decision_required": {
    "required": false,
    "question": null
  },
  "notes": [
    "This is a synthetic schema-aligned example and MUST NOT be executed as-is."
  ]
}
```

---

# 121. Why This Example Is Semantically Better

The example preserves:

```text
target system
mgbos
```

```text
workspace
systems/mgbos/
```

```text
routing profile
mgbos
```

Those three concepts align.

It also uses a routing composition already demonstrated by current routing documentation:

```text
backend-command-change
financial-truth
authorization
concurrency-idempotency
R5
```

The specific implementation paths remain illustrative.

---

# 122. Full Work Package Example

```json
{
  "schema_version": 1,
  "artifact_type": "WORK_PACKAGE",
  "artifact_id": "WP-mgbos-payment-allocation-command",
  "implementation_contract_id": "IC-mgbos-payment-allocation-idempotency",
  "state": "READY",
  "writer": {
    "role": "engineer",
    "identity": "antigravity-builder",
    "runtime": "Antigravity"
  },
  "base_revision": "0123456789abcdef0123456789abcdef01234567",
  "branch": "mgbos/payment-allocation-idempotency",
  "worktree": "mgbos-payment-allocation-wt",
  "objective": "Implement the bounded MGBOS payment allocation idempotency change defined by the parent contract without expanding authorization or system authority.",
  "scope": {
    "allowed_paths": [
      "systems/mgbos/src/payments/**",
      "systems/mgbos/tests/payments/**"
    ],
    "forbidden_paths": [
      ".agents/**",
      ".github/workflows/**",
      "systems/jarvis/**"
    ]
  },
  "risk": "R5",
  "required_expertise": [
    "EXP-002",
    "EXP-003",
    "EXP-005",
    "EXP-006",
    "EXP-007",
    "EXP-011"
  ],
  "acceptance_criteria": [
    "AC-001",
    "AC-002",
    "AC-003"
  ],
  "required_checks": [
    "CHK-001",
    "CHK-002",
    "CHK-003"
  ],
  "dependencies": [],
  "stop_conditions": [
    "VE_STOP.STALE_BASELINE",
    "SCOPE_EXPANSION_REQUIRED",
    "DEPENDENCY_UNRESOLVED",
    "PERMISSION_UNCLEAR",
    "ENVIRONMENT_UNVERIFIED",
    "REQUIRED_EVIDENCE_UNAVAILABLE",
    "UNRELATED_WORK_COLLISION"
  ],
  "handoff_to": [
    "auditor",
    "qa"
  ]
}
```

---

# 123. Example Validation Requirement

Before using a real contract:

```text
1. replace synthetic data
2. validate JSON Schema
3. validate target/workspace/profile compatibility
4. validate route
5. validate risk floor
6. validate expertise IDs
7. validate paths
8. validate baseline
9. validate criteria/check linkage
10. validate authority boundary
```

Only then may it become implementation-ready.

---

# 124. Do Not Copy Example SHA

The example:

```text
0123456789abcdef0123456789abcdef01234567
```

is deliberately synthetic.

A real contract MUST use the actual exact repository revision.

---

# 125. Do Not Copy Example Paths Blindly

Example paths are illustrative.

Before real work:

```text
inspect repository
```

and use actual existing paths.

A contract pointing to nonexistent paths is not implementation-ready.

---

# 126. Do Not Copy Example Expertise Blindly

Expertise IDs must be resolved against:

```text
.agents/expertise/registry.yaml
```

and current routing output.

Do not treat the example set as universal for MGBOS work.

---

# 127. Do Not Copy Example Task Type Blindly

The example uses:

```text
backend-command-change
```

because it matches the synthetic scenario.

Different work must resolve its actual task type.

---

# 128. Contract Validation Checklist

Before setting:

```text
READY_FOR_IMPLEMENTATION
```

verify:

```text
[ ] schema parses
[ ] no additional properties
[ ] artifact ID valid
[ ] creator role = planner
[ ] repository correct
[ ] target system resolved
[ ] workspace correct
[ ] matching routing profile exists
[ ] task type registered
[ ] concerns registered
[ ] required roles canonical
[ ] expertise IDs registered
[ ] effective risk satisfies route
[ ] baseline exact
[ ] canonical sources valid
[ ] scope bounded
[ ] exclusions explicit
[ ] non-goals explicit
[ ] invariants meaningful
[ ] acceptance criteria measurable
[ ] planned checks map to criteria
[ ] stop conditions sufficient
[ ] Work Package IDs valid
[ ] Owner decisions resolved or explicitly represented
[ ] no unverified authority expansion
```

---

# 129. Work Package Validation Checklist

Before setting:

```text
READY
```

verify:

```text
[ ] schema parses
[ ] artifact ID valid
[ ] parent contract exists
[ ] writer role = engineer
[ ] writer identity explicit
[ ] baseline matches accepted implementation revision
[ ] branch explicit
[ ] worktree explicit
[ ] objective is within parent objective
[ ] allowed paths bounded
[ ] forbidden paths explicit
[ ] risk not below parent/effective floor
[ ] required expertise sufficient
[ ] selected Skills valid if present
[ ] acceptance criterion IDs exist in parent
[ ] required check IDs exist in parent
[ ] dependencies valid
[ ] stop conditions preserved
[ ] handoff target valid
[ ] no overlapping active writer conflict
```

---

# 130. Builder Prompt Pattern

A Builder prompt SHOULD be concise because the durable contract already exists.

Recommended structure:

```text
ACTIVE ROLE
engineer

IMPLEMENTATION CONTRACT
<IC ID / artifact>

WORK PACKAGE
<WP ID / artifact>

STARTUP
Verify repository, worktree, branch and base revision before editing.

EXECUTION
Implement only the Work Package scope.

STOP
Stop on any declared stop condition.
Do not silently expand scope or lower risk.

VERIFICATION
Run required checks applicable to the Engineer.

OUTPUT
Produce the required Engineering Report / evidence and hand off to auditor/QA.
```

Do not paste a second contradictory implementation contract into the prompt.

---

# 131. Builder Must Not Recompute Planning

Builder may discover facts.

Builder MUST NOT independently replace Planner authority by rewriting:

```text
route
risk
acceptance
scope
canonical source ownership
```

If material planning assumption is wrong:

```text
STOP
HAND BACK
```

---

# 132. Builder May Choose Implementation Detail

Inside the bounded contract, Builder may choose technical details such as:

```text
function decomposition
local variable names
small refactor mechanics
test helper design
```

when those choices do not alter:

- architecture;
- contract;
- risk;
- authority;
- acceptance.

This avoids micromanaging implementation.

---

# 133. Required Full-File Replacement

If the Owner's working style prefers complete-file replacement, a Work Package may instruct Builder to return full-file content where appropriate.

That is a presentation/editing preference.

It does not expand allowed paths.

---

# 134. No Arbitrary Shell Authority

A Work Package requiring tests does not grant arbitrary shell authority beyond the runtime's actual governed capability.

Tool exposure remains separate.

---

# 135. No Remote Mutation Assumption

Branch and PR planning does not mean Builder may automatically:

```text
push
create PR
merge
```

Those actions remain subject to actual capability/permission/approval.

---

# 136. Work Package and Git State

A Work Package should bind to the intended implementation state.

If local workspace contains unrelated changes:

```text
preserve
```

Do not clean them destructively.

If overlapping ownership is unclear:

```text
UNRELATED_WORK_COLLISION
```

---

# 137. Work Package Dependencies and Parallelism

Parallel Work Packages are appropriate only when:

```text
write scopes do not conflict
dependency order is understood
integration strategy exists where needed
```

Avoid parallelism merely because multiple AI runtimes are available.

---

# 138. Integration of Multiple Work Packages

If several Work Packages converge:

```text
integrated candidate
```

requires fresh applicable:

```text
assurance
verification
```

Branch-level evidence does not automatically certify the combined revision.

---

# 139. Contract Drift Detection

During implementation/audit compare:

```text
INTENDED
Implementation Contract

ACTUAL
candidate diff / Engineering Report
```

Material mismatch must remain visible.

Do not rewrite contract history to eliminate drift.

---

# 140. Acceptance Drift

If implementation cannot satisfy an acceptance criterion:

do not weaken it silently.

Possible correct paths:

```text
fix implementation
amend contract
Owner decision
block work
```

depending on root cause.

---

# 141. Evidence Drift

If planned check no longer tests the actual changed behavior:

update the planning/verification requirement explicitly.

Do not run irrelevant checks and call the contract verified.

---

# 142. Risk Drift

If implementation changes the affected consequence:

```text
re-route
```

where needed.

Example:

```text
local read helper
```

becoming:

```text
production write path
```

is a material risk change.

---

# 143. Authority Drift

If implementation begins requiring a capability outside current permission:

```text
STOP
```

Do not expand authority because the contract exists.

---

# 144. Environment Drift

If the intended test environment changes:

```text
local disposable
→ remote shared
```

reassess controls before execution.

---

# 145. Contract Does Not Approve Release

Even a perfect Implementation Contract and completed Work Package do not authorize:

```text
merge
deployment
production mutation
```

Later assurance, verification, release, permission and approval remain separate.

---

# 146. Contract Does Not Prove Completion

Implementation Contract:

```text
INTENDED
```

Work Package:

```text
ASSIGNED
```

Engineering Report:

```text
ACTUAL IMPLEMENTATION
```

Assurance Report:

```text
TRUST REVIEW
```

Verification Matrix:

```text
OBSERVED ACCEPTANCE
```

Release Packet:

```text
RELEASE READINESS
```

Keep every stage separate.

---

# 147. Anti-Pattern — Giant Builder Prompt

Forbidden:

```text
Build everything required for MGBOS.
Use best judgment.
Fix any issue you find.
```

This destroys:

- scope;
- auditability;
- risk routing;
- ownership.

---

# 148. Anti-Pattern — Empty Contract

A schema-valid contract with:

```text
allowed_paths = []
invariants = []
stop_conditions = []
```

may technically satisfy some array constraints.

That does not make it useful or semantically safe.

Contract quality requires engineering judgment.

---

# 149. Anti-Pattern — Fake Canonical Sources

Do not list:

```text
old report
session note
chat transcript
```

under `canonical_sources` because they contain relevant information.

Use the actual semantic owner.

---

# 150. Anti-Pattern — Generic Risk Reason

Avoid:

```text
"High risk because important."
```

Risk reasons should connect to actual consequence.

---

# 151. Anti-Pattern — Unbounded Path

Avoid:

```json
"allowed_paths": ["**"]
```

for normal implementation work.

Repository-wide changes require explicit justification and stronger review.

---

# 152. Anti-Pattern — Work Package Without Parent

Never issue:

```text
WP-...
```

without a valid:

```text
IC-...
```

when canonical material workflow requires an Implementation Contract.

---

# 153. Anti-Pattern — Stale Base

Never tell Builder:

```text
ignore base mismatch and continue
```

merely to save time.

Reconcile the baseline first.

---

# 154. Anti-Pattern — Provider as Authority

Do not encode:

```text
Antigravity may modify more files because it is the Builder.
```

Builder is an operating function.

Authority remains canonical.

---

# 155. Anti-Pattern — Contract as Approval

Forbidden:

```text
READY_FOR_IMPLEMENTATION
therefore approved by Owner
```

Those are different concepts.

---

# 156. Anti-Pattern — Schema Pass as Semantic Pass

Forbidden logic:

```text
jsonschema validates
therefore contract is correct
```

Required:

```text
schema validation
+
semantic validation
+
repository reality
```

---

# 157. Low-Risk Compression

For low-risk work, contract process may be compact where canonical policy permits.

Do not generate unnecessary bureaucracy for:

```text
cosmetic typo
non-semantic formatting
```

But semantic Markdown governance changes are not automatically low-risk.

---

# 158. High-Risk Separation

For material R4/R5 work, preserve stronger separation:

```text
Planner
↓
Engineer
↓
Auditor
↓
QA
```

with canonical artifact chain as applicable.

Do not collapse high-risk work into one undocumented AI pass.

---

# 159. Governance Change

When the contract modifies:

```text
routing
permission
approval
gateway
validator
CI governance
contracts
```

planned checks SHOULD include:

```text
positive behavior
negative behavior
bypass analysis
regression
```

because the change may affect its own evaluator.

---

# 160. Security Change

Security-sensitive contract SHOULD include explicit negative acceptance such as:

```text
unauthorized path is denied
```

not only:

```text
authorized path works
```

---

# 161. Financial Change

Financial R5 contract SHOULD preserve applicable:

```text
authorization
idempotency
concurrency
historical integrity
reconciliation
organization isolation
```

as explicit invariants/criteria where relevant.

---

# 162. Database Change

Database/migration contract SHOULD consider:

```text
upgrade path
existing data
constraints
RLS
grants
application compatibility
forward recovery
```

according to actual scope.

---

# 163. AI / Agent Change

AI-enabled implementation contract SHOULD consider where relevant:

```text
structured output
tool boundary
prompt injection
provider failure
stale evidence
behavioral regression
authority
```

---

# 164. External Side Effect

Contract involving external effect SHOULD identify:

```text
sandbox
idempotency
unknown outcome
verification
reconciliation
```

before real execution.

---

# 165. Required Handoff to Auditor

Where auditor is required:

Engineer hands off:

```text
exact candidate revision
parent IC
WP
Engineering Report
checks
known limitations
```

The auditor reviews actual candidate, not only the contract.

---

# 166. Required Handoff to QA

QA receives:

```text
acceptance criteria
required checks
candidate revision
evidence
```

QA must not infer acceptance from implementation summary.

---

# 167. Contract Storage

The schemas are canonical repository artifacts.

Generated execution instances need not automatically be committed into:

```text
.agents/contracts/
```

Do not mix schema definitions with every runtime instance.

Use the repository's accepted execution-artifact storage mechanism when one is defined.

---

# 168. Sensitive Data

Never place:

```text
passwords
API keys
tokens
bank credentials
raw customer records
production secrets
```

inside contracts.

Use references/identifiers.

---

# 169. Chain of Thought

Contracts must contain:

```text
decision summary
rationale
sources
requirements
```

not private chain-of-thought.

Durable engineering artifacts should preserve inspectable conclusions, not hidden reasoning traces.

---

# 170. Contract Quality Test

A qualified Engineer receiving the contract should be able to answer:

```text
What exactly is the goal?

Which repository/system?

Which exact baseline?

Which paths may I touch?

Which paths must I not touch?

Which canonical sources govern this?

What risk applies?

Which invariants must remain true?

What proves success?

What must I test?

What makes me stop?

Who receives my handoff?
```

without relying on previous chat history.

---

# 171. Planner Completion Test

Planner may hand off only when:

```text
contract is schema-valid
contract is semantically valid
route is valid
risk is valid
scope is bounded
baseline is current enough
criteria are measurable
checks are relevant
stop conditions are explicit
Work Package is bounded
```

---

# 172. Builder Completion Test

Builder completes the Work Package only when:

```text
bounded implementation work ended
required Engineer checks were run or honestly recorded as unavailable
actual changes are reported
known limitations are explicit
handoff is ready
```

Completion is not final engineering approval.

---

# 173. Required Invariants

This standard preserves:

```text
IC-INV-001
Schema validity does not imply semantic validity.

IC-INV-002
Target system, workspace and routing profile must be compatible.

IC-INV-003
No matching routing profile means no fabricated Vibe implementation route.

IC-INV-004
Implementation Contract is planning authority, not execution permission.

IC-INV-005
Work Package bounds one writer slice.

IC-INV-006
One active writer owns overlapping mutable scope by default.

IC-INV-007
Builder does not silently expand scope.

IC-INV-008
Builder does not silently lower risk.

IC-INV-009
Builder does not silently expand authority.

IC-INV-010
Baseline drift requires reconciliation.

IC-INV-011
Acceptance criteria remain traceable.

IC-INV-012
Planned checks are not executed evidence.

IC-INV-013
Changed evidence mechanisms require stronger scrutiny.

IC-INV-014
Provider identity does not change contract authority.

IC-INV-015
Contract completion does not imply audit, QA, merge or release success.
```

---

# 174. Final Principle

Implementation Contract exists to make intended engineering work explicit.

Work Package exists to make execution bounded.

Together they should create this handoff:

```text
PLANNER
defines exact intended change

        ↓

IMPLEMENTATION CONTRACT
defines boundaries and success

        ↓

WORK PACKAGE
assigns one executable slice

        ↓

ENGINEER
implements only that slice

        ↓

ENGINEERING REPORT
records reality

        ↓

AUDITOR / QA
independently or proportionally evaluate reality
```

The Builder should never have to guess:

```text
what is in scope
what authority exists
what risk applies
what success means
when to stop
```

That is the standard for Vibe Engineering implementation contracts.