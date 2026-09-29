---
title: "TeeStock Creator Agreement Framework"
date: "2026-09-28"
bisnis: teestock
kategori: catatan
status: active
tags:
  - bisnis/teestock
  - kategori/catatan
  - teestock/canonical
  - teestock/legal-ip
document_id: "TS-LEG-003"
version: "1.0"
category: "legal-ip"
business: "teestock"
last_updated: "2026-09-28"
path: "12-legal-ip/creator-agreement-framework.md"
depends_on:
  - "TS-LEG-001"
  - "TS-LEG-002"
  - "TS-PRG-002"
  - "TS-TEC-004"
  - "TS-FIN-002"
  - "TS-FIN-005"
  - "TS-DAT-001"
  - "TS-DAT-004"
---


# TeeStock Creator Agreement Framework v1.0

> [!warning] **Canonical TeeStock Creator Contract, Rights, Economics & Participation Governance Framework  **
> Dokumen ini mendefinisikan arsitektur kontraktual Creator Program TeeStock: creator identity, participation type, deliverables, IP ownership, licensing, commissioned work, collaborations, attribution, approvals, royalty, fees, earnings, payouts, returns, reversals, confidentiality, prohibited content, representations, warranties, suspension, termination, sell-off, disputes, offboarding, structured agreement data, dan translation of contractual terms into MGBOS rules.
>
> [!info] **Dependencies & Data Flow (SSOT)**
> [[bisnis/teestock/12-legal-ip/ip-policy|TS-LEG-001: TeeStock Intellectual Property Policy]] • [[bisnis/teestock/12-legal-ip/design-licensing-policy|TS-LEG-002: TeeStock Design Licensing Policy]] • [[bisnis/teestock/06-programs/creator-program|TS-PRG-002: TeeStock Creator Program]] • [[bisnis/teestock/10-product-tech/creator-platform|TS-TEC-004: TeeStock Creator Platform]] • [[bisnis/teestock/08-finance/unit-economics|TS-FIN-002: TeeStock Unit Economics]] • [[bisnis/teestock/08-finance/treasury-policy|TS-FIN-005: TeeStock Treasury Policy]] • [[bisnis/teestock/11-data-mgbos/canonical-data-model|TS-DAT-001: TeeStock Canonical Data Model]] • [[bisnis/teestock/11-data-mgbos/event-model|TS-DAT-004: TeeStock Event Model]]


---

# 1. Purpose

Creator Agreement Framework menjawab:

> **Bagaimana hubungan antara TeeStock dan creator diterjemahkan dari kesepakatan manusia menjadi hak, kewajiban, ekonomi, workflow, dan system rules yang jelas serta dapat dieksekusi secara konsisten?**

Canonical principle:

> **If the relationship creates rights, money, or obligations, put it in the agreement and put the agreement into the system.**

---

# 2. Canonical Definition

> **TeeStock Creator Agreement Framework adalah governed contractual architecture yang mendefinisikan hubungan legal dan komersial antara TeeStock dan creator melalui explicit participation scope, creative contributions, IP rights, commercial permissions, compensation, approvals, responsibilities, term, termination, and system-readable operational rules.**

---

# 3. Framework ≠ Final Contract

Critical:

```text
FRAMEWORK
defines what TeeStock agreements must address.

FINAL CONTRACT
is the legally executed agreement with the creator.
```

---

# 4. Legal Review

Material creator agreements should receive appropriate Indonesian legal review before production use.

Especially where agreement includes:

```text
IP ASSIGNMENT
EXCLUSIVITY
HIGH-VALUE COLLABORATION
MINIMUM GUARANTEE
INTERNATIONAL RIGHTS
DISPUTE / INDEMNITY
```

---

# 5. Creator Agreement Architecture

Canonical:

```text
MASTER CREATOR RELATIONSHIP
        │
        ├── PROGRAM ENROLLMENT
        ├── ARTWORK LICENSE
        ├── COMMISSION
        ├── COLLABORATION
        ├── MERCH PROJECT
        └── CAMPAIGN / CONTENT ENGAGEMENT
```

---

# 6. One Creator, Multiple Agreements

A creator may simultaneously have:

```text
CREATOR PROGRAM AGREEMENT
+
ARTWORK LICENSE A
+
COLLABORATION B
+
CAMPAIGN C
```

---

# 7. Do Not Force Everything Into One Contract

Canonical.

Use:

```text
MASTER TERMS
+
PROJECT / ASSET SCHEDULES
+
COMMERCIAL SCHEDULES
```

where efficient.

---

# 8. Agreement Types

Canonical potential types:

```text
CREATOR PROGRAM AGREEMENT
ARTWORK LICENSE AGREEMENT
COMMISSION AGREEMENT
COLLABORATION AGREEMENT
MERCH AGREEMENT
CAMPAIGN / CONTENT AGREEMENT
AFFILIATE AGREEMENT
```

---

# 9. Creator Program Agreement

Defines baseline relationship:

```text
ACCOUNT
PROGRAM RULES
REPRESENTATIONS
PROCESS
PAYMENT
CONDUCT
GENERAL IP RULES
```

---

# 10. Artwork License Agreement

Defines specific commercial use of creator-owned artwork.

---

# 11. Commission Agreement

Defines work TeeStock asks creator to create.

---

# 12. Collaboration Agreement

Defines joint creative/commercial initiative.

---

# 13. Merch Agreement

Defines TeeStock as merchandise operating partner for creator/community/brand.

---

# 14. Campaign Agreement

Defines creator content/deliverables and campaign compensation.

---

# 15. Agreement Precedence

Where multiple agreements apply, precedence should be explicit.

Example:

```text
PROJECT-SPECIFIC SCHEDULE
>
MASTER CREATOR TERMS
```

for specifically conflicting project terms if agreement defines so.

---

# 16. Creator Identity

Executed agreement must identify legal counterparty.

---

