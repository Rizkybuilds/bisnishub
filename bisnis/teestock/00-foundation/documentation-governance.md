---
title: "TeeStock Documentation Governance"
document_id: "TS-FND-003"
version: "1.0"
status: "CANONICAL"
category: "foundation"
business: "teestock"
path: "bisnis/teestock/00-foundation/documentation-governance.md"
last_updated: "2026-09-28"
depends_on:
  - "TS-FND-001"
  - "TS-FND-002"
  - "TS-ROOT-001"
---

# TeeStock Documentation Governance v1.0

> **Canonical TeeStock Documentation Ownership, Lifecycle, Change Control & Source-of-Truth Governance Framework**

Dokumen ini mendefinisikan bagaimana seluruh dokumentasi bisnis TeeStock dibuat, diberi status, direview, diubah, digantikan, diarsipkan, dan dijaga agar tetap menjadi satu coherent operating knowledge base.

---

# 1. Purpose

Documentation Governance menjawab:

> **Ketika bisnis berubah, bagaimana kita memastikan dokumentasi ikut berubah secara terkontrol tanpa menciptakan duplicate truth, conflicting definitions, atau keputusan historis yang hilang?**

Canonical principle:

> **Change deliberately. Preserve history. Maintain one source of truth.**

---

# 2. Canonical Definition

> **TeeStock Documentation Governance adalah governance system yang mengatur document ownership, canonical authority, lifecycle status, versioning, dependency, change approval, supersession, archival, and repository consistency sehingga setiap konsep bisnis memiliki sumber definisi yang jelas dan setiap perubahan material dapat ditelusuri.**

---

# 3. Documentation Objective

Dokumentasi TeeStock harus membantu bisnis:

```text
UNDERSTAND
DECIDE
OPERATE
BUILD
LEARN
CHANGE
```

bukan hanya menyimpan pengetahuan.

---

# 4. Canonical Rule

> **One concept = one canonical document.**

---

# 5. Why

Tanpa rule ini:

```text
Pricing
```

bisa didefinisikan berbeda di:

```text
Business Model
Commerce
Finance
Sales
MGBOS
```

dan menghasilkan conflicting truth.

---

# 6. Source-of-Truth Rule

Setiap konsep material harus mempunyai:

```text
CANONICAL OWNER DOCUMENT
```

Dokumen lain:

```text
REFERENCE
SUMMARIZE
IMPLEMENT
```

tetapi tidak membuat definisi baru yang konflik.

---

# 7. Example

Canonical pricing truth:

```text
08-finance/pricing-framework.md
```

Commerce boleh menggunakan pricing rule.

Tetapi tidak mendefinisikan ulang pricing governance secara independen.

---

# 8. Canonical Ownership

Canonical ownership berarti:

> Dokumen tersebut adalah sumber authoritative untuk konsep yang dikelolanya.

---

# 9. Canonical Document ≠ Only Document

Dokumen turunan masih dapat berupa:

```text
SOP
CHECKLIST
RUNBOOK
IMPLEMENTATION SPEC
UI COPY
API CONTRACT
```

selama tetap tunduk pada canonical definition.

---

# 10. Documentation Layers

Canonical:

```text
TIER 0 — CONSTITUTIONAL
TIER 1 — STRATEGIC
TIER 2 — SYSTEM
TIER 3 — EXECUTION
```

---

# 11. Tier 0 — Constitutional

Menjawab:

```text
WHAT TEEStock IS
WHAT ITS CORE ARCHITECTURE IS
WHAT TERMS MEAN
```

Contoh:

```text
Master Definition
Glossary
Business Thesis
Canonical Data Model
```

---

# 12. Tier 0 Change Frequency

Low.

Perubahan Tier 0 mempunyai blast radius besar.

---

# 13. Tier 1 — Strategic

Menjawab:

```text
HOW TEEStock INTENDS TO WIN
HOW IT MAKES MONEY
HOW IT GROWS
```

---

# 14. Tier 2 — Systems

Menjawab:

```text
HOW BUSINESS CAPABILITIES WORK
HOW DATA / SOFTWARE / OPERATIONS SUPPORT THEM
```

---

# 15. Tier 3 — Execution

Menjawab:

```text
WHAT DO WE DO TODAY?
WHO DOES IT?
IN WHAT ORDER?
```

