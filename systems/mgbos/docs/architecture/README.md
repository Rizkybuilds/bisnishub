---
canonical_id: mgbos.architecture.index
status: ACTIVE
version: 2.2
owner: Rizky
author: OpenAI / ChatGPT
approver: Rizky
scope: mgbos-architecture
document_class: canonical-navigation-index
effective_from: 2026-10-06

authoritative_for:
  - mgbos architecture navigation
  - mgbos architecture source routing
  - canonical architecture reading order
  - architecture document ownership boundaries
  - current-versus-historical architecture source classification
  - architecture-to-implementation routing

last_reviewed: 2026-10-06
review_cadence: monthly-during-active-development

depends_on:
  - ../../../../docs/governance/documentation-constitution.md
  - ../../../../docs/governance/canonical-source-map.md
  - ../../../../docs/architecture/master-system-blueprint.md
  - ../../../../docs/architecture/system-boundaries.md
  - ../../../../docs/architecture/architectural-laws.md
  - ../../../../docs/operating-model/solo-founder-operating-system.md
  - ../README.md

supersedes:
  - mgbos.architecture.index@2.1

implementation_status: DOCUMENTATION_INDEX
repository_snapshot: 63dec5a78462e3eff994ebdd0c15e31676b12bee
---

# MultiGraph Business OS — Architecture Index v2.2

## 1. Purpose

Dokumen ini adalah canonical navigation entrypoint untuk arsitektur MGBOS.

Fungsinya adalah membantu manusia maupun AI menemukan:

- semantic owner untuk data model;
- lifecycle dan state;
- business invariants;
- command dan event;
- permission dan authorization;
- domain/capability ownership;
- architecture decisions;
- current implementation evidence;
- historical design rationale.

Dokumen ini **tidak mendefinisikan ulang seluruh arsitektur**.

Canonical rule:

> **Architecture Index routes authority. Dedicated specifications own semantics.**

---

# 2. Authority Boundary

Dokumen ini authoritative untuk:

```text
WHERE MGBOS ARCHITECTURE TRUTH LIVES
```

Ia bukan authoritative owner untuk seluruh isi:

```text
entity semantics
state transition semantics
business invariants
command semantics
authorization semantics
domain ownership details
```

Semantics tersebut dimiliki oleh dedicated canonical specifications.

---

# 3. Architecture Authority Chain

Use:

```text
DOCUMENTATION CONSTITUTION
        ↓
CANONICAL SOURCE MAP
        ↓
CROSS-SYSTEM ARCHITECTURE
        ↓
MGBOS ARCHITECTURE INDEX
        ↓
DEDICATED MGBOS SPECIFICATION
        ↓
ADR
where relevant
        ↓
IMPLEMENTATION
        ↓
TESTS / EVIDENCE
```

---

# 4. Intended Truth vs Implementation Truth

Canonical architecture answers:

```text
WHAT SHOULD BE TRUE?
```

Implementation and runtime evidence answer:

```text
WHAT IS CURRENTLY TRUE?
```

Therefore:

```text
CANONICAL SPECIFICATION
≠
IMPLEMENTATION EVIDENCE
```

Architecture maturity classification explicitly distinguishes:

```text
CURRENT
Concept is materially represented and operationally implemented in active code/database.

CANONICAL_TARGET
Concept is formally accepted into the canonical MGBOS target architecture,
but physical implementation, schema, or runtime code is not yet active.

DEFERRED
Concept is acknowledged for potential future relevance, but not accepted into target horizon.
```

If canonical specifications and implementation disagree:

```text
DOCUMENTATION_DRIFT
```

or:

```text
IMPLEMENTATION_DRIFT
```

must be investigated.

---

# 5. Fundamental Architecture Principle

MGBOS is the governed operational business system.

Its core responsibility is maintaining:

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

MGBOS does not own every business concept in BisnisHub.

---

# 6. MGBOS Position in BisnisHub

Canonical relationship:

```text
BUSINESS LAYER
defines business need and policy

        ↓

MGBOS
holds governed operational truth

        ↓

JARVIS
interprets and reasons over governed truth

        ↓

AUTOMATION
coordinates deterministic workflows

        ↓

EXTERNAL PROVIDERS / PARTNERS
perform bounded external or physical work
```

MGBOS MUST remain usable without JARVIS.

---

# 7. Current Canonical Architecture Set

The complete current architecture directory is:

```text
systems/mgbos/docs/architecture/
│
├── README.md (v2.2)
├── canonical-data-model.md (v1.1)
├── business-state-machines.md (v1.1)
├── business-invariants.md (v1.1)
├── command-event-model.md (v1.1)
├── permission-authorization-model.md (v1.1)
└── domain-map-capability-ownership.md (v1.1)
```

All six dedicated specifications are present and aligned at version 1.1 following the W2 Founder Control Canonical Architecture Reconciliation (`VECP-003H`).

---

# 8. Primary Architecture Sources

