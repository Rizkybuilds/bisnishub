# BisnisHub Canonical Source Map

**Status:** DRAFT → target ACTIVE  
**Version:** 1.0  
**Owner:** Rizky  
**Scope:** BisnisHub Repository  
**Document Class:** Registry / Governance  
**Last Reviewed:** 2026-09-29  
**Review Cadence:** Monthly dan setiap system relocation  
**Depends On:** `documentation-constitution.md`, `docs/project-index.md`  
**Authoritative For:** lokasi logis source of truth dan ownership dokumentasi

---

# 1. Purpose

Canonical Source Map menjawab satu pertanyaan:

> **Kalau manusia atau AI membutuhkan informasi tentang X, dokumen mana yang harus dipercaya?**

Dokumen ini tidak menggantikan specification.

Dokumen ini menunjuk ke specification yang authoritative.

---

# 2. Repository-Level Authority

| Concept | Current Canonical Source | Status |
|---|---|---|
| Active project locations | `docs/project-index.md` | ACTIVE |
| Repository documentation governance | `docs/governance/documentation-constitution.md` | TARGET ACTIVE |
| Canonical source ownership | `docs/governance/canonical-source-map.md` | TARGET ACTIVE |
| Repository organization decisions | `docs/decisions/` | ACTIVE |
| Repository migration planning | `docs/engineering/` | ACTIVE where applicable |
| Historical root architecture | `ARCHITECTURE.md` | LEGACY / HISTORICAL |
| Session history | `catatan/sesi/` | HISTORICAL |

Important:

```text
docs/project-index.md
```

menentukan **di mana sistem aktif berada**.

Canonical Source Map menentukan **di mana definisi konsep berada**.

---

# 3. MGBOS Authority

## System Identity

Canonical owner:

```text
MGBOS documentation
```

Current root:

```text
mgbos/docs/
```

Lokasi fisik masa depan mengikuti `docs/project-index.md`.

---

## Architecture Constitution

Current authoritative source:

```text
mgbos/docs/architecture/README.md
```

Status:

```text
ACTIVE
```

Catatan:

Sebagian konten masih mereferensikan source notes lama.

Long-term, seluruh aturan normative harus dipromosikan keluar dari `catatan/sesi/`.

---

## Canonical Data Model

Current state:

```text
catatan/sesi/2026-09-23 - MGBOS 0.2...
catatan/sesi/2026-09-23 - MGBOS 0.2.1...
```

masih menjadi historical design input yang direferensikan architecture.

Target canonical owner:

```text
MGBOS / specifications / canonical-data-model
```

Migration required:

```text
YES
```

---

## Business State Machines

Current design source:

```text
catatan/sesi/2026-09-23 - MGBOS 0.3 — Business State Machines.md
```

Target canonical owner:

```text
MGBOS / specifications / state-machines
```

Migration required:

```text
YES
```

---

## Business Invariants

Current sources tersebar di:

```text
mgbos/docs/architecture/
mgbos/AGENTS.md
domain implementation
database constraints
session specifications
```

Target:

```text
single canonical business-invariants specification
```

Migration priority:

```text
HIGH
```

---

## Engineering Control Plane

Canonical source:

```text
mgbos/docs/engineering/agent-system/
```

Status:

```text
ACTIVE
```

Includes:

```text
workflow
roles
permission matrix
risk classification
evidence model
release gates
behavioral eval baseline
```

Historical design input:

```text
catatan/sesi/2026-09-27 - MGBOS Control Plane.md
```

The session note MUST NOT override current Engineering Control Plane documentation.

---

## Operational Readiness

Canonical source:

```text
mgbos/docs/engineering/operational-readiness.md
```

Status:

```text
ACTIVE REGISTER
```

A missing verification in this register means:

```text
NOT VERIFIED
```

not necessarily:

```text
DOES NOT EXIST
```

---

# 4. JARVIS Authority

Current state:

JARVIS has mature design notes but does not yet have a fully promoted canonical documentation tree.

Therefore current 27 September notes are:

```text
DESIGN INPUT
```

not permanent runtime authority.

---

## JARVIS Vision / Charter

Current source:

```text
catatan/sesi/2026-09-27 - JARVIS Architecture v0.1.md
```

Target canonical:

```text
JARVIS / docs / charter
```

