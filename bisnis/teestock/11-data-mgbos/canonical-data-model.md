---
title: "TeeStock Canonical Data Model"
document_id: "TS-DAT-001"
version: "1.0"
status: "CANONICAL"
category: "data-mgbos"
business: "teestock"
last_updated: "2026-09-28"
depends_on:
  - "TS-FND-001"
  - "TS-STR-003"
  - "TS-COM-005"
  - "TS-OPS-001"
  - "TS-FIN-001"
  - "TS-TEC-001"
  - "TS-TEC-003"
  - "TS-TEC-004"
  - "TS-TEC-005"
  - "TS-TEC-006"
---

# TeeStock Canonical Data Model v1.0

> **Canonical TeeStock Business Entity, Relationship & Data-Truth Framework**  
> Dokumen ini mendefinisikan canonical business entities, identifiers, relationships, ownership, lifecycle, source-of-truth boundaries, historical integrity, cross-domain references, data lineage, and shared semantics yang menjadi fondasi MGBOS, TeeStock applications, integrations, analytics, automation, dan AI.

---

# 1. Purpose

Canonical Data Model menjawab:

> **Apa saja objek bisnis nyata yang TeeStock kelola, bagaimana objek tersebut saling berhubungan, siapa yang memiliki kebenaran datanya, dan bagaimana seluruh sistem berbicara menggunakan definisi yang sama?**

Canonical principle:

> **One business fact should have one canonical meaning.**

---

# 2. Canonical Definition

> **TeeStock Canonical Data Model adalah shared semantic and structural model yang mendefinisikan core business entities, relationships, identifiers, states, ownership boundaries, and historical rules sehingga seluruh application, workflow, analytics, integration, dan AI agent bekerja di atas bahasa data yang konsisten.**

---

# 3. Canonical Does Not Mean One Database

Critical:

```text
CANONICAL MODEL
=
one meaning.

NOT NECESSARILY
=
one physical database.
```

---

# 4. Canonical Meaning

Example:

```text
ORDER
```

must mean the same commercial object whether viewed from:

```text
WEBSITE
MGBOS
FINANCE
FULFILLMENT
ANALYTICS
AI
```

---

# 5. Anti-Pattern

Avoid:

```text
WebsiteOrder
MarketplaceOrder
AdminOrder
FinanceOrder
```

as unrelated concepts.

Instead:

```text
ORDER
+
SOURCE / CHANNEL
```

---

# 6. Core Data Principles

Canonical:

```text
ONE ENTITY
ONE STABLE IDENTITY

MULTIPLE VIEWS
ONE BUSINESS MEANING

HISTORICAL FACTS
MUST REMAIN TRACEABLE

STATE
MUST BE EXPLICIT

RELATIONSHIPS
MUST BE MODELED

DERIVED DATA
MUST NOT REPLACE SOURCE DATA
```

---

# 7. Data Architecture Layers

Canonical:

```text
IDENTITY DATA
↓
MASTER DATA
↓
TRANSACTION DATA
↓
OPERATIONAL DATA
↓
EVENT DATA
↓
ANALYTICAL DATA
↓
KNOWLEDGE
```

---

# 8. Identity Data

Represents:

```text
PERSON
ORGANIZATION
ROLE
ACCOUNT
```

---

# 9. Master Data

Represents relatively stable business definitions:

```text
PRODUCT
SKU
MATERIAL
PARTNER
CREATOR
PRICE BOOK
CAPABILITY
```

---

# 10. Transaction Data

Represents business commitments/movements:

```text
ORDER
PAYMENT
PURCHASE ORDER
INVOICE
RETURN
PAYOUT
```

---

# 11. Operational Data

Represents work:

```text
PROJECT
PRODUCTION JOB
WORK ORDER
TASK
SHIPMENT
QC
CASE
```

---

# 12. Event Data

Represents facts that occurred.

---

# 13. Analytical Data

Derived:

```text
CONTRIBUTION
CAC
RETENTION
FORECAST
PERFORMANCE
```

---

# 14. Knowledge

Policies, SOPs, documentation, instructions, and contextual reference.

---

# 15. Canonical Domain Map

```text
ORGANIZATION
IDENTITY
CUSTOMER
PRODUCT
COMMERCE
SERVICES
CREATOR
PARTNER
PROCUREMENT
PRODUCTION
QUALITY
INVENTORY
FULFILLMENT
FINANCE
MARKETING
AUTOMATION
ANALYTICS
```

---

# 16. Enterprise Hierarchy

Canonical conceptual hierarchy:

```text
ORGANIZATION
MultiGraph Group
│
└── BUSINESS UNIT
    TeeStock
    │
    ├── BUSINESS DOMAIN / LINE
    ├── BRAND / LABEL
    ├── PROGRAM
    ├── COLLECTION
    ├── PRODUCT
    ├── VARIANT
    └── SKU
```

---

# 17. Organization Entity

Represents legal or umbrella business entity.

Example:

```text
MULTIGRAPH GROUP
```

---

# 18. Business Unit Entity

Represents operating business within Organization.

Example:

```text
TEEStock
MULTIGRAPH
```

---

# 19. Business Line Entity

Represents major economic/operating line.

Potential TeeStock values:

```text
COMMERCE
SERVICES
ORIGINALS
PROGRAMS
```

---

# 20. Business Domain vs Business Line

Domain organizes systems.

Business Line organizes economic/business activity.

They may overlap but are not identical.

---

# 21. Brand Entity

Represents commercial brand identity.

Potential:

```text
TEEStock
future independent label
```

---

# 22. Label Entity

Represents independent brand incubated under Originals.

---

# 23. Collection Entity

Represents thematic/product grouping with commercial/creative meaning.

---

# 24. Program Entity

Represents structured participation mechanism.

Examples:

```text
CREATOR PROGRAM
RESELLER PROGRAM
AFFILIATE PROGRAM
PARTNER PROGRAM
```

---

# 25. Person Entity

Canonical human identity.

Potential fields:

```text
Person ID
Name
Contact Methods
Status
```

---

# 26. Person Is Not Customer

Canonical:

```text
PERSON
can have
MULTIPLE BUSINESS ROLES.
```

---

# 27. Organization Account Entity

Represents external company/institution/community/business counterpart.

Examples:

```text
CUSTOMER COMPANY
CREATOR COMPANY
PARTNER COMPANY
RESELLER BUSINESS
```

---

# 28. Contact Entity