| Semantic question                            | Canonical source                     | Version | Status |
| -------------------------------------------- | ------------------------------------ | ------- | ------ |
| What entities and relationships exist?       | `canonical-data-model.md`            | v1.1    | ACTIVE |
| What do lifecycle states mean?               | `business-state-machines.md`         | v1.1    | ACTIVE |
| What must always remain true?                | `business-invariants.md`             | v1.1    | ACTIVE |
| How may authoritative state change?          | `command-event-model.md`             | v1.1    | ACTIVE |
| Who may attempt an operation?                | `permission-authorization-model.md`  | v1.1    | ACTIVE |
| Which system/domain should own a capability? | `domain-map-capability-ownership.md` | v1.1    | ACTIVE |

These sources are complementary.

They MUST NOT compete for the same semantic responsibility.

---

# 9. Canonical Data Model

Canonical source:

```text
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
current-vs-future entity classification
```

---

# 10. Data Model Is Not Physical Schema Alone

Canonical Data Model defines intended entity semantics.

PostgreSQL schema is implementation truth.

Therefore:

```text
CANONICAL DATA MODEL
        ↕
PHYSICAL DATABASE SCHEMA
```

must remain aligned.

A database table existing does not automatically make its semantics canonical.

A canonical entity existing does not automatically prove its implementation is complete.

---

# 11. Current Major MGBOS Domains

The current architecture materially covers domains including:

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

Capability maturity varies within those domains.

Do not infer:

```text
ENTITY EXISTS
=
WORKFLOW COMPLETE
```

---

# 12. Business State Machines

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
stored state
derived state
cross-domain lifecycle coordination
transition maturity
```

---

# 13. Independent Lifecycle Principle

MGBOS does not collapse business progress into one giant Order status.

Separate lifecycle ownership exists for concepts such as:

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

These lifecycles may coordinate.

They MUST NOT silently become one state machine.

---

# 14. Derived Business State

Founder-facing read models may derive states such as:

```text
WAITING_PAYMENT
PRODUCTION_AT_RISK
READY_TO_SHIP
NEEDS_ATTENTION
```

Derived state is useful.

It MUST NOT become competing transactional truth unless deliberately promoted into canonical architecture.

---

# 15. Business Invariants

Canonical source:

```text
business-invariants.md
```

Canonical ID:

```text
mgbos.architecture.business-invariants
```

Owns cross-execution rules including applicable:

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

# 16. Invariant Precedence

No:

```text
UI
AI
automation
operator
approval
provider
```

may bypass a canonical MGBOS invariant.

Authorization answers whether an operation may be attempted.

Business invariants still determine whether the operation itself is valid.

---

# 17. Command & Event Model

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
business-event semantics
event contracts
audit-vs-event distinction
transactional-outbox direction
JARVIS / n8n mutation boundary
```

---

# 18. Command Semantics

Canonical:

```text
COMMAND
=
REQUEST TO CHANGE AUTHORITATIVE BUSINESS STATE
```

Conceptual examples:

```text
CreateQuote
RecordPayment
AssignProductionJob
CreateShipment
```

Consequential mutation SHOULD use governed semantic operations rather than arbitrary state editing.

---

# 19. Event Semantics

Canonical:

```text
EVENT
=
STATEMENT THAT A MEANINGFUL FACT OCCURRED
```

Example:

```text
mgbos.payment.recorded
```

An event is historical evidence.

It is not automatically the current business state.

---

# 20. Event Runtime Maturity

Architectural event semantics exist.

However architectural specification alone MUST NOT be interpreted as proof that:

```text
every business mutation
currently emits a complete production event
```

or:

```text
transactional outbox
is fully operational everywhere
```

Current implementation maturity must be verified through implementation/evidence sources.

---

# 21. Transactional Outbox

Transactional Outbox is an accepted architecture pattern.

Conceptually:

```text
BUSINESS MUTATION
+
OUTBOX RECORD
=
ONE ATOMIC TRANSACTION
```

when external event delivery justifies it.

An accepted ADR or architecture pattern is not proof that every command currently implements it.

---

# 22. Permission & Authorization

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
JARVIS / automation business authority
```

---

# 23. Current Human Role Model

Current role model includes:

```text
OWNER
ADMIN
SALES
OPERATIONS
FINANCE
QC
```

Current implementation remains materially role-driven.

Capability-based authorization is an architectural evolution path.

It MUST NOT be documented as fully implemented without evidence.

---

# 24. Authorization Is Not Business Validation

Canonical logical flow:

```text
WHO IS THE ACTOR?
        ↓
MAY THEY ATTEMPT THIS?
        ↓
IS CURRENT BUSINESS STATE VALID?
        ↓
DO BUSINESS INVARIANTS ALLOW IT?
        ↓
