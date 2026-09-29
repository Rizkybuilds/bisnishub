---
canonical_id: docs.governance.canonical-source-map
status: ACTIVE
version: 1.0
owner: Rizky
author: OpenAI / ChatGPT
approver: Rizky
scope: repository
document_class: registry
effective_from: 2026-09-29
authoritative_for:
  - canonical source routing
  - semantic ownership routing
  - documentation authority lookup
  - transitional documentation tracking
  - canonicalization backlog
last_reviewed: 2026-09-29
review_cadence: monthly
depends_on:
  - documentation-constitution.md
  - ../project-index.md
  - ../engineering/repository-layout.md
  - ../decisions/001-repository-organization.md
supersedes: null
repository_snapshot: ffa5aae85af7cc644233d14fba43bdf9dc3afcfc
---

# DOC-002 — BisnisHub Canonical Source Map

## 1. Purpose

Canonical Source Map adalah registry authority untuk repository BisnisHub.

Dokumen ini menjawab:

> **Jika manusia atau AI membutuhkan kebenaran tentang suatu konsep, sumber mana yang harus dibaca dan siapa semantic owner-nya?**

Canonical Source Map bukan pengganti specification.

Ia merupakan **router menuju specification yang benar**.

Tujuan utamanya adalah mencegah manusia dan AI harus:

```text
search hundreds of files
        ↓
compare filenames
        ↓
guess which document is current
```

Target state:

```text
QUESTION
   ↓
CANONICAL SOURCE MAP
   ↓
SEMANTIC OWNER
   ↓
AUTHORITATIVE DOCUMENT
   ↓
ADR / EVIDENCE when required
```

---

# 2. Constitutional Dependency

DOC-002 tunduk pada:

```text
docs.governance.documentation-constitution
```

Jika Source Map dan Documentation Constitution bertentangan mengenai aturan authority, Documentation Constitution memiliki constitutional precedence.

Source Map menentukan **routing authority**.

Constitution menentukan **cara authority bekerja**.

---

# 3. Source Status Vocabulary

DOC-002 menggunakan status berikut.

## CANONICAL

Sumber authoritative yang berlaku saat ini dalam semantic scope-nya.

## TRANSITIONAL_AUTHORITY

Sumber lama yang masih diperlukan oleh ACTIVE documentation karena normative material belum sepenuhnya dipromosikan.

Status ini adalah documentation debt.

## OPERATIONAL_REGISTRY

Mencatat current operational state atau evidence inventory.

Authoritative terhadap registry tersebut, tetapi bukan architecture specification.

## EVIDENCE

Membuktikan implementation, test, release, atau operational result.

Tidak mendefinisikan intended architecture.

## PLANNED_CANONICAL

Semantic owner sudah diketahui tetapi canonical specification belum tersedia.

Tidak boleh digunakan seolah-olah sudah menjadi specification aktif.

## DESIGN_INPUT

Research atau architecture discussion yang dapat digunakan untuk menyusun canonical documentation.

Tidak authoritative.

## HISTORICAL

Dipertahankan untuk provenance dan reasoning history.

## LEGACY

Milik architecture atau implementation yang sudah dipensiunkan atau sedang ditinggalkan.

---

# 4. Fundamental Routing Rule

Source selection MUST mengikuti urutan:

```text
Identify concept
      ↓
Find semantic owner in DOC-002
      ↓
Read CANONICAL source
      ↓
Read related ADR when architectural rationale matters
      ↓
Read implementation/evidence if current reality must be verified
      ↓
Use transitional/historical material only if required
```

Search result tidak menentukan authority.

Filename tidak menentukan authority.

Document length tidak menentukan authority.

---

# 5. Repository-Level Authority Map

