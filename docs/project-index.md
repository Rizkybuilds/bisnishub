---
canonical_id: docs.project-index
status: ACTIVE
version: 1.3
owner: Rizky
author: OpenAI / ChatGPT
approver: Rizky
scope: repository
document_class: registry
effective_from: 2026-10-05

repository_snapshot: c4ae9668f4b1a9327d8889b7450bec0b0de2a87a

current_repository_program:
  engineering_method: VIBE_ENGINEERING_ACTIVE
  mgbos_product_program: FOUNDER_CONTROL
  mgbos_active_implementation_phase: PHASE_2_FOUNDER_CONTROL
  mgbos_phase_1: CLOSED
  mgbos_p2a_operational_exception_foundation: SOFTWARE_COMPLETE_POST_MERGE_VERIFIED
  mgbos_active_work_package: NONE
  mgbos_next_program_direction: P2_B_FOUNDER_ATTENTION_HEAD_ENGINEERING_PLANNING
  mgbos_builder_authorization: NONE

authoritative_for:
  - active repository project locations
  - top-level repository navigation
  - repository system locator
  - top-level authority entrypoints
  - top-level engineering navigation
  - top-level current-program routing

not_authoritative_for:
  - business semantics
  - system-specific architecture
  - MGBOS product requirements
  - implementation truth
  - runtime truth
  - engineering risk semantics
  - routing registry contents
  - permission grants
  - deployment authorization
  - production readiness

last_reviewed: 2026-10-09
review_cadence: monthly-or-after-material-repository-routing-change

depends_on:
  - governance/documentation-constitution.md
  - governance/canonical-source-map.md
  - engineering/repository-layout.md
  - engineering/engineering-ai-control-plane.md
  - engineering/vibe-engineering/README.md
  - decisions/001-repository-organization.md
  - ../.agents/routing/README.md
  - ../.agents/routing/task-types.yaml

supersedes:
  - docs.project-index@1.2
---

# BisnisHub Project Index v1.3

## 1. Purpose

Dokumen ini adalah top-level repository locator untuk BisnisHub.

Ia menjawab:

```text id="cytz60"
WHERE IS THE TARGET SYSTEM?

WHERE IS ITS CANONICAL DOCUMENTATION?

WHERE IS BUSINESS KNOWLEDGE?

WHERE IS ENGINEERING GOVERNANCE?

WHERE IS CURRENT PRODUCT WORK?

WHERE IS CURRENT IMPLEMENTATION WORK?

WHERE IS HISTORICAL MATERIAL?

WHERE SHOULD A HUMAN OR AI START?
```

Dokumen ini adalah:

```text id="26v2l6"
OPERATIONAL REGISTRY
+
NAVIGATION ENTRYPOINT
+
CURRENT-PROGRAM ROUTER
```

bukan:

```text id="khm8om"
business specification

system architecture

product PRD

implementation contract

runtime evidence

permission grant

deployment authority
```

---

# 2. Authority Boundary

Project Index determines:

```text id="o1by64"
WHERE TO START
```

It does not determine:

```text id="vnte6m"
WHAT A DOMAIN MEANS
```

or:

```text id="5ajpcz"
WHAT SOFTWARE SHOULD DO
```

or:

```text id="hc37kn"
WHAT A BUILDER IS AUTHORIZED TO CHANGE
```

Semantic authority remains governed by:

```text id="r2te9l"
docs/governance/documentation-constitution.md

docs/governance/canonical-source-map.md
```

plus the applicable domain/system canonical owner.

---

# 3. Repository Snapshot

Current repository state reviewed for this index:

```text id="cdbhhx"
REPOSITORY
Rizkybuilds/bisnishub

BRANCH
main

SNAPSHOT
c4ae9668f4b1a9327d8889b7450bec0b0de2a87a

REVIEW DATE
2026-10-09
```

Snapshot is current-state evidence for this document.

It does not imply that future repository revisions inherit the same verified state automatically.

---

# 4. Current Repository-Level Program State

Current repository-level interpretation:

```text id="hjih1z"
VIBE ENGINEERING
=
ACTIVE REPOSITORY OPERATING METHOD

MGBOS PHASE 1
=
CLOSED

MGBOS ACTIVE IMPLEMENTATION PHASE
=
PHASE_2_FOUNDER_CONTROL

MGBOS CURRENT PRODUCT PROGRAM
=
FOUNDER_CONTROL

P2-A OPERATIONAL EXCEPTION FOUNDATION
=
SOFTWARE COMPLETE / POST-MERGE VERIFIED

ACTIVE WORK PACKAGE
=
NONE

NEXT PROGRAM DIRECTION
=
P2-B FOUNDER ATTENTION — HEAD ENGINEERING PLANNING

BUILDER AUTHORIZATION
=
NONE

JARVIS
=
ARCHITECTURE / SPECIFICATION PRESENT
RUNTIME IMPLEMENTATION NOT ASSUMED

TEEStock V1
=
ARCHIVED

MGBOS VITE PROTOTYPE
=
ARCHIVED
```

---

# 5. Active Systems and Runtime Areas