---

# 16. Execution Docs Change Faster

Canonical.

Operational learning may change:

```text
SOP
CHECKLIST
RUNBOOK
CURRENT QUARTER
```

frequently.

---

# 17. Document Lifecycle

Canonical:

```text
DRAFT
↓
PROPOSED
↓
CANONICAL
↓
SUPERSEDED
↓
ARCHIVED
```

---

# 18. DRAFT

Meaning:

```text
WORK IN PROGRESS
NOT AUTHORITATIVE
```

---

# 19. PROPOSED

Meaning:

```text
READY FOR REVIEW
NOT YET GOVERNING
```

---

# 20. CANONICAL

Meaning:

```text
CURRENT APPROVED BUSINESS TRUTH
```

---

# 21. SUPERSEDED

Meaning:

> Document has been replaced by a newer canonical definition but remains historically relevant.

---

# 22. ARCHIVED

Meaning:

> Document is retained only for history/reference and must not govern current operations.

---

# 23. Status Must Be Explicit

Every material document should contain:

```text
status:
```

metadata.

---

# 24. Canonical Status Is Not Permanent

A canonical document may later become:

```text
SUPERSEDED
```

through approved change.

---

# 25. Document ID

Canonical pattern:

```text
TS-{DOMAIN}-{NNN}
```

---

# 26. Examples

```text
TS-FND-001
TS-STR-002
TS-OPS-003
TS-DAT-004
```

---

# 27. Document ID Is Immutable

Once issued:

```text
DOCUMENT ID
DOES NOT CHANGE
```

because title or version changes.

---

# 28. Version Is Separate

Example:

```text
TS-FIN-001
v1.0
```

---

# 29. Versioning Model

Recommended:

```text
MAJOR.MINOR
```

---

# 30. Major Version

Use when change materially alters:

```text
BUSINESS MODEL
POLICY
ARCHITECTURE
SEMANTICS
OPERATING RULE
```

---

# 31. Minor Version

Use when change adds/refines:

```text
DETAIL
EXAMPLE
CLARITY
NON-BREAKING RULE
```

---

# 32. Editorial Change

Minor wording correction may not require semantic version increment if meaning is unchanged, depending repository practice.

---

# 33. Semantic Change Must Be Versioned

Canonical.

---

# 34. Filename Stability

Filename should usually remain stable across versions.

Example:

```text
financial-model.md
```

not:

```text
financial-model-v2-final-new.md
```

---

# 35. Git Holds File History

Canonical repository version history should be used rather than proliferating duplicate files.

---

# 36. Version Metadata

Document metadata stores:

```text
version
last_updated
status
```

---

# 37. Change Types

Canonical:

```text
EDITORIAL
MINOR
MATERIAL
STRUCTURAL
DEPRECATION
```

---

# 38. Editorial

Examples:

```text
TYPO
FORMATTING
GRAMMAR
```

No business semantics changed.

---

# 39. Minor

Examples:

```text
ADD EXAMPLE
CLARIFY PROCESS
ADD NON-BREAKING FIELD
```

---

# 40. Material

Examples:

```text
CHANGE PRICING RULE
CHANGE BUSINESS LINE
CHANGE OWNERSHIP RULE
CHANGE STATE MACHINE
CHANGE KPI DEFINITION
```

---

# 41. Structural

Examples:

```text
MERGE BUSINESS LINES
SPLIT DOMAIN
CHANGE CANONICAL ENTITY
REORGANIZE BUSINESS ARCHITECTURE
```

---

# 42. Deprecation

Removes/replaces an existing concept.

---

# 43. Change Authority

Early-stage TeeStock:

```text
FOUNDER
```

may serve as final business authority across multiple domains.

---

# 44. Future Governance

As organization grows:

```text
DOMAIN OWNER
+
CROSS-FUNCTION REVIEW
+
APPROVER
```

should replace centralized founder-only governance.

---

# 45. Domain Owner

Responsible for business correctness of a domain.

Potential:

```text
FINANCE
OPERATIONS
MARKETING
DATA
LEGAL
PRODUCT
```

---

# 46. Document Owner

Every canonical document should eventually identify:

```text
document_owner
```

or equivalent.

---

# 47. Document Owner ≠ Sole Decision Authority

Cross-domain changes may require multiple owners.

