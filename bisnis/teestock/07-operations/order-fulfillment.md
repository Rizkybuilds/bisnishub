---
title: "TeeStock Order Fulfillment System"
date: "2026-09-28"
bisnis: teestock
kategori: operasional
status: active
tags:
  - bisnis/teestock
  - kategori/operasional
  - teestock/canonical
  - teestock/operations
document_id: "TS-OPS-006"
version: "1.0"
category: "operations"
business: "teestock"
last_updated: "2026-09-28"
path: "07-operations/order-fulfillment.md"
depends_on:
  - "TS-FND-001"
  - "TS-FND-002"
  - "TS-COM-001"
  - "TS-SVC-002"
  - "TS-SVC-003"
  - "TS-SVC-004"
  - "TS-SVC-007"
  - "TS-PRG-003"
  - "TS-OPS-001"
  - "TS-OPS-003"
  - "TS-OPS-004"
  - "TS-OPS-005"
---


# TeeStock Order Fulfillment System v1.0

> [!tip] **Canonical TeeStock Order Fulfillment & Shipping Framework  **
> Dokumen ini mendefinisikan fulfillment readiness, order release, picking, verification, packing, packaging, shipment creation, carrier selection, multi-channel fulfillment, made-to-order handoff, split shipment, tracking, failed delivery, return-to-sender, fulfillment exceptions, SLA, accuracy, custody, metrics, dan progressive automation.
>
> [!info] **Dependencies & Data Flow (SSOT)**
> [[bisnis/teestock/00-foundation/teestock-master-definition|TS-FND-001: TeeStock Master Definition]] • [[bisnis/teestock/00-foundation/glossary|TS-FND-002: TeeStock Glossary]] • [[bisnis/teestock/03-commerce/commerce-overview|TS-COM-001: TeeStock Commerce Overview]] • [[bisnis/teestock/04-services/custom|TS-SVC-002: TeeStock Custom]] • [[bisnis/teestock/04-services/business|TS-SVC-003: TeeStock Business]] • [[bisnis/teestock/04-services/merch|TS-SVC-004: TeeStock Merch]] • [[bisnis/teestock/04-services/fulfill|TS-SVC-007: TeeStock Fulfill]] • [[bisnis/teestock/06-programs/reseller-program|TS-PRG-003: TeeStock Reseller Program]] • [[bisnis/teestock/07-operations/operating-model|TS-OPS-001: TeeStock Operating Model]] • [[bisnis/teestock/07-operations/production-system|TS-OPS-003: TeeStock Production System]] • [[bisnis/teestock/07-operations/quality-control|TS-OPS-004: TeeStock Quality Control System]] • [[bisnis/teestock/07-operations/inventory-system|TS-OPS-005: TeeStock Inventory System]]


---

# 1. Purpose

Order Fulfillment System menjawab:

> **Bagaimana TeeStock memastikan setiap customer menerima produk yang benar, dalam quantity yang benar, dalam kondisi yang benar, ke alamat yang benar, dengan shipment yang dapat dilacak?**

Canonical principle:

> **Right product. Right customer. Right condition. Right time.**

---

# 2. Canonical Definition

> **TeeStock Order Fulfillment System adalah operating framework yang mengubah fulfillment-ready orders menjadi verified shipments melalui inventory allocation, picking, packing, shipment creation, carrier handoff, tracking, delivery monitoring, dan exception management.**

---

# 3. Fulfillment Is Customer Promise Execution

Fulfillment bukan sekadar:

```text id="ful001"
packing barang
+
kirim paket
```

Fulfillment adalah tahap dimana seluruh upstream work akhirnya diuji oleh customer.

---

# 4. Strategic Role

Fulfillment mempengaruhi:

```text id="ful002"
CUSTOMER EXPERIENCE
ORDER ACCURACY
DELIVERY SPEED
COST
RETURN RATE
BRAND TRUST
```

---

# 5. Canonical Flow

```text id="ful003"
ORDER
↓
FULFILLMENT READINESS
↓
RELEASE
↓
RESERVE / ALLOCATE
↓
PICK
↓
VERIFY
↓
PACK
↓
CREATE SHIPMENT
↓
CARRIER HANDOFF
↓
TRACK
↓
DELIVER
↓
COMPLETE
```

---

# 6. Alternate Paths

Possible:

```text id="ful004"
FAILED DELIVERY
RETURN TO SENDER
PARTIAL SHIPMENT
SPLIT SHIPMENT
CANCEL
HOLD
```

---

# 7. Order vs Shipment

Critical distinction:

```text id="ful005"
ORDER
commercial customer commitment.

SHIPMENT
physical delivery movement.
```

One Order may produce:

```text id="ful006"
ONE
or
MULTIPLE SHIPMENTS
```

---

# 8. Order Item vs Shipment Item

An Order Item describes what customer bought.

Shipment Item records what physically entered a shipment.

---

# 9. Fulfillment-Ready State

An Order should enter fulfillment queue only when:

```text id="ful007"
PAYMENT CONDITION MET
+
PRODUCT READY
+
QC PASSED
+
ADDRESS VALID
+
NO ACTIVE HOLD
```

---

# 10. Fulfillment Readiness Gate

Canonical:

> **Do not let incomplete upstream work become warehouse confusion.**

---

# 11. Standard Ready-Stock Flow

```text id="ful008"
ORDER
↓
PAYMENT
↓
RESERVATION
↓
FULFILLMENT RELEASE
```

---

# 12. Made-to-Order Flow

```text id="ful009"
ORDER
↓
PRODUCTION
↓
QC
↓
FULFILLMENT RELEASE
```

---

# 13. Hybrid Order

One order may contain:

```text id="ful010"
READY STOCK
+
MADE TO ORDER
```

System must determine:

```text id="ful011"
WAIT AND SHIP TOGETHER
or
SPLIT SHIPMENT
```

---

# 14. Fulfillment Hold

Potential reasons:

```text id="ful012"
PAYMENT
ADDRESS
INVENTORY
QC
CUSTOMER REQUEST
FRAUD REVIEW
PRODUCTION
```

---

# 15. Hold Must Be Explicit

Do not leave order silently sitting.

Canonical:

```text id="ful013"
HOLD
+
REASON
+
OWNER
+
NEXT ACTION
```

---

# 16. Fulfillment Release

Release means:

> all required conditions exist for physical fulfillment work to begin.

---

# 17. Release Event

Potential future event:

```text id="ful014"
order.fulfillment_ready
```

---

# 18. Fulfillment Queue

Future MGBOS should maintain:

```text id="ful015"
READY TO PICK
PICKING
VERIFYING
PACKING
READY TO SHIP
SHIPPED
EXCEPTION
```

---

# 19. Queue Priority

Potential factors:

```text id="ful016"
SLA
ORDER AGE
SHIPPING METHOD
CUSTOMER PROMISE
CAMPAIGN
```

---

# 20. Avoid Fake Urgency

Priority must be system-defined.

Not every request should become:

```text id="ful017"
URGENT
```

---

# 21. Reservation Before Pick

Canonical:

```text id="ful018"
AVAILABLE
↓
RESERVED
↓
ALLOCATED
↓
PICKED
```

---

# 22. Allocation

Allocation links physical inventory to:

```text id="ful019"
ORDER ITEM
```

or fulfillment requirement.

---

# 23. Picking

Canonical:

> **Picking is the physical retrieval of allocated inventory for a specific order/shipment.**

---

# 24. Pick List

Should contain:

```text id="ful020"
Order / Shipment
SKU
Product
Variant
Qty
Location
Special Instruction
```

---

# 25. Pick Location

Use canonical inventory location.

Avoid:

> “kayaknya ada di rak belakang.”

---

# 26. Pick Confirmation

When item physically retrieved:

```text id="ful021"
ALLOCATED
→
PICKED
```

---

# 27. Partial Pick

If required quantity cannot be picked:

create exception.

Do not silently change shipped quantity.

---

# 28. Pick Shortage

Possible causes:

```text id="ful022"
INVENTORY ERROR
DAMAGE
MISSING ITEM
WRONG LOCATION
UNRECORDED MOVEMENT
```

---

# 29. Pick Shortage Action

Potential:

```text id="ful023"
RECOUNT
REALLOCATE
BACKORDER
REPRODUCE
CUSTOMER CONTACT
```

---

# 30. Batch Picking

Future efficiency method:

```text id="ful024"
MULTIPLE ORDERS
→
ONE PICK ROUTE
```

Useful only after enough volume.

---

# 31. Wave Picking

Advanced fulfillment planning may group orders by:

- carrier,
- cutoff,
- zone.

Not required in early stage.

---

# 32. Verification

After picking:

verify against order.

Canonical:

```text id="ful025"
PICK
↓
VERIFY
↓
PACK
```

---

# 33. Verification Checks

Potential:

```text id="ful026"
SKU
SIZE
COLOR
QTY
CUSTOMIZATION
CONDITION
```

---

# 34. Personalized Product Verification

For customer-specific products, check:

```text id="ful027"
NAME
NUMBER
TEXT
ARTWORK
```

before packing.

---

# 35. Verification Is Quality Firewall

This step prevents:

```text id="ful028"
RIGHT PRODUCT
sent to
WRONG CUSTOMER
```

and vice versa.

---

# 36. Barcode Verification

Future:

```text id="ful029"
SCAN ORDER
+
SCAN SKU
```

can reduce errors.

---

# 37. Manual V1 Verification

Use:

```text id="ful030"
PICK LIST
+
ORDER CHECK
```

consistently.

---

# 38. Packing

Packing converts picked items into shipment-ready package.

---

# 39. Packing Objectives

```text id="ful031"
PROTECT PRODUCT
PRESENT PRODUCT
ENABLE TRANSPORT
MINIMIZE UNNECESSARY COST
```

---

# 40. Packaging Standard

Standard products should use standardized packaging.

---

# 41. Packaging Layers

