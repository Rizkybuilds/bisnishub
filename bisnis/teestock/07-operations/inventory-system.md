---
title: "TeeStock Inventory System"
date: "2026-09-28"
bisnis: teestock
kategori: operasional
status: active
tags:
  - bisnis/teestock
  - kategori/operasional
  - teestock/canonical
  - teestock/operations
document_id: "TS-OPS-005"
version: "1.0"
category: "operations"
business: "teestock"
last_updated: "2026-09-28"
path: "07-operations/inventory-system.md"
depends_on:
  - "TS-FND-001"
  - "TS-FND-002"
  - "TS-COM-003"
  - "TS-COM-005"
  - "TS-SVC-006"
  - "TS-SVC-007"
  - "TS-PRG-003"
  - "TS-PRG-004"
  - "TS-OPS-001"
  - "TS-OPS-002"
  - "TS-OPS-003"
  - "TS-OPS-004"
---


# TeeStock Inventory System v1.0

> [!tip] **Canonical TeeStock Inventory, Stock Ledger & Availability Framework  **
> Dokumen ini mendefinisikan inventory ownership, stock locations, inventory states, stock ledger, reservation, allocation, availability, inbound, WIP, finished goods, customer-owned stock, partner-held stock, stock count, adjustments, safety stock, reorder logic, dead stock, multi-channel availability, valuation linkage, dan progressive automation untuk seluruh ecosystem TeeStock.
>
> [!info] **Dependencies & Data Flow (SSOT)**
> [[bisnis/teestock/00-foundation/teestock-master-definition|TS-FND-001: TeeStock Master Definition]] • [[bisnis/teestock/00-foundation/glossary|TS-FND-002: TeeStock Glossary]] • [[bisnis/teestock/03-commerce/teestock-essentials|TS-COM-003: TeeStock Essentials]] • [[bisnis/teestock/03-commerce/product-taxonomy|TS-COM-005: TeeStock Product Taxonomy]] • [[bisnis/teestock/04-services/supply|TS-SVC-006: TeeStock Supply]] • [[bisnis/teestock/04-services/fulfill|TS-SVC-007: TeeStock Fulfill]] • [[bisnis/teestock/06-programs/reseller-program|TS-PRG-003: TeeStock Reseller Program]] • [[bisnis/teestock/06-programs/partner-program|TS-PRG-004: TeeStock Partner Program]] • [[bisnis/teestock/07-operations/operating-model|TS-OPS-001: TeeStock Operating Model]] • [[bisnis/teestock/07-operations/sourcing-and-vendors|TS-OPS-002: TeeStock Sourcing & Vendors]] • [[bisnis/teestock/07-operations/production-system|TS-OPS-003: TeeStock Production System]] • [[bisnis/teestock/07-operations/quality-control|TS-OPS-004: TeeStock Quality Control System]]


---

# 1. Purpose

Inventory System menjawab:

> **Apa yang TeeStock punya, siapa pemiliknya, ada di mana, berapa jumlah yang benar-benar bisa dijual atau digunakan, sudah dialokasikan ke apa, dan bagaimana setiap perubahan stok dapat ditelusuri?**

Canonical principle:

> **One physical truth. One auditable stock ledger.**

---

# 2. Canonical Definition

> **TeeStock Inventory System adalah operating framework yang mencatat, mengendalikan, dan menjelaskan seluruh stock position serta stock movement TeeStock berdasarkan SKU/material, ownership, location, state, quantity, dan transaction reference sehingga inventory dapat digunakan secara akurat untuk commerce, production, procurement, fulfillment, finance, dan MGBOS automation.**

---

# 3. Strategic Role

Inventory sits between:

```text id="inv001"
DEMAND
PROCUREMENT
PRODUCTION
FULFILLMENT
FINANCE
```

Kesalahan inventory akan menyebar ke seluruh sistem.

---

# 4. Core Inventory Philosophy

Canonical:

```text id="inv002"
PHYSICAL REALITY
↓
RECORDED MOVEMENT
↓
CANONICAL BALANCE
↓
OPERATIONAL AVAILABILITY
```

---

# 5. Inventory Is Not a Number Field

Inventory is not merely:

```text id="inv003"
SKU A = 24
```

Inventory must explain:

```text id="inv004"
24 WHAT?
OWNED BY WHOM?
WHERE?
IN WHAT CONDITION?
AVAILABLE FOR WHAT?
RESERVED FOR WHOM?
```

---

# 6. One Physical Truth

Canonical:

> **The same physical unit must not independently exist as different stock in Commerce, Custom, Supply, and Originals.**

Business lines consume from shared canonical inventory where appropriate.

---

# 7. Shared Garment Platform

Example:

```text id="inv005"
HEAVYWEIGHT TEE BLACK M
```

may support:

```text id="inv006"
ESSENTIALS
SELECTS
CUSTOM
MERCH
ORIGINALS
SUPPLY
```

without creating six physical inventories.

---

# 8. Physical Layer vs Commercial Layer

Critical distinction:

```text id="inv007"
PHYSICAL INVENTORY
what physically exists.

COMMERCIAL AVAILABILITY
what a business line/channel is allowed to sell.
```

---

# 9. Product Listing ≠ Inventory

A product may appear in many channels.

Inventory remains canonical.

---

# 10. Inventory Object

Canonical physical inventory is primarily tracked at:

```text id="inv008"
INVENTORY SKU
```

or equivalent material identifier.

---

# 11. Inventory SKU

Represents a specific stock-controlled physical item.

Example:

```text id="inv009"
Garment Platform
Heavyweight Tee

Color
Black

Size
M

=
Base Garment SKU
```

---

# 12. Base SKU vs Decorated SKU

Canonical distinction:

```text id="inv010"
BASE SKU
stock-controlled undecorated item.

DECORATED SKU
finished decorated product when stocked as finished goods.
```

---

# 13. Made-to-Order Product

A made-to-order graphic tee may not require finished decorated inventory.

Canonical:

```text id="inv011"
BASE GARMENT INVENTORY
+
PRODUCTION RECIPE
=
SELLABLE CONFIGURATION
```

---

# 14. Finished Goods Inventory

Used when completed product is intentionally stocked before order.

Examples:

- ready-stock Originals,
- proven Selects,
- finished Essentials.

---

# 15. Material Inventory

Production inputs can include:

```text id="inv012"
GARMENTS
FABRIC
LABELS
PACKAGING
TRIMS
CONSUMABLES
```

depending tracking value.

---

# 16. Tracking Granularity

Not every low-value consumable requires unit-level inventory.

Canonical:

> **Track at the level required for operational control, economics, and risk.**

---

# 17. Inventory Ownership

Every meaningful stock balance should identify:

```text id="inv013"
OWNER
```

---

# 18. Ownership Types

Potential:

```text id="inv014"
TEEStock OWNED
MULTIGRAPH OWNED
CUSTOMER OWNED
CREATOR / CLIENT OWNED
PARTNER OWNED
CONSIGNMENT
```

---

# 19. Ownership ≠ Location

Critical:

```text id="inv015"
WHO OWNS IT
≠
WHERE IT IS
```

TeeStock-owned stock can sit at partner facility.

Customer-owned stock can sit in TeeStock warehouse.

---

# 20. Custody

Canonical distinction:

```text id="inv016"
OWNER
has economic/legal ownership.

CUSTODIAN
physically holds the item.
```

---

# 21. Custody Visibility

Inventory held by:

- TeeStock,
- MultiGraph,
- Partner,
- Fulfillment Hub,

must remain visible if TeeStock is operationally accountable for it.

---

# 22. Inventory Location

Every stock balance belongs to:

```text id="inv017"
LOCATION
```

---

# 23. Location Hierarchy

Potential:

```text id="inv018"
FULFILLMENT HUB
↓
ZONE
↓
AISLE / RACK
↓
BIN
```

Use only detail justified by scale.

---

# 24. Early V1 Location Model

Initially may use:

```text id="inv019"
WAREHOUSE
PRODUCTION
PARTNER
QUARANTINE
```

with simple bins if needed.

---

# 25. Logical Location

Some states may use logical locations:

```text id="inv020"
IN_TRANSIT
QC_HOLD
PRODUCTION_WIP
```

where useful.

---

# 26. No Phantom Location

Location should correspond to real custody/operational meaning.

Avoid excessive virtual bins that confuse physical reality.

---

# 27. Inventory State

Location answers:

> Where is it?

State answers:

> What can we do with it?

---

# 28. Canonical Inventory States

Recommended:

```text id="inv021"
INBOUND
ON_HAND
AVAILABLE
RESERVED
ALLOCATED
ISSUED_TO_PRODUCTION
WIP
QC_HOLD
QUARANTINE
PICKED
PACKED
DAMAGED
RETURNED
IN_TRANSIT
```

Not every implementation must expose every state as a separate physical balance.

---

# 29. INBOUND

Purchased/expected inventory not yet accepted into stock.

---

# 30. ON_HAND

Physically present under tracked custody.

Canonical:

```text id="inv022"
ON_HAND
does not automatically mean
AVAILABLE.
```

---

# 31. AVAILABLE

Inventory currently eligible for new demand.

---

# 32. RESERVED

Stock committed against:

```text id="inv023"
ORDER
PRODUCTION JOB
PROJECT
```

but not yet physically consumed/picked.

---

# 33. ALLOCATED

Stronger operational assignment to a specific fulfillment/production requirement.

Exact distinction from Reserved should remain consistent in implementation.

---

# 34. ISSUED_TO_PRODUCTION

Material physically handed into production execution.

---

# 35. WIP

Material/product currently being transformed.

---

# 36. QC_HOLD

Finished/received item waiting on quality decision.

---

# 37. QUARANTINE

Inventory isolated because of unresolved:

- defect,
- identity,
- safety,
- specification,
- claim.

---

# 38. PICKED

Removed from storage for fulfillment.

---

# 39. PACKED

Placed into completed shipment package but not yet handed to carrier.

---

# 40. DAMAGED

Not available for normal sale/use.

---

# 41. RETURNED

Returned stock awaiting disposition.

---

# 42. IN_TRANSIT

Inventory moving between:

- supplier,
- TeeStock,
- partner,
- warehouse/hub.

---

# 43. State Transition

Canonical:

```text id="inv024"
STATE A
↓
VALID INVENTORY TRANSACTION
↓
STATE B
```

---

# 44. Inventory Ledger

The source of truth is not manually edited balance.

Canonical:

```text id="inv025"
INVENTORY LEDGER
```

records movements that explain balance.

---

# 45. Ledger Principle

Canonical:

> **Balances are derived from movements. Movements are not invented from balances.**

---

# 46. Inventory Transaction

Every stock change should create:

```text id="inv026"
INVENTORY TRANSACTION
```

---

# 47. Transaction Fields

Minimum:

```text id="inv027"
Transaction ID
SKU / Material
Quantity
From State / Location
To State / Location
Ownership
Reason
Reference Object
Timestamp
Actor
```

---

# 48. Inventory Transaction Types

Potential:

```text id="inv028"
RECEIPT
RESERVATION
RELEASE
TRANSFER
ISSUE
CONSUMPTION
PRODUCTION OUTPUT
PICK
SHIP
RETURN
DAMAGE
ADJUSTMENT
SCRAP
```

---

# 49. Reference Object

Movement should link to cause.

Examples:

```text id="inv029"
PURCHASE ORDER
ORDER
WORK ORDER
RETURN
STOCK COUNT
TRANSFER ORDER
```

---

# 50. No Silent Stock Changes

Canonical:

> **Every material inventory change needs a reason and reference.**

---

# 51. Quantity Direction

Transactions may use:

```text id="inv030"
+ RECEIPT

- ISSUE
```

or explicit from/to balances.

Implementation choice should preserve auditability.

---

