---
title: "TeeStock Partner Platform"
document_id: "TS-TEC-005"
version: "1.0"
status: "CANONICAL"
category: "product-tech"
business: "teestock"
last_updated: "2026-09-28"
depends_on:
  - "TS-TEC-001"
  - "TS-TEC-003"
  - "TS-TEC-004"
  - "TS-PRG-004"
  - "TS-OPS-001"
  - "TS-OPS-002"
  - "TS-OPS-003"
  - "TS-OPS-004"
  - "TS-OPS-006"
  - "TS-OPS-008"
  - "TS-FIN-004"
  - "TS-FIN-005"
---

# TeeStock Partner Platform v1.0

> **Canonical TeeStock Partner Network, Capability, Work Order & External Operations Platform Framework**  
> Dokumen ini mendefinisikan partner identity, supplier/production/logistics/specialist relationships, capability registry, rate cards, capacity, Work Orders, specifications, files, confirmations, execution status, QC, SLA, claims, invoices, performance scorecards, routing, partner portal, automation, dan future AI-assisted partner orchestration.

---

# 1. Purpose

Partner Platform menjawab:

> **Bagaimana TeeStock mengoperasikan jaringan supplier dan external partners sebagai extension dari operating system TeeStock tanpa kehilangan quality, cost, schedule, data, accountability, dan customer ownership?**

Canonical principle:

> **Partner externally. Control the outcome internally.**

---

# 2. Canonical Definition

> **TeeStock Partner Platform adalah governed external-operations system yang menghubungkan partner identity, capabilities, commercial terms, rates, capacity, Work Orders, specifications, execution status, QC, claims, invoices, performance, and routing dengan MGBOS sehingga externalized production and fulfillment tetap dapat dikontrol sebagai bagian dari TeeStock operating model.**

---

# 3. Partner Platform Is Not Vendor Directory

Critical:

```text
VENDOR DIRECTORY
knows who exists.

PARTNER PLATFORM
knows what they can do,
under what terms,
with what performance,
and what work is currently assigned.
```

---

# 4. Partner Network Role

The platform should answer:

```text
WHO CAN DO THIS?

AT WHAT COST?

AT WHAT CAPACITY?

AT WHAT QUALITY?

BY WHEN?

WHO HAS THE WORK?

WHAT IS BLOCKED?

WHAT WAS DELIVERED?

DID IT PASS QC?

WHAT DO WE OWE?

HOW DID THE PARTNER PERFORM?
```

---

# 5. Partner Types

Canonical:

```text
SUPPLIER
PRODUCTION PARTNER
FULFILLMENT PARTNER
LOGISTICS PARTNER
SPECIALIST PARTNER
INFRASTRUCTURE PARTNER
```

---

# 6. Supplier

Provides:

```text
GARMENTS
MATERIALS
PACKAGING
ACCESSORIES
CONSUMABLES
```

---

# 7. Production Partner

Provides transformation such as:

```text
SCREEN PRINT
DTF
EMBROIDERY
CUT & SEW
FINISHING
```

---

# 8. Fulfillment Partner

Provides:

```text
STORAGE
PICK
PACK
SHIP
RETURN HANDLING
```

---

# 9. Logistics Partner

Provides physical transportation.

---

# 10. Specialist Partner

Potential:

```text
PHOTOGRAPHY
SPECIAL FINISHING
PATTERN MAKING
SPECIAL PACKAGING
```

where operationally relevant.

---

# 11. Infrastructure Partner

May include operational technology/service vendors later.

Not all SaaS vendors need Partner Platform treatment.

---

# 12. One Partner, Multiple Capabilities

Canonical:

```text
PARTNER
↓
MULTIPLE CAPABILITIES
```

A production partner may offer:

```text
DTF
SCREEN PRINT
EMBROIDERY
```

under different rates/capacity.

---

# 13. Partner Identity

Core entity represents legal/business counterpart.

---

# 14. Partner Profile

Potential:

```text
Partner ID
Legal Name
Display Name
Partner Type
Contacts
Locations
Capabilities
Payment Terms
Status
Risk
```

---

# 15. Partner Location

Important because capability may differ by site.

---

# 16. Partner Site

Future entity:

```text
PARTNER
├── SITE A
└── SITE B
```

with site-specific:

```text
CAPABILITY
CAPACITY
ADDRESS
SLA
```

---

# 17. Partner Status

Potential:

```text
PROSPECT
UNDER_REVIEW
APPROVED
ACTIVE
PAUSED
SUSPENDED
INACTIVE
OFFBOARDED
```

---

# 18. Approved ≠ Active

Approved means qualified.

Active means currently available for work.

---

# 19. Partner Onboarding

Canonical:

```text
DISCOVER
↓
QUALIFY
↓
SAMPLE / TEST
↓
COMMERCIAL REVIEW
↓
AGREEMENT
↓
APPROVE
↓
ACTIVATE
```

---

# 20. Partner Qualification

Evaluate:

```text
CAPABILITY
QUALITY
CAPACITY
COST
RELIABILITY
COMMUNICATION
LOCATION
RISK
```

---

# 21. Cheapest Partner Is Not Automatically Best

Canonical.

---

# 22. Effective Partner Economics

Should consider:

```text
QUOTED COST
+
LOGISTICS
+
FAILURE
+
REWORK
+
DELAY
+
MANUAL COORDINATION
```