EXECUTE
```

Permission cannot make an invalid business action valid.

---

# 25. Technical Privilege Is Not Business Authority

Technical credentials such as:

```text
database admin
service role
deployment credential
repository write
```

do not automatically grant business authorization.

Likewise:

```text
business OWNER authority
```

does not require the same credential to hold every infrastructure privilege.

---

# 26. AI Has No Implicit Founder Authority

JARVIS, automation, engineering agents, or any AI runtime MUST NOT implicitly inherit:

```text
OWNER
```

business authority merely because Rizky owns the business.

Delegation for consequential operations must remain explicit and bounded.

---

# 27. Domain Map & Capability Ownership

Canonical source:

```text
domain-map-capability-ownership.md
```

Canonical ID:

```text
mgbos.architecture.domain-map-capability-ownership
```

This source is present and ACTIVE.

It owns:

```text
domain boundaries
capability ownership
current-vs-target classification
business-requirement promotion
TeeStock → MGBOS mapping
MGBOS → JARVIS boundary
MGBOS → automation boundary
external-provider boundary
domain expansion sequencing
```

---

# 28. Domain Map Current Repository State

Current state:

```text
FILE
systems/mgbos/docs/architecture/domain-map-capability-ownership.md

STATUS
ACTIVE

VERSION
1.0

IMPLEMENTATION STATUS
PARTIALLY_IMPLEMENTED
```

Therefore previous documentation claiming that this file:

```text
"has been prepared but is not yet present"
```

is superseded and MUST NOT be used.

---

# 29. Domain Capability Classification

The Domain Map uses:

```text
CURRENT
PARTIAL
NEXT
DEFERRED
EXPERIMENTAL
OUTSIDE_MGBOS
```

for domain/capability maturity and ownership planning.

These classifications belong to the Domain Map.

This Architecture Index MUST NOT independently redefine them.

---

# 30. Capability Ownership Model

At a high level:

```text
BUSINESS LAYER
→ defines business need and commercial policy

MGBOS
→ owns governed operational truth

JARVIS
→ interprets and coordinates governed truth

AUTOMATION
→ performs deterministic repetition/orchestration

EXTERNAL PROVIDER
→ owns provider-side facts

PHYSICAL PARTNER
→ performs external physical work

CROSS-SYSTEM GOVERNANCE
→ owns shared governance
```

Detailed ownership belongs to the Domain Map.

---

# 31. Underbuild vs Overbuild

The Domain Map exists partly to prevent:

```text
UNDERBUILD
→ founder remains the hidden operating system
```

and:

```text
OVERBUILD
→ MGBOS becomes an ERP monster
  before the business needs it
```

Architecture should grow from repeated operational truth.

---

# 32. Business Requirements Do Not Automatically Become Entities

Canonical principle:

> **Business requirements may pull MGBOS forward. They do not automatically become MGBOS entities.**

A new capability may be implemented as:

```text
query
read model
command
generated artifact
workflow
integration
automation
JARVIS capability
```

without adding another root aggregate.

---

# 33. Founder-Leverage Principle

A new MGBOS capability should materially do at least one of:

```text
remove operational ambiguity
protect business integrity
reduce founder burden
support repeated operational truth
```

Otherwise defer it until evidence improves.

---

# 34. Architecture Decisions

Durable technical decisions live under:

```text
systems/mgbos/docs/adr/
```

ADRs explain:

```text
WHY A TECHNICAL DIRECTION WAS CHOSEN
```

They do not replace semantic specifications.

---

# 35. Foundational ADR Themes

Foundational decisions include architecture directions such as:

```text
Modular Monolith
PostgreSQL as System of Record
Supabase
n8n as Orchestrator
Transactional Outbox
Provider-Independent AI Gateway
```

Always inspect the current ADR directory for the authoritative complete inventory.

Do not rely on this index as a permanent ADR list.

---

# 36. Modular Monolith

MGBOS remains a bounded deployable system with internal modular domain boundaries until real requirements justify stronger distribution.

Do not introduce microservices merely because multiple domains exist.

---

# 37. PostgreSQL as System of Record

Foundational principle:

> **Canonical transactional facts and MGBOS business integrity live in PostgreSQL through MGBOS-governed architecture.**

The following MUST NOT become competing systems of record:

```text
spreadsheet
frontend state
n8n state
AI memory
chat history
```

---

# 38. n8n Boundary

Canonical high-level position:

```text
n8n
=
ORCHESTRATION
```

It may coordinate:

```text
schedules
notifications
integrations
workflow routing
```

It does not become canonical owner of MGBOS business truth.

---

# 39. JARVIS Boundary

JARVIS is a separate intelligence system.

JARVIS may consume governed:

```text
reads
commands
events
evidence
```

from MGBOS.

JARVIS MUST NOT become a competing transactional system of record.

MGBOS must remain operational without JARVIS.

---

# 40. Engineering Agents Boundary

Engineering agents operate on software/repository changes.

They do not inherit MGBOS runtime business permission.

Example:

```text
ENGINEER
may edit payment implementation
```

does not imply:

```text
ENGINEER
may record a real customer payment
```

Repository authority and business authority remain separate.

---

# 41. Rules Before AI

Canonical direction:

> **Deterministic business rules remain deterministic.**

AI may:

```text
analyze
classify
recommend
draft
summarize
```

AI MUST NOT replace deterministic:

```text
financial constraints
authorization
state-transition rules
business invariants
```

---

# 42. Monetary Integrity

Money semantics are primarily owned by:

```text
canonical-data-model.md
business-invariants.md
```

Authoritative money calculations use integer Rupiah semantics according to those specifications.

Floating-point arithmetic MUST NOT become authoritative transactional money logic.

---

# 43. Cost Trilogy

Canonical distinction:

```text
ESTIMATED COST
COMMITTED COST
ACTUAL COST
```

These are different economic facts.

Do not collapse them into one generic cost value.

---

# 44. Estimated Cost

Represents expected cost before binding execution/commitment.

Common context:

```text
quotation
cost estimation
```

---

# 45. Committed Cost

Represents economic cost materially committed by the business.

Examples may include:

```text
vendor production assignment
purchase commitment
```

according to canonical transaction semantics.

---

# 46. Actual Cost

Represents reconciled observed economic cost after execution.

Do not populate Actual Cost by simply copying Estimated Cost to make reporting appear complete.

---

# 47. Shipping Pass-Through

Shipping revenue/cost handling must follow dedicated financial invariants.

Detailed formulas belong to their semantic owner.

Do not independently define them inside this navigation index.

---

# 48. Domain Purity

Domain code should preserve reusable deterministic business rules separately from presentation/provider details where practical.

However:

> **Domain purity exists to improve correctness and maintainability—not to create abstraction for abstraction's sake.**

---

# 49. Physical Reality Boundary

Database state represents governed business observations.

It does not automatically prove physical reality.

Examples requiring appropriate evidence may include:

```text
production completed
QC passed
goods received
shipment handed over
delivery completed
```

MGBOS stores the governed representation of those observed facts.

---

# 50. External Provider Boundary

External systems may own provider-side facts.

Examples:

```text
payment-provider transaction
courier tracking event
external marketplace event
```

MGBOS owns the normalized internal business interpretation where that fact enters MGBOS scope.

---

# 51. Current Capability Maturity Is Not Uniform

Different MGBOS capabilities may be:

```text
CURRENT
PARTIAL
NEXT
DEFERRED
EXPERIMENTAL
OUTSIDE_MGBOS
```

according to the Domain Map.

Do not infer maturity from:

```text
file exists
table exists
canonical spec exists
```

alone.

---

# 52. Current Core Operating Spine

Current near-term business operating spine centers on:

```text
LEAD
    ↓
