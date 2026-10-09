---
canonical_id: mgbos.product.index
status: ACTIVE
version: 2.6
owner: Rizky
author: OpenAI / ChatGPT
approver: Rizky
scope: mgbos-product-documentation
document_class: navigation-index
effective_from: 2026-10-06

product_program_status: FOUNDER_CONTROL_P2A_COMPLETE_P2B_PLANNING_NEXT
current_product_program: FOUNDER_CONTROL
current_implementation_phase: PHASE_2_FOUNDER_CONTROL

repository_baseline:
  repository: Rizkybuilds/bisnishub
  branch: main
  commit: 77fbcbf08f2699ab85a0682ec4c981235c9c18cf
  reviewed_at: 2026-10-09

authoritative_for:
  - MGBOS product documentation navigation
  - MGBOS product-document classification
  - MGBOS product-document reading order
  - current MGBOS product-program routing
  - product-document placement within MGBOS

not_authoritative_for:
  - TeeStock business strategy
  - MGBOS canonical architecture
  - canonical entity semantics
  - canonical state semantics
  - business invariants
  - permissions and authorization
  - implementation scope
  - implementation status
  - runtime state
  - deployment readiness
  - operational readiness
  - product requirements owned by dedicated child specifications

last_reviewed: 2026-10-09
review_cadence: per-material-product-program-change

depends_on:
  - ../README.md
  - ../architecture/README.md
  - ../architecture/domain-map-capability-ownership.md
  - ../implementation/README.md
  - founder-control-documentation-plan.md
  - ../../../../docs/governance/documentation-constitution.md
  - ../../../../docs/governance/canonical-source-map.md
  - ../../../../docs/roadmaps/solo-founder-launch-roadmap.md
  - ../../../../docs/operating-model/solo-founder-operating-system.md
  - ../../../../bisnis/teestock/README.md
  - ../../../../bisnis/teestock/07-operations/operating-model.md
  - ../../../../bisnis/teestock/14-roadmap/current-quarter.md

supersedes:
  - mgbos.product.index@2.5
---

# MGBOS Product Documentation Index v2.6

## 1. Purpose

Directory:

```text
systems/mgbos/docs/product/
```

owns MGBOS product-level documentation.

Product documentation answers:

```text
WHAT PRODUCT CAPABILITY IS NEEDED?

WHY IS IT NEEDED?

WHO NEEDS IT?

WHAT BEHAVIOR SHOULD EXIST?

WHAT OUTCOME DEFINES SUCCESS?

WHAT IS IN SCOPE?

WHAT IS OUT OF SCOPE?
```

This README is the navigation and classification entrypoint for those documents.

It is not itself the parent PRD for every MGBOS capability.

---

# 2. Product Documentation Boundary

MGBOS product documentation sits between:

```text
BUSINESS NEED
        ↓
PRODUCT DEFINITION
        ↓
CANONICAL SYSTEM SEMANTICS
        ↓
ENGINEERING IMPLEMENTATION
```

Canonical routing:

```text
bisnis/teestock/
→ business need and policy

systems/mgbos/docs/product/
→ product behavior and requirement

systems/mgbos/docs/architecture/
→ governed MGBOS semantics

systems/mgbos/docs/implementation/
→ bounded software implementation

source / migrations / tests
→ implementation truth

evidence
→ proof
```

---

# 3. Product Is Not Business Strategy

TeeStock business strategy remains under:

```text
bisnis/teestock/
```

Examples:

```text
What is TeeStock?

What services does TeeStock offer?

How should Custom operate commercially?

How should pricing work?

What business model is prioritized?

What operating policy applies?
```

belong primarily to the TeeStock business documentation.

MGBOS product documentation consumes those needs.

It does not become TeeStock's business-strategy owner.

---

# 4. Product Is Not Architecture

Product documentation may say:

```text
Founder must see material overdue work.
```

It does not independently decide:

```text
create OperationalException table
```

or:

```text
add attention_status column
```

or:

```text
introduce new root aggregate
```

Those are architecture/engineering questions.

Required sequence:

```text
PRODUCT NEED
        ↓
PRODUCT REQUIREMENT
        ↓
ARCHITECTURE IMPACT REVIEW
        ↓
CANONICAL REPRESENTATION
```

---

# 5. Product Is Not Implementation Evidence

A product document saying:

```text
"This capability should exist."
```

does not mean:

```text
"This capability is implemented."
```

Likewise:

```text
detailed screen design
```

does not prove:

```text
working screen exists
```

Current implementation claims require current source and evidence.

---

# 6. Current Product Program

Current MGBOS product-definition program:

```text
FOUNDER CONTROL
```

Program objective:

> Make material business attention explicit, prioritized, understandable, and actionable so the founder does not have to continuously reconstruct operational reality across modules, memory, chats, spreadsheets, or technical tools.

This program follows Phase 1 Operating Spine closure.

---

