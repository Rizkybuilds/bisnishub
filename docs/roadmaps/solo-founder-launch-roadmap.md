---
canonical_id: bisnishub.roadmap.solo-founder-launch
status: ACTIVE
version: 1.0
owner: Rizky
author: OpenAI / ChatGPT
approver: Rizky
scope: bisnishub-teestock-launch
document_class: canonical-roadmap
effective_from: 2026-09-30
planning_horizon:
  start: 2026-09-30
  capital_readiness_target: late-november-2026
  controlled_launch_target: late-november-to-early-december-2026
primary_business: teestock
primary_operating_system: mgbos
supporting_systems:
  - deterministic-automation
  - jarvis-lite
authoritative_for:
  - solo-founder pre-launch implementation sequencing
  - mgbos operating-spine closure priority
  - founder-control sequencing
  - automation sequencing
  - jarvis-lite launch sequencing
  - launch-readiness gates
last_reviewed: 2026-09-30
review_cadence: weekly-during-prelaunch
depends_on:
  - ../operating-model/solo-founder-operating-system.md
  - ../architecture/master-system-blueprint.md
  - ../architecture/system-boundaries.md
  - ../architecture/architectural-laws.md
  - ../../systems/mgbos/docs/architecture/domain-map-capability-ownership.md
  - ../../systems/mgbos/docs/architecture/canonical-data-model.md
  - ../../systems/mgbos/docs/architecture/business-state-machines.md
  - ../../bisnis/teestock/14-roadmap/current-quarter.md
  - ../../systems/jarvis/docs/core-runtime.md
supersedes: null
implementation_status: EXECUTION_READY
---

# Solo-Founder Launch Roadmap — September → Launch v1.0

## 1. Purpose

Dokumen ini menerjemahkan:

```text
Solo-Founder Operating System
+
TeeStock Q4 Business Priority
+
Current MGBOS Reality
+
JARVIS Architecture
```

menjadi satu urutan implementasi menuju launch.

Pertanyaan utamanya:

> **Apa yang harus dibangun dalam urutan yang benar agar TeeStock dapat mulai menerima transaksi tanpa menjadikan Rizky manual operating system?**

---

# 2. Launch Objective

Sebelum volume transaksi nyata mulai meningkat, TeeStock harus mampu menjalankan:

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
PRODUCTION
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
```

melalui workflow yang dapat dipercaya.

---

# 3. Launch Readiness Question

Sistem harus bisa menjawab tanpa Rizky melakukan database investigation:

```text
Apa yang sedang berjalan?

Apa yang terlambat?

Apa yang terblokir?

Apa yang belum dibayar?

Siapa vendor yang mengerjakan?

Apakah vendor sudah menerima pekerjaan?

Apakah produksi sudah lolos QC?

Apakah order aman dikirim?

Berapa biaya aktual?

Berapa margin aktual?

Apa yang membutuhkan keputusan Rizky?
```

---

# 4. Roadmap Strategy

Urutan canonical:

```text
TRUTH
  ↓
SPINE INTEGRITY
  ↓
FOUNDER CONTROL
  ↓
DETERMINISTIC AUTOMATION
  ↓
AI LEVERAGE
  ↓
CONTROLLED LAUNCH
```

---

# 5. Critical Correction From Previous Roadmap

Previous sequencing placed:

```text
Operating Spine
→ Exception
→ Founder Control
```

too early.

Current implementation audit discovered that several existing spine components are not yet operationally closed-loop.

Therefore correct sequence is:

```text
FIX THE SPINE
      ↓
PROVE THE SPINE
      ↓
SURFACE EXCEPTIONS
      ↓
BUILD FOUNDER CONTROL
```

---

# 6. Current Reality

MGBOS already materially implements most required business domains.

Current strength includes:

```text
Customer
Lead
Requirement
Quote
Order
Invoice
Payment
Production
Vendor
QC
Shipment
Inventory
Procurement
Goods Receipt
Cost / Margin
```

The primary challenge is now:

> **integration integrity, not ERP breadth.**

---

# 7. Current Critical Gaps

Implementation audit identified these operating-spine gaps:

```text
P0-01
Lead → Requirement continuity