REQUIREMENT
    ↓
QUOTE
    ↓
ORDER
    ├──────────────► INVOICE / PAYMENT
    │
    ▼
PRODUCTION
    ↓
ASSIGNMENT / VENDOR
    ↓
QC
    ↓
SHIPMENT
    ↓
COST / MARGIN
```

Detailed lifecycle semantics belong to dedicated specifications.

---

# 53. Operating-Spine Principle

Current architecture already contains much of the required core domain model.

Therefore near-term implementation should often prioritize:

```text
CONNECT
HARDEN
RECONCILE
SIMPLIFY
SURFACE
```

before introducing many new root entities.

---

# 54. Lead

Current Domain Map classifies Lead as materially present with workflow integration still needing hardening.

The intended progression may use:

```text
Lead
→ Requirement
→ Quote
```

without introducing Opportunity prematurely.

---

# 55. Opportunity

Opportunity remains deferred until recurring operations justify independent sales-pursuit semantics.

Do not resurrect it merely because historical design mentioned it.

---

# 56. Requirement

Requirement is a core business-specification boundary.

It helps move operational truth out of:

```text
WhatsApp
founder memory
temporary notes
```

into governed business context.

---

# 57. Quote

Quote is a current canonical capability involving concepts such as:

```text
versioning
line items
estimated cost
pricing approval
requirement snapshot
```

Detailed semantics belong to canonical data/invariant/state specifications.

---

# 58. Order

Order represents commercial commitment.

Order MUST NOT become a mega-state for:

```text
payment
production
QC
shipment
```

Those domains retain their own lifecycle semantics.

---

# 59. Production Job

Production Job owns physical-work coordination.

It should answer questions such as:

```text
what must be produced?
for which Order?
what is its state?
what is its deadline?
what blocks completion?
```

---

# 60. Production Assignment

Production Assignment is a current capability with operational integration still requiring hardening.

It represents:

```text
who is expected to execute
assignment context
partner acknowledgement
assignment lifecycle
```

Production Job remains owner of physical-work lifecycle.

---

# 61. Work Order / SPK

Current Domain Map classifies Work Order / SPK as a near-term governed operational artifact rather than automatically a new root entity.

Initial representation should reuse existing authoritative context where possible.

Do not promote it to a root entity until independent lifecycle/evidence needs justify that architecture.

---

# 62. Vendor

Vendor is a current MGBOS domain.

Broader generic:

```text
Partner
```

remains deferred until materially different partner types require a shared abstraction.

Do not generalize early.

---

# 63. Quality Control

QC inspection belongs to governed operational truth.

Useful evidence may include:

```text
result
defect classification
notes
photo/file reference
rework context
rejection reason
```

when operationally justified.

---

# 64. Invoice and Payment

Invoice and Payment remain separate authoritative financial concepts.

Payment Allocation must preserve its own financial-integrity rules.

Order state must not replace receivable/payment lifecycle semantics.

---

# 65. Financial Read Models

Founder-level financial visibility may require projections such as:

```text
cash summary
AR aging
AP obligations
margin exceptions
estimated-vs-actual variance
```

These are read models.

They do not automatically require new transaction aggregates.

---

# 66. Procurement

Procurement capabilities include current concepts such as:

```text
purchase order
purchase-order item
goods receipt
vendor bill
vendor-bill payment
```

Detailed implementation status belongs to current architecture/implementation evidence.

---

# 67. Goods Receipt

Goods Receipt represents observed physical receipt of purchased goods.

It is evidence-bearing operational truth.

It does not necessarily require a large independent mutable lifecycle.

---

# 68. Inventory

Inventory is a current MGBOS capability.

Canonical distinction:

```text
INVENTORY ITEM
≠
PRODUCT
```

A generic Product/Variant/SKU architecture should not be introduced solely because inventory exists.

---

# 69. Generic Product Architecture

Generic:

```text
Product
Variant
SKU
```

should be promoted only when actual business scope repeatedly requires shared catalog identity/lifecycle.

Custom-service operations may remain adequately represented through:

```text
Requirement
Quote
Order snapshots
Inventory Item
```

depending on the use case.

---

# 70. Business-Specific Data

Concepts such as:

```text
GSM
fabric composition
print placement
embroidery specification
size breakdown
decoration details
```

must not automatically become universal MGBOS columns.

Prefer bounded business/domain specification structures unless repeated cross-business semantics justify promotion.

---

# 71. Generic Abstraction Rule

Introduce shared abstraction only when it has:

```text
stable meaning
clear semantic ownership
repeated operational need
independent lifecycle or integrity requirement
real reuse value
```

Avoid architecture driven only by imagined future scale.

---

# 72. Architecture Expansion Rule

Preferred sequence:

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

# 73. Architecture Does Not Mean Entity

A new business capability can be solved through:

```text
read model
query
command
generated artifact
workflow
integration
automation
JARVIS capability
```

without adding another aggregate/table.

---

# 74. Historical Architecture Sources

Historical architecture discussions may remain under:

```text
catatan/
catatan/sesi/
```

They are useful for:

```text
rationale
design provenance
discarded alternatives
unpromoted detail
```

They are not the default authority once a concept has been promoted.

---

# 75. Historical Source Precedence

If historical material conflicts with any current dedicated specification:

```text
canonical-data-model.md
business-state-machines.md
business-invariants.md
command-event-model.md
permission-authorization-model.md
domain-map-capability-ownership.md
```

the dedicated ACTIVE canonical specification wins within its scope.

---

# 76. Implementation Evidence

Current implementation reality may be evidenced through:

```text
source code
database migrations
unit/domain tests
pgTAP
integration tests
E2E
CI
Engineering Reports
implementation audits
runtime observations
```

Evidence proves bounded observations.

Evidence does not silently rewrite architecture.

---

# 77. Architecture Drift

If implementation violates intended canonical architecture:

```text
IMPLEMENTATION_DRIFT
```

If active architecture documentation is stale or contradictory:

```text
DOCUMENTATION_DRIFT
```

Both require explicit reconciliation.

---

# 78. Example — Order State

Canonical state-machine specification may define valid Order lifecycle while implementation still lacks full authoritative transition enforcement.

Correct:

```text
CANONICAL SEMANTICS
complete enough to govern

