---
title: "TeeStock Cost Accounting"
document_id: "TS-FIN-004"
version: "1.0"
status: "CANONICAL"
category: "finance"
business: "teestock"
last_updated: "2026-09-28"
depends_on:
  - "TS-FIN-001"
  - "TS-FIN-002"
  - "TS-FIN-003"
  - "TS-COM-005"
  - "TS-OPS-002"
  - "TS-OPS-003"
  - "TS-OPS-004"
  - "TS-OPS-005"
  - "TS-OPS-006"
  - "TS-OPS-008"
---

# TeeStock Cost Accounting v1.0

> **Canonical TeeStock Cost Measurement, Attribution & Variance Framework**  
> Dokumen ini mendefinisikan cost objects, cost components, direct/indirect cost, variable/fixed cost, landed cost, material cost, BOM/recipe costing, production cost, labor cost, partner/MultiGraph transfer cost, WIP, inventory cost, fulfillment cost, return/rework/scrap cost, project costing, shared-cost allocation, standard vs actual cost, variance analysis, dan cost lineage untuk management decision-making TeeStock.

---

# 1. Purpose

Cost Accounting menjawab:

> **Berapa biaya sebenarnya untuk membuat, menjual, memenuhi, dan mendukung setiap produk, order, service, project, atau capability TeeStock?**

Canonical principle:

> **If we cannot trace the cost, we cannot trust the margin.**

---

# 2. Canonical Definition

> **TeeStock Cost Accounting adalah management framework yang mengidentifikasi, mengklasifikasikan, mengukur, mengatribusikan, dan merekonsiliasi biaya terhadap relevant cost objects sehingga product economics, project profitability, inventory value, operational efficiency, pricing, dan capital-allocation decisions dapat menggunakan data biaya yang konsisten dan dapat ditelusuri.**

---

# 3. Management Costing vs Formal Accounting

Critical distinction:

```text id="ca001"
MANAGEMENT COSTING
supports internal decisions.

FINANCIAL ACCOUNTING
supports formal reporting and compliance.
```

Keduanya harus konsisten dengan realitas transaksi, tetapi dapat menggunakan struktur analisis berbeda.

---

# 4. Cost Accounting Objective

TeeStock harus mampu menjawab:

```text id="ca002"
WHAT DID IT COST?

WHY DID IT COST THAT MUCH?

WHO / WHAT CAUSED THE COST?

WAS IT EXPECTED?

WHAT CHANGED?

CAN IT BE REDUCED?

SHOULD PRICE CHANGE?
```

---

# 5. Cost Object

Canonical:

> **Cost Object adalah sesuatu yang TeeStock ingin ukur biayanya.**

---

# 6. Primary Cost Objects

Potential:

```text id="ca003"
SKU
PRODUCT
ORDER ITEM
ORDER
PRODUCTION JOB
WORK ORDER
PROJECT
SERVICE
CUSTOMER
CHANNEL
COLLECTION
LABEL
BUSINESS LINE
```

---

# 7. Cost Object Granularity

Do not track every cost at maximum granularity.

Canonical:

> **Use the lowest level that materially improves a decision.**

---

# 8. Cost Component

A Cost Component represents one identifiable source of economic cost.

Examples:

```text id="ca004"
BASE GARMENT
PRINTING
EMBROIDERY
PACKAGING
PAYMENT FEE
MARKETPLACE FEE
SHIPPING
ROYALTY
```

---

# 9. Cost Dimensions

Every cost can be understood through several dimensions:

```text id="ca005"
DIRECT / INDIRECT

VARIABLE / FIXED

STANDARD / ACTUAL

PRODUCT / PERIOD

CONTROLLABLE / LESS CONTROLLABLE
```

These dimensions are different.

---

# 10. Direct Cost

Canonical:

> **A direct cost can be reasonably traced to a specific cost object.**

Examples:

```text id="ca006"
GARMENT FOR ORDER
PRINTING FOR PRODUCT
FREELANCER FOR PROJECT
SHIPPING FOR SHIPMENT
```

---

# 11. Indirect Cost

Supports multiple cost objects.

Examples:

```text id="ca007"
WAREHOUSE RENT
CORE SOFTWARE
FINANCE TEAM
GENERAL ADMIN
```

---

# 12. Variable Cost

Changes meaningfully with activity volume.

---

# 13. Fixed Cost

Persists across a relevant short-term volume range.

---

# 14. Semi-Variable Cost

Contains both:

```text id="ca008"
BASE COST
+
USAGE COST
```

---

# 15. Cost Classification Rule

Do not classify costs simply for reporting convenience.

Classification should reflect economic behavior.

---

# 16. Cost Hierarchy

Canonical:

```text id="ca009"
INPUT COST
↓
PROCESS COST
↓
TRANSACTION COST
↓
FULFILLMENT COST
↓
CUSTOMER / RETURN COST
↓
SHARED OPERATING COST
```

---

# 17. Material Cost

Includes physical materials consumed to create/deliver product.

Potential:

```text id="ca010"
BASE GARMENT
FABRIC
LABEL
INK
TRANSFER
THREAD
PACKAGING
TRIM
```

---

# 18. Purchase Price

Supplier invoice unit price before acquisition-related additions.

---

# 19. Landed Cost

Canonical:

```text id="ca011"
PURCHASE PRICE
+
INBOUND FREIGHT
+
DIRECT IMPORT / PROCUREMENT COST
+
DIRECT RECEIVING COST where material
=
LANDED COST
```