P0-02
Authoritative Order lifecycle

P0-03
Vendor → Production Assignment identity

P0-04
Assignment acceptance / decline / reassignment

P0-05
Production/QC → Shipment readiness

P0-06
Governed Work Order / SPK

P0-07
Clean Lead → Margin E2E

P0-08
Operator Acceptance Test
```

These take priority over new root domains.

---

# 8. Phase Model

```text
PHASE 0
Canonical Closure

PHASE 1
Operating-Spine Closure

PHASE 2
Founder Control Layer

PHASE 3
Deterministic Automation

PHASE 4
JARVIS Lite

PHASE 5
Launch Stress Test

PHASE 6
Controlled Launch
```

---

# 9. Phase 0 — Canonical Closure

Target window:

```text
September 30
→ early October
```

Objective:

> **Remove ambiguity before implementation agents begin changing runtime behavior.**

---

# 10. Phase 0 Required Documents

Persist and reconcile:

```text
Canonical Source Map v1.1

MGBOS Master Documentation Index v2.0

MGBOS Architecture Index v2.0

Solo-Founder Operating System v1.0

MGBOS Domain Map & Capability Ownership v1.0

Solo-Founder Launch Roadmap v1.0

Phase 1 Operating Spine Plan

Phase 1 Current Operating-Spine Audit

Phase 1 Backlog
```

---

# 11. Phase 0 Also Requires TeeStock Authority Cleanup

The current:

```text
bisnis/teestock/11-data-mgbos/
```

must be interpreted as:

```text
TEEStock BUSINESS / SYSTEM REQUIREMENTS
```

not MGBOS implementation authority.

A controlled rename may happen later.

Authority must be clear before implementation begins.

---

# 12. Phase 0 Exit Gate

Proceed when:

```text
canonical ownership
= clear

implementation priority
= clear

current-vs-target semantics
= clear

P0 backlog
= bounded

Antigravity does not need to guess authority
```

---

# 13. Phase 1 — Operating-Spine Closure

Primary goal:

> **Make one TeeStock Custom/B2B transaction run coherently from Lead to realized margin.**

No major new business domains should be introduced during Phase 1.

---

# 14. Phase 1A — Lead → Requirement

Current situation:

```text
Lead exists
Requirement exists
linkage exists
operator continuity is weak
```

Implement:

```text
QUALIFIED LEAD
      ↓
Continue to Requirement
      ↓
prefilled trusted context
```

without Opportunity.

---

# 15. Phase 1A Done

Success:

```text
lead_id preserved

customer linkage preserved

trusted lead context prefilled

missing information remains missing

existing linked Requirement discoverable

no manual context reconstruction
```

---

# 16. Phase 1B — Authoritative Order Lifecycle

Current:

```text
Order entity
= CURRENT

generic lifecycle enforcement
= PARTIAL
```

Implement governed transitions for:

```text
CONFIRMED
ACTIVE
ON_HOLD
COMPLETED
CANCELLED
```

according to canonical state semantics.

---

# 17. Order Completion Must Mean Something

Order must not become `COMPLETED` merely because someone clicked a button.

Completion must consider appropriate:

```text
production obligations

QC

fulfillment

commercial/financial obligations
```

while preserving independent child-domain states.

---

# 18. Phase 1C — Vendor-Backed Assignment

Current vendor directory and rate-card capability already exist.

Current normal Production Assignment flow must use:

```text
vendor_id
```

as the primary vendor identity.

Free-text vendor naming must not remain the canonical relationship.

---

# 19. Phase 1D — Assignment Acknowledgement

Reconcile:

```text
Production Assignment lifecycle
↔
Production Job lifecycle
```

Required:

```text
ASSIGNED
→ ACCEPTED

