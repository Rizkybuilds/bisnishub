---
canonical_id: mgbos.docs.master-index
status: ACTIVE
version: 3.0
owner: Rizky
author: OpenAI / ChatGPT
approver: Rizky
scope: mgbos-documentation
document_class: canonical-navigation-index
effective_from: 2026-10-05

implementation_status: DOCUMENTATION_INDEX

prepared_against:
  repository: Rizkybuilds/bisnishub
  branch: main
  commit: f05bd82f9be6aa038799931ede19059481aed8d1
  reviewed_at: 2026-10-05

documentation_program:
  program: FOUNDER_CONTROL_PRODUCT_PACKAGE_RECONCILIATION
  prior_program: W0_CURRENT_STATE_RECONCILIATION
  status: CLOSING_RECONCILIATION
  next_gate: ARCHITECTURE_IMPACT_REVIEW

authoritative_for:
  - MGBOS documentation navigation
  - MGBOS documentation classification
  - MGBOS documentation placement
  - canonical-versus-product-versus-implementation routing within MGBOS
  - MGBOS documentation reading order
  - MGBOS current documentation-program routing
  - current-versus-historical documentation interpretation

not_authoritative_for:
  - MGBOS business semantics owned by dedicated architecture specifications
  - TeeStock business policy
  - product requirements owned by dedicated product specifications
  - implementation truth
  - deployment state
  - runtime state
  - production readiness
  - engineering risk taxonomy
  - repository-wide Vibe Engineering governance

last_reviewed: 2026-10-05
review_cadence: monthly-during-active-development-or-after-material-documentation-program-change

depends_on:
  - ../../../docs/governance/documentation-constitution.md
  - ../../../docs/governance/canonical-source-map.md
  - ../../../docs/project-index.md
  - ../../../docs/engineering/vibe-engineering/README.md
  - ../AGENTS.md
  - architecture/README.md
  - product/README.md
  - implementation/README.md
  - engineering/operational-readiness.md

supersedes:
  - mgbos.docs.master-index@2.0
---

# MultiGraph Business OS — Master Documentation Index v3.0

## 1. Purpose

Dokumen ini adalah master navigation entrypoint untuk dokumentasi MGBOS.

Ia menjawab:

```text
WHERE IS MGBOS AUTHORITY?

WHERE ARE PRODUCT REQUIREMENTS?

WHERE IS CURRENT IMPLEMENTATION WORK?

WHERE IS HISTORICAL IMPLEMENTATION WORK?

WHERE IS ENGINEERING GOVERNANCE?

WHERE IS OPERATIONAL READINESS?

WHERE ARE ADRs?

WHERE ARE RUNBOOKS?

WHAT SHOULD A HUMAN OR MACHINE READ FIRST?
```

Dokumen ini adalah:

```text
NAVIGATION AUTHORITY
+
DOCUMENT CLASSIFICATION ROUTER
+
CURRENT-PROGRAM ROUTER
```

bukan pengganti semantic owner di bawahnya.

---

# 2. Fundamental Documentation Rule

MGBOS documentation follows:

```text
ONE NORMATIVE CONCEPT
=
ONE SEMANTIC OWNER
```

A navigation index may point to authority.

It MUST NOT silently duplicate or override that authority.

---

# 3. Repository Authority Order

For MGBOS work, use the applicable authority chain:

```text
REPOSITORY-WIDE GOVERNANCE
docs/
        ↓
MGBOS CANONICAL ARCHITECTURE
systems/mgbos/docs/architecture/
        ↓
PRODUCT REQUIREMENTS
systems/mgbos/docs/product/
        ↓
IMPLEMENTATION PROGRAM
systems/mgbos/docs/implementation/
        ↓
CURRENT SOURCE / MIGRATIONS / CONFIG
systems/mgbos/
        ↓
TEST / CI / RUNTIME / ACCEPTANCE EVIDENCE
```

Evidence proves observed implementation reality.

Evidence does not silently redefine architecture.

---

# 4. Documentation Classes

MGBOS documentation is separated into:

```text
architecture/
→ what MGBOS means

product/
→ what an MGBOS-backed product capability should do

implementation/
→ bounded software change programs

engineering/
→ MGBOS engineering governance and engineering evidence

adr/
→ why durable technical decisions exist

runbooks/
→ how the system is operated and recovered
```

There is currently no physical:

```text
evidence/
```

directory in the verified repository baseline.

Evidence may currently live in:

```text
engineering/

implementation completion artifacts

tests

CI

runtime verification
```

Do not invent a physical evidence directory merely because an older target tree mentioned one.

---

# 5. Current Verified Physical Tree

At the reviewed remote baseline:

```text
main
=
f89ccb49878668f5cb00edf7375e168b9d4a0670
```

