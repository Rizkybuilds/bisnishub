---
canonical_id: docs.engineering.vibe-engineering.remediation-protocol
status: ACTIVE
version: 1.1.1
owner: Rizky
author: OpenAI / ChatGPT
approver: Rizky
scope: repository-engineering
document_class: runbook
effective_from: 2026-10-03

authoritative_for:
  - vibe engineering remediation procedure
  - vibe engineering defect-to-correction workflow
  - vibe engineering remediation baseline discipline
  - vibe engineering remediation scope control
  - vibe engineering remediation risk inheritance
  - vibe engineering remediation assurance inheritance
  - vibe engineering finding-resolution procedure
  - vibe engineering post-remediation re-audit
  - vibe engineering sibling-defect review
  - vibe engineering corrective-work handoff

last_reviewed: 2026-10-03
reviewed_against_revision: 26871da802706fba5bc033576fbb0a487f6c9255
review_cadence: quarterly

depends_on:
  - ./README.md
  - ./state-and-vocabulary.md
  - ./operating-model.md
  - ./session-protocol.md
  - ./change-package-template.md
  - ./implementation-contract-template.md
  - ./pr-audit-protocol.md
  - ../../governance/documentation-constitution.md
  - ../../governance/canonical-source-map.md
  - ../../governance/cross-system-risk-classification.md
  - ../../governance/evidence-provenance-model.md
  - ../../governance/approval-policy.md
  - ../engineering-ai-control-plane.md
  - ../../../.agents/contracts/README.md
  - ../../../.agents/contracts/implementation-contract.schema.json
  - ../../../.agents/contracts/work-package.schema.json
  - ../../../.agents/contracts/engineering-report.schema.json
  - ../../../.agents/contracts/assurance-report.schema.json
  - ../../../.agents/contracts/verification-matrix.schema.json
  - ../../../.agents/routing/README.md
  - ../../../.agents/capabilities/README.md
  - ../../../.agents/roles/contracts.json
  - ../../../AGENTS.md

supersedes: null
---

# Vibe Engineering Remediation Protocol

## 1. Purpose

This protocol defines how Vibe Engineering corrects an engineering defect after:

```text
audit finding
verification failure
CI failure
implementation defect
scope defect
architecture conflict
governance defect
post-integration defect
```

without turning the correction into uncontrolled new work.

The objective is:

> **Apply the smallest safe correction that resolves the verified root cause while preserving the accepted engineering intent, risk floor, authority boundary, and evidence chain.**

---

# 2. Core Remediation Loop

The canonical Vibe remediation flow is:

```text
FINDING / FAILURE
        ↓
CAPTURE EVIDENCE
        ↓
CLASSIFY
        ↓
ROOT CAUSE
        ↓
SIBLING / DEPENDENCY REVIEW
        ↓
BOUND REMEDIATION
        ↓
ENGINEER IMPLEMENTATION
        ↓
FOCUSED VERIFICATION
        ↓
REGRESSION VERIFICATION
        ↓
UPDATED CANDIDATE
        ↓
RE-AUDIT EXACT REVISION
        ↓
QA / VERIFICATION REFRESH
        ↓
FINDING RESOLUTION
```

Do not skip from:

```text
symptom
```

directly to:

```text
patch
```

for material defects.

---

# 3. Session Type

Corrective work uses:

```text
VE_SESSION.REMEDIATION
```

when a known candidate/package already exists.

Typical active implementation role:

```text
engineer
```

After remediation:

```text
engineer
→ auditor
→ qa
```

as required by canonical routing.

---

# 4. Remediation Is Not a New Authority Grant

A remediation request does not authorize:

```text
broader repository mutation
new production access
new remote capability
new architecture
lower risk
weaker acceptance criteria
weaker tests
```

The corrective objective remains bounded by the parent engineering work unless explicitly re-planned.

---

# 5. Remediation Is Not Auditor Editing

Normal sequence:

```text
Auditor finds defect
        ↓
Auditor records finding
        ↓
Engineer receives remediation work
        ↓
Engineer corrects
        ↓
Auditor re-audits
```

Forbidden pattern:

```text
Auditor finds defect
        ↓
Auditor edits code
        ↓
Auditor calls review independent
```

If Auditor also becomes Engineer:

record the role transition.

Any later assurance independence must reflect actual facts.

---

# 6. Trigger Sources

Remediation may be triggered by:

```text
Assurance Report finding
Verification Matrix FAIL
Verification Matrix BLOCKED where implementation correction is needed
CI failure
manual audit finding
security finding
runtime regression
post-merge verification finding
incident follow-up
```

The trigger must be traceable.

---

# 7. Finding vs Failure

A finding is an observed issue or discrepancy.

A failure is an unsuccessful check or outcome.

They are related but not identical.

Example:

```text
CHECK
authorization-negative-test

RESULT
FAIL
```

may produce:

```text
FINDING
unauthorized caller is accepted
```

The remediation targets the root cause behind the finding.

---

# 8. Preserve Original Evidence

Do not overwrite the original failed evidence.

Keep:

```text
original candidate revision
original finding
original failed check
original Assurance Report
original Verification Matrix
```

as historical evidence.

Then produce new evidence for the remediation revision.

---

# 9. Finding Identity

Where a formal Assurance Report exists:

preserve the canonical finding identity when resolving the same defect.

Do not create a new finding merely to make the original appear resolved.

Example:

```text
FINDING
F-007

OLD STATUS
OPEN

NEW REVIEW
same F-007 evaluated against new revision
```

Formal finding status must follow current Assurance Report schema.

---

# 10. Finding Severity

Formal finding severity uses canonical values:

```text
INFO
LOW
MEDIUM
HIGH
CRITICAL
```

Do not create:

```text
BLOCKER
SEV-0
URGENT
```

as competing schema values.

A finding may block work regardless of whether its severity label literally says “blocker.”

---

# 11. Finding Status

Current canonical finding status includes:

```text
OPEN
RESOLVED
ACCEPTED_RISK
NOT_APPLICABLE
```

`ACCEPTED_RISK` requires actual authority.

Engineer and Auditor MUST NOT self-accept consequential risk.

---

# 12. First Step — Rebind to Current Reality

Before remediation starts:

```text
restore repository truth
```

Determine:

```text
repository
candidate
current branch
current worktree
current PR
current PR head
current main
parent contract
parent Work Package
finding
latest evidence
```

Do not remediate against remembered state.

---

# 13. Remediation Baseline

For pre-merge PR remediation, the normal baseline is:

```text
CURRENT PR HEAD
```

at remediation start.

Not:

```text
original main from first implementation
```

unless repository structure explicitly requires otherwise.

---

# 14. Example Baseline

Original implementation:

```text
BASE
A

PR HEAD
B
```

Audit finds defect.

Builder later adds unrelated accepted change:

```text
PR HEAD
C
```

Remediation must start from:

```text
C
```

not from:

```text
A
```

or:

```text
B
```

without reconciliation.

---

# 15. Stale Remediation Baseline

If the candidate changes before Engineer begins remediation:

```text
VE_STOP.STALE_BASELINE
```

may apply.

Restore current candidate.

Assess overlap.

Then issue/update the bounded remediation work.

---

# 16. Do Not Overwrite Concurrent Work

If current candidate/worktree contains unexpected overlapping work:

use the applicable canonical stop condition such as:

```text
UNRELATED_WORK_COLLISION
```

Do not reset or overwrite another writer's work.

---

# 17. Parent Objective

Remediation inherits the parent objective.

Example:

```text
PARENT OBJECTIVE
Prevent duplicate payment allocation.

REMEDIATION OBJECTIVE
Correct missing idempotency enforcement on retry path.
```

Not:

```text
REMEDIATION OBJECTIVE
Redesign all payment architecture.
```

unless re-planned separately.

---

# 18. Parent Contract

Identify the governing:

```text
Implementation Contract
```

before remediation.

Ask:

```text
Is the original objective still valid?

Are acceptance criteria still valid?

Is risk still valid?

Is routing still valid?

Is scope still sufficient?
```

If yes:

remediation may proceed under the same intended contract with a bounded corrective Work Package.

If not:

re-planning is required.

---

# 19. Parent Work Package

Do not silently rewrite a historical completed Work Package to describe remediation.

For material remediation, prefer a new bounded Work Package when the original implementation slice has already ended.

Example:

```text
WP-payment-allocation-command
```

followed by:

```text
WP-payment-allocation-remediation-01
```

Both may reference the same Implementation Contract when parent semantics remain valid.

---

# 20. When a New Work Package Is Appropriate

Create a remediation Work Package when:

```text
new Engineer execution is required
+
the correction has a bounded write scope
```

This keeps corrective work traceable.

---

# 21. When the Implementation Contract Must Change

The parent Implementation Contract must be amended/superseded when remediation reveals that the intended engineering work itself was materially wrong.

Examples:

```text
acceptance criterion is wrong
target system was wrong
route was wrong
scope fundamentally insufficient
architecture assumption was wrong
risk floor was wrong
Owner decision changes intended behavior
```

Do not solve these by editing only the Work Package.

---

# 22. Contract History

Do not rewrite the old contract silently.

Use the canonical contract lifecycle:

```text
SUPERSEDED
```

and:

```text
supersedes
```

where a replacement contract takes authority.

Historical intent must remain inspectable.

---

# 23. Risk Inheritance

Hard rule:

> **Remediation inherits at least the effective risk floor of the parent work unless canonical re-routing explicitly establishes otherwise.**

Example:

```text
parent risk
R5

remediation
one-line fix

remediation risk floor
R5
```

Small patch does not mean small consequence.

---

# 24. Risk May Increase

Remediation may reveal a stronger concern.

Example:

```text
original:
ordinary backend defect

discovery:
authorization bypass
```

Then:

```text
re-route
reclassify
increase controls
```

Do not continue under the lower risk.

---

# 25. Risk Must Not Silently Decrease

Forbidden:

```text
This is just remediation,
therefore use R1.
```

The consequence of the affected capability remains relevant.

---

# 26. Routing Inheritance

Remediation normally inherits:

```text
target system
routing profile
primary task type
concerns
required roles
required expertise
assurance requirement
```

from parent work where those remain semantically valid.

---

# 27. Routing Re-evaluation

Re-route if remediation reveals:

```text
new concern
new system boundary
new environment
new capability
new authority
new external side effect
new production impact
```

Do not freeze an invalid route merely because the original package was already approved.

---

# 28. Missing Routing Profile

If re-evaluation shows the actual target has no valid profile:

```text
VE_STOP.ROUTING_PROFILE_UNAVAILABLE
```

Stop governed implementation.

Do not borrow another profile.

---

# 29. Assurance Inheritance

