---
title: "TeeStock Entity Hierarchy"
date: "2026-09-28"
bisnis: teestock
kategori: operasional
status: active
tags:
  - bisnis/teestock
  - kategori/operasional
  - teestock/canonical
  - teestock/data-mgbos
document_id: "TS-DAT-002"
version: "1.0"
category: "data-mgbos"
business: "teestock"
last_updated: "2026-09-28"
path: "11-data-mgbos/entity-hierarchy.md"
depends_on:
  - "TS-DAT-001"
  - "TS-FND-001"
  - "TS-STR-003"
  - "TS-COM-005"
  - "TS-OPS-001"
  - "TS-TEC-001"
---


# TeeStock Entity Hierarchy v1.0

> [!abstract] **Canonical TeeStock Entity Ownership, Parent-Child, Containment & Relationship Hierarchy  **
> Dokumen ini mendefinisikan hierarchy, parent-child relationships, ownership boundaries, containment rules, association patterns, cross-domain references, and object-scoping principles untuk seluruh canonical entities TeeStock dan future MultiGraph Business OS.
>
> [!info] **Dependencies & Data Flow (SSOT)**
> [[bisnis/teestock/11-data-mgbos/canonical-data-model|TS-DAT-001: TeeStock Canonical Data Model]] • [[bisnis/teestock/00-foundation/teestock-master-definition|TS-FND-001: TeeStock Master Definition]] • [[bisnis/teestock/01-strategy/ecosystem-architecture|TS-STR-003: TeeStock Ecosystem Architecture]] • [[bisnis/teestock/03-commerce/product-taxonomy|TS-COM-005: TeeStock Product Taxonomy]] • [[bisnis/teestock/07-operations/operating-model|TS-OPS-001: TeeStock Operating Model]] • [[bisnis/teestock/10-product-tech/digital-product-vision|TS-TEC-001: TeeStock Digital Product Vision]]


---

# 1. Purpose

Entity Hierarchy menjawab:

> **Entitas apa berada di bawah entitas apa, siapa yang memilikinya, hubungan mana yang hierarchical dan mana yang hanya association, serta bagaimana MGBOS mencegah data menjadi ambigu ketika bisnis berkembang menjadi multi-brand, multi-channel, multi-partner, multi-creator, dan multi-business-unit?**

Canonical principle:

> **Hierarchy defines ownership. Relationships define reality. Do not confuse the two.**

---

# 2. Canonical Definition

> **TeeStock Entity Hierarchy adalah structural model yang menetapkan parent-child, ownership, scope, containment, and reference relationships antar canonical entities sehingga setiap business object memiliki tempat yang jelas dalam ecosystem tanpa menciptakan duplicate ownership atau ambiguous hierarchy.**

---

# 3. Hierarchy vs Relationship

Critical distinction:

```text
HIERARCHY
defines structural ownership / containment.

RELATIONSHIP
connects entities without implying ownership.
```

---

# 4. Example

```text
PRODUCT
└── VARIANT
    └── SKU
```

is hierarchy.

But:

```text
PRODUCT
↔ CREATOR
```

is association.

Creator does not structurally own the Product entity.

---

# 5. Why This Matters

Without explicit hierarchy:

```text
WHO OWNS THIS RECORD?
WHERE DOES IT BELONG?
CAN IT EXIST WITHOUT PARENT?
CAN IT MOVE?
CAN MULTIPLE PARENTS EXIST?
```

become unclear.

---

# 6. Canonical Hierarchy Levels

Top-level conceptual hierarchy:

```text
L0 — ENTERPRISE
L1 — BUSINESS
L2 — DOMAIN / BRAND / PROGRAM
L3 — COMMERCIAL OBJECT
L4 — OPERATIONAL OBJECT
L5 — EXECUTION / TRANSACTION DETAIL
L6 — EVENT / AUDIT / ANALYTICS
```

---

# 7. Enterprise Hierarchy

Canonical:

```text
ORGANIZATION
└── BUSINESS UNIT
```

Example:

```text
MULTIGRAPH GROUP
├── TEEStock
├── MULTIGRAPH
└── FUTURE BUSINESS UNIT
```

---

# 8. Organization

Organization is highest business ownership container.

---

# 9. Business Unit

Business Unit belongs to one Organization.

Canonical:

```text
Organization
1
↓
N Business Units
```

---

# 10. Business Unit Scope

Operational records should generally know which Business Unit owns them.

---

# 11. Shared Enterprise Entities

Some entities may exist above Business Unit.

Potential:

```text
PERSON
ORGANIZATION ACCOUNT
PARTNER
SUPPLIER
```

but their specific commercial relationship can remain Business-Unit scoped.

---

# 12. Shared Entity vs Shared Relationship

Critical:

```text
PARTNER IDENTITY
may be shared.

PARTNER RELATIONSHIP WITH TEEStock
is TeeStock-specific.
```

---

# 13. Business Structure Hierarchy

Within TeeStock:

```text
TEEStock
├── COMMERCE
├── SERVICES
├── ORIGINALS
└── PROGRAMS
```

These are major business domains/lines.

---

# 14. Business Line

Business Line belongs to Business Unit.

```text
BUSINESS UNIT
└── BUSINESS LINE
```

---

# 15. Business Line Is Economic Structure

It helps organize:

```text
REVENUE
COST
OPERATING RESPONSIBILITY
```

---

# 16. Domain Is Not Always Parent

A technical domain like Finance or Inventory may span multiple Business Lines.

Therefore:

```text
DOMAIN
≠
always hierarchical parent.
```

---

# 17. Brand Hierarchy

Canonical:

```text
BUSINESS UNIT
└── BRAND
    └── LABEL
```

where applicable.

---

# 18. TeeStock Master Brand

TeeStock is the primary customer-facing brand.

---

# 19. Label

Independent Label structurally belongs to:

```text
TEEStock
→ ORIGINALS
→ LABEL
```

---

# 20. Label Does Not Own Infrastructure

A Label may use shared:

```text
COMMERCE
INVENTORY
FULFILLMENT
MGBOS
```

without duplicating these systems.

---

# 21. Brand vs Business Unit

Critical:

```text
BUSINESS UNIT
operating/economic entity.

BRAND
market-facing identity.
```

One Business Unit may operate multiple Brands.

---

# 22. Collection Hierarchy

Canonical:

```text
BRAND / LABEL
└── COLLECTION
```

or:

```text
TEEStock ORIGINALS
└── COLLECTION
```

depending collection type.

---

# 23. Collection Ownership

A Collection should have one primary owning commercial/creative context.

---

# 24. Product Membership

Product can belong to multiple merchandising collections if needed.

