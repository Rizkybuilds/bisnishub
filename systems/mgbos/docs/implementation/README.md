---
canonical_id: mgbos.implementation.index
status: ACTIVE
version: 1.0
owner: Rizky
author: OpenAI / ChatGPT
approver: Rizky
scope: mgbos-implementation
document_class: navigation-index
effective_from: 2026-09-30
authoritative_for:
  - mgbos implementation documentation navigation
  - implementation phase routing
  - implementation-document placement
last_reviewed: 2026-09-30
review_cadence: per-material-implementation-phase-change
depends_on:
  - ../README.md
  - ../architecture/README.md
  - ../../../../docs/governance/canonical-source-map.md
supersedes: null
implementation_status: DOCUMENTATION_INDEX
---

# MGBOS Implementation Index v1.0

## 1. Purpose

Directory ini menyimpan dokumentasi untuk:

> **bounded implementation work yang menerjemahkan canonical architecture menjadi perubahan software yang dapat dibangun, diuji, dan diverifikasi.**

Implementation documentation menjawab:

```text
WHAT ARE WE BUILDING NOW?

WHY NOW?

WHAT IS THE CURRENT GAP?

WHAT IS IN SCOPE?

WHAT MUST PASS?

WHAT EVIDENCE CLOSES THE WORK?
```

---

# 2. Implementation Is Not Architecture Authority

Canonical architecture remains under:

```text
systems/mgbos/docs/architecture/
```

Implementation documents MUST NOT silently redefine:

```text
entities

state semantics

business invariants

authorization

command/event semantics

system boundaries
```

If implementation exposes a real architecture conflict:

```text
STOP
↓
REPORT CONFLICT
↓
RECONCILE CANONICAL OWNER
↓
CONTINUE
```

---

# 3. Implementation Documentation Owns

This directory may contain:

```text
phase plans

current implementation audits

bounded backlogs

synthetic scenarios

acceptance tests

completion reports
```

These documents control execution, not long-term semantic ownership.

---

# 4. Current Implementation Program

Current primary program:

```text
phase-1-operating-spine/
```

Purpose:

> **Turn existing MGBOS modules into one coherent TeeStock Lead-to-Margin operating spine.**

---

# 5. Phase 1

Entry point:

```text
phase-1-operating-spine/README.md
```

Core documents:

```text
operating-spine-plan.md

current-operating-spine-audit.md

backlog.md
```

Later evidence/support documents:

```text
synthetic-scenarios.md

operator-acceptance-test.md

completion-report.md
```

---

# 6. Phase 1 Core Objective

```text
Lead
→ Requirement
→ Quote
→ Order
→ Invoice / Payment
→ Production
→ Vendor Assignment
→ Work Order
→ QC
→ Shipment
→ Actual Cost
→ Realized Margin
→ Order Completion
```

without founder acting as manual integration middleware.

---

# 7. Current Phase 1 Task Sequence

```text
P0-01 Lead → Requirement

P0-02 Order Lifecycle

P0-03 Vendor-backed Assignment

P0-04 Assignment Acceptance / Reassignment

P0-05 Fulfillment Readiness

P0-06 Work Order / SPK

P0-07 Clean Happy-Path E2E

P0-08 Operator Acceptance
```

The authoritative task details live in:

```text
phase-1-operating-spine/backlog.md
```

---

# 8. Implementation Phase Rule

A new phase directory should exist only when:

```text
real execution is about to begin

scope is sufficiently bounded

dependencies are understood

there is an identifiable completion gate
```

Do not create empty future phase trees for aesthetic completeness.

---

# 9. Future Phase Destinations

Potential future implementation phases include:

```text
phase-2-founder-control/

phase-3-automation/

phase-4-jarvis-lite/

phase-5-launch-readiness/
```

These are semantic destinations only.

They SHOULD NOT be created until real implementation work reaches them.

---

# 10. Document Placement Rule

Use:

```text
implementation/<phase>/operating-plan.md
```

for planned execution.

Use:

```text
implementation/<phase>/current-*.md
```