Remediation MUST NOT silently weaken the parent assurance requirement.

Example:

```text
parent routing
INDEPENDENT_REQUIRED

remediation
one-line security correction
```

does not automatically become:

```text
SELF_REVIEW sufficient
```

Actual assurance must still satisfy the canonical requirement.

---

# 30. Acceptance Criteria Inheritance

Parent acceptance criteria remain active unless formally amended.

Remediation must not change:

```text
AC-001
```

into an easier requirement merely because the implementation failed.

---

# 31. Test Inheritance

Relevant planned checks remain required unless:

```text
they are no longer semantically applicable
```

and that change is explicitly governed.

Do not delete a failing test simply to make remediation pass.

---

# 32. Stop Conditions Inheritance

Mandatory parent/routing stop conditions remain applicable.

Remediation may add new stop conditions.

It MUST NOT silently remove material parent stop conditions.

---

# 33. Common Upstream Stop Conditions

Current routing may contribute conditions such as:

```text
CANONICAL_CONFLICT
UNKNOWN_HIGH_RISK
SCOPE_EXPANSION_REQUIRED
REQUIRED_SOURCE_MISSING
PERMISSION_UNCLEAR
ENVIRONMENT_UNVERIFIED
FINANCIAL_INVARIANT_AMBIGUOUS
DESTRUCTIVE_CHANGE_REQUIRED
REQUIRED_EVIDENCE_UNAVAILABLE
UNRELATED_WORK_COLLISION
SECURITY_BOUNDARY_UNCLEAR
```

Use canonical semantics.

Do not redefine them here.

---

# 34. Root Cause

Before corrective editing, classify:

```text
SYMPTOM
ROOT CAUSE
CONTRIBUTING FACTOR
```

where relevant.

Example:

```text
SYMPTOM
Unauthorized request succeeds.

ROOT CAUSE
Direct RPC path does not call canonical authorization guard.

CONTRIBUTING FACTOR
UI-level restriction hid the missing server check.
```

---

# 35. Root Cause Must Be Evidence-Based

Do not write:

```text
root cause:
AI forgot.
```

unless that is genuinely the relevant process cause.

Prefer technical and process mechanisms that can be corrected.

---

# 36. Unknown Root Cause

If a material defect has no credible root cause yet:

do not rush into implementation.

Continue investigation.

Where applicable, stay:

```text
BLOCKED
```

until safe correction can be bounded.

---

# 37. Reproduction

Where feasible:

```text
reproduce the defect
```

before fixing.

A reproduction may be:

```text
failing test
manual procedure
runtime trace
database state
CI failure
```

depending on the defect.

---

# 38. Reproduction Is Not Always Safe

Do not reproduce destructive production behavior merely to obtain a failing example.

Use the safest environment capable of demonstrating the problem.

---

# 39. Capture the Failure Before Fixing

For regressions, a strong remediation often starts with evidence that would fail before the fix.

Example:

```text
negative authorization test
FAIL before fix
PASS after fix
```

This creates stronger regression protection.

---

# 40. Sibling Audit

After root cause is identified:

search for siblings.

Example:

```text
missing server authorization
```

may also affect:

```text
create
update
delete
bulk path
alternate RPC
```

The goal is not to expand scope automatically.

The goal is to understand whether the defect is isolated.

---

# 41. Sibling Finding Outside Scope

If sibling issue is real but not required to safely resolve current objective:

record it as a separate finding/future package.

Do not hide it.

Do not automatically include it.

---

# 42. Sibling Finding Required for Safe Fix

If safe remediation requires correcting siblings:

the scope may need expansion.

Use:

```text
SCOPE_EXPANSION_REQUIRED
```

and return to Planner.

---

# 43. Dependency Review

Before remediation scope is frozen, inspect material:

```text
direct dependencies
reverse references
schemas
tests
validators
runtime paths
CI
documentation
```

as applicable.

The correction should not fix one consumer while breaking another.

---

# 44. Evidence Mechanism Defect

If the defect exists in:

```text
test harness
CI
validator
permission resolver
routing validator
security checker
```

the remediation modifies an evidence/enforcement mechanism.

This requires stronger scrutiny.

---

# 45. Self-Validation Risk

Hard rule:

> **A remediation to an evidence mechanism cannot be trusted solely because the remediated mechanism passes itself.**

Use additional evidence.

---

# 46. Evidence Mechanism Remediation Review

As applicable, include:

```text
old-vs-new behavior
positive tests
negative tests
bypass search
alternate evidence
manual semantic review
independent assurance where required
```

---

# 47. Scope Definition

The remediation should state:

```text
IN_SCOPE
OUT_OF_SCOPE
ALLOWED_PATHS
FORBIDDEN_PATHS
```

through the applicable Work Package.

Keep correction bounded.

---

# 48. Smallest Safe Correction

The target is:

```text
smallest safe correction
```

not necessarily:

```text
fewest changed lines
```

A two-line patch may be unsafe if root cause requires broader consistent correction.

---

# 49. No Opportunistic Refactor

Do not mix:

```text
bug remediation
+
unrelated cleanup
+
style rewrite
+
architecture modernization
```

unless necessary for the safe fix.

Unrelated changes enlarge the audit surface.

---

# 50. No Hidden Redesign

If the remediation requires a new architecture:

stop.

Return to planning.

A remediation package must not smuggle in a major architecture decision.

---

# 51. No Requirement Weakening

Forbidden:

```text
test fails
→ loosen acceptance criterion
```

without canonical justification.

Correct sequence:

```text
determine whether implementation or requirement is wrong
```

then govern the necessary change.

---

# 52. No Validator Weakening

Forbidden remediation:

```text
validator rejects bad configuration
→ change validator to ignore it
```

unless the configuration is actually valid according to canonical policy.

---

# 53. No Error Swallowing

Avoid fixes that convert:

```text
FAILURE
```

into:

```text
success-looking default
```

without resolving the cause.

Examples:

```text
catch exception and return true
ignore validation error
skip failed test
```

are strong red flags.

---

# 54. No Authority Expansion

A correction must not solve a failure by granting more permission than intended.

Example:

```text
permission denied
→ grant broad write scope
```

is not a valid remediation unless governance explicitly requires it.

---

# 55. No Environment Bypass

A failing destructive test against a remote environment must not be “fixed” by disabling the environment guard.

The safe boundary is part of the system.

---

# 56. Security Remediation

Security-related remediation should consider:

```text
exploit path
alternate bypass
positive authorized path
negative unauthorized path
least privilege
logging/audit
```

according to scope.

---

# 57. Authorization Remediation

Authorization fixes should review:

```text
direct server path
alternate API/RPC path
organization scope
privileged context
UI bypass
```

where applicable.

---

# 58. Financial Remediation

Financial-integrity remediation should consider:

```text
authorization
state eligibility
idempotency
concurrency
historical integrity
reconciliation
```

as applicable.

A local symptom may indicate broader accounting risk.

---

# 59. Migration Remediation

Migration defects may require:

```text
forward migration
repair migration
application compatibility
data reconciliation
```

Do not casually rewrite already-applied migration history.

Follow system-specific migration policy.

---

# 60. CI Remediation

If CI fails because workflow/configuration is genuinely wrong:

fix the workflow.

If CI reveals a product defect:

fix the product defect.

Do not change CI merely to obtain green status.

---

# 61. Test Remediation

A test may legitimately be wrong.

But before changing it:

verify canonical behavior.

Ask:

```text
Is implementation wrong?

Is test wrong?

Did intended behavior change?

Is test too coupled to implementation detail?
```

---

# 62. Documentation Remediation

A documentation finding may be corrected proportionally.

But governance or architecture semantics in Markdown can still be consequential.

Do not classify semantic governance remediation as low-risk automatically.

---

# 63. Builder Startup

Remediation Engineer MUST verify:

```text
repository
target system
current candidate
branch
worktree
remediation baseline
parent contract
remediation Work Package
scope
finding
required checks
stop conditions
```

before editing.

---

# 64. Active Role

Corrective implementation runs under:

```text
engineer
```

not:

```text
auditor
```

unless an explicit role transition has occurred.

---

# 65. One Writer

Default remains:

```text
ONE ACTIVE WRITER
PER OVERLAPPING MUTABLE SCOPE
```

Do not let the original Builder and remediation Builder race over the same PR files.

---

# 66. Worktree Discipline

Remediation should use the intended candidate branch/worktree or a clearly governed alternative.

Do not accidentally remediate an obsolete branch.

---

# 67. Remediation Work Package

A remediation Work Package SHOULD identify:

```text
parent Implementation Contract
current remediation baseline
writer
branch
worktree
objective
allowed paths
forbidden paths
risk
required expertise
acceptance criteria
required checks
stop conditions
handoff
```

Use the canonical schema.

---

# 68. Remediation Objective

Good:

```text
Correct missing organization-scope validation in the payment allocation command.
```

Weak:

```text
Fix PR.
```

The objective should connect directly to the finding.

---

# 69. Acceptance Traceability

Remediation should identify which parent acceptance criteria are affected.

Example:

```text
AC-002
Unauthorized callers cannot perform payment allocation.
```

The remediation must not invent a different success condition.

---

# 70. New Acceptance Criterion

If remediation exposes a missing but necessary acceptance criterion:

return to Planner.

Amend/supersede the Implementation Contract as needed.

Do not let Engineer silently add contract semantics.

---

# 71. Required Checks

Remediation checks usually include:

```text
focused defect check
relevant negative path
relevant regression
existing gate affected by the change
```

according to risk.

---

# 72. Focused Verification

First verify:

> Does the specific defect now fail/persist or is it corrected?

A focused test provides quick causal evidence.

---

# 73. Regression Verification

Then verify:

> Did the correction break related existing behavior?

Focused success alone is insufficient for many material changes.

---

# 74. Full Suite

A broader/full test suite may be appropriate.

It does not replace focused failure-mode testing.

---

# 75. Negative Verification

Security/governance remediation SHOULD include relevant negative verification.

Example:

```text
unverified approval
→ denied
```

not only:

```text
verified approval
→ allowed
```

---

# 76. Check Environment

Record where remediation evidence ran.

Do not present:

```text
local
```

as:

```text
CI
```

or:

```text
production
```

---

# 77. Checks Not Run

If expected checks cannot run:

record:

```text
check
reason
consequence
```

Do not hide the omission.

---

# 78. Engineer Report

Remediation Engineer should produce a new canonical Engineering Report when required.

It should record:

```text
actual remediation revision
files changed
implementation summary
decisions
checks run
checks not run
known failures
limitations
residual risk
handoff
```

---

# 79. Do Not Rewrite Old Engineering Report

The original Engineering Report remains evidence for the original candidate.

Remediation produces:

```text
new Engineering Report
```

for the new revision.

---

# 80. Candidate Revision After Fix

After remediation:

```text
OLD PR HEAD
A

NEW PR HEAD
B
```

The audit target is now:

```text
B
```

---

# 81. Old Assurance Is Stale

Any assurance materially dependent on:

```text
A
```

must be reconsidered for:

```text
B
```

Do not reuse old status automatically.

---

# 82. Re-Audit

After Engineer handoff:

```text
VE_SESSION.PR_AUDIT
```

against exact new candidate.

Auditor should verify:

```text
finding correction
scope
regression
final file state
new evidence
new CI
```

and any affected broader semantics.

---

# 83. Focused vs Full Re-Audit

Not every remediation requires repeating every audit step from zero.

Use impact analysis.

Focused re-audit is appropriate when:

```text
change is tightly bounded
unaffected evidence remains valid
no control surface changed
```

Broader re-audit is appropriate when:

```text
architecture changed
authority changed
validator changed
risk changed
scope expanded
multiple dependencies changed
```

---

# 84. Re-Audit Must Review Final State

Do not only inspect the remediation commit.

Review resulting final candidate where material.

A corrective commit can interact badly with existing candidate code.

---

# 85. Finding Resolution

A finding becomes:

```text
RESOLVED
```

only when:

```text
correction exists
+
exact reviewed revision contains it
+
required evidence supports it
```

---

# 86. Builder “Fixed” Is Not Resolution

This statement:

```text
fixed
```

is not enough.

Formal closure requires re-review/evidence.

---

# 87. Finding Still Open

If remediation only partially addresses root cause:

keep finding:

```text
OPEN
```

or use applicable formal state.

Do not close it for progress optics.

---

# 88. New Finding

If re-audit discovers a new defect:

record it.

Do not ignore it because remediation was supposed to be narrow.

---

# 89. Reopened Finding

If evidence later disproves the correction:

the finding may need to be reopened or represented through a new current Assurance Report.

Historical resolution evidence should not be deleted.

---

# 90. Verification Matrix Refresh

QA should update or issue current verification evidence for the new candidate.

The new matrix must bind to:

```text
NEW EXACT REVISION
```

---

# 91. Relevant Cases Must Re-run

At minimum re-run cases materially affected by remediation.

Additional regression cases may also be required.

---

# 92. Unaffected Verification

Verification for truly unaffected behavior may remain valid if provenance and semantics still support it.

Do not invalidate everything mechanically.

Do not carry everything forward mechanically.

Use impact analysis.

---

# 93. CI Refresh

After remediation:

observe CI for the new candidate revision.

Old green CI does not prove the remediated head.

---

# 94. CI Failure After Remediation

If new candidate CI fails:

investigate.

Do not assume the failure is unrelated.

---

# 95. CI Cancelled / Missing

Do not report PASS.

Use truthful state.

Where required evidence is unavailable:

```text
REQUIRED_EVIDENCE_UNAVAILABLE
```

may apply.

---

# 96. Evidence Mechanism Remediation

If the remediation changes the CI/validator itself:

its new green result is not sufficient alone.

Preserve the self-modifying-evidence rule.

---

# 97. Assurance Independence After Remediation

If routing requires independent assurance:

actual remediation review must still satisfy it.

Same runtime implementing then auditing is normally:

```text
SELF_REVIEW
```

not independent.

---

# 98. Different Runtime

A different runtime may strengthen separation.

It does not automatically prove:

```text
INDEPENDENT
```

Use factual assurance semantics.

---

# 99. Owner Decision During Remediation

Escalate to Owner when remediation requires a genuine human decision such as:

```text
change product behavior
change material scope
accept material residual risk
choose architecture direction
change consequential authority
```

Do not ask Owner to choose routine implementation mechanics.

---

# 100. Owner-Facing Remediation Summary

Owner should receive concise information:

```text
FINDING

ROOT CAUSE

WHAT WAS CHANGED

RISK

WHAT WAS VERIFIED

ASSURANCE

WHAT REMAINS UNVERIFIED

NEXT GOVERNED ACTION
```

---

# 101. Owner Does Not Need Raw Logs

Do not require Owner to manually inspect:

```text
hundreds of terminal lines
every test
every diff hunk
```

unless the decision genuinely requires them.

Keep traceable evidence underneath.

---

# 102. Remediation Outcome — Corrected

A successful remediation may be summarized:

```text
FINDING
resolved on exact candidate revision

FOCUSED VERIFICATION
pass

REGRESSION
pass

ASSURANCE
<satisfied state>

NEXT GOVERNED ACTION
Owner merge consideration
```

only when evidence supports it.

---

# 103. Remediation Outcome — Still Failing

If correction fails:

```text
FINDING
still open

NEXT
continue bounded remediation
or
return to planning
```

Do not call it resolved.

---

# 104. Remediation Outcome — Blocked

If safe correction cannot continue:

```text
VE_OBJECTIVE.BLOCKED
```

or applicable artifact state.

Record reason.

---

# 105. Scope Expansion During Remediation

If required correction exceeds current scope:

```text
SCOPE_EXPANSION_REQUIRED
```

Then:

```text
stop Engineer
↓
return Planner
↓
reassess route/risk/scope
↓
amend artifacts
↓
resume
```

---

# 106. Architecture Conflict

If remediation exposes a conflict with canonical architecture:

```text
CANONICAL_CONFLICT
```