# 52. Immutable Ledger Principle

Historical transactions should not casually be overwritten.

Corrections should preferably create correcting entries.

---

# 53. Inventory Balance

A balance is computed across:

```text id="inv031"
SKU
LOCATION
STATE
OWNER
```

---

# 54. Available-to-Sell

Conceptually:

```text id="inv032"
SELLABLE ON_HAND
-
RESERVED
-
HOLDS
-
SAFETY / CHANNEL PROTECTION
=
AVAILABLE TO SELL
```

Exact formula belongs in system configuration.

---

# 55. Available-to-Promise

May additionally consider:

```text id="inv033"
AVAILABLE
+
CONFIRMED INBOUND
+
CONFIRMED PRODUCTION CAPACITY
```

depending product model.

This is more advanced than physical availability.

---

# 56. ATP Caution

Do not promise future stock unless inbound/production assumptions are sufficiently reliable.

---

# 57. Reservation

Canonical:

> **Reservation protects inventory from being promised twice.**

---

# 58. Reservation Trigger

May occur after:

```text id="inv034"
ORDER CONFIRMATION
PAYMENT
PRODUCTION RELEASE
```

depending business flow.

---

# 59. Reservation Expiry

Temporary reservations may require expiration.

Example:

- unpaid checkout,
- pending quote.

Avoid permanently blocking inventory.

---

# 60. Reservation Release

Triggered by:

```text id="inv035"
CANCELLATION
PAYMENT FAILURE
ORDER CHANGE
TIMEOUT
```

---

# 61. Hard vs Soft Reservation

Future distinction:

```text id="inv036"
SOFT
temporary planning intent.

HARD
firm commercial/operational commitment.
```

Only add if useful.

---

# 62. Allocation

Allocation can assign stock to:

- Order Item,
- Production Job,
- Fulfillment Batch.

---

# 63. FEFO / FIFO

Certain inventory may use:

```text id="inv037"
FIFO
```

or:

```text id="inv038"
FEFO
```

if expiry/perishability matters.

Apparel usually prioritizes lot consistency and practical storage more than expiry.

---

# 64. Lot / Batch

Inventory may carry:

```text id="inv039"
LOT
BATCH
```

where quality traceability matters.

---

# 65. Apparel Lot Use

Useful for:

- shade consistency,
- supplier batch,
- fabric variation.

---

# 66. Serial Number

Generally unnecessary for standard apparel.

Only use for products needing unique unit traceability.

---

# 67. Inbound Inventory

Canonical:

```text id="inv040"
PURCHASE ORDER
↓
INBOUND
↓
RECEIPT
↓
QC
↓
AVAILABLE / HOLD
```

---

# 68. Inbound Quantity

System should distinguish:

```text id="inv041"
ORDERED
CONFIRMED
SHIPPED
RECEIVED
ACCEPTED
```

where scale justifies.

---

# 69. Confirmed Inbound

Can influence planning.

Must not equal physical inventory.

---

# 70. Receiving

At receipt:

```text id="inv042"
EXPECTED
vs
ACTUAL
```

must reconcile.

---

# 71. Receiving Variance

Potential:

```text id="inv043"
SHORT
OVER
WRONG SKU
DAMAGED
```

---

# 72. Accepted Receipt

Only accepted quantity enters usable inventory state.

---

# 73. Production Inventory Flow

Canonical:

```text id="inv044"
AVAILABLE MATERIAL
↓
RESERVED
↓
ISSUED
↓
WIP
↓
GOOD OUTPUT
↓
QC
↓
FINISHED INVENTORY / FULFILLMENT
```

---

# 74. Material Consumption

Production closure must reconcile issued material.

---

# 75. Production Output

Production creates new inventory identity/state where applicable.

Example:

```text id="inv045"
BASE TEE
↓
PRODUCTION
↓
FINISHED PRINTED TEE
```

---

# 76. Transformation

Inventory transformation should preserve lineage.

Canonical:

```text id="inv046"
INPUT SKU
↓
WORK ORDER
↓
OUTPUT SKU / CONFIGURATION
```

---

# 77. WIP Valuation

Finance may later include material/production cost in WIP.

Operational system should at least know quantity/state.

---

# 78. Customer-Specific WIP

Cannot automatically become general inventory if job is cancelled.

Disposition decision required.

---

# 79. Finished Goods

Completed QC-passed stock may become:

```text id="inv047"
AVAILABLE FINISHED GOODS
```

when intended for stock.

---

# 80. Made-to-Order Finished Output

May skip general inventory and remain:

```text id="inv048"
ALLOCATED TO ORDER
```

before fulfillment.

---

# 81. Multi-Channel Inventory

TeeStock may sell through:

```text id="inv049"
OWN WEBSITE
MARKETPLACE
RESELLER
SOCIAL COMMERCE
```

All should consume same canonical stock where physically shared.

---

# 82. Channel Availability

Canonical:

```text id="inv050"
PHYSICAL AVAILABLE
↓
CHANNEL RULES
↓
CHANNEL AVAILABLE
```

---

# 83. Channel Buffer

A channel may receive less than full physical availability to prevent overselling.

---

# 84. Channel Allocation

Potential:

```text id="inv051"
OWN STORE
50 units available

MARKETPLACE
20 units exposed
```

while physical stock remains one inventory pool.

---

# 85. Avoid Static Stock Copies

Do not maintain independent channel stock manually unless inventory is physically separate.

---

# 86. Overselling

Occurs when:

```text id="inv052"
PROMISED DEMAND
>
ACTUAL AVAILABLE SUPPLY
```

Inventory architecture must minimize it.

---

# 87. Multi-Channel Synchronization

Mature system should push availability changes to channels.

---

# 88. Synchronization Latency

Channels may not update instantly.

Use buffers where oversell risk is material.

---

# 89. Shared Demand

Base inventory must account for demand from:

```text id="inv053"
COMMERCE
CUSTOM
MERCH
ORIGINALS
SUPPLY
```

