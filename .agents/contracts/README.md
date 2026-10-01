---
canonical_id: agents.engineering.execution-contracts
status: ACTIVE
version: 1.0
owner: Rizky
author: OpenAI / ChatGPT
approver: Rizky
scope: repository-engineering
document_class: contract-registry
effective_from: 2026-10-01

authoritative_for:
  - engineering execution artifact semantics
  - implementation contract semantics
  - engineering work-package semantics
  - engineering report semantics
  - assurance report semantics
  - verification matrix semantics
  - release packet semantics
  - engineering handoff artifact chain
  - engineering revision binding

last_reviewed: 2026-10-01
review_cadence: quarterly

depends_on:
  - ../../docs/engineering/engineering-ai-control-plane.md
  - ../../docs/governance/cross-system-risk-classification.md
  - ../../docs/governance/evidence-provenance-model.md
  - ../roles/contracts.json
  - ../expertise/registry.yaml
  - ../routing/task-types.yaml
  - ../../systems/mgbos/docs/engineering/agent-system/workflow.md
  - ../../systems/mgbos/docs/engineering/agent-system/evidence-model.md
  - ../../systems/mgbos/docs/engineering/agent-system/release-gates.md

schemas:
  - implementation-contract.schema.json
  - work-package.schema.json
  - engineering-report.schema.json
  - assurance-report.schema.json
  - verification-matrix.schema.json
  - release-packet.schema.json

supersedes: null
---

# BisnisHub Engineering Execution Contracts v1

## 1. Purpose

Directory ini mendefinisikan structured artifacts yang digunakan untuk mengalirkan engineering work melalui:

```text
Planner
   ↓
Engineer
   ↓
Auditor
   ↓
QA
   ↓
Release Operator
```

Tujuannya bukan membuat paperwork.

Tujuannya adalah memastikan setiap runtime dapat menjawab secara eksplisit:

```text
What was requested?

What is actually in scope?

Which revision is involved?

Which risks apply?

Which canonical sources govern the work?

What was changed?

What was verified?

What remains unknown?

Was the review independent?

Is the candidate actually ready for release preparation?
```

---

# 2. Core Principle

> **No material engineering handoff should depend only on conversational memory.**

Material work SHOULD produce a structured artifact that survives:

```text
runtime change

model change

context reset

handoff

parallel work

review

re-evaluation
```

The artifact becomes the durable engineering boundary.

---

# 3. Contracts Are Not Authority Grants

An artifact saying:

```text
READY_FOR_IMPLEMENTATION
```

does NOT itself authorize:

```text
production access

deployment

merge

payment

external messages

remote database mutation
```

Engineering contracts describe:

```text
scope
requirements
evidence
state
```

Permission remains independently governed.

Canonical:

```text
CONTRACT
≠
PERMISSION
```

---

# 4. Contracts Are Not Business Truth

Engineering artifacts describe the engineering process.

They MUST NOT become authoritative business state.

Example:

```text
Engineering Report:
"payment test passed"
```

does not mean:

```text
customer payment exists
```

Business truth remains owned by MGBOS or another authoritative system.

---

# 5. Contracts Are Not JARVIS Runtime Execution Contracts

This directory governs:

```text
software engineering work
```

It does NOT define JARVIS runtime semantics such as:

```text
ExecutionAttempt

ExecutionReceipt

provider dispatch

durable wait

runtime retry

reconciliation queue
```

Those remain owned by:

```text
systems/jarvis/docs/
```

Do not reuse an engineering artifact as a business-runtime execution contract merely because field names appear similar.

---

# 6. Canonical Artifact Chain

Normal material change:

```text
USER INTENT
     ↓
ROUTING RESULT
     ↓
IMPLEMENTATION CONTRACT
     ↓
WORK PACKAGE(S)
     ↓
ENGINEERING REPORT(S)
     ↓
ASSURANCE REPORT
     ↓
VERIFICATION MATRIX
     ↓
RELEASE PACKET
```

Not every low-risk task requires every artifact.

Artifact requirements remain risk-proportional.

---

# 7. Artifact Responsibilities

| Artifact                | Primary Producer      | Primary Purpose                         |
| ----------------------- | --------------------- | --------------------------------------- |
| Implementation Contract | Planner               | Define bounded intended change          |
| Work Package            | Planner / coordinator | Define one executable writer slice      |
| Engineering Report      | Engineer              | Record actual implementation            |
| Assurance Report        | Auditor               | Record review and residual risk         |
| Verification Matrix     | QA                    | Connect acceptance criteria to evidence |
| Release Packet          | Release Operator      | Assess release readiness                |

---

# 8. Implementation Contract

Implementation Contract answers:

> **What should be built, under which authority, boundaries, risk, and acceptance conditions?**

It contains:

```text
objective

scope

exclusions

canonical sources

routing

risk

invariants

acceptance criteria

planned verification

work-package references

stop conditions
```

It describes intended engineering work.

It does not claim implementation exists.

---

# 9. Work Package

Work Package answers:

> **What exact bounded slice may one writer execute?**

It exists to enforce:

```text
ONE WRITER
=
ONE BRANCH
=
ONE WORKTREE
=
ONE BOUNDED SCOPE
```

A Work Package SHOULD identify:

```text
writer

base revision

branch

worktree

allowed paths

forbidden paths

dependencies

acceptance criteria

required checks

handoff target
```

---

# 10. One Writer Rule

Two active Work Packages MUST NOT intentionally assign the same mutable path range to different concurrent writers unless an explicit integration strategy exists.

Default:

```text
one mutable scope
→ one active writer
```

Read-only Auditor or QA activity does not violate One Writer Rule.

---

# 11. Engineering Report

Engineering Report answers:

> **What did the Engineer actually do?**

It records:

```text
exact revision

actual files changed

implementation summary

decisions

checks run

checks not run

known failures

limitations

residual risk

handoff
```

Engineering Report is evidence.

It does not rewrite the Implementation Contract.

---

# 12. Intended vs Actual

Implementation Contract records:

```text
INTENDED
```

Engineering Report records:

```text
ACTUAL
```

If they differ materially:

```text
SCOPE_DRIFT
```

must be visible.

Do not silently modify the historical Implementation Contract after implementation merely to make it match the diff.

Issue a replacement or amended contract where required.

---

# 13. Assurance Report

Assurance Report answers:

> **Does the exact reviewed revision satisfy the applicable contracts and controls?**

It records:

```text
reviewed revision

review independence

coverage

findings

blocking findings

unverified areas

canonical comparison

residual risk

assurance status
```

Assurance is always revision-bound.

---

# 14. Assurance Independence

Canonical review modes:

```text
INDEPENDENT

SELF_REVIEW

NOT_APPLICABLE
```

`INDEPENDENT` requires factual separation sufficient for the applicable assurance requirement.

A runtime changing:

```text
Engineer
→ Auditor
```

in one sequential session does not automatically become independent.

Record:

```text
SELF_REVIEW
```

---

# 15. Assurance Status

Canonical:

```text
SATISFIED

NOT_SATISFIED

PARTIAL

BLOCKED
```

`SATISFIED` means the assurance requirements represented by this report are satisfied.

It does NOT mean:

```text
production ready
```

unless all release requirements separately exist.

---

# 16. Verification Matrix

Verification Matrix answers:

> **For every acceptance requirement, what was actually tested and what evidence supports the result?**

It connects:

```text
ACCEPTANCE CRITERION
       ↓
VERIFICATION CASE
       ↓
ENVIRONMENT
       ↓
RESULT
       ↓
EVIDENCE
```

---

# 17. Verification Results

Allowed case results:

```text
PASS

FAIL

BLOCKED

NOT_RUN
```

Overall matrix MAY also be:

```text
PARTIAL
```

Canonical:

```text
BLOCKED ≠ PASS

NOT_RUN ≠ PASS
```

---

# 18. Release Packet

Release Packet answers:

> **Is this exact candidate ready to enter an explicitly authorized release action?**

It records:

```text
candidate revision

target

risk

required gates

actual evidence

assurance

QA

recovery

blockers

release recommendation
```

---

# 19. Release Recommendation Is Not Release Permission

Release Packet may say:

```text
READY_FOR_AUTHORIZED_RELEASE
```

This means:

```text
required preparation evidence appears satisfied
```

It does NOT mean:

```text
deploy now without authority
```

Execution authority remains independently governed.

---

# 20. Artifact Identity

Each artifact MUST have:

```text
artifact_id
```

IDs should be unique within the repository/workstream.

Recommended form:

```text
IC-<semantic-id>

WP-<semantic-id>

ER-<semantic-id>

AR-<semantic-id>

VM-<semantic-id>

RP-<semantic-id>
```

Exact generation mechanism may evolve.

---

# 21. Parent References

Artifacts SHOULD preserve lineage.

Example:

```text
IC-payment-allocation-v2

  ↓

WP-payment-command

  ↓

ER-payment-command

  ↓

AR-payment-command

  ↓

VM-payment-command

  ↓

RP-payment-release
```

This creates inspectable engineering provenance.

---

# 22. Revision Binding

Artifacts concerning actual code MUST identify exact repository state.

Preferred:

```text
base_revision

head_revision
```

For uncommitted work:

```text
base_revision

dirty_diff_fingerprint

dirty: true
```

