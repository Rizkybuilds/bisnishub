---
title: "TeeStock Quality Control System"
date: "2026-09-28"
bisnis: teestock
kategori: operasional
status: active
tags:
  - bisnis/teestock
  - kategori/operasional
  - teestock/canonical
  - teestock/operations
document_id: "TS-OPS-004"
version: "1.0"
category: "operations"
business: "teestock"
last_updated: "2026-09-28"
path: "07-operations/quality-control.md"
depends_on:
  - "TS-FND-001"
  - "TS-FND-002"
  - "TS-COM-003"
  - "TS-COM-005"
  - "TS-SVC-002"
  - "TS-SVC-003"
  - "TS-SVC-007"
  - "TS-PRG-004"
  - "TS-OPS-001"
  - "TS-OPS-002"
  - "TS-OPS-003"
---


# TeeStock Quality Control System v1.0

> [!tip] **Canonical TeeStock Quality Assurance & Quality Control Framework  **
> Dokumen ini mendefinisikan quality standards, incoming inspection, in-process checks, final QC, sampling, defect classification, quarantine, nonconformance, rework, reproduction, supplier/partner attribution, root-cause analysis, corrective action, traceability, customer-quality feedback, dan progressive automation untuk seluruh ecosystem TeeStock.
>
> [!info] **Dependencies & Data Flow (SSOT)**
> [[bisnis/teestock/00-foundation/teestock-master-definition|TS-FND-001: TeeStock Master Definition]] • [[bisnis/teestock/00-foundation/glossary|TS-FND-002: TeeStock Glossary]] • [[bisnis/teestock/03-commerce/teestock-essentials|TS-COM-003: TeeStock Essentials]] • [[bisnis/teestock/03-commerce/product-taxonomy|TS-COM-005: TeeStock Product Taxonomy]] • [[bisnis/teestock/04-services/custom|TS-SVC-002: TeeStock Custom]] • [[bisnis/teestock/04-services/business|TS-SVC-003: TeeStock Business]] • [[bisnis/teestock/04-services/fulfill|TS-SVC-007: TeeStock Fulfill]] • [[bisnis/teestock/06-programs/partner-program|TS-PRG-004: TeeStock Partner Program]] • [[bisnis/teestock/07-operations/operating-model|TS-OPS-001: TeeStock Operating Model]] • [[bisnis/teestock/07-operations/sourcing-and-vendors|TS-OPS-002: TeeStock Sourcing & Vendors]] • [[bisnis/teestock/07-operations/production-system|TS-OPS-003: TeeStock Production System]]


---

# 1. Purpose

Quality Control System menjawab:

> **Bagaimana TeeStock memastikan produk dan hasil kerja memenuhi standar yang dijanjikan secara konsisten sebelum customer menerima kegagalan proses internal?**

Canonical principle:

> **Build quality into the process. Verify quality before release.**

---

# 2. Canonical Definition

> **TeeStock Quality System adalah operating framework yang mendefinisikan standar mutu, titik pemeriksaan, metode acceptance, nonconformance handling, root-cause learning, dan quality traceability untuk materials, products, production, partners, fulfillment, dan customer outcomes.**

---

# 3. Quality Is Bigger Than Final Inspection

Canonical:

```text id="qc001"
SOURCE QUALITY
+
PROCESS QUALITY
+
OUTPUT QUALITY
+
DELIVERY QUALITY
+
CUSTOMER FEEDBACK
=
TEEStock QUALITY
```

---

# 4. QA vs QC

Critical distinction:

```text id="qc002"
QUALITY ASSURANCE
designs the system to prevent defects.

QUALITY CONTROL
checks whether output meets standard.
```

TeeStock needs both.

---

# 5. Core Quality Philosophy

Canonical:

```text id="qc003"
PREVENT
↓
DETECT EARLY
↓
CONTAIN
↓
CORRECT
↓
LEARN
```

---

# 6. Quality Objective

Quality should protect:

```text id="qc004"
CUSTOMER PROMISE
PRODUCT CONSISTENCY
BRAND TRUST
MARGIN
OPERATIONAL RELIABILITY
```

---

# 7. Quality Standard

Every repeatable product/process should eventually have:

```text id="qc005"
QUALITY STANDARD
```

defining what acceptable means.

---

# 8. Product Quality Standard

May include:

```text id="qc006"
MATERIAL
SIZE / MEASUREMENT
COLOR
CONSTRUCTION
PRINT
EMBROIDERY
PLACEMENT
FINISHING
PACKAGING
```