Potential:

```text id="ful032"
PRODUCT PROTECTION
INNER PACK
OUTER SHIPPING PACK
INSERT
LABEL
```

depending product.

---

# 42. Packaging by Business Line

Commercial presentation may differ.

But avoid excessive packaging fragmentation.

---

# 43. Essentials Packaging

Default:

```text id="ful033"
SIMPLE
CLEAN
FUNCTIONAL
```

---

# 44. Originals Packaging

May include stronger storytelling where economics/brand value justify it.

---

# 45. Custom / Business Packaging

Can reflect:

- bulk packing,
- per-person packing,
- department sorting,

when required.

---

# 46. Creator Merch Packaging

May support creator/brand identity.

But operational complexity must be intentional.

---

# 47. Packaging Cost

Must feed order/product economics.

---

# 48. Packaging Inventory

Critical packaging items should be inventory-controlled where shortages can block shipping.

---

# 49. Packaging Specification

For repeatable flow, define:

```text id="ful034"
PACKAGE TYPE
SIZE
INSERT
LABEL
SPECIAL RULE
```

---

# 50. Packing Instruction

Order may carry specific:

```text id="ful035"
GIFT NOTE
BUNDLE
CUSTOM LABEL
NO-INVOICE
```

where supported.

---

# 51. No Uncontrolled Custom Packing

Manual special requests create error risk.

Only supported instructions should enter flow.

---

# 52. Packing Verification

Before close:

```text id="ful036"
ITEM COUNT
PRODUCT
DOCUMENT
PACKAGE
```

should be verified.

---

# 53. Packing Slip

May summarize:

```text id="ful037"
ORDER
ITEMS
QTY
```

depending customer/channel requirements.

---

# 54. Shipment Creation

After packing:

create canonical:

```text id="ful038"
SHIPMENT
```

---

# 55. Shipment Fields

Minimum:

```text id="ful039"
Shipment ID
Order
Recipient
Address
Items
Package
Weight / Dimension if needed
Carrier
Service
Tracking Number
Status
```

---

# 56. Shipment Status

Canonical:

```text id="ful040"
DRAFT
READY
HANDED_OVER
IN_TRANSIT
DELIVERED
FAILED
RETURNING
RETURNED
LOST
CANCELLED
```

---

# 57. Address Validation

Before shipment:

check:

```text id="ful041"
NAME
PHONE
ADDRESS
AREA / POSTAL CODE
```

as relevant.

---

# 58. Invalid Address

Creates fulfillment exception.

Avoid shipping to obviously incomplete address.

---

# 59. Address Change

After packing/label creation:

address change should trigger controlled update.

---

# 60. Carrier Selection

Potential factors:

```text id="ful042"
DESTINATION
SLA
COST
RELIABILITY
PACKAGE TYPE
CUSTOMER CHOICE
```

---

# 61. Carrier Is Capability

System should think in terms of:

```text id="ful043"
DELIVERY SERVICE REQUIREMENT
```

not hardcode one provider everywhere.

---

# 62. Carrier Service

Examples:

```text id="ful044"
STANDARD
NEXT DAY
SAME DAY
CARGO
```

depending available carriers.

---

# 63. Cheapest Carrier Is Not Always Best

Consider:

```text id="ful045"
DELIVERY SUCCESS
SLA
CLAIMS
TRACKING
CUSTOMER EXPERIENCE
```

---

# 64. Carrier Rate

Shipping rate should be traceable.

---

# 65. Shipping Charge vs Shipping Cost

Critical distinction:

```text id="ful046"
CUSTOMER SHIPPING CHARGE
≠
ACTUAL CARRIER COST
```

Difference affects economics.

---

# 66. Free Shipping

Is a commercial subsidy.

Cost still exists.

---

# 67. Shipping Label

Should derive from canonical shipment/address data.

Avoid manual retyping.

---

# 68. Tracking Number

Must map to:

```text id="ful047"
SHIPMENT
```

not only order.

---

# 69. Multiple Tracking Numbers

Possible when order has multiple shipments.

---

# 70. Carrier Handoff

When package leaves TeeStock custody:

```text id="ful048"
PACKED
→
HANDED_OVER
```

---

# 71. Handoff Evidence

Potential:

- scan,
- manifest,
- pickup receipt.

Scale according to risk.

---

# 72. Shipping Manifest

Can group multiple packages given to carrier.

---

# 73. Carrier Cutoff

Fulfillment planning should know daily shipping cutoff where material.

---

# 74. Same-Day Dispatch

Only promise if operational conditions support it.

---

# 75. Order-to-Ship SLA

Canonical:

```text id="ful049"
FULFILLMENT READY
→
CARRIER HANDOFF
```

---

# 76. Shipping SLA vs Delivery SLA

Critical:

```text id="ful050"
SHIP SLA
TeeStock controlled.

DELIVERY SLA
carrier-dependent.
```

---

# 77. Customer Promise

Communication should distinguish:

```text id="ful051"
PROCESSING TIME
+
ESTIMATED TRANSIT TIME
```