where measurable.

---

# 23. Capability Registry

Canonical:

> **Capability is a standardized description of work a partner can reliably perform under defined conditions.**

---

# 24. Capability Examples

```text
DTF PRINT
SCREEN PRINT
EMBROIDERY
CUTTING
SEWING
PACKING
STORAGE
LAST-MILE DELIVERY
```

---

# 25. Capability Is Not Free Text

Prefer canonical capability types.

---

# 26. Capability Record

Potential:

```text
Capability ID
Partner
Process Type
Product Scope
Technical Limits
Quality Level
Lead Time
Rate Card
Capacity
Status
```

---

# 27. Technical Limits

Potential:

```text
MAX PRINT SIZE
COLOR COUNT
MATERIAL COMPATIBILITY
MINIMUM QTY
```

---

# 28. Capability Eligibility

Work should only route to partner if requirements fit capability constraints.

---

# 29. Capability Versioning

If process capability materially changes:

update/version.

---

# 30. Rate Card

Canonical:

> **Rate Card defines agreed commercial pricing for repeatable partner capability.**

---

# 31. Rate Card Inputs

Potential:

```text
CAPABILITY
PRODUCT / MATERIAL
QTY TIER
UNIT
SETUP
RUSH
EFFECTIVE DATE
```

---

# 32. Rate Card vs Quote

Critical:

```text
RATE CARD
standard repeatable pricing.

QUOTE
specific commercial offer for nonstandard work.
```

---

# 33. Rate Card Versioning

Required.

Do not rewrite historical rates.

---

# 34. Effective Period

Every rate should know:

```text
VALID FROM
VALID TO
```

---

# 35. Partner Quote

Used for:

```text
SPECIAL MATERIAL
LARGE PROJECT
NONSTANDARD PROCESS
UNUSUAL DEADLINE
```

---

# 36. Cost Snapshot

Work Order should preserve expected partner cost at release.

---

# 37. Actual Partner Cost

Final invoice may differ.

Difference becomes variance.

---

# 38. Capacity

Canonical:

> **Capacity is the amount of eligible work a partner can reasonably execute within a period.**

---

# 39. Capacity Dimensions

Potential:

```text
UNITS / DAY
PRINTS / DAY
JOBS / WEEK
MACHINE HOURS
```

---

# 40. Nominal vs Available Capacity

Critical:

```text
NOMINAL CAPACITY
theoretical.

AVAILABLE CAPACITY
usable for TeeStock during period.
```

---

# 41. Reserved Capacity

Potential future:

```text
AVAILABLE
-
RESERVED
=
OPEN CAPACITY
```

---

# 42. Early Capacity Model

Can begin qualitative:

```text
AVAILABLE
LIMITED
FULL
UNAVAILABLE
```

before precise scheduling.

---

# 43. Capacity Is Time-Bound

A partner is not simply “high capacity.”

Capacity changes by period.

---

# 44. Lead Time

Should be tracked by capability/work type.

---

# 45. Standard Lead Time

Expected normal execution duration.

---

# 46. Actual Lead Time

Measured from accepted Work Order to completed output.

---

# 47. Capacity Confirmation

For material/rush jobs, partner may need to confirm capacity before final commitment.

---

# 48. Work Order

Canonical:

> **Work Order is the formal instruction authorizing a partner or internal production resource to perform defined operational work.**

---

# 49. Work Order Is Core Execution Object

Chat is communication.

Work Order is operating truth.

---

# 50. Work Order Minimum Data

```text
Work Order ID
Partner
Capability
Related Order / Production Job
Product
Quantity
Specification
Files
Due Date
Expected Cost
Status
```

---

# 51. Work Order Sources

Potential:

```text
COMMERCE ORDER
SERVICE PROJECT
INVENTORY REPLENISHMENT
SAMPLE
REWORK
REPLACEMENT
```

---

# 52. Work Order Lifecycle

Canonical:

```text
DRAFT
↓
READY
↓
ISSUED
↓
ACKNOWLEDGED
↓
IN_PROGRESS
↓
READY_FOR_QC
↓
ACCEPTED
↓
COMPLETED
```

Exception states:

```text
REJECTED
BLOCKED
CANCELLED
REWORK
```

---

# 53. Ready

Internal requirements complete.

Not yet sent.

---

# 54. Issued

Formally sent to partner.

---

# 55. Acknowledged

Partner confirms receipt and ability to execute.

---

# 56. In Progress

Execution underway.

---

# 57. Ready for QC

Partner reports work complete.

---

# 58. Accepted

TeeStock/QC accepts output.

---

# 59. Completed

Operational/financial closure conditions satisfied.

---

# 60. Rejected Work Order

Partner cannot accept.

Should require reason.

---

# 61. Blocked Work Order

Execution stopped by dependency.

Potential:

```text
MATERIAL
FILE
APPROVAL
CAPACITY
MACHINE
```

---

# 62. Work Order Acknowledgement

Should confirm:

```text
SCOPE
QTY
DUE DATE
COMMERCIAL BASIS
```

---

# 63. Silent Acceptance Is Risky

Material work should receive explicit acknowledgement.

---

# 64. Work Order Versioning

If scope changes materially:

```text
NEW VERSION
or
CHANGE ORDER
```

---

