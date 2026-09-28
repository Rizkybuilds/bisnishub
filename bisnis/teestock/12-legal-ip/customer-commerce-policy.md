---
title: "TeeStock Customer Commerce Policy"
document_id: "TS-LEG-005"
version: "1.0"
status: "CANONICAL"
category: "legal-ip"
business: "teestock"
last_updated: "2026-09-28"
depends_on:
  - "TS-LEG-001"
  - "TS-LEG-002"
  - "TS-LEG-003"
  - "TS-LEG-004"
  - "TS-COM-001"
  - "TS-COM-004"
  - "TS-SVC-002"
  - "TS-SVC-003"
  - "TS-SVC-004"
  - "TS-OPS-006"
  - "TS-OPS-007"
  - "TS-OPS-008"
  - "TS-FIN-003"
  - "TS-FIN-005"
  - "TS-TEC-003"
  - "TS-DAT-004"
---

# TeeStock Customer Commerce Policy v1.0

> **Canonical TeeStock Customer Transaction, Order, Payment, Production, Delivery, Cancellation, Return, Refund & Commerce-Term Governance Framework**

Dokumen ini mendefinisikan prinsip dan rules canonical yang mengatur hubungan transaksi antara TeeStock dan customer melalui Website, marketplace, assisted sales, Custom, Business, Merch, dan future commerce channels.

---

# 1. Purpose

Customer Commerce Policy menjawab:

> **Ketika customer membeli atau memesan dari TeeStock, apa yang dijanjikan masing-masing pihak, kapan transaksi menjadi committed, bagaimana perubahan dan pembatalan diproses, siapa bertanggung jawab ketika terjadi kesalahan, dan bagaimana sistem menyelesaikan kasus secara konsisten?**

Canonical principle:

> **Clear before purchase. Traceable after purchase. Fair when something goes wrong.**

---

# 2. Canonical Definition

> **TeeStock Customer Commerce Policy adalah shared commercial-policy framework yang menerjemahkan customer rights, TeeStock responsibilities, product/service terms, order lifecycle, approvals, payment, production, delivery, cancellation, return, refund, warranty, and dispute rules menjadi customer-facing terms dan machine-readable Commerce/MGBOS rules.**

---

# 3. Policy Is Not Legal Disclaimer

Canonical:

```text
POLICY
should govern behavior.

NOT merely
protect TeeStock in fine print.
```

---

# 4. Legal Floor

TeeStock policy may provide stronger customer treatment than minimum applicable law.

It must not intentionally contract below mandatory consumer protection.

---

# 5. Policy Hierarchy

Canonical:

```text
MANDATORY LAW
↓
EXECUTED CONTRACT / QUOTE
↓
TEEStock CUSTOMER POLICY
↓
ORDER-SPECIFIC TERMS
↓
OPERATIONAL SOP
```

where legally applicable.

---

# 6. Specific Agreement vs General Policy

For B2B/custom projects:

```text
SIGNED / APPROVED SPECIFIC TERMS
```

may supplement general Commerce Policy.

---

# 7. Customer Types

Canonical commercial contexts:

```text
CONSUMER
BUSINESS CUSTOMER
CREATOR / MERCH CLIENT
RESELLER
INSTITUTION
```

---

# 8. Consumer vs Business

Do not assume identical rules always apply.

Consumer-protection obligations may apply differently from negotiated B2B arrangements.

---

# 9. Channel Types

Potential:

```text
TEEStock WEBSITE
MARKETPLACE
SOCIAL COMMERCE
WHATSAPP / ASSISTED SALES
OFFLINE / EVENT
B2B DIRECT
```

---

# 10. Channel Does Not Change Product Truth

Canonical.

---

# 11. Channel May Change Transaction Procedure

Marketplace-specific:

```text
PAYMENT
RETURN FLOW
DISPUTE FLOW
```

may be subject to platform process.

---

# 12. Marketplace Policy Conflict

Canonical:

```text
APPLICABLE LAW
+
MARKETPLACE MANDATORY RULE
+
TEEStock POLICY
```

should be reconciled.

---

# 13. Commerce Agreement

A customer transaction should have identifiable:

```text
CUSTOMER
SELLER
PRODUCT / SERVICE
PRICE
QUANTITY
TERMS
PAYMENT
DELIVERY / PERFORMANCE
```

---

# 14. Order ≠ Cart

Canonical.

---

# 15. Cart

Represents customer purchase intent.

---

# 16. Checkout

Represents validated transaction preparation.

---

# 17. Order

Represents commercial commitment in accordance with applicable acceptance/payment rules.

---

# 18. Quote

For complex work:

```text
QUOTE
≠
ORDER
```

until accepted/conversion conditions are satisfied.

---

# 19. Product Information Principle

Canonical:

> **Customer should know what they are buying before TeeStock asks them to commit.**

---

# 20. Product Information

Where relevant:

```text
PRODUCT NAME
MATERIAL
SIZE
COLOR
FIT
DESIGN
PRICE
AVAILABILITY
LEAD TIME
CARE
CUSTOMIZATION
```

---

# 21. Information Accuracy

Product information should be:

```text
TRUE
CURRENT ENOUGH
CLEAR
NON-MISLEADING
```

---

# 22. Product Photography

Images should reasonably represent the product.

---

# 23. Screen Color Variance

