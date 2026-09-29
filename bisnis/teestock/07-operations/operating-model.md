---
title: "TeeStock Operating Model"
date: "2026-09-28"
bisnis: teestock
kategori: operasional
status: active
tags:
  - bisnis/teestock
  - kategori/operasional
  - teestock/canonical
  - teestock/operations
document_id: "TS-OPS-001"
version: "1.0"
category: "operations"
business: "teestock"
last_updated: "2026-09-28"
path: "07-operations/operating-model.md"
depends_on:
  - "TS-FND-001"
  - "TS-FND-002"
  - "TS-STR-001"
  - "TS-STR-002"
  - "TS-STR-003"
  - "TS-STR-004"
  - "TS-COM-001"
  - "TS-SVC-001"
  - "TS-SVC-007"
  - "TS-ORG-001"
  - "TS-PRG-001"
  - "TS-PRG-004"
---


# TeeStock Operating Model v1.0

> [!tip] **Canonical TeeStock Operating System Architecture  **
> Dokumen ini mendefinisikan bagaimana TeeStock menjalankan pekerjaan sehari-hari melalui canonical workflows, ownership, control points, internal/external execution, decision rights, exception handling, operating cadence, data capture, dan progressive automation menuju MGBOS.
>
> [!info] **Dependencies & Data Flow (SSOT)**
> [[bisnis/teestock/00-foundation/teestock-master-definition|TS-FND-001: TeeStock Master Definition]] • [[bisnis/teestock/00-foundation/glossary|TS-FND-002: TeeStock Glossary]] • [[bisnis/teestock/01-strategy/business-thesis|TS-STR-001: TeeStock Business Thesis]] • [[bisnis/teestock/01-strategy/business-model|TS-STR-002: TeeStock Business Model]] • [[bisnis/teestock/01-strategy/ecosystem-architecture|TS-STR-003: TeeStock Ecosystem Architecture]] • [[bisnis/teestock/01-strategy/growth-strategy|TS-STR-004: TeeStock Growth Strategy]] • [[bisnis/teestock/03-commerce/commerce-overview|TS-COM-001: TeeStock Commerce Overview]] • [[bisnis/teestock/04-services/services-overview|TS-SVC-001: TeeStock Services Overview]] • [[bisnis/teestock/04-services/fulfill|TS-SVC-007: TeeStock Fulfill]] • [[bisnis/teestock/05-originals/originals-master-plan|TS-ORG-001: TeeStock Originals Master Plan]] • [[bisnis/teestock/06-programs/programs-overview|TS-PRG-001: TeeStock Programs Overview]] • [[bisnis/teestock/06-programs/partner-program|TS-PRG-004: TeeStock Partner Program]]


---

# 1. Purpose

Operating Model menjawab:

> **Bagaimana seluruh bagian TeeStock bekerja bersama dari demand sampai customer menerima hasil tanpa bergantung pada ingatan founder, chat, atau improvisasi?**

Canonical principle:

> **Run the business through systems, not memory.**

---

# 2. Canonical Definition

> **TeeStock Operating Model adalah struktur operasional yang mengubah demand, opportunities, products, services, inventory, production requirements, partner capabilities, orders, dan customer commitments menjadi repeatable workflows dengan clear ownership, canonical data, measurable controls, dan exception-based management.**

---

# 3. Operating Philosophy

Canonical progression:

```text id="ops001"
MANUAL
↓
OBSERVE
↓
STANDARDIZE
↓
MEASURE
↓
AUTOMATE
↓
ORCHESTRATE
```

Do not automate chaos.

---

# 4. Core Operating Objective

TeeStock harus mampu:

```text id="ops002"
RECEIVE DEMAND
↓
UNDERSTAND REQUIREMENT
↓
COMMIT REALISTIC OUTCOME
↓
EXECUTE
↓
CONTROL QUALITY
↓
DELIVER
↓
RECONCILE
↓
LEARN
```

---

# 5. Operating Model Principles

Canonical:

```text id="ops003"
ONE SOURCE OF TRUTH

CLEAR OWNER

CLEAR STATUS

CLEAR NEXT ACTION

CLEAR APPROVAL

CLEAR HANDOFF

CLEAR EXCEPTION

CLEAR ECONOMICS
```

---

# 6. Operating Domains

TeeStock operations consist of:

```text id="ops004"
DEMAND OPERATIONS
COMMERCIAL OPERATIONS
PRODUCT OPERATIONS
PROCUREMENT
PRODUCTION
QUALITY
INVENTORY
FULFILLMENT
CUSTOMER OPERATIONS
FINANCE OPERATIONS
PARTNER OPERATIONS
DATA / MGBOS
```

---

# 7. Operational Flow Architecture

Canonical high-level flow:

```text id="ops005"
DEMAND
↓
QUALIFICATION
↓
COMMERCIAL COMMITMENT
↓
PRODUCT / SERVICE CONFIGURATION
↓
PROCUREMENT / INVENTORY
↓
PRODUCTION
↓
QUALITY CONTROL
↓
FULFILLMENT
↓
CUSTOMER DELIVERY
↓
FINANCIAL RECONCILIATION
↓
LEARNING
```

---

# 8. Not Every Order Uses Every Stage

Example:

```text id="ops006"
ESSENTIALS READY STOCK
Order
→ Reserve
→ Pick
→ Pack
→ Ship
```

versus:

```text id="ops007"
CUSTOM
Lead
→ Configure
→ Artwork
→ Quote
→ Payment
→ Production
→ QC
→ Ship
```

---

# 9. Canonical Business Flows

TeeStock should recognize several major operating flows:

```text id="ops008"
LEAD-TO-ORDER
ORDER-TO-CASH
PROCURE-TO-PAY
ORDER-TO-FULFILL
CONCEPT-TO-LAUNCH
WORK-ORDER-TO-COMPLETE
RETURN-TO-RESOLUTION
PARTNER-TO-PAYOUT
```

---

# 10. Lead-to-Order

Used primarily for:

```text id="ops009"
CUSTOM
BUSINESS
MERCH
STUDIO
SUPPLY
SELECT FULFILL SERVICES
```

Canonical:

