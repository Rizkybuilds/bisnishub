---
canonical_id: docs.engineering.vibe-engineering.change-package-template
status: ACTIVE
version: 1.1.1
owner: Rizky
author: OpenAI / ChatGPT
approver: Rizky
scope: repository-engineering
document_class: standard
effective_from: 2026-10-03

authoritative_for:
  - vibe engineering change-package coordination format
  - vibe engineering reflection-to-plan format
  - vibe engineering planning-readiness checklist
  - vibe engineering coordination-package boundaries
  - vibe engineering planning-to-contract handoff
  - vibe engineering owner-decision packaging
  - vibe engineering package-level dependency and evidence planning

last_reviewed: 2026-10-03
reviewed_against_revision: 26871da802706fba5bc033576fbb0a487f6c9255
review_cadence: quarterly

depends_on:
  - ./README.md
  - ./state-and-vocabulary.md
  - ./operating-model.md
  - ./session-protocol.md
  - ../../governance/documentation-constitution.md
  - ../../governance/canonical-source-map.md
  - ../../governance/cross-system-risk-classification.md
  - ../../governance/evidence-provenance-model.md
  - ../../governance/approval-policy.md
  - ../engineering-ai-control-plane.md
  - ../../../.agents/contracts/README.md
  - ../../../.agents/routing/README.md
  - ../../../.agents/capabilities/README.md
  - ../../../AGENTS.md

supersedes: null
---

# Vibe Engineering Change Package Template

## 1. Purpose

A Vibe Engineering Change Package is a human-readable coordination envelope for one bounded engineering objective.

It exists to connect:

```text
OWNER INTENT
    ↓
CURRENT REPOSITORY REALITY
    ↓
REFLECTION
    ↓
FRESH AUDIT
    ↓
DEPENDENCY CLOSURE
    ↓
ROUTING
    ↓
BOUNDED PLAN
    ↓
CANONICAL IMPLEMENTATION CONTRACT
    ↓
WORK PACKAGE
    ↓
EVIDENCE / ASSURANCE / VERIFICATION
    ↓
INTEGRATION
    ↓
REFLECTION
```

The Change Package helps humans and AI runtimes understand:

- what is being changed;
- why it is being changed;
- where it sits in the roadmap;
- which repository state was reviewed;
- which canonical authorities apply;
- what dependencies were discovered;
- which Owner decisions exist;
- which canonical execution artifacts implement the work;
- and what must happen before the package can be considered complete.

---

# 2. Change Package Is Not an Execution Contract

Canonical rule:

```text
CHANGE PACKAGE
≠
IMPLEMENTATION CONTRACT
≠
WORK PACKAGE
```

A Change Package MUST NOT grant implementation authority.

It MUST NOT replace:

```text
Implementation Contract
Work Package
Engineering Report
Assurance Report
Verification Matrix
Release Packet
```

Where those canonical artifacts are required, they remain authoritative for their respective semantics.

---

# 3. Change Package Is a Coordination Layer

The Change Package owns coordination information such as:

```text
WHY
WHAT
WHERE WE ARE
WHAT WE LEARNED
WHAT DEPENDS ON THIS
WHAT DECISION IS NEEDED
WHAT ARTIFACT IMPLEMENTS IT
WHAT COMES NEXT
```

It should not duplicate entire canonical schemas.

---

# 4. Change Package Identifier

Recommended Vibe Change Package identifier:

```text
VECP-###
```

Examples:

```text
VECP-001
VECP-027
VECP-104
```

Do **not** default to:

```text
CP-###
```

because BisnisHub already uses `CP-###` terminology for Engineering Control Plane implementation program packages.

The `VECP-` prefix prevents ambiguity.

---

# 5. Package Identity Is Not Canonical Artifact Identity

Example:

```text
VIBE CHANGE PACKAGE
VECP-027
```

may reference:

```text
IMPLEMENTATION CONTRACT
IC-027

WORK PACKAGE
WP-027-A
```

These are separate identities.

Do not make their IDs interchangeable.

---

# 6. Package Coordination State

Avoid inventing a large package lifecycle.

Use Vibe coordination vocabulary:

```text
VE_OBJECTIVE.OPEN
VE_OBJECTIVE.BLOCKED
VE_OBJECTIVE.COMPLETE
```

when a concise coordination state is useful.

Example:

```text
CHANGE PACKAGE
VECP-027

VE_OBJECTIVE
VE_OBJECTIVE.OPEN
```

Canonical artifact states must be reported separately.

---

# 7. Package State Does Not Override Artifact State

Example:

```text
VE_OBJECTIVE
VE_OBJECTIVE.OPEN

IMPLEMENTATION CONTRACT
READY_FOR_IMPLEMENTATION

WORK PACKAGE
IN_PROGRESS
```

This is valid.

Do not collapse those facts into:

```text
PACKAGE_STATUS
IMPLEMENTING
```

as a parallel lifecycle.

---

# 8. One Package, One Bounded Objective

A Change Package SHOULD represent one coherent objective.

Good:

```text
Fail closed on unverified engineering approval evidence.
```

Poor:

```text
Improve governance, CI, frontend, database,
agents, deployment, and documentation.
```

If work contains several independently reviewable objectives:

```text
split packages
```

unless an explicit dependency requires atomic treatment.

---

# 9. Package Size

A package should be:

```text
small enough to audit
large enough to deliver coherent value
```

Avoid both extremes:

```text
one giant repository transformation
```

and:

```text
dozens of meaningless one-line packages
```

Boundaries should follow architecture and risk.

---

# 10. Reflection Before Planning

Every material package SHOULD begin with:

```text
REFLECTION TO PLAN
```

before new implementation planning.

Reflection asks:

```text
What happened previously?

What was proven?

What remains unproven?

What changed in repository reality?

What did we learn?

What should the next package solve?
```

---

# 11. Reflection Is Evidence-Aware

Reflection MUST distinguish:

```text
FACT
```

from:

```text
INFERENCE
```

and:

```text
PLANNED NEXT STEP
```

Do not write:

```text
Previous package solved all governance problems.
```

unless evidence actually supports that scope.

---

# 12. Package Baseline

Record the revision used for package planning.

Recommended field:

```text
PLANNING_BASELINE
<full SHA>
```

Example:

```text
PLANNING_BASELINE
26871da802706fba5bc033576fbb0a487f6c9255
```

This is not permanently valid.

If main changes materially before implementation, re-evaluate.

---

# 13. Baseline Source

Also identify where the baseline came from.

Example:

```text
BASELINE_SOURCE
origin/main
```

or:

```text
BASELINE_SOURCE
PR #27 head
```

depending on package type.

---

# 14. Current Repository Reality

Summarize the relevant current state.

Include only evidence relevant to the objective.

Possible items:

```text
current main
current subsystem status
current implementation
current governance behavior
current failing path
current limitation
current CI
```

Do not reproduce the entire repository.

---

# 15. Current vs Target

Every material Change Package SHOULD distinguish:

```text
CURRENT
```

from:

```text
TARGET
```

Example:

```text
CURRENT
Approval-required gateway execution fails closed because trusted approval evidence verification is unavailable.

TARGET
Preserve fail-closed behavior while strengthening explicit approval-mode enforcement.
```

Do not describe target architecture as already implemented.

---

# 16. Objective

The objective should describe the outcome, not merely the activity.

Weak:

```text
edit gateway files
```

Strong:

```text
Ensure approval-required engineering capabilities cannot be authorized by self-asserted approval content.
```

---

# 17. Why Now

State why this package should exist now.

Possible reasons:

```text
blocking next roadmap package
security defect
post-merge finding
missing foundation
production incident
architecture dependency
governance gap
```

This prevents arbitrary implementation drift.

---

# 18. Roadmap Position

Where relevant, record:

```text
PROGRAM
ROADMAP ITEM
PREDECESSOR
SUCCESSOR
```

Example:

```text
PROGRAM
Engineering Control Plane

PREDECESSOR
CP-007C

CURRENT PACKAGE
CP-007D

NEXT EXPECTED
CP-007E
```

A Vibe coordination package may wrap work from another canonical program.

Do not rename the canonical program package.

---

# 19. Canonical Package vs Vibe Package

Example:

```text
VIBE COORDINATION PACKAGE
VECP-027

CANONICAL PROGRAM ITEM
CP-007D
```

This is preferred over pretending they are the same object.

---

# 20. Target System

Every implementation-oriented package MUST identify:

```text
TARGET_SYSTEM
```

Examples:

```text
mgbos
jarvis
kaskita
repository-engineering
```

Target system resolution occurs before routing.

---

# 21. Target Workspace

Where useful, identify expected workspace/root.

Example:

```text
TARGET_WORKSPACE
systems/mgbos/
```

For repository-level work:

```text
TARGET_WORKSPACE
.
```

Workspace does not determine routing by itself.

---

# 22. Routing Profile

Record the active matching profile if one exists.

Example:

```text
ROUTING_PROFILE
mgbos
```

For a target without an active profile:

```text
ROUTING_PROFILE
NOT_AVAILABLE
```

and:

```text
STOP_REASON
VE_STOP.ROUTING_PROFILE_UNAVAILABLE
```

when governed implementation requires routing.

---

# 23. Never Borrow a Routing Profile

Forbidden:

```text
TARGET_SYSTEM
repository-engineering

ROUTING_PROFILE
mgbos
```

unless canonical routing explicitly establishes that relationship.

A schema-valid string is not proof of semantic validity.

---

# 24. Bootstrap Governance Package

A package may exist specifically to introduce a missing routing profile.

Example:

```text
TARGET_SYSTEM
repository-engineering

CURRENT_ROUTING_PROFILE
NOT_AVAILABLE

PACKAGE_PURPOSE
Introduce governed repository-engineering routing profile.
```

Such work must use existing ACTIVE repository governance.

The package MUST NOT pretend the new profile already exists.

---

# 25. Task Type

If canonical routing has resolved a task type, record it.

Example:

```text
PRIMARY_TASK_TYPE
backend-command-change
```

Do not invent task types outside the registry.

If routing is unavailable:

```text
PRIMARY_TASK_TYPE
UNRESOLVED
```

and explain why.

---

# 26. Concerns

Record resolved cross-cutting concerns.

Examples may include:

```text
authorization
financial-truth
migration
security-privilege
external-side-effect
```

Only use actual canonical routing values.

Do not invent concern names casually.

---

# 27. Effective Risk

Record canonical effective risk:

```text
EFFECTIVE_RISK
R0 | R1 | R2 | R3 | R4 | R5
```