IMPLEMENTATION
partial
```

Incorrect:

```text
transition command missing
→ canonical lifecycle irrelevant
```

---

# 79. Example — Transactional Outbox

Correct:

```text
TRANSACTIONAL OUTBOX
=
accepted architecture pattern
+
implementation maturity must be verified
```

Incorrect:

```text
ADR exists
=
production outbox fully active
```

---

# 80. Example — Domain Map

Correct current state:

```text
domain-map-capability-ownership.md
=
PRESENT
+
ACTIVE CANONICAL SPECIFICATION
+
PARTIALLY_IMPLEMENTED SUBJECT MATTER
```

Incorrect old state:

```text
prepared but not persisted
```

That statement is stale.

---

# 81. Example — Opportunity

Historical architecture may mention Opportunity.

Current canonical architecture keeps it deferred.

Therefore:

```text
HISTORICAL IDEA
≠
CURRENT ENTITY
```

---

# 82. Architecture Reading Order — General

For material MGBOS architecture work:

```text
1. Documentation Constitution

2. Canonical Source Map

3. Master System Blueprint

4. System Boundaries

5. Architectural Laws

6. this Architecture Index

7. relevant dedicated MGBOS specification

8. relevant ADR

9. current implementation

10. relevant tests / evidence
```

---

# 83. Architecture Reading Order — Data Change

For entity/data semantics:

```text
canonical-data-model.md
        ↓
