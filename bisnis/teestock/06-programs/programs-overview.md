---
title: "TeeStock Programs Overview"
document_id: "TS-PRG-001"
version: "1.0"
status: "CANONICAL"
category: "programs"
business: "teestock"
last_updated: "2026-09-28"
depends_on:
  - "TS-FND-001"
  - "TS-FND-002"
  - "TS-STR-001"
  - "TS-STR-002"
  - "TS-STR-003"
  - "TS-STR-004"
  - "TS-BRD-001"
  - "TS-BRD-002"
  - "TS-COM-001"
  - "TS-SVC-001"
  - "TS-SVC-004"
  - "TS-ORG-001"
---

# TeeStock Programs Overview v1.0

> **Canonical TeeStock Participation & Distribution Program Architecture**  
> Dokumen ini mendefinisikan purpose, architecture, participant types, lifecycle, eligibility, incentives, attribution, economics, governance, automation, data model, dan boundaries untuk seluruh TeeStock Programs.

---

# 1. Purpose

TeeStock Programs menjawab:

> **Bagaimana pihak eksternal dapat berpartisipasi dalam pertumbuhan ecosystem TeeStock tanpa harus menjadi employee, customer biasa, atau business unit internal?**

Canonical principle:

> **Programs organize participation.**

---

# 2. Canonical Definition

> **TeeStock Programs adalah structured participation layer yang memungkinkan creators, resellers, operational partners, dan affiliates berkontribusi terhadap demand, distribution, capability, atau product creation TeeStock melalui rules, incentives, attribution, dan lifecycle yang terdefinisi.**

---

# 3. Programs Are Not Brands

Critical distinction:

```text
CREATOR PROGRAM
is not a consumer brand.

RESELLER PROGRAM
is not a sub-brand.

PARTNER PROGRAM
is not a service line.

AFFILIATE PROGRAM
is not a commerce line.
```

Programs adalah:

```text
OPERATING MECHANISMS
```

---

# 4. Programs Are Not Services

Canonical distinction:

```text
SERVICE
TeeStock does work for a customer.

PROGRAM
External participant works with TeeStock under defined participation rules.
```

Example:

```text
TEEStock MERCH
= service

CREATOR PROGRAM
= participation mechanism that can feed Merch
```

---

# 5. Programs Are Not Channels

A Program defines:

```text
WHO PARTICIPATES
+
HOW THEY PARTICIPATE
+
HOW VALUE IS ATTRIBUTED
```

A Channel defines:

```text
WHERE TRANSACTION / INTERACTION HAPPENS
```

---

# 6. Programs Are Not Organization Units

Programs can be managed by teams.

But they are not necessarily:

- departments,
- P&L business units,
- legal entities.

---

# 7. Canonical Architecture

```text
TEEStock PROGRAMS
│
├── CREATOR PROGRAM
├── RESELLER PROGRAM
├── PARTNER PROGRAM
└── AFFILIATE PROGRAM
```

---

# 8. Strategic Role

Programs have four primary ecosystem functions:

```text
CREATION
DISTRIBUTION
CAPABILITY
ACQUISITION
```

Mapped conceptually:

```text
CREATOR PROGRAM
→ creation + audience

RESELLER PROGRAM
→ distribution + sales

PARTNER PROGRAM
→ operational capability

AFFILIATE PROGRAM
→ acquisition + referral
```

---

# 9. Programs as Distribution Engine

Canonical:

```text
TEEStock DISTRIBUTION ENGINE
├── Owned Channels
├── Creator Program
├── Reseller Program
├── Affiliate Program
└── Partner Network
```

---

# 10. Why Programs Matter

Without Programs, growth depends disproportionately on:

```text
TEEStock TEAM
+
TEEStock OWNED AUDIENCE
+
TEEStock OWNED CAPACITY
```

Programs allow TeeStock to leverage external:

```text
AUDIENCE
SALES NETWORK
SKILLS
PRODUCTION
DISTRIBUTION
```

---

# 11. Program Philosophy

Canonical:

> **External participation should create leverage without sacrificing quality, economics, or control.**

---

# 12. Value Exchange

Every Program must define two sides.

```text
PARTICIPANT GIVES
↓
VALUE TO TEEStock

TEEStock GIVES
↓
VALUE TO PARTICIPANT
```

If either side is unclear, the Program is weak.

---

# 13. Creator Program

Participant contributes:

```text
ARTWORK
AUDIENCE
IDENTITY
CONTENT
CREATIVE REACH
```

TeeStock may provide:

```text
PRODUCT
PRODUCTION
COMMERCE
DISTRIBUTION
ROYALTY
MERCH INFRASTRUCTURE
```

---

# 14. Reseller Program

Participant contributes:

```text
SALES
LOCAL DISTRIBUTION
CUSTOMER ACCESS
```

TeeStock provides:

```text
PRODUCT
WHOLESALE PRICE
ORDER INFRASTRUCTURE
SUPPORT
```

---

# 15. Partner Program

Participant contributes:

```text
CAPABILITY
PRODUCTION
LOGISTICS
SUPPLY
SPECIALIZED SERVICE
```

TeeStock provides:

```text
ORDER FLOW
COMMERCIAL RELATIONSHIP
SYSTEM ACCESS
PARTNER ECONOMICS
```

---

# 16. Affiliate Program

Participant contributes:

```text
REFERRALS
TRAFFIC
CONTENT
DISTRIBUTION
```

TeeStock provides:

```text
ATTRIBUTION
COMMISSION
CREATIVE ASSETS
TRACKING
```

---

# 17. Program Boundary Principle

One person/company may participate in several Programs.

Example:

```text
Creator X
├── Creator Program
└── Affiliate Program
```

But each relationship must remain separately attributable.

---

# 18. Participant Entity

Future MGBOS should have canonical:

```text
PARTICIPANT
```

with roles such as:

```text
CREATOR
RESELLER
PARTNER
AFFILIATE
```

---

# 19. One Identity, Multiple Roles

Canonical:

```text
ONE ENTITY
→ MULTIPLE PROGRAM ENROLLMENTS
```

Avoid duplicate records when one partner has multiple roles.

---

# 20. Program Enrollment

Participation should be represented as:

```text
PROGRAM ENROLLMENT
```

not merely:

> “orang ini creator kita.”

---

# 21. Enrollment Record

Minimum:

```text
Participant
Program
Status
Tier if any
Start Date
Agreement
Commercial Terms
Attribution Method
Owner
```

---

# 22. Program Lifecycle

Canonical:

```text
DISCOVERED
↓
APPLIED / INVITED
↓
REVIEW
↓
APPROVED
↓
ONBOARDED
↓
ACTIVE
↓
REVIEW
↓
PAUSED / SUSPENDED / EXITED
```

---

# 23. Discovered

Potential participant identified.

No formal relationship yet.

---

# 24. Applied

Participant voluntarily applies.

---

# 25. Invited

TeeStock proactively invites participant.

---

# 26. Review

Evaluate:

```text
FIT
QUALITY
RISK
ECONOMICS
CAPABILITY
```

depending Program.

---

# 27. Approved

Participant passes eligibility.

Still may require onboarding before activation.

---

# 28. Onboarded

Required:

- agreement,
- identity,
- payment/payout details,
- operating instructions,

are sufficiently complete.

---

# 29. Active

Participant can generate eligible activity.

---

# 30. Paused

Temporarily inactive but relationship retained.

---

# 31. Suspended

Access/activity restricted due to:

- policy,
- quality,
- fraud,
- compliance,
- operational issue.

---

# 32. Exited

Participation formally ended.

Historical attribution remains preserved.

---

# 33. Eligibility

Every Program must define minimum eligibility.

But eligibility should match risk.

Avoid requiring corporate-level onboarding for a low-risk affiliate.

---

# 34. Eligibility Dimensions

Potential:

```text
IDENTITY
AUDIENCE
CAPABILITY
QUALITY
COMMERCIAL FIT
REPUTATION
LEGAL
PAYMENT / PAYOUT READINESS
```

