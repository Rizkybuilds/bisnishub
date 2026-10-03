---
canonical_id: docs.engineering.vibe-engineering.state-and-vocabulary
status: ACTIVE
version: 1.1.1
owner: Rizky
author: OpenAI / ChatGPT
approver: Rizky
scope: repository-engineering
document_class: standard
effective_from: 2026-10-03

authoritative_for:
  - vibe engineering local coordination vocabulary
  - vibe engineering namespace rules
  - vibe engineering session vocabulary
  - vibe engineering procedure-phase vocabulary
  - vibe engineering continuity vocabulary
  - vibe engineering post-merge coordination vocabulary
  - vibe engineering coordination stop reasons
  - vibe engineering vocabulary ownership boundaries
  - vibe engineering legacy-term migration guidance

last_reviewed: 2026-10-03
reviewed_against_revision: 26871da802706fba5bc033576fbb0a487f6c9255
review_cadence: quarterly

depends_on:
  - ../../governance/documentation-constitution.md
  - ../../governance/canonical-source-map.md
  - ../../governance/cross-system-risk-classification.md
  - ../../governance/evidence-provenance-model.md
  - ../../governance/approval-policy.md
  - ../engineering-ai-control-plane.md
  - ../runtime-adapter-architecture.md
  - ../../../.agents/contracts/README.md
  - ../../../.agents/routing/README.md
  - ../../../.agents/capabilities/README.md

supersedes: null
---

# Vibe Engineering State & Vocabulary

## 1. Purpose

This document defines only the vocabulary that is locally owned by Vibe Engineering.

Its purpose is to prevent:

- semantic duplication;
- accidental creation of competing lifecycle states;
- ambiguous uppercase tokens;
- provider-specific terminology from becoming governance;
- session terminology from being confused with canonical engineering artifacts;
- and procedure-specific results from being mistaken for repository, runtime, assurance, or business truth.

The governing principle is:

> **Vibe Engineering may define vocabulary only for concepts that are genuinely local to the Vibe Engineering operating method.**

Everything else MUST defer to its canonical upstream owner.

---

# 2. Vocabulary Ownership Boundary

Vibe Engineering does **not** own the canonical vocabulary for:

```text
risk
engineering roles
expertise
skills
routing
assurance
finding severity
contract lifecycle
work-package lifecycle
engineering-report status
verification status
release recommendation
permission
approval
autonomy
capability
business state
runtime business state
```

Those concepts are already owned elsewhere.

Vibe Engineering MUST consume them.

It MUST NOT redefine them.

---

# 3. Canonical Upstream Owners

## Risk

Owned by:

```text
docs/governance/cross-system-risk-classification.md
```

Canonical risk values:

```text
R0
R1
R2
R3
R4
R5
```

Vibe Engineering MUST NOT create:

```text
LOW_RISK
MEDIUM_RISK
HIGH_RISK
CRITICAL_RISK
```

as competing engineering risk classes.

Human-facing prose may describe risk qualitatively, but machine-oriented engineering artifacts MUST preserve canonical risk semantics.

---

## Engineering Roles

Owned by:

```text
docs/engineering/engineering-ai-control-plane.md
.agents/roles/contracts.json
```

Current canonical roles:

```text
planner
engineer
auditor
qa
release-operator
```

Vibe concepts such as:

```text
Head Engineering
Builder
```

are operating functions.

They are not replacement canonical roles.

---

## Assurance

Owned by:

```text
.agents/contracts/README.md
.agents/contracts/assurance-report.schema.json
.agents/routing/README.md
```

Canonical assurance-report independence values:

```text
INDEPENDENT
SELF_REVIEW
NOT_APPLICABLE
```

Canonical assurance requirements used by routing include:

```text
NONE
PROPORTIONAL
REQUIRED
INDEPENDENT_REQUIRED
```

These answer different questions.

Do not mix them.

---

## Verification

Owned by:

```text
.agents/contracts/verification-matrix.schema.json
```

Canonical overall verification states currently include:

```text
PASS
FAIL
BLOCKED
PARTIAL
NOT_RUN
```

Vibe Engineering MUST NOT replace these with:

```text
LOCAL_PASS
FULL_PASS
VERIFIED_OK
ALL_GREEN
```

as competing formal verification results.

---

## Release Recommendation

Owned by:

```text
.agents/contracts/release-packet.schema.json
```

Current canonical recommendation values:

```text
READY_FOR_AUTHORIZED_RELEASE
NOT_READY
BLOCKED
```

Vibe Engineering MUST NOT create a competing formal release verdict such as:

```text
READY_TO_MERGE
APPROVED_TO_RELEASE
SHIP_IT
```

---

## Contract Lifecycle

Owned by canonical Engineering Execution Contract schemas.

### Implementation Contract

Current canonical state values:

```text
PLANNED
READY_FOR_IMPLEMENTATION
BLOCKED
SUPERSEDED
CANCELLED
```

### Work Package

Current canonical state values:

```text
READY
IN_PROGRESS
BLOCKED
COMPLETED
SUPERSEDED
CANCELLED
```

### Engineering Report

Current canonical status values:

```text
COMPLETED
PARTIAL
BLOCKED
FAILED
```

Vibe Engineering MUST NOT create parallel lifecycle values for those artifacts.

---

# 4. Why Namespaces Are Required

Vibe Engineering contains method-specific concepts such as:

- session type;
- procedure phase;
- continuity result;
- post-merge coordination result;
- objective state;
- roadmap coordination state;
- method-specific stop reasons.

These concepts may legitimately need formal tokens.

To avoid collision with canonical repository vocabulary, every Vibe-owned formal token MUST use a Vibe namespace.

Canonical format:

```text
VE_<CATEGORY>.<TOKEN>
```

Examples:

```text
VE_SESSION.NEW_WORK
VE_CONTINUITY.CONFIRMED
VE_STOP.STALE_BASELINE
VE_POST_MERGE.VERIFIED
```

Do not create unnamespaced Vibe-specific machine-like tokens.

---

# 5. Formal Token Rule

If a term is written as a formal uppercase operational identifier, it MUST satisfy one of these conditions:

```text
1. it is owned by an upstream canonical source;
or
2. it is explicitly defined in this document under a VE_* namespace.
```

Otherwise use ordinary prose.

Forbidden pattern:

```text
MAGIC_REVIEW_DONE
```

with no canonical owner or namespace.

Preferred:

```text
review completed for the observed revision
```

until a formal vocabulary need actually exists.

---

# 6. Human Prose vs Machine-Oriented Vocabulary

Human prose may say:

```text
the PR is ready for Owner consideration
```

without creating a formal enum.

Machine-oriented or repeatable operational output SHOULD use canonical fields.

Example:

```text
ASSURANCE STATUS
SATISFIED

VERIFICATION STATUS
PASS

RELEASE RECOMMENDATION
READY_FOR_AUTHORIZED_RELEASE
```

when those exact artifacts and semantics apply.

Do not create a Vibe-specific replacement merely to make reports look simpler.

---

# 7. Vibe Session Type

Namespace:

```text
VE_SESSION
```

Canonical Vibe session types:

```text
VE_SESSION.NEW_WORK
VE_SESSION.CONTINUATION
VE_SESSION.PR_AUDIT
VE_SESSION.REMEDIATION
VE_SESSION.POST_MERGE
VE_SESSION.RESEARCH
VE_SESSION.INCIDENT
VE_SESSION.RELEASE_PREPARATION
```

These classify the current Vibe procedure.

They do not grant authority.

They do not determine risk.

They do not determine role automatically.

---

# 8. `VE_SESSION.NEW_WORK`

Use when:

- a new engineering objective is being established;
- no accepted active implementation package already governs the work;
- or an existing idea must be converted into governed engineering work.

Typical sequence:

```text
restore repository truth
→ resolve authority
→ inspect current state
→ resolve routing
→ plan
→ create canonical execution artifacts
```

---

# 9. `VE_SESSION.CONTINUATION`

Use when engineering work already exists and the session resumes after:

- chat loss;
- context compression;
- time gap;
- new conversation;
- runtime change;
- provider change;
- or operator handoff.

A continuation MUST re-establish current repository reality.

It MUST NOT rely only on remembered state.

---

# 10. `VE_SESSION.PR_AUDIT`

Use when auditing an actual pull request or equivalent candidate integration revision.

Required identity normally includes:

```text
PR identity
PR base
PR head
actual diff
relevant contract
current evidence
```

PR Audit does not mean:

```text
merge authorized
```

---

# 11. `VE_SESSION.REMEDIATION`

Use when corrective work is required because of:

- failed verification;
- assurance findings;
- CI failure;
- architecture conflict;
- scope defect;
- regression;
- or post-integration defect.

Remediation does not automatically reopen unlimited scope.

---

# 12. `VE_SESSION.POST_MERGE`

Use after repository integration when determining whether the integrated state remains valid.

It is distinct from:

```text
PR audit
release verification
production verification
```

---

# 13. `VE_SESSION.RESEARCH`

Use for:

- architecture investigation;
- repository exploration;
- provider research;
- design comparison;
- feasibility study;
- or information gathering.

Research output is not implementation evidence.

Research does not create execution authority.

---

# 14. `VE_SESSION.INCIDENT`

Use when active engineering work is responding to an unexpected operational or engineering failure requiring incident-style handling.

Incident procedure MUST still respect applicable canonical:

- authority;
- risk;
- environment;
- recovery;
- evidence;
- and emergency policy.

The label itself grants nothing.

---

# 15. `VE_SESSION.RELEASE_PREPARATION`

Use when preparing evidence, checks, recovery information, or canonical Release Packet material.

Release preparation does not equal:

```text
release execution
```

and does not grant release authority.

---

# 16. Procedure Phase

Namespace:

```text
VE_PHASE
```

Vibe procedure phases:

```text
VE_PHASE.RESTORE
VE_PHASE.AUDIT
VE_PHASE.ROUTE
VE_PHASE.PLAN
VE_PHASE.IMPLEMENT
VE_PHASE.ASSURE
VE_PHASE.VERIFY
VE_PHASE.INTEGRATE
VE_PHASE.POST_INTEGRATION
VE_PHASE.REFLECT
```

These phases are procedural coordinates.

They are not canonical artifact states.

---

# 17. `VE_PHASE.RESTORE`

Purpose:

```text
re-establish current repository and session truth
```

May include:

- repository identity;
- current branch;
- main revision;
- worktree status;
- open PR state;
- prior package references;
- unresolved findings;
- current CI;
- active routing profile.

---

# 18. `VE_PHASE.AUDIT`

Purpose:

```text
inspect current reality before planning or changing it
```

This may include:

- implementation state;
- architecture;
- documentation;
- dependencies;
- reverse references;
- tests;
- validators;
- schemas;
- runtime constraints.

---

# 19. `VE_PHASE.ROUTE`

Purpose:

```text
resolve applicable canonical engineering controls
```

May include:

- target system;
- routing profile;
- task type;
- concerns;
- roles;
- expertise;
- effective risk;
- assurance requirements;
- skill candidates.

If no valid matching profile exists:

```text
VE_STOP.ROUTING_PROFILE_UNAVAILABLE
```

---

# 20. `VE_PHASE.PLAN`

Purpose:

```text
convert accepted objective into bounded governed engineering work
```

Outputs may include:

- Change Package coordination record;
- Implementation Contract;
- Work Package;
- Owner decision request.

---

# 21. `VE_PHASE.IMPLEMENT`

Purpose:

```text
perform bounded implementation under the active canonical engineer role
```

Implementation is governed by:

- accepted contract;
- Work Package;
- scope;
- baseline;
- risk;
- stop conditions;
- current permission.

---

# 22. `VE_PHASE.ASSURE`

Purpose:

```text
perform applicable engineering review / assurance
```

Assurance terminology MUST use canonical contract semantics.

Do not create Vibe-specific independence levels.

---

# 23. `VE_PHASE.VERIFY`

Purpose:

```text
evaluate required acceptance and verification evidence
```

Formal Verification Matrix semantics remain canonical upstream.

---

# 24. `VE_PHASE.INTEGRATE`

Purpose:

```text
coordinate candidate integration or authorized release preparation
```

This phase does not itself grant merge or release authority.

---

# 25. `VE_PHASE.POST_INTEGRATION`

Purpose:

```text
verify repository integration state after merge
```

This is method-specific repository coordination.

It is not a replacement for runtime or production verification.

---

# 26. `VE_PHASE.REFLECT`

Purpose:

```text
feed verified learning into future planning
```

Reflection may update:

- roadmap understanding;
- next package;
- known debt;
- architectural findings;
- documentation needs;
- unresolved risk.

Reflection MUST NOT rewrite old evidence.

---

# 27. Continuity Result

Namespace:

```text
VE_CONTINUITY
```

Canonical values:

```text
VE_CONTINUITY.CONFIRMED
VE_CONTINUITY.BLOCKED
```

Keep this vocabulary intentionally small.

---

# 28. `VE_CONTINUITY.CONFIRMED`

Means:

> The observed repository/session state is sufficiently reconciled with the expected work context to continue the requested procedure.

It does not mean:

```text
tests pass
CI passes
implementation is correct
release is safe
```

Continuity confirms context consistency only.

---

# 29. `VE_CONTINUITY.BLOCKED`

Means:

> Material inconsistency or missing evidence prevents safe continuation.

The specific reason MUST be provided.

Example:

```text
VE_CONTINUITY.BLOCKED

STOP_REASON
VE_STOP.STALE_BASELINE
```

---

# 30. Vibe Stop Namespace

Namespace:

```text
VE_STOP
```

Vibe Engineering owns only method-specific coordination stops.

Canonical Vibe stop reasons:

```text
VE_STOP.ROUTING_PROFILE_UNAVAILABLE
VE_STOP.STALE_BASELINE
VE_STOP.PR_HEAD_CHANGED
VE_STOP.UNEXPECTED_PR_BASE
VE_STOP.PR_NOT_FOUND
VE_STOP.MERGE_NOT_CONFIRMED
VE_STOP.POST_MERGE_INTERFERENCE
```

Upstream canonical stop conditions MUST keep their upstream names.

Do not prepend `VE_STOP` to an upstream-owned token.

---

# 31. Upstream Stop Conditions

Common upstream routing/system stop conditions may include:

```text
CANONICAL_CONFLICT
UNKNOWN_HIGH_RISK
SCOPE_EXPANSION_REQUIRED
REQUIRED_SOURCE_MISSING
PERMISSION_UNCLEAR
ENVIRONMENT_UNVERIFIED
REQUIRED_EVIDENCE_UNAVAILABLE
UNRELATED_WORK_COLLISION
SECURITY_BOUNDARY_UNCLEAR
DEPENDENCY_UNRESOLVED
```

