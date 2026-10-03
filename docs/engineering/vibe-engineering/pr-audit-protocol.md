---
canonical_id: docs.engineering.vibe-engineering.pr-audit-protocol
status: ACTIVE
version: 1.1.1
owner: Rizky
author: OpenAI / ChatGPT
approver: Rizky
scope: repository-engineering
document_class: runbook
effective_from: 2026-10-03

authoritative_for:
  - vibe engineering pull-request audit procedure
  - vibe engineering exact-pr-head review discipline
  - vibe engineering candidate scope-drift review
  - vibe engineering pre-merge assurance coordination
  - vibe engineering PR evidence review
  - vibe engineering self-modifying-evidence review
  - vibe engineering PR-head drift handling
  - vibe engineering owner merge-consideration handoff
  - vibe engineering PR remediation trigger

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
  - ../../governance/documentation-constitution.md
  - ../../governance/canonical-source-map.md
  - ../../governance/cross-system-risk-classification.md
  - ../../governance/evidence-provenance-model.md
  - ../../governance/approval-policy.md
  - ../engineering-ai-control-plane.md
  - ../../../.agents/contracts/README.md
  - ../../../.agents/contracts/engineering-report.schema.json
  - ../../../.agents/contracts/assurance-report.schema.json
  - ../../../.agents/contracts/verification-matrix.schema.json
  - ../../../.agents/contracts/release-packet.schema.json
  - ../../../.agents/routing/README.md
  - ../../../.agents/capabilities/README.md
  - ../../../.agents/roles/contracts.json
  - ../../../AGENTS.md

supersedes: null
---

# Vibe Engineering PR Audit Protocol

## 1. Purpose

This protocol defines how Vibe Engineering audits an actual pull-request candidate before the Owner considers repository integration.

The audit answers:

> **Does this exact PR revision satisfy the applicable engineering contract, architecture, scope, authority boundaries, assurance requirements, and verification expectations?**

The audit does not ask:

> Did the Builder say it is done?

It does not ask:

> Does the diff look reasonable at first glance?

It does not ask:

> Is CI green?

It evaluates the real candidate.

---

# 2. Core Rule

The audit unit is:

```text id="wh7w6i"
ACTUAL PR
+
ACTUAL PR BASE
+
EXACT PR HEAD
+
ACTUAL DIFF
+
APPLICABLE CONTRACT
+
CURRENT EVIDENCE
```

Not:

```text id="mhczhz"
Builder summary
```

Not:

```text id="av0fol"
expected implementation
```

Not:

```text id="g117p8"
stale local branch
```

Not:

```text id="a3ai5x"
previous PR head
```

---

# 3. Session Type

A PR audit uses:

```text id="bej952"
VE_SESSION.PR_AUDIT
```

The normal active canonical role is:

```text id="eflvfy"
auditor
```

If verification work is subsequently performed under QA:

```text id="6yo9j9"
auditor
→ handoff
qa
```

must be explicit.

---

# 4. PR Audit Is Not Merge Authorization

A successful audit does not automatically authorize:

```text id="33upfb"
merge
deployment
production mutation
release
```

It may support:

```text id="aps1d0"
Owner merge consideration
```

when applicable.

Actual repository mutation remains governed by permission and authority.

---

# 5. PR Audit Is Not Release Audit

Repository integration and release are different stages.

A PR may be appropriate for merge while:

```text id="x3zm4w"
production release
```

still requires additional:

- environment verification;
- Release Packet;
- authorization;
- deployment evidence;
- runtime validation.

Do not collapse them.

---

# 6. Start From Repository Reality

When the Owner provides:

```text id="hmsogw"
PR #27
```

treat it as an audit target request.

Do not assume:

- PR exists;
- PR is open;
- PR head is unchanged;
- PR base is correct;
- CI is current;
- implementation report is accurate.

Observe actual repository state first.

---

# 7. Required PR Identity

Before substantive review, determine:

```text id="kzsz6k"
repository
PR number
PR state
PR base branch
PR base SHA where available/relevant
PR head SHA
changed files
actual diff
```

If the expected PR cannot be found:

```text id="g39uz2"
VE_STOP.PR_NOT_FOUND
```

---

# 8. PR Base

Compare actual PR base with the intended integration target.

Typical expected base:

```text id="u5c4qe"
main
```

but actual repository workflow governs.

If the PR targets a materially unexpected base:

```text id="r7eqi4"
VE_STOP.UNEXPECTED_PR_BASE
```

Do not silently audit a candidate against the wrong integration target.

---

# 9. Exact PR Head

Record the exact PR head before audit.

Example:

```text id="9u2rxg"
PR
#27

PR_HEAD_SHA
abc123...
```

Every material audit conclusion is bound to that head.

---

# 10. PR Head Is Immutable Only for the Audit

The PR may receive more commits later.

Therefore:

```text id="ut4grc"
AUDIT TARGET
=
observed PR head at audit time
```

If the PR changes afterward:

```text id="f82cgh"
VE_STOP.PR_HEAD_CHANGED
```

until affected audit/verification is refreshed.

---

# 11. Previous Audit Does Not Automatically Follow New Head

Example:

```text id="7dxp9j"
AUDITED
SHA A
```

Builder pushes remediation:

```text id="guwrmr"
CURRENT HEAD
SHA B
```

Then:

```text id="9p7gu3"
Assurance for SHA A
≠
Assurance for SHA B
```

The previous report remains historical evidence.

---

# 12. Audit Inputs

Retrieve, where applicable:

```text id="3njg17"
Vibe Change Package
Implementation Contract
Work Package(s)
Engineering Report(s)
previous Assurance Report
Verification Matrix
Release Packet if already relevant
actual PR diff
actual final files
current PR checks / CI
canonical sources
routing result
```

Not every low-risk PR requires every artifact.

Requirements remain risk-proportional.

---

# 13. Canonical Artifact Chain

For material work, expected lineage may be:

```text id="6zjrkh"
Implementation Contract
        ↓
Work Package
        ↓
Engineering Report
        ↓
PR candidate
        ↓
Assurance Report
        ↓
Verification Matrix
```

Release Packet is separate and used where actual release preparation applies.

---

# 14. Audit the Candidate, Not the Narrative

An Engineering Report may say:

```text id="3rfmy6"
files_changed:
- A
- B
```

but the PR may contain:

```text id="2gap32"
A
B
C
```

The PR wins as candidate evidence.

This mismatch may indicate:

```text id="uxac7k"
scope drift
stale report
unreported change
```

and must be investigated.

---

# 15. Audit Order

