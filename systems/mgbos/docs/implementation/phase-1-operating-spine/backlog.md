---
canonical_id: teestock.implementation.phase1-operating-spine-backlog
status: ACTIVE
version: 1.0
owner: Rizky
author: OpenAI / ChatGPT
approver: Rizky
scope: mgbos-teestock-phase1
document_class: implementation-backlog
effective_from: 2026-09-30
authoritative_for:
  - phase-1 execution backlog
  - phase-1 task sequencing
  - phase-1 task boundaries
  - phase-1 task acceptance criteria
  - phase-1 task dependencies
  - antigravity execution handoff
last_reviewed: 2026-09-30
review_cadence: after-each-p0-task
depends_on:
  - operating-spine-plan.md
  - current-operating-spine-audit.md
  - ../../architecture/domain-map-capability-ownership.md
  - ../../architecture/business-state-machines.md
  - ../../architecture/business-invariants.md
  - ../../architecture/command-event-model.md
  - ../../architecture/permission-authorization-model.md
supersedes: null
implementation_status: READY_FOR_EXECUTION
---

# Phase 1 — Operating Spine Backlog v1.0

## 1. Purpose

Dokumen ini mengubah hasil architecture + audit menjadi backlog engineering yang bounded.

Setiap item harus cukup jelas untuk diberikan kepada AntiGraphity tanpa meminta agent menebak:

- business intent;
- canonical semantics;
- scope;
- likely affected areas;
- acceptance criteria;
- test expectations;
- dan stop condition.

---

# 2. Execution Principle

Canonical execution pattern:

```text
ONE BACKLOG ITEM
        ↓
AUDIT CURRENT CODE
        ↓
IMPLEMENT SMALLEST CORRECT CHANGE
        ↓
TEST
        ↓
VERIFY
        ↓
REPORT
        ↓
STOP
```

AntiGraphity MUST NOT automatically continue to the next backlog item.

---

# 3. Priority Vocabulary

```text
P0
Launch-spine integrity blocker

P1
Founder-control capability

P2
Deterministic automation

P3
AI cognitive leverage
```

This backlog contains:

```text
P0 ONLY
```

---

# 4. Backlog Sequence

```text
P0-01 Lead → Requirement Continuation
P0-02 Authoritative Order Lifecycle
P0-03 Vendor-Backed Production Assignment
P0-04 Assignment Acceptance / Reassignment
P0-05 Fulfillment Readiness Guard
P0-06 Governed Work Order / SPK
P0-07 Clean Happy-Path E2E
P0-08 Operator Acceptance Test
```

Default execution order is strict.

---

# 5. Global Implementation Rules

Every item MUST preserve:

```text
organization isolation
RLS
RBAC
integer-IDR money semantics
immutable historical snapshots
Cost Trilogy
audit history
idempotency where applicable
command-based mutation
canonical state semantics
```

---

# 6. Global Non-Goals

Do not introduce during Phase 1 unless a real blocker is proven:

```text
Opportunity
generic Project
generic Partner
full Product/Catalog
Creator
Royalty
Affiliate
generic Exception domain
JARVIS mutation runtime
microservices
Kafka
Temporal
new workflow engine
```

---

# 7. Migration Rule

If database behavior must change:

```text
CREATE NEW FORWARD MIGRATION
```

Never alter an already-applied historical migration merely to rewrite behavior.

---

# 8. Test Rule

Each task should use only the test layers relevant to the changed behavior.

Possible layers:

```text
domain test
validation test
permission test
pgTAP/database test
server-action test
integration/E2E
production build
```

Do not create test ceremony unrelated to the task.

---

# 9. Reporting Rule

Every AntiGraphity task must finish with:

```text
IMPLEMENTED

FILES CHANGED

MIGRATIONS

TESTS RUN

VERIFICATION RESULT

KNOWN LIMITATIONS

NEXT DEPENDENCY
```

---

# P0-01 — Lead → Requirement Continuation

## 10. Problem

Lead and Requirement already exist and are structurally linkable.

Current gap:

```text
Lead
 ↓
operator manually navigates
 ↓
Requirement
 ↓
operator re-selects context
```

Founder/operator remains workflow middleware.

---

## 11. Current Evidence