# 17. Creator Public Identity

May differ from legal identity.

Store separately:

```text
LEGAL NAME
DISPLAY NAME
CREATOR NAME
```

---

# 18. Individual Creator

Agreement should identify individual where creator is natural person.

---

# 19. Creator Organization

If creator operates through:

```text
PT
CV
AGENCY
MANAGEMENT
OTHER ENTITY
```

agreement should clearly identify contracting party and authority.

---

# 20. Representative Authority

A manager/agent signing for creator should have appropriate authority.

---

# 21. Creator MGBOS Relationship

Canonical:

```text
PERSON / ORGANIZATION
↓
CREATOR
↓
PROGRAM ENROLLMENT
↓
AGREEMENT
```

---

# 22. Agreement Identity

Every agreement receives:

```text
AGREEMENT ID
VERSION
STATUS
EFFECTIVE DATE
PARTIES
```

---

# 23. Agreement Status

Canonical:

```text
DRAFT
IN_REVIEW
SENT
SIGNED
ACTIVE
SUSPENDED
EXPIRED
TERMINATED
SUPERSEDED
```

---

# 24. Draft

No commercial authority yet unless separate written authorization exists.

---

# 25. Signed

Execution completed.

May still have conditions before Active.

---

# 26. Active

All required activation conditions satisfied.

---

# 27. Agreement Activation Gate

Potential:

```text
SIGNED
+
CREATOR VERIFIED
+
REQUIRED RIGHTS SCHEDULE
+
PAYMENT INFORMATION
+
REQUIRED APPROVALS
=
ACTIVE
```

---

# 28. Participation Scope

Agreement must define creator's participation.

Potential:

```text
ARTWORK CONTRIBUTOR
COLLABORATOR
MERCH CLIENT / PARTNER
CONTENT CREATOR
AFFILIATE
BRAND PARTNER
```

---

# 29. Participation Scope ≠ Creator Identity

Same creator may have multiple participation scopes.

---

# 30. Deliverables

Project-specific agreement should define:

```text
WHAT
FORMAT
QUANTITY
DEADLINE
ACCEPTANCE CRITERIA
REVISION ALLOWANCE
```

---

# 31. Deliverable Types

Potential:

```text
ARTWORK
ILLUSTRATION
LOGO / GRAPHIC
CONTENT
PHOTO
VIDEO
COPY
CAMPAIGN POST
CREATIVE DIRECTION
```

---

# 32. Deliverable Schedule

Use explicit schedule for material projects.

---

# 33. Creative Brief

Can be incorporated by reference.

---

# 34. Brief ≠ Agreement

Brief defines creative expectation.

Agreement defines legal/commercial relationship.

---

# 35. Acceptance

Agreement should identify when deliverable becomes accepted.

---

# 36. Acceptance Criteria

Potential:

```text
TECHNICAL REQUIREMENTS
BRIEF ALIGNMENT
ORIGINALITY
RIGHTS COMPLIANCE
PRODUCTION FEASIBILITY
```

---

# 37. Acceptance Does Not Automatically Transfer IP

Rights follow agreement.

---

# 38. Revision Terms

Define:

```text
NUMBER OF ROUNDS
SCOPE
TIMING
ADDITIONAL FEES
```

where appropriate.

---

# 39. Scope Creep

Material change beyond original brief may create:

```text
CHANGE REQUEST
+
ADDITIONAL COMPENSATION
```

---

# 40. Creator Originality Representation

Creator should represent, subject to negotiated legal terms, that contributed work is original or that creator has authority for incorporated third-party elements.

---

# 41. Third-Party Materials

Creator must disclose material third-party:

```text
FONT
PHOTO
TEXTURE
STOCK ASSET
ILLUSTRATION
MUSIC
OTHER CONTENT
```

where applicable.

---

# 42. Disclosure Principle

Canonical:

> **Undisclosed third-party rights create unacceptable provenance risk.**

---

# 43. Creator Authority

Creator should represent they possess authority to grant rights stated in agreement.

---

# 44. Existing Obligations

Creator should disclose conflicting:

```text
EXCLUSIVITY
MANAGEMENT AGREEMENT
PUBLISHING AGREEMENT
PRIOR LICENSE
EMPLOYMENT OBLIGATION
```

where relevant.

---

# 45. No Conflicting Grant

Creator should not grant TeeStock rights they already granted exclusively elsewhere.

---

# 46. IP Ownership Models

Creator agreement may use:

```text
CREATOR OWNERSHIP + LICENSE
TEEStock OWNERSHIP
ASSIGNMENT
CONTRACT-DEFINED JOINT STRUCTURE
```

depending relationship.

---

# 47. Preferred Default for Creator Program

For creator-submitted artwork:

```text
CREATOR RETAINS OWNERSHIP
+
TEEStock RECEIVES DEFINED LICENSE
```

unless strategic/commercial reason supports different structure.

---

# 48. Preferred Originals Direction

For core TeeStock Originals assets:

stronger TeeStock ownership/control may be appropriate.

---

# 49. Assignment Must Be Explicit

Canonical.

---

# 50. Assignment Scope

If used, define:

```text
WHAT RIGHTS
WHAT ASSETS
WHEN TRANSFER OCCURS
COMPENSATION
```

---

# 51. Conditional Assignment

Potentially transfer on:

```text
FULL PAYMENT
ACCEPTANCE
OTHER DEFINED CONDITION
```

if agreement chooses that structure.

---

# 52. License Model

If creator retains ownership:

agreement links to TS-LEG-002 licensing principles.

---

# 53. License Scope

Must define:

```text
PRODUCT
CHANNEL
TERRITORY
TERM
EXCLUSIVITY
MODIFICATION
ADVERTISING
PRODUCTION PARTNER USE
```

where relevant.

---

# 54. Rights Schedule

Recommended:

```text
SCHEDULE A
Creator Assets

SCHEDULE B
Licensed Rights

SCHEDULE C
Commercial Terms
```

