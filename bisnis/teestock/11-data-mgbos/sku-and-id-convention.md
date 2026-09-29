---
title: "TeeStock SKU & ID Convention"
date: "2026-09-28"
bisnis: teestock
kategori: operasional
status: active
tags:
  - bisnis/teestock
  - kategori/operasional
  - teestock/canonical
  - teestock/data-mgbos
document_id: "TS-DAT-003"
version: "1.0"
category: "data-mgbos"
business: "teestock"
last_updated: "2026-09-28"
path: "11-data-mgbos/sku-and-id-convention.md"
depends_on:
  - "TS-DAT-001"
  - "TS-DAT-002"
  - "TS-COM-005"
  - "TS-TEC-003"
  - "TS-TEC-004"
  - "TS-TEC-005"
---


# TeeStock SKU & ID Convention v1.0

> [!abstract] **Canonical TeeStock Identifier, SKU, Business Number & External Reference Framework  **
> Dokumen ini mendefinisikan internal IDs, human-readable business numbers, SKU conventions, entity prefixes, sequences, version identifiers, external system mappings, barcode readiness, environment separation, archival behavior, collision prevention, and identifier governance untuk TeeStock dan future MultiGraph Business OS.
>
> [!info] **Dependencies & Data Flow (SSOT)**
> [[bisnis/teestock/11-data-mgbos/canonical-data-model|TS-DAT-001: TeeStock Canonical Data Model]] • [[bisnis/teestock/11-data-mgbos/entity-hierarchy|TS-DAT-002: TeeStock Entity Hierarchy]] • [[bisnis/teestock/03-commerce/product-taxonomy|TS-COM-005: TeeStock Product Taxonomy]] • [[bisnis/teestock/10-product-tech/commerce-platform|TS-TEC-003: TeeStock Commerce Platform]] • [[bisnis/teestock/10-product-tech/creator-platform|TS-TEC-004: TeeStock Creator Platform]] • [[bisnis/teestock/10-product-tech/partner-platform|TS-TEC-005: TeeStock Partner Platform]]


---

# 1. Purpose

SKU & ID Convention menjawab:

> **Bagaimana TeeStock memberi identitas yang unik, stabil, mudah dilacak, aman untuk sistem, dan tetap valid meskipun product name, brand, channel, supplier, location, atau struktur bisnis berubah?**

Canonical principle:

> **Identity should survive change.**

---

# 2. Canonical Definition

> **TeeStock SKU & ID Convention adalah framework canonical yang memisahkan immutable machine identity, human-facing business references, product stock codes, external IDs, and version identifiers sehingga setiap entity dapat direferensikan secara konsisten tanpa menanamkan business assumptions yang mudah berubah ke dalam identifier.**

---

# 3. Four Identifier Classes

Canonical:

```text
01 INTERNAL ID
02 BUSINESS NUMBER
03 SKU / STOCK CODE
04 EXTERNAL REFERENCE
```

---

# 4. Internal ID

Purpose:

```text
MACHINE IDENTITY
```

Characteristics:

```text
IMMUTABLE
UNIQUE
NON-SEMANTIC
NOT CUSTOMER-FACING
```

---

# 5. Business Number

Purpose:

```text
HUMAN REFERENCE
```

Examples:

```text
ORD-2026-000123
QT-2026-000042
WO-2026-000581
```

---

# 6. SKU

Purpose:

```text
STANDARDIZED SELLABLE / STOCK UNIT REFERENCE
```

SKU is primarily operational/commercial.

---

# 7. External Reference

Purpose:

```text
MAP EXTERNAL SYSTEM OBJECT
TO
CANONICAL TEEStock OBJECT
```

---

# 8. Never Use One Identifier for Every Purpose

Canonical:

```text
INTERNAL ID
≠
BUSINESS NUMBER
≠
SKU
≠
EXTERNAL ID
```

---

# 9. Internal ID Principle

Internal IDs should avoid encoding:

```text
BRAND
YEAR
CATEGORY
LOCATION
PRICE
SUPPLIER
CHANNEL
```

unless there is a very strong technical reason.

---

# 10. Why Non-Semantic IDs

Because these properties can change.

Example:

```text
PRODUCT MOVES
from TeeStock Originals
to independent Label
```

Its identity should not change.

---

# 11. Recommended Internal ID

Implementation may use:

```text
UUID
ULID
UUIDv7
```

or equivalent globally unique identifier.

---

# 12. Preferred Direction

Canonical conceptual recommendation:

```text
TIME-SORTABLE UNIQUE ID
```

where implementation stack supports it reliably.

---

# 13. Human Users Should Rarely Type Internal IDs

Use business numbers/search.

---

# 14. Internal ID Example

Conceptually:

```text
01K5G8Q5R...
```

or UUID equivalent.

Exact storage format belongs to implementation.

---

# 15. ID Immutability

Once issued:

```text
DO NOT RENAME
DO NOT RECYCLE
DO NOT REUSE
```

---

# 16. Deleted / Archived Entity IDs

Remain permanently associated with historical record.

---

# 17. Never Reuse Old ID

Even if record archived.

---

# 18. Business Number Principle

Human-facing number should be:

```text
SHORT
RECOGNIZABLE
SEARCHABLE
UNIQUE ENOUGH
```

---

# 19. Business Number Format

Recommended general form:

```text
{PREFIX}-{YEAR}-{SEQUENCE}
```

Example:

```text
ORD-2026-000123
```

---

# 20. Year Is Display Context

Year may reset sequence if business accepts composite uniqueness.

---

# 21. Business Number Uniqueness

Full number must remain unique.

---

# 22. Business Number Does Not Replace Internal ID

Canonical.

---

# 23. Prefix Registry

Every major human-facing entity gets canonical prefix.

---

# 24. Enterprise Prefixes

Recommended:

```text
ORG   Organization
BU    Business Unit
BRD   Brand
LBL   Label
COL   Collection
PRG   Program
```

---