ASSIGNED
→ DECLINED
→ safe reassignment
```

Old assignment history must survive.

---

# 20. Phase 1E — Fulfillment Readiness

Shipment creation must no longer depend only on shipment quantity ceilings.

System must prove required work is sufficiently:

```text
produced
+
QC cleared
+
ready for handoff
```

before fulfillment.

---

# 21. Conservative Launch Rule

If precise partial-production allocation cannot yet be proven safely:

```text
prefer conservative fulfillment blocking
```

over accidental incomplete shipment.

---

# 22. Phase 1F — Work Order / SPK

TeeStock's asset-light model requires explicit external production instructions.

Initial implementation:

```text
generated governed artifact
```

not a new WorkOrder aggregate.

Source:

```text
Production Job
+
Production Assignment
+
Vendor
+
Requirement/specification
+
deadline
+
committed cost
```

---

# 23. Work Order Success Condition

Vendor execution should not require Rizky to reconstruct:

```text
scope
specification
quantity
deadline
rate
files
instructions
```

from old chat messages.

---

# 24. Phase 1G — Clean Happy-Path E2E

Create a dedicated scenario separate from the existing broad regression script.

Canonical scenario:

```text
Lead
→ Qualified
→ Customer
→ Requirement
→ Quote
→ Accepted
→ Order
→ Active
→ Invoice / DP
→ Payment
→ Production
→ Vendor Assignment
→ Assignment Accepted
→ Production
→ QC PASS
→ Shipment
→ Delivered
→ Final Payment
→ Actual Cost
→ Realized Margin
→ Order Completed
```

---

# 25. Phase 1H — Operator Acceptance Test

The same scenario must succeed through normal application surfaces.

Forbidden dependencies:

```text
manual SQL
Supabase dashboard edits
developer console changes
hidden spreadsheet
manual financial arithmetic
```

---

# 26. Phase 1 Exit Gate

Phase 1 closes when:

```text
one normal transaction
can complete Lead → Margin

and

core invalid/failure paths
fail safely
```

without founder acting as invisible middleware.

---

# 27. Phase 1 Explicitly Does Not Build

```text
Opportunity

generic Project

full Product/Catalog

Creator

Royalty

Affiliate

generic Partner super-domain

advanced BOM

complex event infrastructure

multi-agent JARVIS
```

unless a real blocker appears.

---

# 28. Phase 2 — Founder Control Layer

Only after spine integrity is proven.

Primary objective:

> **Rizky should stop searching for problems. Problems should become explicit.**

---

# 29. Phase 2A — Operational Exception

Create persistent business exceptions for abnormal conditions such as:

```text
MISSING_INFORMATION

QUOTE_WAITING

PAYMENT_OVERDUE

PAYMENT_MISMATCH

PARTNER_NOT_ACKNOWLEDGED

PRODUCTION_AT_RISK

PRODUCTION_OVERDUE

QC_FAILED

SHIPMENT_DELAYED

MARGIN_EXCEPTION

AUTOMATION_FAILURE
```

Final taxonomy should remain small and evidence-driven.

---

# 30. Minimum Exception Record

```text
exception_id

organization_id

related_entity

category

severity

status

opened_at

owner

description

evidence references

resolved_at

resolution
```

---

# 31. Initial Exception Lifecycle

Keep v1 simple:

```text
OPEN
  ↓
ACKNOWLEDGED
  ↓
RESOLVED

or

DISMISSED
```

Do not create another giant workflow engine.

---

# 32. Phase 2B — Founder Read Models

Build deterministic attention views.

Examples:

```text
Sales Attention

Quote Attention

Order Attention

Payment Attention

Production Attention

Shipment Attention

Margin Attention
```

---

# 33. Founder Home v0.1

Should answer:

```text
What needs attention now?

What is critical?

What is waiting?

What is late?

What requires a decision?
```

Not:

```text
How many charts can fit on one screen?
```

---

# 34. Finance Attention

Founder should see:

```text
invoices issued

cash received

outstanding receivables

overdue receivables

vendor obligations

actual-cost variance

margin exceptions
```

---

# 35. Operations Attention

Founder should see:

```text
jobs active

jobs due soon

jobs late

vendor acknowledgement missing

QC pending

QC failure

ready to ship

shipment delay
```

---

# 36. Phase 2C — Vendor Capability Enrichment

Extend existing Vendor baseline only where useful.

Possible fields/concepts:

```text
capability taxonomy

typical lead time

rate basis

observed quality

observed reliability

capacity note
```

Avoid artificial numeric scoring.

---

# 37. Phase 2D — Customer Case Lite

Use for durable abnormal customer-facing issues:

```text
complaint

scope change