business-invariants.md
        ↓
business-state-machines.md
if lifecycle changes
        ↓
permission-authorization-model.md
if access changes
        ↓
command-event-model.md
if mutation/integration changes
        ↓
domain-map-capability-ownership.md
if ownership/expansion changes
```

Then inspect physical schema/migrations.

---

# 84. Architecture Reading Order — Workflow Change

For consequential workflow:

```text
domain-map-capability-ownership.md
        ↓
canonical-data-model.md
        ↓
business-state-machines.md
        ↓
business-invariants.md
        ↓
command-event-model.md
        ↓
permission-authorization-model.md
```

Then inspect implementation and tests.

---

# 85. Architecture Reading Order — AI / Automation

For JARVIS, agent, or automation integration:

```text
system-boundaries.md
        ↓
domain-map-capability-ownership.md
        ↓
command-event-model.md
        ↓
permission-authorization-model.md
        ↓
business-invariants.md
        ↓
JARVIS / automation canonical docs
        ↓
implementation / runtime evidence
```

Never infer mutation authority from tool availability.

---

# 86. Architecture Reading Order — Financial Change

For payment, invoice, procurement, cost, or financial-integrity changes:

```text
canonical-data-model.md
business-invariants.md
business-state-machines.md
command-event-model.md
permission-authorization-model.md
domain-map-capability-ownership.md
```

plus applicable implementation/tests.

Financial work should preserve relevant:

```text
authorization
integer-money semantics
allocation integrity
idempotency
concurrency
historical integrity
reconciliation
```

---

# 87. Architecture Reading Order — Authorization Change

Use:

```text
permission-authorization-model.md
        ↓
command-event-model.md
        ↓
business-invariants.md
        ↓
domain model / state machine as affected
        ↓
actual server/database enforcement
        ↓