Links Person to Organization.

---

# 29. Contact Role

Potential:

```text
OWNER
BUYER
PROCUREMENT
FINANCE
CREATIVE
OPERATIONS
```

---

# 30. Identity Principle

Canonical:

```text
PERSON
+
ORGANIZATION
+
ROLE
=
CONTEXTUAL RELATIONSHIP
```

---

# 31. User Account

Represents authentication identity.

---

# 32. User Account ≠ Person

One Person usually maps to one User Account, but conceptual separation matters.

---

# 33. Role

Represents application/business permissions or relationship roles.

---

# 34. Permission

Defines allowed action.

---

# 35. Membership

Links identity to:

```text
ORGANIZATION
PROGRAM
COMMUNITY
WORKSPACE
```

---

# 36. Customer Entity

Canonical:

> **Customer represents a commercial relationship capable of purchasing TeeStock products or services.**

---

# 37. Customer Types

Potential:

```text
CONSUMER
BUSINESS
CREATOR CLIENT
RESELLER
```

---

# 38. Customer Is Relationship, Not Identity

A Person or Organization can become Customer.

---

# 39. Customer Profile

May contain:

```text
Lifecycle
Preferences
Commercial Flags
Customer Since
```

---

# 40. Customer Lifecycle State

Potential:

```text
PROSPECT
NEW
ACTIVE
REPEAT
HIGH_VALUE
AT_RISK
LAPSED
```

---

# 41. Customer Address

Separate reusable entity.

Types:

```text
SHIPPING
BILLING
BUSINESS
```

---

# 42. Contact Method

Potential:

```text
EMAIL
PHONE
WHATSAPP
```

---

# 43. Lead Entity

Canonical:

> **Lead is an identified potential commercial opportunity not yet fully qualified.**

---

# 44. Lead Sources

Potential:

```text
FORM
WHATSAPP
SOCIAL
REFERRAL
OUTBOUND
MARKETPLACE
```

---

# 45. Lead vs Customer

Lead may exist before customer relationship.

---

# 46. Opportunity Entity

Represents qualified commercial pursuit.

Especially relevant for:

```text
BUSINESS
CUSTOM
MERCH
```

---

# 47. Opportunity Lifecycle

Potential:

```text
QUALIFIED
DISCOVERY
PROPOSAL
NEGOTIATION
WON
LOST
```

---

# 48. Quote Entity

Canonical commercial proposal.

---

# 49. Quote Structure

Potential:

```text
QUOTE
├── CUSTOMER
├── LINES
├── PRICING
├── TERMS
├── VALIDITY
└── VERSION
```

---

# 50. Quote Versioning

Material commercial changes create version.

---

# 51. Quote Line

Represents individual priced deliverable/product/service.

---

# 52. Project Entity

Canonical:

> **Project represents coordinated service/commercial work requiring multiple activities beyond simple commerce fulfillment.**

---

# 53. Projects Commonly Used For

```text
CUSTOM
BUSINESS
MERCH
STUDIO
```

---

# 54. Project Lifecycle

Potential:

```text
DRAFT
ACTIVE
ON_HOLD
COMPLETED
CANCELLED
```

---

# 55. Product Entity

Canonical:

> **Product is the commercial concept TeeStock offers or manages.**

---

# 56. Product Is Not SKU

Critical:

```text
PRODUCT
commercial concept.

VARIANT
standard product choice.

SKU
stock-tracked standardized unit.
```

---

# 57. Product Types

Potential:

```text
PHYSICAL
SERVICE
BUNDLE
HYBRID
```

---

# 58. Product Commercial Ownership

Potential:

```text
SELECTS
ESSENTIALS
ORIGINALS
CREATOR_MERCH
COLLABORATION
```

---

# 59. Product Family

Groups related products/platforms.

---

# 60. Product Category

Describes what product is.

Examples:

```text
T_SHIRT
HOODIE
TOTE_BAG
```

---

# 61. Product Variant

Standard repeatable variation.

Potential attributes:

```text
SIZE
COLOR
FIT
```

---

# 62. SKU Entity

Represents standardized sellable/inventory unit.

---

# 63. SKU Properties

Potential:

```text
SKU ID
Product
Variant
Inventory Unit
Status
```

---

# 64. Sellable Configuration

Canonical for non-SKU custom options.

---

# 65. Configuration Examples

```text
CUSTOM ARTWORK
PRINT POSITION
PERSONALIZATION
CUSTOM SIZE MIX
```

---

# 66. Design Entity

Represents creative design concept/artwork association.

---

# 67. Artwork Entity

Represents actual versioned creative file/IP record.

---

# 68. Artwork Version

Separate version object.

---

# 69. Artwork ≠ Design

Design may be creative concept.

Artwork is specific asset/file representation.

---

# 70. Garment Platform

Represents standardized blank/base garment configuration.

Potential:

```text
BODY
FABRIC
FIT
CONSTRUCTION
```

---

# 71. Material Entity

Canonical raw/input material.

---

# 72. Material Types

Potential:

```text
GARMENT
FABRIC
INK
THREAD
PACKAGING
ACCESSORY
```

---

# 73. BOM

Bill of Materials.

Canonical:

```text
OUTPUT PRODUCT
↓
MATERIAL / COMPONENT REQUIREMENTS
```

---

# 74. BOM Version

Required when material composition changes.

---

# 75. Production Recipe

Defines processes required to create output.

---

# 76. Recipe vs BOM

Critical:

```text
BOM
what is consumed.

RECIPE
what work is performed.
```

---

# 77. Process Entity

Canonical operation type.

Examples:

```text
SCREEN_PRINT
DTF
EMBROIDERY
PACKING
```

---

# 78. Product Status

Potential:

```text
DRAFT
DEVELOPMENT
APPROVED
ACTIVE
PAUSED
ARCHIVED
```

---

# 79. Catalog Entity

Commercial context in which products are sellable.

---

# 80. Catalog Entry

Links:

```text
CATALOG
+
PRODUCT
+
CHANNEL
+
COMMERCIAL STATUS
```

---

# 81. Channel Entity

Represents acquisition/sales/distribution channel.

Examples:

```text
WEBSITE
MARKETPLACE
DIRECT
CREATOR_STORE
```

---

# 82. Channel Account

Specific account/store/profile.

---

# 83. Channel Listing

Maps canonical Product/SKU to external listing.

---

# 84. Price Book

Canonical pricing context.