```text id="ops010"
LEAD
↓
QUALIFY
↓
REQUIREMENT
↓
SOLUTION
↓
QUOTE
↓
APPROVAL
↓
ORDER / PROJECT
```

---

# 11. Order-to-Cash

Canonical:

```text id="ops011"
ORDER
↓
PAYMENT CONDITION
↓
EXECUTION
↓
FULFILLMENT
↓
DELIVERY
↓
REVENUE / RECEIVABLE
↓
SETTLEMENT
```

---

# 12. Procure-to-Pay

Canonical:

```text id="ops012"
DEMAND / REORDER NEED
↓
PURCHASE REQUEST
↓
SUPPLIER / PARTNER SELECTION
↓
PURCHASE ORDER
↓
RECEIVE
↓
QC
↓
INVOICE
↓
PAYMENT
```

---

# 13. Order-to-Fulfill

Canonical:

```text id="ops013"
FULFILLMENT-READY ORDER
↓
RESERVE
↓
PICK / PRODUCE
↓
QC
↓
PACK
↓
SHIP
↓
TRACK
↓
DELIVER
```

---

# 14. Concept-to-Launch

Used for:

- Selects,
- Originals,
- Creator drops,
- products.

Canonical:

```text id="ops014"
INSIGHT / OPPORTUNITY
↓
CONCEPT
↓
PRODUCT
↓
SAMPLE
↓
ECONOMICS
↓
LAUNCH READINESS
↓
PUBLISH
↓
SELL
↓
REVIEW
```

---

# 15. Work-Order-to-Complete

Used for partner/internal production work.

```text id="ops015"
REQUIREMENT
↓
WORK ORDER
↓
ACCEPT
↓
EXECUTE
↓
QC
↓
RECEIVE
↓
CLOSE
```

---

# 16. Return-to-Resolution

```text id="ops016"
RETURN / CLAIM
↓
CLASSIFY
↓
RECEIVE EVIDENCE / PRODUCT
↓
INSPECT
↓
RESOLVE
↓
REFUND / REPLACE / REPAIR
↓
RECONCILE
↓
ROOT CAUSE
```

---

# 17. Partner-to-Payout

For:

- creators,
- affiliates,
- operational partners.

Canonical:

```text id="ops017"
VALID ACTIVITY
↓
EARNING / INVOICE
↓
VALIDATE
↓
APPROVE
↓
PAY
↓
RECONCILE
```

---

# 18. Operating Object Model

Core operational objects:

```text id="ops018"
LEAD
OPPORTUNITY
QUOTE
ORDER
ORDER ITEM
PROJECT
WORK ORDER
PURCHASE ORDER
INVENTORY
SHIPMENT
RETURN
PAYMENT
PAYOUT
INCIDENT
```

---

# 19. Object Principle

Every real operational commitment should exist as structured object.

Not only:

- WhatsApp message,
- verbal request,
- memory.

---

# 20. Status-Driven Operations

Every object should have explicit status.

Example:

```text id="ops019"
ORDER
PENDING
CONFIRMED
PROCESSING
READY
SHIPPED
COMPLETED
CANCELLED
```

---

# 21. Status Has Meaning

Status should indicate:

```text id="ops020"
WHAT IS TRUE NOW
+
WHAT CAN HAPPEN NEXT
```

---

# 22. No Decorative Status

Avoid statuses that do not change workflow.

Each status should support action or control.

---

# 23. Next Action

Mature MGBOS should determine:

```text id="ops021"
WHAT NEEDS TO HAPPEN NEXT?
WHO OWNS IT?
WHEN IS IT DUE?
```

for every active object.

---

# 24. Ownership

Every active workflow must have:

```text id="ops022"
ACCOUNTABLE OWNER
```

---

# 25. Owner vs Executor

Canonical:

```text id="ops023"
OWNER
accountable for outcome.

EXECUTOR
performs task.
```

One person may initially be both.

---

# 26. Partner Execution

When Partner executes:

```text id="ops024"
PARTNER
= executor

TEEStock
= owner of customer commitment
```

---

# 27. Handoff

A handoff occurs when operational ownership of next action changes.

Examples:

```text id="ops025"
Sales
→ Production

Production
→ QC

QC
→ Fulfillment
```

---

# 28. Handoff Requirements

Before handoff:

```text id="ops026"
REQUIRED DATA COMPLETE
+
PREVIOUS STEP ACCEPTED
+
NEXT OWNER CLEAR
```

---

# 29. Bad Handoff

Example:

> “Ini ordernya ya, tolong kerjain.”

without:

- spec,
- qty,
- deadline,
- approved artwork.

---

# 30. Definition of Ready

Each workflow stage should eventually define:

```text id="ops027"
DEFINITION OF READY
```

---

# 31. Example — Production Ready

```text id="ops028"
Product Spec Complete
Artwork Approved
Qty Confirmed
Method Defined
Material Available
Payment Condition Met
```

---

# 32. Definition of Done

Each stage should also define:

```text id="ops029"
DEFINITION OF DONE
```

---

# 33. Example — Production Done

```text id="ops030"
Required Qty Produced
QC Passed
Output Count Recorded
Materials Reconciled
Ready for Handoff
```

---

# 34. Control Points

Control points protect:

```text id="ops031"
QUALITY
MARGIN
CASH
CUSTOMER PROMISE
IP
INVENTORY
```

---

# 35. Common Control Points

Potential:

```text id="ops032"
QUOTE APPROVAL
PAYMENT CONFIRMATION
ARTWORK APPROVAL
SAMPLE APPROVAL
PURCHASE APPROVAL
PRODUCTION RELEASE
QC RELEASE
REFUND APPROVAL
```

---

# 36. Approval Philosophy

Not everything requires human approval.

Canonical progression:

```text id="ops033"
HIGH RISK
→ HUMAN APPROVAL

LOW RISK / STANDARD
→ RULE-BASED EXECUTION
```

---

# 37. Approval Thresholds

May depend on:

```text id="ops034"
ORDER VALUE
MARGIN
INVENTORY COMMITMENT
CREDIT
IP RISK
CUSTOMIZATION
```

---

# 38. Exception-Based Management

Long-term objective:

```text id="ops035"
NORMAL WORK
flows automatically.

EXCEPTIONS
receive human attention.
```

---

# 39. Exception Definition