# 25. Identity Prefixes

Recommended:

```text
PER   Person
ACC   Organization Account
CUS   Customer
USR   User Account
```

---

# 26. Sales Prefixes

Recommended:

```text
LEAD  Lead
OPP   Opportunity
QT    Quote
PRJ   Project
ORD   Order
```

---

# 27. Product Prefixes

Recommended:

```text
PRD   Product
VAR   Variant
SKU   SKU reference namespace
DES   Design
ART   Artwork
MAT   Material
BOM   Bill of Materials
RCP   Production Recipe
```

---

# 28. Commerce Prefixes

Recommended:

```text
CAT   Catalog
PRM   Promotion
CRT   Cart if human reference needed
CHK   Checkout if needed
```

Most temporary objects do not require human-facing number.

---

# 29. Payment / Finance Prefixes

Recommended:

```text
PAY   Payment
INV   Customer Invoice
BILL  Partner/Supplier Invoice if needed
REC   Receivable
PBL   Payable
RFD   Refund
PYO   Payout
```

---

# 30. Operations Prefixes

Recommended:

```text
PJ    Production Job
WO    Work Order
CO    Change Order
QC    Quality Inspection
RWK   Rework
CLM   Claim
```

---

# 31. Procurement Prefixes

Recommended:

```text
PR    Purchase Request
PO    Purchase Order
GR    Goods Receipt
```

---

# 32. Inventory Prefixes

Recommended:

```text
LOC   Inventory Location
LOT   Inventory Lot
ITX   Inventory Transaction
```

---

# 33. Fulfillment Prefixes

Recommended:

```text
FUL   Fulfillment
SHP   Shipment
PKG   Package
RET   Return
```

---

# 34. Creator Prefixes

Recommended:

```text
CRT   Creator
ENR   Program Enrollment
AGR   Agreement
COLB  Collaboration
ERN   Earning
PYO   Payout
```

---

# 35. Potential Prefix Collision

`CRT` could mean Cart or Creator.

Canonical decision:

```text
CRE   Creator
CART  Cart if ever needed
```

Avoid ambiguous prefixes.

---

# 36. Creator Final Prefix

Use:

```text
CRE
```

---

# 37. Marketing Prefixes

Recommended:

```text
CMP   Campaign
CNT   Content Asset
PUB   Publication
SEG   Segment
REF   Referral
REV   Review
```

---

# 38. Automation Prefixes

Recommended:

```text
AUT   Automation
WFR   Workflow Run
JOB   Job
TSK   Task
APR   Approval
EXC   Exception
AGT   Agent
TOOL  Tool
SKL   Skill
MDL   Model
INT   Integration
EVT   Event
```

---

# 39. Prefix Governance

New prefix must be:

```text
UNAMBIGUOUS
DOCUMENTED
NON-DUPLICATE
STABLE
```

---

# 40. Prefix Length

Prefer:

```text
2–5 CHARACTERS
```

depending clarity.

Clarity > forced uniformity.

---

# 41. Sequence Length

Initial recommendation:

```text
6 DIGITS
```

Example:

```text
000001
```

---

# 42. Why Six Digits

Supports up to:

```text
999,999
```

records per sequence scope before expansion.

---

# 43. Sequence Scope

Recommended:

```text
PER ENTITY PREFIX
PER YEAR
```

for human-facing transactional numbers.

---

# 44. Example

```text
ORD-2026-000001
ORD-2026-000002
```

---

# 45. Year Reset

Allowed for:

```text
ORDER
QUOTE
WORK ORDER
PURCHASE ORDER
SHIPMENT
```

if full composite remains unique.

---

# 46. Do Not Reset Internal IDs

Only display/business sequences may reset.

---

# 47. Non-Transactional Master Numbers

Master objects may omit year.

Example:

```text
PRD-000142
CRE-000081
PRT-000029
```

---

# 48. Master vs Transaction Number

Recommended:

```text
MASTER ENTITY
{PREFIX}-{SEQUENCE}

TRANSACTION ENTITY
{PREFIX}-{YEAR}-{SEQUENCE}
```

---

# 49. Product Business Number

Example:

```text
PRD-000142
```

---

# 50. Creator Business Number

Example:

```text
CRE-000081
```

---

# 51. Partner Business Number

Recommended prefix:

```text
PTR
```

Example:

```text
PTR-000029
```

---

# 52. Customer Number

Optional.

Example:

```text
CUS-001248
```

---

# 53. Customer Number Gate

Only expose/maintain if operationally useful.

Internal ID alone may suffice early.

---

# 54. Product Identifier Layers

Canonical:

```text
PRODUCT ID
↓
VARIANT ID
↓
SKU
```

---

# 55. Product ID

Identifies commercial product concept.

---

# 56. Variant ID

Identifies standardized product variation.

---

# 57. SKU

Identifies stock/sellable operational unit.

---

# 58. SKU Principle

Canonical:

> **SKU may contain limited operational meaning, but should not encode unstable business history.**

---

# 59. Good SKU Encodings

May include stable dimensions such as:

```text
PRODUCT FAMILY CODE
COLOR CODE
SIZE CODE
```

if those codes are governed.

---

# 60. Bad SKU Encodings

Avoid embedding:

```text
SUPPLIER
COST
SELLING PRICE
YEAR OF LAUNCH
WAREHOUSE
MARKETING CHANNEL
CREATOR ROYALTY
```

---

# 61. Why Supplier Should Not Be in SKU

Supplier may change while SKU remains same.

---

# 62. Why Warehouse Should Not Be in SKU

Same SKU can exist in multiple locations.

---

# 63. Why Price Should Not Be in SKU

Price changes frequently.

---

# 64. Why Channel Should Not Be in SKU

Same SKU may sell through many channels.

---

# 65. Why Inventory Mode Should Not Be in SKU

Ready-stock/MTO strategy can change independently.

---

# 66. SKU Recommended Pattern

Canonical conceptual structure:

```text
{PRODUCT_CODE}-{COLOR_CODE}-{SIZE_CODE}
```

Example:

```text
TSBASIC01-BLK-M
```

---

# 67. Product Code

Short stable code assigned to Product/Product Platform.

Example:

```text
TSBASIC01
```

---

# 68. Product Code Must Not Depend on Product Name

Names may change.

---

# 69. Product Code Length

Recommended:

```text
6–12 CHARACTERS
```

depending category scale.

---

# 70. Product Code Registry

Codes must be centrally unique within SKU namespace.

---

# 71. Product Code Example

Potential:

```text
TSB001
TSS042
ORG015
```

But avoid over-encoding business line unless intentionally stable.

---

# 72. Preferred Product Code

Simpler:

```text
P000142
```

or controlled opaque short code.

---

# 73. Canonical Recommendation

For long-term resilience:

```text
SKU =
{PRODUCT_SHORT_CODE}-{COLOR}-{SIZE}
```

where Product Short Code is non-semantic/semi-semantic.

---

# 74. Example

```text
P0142-BLK-M
P0142-BLK-L
P0142-WHT-M
```

---

# 75. Why This Pattern

It stays stable if:

```text
PRODUCT NAME CHANGES
CREATOR CHANGES
COLLECTION CHANGES
CHANNEL CHANGES
```

---

# 76. Color Code

Use controlled vocabulary.

Examples:

```text
BLK
WHT
NVY
GRY
OLV
```

---

# 77. Color Code Registry

Must map canonical color value to code.

---

# 78. Custom Marketing Color

Frontend may display:

```text
Midnight Black
```

while operational code remains:

```text
BLK
```

if appropriate.

---

# 79. Size Codes

Recommended standard:

```text
XS
S
M
L
XL
2XL
3XL
```

---

# 80. Size Code Consistency

Do not alternate:

```text
XXL
2XL
```

for same canonical size.

Pick one.

---

# 81. Recommended Extended Size Format

Use:

```text
2XL
3XL
4XL
```

---

# 82. Numeric Sizes

Use actual canonical size:

```text
28
30
32
34
```

where product requires.

---

# 83. One Size

Recommended:

```text
OS
```

---

# 84. Non-Color Variant

SKU may use another stable option code.

Example:

```text
P0201-NAT-OS
```

---

# 85. Optional Variant Dimensions

Potential:

```text
FIT
LENGTH
STYLE
```

only where truly necessary.

---

# 86. Avoid Overlong SKU

Anti-pattern:

```text
TEE-STOCK-ESSENTIALS-OVERSIZED-COTTON-240GSM-BLACK-MEDIUM-2026
```

---

# 87. SKU Human Usability

Warehouse/operator should be able to:

```text
READ
TYPE
SEARCH
SCAN
```

reasonably.

---

# 88. SKU Character Set

Recommended:

```text
A-Z
0-9
-
```

---

# 89. Avoid SKU Characters

Avoid:

```text
spaces
/
\
#
&
?
non-ASCII symbols
```

for interoperability.

---

# 90. SKU Case

Canonical:

```text
UPPERCASE
```

---

# 91. SKU Immutability

Once used in transactions:

```text
DO NOT CHANGE
```

unless exceptional migration process exists.

---

# 92. Product Name Change

Does not change SKU.

---

# 93. Variant Label Change

Should usually not change SKU if underlying item remains same.

---

# 94. Material Change

If material/specification creates materially different inventory item:

new SKU may be required.

---

# 95. Fit Change

If customer/warehouse must distinguish old vs new physical product:

new SKU.

---

# 96. Design Change

Materially different sellable design usually requires:

```text
NEW PRODUCT
or
NEW SKU
```

depending taxonomy.

---

# 97. SKU Change Gate

Create new SKU when physical/commercial identity must remain distinguishable in:

```text
INVENTORY
FULFILLMENT
RETURNS
COST
QUALITY
```

---

# 98. SKU Versioning

Do not append:

```text
V2
V3
```

casually unless version represents distinct stock identity.

---

# 99. Product Revision

Can use Product Revision/Recipe/BOM version without changing SKU if sellable item remains operationally identical.

---

# 100. SKU Retirement

Status:

```text
ACTIVE
PAUSED
DISCONTINUED
ARCHIVED
```

---

# 101. Retired SKU Never Reused

Canonical.

---

# 102. Barcode Readiness

SKU and barcode are separate concepts.

---

# 103. Barcode

Potential:

```text
EAN / UPC / GS1 identifiers
```

later if retail/channel requirements justify.

---

# 104. Barcode ≠ SKU

Canonical.

---

# 105. One SKU Can Have Barcode

Mapping:

```text
SKU
↔
BARCODE
```

---

# 106. Internal Barcode

For warehouse purposes, TeeStock may encode internal SKU/business ID into Code128/QR.

---

# 107. Retail Barcode

External retail standard should follow applicable issuance rules when adopted.

---

# 108. Do Not Invent Fake EAN/UPC

Canonical.

---

# 109. QR Code

Useful for:

```text
WORK ORDER
PACKAGE
LOCATION
PRODUCT INTERNAL TRACEABILITY
```

---

# 110. QR Payload

Prefer stable identifier/reference.

Not large mutable business payload.

---

# 111. Example

QR may resolve:

```text
WO-2026-000581
```

or secure URL referencing internal ID.

---

# 112. Product Code vs Barcode

Keep separate.

---

# 113. Order Number

Canonical format:

```text
ORD-{YYYY}-{NNNNNN}
```

Example:

```text
ORD-2026-000123
```

---

# 114. Quote Number

```text
QT-{YYYY}-{NNNNNN}
```

---

# 115. Project Number

```text
PRJ-{YYYY}-{NNNNNN}
```

---

# 116. Production Job Number

```text
PJ-{YYYY}-{NNNNNN}
```

---

# 117. Work Order Number

```text
WO-{YYYY}-{NNNNNN}
```

---

# 118. Purchase Request Number