the physical MGBOS documentation tree contains:

```text
systems/mgbos/docs/
│
├── README.md
│
├── architecture/
│
├── product/
│
├── implementation/
│
├── engineering/
│
├── adr/
└── runbooks/
```

No additional documentation directory should be assumed to exist without repository evidence.

---

# 6. Current Architecture Tree

Verified physical tree:

```text
architecture/
│
├── README.md
├── canonical-data-model.md
├── business-state-machines.md
├── business-invariants.md
├── command-event-model.md
├── permission-authorization-model.md
└── domain-map-capability-ownership.md
```

These are physically present.

Older documentation claiming:

```text
domain-map-capability-ownership.md
=
NOT YET PERSISTED
```

is stale.

---

# 7. Architecture Index

Primary entrypoint:

```text
architecture/README.md
```

Use it to navigate MGBOS canonical architecture.

The architecture index should route readers to dedicated specifications rather than reproduce their normative contents.

---

# 8. Canonical Data Model

Canonical source:

```text
architecture/canonical-data-model.md
```

Owns applicable:

```text
entity identity

relationships

canonical business representation

financial structures

persistent domain concepts
```

---

# 9. Business State Machines

Canonical source:

```text
architecture/business-state-machines.md
```

Owns:

```text
state vocabularies

transition semantics

terminal semantics

stored versus derived state
```

---

# 10. Business Invariants

Canonical source:

```text
architecture/business-invariants.md
```

Owns rules that must remain true regardless of:

```text
UI

operator

automation

AI

integration
```

---

# 11. Command & Event Model

Canonical source:

```text
architecture/command-event-model.md
```

Owns:

```text
command semantics

event semantics

idempotency principles

outbox expectations

external-signal boundaries
```

---

# 12. Permission & Authorization

Canonical source:

```text
architecture/permission-authorization-model.md
```

Owns applicable:

```text
roles

capabilities

authorization semantics

approval relationships

service-principal boundaries
```

---

# 13. Domain Map & Capability Ownership

Canonical source:

```text
architecture/domain-map-capability-ownership.md
```

Canonical ID:

```text
mgbos.architecture.domain-map-capability-ownership
```

The file is physically present.

It classifies capability maturity/ownership using concepts such as:

```text
CURRENT

PARTIAL

NEXT

DEFERRED

EXPERIMENTAL

OUTSIDE_MGBOS
```

according to its own semantics.

---

# 14. Domain Map Is Not Runtime Proof

A capability classified:

```text
CURRENT
```

in the domain map does not automatically prove every UI, command, integration, or operational workflow is complete.

When implementation truth matters, inspect:

```text
current source

migrations

tests

CI

runtime / operator evidence
```

---

# 15. Product Documentation

Location:

```text
systems/mgbos/docs/product/
```

Product documentation owns:

```text
WHY

+

WHAT
```

for MGBOS-backed product behavior.

It does not own physical implementation design.

---

# 16. Product Index

Primary entrypoint:

```text
product/README.md
```

Its role is:

```text
PRODUCT DOCUMENTATION NAVIGATION

PRODUCT DOCUMENT CLASSIFICATION

CURRENT PRODUCT-PROGRAM ROUTING
```

not parent PRD for every MGBOS capability.

---

# 17. Verified Remote Product Tree

At the repository baseline:

```text
product/
│
├── README.md
├── founder-attention-experience-spec.md
├── founder-control-documentation-plan.md
├── operational-exception-spec.md
├── teestock-asset-readiness.md
├── teestock-curated-strategy.md
├── teestock-design-library-spec.md
├── teestock-development-plan.md
├── teestock-founder-control-prd.md
└── teestock-operational-pilot-plan.md
```

The verified remote baseline contains the Founder Control documentation family:

```text
founder-control-documentation-plan.md
teestock-founder-control-prd.md
founder-attention-experience-spec.md
operational-exception-spec.md
teestock-operational-pilot-plan.md
```

---

# 18. Founder Control Documentation Manifest

The W0 documentation reconciliation program introduced:

```text
product/
founder-control-documentation-plan.md
```

as the active documentation-program manifest for Founder Control.

Current repository state:

```text
W0
=
COMPLETE

FOUNDER CONTROL DOCUMENTATION FAMILY
=
PRESENT / ACTIVE

PRODUCT PACKAGE
=
DEFINED

NEXT GATE
=
ARCHITECTURE IMPACT REVIEW
```

The document is verified present and active on remote `main`. The product index routes current Founder Control product work through this plan and its companion specifications (D1 through D4) toward Architecture Impact Review.

---

# 19. Current Product Program

Current strategic product program:

```text
FOUNDER CONTROL
```

The central product question is no longer merely:

```text
Can the transaction move?
```

but:

```text
Can MGBOS determine
what deserves founder attention
without the founder searching everything manually?
```

---

# 20. Founder Control Documentation Family

Current documentation plan defines the intended family:

```text
D0
founder-control-documentation-plan.md

D1
teestock-founder-control-prd.md

D2
founder-attention-experience-spec.md

D3
operational-exception-spec.md

D4
teestock-operational-pilot-plan.md
```

Only physically present documents may be treated as existing files.

---

# 21. Existing Product Documents

Existing product files predate the current Founder Control program.

Their detailed classification is owned by:

```text
product/README.md
```

Broadly, they include:

```text
legacy / domain-specific TeeStock planning

experimental Design Library specification

bounded historical asset-readiness evidence
```

They must not automatically override newer business, product, or canonical sources.

---

# 22. Product ≠ Business Strategy

TeeStock business authority remains under:

```text
bisnis/teestock/
```

Example:

```text
TeeStock Custom commercial definition
→ bisnis/teestock/

MGBOS behavior supporting that business need
→ systems/mgbos/docs/product/
```

---

# 23. Product ≠ Architecture

Example product requirement:

```text
Founder must see materially overdue production.
```

Architecture question:

```text
How should that abnormal condition
be represented canonically?
```

Implementation question:

```text
Which query, command, migration,
read model, and component implement it?
```

These layers MUST remain separate.

---

# 24. Implementation Documentation

Location:

```text
systems/mgbos/docs/implementation/
```

Implementation documentation exists to convert approved product/architecture requirements into bounded software change.

---

# 25. Implementation Index

Primary entrypoint:

```text
implementation/README.md
```

Current interpretation (W0 reconciliation complete):

```text
PHASE 1
=
CLOSED

ACTIVE NEW IMPLEMENTATION PHASE
=
NONE

CURRENT PRODUCT PROGRAM
=
FOUNDER CONTROL PRODUCT DEFINITION
```

---

# 26. Verified Implementation Tree

At the reviewed baseline:

```text
implementation/
│
├── README.md
└── phase-1-operating-spine/
    │
    ├── README.md
    ├── operating-spine-plan.md
    ├── current-operating-spine-audit.md
    ├── backlog.md
    ├── operator-acceptance-test.md
    └── completion-report.md
```

There is no physical:

```text
synthetic-scenarios.md
```

inside Phase 1.

---

# 27. No Future Phase Directories Currently

The verified implementation tree does NOT contain:

```text
phase-2-founder-control/

phase-3-automation/

phase-4-jarvis-lite/

phase-5-launch-readiness/
```

Do not show these as current physical structure.

---

# 28. Future Phase Names Are Planning Vocabulary

Possible future phase names may remain useful as roadmap destinations.

But:

```text
FUTURE PHASE NAME
≠
DIRECTORY EXISTS
```

and:

```text
DIRECTORY EXISTS
≠
IMPLEMENTATION AUTHORIZED
```

---

# 29. Phase 1 — Operating Spine

Directory:

```text
implementation/
phase-1-operating-spine/
```

Current phase lifecycle:

```text
CLOSED
```

Phase 1 must not be presented as current unfinished implementation work.

---

# 30. Phase 1 Delivered Spine

Phase 1 materially established the governed software journey:

```text
Lead
→ Requirement
→ Quote
→ Order
→ Invoice / Payment
→ Production
→ Vendor Assignment
→ Work Order / SPK
→ QC
→ Shipment
→ Actual Cost
→ Realized Margin
→ Order Completion
```

within its documented evidence boundary.

---

# 31. Phase 1 P0 State

Historical Phase 1 work:

```text
P0-01 Lead → Requirement
P0-02 Order Lifecycle
P0-03 Vendor-Backed Assignment
P0-04 Assignment Acceptance / Reassignment
P0-05 Fulfillment Readiness
P0-06 Work Order / SPK
P0-07 Clean Happy-Path E2E
P0-08 Operator Acceptance
```

Current lifecycle:

```text
ALL
=
DONE
```

---

# 32. Phase 1 Navigation Index

Entry:

```text
implementation/
phase-1-operating-spine/
README.md
```

may remain:

```text
ACTIVE
```

because its continuing role is:

```text
closed-phase navigation

lifecycle interpretation

evidence routing
```

It is not an active execution backlog.

---

# 33. Phase 1 Historical Plan

File:

```text
operating-spine-plan.md
```

must be interpreted after W0 reconciliation as:

```text
ARCHIVED
HISTORICAL IMPLEMENTATION PLAN
```

It explains what was intended.

It does not authorize current work.

---

# 34. Phase 1 Historical Audit

File:

```text
current-operating-spine-audit.md
```

must be interpreted as:

```text
ARCHIVED
PRE-REMEDIATION AUDIT
```