---

# 85. Price Entity

Links:

```text
PRICE BOOK
PRODUCT / SKU
AMOUNT
CURRENCY
EFFECTIVE PERIOD
```

---

# 86. Price Rule

Deterministic pricing condition.

---

# 87. Promotion Entity

Structured promotional program.

---

# 88. Discount Rule

Defines conditions/benefit.

---

# 89. Order Entity

Canonical:

> **Order represents a commercial commitment for one or more goods/services under accepted commercial terms.**

---

# 90. Order Structure

```text
ORDER
├── CUSTOMER
├── SOURCE
├── CHANNEL
├── ORDER ITEMS
├── PRICE SNAPSHOT
├── PAYMENT
└── FULFILLMENT
```

---

# 91. Order Item

Canonical economic/transactional line.

---

# 92. Order Item Links

Potential:

```text
PRODUCT
VARIANT
SKU
CONFIGURATION
QTY
PRICE
ATTRIBUTION
```

---

# 93. Order Source vs Channel

Critical:

```text
SOURCE
how order entered system.

CHANNEL
commercial channel where sale happened.
```

---

# 94. Cart Entity

Temporary purchase intent.

---

# 95. Checkout Session

Temporary validated purchase-flow state.

---

# 96. Reservation Entity

Reserves inventory/capacity.

---

# 97. Reservation Types

Potential:

```text
INVENTORY
CAPACITY
MATERIAL
```

future.

---

# 98. Payment Entity

Represents collection or payment attempt associated with commercial obligation.

---

# 99. Payment Intent

Expected collection.

---

# 100. Payment Attempt

One attempt through payment provider.

---

# 101. Settlement

Actual provider/channel settlement event.

---

# 102. Refund Entity

Financial reversal/payment back to customer.

---

# 103. Refund ≠ Return

Canonical.

---

# 104. Invoice Entity

Represents formal receivable document.

---

# 105. Receivable

Money owed to TeeStock.

---

# 106. Payable

Money TeeStock owes another party.

---

# 107. Customer Deposit

Cash received before full obligation fulfillment.

---

# 108. Treasury Account

Represents cash-holding account/provider balance.

---

# 109. Cash Transaction

Actual movement of cash.

---

# 110. Cost Object

Any entity against which cost is accumulated.

Examples:

```text
SKU
ORDER
PROJECT
PRODUCTION JOB
CUSTOMER
CHANNEL
```

---

# 111. Cost Component

Represents type of cost.

---

# 112. Cost Entry

Actual or estimated recorded cost.

---

# 113. Cost Snapshot

Historical costing view.

---

# 114. Contribution Snapshot

Derived economics for defined object/time.

---

# 115. Creator Entity

Represents creator relationship.

---

# 116. Creator Profile

Public/private creator profile data.

---

# 117. Program Enrollment

Links participant to Program.

---

# 118. Creator Agreement

Legal/commercial terms.

---

# 119. Creator Product Relationship

Links creator to Product.

---

# 120. Collaboration Entity

Joint commercial/creative initiative.

---

# 121. Merch Project

Managed creator/community merchandising initiative.

---

# 122. Attribution Entity

Links commercial outcome to marketing/creator/program influence.

---

# 123. Royalty Rule

Defines royalty calculation.

---

# 124. Commission Rule

Defines affiliate/participant commission.

---

# 125. Earning Entity

Financial entitlement for participant.

---

# 126. Payout Entity

Settlement of participant earnings.

---

# 127. Partner Entity

Canonical external execution/supply counterpart.

---

# 128. Partner Site

Partner operational location.

---

# 129. Capability Entity

Defines what execution resource can do.

---

# 130. Rate Card

Standard partner process/service pricing.

---

# 131. Capacity Entity

Time-bound availability/capacity.

---

# 132. Supplier Item

External supplier's commercial item.

---

# 133. Supplier Item Mapping

Maps external supplier item to TeeStock Material/Product.

---

# 134. Purchase Request

Internal request to procure.

---

# 135. Purchase Order

Formal procurement commitment.

---

# 136. Purchase Order Line

Individual purchased item/service.

---

# 137. Goods Receipt

Records received goods/material.

---

# 138. Production Job

Canonical:

> **Production Job represents a required production outcome generated from demand or inventory requirement.**

---

# 139. Production Job Sources

Potential:

```text
ORDER
PROJECT
RESTOCK
SAMPLE
REPLACEMENT
```

---

# 140. Work Order

Specific execution instruction assigned to internal/external resource.

---

# 141. Production Job vs Work Order

Canonical:

```text
PRODUCTION JOB
what needs to be produced.

WORK ORDER
who performs a specific part of it.
```

---

# 142. Work Order Version

Captures issued scope version.

---

# 143. Change Order

Structured change after release.

---

# 144. Production Batch / Lot

Traceable execution/output grouping.

---

# 145. Quality Inspection

QC evaluation instance.

---

# 146. QC Result

Potential:

```text
PASS
CONDITIONAL_PASS
REWORK
REJECT
```

---

# 147. Defect Entity

Specific quality issue.

---

# 148. Rework Entity

Corrective work required.

---

# 149. Claim Entity

Recovery request against external party/carrier/partner.

---

# 150. Inventory Location

Physical/logical stock location.

Examples:

```text
WAREHOUSE
PARTNER SITE
IN_TRANSIT
```

---

# 151. Inventory Item

Represents stock identity.

Usually associated with SKU/Material.

---

# 152. Inventory Lot

Batch/lot traceability where needed.

---

# 153. Inventory Balance

Derived quantity view.

Canonical ledger is preferred source.

---

# 154. Inventory Transaction

Canonical movement.

Examples:

```text
RECEIPT
RESERVE
RELEASE
ISSUE
TRANSFER
ADJUSTMENT
RETURN
SCRAP
```

---

# 155. Inventory Status

Potential:

```text
AVAILABLE
RESERVED
QC_HOLD
QUARANTINE
DAMAGED
```

---

# 156. Inventory Ownership

Canonical:

```text
TEEStock
CUSTOMER
PARTNER
CONSIGNOR
```

where applicable.

---

# 157. Fulfillment Entity

Represents fulfillment obligation for Order/Order Item.

---

# 158. Fulfillment Type

Potential:

```text
SHIPMENT
PICKUP
DIGITAL
CLIENT_HANDOFF
```

future.

---

# 159. Shipment

Physical shipping execution.

---

