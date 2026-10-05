---
canonical_id: docs.governance.canonical-source-map
status: ACTIVE
version: 1.3
owner: Rizky
author: OpenAI / ChatGPT
approver: Rizky
scope: repository
document_class: canonical-registry
effective_from: 2026-10-03

authoritative_for:
  - canonical source routing
  - semantic ownership routing
  - documentation authority lookup
  - repository authority boundaries
  - business-versus-system documentation boundaries
  - engineering-control documentation routing
  - vibe engineering source routing
  - vibe engineering continuity checkpoint routing
  - transitional documentation tracking
  - canonicalization backlog

last_reviewed: 2026-10-05
review_cadence: monthly

depends_on:
  - documentation-constitution.md
  - ../project-index.md
  - ../engineering/repository-layout.md
  - ../decisions/001-repository-organization.md

supersedes:
  - docs.governance.canonical-source-map@1.2

repository_snapshot: f767fd141513d4c8761ab0fc05be34736fa0f5ab
---

# DOC-002 — BisnisHub Canonical Source Map v1.3

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
when current reality must be verified
```

---

# 2. Constitutional Dependency

Source Map tunduk pada:

```text
docs/governance/documentation-constitution.md
```

Jika terjadi konflik:

```text
DOCUMENTATION CONSTITUTION
>
CANONICAL SOURCE MAP
>
LOWER-LEVEL DOCUMENTATION
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

# 3. Core Law

> **One normative concept, one canonical semantic owner per scope.**

Dua dokumen dapat sama-sama canonical jika scope-nya berbeda.

Contoh:

```text
TeeStock Pricing Framework
→ TeeStock commercial pricing policy

MGBOS Quote Model
→ transactional quote representation
```

Keduanya tidak bersaing karena semantic ownership berbeda.

---

# 4. Authority Is Claim-Specific

Tidak ada satu file yang authoritative untuk semua hal.

Contoh:

```text
Git repository
→ source revision truth

MGBOS
→ transactional business-system truth

TeeStock business docs
→ TeeStock business strategy

GitHub Actions
→ observed CI execution result

canonical architecture
→ intended architecture

Vibe Engineering
→ AI-assisted engineering operating procedure
```

Authority selalu mengikuti claim.

---

# 5. Search Does Not Determine Authority

Search dapat menemukan informasi.

Search tidak menentukan siapa pemilik kebenaran.

Jangan menentukan authority berdasarkan:

```text
search ranking
file length
file age
folder depth
latest chat
AI confidence
retrieval mechanism
```

---

# 6. Source Classification

Repository menggunakan classification berikut:

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

# 7. CANONICAL

Current normative authority dalam scope yang dinyatakan.

Contoh:

```text
docs/governance/documentation-constitution.md
```

untuk documentation governance.

---

# 8. TRANSITIONAL_AUTHORITY

Legacy atau historical source yang masih memegang material normatif karena canonical replacement belum lengkap.

Ini merupakan:

```text
DOCUMENTATION DEBT
```

dan harus dikurangi secara bertahap.

---

# 9. OPERATIONAL_REGISTRY

Mencatat current inventory, routing, configuration, atau runtime/governance registry.

Contoh:

```text
docs/project-index.md
.agents/routing/
.agents/expertise/registry.yaml
.agents/capabilities/
.agents/continuity/checkpoint.yaml
```

Registry authoritative untuk data registry yang menjadi tanggung jawabnya.

Ia tidak otomatis menjadi architecture law.

---

# 10. EVIDENCE

Membuktikan sesuatu yang diamati atau dieksekusi.

Contoh:

```text
test result
CI run
Engineering Report
Assurance Report
Verification Matrix
implementation report
deployment evidence
runtime observation
```

Evidence tidak otomatis mengubah intended architecture.

---

# 11. PLANNED_CANONICAL

Semantic owner sudah diketahui tetapi canonical source belum tersedia atau belum dipersist.

Kategori ini harus digunakan hati-hati.

Planned canonical source:

```text
≠
current authority
```

---

# 12. DESIGN_INPUT

Research, brainstorming, proposal, atau architectural exploration.

Tidak authoritative sampai dipromosikan melalui governance.

---

# 13. HISTORICAL

Dipertahankan untuk:

```text
provenance
decision history
rationale
forensics
```

Tidak mengatur current behavior.

---

# 14. LEGACY

Source dari architecture/runtime lama yang masih mungkin memiliki consumer atau nilai migrasi.

Tidak boleh mengalahkan active canonical replacement.

---

# 15. ARCHIVED

Retired reference.

Tidak mempunyai current normative authority.

---

# 16. Fundamental Routing Rule

Saat mencari authority:

```text
1. Resolve the semantic owner.

2. Read the CANONICAL source.

3. Read OPERATIONAL_REGISTRY
   when current configuration/routing is relevant.

4. Read implementation/runtime EVIDENCE
   when current behavior must be verified.

5. Consult DESIGN_INPUT / HISTORICAL
   only for rationale or unpromoted context.
```

---

# 17. Intended Truth vs Current Truth

Canonical documentation biasanya menjawab:

```text
WHAT SHOULD BE TRUE?
```

Implementation/runtime evidence menjawab:

```text
WHAT IS CURRENTLY OBSERVED?
```

Jika berbeda:

```text
DOCUMENTATION_DRIFT
```

atau:

```text
IMPLEMENTATION_DRIFT
```

harus diidentifikasi.

Jangan diam-diam memilih salah satunya.

---

# 18. Repository Authority Domains

BisnisHub memiliki empat authority domains utama:

```text
ROOT GOVERNANCE

BUSINESS KNOWLEDGE

SYSTEM SEMANTICS

ENGINEERING CONTROL
```

Vibe Engineering berada di dalam:

```text
ENGINEERING CONTROL
```

bukan authority domain kelima.

---

# 19. Root Governance

