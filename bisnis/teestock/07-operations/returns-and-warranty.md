---
title: "TeeStock Returns & Warranty System"
document_id: "TS-OPS-008"
version: "1.0"
status: "CANONICAL"
category: "operations"
business: "teestock"
last_updated: "2026-09-28"
depends_on:
  - "TS-FND-001"
  - "TS-FND-002"
  - "TS-BRD-004"
  - "TS-COM-001"
  - "TS-SVC-002"
  - "TS-SVC-003"
  - "TS-SVC-004"
  - "TS-OPS-001"
  - "TS-OPS-004"
  - "TS-OPS-005"
  - "TS-OPS-006"
  - "TS-OPS-007"
---

# TeeStock Returns & Warranty System v1.0

> **Canonical TeeStock Returns, Exchange, Refund & Product Claim Framework**  
> Dokumen ini mendefinisikan return eligibility, exchanges, defect claims, warranty-like remedies, Return objects, inspections, dispositions, restocking, rework, refunds, replacement, personalized-product handling, shipping responsibility, abuse controls, supplier/partner recovery, accounting linkage, dan customer-policy boundaries.

---

# 1. Purpose

Returns & Warranty System menjawab:

> **Apa yang harus terjadi ketika customer ingin mengembalikan produk, menerima produk salah/rusak, menemukan defect, membutuhkan replacement, exchange, atau refund?**

Canonical principle:

> **Resolve fairly. Recover value where possible. Learn from every failure.**

---

# 2. Canonical Definition

> **TeeStock Returns & Warranty System adalah operating framework yang mengubah customer return, exchange, defect, dan product claim menjadi structured cases dan return transactions dengan clear eligibility, inspection, financial resolution, inventory disposition, liability attribution, dan root-cause feedback.**

---

# 3. Customer Policy vs Internal Operations

Critical distinction:

```text id="ret001"
CUSTOMER RETURN POLICY
defines what customer is entitled to request.

RETURN OPERATIONS
defines how TeeStock processes that request internally.
```

This document focuses primarily on internal operating architecture.

External legal/customer policy belongs in:

```text id="ret002"
12-legal-ip/customer-commerce-policy.md
```

---

# 4. Return Is Not Refund

Canonical:

```text id="ret003"
RETURN
physical goods movement.

REFUND
financial reversal/payment.

EXCHANGE
replacement transaction.

CLAIM
request for remedy.
```

They may occur together, but are different objects/actions.

---

# 5. Warranty Terminology

Apparel typically does not require a complex long-term warranty model like durable electronics.

TeeStock should focus on:

```text id="ret004"
PRODUCT DEFECT CLAIM
QUALITY GUARANTEE
FULFILLMENT ERROR
```

unless a specific product genuinely requires formal warranty terms.

---

# 6. Return Categories

Canonical high-level categories:

```text id="ret005"
CHANGE OF MIND
SIZE / FIT
WRONG ITEM
MISSING ITEM
DEFECT
DAMAGED IN TRANSIT
CUSTOMIZATION ERROR
DELIVERY FAILURE
OTHER APPROVED REASON
```

---

# 7. Return Reason Matters

Different reasons imply different:

```text id="ret006"
ELIGIBILITY
LIABILITY
SHIPPING COST
DISPOSITION
ROOT CAUSE
```

---

# 8. Return Request

Customer contact may create:

```text id="ret007"
RETURN REQUEST
```

linked to Customer Case.

---

# 9. Return Object

Once physical return is authorized:

create canonical:

```text id="ret008"
RETURN
```

---

# 10. Return vs Return Request

```text id="ret009"
RETURN REQUEST
customer asks.

RETURN
approved physical reverse-logistics process.
```

---

# 11. Return Lifecycle

Canonical:

```text id="ret010"
REQUESTED
↓
REVIEWING
↓
APPROVED / DECLINED
↓
AWAITING_RETURN
↓
IN_TRANSIT
↓
RECEIVED
↓
INSPECTED
↓
RESOLVED
↓
CLOSED
```

---

# 12. Alternate States

Potential:

```text id="ret011"
CANCELLED
EXPIRED
DISPUTED
```

---

# 13. Return Request Minimum

```text id="ret012"
Customer
Order
Order Item
Reason
Requested Resolution
Evidence if needed
Request Date
```

---

# 14. Return Eligibility

Eligibility should consider:

```text id="ret013"
PRODUCT TYPE
RETURN REASON
ORDER STATUS
TIME WINDOW
PRODUCT CONDITION
CUSTOMIZATION
POLICY
```

---

# 15. Eligibility Is Not One Universal Rule

A standard ready-stock tee and personalized corporate uniform should not necessarily have identical return rights.

---

# 16. Ready-Stock Product

Generally most reversible operationally.

May be eligible for:

```text id="ret014"
RETURN
EXCHANGE
REFUND
```

subject to customer policy.

---

# 17. Made-to-Order Product

More restricted because product may have been produced after purchase.

---

# 18. Personalized Product

Canonical:

> **Personalized output usually has low or zero resale value and therefore requires stricter return eligibility unless TeeStock caused the error or the product is defective.**