for material engagements.

---

# 55. Asset IDs

Executed schedules should eventually map to canonical Artwork/IP Asset IDs.

---

# 56. Moral Rights Awareness

Indonesian copyright materials published by DJKI distinguish moral and economic rights and describe moral rights as remaining attached to the creator even where economic rights are transferred.

Operationally:

```text
ECONOMIC RIGHTS TRANSFER
≠
IGNORE CREATOR ATTRIBUTION / INTEGRITY CONCERNS
```

---

# 57. Attribution

Agreement should specify whether creator attribution is:

```text
REQUIRED
OPTIONAL
NOT REQUIRED
CONTEXT-SPECIFIC
```

subject to applicable rights.

---

# 58. Attribution Format

Potential:

```text
Artwork by X
Designed by X
Collaboration with X
```

---

# 59. Attribution Channels

Could differ by:

```text
PDP
PACKAGING
SOCIAL
CAMPAIGN
PHYSICAL PRODUCT
```

---

# 60. Attribution Failure

Agreement should provide practical correction process where appropriate.

---

# 61. Modification Rights

Creator agreement should define TeeStock's ability to:

```text
RESIZE
RECOLOR
CROP
SEPARATE COLORS
ADD TYPOGRAPHY
ANIMATE
ADAPT
COMBINE
```

---

# 62. Technical Production Changes

TeeStock should generally obtain sufficient permission to make necessary technical production changes.

---

# 63. Material Creative Changes

May require creator consultation/approval according to negotiated arrangement.

---

# 64. Creator Approval Rights

Potential subjects:

```text
FINAL ART
PRODUCT MOCKUP
MAJOR MODIFICATION
CAMPAIGN ASSET
COLLAB LAUNCH
```

---

# 65. Approval Right Must Have SLA

Example concept:

```text
creator response required within defined business days
```

to avoid indefinite blockers.

---

# 66. No Response Rule

Agreement should define what happens if creator does not respond.

Do not infer silently.

---

# 67. TeeStock Approval Rights

TeeStock retains approval over:

```text
PRODUCT FEASIBILITY
QUALITY
PRICE
PRODUCTION
MERCHANDISING
CHANNEL
BRAND SAFETY
```

unless agreement allocates otherwise.

---

# 68. Creative Independence

Creator approval should not inadvertently make creator responsible for operational decisions they do not control.

---

# 69. Exclusivity

If included, define:

```text
ASSET
PRODUCT CATEGORY
TERRITORY
CHANNEL
TERM
```

---

# 70. Creator-Wide Exclusivity

Avoid broad creator exclusivity unless strategically justified.

---

# 71. Project Exclusivity

Usually more targeted and manageable.

---

# 72. Competing Product Restriction

If used, define precisely.

Avoid vague:

> “creator cannot work with competitors.”

---

# 73. Exclusivity Expiry

MGBOS should track.

---

# 74. Compensation Architecture

Potential creator compensation:

```text
FIXED FEE
ROYALTY
ADVANCE
MINIMUM GUARANTEE
CAMPAIGN FEE
AFFILIATE COMMISSION
HYBRID
```

---

# 75. Compensation Types Stay Separate

Canonical.

---

# 76. Fixed Creative Fee

Compensation for defined deliverable/work.

---

# 77. Royalty

Compensation linked to eligible commercialization.

---

# 78. Campaign Fee

Compensation for content/campaign deliverables.

---

# 79. Affiliate Commission

Compensation for attributable referral outcome.

---

# 80. Creator May Receive Multiple Types

Example:

```text
DESIGN FEE
+
ROYALTY
+
CAMPAIGN FEE
```

---

# 81. Earnings Type

Every Earning must identify category.

---

# 82. Royalty Terms

Follow Design Licensing Policy.

Define precisely:

```text
RATE
BASE
ELIGIBILITY
RETURNS
REVERSALS
PERIOD
```

---

# 83. Creator Economics Example

Conceptually:

```text
Eligible Net Sales
×
Royalty Rate
=
Creator Royalty
```

Only if agreement uses that basis.

---

# 84. Fixed-Per-Unit Example

```text
Eligible Units
×
Fixed Royalty
=
Creator Royalty
```

---

# 85. Royalty Snapshot

Order transaction should preserve applicable Royalty Rule version.

---

# 86. No Retroactive Royalty Change

Canonical unless explicit lawful negotiated adjustment addresses historical period.

---

# 87. Pending Earnings

Eligible transaction may first create Pending Earning.

---

# 88. Validation Conditions

Potential:

```text
PAYMENT SETTLED
RETURN WINDOW
FRAUD CHECK
CANCELLATION STATUS
```

---

# 89. Earnings Status

Canonical:

```text
PENDING
VALIDATED
HELD
PAYABLE
PAID
REVERSED
VOID
```

---

# 90. Returns

Agreement must state treatment.

---

# 91. Refunds

Agreement must state whether refunded transaction remains royalty-eligible.

---

# 92. Cancellation

Cancelled sales should follow defined eligibility.

---

# 93. Chargeback / Fraud

Can create reversal/hold if contract defines.

---

# 94. Reversal

Canonical:

> Previous earning is adjusted through a reversal entry, not silently deleted.

---

# 95. Creator Statement

Creator should receive sufficient breakdown to understand:

```text
ELIGIBLE SALES
RATE / BASIS
EARNINGS
REVERSALS
PAYMENTS
```

---

# 96. Creator Sales ≠ Creator Earnings

Canonical.

---

# 97. Gross Sales ≠ Royalty Base

Unless agreement explicitly defines so.

---

# 98. Creator Dashboard

Should display terms using understandable language.

---

# 99. Payment Schedule

Agreement should define:

```text
PAYMENT CYCLE
CUT-OFF
VALIDATION
```

---

# 100. Payout Threshold

If used, clearly disclose.

---

# 101. Payment Information