Therefore:

```text
COLLECTION ↔ PRODUCT
```

is often many-to-many association.

---

# 25. Collection Is Not Always Parent of Product

Canonical:

> Product identity should not depend on Collection membership.

---

# 26. Product Hierarchy

Canonical:

```text
PRODUCT
└── VARIANT
    └── SKU
```

---

# 27. Product

Top-level commercial product concept.

---

# 28. Variant

Child of Product.

Represents standardized selectable differences.

---

# 29. SKU

Child of Variant or Product configuration depending implementation.

Recommended conceptual:

```text
PRODUCT
└── VARIANT
    └── SKU
```

---

# 30. SKU Cannot Exist Without Product Context

Canonical.

---

# 31. Variant Can Exist Without Inventory

A Product Variant may be defined before stock exists.

---

# 32. SKU Can Be Non-Stocked

A standardized SKU may exist for made-to-order items.

Inventory tracking is separate.

---

# 33. Sellable Configuration Hierarchy

Custom configuration:

```text
PRODUCT
└── SELLABLE CONFIGURATION
```

but configuration is usually transaction-specific.

---

# 34. Sellable Configuration vs Variant

Critical:

```text
VARIANT
reusable standardized option.

SELLABLE CONFIGURATION
customer-specific combination.
```

---

# 35. Garment Platform Relationship

Potential:

```text
GARMENT PLATFORM
↔ PRODUCT
```

not necessarily parent-child.

Multiple Products may use same Garment Platform.

---

# 36. Design Relationship

Canonical:

```text
DESIGN
↔ PRODUCT
```

One Design may appear on multiple Products.

One Product may incorporate multiple Design elements.

---

# 37. Artwork Hierarchy

Canonical:

```text
ARTWORK
└── ARTWORK VERSION
```

---

# 38. Artwork Version

Strict child.

Cannot exist independently from Artwork.

---

# 39. Artwork-to-Design

Potential:

```text
DESIGN
↔ ARTWORK
```

depending workflow.

---

# 40. Artwork-to-Product

Usually association through:

```text
PRODUCT DESIGN / CREATOR PRODUCT RELATIONSHIP
```

rather than direct ownership.

---

# 41. Product-to-Creator

Canonical:

```text
PRODUCT
↔ CREATOR
```

many-to-many where needed.

---

# 42. Creator Does Not Parent Product

Important for shared Commerce architecture.

---

# 43. Product-to-Brand

Product should generally have primary Brand context.

Potential:

```text
BRAND
└── PRODUCT
```

at business ownership level.

---

# 44. Product-to-Label

Label products may additionally have:

```text
LABEL
└── PRODUCT
```

as primary brand context.

---

# 45. Category Hierarchy

Potential:

```text
CATEGORY
└── SUBCATEGORY
```

but keep shallow initially.

---

# 46. Category Membership

Product associates with Category.

Product identity does not depend on Category.

---

# 47. Taxonomy Is Classification

Not ownership.

Canonical.

---

# 48. Catalog Hierarchy

Canonical:

```text
CATALOG
└── CATALOG ENTRY
```

---

# 49. Catalog Entry

Strict child of Catalog.

References:

```text
PRODUCT
CHANNEL
PRICE CONTEXT
```

---

# 50. Catalog Does Not Own Product

Catalog references Product.

---

# 51. Channel Hierarchy

Potential:

```text
CHANNEL
└── CHANNEL ACCOUNT
    └── CHANNEL LISTING
```

---

# 52. Channel Account

Example:

```text
Marketplace
└── TeeStock Official Store
```

---

# 53. Channel Listing

Child of Channel Account.

References canonical Product/SKU.

---

# 54. External Listing Does Not Own Product

Canonical.

---

# 55. Identity Hierarchy

Canonical:

```text
PERSON
└── USER ACCOUNT
```

conceptually one-to-one or one-to-many depending security model.

---

# 56. Person vs User Account

Person is business identity.

User Account is authentication identity.

---

# 57. Organization Account Hierarchy

Canonical:

```text
ORGANIZATION ACCOUNT
└── CONTACT RELATIONSHIP
    └── PERSON
```

Conceptually Contact Relationship links rather than strictly contains Person.

---

# 58. Better Representation

```text
PERSON
↔ ORGANIZATION ACCOUNT
through
CONTACT ROLE
```

---

# 59. Person Does Not Belong Exclusively to Organization

A Person can relate to multiple Organizations.

---

# 60. Organization Account

Represents external organization.

Examples:

```text
CUSTOMER COMPANY
CREATOR ORGANIZATION
PARTNER COMPANY
```

---

# 61. Organization Account Roles

One Organization may hold multiple TeeStock relationships.

---

# 62. Customer Relationship Hierarchy

Canonical:

```text
PERSON / ORGANIZATION
↓
CUSTOMER RELATIONSHIP
```

---

# 63. Customer Profile

Child of Customer relationship if modeled separately.

---

# 64. Customer Lifecycle

Attribute/state of Customer.

Not separate identity.

---

# 65. Customer Addresses

Potential:

```text
CUSTOMER / PERSON / ORGANIZATION
└── ADDRESS ASSOCIATIONS
```

Address itself may be reusable entity.

---

# 66. Lead Hierarchy

Canonical:

```text
LEAD
→ PERSON / ORGANIZATION
```

association.

Lead should not own Person.

---

# 67. Opportunity Hierarchy

Potential:

```text
CUSTOMER / ORGANIZATION
└── OPPORTUNITY
    └── QUOTE
```

---

# 68. Opportunity Can Have Multiple Quotes

Canonical:

```text
OPPORTUNITY
1
↓
N QUOTE VERSIONS / QUOTES
```

---

# 69. Quote Hierarchy

```text
QUOTE
└── QUOTE LINE
```

---

# 70. Quote Line

Strict child of Quote.

---

# 71. Quote to Order

Canonical:

```text
QUOTE
→ ORDER
```

conversion/reference.

Order is not child of Quote because Order can exist without Quote.

---

# 72. Project Hierarchy

Canonical:

```text
PROJECT
├── TASK
├── DELIVERABLE
├── FILE
└── RELATED ORDER
```

depending implementation.

---

# 73. Project to Order

Association.

One Project may generate one or many Orders.

---

# 74. Project to Opportunity

Potential:

```text
OPPORTUNITY
→ PROJECT
```

after sale.

---

# 75. Commerce Transaction Hierarchy

Canonical:

```text
ORDER
└── ORDER ITEM
```

---

# 76. Order Item

Strict child of Order.

---

# 77. Order Cannot Exist Without Customer Context