Current implementation already includes:

```text
convertLeadAction(...)
convert_lead_to_customer(...)

requirements.lead_id
requirements.customer_account_id

RequirementForm lead dropdown
RequirementForm customer dropdown
```

No new root entity is required.

---

## 12. Target Behavior

From an eligible Lead:

```text
Lead Detail
   ↓
Continue to Requirement
   ↓
Requirement creation
with trusted context prefilled
```

---

## 13. State Eligibility

Continuation must respect canonical Lead lifecycle.

At minimum:

```text
QUALIFIED
```

must be supported.

If converted Customer linkage is required by current Requirement/customer semantics, use existing conversion behavior rather than inventing parallel conversion logic.

---

## 14. Prefill Candidates

Where semantically valid:

```text
lead_id
customer_account_id
lead title
raw inquiry
estimated quantity
estimated budget
```

Operator must review/edit before Requirement creation.

Missing values remain missing.

---

## 15. Existing Requirement Behavior

If one or more Requirements already reference the Lead:

```text
show existing linkage
```

rather than silently creating accidental duplicate work.

Exact UX can remain simple.

---

## 16. Likely Code Areas

Inspect before changing:

```text
apps/mgbos/src/app/(app)/leads/
  LeadDetailModal.tsx
  actions.ts
  data.ts
  page.tsx

apps/mgbos/src/app/(app)/requirements/
  page.tsx
  RequirementForm.tsx
  actions.ts
  data.ts

packages/validation/
  lead*
  requirement*

packages/domain/
  lead*
  requirement*

supabase migrations/functions
  convert_lead_to_customer
  create_requirement_with_initial_version
```

Do not assume every listed file needs modification.

---

## 17. Preferred Implementation Shape

Prefer a small integration such as:

```text
Lead action/link
→ Requirement route with trusted identifier(s)
→ server validates Lead in active organization
→ Requirement form receives server-derived prefill
→ normal Requirement command creates record
```

Do not trust arbitrary query-string values as business truth without server validation.

---

## 18. Acceptance Criteria

P0-01 PASS when:

```text
AC-01
eligible Lead can continue to Requirement

AC-02
created Requirement retains lead_id

AC-03
linked customer_account_id is preserved where applicable

AC-04
trusted Lead context is prefilled

AC-05
operator can modify editable requirement fields

AC-06
missing source data remains missing

AC-07
cross-organization Lead cannot be used

AC-08
invalid Lead state cannot bypass canonical rules

AC-09
existing Requirement linkage is discoverable

AC-10
normal flow does not require manually finding/re-selecting Lead
```

---

## 19. Required Tests

At minimum cover:

```text
eligible Lead continuation

prefill mapping

missing context

cross-org denial

invalid state

Requirement linkage

existing linked Requirement behavior
```

---

## 20. Non-Goals

Do NOT add:

```text
Opportunity
sales pipeline redesign
new Customer aggregate
generic workflow engine
AI requirement extraction
```

---

## 21. Stop Condition

When P0-01 passes its tests and verification:

```text
STOP
```

Do not begin Order Lifecycle automatically.

---

# P0-02 — Authoritative Order Lifecycle

## 22. Problem

Canonical Order states exist:

```text
DRAFT
CONFIRMED
ACTIVE
ON_HOLD
COMPLETED
CANCELLED
```

but current runtime lacks a complete general authoritative transition surface.

---

## 23. Current Evidence

Current app actions materially expose:

```text
createOrderFromQuoteAction
createRetailOrderAction
```

but not a complete transition action.

Canonical state-machine documentation explicitly marks Order lifecycle enforcement as partial.

---

## 24. Target Behavior

Implement governed Order transition behavior.

Minimum useful flow:

```text
CONFIRMED
   ↓
ACTIVE
   ↓
COMPLETED
```

with appropriate:

```text
ON_HOLD
CANCELLED
```

paths.

---

## 25. Allowed Transition Baseline

Canonical intended graph:

```text
DRAFT
→ CONFIRMED
→ CANCELLED

CONFIRMED
→ ACTIVE
→ ON_HOLD
→ CANCELLED

ACTIVE
→ ON_HOLD
→ COMPLETED
→ CANCELLED

ON_HOLD
→ ACTIVE
→ CANCELLED

COMPLETED
terminal

CANCELLED
terminal
```

