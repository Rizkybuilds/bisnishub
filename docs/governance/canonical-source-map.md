---
canonical_id: docs.governance.canonical-source-map
status: ACTIVE
version: 1.1
owner: Rizky
author: OpenAI / ChatGPT
approver: Rizky
scope: repository
document_class: registry
effective_from: 2026-09-30
authoritative_for:
  - canonical source routing
  - semantic ownership routing
  - documentation authority lookup
  - transitional documentation tracking
  - business-versus-system semantic boundaries
  - canonicalization backlog
last_reviewed: 2026-09-30
review_cadence: monthly
depends_on:
  - documentation-constitution.md
  - ../project-index.md
  - ../engineering/repository-layout.md
  - ../decisions/001-repository-organization.md
supersedes:
  - docs.governance.canonical-source-map@1.0
repository_snapshot: 9aa8a698b9b9daab6103a9e4139cd08adbb09fb4
---

# DOC-002 — BisnisHub Canonical Source Map v1.1

## 1. Purpose

Canonical Source Map adalah registry authority untuk seluruh BisnisHub.

Ia menjawab:

> **Jika manusia atau AI membutuhkan kebenaran tentang suatu konsep, dokumen mana yang harus dibaca dan siapa semantic owner-nya?**

Source Map tidak menggantikan specification.

Ia mengarahkan ke specification yang benar.

```text
QUESTION
   ↓
CANONICAL SOURCE MAP
   ↓
SEMANTIC OWNER
   ↓
AUTHORITATIVE SOURCE
   ↓
IMPLEMENTATION / EVIDENCE
when current reality matters
```

---

# 2. Constitutional Rule

Dokumen ini tunduk pada:

```text
docs.governance.documentation-constitution
```

Canonical law:

> **One normative concept, one canonical semantic owner per scope.**

Dua dokumen boleh sama-sama berstatus canonical bila scope-nya berbeda.

Mereka tidak boleh diam-diam mendefinisikan semantic truth yang sama secara berbeda.

---

# 3. Source Status Vocabulary

Canonical classifications:

```text
CANONICAL
TRANSITIONAL_AUTHORITY
OPERATIONAL_REGISTRY
EVIDENCE
PLANNED_CANONICAL
DESIGN_INPUT
HISTORICAL
LEGACY
ARCHIVED
```

### CANONICAL

Current authoritative source dalam semantic scope yang dinyatakan.

### TRANSITIONAL_AUTHORITY

Sumber lama yang masih sementara diperlukan oleh dokumen aktif.

### OPERATIONAL_REGISTRY

Current state/inventory registry, bukan architecture law.

### EVIDENCE

Membuktikan implementasi, test, deployment, execution, atau outcome.

### PLANNED_CANONICAL

Owner sudah jelas tetapi canonical source belum tersedia.

### DESIGN_INPUT

Research, discussion, architecture exploration.

Tidak authoritative.

### HISTORICAL

Dipertahankan untuk provenance.

### LEGACY

Masih mungkin memiliki consumer tetapi berasal dari architecture lama.

### ARCHIVED

Retired reference.

Tidak mengatur operasi saat ini.

---

# 4. Repository Reality

As of repository snapshot:

```text
9aa8a698b9b9daab6103a9e4139cd08adbb09fb4
```

canonical physical structure:

```text
bisnishub/
│
├── docs/
│   ├── governance/
│   ├── architecture/
│   ├── decisions/
│   └── engineering/
│
├── systems/
│   ├── mgbos/
│   ├── jarvis/
│   └── kaskita/
│
├── bisnis/
│   ├── teestock/
│   ├── multigraph/
│   ├── rizkybuild/
│   └── ...
│
├── .agents/
│   └── engineering control plane
│
├── tools/
├── catatan/
└── archive/
```

Physical locations are owned by:

```text
docs/project-index.md
```

---

# 5. Repository-Level Authority