# 65. Change Order

Canonical object/process for changing:

```text
QTY
SPEC
DEADLINE
COST
```

after issuance.

---

# 66. No WhatsApp-Only Scope Change

Canonical.

---

# 67. Specifications

Work Order should link to canonical production specifications.

---

# 68. Specification Examples

```text
GARMENT
COLOR
SIZE MIX
PRINT FILE
PLACEMENT
DIMENSIONS
PACKING
LABEL
```

---

# 69. Specification Snapshot

Partner must execute against defined version.

---

# 70. Latest File Is Not Enough

Need:

```text
APPROVED FILE VERSION
```

---

# 71. Work Order Files

Potential:

```text
ARTWORK
TECH PACK
MOCKUP
REFERENCE
PACKING LIST
```

---

# 72. File Metadata

Should know:

```text
VERSION
TYPE
OWNER
APPROVED STATUS
```

---

# 73. Production Proof

For relevant processes:

```text
SAMPLE
PHOTO
DIGITAL PROOF
```

may be required before bulk execution.

---

# 74. Proof Approval

Should become recorded event.

---

# 75. Partner Portal

Canonical:

> **Partner Portal is a role-scoped interface that lets external partners receive, acknowledge, execute, update, and document work assigned by TeeStock.**

---

# 76. Portal Is Not Required for V1

Early workflow can use:

```text
MGBOS
+
GENERATED WORK ORDER
+
EMAIL / WHATSAPP
```

while internal truth stays structured.

---

# 77. Portal Gate

Build when:

```text
WORK ORDER VOLUME
+
STATUS QUESTIONS
+
FILE COORDINATION
+
ERROR RATE
```

create meaningful friction.

---

# 78. Partner Portal Home

Potential:

```text
NEW WORK
IN PROGRESS
DUE SOON
BLOCKED
NEEDS ACTION
```

---

# 79. Partner Work Order View

Potential:

```text
SCOPE
SPEC
FILES
QTY
DUE DATE
STATUS
COMMENTS
```

---

# 80. Partner Actions

Potential:

```text
ACKNOWLEDGE
ACCEPT
DECLINE
START
REPORT BLOCKER
MARK READY
UPLOAD EVIDENCE
```

---

# 81. Partner Cannot Arbitrarily Change Canonical Scope

They can request change.

TeeStock approves.

---

# 82. Partner Communication

Operational conversation may be attached to Work Order.

---

# 83. Chat Is Context, Not State

Canonical.

---

# 84. SLA

Canonical:

> **SLA defines measurable expected service performance for a partner relationship or capability.**

---

# 85. SLA Dimensions

Potential:

```text
ACKNOWLEDGEMENT
LEAD TIME
ON-TIME DELIVERY
QUALITY
ISSUE RESPONSE
```

---

# 86. SLA Is Not Only Contractual Penalty

It is management expectation.

---

# 87. On-Time Delivery

Requires clear denominator:

```text
ACCEPTED COMPLETION
<=
AGREED DUE DATE
```

subject to approved change orders.

---

# 88. Delay Attribution

Do not blame partner for delay caused by TeeStock/customer.

---

# 89. Delay Reason

Potential:

```text
PARTNER CAPACITY
MATERIAL
TEEStock APPROVAL
CUSTOMER CHANGE
LOGISTICS
FORCE MAJEURE
```

---

# 90. Quality Integration

Partner output must enter TeeStock QC framework.

---

# 91. Partner Self-QC

Can be required before submission.

---

# 92. TeeStock Acceptance QC

TeeStock/customer-facing quality accountability remains internal.

---

# 93. QC Outcome

Potential:

```text
PASS
CONDITIONAL_PASS
REWORK
REJECT
```

---

# 94. Defect Attribution

If defect attributable to partner:

link:

```text
QC ISSUE
→ PARTNER
→ WORK ORDER
→ CLAIM / REWORK
```

---

# 95. Quality Evidence

Potential:

```text
PHOTO
MEASUREMENT
INSPECTION RESULT
```

---

# 96. Rework

Should create traceable work and cost.

---

# 97. Rework Responsibility

May be:

```text
PARTNER
TEEStock
CUSTOMER CHANGE
MATERIAL
UNKNOWN
```

---

# 98. Rework Cost

Should feed Cost Accounting.

---

# 99. Claim

Canonical:

> **Partner Claim is TeeStock's structured request for financial or operational recovery from a partner due to attributable failure.**

---

# 100. Claim Types

Potential:

```text
DEFECT
SHORTAGE
LATE DELIVERY
DAMAGE
INCORRECT MATERIAL
LOST GOODS
```

---

# 101. Claim Lifecycle

```text
OPEN
↓
UNDER_REVIEW
↓
ACCEPTED / DISPUTED
↓
RECOVERY
↓
CLOSED
```

---

# 102. Claim Evidence

Should link:

```text
WORK ORDER
QC
SHIPMENT
PHOTOS
COST
```

---

# 103. Claim Recovery

Potential:

```text
CREDIT NOTE
REPLACEMENT
REWORK
CASH REFUND
FUTURE OFFSET
```

---

# 104. Customer Resolution vs Partner Recovery

Critical:

```text
CUSTOMER PROBLEM
resolve first according to policy.

PARTNER RECOVERY
separate upstream process.
```

---