Exact implementation must reconcile canonical state-machine specification before coding.

---

## 26. Target Command Shape

Prefer:

```text
transition_order_status(...)
```

or equally explicit semantic commands.

Must include:

```text
organization
actor
order
target state
reason/reference where appropriate
```

---

## 27. Required Guards

At minimum:

```text
current Order locked
organization validated
actor authorized
transition allowed
terminal state protected
completion guard passed
audit written
```

---

## 28. Completion Guard

`ACTIVE → COMPLETED` must evaluate current authoritative obligations.

At minimum investigate:

```text
required Production Jobs
QC readiness
Shipment/fulfillment obligations
financial obligations
```

Do not invent one giant child-state mutation.

---

## 29. Financial Completion Policy

The implementation must inspect existing commercial policy before deciding whether:

```text
all invoices PAID
```

is mandatory for Order completion.

If current policy is ambiguous, choose the conservative launch-safe behavior and document it.

Do not silently invent a permissive rule.

---

## 30. Likely Code Areas

```text
apps/mgbos/src/app/(app)/orders/
  actions.ts
  data.ts
  [order detail UI]

packages/domain/src/order.ts

packages/validation/
  order*

packages/auth/
  permission definitions/tests

supabase/migrations/
  new forward migration

supabase/tests/
  order-related pgTAP
```

---

## 31. Acceptance Criteria

```text
AC-01
valid transitions succeed

AC-02
invalid transitions fail

AC-03
COMPLETED cannot leave terminal state

AC-04
CANCELLED cannot leave terminal state

AC-05
unauthorized actor rejected

AC-06
cross-org actor rejected

AC-07
ACTIVE cannot complete while required operational obligations remain

AC-08
eligible ACTIVE Order can complete

AC-09
audit history records transition

AC-10
normal UI uses governed command, not direct table mutation
```

---

## 32. Required Tests

```text
transition graph

terminal-state protection

completion blocked by production

completion blocked by fulfillment

financial completion policy

authorization

cross-org

audit

idempotent/safe repeat where appropriate
```

---

## 33. Non-Goals

Do not:

```text
merge child states into Order
create Project
introduce general workflow engine
auto-complete child records
```

---

## 34. Stop Condition

Verify Order lifecycle thoroughly, report, then stop.

---

# P0-03 — Vendor-Backed Production Assignment

## 35. Problem

Vendor directory exists.

`production_assignments.vendor_id` exists.

Normal UI still uses:

```text
vendorName
```

as external executor identity.

---

## 36. Target

Canonical external assignment:

```text
Production Job
     ↓
Vendor Directory
     ↓
vendor_id
     ↓
Production Assignment
```

---

## 37. Vendor Validation

Vendor must:

```text
exist

belong to same organization

be ACTIVE

be valid for assignment
```

---

## 38. Historical Display

It is acceptable to preserve:

```text
vendor_name snapshot
```

for historical readability if useful.

But:

```text
vendor_id
```

becomes canonical identity.

---

## 39. Rate Card Assistance

Where useful:

```text
Vendor
→ relevant rate cards
→ operator reference
```

Rate Card must not automatically become final committed Vendor quotation.

Operator confirms committed cost.

---

## 40. Internal Assignment Compatibility

Current:

```text
executor_type = INTERNAL
assigned_brand_id
```

must continue to work.

---

## 41. Likely Code Areas

```text
apps/mgbos/src/app/(app)/production/
  JobAssignForm.tsx
  actions.ts
  data.ts

apps/mgbos/src/app/(app)/vendors/

packages/validation/
  production*

packages/domain/
  production*
  vendor*

supabase/migrations/
  assign_production_job evolution

supabase/tests/
  production/vendor assignment tests
```

---

## 42. Acceptance Criteria

```text
AC-01
Vendor assignment accepts vendor_id

AC-02
Vendor identity persisted

AC-03
inactive Vendor rejected

AC-04
cross-org Vendor rejected

AC-05
unknown Vendor rejected

AC-06
internal assignment unchanged

AC-07
committed cost preserved

AC-08
UI selects canonical Vendor

AC-09
historical assignment remains readable
```

