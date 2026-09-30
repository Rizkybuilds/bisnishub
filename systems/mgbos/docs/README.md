---
canonical_id: mgbos.docs.master-index
status: ACTIVE
version: 2.0
owner: Rizky
author: OpenAI / ChatGPT
approver: Rizky
scope: mgbos-documentation
document_class: canonical-navigation-index
effective_from: 2026-09-30
authoritative_for:
  - mgbos documentation navigation
  - mgbos documentation classification
  - mgbos documentation placement
  - canonical-versus-evidence routing within mgbos
  - mgbos documentation reading order
last_reviewed: 2026-09-30
review_cadence: monthly-during-active-development
depends_on:
  - ../../../docs/governance/documentation-constitution.md
  - ../../../docs/governance/canonical-source-map.md
  - ../../../docs/project-index.md
  - ../AGENTS.md
supersedes:
  - mgbos.docs.master-index@1.0
implementation_status: DOCUMENTATION_INDEX
---

# MultiGraph Business OS — Master Documentation Index v2.0

## 1. Purpose

Dokumen ini adalah pintu masuk canonical untuk seluruh dokumentasi MGBOS.

Ia menjawab:

> **Dokumen MGBOS mana yang harus dibaca untuk memahami architecture, implementation, evidence, decisions, dan operations?**

Dokumen ini adalah:

```text
NAVIGATION AUTHORITY
```

bukan specification pengganti dokumen domain di bawahnya.

---

# 2. MGBOS Documentation Principle

Canonical routing:

```text
MGBOS
│
├── architecture
│   → what the system means
│
├── product
│   → what a specific application/pilot needs
│
├── implementation
│   → what we are currently building
│
├── engineering
│   → how software work is governed
│
├── adr
│   → why major technical decisions were made
│
├── runbooks
│   → how the system is operated/recovered
│
└── evidence
    → proof that something was actually implemented/tested
```

---

# 3. Documentation Authority Hierarchy

Within MGBOS:

```text
CROSS-SYSTEM GOVERNANCE
docs/
        ↓
MGBOS CANONICAL ARCHITECTURE
systems/mgbos/docs/architecture/
        ↓
PRODUCT / IMPLEMENTATION SPEC
systems/mgbos/docs/product/
systems/mgbos/docs/implementation/
        ↓
CODE / MIGRATIONS / TESTS
systems/mgbos/
        ↓
IMPLEMENTATION EVIDENCE
systems/mgbos/docs/engineering/
systems/mgbos/docs/evidence/
```

Implementation report MUST NOT override canonical architecture.

---

# 4. Current Documentation Structure

Canonical target:

```text
systems/mgbos/docs/
│
├── README.md
│
├── architecture/
│   ├── README.md
│   ├── canonical-data-model.md
│   ├── business-state-machines.md
│   ├── business-invariants.md
│   ├── command-event-model.md
│   ├── permission-authorization-model.md
│   └── domain-map-capability-ownership.md
│
├── product/
│   ├── README.md
│   ├── teestock-curated-strategy.md
│   ├── teestock-development-plan.md
│   ├── teestock-design-library-spec.md
│   └── teestock-asset-readiness.md
│
├── implementation/
│   ├── README.md
│   │
│   ├── phase-1-operating-spine/
│   │   ├── README.md
│   │   ├── operating-spine-plan.md
│   │   ├── current-operating-spine-audit.md
│   │   ├── backlog.md
│   │   ├── synthetic-scenarios.md
│   │   ├── operator-acceptance-test.md
│   │   └── completion-report.md
│   │
│   ├── phase-2-founder-control/
│   ├── phase-3-automation/
│   ├── phase-4-jarvis-lite/
│   └── phase-5-launch-readiness/
│
├── engineering/
│   ├── README.md
│   ├── maintenance-policy.md
│   ├── operational-readiness.md
│   ├── pre-implementation-audit.md
│   ├── agent-system/
│   └── implementation reports
│
├── adr/
│
├── runbooks/
│
└── evidence/
```