# 160. Shipment Item

Links Order Item/Inventory to shipment.

---

# 161. Carrier

Logistics provider.

---

# 162. Tracking Entity

Carrier tracking reference/status.

---

# 163. Package

Physical shipping package/container.

---

# 164. Return Request

Customer intent/request to return.

---

# 165. Return Entity

Actual reverse-logistics case.

---

# 166. Return Item

Specific returned item.

---

# 167. Return Shipment

Physical return movement.

---

# 168. Inspection

Returned-product inspection.

---

# 169. Disposition

What happens to returned item.

Potential:

```text
RESTOCK
REWORK
SCRAP
RTV
RETURN_TO_CLIENT
```

---

# 170. Replacement Entity

Replacement outcome.

---

# 171. Customer Case

Canonical support/service record.

---

# 172. Case Types

Potential:

```text
ORDER
PAYMENT
RETURN
QUALITY
DELIVERY
CREATOR
PARTNER
```

---

# 173. Case Status

Potential:

```text
OPEN
ASSIGNED
WAITING_INTERNAL
WAITING_CUSTOMER
RESOLVED
CLOSED
```

---

# 174. Case Reason

Customer-facing issue reason.

---

# 175. Root Cause

Underlying operational cause.

Do not confuse with Case Reason.

---

# 176. Task Entity

Explicit work requiring completion.

---

# 177. Task Owner

Can be:

```text
PERSON
TEAM
AGENT
SYSTEM
```

---

# 178. Task Status

Potential:

```text
TODO
IN_PROGRESS
BLOCKED
DONE
CANCELLED
```

---

# 179. Approval Entity

Structured authorization.

---

# 180. Approval Target

Can reference:

```text
QUOTE
PAYMENT
REFUND
PURCHASE
PRICE OVERRIDE
CAPEX
```

---

# 181. Exception Entity

Abnormal condition requiring attention.

---

# 182. Exception Is Cross-Domain

Potential:

```text
PAYMENT_FAILURE
INVENTORY_MISMATCH
PARTNER_DELAY
AI_REVIEW_REQUIRED
```

---

# 183. Campaign Entity

Marketing initiative.

---

# 184. Campaign Audience

Links Campaign to intended Segment.

---

# 185. Content Idea

Raw planned content opportunity.

---

# 186. Content Brief

Structured production definition.

---

# 187. Content Asset

Actual media/text asset.

---

# 188. Publication

Content published on Channel.

---

# 189. Content Rights

Defines permitted use.

---

# 190. Audience Entity

Broad strategic audience definition.

---

# 191. Segment Entity

Operationally actionable subset.

---

# 192. Segment Rule

Defines membership.

---

# 193. Segment Membership

Links Person/Customer/Account to Segment.

---

# 194. Cohort Entity

Groups entities by defined start/event.

---

# 195. Referral Entity

Links referrer to referred relationship.

---

# 196. Review Entity

Customer feedback associated with Product/Order/Service.

---

# 197. Community Entity

Future shared-interest participation group.

---

# 198. Community Membership

Links identity to Community.

---

# 199. Automation Entity

Logical automation definition.

---

# 200. Automation Version

Executable automation revision.

---

# 201. Workflow Run

Instance of workflow execution.

---

# 202. Job Entity

Machine-executable work unit.

---

# 203. Queue

Pending executable workload.

---

# 204. Agent Entity

Canonical AI worker configuration.

---

# 205. Agent Role

Defines mission/boundaries.

---

# 206. Tool Entity

Governed executable capability.

---

# 207. Skill Entity

Reusable procedure/instruction bundle.

---

# 208. Model Entity

Approved inference model definition.

---

# 209. Model Routing Rule

Maps task → suitable model policy.

---

# 210. Agent Run

One AI execution instance.

---

# 211. Agent Action

Specific tool/action attempted.

---

# 212. Integration Entity

Connection to external platform.

---

# 213. External Object Mapping

Maps:

```text
CANONICAL ENTITY
↔
EXTERNAL SYSTEM ENTITY
```

---

# 214. Event Entity

Canonical business fact.

---

# 215. Event Structure

Potential:

```text
Event ID
Type
Entity Type
Entity ID
Occurred At
Actor
Source
Payload
Correlation ID
Version
```

---

# 216. Event ≠ Current State

Events record facts.

Entity records represent current state.

---

# 217. Audit Log

Records material actions/changes.

---

# 218. Event Log vs Audit Log

Critical:

```text
EVENT LOG
business facts.

AUDIT LOG
who changed what.
```

---

# 219. Analytics Metric Definition

Canonical definition of KPI/metric.

---

# 220. Metric Observation

Calculated value over time/context.

---

# 221. Forecast Entity

Future estimate.

---

# 222. Forecast Version

Forecasts are versioned predictions.

---

# 223. Scenario Entity

Potential:

```text
BASE
UPSIDE
DOWNSIDE
STRESS
```

---

# 224. Decision Entity

Future MGBOS may record material management decisions.

---

# 225. Decision Register Link

Strategic decisions can reference canonical documentation/objects.

---

# 226. Entity Relationship Spine — Commerce

```text
CUSTOMER
↓
CART
↓
CHECKOUT
↓
ORDER
↓
ORDER ITEM
↓
PAYMENT
↓
FULFILLMENT
↓
SHIPMENT
↓
RETURN
```

---

# 227. Entity Relationship Spine — Services

```text
LEAD
↓
OPPORTUNITY
↓
QUOTE
↓
PROJECT
↓
ORDER
↓
PRODUCTION / FULFILLMENT
```

---

# 228. Entity Relationship Spine — Production

```text
ORDER / PROJECT / RESTOCK
↓
PRODUCTION JOB
↓
WORK ORDER
↓
PARTNER / INTERNAL RESOURCE
↓
OUTPUT
↓
QC
↓
INVENTORY / FULFILLMENT
```

---

# 229. Entity Relationship Spine — Creator

```text
CREATOR
↓
PROGRAM ENROLLMENT
↓
AGREEMENT
↓
ARTWORK / COLLAB
↓
PRODUCT
↓
ORDER ITEM
↓
ATTRIBUTION
↓
EARNING
↓
PAYOUT
```

---

# 230. Entity Relationship Spine — Partner

```text
PARTNER
↓
CAPABILITY
↓
RATE CARD
↓
WORK ORDER
↓
QC
↓
PARTNER INVOICE
↓
PAYABLE
↓
PAYMENT
```