The word:

```text
current
```

belongs to its historical audit snapshot.

It does not mean current repository truth today.

---

# 35. Phase 1 Historical Backlog

File:

```text
backlog.md
```

must be interpreted as:

```text
ARCHIVED
COMPLETED BACKLOG

EXECUTION AUTHORITY
=
NONE
```

---

# 36. Phase 1 Operator Evidence

File:

```text
operator-acceptance-test.md
```

records operator acceptance.

Current documented Phase 1 result:

```text
PASS

BLOCKERS
=
0
```

within its stated acceptance boundary.

---

# 37. Phase 1 Completion Evidence

Primary closure record:

```text
completion-report.md
```

records:

```text
PHASE 1 CLOSED
```

and associated test/evidence results.

Use it for historical closure evidence.

---

# 38. Phase 1 Closure Does Not Mean Production Ready

Do not infer:

```text
PHASE 1 CLOSED
→
PRODUCTION READY
```

or:

```text
OPERATOR ACCEPTANCE PASS
→
REAL BUSINESS VALIDATED
```

These are independent evidence classes.

---

# 39. No Active MGBOS Implementation Phase

Current intended program state:

```text
ACTIVE MGBOS IMPLEMENTATION PHASE
=
NONE
```

Founder Control remains in product-definition/reconciliation work until applicable gates pass.

---

# 40. Phase 2 Creation Gate

Do not create:

```text
implementation/
phase-2-founder-control/
```

merely because Founder Control is the next product program.

Create a new implementation phase only after:

```text
product scope
=
bounded

material decisions
=
resolved

architecture impact
=
reconciled

current source
=
audited

routing / risk
=
resolved

technical plan
=
bounded

completion gate
=
defined
```

---

# 41. Product-to-Implementation Flow

Required flow:

```text
BUSINESS NEED
        ↓
PRODUCT DEFINITION
        ↓
ARCHITECTURE IMPACT REVIEW
        ↓
ENGINEERING DISCOVERY
        ↓
IMPLEMENTATION CONTRACT
        ↓
WORK PACKAGE
        ↓
BUILDER
```

Do not hand a raw PRD directly to implementation as unrestricted authority.

---

# 42. Engineering Documentation

Location:

```text
systems/mgbos/docs/engineering/
```

The physical directory currently includes:

```text
README.md

maintenance-policy.md

operational-readiness.md

pre-implementation-audit.md

branch-protection-setup.md

2026-09-26-foundation-recheck.md

agent-system/

mgbos-001-report.md
...
mgbos-020-report.md

mgbos-001-files.md
```

Read actual directory contents rather than assuming the report range remains permanently fixed.

---

# 43. Engineering Documentation Responsibilities

Engineering documentation may own:

```text
MGBOS-specific engineering governance

maintenance procedures

readiness register

engineering reports

agent-system controls

historical engineering evidence
```

It must not override MGBOS canonical business semantics.

---

# 44. Engineering README Debt

The engineering index has historically contained references to older MGBOS session-era engineering material.

Until separately reconciled where necessary:

```text
CURRENT REPOSITORY GOVERNANCE

+

CURRENT MGBOS AGENTS

+

CURRENT CANONICAL ARCHITECTURE

+

CURRENT SOURCE / TESTS

+

CURRENT VIBE ENGINEERING GOVERNANCE
```

win over stale historical engineering-index interpretations.

This debt is not by itself permission to rewrite engineering semantics from this master index.

---

# 45. Operational Readiness

Current readiness register:

```text
engineering/
operational-readiness.md
```

Current operational readiness conclusion:

```text
SOFTWARE / CI HEALTH
=
VERIFIED FOR CURRENT CI SCOPE

PHASE 1
=
CLOSED

OPERATOR ACCEPTANCE
=
PASS

PRODUCTION READINESS
=
NOT VERIFIED

REAL TRANSACTION READINESS
=
GATED
```

---

# 46. Readiness Is Separate From Product Maturity

Product maturity asks:

```text
Do we know what to build?
```

Operational readiness asks:

```text
Can the system be operated safely
in the intended environment?
```

Both are required for real operation.

---

# 47. Readiness Hard Areas

Current unresolved readiness includes applicable:

```text
environment isolation

credential hygiene

backup automation

restore drill

RPO

RTO

active monitoring

alert escalation

recovery exercise

production acceptance
```

Use the readiness register for current evidence.

---

# 48. Development Credential Boundary

Development-oriented login and seed material must not be treated as production identity configuration.

Before external/production use:

```text
development identity
≠
production identity
```

must be proven.

Sensitive values should not be repeated in documentation unnecessarily.

---

# 49. Implementation Reports

Files such as:

```text
engineering/mgbos-001-report.md
...
engineering/mgbos-020-report.md
```