# 105. Do Not Make Customer Wait for Vendor Dispute

Canonical.

---

# 106. Partner Invoice

Canonical invoice should reference:

```text
PARTNER
WORK ORDER / PO
AMOUNT
CURRENCY
DUE DATE
```

---

# 107. Invoice Matching

Production/service partner:

```text
WORK ORDER
+
ACCEPTED OUTPUT
+
INVOICE
```

---

# 108. Supplier Matching

Procurement:

```text
PURCHASE ORDER
+
RECEIPT
+
INVOICE
```

---

# 109. Invoice Exception

Potential:

```text
QTY MISMATCH
RATE MISMATCH
UNAPPROVED CHARGE
MISSING ACCEPTANCE
```

---

# 110. Invoice Approval

Should route to Finance/Treasury after operating validation.

---

# 111. Partner Platform Does Not Move Money

Treasury owns payment execution.

---

# 112. Partner Payment Terms

Potential:

```text
PREPAID
DEPOSIT
COD
NET TERMS
MILESTONE
```

depending relationship.

---

# 113. Supplier Deposit

Must link to purchase/work commitment.

---

# 114. Partner Balance

Finance can track:

```text
OPEN PAYABLE
CREDIT
DEPOSIT
CLAIM OFFSET
```

---

# 115. Partner Performance

Canonical:

> **Performance measures the actual economic and operational outcomes of a partner relationship—not only quoted rate.**

---

# 116. Partner Performance Dimensions

Potential:

```text
QUALITY
ON-TIME
LEAD TIME
COST
REWORK
COMMUNICATION
CAPACITY
```

---

# 117. Quality Rate

Potential:

```text
ACCEPTED GOOD OUTPUT
/
TOTAL INSPECTED OUTPUT
```

with proper definitions.

---

# 118. On-Time Rate

Potential:

```text
ON-TIME WORK ORDERS
/
ELIGIBLE COMPLETED WORK ORDERS
```

---

# 119. Rework Rate

Useful indicator of effective partner cost.

---

# 120. Claim Rate

Can indicate systemic issues.

---

# 121. Communication Quality

Can remain qualitative initially.

Avoid fake precision.

---

# 122. Effective Cost

Canonical direction:

```text
BASE RATE
+
LOGISTICS
+
EXPECTED FAILURE
+
REWORK
+
COORDINATION BURDEN
=
EFFECTIVE PARTNER COST
```

---

# 123. Partner Scorecard

Potential:

```text
VOLUME
QUALITY
ON-TIME
COST VARIANCE
REWORK
CLAIMS
```

---

# 124. Scorecard Is Decision Support

Do not collapse everything into one opaque score early.

---

# 125. Preferred Partner

A partner may be preferred for specific capability.

Not globally “best vendor.”

---

# 126. Preferred by Capability

Canonical:

```text
DTF
→ Partner A

EMBROIDERY
→ Partner B

RUSH SCREEN PRINT
→ Partner C
```

---

# 127. Backup Partner

Important for resilient critical capabilities.

---

# 128. Single-Source Risk

TeeStock should know where:

```text
ONE PARTNER
=
ONE CRITICAL CAPABILITY
```

---

# 129. Dependency Risk

Potential:

```text
PARTNER
MATERIAL
LOCATION
MACHINE
```

concentration.

---

# 130. Partner Risk Status

Potential:

```text
LOW
WATCH
HIGH
BLOCKED
```

with clear reasons.

---

# 131. Risk Causes

Potential:

```text
QUALITY DECLINE
LATE WORK
FINANCIAL DISTRESS
CAPACITY
LEGAL
REPUTATIONAL
```

---

# 132. Partner Suspension

Blocks new work.

Open Work Orders require deliberate resolution.

---

# 133. Offboarding

Canonical:

```text
STOP NEW WORK
↓
CLOSE OPEN WORK
↓
RESOLVE CLAIMS / INVOICES
↓
REVOKE ACCESS
↓
ARCHIVE
```

---

# 134. Historical Data Remains

Canonical.

---

# 135. Routing

Canonical:

> **Partner Routing determines which qualified execution resource should receive a given work requirement.**

---

# 136. Routing Inputs

Potential:

```text
CAPABILITY FIT
QUALITY
COST
CAPACITY
LOCATION
LEAD TIME
RISK
```

---

# 137. Routing Is Multi-Factor

Never:

```text
CHEAPEST RATE
=
AUTOMATIC WINNER
```

---

# 138. Manual Routing

Recommended early stage.

System surfaces options.

Operator chooses.

---

# 139. Rule-Based Routing

Future example:

```text
IF
capability = DTF
AND qty < 100
AND location = Jakarta
AND partner active

THEN
show eligible partners
```

---

# 140. Weighted Routing

Future can rank based on defined strategy.

Avoid opaque fake precision early.

---

# 141. Capacity-Aware Routing

Future:

```text
ELIGIBLE PARTNERS
↓
AVAILABLE CAPACITY
↓
DUE DATE
↓
ROUTE
```

---

# 142. Quality-Aware Routing

High-risk/premium product may require higher-quality partner.

---

# 143. Cost-Aware Routing

Cost matters after capability and service requirements are satisfied.

---

# 144. Location-Aware Routing

Useful for:

```text
INBOUND LOGISTICS
DELIVERY
MULTI-HUB
```

---