| Concept | Semantic Owner | Canonical Source | Status |
|---|---|---|---|
| Documentation governance | Repository Governance | `docs/governance/documentation-constitution.md` | CANONICAL |
| Canonical source routing | Repository Governance | `docs/governance/canonical-source-map.md` | CANONICAL |
| Active software-system locations | Repository Governance | `docs/project-index.md` | CANONICAL |
| Repository directory ownership | Repository Engineering Governance | `docs/engineering/repository-layout.md` | CANONICAL |
| Repository organization decision | Repository Governance | `docs/decisions/001-repository-organization.md` | CANONICAL |
| Repository migration strategy | Repository Engineering Governance | `docs/engineering/repository-migration-plan.md` | CANONICAL for migration plan |
| Migration implementation evidence | Repository Engineering | `docs/engineering/repository-migration-*.md` | EVIDENCE |
| Root agent routing | Repository Engineering | `AGENTS.md` | CANONICAL instruction |
| Repository introduction/navigation | Repository | `README.md` | CANONICAL navigation |
| Legacy ecosystem architecture | Historical Repository Architecture | `ARCHITECTURE.md` | LEGACY / HISTORICAL |

---

# 6. Physical Location Authority

Current active system locations are determined by:

```text
docs/project-index.md
```

No other architecture document may override current physical routing.

Location paths were refreshed on 2026-09-30 after MGBOS relocation merged in
PR #14 (`b05079e`). This location review does not certify implementation of the
architecture specifications or change their semantic ownership.

Example:

```text
MGBOS current runtime
→ systems/mgbos/

KasKita current runtime
→ systems/kaskita/

retired MGBOS prototype
→ archive/mgbos-vite-prototype/
```

A TARGET relocation described by an ADR or migration plan does not become current merely because the plan exists.

---

# 7. MGBOS — System Ownership

Canonical semantic owner:

```text
MGBOS
```

Current system location:

```text
systems/mgbos/
```

MGBOS owns:

```text
business state
business entities
business invariants
transaction rules
commercial lifecycle
financial lifecycle
production lifecycle
inventory semantics
vendor semantics
procurement semantics
fulfillment semantics
money semantics
business commands
business events
```

JARVIS, n8n, AI models, UI state, spreadsheets, and external messages MUST NOT become competing authorities for these concepts.

---

# 8. MGBOS Primary Navigation

| Concept | Current Source | Status |
|---|---|---|
| MGBOS workspace identity | `systems/mgbos/README.md` | CANONICAL |
| MGBOS documentation index | `systems/mgbos/docs/README.md` | CANONICAL navigation |
| MGBOS engineering instructions | `systems/mgbos/AGENTS.md` | CANONICAL instruction |
| MGBOS architecture constitution | `systems/mgbos/docs/architecture/README.md` | CANONICAL |
| Product/pilot specification | `systems/mgbos/docs/product/README.md` | CANONICAL within product scope |
| Engineering governance/index | `systems/mgbos/docs/engineering/README.md` | CANONICAL within engineering scope |
| Operational runbooks | `systems/mgbos/docs/runbooks/` | CANONICAL procedures |
| Architecture decisions | `systems/mgbos/docs/adr/` | ACCEPTED decision records |

---

# 9. MGBOS Architecture Decisions

The following accepted ADRs define important MGBOS architectural choices.

## Foundational Architecture

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

ADR-007
Workspace Coexistence
```

These ADRs are located under:

```text
systems/mgbos/docs/adr/
```

and are authoritative decision records within their declared scope.

Later ADRs define specific product/domain decisions such as quotations, order snapshots, production jobs, vendor/QC, invoicing, and design-library behavior.

ADR existence does not replace the corresponding system specification.

---

# 10. MGBOS Business Truth

Canonical foundational decision:

```text
systems/mgbos/docs/adr/002-postgresql-system-of-record.md
```

Rule:

> Canonical transactional facts and business integrity live in PostgreSQL through the MGBOS domain/database architecture.

Therefore the following are NOT authoritative business state:

```text
AI output
JARVIS memory
n8n workflow memory
browser state
spreadsheet copy
WhatsApp text
frontend component state
session note
vector database
```

They may contain observations or proposals.

They do not independently establish transactional truth.

---

# 11. MGBOS Canonical Data Model

Current normative knowledge is distributed across:

```text
systems/mgbos/docs/architecture/README.md
+
implemented schema/migrations
+
accepted ADRs
+
historical MGBOS design sources
```

The detailed historical model remains referenced through:

```text
catatan/sesi/2026-09-23 - MGBOS 0.2 — Canonical Data Model v0.1.md