Priority:

```text
P0
```

---

## JARVIS Architecture

Current source:

```text
catatan/sesi/2026-09-27 - JARVIS Architecture v0.1.md
```

Target canonical:

```text
JARVIS / docs / architecture
```

Priority:

```text
P0
```

---

## JARVIS Runtime

Current source:

```text
catatan/sesi/2026-09-27 - JARVIS v0.2 - Core Runtime Specification.md
```

Target canonical:

```text
JARVIS / docs / runtime
```

Priority:

```text
P0
```

---

## JARVIS Architectural Laws

Current source:

```text
JARVIS Architecture v0.1
Section: Architectural Laws
```

Target canonical owner:

```text
root/system architecture governance
```

Reason:

Laws tersebut mempengaruhi JARVIS, agents, skills, tools, dan MGBOS interaction.

Priority:

```text
P0
```

---

## JARVIS Model Routing

Current design input:

```text
2026-09-27 - Chat GPT Sesi Model AI.md
```

Canonical principle:

```text
provider-neutral model profiles
```

Names of specific commercial models are NOT canonical architecture.

Target canonical:

```text
JARVIS / model-routing
```

Model Registry akan menjadi operational registry terpisah.

---

# 5. Agent Authority

Ada dua agent systems berbeda.

Mereka MUST NOT disatukan secara konseptual.

---

## Engineering Agents

Canonical owner:

```text
.agents/
+
mgbos/docs/engineering/agent-system/
```

Function:

```text
develop
review
test
audit
release
maintain software
```

Examples:

```text
Planner
Engineer
Auditor
QA
Release Operator
```

---

## Runtime Business Agents

Examples:

```text
CFO Agent
COO Agent
CMO Agent
Sales Agent
Procurement Agent
Content Agent
```

Current canonical status:

```text
NOT YET ESTABLISHED
```

Target owner:

```text
JARVIS runtime agent system
```

Session brainstorming must not be treated as runtime registration.

---

# 6. Skill Authority

## Engineering Skills

Current canonical library:

```text
.agents/skills/
```

Purpose:

```text
repository engineering workflows
```

---

## Runtime Business Skills

Target examples:

```text
analyze_cashflow
compare_vendor
qualify_lead
prepare_campaign
forecast_inventory
```

Current canonical location:

```text
NOT YET ESTABLISHED
```

Target ownership:

```text
JARVIS runtime skill system
```

These MUST remain conceptually distinct from repository engineering skills.

---

# 7. Tool Authority

Current JARVIS tool architecture exists primarily as design documentation.

Target canonical ownership:

```text
JARVIS Tool Registry
```

Naming convention:

```text
system.resource.action
```

Examples:

```text
mgbos.order.read
mgbos.vendor.read
mgbos.payment.record
github.pull_request.read
email.message.send
social.content.publish
```

Provider implementation is secondary.

Capability identity is primary.

---

# 8. Risk & Autonomy Authority

Current design sources:

```text
JARVIS Architecture v0.1
Governance & Operations Blueprint
MGBOS Engineering Control Plane
```

There are overlapping use cases.

Therefore root governance should own the **general semantic definition**.

Target:

```text
docs/governance/risk-classification.md
docs/governance/autonomy-levels.md
```

Canonical risk levels:

```text
R0 Informational
R1 Read-only
R2 Reversible low-impact
R3 Significant operational
R4 Sensitive/high-impact
R5 Money/security/production critical
```

Canonical autonomy levels:

```text
L0 Observe
L1 Recommend
L2 Prepare
L3 Execute with approval
L4 Execute automatically within policy
```

System-specific docs may define how these levels apply, but MUST NOT redefine their meaning.

---

# 9. Permission Authority

General permission semantics:

```text
root governance
```

System-specific permissions:

```text
owned by respective system
```

Example:

```text
General:
R5 requires stricter control.

MGBOS:
mgbos.payment.record permission semantics.

JARVIS:
which runtime agent may request it.
```

This prevents root governance from knowing unnecessary domain detail.

---

# 10. Business Truth Authority

Canonical rule:

```text
Business Transaction Truth
        ↓
MGBOS / PostgreSQL
```

Examples:

```text
invoice state
payment
order
inventory
vendor commitment
production job
shipment
ledger
```