Creator responsible for maintaining valid payout information.

---

# 102. Payment Detail Changes

High-risk change may require verification.

---

# 103. Failed Payout

Agreement/workflow should define recovery process.

---

# 104. Payment Does Not Erase Ledger

Canonical.

---

# 105. Taxes

Agreement should allocate responsibility for applicable tax documentation, withholding, invoicing, or other obligations based on actual legal/tax structure.

Specific treatment requires qualified finance/tax review.

---

# 106. Creator Legal Status

Potential:

```text
INDIVIDUAL
BUSINESS ENTITY
FOREIGN COUNTERPARTY
```

can affect operational requirements.

---

# 107. Foreign Creator

Requires additional review for:

```text
CURRENCY
TAX
TERRITORY
PAYMENT
CONTRACT LAW
```

before scale.

---

# 108. Expenses

Agreement should specify whether TeeStock reimburses:

```text
MATERIALS
TRAVEL
PRODUCTION
SHIPPING
```

for creator deliverables.

---

# 109. Pre-Approval

Reimbursable expenses should generally require prior approval.

---

# 110. Free Product / Samples

Define:

```text
CREATOR SAMPLE
PROMOTIONAL SAMPLE
PERSONAL USE
```

and quantities where material.

---

# 111. Sample ≠ Royalty Sale

Unless terms specify otherwise.

---

# 112. Creator Product Purchase

Creator buying their own merchandise is separate commercial transaction.

---

# 113. Content Deliverables

Campaign engagement should specify:

```text
FORMAT
PLATFORM
NUMBER
DUE DATE
CTA
MANDATORY FACTS
```

---

# 114. Creator Voice

TeeStock should preserve authentic creator voice where reasonable.

---

# 115. Product Claims

Creator must not make unsupported product claims supplied or approved outside factual product data.

---

# 116. Content Approval

Potential flow:

```text
BRIEF
↓
DRAFT / CREATOR CONTENT
↓
FACT / BRAND CHECK
↓
APPROVED
↓
PUBLISH
```

---

# 117. Content Usage Rights

Agreement should define TeeStock rights to:

```text
REPOST
EDIT
CROP
ADVERTISE
BOOST
ARCHIVE
USE ON WEBSITE
```

as applicable.

---

# 118. Organic Repost vs Paid Usage

May require different commercial terms.

---

# 119. Paid Media Rights

Define duration and platform scope.

---

# 120. Whitelisting / Creator Account Advertising

If future campaigns use creator account authorization for ads, require explicit arrangement and platform-safe permissions.

---

# 121. Content Ownership

Creator may retain ownership while granting TeeStock use rights.

---

# 122. Campaign Content Term

May differ from Artwork merchandise term.

---

# 123. Creator Name / Likeness

Agreement should define commercial use of:

```text
NAME
IMAGE
BIO
HANDLE
LOGO
LIKENESS
```

for collaboration promotion.

---

# 124. Name/Likeness Scope

Should be limited to reasonable agreed purposes.

---

# 125. No Implied Endorsement Beyond Relationship

Canonical.

---

# 126. Portfolio Rights

Agreement can define whether TeeStock may showcase collaboration historically after term.

---

# 127. Creator Portfolio Rights

Likewise creator may want right to show work.

Define confidentiality/launch timing.

---

# 128. Embargo

Unreleased project information may be under embargo.

---

# 129. Confidentiality

Potential confidential information:

```text
UNRELEASED PRODUCTS
SALES DATA
ROYALTY TERMS
CUSTOMER DATA
BUSINESS STRATEGY
SUPPLIER INFORMATION
```

---

# 130. Confidentiality Scope

Should be proportionate.

---

# 131. Public Information

Need not be treated as confidential solely because agreement exists.

---

# 132. Launch Confidentiality

Creator should not leak product before agreed launch.

---

# 133. TeeStock Confidentiality

TeeStock should also protect creator confidential information.

---

# 134. Personal Data

Handled under applicable privacy/data policies.

---

# 135. Customer Data

Creator should not receive unnecessary customer PII.

---

# 136. Prohibited Creator Submission

Potential:

```text
UNAUTHORIZED THIRD-PARTY IP
ILLEGAL CONTENT
FRAUDULENT MATERIAL
MALWARE / UNSAFE FILES
```

plus content TeeStock chooses not to commercialize under brand policies.

---

# 137. Prohibited Content Policy

Should exist independently from arbitrary case-by-case decisions.

---

# 138. Creator Representation

Creator should not knowingly submit material they lack authority to commercialize.

---

# 139. Evidence Request

TeeStock may request rights evidence for elevated-risk assets.

---

# 140. Failure to Provide Evidence

May result in:

```text
HOLD
REJECTION
SUSPENSION
```

of affected asset/activity.

---

# 141. Brand Standards

Creator work commercialized under TeeStock may be subject to:

```text
QUALITY
TECHNICAL
BRAND
PRODUCT
LEGAL
```

requirements.

---

# 142. Brand Standards ≠ Ownership

TeeStock approval rights do not automatically transfer creator IP.

---

# 143. Creator Conduct

Agreement may define objective obligations affecting the partnership.

---

# 144. Avoid Vague Morality Clauses

Where reputation clauses are used, triggers and consequences should be as objective and proportional as practical.

---

# 145. Illegal/Fraudulent Conduct

Material fraud or deliberate rights misrepresentation can justify suspension/termination subject to agreement.

---

# 146. Public Controversy

Should not automatically trigger arbitrary termination.

Use defined brand-risk process.

---

# 147. Relationship Independence

Unless intentionally structured otherwise, creator should not be represented as TeeStock employee, legal partner, or agent merely because of Creator Program participation.

---

# 148. Authority Limitation

Creator cannot bind TeeStock to contracts or obligations unless specifically authorized.

---

# 149. TeeStock Authority Limitation

Likewise TeeStock should only exercise creator rights actually granted.