Preferred audit sequence:

```text id="zkp38a"
1. identify PR
2. bind exact head
3. load contract and route
4. inspect changed-file inventory
5. compare scope
6. inspect actual diff
7. inspect critical final files
8. inspect architecture/invariants
9. inspect authority/security boundaries
10. inspect evidence-mechanism changes
11. inspect Engineer evidence
12. inspect tests/negative paths
13. inspect CI for exact candidate
14. record findings
15. determine assurance status
16. hand off to QA where applicable
17. determine Owner-facing next step
```

---

# 16. Stage 1 — Identity Audit

Confirm:

```text id="p75iq4"
repository correct
PR correct
base expected
head recorded
state understood
```

Do not begin deep semantic review before target identity is reliable.

---

# 17. Stage 2 — Contract Audit

Retrieve the applicable:

```text id="gsbz60"
Implementation Contract
```

and:

```text id="d5n6uo"
Work Package
```

where required.

Determine:

```text id="kmxw07"
what was authorized for implementation
what was explicitly excluded
which risk applied
which route applied
which acceptance criteria apply
which checks were required
```

---

# 18. Missing Contract

For work that canonically requires an Implementation Contract, missing contract is a governance defect.

Do not reconstruct one retroactively merely to make the PR auditable.

Depending on context:

```text id="3k64jc"
BLOCK
```

and return to planning/remediation.

---

# 19. Contract Structural Validation

Where machine-readable artifact exists:

validate against current canonical schema.

Check:

```text id="dx8fvm"
required fields
enum validity
artifact IDs
additionalProperties
revision fields
```

Structural validity is necessary.

It is not sufficient.

---

# 20. Contract Semantic Validation

Audit:

```text id="a9vgpa"
target system
workspace
routing profile
task type
concerns
risk
required roles
expertise
scope
canonical sources
acceptance criteria
```

Schema-valid semantic nonsense MUST still fail review.

---

# 21. Target / Profile Compatibility

Hard audit check:

```text id="eb91ir"
target_system
+
workspace
+
routing.profile
```

must be semantically compatible.

Forbidden example:

```text id="9e5l85"
target_system = repository-engineering
workspace = .
routing.profile = mgbos
```

when the canonical `mgbos` profile applies to `systems/mgbos/`.

---

# 22. Route Still Valid

Routing may become stale if canonical routing changed after planning.

Audit SHOULD determine whether:

```text id="6gssgf"
task type still exists
concerns still exist
risk floor remains valid
assurance requirement remains valid
profile still applies
```

Material route drift requires reconciliation.

---

# 23. Risk Floor Audit

Compare planned/effective risk with actual candidate consequence.

Ask:

```text id="8kf2yj"
Did implementation introduce higher consequence?

Did environment change?

Did affected capability expand?

Did external side effect appear?

Did authorization become involved?

Did sensitive data become involved?
```

If actual risk is higher:

```text id="5n18ba"
do not silently preserve lower risk
```

Re-route or remediate.

---

# 24. Scope Audit

Compare:

```text id="a22pzv"
Work Package allowed paths
```

against:

```text id="23bbls"
actual PR changed files
```

Also compare semantic scope, not only paths.

A change may stay inside an allowed directory and still expand semantics materially.

---

# 25. Path Scope Drift

If actual PR changes files outside accepted write scope:

investigate.

Possible outcomes:

```text id="bg1p32"
legitimate contract amendment exists
or
scope drift exists
```

Do not automatically update the contract after the fact to legitimize the diff.

---

# 26. Semantic Scope Drift

Examples:

Contract:

```text id="iqa4k3"
fix local payment allocation idempotency
```

Actual PR also:

```text id="kqht1r"
changes payment authorization rules
```

Even if files overlap, this is semantic scope expansion.

Audit it as such.

---

# 27. Out-of-Scope Cleanup

Incidental cleanup may be harmless.

But broad unrelated refactoring increases:

```text id="gxm3ar"
review surface
regression surface
scope ambiguity
```

Auditor may require removal or explicit amendment depending on consequence.

---

# 28. Final-File Review

Diff shows changes.

Final-file review shows the resulting state.

For critical files, inspect both.

A diff can look correct while final file contains:

- duplicate logic;
- conflicting nearby rule;
- stale fallback;
- bypass path.

---

# 29. Architecture Audit

Check candidate against relevant canonical architecture.

Questions:

```text id="rux0tw"
Does it preserve system boundaries?

Does it introduce a new authority owner?

Does it bypass canonical command path?

Does it create duplicate business truth?

Does it contradict accepted state machine?

Does it bypass adapter boundaries?
```

---

# 30. Canonical Source Audit

Verify the candidate uses the correct semantic owner.

Do not approve behavior because it matches:

```text id="bmr9nm"
historical implementation report
```

when an ACTIVE canonical specification says otherwise.

---

# 31. Documentation Drift

If implementation intentionally changes behavior:

required canonical documentation may need updating.

If code changed but documentation still describes old intended behavior:

```text id="6r0iui"
documentation drift
```

may exist.

---

# 32. Implementation Drift

If canonical docs require behavior not implemented by the PR/current system:

```text id="hyjt40"
implementation drift
```

may remain.

Audit must not hide it.

---

# 33. Invariant Audit

For each material contract invariant:

ask:

```text id="c9d08b"
Is it preserved?

What evidence supports that?

Can the candidate bypass it?
```

Examples:

```text id="sxb4yx"
organization isolation
authorization
idempotency
historical integrity
least privilege
```

---

# 34. Authority Audit

Check whether candidate expands what software/AI can do.

Examples:

```text id="y6uy2j"
new GitHub mutation
new database mutation
new production reachability
new privileged command
new provider side effect
new secret access
```

Authority expansion must be explicit and governed.

---

# 35. Tool Availability Is Not Permission

A candidate integrating a tool does not automatically grant permission to use all tool capabilities.

Review:

```text id="6fd6ks"
capability registration
permission policy
environment guard
approval requirement
```

where applicable.

---

# 36. Approval Audit

If candidate affects approval-required execution, verify:

```text id="nghq5y"
approval mode
trusted evidence requirement
binding
expiry/replay semantics where applicable
fail-closed behavior
```

Do not accept:

```text id="dqrk23"
self-asserted approval JSON
```

as trusted authorization merely because it matches a schema.

---

# 37. Fail-Closed Audit

High-impact uncertainty should fail closed.

Search for:

```text id="yxo1lu"
default allow
missing-case allow
exception fallback
unknown-state allow
unverified-environment allow
```