An Exception is a condition outside normal expected workflow.

Examples:

```text id="ops036"
MISSING STOCK
LOW MARGIN
DELAY
FAILED QC
PAYMENT ISSUE
ADDRESS ISSUE
PARTNER FAILURE
IP HOLD
```

---

# 40. Exception Object

Future MGBOS should represent:

```text id="ops037"
EXCEPTION
```

with:

```text id="ops038"
TYPE
SEVERITY
RELATED OBJECT
OWNER
STATUS
ROOT CAUSE
RESOLUTION
```

---

# 41. Exception Severity

Potential:

```text id="ops039"
LOW
MEDIUM
HIGH
CRITICAL
```

---

# 42. Critical Exception

May involve:

- major customer impact,
- legal risk,
- large financial loss,
- widespread operational outage.

---

# 43. Escalation

Exception should define:

```text id="ops040"
WHEN
WHO
HOW FAST
```

to escalate.

---

# 44. Root Cause vs Symptom

Example:

```text id="ops041"
SYMPTOM
wrong size shipped

ROOT CAUSE
pick verification absent
```

Operations should solve both:

- immediate order,
- system cause.

---

# 45. Incident Management

For significant operational failure:

```text id="ops042"
DETECT
↓
CONTAIN
↓
RESOLVE
↓
COMMUNICATE
↓
ROOT CAUSE
↓
PREVENT RECURRENCE
```

---

# 46. Incident Record

Minimum:

```text id="ops043"
Incident ID
Type
Severity
Affected Orders
Owner
Root Cause
Resolution
Cost
Preventive Action
```

---

# 47. Demand Intake

Demand can enter through:

```text id="ops044"
WEBSITE
MARKETPLACE
WHATSAPP
SOCIAL
CREATOR
RESELLER
AFFILIATE
DIRECT SALES
```

---

# 48. Demand Normalization

All inbound demand should eventually normalize into canonical objects:

```text id="ops045"
ORDER
or
LEAD
```

not remain trapped in channel.

---

# 49. Channel Is Not Source of Truth

Canonical:

```text id="ops046"
CHANNEL
captures interaction.

MGBOS
owns canonical operational state.
```

---

# 50. Commerce Order

For standard ready products:

```text id="ops047"
CUSTOMER
↓
CART
↓
CHECKOUT
↓
PAYMENT
↓
ORDER
```

---

# 51. Service Lead

For consultative needs:

```text id="ops048"
INQUIRY
↓
LEAD
↓
QUALIFICATION
```

---

# 52. Lead Qualification

Standard questions:

```text id="ops049"
WHO
WHAT
QTY
BUDGET
DEADLINE
FIT
```

vary by service.

---

# 53. Qualified Lead

Means:

> enough evidence exists to justify further sales effort.

Not necessarily:

> guaranteed customer.

---

# 54. Opportunity

Use when commercial deal becomes concrete.

---

# 55. Quote

Quote converts requirement into:

```text id="ops050"
SCOPE
PRICE
TERMS
TIMING
```

---

# 56. Quote Versioning

Any material change creates new quote version.

---

# 57. Quote Approval

Customer acceptance should be traceable.

---

# 58. Quote to Order

Canonical:

```text id="ops051"
APPROVED QUOTE
↓
ORDER / PROJECT
```

No manual re-entry of data where avoidable.

---

# 59. Order

Order represents commercial commitment.

---

# 60. Order Item

Each item should know:

```text id="ops052"
PRODUCT / SERVICE
VARIANT / CONFIGURATION
QTY
PRICE
SOURCE / ATTRIBUTION
```

---

# 61. Project

Use Project when fulfillment requires:

```text id="ops053"
MULTIPLE DELIVERABLES
MILESTONES
CUSTOM SCOPE
```

---

# 62. Project and Order

One Project may have:

```text id="ops054"
ONE OR MULTIPLE ORDERS
```

depending commercial structure.

---

# 63. Configuration

Custom work should use:

```text id="ops055"
ORDER-SPECIFIC CONFIGURATION
```

not create permanent Product every time.

---

# 64. Artwork Approval

Production must use approved artwork/version only.

---

# 65. Production Release

Canonical gate:

```text id="ops056"
ORDER CONFIRMED
+
REQUIRED PAYMENT
+
SPEC READY
+
ARTWORK READY
+
MATERIAL READY / PLANNED
=
RELEASE TO PRODUCTION
```

---

# 66. Material Planning

Production demand should create:

```text id="ops057"
MATERIAL REQUIREMENT
```

---

# 67. Material Source

Requirement may be fulfilled from:

```text id="ops058"
ON-HAND INVENTORY
INBOUND PURCHASE
PARTNER-SUPPLIED MATERIAL
CUSTOMER-SUPPLIED MATERIAL
```

subject to policy.

---

# 68. Inventory Reservation

If stock exists:

```text id="ops059"
AVAILABLE
↓
RESERVED
```

before consumption.

---

# 69. Shortage

If requirement exceeds availability:

```text id="ops060"
SHORTAGE
```

becomes exception/planning action.

---

# 70. Procurement Trigger

Shortage or planned demand may create:

```text id="ops061"
PURCHASE REQUEST
```

---

# 71. Purchase Request

Should state:

```text id="ops062"
WHAT
QTY
WHEN
WHY
REQUESTOR
```

---

# 72. Purchase Approval

High-value or non-standard purchase may need approval.

---

# 73. Purchase Order

Canonical commitment to supplier.

Should include:

```text id="ops063"
Supplier
Items
Qty
Price
Delivery Date
Terms
Destination
```

---

# 74. Supplier Confirmation

Supplier should confirm:

- availability,
- quantity,
- timing.

---

# 75. Inbound Receiving

When goods arrive:

```text id="ops064"
EXPECTED
vs
RECEIVED
```

must reconcile.

---

# 76. Incoming QC

Required where product/material quality matters.

---

# 77. Inventory Availability

Only accepted received goods become:

```text id="ops065"
AVAILABLE
```

subject to system status.

---

# 78. Production Planning

Production planning considers:

```text id="ops066"
ORDERS
DUE DATE
CAPACITY
MATERIAL
METHOD
PARTNER
```

---

# 79. Work Order Creation

Production requirement becomes:

```text id="ops067"
WORK ORDER
```

for internal or external execution.

---

# 80. Internal Work Order

Assigned to internal capability.

---

# 81. External Work Order

Assigned to Partner Program capability.

---

# 82. Routing

Canonical routing decision:

```text id="ops068"
CAPABILITY FIT
+
QUALITY
+
CAPACITY
+
SLA
+
COST
```

---

# 83. Scheduling

Work Order should have:

```text id="ops069"
PLANNED START
PLANNED COMPLETE
```

where useful.

---

# 84. Production Execution

Track:

```text id="ops070"
INPUT
PROCESS
OUTPUT
SCRAP
STATUS
```

at appropriate detail.

---

# 85. Production Output

Output should reconcile against Work Order quantity.

---

# 86. Scrap / Loss

Material loss should be recorded where material.

---

# 87. Rework

Failed output that can be corrected becomes:

```text id="ops071"
REWORK
```

---

# 88. Quality Control

QC sits between:

```text id="ops072"
PRODUCTION
and
FULFILLMENT / INVENTORY
```

---

# 89. QC Gate

Only passed goods proceed as sellable/fulfillable.

---

# 90. QC Failure

Creates:

```text id="ops073"
HOLD
REWORK
REPRODUCE
SCRAP
```

decision.

---

# 91. Quality Traceability

Quality issue should map to:

```text id="ops074"
PRODUCT
SKU
BATCH
WORK ORDER
PARTNER
```

where possible.

---

# 92. Finished Goods Receipt

Passed production output may become:

```text id="ops075"
FINISHED INVENTORY
```

or immediately fulfill order.

---

# 93. Made-to-Order

Canonical:

```text id="ops076"
ORDER
↓
PRODUCTION
↓
QC
↓
FULFILLMENT
```

---

# 94. Ready Stock

```text id="ops077"
ORDER
↓
RESERVATION
↓
PICK
↓
PACK
↓
SHIP
```

---

# 95. Hybrid Order

One Order may contain both.

System must define whether:

```text id="ops078"
SHIP TOGETHER
or
SPLIT SHIPMENT
```

---

# 96. Fulfillment Release

An Order becomes fulfillment-ready when:

```text id="ops079"
PAYMENT CONDITION MET
+
ITEMS READY
+
ADDRESS VALID
+
NO HOLD
```

---

# 97. Pick-Pack-Ship

Canonical:

```text id="ops080"
RELEASE
↓
PICK
↓
VERIFY
↓
PACK
↓
LABEL
↓
SHIP
```

---

# 98. Shipment

Shipment is separate from Order.

One Order can have multiple Shipments.

---

# 99. Tracking

Shipment tracking should flow back to customer-facing channels.

---

# 100. Delivery

Carrier delivery event can trigger:

- completion,
- follow-up,
- return window.

---

# 101. Customer Service

Customer operations should see:

```text id="ops081"
ORDER
PAYMENT
PRODUCTION
SHIPMENT
RETURN
```

without chasing multiple people manually.

---

# 102. Customer Contact

Every customer issue should be linked to relevant object.

Example:

```text id="ops082"
SUPPORT CASE
→ ORDER
```

---

# 103. Customer Case

Potential categories:

```text id="ops083"
ORDER STATUS
PRODUCT ISSUE
PAYMENT
DELIVERY
RETURN
CUSTOMIZATION
```

---

# 104. Support Case Lifecycle

```text id="ops084"
OPEN
↓
ASSIGNED
↓
INVESTIGATING
↓
RESOLVED
↓
CLOSED
```

---

# 105. Return Flow

Customer-approved returns should generate Return object.

---

# 106. Return Inspection

Returned products should not immediately return to available stock.

---

# 107. Refund

Refund should reference:

```text id="ops085"
ORDER
PAYMENT
RETURN / CASE
REASON
APPROVAL
```

---

# 108. Finance Integration

Operations must create finance events.

Examples:

```text id="ops086"
ORDER CONFIRMED
PAYMENT RECEIVED
SUPPLIER INVOICE
PARTNER PAYABLE
ROYALTY EARNING
REFUND
```

---

# 109. Revenue State

Commercial reporting should distinguish:

```text id="ops087"
ORDERED
PAID
FULFILLED
REFUNDED
```

rather than treating all as same revenue state.

---

# 110. Cost Capture

Operations should capture costs close to origin.

Examples:

```text id="ops088"
PRODUCT COST
PRODUCTION COST
PARTNER COST
PACKAGING
SHIPPING
ROYALTY
COMMISSION
```

---

# 111. Contribution Visibility

MGBOS should eventually estimate contribution before/after execution.

---

# 112. Margin Exception

Order may be flagged if:

```text id="ops089"
EXPECTED CONTRIBUTION
<
APPROVED FLOOR
```

---

# 113. Cash Control

No large operational commitment should ignore payment state.

---

# 114. Credit Customer

Business accounts with approved terms require separate receivable tracking.

---

# 115. Accounts Receivable

Track:

```text id="ops090"
INVOICE
DUE DATE
OUTSTANDING
STATUS
```

---

# 116. Accounts Payable

Partner/supplier obligations:

```text id="ops091"
INVOICE
APPROVAL
DUE DATE
PAYMENT
```

---

# 117. Reconciliation

Critical operational flows should reconcile:

```text id="ops092"
ORDER
PAYMENT
FULFILLMENT
FINANCE
```

---

# 118. Inventory Reconciliation

Canonical:

```text id="ops093"
SYSTEM
vs
PHYSICAL
```

---

# 119. Partner Reconciliation

```text id="ops094"
WORK ORDER
vs
RECEIPT
vs
INVOICE
```

---

# 120. Creator / Affiliate Reconciliation

```text id="ops095"
TRANSACTION
vs
EARNING
vs
PAYOUT
```

---

# 121. Operating Responsibility Model

At minimum, every workflow should identify:

```text id="ops096"
ACCOUNTABLE
RESPONSIBLE
APPROVER
INFORMED
```

Exact RACI framework may be simplified.

---

# 122. Early Founder Model

Early TeeStock may have founder covering:

- sales,
- approvals,
- operations.

This is acceptable temporarily.

But roles should still be conceptually separated in system design.

---

