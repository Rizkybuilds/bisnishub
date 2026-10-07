---
canonical_id: bisnishub.roadmap.solo-founder-launch
status: ACTIVE
version: 2.4
owner: Rizky
author: OpenAI / ChatGPT
approver: Rizky
scope: bisnishub-teestock-launch
document_class: canonical-roadmap
effective_from: 2026-10-07

planning_horizon:
  start: 2026-10-05
  quarter_end: 2026-12-31
  capital_readiness_target: late-november-2026
  controlled_launch_target: late-november-to-early-december-2026

primary_business: teestock
primary_operating_system: mgbos

supporting_capabilities:
  - deterministic-automation
  - jarvis-lite

current_state:
  mgbos_phase_1_operating_spine: CLOSED
  active_mgbos_implementation_phase: PHASE_2_FOUNDER_CONTROL
  current_mgbos_product_program: FOUNDER_CONTROL
  operational_readiness: NOT_PRODUCTION_READY
  real_transaction_readiness: GATED
  roadmap_stage: STAGE_D_FOUNDER_CONTROL_BOUNDED_IMPLEMENTATION

repository_baseline:
  repository: Rizkybuilds/bisnishub
  branch: main
  commit: b8262cca87a7d2644cf1738bf54fe72e8c4545f1
  reviewed_at: 2026-10-07

authoritative_for:
  - solo-founder strategic pre-launch sequencing
  - cross-product launch-stage ordering
  - founder-control sequencing relative to automation and JARVIS
  - controlled-launch strategic gates
  - Q4 MGBOS-to-TeeStock execution direction
  - roadmap-stage transition criteria

not_authoritative_for:
  - TeeStock detailed business policy
  - MGBOS canonical entity semantics
  - MGBOS canonical state machines
  - MGBOS business invariants
  - Founder Control detailed product requirements
  - engineering implementation design
  - implementation work packages
  - deployment authorization
  - production-readiness certification
  - JARVIS runtime architecture
  - automation runtime configuration

last_reviewed: 2026-10-07
review_cadence: weekly-during-prelaunch-or-after-material-stage-change

depends_on:
  - ../operating-model/solo-founder-operating-system.md
  - ../architecture/master-system-blueprint.md
  - ../architecture/system-boundaries.md
  - ../architecture/architectural-laws.md
  - ../../systems/mgbos/docs/README.md
  - ../../systems/mgbos/docs/architecture/domain-map-capability-ownership.md
  - ../../systems/mgbos/docs/implementation/README.md
  - ../../systems/mgbos/docs/implementation/phase-1-operating-spine/completion-report.md
  - ../../systems/mgbos/docs/product/founder-control-documentation-plan.md
  - ../../systems/mgbos/docs/engineering/operational-readiness.md
  - ../../bisnis/teestock/07-operations/operating-model.md
  - ../../bisnis/teestock/14-roadmap/current-quarter.md
  - ../../systems/jarvis/docs/core-runtime.md

supersedes:
  - bisnishub.roadmap.solo-founder-launch@2.3

implementation_status: STRATEGIC_ROADMAP_ACTIVE
---

# Solo-Founder Launch Roadmap — Q4 2026 to Controlled Launch v2.4

## 1. Purpose

Dokumen ini menentukan urutan strategis untuk membawa:

```text id="is49yy"
TEEStock
+
MGBOS
+
DETERMINISTIC AUTOMATION
+
JARVIS
```

menuju operasi bisnis nyata tanpa menjadikan founder sebagai manual operating system.

Pertanyaan utama:

> **Apa urutan paling aman dan paling leverage untuk mengubah MGBOS yang sudah memiliki operating spine menjadi sistem yang benar-benar membantu solo founder menjalankan TeeStock, kemudian membuktikannya melalui transaksi nyata sebelum menambah automation dan AI lebih jauh?**

---

# 2. Roadmap Is Sequencing Authority

Dokumen ini memiliki authority untuk:

```text id="ovbaw6"
WHAT COMES BEFORE WHAT
```

pada level strategis.

Dokumen ini tidak menentukan:

```text id="v98s4m"
database schema

RPC

table

component

migration

exact API

exact AI prompt

exact automation workflow
```

Detail tersebut harus mengikuti semantic owner masing-masing.

---

# 3. Current Reality

Repository truth at the reviewed baseline shows:

```text id="0l8vck"
MGBOS IMPLEMENTATION PHASE 1
OPERATING SPINE
=
CLOSED
```

Therefore:

```text id="cv6pqb"
FIX THE PHASE 1 SPINE
```

is no longer the current roadmap objective.

The strategic problem has advanced.

---

# 4. Phase 1 Achievement

The completed software operating spine materially supports:

```text id="769bjq"
Lead
→ Customer
→ Requirement
→ Quote
→ Order
→ Invoice
→ Payment
→ Production Job
→ Production Assignment
→ Work Order / SPK
→ QC
→ Shipment
→ Actual Cost
→ Realized Margin
→ Order Completion
```

within the documented Phase 1 verification boundary.

---

# 5. Phase 1 P0 Status

The historical P0 backlog is complete:

```text id="kzhxb7"
P0-01
Lead → Requirement
=
DONE

P0-02
Order Lifecycle
=
DONE

P0-03
Vendor-Backed Assignment
=
DONE

P0-04
Assignment Acceptance / Reassignment
=
DONE

P0-05
Fulfillment Readiness
=
DONE

P0-06
Work Order / SPK
=
DONE

P0-07
Clean Happy-Path E2E
=
DONE

P0-08
Operator Acceptance
=
DONE
```

These items MUST NOT appear as open current roadmap work.

---

# 6. Critical Roadmap Correction

Roadmap v1.0 used:

```text id="oopj3n"
FIX THE SPINE
        ↓
PROVE THE SPINE
        ↓
SURFACE EXCEPTIONS
        ↓
FOUNDER CONTROL
```

The first two stages have now materially completed at the software/operator level.

Current strategic sequence becomes:

```text id="4q9r0g"
RECONCILE CURRENT TRUTH
        ↓
DEFINE FOUNDER CONTROL
        ↓
RECONCILE ARCHITECTURE
        ↓
BUILD ONLY APPROVED FOUNDER CONTROL
        ↓
PROVE OPERATIONAL READINESS
        ↓
RUN REAL TRANSACTIONS
        ↓
LEARN FROM EXCEPTIONS
        ↓
AUTOMATE REPEATED STABLE WORK
        ↓
ADD AI LEVERAGE
        ↓
CONTROLLED SCALE
```

