---
canonical_id: docs.strategy.personas.orion.decision-and-handoff-templates
status: REVIEW
version: 1.0.0
owner: Rizky
author: Antigravity / Builder
approver: Rizky
scope: repository-strategy
document_class: template
effective_from: 2026-10-20

authoritative_for:
  - founder decision card template
  - orion to atlas engineering intake brief template
  - strategic uncertainty tracker template
  - decision closeout standard

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
  - README.md
  - character-specification.md
  - operational-prompt.md
  - ../../../project-index.md
  - ../../../governance/canonical-source-map.md
  - ../../../governance/documentation-constitution.md
  - ../../../governance/cross-system-risk-classification.md
  - ../../../governance/approval-policy.md
  - ../../../../AGENTS.md

supersedes: null
---

# ORION — Founder Decision Card & ATLAS Handoff Templates v1.0

> **Notice:** These templates are **human-facing decision and coordination aids**. They do not constitute machine-executable authorization, automatic approval grants, or canonical state transitions on their own.

---

## A. One-Page Founder Decision Card

Use this structured format whenever preparing a material strategic choice for the human Founder:

```yaml
DECISION_TOPIC: <Specific strategic or operational question>
BUSINESS_UNIT: <TeeStock | MultiGraph | MultiGraph Group Portfolio | Other>
RECOMMENDATION: <One clear, actionable sentence>
DECISION_STATUS: PROPOSED   # PROPOSED | OWNER_ACCEPTED | DEFERRED | REJECTED (Not Owner approval until formally signed)
OWNER_OBJECTIVE: <Specific customer, commercial, or operational outcome sought>
WHY_NOW: <Real operational or commercial catalyst driving urgency>

CURRENT_TRUTH:
  source_evidence: <Canonical document link + exact git revision or observed data>
  observed_at: <ISO 8601 timestamp or date>
  verified_facts:
    - <Fact 1: empirically confirmed reality>
  working_assumptions:
    - <Assumption 1: unverified belief required for this direction>
  known_unknowns:
    - <Unknown 1: missing critical information>

OPTIONS_ANALYSIS:
  - option: <Option A — Recommended Direction>
    upside: <Commercial or operational benefit>
    direct_cost: <Capital, time, and attention required>
    downside_risk: <What happens if this fails>
    reversibility: <HIGH | MEDIUM | LOW — cost/effort to undo>
  - option: <Option B — Low-Cost Test / Bounded Pilot>
    upside: <Fastest learning or risk mitigation>
    direct_cost: <Minimal resources required>
    downside_risk: <Delayed full rollout>
    reversibility: <HIGH>
  - option: <Option C — Defer / Do Nothing>
    upside: <Zero capital spent; preserves founder attention>
    opportunity_cost: <What is foregone or delayed>
    downside_risk: <Accumulating bottleneck or competitive lag>
    reversibility: <HIGH>

RISK_EVALUATION:
  highest_risk_category: <CAPITAL | FULFILLMENT | CUSTOMER_TRUST | BRAND_IP | SECURITY | TIME>
  irreversible_consequences: <Any commitments that cannot easily be walked back>
  opportunity_cost: <What immediate priorities are displaced by doing this now>

VALIDATION_EXPERIMENT:
  smallest_test: <The fastest, cheapest physical test that produces decisive evidence>
  success_signal: <Measurable quantitative or qualitative signal indicating product-market pull>
  stop_or_pivot_signal: <Specific disconfirming evidence that falsifies this direction>

OWNER_ACTION_REQUIRED:
  decision_required: <YES / NO>
  exact_choice_needed: <Clear description of what the founder must confirm>
  next_recipient: <Owner | ATLAS Head Engineering | Specialist | None>
```

---

## B. ORION → ATLAS Governed Engineering Intake Brief

When a founder decision requires software development or architectural changes, ORION prepares this intake brief for the Head Engineering function (coordinated via ATLAS):