catatan/sesi/2026-09-23 - MGBOS 0.2.1 Logical Data Model.md
```

Current classification:

```text
TRANSITIONAL_AUTHORITY
```

Reason:

ACTIVE MGBOS documentation still references these historical specifications.

Target:

> Promote normative entity semantics into a dedicated MGBOS canonical specification.

Until promotion is complete, any contradiction MUST be resolved against:

```text
accepted ADR
+
current MGBOS architecture
+
current schema/migrations
+
verified implementation
```

rather than blindly trusting the older session note.

---

# 12. MGBOS State Machines

Historical detailed source:

```text
catatan/sesi/2026-09-23 - MGBOS 0.3 — Business State Machines.md
```

Current summarized source:

```text
systems/mgbos/docs/architecture/README.md
```

Classification:

```text
architecture summary
→ CANONICAL

historical detailed specification
→ TRANSITIONAL_AUTHORITY
```

Target canonical owner:

```text
MGBOS specification layer
```

The eventual dedicated specification SHOULD own the complete lifecycle semantics for:

```text
commercial
financial
production
quality
fulfillment
inventory-related lifecycle
procurement lifecycle
```

---

# 13. MGBOS Business Invariants

Business invariants currently exist across:

```text
systems/mgbos/AGENTS.md
systems/mgbos/docs/architecture/README.md
systems/mgbos/docs/adr/
database constraints
domain implementation
transaction tests
```

Examples include:

```text
Integer / BigInt Rupiah
Rules Before AI
immutable transaction snapshots
isolated lifecycle state machines
authorized command boundaries
transactional outbox
shipping pass-through isolation
idempotency
tenant / organization isolation
```

Current classification:

```text
CANONICAL BUT DISTRIBUTED
```

Target:

> Consolidate normative business invariants into one dedicated MGBOS specification while keeping implementation enforcement distributed.

This is a high-priority documentation consolidation item.

---

# 14. MGBOS Product Authority

Primary product specification:

```text
systems/mgbos/docs/product/README.md
```

Current role:

```text
CANONICAL within pilot/product scope
```

Specific TeeStock product strategy and future development are owned by:

```text
systems/mgbos/docs/product/teestock-curated-strategy.md
systems/mgbos/docs/product/teestock-development-plan.md
systems/mgbos/docs/product/teestock-design-library-spec.md
systems/mgbos/docs/product/teestock-asset-readiness.md
```

Roadmaps and development plans represent intended direction, not implementation proof.

Implementation status must be checked against:

```text
engineering reports
source code
tests
database migrations
CI/evidence
```

---

# 15. MGBOS Engineering Authority

Primary owner:

```text
MGBOS Engineering Governance
```

Important sources:

```text
systems/mgbos/docs/engineering/README.md
systems/mgbos/docs/engineering/maintenance-policy.md
systems/mgbos/docs/engineering/operational-readiness.md
```

Classification:

```text
CANONICAL
```

The maintenance policy determines engineering/release-process expectations.

The operational readiness document is an:

```text
OPERATIONAL_REGISTRY
```

and MUST NOT be interpreted as production certification.

---

# 16. MGBOS Engineering Control Plane

Canonical entry point:

```text
systems/mgbos/docs/engineering/agent-system/README.md
```

Canonical related documents:

```text
workflow.md
roles.md
permission-matrix.md
risk-classification.md
evidence-model.md
release-gates.md
```

Supporting runtime role contracts:

```text
.agents/roles/
```

Behavioral baseline:

```text
.agents/evals/
```

Classification:

```text
CANONICAL for MGBOS software-development agent governance
```

Important boundary:

> These sources govern engineering agents. They do not define JARVIS runtime business agents.

---

# 17. Engineering Skills

Project-owned skill library:

```text
.agents/skills/
```

Current authority:

```text
CANONICAL instruction source for repository/project engineering skills
```

Skill semantics remain scoped by:

```text
AGENTS.md
target workspace instructions
relevant system specifications
```

A skill example MUST NOT override MGBOS domain truth.

The existence of skills such as:

```text
cfo
cmo
coo
business-ops-engine
content-strategist
```

does NOT automatically register those skills as JARVIS runtime workers.

Repository skill availability and production runtime registration are separate concerns.

---

# 18. MGBOS Operational Runbooks

Current canonical runbooks:

```text
systems/mgbos/docs/runbooks/local-database.md
systems/mgbos/docs/runbooks/windows-database-prerequisites.md
systems/mgbos/docs/runbooks/backup-and-restore.md
systems/mgbos/docs/runbooks/monitoring-and-incidents.md
systems/mgbos/docs/runbooks/release-and-recovery.md
```

These documents define procedure.

They do not prove that corresponding production infrastructure exists.

For readiness evidence, consult:

```text
systems/mgbos/docs/engineering/operational-readiness.md
```

---

# 19. MGBOS Implementation Evidence

Implementation reports:

```text
systems/mgbos/docs/engineering/mgbos-001-report.md
...
systems/mgbos/docs/engineering/mgbos-020-report.md
```

Classification:

```text
EVIDENCE
```

They describe implementation and verification at specific revisions/times.

They MUST NOT redefine architecture or business semantics merely because implementation differs.

A mismatch creates:

```text
IMPLEMENTATION_DRIFT
```

or:

```text
DOCUMENTATION_DRIFT
```

and must be reconciled.

---

# 20. n8n Authority

MGBOS architectural decision:

```text
systems/mgbos/docs/adr/004-n8n-orchestrator.md
```

Canonical principle:

> n8n is an orchestration runtime, not the business system of record.

n8n MAY:

```text
react to events
coordinate integrations
invoke authorized commands
schedule workflows
handle external orchestration
```

n8n MUST NOT independently redefine:

```text
business truth
payment state
inventory state
financial truth
order state
```

---

# 21. AI Gateway Authority

Current accepted MGBOS decision:

```text
systems/mgbos/docs/adr/006-ai-gateway.md
```

Canonical principle:

> AI capabilities interact through provider-independent boundaries, validation, authorization, and approval policy.

This ADR governs MGBOS AI integration principles.

It does not define the full future JARVIS architecture.

---

# 22. JARVIS Current Authority State

JARVIS currently has extensive design material but no implemented canonical system documentation tree.

Therefore:

```text
JARVIS architecture
→ NOT YET FULLY CANONICALIZED
```

No session note may be treated as permanent production authority merely because it is detailed.

---

# 23. JARVIS Design Inputs

Primary design inputs:

```text
catatan/sesi/2026-09-27 - JARVIS Architecture v0.1.md