---

# 231. Entity Relationship Spine — Finance

```text
BUSINESS EVENT
↓
RECEIVABLE / PAYABLE
↓
PAYMENT / CASH TRANSACTION
↓
COST / REVENUE ENTRY
↓
CONTRIBUTION
↓
P&L / CASH VIEW
```

---

# 232. Entity Relationship Spine — Marketing

```text
AUDIENCE
↓
SEGMENT
↓
CAMPAIGN
↓
CONTENT
↓
CHANNEL
↓
VISIT / LEAD
↓
ORDER
↓
COHORT
↓
RETENTION
```

---

# 233. Entity Relationship Spine — Automation

```text
EVENT
↓
AUTOMATION
↓
WORKFLOW RUN
↓
JOB / AGENT
↓
TOOL
↓
RESULT
↓
STATE CHANGE
```

---

# 234. Canonical Foreign-Key Principle

Relationships should reference stable IDs.

Not names.

---

# 235. Names Are Mutable

Example:

```text
Creator Display Name
Product Name
Company Name
```

can change.

Identity should not.

---

# 236. Identifier Principle

Every canonical entity gets immutable internal ID.

---

# 237. Human-Readable IDs

Can exist additionally:

```text
ORD-2026-000123
WO-000581
QT-000932
```

---

# 238. Internal ID vs Business Number

Canonical:

```text
INTERNAL ID
machine identity.

BUSINESS NUMBER
human-facing reference.
```

---

# 239. External IDs

Store external IDs separately.

---

# 240. Never Reuse IDs

Canonical.

---

# 241. ID Independence

Do not encode excessive business meaning into immutable IDs.

Business properties change.

---

# 242. Status Fields

Every entity with lifecycle should use controlled states.

---

# 243. Avoid Free-Text Status

Anti-pattern:

```text
"lagi proses vendor"
"udah selesai kayaknya"
```

---

# 244. State Transition Rules

Critical entities require valid transitions.

---

# 245. State History

Material state changes should be recoverable through:

```text
EVENTS
AUDIT
STATUS HISTORY
```

---

# 246. Soft Delete

Business records generally should not disappear physically.

Use:

```text
ACTIVE
ARCHIVED
CANCELLED
VOID
```

where appropriate.

---

# 247. Hard Delete

Reserved for:

```text
invalid/test data
privacy/legal requirement
```

under governance.

---

# 248. Temporal Data

Canonical model should understand time.

---

# 249. Created At

When record created.

---

# 250. Updated At

Last system change.

---

# 251. Effective From / To

For rules/rates/terms valid over periods.

---

# 252. Occurred At

When business event actually happened.

---

# 253. Recorded At

When system received/recorded fact.

These may differ.

---

# 254. Historical Snapshot

Important for:

```text
PRICE
COST
ATTRIBUTION
ROYALTY
QUOTE
```

---

# 255. Current Reference vs Snapshot

Example Order Item should preserve transaction price snapshot, not only reference current Price record.

---

# 256. Historical Integrity

Canonical:

> **Current master data must not rewrite historical economics.**

---

# 257. Currency

Every financial amount should store currency.

---

# 258. Base Currency

Management reporting may normalize to:

```text
IDR
```

initially.

---

# 259. Money Representation

Avoid floating-point financial ambiguity.

Use precise decimal/minor-unit conventions at implementation level.

---

# 260. Quantity

Must define unit.

Examples:

```text
PCS
KG
METER
HOUR
```

---

# 261. Unit of Measure

Canonical entity/list required.

---

# 262. Quantity Conversion

Only where defined.

---

# 263. Tax

Tax should be modeled explicitly where needed.

Not hidden inside ambiguous amount.

---

# 264. Address

Structured enough for logistics.

---

# 265. Geography

Potential:

```text
COUNTRY
PROVINCE
CITY
POSTAL CODE
```

without overcomplicating V1.

---

# 266. File Entity

Canonical:

> **File represents a stored digital asset linked to one or more business objects.**

---

# 267. File Metadata

Potential:

```text
File ID
Type
Storage Reference
Version
Owner
Rights
Checksum
Status
```

---

# 268. File Versioning

Critical for:

```text
ARTWORK
QUOTE
TECH PACK
CONTRACT
```

---

# 269. Document Entity

May represent structured/generated business document:

```text
INVOICE
QUOTE PDF
WORK ORDER PDF
STATEMENT
```

---

# 270. Comment / Note Entity

Can store contextual human communication.

---

# 271. Notes Do Not Replace Structured Fields

Canonical.

---

# 272. Tags

Useful for flexible classification.

Do not replace stable taxonomy.

---

# 273. Taxonomy

Controlled shared classification.

Examples:

```text
PRODUCT CATEGORY
CAPABILITY TYPE
CASE REASON
```

---

# 274. Enumeration Governance

Core enums should be centrally governed.

---

# 275. Avoid Enum Explosion

Add value only when it changes decisions/logic.

---

# 276. Source of Truth

Each data domain must have one canonical owner.

---

# 277. Example Source-of-Truth Matrix

```text
CUSTOMER
Identity / CRM domain

PRODUCT
Product domain

PRICE
Pricing domain

INVENTORY
Inventory ledger

ORDER
Commerce / Order domain

PAYMENT
Payment domain

WORK ORDER
Production domain

PAYOUT
Finance / Program domain
```

---

# 278. System of Engagement

Frontend/interface systems may display/update data.

They are not automatically source of truth.

---

# 279. Derived Read Model

Can combine multiple entities for efficient UI.

---

# 280. Example Customer 360

Derived view:

```text
IDENTITY
ORDERS
CASES
RETURNS
LIFECYCLE
VALUE
```

---

# 281. Customer 360 Is a View

Not necessarily another duplicated customer database.

---

# 282. Partner 360

Potential derived view:

```text
PROFILE
CAPABILITIES
WORK ORDERS
QC
CLAIMS
INVOICES
PERFORMANCE
```

---

# 283. Creator 360

Potential:

```text
PROFILE
PROGRAMS
AGREEMENTS
ARTWORK
PRODUCTS
EARNINGS
PAYOUTS
```

---

# 284. Product 360

Potential:

```text
PRODUCT
VARIANTS
SKU
INVENTORY
SALES
COST
RETURNS
CREATORS
```

---

# 285. Entity Ownership

Every core entity needs owning domain/team.

---

# 286. Entity Steward