---

# 9. Service Quality Standard

For service output, may include:

```text id="qc007"
SCOPE COMPLETENESS
SPEC COMPLIANCE
DELIVERABLE QUALITY
TIMING
DOCUMENTATION
```

---

# 10. Product Truth Before Inspection

QC must inspect against known:

```text id="qc008"
SPECIFICATION
```

not personal preference.

---

# 11. Reference Hierarchy

Canonical:

```text id="qc009"
APPROVED SPEC
↓
APPROVED SAMPLE / GOLDEN SAMPLE
↓
QC CRITERIA
↓
ACTUAL OUTPUT
```

---

# 12. Golden Sample

A Golden Sample is:

> **approved physical reference representing acceptable product quality.**

Useful when visual/physical variation is difficult to express in text alone.

---

# 13. Golden Sample Use

Can support:

```text id="qc010"
COLOR
PLACEMENT
PRINT FEEL
STITCH
FIT
FINISH
```

comparison.

---

# 14. Golden Sample Governance

Must identify:

```text id="qc011"
PRODUCT
VERSION
DATE
APPROVER
STATUS
```

---

# 15. Obsolete Golden Sample

When spec changes:

old reference should be marked obsolete.

---

# 16. Quality Stages

Canonical:

```text id="qc012"
INCOMING QC
↓
IN-PROCESS QC
↓
FINAL QC
↓
FULFILLMENT CHECK
↓
CUSTOMER QUALITY FEEDBACK
```

---

# 17. Incoming QC

Purpose:

> prevent defective input from entering usable inventory or production.

---

# 18. Incoming QC Scope

Potential:

```text id="qc013"
GARMENTS
FABRIC
TRIMS
PACKAGING
PRINT MATERIAL
FINISHED PURCHASED GOODS
```

---

# 19. Incoming Inspection Criteria

May include:

```text id="qc014"
COUNT
SKU
SIZE
COLOR
MATERIAL
MEASUREMENT
VISIBLE DEFECT
PACKAGING
```

---

# 20. Incoming Status

Canonical:

```text id="qc015"
RECEIVED
↓
INSPECTION
↓
ACCEPTED
or
QUARANTINE
or
REJECTED
```

---

# 21. Accepted

Goods may enter usable stock.

---

# 22. Quarantine

Goods with unresolved quality status.

Canonical:

```text id="qc016"
QUARANTINE
≠
AVAILABLE
```

---

# 23. Rejected

Goods do not meet acceptance requirement.

Possible next actions:

```text id="qc017"
RETURN
REPLACE
CREDIT
REWORK
DISPOSE
```

---

# 24. In-Process QC

Checks occur while production is still running.

Purpose:

> catch process drift before large quantity is affected.

---

# 25. Examples

```text id="qc018"
FIRST PRINT
FIRST EMBROIDERY
PLACEMENT CHECK
COLOR CHECK
SIZE CHECK
STITCH CHECK
```

---

# 26. First Article Inspection

For:

```text id="qc019"
NEW PRODUCT
NEW ARTWORK
NEW PARTNER
NEW PROCESS
HIGH-RISK JOB
```

a first article should be reviewed before full production where practical.

---

# 27. First Article Gate

Canonical:

```text id="qc020"
FIRST ARTICLE
↓
PASS
→ CONTINUE

FAIL
→ ADJUST BEFORE MASS RUN
```

---

# 28. Final QC

Performed after production before release to inventory/fulfillment.

---

# 29. Final QC Purpose

Verify:

```text id="qc021"
RIGHT PRODUCT
RIGHT QUANTITY
RIGHT SPEC
RIGHT CONDITION
```

---

# 30. Fulfillment Check

Separate lightweight check may verify:

```text id="qc022"
RIGHT SKU
RIGHT SIZE
RIGHT QTY
RIGHT CUSTOMER
RIGHT PACK
```

---

# 31. Quality Control Is Risk-Based

Not all items require 100% inspection.

Inspection intensity should reflect:

```text id="qc023"
PRODUCT RISK
PROCESS RISK
SUPPLIER HISTORY
ORDER VALUE
CUSTOMER IMPACT
```

---

# 32. Inspection Levels

Potential:

```text id="qc024"
LEVEL 1
basic check

LEVEL 2
sample inspection

LEVEL 3
enhanced inspection

LEVEL 4
100% inspection
```

---

# 33. 100% Inspection

Appropriate when:

```text id="qc025"
CUSTOMIZED
HIGH VALUE
HIGH FAILURE COST
SMALL QUANTITY
NEW PROCESS
```

---

# 34. Sampling

Useful when:

```text id="qc026"
LARGE BATCH
LOW-MODERATE RISK
STABLE PROCESS
```

---

# 35. Sampling Philosophy

Canonical:

> **Sample enough to manage risk, not merely to reduce inspection work.**

---

# 36. Sampling Plan

Should define:

```text id="qc027"
LOT SIZE
SAMPLE SIZE
ACCEPTANCE LIMIT
REJECTION LIMIT
```

where formal sampling is used.

---

# 37. AQL-Style Logic

TeeStock may later adopt proportionate AQL-style acceptance logic for scalable batch inspection.

Canonical caution:

> **AQL is an operating tool, not a substitute for product judgment.**

---

# 38. Early V1 Sampling

V1 can use simpler risk-based rules rather than full industrial statistical sampling.

---

# 39. Lot

Inspection should reference a meaningful:

```text id="qc028"
LOT / BATCH
```

where traceability matters.

---

# 40. Lot Integrity

A lot should group items produced/received under sufficiently similar conditions.

---

# 41. Defect

Canonical:

> **A Defect is a measurable or observable deviation from approved specification or acceptable product condition.**

---

# 42. Defect Classification

Canonical:

```text id="qc029"
CRITICAL
MAJOR
MINOR
```

---

# 43. Critical Defect

Potentially:

- unsafe,
- legally problematic,
- completely wrong product,
- severe brand/customer harm.

Default:

```text id="qc030"
ZERO ACCEPTANCE
```

unless specific policy says otherwise.

---

# 44. Major Defect

Materially affects:

```text id="qc031"
FUNCTION
APPEARANCE
FIT
CUSTOMER ACCEPTANCE
```

---

# 45. Minor Defect

Small deviation that does not materially affect intended use but is still below ideal standard.

---

# 46. Defect Catalogue

Recurring products/processes should eventually maintain:

```text id="qc032"
DEFECT CATALOGUE
```

with examples.

---

# 47. Apparel Defect Examples

Potential:

```text id="qc033"
HOLE
STAIN
BROKEN STITCH
MEASUREMENT OUTSIDE TOLERANCE
SHADE VARIATION
LABEL ERROR
```

---

# 48. Print Defect Examples

Potential:

```text id="qc034"
MISPLACEMENT
CRACKING
POOR ADHESION
COLOR MISMATCH
INK BLEED
INCOMPLETE TRANSFER
```

---

# 49. Embroidery Defect Examples

Potential:

```text id="qc035"
THREAD BREAK
PUCKERING
MISALIGNMENT
DENSITY ISSUE
WRONG COLOR
```

---

# 50. Packaging Defect Examples

Potential:

```text id="qc036"
WRONG LABEL
DAMAGED PACK
MISSING INSERT
WRONG PRODUCT IDENTIFICATION
```

---

# 51. Measurement Tolerance

Where relevant, spec should define:

```text id="qc037"
TARGET
+
ACCEPTABLE TOLERANCE
```

---

# 52. Color Tolerance

Color assessment may use:

- approved sample,
- controlled visual comparison,
- more formal color measurement later.

---

# 53. Print Placement Tolerance

Placement should define:

```text id="qc038"
TARGET POSITION
+
ACCEPTABLE DEVIATION
```

where repeatability matters.

---

# 54. Subjective Quality

Some attributes remain partially subjective.

Use:

```text id="qc039"
REFERENCE
+
TRAINING
+
CONSISTENT APPROVAL
```

to reduce variation.

---

# 55. Nonconformance

Canonical:

> **Nonconformance is an item, batch, process, or output that does not meet approved requirement.**

---

# 56. NCR

Significant quality failure may create:

```text id="qc040"
NONCONFORMANCE REPORT
NCR
```

---

# 57. NCR Minimum

```text id="qc041"
NCR ID
Product
Batch / Work Order
Defect
Qty
Severity
Source
Owner
Disposition
```

---

# 58. Nonconformance Sources

Potential:

```text id="qc042"
SUPPLIER
INTERNAL PRODUCTION
MULTIGRAPH
EXTERNAL PARTNER
FULFILLMENT
CUSTOMER RETURN
```

---

# 59. Containment

First goal after discovering defect:

```text id="qc043"
STOP DEFECTIVE OUTPUT
FROM REACHING MORE CUSTOMERS
```