JARVIS memory MUST NOT become authoritative for these facts.

---

# 11. Knowledge Authority

```text
Structured business fact
→ MGBOS

Repository code
→ Git

Architecture decision
→ ADR

Canonical specification
→ owned system docs

Operational procedure
→ runbook / operational standard

Conversation history
→ session notes

AI memory
→ context

Vector index
→ retrieval optimization
```

---

# 12. Automation Authority

n8n and other workflow engines are:

```text
ORCHESTRATION RUNTIME
```

not:

```text
SYSTEM OF RECORD
```

Canonical automation definitions should eventually be represented through:

```text
Automation Registry
Workflow Contract
Trigger
Inputs
Outputs
Risk
Owner
Retry Policy
Idempotency
Evidence
```

---

# 13. Governance & Operations Authority

Design input currently exists in:

```text
2026-09-27 - Governance & Operations Blueprint.md
```

Important concepts requiring promotion:

```text
identity & authority
risk
approval
secrets
environment governance
AI eval
AI cost governance
observability
audit trail
failure/recovery
privacy
human accountability
autonomy promotion
kill switch
agent lifecycle
tool lifecycle
business continuity
model independence
command center
```

They MUST NOT remain permanently dependent on session notes.

---

# 14. Infrastructure Authority

Current design input:

```text
2026-09-27 - Chat GPT sesi INFRASTRUCTURE
```

Status:

```text
RESEARCH / DESIGN INPUT
```

Cloud/VPS/provider recommendations are time-sensitive.

Canonical infrastructure documentation should define:

```text
architecture
responsibility
environment
recovery
security
deployment boundaries
```

without making temporary vendor recommendations architectural law.

Provider selections should use ADRs where appropriate.

---

# 15. Historical Sources

The following categories are never automatically authoritative:

```text
catatan/sesi/
legacy apps
archive/
old architecture maps
superseded roadmaps
old model recommendation tables
old implementation reports
```

They remain valuable for provenance.

---

# 16. Current Promotion Backlog

Priority P0:

```text
Documentation Constitution
Canonical Source Map
Master System Blueprint
System Boundaries
Architectural Laws
JARVIS Charter
JARVIS Architecture
JARVIS Core Runtime
Risk Classification
Autonomy Levels
```

Priority P1:

```text
MGBOS Canonical Data Model
MGBOS State Machines
MGBOS Business Invariants
Permission Model
Approval Policy
Agent Architecture
Skill Architecture
Tool Architecture
Evidence Model
```

Priority P2:

```text
Memory Architecture
Provenance Model
Entity Identity Model
Automation Architecture
Observability
AI Evals
Failure & Recovery
Business Continuity
```

Priority P3:

```text
Advanced Agent Registry
Model Registry
Cost Governance
AI Release Lifecycle
Knowledge Lifecycle
Founder Command Center
Advanced Runbooks
```

---

# 17. Migration Rule

Promoting a session note follows:

```text
Session Note
    ↓
Extract normative decisions
    ↓
Compare with current implementation
    ↓
Resolve contradictions
    ↓
Create canonical specification
    ↓
Add ADR where necessary
    ↓
Update Canonical Source Map
    ↓
Mark source as historical/promoted
```

Do NOT simply move the file and call it canonical.

---

# 18. Relocation Rule

Repository migration is currently active.

Therefore logical ownership matters more than temporary physical path.

If:

```text
mgbos/
```

later relocates, its canonical documentation ownership remains MGBOS.

The same PR MUST update:

```text
docs/project-index.md
canonical references
relevant AGENTS instructions
CI paths
```

---

# 19. Source Selection Algorithm

When a human or AI needs an answer:

```text
1. Identify concept.
2. Check Canonical Source Map.
3. Open ACTIVE source.
4. Check dependencies/ADR.
5. Verify implementation evidence if needed.
6. Use historical notes only for context.
```

If canonical source does not exist:

```text
state that the concept is not yet canonical
```

rather than silently promoting a session note.

---

# 20. North Star

Target akhir:

```text
Question
   ↓
Canonical Source Map
   ↓
One authoritative document
   ↓
Clear implementation/evidence
```

Bukan:

```text
Question
↓
search 371 markdown files
↓
guess which one is current
```

Canonical Source Map merupakan indeks authority, bukan sekadar indeks file.