---

# 90. Inventory Priority

When stock is constrained:

allocation rules may consider:

```text id="inv054"
PAID ORDERS
CONTRACT COMMITMENTS
PRODUCTION RELEASED
STRATEGIC CHANNELS
```

Exact priority belongs in operational policy.

---

# 91. No Informal Priority Override

High-pressure request should not silently steal reserved stock.

Use explicit reallocation/approval.

---

# 92. Reallocation

Moving reserved stock between commitments should generate:

```text id="inv055"
REALLOCATION
```

with reason.

---

# 93. Supply Inventory

B2B Supply may use same base inventory as Essentials.

Commercial terms differ.

Physical truth does not.

---

# 94. Reseller Inventory

Stock held by reseller after purchase is generally no longer TeeStock inventory.

---

# 95. Dropship Inventory

Stock remains TeeStock-owned until sold/fulfilled according to commercial model.

---

# 96. Consignment

If goods remain TeeStock-owned at another location:

```text id="inv056"
OWNERSHIP
TEEStock

LOCATION
CONSIGNEE
```

must remain explicit.

---

# 97. Partner-Held Inventory

Examples:

- garments sent to printer,
- packaging at 3PL.

Must remain visible.

---

# 98. Partner-Held Stock

Canonical:

```text id="inv057"
TEEStock OWNED
+
PARTNER CUSTODY
```

---

# 99. Partner Stock Reconciliation

Periodically compare:

```text id="inv058"
TEEStock LEDGER
vs
PARTNER PHYSICAL
```

---

# 100. Customer-Owned Inventory

For Fulfill or customer materials:

```text id="inv059"
CUSTOMER OWNER
+
TEEStock CUSTODY
```

---

# 101. Logical Segregation

Customer-owned stock must remain logically separated by owner/account.

---

# 102. No Cross-Consumption

Customer A's stock may not fulfill Customer B's order unless explicit authorized transfer exists.

---

# 103. Ownership Transfer

Commercial events may transfer inventory ownership.

Example:

```text id="inv060"
TEEStock
↓
B2B SALE
↓
RESELLER
```

Ownership event should be consistent with finance/commercial terms.

---

# 104. Physical Transfer vs Ownership Transfer

Can occur at different times.

System design should not confuse them.

---

# 105. Inventory Count

Physical count tests ledger accuracy.

---

# 106. Full Stock Count

Counts all inventory within scope.

---

# 107. Cycle Count

Counts selected inventory regularly.

Canonical:

> **Count more often where value, movement, or risk is higher.**

---

# 108. Cycle Count Priority

Potential:

```text id="inv061"
HIGH VALUE
HIGH MOVEMENT
HIGH ERROR
CRITICAL SKU
```

---

# 109. ABC Classification

Future inventory may classify:

```text id="inv062"
A
high value / importance

B
medium

C
lower
```

to guide count/control intensity.

---

# 110. Count Sheet

Should know:

```text id="inv063"
SKU
Location
Expected Qty
Counted Qty
Variance
Counter
Date
```

---

# 111. Blind Count

Where practical, physical counter may not see expected qty to reduce confirmation bias.

---

# 112. Count Variance

Canonical:

```text id="inv064"
PHYSICAL
-
SYSTEM
=
VARIANCE
```

---

# 113. Adjustment

Inventory difference may require:

```text id="inv065"
ADJUSTMENT TRANSACTION
```

---

# 114. Adjustment Requires Reason

Examples:

```text id="inv066"
COUNT_CORRECTION
DAMAGE
UNRECORDED_CONSUMPTION
LOST
DATA_MIGRATION
```

---

# 115. No Balance Editing

Canonical:

> **Never fix stock by simply typing a new balance without adjustment history.**

---

# 116. Adjustment Approval

Material/high-value adjustments may require approval.

---

# 117. Inventory Accuracy

Conceptually:

> How closely system stock matches physical stock.

---

# 118. Inventory Accuracy Importance

Poor accuracy causes:

```text id="inv067"
OVERSALE
PRODUCTION DELAY
PURCHASING ERROR
CUSTOMER FAILURE
```

---

# 119. Stock Transfer

Movement between locations requires:

```text id="inv068"
TRANSFER ORDER
```

or equivalent transaction.

---

# 120. Transfer Flow

```text id="inv069"
SOURCE
↓
PICK / DISPATCH
↓
IN_TRANSIT
↓
RECEIVE
↓
DESTINATION
```

---

# 121. Transfer Variance

Destination should reconcile sent vs received qty.

---

# 122. Damage in Transit

Should be attributed to transfer/shipment event.

---

# 123. Inventory Aging

Track how long stock remains unsold/unconsumed.

---

# 124. Age Buckets

Potential:

```text id="inv070"
0–30
31–60
61–90
90+
```

Exact buckets belong in reporting configuration.

---

# 125. Dead Stock

Canonical:

> **Inventory with low/no realistic near-term demand relative to holding cost and strategic value.**

---

# 126. Slow-Moving Stock

Not automatically dead.

May still have:

- seasonal,
- strategic,
- replenishment value.

---

# 127. Dead Stock Review

Possible actions:

```text id="inv071"
REPRICE
BUNDLE
TRANSFER
REWORK
RETURN TO VENDOR
LIQUIDATE
WRITE OFF
```

---

# 128. Dead Stock Is a Learning Signal

Can indicate:

```text id="inv072"
BAD FORECAST
BAD BUY
BAD ASSORTMENT
BAD MOQ
PRODUCT DECLINE
```

---

# 129. Inventory Write-Off

Requires finance linkage and explicit reason.

---

# 130. Obsolete Stock

Product may become unusable because:

- branding changes,
- artwork rights expire,
- quality issue,
- packaging outdated.

---

# 131. Rights-Restricted Inventory

If IP license expires:

remaining stock disposition must follow agreement.

Inventory system should know related IP restrictions where material.

---

# 132. Safety Stock

Canonical:

> **Inventory deliberately held to absorb uncertainty.**