refund request

delivery problem

quality complaint
```

Customer Case does not replace authoritative domain state.

---

# 38. Phase 2 Exit Gate

Founder can answer:

```text
What needs me?
```

without:

```text
opening every module

checking every job

remembering every promise
```

---

# 39. Phase 3 — Deterministic Automation

Only automate workflows already proven stable.

Canonical rule:

> **Standardize before automate.**

---

# 40. Phase 3 Candidates

```text
lead intake

lead routing

qualification assistance

quote follow-up

payment reminder

vendor acknowledgement reminder

production deadline alert

shipment notification

exception routing
```

---

# 41. Existing Decision Engine

The current n8n lead qualification workflow may become one component of this layer.

Current baseline rules include:

```text
valid email

budget threshold

requirement clarity
```

but should be evaluated using real operating evidence before becoming rigid business policy.

---

# 42. Automation Boundary

Automation may:

```text
schedule
route
notify
transform
invoke authorized commands
```

It may not:

```text
become business system of record
bypass state machines
bypass invariants
invent business state
```

---

# 43. Reminder Safety

Early reminders may initially create:

```text
candidate action
or
internal finding
```

before automatically messaging customers/vendors.

This allows policy tuning safely.

---

# 44. Automation Failure

Failure itself must become visible.

Never allow:

```text
workflow failed silently
→ founder assumes work happened
```

---

# 45. Phase 3 Exit Gate

Selected routine coordination no longer depends on founder memory.

---

# 46. Phase 4 — JARVIS Lite

JARVIS begins only after trusted business projections exist.

Initial allowed behavioral scope:

```text
READ
ANALYZE
SUMMARIZE
RECOMMEND
DRAFT
```

---

# 47. First JARVIS Slice

Canonical first runtime:

```text
business.morning_briefing
```

read-only and evidence-first.

---

# 48. Morning Briefing Inputs

Prefer trusted projections:

```text
Sales Attention

Finance Attention

Production Attention

Shipment Attention

Open Exceptions

System/automation health
```

rather than unrestricted raw database discovery.

---

# 49. Morning Briefing Output

Example structure:

```text
3 items need attention.

1. Payment overdue.
2. Production deadline risk.
3. Margin exception.

14 other active items have no material exception.
```

Facts must remain traceable to evidence.

---

# 50. Additional JARVIS Lite Capabilities

After Morning Briefing proves useful:

```text
sales.pipeline_summary

operations.exception_summary

finance.cash_summary

production.risk_analysis

vendor.recommendation

requirement extraction

quote draft assistance

customer communication drafts
```

---

# 51. Missing Information Behavior

JARVIS should distinguish:

```text
KNOWN

MISSING

AMBIGUOUS

STALE

CONFLICTING
```

rather than filling missing business facts through inference.

---

# 52. JARVIS Golden Test Suite

At minimum test:

```text
healthy business day

overdue payment

late production

margin exception

missing source

stale source

conflicting evidence

untrusted external prompt injection

MGBOS unavailable
```

---

# 53. Phase 4 Exit Gate

Founder no longer prepares every decision from zero.

JARVIS helps compress business reality without owning it.

---

# 54. Phase 5 — Launch Stress Test

Before meaningful launch volume, simulate concurrency and failure.

---

# 55. Business Scenarios

Test:

```text
normal custom B2B order

incomplete inquiry

requirement revision

low-margin quote

partial payment

overdue invoice

vendor decline

vendor delay

QC rework

QC rejection

shipment delay

customer complaint

automation failure

duplicate submission

JARVIS unavailable
```

---

# 56. Concurrency Test

If practical, simulate:

```text
5
10
25
```

simultaneously active business items.

This is not a performance benchmark.

It tests founder usability and workflow clarity.

---

# 57. Measure Founder Friction

Measure:

```text
manual touches per order

minutes per order

manual reminders

context switches

duplicate data entry

technical access required

ambiguous next actions
```

---

# 58. Failure Injection

Test scenarios such as:

```text
provider timeout

duplicate webhook

missing Vendor

invalid transition

payment mismatch

automation unavailable