where candidate touches authority/security.

---

# 38. Security Boundary Audit

For security-sensitive candidate, inspect relevant:

```text id="02rmwd"
identity
authorization
organization scope
secrets
privilege
remote mutation
production environment
untrusted input
```

UI restrictions do not substitute for server-side authorization.

---

# 39. Organization Isolation

For multi-tenant or organization-scoped behavior, review:

```text id="t5gjsf"
read scope
write scope
server guards
RLS / database controls
cross-org negative path
```

as applicable.

---

# 40. Financial Integrity Audit

For financial-truth work, inspect applicable:

```text id="26ktkl"
integer-money semantics
authorization
state eligibility
allocation integrity
idempotency
concurrency
historical integrity
reconciliation
```

according to canonical MGBOS architecture/routing.

---

# 41. State-Machine Audit

Where state transitions apply:

verify candidate does not invent unauthorized transitions.

Check:

```text id="r7kau1"
allowed source state
allowed target state
actor/authority
guard
transaction behavior
history
```

---

# 42. Concurrency Audit

When candidate affects operations that may repeat or race:

review:

```text id="23h92n"
idempotency key
unique constraint
transaction boundary
locking / serialization
retry behavior
duplicate effect
```

as applicable.

---

# 43. Migration Audit

If migrations are present, inspect:

```text id="78bi9n"
migration ordering
existing-data upgrade path
constraints
RLS
grants
types
application compatibility
forward recovery
```

Passing on a clean database does not automatically prove upgrade safety.

---

# 44. Backward Compatibility

Ask whether candidate breaks:

```text id="xv4f03"
existing callers
stored records
API contracts
runtime adapters
older migrations
existing tests
external integrations
```

according to scope.

---

# 45. Test Audit

Do not count tests only.

Review whether tests address actual failure modes.

Questions:

```text id="pw1jxr"
Do tests cover acceptance criteria?

Do tests cover negative paths?

Do tests cover regression?

Do tests exercise the right boundary?

Are important tests mocked too far away?

Did required tests actually run?
```

---

# 46. Positive Tests

Positive tests answer:

```text id="k5vgee"
Does allowed behavior work?
```

They are necessary.

They are often insufficient for governance/security work.

---

# 47. Negative Tests

Negative tests answer:

```text id="8nthod"
Does forbidden behavior remain forbidden?
```

Examples:

```text id="3c3h9p"
unauthorized caller denied
cross-org access denied
unverified approval denied
remote environment denied
duplicate financial effect prevented
```

---

# 48. Regression Tests

A regression test should connect to the actual defect or risk.

Avoid tests that merely exercise unrelated happy path.

---

# 49. Tests Not Run

Retrieve and review:

```text id="mtczz1"
checks_not_run
```

from Engineering Report where applicable.

A skipped relevant check should not disappear from the final summary.

---

# 50. Environment Audit

Evidence should identify where it ran.

Distinguish:

```text id="lsqsq8"
local-disposable
local-nondisposable
CI
staging
production
```

Do not treat local evidence as production evidence.

---

# 51. Destructive Test Audit

If destructive tests exist, confirm:

```text id="n6jp2u"
environment guard
remote detection
fail-closed behavior
disposable target
```

before considering those tests safe.

---

# 52. External-Side-Effect Audit

For candidate that can affect external provider/customer/vendor:

check:

```text id="l13ayw"
sandbox/test mode
idempotency
unknown outcome handling
retry policy
verification
reconciliation
```

where applicable.

---

# 53. AI / Agent Change Audit

For AI-related changes inspect:

```text id="x148zn"
structured output validation
tool allowlists
authority boundary
untrusted context
prompt injection
provider failure
stale evidence
behavioral evaluation
```

Model capability does not lower risk.

---

# 54. Prompt Injection Boundary

If candidate retrieves untrusted text:

verify it cannot silently change:

```text id="hmdm47"
scope
permission
risk
approval
tool policy
system instruction
```

unless explicitly trusted through governance.

---

# 55. Runtime Adapter Audit

Provider/runtime adapters should remain thin.

Audit whether adapter introduces:

```text id="8m1y9z"
local risk semantics
local authority policy
local role meanings
provider-specific governance fork
```

If so, block or remediate.

---

# 56. Evidence Mechanism Audit

Determine whether candidate changes mechanisms that produce or enforce evidence.

Examples:

```text id="mjz0ik"
CI workflow
test harness
governance validator
routing validator
permission resolver
gateway
security checker
contract schema
branch enforcement automation
```

---

# 57. Self-Modifying Evidence Rule

Hard rule:

> **A changed evidence/enforcement mechanism MUST NOT be trusted solely because the changed mechanism passes itself.**

This applies especially to:

```text id="2coxh5"
governance validators
CI definitions
permission enforcement
security checks
```

---

# 58. Evidence Mechanism Review

When evidence mechanism changed, audit SHOULD include as applicable:

```text id="h1tmoq"
semantic diff
old-vs-new comparison
positive test
negative mutation test
bypass search
alternate evidence
independent review where required
```

---

# 59. Validator Weakening

Search for changes that:

```text id="286sra"
remove a check
narrow file discovery
convert error to warning
ignore exception
skip validation
change default from fail to pass
```

A green CI result after such change requires semantic scrutiny.

---

# 60. CI Workflow Audit

When CI itself changes, inspect:

```text id="mdu790"
trigger
permissions
action pinning
paths
conditions
fail behavior
secrets exposure
required commands
```

Do not evaluate only syntax.

---

# 61. Supply-Chain Audit

For CI/action changes, inspect applicable:

```text id="wr8f53"
pinned revisions
permissions
third-party action trust
secret exposure
mutable tags
```

according to repository governance.

---

# 62. Engineering Report Audit

Engineering Report should match actual candidate.

Compare:

```text id="jid377"
base_revision
head
files_changed
implementation_summary
checks_run
checks_not_run
known_failures
limitations
residual_risk
```

against PR reality.

---

# 63. Engineering Report Head

If Engineering Report references:

```text id="37cgzk"
SHA A
```

but PR is:

```text id="720sh8"
SHA B
```

determine why.

Report may be stale.

Do not silently treat it as evidence for B.

---

# 64. Dirty Diff Evidence

If implementation report references uncommitted dirty work, ensure the audited PR actually represents the same final content.

A dirty diff fingerprint is not automatically equivalent to later committed PR head.

---

# 65. CI Audit

Inspect CI/checks for the exact candidate revision.

At minimum determine:

```text id="84ja0u"
workflow/check identity
status
conclusion
candidate SHA
```

