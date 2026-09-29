---
title: "TeeStock Experimentation Framework"
date: "2026-09-28"
bisnis: teestock
kategori: riset
status: active
tags:
  - bisnis/teestock
  - kategori/riset
  - teestock/canonical
  - teestock/metrics-experiments
document_id: "TS-MET-002"
version: "1.0"
category: "metrics-experiments"
business: "teestock"
last_updated: "2026-09-28"
path: "13-metrics-experiments/experimentation-framework.md"
depends_on:
  - "TS-MET-001"
  - "TS-DAT-004"
  - "TS-DAT-006"
  - "TS-STR-004"
  - "TS-MKT-001"
  - "TS-MKT-003"
  - "TS-FIN-002"
  - "TS-TEC-006"
---


# TeeStock Experimentation Framework v1.0

> [!tip] **Canonical TeeStock Hypothesis, Experiment Design, Pilot, Measurement, Rollout & Organizational Learning Framework**
>
> [!info] **Dependencies & Data Flow (SSOT)**
> [[bisnis/teestock/13-metrics-experiments/kpi-framework|TS-MET-001: TeeStock KPI Framework]] • [[bisnis/teestock/11-data-mgbos/event-model|TS-DAT-004: TeeStock Event Model]] • [[bisnis/teestock/11-data-mgbos/analytics-model|TS-DAT-006: TeeStock Analytics Model]] • [[bisnis/teestock/01-strategy/growth-strategy|TS-STR-004: TeeStock Growth Strategy]] • [[bisnis/teestock/09-marketing/go-to-market|TS-MKT-001: TeeStock Go-To-Market Strategy]] • [[bisnis/teestock/09-marketing/content-engine|TS-MKT-003: TeeStock Content Engine]] • [[bisnis/teestock/08-finance/unit-economics|TS-FIN-002: TeeStock Unit Economics]] • [[bisnis/teestock/10-product-tech/automation-architecture|TS-TEC-006: TeeStock Automation Architecture]]


Dokumen ini mendefinisikan bagaimana TeeStock merancang, menjalankan, mengukur, menghentikan, memperluas, mendokumentasikan, dan mempelajari eksperimen pada Product, Commerce, Pricing, Marketing, Operations, Creator, Partner, Automation, AI, dan business-model assumptions.

---

# 1. Purpose

Experimentation Framework menjawab:

> **Bagaimana TeeStock menguji asumsi penting dengan risiko dan biaya yang terkendali sebelum mengubahnya menjadi sistem, inventory, campaign besar, automation permanen, atau keputusan bisnis skala penuh?**

Canonical principle:

> **Test assumptions before scaling commitments.**

---

# 2. Canonical Definition

> **TeeStock Experimentation Framework adalah governed learning system yang mengubah uncertain business assumptions menjadi explicit hypotheses, controlled tests, measurable outcomes, decision rules, and reusable organizational learning sebelum resources, capital, processes, or automation ditingkatkan skalanya.**

---

# 3. Experiment ≠ Random Activity

Canonical:

```text id="exp001"
CHANGE
+
MEASUREMENT
≠
automatically EXPERIMENT
```

A meaningful experiment needs:

```text id="exp002"
HYPOTHESIS
INTERVENTION
MEASUREMENT
DECISION RULE
```

---

# 4. Experimentation Objective

The goal is not:

```text id="exp003"
RUN MORE TESTS
```

The goal is:

```text id="exp004"
REDUCE IMPORTANT UNCERTAINTY
BEFORE EXPENSIVE COMMITMENT
```

---

# 5. Experiment as Capital Discipline

Experiments help avoid:

```text id="exp005"
OVERPRODUCTION
BAD HIRES
BAD AUTOMATION
BAD CAMPAIGN SCALE
BAD PRODUCT BETS
BAD VENDOR COMMITMENTS
```

---

# 6. Learning Before Scale

Canonical:

```text id="exp006"
ASSUMPTION
↓
TEST
↓
EVIDENCE
↓
DECISION
↓
SCALE / ITERATE / STOP
```

---

# 7. Experiment Lifecycle

Canonical:

```text id="exp007"
OBSERVATION
↓
QUESTION
↓
HYPOTHESIS
↓
BASELINE
↓
DESIGN
↓
APPROVAL
↓
EXECUTION
↓
MEASUREMENT
↓
ANALYSIS
↓
DECISION
↓
LEARNING
```

---

# 8. Experiment Classes

Canonical:

```text id="exp008"
DISCOVERY TEST
VALIDATION TEST
OPTIMIZATION TEST
OPERATIONAL PILOT
AUTOMATION PILOT
AI EVALUATION
STRATEGIC BET
```

---

# 9. Discovery Test

Used when uncertainty is still broad.

Examples:

```text id="exp009"
CUSTOMER INTERVIEW
LANDING PAGE
WAITLIST
MANUAL OFFER
```

---

# 10. Validation Test

Tests whether a specific value proposition or business assumption holds.

---

# 11. Optimization Test

Improves an already functioning system.

Examples:

```text id="exp010"
CHECKOUT
PRODUCT PAGE
PRICING DISPLAY
EMAIL
```

---

# 12. Operational Pilot

Tests process before standardization.

---

# 13. Automation Pilot

Tests workflow before full automation.

---

# 14. AI Evaluation

Tests whether an AI-enabled task can meet required quality, reliability, cost, and risk boundaries.

---

# 15. Strategic Bet

Tests larger business direction with bounded exposure.

Example:

```text id="exp011"
NEW LABEL
NEW SERVICE
NEW CHANNEL
NEW CREATOR PROGRAM MODEL
```

---

# 16. Experiment vs Pilot

Canonical:

```text id="exp012"
EXPERIMENT
tests a hypothesis.

PILOT
tests viability in limited real operation.
```

A pilot can also be an experiment.