---

# 133. Safety Stock Inputs

Potential:

```text id="inv073"
DEMAND VARIABILITY
LEAD TIME
SUPPLIER RELIABILITY
SERVICE TARGET
CASH
```

---

# 134. Safety Stock Is Not Random Buffer

It should exist for an explicit risk reason.

---

# 135. Reorder Point

Conceptually:

```text id="inv074"
EXPECTED DEMAND DURING LEAD TIME
+
SAFETY STOCK
```

---

# 136. Reorder Trigger

When inventory position falls below threshold:

```text id="inv075"
REPLENISHMENT RECOMMENDATION
```

may be generated.

---

# 137. Inventory Position

More useful than on-hand alone:

```text id="inv076"
ON_HAND
+
INBOUND
-
RESERVED / COMMITTED
```

depending planning use.

---

# 138. Reorder Quantity

May consider:

```text id="inv077"
FORECAST
MOQ
ORDER INCREMENT
CASH
STORAGE
PRICE BREAK
```

---

# 139. Economic Replenishment

Do not buy more solely to unlock price tier if resulting inventory risk is worse.

---

# 140. Demand Forecast

May combine:

```text id="inv078"
HISTORICAL DEMAND
OPEN ORDERS
PLANNED LAUNCHES
SEASONALITY
BUSINESS PIPELINE
```

---

# 141. Forecast Is Not Commitment

Separate:

```text id="inv079"
FORECAST
```

from:

```text id="inv080"
FIRM DEMAND
```

---

# 142. Inventory Planning Horizons

Potential:

```text id="inv081"
IMMEDIATE
SHORT-TERM
MEDIUM-TERM
```

depending category.

---

# 143. Core Inventory

High-repeat base garments may justify deeper stock.

---

# 144. Experimental Inventory

New/unproven products should use lower exposure.

Canonical:

```text id="inv082"
LOW CONFIDENCE
→
LOWER STOCK COMMITMENT
```

---

# 145. Inventory Depth by Evidence

Canonical:

```text id="inv083"
TEST
small

PROVEN
deeper

EVERGREEN
optimized replenishment
```

---

# 146. Base Stock + On-Demand Decoration

TeeStock preferred flexibility model:

```text id="inv084"
STANDARD BASE GARMENTS
+
ON-DEMAND / CONTROLLED DECORATION
```

reduces finished-goods risk.

---

# 147. Postponement Strategy

Canonical concept:

> **Delay irreversible product differentiation until demand is clearer.**

Example:

stock blank tees, print after sale.

---

# 148. Benefits of Postponement

```text id="inv085"
LOWER FINISHED INVENTORY
MORE DESIGN FLEXIBILITY
BETTER CAPITAL EFFICIENCY
```

---

# 149. Postponement Trade-Off

Requires:

- production speed,
- capacity,
- reliable base stock.

---

# 150. Size Curve

Apparel purchasing should consider relative size demand.

---

# 151. Size Distribution

Track demand by:

```text id="inv086"
PRODUCT
COLOR
SIZE
```

to improve buy plans.

---

# 152. Color Demand

Core colors may justify deeper stock than experimental colors.

---

# 153. Assortment Complexity

Each new:

```text id="inv087"
SIZE
COLOR
GARMENT
```

creates additional inventory complexity.

---

# 154. SKU Proliferation

Canonical:

> **Every SKU must earn its inventory complexity.**

---

# 155. Variant Rationalization

Low-demand variants may be removed or moved to made-to-order/preorder.

---

# 156. Inventory Segmentation

Potential:

```text id="inv088"
CORE
SEASONAL
EXPERIMENTAL
CUSTOMER-SPECIFIC
```

---

# 157. Core Stock

Regular replenishment.

---

# 158. Seasonal Stock

Time-limited demand.

Need exit plan.

---

# 159. Experimental Stock

Controlled risk.

---

# 160. Customer-Specific Stock

Reserved/owned for particular client/account.

Must not accidentally be sold elsewhere.

---

# 161. Service Inventory

Custom/Business may require materials purchased specifically for project.

---

# 162. Project Inventory

Can be linked to:

```text id="inv089"
PROJECT
```

for visibility and costing.

---

# 163. Project Excess

After project:

```text id="inv090"
RETURN
TRANSFER TO GENERAL
CLIENT OWNED
SCRAP
```

based on ownership/agreement.

---

# 164. Inventory and Fulfillment

Fulfillment depends on:

```text id="inv091"
AVAILABLE
↓
RESERVED
↓
PICKED
↓
PACKED
↓
SHIPPED
```

---

# 165. Inventory and Production

Production depends on:

```text id="inv092"
AVAILABLE MATERIAL
↓
RESERVED
↓
ISSUED
↓
CONSUMED / RETURNED
```

---

# 166. Inventory and Procurement

Procurement responds to:

```text id="inv093"
SHORTAGE
REORDER
FORECAST
FIRM DEMAND
```

---

# 167. Inventory and Finance

Inventory is capital.

Canonical:

```text id="inv094"
STOCK
=
CASH CONVERTED INTO PRODUCT
```

until sold/consumed.

---

# 168. Inventory Valuation

Finance will determine accounting method.

Operational system must provide:

```text id="inv095"
QTY
SKU
MOVEMENT
COST REFERENCES
```

---

# 169. Standard vs Actual Cost

Inventory may eventually use:

- standard cost operationally,
- actual/weighted/FIFO accounting as defined by Finance.

Inventory workflow should not hardcode unsupported accounting assumptions.

---

# 170. Inventory Value

Useful management view:

```text id="inv096"
QTY
×
COST BASIS
```

by category/location.

---

# 171. Working Capital

Inventory must be reviewed alongside:

```text id="inv097"
CASH
RECEIVABLE
PAYABLE
```

---

# 172. Inventory Days

Useful metric to understand capital tied in stock.

Exact definition belongs in KPI/Finance.

---

# 173. Inventory Turn

Higher is not automatically better if stockouts hurt service.