Customer-facing disclosure may explain reasonable display/device color differences.

---

# 24. Color Variance Is Not Unlimited Disclaimer

Canonical.

Significant product mismatch remains a product-quality issue.

---

# 25. Size Information

TeeStock should publish useful size guidance.

---

# 26. Size Guide

Where products vary by fit/platform:

size information should be product-specific where practical.

---

# 27. Customer Size Selection

Wrong size selected by customer may follow change-of-mind/exchange policy.

---

# 28. Wrong Size Sent by TeeStock

TeeStock error.

Different treatment.

---

# 29. Stock Availability

Canonical:

> **Available-to-sell should reflect genuine sellability, not a marketing fiction.**

---

# 30. Ready Stock

Means product is intended to be fulfilled from available inventory.

---

# 31. Made-to-Order

Means production starts after qualifying customer order.

---

# 32. Preorder

Means customer orders before normal fulfillment availability under disclosed expected release/ship conditions.

---

# 33. Custom

Means customer-specific specification affects production.

---

# 34. Business Project

May involve:

```text
QUOTE
APPROVAL
DEPOSIT
PRODUCTION
MILESTONES
```

rather than ordinary consumer checkout.

---

# 35. Fulfillment Mode Must Be Visible

Customer should reasonably know whether purchase is:

```text
READY STOCK
PREORDER
MADE-TO-ORDER
CUSTOM
```

before commitment.

---

# 36. Price Principle

Canonical:

> **The customer-facing total should be understandable before payment commitment.**

---

# 37. Price Components

Potential:

```text
PRODUCT
CUSTOMIZATION
SHIPPING
DISCOUNT
TAX
OTHER DISCLOSED CHARGE
```

where applicable.

---

# 38. Hidden Charges

Avoid.

---

# 39. Price Snapshot

Canonical Order stores price accepted at transaction.

---

# 40. Later Price Change

Does not silently rewrite historical Order.

---

# 41. Pricing Error

Obvious system/pricing error should have controlled review rather than arbitrary fulfillment/cancellation.

---

# 42. Promotion Terms

Promotion must define where relevant:

```text
ELIGIBILITY
PERIOD
PRODUCTS
CHANNEL
LIMITS
STACKING
```

---

# 43. Promo Code Is Not Cash

Unless explicitly structured as store credit/value instrument.

---

# 44. Promotion Expiry

Does not retroactively remove a valid completed discount.

---

# 45. Payment Methods

Customer sees supported payment methods at transaction.

---

# 46. Payment Provider

External provider may process payment.

TeeStock maintains canonical Payment state.

---

# 47. Payment Pending

Order may remain:

```text
AWAITING_PAYMENT
```

until verified payment confirmation.

---

# 48. Browser Redirect ≠ Payment Truth

Canonical.

---

# 49. Payment Confirmation

Use verified payment-provider/system evidence.

---

# 50. Duplicate Payment

Must be investigated and reconciled.

---

# 51. Payment Failure

Does not mean customer owes two attempts.

---

# 52. Deposit

Custom/B2B orders may require deposit.

---

# 53. Deposit Terms

Quote/order should state:

```text
AMOUNT / %
DUE DATE
PURPOSE
NEXT MILESTONE
```

---

# 54. Deposit ≠ Automatic Non-Refundability

Treatment depends on:

```text
WORK PERFORMED
COMMITTED COST
CANCELLATION STAGE
SPECIFIC AGREEMENT
MANDATORY RIGHTS
```

---

# 55. Final Payment

Can be tied to defined milestone.

---

# 56. Credit Terms

B2B credit requires explicit approval.

---

# 57. Order Acceptance

Potential standard commerce flow:

```text
CHECKOUT
↓
ORDER CREATED
↓
PAYMENT VERIFIED
↓
ORDER CONFIRMED
```

---

# 58. Order Confirmation

Customer should receive transaction evidence.

---

# 59. Order Confirmation Content

Potential:

```text
ORDER NUMBER
ITEMS
QUANTITIES
TOTAL
DELIVERY DETAILS
STATUS / LEAD TIME
```

---

# 60. Terms Snapshot

Canonical:

> **The Order should preserve which policy/terms version applied when the transaction was accepted.**

---

# 61. Policy Version ID

Potential:

```text
commerce_policy_version
```

stored on Order.

---

# 62. Checkout Consent

Where consent/acceptance is required:

record:

```text
POLICY VERSION
TIMESTAMP
CUSTOMER / SESSION
```

---

# 63. No Dark Pattern Consent

Canonical.

Terms acceptance should not be intentionally deceptive.

---

# 64. Guest Checkout

Allowed where business chooses.

Canonical Order still stores required contact/customer context.

---

# 65. Account Creation

Should not be unnecessarily forced where not needed operationally.

---

# 66. Personal Data

Customer-data handling belongs to privacy/data-protection controls.

Indonesia's UU No. 27/2022 on Personal Data Protection remains the core statutory framework for personal-data protection.

---

# 67. Data Minimization

Collect only data reasonably required for:

```text
ORDER
DELIVERY
PAYMENT
SUPPORT
LEGAL / BUSINESS REQUIREMENTS
```

---

# 68. Marketing Consent

Separate from transactional necessity where required.

---

# 69. Transactional Communications

Examples:

```text
ORDER CONFIRMATION
PAYMENT
PRODUCTION
SHIPMENT
RETURN
```