---

# 17. Experiment vs Rollout

```text id="exp013"
EXPERIMENT
learns.

ROLLOUT
deploys known-enough solution.
```

---

# 18. Experiment vs Launch

A launch may include experiment design.

But a full launch should not be mislabeled experiment merely because outcome is uncertain.

---

# 19. Experiment vs Research

Research learns about context.

Experiment changes something and observes outcomes.

---

# 20. Canonical Experiment Object

Potential:

```text id="exp014"
EXPERIMENT
├── Question
├── Hypothesis
├── Owner
├── Scope
├── Baseline
├── Intervention
├── Audience / Unit
├── Primary Metric
├── Guardrails
├── Duration
├── Decision Rule
├── Result
└── Learning
```

---

# 21. Experiment Question

Must express important uncertainty.

Example:

> Apakah free shipping threshold meningkatkan CM4 per session tanpa menaikkan refund rate secara material?

---

# 22. Bad Question

> Apakah campaign ini bagus?

Too vague.

---

# 23. Hypothesis

Canonical structure:

```text id="exp015"
IF
we change X

THEN
metric Y will move in direction Z

BECAUSE
reason R
```

---

# 24. Example

```text id="exp016"
IF
we simplify Custom quotation form

THEN
qualified form completion will increase

BECAUSE
customers face less unnecessary friction.
```

---

# 25. Hypothesis Must Be Falsifiable

Canonical.

A statement that cannot reasonably fail is not useful.

---

# 26. Bad Hypothesis

> Customers will like the new design.

---

# 27. Better

> Capsule A will generate a higher full-price sell-through rate than the current baseline within the defined launch window.

---

# 28. Assumption Register

Experiments should originate from explicit assumptions where possible.

---

# 29. Assumption Types

Potential:

```text id="exp017"
DESIRABILITY
VIABILITY
FEASIBILITY
USABILITY
OPERABILITY
SCALABILITY
```

---

# 30. Desirability

Do customers want it?

---

# 31. Viability

Can economics work?

---

# 32. Feasibility

Can TeeStock actually deliver it?

---

# 33. Usability

Can people use/understand the experience?

---

# 34. Operability

Can the organization repeatedly execute it?

---

# 35. Scalability

Does performance survive increased volume?

---

# 36. Risk-First Experimentation

Canonical:

> **Test the riskiest important assumption before polishing low-risk details.**

---

# 37. Example

Before building Creator Platform:

test whether creators actually want:

```text id="exp018"
MERCH BACKEND
+
ROYALTY MODEL
+
TEEStock FULFILLMENT
```

using manual workflow.

---

# 38. Before Automation

Test the process manually.

---

# 39. Before Inventory

Test demand.

---

# 40. Before Hiring

Test workload and process.

---

# 41. Before Vertical Integration

Test whether internal capability materially improves economics/control.

---

# 42. Baseline

Canonical:

> **Baseline defines current performance before the intervention.**

---

# 43. Baseline Examples

```text id="exp019"
CURRENT CONVERSION
CURRENT CM4
CURRENT CYCLE TIME
CURRENT QC PASS
CURRENT CAC
```

---

# 44. No Baseline

Makes improvement difficult to interpret.

---

# 45. Baseline Window

Should reflect normal enough behavior.

---

# 46. Seasonality

Avoid comparing:

```text id="exp020"
NORMAL WEEK
vs
MAJOR PROMOTION WEEK
```

without adjustment/context.

---

# 47. Baseline May Be Zero

For genuinely new initiative.

Then test against predefined viability threshold instead.

---

# 48. Experiment Unit

Canonical:

```text id="exp021"
WHAT ENTITY
is assigned/exposed?
```

Potential:

```text id="exp022"
SESSION
CUSTOMER
ORDER
PRODUCT
CREATOR
PARTNER
STORE
TIME PERIOD
```

---

# 49. Unit Matters

Wrong unit can contaminate results.

---

# 50. Example

Pricing experiment may need customer/session assignment rather than product-page-view assignment.

---

# 51. Exposure

Canonical:

> **An entity should only count as exposed if it actually encountered the intervention.**

---

# 52. Assignment ≠ Exposure

User assigned Variant B but never sees page:

not necessarily exposed.

---

# 53. Exposure Event

Potential:

```text id="exp023"
experiment.exposed
```

---

# 54. Experiment ID

Each experiment needs immutable canonical ID.

Recommended:

```text id="exp024"
EXP-{DOMAIN}-{NNN}
```

Example:

```text id="exp025"
EXP-COM-001
```

---

# 55. Experiment Version

If design materially changes mid-test:

create new version or restart.

---

# 56. Do Not Quietly Modify Active Experiment

Canonical.

---

# 57. Owner

Every experiment needs one accountable owner.

---

# 58. Collaborators

May span:

```text id="exp026"
PRODUCT
MARKETING
OPS
FINANCE
DATA
```

---

# 59. Owner Responsibility

Owner ensures:

```text id="exp027"
DESIGN
EXECUTION
MEASUREMENT
DECISION
DOCUMENTATION
```

---

# 60. Experiment Scope

Defines:

```text id="exp028"
AUDIENCE
CHANNEL
PRODUCT
REGION
TIME
```

as applicable.

---

# 61. Scope Reduction

Prefer smallest scope capable of answering the question.

---

# 62. Minimum Viable Test

Canonical:

> **Use the cheapest credible test that can materially reduce the uncertainty.**

---

# 63. Examples

Instead of producing 500 shirts:

```text id="exp029"
LANDING PAGE
+
PREORDER / WAITLIST
+
SMALL BATCH
```

may answer demand question.

---

# 64. Fake Door Test

Potential:

show proposed feature/offer before building it, then measure intent.

Must not intentionally deceive customer regarding actual availability.

---

# 65. Concierge Test

Deliver manually before automating.