Do not report:

```text id="ky8zjb"
CI_PASS
```

as a Vibe package state.

---

# 66. CI Success

CI success means:

> The executed checks in that CI run completed successfully for the identified revision.

It does not mean:

```text id="pbqqtl"
architecture correct
security complete
all requirements verified
merge authorized
production ready
```

---

# 67. Missing CI

If required CI is unavailable or not run:

record it.

Use applicable upstream:

```text id="2go2tv"
REQUIRED_EVIDENCE_UNAVAILABLE
```

where appropriate.

Do not fabricate expected success.

---

# 68. Stale CI

A green run for:

```text id="pj3bu2"
SHA A
```

does not prove:

```text id="51t4p7"
SHA B
```

after candidate changed.

---

# 69. Required Checks

Compare actual PR checks with:

```text id="veb194"
planned checks
routing expectations
branch/repository requirements
```

Do not assume a generic green check suite contains every required validation.

---

# 70. Verification Matrix

QA uses the canonical:

```text id="6vbbon"
Verification Matrix
```

to connect:

```text id="8ui17r"
acceptance criterion
→ verification case
→ environment
→ result
→ evidence
```

---

# 71. Verification Overall Status

Canonical overall values:

```text id="io4kd5"
PASS
FAIL
BLOCKED
PARTIAL
NOT_RUN
```

Vibe Engineering MUST NOT invent:

```text id="g0kt8p"
FULL_PASS
QA_OK
MERGE_PASS
```

---

# 72. Verification `PASS`

`PASS` means the represented verification obligations passed.

It does not automatically mean:

```text id="yswc3z"
assurance satisfied
release authorized
production healthy
```

---

# 73. Verification `PARTIAL`

Treat `PARTIAL` honestly.

Do not summarize it as:

```text id="q7ptaf"
basically passed
```

Determine whether unverified cases are blocking.

---

# 74. Verification `BLOCKED`

Blocked verification means required evidence could not be completed.

It is not PASS.

---

# 75. Verification `NOT_RUN`

If material required verification is `NOT_RUN`:

the candidate should not be presented as fully verified.

---

# 76. Assurance Report

Auditor produces canonical:

```text id="wp4kiw"
Assurance Report
```

where required.

It records:

```text id="pw5c4m"
reviewed revision
reviewer
independence
risk
coverage
findings
unverified areas
residual risk
assurance status
handoff
```

---

# 77. Assurance Revision

`reviewed_revision` MUST identify the actual candidate being reviewed.

If PR head differs:

```text id="oqmp22"
do not issue current assurance against stale revision
```

---

# 78. Assurance Independence

Canonical values:

```text id="3xws03"
INDEPENDENT
SELF_REVIEW
NOT_APPLICABLE
```

Do not create Vibe alternatives.

---

# 79. Same Runtime Self-Review

If the same runtime implemented and then audited sequentially:

default truth is:

```text id="drlmgk"
SELF_REVIEW
```

unless factual independence satisfying canonical requirements truly exists.

A new prompt does not create independence.

---

# 80. Different Provider Does Not Automatically Mean Independent

Using:

```text id="qqhjnp"
Antigravity
→ ChatGPT
```

may strengthen separation.

But canonical independence depends on actual review setup and applicable assurance requirement.

Do not infer it solely from provider names.

---

# 81. Assurance Requirement vs Independence Result

Routing may require:

```text id="ppvhnc"
INDEPENDENT_REQUIRED
```

while actual audit produces:

```text id="8sxj13"
SELF_REVIEW
```

This means the requirement remains unsatisfied.

Do not convert it to `INDEPENDENT` for convenience.

---

# 82. Assurance Status

Canonical values:

```text id="c0xcnk"
SATISFIED
NOT_SATISFIED
PARTIAL
BLOCKED
```

These belong to the Assurance Report.

---

# 83. `SATISFIED`

Use only when the applicable assurance represented by the report is actually satisfied.

It does not mean production release is authorized.

---

# 84. `NOT_SATISFIED`

Use when review identifies unresolved conditions preventing assurance satisfaction.

Typical consequence:

```text id="7zqgjl"
remediation required
```

---

# 85. `PARTIAL`

Use when review coverage/evidence is incomplete but some assurance work is valid.

Do not report it as successful completion.

---

# 86. `BLOCKED`

Use when audit cannot be completed because material prerequisite/evidence is unavailable.

---

# 87. Findings

Assurance findings should use canonical schema semantics.

Typical fields include:

```text id="j1j4sc"
finding ID
severity
status
location
trigger
consequence
evidence
recommended correction
```

Use actual schema when constructing formal artifact.

---

# 88. Finding Severity

Canonical:

```text id="tt3hjj"
INFO
LOW
MEDIUM
HIGH
CRITICAL
```

Do not create a conflicting formal severity enum.

---

# 89. Blocking Finding

“Blocking” is a consequence of a finding, not a replacement severity.

A `HIGH` finding may block depending on context.

A `CRITICAL` finding will normally be treated accordingly.

Use actual canonical report structure.

---

# 90. Finding Status

Canonical values include:

```text id="qa11a7"
OPEN
RESOLVED
ACCEPTED_RISK
NOT_APPLICABLE
```

Do not mark:

```text id="ccwdtm"
ACCEPTED_RISK
```

without actual authority.

Auditor cannot accept consequential risk unilaterally.

---

# 91. Unverified Areas

Assurance Report must not hide what was not reviewed.

Examples:

```text id="e4xs3o"
production provider behavior not verified
manual branch-protection setting not inspected
real migration upgrade path not executed
```

Unverified does not mean failed.

It also does not mean passed.

---

# 92. Residual Risk

Residual risk should describe known remaining engineering concern.

Do not use:

```text id="0t2wib"
none
```

automatically because tests passed.

Consider actual scope and evidence.

---

# 93. Acceptance Criterion Traceability

For every blocking acceptance criterion:

determine:

```text id="d8c1h7"
implemented?
verified?
evidence?
revision?
```

The Auditor should be able to trace:

```text id="4ux20v"
AC-001
→ implementation
→ test / observation
→ candidate revision
```

---

# 94. Check Traceability

Likewise:

```text id="0vddya"
CHK-001
```

should map to actual evidence.

If planned check was not run:

record why.

---

# 95. Contract vs Actual

Compare:

```text id="8he3i8"
INTENDED
Implementation Contract
```

with:

```text id="r7tl3a"
ACTUAL
Engineering Report + PR
```

Material drift requires explicit handling.

---

# 96. Scope Drift

If Engineering Report contains:

```text id="9qpd5a"
scope_drift
```

review it carefully.

Do not accept drift merely because Builder documented it.

The drift may still require:

- remediation;
- contract amendment;
- new Work Package;
- Owner decision.

---

# 97. Missing Scope Drift Declaration

If actual diff materially exceeds contract but Engineering Report says no drift:

this is itself an audit concern.

---

# 98. Requirement Weakening

Look for implementation that technically makes tests pass by weakening:

```text id="ti0st4"
criterion
validator
guard
test expectation
schema
```

instead of satisfying the intended requirement.

---

# 99. Test-Only Weakening

Changing a test so failing behavior becomes accepted is not automatically a valid fix.

Audit whether canonical requirement changed.

If not:

```text id="u70dxq"
test weakening
```

may be a defect.

---

# 100. Error Handling Audit

Review whether candidate:

```text id="e0gy1l"
swallows errors
converts failures to success
logs without stopping
returns empty/default success
```

where failure should propagate.

---

# 101. Fail-Open Fallback

Search high-risk paths for fallback such as:

```text id="qs3d4b"
if validator fails:
    allow
```

or:

```text id="w6x2du"
if permission unknown:
    continue
```

These are strong red flags.

---

# 102. Default Value Audit

Defaulting missing security/risk fields can hide unsafe state.

Example:

```text id="0kkl4q"
unknown approval mode
→ NONE
```

may be unsafe.

Audit defaults against canonical policy.

---

# 103. Environment Guard Audit

If destructive/local-only action exists, verify:

```text id="3u8snn"
environment identity
remote URL detection
guard order
fail closed
```

The destructive operation should not begin before guard validation.

---

# 104. Secret Audit

Inspect candidate for accidental:

```text id="qk4x0y"
hardcoded tokens
credentials
.env content
secret logging
```

Never reproduce secrets in audit output.

---

# 105. Dependency Audit

Check whether changed code has material consumers not covered.

Examples:

```text id="nsbsei"
schema → parser
validator → CI
function → callers
migration → app version
role contract → runtime adapter
```

---

# 106. Reverse-Reference Audit

For critical semantic change:

search reverse references.

This is especially important for:

```text id="9v6ln2"
renamed token
new enum
schema field
permission identifier
capability identifier
routing concern
```

---

# 107. Dead Path Audit

A correct new function is not enough if:

```text id="y5m0lo"
runtime never calls it
```

Verify affected path is actually wired where relevant.

---

# 108. Bypass Audit

Ask:

```text id="246hnp"
Can behavior bypass the new guard?

Can direct API/RPC bypass UI check?

Can alternate command avoid validator?

Can old adapter path skip policy?
```

For security/governance work this is critical.

---

# 109. Sibling Audit

If one path had a defect:

review sibling paths sharing the same pattern.

The fix may be incomplete if the root cause exists elsewhere.

---

# 110. Documentation Coupling

If candidate changes canonical vocabulary/behavior:

check reverse documentation dependencies.

Do not leave active docs contradicting new behavior.

---

# 111. Runtime Claim Audit

Do not allow PR text to claim:

```text id="2w0qfa"
production ready
fully autonomous
secure
complete
```

unless actual evidence supports those claims.

Code existence does not prove runtime deployment.

---

# 112. Current vs Target

Audit documentation changes for maturity language:

```text id="mv3ouy"
CURRENT
TARGET
PROPOSED
EXPERIMENTAL
NOT VERIFIED
```

A detailed future design must not be presented as current implementation.

---

# 113. Provider Claim Audit

If PR documents provider capabilities:

verify current official behavior where material.

Do not let stale remembered provider behavior become repository architecture.

---

# 114. Historical Evidence Audit

Implementation reports and previous PRs are evidence.

They do not override ACTIVE canonical semantics.

---

# 115. Branch Protection and Repository Gates

Where repository gate settings are material and observable:

verify required checks/settings against current repository reality.

Do not infer branch-protection state from documentation alone.

---

# 116. Required Check Rename

If CI job/check names change:

consider impact on branch protection or required status checks.

A workflow may pass while branch protection references stale check identity.

This must be reviewed where applicable.

---

# 117. GitHub Actions Permission Audit

For workflow changes inspect whether token permissions expanded.

Prefer least privilege.

A workflow gaining write access is an authority-relevant change.

---

# 118. Third-Party Actions

Where external actions are introduced:

review:

```text id="s0t4lb"
source
pinning
permissions
secrets exposure
necessity
```

according to repository security posture.

---

# 119. Generated Files

If PR contains generated artifacts:

determine:

```text id="h2sjvr"
source of generation
whether committed file is expected
whether generated output matches source
```

Avoid manually editing derived artifact when source should be changed.

---

# 120. Lockfiles

Dependency changes should include expected lockfile behavior.

Audit unexpected dependency churn.

---

# 121. New Dependency

For new code dependency consider:

```text id="vnr69r"
necessity
maintenance
security
license where relevant
bundle/runtime impact
```

according to scope.

---

# 122. Performance

Where material, inspect candidate for:

```text id="5urb7n"
unbounded query
N+1
large loop
expensive repeated call
blocking operation
```

Performance is risk-proportional.

Do not make every PR a performance audit.

---

# 123. Observability

For critical paths, check whether failures remain observable.

Avoid changes that:

```text id="dlh8xs"
swallow failure
remove logs/events required for recovery
destroy evidence
```

while respecting sensitive-data rules.

---

# 124. Recovery

For high-impact change ask:

```text id="kldnfu"
If this fails after integration, how do we recover?
```

Recovery may require:

```text id="qgc2bf"
revert
forward fix
restore
reconciliation
disable
```

---

# 125. Rollback Is Not Always Enough

External or financial effects may survive code rollback.

Audit should distinguish:

```text id="kfqisz"
code rollback
```

from:

```text id="9zafhp"
business/data recovery
```

---

# 126. Draft PR

A draft PR may be audited partially.

State clearly:

```text id="pbemks"
PR is draft
```

and what was reviewed.

Do not invent:

```text id="dh73sg"
AWAITING_READY_STATE
```

as a formal status.

---

# 127. Review Update

If PR receives remediation:

audit the new exact head.

Do not merely inspect the new commit without reassessing affected final state.

---

# 128. Remediation Trigger

Material unresolved finding should transition work to:

```text id="m4nftm"
VE_SESSION.REMEDIATION
```

Use the remediation protocol.

Do not repair implementation silently while remaining in Auditor role and then call the review independent.

---

# 129. Auditor Must Not Become Hidden Engineer