---

# 48. Change Blast Radius

Before approving a material change, determine:

```text
WHICH DOCUMENTS?
WHICH SYSTEMS?
WHICH WORKFLOWS?
WHICH DATA?
WHICH CUSTOMERS?
```

are affected.

---

# 49. Dependency Metadata

Documents should list:

```text
depends_on:
```

where material.

---

# 50. Dependency Purpose

Dependencies help answer:

> Kalau dokumen ini berubah, apa yang mungkin perlu ditinjau ulang?

---

# 51. Reverse Dependency

Future tooling may automatically identify:

```text
DOCUMENT A
changed
↓
DOCUMENT B / C / D
review required
```

---

# 52. Cross-Document Consistency

Material changes should trigger consistency review.

---

# 53. Example

If Product taxonomy changes:

review:

```text
COMMERCE PLATFORM
SKU CONVENTION
ANALYTICS
WEBSITE IA
```

as applicable.

---

# 54. Canonical Change Workflow

```text
OBSERVATION
↓
CHANGE REQUEST
↓
IMPACT REVIEW
↓
DECISION
↓
UPDATE SOURCE DOCUMENT
↓
UPDATE DEPENDENCIES
↓
IMPLEMENT
↓
VERIFY
```

---

# 55. Observation

Can originate from:

```text
CUSTOMER
REAL TRANSACTION
OPERATING FAILURE
EXPERIMENT
SYSTEM LIMITATION
LEGAL CHANGE
STRATEGY CHANGE
```

---

# 56. Change Request

Should explain:

```text
CURRENT STATE
PROBLEM
PROPOSED CHANGE
RATIONALE
IMPACT
```

---

# 57. Decision Register

Material decisions should enter:

```text
00-foundation/decision-register.md
```

---

# 58. Decision Before Rewrite

Canonical.

For material changes:

```text
DECIDE
THEN UPDATE DOCUMENTATION
```

not multiple files drifting independently.

---

# 59. Source First

Canonical:

> **Change the canonical source first, then propagate the consequence.**

---

# 60. Implementation Follows Canonical Change

Where practical:

```text
DECISION
↓
DOCUMENT
↓
SYSTEM / SOP / WORKFLOW
```

---

# 61. Emergency Exception

Production incidents may require operational fix before documentation update.

---

# 62. Emergency Follow-Up

Any emergency business-rule change must be documented promptly afterward.

---

# 63. Repository Is Not Reality by Itself

Canonical.

Real operations can expose wrong assumptions.

---

# 64. Evidence Rule

> **When strong operational evidence contradicts documentation, investigate and deliberately revise the documentation rather than forcing reality to fit the document.**

---

# 65. But Do Not Allow Silent Drift

Bad pattern:

```text
"Dokumennya bilang A
tapi sebenarnya kita selalu melakukan B."
```

---

# 66. Correct Response

Either:

```text
B IS WRONG
→ restore A
```

or:

```text
A IS OUTDATED
→ change canonical rule to B
```

deliberately.

---

# 67. Documentation Drift

Definition:

> Actual business operation diverges from canonical documentation without explicit decision.

---

# 68. Drift Detection

Sources:

```text
OPERATING REVIEW
SYSTEM AUDIT
INCIDENT
USER FEEDBACK
FOUNDER OBSERVATION
```

---

# 69. Drift Status

Potential:

```text
DOC_OUTDATED
PROCESS_NONCOMPLIANT
UNDER_REVIEW
```

---

# 70. Documentation Debt

Canonical:

> **Documentation debt is the gap between how the business actually works and what the repository says is true.**

---

# 71. Too Much Documentation Also Creates Debt

If documentation becomes too detailed to maintain:

```text
MAINTENANCE COST
>
OPERATING VALUE
```

it becomes liability.

---

# 72. Documentation Economy

Canonical:

> **Document the decision, model, policy, or process at the level needed to operate and change it reliably—no more.**

---

# 73. README Governance

Root `README.md`:

```text
NAVIGATES
SUMMARIZES
ORIENTS
```

but should not become detailed domain source-of-truth.

---

# 74. Domain Document Wins

If README conflicts with specific canonical domain document:

```text
DOMAIN DOCUMENT
```

governs the detailed concept.

Then README should be corrected.

---

# 75. Glossary Governance