Except limited anonymous/system cases before identity resolution.

---

# 78. Order Item References

Each Order Item references:

```text
PRODUCT
VARIANT / SKU / CONFIGURATION
PRICE SNAPSHOT
```

---

# 79. Order-to-Payment

Association:

```text
ORDER
↔ PAYMENT
```

because one Order may have multiple Payments.

---

# 80. Payment Hierarchy

Potential:

```text
PAYMENT INTENT
└── PAYMENT ATTEMPT
```

---

# 81. Payment to Settlement

Association.

One Payment may settle through one or multiple Settlement entries.

---

# 82. Order-to-Fulfillment

Canonical:

```text
ORDER
└── FULFILLMENT
    └── SHIPMENT
```

conceptually.

---

# 83. One Order Can Have Multiple Fulfillments

Important for split shipments.

---

# 84. Fulfillment-to-Order Item

Many-to-many through fulfillment item allocation may be required.

---

# 85. Shipment Hierarchy

Canonical:

```text
SHIPMENT
├── PACKAGE
├── SHIPMENT ITEM
└── TRACKING
```

---

# 86. Shipment Item

Links Order Item / Inventory unit to Shipment.

---

# 87. Tracking

Child of Shipment or external tracking relationship.

---

# 88. Return Hierarchy

Canonical:

```text
RETURN REQUEST
↓
RETURN
├── RETURN ITEM
├── RETURN SHIPMENT
├── INSPECTION
└── DISPOSITION
```

---

# 89. Return Request vs Return

Request is customer intent.

Return is approved/active reverse-logistics case.

---

# 90. Return Item

Strict child of Return.

References original Order Item.

---

# 91. Refund Relationship

```text
RETURN
↔ REFUND
```

not hierarchy.

Refund may exist without Return.

---

# 92. Replacement Relationship

```text
RETURN
↔ REPLACEMENT
```

---

# 93. Inventory Hierarchy

Canonical:

```text
INVENTORY LOCATION
└── INVENTORY LOT / STOCK CONTEXT
```

but inventory should primarily be ledger-based.

---

# 94. Inventory Item

References:

```text
SKU / MATERIAL
LOCATION
OWNERSHIP
STATUS
```

---

# 95. Inventory Balance

Derived.

Not independent parent object.

---

# 96. Inventory Transaction

Canonical movement referencing:

```text
ITEM
LOCATION
QTY
REASON
SOURCE OBJECT
```

---

# 97. Inventory Transaction Is Ledger Entry

It should never be structurally owned by Product alone.

---

# 98. Inventory Location Hierarchy

Potential:

```text
WAREHOUSE
└── ZONE
    └── BIN
```

only if operational need arises.

---

# 99. Early V1 Inventory Location

Keep simple:

```text
LOCATION
```

without unnecessary bin complexity.

---

# 100. Inventory Ownership

Separate dimension from location.

Example:

```text
TEEStock stock
at Partner Site.
```

---

# 101. Production Hierarchy

Canonical:

```text
PRODUCTION JOB
└── WORK ORDER
```

---

# 102. Production Job

Defines required production outcome.

---

# 103. Work Order

Defines execution assignment.

---

# 104. One Production Job Can Have Many Work Orders

Example:

```text
PRODUCTION JOB
├── Print Work Order
├── Embroidery Work Order
└── Packing Work Order
```

---

# 105. Work Order to Partner

Association:

```text
WORK ORDER
→ PARTNER / INTERNAL RESOURCE
```

---

# 106. Work Order Version

Canonical:

```text
WORK ORDER
└── WORK ORDER VERSION
```

if formal versioning is implemented.

---

# 107. Change Order

References Work Order.

Not necessarily strict child because it is a governance object.

---

# 108. Production Batch

Potential:

```text
WORK ORDER
└── BATCH / LOT
```

where execution traceability requires.

---

# 109. QC Hierarchy

Canonical:

```text
QUALITY INSPECTION
├── QC RESULT
└── DEFECT
```

---

# 110. Quality Inspection Target

Can reference:

```text
PRODUCTION BATCH
WORK ORDER
RETURN ITEM
INVENTORY RECEIPT
```

---

# 111. Defect

Child of Quality Inspection.

---

# 112. Rework

References:

```text
DEFECT / QC RESULT
→ REWORK
```

---

# 113. Partner Hierarchy

Canonical:

```text
PARTNER
├── PARTNER SITE
├── CAPABILITY
├── RATE CARD
└── AGREEMENT
```

---

# 114. Partner Site

Strictly associated with Partner.

---

# 115. Capability

Can be partner-level or site-level.

Preferred future:

```text
PARTNER SITE
└── CAPABILITY
```

where site differences matter.

---

# 116. Capability Rate

Rate Card references Capability.

---

# 117. Capacity

Potential:

```text
CAPABILITY
└── CAPACITY SNAPSHOT / PERIOD
```

---

# 118. Capacity Is Temporal

Do not store as timeless Partner attribute.

---

# 119. Supplier Item Hierarchy

Canonical:

```text
PARTNER / SUPPLIER
└── SUPPLIER ITEM
```

---

# 120. Supplier Item Mapping

Association:

```text
SUPPLIER ITEM
↔ MATERIAL / SKU
```

---

# 121. Procurement Hierarchy

Canonical:

```text
PURCHASE ORDER
└── PURCHASE ORDER LINE
```

---

# 122. Purchase Request to Purchase Order

Potential:

```text
PURCHASE REQUEST
→ PURCHASE ORDER
```

---

# 123. Purchase Order to Goods Receipt

Association:

```text
PURCHASE ORDER
→ GOODS RECEIPT
```

One PO may have multiple receipts.

---

# 124. Goods Receipt Hierarchy

Potential:

```text
GOODS RECEIPT
└── RECEIPT LINE
```

---

# 125. Partner Invoice

Association with:

```text
PARTNER
WORK ORDER
PURCHASE ORDER
```

depending transaction.

---

# 126. Creator Hierarchy

Canonical:

```text
CREATOR
├── CREATOR PROFILE
├── PROGRAM ENROLLMENT
├── AGREEMENT
├── ARTWORK
└── EARNING RELATIONSHIP
```

---

# 127. Creator Profile

One primary profile per Creator context.

---

# 128. Program Enrollment

Canonical association:

```text
CREATOR
↔ PROGRAM
through
PROGRAM ENROLLMENT
```

---

# 129. Enrollment Is Relationship Entity

Not simply Creator child in conceptual terms.

---

# 130. Creator Agreement

References:

```text
CREATOR
PROGRAM / COLLABORATION
```

---

# 131. Artwork

May be creator-owned.