# 7. Strategic Transition

Current transition:

```text
PHASE 1
OPERATING SPINE
=
CLOSED

        ↓

CURRENT-STATE
DOCUMENTATION RECONCILIATION

        ↓

FOUNDER CONTROL
PRODUCT DEFINITION

        ↓

FOUNDER ATTENTION

        ↓

OPERATIONAL EXCEPTION

        ↓

REAL OPERATIONAL PILOT (GATED)

        ↓

ARCHITECTURE IMPACT REVIEW (W2 COMPLETE)

        ↓

ENGINEERING DISCOVERY (W3 COMPLETE)

        ↓

P2-A TECHNICAL PLAN (ACTIVE)

        ↓

IC-MGBOS-P2A-WP01 (SATISFIED / CLOSED)

        ↓

WP-P2A-01 (COMPLETE / MERGED / POST-MERGE VERIFIED)

        ↓

IC-MGBOS-P2A-WP02 (SATISFIED / CLOSED)

        ↓

WP-P2A-02 (COMPLETE / MERGED / POST-MERGE VERIFIED)

        ↓

IC-MGBOS-P2A-WP03 (SATISFIED / CLOSED)

        ↓

WP-P2A-03 (COMPLETE / MERGED / POST-MERGE VERIFIED)

        ↓

OPERATIONAL EXCEPTION CONSOLE (CURRENT RUNTIME)

        ↓

WP-P2A-04 (COMPLETE / MERGED / POST-MERGE VERIFIED)

        ↓

P2-A SOFTWARE COMPLETION GATE (SATISFIED)

        ↓

ACTIVE WORK PACKAGE = NONE

        ↓

P2-B FOUNDER ATTENTION PLANNING (NEXT CANDIDATE / NOT AUTHORIZED FOR BUILDER)
```

Phase 2 Founder Control bounded implementation is in progress. WP-P2A-01, WP-P2A-02, WP-P2A-03, and WP-P2A-04 have landed and been verified, completing the P2-A Operational Exception Foundation software slice. No work package is currently active; P2-B Founder Attention is the next planning candidate requiring Head Engineering design before any implementation begins.

---

# 8. Current Product Planning Entry Point

Current Founder Control documentation entrypoint:

```text
founder-control-documentation-plan.md
```

Canonical ID:

```text
mgbos.product.founder-control.documentation-plan
```

Role:

```text
ACTIVE DOCUMENTATION PROGRAM MANIFEST
```

It defines:

```text
which product documents must exist

their semantic boundaries

their creation order

their maturity gates

their traceability conventions

their relationship to architecture and implementation
```

---

# 9. Founder Control Documentation Package

The Founder Control product-definition package consists of:

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

All five documents are physically present and active in the repository.

---

# 10. Current Package State

Current active product package state:

```text
D0
Founder Control Documentation Plan
=
ACTIVE

D1
Founder Control PRD
=
ACTIVE (PRD_MATURE)

D2
Founder Attention Experience
=
ACTIVE (SPEC_MATURE)

D3
Operational Exception Specification
=
ACTIVE (CANONICAL_ARCHITECTURE_RECONCILED)

D4
Real Operational Pilot Plan
=
ACTIVE (PILOT_PLAN_MATURE / PILOT_EXECUTION_BLOCKED)
```

Product package interpretation:

```text
PRODUCT PACKAGE
=
APPROVED_BY_OWNER

W2
=
COMPLETE

W3
=
ANALYSIS COMPLETE

P2-A TECHNICAL PLAN
=
ACTIVE

IC-MGBOS-P2A-WP01
=
SATISFIED / CLOSED

WP-P2A-01
=
COMPLETE / MERGED / POST-MERGE VERIFIED

IC-MGBOS-P2A-WP02
=
SATISFIED / CLOSED

WP-P2A-02
=
COMPLETE / MERGED / POST-MERGE VERIFIED

IC-MGBOS-P2A-WP03
=
SATISFIED / CLOSED

WP-P2A-03
=
COMPLETE / MERGED / POST-MERGE VERIFIED

OPERATIONAL EXCEPTION CONSOLE
=
CURRENT

WP-P2A-04
=
COMPLETE / MERGED / POST-MERGE VERIFIED (PR #48)

P2-A OVERALL
=
SOFTWARE COMPLETE (INTEGRATION LAYER)

ACTIVE WORK PACKAGE
=
NONE

REAL PILOT
=
BLOCKED

NEXT ENGINEERING CANDIDATE
=
P2-B FOUNDER ATTENTION PLANNING (NOT AUTHORIZED FOR BUILDER)
```

---

# 11. Founder Control Product Thesis

Current working direction:

> Phase 1 made business transactions governable. Founder Control must make founder attention governable.

Target operating pattern:

```text
NORMAL BUSINESS
        ↓
GOVERNED MGBOS FLOW
        ↓
NO UNNECESSARY FOUNDER INTERRUPTION
```