| Concept | Semantic Owner | Canonical Source |
|---|---|---|
| Documentation governance | Repository Governance | `docs/governance/documentation-constitution.md` |
| Canonical routing | Repository Governance | `docs/governance/canonical-source-map.md` |
| Active project locations | Repository Governance | `docs/project-index.md` |
| Directory ownership | Repository Engineering | `docs/engineering/repository-layout.md` |
| Repository organization | Repository Governance | `docs/decisions/001-repository-organization.md` |
| Ecosystem topology | Cross-System Architecture | `docs/architecture/master-system-blueprint.md` |
| System boundaries | Cross-System Architecture | `docs/architecture/system-boundaries.md` |
| Architectural laws | Cross-System Architecture | `docs/architecture/architectural-laws.md` |
| Cross-system risk | Cross-System Governance | `docs/governance/cross-system-risk-classification.md` |
| Autonomy semantics | Cross-System Governance | `docs/governance/autonomy-levels.md` |
| Approval semantics | Cross-System Governance | `docs/governance/approval-policy.md` |
| Evidence/provenance | Cross-System Governance | `docs/governance/evidence-provenance-model.md` |

---

# 6. The Four Authority Domains

Current ecosystem must preserve:

```text
BUSINESS KNOWLEDGE
        │
        ▼
   bisnis/<business>/

SYSTEM SEMANTICS
        │
        ▼
 systems/<system>/

CROSS-SYSTEM GOVERNANCE
        │
        ▼
       docs/

ENGINEERING CONTROL
        │
        ▼
      .agents/
```

These are different authority domains.

---

# 7. Business Knowledge vs System Truth

Canonical distinction:

```text
bisnis/
=
what the business means,
wants,
offers,
measures,
and operationally requires

systems/
=
how governed software represents
and executes those requirements
```

Therefore:

> **Business documentation may create requirements for a system. It does not silently rewrite the system's canonical contracts.**

---

# 8. MGBOS Semantic Ownership

MGBOS is canonical owner of governed business-system semantics for:

```text
business transactional entities

business state

business invariants

commercial lifecycle

financial lifecycle

production lifecycle

inventory semantics

procurement semantics

fulfillment semantics

business commands

internal business-event contracts

transactional integrity

money semantics
```

Current location:

```text
systems/mgbos/
```

---

# 9. MGBOS Canonical Architecture

Current canonical specifications:

```text
systems/mgbos/docs/architecture/
```

| Concept | Canonical Source |
|---|---|
| Architecture overview | `README.md` |
| Business entities / persistent semantics | `canonical-data-model.md` |
| State transitions | `business-state-machines.md` |
| Business integrity | `business-invariants.md` |
| Commands & business events | `command-event-model.md` |
| Permission & authorization | `permission-authorization-model.md` |

Classification:

```text
CANONICAL
```

---

# 10. Sep-23 MGBOS Notes

The following are no longer transitional semantic owners:

```text
catatan/sesi/2026-09-23 - MGBOS 0.2 — Canonical Data Model v0.1.md

catatan/sesi/2026-09-23 - MGBOS 0.2.1 Logical Data Model.md

catatan/sesi/2026-09-23 - MGBOS 0.3 — Business State Machines.md
```

They are now:

```text
HISTORICAL / DESIGN PROVENANCE
```

because their normative core has been promoted into dedicated canonical specifications.

If an ACTIVE README still links to them as detailed architecture, that reference is documentation debt and should be corrected.

---

# 11. MGBOS Implementation Reality

Implementation truth is established through:

```text
schema / migrations

domain implementation

tests

CI

engineering reports
```

Important evidence:

```text
systems/mgbos/docs/engineering/mgbos-*-report.md
```

Classification:

```text
EVIDENCE
```

Evidence proves implementation.

It does not redefine intended semantics automatically.

---

# 12. MGBOS Current Important Gap

Canonical semantics exist for the current implemented core.

They do NOT imply every future TeeStock/MultiGraph domain has already been modeled.

Examples of business requirements that may still require future MGBOS expansion:

```text
Opportunity

Project

generic Product / Variant / SKU

Catalog

Channel commerce

Creator

Creator Agreement

Royalty

Earning

Payout

IP Rights

Campaign

Customer Case

generic Operational Exception

advanced Partner Capability / Capacity
```

These are:

```text
DOMAIN EXPANSION REQUIREMENTS
```

until deliberately promoted into MGBOS architecture.

---

# 13. JARVIS Semantic Ownership

JARVIS owns:

```text
intent interpretation

context construction

planning

reasoning orchestration

Agent runtime

Skill runtime

Tool selection

policy coordination

execution coordination

verification

evidence synthesis

runtime memory

model routing

proactive intelligence

feedback learning

AI evaluation

runtime recovery

decision support
```