Directories marked as target MUST NOT be treated as physically present until created.

---

# 5. Architecture Documentation

Canonical location:

```text
systems/mgbos/docs/architecture/
```

Architecture documents define:

```text
entities

state

invariants

commands

events

permissions

domain boundaries

transactional semantics
```

---

# 6. Architecture Index

Primary entry point:

```text
architecture/README.md
```

Role:

```text
CANONICAL ARCHITECTURE INDEX
```

It should route readers to dedicated specifications rather than reproduce them.

---

# 7. Canonical Data Model

Canonical source:

```text
architecture/canonical-data-model.md
```

Owns:

```text
MGBOS entities

relationships

identity semantics

financial structures

transactional representation
```

Classification:

```text
CANONICAL
```

---

# 8. Business State Machines

Canonical source:

```text
architecture/business-state-machines.md
```

Owns:

```text
domain state vocabularies

allowed transitions

stored vs derived state

terminal-state semantics

implementation maturity
```

Classification:

```text
CANONICAL
```

---

# 9. Business Invariants

Canonical source:

```text
architecture/business-invariants.md
```

Owns rules that MUST remain true regardless of:

```text
UI

automation

AI

integration

operator
```

Classification:

```text
CANONICAL
```

---

# 10. Command & Event Model

Canonical source:

```text
architecture/command-event-model.md
```

Owns:

```text
command semantics

event semantics

outbox principles

idempotency expectations

external signal boundaries
```

Classification:

```text
CANONICAL
```

---

# 11. Permission & Authorization

Canonical source:

```text
architecture/permission-authorization-model.md
```

Owns:

```text
roles

capabilities

authorization semantics

approval relationship

service-principal boundaries
```

Classification:

```text
CANONICAL
```

---

# 12. Domain Map & Capability Ownership

Canonical target:

```text
architecture/domain-map-capability-ownership.md
```

Canonical ID:

```text
mgbos.architecture.domain-map-capability-ownership
```

Role:

```text
CURRENT / PARTIAL / NEXT / DEFERRED
domain and capability ownership map
```

Current repository state:

```text
ACTIVE-READY
NOT YET PERSISTED
```

until the file is created.

---

# 13. Historical Sep-23 Architecture Notes

Historical sources under:

```text
catatan/sesi/2026-09-23*
```

including earlier:

```text
Canonical Data Model

Logical Data Model

Business State Machines

System Architecture
```

are:

```text
HISTORICAL / DESIGN PROVENANCE
```

for concepts now promoted into dedicated canonical MGBOS specifications.

They MUST NOT override:

```text
architecture/canonical-data-model.md

architecture/business-state-machines.md

architecture/business-invariants.md

architecture/command-event-model.md

architecture/permission-authorization-model.md
```

---

# 14. Product Documentation

Location:

```text
systems/mgbos/docs/product/
```

Owns application/product-level requirements implemented through MGBOS.

Examples:

```text
Custom Atelier pilot

TeeStock product/application requirements

screen architecture

pilot interaction flows
```

---

# 15. Product Docs Are Not Business Strategy

Business strategy remains under:

```text
bisnis/teestock/
```

Example separation:

```text
bisnis/teestock/04-services/custom.md
→ TeeStock Custom business definition

systems/mgbos/docs/product/
→ software/pilot behavior supporting TeeStock Custom
```

---

# 16. Product Documentation Is Not Implementation Evidence

A product spec saying:

```text
"This screen should exist."
```

does not mean:

```text
"This screen is implemented."
```

Implementation status must be verified separately.

---

# 17. Historical Pilot Specifications

Sep-23 documents such as:

```text
MGBOS 0.5 TeeStock Pilot MVP

MGBOS 0.5.1 Custom Atelier
```

remain:

```text
HISTORICAL / PRODUCT DESIGN PROVENANCE
```