---

# 7. Current Bottleneck

The primary current bottleneck is no longer:

```text id="eob159"
Can the system represent the transaction?
```

It is increasingly:

```text id="y4zugn"
Can the founder understand
what deserves attention
without inspecting everything manually?
```

---

# 8. Founder-Control Objective

The next MGBOS product layer should allow the founder to answer:

```text id="230ge1"
What needs attention?

What is late?

What is blocked?

What is unpaid?

What is waiting on a Vendor?

What has failed QC?

What cannot ship?

What cost is missing?

What margin is abnormal?

What requires my decision?

What can safely continue without me?
```

without manual database or multi-module investigation.

---

# 9. Canonical Strategic Sequence

Current strategic sequence:

```text id="csblau"
TRUSTED BUSINESS STATE

        ↓

TRANSACTIONAL SPINE
CLOSED

        ↓

FOUNDER CONTROL

        ↓

OPERATIONAL READINESS

        ↓

REAL OPERATING PILOT

        ↓

REPEATED OPERATIONAL LEARNING

        ↓

DETERMINISTIC AUTOMATION

        ↓

AI / JARVIS LEVERAGE

        ↓

CONTROLLED SCALE
```

---

# 10. Roadmap Stage Vocabulary

To avoid collision with MGBOS engineering:

```text id="0u5itf"
ROADMAP STAGE
≠
MGBOS IMPLEMENTATION PHASE
```

This roadmap uses:

```text id="v1p9on"
STAGE A
STAGE B
STAGE C
...
```

MGBOS implementation retains its own:

```text id="kmcn28"
Phase 1
Phase 2
...
```

lifecycle.

---

# 11. Roadmap Stage Model

```text id="ghyjsv"
STAGE A
Current-State Reconciliation

STAGE B
Founder Control Product Definition

STAGE C
Architecture + Engineering Readiness

STAGE D
Founder Control Implementation

STAGE E
Operational Readiness + Real Pilot

STAGE F
Deterministic Automation

STAGE G
JARVIS Lite

STAGE H
Controlled Launch & Q4 Learning
```

Stages may overlap only when dependencies are genuinely independent.

---

# 12. Stage A — Current-State Reconciliation

Stage status:

```text id="0v3d33"
COMPLETE
```

Objective:

> **Make repository documentation reflect current reality before starting the next product and engineering program.**

---

# 13. Stage A Problem

Machine-driven engineering becomes unsafe when repository sources simultaneously say:

```text id="kiu2m1"
Phase 1 is CLOSED
```

and:

```text id="q4nfd1"
P0-01 is the next task
```

or:

```text id="s60d96"
Current implementation focus
=
Phase 1
```

when that is no longer true.

---

# 14. Stage A Work

Reconcile applicable:

```text id="z7v5kc"
Phase 1 navigation

Phase 1 implementation plan

Phase 1 historical audit

Phase 1 backlog

MGBOS implementation index

MGBOS product index

operational-readiness register

project index

this launch roadmap

MGBOS master documentation routing
```

while preserving historical provenance.

---

# 15. Stage A Exit Gate

Stage A passes when a fresh capable machine can determine:

```text id="d9dqzh"
Phase 1
=
CLOSED

current MGBOS product program
=
FOUNDER CONTROL

current active MGBOS implementation phase
=
NONE

production readiness
=
NOT VERIFIED
```

without relying on conversation history.

---

# 16. Stage B — Founder Control Product Definition

Stage status:

```text id="b7q8r9"
COMPLETE / PRODUCT PACKAGE DEFINED
```

Objective:

> **Define the next product layer completely enough that engineering does not have to invent its semantics.**

---

# 17. Stage B Product Package

Current planned documents:

```text id="ralerm"
D0
Founder Control Documentation Plan

D1
Founder Control PRD

D2
Founder Attention & Decision Experience Spec

D3
Operational Exception Product Spec

D4
TeeStock Real Operational Pilot Plan
```

---

# 18. Stage B Parent PRD

D1 owns:

```text id="s5qla5"
WHY

WHAT

ACTORS

OUTCOMES

SCOPE

NON-GOALS

FUNCTIONAL REQUIREMENTS

BUSINESS-RULE DEPENDENCIES

SUCCESS

RISKS

DECISIONS
```

It does not design physical implementation.

---

# 19. Founder Attention

Founder Attention should answer:

```text id="cxxzer"
what deserves attention

why it deserves attention

how urgent it is

who currently owns it

what next action exists

whether founder judgment is needed

what evidence supports the signal
```

---

# 20. Critical State Separation

Founder Control must preserve:

```text id="zze9zk"
BUSINESS STATE
≠
ATTENTION STATE
≠
OPERATIONAL EXCEPTION
≠
APPROVAL REQUEST
≠
FOUNDER DECISION
```

No mega-state.

---

# 21. Operational Exception Is Not Yet An Entity Decision

Current roadmap supports defining:

```text id="84qxpx"
OPERATIONAL EXCEPTION
```

as a product need.

It does NOT pre-decide:

```text id="vsfcj5"
table

aggregate

database schema

state machine implementation
```

Architecture decides representation later.

---

# 22. Customer Case Boundary

Potential:

```text id="8sdgrp"
CUSTOMER CASE
```

and:

```text id="25ybvb"
OPERATIONAL EXCEPTION
```

should remain distinct until evidence proves otherwise.

Working distinction:

```text id="6dtijn"
Customer Case
→ durable customer-facing issue

Operational Exception
→ abnormal operational condition
```

---

# 23. Stage B Primary Business Context

Primary TeeStock Q4 operating vertical remains:

```text id="797bvx"
TEEStock BUSINESS
+
TEEStock CUSTOM
```

consistent with current TeeStock quarter planning.

---

# 24. Assisted-Sales First

Initial real validation SHOULD prefer:

```text id="hbilcf"
ASSISTED-SALES
```

if that allows the business to validate:

```text id="3za20d"
Lead
→ Requirement
→ Quote
→ Order
→ Payment
→ Production
→ QC
→ Fulfillment
→ Cost / Margin
```

without waiting for a full customer storefront.

---

# 25. Storefront Boundary

A complete public TeeStock storefront is not automatically required before the first real Custom/Business pilot.

Public self-service becomes a separate capability when needed.

---

# 26. Stage B Exit Gate