Future role responsible for data definition/quality.

---

# 287. Data Quality Dimensions

Canonical:

```text
COMPLETENESS
VALIDITY
CONSISTENCY
UNIQUENESS
TIMELINESS
TRACEABILITY
```

---

# 288. Completeness

Required fields present.

---

# 289. Validity

Values obey allowed rules.

---

# 290. Consistency

Same fact agrees across systems.

---

# 291. Uniqueness

No unnecessary duplicates.

---

# 292. Timeliness

Data updated soon enough for decision.

---

# 293. Traceability

Origin/change can be understood.

---

# 294. Data Quality Rule

Potential:

```text
ACTIVE SKU
must have
PRODUCT
PRICE
STATUS
```

---

# 295. Data Validation

Should occur at write boundary.

---

# 296. Referential Integrity

Do not allow orphan records where relationship is required.

---

# 297. Example

Earning must reference:

```text
CREATOR
SOURCE TRANSACTION
RULE
```

---

# 298. Nullability

Missing value should be intentional.

Not random.

---

# 299. Unknown vs Not Applicable

Where important, distinguish.

---

# 300. Duplicate Identity Resolution

Potential issue:

```text
same customer
via website
and marketplace.
```

Need gradual identity resolution.

---

# 301. Identity Resolution

Potential signals:

```text
EMAIL
PHONE
ACCOUNT
VERIFIED LINK
```

---

# 302. Avoid Unsafe Automatic Merging

Human review may be needed for ambiguity.

---

# 303. Merge Entity Records

If duplicates merged:

preserve history/redirect references.

---

# 304. Master Data Governance

Material master-data changes should follow controlled ownership.

---

# 305. Product Creation

Should not happen from random ad hoc order entry without governance.

---

# 306. Partner Creation

Requires minimum identification/qualification.

---

# 307. Price Creation

Requires valid price book/effective date.

---

# 308. Creator Creation

Identity can exist before approved Program Enrollment.

---

# 309. Transaction Immutability

Completed transaction records should be append-adjust, not casually edited.

---

# 310. Financial Adjustment

Use:

```text
ADJUSTMENT
CREDIT
REVERSAL
```

rather than rewriting history.

---

# 311. Inventory Adjustment

Creates Inventory Transaction.

Do not overwrite balance.

---

# 312. Event-Sourced Thinking

Even without full event sourcing, important changes should produce business events.

---

# 313. Ledger Pattern

Recommended for quantities/value where history matters:

```text
INVENTORY
CASH
EARNINGS
```

---

# 314. Inventory Ledger

Balance derived from movements.

---

# 315. Earnings Ledger

Creator payable derived from earning/reversal/payout movements.

---

# 316. Cash Ledger

Financial system records actual movements.

---

# 317. Ledger Principle

Canonical:

> **Balances should be explainable from movements.**

---

# 318. Snapshot Principle

Snapshots improve performance/reporting but do not erase ledger lineage.

---

# 319. Data Lineage

Every important derived metric should trace back to source records.

---

# 320. Example Contribution Lineage

```text
ORDER ITEM
↓
NET SALES
↓
COST ENTRIES
↓
CHANNEL COST
↓
FULFILLMENT COST
↓
CONTRIBUTION
```

---

# 321. Analytics Model

Should consume canonical entities/events.

Not scrape random spreadsheets.

---

# 322. Operational Analytics vs Financial Accounting

Management analytics can differ from formal accounting representation.

Definitions must remain explicit.

---

# 323. Data Warehouse

Not V1 mandatory.

---

# 324. Analytics Progression

```text
OPERATIONAL DATABASE
↓
REPORTING VIEWS
↓
ANALYTICAL STORE
↓
WAREHOUSE / LAKEHOUSE if justified
```

---

# 325. MGBOS Data Role

Canonical:

> **MGBOS is the operational control plane over canonical entities and workflows—not a dumping ground for every field.**

---

# 326. MGBOS Entity Registry

Future MGBOS should maintain metadata for core entity types.

---

# 327. Entity Registry Fields

Potential:

```text
Entity Type
Owning Domain
ID Pattern
Lifecycle
Permissions
Event Types
```

---

# 328. Universal Object Search

Future operator search can search:

```text
CUSTOMER
ORDER
PROJECT
PRODUCT
SKU
WORK ORDER
CREATOR
PARTNER
```

---

# 329. Cross-Entity Timeline

Future MGBOS can combine related events into timeline.

---

# 330. Example Order Timeline

```text
ORDER CREATED
PAYMENT COMPLETED
WORK ORDER CREATED
QC PASSED
SHIPMENT CREATED
DELIVERED
```

---

# 331. Relationship Graph

Future system may navigate:

```text
CUSTOMER
→ ORDER
→ PRODUCT
→ CREATOR
→ EARNING
```

or:

```text
ORDER
→ PRODUCTION JOB
→ PARTNER
→ QC
```

---

# 332. Graph Database Not Required

Relationship graph is conceptual.

Relational data can support it initially.

---

# 333. Canonical API Objects

Public/internal APIs should expose canonical semantics.

---

# 334. API Versioning

Breaking changes require version strategy.

---

# 335. External Integration Mapping

External schemas adapt into TeeStock entities.

Never the reverse by default.

---

# 336. Marketplace Example

```text
MARKETPLACE ORDER
↓
MAPPING
↓
ORDER
+
ORDER ITEM
+
PAYMENT / SETTLEMENT CONTEXT
```

---

# 337. Carrier Example

```text
CARRIER TRACKING EVENT
↓
SHIPMENT EVENT
```

---

# 338. Payment Provider Example

```text
PROVIDER PAYMENT
↓
PAYMENT ATTEMPT / PAYMENT
```

---

# 339. Data Contracts

Important integrations should define:

```text
SCHEMA
REQUIRED FIELDS
VALIDATION
VERSION
OWNERSHIP
```

---

# 340. Event Contracts

Same principle for events.

---

# 341. AI Data Access

Agents should use canonical APIs/tools.

---

# 342. AI Should Not Query Arbitrary Tables by Default

Canonical.

---

# 343. Tool-Level Data Access

Example:

```text
GET_ORDER(order_id)
GET_CUSTOMER_CONTEXT(customer_id)
```

instead of unrestricted SQL.

---

# 344. AI Context Should Use IDs

Preserve entity references.

---

# 345. AI Output to Structured Data

Must pass validation before writing.

---