When abnormal:

```text
ABNORMAL CONDITION
        ↓
EXPLICIT OPERATIONAL FACT
        ↓
PRIORITY
        ↓
RESPONSIBLE ACTOR
        ↓
NEXT ACTION
        ↓
FOUNDER ONLY WHEN MATERIAL
```

Detailed requirements belong to D1–D3.

---

# 12. Important Semantic Separation

Founder Control must preserve:

```text
BUSINESS STATE
≠
ATTENTION STATE
≠
OPERATIONAL EXCEPTION
≠
APPROVAL REQUEST
≠
FOUNDER DECISION
```

These concepts must not collapse into one dashboard status or one mega-state.

---

# 13. Current Product Directory

At the reviewed repository baseline, the physical directory contains:

```text
product/
│
├── README.md
├── teestock-asset-readiness.md
├── teestock-curated-strategy.md
├── teestock-design-library-spec.md
└── teestock-development-plan.md
```

The Founder Control plan is being introduced through the current documentation program.

---

# 14. Existing Product Documents Require Classification

Physical presence inside:

```text
product/
```

does not automatically mean:

```text
CURRENT ACTIVE PRODUCT AUTHORITY
```

Several existing product documents predate the current canonical documentation discipline.

Some lack machine-readable lifecycle metadata.

They must therefore be interpreted according to their content, date, dependencies, and current authority context.

---

# 15. `teestock-development-plan.md`

Path:

```text
teestock-development-plan.md
```

Original role:

```text
TEEStock / MGBOS PRODUCT DEVELOPMENT PLAN
```

Dated:

```text
2026-09-25
```

The document explicitly identifies itself as:

```text
planning
not implementation
not deployment authority
```

It includes broad TeeStock development priorities such as:

```text
curated

custom

retail

inventory

fulfillment

storefront integration

Founder workbench

automation
```

---

# 16. Development Plan Current Classification

Until its lifecycle is explicitly reconciled, interpret:

```text
teestock-development-plan.md
```

as:

```text
LEGACY PRODUCT PLANNING REFERENCE
```

not:

```text
CURRENT FOUNDER CONTROL PRD
```

It remains useful for:

```text
historical product direction

older priority rationale

unresolved TeeStock product ideas

early operational acceptance concepts
```

It MUST NOT override:

```text
current TeeStock business documentation

current MGBOS canonical architecture

Founder Control documentation program

current implementation evidence
```

---

# 17. Development Plan Documentation Debt

The file still references older:

```text
archive sources

historical session notes

earlier operational-readiness assumptions
```

and uses planning terminology that predates current Phase 1 closure.

Therefore it requires separate lifecycle reconciliation before being used as current machine authority.

Do not silently promote it through this README.

---

# 18. `teestock-curated-strategy.md`

Path:

```text
teestock-curated-strategy.md
```

Original role:

```text
CURATED-FIRST PRODUCT / BUSINESS DIRECTION
```

Dated:

```text
2026-09-25
```

The document established a planning direction around:

```text
Curated Originals

Custom

blank apparel

design-to-order

design library

pilot learning
```

---

# 19. Curated Strategy Current Classification

Interpret this document as:

```text
LEGACY / DOMAIN-SPECIFIC PRODUCT PLANNING REFERENCE
```

unless and until its lifecycle is separately promoted or reconciled.

It remains valuable when working specifically on:

```text
Curated commerce

Design Library

design-to-order

curated pilot assumptions
```

It does not define the current global MGBOS product priority.

Current global product-definition priority is:

```text
FOUNDER CONTROL
```

---

# 20. Curated Strategy Business Boundary

The document contains material that overlaps:

```text
business strategy

product strategy

MGBOS implications
```

Current machine readers must separate those layers.

Where current TeeStock business documentation disagrees with an older product strategy statement:

```text
CURRENT TEEStock BUSINESS OWNER
```

must be resolved first.

---

# 21. `teestock-design-library-spec.md`

Path:

```text
teestock-design-library-spec.md
```

Original role:

```text
DESIGN LIBRARY / CURATED PRODUCT SPECIFICATION
```

The document explicitly states that several concepts are:

```text
PROPOSED

NOT IMPLEMENTED
```

including proposed lifecycle and extension semantics.

---

# 22. Design Library Current Classification

Current domain map classifies Design Library as:

```text
EXPERIMENTAL
```

Therefore:

```text
teestock-design-library-spec.md
```

must be interpreted as:

```text
PROPOSED / EXPERIMENTAL PRODUCT SPECIFICATION
```

not proof of implemented capability.

---

# 23. Design Library Implementation Safety

Machine readers MUST NOT infer:

```text
spec defines state
→ state exists in database
```

or:

```text
spec names command
→ command exists
```

or:

```text
spec defines entity
→ entity is canonical
```

Current canonical architecture and current source must be checked before implementation claims.

---

# 24. `teestock-asset-readiness.md`

