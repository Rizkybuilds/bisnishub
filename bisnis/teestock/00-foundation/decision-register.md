---
title: "TeeStock Decision Register"
date: "2026-09-28"
bisnis: teestock
kategori: catatan
status: active
tags:
  - bisnis/teestock
  - kategori/catatan
  - teestock/canonical
  - teestock/foundation
document_id: "TS-FND-004"
version: "1.1"
category: "foundation"
business: "teestock"
last_updated: "2026-10-20"
path: "00-foundation/decision-register.md"
depends_on:
  - "TS-FND-001"
  - "TS-FND-002"
  - "TS-FND-003"
  - "TS-ROOT-001"
---


# TeeStock Decision Register v1.1

> [!abstract] **Canonical TeeStock Strategic, Architectural, Operational & Governance Decision Memory**
>
> [!info] **Dependencies & Data Flow (SSOT)**
> [[bisnis/teestock/00-foundation/teestock-master-definition|TS-FND-001: TeeStock Master Definition]] • [[bisnis/teestock/00-foundation/glossary|TS-FND-002: TeeStock Glossary]] • [[bisnis/teestock/00-foundation/documentation-governance|TS-FND-003: TeeStock Documentation Governance]] • [[bisnis/teestock/README|TS-ROOT-001: TeeStock Canonical Business Blueprint — README]]


Dokumen ini menyimpan keputusan material TeeStock beserta konteks, alasan, alternatif, evidence, dampak, owner, status, dan konsekuensinya terhadap bisnis, sistem, data, operasi, automation, dan AI.

---

# 1. Purpose

Decision Register menjawab:

> **Kenapa TeeStock memilih suatu arah, kapan keputusan itu dibuat, evidence apa yang mendukungnya, apa konsekuensinya, dan apakah keputusan itu masih berlaku?**

Canonical principle:

> **Preserve the reasoning behind material decisions—not just the outcome.**

---

# 2. Canonical Definition

> **TeeStock Decision Register adalah authoritative historical memory untuk material business and system decisions yang cukup penting untuk memengaruhi strategy, business architecture, economics, operations, data, technology, legal governance, automation, AI authority, or capital allocation.**

---

# 3. Decision Register ≠ Meeting Notes

Canonical:

```text id="dr001"
MEETING NOTES
capture discussion.

DECISION REGISTER
captures the decision that governs what happens next.
```

---

# 4. Decision Register ≠ Task Tracker

Task answers:

```text id="dr002"
WHAT NEEDS TO BE DONE?
```

Decision Register answers:

```text id="dr003"
WHY ARE WE DOING IT THIS WAY?
```

---

# 5. Decision Register ≠ Documentation Changelog

Changelog says:

```text id="dr004"
WHAT CHANGED.
```

Decision Register says:

```text id="dr005"
WHY THE CHANGE WAS APPROVED.
```

---

# 6. Why It Matters

Without decision memory, TeeStock risks:

```text id="dr006"
REPEATING OLD DEBATES
REVERSING GOOD DECISIONS WITHOUT CONTEXT
BUILDING CONTRADICTORY SYSTEMS
MISINTERPRETING OLD ARCHITECTURE
LOSING FOUNDER KNOWLEDGE
```

---

# 7. Core Decision Principle

> **Material decisions should leave an auditable reason trail.**

---

# 8. What Counts as Material

A decision is material if it significantly affects one or more of:

```text id="dr007"
BUSINESS MODEL
BRAND ARCHITECTURE
REVENUE MODEL
PRICING
OPERATIONS
FINANCE
LEGAL / IP
DATA MODEL
SYSTEM ARCHITECTURE
AUTOMATION
AI AUTHORITY
CAPITAL ALLOCATION
```

---

# 9. Non-Material Decisions

Do not register every:

```text id="dr008"
TYPO
UI LABEL
MINOR COPY CHANGE
SMALL INTERNAL TASK
```

unless they reveal a broader policy decision.

---

# 10. Decision Categories

Canonical:

```text id="dr009"
STRATEGIC
BUSINESS_MODEL
BRAND
COMMERCIAL
OPERATIONS
FINANCE
LEGAL_IP
DATA
TECHNOLOGY
AUTOMATION
AI
SECURITY
INFRASTRUCTURE
ORGANIZATION
ROADMAP
```

---

# 11. Decision ID

Canonical pattern:

```text id="dr010"
DEC-TS-{YEAR}-{NNN}
```

Example:

```text id="dr011"
DEC-TS-2026-001
```

---

# 12. Decision ID Is Immutable

Once created:

```text id="dr012"
DECISION ID
DOES NOT CHANGE
```

even if the decision is later superseded.

---

# 13. Decision Status

Canonical:

```text id="dr013"
PROPOSED
APPROVED
ACTIVE
SUPERSEDED
REVERSED
EXPIRED
REJECTED
```

---

# 14. Proposed

Decision is under consideration.

---

# 15. Approved

Decision has been authorized but may not yet be fully implemented.

---

# 16. Active

Decision currently governs TeeStock.

---

# 17. Superseded

Replaced by a newer decision.

---

# 18. Reversed

Explicitly undone.

---

# 19. Expired

Decision had a defined temporary period and is no longer active.

---

# 20. Rejected

Proposal was considered but not adopted.

---

# 21. Rejected Decisions Can Be Valuable

Canonical.

They preserve:

```text id="dr014"
WHAT WAS CONSIDERED
AND WHY IT WAS NOT CHOSEN.
```

---

# 22. Decision Record Schema

Each material decision should contain:

```text id="dr015"
Decision ID
Title
Date
Status
Category
Owner
Decision
Context
Problem
Options Considered
Rationale
Evidence
Assumptions
Consequences
Risks
Dependencies
Affected Documents
Affected Systems
Review Trigger
Supersedes / Superseded By
```

---

# 23. Minimal Decision Record

For smaller decisions:

```text id="dr016"
ID
DATE
DECISION
RATIONALE
IMPACT
OWNER
STATUS
```

may be sufficient.

---

# 24. Decision Title

Should be explicit.

Good:

```text id="dr017"
Use an asset-light partner production model before vertical integration.
```

Bad:

```text id="dr018"
Production decision.
```

---

# 25. Decision Statement

