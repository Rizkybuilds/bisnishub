---
canonical_id: mgbos.architecture.index
status: ACTIVE
version: 2.0
owner: Rizky
author: OpenAI / ChatGPT
approver: Rizky
scope: mgbos-architecture
document_class: canonical-navigation-index
effective_from: 2026-09-30
authoritative_for:
  - mgbos architecture navigation
  - mgbos architecture source routing
  - canonical architecture reading order
  - architecture document ownership boundaries
  - current-vs-historical architecture source classification
last_reviewed: 2026-09-30
review_cadence: monthly-during-active-development
depends_on:
  - ../../../../docs/governance/documentation-constitution.md
  - ../../../../docs/governance/canonical-source-map.md
  - ../../../../docs/architecture/master-system-blueprint.md
  - ../../../../docs/architecture/system-boundaries.md
  - ../../../../docs/architecture/architectural-laws.md
  - ../README.md
supersedes:
  - mgbos.architecture.index@1.0
implementation_status: DOCUMENTATION_INDEX
---

# MultiGraph Business OS — Architecture Index v2.0

## 1. Purpose

Dokumen ini adalah entry point canonical untuk arsitektur MGBOS.

Tujuannya adalah membantu manusia maupun AI menemukan:

- sumber canonical untuk data model;
- sumber canonical untuk lifecycle/state;
- sumber canonical untuk business invariants;
- sumber canonical untuk command/event semantics;
- sumber canonical untuk authorization;
- keputusan arsitektur yang relevan;
- current implementation maturity;
- dan sumber historis jika rationale diperlukan.

Dokumen ini **bukan** tempat untuk mendefinisikan ulang seluruh arsitektur.

Canonical rule:

> **Architecture Index routes authority. Dedicated specifications own semantics.**

---

# 2. Architecture Reading Model

```text
CROSS-SYSTEM GOVERNANCE
        │
        ▼
MGBOS ARCHITECTURE INDEX
        │
        ├── Canonical Data Model
        ├── Business State Machines
        ├── Business Invariants
        ├── Command & Event Model
        ├── Permission & Authorization Model
        └── Domain Map & Capability Ownership
                 │
                 ▼
              ADRs
                 │
                 ▼
      IMPLEMENTATION / TESTS
                 │
                 ▼
              EVIDENCE
```

---

# 3. Fundamental Architecture Principle

MGBOS is the governed operational business system.

Its core responsibility is to maintain:

```text
BUSINESS IDENTITY
+
BUSINESS STATE
+
BUSINESS TRANSACTIONS
+
BUSINESS INTEGRITY
+
BUSINESS HISTORY
```

It is not responsible for every concept in BisnisHub.

---

# 4. MGBOS Position in BisnisHub

Canonical relationship:

```text
TEEStock / Business Layer
defines business requirements
        │
        ▼
      MGBOS
governs operational truth
        │
        ▼
     JARVIS
reasons over that truth
        │
        ▼
 Automation / Providers
execute bounded external work
```

MGBOS must remain usable without JARVIS.

---

# 5. Primary Architecture Sources

The following documents are the current dedicated canonical architecture specifications.

| Concept | Canonical Source | Status |
|---|---|---|
| Entity and relationship semantics | `canonical-data-model.md` | ACTIVE |
| Business lifecycle semantics | `business-state-machines.md` | ACTIVE |
| Business integrity rules | `business-invariants.md` | ACTIVE |
| Commands, events and integration mutation boundary | `command-event-model.md` | ACTIVE |
| Identity, roles and authorization | `permission-authorization-model.md` | ACTIVE |
| Domain/capability ownership and expansion | `domain-map-capability-ownership.md` | ACTIVE-READY / target until persisted |

---

# 6. Canonical Data Model

Canonical source:

```text
systems/mgbos/docs/architecture/
canonical-data-model.md
```

Canonical ID:

```text
mgbos.architecture.canonical-data-model
```

Owns:

```text
business entities

entity identity

relationships

aggregate boundaries

snapshot semantics

monetary representation

CURRENT versus future entity classification
```

It is the primary semantic source for the MGBOS data model.

---

# 7. Data Model ≠ Physical Schema Alone

The physical PostgreSQL schema is implementation truth.

The Canonical Data Model defines intended entity semantics.

Therefore:

```text
CANONICAL DATA MODEL
        ↕
DATABASE SCHEMA
```

must remain aligned.

Mismatch is architecture or implementation drift.