---

## 43. Tests

```text
active vendor

inactive vendor

cross-org vendor

missing vendor

internal assignment regression

committed cost

UI/server validation
```

---

## 44. Non-Goals

Do not add:

```text
generic Partner
Vendor marketplace
advanced vendor scoring
capacity optimizer
```

---

## 45. Stop Condition

P0-03 ends after Vendor identity is trustworthy.

Do not implement assignment acceptance in the same task unless absolutely necessary for backward compatibility.

---

# P0-04 — Assignment Acceptance / Reassignment

## 46. Problem

Current possible contradiction:

```text
Production Job
= ACCEPTED

Production Assignment
= ASSIGNED
```

---

## 47. Semantic Ownership

```text
Production Assignment
→ executor commitment lifecycle

Production Job
→ physical work lifecycle
```

---

## 48. Required Commands

Introduce or harden:

```text
accept_production_assignment

decline_production_assignment

cancel_production_assignment
```

or equivalent canonical command surface.

Reassignment can use existing/new assignment creation once old assignment reaches valid terminal state.

---

## 49. Acceptance Behavior

Target:

```text
Assignment ASSIGNED
        ↓
ACCEPTED
        ↓
accepted_at set
        ↓
Production Job coordinated to ACCEPTED
```

where canonical Job semantics require it.

Coordination should be atomic where both must change together.

---

## 50. Decline Behavior

Target:

```text
Assignment ASSIGNED
        ↓
DECLINED
        ↓
history retained
        ↓
Job returns to safe assignable state
```

Likely:

```text
READY
```

subject to canonical reconciliation.

---

## 51. Reassignment

Old Assignment remains immutable historical evidence.

New executor creates new Assignment.

---

## 52. Active Assignment Constraint

The system should prevent two contradictory active assignments for the same Production Job unless future semantics explicitly introduce multi-executor work.

---

## 53. Cost Semantics

Reassignment must not silently destroy previous committed-cost evidence.

Inspect Cost Trilogy behavior carefully.

If committed-cost semantics require correction/reversal records, implement explicitly rather than overwriting history.

---

## 54. Likely Code Areas

```text
apps/mgbos/src/app/(app)/production/
  actions.ts
  assignment UI
  job detail

packages/domain/src/production*

packages/validation/
  production*

packages/auth/
  production permissions

supabase/migrations/
  assignment lifecycle functions

supabase/tests/
  assignment lifecycle
```

---

## 55. Acceptance Criteria

```text
AC-01
ASSIGNED assignment can be accepted

AC-02
assignment.status becomes ACCEPTED

AC-03
accepted_at populated

AC-04
Production Job and Assignment remain semantically consistent

AC-05
assignment may be declined where valid

AC-06
declined assignment remains historical

AC-07
Job becomes safely assignable again

AC-08
new assignment can be created

AC-09
multiple conflicting active assignments prevented

AC-10
unauthorized actor rejected

AC-11
cross-org actor rejected

AC-12
duplicate acceptance is safe
```

---

## 56. Non-Goals

Do not build:

```text
Vendor portal
real-time partner API
multi-vendor collaborative Job
advanced assignment marketplace
```

---

## 57. Stop Condition

Assignment lifecycle trustworthy → stop.

---

# P0-05 — Fulfillment Readiness Guard

## 58. Problem

Current shipment implementation strongly protects:

```text
shipment quantity ceiling
```

but does not sufficiently prove:

```text
production readiness
+
QC readiness
```

before creating Delivery Order.

---

## 59. Current Evidence

Existing broad E2E can have:

```text
one Job READY_FOR_HANDOFF
one Job ON_HOLD after QC rejection
```

and still proceed to Delivery Order creation.

This is unsafe for launch.

---

## 60. Target Rule

Before shipment creation:

```text
ordered quantity
AND
unshipped quantity
AND
production-ready quantity
AND
QC-cleared quantity
```

must be mutually valid.

---

## 61. Launch-v1 Conservative Rule

If current data model cannot prove readiness at per-quantity granularity:

```text
all required active Production Jobs
for the relevant Order / item
must be READY_FOR_HANDOFF or COMPLETED
```

before shipment.

A more permissive partial model can come later.