---

# 70. Marketing Communications

Separate purpose.

---

# 71. Order Changes

Customer may request change.

Ability depends on stage.

---

# 72. Standard Product Change

Before fulfillment:

possible subject to:

```text
STOCK
PAYMENT
PROCESSING STAGE
```

---

# 73. Custom Change

More constrained.

---

# 74. Custom Change Workflow

```text
CHANGE REQUEST
↓
IMPACT REVIEW
↓
PRICE / TIME IMPACT
↓
CUSTOMER APPROVAL
↓
CHANGE ORDER
```

---

# 75. No Silent Custom Change

Canonical.

---

# 76. Customer Approval

For Custom/Business work, certain production outputs may require approval.

---

# 77. Approval Objects

Potential:

```text
DESIGN
MOCKUP
ARTWORK
SIZE BREAKDOWN
MATERIAL
QUOTE
SAMPLE
```

---

# 78. Approval Must Be Versioned

Customer approval applies to identifiable version.

---

# 79. Approved Version

Production should use approved version.

---

# 80. Customer Approval Evidence

Store:

```text
APPROVER
VERSION
TIMESTAMP
COMMENTS
```

---

# 81. Customer Approval ≠ Waiver of TeeStock Production Quality

Canonical.

Approval of artwork does not excuse manufacturing defects.

---

# 82. Proof Approval

Customer is responsible for reviewing customer-controlled details such as:

```text
SPELLING
NAMES
NUMBERS
PLACEMENT REQUEST
```

before approval.

---

# 83. TeeStock Error After Approval

If TeeStock produces differently from approved specification:

TeeStock-caused nonconformity.

---

# 84. Customer Error Approved in Proof

Handled differently, subject to applicable law and case facts.

---

# 85. Production Start

Custom/MTO Order should have explicit:

```text
PRODUCTION_STARTED_AT
```

or equivalent state.

---

# 86. Why Production Start Matters

After production starts:

```text
MATERIAL
LABOR
PARTNER COST
```

may become committed.

---

# 87. Cancellation Categories

Canonical:

```text
CUSTOMER CHANGE OF MIND
CUSTOMER ERROR
TEEStock ERROR
UNAVAILABLE PRODUCT
PAYMENT FAILURE
PRODUCTION FAILURE
DELIVERY FAILURE
LEGAL / IP HOLD
```

---

# 88. Cancellation Is Stage-Dependent

Canonical.

---

# 89. Ready-Stock Cancellation

Before release to fulfillment:

generally easier to accommodate operationally.

---

# 90. Shipment Already Released

Cancellation may instead become return workflow.

---

# 91. MTO Cancellation

After production starts:

may involve committed cost.

---

# 92. Custom Cancellation

After approved personalized production begins:

may be subject to specific agreed cancellation charges/retained costs, **without overriding mandatory consumer rights**.

---

# 93. No Absolute “Custom Items Never Refund”

Canonical.

---

# 94. Defective Custom Item

Still requires remedy consideration.

Personalization does not excuse defect/nonconformity.

---

# 95. TeeStock-Initiated Cancellation

Possible if:

```text
STOCK FAILURE
PRODUCTION IMPOSSIBILITY
RIGHTS ISSUE
FRAUD / SECURITY ISSUE
OBVIOUS SYSTEM ERROR
```

subject to appropriate process.

---

# 96. TeeStock Cancellation Outcome

Customer should receive appropriate:

```text
NOTICE
REFUND / REVERSAL
NEXT OPTION
```

as applicable.

---

# 97. Refund Mechanism

PP 80/2019 requires a mechanism capable of ensuring return of consumer funds where a purchase is cancelled.

Canonical architecture:

```text
CANCELLATION / REMEDY
↓
REFUND ELIGIBILITY
↓
REFUND AUTHORIZATION
↓
PAYMENT REFUND
↓
RECONCILIATION
```

---

# 98. Refund ≠ Cancellation

Canonical.

Cancellation changes commercial obligation.

Refund changes money movement.

---

# 99. Refund Status

Potential:

```text
REQUESTED
APPROVED
PROCESSING
COMPLETED
FAILED
REJECTED
```

---

# 100. Refund Amount

Can be:

```text
FULL
PARTIAL
```

based on lawful/contractual resolution.

---

# 101. Refund Evidence

Preserve:

```text
SOURCE TRANSACTION
AMOUNT
REASON
APPROVAL
PROVIDER REFERENCE
```

---

# 102. Refund Method

Where possible, refund to appropriate original payment method/process.

Specific implementation may vary by provider.

---

# 103. Refund Timeline

Customer-facing policy should give a realistic processing expectation, distinguishing:

```text
TEEStock PROCESSING
vs
BANK / PROVIDER SETTLEMENT
```

---

# 104. Never Promise Impossible Instant Refund

Canonical.

---

# 105. Returns Principle

Canonical:

> **Return policy should distinguish customer preference from product nonconformity.**

---

# 106. Return Types

```text
CHANGE OF MIND
SIZE / PREFERENCE
WRONG ITEM
DAMAGED ITEM
DEFECTIVE ITEM
NOT AS DESCRIBED
DELIVERY ISSUE
CUSTOM / PERSONALIZED ISSUE
```

---

# 107. Statutory Return Rights