These are examples of upstream-owned terms.

Vibe Engineering consumes them.

It does not redefine their semantics here.

---

# 32. `VE_STOP.ROUTING_PROFILE_UNAVAILABLE`

Use when:

- Vibe procedure requires governed routing;
- the target system has been identified;
- but no active matching routing profile exists.

Correct response:

```text
STOP GOVERNED IMPLEMENTATION
```

The system MAY continue with:

- research;
- planning;
- gap analysis;
- proposal preparation;
- or governed work to introduce the missing profile through existing repository governance.

Forbidden response:

```text
borrow an unrelated profile
```

---

# 33. `VE_STOP.STALE_BASELINE`

Use when the accepted baseline no longer matches the baseline required for the planned action.

Examples:

```text
main advanced materially
contract bound SHA no longer matches execution context
remediation starts from unexpected revision
```

This stop does not automatically mean all previous work is invalid.

It means baseline reconciliation is required.

---

# 34. `VE_STOP.PR_HEAD_CHANGED`

Use when a PR head changes after the revision that was audited or verified.

Implication:

```text
previous revision-bound assurance may be stale
```

Affected review/verification must be reconsidered.

---

# 35. `VE_STOP.UNEXPECTED_PR_BASE`

Use when the actual PR base is inconsistent with the intended integration target or accepted plan.

Do not silently audit against the wrong base.

---

# 36. `VE_STOP.PR_NOT_FOUND`

Use when the expected PR cannot be authoritatively identified.

Do not substitute:

- another PR;
- remembered diff;
- local branch;
- or implementation summary.

---

# 37. `VE_STOP.MERGE_NOT_CONFIRMED`

Use when post-merge procedure was requested but authoritative repository evidence does not confirm the expected integration.

Examples:

```text
PR still open
PR closed without merge
wrong PR
merge status unavailable
```

Do not infer merge from user wording alone.

---

# 38. `VE_STOP.POST_MERGE_INTERFERENCE`

Use when later integrated changes materially overlap or may invalidate the package being verified.

This stop means:

```text
additional review required
```

not:

```text
later change is necessarily defective
```

---

# 39. Stop Reason Is Not Status

A stop reason answers:

> Why can this procedure not safely continue?

It does not answer:

> What is the canonical state of the Implementation Contract?

Do not write:

```text
Implementation Contract state:
VE_STOP.STALE_BASELINE
```

Use the actual schema-defined contract state.

The stop reason belongs in procedure context or applicable artifact fields where supported.

---

# 40. Post-Merge Coordination Result

Namespace:

```text
VE_POST_MERGE
```

Canonical values:

```text
VE_POST_MERGE.VERIFIED
VE_POST_MERGE.BLOCKED
```

---

# 41. `VE_POST_MERGE.VERIFIED`

Means:

> Repository integration was authoritatively confirmed and required Vibe post-merge checks produced sufficient evidence for the integration-level claim being made.

It does **not** automatically mean:

```text
production deployed
runtime healthy
business outcome verified
```

Those require their own evidence.

---

# 42. `VE_POST_MERGE.BLOCKED`

Means:

> The method cannot currently support the expected post-merge conclusion.

Possible reasons include:

```text
VE_STOP.MERGE_NOT_CONFIRMED
VE_STOP.POST_MERGE_INTERFERENCE
missing required evidence
failed repository checks
```

Use the actual relevant reason.

---

# 43. Objective Coordination

Namespace:

```text
VE_OBJECTIVE
```

Canonical coordination values:

```text
VE_OBJECTIVE.OPEN
VE_OBJECTIVE.BLOCKED
VE_OBJECTIVE.COMPLETE
```

These are optional human coordination labels.

They MUST NOT replace canonical artifact states.

---

# 44. `VE_OBJECTIVE.OPEN`

Means:

> The human engineering objective remains active.

It says nothing about individual artifact readiness.

---

# 45. `VE_OBJECTIVE.BLOCKED`

Means:

> Progress on the overall objective cannot continue until a material dependency, decision, authority, or evidence issue is resolved.

The reason must be explicit.

---

# 46. `VE_OBJECTIVE.COMPLETE`

Means:

> The defined engineering objective has satisfied its completion criteria at the operating-method level.

It MUST NOT be used when required canonical artifacts remain unresolved.

Completion does not automatically imply production deployment.

---

# 47. Roadmap Coordination

Namespace:

```text
VE_ROADMAP
```

Optional coordination values:

```text
VE_ROADMAP.PLANNED
VE_ROADMAP.ACTIVE
VE_ROADMAP.BLOCKED
VE_ROADMAP.COMPLETE
VE_ROADMAP.DEFERRED
```

These are Vibe planning coordinates.

They do not replace repository-specific roadmap semantics.

If a target system has its own canonical roadmap vocabulary, that roadmap remains authoritative.

---

# 48. Change Package Vocabulary

`Change Package` is a Vibe Engineering coordination object.

It is not one of the canonical Engineering Execution Contract artifacts.