If Auditor edits candidate:

the review boundary changes.

Correct approach:

```text id="vj11ga"
Auditor records finding
→ handoff Engineer
→ Engineer remediates
→ new candidate
→ Auditor re-audits
```

This preserves factual assurance.

---

# 130. Self-Review Exception

Self-review can still be useful.

When actual setup is self-review:

record:

```text id="gu7oe3"
SELF_REVIEW
```

Do not overstate assurance.

---

# 131. High-Risk Work

For material R4/R5 work, expect stronger chain where applicable:

```text id="c8ib3z"
Implementation Contract
↓
Work Package
↓
Engineering Report
↓
Assurance Report
↓
Verification Matrix
```

Independent assurance requirements come from routing.

---

# 132. Low-Risk Work

Low-risk changes may use proportionate review.

Do not create unnecessary ceremony.

But low diff size does not automatically imply low risk.

---

# 133. Documentation-Only PR

A Markdown PR may still alter:

```text id="uff80s"
governance
authority
risk semantics
routing
architecture
```

Audit semantic consequence.

Do not classify as trivial solely because files end in `.md`.

---

# 134. Governance PR

A governance PR requires special attention to:

```text id="5kf6hr"
validator weakening
route changes
role changes
capability changes
permission changes
approval behavior
CI enforcement
self-validation
```

---

# 135. Migration PR

Migration PR audit should inspect both:

```text id="75t1yw"
clean apply
```

and:

```text id="h8flb6"
upgrade from existing state
```

where applicable.

---

# 136. Frontend PR

Frontend audit may inspect:

```text id="4g71v7"
UI behavior
accessibility
responsive state
error state
loading state
security boundary assumptions
```

But UI checks do not replace backend authorization verification.

---

# 137. Backend PR

Backend audit may inspect:

```text id="yq7b2g"
validation
authorization
transactionality
state guards
idempotency
error semantics
```

according to scope.

---

# 138. Agent-System PR

Agent/control-plane PR may inspect:

```text id="qqlmfl"
role semantics
routing
context boundary
tool permissions
structured artifacts
provider neutrality
behavioral evals
bypass routes
```

---

# 139. Assurance Report Required Fields

When producing a formal Assurance Report, current schema requires:

```text id="5nf1yg"
schema_version
artifact_type
artifact_id
engineering_report_id
reviewed_revision
reviewer
independence
risk
coverage
findings
unverified_areas
residual_risk
assurance_status
handoff
```

Follow the actual schema.

Do not add arbitrary properties.

---

# 140. Assurance Report Artifact Type

Required:

```json id="otq336"
"artifact_type": "ASSURANCE_REPORT"
```

Current schema version:

```json id="nd23yw"
"schema_version": 1
```

---

# 141. Assurance Finding Severity

Formal finding severity must use:

```text id="mciiv9"
INFO
LOW
MEDIUM
HIGH
CRITICAL
```

Do not serialize:

```text id="50aknc"
BLOCKER
```

as severity unless schema changes canonically.

---

# 142. Verification Matrix Required Fields

Current schema requires:

```text id="2xb1qz"
schema_version
artifact_type
artifact_id
implementation_contract_id
verified_revision
verifier
environment
cases
overall_status
unverified_gates
handoff
```

---

# 143. Verification Artifact Type

Required:

```json id="khinqi"
"artifact_type": "VERIFICATION_MATRIX"
```

Current schema version:

```json id="qxw2jt"
"schema_version": 1
```

---

# 144. Audit Output Must Separate Three Things

Always distinguish:

```text id="k14rv4"
AUDIT FINDINGS
```

from:

```text id="lvpphh"
ASSURANCE STATUS
```

from:

```text id="m3wkx4"
VERIFICATION STATUS
```

These are related but not interchangeable.

---

# 145. Owner-Facing Result

The Owner does not need the entire audit log.

Summarize:

```text id="21k4gh"
PR
EXACT HEAD
RISK
WHAT CHANGED
ASSURANCE
VERIFICATION
CI
BLOCKING FINDINGS
UNVERIFIED AREAS
SAFE NEXT ACTION
```

---

# 146. No Formal `READY_TO_MERGE` Verdict

Vibe Engineering MUST NOT create:

```text id="4pb1th"
AUDIT_VERDICT.READY_TO_MERGE
```

or an equivalent competing machine enum.

Instead use canonical evidence.

Example:

```text id="16wg8z"
ASSURANCE
SATISFIED

VERIFICATION
PASS

REQUIRED PR CHECKS
PASS

BLOCKING FINDINGS
none observed

NEXT GOVERNED ACTION
Owner merge consideration
```

---

# 147. Owner Merge Consideration

The phrase:

```text id="cfpevi"
READY FOR OWNER MERGE CONSIDERATION
```

may be used as human-facing presentation when evidence supports it.

It is not a schema enum.

It does not grant merge authority.

---

# 148. When Merge Consideration Is Not Appropriate

Do not present the candidate as ready for Owner merge consideration when any applicable condition remains unresolved, such as:

```text id="ke5wnv"
assurance NOT_SATISFIED
required independent assurance missing
verification FAIL
blocking verification PARTIAL/BLOCKED
required CI failing
scope drift unresolved
higher risk unresolved
authority expansion unresolved
critical/high blocking finding open
PR head changed
```

---

# 149. Partial Verification Judgment

Not every `PARTIAL` matrix universally blocks merge.

Determine whether missing gates are relevant to the intended repository integration.

Do not convert PARTIAL to PASS.

State what remains unverified and whether canonical policy permits proceeding.

---

# 150. Accepted Risk

A finding may be marked:

```text id="873c45"
ACCEPTED_RISK
```

only with actual authorized risk acceptance.

Owner-friendly text alone is not enough when canonical approval/evidence requires more.

---

# 151. Owner Decision Required

If an unresolved issue requires Owner judgment:

present:

```text id="t3po4y"
OWNER DECISION NEEDED
```

with:

```text id="9hsy71"
question
options
impact
risk
safe default
```

Do not force a technical micro-decision onto Owner unnecessarily.

---

# 152. Audit Blocking Result

If candidate cannot proceed:

Owner-facing:

```text id="ll05uj"
REMEDIATION NEEDED
```

or:

```text id="eddu3q"
BLOCKED
```

depending on cause.

Then hand off to remediation.

---

# 153. Evidence Unavailable

When audit cannot obtain required evidence:

do not conclude failure unless evidence of failure exists.

Use:

```text id="c99lr1"
BLOCKED
```

or applicable canonical status.

---