# 145. Redundant Routing

Critical jobs can use qualified backups.

---

# 146. Split Routing

Large Work Order may be split across partners later.

---

# 147. Split Routing Risk

Potential:

```text
COLOR VARIATION
QUALITY VARIATION
COORDINATION
TRACEABILITY
```

---

# 148. Split Work Must Preserve Lot Traceability

Canonical.

---

# 149. Lot / Batch

Production output should eventually identify:

```text
WORK ORDER
PARTNER
BATCH
```

where quality traceability requires.

---

# 150. Partner Network Architecture

Long-term:

```text
TEEStock DEMAND
↓
MGBOS
↓
CAPABILITY ROUTING
↓
QUALIFIED PARTNER NETWORK
↓
QC
↓
FULFILLMENT
```

---

# 151. Controlled Network

Preferred before open vendor marketplace.

---

# 152. Open Marketplace Is Not Near-Term Goal

Quality and accountability matter more.

---

# 153. Internal Production as Execution Resource

Important long-term principle:

```text
TEEStock / MULTIGRAPH INTERNAL CAPABILITY
```

can be modeled alongside external partner capacity where useful.

---

# 154. Internal vs External Route

MGBOS may compare:

```text
MULTIGRAPH
TEEStock INTERNAL
EXTERNAL PARTNER
```

using equivalent capability/routing logic.

---

# 155. Related-Party Transparency

MultiGraph should not receive work invisibly.

Use Work Order / transfer economics.

---

# 156. Network Neutrality Is Not Required

Routing may intentionally prefer strategic internal capability where economics/control justify.

But decision should remain visible.

---

# 157. Partner Communication

Potential channels:

```text
PORTAL
EMAIL
WHATSAPP
```

---

# 158. Communication Normalization

Important decisions should be recorded into canonical state.

---

# 159. WhatsApp Integration

Can notify partner.

Should not become sole source for:

```text
ACCEPTANCE
STATUS
SCOPE
```

long term.

---

# 160. Partner Notifications

Potential:

```text
NEW WORK ORDER
DUE SOON
CHANGE ORDER
QC RESULT
CLAIM
PAYMENT STATUS
```

---

# 161. Notification Preferences

Can evolve later.

---

# 162. Partner Files

Need controlled access.

Partner sees only work-relevant files.

---

# 163. Partner Permissions

Potential:

```text
VIEW OWN WORK ORDERS
UPDATE ALLOWED STATUS
UPLOAD EVIDENCE
VIEW AGREED COMMERCIAL DATA
VIEW OWN INVOICES
```

---

# 164. Partner Should Not Access

```text
OTHER PARTNERS
CUSTOMER FINANCIAL DATA
TEEStock MARGIN
UNRELATED ORDERS
```

---

# 165. Partner Team

Future partner organization may have:

```text
OWNER
PRODUCTION
FINANCE
OPERATOR
```

roles.

---

# 166. Team Access Gate

Only after portal volume justifies.

---

# 167. Customer Data Exposure

Partner should receive minimum operational data necessary.

---

# 168. Need-to-Know Principle

Canonical:

> **Partner access follows execution need, not convenience.**

---

# 169. White-Label Fulfillment

Partner may execute without customer-facing identity.

---

# 170. TeeStock Owns Customer Experience

Even where fulfillment is external.

---

# 171. Direct-to-Customer Partner Shipping

If enabled:

requires:

```text
PACKAGING
LABEL
DATA
SLA
TRACKING
RETURNS
```

controls.

---

# 172. Blind Shipping

Potential for Merch/Fulfill contexts.

Must be explicitly governed.

---

# 173. Drop-Ship Partner

May eventually receive orders directly from orchestration layer.

Not V1 priority.

---

# 174. Partner Inventory

Potential future if partner holds TeeStock stock.

Need:

```text
LOCATION
OWNER
QTY
STATUS
```

integrated into Inventory System.

---

# 175. Consigned Inventory

Ownership must remain explicit.

---

# 176. Partner-Owned Materials

Can still be represented as production input without TeeStock inventory ownership until consumed/purchased.

---

# 177. Supplier Catalog

Potential future object linking partner offerings to TeeStock materials/products.

---

# 178. Supplier Item Mapping

Canonical:

```text
TEEStock MATERIAL / GARMENT
↔
SUPPLIER ITEM
```

---

# 179. Supplier SKU ≠ TeeStock SKU

Preserve mapping.

Do not adopt vendor codes as canonical identity.

---

# 180. Procurement Integration

Partner Platform should connect to:

```text
PURCHASE REQUEST
PURCHASE ORDER
RECEIPT
INVOICE
```

where partner is supplier.

---

# 181. Work Order vs Purchase Order

Critical:

```text
PURCHASE ORDER
commercial procurement commitment.

WORK ORDER
execution instruction.
```

Some flows may involve both.

---

# 182. Example

External printer:

```text
PO
authorizes spend.

WORK ORDER
defines exact job.
```

---

# 183. Partner Platform Data Model

Core entities:

```text
PARTNER
PARTNER SITE
CAPABILITY
RATE CARD
CAPACITY
PARTNER AGREEMENT
WORK ORDER
WORK ORDER VERSION
CHANGE ORDER
PARTNER QUOTE
SLA
QC RESULT
CLAIM
PARTNER INVOICE
PERFORMANCE SNAPSHOT
```