---

# 150. No Partnership by Label

Calling someone “creator partner” in marketing should not silently create unintended legal relationship.

Contract terminology should remain clear.

---

# 151. Subcontracting

Creator may need approval before subcontracting material deliverables if authorship/provenance matters.

---

# 152. Contributor Disclosure

Creator should disclose material additional contributors.

---

# 153. Additional Contributor Rights

All necessary contributor rights must be resolved before delivery is commercialized.

---

# 154. AI Use Disclosure

For commissioned or submitted strategic creative assets, TeeStock may require disclosure of material generative-AI use.

---

# 155. AI Use Does Not Automatically Disqualify

Canonical.

---

# 156. AI Disclosure Purpose

Supports:

```text
PROVENANCE
RIGHTS REVIEW
CLIENT REQUIREMENTS
BRAND RISK
```

---

# 157. Restricted AI Inputs

Creator should not feed TeeStock confidential material into unapproved AI services where agreement/policy restricts it.

---

# 158. AI-Assisted Deliverable

Still subject to originality/third-party rights representations appropriate to agreement.

---

# 159. Files and Source Assets

Agreement/project schedule should define required:

```text
SOURCE FILE
EXPORT
FONT REFERENCES
LICENSE INFORMATION
```

where necessary.

---

# 160. Source File Ownership

File transfer does not independently determine underlying IP ownership.

---

# 161. File Retention

TeeStock may retain commercial/audit files according to policy.

---

# 162. File Return / Deletion

If agreement requires deletion after termination, operational process must identify:

```text
WHICH FILES
WHEN
EXCEPTIONS FOR LEGAL/AUDIT ARCHIVE
```

---

# 163. Creator Access to Files

Creator Platform should expose only authorized assets.

---

# 164. Agreement Term

Potential:

```text
FIXED TERM
PROJECT TERM
ONGOING UNTIL TERMINATED
```

depending relationship.

---

# 165. Program Term vs License Term

Critical:

```text
CREATOR PROGRAM AGREEMENT
may continue

while

ARTWORK LICENSE
expires
```

---

# 166. Agreement Effective Dates

Must be structured.

---

# 167. Renewal

Potential:

```text
MANUAL RENEWAL
AUTO-RENEW
NEW SCHEDULE
```

---

# 168. Renewal Reminder

MGBOS event-driven.

---

# 169. Termination for Convenience

May be available subject to:

```text
NOTICE PERIOD
OPEN PROJECTS
RIGHTS
EARNINGS
```

---

# 170. Termination for Cause

Potential:

```text
MATERIAL BREACH
RIGHTS MISREPRESENTATION
FRAUD
NON-PERFORMANCE
```

as legally reviewed.

---

# 171. Cure Period

Certain breaches may allow a period to remedy before termination.

---

# 172. Immediate Suspension

May be appropriate for credible high-risk:

```text
IP CLAIM
FRAUD
SECURITY
ILLEGAL ACTIVITY
```

subject to framework/legal review.

---

# 173. Suspension ≠ Termination

Canonical.

---

# 174. Suspension Scope

Target affected:

```text
ASSET
PROGRAM
PRODUCT
PAYOUT
```

rather than entire creator relationship when unnecessary.

---

# 175. Valid Earnings

Suspension should not automatically erase legitimate accrued creator earnings.

---

# 176. Held Earnings

Can be used where contract/legal circumstances justify temporary hold.

Reason must be recorded.

---

# 177. Offboarding

Canonical:

```text
STOP NEW PARTICIPATION
↓
RESOLVE ACTIVE PROJECTS
↓
RESOLVE RIGHTS
↓
RESOLVE INVENTORY
↓
FINALIZE EARNINGS
↓
FINAL PAYOUT
↓
REVOKE ACCESS
↓
ARCHIVE
```

---

# 178. License After Program Exit

Creator Program termination does not automatically determine existing Artwork License status.

Check actual agreement.

---

# 179. Product After Termination

Potential:

```text
IMMEDIATE STOP
SELL-OFF
CONTINUE UNTIL LICENSE EXPIRY
```

depending terms.

---

# 180. Sell-Off

Must define:

```text
DURATION
ELIGIBLE INVENTORY
ROYALTY
CHANNEL
NEW PRODUCTION
```

---

# 181. No Assumed New Production During Sell-Off

Canonical unless explicitly agreed.

---

# 182. Remaining Inventory Snapshot

Useful at termination date.

---

# 183. Open Orders

Agreement/offboarding process must determine fulfillment of already accepted customer Orders.

---

# 184. Existing Customer Commitments

Should be handled deliberately to avoid creator dispute becoming customer chaos.

---

# 185. Post-Term Marketing

Determine whether TeeStock may retain:

```text
PAST SOCIAL POSTS
EDITORIAL ARCHIVE
CASE STUDY
PORTFOLIO
```

---

# 186. Paid Ads After Termination

Should stop unless rights expressly continue.

---

# 187. Creator Storefront

At termination:

```text
DEACTIVATE
ARCHIVE
or
LIMIT
```

based on remaining rights/products.

---

# 188. Final Statement

Creator should receive closing financial statement where applicable.

---

# 189. Final Payout

Only after:

```text
VALIDATED EARNINGS
REVERSALS
HOLDS
```

are resolved according to terms.

---

# 190. Agreement Change

Material changes should use:

```text
AMENDMENT
NEW SCHEDULE
NEW VERSION
```

---

# 191. No Chat-Only Contract Changes

Canonical for material:

```text
ROYALTY
RIGHTS
TERM
EXCLUSIVITY
```

changes.

---

# 192. Agreement Versioning

Historical agreement must remain preserved.

---

# 193. Current Agreement

MGBOS indicates active version.

---

# 194. Historical Transactions

Reference agreement/rule applicable at that time.

---

# 195. Dispute Categories

Potential:

```text
OWNERSHIP
RIGHTS SCOPE
ROYALTY
ATTRIBUTION
PAYMENT
DELIVERABLE
TERMINATION
```

---

# 196. Dispute Workflow

Canonical:

```text
ISSUE REPORTED
↓
CASE CREATED
↓
PRESERVE EVIDENCE
↓
IDENTIFY AGREEMENT / VERSION
↓
REVIEW
↓
NEGOTIATE / RESOLVE
↓
RECORD OUTCOME
```

---

# 197. Good-Faith Reconciliation

Financial disputes should first reconcile source transactions/rules before assuming misconduct.

---

# 198. Escalation

Material disputes should be escalated to qualified legal/finance review.

---

# 199. Governing Law / Venue

Final executed agreements should specify dispute/governing-law mechanics appropriate to the parties and transaction.

This framework does not hardcode final legal wording.

---

# 200. Indemnity

Where used, scope should be proportionate and receive legal drafting/review.

---

# 201. Liability

Likewise final limitations/exclusions require legal review and should not be improvised by operations.

---

# 202. Representations and Warranties

Framework expects appropriate representations around:

```text
AUTHORITY
RIGHTS
ORIGINALITY / AUTHORIZED MATERIALS
COMPLIANCE
DELIVERABLES
```

as suitable.

---

# 203. Remedies

Final contract should define what happens upon breach.

Operational system should not invent remedies not in contract/policy.

---

# 204. Agreement Schedule Architecture

Recommended:

```text
MASTER CREATOR AGREEMENT

SCHEDULE A
Creator / Project Details

SCHEDULE B
Assets & Deliverables

SCHEDULE C
Rights & License

SCHEDULE D
Economics

SCHEDULE E
Campaign / Content Requirements
```

only include relevant schedules.

---

# 205. Agreement Data Model

Core:

```text
CreatorAgreement
AgreementVersion
AgreementParty
AgreementSchedule
Deliverable
RightsGrant
RoyaltyRule
FeeRule
ApprovalRequirement
ConfidentialityScope
TerminationRule
SellOffRule
```

---

# 206. Creator Agreement

Canonical relationship to Creator.

---

# 207. Agreement Version

Preserves executed version.

---

# 208. Agreement Party

Potential:

```text
TEEStock ENTITY
CREATOR / CREATOR ORGANIZATION
MANAGEMENT ENTITY
```

---

# 209. Deliverable Object

Links contractual obligation to operational tasks/assets.

---

# 210. Rights Grant

Machine-readable rights from agreement.

---

# 211. Royalty Rule

Machine-readable economics.

---

# 212. Fee Rule

Fixed/milestone payments.

---

# 213. Approval Requirement

Machine-readable:

```text
WHAT REQUIRES APPROVAL
WHO APPROVES
DEADLINE
```

---

# 214. Termination Rule

Structured operational effects.

---

# 215. Sell-Off Rule

Structured post-term rights.

---

# 216. Agreement → MGBOS Translation

Canonical:

```text
SIGNED CONTRACT
↓
STRUCTURED AGREEMENT DATA
↓
RULES
↓
WORKFLOWS
↓
COMMERCE / CREATOR / FINANCE CONTROLS
```

---

# 217. Contract PDF Is Evidence

Canonical rules should not rely solely on runtime parsing of PDF.

---

# 218. Structured Contract Extraction

Human enters/validates key terms once.

---

# 219. AI Contract Extraction

Can propose structured fields.

---

# 220. Human Validation Required

Before:

```text
ACTIVE RIGHTS
ROYALTY RULE
TERMINATION RULE
```

become canonical.

---

# 221. Contract-to-System Fields

Minimum:

```text
agreement_type
effective_date
expiry_date
rights_model
asset_scope
territory
channels
product_scope
exclusivity
royalty_basis
royalty_rate
payment_cycle
sell_off
```

where applicable.

---

# 222. Agreement Event Model

Potential:

```text
creator_agreement.created
creator_agreement.sent
creator_agreement.signed
creator_agreement.activated
creator_agreement.amended
creator_agreement.expiring
creator_agreement.suspended
creator_agreement.terminated
```

---

# 223. Deliverable Events

Potential:

```text
creator_deliverable.requested
creator_deliverable.submitted
creator_deliverable.approved
creator_deliverable.rejected
```

---

# 224. Creator Approval Events

Potential:

```text
creator_approval.requested
creator_approval.completed
creator_approval.expired
```

---

# 225. Agreement Expiry Automation

Potential:

```text
90 DAYS
→ review

30 DAYS
→ renewal decision

EXPIRY
→ apply contract rules
```

---

# 226. Royalty Automation

Deterministic.

---

# 227. Fixed Fee Automation

Can create payable upon contractual milestone.

---

# 228. Milestone Example

```text
DELIVERABLE APPROVED
↓
FEE PAYABLE
```

if contract says so.

---

# 229. Approval Workflow

MGBOS may prevent product progression until required creator approval obtained.

---

# 230. Rights Gate

Commerce checks active Rights Grant.

---

# 231. Content Gate

Marketing checks campaign/content-use rights.

---

# 232. Payout Gate

Finance checks:

```text
EARNING VALIDATED
+
PAYMENT DETAILS
+
PAYOUT SCHEDULE
```

---

# 233. Termination Automation

Should prepare actions.

High-impact termination should not generally be executed blindly by AI.

---

# 234. Creator Agreement Dashboard

Potential:

```text
ACTIVE
EXPIRING
AWAITING SIGNATURE
SUSPENDED
MISSING STRUCTURED TERMS
```

---

# 235. Creator Detail

Potential:

```text
AGREEMENTS
RIGHTS
PRODUCTS
DELIVERABLES
EARNINGS
PAYOUTS
```

---

# 236. Agreement Detail

Potential:

```text
PARTIES
TERM
RIGHTS
ECONOMICS
ASSETS
APPROVALS
STATUS
DOCUMENTS
```