# 154. Audit of PR Description

PR description is supporting context.

Audit whether it accurately describes:

```text id="g44lhf"
objective
scope
risk
tests
limitations
```

But PR body is not canonical truth.

---

# 155. Commit Message Audit

Commit messages may aid provenance.

They do not replace diff inspection.

---

# 156. Generated AI Summary

AI-generated PR summaries are orientation aids.

They are not assurance evidence by themselves.

---

# 157. Exact-Head Recheck Before Final Audit Output

Immediately before issuing the final Owner-facing audit result:

```text id="z58uj4"
refresh PR head
```

If it changed:

```text id="09i386"
VE_STOP.PR_HEAD_CHANGED
```

and do not issue stale final assurance.

---

# 158. Exact CI Recheck

Also recheck relevant candidate checks after final head is confirmed.

Avoid race:

```text id="7riq4r"
audit old head
new push arrives
old CI green
assistant says ready
```

---

# 159. Race-Safe Finalization

Preferred:

```text id="t1wzml"
fetch current head
↓
confirm expected head
↓
fetch current checks
↓
finalize audit
```

as close together as tooling reasonably permits.

---

# 160. Re-Audit Scope After Remediation

A remediation may require:

```text id="lsllqe"
focused re-audit
```

or:

```text id="wz2umz"
broader re-audit
```

depending on changed semantics.

Do not always restart everything.

Do not always review only the changed line.

Use impact analysis.

---

# 161. Finding Closure

A finding is resolved only when:

```text id="7akxis"
correction exists
+
candidate revision contains it
+
required evidence supports it
```

Builder saying:

```text id="9cj6pp"
fixed
```

is insufficient.

---

# 162. Finding Reopen

If remediation exposes incomplete fix:

finding may remain open or be reopened according to formal artifact practice.

Do not create a false closure trail.

---

# 163. New Finding During Re-Audit

A new legitimate finding discovered during remediation review should be recorded.

Do not ignore it because it was absent from initial audit.

---

# 164. Scope of Auditor Repair

Auditor may suggest correction.

Auditor SHOULD NOT silently edit the candidate while continuing to claim independent assurance.

Preserve role separation.

---

# 165. QA Handoff

When assurance is sufficiently complete for verification:

handoff should identify:

```text id="f4ebnv"
Implementation Contract
exact candidate revision
acceptance criteria
known findings
required checks
unverified areas
```

---

# 166. QA Does Not Replace Audit

QA answers:

```text id="h8ljmi"
Does observed behavior satisfy acceptance criteria?
```

Audit additionally asks:

```text id="fsnj95"
Does candidate preserve contracts, authority, architecture, and risk controls?
```

Both may be required.

---

# 167. Audit Does Not Replace QA

A convincing code review cannot substitute for required executable verification.

---

# 168. Release Handoff

When repository integration/release preparation follows:

pass:

```text id="8jwt94"
exact candidate
risk
Assurance Report
Verification Matrix
current checks
known residual risk
recovery information
```

Release operator still performs its own governed stage.

---

# 169. Audit Persistence

Material audit output SHOULD survive conversation reset through structured artifacts or repository-backed evidence.

Do not leave critical findings only in chat.

---

# 170. Hidden Chain of Thought

Audit artifact should preserve:

```text id="tz6xbj"
finding
evidence
impact
recommended correction
rationale summary
```

not private chain-of-thought.

---

# 171. Sensitive Data

Audit output MUST NOT expose:

```text id="yh6fgb"
tokens
passwords
secret values
raw private customer records
bank credentials
```

If a secret leak is found:

report the location/classification safely without reproducing the secret.

---

# 172. Audit Checklist — Identity

```text id="44j0ks"
[ ] repository confirmed
[ ] PR confirmed
[ ] PR state observed
[ ] expected base confirmed
[ ] exact head recorded
[ ] changed files retrieved
[ ] actual diff retrieved
```

---

# 173. Audit Checklist — Contract

```text id="i2zq0q"
[ ] Implementation Contract identified
[ ] Work Package identified where required
[ ] schemas valid
[ ] target/workspace/profile compatible
[ ] task type valid
[ ] concerns valid
[ ] risk floor valid
[ ] roles valid
[ ] expertise valid
[ ] canonical sources valid
[ ] acceptance criteria identified
[ ] required checks identified
```

---

# 174. Audit Checklist — Scope

```text id="tlqf27"
[ ] changed files within accepted scope
[ ] semantic scope within objective
[ ] excluded paths untouched
[ ] unrelated cleanup assessed
[ ] scope drift declared honestly
```

---

# 175. Audit Checklist — Architecture

```text id="2enmvq"
[ ] system boundary preserved
[ ] canonical owner respected
[ ] no duplicate truth introduced
[ ] invariants preserved
[ ] state transitions valid where applicable
[ ] adapter/policy boundary preserved
```

---

# 176. Audit Checklist — Authority / Security

```text id="jadx1p"
[ ] permission boundary preserved
[ ] approval boundary preserved
[ ] fail-closed behavior preserved
[ ] organization isolation preserved where applicable
[ ] remote/production authority not silently expanded
[ ] secrets not exposed
[ ] bypass paths reviewed
```

---

# 177. Audit Checklist — Evidence

```text id="3rl59q"
[ ] Engineering Report matches candidate
[ ] checks_run reviewed
[ ] checks_not_run reviewed
[ ] known failures reviewed
[ ] limitations reviewed
[ ] evidence is revision-bound
[ ] self-modifying evidence mechanism identified
[ ] alternate/negative evidence reviewed where required
```

---

# 178. Audit Checklist — Verification

```text id="aq4cll"
[ ] blocking ACs trace to verification
[ ] positive paths covered
[ ] negative paths covered where required
[ ] regression path covered
[ ] environment identified
[ ] unverified gates explicit
[ ] Verification Matrix status truthful
```

---

# 179. Audit Checklist — CI

```text id="v05pfo"
[ ] relevant CI exists
[ ] CI bound to exact candidate
[ ] required checks completed
[ ] failures investigated
[ ] skipped/cancelled checks understood
[ ] workflow changes reviewed semantically
```

---

# 180. Audit Checklist — Assurance

```text id="cwfsq5"
[ ] reviewed_revision exact
[ ] reviewer identity explicit
[ ] independence truthful
[ ] risk correct
[ ] coverage explicit
[ ] findings recorded
[ ] unverified areas recorded
[ ] residual risk recorded
[ ] assurance_status canonical
```

---

# 181. Audit Checklist — Finalization