Physical location:

```text
docs/
```

Owns:

```text
cross-system governance
cross-system architecture
repository standards
repository navigation
operating model
roadmaps
repository decisions
```

---

# 20. Business Knowledge

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
business operating requirements
finance policy
marketing
legal/IP business requirements
business roadmap
business KPIs
experiments
```

---

# 21. System Semantics

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
system-specific operational procedures
```

---

# 22. Engineering Control

Primary locations:

```text
docs/engineering/
.agents/
system-specific engineering documentation
```

Owns:

```text
software planning governance
engineering roles
engineering routing
implementation workflow
bounded execution
engineering evidence
review
testing
release preparation
provider/runtime adaptation
AI-assisted engineering procedure
```

It does not own business truth.

---

# 23. Repository-Level Canonical Sources

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
| Engineering AI Control Plane | Repository Engineering | `docs/engineering/engineering-ai-control-plane.md` |
| Runtime-adapter architecture | Repository Engineering | `docs/engineering/runtime-adapter-architecture.md` |
| Vibe Engineering operating method | Repository Engineering | `docs/engineering/vibe-engineering/` |
| Vibe continuity checkpoint | Repository Engineering | `.agents/continuity/checkpoint.yaml` |
| Solo-Founder operating model | Repository Operating Model | `docs/operating-model/solo-founder-operating-system.md` |
| Solo-Founder launch roadmap | Repository Roadmap | `docs/roadmaps/solo-founder-launch-roadmap.md` |

---

# 24. Active System Locations

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

# 25. Active Location Is Not Semantic Authority

Knowing:

```text
systems/mgbos/
```

is the MGBOS workspace does not by itself answer:

```text
which MGBOS document owns payment state?
```

Use system-level canonical routing after locating the workspace.

---

# 26. Engineering Control Plane

Canonical source:

```text
docs/engineering/engineering-ai-control-plane.md
```

Owns repository-wide engineering semantics including:

```text
canonical engineering roles
role boundaries
engineering expertise model
routing principles
bounded execution
assurance model
runtime-adapter principles
engineering autonomy boundaries
```

---

# 27. Engineering Runtime Adapter Architecture

Canonical source:

```text
docs/engineering/runtime-adapter-architecture.md
```

Owns:

```text
provider/runtime adaptation
provider-neutral engineering interface direction
adapter boundary
runtime translation responsibilities
```

Provider-specific instructions MUST NOT override Control Plane policy.

---

# 28. Engineering Execution Contracts

Canonical contract semantics and schemas live under:

```text
.agents/contracts/
```

Primary source:

```text
.agents/contracts/README.md
```

Canonical machine schemas include:

```text
implementation-contract.schema.json
work-package.schema.json
engineering-report.schema.json
assurance-report.schema.json
verification-matrix.schema.json
release-packet.schema.json
```

---

# 29. Contract Artifact Responsibilities

Canonical chain:

```text
Implementation Contract
→ intended engineering work

Work Package
→ bounded writer slice

Engineering Report
→ actual implementation evidence

Assurance Report
→ review / residual-risk evidence

Verification Matrix
→ acceptance-to-evidence verification

Release Packet
→ release-preparation readiness
```

Vibe Engineering consumes this chain.

It does not redefine it.

---

# 30. Engineering Routing

Operational routing authority:

```text
.agents/routing/README.md
.agents/routing/task-types.yaml
```

These own current:

```text
routing profiles
task types
concerns
role composition
expertise composition
assurance composition
stop conditions
```

---

# 31. Current Routing Profile Reality

At repository snapshot:

```text
26871da802706fba5bc033576fbb0a487f6c9255
```

the currently active registered routing profile is:

```text
mgbos
→ systems/mgbos/
```

This is a current registry observation.

It is not a permanent Source Map law.

Always re-read the current routing registry when routing matters.

---

# 32. Unsupported Routing Target

A system without an active matching profile MUST NOT borrow another profile merely because one exists.

Example:

```text
repository-engineering
≠
mgbos profile
```

unless canonical routing explicitly establishes that mapping.

Vibe Engineering defines the procedure for handling this condition.

Routing registry owns actual profile availability.

---

# 33. Engineering Roles

Canonical role semantics are owned by:

```text
docs/engineering/engineering-ai-control-plane.md
.agents/roles/contracts.json
```

Current canonical engineering roles include:

```text
planner
engineer
auditor
qa
release-operator
```

---

# 34. Head and Builder Are Not Canonical Roles

Vibe Engineering uses:

```text
HEAD_FUNCTION
BUILDER_FUNCTION
```

as operating functions.

They MUST NOT replace canonical roles.

Current runtime mapping may commonly be:

```text
HEAD_FUNCTION
→ ChatGPT

BUILDER_FUNCTION
→ Antigravity
```

but provider/runtime identity is not policy authority.

---

# 35. Engineering Expertise

Operational expertise registry:

```text
.agents/expertise/registry.yaml
```

Expertise answers:

```text
what specialist knowledge is needed?
```

It does not grant permission or authority.

---

# 36. Engineering Skills

Project-owned reusable engineering procedures live under:

```text
.agents/skills/
```

Skill authority is procedural.

A skill does not become:

```text
business authority
permission
approval
release authority
```

---

# 37. Engineering Capabilities

Current engineering capability/permission registry lives under:

```text
.agents/capabilities/
```

Primary navigation:

```text
.agents/capabilities/README.md
```

Tool presence does not grant capability permission.

Capability permission does not automatically grant business authority.

---

# 38. Engineering Runtime Gateway

Current engineering gateway material lives under:

```text
.agents/gateway/
tools/engineering_gateway/
```

Gateway implementation is:

```text
implementation / enforcement
```

not semantic owner for repository-wide policy unless explicitly designated.

---

# 39. Vibe Engineering

Canonical location:

```text
docs/engineering/vibe-engineering/
```

Classification:

```text
CANONICAL ENGINEERING OPERATING METHOD
```

Vibe Engineering answers:

> **How should the Owner, Head function, Builder, canonical roles, engineering contracts, evidence, assurance, PR audit, remediation, and post-merge reflection be orchestrated as one human-directed AI engineering workflow?**

---

# 40. Vibe Engineering Boundary

Vibe Engineering owns procedure.

It does **not** own upstream semantics for:

```text
risk
canonical roles
routing enums
task types
concerns
permission
approval
assurance enums
verification enums
release recommendation
contract schema
system architecture
business truth
```

Those remain owned by their respective canonical sources.

---

# 41. Vibe Engineering Source Family

Canonical Vibe document family:

```text
docs/engineering/vibe-engineering/README.md

docs/engineering/vibe-engineering/operating-model.md

docs/engineering/vibe-engineering/state-and-vocabulary.md

docs/engineering/vibe-engineering/session-protocol.md

docs/engineering/vibe-engineering/change-package-template.md

docs/engineering/vibe-engineering/implementation-contract-template.md

docs/engineering/vibe-engineering/pr-audit-protocol.md

docs/engineering/vibe-engineering/remediation-protocol.md

docs/engineering/vibe-engineering/post-merge-reflection.md
```

---

# 42. Vibe README Authority

Canonical source:

```text
docs/engineering/vibe-engineering/README.md
```

Owns:

```text
Vibe Engineering navigation
operating-method boundary
document responsibility map
method applicability
routing-profile boundary
```

It does not own upstream Control Plane semantics.

---

# 43. Vibe Operating Model Authority

Canonical source:

```text
docs/engineering/vibe-engineering/operating-model.md
```

Owns:

```text
Owner → Head → Builder operating relationship
end-to-end Vibe procedure
One Active Role interpretation
planning / implementation / assurance / verification sequence
reflection-to-plan loop
```

---

# 44. Vibe Vocabulary Authority

Canonical source:

```text
docs/engineering/vibe-engineering/state-and-vocabulary.md
```

Owns only:

```text
VE_SESSION.*
VE_PHASE.*
VE_CONTINUITY.*
VE_STOP.*
VE_POST_MERGE.*
VE_OBJECTIVE.*
VE_ROADMAP.*
HEAD_FUNCTION
BUILDER_FUNCTION
Vibe-local coordination vocabulary
```

It MUST NOT redefine upstream formal vocabulary.

---

# 45. Vibe Session Protocol Authority

Canonical source:

```text
docs/engineering/vibe-engineering/session-protocol.md
```

Owns:

```text
session start
continuation
context restoration
long-gap recovery
Owner command interpretation
session handoff
session closure
```

---

# 46. Vibe Change Package Authority

Canonical source:

```text
docs/engineering/vibe-engineering/change-package-template.md
```

Owns:

```text
VECP coordination format
reflection-to-plan
planning readiness
Owner decision packaging
planning-to-contract handoff
```

Change Package is not a machine execution contract.

---

# 47. Vibe Implementation Contract Authoring Authority

Canonical procedure:

```text
docs/engineering/vibe-engineering/implementation-contract-template.md
```

Owns:

```text
how Vibe prepares Implementation Contract
how Vibe prepares Work Package
semantic validation expectations
Builder startup handoff
```

Actual schema semantics remain owned by:

```text
.agents/contracts/
```

---

# 48. Vibe PR Audit Authority

Canonical runbook:

```text
docs/engineering/vibe-engineering/pr-audit-protocol.md
```

Owns:

```text
exact PR-head audit procedure
scope-drift review
pre-merge evidence review
self-modifying-evidence review
Owner merge-consideration handoff
```

Formal Assurance Report semantics remain upstream.

---

# 49. Vibe Remediation Authority

Canonical runbook:

```text
docs/engineering/vibe-engineering/remediation-protocol.md
```

Owns:

```text
defect-to-correction workflow
remediation baseline
risk/assurance inheritance
sibling defect review
bounded correction
post-remediation re-audit
```

---

# 50. Vibe Post-Merge Authority

Canonical runbook:

```text
docs/engineering/vibe-engineering/post-merge-reflection.md
```

Owns:

```text
merge confirmation procedure
integration revision verification
current-main interference review
post-merge Vibe result
reflection-to-plan
package closure
```

It does not own deployment/runtime truth.

---

# 50A. Vibe Continuity Checkpoint Authority

Canonical continuity artifact:

```text
.agents/continuity/checkpoint.yaml
```

Classification:

```text
OPERATIONAL_REGISTRY
+
EVIDENCE / COORDINATION CHECKPOINT
```

Authoritative for:

```text
what the last persisted continuity snapshot recorded
```

Boundary:

It is authoritative only for:

> **what the last persisted continuity snapshot recorded**

not:

> **what the repository currently is**

Actual repository and GitHub evidence remains stronger.

The continuity checkpoint accelerates session restoration and context recovery. It does NOT own canonical risk, roles, permissions, approval, architecture, business truth, contract schemas, or release state.

---

# 51. Vibe Engineering Does Not Replace Control Plane

Canonical relationship:

```text
ENGINEERING AI CONTROL PLANE
defines engineering governance semantics

        ↓

ROUTING / CONTRACTS / CAPABILITIES
define operational engineering controls

        ↓

VIBE ENGINEERING
defines human-directed operating procedure

        ↓

PROVIDER / RUNTIME
executes within those controls
```

---

# 52. Vibe Engineering Activation Condition

Vibe Engineering is considered repository-integrated only when:

```text
all nine canonical Vibe files are persisted
+
this Source Map routes to them
+
repository navigation links to them
+
root agent instructions route material engineering work to them
+
repository validation remains healthy
```

A partial file copy MUST NOT be treated as full operational activation.

---