where their requirements have already been promoted or implemented.

They may still be consulted for unpromoted detail.

---

# 18. Implementation Documentation

Canonical target location:

```text
systems/mgbos/docs/implementation/
```

Purpose:

> **Translate canonical architecture + current business requirements into bounded engineering execution.**

---

# 19. Implementation Docs Own

```text
phase plan

current implementation audit

implementation backlog

acceptance criteria

synthetic scenarios

operator acceptance test

phase completion report
```

They do NOT own long-term architecture semantics.

---

# 20. Phase 1 — Operating Spine

Canonical target:

```text
systems/mgbos/docs/implementation/
phase-1-operating-spine/
```

Files:

```text
README.md

operating-spine-plan.md

current-operating-spine-audit.md

backlog.md

synthetic-scenarios.md

operator-acceptance-test.md

completion-report.md
```

---

# 21. Phase 1 Operating Spine Plan

Target:

```text
implementation/phase-1-operating-spine/
operating-spine-plan.md
```

Canonical ID:

```text
teestock.implementation.phase1-operating-spine
```

Current state:

```text
ACTIVE-READY
NOT YET PERSISTED
```

---

# 22. Phase 1 Current Audit

Target:

```text
implementation/phase-1-operating-spine/
current-operating-spine-audit.md
```

Canonical ID:

```text
teestock.audit.phase1a-mgbos-operating-spine
```

Current state:

```text
ACTIVE-READY
NOT YET PERSISTED
```

---

# 23. Phase 1 Backlog

Target:

```text
implementation/phase-1-operating-spine/backlog.md
```

Should eventually own active engineering sequence such as:

```text
P0-01 Lead → Requirement continuation

P0-02 Order lifecycle

P0-03 Vendor-backed assignment

P0-04 Assignment acceptance

P0-05 Fulfillment readiness

P0-08 Work Order artifact

Clean E2E

Operator Acceptance Test
```

The backlog is:

```text
EXECUTION CONTROL
```

not architecture authority.

---

# 24. Future Implementation Phases

Reserved semantic destinations:

```text
phase-2-founder-control/

phase-3-automation/

phase-4-jarvis-lite/

phase-5-launch-readiness/
```

Do not create files merely to populate these directories.

Create them when implementation work reaches the phase.

---

# 25. JARVIS Lite Boundary

JARVIS-specific implementation eventually belongs primarily under:

```text
systems/jarvis/docs/implementation/
```

MGBOS Phase 4 documentation should only own:

```text
MGBOS integration requirements

read models

business-data interfaces

MGBOS-side constraints
```

not JARVIS runtime architecture.

---

# 26. Engineering Documentation

Location:

```text
systems/mgbos/docs/engineering/
```

Owns:

```text
software engineering governance

maintenance policy

operational readiness

implementation evidence

agent-assisted development workflow

historical engineering reports
```

---

# 27. Engineering Index Debt

Current:

```text
engineering/README.md
```

still describes Sep-23 MGBOS 0.5.2 / 0.5.3 / 0.5.4 session notes as engineering source of truth.

This requires a future controlled revision.

Until revised:

```text
canonical architecture wins

current code/tests verify implementation

session notes provide historical provenance
```

---

# 28. Implementation Reports

Current implementation reports:

```text
engineering/mgbos-001-report.md
...
engineering/mgbos-020-report.md
```

Classification:

```text
EVIDENCE
```

These demonstrate what was built and tested at a specific time.

---

# 29. Implementation Report Rule

Reports SHOULD answer:

```text
What changed?

What was tested?

At which revision?

What remains incomplete?
```

They MUST NOT redefine:

```text
business state

permissions

invariants

domain ownership
```

without corresponding canonical updates.

---

# 30. Future Engineering Report Organization

Preferred future organization:

```text
engineering/reports/
```

But existing files SHOULD NOT be mass-moved solely for aesthetics.

Move only through a controlled reference migration if the value justifies it.