# 123. Role Separation Before Headcount

Canonical:

> **Define the role before hiring the person.**

---

# 124. Core Operational Roles

Potential future:

```text id="ops097"
COMMERCIAL
PRODUCT
PROCUREMENT
PRODUCTION
QUALITY
FULFILLMENT
CUSTOMER OPS
FINANCE
PROGRAM OPS
DATA / SYSTEM
```

---

# 125. Commercial Owner

Owns:

- lead,
- quote,
- customer expectation.

---

# 126. Product Owner

Owns:

- product truth,
- spec,
- assortment.

---

# 127. Procurement Owner

Owns:

- supplier,
- purchase,
- replenishment.

---

# 128. Production Owner

Owns:

- scheduling,
- Work Orders,
- output.

---

# 129. Quality Owner

Owns acceptance standards and defect resolution process.

---

# 130. Fulfillment Owner

Owns order dispatch flow.

---

# 131. Customer Ops Owner

Owns customer communication and cases.

---

# 132. Finance Owner

Owns:

- payment,
- receivable,
- payable,
- reconciliation.

---

# 133. Program Owner

Owns creator/reseller/partner/affiliate program health.

---

# 134. System Owner

Owns workflow/data integrity.

---

# 135. Internal vs External Execution

Each capability should classify:

```text id="ops098"
INTERNAL
EXTERNAL
HYBRID
```

---

# 136. Internal

TeeStock/MultiGraph performs directly.

---

# 137. External

Partner performs.

---

# 138. Hybrid

Different orders/routes can use either.

---

# 139. Execution Mode Should Be Data

Do not hardcode operational assumptions into business docs.

MGBOS should know route per Work Order.

---

# 140. Build vs Partner Review

Periodically ask:

```text id="ops099"
Should this capability remain external?
```

based on:

- volume,
- economics,
- quality,
- control,
- capital.

---

# 141. Operational Standardization

Standardize repeatable:

```text id="ops100"
INPUT
PROCESS
OUTPUT
QUALITY
STATUS
```

---

# 142. SOP

Detailed repeated work may get SOP.

Canonical hierarchy:

```text id="ops101"
POLICY
↓
PROCESS
↓
SOP
↓
TASK
```

---

# 143. Policy

Defines rules.

---

# 144. Process

Defines end-to-end flow.

---

# 145. SOP

Defines how to execute specific repeatable action.

---

# 146. Task

Individual work instance.

---

# 147. Avoid Over-Documentation

Do not write SOP for unstable one-off work.

Canonical:

```text id="ops102"
REPEAT
↓
STANDARDIZE
↓
DOCUMENT
```

---

# 148. Operating Cadence

TeeStock should eventually run on regular reviews.

Potential:

```text id="ops103"
DAILY
operational exceptions

WEEKLY
orders / production / inventory / cash

MONTHLY
performance / supplier / partner / service

QUARTERLY
strategy / capability / portfolio
```

---

# 149. Daily Review

Focus on:

```text id="ops104"
LATE ORDERS
BLOCKED ORDERS
PRODUCTION ISSUES
STOCKOUT
CUSTOMER ESCALATIONS
```

---

# 150. Weekly Review

Focus:

```text id="ops105"
DEMAND
ORDERS
CAPACITY
INVENTORY
CASH
PARTNER PERFORMANCE
```

---

# 151. Monthly Review

Focus:

```text id="ops106"
MARGIN
SERVICE PERFORMANCE
SUPPLIER
QUALITY
RETURNS
PROCESS IMPROVEMENT
```

---

# 152. Quarterly Review

Focus:

```text id="ops107"
CAPABILITY
VERTICAL INTEGRATION
AUTOMATION
TEAM
PORTFOLIO
CAPITAL
```

---

# 153. Operating Dashboard

Future top-level dashboard:

```text id="ops108"
TODAY'S ORDERS
LATE ORDERS
OPEN LEADS
PRODUCTION QUEUE
LOW STOCK
QC ISSUES
SHIPMENTS
CUSTOMER CASES
CASH ALERTS
```

---

# 154. Work Queues

MGBOS should organize work as queues.

Examples:

```text id="ops109"
Leads Needing Review
Quotes Awaiting Approval
Orders Ready for Production
QC Pending
Orders Ready to Ship
Returns Pending
```

---

# 155. Queue Discipline

Task should leave queue only when its exit condition is met.

---

# 156. SLA

Important processes should define service expectations.

Examples:

```text id="ops110"
Lead Response
Quote Turnaround
Production
Dispatch
Support
Return Processing
```

---

# 157. SLA Must Have Clock Definition

Define:

```text id="ops111"
START
PAUSE
STOP
```

events.

---

# 158. Internal SLA

Even when customer does not see it, internal SLA helps coordination.

---

# 159. Capacity Management

Capacity applies to:

```text id="ops112"
STUDIO
PRODUCTION
QC
FULFILLMENT
SUPPORT
```

---

# 160. Capacity Constraint

Order acceptance should consider real capacity.

---

# 161. Overbooking

Avoid committing:

```text id="ops113"
MORE DUE WORK
THAN CAPACITY CAN HANDLE
```

without escalation.

---

# 162. Capacity Forecast

Future MGBOS should combine:

```text id="ops114"
OPEN ORDERS
PLANNED LAUNCHES
PARTNER CAPACITY
INTERNAL CAPACITY
```

---

# 163. Peak Event Planning

Before:

- campaign,
- creator drop,
- business project,

review capacity.

---

# 164. Launch Readiness

Canonical launch gate:

```text id="ops115"
PRODUCT
INVENTORY
PRODUCTION
CONTENT
COMMERCE
SUPPORT
FULFILLMENT
```

ready.

---

# 165. Operational Readiness Overrides Marketing Date

Do not launch because calendar says so if core capability is not ready.

---

# 166. Quality Philosophy

Canonical:

```text id="ops116"
BUILD QUALITY INTO PROCESS
>
INSPECT QUALITY AT THE END
```

---

# 167. Quality at Source

Each executor should perform quality checks during process.

---

# 168. Final QC

Still required where customer impact warrants.

---

# 169. Quality Cost

Track:

```text id="ops117"
PREVENTION
APPRAISAL
FAILURE
```

conceptually.

---