are:

```text
IMPLEMENTATION / ENGINEERING EVIDENCE
```

at their applicable revisions.

They do not automatically define current system semantics.

---

# 50. Report Interpretation Rule

An implementation report may answer:

```text
What was changed?

What was tested?

What was observed?

At which point in history?
```

It must not independently redefine:

```text
entity semantics

business state

invariants

permissions

domain ownership
```

---

# 51. Architecture Decision Records

Location:

```text
systems/mgbos/docs/adr/
```

Verified current physical inventory includes:

```text
001-modular-monolith.md

002-postgresql-system-of-record.md

003-supabase.md

004-n8n-orchestrator.md

005-transactional-outbox.md

006-ai-gateway.md

007-workspace-coexistence.md

008-quote-pricing-snapshots.md

009-customer-quotation-projection.md

010-order-contract-snapshots.md

011-production-job-splitting.md

012-vendor-capabilities-and-qc-inspections.md

013-commercial-invoicing-and-payment-terms.md

014-design-library-demo.md

015-system-directory.md
```

Always inspect the directory for later additions.

---

# 52. ADR Authority

An accepted ADR owns:

```text
WHY A DURABLE TECHNICAL DECISION EXISTS
```

It does not replace the detailed specification owning:

```text
WHAT THE SYSTEM SEMANTICALLY MEANS
```

Example:

```text
ADR
→ why PostgreSQL is the System of Record

Canonical Data Model
→ what entities are canonically represented
```

---

# 53. Runbooks

Current physical runbooks:

```text
runbooks/
│
├── backup-and-restore.md
├── local-database.md
├── monitoring-and-incidents.md
├── release-and-recovery.md
└── windows-database-prerequisites.md
```

These are operational procedure sources within their declared scope.

---

# 54. Runbook ≠ Configured Infrastructure

A runbook describing:

```text
backup

restore

monitoring

incident handling

release recovery
```

does not prove those controls are actively configured.

Operational evidence remains required.

---

# 55. Evidence Without `evidence/`

MGBOS currently does not require a dedicated:

```text
docs/evidence/
```

directory merely to satisfy an old target tree.

Evidence may legitimately remain attached to:

```text
phase completion reports

operator acceptance

engineering reports

tests

CI

runtime evidence
```

Create a dedicated evidence directory only if independent lifecycle/volume makes it useful.

---

# 56. Current Documentation Reading Order — Architecture

For architecture work:

```text
1.
../../../docs/governance/
documentation-constitution.md

2.
../../../docs/governance/
canonical-source-map.md

3.
../../../docs/architecture/
master-system-blueprint.md
when cross-system context matters

4.
architecture/README.md

5.
relevant dedicated MGBOS architecture specification

6.
relevant ADR

7.
current source / migrations / tests

8.
implementation evidence
```

---

# 57. Current Reading Order — Founder Control Product Work

For current Founder Control product work:

```text
1.
../../../docs/project-index.md

2.
../AGENTS.md

3.
README.md

4.
product/README.md

5.
product/
founder-control-documentation-plan.md
when physically applied

6.
relevant TeeStock business sources

7.
relevant MGBOS architecture

8.
Phase 1 evidence
when current baseline capability matters

9.
current source
when actual implementation matters
```

---

# 58. Current Reading Order — New Engineering Work

Do NOT begin new MGBOS implementation from the Phase 1 historical backlog.

Use:

```text
1.
repository AGENTS.md

2.
systems/mgbos/AGENTS.md

3.
current product requirement

4.
relevant canonical architecture

5.
current repository source

6.
current routing / risk governance

7.
engineering discovery

8.
Implementation Contract

9.
Work Package
```

---

# 59. Current Reading Order — Phase 1 History

To understand why Phase 1 was implemented:

```text
1.
implementation/
phase-1-operating-spine/README.md

2.
operating-spine-plan.md

3.
current-operating-spine-audit.md

4.
backlog.md

5.
current/historical source as relevant

6.
operator-acceptance-test.md

7.
completion-report.md
```

Read lifecycle metadata before using historical claims.

---

# 60. Current Reading Order — Operational Readiness

For production/pilot readiness:

```text
1.
engineering/
operational-readiness.md

2.
runbooks/
backup-and-restore.md

3.
runbooks/
monitoring-and-incidents.md

4.
runbooks/
release-and-recovery.md

5.
current provider/environment evidence

6.
current CI/runtime evidence
```

Do not infer readiness from Phase 1 closure alone.

---

# 61. Current Reading Order — TeeStock-Driven Capability

For a TeeStock requirement:

```text
TEEStock CURRENT BUSINESS SOURCE
        ↓
MGBOS PRODUCT REQUIREMENT
        ↓
MGBOS DOMAIN MAP
        ↓
RELEVANT MGBOS ARCHITECTURE
        ↓
ENGINEERING DISCOVERY
        ↓
IMPLEMENTATION
```

A business term is not automatically an MGBOS entity.

---

# 62. Opportunity Boundary

Generic:

```text
Opportunity
```

remains deferred/evidence-driven in current MGBOS architecture.

Use existing:

```text
Lead
→ Requirement
→ Quote
```

until repeated operational truth justifies promotion.

---

# 63. Project Boundary

Generic:

```text
Project
```

remains deferred/conditional.

Prefer:

```text
Requirement
+
Order
+
Production Job
```

until independent Project lifecycle need is proven.

---

# 64. Partner Boundary

Do not create generic:

```text
Partner
```

merely because TeeStock uses broad partner language.

Current production relationship uses:

```text
Vendor
```

where applicable.

---

# 65. Work Order Boundary

Work Order/SPK is currently a governed artifact derived from existing business truth.

Do not promote it into an independent root entity without independent lifecycle evidence.

---

# 66. Operational Exception Boundary

Operational Exception is a post-spine product need under current Founder Control planning.

It is not yet automatically an approved:

```text
root entity

database table

state machine

command set
```

Product definition comes first.

---

# 67. JARVIS Boundary

JARVIS-specific architecture is owned under:

```text
systems/jarvis/docs/
```

MGBOS documentation should own only applicable:

```text
MGBOS-side read models

business-data interfaces

MGBOS constraints

MGBOS integration expectations
```

not JARVIS runtime architecture.

---

# 68. Founder Control Must Work Without JARVIS

Preferred direction:

```text
MGBOS AUTHORITATIVE STATE
        ↓
DETERMINISTIC FOUNDER CONTROL
        ↓
JARVIS MAY LATER
ANALYZE / SUMMARIZE / RECOMMEND
```

Do not make LLM inference the missing system-of-record layer.

---

# 69. Automation Boundary

Automation may coordinate:

```text
routing

scheduling

notification

integration
```

It must not become a competing business system of record.

---

# 70. Machine Interpretation Rule — Physical vs Planned

Machine readers MUST distinguish:

```text
PHYSICAL FILE
```

from:

```text
PLANNED FILE
```

and:

```text
ACTIVE DOCUMENT
```

from:

```text
IMPLEMENTED FEATURE
```

and:

```text
CLOSED HISTORICAL PHASE
```

from:

```text
CURRENT EXECUTION PROGRAM
```

---

# 71. Machine Interpretation Rule — Current vs Historical

Never infer:

```text
historical audit says gap exists
→ gap exists now
```

or:

```text
historical backlog contains task
→ task should be executed now
```

or:

```text
old target tree contains directory
→ directory currently exists
```

---

# 72. Machine Interpretation Rule — Documentation vs Runtime

Canonical:

```text
DOCUMENTED
≠
IMPLEMENTED

IMPLEMENTED
≠
VERIFIED NOW

VERIFIED NOW
≠
PRODUCTION READY

PRODUCTION READY
≠
BUSINESS VALIDATED
```

---

# 73. Session Notes

Historical session material under:

```text
catatan/

catatan/sesi/
```

is generally:

```text
HISTORICAL

DESIGN INPUT

RESEARCH

PROVENANCE
```

unless explicitly promoted.

---

# 74. Session Notes Are Not Default Authority

If a dedicated canonical specification exists:

```text
DEDICATED CANONICAL SPEC
>
SESSION NOTE
```

Session notes may still explain:

```text
origin

older reasoning

discarded alternatives
```

but may not silently override current authority.

---

# 75. Archive

Material under:

```text
archive/
```

is reference-only unless a bounded recovery/migration task explicitly promotes it.

Do not restore old application code merely because it appears complete.

---

# 76. Documentation Placement Rule

Ask:

```text
Is this durable MGBOS system semantics?
→ architecture/

Is this product behavior / requirement?
→ product/

Is this bounded current software execution?
→ implementation/

Is this MGBOS engineering governance/readiness/evidence?
→ engineering/

Is this durable technical decision rationale?
→ adr/

Is this operational/recovery procedure?
→ runbooks/
```

---

# 77. What Does Not Belong in MGBOS Canonical Docs

Do not place:

```text
TeeStock brand strategy

general marketing strategy

cross-system repository governance

JARVIS runtime architecture

casual brainstorm notes
```

inside MGBOS canonical documentation.

Route them to their actual owner.

---

# 78. Current Cross-System Sources

Important adjacent owners:

```text
../../../docs/
→ repository / cross-system governance

../../../bisnis/teestock/
→ TeeStock business truth

../../jarvis/docs/
→ JARVIS architecture

../../../catatan/
→ historical / research / session provenance
```