---

# 184. Additional Future Entities

Potential:

```text
PARTNER TEAM
ROUTING RULE
CAPACITY RESERVATION
PARTNER INVENTORY
SUPPLIER ITEM
```

---

# 185. Partner Data Lineage

Canonical:

```text
PARTNER
↓
CAPABILITY
↓
COMMERCIAL TERMS
↓
WORK ORDER
↓
EXECUTION
↓
QC
↓
ACCEPTANCE
↓
INVOICE
↓
PAYMENT
↓
PERFORMANCE
```

---

# 186. Work Data Lineage

```text
CUSTOMER / INVENTORY NEED
↓
PRODUCTION JOB
↓
WORK ORDER
↓
PARTNER
↓
OUTPUT
↓
QC
```

---

# 187. Partner Events

Potential:

```text
partner.approved
partner.activated
capability.updated
work_order.issued
work_order.acknowledged
work_order.started
work_order.ready_for_qc
qc.failed
claim.opened
partner_invoice.approved
```

---

# 188. Partner Dashboard — Internal

Potential:

```text
ACTIVE PARTNERS
OPEN WORK ORDERS
DUE TODAY
LATE
QC FAILURES
CLAIMS
CAPACITY RISK
```

---

# 189. Partner Detail View

Potential:

```text
PROFILE
CAPABILITIES
RATES
OPEN WORK
QUALITY
ON-TIME
CLAIMS
INVOICES
```

---

# 190. Capability Dashboard

Potential:

```text
CAPABILITY
QUALIFIED PARTNERS
AVAILABLE CAPACITY
AVERAGE COST
QUALITY
```

---

# 191. Work Order Queue

Potential:

```text
READY TO ISSUE
AWAITING ACK
IN PROGRESS
DUE SOON
BLOCKED
QC
```

---

# 192. Partner Scorecard Dashboard

Potential:

```text
VOLUME
QUALITY
ON-TIME
COST VARIANCE
REWORK
CLAIMS
```

---

# 193. Automation Opportunities

Strong candidates:

```text
WORK ORDER GENERATION
PARTNER NOTIFICATION
ACKNOWLEDGEMENT REMINDER
DUE-DATE ALERT
QC ROUTING
INVOICE MATCHING
PERFORMANCE UPDATE
```

---

# 194. Work Order Generation

Can derive from:

```text
PRODUCTION JOB
+
ROUTING DECISION
```

---

# 195. Partner Notification

Safe automation after Work Order is approved.

---

# 196. Reminder Automation

Can alert:

```text
UNACKNOWLEDGED
DUE SOON
OVERDUE
```

---

# 197. QC Routing

Completed output can automatically enter QC queue.

---

# 198. Performance Update

Accepted/completed Work Orders feed performance metrics.

---

# 199. Invoice Matching Automation

Can match:

```text
INVOICE
↔
WORK ORDER / PO
↔
ACCEPTANCE
```

and flag exceptions.

---

# 200. Capacity Update Automation

Future partners may self-report capacity.

System can still validate against observed performance.

---

# 201. Routing Automation

Progressive maturity:

```text
MANUAL SELECTION
↓
SYSTEM RECOMMENDATION
↓
RULE-BASED AUTO-ROUTING
↓
AI-ASSISTED ROUTING
```

---

# 202. Auto-Routing Gate

Only when:

```text
CAPABILITY DATA RELIABLE
+
RATES RELIABLE
+
CAPACITY RELIABLE
+
QUALITY HISTORY
+
EXCEPTION HANDLING
```

exist.

---

# 203. AI Role

AI may assist with:

```text
PARTNER MATCHING
QUOTE COMPARISON
WORK ORDER SUMMARY
DELAY RISK
PERFORMANCE ANALYSIS
INVOICE ANOMALY
```

---

# 204. AI Partner Matching

Can recommend:

> Partner B is more suitable for this job due to capacity, location, and historical quality despite a higher unit rate.

---

# 205. AI Delay Risk

May analyze:

```text
CURRENT LOAD
PAST LEAD TIME
WORK COMPLEXITY
```

to flag likely delay.

---

# 206. AI Performance Summary

Can synthesize:

```text
QUALITY
LATE JOBS
CLAIMS
COST VARIANCE
```

for review.

---

# 207. AI Quote Comparison

Can normalize differing vendor quote formats into structured comparison.

---

# 208. AI Invoice Extraction

Can extract:

```text
INVOICE NUMBER
WORK ORDER
AMOUNT
ITEMS
```

with deterministic validation afterward.

---

# 209. AI Rights Boundary

AI does not authorize spend or partner payment.

---

# 210. AI Routing Boundary

AI should not route material/high-risk work outside approved partner/capability rules.

---

# 211. AI Partner Governance Principle

Canonical:

> **AI may recommend the route. Policy determines eligibility. Operations own the outcome.**

---

# 212. Partner Platform Technical Architecture

Recommended:

```text
PARTNER MODULE
within MGBOS
+
OPTIONAL EXTERNAL PORTAL
+
SHARED PRODUCTION / PROCUREMENT / FINANCE DATA
```

---

# 213. Avoid Separate Vendor System

Partner truth should integrate with operations.

---

# 214. Partner Read Model

Portal may use simplified data presentation.

Canonical records remain internal.

