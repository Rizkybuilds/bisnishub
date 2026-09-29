---
title: "TeeStock Creator Platform"
date: "2026-09-28"
bisnis: teestock
kategori: operasional
status: active
tags:
  - bisnis/teestock
  - kategori/operasional
  - teestock/canonical
  - teestock/product-tech
document_id: "TS-TEC-004"
version: "1.0"
category: "product-tech"
business: "teestock"
last_updated: "2026-09-28"
path: "10-product-tech/creator-platform.md"
depends_on:
  - "TS-TEC-001"
  - "TS-TEC-002"
  - "TS-TEC-003"
  - "TS-PRG-002"
  - "TS-SVC-004"
  - "TS-SVC-005"
  - "TS-COM-002"
  - "TS-ORG-001"
  - "TS-FIN-002"
  - "TS-MKT-003"
  - "TS-MKT-004"
  - "TS-MKT-005"
  - "TS-OPS-007"
---


# TeeStock Creator Platform v1.0

> [!abstract] **Canonical TeeStock Creator, Collaboration, Artwork, Merch, Attribution & Earnings Platform Framework  **
> Dokumen ini mendefinisikan creator identity, onboarding, applications, artwork submissions, intellectual-property records, licensing, collaborations, creator products, storefronts, merch projects, campaign assets, sales attribution, royalty earnings, commissions, payout visibility, creator analytics, permissions, workflows, automation, dan progressive creator self-service.
>
> [!info] **Dependencies & Data Flow (SSOT)**
> [[bisnis/teestock/10-product-tech/digital-product-vision|TS-TEC-001: TeeStock Digital Product Vision]] • [[bisnis/teestock/10-product-tech/website-information-architecture|TS-TEC-002: TeeStock Website Information Architecture]] • [[bisnis/teestock/10-product-tech/commerce-platform|TS-TEC-003: TeeStock Commerce Platform]] • [[bisnis/teestock/06-programs/creator-program|TS-PRG-002: TeeStock Creator Program]] • [[bisnis/teestock/04-services/merch|TS-SVC-004: TeeStock Merch]] • [[bisnis/teestock/04-services/studio|TS-SVC-005: TeeStock Studio]] • [[bisnis/teestock/03-commerce/teestock-selects|TS-COM-002: TeeStock Selects]] • [[bisnis/teestock/05-originals/originals-master-plan|TS-ORG-001: TeeStock Originals Master Plan]] • [[bisnis/teestock/08-finance/unit-economics|TS-FIN-002: TeeStock Unit Economics]] • [[bisnis/teestock/09-marketing/content-engine|TS-MKT-003: TeeStock Content Engine]] • [[bisnis/teestock/09-marketing/channel-strategy|TS-MKT-004: TeeStock Channel Strategy]] • [[bisnis/teestock/09-marketing/retention-and-community|TS-MKT-005: TeeStock Retention & Community]] • [[bisnis/teestock/07-operations/customer-service|TS-OPS-007: TeeStock Customer Service System]]


---

# 1. Purpose

Creator Platform menjawab:

> **Bagaimana TeeStock mengelola hubungan dengan creator dari prospect hingga long-term commercial partnership melalui satu structured system yang transparan bagi creator dan reliable bagi operations, commerce, finance, dan IP governance?**

Canonical principle:

> **Creators should see opportunity and transparency. TeeStock should retain operational and commercial control.**

---

# 2. Canonical Definition

> **TeeStock Creator Platform adalah role-aware participant system yang menghubungkan creator identity, applications, creative IP, collaboration agreements, products, storefronts, campaigns, transaction attribution, earnings, payouts, analytics, dan operational workflows ke TeeStock Commerce Platform dan MGBOS melalui canonical creator and program data.**

---

# 3. Creator Platform Is Not a Separate Business

Critical:

```text id="crp001"
CREATOR PLATFORM
supports Creator relationships.

COMMERCE PLATFORM
handles transactions.

MGBOS
controls operations.

FINANCE
controls earnings and payouts.
```

---

# 4. Creator Platform Role

Creator Platform should reduce:

```text id="crp002"
MANUAL ONBOARDING
STATUS QUESTIONS
ARTWORK CHAOS
SALES REPORTING
PAYOUT QUESTIONS
COLLAB COORDINATION
```

---

# 5. Creator Platform Users

Potential:

```text id="crp003"
CREATOR
CREATOR TEAM MEMBER
TEEStock CREATOR MANAGER
DESIGN / STUDIO
MERCH OPERATOR
FINANCE
ADMIN
```

---

# 6. One Identity, Creator Role

Canonical:

```text id="crp004"
IDENTITY
+
CREATOR ROLE
=
CREATOR ACCESS
```

A creator may also be:

```text id="crp005"
CUSTOMER
AFFILIATE
BUSINESS CONTACT
```

without duplicated identity.

---

# 7. Creator Entity

Canonical Creator represents:

```text id="crp006"
PERSON
or
CREATIVE ORGANIZATION
```

with commercial relationship to TeeStock.

---

# 8. Creator Profile

Potential fields:

```text id="crp007"
Creator ID
Display Name
Legal / Payment Identity
Contact
Creator Type
Channels
Audience Links
Country / Currency
Program Status
```

---

# 9. Public vs Private Creator Data

Critical:

```text id="crp008"
PUBLIC
display name, bio, avatar.

PRIVATE
legal identity, payment details, agreements.
```

---

# 10. Creator Types

Potential:

```text id="crp009"
ARTIST / ILLUSTRATOR
DESIGNER
CONTENT CREATOR
PERSONAL BRAND
COMMUNITY
MEDIA / CULTURE BRAND
```

---

# 11. Creator Type Does Not Determine One Program

Same creator may participate through:

```text id="crp010"
ARTWORK
AFFILIATE
COLLAB
MERCH
```

---

# 12. Creator Lifecycle

Canonical:

```text id="crp011"
PROSPECT
↓
APPLICANT
↓
UNDER_REVIEW
↓
APPROVED
↓
ONBOARDING
↓
ACTIVE
↓
PAUSED
↓
INACTIVE / OFFBOARDED
```

---

# 13. Prospect

Potential creator not yet formally applied.

---

# 14. Applicant

Submitted program/application.

---

# 15. Under Review

TeeStock evaluating fit.

---

# 16. Approved

Accepted for defined participation.

---

# 17. Active

Creator currently has eligible collaboration/product/program activity.

---

# 18. Paused

Relationship temporarily inactive without full offboarding.

---

# 19. Offboarded

Commercial relationship ended or access revoked.

Historical records remain.

---

# 20. Creator Application

Canonical:

> **Application is a structured request to establish a Creator relationship or participate in a defined opportunity.**

---

# 21. Application Types

Potential:

```text id="crp012"
GENERAL CREATOR PROGRAM
ARTWORK SUBMISSION
COLLABORATION
MERCH PROJECT
AFFILIATE
```

---

# 22. Application Data

Potential:

```text id="crp013"
IDENTITY
CREATOR TYPE
PORTFOLIO
AUDIENCE
INTEREST
PROPOSAL
RIGHTS DECLARATION
```

---

# 23. Application Status

Canonical:

```text id="crp014"
DRAFT
SUBMITTED
UNDER_REVIEW
NEEDS_INFO
APPROVED
DECLINED
WITHDRAWN
```

---

# 24. Application Is Not Creator Approval

Approval remains explicit.

---

# 25. Review Criteria

Potential:

```text id="crp015"
CREATIVE FIT
AUDIENCE FIT
COMMERCIAL POTENTIAL
ORIGINALITY
RELIABILITY
BRAND FIT
RIGHTS RISK
```

---

# 26. Follower Count Is Not Approval Logic

Canonical.

---

# 27. Approval Scope

Creator may be approved for:

```text id="crp016"
ARTWORK
AFFILIATE
MERCH
COLLAB
```

independently.

---

# 28. Creator Program Enrollment

Canonical:

```text id="crp017"
CREATOR
+
PROGRAM
+
STATUS
+
TERMS
```

---

# 29. Enrollment ≠ Identity

Same creator can hold multiple enrollments.

---

# 30. Program Enrollment Status

Potential:

```text id="crp018"
PENDING
ACTIVE
SUSPENDED
ENDED
```

---

# 31. Creator Agreement

Formal legal/commercial agreement should link to Creator/Enrollment.

---

# 32. Agreement Data

Potential:

```text id="crp019"
Agreement ID
Creator
Agreement Type
Effective Date
Expiry
Rights
Compensation
Territory
Status
```

---

# 33. Agreement Versioning

New commercial/legal terms should create new agreement/version.

Do not overwrite accepted historical terms.

---

# 34. Agreement Status

Potential:

```text id="crp020"
DRAFT
SENT
SIGNED
ACTIVE
EXPIRED
TERMINATED
```

---

# 35. Creator Rights

Platform must preserve:

```text id="crp021"
WHO OWNS WHAT?
WHAT CAN TEEStock USE?
WHERE?
FOR HOW LONG?
FOR WHAT PURPOSE?
```

---

# 36. Artwork Entity

Canonical:

> **Artwork is a versioned creative asset with identifiable creator/source, rights, status, and permitted use.**

---

# 37. Artwork Data

Potential:

```text id="crp022"
Artwork ID
Creator
Title
File
Version
Submission
Ownership
License
Status
```

---

# 38. Artwork Submission

Lifecycle:

```text id="crp023"
DRAFT
↓
SUBMITTED
↓
REVIEW
↓
NEEDS_REVISION
↓
APPROVED / DECLINED
↓
PRODUCTION_READY
```

---

# 39. Submission ≠ Product

Canonical.

Artwork can exist without being commercialized.

---

# 40. Artwork Review

Potential:

```text id="crp024"
CREATIVE QUALITY
TECHNICAL FEASIBILITY
ORIGINALITY
RIGHTS
BRAND FIT
COMMERCIAL POTENTIAL
```

---

# 41. Rights Declaration

Creator should confirm they have authority to submit/license artwork.

---

# 42. Rights Verification

High-risk or valuable IP may require additional verification.

---

# 43. Artwork Versioning

Critical:

```text id="crp025"
V1
V2
V3
```

with one approved production version.

---

# 44. Production Asset

Approved artwork may generate:

```text id="crp026"
PRINT FILE
EMBROIDERY FILE
MOCKUP
PREVIEW
```

---

# 45. Production File ≠ Source Artwork

Keep distinction.

---

# 46. Licensing

Potential models:

```text id="crp027"
EXCLUSIVE
NON-EXCLUSIVE
LIMITED TERM
LIMITED PRODUCT
LIMITED TERRITORY
```

as contract allows.

---

# 47. Ownership vs License

Critical:

```text id="crp028"
OWNERSHIP
who owns IP.

LICENSE
what use is permitted.
```

---

# 48. Rights Expiry

Expired rights should automatically flag products/assets needing review.

---

# 49. Commercial Use Gate

Artwork should not become sellable product until:

```text id="crp029"
APPROVED
+
RIGHTS VALID
+
PRODUCTION FEASIBLE
```

---

# 50. Collaboration

Canonical:

> **Collaboration is a structured joint commercial/creative initiative between TeeStock and one or more external creators or brands.**

---

# 51. Collaboration Types

Potential:

```text id="crp030"
DESIGN COLLAB
CREATOR DROP
CO-BRANDED COLLECTION
CONTENT COLLAB
MERCH COLLAB
```

---

# 52. Collaboration Entity

Potential:

```text id="crp031"
Collaboration ID
Participants
Concept
Products
Campaign
Commercial Terms
Rights
Timeline
Status
```

---

# 53. Collaboration Lifecycle