# 170. Repeat Defects

Should trigger process improvement, not endless manual fixes.

---

# 171. Inventory Philosophy

Canonical:

```text id="ops118"
ONE PHYSICAL TRUTH
```

Shared product/inventory architecture across domains.

---

# 172. Inventory Is Not Spreadsheet Decoration

Inventory must drive:

- order promise,
- purchasing,
- production,
- cash.

---

# 173. Inventory States

At high level:

```text id="ops119"
INBOUND
ON_HAND
AVAILABLE
RESERVED
WIP
DAMAGED
QUARANTINE
```

---

# 174. Inventory Movement

Every movement should have reason/reference.

---

# 175. No Silent Adjustment

Manual inventory corrections require reason.

---

# 176. Order Promise

Never promise based on:

> “sepertinya stok ada.”

Promise should come from:

```text id="ops120"
AVAILABLE INVENTORY
or
CONFIRMED PRODUCTION / SUPPLY CAPABILITY
```

---

# 177. Customer Promise Date

Should be derived from:

```text id="ops121"
PRODUCT
INVENTORY
PRODUCTION
PARTNER
FULFILLMENT
```

not arbitrary sales optimism.

---

# 178. Due Date Risk

Future system should surface:

```text id="ops122"
AT RISK ORDERS
```

before they become late.

---

# 179. Change Management

Customer/project change after approval should create:

```text id="ops123"
CHANGE REQUEST
```

when material.

---

# 180. Change Request

Record:

```text id="ops124"
WHAT CHANGED
PRICE IMPACT
TIME IMPACT
APPROVAL
```

---

# 181. Scope Creep

Service work must prevent undocumented expansion.

---

# 182. Cancellation

Cancellation rules depend on stage.

Example:

```text id="ops125"
BEFORE PRODUCTION
more reversible.

AFTER CUSTOM PRODUCTION
less reversible.
```

---

# 183. Cancellation Must Reconcile

- inventory,
- partner commitments,
- payment,
- customer refund.

---

# 184. Operational Cost Awareness

Each process should progressively understand:

```text id="ops126"
LABOR
MATERIAL
PARTNER
TIME
FAILURE
```

cost.

---

# 185. Founder Time

Founder intervention is real operational cost.

Track qualitatively/quantitatively where material.

---

# 186. Manual Touch Count

Useful diagnostic:

> How many human interventions does one normal order require?

---

# 187. Automation Candidate

High-volume workflow with:

```text id="ops127"
STANDARD INPUT
STANDARD RULE
STANDARD OUTPUT
```

is strong automation candidate.

---

# 188. Bad Automation Candidate

Workflow with:

```text id="ops128"
UNCLEAR RULES
HIGH EXCEPTION
NO DATA
```

should not be automated yet.

---

# 189. Automation Hierarchy

Canonical:

```text id="ops129"
TEMPLATE
↓
RULE
↓
WORKFLOW
↓
AUTOMATION
↓
AI ASSIST
↓
AI EXECUTE
↓
AGENT ORCHESTRATION
```

---

# 190. Templates

Reduce repetitive manual drafting.

---

# 191. Rules

Make decisions deterministic.

---

# 192. Workflows

Connect tasks/objects.

---

# 193. Automation

System executes predictable steps.

---

# 194. AI Assist

AI suggests/summarizes.

---

# 195. AI Execute

AI may perform low-risk actions within guardrails.

---

# 196. Agent Orchestration

Multiple automated/AI components coordinate end-to-end process.

---

# 197. AI Operating Principle

Canonical:

> **AI handles cognition where useful. Rules handle deterministic control. Humans handle strategic judgment and exceptions.**

---

# 198. AI Good Use Cases

Potential:

```text id="ops130"
Lead Summary
Requirement Extraction
Quote Draft
Order Exception Summary
Partner Recommendation
Forecast Analysis
Customer Reply Draft
Root Cause Clustering
```

---

# 199. AI Bad Use Cases

AI should not independently:

```text id="ops131"
APPROVE LARGE CREDIT
CHANGE LEGAL TERMS
COMMIT UNKNOWN CAPACITY
IGNORE QC
WRITE OFF MATERIAL INVENTORY
```

---

# 200. Human-in-the-Loop

High-risk decisions require explicit approval.

---

# 201. Approval Queue

MGBOS should eventually surface:

```text id="ops132"
LOW MARGIN APPROVAL
CREDIT APPROVAL
PURCHASE APPROVAL
REFUND APPROVAL
PARTNER CHANGE
```

---

# 202. Audit Trail

Critical decisions should retain:

```text id="ops133"
WHO
WHAT
WHEN
WHY
```

---

# 203. Operational Data Principle

Canonical:

> **If an action changes customer, inventory, money, IP, or commitment, it should create a record.**

---

# 204. Event Model

Operational actions should emit events.

Examples:

```text id="ops134"
order.created
payment.received
work_order.completed
inventory.received
shipment.dispatched
return.received
```

Exact architecture belongs in Event Model doc.

---

# 205. Event-Driven Operations

Events can later trigger:

- notifications,
- tasks,
- automation,
- analytics.

---

# 206. Notification Philosophy

Notify people only when action/awareness is needed.

Avoid alert fatigue.

---

# 207. Customer Notifications

Examples:

```text id="ops135"
Payment Confirmed
Production Started
Shipped
Delivery Issue
```

depending service/product.

---

# 208. Internal Notifications

Focus on:

```text id="ops136"
EXCEPTION
DEADLINE
APPROVAL
RISK
```

---

# 209. Operational Documents

Potential generated artifacts:

```text id="ops137"
QUOTE
INVOICE
PURCHASE ORDER
WORK ORDER
PICK LIST
PACKING LIST
SHIPMENT LABEL
QC RECORD
```

---

# 210. Document Generation

Should increasingly derive from canonical data.

Avoid repeated manual typing.

---

# 211. Naming and IDs

Every operational object should have stable canonical identifier.

---

# 212. IDs vs Display Numbers

System internal IDs and customer-friendly numbers may differ.

---

# 213. Operational Source of Truth

Canonical hierarchy:

```text id="ops138"
MGBOS / CORE DATA
↓
OPERATIONAL VIEWS
↓
CHANNELS / DOCUMENTS
```