AI unavailable
```

Business truth must survive.

---

# 59. AI-Off Test

Run the business with:

```text
JARVIS OFF
```

Expected:

```text
core operating spine still works
```

---

# 60. Automation-Off Test

Run with:

```text
automation unavailable
```

Expected:

```text
authoritative state remains valid
manual recovery remains possible
```

---

# 61. Phase 5 Exit Gate

The system must:

```text
reduce founder burden
```

more than it:

```text
creates system-management burden.
```

---

# 62. Phase 6 — Controlled Launch

Target:

```text
late November 2026 onward
```

subject to actual business/capital readiness.

The date is a planning target, not permission to skip readiness gates.

---

# 63. Launch Scope Must Be Narrow

Prefer:

```text
known offer

known costing

known production partners

known workflow

manageable transaction volume
```

over broad ecosystem launch.

---

# 64. Launch Demand Control

If inbound demand exceeds operational confidence:

```text
CONTROL INTAKE
```

rather than degrading:

```text
quality
delivery
cash
founder capacity
```

---

# 65. Founder Launch Routine

Target daily operating loop:

```text
MORNING
Briefing / attention review

↓
DECISIONS
material exceptions only

↓
SYSTEM
normal workflows continue

↓
PARTNERS
physical execution

↓
EVENING
outcome / finance / lesson review
```

---

# 66. Real Transactions Become Product Research

Every real order should generate:

```text
BUSINESS DATA

PROCESS EVIDENCE

FOUNDER FRICTION

EXCEPTION PATTERNS

VENDOR EVIDENCE

UNIT ECONOMIC EVIDENCE
```

These determine what should be built next.

---

# 67. Post-Launch Development Pull

After launch ask:

```text
What problem repeated?

What required Rizky?

What failed?

What became expensive?

What created customer risk?

What became impossible to manage manually?
```

Then prioritize the next capability.

---

# 68. Deferred Before Launch

Default defer:

```text
Opportunity

generic Project

full Product/Variant/SKU
unless launch scope requires it

advanced Catalog

Creator Marketplace

Royalty / Earnings / Payout engine

Affiliate platform

advanced marketing attribution

BOM / Recipe

multi-agent AI organization

full autonomous finance

self-modifying AI

Kafka

Temporal

microservices

multi-region infrastructure
```

---

# 69. Weekly Execution Loop

Every week:

```text
PLAN
 ↓
BUILD
 ↓
TEST
 ↓
RUN SYNTHETIC BUSINESS
 ↓
RECORD FRICTION
 ↓
FIX HIGHEST-LEVERAGE GAP
```

---

# 70. Weekly Review Questions

```text
What can the system do this week that it could not do last week?

What founder burden disappeared?

What still lives in Rizky's head?

What workflow remains ambiguous?

What broke under testing?

What did we over-engineer?

What is the single highest-leverage next constraint?
```

---

# 71. Priority Model

Evaluate candidate work qualitatively against:

```text
FOUNDER BURDEN
×
FREQUENCY
×
BUSINESS IMPACT
×
PRE-LAUNCH NECESSITY
```

versus:

```text
IMPLEMENTATION COMPLEXITY
+
RISK
+
MAINTENANCE BURDEN
```

---

# 72. Priority Classes

```text
P0
transactional spine integrity

P1
founder attention/control

P2
deterministic automation

P3
AI cognitive leverage

P4
everything else
```

---

# 73. Launch Gate A — Business Truth

Pass when:

```text
customer

requirement

commercial agreement

payment

production

QC

shipment

cost
```

have governed representation.

---

# 74. Launch Gate B — Commercial Integrity

Pass when:

```text
quote history preserved

accepted terms preserved

order contract stable

invoice/payment reconcile
```

---

# 75. Launch Gate C — Operational Execution

Pass when:

```text
production jobs
can be created and tracked

vendor assignment
is explicit

acknowledgement
is visible

QC
is explicit
```

---

# 76. Launch Gate D — Partner Coordination

Pass when partner can receive governed:

```text
scope

specification

quantity

deadline

commercial basis

handoff instruction
```

without chat archaeology.

---

# 77. Launch Gate E — Financial Control

Pass when founder sees:

```text
invoiced

received

outstanding

committed costs

actual costs