| System / area         | Location                                                    | Current boundary                                                                                |
| --------------------- | ----------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| MGBOS                 | [`systems/mgbos/`](../systems/mgbos/README.md)              | Active governed transactional business system and current primary implementation workspace      |
| JARVIS                | [`systems/jarvis/docs/`](../systems/jarvis/docs/charter.md) | Canonical architecture/specification exists; runtime implementation must be verified separately |
| KasKita               | `systems/kaskita/`                                          | Independent system workspace with its own application/database boundary                         |
| Engineering Assistant | [`tools/assistant/`](../tools/assistant/README.md)          | Existing engineering/assistant tooling; not JARVIS runtime                                      |
| TeeStock V1           | [`archive/teestock-v1/`](../archive/teestock-v1/README.md)  | Retired legacy application/reference                                                            |
| MGBOS Vite Prototype  | `archive/mgbos-vite-prototype/`                             | Retired prototype/reference                                                                     |

---

# 6. Business Knowledge

Business knowledge lives under:

```text id="5njbez"
bisnis/
```

Current top-level business areas include:

```text id="4ixgps"
bisnis/multigraph/

bisnis/teestock/

bisnis/rizkybuild/
```

Business sources own business semantics within their declared scope.

They do not automatically define:

```text id="1xhwxt"
database entities

state machines

commands

MGBOS architecture

engineering work packages
```

---

# 7. Repository Governance

Start here for documentation authority:

```text id="f3qvy3"
docs/governance/documentation-constitution.md
```

Then:

```text id="4olnga"
docs/governance/canonical-source-map.md
```

Responsibilities:

```text id="ztskzf"
Documentation Constitution
→ how documentation authority works

Canonical Source Map
→ where semantic authority lives
```

---

# 8. Documentation Constitution

The Documentation Constitution governs:

```text id="qvgj6f"
document lifecycle

canonical identity

semantic ownership

authority resolution

current-vs-target distinction

session-note treatment

historical material

documentation debt

machine-readable metadata
```

Before promoting a document into authority, follow its lifecycle rules.

---

# 9. Canonical Source Map

Canonical Source Map answers:

```text id="p79wqm"
WHO OWNS THIS SEMANTIC QUESTION?
```

Use it before trusting a detailed document merely because:

```text id="fdldas"
it is newer

it is longer

it sounds technical

it was generated by AI
```

Authority comes from scope and ownership.

---

# 10. Repository Structure

Canonical physical repository organization:

```text id="r890lf"
docs/engineering/repository-layout.md
```

Repository organization decision:

```text id="fr65gz"
docs/decisions/001-repository-organization.md
```

Use these for placement and top-level structure.

---

# 11. Cross-System Architecture

Primary cross-system architecture entrypoints:

```text id="ngh6gl"
docs/architecture/master-system-blueprint.md

docs/architecture/system-boundaries.md

docs/architecture/architectural-laws.md
```

These own cross-system architecture.

They do not replace system-specific architecture.

---

# 12. Cross-System Governance

Primary governance includes:

```text id="5ifdm5"
docs/governance/cross-system-risk-classification.md

docs/governance/autonomy-levels.md

docs/governance/approval-policy.md

docs/governance/evidence-provenance-model.md
```

Use these for:

```text id="175b7m"
risk

autonomy

approval

evidence provenance
```

rather than redefining those semantics inside subsystem docs.

---

# 13. Engineering AI Control Plane

Canonical engineering-governance source:

```text id="rn66ct"
docs/engineering/engineering-ai-control-plane.md
```

It owns engineering semantics including:

```text id="pq242r"
canonical engineering roles

expertise model

routing principles

bounded execution

assurance

runtime-adapter principles

engineering autonomy boundaries
```

For material AI-assisted engineering:

```text id="29uf3c"
READ THIS
```

before relying on provider-specific behavior.

---

# 14. Runtime Adapter Architecture

Canonical source:

```text id="lxnnof"
docs/engineering/runtime-adapter-architecture.md
```

Use it for:

```text id="g66xp1"
provider/runtime adaptation

provider-neutral runtime boundaries

adapter responsibility
```

Provider-specific tools MUST NOT redefine repository engineering governance.

---

# 15. Vibe Engineering

Canonical operating-method entrypoint:

```text id="qu79po"
docs/engineering/vibe-engineering/README.md
```

Vibe Engineering defines:

> How Owner intent, Head Engineering planning, canonical role routing, Builder execution, assurance, verification, PR audit, remediation, integration, and post-merge reflection are coordinated under repository authority.

It is:

```text id="wm6hf4"
ENGINEERING OPERATING METHOD
```

not:

```text id="2tvpky"
a second Control Plane

a second risk taxonomy

a second permission model

a provider-specific authority model
```

---

# 16. Vibe Engineering Current State

At this repository snapshot:

```text id="3ftdef"
VIBE ENGINEERING
=
ACTIVE
```

Current canonical family includes:

```text id="hw0vbp"
README.md

state-and-vocabulary.md

operating-model.md

session-protocol.md

change-package-template.md

implementation-contract-template.md

pr-audit-protocol.md

remediation-protocol.md

post-merge-reflection.md
```

---

# 17. Vibe Engineering Reading Order

Orientation:

```text id="1uobjl"
README.md
        ↓
operating-model.md
        ↓
state-and-vocabulary.md
```

Starting or resuming work:

```text id="0y1ic4"
session-protocol.md
```

Planning:

```text id="5l2ykf"
change-package-template.md
        ↓
implementation-contract-template.md
```

PR review:

```text id="6qaaze"
pr-audit-protocol.md
```

Remediation:

```text id="ohv072"
remediation-protocol.md
```

After merge:

```text id="0zd60k"
post-merge-reflection.md
```

---

# 18. Vibe vs Engineering Control Plane

Correct hierarchy:

```text id="axpmff"
ENGINEERING AI CONTROL PLANE
defines engineering governance

        ↓

.agents/routing
.agents/contracts
.agents/capabilities
define machine-operational controls

        ↓

VIBE ENGINEERING
defines operating procedure

        ↓

RUNTIME / PROVIDER
executes bounded work
```

Do not invert this hierarchy.

---

# 19. Engineering Registries

Current engineering operational registries live primarily under:

```text id="rbf2r9"
.agents/
```

Important areas include:

```text id="ihv8hq"
.agents/roles/

.agents/expertise/

.agents/routing/

.agents/contracts/

.agents/capabilities/

.agents/skills/

.agents/evals/

.agents/continuity/
```

Each registry should be interpreted according to its declared authority.

---

# 20. Engineering Contracts

Canonical contract navigation:

```text id="gzwjkf"
.agents/contracts/README.md
```

Machine schemas include applicable:

```text id="e0z0i1"
implementation-contract.schema.json

work-package.schema.json

engineering-report.schema.json

assurance-report.schema.json

verification-matrix.schema.json

release-packet.schema.json
```

Contract validity does not independently grant execution authority.

---

# 21. Engineering Routing

Canonical routing entrypoint:

```text id="pf1wnf"
.agents/routing/README.md
```

Machine registry:

```text id="q3fhhj"
.agents/routing/task-types.yaml
```

Routing determines applicable:

```text id="drsbs4"
profile

task type

concern

risk floor

roles

expertise

assurance

checks

stop conditions
```

---

# 22. Current Active Routing Profiles

Current canonical routing registry declares:

```text id="9va7l0"
mgbos
→ systems/mgbos/

repository-engineering
→ ./
```

Both are:

```text id="qgu23x"
ACTIVE
```

---

# 23. MGBOS Routing Profile

Profile:

```text id="tzj0xr"
mgbos
```

Workspace:

```text id="xbgnfm"
systems/mgbos/
```

System instructions:

```text id="7fahzu"
systems/mgbos/AGENTS.md
```

Risk profile:

```text id="p1j35q"
systems/mgbos/docs/engineering/
agent-system/risk-classification.md
```

Workflow:

```text id="f4sk15"
systems/mgbos/docs/engineering/
agent-system/workflow.md
```

Release gates:

```text id="wge8ht"
systems/mgbos/docs/engineering/
agent-system/release-gates.md
```

---

# 24. Repository Engineering Routing Profile

Profile:

```text id="t71fir"
repository-engineering
```

Workspace:

```text id="dbyvik"
./
```

Instructions:

```text id="3xa0n1"
AGENTS.md
```

Risk profile:

```text id="yurxc9"
docs/governance/
cross-system-risk-classification.md
```

Workflow:

```text id="f7hs2m"
docs/engineering/
vibe-engineering/README.md
```

Release gates:

```text id="8947yd"
docs/engineering/
repository-release-gates.md
```

---

# 25. Unsupported Routing Profiles

At this snapshot, do NOT assume active profiles exist for:

```text id="259aue"
jarvis

kaskita
```

unless the routing registry is changed.

Canonical rule:

```text id="ath0ov"
NO MATCHING ACTIVE PROFILE
        ↓
DO NOT BORROW ANOTHER PROFILE
        ↓
FAIL CLOSED / GOVERNANCE BOOTSTRAP
```

according to current Vibe Engineering routing policy.

---

# 26. Routing Is Evidence-Based

Do not route work only from keywords.

Routing should consider:

```text id="h8d2qq"
target workspace

requested outcome

actual changed paths

affected business capability

environment

cross-cutting concerns

canonical contracts
```

Initial classification may change when implementation reveals more consequential behavior.

---

# 27. MGBOS Entry Point

System root:

```text id="vughy6"
systems/mgbos/
```

Start with:

```text id="6cmqz3"
systems/mgbos/AGENTS.md

systems/mgbos/README.md
```

Then:

```text id="w5myfk"
systems/mgbos/docs/README.md
```

for documentation routing.

---

# 28. MGBOS Documentation Entry Points

Master documentation index:

```text id="gm51f9"
systems/mgbos/docs/README.md
```

Architecture index:

```text id="m618xi"
systems/mgbos/docs/architecture/README.md
```

Product index:

```text id="zdxrq4"
systems/mgbos/docs/product/README.md
```

Implementation index:

```text id="e25lkv"
systems/mgbos/docs/implementation/README.md
```

Engineering index:

```text id="v6lj78"
systems/mgbos/docs/engineering/README.md
```

---

# 29. MGBOS Canonical Architecture

Core canonical architecture includes:

```text id="1ol9x8"
systems/mgbos/docs/architecture/
canonical-data-model.md

systems/mgbos/docs/architecture/
business-state-machines.md

systems/mgbos/docs/architecture/
business-invariants.md

systems/mgbos/docs/architecture/
command-event-model.md

systems/mgbos/docs/architecture/
permission-authorization-model.md

systems/mgbos/docs/architecture/
domain-map-capability-ownership.md
```

