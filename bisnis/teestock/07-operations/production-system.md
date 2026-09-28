---
title: "TeeStock Production System"
document_id: "TS-OPS-003"
version: "1.0"
status: "CANONICAL"
category: "operations"
business: "teestock"
last_updated: "2026-09-28"
depends_on:
  - "TS-FND-001"
  - "TS-FND-002"
  - "TS-STR-003"
  - "TS-COM-005"
  - "TS-SVC-002"
  - "TS-SVC-003"
  - "TS-SVC-004"
  - "TS-SVC-007"
  - "TS-PRG-004"
  - "TS-OPS-001"
  - "TS-OPS-002"
---

# TeeStock Production System v1.0

> **Canonical TeeStock Production Execution Framework**  
> Dokumen ini mendefinisikan bagaimana TeeStock mengubah production demand menjadi controlled Production Jobs dan Work Orders melalui production recipes, material planning, routing, scheduling, capacity, WIP, batch traceability, output control, scrap, rework, costing, quality handoff, dan production closure.

---

# 1. Purpose

Production System menjawab:

> **Bagaimana TeeStock memastikan setiap produk yang membutuhkan produksi dibuat dengan spesifikasi yang benar, oleh capability yang tepat, menggunakan material yang benar, dalam quantity yang benar, pada waktu yang benar, dengan cost dan quality yang dapat ditelusuri?**

Canonical principle:

> **No production without specification. No completion without reconciliation.**

---

# 2. Canonical Definition

> **TeeStock Production System adalah operating framework yang mengubah confirmed production requirements menjadi scheduled, traceable, costed, quality-controlled manufacturing work melalui standardized Production Jobs, Work Orders, recipes, material movements, capacity allocation, dan output reconciliation.**

---

# 3. Production Scope

Production dapat mencakup:

```text
PRINTING
EMBROIDERY
SEWING
CUTTING
FINISHING
LABEL APPLICATION
PACKAGING ASSEMBLY
KITTING
PERSONALIZATION
OTHER APPROVED TRANSFORMATION
```

---

# 4. Production Is Transformation

Canonical:

```text
INPUT
↓
PROCESS
↓
OUTPUT
```

Production terjadi ketika material/product berubah menjadi output baru atau customer-ready configuration.

---

# 5. Fulfillment Is Not Production

Critical distinction:

```text
PRODUCTION
changes the product.

FULFILLMENT
moves the completed product to the customer.
```

Packing biasa dapat menjadi fulfillment.

Special assembly/kitting dapat menjadi production step jika mengubah defined product configuration.

---

# 6. Production Demand Sources

Production requirement dapat datang dari:

```text
SELECTS
ORIGINALS
CUSTOM
BUSINESS
MERCH
STUDIO PRODUCT DEVELOPMENT
REPLENISHMENT
INTERNAL SAMPLE
```

---

# 7. Production Architecture

Canonical:

```text
DEMAND
↓
PRODUCTION REQUIREMENT
↓
PRODUCTION JOB
↓
ROUTING
↓
WORK ORDER(S)
↓
MATERIAL ISSUE
↓
EXECUTION
↓
OUTPUT
↓
QC
↓
RECONCILIATION
↓
CLOSE
```

---

# 8. Production Requirement

Production Requirement menyatakan:

> **What needs to be physically produced?**

Minimum:

```text
PRODUCT / CONFIGURATION
QUANTITY
DUE DATE
SPECIFICATION
SOURCE DEMAND
```

---

# 9. Production Job

Canonical:

> **Production Job adalah parent operational object yang mewakili keseluruhan production requirement untuk suatu output tertentu.**

Satu Production Job dapat menghasilkan satu atau beberapa Work Orders.

---

# 10. Production Job vs Work Order

```text
PRODUCTION JOB
defines what must be achieved.

WORK ORDER
defines who performs a specific production step.
```

---

# 11. Example

```text
PRODUCTION JOB
100 custom company tees

├── WORK ORDER 1
│   Base garment preparation
│
├── WORK ORDER 2
│   DTF printing
│
└── WORK ORDER 3
    Label application
```

---

# 12. Production Job Sources

A Production Job may originate from:

```text
ORDER
ORDER ITEM
COLLECTION
STOCK REPLENISHMENT
SAMPLE REQUEST
PROJECT
```

---

# 13. Production Job Minimum Fields

```text
Production Job ID
Source Object
Product / Configuration
Required Quantity
Required Date
Recipe / Specification
Priority
Status
Owner
```

---

# 14. Production Job Lifecycle

Canonical:

```text
DRAFT
↓
PLANNING
↓
READY
↓
RELEASED
↓
IN_PRODUCTION
↓
QC
↓
COMPLETED
```

Possible alternate states:

```text
ON_HOLD
PARTIALLY_COMPLETED
CANCELLED
FAILED
```

---

# 15. Draft

Production requirement exists but is not yet ready for planning.

---

# 16. Planning

System/operator determines:

```text
MATERIAL
PROCESS
ROUTING
CAPACITY
TIMING
COST
```

---

# 17. Ready

Definition of Ready is satisfied.

---

# 18. Released

Production has been formally authorized to begin.

---

# 19. In Production

At least one active Work Order is being executed.

---

# 20. QC

Production execution finished, but output has not yet received final acceptance.

---

# 21. Completed

Required output has been reconciled and accepted.

---

# 22. On Hold

Production is intentionally blocked.

Possible reasons:

```text
MISSING MATERIAL
CUSTOMER APPROVAL
IP ISSUE
PAYMENT
CAPACITY
QUALITY INVESTIGATION
```

---

# 23. Production Definition of Ready

Canonical minimum:

```text
COMMERCIAL COMMITMENT VALID
SPECIFICATION COMPLETE
ARTWORK APPROVED
QUANTITY CONFIRMED
MATERIAL SOURCE KNOWN
PRODUCTION METHOD DEFINED
ROUTING POSSIBLE
DUE DATE FEASIBLE
```

---

# 24. No Production from Chat Screenshot

Production instruction should not rely solely on:

```text
WHATSAPP
SCREENSHOT
VERBAL MEMORY
```

Canonical production record must exist.

---

# 25. Product Specification

Production Specification defines product truth relevant to execution.

May include:

```text
GARMENT PLATFORM
VARIANT
SIZE
COLOR
MATERIAL
PLACEMENT
DIMENSION
PRINT METHOD
LABEL
FINISHING
PACKAGING REQUIREMENT
```

---

# 26. Production Recipe

Canonical:

> **Production Recipe adalah standardized definition of how a repeatable product/configuration is produced.**

---

# 27. Recipe Purpose

Recipe reduces dependence on:

> “operator yang sudah biasa pasti tahu.”

---

# 28. Recipe May Include

```text
INPUT MATERIALS
PROCESS STEPS
MACHINE / METHOD
SETTINGS
ARTWORK VERSION
PLACEMENT
QC CHECKS
EXPECTED YIELD
```

---

# 29. Recipe vs BOM

Critical distinction:

```text
BOM
what is consumed.

RECIPE / ROUTING
how it is produced.
```

---

# 30. Bill of Materials

BOM may define:

```text
BASE GARMENT
TRANSFER / INK
LABEL
PACKAGING
TRIM
OTHER MATERIAL
```

with expected quantities.

---

# 31. BOM Version

Material changes should create version history.

---

# 32. Recipe Version

Process changes should also be versioned.

---

# 33. Production Version Lock

Once a Job is released:

```text
RECIPE VERSION
ARTWORK VERSION
BOM VERSION
```

should be locked/referenceable.

---

# 34. Production Change

Material/process change after release requires explicit controlled change.

---

# 35. Artwork Version

Only approved production artwork may be used.

Canonical:

```text
ARTWORK MASTER
↓
PRODUCTION VERSION
↓
APPROVED
↓
WORK ORDER
```

---

# 36. Placement Specification

For printed/embroidered items, placement can include:

```text
POSITION
SIZE
OFFSET
ORIENTATION
```

---

# 37. Golden Sample

For repeat/high-value product:

```text
GOLDEN SAMPLE
```

may become physical reference.

---

# 38. Production Method

Examples:

```text
DTF
SCREEN PRINT
DTG
EMBROIDERY
HEAT TRANSFER
SEWING
SUBLIMATION
```

Use canonical capability taxonomy.

---

# 39. Capability Requirement

A production step should reference required:

```text
CAPABILITY
```

rather than hardcoded vendor.

---

# 40. Routing

Canonical:

```text
REQUIRED CAPABILITY
↓
ELIGIBLE EXECUTORS
↓
ROUTING DECISION
```

---

# 41. Execution Routes

Possible:

```text
TEEStock INTERNAL
MULTIGRAPH
EXTERNAL PARTNER
HYBRID
```

---

# 42. MultiGraph as Production Route

MultiGraph can function as:

```text
RELATED INTERNAL / AFFILIATED CAPABILITY
```

but must still be operationally measurable.

---

# 43. Related Capability Rule

Canonical:

> **Shared ownership does not remove the need for cost, SLA, capacity, and quality visibility.**

---

# 44. Routing Criteria

Canonical:

```text
CAPABILITY FIT
QUALITY
CAPACITY
LEAD TIME
COST
LOCATION
PAST PERFORMANCE
```

---

# 45. Routing Hard Constraints

Executor must be:

```text
APPROVED
ACTIVE
CAPABLE
AVAILABLE
```

before commercial optimization.

---

# 46. Routing Soft Factors

Among eligible routes:

```text
COST
SPEED
LOAD BALANCING
PROXIMITY
PREFERRED STATUS
```

may influence selection.

---

# 47. Lowest Cost Is Not Always Best Route

Late delivery or poor quality can cost more than nominal savings.

---

# 48. Manual Routing V1

Early:

```text
SYSTEM PROVIDES DATA
HUMAN SELECTS ROUTE
```

---

# 49. Routing Recommendation Future

MGBOS may later recommend:

```text
ROUTE A
because:
quality stable
capacity available
cost within target
due date feasible
```

---

# 50. Work Order

Work Order is executable production instruction.

Minimum:

```text
Work Order ID
Production Job
Executor
Capability
Quantity
Specification
Files
Input Materials
Due Date
Rate / Cost Rule
QC Requirement
```

---

# 51. Work Order Status

Canonical:

```text
DRAFT
SENT
ACCEPTED
QUEUED
IN_PROGRESS
PAUSED
READY_FOR_QC
COMPLETED
CANCELLED
```

---

# 52. External Work Order Acceptance

External partner must explicitly accept:

```text
SCOPE
QTY
RATE
DUE DATE
```

---

# 53. Internal Work Order Acceptance

May be implicit through scheduling, but ownership must remain clear.

---

# 54. Work Order Dependency

One Work Order can depend on another.

Example:

```text
PRINT
↓
LABEL
↓
PACK
```

---

# 55. Production Routing Graph

Future architecture should support:

```text
STEP A
↓
STEP B
↓
STEP C
```

not only one flat process.

---

# 56. Parallel Production

Some Work Orders may execute simultaneously if dependencies allow.

---

# 57. Material Requirement

Each Job should calculate or record needed inputs.

---

# 58. Material Availability

Before release:

```text
REQUIRED
-
AVAILABLE
-
ALLOCATED INBOUND
=
SHORTAGE
```

---

# 59. Material Reservation

Required on-hand material should move:

```text
AVAILABLE
→
RESERVED_FOR_PRODUCTION
```

---

# 60. Production Material Issue

When physical materials are released:

```text
RESERVED
→
ISSUED_TO_PRODUCTION
```

---

# 61. Material Issue Record

Minimum:

```text
Work Order
SKU / Material
Expected Qty
Issued Qty
Location
Timestamp
```

---

# 62. Partner Material Handoff

If materials leave TeeStock custody:

track:

```text
PARTNER
QTY
DATE
HANDOFF
EXPECTED RETURN / OUTPUT
```

---

# 63. Customer-Owned Material

If allowed:

must remain separately owned and traceable.

---

# 64. No Material Mixing

Customer-owned, TeeStock-owned, and partner-owned inventory should not silently mix.

---

# 65. Material Consumption

At job close, compare:

```text
EXPECTED CONSUMPTION
vs
ACTUAL CONSUMPTION
```

---

# 66. Variance

Material variance may indicate:

```text
SCRAP
REWORK
PROCESS LOSS
COUNT ERROR
UNRECORDED USAGE
```

---

# 67. Scrap

Canonical:

> **Scrap adalah material/output yang tidak lagi economically recoverable for intended use.**

---

# 68. Scrap Record

Should capture:

```text
Work Order
Material / Product
Qty
Reason
Cost
Disposition
```

---

# 69. Normal Process Loss

Some methods naturally have expected process loss.

Expected loss should be distinguished from abnormal scrap.

---

# 70. Abnormal Scrap

Unexpected loss should trigger investigation when material.

---

# 71. Rework

Canonical:

> **Rework adalah additional production activity required to bring nonconforming output into acceptable specification.**

---

# 72. Rework Record

Should link to original:

```text
WORK ORDER
QC FAILURE
OUTPUT
```

---

# 73. Rework Cost

Track separately from normal cost where meaningful.

---

# 74. Reproduction

If failed product cannot be repaired:

new units may need reproduction.

---

# 75. Production Quantity Model

Track at least:

```text
PLANNED QTY
STARTED QTY
GOOD QTY
DEFECT QTY
SCRAP QTY
```

---

# 76. Yield

Conceptually:

```text
GOOD OUTPUT
/
INPUT QUANTITY
```

where meaningful.

---

# 77. First-Pass Yield

Measures:

> how much output passes without rework.

Useful quality/process metric.

---

# 78. Overproduction

Producing extra units may be:

```text
PLANNED BUFFER
or
UNAUTHORIZED OVERRUN
```

These are not the same.

---

# 79. Planned Buffer

May compensate for expected yield risk.

Should be defined before production.

---

# 80. Unauthorized Overrun