The Change Package does not define risk meaning.

It mirrors the resolved canonical classification.

---

# 28. Risk Rationale

Summarize why the effective risk applies.

Example:

```text
RISK_RATIONALE
- authorization semantics affected
- governance enforcement path modified
- incorrect behavior could expand engineering capability
```

Do not recompute a lower risk inside the package.

---

# 29. Risk Unresolved

If material risk is not resolvable:

```text
EFFECTIVE_RISK
UNRESOLVED
```

and stop implementation.

Do not map uncertainty to `R0`.

---

# 30. Active Roles

Record required canonical roles as resolved by routing.

Example:

```text
REQUIRED_ROLES
- planner
- engineer
- auditor
- qa
```

This does not mean all roles are simultaneously active.

At execution time:

```text
ONE ACTIVE ROLE
```

still applies.

---

# 31. Expertise

Record required/recommended expertise when routing resolves it.

Example:

```text
REQUIRED_EXPERTISE
- EXP-001
- EXP-005
- EXP-007
```

Expertise is not authority.

---

# 32. Skill Candidates

Where useful:

```text
SKILL_CANDIDATES
- mgbos-pr-reviewer
- agent-skill-maintainer
```

These are candidates.

Actual Skill use must respect its contract.

---

# 33. Assurance Requirement

Record the canonical routing assurance requirement.

Example:

```text
ASSURANCE_REQUIREMENT
INDEPENDENT_REQUIRED
```

or:

```text
ASSURANCE_REQUIREMENT
PROPORTIONAL
```

Do not translate it into a Vibe-specific assurance taxonomy.

---

# 34. Canonical Sources

List sources that actually govern the change.

Example:

```text
CANONICAL_SOURCES
- docs/engineering/engineering-ai-control-plane.md
- docs/governance/approval-policy.md
- .agents/contracts/README.md
```

Do not add every related document.

---

# 35. Authority Classification

For complex packages, classify important source types.

Example:

| Source | Classification | Why |
|---|---|---|
| `approval-policy.md` | CANONICAL | approval semantics |
| PR #25 | EVIDENCE | prior implementation |
| old session note | HISTORICAL | context only |

This helps prevent historical evidence from replacing canonical semantics.

---

# 36. Fresh Audit

Summarize relevant findings from the fresh audit.

Example:

```text
FRESH_AUDIT

F1
Trusted approval verifier is not implemented.

F2
Capability approval modes are fail-closed.

F3
Remote mutation remains disabled.
```

Findings must be factual and source-supported.

---

# 37. Finding IDs

For package-level planning findings, use simple local IDs:

```text
F-001
F-002
F-003
```

These are coordination references.

They are not canonical Assurance Report finding IDs unless copied into the formal artifact intentionally.

---

# 38. Finding Severity

If assigning formal finding severity:

use canonical Assurance Report values:

```text
INFO
LOW
MEDIUM
HIGH
CRITICAL
```

Do not invent another severity scale.

For planning notes, severity may be omitted.

---

# 39. Root Cause

For bug/remediation packages:

```text
ROOT_CAUSE
```

should identify the causal defect.

Avoid vague statements like:

```text
AI made a mistake.
```

Prefer:

```text
Permission resolver trusted a structurally valid claim without a trusted authorization-evidence verifier.
```

where evidence supports it.

---

# 40. Sibling Risk

Record whether the same root cause may affect sibling paths.

Example:

```text
SIBLING_AUDIT_REQUIRED
YES
```

Then identify relevant siblings.

---

# 41. Dependency Closure

Summarize what depends on the target.

Recommended categories:

```text
DIRECT_DEPENDENCIES
REVERSE_REFERENCES
SCHEMAS
TESTS
VALIDATORS
CI
DOCS
RUNTIME
```

Not all are required for every package.

---

# 42. Dependency Status

Each material dependency may be labeled:

```text
RESOLVED
UNRESOLVED
NOT_APPLICABLE
```

Use plain package coordination.

Do not create a competing global lifecycle.

---

# 43. Required Source Missing

If a required source is missing:

```text
REQUIRED_SOURCE_MISSING
```

or applicable upstream stop condition.

Do not substitute a summary/report for a missing canonical specification.

---

# 44. Scope

Define planned scope at a human level.

Example:

```text
IN_SCOPE
- approval resolver semantics
- gateway enforcement
- focused governance tests
```

Keep this aligned with the later Implementation Contract.

---

# 45. Out of Scope

Explicitly identify exclusions.

Example:

```text
OUT_OF_SCOPE
- remote GitHub mutation
- production deployment
- business runtime approval service
```

Explicit non-goals reduce AI scope creep.

---

# 46. Allowed Paths

When planning is mature enough, summarize expected paths:

```text
EXPECTED_ALLOWED_PATHS
- scripts/governance/**
- tools/engineering_gateway/**
```

The canonical Work Package remains authoritative for actual write boundaries.

---

# 47. Forbidden Paths

Where risk of accidental edit is high:

```text
EXPECTED_FORBIDDEN_PATHS
- systems/mgbos/supabase/**
- production secrets
```

The actual Work Package should encode the real bounded scope.

---

# 48. Scope Expansion

If later implementation requires new paths/semantics:

```text
SCOPE_EXPANSION_REQUIRED
```

Stop and amend the appropriate artifact.