---

# 35. Eligibility Is Program-Specific

Creator eligibility differs from Partner eligibility.

No universal score should determine everything.

---

# 36. Application vs Invitation

Programs may be:

```text
OPEN
APPLICATION-BASED
INVITE-ONLY
HYBRID
```

---

# 37. Early Recommendation

At early TeeStock stage:

```text
CREATOR
curated / invite-heavy

RESELLER
controlled application

PARTNER
invite / qualification

AFFILIATE
limited controlled launch
```

Avoid open marketplace-style scaling too early.

---

# 38. Program Tiers

Some Programs may later use:

```text
STANDARD
GROWTH
STRATEGIC
```

or other tiering.

Tiering must correspond to real differences.

---

# 39. No Vanity Tiering

Avoid:

```text
Silver
Gold
Diamond
```

unless benefits and requirements are truly distinct.

---

# 40. Program Incentive

Incentives may include:

```text
COMMISSION
ROYALTY
DISCOUNT
WHOLESALE MARGIN
LEAD ACCESS
ORDER FLOW
VISIBILITY
TOOLS
SUPPORT
```

---

# 41. Incentive Must Follow Behavior

Canonical:

> **Reward behavior that creates durable value.**

Do not incentivize metrics that can be gamed.

---

# 42. Incentive Alignment

Example:

Affiliate incentive should reward:

```text
VALID CONVERSION
```

not simply:

```text
CLICK VOLUME
```

---

# 43. Creator Incentive

May reward:

- licensed artwork,
- merch sales,
- collaboration revenue.

---

# 44. Reseller Incentive

Primarily:

```text
BUY PRICE
vs
SELL PRICE
```

or structured margin.

---

# 45. Partner Incentive

Can be:

```text
UNIT FEE
PROJECT FEE
SERVICE RATE
TRANSFER PRICE
```

---

# 46. Affiliate Incentive

Typically:

```text
COMMISSION ON ELIGIBLE ATTRIBUTED SALE
```

---

# 47. Economics Before Scale

Every Program must answer:

```text
What does TeeStock earn?

What does participant earn?

Who bears cost?

Who bears risk?
```

---

# 48. Program Economics

Canonical view:

```text
INCREMENTAL VALUE
-
PARTICIPANT INCENTIVE
-
PROGRAM COST
-
SUPPORT COST
-
RISK / ADJUSTMENTS
=
TEEStock CONTRIBUTION
```

---

# 49. Program Revenue Attribution

Do not confuse:

```text
TRANSACTION REVENUE
```

with:

```text
PROGRAM ATTRIBUTION
```

Programs may influence a sale without owning transaction accounting.

---

# 50. Example

A Creator Program participant drives a Merch sale.

Canonical:

```text
ORDER
→ Commerce transaction

ORDER ITEM
→ Merch Account

ATTRIBUTION
→ Creator relationship

PAYOUT
→ Creator economic rule
```

---

# 51. Attribution

Programs must define:

> **What activity belongs to whom?**

Without attribution:

- incentives fail,
- payouts fail,
- analytics fail.

---

# 52. Attribution Types

Potential:

```text
REFERRAL LINK
REFERRAL CODE
ACCOUNT ASSIGNMENT
CREATOR PRODUCT
RESELLER ORDER
PARTNER WORK ORDER
```

---

# 53. Attribution Must Be Deterministic Where Possible

Prefer:

```text
SYSTEM RULE
```

over:

```text
"Kayaknya order ini dari dia."
```

---

# 54. Attribution Window

Affiliate/creator referral systems may need defined attribution window.

Exact rules belong in detailed Program docs.

---

# 55. Multi-Touch Attribution

Future marketing may involve multiple touchpoints.

Program payout logic should remain simpler than marketing analytics unless strong reason exists.

---

# 56. Payout

Programs with monetary compensation require:

```text
PAYOUT LEDGER
```

---

# 57. Payout Lifecycle

Canonical:

```text
ACTIVITY
↓
ELIGIBLE EARNING
↓
PENDING
↓
VALIDATED
↓
PAYABLE
↓
PAID
```

---

# 58. Pending

Needed for:

- refund windows,
- order verification,
- fraud checks.

---

# 59. Adjustment

Payout ledger must support:

```text
EARNING
REVERSAL
ADJUSTMENT
PAYOUT
```

---

# 60. Payout Transparency

Participant should understand:

```text
WHAT GENERATED EARNING
HOW MUCH
WHY ADJUSTED
WHEN PAID
```

---

# 61. Payout Frequency

May vary by Program:

```text
PER PROJECT
PER DROP
MONTHLY
OTHER AGREED CYCLE
```

---

# 62. No Manual Guessing

Mature system should be able to reconstruct payout from underlying transactions/work records.

---

# 63. Program Agreements

Each Program requires appropriate agreement/policy.

Potential:

```text
Creator Agreement
Reseller Terms
Partner Agreement
Affiliate Terms
```

---

# 64. Agreement Scope

Should address relevant:

```text
ROLE
RIGHTS
PAYMENT
IP
QUALITY
DATA
TERMINATION
LIABILITY
```

---

# 65. Agreement Versioning

Enrollment should know which Program Terms version was accepted.

---

# 66. IP Governance

Especially important for:

```text
CREATOR PROGRAM
```

Must know:

- ownership,
- license,
- duration,
- permitted usage.

---

# 67. Partner Confidentiality

Partner Program may expose:

- product specs,
- customer information,
- pricing,
- production plans.

Access should be controlled.

---

# 68. Reseller Brand Representation

Resellers should not misrepresent:

- being TeeStock employee,
- owning TeeStock brand,
- fake official status.

Usage rules should be documented.

---

# 69. Affiliate Claims

Affiliate content must not make unsupported product claims.

---

# 70. Program Brand Architecture

Programs generally use:

```text
TEEStock + PROGRAM NAME
```

Example:

```text
TeeStock Creator Program
TeeStock Partner Program
```

not independent brands.

---

# 71. Program Visual Identity

Use TeeStock master identity.

Avoid separate full brand systems per Program.

---

# 72. Program Communication

Tone may differ by audience.

But Programs remain clearly TeeStock.

---

# 73. Creator Program Tone

More:

```text
CREATIVE
COLLABORATIVE
```

---

# 74. Reseller Program Tone

More:

```text
COMMERCIAL
CLEAR
PRACTICAL
```

---

# 75. Partner Program Tone

More:

```text
OPERATIONAL
TECHNICAL
RELIABILITY-FOCUSED
```

---

# 76. Affiliate Program Tone

More:

```text
SIMPLE
PERFORMANCE-ORIENTED
TRANSPARENT
```

---

# 77. Program Onboarding

Canonical onboarding:

```text
APPROVAL
↓
AGREEMENT
↓
PROFILE
↓
COMMERCIAL SETUP
↓
TOOLS / MATERIAL
↓
TEST
↓
ACTIVE
```

---

# 78. Onboarding Must Be Proportional

Low-risk participant should not require excessive bureaucracy.

High-risk operational Partner requires deeper due diligence.

---

# 79. Participant Profile

Store:

```text
Identity
Contact
Program Roles
Channels
Capabilities
Commercial Terms
Status
Performance
```

---

# 80. Tools & Resources

Programs may provide:

```text
PORTAL
LINKS
CATALOG
PRODUCT DATA
CREATIVE ASSETS
GUIDELINES
ORDER ACCESS
REPORTS
```

depending Program.

---

# 81. Portal Strategy

Do not build separate portal immediately.

Canonical progression:

```text
MANUAL
↓
STRUCTURED FORMS
↓
SHARED DASHBOARD
↓
PROGRAM PORTAL
```

---

# 82. Program Portal

Future can expose role-based functions.

Example:

```text
Creator
→ artworks / earnings

Reseller
→ pricing / orders

Partner
→ work orders / SLA

Affiliate
→ links / commissions
```

---

# 83. Shared Identity Layer