PP 80/2019 expressly addresses return/exchange circumstances in electronic commerce, including specified cases involving delivery mismatch, hidden defects, damaged goods, and expired goods. Internal policy should therefore never attempt to erase applicable statutory remedies through a blanket clause.

---

# 108. Change-of-Mind Return

TeeStock may offer a commercial policy subject to:

```text
TIME WINDOW
PRODUCT CONDITION
HYGIENE / USE CONDITION
PACKAGING
EXCLUSIONS
```

where lawful.

---

# 109. Customer-Friendly Policy

Commercially, TeeStock should favor simple understandable rules over defensive complexity.

---

# 110. Return Window

Exact number of days should be chosen later based on:

```text
LAW
PRODUCT TYPE
MARKET EXPECTATION
OPERATIONS
```

and published consistently.

---

# 111. Do Not Hardcode Window in Canonical Architecture

Store policy value as configurable rule.

---

# 112. Return Eligibility

Potential deterministic rule:

```text
ORDER ITEM
+
DELIVERY DATE
+
RETURN REASON
+
PRODUCT TYPE
+
CONDITION
=
ELIGIBILITY
```

---

# 113. Return Authorization

Eligible return creates:

```text
RETURN CASE
```

before inventory disposition.

---

# 114. Returned Goods Inspection

Required before:

```text
RESTOCK
REWORK
SCRAP
```

decision.

---

# 115. Return Received ≠ Restock

Canonical.

---

# 116. Defective Product

Potential remedies may include as appropriate:

```text
REPAIR / REWORK
REPLACEMENT
REFUND
OTHER LAWFUL REMEDY
```

depending product/circumstance.

---

# 117. Wrong Item

TeeStock-caused error.

Customer should not bear unfair remediation cost.

---

# 118. Damaged in Delivery

Case must determine:

```text
PACKING
CARRIER
PRODUCT
CUSTOMER EVIDENCE
```

without making customer navigate internal blame allocation.

---

# 119. Customer Outcome Ownership

Canonical:

> **TeeStock resolves the customer outcome first; internal carrier/vendor recovery is TeeStock's separate operational problem where TeeStock is responsible for the customer transaction.**

---

# 120. Return Shipping Cost

Responsibility depends on reason and applicable law/policy.

PP 80/2019 contains specific rules on return-shipping costs in relevant return circumstances, including treatment when consumer error contributes.

---

# 121. Exchange

Canonical:

```text
RETURN
+
REPLACEMENT ORDER / ALLOCATION
```

not invisible inventory swap.

---

# 122. Exchange Price Difference

If customer voluntarily changes product/variant:

price difference rules should be clear.

---

# 123. Replacement

Replacement for TeeStock fault should retain linkage to original Order.

---

# 124. Warranty

TeeStock should only describe something as:

```text
WARRANTY
GUARANTEE
```

when scope is defined.

---

# 125. Warranty Terms

Potential:

```text
COVERAGE
PERIOD
EXCLUSIONS
REMEDY
CLAIM PROCESS
```

---

# 126. Warranty ≠ Return Policy

Canonical.

---

# 127. Normal Wear

Not automatically production defect.

---

# 128. Care Instructions

Relevant apparel should provide reasonable care information.

---

# 129. Misuse

Damage caused by misuse may not qualify as product defect remedy under commercial warranty.

Mandatory rights remain separately applicable.

---

# 130. Quality Claim

Customer Case should capture:

```text
ORDER ITEM
ISSUE
PHOTOS / EVIDENCE
DATE
SEVERITY
```

where useful.

---

# 131. Evidence Requirements

Should be proportionate.

---

# 132. Do Not Make Remedy Intentionally Impossible

Canonical.

---

# 133. Small-Value Claims

May be resolved with lower evidence burden.

---

# 134. High-Value / Abuse Risk

May require stronger verification.

---

# 135. Preorder Policy

Before commitment disclose:

```text
PREORDER STATUS
EXPECTED TIMELINE
PAYMENT
CANCELLATION CONDITIONS
MATERIAL UNCERTAINTY
```

where relevant.

---

# 136. Expected Date ≠ Guaranteed Date

If only estimate, say estimate.

---

# 137. Material Delay

Should trigger:

```text
CUSTOMER NOTICE
+
UPDATED EXPECTATION
+
AVAILABLE OPTIONS
```

as required by policy/law.

---

# 138. Preorder Allocation

Never sell beyond intentional capacity/allocation.

---

# 139. Preorder Cancellation

Policy should distinguish:

```text
CUSTOMER CHOICE
vs
TEEStock MATERIAL DELAY / FAILURE
```

---

# 140. MTO Policy

Customer should understand:

```text
MADE AFTER ORDER
LEAD TIME
CANCELLATION STAGE
```

---

# 141. Custom Policy

Before production customer should know:

```text
SPECIFICATION
APPROVAL
MOQ if any
PRICE
LEAD TIME
REVISION
CANCELLATION
```

---

# 142. Custom Intellectual Property

Customer-supplied assets follow TS-LEG-001.

---

# 143. Customer Rights Representation

Customer may be required to represent appropriate authority to use supplied artwork/brand assets.

---

# 144. IP Hold

If TeeStock identifies rights concern:

```text
ORDER / PRODUCTION
→ HOLD
```

pending review.

---

# 145. IP Hold Communication

Customer should be told what evidence is required where appropriate.

---

# 146. Refusal of Infringing Work