Especially sensitive for:

```text
CUSTOMER IP
CREATOR IP
ORIGINALS
```

Unapproved excess production must not silently enter inventory.

---

# 81. Underproduction

If good output < required qty:

system must determine:

```text
REPRODUCE
PARTIAL FULFILLMENT
CUSTOMER APPROVAL
```

---

# 82. Batch

Production Batch groups units produced under common conditions.

Useful for:

```text
TRACEABILITY
QUALITY
COST
```

---

# 83. Batch ID

Recommended where process/product risk justifies it.

---

# 84. Lot Traceability

Input lot may be linked to output batch.

Example:

```text
GARMENT LOT A
↓
PRINT BATCH 21
↓
ORDER 1024
```

---

# 85. Traceability Depth

Should match business need.

Do not create pharmaceutical-level traceability for trivial products without reason.

---

# 86. Apparel Batch Value

Useful for:

- shade variation,
- garment defects,
- print inconsistency.

---

# 87. WIP

Canonical:

```text
WORK IN PROGRESS
```

represents material/output currently inside production flow.

---

# 88. WIP Status

Potential:

```text
QUEUED
PROCESSING
WAITING
QC_HOLD
```

---

# 89. WIP Visibility

MGBOS should eventually answer:

> What is currently being produced, where, by whom, and when will it be ready?

---

# 90. WIP Limit

Too much simultaneous production creates:

- delay,
- confusion,
- hidden inventory.

---

# 91. Queue

Production queue should reflect:

```text
DUE DATE
PRIORITY
DEPENDENCY
CAPACITY
```

---

# 92. Priority

Potential:

```text
STANDARD
HIGH
URGENT
```

but urgency should not become default.

---

# 93. Rush Job

Rush jobs may require:

- capacity override,
- premium cost,
- approval.

---

# 94. Production Scheduling

Scheduling assigns:

```text
WORK
to
TIME + CAPABILITY
```

---

# 95. Scheduling Inputs

```text
DUE DATE
PROCESS TIME
CAPACITY
DEPENDENCIES
MATERIAL AVAILABILITY
SETUP
```

---

# 96. Planned Start

When production should begin.

---

# 97. Planned Finish

When production should finish.

---

# 98. Actual Start / Finish

Capture to improve future planning.

---

# 99. Lead Time

Production Lead Time:

```text
RELEASE
→
COMPLETION
```

or another explicitly defined clock.

---

# 100. Cycle Time

Can measure actual active processing time separately from waiting.

---

# 101. Queue Time

Long queue time may be larger bottleneck than production time.

---

# 102. Setup

Some processes require setup:

- screen preparation,
- embroidery digitization,
- machine setup.

---

# 103. Setup Cost

Should be distinguishable where material to economics.

---

# 104. Setup Optimization

Batching may reduce setup cost.

But excessive batching may delay orders.

---

# 105. Production Batch Sizing

Balance:

```text
SETUP EFFICIENCY
vs
FLOW SPEED
vs
INVENTORY
```

---

# 106. Capacity

Capacity should be modeled by:

```text
CAPABILITY
EXECUTOR
TIME PERIOD
```

---

# 107. Capacity Units

Possible:

```text
UNITS / DAY
PRINTS / HOUR
JOBS / DAY
```

depending process.

---

# 108. Effective Capacity

Nominal machine capacity is not real operational capacity.

Need to consider:

```text
SETUP
DOWNTIME
LABOR
MIX
QUALITY
```

---

# 109. Available Capacity

Conceptually:

```text
EFFECTIVE CAPACITY
-
COMMITTED LOAD
=
AVAILABLE CAPACITY
```

---

# 110. Capacity Commitment

Released Work Orders consume expected capacity.

---

# 111. Overcapacity Risk

If planned load exceeds capacity:

flag before promise failure.

---

# 112. Capacity Exception

Potential actions:

```text
RESCHEDULE
REROUTE
ADD SHIFT
USE PARTNER
NEGOTIATE DUE DATE
```

---

# 113. Internal vs External Capacity

MGBOS should eventually compare both.

---

# 114. Capacity Purchase

External production is effectively:

```text
BUYING CAPACITY
```

instead of owning it.

---

# 115. Production Calendar

May track:

```text
SHIFTS
HOLIDAYS
MAINTENANCE
PARTNER CLOSURES
```

where relevant.

---

# 116. Equipment

If internal production grows, system may track:

```text
MACHINE
```

as resource.

Not necessary for every early workflow.

---

# 117. Machine Capability

One machine may support multiple process types.

---

# 118. Equipment Downtime

Significant downtime should create capacity impact.

---

# 119. Maintenance

Preventive maintenance becomes important once internal equipment becomes critical.