not reverse.

---

# 214. WhatsApp Role

WhatsApp is:

```text id="ops139"
COMMUNICATION CHANNEL
```

not canonical operational database.

---

# 215. Spreadsheet Role

Spreadsheet may temporarily support:

- reporting,
- planning,
- migration.

But should not become permanent conflicting source of truth.

---

# 216. Marketplace Role

Marketplace owns its transaction interface.

TeeStock should ingest and normalize operational data.

---

# 217. Partner System Role

Partner may have own system.

TeeStock still maintains canonical visibility of TeeStock commitments.

---

# 218. Operating Model by Business Domain

## Commerce

Primary flow:

```text id="ops140"
PUBLISH
→ ORDER
→ PAYMENT
→ FULFILL
→ SUPPORT
```

---

# 219. Services

Primary:

```text id="ops141"
LEAD
→ QUALIFY
→ QUOTE
→ APPROVE
→ EXECUTE
→ DELIVER
```

---

# 220. Originals

Primary:

```text id="ops142"
CONCEPT
→ COLLECTION
→ LAUNCH
→ SELL
→ REVIEW
```

---

# 221. Programs

Primary:

```text id="ops143"
ENROLL
→ ACTIVITY
→ ATTRIBUTE
→ REWARD
→ REVIEW
```

---

# 222. Supply

Primary:

```text id="ops144"
ACCOUNT
→ ORDER
→ RESERVE / PROCURE
→ FULFILL
→ REORDER
```

---

# 223. Fulfill

Primary:

```text id="ops145"
RECEIVE
→ STORE
→ RESERVE
→ PICK
→ PACK
→ SHIP
```

---

# 224. Partner Program

Primary:

```text id="ops146"
QUALIFY
→ ROUTE
→ WORK ORDER
→ QC
→ SCORE
```

---

# 225. Operating Metrics

Top-level categories:

```text id="ops147"
DEMAND
SPEED
QUALITY
RELIABILITY
ECONOMICS
CASH
CAPACITY
```

---

# 226. Demand Metrics

Examples:

```text id="ops148"
Orders
Leads
Units
GMV / Revenue
```

---

# 227. Speed Metrics

Examples:

```text id="ops149"
Lead Response Time
Quote Time
Production Lead Time
Order-to-Ship
```

---

# 228. Quality Metrics

Examples:

```text id="ops150"
Defect Rate
Return Rate
Order Accuracy
```

---

# 229. Reliability Metrics

Examples:

```text id="ops151"
On-Time Delivery
SLA Attainment
Stock Accuracy
Partner Reliability
```

---

# 230. Economic Metrics

Examples:

```text id="ops152"
Contribution
Cost per Order
Rework Cost
Partner Cost
```

---

# 231. Cash Metrics

Examples:

```text id="ops153"
Inventory Days
Receivable
Payable
Cash Conversion
```

---

# 232. Capacity Metrics

Examples:

```text id="ops154"
Production Load
Fulfillment Load
Open Work
Partner Capacity
```

---

# 233. Metric Rule

Do not optimize one metric in isolation.

Example:

```text id="ops155"
FASTER PRODUCTION
```

is not improvement if:

```text id="ops156"
DEFECT RATE DOUBLES
```

---

# 234. Process Performance

Each critical process should eventually have:

```text id="ops157"
VOLUME
CYCLE TIME
ERROR
COST
```

---

# 235. Operational Review Question

For any process:

```text id="ops158"
Is it repeatable?
Is it measurable?
Is it profitable?
Is it reliable?
Is it automatable?
```

---

# 236. Continuous Improvement

Canonical loop:

```text id="ops159"
RUN
↓
MEASURE
↓
FIND BOTTLENECK
↓
IMPROVE
↓
STANDARDIZE
↓
RUN AGAIN
```

---

# 237. Bottleneck Thinking

Improve the actual constraint.

Do not automate arbitrary visible work.

---

# 238. Process Change Governance

Material process changes should record:

```text id="ops160"
WHY
WHAT CHANGES
OWNER
EXPECTED IMPACT
DATE
```

---

# 239. Process Versioning

Important repeatable SOP/processes may have versions.

---

# 240. Operational Experiment

Some process changes can be tested.

Example:

```text id="ops161"
BATCH PICKING
vs
SINGLE PICKING
```

---

# 241. Customer Experience Guardrail

Operational optimization cannot knowingly reduce customer experience below standard just to save internal effort.

---

# 242. Margin Guardrail

Customer delight should also not justify structurally unprofitable operations without intentional strategy.

---

# 243. Standard vs Exception Customer

Custom flexibility should be concentrated where value exists.

---

# 244. Productized Operations

Canonical:

```text id="ops162"
STANDARD PATH
for most transactions

EXCEPTION PATH
for valuable complexity
```

---

# 245. Founder Escalation

Founder should receive only:

```text id="ops163"
STRATEGIC
HIGH-RISK
HIGH-VALUE
UNUSUAL
```

decisions as system matures.

---

# 246. Founder Evolution

Canonical:

```text id="ops164"
DOER
↓
SUPERVISOR
↓
SYSTEM DESIGNER
↓
EXCEPTION APPROVER
↓
CAPITAL ALLOCATOR
```

---

# 247. Headcount Principle

Canonical:

```text id="ops165"
STANDARDIZE
BEFORE
HIRING AROUND CHAOS
```

---

# 248. Hiring Trigger

Hire when:

```text id="ops166"
REPEATABLE ROLE
+
PERSISTENT CAPACITY NEED
+
ECONOMIC JUSTIFICATION
```

exists.

---

# 249. Outsource vs Hire

Use Partner when:

- demand variable,
- specialized capability,
- capital-light strategy.

Hire/internalize when:

- strategic control,
- sustained volume,
- economics justify.

---

# 250. Operating Maturity Model

```text id="ops167"
LEVEL 0
Founder memory

LEVEL 1
Checklists + spreadsheets

LEVEL 2
Canonical objects + workflows

LEVEL 3
Rules + dashboards

LEVEL 4
Automated workflows

LEVEL 5
Exception-based AI orchestration
```

---

# 251. Level 0 — Founder Memory

Anti-goal.

Business depends on:

- personal memory,
- chat history,
- individual relationships.