---

# 60. Containment Actions

Possible:

```text id="qc044"
QUARANTINE
STOP PRODUCTION
BLOCK SKU
HOLD SHIPMENT
SUSPEND PARTNER ROUTING
```

---

# 61. Disposition

Nonconforming product may be:

```text id="qc045"
REWORK
REPRODUCE
RETURN TO VENDOR
ACCEPT WITH CONCESSION
DOWNGRADE
SCRAP
```

---

# 62. Rework

Used when output can be corrected to meet spec.

---

# 63. Reproduction

Create replacement unit when correction is not viable.

---

# 64. Accept With Concession

Use only when deviation is acceptable and intentionally approved.

---

# 65. Concession Is Not Silent Acceptance

Must record:

```text id="qc046"
WHAT DEVIATED
WHY ACCEPTED
WHO APPROVED
```

---

# 66. Downgrade

Potentially move product to:

- seconds,
- internal use,

only if business model/policy supports it and branding risk is controlled.

---

# 67. Scrap

When product cannot be economically or reputationally used.

---

# 68. QC Result

Canonical states:

```text id="qc047"
PASS
FAIL
CONDITIONAL_PASS
HOLD
```

---

# 69. Conditional Pass

Use only under explicit approved concession.

---

# 70. Partial Pass

Batch can have:

```text id="qc048"
PASSED QTY
FAILED QTY
```

---

# 71. Accepted Quantity

Only passed/approved units count toward fulfillable output.

---

# 72. Quality Traceability

Defect should map backward to:

```text id="qc049"
ORDER
PRODUCT
SKU
BATCH
WORK ORDER
RECIPE
MATERIAL LOT
EXECUTOR
```

where relevant.

---

# 73. Forward Traceability

If a defective batch is discovered:

system should ideally know:

> which customers/orders received it?

---

# 74. Traceability Depth

Match business risk.

Do not overengineer trivial products.

---

# 75. Supplier Quality

Incoming supplier defects should affect:

```text id="qc050"
SUPPLIER SCORECARD
```

---

# 76. Partner Quality

Production defects should affect:

```text id="qc051"
PARTNER / EXECUTOR PERFORMANCE
```

---

# 77. Internal Quality

Internal failures must also be measured.

Do not create a system that only blames external vendors.

---

# 78. Root Cause Analysis

Significant/repeat issues should answer:

```text id="qc052"
WHY DID THIS HAPPEN?
```

not only:

> who made the mistake?

---

# 79. Root Cause Categories

Potential:

```text id="qc053"
MATERIAL
METHOD
MACHINE
PEOPLE
SPEC
ENVIRONMENT
PLANNING
DATA
```

---

# 80. 5-Why Technique

Can be used for simple root-cause exploration.

Not every incident requires formal methodology.

---

# 81. Root Cause vs Escape Cause

Useful distinction:

```text id="qc054"
ROOT CAUSE
why defect happened.

ESCAPE CAUSE
why QC did not catch it.
```

---

# 82. Corrective Action

Fixes existing root cause.

---

# 83. Preventive Action

Reduces probability of future failure.

---

# 84. CAPA

For significant recurring issues:

```text id="qc055"
CORRECTIVE AND PREVENTIVE ACTION
```

may be used.

---

# 85. CAPA Record

Potential:

```text id="qc056"
Problem
Root Cause
Corrective Action
Preventive Action
Owner
Due Date
Verification
```

---

# 86. CAPA Closure

Do not close merely because action was performed.

Verify:

> Did the issue actually improve?

---

# 87. Recurrence

Repeated same defect should elevate priority.

---

# 88. Repeat Defect Rule

Canonical:

> **A recurring defect is a system problem until proven otherwise.**

---

# 89. Quality Cost

Canonical categories:

```text id="qc057"
PREVENTION
APPRAISAL
INTERNAL FAILURE
EXTERNAL FAILURE
```

---

# 90. Prevention Cost

Examples:

- samples,
- training,
- better specs.

---

# 91. Appraisal Cost

Examples:

- inspection,
- testing,
- QC labor.

---

# 92. Internal Failure Cost

Examples:

```text id="qc058"
SCRAP
REWORK
REPRINT
```

before customer receives product.

---

# 93. External Failure Cost

Examples:

```text id="qc059"
RETURN
REFUND
REPLACEMENT
CUSTOMER COMPENSATION
REPUTATION LOSS
```

---

# 94. Cost of Quality Principle

More inspection is not always better.

Goal is:

```text id="qc060"
LOWER TOTAL QUALITY COST
```

through better processes.

---

# 95. Supplier Quality Score

Potential dimensions:

```text id="qc061"
DEFECT RATE
SPEC COMPLIANCE
REPLACEMENT SPEED
CLAIM RESPONSE
```

---

# 96. Production Partner Quality Score

Potential:

```text id="qc062"
FIRST-PASS YIELD
DEFECT RATE
REWORK RATE
NCR FREQUENCY
```

---

# 97. QC Inspector Consistency

Different inspectors should not produce wildly different standards.

Use:

- reference samples,
- defect catalogue,
- calibration/training.

---

# 98. Inspector Calibration

Periodic comparison can identify inconsistent interpretation.

---

# 99. QC Independence

For high-risk work:

final approval should not rely solely on same person who produced it.

---

# 100. Small-Team Reality

In early stage, one person may produce and inspect.

System should still separate:

```text id="qc063"
PRODUCTION CHECK
vs
FINAL ACCEPTANCE
```

conceptually.

---

# 101. Product-Specific QC Profile

Each repeatable product/platform can have:

```text id="qc064"
QC PROFILE
```

---

# 102. QC Profile Fields

Potential:

```text id="qc065"
Product
Critical Attributes
Inspection Method
Tolerance
Sample Level
Defect Rules
Reference Sample
```

---

# 103. Process-Specific QC Profile

Production methods may have dedicated checks.

---

# 104. DTF QC Example

Potential:

```text id="qc066"
PLACEMENT
TRANSFER COMPLETENESS
ADHESION
COLOR
EDGE CLEANLINESS
```

---

# 105. Embroidery QC Example

Potential:

```text id="qc067"
PLACEMENT
THREAD COLOR
DENSITY
PUCKERING
BACKING
```

---

# 106. Blank Garment QC Example

Potential:

```text id="qc068"
SIZE
FABRIC
SHADE
SEAM
HOLE
STAIN
```

---

# 107. Personalized Order QC

Must additionally verify:

```text id="qc069"
NAME
NUMBER
CUSTOM TEXT
PLACEMENT
```

against customer-approved data.

---

# 108. Personalization Error

High customer impact because output may be unsellable to others.

This often justifies 100% verification.

---

# 109. Business Order QC

For uniforms/large projects:

quality must also consider:

```text id="qc070"
CONSISTENCY ACROSS UNITS
SIZE BREAKDOWN
LOGO CONSISTENCY
PACKING BY PERSON / DEPARTMENT
```

where required.

---

# 110. Merch / Creator QC

Must protect:

- product quality,
- creator relationship,
- audience trust.

---

# 111. Originals QC

Originals may use stricter aesthetic standard where brand promise requires it.

---

# 112. Essentials QC

Essentials acts as quality benchmark for shared garment platform.

---

# 113. Quality Across Channels

Same canonical product should not have materially different standards by channel unless explicitly defined.

---

# 114. Marketplace Returns as Quality Signal

Return reason data should feed quality analysis.

---

# 115. Customer Feedback Loop

Canonical:

```text id="qc071"
CUSTOMER ISSUE
↓
CLASSIFY
↓
TRACE PRODUCT / BATCH
↓
ROOT CAUSE
↓
PROCESS IMPROVEMENT
```

---

# 116. Customer Complaint Classification

Potential:

```text id="qc072"
QUALITY
FIT
EXPECTATION
FULFILLMENT
DELIVERY
USAGE
```

Not every return is quality failure.

---

# 117. Quality Claim

A validated product defect should create quality signal.

---

# 118. Return Reason Integrity

Do not lump all returns under:

```text id="qc073"
CUSTOMER CHANGED MIND
```

if true defect exists.

---

# 119. External Quality Failure

Customer-detected defect is more expensive than internal detection.

---

# 120. Customer Impact Severity

Potential:

```text id="qc074"
ONE CUSTOMER
MULTIPLE CUSTOMERS
BATCH-WIDE
SYSTEMIC
```

---

# 121. Batch Investigation

If same defect appears repeatedly:

identify common:

- batch,
- supplier,
- production executor,
- recipe.

---

# 122. Product Hold

A product/SKU can be temporarily blocked from sale/fulfillment during investigation.

---

# 123. Recall-Like Action

If serious issue affects distributed units:

TeeStock may need proactive customer contact.

Exact legal/commercial requirements depend on issue.

---

# 124. Quality Alert

Future MGBOS can create:

```text id="qc075"
QUALITY ALERT
```

when thresholds are breached.

---

# 125. Example Alerts

```text id="qc076"
Defect rate rising
Repeated embroidery failure
Supplier batch complaint cluster
High return rate for size M
```

---

# 126. Quality Metrics

Core categories:

```text id="qc077"
INCOMING
PRODUCTION
FULFILLMENT
CUSTOMER
COST
```

---

# 127. Incoming Metrics

Examples:

```text id="qc078"
Supplier Defect Rate
Receiving Reject Rate
Supplier Claim Rate
```

---

# 128. Production Metrics

```text id="qc079"
First-Pass Yield
Defect Rate
Rework Rate
Scrap Rate
```

---

# 129. Fulfillment Metrics

```text id="qc080"
Order Accuracy
Packing Error
Wrong SKU Rate
```

---

# 130. Customer Metrics

```text id="qc081"
Product Return Rate
Quality Complaint Rate
Replacement Rate
```

---

# 131. Quality Cost Metrics

```text id="qc082"
Rework Cost
Scrap Cost
Replacement Cost
Quality Failure Cost
```

---

# 132. Defect Rate

Must define denominator clearly:

```text id="qc083"
DEFECTIVE UNITS / INSPECTED UNITS
```

or another explicit basis.

---

# 133. First-Pass Yield

Canonical concept:

```text id="qc084"
UNITS PASSING WITHOUT REWORK
/
TOTAL PRODUCED
```

---

# 134. Claim Rate

Can be measured against:

- shipped units,
- orders.

Define consistently.

---

# 135. Quality Trend

Trend matters more than one isolated number.

---

# 136. Quality Thresholds

Exact numerical thresholds belong in:

```text id="qc085"
decision-thresholds.md
```

not hardcoded here.

---

# 137. Quality Gate

A workflow may stop automatically when:

```text id="qc086"
CRITICAL DEFECT
UNAPPROVED SPEC
QC FAIL
QUARANTINE
```

exists.

---

# 138. Quality Release

Canonical:

```text id="qc087"
QC PASS
→
RELEASE TO INVENTORY / FULFILLMENT
```

---

# 139. No Bypass by Deadline

Canonical:

> **A late good product is usually easier to recover from than an on-time knowingly defective product.**

Exceptions require explicit decision.

---

# 140. Quality vs Commercial Pressure

Sales cannot independently override critical quality failure.

---

# 141. Quality vs Margin

Cheap sourcing/production does not justify unacceptable defect rates.

---

# 142. Quality and Product Development

Repeated defects may indicate product design itself is too fragile or complex.

---

# 143. Design for Manufacturability

Studio/Product should consider:

```text id="qc088"
CAN THIS DESIGN BE PRODUCED CONSISTENTLY?
```

before launch.

---

# 144. Quality Feedback to Studio

Production failures should inform:

- artwork dimensions,
- placement,
- method choice,
- garment choice.

---

# 145. Quality Feedback to Sourcing

Garment/material failures inform supplier selection.

---

# 146. Quality Feedback to Production

Process failures inform recipe changes.

---

# 147. Quality Feedback to Catalog

Products with persistent quality issues may be paused/sunset.

---

# 148. Quality Feedback to Finance

Failure costs must be visible in actual economics.

---

# 149. Quality Feedback to Partner Program

Partner performance should influence routing.

---

# 150. Quality Feedback to Customer Service

Support should know:

- known issue,
- affected batch,
- approved resolution.

---

# 151. Quality Documentation

Potential:

```text id="qc089"
QC CHECKLIST
QC RESULT
NCR
DEFECT PHOTO
CAPA
CONCESSION
```

---

# 152. Evidence

For significant failure, attach:

- photos,
- measurements,
- batch details.

---

# 153. Photo Standard

Quality photos should be clear enough to support decision.

No need excessive documentation for trivial issues.

---

# 154. QC Result Record

Minimum:

```text id="qc090"
QC ID
Object / Batch
Inspector
Date
Sample Qty
Pass Qty
Fail Qty
Defects
Decision
```

---

# 155. Nonconformance Record

Should remain linked to original production/supplier object.

---

# 156. Concession Record

Must not disappear after fulfillment.

Useful for future learning.

---

# 157. Quality Audit Trail

Significant quality decisions should retain:

```text id="qc091"
WHO
WHAT
WHEN
WHY
```

---

# 158. MGBOS Quality Entities

Core:

```text id="qc092"
QC PROFILE
QC INSPECTION
QC RESULT
DEFECT
NCR
CONCESSION
CAPA
QUALITY ALERT
```

---

# 159. QC Profile Entity

Defines how an object is inspected.

---

# 160. QC Inspection Entity

Represents actual inspection event.

---

# 161. Defect Entity

Represents observed nonconformance.

---

# 162. NCR Entity

Groups significant issue.

---

# 163. CAPA Entity

Tracks corrective/preventive actions.

---

# 164. Quality Lineage

Canonical:

```text id="qc093"
SUPPLIER / MATERIAL
↓
PRODUCTION JOB
↓
BATCH
↓
QC
↓
SHIPMENT
↓
CUSTOMER FEEDBACK
```

---

# 165. Quality Event Model

Potential:

```text id="qc094"
qc.inspection_started
qc.passed
qc.failed
inventory.quarantined
ncr.created
capa.opened
capa.closed
```

---

# 166. Automation Opportunities

Potential:

```text id="qc095"
QC Checklist Generation
Sampling Recommendation
Defect Trend Alert
Supplier Quality Alert
Batch Hold
CAPA Reminder
```

---

# 167. Automatic Hold

Critical defect may automatically:

```text id="qc096"
BLOCK INVENTORY
```

within deterministic rules.

---

# 168. AI Role

AI may assist:

```text id="qc097"
Defect Classification
Photo Review Assistance
Complaint Clustering
Root-Cause Summaries
Quality Trend Analysis
```

---

# 169. AI QC Boundary

AI should not silently release failed product.

---

# 170. Computer Vision

Future use cases:

```text id="qc098"
PLACEMENT CHECK
PRINT DEFECT
COLOR VARIATION
VISIBLE GARMENT DEFECT
```

when data/accuracy justify it.

---

# 171. AI Root Cause

AI may suggest likely causes.

Root cause remains an evidence-based operational conclusion.

---

# 172. Quality Automation Maturity

```text id="qc099"
LEVEL 0
Visual inspection by memory

LEVEL 1
Checklists + references

LEVEL 2
Digital QC records + defect taxonomy

LEVEL 3
Trend alerts + partner linkage

LEVEL 4
Automated inspection assistance

LEVEL 5
Predictive quality / exception orchestration
```

---

# 173. Current Recommended V1

Start with:

```text id="qc100"
PRODUCT QC PROFILE
+
GOLDEN SAMPLE WHERE NEEDED
+
INCOMING QC
+
FIRST ARTICLE
+
FINAL QC
+
DEFECT RECORD
+
QUARANTINE
```

---

# 174. V1 Inspection Strategy

Use:

```text id="qc101"
100% CHECK
for small/high-risk custom output

RISK-BASED SAMPLE
for repeatable larger batches
```

---

# 175. V1 Defect Classes

Use:

```text id="qc102"
CRITICAL
MAJOR
MINOR
```

with simple examples per process.

---

# 176. V1 Avoid

Do not immediately build:

```text id="qc103"
complex statistical SPC
machine vision everywhere
full ISO-style bureaucracy
hundreds of quality codes
```

before operational need.

---

# 177. V2 Expansion

Possible:

```text id="qc104"
FORMAL SAMPLING TABLES
DEFECT LIBRARY
SUPPLIER QUALITY DASHBOARD
CAPA
BATCH TRACEABILITY
```

---

# 178. V3 Expansion

Possible:

```text id="qc105"
AUTOMATIC QUALITY HOLDS
COMPUTER VISION ASSISTANCE
PROCESS CAPABILITY ANALYSIS
```

---

# 179. V4 Expansion

Possible:

```text id="qc106"
PREDICTIVE QUALITY
REAL-TIME PROCESS MONITORING
AUTOMATED ROUTING BASED ON QUALITY RISK
```

---

# 180. Quality Standard Creation Gate

Create formal standard when product/process is:

```text id="qc107"
REPEATABLE
CUSTOMER-IMPORTANT
QUALITY-SENSITIVE
```

---

# 181. Enhanced Inspection Gate

Use stronger QC when:

```text id="qc108"
NEW SUPPLIER
NEW PROCESS
NEW PRODUCT
RECENT FAILURE
HIGH-VALUE ORDER
```

---

# 182. Reduced Inspection Gate

May reduce inspection only after:

```text id="qc109"
STABLE HISTORY
+
LOW DEFECT
+
GOOD TRACEABILITY
```

---

# 183. Partner Probation Gate