Should state one clear choice.

---

# 26. Example

```text id="dr019"
TeeStock will operate asset-light and use qualified external production partners until sustained volume and capital economics justify selective internalization.
```

---

# 27. Context

Describes why decision became necessary.

---

# 28. Problem

Defines the actual tension or uncertainty.

---

# 29. Options Considered

Record serious alternatives.

Example:

```text id="dr020"
A — Own production immediately
B — Fully outsource
C — Asset-light partner network with selective future integration
```

---

# 30. Rationale

Explains why the chosen option best fits current strategy.

---

# 31. Evidence

Potential:

```text id="dr021"
REAL TRANSACTIONS
FINANCIAL MODEL
CUSTOMER DATA
EXPERIMENT
PARTNER DATA
LEGAL REVIEW
MARKET RESEARCH
```

---

# 32. Evidence Quality

Decision should distinguish:

```text id="dr022"
FACT
ASSUMPTION
HYPOTHESIS
```

---

# 33. Assumption

A belief the decision relies on but has not yet been fully validated.

---

# 34. Example

```text id="dr023"
ASSUMPTION:
External partners can achieve acceptable quality at early-stage volumes.
```

---

# 35. Assumption Must Be Testable Where Possible

Canonical.

---

# 36. Decision Consequences

Record:

```text id="dr024"
WHAT BECOMES TRUE
BECAUSE OF THE DECISION.
```

---

# 37. Example

Asset-light decision means:

```text id="dr025"
Partner Registry becomes critical.
Work Orders become critical.
QC becomes critical.
Owned factory software is deferred.
```

---

# 38. Negative Consequences

Also record tradeoffs.

---

# 39. Example

```text id="dr026"
Less direct production control.
Potential partner dependency.
Potential variable lead times.
```

---

# 40. Decision Risk

Potential:

```text id="dr027"
FINANCIAL
OPERATIONAL
LEGAL
CUSTOMER
TECHNICAL
STRATEGIC
```

---

# 41. Review Trigger

Every long-lived decision should identify when it should be revisited.

---

# 42. Review Trigger Examples

```text id="dr028"
ORDER VOLUME EXCEEDS X
PARTNER FAILURE RATE RISES
MARGIN DEGRADES
LAW CHANGES
BUSINESS MODEL CHANGES
```

---

# 43. Decision Review ≠ Automatic Reversal

Canonical.

A review may confirm the decision remains valid.

---

# 44. Time-Based Review

Can be:

```text id="dr029"
QUARTERLY
ANNUAL
AT MILESTONE
```

depending decision.

---

# 45. Evidence-Based Review Preferred

Example:

```text id="dr030"
Review vertical integration when production volume and partner cost variance justify capital analysis.
```

stronger than arbitrary date alone.

---

# 46. Affected Documents

Record canonical documents impacted.

---

# 47. Affected Systems

Potential:

```text id="dr031"
MGBOS
WEBSITE
n8n
FINANCE
DATABASE
```

---

# 48. Affected SOPs

Record where operational procedures change.

---

# 49. Affected Metrics

Important when decision changes performance interpretation.

---

# 50. Historical Decision Context

Do not rewrite old decision rationale after outcome becomes known.

---

# 51. Hindsight Integrity

Canonical:

> **Preserve what was known at the time of the decision.**

---

# 52. Add Review Note Instead

If later evidence changes interpretation:

```text id="dr032"
ORIGINAL DECISION
+
REVIEW NOTE
```

---

# 53. Decision Lifecycle

Canonical:

```text id="dr033"
ISSUE
↓
OPTIONS
↓
DECISION
↓
IMPLEMENTATION
↓
EVIDENCE
↓
REVIEW
↓
CONFIRM / SUPERSEDE / REVERSE
```

---

# 54. Superseding Decision

New decision should reference:

```text id="dr034"
supersedes:
```

---

# 55. Old Decision

Should reference:

```text id="dr035"
superseded_by:
```

where tooling supports it.

---

# 56. Do Not Delete Old Decisions

Canonical.

---

# 57. Decision Reversal

When reversing:

record why.

---

# 58. Reversal Is Not Failure

Canonical.

A good organization updates decisions when evidence changes.

---

# 59. Strategic Consistency

Decision Register helps distinguish:

```text id="dr036"
INTENTIONAL STRATEGY CHANGE
```

from:

```text id="dr037"
RANDOM DIRECTION CHANGE
```

---

# 60. Founder Decisions

Early TeeStock will naturally have many founder-owned decisions.

---

# 61. Founder Decision Still Needs Reasoning

Canonical.

Founder authority does not remove need for traceability.

---

# 62. Future Decision Authority

Later:

```text id="dr038"
DOMAIN OWNER
+
APPROVAL MATRIX
```

will distribute decision rights.

---

# 63. Decision Owner

The person/role accountable for the decision.

---

# 64. Decision Approver

Can differ from owner.

---

# 65. Decision Participants

Optional:

```text id="dr039"
CONSULTED
INFORMED
```

if organization size justifies.

---

# 66. Decision Authority Matrix

Future architecture may define:

```text id="dr040"
WHO CAN DECIDE
PRICE
REFUND
CAPEX
PARTNER
LEGAL
AI AUTHORITY
```

---

# 67. Decision Register Is Not Approval Engine

Canonical.

MGBOS approval engine may operationalize approvals.

Decision Register stores durable decision rationale.

---

# 68. Operational Approval

Example:

```text id="dr041"
Approve refund Rp2m
```

does not necessarily deserve Decision Register entry.

---

# 69. Policy Decision

Example:

```text id="dr042"
Refunds above Rp2m require Finance approval.
```

does.

---

# 70. Architecture Decision

Example:

```text id="dr043"
Use modular monolith before microservices.
```

belongs in Decision Register.

---

# 71. Technology Decision Records

Decision Register can incorporate ADR-like architecture decisions.

---

# 72. ADR Relationship

Technical ADRs may exist separately if engineering volume grows.

---

# 73. Root Decision Register

Should retain material enterprise-level technical decisions.

---

# 74. Experiment Relationship

Canonical:

```text id="dr044"
EXPERIMENT
↓
RESULT
↓
DECISION
↓
REGISTER
```