Do not silently update only the Change Package after implementation already expanded.

---

# 49. Invariants

Record properties that must remain true.

Example:

```text
INVARIANTS
- tool availability does not grant permission
- remote mutation remains disabled
- unverified approval evidence cannot authorize execution
```

Invariants should trace to canonical sources.

---

# 50. Acceptance Criteria

The Change Package may summarize intended acceptance criteria.

Example:

```text
AC-001
Approval-required execution remains blocked without trusted authorization evidence.
```

When canonical Implementation Contract exists:

its acceptance criteria are authoritative.

The Change Package should reference rather than diverge.

---

# 51. Acceptance Criterion Traceability

Preferred:

```text
CHANGE PACKAGE
AC-001 summary

IMPLEMENTATION CONTRACT
AC-001 canonical criterion

VERIFICATION MATRIX
AC-001 verification evidence
```

Keep IDs stable where practical.

---

# 52. Negative Acceptance Criteria

High-risk packages SHOULD include prohibited outcomes.

Example:

```text
AC-NEG-001
A self-authored approval payload MUST NOT authorize governed execution.
```

Negative criteria are especially useful for security/governance work.

---

# 53. Planned Checks

Summarize expected checks.

Example:

```text
CHK-001
Focused approval positive/negative test.

CHK-002
Governance validator.

CHK-003
Bypass-oriented regression.
```

A planned check is not evidence that it ran.

---

# 54. Verification Depth

Verification depth should follow actual consequence.

Possible check categories:

```text
static
unit
integration
database
migration
negative
regression
behavioral
E2E
security
CI
```

Do not include categories just for appearance.

---

# 55. Evidence Mechanism Impact

Every material package SHOULD answer:

```text
EVIDENCE_MECHANISM_CHANGED
YES | NO
```

This is Vibe planning metadata.

It does not replace canonical artifact semantics.

---

# 56. Evidence Mechanism Examples

Use `YES` when changing mechanisms such as:

```text
CI workflows
governance validators
test harness
security checks
routing validator
permission resolver
branch enforcement automation
release gates
evidence schemas
```

---

# 57. Evidence Mechanism Change Consequence

If:

```text
EVIDENCE_MECHANISM_CHANGED
YES
```

planning should include additional review such as:

```text
semantic evaluator diff
bypass review
positive tests
negative tests
old-vs-new behavior
independent/proportional assurance
```

according to canonical routing.

---

# 58. Self-Validation Warning

Record where applicable:

```text
SELF_VALIDATION_RISK
YES
```

Example:

> This package modifies the validator that will run in CI for this package.

That does not block automatically.

It increases assurance scrutiny.

---

# 59. Environment

Record relevant intended environment:

```text
LOCAL
CI
STAGING
PRODUCTION
```

or repository-supported naming.

Environment context may increase risk.

---

# 60. Production Impact

Explicitly answer:

```text
PRODUCTION_MUTATION
YES | NO
```

If unknown:

```text
UNKNOWN
```

and resolve before consequential execution.

---

# 61. Remote Mutation

Explicitly answer where relevant:

```text
REMOTE_MUTATION
YES | NO
```

Examples:

```text
push
PR creation
merge
deployment
remote database mutation
```

A Change Package does not authorize remote mutation.

---

# 62. Permission Impact

Summarize whether the package:

```text
changes permission semantics
requires new permission
uses existing permission
does not involve permission change
```

Use canonical capability registry for real semantics.

---

# 63. Approval Impact

Summarize whether the package:

```text
changes approval semantics
requires approval
does not require action-specific approval
```

Do not fabricate approval evidence.

---

# 64. Security Boundary

For security-relevant packages, identify:

```text
identity boundary
privilege boundary
secret boundary
organization boundary
remote execution boundary
```

where applicable.

---

# 65. Business Authority Boundary

Explicitly state if engineering work can affect:

```text
payments
customer communication
vendor commitment
publication
physical production
financial truth
```

Engineering access does not automatically grant authority for those effects.

---

# 66. Recovery

For material changes, identify how failure would be recovered.

Examples:

```text
revert
forward fix
restore
migration repair
reconciliation
feature disable
```

Do not assume every change is trivially reversible.

---

# 67. Rollback vs Recovery

Distinguish:

```text
ROLLBACK
```

from:

```text
RECOVERY
```

A code rollback may not undo:

- external messages;
- payments;
- physical production;
- migrated historical data.

---

# 68. Owner Decision

Every package should identify whether Owner decision is required.

Example:

```text
OWNER_DECISION_REQUIRED
NO
```

or:

```text
OWNER_DECISION_REQUIRED
YES

QUESTION
Should the new routing profile cover all repository governance work or only Engineering Control Plane changes?
```

---

# 69. Owner Decision Package

When Owner decision is required, include:

```text
QUESTION
OPTIONS
IMPACT
RISK
RECOMMENDED SAFE DEFAULT
```

Do not overwhelm the Owner with raw implementation detail.

---

# 70. Owner Decision Is Not Approval Evidence

A Change Package recording:

```text
OWNER DECISION
approved
```

does not automatically create trusted machine authorization.

Formal approval follows canonical Approval Policy where required.

---

# 71. Canonical Artifact Chain

Record expected canonical artifacts.

Example:

```text
IMPLEMENTATION_CONTRACT
IC-027

WORK_PACKAGES
- WP-027-A

ENGINEERING_REPORTS
- ER-027-A

ASSURANCE_REPORT
AR-027

VERIFICATION_MATRIX
VM-027
```

Only include artifacts that actually exist or are planned.

---

# 72. Artifact State

Report each artifact using its canonical state.

Example:

```text
IMPLEMENTATION_CONTRACT
READY_FOR_IMPLEMENTATION

WORK_PACKAGE
READY
```

Do not map them into custom Vibe package statuses.

---

# 73. Artifact Not Yet Created

Use:

```text
NOT_CREATED
```

as ordinary coordination prose, not as canonical schema value.

Example:

```text
ASSURANCE REPORT
not created yet
```

Do not put `NOT_CREATED` inside a schema field that does not allow it.

---

# 74. Builder Handoff

Before Builder execution, the package should be able to point to:

```text
canonical Implementation Contract
bounded Work Package
accepted baseline
target repository/workspace
```

The Change Package alone is insufficient implementation instruction.

---

# 75. Builder Prompt

A Builder prompt SHOULD tell the Builder to:

```text
consume the canonical Work Package
verify baseline
respect allowed/forbidden paths
run required checks
stop on declared stop conditions
produce Engineering Report/evidence
```

Avoid embedding a second divergent contract into the prompt.

---

# 76. Branch

Record expected branch where applicable.

Example:

```text
BRANCH
vecp-027-approval-hardening
```

Actual branch should also appear in canonical Work Package where required.

---

# 77. Worktree

Record expected worktree/workspace identity where useful.

Example:

```text
WORKTREE
assigned-feature-worktree
```

Worktree isolation does not imply database/environment isolation.

---

# 78. PR

After PR creation:

```text
PR
#27
```

may be recorded.

Also record:

```text
PR_BASE
main

PR_HEAD
<exact SHA>
```

when audit begins.

---

# 79. PR State

PR state is repository evidence.

Use actual observed values/prose.

Do not turn PR state into Change Package lifecycle.

---

# 80. Audit Result

A Change Package may summarize:

```text
ASSURANCE
SATISFIED

INDEPENDENCE
SELF_REVIEW
```

where those facts come from canonical Assurance Report.

It must not invent:

```text
READY_TO_MERGE
```

as a formal Vibe verdict.

---

# 81. Verification Result

Similarly mirror canonical Verification Matrix:

```text
VERIFICATION
PASS
```

when supported.

Do not write:

```text
FULL_PASS
```

as a new enum.

---

# 82. Owner-Facing Next Action

Package should always make the next safe action obvious.

Examples:

```text
NEXT GOVERNED ACTION
Create Implementation Contract.
```

```text
NEXT GOVERNED ACTION
Builder implementation.
```

```text
NEXT GOVERNED ACTION
Owner merge consideration.
```

```text
NEXT GOVERNED ACTION
Remediation required.
```

---

# 83. Blocked Package

If package cannot continue:

```text
VE_OBJECTIVE
VE_OBJECTIVE.BLOCKED
```

Then state:

```text
BLOCKER
<reason>
```

and relevant canonical/Vibe stop reason.

---

# 84. Routing Block Example

```text
VE_OBJECTIVE
VE_OBJECTIVE.BLOCKED

TARGET_SYSTEM
repository-engineering

ROUTING_PROFILE
NOT_AVAILABLE

STOP_REASON
VE_STOP.ROUTING_PROFILE_UNAVAILABLE
```

This is preferable to borrowing `mgbos`.

---

# 85. Baseline Block Example

```text
VE_OBJECTIVE
VE_OBJECTIVE.BLOCKED

PLANNING_BASELINE
abc123

CURRENT_MAIN
def456

STOP_REASON
VE_STOP.STALE_BASELINE
```

Then investigate whether the baseline actually requires amendment.

---

# 86. Deferred Findings

A package may identify findings outside current scope.

Use:

```text
DEFERRED_FINDINGS
```

Each should state:

```text
finding
reason deferred
risk
suggested future package
```

Do not silently ignore discovered debt.

---

# 87. Deferred Does Not Mean Accepted Risk

Deferral is a planning decision.

It does not automatically mean:

```text
ACCEPTED_RISK
```

Formal accepted risk must follow applicable canonical governance.

---

# 88. Non-Blocking Findings

Non-blocking findings may remain open if:

```text
they do not violate current acceptance
they do not create hidden consequential risk
their deferral is explicit
```

They should be traceable.

---

# 89. Completion

A Change Package may reach:

```text
VE_OBJECTIVE.COMPLETE
```

when:

```text
defined objective is satisfied
required canonical artifacts complete as applicable
required verification complete
blocking findings resolved/governed
integration verified where required
reflection recorded
```

---

# 90. Package Complete Does Not Mean Production Live

A repository-engineering package may complete after:

```text
merge + post-merge verification
```

without production deployment.

Do not conflate package completion with business/runtime rollout.

---

# 91. Post-Merge Result

Where repository integration is part of completion:

```text
POST_MERGE
VE_POST_MERGE.VERIFIED
```

may be recorded.

If blocked:

```text
POST_MERGE
VE_POST_MERGE.BLOCKED
```

with reason.

---

# 92. Final Reflection

Every meaningful completed package should record:

```text
WHAT CHANGED
WHAT WAS VERIFIED
WHAT REMAINS UNVERIFIED
NEW FINDINGS
ARCHITECTURE IMPACT
RISK IMPACT
ROADMAP IMPACT
NEXT PACKAGE
```

---

# 93. Reflection Should Be Shorter Than Implementation History

Reflection is not a transcript.

It should preserve decision-quality learning.

Do not duplicate all Builder logs.

---

# 94. Next Package

A completed package may nominate:

```text
NEXT_PACKAGE
VECP-028
```

This is a planning proposal until accepted.

Do not start automatically if material Owner decision is required.

---

# 95. Change Package Quality Standard

A high-quality package should let a new qualified session answer:

```text
Why does this work exist?

What repository state was reviewed?

What is currently true?

What should become true?

Which canonical sources govern it?

What routing applies?

What is the risk?

What is in scope?

What is explicitly out of scope?

What evidence is required?

What canonical artifacts implement it?

What stops execution?

What decision is needed?

What comes next?
```

without relying on old chat context.

---

# 96. Definition of Ready — Planning

A material package is ready to move toward implementation when:

```text
[ ] objective is explicit
[ ] planning baseline is known
[ ] target system is resolved
[ ] current state is evidence-backed
[ ] target state is explicit
[ ] canonical sources are resolved
[ ] dependency closure is sufficient
[ ] routing profile is valid
[ ] task type/concerns are resolved
[ ] effective risk is resolved
[ ] required roles are resolved
[ ] assurance requirement is resolved
[ ] scope is bounded
[ ] acceptance criteria are measurable
[ ] negative requirements exist where needed
[ ] planned checks are identified
[ ] evidence-mechanism impact is understood
[ ] Owner decisions are resolved or isolated
[ ] stop conditions are known
```

---

# 97. Definition of Ready — Execution

Do not hand off implementation until:

```text
[ ] canonical Implementation Contract exists where required
[ ] Implementation Contract is schema-valid
[ ] Implementation Contract is semantically valid
[ ] bounded Work Package exists where required
[ ] Work Package is schema-valid
[ ] Work Package is semantically valid
[ ] baseline is still current enough
[ ] Builder target workspace is known
[ ] no unresolved material authority conflict exists
```

---

# 98. Schema-Valid Is Not Enough

Definition of Ready MUST include semantic validation.

Example invalid combination:

```text
TARGET_SYSTEM
repository-engineering

ROUTING_PROFILE
mgbos
```

even if every field individually passes JSON Schema.

---

# 99. Definition of Done

A material Change Package is complete when:

```text
[ ] objective satisfied
[ ] actual implementation captured
[ ] required checks executed
[ ] required assurance completed
[ ] required verification completed
[ ] blocking findings resolved or governed
[ ] repository integration completed if in scope
[ ] post-integration verification completed if required
[ ] reflection recorded
[ ] next action/package explicit
```

---

# 100. Change Package Template

Use the following as the default human-readable template.