---

## 62. Blocking Conditions

Must consider unresolved:

```text
PLANNED
READY
ASSIGNED
ACCEPTED
IN_PRODUCTION
AWAITING_QC
REWORK
ON_HOLD
```

where they represent required work.

---

## 63. Cancelled Production Jobs

A legitimate cancelled Job should not automatically block fulfillment if it no longer represents required work.

This must be explicit.

---

## 64. Error UX

Operator-facing rejection should explain what blocks shipment.

Example conceptually:

```text
Cannot create Delivery Order:
Production Job TS-PJ-... is still ON_HOLD after QC rejection.
```

---

## 65. Likely Code Areas

```text
supabase/migrations/
  create_delivery_order evolution

supabase/tests/
  fulfillment tests

packages/domain/
  shipment/order/production helper rules if needed

packages/validation/
  shipment*

apps/mgbos/src/app/(app)/shipments/
  actions.ts
  forms/UI

apps/mgbos/src/app/(app)/orders/[id]/
  shipment display/actions
```

---

## 66. Acceptance Criteria

```text
AC-01
ready work can be shipped

AC-02
unfinished production blocks shipment

AC-03
AWAITING_QC blocks shipment

AC-04
REWORK blocks shipment

AC-05
QC rejection / ON_HOLD blocks shipment

AC-06
shipment quantity ceiling remains intact

AC-07
cancelled irrelevant Job does not incorrectly block

AC-08
partial shipment only succeeds when readiness is safely provable

AC-09
operator receives clear blocker message

AC-10
delivered shipment immutability remains intact
```

---

## 67. Non-Goals

Do not implement:

```text
advanced production allocation engine
warehouse wave planning
carrier optimization
```

---

## 68. Stop Condition

Readiness guard proven → stop.

---

# P0-06 — Governed Work Order / SPK Artifact

## 69. Problem

External production still lacks one governed operator-facing instruction artifact.

Without it:

```text
MGBOS data
+
Rizky memory
+
WhatsApp
=
Vendor instructions
```

---

## 70. Architecture Decision

Phase 1 Work Order is:

```text
GENERATED ARTIFACT
```

not:

```text
NEW ROOT AGGREGATE
```

---

## 71. Authoritative Sources

Generate from:

```text
Production Job
Production Assignment
Vendor
Order
Order Items
Requirement Version / specification
deadline
committed cost
relevant files/artwork references
```

---

## 72. Minimum Output

```text
SPK / Work Order reference

Order number

Production Job number

Vendor

job type

quantity

specification

deadline

commercial basis / committed cost where appropriate

file references

instructions

issuer

issued timestamp
```

---

## 73. Security Allowlist

The document must not expose unrelated:

```text
customer private data
internal margin
other Vendor rates
system metadata
secrets
```

---

## 74. Behavior

Generating/printing SPK:

```text
MUST NOT
```

automatically mean:

```text
Vendor accepted assignment
```

Assignment lifecycle remains separate.

---

## 75. Likely Code Areas

```text
apps/mgbos/src/app/(app)/production/
  job detail
  work-order route/view

apps/mgbos/src/app/
  document rendering patterns

existing Quote/customer PDF implementation
  inspect and reuse where appropriate

production/data.ts

vendor data

requirement/order read projections
```

Avoid database migration unless actual stable document identity/evidence requires it.

---

## 76. Acceptance Criteria

```text
AC-01
authenticated operator can open Work Order

AC-02
cross-org access denied

AC-03
correct Job shown

AC-04
correct Vendor shown

AC-05
correct quantities/specification shown

AC-06
correct deadline shown

AC-07
correct committed cost context shown where intended

AC-08
no internal margin leak

AC-09
print-friendly

AC-10
historical Assignment is distinguishable

AC-11
document generation causes no hidden Production state mutation
```

---

## 77. PDF

PDF is optional for Phase 1.

Only add it if existing document-rendering infrastructure can be reused cleanly.

Print-friendly HTML is sufficient for first governed artifact.

---

## 78. Non-Goals

Do not add:

```text
WorkOrder aggregate
Vendor portal
electronic signature
document management platform
```

---

## 79. Stop Condition

Governed external production instruction exists and is safe → stop.