---

# 8. Current Major MGBOS Domains

Current canonical model contains operational capability across domains including:

```text
Organization & Identity

Customer

CRM / Lead

Requirement

Quotation

Order

Production

Vendor

Quality Control

Customer Finance

Analytical Finance

Fulfillment

Inventory

Procurement
```

Some capabilities within those domains have different implementation maturity.

Do not infer completeness merely from entity existence.

---

# 9. Business State Machines

Canonical source:

```text
business-state-machines.md
```

Canonical ID:

```text
mgbos.architecture.business-state-machines
```

Owns:

```text
state vocabularies

allowed transitions

terminal states

stored versus derived state

cross-domain lifecycle coordination

implementation maturity of transitions
```

---

# 10. Independent Lifecycle Principle

MGBOS does not collapse all business progress into one giant Order status.

Examples of separate lifecycle ownership:

```text
Lead
Requirement
Quote
Order
Invoice
Payment
Production Job
Production Assignment
Shipment
Procurement
```

These domains may influence each other without becoming the same state machine.

---

# 11. Derived Business State

Founder-facing views may derive concepts such as:

```text
WAITING_PAYMENT

PRODUCTION_AT_RISK

READY_TO_SHIP

NEEDS_ATTENTION
```

from multiple authoritative entities.

Derived state MUST NOT silently become competing transactional truth.

---

# 12. Business Invariants

Canonical source:

```text
business-invariants.md
```

Canonical ID:

```text
mgbos.architecture.business-invariants
```

Owns rules that must remain valid regardless of execution surface.

Examples include:

```text
organization isolation

financial integrity

historical snapshot integrity

payment allocation correctness

inventory non-negativity

procurement ceilings

shipment ceilings

Cost Trilogy separation

idempotency expectations
```

---

# 13. Invariant Precedence

No:

```text
UI

automation

AI

approval

operator role
```

may bypass a canonical invariant.

---

# 14. Command & Event Model

Canonical source:

```text
command-event-model.md
```

Canonical ID:

```text
mgbos.architecture.command-event-model
```

Owns:

```text
query-command separation

command semantics

command identity

idempotency

business event semantics

event contracts

audit versus event distinction

transactional outbox direction

n8n/JARVIS mutation boundary
```

---

# 15. Commands Request Change

Canonical:

```text
COMMAND
→ request to change authoritative business state
```

Examples conceptually:

```text
CreateQuote

RecordPayment

AssignProductionJob

CreateShipment
```

Mutations should use governed semantic operations rather than arbitrary direct state editing.

---

# 16. Events Report Facts

Canonical:

```text
EVENT
→ statement that a meaningful fact occurred
```

Example:

```text
mgbos.payment.recorded
```

An event is historical evidence of an occurrence.

It is not necessarily current state.

---

# 17. Current Event Runtime Maturity

Important current fact:

```text
FULL BUSINESS EVENT RUNTIME
=
NOT YET VERIFIED / IMPLEMENTED
```

and:

```text
TRANSACTIONAL OUTBOX PRODUCTION SLICE
=
NOT YET VERIFIED
```

unless newer implementation evidence explicitly proves otherwise.

Therefore this Architecture Index MUST NOT claim:

```text
"every state change currently writes
a production outbox event"
```

as current reality.

---

# 18. Transactional Outbox Is a Canonical Pattern

Accepted architectural direction:

```text
BUSINESS MUTATION
+
OUTBOX RECORD
=
ONE ATOMIC TRANSACTION
```

when external event consumers justify the pattern.

This is an architectural rule/direction.

It is not a blanket claim about current implementation maturity.

---

# 19. Permission & Authorization

Canonical source:

```text
permission-authorization-model.md
```

Canonical ID:

```text
mgbos.architecture.permission-authorization-model
```

Owns:

```text
authentication relationship

organization membership

roles

capability direction

command authorization

tenant isolation

approval boundary

service-principal direction

JARVIS/automation authority
```

---

# 20. Current Human Roles

Current role model includes:

```text
OWNER

ADMIN

SALES

OPERATIONS

FINANCE

QC
```

Current implementation remains largely role-driven.

Longer-term capability-based authorization is architectural direction, not a reason to prematurely replace the working model.

---

# 21. Authorization ≠ Business Validation

Canonical flow:

```text
WHO IS THE ACTOR?
        ↓
MAY THEY ATTEMPT THIS?
        ↓
IS THE CURRENT BUSINESS STATE VALID?
        ↓
DO INVARIANTS ALLOW IT?
        ↓
EXECUTE
```

Permission cannot make an invalid business operation valid.

---

# 22. Domain Map & Capability Ownership

Canonical target:

```text
domain-map-capability-ownership.md
```

Canonical ID:

```text
mgbos.architecture.domain-map-capability-ownership
```

Purpose:

```text
classify domains/capabilities as:

CURRENT
PARTIAL
NEXT
DEFERRED
OUTSIDE_MGBOS
```

and determine whether capability ownership belongs to:

```text
MGBOS

business layer

JARVIS

automation

external provider

physical partner
```

---

# 23. Domain Map Current Repository State

The specification has been prepared as an ACTIVE-ready canonical document but is not yet present in the repository snapshot audited for this index.

Until persisted:

```text
canonical-data-model.md
+
other dedicated architecture specs
+
current implementation
```

remain the authoritative sources for existing semantics.

The missing Domain Map file MUST NOT be fabricated by downstream agents.

---

# 24. Architecture Decisions

Durable implementation choices are recorded under:

```text
systems/mgbos/docs/adr/
```

ADRs explain why a technical direction was selected.

---

# 25. Foundational ADRs

Important foundational decisions include:

```text
ADR-001
Modular Monolith

ADR-002
PostgreSQL as System of Record

ADR-003
Supabase

ADR-004
n8n as Orchestrator

ADR-005
Transactional Outbox

ADR-006
Provider-Independent AI Gateway
```

Additional ADRs cover later implementation slices and workspace decisions.

Always inspect the current ADR directory for complete inventory.

---

# 26. Modular Monolith

Canonical decision:

```text
MGBOS remains one bounded deployable system
with internal modular domain boundaries
```

until actual requirements justify distributed architecture.

Do not introduce microservices merely because individual domains exist.

---

# 27. PostgreSQL System of Record

Canonical:

> **Canonical transactional facts and business integrity live in PostgreSQL through the MGBOS architecture.**

Therefore:

```text
spreadsheet
frontend state
n8n state
AI memory
chat history
```

cannot become competing business systems of record.

---

# 28. Domain Purity

Business logic SHOULD remain separated from presentation/provider details where practical.

Current package architecture uses dedicated domain code for reusable deterministic business rules.

However:

> **Domain purity must serve maintainability, not create unnecessary abstraction layers.**

---

# 29. Monetary Integrity

Canonical rules live primarily in:

```text
canonical-data-model.md
business-invariants.md
```

MGBOS uses integer Rupiah semantics for authoritative money calculations.

Floating-point money arithmetic must not become authoritative transaction logic.

---

# 30. Cost Trilogy

Canonical financial distinction:

```text
ESTIMATED COST

COMMITTED COST

ACTUAL COST
```

These values represent different business facts.

They must not be collapsed into one generic cost field.

---

# 31. Estimated Cost

Represents expected economic cost before a binding external/internal commitment.

Typical use:

```text
quote costing
```

---

# 32. Committed Cost

Represents cost the business has materially committed to.

Examples:

```text
vendor production assignment

purchase commitment
```

according to the relevant transaction model.

---

# 33. Actual Cost

Represents reconciled observed economic cost after execution.

Actual Cost must not simply copy Estimated Cost to make reports complete.

---

# 34. Shipping Pass-Through

Shipping revenue/cost semantics must follow canonical finance invariants.

Product economics and pass-through logistics should remain distinguishable where required.

Detailed formulas belong to dedicated data/invariant specifications and implementation.

They MUST NOT be independently redefined in this index.

---

# 35. Rules Before AI

Canonical:

> **Deterministic business rules should remain deterministic.**

AI may:

```text
analyze

classify

recommend

draft
```

AI may not replace:

```text
financial constraints

authorization

state transition rules

business invariants
```

---

# 36. JARVIS Boundary

JARVIS is a separate intelligence system.

Canonical JARVIS architecture lives under:

```text
systems/jarvis/docs/
```

MGBOS exposes governed:

```text
reads

commands

business evidence
```

to JARVIS when appropriate.

JARVIS does not own MGBOS business truth.

---

# 37. n8n Boundary

Accepted architecture:

```text
n8n
=
orchestration
```

It may coordinate:

```text
schedules

external integrations

notifications

workflow routing
```

but MGBOS remains authority for MGBOS-owned business state.

---