catatan/sesi/2026-09-27 - JARVIS v0.2 - Core Runtime Specification.md

catatan/sesi/2026-09-27 - Chat GPT diskusi pann Jarvis Architecture.md

catatan/sesi/2026-09-27 - Governance & Operations Blueprint.md

catatan/sesi/2026-09-27 - Chat GPT sesi Governance & Operations.md

catatan/sesi/2026-09-27 - Chat GPT Sesi Model AI.md

catatan/sesi/2026-09-27 - Chat GPT sesi INFRASTRUCTURE
```

Classification:

```text
DESIGN_INPUT
```

These sources are valuable architectural provenance.

They are not final canonical runtime specifications.

---

# 24. JARVIS Logical Ownership

Even before physical runtime implementation exists, the following semantic ownership is established conceptually:

```text
JARVIS

owns:

intent interpretation
context construction
planning
reasoning orchestration
tool selection
policy coordination
execution coordination
verification
evidence synthesis
runtime memory
model routing
runtime business agents
proactive intelligence
briefing
decision support
```

This ownership does NOT imply these capabilities are implemented.

Current implementation maturity:

```text
NOT YET VERIFIED / NOT YET IMPLEMENTED as canonical runtime
```

unless future evidence states otherwise.

---

# 25. JARVIS Physical Documentation Location

No empty runtime/system directory should be created merely to satisfy documentation planning.

Current repository governance explicitly discourages placeholder runtime systems before implementation.

Therefore DOC-002 records JARVIS using:

```text
logical canonical ownership
```

until a real JARVIS system workspace is created.

When implementation begins, the physical location MUST be registered in:

```text
docs/project-index.md
```

and this Source Map MUST be updated.

---

# 26. JARVIS Canonicalization Backlog

The following JARVIS concepts require future dedicated canonical sources:

```text
JARVIS Charter
JARVIS Architecture
Core Runtime
Intent Router
Context Builder
Planner
Supervisor
Policy Engine
Execution Engine
Verification Engine
Evidence Model
Decision Inbox
Briefing Engine
Escalation Model
Model Routing
Memory Architecture
Event Intelligence
Failure & Recovery
```

Until each canonical source exists, relevant session notes remain DESIGN_INPUT only.

---

# 27. Runtime Business Agents

Potential agents such as:

```text
CFO Agent
COO Agent
CMO Agent
Sales Agent
Customer Service Agent
Procurement Agent
Vendor Agent
Content Agent
Research Agent
```

currently have:

```text
NO CANONICAL RUNTIME REGISTRY
```

They MUST NOT be assumed active simply because similar `.agents/skills/` exist.

Target semantic owner:

```text
JARVIS Runtime Agent System
```

Status:

```text
PLANNED_CANONICAL
```

---

# 28. Runtime Skills

Future business runtime skills may include:

```text
analyze_cashflow
analyze_margin
compare_vendor
qualify_lead
prepare_quotation
forecast_inventory
create_content_brief
analyze_campaign
```

Current canonical runtime skill system:

```text
NOT ESTABLISHED
```

Do not confuse future JARVIS runtime skills with current repository engineering skills.

---

# 29. Runtime Tool Registry

Future JARVIS tool capability IDs SHOULD use capability-oriented naming.

Examples:

```text
mgbos.order.read
mgbos.vendor.read
mgbos.payment.record
github.pull_request.read
email.message.send
social.content.publish
```

Current full JARVIS Tool Registry:

```text
NOT ESTABLISHED
```

Tool-provider implementation MUST remain secondary to capability identity.

---

# 30. General Risk Classification

There are currently two related but different bodies of risk material.

MGBOS engineering agents have canonical risk classification at:

```text
systems/mgbos/docs/engineering/agent-system/risk-classification.md
```

This source is authoritative for:

```text
MGBOS engineering-change risk
```

It is NOT automatically the root risk semantics for all future JARVIS business actions.

General cross-system business/AI risk semantics remain:

```text
PLANNED_CANONICAL
```

Design input exists in the JARVIS/Governance session materials.

A root governance specification must later define the shared R0–R5 semantics.

---

# 31. Autonomy Levels

General autonomy semantics such as:

```text
L0 Observe
L1 Recommend
L2 Prepare
L3 Execute with approval
L4 Execute within policy
```

currently exist as:

```text
DESIGN_INPUT
```

They are not yet a dedicated root canonical specification.

Target owner:

```text
Cross-System Governance
```

A subsystem MAY later classify a capability using those levels.

A subsystem MUST NOT redefine their root meaning.

---

# 32. Approval Governance

Founder approval and future Decision Inbox semantics currently exist primarily in JARVIS/Governance design notes.

Status:

```text
PLANNED_CANONICAL
```

Future owner:

```text
JARVIS + Cross-System Governance boundary
```

General approval semantics belong to governance.

Decision Inbox behavior belongs to JARVIS.

Specific business-command authorization remains owned by MGBOS.

---

# 33. Memory Authority

Future JARVIS memory may contain:

```text
working memory
episodic memory
semantic memory
preference memory
evidence references
```

Canonical business facts remain outside AI memory.

Rule already supported by MGBOS architecture:

```text
AI memory ≠ transactional truth
```

Full JARVIS memory architecture:

```text
PLANNED_CANONICAL
```

---

# 34. Model Strategy

The 27 September model-selection discussion is classified:

```text
DESIGN_INPUT / TIME-SENSITIVE RESEARCH
```

Specific model names, prices, and provider capabilities MUST NOT become permanent architecture by copy-paste.

Canonical future architecture should define profiles such as:

```text
FAST
BALANCED
DEEP
CRITIC
CREATIVE
VISION
VOICE
```

Operational provider/model mapping should live in a versioned Model Registry and be driven by current evaluation data.

---

# 35. Infrastructure Strategy

The 27 September infrastructure discussion is:

```text
DESIGN_INPUT / TIME-SENSITIVE RESEARCH
```

Conceptual principles may later be promoted, such as:

```text
separate business database from AI runtime
avoid premature infrastructure complexity
isolate production from home/lab infrastructure
use managed services where operational risk justifies them
```

Specific vendors, plans, prices, and hardware recommendations are not architectural law unless accepted through appropriate canonical infrastructure documentation or ADR.

---

# 36. Business Knowledge Ownership

Business knowledge lives under:

```text
bisnis/<business>/
```

Current major business knowledge domains include:

```text
bisnis/multigraph/
bisnis/teestock/
bisnis/rizkybuild/
bisnis/titik-buta/
bisnis/kaskita/
```

Business knowledge and executable systems are separate ownership domains.

Example:

```text
TeeStock business strategy
→ bisnis/teestock/