```markdown
# VECP-___ — <Package Title>

## 1. Coordination

VE_OBJECTIVE: VE_OBJECTIVE.OPEN

PROGRAM:
<program / roadmap / system>

CANONICAL_PROGRAM_ITEM:
<if applicable>

OWNER:
Rizky

SESSION:
VE_SESSION.NEW_WORK

ACTIVE_ROLE:
planner

---

## 2. Objective

OBJECTIVE:

<one bounded outcome>

WHY_NOW:

<why this package is needed now>

NON_GOALS:

- ...
- ...

---

## 3. Repository Baseline

REPOSITORY:
Rizkybuilds/bisnishub

PLANNING_BASELINE:
<full SHA>

BASELINE_SOURCE:
origin/main

TARGET_SYSTEM:
<mgbos | jarvis | kaskita | repository-engineering | ...>

TARGET_WORKSPACE:
<path>

---

## 4. Current State

CURRENT:

- ...
- ...
- ...

EVIDENCE:

- ...
- ...

---

## 5. Target State

TARGET:

- ...
- ...
- ...

---

## 6. Reflection to Plan

PREVIOUS_RELEVANT_PACKAGE:

<package / PR / none>

WHAT_WAS_PROVEN:

- ...

WHAT_REMAINS_UNPROVEN:

- ...

LESSONS:

- ...

WHY_THIS_PACKAGE_IS_NEXT:

- ...

---

## 7. Canonical Authority

CANONICAL_SOURCES:

- ...
- ...
- ...

SOURCE_CLASSIFICATION_NOTES:

- ...

---

## 8. Fresh Audit

F-001
<finding>

F-002
<finding>

ROOT_CAUSE:
<if applicable>

SIBLING_RISK:
<none / description>

---

## 9. Dependency Closure

DIRECT_DEPENDENCIES:

- ...

REVERSE_REFERENCES:

- ...

SCHEMAS:

- ...

TESTS:

- ...

VALIDATORS:

- ...

CI:

- ...

DOCS:

- ...

RUNTIME:

- ...

UNRESOLVED_DEPENDENCIES:

- none

---

## 10. Routing

ROUTING_PROFILE:
<profile | NOT_AVAILABLE>

PRIMARY_TASK_TYPE:
<registered task type | UNRESOLVED>

CONCERNS:

- ...

EFFECTIVE_RISK:
<R0-R5 | UNRESOLVED>

RISK_RATIONALE:

- ...

REQUIRED_ROLES:

- planner
- engineer
- auditor
- qa

REQUIRED_EXPERTISE:

- ...

SKILL_CANDIDATES:

- ...

ASSURANCE_REQUIREMENT:
<NONE | PROPORTIONAL | REQUIRED | INDEPENDENT_REQUIRED>

---

## 11. Scope

IN_SCOPE:

- ...

OUT_OF_SCOPE:

- ...

EXPECTED_ALLOWED_PATHS:

- ...

EXPECTED_FORBIDDEN_PATHS:

- ...

---

## 12. Invariants

- ...
- ...
- ...

---

## 13. Acceptance Criteria

AC-001
...

AC-002
...

NEGATIVE_REQUIREMENTS:

AC-NEG-001
...

---

## 14. Planned Verification

CHK-001
...

CHK-002
...

EVIDENCE_MECHANISM_CHANGED:
<YES | NO>

SELF_VALIDATION_RISK:
<YES | NO>

---

## 15. Authority / Environment

ENVIRONMENT:
<local / CI / staging / production / mixed>

REMOTE_MUTATION:
<YES | NO>

PRODUCTION_MUTATION:
<YES | NO>

PERMISSION_IMPACT:
...

APPROVAL_IMPACT:
...

SECURITY_BOUNDARY:
...

BUSINESS_AUTHORITY_BOUNDARY:
...

---

## 16. Recovery

ROLLBACK:
...

RECOVERY:
...

RECONCILIATION:
...

---

## 17. Owner Decision

OWNER_DECISION_REQUIRED:
<YES | NO>

QUESTION:
<if required>

OPTIONS:

1. ...
2. ...

RECOMMENDED_SAFE_DEFAULT:
...

---

## 18. Canonical Artifacts

IMPLEMENTATION_CONTRACT:
<id / not created>

WORK_PACKAGES:

- ...

ENGINEERING_REPORTS:

- ...

ASSURANCE_REPORT:
...

VERIFICATION_MATRIX:
...

RELEASE_PACKET:
...

---

## 19. Execution Tracking

BRANCH:
...

WORKTREE:
...

PR:
...

PR_BASE:
...

PR_HEAD:
...

---

## 20. Findings / Deferred Work

OPEN_FINDINGS:

- ...

DEFERRED_FINDINGS:

- ...

---

## 21. Current Coordination Result

VE_OBJECTIVE:
VE_OBJECTIVE.OPEN

BLOCKER:
none

STOP_REASON:
none

NEXT_GOVERNED_ACTION:
...

---

## 22. Completion

ACTUAL_RESULT:
...

POST_MERGE:
<VE_POST_MERGE.VERIFIED | VE_POST_MERGE.BLOCKED | not applicable>

WHAT_WAS_VERIFIED:

- ...

WHAT_REMAINS_UNVERIFIED:

- ...

---

## 23. Reflection

WHAT_CHANGED:

- ...

LESSONS:

- ...

ARCHITECTURE_IMPACT:
...

RISK_IMPACT:
...

ROADMAP_IMPACT:
...

NEXT_PACKAGE:
...
```

---

# 101. Template Sections May Be Omitted Proportionally

Not every package needs every field.

For low-risk work, sections may be shortened.

Never omit a field that is material to safety or authority merely to make the package shorter.

---

# 102. Do Not Populate Unknown Values With Guesses

If unknown:

```text
UNRESOLVED
NOT VERIFIED
NOT AVAILABLE
```

may be used as human coordination prose where appropriate.

Do not fabricate values.

---

# 103. Unknown Routing Is Blocking for Governed Implementation

Example:

```text
ROUTING_PROFILE
NOT_AVAILABLE

VE_OBJECTIVE
VE_OBJECTIVE.BLOCKED

STOP_REASON
VE_STOP.ROUTING_PROFILE_UNAVAILABLE
```

This is a valid package state.

---

# 104. Unknown Risk Is Not R0

Never write:

```text
EFFECTIVE_RISK
R0
```

because classification is unclear.

Use:

```text
EFFECTIVE_RISK
UNRESOLVED
```

and stop consequential planning/execution until resolved.

---

# 105. Package Amendment

When material planning changes after acceptance:

```text
record amendment
```

Do not silently rewrite history.

A package may preserve:

```text
AMENDMENT
A1
```

with:

```text
reason
changed assumption
changed scope
affected artifacts
new baseline if applicable
```

---

# 106. Contract Amendment

If package changes affect canonical Implementation Contract:

amend/supersede that canonical artifact according to contract semantics.

Changing only the Vibe Change Package is insufficient.

---

# 107. Work Package Amendment

Likewise, scope/writer/baseline changes that affect Work Package must update the canonical Work Package.

The coordination layer must never contradict the execution layer.

---

# 108. Package and PR Drift

If the PR contains files outside accepted package/contract scope:

```text
do not update package after the fact to make the diff look compliant
```

Investigate why scope changed.

Use remediation/amendment appropriately.

---

# 109. Evidence Drift

If evidence applies to older revision:

label it stale.

Do not rewrite the Change Package summary to imply it covers the latest candidate.

---

# 110. Package Closure Report

At closure, summarize:

```text
VECP ID

OBJECTIVE

FINAL REPOSITORY REVISION

PR

CANONICAL ARTIFACTS

ASSURANCE

VERIFICATION

POST-MERGE RESULT

OPEN DEBT

NEXT PACKAGE
```