---

# P0-07 — Clean Happy-Path E2E

## 80. Problem

Current broad:

```text
scripts/verify-e2e-flow.mjs
```

is valuable but:

```text
starts from existing Customer / Requirement
```

and mixes positive and negative scenarios.

---

## 81. Decision

Keep existing regression script.

Create separate focused happy-path scenario.

---

## 82. Required Journey

```text
Lead
→ qualify
→ convert/link Customer
→ Requirement
→ READY
→ Quote
→ SENT
→ ACCEPTED
→ Order
→ ACTIVE
→ Invoice / DP
→ Payment
→ Production Job
→ Vendor Assignment
→ Assignment ACCEPTED
→ IN_PRODUCTION
→ AWAITING_QC
→ QC PASS
→ READY_FOR_HANDOFF
→ Shipment
→ DISPATCHED
→ DELIVERED
→ Final Payment
→ Actual Cost
→ Order COMPLETED
→ Realized Margin
```

---

## 83. Happy Path Must Stay Clean

Do not intentionally include:

```text
QC rejection
QC rework
payment reversal
over-invoicing
over-shipment
Vendor decline
```

These belong to negative scenarios.

---

## 84. Required Assertions

At minimum:

```text
Lead identity

Customer conversion/linkage

Requirement linkage

Quote snapshots

Order lineage

Order state

Invoice totals

Payment allocations

Vendor identity

Assignment state

Production state

QC evidence

Shipment eligibility

Shipment delivery

Actual cost

Realized margin

Order completion
```

---

## 85. Likely Code Areas

```text
systems/mgbos/scripts/
  new focused E2E script

package scripts
if useful

documentation
  command to run
```

Do not rewrite all module tests into the E2E script.

---

## 86. Acceptance Criteria

```text
AC-01
fresh scenario setup works

AC-02
starts from Lead

AC-03
uses canonical Vendor

AC-04
uses Assignment acceptance

AC-05
shipment only after readiness

AC-06
Order reaches COMPLETED

AC-07
realized margin is available

AC-08
all critical assertions are explicit

AC-09
any assertion failure exits non-zero

AC-10
script is reproducible locally
```

---

## 87. Negative Scenario Pack

Separate future/adjacent test scenario set should cover:

```text
Requirement revision

low-margin quote

partial payment

Vendor decline

reassignment

QC rework

QC rejection

shipment-before-ready

actual-cost variance

invalid Order transition

duplicate command

payment reversal
```

Do not block P0-07 on building a large testing framework.

---

## 88. Stop Condition

Focused happy-path E2E passes consistently → stop.

---

# P0-08 — Operator Acceptance Test

## 89. Problem

Programmatic correctness does not prove operator usability.

Phase 1 must show a normal operator can execute the same business transaction through the application.

---

## 90. Required Surface

Use normal:

```text
authenticated browser application
```

for the complete journey.

---

## 91. Prohibited Shortcuts

Do not use:

```text
manual SQL

Supabase Studio edits

database console

developer-console state mutation

hidden spreadsheet

manual ledger correction
```

to make the scenario pass.

---

## 92. Operator Journey

```text
Lead
→ Qualification
→ Customer
→ Requirement
→ Quote
→ Order
→ Invoice / Payment
→ Production
→ Vendor Assignment
→ Assignment Acceptance
→ Work Order
→ QC
→ Shipment
→ Cost / Margin
→ Order Completion
```

---

## 93. Acceptance Report

Record each step with:

```text
step

route

screen

action

expected result

actual result

friction

severity

evidence
```

---

## 94. Friction Types

Look specifically for:

```text
missing navigation

duplicate data entry

ambiguous labels

hidden prerequisite

manual context reconstruction

unclear next action

manual calculation

technical workaround
```

---

## 95. Severity

```text
BLOCKER
cannot complete normal transaction safely

HIGH
major founder/operator burden or significant error risk

MEDIUM
meaningful friction but workable

LOW
polish / convenience
```

---

## 96. Fixing During Acceptance

First pass:

```text
OBSERVE
```

Do not continuously modify the system during the journey and invalidate the test.

After complete first pass:

```text
small obvious BLOCKER
```

may be fixed if tightly scoped.