---

# 79. Repository Vibe Engineering

Repository-wide engineering operating method:

```text
../../../docs/engineering/
vibe-engineering/README.md
```

MGBOS implementation documentation must compose with that method.

MGBOS docs must not create a competing repository-wide engineering operating model.

---

# 80. Engineering Execution Flow

Current governed direction:

```text
OWNER INTENT
        ↓
PRODUCT / ENGINEERING PLANNING
        ↓
CANONICAL ROUTING
        ↓
ENGINEERING DISCOVERY
        ↓
IMPLEMENTATION CONTRACT
        ↓
WORK PACKAGE
        ↓
BUILDER
        ↓
ASSURANCE
        ↓
VERIFICATION
        ↓
PR AUDIT
        ↓
MERGE
        ↓
POST-MERGE REFLECTION
```

Detailed workflow authority belongs to repository engineering governance.

---

# 81. Documentation Drift Is A Real Engineering Risk

In machine-driven development:

```text
STALE CURRENT-STATE DOCUMENTATION
```

can cause:

```text
duplicate work

wrong implementation

scope drift

incorrect entity promotion

incorrect Builder handoff

false completion claims
```

Therefore documentation lifecycle is part of engineering integrity.

---

# 82. Historical Preservation Principle

Correct repository history is:

```text
AUDIT FOUND GAP
        ↓
PLAN CREATED
        ↓
BACKLOG CREATED
        ↓
IMPLEMENTATION OCCURRED
        ↓
EVIDENCE COLLECTED
        ↓
PHASE CLOSED
```

Do not erase old reasoning merely because it is no longer current.

Change its lifecycle.

---

# 83. Current Documentation Program

Documentation reconciliation state:

```text
W0 CURRENT-STATE RECONCILIATION
=
COMPLETE

CURRENT PROGRAM
=
FOUNDER CONTROL PRODUCT PACKAGE RECONCILIATION

STATUS
=
CLOSING RECONCILIATION

NEXT GATE
=
ARCHITECTURE IMPACT REVIEW
```

W0 removed false current-state signals after Phase 1 closure. The Founder Control product definition family (D0–D4) is now active and defined, with Architecture Impact Review as the next material gate.

---

# 84. W0 Reconciled Scope (Historical Provenance)

At the W0 planning stage, the change set prepared updates for:

```text
product/
founder-control-documentation-plan.md

implementation/
phase-1-operating-spine/README.md

implementation/
phase-1-operating-spine/
operating-spine-plan.md

implementation/
phase-1-operating-spine/
current-operating-spine-audit.md

implementation/
phase-1-operating-spine/backlog.md

implementation/README.md

product/README.md

engineering/
operational-readiness.md

../../../docs/project-index.md

../../../docs/roadmaps/
solo-founder-launch-roadmap.md

README.md
```

All W0 documentation changes have been applied, reconciled, and verified on `main`.

---

# 85. W0 Reconciled Outcome

With the W0 patch set completed, a fresh machine resolves:

```text
MGBOS PHASE 1
=
CLOSED

PHASE 1 P0 BACKLOG
=
COMPLETED / HISTORICAL

CURRENT MGBOS PRODUCT PROGRAM
=
FOUNDER CONTROL

FOUNDER CONTROL PRODUCT PACKAGE (D0-D4)
=
ACTIVE / DEFINED

ACTIVE NEW IMPLEMENTATION PHASE
=
NONE

PRODUCTION READINESS
=
NOT VERIFIED

REAL TRANSACTION READINESS
=
GATED

NEXT MATERIAL GATE
=
ARCHITECTURE IMPACT REVIEW
```

without relying on private conversation history.

---

# 86. W0 Documentation-Only Boundary

W0 was:

```text
DOCUMENTATION RECONCILIATION
```

not:

```text
RUNTIME IMPLEMENTATION
```

It does not itself:

```text
change database

change application behavior

deploy infrastructure

create Founder Control functionality
```

---

# 87. Founder Control Product Definition Family

Following W0 documentation preparation, the Founder Control product definition family (D1 through D4) has been introduced:

```text
D0: founder-control-documentation-plan.md (ACTIVE)
D1: teestock-founder-control-prd.md (ACTIVE)
D2: founder-attention-experience-spec.md (ACTIVE)
D3: operational-exception-spec.md (ACTIVE)
D4: teestock-operational-pilot-plan.md (ACTIVE)
```

The Founder Control product package is defined, active implementation phase is none, and the next gate is Architecture Impact Review.

---

# 88. D1 Does Not Open Phase 2

Creating D1 does NOT mean:

```text
PHASE 2 IMPLEMENTATION
=
OPEN
```

Product definition still needs:

```text
Founder Attention specification

Operational Exception specification

real pilot planning

cross-document review

architecture impact review

engineering discovery
```

before implementation authorization.

---

# 89. Current Strategic Sequence

Canonical current direction:

```text
PHASE 1 CLOSED
        ↓
W0 DOCUMENTATION RECONCILIATION
        ↓
FOUNDER CONTROL PRODUCT DEFINITION
        ↓
ARCHITECTURE RECONCILIATION
        ↓
ENGINEERING DISCOVERY
        ↓
PHASE 2 IMPLEMENTATION
        ↓
OPERATIONAL READINESS
        ↓
REAL BUSINESS PILOT
        ↓
DETERMINISTIC AUTOMATION
        ↓
JARVIS LEVERAGE
```

Detailed roadmap authority lives in:

```text
../../../docs/roadmaps/
solo-founder-launch-roadmap.md
```

---

# 90. Master Index Maintenance Rule

Update this index when:

```text
documentation class changes materially

new major documentation directory becomes real

active product program changes

implementation phase opens or closes

semantic-owner routing changes

current reading order changes materially
```

Do not update this index for every implementation detail.

---

# 91. Avoid Hard-Coding Volatile Counts

Do not make this master index depend on:

```text
exact number of tests

exact number of migrations

exact number of implementation reports

exact number of application routes
```

unless those counts are themselves materially useful and maintained.

Read actual repository state when counts matter.

---

# 92. Avoid Target-Tree Fiction

Do not list future:

```text
phase directories

evidence directories

reports directories
```

inside a section titled:

```text
CURRENT STRUCTURE
```

unless they physically exist.

Future destinations must be explicitly labeled:

```text
FUTURE

RESERVED

PLANNED
```

---

# 93. Current Master Navigation

```text
systems/mgbos/
│
├── README.md
│
├── AGENTS.md
│
└── docs/
    │
    ├── README.md
    │      master documentation navigation
    │
    ├── architecture/
    │      canonical MGBOS semantics
    │
    ├── product/
    │      product requirements
    │
    ├── implementation/
    │      bounded engineering phases
    │
    ├── engineering/
    │      engineering governance,
    │      readiness, and reports
    │
    ├── adr/
    │      durable technical decisions
    │
    └── runbooks/
           operations and recovery
```

---

# 94. Current Program Summary

Current program interpretation (W0 complete, D0–D4 active):

```text
ARCHITECTURE
=
ACTIVE CANONICAL FOUNDATION

PHASE 1
=
CLOSED

CURRENT PRODUCT PROGRAM
=
FOUNDER CONTROL

FOUNDER CONTROL PRODUCT PACKAGE
=
DEFINED

ACTIVE IMPLEMENTATION PHASE
=
NONE

OPERATIONAL READINESS
=
NOT PRODUCTION READY

NEXT GATE
=
ARCHITECTURE IMPACT REVIEW
```

---

# 95. Machine Query Examples

Question:

```text
"Where do I find canonical Order semantics?"
```

Answer:

```text
architecture/
```

using the applicable dedicated specifications.

---

Question:

```text
"Should I implement P0-04?"
```

Answer:

```text
NO.

P0-04 belongs to closed Phase 1.
```

---

Question:

```text
"What should Antigravity implement next?"
```

Answer:

```text
NO CURRENT IMPLEMENTATION PACKAGE
IS AUTHORIZED BY THIS INDEX.
```

---

Question:

```text
"What product work is current?"
```

Answer:

```text
FOUNDER CONTROL PRODUCT DEFINITION
```

---

Question:

```text
"Is Operational Exception already an entity?"
```

Answer:

```text
DO NOT ASSUME.

Resolve product specification
and current canonical architecture first.
```

---

Question:

```text
"Is MGBOS production-ready?"
```

Answer:

```text
NO PRODUCTION CERTIFICATION
IS ESTABLISHED BY THIS INDEX.

Read:
engineering/operational-readiness.md
```

---

# 96. Final Principle

The master documentation index exists so a capable reader can move from:

```text
QUESTION
```

to:

```text
CORRECT AUTHORITY
```

without reconstructing project history manually.

The intended hierarchy is:

```text
NAVIGATION
        ↓
SEMANTIC OWNER
        ↓
CURRENT IMPLEMENTATION
        ↓
EVIDENCE
        ↓
HISTORY WHEN NEEDED
```

not:

```text
OLD TARGET TREE
        ↓
OLD BACKLOG
        ↓
SESSION NOTE
        ↓
GUESS CURRENT STATE
```

Current MGBOS documentation direction is therefore:

> **Phase 1 is a closed implementation chapter. Founder Control is the next product-definition program. No new MGBOS implementation phase is currently authorized, production readiness remains separately gated, and future documentation directories must not be represented as current physical reality until they actually exist.**