Path:

```text
teestock-asset-readiness.md
```

Original role:

```text
LOCAL ASSET-READINESS EVIDENCE SNAPSHOT
```

Dated:

```text
2026-09-25
```

It records a bounded local evidence review.

It explicitly does not claim:

```text
remote catalog state

cloud asset state

production inventory state

current live commerce state
```

---

# 25. Asset Readiness Current Classification

Interpret:

```text
teestock-asset-readiness.md
```

as:

```text
HISTORICAL / BOUNDED EVIDENCE REFERENCE
```

for the inspected environment and date.

It is not a current Product Requirements Document.

It must not be used to claim:

```text
TeeStock currently has no designs
```

because the original document itself only established:

```text
insufficient local evidence
```

at its audit snapshot.

---

# 26. Product Directory Classification Matrix

| Document                                | Current role                                                       | Execution authority |
| --------------------------------------- | ------------------------------------------------------------------ | ------------------: |
| `README.md`                             | ACTIVE navigation index                                            |                NONE |
| `founder-control-documentation-plan.md` | ACTIVE current product-program manifest                            |                NONE |
| `teestock-development-plan.md`          | Legacy product-planning reference pending lifecycle reconciliation |                NONE |
| `teestock-curated-strategy.md`          | Legacy/domain-specific planning reference                          |                NONE |
| `teestock-design-library-spec.md`       | Proposed/experimental product specification                        |                NONE |
| `teestock-asset-readiness.md`           | Historical bounded evidence reference                              |                NONE |

No document in this table independently grants Builder authority.

---

# 27. Product Document Lifecycle Rule

Future product documents should use canonical lifecycle metadata:

```text
DRAFT

REVIEW

ACTIVE

DEPRECATED

SUPERSEDED

ARCHIVED
```

Interpretation:

```text
DRAFT
→ not authority

REVIEW
→ candidate authority

ACTIVE
→ authoritative within declared scope

DEPRECATED
→ temporarily valid but avoid for new work

SUPERSEDED
→ replaced by declared source

ARCHIVED
→ historical / provenance only
```

---

# 28. Product Maturity Is Separate From Document Lifecycle

A product PRD may have:

```text
status: ACTIVE
```

while its product maturity is:

```text
PRD_REVIEW
```

or:

```text
PRD_MATURE
```

These dimensions differ.

Document lifecycle answers:

```text
IS THIS DOCUMENT AN ACCEPTED SOURCE?
```

Product maturity answers:

```text
HOW READY IS THE PRODUCT DEFINITION
FOR THE NEXT DEVELOPMENT STAGE?
```

---

# 29. Founder Control PRD Maturity

Expected D1 maturity progression:

```text
PRD_DISCOVERY
↓
PRD_FRAMING
↓
PRD_STRUCTURING
↓
PRD_DRAFT
↓
PRD_REVIEW
↓
PRD_MATURE
↓
PRD_READY_FOR_DESIGN
↓
PRD_READY_FOR_ENGINEERING
```

Engineering work must not infer readiness merely from file existence.

---

# 30. Product Requirement Identification

Material product requirements should use stable identifiers such as:

```text
PROB-###

ACTOR-###

JTBD-###

OUTCOME-###

FR-###

BR-###

NFR-###

RISK-###

ASM-###

UNK-###

DEC-###

AC-###
```

This allows downstream traceability.

---

# 31. Supporting Specification IDs

Founder Attention may use:

```text
ATTN-###

VIEW-###

DEX-###
```

Operational Exception may use:

```text
EXC-###

EXC-BR-###

EXC-AC-###
```

Pilot planning may use:

```text
PILOT-###

PILOT-GATE-###

PILOT-EV-###
```

Exact identifiers are defined by their owning documents.

---

# 32. Requirement Traceability

Target relationship:

```text
BUSINESS PROBLEM
        ↓
PRODUCT PROBLEM
        ↓
OUTCOME
        ↓
FUNCTIONAL REQUIREMENT
        ↓
SUPPORTING PRODUCT SPEC
        ↓
ARCHITECTURE IMPACT
        ↓
WORK PACKAGE
        ↓
TEST
        ↓
EVIDENCE
```

Machine readers should be able to answer:

```text
WHY DOES THIS CODE EXIST?
```

from durable repository artifacts.

---

# 33. Current / Target / Gap

Product documents should explicitly separate:

```text
CURRENT

TARGET

GAP
```

Current means:

```text
supported present reality
```

Target means:

```text
approved intended behavior
```

Gap means:

```text
difference that must be resolved
```

Do not describe target design as though it already exists.

---

# 34. Verified / Decided / Proposed

Material product work should distinguish:

```text
VERIFIED

DECIDED

PROPOSED

ASSUMED

UNKNOWN

DEFERRED

REJECTED
```

No:

```text
PROPOSED
```

capability should silently become architecture or implementation authority.

---