Stage B passes when:

```text id="i51ax6"
product problem
=
clear

Founder Attention behavior
=
clear

Operational Exception need
=
clear

pilot scope
=
bounded

material Owner decisions
=
durable

critical assumptions
=
identified

product package
=
internally consistent
```

---

# 27. Stage C — Architecture + Engineering Readiness

Stage status:

```text id="c3s8t1"
COMPLETE
```

Objective:

> **Translate approved product semantics into governed MGBOS architecture and bounded engineering scope.**

In Stage C, Canonical Architecture Reconciliation (W2) was completed under VECP-003H across all six canonical specifications. Operational Exception was reconciled as a first-class logical MGBOS architectural domain (`CANONICAL_TARGET`), Founder Attention as a derived projection layer (`CANONICAL_TARGET`), and Founder Home as an application surface (`CANONICAL_TARGET`).

W3 Engineering Discovery completed technical direction for the initial P2-A slice (persistent Postgres table, append-oriented audit, compute-on-read attention, existing dashboard surface, no early event infrastructure). Stage C exit gates have passed, and Stage D bounded implementation is now active.

---

# 28. Architecture Impact Review

For every approved material product requirement:

```text id="jfcz1o"
Does current MGBOS architecture
already support this?
```

If yes:

```text id="3s86j5"
REUSE EXISTING SEMANTICS
```

If no:

```text id="gswe31"
PROMOTE ONLY
THE MINIMUM REQUIRED
CANONICAL CHANGE
```

---

# 29. Candidate Architecture Owners

Potential architecture review may touch:

```text id="q0trku"
canonical-data-model.md

business-state-machines.md

business-invariants.md

command-event-model.md

permission-authorization-model.md

domain-map-capability-ownership.md
```

Only files actually affected should change.

---

# 30. No Parallel Founder-Control Architecture By Default

Avoid creating:

```text id="4kxzhr"
founder-control-architecture.md
```

merely to collect concepts that already belong to existing canonical semantic owners.

---

# 31. Current-Source Audit

Before implementation planning, engineering must inspect actual:

```text id="l9090c"
application source

queries

domain code

permissions

validation

database migrations

RPCs

tests

current evidence
```

to determine what already exists.

---

# 32. Reuse Before Build

Engineering should first ask:

```text id="gab9l9"
Can the requirement be satisfied with:

existing entity?

existing state?

existing command?

derived read model?

existing event?

existing relationship?
```

before creating another root concept.

---

# 33. Stage C Engineering Deliverables

Following product and canonical architecture maturity, Stage C engineering deliverables reflect:

```text id="u5rc1j"
current-source audit
=
COMPLETE

engineering discovery
=
COMPLETE

risk/routing
=
RESOLVED

P2-A technical plan
=
ACTIVE

initial implementation entry
=
COMPLETED

WP-P2A-01
=
COMPLETE / MERGED / POST-MERGE VERIFIED

WP-P2A-02
=
COMPLETE / MERGED / POST-MERGE VERIFIED

ACTIVE WORK PACKAGE
=
NONE

WP-P2A-03
=
NEXT CANDIDATE / NOT AUTHORIZED
```

---

# 34. Phase 2 Founder Control Implementation Entry — Gate Passed

Historically, the directory:

```text id="3iskpr"
systems/mgbos/docs/implementation/
phase-2-founder-control/
```

was governed by the strict rule that it must not exist merely because this roadmap mentions it, and must not be pre-created ceremonially before real implementation begins.

With WP-P2A-01 and WP-P2A-02 merged and post-merge verified, that engineering-entry gate has now passed because real bounded implementation has landed:

```text id="p2entnav"
systems/mgbos/docs/implementation/
phase-2-founder-control/
=
CURRENT IMPLEMENTATION NAVIGATION
```

---

# 35. Stage C Exit Gate

Status:

```text id="q0u6gz-status"
PASSED
```

Pass criteria satisfied:

```text id="q0u6gz"
product requirements
=
engineering-ready

architecture conflict
=
resolved

current implementation
=
audited

routing
=
resolved

risk
=
classified

technical plan
=
bounded

completion gate
=
defined
```

---

# 36. Stage D — Founder Control Implementation

Stage status:

```text id="stgd01"
ACTIVE (BOUNDED IMPLEMENTATION IN PROGRESS)

WORK PACKAGES:
- WP-P2A-01: COMPLETE / MERGED / POST-MERGE VERIFIED (PR #42)
- WP-P2A-02: COMPLETE / MERGED / POST-MERGE VERIFIED (PR #44)
- ACTIVE WORK PACKAGE: NONE
- NEXT CANDIDATE: WP-P2A-03 (NOT AUTHORIZED)
```

Objective:

> **Implement the smallest correct Founder Control layer that materially reduces founder attention burden.**

---

# 37. Founder Control Is Not Dashboard Decoration

Do not optimize for:

```text id="rpj7je"
charts

cards

visual density

executive-dashboard appearance
```

before solving:

```text id="wcbt2f"
what needs action?

why?

when?

who owns it?

what happens next?
```

---

# 38. Preferred First Technical Shape

Where product semantics permit, prefer:

```text id="yp5z84"
DETERMINISTIC READ MODELS

+

EXPLICIT BUSINESS EXCEPTION FACTS

+

ACTIONABLE APPLICATION SURFACES
```

before AI orchestration.

---

# 39. Founder Home Direction

Founder Home should progressively answer:

```text id="s1oxq5"
CRITICAL NOW

DUE SOON

WAITING

OVERDUE

NEEDS DECISION

NO ACTION REQUIRED
```

using authoritative MGBOS state.

---

# 40. Finance Attention Direction

Potential product outcomes include visibility into:

```text id="39a56s"
outstanding invoices

overdue receivables

payment mismatches

Vendor obligations

missing actual cost

actual-cost variance

margin exceptions
```

subject to approved PRD semantics.

---

# 41. Operations Attention Direction

Potential visibility includes:

```text id="2mcb6y"
active production

due-soon work

late production

Vendor acknowledgement missing

QC pending

QC failed

ready to ship

shipment delay
```

---

# 42. Stage D Non-Goals

Founder Control implementation should NOT automatically include:

```text id="9nj5xk"
Opportunity

generic Project

generic Partner

full Customer Support suite

advanced Vendor scoring

multi-agent AI

general workflow engine

full notification platform
```

unless approved product evidence requires them.

---