Otherwise create follow-up backlog.

---

## 97. Acceptance Criteria

```text
AC-01
normal operator completes the transaction

AC-02
no direct DB work required

AC-03
no manual financial arithmetic required for authoritative totals

AC-04
next actions are discoverable

AC-05
Vendor coordination is visible

AC-06
QC-to-shipment logic is understandable

AC-07
final Order completion is understandable

AC-08
BLOCKER findings = 0
```

---

## 98. Completion Evidence

Produce:

```text
operator-acceptance-test.md
```

with final classification:

```text
PASS
PASS_WITH_KNOWN_LIMITATIONS
FAIL
```

---

## 99. Stop Condition

Operator test complete, blockers resolved or explicitly reported → stop.

---

# 100. Phase 1 Cross-Task Dependency Graph

```text
P0-01
Lead → Requirement
     │
     ▼
P0-02
Order Lifecycle
     │
     ▼
P0-03
Vendor Assignment
     │
     ▼
P0-04
Assignment Acceptance
     │
     ▼
P0-05
Fulfillment Readiness
     │
     ▼
P0-06
Work Order
     │
     ▼
P0-07
Clean E2E
     │
     ▼
P0-08
Operator Acceptance
```

---

# 101. Dependency Interpretation

The graph means:

```text
default execution order
```

not:

```text
every task has a hard technical database dependency
```

We intentionally serialize the work to:

```text
reduce rework
preserve clarity
make regressions easier to locate
```

---

# 102. Task Status Vocabulary

Each backlog item may be marked:

```text
READY
IN_PROGRESS
BLOCKED
VERIFYING
DONE
```

Do not use percentage-complete.

---

# 103. Current Status

```text
P0-01  DONE
P0-02  DONE
P0-03  DONE
P0-04  DONE
P0-05  DONE
P0-06  DONE
P0-07  DONE
P0-08  DONE
```

All Phase 1 operating spine milestones (P0-01 through P0-08) are complete, verified, and certified. Phase 1 is officially CLOSED. See `operator-acceptance-test.md` and `completion-report.md`.

---

# 104. Architecture Escalation Rule

AntiGraphity must stop and report if a backlog item appears to require:

```text
new root entity

new system

major authorization redesign

new cross-system authority model

destructive migration

historical-data reinterpretation

large architecture deviation
```

Do not solve these silently.

---

# 105. Small Implementation Decision Rule

AntiGraphity MAY decide local details such as:

```text
component naming

helper extraction

test utility

route structure

function decomposition
```

when they do not change canonical semantics.

---

# 106. Documentation Update Rule

A task may update:

```text
implementation docs
tests
engineering report
```

as evidence.

If runtime implementation reveals a canonical architecture mismatch:

```text
STOP
```

and report the conflict before editing canonical semantics.

---

# 107. Phase 1 Exit Gate

Phase 1 can close only when all are true:

```text
Lead continuity
PASS

Order lifecycle
PASS

Vendor-backed assignment
PASS

Assignment lifecycle
PASS

Fulfillment readiness
PASS

Work Order
PASS

Clean E2E
PASS

Operator Acceptance
PASS / accepted non-blocking limitation
```

---

# 108. No Artificial Completion

Do not mark DONE merely because:

```text
code compiled
```

A P0 item requires:

```text
implemented
+
tested
+
verified
```

---

# 109. Phase 1 Final Certification

After P0-08:

create:

```text
completion-report.md
```

and verify the complete system.

Only then decide:

```text
PHASE 1 CLOSED
```

or:

```text
PHASE 1 REMAINS OPEN
```

---

# 110. Next Phase

After Phase 1:

```text
P1-01 Operational Exception
P1-02 Founder Attention Read Models
P1-03 Customer Case Lite
P1-04 Vendor Capability Enrichment
```

subject to real implementation evidence.

---

# 111. Final Principle

> **Every P0 task should remove one place where Rizky currently acts as integration middleware.**

Phase 1 is complete when:

```text
Lead
→ Requirement
→ Quote
→ Order
→ Payment
→ Production
→ Vendor
→ QC
→ Shipment
→ Margin
```

behaves like:

```text
ONE GOVERNED OPERATING SPINE
```

rather than a set of disconnected modules.