JARVIS does NOT own business transaction truth.

---

# 14. JARVIS Physical Canonical Location

Contrary to DOC-002 v1.0, JARVIS now has a real canonical documentation tree:

```text
systems/jarvis/docs/
```

Current runtime remains:

```text
NOT IMPLEMENTED / NOT VERIFIED
```

unless explicit implementation evidence states otherwise.

---

# 15. JARVIS Primary Canonical Sources

```text
systems/jarvis/docs/charter.md
systems/jarvis/docs/architecture.md
systems/jarvis/docs/core-runtime.md
```

Classification:

```text
CANONICAL SPECIFICATION
```

---

# 16. JARVIS Canonical Architecture Inventory

Current persisted sources include:

```text
agent-registry.md

skill-registry.md

tool-capability.md

memory.md

model-gateway-routing.md

entity-identity-resolution.md

event-proactive-intelligence.md

execution-verification-recovery.md

observability-audit-incident.md

security-secrets-environment.md

data-privacy-retention.md

backup-disaster-recovery-business-continuity.md

ai-evaluation-regression-autonomy-promotion.md

cost-resource-finops.md

lifecycle-versioning-deprecation.md

feedback-learning-continuous-improvement.md

human-accountability-ownership-operating-model.md
```

Classification:

```text
CANONICAL SPECIFICATION
```

unless metadata explicitly states otherwise.

Implementation status remains independently tracked.

---

# 17. Sep-27 JARVIS Notes

Historical sources such as:

```text
JARVIS Architecture v0.1

JARVIS v0.2 Core Runtime Specification

Governance & Operations Blueprint

Model AI session

Infrastructure session

JARVIS architecture discussions
```

are now:

```text
HISTORICAL DESIGN INPUT
```

for concepts already promoted.

They remain useful for:

```text
rationale

provenance

unpromoted ideas

historical decisions
```

but do not override current JARVIS v1 specifications.

---

# 18. Time-Sensitive Model Research

Specific model/provider recommendations in Sep-27 notes are:

```text
TIME-SENSITIVE HISTORICAL RESEARCH
```

Canonical JARVIS truth is:

```text
logical model profiles

provider-neutral Model Gateway

Model Registry

current eval results
```

not historical model names.

---

# 19. Runtime Business Agents

Runtime Agents belong to:

```text
JARVIS
```

not:

```text
.agents/
```

`systems/jarvis/docs/architecture/agent-registry.md`

owns runtime Agent semantics.

---

# 20. Runtime Skills

JARVIS business/runtime Skills belong to:

```text
JARVIS Skill Runtime
```

Current engineering Skills under:

```text
.agents/skills/
```

remain software-development instructions.

They are different systems.

---

# 21. Engineering Control Plane

Canonical engineering control plane:

```text
systems/mgbos/docs/engineering/agent-system/
+
.agents/
```

Scope:

```text
software development
review
testing
release
repository maintenance
```

It does not create business execution authority.

---

# 22. TeeStock Business Authority

Canonical TeeStock business knowledge lives under:

```text
bisnis/teestock/
```

TeeStock may canonically own:

```text
business definition

strategy

brand

customer propositions

commerce model

service model

Originals

Programs

business operating requirements

business finance policy

pricing strategy

legal/IP requirements

marketing

KPI definitions

experimentation

business roadmap

TeeStock-specific business vocabulary
```

---

# 23. TeeStock Master Business Sources

Highest-level business sources include:

```text
bisnis/teestock/README.md

00-foundation/teestock-master-definition.md

00-foundation/documentation-governance.md

00-foundation/decision-register.md

01-strategy/business-thesis.md

01-strategy/business-model.md

01-strategy/ecosystem-architecture.md

07-operations/operating-model.md

08-finance/financial-model.md

14-roadmap/master-roadmap.md

14-roadmap/current-quarter.md
```

They are:

```text
CANONICAL WITHIN TEESTOCK BUSINESS SCOPE
```

---

# 24. TeeStock Canonical Does Not Mean Global Canonical

A TeeStock document labeled:

```text
CANONICAL
```

means:

> authoritative within its declared TeeStock business scope.

It does NOT automatically make it authoritative for:

```text
MGBOS shared architecture

JARVIS runtime architecture

other businesses

repository governance.
```

---