Canonical short form:

```text
CP
```

A Change Package MAY reference:

```text
Implementation Contract
Work Package
Engineering Report
Assurance Report
Verification Matrix
Release Packet
PR
merge SHA
roadmap item
```

Do not invent a separate machine lifecycle that competes with those artifacts.

---

# 49. Change Package Status Guidance

Vibe Engineering SHOULD avoid a large formal Change Package state machine.

When human coordination requires a concise status, prefer the generic objective vocabulary:

```text
VE_OBJECTIVE.OPEN
VE_OBJECTIVE.BLOCKED
VE_OBJECTIVE.COMPLETE
```

and separately report canonical artifact states.

Example:

```text
CHANGE PACKAGE
CP-027

VE_OBJECTIVE
VE_OBJECTIVE.OPEN

IMPLEMENTATION CONTRACT
READY_FOR_IMPLEMENTATION

WORK PACKAGE
IN_PROGRESS
```

This is clearer than inventing:

```text
PACKAGE_STATUS.UNDER_AUDIT
PACKAGE_STATUS.READY_TO_MERGE
```

---

# 50. Do Not Recreate Legacy Package Lifecycle

Vibe Engineering v1.0 used or discussed terms such as:

```text
RESEARCHING
READY_TO_IMPLEMENT
IMPLEMENTING
LOCAL_PASS
PR_CREATED
UNDER_AUDIT
REMEDIATION_REQUIRED
READY_TO_MERGE
MERGED
POST_MERGE_VERIFIED
POST_MERGE_FAILURE
```

These MUST NOT be reintroduced as a competing canonical Change Package lifecycle.

Some lexical values may legitimately exist upstream in other semantic categories.

Their meaning comes from that upstream owner.

---

# 51. `LOCAL_PASS` Is Not a Vibe State

Do not use:

```text
LOCAL_PASS
```

as Vibe package status.

Instead preserve actual evidence.

Example:

```text
ENGINEERING REPORT
COMPLETED

CHECK
unit-tests
PASS
```

or the applicable canonical artifact representation.

---

# 52. `CI_PASS` Is Not a Vibe State

Do not use:

```text
CI_PASS
```

as a package lifecycle state.

CI is evidence.

Record:

- workflow/check identity;
- revision;
- conclusion;
- environment;
- timestamp or evidence reference where applicable.

A green CI result does not become release permission.

---

# 53. `MERGED` Is Repository Evidence, Not Vibe Lifecycle Authority

Repository integration is an observed repository fact.

Record:

```text
PR
MERGED

MERGE SHA
<sha>
```

when authoritative evidence supports it.

Do not make `MERGED` a Vibe package lifecycle enum.

---

# 54. `POST_MERGE_VERIFIED`

Legacy unnamespaced:

```text
POST_MERGE_VERIFIED
```

is deprecated as a Vibe-specific formal token.

Use:

```text
VE_POST_MERGE.VERIFIED
```

for Vibe repository-integration coordination.

Use canonical runtime/verification artifacts for stronger claims.

---

# 55. `READY_TO_MERGE`

Vibe Engineering MUST NOT define:

```text
READY_TO_MERGE
```

as its own canonical audit verdict.

Where appropriate, Owner-facing prose may say:

> No blocking engineering finding remains for the reviewed candidate and the next authorized action is merge consideration.

But formal machine-consumed semantics must come from canonical:

- Assurance Report;
- Verification Matrix;
- repository checks;
- Release Packet where applicable;
- approval/permission policy.

---

# 56. Review Independence Vocabulary

Do not create:

```text
HEAD_REVIEW
CROSS_AGENT_REVIEW
AI_INDEPENDENT_REVIEW
SEMI_INDEPENDENT
```

as competing formal assurance modes.

Use upstream canonical:

```text
INDEPENDENT
SELF_REVIEW
NOT_APPLICABLE
```

The Head function may perform audit work.

That does not create a new independence class.

---

# 57. Head Function Vocabulary

Canonical Vibe operating term:

```text
HEAD_FUNCTION
```

Meaning:

> Coordination function responsible for restoring context, planning, orchestration, review coordination, and Owner-facing engineering synthesis.

It is not a canonical Engineering Control Plane role.

At each governed execution point, an actual canonical role must be explicit where role-governed action is occurring.

---

# 58. Builder Function Vocabulary

Canonical Vibe operating term:

```text
BUILDER_FUNCTION
```

Meaning:

> The implementation function executing bounded engineering work under the canonical `engineer` role.

Current runtime mappings may change.

Provider/runtime identity does not change Builder authority.

---

# 59. Provider Vocabulary

Provider names such as:

```text
OpenAI
Google
Anthropic
```

describe provider identity only.

Runtime names such as:

```text
ChatGPT
Antigravity
Codex
Claude Code
Hermes
```

describe execution/runtime context.

Neither should be encoded as canonical engineering roles.

---

# 60. Owner Vocabulary

Canonical Vibe term:

```text
OWNER
```

Current accountable Owner:

```text
Rizky
```