negative authorization tests
```

Frontend visibility alone is not security.

---

# 88. Document Ownership Map

| Question                                | Read                                  |
| --------------------------------------- | ------------------------------------- |
| What entities exist?                    | `canonical-data-model.md`             |
| What does this lifecycle state mean?    | `business-state-machines.md`          |
| What must never become invalid?         | `business-invariants.md`              |
| How may state change?                   | `command-event-model.md`              |
| Who may request the change?             | `permission-authorization-model.md`   |
| Should this capability belong to MGBOS? | `domain-map-capability-ownership.md`  |
| Why was a technical pattern selected?   | relevant ADR                          |
| Is it actually implemented?             | current source/schema/tests/evidence  |
| Is it currently deployed?               | deployment/runtime evidence           |
| What should the UI do?                  | product/implementation specifications |
| What should TeeStock commercially do?   | `bisnis/teestock/`                    |

---

# 89. Do Not Put Product UX Here

Detailed:

```text
screen design
form layout
navigation
pilot UX
document presentation
```

belongs under:

```text
systems/mgbos/docs/product/
```

or an appropriate implementation specification.

---

# 90. Do Not Put Business Strategy Here

Detailed:

```text
TeeStock positioning
pricing strategy
marketing
brand architecture
commercial roadmap
```

belongs under:

```text
bisnis/teestock/
```

or its proper business owner.

---

# 91. Do Not Put Engineering Reports Here

Implementation/audit evidence belongs under the applicable engineering/evidence structure.

For MGBOS, current material commonly lives under:

```text
systems/mgbos/docs/engineering/
```

Architecture remains normative.

---

# 92. Do Not Put Session Notes Here

Working discussion and historical session material belongs under:

```text
catatan/
```

until deliberately canonicalized.

---

# 93. Do Not Put Repository-Wide Engineering Governance Here

Repository-wide:

```text
engineering roles
AI engineering routing
engineering risk
engineering contracts
Vibe Engineering procedure
provider adapters
```

belong under:

```text
docs/engineering/
.agents/
docs/governance/
```

according to canonical ownership.

MGBOS Architecture MUST NOT become repository engineering governance.

---

# 94. Engineering Workflow Boundary

Architecture answers:

```text
WHAT SHOULD MGBOS MEAN?
```

Engineering governance answers:

```text
HOW MAY WE CHANGE IT SAFELY?
```

For material engineering work, follow repository-level engineering governance and then consume this architecture as target-system authority.

---

# 95. MGBOS Engineering Rules

System-specific engineering guidance may live under:

```text
systems/mgbos/AGENTS.md
systems/mgbos/docs/engineering/
```

These may impose stricter implementation requirements.

They MUST NOT redefine architecture semantics owned by dedicated architecture specifications.

---

# 96. Architecture Program State

Current architecture program state is best described as:

```text
CONTROLLED_CANONICALIZATION
+
IMPLEMENTATION HARDENING
```

Core architecture semantic owners are now persisted.

Current focus should increasingly move toward:

```text
implementation alignment
workflow closure
evidence
hardening
```

rather than continually inventing additional architecture documents.

---

# 97. Founder Control Canonical Architecture Reconciliation (W2)

Following the verification and closure of the Phase 1 Operating Spine, the W2 Founder Control Canonical Architecture Reconciliation (`VECP-003H`) was executed to reconcile the Owner-approved Founder Control Product Package (D1-D4) across all six canonical architecture specifications:

```text
canonical-data-model.md (v1.1)
business-state-machines.md (v1.1)
business-invariants.md (v1.1)
command-event-model.md (v1.1)
permission-authorization-model.md (v1.1)
domain-map-capability-ownership.md (v1.1)
```

Key reconciliation results:

1. **Operational Exception** is established as a first-class logical MGBOS architectural domain (`CANONICAL_TARGET`).
2. **Founder Attention** is established as a derived MGBOS projection layer (`CANONICAL_TARGET`).
3. **Founder Home** is established as a single governed presentation surface (`CANONICAL_TARGET`).
4. All 49 Founder Control invariants (`INV-099` through `INV-147`) are integrated without disturbing existing core invariants (`INV-001` through `INV-098`).
5. Logical commands (`mgbos.operational_exception.*`) and capabilities are defined at the application boundary.
6. Boundaries are reinforced: no event streaming infrastructure, no Kafka, no microservices, event runtime remains `NOT IMPLEMENTED`, and database persistence strategy remains undecided pending Engineering Discovery.
7. Phase 2 implementation is **NOT OPEN**. W3 Engineering Discovery is the mandatory next step.

---

# 98. Architecture Status & Implementation Horizon

With W2 architecture reconciliation complete, the canonical architecture foundation for Founder Control is fully bounded and reconciled.

```text
Product Package (D0-D4): APPROVED_BY_OWNER
Canonical Architecture (v1.1): RECONCILED (W2 COMPLETE)
Implementation Phase: NONE (Phase 1 closed, Phase 2 NOT OPEN)
Next Required Gate: W3 Engineering Discovery
```

No active database mutation, schema change, or code implementation may proceed until Engineering Discovery produces an approved Implementation Contract.

---

# 99. New Architecture Document Trigger

A new architecture specification should be created only when a real concept:

```text
has independent semantic ownership
is too important to remain a section elsewhere
has multiple downstream consumers
needs its own lifecycle/version
cannot cleanly extend an existing owner
```

Otherwise extend the existing canonical specification.

---

# 100. Avoid Architecture Symmetry

Do not create:

```text
new file
new aggregate
new subsystem
new service
```

because the architecture tree looks incomplete.

Architecture exists to resolve real semantic complexity.

Not to make directories look symmetrical.

---

# 101. Current Known Architecture Gaps

Dedicated specifications and implementation evidence identify areas that may still require implementation hardening, including examples such as:

```text
authoritative transition enforcement in some lifecycles
workflow integration between existing domains
production assignment/vendor flow hardening
full business-event runtime maturity
transactional-outbox runtime maturity
service-principal implementation
capability-registry implementation
coarser current permission/read boundaries
```

Treat these as implementation/architecture maturity gaps.

Do not infer that every item requires a new architecture document.

---

# 102. Gap Resolution Rule

For each gap ask:

```text
Is canonical meaning already clear?
```

If yes:

```text
IMPLEMENT / HARDEN
```

If no:

```text
ARCHITECTURE WORK
```

This distinction prevents endless documentation before implementation.

---

# 103. Current Operating-Spine Priority

Near-term work should prioritize a trustworthy operational spine over broad ERP expansion.

Conceptually:

```text
LEAD
→ REQUIREMENT
→ QUOTE
→ ORDER
→ FINANCE
→ PRODUCTION
→ QC
→ FULFILLMENT
→ COST / MARGIN
```

while preserving independent domain lifecycles.

---

# 104. Architecture and Solo-Founder Constraint

MGBOS architecture must account for the actual founder operating model.

The system should reduce:

```text
memory dependence
manual coordination
hidden operational state
repetitive founder intervention
```

without creating unnecessary enterprise complexity.

---

# 105. Founder Is Not Hidden Middleware

Architecture should progressively eliminate workflows where:

```text
system A
→ founder memory
→ WhatsApp
→ spreadsheet
→ system B
```

is the only integration mechanism for important operational truth.

But replacement should remain bounded and evidence-driven.

---

# 106. System Must Remain Operable

The architecture should favor systems that a resource-constrained founder can:

```text
understand
operate
recover
audit
extend
```

over technically impressive but operationally fragile complexity.

---

# 107. Implementation Must Not Outrun Semantics

Implementation may not invent:

```text
new financial meaning
new lifecycle transition
new permission semantics
new capability ownership
```

merely because the current code path needs a quick solution.

Return to the appropriate canonical specification when semantics are unclear.

---

# 108. Architecture Must Not Outrun Evidence

Architecture should not introduce complex future abstractions without:

```text
repeated operational need
clear semantic distinction
real downstream consumer
```

Design for growth.

Do not prebuild the entire imagined future company.

---

# 109. Architecture Does Not Prove Runtime

Even when this entire architecture set is:

```text
ACTIVE
```

individual runtime capabilities may remain:

```text
partial
not implemented
not integrated
not verified
```

Use implementation evidence.

---

# 110. Implementation Does Not Rewrite Architecture Automatically

If current code differs from architecture:

do not declare current code canonical merely because it exists.

Determine whether:

```text
architecture should change
```

or:

```text
implementation should change
```

through governed reconciliation.

---

# 111. Verification Principle

For consequential changes, architecture review should eventually connect to evidence such as:

```text
unit/domain tests
database tests
integration tests
negative authorization tests
migration tests
E2E
CI
runtime evidence
```

according to risk.

Documentation correctness alone is not behavioral verification.

---

# 112. Architecture Index Maintenance

Update this README when:

```text
a canonical architecture source is added
a canonical architecture source is superseded
semantic ownership changes
a listed file moves
reading order changes materially
architecture program state changes materially
```

Do not update it for every source-code change.

---

# 113. Reverse-Reference Requirement

Before materially renaming/removing a canonical architecture source:

inspect:

```text
Source Map references
MGBOS docs index
product docs
implementation docs
engineering docs
AGENTS files
Skills
tests/validators
historical references where operationally relevant
```

Do not create broken authority routing.

---

# 114. Architecture Source Removal

A canonical source should not simply disappear.

Use Documentation Constitution lifecycle where applicable:

```text
DEPRECATED
SUPERSEDED
ARCHIVED
```

and maintain replacement routing.

---

# 115. Architecture Versioning

Version changes should reflect meaningful document evolution.

Do not increment architecture version merely because repository snapshot changed.

Current index v2.1 exists because its authority routing/current-state claims materially changed from v2.0.

---

# 116. Repository Snapshot

This index was reviewed against:

```text
26871da802706fba5bc033576fbb0a487f6c9255
```

on:

```text
2026-10-03
```

The snapshot supports current-state statements in this version.

When repository state advances, current implementation claims must be rechecked as needed.

Canonical semantic ownership does not automatically expire because main advances.

---

# 117. Snapshot Is Not Permanent Current Truth

Do not use this snapshot as proof that:

```text
current main
current CI
current implementation
current migration state
```

remain unchanged in a later session.

Always inspect current evidence when the claim is time-sensitive.

---

# 118. Architecture Index Success Definition

This index succeeds when a competent human or AI can answer:

```text
What document owns this concept?