---

# 174. Stockout

Canonical:

> **Stockout means required inventory is unavailable when demand requires it.**

---

# 175. Stockout Causes

Potential:

```text id="inv098"
FORECAST ERROR
SUPPLIER DELAY
UNRECORDED STOCK
DEMAND SPIKE
BAD REORDER
RESERVATION CONFLICT
```

---

# 176. Lost Sale vs Backorder

A stockout can result in:

```text id="inv099"
LOST SALE
BACKORDER
SUBSTITUTION
PREORDER
```

depending product/customer promise.

---

# 177. Backorder

Should be explicit commercial state.

Not hidden stock shortage.

---

# 178. Negative Inventory

Canonical:

```text id="inv100"
NEGATIVE STOCK
=
DATA / PROCESS FAILURE
```

except controlled migration/system edge cases.

---

# 179. Negative Stock Alert

Should be treated as exception.

---

# 180. Inventory Exception Types

Potential:

```text id="inv101"
NEGATIVE BALANCE
COUNT VARIANCE
STOCKOUT
OVERSTOCK
QUARANTINE
MISSING TRANSFER
STALE RESERVATION
UNEXPLAINED ADJUSTMENT
```

---

# 181. Inventory Exception Queue

Future MGBOS:

```text id="inv102"
NEEDS COUNT
NEEDS REPLENISHMENT
NEEDS DISPOSITION
NEEDS INVESTIGATION
```

---

# 182. Inventory KPI Categories

Canonical:

```text id="inv103"
ACCURACY
AVAILABILITY
VELOCITY
CAPITAL
LOSS
```

---

# 183. Accuracy Metrics

Potential:

```text id="inv104"
Inventory Accuracy
Count Variance
Adjustment Frequency
```

---

# 184. Availability Metrics

```text id="inv105"
Stockout Rate
Fill Rate
Backorder Rate
```

---

# 185. Velocity Metrics

```text id="inv106"
Inventory Turn
Inventory Days
Sell-Through
```

---

# 186. Capital Metrics

```text id="inv107"
Inventory Value
Dead Stock Value
WIP Value
```

---

# 187. Loss Metrics

```text id="inv108"
Damage
Scrap
Shrinkage
Write-Off
```

---

# 188. Fill Rate

Useful for:

```text id="inv109"
SUPPLY
RESELLER
COMMERCE
```

but denominator must be consistently defined.

---

# 189. Sell-Through

Useful for limited collections/finished stock.

---

# 190. Inventory Accuracy Thresholds

Exact thresholds belong in:

```text id="inv110"
decision-thresholds.md
```

---

# 191. Stock Count Cadence

Potential:

```text id="inv111"
CRITICAL / HIGH MOVEMENT
frequent cycle count

LOW MOVEMENT
less frequent
```

Scale gradually.

---

# 192. Inventory Ownership Review

Consigned/client/partner-held stock should be periodically reconciled.

---

# 193. Inventory Access Control

Not every user should be able to:

```text id="inv112"
ADJUST STOCK
WRITE OFF
CHANGE OWNERSHIP
```

---

# 194. High-Risk Actions

Require elevated permissions:

```text id="inv113"
MATERIAL ADJUSTMENT
WRITE-OFF
OWNERSHIP TRANSFER
MANUAL RELEASE OF QUARANTINE
```

---

# 195. Stock Adjustment Audit

Must preserve:

```text id="inv114"
WHO
WHEN
WHY
BEFORE
AFTER
```

---

# 196. Quarantine Release

Only authorized quality decision may return stock to Available.

---

# 197. Damaged Stock

Must have explicit disposition.

Do not let damaged inventory remain indefinitely unresolved.

---

# 198. Returned Inventory

Canonical:

```text id="inv115"
RETURN RECEIVED
↓
INSPECT
↓
RESTOCK / HOLD / REWORK / SCRAP
```

---

# 199. Returned ≠ Available

Critical.

No returned item becomes sellable before inspection.

---

# 200. Customer Return to Inventory

May require:

- packaging condition,
- wear/use check,
- product type.

---

# 201. Personalized Product Returns

Usually not reusable as general inventory.

Disposition differs.

---

# 202. Inventory Transfer Between Businesses

If MultiGraph/TeeStock transfer ownership internally:

transaction should be economically recorded.

Do not silently move stock across entities.

---

# 203. MultiGraph Shared Storage

Physical space may be shared.

Inventory ownership must remain distinguishable.

---

# 204. Warehouse Space

Inventory growth should track storage capacity.

---

# 205. Location Capacity

Future warehouses may define:

```text id="inv116"
STORAGE CAPACITY
```

by location/zone.

---

# 206. Slotting

Frequently picked SKUs may be placed in easier locations.

This becomes useful at scale.

---

# 207. Picking Location

A SKU may exist across multiple bins.

System should know aggregated + bin-level stock if needed.

---

# 208. Replenishment Within Warehouse

Future flow:

```text id="inv117"
RESERVE STORAGE
↓
PICK FACE
```

only if scale requires.

---

# 209. Barcode

Barcode can identify:

```text id="inv118"
SKU
BIN
BATCH
```

and reduce manual errors.

---

# 210. QR vs Barcode

Technology choice is secondary.

Canonical identity/data matters first.

---

# 211. V1 Inventory Identification

Can begin with:

```text id="inv119"
SKU LABEL
+
LOCATION LABEL
```

before sophisticated scanners.

---

# 212. Inventory Data Model

Core entities:

```text id="inv120"
INVENTORY ITEM / SKU
LOCATION
INVENTORY BALANCE
INVENTORY TRANSACTION
RESERVATION
TRANSFER
COUNT
ADJUSTMENT
LOT / BATCH
OWNERSHIP
```

---

# 213. Inventory Balance Entity

Materialized/current view of ledger.

---

# 214. Inventory Transaction Entity

Historical source of movement truth.

---

# 215. Reservation Entity

Links quantity to demand.

---

