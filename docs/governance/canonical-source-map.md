---
canonical_id: docs.governance.canonical-source-map
status: ACTIVE
version: 1.1
owner: Rizky
author: OpenAI / ChatGPT
approver: Rizky
scope: repository
document_class: canonical-registry
effective_from: 2026-09-30
authoritative_for:
  - canonical source routing
  - semantic ownership routing
  - documentation authority lookup
  - transitional documentation tracking
  - repository authority boundaries
  - business-versus-system documentation boundaries
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

Canonical Source Map adalah registry authority untuk repository BisnisHub.

Dokumen ini menjawab:

> **Kalau manusia atau AI membutuhkan kebenaran tentang suatu konsep, sumber mana yang harus dipercaya?**

Canonical Source Map tidak menggantikan specification.

Ia menentukan:

```text
QUESTION
   ↓
SEMANTIC OWNER
   ↓
CANONICAL SOURCE
   ↓
IMPLEMENTATION / EVIDENCE
when current runtime reality matters
```

---

# 2. Constitutional Dependency

Source Map tunduk pada:

```text
docs/governance/documentation-constitution.md
```

Jika terjadi konflik:

```text
Documentation Constitution
>
Canonical Source Map
>
lower-level documentation
```

Constitution menentukan:

```text
HOW AUTHORITY WORKS
```

Source Map menentukan:

```text
WHERE AUTHORITY LIVES
```

---

# 3. Core Rule

> **One normative concept, one canonical semantic owner per scope.**

Dua dokumen boleh sama-sama canonical jika scope-nya berbeda.

Contoh:

```text
TeeStock Pricing Framework
→ canonical for TeeStock commercial pricing policy

MGBOS Quote Model
→ canonical for transactional quote representation
```

Keduanya tidak bersaing karena ownership-nya berbeda.

---

# 4. Source Classification

Repository menggunakan:

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

---

# 5. CANONICAL

Current normative authority dalam scope yang dinyatakan.

---

# 6. TRANSITIONAL_AUTHORITY

Legacy/historical source yang masih diperlukan karena material normatif belum sepenuhnya dipromosikan.

Ini adalah:

```text
DOCUMENTATION DEBT
```

dan harus dikurangi secara bertahap.

---

# 7. OPERATIONAL_REGISTRY

Mencatat current inventory/state/configuration.

Contoh:

```text
project index
integration inventory
runtime registry
```

Registry tidak otomatis menjadi architecture law.

---

# 8. EVIDENCE

Membuktikan:

```text
implementation

test result

release

runtime behavior

operational outcome
```

Evidence tidak otomatis mengubah intended architecture.

---

# 9. PLANNED_CANONICAL

Semantic owner diketahui, tetapi canonical source belum tersedia.

---

# 10. DESIGN_INPUT

Research, brainstorming, discussion, historical architecture proposal.

Tidak authoritative.

---

# 11. HISTORICAL

Preserved for:

```text
provenance

rationale

decision history
```

Tidak mengatur current behavior.

---

# 12. LEGACY

Source dari architecture/runtime lama yang masih mungkin memiliki consumer.

---

# 13. ARCHIVED

Retired reference.

Tidak mempunyai current authority.

---

# 14. Fundamental Routing Rule

Saat mencari authority:

```text
1. Read CANONICAL source.

2. Read runtime implementation/evidence
   if current behavior must be verified.

3. Consult DESIGN_INPUT/HISTORICAL
   only for rationale or unpromoted material.
```

Do not determine authority from:

```text
search ranking

file length

file age

folder depth

latest chat

AI confidence
```

---

# 15. Repository Authority Domains

BisnisHub memiliki empat authority domains utama:

```text
ROOT GOVERNANCE

BUSINESS KNOWLEDGE

SYSTEM SEMANTICS

ENGINEERING CONTROL
```

---

# 16. Root Governance

Physical location:

```text
docs/
```

Owns:

```text
cross-system governance

cross-system architecture

repository standards

cross-business operating rules

repository decisions
```

---

# 17. Business Knowledge

Physical location:

```text
bisnis/<business>/
```

Owns:

```text
business definition

strategy

brand

commercial policy

operating requirements

finance policy

marketing

legal/IP business requirements

business roadmap

business KPIs
```

---

# 18. System Semantics

Physical location:

```text
systems/<system>/
```

Owns:

```text
runtime semantics

data contracts

state machines

system invariants

system permissions

system implementation boundaries
```

---

# 19. Engineering Control

Physical location:

```text
.agents/
+
system engineering documentation
```

Owns:

```text
software planning

implementation workflow

review

testing

release
```

It does not own business truth.

---

# 20. Repository-Level Canonical Sources

| Concept | Owner | Canonical Source |
|---|---|---|
| Documentation authority | Repository Governance | `docs/governance/documentation-constitution.md` |
| Source routing | Repository Governance | `docs/governance/canonical-source-map.md` |
| Active project locations | Repository Governance | `docs/project-index.md` |
| Directory ownership | Repository Engineering | `docs/engineering/repository-layout.md` |
| Repository organization | Repository Governance | `docs/decisions/001-repository-organization.md` |
| Ecosystem architecture | Cross-System Architecture | `docs/architecture/master-system-blueprint.md` |
| System boundaries | Cross-System Architecture | `docs/architecture/system-boundaries.md` |
| Architecture laws | Cross-System Architecture | `docs/architecture/architectural-laws.md` |
| Cross-system risk | Cross-System Governance | `docs/governance/cross-system-risk-classification.md` |
| Autonomy | Cross-System Governance | `docs/governance/autonomy-levels.md` |
| Approval | Cross-System Governance | `docs/governance/approval-policy.md` |
| Evidence/provenance | Cross-System Governance | `docs/governance/evidence-provenance-model.md` |

---

# 21. Active System Locations

Current repository routing:

```text
MGBOS
→ systems/mgbos/

JARVIS documentation
→ systems/jarvis/docs/

KasKita
→ systems/kaskita/

Engineering assistant
→ tools/assistant/

TeeStock V1
→ archive/teestock-v1/

MGBOS Vite prototype
→ archive/mgbos-vite-prototype/
```

`docs/project-index.md` remains locator authority for active locations.

---

# 22. MGBOS Semantic Ownership

MGBOS is canonical semantic owner for governed business-system truth including:

```text
transactional business entities

business state

business invariants

commercial transactions

financial transactions

production state

inventory

procurement

fulfillment

business commands

business event contracts

authorization semantics

transactional integrity
```

---

# 23. MGBOS Business Truth

Foundational authority:

```text
systems/mgbos/docs/adr/002-postgresql-system-of-record.md
```

Canonical principle:

> **PostgreSQL/MGBOS owns authoritative transactional business truth.**

Therefore the following cannot become competing SoR:

```text
JARVIS Memory

n8n

spreadsheet

LLM output

frontend state

WhatsApp messages
```

---

# 24. MGBOS Canonical Architecture Sources

Dedicated canonical specs now exist:

```text
systems/mgbos/docs/architecture/canonical-data-model.md

systems/mgbos/docs/architecture/business-state-machines.md

systems/mgbos/docs/architecture/business-invariants.md

systems/mgbos/docs/architecture/command-event-model.md

systems/mgbos/docs/architecture/permission-authorization-model.md
```

Classification:

```text
CANONICAL
```

---

# 25. Sep-23 MGBOS Design Notes

Historical sources such as:

```text
MGBOS 0.2 Canonical Data Model

MGBOS 0.2.1 Logical Data Model

MGBOS 0.3 Business State Machines

MGBOS 0.4 System Architecture
```

are now:

```text
HISTORICAL / DESIGN PROVENANCE
```

for concepts already promoted.

They MUST NOT override current dedicated canonical specifications.

---

# 26. MGBOS Documentation Debt

Current:

```text
systems/mgbos/docs/README.md
```

and:

```text
systems/mgbos/docs/architecture/README.md
```

still reference Sep-23 notes as primary/detailed authority.

This is:

```text
DOCUMENTATION_DRIFT
```

and should be corrected during the closure sprint.

---

# 27. MGBOS Implementation Evidence

Files such as:

```text
systems/mgbos/docs/engineering/mgbos-001-report.md
...
systems/mgbos/docs/engineering/mgbos-020-report.md
```

are:

```text
EVIDENCE
```

They prove implementation at specific repository revisions.

They do not own business semantics.

---

# 28. MGBOS Product Documentation

Current:

```text
systems/mgbos/docs/product/
```

owns product/pilot implementation specification for MGBOS applications.

It may describe:

```text
screen requirements

pilot UX

application behavior
```

but does not replace business strategy under:

```text
bisnis/teestock/
```

---

# 29. MGBOS Engineering Control Plane

Current canonical engineering sources:

```text
systems/mgbos/docs/engineering/

systems/mgbos/docs/engineering/agent-system/

.agents/
```

These govern:

```text
software implementation
```