# 43. Stage D Exit Gate

Founder should be able to answer:

```text id="4dqyr4"
WHAT NEEDS ME?
```

without:

```text id="3nqn71"
opening every module

checking every order manually

searching old chats

remembering due dates mentally

performing database investigation
```

---

# 44. Stage E — Operational Readiness + Real Pilot

Objective:

> **Move from software capability into controlled operational evidence.**

---

# 45. Operational Readiness Current State

Current register concludes:

```text id="f3a10u"
SOFTWARE CI
=
VERIFIED FOR CURRENT CI SCOPE

PHASE 1
=
CLOSED

OPERATOR ACCEPTANCE
=
PASS

PRODUCTION READINESS
=
NOT VERIFIED

REAL TRANSACTION READINESS
=
GATED
```

---

# 46. Readiness Before Real Transactions

Before real operational use, resolve applicable:

```text id="nhxund"
environment separation

credential hygiene

backup

restore

RPO

RTO

monitoring

alerting

release recovery

production-like acceptance
```

according to exact pilot boundary.

---

# 47. Credential Hygiene Is A Hard Gate

Current development login defaults and development seed identity must not become production behavior.

Before network-exposed operational use:

```text id="gqq6ld"
development identity
≠
production identity

development credential
≠
production credential
```

must be explicitly verified.

---

# 48. RPO / RTO

Owner must decide:

```text id="gvpj8r"
RPO
maximum acceptable data loss

RTO
maximum acceptable recovery time
```

before recovery readiness can be meaningfully certified.

Engineering must not invent these business-risk targets.

---

# 49. Real Pilot Objective

The pilot must answer:

> **Can TeeStock actually execute real Business/Custom work through the system with less founder burden and trustworthy business truth?**

---

# 50. Real Pilot Evidence

Use real evidence where safe and applicable:

```text id="vx0j00"
real inquiry

real customer

real requirement

real quote

real acceptance

real invoice

real payment

real Vendor

real production

real QC

real shipment

real actual cost

real realized margin

real abnormal condition

real founder intervention
```

---

# 51. Pilot ≠ Production Scale

A pilot is:

```text id="hjky83"
CONTROLLED LEARNING
```

not:

```text id="6w776w"
UNRESTRICTED SCALE
```

Keep:

```text id="nx15qw"
offer scope

transaction volume

production partners

commercial commitments
```

within operational confidence.

---

# 52. Q4 Real-Transaction Goal

TeeStock Q4 succeeds when it can demonstrate multiple explainable real transactions through the operating spine.

Not because:

```text id="gbue98"
module exists
```

but because:

```text id="94t7rx"
CAPABILITY WAS USED
+
TRUTH WAS CAPTURED
+
OUTCOME WAS EXPLAINABLE
```

---

# 53. Business Vocabulary Translation

TeeStock business documentation may use terms broader than current MGBOS canonical entities.

For MGBOS implementation during this roadmap, use the following current compatibility mapping unless canonical architecture changes.

| Business concept       | Current MGBOS representation                                                                                              |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| Opportunity            | Qualified Lead + Requirement + Quote                                                                                      |
| Project                | Order + Requirement + Production Job(s)                                                                                   |
| Partner for production | Vendor                                                                                                                    |
| Work Order             | Governed SPK/Work Order artifact                                                                                          |
| Exception              | Operational Exception = CANONICAL_TARGET; database/domain foundation CURRENT; P2-A implementation IN PROGRESS              |
| Customer Case          | Separate proposed durable customer-issue concept                                                                          |

---

# 54. Opportunity Rule

Do NOT implement a generic:

```text id="p4sjbs"
Opportunity
```

merely because the TeeStock business roadmap uses the term.

Current MGBOS architecture keeps Opportunity deferred until evidence demonstrates an independent lifecycle need.

---

# 55. Project Rule

Do NOT implement generic:

```text id="ob1b3c"
Project
```

for Custom/Business coordination while:

```text id="oxtm3r"
Requirement
+
Order
+
Production Jobs
```

adequately represent the operating need.

Promote only from evidence.

---

# 56. Vendor Rule

For production outsourcing, current MGBOS canonical concept is:

```text id="7h68k9"
Vendor
```

Do not create generic:

```text id="n821dy"
Partner
```

solely for abstraction purity.

---

# 57. Real Pilot Metrics

Measure at minimum:

```text id="xz3yid"
manual touches

manual reminders

context switches

duplicate data entry

time spent reconstructing status

technical interventions

missed follow-ups

unclear next actions

founder decisions required

system bypasses

operational exceptions
```

---

# 58. Founder-Burden Metric

The most important product question is not:

```text id="fru6gz"
How many features did we ship?
```

It is:

```text id="n17ldl"
How much repeated founder labor
did the system eliminate
without reducing business integrity?
```

---

# 59. Stage E Exit Gate

Stage E passes when:

```text id="uekpqo"
multiple real transactions
=
completed or meaningfully progressed

core business truth
=
traceable

founder friction
=
measured

material exceptions
=
captured

operational readiness
=
sufficient for approved scope

major workarounds
=
understood
```

---

# 60. Stage F — Deterministic Automation

Objective:

> **Automate only repeated workflows whose underlying business semantics are already stable.**

Golden rule:

```text id="mp2qh1"
STANDARDIZE
BEFORE
AUTOMATE
```

---

# 61. Automation Candidates

Evidence may justify:

```text id="jzeysn"
quote follow-up

payment reminder

Vendor acknowledgement reminder

production due-date reminder

shipment notification

exception routing

internal follow-up
```

---

# 62. Existing Lead Qualification Automation

Existing lead qualification / Decision Engine may continue as an experiment/capability.

Its rules must remain evidence-driven.

A threshold does not become permanent business policy merely because an automation uses it.

---

# 63. Automation Boundary

Automation may:

```text id="1a0opw"
schedule

route

notify

transform

invoke authorized commands
```

It must not:

```text id="njyfn6"
become business system of record

bypass business invariants

bypass authorization

invent business state

silently mutate money
```

---

# 64. Automation Failure Must Be Visible

Never allow:

```text id="xzf9xy"
automation failed
        ↓
system says nothing
        ↓
founder assumes task happened
```

Failure must become detectable and recoverable.

---

# 65. Outbound Automation Safety

Before automatically contacting real:

```text id="wednt3"
customer

Vendor

provider
```

prove:

```text id="yf3nmf"
correct target

authorization

duplicate-effect prevention

retry behavior

failure behavior
```