Owner identifies the human decision/accountability position in the method.

It does not redefine approval semantics owned by canonical Approval Policy.

---

# 61. Current / Target / Proposed

Use Documentation Constitution maturity terminology:

```text
CURRENT
TARGET
PROPOSED
EXPERIMENTAL
NOT VERIFIED
```

Do not substitute informal equivalents in architecture claims.

Examples:

```text
CURRENT
MGBOS routing profile exists.
```

```text
TARGET
repository-engineering routing profile.
```

Do not state the target as though it already exists.

---

# 62. Documentation Lifecycle Vocabulary

Vibe documents follow Documentation Constitution.

Canonical document lifecycle:

```text
DRAFT
REVIEW
ACTIVE
DEPRECATED
SUPERSEDED
ARCHIVED
```

Do not create:

```text
ACTIVE_READY
REVIEW_EVIDENCE
READY_ACTIVE
FINAL_DRAFT
```

as document lifecycle states.

If additional meaning is required, express it in another metadata field or prose without redefining `status`.

---

# 63. Evidence Vocabulary Rule

Vibe Engineering MUST NOT create a generic formal enum called:

```text
EVIDENCE_CLAIM
```

with its own truth values if upstream evidence models already govern the claim.

Instead record actual evidence through:

- Engineering Report;
- Assurance Report;
- Verification Matrix;
- CI/repository result;
- runtime observation;
- or another canonical evidence mechanism.

---

# 64. Truth Vocabulary Rule

Do not create a Vibe-specific:

```text
TRUTH_STATE
```

taxonomy that competes with Documentation Constitution concepts.

Use repository-supported maturity language and actual evidence.

Distinguish:

```text
intended truth
implementation truth
runtime truth
evidence
```

according to their canonical sources.

---

# 65. Finding Severity

Finding severity is owned by:

```text
.agents/contracts/assurance-report.schema.json
```

Current canonical values include:

```text
INFO
LOW
MEDIUM
HIGH
CRITICAL
```

Vibe Engineering MUST NOT define:

```text
BLOCKER
HIGH
MEDIUM
LOW
INFORMATIONAL
```

as a competing assurance-report severity enum.

Owner-facing prose may say "blocking finding" when a finding blocks progress, but the actual finding severity remains schema-defined.

---

# 66. Finding Status

Finding status is also canonical upstream.

Current values include:

```text
OPEN
RESOLVED
ACCEPTED_RISK
NOT_APPLICABLE
```

Do not introduce competing finding lifecycle vocabulary.

---

# 67. Blocked Is a Valid Result

Vibe Engineering treats:

```text
BLOCKED
```

as a valid result where the upstream artifact allows it.

A blocked state is preferable to fabricated certainty.

Do not convert:

```text
BLOCKED
NOT_RUN
PARTIAL
UNKNOWN
NOT VERIFIED
```

into:

```text
PASS
```

for presentation simplicity.

---

# 68. Unknown Does Not Mean Low Risk

Missing information MUST NOT be interpreted as:

```text
R0
```

or:

```text
safe
```

Risk classification follows canonical risk policy.

Uncertainty may require escalation or stop behavior.

---

# 69. Role Transition Vocabulary

A role transition SHOULD be described explicitly.

Example:

```text
ACTIVE ROLE
planner

HANDOFF
planner → engineer
```

Then:

```text
ACTIVE ROLE
engineer
```

Do not describe:

```text
planner + engineer + auditor
```

as simultaneously active within one governed execution merely because one runtime can perform all of them sequentially.

---

# 70. Handoff

`HANDOFF` is an operating concept, not a Vibe lifecycle state.

A useful handoff preserves:

```text
from role
to role
objective
artifact references
exact revision
evidence locations
open findings
allowed next action
```

Canonical schema fields remain authoritative where formal artifacts provide handoff structures.

---

# 71. Revision Vocabulary

Use explicit revision names when relevant.

Preferred:

```text
planning baseline
implementation baseline
PR base SHA
PR head SHA
remediation baseline
merge SHA
main verification SHA
```

Avoid ambiguous generic:

```text
HEAD
latest
current commit
```

when exact identity matters.

---

# 72. Baseline

`BASELINE` means:

> The exact repository state against which a specific planning, implementation, remediation, or verification claim is bound.

Different procedures may have different valid baselines.

Do not assume:

```text
planning baseline
=
PR head
=
merge SHA
=
current main
```

---

# 73. Current Main

`CURRENT_MAIN` is an observational term.

It means:

> The currently observed revision of the repository's main integration branch at the time of verification.

Current main is not automatically:

- the package merge SHA;
- the PR head;
- the implementation baseline.

---

# 74. Integration Revision

`INTEGRATION_REVISION` means the repository revision created or identified by integration of the expected change.

For GitHub merge workflows this may be:

```text
merge SHA
```

depending on merge strategy.

Record the actual observed identity.

---

# 75. Evidence Revision

Evidence MUST be attributable to the revision it actually tested or reviewed.

Do not say:

```text
CI passed
```