not JARVIS runtime business agents.

---

# 30. JARVIS Current Authority

DOC-002 v1.0 stated that JARVIS did not yet have a canonical documentation tree.

That statement is obsolete.

JARVIS now has canonical documentation at:

```text
systems/jarvis/docs/
```

---

# 31. JARVIS Primary Canonical Sources

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

# 32. JARVIS Architecture Sources

Canonical architecture currently includes:

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

under:

```text
systems/jarvis/docs/architecture/
```

---

# 33. JARVIS Specification ≠ Runtime

Current canonical docs may be:

```text
ACTIVE
```

while runtime remains:

```text
NOT_IMPLEMENTED
```

or:

```text
PARTIALLY_IMPLEMENTED
```

depending on component.

Never infer runtime existence from documentation status alone.

---

# 34. Sep-27 JARVIS Notes

Sources under:

```text
catatan/sesi/2026-09-27*
```

are now primarily:

```text
HISTORICAL DESIGN INPUT
```

for promoted JARVIS concepts.

They remain useful for rationale and unpromoted ideas.

---

# 35. Engineering Agents vs JARVIS Agents

`.agents/`

owns:

```text
software engineering roles / skills
```

JARVIS Agent Registry owns:

```text
runtime business/intelligence agents
```

They are different systems.

A similarly named role does not create shared authority.

---

# 36. TeeStock Business Authority

Canonical TeeStock business knowledge lives under:

```text
bisnis/teestock/
```

TeeStock owns:

```text
business definition

strategy

brand

commerce

services

Originals

Programs

operations policy

finance policy

marketing

legal/IP business policy

metrics

experiments

business roadmap
```

---

# 37. TeeStock Canonical Scope

A TeeStock document may legitimately be:

```text
CANONICAL
```

within:

```text
TEEStock BUSINESS SCOPE
```

without becoming globally canonical for MGBOS or JARVIS.

---

# 38. Business Truth vs System Truth

Canonical distinction:

```text
TEEStock
"What does the business need?"

MGBOS
"How is operational truth represented and governed?"

JARVIS
"What does that truth mean and what deserves attention?"
```

---

# 39. TeeStock `11-data-mgbos`

Current directory:

```text
bisnis/teestock/11-data-mgbos/
```

contains valuable models and requirements.

However its authority must be interpreted as:

```text
TEEStock BUSINESS DATA /
SYSTEM REQUIREMENTS
```

not:

```text
canonical MGBOS implementation
```

---

# 40. TeeStock Data Model

Current:

```text
bisnis/teestock/11-data-mgbos/canonical-data-model.md
```

is authoritative for:

```text
TeeStock conceptual business-domain requirements
```

It is NOT authoritative for:

```text
MGBOS database schema

MGBOS shared state machines

MGBOS invariants

MGBOS transactions
```

---

# 41. TeeStock Event Model

Current:

```text
bisnis/teestock/11-data-mgbos/event-model.md
```

defines:

```text
TeeStock business-event requirements / candidates
```

Actual MGBOS business-event contracts are owned by:

```text
systems/mgbos/docs/architecture/command-event-model.md
```

---

# 42. TeeStock MGBOS Integration

Current:

```text
bisnis/teestock/11-data-mgbos/mgbos-integration.md
```

owns:

```text
TeeStock integration requirements
```

It does NOT replace MGBOS architecture.

---

# 43. Future TeeStock Directory Target

Preferred future semantic naming:

```text
bisnis/teestock/11-system-requirements/
```

Possible mapping:

```text
canonical-data-model.md
→ business-domain-requirements.md

entity-hierarchy.md
→ entity-requirements.md

event-model.md
→ event-requirements.md

mgbos-integration.md
→ mgbos-integration-requirements.md
```

This is a controlled migration target.

It is NOT permission for blind rename.

---

# 44. TeeStock State-Machine Conflict

Several TeeStock docs currently describe simplified states for:

```text
Lead

Order

Payment

Production
```

that are also owned canonically by MGBOS.

Resolution:

> **For MGBOS-owned transactional entities, MGBOS canonical state machines win.**

TeeStock may preserve:

```text
business shorthand

journey stages

roadmap milestones
```

but must not define competing transactional state semantics.

---

# 45. TeeStock Roadmap

Current quarter authority:

```text
bisnis/teestock/14-roadmap/current-quarter.md
```

owns:

```text
TEEStock Q4 business execution priority
```

within its time window.

It does not certify implementation.

---

# 46. Current TeeStock Q4 Priority