# 38. External Provider Boundary

External systems may own provider-side facts.

Examples:

```text
payment-provider transaction state

courier tracking scan

external channel order event
```

MGBOS owns the normalized internal business interpretation.

---

# 39. Physical Reality Boundary

A database record does not automatically prove physical reality.

Examples requiring observation/evidence:

```text
production completed

QC passed

shipment handed to courier

delivery completed
```

MGBOS stores the governed business representation of those observations.

---

# 40. Current Implementation Is Not Uniformly Mature

Different MGBOS domains have different maturity.

Possible classifications include:

```text
implemented

partially implemented

schema-reserved

canonical target

not implemented
```

Use the relevant dedicated specification and current implementation evidence.

Do not infer maturity from this index.

---

# 41. Known Current Architecture Gaps

Current dedicated specifications already identify gaps including:

```text
generic Order transition enforcement

complete Quote exception-state commands

some Invoice lifecycle commands

full production business-event runtime

transactional outbox production runtime

generalized service-principal model

full capability authorization registry
```

These are documented gaps.

They are not permission for uncontrolled implementation.

---

# 42. Current TeeStock Operating-Spine Focus

Current implementation priority centers on:

```text
Lead
→ Requirement
→ Quote
→ Order
→ Invoice / Payment
→ Production
→ QC
→ Shipment
→ Cost / Margin
```

This is an implementation priority.

It does not reduce MGBOS to a TeeStock-only architecture.

---

# 43. Business-Specific Data

Apparel-specific concepts such as:

```text
GSM

fabric composition

print placement

decoration details

size breakdown
```

should not automatically become universal MGBOS fields.

Prefer business/domain specifications attached to generic transactional entities where appropriate.

---

# 44. Generic Abstraction Rule

A new shared MGBOS abstraction SHOULD be introduced only when it has:

```text
stable meaning

independent lifecycle or integrity requirement

repeated operational need

clear ownership

real reuse value
```

not merely hypothetical future utility.

---

# 45. Architecture Expansion Rule

Canonical sequence:

```text
REAL BUSINESS NEED
        ↓
REPEATED OPERATING FRICTION
        ↓
CAPABILITY GAP
        ↓
ARCHITECTURE ANALYSIS
        ↓
SMALLEST CORRECT CAPABILITY
        ↓
IMPLEMENT
        ↓
VERIFY
```

---

# 46. Architecture Does Not Mean New Entity

A capability may be implemented as:

```text
query/read model

command

view

generated artifact

workflow

integration

automation

JARVIS skill
```

without creating another database aggregate.

---

# 47. Historical Sources

Historical MGBOS architecture material remains under:

```text
catatan/sesi/
```

including Sep-23 design documents.

They are valuable for:

```text
rationale

design provenance

earlier alternatives

unpromoted detail
```

but are no longer the default source for concepts already promoted.

---

# 48. Historical Source Precedence

If a historical note conflicts with:

```text
canonical-data-model.md

business-state-machines.md

business-invariants.md

command-event-model.md

permission-authorization-model.md
```

the dedicated canonical specification wins.

---

# 49. Implementation Evidence

Implementation reality is evidenced by:

```text
source code

database migrations

domain tests

pgTAP tests

integration tests

E2E tests

implementation reports
```

These verify current behavior.

They do not silently redefine architectural intent.

---

# 50. Architecture Drift

When implementation differs from canonical architecture:

```text
IMPLEMENTATION_DRIFT
```

When documentation no longer describes intended/current semantics correctly:

```text
DOCUMENTATION_DRIFT
```

Both require explicit reconciliation.

---

# 51. Example — Order State

Canonical State Machine documents intended Order lifecycle.

Current implementation audit may show incomplete transition commands.

Correct interpretation:

```text
CANONICAL LIFECYCLE
exists

IMPLEMENTATION
partial
```

Wrong interpretation:

```text
missing command
=
state rule does not matter.
```

---

# 52. Example — Transactional Outbox

ADR-005 establishes the architectural pattern.

Command/Event specification records current implementation maturity.

Correct:

```text
OUTBOX
canonical architecture direction
+
not yet fully verified runtime
```

Wrong:

```text
ADR accepted
=
outbox already operational everywhere.
```

---

# 53. Example — Opportunity

Historical designs may mention:

```text
Opportunity
```

Current Canonical Data Model states it is not a current canonical entity.

Therefore:

```text
Opportunity
=
future/deferred concept
```