```text id="tgd4br"
[ ] PR head refreshed
[ ] head unchanged
[ ] current checks refreshed
[ ] no stale evidence presented as current
[ ] Owner-facing result concise
[ ] next governed action explicit
```

---

# 182. Owner-Facing PASS Pattern

When evidence supports merge consideration:

```text id="4d8qb6"
PR
#27

AUDITED HEAD
<sha>

RISK
R3

ASSURANCE
SATISFIED

INDEPENDENCE
INDEPENDENT
or
SELF_REVIEW

VERIFICATION
PASS

CI
required candidate checks passed

BLOCKING FINDINGS
none observed

UNVERIFIED
<none / explicit items>

NEXT GOVERNED ACTION
Owner merge consideration
```

Use the actual values.

---

# 183. Owner-Facing Remediation Pattern

```text id="yw0v6m"
PR
#27

AUDITED HEAD
<sha>

ASSURANCE
NOT_SATISFIED

VERIFICATION
FAIL / PARTIAL / applicable state

BLOCKING FINDINGS
<summary>

ROOT ISSUE
<summary>

NEXT GOVERNED ACTION
VE_SESSION.REMEDIATION
```

---

# 184. Owner-Facing Blocked Pattern

```text id="3j9m01"
PR
#27

AUDIT
BLOCKED

REASON
required candidate CI unavailable

WHAT WAS REVIEWED
...

WHAT REMAINS UNVERIFIED
...

NEXT GOVERNED ACTION
obtain required evidence
```

Do not call it failure unless failure was observed.

---

# 185. Owner-Facing Self-Review Pattern

If review is not independent:

```text id="ojhsk9"
ASSURANCE INDEPENDENCE
SELF_REVIEW
```

Do not hide this from Owner when independence matters.

---

# 186. Independent Requirement Not Met

If routing requires:

```text id="s3u8hm"
INDEPENDENT_REQUIRED
```

but actual report is:

```text id="iqn2c7"
SELF_REVIEW
```

Owner-facing result must clearly say:

```text id="j5f5ma"
required independent assurance remains unresolved
```

The candidate is not ready for the governed next step requiring that assurance.

---

# 187. No Automatic Merge

Vibe PR Audit Protocol never means:

```text id="cnhr3j"
audit passed
→ auto merge
```

unless a future separately governed automation explicitly establishes that authority.

Current method preserves Owner/accountable merge decision where applicable.

---

# 188. No Automatic Remediation Expansion

Likewise:

```text id="358z9h"
audit fails
→ AI changes anything needed
```

is forbidden.

Remediation remains bounded.

---

# 189. PR Audit Invariants

```text id="6gbia5"
PR-INV-001
Audit the actual PR, not the Builder narrative.

PR-INV-002
Every material audit is bound to exact PR head.

PR-INV-003
Changed PR head invalidates affected prior assurance.

PR-INV-004
Schema validity does not imply semantic validity.

PR-INV-005
Target system and routing profile must remain compatible.

PR-INV-006
Actual risk may not silently exceed planned risk.

PR-INV-007
Scope drift must remain visible.

PR-INV-008
Audit must inspect authority/security where affected.

PR-INV-009
CI success is evidence, not universal approval.

PR-INV-010
Changed evidence mechanisms cannot certify themselves alone.

PR-INV-011
Self-review is not independent assurance.

PR-INV-012
Audit does not replace QA.

PR-INV-013
QA does not replace audit.

PR-INV-014
Release readiness does not grant release authority.

PR-INV-015
Auditor does not silently repair while claiming independent review.

PR-INV-016
Unknown or unavailable required evidence does not become PASS.

PR-INV-017
Final Owner-facing result must be race-aware and revision-bound.

PR-INV-018
No Vibe-specific READY_TO_MERGE machine verdict is created.
```

---

# 190. Anti-Pattern — Audit by Summary

Forbidden:

```text id="0kkms5"
Builder says:
"changed 3 files, tests pass"

Auditor:
"looks good"
```

Use actual PR/evidence.

---

# 191. Anti-Pattern — Audit by CI Only

Forbidden:

```text id="9ky4ai"
all green
therefore safe
```

CI cannot detect every semantic defect.

---

# 192. Anti-Pattern — Old Head

Forbidden:

```text id="w2fm44"
audited commit A
PR now commit B
still report ready
```

Use:

```text id="jmd9rb"
VE_STOP.PR_HEAD_CHANGED
```

---

# 193. Anti-Pattern — Auditor Fixes Directly

Forbidden:

```text id="lvxy3u"
Auditor finds bug
Auditor patches it
Auditor calls review independent
```

Use explicit Engineer remediation.

---

# 194. Anti-Pattern — Different Model Means Independent

Forbidden:

```text id="8i1ko7"
Antigravity implemented
ChatGPT reviewed
therefore INDEPENDENT
```

Provider separation alone is insufficient.

---

# 195. Anti-Pattern — Contract Retrofitting

Forbidden:

```text id="xowwm6"
PR changed extra files
therefore edit contract to include them
```

Investigate scope drift first.

---

# 196. Anti-Pattern — Validator Self-Certification

Forbidden:

```text id="mjkzhg"
validator changed
new validator says PASS
therefore governance safe
```

Review bypass/negative behavior independently.

---

# 197. Anti-Pattern — Unverified Becomes Non-Blocking by Default

Forbidden:

```text id="dgabdc"
could not test it
probably okay
```

Determine whether unverified area blocks applicable assurance/verification.

---

# 198. Anti-Pattern — Owner Must Read Everything

Do not dump hundreds of lines of raw diff analysis onto Owner by default.

Owner output should be concise.

Audit evidence remains available underneath.

---

# 199. Completion Condition

A PR audit procedure is complete when:

```text id="7yw0q6"
exact candidate identified
contract/route reviewed
scope reviewed
semantic diff reviewed
authority/security reviewed where applicable
evidence reviewed
CI reviewed
findings recorded
assurance status truthful
verification state known or explicitly pending
PR head rechecked
next governed action explicit
```

---

# 200. Final Principle

A pull request is not ready for trust because:

```text id="rv5oaz"
the code looks clean
the model is confident
the Builder says done
CI is green
```

Trust comes from alignment among:

```text id="x89sy6"
INTENT
+
CANONICAL AUTHORITY
+
BOUNDED CONTRACT
+
ACTUAL DIFF
+
EXACT REVISION
+
EVIDENCE
+
ASSURANCE
+
VERIFICATION
```

Only then should the Owner receive a simple conclusion about the next governed action.

That is the Vibe Engineering PR audit protocol.