---

# 19. Customer-Caused Personalization Error

If customer approved incorrect:

- spelling,
- name,
- number,
- design,

resolution may differ from TeeStock production error.

---

# 20. TeeStock-Caused Personalization Error

Examples:

```text id="ret015"
WRONG NAME
WRONG NUMBER
WRONG ARTWORK VERSION
WRONG PLACEMENT
```

should generally be treated as fulfillment/production failure.

---

# 21. Business / Custom Orders

Large/custom B2B orders require contract/order-specific terms.

Do not apply consumer-style return logic blindly.

---

# 22. Defect Claim

Canonical:

> **A defect claim asserts that product failed to meet approved quality or product specification.**

---

# 23. Defect Evidence

May include:

```text id="ret016"
PHOTO
VIDEO
MEASUREMENT
ORDER INFORMATION
```

Request proportionally.

---

# 24. Obvious Defect

If evidence clearly proves defect, requiring unnecessary shipping back before helping customer may create friction.

Operational policy may allow immediate resolution for low-value items.

---

# 25. Physical Inspection

Required when:

```text id="ret017"
CAUSE UNCLEAR
VALUE MATERIAL
ABUSE RISK
ROOT CAUSE IMPORTANT
RESTOCK DECISION NEEDED
```

---

# 26. Return Authorization

Approved return should receive:

```text id="ret018"
RETURN ID
```

or equivalent authorization.

---

# 27. RMA

Future system may use:

```text id="ret019"
RETURN MERCHANDISE AUTHORIZATION
```

but simple `Return ID` is sufficient early.

---

# 28. Return Instruction

Customer should receive clear:

```text id="ret020"
WHERE TO SEND
HOW TO PACK
WHAT TO INCLUDE
DEADLINE
WHO PAYS SHIPPING
```

where relevant.

---

# 29. Return Expiry

Approved return may expire if customer never sends goods within defined period.

---

# 30. Return Shipping Responsibility

Depends on reason.

Canonical logic:

```text id="ret021"
TEEStock ERROR / DEFECT
→ TeeStock usually bears reasonable recovery cost.

CUSTOMER PREFERENCE CHANGE
→ customer may bear return cost, subject to policy.
```

Exact customer terms belong in policy/legal documentation.

---

# 31. Carrier Return Label

Future system may generate return shipping label.

Not mandatory for V1.

---

# 32. Return Tracking

Returned shipment should be traceable where practical.

---

# 33. Return Receipt

When goods arrive:

```text id="ret022"
RETURN IN_TRANSIT
→
RETURN RECEIVED
```

---

# 34. Returned Inventory Is Not Available

Canonical:

```text id="ret023"
RETURNED
≠
SELLABLE
```

Inspection required first.

---

# 35. Return Inspection

Inspection answers:

```text id="ret024"
IS IT THE RIGHT ITEM?

WHAT CONDITION IS IT IN?

IS CLAIM VALID?

CAN IT BE RESTOCKED?

WHAT CAUSED THE ISSUE?
```

---

# 36. Inspection Record

Minimum:

```text id="ret025"
Return ID
Inspector
Item
Condition
Defect
Decision
Evidence
Date
```

---

# 37. Return Condition

Potential:

```text id="ret026"
NEW
OPENED
USED
DAMAGED
DEFECTIVE
UNSELLABLE
```

---

# 38. Return Disposition

Canonical:

```text id="ret027"
RESTOCK
REWORK
REPACKAGE
RETURN TO VENDOR
RETURN TO CLIENT
DOWNGRADE
SCRAP
HOLD
```

---

# 39. Restock

Allowed only when product remains suitable for sale.

---

# 40. Restock Gate

Consider:

```text id="ret028"
PRODUCT CONDITION
HYGIENE
PACKAGING
RIGHTS / PERSONALIZATION
QUALITY
```

---

# 41. Repackage

Product may be good but packaging damaged.

---

# 42. Rework

Product can be corrected economically.

---

# 43. Personalized Goods

Usually cannot return to general inventory.

Potential disposition:

```text id="ret029"
REWORK
CUSTOMER RETURN
INTERNAL SAMPLE
SCRAP
```

depending circumstances.

---

# 44. Scrap

Use when item is not economically or reputationally reusable.

---

# 45. Quarantine

If quality/root cause unresolved:

```text id="ret030"
RETURN
→
QUARANTINE
```

---

# 46. Return-to-Vendor

If upstream supplier caused defect:

TeeStock may seek recovery.

---

# 47. Supplier Recovery

Potential:

```text id="ret031"
REPLACEMENT
CREDIT NOTE
REFUND
CLAIM
```

---

# 48. Partner Recovery

If production partner caused defect:

potential:

```text id="ret032"
REWORK
REPRODUCTION
COST RECOVERY
SERVICE CREDIT
```

according to partner agreement.

---

# 49. Customer Resolution

Canonical resolution options:

```text id="ret033"
REFUND
REPLACEMENT
EXCHANGE
REWORK
PARTIAL REFUND
STORE CREDIT
NO FURTHER ACTION
```

---

# 50. Resolution Should Fit Failure