if result changes material business rule.

---

# 75. Experiment Result Alone Is Not Decision

Canonical.

---

# 76. Example

Experiment:

```text id="dr045"
7M-budget leads convert well.
```

Decision:

```text id="dr046"
Lower lead qualification budget threshold from 10M to 7M.
```

---

# 77. Decision Threshold Relationship

Changing canonical threshold is a material decision if it affects meaningful business control.

---

# 78. Example

```text id="dr047"
Change quote contribution floor from X to Y.
```

should be registered.

---

# 79. Legal Decision

Material legal/policy choice requires appropriate legal review.

---

# 80. Finance Decision

Material finance decision should identify economic evidence.

---

# 81. AI Decision

Examples requiring Decision Register:

```text id="dr048"
ALLOW AI TO SEND CUSTOMER MESSAGES
ALLOW AI TO CREATE QUOTE DRAFTS
ALLOW AI TO EXECUTE LOW-RISK ACTIONS
```

---

# 82. AI Authority Increase

Canonical:

> **Every material increase in AI authority should have an explicit decision trail.**

---

# 83. Why

AI autonomy changes operational risk.

---

# 84. AI Decision Record Should Include

```text id="dr049"
TASK
PERMISSION
EVAL RESULT
CRITICAL ERROR RATE
ESCALATION
ROLLBACK
```

---

# 85. Automation Decision

Not every workflow requires register entry.

---

# 86. Material Automation Decision

Examples:

```text id="dr050"
Make automation authoritative for inventory reservation.
Move payment reconciliation from manual to automated.
```

---

# 87. Infrastructure Decision

Examples:

```text id="dr051"
Use managed cloud production.
Use PostgreSQL as canonical operational store.
```

---

# 88. Security Decision

Examples:

```text id="dr052"
Require MFA for privileged accounts.
Separate production service credentials.
```

---

# 89. Roadmap Decision

Examples:

```text id="dr053"
Q4 prioritizes Business/Custom vertical slice over Creator Platform.
```

---

# 90. Decision Register Format

Recommended structure:

```text id="dr054"
# Active Decisions
# Decisions Under Review
# Superseded / Historical Decisions
```

---

# 91. Active Decisions

Current governing material choices.

---

# 92. Under Review

Decisions being challenged by evidence/change.

---

# 93. Historical Decisions

Superseded/reversed/expired.

---

# 94. Do Not Move History Out Too Early

Keeping decision lineage visible helps avoid repeating mistakes.

---

# 95. Decision Entry Template

Canonical template:

```text id="dr055"
## DEC-TS-YYYY-NNN — Decision Title

Status:
Date:
Category:
Owner:

### Decision

### Context

### Problem

### Options Considered

### Rationale

### Evidence

### Assumptions

### Consequences

### Risks / Tradeoffs

### Affected Documents

### Affected Systems

### Review Trigger

### Supersedes

### Superseded By
```

---

# 96. Decision Concision

Records should be detailed enough to preserve reasoning, but not essays by default.

---

# 97. High-Impact Decisions

Can be longer.

---

# 98. Low-Impact Material Decisions

Can be concise.

---

# 99. Initial TeeStock Decisions

This register should begin by codifying major decisions already made during Blueprint v1.

---

# 100. Initial Decision Set

Canonical seed:

```text id="dr056"
DEC-TS-2026-001
TeeStock Business Architecture

DEC-TS-2026-002
Asset-Light Production Strategy

DEC-TS-2026-003
Commerce / Services / Originals / Programs Architecture

DEC-TS-2026-004
Selects vs Originals Separation

DEC-TS-2026-005
MGBOS as Control Plane

DEC-TS-2026-006
Manual → Standardize → Automate → AI Progression

DEC-TS-2026-007
Canonical Data Before AI Authority

DEC-TS-2026-008
Modular Monolith Before Microservices

DEC-TS-2026-009
Q4 2026 Vertical Slice Priority

DEC-TS-2026-010
Full Jarvis Deferred Until Operational Readiness

DEC-TS-2026-011
Retail-First Customer Presentation & Governed Operational Priority

DEC-TS-2026-012
Curated-Design-First Primary Business Positioning
```

---

# 101. DEC-TS-2026-001 — TeeStock Business Architecture

Status:

```text id="dr057"
ACTIVE
```

Date:

```text id="dr058"
2026-09
```

Category:

```text id="dr059"
STRATEGIC
```

Decision:

```text id="dr060"
TEEStock operates through four canonical top-level domains:

COMMERCE
SERVICES
ORIGINALS
PROGRAMS.
```

---

# 102. Rationale

Separates:

```text id="dr061"
PRODUCT MONETIZATION
CAPABILITY MONETIZATION
IP CREATION
NETWORK PARTICIPATION
```

into coherent business domains.

---

# 103. Consequence

All customer-facing offerings and system modules should map cleanly to these domains without unnecessarily collapsing them.

---

# 104. DEC-TS-2026-002 — Asset-Light Production Strategy

Status:

```text id="dr062"
ACTIVE
```

Decision:

> TeeStock will initially use an asset-light production model through qualified partners and selectively internalize only capabilities whose volume and strategic economics justify ownership.

---

# 105. Rationale

Preserves:

```text id="dr063"
CAPITAL
FLEXIBILITY
CAPABILITY RANGE
```

while real demand is still being validated.

---

# 106. Tradeoff

Less direct production control.

Therefore partner governance and QC become strategic capabilities.

---

# 107. Review Trigger

Review when:

```text id="dr064"
SUSTAINED VOLUME
PARTNER BOTTLENECK
MARGIN LEAKAGE
CAPACITY CONSTRAINT
```

justify a capital case.

---

# 108. DEC-TS-2026-003 — Four-Domain TeeStock Architecture

Status:

```text id="dr065"
ACTIVE
```

Decision:

```text id="dr066"
COMMERCE
SERVICES
ORIGINALS
PROGRAMS
```

remain separate canonical domains.

---

# 109. Implication

TeeStock Originals is not simply a Commerce category.

Programs are not revenue lines identical to Services.

---

# 110. DEC-TS-2026-004 — Selects vs Originals Separation

Status:

```text id="dr067"
ACTIVE
```

Decision:

```text id="dr068"
SELECTS
=
We curate it.

ORIGINALS
=
We create it.
```

---

# 111. Rationale

Separates external/curated demand learning from internally created IP.

---

# 112. Strategic Consequence

Selects can become market sensor feeding Originals.

---

# 113. DEC-TS-2026-005 — MGBOS as Control Plane

Status:

```text id="dr069"
ACTIVE
```

Decision:

> MGBOS will operate as an operational control plane across canonical business domains rather than as an undifferentiated giant database wrapper.

---

# 114. Implication

Domain truth remains governed by domain boundaries.

MGBOS coordinates:

```text id="dr070"
WORK
APPROVALS
EXCEPTIONS
READ MODELS
AUTOMATION
```

---

# 115. DEC-TS-2026-006 — Automation Progression

Status:

```text id="dr071"
ACTIVE
```

Decision:

```text id="dr072"
MANUAL
↓
LEARN
↓
STANDARDIZE
↓
MEASURE
↓
AUTOMATE
↓
AI / AGENT
```

---

# 116. Rationale

Automating unstable processes scales chaos.

---

# 117. DEC-TS-2026-007 — Canonical Data Before AI Authority

Status:

```text id="dr073"
ACTIVE
```

Decision:

> AI may not receive material operating authority before canonical data, permissions, tools, audit, evaluation, and escalation mechanisms are sufficiently reliable.

---

# 118. Consequence

AI remains primarily:

```text id="dr074"
READ
ANALYZE
RECOMMEND
DRAFT
```

in early stages.

---

# 119. DEC-TS-2026-008 — Modular Monolith Before Microservices

Status:

```text id="dr075"
ACTIVE
```

Decision:

> TeeStock should initially prefer a modular monolith with explicit domain boundaries over premature distributed microservices.

---

# 120. Rationale

Reduces:

```text id="dr076"
DEPLOYMENT COMPLEXITY
NETWORK COMPLEXITY
OPERATING COST
COORDINATION COST
```

while preserving logical separation.

---

# 121. Review Trigger

Revisit if:

```text id="dr077"
TEAM SCALE
DEPLOYMENT INDEPENDENCE
PERFORMANCE
DOMAIN LOAD
```

materially requires service separation.

---

# 122. DEC-TS-2026-009 — Q4 2026 Vertical Slice Priority

Status:

```text id="dr078"
ACTIVE
```

Decision:

> Q4 2026 prioritizes the Business/Custom Lead → Quote → Order/Project → Production → QC → Fulfillment → Cost/Cash vertical slice over broad platform expansion.

---

# 123. Rationale

This flow validates the greatest number of critical business capabilities simultaneously.

---

# 124. Deferred Because of This Decision

```text id="dr079"
FULL CREATOR PLATFORM
PARTNER MARKETPLACE
ADVANCED AI
ADVANCED WMS
```

---

# 125. Review Trigger

Q4 capability review.

---

# 126. DEC-TS-2026-010 — Full Jarvis Deferred

Status:

```text id="dr080"
ACTIVE
```

Decision:

> TeeStock will not prioritize full Jarvis or multi-agent autonomy until canonical operating data, MGBOS tools, permissions, audit, automation reliability, and specialist-agent evaluations exist.

---

# 127. Rationale

Jarvis without operating truth would become interface theater rather than business leverage.

---

# 128. Required Readiness

```text id="dr081"
CANONICAL DATA
MGBOS
READ MODELS
TOOLS
PERMISSIONS
AUDIT
EVALS
ESCALATION
```

---

# 129. Decision Relationships

Decisions can depend on others.

Example:

```text id="dr082"
DEC-007
Canonical Data Before AI Authority

supports

DEC-010
Full Jarvis Deferred
```

---

# 130. Future Decision Graph

Potential:

```text id="dr083"
DECISION
→ DEPENDS ON
→ DECISION
```

for MGBOS knowledge graph.

---

# 131. Decision Register and Jarvis

Future Jarvis should be able to answer:

> Kenapa kita belum pakai microservices?

By retrieving:

```text id="dr084"
DEC-TS-2026-008
```

---

# 132. Another Example

User:

> Kenapa kita nggak bangun Creator Platform sekarang?

Jarvis retrieves:

```text id="dr085"
DEC-TS-2026-009
+
Capability Roadmap
```

---

# 133. Jarvis Must Distinguish

```text id="dr086"
CURRENT DECISION
vs
HISTORICAL DECISION
```

---

# 134. AI Decision Memory

This register becomes critical context for future AI agents.

---

# 135. Why

Without it, AI may repeatedly recommend choices already intentionally rejected.

---

# 136. Decision Knowledge Retrieval

Future:

```text id="dr087"
QUESTION
↓
RELEVANT DECISION
↓
CURRENT STATUS
↓
RATIONALE
↓
NEW EVIDENCE
```

---

# 137. AI May Challenge Decision

AI may identify evidence that decision deserves review.

---

# 138. AI Must Not Silently Reverse Decision

Canonical.

---

# 139. Decision Review Event

Potential future event:

```text id="dr088"
decision.review_requested
```

---

# 140. Decision Status Change Events

Potential:

```text id="dr089"
decision.approved
decision.activated
decision.superseded
decision.reversed
```

---

# 141. MGBOS Decision Entity

Future structured entity:

```text id="dr090"
Decision
DecisionOption
DecisionEvidence
DecisionDependency
DecisionReview
```

---

# 142. Decision Record and Markdown

Markdown remains canonical human-readable record initially.

Structured MGBOS representation can come later.

---

# 143. Do Not Build Decision System Before Using Register

Canonical.

First use the document.

Then systemize repeated need.

---

# 144. Decision Review Cadence

Recommended:

```text id="dr091"
MONTHLY
for active execution decisions.

QUARTERLY
for strategic decisions.

EVENT-DRIVEN
when material evidence changes.
```

---

# 145. Quarterly Decision Review

Ask:

```text id="dr092"
WHICH ACTIVE DECISIONS
ARE NOW CHALLENGED BY EVIDENCE?
```

---

# 146. Decision Debt

Canonical:

> **Decision debt is the accumulation of important choices whose rationale exists only in people's memory.**

---

# 147. Symptoms