Canonical:

```text
CREATOR
→ ARTWORK
```

as source relationship.

---

# 132. Artwork Version

Strict child of Artwork.

---

# 133. Collaboration Hierarchy

Potential:

```text
COLLABORATION
├── PARTICIPANTS
├── PRODUCTS
├── CONTENT
└── COMMERCIAL TERMS
```

Most are associations, not strict children.

---

# 134. Collaboration Participants

Many-to-many.

---

# 135. Collaboration to Product

Many-to-many if needed.

---

# 136. Merch Project

Canonical:

```text
MERCH PROJECT
├── PRODUCTS
├── CAMPAIGNS
├── ORDERS
└── FULFILLMENT CONTEXT
```

again primarily associations.

---

# 137. Earning Hierarchy

Canonical:

```text
CREATOR / PARTICIPANT
└── EARNING
```

conceptually financial relationship.

---

# 138. Earning Source

Must reference eligible transaction or event.

---

# 139. Payout Hierarchy

Potential:

```text
PAYOUT
└── PAYOUT LINE
    └── EARNING
```

if multiple earnings are grouped.

---

# 140. Payout Does Not Own Historical Earning

It settles it.

---

# 141. Marketing Hierarchy

Canonical:

```text
CAMPAIGN
├── CONTENT BRIEF
├── PUBLICATION
└── EXPERIMENT REFERENCES
```

---

# 142. Content Hierarchy

Potential:

```text
CONTENT IDEA
↓
CONTENT BRIEF
↓
CONTENT ASSET
↓
PUBLICATION
```

---

# 143. One Content Asset Can Have Multiple Publications

Canonical:

```text
CONTENT ASSET
1
↓
N PUBLICATIONS
```

---

# 144. Content Asset to Campaign

Association.

Asset may be reused across campaigns.

---

# 145. Content Rights

References Asset.

Rights do not own Asset.

---

# 146. Audience Hierarchy

Canonical:

```text
AUDIENCE
└── SEGMENT
```

conceptually.

---

# 147. Segment Membership

Association:

```text
PERSON / CUSTOMER / ACCOUNT
↔ SEGMENT
```

---

# 148. Segment Can Overlap

Therefore Segment membership is many-to-many.

---

# 149. Cohort

Independent analytical grouping.

Not structural parent.

---

# 150. Referral Hierarchy

Canonical:

```text
REFERRAL
links
REFERRER
→ REFERRED PARTY
→ OUTCOME
```

No strict parent-child ownership needed.

---

# 151. Review

References:

```text
CUSTOMER
ORDER
PRODUCT / SERVICE
```

---

# 152. Customer Service Hierarchy

Canonical:

```text
CUSTOMER CASE
├── CASE MESSAGE / INTERACTION
├── TASK
└── RESOLUTION
```

if modeled.

---

# 153. Case to Order

Association.

One Order may have multiple Cases.

---

# 154. Case to Return

Association.

---

# 155. Case Root Cause

Root Cause may be shared taxonomy/category.

Not Case child in semantic model.

---

# 156. Finance Hierarchy

Financial objects should avoid false ownership assumptions.

---

# 157. Receivable Hierarchy

Potential:

```text
RECEIVABLE
├── INVOICE
└── PAYMENT ALLOCATION
```

depending accounting implementation.

---

# 158. Payable Hierarchy

Potential:

```text
PAYABLE
├── PARTNER INVOICE
└── PAYMENT ALLOCATION
```

---

# 159. Payment Allocation

Links Payment to financial obligation.

---

# 160. Treasury Account

Independent master entity.

Cash Transactions reference it.

---

# 161. Cost Hierarchy

Potential:

```text
COST ENTRY
→ COST OBJECT
```

association.

---

# 162. Cost Object Is Polymorphic Concept

Potential target:

```text
ORDER ITEM
PROJECT
WORK ORDER
SKU
CHANNEL
```

---

# 163. Contribution Snapshot

Derived object associated with Cost Object/period.

---

# 164. Do Not Nest Finance Under Order Only

Costs/revenues exist beyond Order.

---

# 165. Automation Hierarchy

Canonical:

```text
AUTOMATION
└── AUTOMATION VERSION
    └── WORKFLOW RUN
```

conceptually.

---

# 166. Workflow Run

Execution instance referencing Automation Version.

---

# 167. Workflow Run to Job

Canonical:

```text
WORKFLOW RUN
└── JOB
```

---

# 168. Workflow Run to Task

Can create:

```text
WORKFLOW RUN
→ TASK
```

association.

---

# 169. Workflow Run to Approval

Association.

---

# 170. Exception

Can reference any business entity/workflow.

Not structurally child of Automation.

---

# 171. Agent Hierarchy

Canonical:

```text
AGENT
├── AGENT VERSION / CONFIG
├── TOOL PERMISSIONS
├── SKILLS
└── AGENT RUN
```

---

# 172. Agent Run

Strict execution instance associated with Agent.

---

# 173. Agent Run to Tool Action

Potential:

```text
AGENT RUN
└── AGENT ACTION
```

---

# 174. Tool

Independent governed capability.

---

# 175. Skill

Independent reusable procedure.

Agents reference Skills.

---

# 176. Model

Independent approved inference capability.

Agent/Model Routing references it.

---

# 177. Model Routing Rule

Association:

```text
TASK TYPE
→ MODEL
```

under constraints.

---

# 178. Integration Hierarchy

Canonical:

```text
INTEGRATION
├── CONNECTION / ACCOUNT
└── EXTERNAL OBJECT MAPPING
```

---

# 179. External Object Mapping

References:

```text
INTEGRATION
EXTERNAL ID
CANONICAL ENTITY
```

---

# 180. Event Hierarchy

Events do not form structural ownership hierarchy by default.

They reference Subjects.

---

# 181. Event Subject

Potential:

```text
ORDER
PAYMENT
WORK ORDER
CUSTOMER
```

---

# 182. Event Correlation

Events can belong to common correlation context.

---

# 183. Audit Log

References Actor + Target Entity.

Not owned by target in conceptual model.

---

# 184. Analytical Hierarchy

Potential:

```text
METRIC DEFINITION
└── METRIC OBSERVATION
```

---

# 185. Metric Definition

Defines meaning.

---

# 186. Metric Observation

Specific calculated value.

---

# 187. Forecast Hierarchy

Canonical:

```text
FORECAST
└── FORECAST VERSION
```

---

# 188. Scenario

Can be associated to Forecast Version.

---

# 189. Decision

Material management decision can reference multiple entities.

Not structurally owned by one.

---

# 190. Relationship Cardinality

Canonical types:

```text
ONE-TO-ONE
ONE-TO-MANY
MANY-TO-MANY
```

---

# 191. One-to-One

Use only when relationship truly exclusive.

---

# 192. One-to-Many

Example:

```text
ORDER
→ ORDER ITEMS
```

---

# 193. Many-to-Many

Example:

```text
CREATOR
↔ PRODUCT
```

---

# 194. Relationship Entity

Use when many-to-many relationship itself has business data.

---

# 195. Example CreatorProductRelationship

Stores:

```text
CREATOR
PRODUCT
RELATIONSHIP TYPE
ROYALTY RULE
EFFECTIVE DATE
```

---

# 196. Relationship Entity Principle

Canonical:

> **If the relationship has lifecycle, economics, permissions, or metadata, model the relationship as an entity.**

---

# 197. Examples

Use relationship entities for:

```text
PROGRAM ENROLLMENT
SEGMENT MEMBERSHIP
CREATOR PRODUCT RELATIONSHIP
CONTACT ROLE
```

---

# 198. Parent-Child Principle

Child lifecycle may depend on Parent.

---

# 199. Strict Child

Should generally not exist without Parent.

Examples:

```text
ORDER ITEM
ARTWORK VERSION
QUOTE LINE
PURCHASE ORDER LINE
```

---

# 200. Associated Entity

Can exist independently.

Examples:

```text
CREATOR
PARTNER
PRODUCT
PERSON
```

---

# 201. Ownership vs Reference

Canonical:

```text
PARENT OWNS CHILD.

REFERENCE CONNECTS PEERS.
```

---

# 202. Cross-Domain Reference

Allowed.

Example:

```text
ORDER ITEM
→ PRODUCT
```

Commerce references Product domain.

---

# 203. Cross-Domain Ownership

Avoid where possible.

Product domain owns Product.

Commerce must not redefine Product.

---

# 204. Domain Ownership Matrix

Recommended:

```text
IDENTITY
owns Person / Organization / User Account

PRODUCT
owns Product / Variant / SKU / Material

COMMERCE
owns Cart / Checkout / Order

FINANCE
owns Payment / Receivable / Payable

OPERATIONS
owns Project / Production Job / Work Order

INVENTORY
owns Inventory Transactions

CREATOR
owns Creator Relationship / Enrollment / Artwork

PARTNER
owns Partner Relationship / Capability

MARKETING
owns Campaign / Content / Segment

AUTOMATION
owns Automation / Workflow Run / Agent Config
```

---

# 205. Domain Ownership ≠ Exclusive Read Access

Other domains can read via defined interfaces.

---

# 206. Write Ownership

Canonical:

> **Only owning domain should directly mutate authoritative fields unless explicitly delegated.**

---

# 207. Example

Inventory availability can be read by Commerce.

Commerce should not directly overwrite Inventory ledger.

---

# 208. Example

Creator Platform can read Orders.

It should not alter Order commercial history.

---

# 209. Parent Reassignment

Some children may move between parents.

Must be explicit.

---

# 210. Example

Contact may move Organizations by creating/updating Contact Relationship.

Do not rewrite person identity.

---

# 211. Product Rebrand

Product may change brand context only through governed migration.

Historical Orders retain original Brand snapshot/context where needed.

---

# 212. Child Deletion

Deleting parent should not casually delete historical children.

---

# 213. Cascade Delete

Avoid for material business records.

---

# 214. Preferred

```text
ARCHIVE PARENT
+
PRESERVE CHILD HISTORY
```

---

# 215. Immutable Historical References

Order Item retains Product/SKU reference even if Product archived.

---

# 216. Orphan Prevention

Strict child must always have valid parent.

---

# 217. Entity Scope

Every material entity should define one or more scopes:

```text
ENTERPRISE
BUSINESS UNIT
BRAND
CUSTOMER
PARTNER
CREATOR
CHANNEL
```

as applicable.

---

# 218. Business Unit Scope

Most TeeStock operational objects:

```text
business_unit_id = TEEStock
```

---

# 219. Brand Scope

Useful for:

```text
PRODUCT
CAMPAIGN
CONTENT
ORDER CONTEXT
```

---

# 220. Channel Scope

Useful for:

```text
CATALOG ENTRY
CHANNEL LISTING
PRICE
CAMPAIGN
```

---

# 221. Customer Scope

Useful for:

```text
QUOTE
ORDER
CASE
```

---

# 222. Partner Scope

Useful for:

```text
RATE CARD
CAPACITY
WORK ORDER
```

---

# 223. Creator Scope

Useful for:

```text
ARTWORK
EARNING
PAYOUT
```

---

# 224. Scope Is Not Hierarchy

Canonical.

One object may carry multiple scopes.

---

# 225. Scope Example

A creator product Order Item may have:

```text
BUSINESS UNIT = TEEStock
BRAND = TEEStock
CHANNEL = WEBSITE
CREATOR = X
```

---

# 226. Inheritance

Avoid implicit business inheritance when values may differ.

---

# 227. Example

Product Brand may default from Collection.

But Product should store/resolve actual canonical Brand context explicitly.

---

# 228. Derived Hierarchy

Some hierarchical views may be analytical rather than canonical.

Example:

```text
CUSTOMER
→ SEGMENT
→ COHORT
```

is not structural ownership.

---

# 229. Tree vs Graph

Canonical model is fundamentally:

```text
CORE TREES
+
RELATIONSHIP GRAPH
```

---

# 230. Core Trees

Examples:

```text
ORGANIZATION → BUSINESS UNIT

PRODUCT → VARIANT → SKU

ORDER → ORDER ITEM

PRODUCTION JOB → WORK ORDER
```

---

# 231. Relationship Graph

Examples:

```text
PRODUCT ↔ CREATOR
ORDER ↔ CAMPAIGN
PARTNER ↔ CAPABILITY
PERSON ↔ ORGANIZATION
```

---

# 232. Do Not Force Everything into One Tree

Canonical.

---

# 233. MGBOS Navigation

Hierarchy should support operator navigation.

Example:

```text
BUSINESS UNIT
→ ORDER
→ ORDER ITEM
→ PRODUCTION JOB
→ WORK ORDER
→ QC
→ SHIPMENT
```

---

# 234. Object Detail Page

MGBOS should show:

```text
PARENT
CHILDREN
RELATED OBJECTS
EVENTS
TASKS
EXCEPTIONS
```

---

# 235. Entity Relationship Panel

Useful for quick context.

---

# 236. Example Order 360

```text
ORDER
├── Customer
├── Order Items
├── Payments
├── Production Jobs
├── Fulfillments
├── Shipments
├── Returns
├── Cases
└── Events
```