---

# 237. Agreement Health

Potential flags:

```text
EXPIRING SOON
MISSING ASSET SCHEDULE
MISSING PAYMENT INFO
RIGHTS CONFLICT
```

---

# 238. AI Role

AI may assist:

```text
SUMMARIZE CONTRACT
EXTRACT TERMS
COMPARE VERSIONS
FLAG MISSING CLAUSES
PREPARE CREATOR SUMMARY
```

---

# 239. AI Negotiation Support

Can model consequences:

```text
ROYALTY 8% vs 10%
EXCLUSIVE vs NON-EXCLUSIVE
12 vs 24 MONTHS
```

for internal review.

---

# 240. AI Boundary

AI does not:

```text
SIGN AGREEMENT
WAIVE RIGHTS
CHANGE ROYALTY
TERMINATE MATERIAL CONTRACT
ADJUDICATE IP DISPUTE
```

without authorized human/legal process.

---

# 241. Creator-Facing AI

Future Creator Assistant may explain:

```text
PRODUCT STATUS
EARNINGS
PAYOUT
DELIVERABLES
```

using structured agreement data.

---

# 242. Creator-Facing Legal Interpretation

AI should not present itself as creator's independent legal adviser.

---

# 243. Plain-Language Summary

TeeStock may provide creator-friendly summary alongside formal agreement.

---

# 244. Summary ≠ Contract

Canonical.

---

# 245. Creator Understanding

Important commercial terms should be understandable.

Especially:

```text
WHO OWNS THE WORK
WHAT TEEStock MAY DO
HOW CREATOR GETS PAID
WHEN AGREEMENT ENDS
```

---

# 246. Agreement Complexity

Use simplest structure that adequately protects the relationship.

---

# 247. Small Creator Submission

May use:

```text
MASTER PROGRAM TERMS
+
SIMPLE ARTWORK LICENSE SCHEDULE
```

---

# 248. Strategic Collaboration

May require bespoke agreement.

---

# 249. Major Merch Partnership

May require:

```text
MERCH SERVICES
BRAND RIGHTS
ECONOMICS
INVENTORY
MARKETING
FULFILLMENT
```

terms beyond standard Creator Agreement.

---

# 250. V1 Agreement Stack

Recommended initial TeeStock stack:

```text
CREATOR PROGRAM AGREEMENT
+
ARTWORK LICENSE SCHEDULE
+
COMMISSION / COLLAB ADDENDUM when needed
```

---

# 251. V1 Creator Agreement Data

At minimum capture:

```text
CREATOR
AGREEMENT TYPE
STATUS
TERM
RIGHTS MODEL
ASSET SCOPE
ROYALTY / FEE
PAYMENT CYCLE
```

---

# 252. V1 Rights

At minimum:

```text
OWNERSHIP
LICENSE
PRODUCT
CHANNEL
TERRITORY
MODIFICATION
TERM
```

---

# 253. V1 Royalty

Keep formulas simple and deterministic.

---

# 254. V1 Agreement Storage

```text
SIGNED DOCUMENT
+
STRUCTURED MGBOS RECORD
```

---

# 255. V1 Signature

Use appropriate documented execution process.

Specific electronic-signature implementation can be selected later.

---

# 256. V1 Manual Review

Human validates every Creator Agreement activation.

---

# 257. V1 Avoid

Do not immediately build:

```text
FULL CONTRACT LIFECYCLE MANAGEMENT PLATFORM
AUTONOMOUS AI NEGOTIATION
DYNAMIC SMART CONTRACT ROYALTIES
COMPLEX GLOBAL CREATOR TAX ENGINE
```

---

# 258. V2 Expansion

Potential:

```text
CREATOR SELF-SERVICE AGREEMENT VIEW
ROYALTY STATEMENTS
EXPIRY WORKFLOWS
STANDARDIZED ADDENDA
```

---

# 259. V3 Expansion

Potential:

```text
E-SIGN INTEGRATION
AI CONTRACT EXTRACTION
AGREEMENT RULE ENGINE
```

---

# 260. V4 Expansion

Potential:

```text
MULTI-TERRITORY CREATOR CONTRACTING
ADVANCED COMMERCIAL TERM LIBRARY
AUTOMATED LOW-RISK RENEWALS
```

---

# 261. Creator Onboarding Gate

```text
IDENTITY
+
PROGRAM ACCEPTANCE
+
ACTIVE AGREEMENT
+
PAYMENT READINESS
```

before full participation where required.

---

# 262. Artwork Commercialization Gate

```text
ARTWORK
+
RIGHTS DECLARATION
+
ACTIVE AGREEMENT
+
CLEARANCE
```

---

# 263. Product Activation Gate

```text
ACTIVE CREATOR RELATIONSHIP
+
ACTIVE RIGHTS
+
ROYALTY / COMMERCIAL RULE
+
PRODUCT APPROVAL
```

---

# 264. Campaign Activation Gate

```text
DELIVERABLES
+
CONTENT RIGHTS
+
FEE / ECONOMICS
+
APPROVALS
```

---

# 265. Payout Gate

```text
PAYABLE EARNINGS
+
VERIFIED PAYMENT DETAILS
+
NO VALID PAYMENT BLOCK
+
TREASURY APPROVAL
```

---

# 266. Agreement Renewal Gate

```text
RELATIONSHIP VALUE
+
RIGHTS NEED
+
ECONOMICS
+
PERFORMANCE
+
UPDATED TERMS
```

---

# 267. Termination Gate

Before closure:

```text
OPEN PROJECTS
RIGHTS
INVENTORY
CAMPAIGNS
EARNINGS
PAYOUT
ACCESS
```

must be reviewed.

---

# 268. Creator Agreement Failure Modes

## Creator Joins Through DM

No contract truth.

## “We Split Profit”

Undefined economics.

## “Design Belongs to Both”

Undefined IP.

## Creator Paid = TeeStock Owns It