# 25. TeeStock Data Model Scope

Current:

```text
bisnis/teestock/11-data-mgbos/canonical-data-model.md
```

is classified as:

```text
CANONICAL TEESTOCK BUSINESS DOMAIN MODEL
/
BUSINESS REQUIREMENTS MODEL
```

It is authoritative for:

```text
TeeStock conceptual business objects

desired TeeStock relationships

future business capability requirements
```

It is NOT authoritative for:

```text
MGBOS physical schema

MGBOS shared entity implementation

MGBOS state machines

database constraints

cross-business transactional semantics
```

Those remain MGBOS-owned.

---

# 26. Why This Distinction Matters

TeeStock's domain model contains important future concepts such as:

```text
Person

Opportunity

Project

Product

Variant

SKU

Artwork

BOM

Recipe

Program

Creator

Agreement

Royalty

Earning

Payout

Partner Capacity

Campaign

Customer Case
```

Some do not yet exist in MGBOS.

Correct relationship:

```text
TEESTOCK BUSINESS NEED
        ↓
DOMAIN REQUIREMENT
        ↓
MGBOS ARCHITECTURE DECISION
        ↓
MGBOS CANONICAL MODEL
        ↓
IMPLEMENTATION
```

Not:

```text
TEESTOCK DOC
        ↓
automatically becomes MGBOS schema
```

---

# 27. TeeStock Entity Hierarchy

`entity-hierarchy.md` is authoritative for:

```text
TeeStock conceptual hierarchy

business relationship requirements

business-specific ownership expectations
```

Shared identity architecture remains governed by:

```text
MGBOS
+
JARVIS entity identity architecture
```

within their respective scopes.

---

# 28. TeeStock State Semantics

TeeStock documentation may describe:

```text
business journey

desired process stage

pilot workflow milestone
```

but shared transactional entities already governed by MGBOS MUST use MGBOS canonical state semantics.

---

# 29. Known State-Machine Conflict

Current TeeStock Q4 documents contain simplified state sets such as:

```text
Lead:
NEW
QUALIFIED
NOT_QUALIFIED
CONVERTED
CLOSED
```

while MGBOS canonical Lead state machine defines richer semantics.

Likewise TeeStock roadmap currently describes simplified:

```text
Order

Production Job

Payment
```

state sets that are not identical to MGBOS canonical state machines.

Classification:

```text
AUTHORITY_CONFLICT / DOCUMENTATION DRIFT
```

Resolution rule:

> **MGBOS state-machine specification wins for MGBOS-owned transactional entities.**

TeeStock documents should eventually:

```text
reference MGBOS canonical states
```

or explicitly label simplified states as:

```text
business milestone / roadmap shorthand
```

rather than competing canonical states.

---

# 30. TeeStock Event Model Scope

Current:

```text
bisnis/teestock/11-data-mgbos/event-model.md
```

is authoritative for:

```text
TeeStock business-event requirements

desired business facts

domain event vocabulary candidates
```

Actual MGBOS business event contracts are owned by:

```text
systems/mgbos/docs/architecture/command-event-model.md
```

and future versioned event contracts.

---

# 31. TeeStock MGBOS Integration Scope

Current:

```text
bisnis/teestock/11-data-mgbos/mgbos-integration.md
```

is authoritative for:

```text
TeeStock integration requirements

desired system relationships

TeeStock source-of-truth expectations

business integration use cases
```

It does NOT replace:

```text
MGBOS architecture

JARVIS Tool/Integration architecture

root cross-system architecture.
```

---

# 32. TeeStock Finance Authority

TeeStock finance documents own TeeStock business policy such as:

```text
unit economics

pricing philosophy

commercial guardrails

treasury policy

cost interpretation

business KPI definitions
```

MGBOS owns:

```text
transactional representation

money integrity

financial state

payment commands

ledger semantics implemented by MGBOS.
```

---

# 33. Business Policy → System Enforcement

Correct flow:

```text
TEESTOCK FINANCE POLICY
          ↓
MGBOS BUSINESS RULE / CONFIG
          ↓
SERVER-SIDE ENFORCEMENT
          ↓
AUDIT / EVIDENCE
```

A business markdown file is not runtime enforcement.

---

# 34. TeeStock Legal/IP Authority

Documents under:

```text
bisnis/teestock/12-legal-ip/
```