# 216. Transfer Entity

Controls movement between locations/custodians.

---

# 217. Count Entity

Represents physical verification event.

---

# 218. Adjustment Entity

Represents correction with reason/approval.

---

# 219. Lot Entity

Optional traceability dimension.

---

# 220. Ownership Dimension

May attach to balance/transaction.

Critical for Fulfill/client stock.

---

# 221. Canonical Inventory Key

A balance may effectively be identified by:

```text id="inv121"
SKU
+
LOCATION
+
STATE
+
OWNER
+
LOT if relevant
```

---

# 222. Inventory Event Model

Potential:

```text id="inv122"
inventory.received
inventory.reserved
inventory.released
inventory.transferred
inventory.issued
inventory.produced
inventory.quarantined
inventory.adjusted
inventory.shipped
```

---

# 223. Event-Driven Inventory

Events can trigger:

- channel sync,
- replenishment,
- alerts,
- finance updates.

---

# 224. Multi-Channel Sync

Example:

```text id="inv123"
inventory.available_changed
↓
commerce availability
↓
marketplace sync
```

---

# 225. Replenishment Trigger

```text id="inv124"
inventory.position_below_reorder
↓
purchase recommendation
```

---

# 226. Stockout Warning

Future MGBOS can forecast:

```text id="inv125"
SKU X
expected to stock out
before supplier replenishment arrives
```

---

# 227. Inventory Dashboard

Potential top-level:

```text id="inv126"
AVAILABLE STOCK
LOW STOCK
OUT OF STOCK
INBOUND
RESERVED
QUARANTINE
DEAD STOCK
COUNT VARIANCE
```

---

# 228. SKU Detail View

Should eventually show:

```text id="inv127"
ON HAND
AVAILABLE
RESERVED
INBOUND
WIP
LOCATIONS
RECENT MOVEMENTS
DEMAND
```

---

# 229. Inventory Planning View

Potential:

```text id="inv128"
STOCK
+
DEMAND
+
INBOUND
+
FORECAST
+
REORDER
```

---

# 230. MGBOS Questions

MGBOS should eventually answer:

```text id="inv129"
How much do we physically have?

How much is actually available?

Where is it?

Who owns it?

What is reserved?

What is inbound?

What is in production?

What is quarantined?

Why did balance change?

What should we buy next?
```

---

# 231. Automation Opportunities

Potential:

```text id="inv130"
Automatic Reservation
Channel Availability Sync
Reorder Recommendation
Stockout Prediction
Cycle Count Scheduling
Reservation Expiry
Transfer Reconciliation
```

---

# 232. Automatic Reservation

Can become safe when:

```text id="inv131"
ORDER STATE
+
PAYMENT RULE
+
INVENTORY RULE
```

are stable.

---

# 233. Automatic Replenishment

Early:

```text id="inv132"
SYSTEM RECOMMENDS
HUMAN APPROVES
```

---

# 234. Auto-Purchase Boundary

Fully automatic purchasing should only occur after:

- reliable demand,
- trusted suppliers,
- approved budgets,
- stable rules.

---

# 235. AI Role

AI may assist:

```text id="inv133"
Demand Forecasting
Stockout Risk
Slow-Moving Detection
Buy Recommendation Explanation
Anomaly Detection
```

---

# 236. AI Inventory Boundary

AI should not independently:

```text id="inv134"
WRITE OFF STOCK
RELEASE QUARANTINE
CHANGE OWNERSHIP
CREATE LARGE PO
```

without deterministic authority/approval.

---

# 237. AI Forecast Boundary

Forecast is recommendation.

It does not override:

- firm orders,
- physical stock,
- confirmed inbound.

---

# 238. Inventory Anomaly AI

Can flag:

```text id="inv135"
Unexpected shrinkage
Abnormal consumption
Unusual adjustment
Sudden demand change
```

---

# 239. Inventory Maturity Model

```text id="inv136"
LEVEL 0
Spreadsheet balances

LEVEL 1
SKU + locations + manual movements

LEVEL 2
Ledger + reservation + inbound

LEVEL 3
Production / channel integration

LEVEL 4
Automated replenishment + forecasting

LEVEL 5
Exception-based inventory orchestration
```

---

# 240. Level 0

Anti-goal:

manual number edits without movement history.

---

# 241. Level 1

Minimum:

```text id="inv137"
SKU
LOCATION
ON HAND
TRANSACTION
```

---

# 242. Level 2

Adds:

```text id="inv138"
RESERVATION
INBOUND
OWNERSHIP
COUNT
```

---

# 243. Level 3

Adds:

```text id="inv139"
PRODUCTION MATERIAL FLOW
CHANNEL SYNC
FULFILLMENT STATUS
```

---

# 244. Level 4

Adds:

```text id="inv140"
FORECAST
SAFETY STOCK
REORDER RECOMMENDATION
AUTOMATED SYNC
```

---

# 245. Level 5

System primarily escalates:

```text id="inv141"
STOCKOUT RISK
OVERSTOCK
VARIANCE
EXCEPTION
```

---

# 246. Current Recommended Stage

TeeStock should target:

```text id="inv142"
LEVEL 1
→
LEVEL 2
```

first.

---

# 247. V1 Required Capabilities

Priority:

```text id="inv143"
Canonical SKU
Location
On-Hand
Available
Reservation
Receiving
Inventory Transaction
Count / Adjustment
```

---

# 248. V1 Core Inventory

Prioritize:

```text id="inv144"
BASE GARMENTS
KEY PACKAGING
SELECT FINISHED GOODS
```

before tracking every consumable.

---

# 249. V1 Stock Locations

Keep simple:

```text id="inv145"
MAIN STOCK
PRODUCTION
PARTNER
QUARANTINE
```

as real operations require.

---

# 250. V1 Avoid

Do not immediately build:

```text id="inv146"
full WMS
robotic slotting
serial tracking for every tee
complex warehouse waves
advanced optimization algorithms
```

---

# 251. V2 Expansion