Never claim exact assurance against:

```text
"latest code"
```

without a revision identity.

---

# 23. Immutable Evidence Principle

Completed evidence SHOULD be append-oriented.

Do not rewrite old Engineering Reports or Assurance Reports to describe a newer revision.

Prefer:

```text
new artifact
```

or explicit:

```text
supersedes
```

relationship.

---

# 24. Artifact Status ≠ Runtime State

Artifact status describes the artifact/work.

It does not imply:

```text
deployed

running

enabled

production healthy
```

Runtime status requires runtime evidence.

---

# 25. Canonical Risk

Every material artifact referencing risk MUST use:

```text
R0
R1
R2
R3
R4
R5
```

according to:

```text
docs/governance/cross-system-risk-classification.md
```

Artifacts MUST NOT create local risk meanings.

---

# 26. Routing Binding

Implementation Contract SHOULD preserve the resolved:

```text
profile

task type

concerns

effective risk

roles

required expertise
```

This allows later review to determine whether implementation followed the route actually planned.

---

# 27. Canonical Sources

Implementation and assurance artifacts SHOULD preserve relevant repository-local canonical sources.

Example:

```text
systems/mgbos/docs/architecture/business-invariants.md
```

Do not list historical notes as canonical sources merely because they contain useful detail.

---

# 28. Acceptance Criterion IDs

Acceptance criteria SHOULD use stable IDs:

```text
AC-001
AC-002
AC-003
```

The same IDs SHOULD appear in:

```text
Implementation Contract

Work Package

Verification Matrix
```

This prevents QA from testing a different interpretation than Planner specified.

---

# 29. Check IDs

Verification/check requirements SHOULD also have IDs when useful:

```text
CHK-001
CHK-002
```

This makes evidence easier to reference.

---

# 30. Findings

Assurance findings SHOULD contain:

```text
finding_id

severity

status

path

line or location

trigger

consequence

evidence

recommended correction
```

Finding status:

```text
OPEN

RESOLVED

ACCEPTED_RISK

NOT_APPLICABLE
```

`ACCEPTED_RISK` requires actual authority.

An Auditor cannot unilaterally create accepted risk.

---

# 31. Finding Severity

Engineering finding severity:

```text
INFO

LOW

MEDIUM

HIGH

CRITICAL
```

Severity is not identical to R0–R5.

Risk class describes consequential action/change.

Finding severity describes defect significance within review context.

Do not conflate the two.

---

# 32. Evidence Records

Artifacts may reference concise evidence records containing:

```text
evidence_id

kind

timestamp

executor

command or procedure

environment

result

artifact/reference

limitations
```

Do not embed:

```text
secrets

environment files

customer data

raw production dumps
```

---

# 33. Exact Commands

When a check is executed, preserve the actual command or manual procedure.

Example:

```text
python scripts/governance/validate-agent-governance.py
```

Avoid vague:

```text
tests passed
```

---

# 34. Environment

Evidence SHOULD distinguish:

```text
local-disposable

local-nondisposable

ci

staging

production
```

or another explicitly identified environment.

A local result MUST NOT be presented as hosted CI evidence.

---

# 35. Checks Not Run

Engineering and QA artifacts MUST preserve:

```text
checks_not_run
```

when expected verification was skipped or unavailable.

Each omission SHOULD have:

```text
reason

consequence
```

---

# 36. Blocked Is a Valid State

Contracts explicitly allow:

```text
BLOCKED
```

A runtime MUST NOT manufacture success merely because a structured artifact requires an outcome.

---

# 37. Partial Completion

Engineering work may legitimately be:

```text
PARTIAL
```

Example:

```text
implementation complete

database integration verification blocked
```

Do not collapse partial evidence into either complete success or total failure.

---

# 38. Handoff

Material artifact handoff SHOULD identify:

```text
from_role

to_role

next_action

blockers

allowed_next_action
```

This prevents downstream runtime from inventing its own mission.

---

# 39. Work Package Completion

A Work Package is complete only when:

```text
its implementation scope has ended
+
Engineering Report exists
```

Completion does not imply QA or audit passed.

---

# 40. Implementation Contract Completion

Implementation Contract is not “completed” by implementation.

It remains the planning authority for its revision/scope and may later become:

```text
SUPERSEDED
```

if replaced.

---

# 41. Contract Amendment

If material scope changes:

```text
issue amended/replacement Implementation Contract
```

Do not silently broaden existing scope.

Minor implementation detail within existing objective does not require contract churn.

---

# 42. Work Package Dependencies

Work Packages MAY declare dependencies.

Example:

```text
WP-B
depends_on:
  - WP-A
```

Dependency does not authorize shared mutable editing.

---

# 43. Parallel Work