# 53. Partial Vibe Activation

If only some Vibe files are present:

```text
DO NOT
infer missing procedure
```

Fall back to the upstream canonical:

```text
Engineering AI Control Plane
routing registry
contract schemas
capability governance
system-specific engineering docs
```

until the method is fully integrated.

---

# 54. Vibe ACTIVE Does Not Mean Machine-Enforced

`status: ACTIVE` means the document is current normative procedure in its declared scope.

It does not mean every rule has automatic validator/runtime enforcement.

Distinguish:

```text
DOCUMENTED OPERATING METHOD
```

from:

```text
MACHINE ENFORCEMENT
```

---

# 55. Root AGENTS.md

Root:

```text
AGENTS.md
```

is an agent-facing instruction projection.

It provides:

```text
repository navigation
engineering entrypoints
workspace restrictions
agent/skill guidance
```

It is not the semantic owner for concepts already governed by canonical docs.

If AGENTS conflicts with canonical governance:

```text
CANONICAL GOVERNANCE
WINS
```

and AGENTS should be corrected.

---

# 56. Project Index

Canonical navigation source:

```text
docs/project-index.md
```

Owns:

```text
active project locations
top-level repository navigation
primary authority links
```

It should route engineering users to:

```text
Engineering AI Control Plane
Vibe Engineering
```

after Vibe activation.

---

# 57. Repository Layout

Canonical source:

```text
docs/engineering/repository-layout.md
```

Owns:

```text
directory ownership
workspace placement
archive boundaries
repository physical-structure rules
```

Source Map should not redefine directory layout.

---

# 58. MGBOS Semantic Ownership

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

# 59. MGBOS System of Record

Foundational authority:

```text
systems/mgbos/docs/adr/002-postgresql-system-of-record.md
```

Canonical principle:

> **PostgreSQL through MGBOS owns authoritative transactional business truth for MGBOS-controlled domains.**

The following MUST NOT become competing system of record:

```text
JARVIS Memory
n8n
spreadsheet
LLM output
frontend state
WhatsApp message
```

---

# 60. MGBOS Documentation Index

Canonical navigation:

```text
systems/mgbos/docs/README.md
```

Classification:

```text
CANONICAL NAVIGATION
```

It routes MGBOS readers to architecture, implementation, engineering, evidence, ADRs, and runbooks.

---

# 61. MGBOS Architecture Index

Canonical navigation:

```text
systems/mgbos/docs/architecture/README.md
```

Classification:

```text
CANONICAL ARCHITECTURE NAVIGATION
```

Dedicated architecture specifications own actual semantics.

---

# 62. MGBOS Canonical Architecture Sources

Current dedicated canonical specifications include:

```text
systems/mgbos/docs/architecture/canonical-data-model.md

systems/mgbos/docs/architecture/business-state-machines.md

systems/mgbos/docs/architecture/business-invariants.md

systems/mgbos/docs/architecture/command-event-model.md

systems/mgbos/docs/architecture/permission-authorization-model.md

systems/mgbos/docs/architecture/domain-map-capability-ownership.md
```

Classification:

```text
CANONICAL
```

within their declared scopes.

---

# 63. MGBOS Domain Map

Canonical source:

```text
systems/mgbos/docs/architecture/domain-map-capability-ownership.md
```

This file is present in the repository snapshot used for Source Map v1.2.

Any other active documentation stating that this file is not yet persisted is stale and must be corrected.

---

# 64. Historical MGBOS Design Notes

Earlier MGBOS design notes remain:

```text
HISTORICAL
/
DESIGN PROVENANCE
```

for concepts already promoted to dedicated canonical specifications.

They MUST NOT override current canonical architecture.

---

# 65. MGBOS Implementation Evidence

Files such as:

```text
systems/mgbos/docs/engineering/mgbos-*-report.md
```

are:

```text
EVIDENCE
```

They prove implementation observations for particular revisions.

They do not own MGBOS business semantics.

---

# 66. MGBOS Product Documentation

Current location:

```text
systems/mgbos/docs/product/
```

Owns:

```text
MGBOS application/product requirements
screen behavior
pilot UX
product implementation specification
```

It does not replace business strategy under:

```text
bisnis/
```

---

# 67. MGBOS Implementation Documentation

Canonical implementation-planning location:

```text
systems/mgbos/docs/implementation/
```

Owns:

```text
bounded implementation planning
phase implementation plans
current implementation audits
implementation sequencing
```

It does not own long-term architecture semantics.

---

# 68. Phase 1 Operating Spine

Canonical implementation entrypoint:

```text
systems/mgbos/docs/implementation/phase-1-operating-spine/README.md
```

Current audit:

```text
systems/mgbos/docs/implementation/phase-1-operating-spine/current-operating-spine-audit.md
```

These should be interpreted as implementation planning/evidence according to their own metadata.

---

# 69. MGBOS Engineering Documentation

Location:

```text
systems/mgbos/docs/engineering/
```

Owns system-specific engineering procedure and evidence.

Repository-wide engineering semantics still come from:

```text
docs/engineering/
.agents/
```

System-specific rules may be stricter.

They may not weaken repository governance.

---

# 70. MGBOS Release & Recovery

Canonical runbook:

```text
systems/mgbos/docs/runbooks/release-and-recovery.md
```

Owns MGBOS-specific release and recovery procedure.

Vibe post-merge procedure MUST NOT redefine it.

---

# 71. JARVIS Current Authority

Canonical JARVIS documentation lives under:

```text
systems/jarvis/docs/
```

JARVIS specification status does not prove runtime implementation.

---

# 72. JARVIS Primary Canonical Sources

Primary sources include:

```text
systems/jarvis/docs/charter.md

systems/jarvis/docs/architecture.md

systems/jarvis/docs/core-runtime.md
```

Classification:

```text
CANONICAL SPECIFICATION
```

within their declared scopes.