Detailed maintenance system may come later.

---

# 120. Labor

Production may eventually model labor capacity separately.

---

# 121. Labor Skill

Certain jobs may require:

```text
CERTAIN OPERATOR / SKILL
```

not just machine availability.

---

# 122. Bottleneck Resource

The slowest constrained resource determines system throughput.

---

# 123. Bottleneck Management

Canonical:

```text
IDENTIFY
↓
PROTECT
↓
SCHEDULE
↓
IMPROVE
```

---

# 124. Production Release Board

Potential MGBOS queue:

```text
NOT READY
READY TO RELEASE
RELEASED
IN PRODUCTION
QC
BLOCKED
```

---

# 125. Production Board Must Be Operational

It should not duplicate statuses without action value.

---

# 126. Production Costing

Each Job should progressively estimate:

```text
MATERIAL
PROCESS
PARTNER
LABOR
SETUP
SCRAP
REWORK
```

---

# 127. Standard Cost

Can be based on expected recipe.

---

# 128. Actual Cost

Based on real execution.

---

# 129. Cost Variance

Canonical:

```text
ACTUAL COST
-
STANDARD COST
=
VARIANCE
```

---

# 130. Variance Causes

Potential:

```text
MATERIAL PRICE
SCRAP
REWORK
RUSH
PARTNER RATE
EXTRA PROCESS
```

---

# 131. Production Cost vs Product Cost

Production cost may be one component of total COGS.

---

# 132. Multi-Step Cost

Each Work Order can contribute to parent Production Job cost.

---

# 133. Related-Party Production Cost

MultiGraph should record transfer/management cost.

---

# 134. Production Margin Visibility

For Custom/Business jobs, expected production cost should be known before quote approval where possible.

---

# 135. Cost Update

If production plan changes materially:

commercial margin risk should become visible.

---

# 136. Low Margin Production Exception

If actual/expected cost threatens contribution floor:

flag for review.

---

# 137. Quality at Source

Each production executor should perform in-process checks.

---

# 138. In-Process Quality

Potential:

```text
PLACEMENT
COLOR
ADHESION
STITCH
SIZE
COUNT
```

depending process.

---

# 139. First Article

Before full run:

```text
FIRST ARTICLE
```

may be checked.

Particularly for:

- new artwork,
- new process,
- new partner.

---

# 140. First Article Approval

Only after acceptance should mass run continue when risk warrants.

---

# 141. QC Handoff

Production completion does not equal accepted output.

Canonical:

```text
PRODUCTION READY
↓
QC
↓
ACCEPTED OUTPUT
```

---

# 142. QC Responsibility

Production executor may self-check.

Final release authority follows Quality Control policy.

---

# 143. QC Hold

Failed output should not become sellable inventory.

---

# 144. Partial QC Pass

A batch may contain:

```text
PASS
FAIL
```

quantities.

System should support partial acceptance.

---

# 145. Accepted Quantity

Only:

```text
GOOD + QC PASSED
```

counts toward finished requirement.

---

# 146. Production Completion

Job may only complete when:

```text
REQUIRED ACCEPTED OUTPUT MET
or
AUTHORIZED SHORT CLOSURE
```

---

# 147. Short Closure

Intentional completion below requested qty requires approval/reason.

---

# 148. Excess Good Output

Decision required:

```text
ADD TO INVENTORY
ALLOCATE
HOLD
DISPOSE
```

depending ownership/IP.

---

# 149. Customer-Specific Excess

Should not automatically become general stock.

---

# 150. Production Closure

Canonical close should reconcile:

```text
INPUT
OUTPUT
SCRAP
REWORK
COST
QC
MATERIAL RETURN
```

---

# 151. Close Checklist

A closed Production Job should have no unexplained material/output balance.

---

# 152. Material Return

Unused issued materials may return:

```text
PRODUCTION
→
AVAILABLE / CONTROLLED STOCK
```

with transaction record.

---

# 153. Partial Material

Opened/partial materials may need different inventory handling.

---

# 154. Partner Reconciliation

External production should reconcile:

```text
MATERIAL SENT
↓
GOOD OUTPUT
+
SCRAP
+
REMAINDER
```

---

# 155. Production Incident

Potential:

```text
MACHINE FAILURE
MATERIAL DEFECT
WRONG ARTWORK
MISPRINT
PARTNER DELAY
COUNT ERROR
```

---

# 156. Incident Record

Should connect:

```text
PRODUCTION JOB
WORK ORDER
EXECUTOR
IMPACT
ROOT CAUSE
```

---

# 157. Root Cause

Use operational categories where useful:

```text
MATERIAL
METHOD
MACHINE
PEOPLE
SPECIFICATION
PLANNING
```

---

# 158. Corrective Action