---

# 237. Product 360

```text
PRODUCT
├── Variants
├── SKUs
├── Catalog Entries
├── Inventory
├── Orders
├── Creators
├── Collections
├── Costs
└── Returns
```

---

# 238. Customer 360

```text
CUSTOMER
├── Identity
├── Organizations
├── Orders
├── Projects
├── Quotes
├── Cases
├── Returns
├── Segments
└── Lifecycle
```

---

# 239. Creator 360

```text
CREATOR
├── Profile
├── Program Enrollments
├── Agreements
├── Artwork
├── Products
├── Collaborations
├── Earnings
├── Payouts
└── Cases
```

---

# 240. Partner 360

```text
PARTNER
├── Sites
├── Capabilities
├── Rates
├── Capacity
├── Work Orders
├── QC
├── Claims
├── Invoices
└── Performance
```

---

# 241. Project 360

```text
PROJECT
├── Customer
├── Quote
├── Orders
├── Tasks
├── Production Jobs
├── Files
├── Cases
└── Financials
```

---

# 242. Production Job 360

```text
PRODUCTION JOB
├── Source Demand
├── BOM / Recipe
├── Work Orders
├── Material Issues
├── Batches
├── QC
├── Costs
└── Output
```

---

# 243. Hierarchy and Permissions

Permissions may inherit from hierarchy.

Example:

```text
Creator User
can access
Creator
→ own Artwork
→ own Earnings
```

---

# 244. Permission Inheritance

Must be explicit and bounded.

---

# 245. No Accidental Cross-Tenant Access

Critical for future:

```text
CREATORS
PARTNERS
BUSINESS CLIENTS
```

---

# 246. Portal Context

External portal should operate under scoped root entity.

Example:

```text
CREATOR PORTAL
root scope = Creator ID
```

---

# 247. Partner Portal

```text
root scope = Partner ID
```

---

# 248. Business Client Portal

```text
root scope = Organization Account ID
```

---

# 249. Internal Operators

May have broader Business Unit scope.

---

# 250. Jarvis Scope

Jarvis inherits requesting user's permissions plus agent/tool policy.

---

# 251. Jarvis Must Not Expand Scope

Canonical.

---

# 252. Agent Scope

Example:

```text
AGT-CONTENT
can access
Product + Campaign + Content

not
Bank Accounts.
```

---

# 253. Hierarchy and Events

Events should reference canonical entity IDs.

---

# 254. Parent Event Propagation

Child event may create derived parent update.

Example:

```text
shipment.delivered
→ fulfillment.completed
→ maybe order.completed
```

through rules.

---

# 255. Parent State Should Not Be Blindly Copied from Child

Multiple children may exist.

---

# 256. Example

Order with two Shipments:

one delivered does not necessarily mean Order complete.

---

# 257. Aggregated State

Parent status may be derived from child state aggregation.

---

# 258. Hierarchy and Analytics

Hierarchy enables rollups.

---

# 259. Product Rollup

```text
SKU
→ VARIANT
→ PRODUCT
→ BRAND
→ BUSINESS UNIT
```

---

# 260. Financial Rollup

```text
ORDER ITEM
→ ORDER
→ CHANNEL
→ BUSINESS LINE
→ BUSINESS UNIT
```

---

# 261. Partner Rollup

```text
WORK ORDER
→ CAPABILITY
→ PARTNER
```

---

# 262. Creator Rollup

```text
ORDER ITEM
→ PRODUCT
→ CREATOR RELATIONSHIP
→ CREATOR
```

---

# 263. Campaign Rollup

```text
PUBLICATION
→ CONTENT ASSET
→ CAMPAIGN
→ CHANNEL
```

---

# 264. Hierarchical Rollup ≠ Causal Attribution

Canonical.

---

# 265. Hierarchy Versioning

Structural changes should be documented.

---

# 266. Reparenting

If hierarchy changes:

preserve effective history where financially/analytically material.

---

# 267. Example Label Spin-Out

If an Originals Label later becomes independent Brand:

historical Products/Orders should still preserve original historical context.

---

# 268. Future Multi-Brand Structure

Potential:

```text
MULTIGRAPH GROUP
└── TEEStock
    ├── TeeStock Master Brand
    └── Originals
        ├── Label A
        ├── Label B
        └── Label C
```

---

# 269. Future Brand Independence

Potential evolution:

```text
TEEStock
└── Label A

↓ later

MULTIGRAPH GROUP
├── TEEStock
└── Label A Business Unit / Brand
```

only through governed migration.

---

# 270. Future Shared Infrastructure

Independent labels may still consume:

```text
MGBOS
COMMERCE
PRODUCTION
FULFILLMENT
FINANCE
```

as shared services.

---

# 271. Future Multi-Business-Unit Partner

Same Partner can serve:

```text
TEEStock
+
MULTIGRAPH
```

through separate relationship/context records.

---

# 272. Future Shared Customer

One Person may buy from multiple Business Units.

Identity can be shared while commercial records remain scoped.

---

# 273. Enterprise Customer 360

Possible later:

```text
PERSON / ORGANIZATION
├── TeeStock Relationship
└── MultiGraph Relationship
```

---

# 274. Do Not Prematurely Centralize Everything

Shared identity does not mean shared commercial logic.

---

# 275. Hierarchy Implementation Principle

Prefer explicit foreign keys / relationship tables.

Avoid inferring hierarchy from naming.

---

# 276. Example Anti-Pattern

```text
SKU code starts with ORG-
therefore it's Originals.
```

No.

Use explicit relationship.

---

# 277. Parent ID

Strict child should store stable parent reference.

---

# 278. Relationship Table

Use when many-to-many.

---

# 279. Effective Dating

Use where relationships change over time.

Examples:

```text
CreatorProductRelationship
PartnerRate
Brand Ownership
```

---

# 280. Relationship Status

Useful when association has lifecycle.

Potential:

```text
PENDING
ACTIVE
PAUSED
ENDED
```

---

# 281. Historical Relationship

Do not remove past Creator/Product relationship after agreement ends.

Mark effective period.

---

# 282. Hierarchy Integrity Rules

Canonical examples:

```text
ORDER ITEM
must belong to ORDER.

SKU
must reference PRODUCT.

ARTWORK VERSION
must belong to ARTWORK.

WORK ORDER
must reference PRODUCTION JOB or valid operational source.

PAYOUT LINE
must reference eligible EARNING.
```

---

# 283. Cross-Domain Integrity Rules

Examples:

```text
EARNING
must reference valid commercial source.

RETURN ITEM
must reference original ORDER ITEM.

CHANNEL LISTING
must reference canonical PRODUCT / SKU.

WORK ORDER PARTNER
must have eligible capability.
```