---

# 20. Landed Cost Purpose

Used to understand real acquisition cost of inventory.

---

# 21. Supplier Discount

Should reduce applicable purchase cost according to financial policy.

---

# 22. Volume Rebate

If earned later:

do not prematurely assume it as guaranteed unit cost unless sufficiently certain.

---

# 23. Purchase Price Variance

Canonical:

```text id="ca012"
ACTUAL PURCHASE PRICE
-
STANDARD PURCHASE PRICE
=
PURCHASE PRICE VARIANCE
```

---

# 24. Freight Allocation

Inbound freight may be allocated based on reasonable driver such as:

```text id="ca013"
UNIT
WEIGHT
VALUE
VOLUME
```

depending shipment.

---

# 25. Avoid Fake Precision

For trivial inbound cost, simple allocation is acceptable.

---

# 26. Garment Platform Cost

Each base garment SKU should have:

```text id="ca014"
CURRENT COST
STANDARD COST
SUPPLIER SOURCE
EFFECTIVE DATE
```

---

# 27. BOM Costing

Canonical:

```text id="ca015"
BOM COMPONENT QTY
×
COMPONENT COST
=
EXPECTED MATERIAL COST
```

---

# 28. BOM Explosion

For quantity Q:

```text id="ca016"
PRODUCT BOM
×
Q
=
TOTAL MATERIAL REQUIREMENT
```

---

# 29. Recipe Costing

Recipe may add:

```text id="ca017"
PROCESS
LABOR
SETUP
PARTNER RATE
EXPECTED LOSS
```

to BOM material cost.

---

# 30. Standard Product Cost

Conceptually:

```text id="ca018"
STANDARD MATERIAL
+
STANDARD PROCESS
+
STANDARD DIRECT PACKAGING
=
STANDARD PRODUCT COST
```

---

# 31. Standard Cost Purpose

Useful for:

```text id="ca019"
PRICING
QUOTING
PLANNING
VARIANCE ANALYSIS
```

---

# 32. Standard Cost Is Not Permanent

Must update when:

```text id="ca020"
SUPPLIER COST
PROCESS
BOM
RECIPE
PARTNER RATE
```

materially changes.

---

# 33. Actual Cost

Represents real costs incurred during execution.

---

# 34. Actual Cost Inputs

Potential:

```text id="ca021"
ACTUAL MATERIAL ISSUE
ACTUAL PURCHASE PRICE
ACTUAL PARTNER INVOICE
ACTUAL SHIPPING
ACTUAL SCRAP
ACTUAL REWORK
```

---

# 35. Standard vs Actual

Canonical:

```text id="ca022"
STANDARD
expected.

ACTUAL
what happened.
```

---

# 36. Cost Variance

Canonical:

```text id="ca023"
ACTUAL
-
STANDARD
=
VARIANCE
```

---

# 37. Favorable vs Unfavorable

Lower actual cost may be favorable.

But only if quality/service is preserved.

---

# 38. Material Quantity Variance

Potentially measure:

```text id="ca024"
ACTUAL MATERIAL USED
-
STANDARD MATERIAL ALLOWED
```

---

# 39. Material Price Variance

Measures purchase cost difference.

---

# 40. Yield Variance

Poor yield raises cost per good unit.

---

# 41. Production Cost

Potential components:

```text id="ca025"
MATERIAL
DIRECT LABOR
PARTNER PROCESS
MACHINE / PROCESS COST
SETUP
SCRAP
REWORK
```

---

# 42. Production Cost Object

Primary:

```text id="ca026"
PRODUCTION JOB
```

then distributed to output.

---

# 43. Work Order Cost

Each Work Order can contribute cost to Production Job.

---

# 44. External Production

Use actual/contracted partner rate.

---

# 45. Internal Production

Needs a defined internal costing model.

---

# 46. Internal Costing Options

Potential:

```text id="ca027"
STANDARD PROCESS RATE
DIRECT LABOR + MACHINE RATE
TRANSFER RATE
```

Start simple.

---

# 47. Internal Process Rate

Example concept:

```text id="ca028"
DTF PRINT
Rp X / print
```

derived from expected operating cost.

---

# 48. Machine Rate

At scale, may include:

```text id="ca029"
DEPRECIATION
MAINTENANCE
POWER
OPERATOR
EXPECTED UTILIZATION
```

---

# 49. Early Stage Recommendation

Do not overengineer machine-hour costing before meaningful internal production exists.

---

# 50. Direct Labor Cost

Canonical:

```text id="ca030"
LABOR TIME
×
LABOR RATE
```

---

# 51. Labor Rate

Can include:

```text id="ca031"
WAGE
EMPLOYER COST
OTHER DIRECT EMPLOYMENT COST
```

according to finance policy.

---

# 52. Standard Labor Time

Useful for repeatable services/processes.

---

# 53. Actual Labor Time

Useful when:

- labor material,
- process improvement needed.

---

# 54. Founder Labor

Early unpaid founder effort should not disappear economically.

---

# 55. Shadow Labor Cost

Management view can estimate:

```text id="ca032"
FOUNDER HOURS
×
REFERENCE RATE
```

separately from accounting expense.

---

# 56. Service Costing

For service project:

```text id="ca033"
DIRECT LABOR
+
FREELANCER / PARTNER
+
DIRECT MATERIAL
+
PROJECT-SPECIFIC COST
=
DIRECT SERVICE COST
```

---

# 57. Studio Cost

Potential:

```text id="ca034"
DESIGN HOURS
REVISION HOURS
FREELANCER
SOFTWARE / ASSET if directly attributable
```

---

# 58. Revision Cost

Track additional revisions where they meaningfully affect project economics.

---

# 59. Custom / Business Project Cost

Potential:

```text id="ca035"
GARMENTS
DECORATION
DESIGN
SAMPLE
PACKAGING
SHIPPING
PROJECT HANDLING
```

---

# 60. Project Costing

Canonical:

```text id="ca036"
PROJECT
↓
DIRECT COSTS
↓
PROJECT CONTRIBUTION
```

---

# 61. Project Cost Ledger

Project-level cost entries should reference:

```text id="ca037"
PROJECT ID
COST TYPE
SOURCE DOCUMENT
AMOUNT
```

---

# 62. Scope Creep Cost

Additional unbilled work should remain visible.

---

# 63. Change Request Cost

Update expected project cost when scope changes.

---

# 64. Quote-to-Actual Cost

Canonical:

```text id="ca038"
QUOTED COST
vs
ACTUAL COST
```

---

# 65. Quote Variance

Can reveal:

```text id="ca039"
BAD ESTIMATE
SCOPE CREEP
PRICE CHANGE
PROCESS FAILURE
```

---

# 66. Partner Cost

Can include:

```text id="ca040"
PROCESS FEE
RUSH FEE
TRANSPORT
REWORK
SPECIAL HANDLING
```

---

# 67. Effective Partner Cost

Canonical:

```text id="ca041"
INVOICE COST
+
LOGISTICS
+
FAILURE COST
+
MANUAL HANDLING
```

where decision-useful.

---

# 68. MultiGraph Transfer Cost

Critical:

```text id="ca042"
RELATED-PARTY WORK
must carry
ECONOMIC COST
```

---

# 69. Transfer Cost Purpose

Ensures:

- TeeStock margins are real,
- MultiGraph capability economics are visible.

---

# 70. MultiGraph Transfer Methods

Possible management approaches:

```text id="ca043"
STANDARD PROCESS RATE
COST + MARKUP
MARKET-COMPARABLE RATE
```

---

# 71. Formal Tax Treatment

Separate from management transfer economics and should follow applicable professional/legal guidance.

---

# 72. Setup Cost

Fixed job-specific preparation.

Examples:

```text id="ca044"
SCREEN
DIGITIZATION
MACHINE SETUP
ARTWORK PREPARATION
```

---

# 73. Setup Cost Allocation

For batch:

```text id="ca045"
SETUP COST
/
GOOD OUTPUT QTY
```

for per-unit management view.

---

# 74. Small Batch Cost

Small batch absorbs higher setup cost per unit.

---

# 75. Scrap Cost

Scrap includes value of unusable input/output.

---

# 76. Scrap Cost Calculation

Potential:

```text id="ca046"
SCRAP QTY
×
COST BASIS
```

---

# 77. Scrap Attribution

Should link to:

```text id="ca047"
PROCESS
PARTNER
MATERIAL
ROOT CAUSE
```

where known.

---

# 78. Rework Cost

Canonical:

```text id="ca048"
ADDITIONAL MATERIAL
+
ADDITIONAL PROCESS
+
ADDITIONAL LABOR
```

---

# 79. Rework Belongs to Actual Cost

Do not hide as “operational issue.”

---

# 80. Replacement Cost

Customer replacement creates:

```text id="ca049"
NEW PRODUCT COST
+
FULFILLMENT
+
SHIPPING
```

without equivalent new revenue.

---

# 81. Return Cost

Potential:

```text id="ca050"
RETURN SHIPPING
INSPECTION
REPACK
REFUND PROCESSING
WRITE-OFF
```

---

# 82. Quality Cost

Canonical categories:

```text id="ca051"
PREVENTION
APPRAISAL
INTERNAL FAILURE
EXTERNAL FAILURE
```

---

# 83. Quality Cost Purpose

Helps decide whether more prevention is cheaper than repeated failure.

---

# 84. Fulfillment Cost

Potential components:

```text id="ca052"
PICK
PACK
PACKAGING
HANDLING
WAREHOUSE VARIABLE COST
```

---

# 85. Shipment Cost

Separate:

```text id="ca053"
CARRIER COST
```

from fulfillment handling.

---

# 86. Fulfillment Cost per Order

Useful for:

```text id="ca054"
COMMERCE
FULFILL SERVICE
CHANNEL ANALYSIS
```

---

# 87. Fulfillment Cost per Item

Useful for order-complexity analysis.

---

# 88. Pick/Pack Labor Cost

Can use standard rate initially.

---

# 89. Packaging Cost

Direct packaging should map to order/product where practical.

---

# 90. Special Packaging Cost

Must remain visible for:

- Originals,
- creator,
- B2B special pack.

---

# 91. Shipping Cost

Actual carrier cost should be attributed to Shipment.

---

# 92. Shipping Subsidy

Canonical:

```text id="ca055"
ACTUAL SHIPPING COST
-
CUSTOMER SHIPPING CHARGE
=
SHIPPING SUBSIDY
```

when positive.

---

# 93. Payment Processing Cost

Direct transaction cost.

---

# 94. Marketplace Cost

Potential:

```text id="ca056"
COMMISSION
SERVICE FEE
PROMOTION FEE
TRANSACTION FEE
```

---

# 95. Program Cost

Creator/Affiliate payouts should map to eligible transactions.

---

# 96. Creator Royalty Cost