---

# 73. JARVIS Architecture Sources

Canonical architecture lives under:

```text
systems/jarvis/docs/architecture/
```

Current sources include:

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
command-center-decision-experience.md
integration-api-interoperability.md
canonical-index-implementation-readiness.md
```

---

# 74. Correct JARVIS Command-Center Path

Canonical path:

```text
systems/jarvis/docs/architecture/command-center-decision-experience.md
```

Not:

```text
command-center-experience.md
```

---

# 75. Correct JARVIS Integration Path

Canonical path:

```text
systems/jarvis/docs/architecture/integration-api-interoperability.md
```

Not:

```text
integration-and-interoperability.md
```

---

# 76. JARVIS Specification Is Not Runtime Evidence

A JARVIS document may be:

```text
ACTIVE
```

while the runtime component is:

```text
NOT_IMPLEMENTED
```

or:

```text
PARTIALLY_IMPLEMENTED
```

Never infer runtime existence from documentation status.

---

# 77. Historical JARVIS Notes

Earlier session notes under:

```text
catatan/
```

are primarily:

```text
HISTORICAL
DESIGN_INPUT
```

for concepts already promoted.

They remain useful for rationale.

They do not override canonical JARVIS specifications.

---

# 78. Engineering Agents vs JARVIS Agents

`.agents/` owns:

```text
software engineering roles
engineering Skills
engineering routing
engineering contracts
```

JARVIS Agent Registry owns:

```text
runtime business/intelligence agents
```

These are different systems.

A similar role name does not create shared authority.

---

# 79. TeeStock Business Authority

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
legal/IP policy
metrics
experiments
business roadmap
```

---

# 80. TeeStock Scope Is Bounded

A TeeStock document may be:

```text
CANONICAL
```

within:

```text
TEESTOCK BUSINESS SCOPE
```

without becoming globally canonical for MGBOS or JARVIS.

---

# 81. Business Truth vs System Truth

Canonical distinction:

```text
TEESTOCK
"What business are we trying to run?"

MGBOS
"How are governed operational facts,
transactions and states represented?"

JARVIS
"What does that current reality mean
and what deserves attention?"
```

---

# 82. TeeStock `11-data-mgbos`

Current directory:

```text
bisnis/teestock/11-data-mgbos/
```

contains business-domain requirements and integration concepts.

Interpret its authority as:

```text
TEESTOCK BUSINESS DATA REQUIREMENTS
/
SYSTEM REQUIREMENTS
```

not:

```text
canonical MGBOS implementation
```

---

# 83. TeeStock Data Model

Current source:

```text
bisnis/teestock/11-data-mgbos/canonical-data-model.md
```

is authoritative for:

```text
TeeStock conceptual business-domain requirements
```

It is NOT authoritative for:

```text
MGBOS physical database schema
MGBOS shared state-machine semantics
MGBOS system invariants
MGBOS transaction implementation
```

---

# 84. TeeStock Event Model

Current source:

```text
bisnis/teestock/11-data-mgbos/event-model.md
```

defines:

```text
TeeStock business-event requirements / candidates
```

Actual MGBOS command/event semantics are owned by:

```text
systems/mgbos/docs/architecture/command-event-model.md
```

---

# 85. TeeStock MGBOS Integration

Current source:

```text
bisnis/teestock/11-data-mgbos/mgbos-integration.md
```

owns TeeStock-side integration requirements.

It does not replace MGBOS architecture.

---

# 86. TeeStock Transactional State Conflict

If TeeStock business documents describe simplified states for MGBOS-owned transactional entities:

```text
Lead
Order
Payment
Production
```

MGBOS canonical state-machine semantics win for governed transactional state.

TeeStock may preserve:

```text
business shorthand
journey stage
commercial milestone
```

when clearly distinguished.

---

# 87. TeeStock Roadmap

Current quarter business execution authority:

```text
bisnis/teestock/14-roadmap/current-quarter.md
```

within its defined time window.

Business roadmap does not certify software implementation.

---

# 88. MultiGraph Business Knowledge

MultiGraph business documentation lives under:

```text
bisnis/multigraph/
```

and owns MultiGraph-specific business knowledge within its declared scope.

It does not redefine shared MGBOS architecture.

---

# 89. RizkyBuild Business Knowledge

RizkyBuild business/research documentation lives under:

```text
bisnis/rizkybuild/
```

Classification follows each document's metadata.

Research is not automatically canonical operating policy.

---

# 90. `catatan/` Authority

Default classification:

```text
DESIGN_INPUT
HISTORICAL
RESEARCH
SESSION MEMORY
```

A session note does not become canonical merely because its design is good.

---

# 91. Promotion Rule

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
        ↓
UPDATE AGENT/NAVIGATION PROJECTIONS WHEN REQUIRED
```

---

# 92. Chat Draft Lifecycle

A finished draft created in chat is not automatically a repository lifecycle state.

Do **not** invent:

```text
ACTIVE-READY
```

as a document `status`.

Before repository persistence, treat the content simply as:

```text
external draft / candidate content
```

Once persisted, use only valid Documentation Constitution lifecycle states:

```text
DRAFT
REVIEW
ACTIVE
DEPRECATED
SUPERSEDED
ARCHIVED
```

---

# 93. ACTIVE Requires Repository Context

A canonical document should become `ACTIVE` only through an accepted repository change at its canonical path.

Chat completion alone does not make it active repository authority.

---

# 94. Persisted Solo-Founder Operating Model

Canonical source:

```text
docs/operating-model/solo-founder-operating-system.md
```

Classification:

```text
ACTIVE
```

within its declared operating-model scope.

---

# 95. Persisted Solo-Founder Launch Roadmap

Canonical source:

```text
docs/roadmaps/solo-founder-launch-roadmap.md
```

Classification follows its metadata.

Correct path uses:

```text
docs/roadmaps/
```

not:

```text
docs/roadmap/
```

---

# 96. Persisted MGBOS Domain Map

Canonical source:

```text
systems/mgbos/docs/architecture/domain-map-capability-ownership.md
```

The file exists in the current snapshot.

Documentation claiming otherwise is stale.

---

# 97. Persisted Phase 1 Operating-Spine Documents

Canonical implementation planning/evidence sources include:

```text
systems/mgbos/docs/implementation/phase-1-operating-spine/README.md