For repeat/material issue:

```text
CAUSE
↓
ACTION
↓
OWNER
↓
VERIFY
```

---

# 159. Production Analytics

Core dimensions:

```text
VOLUME
SPEED
QUALITY
COST
CAPACITY
```

---

# 160. Production Volume

Track:

```text
JOBS
UNITS
WORK ORDERS
```

by capability.

---

# 161. On-Time Completion

Measures jobs completed against committed production due date.

---

# 162. Production Lead Time

Track by:

```text
CAPABILITY
EXECUTOR
PRODUCT TYPE
```

---

# 163. First-Pass Yield

Useful process quality metric.

---

# 164. Scrap Rate

Track by:

```text
PROCESS
MATERIAL
PARTNER
```

---

# 165. Rework Rate

Repeated rework is operational cost signal.

---

# 166. Cost per Unit

Useful only comparing sufficiently similar jobs/processes.

---

# 167. Capacity Utilization

Conceptually:

```text
COMMITTED / EFFECTIVE CAPACITY
```

---

# 168. Utilization Warning

100% utilization is not necessarily desirable.

No slack can make flow fragile.

---

# 169. Queue Age

Oldest unstarted Work Orders may indicate bottleneck.

---

# 170. WIP Age

Long-running WIP may signal:

- blocked process,
- missing input,
- poor status discipline.

---

# 171. Production Reliability

Key question:

> If TeeStock promises production date X, how often does production actually finish by X?

---

# 172. Executor Performance

Compare internal/MultiGraph/partner routes across:

```text
QUALITY
SPEED
COST
RELIABILITY
```

---

# 173. Make-vs-Buy Data

Production analytics should eventually make vertical integration decisions evidence-based.

---

# 174. Internalization Signal

Potential:

```text
HIGH REPEAT VOLUME
HIGH EXTERNAL SPEND
QUALITY PAIN
LEAD TIME PAIN
CAPITAL RETURN ATTRACTIVE
```

---

# 175. Externalization Signal

A capability may remain external when:

```text
LOW FREQUENCY
SPECIALIZED
CAPEX HEAVY
VARIABLE DEMAND
GOOD PARTNERS AVAILABLE
```

---

# 176. Production Priority Rules

Possible hierarchy:

```text
CUSTOMER COMMITMENT
↓
SLA / DUE DATE
↓
PRIORITY
↓
EFFICIENCY
```

Exact policy should be defined operationally.

---

# 177. Rush Priority Abuse

If everything is urgent:

priority system has failed.

---

# 178. Production Freeze

Near execution, major changes may be restricted.

This reduces:

- waste,
- version errors,
- schedule disruption.

---

# 179. Change Request

After freeze:

```text
CHANGE
↓
IMPACT ASSESSMENT
↓
APPROVAL
```

---

# 180. Customer Approval Dependency

Custom production must not begin before required approvals.

---

# 181. Commercial Dependency

Production may also wait for:

```text
DEPOSIT
FULL PAYMENT
PO
```

depending account terms.

---

# 182. Production SLA

SLA must define:

```text
START EVENT
EXPECTED TIME
PAUSE CONDITIONS
END EVENT
```

---

# 183. Pause Conditions

Examples:

```text
CUSTOMER DELAY
MISSING MATERIAL
APPROVED CHANGE REQUEST
FORCE MAJEURE
```

---

# 184. Promise Date

Customer-facing due date should account for:

```text
PRODUCTION
+
QC
+
FULFILLMENT
```

not production alone.

---

# 185. Production Documentation

Potential generated documents:

```text
PRODUCTION JOB SHEET
WORK ORDER
MATERIAL PICK LIST
PROCESS INSTRUCTION
QC SHEET
```

---

# 186. Barcode / QR Future

Work Order or batch may use QR/barcode for:

```text
STATUS
TRACEABILITY
MATERIAL
OUTPUT
```

later.

---

# 187. Operator Interface

Future internal production UI should show only relevant:

```text
JOB
SPEC
FILES
QTY
DUE DATE
NEXT ACTION
```

Avoid full ERP clutter.

---

# 188. Partner Interface

Future Partner Portal should expose:

```text
WORK ORDERS
FILES
DUE DATES
STATUS
ISSUES
```

---

# 189. MGBOS Production Entities

Core:

```text
PRODUCTION JOB
WORK ORDER
RECIPE
BOM
MATERIAL REQUIREMENT
MATERIAL ISSUE
BATCH
OUTPUT
SCRAP
REWORK
QC RESULT
```

---

# 190. Production Job Entity

Parent production objective.

---

# 191. Work Order Entity

Executor-specific step.

---

# 192. Recipe Entity

Canonical process definition.

---

# 193. BOM Entity

Expected material requirements.