# 35. Product Decisions

Material decisions should record:

```text
decision ID

status

decision

reason

alternatives

impact

owner

effective date

affected documents
```

This is particularly important for machine-driven engineering.

Conversation-only decisions should be promoted into durable documentation when material.

---

# 36. Product Non-Goal Discipline

Every substantial product specification should explicitly state:

```text
IN SCOPE

OUT OF SCOPE

FUTURE

NON-GOALS
```

This prevents AI implementations from treating:

```text
mentioned
```

as:

```text
required now
```

---

# 37. Evidence-Driven Capability Expansion

MGBOS product development should follow:

```text
REPEATED OPERATIONAL TRUTH
        ↓
PRODUCT NEED
        ↓
PRODUCT REQUIREMENT
        ↓
CANONICAL CAPABILITY
```

not:

```text
IMAGINABLE FUTURE BUSINESS
        ↓
NEW MODULE
```

without evidence.

---

# 38. Business Concept ≠ MGBOS Entity

TeeStock business documents may contain concepts such as:

```text
Opportunity

Project

Customer Case

Exception

Campaign

Program
```

These terms may be valid business concepts.

They do not automatically become:

```text
MGBOS root entity
```

Architecture promotion requires justification.

---

# 39. Opportunity Boundary

Current canonical MGBOS architecture treats generic:

```text
Opportunity
```

as deferred/evidence-required.

Product documentation must not introduce it merely to mirror CRM vocabulary.

---

# 40. Project Boundary

Current architecture also treats generic:

```text
Project
```

as deferred/conditional.

Existing:

```text
Requirement
+
Quote
+
Order
+
Production Jobs
```

should remain preferred until real coordination evidence proves they are insufficient.

---

# 41. Work Order Boundary

Work Order / SPK currently exists as a governed production artifact.

Product documentation must not silently promote it into:

```text
independent WorkOrder aggregate
```

without evidence for an independent lifecycle.

---

# 42. Operational Exception Boundary

Operational Exception is established as a canonical architectural domain:

```text
CANONICAL_TARGET
```

Following W2 canonical architecture reconciliation:

```text
canonical lifecycle:
RECONCILED (OPEN, ACKNOWLEDGED, RESOLVED, DISMISSED)

canonical commands:
RECONCILED (open, acknowledge, assign, reassign, change_severity, resolve, dismiss, reopen)

physical persistence & table design:
CURRENT DATABASE/DOMAIN FOUNDATION (app.operational_exceptions, app.operational_exception_audit, RPCs landed in WP-P2A-01)

runtime command boundary:
CURRENT SERVER ACTIONS, SCHEMAS & PERMISSIONS (8 server actions, 10 permissions, Zod validation landed in WP-P2A-02)

operator console:
CURRENT OPERATOR CONSOLE UI (apps/mgbos list /exceptions, detail /exceptions/[id], lifecycle modals landed in WP-P2A-03)

engineering readiness:
P2-A SOFTWARE COMPLETE (WP01, WP02, WP03 & WP04 COMPLETE / MERGED / POST-MERGE VERIFIED)

next step:
P2-B FOUNDER ATTENTION PLANNING (HEAD ENGINEERING / NOT AUTHORIZED FOR BUILDER)
```

---

# 43. Customer Case Boundary

Customer Case and Operational Exception should not be assumed equivalent.

Working conceptual distinction:

```text
CUSTOMER CASE
=
durable customer-facing issue

OPERATIONAL EXCEPTION
=
abnormal operational condition
```

Exact semantics require dedicated product/architecture work.

---

# 44. Founder Attention Boundary

Founder Attention is a product-experience concept.

It does not automatically imply:

```text
database table

new transaction state

notification service

AI agent

dashboard widget
```

Product definition must first answer:

```text
what deserves attention?

why?

how urgent?

for whom?

what is the next action?

what evidence supports it?

does the founder actually need to decide?
```

---

# 45. JARVIS Boundary

Founder Control product behavior must remain useful without requiring JARVIS runtime.

Preferred direction:

```text
MGBOS AUTHORITATIVE STATE
        ↓
DETERMINISTIC BUSINESS PROJECTION
        ↓
FOUNDER CONTROL
        ↓
JARVIS MAY ANALYZE / SUMMARIZE / RECOMMEND
```

Do not design product truth around LLM reconstruction.

---

# 46. AI Boundary

AI may later help with:

```text
interpretation

summarization

recommendation

drafting

pattern detection
```

AI should not own deterministic correctness for:

```text
money

authorization

state validity

fulfillment readiness

known thresholds

canonical business truth
```

---

# 47. Current TeeStock Pilot Direction

Current Founder Control planning expects TeeStock to provide the primary operational context.

Likely initial real-pilot vertical:

```text
CUSTOM / BUSINESS
ASSISTED-SALES
```

because the implemented operating spine already aligns strongly with custom/B2B semantics.

The exact pilot is owned by:

```text
teestock-operational-pilot-plan.md
```

when created and activated.

---

# 48. Public TeeStock Application Boundary

The current public TeeStock application is not sufficient evidence of a complete customer-facing commerce platform.

Therefore Founder Control product discovery must not automatically depend on:

```text
FULL PUBLIC STOREFRONT
```

being completed first.

An assisted-sales pilot remains a valid product-validation route if approved by the pilot plan.

---

# 49. Real Pilot ≠ Synthetic Test

Product validation must distinguish:

```text
AUTOMATED TEST

E2E TEST

OPERATOR ACCEPTANCE

REAL BUSINESS PILOT

PRODUCTION READINESS
```

Each proves something different.

---

# 50. Real Pilot Evidence Direction

Future pilot evidence may include:

```text
real inquiry

real customer

real requirement

real quote

real customer acceptance

real invoice

real payment

real Vendor

real production

real QC

real shipment

real Actual Cost

real Realized Margin

real operational abnormality

real founder intervention
```

No transaction should be fabricated merely to meet a pilot metric.

---

# 51. Product-to-Architecture Gate

After product documents are mature:

```text
FOR EACH APPROVED REQUIREMENT
        ↓
CAN CURRENT CANONICAL ARCHITECTURE
REPRESENT IT CORRECTLY?
        ↓
YES
→ reuse existing semantics
        ↓
NO
→ architecture impact review
```

Only justified semantic changes should alter canonical architecture.

---

# 52. Product-to-Implementation Gate

Product documentation does not hand directly to the Builder.

Required flow:

```text
PRD_READY_FOR_ENGINEERING
        ↓
ENGINEERING DISCOVERY
        ↓
CURRENT SOURCE AUDIT
        ↓
CANONICAL ROUTING
        ↓
TECHNICAL PLAN
        ↓
IMPLEMENTATION CONTRACT
        ↓
WORK PACKAGE
        ↓
BUILDER
```

---

# 53. No Raw PRD Builder Handoff

Do NOT give a Builder an instruction such as:

```text
"Read Founder Control PRD
and implement everything."
```

A PRD can contain:

```text
future ideas

tradeoffs

non-goals

unknowns

multiple requirements
```

Engineering must convert it into bounded work first.

---

# 54. Product Reading Order — Current Founder Control Work

For current Founder Control product work, default reading order:

```text
1.
this README

2.
founder-control-documentation-plan.md

3.
relevant TeeStock business documents

4.
relevant MGBOS canonical architecture

5.
Phase 1 closure evidence
when current capability baseline matters

6.
D1 Founder Control PRD
when created

7.
D2 Founder Attention Spec
when created

8.
D3 Operational Exception Spec
when created

9.
D4 Real Operational Pilot Plan
when created
```

---

# 55. Product Reading Order — Curated Work

For future curated-design work:

```text
1.
current TeeStock business documentation

2.
teestock-curated-strategy.md
as historical/domain-specific planning reference

3.
teestock-design-library-spec.md
as proposed/experimental specification

4.
teestock-asset-readiness.md
as bounded historical evidence

5.
current MGBOS canonical architecture

6.
current source
```

Do not reverse this order and treat the old MGBOS product file as business authority.

---

# 56. Session Notes Are Not Product Authority

Historical references under:

```text
catatan/sesi/
```

may preserve:

```text
reasoning

brainstorming

early specifications

decision provenance
```

but they must not serve as the primary current source for production product requirements when dedicated current documentation exists.

---

# 57. Archive Sources Are Context

Historical TeeStock materials under:

```text
bisnis/teestock/archive/
```

may contain valuable provenance.

They remain:

```text
HISTORICAL CONTEXT
```

unless their content has been promoted into current business documentation.

A product document must not revive an archive rule merely because it is detailed.

---

# 58. Pricing Safety

Older product documents contain historical price assumptions, margins, discount concepts, and pilot thresholds.

Machine readers MUST NOT assume those numbers remain current commercial policy.

Current pricing behavior must be resolved through:

```text
current TeeStock business policy

+

current MGBOS financial invariants

+

current applicable implementation
```

---

# 59. Payment Policy Safety

Historical pilot examples may use:

```text
DP 50%
```

This does not automatically establish:

```text
UNIVERSAL CURRENT PAYMENT POLICY
```

for all TeeStock Custom/Business transactions.

Pilot and PRD documents must label payment policy explicitly.

---

# 60. Design-Library Safety

Historical Design Library documents include proposed:

```text
state names

commands

publication gates

asset models
```

These must not leak into current canonical architecture without architecture review.

Detailed proposal:

```text
≠ implementation
```

---

# 61. Asset Evidence Safety

Historical asset-readiness findings are snapshot-bound.

Do not infer:

```text
no local evidence found
→ asset does not exist
```

or:

```text
file exists
→ rights are valid
```

or:

```text
catalog record exists
→ product is production-ready
```