Dedicated specifications own their respective semantics.

---

# 30. MGBOS Phase 1 Status

Historical Phase 1 implementation directory:

```text id="cvek1x"
systems/mgbos/docs/implementation/
phase-1-operating-spine/
```

Current lifecycle:

```text id="1gne2f"
PHASE 1
=
CLOSED
```

Phase 1 is not current implementation work.

---

# 31. Phase 1 Navigation

Closed Phase 1 entrypoint:

```text id="ohmmzb"
systems/mgbos/docs/implementation/
phase-1-operating-spine/README.md
```

Use it for:

```text id="s06x2p"
historical implementation navigation

closure routing

Phase 1 provenance

Phase 1 evidence reading order
```

Do not start new engineering work from its historical backlog.

---

# 32. Phase 1 Historical Plan

Historical implementation plan:

```text id="2ge9u8"
systems/mgbos/docs/implementation/
phase-1-operating-spine/
operating-spine-plan.md
```

Interpret as:

```text id="lo5blf"
ARCHIVED
HISTORICAL IMPLEMENTATION PROVENANCE
```

not current execution authority.

---

# 33. Phase 1 Historical Audit

Historical pre-remediation audit:

```text id="al1gvf"
systems/mgbos/docs/implementation/
phase-1-operating-spine/
current-operating-spine-audit.md
```

The filename retains:

```text id="ojax1c"
current
```

for provenance/link stability.

Its findings describe the historical audit snapshot, not current implementation truth.

---

# 34. Phase 1 Historical Backlog

Historical completed backlog:

```text id="ntsrav"
systems/mgbos/docs/implementation/
phase-1-operating-spine/backlog.md
```

Current interpretation:

```text id="9yud9s"
P0-01 ... P0-08
=
DONE

OPEN PHASE 1 BACKLOG
=
NONE
```

---

# 35. Phase 1 Completion Evidence

Primary Phase 1 closure record:

```text id="c2t6io"
systems/mgbos/docs/implementation/
phase-1-operating-spine/
completion-report.md
```

Operator acceptance:

```text id="qyx6g9"
systems/mgbos/docs/implementation/
phase-1-operating-spine/
operator-acceptance-test.md
```

These establish Phase 1 closure within their documented evidence boundaries.

---

# 36. Phase 1 Capability Direction

Phase 1 closed the documented software operating spine around:

```text id="ka4o51"
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

This does not itself prove production readiness or real business validation.

---

# 37. Current MGBOS Implementation State

Current implementation index declares:

```text id="4unh9d"
ACTIVE MGBOS IMPLEMENTATION PHASE
=
PHASE_2_FOUNDER_CONTROL

P2-A OPERATIONAL EXCEPTION FOUNDATION
=
SOFTWARE COMPLETE / POST-MERGE VERIFIED

ACTIVE WORK PACKAGE
=
NONE

NEXT PROGRAM DIRECTION
=
P2-B FOUNDER ATTENTION — HEAD ENGINEERING PLANNING

BUILDER AUTHORIZATION
=
NONE
```

Phase 1 is CLOSED. Phase 2 bounded implementation is in progress; the P2-A Operational Exception Foundation slice is complete, merged, and post-merge verified. No active work package currently exists, and no Builder implementation is authorized.

---

# 38. Current MGBOS Product Program

Current MGBOS product-definition program:

```text id="l5uc76"
FOUNDER CONTROL
```

Current documentation-program entrypoint:

```text id="yt1f1q"
systems/mgbos/docs/product/
founder-control-documentation-plan.md
```

---

# 39. Founder Control Direction

Current product thesis:

> Phase 1 made business transactions governable. Founder Control must make founder attention governable.

Target operating direction:

```text id="gxcxca"
NORMAL BUSINESS
→ quiet governed operation

ABNORMAL BUSINESS
→ explicit operational fact

MATERIAL ABNORMALITY
→ prioritized attention

FOUNDER
→ involved only where judgment or authority is required
```

Exact product behavior belongs to dedicated Founder Control product documents.

---

# 40. Founder Control Documentation Package

Current product package:

```text id="5na86y"
D0
founder-control-documentation-plan.md (ACTIVE)

D1
teestock-founder-control-prd.md (ACTIVE)

D2
founder-attention-experience-spec.md (ACTIVE)

D3
operational-exception-spec.md (ACTIVE)

D4
teestock-operational-pilot-plan.md (ACTIVE)
```

Product definition package was approved historically; Phase 2 bounded implementation has opened under governed contracts.

---

# 41. Phase 2 Founder Control Bounded Implementation State

Founder Control product definition was completed and approved historically, and Phase 2 bounded implementation has opened.

Current state:

```text id="5ey1s9"
PRODUCT DEFINITION
=
ACTIVE (APPROVED)

PHASE 2 IMPLEMENTATION
=
ACTIVE (BOUNDED)

P2-A OPERATIONAL EXCEPTION FOUNDATION
=
SOFTWARE COMPLETE / POST-MERGE VERIFIED

ACTIVE WORK PACKAGE
=
NONE

NEXT PROGRAM DIRECTION
=
P2-B FOUNDER ATTENTION PLANNING (HEAD ENGINEERING)