---

# 31. Architecture Decision Records

Location:

```text
systems/mgbos/docs/adr/
```

ADRs explain major durable decisions.

Current accepted decision topics include:

```text
Modular Monolith

PostgreSQL System of Record

Supabase

n8n Orchestrator

Transactional Outbox

AI Gateway

Workspace Coexistence

Quote Pricing Snapshots

Customer Quotation Projection

Order Contract Snapshots

Production Job Splitting

Vendor Capability / QC

Commercial Invoicing

Design Library Demo

System Directory
```

Exact current inventory should be read from the directory rather than hard-coded forever in this index.

---

# 32. ADR Authority

An accepted ADR owns:

```text
WHY A DURABLE TECHNICAL CHOICE EXISTS
```

It does not replace detailed canonical specification when one exists.

Example:

```text
ADR-002
→ why PostgreSQL is SoR

canonical-data-model.md
→ what entities MGBOS canonically represents
```

---

# 33. Runbooks

Location:

```text
systems/mgbos/docs/runbooks/
```

Current operational runbooks include:

```text
local-database.md

windows-database-prerequisites.md

backup-and-restore.md

monitoring-and-incidents.md

release-and-recovery.md
```

Classification:

```text
CANONICAL OPERATIONAL PROCEDURE
```

within stated scope.

---

# 34. Runbook Rule

A runbook tells operators:

```text
HOW TO OPERATE / RECOVER
```

It does not define:

```text
business semantics.
```

---

# 35. Policy ≠ Active Infrastructure

A runbook or policy describing:

```text
backup

monitoring

alerting

recovery
```

does not prove that the service is configured.

Runtime evidence is required.

---

# 36. Evidence Documentation

Preferred target:

```text
systems/mgbos/docs/evidence/
```

Purpose:

```text
acceptance evidence

test evidence

release evidence

phase certification

runtime verification references
```

---

# 37. Evidence Should Not Become Documentation Noise

Do not duplicate:

```text
CI output

raw logs

thousands of screenshots
```

inside repository documentation unnecessarily.

Store durable summaries/references.

---

# 38. Root MGBOS README

Parent:

```text
systems/mgbos/README.md
```

Role:

```text
workspace navigation
quick start
high-level system identity
```

It SHOULD link to this Master Documentation Index.

---

# 39. Root README Documentation Drift

Current root README contains static implementation counts/status references that may become stale as MGBOS evolves.

Future revision SHOULD prefer:

```text
stable architecture description

navigation

commands

links to current evidence
```

over frequently stale hard-coded completion claims.

This is documentation debt, not a Phase 1 blocker.

---

# 40. Current Canonical Reading Order

For architecture work:

```text
1. ../../../docs/governance/documentation-constitution.md

2. ../../../docs/governance/canonical-source-map.md

3. ../../../docs/architecture/master-system-blueprint.md

4. architecture/README.md

5. relevant dedicated architecture specification

6. relevant ADR

7. current code/migration/tests

8. implementation evidence
```

---

# 41. Current Implementation Reading Order

For bounded engineering work:

```text
1. systems/mgbos/AGENTS.md

2. cross-system governance relevant to the task

3. relevant MGBOS canonical architecture docs

4. implementation phase plan

5. current implementation audit

6. active backlog item

7. source code / migrations / tests

8. historical notes only if necessary
```

---

# 42. Business Requirement Reading Order

For TeeStock-driven capability:

```text
TeeStock canonical business docs
        ↓
MGBOS Domain Map
        ↓
relevant MGBOS architecture
        ↓
implementation phase docs
        ↓
code
```

---

# 43. Documentation Status Interpretation

Important distinction:

```text
DOCUMENT ACTIVE
≠
FEATURE IMPLEMENTED
```

And:

```text
IMPLEMENTATION REPORT EXISTS
≠
CURRENT RUNTIME VERIFIED
```