systems/mgbos/docs/implementation/phase-1-operating-spine/current-operating-spine-audit.md
```

Interpret according to each document's declared authority.

---

# 98. Persisted JARVIS Experience / Integration Sources

Current canonical paths include:

```text
systems/jarvis/docs/architecture/command-center-decision-experience.md

systems/jarvis/docs/architecture/integration-api-interoperability.md
```

Older incorrect path references must not be used.

---

# 99. Controlled Canonicalization

Repository state should be:

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

# 100. Controlled Canonicalization Means

We SHOULD:

```text
close known authority gaps
resolve conflicting sources
promote mature design
repair indexes
repair stale paths
create implementation docs needed by actual work
```

We SHOULD NOT:

```text
invent speculative subsystems
create empty documentation trees
create duplicate canonical owners
write future docs with no consumer
```

---

# 101. Runtime Truth vs Documentation Truth

Canonical docs define:

```text
INTENDED / GOVERNED BEHAVIOR
```

Code/runtime defines:

```text
CURRENT IMPLEMENTED BEHAVIOR
```

Conflict becomes:

```text
DOCUMENTATION_DRIFT
```

or:

```text
IMPLEMENTATION_DRIFT
```

and must be investigated.

---

# 102. Evidence Does Not Rewrite Authority

An implementation report stating:

```text
feature implemented
```

does not authorize that implementation to redefine canonical semantics.

If implementation legitimately changes architecture:

```text
update canonical source deliberately
```

through governance.

---

# 103. Git Authority

Git repository is authoritative for:

```text
source content
commit ancestry
branch revision
repository history
```

It is not authoritative for:

```text
production deployment success
physical business outcome
external provider state
```

without additional evidence.

---

# 104. GitHub CI Authority

GitHub CI is authoritative for the observed result of the specific workflow/check execution it reports.

It does not automatically prove:

```text
architecture correctness
all security properties
production health
business success
```

---

# 105. Physical Business Reality

MGBOS records governed business representation.

Some claims may still require external or physical observation.

Examples:

```text
shipment delivered
physical production completed
vendor accepted job
```

Use appropriate evidence.

---

# 106. External Providers

An external provider may be authoritative for provider-side facts.

Examples:

```text
carrier tracking
payment-provider transaction
hosting deployment status
GitHub CI execution
```

Internal business interpretation remains owned by the relevant BisnisHub system.

---

# 107. n8n Authority

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
JARVIS reasoning authority
```

---

# 108. AI Authority

AI may:

```text
classify
summarize
recommend
draft
analyze
plan
```

within governed scope.

AI output is not automatically:

```text
business truth
approval
permission
transaction
release authorization
```

---

# 109. Model Confidence

Model confidence is not an authority class.

Statements such as:

```text
I'm very confident
```

do not change evidence status.

---

# 110. Memory

AI/chat memory is contextual evidence.

It is not authoritative for current repository state.

Current repository evidence wins.

---

# 111. Source Selection — MGBOS Order Transition

Read:

```text
Documentation Constitution
Canonical Source Map
MGBOS Architecture Index
Business State Machines
Business Invariants
Command & Event Model
Permission Model
current implementation/tests
```

---

# 112. Source Selection — TeeStock Pricing Strategy

Read:

```text
TeeStock finance/commercial sources
pricing framework
unit economics
business roadmap
```

Read MGBOS quote semantics only when implementation/system impact exists.

---

# 113. Source Selection — JARVIS Morning Briefing

Read:

```text
JARVIS Charter
JARVIS Architecture
Core Runtime
Agent / Skill / Tool architecture
Evidence model
MGBOS read contracts
relevant business context
```

Do not use JARVIS Memory as transactional authority.

---

# 114. Source Selection — New AI-Assisted Engineering Work

Read minimum sufficient sources:

```text
AGENTS.md
        ↓
project / workspace navigation
        ↓
Documentation Constitution
Canonical Source Map
        ↓
Engineering AI Control Plane
Vibe Engineering
        ↓
current routing registry
contracts / capabilities
        ↓
target-system canonical sources
        ↓
actual implementation/tests
```

Do not load every document automatically.

---

# 115. Source Selection — Continue Existing Engineering Work

Read:

```text
Vibe session protocol
current repository state
current package / contract
current PR if any
current route
current evidence
```

Conversation memory is secondary.

---

# 116. Source Selection — PR Audit

Read:

```text
Vibe PR Audit Protocol
Implementation Contract
Work Package
Engineering Report
actual PR
exact PR head
target-system canonical sources
current CI
Assurance / Verification artifacts as applicable
```

---

# 117. Source Selection — Remediation

Read:

```text
Vibe Remediation Protocol
original finding
current candidate
parent Implementation Contract
current Work Package / remediation Work Package
current evidence
affected canonical sources
```

---

# 118. Source Selection — Owner Says `merged`

Read:

```text
Vibe Post-Merge Verification & Reflection
actual repository PR state
integration revision
current main
relevant CI
target-system release/runbook when applicable
```

Do not treat the message itself as merge evidence.

---

# 119. Documentation Placement Rule

Use:

```text
cross-system governance
→ docs/governance/

cross-system architecture
→ docs/architecture/

repository engineering governance
→ docs/engineering/

repository operating model
→ docs/operating-model/

cross-system roadmap
→ docs/roadmaps/

MGBOS semantics
→ systems/mgbos/docs/

JARVIS semantics
→ systems/jarvis/docs/

TeeStock business knowledge
→ bisnis/teestock/

historical discussion / notes
→ catatan/

retired material
→ archive/
```