```text id="dr093"
"Why did we do this?"
"I don't remember."
"Because that's how it was built."
```

---

# 148. Decision Register Reduces Decision Debt

Canonical.

---

# 149. Overdocumentation Risk

Do not log every trivial choice.

---

# 150. Decision Test

Before registering ask:

```text id="dr094"
IF SOMEONE CHALLENGES THIS
SIX MONTHS FROM NOW,
WILL KNOWING THE ORIGINAL REASON MATTER?
```

If yes, register it.

---

# 151. Second Decision Test

```text id="dr095"
DOES THIS CHOICE
CHANGE BUSINESS BEHAVIOR
OR CREATE A LONG-LIVED CONSTRAINT?
```

If yes, likely register.

---

# 152. Third Decision Test

```text id="dr096"
WILL THIS DECISION
AFFECT MULTIPLE DOCUMENTS / SYSTEMS?
```

If yes, register.

---

# 153. Decision Quality

A good decision record makes assumptions visible.

---

# 154. Why

Then future evidence can test those assumptions.

---

# 155. Example

Decision:

```text id="dr097"
Services-first revenue strategy.
```

Assumption:

```text id="dr098"
Services can generate early cash with lower inventory commitment.
```

Future data can validate or reject it.

---

# 156. Decision Outcome Tracking

Optional later:

```text id="dr099"
EXPECTED OUTCOME
ACTUAL OUTCOME
```

---

# 157. Decision Quality ≠ Outcome Quality

Canonical.

A good decision can produce bad outcome because uncertainty existed.

---

# 158. Avoid Outcome Bias

Evaluate:

```text id="dr100"
PROCESS
INFORMATION
ASSUMPTIONS
```

available at decision time.

---

# 159. Decision Review Note Template

```text id="dr101"
### Review YYYY-MM-DD

New Evidence:
Assessment:
Decision:
- Confirm
- Modify
- Supersede
- Reverse
```

---

# 160. Decision Register Governance

Material decision additions/changes follow [[bisnis/teestock/00-foundation/documentation-governance|TS-FND-003: Documentation Governance]].

---

# 161. Never Edit Historical Rationale to Match Current Narrative

Canonical.

---

# 162. Corrections

Factual correction may be annotated.

Do not rewrite historical context deceptively.

---

# 163. Decision Register Repository Role

```text id="dr102"
README
tells us where we are.

CANONICAL DOCS
tell us how the business works.

DECISION REGISTER
tells us why it works that way.
```

---

# 164. Foundation Relationship

```text id="dr103"
MASTER DEFINITION
defines identity.

GLOSSARY
defines language.

DOCUMENTATION GOVERNANCE
defines truth management.

DECISION REGISTER
defines decision memory.
```

---

# 165. Foundation Directory

Now:

```text id="dr104"
00-foundation/
├── teestock-master-definition.md
├── glossary.md
├── documentation-governance.md
└── decision-register.md
```

---

# 166. Foundation Status

```text id="dr105"
COMPLETE
```

for Blueprint v1.

---

# 167. Decision Register Success Definition

The register succeeds when TeeStock can answer:

```text id="dr106"
WHAT DID WE DECIDE?

WHEN?

WHY?

WHAT DID WE KNOW?

WHAT DID WE ASSUME?

WHAT OPTIONS DID WE REJECT?

WHAT DID THE DECISION CHANGE?

WHAT SHOULD MAKE US REVISIT IT?

IS IT STILL ACTIVE?

WHAT REPLACED IT?

CAN A FUTURE TEAM OR JARVIS
UNDERSTAND THE REASON
WITHOUT ASKING THE FOUNDER?
```

---

# 168. Canonical Decision Register Summary

```text id="dr107"
PROBLEM
creates a decision need.

OPTIONS
make tradeoffs explicit.

DECISION
chooses direction.

RATIONALE
preserves why.

EVIDENCE
supports the choice.

ASSUMPTIONS
identify uncertainty.

CONSEQUENCES
define what changes.

REVIEW TRIGGERS
define when to reconsider.

HISTORY
preserves organizational memory.

MGBOS
may later operationalize decisions.

JARVIS
may retrieve and explain them.
```

---

# 169. Canonical Decision Register Principles

```text id="dr108"
PRESERVE THE REASONING BEHIND MATERIAL DECISIONS—NOT JUST THE OUTCOME.

MATERIAL DECISIONS SHOULD LEAVE AN AUDITABLE REASON TRAIL.

NOT EVERY TASK OR MEETING DESERVES A DECISION RECORD.

DECISION ID IS IMMUTABLE.

DECISIONS MAY BE SUPERSEDED, REVERSED, OR EXPIRED—BUT SHOULD NOT DISAPPEAR.

PRESERVE WHAT WAS KNOWN AT THE TIME.

DISTINGUISH FACTS, ASSUMPTIONS, AND HYPOTHESES.

RECORD SERIOUS ALTERNATIVES.

TRADEOFFS SHOULD BE EXPLICIT.

LONG-LIVED DECISIONS NEED REVIEW TRIGGERS.

NEW EVIDENCE MAY JUSTIFY A NEW DECISION.

A REVERSED DECISION IS NOT AUTOMATICALLY A FAILED DECISION.

FOUNDER AUTHORITY DOES NOT REMOVE THE NEED FOR DECISION MEMORY.

EXPERIMENT RESULTS BECOME BUSINESS RULES ONLY THROUGH DECISIONS.

MATERIAL INCREASES IN AI AUTHORITY REQUIRE EXPLICIT DECISION TRAILS.

AI MAY RETRIEVE, SUMMARIZE, AND CHALLENGE DECISIONS. IT MUST NOT SILENTLY REVERSE THEM.

THE REGISTER SHOULD REDUCE DECISION DEBT, NOT CREATE DOCUMENTATION BUREAUCRACY.

FUTURE TEAMS SHOULD BE ABLE TO UNDERSTAND TEEStock'S DIRECTION WITHOUT RECONSTRUCTING THE FOUNDER'S MEMORY.
```

---

# 170. Current Command

With Foundation governance complete:

```text id="dr109"
STOP BUILDING THE BLUEPRINT.

START USING IT.

RUN REAL TRANSACTIONS.

RECORD EXCEPTIONS.

MAKE DECISIONS.

LET EVIDENCE
CHANGE THE SYSTEM
DELIBERATELY.
```