Avoid automatically using same remedy for every case.

---

# 51. Refund

Refund is financial action linked to:

```text id="ret034"
ORDER
PAYMENT
RETURN / CASE
REFUND REASON
```

---

# 52. Refund Types

Potential:

```text id="ret035"
FULL
PARTIAL
SHIPPING ONLY
ITEM ONLY
```

---

# 53. Refund State

Canonical:

```text id="ret036"
REQUESTED
APPROVED
PROCESSING
COMPLETED
FAILED
CANCELLED
```

---

# 54. Refund Timing

Customer communication should distinguish:

```text id="ret037"
TEEStock PROCESSED REFUND
vs
PAYMENT PROVIDER SETTLED REFUND
```

---

# 55. Refund Method

Prefer refund to original payment route where operationally appropriate.

Avoid ad hoc transfers when standardized payment reversal exists.

---

# 56. Refund Without Return

May be appropriate when:

```text id="ret038"
LOW ITEM VALUE
RETURN SHIPPING UNECONOMIC
DEFECT CLEAR
```

and fraud risk acceptable.

---

# 57. Replacement

Replacement should be operationally traceable.

---

# 58. Replacement Object

Potential:

```text id="ret039"
REPLACEMENT ORDER
```

linked to original Order/Return.

---

# 59. Replacement Inventory

Must reserve actual stock or trigger production.

---

# 60. Replacement Cost

Track:

```text id="ret040"
PRODUCT
PRODUCTION
PACKAGING
SHIPPING
```

for quality-cost analysis.

---

# 61. Exchange

Canonical:

```text id="ret041"
RETURN ORIGINAL
+
FULFILL REPLACEMENT ITEM
```

---

# 62. Exchange Difference

If new item price differs:

system needs explicit commercial treatment.

---

# 63. Size Exchange

Common apparel case.

Should be tracked separately from product defect.

---

# 64. Fit Problem

A fit-related return may reveal:

```text id="ret042"
SIZE GUIDE ISSUE
PRODUCT FIT ISSUE
CUSTOMER PREFERENCE
```

Need correct classification.

---

# 65. Wrong Item

Usually fulfillment error.

Resolution may require:

```text id="ret043"
RETURN / COLLECTION
+
RESHIP CORRECT ITEM
```

---

# 66. Missing Item

May not require return.

Creates fulfillment claim and replacement/refund as appropriate.

---

# 67. Damaged in Transit

Liability may involve:

```text id="ret044"
PACKAGING
CARRIER
HANDLING
```

Root cause should be investigated.

---

# 68. Carrier Recovery

If applicable:

```text id="ret045"
CARRIER CLAIM
```

should be separate from customer resolution.

Customer should not necessarily wait for carrier reimbursement.

---

# 69. Customer Resolution First

Canonical:

> **Resolve the customer obligation separately from TeeStock's upstream recovery whenever practical.**

---

# 70. Internal Liability Attribution

After customer resolution, determine source:

```text id="ret046"
SUPPLIER
PRODUCTION
QUALITY
FULFILLMENT
CARRIER
CUSTOMER
UNKNOWN
```

---

# 71. Liability ≠ Blame Language

This is accounting/operational attribution.

Not excuse to shift responsibility to customer.

---

# 72. Failure Cost Attribution

Track costs against source where evidence supports it.

---

# 73. Return Reason vs Root Cause

Critical distinction:

```text id="ret047"
RETURN REASON
what customer experienced.

ROOT CAUSE
why it happened.
```

---

# 74. Example

```text id="ret048"
RETURN REASON
Wrong size received

ROOT CAUSE
Picker scanned wrong SKU
```

---

# 75. Return Reason Taxonomy

Potential:

```text id="ret049"
SIZE / FIT
DEFECT
WRONG ITEM
MISSING ITEM
DAMAGED
NOT AS EXPECTED
CUSTOMER CHANGED MIND
CUSTOMIZATION ERROR
DELIVERY ISSUE
```

---

# 76. Root Cause Taxonomy

Potential:

```text id="ret050"
PRODUCT
SUPPLIER
PRODUCTION
QC ESCAPE
PICK
PACK
SYSTEM
CARRIER
CUSTOMER INPUT
```

---

# 77. Quality Loop

Validated defect should feed:

```text id="ret051"
QUALITY CONTROL
```

---

# 78. Fulfillment Loop

Wrong/missing item should feed:

```text id="ret052"
ORDER ACCURACY
```

---

# 79. Product Loop

High fit returns should feed:

```text id="ret053"
PRODUCT DEVELOPMENT
SIZE GUIDE
MERCHANDISING
```

---

# 80. Marketing Loop

“Not as expected” may reveal:

- photography,
- copy,
- claims

problem.

---

# 81. Supplier Loop

Repeated input defect affects supplier scorecard.

---

# 82. Partner Loop

Repeated production failure affects partner routing/status.

---

# 83. Inventory Loop

Return disposition must create inventory movement.

---

# 84. Finance Loop

Refund/write-off/recovery must update economics.

---

# 85. Returns Are Economic Data

High gross margin product may be poor business if:

```text id="ret054"
RETURN RATE
+
REPLACEMENT COST
+
SUPPORT COST
```

are high.

---

# 86. Return Rate

Define consistently:

```text id="ret055"
RETURNED ITEMS
/
ELIGIBLE SHIPPED ITEMS
```

or order-based metric.

---

# 87. Refund Rate

Separate from return rate.

Some refunds occur without physical return.

---

# 88. Replacement Rate

Useful quality/fulfillment metric.

---

# 89. Exchange Rate

Especially useful for apparel fit.

---

# 90. Defect Claim Rate

Helps identify product/process quality.

---

# 91. Return Cost

Potential:

```text id="ret056"
RETURN SHIPPING
INSPECTION
REFUND
REPLACEMENT
REWORK
WRITE-OFF
SUPPORT
```

---

# 92. Net Recovery

Supplier/carrier reimbursement should reduce actual failure cost.

---

# 93. Return Economics

Conceptually:

```text id="ret057"
CUSTOMER RECOVERY COST
-
UPSTREAM RECOVERY
=
NET RETURN COST
```

---

# 94. Return Reserve

Finance may later model expected return/refund liabilities.

Exact accounting belongs in Finance.

---

# 95. Restock Value

Returned product restocked successfully retains inventory value.

---

# 96. Write-Off

Unsellable stock may require financial write-off.

---

# 97. Customer Compensation

Can occur in addition to refund/replacement.

Should remain separately recorded.

---

# 98. Return Abuse

Potential:

```text id="ret058"
WARDROBING
FALSE DEFECT CLAIM
EMPTY BOX RETURN
ITEM SWITCHING
REPEATED ABUSE
```

---

# 99. Abuse Detection

Use evidence and patterns.

Do not treat normal high-return customers automatically as fraudulent.

---

# 100. Self-Service Return

Future customer portal may allow:

```text id="ret059"
SELECT ORDER
SELECT ITEM
SELECT REASON
UPLOAD EVIDENCE
REQUEST RESOLUTION
```

---

# 101. Self-Service Does Not Auto-Approve Everything

Eligibility rules still apply.

---

# 102. Auto-Approval

Low-risk standardized returns may eventually be automatically approved.

---

# 103. Manual Review

Required when:

```text id="ret060"
HIGH VALUE
CUSTOM PRODUCT
ABUSE RISK
UNCLEAR DEFECT
POLICY EXCEPTION
```

---

# 104. Return Window

Customer policy may define time window.

System should store:

```text id="ret061"
ELIGIBILITY DEADLINE
```

where relevant.

---

# 105. Delivery Date as Clock

Return eligibility may depend on:

```text id="ret062"
DELIVERY CONFIRMED DATE
```

rather than order date.

---

# 106. Custom Product Eligibility

Custom/personalized products require dedicated eligibility rules.

---

# 107. Defect Overrides Preference Rules

Even non-returnable customized product may still need remedy if TeeStock delivered defective/nonconforming output.

---

# 108. Final-Sale Product

If such classification is ever used:

must still comply with applicable customer rights and defect obligations.

Detailed legal validation belongs in customer commerce policy.

---

# 109. Original Condition

Where return policy requires:

```text id="ret063"
UNWORN
UNWASHED
TAGGED
```

or equivalent, inspection should verify proportionally.

---

# 110. Hygiene

Certain product categories may require stricter handling.

Define only if TeeStock sells relevant items.

---

# 111. Packaging Condition

Damaged packaging does not always mean damaged product.

Restock decision should focus on resale suitability.

---

# 112. Return Labeling

Physical returned item should be linked to Return ID before entering warehouse flow.

---

# 113. Unidentified Return

Creates exception.

Do not restock until customer/order is identified.

---

# 114. Return Receiving Location

Could use dedicated:

```text id="ret064"
RETURNS AREA
```

to prevent mixing with sellable stock.

---

# 115. Return Quarantine

Useful default state until inspection.

---

# 116. Inspection SLA

Returns should not sit indefinitely.

Define target when volume justifies.

---

# 117. Refund Trigger

Possible models:

```text id="ret065"
ON APPROVAL
ON CARRIER SCAN
ON RETURN RECEIPT
ON INSPECTION PASS
```

depends on policy/risk.

---

# 118. Early V1 Recommendation

Prefer conservative:

```text id="ret066"
INSPECT
→
APPROVE REFUND
```

for physical returns unless simple obvious cases justify exception.

---

# 119. Replacement Before Return

May be appropriate for:

- trusted customer,
- urgent B2B issue,
- obvious TeeStock fault.

Requires explicit rule/approval.

---

# 120. Advance Replacement Risk

Customer may never return original item.

Track outstanding return.

---

# 121. Exchange Inventory Reservation

Replacement stock may be reserved while return is in transit if policy supports it.

---

# 122. Return Shipping SLA

Customer should receive clear instruction and, where applicable, return label promptly.

---

# 123. Refund SLA

Internal system should track processing target.

---

# 124. Replacement SLA

Separate from original order lead time where possible.

---

# 125. High-Impact B2B Claim

Large business order defect may require:

```text id="ret067"
INCIDENT
+
CORRECTIVE ACTION
+
COMMERCIAL RECOVERY PLAN
```

not simple consumer return flow.

---

# 126. Partial B2B Defect

May require replacing only affected units.

---

# 127. Business Acceptance

Some B2B projects may include formal delivery acceptance.

Claims after acceptance can follow contract-specific terms.

---

# 128. Creator Merch Returns

Customer resolution remains operationally coherent through TeeStock where TeeStock operates the store.

Creator payout calculations may need reversal adjustments for refunded transactions.

---

# 129. Creator Royalty Adjustment

Canonical:

```text id="ret068"
REFUNDED ELIGIBLE SALE
→
ROYALTY REVERSAL / ADJUSTMENT
```

according to creator agreement.

---

# 130. Affiliate Commission Adjustment

Canonical:

```text id="ret069"
REFUNDED ATTRIBUTED SALE
→
COMMISSION REVERSAL / ADJUSTMENT
```

according to Affiliate Program rules.

---

# 131. Reseller Return

B2B reseller claim differs from end-customer retail return.

TeeStock should handle reseller claim according to B2B terms.

---

# 132. Dropship Return

Customer-facing relationship may belong to reseller while TeeStock handles physical reverse logistics.

---

# 133. Supply Return

B2B Supply claims may involve:

```text id="ret070"
DEFECT
WRONG PRODUCT
SHORTAGE
```

rather than consumer preference returns.

---

# 134. Fulfillment Client Return

For TeeStock Fulfill:

system may execute return operations without deciding commercial refund.

Client owns commercial policy unless agreed otherwise.

---

# 135. Multi-Party Return

Future complex flow:

```text id="ret071"
END CUSTOMER
↓
TEEStock FULFILL
↓
MERCH CLIENT
```

must separate:

```text id="ret072"
PHYSICAL RETURN
COMMERCIAL DECISION
```

---

# 136. Customer Service Ownership

Customer Service owns communication/case.

---

# 137. Warehouse Ownership

Fulfillment/Returns Ops owns:

- receipt,
- inspection routing,
- disposition execution.

---

# 138. Quality Ownership

Quality determines validated defect where needed.

---

# 139. Finance Ownership

Finance/payment controls:

- refund settlement,
- write-off,
- recovery.

---

# 140. Product Ownership

Product team may act on repeat return patterns.

---

# 141. Root-Cause Owner

Depends on failure source.

---

# 142. Approval Matrix

Return/refund authority should define:

```text id="ret073"
STANDARD POLICY
→ automatic / support approval

EXCEPTION
→ higher approval

HIGH VALUE / B2B
→ management approval
```

Exact monetary thresholds belong in Decision Thresholds.

---

# 143. Policy Exception

Any exception outside normal return terms should record:

```text id="ret074"
WHY
WHO APPROVED
CUSTOMER IMPACT
FINANCIAL IMPACT
```

---

# 144. Goodwill Exception

May be commercially useful.

Should not silently redefine policy.

---

# 145. Consistency

Similar cases should generally receive similar outcomes unless relevant facts differ.

---

# 146. Returns and Customer Lifetime Value

Long-term customer relationship may influence discretionary recovery.

But core rights/quality standards should remain consistent.

---

# 147. Return Experience

A well-handled failure can preserve customer trust.

---

# 148. Reverse Logistics

Canonical:

```text id="ret075"
CUSTOMER
↓
RETURN SHIPMENT
↓
RECEIVING
↓
INSPECTION
↓
DISPOSITION
```

---

# 149. Reverse Logistics Cost

Track where material.

---

# 150. Consolidated Returns

At scale, multiple returns may be processed in batches.

Order-level traceability remains required.

---

# 151. Return Location

Dedicated logical/physical location helps avoid accidental resale.

---

# 152. Returned Product Identity

Verify actual:

```text id="ret076"
SKU
VARIANT
SERIAL / PERSONALIZATION if relevant
```

matches claim.

---

# 153. Item Switching

If returned item does not match sold item:

create fraud/exception review.

---

# 154. Missing Components

Bundle/kit returns may require all necessary components depending policy.

---

# 155. Return Inspection Outcome

Canonical:

```text id="ret077"
CLAIM VALID
CLAIM PARTIALLY VALID
CLAIM NOT VALID
INSUFFICIENT EVIDENCE
```

---

# 156. Invalid Claim

Customer communication should remain factual and clear.

---

# 157. Disputed Claim

May escalate to senior review.

---

# 158. Marketplace Dispute

Marketplace channels may impose their own dispute/refund process.

TeeStock should still record canonical internal outcome.

---

# 159. Chargeback

Payment chargeback is not identical to return/refund.

It belongs primarily to Finance/payment disputes, but may link to Return/Case.

---

# 160. Refund Duplication Control

System must prevent:

```text id="ret078"
REFUND VIA TEEStock
+
REFUND VIA MARKETPLACE
```

for same amount accidentally.

---

# 161. Replacement Duplication Control

Same claim should not create multiple replacements across channels.

---

# 162. Return Case Merge

Duplicate support contacts should link to same Return where appropriate.

---