---

# 120. Vibe Documentation Placement

Vibe Engineering belongs under:

```text
docs/engineering/vibe-engineering/
```

because it is:

```text
repository-wide engineering operating method
```

It does not belong under:

```text
systems/mgbos/
```

because it must remain provider/system-neutral.

---

# 121. Agent Projection Placement

Thin agent-facing instructions belong in:

```text
AGENTS.md
.agents/rules/
.agents/skills/
provider/runtime adapter configuration
```

as appropriate.

Those projections should reference canonical Vibe/Control Plane semantics.

They should not create a new policy fork.

---

# 122. Canonical Navigation Rule

Every important canonical document SHOULD have a parent navigation source.

Example:

```text
docs/engineering/vibe-engineering/pr-audit-protocol.md
        ↑
docs/engineering/vibe-engineering/README.md
        ↑
docs/project-index.md
        ↑
AGENTS.md
```

according to audience and routing need.

---

# 123. Navigation Does Not Create Semantic Ownership

A navigation file may link to a document.

It does not inherit that document's semantic authority.

---

# 124. Current Known Documentation Drift

Known drift at Source Map v1.2 snapshot is limited to the items below.

---

# 125. Drift — MGBOS Architecture Index

Current:

```text
systems/mgbos/docs/architecture/README.md
```

still contains historical wording indicating:

```text
domain-map-capability-ownership.md
```

was prepared but not yet present.

That statement is stale.

The file now exists.

The Architecture Index should be updated separately.

---

# 126. Drift — MGBOS Architecture Index Next-Document Claim

The same Architecture Index still describes:

```text
domain-map-capability-ownership.md
```

as the next architecture document to persist.

That is stale because the file is already present.

---

# 127. Drift — Vibe Navigation Activation

After the nine Vibe files and this Source Map are persisted, navigation still requires alignment in:

```text
docs/project-index.md
AGENTS.md
```

until those activation changes are integrated.

During the activation PR, treat this as expected bounded transitional drift.

After integration it should be resolved.

---

# 128. Current Engineering Routing Limitation

Current routing registry is MGBOS-focused.

A dedicated profile for:

```text
repository-engineering
JARVIS engineering
KasKita engineering
```

must not be assumed until actually registered.

This is a capability/routing limitation, not documentation drift.

---

# 129. TeeStock / MGBOS Authority Cleanup

TeeStock `11-data-mgbos` naming may still invite semantic confusion.

Long-term controlled cleanup remains appropriate.

Until then:

```text
TeeStock requirements
≠
MGBOS canonical architecture
```

remains the governing boundary.

---

# 130. Root README / Static Status Drift

Any documentation containing static implementation counts/status can become stale as repository implementation changes.

Current-state claims should preferably point to evidence or registries rather than hardcoded counts.

---

# 131. Documentation Drift Must Be Explicit

Known drift is not automatically a blocker for unrelated work.

But it MUST NOT silently become current authority.

---

# 132. Current Authority Model

```text
                          BISNISHUB
                              │
                 CROSS-SYSTEM GOVERNANCE
                              │
          ┌───────────────────┼───────────────────┐
          ▼                   ▼                   ▼
     BUSINESS              MGBOS               JARVIS
     KNOWLEDGE          BUSINESS TRUTH       INTELLIGENCE
          │                   │                   │
      TeeStock          transactions          reasoning
      MultiGraph        state                 planning
      others            invariants            memory
          │                   │                   │
          └───────────────────┼───────────────────┘
                              ▼
                       BUSINESS REALITY
```

Parallel engineering-control plane:

```text
ENGINEERING AI CONTROL PLANE
        │
        ├── .agents/routing
        ├── .agents/contracts
        ├── .agents/capabilities
        ├── .agents/roles
        │
        └── VIBE ENGINEERING
              ↓
        governed software work
```

---

# 133. TeeStock–MGBOS–JARVIS Mental Model

```text
TEESTOCK
defines:
"What business are we trying to run?"

        ↓

MGBOS
defines:
"What governed facts, transactions,
and operational states represent it?"

        ↓

JARVIS
defines:
"What does current reality mean
and what deserves attention?"
```

---

# 134. Engineering Mental Model

```text
OWNER
defines:
"What engineering outcome do we need?"

        ↓

CONTROL PLANE
defines:
"What governance applies?"

        ↓

VIBE ENGINEERING
defines:
"How do we run the work coherently?"

        ↓

ENGINEERING RUNTIME
implements:
"What bounded action is assigned?"

        ↓

EVIDENCE / ASSURANCE / VERIFICATION
answers:
"What actually happened and can we trust it?"
```

---

# 135. Canonical Authority Summary

```text
docs/governance/
→ cross-system governance

docs/architecture/
→ cross-system architecture

docs/engineering/
→ repository engineering governance and operating method

docs/operating-model/
→ founder / organization operating model

docs/roadmaps/
→ cross-system execution roadmap

bisnis/
→ business knowledge

systems/mgbos/
→ governed transactional business-system truth

systems/jarvis/
→ intelligence-system architecture

systems/kaskita/
→ KasKita system ownership within its workspace

.agents/
→ engineering operational registries / contracts / skills / capabilities

catatan/
→ research / session provenance / design input

archive/
→ retired sources
```

---

# 136. Source Precedence Within Engineering

When AI-assisted engineering work needs guidance:

```text
Documentation Constitution
        ↓
Canonical Source Map
        ↓
Engineering AI Control Plane
        ↓
Cross-System Risk / Approval / Evidence Governance
        ↓
Routing / Contract / Capability Registries
        ↓
Vibe Engineering Procedure
        ↓
Target-System Engineering Rules
        ↓
Provider / Runtime Adapter Instructions
```