for audited implementation baseline.

Use:

```text
implementation/<phase>/backlog.md
```

for bounded execution tasks.

Use:

```text
implementation/<phase>/completion-report.md
```

for closure evidence.

---

# 11. Architecture Before Implementation

Before implementing a task, read relevant:

```text
architecture/canonical-data-model.md

architecture/business-state-machines.md

architecture/business-invariants.md

architecture/command-event-model.md

architecture/permission-authorization-model.md

architecture/domain-map-capability-ownership.md
```

as applicable.

---

# 12. Business Requirement Before Implementation

For TeeStock-driven work, also read the appropriate source under:

```text
bisnis/teestock/
```

Business requirements explain:

```text
what TeeStock needs
```

MGBOS canonical architecture determines:

```text
how governed system truth represents it
```

---

# 13. Implementation Execution Model

Preferred:

```text
CANONICAL SOURCES
        ↓
PHASE PLAN
        ↓
CURRENT AUDIT
        ↓
ONE BACKLOG ITEM
        ↓
IMPLEMENT
        ↓
TEST
        ↓
VERIFY
        ↓
REPORT
        ↓
STOP
```

---

# 14. One Task at a Time

Default Phase 1 execution is serialized.

Do not automatically continue from:

```text
P0-01
```

into:

```text
P0-02
```

without reviewing the result.

The objective is:

```text
LOW REWORK
+
CLEAR CAUSALITY
+
CONTROLLED CHANGE
```

not maximum concurrent coding activity.

---

# 15. Implementation Reports

Task execution should return:

```text
IMPLEMENTED

FILES CHANGED

MIGRATIONS

TESTS RUN

VERIFICATION RESULT

KNOWN LIMITATIONS

NEXT DEPENDENCY
```

This output becomes implementation evidence.

---

# 16. Migration Rule

For database evolution:

```text
FORWARD MIGRATIONS ONLY
```

Do not rewrite historical applied migration files to alter behavior.

---

# 17. Mutation Rule

Consequential business mutation must preserve:

```text
authorization

organization isolation

state validation

business invariants

transaction integrity

auditability

idempotency where relevant
```

---

# 18. No Direct Frontend Truth Mutation

Do not solve workflow gaps by introducing:

```text
frontend
→ arbitrary direct database update
```

for governed transactional state.

Preferred:

```text
UI
→ server action
→ command / RPC
→ validation
→ transaction
→ audit
```

---

# 19. Test Philosophy

Use the smallest relevant test combination.

Possible layers:

```text
domain
validation
authorization
database / pgTAP
integration
E2E
operator acceptance
```

Do not create unnecessary test infrastructure.

---

# 20. Definition of Implementation Complete

Implementation is not complete because:

```text
code compiles
```

It is complete when:

```text
implemented
+
tested
+
verified
```

against the task acceptance criteria.

---

# 21. Evidence

Implementation evidence may come from:

```text
tests

E2E results

build results

operator acceptance

implementation reports

runtime verification
```

Evidence proves current behavior.

It does not redefine canonical architecture.

---

# 22. Scope Expansion Rule

If a task appears to require:

```text
new root entity

major architecture redesign

new system

new authority boundary

destructive migration

large permission redesign
```

implementation should:

```text
STOP
+
REPORT
```

rather than silently expand scope.

---

# 23. Current Priority

Current MGBOS priority is:

```text
CONNECT
HARDEN
VERIFY
```

not:

```text
EXPAND ERP BREADTH
```

---

# 24. Navigation

```text
systems/mgbos/docs/
        │
        ▼
implementation/
        │
        └── phase-1-operating-spine/
                │
                ├── README.md
                ├── operating-spine-plan.md
                ├── current-operating-spine-audit.md
                ├── backlog.md
                ├── synthetic-scenarios.md
                ├── operator-acceptance-test.md
                └── completion-report.md
```

Only documents required by current implementation should physically exist.

---

# 25. Final Principle

> **Architecture determines what must remain true. Implementation documentation determines what we are changing now. Evidence proves whether the change actually works.**
