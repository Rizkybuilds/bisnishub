---
canonical_id: teestock.implementation.phase1-operating-spine
status: ACTIVE
version: 1.0
owner: Rizky
author: OpenAI / ChatGPT
approver: Rizky
scope: mgbos-teestock-phase1
document_class: implementation-plan
effective_from: 2026-09-30
authoritative_for:
  - phase-1 implementation scope
  - phase-1 implementation sequencing
  - operating-spine acceptance criteria
  - phase-1 non-goals
  - phase-1 verification strategy
last_reviewed: 2026-09-30
review_cadence: per-material-phase-change
depends_on:
  - ../../../../../docs/operating-model/solo-founder-operating-system.md
  - ../../../../../docs/roadmaps/solo-founder-launch-roadmap.md
  - ../../architecture/domain-map-capability-ownership.md
  - ../../architecture/canonical-data-model.md
  - ../../architecture/business-state-machines.md
  - ../../architecture/business-invariants.md
  - ../../architecture/command-event-model.md
  - ../../architecture/permission-authorization-model.md
  - ../../../../../bisnis/teestock/14-roadmap/current-quarter.md
supersedes: null
implementation_status: READY_FOR_EXECUTION
---

# Phase 1 — TeeStock Operating Spine Implementation Plan v1.0

## 1. Purpose

Phase 1 memiliki satu tujuan:

> **Membuktikan satu transaksi TeeStock Custom/B2B dapat bergerak end-to-end melalui MGBOS tanpa Rizky menjadi manual router antar-modul.**

Phase 1 bukan ERP expansion.

Phase 1 adalah:

```text
CONNECT
+
HARDEN
+
VERIFY
```

domain yang sebagian besar sudah tersedia.

---

# 2. Business Outcome

Canonical operating spine:

```text
LEAD
  ↓
REQUIREMENT
  ↓
QUOTE
  ↓
ORDER
  ├────────────► INVOICE / PAYMENT
  │
  ▼
PRODUCTION JOB
  ↓
PRODUCTION ASSIGNMENT
  ↓
WORK ORDER / SPK
  ↓
QC
  ↓
SHIPMENT
  ↓
ACTUAL COST
  ↓
REALIZED MARGIN
  ↓
ORDER COMPLETED
```

---

# 3. Phase 1 Success Question

At the end of Phase 1:

> **Can a competent operator execute one normal TeeStock transaction from Lead to completed Order using normal MGBOS surfaces without direct database intervention?**

If:

```text
NO
```

Phase 1 remains incomplete.

---

# 4. Current Baseline

Current MGBOS already materially implements:

```text
Customer
Lead
Requirement
Quote
Order
Invoice
Payment
Production Job
Production Assignment
Vendor
QC
Shipment
Inventory
Procurement
Goods Receipt
Cost Trilogy
Financial Summary
```

Therefore:

> **Do not rebuild these domains.**

---

# 5. Current Implementation Gaps

Current audit identifies:

```text
P0-01
Lead → Requirement continuity

P0-02
Order lifecycle enforcement

P0-03
Vendor-backed Production Assignment

P0-04
Assignment acceptance consistency

P0-05
Fulfillment readiness

P0-06
Governed Work Order / SPK

P0-07
Clean happy-path E2E

P0-08
Operator acceptance
```

---

# 6. Phase 1 Non-Goals

Do NOT introduce unless real implementation evidence proves unavoidable:

```text
Opportunity

generic Project

generic Partner super-domain

full Product / Catalog

Creator

Royalty

Affiliate

Marketing Campaign domain

advanced BOM / Recipe

generalized Exception domain

full Founder Command Center

autonomous JARVIS

microservices
```

---

# 7. Architecture Constraint

New capability does not automatically mean new entity.

Preferred order:

```text
USE EXISTING ENTITY
      ↓
VIEW / QUERY
      ↓
COMMAND
      ↓
WORKFLOW
      ↓
GENERATED ARTIFACT
      ↓
NEW ENTITY
only when lifecycle requires it
```

---

# 8. Implementation Rule

Every P0 task must:

```text
audit current behavior
↓
make smallest correct change
↓
preserve canonical semantics
↓
test
↓
verify
↓
stop
```

Do not continue automatically into the next P0 item.

---

# 9. P0-01 — Lead → Requirement Continuation

## Problem

Lead exists.

Requirement exists.

Requirement already accepts:

```text
lead_id
customer_account_id
```

but operator continuity is incomplete.

Current flow still tends toward:

```text
Lead
↓
Rizky remembers context
↓
manually navigates
↓
Requirement
```

---

# 10. P0-01 Target

Target:

```text
QUALIFIED / appropriate Lead
       ↓
Continue to Requirement
       ↓
trusted context prefilled
       ↓
operator reviews
       ↓
Requirement created through existing command
```

---

# 11. P0-01 Constraints

Do not create:

```text
Opportunity
```

Do not bypass:

```text
Lead state machine
Requirement validation
organization isolation
existing Requirement command
```

---

# 12. P0-01 Prefill

Where trustworthy and semantically compatible:

```text
lead_id

customer_account_id

inquiry / need context

estimated quantity

target budget
```

Missing information remains missing.

Never fabricate.

---

# 13. P0-01 Existing Requirement

If a Requirement already references the Lead:

```text
show / continue existing Requirement
```

rather than quietly generating duplicates.

---

# 14. P0-01 Definition of Done

```text
qualified Lead can continue

lead_id retained

customer linkage retained

trusted context prefilled

missing data not invented

cross-org blocked

invalid state blocked

existing Requirement discoverable

normal UI requires no manual context reconstruction
```

---

# 15. P0-02 — Authoritative Order Lifecycle

## Problem

Canonical Order states exist:

```text
DRAFT
CONFIRMED
ACTIVE
ON_HOLD
COMPLETED
CANCELLED
```

but current application does not expose complete authoritative transition behavior.

---

# 16. P0-02 Target

Implement governed Order lifecycle commands.

Target core:

```text
CONFIRMED
   ↓
ACTIVE
   ↓
COMPLETED
```

with:

```text
ON_HOLD
CANCELLED
```

where canonical rules allow them.

---

# 17. Order Lifecycle Principle

Order status represents:

```text
COMMERCIAL COMMITMENT LIFECYCLE
```

not:

```text
payment state
production state
QC result
shipment status
```

---

# 18. Order Completion Guard

`COMPLETED` must be meaningful.

At minimum evaluate appropriate:

```text
production completion

required QC

fulfillment obligations

financial obligations
```

using authoritative child-domain state.

---

# 19. Completion Must Not Fake Child States

Order completion command must NOT:

```text
mark unpaid Invoice paid

force Production complete

force Shipment delivered
```

merely to satisfy Order state.

---

# 20. P0-02 Definition of Done

```text
valid transitions work

invalid transitions fail

terminal states protected

authorization enforced

organization isolation enforced

audit evidence created

unfinished obligations block completion

fully satisfied Order can complete

UI uses authoritative command
```

---

# 21. P0-03 — Vendor-Backed Production Assignment

## Current Problem

Canonical Vendor directory exists.

`production_assignments` can reference vendor identity.

However current normal assignment UI still asks for:

```text
vendorName
```

free-text.

This creates identity drift.

---

# 22. P0-03 Target

For external Vendor execution:

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

# 23. Vendor Validation

Assigned Vendor must be:

```text
same organization

ACTIVE

valid current record
```

---

# 24. Rate Card Role

Vendor Rate Card may assist operator decision.

It does NOT automatically mean:

```text
current vendor quote
```

unless explicitly confirmed.

---

# 25. Committed Cost

Operator remains responsible for confirming the committed cost.

The resulting assignment must preserve Cost Trilogy semantics.

---

# 26. Internal Assignment

Existing:

```text
INTERNAL
```

assignment must continue functioning.

P0-03 must not break internal execution.

---

# 27. P0-03 Definition of Done

```text
external assignment uses vendor_id

free-text no longer canonical identity

active Vendor selectable

inactive Vendor rejected

cross-org Vendor rejected

internal assignment still works

committed cost preserved

E2E uses real Vendor record
```

---

# 28. P0-04 — Assignment Acceptance Consistency

## Problem

Production Assignment owns:

```text
ASSIGNED
ACCEPTED
DECLINED
CANCELLED
```

while Production Job separately owns physical lifecycle.

Current flow risks:

```text
Job = ACCEPTED

Assignment = ASSIGNED
```

at the same time.

---

# 29. Canonical Separation

```text
PRODUCTION ASSIGNMENT
→ Did the executor accept the commitment?

PRODUCTION JOB
→ What is the physical work lifecycle?
```

---