TeeStock may decline work that creates unacceptable legal/IP risk.

---

# 147. IP Refusal ≠ Arbitrary Discrimination

Use objective policy.

---

# 148. Business Orders

B2B ordering may include:

```text
QUOTE
PURCHASE ORDER
DEPOSIT
CREDIT
MILESTONE
APPROVAL
```

---

# 149. B2B Quote

Must define:

```text
SCOPE
QUANTITY
SPEC
PRICE
VALIDITY
LEAD TIME
PAYMENT
```

---

# 150. Quote Validity

Expiration should be explicit.

---

# 151. Purchase Order

Client PO may evidence customer commitment but does not replace TeeStock's own accepted commercial record.

---

# 152. Conflicting Client Terms

Customer PO terms should not silently override TeeStock agreement.

---

# 153. Contract Precedence

For significant B2B project:

document precedence.

---

# 154. Scope Change

B2B material change requires:

```text
CHANGE REQUEST
or
REVISED QUOTE
```

---

# 155. Quantity Tolerance

If manufacturing requires quantity tolerances:

must be expressly agreed where applicable.

---

# 156. Sample Approval

For large orders, production sample may become milestone.

---

# 157. Sample ≠ Final Bulk Guarantee

But bulk output should match approved standard within disclosed reasonable production tolerance.

---

# 158. Production Tolerance

Do not invent vague:

> “hasil bisa berbeda.”

Define meaningful tolerance where needed.

---

# 159. Timeline Dependencies

B2B/customer timeline may depend on:

```text
APPROVAL
DEPOSIT
ASSET DELIVERY
```

---

# 160. Customer-Caused Delay

Timeline should adjust transparently.

---

# 161. TeeStock-Caused Delay

Record separately.

---

# 162. Force Majeure / External Disruption

Material B2B agreements may define relevant procedures with legal review.

---

# 163. Shipping

Customer should know:

```text
METHOD
COST
DESTINATION
EXPECTED TIMING
```

before commitment where possible.

---

# 164. Shipping Quote

May expire/change before checkout if carrier price changes.

Once Order confirmed, snapshot applies subject to agreed exceptions.

---

# 165. Tracking

Provide tracking when available.

---

# 166. Shipment Status

Carrier status is normalized into TeeStock Shipment state.

---

# 167. Delivery Estimate

Should come from:

```text
FULFILLMENT READINESS
+
CARRIER SERVICE
```

not arbitrary static copy.

---

# 168. Split Shipment

If supported, customer should be informed.

---

# 169. Partial Delivery

Order remains partially fulfilled.

---

# 170. Lost Shipment

Creates customer-support/claim workflow.

---

# 171. Carrier Claim

Internal recovery.

Should not force customer to personally negotiate TeeStock's carrier relationship where TeeStock bears responsibility.

---

# 172. Wrong Address

Customer-provided incorrect address may create different cost/remedy treatment.

---

# 173. Address Change

Possible only before defined fulfillment cut-off.

---

# 174. Failed Delivery

Customer-support flow should distinguish:

```text
CARRIER FAILURE
WRONG ADDRESS
CUSTOMER UNAVAILABLE
REFUSED DELIVERY
```

---

# 175. Return to Sender

Creates Return/Shipment case.

Not automatic refund.

---

# 176. Customer Service

Every transaction should have accessible support path.

---

# 177. Support Channels

Potential:

```text
HELP CENTER
WHATSAPP
EMAIL
ACCOUNT
```

---

# 178. Case Number

Material customer issue receives:

```text
CASE-...
```

---

# 179. Complaint Principle

Canonical:

> **A complaint is evidence about the customer experience, not an inconvenience to be suppressed.**

---

# 180. Complaint Categories

Potential:

```text
PRODUCT
PAYMENT
DELIVERY
QUALITY
RETURN
CUSTOM
IP
ACCOUNT
```

---

# 181. Complaint Outcome

Potential:

```text
INFORMATION
CORRECTION
REPLACEMENT
REFUND
REWORK
ESCALATION
```

---

# 182. Support Authority

Frontline support should have bounded authority.

---

# 183. Low-Risk Resolution

Can eventually be automated/pre-authorized.

---

# 184. High-Value Refund

Requires appropriate approval.

---

# 185. Escalation

Potential:

```text
CUSTOMER OPS
↓
OPERATIONS / FINANCE
↓
LEGAL / MANAGEMENT
```

---

# 186. Dispute Handling

Canonical:

```text
COMPLAINT
↓
FACTS
↓
ORDER / POLICY / EVIDENCE
↓
RESOLUTION
↓
ESCALATION if unresolved
```

---

# 187. Preserve Evidence

Material dispute should preserve:

```text
ORDER
COMMUNICATION
PAYMENT
APPROVAL
FILES
SHIPMENT
QC
```

---

# 188. Customer Communication

Should be:

```text
FACTUAL
CLEAR
NON-DECEPTIVE
RESPECTFUL
```

---

# 189. No Fabricated Status

Support/AI must not say:

> “barang sudah dikirim”

unless canonical Shipment says so.

---

# 190. AI Customer Support

AI may:

```text
ANSWER POLICY
LOOK UP STATUS
DRAFT RESPONSE
CLASSIFY CASE
```

---

# 191. AI Customer Support Boundary

AI should not independently:

```text
INVENT DELIVERY DATE
APPROVE LARGE REFUND
WAIVE MAJOR CONTRACT TERM
DECIDE COMPLEX LEGAL DISPUTE
```

---

# 192. AI Must Use Canonical State

Canonical.

---

# 193. Policy Knowledge

Customer-support agent retrieves active policy version.

---

# 194. Policy Versioning

Potential lifecycle:

```text
DRAFT
APPROVED
ACTIVE
SUPERSEDED
ARCHIVED
```

---

# 195. Effective Date

Every public policy version should have effective date.

---

# 196. Existing Order

Material policy change should not silently rewrite historical transaction terms.

---

# 197. Historical Policy

Must remain retrievable.

---

# 198. Policy Migration

If TeeStock voluntarily extends a new customer-friendly policy to older orders:

record explicit rule.

---

# 199. Terms Page Architecture

Recommended public surfaces:

```text
TERMS OF SALE
RETURNS & REFUNDS
SHIPPING
CUSTOM ORDERS
PRIVACY
IP / CUSTOMER ARTWORK
```

rather than one unreadable mega-page where practical.

---

# 200. Plain Language

Canonical:

> **Customer policies should be understandable without a law degree.**

---

# 201. Legal Completeness + Plain Language

Formal terms and UX summary can coexist.

---

# 202. Summary ≠ Legal Terms

Customer-friendly summary should not contradict formal terms.

---

# 203. Policy Placement

Relevant rules should appear near decision point.

Example:

```text
PREORDER TIMING
```

on Product/Checkout,

not hidden exclusively in footer.

---

# 204. Material Custom Rule

Display before customer pays deposit.

---

# 205. Standard Clauses

Avoid unfair or unlawful blanket clauses.

---

# 206. No Blanket Liability Transfer

Canonical.

---

# 207. No Blanket “No Refund”

Canonical.

---

# 208. No Blanket “Seller Can Cancel Anytime”

Use defined reasons/process.

---

# 209. No Unilateral Silent Price Change After Order

Canonical.

---

# 210. No Unilateral Silent Specification Change

Canonical.

---

# 211. Reasonable Substitution

If substitution is ever allowed for B2B/material shortages:

must be defined and, where material, approved.

---

# 212. Product Discontinuation

Existing Orders require resolution.

---

# 213. Oversell

Canonical response:

```text
DETECT
↓
INFORM
↓
ALTERNATIVE / WAIT / REFUND
```

not indefinite silent delay.

---

# 214. Fraud Prevention

TeeStock may review suspicious transactions.

---

# 215. Fraud Hold

Possible:

```text
PAYMENT / ORDER
→ REVIEW
```

---

# 216. Fraud Hold Must Not Become Arbitrary Customer Discrimination

Use risk-based signals.

---

# 217. Verification

Request only proportionate information.

---

# 218. Chargeback

Separate financial dispute process.

---

# 219. Chargeback ≠ Automatic Customer Fraud

Canonical.

---

# 220. Order Economics

Customer policy should not expose internal:

```text
MARGIN
COGS
PARTNER RATE
```

unless commercially required.

---

# 221. Customer-Facing Reason

Can differ from internal root cause while remaining truthful.

---

# 222. Internal Root Cause

Potential:

```text
PARTNER FAILURE
INVENTORY ERROR
PACKING ERROR
SYSTEM ERROR
```

---

# 223. Root Cause Learning

Repeated customer issues should feed operations improvement.

---

# 224. Commerce Policy Data Model

Core potential entities:

```text
CommercePolicy
CommercePolicyVersion
PolicyRule
CustomerConsent
OrderTermSnapshot
CancellationRule
ReturnRule
RefundRule
WarrantyRule
```

---

# 225. Order Term Snapshot

Potential:

```text
policy_version
price
fulfillment_mode
lead_time
return_context
custom_approval
```

---

# 226. Return Rule

Machine-readable dimensions:

```text
PRODUCT TYPE
FULFILLMENT MODE
REASON
CONDITION
TIME
```

---

# 227. Cancellation Rule

Machine-readable dimensions:

```text
ORDER STATE
PRODUCTION STATE
PAYMENT STATE
FULFILLMENT MODE
REASON
```

---

# 228. Refund Rule

Determines:

```text
ELIGIBILITY
AMOUNT
APPROVAL
METHOD
```

without overriding mandatory law.

---

# 229. Policy Rule ≠ Legal Judgment

Complex exception may still require human review.

---

# 230. Customer Consent Record

Potential:

```text
customer/session
policy_version
timestamp
channel
```

---

# 231. Approval Record

Custom customer approval remains separate.

---

# 232. Commerce Events

Potential:

```text
checkout.started
order.created
order.confirmed
order.change_requested
order.cancelled
return.requested
return.approved
return.received
refund.requested
refund.completed
```

---

# 233. Custom Events

Potential:

```text
proof.sent
proof.approved
change_requested
production_released
```

---

# 234. Policy Events

Potential:

```text
commerce_policy.activated
commerce_policy.superseded
```

---

# 235. Customer Notification Events

Events trigger:

```text
ORDER CONFIRMATION
SHIPMENT
DELAY
RETURN
REFUND
```

---

# 236. MGBOS Commerce Control Center

Potential:

```text
CANCELLATIONS
RETURNS
REFUNDS
DELAYS
CUSTOM APPROVALS
DISPUTES
```