---

# 215. API Needs

Potential:

```text
PARTNER
CAPABILITY
WORK ORDER
STATUS
FILES
QC
INVOICE
```

---

# 216. Partner API

Only later if major partners need direct system integration.

---

# 217. API Integration Gate

Requires enough transaction volume to justify maintaining integration.

---

# 218. EDI / Machine Integration

Not early priority.

---

# 219. Partner Portal Security

Use:

```text
AUTHENTICATION
ROLE SCOPING
FILE ACCESS CONTROL
AUDIT
```

---

# 220. Partner Account Isolation

One partner must never access another partner's work.

---

# 221. Sensitive Cost Data

Only expose agreed rate/Work Order commercial terms.

Do not expose full customer margin.

---

# 222. Audit Trail

Material events:

```text
RATE CHANGE
WORK ORDER CHANGE
STATUS
QC
CLAIM
INVOICE
PAYMENT STATUS
```

must be traceable.

---

# 223. Operational Recovery

If Partner Portal fails:

TeeStock must still be able to execute through fallback Work Order channels.

---

# 224. No Portal Dependency Without Fallback

Canonical.

---

# 225. Partner Platform Maturity Model

```text
LEVEL 0
Vendor coordination through chat

LEVEL 1
Partner registry + structured Work Orders

LEVEL 2
Capabilities + rates + QC + scorecards

LEVEL 3
Partner portal + capacity + invoice matching

LEVEL 4
Rule-based routing + integrated partner network

LEVEL 5
AI-assisted capacity and partner orchestration
```

---

# 226. Level 0

Anti-goal:

```text
"Biasanya print di vendor A,
kalau penuh chat vendor B."
```

---

# 227. Level 1

Build:

```text
PARTNER
CAPABILITY
WORK ORDER
STATUS
DUE DATE
```

---

# 228. Level 2

Adds:

```text
RATE CARD
QC
CLAIM
PERFORMANCE
```

---

# 229. Level 3

Adds:

```text
PORTAL
CAPACITY
INVOICE MATCHING
FILES
```

---

# 230. Level 4

Adds:

```text
ELIGIBILITY RULES
ROUTING
CAPACITY-AWARE ASSIGNMENT
MULTI-PARTNER NETWORK
```

---

# 231. Level 5

Adds:

```text
PREDICTIVE CAPACITY
AI ROUTING SUPPORT
ANOMALY DETECTION
NETWORK OPTIMIZATION
```

---

# 232. Current Recommended Stage

TeeStock should target:

```text
LEVEL 1
→
LEVEL 2
```

first.

---

# 233. V1 Partner Platform Scope

Priority:

```text
PARTNER PROFILE
PARTNER TYPE
CAPABILITY
CONTACT
RATE / QUOTE
WORK ORDER
STATUS
DUE DATE
QC RESULT
```

---

# 234. V1 Work Order

Should be generated from structured MGBOS data.

Can still be shared as:

```text
PDF
LINK
EMAIL
WHATSAPP
```

while MGBOS remains source of truth.

---

# 235. V1 Partner Capacity

Simple:

```text
AVAILABLE
LIMITED
FULL
UNAVAILABLE
```

plus notes/expected dates.

---

# 236. V1 Rate

Store agreed:

```text
STANDARD RATE
EFFECTIVE DATE
```

for repeatable processes.

---

# 237. V1 QC

Link partner/work order to:

```text
PASS
FAIL
REWORK
DEFECT REASON
```

---

# 238. V1 Performance

Track at minimum:

```text
ON-TIME
QC PASS
REWORK
```

---

# 239. V1 Claims

Can be manually managed but structured.

---

# 240. V1 Portal

Not necessary yet.

Internal MGBOS is higher priority.

---

# 241. V1 Avoid

Do not immediately build:

```text
OPEN VENDOR MARKETPLACE
REAL-TIME PARTNER CAPACITY API
AUTONOMOUS ROUTING
COMPLEX PARTNER APP
GLOBAL PROCUREMENT NETWORK
OPAQUE PARTNER SCORES
```

---

# 242. V2 Expansion

Possible:

```text
RATE CARDS
PARTNER SCORECARDS
CLAIMS
CAPACITY CALENDAR
INVOICE MATCHING
```

---

# 243. V3 Expansion

Possible:

```text
PARTNER PORTAL
CHANGE ORDERS
PARTNER TEAM ROLES
CAPACITY RESERVATION
```

---

# 244. V4 Expansion

Possible:

```text
RULE-BASED ROUTING
MULTI-HUB ROUTING
PARTNER INVENTORY
DIRECT-TO-CUSTOMER EXECUTION
```

---

# 245. V5 Expansion

Possible:

```text
PREDICTIVE ROUTING
AI CAPACITY PLANNING
NETWORK OPTIMIZATION
AUTOMATED LOW-RISK WORK ALLOCATION
```

---

# 246. Partner Approval Gate

Approve when:

```text
CAPABILITY VERIFIED
+
QUALITY ACCEPTABLE
+
COMMERCIAL TERMS
+
RISK ACCEPTABLE
```

---

# 247. Capability Activation Gate

```text
TECHNICAL FIT
+
RATE / COMMERCIAL BASIS
+
QUALITY VALIDATED
```

---

# 248. Work Order Release Gate