One participant login may later access multiple Program roles.

---

# 84. Access Control

Program role determines:

```text
WHAT DATA
WHAT ACTIONS
WHAT TOOLS
```

participant can access.

---

# 85. Least Privilege

External participant should not see more ecosystem data than needed.

---

# 86. Program Performance

Each Program requires its own metrics.

But ecosystem-level metrics can include:

```text
ACTIVE PARTICIPANTS
PROGRAM-ATTRIBUTED GMV
CONTRIBUTION
RETENTION
PAYOUT
```

---

# 87. Active Participant

Define meaningful activity.

Do not count every approved account forever.

---

# 88. Activation Rate

Example:

```text
APPROVED
→
FIRST VALID ACTIVITY
```

Useful Program metric.

---

# 89. Participant Retention

Track whether participants continue creating value.

---

# 90. Program Quality

Growth in participant count can be harmful if:

- fraud rises,
- quality drops,
- support explodes.

---

# 91. Creator Program Metrics

Potential:

```text
Active Creators
Artwork Acceptance
Creator Sales
Creator Payout
Repeat Drops
```

---

# 92. Reseller Program Metrics

Potential:

```text
Active Resellers
Order Frequency
Revenue
Contribution
Repeat Rate
```

---

# 93. Partner Program Metrics

Potential:

```text
Active Partners
Jobs
On-Time Rate
Defect Rate
Spend
Capacity
```

---

# 94. Affiliate Program Metrics

Potential:

```text
Active Affiliates
Traffic
Conversions
Attributed Sales
Commission
Incremental Contribution
```

---

# 95. Program Fraud

Programs can create abuse.

Potential:

```text
SELF-REFERRAL
FAKE ORDERS
COUPON ABUSE
PAYOUT MANIPULATION
COUNTERFEIT RESELLING
```

---

# 96. Fraud Prevention

Use proportional safeguards:

```text
VALIDATION
HOLD PERIOD
RULES
ANOMALY DETECTION
MANUAL REVIEW
```

---

# 97. Self-Referral

Affiliate Program should explicitly define self-purchase/referral policy.

---

# 98. Duplicate Attribution

One transaction should not accidentally pay multiple participants unless intentionally designed.

---

# 99. Commission Stacking

If:

```text
Creator Royalty
+
Affiliate Commission
+
Promotion
```

all apply to one sale,

economics must remain intentional.

---

# 100. Margin Guardrail

Program incentives cannot bypass contribution rules.

Future MGBOS should evaluate:

```text
SELLING PRICE
-
DISCOUNT
-
ROYALTY
-
COMMISSION
-
VARIABLE COST
```

before approving structures.

---

# 101. Program Review

Programs themselves should be periodically reviewed.

Question:

```text
Does this Program still create leverage?
```

---

# 102. Program Lifecycle

A Program can be:

```text
CONCEPT
PILOT
ACTIVE
SCALED
PAUSED
SUNSET
```

---

# 103. Pilot

Run with controlled participants.

Measure:

- demand,
- behavior,
- economics,
- operational load.

---

# 104. Active

Program proven enough for ongoing operation.

---

# 105. Scaled

Processes, automation, economics sufficiently mature to expand participation.

---

# 106. Paused

New enrollments/activity restricted temporarily.

---

# 107. Sunset

Program intentionally discontinued.

Existing obligations resolved.

---

# 108. No Permanent Program Assumption

A Program is an operating mechanism.

It can be changed or sunset when no longer useful.

---

# 109. Program Launch Gate

Before launch:

```text
VALUE EXCHANGE CLEAR
+
ELIGIBILITY CLEAR
+
ECONOMICS CLEAR
+
ATTRIBUTION READY
+
TERMS READY
+
OPERATING OWNER READY
```

---

# 110. Program Scale Gate

Scale only if:

```text
QUALITY STABLE
+
ECONOMICS HEALTHY
+
SUPPORT MANAGEABLE
+
ATTRIBUTION RELIABLE
+
PAYOUT ACCURATE
```

---

# 111. Program Sunset Gate

Sunset when:

```text
LOW STRATEGIC VALUE
+
POOR ECONOMICS
+
HIGH COMPLEXITY
```

and no credible correction exists.

---

# 112. Program Owner

Every active Program requires:

```text
PROGRAM OWNER
```

even if same person owns several early.

---

# 113. Program Owner Responsibilities

Owns:

```text
Strategy
Eligibility
Operations
Participant Experience
Economics
Metrics
Policy
```

---

# 114. Program Operations

Can be supported by:

- customer ops,
- finance,
- legal,
- marketing,
- production,

depending Program.

---

# 115. Participant Support

Program participants are not ordinary end customers.

Support may require:

```text
PROGRAM-SPECIFIC QUEUE
```

eventually.

---

# 116. SLA

Some Programs need participant SLA.

Examples:

```text
Creator artwork review
Partner work-order response
Reseller order processing
Affiliate payout
```

Only publish verified commitments.

---

# 117. Program Experience

Good participant experience means:

```text
CLEAR RULES
CLEAR EARNINGS
CLEAR STATUS
CLEAR NEXT ACTION
```

---

# 118. Program Data Model

Core future entities:

```text
PARTICIPANT
PROGRAM
PROGRAM ENROLLMENT
PROGRAM TIER
AGREEMENT
ATTRIBUTION
EARNING
PAYOUT
ACTIVITY
PROGRAM METRIC
```

---

# 119. Participant

Represents person or organization participating.

---

# 120. Program

Defines canonical participation mechanism.

---

# 121. Enrollment

Represents relationship between Participant and Program.

---

# 122. Program Tier

Optional classification inside Program.

---

# 123. Activity

Represents value-creating behavior.

Examples:

```text
Artwork Submitted
Referral Generated
Order Placed
Production Job Completed
```

---

# 124. Attribution

Links eligible outcome to participant activity.

---

# 125. Earning

Records participant economic entitlement.

---

# 126. Payout

Records actual settlement.

---

# 127. MGBOS Role

MGBOS should eventually answer:

```text
Who participates in which Programs?

What status are they in?

What value did they create?

What do we owe them?

What are they allowed to access?

Which participants need review?
```

---

# 128. Program Dashboard

Potential:

```text
Applications
Approvals
Active Participants
Program Activity
Attributed Revenue
Payouts
Exceptions
Quality Alerts
```

---

# 129. Automation Maturity

Canonical:

```text
STAGE 0
Manual relationship

STAGE 1
Structured enrollment

STAGE 2
Automated tracking

STAGE 3
Automated attribution / payout

STAGE 4
Self-service participant portal

STAGE 5
Exception-based program operations
```

---

# 130. AI Role

AI can assist:

```text
Application Summary
Participant Classification
Risk Flags
Performance Summary
Support Drafting
Program Analysis
```

---

# 131. AI Eligibility Boundary

AI may recommend:

> “This participant appears to meet standard criteria.”

But high-risk Partner/Creator decisions may still require human approval.

---

# 132. AI Payout Boundary

Payouts must come from deterministic rules.

AI does not invent commissions.

---

# 133. AI Fraud Assistance

AI can flag anomalies.

It should not automatically accuse or permanently suspend participants without appropriate review.

---

# 134. Program Cross-Relationships

Canonical examples:

```text
CREATOR PROGRAM
→ Selects
→ Merch
→ Collaboration
```

```text
RESELLER PROGRAM
→ Commerce
→ Supply
```

```text
PARTNER PROGRAM
→ Production
→ Supply
→ Fulfillment
```

```text
AFFILIATE PROGRAM
→ Commerce
→ Originals
→ selected Services
```

---

# 135. Creator Program → Selects

Creator artwork may enter Selects under appropriate agreement.

---

# 136. Creator Program → Merch

Promising creator may become Merch account.

---

# 137. Creator Program → Collaboration

A creator may participate in TeeStock/Originals collaboration.

---

# 138. Reseller Program → Supply

Supply can provide reseller pricing/products.

Program manages participation rules.

---

# 139. Partner Program → Production