Canonical:

```text id="ca057"
ROYALTY RULE
×
ELIGIBLE TRANSACTION
```

---

# 97. Affiliate Cost

Canonical:

```text id="ca058"
COMMISSION RULE
×
ATTRIBUTED ELIGIBLE TRANSACTION
```

---

# 98. Creator/Affiliate Reversal

Refund/cancellation should update cost ledger accordingly.

---

# 99. Inventory Cost

Each inventory receipt should carry cost basis.

---

# 100. Inventory Cost Layers

Possible:

```text id="ca059"
PURCHASE / LANDED COST
PRODUCTION VALUE ADDED
OTHER CAPITALIZED COST
```

depending formal accounting policy.

---

# 101. Operational Inventory Cost

MGBOS needs enough data to estimate product/unit economics even if formal accounting valuation method differs.

---

# 102. Inventory Cost Method

Formal choices may include:

```text id="ca060"
FIFO
WEIGHTED AVERAGE
```

subject to accounting policy.

---

# 103. Do Not Mix Cost Methods Randomly

One consistent formal treatment is required.

---

# 104. Standard Cost for Operations

Can coexist with formal accounting valuation.

---

# 105. Weighted Average Concept

If used:

```text id="ca061"
TOTAL COST OF AVAILABLE UNITS
/
TOTAL UNITS
```

---

# 106. FIFO Concept

Older cost layers consumed first.

---

# 107. Inventory Revaluation

Should follow accounting policy.

Not ad hoc management edits.

---

# 108. WIP

Canonical:

```text id="ca062"
WORK IN PROGRESS
```

represents production value not yet completed.

---

# 109. WIP Components

Potential:

```text id="ca063"
ISSUED MATERIAL
+
DIRECT PROCESS COST
```

up to current production stage.

---

# 110. Early V1 WIP

Operational quantity/status is more important than perfect accounting valuation.

---

# 111. Finished Goods Cost

Completed accepted output should carry accumulated product cost.

---

# 112. Production Transformation Cost

Canonical:

```text id="ca064"
INPUT INVENTORY COST
+
PRODUCTION VALUE ADD
=
FINISHED OUTPUT COST
```

---

# 113. Good Output Cost

If scrap occurs:

total valid production cost is spread over good units according to chosen costing logic.

---

# 114. Yield-Adjusted Cost

Poor yield raises actual unit cost.

---

# 115. Consignment Cost

Ownership determines whose inventory cost remains on balance.

Operational system should preserve owner.

---

# 116. Customer-Owned Inventory

Should not become TeeStock inventory cost.

But storage/handling service cost may still exist.

---

# 117. Dead Stock Cost

Dead stock retains economic impact until:

```text id="ca065"
SOLD
RETURNED
REWORKED
WRITTEN DOWN
WRITTEN OFF
```

---

# 118. Markdown

Lower selling price affects margin.

Does not automatically change inventory cost basis unless formal valuation rules require.

---

# 119. Write-Down

Accounting recognition that inventory value has fallen.

Formal rules belong to Finance/accounting compliance.

---

# 120. Write-Off

Removes unusable/lost economic value.

---

# 121. Inventory Adjustment Cost

Quantity adjustment should carry financial impact when relevant.

---

# 122. Shrinkage

Unexplained/lost stock is real cost.

---

# 123. Shared Operating Cost

Potential:

```text id="ca066"
WAREHOUSE
TECH
FINANCE
ADMIN
MANAGEMENT
```

---

# 124. Shared Cost Allocation Objective

Understand business-line economics.

Not manufacture artificial precision.

---

# 125. Allocation Driver

Use causal or reasonable driver.

---

# 126. Warehouse Allocation

Potential:

```text id="ca067"
SPACE
PALLET / BIN
INVENTORY VOLUME
ORDERS
```

---

# 127. Fulfillment Shared Labor

Potential:

```text id="ca068"
ORDERS
ITEMS
LABOR TIME
```

---

# 128. Technology Allocation

Potential:

```text id="ca069"
USERS
TRANSACTIONS
DIRECT USAGE
```

or remain central overhead if allocation offers little value.

---

# 129. Management Cost

May remain unallocated corporate overhead for many views.

---

# 130. Allocation Principle

Canonical:

> **Allocate when it improves a decision. Keep central when allocation would be arbitrary.**

---

# 131. Avoid Full Absorption Obsession

For short-term commercial decisions:

contribution is often more useful than fully allocated profit.

---

# 132. Full Cost

Can include:

```text id="ca070"
DIRECT COST
+
ALLOCATED INDIRECT COST
```

---

# 133. Use Full Cost For

Potential:

```text id="ca071"
LONG-TERM VIABILITY
BUSINESS-LINE REVIEW
CAPACITY INVESTMENT
```

---

# 134. Use Variable/Contribution Cost For

Potential:

```text id="ca072"
MARGINAL ORDER
PROMOTION
SHORT-TERM CHANNEL
```

provided capacity/opportunity cost is understood.

---

# 135. Period Cost

Costs expensed to period rather than attached to inventory/product according to accounting rules.

---

# 136. Product Cost

Costs associated with creating inventory/products.

---

# 137. Formal Classification

Must align with accountant/accounting standard where financial statements are concerned.

---

# 138. Customer Acquisition Cost

Can be attributed to:

```text id="ca073"
CHANNEL
CAMPAIGN
CUSTOMER COHORT
```

for management analysis.

---

# 139. Brand Marketing Cost