```text
SCOPE COMPLETE
+
APPROVED FILES
+
PARTNER ELIGIBLE
+
COMMERCIAL BASIS
+
DUE DATE
```

---

# 249. Partner Acceptance Gate

Partner confirms:

```text
CAN EXECUTE
+
DUE DATE
+
SCOPE
```

---

# 250. Completion Gate

Work cannot close until:

```text
OUTPUT DELIVERED
+
QC / ACCEPTANCE
+
QTY RECONCILED
```

where applicable.

---

# 251. Invoice Approval Gate

```text
VALID INVOICE
+
VALID WORK / PO
+
OUTPUT ACCEPTED
+
AMOUNT MATCHED
```

or explicit approved exception.

---

# 252. Claim Gate

Open when:

```text
ATTRIBUTABLE FAILURE
+
EVIDENCE
+
MATERIAL IMPACT
```

exists.

---

# 253. Auto-Routing Gate

Do not automate until:

```text
ELIGIBILITY
CAPACITY
COST
QUALITY
SLA
```

data are reliable enough.

---

# 254. Partner Portal Gate

Build only when:

```text
REPEATED WORK
+
PARTNER ADOPTION
+
MANUAL COORDINATION COST
```

justify it.

---

# 255. Partner Platform Failure Modes

## Vendor = Phone Number

No operational memory.

## Capability in Founder's Head

Cannot scale.

## Rate in Chat

Cost ambiguity.

## Work Order via Voice Note

Scope ambiguity.

## Latest Artwork in WhatsApp

Version risk.

## Partner Says “Done” = Accepted

No QC control.

## Cheapest Quote Always Wins

Hidden failure cost.

## Customer Waits for Vendor Claim

Wrong responsibility model.

---

# 256. What Partner Platform Must Not Become

## Vendor Marketplace Too Early

Curation/control first.

## Procurement Bureaucracy

Structure should reduce risk, not paralyze operations.

## Partner Surveillance System

Measure business outcomes.

## Opaque Automated Routing

Eligibility and logic must remain explainable.

## Portal for Portal's Sake

Manual structured flow first.

## Responsibility Outsourcing

TeeStock still owns customer outcome.

---

# 257. Partner Platform Success Definition

The system succeeds when TeeStock can answer:

```text
WHO
can perform this work?

WHAT
are they qualified to do?

WHAT RATE
applies?

WHAT CAPACITY
is available?

WHAT WORK
is assigned?

WHAT SPECIFICATION
must they execute?

HAS THE PARTNER
accepted?

WILL IT
be late?

DID IT
pass QC?

WHAT FAILED
and who caused it?

WHAT
do we owe?

HOW HAS
the partner performed historically?

WHO SHOULD
receive the next job?
```

---

# 258. Canonical Partner Platform Summary

```text
PARTNER
defines counterpart.

CAPABILITY
defines what they can do.

RATE CARD
defines standard economics.

CAPACITY
defines when they can do it.

WORK ORDER
defines what must be done.

SPECIFICATION
defines how.

QC
defines acceptance.

CLAIM
recovers attributable failure.

INVOICE
creates payable obligation.

PERFORMANCE
creates partner intelligence.

ROUTING
chooses execution resource.

MGBOS
orchestrates the network.
```

---

# 259. Canonical Partner Platform Principles

```text
PARTNER EXTERNALLY. CONTROL THE OUTCOME INTERNALLY.

A PARTNER IS MORE THAN A CONTACT.

CAPABILITY BEFORE ROUTING.

RATE CARDS BEFORE COST MEMORY.

CAPACITY IS TIME-BOUND.

WORK ORDER BEFORE EXECUTION.

APPROVED VERSION BEFORE PRODUCTION.

CHAT IS COMMUNICATION, NOT OPERATING TRUTH.

QC BEFORE ACCEPTANCE.

CUSTOMER RESOLUTION BEFORE PARTNER RECOVERY.

CHEAPEST RATE IS NOT LOWEST EFFECTIVE COST.

RELATED-PARTY WORK NEEDS THE SAME TRACEABILITY.

ROUTING SHOULD BE EXPLAINABLE.

BUILD THE NETWORK BEFORE AUTOMATING THE NETWORK.

AI MAY RECOMMEND. POLICY DETERMINES ELIGIBILITY.
```

---

# 260. Dependency

Dokumen berikut harus follow Partner Platform:

1. `10-product-tech/automation-architecture.md`
2. `11-data-mgbos/canonical-data-model.md`
3. `11-data-mgbos/entity-hierarchy.md`
4. `11-data-mgbos/sku-and-id-convention.md`
5. `11-data-mgbos/event-model.md`
6. `11-data-mgbos/mgbos-integration.md`
7. `11-data-mgbos/analytics-model.md`
8. `12-legal-ip/creator-agreement-framework.md`
9. `13-metrics-experiments/kpi-framework.md`
10. `13-metrics-experiments/decision-thresholds.md`
11. `14-roadmap/capability-roadmap.md`

TeeStock Partner Platform boleh berkembang dari structured vendor management menjadi capacity-aware, portal-enabled, multi-partner execution network dengan rule-based dan AI-assisted routing, tetapi orchestration hanya boleh meningkat setelah partner identity, capabilities, rates, Work Orders, QC, cost, capacity, and performance data sudah menjadi reliable operating truth.