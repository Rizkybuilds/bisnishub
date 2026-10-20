---
canonical_id: docs.strategy.personas.index
status: REVIEW
version: 1.0.0
owner: Rizky
author: Antigravity / Builder
approver: Rizky
scope: repository-strategy
document_class: index
effective_from: 2026-10-20

authoritative_for:
  - strategy personas index and navigation
  - strategy persona directory structure
  - strategy persona coordination architecture

not_authoritative_for:
  - canonical roles and permissions
  - risk classification
  - approval or merge authority
  - execution contracts
  - runtime implementation or production readiness
  - legal co-founder or fiduciary authority
  - financial transactions or external commitments

last_reviewed: 2026-10-20
reviewed_against_revision: af8ed0ff3a6662dc1db7e605932f744361e5ac62
review_cadence: quarterly

depends_on:
  - ../../project-index.md
  - ../../governance/canonical-source-map.md
  - ../../governance/documentation-constitution.md
  - ../../governance/cross-system-risk-classification.md
  - ../../governance/approval-policy.md
  - ../../operating-model/solo-founder-operating-system.md
  - orion/README.md
  - ../../../AGENTS.md

supersedes: null
---

# Strategy Personas

## 1. Purpose of Strategy Personas

Strategy personas in BisnisHub provide a durable, versioned, portable, and evaluable conversational and operational thinking partner for the human Founder across:
- Business and portfolio strategy
- Business model design and unit economics
- Product strategy and customer problem definition (PRDs)
- Commercial and financial reasoning
- Market and competitive intelligence
- Brand identity and customer experience
- Go-to-market and growth experimentation
- Founder resource and attention allocation
- Strategic decision preparation
- Structured coordination with the Head Engineering function

### Essential Persona Boundary
A persona is a **behavioral wrapper and cognitive reasoning discipline**, not a governance mechanism, legal status, or execution authority.

```text
STRATEGY PERSONA (ORION)
      ≠
HUMAN FOUNDER / OWNER (Rizky — Sole Final Authority)
      ≠
CANONICAL ROLES (Planner, Engineer, Auditor, QA, Release Operator)
      ≠
HEAD ENGINEERING FUNCTION (Existing HEAD_FUNCTION / ATLAS)
      ≠
BUSINESS RUNTIME PLATFORM (JARVIS — Future Architecture)
      ≠
SYSTEM OF RECORD (MGBOS)
      ≠
LEGAL CO-FOUNDER / EQUITY HOLDER / CORPORATE OFFICER
      ≠
TRANSACTIONAL / APPROVAL / MERGE / DEPLOYMENT AUTHORITY
```

Adopting a strategy persona grants:
- **Zero permissions**
- **Zero legal or corporate authority**
- **Zero financial execution authority**
- **Zero merge or deployment authority**
- **Zero autonomy promotion**
- **Zero approval bypass**

---

## 2. Strategy Personas Registry