May remain period/portfolio cost when direct attribution is weak.

---

# 140. Content Cost

Can be:

- brand overhead,
- campaign direct cost,

depending purpose.

---

# 141. Campaign Cost

Track:

```text id="ca074"
AD SPEND
CREATIVE
CREATOR FEE
PROMOTION
```

where applicable.

---

# 142. Collection Development Cost

Potential:

```text id="ca075"
DESIGN
SAMPLING
PHOTOGRAPHY
CAMPAIGN
```

---

# 143. Originals Incubation Cost

Should remain visible as:

```text id="ca076"
PORTFOLIO INVESTMENT
```

even if not allocated per unit.

---

# 144. Label Cost

Label-level P&L can include:

```text id="ca077"
PRODUCT
CREATIVE
MARKETING
DIRECT OPERATIONS
```

---

# 145. Program Operating Cost

Beyond payouts, Programs may incur:

```text id="ca078"
ONBOARDING
PLATFORM
MANAGEMENT
SUPPORT
```

---

# 146. Creator Program Cost

Do not assume royalty is the only creator program cost.

---

# 147. Fulfillment Client Cost

External client should be measurable through:

```text id="ca079"
STORAGE
INBOUND
PICK
PACK
RETURN
SUPPORT
```

---

# 148. Cost-to-Serve

Canonical:

> **Cost-to-Serve measures operational cost required to support a customer, order, channel, or business model beyond product COGS.**

---

# 149. Customer Cost-to-Serve

Potential:

```text id="ca080"
SUPPORT
SPECIAL HANDLING
RETURNS
ACCOUNT MANAGEMENT
CREDIT
```

---

# 150. Channel Cost-to-Serve

Potential:

```text id="ca081"
FEES
PROMOTIONS
SPECIAL OPS
RETURNS
```

---

# 151. Complexity Cost

Complexity causes cost even when no supplier invoice exists.

---

# 152. Complexity Examples

```text id="ca082"
MANUAL DATA ENTRY
CUSTOM PACKING
MULTIPLE APPROVALS
SPECIAL ROUTING
```

---

# 153. Manual Touch Cost

Can be estimated through:

```text id="ca083"
TOUCH TIME
×
LABOR RATE
```

---

# 154. Automation Baseline

Before automation, know current:

```text id="ca084"
LABOR COST
ERROR COST
CYCLE TIME
```

---

# 155. Automation Cost

Potential:

```text id="ca085"
SOFTWARE
AI MODEL USAGE
DEVELOPMENT
MAINTENANCE
MONITORING
```

---

# 156. Automation ROI

Canonical:

```text id="ca086"
COST SAVED
+
CAPACITY CREATED
+
FAILURE REDUCED
-
AUTOMATION COST
```

---

# 157. Cost Center

Potential organizational view:

```text id="ca087"
PRODUCTION
FULFILLMENT
STUDIO
CUSTOMER OPS
TECH
ADMIN
```

---

# 158. Cost Center ≠ Business Line

Critical:

```text id="ca088"
COST CENTER
where cost is incurred.

BUSINESS LINE
where economic value/revenue belongs.
```

---

# 159. Shared Cost Center

Production may serve:

- Commerce,
- Custom,
- Merch,
- Originals.

---

# 160. Cost Center Performance

Can monitor:

```text id="ca089"
TOTAL COST
COST PER OUTPUT
CAPACITY
VARIANCE
```

---

# 161. Responsibility Center

At scale, cost owners may be responsible for controllable budgets.

---

# 162. Cost Code

Recurring cost types should use canonical codes/categories.

Avoid free-text chaos.

---

# 163. Cost Taxonomy

Potential hierarchy:

```text id="ca090"
MATERIAL
PRODUCTION
FULFILLMENT
CHANNEL
PROGRAM
CUSTOMER RECOVERY
OPERATING
```

---

# 164. Cost Source Documents

Potential:

```text id="ca091"
PURCHASE ORDER
SUPPLIER INVOICE
WORK ORDER
PAYROLL
SHIPMENT
PAYMENT SETTLEMENT
REFUND
```

---

# 165. Cost Lineage

Canonical:

```text id="ca092"
SOURCE DOCUMENT
↓
COST ENTRY
↓
COST OBJECT
↓
UNIT ECONOMICS
↓
P&L
```

---

# 166. Cost Traceability

Every material cost should ideally answer:

```text id="ca093"
WHAT CAUSED IT?
WHAT OBJECT RECEIVED IT?
WHERE DID AMOUNT COME FROM?
```

---

# 167. Cost Snapshot

Historical order cost should preserve transaction-time reality.

Do not recompute old order using today's supplier cost.

---

# 168. Standard Cost Versioning

Each standard cost should have:

```text id="ca094"
EFFECTIVE FROM
EFFECTIVE TO
VERSION
```

---

# 169. Rate Card Versioning

Production/partner rates also versioned.

---

# 170. Cost Update

New rate applies prospectively unless explicit adjustment is required.

---

# 171. Expected Cost Snapshot

At quote/order:

freeze expected cost assumptions.

---

# 172. Actual Cost Snapshot

At project/order close:

record actual.

---

# 173. Variance Explanation

Potential categories:

```text id="ca095"
PRICE
QUANTITY
YIELD
LABOR
PARTNER
SHIPPING
SCOPE
RETURN
```

---

# 174. Material Price Variance

Supplier/rate movement.

---

# 175. Material Usage Variance

More/less material consumed than planned.

---

# 176. Labor Efficiency Variance