False assumption.

## Royalty Changed in Chat

Historical dispute risk.

## Creator Leaves = Product Automatically Removed

Not necessarily contractually correct.

---

# 269. Rights Failure Modes

## No Asset Schedule

Unknown coverage.

## No Modification Rights

Production/design friction.

## No Territory

Expansion risk.

## No Content Usage Rights

Campaign conflict.

## No Sell-Off Rule

Inventory conflict.

---

# 270. Financial Failure Modes

## Sales = Royalty

Ambiguous.

## No Return Treatment

Earnings disputes.

## Spreadsheet Only

Poor traceability.

## Payout Without Ledger

Reconciliation failure.

---

# 271. Relationship Failure Modes

## One Contract for Every Creator

Poor fit.

## Bespoke Contract for Every Tiny Submission

Operational overload.

## Creator Doesn't Understand Economics

Trust failure.

## TeeStock Cannot Explain Calculation

Trust failure.

---

# 272. AI Failure Modes

## AI Turns Draft Into Active Contract Terms

Dangerous.

## AI Interprets Ambiguous Clause as Fact

Risk.

## AI Auto-Termination

Excessive authority.

---

# 273. What Creator Agreement Framework Must Not Become

## Creator Bureaucracy

Structure should make participation easier.

## Rights Grab

TeeStock should obtain rights appropriate to actual business needs.

## Ambiguous Revenue Share

Economics must be measurable.

## Contract PDF Graveyard

Terms must translate to operations.

## Creator Portal With Different Terms From Contract

One canonical agreement truth.

---

# 274. Success Definition

The framework succeeds when TeeStock can answer:

```text
WHO
is the contractual creator?

WHAT
are they participating in?

WHAT
must they deliver?

WHO
owns each asset?

WHAT RIGHTS
did TeeStock receive?

FOR HOW LONG?

WHERE?

ON WHAT PRODUCTS?

DOES CREATOR
have approval rights?

HOW
are they paid?

WHICH SALES
generate earnings?

HOW
are returns handled?

WHEN
are earnings payable?

WHAT HAPPENS
when the relationship ends?

CAN EXISTING STOCK
still sell?

WHICH MGBOS RULES
came from this agreement?

CAN BOTH TEEStock AND CREATOR
understand the same commercial truth?
```

---

# 275. Canonical Creator Agreement Summary

```text
CREATOR IDENTITY
defines the counterparty.

AGREEMENT
defines the relationship.

DELIVERABLE
defines the work.

RIGHTS GRANT
defines TeeStock authority.

APPROVAL RULE
defines creative control.

ROYALTY / FEE
defines creator economics.

EARNING
records financial entitlement.

PAYOUT
settles entitlement.

TERM
defines relationship duration.

SELL-OFF
governs post-term commerce.

MGBOS
translates the contract into operational rules.
```

---

# 276. Canonical Creator Agreement Principles

```text
IF THE RELATIONSHIP CREATES RIGHTS, MONEY, OR OBLIGATIONS, PUT IT IN THE AGREEMENT AND PUT THE AGREEMENT INTO THE SYSTEM.

ONE CREATOR MAY HAVE MULTIPLE AGREEMENTS.

IDENTITY, PROGRAM PARTICIPATION, AND IP OWNERSHIP ARE DIFFERENT CONCEPTS.

PAYMENT DOES NOT AUTOMATICALLY TRANSFER IP.

OWNERSHIP AND LICENSE MUST BE EXPLICIT.

RIGHTS SHOULD MATCH THE BUSINESS NEED.

CREATOR ECONOMICS MUST BE MATHEMATICALLY UNDERSTANDABLE.

ROYALTY RULES MUST BE VERSIONED.

HISTORICAL TRANSACTIONS KEEP HISTORICAL TERMS.

RETURNS AND REVERSALS MUST BE DEFINED.

VALID EARNINGS SHOULD NOT DISAPPEAR BECAUSE A RELATIONSHIP ENDS.

PROGRAM TERMINATION AND LICENSE TERMINATION ARE NOT AUTOMATICALLY THE SAME EVENT.

SELL-OFF RIGHTS MUST BE EXPLICIT.

MATERIAL CONTRACT CHANGES SHOULD NOT LIVE ONLY IN CHAT.

A CONTRACT PDF IS EVIDENCE; STRUCTURED CONTRACT DATA DRIVES OPERATIONS.

AI MAY EXTRACT, SUMMARIZE, AND COMPARE. AUTHORIZED HUMANS VALIDATE MATERIAL TERMS.

MGBOS SHOULD ENFORCE THE AGREEMENT, NOT INVENT IT.
```

---

# 277. Dependency

Dokumen berikut harus follow Creator Agreement Framework:

1. [[bisnis/teestock/12-legal-ip/trademark-framework|trademark-framework.md]]
2. [[bisnis/teestock/12-legal-ip/customer-commerce-policy|customer-commerce-policy.md]]
3. [[bisnis/teestock/13-metrics-experiments/kpi-framework|kpi-framework.md]]
4. [[bisnis/teestock/13-metrics-experiments/experimentation-framework|experimentation-framework.md]]
5. [[bisnis/teestock/13-metrics-experiments/decision-thresholds|decision-thresholds.md]]
6. [[bisnis/teestock/14-roadmap/master-roadmap|master-roadmap.md]]
7. [[bisnis/teestock/14-roadmap/capability-roadmap|capability-roadmap.md]]

TeeStock Creator Agreement Framework boleh berkembang dari standardized Creator Program + Artwork License schedules menjadi creator self-service contracting, automated earnings, e-signature, contract lifecycle management, AI-assisted term extraction, dan multi-jurisdiction creator relationships, tetapi complexity hanya boleh meningkat sambil mempertahankan explicit rights, understandable economics, historical integrity, creator transparency, human legal authority, and reliable Agreement → Rule → Transaction → Earning lineage.