---

# 194. Material Issue Entity

Actual material sent into production.

---

# 195. Batch Entity

Traceable production grouping.

---

# 196. Output Entity

Records produced quantity/result.

---

# 197. Scrap Entity

Records unrecoverable loss.

---

# 198. Rework Entity

Records correction activity.

---

# 199. Production Data Lineage

Canonical:

```text
ORDER / DEMAND
↓
PRODUCTION JOB
↓
RECIPE
↓
WORK ORDER
↓
MATERIAL ISSUE
↓
OUTPUT
↓
QC
↓
INVENTORY / FULFILLMENT
```

---

# 200. Production Events

Potential future:

```text
production_job.created
production_job.released
work_order.accepted
work_order.started
material.issued
production.output_recorded
qc.failed
qc.passed
production_job.completed
```

---

# 201. Automation Opportunities

Potential:

```text
Requirement Generation
BOM Explosion
Material Availability Check
Partner Shortlisting
Work Order Generation
Capacity Warning
Late Job Alert
Cost Variance
```

---

# 202. BOM Explosion

System calculates required materials from:

```text
RECIPE
×
QUANTITY
```

where standardized.

---

# 203. Automatic Material Reservation

Routine standard products may eventually reserve inventory automatically after production release.

---

# 204. Work Order Generation

System may generate Work Orders from approved routing.

---

# 205. Late Production Alert

MGBOS should surface:

```text
DUE SOON
NOT STARTED
```

or:

```text
ACTUAL PROGRESS
behind plan
```

before customer promise fails.

---

# 206. AI Role

AI may assist with:

```text
Requirement extraction
Production planning summary
Routing recommendation
Bottleneck detection
Incident clustering
Cost anomaly explanation
```

---

# 207. AI Production Boundary

AI should not independently:

```text
CHANGE APPROVED ARTWORK
IGNORE MATERIAL SHORTAGE
BYPASS QC
PROMISE UNKNOWN CAPACITY
```

---

# 208. Deterministic Controls

Inventory reservation, cost rules, Work Order states, and approval gates should remain deterministic.

---

# 209. AI Scheduling Future

AI may optimize schedules once:

```text
PROCESS TIMES
CAPACITY
DEPENDENCIES
DUE DATES
```

are reliable.

Bad data produces bad schedules.

---

# 210. Computer Vision Future

Can assist:

- placement,
- defect detection,
- color/visual inspection.

Human/defined QC policy remains authoritative.

---

# 211. Production Maturity Model

```text
LEVEL 0
Chat + memory

LEVEL 1
Job sheets + Work Orders

LEVEL 2
Recipes + materials + status

LEVEL 3
Capacity + costing + QC integration

LEVEL 4
Automated planning / routing

LEVEL 5
Exception-based AI production orchestration
```

---

# 212. Level 0

Anti-goal.

Production depends on individual knowledge and conversation history.

---

# 213. Level 1

Minimum viable production control:

```text
PRODUCTION JOB
WORK ORDER
APPROVED FILE
QTY
DUE DATE
```

---

# 214. Level 2

Adds:

```text
RECIPE
BOM
MATERIAL ISSUE
OUTPUT
```

---

# 215. Level 3

Adds:

```text
CAPACITY
ACTUAL COST
QC HISTORY
PARTNER PERFORMANCE
```

---

# 216. Level 4

System can automatically:

- plan,
- reserve,
- generate Work Orders,
- recommend routes.

---

# 217. Level 5

AI/agents monitor flow and primarily escalate exceptions.

---

# 218. Current Recommended Stage

TeeStock should target:

```text
LEVEL 1
→
LEVEL 2
```

first.

---

# 219. V1 Required Objects

Priority:

```text
Production Job
Work Order
Recipe / Production Spec
Material Requirement
Production Output
QC Result
```

---

# 220. V1 Execution Routes

Support:

```text
MULTIGRAPH
+
SELECTED EXTERNAL PARTNERS
```

through same conceptual Work Order model.

---

# 221. V1 Priority Processes

Focus on recurring apparel transformations:

```text
DTF
SCREEN PRINT
EMBROIDERY
LABEL / FINISHING
```

only as TeeStock actually uses them.

---

# 222. V1 Avoid

Do not immediately build:

```text
full MES
machine IoT
minute-by-minute operator tracking
advanced APS
complex finite scheduling
```

before production volume justifies it.

---

# 223. V2 Expansion

Possible:

```text
BOM AUTOMATION
MATERIAL RESERVATION
BATCH TRACEABILITY
ACTUAL COSTING
CAPACITY BOARD
```

---

# 224. V3 Expansion

Possible:

```text
MULTI-STEP ROUTING
PARTNER CAPACITY
SCHEDULING ENGINE
BARCODE WIP
```