Approved Partner may receive Work Orders.

---

# 140. Partner Program → Fulfillment

Some operational Partners may provide:

- warehousing,
- shipping,
- specialized capability.

---

# 141. Affiliate Program → Commerce

Eligible Commerce sales can generate commission.

---

# 142. Affiliate Program → Services

Certain Services might later support referral rewards.

Only when lead attribution and economics are clear.

---

# 143. Programs and Originals

Programs can help distribute Originals.

But participants do not gain ownership of Originals IP by default.

---

# 144. Programs and Commerce

Programs can affect how demand reaches Commerce.

Commerce remains transaction engine.

---

# 145. Programs and Services

Programs can source:

- customers,
- creators,
- suppliers,
- operators.

Services remain customer-facing capability.

---

# 146. Programs and Brand

Programs should strengthen TeeStock brand.

Not create ungoverned external representation.

---

# 147. Program Participant Conduct

Relevant Programs should define acceptable conduct regarding:

- brand usage,
- customer treatment,
- fraud,
- confidentiality,
- legal compliance.

---

# 148. Program Suspension

Possible reasons:

```text
FRAUD
QUALITY FAILURE
POLICY BREACH
NON-PAYMENT
IP ISSUE
REPUTATIONAL RISK
```

dependent on Program.

---

# 149. Suspension Is Not Termination

Suspension allows investigation/correction.

Termination closes relationship.

---

# 150. Termination Process

Must handle:

```text
OPEN ORDERS
OPEN EARNINGS
PAYOUT
IP
INVENTORY
SYSTEM ACCESS
```

before closure.

---

# 151. Historical Attribution

Termination should not erase historical transaction records.

---

# 152. Creator Exit

May require:

- product unpublishing,
- remaining inventory handling,
- final royalty.

---

# 153. Reseller Exit

May require:

- price access removal,
- branding material removal.

---

# 154. Partner Exit

May require:

- open Work Orders,
- inventory/material return,
- access revocation.

---

# 155. Affiliate Exit

May require:

- links/codes disabled,
- final validated commission payout.

---

# 156. Program Documentation

Each Program detailed doc should define:

```text
PURPOSE
TARGET PARTICIPANT
VALUE EXCHANGE
ELIGIBILITY
APPLICATION
ONBOARDING
ACTIVITY
ECONOMICS
ATTRIBUTION
PAYOUT
QUALITY
POLICY
METRICS
AUTOMATION
EXIT
```

---

# 157. Program Portfolio

TeeStock should avoid launching many participation programs simultaneously.

Each adds:

- support,
- policies,
- finance,
- systems,
- fraud surface.

---

# 158. Recommended Activation Sequence

Canonical early sequence:

```text
1. Creator Program
2. Partner Program
3. Reseller Program
4. Affiliate Program
```

But actual timing follows business demand.

---

# 159. Why Creator Early

Creator Program supports:

```text
SELECTS
MERCH
AUDIENCE
CONTENT
```

with relatively asset-light leverage.

---

# 160. Why Partner Early

Partner Program is important for asset-light TeeStock operations.

It expands capability without immediate capital expenditure.

---

# 161. Why Reseller Later

Reseller Program becomes more useful when:

```text
PRODUCT
PRICING
INVENTORY
SUPPLY
```

are stable.

---

# 162. Why Affiliate Later

Affiliate Program needs:

```text
RELIABLE TRACKING
CONVERSION
UNIT ECONOMICS
PAYOUT
```

to avoid creating low-quality growth.

---

# 163. Current Recommended Scope

Initial:

```text
CREATOR
small curated pilot

PARTNER
approved operational network

RESELLER
manual / limited

AFFILIATE
not broad/open yet
```

---

# 164. Current Anti-Goal

Do not launch:

```text
open creator marketplace
thousands of affiliates
large reseller network
uncontrolled vendor marketplace
```

before systems exist.

---

# 165. Program Flywheel