---

# 78. Tracking

After handoff:

carrier updates shipment progress.

---

# 79. Tracking Sync

Future system should ingest:

```text id="ful052"
IN_TRANSIT
DELIVERED
FAILED
RETURNING
```

events.

---

# 80. Customer Notification

Potential:

```text id="ful053"
Order Ready
Shipped
Tracking Available
Delivered
Delivery Issue
```

---

# 81. Notification Source

Customer-facing status should derive from canonical order/shipment state.

---

# 82. Failed Delivery

Potential reasons:

```text id="ful054"
CUSTOMER UNAVAILABLE
ADDRESS ISSUE
REFUSED
CARRIER ISSUE
```

---

# 83. Failed Delivery Is Exception

Should create:

```text id="ful055"
OWNER
+
NEXT ACTION
```

---

# 84. Failed Delivery Actions

Potential:

```text id="ful056"
REATTEMPT
CUSTOMER CONTACT
ADDRESS CORRECTION
RETURN TO SENDER
```

---

# 85. Return to Sender

Canonical:

```text id="ful057"
IN_TRANSIT
↓
RETURNING
↓
RETURNED TO ORIGIN
```

---

# 86. RTS Is Not Customer Return

Critical distinction:

```text id="ful058"
RTS
delivery failure.

CUSTOMER RETURN
post-delivery return process.
```

---

# 87. RTS Receipt

Returned shipment must be physically received and inspected.

---

# 88. RTS Inventory

Items should not automatically return to Available.

Need:

```text id="ful059"
INSPECTION
```

---

# 89. RTS Resolution

Potential:

```text id="ful060"
RESHIP
REFUND
HOLD
RESTOCK
```

based on circumstances/policy.

---

# 90. Reshipping Cost

Need clear commercial policy on who bears cost.

---

# 91. Lost Shipment

If carrier indicates lost:

create incident/claim.

---

# 92. Damaged in Transit

May trigger:

```text id="ful061"
CUSTOMER RESOLUTION
+
CARRIER CLAIM
+
QUALITY / PACKAGING REVIEW
```

---

# 93. Carrier Claim

Track:

```text id="ful062"
Shipment
Carrier
Claim Value
Reason
Status
Recovery
```

---

# 94. Delivery Confirmation

Delivered shipment can trigger Order completion when all required items are fulfilled.

---

# 95. Partial Delivery

One order may remain partially fulfilled.

---

# 96. Fulfillment Status at Order Level

Potential:

```text id="ful063"
UNFULFILLED
PARTIALLY_FULFILLED
FULFILLED
```

---

# 97. Split Shipment

A single order may create multiple shipments because of:

```text id="ful064"
STOCK LOCATION
PRODUCT READINESS
PACKAGE TYPE
CUSTOMER REQUEST
```

---

# 98. Split Shipment Gate

Use only when benefit outweighs:

```text id="ful065"
EXTRA SHIPPING COST
+
CUSTOMER CONFUSION
+
OPERATIONAL COMPLEXITY
```

---

# 99. Wait-to-Combine

Default may be to wait until all items ready if promise remains acceptable.

---

# 100. Partial Ship

Use when:

- urgency,
- delay,
- contractual requirement

justifies it.

---

# 101. Multi-Location Fulfillment

Future order may be fulfilled from:

```text id="ful066"
HUB A
+
HUB B
```

This creates multiple shipments.

---

# 102. Fulfillment Routing

Potential future decision:

```text id="ful067"
WHERE SHOULD THIS ORDER SHIP FROM?
```

based on:

```text id="ful068"
STOCK
DISTANCE
COST
SLA
CAPACITY
```

---

# 103. Single-Hub V1

Prefer one reliable fulfillment hub before distributed complexity.

---

# 104. Multi-Channel Order Intake

Orders may come from:

```text id="ful069"
TEEStock WEBSITE
MARKETPLACE
SOCIAL COMMERCE
RESELLER DROPSHIP
CREATOR STORE
```

---

# 105. Channel Normalization

All orders should normalize into:

```text id="ful070"
CANONICAL ORDER
+
ORDER ITEM
```

before fulfillment.

---

# 106. Marketplace Order

Marketplace-specific constraints may include:

- SLA,
- label,
- carrier,
- cancellation.

Canonical system should capture those constraints.

---

# 107. Marketplace Is Not Warehouse Truth

Inventory/fulfillment reality remains internal canonical state.

---

# 108. Reseller Dropship

Canonical:

```text id="ful071"
RESELLER ORDER
↓
TEEStock FULFILLMENT
↓
END CUSTOMER
```

---

# 109. Dropship Packing

May require:

```text id="ful072"
NO TEEStock PROMO
RESELLER PACKING SLIP
NEUTRAL PACKAGING
```

if program supports it.

---

# 110. White-Label Fulfillment

Only after operational model is explicitly enabled.

---

# 111. Fulfillment Account

For external Fulfill clients, inventory/orders should map to:

```text id="ful073"
FULFILLMENT ACCOUNT
```