Canonical:

```text id="crp032"
IDEA
↓
PROPOSED
↓
NEGOTIATING
↓
APPROVED
↓
IN_DEVELOPMENT
↓
READY
↓
LIVE
↓
COMPLETED
↓
ARCHIVED
```

---

# 54. Collaboration Proposal

Should define:

```text id="crp033"
WHY
AUDIENCE
PRODUCT
CREATIVE DIRECTION
ECONOMICS
TIMELINE
```

---

# 55. Collaboration Is Not Chat Agreement

Material commitments must become structured terms.

---

# 56. Creator Product

Canonical:

```text id="crp034"
CREATOR RELATIONSHIP
↓
ARTWORK / COLLAB
↓
TEEStock PRODUCT
```

---

# 57. Product Master Remains in Commerce

Creator Platform references Product.

It does not maintain separate creator-product master.

---

# 58. Creator Product Association

Potential:

```text id="crp035"
Product
Creator
Relationship Type
Royalty Rule
Collaboration
Effective Dates
```

---

# 59. Multiple Creators

Product can support multiple contributors.

Revenue allocation must be explicit.

---

# 60. Creator Credit

Public-facing product can display creator attribution where agreed.

---

# 61. Creator Storefront

Canonical:

> **Creator Storefront is a creator-specific commercial presentation of products powered by TeeStock Commerce Platform.**

---

# 62. Storefront Is Not Separate Commerce Engine

Canonical.

---

# 63. Creator Storefront Components

Potential:

```text id="crp036"
CREATOR PROFILE
PRODUCTS
COLLECTIONS
CONTENT
CTA
```

---

# 64. Creator Storefront URL

Potential:

```text id="crp037"
/creators/{creator-slug}
```

or future branded sub-experience.

---

# 65. Storefront Activation Gate

Activate when:

```text id="crp038"
CREATOR ACTIVE
+
SELLABLE PRODUCTS
+
CONTENT
+
VALID TERMS
```

---

# 66. Creator Merch

Merch is broader than one product collaboration.

---

# 67. Merch Project

Canonical:

> **Merch Project is a managed commercial initiative where TeeStock helps a creator, community, or brand develop, sell, and/or operate merchandise.**

---

# 68. Merch Project Data

Potential:

```text id="crp039"
Merch Project ID
Client / Creator
Concept
Products
Commercial Model
Launch
Inventory Model
Fulfillment Model
Status
```

---

# 69. Merch Commercial Models

Potential:

```text id="crp040"
WHOLESALE
REVENUE SHARE
ROYALTY
SERVICE FEE
HYBRID
```

---

# 70. Commercial Model Must Be Explicit

Do not infer earnings from creator role.

---

# 71. Merch Project Lifecycle

Canonical:

```text id="crp041"
DISCOVERY
↓
QUALIFIED
↓
CONCEPT
↓
COMMERCIAL AGREEMENT
↓
PRODUCT DEVELOPMENT
↓
LAUNCH READY
↓
LIVE
↓
OPERATING
↓
REVIEW / CLOSE
```

---

# 72. Merch Product Development

Can involve:

```text id="crp042"
STUDIO
PRODUCT
SOURCING
PRODUCTION
PRICING
CONTENT
```

---

# 73. Merch Inventory Models

Potential:

```text id="crp043"
PREORDER
MADE_TO_ORDER
READY_STOCK
HYBRID
```

---

# 74. Merch Fulfillment

Can be:

```text id="crp044"
TEEStock FULFILL
CLIENT FULFILL
PARTNER FULFILL
```

according to agreement.

---

# 75. Creator Sales Attribution

Canonical:

> **Creator attribution is the deterministic link between eligible commerce activity and the creator relationship that may generate earnings or performance reporting.**

---

# 76. Attribution Sources

Potential:

```text id="crp045"
PRODUCT OWNERSHIP
CREATOR STORE
REFERRAL LINK
AFFILIATE CODE
CAMPAIGN
COLLABORATION
```

---

# 77. Attribution Type Matters

Critical:

```text id="crp046"
ROYALTY ATTRIBUTION
may follow Product.

AFFILIATE ATTRIBUTION
may follow referral action.
```

Do not mix them.

---

# 78. Attribution Precedence

Must be defined per program.

Example conflicts:

```text id="crp047"
CREATOR PRODUCT
+
AFFILIATE LINK
+
PROMO CODE
```

---

# 79. Attribution Conflict

Should resolve deterministically using canonical program rules.

---

# 80. Attribution Snapshot

Order should preserve attribution basis at transaction time.

---

# 81. Historical Attribution

Do not recompute completed earnings from current program rules.

---

# 82. Royalty Rule

Canonical object defining how creator earns from eligible product transactions.

---

# 83. Royalty Rule Inputs

Potential:

```text id="crp048"
Product / Artwork / Collaboration
Creator
Basis
Rate
Effective Period
Eligibility
Return Rule
```

---

# 84. Royalty Bases

Potential:

```text id="crp049"
FIXED PER UNIT
PERCENT OF NET SALES
PERCENT OF DEFINED REVENUE BASE
```

as agreement defines.

---

# 85. Royalty Basis Must Be Precise

Avoid ambiguous:

> 10% dari penjualan.

Define exactly what “penjualan” means.

---

# 86. Affiliate Commission Rule

Separate canonical object/rule family.

---

# 87. Earning

Canonical:

> **Earning is a creator/participant financial entitlement generated by an eligible event under an active commercial rule.**

---

# 88. Earning Data

Potential:

```text id="crp050"
Earning ID
Creator
Source Transaction
Program
Rule
Amount
Currency
Status
```

---

# 89. Earning Status

Potential:

```text id="crp051"
PENDING
VALIDATED
HELD
REVERSAL_PENDING
PAYABLE
PAID
VOID
```

---

# 90. Pending Earning

Generated but not yet eligible for payout.

---