---

# 225. V4 Expansion

Possible:

```text
DISTRIBUTED PRODUCTION
AUTOMATED ROUTING
PREDICTIVE CAPACITY
COMPUTER-VISION QC
```

---

# 226. Production Release Gate

A Job may only release when:

```text
SPEC COMPLETE
+
ARTWORK APPROVED
+
MATERIAL PLAN VALID
+
ROUTE VALID
+
COMMERCIAL CONDITIONS MET
```

---

# 227. Production Completion Gate

A Job may only complete when:

```text
ACCEPTED OUTPUT
+
MATERIAL RECONCILIATION
+
QC RECORD
+
COST / EXECUTION RECORD
```

are sufficient.

---

# 228. Standardization Gate

A production method becomes canonical reusable Recipe only after enough repeatability is known.

---

# 229. Automation Gate

Automate only when:

```text
INPUT STABLE
PROCESS STABLE
STATUS STABLE
OUTPUT STABLE
```

---

# 230. Distributed Production Gate

Use multiple interchangeable executors only when:

```text
SPEC STANDARD
+
RECIPE STANDARD
+
QC STANDARD
+
PARTNER QUALIFIED
```

---

# 231. Internalization Gate

Consider owning capability when:

```text
VOLUME
+
ECONOMICS
+
QUALITY
+
CONTROL
+
CAPITAL RETURN
```

justify it.

---

# 232. Production Failure Modes

## Production from Chat

Wrong specs and no audit trail.

## Work Without Approved Artwork

Rework.

## No Material Reservation

Stock conflict.

## Every Job Uses Different Method

No learning.

## Partner Without Work Order

Ambiguous responsibility.

## No Output Reconciliation

Inventory becomes fiction.

## Scrap Not Recorded

Margins become misleading.

## Rework Hidden

Process appears healthier than reality.

## Production Complete Before QC

Bad product enters fulfillment.

---

# 233. What Production System Must Not Become

## Machine-Centric ERP

Customer/product flow matters more than impressive machine screens.

## Overengineered MES Too Early

Control first, sophistication later.

## Partner Black Box

External production still needs visibility.

## Founder Scheduling Board

Planning should become system knowledge.

## Cost Blind Factory

Volume without economics is not success.

---

# 234. Production Success Definition

The Production System succeeds when TeeStock can answer:

```text
WHAT
needs to be produced?

WHY
is it being produced?

HOW
should it be produced?

WHAT MATERIAL
is required?

WHO
should produce it?

WHEN
must it be complete?

WHAT IS THE STATUS?

HOW MUCH
was actually produced?

WHAT FAILED?

WHAT DID IT COST?

DID QC ACCEPT IT?
```

for every meaningful production job.

---

# 235. Canonical Production Summary

```text
DEMAND
creates Production Requirement.

PRODUCTION JOB
defines the objective.

RECIPE
defines how.

BOM
defines inputs.

ROUTING
selects capability.

WORK ORDER
assigns execution.

MATERIAL ISSUE
feeds production.

OUTPUT
records reality.

QC
accepts or rejects.

COSTING
reveals economics.

MGBOS
connects the chain.
```

---

# 236. Canonical Production Principles

```text
NO SPEC, NO PRODUCTION.

NO APPROVAL, NO RELEASE.

RECIPE BEFORE REPEAT.

RESERVE BEFORE ISSUE.

WORK ORDER BEFORE EXECUTION.

CAPABILITY BEFORE VENDOR NAME.

ROUTE BY TOTAL OUTCOME, NOT LOWEST PRICE.

TRACK INPUT AND OUTPUT.

SCRAP IS DATA.

REWORK IS COST.

QC BEFORE FULFILLMENT.

RECONCILE BEFORE CLOSE.

STANDARDIZE BEFORE AUTOMATE.

DATA BEFORE AI SCHEDULING.
```

---

# 237. Dependency

Dokumen berikut harus follow Production System:

1. `07-operations/quality-control.md`
2. `07-operations/inventory-system.md`
3. `07-operations/order-fulfillment.md`
4. `08-finance/unit-economics.md`
5. `08-finance/cost-accounting.md`
6. `10-product-tech/automation-architecture.md`
7. `11-data-mgbos/canonical-data-model.md`
8. `11-data-mgbos/entity-hierarchy.md`
9. `11-data-mgbos/event-model.md`
10. `11-data-mgbos/mgbos-integration.md`
11. `13-metrics-experiments/kpi-framework.md`

TeeStock Production System boleh berkembang menjadi distributed and highly automated production network, tetapi hanya setelah product specifications, Recipes, BOM, Work Orders, material control, QC, production costing, dan executor performance benar-benar menjadi reliable operational truth.