# 163. Customer Communication States

Useful notifications:

```text id="ret079"
Request Received
Return Approved
Return Received
Inspection Complete
Refund Processed
Replacement Shipped
```

---

# 164. Transparency

Customer should understand what step return is currently in.

---

# 165. Return Metrics

Canonical categories:

```text id="ret080"
VOLUME
REASON
SPEED
QUALITY
COST
RECOVERY
```

---

# 166. Volume Metrics

```text id="ret081"
Return Rate
Refund Rate
Exchange Rate
Replacement Rate
```

---

# 167. Reason Metrics

```text id="ret082"
Fit Returns
Defect Returns
Wrong Item
Damaged
Expectation Gap
```

---

# 168. Speed Metrics

```text id="ret083"
Return Approval Time
Return-to-Inspection Time
Refund Processing Time
Replacement Lead Time
```

---

# 169. Quality Metrics

```text id="ret084"
Validated Defect Rate
Repeat Defect Rate
QC Escape Rate
```

---

# 170. Cost Metrics

```text id="ret085"
Refund Value
Replacement Cost
Return Shipping
Write-Off
Support Cost
```

---

# 171. Recovery Metrics

```text id="ret086"
Supplier Recovery
Partner Recovery
Carrier Recovery
Restock Value
```

---

# 172. Net Return Cost

Useful management metric:

```text id="ret087"
TOTAL RETURN / RECOVERY COST
-
UPSTREAM RECOVERY
-
RESTOCKABLE VALUE
```

subject to finance definitions.

---

# 173. Return Rate by Product

Helps identify bad products.

---

# 174. Return Rate by Size

Helps identify sizing problems.

---

# 175. Return Rate by Supplier

Can identify input quality.

---

# 176. Return Rate by Production Route

Can identify partner/process problems.

---

# 177. Return Rate by Channel

Can reveal customer expectation differences.

---

# 178. Return Rate by Campaign

Can reveal misleading acquisition.

---

# 179. Return Rate by Creator / Collection

Useful where sample sizes are sufficient.

Do not overinterpret tiny cohorts.

---

# 180. Returns as Product Intelligence

Canonical:

```text id="ret088"
RETURN DATA
↓
PRODUCT INSIGHT
↓
PRODUCT / COPY / SIZE / PROCESS CHANGE
```

---

# 181. Fit Feedback

Repeated size exchanges may justify:

- size chart change,
- fit note,
- garment platform adjustment.

---

# 182. Expectation Feedback

Repeated:

> warna beda dari foto

may indicate photography/color communication issue.

---

# 183. Quality Feedback

Repeated print failure may require recipe/material change.

---

# 184. Operational Feedback

Wrong-item returns may require barcode/verification improvements.

---

# 185. Return Thresholds

Exact thresholds for:

- high return rate,
- product hold,
- supplier review

belong in `decision-thresholds.md`.

---

# 186. Product Hold

May be triggered when return/defect evidence indicates systemic unresolved issue.

---

# 187. Product Sunset

Persistently problematic product may be removed if fixes are uneconomic.

---

# 188. Supplier Review

Repeated supplier-attributed returns should affect sourcing.

---

# 189. Partner Probation

Repeated partner-attributed defect can trigger probation.

---

# 190. Carrier Review

Repeated transit damage/loss affects carrier routing.

---

# 191. Returns Data Model

Core entities:

```text id="ret089"
RETURN REQUEST
RETURN
RETURN ITEM
RETURN SHIPMENT
INSPECTION
DISPOSITION
REFUND
REPLACEMENT
CLAIM
RECOVERY
```

---

# 192. Return Request Entity

Captures initial customer request.

---

# 193. Return Entity

Captures authorized physical reverse flow.

---

# 194. Return Item Entity

One Return can contain multiple Order Items.

---

# 195. Return Shipment

Tracks reverse transportation.

---

# 196. Inspection Entity

Records condition and decision.

---

# 197. Disposition Entity

Records what happens to physical item.

---

# 198. Refund Entity

Records financial customer reimbursement.

---

# 199. Replacement Entity

Links replacement fulfillment to original claim.

---

# 200. Claim Entity

Represents defect/damage/liability assertion.

---

# 201. Recovery Entity

Represents upstream recovery from:

```text id="ret090"
SUPPLIER
PARTNER
CARRIER
```

---

# 202. Return Data Lineage

Canonical:

```text id="ret091"
ORDER
↓
CASE
↓
RETURN REQUEST
↓
RETURN
↓
INSPECTION
↓
RESOLUTION
↓
REFUND / REPLACEMENT
↓
DISPOSITION
↓
ROOT CAUSE / RECOVERY
```

---

# 203. Return Events

Potential:

```text id="ret092"
return.requested
return.approved
return.received
return.inspected
refund.approved
refund.completed
replacement.created
return.closed
```

---

# 204. Inventory Events

Return processing may trigger:

```text id="ret093"
inventory.returned
inventory.quarantined
inventory.restocked
inventory.scrapped
```

---

# 205. Financial Events

Potential:

```text id="ret094"
refund.created
inventory.writeoff
supplier_recovery.created
affiliate_earning.reversed
creator_royalty.reversed
```