`glossary.md` governs shared business terminology.

---

# 76. New Term Rule

If a new term affects multiple domains:

add it to Glossary.

---

# 77. Local Term

A domain-specific technical term may remain local if cross-business interpretation is unnecessary.

---

# 78. Avoid Synonym Drift

Examples:

Do not randomly alternate:

```text
Vendor
Partner
Supplier
Manufacturer
```

when they represent distinct canonical concepts.

---

# 79. Terminology Change

Material terminology changes require dependency review.

---

# 80. Entity Names

Canonical Data Model governs semantic identity of core entities.

---

# 81. Documentation Must Not Define Database Tables

Canonical business documentation defines:

```text
BUSINESS SEMANTICS
```

not necessarily exact physical schemas.

---

# 82. Implementation Documentation

Technical specs may define:

```text
TABLE
COLUMN
API
COMPONENT
```

separately.

---

# 83. Business Truth vs Implementation

Canonical:

```text
BUSINESS CONCEPT
≠
DATABASE IMPLEMENTATION
```

---

# 84. SOP Relationship

Canonical system doc defines:

```text
HOW PROCESS WORKS CONCEPTUALLY
```

SOP defines:

```text
HOW OPERATOR EXECUTES IT
```

---

# 85. SOP Must Not Override Policy

Canonical.

---

# 86. Runbook Relationship

Runbook explains:

```text
WHAT TO DO
WHEN SYSTEM / INTEGRATION FAILS
```

---

# 87. Checklist Relationship

Checklist confirms:

```text
REQUIRED STEPS
```

for repeatable task.

---

# 88. Experiment Documentation

Experiment result does not automatically become canonical rule.

---

# 89. Experiment → Decision

Canonical:

```text
EXPERIMENT
↓
EVIDENCE
↓
DECISION
↓
CANONICAL CHANGE
```

---

# 90. Temporary Working Notes

May exist outside canonical documentation.

---

# 91. Working Notes Must Be Clearly Non-Canonical

Examples:

```text
scratch/
notes/
draft/
```

or explicit status.

---

# 92. Chat Is Not Canonical Repository

Canonical.

---

# 93. WhatsApp Is Not Canonical Repository

Canonical.

---

# 94. AI Conversation Is Not Canonical Repository

Canonical.

---

# 95. AI May Draft Documentation

But canonical state is achieved only after:

```text
REVIEW
APPROVAL
REPOSITORY UPDATE
```

---

# 96. AI Cannot Self-Declare Canonical Truth

Canonical.

---

# 97. AI Documentation Role

AI may:

```text
DRAFT
COMPARE
CHECK CONSISTENCY
SUMMARIZE
FIND DEPENDENCIES
```

---

# 98. AI Governance Boundary

AI should not independently:

```text
CHANGE STRATEGY
CHANGE POLICY
CHANGE LEGAL RULE
CHANGE FINANCIAL AUTHORITY
```

in repository.

---

# 99. Future Documentation Agent

A future agent may monitor:

```text
SYSTEM CHANGE
vs
DOCUMENTATION
```

and flag possible drift.

---

# 100. Documentation Review Cadence

Recommended:

```text
TIER 0
ANNUAL / MATERIAL CHANGE

TIER 1
QUARTERLY / MATERIAL CHANGE

TIER 2
QUARTERLY / OPERATING CHANGE

TIER 3
AS OPERATIONS REQUIRE
```

---

# 101. Review Does Not Mean Rewrite

A review may result:

```text
NO CHANGE REQUIRED
```

---

# 102. Review Metadata

Future optional:

```text
last_reviewed
reviewed_by
next_review
```

---

# 103. Legal Documents

Legal-facing frameworks should be reviewed when:

```text
LAW CHANGES
BUSINESS MODEL CHANGES
JURISDICTION CHANGES
```

and with qualified professional review where required.

---

# 104. Financial Documents

Review when:

```text
PRICING MODEL
COST STRUCTURE
CAPITAL STRUCTURE
```

changes materially.

---

# 105. Technology Documents

Review when:

```text
SYSTEM BOUNDARY
INTEGRATION
SECURITY
DATA
```

changes materially.

---

# 106. Roadmap Documents

`current-quarter.md` is expected to expire naturally at quarter end.

---