---

# 66. Wizard-of-Oz Test

Customer sees product-like experience while backstage process remains manual.

Use transparently enough to avoid misleading commitments.

---

# 67. Prototype Test

Tests usability/interest without full system.

---

# 68. Small Batch Test

Useful for apparel/design validation.

---

# 69. Preorder Test

Useful for demand validation.

Must follow commerce/customer policy.

---

# 70. Quote Test

Useful for B2B service validation.

---

# 71. Manual Service Test

Useful before building automation or portal.

---

# 72. Channel Test

Test small campaign spend before scale.

---

# 73. Partner Pilot

Send controlled Work Orders before making strategic vendor dependency.

---

# 74. AI Shadow Mode

AI generates result but human continues current process.

Compare outcomes without production authority.

---

# 75. AI Recommendation Mode

AI recommends actions.

Human decides.

---

# 76. AI Assisted Execution Pilot

AI performs low-risk bounded tasks under review.

---

# 77. AI Autonomous Pilot

Only after prior stages demonstrate adequate reliability.

---

# 78. Experiment Metric Architecture

Every experiment should define:

```text id="exp030"
PRIMARY METRIC
SECONDARY METRICS
GUARDRAIL METRICS
DIAGNOSTIC METRICS
```

---

# 79. Primary Metric

The main outcome the experiment seeks to improve.

---

# 80. One Primary Metric Preferred

Avoid cherry-picking among 10 metrics.

---

# 81. Secondary Metrics

Provide additional interpretation.

---

# 82. Guardrail Metrics

Protect against harmful side effects.

---

# 83. Diagnostic Metrics

Help explain mechanism.

---

# 84. Example Checkout Test

```text id="exp031"
PRIMARY:
conversion

SECONDARY:
checkout completion time

GUARDRAIL:
CM4/order
refund rate

DIAGNOSTIC:
drop-off by step
```

---

# 85. Example Pricing Test

```text id="exp032"
PRIMARY:
CM4 / visitor

GUARDRAIL:
conversion
return rate

DIAGNOSTIC:
AOV
units/order
```

---

# 86. Example Operations Pilot

```text id="exp033"
PRIMARY:
cycle time

GUARDRAIL:
first-pass yield
rework cost

DIAGNOSTIC:
queue time
blocked time
```

---

# 87. Example Creator Pilot

```text id="exp034"
PRIMARY:
creator activation rate

GUARDRAIL:
operational workload
creator satisfaction / disputes

DIAGNOSTIC:
time to first live product
```

---

# 88. Example AI Pilot

```text id="exp035"
PRIMARY:
task success rate

GUARDRAIL:
critical error rate
human correction rate
cost

DIAGNOSTIC:
latency
tool failures
```

---

# 89. Metric Definitions Come From KPI/Semantic Layer

Do not redefine conversion differently inside experiment.

---

# 90. Experiment Metric Version

Record canonical metric version used.

---

# 91. Decision Rule

Canonical:

> **Define what result will lead to Scale, Iterate, Stop, or Investigate before seeing the outcome.**

---

# 92. Decision Outcomes

```text id="exp036"
SCALE
ITERATE
STOP
INCONCLUSIVE
INVESTIGATE
```

---

# 93. Scale

Evidence strong enough for controlled rollout.

---

# 94. Iterate

Signal promising, but solution/hypothesis needs refinement.

---

# 95. Stop

Evidence does not justify continued investment.

---

# 96. Inconclusive

Test cannot answer question reliably.

---

# 97. Investigate

Unexpected result requires analysis before decision.

---

# 98. Success Threshold

Must be defined pre-test where possible.

---

# 99. Minimum Detectable Improvement

For formal A/B tests, define practically meaningful effect.

---

# 100. Practical Significance

Canonical:

> **A statistically detectable improvement is not useful if the business impact is too small to matter.**

---

# 101. Statistical Significance

Important for sufficiently powered randomized experiments.

Not every experiment requires formal statistical inference.

---

# 102. A/B Test Gate

Use randomized controlled A/B testing when:

```text id="exp037"
SUFFICIENT TRAFFIC
REPEATABLE EXPOSURE
CLEAN ASSIGNMENT
MEASURABLE OUTCOME
```

exist.

---

# 103. Do Not A/B Test Tiny Samples

Canonical.

---

# 104. Low-Traffic Business

Use:

```text id="exp038"
PILOTS
PRE/POST
COHORT COMPARISON
QUALITATIVE RESEARCH
SMALL-BATCH VALIDATION
```

with honest uncertainty.

---

# 105. Formal Statistical Test

May become appropriate for high-volume:

```text id="exp039"
LANDING PAGE
CHECKOUT
EMAIL
ADS
```

---

# 106. Operational Pilots

Usually rely more on:

```text id="exp040"
BEFORE / AFTER
PROCESS EVIDENCE
QUALITY
COST
```

than classic A/B testing.

---

# 107. Experiment Duration

Set enough time to capture relevant cycle.

---

# 108. Too Short

Can overreact to noise.

---

# 109. Too Long

Wastes opportunity/capital.

---

# 110. Natural Cycle

Examples:

```text id="exp041"
PURCHASE CYCLE
RETURN WINDOW
PRODUCTION CYCLE
PAYOUT CYCLE
```

may determine duration.

---

# 111. Minimum Sample

Set before test when formal inference matters.

---

# 112. Do Not Stop Early Because Result Looks Good

Canonical for formal A/B tests unless approved sequential-testing method exists.

---

# 113. Early Stop for Harm

Always allowed when:

```text id="exp042"
CUSTOMER HARM
FINANCIAL LOSS
LEGAL RISK
SECURITY RISK
```

crosses safety boundary.

---

# 114. Early Stop Rule

Should be predefined for risky experiments.

---

# 115. Experiment Risk Levels

Canonical:

```text id="exp043"
R0 — REVERSIBLE / INTERNAL
R1 — LOW CUSTOMER IMPACT
R2 — MATERIAL CUSTOMER / ECONOMIC IMPACT
R3 — HIGH RISK / LEGAL / FINANCIAL
```

---

# 116. R0

Example:

internal dashboard layout.

---

# 117. R1

Example:

low-impact email subject test.

---

# 118. R2

Example:

pricing, fulfillment promise, creator economics.

---

# 119. R3

Examples:

```text id="exp044"
PAYMENT
REFUNDS
LEGAL RIGHTS
HIGH-RISK AI AUTHORITY
```

Require elevated approval.

---

# 120. Experiment Approval

Approval depth follows risk.

---

# 121. R0 Approval

Owner may self-approve under policy.

---

# 122. R1 Approval

Function owner.

---

# 123. R2 Approval

Cross-functional/business owner.

---

# 124. R3 Approval

Management + relevant Finance/Legal/Security owner.

---

# 125. Customer Harm Boundary

Experiments must not deliberately create:

```text id="exp045"
DECEPTIVE PRICING
UNFAIR DENIAL
UNSAFE PRODUCT
MATERIAL PRIVACY VIOLATION
```

for learning.

---

# 126. Ethical Principle

Canonical:

> **Uncertainty does not justify experimenting with basic customer rights or safety.**

---

# 127. Pricing Experiments

Can be run carefully where lawful and appropriate.

---

# 128. Pricing Experiment Must Track

```text id="exp046"
PRICE
CONVERSION
CM4
CUSTOMER SEGMENT
RETURN
```

---

# 129. No Discriminatory Pricing by Sensitive Traits

Canonical.

---

# 130. Promotion Experiment

Separate from permanent pricing strategy.

---

# 131. Product Experiment

Potential:

```text id="exp047"
DESIGN
FIT
COLOR
FABRIC
BUNDLE
PACKAGING
```

---

# 132. Apparel Design Validation

Recommended progression:

```text id="exp048"
CONCEPT
↓
MOCKUP
↓
CONTENT / INTEREST SIGNAL
↓
PREORDER / SMALL BATCH
↓
SELL-THROUGH
↓
SCALE
```

---

# 133. Do Not Confuse Likes with Demand

Canonical.

---

# 134. Stronger Demand Signals

Conceptually:

```text id="exp049"
EMAIL SIGNUP
ADD TO CART
PREORDER
PAID ORDER
REPEAT ORDER
```

increase in commitment strength.

---

# 135. Originals Experimentation

Collection incubation should use staged evidence.

---

# 136. Originals Test Ladder

```text id="exp050"
CONCEPT SIGNAL
↓
CAPSULE
↓
FULL-PRICE DEMAND
↓
REPEAT / FOLLOW-ON DEMAND
↓
LABEL DECISION
```

---

# 137. Collection Failure Is Learning

Do not hide unsuccessful capsule.

Record why.

---

# 138. Marketing Experimentation

Potential:

```text id="exp051"
MESSAGE
CREATIVE
AUDIENCE
OFFER
LANDING PAGE
CHANNEL
```

---

# 139. One Major Variable Preferred

To improve interpretability.

---

# 140. Multi-Variable Tests

Possible at sufficient scale/maturity.

Not default early.

---

# 141. Campaign Test Budget

Set maximum learning budget.

---

# 142. Learning Budget

Canonical:

> **Experiment spend is a budget to purchase evidence.**

---

# 143. Marketing Scale Gate

Do not materially scale spend until:

```text id="exp052"
CONVERSION
+
ECONOMICS
+
CUSTOMER QUALITY
```

are credible.

---

# 144. Channel Experiment

Test:

```text id="exp053"
DEMAND
CAC
CM4
RETENTION
OPERATING BURDEN
```

not CAC only.

---

# 145. New Marketplace Test

Include:

```text id="exp054"
FEES
OPERATIONS
RETURNS
SETTLEMENT
```

---

# 146. Services Experimentation

Potential:

```text id="exp055"
NEW OFFER
NEW PACKAGE
PRICING
QUOTE FLOW
LEAD QUALIFICATION
```

---

# 147. Service Offer Test

Before building full service:

```text id="exp056"
LANDING PAGE
↓
LEADS
↓
MANUAL SALES
↓
MANUAL DELIVERY
↓
ECONOMICS
```

---

# 148. B2B Pricing Test

Avoid uncontrolled price differences without clear commercial framework.

Use quote experiments with documented assumptions.

---

# 149. Partner Experimentation

Pilot before strategic dependency.

---

# 150. Partner Pilot Metrics

```text id="exp057"
QUALITY
LEAD TIME
COST
COMMUNICATION
RELIABILITY
```

---

# 151. Pilot Work Orders

Use limited:

```text id="exp058"
VOLUME
PRODUCT
CAPABILITY
```

---

# 152. Partner Scale Gate

Require:

```text id="exp059"
CAPABILITY VALIDATED
+
QUALITY
+
ON-TIME
+
ECONOMICS
```

---

# 153. Operations Experimentation

Potential:

```text id="exp060"
BATCHING
ROUTING
QC
PACKING
INVENTORY
SCHEDULING
```

---

# 154. Operational Test Risk

Never improve speed by silently weakening quality.

---

# 155. Automation Experimentation

Canonical progression:

```text id="exp061"
MANUAL BASELINE
↓
STANDARD PROCESS
↓
AUTOMATION SHADOW
↓
ASSISTED
↓
CONTROLLED EXECUTION
↓
SCALE
```

---

# 156. Automation Pilot Primary Metrics

Potential:

```text id="exp062"
TIME SAVED
SUCCESS RATE
ERROR RATE
```

---

# 157. Automation Guardrails

Potential:

```text id="exp063"
CUSTOMER ERROR
DUPLICATE ACTION
FINANCIAL ERROR
EXCEPTION RATE
```

---

# 158. Automation Success ≠ Workflow Runs Successfully

Canonical.

Business outcome matters.

---

# 159. AI Experimentation

AI requires additional evaluation.

---

# 160. AI Evaluation Dimensions

Canonical:

```text id="exp064"
TASK SUCCESS
ACCURACY
CRITICAL ERROR
HUMAN CORRECTION
LATENCY
COST
CONSISTENCY
```

---

# 161. AI Baseline

Compare AI against:

```text id="exp065"
HUMAN
RULE
CURRENT PROCESS
SIMPLER MODEL
```

---

# 162. Model Benchmark

More expensive model should justify its cost through material quality improvement.

---

# 163. Least Complex Reliable Model

Canonical.

---

# 164. AI Golden Test Set

Create representative historical/scenario tasks.

---

# 165. Golden Test Categories

Potential:

```text id="exp066"
NORMAL
EDGE CASE
AMBIGUOUS
ADVERSARIAL
HIGH-RISK
```

---

# 166. AI Critical Error

Define before evaluation.

Examples:

```text id="exp067"
INVENTS PRICE
INVENTS ORDER STATUS
AUTHORIZES PAYMENT
USES WRONG CUSTOMER DATA
```

---

# 167. Critical Error Rate

May matter more than average quality score.

---

# 168. AI Shadow Mode

Recommended before write authority.

---

# 169. AI Evaluation Progression

```text id="exp068"
OFFLINE TEST
↓
SHADOW
↓
RECOMMENDATION
↓
APPROVAL-REQUIRED EXECUTION
↓
LOW-RISK AUTONOMY
```

---

# 170. AI Rollback

Every production AI pilot needs clear disable/fallback path.

---

# 171. Model Change

New model/version can be treated as new experiment/regression evaluation.

---

# 172. Prompt Change

Material prompt/policy change can affect results.

Version when significant.

---

# 173. Tool Change

Agent evaluation should include tool behavior.

---

# 174. Agent Experiment

Test the full system:

```text id="exp069"
MODEL
+
PROMPT
+
CONTEXT
+
TOOLS
+
POLICY
```

not model alone.

---

# 175. Experiment Data Model

Core entities:

```text id="exp070"
Experiment
ExperimentVersion
Hypothesis
ExperimentVariant
ExperimentAssignment
ExperimentExposure
ExperimentMetric
ExperimentResult
ExperimentDecision
ExperimentLearning
```

---

# 176. Experiment

Top-level object.

---

# 177. Experiment Version

Exact design.

---

# 178. Variant

Potential:

```text id="exp071"
CONTROL
TREATMENT_A
TREATMENT_B
```

---

# 179. Control

Existing experience where appropriate.

---

# 180. Assignment

Links unit to intended variant.

---

# 181. Exposure

Records actual encounter.

---

# 182. Experiment Metric

Links canonical metric to role:

```text id="exp072"
PRIMARY
SECONDARY
GUARDRAIL
DIAGNOSTIC
```

---

# 183. Result

Stores measured outcome and uncertainty.

---

# 184. Decision

Stores:

```text id="exp073"
SCALE
ITERATE
STOP
INCONCLUSIVE
```

plus rationale.

---

# 185. Learning

Stores reusable insight.

---

# 186. Learning ≠ Result

Canonical.

Result:

> Variant B conversion +8%.

Learning:

> Removing optional account creation appears to reduce checkout friction for new visitors.

---

# 187. Learning Confidence

Potential:

```text id="exp074"
LOW
MEDIUM
HIGH
```

based on evidence quality.

---

# 188. Do Not Treat One Experiment as Universal Truth

Canonical.

---

# 189. Context Matters

Learning should record:

```text id="exp075"
AUDIENCE
TIME
CHANNEL
PRODUCT
```

---

# 190. Experiment Registry

MGBOS should eventually track:

```text id="exp076"
ID
TITLE
OWNER
STATUS
TYPE
RISK
PRIMARY KPI
START
END
DECISION
```

---

# 191. Experiment Status

Canonical:

```text id="exp077"
IDEA
DESIGNING
READY
RUNNING
PAUSED
COMPLETED
STOPPED
ANALYZED
ARCHIVED
```

---

# 192. Ready

Means:

```text id="exp078"
HYPOTHESIS
METRICS
DECISION RULE
RISK
INSTRUMENTATION
```

are complete.

---

# 193. Running

No unapproved material changes.

---

# 194. Paused

Temporary operational halt.

---

# 195. Stopped

Ended early according to decision/risk.

---

# 196. Completed

Data collection done.

---

# 197. Analyzed

Decision recorded.

---

# 198. Experiment Design Template

Canonical minimum:

```text id="exp079"
QUESTION
HYPOTHESIS
BASELINE
INTERVENTION
UNIT
SCOPE
PRIMARY METRIC
GUARDRAIL
DURATION
DECISION RULE
RISK
OWNER
```

---

# 199. Pre-Registration

For important tests, lock design before viewing outcome.

---

# 200. Why

Reduces:

```text id="exp080"
CHERRY PICKING
METRIC SWITCHING
RETROSPECTIVE STORYTELLING
```

---

# 201. Mid-Test Observation

Can monitor:

```text id="exp081"
DATA QUALITY
SYSTEM HEALTH
SAFETY
```

without repeatedly changing hypothesis.

---

# 202. Instrumentation Check

Before launch verify:

```text id="exp082"
ASSIGNMENT
EXPOSURE
OUTCOME
GUARDRAIL
```

are captured.

---

# 203. Broken Instrumentation

Pause or classify experiment invalid if material.

---

# 204. Missing Data

Do not treat as zero.

---

# 205. Sample Ratio Mismatch