may apply.

Do not patch around canonical architecture.

Resolve the conflict first.

---

# 107. Unknown High Risk

If new discovery may create high consequence but classification is unresolved:

```text
UNKNOWN_HIGH_RISK
```

Stop/downshift execution.

Do not assume safe.

---

# 108. Permission Unclear

If remediation requires an action whose permission is uncertain:

```text
PERMISSION_UNCLEAR
```

Do not use tool availability as permission.

---

# 109. Environment Unverified

If destructive or remote remediation target is uncertain:

```text
ENVIRONMENT_UNVERIFIED
```

Do not execute until target identity is trusted.

---

# 110. Security Boundary Unclear

If remediation affects privilege/identity/security boundary that cannot be confidently resolved:

```text
SECURITY_BOUNDARY_UNCLEAR
```

Stop and return to planning/security review.

---

# 111. Required Source Missing

If remediation needs a missing canonical source:

```text
REQUIRED_SOURCE_MISSING
```

Do not replace it with chat memory.

---

# 112. Destructive Change Required

If proper remediation requires destructive change:

```text
DESTRUCTIVE_CHANGE_REQUIRED
```

must be handled according to routing/governance.

Do not silently perform it.

---

# 113. Financial Invariant Ambiguous

For financial work:

if the correct financial invariant cannot be established:

```text
FINANCIAL_INVARIANT_AMBIGUOUS
```

Stop.

Do not guess accounting behavior.

---

# 114. Required Evidence Unavailable

If remediation correctness cannot be evidenced as required:

```text
REQUIRED_EVIDENCE_UNAVAILABLE
```

Do not upgrade expectation into PASS.

---

# 115. Post-Merge Remediation

A defect discovered after merge requires special care.

The old PR is historical.

The correction normally becomes:

```text
new bounded engineering work
```

against current main.

Do not rewrite the merged PR history.

---

# 116. Post-Merge Defect Flow

Typical flow:

```text
VE_SESSION.POST_MERGE
detect defect
        ↓
VE_SESSION.REMEDIATION
or
VE_SESSION.NEW_WORK
        ↓
bind current main
        ↓
new Change Package / contract as needed
        ↓
new branch / PR
```

---

# 117. When Post-Merge Uses Remediation vs New Work

Use `VE_SESSION.REMEDIATION` when:

```text
the defect is a bounded corrective continuation
```

Use `VE_SESSION.NEW_WORK` when:

```text
correction materially changes objective,
architecture,
scope,
or roadmap
```

---

# 118. Production Incident

If defect is an active incident:

```text
VE_SESSION.INCIDENT
```

may govern immediate recovery.

Follow-up code correction may later enter remediation/new-work workflow.

Incident urgency does not erase authority requirements.

---

# 119. Production Fix Is Not Automatically Authorized

Even if a defect is severe:

do not infer:

```text
permission to patch production directly
```

from urgency.

Use applicable incident/release governance.

---

# 120. Unknown External Outcome

If remediation concerns an operation with uncertain external outcome:

```text
do not blindly retry
```

Reconcile first.

Examples:

```text
payment
message delivery
provider mutation
vendor action
```

---

# 121. Idempotency Remediation

When fixing retry/duplicate-effect defects:

review both:

```text
duplicate prevention
```

and:

```text
safe recovery from unknown outcome
```

where applicable.

---

# 122. Recovery Verification

Where remediation modifies recovery behavior:

test the recovery path.

Do not verify only normal execution.

---

# 123. Documentation After Remediation

If remediation changes intended semantics:

update canonical documentation through governed change.

If implementation merely returns to already-documented intended behavior:

documentation change may not be necessary.

Investigate drift.

---

# 124. No Historical Rewrite

Do not alter old audit/report documents to claim:

```text
the defect never existed
```

Engineering history should remain truthful.

---

# 125. Remediation Naming

Recommended Work Package naming:

```text
WP-<parent-semantic-id>-remediation-01
WP-<parent-semantic-id>-remediation-02
```

when useful.

Exact naming may follow repository conventions.

---

# 126. Remediation Engineering Report Naming

Recommended:

```text
ER-<semantic-id>-remediation-01
```

or another unique semantic ID.

Do not reuse the original Engineering Report artifact ID.

---

# 127. Assurance Report After Remediation

Issue current assurance evidence for the new reviewed revision where required.

Do not mutate old report into a report for new SHA.

---

# 128. Verification Matrix After Remediation

Likewise, new or updated verification evidence must identify the remediated revision.

Revision identity is mandatory for trustworthy continuity.

---

# 129. PR Description Update

If remediation materially changes what the PR does:

update PR description where appropriate.

The PR narrative should not remain misleading.

It still does not become canonical authority.

---

# 130. Change Package Update

Vibe Change Package may record:

```text
finding
remediation package
new PR head
current outcome
```

for human continuity.

It does not replace canonical remediation artifacts.

---

# 131. Reflection After Remediation

After a material defect is resolved, record:

```text
Why did the original process miss this?

Could a deterministic guard prevent recurrence?

Should a test be added?

Should routing change?

Should a rule/skill change?

Should documentation change?

Does the roadmap need adjustment?
```

---

# 132. Process Defect vs Product Defect

A remediation may expose both:

```text
product defect
```

and:

```text
process defect
```

Example:

```text
product defect:
authorization guard missing

process defect:
negative authorization test absent
```

Correct both only through appropriately bounded work.

---