Partner may move to probation when quality trend materially deteriorates.

---

# 184. Production Hold Gate

Hold production when:

```text id="qc110"
CRITICAL DEFECT
REPEAT SYSTEMIC DEFECT
UNCLEAR SPEC
```

makes continuation unsafe/unwise.

---

# 185. Product Hold Gate

Pause product sale when evidence suggests broad unresolved defect risk.

---

# 186. CAPA Gate

Formal corrective action is warranted when:

```text id="qc111"
REPEAT FAILURE
HIGH COST
HIGH CUSTOMER IMPACT
SYSTEMIC RISK
```

---

# 187. Quality Failure Modes

## Inspecting Without Spec

Subjective chaos.

## Final QC Only

Defects detected too late.

## No Quarantine

Bad stock returns to flow.

## Every Defect Treated the Same

Resources misallocated.

## Rework Hidden

Process looks artificially healthy.

## Customer Complaint Not Linked to Batch

No learning.

## Vendor Blame Without Root Cause

No system improvement.

## Quality Data Not Used in Routing

Bad partners keep getting work.

---

# 188. What Quality Control Must Not Become

## Bureaucracy Theater

Documents must improve decisions.

## Inspector Policing Culture

Quality is process ownership, not one person's job.

## Deadline Override System

Known bad quality should not flow silently.

## Vendor Blame System

Internal processes can fail too.

## Perfectionism Without Economics

Standards must match customer promise and product positioning.

---

# 189. Quality Success Definition

The Quality System succeeds when TeeStock can answer:

```text id="qc112"
WHAT IS ACCEPTABLE?

HOW DO WE CHECK IT?

WHAT FAILED?

HOW SERIOUS IS IT?

WHERE DID IT COME FROM?

WHICH BATCH / ORDER IS AFFECTED?

WHAT DO WE DO WITH IT?

HOW MUCH DID IT COST?

HOW DO WE STOP IT HAPPENING AGAIN?
```

---

# 190. Canonical Quality Summary

```text id="qc113"
SPEC
defines acceptable.

SOURCE QC
protects inputs.

PROCESS QC
catches drift early.

FINAL QC
protects release.

TRACEABILITY
finds origin.

NCR
records failure.

CAPA
prevents recurrence.

CUSTOMER FEEDBACK
tests reality.

MGBOS
connects the entire quality loop.
```

---

# 191. Canonical Quality Principles

```text id="qc114"
SPEC BEFORE INSPECTION.

PREVENT BEFORE DETECT.

FIRST ARTICLE BEFORE MASS RUN.

QUARANTINE BEFORE UNCERTAIN STOCK.

SEVERITY BEFORE RESPONSE.

TRACE BEFORE BLAME.

REWORK IS COST.

CUSTOMER COMPLAINT IS DATA.

REPEAT DEFECT IS A SYSTEM SIGNAL.

QUALITY DATA MUST CHANGE SOURCING AND ROUTING.

NO QC PASS, NO RELEASE.

BUILD QUALITY INTO THE PROCESS.
```

---

# 192. Dependency

Dokumen berikut harus follow Quality Control System:

1. [[bisnis/teestock/07-operations/inventory-system|inventory-system.md]]
2. [[bisnis/teestock/07-operations/order-fulfillment|order-fulfillment.md]]
3. [[bisnis/teestock/07-operations/customer-service|customer-service.md]]
4. [[bisnis/teestock/07-operations/returns-and-warranty|returns-and-warranty.md]]
5. [[bisnis/teestock/08-finance/unit-economics|unit-economics.md]]
6. [[bisnis/teestock/08-finance/cost-accounting|cost-accounting.md]]
7. [[bisnis/teestock/10-product-tech/automation-architecture|automation-architecture.md]]
8. [[bisnis/teestock/11-data-mgbos/canonical-data-model|canonical-data-model.md]]
9. [[bisnis/teestock/11-data-mgbos/event-model|event-model.md]]
10. [[bisnis/teestock/11-data-mgbos/mgbos-integration|mgbos-integration.md]]
11. [[bisnis/teestock/13-metrics-experiments/kpi-framework|kpi-framework.md]]
12. [[bisnis/teestock/13-metrics-experiments/decision-thresholds|decision-thresholds.md]]

TeeStock Quality System boleh berkembang menjadi semakin statistical dan automated, tetapi advanced QC hanya boleh dibangun di atas product specifications, defect taxonomy, traceability, reliable QC records, root-cause discipline, dan clear release authority.