For randomized experiments, unexpected allocation imbalance requires investigation.

---

# 206. Contamination

Occurs when control experiences treatment or vice versa.

---

# 207. Cross-Exposure

Example:

same customer sees both prices.

May invalidate test.

---

# 208. Experiment Isolation

Choose stable assignment key where needed.

---

# 209. Customer-Level Assignment

Useful when repeated sessions could create confusion.

---

# 210. Session Assignment

Useful for lower-stakes ephemeral experiences.

---

# 211. Product-Level Pilot

Useful for operational/product tests.

---

# 212. Time-Based Experiment

Use carefully.

External trends can confound before/after comparisons.

---

# 213. Cohort Comparison

Useful if randomization unavailable.

Document differences.

---

# 214. Qualitative Evidence

Potential:

```text id="exp083"
INTERVIEWS
SUPPORT CASES
SALES CALLS
USER OBSERVATION
```

---

# 215. Quantitative + Qualitative

Often stronger together.

---

# 216. Qualitative Evidence Is Not Statistical Proof

Canonical.

---

# 217. Experiment Analysis

Canonical:

```text id="exp084"
VALIDATE DATA
↓
MEASURE PRIMARY
↓
CHECK GUARDRAILS
↓
CHECK SEGMENTS
↓
INTERPRET
↓
DECIDE
```

---

# 218. Primary Metric First

Do not fish through segments for a convenient success story.

---

# 219. Segment Analysis

Useful after primary result.

---

# 220. Segment Findings

May become new hypothesis.

---

# 221. Multiple Comparisons

Advanced formal experiments should account for increased false-positive risk.

---

# 222. Early-Stage Simplicity

Do not overengineer statistical infrastructure before traffic requires it.

---

# 223. Decision Discipline

Canonical:

> **A failed hypothesis is a successful experiment if it prevented larger waste.**

---

# 224. Negative Result

Should not be hidden.

---

# 225. Inconclusive Result

Should not be reported as success.

---

# 226. Experiment Failure

Different from hypothesis failure.

Experiment failure means test design/execution could not answer question.

---

# 227. Learning Repository

Every completed material experiment enters Learning Registry.

---

# 228. Learning Registry Fields

Potential:

```text id="exp085"
EXPERIMENT
QUESTION
RESULT
DECISION
LEARNING
CONFIDENCE
REUSABLE FOR
```

---

# 229. Searchable Learning

Future teams/Jarvis should answer:

> Pernah tes free shipping sebelumnya?

---

# 230. Avoid Repeating Failed Experiments Blindly

Canonical.

---

# 231. Repeat Test

Valid when:

```text id="exp086"
CONTEXT CHANGED
DESIGN CHANGED
DATA QUALITY IMPROVED
```

---

# 232. Experiment-to-Decision Lineage

MGBOS should link:

```text id="exp087"
EXPERIMENT
→ DECISION
→ ROLLOUT / PROJECT
```

---

# 233. Example

```text id="exp088"
EXP-ORG-003
↓
Capsule validated
↓
Decision: scale
↓
Collection production plan
```

---

# 234. Rollout Plan

Successful experiment should not jump instantly to 100%.

---

# 235. Rollout Stages

Potential:

```text id="exp089"
10%
25%
50%
100%
```

where technically/operationally meaningful.

---

# 236. Rollout Monitoring

Continue guardrails during scale.

---

# 237. Rollback Criteria

Define.

---

# 238. Rollout ≠ Permanent Policy Yet

After stable performance, standardize.

---

# 239. Standardization

Canonical:

```text id="exp090"
EXPERIMENT
↓
ROLLOUT
↓
VALIDATED OPERATION
↓
SOP / RULE / AUTOMATION
```

---

# 240. Automation After Standardization

Consistent with TeeStock operating principle:

```text id="exp091"
MANUAL
↓
LEARN
↓
STANDARDIZE
↓
MEASURE
↓
AUTOMATE
```

---

# 241. Experiment Portfolio

Not every experiment has equal value.

---

# 242. Prioritization Dimensions

Potential:

```text id="exp092"
EXPECTED IMPACT
UNCERTAINTY
COST
SPEED
RISK
```

---

# 243. High Uncertainty + High Impact

Strong experiment candidate.

---

# 244. Low Impact + High Effort

Usually deprioritize.

---

# 245. Experiment Backlog

Maintain separately from product feature backlog.

---

# 246. Experiment Priority Score

Can be used internally.

Avoid treating score as mathematical truth.

---

# 247. Learning Velocity

Potential management metric:

```text id="exp093"
material assumptions resolved
per period
```

but do not incentivize meaningless experiment volume.

---

# 248. Experiment Count Is Not KPI

Canonical.

---

# 249. Founder Role

Founder should focus experimentation on:

```text id="exp094"
BUSINESS MODEL
CAPITAL
PRODUCT-MARKET
CHANNEL
STRATEGIC CAPABILITY
```

uncertainties.

---

# 250. Functional Experiment Ownership

Marketing:

```text id="exp095"
CREATIVE
CHANNEL
FUNNEL
```

Product:

```text id="exp096"
UX
OFFER
ASSORTMENT
```

Operations:

```text id="exp097"
PROCESS
ROUTING
QC
```

Finance:

```text id="exp098"
PAYMENT TERMS
COLLECTION
ECONOMICS MODELS
```

within controls.

---

# 251. Cross-Functional Experiments

Need shared design when intervention crosses domains.

---

# 252. Example Free Shipping

Affects:

```text id="exp099"
MARKETING
COMMERCE
FINANCE
FULFILLMENT
```

---

# 253. Experiment Budget

Each material test should have maximum:

```text id="exp100"
CASH
INVENTORY
TIME
CUSTOMER EXPOSURE
```

---

# 254. Stop-Loss

Especially for:

```text id="exp101"
PAID MEDIA
INVENTORY
PRICING
AUTOMATION
```

---

# 255. Inventory Experiment Budget

Cap units/value.

---

# 256. Campaign Experiment Budget

Cap spend.

---

# 257. AI Experiment Budget

Cap:

```text id="exp102"
MODEL COST
TOOL ACTIONS
RUNS
```

---

# 258. Partner Pilot Budget

Cap commitment volume.

---

# 259. Documentation Proportionality

Low-risk test:

short experiment record.

High-risk strategic test:

full design/review.

---

# 260. Do Not Turn Every Small Change Into Bureaucracy

Canonical.

---

# 261. Experiment Governance Levels

```text id="exp103"
LIGHT
STANDARD
CONTROLLED
```

---

# 262. Light

Reversible internal/low-risk.

---

# 263. Standard

Customer-facing but bounded.

---

# 264. Controlled

Material financial/legal/security/customer risk.

---

# 265. Experiment Review

Standard and Controlled experiments receive pre-launch review.

---

# 266. Experiment Audit Trail

Store:

```text id="exp104"
CREATOR
APPROVER
DESIGN VERSION
START / END
DECISION
```

---

# 267. Experiment Events

Potential:

```text id="exp105"
experiment.created
experiment.approved
experiment.started
experiment.exposed
experiment.paused
experiment.completed
experiment.stopped
experiment.decision_recorded
```

---

# 268. Experiment Analytics

Consumes canonical events/metrics.

---

# 269. Experiment Should Not Create Alternate Metric Truth

Canonical.

---

# 270. MGBOS Experiment Control Center

Potential:

```text id="exp106"
RUNNING
AWAITING DECISION
HIGH RISK
FAILED INSTRUMENTATION
READY TO SCALE
```

---

# 271. Experiment Detail

Potential:

```text id="exp107"
HYPOTHESIS
VARIANTS
METRICS
STATUS
RESULT
DECISION
LEARNING
```

---

# 272. Jarvis Experiment Role

Jarvis can:

```text id="exp108"
SEARCH PRIOR TESTS
DRAFT HYPOTHESIS
IDENTIFY METRICS
SUMMARIZE RESULTS
COMPARE SEGMENTS
```

---

# 273. Jarvis Can Suggest Experiment

Based on detected uncertainty.

---

# 274. Jarvis Should Retrieve Prior Learning First

Before proposing duplicate test.

---

# 275. Jarvis Experiment Design

May assist but should not silently choose:

```text id="exp109"
CUSTOMER RISK
STATISTICAL STANDARD
FINANCIAL BUDGET
```

without authorized policy.

---

# 276. Jarvis Result Analysis

Should distinguish:

```text id="exp110"
OBSERVED RESULT
UNCERTAINTY
INTERPRETATION
RECOMMENDATION
```

---

# 277. Jarvis Must Not Turn Correlation Into Causation

Canonical.

---

# 278. Experiment Recommendation

AI recommendation remains advisory unless rollout permission granted.

---

# 279. Experiment Knowledge Graph

Future:

```text id="exp111"
ASSUMPTION
→ EXPERIMENT
→ RESULT
→ LEARNING
→ DECISION
```

---

# 280. Strategic Memory

This becomes institutional knowledge independent of founder memory.

---

# 281. Experiment Maturity Model

```text id="exp112"
LEVEL 0
Ad hoc changes

LEVEL 1
Documented hypotheses

LEVEL 2
Metric-driven pilots

LEVEL 3
Controlled A/B testing + learning registry

LEVEL 4
Automated experiment platform

LEVEL 5
AI-assisted learning system
```

---

# 282. Level 0

Anti-goal:

```text id="exp113"
change something
↓
sales changed
↓
assume causation
```

---

# 283. Level 1

Require:

```text id="exp114"
HYPOTHESIS
METRIC
DECISION
```

---

# 284. Level 2

Add:

```text id="exp115"
BASELINE
GUARDRAIL
EXPOSURE
LEARNING
```

---

# 285. Level 3

Add:

```text id="exp116"
RANDOMIZATION
STATISTICAL TESTING
EXPERIMENT REGISTRY
```

where volume supports.

---

# 286. Level 4

Add:

```text id="exp117"
FEATURE FLAGS
AUTOMATED ASSIGNMENT
EXPERIMENT ANALYTICS
```

---

# 287. Level 5

Jarvis can identify uncertain assumptions, find previous evidence, propose bounded experiments, and summarize learning.

Human management retains authority for material bets.

---

# 288. Current Recommended Stage

TeeStock should target:

```text id="exp118"
LEVEL 1
→
LEVEL 2
```

first.

---

# 289. V1 Experiment Priorities

Recommended:

```text id="exp119"
PRODUCT DEMAND
PRICING / OFFER
LANDING PAGE
LEAD QUALIFICATION
CHANNEL
CREATOR MODEL
PARTNER PILOT
OPERATING PROCESS
AUTOMATION
```

---

# 290. V1 Product Experiments

Use:

```text id="exp120"
MOCKUP
SMALL BATCH
PREORDER
CONTENT SIGNAL
```

---

# 291. V1 Marketing Experiments

Use bounded campaign tests.

---

# 292. V1 Services Experiments

Use manual delivery before software/platform investment.

---

# 293. V1 Automation Experiments

Run shadow/manual comparison.

---

# 294. V1 AI Experiments

Use offline golden tests + shadow mode.

---

# 295. V1 Documentation

One structured Experiment Record per material test.

---

# 296. V1 Avoid

Do not immediately build:

```text id="exp121"
CUSTOM EXPERIMENTATION PLATFORM
MULTIVARIATE ENGINE
BANDIT ALGORITHMS
AUTONOMOUS AI EXPERIMENTATION
```

---

# 297. V2 Expansion

Potential:

```text id="exp122"
FEATURE FLAGS
EXPOSURE TRACKING
FORMAL A/B TESTS
LEARNING REGISTRY
```

---

# 298. V3 Expansion

Potential:

```text id="exp123"
POWER CALCULATION
SEQUENTIAL TESTING
EXPERIMENT DASHBOARD
```

---

# 299. V4 Expansion

Potential:

```text id="exp124"
AUTOMATED ROLLOUT
ANOMALY GUARDRAILS
```

---

# 300. V5 Expansion

Potential:

```text id="exp125"
JARVIS EXPERIMENT ASSISTANT
+
ORGANIZATIONAL LEARNING GRAPH
```

---

# 301. Experiment Creation Gate

Require:

```text id="exp126"
IMPORTANT UNCERTAINTY
+
TESTABLE HYPOTHESIS
+
MEASURABLE OUTCOME
```

---

# 302. Launch Gate

Require:

```text id="exp127"
DESIGN COMPLETE
+
INSTRUMENTATION
+
DECISION RULE
+
RISK APPROVAL
```

---

# 303. Scale Gate

Require:

```text id="exp128"
PRIMARY METRIC ACCEPTABLE
+
GUARDRAILS ACCEPTABLE
+
DATA VALID
+
ECONOMICS VIABLE
```

---

# 304. Automation Scale Gate

Additionally require:

```text id="exp129"
ERROR RATE ACCEPTABLE
+
EXCEPTION PATH
+
ROLLBACK
```

---

# 305. AI Autonomy Gate

Additionally require:

```text id="exp130"
CRITICAL ERROR BELOW THRESHOLD
+
TOOL PERMISSIONS
+
AUDIT
+
ESCALATION
+
KILL SWITCH
```

---

# 306. Experiment Stop Gate

Stop when:

```text id="exp131"
HARM THRESHOLD BREACHED
OR
DECISION ALREADY CLEAR
OR
TEST INVALID
```

under defined rules.

---

# 307. Experiment Success Definition

The framework succeeds when TeeStock can answer:

```text id="exp132"
WHAT
are we uncertain about?

WHAT
do we believe?

WHAT EVIDENCE
would change our decision?

WHAT
are we testing?

WHO
is exposed?

WHAT
is the primary metric?

WHAT
must not get worse?

HOW MUCH
are we willing to spend?

WHEN
will we stop?

WHAT
did we learn?

WHAT
did we decide?

DID WE
scale, iterate, or stop?

CAN FUTURE TEAMS
find this learning?

CAN JARVIS
reuse this evidence instead of guessing?
```

---

# 308. Canonical Experiment Summary

```text id="exp133"
ASSUMPTION
creates uncertainty.

HYPOTHESIS
makes belief explicit.

EXPERIMENT
creates evidence.

PRIMARY METRIC
tests outcome.

GUARDRAIL
protects the business.

DECISION RULE
prevents storytelling.

RESULT
records what happened.

LEARNING
captures what it means.

DECISION
turns learning into action.

MGBOS
preserves the process.

JARVIS
helps reuse organizational learning.
```

---

# 309. Canonical Experimentation Principles

```text id="exp134"
TEST ASSUMPTIONS BEFORE SCALING COMMITMENTS.

THE GOAL IS LEARNING, NOT EXPERIMENT COUNT.

TEST THE RISKIEST IMPORTANT ASSUMPTION FIRST.

USE THE CHEAPEST CREDIBLE TEST.

DEFINE THE HYPOTHESIS BEFORE THE RESULT.

DEFINE THE PRIMARY METRIC BEFORE THE RESULT.

DEFINE GUARDRAILS BEFORE THE RESULT.

DEFINE THE DECISION RULE BEFORE THE RESULT.

A FAILED HYPOTHESIS CAN BE A SUCCESSFUL EXPERIMENT.

INCONCLUSIVE IS NOT SUCCESS.

LIKES ARE WEAKER EVIDENCE THAN PURCHASE COMMITMENT.

PILOT BEFORE PERMANENT PROCESS.

MANUAL BEFORE AUTOMATION.

SHADOW MODE BEFORE AI AUTHORITY.

PRACTICAL SIGNIFICANCE MATTERS, NOT ONLY STATISTICAL SIGNIFICANCE.

DO NOT A/B TEST WHEN TRAFFIC CANNOT SUPPORT IT.

DO NOT SACRIFICE CUSTOMER RIGHTS OR SAFETY FOR LEARNING.

NEGATIVE RESULTS SHOULD BE PRESERVED.

EVERY MATERIAL EXPERIMENT SHOULD PRODUCE A DECISION AND A LEARNING RECORD.

EXPERIMENTS SHOULD EVENTUALLY CONNECT ASSUMPTION → EVIDENCE → DECISION → ROLLOUT.

AI MAY HELP DESIGN AND ANALYZE EXPERIMENTS. GOVERNED HUMANS OWN MATERIAL BUSINESS DECISIONS.
```

---

# 310. Dependency

Dokumen berikut harus follow Experimentation Framework:

1. [[bisnis/teestock/13-metrics-experiments/decision-thresholds|decision-thresholds.md]]
2. [[bisnis/teestock/14-roadmap/master-roadmap|master-roadmap.md]]
3. [[bisnis/teestock/14-roadmap/capability-roadmap|capability-roadmap.md]]
4. [[bisnis/teestock/14-roadmap/current-quarter|current-quarter.md]]

TeeStock Experimentation Framework boleh berkembang dari simple documented pilots menjadi controlled A/B testing, feature flags, automated exposure tracking, AI evaluation suites, automated rollout guardrails, dan akhirnya Jarvis-assisted organizational learning system. Namun sophistication hanya boleh bertambah setelah hypothesis discipline, canonical metrics, exposure tracking, decision rules, negative-result preservation, and management accountability sudah menjadi kebiasaan operasi.