---

# 112. Client Inventory

Canonical:

```text id="ful074"
CLIENT OWNED
+
TEEStock CUSTODY
```

---

# 113. Client Order Segregation

Fulfillment worker/system must know which account owns order and inventory.

---

# 114. No Cross-Client Consumption

Canonical.

---

# 115. Made-to-Order Handoff

Production output:

```text id="ful075"
QC PASS
↓
ALLOCATED TO ORDER
↓
FULFILLMENT READY
```

---

# 116. Production-to-Fulfillment Handoff

Required:

```text id="ful076"
GOOD QTY
ORDER LINK
PRODUCT IDENTITY
QC RESULT
```

---

# 117. No Anonymous Finished Goods

Completed custom items should not arrive at fulfillment as unlabelled pile.

---

# 118. Fulfillment Batch

Multiple orders may be grouped operationally.

This should not erase order-level traceability.

---

# 119. Kitting

Kitting combines multiple components into one package/product bundle.

Can sit between:

- production,
- fulfillment.

---

# 120. Bundle Order

A commercial bundle may require picking multiple SKUs.

---

# 121. Kit Assembly

If components are physically assembled into a stocked new unit:

this may be Production.

If merely packed together per order:

usually Fulfillment.

---

# 122. Gift Orders

Potential supported attributes:

```text id="ful077"
GIFT NOTE
NO PRICE
SPECIAL PACK
```

Only if standardized.

---

# 123. Bulk Business Fulfillment

Business orders may require:

```text id="ful078"
BULK CARTON
PER PERSON PACKING
DEPARTMENT SORTING
MULTI-LOCATION SHIPPING
```

---

# 124. Size Sorting

Large Business orders should reconcile size breakdown before shipping.

---

# 125. Packing by Person

May require identifier:

```text id="ful079"
EMPLOYEE NAME
DEPARTMENT
SIZE
```

---

# 126. Multi-Destination Business Order

One commercial Order may create multiple shipments.

---

# 127. International Fulfillment

Future only.

Requires extra:

- customs,
- duties,
- paperwork,
- carrier rules.

Not V1 priority.

---

# 128. Fulfillment Exceptions

Canonical categories:

```text id="ful080"
STOCK
ADDRESS
PAYMENT
QC
PACKING
CARRIER
DELIVERY
CUSTOMER REQUEST
```

---

# 129. Exception Queue

Future MGBOS:

```text id="ful081"
PICK SHORT
ADDRESS HOLD
PACKING ISSUE
LATE SHIPMENT
FAILED DELIVERY
RTS
LOST SHIPMENT
```

---

# 130. Exception Lifecycle

```text id="ful082"
OPEN
↓
ASSIGNED
↓
ACTION
↓
RESOLVED
↓
CLOSED
```

---

# 131. Exception Owner

Every fulfillment exception requires owner.

---

# 132. Exception SLA

High customer-impact issues should have response targets.

---

# 133. Operational Incident

Significant fulfillment failure may become Incident.

Example:

```text id="ful083"
50 orders shipped with wrong labels
```

---

# 134. Root Cause

Potential:

```text id="ful084"
PICK ERROR
LABEL ERROR
SYSTEM MAPPING
PACKING ERROR
INVENTORY ERROR
CARRIER FAILURE
```

---

# 135. Fulfillment Quality

Key quality dimensions:

```text id="ful085"
ACCURACY
CONDITION
COMPLETENESS
TIMELINESS
```

---

# 136. Order Accuracy

Canonical:

> Percentage of fulfilled orders without item/quantity/customization error.

---

# 137. Pick Accuracy

Can measure earlier than customer outcome.

---

# 138. Pack Accuracy

Useful where packaging/insert complexity exists.

---

# 139. On-Time Ship Rate

Measures:

```text id="ful086"
SHIPMENTS HANDED TO CARRIER
by committed dispatch deadline
```

---

# 140. Delivery Success Rate

Carrier/customer dependent.

Still important customer metric.

---

# 141. Order-to-Ship Time

Canonical:

```text id="ful087"
FULFILLMENT READY
→
CARRIER HANDOFF
```

---

# 142. Pick-to-Pack Time

Useful for warehouse efficiency.

---

# 143. Cost per Order

Potential:

```text id="ful088"
PICK
PACK
PACKAGING
HANDLING
```

excluding or including shipping depending definition.

---

# 144. Cost per Item

Can reveal complexity differences.

---

# 145. Fulfillment Labor

At scale, track:

- order throughput,
- labor hours.

---

# 146. Throughput

Potential:

```text id="ful089"
ORDERS / DAY
ITEMS / DAY
```

---

# 147. Capacity

Fulfillment capacity depends on:

```text id="ful090"
PEOPLE
SPACE
PACK STATIONS
CARRIER CUTOFF
ORDER COMPLEXITY
```

---

# 148. Peak Planning

Before:

- launches,
- campaigns,
- creator drops,

estimate fulfillment load.

---

# 149. Order Complexity

A 1-item standard order differs from:

- 20-item personalized order.

Capacity planning should eventually account for complexity.

---

# 150. Fulfillment SLA

May differ by:

```text id="ful091"
READY STOCK
MADE TO ORDER
BUSINESS
DROPSHIP
```

---

# 151. Fulfillment Promise Discipline

Do not publish dispatch SLA faster than reliable operating capability.

---

# 152. Cutoff Time

Can define:

> orders fulfillment-ready before X enter same-day queue.

Only once operations can consistently support it.

---

# 153. Weekend/Holiday Calendar

SLA must reflect non-operating days if relevant.

---

# 154. Carrier Performance

Track:

```text id="ful092"
COST
DELIVERY TIME
SUCCESS RATE
DAMAGE
LOSS
CLAIMS
```

---

# 155. Carrier Scorecard

Can guide carrier routing.

---

# 156. Multi-Carrier Strategy

Useful when:

```text id="ful093"
DESTINATION
COST
SERVICE
RISK
```

vary materially.

---

# 157. Carrier Concentration

Single carrier dependence may create disruption risk.

---

# 158. Packaging Performance

Track whether packaging prevents transit damage.

---

# 159. Packaging Optimization

Canonical:

```text id="ful094"
ENOUGH PROTECTION
+
MINIMUM NECESSARY COMPLEXITY
```

---

# 160. Sustainability

Packaging decisions can consider material efficiency.

Do not make unsupported environmental claims.

---

# 161. Fulfillment and Customer Service

Customer Ops should see:

```text id="ful095"
PICK STATUS
SHIPMENT
TRACKING
EXCEPTION
```

without messaging warehouse manually.

---

# 162. Proactive Communication

If delay is known:

customer should ideally be informed before repeatedly asking.

---

# 163. Fulfillment and Returns

Delivered order may later create:

```text id="ful096"
RETURN REQUEST
```

handled by returns framework.

---

# 164. RTS and Return Difference

Must remain separate for analytics and cost attribution.

---

# 165. Fulfillment and Finance

Fulfillment creates financial implications:

```text id="ful097"
SHIPPING COST
PACKAGING COST
FULFILLMENT FEE
CARRIER CLAIM
```

---

# 166. Shipping Cost Capture

Actual carrier cost should map to Shipment/order where practical.

---

# 167. External Fulfillment Revenue

For TeeStock Fulfill clients:

potential charges:

```text id="ful098"
PICK FEE
PACK FEE
STORAGE
INBOUND
RETURN
SPECIAL HANDLING
```

as defined commercially.

---

# 168. Fulfillment P&L

External fulfillment service should eventually know:

```text id="ful099"
REVENUE
VARIABLE LABOR
PACKAGING
SPACE
SYSTEM
ERROR COST
```

---

# 169. Fulfillment Data Model

Core entities:

```text id="ful100"
ORDER
ORDER ITEM
FULFILLMENT RELEASE
ALLOCATION
PICK
PACKAGE
SHIPMENT
SHIPMENT ITEM
CARRIER
TRACKING EVENT
FULFILLMENT EXCEPTION
```

---

# 170. Fulfillment Release Entity

Records eligibility to begin warehouse execution.

---

# 171. Allocation Entity

Links order demand to inventory.

---

# 172. Pick Entity

Records physical retrieval.

---

# 173. Package Entity

Represents physical parcel/carton.

---

# 174. Shipment Entity

Represents transport movement.

---

# 175. Shipment Item

Links specific order items/qty into Shipment.

---

# 176. Tracking Event

Represents carrier status updates.

---

# 177. Fulfillment Exception

Represents deviation needing action.

---

# 178. Package vs Shipment

Potential:

```text id="ful101"
ONE SHIPMENT
can contain
ONE OR MULTIPLE PACKAGES
```

if carrier/system requires.

V1 can simplify if unnecessary.

---

# 179. Fulfillment Data Lineage

Canonical:

```text id="ful102"
ORDER
↓
ORDER ITEM
↓
INVENTORY ALLOCATION
↓
PICK
↓
PACKAGE
↓
SHIPMENT
↓
TRACKING
↓
DELIVERY
```

---

# 180. Fulfillment Events

Potential:

```text id="ful103"
fulfillment.ready
pick.started
pick.completed
package.closed
shipment.created
shipment.handed_over
shipment.delivered
shipment.failed
shipment.returned
```

---

# 181. Event Consumers

Can trigger:

```text id="ful104"
CUSTOMER NOTIFICATION
INVENTORY MOVEMENT
FINANCE COST
SUPPORT TASK
ANALYTICS
```

---

# 182. MGBOS Fulfillment Dashboard

Potential:

```text id="ful105"
READY TO PICK
PICKING
PACKING
READY TO SHIP
LATE SHIPMENTS
FAILED DELIVERY
RTS
ORDER ACCURACY
```

---

# 183. Fulfillment Workstation View

Future UI should show only:

```text id="ful106"
ORDER
ITEMS
LOCATION
PACKING RULE
SHIPPING METHOD
EXCEPTION
```