Current primary outcome:

```text
Lead-to-Cash
+
Order-to-Fulfillment
```

through a repeatable operating spine.

This remains aligned with the current implementation program.

---

# 47. `catatan/` Authority

Default:

```text
DESIGN_INPUT

HISTORICAL

RESEARCH

SESSION MEMORY
```

A chat/session note does not become canonical merely because it contains a good design.

---

# 48. Promotion Rule

Canonicalization flow:

```text
SESSION / RESEARCH
        ↓
AUDIT
        ↓
IDENTIFY SEMANTIC OWNER
        ↓
WRITE / REVISE CANONICAL SOURCE
        ↓
REVIEW
        ↓
PERSIST TO CANONICAL PATH
        ↓
UPDATE SOURCE MAP / INDEX
```

---

# 49. ChatGPT Drafts

A finished document drafted in conversation is:

```text
ACTIVE-READY
```

until persisted.

It becomes repository:

```text
ACTIVE
```

only after:

```text
approved content
+
canonical path
+
repository persistence
+
navigation/source-map update where required
```

---

# 50. Current Canonical-Ready but Unpersisted Documents

Current conversation has produced canonical-ready drafts including:

```text
Solo-Founder Operating System v1.0

MGBOS Domain Map & Capability Ownership v1.0

Solo-Founder Implementation Roadmap v1.0

Phase 1 Operating Spine Implementation Plan v1.0

Phase 1A Current MGBOS Operating-Spine Audit v1.0

JARVIS Command Center & Decision Experience Architecture v1.0

JARVIS Integration, API & Interoperability Architecture v1.0
```

Until persisted, classification:

```text
ACTIVE-READY DRAFT
```

not repository authority.

---

# 51. Architecture Program State

Correct current state:

```text
CONTROLLED_CANONICALIZATION
```

not:

```text
UNLIMITED ARCHITECTURE EXPANSION
```

and not:

```text
TOTAL DOCUMENTATION FREEZE
```

---

# 52. Controlled Canonicalization Means

We SHOULD:

```text
close known authority gaps

resolve conflicting sources

promote mature design

repair indexes

create implementation docs needed by current work
```

We SHOULD NOT:

```text
invent speculative subsystems

create empty documentation trees

write future docs without consumer
```

---

# 53. Current Closure Priority

Priority documentation closure:

```text
P0
Canonical Source Map

P0
MGBOS Documentation Index

P0
MGBOS Architecture Index

P0
Solo-Founder Operating System

P0
MGBOS Domain Map & Capability Ownership

P0
Solo-Founder Launch Roadmap

P0
Phase 1 Operating Spine docs

P0
TeeStock ↔ MGBOS authority cleanup
```

Then:

```text
P1
Cross-System Time & Scheduling Semantics

P1
Cross-System Data Classification
```

---

# 54. Deferred Documentation

Do not create merely to fill a directory:

```text
generic API standards

advanced notification governance

JARVIS Memory operations

creator runbooks

royalty operations

multi-business command-center runbooks
```

until there is a real consumer.

---

# 55. Runtime Truth vs Documentation Truth

Canonical docs define:

```text
INTENDED / GOVERNED BEHAVIOR
```

Code/runtime defines:

```text
CURRENT IMPLEMENTED BEHAVIOR
```

If they differ:

```text
IMPLEMENTATION_DRIFT
```

or:

```text
DOCUMENTATION_DRIFT
```

must be identified.

Never silently pick one.

---

# 56. Evidence Does Not Rewrite Authority

> **Implementation evidence does not override semantic architecture.**

An implementation report saying:

```text
"feature implemented"
```

does not permit implementation to redefine canonical semantics.

If implementation legitimately changes architecture:

```text
update canonical source deliberately.
```

---

# 57. Physical Business Reality

MGBOS record is not automatically physical reality.

Examples:

```text
production completed

shipment delivered

vendor accepted
```

may require external observation/evidence.

---

# 58. External Providers

Provider may be authoritative for provider-side facts.

Examples:

```text
carrier tracking

payment-provider transaction state

GitHub CI result
```

Internal business interpretation remains owned by relevant BisnisHub system.

---

# 59. n8n Authority

Canonical:

```text
n8n
=
orchestration
```

not:

```text
system of record

business-rule owner

JARVIS reasoning core
```

---

# 60. AI Authority

AI may:

```text
classify

summarize

recommend

draft

analyze
```

AI output is not automatically:

```text
business truth

approval

permission

transaction
```

---

# 61. Source Selection Examples