# 91. Validation Window

May account for:

```text id="crp052"
RETURN
CANCELLATION
FRAUD
PAYMENT SETTLEMENT
```

---

# 92. Validated Earning

Transaction survived required validation.

---

# 93. Held Earning

Temporarily blocked for defined reason.

---

# 94. Reversal

Refund/cancelled eligible sale may reduce previous earning.

---

# 95. Payout

Canonical:

```text id="crp053"
PAYABLE EARNINGS
↓
PAYOUT BATCH
↓
PAYMENT
↓
PAID
```

---

# 96. Creator Platform Does Not Move Money Independently

Treasury owns cash movement.

---

# 97. Creator Platform Shows Financial State

Creator can see:

```text id="crp054"
PENDING
VALIDATED
PAYABLE
PAID
```

earnings where supported.

---

# 98. Payout Batch

Potential:

```text id="crp055"
Batch ID
Period
Creator
Eligible Earnings
Amount
Status
Payment Reference
```

---

# 99. Payout Schedule

Program-specific:

```text id="crp056"
WEEKLY
BIWEEKLY
MONTHLY
```

as agreed.

---

# 100. Minimum Payout

Can exist if economically justified and clearly disclosed.

---

# 101. Failed Payout

Status should remain visible and recoverable.

---

# 102. Creator Payment Details

Sensitive.

Require restricted access and verification.

---

# 103. Payment Detail Change

High-risk action.

May require re-verification.

---

# 104. Creator Earnings Dashboard

Potential:

```text id="crp057"
PENDING EARNINGS
PAYABLE
PAID
SALES
PRODUCTS
PERIOD
```

---

# 105. Revenue ≠ Earnings

Creator dashboard must clearly distinguish:

```text id="crp058"
PRODUCT SALES
vs
CREATOR EARNINGS
```

---

# 106. Gross Sales ≠ Royalty Base

If agreement uses net or other basis, display clearly.

---

# 107. Sales Analytics

Potential:

```text id="crp059"
UNITS
NET SALES
ORDERS
CUSTOMERS
PRODUCT
CHANNEL
```

subject to creator data permissions.

---

# 108. Creator Analytics Scope

Creator should not receive unrelated TeeStock customer data.

---

# 109. Privacy Principle

Provide enough analytics to understand performance without exposing unnecessary PII.

---

# 110. Creator Customer Data

Default:

```text id="crp060"
AGGREGATED
```

unless agreement/business model explicitly requires more.

---

# 111. Creator Performance

Potential metrics:

```text id="crp061"
SALES
CONVERSION
CONTENT RESPONSE
NEW CUSTOMERS
REPEAT
```

depending collaboration.

---

# 112. Creator Rank

Avoid gamified public ranking by default.

Could distort creator relationships.

---

# 113. Creator Tier

If used, should define meaningful capability/commercial differences.

---

# 114. Tier Examples

Potential:

```text id="crp062"
STANDARD
GROWTH
STRATEGIC
```

based on relationship maturity, not popularity alone.

---

# 115. Tier Criteria

Potential:

```text id="crp063"
RELIABILITY
COMMERCIAL PERFORMANCE
CREATIVE FIT
REPEAT RELATIONSHIP
```

---

# 116. Tier Should Change an Action

If no service/economic difference, do not create it.

---

# 117. Creator Content Assets

Platform may manage:

```text id="crp064"
PHOTOS
VIDEOS
COPY
PRODUCT ASSETS
CAMPAIGN FILES
```

---

# 118. Content Rights

Store:

```text id="crp065"
WHO CREATED
WHO OWNS
WHERE TEEStock CAN USE
PAID USAGE
EXPIRY
```

---

# 119. Campaign

Creator may participate in one or more marketing campaigns.

---

# 120. Campaign Assignment

Potential:

```text id="crp066"
Creator
Campaign
Deliverables
Due Date
Usage Rights
Compensation
Status
```

---

# 121. Campaign Deliverable

Potential statuses:

```text id="crp067"
PLANNED
SUBMITTED
REVISION
APPROVED
PUBLISHED
```

---

# 122. Content Approval

Should not rewrite authentic creator voice unnecessarily.

But product facts/claims must remain accurate.

---

# 123. Campaign Compensation

Separate from product royalty where applicable.

---

# 124. One Creator Can Have Multiple Earning Types

Potential:

```text id="crp068"
ROYALTY
AFFILIATE COMMISSION
CAMPAIGN FEE
SERVICE / CREATIVE FEE
```

---

# 125. Earnings Ledger Must Identify Type

Canonical.

---

# 126. Creator Tasks

Workspace may show:

```text id="crp069"
SIGN AGREEMENT
UPLOAD ARTWORK
APPROVE MOCKUP
SUBMIT CONTENT
UPDATE PAYMENT INFO
```

---

# 127. Next Action

Creator should easily understand what is blocking progress.

---

# 128. Creator Notifications

Potential:

```text id="crp070"
APPLICATION UPDATED
ARTWORK REVIEWED
PRODUCT LIVE
EARNING VALIDATED
PAYOUT SENT
ACTION REQUIRED
```

---

# 129. Notifications Should Be Event-Driven

---

# 130. Creator Inbox

Not V1 requirement.

Email/WhatsApp can initially carry notifications while platform is source of truth.

---

# 131. Creator Support

Questions should create:

```text id="crp071"
CUSTOMER / PARTICIPANT CASE
```

rather than disappear in chat.

---

# 132. Creator Case Types

Potential:

```text id="crp072"
PAYOUT
PRODUCT
ARTWORK
RIGHTS
CAMPAIGN
ACCOUNT
```

---

# 133. Creator Onboarding

Canonical:

```text id="crp073"
APPROVAL
↓
AGREEMENT
↓
PROFILE
↓
PAYMENT DETAILS
↓
PROGRAM RULES
↓
FIRST ACTIVITY
```

---

# 134. Onboarding Completion