until deliberately promoted.

---

# 54. Architecture Reading Order — General

For architecture changes:

```text
1. Documentation Constitution

2. Canonical Source Map

3. Master System Blueprint

4. System Boundaries

5. Architectural Laws

6. this Architecture Index

7. relevant dedicated MGBOS spec

8. relevant ADR

9. current implementation/evidence
```

---

# 55. Architecture Reading Order — Data Change

```text
canonical-data-model.md

business-invariants.md

business-state-machines.md
if lifecycle affected

permission-authorization-model.md
if access affected

command-event-model.md
if mutation/integration affected
```

Then inspect schema/migrations.

---

# 56. Architecture Reading Order — New Workflow

Read:

```text
Domain Map

Canonical Data Model

State Machines

Invariants

Command & Event

Permission Model
```

before implementing consequential workflow mutations.

---

# 57. Architecture Reading Order — AI / Automation Integration

Read:

```text
Command & Event Model

Permission & Authorization Model

Business Invariants

System Boundaries

JARVIS / automation canonical docs
```

Never derive authority solely from tool availability.

---

# 58. Canonical Architecture Directory

Target:

```text
systems/mgbos/docs/architecture/
│
├── README.md
├── canonical-data-model.md
├── business-state-machines.md
├── business-invariants.md
├── command-event-model.md
├── permission-authorization-model.md
└── domain-map-capability-ownership.md
```

Do not add architecture documents merely to create symmetry.

---

# 59. When a New Architecture Document Is Justified

Create one only when a concept:

```text
has independent semantic ownership

is too important to remain a section elsewhere

has multiple downstream consumers

requires its own lifecycle/versioning
```

Otherwise extend the existing canonical owner.

---

# 60. Document Ownership Map

| Question | Read |
|---|---|
| What entities exist? | `canonical-data-model.md` |
| What does this status mean? | `business-state-machines.md` |
| What must always remain true? | `business-invariants.md` |
| How may this state change? | `command-event-model.md` |
| Who may attempt the change? | `permission-authorization-model.md` |
| Does this capability belong in MGBOS? | `domain-map-capability-ownership.md` |
| Why did we choose this technical pattern? | relevant ADR |
| Is it implemented right now? | current code/tests/evidence |

---

# 61. Do Not Put Product UX Here

Detailed:

```text
screen design

form layout

pilot UX

customer document presentation
```

belongs under:

```text
systems/mgbos/docs/product/
```

or the appropriate implementation specification.

---

# 62. Do Not Put Business Strategy Here

Detailed:

```text
TeeStock positioning

pricing philosophy

marketing

brand architecture

business roadmap
```

belongs under:

```text
bisnis/teestock/
```

---

# 63. Do Not Put Engineering Reports Here

Implementation reports belong under:

```text
systems/mgbos/docs/engineering/
```

or future evidence structure.

Architecture stays normative.

---

# 64. Do Not Put Session Notes Here

Working discussion remains:

```text
catatan/
```

until deliberately promoted.

---

# 65. Current Architecture Program State

Current architecture state is:

```text
CONTROLLED_CANONICALIZATION
```

Meaning:

```text
resolve known authority gaps

repair canonical indexes

persist mature canonical specs

support current implementation work
```

while avoiding speculative expansion.

---

# 66. Architecture Closure Condition

Architecture is sufficiently closed for the current Phase 1 implementation when:

```text
canonical source routing is clear

current core architecture specs are persisted

domain/capability ownership is clear

Phase 1 implementation scope is bounded

no known authority conflict blocks implementation
```

It does not require every future domain to be designed.

---

# 67. Current Next Architecture Document

After this index, the next new MGBOS architecture specification planned for persistence is:

```text
systems/mgbos/docs/architecture/
domain-map-capability-ownership.md
```

But cross-system operating context should first be persisted at its own owner location:

```text
docs/operating-model/
solo-founder-operating-system.md
```

following the closure sequence.

---

# 68. Architecture Index Success Definition

This index succeeds when someone can answer:

```text
What document owns this concept?

Is this current or future?

Where should I verify implementation?

Which historical source may explain the rationale?

Am I accidentally creating competing authority?
```

without reading every MGBOS document.

---

# 69. Final Principle

> **MGBOS architecture should be precise enough to protect business integrity and small enough to remain operable by a resource-constrained founder.**

And:

> **This README tells you where truth lives. The dedicated specifications define that truth.**