```text
PR-{YYYY}-{NNNNNN}
```

---

# 119. Purchase Order Number

```text
PO-{YYYY}-{NNNNNN}
```

---

# 120. Goods Receipt Number

```text
GR-{YYYY}-{NNNNNN}
```

---

# 121. Shipment Number

```text
SHP-{YYYY}-{NNNNNN}
```

---

# 122. Return Number

```text
RET-{YYYY}-{NNNNNN}
```

---

# 123. Refund Number

```text
RFD-{YYYY}-{NNNNNN}
```

---

# 124. Claim Number

```text
CLM-{YYYY}-{NNNNNN}
```

---

# 125. Quality Inspection Number

```text
QC-{YYYY}-{NNNNNN}
```

---

# 126. Collaboration Number

```text
COLB-{YYYY}-{NNNNNN}
```

---

# 127. Campaign Number

Potential:

```text
CMP-{YYYY}-{NNNNNN}
```

if human reference useful.

---

# 128. Content Asset Number

Potential:

```text
CNT-{YYYY}-{NNNNNN}
```

---

# 129. Payout Number

```text
PYO-{YYYY}-{NNNNNN}
```

---

# 130. Payment Number

Internal human reference may be:

```text
PAY-{YYYY}-{NNNNNN}
```

while payment provider ID remains external reference.

---

# 131. Invoice Number

Invoice numbering may have legal/accounting requirements.

Therefore:

```text
INVOICE FORMAT
must be governed by Finance/Legal requirements.
```

Do not blindly reuse generic sequence if compliance dictates otherwise.

---

# 132. Agreement Number

Potential:

```text
AGR-{YYYY}-{NNNNNN}
```

---

# 133. Partner Number

```text
PTR-{NNNNNN}
```

---

# 134. Creator Number

```text
CRE-{NNNNNN}
```

---

# 135. Product Number

```text
PRD-{NNNNNN}
```

---

# 136. Material Number

```text
MAT-{NNNNNN}
```

---

# 137. Location Number

Potential:

```text
LOC-{NNNN}
```

if human-facing numbering needed.

---

# 138. Entity Number Generation

Generated centrally.

---

# 139. No Manual Number Selection

Operators should not invent:

```text
ORD-RIZKY-01
```

for canonical transactions.

---

# 140. Sequence Concurrency

Generator must prevent duplicate issuance during simultaneous transactions.

---

# 141. Gaps in Sequence

Canonical:

> **Gaps are preferable to duplicate IDs.**

Do not force dangerous sequence reuse just to avoid gaps.

---

# 142. Cancelled Object Number

Number remains consumed.

---

# 143. Failed Creation

Implementation may consume number.

This is acceptable if auditability requires.

---

# 144. Display Number Sorting

Zero-padded sequence supports natural sorting.

---

# 145. Time Zone

Year in business number should follow canonical business reporting timezone.

Initial:

```text
Asia/Jakarta
```

unless enterprise policy changes.

---

# 146. Midnight Edge Cases

Sequence/year generation must use one defined business timezone.

---

# 147. Version Identifiers

Canonical pattern:

```text
V1
V2
V3
```

or semantic document version:

```text
1.0
1.1
2.0
```

depending object.

---

# 148. Business Object Versions

For:

```text
QUOTE
WORK ORDER
AGREEMENT
ARTWORK
BOM
RECIPE
RATE CARD
```

versioning is important.

---

# 149. Version Is Not Entity ID

Example:

```text
QT-2026-000042
Version 3
```

Same Quote lineage.

---

# 150. Quote Display

Potential:

```text
QT-2026-000042-V3
```

for document/file display.

---

# 151. Internal Canonical Reference

Still:

```text
quote_id
+
version_number
```

---

# 152. Artwork Versions

Example:

```text
ART-000815-V4
```

for human/file reference.

---

# 153. Work Order Versions

Example:

```text
WO-2026-000581-V2
```

when formally revised.

---

# 154. Change Order Alternative

Instead of modifying Work Order version after issuance:

```text
CO-2026-000019
```

may govern change.

---

# 155. File Naming Convention

Recommended conceptual:

```text
{OBJECT_NUMBER}_{DOCUMENT_TYPE}_V{N}.{ext}
```

Example:

```text
WO-2026-000581_PRINT-FILE_V2.pdf
```

---

# 156. File Name Is Not Canonical Identity

Files still require internal File ID.

---

# 157. Avoid Filename as Database Key

Canonical.

---

# 158. External Object IDs

Every integration should preserve source IDs.

Example:

```text
integration = SHOPEE
external_order_id = 123456789
canonical_order_id = ...
```

---

# 159. External ID Namespace

External ID uniqueness is usually scoped to:

```text
INTEGRATION
+
EXTERNAL OBJECT TYPE
+
EXTERNAL ID
```

---

# 160. Never Assume External ID Globally Unique

Canonical.

---

# 161. External Object Mapping

Recommended logical fields:

```text
integration_id
external_object_type
external_object_id
canonical_entity_type
canonical_entity_id
```

---

# 162. Marketplace SKU

Channel may require its own SKU/listing code.

---

# 163. Marketplace SKU Strategy

Preferred:

```text
CANONICAL TEEStock SKU
```

where channel supports it.

---

# 164. Channel-Specific SKU

If platform constraints require different code:

store mapping.

---

# 165. Never Create Duplicate Canonical SKU for Channel

Canonical.

---

# 166. Supplier SKU

Preserve supplier's code separately.

---

# 167. Supplier SKU Mapping

```text
SUPPLIER ITEM CODE
↔
TEEStock MATERIAL / SKU
```

---

# 168. Carrier Tracking Number

External reference.

Not Shipment ID.

---

# 169. Payment Provider ID

External reference.

Not Payment canonical ID.

---

# 170. Accounting System ID

External mapping.

Not canonical identity.

---

# 171. CRM ID

If external CRM used later:

map to Person/Customer/Organization canonical IDs.