without knowing which revision the run applies to when revision specificity matters.

---

# 76. Vibe Continuity Example

Valid:

```text
SESSION
VE_SESSION.CONTINUATION

VE_CONTINUITY
VE_CONTINUITY.CONFIRMED

OBSERVED MAIN
26871da...

ACTIVE PR
#27

PR HEAD
abc123...
```

Invalid:

```text
SESSION STATUS
ALL_GOOD
```

with no defined meaning.

---

# 77. Unsupported Routing Example

Valid:

```text
TARGET SYSTEM
repository-engineering

ROUTING PROFILE
NOT AVAILABLE

RESULT
VE_CONTINUITY.BLOCKED

STOP_REASON
VE_STOP.ROUTING_PROFILE_UNAVAILABLE
```

Invalid:

```text
TARGET SYSTEM
repository-engineering

PROFILE
mgbos
```

merely because `mgbos` is currently available.

---

# 78. PR Change Example

Before:

```text
AUDITED PR HEAD
abc123
```

Later:

```text
CURRENT PR HEAD
def456
```

Result:

```text
VE_STOP.PR_HEAD_CHANGED
```

The previous audit MUST NOT silently attach to `def456`.

---

# 79. Merge Verification Example

Expected:

```text
PR
#27

EXPECTED
merged
```

Observed:

```text
PR STATE
open
```

Result:

```text
VE_POST_MERGE.BLOCKED

STOP_REASON
VE_STOP.MERGE_NOT_CONFIRMED
```

Do not trust a conversational statement that merge already happened.

---

# 80. Post-Merge Interference Example

Package merge:

```text
M1
```

Current main:

```text
M3
```

Intervening change:

```text
M2
```

If `M2` materially modifies the same governance validator changed by `M1`:

```text
VE_POST_MERGE.BLOCKED

STOP_REASON
VE_STOP.POST_MERGE_INTERFERENCE
```

until the combined current state is reviewed.

---

# 81. Vocabulary Introduction Rule

A new Vibe-specific formal token may be added only when:

```text
the concept is genuinely method-local
+
no canonical upstream owner already exists
+
ordinary prose is insufficient
+
the token improves deterministic operation
```

The new token MUST:

- use a `VE_*` namespace;
- be defined here;
- state what it means;
- state what it does not mean;
- and identify any relevant upstream relationship.

---

# 82. Vocabulary Removal Rule

If an upstream canonical owner later introduces semantics that replace a Vibe-local concept:

```text
UPSTREAM CANONICAL VOCABULARY
WINS
```

The Vibe term SHOULD be:

```text
DEPRECATED
```

in prose and removed from active use after migration.

Do not maintain duplicate semantic systems for backward compatibility indefinitely.

---

# 83. No Provider Vocabulary Fork

Provider/runtime adapters MUST NOT create policy terms such as:

```text
ANTIGRAVITY_READY
CODEX_APPROVED
CLAUDE_SAFE
GPT_VERIFIED
```

Provider-specific observations belong in execution/evidence context.

They do not belong in canonical Vibe governance vocabulary.

---

# 84. No Model Confidence Vocabulary

Do not use model confidence as engineering state.

Forbidden:

```text
95_PERCENT_CONFIDENT
VERY_CONFIDENT
LIKELY_PASS
```

as substitutes for evidence.

Confidence may be mentioned as reasoning context when useful.

It does not replace verification.

---

# 85. No User-Sentiment State

Do not use:

```text
USER_HAPPY
USER_SAID_OK
OWNER_SEEMS_FINE
```

as engineering authorization or completion states.

Owner decisions must be represented according to the applicable policy and procedure.

---

# 86. No Conversation State as Engineering State

Terms such as:

```text
conversation complete
chat done
context remembered
```

have no authority over repository engineering state.

Session continuity must be restored from repository/evidence reality.

---

# 87. No Test Count as Quality State

Do not create formal states such as:

```text
100_TESTS_PASS
FULLY_TESTED
TEST_COMPLETE
```

without defining actual required checks and coverage expectations.

Test quantity is not assurance quality.

---

# 88. No Green-CI Shortcut

Avoid:

```text
GREEN
```

as a release or assurance state.

A green workflow may prove only the checks it actually executed.

Always preserve:

```text
which workflow
which revision
which checks
which conclusion
```

---

# 89. Owner-Facing Vocabulary

Owner-facing summaries SHOULD remain simple.

Recommended human labels:

```text
READY FOR NEXT GOVERNED STEP
BLOCKED
OWNER DECISION NEEDED
REMEDIATION NEEDED
VERIFICATION INCOMPLETE
```

These are presentation phrases.

They are not machine enums unless explicitly defined by an upstream canonical artifact.

When used, the technical basis should be traceable.

---

# 90. Owner Decision Needed

`OWNER DECISION NEEDED` is a human-facing condition.

It SHOULD identify:

```text
decision
options
impact
risk
recommended safe next step
```

It does not itself represent canonical approval evidence.

---

# 91. Ready for Next Governed Step