---

# 171. DEC-TS-2026-011 — Retail-First Customer Presentation & Governed Operational Priority

## DEC-TS-2026-011 — Retail-First Customer Presentation & Governed Operational Priority

Status: ACTIVE  
Date: 2026-10-19  
Category: STRATEGIC / BRAND ARCHITECTURE / PRODUCT-COMMERCE  
Owner: Founder / Owner  

### Decision

- First public customer presentation is retail-first: curated apparel collections, product presentation, discovery, and brand identity are front-and-center.
- Custom and Business pathways remain clearly visible, discoverable, and directly accessible from navigation and prominent entry points.
- DEC-TS-2026-009 remains ACTIVE: Operational priority remains Business/Custom Lead → Quote → Order/Project → Production → QC → Fulfillment → Cost/Cash.
- Prototypes are non-transactional; no operational verification of prices, stock, or checkout without evidence; retail checkout requires separate readiness and governance.

### Context

Reconciles the Owner's preference for a premium apparel brand identity with the operational realities of solo-founder bootstrap execution. MGBOS Phase 1 software and operator verification is completed within its documented boundary, but real customer transactions are not yet proven and production readiness is not yet authorized. In parallel, retail-led storefront presentation is an approved strategic direction, not proof of an already-delivered customer experience. The public storefront will lead with a polished, high-standard retail brand experience while operational validation remains gated through governed Business/Custom workflows.

### Problem

A purely custom/business B2B presentation risks underselling the brand's aesthetic capability and garment excellence, while premature retail transaction enablement (inventory, cart, automated payment, returns) risks overwhelming solo-founder operations before fulfillment and cash cycles are proven.

### Options Considered

1. *Custom/Business-Only Presentation*: Focus entire public UI on custom garment printing and B2B ordering. (Rejected: weakens brand prestige and consumer appeal; business clients judge print quality by storefront aesthetic).
2. *Full Retail Commerce Launch First*: Build and launch retail e-commerce catalog with transactional checkout immediately. (Rejected: violates DEC-TS-2026-009; premature inventory commitment and unverified fulfillment without proven cash flow).
3. *Retail-First Presentation with Governed Custom/Business Operational Priority*: Lead customer-facing presentation with retail collections, lookbooks, and brand story, while routing transactions through custom/business inquiries and keeping operational focus on the B2B spine until retail operational readiness is verified. (Selected).

### Rationale

High-standard brand identity and visual excellence attract both retail shoppers and high-value business clients. Business clients judge brand quality by the front storefront. However, operational capability validation must prove cash flow and operational processes through custom/business before scaling retail inventory and transactional checkout.

### Evidence

Owner directive and strategic alignment during TeeStock customer platform planning; reconciliation of prototype design drafts with DEC-TS-2026-009 and the Solo-Founder Launch Roadmap v2.6.

### Assumptions

- Retail prototypes can inspire customer confidence without transactional checkout.
- Business/Custom pipeline generates required early operating cash flow.

### Consequences

- Public web experience leads with retail collections, lookbooks, and merchandising.
- Custom/Business inquiry and quoting flows are prominent secondary paths.
- Retail transactional checkout deferred until inventory and fulfillment operations are validated.
- Operational systems development remains focused on MGBOS Business/Custom spine.

### Risks / Tradeoffs

- Customer expectation of immediate online checkout for retail items must be managed transparently (e.g., waitlist, drop announcements, or direct-assisted ordering).
- Dual focus requires discipline so that frontend brand polish does not divert engineering resources from the core MGBOS operational spine.

### Affected Documents

- bisnis/teestock/10-product-tech/website-information-architecture.md
- systems/mgbos/docs/product/teestock-customer-platform/CX-PKG-DECISIONS-R1.md

### Affected Systems

- TeeStock Public Storefront / Customer Platform
- MGBOS Founder Control Plane

### Review Trigger

Completion of Business/Custom operational validation; verified ready-stock inventory with tested fulfillment.

### Supersedes

None

### Superseded By

None

---

# 172. DEC-TS-2026-012 — Curated-Design-First Primary Business Positioning

Status: ACTIVE  
Date: 2026-10-20  
Category: STRATEGIC / BRAND / COMMERCE / PRODUCT PRIORITY  
Owner: Founder / Owner  
Authority: Founder-directed business-positioning decision; not a production or engineering authorization  
Related prior decisions: DEC-TS-2026-001, DEC-TS-2026-003, DEC-TS-2026-004, DEC-TS-2026-009, DEC-TS-2026-011  
Supersedes: None in full; narrows how prior Business/Custom operational priority may be interpreted as brand strategy  
Review trigger: material change of Owner direction or validated business evidence

## 172.1 Decision

**TeeStock MUST be positioned, product-managed, and developed primarily as a curated-design apparel brand.** Its leading value proposition is selected graphic designs, thoughtfully assembled collections, quality apparel, coherent creative identity, merchandising and product storytelling, and a trustworthy consumer buying experience.

TeeStock's business identity MUST NOT be reduced to generic custom printing, customer-supplied artwork services, business uniforms or B2B quotation work merely because Business/Custom was a convenient first MGBOS operating-spine validation lane.

TeeStock Commerce — especially **TeeStock Selects** — is the primary near-term commercial focus. The existing four-domain business structure (Commerce, Services, Originals, Programs) remains intact. Services/Custom/Business MAY continue as secondary offerings or as explicitly bounded operating experiments; they are not the default strategic center.

TeeStock Selects means **“We curate it.”** TeeStock Originals means **“We create it.”** Curated, licensed, commissioned or collaborator-sourced designs MUST NOT be represented as internally owned TeeStock IP without evidence of rights and ownership.

## 172.2 Strategic rationale

The Owner clarified on 2026-10-20 that the principal ambition for TeeStock is a recognizable curated-design apparel brand. Earlier documentation had made Business/Custom prominent to prove the operating spine and cash/fulfillment flow; that purpose is different from identifying why customers would choose the TeeStock brand.

A differentiated retail brand needs an intentional system for design selection, rights clearance, collection themes, material/fit consistency, merchandising, demand observation, honest availability and after-sales quality. An operations-first quotation flow alone cannot validate that proposition.