---

# 172. Identifier Boundary

Canonical IDs originate within TeeStock-owned canonical domain.

External platform IDs do not become primary keys.

---

# 173. Environment Separation

Critical:

```text
DEVELOPMENT
STAGING
PRODUCTION
```

must never accidentally collide operationally.

---

# 174. Internal IDs

Globally unique IDs naturally reduce collision.

---

# 175. Human Business Numbers in Non-Production

Recommended prefixes:

```text
DEV-
STG-
```

where records might be visible externally or mixed during testing.

---

# 176. Example

```text
STG-ORD-2026-000012
```

---

# 177. Production

No environment prefix:

```text
ORD-2026-000123
```

---

# 178. Test Data Must Never Look Like Real Production Data Where Dangerous

Especially:

```text
INVOICE
PAYMENT
PAYOUT
SHIPMENT
```

---

# 179. Sandbox Payment References

Store provider sandbox environment explicitly.

---

# 180. Environment Is Metadata Too

Do not rely solely on number prefix for technical isolation.

---

# 181. Multi-Business-Unit IDs

Internal IDs remain enterprise-safe.

---

# 182. Human Numbers

Potentially may include BU prefix later if genuinely useful.

Example:

```text
TS-ORD-2026-000123
MG-ORD-2026-000456
```

---

# 183. Current TeeStock Recommendation

Do **not** add `TS-` everywhere yet unless shared enterprise numbering requires it.

---

# 184. Why

Avoid unnecessary verbosity:

```text
TS-ORD-2026-000123
```

vs:

```text
ORD-2026-000123
```

Business Unit exists as structured field.

---

# 185. Enterprise Numbering Gate

Add BU code only when:

```text
MULTIPLE BUSINESS UNITS
SHARE SAME OPERATIONAL INTERFACE
AND
NUMBER COLLISION / CONTEXT BECOMES REAL PROBLEM
```

---

# 186. Brand Should Not Be Embedded in Transaction ID

Order may contain multiple brand/label products later.

---

# 187. Label Should Not Be Embedded in SKU by Default

Label ownership can change.

---

# 188. Product Brand Context

Store as relationship/field.

Not derived from SKU string.

---

# 189. Category Should Not Be Parsed from SKU

Canonical.

---

# 190. Semantic SKU Trade-Off

Human-readable SKU is useful.

Over-semantic SKU is brittle.

---

# 191. Recommended Balance

Use only dimensions operators routinely need:

```text
PRODUCT SHORT CODE
COLOR
SIZE
```

---

# 192. Custom Product Configuration

Should not create random SKU such as:

```text
CUSTOM-BUDI-LOGO-KIRI-20PCS
```

---

# 193. Custom Configuration Identifier

Use transaction-specific:

```text
CFG-{internal short ref}
```

or internal ID if human reference needed.

---

# 194. Configuration Remains Linked to Order Item

---

# 195. Personalized Items

May share base SKU plus personalization configuration.

---

# 196. Example

```text
Base SKU:
P0142-BLK-M

Configuration:
Name = Rizky
Back Number = 17
```

---

# 197. Do Not Generate Infinite SKUs for Personalization

Canonical.

---

# 198. Bundle SKU

If bundle is repeatable inventory/commercial unit, it may receive SKU.

---

# 199. Virtual Bundle

If composed dynamically:

may remain Product/Bundle definition referencing component SKUs.

---

# 200. Kit Identifier

Potential future:

```text
KIT-xxxxx
```

only if inventory operation requires.

---

# 201. Lot Identifier

Recommended human number:

```text
LOT-{YYYYMMDD}-{SEQUENCE}
```

or:

```text
LOT-{YYYY}-{NNNNNN}
```

depending traceability need.

---

# 202. Batch Identifier

Production Batch may use:

```text
BAT-{YYYY}-{NNNNNN}
```

---

# 203. Lot vs Batch

Canonical:

```text
LOT
inventory/material traceability.

BATCH
production execution grouping.
```

Do not use interchangeably.

---

# 204. Inventory Transaction Number

Usually internal ID sufficient.

Human-facing `ITX` number only if audit/operations requires.

---

# 205. Event ID

Use globally unique internal ID.

Do not issue human sequential number.

---

# 206. Workflow Run ID

Globally unique machine ID preferred.

---

# 207. Agent Run ID

Globally unique machine ID.

---

# 208. Approval Number

Human reference may be:

```text
APR-2026-000123
```

if approval operations require search/reference.

---

# 209. Exception Number

Potential:

```text
EXC-2026-000123
```

useful in control center.

---

# 210. Task Number

Not required for every internal task.

Internal ID sufficient unless human workflow benefits.

---

# 211. Case Number

Customer Service should have human-readable case ID:

```text
CASE-2026-000123
```

---

# 212. Support Case Prefix

Recommended:

```text
CASE
```

rather than ambiguous `CS`.

---

# 213. Case Number Should Be Customer-Friendly

Example:

```text
CASE-2026-001245
```

---

# 214. Identifier Search

MGBOS global search should understand:

```text
ORD-...
WO-...
PRD-...
SKU
EXTERNAL ORDER ID
TRACKING NUMBER
```

---

# 215. Search Normalization

Potential:

```text
case insensitive
strip harmless spaces
```

but never alter canonical stored code.

---

# 216. Prefix-Aware Search

MGBOS can route:

```text
ORD-
→ Orders

WO-
→ Work Orders

PRD-
→ Products
```

---

# 217. QR / Scanner Workflow

Scanner input may immediately open entity context.

---

# 218. Example Warehouse Scan

```text
SKU barcode
→ Product / Inventory
```

---

# 219. Work Order Scan

```text
WO code
→ Work Order execution page
```

---

# 220. Package Scan

```text
PKG code
→ Package / Shipment
```

---

# 221. Identifier Validation

Every code format should have deterministic validator.

---

# 222. Example

Order regex conceptually:

```text
^ORD-[0-9]{4}-[0-9]{6}$
```