---

# 66. Stage F Exit Gate

Selected routine coordination no longer depends on:

```text id="fjsz5t"
founder memory

manual calendar reminders

manual repeated message drafting
```

while failures remain visible.

---

# 67. Stage G — JARVIS Lite

Objective:

> **Use AI to compress trusted business reality, not reconstruct missing truth.**

---

# 68. JARVIS Entry Condition

JARVIS should not become the next priority merely because:

```text id="exg87q"
AI is powerful
```

It becomes useful when:

```text id="llb2r7"
trusted business state

+

Founder Control projections

+

operational exception evidence
```

exist.

---

# 69. Initial JARVIS Authority

Initial runtime should be primarily:

```text id="6wqe4a"
READ

ANALYZE

SUMMARIZE

RECOMMEND

DRAFT
```

not authoritative mutation.

---

# 70. First JARVIS Slice

Recommended first product slice remains a read-only:

```text id="ciuhvz"
business.morning_briefing
```

or equivalent governed capability.

---

# 71. Morning Briefing Inputs

Prefer:

```text id="o5dvgw"
Founder Attention

Finance Attention

Production Attention

Shipment Attention

Open Exceptions

System / Automation Health
```

instead of unrestricted raw database interpretation.

---

# 72. Morning Briefing Output Direction

Example:

```text id="je0np1"
3 items need attention.

1.
Payment overdue.

2.
Production deadline risk.

3.
Margin exception.

14 other active items
have no material founder action.
```

Every factual claim must be traceable.

---

# 73. JARVIS Missing-Information Rule

JARVIS must distinguish:

```text id="8dm6vk"
KNOWN

MISSING

AMBIGUOUS

STALE

CONFLICTING
```

instead of filling missing business facts through confident inference.

---

# 74. JARVIS Availability Test

Core business must remain operable with:

```text id="nynzom"
JARVIS
=
OFF
```

Expected:

```text id="nsucpn"
MGBOS BUSINESS TRUTH
REMAINS VALID
```

---

# 75. Stage G Exit Gate

Founder receives useful cognitive leverage without transferring authoritative business truth to the model.

---

# 76. Stage H — Controlled Launch & Q4 Learning

Objective:

> **Begin narrow real operations, protect operational capacity, and use every transaction as evidence for the next system decision.**

---

# 77. Launch Target

Planning target:

```text id="9y550d"
late November 2026
to
early December 2026
```

subject to:

```text id="nbjtor"
capital readiness

operational readiness

product readiness

partner readiness
```

Date is not authorization to skip gates.

---

# 78. Controlled Launch Scope

Prefer:

```text id="k6bgb4"
KNOWN OFFER

KNOWN COSTING METHOD

KNOWN VENDOR SET

KNOWN PRODUCTION FLOW

KNOWN QC EXPECTATION

MANAGEABLE DEMAND
```

over broad ecosystem launch.

---

# 79. Demand Control

If inbound exceeds operational confidence:

```text id="fv5o22"
CONTROL INTAKE
```

before sacrificing:

```text id="wsh5ce"
quality

delivery

cash integrity

founder capacity
```

---

# 80. Founder Operating Loop

Target daily operating pattern:

```text id="f4v0so"
MORNING

Founder Attention / briefing

        ↓

DECISIONS

material exceptions only

        ↓

SYSTEM

normal governed flows continue

        ↓

VENDORS / OPERATIONS

physical execution

        ↓

REVIEW

finance
outcomes
learning
```

---

# 81. Real Transactions Become Research

Every real transaction should generate:

```text id="4izdqk"
BUSINESS DATA

PROCESS EVIDENCE

FOUNDER FRICTION

EXCEPTION PATTERNS

VENDOR EVIDENCE

UNIT-ECONOMIC EVIDENCE
```

---

# 82. Build From Repeated Truth

After launch ask:

```text id="nb1dkk"
What repeated?

What failed?

What stayed manual?

What required founder judgment?

What caused customer risk?

What caused margin risk?

What was hard to recover?

What became too expensive?
```

Then choose the next capability.

---

# 83. Priority Model

Evaluate candidate work using:

```text id="3pxc0b"
FOUNDER BURDEN

×

FREQUENCY

×

BUSINESS IMPACT

×

CURRENT-STAGE NECESSITY
```

against:

```text id="1dgp80"
IMPLEMENTATION COMPLEXITY

+

BUSINESS RISK

+

MAINTENANCE BURDEN
```

---

# 84. Current Priority Classes

For strategic prioritization:

```text id="qxmyui"
P0
business integrity / launch blocker

P1
founder control / visibility

P2
repeated deterministic efficiency

P3
AI leverage / growth experiment

P4
future optionality
```

These roadmap priority classes do not reuse the historical Phase 1 P0 item IDs.

---

# 85. P0 Now Means Current Blocker, Not Historical Task

Do not interpret:

```text id="12pc25"
P0
```

in current roadmap work as:

```text id="2n6ioj"
P0-01 through P0-08
```

Those historical Phase 1 IDs are closed.

---

# 86. Q4 Business Objective

Current Q4 objective remains:

> **Turn TeeStock from a designed business architecture into a repeatable, measurable, system-controlled operating business.**

---

# 87. Q4 Primary Vertical

Priority:

```text id="jt7t2j"
BUSINESS
+
CUSTOM
```

Secondary work should not displace the core operating pilot.

---

# 88. Q4 Secondary Scope

Potential secondary scope only after core readiness:

```text id="0vf86w"
MERCH

small commerce pilot

small creator pilot

small Originals validation
```

These are optional learning slices.

---

# 89. Commerce Pilot

If attempted:

```text id="dxgdni"
SMALL CATALOG

KNOWN PRODUCTS

CONTROLLED VOLUME
```

not a full general-commerce system.

---

# 90. Creator Pilot

If evidence and capacity support it:

```text id="0yh11u"
1 creator

1 agreement

1 artwork

1 product
```

is sufficient to learn.

Do not build a creator marketplace first.

---

# 91. Originals

Originals may remain:

```text id="xs02bc"
CONCEPT
+
CAPSULE VALIDATION
```

until evidence supports more.

---

# 92. Deferred Before Controlled Launch

Default defer:

```text id="vwb8xv"
generic Opportunity

generic Project

generic Partner abstraction

full Product / Variant / SKU
unless pilot requires it

Creator Marketplace

Royalty platform

Affiliate platform

advanced WMS

predictive inventory

dynamic pricing

full autonomous finance

multi-agent AI organization

Kafka

Temporal

microservices

Kubernetes

multi-region infrastructure
```

---

# 93. Deferred Does Not Mean Never

It means:

```text id="yclyz9"
NOT CURRENTLY
THE HIGHEST-LEVERAGE CONSTRAINT
```

---

# 94. Operational Architecture Principle

Use the smallest architecture capable of supporting:

```text id="nf5wkc"
CURRENT REAL WORK

+

NEXT REASONABLE MATURITY STEP
```

Do not design for imagined scale without evidence.

---

# 95. Modular Monolith Direction

A modular monolith remains appropriate while it supports:

```text id="g4m1sm"
clear boundaries

transactional integrity

maintainability

operational scale
```

No roadmap pressure exists to distribute the system for prestige.

---

# 96. PostgreSQL Authority

MGBOS remains the authoritative relational business-state direction.

Automation, AI, spreadsheets, and external tools should not become hidden competing sources of truth.

---

# 97. n8n Boundary

Use n8n for:

```text id="6t2tpy"
orchestration

scheduling

integration

notifications
```

not for owning canonical business state.

---

# 98. Reporting Direction

Prefer simple:

```text id="e7j3c7"
deterministic projections

read models

database-backed views
```

before sophisticated analytics infrastructure.

---

# 99. Queue / Event Infrastructure

Introduce queues or more complex event infrastructure only when actual workload/reliability evidence requires them.

Do not make them a roadmap milestone by default.

---

# 100. AI Policy

AI may assist with:

```text id="ulng98"
research

drafting

summarization

classification

analysis

coding

decision preparation
```

within current authority.

---

# 101. AI Must Not Independently

Without separately approved governed authority, AI must not:

```text id="00yjhc"
move money

approve refund

sign contract

override commercial terms

promise delivery

silently alter canonical business state
```

---

# 102. Automation / AI Authority

Canonical:

```text id="uvnmkj"
INTELLIGENCE
≠
AUTHORITY
```

and:

```text id="qygluf"
AUTOMATION
≠
SOURCE OF TRUTH
```

---

# 103. Business Launch Gate A — Transaction Truth

Required core business facts must be governable:

```text id="nwsf11"
customer

requirement

commercial agreement

order

payment

production

QC

shipment

cost
```

Phase 1 provides the software baseline.

Real validation remains required.

---

# 104. Launch Gate B — Commercial Integrity

Pass when real transactions demonstrate:

```text id="4nmyyv"
quote/version history

accepted terms

order snapshot

invoice/payment reconciliation
```

without hidden manual truth.

---

# 105. Launch Gate C — Operational Execution

Pass when:

```text id="nbgzoq"
production is traceable

Vendor assignment is explicit

Vendor commitment is visible

QC is explicit

shipment readiness is safe

fulfillment is traceable
```

under real operation.

---

# 106. Launch Gate D — Economics

Pass when completed pilot transactions can answer:

```text id="w5lr1j"
what did we charge?

what did we collect?

what did production cost?

what did fulfillment cost?

what was actual contribution?
```

from traceable data.

---

# 107. Launch Gate E — Founder Control

Pass when founder can determine:

```text id="f56si0"
what requires attention

what is healthy

what is waiting

what is abnormal

what needs a decision
```

without manual system reconstruction.

---

# 108. Launch Gate F — Recovery

Pass applicable operational readiness for:

```text id="ppzcz1"
backup

restore

monitoring

alert escalation

release recovery
```

for the intended launch boundary.

---

# 109. Launch Gate G — Security / Environment

Pass applicable:

```text id="h25oy1"
environment isolation

secret separation

production authentication

organization isolation

credential hygiene
```

before external operational exposure.

---

# 110. Launch Gate H — Manual Fallback

When automation or AI is unavailable:

```text id="jz6tyz"
core business
must still be recoverable
through governed manual operation
```

without turning direct SQL into normal workflow.

---

# 111. Launch Gate I — Founder Capacity

The launch is not healthy if:

```text id="isq36d"
transaction volume
>
founder + system handling capacity
```

even if software technically accepts more orders.

Control demand when needed.

---

# 112. Weekly Execution Loop

Current preferred operating loop:

```text id="7k5hf6"
REVIEW REALITY
        ↓
IDENTIFY HIGHEST-LEVERAGE CONSTRAINT
        ↓
DEFINE / PLAN
        ↓
BUILD IF ACTUALLY NEEDED
        ↓
VERIFY
        ↓
OPERATE
        ↓
RECORD LEARNING
        ↓
UPDATE ROADMAP
```

---

# 113. Weekly Review Questions

Ask:

```text id="9e3m0a"
What can the system do now?

What founder burden disappeared?

What still lives only in founder memory?

What operational abnormality repeated?

What required a workaround?

What current architecture assumption was wrong?

What did we overbuild?

What is the single highest-leverage constraint now?
```

---

# 114. Build Decision Questions

Before new engineering:

```text id="fc8373"
WHAT REAL PROBLEM?

WHAT EVIDENCE?

WHAT CURRENT CAPABILITY?

WHAT EXACT GAP?

WHAT FOUNDER BURDEN?

WHAT BUSINESS RISK?

CAN EXISTING SEMANTICS SOLVE IT?

DO WE NEED THIS BEFORE PILOT?
```

---

# 115. Feature Rejection Rule

A feature should normally be deferred if it does not materially improve:

```text id="p9r8a5"
REVENUE VALIDATION

DELIVERY

CASH

CONTROL

RISK

LEARNING
```

for the current roadmap stage.

---

# 116. No Roadmap-by-FOMO

New idea:

```text id="bx3h57"
→ BACKLOG / RESEARCH
```

not:

```text id="6e0ou4"
→ IMMEDIATE BUILD
```

unless it becomes the current bottleneck.

---

# 117. Documentation Follows Reality

When implementation and real business evidence changes the roadmap:

```text id="yup0cb"
EVIDENCE
        ↓
DECISION
        ↓
UPDATE CANONICAL DOCUMENT
        ↓
CHANGE SYSTEM
```

where sensible.

Documentation is governing truth, not immutable dogma.

---

# 118. Roadmap Must Preserve History

If a previous stage was wrong:

```text id="ld5i6v"
do not rewrite history
as if it was never proposed.
```

Correct:

```text id="oy4r8y"
OLD PLAN

↓

NEW EVIDENCE

↓

UPDATED ROADMAP
```

---

# 119. Q4 Success — Business

By quarter end, desirable evidence includes:

```text id="41ye08"
REAL DEMAND

REAL DELIVERY

REAL CASH

REAL COST

REAL MARGIN

REAL EXCEPTIONS

REAL LEARNING
```

---

# 120. Q4 Success — System

MGBOS should increasingly be:

```text id="kb9pbe"
TRUSTWORTHY

TRACEABLE

REPAIRABLE

QUIET WHEN HEALTHY

LOUD WHEN MATERIAL
```

---

# 121. Q4 Success — Founder

Founder should depend less on:

```text id="alw9ac"
memory

chat search

mental todo list

status hunting

manual reminder loops
```

and more on:

```text id="1vcc7g"
governed state

attention queue

next action

exceptions

economics
```

---

# 122. Q4 Success — Automation

Automation success means:

```text id="mj023q"
repeated stable work

is reduced

without hiding failure
or corrupting truth
```

Not automation count.

---

# 123. Q4 Success — AI

AI success means:

```text id="2w2pdr"
LESS COGNITIVE PREPARATION
FOR THE FOUNDER
```

without making AI authoritative for business truth.

---

# 124. Q4 KPI Philosophy

Use:

```text id="g7mija"
COMPLETENESS

TRACEABILITY

REPEATABILITY

FOUNDER BURDEN REDUCTION
```

before scale optimization.

---

# 125. Useful Structural KPIs

Potential metrics include:

```text id="nl4ud3"
% material leads recorded

% quotes versioned

% active production jobs with governed assignment

% required jobs with SPK

% completed jobs with QC

% completed transactions with actual cost

% payments reconciled

% shipments traceable

% material exceptions captured

manual touches per transaction

founder interventions per transaction
```

Exact targets must come from product/pilot design and evidence.

---

# 126. No Invented Commercial Targets

Revenue targets, margin targets, order targets, or transaction-count commitments must come from actual business planning.

Architecture/engineering documents must not invent them.

---

# 127. Capital Readiness Target

Current planning assumes:

```text id="k99s9m"
CAPITAL READINESS
≈
LATE NOVEMBER 2026
```

This is a planning input.

If business reality changes, roadmap timing changes.

---

# 128. Controlled Launch Target

Current planning window:

```text id="ap9suc"
LATE NOVEMBER
→
EARLY DECEMBER 2026
```

is conditional.

No launch date overrides readiness gates.

---

# 129. October Direction

Current October priority:

```text id="o51thj"
RECONCILE

DEFINE

BOUND

PREPARE
```

Specifically:

```text id="5dhzw3"
documentation truth

Founder Control product definition

architecture impact

engineering readiness

operational readiness groundwork
```

---

# 130. November Direction

Subject to Stage B–D completion:

```text id="4xiqr9"
BUILD

VERIFY

PREPARE PILOT

PROVE READINESS
```

then begin controlled real operations when gates permit.

---

# 131. December Direction

Use actual operations to:

```text id="8yw3sw"
FIX

STANDARDIZE

MEASURE

AUTOMATE SELECTIVELY

ADD AI ONLY WHERE USEFUL
```

---

# 132. Quarter-End Review

By:

```text id="feblo4"
2026-12-31
```

review:

```text id="h2plah"
business demand

unit economics

Vendor performance

founder burden

MGBOS capability maturity

automation usefulness

operational exceptions

readiness gaps

JARVIS usefulness

Q1 2027 priorities
```

---

# 133. Q1 2027 Must Follow Evidence

Possible directions may include:

```text id="rjjw2f"
commerce systemization

deeper Founder Control

deeper finance

creator pilot

marketing engine

Vendor intelligence

JARVIS expansion
```

but no direction should be pre-committed before Q4 learning.

---

# 134. Q1 Decision Tree

```text id="aiss6r"
REAL OPERATING SPINE STILL UNSTABLE?
→ HARDEN OPERATIONS

SPINE STABLE BUT FOUNDER STILL MANUAL?
→ DEEPEN FOUNDER CONTROL / AUTOMATION

OPERATIONS STABLE + DEMAND GROWING?
→ SCALE COMMERCIAL CAPABILITY

DATA TRUSTWORTHY + FOUNDER OVERLOADED?
→ DEEPEN AI COPILOT

NEW BUSINESS MODEL PROVEN?
→ PROMOTE REQUIRED DOMAIN CAPABILITY
```

---

# 135. Stop Conditions

Roadmap progression must stop when:

```text id="pduf66"
business policy is materially unknown

canonical architecture conflicts

current source contradicts assumed capability

production readiness has a hard blocker

founder capacity is exceeded

business economics are not understood

real operation exposes unsafe behavior
```

Stop means:

```text id="5wxna8"
RECONCILE
```

not:

```text id="0rhqrp"
PUSH FORWARD BECAUSE TIMELINE SAYS SO
```

---

# 136. Current Hard Strategic Risks

Primary risks now include:

```text id="0t6625"
RISK-01
building Founder Control before defining it

RISK-02
assuming software completion means business validation

RISK-03
launching before operational readiness

RISK-04
overbuilding future ERP entities

RISK-05
premature automation

RISK-06
premature AI authority

RISK-07
founder overload despite system complexity

RISK-08
stale documentation misrouting AI engineering
```

---

# 137. Risk — Overbuilding

Largest structural risk remains:

```text id="jafqy1"
BUILDING THE SYSTEM
instead of
BUILDING THE BUSINESS THROUGH THE SYSTEM
```

Every engineering cycle should eventually reconnect to real operational learning.

---

# 138. Risk — Premature Founder Control Complexity

Founder Control must not become:

```text id="9xdg4l"
another giant workflow engine

another universal status model

another notification platform

another CRM
```

Its job is attention compression.

---

# 139. Risk — Premature AI

Do not solve:

```text id="pm0jj4"
missing structure
```

with:

```text id="9oxu4a"
LLM interpretation
```

when deterministic business state should exist.

---

# 140. Risk — Operational Readiness Neglect

Green CI is necessary.

It is not enough.

No real operational launch without applicable recovery/security evidence.

---

# 141. Risk — Entity Inflation

Do not promote:

```text id="1yvq4o"
Opportunity

Project

Partner
```

because they sound enterprise-ready.

Promote only after repeated real operational need.

---