Should be explicitly tracked.

---

# 135. Onboarding Checklist

Potential:

```text id="crp074"
IDENTITY VERIFIED
AGREEMENT ACTIVE
PAYMENT READY
PROFILE COMPLETE
RIGHTS ACKNOWLEDGED
```

---

# 136. Creator KYC / Verification

Level depends on commercial/legal requirements.

Not every applicant needs heavy verification before review.

---

# 137. Payment Verification

Required before payout.

---

# 138. Creator Offboarding

Canonical:

```text id="crp075"
STOP NEW ACTIVITY
↓
RESOLVE OPEN RIGHTS / PRODUCTS
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

# 139. Offboarding Does Not Delete History

---

# 140. Product After Creator Offboarding

Depends on:

```text id="crp076"
RIGHTS
AGREEMENT
PRODUCT STATUS
```

not creator account status alone.

---

# 141. Expired Agreement

Should trigger review of affected:

```text id="crp077"
PRODUCTS
CONTENT
STOREFRONTS
```

---

# 142. Suspension

May temporarily block:

```text id="crp078"
NEW PRODUCTS
NEW CAMPAIGNS
PAYOUT if legally/contractually justified
```

depending reason.

---

# 143. Suspension Governance

Must not arbitrarily confiscate valid earnings.

---

# 144. Creator Permissions

Potential:

```text id="crp079"
VIEW OWN PROFILE
VIEW OWN PRODUCTS
VIEW OWN ANALYTICS
VIEW OWN EARNINGS
SUBMIT ARTWORK
MANAGE ALLOWED CONTENT
```

---

# 145. Creator Should Not Access

```text id="crp080"
OTHER CREATOR EARNINGS
INTERNAL COST
OTHER CUSTOMER DATA
INTERNAL APPROVAL NOTES
```

---

# 146. Team Access

Strategic creators may invite team members later.

---

# 147. Creator Team Roles

Potential:

```text id="crp081"
OWNER
MANAGER
ANALYST
CREATIVE
```

---

# 148. Team Access Gate

Only after enough multi-person creator accounts justify complexity.

---

# 149. Creator Organization

Needed when creator is:

```text id="crp082"
AGENCY
MEDIA BRAND
COMMUNITY
COMPANY
```

not just individual.

---

# 150. Creator Workspace Home

Potential:

```text id="crp083"
NEXT ACTIONS
LIVE PRODUCTS
SALES
EARNINGS
UPCOMING PAYOUT
COLLAB STATUS
```

---

# 151. Workspace Should Be Action-Oriented

Not dashboard-only.

---

# 152. Creator Product View

Potential:

```text id="crp084"
PRODUCT
STATUS
LIVE DATE
SALES
EARNINGS
ARTWORK
```

---

# 153. Collaboration View

Potential:

```text id="crp085"
CONCEPT
MILESTONES
FILES
PRODUCTS
CAMPAIGN
COMMERCIAL TERMS SUMMARY
```

---

# 154. Merch Project View

Potential:

```text id="crp086"
STATUS
PRODUCT DEVELOPMENT
LAUNCH
SALES
FULFILLMENT
EARNINGS / CLIENT ECONOMICS
```

as agreement allows.

---

# 155. Data Transparency

Creator should receive enough information to trust calculations.

---

# 156. Calculation Traceability

Earning detail may show:

```text id="crp087"
ORDER / PERIOD
ELIGIBLE BASIS
RULE
EARNING
REVERSAL
```

without exposing unnecessary internal cost.

---

# 157. Statement

Potential monthly creator statement:

```text id="crp088"
OPENING PAYABLE
NEW EARNINGS
REVERSALS
PAYOUT
CLOSING PAYABLE
```

---

# 158. Statement as Financial Record

Should remain downloadable/archived where appropriate.

---

# 159. Creator Tax Documentation

Future requirement depends on jurisdiction/legal structure.

Should integrate with Finance when needed.

---

# 160. Creator Search

Internal operators should search:

```text id="crp089"
CREATOR
ARTWORK
COLLAB
PRODUCT
PAYOUT
```

---

# 161. Creator Internal View

MGBOS may show:

```text id="crp090"
STATUS
PROGRAMS
AGREEMENTS
PRODUCTS
EARNINGS
CASES
RISK
```

---

# 162. Creator Risk Signals

Potential:

```text id="crp091"
RIGHTS DISPUTE
PAYOUT DISPUTE
REPUTATIONAL ISSUE
FRAUD
REPEATED DELIVERY FAILURE
```

---

# 163. Risk Is Not Automated Guilt

AI/rules can flag.

Human reviews material creator disputes.

---

# 164. Creator Program vs Merch Client

Critical:

```text id="crp092"
CREATOR PROGRAM PARTICIPANT
earns through TeeStock programs.