necessary to execute.

---

# 184. Automation Opportunities

Potential:

```text id="ful107"
Fulfillment Release
Pick List Generation
Carrier Recommendation
Shipping Label Generation
Tracking Sync
Delivery Notifications
Failed Delivery Alert
```

---

# 185. Automatic Fulfillment Release

Safe when:

```text id="ful108"
PAYMENT
QC
INVENTORY
ADDRESS
```

rules are deterministic.

---

# 186. Automatic Carrier Selection

Possible later from:

```text id="ful109"
DESTINATION
PACKAGE
SLA
COST
CARRIER PERFORMANCE
```

---

# 187. Auto Label Generation

Strong automation candidate once canonical addresses/package data are reliable.

---

# 188. AI Role

AI may assist:

```text id="ful110"
Exception Summary
Carrier Performance Analysis
Delivery Risk Detection
Packing Recommendation
Customer Communication Draft
```

---

# 189. AI Fulfillment Boundary

AI should not independently:

```text id="ful111"
CHANGE SHIPPING ADDRESS
IGNORE ORDER HOLD
SUBSTITUTE PRODUCT
WRITE OFF LOST SHIPMENT
```

without approved rule/human action.

---

# 190. AI Carrier Recommendation

Can recommend.

Final routing can become deterministic/automated once rules are proven.

---

# 191. Fulfillment Maturity Model

```text id="ful112"
LEVEL 0
Manual packing + chat tracking

LEVEL 1
Pick list + shipment records

LEVEL 2
Inventory allocation + tracking sync

LEVEL 3
Barcode verification + carrier integration

LEVEL 4
Automated routing / warehouse workflows

LEVEL 5
Exception-based AI fulfillment orchestration
```

---

# 192. Level 0

Anti-goal.

Order fulfillment depends on:

- memory,
- manual retyping,
- parcel screenshots.

---

# 193. Level 1

Minimum viable control:

```text id="ful113"
FULFILLMENT READY
PICK LIST
PACK
SHIPMENT
TRACKING
```

---

# 194. Level 2

Adds:

```text id="ful114"
ALLOCATION
INVENTORY SYNC
EXCEPTION QUEUE
TRACKING EVENTS
```

---

# 195. Level 3

Adds:

```text id="ful115"
BARCODE
CARRIER API
MULTI-CHANNEL SYNC
```

---

# 196. Level 4

Adds:

```text id="ful116"
BATCH / WAVE PICKING
AUTOMATED CARRIER SELECTION
MULTI-HUB ROUTING
```

---

# 197. Level 5

System manages normal fulfillment automatically and escalates:

```text id="ful117"
STOCK SHORTAGE
ADDRESS ISSUE
LATE SHIPMENT
FAILED DELIVERY
```

---

# 198. Current Recommended Stage

TeeStock should target:

```text id="ful118"
LEVEL 1
→
LEVEL 2
```

first.

---

# 199. V1 Required Capabilities

Priority:

```text id="ful119"
Fulfillment Ready State
Reservation / Allocation
Pick List
Verification
Package
Shipment
Tracking Number
Exception
```

---

# 200. V1 Packaging

Keep:

```text id="ful120"
STANDARD
LIMITED VARIANTS
EASY TO STOCK
```

---

# 201. V1 Carrier Model

Use few reliable carrier options.

Avoid integration explosion.

---

# 202. V1 Multi-Channel

Normalize all active sales channels into same fulfillment workflow.

---

# 203. V1 Avoid

Do not immediately build:

```text id="ful121"
complex WMS waves
robotics
multi-hub optimization
dozens of courier integrations
dynamic packaging AI
```

---

# 204. V2 Expansion

Possible:

```text id="ful122"
BARCODE PICKING
AUTOMATED SHIPPING LABEL
CARRIER TRACKING SYNC
BATCH PICKING
```

---

# 205. V3 Expansion

Possible:

```text id="ful123"
MULTI-CARRIER ROUTING
FULFILLMENT CLIENT PORTAL
SLA AUTOMATION
ADVANCED CAPACITY PLANNING
```

---

# 206. V4 Expansion

Possible:

```text id="ful124"
MULTI-HUB
DISTRIBUTED FULFILLMENT
PREDICTIVE DELIVERY RISK
AUTOMATED EXCEPTION ROUTING
```

---

# 207. Fulfillment Release Gate

Order may release only when:

```text id="ful125"
ITEMS READY
+
QC PASSED
+
INVENTORY ALLOCATED
+
ADDRESS VALID
+
COMMERCIAL CONDITIONS MET
```

---

# 208. Shipment Gate

Shipment may be handed to carrier only when:

```text id="ful126"
PICK COMPLETE
+
VERIFICATION PASS
+
PACK COMPLETE
+
LABEL / ADDRESS VALID
```

---

# 209. Completion Gate

Order becomes Fulfilled when:

```text id="ful127"
ALL REQUIRED ORDER ITEMS
have been assigned to valid shipments
```

according to business logic.

---