are canonical internal TeeStock governance frameworks for:

```text
IP provenance

rights clearance

creator agreements

licensing

trademark handling

commerce policy
```

They remain subject to applicable law and appropriate legal review.

They are not themselves executed legal agreements.

---

# 35. TeeStock IP Requirement Principle

Strong business rule established:

> **No documented rights basis. No commercial use.**

Future system representation should support this rule if TeeStock begins governed IP-driven commerce at scale.

---

# 36. TeeStock Metrics Authority

Documents under:

```text
13-metrics-experiments/
```

own TeeStock definitions for:

```text
KPIs

North Star metrics

experiment design

decision thresholds
```

Important North Star currently defined as:

```text
Sustainable Contribution from Fulfilled Customer Demand
```

Implementation/analytics must eventually trace calculations to authoritative transactional data.

---

# 37. TeeStock Roadmap Authority

Current roadmap:

```text
bisnis/teestock/14-roadmap/master-roadmap.md
```

owns TeeStock capability sequencing.

Current-quarter execution authority:

```text
bisnis/teestock/14-roadmap/current-quarter.md
```

within its active period.

---

# 38. TeeStock Current Q4 Priority

Current canonical Q4 direction:

```text
P0 — OPERATING SPINE

P1 — VISIBILITY & CONTROL

P2 — REPEATABLE AUTOMATION

P3 — GROWTH EXPERIMENTS
```

Primary objective:

> **Validate a repeatable Lead-to-Cash and Order-to-Fulfillment operating spine.**

---

# 39. Q4 JARVIS Constraint

TeeStock Q4 currently states:

```text
NO FULL JARVIS BUILD YET
```

and permits preparatory work such as:

```text
canonical IDs

read models

permissions

entity APIs

event history
```

Interpretation:

> This is TeeStock implementation priority, not a rejection of JARVIS architecture.

Therefore:

```text
JARVIS canonicalization
→ valid

full JARVIS implementation ahead of TeeStock operating spine
→ not current TeeStock priority
```

unless superseded by an explicit owner decision.

---

# 40. TeeStock as MGBOS Proving Ground

Canonical TeeStock strategic relationship:

```text
TeeStock
=
real-world proving ground
for MGBOS
```

Therefore business execution should pull MGBOS capability development.

---

# 41. Product Before Infrastructure

TeeStock establishes a critical strategic rule:

> **Do not software-engineer what has not yet proven useful manually.**

This is compatible with:

```text
Business Pulls Architecture
```

from JARVIS/MGBOS governance.

---

# 42. Automation Authority

TeeStock automation documents may define:

```text
business automation requirements

candidate workflows

operational sequencing
```

but:

```text
n8n
automation workflow
scheduler
```

do not own business truth.

---

# 43. TeeStock Archive

Everything under:

```text
bisnis/teestock/archive/
```

is:

```text
ARCHIVED / HISTORICAL
```

unless explicitly promoted into an active canonical document.

Archived material may contain useful:

```text
pricing assumptions

UX research

provider options

launch ideas

operational observations
```

but does not govern current business.

---

# 44. Legacy TeeStock Runtime

Historical runtime belongs under:

```text
archive/teestock-v1/
```

Its implementation claims do not certify current TeeStock/MGBOS runtime.

Statements such as:

```text
launch ready

92 tests passing

24 routes complete
```

are historical evidence only.

---

# 45. Old Pricing and Provider Choices

Archived figures such as:

```text
specific garment prices

specific DTF prices

specific reseller margins

specific Midtrans/Biteship configuration
```

are not canonical current truth unless promoted and revalidated.

---

# 46. Root BisnisHub Command Center Note

Current:

```text
🏠 BisnisHub Command Center.md
```

contains stale path/status information from an earlier repository state.

Classification:

```text
HISTORICAL / OBSIDIAN NAVIGATION DEBT
```

It MUST NOT override:

```text
docs/project-index.md
```

or current canonical business/system sources.

---

# 47. Other Business Knowledge

Folders such as:

```text
bisnis/multigraph/
bisnis/rizkybuild/
bisnis/kaskita/
bisnis/titik-buta/
```

own their own business knowledge.

Same-repository presence does not automatically create:

```text
same legal organization

same authority

same database

same business unit.
```

---

# 48. External Systems

External providers may be authoritative for facts directly occurring inside their system.