This phrase means only:

> The currently required engineering prerequisites for the next identified governed step appear satisfied.

It does not universally mean:

```text
ready to merge
ready to release
ready for production
```

The actual next action must be named.

---

# 92. Vibe Reporting Pattern

Preferred concise reporting:

```text
SESSION
VE_SESSION.PR_AUDIT

PHASE
VE_PHASE.ASSURE

ACTIVE ROLE
auditor

TARGET
PR #27

PR HEAD
abc123

RISK
R3

ASSURANCE
SELF_REVIEW

VERIFICATION
PASS

BLOCKING FINDINGS
none observed

NEXT GOVERNED STEP
Owner merge consideration
```

Only include claims actually supported by evidence.

---

# 93. Vocabulary Cross-Check Checklist

Before introducing or using a formal engineering term, ask:

```text
Who owns this concept?
Is there already a canonical enum?
Is this Vibe-specific?
Does it need a formal token?
Does it need a VE namespace?
Could this be ordinary prose instead?
Could this collide with a schema?
Could this imply authority that does not exist?
```

If ownership is unclear:

```text
STOP
```

and resolve canonical authority first.

---

# 94. Legacy Migration Table

| Legacy / discouraged term | v1.1.1 handling |
|---|---|
| `LOCAL_PASS` as package state | Remove; use actual evidence/artifact state |
| `CI_PASS` as package state | Remove; record CI evidence |
| `READY_TO_MERGE` as Vibe verdict | Remove; use canonical assurance/verification + human prose |
| `MERGED` as Vibe state | Record repository merge fact |
| `POST_MERGE_VERIFIED` | `VE_POST_MERGE.VERIFIED` |
| `POST_MERGE_FAILURE` | use `VE_POST_MERGE.BLOCKED` + reason |
| `CONTINUITY_CONFIRMED` | `VE_CONTINUITY.CONFIRMED` |
| `MERGE_NOT_CONFIRMED` | `VE_STOP.MERGE_NOT_CONFIRMED` |
| `POST_MERGE_INTERFERENCE` | `VE_STOP.POST_MERGE_INTERFERENCE` |
| `STALE_BASELINE` as Vibe-local token | `VE_STOP.STALE_BASELINE` |
| `PR_HEAD_CHANGED` | `VE_STOP.PR_HEAD_CHANGED` |
| `PR_NOT_FOUND` | `VE_STOP.PR_NOT_FOUND` |
| custom cross-agent assurance | use canonical assurance independence |
| provider name as role | separate canonical role from runtime/provider |
| Vibe R0–R5 definitions | remove; use canonical risk owner |

---

# 95. Invariants

This vocabulary standard preserves:

```text
NO DUPLICATE RISK TAXONOMY

NO DUPLICATE ASSURANCE TAXONOMY

NO DUPLICATE CONTRACT LIFECYCLE

NO DUPLICATE VERIFICATION ENUM

NO DUPLICATE RELEASE VERDICT

NO UNNAMESPACED VIBE FORMAL TOKENS

NO PROVIDER-AS-ROLE

NO FUNCTION-AS-AUTHORITY SHORTCUT

NO CONVERSATION-AS-STATE

NO CONFIDENCE-AS-EVIDENCE

NO GREEN-CI-AS-RELEASE-PERMISSION

NO BLOCKED-AS-PASS

NO UNKNOWN-AS-LOW-RISK
```

---

# 96. Machine-Enforcement Direction

Future repository validation SHOULD be able to check, where practical:

```text
unknown VE_* tokens
deprecated Vibe tokens
invalid document lifecycle status
duplicate canonical vocabulary definitions
provider-specific role misuse
routing-profile mismatch
schema enum drift
broken upstream dependency paths
```

This document does not claim all of those checks are currently implemented.

Documented target behavior MUST remain distinguishable from runtime enforcement reality.

---

# 97. Change Control

Material changes to this vocabulary require review because vocabulary drift can affect:

- prompts;
- agent rules;
- skills;
- contracts;
- audits;
- reports;
- routing;
- automation;
- future runtime parsers.

A material vocabulary change SHOULD inspect reverse references before activation.

---

# 98. Completion Rule

A new or modified Vibe term is ready for ACTIVE use when:

```text
semantic owner is clear
namespace is correct
meaning is explicit
non-meaning is explicit where ambiguity exists
upstream conflict is absent
reverse references are understood
procedure documents are aligned
```

---

# 99. Final Principle

Vibe Engineering should introduce **less vocabulary, not more**.

The desired hierarchy is:

```text
UPSTREAM CANONICAL SEMANTICS
        ↓
VIBE-SPECIFIC COORDINATION ONLY
        ↓
HUMAN-FRIENDLY PRESENTATION
```

Never invert it.

The purpose of this vocabulary is not to make the method look sophisticated.

Its purpose is to make it hard for humans or AI runtimes to confuse:

```text
procedure
state
evidence
risk
assurance
permission
approval
verification
release
```

with one another.

That semantic precision is part of engineering safety.