---

# 252. Level 1 — Structured Manual

Use:

```text id="ops168"
FORMS
CHECKLISTS
SHEETS
TEMPLATES
```

---

# 253. Level 2 — Canonical Workflow

MGBOS objects/states become source of truth.

---

# 254. Level 3 — Rules

System can determine:

- routing,
- next steps,
- approvals.

---

# 255. Level 4 — Automation

Most normal transactions flow without manual coordination.

---

# 256. Level 5 — AI Orchestration

AI monitors:

```text id="ops169"
RISK
ANOMALY
CONTEXT
RECOMMENDATION
```

while deterministic system controls transactions.

---

# 257. Current Recommended Stage

For TeeStock early development:

```text id="ops170"
LEVEL 1 → LEVEL 2
```

priority.

Meaning:

> build canonical operational objects and workflows before advanced AI.

---

# 258. Current Operational Priorities

Recommended:

```text id="ops171"
1. Product / SKU truth
2. Order truth
3. Inventory truth
4. Production Work Orders
5. Partner registry
6. QC
7. Fulfillment
8. Finance linkage
9. Exception handling
```

---

# 259. Do Not Build Full ERP at Once

Canonical:

> **Build the smallest operational backbone that preserves truth and supports real work.**

---

# 260. Initial MGBOS Operational Spine

Recommended:

```text id="ops172"
CUSTOMER
↓
ORDER
↓
ORDER ITEM
↓
INVENTORY / CONFIGURATION
↓
WORK ORDER
↓
QC
↓
SHIPMENT
↓
PAYMENT / COST
```

---

# 261. Service Spine

```text id="ops173"
LEAD
↓
OPPORTUNITY
↓
QUOTE
↓
ORDER / PROJECT
↓
WORK
↓
DELIVERY
```

---

# 262. Partner Spine

```text id="ops174"
PARTNER
↓
CAPABILITY
↓
WORK ORDER
↓
QC
↓
INVOICE
```

---

# 263. Program Spine

```text id="ops175"
PARTICIPANT
↓
ENROLLMENT
↓
ACTIVITY
↓
ATTRIBUTION
↓
EARNING
↓
PAYOUT
```

---

# 264. Event Spine

Every spine produces events for:

- notifications,
- analytics,
- automation.

---

# 265. Operational Anti-Patterns

Avoid:

## Chat as Database

No traceability.

## Founder as Router

Does not scale.

## Same Data Reentered Everywhere

Error risk.

## No Explicit Status

Nobody knows what is happening.

## No Owner

Work stalls.

## No Definition of Done

Tasks appear complete but are not.

## Partner Without Work Order

Operational ambiguity.

## Purchase Without Demand Signal

Cash waste.

## Production Before Approval

Rework risk.

## Inventory Without Ledger

No truth.

---

# 266. What the Operating Model Must Not Become

## Bureaucracy Machine

Process exists to reduce confusion, not create paperwork.

## ERP Theater

Fancy system without operational discipline is useless.

## Automation Theater

Automating broken workflows increases failure speed.

## Founder-Controlled Approval Maze

Standard low-risk work should flow.

## Department Silos

Customer/order truth stays shared.

---

# 267. Operating Model Success Definition

The Operating Model succeeds when:

```text id="ops176"
A NEW ORDER ENTERS
↓
SYSTEM KNOWS
what it is

who owns it

what is required

what inventory exists

whether production is needed

who should execute

what must be approved

when it is due

whether it is profitable

where it currently stands

what should happen next
```

without relying on founder memory.

---

# 268. Canonical Operating Summary

```text id="ops177"
DEMAND
enters the system.

COMMERCIAL
defines the promise.

OPERATIONS
turns promise into work.

PARTNERS
extend capability.

QUALITY
protects the standard.

FULFILLMENT
delivers the result.

FINANCE
reconciles value.

DATA
records reality.

MGBOS
orchestrates everything.
```

---

# 269. Canonical Operating Principles

```text id="ops178"
SYSTEM BEFORE MEMORY.

OBJECT BEFORE CHAT.

STATUS BEFORE ASSUMPTION.

OWNER BEFORE HANDOFF.

READY BEFORE RELEASE.

SPEC BEFORE PRODUCTION.

RESERVE BEFORE CONSUME.

QC BEFORE CUSTOMER.

TRACE BEFORE ADJUST.

EXCEPTION BEFORE CHAOS.

RULES BEFORE AI.

STANDARDIZE BEFORE AUTOMATE.

MEASURE BEFORE SCALE.

ONE OPERATING TRUTH.
```

---

# 270. Dependency

Dokumen berikut harus follow Operating Model:

1. [[bisnis/teestock/07-operations/sourcing-and-vendors|sourcing-and-vendors.md]]
2. [[bisnis/teestock/07-operations/production-system|production-system.md]]
3. [[bisnis/teestock/07-operations/quality-control|quality-control.md]]
4. [[bisnis/teestock/07-operations/inventory-system|inventory-system.md]]
5. [[bisnis/teestock/07-operations/order-fulfillment|order-fulfillment.md]]
6. [[bisnis/teestock/07-operations/customer-service|customer-service.md]]
7. [[bisnis/teestock/07-operations/returns-and-warranty|returns-and-warranty.md]]
8. [[bisnis/teestock/08-finance/financial-model|financial-model.md]]
9. [[bisnis/teestock/08-finance/cost-accounting|cost-accounting.md]]
10. [[bisnis/teestock/10-product-tech/automation-architecture|automation-architecture.md]]
11. [[bisnis/teestock/11-data-mgbos/canonical-data-model|canonical-data-model.md]]
12. [[bisnis/teestock/11-data-mgbos/entity-hierarchy|entity-hierarchy.md]]
13. [[bisnis/teestock/11-data-mgbos/event-model|event-model.md]]
14. [[bisnis/teestock/11-data-mgbos/mgbos-integration|mgbos-integration.md]]
15. [[bisnis/teestock/13-metrics-experiments/kpi-framework|kpi-framework.md]]

Semua proses TeeStock boleh berkembang lebih kompleks seiring scale, tetapi complexity hanya boleh ditambahkan jika memperbaiki clarity, reliability, control, economics, customer experience, atau automation readiness.