Parallel packages are allowed when:

```text
scope boundaries are explicit

mutable paths do not conflict

integration order is understood
```

Planner SHOULD avoid parallelism when the work is tightly coupled enough that coordination cost exceeds benefit.

---

# 44. Integration

If multiple Work Packages converge:

```text
integration
```

must itself be treated as engineering work.

The integrated revision requires fresh applicable:

```text
QA

assurance
```

because independent branch evidence does not automatically certify the combined state.

---

# 45. Stale Evidence

Evidence becomes stale when the relevant implementation changes.

Example:

```text
AR-001 reviewed SHA A

Engineer adds commit B

AR-001
≠
assurance for SHA B
```

Affected review must be rerun.

---

# 46. Report-Only Change

A report-only correction that does not alter implementation does not automatically invalidate unrelated application verification.

Evidence invalidation follows affected semantics.

---

# 47. Human Decisions

Where a human decision is required, artifact SHOULD record:

```text
decision_required: true

decision_question

options or consequence
```

Do not fabricate:

```text
owner approved
```

without evidence.

---

# 48. Hidden Chain of Thought

Engineering artifacts MUST NOT require private model chain-of-thought.

Persist:

```text
decision summary

rationale summary

sources

actions

evidence

uncertainty
```

not hidden reasoning traces.

---

# 49. Sensitive Data

Artifacts MUST be safe to store in repository or engineering evidence storage.

Never include:

```text
API keys

access tokens

passwords

customer private records

bank credentials

raw sensitive production payloads
```

Use sanitized identifiers/references.

---

# 50. Schema Version

Each artifact contains:

```text
schema_version
```

Initial:

```text
1
```

Breaking structural changes require a new schema version.

---

# 51. `additionalProperties`

V1 schemas intentionally use strict object shapes for contract-critical fields.

Unexpected fields SHOULD fail validation.

This prevents silent semantic drift.

If a new field becomes necessary:

```text
update schema deliberately
```

rather than relying on arbitrary metadata.

---

# 52. Machine Validation

These JSON Schemas are intended to become part of:

```text
scripts/governance/validate-agent-governance.py
```

Validation SHOULD eventually confirm:

```text
schemas parse

expected artifact types exist

required enums remain valid

required revision fields exist

risk values remain R0-R5

artifact lineage fields remain valid
```

Runtime artifact instances may be validated by adapters/tooling later.

---

# 53. Contract Validation Does Not Prove Truth

A JSON document passing schema means:

```text
STRUCTURALLY VALID
```

not:

```text
FACTUALLY TRUE
```

Example:

```text
"tests passed"
```

can still be false.

Evidence verification remains necessary.

---

# 54. Low-Risk Shortcut

Routine R0/R1 work MAY use a compact artifact or combine planning/reporting where policy permits.

Do not create six files for a typo.

High-risk work SHOULD retain clearer separation.

---

# 55. R4 / R5 Direction

For material R4/R5 changes, default expected chain is:

```text
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

Release Packet follows if release preparation is actually requested.

---

# 56. Financial R5

For financial-truth changes, contracts SHOULD preserve explicit:

```text
financial invariants

authorization boundaries

idempotency expectations

concurrency expectations

reconciliation expectations

independent assurance requirement
```

according to routing.

---

# 57. Governance Changes

Control-plane or validator changes SHOULD preserve:

```text
positive tests

negative mutation tests

bypass review

exact revision
```

in their Engineering/QA artifacts.

A modified validator passing itself is insufficient assurance.

---

# 58. Artifact Location

The schemas live under:

```text
.agents/contracts/
```

because they are part of engineering-agent control plane.

Actual generated execution artifacts SHOULD NOT automatically be committed here.

A future execution evidence directory or external run artifact store may be used.

Do not mix:

```text
schema definitions
```

with:

```text
every runtime execution result
```

---

# 59. Runtime Adapters

Codex, Antigravity, Claude Code, and future runtime adapters MAY serialize these contracts differently for execution context.

They MUST preserve canonical semantics.

Adapter convenience MUST NOT silently drop:

```text
risk

scope

revision

required expertise

acceptance criteria

stop conditions

assurance requirement
```

---

# 60. Final Principle

> **Planner defines intent.  
> Work Package bounds execution.  
> Engineer records reality.  
> Auditor records trust gaps.  
> QA records observed behavior.  
> Release Operator records readiness.**

No artifact may impersonate another stage.

Canonical chain:

```text
INTENT
  ↓
CONTRACT
  ↓
BOUNDED EXECUTION
  ↓
IMPLEMENTATION EVIDENCE
  ↓
ASSURANCE
  ↓
VERIFICATION
  ↓
AUTHORIZED RELEASE DECISION
```
