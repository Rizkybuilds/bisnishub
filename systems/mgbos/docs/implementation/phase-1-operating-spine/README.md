---
canonical_id: teestock.implementation.phase1-operating-spine-index
status: ACTIVE
version: 1.0
owner: Rizky
author: OpenAI / ChatGPT
approver: Rizky
scope: mgbos-teestock-phase1
document_class: navigation-index
effective_from: 2026-09-30
authoritative_for:
  - phase-1 documentation navigation
  - phase-1 execution entry point
  - phase-1 document ownership routing
  - phase-1 reading order
last_reviewed: 2026-09-30
review_cadence: after-material-phase1-change
depends_on:
  - ../README.md
  - ../../architecture/domain-map-capability-ownership.md
  - operating-spine-plan.md
  - current-operating-spine-audit.md
  - backlog.md
supersedes: null
implementation_status: DOCUMENTATION_INDEX
---

# Phase 1 — Operating Spine Index v1.0

## 1. Purpose

Directory ini adalah execution workspace untuk:

> **menutup gap antara modul MGBOS yang sudah ada dan satu operating spine TeeStock yang benar-benar dapat digunakan end-to-end.**

Phase 1 tidak bertujuan memperluas MGBOS menjadi ERP yang lebih besar.

Target utamanya:

```text
EXISTING MODULES
       ↓
CONNECTED
       ↓
GOVERNED
       ↓
VERIFIED
       ↓
ONE OPERATING SPINE
```

---

# 2. Business Objective

Phase 1 harus membuktikan:

```text
Lead
→ Requirement
→ Quote
→ Order
→ Invoice / Payment
→ Production
→ Production Assignment
→ Work Order / SPK
→ QC
→ Shipment
→ Actual Cost
→ Realized Margin
→ Order Completion
```

tanpa founder menjadi manual router antar-modul.

---

# 3. Phase 1 Core Documents

## Implementation Plan

```text
operating-spine-plan.md
```

Owns:

```text
scope
implementation sequence
non-goals
verification strategy
phase exit gate
```

Read this to understand:

> **What are we trying to accomplish?**

---

## Current Implementation Audit

```text
current-operating-spine-audit.md
```

Owns:

```text
repository baseline
current implementation evidence
current gaps
current-vs-target assessment
```

Read this to understand:

> **What actually exists right now?**

---

## Execution Backlog

```text
backlog.md
```

Owns:

```text
P0-01 ... P0-08

task scope

acceptance criteria

likely code areas

tests

dependencies

stop conditions
```

Read this to understand:

> **What exactly should be implemented next?**

---

# 4. Reading Order

For implementation work:

```text
1. Relevant repository / system AGENTS instructions

2. Relevant canonical architecture

3. operating-spine-plan.md

4. current-operating-spine-audit.md

5. backlog.md

6. ONE selected P0 task

7. current source code / migrations / tests
```

Do not begin from the backlog alone if the task affects business semantics.

---

# 5. Current Execution Sequence

```text
P0-01
Lead → Requirement Continuation

        ↓

P0-02
Authoritative Order Lifecycle

        ↓

P0-03
Vendor-Backed Production Assignment

        ↓

P0-04
Assignment Acceptance / Reassignment

        ↓

P0-05
Fulfillment Readiness Guard

        ↓

P0-06
Governed Work Order / SPK

        ↓

P0-07
Clean Happy-Path E2E

        ↓

P0-08
Operator Acceptance Test
```

Default execution is sequential.

---

# 6. Current Execution State

Execution progress:

```text
P0-01  DONE
P0-02  DONE
P0-03  DONE
P0-04  DONE
P0-05  DONE
P0-06  DONE
P0-07  DONE
P0-08  READY
```

P0-01 through P0-07 are verified and passing across unit, database, and E2E suites. P0-08 (Operator Acceptance Test) is ready for execution.

---

# 7. Current Phase Principle

> **Connect and harden before expanding.**

Current MGBOS already materially implements most required domains.

Therefore Phase 1 should primarily use:

```text
existing entities

existing commands

existing state machines

existing permissions

existing application patterns
```

before introducing new abstractions.

---

# 8. Phase 1 Non-Goals

Do not introduce during Phase 1 without explicit evidence:

```text
Opportunity

generic Project

generic Partner super-domain

full Product / Catalog

Creator / Royalty

Affiliate

generic Operational Exception

full Founder Command Center

autonomous JARVIS

new distributed infrastructure
```

---

# 9. New Entity Rule

If a P0 task appears to require a new root entity:

```text
STOP
```

and determine first whether the capability can be represented as:

```text
existing entity extension

command

view

read model

workflow

generated artifact
```

A new aggregate requires explicit architectural justification.

---

# 10. Work Order Special Rule

Phase 1 Work Order / SPK is currently intended as:

```text
GENERATED GOVERNED ARTIFACT
```

not:

```text
NEW WORK_ORDER ROOT ENTITY
```

unless implementation proves an independent lifecycle is genuinely required.

---

# 11. Implementation Execution Pattern

For every task:

```text
READ CANONICAL SOURCES
        ↓
AUDIT CURRENT IMPLEMENTATION
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

Do not automatically continue into the next task.

---

# 12. Required Completion Report Per Task

Execution output should include:

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

# 13. Database Rule

If database behavior changes:

```text
FORWARD MIGRATION ONLY
```

Do not rewrite already-applied migrations.

---

# 14. Mutation Rule

Consequential mutation must remain behind governed application/system boundaries.

Preferred:

```text
UI
 ↓
Server Action
 ↓
Command / RPC
 ↓
Authorization
 ↓
State Validation
 ↓
Business Invariants
 ↓
Transaction
 ↓
Audit
```

Not:

```text
UI
 ↓
arbitrary direct database mutation
```

---

# 15. Core Integrity Constraints

Every Phase 1 task must preserve:

```text
organization isolation

RLS

RBAC

integer-IDR semantics

Cost Trilogy

historical snapshots

financial ceilings

idempotency where applicable

auditability

canonical state semantics
```

---

# 16. Test Layers

Use whichever layers are relevant:

```text
domain tests

validation tests

authorization tests

pgTAP / database tests

integration tests

E2E

operator acceptance
```

Do not build a new test framework merely for symmetry.

---

# 17. Current P0 Risks

The current launch-critical risks are primarily:

```text
workflow discontinuity

Order lifecycle drift

ambiguous Vendor identity

Assignment state contradiction

unsafe fulfillment

production communication through chat

missing clean E2E proof

unverified operator journey
```

Not:

```text
missing AI agents

missing Creator platform

missing large product catalog
```

---

# 18. Supporting Documents — Create When Needed

The following files belong in this directory but should be created only when execution reaches them.

## Synthetic Scenarios

```text
synthetic-scenarios.md
```

Purpose:

```text
happy path

negative scenarios

failure scenarios

test fixture definitions
```

---

## Operator Acceptance

```text
operator-acceptance-test.md
```

Purpose:

```text
normal UI journey

observed friction

blockers

acceptance result
```

---

## Completion Report

```text
completion-report.md
```

Purpose:

```text
final Phase 1 evidence

remaining limitations

closure decision
```

---

# 19. Do Not Create Empty Documents

Directory completeness is not the goal.

Canonical rule:

> **A document should exist because current work needs an owner—not because the directory looks incomplete.**

---

# 20. Phase 1 Exit Gate

Phase 1 cannot close until:

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

or a known limitation has been explicitly reviewed and accepted as non-blocking.

---

# 21. Phase 1 Completion Standard

Phase 1 success means:

```text
one real-equivalent transaction
can flow through normal MGBOS behavior
```

without:

```text
manual SQL

database repair

hidden spreadsheet

manual context reconstruction

unsafe state override
```

---

# 22. Founder-Burden Test

Each P0 task should eliminate one form of founder middleware.

```text
P0-01
→ stop manually carrying Lead context

P0-02
→ stop mentally interpreting Order lifecycle

P0-03
→ stop mapping vendor names manually

P0-04
→ stop manually verifying acceptance truth

P0-05
→ stop manually deciding shipment readiness

P0-06
→ stop reconstructing production instructions

P0-07
→ stop guessing whether modules work together

P0-08
→ stop guessing whether normal UI is usable
```

---

# 23. Architecture Escalation

If implementation reveals conflict with canonical:

```text
Data Model

State Machines

Business Invariants

Command/Event Model

Permission Model

Domain Map
```

do not silently change semantics.

Process:

```text
STOP
 ↓
DOCUMENT CONFLICT
 ↓
RECONCILE CANONICAL OWNER
 ↓
RESUME IMPLEMENTATION
```

---

# 24. Phase 1 Navigation

```text
phase-1-operating-spine/
│
├── README.md
│      you are here
│
├── operating-spine-plan.md
│      scope / strategy
│
├── current-operating-spine-audit.md
│      current reality
│
├── backlog.md
│      executable tasks
│
├── synthetic-scenarios.md
│      create when testing reaches it
│
├── operator-acceptance-test.md
│      create during P0-08
│
└── completion-report.md
       create at phase closure
```

---

# 25. Immediate Next Action

Once documentation closure is persisted and validated:

```text
START ONLY:

P0-01
Lead → Requirement Continuation
```

Source of execution detail:

```text
backlog.md
```

Do not bundle P0-02.

---

# 26. Final Principle

> **Phase 1 is successful when existing MGBOS modules stop behaving like separate software features and start behaving like one business operating system.**