Each claim requires its own evidence.

---

# 62. Product Document Creation Rule

Create a new product document only when it has:

```text
distinct semantic purpose

clear owner

clear consumers

clear lifecycle

clear authority boundary

material decision value
```

Do not create documents solely to make the tree appear comprehensive.

---

# 63. Product Document Merge Rule

Do not create a separate product document when its contents belong entirely inside an existing semantic owner.

Example:

```text
one small Founder Attention rule
```

should not become another independent file if D2 clearly owns it.

---

# 64. Product Document Split Rule

A separate document is appropriate when:

```text
topic has independent lifecycle

topic is materially complex

topic serves distinct downstream consumers

topic needs independent maturity

combining it would create ambiguity
```

This is why current planning separates:

```text
Founder Control PRD

Founder Attention

Operational Exception

Real Pilot
```

---

# 65. Full-File Delivery Standard

For Vibe Engineering documentation workflows, major product files should normally be delivered as:

```text
ACTION:
CREATE / REPLACE

PATH:
exact/path.md

STATUS:
ACTIVE

CONTENT:
complete file
```

Routine Owner work should not require manual patch assembly.

---

# 66. Internal Review Standard

Before product documentation is activated, review for:

```text
authority correctness

business-source alignment

canonical architecture alignment

current implementation assumptions

scope clarity

non-goals

decision consistency

assumption labeling

requirement traceability

machine readability

failure behavior

document lifecycle
```

---

# 67. Owner Interaction Principle

The Owner remains final decision maker.

However routine:

```text
source review

documentation QA

semantic consistency audit

cross-reference review

metadata review
```

should be handled before Owner-facing delivery.

Escalate only material decisions that cannot safely be resolved from established business intent, canonical policy, or repository evidence.

---

# 68. Current Documentation Debt

Known product-documentation debt includes:

```text
legacy product files without canonical frontmatter

historical session-note references

archive dependencies

old pilot terminology

older development-plan priorities

unclear lifecycle on legacy product docs
```

These should be reconciled when they materially affect current machine routing.

They should not automatically block Founder Control documentation if their authority is already clearly bounded.

---

# 69. Current Parent-Index Drift

The MGBOS master documentation index may still list:

```text
target directories

historical product layout

non-existent support files
```

because it represents a broader canonical target structure.

Machine readers must distinguish:

```text
CANONICAL TARGET TREE
```

from:

```text
CURRENT PHYSICAL TREE
```

This product index owns current product-directory routing within its declared scope.

---

# 70. Product Success Principle

Product documentation quality is not measured by:

```text
number of documents

number of features

number of modules

document length
```

It is measured by whether the repository can determine:

```text
WHAT PROBLEM EXISTS

WHY IT MATTERS

WHO EXPERIENCES IT

WHAT PRODUCT OUTCOME IS REQUIRED

WHAT IS NOT REQUIRED

WHAT DECISIONS HAVE BEEN MADE

WHAT REMAINS UNKNOWN

WHAT MAY MOVE INTO ARCHITECTURE

WHAT IS READY FOR ENGINEERING
```

without reconstructing private conversation history.

---

# 71. Founder-Control Program State

Current canonical product-program interpretation:

```text
PRODUCT PROGRAM
=
FOUNDER CONTROL

DOCUMENTATION PLAN (D0)
=
ACTIVE

PARENT PRD (D1)
=
ACTIVE (PRD_MATURE)

FOUNDER ATTENTION SPEC (D2)
=
ACTIVE (SPEC_MATURE)

OPERATIONAL EXCEPTION SPEC (D3)
=
ACTIVE (CANONICAL_ARCHITECTURE_RECONCILED)

REAL PILOT PLAN (D4)
=
ACTIVE (PILOT_PLAN_MATURE / PILOT_EXECUTION_BLOCKED)

PRODUCT DEFINITION PACKAGE D1-D4
=
APPROVED_BY_OWNER

ARCHITECTURE RECONCILIATION (W2)
=
COMPLETE

ENGINEERING READINESS
=
P2-A SOFTWARE COMPLETE (WP-P2A-01, WP-P2A-02, WP-P2A-03 & WP-P2A-04 COMPLETE / MERGED / POST-MERGE VERIFIED)

ACTIVE IMPLEMENTATION PHASE
=
PHASE 2 FOUNDER CONTROL (BOUNDED TO AUTHORIZED WORK PACKAGES ONLY)

PHASE 2 WORK PACKAGES
=
WP-P2A-01: COMPLETE / MERGED / POST-MERGE VERIFIED (PR #42)
WP-P2A-02: COMPLETE / MERGED / POST-MERGE VERIFIED (PR #44)
WP-P2A-03: COMPLETE / MERGED / POST-MERGE VERIFIED (PR #46)
WP-P2A-04: COMPLETE / MERGED / POST-MERGE VERIFIED (PR #48 @ 77fbcbf08f2699ab85a0682ec4c981235c9c18cf)
ACTIVE WORK PACKAGE: NONE
NEXT CANDIDATE: P2-B FOUNDER ATTENTION PLANNING (NOT AUTHORIZED FOR BUILDER)
BUILDER AUTHORIZATION: NONE
```