# 142. Risk — Automation Failure

Automation must fail visibly.

Silent failure creates false founder confidence and can be worse than no automation.

---

# 143. Risk — Founder Bottleneck

A system that requires founder approval for every normal action has failed the solo-founder leverage objective.

Target:

```text id="usjkqe"
FOUNDER BY EXCEPTION
```

not:

```text id="p0i1mg"
FOUNDER BY DEFAULT
```

---

# 144. Roadmap Transition Rules

Move from Stage A → B when:

```text id="ogp00s"
current repository state is no longer materially misleading
```

Move B → C when:

```text id="98vkra"
product package is mature enough for architecture review
```

Move C → D when:

```text id="lmvwhq"
engineering work is bounded and authorized
```

Move D → E when:

```text id="7ki4c2"
Founder Control candidate capability passes engineering verification
```

Move E → F when:

```text id="qgpfo3"
real repeated manual coordination is observed
```

Move F → G when:

```text id="hf42er"
trusted read models and stable operational evidence exist
```

Move into controlled scale only when operational capacity supports it.

---

# 145. Current Roadmap Status

At this revision:

```text id="lnhvnt"
STAGE A
Current-State Reconciliation
=
COMPLETE

STAGE B
Founder Control Product Definition
=
COMPLETE / APPROVED_BY_OWNER

STAGE C
Architecture + Engineering Readiness
=
COMPLETE

STAGE D
Founder Control Implementation
=
ACTIVE / BOUNDED (WP-P2A-01 & WP-P2A-02 COMPLETE / MERGED / POST-MERGE VERIFIED; WP-P2A-03 NEXT CANDIDATE)

STAGE E
Operational Readiness + Real Pilot
=
GATED

STAGE F
Deterministic Automation
=
FUTURE / EVIDENCE-DRIVEN

STAGE G
JARVIS Lite
=
FUTURE / EVIDENCE-DRIVEN

STAGE H
Controlled Launch
=
TARGETED, NOT AUTHORIZED
```

---

# 146. Current MGBOS Engineering State

```text id="w04j0e"
ACTIVE IMPLEMENTATION PHASE
=
PHASE 2 FOUNDER CONTROL (BOUNDED TO AUTHORIZED WORK PACKAGES ONLY)

WORK PACKAGES
=
WP-P2A-01: COMPLETE / MERGED / POST-MERGE VERIFIED (PR #42)
WP-P2A-02: COMPLETE / MERGED / POST-MERGE VERIFIED (PR #44)
ACTIVE WORK PACKAGE: NONE
NEXT CANDIDATE: WP-P2A-03 (NOT AUTHORIZED)
BUILDER AUTHORIZATION: NONE
```

Therefore:

```text id="j2c2zt"
Antigravity
```

currently has no authorized Founder Control implementation package from this roadmap. WP-P2A-01 and WP-P2A-02 have merged, and WP-P2A-03 requires Head Engineering Implementation Contract and Work Package authoring before any implementation can occur.

---

# 147. Current Product Next Step

Following Stage B completion and Owner approval, the Founder Control product definition package (D1 through D4) was reconciled with canonical architecture in Stage C (W2 COMPLETE), W3 Engineering Discovery was completed with an active P2-A Technical Plan, and WP-P2A-01 and WP-P2A-02 were completed and merged:

```text id="vrp0b1"
FOUNDER CONTROL PRODUCT PACKAGE
=
APPROVED_BY_OWNER (D1-D4)

CANONICAL ARCHITECTURE RECONCILIATION (W2)
=
COMPLETE (v1.1)

W3 ENGINEERING DISCOVERY
=
ANALYSIS COMPLETE

P2-A TECHNICAL PLAN
=
ACTIVE

WP-P2A-01
=
COMPLETE / MERGED / POST-MERGE VERIFIED (PR #42)

WP-P2A-02
=
COMPLETE / MERGED / POST-MERGE VERIFIED (PR #44)

ACTIVE WORK PACKAGE
=
NONE

NEXT GATE
=
WP-P2A-03 IMPLEMENTATION CONTRACT + WORK PACKAGE AUTHORING
```

---

# 148. Current Readiness Next Step

In parallel with product definition, continue resolving evidence for:

```text id="36v0of"
credential hygiene

environment design

RPO / RTO

backup

restore

monitoring

recovery
```

without prematurely deploying production.

---

# 149. Current Business Next Step

TeeStock should continue refining the actual:

```text id="02ekgo"
Business / Custom offer

Vendor readiness

cost assumptions

commercial process

real inquiry path
```

so the later pilot validates real operating behavior rather than synthetic business assumptions.

---

# 150. What Not To Do Next

Do NOT currently:

```text id="fr2pty"
restart Phase 1

implement Opportunity

implement generic Project

open Phase 2 implementation without PRD

build full public storefront as a blocker

build full JARVIS

build multi-agent runtime

automate every reminder

deploy production merely because CI is green
```

---

# 151. Roadmap Definition of Success

This roadmap succeeds if it causes the project to move through:

```text id="nhqxrr"
TRUSTED STATE
        ↓
LOWER FOUNDER BURDEN
        ↓
REAL BUSINESS VALIDATION
        ↓
REPEATED LEARNING
        ↓
SELECTIVE AUTOMATION
        ↓
AI LEVERAGE
```

without losing:

```text id="j5dtwq"
business integrity

financial truth

operational traceability

human accountability
```

---

# 152. Final Strategic Principle

The goal is not:

```text id="3qn73b"
BUILD EVERYTHING
BEFORE TEEStock STARTS
```

and it is not:

```text id="3q5nzr"
START SELLING
WHILE THE FOUNDER
IS STILL THE ENTIRE OPERATING SYSTEM
```

The target balance is:

```text id="l5bxlk"
BUILD ENOUGH GOVERNED SYSTEM
TO OPERATE SAFELY
        ↓
RUN REAL BUSINESS
        ↓
LEARN
        ↓
BUILD ONLY WHAT REALITY PULLS
```

Current canonical direction:

> **The MGBOS transactional spine is already closed at the Phase 1 software level. The next leverage comes from Founder Control, operational readiness, and real TeeStock Business/Custom transactions—not from reopening solved Phase 1 work or expanding into speculative ERP breadth.**

And the long-term solo-founder principle remains:

> **Normal work should flow quietly through governed systems. Abnormal work should become explicit. Founder attention should be reserved for decisions that actually require founder judgment.**