MERCH CLIENT
may purchase TeeStock services.
```

One entity can be both.

---

# 165. Commercial Relationship Type

Store explicitly.

---

# 166. Creator Program vs Affiliate

A creator can participate in both.

Earnings logic remains separate.

---

# 167. Creator Program vs Selects

Artwork can enter Selects through creator relationship.

Selects still controls curation.

---

# 168. Creator Program vs Originals

External creator work is not TeeStock Originals unless IP ownership/control fits Originals rules.

---

# 169. Creator Platform and Studio

Studio may support:

```text id="crp093"
DESIGN DEVELOPMENT
BRANDING
MOCKUP
PRODUCT CREATIVE
```

for creator/merch projects.

---

# 170. Creator Platform and Commerce

Commerce owns:

```text id="crp094"
PRODUCT
ORDER
PRICE
PAYMENT
```

Creator Platform consumes relevant data.

---

# 171. Creator Platform and Programs

Programs own participation rules.

---

# 172. Creator Platform and Finance

Finance owns:

```text id="crp095"
PAYABLE
PAYOUT
CASH MOVEMENT
```

---

# 173. Creator Platform and Legal/IP

Legal/IP owns:

```text id="crp096"
AGREEMENT FRAMEWORK
RIGHTS POLICY
DISPUTE PROCESS
```

---

# 174. Creator Platform and MGBOS

MGBOS orchestrates:

```text id="crp097"
APPROVALS
TASKS
EXCEPTIONS
WORKFLOWS
```

---

# 175. Creator Data Model

Core entities:

```text id="crp098"
CREATOR
CREATOR PROFILE
PROGRAM ENROLLMENT
APPLICATION
AGREEMENT
ARTWORK
ARTWORK VERSION
LICENSE
COLLABORATION
CREATOR PRODUCT RELATIONSHIP
MERCH PROJECT
ATTRIBUTION
EARNING
PAYOUT
CONTENT ASSET
```

---

# 176. Additional Future Entities

Potential:

```text id="crp099"
CREATOR TEAM
CREATOR STORE
CREATOR STATEMENT
CAMPAIGN DELIVERABLE
```

---

# 177. Creator Data Lineage

Canonical:

```text id="crp100"
CREATOR
↓
AGREEMENT / ENROLLMENT
↓
ARTWORK / COLLAB
↓
PRODUCT
↓
ORDER / ATTRIBUTION
↓
EARNING
↓
PAYABLE
↓
PAYOUT
```

---

# 178. Artwork Data Lineage

```text id="crp101"
SUBMISSION
↓
VERSION
↓
APPROVAL
↓
LICENSE
↓
PRODUCT
```

---

# 179. Creator Events

Potential:

```text id="crp102"
creator.applied
creator.approved
creator.activated
artwork.submitted
artwork.approved
collaboration.approved
creator_product.activated
earning.created
earning.validated
payout.completed
```

---

# 180. Creator Platform Analytics

Internal views:

```text id="crp103"
ACTIVE CREATORS
APPLICATIONS
LIVE CREATOR PRODUCTS
SALES
ROYALTIES
PAYOUT LIABILITY
```

---

# 181. Creator Cohorts

Can compare:

```text id="crp104"
ONBOARDING PERIOD
CREATOR TYPE
PROGRAM
```

---

# 182. Creator Productivity

Potential:

```text id="crp105"
SUBMISSIONS
APPROVED PRODUCTS
SALES
REPEAT COLLABS
```

but avoid turning creativity into meaningless volume quota.

---

# 183. Creator Commercial Quality

Potential:

```text id="crp106"
CONTRIBUTION
CUSTOMER QUALITY
RETURN
REPEAT DEMAND
```

---

# 184. Creator Relationship Quality

Also includes:

```text id="crp107"
RELIABILITY
COMMUNICATION
CREATIVE FIT
```

---

# 185. Creator Platform KPIs

Potential:

```text id="crp108"
APPLICATION → APPROVAL
APPROVAL → FIRST PRODUCT
TIME TO LAUNCH
ACTIVE CREATOR RATE
CREATOR SALES
EARNING ACCURACY
PAYOUT TIMELINESS
```

---

# 186. Time to First Value

Important creator platform metric:

```text id="crp109"
APPROVAL
→
FIRST MEANINGFUL COMMERCIAL OUTCOME
```

---

# 187. Creator Retention

Potential:

```text id="crp110"
REPEAT COLLAB
ACTIVE AFTER X PERIOD
```

with meaningful definitions.

---

# 188. Creator Support Load

Track repeated questions to identify platform gaps.

---

# 189. Automation Opportunities

Strong candidates:

```text id="crp111"
APPLICATION ROUTING
ARTWORK STATUS
RIGHTS EXPIRY ALERT
EARNING CALCULATION
PAYOUT PREPARATION
CREATOR NOTIFICATIONS
```

---

# 190. Application Automation

Can classify:

```text id="crp112"
ARTWORK
MERCH
AFFILIATE
COLLAB
```

for routing.

---

# 191. Artwork Workflow Automation

Potential:

```text id="crp113"
SUBMIT
→ REVIEW QUEUE
→ STATUS
→ CREATOR NOTIFICATION
```

---

# 192. Earning Automation

Should be deterministic from:

```text id="crp114"
ELIGIBLE TRANSACTION
+
ACTIVE RULE
=
EARNING
```

---

# 193. Payout Preparation Automation

Can compile validated payable earnings.

Treasury approves/executed according to policy.

---

# 194. Rights Expiry Automation

Can flag:

```text id="crp115"
PRODUCTS
CONTENT
CAMPAIGNS
```

affected by upcoming expiration.

---

# 195. Creator Communication Automation

Safe examples:

```text id="crp116"
STATUS UPDATE
PAYOUT NOTICE
ACTION REQUIRED
```

---

# 196. AI Role

AI may assist with:

```text id="crp117"
APPLICATION SUMMARY
PORTFOLIO SYNTHESIS
ARTWORK TAGGING
COLLAB IDEA
CREATOR PERFORMANCE SUMMARY
SUPPORT DRAFT
```

---

# 197. AI Application Review

May recommend fit based on defined criteria.

Human decides approval when relationship is material.

---

# 198. AI Artwork Review

Can assist technical checks:

```text id="crp118"
RESOLUTION
FORMAT
TAGGING
VISUAL DESCRIPTION
```

and flag potential review areas.

---

# 199. AI Rights Boundary

AI must not independently determine legal ownership from visual similarity.

Rights disputes require proper review.

---

# 200. AI Collaboration Matching

Can suggest:

```text id="crp119"
CREATOR
×
PRODUCT
×
AUDIENCE
```

opportunities.

---

# 201. AI Merch Ideation

Can support concept/product ideation.

Creator and TeeStock retain creative decision authority.

---

# 202. AI Creator Support

Can answer using real:

```text id="crp120"
PROGRAM
PRODUCT
EARNING
PAYOUT
STATUS
```

data.

---

# 203. AI Financial Boundary

AI must not:

```text id="crp121"
ALTER EARNINGS
APPROVE PAYOUT
CHANGE ROYALTY TERMS
```

without authority.

---

# 204. AI Creator Platform Principle

Canonical:

> **AI may accelerate coordination. It must not obscure creative rights or financial truth.**

---

# 205. Creator Platform Technical Architecture

Recommended:

```text id="crp122"
ROLE-AWARE MODULE
on shared TeeStock identity
+
COMMERCE
+
MGBOS
```

---

# 206. Avoid Separate Creator Database

Canonical creator data should be shared.

---

# 207. Creator Read Models

Creator dashboard can use optimized creator-facing summaries.

Canonical records remain central.

---

# 208. API Needs

Potential:

```text id="crp123"
PROFILE
APPLICATION
ARTWORK
PRODUCT
ANALYTICS
EARNING
PAYOUT
```

---

# 209. Creator API Permissions

Every endpoint must scope data to authorized creator/account.

---

# 210. File Storage

Artwork/content files need:

```text id="crp124"
VERSION
OWNER
RIGHTS
RELATED OBJECT
```

metadata.

---

# 211. Large File Upload

Future may require direct object-storage upload patterns.

Not business-architecture concern yet.

---

# 212. Creator Audit Trail

Material:

```text id="crp125"
AGREEMENT
RIGHTS
PAYOUT
ARTWORK APPROVAL
ROLE CHANGE
```

must be auditable.

---

# 213. Creator Security

Sensitive:

```text id="crp126"
PAYMENT DATA
LEGAL IDENTITY
AGREEMENTS
```

need stronger access.

---

# 214. Creator Authentication

Can share TeeStock customer identity system.

---

# 215. Role Upgrade

Customer becoming creator should add role, not create new identity.

---

# 216. Creator Impersonation

Internal support/admin access acting on creator account should be controlled and logged if ever supported.

---

# 217. Creator Platform Maturity

```text id="crp127"
LEVEL 0
Manual creator coordination