## Change MGBOS Order transition

Read:

```text
Documentation Constitution

Canonical Source Map

MGBOS State Machines

MGBOS Invariants

Command & Event Model

Permission Model

current implementation/tests
```

---

# 62. Change TeeStock Pricing Strategy

Read:

```text
TeeStock Finance

Pricing Framework

Unit Economics

MGBOS quote semantics only
if implementation impact exists
```

---

# 63. Build JARVIS Morning Briefing

Read:

```text
JARVIS Charter

JARVIS Architecture

Core Runtime

Tool Architecture

Evidence

MGBOS read contracts

TeeStock operating context
```

---

# 64. Documentation Placement Rule

Use:

```text
cross-system governance
→ docs/

MGBOS semantics
→ systems/mgbos/docs/

JARVIS semantics
→ systems/jarvis/docs/

TeeStock business knowledge
→ bisnis/teestock/

historical discussions
→ catatan/

retired material
→ archive/
```

---

# 65. Canonical Navigation Rule

Every canonical document SHOULD have a parent navigation source.

Example:

```text
systems/mgbos/docs/architecture/domain-map-capability-ownership.md
        ↑
systems/mgbos/docs/architecture/README.md
        ↑
systems/mgbos/docs/README.md
        ↑
systems/mgbos/README.md
```

---

# 66. Current Known Documentation Drift

Known drift as of repository snapshot:

### A. Canonical Source Map v1.0

Still claims JARVIS lacks canonical docs.

Resolved by this v1.1.

### B. MGBOS Docs Index

Still routes detailed architecture to Sep-23 notes.

Must be revised next.

### C. MGBOS Architecture README

Still describes Sep-23 notes as primary canonical architecture sources.

Must be revised after Docs Index or together with it.

### D. TeeStock Data & MGBOS

Terminology creates potential competing authority.

Needs controlled cleanup.

### E. Canonical-ready chat docs

Several approved-ready documents are not persisted.

Need controlled promotion.

---

# 67. Current Authority Model

```text
                       BISNISHUB
                           │
              CROSS-SYSTEM GOVERNANCE
                           │
        ┌──────────────────┼──────────────────┐
        ▼                  ▼                  ▼
    BUSINESS             MGBOS              JARVIS
    KNOWLEDGE         BUSINESS TRUTH      INTELLIGENCE
        │                  │                  │
    TeeStock          transactions        reasoning
    MultiGraph        state               planning
    others            invariants          memory
        │                  │                  │
        └──────────────────┼──────────────────┘
                           ▼
                    BUSINESS REALITY
```

Parallel engineering control:

```text
.agents/
   ↓
software implementation
```

---

# 68. TeeStock–MGBOS–JARVIS Mental Model

```text
TEEStock
defines:
"What business are we trying to run?"

        ↓

MGBOS
defines:
"What facts, transactions and operational states govern it?"

        ↓

JARVIS
defines:
"What does the current reality mean and what deserves attention?"
```

---

# 69. Canonical Authority Summary

```text
docs/
→ cross-system governance

bisnis/teestock/
→ TeeStock business truth

systems/mgbos/
→ business-system transactional truth

systems/jarvis/
→ intelligence architecture

.agents/
→ software engineering control plane

catatan/
→ provenance / design input

archive/
→ retired sources
```

---

# 70. Current Canonicalization Backlog

After this document is persisted, recommended next sequence:

```text
1.
systems/mgbos/docs/README.md
→ MGBOS Documentation Index v2

2.
systems/mgbos/docs/architecture/README.md
→ MGBOS Architecture Index v2

3.
docs/operating-model/solo-founder-operating-system.md

4.
systems/mgbos/docs/architecture/
domain-map-capability-ownership.md

5.
docs/roadmaps/
solo-founder-launch-roadmap.md

6.
systems/mgbos/docs/implementation/
phase-1-operating-spine/

7.
TeeStock system-requirement authority cleanup

8.
Cross-System Time & Scheduling Semantics

9.
Cross-System Data Classification
```

---

# 71. Completion Condition

Canonical Source Map is healthy when a competent human or AI can answer:

```text
Where does this concept belong?

Which document owns it?

Which implementation proves it?

Is this source current, historical or merely design input?

Does another document conflict with it?
```

without guessing.

---

# 72. Final Principle

> **Search finds information. Canonical Source Map determines authority.**

And:

> **Business documentation defines the business. MGBOS defines governed business-system truth. JARVIS reasons over that truth. Engineering implements it. Historical notes explain how we got there.**