More/less labor time than standard.

---

# 177. Production Rate Variance

Different process/partner rate.

---

# 178. Freight Variance

Actual logistics differs from estimate.

---

# 179. Return Variance

Unexpected recovery/replacement cost.

---

# 180. Scope Variance

Service delivered beyond quote assumptions.

---

# 181. Variance Materiality

Do not investigate every tiny variance.

---

# 182. Variance Threshold

Exact thresholds belong in:

```text id="ca096"
decision-thresholds.md
```

---

# 183. Recurring Variance

Repeated unfavorable variance indicates:

```text id="ca097"
BAD STANDARD
or
BAD PROCESS
```

---

# 184. Standard Revision

If actual reality consistently differs:

update standard after investigation.

---

# 185. Do Not Move Standard to Hide Failure

Canonical.

---

# 186. Production Job Close

Costing should ideally reconcile:

```text id="ca098"
MATERIAL ISSUED
MATERIAL RETURNED
OUTPUT
SCRAP
REWORK
PARTNER COST
```

---

# 187. Cost Finalization

A Production Job's actual cost should become final after sufficient inputs are known.

---

# 188. Late Invoice

Partner/supplier invoice may arrive after operational completion.

System should support provisional then final actual cost.

---

# 189. Accrued Cost

Management may recognize expected obligation before invoice arrives.

Formal accounting treatment belongs in Finance policy.

---

# 190. Order Cost Finalization

Potential after:

```text id="ca099"
FULFILLMENT
ACTUAL SHIPPING
RETURN WINDOW / COST ADJUSTMENT
```

depending analysis.

---

# 191. Preliminary Contribution

Available early.

---

# 192. Final Contribution

Available after relevant actual costs settle.

---

# 193. Cost Accounting Data Model

Core future entities:

```text id="ca100"
COST COMPONENT
COST ENTRY
COST OBJECT
STANDARD COST
ACTUAL COST
ALLOCATION RULE
RATE CARD
COST SNAPSHOT
VARIANCE
```

---

# 194. Cost Entry

Represents one cost occurrence.

---

# 195. Cost Entry Minimum

```text id="ca101"
Cost Entry ID
Cost Type
Amount
Currency
Source
Cost Object
Date
Status
```

---

# 196. Standard Cost Entity

Expected cost by product/process/version.

---

# 197. Rate Card Entity

Defines operational rate.

---

# 198. Allocation Rule Entity

Maps shared cost using defined driver.

---

# 199. Variance Entity

Stores expected-vs-actual difference.

---

# 200. Cost Snapshot Entity

Preserves economics at defined lifecycle point.

---

# 201. Cost Status

Potential:

```text id="ca102"
ESTIMATED
ACCRUED
ACTUAL
ADJUSTED
FINAL
```

---

# 202. Estimated

Planning value.

---

# 203. Accrued

Expected obligation sufficiently probable but not yet finally invoiced.

---

# 204. Actual

Observed transaction cost.

---

# 205. Adjusted

Cost corrected by later event.

---

# 206. Final

No further material change expected.

---

# 207. Cost Currency

If foreign sourcing occurs:

store original:

```text id="ca103"
CURRENCY
AMOUNT
EXCHANGE RATE
BASE CURRENCY AMOUNT
```

---

# 208. Base Currency

TeeStock management reporting should use a canonical base currency.

Current natural default:

```text id="ca104"
IDR
```

unless organizational policy changes.

---

# 209. Tax Components

Cost records should distinguish taxes recoverable/non-recoverable according to applicable rules.

Exact implementation requires accounting/tax policy.

---

# 210. VAT / Tax Caution

Do not mix tax-inclusive operational cash amount blindly into margin cost if accounting treatment differs.

---

# 211. Cost Approval

Some cost types require approval before commitment.

---

# 212. Spend Commitment vs Expense

Critical:

```text id="ca105"
PURCHASE ORDER
creates commitment.

INVOICE / RECEIPT
creates actual/accrued obligation.
```

---

# 213. Committed Cost

Future cash obligation from approved commitments.

Useful for cash forecasting.

---

# 214. Open PO Exposure

Canonical:

```text id="ca106"
OPEN PURCHASE ORDERS
=
COMMITTED PROCUREMENT SPEND
```

---

# 215. Open Work Order Exposure

External Work Orders may represent committed production cost.

---

# 216. Budget Cost

Planned spending level.

---

# 217. Actual vs Budget

Useful at:

```text id="ca107"
COST CENTER
BUSINESS LINE
PROJECT
```

---

# 218. Cost Forecast

Update expected costs as real operational data changes.

---

# 219. Cost Accounting and Pricing

Canonical loop:

```text id="ca108"
ACTUAL COST
↓
STANDARD COST
↓
UNIT ECONOMICS
↓
PRICE / QUOTE
↓
NEW ACTUAL COST
```

---

# 220. Cost Accounting and Sourcing

Supplier cost/performance feeds sourcing decisions.

---

# 221. Cost Accounting and Production

Actual material/yield/rework feeds recipe/process improvements.

---

# 222. Cost Accounting and Quality

Quality failure cost influences prevention investment.

---

# 223. Cost Accounting and Inventory

Inventory movements determine cost flow.

---

# 224. Cost Accounting and Fulfillment

Actual order handling/shipping improves channel economics.

---

# 225. Cost Accounting and Returns

Return/replacement cost updates true product profitability.

---

# 226. Cost Accounting and Programs