# 30. Accept Assignment

Target:

```text
Assignment ASSIGNED
        ↓
Accept
        ↓
Assignment ACCEPTED
accepted_at recorded
        ↓
Job may enter ACCEPTED
atomically where appropriate
```

---

# 31. Decline Assignment

Target:

```text
Assignment ASSIGNED
        ↓
DECLINED
        ↓
history retained
        ↓
Production Job returns to safe assignable state
        ↓
new Assignment may be created
```

---

# 32. Reassignment Rule

Do NOT overwrite historical Assignment.

Use:

```text
old assignment
→ historical

new assignment
→ current
```

---

# 33. Active Assignment Guard

System must prevent contradictory simultaneous active assignments unless future semantics explicitly allow them.

---

# 34. P0-04 Definition of Done

```text
acceptance updates Assignment

accepted_at recorded

Job and Assignment remain consistent

decline preserves history

decline allows safe reassignment

duplicate acceptance safe

unauthorized action blocked

cross-org action blocked
```

---

# 35. P0-05 — Fulfillment Readiness

## Current Problem

Shipment command already guards against over-shipping.

But current broad E2E can create shipments while another production job is:

```text
ON_HOLD
```

after QC rejection.

Therefore quantity validity alone is insufficient.

---

# 36. P0-05 Principle

> **Quantity available to ship is not the same as quantity ready to ship.**

---

# 37. P0-05 Target

Shipment creation must prove appropriate:

```text
production readiness
+
QC readiness
+
order-item quantity eligibility
```

before allowing Delivery Order creation.

---

# 38. Conservative Launch Rule

If current model cannot safely determine partial production allocation:

```text
BLOCK
```

rather than assume readiness.

Launch correctness is more important than premature flexibility.

---

# 39. Safe Production States

Required production relevant to shipment should generally be:

```text
READY_FOR_HANDOFF
or
COMPLETED
```

subject to exact canonical mapping.

---

# 40. QC Blocking Conditions

Unresolved:

```text
REWORK
REJECTED
ON_HOLD
```

conditions must not silently allow shipment.

---

# 41. Cancelled Jobs

A legitimately cancelled Production Job must not incorrectly block unrelated fulfillment.

Cancellation semantics must be evaluated explicitly.

---

# 42. P0-05 Definition of Done

```text
ready order can create shipment

unfinished production blocks shipment

QC rework blocks shipment

QC rejected/on-hold blocks shipment

shipment ceiling remains enforced

partial fulfillment behaves conservatively

existing delivery immutability preserved
```

---

# 43. P0-06 — Governed Work Order / SPK

## Goal

Move external production commitment out of:

```text
WhatsApp-only operational state
```

---

# 44. Initial Architecture

Do NOT create a WorkOrder aggregate in Phase 1.

Build:

```text
GENERATED GOVERNED ARTIFACT
```

from existing authoritative records.

---

# 45. Work Order Sources

```text
Production Job
Production Assignment
Vendor
Order
Order Items
Requirement / Specification
Committed Cost
Deadline
Files / Artwork References
```

---

# 46. Minimum Work Order Content

```text
SPK / Work Order reference

Order number

Production Job number

Vendor

job type

quantity

specification

deadline

committed cost / rate basis

files

instructions

issuer

issued timestamp
```

---

# 47. Work Order Security

Do not expose:

```text
unnecessary customer data

internal margin

secrets

irrelevant financial information
```

Use an explicit output allowlist.

---

# 48. Work Order Does Not Mean Acceptance

```text
SPK GENERATED
≠
VENDOR ACCEPTED
```

Acceptance remains owned by Production Assignment lifecycle.

---

# 49. P0-06 Definition of Done

```text
authenticated Work Order available

correct Vendor

correct Job

correct specification

correct quantity

correct committed cost

print-friendly

no sensitive leakage

historical assignment distinguishable

generation causes no hidden state transition
```

---

# 50. P0-07 — Clean Happy-Path E2E

Keep existing:

```text
scripts/verify-e2e-flow.mjs
```

as broad regression evidence.

Do not force it to become the clean business happy path.

---

# 51. New Focused E2E

Create a separate scenario for:

```text
Lead
→ qualification
→ Customer
→ Requirement
→ READY
→ Quote
→ SENT
→ ACCEPTED
→ Order
→ ACTIVE
→ Invoice
→ Payment
→ Production
→ Vendor Assignment
→ Assignment ACCEPTED
→ IN_PRODUCTION
→ QC PASS
→ READY_FOR_HANDOFF
→ Shipment
→ DELIVERED
→ Final Payment
→ Actual Cost
→ Order COMPLETED
→ Realized Margin
```

---

# 52. Happy Path Means Happy Path

Do not mix intentional:

```text
QC rejection

payment reversal

over-shipment

over-invoicing
```

inside the clean scenario.

Those belong in negative tests.

---

# 53. Happy-Path Assertions

At minimum verify:

```text
canonical identities

organization isolation

commercial snapshots

invoice ceiling

payment allocation

Vendor identity

Assignment acceptance

QC evidence

shipment readiness

delivery

Cost Trilogy

realized margin

final Order completion
```

---

# 54. Failure Behavior

Focused E2E must:

```text
exit non-zero
```

on any failed assertion.

No soft success.

---

# 55. P0-08 — Operator Acceptance Test

The exact business flow must be executable through normal application surfaces.

---

# 56. Operator Test Rule

Do not use:

```text
direct SQL

Supabase Studio data edits

developer console mutation

manual database patches

hidden spreadsheet state
```

to complete the journey.

---

# 57. Acceptance Journey

Operator must perform:

```text
Lead
→ Requirement
→ Quote
→ Order
→ Invoice / Payment
→ Production
→ Vendor Assignment
→ Assignment Acceptance
→ QC
→ Work Order / SPK
→ Shipment
→ Cost / Margin
→ Order Completion
```

through governed UI behavior.

---

# 58. Friction Recording

Record:

```text
route

screen

action

expected result

actual result

manual memory dependency

duplicate entry

unclear terminology

missing navigation

technical workaround
```

---

# 59. Finding Classification

```text
BLOCKER

HIGH

MEDIUM

LOW
```

---

# 60. Phase 1 Blocker

Examples:

```text
cannot continue normal transaction

requires direct DB repair

state contradiction

financial integrity failure

cross-org leakage

shipment allowed despite unsafe production state

wrong Vendor identity

operator cannot determine next action
```

---

# 61. Phase 1 Verification Layers

Each applicable implementation task should verify:

```text
Domain tests

Validation tests

Permission tests

Database / pgTAP tests

Integration / E2E

Production builds
```

---

# 62. Database Change Rule

For schema/function changes:

> **Never modify previously applied migration to change behavior.**

Create forward migration.

---

# 63. Mutation Rule

Consequential mutations should remain behind:

```text
governed server action
→ authoritative command/RPC
→ authorization
→ invariant validation
→ transaction
→ audit
```

---

# 64. Direct UI Mutation

Do not introduce:

```text
frontend
→ arbitrary table PATCH
```

for governed transactional state.

---

# 65. Financial Integrity

Phase 1 must preserve:

```text
integer IDR

invoice ceilings

payment allocations

payment reversal history

Cost Trilogy

shipping pass-through semantics

historical commercial snapshots
```

---

# 66. Organization Isolation

Every new read/mutation must preserve:

```text
organization boundary
```

through appropriate:

```text
authorization

queries

RLS

command validation
```

---

# 67. Auditability

Material business mutations should preserve sufficient evidence to answer:

```text
who

what

when

from what state

to what state

why / reference
```

where appropriate.

---

# 68. Idempotency

Retryable consequential commands must avoid duplicate economic/business effects.

Especially:

```text
Order creation

Invoice creation

Payment recording

Assignment actions

Shipment creation

Cost settlement
```

where retry semantics apply.

---

# 69. Unknown Outcome

External/ambiguous execution must never be converted into fictional certainty.

If state cannot be established:

```text
UNKNOWN
or
RECONCILIATION REQUIRED
```

is preferable to fabricated success.

---

# 70. Negative Scenario Pack

After clean happy path, validate separately:

```text
requirement revision

low-margin quote

partial payment

Vendor decline

Vendor reassignment

QC rework

QC rejection

shipment before readiness

actual cost variance

invalid state transition

duplicate command

payment reversal
```

---

# 71. Phase 1 Does Not Require Operational Exception Domain

Negative tests may expose exception candidates.

Record them as evidence.

Do not automatically implement generic Exception during Phase 1.

Exception belongs to Phase 2.

---

# 72. Synthetic Fixture

Use a realistic TeeStock Custom scenario.

Example:

```text
Customer:
PT Arunika Event

Contact:
Budi

Need:
100 black custom T-shirts

Use:
company event

Production:
external Vendor

Commercial flow:
quote → DP → production → QC → fulfillment → final settlement
```

Exact fixture values may change as long as test semantics remain stable.

---

# 73. Phase 1 Documentation Directory

Target:

```text
systems/mgbos/docs/implementation/
└── phase-1-operating-spine/
    ├── README.md
    ├── operating-spine-plan.md
    ├── current-operating-spine-audit.md
    ├── backlog.md
    ├── synthetic-scenarios.md
    ├── operator-acceptance-test.md
    └── completion-report.md
```

---

# 74. Documentation Creation Timing

Create immediately:

```text
README.md
operating-spine-plan.md
current-operating-spine-audit.md
backlog.md
```

Create when relevant:

```text
synthetic-scenarios.md
operator-acceptance-test.md
completion-report.md
```

Do not create empty ceremonial documents.

---

# 75. Implementation Order

Strict default sequence:

```text
P0-01 Lead → Requirement
        ↓
P0-02 Order Lifecycle
        ↓
P0-03 Vendor-backed Assignment
        ↓
P0-04 Assignment Acceptance
        ↓
P0-05 Fulfillment Readiness
        ↓
P0-06 Work Order / SPK
        ↓
P0-07 Clean E2E
        ↓
P0-08 Operator Acceptance
```

---

# 76. Why This Order

Each task reduces uncertainty required by the next.

Example:

```text
Vendor identity
must be reliable
before
Work Order Vendor identity
can be trusted.
```

And:

```text
Production/QC readiness
must be reliable
before
happy-path Shipment
can prove operational correctness.
```

---

# 77. Parallelization Rule

Default:

```text
DO NOT parallelize consequential P0 mutations
```

unless dependency analysis explicitly proves independence.

Solo-founder project speed comes from:

```text
low rework
```

not maximum agent concurrency.

---

# 78. Antigravity Execution Model

For each P0 task:

```text
canonical docs
+
this plan
+
current audit
+
one backlog item
        ↓
ANTIGRAVITY
        ↓
inspect current implementation
        ↓
smallest correct change
        ↓
tests
        ↓
verification
        ↓
report
        ↓
STOP
```

---

# 79. Antigravity Must Not Infer Scope Expansion

If implementation exposes a possible larger redesign:

```text
STOP
+
report architectural conflict
```

rather than silently introducing:

```text
new aggregate

new infrastructure

new permission system

new workflow engine
```

---

# 80. Task Completion Report

Every P0 execution should report:

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

# 81. Phase 1 Metrics

Useful engineering/operational measures:

```text
number of manual context transfers

number of DB workarounds

number of duplicated entries

number of ambiguous next actions

number of invalid states found

happy-path completion result

operator completion result
```

Do not invent completion percentages.

---

# 82. Phase 1 Completion Gate

Phase 1 can close only when:

```text
P0-01 PASS
P0-02 PASS
P0-03 PASS
P0-04 PASS
P0-05 PASS
P0-06 PASS
P0-07 PASS
P0-08 PASS
```

or an explicitly accepted known limitation is proven non-blocking.

---

# 83. BLOCKER Rule

If any issue can:

```text
corrupt business truth

break financial integrity

cause cross-org access

allow unsafe fulfillment

lose historical evidence

require manual database repair
```

Phase 1 is:

```text
NOT COMPLETE
```

---

# 84. Phase 1 Completion Report

Final file:

```text
systems/mgbos/docs/implementation/
phase-1-operating-spine/
completion-report.md
```

must state explicitly:

```text
READY TO CLOSE
```

or:

```text
NOT READY TO CLOSE
```

with evidence.

---

# 85. Phase 2 Handoff

Only after Phase 1 closes should implementation move primarily toward:

```text
Operational Exception

Founder Attention Read Models

Customer Case Lite

Vendor Capability Enrichment
```

---

# 86. Final Principle

Phase 1 is not about making MGBOS bigger.

It is about making existing MGBOS domains behave like:

```text
ONE OPERATING MACHINE
```

instead of:

```text
MODULE A
   ↓
RIZKY remembers what happens next
   ↓
MODULE B
```

Target:

```text
MODULE A
   ↓
GOVERNED WORKFLOW
   ↓
MODULE B

Rizky enters only when judgment is actually required.
```