# 107. Current Quarter Lifecycle

At quarter close:

```text
CURRENT
↓
REVIEW
↓
ARCHIVE / HISTORICAL
```

and new quarter document becomes active.

---

# 108. Never Rewrite Old Quarter Plan as If History Changed

Canonical.

---

# 109. Historical Roadmaps

Preserve actual:

```text
WHAT WE PLANNED
WHAT HAPPENED
WHAT WE LEARNED
```

---

# 110. Archive Structure

Potential:

```text
archive/
├── legacy/
├── superseded/
└── roadmaps/
```

if volume eventually justifies.

---

# 111. Do Not Overengineer Archive Early

Simple archive is sufficient initially.

---

# 112. Deprecation Rule

When concept is no longer valid:

```text
MARK SUPERSEDED
```

before removing from active navigation.

---

# 113. Superseding Document

Should identify:

```text
supersedes:
```

when useful.

---

# 114. Superseded Document

Should identify:

```text
superseded_by:
```

where repository tooling supports it.

---

# 115. Breaking Change

Examples:

```text
Order state renamed
Entity relationship changed
Royalty calculation changed
Pricing floor semantics changed
```

---

# 116. Breaking Change Requires Migration Thinking

Ask:

```text
WHAT HAPPENS TO EXISTING DATA?
OPEN TRANSACTIONS?
REPORTING?
AUTOMATION?
```

---

# 117. Historical Transactions

Never reinterpret historical transaction using new rule unless explicitly intended and lawful.

---

# 118. Policy Effective Dates

Material policies should include effective date.

---

# 119. New Policy Version

Old transactions remain linked to appropriate historical version where required.

---

# 120. Document Review Checklist

Before canonicalizing:

```text
[ ] Purpose clear
[ ] Scope clear
[ ] Owner concept clear
[ ] Terminology canonical
[ ] No duplicate truth
[ ] Dependencies identified
[ ] Conflicts reviewed
[ ] Version/status present
[ ] Operational impact understood
```

---

# 121. Material Change Checklist

```text
[ ] Evidence exists
[ ] Decision recorded
[ ] Canonical owner identified
[ ] Blast radius reviewed
[ ] Dependencies updated
[ ] System/SOP impact reviewed
[ ] Historical behavior preserved
```

---

# 122. New Document Gate

Create new canonical document only if:

```text
NEW CONCEPT
NEW DOMAIN
NEW POLICY
NEW SYSTEM
```

has enough independent importance to deserve its own source-of-truth.

---

# 123. Do Not Create Document Because Section Is Long

Canonical.

Document boundaries follow:

```text
OWNERSHIP
SEMANTICS
CHANGE LIFECYCLE
```

not word count.

---

# 124. Merge Gate

Merge documents if they:

```text
ALWAYS CHANGE TOGETHER
SHARE SAME OWNER
DEFINE SAME CONCEPT
```

---

# 125. Split Gate

Split when:

```text
DIFFERENT OWNER
DIFFERENT CHANGE RATE
DIFFERENT CANONICAL RESPONSIBILITY
```

---

# 126. Current Documentation Freeze

Now that Blueprint v1 is substantially complete:

```text
NEW HIGH-LEVEL ARCHITECTURE DOCUMENTS
```

should be strongly limited.

---

# 127. Current Documentation Priority

Q4 2026:

```text
SOP
RUNBOOK
DECISION
EXPERIMENT
LEARNING
```

---

# 128. Execution First

Canonical:

> **From this point forward, execution learning should grow faster than architecture documentation.**

---

# 129. Q4 Governance Example

Suppose real orders show:

```text
QUALIFICATION BUDGET ≥ 10M
```

rejects valuable 7M orders.

Correct process:

```text
DATA
↓
REVIEW
↓
DECISION REGISTER
↓
QUALIFICATION RULE UPDATE
↓
MGBOS / n8n UPDATE
↓
DOCUMENT UPDATE
```

---

# 130. Wrong Process

```text
change n8n condition
```

and forget canonical business rule.

---

# 131. System Drift

Definition:

> Software behavior changes without canonical business-rule update.

---

# 132. Documentation Drift

Definition:

> Business operation changes while repository remains old.

---

# 133. Both Must Be Controlled

Canonical alignment:

```text
BUSINESS RULE
=
DOCUMENTED RULE
=
SYSTEM BEHAVIOR
```