Examples:

```text
GitHub
→ CI run result

Courier
→ external tracking event

Payment provider
→ provider transaction state

Marketplace
→ marketplace-side order/listing state
```

Internal business interpretation still belongs to the relevant BisnisHub authoritative system.

---

# 49. n8n

Canonical MGBOS decision:

```text
n8n = orchestrator
```

not:

```text
system of record
business-rule owner
JARVIS brain
```

---

# 50. `.agents/`

`.agents/` governs:

```text
software engineering workforce
```

not runtime business workforce.

A skill named:

```text
cfo
coo
content-strategist
```

does not become a JARVIS business Agent merely because the file exists.

---

# 51. `catatan/`

Default:

```text
HISTORICAL
DESIGN_INPUT
RESEARCH
ORGANIZATIONAL MEMORY
```

Current canonical documents should increasingly reference other canonical documents instead of relying normatively on old session notes.

---

# 52. Conversation Drafts

A document drafted inside a ChatGPT conversation does NOT become repository authority merely because it is labeled `ACTIVE-ready`.

It becomes repository canonical only after:

```text
approved content
        ↓
persisted to canonical location
        ↓
Source Map updated where required
```

---

# 53. Current Unpersisted Canonical-Ready Drafts

At the time of this review, recent conversation work includes drafts for:

```text
JARVIS Command Center & Decision Experience Architecture

JARVIS Integration, API & Interoperability Architecture

JARVIS Canonical Architecture Index & Implementation Readiness Map
```

These are currently:

```text
CANONICAL-READY DRAFTS
/
NOT REPOSITORY AUTHORITY
```

until persisted.

---

# 54. Architecture Freeze Correction

The current architecture program is NOT in:

```text
STOP ALL DOCUMENTATION
```

mode.

Correct state:

```text
CONTROLLED CANONICALIZATION
```

Meaning:

```text
do not invent speculative subsystems

do close known authority gaps

do resolve conflicting canonical sources

do promote historical design where still necessary

then implement
```

---

# 55. Current Documentation Drift

Known drift includes:

### Drift A — Source Map JARVIS state

DOC-002 v1.0 stated JARVIS canonical system documentation did not exist.

That is now corrected by v1.1.

### Drift B — MGBOS README historical links

Some MGBOS navigation still points toward Sep-23 session notes even though dedicated canonical specifications now exist.

### Drift C — TeeStock shared-state duplication

Several TeeStock docs independently define simplified:

```text
Lead

Order

Payment

Production
```

states already governed by MGBOS.

### Drift D — Root Command Center

Root Obsidian Command Center still references retired/relocated runtime paths.

---

# 56. Current Semantic Conflict Priority

Highest-priority reconciliation:

```text
TEESTOCK BUSINESS REQUIREMENTS
            ↕
MGBOS SHARED BUSINESS SEMANTICS
```

The goal is NOT to discard TeeStock documentation.

The goal is:

> **Preserve TeeStock's rich business model while preventing it from becoming a second ERP specification.**

---

# 57. TeeStock Requirement Promotion Pattern

When TeeStock needs an entity/capability MGBOS does not yet support:

```text
TeeStock canonical business requirement
             ↓
gap identified
             ↓
MGBOS domain analysis
             ↓
architecture decision
             ↓
MGBOS canonical spec updated
             ↓
vertical implementation
             ↓
verified business use
```

---

# 58. No Automatic Generalization

A TeeStock-specific concept does not automatically become a group-wide MGBOS abstraction.

Example:

```text
Creator Royalty
```

should become shared MGBOS capability only if architectural analysis shows the abstraction belongs there.

---

# 59. No Premature Generic ERP

MGBOS should grow from demonstrated business requirements.

TeeStock's rich blueprint is therefore:

```text
REQUIREMENT RESERVOIR
```

not:

```text
MANDATE TO IMPLEMENT EVERY ENTITY NOW
```

---

# 60. Current Canonicalization Backlog

After this Source Map correction, highest-value remaining gaps are:

```text
P0
MGBOS Domain Map / capability ownership reconciliation

P0
Cross-System Data Classification & Information Handling

P0
Cross-System Time & Scheduling Semantics

P1
Cross-System Notification Governance

P1
Knowledge Lifecycle & Retrieval Governance

P1
Business Exception / Case ownership reconciliation

P1
API / schema / contract versioning standards

P2
Runbook consolidation

P2
Roadmap / maturity cross-system index

P2
Templates and standards
```