# 346. AI-Generated Fact

Should never become canonical fact merely because model said it.

---

# 347. AI Recommendation

Store separately from actual decision where useful.

---

# 348. Prediction Entity

Future:

```text
PREDICTION
├── Subject
├── Model
├── Value
├── Confidence
└── Generated At
```

---

# 349. Prediction ≠ Truth

Canonical.

---

# 350. Recommendation Entity

Future support for:

```text
PARTNER ROUTING
REORDER
CONTENT
```

---

# 351. Human Decision

Can accept/reject recommendation.

---

# 352. Explainability

Material AI recommendations should preserve supporting context where possible.

---

# 353. Data Security Classification

Potential:

```text
PUBLIC
INTERNAL
CONFIDENTIAL
RESTRICTED
```

---

# 354. Public

Safe for external use.

---

# 355. Internal

Operational company data.

---

# 356. Confidential

Commercial/customer-sensitive.

---

# 357. Restricted

Highest sensitivity.

Examples:

```text
BANK DETAILS
CREDENTIALS
LEGAL IDENTITY
```

---

# 358. Permissions

Access should follow:

```text
USER / AGENT
+
ROLE
+
RESOURCE
+
ACTION
```

---

# 359. Row-Level Access

May be required for:

```text
CREATOR
PARTNER
BUSINESS CLIENT
```

portals.

---

# 360. Field-Level Restriction

Useful for:

```text
COST
MARGIN
BANK DATA
```

---

# 361. Auditability

Material data changes need:

```text
ACTOR
TIME
ACTION
OLD / NEW
REASON
```

where relevant.

---

# 362. Data Retention

Retention period depends on:

```text
LEGAL
FINANCIAL
OPERATIONAL
PRIVACY
```

requirements.

---

# 363. Archive

Inactive records remain accessible as required.

---

# 364. Data Export

Future system should support controlled export for:

```text
FINANCE
ANALYTICS
CUSTOMER REQUEST
```

as applicable.

---

# 365. Data Portability

Avoid unnecessary vendor lock-in around canonical truth.

---

# 366. Canonical Entity Tiers

Recommended:

```text
TIER 0 — ENTERPRISE
Organization, Business Unit

TIER 1 — IDENTITY / MASTER
Person, Customer, Product, Creator, Partner

TIER 2 — COMMERCIAL
Lead, Quote, Order, Payment

TIER 3 — OPERATIONS
Project, Production Job, Work Order, Inventory, Shipment

TIER 4 — FINANCIAL / PROGRAM
Cost, Earning, Payout, Receivable, Payable

TIER 5 — CONTROL
Event, Task, Approval, Exception, Automation, Agent
```

---

# 367. V1 Core Entity Spine

TeeStock should implement first:

```text
PERSON / CUSTOMER
PRODUCT
VARIANT
SKU
ORDER
ORDER ITEM
PAYMENT
INVENTORY TRANSACTION
PRODUCTION JOB
WORK ORDER
SHIPMENT
PARTNER
CREATOR
```

---

# 368. V1 Commercial Extensions

Add:

```text
LEAD
QUOTE
PROJECT
```

for Services/B2B.

---

# 369. V1 Creator Extensions

Add:

```text
PROGRAM ENROLLMENT
ARTWORK
CREATOR PRODUCT RELATIONSHIP
EARNING
PAYOUT
```

---

# 370. V1 Partner Extensions

Add:

```text
CAPABILITY
RATE
QC RESULT
```

---

# 371. V1 Finance Extensions

Add:

```text
COST ENTRY
RECEIVABLE
PAYABLE
```

as needed.

---

# 372. V1 Control Extensions

Add:

```text
TASK
APPROVAL
EXCEPTION
EVENT
```

---

# 373. V1 Avoid

Do not immediately implement:

```text
100+ tables
generic metadata engine
complex graph database
full data warehouse
predictive feature store
universal AI memory database
```

---

# 374. Progressive Model Strategy

Canonical:

```text
MODEL CORE BUSINESS FIRST
↓
MODEL REPEATED EXCEPTIONS
↓
MODEL ANALYTICS
↓
MODEL AI FEATURES
```

---

# 375. Database Design Principle

Prefer:

```text
EXPLICIT DOMAIN MODEL
```

over:

```text
EVERYTHING IS A GENERIC OBJECT
```

---

# 376. Generic Object Anti-Pattern

A universal table like:

```text
thing
thing_type
thing_data_json
```

may appear flexible but destroys clarity if overused.

---

# 377. JSON Use

Useful for:

```text
provider payload
optional metadata
low-stability fields
```

not core business truth.

---

# 378. Structured Core Fields

Important queryable facts should be explicit.

---

# 379. Schema Evolution

Canonical model will evolve.

Changes should be:

```text
DOCUMENTED
MIGRATED
VERSIONED
```

---

# 380. Breaking Semantic Change

Requires canonical documentation update.

---

# 381. Field Rename

Technical rename is less important than semantic consistency.

---

# 382. Deprecated Field

Should have migration path.

---

# 383. Entity Merge/Split

Requires explicit transition plan.

---

# 384. Canonical Naming

Use consistent singular nouns for entity names.

Examples:

```text
Order
OrderItem
WorkOrder
Creator
Partner
```

---

# 385. Avoid Synonym Chaos

Pick one canonical term.

Example:

Do not alternate:

```text
Vendor
Supplier
Partner
```

when referring to same canonical entity.

---

# 386. Controlled Vocabulary

Canonical glossary remains companion source.

---

# 387. Status Naming

Use machine-safe style:

```text
IN_PROGRESS
AWAITING_PAYMENT
```

at implementation level.

---

# 388. Human Labels

UI can display:

```text
In Progress
Menunggu Pembayaran
```

without changing canonical enum.

---

# 389. Localization

Canonical internal values can remain language-neutral/English.

UI may localize.

---

# 390. Business Rules Not Hidden in Database

Data model stores state.

Rule engine/app logic controls policy.

---

# 391. Database Constraint

Use for invariant truths.

Example:

```text
qty >= 0
```

where applicable.

---

# 392. Application Rule

Use for contextual business policy.

---

# 393. Workflow Rule

Use for state/process transition.

---

# 394. Analytics Rule

Use for metric derivation.

---

# 395. Separation Prevents Logic Chaos

Canonical.

---

# 396. MGBOS Canonical Object Header

Future common object metadata may include:

```text
id
type
status
created_at
updated_at
created_by
business_unit_id
```

as relevant.

---

# 397. Not Every Entity Needs Every Field

Avoid forced generic inheritance.

---

# 398. Business Unit Scoping

Important for MultiGraph Group future.

Records should know owning business unit where relevant.

---

# 399. Shared Entity

Some objects may be shared across units:

```text
PARTNER
SUPPLIER
PERSON
```

depending architecture.

---

# 400. Business-Unit-Specific Relationship

Example:

```text
PARTNER
+
TEEStock RELATIONSHIP
```

may differ from partner relationship with MultiGraph.

---

# 401. Intercompany Entity

Future:

```text
INTERCOMPANY TRANSACTION
```

for MultiGraph ↔ TeeStock flows if legal/accounting structure requires.

---

# 402. Multi-Brand Readiness

Product/Order can retain:

```text
BUSINESS UNIT
BRAND
LABEL
```

context without separate system.

---

# 403. Multi-Channel Readiness

Order can retain:

```text
CHANNEL
SOURCE
EXTERNAL REFERENCES
```

---

# 404. Multi-Partner Readiness

Production Job can link to multiple Work Orders.

---

# 405. Multi-Creator Readiness

Product can have multiple creator relationships.

---

# 406. Multi-Fulfillment Readiness

Order can have multiple Fulfillments/Shipments.

---

# 407. Multi-Payment Readiness

Order may eventually have:

```text
DEPOSIT
FINAL PAYMENT
MULTIPLE ATTEMPTS
```

---

# 408. Data Model Should Support Reality

Without prematurely building every feature.

---

# 409. Canonical Data Model Maturity

```text
LEVEL 0
Spreadsheets and duplicated concepts

LEVEL 1
Core entities + IDs

LEVEL 2
Cross-domain relationships + events

LEVEL 3
Governed master data + lineage

LEVEL 4
Real-time integrated operating model

LEVEL 5
AI-accessible semantic business graph
```

---

# 410. Level 0

Anti-goal:

```text
Customer Name
typed differently
in every spreadsheet.
```

---

# 411. Level 1

Build:

```text
STABLE IDs
CORE ENTITIES
CONTROLLED STATUS
```

---

# 412. Level 2

Add:

```text
RELATIONSHIPS
EVENTS
HISTORICAL SNAPSHOTS
```

---

# 413. Level 3

Add:

```text
DATA QUALITY
OWNERSHIP
SCHEMA GOVERNANCE
LINEAGE
```

---

# 414. Level 4

Add:

```text
API
REAL-TIME EVENTING
CROSS-DOMAIN READ MODELS
```

---

# 415. Level 5

Jarvis/agents can navigate TeeStock as structured semantic system.

---

# 416. Current Recommended Stage

TeeStock should target:

```text
LEVEL 1
→
LEVEL 2
```

while documenting Level 3 principles now.

---

# 417. Data Model Success Definition

The model succeeds when TeeStock can answer:

```text
WHO
is this person / company?

WHAT
are they to TeeStock?

WHAT PRODUCT
is this?

WHAT SKU
is actually stocked?

WHAT DID
the customer buy?

WHAT PRICE
applied then?

WHAT PAYMENT
belongs to it?

WHAT WORK
must be performed?

WHO
performed the work?

WHAT INVENTORY
moved?

WHAT DID
it cost?

WHAT FAILED?

WHO
is responsible?

WHAT CREATOR
earned from it?

WHAT PARTNER
delivered it?

WHAT CAMPAIGN
influenced it?

WHAT EVENT
changed its state?

WHAT AUTOMATION
acted on it?

CAN EVERY SYSTEM
refer to the same business object?
```

---

# 418. Canonical Data Model Summary

```text
IDENTITY
defines who.

MASTER DATA
defines what exists.

TRANSACTIONS
define commercial commitments.

OPERATIONS
define work.

FINANCE
defines economic movement.

EVENTS
define what happened.

ANALYTICS
derive insight.

AUTOMATION
acts on state.

AI
interprets and orchestrates.

CANONICAL DATA
keeps all of them speaking the same language.
```

---

# 419. Canonical Data Principles

```text
ONE BUSINESS FACT SHOULD HAVE ONE CANONICAL MEANING.

ONE ENTITY SHOULD HAVE ONE STABLE IDENTITY.

PERSON IS NOT CUSTOMER.

PRODUCT IS NOT SKU.

QUOTE IS NOT ORDER.

PAYMENT IS NOT REVENUE.

RETURN IS NOT REFUND.

PRODUCTION JOB IS NOT WORK ORDER.

ARTWORK IS NOT PRODUCT.

CREATOR SALES ARE NOT CREATOR EARNINGS.

PARTNER RATE IS NOT EFFECTIVE COST.

CURRENT MASTER DATA MUST NOT REWRITE HISTORY.

BALANCES SHOULD BE EXPLAINABLE FROM MOVEMENTS.

STATUS MUST BE EXPLICIT.

RELATIONSHIPS MUST BE MODELED.

EXTERNAL SYSTEMS MAP INTO CANONICAL ENTITIES.

DERIVED DATA MUST TRACE TO SOURCE DATA.

AI OUTPUT IS NOT CANONICAL TRUTH UNTIL VALIDATED.

MGBOS CONTROLS THE BUSINESS THROUGH CANONICAL OBJECTS.
```

---

# 420. Dependency

Dokumen berikut harus follow Canonical Data Model:

1. `11-data-mgbos/entity-hierarchy.md`
2. `11-data-mgbos/sku-and-id-convention.md`
3. `11-data-mgbos/event-model.md`
4. `11-data-mgbos/mgbos-integration.md`
5. `11-data-mgbos/analytics-model.md`
6. `12-legal-ip/ip-policy.md`
7. `13-metrics-experiments/kpi-framework.md`
8. `13-metrics-experiments/experimentation-framework.md`
9. `13-metrics-experiments/decision-thresholds.md`
10. `14-roadmap/master-roadmap.md`
11. `14-roadmap/capability-roadmap.md`

TeeStock Canonical Data Model boleh berkembang menjadi integrated operational graph untuk seluruh MultiGraph Group, multi-brand commerce, partner network, creator ecosystem, analytics, automation, dan Jarvis AI orchestration, tetapi expansion hanya boleh dilakukan dengan mempertahankan stable identity, semantic clarity, historical integrity, domain ownership, explicit relationships, dan traceable business truth.