---

# 237. Exception Queue

Potential:

```text
OVERSOLD ORDER
PAYMENT MISMATCH
CUSTOMER DISPUTE
LATE PREORDER
FAILED REFUND
```

---

# 238. Policy Automation

Good candidates:

```text
RETURN ELIGIBILITY PRECHECK
CANCELLATION ROUTING
REFUND CALCULATION
CUSTOM APPROVAL TRACKING
DELAY NOTIFICATION
```

---

# 239. Deterministic First

Canonical.

Do not use AI to decide a simple return-window rule.

---

# 240. Human Review

Required when:

```text
FACTS DISPUTED
POLICY EXCEPTION
HIGH VALUE
LEGAL ISSUE
FRAUD CONCERN
```

---

# 241. Customer-Friendly Automation

Goal:

```text
LESS WAITING
LESS REPEATING INFORMATION
FASTER RESOLUTION
```

---

# 242. Not Automation for Denial

Canonical.

Automation must not primarily exist to make legitimate remedies harder.

---

# 243. V1 Commerce Policy Stack

Implement:

```text
TERMS OF SALE
SHIPPING POLICY
RETURN / REFUND POLICY
CUSTOM ORDER POLICY
CUSTOMER ARTWORK TERMS
PRIVACY HANDOFF
```

---

# 244. V1 Order Types

Rules must distinguish:

```text
READY STOCK
PREORDER
MTO
CUSTOM
B2B
```

---

# 245. V1 Order Snapshot

Store:

```text
POLICY VERSION
PRICE
FULFILLMENT MODE
CUSTOM APPROVAL if applicable
```

---

# 246. V1 Returns

Start with structured reason codes.

---

# 247. V1 Refunds

Manual approval + canonical Refund record.

---

# 248. V1 Custom

Require recorded proof approval before production where proof is applicable.

---

# 249. V1 Preorder

Require explicit expected timeline.

---

# 250. V1 B2B

Quote must contain:

```text
SCOPE
PRICE
PAYMENT
TIMELINE
CHANGE PROCESS
```

---

# 251. V1 Support

Every complaint enters Customer Case when material.

---

# 252. V1 Avoid

Do not immediately build:

```text
AI AUTONOMOUS DISPUTE JUDGE
COMPLEX LOYALTY CREDIT SYSTEM
AUTOMATED LARGE REFUNDS
GLOBAL CONSUMER-LAW ENGINE
```

---

# 253. V2 Expansion

Potential:

```text
SELF-SERVICE RETURN
SELF-SERVICE CANCELLATION
AUTOMATED LOW-RISK REFUND
RETURN LABEL
```

---

# 254. V3 Expansion

Potential:

```text
POLICY ENGINE
FRAUD SIGNALING
B2B CLIENT PORTAL
SLA AUTOMATION
```

---

# 255. V4 Expansion

Potential:

```text
MULTI-COUNTRY COMMERCE POLICY
LOCALIZED CUSTOMER RIGHTS
MULTI-JURISDICTION TAX / TERMS
```

---

# 256. Product Publication Gate

```text
PRODUCT DATA
+
PRICE
+
AVAILABILITY
+
FULFILLMENT MODE
+
RELEVANT CUSTOMER TERMS
=
SELLABLE
```

---

# 257. Checkout Gate

```text
VALID CART
+
CURRENT PRICE
+
SELLABILITY
+
SHIPPING
+
REQUIRED TERMS
=
CHECKOUT
```

---

# 258. Custom Production Gate

```text
ORDER
+
PAYMENT MILESTONE
+
APPROVED PROOF
+
VALID ARTWORK RIGHTS
=
PRODUCTION RELEASE
```

where applicable.

---

# 259. Cancellation Gate

```text
ORDER STATE
+
PRODUCTION STATE
+
FULFILLMENT MODE
+
REASON
+
POLICY / CONTRACT
=
RESOLUTION
```

---

# 260. Return Gate

```text
ORDER ITEM
+
RETURN REASON
+
DELIVERY CONTEXT
+
CONDITION
+
POLICY / LAW
=
ELIGIBILITY / REVIEW
```

---

# 261. Refund Gate

```text
VALID REMEDY
+
REFUND AMOUNT
+
APPROVAL
=
REFUND
```

---

# 262. B2B Production Gate

```text
APPROVED QUOTE
+
PAYMENT / CREDIT
+
SPECIFICATION
+
CUSTOMER APPROVAL
=
RELEASE
```

---

# 263. Customer Commerce Failure Modes

## “No Refund Ever”

Legal/customer-trust risk.

## Terms Hidden After Payment

Poor consent.

## Price Changes After Checkout

Commercial integrity failure.

## Preorder Sold Like Ready Stock

Misleading expectation.

## Custom Produced Without Proof

Avoidable dispute.

---

# 264. Returns Failure Modes

## Every Claim Requires Manager

Slow operations.

## Every Claim Auto-Approved

Abuse/control risk.

## Customer Blamed for Carrier

Poor ownership.

## Return = Refund

Accounting/operations confusion.

## Returned Item Auto-Restocked

Inventory-quality risk.

---

# 265. B2B Failure Modes

## Quote Has No Scope

Scope dispute.

## WhatsApp Change Is Not Recorded

Production dispute.

## Client PO Silently Overrides Terms

Contract ambiguity.