# 210. Delivery Completion

Customer journey may become Complete only after:

```text id="ful128"
DELIVERY CONFIRMED
```

if system tracks carrier delivery.

---

# 211. Split Shipment Gate

Use only when customer/SLA/business value exceeds additional cost/complexity.

---

# 212. Multi-Hub Gate

Only when:

```text id="ful129"
VOLUME
GEOGRAPHY
DELIVERY SLA
COST SAVING
```

justify fragmented inventory.

---

# 213. External Fulfill Activation Gate

TeeStock Fulfill should onboard external clients only after internal operation shows:

```text id="ful130"
HIGH ORDER ACCURACY
RELIABLE INVENTORY
STABLE SLA
VISIBLE COST PER ORDER
CONTROLLED RETURNS
```

---

# 214. Fulfillment Failure Modes

## Pick Without Allocation

Inventory conflict.

## Pack Without Verification

Wrong-order risk.

## Order = Shipment

Breaks split shipment logic.

## Tracking in Chat Only

No canonical visibility.

## Returned Shipment = Available Inventory

Quality risk.

## Too Many Packaging Exceptions

Operational chaos.

## Customer Address Retyped Manually

Error risk.

## Shipping Cost Not Captured

Margin distortion.

## Carrier Failure Not Tracked

No routing improvement.

---

# 215. What Fulfillment Must Not Become

## Courier Booking Desk

Fulfillment is end-to-end physical order control.

## Warehouse Black Box

Commerce and Customer Ops need status visibility.

## Custom Packaging Factory

Packaging complexity must create value.

## Exception by WhatsApp

Issues need structured ownership.

## Delivery Promise Theater

Published SLA must reflect real operational capability.

---

# 216. Fulfillment Success Definition

The system succeeds when TeeStock can answer:

```text id="ful131"
WHICH ORDERS
are ready?

WHAT
must be picked?

WHERE
is inventory?

WAS
the correct product verified?

HOW
was it packed?

WHICH SHIPMENT
contains each item?

WHICH CARRIER
has it?

WHERE
is it now?

WAS IT DELIVERED?

WHAT WENT WRONG
if it was not?
```

---

# 217. Canonical Fulfillment Summary

```text id="ful132"
ORDER
defines customer commitment.

INVENTORY
provides physical availability.

ALLOCATION
protects the stock.

PICK
retrieves it.

VERIFY
protects accuracy.

PACK
protects the product.

SHIPMENT
moves it.

TRACKING
reveals progress.

EXCEPTION
handles deviation.

MGBOS
connects customer promise to physical delivery.
```

---

# 218. Canonical Fulfillment Principles

```text id="ful133"
READY BEFORE RELEASE.

RESERVE BEFORE PICK.

PICK BEFORE PACK.

VERIFY BEFORE CLOSE.

PACK FOR PROTECTION AND CLARITY.

SHIPMENT IS NOT ORDER.

TRACK EVERY SHIPMENT.

FAILED DELIVERY IS AN EXCEPTION, NOT A MYSTERY.

RETURNED IS NOT AVAILABLE.

ONE ORDER MAY HAVE MANY SHIPMENTS.

CAPTURE ACTUAL SHIPPING COST.

STANDARDIZE BEFORE WAREHOUSE AUTOMATION.

ACCURACY BEFORE SPEED.

DELIVER THE PROMISE, NOT JUST THE PACKAGE.
```

---

# 219. Dependency

Dokumen berikut harus follow Order Fulfillment System:

1. [[bisnis/teestock/07-operations/customer-service|customer-service.md]]
2. [[bisnis/teestock/07-operations/returns-and-warranty|returns-and-warranty.md]]
3. [[bisnis/teestock/08-finance/financial-model|financial-model.md]]
4. [[bisnis/teestock/08-finance/unit-economics|unit-economics.md]]
5. [[bisnis/teestock/08-finance/cost-accounting|cost-accounting.md]]
6. [[bisnis/teestock/09-marketing/retention-and-community|retention-and-community.md]]
7. [[bisnis/teestock/10-product-tech/commerce-platform|commerce-platform.md]]
8. [[bisnis/teestock/10-product-tech/automation-architecture|automation-architecture.md]]
9. [[bisnis/teestock/11-data-mgbos/canonical-data-model|canonical-data-model.md]]
10. [[bisnis/teestock/11-data-mgbos/entity-hierarchy|entity-hierarchy.md]]
11. [[bisnis/teestock/11-data-mgbos/event-model|event-model.md]]
12. [[bisnis/teestock/11-data-mgbos/mgbos-integration|mgbos-integration.md]]
13. [[bisnis/teestock/13-metrics-experiments/kpi-framework|kpi-framework.md]]

TeeStock Fulfillment boleh berkembang menjadi multi-carrier, multi-client, barcode-enabled, multi-hub, dan highly automated operation, tetapi automation hanya boleh dibangun di atas reliable inventory allocation, clear fulfillment readiness, disciplined verification, canonical shipments, tracking visibility, and structured exception handling.