---

# 72. Current Product Next Step

Founder Control product definition package (D1–D4) is defined and approved by Owner:

```text
D0 — founder-control-documentation-plan.md
D1 — teestock-founder-control-prd.md
D2 — founder-attention-experience-spec.md
D3 — operational-exception-spec.md
D4 — teestock-operational-pilot-plan.md
```

Canonical architecture reconciliation (W2) across all 6 core MGBOS architecture specifications is COMPLETE. W3 Engineering Discovery is analysis-complete and the P2-A Technical Plan is active.

WP-P2A-01 (`feat(mgbos): add operational exception database foundation`, PR #42 @ `aad21534c369829d408db424bb0546aad0d28bd2`), WP-P2A-02 (`feat(mgbos): add operational exception runtime command boundary`, PR #44 @ `b8262cca87a7d2644cf1738bf54fe72e8c4545f1`), WP-P2A-03 (`feat(mgbos): add operational exception console`, PR #46 @ `23d4fd3d184d5bf60c9d41e57a1c01fe3517c132`), and WP-P2A-04 (`test(mgbos): add operational exception assurance suite and wp04 reflection`, PR #48 @ `77fbcbf08f2699ab85a0682ec4c981235c9c18cf`) have been successfully merged and post-merge verified, completing the P2-A software slice.

The next durable gate is:

```text
P2-B FOUNDER ATTENTION
TECHNICAL PLANNING & DESIGN
(HEAD ENGINEERING)
```

No runtime implementation authority exists for P2-B or subsequent packages until authorized contracts and work packages are approved. Phase 2 implementation is governed package-by-package. See [Phase 2 Founder Control Implementation Index](../implementation/phase-2-founder-control/README.md).

---

# 73. Machine Query Examples

Question:

```text
"What is the current MGBOS product program?"
```

Answer:

```text
FOUNDER CONTROL
```

---

Question:

```text
"Should I implement the old TeeStock development plan?"
```

Answer:

```text
NO.

It is a legacy planning reference,
not current implementation authority.
```

---

Question:

```text
"Is Design Library implemented?"
```

Answer:

```text
DO NOT INFER FROM PRODUCT SPEC.

Check current architecture and source.
```

---

Question:

```text
"What should be built next?"
```

Answer:

```text
NO RUNTIME IMPLEMENTATION
IS CURRENTLY AUTHORIZED.

P2-A SOFTWARE FOUNDATION
IS COMPLETE AND POST-MERGE VERIFIED.

NEXT TECHNICAL CANDIDATE
=
P2-B FOUNDER ATTENTION PLANNING

AUTHORIZATION
=
NOT YET GRANTED

HEAD ENGINEERING
MUST FIRST PREPARE
TECHNICAL SPECIFICATIONS AND CONTRACTS.
```

Current program state from this index:

```text
W3 ENGINEERING DISCOVERY
=
ANALYSIS COMPLETE

P2-A TECHNICAL PLAN
=
ACTIVE (P2-A SOFTWARE COMPLETION GATE SATISFIED)

WP-P2A-01
=
COMPLETE / MERGED / POST-MERGE VERIFIED (PR #42)

WP-P2A-02
=
COMPLETE / MERGED / POST-MERGE VERIFIED (PR #44)

WP-P2A-03
=
COMPLETE / MERGED / POST-MERGE VERIFIED (PR #46)

WP-P2A-04
=
COMPLETE / MERGED / POST-MERGE VERIFIED (PR #48 @ 77fbcbf08f2699ab85a0682ec4c981235c9c18cf)

P2-A STATUS
=
SOFTWARE COMPLETE (INTEGRATION LAYER)

ACTIVE WORK PACKAGE
=
NONE

NEXT ENGINEERING GATE
=
P2-B FOUNDER ATTENTION PLANNING & TECHNICAL DESIGN (HEAD ENGINEERING)

ACTIVE IMPLEMENTATION PHASE
=
PHASE 2 FOUNDER CONTROL (BOUNDED)

BUILDER AUTHORIZATION
=
NONE
```

---

# 74. Final Principle

The product directory should act as the bridge between:

```text
BUSINESS REALITY
        ↓
PRODUCT INTENT
        ↓
GOVERNED SYSTEM DESIGN
```

not as a dumping ground for:

```text
strategy

architecture

implementation

evidence

historical notes
```

mixed together.

Current canonical direction:

> **Founder Control is the active MGBOS product-definition program. Existing TeeStock product files remain useful as bounded historical/domain-specific references, but they do not override current business truth, canonical architecture, Phase 1 closure evidence, or the active Founder Control documentation program.**