```text
MORE QUALITY PARTICIPANTS
↓
MORE CREATION / DISTRIBUTION / CAPABILITY
↓
MORE DEMAND / BETTER OPERATIONS
↓
BETTER TEEStock ECONOMICS
↓
BETTER PARTICIPANT OPPORTUNITY
↓
MORE QUALITY PARTICIPANTS
```

---

# 166. Network Effect Potential

Programs can create network effects only if more participants improve value for the ecosystem.

Participant count alone is not network effect.

---

# 167. Quality > Quantity

Canonical:

```text
100 HIGH-QUALITY PARTICIPANTS
>
10,000 INACTIVE / LOW-QUALITY ACCOUNTS
```

---

# 168. Program Failure Modes

## Program as Brand

Creates architecture confusion.

## Participants Without Attribution

Payout disputes.

## Open Enrollment Too Early

Quality drops.

## Incentive Without Economics

Margin erosion.

## Spreadsheet Payout Forever

Trust and scale problems.

## Too Many Tiers

Unnecessary complexity.

## No Exit Policy

Zombie participants.

## No Program Owner

Operational drift.

---

# 169. What Programs Must Not Become

## Uncontrolled Marketplace

Curation and qualification matter.

## Discount Machine

Programs create leverage, not permanent margin leakage.

## Vanity Membership Club

Participation must create measurable value.

## Separate Data Silos

Use shared participant/entity model.

## Human-Memory Relationship Network

Relationships belong in MGBOS.

---

# 170. Program Success Definition

A Program succeeds when:

```text
PARTICIPANT CREATES VALUE
↓
VALUE IS ATTRIBUTED
↓
PARTICIPANT IS REWARDED FAIRLY
↓
TEEStock RETAINS HEALTHY ECONOMICS
↓
RELATIONSHIP REPEATS
```

---

# 171. Canonical Programs Summary

```text
CREATOR PROGRAM
expands creation and audience participation.

RESELLER PROGRAM
expands product distribution.

PARTNER PROGRAM
expands operational capability.

AFFILIATE PROGRAM
expands performance-based acquisition.
```

---

# 172. Canonical Relationship Summary

```text
COMMERCE
sells.

SERVICES
does work.

ORIGINALS
creates owned IP.

PROGRAMS
organize external participation.

MGBOS
tracks the relationships, activity, and economics.
```

---

# 173. Canonical Program Principles

```text
PROGRAMS ARE MECHANISMS, NOT BRANDS.

VALUE EXCHANGE BEFORE ENROLLMENT.

QUALITY BEFORE PARTICIPANT COUNT.

ELIGIBILITY BEFORE ACCESS.

ATTRIBUTION BEFORE INCENTIVE.

ECONOMICS BEFORE SCALE.

VALIDATED ACTIVITY BEFORE PAYOUT.

ONE PARTICIPANT IDENTITY, MANY ROLES.

STRUCTURED RELATIONSHIP BEFORE PORTAL.

PILOT BEFORE OPEN ENROLLMENT.

AUTOMATE RULES, ESCALATE EXCEPTIONS.
```

---

# 174. Dependency

Dokumen berikut harus follow Programs Overview:

1. `06-programs/creator-program.md`
2. `06-programs/reseller-program.md`
3. `06-programs/partner-program.md`
4. `06-programs/affiliate-program.md`
5. `08-finance/pricing-framework.md`
6. `08-finance/treasury-policy.md`
7. `10-product-tech/creator-platform.md`
8. `10-product-tech/partner-platform.md`
9. `10-product-tech/automation-architecture.md`
10. `11-data-mgbos/canonical-data-model.md`
11. `11-data-mgbos/entity-hierarchy.md`
12. `11-data-mgbos/event-model.md`
13. `12-legal-ip/design-licensing-policy.md`
14. `12-legal-ip/creator-agreement-framework.md`
15. `13-metrics-experiments/kpi-framework.md`

TeeStock Programs boleh berkembang menjadi participant network dan platform yang lebih besar, tetapi setiap Program harus tetap memiliki explicit value exchange, controlled eligibility, traceable attribution, healthy economics, reliable payout, dan clear lifecycle governance.