Always inspect implementation evidence when runtime status matters.

---

# 44. Current Core MGBOS Architecture

Current dedicated canonical specifications already establish strong foundation for:

```text
organization

customer

lead

requirement

quote

order

production

vendor

QC

invoice

payment

inventory

procurement

shipment

ledger / cost / margin
```

Implementation maturity differs by capability.

Use:

```text
Domain Map
+
current audit
+
implementation evidence
```

to determine current status.

---

# 45. No Session Note as Default Authority

New rule for this index:

> **A session note is never the default MGBOS authority when a dedicated canonical specification now exists.**

Historical note may still explain:

```text
origin

design rationale

older schema ideas
```

but cannot silently override current canonical docs.

---

# 46. MGBOS Documentation Placement Rule

Ask:

```text
Is this durable MGBOS semantic architecture?
→ architecture/

Is this application/product behavior?
→ product/

Is this current bounded implementation work?
→ implementation/

Is this engineering policy/evidence?
→ engineering/

Is this a durable architecture decision?
→ adr/

Is this an operating procedure?
→ runbooks/

Is this proof/certification?
→ evidence/
```

---

# 47. What Does Not Belong Here

Do not store:

```text
TeeStock brand strategy

marketing strategy

pricing philosophy

JARVIS runtime architecture

general repository policy

casual session notes
```

as MGBOS canonical docs.

They belong to their semantic owner.

---

# 48. Cross-System Sources

Important related directories:

```text
docs/
→ cross-system governance

bisnis/teestock/
→ TeeStock business truth

systems/jarvis/docs/
→ intelligence architecture

catatan/
→ historical / design input
```

---

# 49. Current Documentation Closure Program

Immediate documentation sequence:

```text
1. Canonical Source Map v1.1
   docs/governance/canonical-source-map.md

2. MGBOS Master Documentation Index v2.0
   systems/mgbos/docs/README.md

3. MGBOS Architecture Index v2.0
   systems/mgbos/docs/architecture/README.md

4. Solo-Founder Operating System v1.0
   docs/operating-model/solo-founder-operating-system.md

5. Domain Map & Capability Ownership v1.0
   systems/mgbos/docs/architecture/
   domain-map-capability-ownership.md

6. Solo-Founder Launch Roadmap
   docs/roadmaps/solo-founder-launch-roadmap.md

7. Phase 1 implementation docs
   systems/mgbos/docs/implementation/
   phase-1-operating-spine/

8. TeeStock/MGBOS authority cleanup
```

---

# 50. Closure Gate

MGBOS documentation may enter implementation-focused mode when:

```text
architecture authority
= clear

business/system ownership
= clear

implementation plan
= persisted

current audit
= persisted

active backlog
= clear
```

At that point:

```text
STOP FOUNDATION DOCUMENT EXPANSION
```

unless implementation exposes a real semantic gap.

---

# 51. Final Navigation

```text
systems/mgbos/
│
├── README.md
│      ↓
├── docs/README.md
│      │
│      ├── architecture/
│      │      ↓
│      │   canonical system meaning
│      │
│      ├── product/
│      │      ↓
│      │   application requirements
│      │
│      ├── implementation/
│      │      ↓
│      │   current execution
│      │
│      ├── engineering/
│      │      ↓
│      │   software governance/evidence
│      │
│      ├── adr/
│      │      ↓
│      │   durable decisions
│      │
│      ├── runbooks/
│      │      ↓
│      │   operational procedures
│      │
│      └── evidence/
│             ↓
│          implementation proof
│
├── apps/
├── packages/
├── supabase/
└── scripts/
```

---

# 52. Final Principle

> **The documentation index should help a reader find authority, not force them to reconstruct history.**

Therefore:

```text
CANONICAL SPECS
first

IMPLEMENTATION
second

EVIDENCE
third

HISTORY
when needed
```

not:

```text
old session note
→ guess current meaning
→ inspect code
→ guess which document won.
```