| Persona | Call Sign / Acronym | Functional Role | Primary Scope | Status | Directory |
|---|---|---|---|---|---|
| **ORION** | Opportunity, Reality, Insight, Outcomes & Navigation | AI Strategic Co-Founder / Chief Strategic Thinking Partner | Business, Portfolio, Product & Commercial Strategy | `REVIEW` (Candidate in PR #89; manual adoption ready) | [`orion/`](orion/README.md) |

---

## 3. Triad Coordination Architecture

The relationship between the Founder, Strategic Reasoning (ORION), Engineering Leadership, and Governed Implementation is modeled as a functional coordination hierarchy:

```mermaid
flowchart TD
    Founder["OWNER / HUMAN FOUNDER (Rizky)<br/><b>Sole Final Authority & Fiduciary Responsibility</b>"]
    
    ORION["ORION — STRATEGIC CO-FOUNDER<br/><i>Opportunity, Reality, Insight, Outcomes & Navigation</i><br/>Business, Product, Commercial & Portfolio Strategy"]
    
    HeadEng["HEAD ENGINEERING FUNCTION<br/><i>Existing HEAD_FUNCTION / ATLAS (Proposed in PR #88)</i><br/>Engineering Architecture, Routing & Coordination"]
    
    Builders["AUTHORIZED IMPLEMENTATION<br/><i>Antigravity / Codex Builders</i><br/>Bounded Work Packages & Evidence"]
    
    JARVIS["JARVIS BUSINESS RUNTIME<br/><i>Future Governed Business Orchestration Platform</i>"]

    Founder <-->|"Vision, Direction & Final Decisions"| ORION
    Founder <-->|"Governed Approvals & Implementation Grants"| HeadEng
    ORION -->|"Structured Business Outcome Briefs"| HeadEng
    HeadEng -->|"Feasibility, Options & Risk Tradeoffs"| ORION
    HeadEng -->|"Bounded Work Packages (Contracts)"| Builders
    Builders -->|"Engineering Reports & Evidence"| HeadEng
    Founder -.->|"Future Governed Runtime Deployment"| JARVIS
```

### Core Rule of Functional Separation & Engineering Handoff
- **ORION owns the *Why* and the *What*:** Business objectives, customer journeys, commercial constraints, opportunity costs, and strategic priorities.
- **Head Engineering owns the *How*:** Technical feasibility, engineering architecture, risk classification, task routing, builder handoffs, quality assurance, and verification matrices.
- **Maturity of the Head Engineering Function:** The Head Engineering function (`HEAD_FUNCTION`) is already established as an active canonical coordination authority in repository governance ([`docs/engineering/vibe-engineering/team-operating-protocol.md`](../../engineering/vibe-engineering/team-operating-protocol.md)). **ATLAS** is the candidate named coordination persona for that function introduced in PR #88 (branch `docs/atlas-head-engineering-persona-v1`). PR #88 must be evaluated independently for its actual integration state. ORION's strategic handoffs target the established Head Engineering function directly; they do not depend on PR #88 being merged.
- **Builders own *Bounded Execution*:** Implementing authorized code or documentation changes strictly within approved scopes and stop conditions.
- **JARVIS is a *Separate Planned Platform*:** A future business orchestration architecture, not an immediate consequence of running conversational strategy sessions.

---

## 4. Directory Navigation

The strategy personas directory is organized as follows:

```text
docs/strategy/personas/
├── README.md                                  # Strategy personas index (this document)
└── orion/
    ├── README.md                              # ORION persona overview, adoption & navigation
    ├── character-specification.md             # Comprehensive character bible & reasoning spec
    ├── operational-prompt.md                  # Portable, copy-ready session bootstrap prompt
    ├── behavioral-evaluation.md               # 36-case behavioral evaluation test matrix
    └── decision-and-handoff-templates.md      # Founder Decision Card & Head Engineering intake templates
```

---

## 5. Canonical Authority Disclaimer

All strategy persona specifications and prompts are **strictly non-normative cognitive aids**.

If any statement in a persona document conflicts with an active canonical repository source:
```text
CANONICAL GOVERNANCE
WINS
```
and the persona document must be corrected.

Authoritative upstream governance sources:
- Root repository rules: [`AGENTS.md`](../../../AGENTS.md)
- Canonical authority map: [`docs/governance/canonical-source-map.md`](../../governance/canonical-source-map.md)
- Documentation constitution: [`docs/governance/documentation-constitution.md`](../../governance/documentation-constitution.md)
- Cross-system risk classification: [`docs/governance/cross-system-risk-classification.md`](../../governance/cross-system-risk-classification.md)
- Approval policy: [`docs/governance/approval-policy.md`](../../governance/approval-policy.md)
- Autonomy levels: [`docs/governance/autonomy-levels.md`](../../governance/autonomy-levels.md)
- Solo-Founder operating model: [`docs/operating-model/solo-founder-operating-system.md`](../../operating-model/solo-founder-operating-system.md)
- Cross-system architecture: [`docs/architecture/master-system-blueprint.md`](../../architecture/master-system-blueprint.md)
- System boundaries: [`docs/architecture/system-boundaries.md`](../../architecture/system-boundaries.md)

---

## 6. Adoption Lifecycle & Change Management

### Adoption Lifecycle States
Per the BisnisHub Documentation Constitution ([`docs/governance/documentation-constitution.md`](../../governance/documentation-constitution.md)), documentation lifecycle and operational readiness are distinct:
1. **Documentation Exists in a PR:** Current state (`status: REVIEW`). The persona specifications exist as proposed candidates in PR #89 awaiting Owner audit and acceptance.
2. **Approved & Integrated Documentation:** Occurs only when PR #89 is formally reviewed, accepted, and merged into `main` by the Owner, transitioning status to `ACTIVE`.
3. **Manual Session Adoption:** Ready immediately. The operational prompt is functionally self-contained and copy-ready for manual use in external LLM sessions.
4. **Behavioral Evaluation:** Currently `BEHAVIORAL_EVALUATION_NOT_RUN`. The 36 test scenarios (including 10 critical cases) are specified, but live execution against LLM endpoints has not yet occurred.
5. **Automated Runtime Implementation:** Currently `RUNTIME_NOT_INSTALLED`. No automated background daemons, scheduled cron jobs, or persistent agent runtimes are authorized or built in this phase.

### Change Management & Risk Routing
- Changes to non-normative persona profiles, prompts, or explanatory text are routed under task type `documentation-change` (risk floor `R0`), evaluated contextually under [`docs/governance/cross-system-risk-classification.md`](../../governance/cross-system-risk-classification.md). Markdown changes alone do not guarantee `R0` if normative boundaries are affected.
- Any modification attempting to alter normative governance, roles, task routing, capabilities, tool permissions, or security gates must be classified under `governance-change` (risk floor `R1`, with contextual escalation up to `R4`/`R5` where security, financial, or production consequence warrants) and requires explicit human Owner approval under [`docs/governance/approval-policy.md`](../../governance/approval-policy.md).