TeeStock runtime application
→ current system location from project index
```

The presence of a business folder does not imply a software runtime exists.

---

# 37. Independent Projects

Current repository governance establishes that:

```text
KasKita
Titik Buta
```

must not automatically be treated as MultiGraph Group business units merely because they share the repository.

Current KasKita runtime location:

```text
systems/kaskita/
```

Its software authority remains project-specific.

MGBOS governance does not automatically apply to KasKita.

---

# 38. Legacy Systems

Legacy systems currently include:

```text
archive/mgbos-vite-prototype/
bisnis/teestock/archive/web/
packages/shared/
apps/bisnishub-web/
```

Their exact active/retired state MUST be resolved through:

```text
docs/project-index.md
```

Legacy contracts MUST NOT be imported into MGBOS or JARVIS merely because filenames or concepts appear similar.

---

# 39. Root Historical Architecture

`ARCHITECTURE.md` is explicitly historical/legacy.

Classification:

```text
LEGACY / HISTORICAL
```

It MUST NOT override:

```text
docs/project-index.md
MGBOS architecture
current repository ADRs
current system-specific specifications
```

---

# 40. `catatan/` Authority

Default classification of:

```text
catatan/
```

is:

```text
HISTORICAL / RESEARCH / DESIGN_INPUT
```

unless another ACTIVE document explicitly declares a temporary transitional dependency.

Important examples:

```text
catatan/sesi/
catatan/ide/
catatan/harian/
catatan/weekly-review/
```

These directories preserve organizational memory.

They do not automatically create project authority.

---

# 41. Historical MGBOS Roadmaps

Files such as:

```text
catatan/mgbos-master-roadmap-tracker.md
```

may contain valuable historical planning.

They MUST NOT override current MGBOS implementation, engineering reports, ADRs, or architecture.

Classification:

```text
HISTORICAL ROADMAP
```

unless explicitly promoted.

---

# 42. External Systems and Provider Facts

For external systems:

```text
payment gateway
marketplace
shipping provider
GitHub
email
social platform
AI provider
```

the external provider may be authoritative for its own external state.

Example:

```text
Payment provider:
transaction acknowledged