BUILDER AUTHORIZATION
=
NONE
```

---

# 42. Phase 2 Entry Gate (Historical — Satisfied)

Phase 2 implementation directory:

```text id="jmdxyw"
systems/mgbos/docs/implementation/
phase-2-founder-control/
```

was established following satisfaction of the Phase 2 entry gate:

```text id="w2fg1u"
bounded product scope (D1–D4 approved)

resolved material decisions

architecture impact reconciliation (W2 complete)

current source audit

understood dependencies

defined completion gate

engineering discovery (W3 complete)
```

P2-A Operational Exception Foundation is now software complete at the governed integration layer (WP01–WP04 verified). Subsequent increments (P2-B) require dedicated technical specifications and governed contracts.

---

# 43. MGBOS Product Documentation

Current product index:

```text id="1or089"
systems/mgbos/docs/product/README.md
```

It routes current and historical product material.

Physical presence in:

```text id="db6f3b"
systems/mgbos/docs/product/
```

does not automatically mean a file is current product authority.

---

# 44. Legacy TeeStock Product Planning

Existing product files include:

```text id="gxq9bp"
teestock-development-plan.md

teestock-curated-strategy.md

teestock-design-library-spec.md

teestock-asset-readiness.md
```

These predate the current Founder Control documentation program and current canonical metadata discipline.

Use their current classification from:

```text id="xxljwm"
systems/mgbos/docs/product/README.md
```

rather than assuming they are all current active PRDs.

---

# 45. MGBOS Operational Readiness

Current register:

```text id="hw34h0"
systems/mgbos/docs/engineering/
operational-readiness.md
```

Current broad conclusion:

```text id="pugeq8"
SOFTWARE / CI BASELINE
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

# 46. Software Completion ≠ Production Readiness

Do not infer:

```text id="ys6eog"
Phase 1 closed
→ production ready
```

or:

```text id="sjwgq8"
CI green
→ operationally safe
```

Production readiness requires separate evidence for applicable:

```text id="1h4m6s"
environment isolation

credentials

backup

restore

monitoring

RPO

RTO

release recovery

production acceptance
```

---

# 47. Hosted CI Current Evidence

At this index snapshot:

```text id="5k2nn9"
main
=
c4ae9668f4b1a9327d8889b7450bec0b0de2a87a
```

current hosted workflows include successful:

```text id="d8u4hq"
Repository Integrity

Agent Governance

MGBOS Foundation
```

Exact CI evidence remains revision-bound.

---

# 48. Branch Protection Current Evidence

GitHub currently reports:

```text id="w85fuq"
main
protected = true
```

Detailed branch-protection rule contents are not assumed here.

Operational-readiness documentation owns the detailed evidence classification.

---

# 49. MGBOS Engineering Control

MGBOS-specific engineering docs live under:

```text id="1i5yn0"
systems/mgbos/docs/engineering/
```

System-specific instructions:

```text id="ne49cr"
systems/mgbos/AGENTS.md
```

For MGBOS engineering, apply:

```text id="2pyh5s"
repository-wide governance

+

Vibe Engineering

+

mgbos routing profile

+

MGBOS-specific engineering rules
```

where applicable.

System-specific rules may be stricter.

They may not weaken repository governance.

---

# 50. JARVIS Entry Point

Start with:

```text id="sa5bin"
systems/jarvis/docs/charter.md

systems/jarvis/docs/architecture.md

systems/jarvis/docs/core-runtime.md
```

Then read only the relevant architecture contracts.

---

# 51. JARVIS Architecture Directory

Canonical JARVIS architecture lives under:

```text id="9lc5h0"
systems/jarvis/docs/architecture/
```

Use current repository contents instead of assuming a permanently fixed file list.

---

# 52. JARVIS Specification vs Runtime

JARVIS architecture documentation may be:

```text id="xme2di"
ACTIVE
```

without proving equivalent runtime implementation.

Always distinguish:

```text id="37azkb"
SPECIFICATION

IMPLEMENTATION

RUNTIME EVIDENCE
```

---

# 53. JARVIS Engineering Routing

At this repository snapshot:

```text id="w0bs6x"
jarvis
```

is not an active routing profile in the canonical engineering routing registry.

Therefore governed JARVIS implementation must not silently borrow:

```text id="ik5tbe"
mgbos
```

or:

```text id="jht2iu"
repository-engineering
```

profiles.

---

# 54. KasKita

Workspace:

```text id="950a09"
systems/kaskita/
```

KasKita remains operationally independent from MGBOS unless an explicit cross-system contract establishes integration.

Do not reuse MGBOS database/runtime assumptions automatically.

---

# 55. KasKita Routing

At this snapshot:

```text id="dy9j5k"
kaskita
```

is not an active routing profile in the canonical registry.

Governed implementation requiring canonical routing must fail closed or bootstrap the appropriate profile.

---

# 56. Engineering Assistant

Existing tooling:

```text id="xafjbm"
tools/assistant/
```

This is not JARVIS merely because both involve assistant behavior.

Treat their boundaries independently.

---

# 57. Solo-Founder Operating Model

Canonical source:

```text id="dc884l"
docs/operating-model/
solo-founder-operating-system.md
```

It owns founder operating principles including:

```text id="6q67l3"
founder-by-exception

delegation boundaries

human accountability

attention allocation
```

It is not an engineering contract.

---

# 58. Solo-Founder Launch Roadmap

Canonical cross-system roadmap:

```text id="o3e53a"
docs/roadmaps/
solo-founder-launch-roadmap.md
```

Roadmap owns strategic sequencing.

It does not certify implementation.

Current MGBOS product/implementation state must be reconciled against current evidence rather than inferred from old roadmap wording.

---

# 59. TeeStock Business Entry Point

Primary TeeStock business root:

```text id="8jgfb4"
bisnis/teestock/
```

Current business documents define applicable:

```text id="hruknk"
business identity

services

commercial policies

operating model

finance

roadmap

MGBOS integration expectations
```

within their declared scopes.

---

# 60. TeeStock ↔ MGBOS Boundary

TeeStock may define:

```text id="3hz0op"
business need

commercial concept

journey

service policy
```

MGBOS canonical architecture defines:

```text id="0oky1v"
authoritative business entity

state machine

invariant

permission

command

transactional integrity
```

For MGBOS-owned transactional semantics:

```text id="ah05td"
MGBOS CANONICAL SOURCE
```

must be resolved.

---

# 61. Business Concept Does Not Automatically Become MGBOS Entity

Terms such as:

```text id="85npq3"
Opportunity

Project

Customer Case

Exception

Program
```

may exist in business vocabulary.

They do not automatically become MGBOS root aggregates.

Promotion requires applicable:

```text id="fww6i5"
product justification

architecture review

operational evidence
```

---

# 62. Historical Notes

Historical/session material lives primarily under:

```text id="2h2whz"
catatan/

catatan/sesi/
```

Default interpretation:

```text id="7ab9p9"
HISTORICAL

DESIGN INPUT

RESEARCH

SESSION MEMORY
```

unless explicitly promoted.

Session notes must not become permanent production authority by accident.

---

# 63. Archive

Retired material lives under:

```text id="0nlmx6"
archive/
```

Archive is reference-only unless a bounded recovery/migration task explicitly says otherwise.

Do not restore archived runtime code merely because it appears complete.

---

# 64. Current Repository Reading Order — New Engineering Work

For material engineering:

```text id="s9sm9p"
1.
AGENTS.md

2.
docs/project-index.md

3.
Documentation Constitution

4.
Canonical Source Map

5.
Engineering AI Control Plane

6.
Vibe Engineering

7.
current routing / contracts / capabilities

8.
target-system AGENTS / README / canonical sources

9.
actual source / tests / evidence
```

Use minimum sufficient context.

---

# 65. New MGBOS Product Work Reading Order

For current MGBOS Founder Control work:

```text id="1akjij"
1.
AGENTS.md

2.
docs/project-index.md

3.
systems/mgbos/AGENTS.md

4.
systems/mgbos/docs/README.md

5.
systems/mgbos/docs/product/README.md

6.
founder-control-documentation-plan.md

7.
relevant TeeStock business sources

8.
relevant MGBOS architecture

9.
Phase 1 evidence where baseline capability matters

10.
current source when implementation reality matters
```

Do not start from the old Phase 1 backlog.

---

# 66. Existing Engineering Work Reading Order

When continuing an existing implementation:

```text id="g81d85"
1.
Vibe Session Protocol

2.
current repository state

3.
active Implementation Contract

4.
current Work Package

5.
active PR if any

6.
current routing

7.
current evidence

8.
affected canonical sources
```

Repository reality outranks conversation memory.

---

# 67. PR Audit Reading Order

For PR audit:

```text id="9c7d4n"
1.
Vibe PR Audit Protocol

2.
actual PR

3.
exact base / head

4.
parent Implementation Contract

5.
Work Package

6.
Engineering Report

7.
relevant canonical sources

8.
current CI

9.
Assurance / Verification artifacts
```

Do not audit from Builder summary alone.

---

# 68. Remediation Reading Order

For remediation:

```text id="tvp8hs"
1.
Vibe Remediation Protocol

2.
finding / failure evidence

3.
current candidate revision

4.
parent Implementation Contract

5.
remediation Work Package

6.
affected canonical sources

7.
current evidence
```

---

# 69. Post-Merge Reading Order

When Owner says:

```text id="uqif6w"
merged
```

verify repository reality.

Read:

```text id="ql5xl7"
1.
Vibe Post-Merge Reflection

2.
actual PR merge state

3.
integration revision

4.
current main

5.
relevant CI

6.
target-system release/recovery docs where applicable
```

Do not infer merge solely from conversation text.

---

# 70. Product Work Is Not Automatically Engineering Work

A current product program or technical plan may exist while:

```text id="rjhfbm"
ACTIVE WORK PACKAGE
=
NONE
```

That is the current MGBOS state following P2-A completion.

Correct progression:

```text id="8jflxa"
PRODUCT DEFINITION
        ↓
ARCHITECTURE IMPACT REVIEW
        ↓
ENGINEERING DISCOVERY / TECHNICAL PLAN
        ↓
IMPLEMENTATION CONTRACT
        ↓
WORK PACKAGE
```

---

# 71. Documentation Lifecycle Must Be Respected

Current documents may be:

```text id="9m1m7f"
ACTIVE

DEPRECATED

SUPERSEDED

ARCHIVED
```

A path alone does not establish current authority.

Before using a document as normative input, inspect:

```text id="uc115v"
status

scope

semantic ownership

supersession

version

effective state
```

---

# 72. Current vs Target

Repository documentation must distinguish:

```text id="l9n74s"
CURRENT

TARGET

PROPOSED

EXPERIMENTAL

NOT VERIFIED
```

according to applicable governance.

Detailed design does not imply implementation.

---

# 73. Intended Truth vs Implementation Truth

Canonical documentation may represent:

```text id="djq6bh"
INTENDED TRUTH
```

while:

```text id="7m5qqh"
source

migration

configuration

runtime
```

represent implementation truth.

When they disagree:

```text id="2dy0a3"
INVESTIGATE DRIFT
```

Do not silently choose whichever source is more convenient.

---

# 74. Navigation Does Not Grant Permission

A path listed in this index does not authorize:

```text id="axredm"
deployment

push

merge

database mutation

production mutation

customer communication

payment

business transaction
```

Permission and navigation are separate.

---

# 75. Tool Availability Does Not Grant Permission

Likewise:

```text id="dghmfs"
TOOL AVAILABLE
≠
ACTION AUTHORIZED
```

Consult:

```text id="tcyth3"
routing

capability governance

approval policy

target-system instructions
```

as applicable.

---

# 76. AI Provider Does Not Grant Authority

A runtime such as:

```text id="18gdk4"
ChatGPT

Antigravity

Codex

Claude Code

future agent runtime
```

does not gain project authority merely from provider identity.

Authority comes from repository governance and current work contracts.

---

# 77. Conversation Memory Boundary

Conversation context may help restore:

```text id="hhalmm"
intent

prior discussion

working rationale
```

but durable project truth lives in:

```text id="pxxyvf"
repository

canonical documentation

current source

exact-revision evidence

active contracts
```

If memory and repository disagree:

```text id="f7jxhk"
REPOSITORY AUTHORITY
must be resolved first.
```

---

# 78. Repository Engineering Work

Changes involving:

```text id="fq634w"
AGENTS.md

docs/governance/

docs/engineering/

.agents/

repository validators

CI governance

routing

contracts
```

should generally route through:

```text id="05z2in"
repository-engineering
```

when covered by the active registry.

Do not misuse the MGBOS profile merely because MGBOS is the main business system.

---

# 79. MGBOS Engineering Work

Changes primarily inside:

```text id="sm43ov"
systems/mgbos/
```

should resolve:

```text id="62od5y"
mgbos
```

routing when applicable.

Cross-repository governance impact may require repository-engineering treatment as well.

Routing composition must follow current registry rather than intuition.

---

# 80. Routing Profile ≠ System Identity

A system may exist without a current engineering routing profile.

Example:

```text id="yvknau"
JARVIS SYSTEM
exists as documented architecture
```

while:

```text id="6tjkep"
jarvis routing profile
```

may not yet exist.

Do not conflate the two.

---

# 81. Current MGBOS Readiness Boundary

MGBOS software may be healthy enough for continued engineering while not yet being production-ready.

Current broad state:

```text id="bkhh1a"
ENGINEERING CONTINUATION
=
ALLOWED

LOCAL / CI VERIFICATION
=
ALLOWED

PRODUCT DEFINITION
=
ALLOWED

REAL OPERATIONAL PILOT
=
GATED

PRODUCTION RELEASE
=
NOT CERTIFIED
```

Detailed readiness authority lives in the MGBOS readiness register.

---

# 82. Founder Control vs Operational Readiness

Founder Control product definition and operational readiness are parallel concerns.

Product definition asks:

```text id="vlnwgk"
WHAT SHOULD FOUNDER CONTROL DO?
```

Operational readiness asks:

```text id="fu7s90"
CAN THE SYSTEM BE OPERATED SAFELY
IN THE INTENDED ENVIRONMENT?
```

Neither should substitute for the other.

---

# 83. Founder Control vs JARVIS

Current preferred dependency:

```text id="6c8hyc"
MGBOS AUTHORITATIVE STATE
        ↓
DETERMINISTIC FOUNDER CONTROL
        ↓
JARVIS MAY LATER
ANALYZE / SUMMARIZE / RECOMMEND
```

Founder Control should not depend on AI reconstructing business truth from raw operational noise.

---

# 84. Engineering Evidence Principle

Evidence includes applicable:

```text id="eghrmk"
CI result

test result

migration evidence

tool execution

runtime verification

operator acceptance

approval

release smoke

restore drill
```

Evidence proves observed reality.

It does not silently redefine intended architecture.

---

# 85. Historical Evidence Must Remain Historical

When documentation is corrected after implementation:

```text id="deepsh"
DO NOT
rewrite history as if
the final answer was always known.
```

Preferred history:

```text id="ld6gkt"
AUDIT FOUND GAP
        ↓
PLAN CREATED
        ↓
WORK EXECUTED
        ↓
EVIDENCE COLLECTED
        ↓
PHASE CLOSED
        ↓
NEXT PLAN ADAPTED
```

This is especially important for machine-assisted engineering.

---

# 86. Current Documentation Reconciliation Program

Current MGBOS documentation work is closing Founder Control product-package reconciliation after D1–D4 activation and routing the accepted product package toward Architecture Impact Review.

Primary affected areas include:

```text id="n4tlam"
Phase 1 lifecycle (CLOSED)

W0 current-state reconciliation (COMPLETE)

Founder Control product package D0-D4 (ACTIVE / DEFINED)

MGBOS product index (RECONCILED)

project index (RECONCILED)

launch roadmap (STAGE B COMPLETE / STAGE C NEXT)
```