Is it architecture or implementation?

Is the concept CURRENT, PARTIAL, NEXT,
DEFERRED, EXPERIMENTAL, or OUTSIDE_MGBOS?

Where do I verify actual implementation?

Where do I find the rationale?

Am I introducing a competing semantic owner?

Do I really need a new architecture document?
```

without reading every MGBOS document.

---

# 119. Architecture Invariants

Preserve:

```text
ARCH-INDEX-001
Architecture Index routes authority; it does not duplicate dedicated specifications.

ARCH-INDEX-002
Dedicated canonical specifications own semantics.

ARCH-INDEX-003
Implementation evidence does not silently redefine architecture.

ARCH-INDEX-004
Architecture specification does not prove implementation.

ARCH-INDEX-005
MGBOS remains the owner of governed operational truth within its scope.

ARCH-INDEX-006
JARVIS does not become MGBOS system of record.

ARCH-INDEX-007
n8n remains orchestration, not business truth.

ARCH-INDEX-008
Provider facts and internal business interpretation remain distinct.

ARCH-INDEX-009
Business authorization remains distinct from technical privilege.

ARCH-INDEX-010
Business validation remains distinct from authorization.

ARCH-INDEX-011
Independent domain lifecycles must not collapse into Order mega-state.

ARCH-INDEX-012
Deterministic business rules remain deterministic.

ARCH-INDEX-013
Generic abstractions require real operational evidence.

ARCH-INDEX-014
Business requirements do not automatically become entities.

ARCH-INDEX-015
Domain Map is present and ACTIVE.

ARCH-INDEX-016
No predetermined next architecture document exists solely for symmetry.

ARCH-INDEX-017
Architecture growth follows operational need.

ARCH-INDEX-018
Architecture remains operable by the actual organization.
```

---

# 120. Final Principle

> **MGBOS architecture should be precise enough to protect business integrity and small enough to remain operable by a resource-constrained founder.**

And:

> **This README tells you where MGBOS architecture truth lives. Dedicated specifications define that truth. Implementation and evidence tell you how much of that truth currently exists in the running system.**

And finally:

> **Now that the six core architecture specifications are persisted, the default next move is not “write another architecture document.” The default next move is to close real implementation gaps—unless evidence reveals a genuinely new semantic ownership problem.**