GitHub:
CI run completed

Courier:
shipment delivered
```

Internal interpretation and business-state mutation remain governed by the relevant BisnisHub authoritative system.

---

# 43. Evidence Authority

Evidence can prove:

```text
what ran
what passed
what failed
what was approved
what was deployed
what provider returned
```

Evidence cannot independently redefine:

```text
business semantics
architecture
permission policy
risk semantics
```

Relevant current evidence locations include:

```text
systems/mgbos/docs/engineering/mgbos-*-report.md
systems/mgbos/docs/engineering/operational-readiness.md
systems/mgbos/docs/engineering/agent-system/implementation-report.md
docs/engineering/repository-migration-*.md
CI runs
tests
migrations
```

---

# 44. Canonicalization Priority Registry

The following documents/concepts should be promoted in this order.

## Foundation — ACTIVE / Current Work

```text
DOC-001 Documentation Constitution
DOC-002 Canonical Source Map
```

## P0 — Cross-System Architecture

```text
DOC-003 Master System Blueprint
DOC-004 System Boundaries
DOC-005 Architectural Laws
```

## P1 — MGBOS Consolidation

```text
MGBOS Canonical Data Model
MGBOS Business State Machines
MGBOS Business Invariants
MGBOS Command & Event Model
```

## P1 — JARVIS Foundation

```text
JARVIS Charter
JARVIS Architecture
JARVIS Core Runtime
```

## P2 — Governance

```text
General Risk Classification
Autonomy Levels
Permission Model
Approval Policy
Evidence & Provenance Principles
```

## P2 — Digital Workforce

```text
Runtime Agent Architecture
Runtime Agent Registry
Skill Architecture
Skill Registry
Tool Architecture
Tool Registry
```

## P3 — Intelligence & Reliability

```text
Memory Architecture
Entity Identity Model
Provenance Model
Automation Architecture
Durable Workflow Model
Observability
AI Evaluation
Failure & Recovery
Business Continuity
```

## P4 — Founder Operating Layer

```text
Decision Inbox
Founder Command Center
Briefing Engine
Escalation Model
Management Cadence
Exception Queue
```

---

# 45. Canonicalization Does Not Equal Implementation

Creating:

```text
JARVIS Architecture v1.0
```

does not mean JARVIS exists operationally.

Creating:

```text
CFO Agent Contract
```

does not mean CFO Agent is running.

Creating:

```text
Backup Policy
```

does not mean backup is configured.

Therefore every canonical specification must remain distinguishable from implementation evidence.

---

# 46. Promotion Procedure

When a historical source is promoted:

```text
Identify normative content
        ↓