Royalties/commissions must be recognized as transaction-linked cost.

---

# 227. Cost Accounting and Originals

Collection/label investment must remain visible.

---

# 228. Cost Accounting and MGBOS

MGBOS should eventually answer:

```text id="ca109"
What is the expected cost?

What is the actual cost?

Why did cost change?

Which order / product caused it?

Which supplier / partner caused variance?

How much scrap / rework did we pay for?

Which business line consumes shared resources?

What cost should pricing use now?
```

---

# 229. Cost Dashboard

Potential:

```text id="ca110"
PRODUCT COST
PURCHASE PRICE VARIANCE
PRODUCTION VARIANCE
SCRAP
REWORK
FULFILLMENT COST
RETURN COST
```

---

# 230. Cost by Product

Potential:

```text id="ca111"
STANDARD
ACTUAL
VARIANCE
TREND
```

---

# 231. Cost by Supplier

Potential:

```text id="ca112"
PURCHASE
FREIGHT
DEFECT
CLAIM
EFFECTIVE COST
```

---

# 232. Cost by Production Route

Compare:

```text id="ca113"
TEEStock INTERNAL
MULTIGRAPH
EXTERNAL PARTNER
```

---

# 233. Cost by Customer

Useful for B2B cost-to-serve.

---

# 234. Cost by Channel

Supports channel profitability.

---

# 235. Cost by Collection

Supports Originals decisions.

---

# 236. Automation Opportunities

Potential:

```text id="ca114"
BOM COST ROLLUP
STANDARD COST UPDATE
ACTUAL COST INGESTION
VARIANCE ALERT
PROJECT COSTING
SHIPPING COST ATTRIBUTION
```

---

# 237. Automatic Cost Rollup

For standardized product:

```text id="ca115"
COMPONENT COSTS
+
PROCESS RATES
=
STANDARD COST
```

---

# 238. Supplier Price Update

Can trigger:

```text id="ca116"
STANDARD COST REVIEW
+
MARGIN REVIEW
```

---

# 239. Cost Variance Alert

Potential:

```text id="ca117"
ACTUAL COST
> EXPECTED COST + THRESHOLD
```

---

# 240. AI Role

AI may assist with:

```text id="ca118"
Cost Classification
Invoice Extraction
Variance Explanation
Anomaly Detection
Cost Reduction Opportunities
```

---

# 241. AI Cost Boundary

AI may suggest accounting/management category.

It should not silently:

```text id="ca119"
WRITE OFF INVENTORY
ALTER HISTORICAL COST
CHANGE ACCOUNTING POLICY
```

---

# 242. AI Invoice Extraction

Useful for:

```text id="ca120"
SUPPLIER
AMOUNT
ITEM
PO
```

with validation.

---

# 243. AI Cost Optimization

Can identify:

> Partner B is cheaper on quoted rate but has higher rework-adjusted effective cost.

---

# 244. Deterministic Cost Math

Actual cost calculation should remain reproducible.

---

# 245. Cost Accounting Maturity

```text id="ca121"
LEVEL 0
Cost guesses

LEVEL 1
Purchase / direct cost tracking

LEVEL 2
Standard + actual product/project cost

LEVEL 3
Variance + WIP + shared allocation

LEVEL 4
Integrated real-time cost flows

LEVEL 5
AI-assisted cost optimization
```

---

# 246. Level 0

Anti-goal:

> “Modal kaos sekitar segini.”

---

# 247. Level 1

Track:

```text id="ca122"
PURCHASE COST
PRODUCTION COST
SHIPPING
PARTNER COST
```

---

# 248. Level 2

Adds:

```text id="ca123"
BOM
RECIPE
STANDARD COST
ACTUAL COST
PROJECT COST
```

---

# 249. Level 3

Adds:

```text id="ca124"
VARIANCE
WIP
QUALITY COST
SHARED COST
```

---

# 250. Level 4

Adds:

```text id="ca125"
AUTOMATED COST EVENTS
INVENTORY VALUATION LINK
REAL-TIME MARGIN FEED
```

---

# 251. Level 5

System surfaces:

```text id="ca126"
COST ANOMALY
ROOT CAUSE
SOURCING / PROCESS ALTERNATIVE
```

for human review.

---

# 252. Current Recommended Stage

TeeStock should target:

```text id="ca127"
LEVEL 1
→
LEVEL 2
```

first.

---

# 253. V1 Required Cost Truth

Priority:

```text id="ca128"
BASE PRODUCT COST
SUPPLIER COST
PRODUCTION COST
PARTNER COST
PACKAGING
SHIPPING
ROYALTY / COMMISSION
REFUND / REPLACEMENT
```

---

# 254. V1 Standard Cost

Establish for:

```text id="ca129"
CORE GARMENT PLATFORMS
COMMON PRINT METHODS
COMMON PACKAGING
```

---

# 255. V1 Actual Cost

Capture actual for:

```text id="ca130"
PURCHASE
EXTERNAL PRODUCTION
SHIPPING
RETURNS
```

---

# 256. V1 Project Costing

Custom/Business/Studio projects should have:

```text id="ca131"
EXPECTED COST
ACTUAL COST
VARIANCE
```

---

# 257. V1 Shared Cost

Keep broad:

```text id="ca132"
SHARED / OVERHEAD
```

unless allocation creates clear decision value.

---

# 258. V1 Avoid

Do not immediately build:

```text id="ca133"
complex activity-based costing
minute-level labor costing everywhere
full manufacturing cost absorption
machine-hour precision without data
```