---

# 206. MGBOS Returns Dashboard

Potential:

```text id="ret095"
OPEN RETURN REQUESTS
AWAITING RETURN
RETURNS RECEIVED
AWAITING INSPECTION
REFUNDS PENDING
REPLACEMENTS
HIGH-RETURN PRODUCTS
TOP RETURN REASONS
```

---

# 207. Exception Queue

Potential:

```text id="ret096"
UNIDENTIFIED RETURN
DISPUTED CLAIM
LATE REFUND
MISSING RETURN
HIGH-VALUE EXCEPTION
ABUSE REVIEW
```

---

# 208. Automation Opportunities

Potential:

```text id="ret097"
Eligibility Check
Return Authorization
Return Label
Status Notification
Refund Workflow
Replacement Creation
Inventory Disposition Task
Royalty / Commission Reversal
```

---

# 209. Automatic Eligibility

Rules may evaluate:

```text id="ret098"
ORDER DATE
DELIVERY DATE
PRODUCT TYPE
CUSTOMIZATION
REASON
```

---

# 210. Automatic Approval

Suitable only for low-risk standardized cases.

---

# 211. Automated Refund

Only after approved deterministic conditions.

---

# 212. Automated Restock

Should require reliable inspection outcome.

Never restock simply because carrier delivered return.

---

# 213. AI Role

AI may assist:

```text id="ret099"
Return Reason Classification
Evidence Summary
Policy Retrieval
Abuse Pattern Flag
Root-Cause Clustering
Customer Response Draft
```

---

# 214. AI Eligibility Boundary

AI can interpret policy/context.

Final eligibility should ideally come from deterministic policy rules where possible.

---

# 215. AI Defect Analysis

AI/computer vision may help identify:

- print defect,
- obvious damage.

Not sole authority for ambiguous/high-value claim.

---

# 216. AI Abuse Boundary

AI may flag suspicious pattern.

It should not independently accuse/ban customer.

---

# 217. AI Refund Boundary

AI should not invent refund amount.

---

# 218. Returns Maturity Model

```text id="ret100"
LEVEL 0
Returns via chat

LEVEL 1
Return IDs + manual inspection

LEVEL 2
Structured eligibility + refund/replacement linkage

LEVEL 3
Self-service + analytics + upstream recovery

LEVEL 4
Automated low-risk returns

LEVEL 5
Exception-based reverse logistics orchestration
```

---

# 219. Level 0

Anti-goal:

returns handled entirely by chat and memory.

---

# 220. Level 1

Minimum:

```text id="ret101"
CASE
RETURN
REASON
INSPECTION
RESOLUTION
```

---

# 221. Level 2

Adds:

```text id="ret102"
ELIGIBILITY RULE
REFUND
REPLACEMENT
INVENTORY DISPOSITION
```

---

# 222. Level 3

Adds:

```text id="ret103"
SELF-SERVICE
ROOT-CAUSE DASHBOARD
SUPPLIER / PARTNER RECOVERY
```

---

# 223. Level 4

Adds:

```text id="ret104"
AUTO-APPROVAL
AUTO-LABEL
AUTO-REFUND FOR LOW-RISK CASES
```

---

# 224. Level 5

System handles normal returns automatically and escalates:

```text id="ret105"
HIGH VALUE
CUSTOMIZED
DISPUTED
FRAUD RISK
SYSTEMIC DEFECT
```

---

# 225. Current Recommended Stage

TeeStock should target:

```text id="ret106"
LEVEL 1
→
LEVEL 2
```

first.

---

# 226. V1 Required Capabilities

Priority:

```text id="ret107"
Return Request
Return Reason
Approval
Return ID
Inspection
Disposition
Refund / Replacement
```

---

# 227. V1 Return Reasons

Keep taxonomy compact:

```text id="ret108"
SIZE / FIT
DEFECT
WRONG ITEM
DAMAGED
CHANGE OF MIND
CUSTOMIZATION ERROR
OTHER
```

---

# 228. V1 Inspection

Manual human inspection with photo evidence for material issues.

---

# 229. V1 Refund

Manual approval + traceable payment record.

---

# 230. V1 Personalized Rules

Explicitly separate:

```text id="ret109"
CUSTOMER APPROVED ERROR
vs
TEEStock EXECUTION ERROR
```

---

# 231. V1 Avoid

Do not immediately build:

```text id="ret110"
complex RMA portal
automatic fraud denial
advanced return optimization
instant refunds for every scenario
hundreds of reason codes
```

---

# 232. V2 Expansion

Possible:

```text id="ret111"
SELF-SERVICE REQUEST
RETURN LABEL
REFUND AUTOMATION
SUPPLIER RECOVERY
RETURN ANALYTICS
```

---

# 233. V3 Expansion

Possible:

```text id="ret112"
ADVANCED ABUSE SIGNALS
AUTOMATED DISPOSITION
RETURN FORECASTING
PRODUCT RISK ALERTS
```

---

# 234. Return Approval Gate

Approve when:

```text id="ret113"
POLICY ELIGIBLE
or
AUTHORIZED EXCEPTION
```