margin
```

reliably.

---

# 78. Launch Gate F — Fulfillment Integrity

Pass when shipment cannot silently bypass required production/QC readiness.

---

# 79. Launch Gate G — Exception Visibility

Pass when material abnormal conditions become explicit.

This gate belongs after core spine correctness.

---

# 80. Launch Gate H — Automation

Selected routine reminders/coordination no longer depend entirely on founder memory.

Not every process must be automated.

---

# 81. Launch Gate I — JARVIS Lite

Optional for first transaction but desirable before meaningful scale.

Pass when read-only briefing is:

```text
useful
traceable
reliable
non-authoritative
```

---

# 82. Launch Gate J — Failure Safety

Pass when:

```text
AI outage
automation outage
external timeout
duplicate event
```

do not corrupt business truth.

---

# 83. Launch Gate K — Founder Usability

Final question:

> **Would Rizky prefer running the next real order through MGBOS rather than bypassing it?**

If no:

```text
the operating system is not ready.
```

---

# 84. UI Quality Standard

Launch UI does not need perfection.

It must be:

```text
fast enough

clear enough

next-action oriented

exception visible

hard to misuse
```

---

# 85. Manual Entry Is Allowed

Manual authoritative entry is acceptable.

Example:

```text
vendor acknowledgement
recorded manually
```

is better than:

```text
automated integration
with unreliable semantics
```

---

# 86. Integrate After Systemizing

Preferred:

```text
manual
but governed
```

before:

```text
automatic
but ambiguous
```

---

# 87. Hiring Gate

Before hiring for an operational bottleneck ask:

```text
Can the work be eliminated?

Can it be standardized?

Can MGBOS absorb it?

Can deterministic automation absorb it?

Can AI prepare it?

Can a partner execute it?
```

Only then evaluate a permanent hire.

---

# 88. Metrics

Track over time:

```text
founder touches / order

founder minutes / order

decisions / order

exception rate

exception resolution time

quote turnaround

on-time production

on-time fulfillment

payment collection

actual margin

automation coverage
```

---

# 89. Milestones

```text
M0
Canonical Closure

M1
Spine Connected

M2
Spine Proven End-to-End

M3
Founder Sees Problems

M4
System Remembers Routine Work

M5
AI Prepares Decisions

M6
Stress Test Passes

M7
Controlled Launch

M8
Real Transaction Learning Loop
```

---

# 90. Architecture Freeze During Phase 1

During Phase 1:

> **Do not create another major architecture document unless implementation exposes a genuine semantic conflict or missing owner.**

Documentation work should now be primarily:

```text
implementation spec

test scenario

ADR if needed

completion evidence
```

not speculative platform architecture.

---

# 91. Immediate Next Documentation

After this roadmap, create/persist:

```text
systems/mgbos/docs/implementation/
phase-1-operating-spine/
```

with:

```text
README.md

operating-spine-plan.md

current-operating-spine-audit.md

backlog.md
```

The remaining Phase 1 test/evidence documents can be created as implementation progresses.

---

# 92. Immediate Engineering Start

After the documentation closure gate, the first implementation task is:

```text
P0-01
Lead → Requirement Continuation
```

Then:

```text
P0-02
Order Lifecycle

P0-03
Vendor-backed Assignment

P0-04
Assignment Acceptance

P0-05
Fulfillment Readiness

P0-06
Work Order / SPK

P0-07
Clean E2E

P0-08
Operator Acceptance
```

---

# 93. Final Operating Principle

The objective is not:

```text
build all of MGBOS
before launch
```

The objective is:

```text
build enough trusted operating leverage
that launch volume does not immediately
turn Rizky into the bottleneck.
```

---

# 94. Final Roadmap

```text
CANONICAL CLOSURE
        ↓
OPERATING-SPINE CLOSURE
        ↓
END-TO-END PROOF
        ↓
FOUNDER CONTROL
        ↓
DETERMINISTIC AUTOMATION
        ↓
JARVIS LITE
        ↓
STRESS TEST
        ↓
CONTROLLED LAUNCH
        ↓
REAL OPERATING EVIDENCE
        ↓
NEXT CAPABILITY
```

> **Business pulls the system forward. The system should remove founder burden faster than the business creates it.**