as closely as practical.

---

# 134. Audit Question

For any material rule:

> Where is this rule defined?

There should be one clear answer.

---

# 135. Second Audit Question

> Where is this rule implemented?

May have multiple answers.

---

# 136. Third Audit Question

> Why does this rule exist?

Decision Register should eventually help answer.

---

# 137. Documentation Governance Maturity

```text
L0
scattered notes

L1
organized files

L2
canonical documents

L3
version/change governance

L4
automated dependency/drift checks

L5
AI-assisted knowledge governance
```

---

# 138. Current TeeStock Documentation Maturity

Provisional:

```text
L2 → L3
```

---

# 139. Why

TeeStock already has:

```text
CANONICAL STRUCTURE
DOCUMENT IDs
STATUS
DEPENDENCIES
```

and now needs active change governance.

---

# 140. Next Maturity Evidence

Required:

```text
DECISION REGISTER USED
MATERIAL CHANGES VERSIONED
SUPERSEDED DOCS PRESERVED
DEPENDENCIES REVIEWED
```

---

# 141. Documentation Governance Success Definition

The system succeeds when TeeStock can answer:

```text
WHAT DOCUMENT
OWNS THIS CONCEPT?

WHAT IS
THE CURRENT VERSION?

WHY
DID THIS RULE CHANGE?

WHO
APPROVED THE CHANGE?

WHAT DOCUMENTS
WERE AFFECTED?

WHAT SYSTEMS
NEEDED UPDATE?

WHAT WAS
THE OLD RULE?

WHAT APPLIED
TO HISTORICAL TRANSACTIONS?

IS THE REPOSITORY
STILL ALIGNED WITH REAL OPERATIONS?
```

---

# 142. Canonical Documentation Governance Summary

```text
DOCUMENT
captures truth.

OWNER
governs meaning.

STATUS
defines authority.

VERSION
preserves change.

DEPENDENCY
reveals impact.

DECISION REGISTER
preserves rationale.

ARCHIVE
preserves history.

GIT
preserves file evolution.

OPERATIONS
provide evidence.

GOVERNANCE
keeps them aligned.
```

---

# 143. Canonical Documentation Governance Principles

```text
CHANGE DELIBERATELY. PRESERVE HISTORY. MAINTAIN ONE SOURCE OF TRUTH.

ONE CONCEPT = ONE CANONICAL DOCUMENT.

CANONICAL DOCUMENTS DEFINE CURRENT APPROVED BUSINESS TRUTH.

DOCUMENT ID IS STABLE. VERSION CHANGES.

CHANGE THE CANONICAL SOURCE FIRST, THEN PROPAGATE THE CONSEQUENCE.

MATERIAL BUSINESS CHANGES SHOULD HAVE RECORDED DECISIONS.

CHAT IS NOT THE CANONICAL REPOSITORY.

AI CONVERSATIONS ARE NOT THE CANONICAL REPOSITORY.

DOCUMENTATION SHOULD REFLECT REAL OPERATIONS, NOT FORCE REALITY TO FIT OLD ASSUMPTIONS.

STRONG EVIDENCE MAY JUSTIFY CHANGING THE BLUEPRINT.

SILENT DRIFT IS NOT ACCEPTABLE.

HISTORICAL TRANSACTIONS SHOULD RETAIN HISTORICAL RULE CONTEXT.

README NAVIGATES. DOMAIN DOCUMENTS GOVERN DETAILS.

SOPs IMPLEMENT POLICY; THEY DO NOT OVERRIDE IT.

EXPERIMENT RESULTS BECOME CANONICAL ONLY AFTER A DECISION.

SUPERSEDED DOCUMENTS SHOULD BE PRESERVED.

NOT EVERY IDEA DESERVES A DOCUMENT.

DOCUMENT ONLY ENOUGH TO SUPPORT RELIABLE OPERATION AND CHANGE.

EXECUTION LEARNING SHOULD NOW GROW FASTER THAN ARCHITECTURE DOCUMENTATION.
```

---

# 144. Dependency

The companion governance document is:

```text
00-foundation/decision-register.md
```

It records **why material decisions were made**, what alternatives were considered, what evidence supported them, what consequences followed, and whether the decision remains active, superseded, or reversed.