---

# 235. Refund Gate

Refund when:

```text id="ret114"
ELIGIBILITY / RESOLUTION APPROVED
+
REQUIRED RETURN / EVIDENCE CONDITION MET
```

---

# 236. Restock Gate

Restock only when:

```text id="ret115"
ITEM IDENTIFIED
+
INSPECTED
+
SELLABLE
+
RIGHTS / PRODUCT CONDITIONS VALID
```

---

# 237. Replacement Gate

Create replacement only when:

```text id="ret116"
RESOLUTION APPROVED
+
PRODUCT / PRODUCTION PATH AVAILABLE
```

---

# 238. Supplier Recovery Gate

Pursue when:

```text id="ret117"
UPSTREAM LIABILITY SUPPORTED
+
RECOVERY VALUE JUSTIFIES EFFORT
```

---

# 239. Product Hold Gate

Consider hold when:

```text id="ret118"
REPEAT VALIDATED DEFECT
+
SYSTEMIC RISK
```

exists.

---

# 240. Abuse Review Gate

Review customer when:

```text id="ret119"
REPEATED UNUSUAL PATTERN
+
MEANINGFUL ECONOMIC RISK
```

not based on one ordinary return.

---

# 241. Return Failure Modes

## Return via Chat Only

No audit trail.

## Return = Refund

Breaks physical/financial logic.

## Returned = Available

Quality risk.

## No Inspection

No disposition learning.

## All Claims Treated the Same

Bad economics.

## Customer Waits for Supplier Claim

Poor customer recovery.

## Refund Without Root Cause

System never improves.

## No Royalty/Commission Reversal

Economics become wrong.

## Personalized Product Treated Like Standard Stock

Inventory distortion.

---

# 242. What Returns Must Not Become

## Refund Machine

Resolution should fit facts.

## Customer Punishment System

Policies should remain fair and understandable.

## Warehouse Dump

Every returned item needs disposition.

## Fraud Accusation Engine

Use evidence and proportional review.

## Quality Data Graveyard

Return patterns must influence upstream decisions.

---

# 243. Returns Success Definition

The system succeeds when TeeStock can answer:

```text id="ret120"
WHY
does the customer want a remedy?

IS IT ELIGIBLE?

WHAT
physical item is involved?

WHERE
is the returned item?

WHAT CONDITION
is it in?

WHAT RESOLUTION
was approved?

WHAT MONEY
was refunded?

WHAT INVENTORY
changed?

WHO CAUSED
the underlying failure?

CAN WE RECOVER
upstream cost?

WHAT SHOULD CHANGE
so it happens less often?
```

---

# 244. Canonical Returns Summary

```text id="ret121"
CASE
captures the customer problem.

RETURN REQUEST
tests eligibility.

RETURN
controls reverse logistics.

INSPECTION
determines physical truth.

DISPOSITION
protects inventory.

REFUND / REPLACEMENT
resolves customer value.

RECOVERY
recovers upstream cost.

ROOT CAUSE
creates operational learning.

MGBOS
connects the entire reverse flow.
```

---

# 245. Canonical Returns Principles

```text id="ret122"
RETURN IS NOT REFUND.

REQUEST BEFORE AUTHORIZATION.

RETURNED IS NOT AVAILABLE.

INSPECT BEFORE RESTOCK.

DEFECT BEFORE BLAME.

RESOLVE CUSTOMER BEFORE UPSTREAM RECOVERY.

PERSONALIZED PRODUCT REQUIRES DIFFERENT LOGIC.

TRACE REFUND TO ORDER AND REASON.

TRACE REPLACEMENT TO ORIGINAL FAILURE.

REVERSE ROYALTY / COMMISSION WHEN TRANSACTION REVERSES.

DISPOSITION EVERY RETURNED ITEM.

ROOT CAUSE EVERY REPEATED FAILURE.

FAIR RESOLUTION. CONTROLLED ECONOMICS. STRUCTURED LEARNING.
```

---

# 246. Dependency

Dokumen berikut harus follow Returns & Warranty System:

1. `08-finance/financial-model.md`
2. `08-finance/unit-economics.md`
3. `08-finance/pricing-framework.md`
4. `08-finance/cost-accounting.md`
5. `08-finance/treasury-policy.md`
6. `09-marketing/retention-and-community.md`
7. `10-product-tech/commerce-platform.md`
8. `10-product-tech/automation-architecture.md`
9. `11-data-mgbos/canonical-data-model.md`
10. `11-data-mgbos/entity-hierarchy.md`
11. `11-data-mgbos/event-model.md`
12. `11-data-mgbos/mgbos-integration.md`
13. `12-legal-ip/customer-commerce-policy.md`
14. `13-metrics-experiments/kpi-framework.md`
15. `13-metrics-experiments/decision-thresholds.md`

TeeStock Returns & Warranty System boleh berkembang menjadi self-service, highly automated reverse-logistics operation, tetapi automation hanya boleh berdiri di atas clear customer policy, canonical Return objects, reliable inspection, controlled refund authority, inventory disposition, liability attribution, dan root-cause feedback.