# 133. Deterministic Prevention

If a recurring defect can be reliably prevented through:

```text
schema
validator
test
CI
permission guard
database constraint
```

consider deterministic enforcement.

Do not rely only on telling the AI:

```text
remember next time
```

---

# 134. Rule / Skill Update

A process remediation may justify updating:

```text
rule
skill
runbook
```

but only if the lesson is reusable.

Do not bloat global instructions with one-off details.

---

# 135. Scope of Process Remediation

If process hardening is materially separate from the defect fix:

create a later package.

Do not overstuff the current corrective PR.

---

# 136. Remediation Checklist — Start

```text
[ ] trigger/finding identified
[ ] exact current candidate identified
[ ] current PR head refreshed
[ ] current main observed where relevant
[ ] parent IC identified
[ ] parent WP identified
[ ] finding evidence retrieved
[ ] risk floor preserved
[ ] route still valid
[ ] assurance requirement preserved
```

---

# 137. Remediation Checklist — Root Cause

```text
[ ] symptom documented
[ ] root cause identified or honestly unresolved
[ ] reproduction/evidence available where safe
[ ] sibling paths checked
[ ] reverse references checked
[ ] affected invariants identified
```

---

# 138. Remediation Checklist — Scope

```text
[ ] objective bounded
[ ] allowed paths explicit
[ ] forbidden paths explicit
[ ] no unrelated cleanup included
[ ] architecture redesign excluded unless re-planned
[ ] scope expansion handled explicitly
```

---

# 139. Remediation Checklist — Risk / Authority

```text
[ ] parent risk floor preserved
[ ] new concerns evaluated
[ ] authority not expanded silently
[ ] environment verified
[ ] permission clear
[ ] approval requirements unchanged or re-resolved
[ ] destructive behavior governed
```

---

# 140. Remediation Checklist — Implementation

```text
[ ] active role = engineer
[ ] one writer owns overlapping scope
[ ] current remediation baseline confirmed
[ ] correct branch/worktree confirmed
[ ] parent criteria referenced
[ ] required checks referenced
[ ] stop conditions preserved
```

---

# 141. Remediation Checklist — Verification

```text
[ ] defect-focused verification executed
[ ] relevant negative path executed
[ ] relevant regression executed
[ ] checks-not-run recorded
[ ] evidence environment explicit
[ ] new exact revision recorded
```

---

# 142. Remediation Checklist — Re-Audit

```text
[ ] PR head refreshed
[ ] exact new head audited
[ ] final-file state reviewed
[ ] original finding re-evaluated
[ ] new findings recorded
[ ] scope drift reviewed
[ ] risk drift reviewed
[ ] CI refreshed
[ ] assurance refreshed
[ ] QA/Verification Matrix refreshed where required
```

---

# 143. Remediation Checklist — Closure

```text
[ ] finding status truthful
[ ] blocking criteria satisfied
[ ] unresolved areas explicit
[ ] residual risk explicit
[ ] Owner decision surfaced if needed
[ ] next governed action explicit
[ ] reflection captured
```

---

# 144. Owner-Facing Remediation Pattern

Recommended concise output:

```text
REMEDIATION
<finding / objective>

ROOT CAUSE
<short explanation>

CHANGED
<bounded correction>

CURRENT PR HEAD
<sha>

RISK
<R0-R5>

FOCUSED VERIFICATION
<result>

REGRESSION
<result>

ASSURANCE
<status / independence>

REMAINING ISSUE
<none / explicit>

NEXT GOVERNED ACTION
<re-audit / QA / Owner merge consideration / more remediation>
```

---

# 145. Remediation Required Pattern

When correction is not yet complete:

```text
RESULT
REMEDIATION STILL REQUIRED

FINDING
OPEN

WHY
<reason>

NEXT ACTION
<bounded correction or re-plan>
```

Do not soften unresolved defects.

---

# 146. Re-Planning Required Pattern

When remediation cannot remain bounded:

```text
RESULT
RETURN TO PLANNING

TRIGGER
SCOPE_EXPANSION_REQUIRED

WHY
<architecture/scope reason>

NEXT
planner re-evaluates contract
```

---

# 147. Risk Escalation Pattern

When new consequence is discovered:

```text
CURRENT PARENT RISK
R3

NEW DISCOVERY
authorization concern

RESULT
re-routing required

IMPLEMENTATION
STOPPED
```

Do not invent a lower-effort shortcut.

---

# 148. Independent Assurance Gap Pattern

If remediation is implemented and only self-reviewed while route requires independence:

```text
IMPLEMENTATION
complete

SELF-REVIEW
performed

REQUIRED ASSURANCE
INDEPENDENT_REQUIRED

RESULT
required assurance unresolved
```

Do not present candidate as ready for the governed next step requiring independence.

---

# 149. Anti-Pattern — Patch First

Forbidden:

```text
see error
→ edit code
→ hope tests pass
```

Preferred:

```text
evidence
→ root cause
→ bounded correction
→ verification
```

---

# 150. Anti-Pattern — Reuse Original Baseline

Forbidden:

```text
original baseline from three commits ago
→ remediate current PR blindly
```

Bind to current candidate.

---

# 151. Anti-Pattern — Risk Downgrade

Forbidden:

```text
R5 parent
→ tiny remediation
→ R1
```

Risk follows affected consequence.

---

# 152. Anti-Pattern — Fix by Weakening Test

Forbidden:

```text
test fails
→ remove assertion
```