## 172.3 Relationship to existing decisions — preserve historical truth

| Earlier decision | Historical commitment | Effect of DEC-TS-2026-012 | Current reconciliation obligation |
|---|---|---|---|
| DEC-TS-2026-001 / 003 | Four business domains: Commerce, Services, Originals, Programs | PRESERVED | No domain deletion or silent restructuring |
| DEC-TS-2026-002 | Asset-light production and partner coordination | PRESERVED | Validate production partners and QC for curated apparel |
| DEC-TS-2026-004 | Selects curated versus Originals internally created | REINFORCED | Preserve IP provenance, licensing and attribution distinctions |
| DEC-TS-2026-005 / 006 / 007 / 008 | MGBOS control, responsible automation, canonical data and modular architecture | PRESERVED | No automatic new MGBOS entity or AI authority |
| DEC-TS-2026-009 | Business/Custom priority for Q4 operating-spine validation | REVIEW_REQUIRED | Remains historical/active in its originally approved validation scope; MUST NOT be interpreted as current primary brand or product positioning; reconcile Q4 planning explicitly |
| DEC-TS-2026-010 | Full JARVIS deferred until data/operations ready | PRESERVED | No AI autonomy acceleration |
| DEC-TS-2026-011 | Retail-first public presentation with Business/Custom operations | EXTENDED | Curated-first now governs actual business/product priority, not only site presentation; transactional gating unchanged |

**Status nuance:** The literal old DEC-TS-2026-009 and DEC-TS-2026-011 records above remain untouched as historical statements. DEC-TS-2026-012 is the later explicit founder decision about **primary brand/product strategy**. There is still an unresolved **planning-sequence conflict** with Q4 roadmap files that privilege Business/Custom commercially. Future AI MUST mark those plans `RECONCILIATION_REQUIRED` rather than silently pretending their text has changed or automatically deleting their authorized operational tests.

## 172.4 Explicitly not decided

This decision DOES NOT:

- abolish Custom/Business/Services offerings;
- reclassify Selects artwork as Originals-owned intellectual property;
- approve unrestricted design sourcing, printing, trademark use, collaboration or commercial licensing;
- authorize a published SKU, price, discount, product claim, inventory promise, pre-order policy, courier SLA or launch date;
- require full retail cart, payment gateway, public account or warehouse automation before any demand research;
- claim that MGBOS checkout, payment idempotency, returns, stock reservation or production readiness are verified;
- invalidate any already completed and independently evidenced MGBOS operating-spine test;
- cancel the existing TeeStock Business/Custom pilot or change its qualification cohort without an explicit revision to its owning product-validation contract;
- approve a new Design Library aggregate, duplicated transactional database or independent storefront system of record;
- instruct MultiGraph to stop supporting TeeStock, or authorize MultiGraph external printing sales;
- authorize implementation, database migration, provider integration, production deployment or autonomous AI decisions.

## 172.5 Near-term product-planning obligations

The following are **required areas for product discovery and canonical-document reconciliation**, not preapproved technical entities or implementation tickets:

| Candidate business requirement | Canonical owner / target for review | Acceptance evidence needed |
|---|---|---|
| Design curation criteria, themes and selection rationale | TeeStock Commerce / Selects | Documented curation rationale; customer comprehension |
| Artwork rights, provenance, restrictions and attribution | TeeStock IP Policy | Checkable rights documents for every released design |
| Collection and catalog merchandising | TeeStock Commerce / merchandising | Explainable category, theme, variant and release status |
| Apparel blanks, quality, size/fit, decoration and supply | TeeStock Commerce + Operations | Physical samples/QC and validated supplier/production route |
| Product-offer truth: price, tax/shipping handling, availability and fulfilment promises | TeeStock commercial policy + governed MGBOS | Approved terms, calculations, customer-safe errors |
| Curated-commerce demand validation | TeeStock Metrics / Research | Real customer intent separated from likes/traffic |
| Governed buying journey, checkout eligibility and support recovery | TeeStock CX PRD + MGBOS | End-to-end evidence before transactional activation |
| Contribution margin, cancellations, returns and failed production | TeeStock Finance + MGBOS Finance | Actual costs, refunds/adjustments and order-level margin |
| Owner workload and capacity | Solo-Founder Operating Model | Recorded human handling burden and exception rates |

Do not create one database table for each candidate business need. First reuse existing semantic owners and map any gaps through the canonical MGBOS domain model.

## 172.6 Dual-pilot interpretation

TeeStock and MultiGraph are **parallel business pilots**, not two independent ERPs:

```text
TeeStock:
  PRIMARY_VALUE: curated design and apparel brand/commerce
  INITIAL_PRODUCT_VALIDATION: collections, demand, quality, honest buying path
  BUSINESS_CUSTOM: secondary and separately scoped

MultiGraph:
  VALUE_PROPOSITION: printing / production-service solutions
  ACTUAL_INITIAL_STATUS: supporting arm, per existing MultiGraph business README
  EXTERNAL_B2B_PILOT: gated; no automatic approval from this decision

MGBOS:
  AUTHORITY: existing canonical operational state and transaction rules
  ROLE: shared operational backbone; no business identity substitution

JARVIS:
  ROLE: governed assistance and recommendations
  AUTHORITY: no direct bypass of finance, security or production controls
```

**Business validation is distinct from software validation.** The previously approved assisted-sales Business/Custom pilot has its own contractual cohort and readiness requirements; it MUST NOT be reported as proof of commercial demand for TeeStock's curated apparel. Likewise a successful curated-design campaign MUST NOT be reported as proof of payment/fulfillment engineering readiness.

## 172.7 Reconciliation ledger — affected canonical sources