```text
================================================================================
ORION → ATLAS BUSINESS OUTCOME BRIEF
================================================================================
BRIEF_ID:                     <e.g. BOB-TS-20261020-01>
TARGET_BUSINESS:              <TeeStock | MultiGraph | MGBOS | Shared>
DATE:                         <YYYY-MM-DD>
REPOSITORY_BASELINE_SHA:      <Exact commit SHA observed>

1. BUSINESS OBJECTIVE & CUSTOMER PROBLEM:
   - What real customer or operational problem are we solving?
   - Why is solving this necessary for commercial progress?

2. DESIRED BUSINESS OUTCOME:
   - What measurable commercial or operational outcome defines success?
   - What is the expected impact on founder leverage or revenue?

3. OWNER DIRECTION & DECISION REFERENCE:
   - Decision Reference: <Link to Decision Card or Decision Register>
   - Owner Confirmation Status: <OWNER_ACCEPTED | PROPOSED_FOR_FEASIBILITY>

4. CUSTOMER EXPERIENCE & ACCEPTANCE OUTCOMES:
   - Primary user journey:
   - Key customer-visible acceptance criteria:
   - Operational acceptance criteria (e.g. order tracking, notification):

5. EXPLICIT SCOPE BOUNDARIES:
   - IN_SCOPE:     <Bullet points of strictly required functional boundaries>
   - OUT_OF_SCOPE: <Features explicitly excluded to maintain minimal scope>
   - NON_GOALS:    <Explicit temptations to be rejected during this cycle>

6. MUST-NOT-BREAK INVARIANTS & CONSTRAINTS:
   - Financial constraints:   <e.g. zero automated unauthorized refunds>
   - Security boundaries:     <e.g. no public access to internal order data>
   - Operational constraints: <e.g. compatible with manual shipping workflow>

7. KNOWN UNKNOWNS & TECHNICAL DISCOVERY:
   - What technical questions must ATLAS evaluate before building?

8. PRIORITY & OPPORTUNITY COST RATIONALE:
   - Why should this work displace other candidate engineering items?

9. AUTHORITY & GOVERNANCE DISCLAIMER:
   IMPLEMENTATION_AUTHORITY:           NONE_FROM_THIS_BRIEF
   MERGE_DEPLOY_PRODUCTION_AUTHORITY: NONE_FROM_THIS_BRIEF
================================================================================
```

> [!NOTE]
> Receiving this brief does not authorize implementation. The Head Engineering function (coordinated via ATLAS when active) must perform technical investigation, risk classification, task routing, and Work Package authoring under governed Control Plane contracts before any Builder writes code. The handoff targets the established Head Engineering function directly and does not depend on PR #88 being merged.

---

## C. Critical Strategic Uncertainty Tracker

Use this register to maintain visibility into unverified claims across the business portfolio:

| Strategic Claim / Hypothesis | Status | Source / Revision | Falsification Signal (What Would Change Mind) | Required Owner Decision |
|---|---|---|---|---|
| *Example 1: Curated 4-SKU Drop Demand* | `HYPOTHESIS` | Customer waitlist inquiry | < 5% conversion from qualified waitlist to paid purchase | Whether to order production blank inventory |
| *Example 2: Retail Preview Equals Live Storefront* | `FALSE_WITHOUT_PROOF` | PR #86 candidate branch | Live checkout, payment webhook, and shipping fulfillment verification | Refuse to claim sales readiness until verified |
| *Example 3: DTF Vendor Margin Stability* | `UNVERIFIED` | Verbal vendor quote | Written price schedule showing minimum order quantities and defect policies | Formal vendor commitment sign-off |

---

## D. Decision Closeout & Outcome Logging Standard

A proposed decision does not become active business policy simply because ORION authored a compelling brief.

### Rules for Decision Closeout:
1. **Human Confirmation:** The Owner must formally approve the decision in the relevant business Decision Register (e.g. `bisnis/teestock/00-foundation/decision-register.md`).
2. **Outcome Verification:** After executing an approved test or feature, the actual empirical result must be logged against the initial hypothesis.
3. **No Retrospective History Rewriting:** If an outcome contradicts the recommendation, document the surprise honestly. Falsified hypotheses are valuable learning assets, not errors to be concealed.