Implementation detail may evolve.

---

# 223. SKU Validator

Allowed pattern conceptually:

```text
A-Z0-9-
```

with defined max length.

---

# 224. SKU Maximum Length

Recommended early maximum:

```text
32 CHARACTERS
```

to preserve channel compatibility.

---

# 225. Business Number Maximum Length

Prefer under:

```text
24 CHARACTERS
```

where possible.

---

# 226. External Platform Constraints

Some channels may impose shorter SKU limits.

Canonical SKU should be chosen with common interoperability in mind.

---

# 227. Identifier Registry

MGBOS should eventually maintain canonical registry:

```text
ENTITY TYPE
PREFIX
FORMAT
SEQUENCE SCOPE
HUMAN-FACING?
IMMUTABLE?
```

---

# 228. Example Registry

```text
Order
Prefix: ORD
Format: ORD-YYYY-NNNNNN
Human-facing: Yes
Immutable: Yes
```

---

# 229. SKU Registry

Potential:

```text
SKU
Product ID
Variant
Status
Barcode
External Mappings
```

---

# 230. Prefix Change

Once used in production, avoid changing.

---

# 231. If Prefix Must Change

Historical numbers remain unchanged.

New records may adopt new prefix through governed migration.

---

# 232. Identifier Migration

Never silently rewrite foreign references.

---

# 233. Alias

If business number changes exceptionally, preserve old alias for lookup.

---

# 234. Canonical ID Remains Same

Alias affects human reference only.

---

# 235. Entity Merge

When duplicates merged:

```text
SURVIVING CANONICAL ID
+
MERGED ID ALIAS / REDIRECT
```

---

# 236. Entity Split

Requires new IDs for new independent entities.

---

# 237. Product Split Example

One old Product becomes two materially distinct products.

New canonical Product IDs required.

---

# 238. Business Number Reservation

Optional for offline/pre-generated document flows.

---

# 239. Reservation Must Expire or Resolve

Avoid large meaningless gaps if possible, but uniqueness > gaplessness.

---

# 240. Offline Number Generation

Avoid unless real operational requirement exists.

Central issuance preferred.

---

# 241. Distributed ID Generation

Internal unique IDs can be distributed.

Human sequences usually better centralized.

---

# 242. Sequence Service

Future common capability can issue business numbers.

---

# 243. Sequence Service Responsibilities

```text
PREFIX
SCOPE
YEAR
NEXT NUMBER
UNIQUENESS
```

---

# 244. Sequence Service Must Be Transaction-Safe

Canonical.

---

# 245. ID Generation in n8n

n8n should not maintain production sequence using workflow-local counters.

---

# 246. Why

Concurrent workflow runs can collide.

Sequence belongs to canonical application/database service.

---

# 247. ID Generation in AI

Never.

AI may request entity creation.

System generates ID.

---

# 248. AI Must Not Invent Canonical IDs

Canonical.

---

# 249. AI References Existing IDs

Agent responses/actions should carry actual retrieved IDs.

---

# 250. Document IDs

Canonical documentation uses separate format:

```text
TS-{DOMAIN}-{NNN}
```

Examples:

```text
TS-DAT-003
TS-TEC-006
```

---

# 251. Documentation IDs ≠ MGBOS Entity IDs

They identify canonical business documents.

---

# 252. Document Domain Codes

Current:

```text
FND
STR
BRD
COM
SVC
ORG
PRG
OPS
FIN
MKT
TEC
DAT
```

Additional:

```text
LEG
MET
RDM
```

may be used for later folders.

---

# 253. Document ID Immutability

Once canonical document ID assigned:

do not reuse.

---

# 254. Document Version

Separate:

```text
TS-DAT-003
Version 1.0
```

---

# 255. Workflow IDs

Recommended canonical logical ID:

```text
AUT-{DOMAIN}-{NNN}
```

Example:

```text
AUT-ORD-001
```

---

# 256. Workflow Runtime Version

Example:

```text
AUT-ORD-001
v3
```

---

# 257. Agent IDs

Recommended:

```text
AGT-{ROLE}-{NNN}
```

Examples:

```text
AGT-SALES-001
AGT-CONTENT-001
AGT-FINANCE-001
```

---

# 258. Tool IDs

Recommended:

```text
TL-{DOMAIN}-{ACTION}
```

Examples:

```text
TL-ORDER-READ
TL-TASK-CREATE
TL-REFUND-REQUEST
```

---

# 259. Skill IDs

Recommended:

```text
SKL-{DOMAIN}-{ACTION}
```

Example:

```text
SKL-SALES-QUALIFY-LEAD
```

---

# 260. Model Registry IDs

Recommended:

```text
MDL-{PROVIDER_OR_CLASS}-{NNN}
```

or opaque registry IDs.

Do not hardcode vendor names into agent identity.

---

# 261. Identifier and Security

Identifiers are not secrets.

---

# 262. Do Not Use “Hard-to-Guess ID” as Authorization

Canonical.

---

# 263. Public IDs

If exposing record IDs publicly, random/non-sequential identifiers may reduce enumeration risk.

Authorization remains mandatory.

---

# 264. Business Numbers May Be Sequential

But API/security must still enforce access.

---

# 265. Public Order Tracking

Should require additional verification/token.

Not order number alone.

---

# 266. Sensitive IDs

Government IDs, bank accounts, tax identifiers are attributes/external legal identifiers.

They must not become TeeStock canonical IDs.

---

# 267. Data Privacy

Human-readable business numbers should not contain:

```text
CUSTOMER NAME
PHONE
EMAIL
DATE OF BIRTH
```

---

# 268. Example Bad ID

```text
ORD-RIZKY-0812345678-001
```

Never.

---

# 269. Identifier Logging

Safe canonical IDs/business numbers can be logged.

Sensitive external identifiers may require masking depending type.

---

# 270. Identifier and Analytics

Analytics joins should use internal canonical IDs.

---