System-specific requirements may be stricter.

They may not weaken repository governance.

---

# 137. Vibe vs `.agents`

Relationship:

```text
VIBE ENGINEERING
→ operating procedure

.agents/routing
→ operational routing

.agents/contracts
→ machine artifact semantics

.agents/capabilities
→ capability/permission model

.agents/skills
→ reusable execution procedures

.agents/continuity
→ durable verified engineering snapshot
```

None should duplicate the others.

---

# 138. Vibe vs MGBOS Agent System

MGBOS agent-system docs may add system-specific workflow requirements.

Vibe Engineering remains repository-wide procedure.

For MGBOS:

```text
Vibe Engineering
+
MGBOS engineering agent-system requirements
```

apply together.

MGBOS-specific rules may be stricter.

---

# 139. Vibe vs JARVIS Runtime Agents

Vibe Engineering coordinates software engineering.

It does not govern JARVIS business-agent runtime behavior unless a JARVIS engineering change uses the Vibe method.

JARVIS runtime semantics remain under JARVIS canonical architecture.

---

# 140. Vibe vs Business Operations

Vibe Engineering does not authorize:

```text
payment
vendor commitment
customer communication
production job
business transaction
```

merely because engineering tooling can perform them.

Business authority remains separate.

---

# 141. Source Selection by Question

Before reading files, ask:

```text
WHAT CLAIM AM I TRYING TO ESTABLISH?
```

Then route to its semantic owner.

This prevents accidental authority inflation.

---

# 142. Example — “What code is on main?”

Read:

```text
Git repository
```

not:

```text
roadmap
chat summary
implementation report
```

---

# 143. Example — “What should Order states be?”

Read:

```text
MGBOS Business State Machines
```

not:

```text
frontend implementation
TeeStock shorthand
old session note
```

---

# 144. Example — “What risk applies to this engineering change?”

Read:

```text
Cross-System Risk Classification
+
current routing composition
```

not:

```text
Vibe state-and-vocabulary
```

---

# 145. Example — “How should we continue after chat loss?”

Read:

```text
Vibe Session Protocol
```

then reconstruct repository state.

---

# 146. Example — “Can Antigravity push?”

Read:

```text
capability / permission registry
runtime adapter / actual environment
applicable approval policy
```

not:

```text
Builder label
```

---

# 147. Example — “Is this PR safe to consider for merge?”

Read:

```text
Vibe PR Audit Protocol
actual PR
exact head
contracts
evidence
assurance
verification
CI
```

Do not answer from Builder confidence alone.

---

# 148. Example — “PR was merged; are we done?”

Read:

```text
Vibe Post-Merge Verification & Reflection
repository merge evidence
current main
relevant checks
```

Then separate repository completion from deployment/runtime completion.

---

# 149. Canonicalization Backlog

Current recommended documentation/governance sequence after Source Map v1.2:

```text
1.
Activate Vibe Engineering navigation
→ docs/project-index.md
→ AGENTS.md

2.
Repair stale MGBOS Architecture Index statements
→ domain-map file is already persisted

3.
Reconcile any Vibe references introduced by agent rules/skills
only when those projections are intentionally added

4.
TeeStock ↔ MGBOS authority cleanup

5.
Add additional engineering routing profiles
only when a real consumer/package requires them

6.
Cross-System Time & Scheduling Semantics
when required by active implementation

7.
Cross-System Data Classification
when required by active implementation
```

---

# 150. Do Not Create Routing Profiles for Symmetry

A profile should exist because:

```text
real engineering work
+
distinct routing semantics
+
validated consumer
```

not because every directory should look symmetrical.

---

# 151. Do Not Create Canonical Docs for Symmetry

Likewise:

```text
new folder exists
```

is not sufficient reason for:

```text
new architecture document
```

Extend an existing owner where possible.

---

# 152. Source Map Change Rule

A material Source Map change must inspect:

```text
semantic owner impact
reverse references
navigation impact
agent instruction impact
target-system documentation impact
```

Source Map edits are governance changes.

They are not trivial merely because the file is Markdown.

---

# 153. Snapshot Semantics

Frontmatter:

```text
repository_snapshot
```

records the repository revision against which current-state observations in this Source Map were reviewed.

It is evidence context.

It is not permanent authority over later repository reality.

---

# 154. Snapshot Becomes Historical

When main advances:

```text
repository_snapshot
```

becomes historical context.

Normative source ownership remains active unless superseded.

Current-state observations must be rechecked when material.

---

# 155. No Fake Freshness

Do not use an old Source Map snapshot as proof that:

```text
current routing
current implementation
current CI
current project state
```

remains unchanged.

Use current registries/evidence.

---

# 156. Completion Condition

Canonical Source Map is healthy when a competent human or AI can answer:

```text
Where does this concept belong?

Which source owns it?

Is the source canonical, registry, evidence, historical, or design input?

Which runtime/implementation evidence proves current behavior?

Does another document conflict with it?

What should happen if they conflict?
```

without guessing.

---

# 157. Vibe Activation Completion Condition

Vibe Engineering activation is healthy when:

```text
all nine Vibe docs exist at canonical paths

Canonical Source Map routes to them

project index exposes the entrypoint

AGENTS.md exposes the engineering procedure

upstream Control Plane remains semantic owner

routing/contracts/capabilities remain non-duplicated

repository validation remains green
```

---

# 158. Final Principle

> **Search finds information. Canonical Source Map determines authority.**

And:

> **Business documentation defines the business. MGBOS defines governed transactional truth. JARVIS reasons over governed truth. Engineering Control defines software-engineering governance. Vibe Engineering defines how humans and AI operate that engineering system coherently.**

And finally:

> **No navigation file, model, runtime, provider, implementation report, or successful test may silently replace the canonical semantic owner.**