Compare with current reality
        ↓
Resolve contradiction
        ↓
Extract canonical semantics
        ↓
Create/update canonical source
        ↓
Create ADR if decision warrants it
        ↓
Update DOC-002
        ↓
Mark old source as provenance
```

Historical files SHOULD generally remain preserved.

They become provenance rather than operational authority.

---

# 47. Relocation Procedure

When a system moves physically:

```text
system relocation
        ↓
update docs/project-index.md
        ↓
update AGENTS routing
        ↓
update relevant CI/scripts
        ↓
update active document paths
        ↓
update DOC-002
```

Canonical IDs SHOULD survive relocation.

Example:

```text
mgbos.architecture.constitution
```

remains conceptually stable even if:

```text
systems/mgbos/
```

later becomes:

```text
systems/mgbos/
```

---

# 48. Missing Source Behavior

If DOC-002 says:

```text
PLANNED_CANONICAL
```

AI or human MUST NOT silently choose a session note and pretend a canonical source exists.

Correct behavior:

```text
canonical specification not yet established
```

Then use design inputs transparently only when necessary.

---

# 49. Authority Conflict Behavior

If two sources both appear ACTIVE and claim the same semantic ownership:

```text
AUTHORITY_CONFLICT
```

must be raised.

Do not resolve through:

```text
newer filename
longer document
higher detail
AI preference
```

Resolve through DOC-001 conflict procedure.

---

# 50. Minimum Reading Rule

A human or AI SHOULD read only the sources necessary for the current task.

Example:

```text
Task:
MGBOS payment change