---

# 284. Invalid Hierarchy

System should reject orphan/invalid structural relationships.

---

# 285. Data Migration

Legacy data should map into hierarchy gradually.

---

# 286. Migration Priority

```text
IDENTITY
↓
PRODUCT
↓
ORDER
↓
OPERATIONS
↓
FINANCE
↓
MARKETING
```

---

# 287. Legacy Ambiguity

Where old data cannot confidently map:

```text
FLAG
DO NOT GUESS
```

---

# 288. Hierarchy Registry

Future MGBOS can maintain metadata:

```text
ENTITY
PARENT TYPE
OWNING DOMAIN
CARDINALITY
REQUIRED?
```

---

# 289. Example Registry

```text
OrderItem
Parent = Order
Required = Yes
Cardinality = Many-to-One
```

---

# 290. Relationship Registry

Potential:

```text
Creator ↔ Product
Relationship Entity = CreatorProductRelationship
Cardinality = Many-to-Many
```

---

# 291. Hierarchy Documentation

Every new canonical entity should define:

```text
PARENT
CHILDREN
OWNER DOMAIN
SCOPE
REFERENCES
CARDINALITY
LIFECYCLE DEPENDENCY
```

---

# 292. Entity Creation Gate

Before introducing new entity:

ask:

```text
IS THIS A REAL BUSINESS OBJECT?

OR
JUST AN ATTRIBUTE?

OR
JUST A RELATIONSHIP?

OR
JUST A VIEW?
```

---

# 293. Entity vs Attribute

Example:

```text
Product Color
```

may be Variant attribute.

Does not need independent business entity initially.

---

# 294. Entity vs Relationship

Example:

```text
CreatorProduct
```

exists because relationship has economics and lifecycle.

---

# 295. Entity vs View

Example:

```text
Customer360
```

should be read model/view, not duplicate Customer entity.

---

# 296. Entity vs Event

Example:

```text
OrderDelivered
```

is Event, not entity.

---

# 297. Entity vs Status

Example:

```text
PendingOrder
```

is Order with status.

Not separate entity.

---

# 298. Entity Explosion

Avoid creating a new table/object for every concept.

---

# 299. Attribute Explosion

Also avoid one giant entity with hundreds of unrelated fields.

---

# 300. Domain Boundary Helps Balance

Canonical.

---

# 301. Hierarchy Maturity Model

```text
LEVEL 0
Flat spreadsheets

LEVEL 1
Explicit parent-child

LEVEL 2
Relationship entities + domain ownership

LEVEL 3
Scoped multi-brand / multi-role hierarchy

LEVEL 4
Enterprise cross-business graph

LEVEL 5
AI-navigable semantic relationship layer
```

---

# 302. Level 0

Anti-goal:

```text
one spreadsheet
with
customer + order + product + vendor
in same row.
```

---

# 303. Level 1

Build:

```text
PRODUCT → SKU
ORDER → ORDER ITEM
PRODUCTION JOB → WORK ORDER
```

---

# 304. Level 2

Add:

```text
CREATOR PRODUCT RELATIONSHIP
PROGRAM ENROLLMENT
CONTACT ROLE
SEGMENT MEMBERSHIP
```

---

# 305. Level 3

Add:

```text
BRAND
LABEL
BUSINESS UNIT SCOPING
PORTAL ROOT SCOPES
```

---

# 306. Level 4

Add enterprise shared identity and cross-unit relationships.

---

# 307. Level 5

Jarvis can navigate:

```text
ENTITY
RELATIONSHIP
EVENT
CONTEXT
```

as semantic operating graph.

---

# 308. Current Recommended Stage

TeeStock should target:

```text
LEVEL 1
→
LEVEL 2
```

while designing for Level 3.

---

# 309. V1 Mandatory Hierarchies

Implement first:

```text
ORGANIZATION
→ BUSINESS UNIT

PRODUCT
→ VARIANT
→ SKU

ORDER
→ ORDER ITEM

PRODUCTION JOB
→ WORK ORDER

ARTWORK
→ ARTWORK VERSION

QUOTE
→ QUOTE LINE

PURCHASE ORDER
→ PURCHASE ORDER LINE
```

---

# 310. V1 Mandatory Relationship Entities

Implement where applicable:

```text
CONTACT ROLE
PROGRAM ENROLLMENT
CREATOR PRODUCT RELATIONSHIP
EXTERNAL OBJECT MAPPING
```

---

# 311. V1 Important Associations

```text
ORDER ↔ PAYMENT
ORDER ↔ SHIPMENT
ORDER ↔ RETURN
PRODUCT ↔ COLLECTION
PRODUCT ↔ CREATOR
WORK ORDER ↔ PARTNER
```

---

# 312. V1 Avoid

Do not immediately implement:

```text
DEEP WAREHOUSE LOCATION TREES
GENERIC GRAPH DATABASE
10-LEVEL CATEGORY TREE
COMPLEX TENANT INHERITANCE
UNIVERSAL PARENT_ID FOR EVERYTHING
```

---

# 313. Universal Parent ID Anti-Pattern

Avoid generic:

```text
entity.parent_id
```

across unrelated entity types.

Explicit relationships are safer.

---

# 314. Polymorphic Relationship

Can be useful selectively.

Examples:

```text
TASK TARGET
COST OBJECT
EVENT SUBJECT
```

---

# 315. Polymorphic Relationship Risk

Can weaken referential integrity.

Use only where domain truly needs multiple target types.

---

# 316. Recommended Polymorphic Uses

Potential:

```text
Task.subject
Event.subject
CostEntry.cost_object
File.attachment_target
```

with strong validation.

---

# 317. Avoid Polymorphism for Core Ownership

Do not model:

```text
Product.parent = anything
```

---

# 318. Hierarchy and API Design

Nested routes may reflect strict ownership.

Example:

```text
/orders/{order_id}/items
```

---

# 319. Independent Entities Use Top-Level Routes

Example:

```text
/products/{product_id}
```

---

# 320. API Nesting Should Stay Shallow

Avoid deeply nested URLs mirroring entire hierarchy.

---

# 321. Hierarchy and Search

Global search returns entity independently.

Context page shows parents/relationships.

---

# 322. Hierarchy and Authorization

Authorization may evaluate:

```text
USER
→ ROLE
→ ROOT SCOPE
→ TARGET ENTITY
```

---

# 323. Example Creator Authorization

```text
User
→ Creator Membership
→ Creator
→ Artwork / Earnings
```

---

# 324. Example Partner Authorization