---

# 61. MGBOS Domain Map Priority

This becomes especially important after TeeStock audit because TeeStock now contains requirements across:

```text
Commerce

Services

Creator

IP

Marketing

Projects

Partner Network

Production

Finance

Fulfillment
```

while current MGBOS canonical implementation covers only a subset.

We need an explicit map of:

```text
CURRENT MGBOS DOMAIN

TARGET CANDIDATE DOMAIN

TEEStock REQUIREMENT

DEFERRED REQUIREMENT

OUTSIDE MGBOS
```

before expanding the data model.

---

# 62. Cross-System Data Classification Priority

JARVIS already needs provider eligibility.

TeeStock contains:

```text
customer data

financial data

creator agreements

IP evidence

payment information

business strategy
```

Therefore data classes should be cross-system governance rather than JARVIS-only convention.

---

# 63. Time Semantics Priority

TeeStock and JARVIS both depend heavily on:

```text
deadline

lead time

quote validity

license expiry

payment due date

SLA

schedule

business day

quiet hours

timezone
```

These need one shared semantic owner.

---

# 64. Notification Governance Priority

Notifications span:

```text
MGBOS

JARVIS

n8n

email

WhatsApp

customer communication

founder alerts
```

Therefore notification meaning cannot remain merely an implementation detail of JARVIS.

---

# 65. Current Implementation Priority

Documentation priority and software priority are separate.

Current TeeStock business roadmap still prioritizes:

```text
Lead-to-Cash

Order-to-Fulfillment

MGBOS operational visibility

selected repeatable automation
```

before full JARVIS runtime expansion.

---

# 66. Minimum Reading Rule

Humans and AI SHOULD load only relevant authority.

Example:

```text
Task:
Change TeeStock order state behavior

Read:

DOC-001
DOC-002
TeeStock business requirement
MGBOS canonical state machine
MGBOS invariant
relevant command spec
current implementation/tests
```

Do not read 70 TeeStock documents for every code change.

---

# 67. Authority Conflict Rule

If two active sources appear to own the same semantic concept:

```text
AUTHORITY_CONFLICT
```

must be raised.

Do not pick based on:

```text
newer date

longer file

more detail

AI preference

folder depth.
```

---

# 68. Promotion Procedure

```text
Historical / business requirement
        ↓
identify semantic owner
        ↓
compare with current canonical truth
        ↓
resolve conflict
        ↓
promote or revise canonical owner
        ↓
update references
        ↓
retain historical provenance
```

---

# 69. Current Canonical Mental Model

```text
                     BISNISHUB
                         │
               CROSS-SYSTEM GOVERNANCE
                         │
          ┌──────────────┼───────────────┐
          │              │               │
          ▼              ▼               ▼
      BUSINESS         MGBOS           JARVIS
      KNOWLEDGE     Business Truth   Intelligence
          │              │               │
     TeeStock            │          Agents / Skills
     MultiGraph          │          Tools / Memory
     RizkyBuild          │          Models / Events
          │              │               │
          └──────────────┼───────────────┘
                         ▼
                  BUSINESS REALITY
```

Engineering remains parallel:

```text
.agents/
   ↓
Software Development
   ↓
Systems
```

---

# 70. TeeStock–MGBOS–JARVIS Mental Model

```text
TEEStock
"What business do we need to run?"
        │
        ▼
MGBOS
"What facts, rules, transactions,
and operational states control it?"
        │
        ▼
JARVIS
"What does this reality mean,
what needs attention,
and what should happen next?"
```

This ordering is fundamental.

---

# 71. Canonical Authority Summary

```text
TEESTOCK
→ business intent / policy / operating requirements

MGBOS
→ business system truth / state / transactions / invariants

JARVIS
→ intelligence / reasoning / orchestration

n8n
→ workflow orchestration

.agents
→ software engineering workforce

docs/
→ cross-system governance

catatan/
→ history and provenance

archive/
→ retired reference
```

---

# 72. Final Principle

> **Business documentation defines the business.  
> MGBOS defines governed business-system truth.  
> JARVIS understands and coordinates that truth.  
> None should silently become the other.**

Repository search finds information.

Canonical Source Map resolves authority.