Read:
AGENTS.md
docs/project-index.md
DOC-002
systems/mgbos/AGENTS.md
relevant payment specification
related ADR
engineering control plane
relevant implementation/tests
```

There is no requirement to load all BisnisHub documentation.

This reduces:

```text
context pollution
conflicting historical information
AI token cost
reasoning noise
```

---

# 51. Source Map Maintenance Trigger

DOC-002 MUST be reconsidered when any of the following occurs:

```text
system relocation
new canonical specification
document supersession
new system created
system retired
semantic ownership changes
new root governance introduced
major ADR changes authority
historical source fully promoted
```

Routine implementation that does not change authority does not require DOC-002 modification.

---

# 52. Review Cadence

Default:

```text
Monthly
```

and additionally after structural repository changes.

Missed review does not automatically invalidate DOC-002.

However because Source Map controls routing, stale paths or ownership should be corrected promptly.

---

# 53. Current High-Priority Documentation Debt

As of the repository snapshot recorded in this document, the largest documentation debts are:

```text
1. Detailed MGBOS canonical data model still depends partly on session notes.

2. Detailed MGBOS state-machine specification still depends partly on session notes.

3. MGBOS business invariants remain distributed across several canonical and implementation sources.

4. JARVIS architecture is mature as design input but not yet promoted into canonical documentation.

5. General cross-system risk/autonomy semantics are not yet separated cleanly from engineering-agent risk semantics.

6. Runtime business Agent / Skill / Tool registries do not yet exist.

7. Several future governance concepts remain only inside 27 September design discussions.
```

These debts are expected and do not invalidate current MGBOS operation.

They define the documentation work ahead.

---

# 54. Canonical Authority Summary

The current mental model is:

```text
                    BISNISHUB
                       │
          Repository Governance
                       │
        ┌──────────────┼──────────────┐
        ▼              ▼              ▼
     MGBOS          JARVIS        Other Systems
        │              │
   CANONICAL       DESIGN INPUT
   + ACTIVE        → canonicalization
   runtime              │
        │               │
        └──────┬────────┘
               ▼
       Cross-System Governance
               │
       Agents / Skills / Tools
               │
       Automation / Integrations
```

More precisely:

```text
MGBOS
→ business truth

JARVIS
→ future intelligence/orchestration authority

Engineering Control Plane
→ software-change governance

Repository Governance
→ cross-system documentation/repository authority

Business folders
→ business knowledge

catatan/
→ organizational memory and provenance
```

---

# 55. North Star

DOC-002 succeeds when a new human or AI can ask:

> “Apa source of truth untuk pembayaran?”

and navigate directly to MGBOS.

Or:

> “Siapa yang mendefinisikan bagaimana JARVIS memilih tool?”

and determine whether a canonical JARVIS Tool Architecture exists.

Or:

> “Apakah catatan 27 September tentang AI models masih authoritative?”

and answer:

> Tidak. Itu design input/time-sensitive research; model routing architecture dan operational Model Registry harus menjadi canonical sources tersendiri.

The Source Map exists so authority is **resolved, not guessed**.

---

# 56. Final Principle

> **Repository search finds information.  
> Canonical Source Map finds authority.**

BisnisHub may eventually contain thousands of files.

The number of files must never determine how difficult it is to find the truth.