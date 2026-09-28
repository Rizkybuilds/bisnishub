---
title: "TeeStock Decision Register"
document_id: "TS-FND-004"
version: "1.0"
status: "CANONICAL"
category: "foundation"
business: "teestock"
path: "bisnis/teestock/00-foundation/decision-register.md"
last_updated: "2026-09-28"
depends_on:
  - "TS-FND-001"
  - "TS-FND-002"
  - "TS-FND-003"
  - "TS-ROOT-001"
---

# TeeStock Decision Register v1.0

> **Canonical TeeStock Strategic, Architectural, Operational & Governance Decision Memory**

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

Material decision additions/changes follow TS-FND-003 Documentation Governance.

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