This is documentation reconciliation.

It is not new runtime implementation.

---

# 87. Current Product Next Step

Following P2-A software completion:

```text id="gatf50"
CURRENT PRODUCT PROGRAM
=
FOUNDER_CONTROL

PRODUCT DEFINITION PACKAGE D1-D4
=
PRESENT / ACTIVE

ACTIVE IMPLEMENTATION PHASE
=
PHASE_2_FOUNDER_CONTROL

P2-A OPERATIONAL EXCEPTION FOUNDATION
=
SOFTWARE COMPLETE / POST-MERGE VERIFIED

ACTIVE WORK PACKAGE
=
NONE

NEXT PROGRAM DIRECTION
=
P2-B FOUNDER ATTENTION PLANNING (HEAD ENGINEERING)

BUILDER AUTHORIZATION
=
NONE
```

P2-A Operational Exception Foundation is software complete and post-merge verified. P2-B Founder Attention is the next Head Engineering planning candidate.

---

# 88. Current Engineering Next Step

There is currently no valid instruction of the form:

```text id="6wxdmu"
"Start P2-B implementation now."
```

No Builder implementation package is currently authorized. The engineering gate for P2-B comes after:

```text id="ykew4s"
Head Engineering P2-B technical planning

current-source audit

Implementation Contract authoring

bounded Work Package authoring

Owner / governed authorization
```

---

# 89. Project Index Maintenance Rule

Update this index when:

```text id="gzuxre"
active system moves

canonical entrypoint changes

new top-level authority domain appears

active routing profile changes

engineering operating method changes

current repository-wide program changes materially

a listed location becomes retired
```

Do not update it for every implementation detail.

---

# 90. Navigation Health

This index is healthy when a competent human or AI can answer:

```text id="4t2bk9"
Where is the target system?

Where is business knowledge?

Where is product work?

Where is architecture?

Where is implementation work?

Is the current phase active or historical?

Which routing profile applies?

Where is engineering governance?

Where is operational readiness?

Where is evidence?

Where is historical material?
```

without guessing.

---

# 91. Current Navigation Summary

```text id="r21o2r"
REPOSITORY
→ docs/project-index.md

AUTHORITY MODEL
→ docs/governance/

ENGINEERING GOVERNANCE
→ docs/engineering/

ENGINEERING ROUTING
→ .agents/routing/

MGBOS
→ systems/mgbos/

MGBOS ARCHITECTURE
→ systems/mgbos/docs/architecture/

MGBOS PRODUCT
→ systems/mgbos/docs/product/

MGBOS IMPLEMENTATION
→ systems/mgbos/docs/implementation/

MGBOS READINESS
→ systems/mgbos/docs/engineering/
   operational-readiness.md

TEEStock BUSINESS
→ bisnis/teestock/

JARVIS
→ systems/jarvis/docs/

HISTORICAL
→ catatan/
→ archive/
```

---

# 92. Current MGBOS Program Summary

```text id="ra50jz"
PHASE 1 OPERATING SPINE
=
CLOSED

CURRENT PRODUCT PROGRAM
=
FOUNDER CONTROL

PRODUCT DEFINITION PACKAGE D1-D4
=
PRESENT / ACTIVE

CURRENT IMPLEMENTATION PHASE
=
PHASE_2_FOUNDER_CONTROL

P2-A OPERATIONAL EXCEPTION FOUNDATION
=
SOFTWARE COMPLETE / POST-MERGE VERIFIED

ACTIVE WORK PACKAGE
=
NONE

BUILDER AUTHORIZATION
=
NONE

CURRENT READINESS
=
NOT PRODUCTION CERTIFIED

NEXT PROGRAM DIRECTION
=
P2-B FOUNDER ATTENTION PLANNING (HEAD ENGINEERING)
```

---

# 93. Current Routing Summary

```text id="jtf3zw"
ACTIVE ROUTING PROFILES

mgbos
→ systems/mgbos/

repository-engineering
→ ./
```

Not currently active unless registry changes:

```text id="caokva"
jarvis

kaskita
```

---

# 94. Final Principle

Project Index tells you:

```text id="769sx8"
WHERE TO GO
```

Canonical Source Map tells you:

```text id="x4i52e"
WHOM TO TRUST
```

Canonical specifications tell you:

```text id="k3fdd6"
WHAT SHOULD BE TRUE
```

Current source/runtime evidence tells you:

```text id="0klfnm"
WHAT IS ACTUALLY TRUE
```

Vibe Engineering tells you:

```text id="qefptk"
HOW TO TURN OWNER INTENT
INTO GOVERNED ENGINEERING WORK
```

Routing tells you:

```text id="i91drs"
WHAT CONTROLS APPLY
```

Implementation Contract and Work Package tell the Builder:

```text id="6dklm0"
WHAT EXACT WORK IS AUTHORIZED
```

At the current repository state:

> **MGBOS Phase 1 is closed, Phase 2 Founder Control bounded implementation is active with P2-A Operational Exception Foundation software complete and post-merge verified, no Builder work package is currently active, P2-B Founder Attention technical planning is the next governed Head Engineering direction, and governed engineering routing currently supports both MGBOS work and repository-engineering work through their own active profiles.**