LEVEL 1
Structured applications + creator records

LEVEL 2
Artwork + products + earnings ledger

LEVEL 3
Creator dashboard + self-service

LEVEL 4
Integrated merch/campaign operations

LEVEL 5
AI-assisted creator ecosystem orchestration
```

---

# 218. Level 0

Anti-goal:

```text id="crp128"
DM
+
GOOGLE DRIVE
+
SPREADSHEET
+
MANUAL PAYOUT GUESS
```

---

# 219. Level 1

Build:

```text id="crp129"
CREATOR
APPLICATION
STATUS
AGREEMENT
PROGRAM ENROLLMENT
```

---

# 220. Level 2

Adds:

```text id="crp130"
ARTWORK
PRODUCT RELATIONSHIP
ROYALTY RULE
EARNING
PAYOUT
```

---

# 221. Level 3

Adds:

```text id="crp131"
CREATOR WORKSPACE
ANALYTICS
STATEMENTS
SELF-SERVICE
```

---

# 222. Level 4

Adds:

```text id="crp132"
MERCH PROJECTS
CAMPAIGN WORKFLOWS
CREATOR STORES
TEAM ACCESS
```

---

# 223. Level 5

Adds:

```text id="crp133"
AI CREATOR MATCHING
AI COLLAB RECOMMENDATION
AUTOMATED NORMAL WORKFLOWS
EXCEPTION-BASED OPERATIONS
```

---

# 224. Current Recommended Stage

TeeStock should target:

```text id="crp134"
LEVEL 1
→
LEVEL 2
```

first.

---

# 225. V1 Creator Platform Scope

Priority:

```text id="crp135"
CREATOR PROFILE
APPLICATION
PROGRAM ENROLLMENT
AGREEMENT
ARTWORK SUBMISSION
ARTWORK STATUS
CREATOR PRODUCT LINK
EARNING LEDGER
PAYOUT STATUS
```

---

# 226. V1 Creator UX

Can begin without full portal.

Possible:

```text id="crp136"
FORM
+
EMAIL / WHATSAPP NOTIFICATIONS
+
INTERNAL MGBOS
```

---

# 227. V1 Reporting

Periodic creator statement can initially be generated manually/system-assisted.

---

# 228. V1 Royalty

Use deterministic simple rules.

Avoid complex multi-variable revenue-share arrangements until required.

---

# 229. V1 Storefront

Creator products can live within TeeStock Shop/creator landing page.

No independent store engine required.

---

# 230. V1 Merch Projects

Managed manually through structured project records.

---

# 231. V1 Avoid

Do not immediately build:

```text id="crp137"
CREATOR MOBILE APP
SOCIAL NETWORK
OPEN ARTWORK MARKETPLACE
REAL-TIME ADVANCED ANALYTICS
COMPLEX CREATOR TIER GAMIFICATION
AUTONOMOUS AI CREATOR MANAGER
```

---

# 232. V2 Expansion

Possible:

```text id="crp138"
CREATOR DASHBOARD
EARNINGS VIEW
PAYOUT STATEMENTS
ARTWORK SELF-SERVICE
CREATOR STOREFRONTS
```

---

# 233. V3 Expansion

Possible:

```text id="crp139"
MERCH WORKSPACE
CAMPAIGN DELIVERABLES
CREATOR TEAM ACCESS
ADVANCED ANALYTICS
```

---

# 234. V4 Expansion

Possible:

```text id="crp140"
CREATOR DISCOVERY
COLLAB MATCHING
AI ASSISTANTS
DYNAMIC PROGRAM OPPORTUNITIES
```

---

# 235. Creator Approval Gate

Approve only when:

```text id="crp141"
FIT
+
RISK REVIEW
+
CLEAR PARTICIPATION PATH
```

exists.

---

# 236. Artwork Approval Gate

```text id="crp142"
CREATIVE APPROVED
+
TECHNICALLY FEASIBLE
+
RIGHTS VALID
```

---

# 237. Product Activation Gate

```text id="crp143"
ARTWORK / COLLAB APPROVED
+
PRODUCT READY
+
PRICE READY
+
ROYALTY RULE ACTIVE
+
RIGHTS ACTIVE
```

---

# 238. Creator Store Gate

```text id="crp144"
ACTIVE CREATOR
+
ACTIVE PRODUCTS
+
APPROVED PUBLIC PROFILE
```

---

# 239. Earning Creation Gate

```text id="crp145"
ELIGIBLE TRANSACTION
+
ACTIVE COMMERCIAL RULE
+
VALID ATTRIBUTION
```

---

# 240. Payout Gate

```text id="crp146"
VALIDATED EARNINGS
+
RETURN / FRAUD CONDITIONS CLEARED
+
PAYMENT DETAILS VERIFIED
+
APPROVED PAYOUT BATCH
```

---

# 241. Merch Project Gate

```text id="crp147"
QUALIFIED CREATOR / CLIENT
+
CLEAR COMMERCIAL MODEL
+
PRODUCT PLAN
+
OPERATING OWNER
```

---

# 242. Creator Platform Failure Modes

## Creator = Instagram Handle

Identity too weak.

## Artwork = File in Drive

No rights/status lineage.

## Product = Creator Product Database

Duplicates Commerce.

## Royalty = Spreadsheet Formula

Financial risk.

## Payout = Manual Guess

Trust failure.

## Sales = Earnings

Incorrect financial interpretation.

## Collaboration = DM Thread

No structured terms.

## Creator Portal Before Creator Volume

Premature complexity.

---

# 243. What Creator Platform Must Not Become

## Open Marketplace by Accident

Curation remains strategic.

## Creator Social Network

Not the initial job.

## Popularity Leaderboard

Follower count is not relationship quality.

## Separate Financial System

Finance remains canonical.

## AI Rights Judge

Legal/IP decisions need proper governance.

## Black-Box Earnings System

Creators need transparent calculation.

---

# 244. Creator Platform Success Definition

The platform succeeds when TeeStock can answer:

```text id="crp148"
WHO
is this creator?