---

# 259. V2 Expansion

Possible:

```text id="ca134"
BOM COST ROLLUP
WIP COST
PRODUCTION VARIANCE
QUALITY COST
COST-TO-SERVE
```

---

# 260. V3 Expansion

Possible:

```text id="ca135"
SHARED COST ALLOCATION
COST CENTER ANALYSIS
ACTUAL LABOR
AUTOMATED LANDED COST
```

---

# 261. V4 Expansion

Possible:

```text id="ca136"
REAL-TIME COST ENGINE
PREDICTIVE COST
AI COST OPTIMIZATION
```

---

# 262. Cost Object Gate

Create dedicated cost object only when:

```text id="ca137"
ECONOMIC VALUE
+
DECISION VALUE
```

justify tracking.

---

# 263. Standard Cost Gate

Create standard cost when:

```text id="ca138"
PRODUCT / PROCESS
is repeatable enough
```

---

# 264. Actual Cost Gate

Capture actual cost wherever variance materially affects:

```text id="ca139"
MARGIN
PRICING
PROCESS
SUPPLIER DECISION
```

---

# 265. Allocation Gate

Allocate indirect cost only when:

```text id="ca140"
DRIVER REASONABLE
+
DECISION IMPROVES
```

---

# 266. Cost Update Gate

Change standard when:

```text id="ca141"
REAL UNDERLYING ECONOMICS CHANGE
```

not to hide unfavorable operational variance.

---

# 267. Write-Off Gate

Requires:

```text id="ca142"
VALID REASON
+
INVENTORY / ASSET EVIDENCE
+
APPROPRIATE APPROVAL
```

---

# 268. Related-Party Cost Gate

Every material MultiGraph/TeeStock internal service should have management cost basis.

---

# 269. Cost Accounting Failure Modes

## Supplier Price = Product Cost

Ignores production and other direct costs.

## Standard Cost Never Changes

Pricing becomes stale.

## Actual Cost Never Captured

No learning.

## Related-Party Work = Zero Cost

False margin.

## Scrap Hidden

Production appears cheaper than reality.

## Rework Hidden

Quality failure disappears.

## Founder Labor Ignored

Service profitability overstated.

## Shared Costs Allocated Arbitrarily

Bad strategic decisions.

---

# 270. What Cost Accounting Must Not Become

## Accounting Bureaucracy

Cost detail must serve decisions.

## False Precision System

Do not measure what cannot yet be measured reliably.

## Margin Decoration

Choose consistent rules, not flattering ones.

## Historical Rewrite Engine

Preserve expected and actual snapshots.

## Manual Spreadsheet Maze

Cost lineage should increasingly derive from operational records.

---

# 271. Cost Accounting Success Definition

The system succeeds when TeeStock can answer:

```text id="ca143"
WHAT DID THIS PRODUCT COST?

WHAT DID THIS ORDER COST?

WHAT DID THIS PROJECT COST?

WHAT DID PRODUCTION COST?

WHAT DID THE PARTNER COST?

HOW MUCH DID SCRAP / REWORK ADD?

HOW MUCH DID FULFILLMENT COST?

WHY WAS ACTUAL ABOVE EXPECTED?

WHICH COST SHOULD OUR NEXT PRICE USE?

WHERE CAN WE IMPROVE?
```

---

# 272. Canonical Cost Accounting Summary

```text id="ca144"
COST OBJECT
defines what we measure.

COST COMPONENT
defines what created cost.

STANDARD COST
defines expected economics.

ACTUAL COST
records reality.

VARIANCE
reveals deviation.

ALLOCATION
assigns shared burden where useful.

COST LINEAGE
explains origin.

MGBOS
connects operational activity to financial truth.
```

---

# 273. Canonical Cost Accounting Principles

```text id="ca145"
IF WE CANNOT TRACE THE COST, WE CANNOT TRUST THE MARGIN.

DIRECT COST BEFORE ALLOCATION.

LANDED COST BEFORE PURCHASE ECONOMICS.

BOM BEFORE STANDARD PRODUCT COST.

RECIPE BEFORE REPEATABLE PROCESS COST.

ACTUALS BEFORE ASSUMPTIONS.

SCRAP IS COST.

REWORK IS COST.

RETURNS ARE COST.

RELATED-PARTY WORK IS NOT FREE.

FOUNDER LABOR IS NOT ECONOMICALLY FREE.

ALLOCATE ONLY WHEN IT IMPROVES DECISIONS.

PRESERVE EXPECTED AND ACTUAL.

VARIANCE IS A LEARNING SIGNAL.

COST DATA MUST FEED PRICING.
```

---

# 274. Dependency

Dokumen berikut harus follow Cost Accounting:

1. `08-finance/treasury-policy.md`
2. `09-marketing/go-to-market.md`
3. `09-marketing/channel-strategy.md`
4. `10-product-tech/automation-architecture.md`
5. `11-data-mgbos/canonical-data-model.md`
6. `11-data-mgbos/entity-hierarchy.md`
7. `11-data-mgbos/event-model.md`
8. `11-data-mgbos/mgbos-integration.md`
9. `13-metrics-experiments/kpi-framework.md`
10. `13-metrics-experiments/decision-thresholds.md`

TeeStock Cost Accounting boleh berkembang menjadi real-time integrated cost engine, tetapi sophistication hanya boleh dibangun setelah purchasing, inventory, production, fulfillment, program payouts, returns, dan project execution menghasilkan reliable transactional cost data.