## Deposit Treatment Undefined

Financial conflict.

---

# 266. AI Failure Modes

## AI Invents Order Status

Customer harm.

## AI Promises Refund It Cannot Authorize

Expectation failure.

## AI Denies Mandatory Remedy

Legal risk.

## AI Guesses Policy Version

Historical inconsistency.

---

# 267. What Customer Commerce Policy Must Not Become

## Legal Trap

Policy should set clear expectations.

## “Protect TeeStock at All Costs” Document

Fair commerce creates stronger brand equity.

## Support Script Graveyard

Rules must drive systems.

## One Rule for Every Order Type

Ready-stock, preorder, MTO, custom, and B2B are different.

## AI Wall Between Customer and Human

Escalation must remain available.

---

# 268. Customer Commerce Success Definition

The framework succeeds when TeeStock can answer:

```text
WHAT
did customer agree to?

WHAT PRODUCT / SERVICE
was promised?

WHAT PRICE
was accepted?

WHEN
did the Order become confirmed?

WHAT FULFILLMENT MODE
applies?

WHAT TIMELINE
was communicated?

WHAT DID
the customer approve?

CAN THE ORDER
still change?

CAN IT
be cancelled?

IS THE ITEM
return-eligible?

WHO CAUSED
the issue?

WHAT REMEDY
is appropriate?

HOW MUCH
should be refunded?

WHICH POLICY VERSION
applies?

CAN MGBOS
enforce the rule consistently?

CAN SUPPORT / JARVIS
explain it without guessing?
```

---

# 269. Canonical Commerce Summary

```text
PRODUCT INFORMATION
defines customer expectation.

PRICE
defines commercial value.

CHECKOUT
captures intent and terms.

ORDER
records commitment.

PAYMENT
records money.

APPROVAL
records customer-controlled decisions.

PRODUCTION
creates the custom/MTO output.

FULFILLMENT
delivers the obligation.

RETURN
reverses goods flow.

REFUND
reverses money.

CUSTOMER CASE
resolves exceptions.

POLICY VERSION
defines applicable rules.

MGBOS
enforces and explains them.
```

---

# 270. Canonical Customer Commerce Principles

```text
CLEAR BEFORE PURCHASE. TRACEABLE AFTER PURCHASE. FAIR WHEN SOMETHING GOES WRONG.

CUSTOMER INFORMATION SHOULD BE TRUE, CLEAR, AND NON-MISLEADING.

READY STOCK, PREORDER, MTO, CUSTOM, AND B2B MUST NOT BE TREATED AS THE SAME ORDER TYPE.

PRICE ACCEPTED AT TRANSACTION SHOULD BE PRESERVED.

CUSTOMER APPROVAL SHOULD REFERENCE AN EXACT VERSION.

CUSTOMER APPROVAL DOES NOT EXCUSE TEEStock PRODUCTION DEFECTS.

CUSTOM PRODUCTS SHOULD NOT USE A BLANKET “NO REFUND UNDER ANY CIRCUMSTANCES” RULE.

CANCELLATION, RETURN, AND REFUND ARE DIFFERENT BUSINESS OBJECTS.

REFUND DOES NOT ERASE THE ORIGINAL TRANSACTION.

RETURNS SHOULD DISTINGUISH CHANGE OF MIND FROM NONCONFORMITY.

TEEStock OWNS THE CUSTOMER OUTCOME EVEN WHEN A PARTNER OR CARRIER FAILS.

PREORDER ESTIMATES SHOULD NOT BE PRESENTED AS GUARANTEES UNLESS THEY ARE GUARANTEED.

CUSTOM PRODUCTION SHOULD NOT BEGIN WITHOUT REQUIRED APPROVALS.

B2B SCOPE CHANGES SHOULD BE STRUCTURED AND TRACEABLE.

POLICY CHANGES SHOULD NOT SILENTLY REWRITE HISTORICAL ORDERS.

MANDATORY CUSTOMER RIGHTS OVERRIDE INCONSISTENT INTERNAL POLICY.

AUTOMATION SHOULD SPEED FAIR RESOLUTION, NOT AUTOMATE DENIAL.

AI MAY EXPLAIN POLICY AND RETRIEVE FACTS. IT MUST NOT INVENT FACTS, RIGHTS, OR AUTHORITY.

MGBOS SHOULD KNOW WHICH TERMS APPLIED TO EVERY MATERIAL CUSTOMER TRANSACTION.
```

---

# 271. Dependency

Dokumen berikut harus follow Customer Commerce Policy:

1. `13-metrics-experiments/kpi-framework.md`
2. `13-metrics-experiments/experimentation-framework.md`
3. `13-metrics-experiments/decision-thresholds.md`
4. `14-roadmap/master-roadmap.md`
5. `14-roadmap/capability-roadmap.md`
6. `14-roadmap/current-quarter.md`

TeeStock Customer Commerce Policy boleh berkembang dari documented Terms + manual customer-resolution workflows menjadi policy-driven self-service cancellation, returns, refunds, automated customer notifications, B2B contract workflows, and eventually multi-jurisdiction commerce-policy orchestration. Tetapi automation hanya boleh meningkat dengan mempertahankan clear customer expectations, applicable mandatory rights, versioned transaction terms, human escalation, reliable financial records, and traceable Order → Approval → Fulfillment → Return → Refund lineage.