WHAT PROGRAMS
are they part of?

WHAT AGREEMENTS
are active?

WHAT ARTWORK
have they submitted?

WHAT RIGHTS
does TeeStock have?

WHAT PRODUCTS
are linked to them?

WHAT COLLABS
are active?

WHAT SALES
are attributable?

WHAT EARNINGS
were created?

WHAT IS
pending, payable, and paid?

WHAT ACTION
does the creator need to take?

CAN CREATOR OPERATIONS
scale without spreadsheet chaos?
```

---

# 245. Canonical Creator Platform Summary

```text id="crp149"
CREATOR
defines relationship.

ENROLLMENT
defines participation.

AGREEMENT
defines commercial/legal terms.

ARTWORK
defines creative asset.

LICENSE
defines permitted use.

COLLABORATION
defines joint initiative.

PRODUCT
creates commerce.

ATTRIBUTION
connects transactions.

EARNING
creates financial entitlement.

PAYOUT
settles entitlement.

MGBOS
orchestrates workflow and exceptions.
```

---

# 246. Canonical Creator Platform Principles

```text id="crp150"
ONE CREATOR IDENTITY. MULTIPLE PARTICIPATION MODES.

CREATOR PLATFORM SHOULD NOT DUPLICATE COMMERCE.

ARTWORK IS NOT A PRODUCT.

OWNERSHIP IS NOT LICENSE.

RIGHTS BEFORE COMMERCIAL USE.

VERSION CREATIVE ASSETS.

COLLABORATIONS NEED STRUCTURED TERMS.

ATTRIBUTION BEFORE EARNINGS.

EARNINGS BEFORE PAYOUT.

SALES ARE NOT THE SAME AS CREATOR EARNINGS.

PRESERVE HISTORICAL COMMERCIAL RULES.

CREATOR TRANSPARENCY WITHOUT UNNECESSARY CUSTOMER DATA EXPOSURE.

BUILD SELF-SERVICE AFTER REPEATED MANUAL FRICTION.

AI MAY ACCELERATE COORDINATION. RIGHTS AND MONEY REMAIN GOVERNED.
```

---

# 247. Dependency

Dokumen berikut harus follow Creator Platform:

1. [[bisnis/teestock/10-product-tech/partner-platform|partner-platform.md]]
2. [[bisnis/teestock/10-product-tech/automation-architecture|automation-architecture.md]]
3. [[bisnis/teestock/11-data-mgbos/canonical-data-model|canonical-data-model.md]]
4. [[bisnis/teestock/11-data-mgbos/entity-hierarchy|entity-hierarchy.md]]
5. [[bisnis/teestock/11-data-mgbos/sku-and-id-convention|sku-and-id-convention.md]]
6. [[bisnis/teestock/11-data-mgbos/event-model|event-model.md]]
7. [[bisnis/teestock/11-data-mgbos/mgbos-integration|mgbos-integration.md]]
8. [[bisnis/teestock/11-data-mgbos/analytics-model|analytics-model.md]]
9. [[bisnis/teestock/12-legal-ip/design-licensing-policy|design-licensing-policy.md]]
10. [[bisnis/teestock/12-legal-ip/creator-agreement-framework|creator-agreement-framework.md]]
11. [[bisnis/teestock/13-metrics-experiments/kpi-framework|kpi-framework.md]]
12. [[bisnis/teestock/14-roadmap/capability-roadmap|capability-roadmap.md]]

TeeStock Creator Platform boleh berkembang dari structured internal creator management menjadi creator self-service, merchandise operating workspace, storefront network, analytics system, dan AI-assisted collaboration ecosystem, tetapi setiap layer baru hanya boleh dibangun setelah identity, rights, commercial terms, attribution, earnings, payout, dan product relationships menjadi reliable canonical truth.