| ID | Exact repository path | Required controlled action | State at this decision |
|---|---|---|---|
| TS-CUR-REC-01 | `bisnis/teestock/00-foundation/teestock-master-definition.md` | Clarify primary current focus within existing four-domain model | PENDING |
| TS-CUR-REC-02 | `bisnis/teestock/02-brand/master-brand-strategy.md` | Make curated design leading brand expression, preserve long-term ecosystem | PENDING |
| TS-CUR-REC-03 | `bisnis/teestock/03-commerce/commerce-overview.md` | Align Commerce/Selects priority, merch and collections | PENDING |
| TS-CUR-REC-04 | `bisnis/teestock/14-roadmap/current-quarter.md` | Resolve Q4 commercial-priority and operating-pilot distinction | PENDING |
| TS-CUR-REC-05 | `docs/roadmaps/solo-founder-launch-roadmap.md` | Reconcile strategic sequence and founder/capital limits | PENDING |
| TS-CUR-REC-06 | `systems/mgbos/docs/product/teestock-operational-pilot-plan.md` | Keep existing real Business/Custom pilot scope accurate; separately design curated pilot | PENDING |
| TS-CUR-REC-07 | `bisnis/teestock/10-product-tech/website-information-architecture.md` | Enforce design-led discovery and honest transaction eligibility | PENDING |
| TS-CUR-REC-08 | `systems/mgbos/docs/product/teestock-customer-platform/cx-09-phased-delivery-product-validation-plan.md` | Review proposed slices; avoid promoting DRAFT requirements to ACTIVE | PENDING |
| TS-CUR-REC-09 | `bisnis/teestock/12-legal-ip/ip-policy.md` | Confirm licensed/curated designs have enforceable evidence controls | REVIEW_AS_NEEDED |
| TS-CUR-REC-10 | `bisnis/teestock/03-commerce/catalog-merchandising-system.md` | Align collection curation and release eligibility | REVIEW_AS_NEEDED |

Every future document change MUST recheck live source HEAD and status, preserve existing history, and record its own review/evidence. This entry alone does not modify any referenced file or resolve its documented contradiction.

## 172.8 Risk and falsifiable assumptions

| Risk | Control / test |
|---|---|
| Attractive design but no purchase intent | Run ethical demand tests; distinguish interest, intent and paid orders |
| Unclear artwork rights or expired license | Rights verification before publication and sale |
| Small founder overwhelmed by designs, SKUs and variants | Limit experiments to validated supply/fulfillment capacity |
| Brand diluted by custom-print positioning | Test customer understanding of the homepage and product pages |
| Retail promise ahead of system/payment readiness | Keep nontransactional presentation clearly nontransactional |
| Roadmaps contradict this decision | Reconcile via TS-CUR-REC entries before new implementation sequencing |
| Business/Custom pilot abandoned and operating risks untested | Preserve independent approved pilot until explicit evidence-based change |
| Gross revenue mistaken for contribution | Cost artwork, blanks, production, fees, logistics, failure and support |

## 172.9 Machine-readable decision and claim-status record

```yaml
decision_id: DEC-TS-2026-012
decision_status: ACTIVE
decided_on: 2026-10-20
semantic_owner: teestock.business.strategy
approved_by: founder
primary_business_positioning: CURATED_DESIGN_APPAREL
primary_commerce_focus: TEESTOCK_SELECTS
services_priority: SECONDARY_CONDITIONAL
selects_vs_originals_boundary: PRESERVED
past_decision_009:
  original_text_retained: true
  original_status_unchanged: true
  cannot_define_primary_brand: true
  q4_sequencing_reconciliation: REQUIRED
past_decision_011:
  original_text_retained: true
  product_business_focus_extended_beyond_website: true
commerce_checkout_readiness: NOT_VERIFIED
production_readiness: NOT_VERIFIED
independent_live_pilot_success: NOT_VERIFIED
external_multigraph_commercial_pilot: NOT_AUTHORIZED_BY_THIS_DECISION
mgbos_architecture_modified: false
jarvis_authority_modified: false
new_engineering_authorization: NONE
canonical_reconciliation_status: PARTIAL_AFTER_THIS_REGISTER_UPDATE
```

## 172.10 AI interpretation protocol

1. This decision is authoritative **for TeeStock primary business positioning within this register once the file is adopted**; it does not displace the owners of product taxonomy, intellectual property, financial terms, data, security, or roadmap stage gates.
2. Preserve all historical decisions and record later reversals/supersessions explicitly. Do not infer that a historical decision never existed.
3. Interpret DEC-TS-2026-009 as an earlier scoped operating-validation sequence; flag existing priority conflicts for Owner/governed roadmap reconciliation instead of silently erasing it.
4. Interpret DEC-TS-2026-011 as a retail-first presentation decision that DEC-012 extends to brand/product strategy; neither proves a working cart.
5. A high-quality website or PRD approval is not production authorization; verify runtime artifacts, integration and source/evidence-specific readiness separately.
6. If business/pricing/IP/engineering implementation documents conflict, report the owning source and the exact unresolved conflict; do not fabricate precedence based on file length or publication date alone.
7. All downstream work should distinguish `CURRENT`, `TARGET`, `PROPOSED`, `NOT_VERIFIED`, and actual owner-approved gates.

## 172.11 Outcome and review criteria

This decision is implemented in strategy when TeeStock's master definition, brand, Commerce, product roadmap, and customer-platform plan consistently emphasize curated design **without** misleading claims about a live checkout. It is implemented operationally only after real validated demand, unit economics, rights, production, and fulfillment evidence is collected in the relevant source domains.

Review when actual customer purchasing behavior, legal rights constraints, unit economics, vendor readiness, or founder capacity materially challenges the approach. Such review MUST be recorded; it does not automatically reverse the decision.

### Sources and provenance

- Owner instruction, 2026-10-20: TeeStock focus is curated design branding, not Business/Custom.
- `bisnis/teestock/00-foundation/teestock-master-definition.md` (four-domain architecture and Selects definition).
- `bisnis/teestock/00-foundation/decision-register.md` (DEC-TS-2026-001..011 history).
- `bisnis/teestock/03-commerce/teestock-selects.md` and `bisnis/teestock/12-legal-ip/ip-policy.md` (curation and IP boundaries).
- `bisnis/teestock/14-roadmap/current-quarter.md` (Business/Custom Q4 sequencing, requiring reconciliation).
- `systems/mgbos/docs/product/teestock-operational-pilot-plan.md` (bounded assisted-sales operational pilot).
- `docs/governance/documentation-constitution.md` (canonical authority, lifecycle and historical preservation).

**End of DEC-TS-2026-012.**