Possible:

```text id="inv147"
LOT TRACKING
CYCLE COUNTING
REORDER POINT
PARTNER STOCK
MULTI-CHANNEL SYNC
```

---

# 252. V3 Expansion

Possible:

```text id="inv148"
BARCODE SCANNING
MULTI-WAREHOUSE
AUTOMATED TRANSFERS
FORECASTING
```

---

# 253. V4 Expansion

Possible:

```text id="inv149"
DYNAMIC SAFETY STOCK
MULTI-HUB ALLOCATION
PREDICTIVE REPLENISHMENT
ADVANCED WMS INTEGRATION
```

---

# 254. Inventory Activation Gate

A SKU should become stock-controlled when:

```text id="inv150"
PHYSICAL QUANTITY MATTERS
+
AVAILABILITY MATTERS
+
LOSS / COST MATTERS
```

---

# 255. Reservation Gate

Reserve stock when commitment is sufficiently real to justify blocking availability.

---

# 256. Lot Tracking Gate

Add lot/batch tracking where it materially improves:

```text id="inv151"
QUALITY
TRACEABILITY
SHADE CONTROL
CLAIM MANAGEMENT
```

---

# 257. Finished Inventory Gate

Stock decorated finished goods only when demand confidence justifies less flexibility.

---

# 258. Reorder Automation Gate

Automate recommendation when:

```text id="inv152"
DEMAND HISTORY
+
LEAD TIME DATA
+
INVENTORY ACCURACY
```

are sufficiently trustworthy.

---

# 259. Multi-Warehouse Gate

Add additional hub only when:

```text id="inv153"
VOLUME
GEOGRAPHY
SLA
COST
```

justify fragmentation.

---

# 260. Inventory Failure Modes

## Separate Stock per Business Line

Double-counting.

## Balance Without Ledger

No auditability.

## On-Hand = Available

Overselling.

## No Reservation

Double promise.

## Returned = Sellable

Quality risk.

## Partner Stock Invisible

Missing assets.

## Customer-Owned Stock Mixed

Ownership failure.

## Silent Adjustment

Inventory fiction.

## Buying for Discount

Working-capital trap.

## Too Many Finished SKUs

Capital and complexity explosion.

---

# 261. What Inventory System Must Not Become

## Spreadsheet Competition

There must be one canonical truth.

## Warehouse-Only System

Inventory serves commerce, production, procurement, finance, and customer promise.

## Static Count Database

Movements matter more than manually entered totals.

## Infinite Buffer Strategy

More stock is not automatically safer.

## Forecast Fantasy

Physical reality and firm demand remain authoritative.

---

# 262. Inventory Success Definition

The Inventory System succeeds when TeeStock can answer:

```text id="inv154"
WHAT
do we have?

HOW MUCH
physically exists?

HOW MUCH
is available?

WHERE
is it?

WHO
owns it?

WHAT
is reserved?

WHAT
is inbound?

WHAT
is in production?

WHAT
is blocked?

WHY
did the quantity change?

WHEN
should we replenish?
```

without relying on manual reconciliation across multiple spreadsheets.

---

# 263. Canonical Inventory Summary

```text id="inv155"
SKU
defines stock identity.

LOCATION
defines custody.

OWNER
defines ownership.

STATE
defines usability.

LEDGER
explains movement.

RESERVATION
protects commitment.

COUNT
tests reality.

REPLENISHMENT
protects availability.

FINANCE
values capital.

MGBOS
connects demand, stock, and action.
```

---

# 264. Canonical Inventory Principles

```text id="inv156"
ONE PHYSICAL TRUTH.

SKU BEFORE STOCK.

OWNER BEFORE CUSTODY.

ON-HAND IS NOT AVAILABLE.

RESERVE BEFORE PROMISE.

RECEIVE BEFORE AVAILABLE.

QC BEFORE RELEASE.

MOVEMENT BEFORE BALANCE.

REFERENCE BEFORE ADJUSTMENT.

RETURNED BEFORE INSPECTED IS NOT SELLABLE.

SHARED BASE INVENTORY BEFORE DUPLICATED FINISHED STOCK.

DEMAND BEFORE REPLENISHMENT.

ACCURACY BEFORE AUTOMATION.

INVENTORY IS CASH IN PHYSICAL FORM.
```

---

# 265. Dependency

Dokumen berikut harus follow Inventory System:

1. [[bisnis/teestock/07-operations/order-fulfillment|order-fulfillment.md]]
2. [[bisnis/teestock/07-operations/customer-service|customer-service.md]]
3. [[bisnis/teestock/07-operations/returns-and-warranty|returns-and-warranty.md]]
4. [[bisnis/teestock/08-finance/financial-model|financial-model.md]]
5. [[bisnis/teestock/08-finance/unit-economics|unit-economics.md]]
6. [[bisnis/teestock/08-finance/cost-accounting|cost-accounting.md]]
7. [[bisnis/teestock/08-finance/treasury-policy|treasury-policy.md]]
8. [[bisnis/teestock/10-product-tech/commerce-platform|commerce-platform.md]]
9. [[bisnis/teestock/10-product-tech/automation-architecture|automation-architecture.md]]
10. [[bisnis/teestock/11-data-mgbos/canonical-data-model|canonical-data-model.md]]
11. [[bisnis/teestock/11-data-mgbos/entity-hierarchy|entity-hierarchy.md]]
12. [[bisnis/teestock/11-data-mgbos/event-model|event-model.md]]
13. [[bisnis/teestock/11-data-mgbos/mgbos-integration|mgbos-integration.md]]
14. [[bisnis/teestock/13-metrics-experiments/kpi-framework|kpi-framework.md]]

TeeStock Inventory System boleh berkembang menjadi multi-location, barcode-enabled, forecast-driven, dan highly automated, tetapi automation hanya boleh berdiri di atas canonical SKUs, accurate movement ledger, clear ownership, reliable reservations, disciplined receiving, quality holds, dan trustworthy physical counts.