# 271. Do Not Join on Names

Canonical.

---

# 272. Do Not Join on SKU When Entity Is Product

Use Product ID for product-level joins.

SKU only for stock-unit context.

---

# 273. Historical SKU

Archived SKU remains available for historical joins.

---

# 274. Identifier and Data Warehouse

Warehouse dimensions should preserve canonical IDs.

---

# 275. Surrogate Analytical Keys

May exist internally in warehouse.

They do not replace canonical operational ID.

---

# 276. Identifier and Multi-Tenancy

Portal access should scope by canonical entity relationship.

Not by parsing ID prefixes.

---

# 277. Example

`CRE-000081` does not itself authorize Creator 81.

User membership does.

---

# 278. Identifier and Brand Independence

If Label spins out:

```text
PRODUCT INTERNAL ID
remains stable.
```

Human product number can also remain stable.

---

# 279. SKU During Brand Spin-Out

Prefer retaining SKU unless physical stock identity truly changes.

---

# 280. Channel Replatforming

Canonical IDs/SKUs stay stable.

Only external mappings change.

---

# 281. Supplier Change

Canonical SKU remains stable.

Supplier Item mapping changes.

---

# 282. Warehouse Change

Canonical SKU remains stable.

Inventory Location relationship changes.

---

# 283. Price Change

Canonical SKU remains stable.

Price record changes.

---

# 284. Packaging Change

If sellable/stock identity materially changes, evaluate new SKU.

Otherwise BOM/packaging version change.

---

# 285. Minor Artwork File Fix

May create new Artwork Version without Product/SKU change.

---

# 286. Materially Different Artwork

May require new Product/SKU.

Use Product Governance.

---

# 287. Identifier Decision Framework

When deciding new ID:

```text
IS THIS A NEW BUSINESS OBJECT?
```

If yes → new Entity ID.

---

# 288. SKU Decision Framework

Ask:

```text
MUST INVENTORY / FULFILLMENT / RETURNS / COST
DISTINGUISH THIS ITEM FROM THE OLD ONE?
```

If yes → new SKU.

---

# 289. Version Decision Framework

Ask:

```text
IS THIS THE SAME BUSINESS OBJECT
WITH A NEW REVISION?
```

If yes → version.

---

# 290. Relationship Decision Framework

Ask:

```text
IS THE OBJECT THE SAME
BUT ITS RELATIONSHIP CHANGED?
```

If yes → update/new relationship record.

Do not change ID.

---

# 291. Identifier Failure Modes

## Name as ID

Breaks on rename.

## Supplier Code as SKU

Creates supplier lock-in.

## Year in Internal ID

Creates unnecessary semantics.

## Channel in Product ID

Breaks multi-channel commerce.

## Creator Name in SKU

Breaks creator/brand changes.

## Price in SKU

Immediately becomes stale.

## Manual Numbering

Collision risk.

---

# 292. SKU Failure Modes

## Infinite SKU Explosion

Personalization/custom configuration becomes unmanageable.

## SKU Changes Every Rebrand

History fragmentation.

## SKU Too Long

Channel/scanner friction.

## Same SKU for Physically Different Items

Inventory and return errors.

## Different SKU per Marketplace

Channel fragmentation.

---

# 293. Business Number Failure Modes

## Reusing Cancelled Numbers

Audit problems.

## Editing Historical Number

Broken references.

## Multiple Independent Sequence Generators

Collision.

## Meaning Overload

Business changes break numbering logic.

---

# 294. What Identifier System Must Not Become

## Encoded Database

Identifier should not replace structured fields.

## Secret Authorization Token

IDs are references, not permissions.

## Branding Exercise

SKU is operational infrastructure.

## Perfectly Gapless Sequence Obsession

Reliability matters more.

## Human Memory Dependency

Search and canonical IDs should carry the system.

---

# 295. V1 Identifier Requirements

Implement immediately:

```text
IMMUTABLE INTERNAL ID
BUSINESS NUMBER
SKU
EXTERNAL ID MAPPING
VERSION
```

where applicable.

---

# 296. V1 Business Numbers

Required first:

```text
ORD
QT
PRJ
PJ
WO
PO
GR
SHP
RET
CASE
CRE
PTR
PRD
```

---

# 297. V1 SKU Pattern

Recommended:

```text
{PRODUCT_SHORT_CODE}-{COLOR_CODE}-{SIZE_CODE}
```

Example:

```text
P0142-BLK-M
```

---

# 298. V1 Product Short Code

Recommended generated format:

```text
P0001
P0002
...
```

Scale width can be increased.

---

# 299. Preferred Practical Format

To allow larger catalog:

```text
P000001
```

Then:

```text
P000142-BLK-M
```

---

# 300. Product Short Code vs Product Number

Possible mapping:

```text
Product Business Number:
PRD-000142

SKU Product Short Code:
P000142
```

---

# 301. Why Both

Human product reference remains explicit.

SKU stays compact.

---

# 302. V1 Color Registry

Create small controlled list only for active colors.

---

# 303. V1 Size Registry

Create canonical size codes.

---

# 304. V1 External Mapping

Required for:

```text
MARKETPLACE
PAYMENT
LOGISTICS
```

when integrations are activated.

---

# 305. V1 Versioning

Required for:

```text
QUOTE
ARTWORK
WORK ORDER
AGREEMENT
BOM / RECIPE
```

as applicable.

---

# 306. V1 Avoid

Do not immediately build:

```text
GS1 PROGRAM
GLOBAL MULTI-BU NUMBERING SERVICE
COMPLEX SMART SKU ENGINE
RFID
SERIALIZATION OF EVERY UNIT
```

---

# 307. V2 Expansion

Possible:

```text
BARCODES
LOT / BATCH IDs
CENTRAL SEQUENCE SERVICE
QR OPERATIONAL SCANNING
```

---

# 308. V3 Expansion

Possible:

```text
MULTI-WAREHOUSE SCANNING
SERIALIZATION FOR SPECIAL PRODUCTS
ENTERPRISE-WIDE ID REGISTRY
```

---

# 309. V4 Expansion

Possible:

```text
RFID
ADVANCED TRACEABILITY
AUTOMATED PACK / QC SCANNING
```

only if economics justify.

---

# 310. Identifier Governance

Owner:

```text
DATA / MGBOS DOMAIN
```

with business-domain consultation.

---

# 311. SKU Governance

Owner:

```text
PRODUCT / INVENTORY
```

within canonical Data standards.

---

# 312. Prefix Governance

Central.

No domain creates prefix ad hoc.

---

# 313. Sequence Governance

Central implementation service/database.

---

# 314. External Mapping Governance

Owning integration/domain maintains mapping.

---

# 315. Barcode Governance

Product/Inventory owns internal barcode assignment.

External retail standards follow legal/channel requirements.

---

# 316. Identifier Change Request

Material convention changes should document:

```text
REASON
AFFECTED ENTITIES
MIGRATION
BACKWARD COMPATIBILITY
```

---

# 317. Canonical Identifier Registry

Future MGBOS should answer:

```text
What prefix belongs to Order?
What is the SKU format?
Is this ID production or staging?
What external IDs map to this object?
Has this identifier ever been aliased?
```

---

# 318. MGBOS Global Search

Should resolve:

```text
INTERNAL ID
BUSINESS NUMBER
SKU
BARCODE
EXTERNAL ID
TRACKING NUMBER
ALIASES
```

subject to permissions.

---

# 319. Jarvis Identifier Resolution

User may say:

> cek order 123

Jarvis should search/resolve canonical Order, not guess arbitrary entity.

---

# 320. Ambiguous Reference

If several objects match a short reference:

system should disambiguate safely.

---

# 321. Jarvis Should Prefer Canonical IDs Internally

Even when conversation uses human business numbers.

---

# 322. Tool Invocation

Canonical tool calls should use:

```text
canonical internal ID
```

after resolving human reference.

---

# 323. Example

Human:

```text
ORD-2026-000123
```

Jarvis resolves:

```text
order_id = <immutable internal ID>
```

then tools act on it.

---

# 324. Why

Business number is display reference.

Internal ID is unambiguous machine reference.

---

# 325. Identifier Success Definition

The convention succeeds when TeeStock can answer:

```text
IS THIS
the same business object?

CAN THIS ID
survive a rename?

CAN THIS SKU
survive a supplier change?

CAN AN ORDER
be found by its human reference?

CAN AN EXTERNAL ORDER
map to one canonical Order?

CAN A SCANNER
identify this SKU?

CAN A WORK ORDER
be referenced without ambiguity?

CAN HISTORICAL RECORDS
retain their identifiers forever?

CAN MGBOS
search across internal and external references?

CAN JARVIS
resolve a human reference into exact canonical object?
```

---

# 326. Canonical Identifier Summary

```text
INTERNAL ID
provides immutable machine identity.

BUSINESS NUMBER
provides human reference.

SKU
provides operational stock identity.

BARCODE
provides scannable identity.

EXTERNAL ID
maps external platforms.

VERSION
preserves revisions.

MGBOS
resolves all references back to canonical entities.
```

---

# 327. Canonical SKU & ID Principles

```text
IDENTITY SHOULD SURVIVE CHANGE.

INTERNAL IDS SHOULD BE IMMUTABLE AND NON-SEMANTIC.

BUSINESS NUMBERS ARE FOR HUMANS.

SKUS ARE FOR OPERATIONAL SELLABLE/STOCK IDENTITY.

BARCODES ARE NOT SKUS.

EXTERNAL IDS ARE NOT CANONICAL IDS.

NEVER REUSE IDENTIFIERS.

DO NOT ENCODE PRICE, SUPPLIER, CHANNEL, OR LOCATION INTO SKU.

USE STRUCTURED FIELDS INSTEAD OF PARSING IDENTIFIERS.

CUSTOMIZATION SHOULD NOT CREATE INFINITE SKU EXPLOSION.

A MATERIAL CHANGE IN STOCK IDENTITY MAY REQUIRE A NEW SKU.

A REVISION OF THE SAME OBJECT SHOULD USE VERSIONING.

SEQUENCES MUST BE CENTRALLY AND SAFELY GENERATED.

GAPS ARE BETTER THAN DUPLICATES.

PRODUCTION AND TEST IDENTIFIERS MUST BE CLEARLY SEPARATED.

AI MAY REFERENCE IDS. AI MUST NOT INVENT THEM.

MGBOS SHOULD RESOLVE EVERY HUMAN, MACHINE, AND EXTERNAL REFERENCE TO ONE CANONICAL OBJECT.
```

---

# 328. Dependency

Dokumen berikut harus follow SKU & ID Convention:

1. [[bisnis/teestock/11-data-mgbos/event-model|event-model.md]]
2. [[bisnis/teestock/11-data-mgbos/mgbos-integration|mgbos-integration.md]]
3. [[bisnis/teestock/11-data-mgbos/analytics-model|analytics-model.md]]
4. [[bisnis/teestock/12-legal-ip/ip-policy|ip-policy.md]]
5. [[bisnis/teestock/13-metrics-experiments/kpi-framework|kpi-framework.md]]
6. [[bisnis/teestock/13-metrics-experiments/decision-thresholds|decision-thresholds.md]]
7. [[bisnis/teestock/14-roadmap/master-roadmap|master-roadmap.md]]
8. [[bisnis/teestock/14-roadmap/capability-roadmap|capability-roadmap.md]]

TeeStock SKU & ID Convention boleh berkembang menjadi enterprise-wide identifier, barcode, lot, batch, serialized-unit, and multi-business-unit reference architecture untuk seluruh MultiGraph Group, tetapi identifier complexity hanya boleh bertambah ketika operational traceability, retail requirements, warehouse scale, atau cross-business coordination benar-benar membutuhkannya.