Keep it concise.

---

# 111. Owner-Facing Package Summary

The Owner should be able to read:

```text
WHAT WE ARE DOING
WHY
RISK
CURRENT RESULT
WHAT WAS VERIFIED
BLOCKER
DECISION
NEXT STEP
```

without reading every technical section.

---

# 112. Builder-Facing Information

Builder should primarily consume:

```text
Implementation Contract
+
Work Package
+
relevant canonical sources
```

not this entire Change Package unless additional coordination context is useful.

This preserves minimum sufficient context.

---

# 113. Auditor-Facing Information

Auditor may use Change Package for:

```text
intent
roadmap
reflection
scope context
```

but must audit:

```text
actual candidate
canonical contract
exact revision
evidence
```

rather than package narrative alone.

---

# 114. QA-Facing Information

QA should use:

```text
acceptance criteria IDs
planned checks
Verification Matrix requirements
actual candidate revision
```

The Change Package is context, not executable test evidence.

---

# 115. Release-Facing Information

Release Operator should use:

```text
canonical Release Packet
Verification Matrix
Assurance Report
environment controls
authorization
```

rather than package completion label.

---

# 116. Documentation Package

A documentation-only package should still distinguish whether it changes:

```text
wording only
```

or:

```text
normative semantics
```

A Markdown governance change may be high consequence even without runtime code.

---

# 117. Governance Package

A package modifying:

```text
routing
roles
permission
approval
contracts
validators
gateway
CI governance
```

should mark:

```text
EVIDENCE_MECHANISM_CHANGED
YES
```

when applicable and include bypass-oriented review.

---

# 118. Migration Package

Database migration planning should include:

```text
current schema
target schema
upgrade path
migration ordering
compatibility
forward recovery
tests
```

Do not plan only from clean database creation.

---

# 119. Security Package

Security package planning should include:

```text
threat / boundary
positive authorization
negative authorization
bypass paths
least privilege
environment
secrets
auditability
```

where relevant.

---

# 120. AI / Agent Package

AI engineering package planning should include:

```text
structured contracts
tool boundary
untrusted context
prompt injection
provider failure
behavioral evidence
authority
```

according to actual scope.

---

# 121. External-Side-Effect Package

If implementation can trigger real external effects:

explicitly identify:

```text
test isolation
sandbox/provider mode
idempotency
unknown outcome handling
verification
reconciliation
```

before execution.

---

# 122. Completion Anti-Pattern

Do not write:

```text
VE_OBJECTIVE.COMPLETE
```

because:

```text
Builder finished coding
```

alone.

Completion requires the package's actual completion standard.

---

# 123. Planning Anti-Pattern

Do not create a huge package simply because all work belongs to the same project.

Package boundaries follow:

```text
reviewability
dependency
risk
architecture
```

not just project name.

---

# 124. Scope Anti-Pattern

Do not define scope as:

```text
anything required to make it work
```

That defeats bounded execution.

---

# 125. Evidence Anti-Pattern

Do not plan:

```text
run all tests
```

without identifying which evidence is actually required.

Full suites may still be useful.

Focused failure-mode evidence should remain explicit.

---

# 126. Owner-Decision Anti-Pattern

Do not ask Owner:

```text
Should we use function X or class Y?
```

unless that technical choice materially affects Owner responsibility.

Engineering system should make routine technical decisions inside accepted constraints.

---

# 127. Risk Anti-Pattern

Do not lower risk because:

```text
only docs changed
```

if those docs redefine:

- permission;
- approval;
- architecture;
- routing;
- production behavior.

Semantic consequence matters.

---

# 128. Final Invariants

Every material Vibe Change Package MUST preserve:

```text
VECP IS COORDINATION, NOT EXECUTION AUTHORITY

TARGET SYSTEM BEFORE ROUTING PROFILE

NO BORROWED ROUTING PROFILE

NO UNKNOWN-AS-R0

NO SILENT SCOPE EXPANSION

NO SILENT RISK DOWNGRADE

NO PROVIDER-AS-AUTHORITY

NO CHANGE-PACKAGE STATE COMPETING WITH CONTRACT STATES

NO SELF-ASSERTED APPROVAL AS AUTHORIZATION

NO PLAN PRESENTED AS EXECUTED EVIDENCE

NO STALE EVIDENCE PRESENTED AS CURRENT

NO SELF-VALIDATING GOVERNANCE TRUSTED ALONE

REFLECTION BEFORE NEXT MATERIAL PACKAGE
```

---

# 129. Final Principle

The Change Package exists to make the work understandable and governable before implementation begins.

Its purpose is not to create more paperwork.

Its purpose is to answer:

```text
WHY THIS?

WHY NOW?

WHAT IS TRUE?

WHAT MUST CHANGE?

WHAT GOVERNS IT?

WHAT CAN WE TOUCH?

WHAT MUST WE NOT TOUCH?

WHAT PROVES SUCCESS?

WHAT WOULD MAKE US STOP?

WHAT DECISION DOES THE OWNER ACTUALLY NEED TO MAKE?

WHAT CAN THE BUILDER SAFELY EXECUTE NEXT?
```

When those answers are clear, the canonical execution contracts can remain small, precise, and machine-valid.

That is the role of the Vibe Engineering Change Package.