```text
User
→ Partner Membership
→ Partner
→ Work Orders
```

---

# 325. Example Business Client Authorization

```text
User
→ Organization Membership
→ Organization Account
→ Quotes / Orders
```

---

# 326. Internal Access

Employee/operator scope may be:

```text
BUSINESS UNIT
+
FUNCTION
```

---

# 327. Hierarchy and Audit

Audit record should know:

```text
TARGET ENTITY
PARENT CONTEXT
ACTOR
```

where useful.

---

# 328. Hierarchy and Files

Files should attach to canonical object.

Example:

```text
Artwork Version
→ Source File

Work Order
→ Production File

Claim
→ Evidence
```

---

# 329. Avoid Folder-as-Relationship

Canonical:

> **A file being inside a folder does not establish canonical business relationship.**

---

# 330. Hierarchy and Documents

Generated document references source entity.

Example:

```text
Quote
→ Quote PDF

Work Order
→ Work Order PDF
```

---

# 331. Hierarchy and Notifications

Notification should reference relevant canonical object.

---

# 332. Hierarchy and Exceptions

Exception should identify:

```text
PRIMARY SUBJECT
RELATED OBJECTS
```

---

# 333. Hierarchy and Approvals

Approval should target exact canonical object/action.

---

# 334. Hierarchy and AI

Agents should receive relationship context via governed retrieval.

---

# 335. Example

Customer Ops Agent retrieving Order should also receive:

```text
CUSTOMER
PAYMENT
SHIPMENT
RETURN
CASE
```

as needed.

---

# 336. Do Not Give AI Entire Graph by Default

Retrieve only relevant neighborhood.

---

# 337. Semantic Neighborhood

Canonical concept:

```text
ENTITY
+
DIRECT RELEVANT RELATIONSHIPS
+
RECENT EVENTS
```

---

# 338. Jarvis Entity Navigation

Future Jarvis request:

> “Kenapa order ORD-123 telat?”

System should navigate:

```text
ORDER
→ ORDER ITEM
→ PRODUCTION JOB
→ WORK ORDER
→ PARTNER
→ BLOCKER / EVENT
```

---

# 339. Jarvis Cross-Domain Question

Example:

> “Berapa margin produk creator X bulan ini?”

Navigate:

```text
CREATOR
→ CREATOR PRODUCT RELATIONSHIP
→ PRODUCTS
→ ORDER ITEMS
→ COST ENTRIES
→ CONTRIBUTION
```

---

# 340. Entity Hierarchy Enables Reasoning

Without consistent relationships, AI becomes dependent on fuzzy text matching.

---

# 341. Hierarchy Success Definition

The hierarchy succeeds when TeeStock can answer:

```text
WHAT
is the parent of this entity?

DOES THIS CHILD
depend on the parent?

WHO
owns this object?

WHICH DOMAIN
may mutate it?

WHAT ENTITIES
are merely related?

CAN ONE ENTITY
have multiple roles?

CAN ONE PRODUCT
belong to multiple collections?

CAN ONE ORDER
have multiple shipments?

CAN ONE PRODUCTION JOB
have multiple Work Orders?

CAN ONE CREATOR
participate in multiple Programs?

CAN ONE PARTNER
provide multiple Capabilities?

CAN MGBOS
navigate the relationship without guessing?
```

---

# 342. Canonical Hierarchy Summary

```text
ORGANIZATION
owns Business Units.

BUSINESS UNIT
owns operating business context.

BRAND / LABEL
own market identity.

PRODUCT
owns standardized product structure.

ORDER
owns transaction lines.

PROJECT
organizes coordinated work.

PRODUCTION JOB
owns production requirement.

WORK ORDER
owns execution instruction.

CREATOR
owns creator relationship context.

PARTNER
owns partner relationship context.

RELATIONSHIP ENTITIES
connect independent objects.

EVENTS
describe what happened.

MGBOS
navigates all of them through explicit relationships.
```

---

# 343. Canonical Entity Hierarchy Principles

```text
HIERARCHY DEFINES OWNERSHIP. RELATIONSHIPS DEFINE REALITY.

DO NOT FORCE EVERYTHING INTO ONE TREE.

A PERSON CAN HAVE MANY ROLES.

A PRODUCT CAN HAVE MANY RELATIONSHIPS WITHOUT MULTIPLE IDENTITIES.

STRICT CHILDREN REQUIRE VALID PARENTS.

INDEPENDENT ENTITIES SHOULD REMAIN INDEPENDENT.

IF A RELATIONSHIP HAS ECONOMICS OR LIFECYCLE, MODEL IT.

DOMAIN OWNERSHIP CONTROLS WRITES.

CROSS-DOMAIN READS SHOULD REFERENCE CANONICAL IDS.

SCOPE IS NOT THE SAME AS HIERARCHY.

CURRENT STRUCTURE MUST NOT REWRITE HISTORICAL CONTEXT.

ARCHIVE BEFORE CASCADE DELETE.

VIEWS DO NOT CREATE NEW SOURCES OF TRUTH.

EXPLICIT RELATIONSHIPS BEFORE NAMING CONVENTION INFERENCE.

CORE TREES PLUS A RELATIONSHIP GRAPH.

MGBOS SHOULD NEVER NEED TO GUESS HOW ENTITIES CONNECT.
```

---

# 344. Dependency

Dokumen berikut harus follow Entity Hierarchy:

1. [[bisnis/teestock/11-data-mgbos/sku-and-id-convention|sku-and-id-convention.md]]
2. [[bisnis/teestock/11-data-mgbos/event-model|event-model.md]]
3. [[bisnis/teestock/11-data-mgbos/mgbos-integration|mgbos-integration.md]]
4. [[bisnis/teestock/11-data-mgbos/analytics-model|analytics-model.md]]
5. [[bisnis/teestock/12-legal-ip/ip-policy|ip-policy.md]]
6. [[bisnis/teestock/13-metrics-experiments/kpi-framework|kpi-framework.md]]
7. [[bisnis/teestock/13-metrics-experiments/decision-thresholds|decision-thresholds.md]]
8. [[bisnis/teestock/14-roadmap/master-roadmap|master-roadmap.md]]
9. [[bisnis/teestock/14-roadmap/capability-roadmap|capability-roadmap.md]]

TeeStock Entity Hierarchy boleh berkembang menjadi cross-business, multi-brand, multi-portal, dan AI-navigable enterprise relationship graph untuk MultiGraph Group, tetapi setiap expansion harus menjaga explicit ownership, bounded scope, stable identity, valid cardinality, historical lineage, dan separation yang tegas antara hierarchy, association, classification, view, dan event.