without canonical evidence that the assertion was wrong.

---

# 153. Anti-Pattern — Fix by Weakening Validator

Forbidden:

```text
validator blocks unsafe state
→ validator changed to allow unsafe state
```

just to obtain PASS.

---

# 154. Anti-Pattern — Auditor Patches

Forbidden:

```text
Auditor finds issue
→ modifies implementation
→ calls own review independent
```

Use Engineer handoff.

---

# 155. Anti-Pattern — Everything Becomes Remediation Scope

Forbidden:

```text
while fixing this,
also clean up everything nearby
```

Keep scope bounded.

---

# 156. Anti-Pattern — Ignore Siblings

Forbidden:

```text
fix first visible authorization bypass
→ ignore identical adjacent path
```

Review siblings before declaring root cause resolved.

---

# 157. Anti-Pattern — Old CI

Forbidden:

```text
old PR head green
new remediation head untested
→ report CI pass
```

Refresh evidence.

---

# 158. Anti-Pattern — Finding Closed by Statement

Forbidden:

```text
Engineer:
fixed

Finding:
RESOLVED
```

without re-audit.

---

# 159. Anti-Pattern — Unknown Becomes Pass

Forbidden:

```text
could not reproduce after change
→ therefore resolved
```

unless evidence supports that conclusion.

---

# 160. Anti-Pattern — New Architecture Hidden in Fix

Forbidden:

```text
small finding
→ introduce new subsystem
```

without planning/architecture review.

---

# 161. Anti-Pattern — Production Hotfix by Convenience

Forbidden:

```text
urgent
→ edit production directly
```

unless explicit incident/production governance authorizes it.

---

# 162. Remediation Completion Standard

Remediation is complete when:

```text
root cause addressed
+
bounded correction exists
+
exact corrected revision identified
+
focused verification supports correction
+
required regression evidence exists
+
required CI is current
+
assurance has been refreshed
+
required QA has been refreshed
+
finding state is truthfully resolved
```

according to risk and scope.

---

# 163. Remediation Does Not Mean Package Complete

After remediation completes, parent engineering objective may still require:

```text
PR audit completion
QA completion
Owner decision
merge
post-merge verification
release preparation
```

Do not skip remaining lifecycle stages.

---

# 164. Post-Remediation Handoff

Normal successful handoff:

```text
ENGINEER
        ↓
AUDITOR
        ↓
QA
        ↓
next governed action
```

Carry:

```text
exact new revision
finding IDs
Engineering Report
checks
known limitations
```

---

# 165. Remediation Reflection

After closure, ask:

```text
Why was the defect possible?

Why was it not caught earlier?

Can deterministic controls catch it earlier?

Did documentation/routing/test coverage fail?

Is a follow-up package justified?
```

---

# 166. Follow-Up Package

Not every process improvement belongs in the remediation PR.

Record:

```text
FOLLOW_UP
VECP-...
```

where a separate bounded hardening package is more appropriate.

---

# 167. No Infinite Remediation Loop

Repeated remediation attempts may indicate:

```text
wrong root cause
wrong architecture
wrong contract
insufficient scope
missing canonical source
```

After repeated failure:

stop patching.

Return to planning.

---

# 168. Escalation Threshold

Escalate from remediation to planning when:

```text
root cause remains unclear
scope repeatedly expands
risk materially increases
architecture must change
acceptance must change
target system changes
routing changes
authority changes
```

---

# 169. Historical Trace

Preserve the chain:

```text
original candidate
↓
finding
↓
remediation package
↓
corrected candidate
↓
re-audit
↓
finding resolution
```

This provides engineering provenance.

---

# 170. Remediation Invariants

```text
REM-INV-001
Remediation begins from current repository/candidate reality.

REM-INV-002
Original evidence is preserved.

REM-INV-003
Root cause is investigated before material correction.

REM-INV-004
Sibling and dependency impact are reviewed.

REM-INV-005
Remediation scope remains bounded.

REM-INV-006
Parent risk floor does not silently decrease.

REM-INV-007
Parent assurance requirement does not silently decrease.

REM-INV-008
Parent acceptance criteria do not silently weaken.

REM-INV-009
Mandatory stop conditions remain active.

REM-INV-010
Auditor does not silently become Engineer.

REM-INV-011
One writer owns overlapping remediation scope.

REM-INV-012
Changed evidence mechanisms do not certify themselves alone.

REM-INV-013
Corrected implementation receives new revision-bound evidence.

REM-INV-014
Old CI does not prove new candidate.

REM-INV-015
Old assurance does not automatically prove new candidate.

REM-INV-016
Finding resolution requires correction plus evidence.

REM-INV-017
Post-merge remediation creates new history; it does not rewrite merged history.

REM-INV-018
Material redesign returns to planning.
```

---

# 171. Final Principle

Remediation is not:

```text
make the red thing green
```

Remediation is:

```text
UNDERSTAND FAILURE
        ↓
BOUND THE CORRECTION
        ↓
PRESERVE GOVERNANCE
        ↓
IMPLEMENT SAFELY
        ↓
PROVE THE DEFECT IS CORRECTED
        ↓
PROVE RELEVANT BEHAVIOR STILL WORKS
        ↓
RE-AUDIT THE EXACT NEW REVISION
```

A good remediation leaves the system:

```text
more correct
more testable
more understandable
and no less governed
```

than before the defect was found.

That is the Vibe Engineering remediation protocol.