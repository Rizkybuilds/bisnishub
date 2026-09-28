---
title: "TeeStock Customer Service System"
document_id: "TS-OPS-007"
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
  - "TS-SVC-001"
  - "TS-OPS-001"
  - "TS-OPS-004"
  - "TS-OPS-005"
  - "TS-OPS-006"
---

# TeeStock Customer Service System v1.0

> **Canonical TeeStock Customer Operations, Support & Service Recovery Framework**  
> Dokumen ini mendefinisikan Customer Case, contact reasons, priority, severity, SLA, ownership, escalation, unified customer context, communication standards, complaint handling, service recovery, compensation authority, proactive communication, customer satisfaction, root-cause feedback, AI assistance, dan progressive automation untuk TeeStock.

---

# 1. Purpose

Customer Service System menjawab:

> **Bagaimana TeeStock membantu customer secara cepat, jelas, konsisten, dan dapat ditelusuri ketika customer memiliki pertanyaan, masalah, perubahan, complaint, atau membutuhkan resolution?**

Canonical principle:

> **Resolve the customer problem. Capture the operational lesson.**

---

# 2. Canonical Definition

> **TeeStock Customer Service adalah operating system yang mengubah customer interactions menjadi structured Customer Cases yang memiliki context, ownership, status, priority, SLA, resolution, dan operational feedback sehingga customer mendapatkan penyelesaian yang jelas dan TeeStock dapat memperbaiki akar masalah di balik support demand.**

---

# 3. Customer Service Is Not Chat

Critical distinction:

```text id="cs001"
CHAT
communication channel.

CUSTOMER CASE
canonical support object.
```

WhatsApp, DM, email, marketplace chat, dan website support hanyalah channels.

---

# 4. Customer Service Is Not Only Complaint Handling

Customer Service dapat menangani:

```text id="cs002"
PRE-PURCHASE QUESTION
ORDER STATUS
PRODUCT QUESTION
CUSTOMIZATION
PAYMENT
DELIVERY
RETURN
QUALITY
ACCOUNT
COMPLAINT
```

---

# 5. Strategic Role

Customer Service protects:

```text id="cs003"
CUSTOMER TRUST
RETENTION
REPUTATION
OPERATING VISIBILITY
QUALITY LEARNING
```

---

# 6. Customer Service as Sensor

Canonical:

> **Repeated customer questions reveal system friction. Repeated complaints reveal system failure.**

Customer Service is operational intelligence.

---

# 7. Core Philosophy

```text id="cs004"
UNDERSTAND
↓
OWN
↓
RESOLVE
↓
COMMUNICATE
↓
LEARN
```

---

# 8. Customer Support Architecture

Canonical:

```text id="cs005"
CUSTOMER CONTACT
↓
IDENTIFY CUSTOMER
↓
IDENTIFY CONTEXT
↓
CREATE / LINK CASE
↓
CLASSIFY
↓
PRIORITIZE
↓
RESOLVE / ESCALATE
↓
COMMUNICATE
↓
CLOSE
↓
FEEDBACK LOOP
```

---

# 9. Customer Identity

Support should operate from canonical:

```text id="cs006"
CUSTOMER ACCOUNT / PROFILE
```

where available.

---

# 10. One Customer Identity

A customer may contact through:

```text id="cs007"
WHATSAPP
EMAIL
MARKETPLACE
WEBSITE
SOCIAL
```

but should not become five unrelated customer records.

---

# 11. Customer Context

Support should ideally see:

```text id="cs008"
CUSTOMER
ORDERS
PAYMENTS
SHIPMENTS
RETURNS
PAST CASES
PROGRAM / ACCOUNT RELATIONSHIP
```

as relevant.

---

# 12. Context Before Reply

Canonical:

> **Do not ask the customer for information the system already reliably knows.**

---

# 13. Customer Case

Canonical:

> **Customer Case adalah structured record representing one support problem, request, or question requiring tracking and resolution.**

---

# 14. Case Minimum Fields

```text id="cs009"
Case ID
Customer
Contact Channel
Reason
Related Object
Priority
Status
Owner
Created At
SLA
Resolution
```

---

# 15. Related Object

Case may link to:

```text id="cs010"
ORDER
ORDER ITEM
SHIPMENT
PAYMENT
RETURN
PRODUCT
PROJECT
```

---

# 16. One Case, One Primary Problem

Avoid one giant conversation combining unrelated issues.

Create separate cases when operationally distinct.

---

# 17. Conversation vs Case

A Case may contain:

```text id="cs011"
MULTIPLE MESSAGES
```

across time/channels.

---

# 18. Contact Reasons

Canonical high-level taxonomy:

```text id="cs012"
PRODUCT
ORDER
PAYMENT
PRODUCTION
DELIVERY
RETURN
QUALITY
ACCOUNT
PROGRAM
GENERAL
```

---

# 19. Product Contact

Examples:

```text id="cs013"
SIZE
MATERIAL
FIT
AVAILABILITY
CARE
```

---

# 20. Order Contact

Examples:

```text id="cs014"
ORDER STATUS
CHANGE REQUEST
CANCELLATION
MISSING ITEM
```

---

# 21. Payment Contact

Examples:

```text id="cs015"
PAYMENT FAILED
DUPLICATE PAYMENT
INVOICE
REFUND STATUS
```

---

# 22. Production Contact

Primarily Custom/Business/Merch:

```text id="cs016"
ARTWORK
PRODUCTION STATUS
APPROVAL
DEADLINE
```

---

# 23. Delivery Contact

Examples:

```text id="cs017"
TRACKING
DELAY
FAILED DELIVERY
LOST PACKAGE
ADDRESS
```

---

# 24. Return Contact

Examples:

```text id="cs018"
RETURN REQUEST
EXCHANGE
REFUND
REPLACEMENT
```

---

# 25. Quality Contact

Examples:

```text id="cs019"
DEFECT
PRINT FAILURE
WRONG SIZE LABEL
DAMAGE
```

---

# 26. Account Contact

Examples:

```text id="cs020"
LOGIN
PROFILE
ADDRESS
ORDER HISTORY
```

---

# 27. Program Contact

For external participants:

```text id="cs021"
CREATOR
RESELLER
PARTNER
AFFILIATE
```

though mature systems may later use dedicated Program Ops support queues.

---

# 28. Contact Reason Taxonomy

Taxonomy should be:

```text id="cs022"
SMALL ENOUGH
to remain usable.

DETAILED ENOUGH
to reveal recurring problems.
```

---

# 29. Case Status

Canonical:

```text id="cs023"
OPEN
ASSIGNED
WAITING_INTERNAL
WAITING_CUSTOMER
RESOLVED
CLOSED
```

Possible:

```text id="cs024"
ESCALATED
CANCELLED
```

where useful.

---

# 30. Open

Case received but not yet actively owned/resolved.

---

# 31. Assigned

Clear owner exists.

---

# 32. Waiting Internal

Support needs action/information from another team/system.

---

# 33. Waiting Customer

Customer response/input is required.

---

# 34. Escalated

Issue exceeds normal support authority/capability.

---

# 35. Resolved

A solution has been provided/implemented.

---

# 36. Closed

No further expected action remains.

---

# 37. Resolved vs Closed

Canonical:

```text id="cs025"
RESOLVED
solution delivered.

CLOSED
case lifecycle finished.
```

---

# 38. Case Ownership

Every active Case needs:

```text id="cs026"
OWNER
```

---

# 39. Owner Responsibility

Case owner is accountable for:

```text id="cs027"
NEXT ACTION
COMMUNICATION
FOLLOW-UP
RESOLUTION
```

even when another team executes part of the fix.

---

# 40. No Customer Ping-Pong

Canonical:

> **Internal handoffs should not become customer handoffs.**

Customer should not be told to chase:

- production,
- finance,
- warehouse,
- courier,

unless genuinely required.

---

# 41. Internal Collaboration

Support may create internal tasks for:

```text id="cs028"
FINANCE
FULFILLMENT
PRODUCTION
QUALITY
PRODUCT
PROGRAM OPS
```

while retaining case ownership.

---

# 42. Priority

Priority determines how quickly support should act.

Potential:

```text id="cs029"
LOW
NORMAL
HIGH
URGENT
```

---

# 43. Severity vs Priority

Critical distinction:

```text id="cs030"
SEVERITY
how serious the impact is.

PRIORITY
how quickly TeeStock should act.
```

They often correlate, but are not identical.

---

# 44. Severity

Potential:

```text id="cs031"
MINOR
MODERATE
MAJOR
CRITICAL
```

---

# 45. Minor

Low-impact question/problem.

---

# 46. Moderate

Meaningful inconvenience but limited impact.

---

# 47. Major

Material customer/business impact.

Examples:

- important order delay,
- multiple incorrect items.

---

# 48. Critical

Potential:

```text id="cs032"
LEGAL / SAFETY RISK
HIGH-VALUE ACCOUNT FAILURE
SYSTEMIC ISSUE
LARGE BATCH FAILURE
```

---

# 49. Priority Inputs

Could consider:

```text id="cs033"
SEVERITY
CUSTOMER IMPACT
DEADLINE
ORDER VALUE
NUMBER AFFECTED
```

---

# 50. No VIP-Only Service Logic

High-value customers may receive different service levels when contractually intended.

But basic fairness and product quality standards remain universal.

---

# 51. SLA

Support should eventually define:

```text id="cs034"
FIRST RESPONSE SLA
RESOLUTION SLA / TARGET
UPDATE CADENCE
```

---

# 52. First Response SLA

Measures:

```text id="cs035"
CASE CREATED
→
MEANINGFUL FIRST RESPONSE
```

---

# 53. Meaningful Response

Not merely:

> “Halo kak, ditunggu ya.”

A useful first response should ideally:

- acknowledge,
- show understanding,
- give next step.

---

# 54. Resolution SLA

Some case types can have target resolution windows.

Not every problem can guarantee fixed resolution time.

---

# 55. SLA Clock

Should define:

```text id="cs036"
START
PAUSE
STOP
```

---

# 56. Waiting Customer

May pause certain internal resolution clocks where appropriate.

---

# 57. Business Hours

SLA should reflect real operating hours unless TeeStock genuinely offers 24/7 support.

---

# 58. SLA Transparency

Do not advertise unrealistically fast response promises.

---

# 59. Response Standard

Canonical support response should strive for:

```text id="cs037"
CLEAR
SPECIFIC
CALM
HUMAN
ACTIONABLE
```

---

# 60. Voice

Follow TeeStock Voice & Copy System.

Customer support should not sound:

- robotic,
- defensive,
- excessively formal.

---

# 61. Support Formula

Useful pattern:

```text id="cs038"
UNDERSTAND
↓
STATE WHAT WE KNOW
↓
STATE WHAT WE WILL DO
↓
STATE NEXT EXPECTATION
```

---

# 62. Product Truth

Support should answer from canonical product data.

Avoid guessing:

- material,
- sizing,
- availability.

---

# 63. Order Truth

Support should read order/system status.

Avoid:

> “sepertinya lagi diproses.”

if exact state exists.

---

# 64. Shipment Truth

Use canonical shipment/tracking data.

---

# 65. Known Unknowns

If information is genuinely unknown:

say what is being checked and what action follows.

Do not invent certainty.

---

# 66. Proactive Communication

Canonical:

> **If TeeStock knows a meaningful customer-impacting problem before the customer does, communicate proactively where practical.**

---

# 67. Proactive Triggers

Potential:

```text id="cs039"
PRODUCTION DELAY
STOCK FAILURE
SHIPMENT PROBLEM
QUALITY HOLD
ORDER CHANGE
```

---

# 68. Delay Communication

Should explain:

```text id="cs040"
WHAT HAPPENED
WHAT IT AFFECTS
NEW EXPECTATION
WHAT OPTIONS EXIST
```

---

# 69. Avoid Overexplaining Internal Chaos

Customer needs useful truth, not internal blame chain.

---

# 70. Complaint

Canonical:

> **Complaint adalah expressed dissatisfaction about TeeStock product, service, communication, or outcome.**

---

# 71. Complaint Is Data

Complaint should be classified beyond emotional tone.

---

# 72. Complaint Handling

Canonical:

```text id="cs041"
LISTEN
↓
VERIFY
↓
CLASSIFY
↓
RESOLVE
↓
RECORD CAUSE
↓
FOLLOW UP
```

---

# 73. Do Not Argue by Default

Customer may be factually mistaken.

Correct clearly, but focus on resolution rather than winning argument.

---

# 74. Evidence

For product/shipment problems, evidence may include:

```text id="cs042"
PHOTO
VIDEO
TRACKING
ORDER RECORD
QC RECORD
```

Request only what is necessary.

---

# 75. No Unnecessary Burden

Avoid asking customer to repeatedly send data already supplied.

---

# 76. Quality Complaint

Should potentially create/link:

```text id="cs043"
QUALITY CLAIM
NCR
```

when validated/significant.

---

# 77. Fulfillment Complaint

Examples:

```text id="cs044"
WRONG ITEM
MISSING ITEM
WRONG QTY
```

should feed fulfillment accuracy metrics.

---

# 78. Delivery Complaint

May require:

```text id="cs045"
CARRIER INVESTIGATION
```

not product-quality flow.

---

# 79. Expectation Gap

Some complaints originate because:

```text id="cs046"
PRODUCT REALITY
≠
CUSTOMER EXPECTATION
```

even if product meets spec.

---

# 80. Expectation Gap Feedback

May require changes to:

- product copy,
- photography,
- size guide,
- shipping promise.

---

# 81. Service Recovery

When TeeStock fails, resolution should repair:

```text id="cs047"
FUNCTIONAL LOSS
+
CUSTOMER TRUST
```

proportionally.

---

# 82. Recovery Options

Potential:

```text id="cs048"
REPLACEMENT
REWORK
REFUND
PARTIAL REFUND
STORE CREDIT
RESHIPMENT
OTHER APPROVED COMPENSATION
```

---

# 83. Compensation Is Not Default Apology

Compensation should reflect:

- actual failure,
- customer impact,
- economics,
- policy.

---

# 84. Compensation Authority

Define levels.

Example conceptual:

```text id="cs049"
SUPPORT AGENT
small predefined recovery

TEAM LEAD
higher recovery

MANAGER / FOUNDER
exceptional value
```

Exact thresholds belong in Decision Thresholds.

---

# 85. Why Authority Matters

Without clear authority:

```text id="cs050"
EVERY PROBLEM
→
FOUNDER APPROVAL
```

which prevents scale.

---

# 86. Compensation Record

Should capture:

```text id="cs051"
CASE
TYPE
VALUE
REASON
APPROVER
```

---

# 87. Refund

Refund should remain linked to:

```text id="cs052"
ORDER
PAYMENT
CASE / RETURN
REASON
```

---

# 88. Refund Is Financial Event

Customer Service can request/approve within authority.

Finance/payment system executes according to controls.

---

# 89. Replacement

Replacement should create operational object.

Not merely message:

> “nanti dikirim ulang.”

---

# 90. Replacement Order

Potential:

```text id="cs053"
REPLACEMENT ORDER
```

linked to original case/order.

---

# 91. Reshipment

If correct product was never delivered, may require new Shipment rather than new commercial Order.

Implementation should preserve distinction.

---

# 92. Exchange

May involve:

```text id="cs054"
RETURN
+
NEW FULFILLMENT
```

---

# 93. Cancellation Request

Support should evaluate order state.

---

# 94. Cancellation Before Production

Typically more reversible.

---

# 95. Cancellation After Custom Production

May be restricted because value has already been irreversibly created.

---

# 96. Change Request

Customer-requested changes after order confirmation should follow operational change rules.

---

# 97. No Chat-Only Order Changes

Canonical:

> **If a customer-approved change affects fulfillment, production, quantity, product, address, or money, update the canonical object.**

---

# 98. Address Change

Support must update canonical shipment/order address only where allowed.

---

# 99. Address Change After Shipment

Usually carrier/process dependent.

Do not promise impossible modification.

---

# 100. Status Inquiry

A high volume of:

> “order gue sudah sampai mana?”

is a signal of poor proactive visibility.

---

# 101. Reduce Avoidable Contacts

Good systems should reduce support demand through:

```text id="cs055"
BETTER PRODUCT INFO
ORDER STATUS
TRACKING
PROACTIVE NOTIFICATIONS
SELF-SERVICE
```

---

# 102. Contact Rate

Useful metric:

```text id="cs056"
SUPPORT CASES
/
ORDERS
```

by reason.

---

# 103. High Contact Rate

May reveal systemic friction.

---

# 104. Self-Service

Potential:

```text id="cs057"
ORDER TRACKING
FAQ
SIZE GUIDE
RETURN REQUEST
ACCOUNT UPDATE
```

---

# 105. Self-Service Principle

Canonical:

> **Self-service should remove friction, not transfer work to the customer.**

---

# 106. FAQ

FAQ should be generated from genuine recurring questions.

Not filler content.

---

# 107. Knowledge Base

Future internal/external:

```text id="cs058"
PRODUCT
POLICY
PROCESS
TROUBLESHOOTING
```

---

# 108. Internal Knowledge Base

Support staff may need more operational detail than customers.

---

# 109. Knowledge Versioning

Policy/product answers can change.

Use current source, not old remembered message.

---

# 110. Macro / Template

Useful for repeated response structure.

---

# 111. Macro Principle

Canonical:

> **Template the structure, personalize the context.**

---

# 112. Bad Macro

Generic reply that ignores customer situation.

---

# 113. Good Macro

Prepares:

- clarity,
- policy wording,
- next actions,

while inserting actual order/customer facts.

---

# 114. Customer Timeline

Future support UI should show:

```text id="cs059"
ACCOUNT CREATED
ORDER
PAYMENT
PRODUCTION
SHIPMENT
CASE
RETURN
REFUND
```

chronologically.

---

# 115. Unified Timeline Value

Reduces:

- repeated questions,
- internal searching,
- inconsistent replies.

---

# 116. Case Timeline

Case should preserve:

```text id="cs060"
MESSAGES
INTERNAL NOTES
STATUS CHANGES
ACTIONS
ESCALATIONS
```

---

# 117. Internal Note

Not visible to customer.

Used for operational coordination.

---

# 118. Customer Message

Should remain clearly separate from internal commentary.

---

# 119. Sensitive Data

Support access should follow least privilege.

Do not expose:

- payment credentials,
- unrelated customer data.

---

# 120. Authentication

High-risk account/order changes may require reasonable identity verification.

---

# 121. High-Risk Requests

Potential:

```text id="cs061"
CHANGE PAYMENT DESTINATION
CHANGE HIGH-VALUE ADDRESS
ACCOUNT TAKEOVER CLAIM
SENSITIVE DATA REQUEST
```

need stronger verification.

---

# 122. Privacy Request

Customer privacy/data requests should follow future legal/privacy policy.

---

# 123. Escalation

Escalate when:

```text id="cs062"
AUTHORITY INSUFFICIENT
TECHNICAL EXPERTISE NEEDED
SEVERITY HIGH
SYSTEMIC FAILURE
LEGAL / IP RISK
```

---

# 124. Escalation Route

Potential:

```text id="cs063"
SUPPORT
→ OPERATIONS
→ QUALITY
→ FINANCE
→ LEADERSHIP
```

depending issue.

---

# 125. Escalation Must Preserve Owner

Escalating technical work does not mean abandoning the Case.

---

# 126. Escalation Context

Send:

```text id="cs064"
PROBLEM
FACTS
WHAT HAS BEEN TRIED
CUSTOMER IMPACT
DECISION NEEDED
```

not a vague:

> “tolong cek.”

---

# 127. Critical Incident Link

If many customers affected:

individual cases may link to one:

```text id="cs065"
MASTER INCIDENT
```

---

# 128. Incident Communication

Central incident enables consistent customer updates.

---

# 129. Duplicate Cases

If customer contacts multiple channels about same problem:

merge/link where possible.

---

# 130. Duplicate Contact

Should not create duplicated compensations/resolutions.

---

# 131. Case Reopen

Resolved case may reopen if:

- resolution failed,
- issue recurs.

---

# 132. Reopen Rate

High reopen rate may indicate poor first resolution quality.

---

# 133. First Contact Resolution

Concept:

> Case solved in first meaningful interaction without subsequent follow-up.

Useful only for appropriate case types.

---

# 134. Avoid Gaming FCR

Do not prematurely close complex cases just to improve metric.

---

# 135. Customer Satisfaction

Potential:

```text id="cs066"
CSAT
```

after suitable support interactions.

---

# 136. CSAT Question

Keep simple.

Example conceptually:

> How satisfied were you with the support you received?

---

# 137. CSAT Is Not Complete Truth

Customer satisfaction can be influenced by:

- product problem,
- outcome,
- expectations.

Use alongside operational metrics.

---

# 138. Customer Effort

Potential future measure:

> How difficult was it to resolve the issue?

Can expose friction.

---

# 139. NPS

May be used at brand level later.

Not necessary as primary Customer Service metric.

---

# 140. Customer Service Metrics

Canonical categories:

```text id="cs067"
SPEED
RESOLUTION
QUALITY
CUSTOMER
DEMAND
ECONOMICS
```

---

# 141. Speed Metrics

Potential:

```text id="cs068"
First Response Time
Resolution Time
Backlog Age
```

---

# 142. Resolution Metrics

```text id="cs069"
Resolution Rate
Reopen Rate
Escalation Rate
First Contact Resolution
```

---

# 143. Quality Metrics

```text id="cs070"
Wrong Resolution
Repeat Contact
Policy Error
```

---

# 144. Customer Metrics

```text id="cs071"
CSAT
Complaint Rate
Customer Effort
```

---

# 145. Demand Metrics

```text id="cs072"
Cases per Order
Cases by Reason
Top Contact Drivers
```

---

# 146. Economic Metrics

Potential:

```text id="cs073"
Refund Value
Replacement Cost
Compensation Cost
Support Cost per Order
```

---

# 147. Backlog

Open cases awaiting resolution.

---

# 148. Backlog Age

Older cases often deserve escalation.

---

# 149. SLA Attainment

Measure:

```text id="cs074"
CASES WITHIN SLA
/
ELIGIBLE CASES
```

---

# 150. Resolution Time by Reason

Compare like-for-like case types.

---

# 151. Complaint Rate

Should use clear denominator:

- orders,
- units,
- customers.

---

# 152. Contact Reason Trend

One of most valuable support analytics.

Example:

```text id="cs075"
SIZE QUESTIONS ↑
```

may indicate poor size guide.

---

# 153. Root-Cause Feedback Loop

Canonical:

```text id="cs076"
CASE
↓
CONTACT REASON
↓
ROOT CAUSE
↓
OWNER
↓
PROCESS / PRODUCT CHANGE
↓
FEWER FUTURE CASES
```

---

# 154. Customer Service → Product

Repeated:

- fit confusion,
- material confusion,

may require catalog/product changes.

---

# 155. Customer Service → Quality

Repeated defects should feed QC/NCR.

---

# 156. Customer Service → Fulfillment

Wrong-item/missing-item cases should affect fulfillment metrics.

---

# 157. Customer Service → Logistics

Delivery complaints can inform carrier routing.

---

# 158. Customer Service → Commerce

Checkout/payment questions can reveal UX problems.

---

# 159. Customer Service → Marketing

Misleading campaign/customer expectations should be corrected.

---

# 160. Customer Service → Finance

Refund/payment issues can expose payment-process friction.

---

# 161. Customer Service → Originals

Repeated customer feedback can inform product/collection learning without letting support dictate brand strategy.

---

# 162. Voice of Customer

Canonical:

```text id="cs077"
CUSTOMER SIGNAL
```

may include:

```text id="cs078"
QUESTION
COMPLAINT
REQUEST
PRAISE
SUGGESTION
```

---

# 163. Structured VOC

Repeated signals should become searchable/aggregated data.

---

# 164. Feature/Product Requests

Capture separately from operational complaint.

---

# 165. One Customer Opinion ≠ Market Truth

Use patterns, context, and behavioral data.

---

# 166. Positive Feedback

Positive feedback can reveal:

```text id="cs079"
WHAT CUSTOMER VALUES
```

not just failure.

---

# 167. Customer Recovery Follow-Up

For significant failure, follow up after resolution where appropriate.

---

# 168. High-Severity Closure

May require confirmation that customer received:

- replacement,
- refund,
- agreed resolution.

---

# 169. B2B Customer Service

Business accounts may require different relationship model.

---

# 170. Account Contact

B2B Case should know:

```text id="cs080"
BUSINESS ACCOUNT
CONTACT PERSON
PROJECT / ORDER
```

---

# 171. B2B Escalation

Potential:

- deadline risk,
- invoice,
- multi-location delivery,
- account terms.

---

# 172. B2B Support Is Not Consumer Support

Tone/process may be more operational/professional.

Still uses same case principles.

---

# 173. Custom Support

Custom order support must see:

```text id="cs081"
ARTWORK APPROVAL
PRODUCTION
PAYMENT
DEADLINE
```

---

# 174. Merch Support

Need know whether customer issue belongs to:

```text id="cs082"
TEEStock OPERATIONS
CREATOR / BRAND DECISION
```

but customer should still receive coherent resolution path.

---

# 175. Fulfill Client Support

External Fulfill clients may need operational account support distinct from end-customer support.

---

# 176. Program Support

Creators/resellers/affiliates/partners may eventually have:

```text id="cs083"
PARTICIPANT CASE
```

or dedicated support module.

One shared case architecture can still work.

---

# 177. Marketplace Support

Marketplace channel may impose:

- response SLA,
- dispute rules.

TeeStock should map them to canonical cases.

---

# 178. Social DM Support

If issue becomes operational:

convert DM into Case.

---

# 179. WhatsApp Support

WhatsApp remains convenient communication layer.

Case record remains operational truth.

---

# 180. Email Support

Emails can attach to existing Case/customer context.

---

# 181. Channel Continuity

Customer should not need to retell full story when channel changes if identity can be reliably linked.

---

# 182. Support Hours

Should be explicit internally.

Externally publish only actual reliable operating availability.

---

# 183. Out-of-Hours Message

Can clarify:

- support received,
- expected response window.

---

# 184. Emergency Support

Only necessary if TeeStock later supports business-critical services requiring it.

---

# 185. Support Staffing

Hiring should follow:

```text id="cs084"
CASE VOLUME
+
CASE COMPLEXITY
+
SLA NEED
```

---

# 186. Staffing Before Automation

Before adding people, identify:

- avoidable contacts,
- repetitive replies,
- broken upstream systems.

---

# 187. Support Capacity

Potential planning unit:

```text id="cs085"
CASES / AGENT / DAY
```

adjusted for complexity.

---

# 188. Work Queue

Support agents should operate from:

```text id="cs086"
UNASSIGNED
MY CASES
SLA RISK
WAITING INTERNAL
ESCALATED
```

not scanning chats manually.

---

# 189. Queue Routing

Future rules may route based on:

```text id="cs087"
REASON
SEVERITY
ACCOUNT TYPE
LANGUAGE
CHANNEL
```

---

# 190. Skill-Based Routing

At scale, specialized cases can route to:

- production support,
- finance,
- B2B.

---

# 191. Automation Opportunities

Potential:

```text id="cs088"
Case Creation
Identity Matching
Reason Classification
Order Context Retrieval
SLA Calculation
Macro Suggestion
Status Notifications
Escalation Alerts
```

---

# 192. Auto Case Creation

Channel message may create Case when:

- intent is operational,
- no active matching Case exists.

---

# 193. Automated Context

System should attach:

```text id="cs089"
ORDER
SHIPMENT
PAYMENT
```

where confidently matched.

---

# 194. Automated Classification

AI/rules may propose contact reason.

Human can correct.

---

# 195. Auto-Resolution

Only simple deterministic issues.

Examples:

```text id="cs090"
TRACKING STATUS
ORDER RECEIPT
BASIC PRODUCT DATA
```

---

# 196. Human Escalation

If confidence/risk low:

route to human.

---

# 197. AI Role

AI may assist with:

```text id="cs091"
Conversation Summary
Intent Classification
Suggested Reply
Customer Context Summary
Policy Retrieval
Sentiment Signal
Root-Cause Clustering
```

---

# 198. AI Reply Principle

AI can draft.

Response should be grounded in:

```text id="cs092"
REAL CUSTOMER DATA
CURRENT POLICY
CURRENT ORDER STATE
```

---

# 199. AI Must Not Invent

AI should never fabricate:

```text id="cs093"
REFUND STATUS
SHIPPING DATE
INVENTORY
COMPENSATION APPROVAL
```

---

# 200. AI Compensation Boundary

AI may recommend allowed resolution.

It cannot grant compensation outside approved authority/rules.

---

# 201. AI Refund Boundary

Refund execution requires deterministic transaction/approval control.

---

# 202. AI Escalation

AI can detect:

```text id="cs094"
ANGER
REPEATED CONTACT
HIGH SEVERITY
SLA RISK
```

and prioritize review.

---

# 203. Sentiment Caution

Sentiment is a signal, not truth.

An angry customer is not automatically correct.

A calm customer may still have serious issue.

---

# 204. AI Knowledge Retrieval

Future Jarvis/Support Agent should retrieve from:

```text id="cs095"
PRODUCT DATA
ORDER DATA
POLICY
CASE HISTORY
```

rather than general guessing.

---

# 205. AI Action Boundary

Future agent may safely:

```text id="cs096"
CHECK STATUS
CREATE CASE
DRAFT RESPONSE
SEND STANDARD NOTIFICATION
```

within approved rules.

High-risk actions remain gated.

---

# 206. Customer Service Data Model

Core:

```text id="cs097"
CUSTOMER
CUSTOMER CASE
CASE MESSAGE
CONTACT REASON
CASE STATUS
PRIORITY
SLA
INTERNAL TASK
ESCALATION
RESOLUTION
COMPENSATION
```

---

# 207. Customer Case Entity

Parent support object.

---

# 208. Case Message Entity

Stores individual interaction within case.

---

# 209. Contact Reason Entity

Controlled taxonomy.

---

# 210. SLA Entity

Defines timing policy.

---

# 211. Resolution Entity

Captures outcome.

---

# 212. Compensation Entity

Records economic recovery offered.

---

# 213. Escalation Entity

Tracks when/why case moved beyond normal handling.

---

# 214. Customer Service Data Lineage

Canonical:

```text id="cs098"
CUSTOMER
↓
CASE
↓
RELATED ORDER / SHIPMENT / PRODUCT
↓
ACTION
↓
RESOLUTION
↓
ROOT-CAUSE SIGNAL
```

---

# 215. Case Events

Potential:

```text id="cs099"
case.created
case.assigned
case.waiting_customer
case.escalated
case.resolved
case.closed
```

---

# 216. Operational Events Into Support

Potential:

```text id="cs100"
shipment.failed
production.delayed
qc.failed
refund.completed
```

can update/create support workflows.

---

# 217. Proactive Case

System may create internal support Case before customer contacts TeeStock.

Example:

```text id="cs101"
SHIPMENT FAILED
→
PROACTIVE CUSTOMER OUTREACH
```

---

# 218. Support Dashboard

Potential:

```text id="cs102"
OPEN CASES
UNASSIGNED
SLA AT RISK
ESCALATED
WAITING INTERNAL
TOP CONTACT REASONS
CSAT
```

---

# 219. Customer 360 View

Potential:

```text id="cs103"
PROFILE
ORDERS
SHIPMENTS
RETURNS
CASES
PROGRAM ROLES
```

with least-privilege access.

---

# 220. Daily Support Review

Focus:

```text id="cs104"
SLA RISK
HIGH SEVERITY
OLD CASES
BLOCKED CASES
```

---

# 221. Weekly Support Review

Focus:

```text id="cs105"
TOP CONTACT REASONS
COMPLAINT TRENDS
ROOT CAUSES
REFUND / REPLACEMENT COST
```

---

# 222. Monthly Customer Ops Review

Focus:

```text id="cs106"
SYSTEMIC FRICTION
QUALITY
FULFILLMENT
PRODUCT INFORMATION
AUTOMATION OPPORTUNITY
```

---

# 223. Support Process Improvement

Canonical:

```text id="cs107"
REPEATED CASE
↓
IDENTIFY ROOT CAUSE
↓
FIX UPSTREAM
↓
MEASURE CASE REDUCTION
```

---

# 224. Best Support Case

Long-term:

> **The best avoidable support case is the one the system prevents from ever being created.**

---

# 225. Support Cost

Customer Service consumes:

- time,
- compensation,
- operational coordination.

Track enough to understand bad process economics.

---

# 226. Cost-to-Serve

Future concept:

```text id="cs108"
SUPPORT EFFORT
+
RECOVERY COST
```

by customer/order/product where strategically useful.

---

# 227. Product Cost-to-Serve

A product with high support/return burden may be less profitable than gross margin suggests.

---

# 228. Support Case as Quality Signal

Customer Case reason should link into:

```text id="cs109"
QUALITY
FULFILLMENT
PRODUCT
PROCESS
```

analytics.

---

# 229. Customer Blame Avoidance

Do not systematically classify failures as:

```text id="cs110"
CUSTOMER ERROR
```

just because it protects internal metrics.

---

# 230. Fair Classification

Root cause should reflect evidence.

---

# 231. Abuse

Some customers may abuse:

- returns,
- refunds,
- promotions,
- support.

System may flag patterns.

---

# 232. Abuse Is Not Normal Complaint

Need evidence before restricting customer.

---

# 233. Customer Risk Flags

Potential later:

```text id="cs111"
REPEATED FRAUD
CHARGEBACK
ABUSE
```

with controlled access.

---

# 234. Blacklisting

High-impact action should require appropriate review/policy.

Not casual agent decision.

---

# 235. Customer History Should Not Become Bias

Previous difficult case should not automatically invalidate legitimate future complaint.

---

# 236. Documentation

Significant cases should contain enough evidence for another operator to understand outcome.

---

# 237. Avoid Over-Documentation

Simple FAQ question does not require a legal dossier.

Proportionality matters.

---

# 238. Support Maturity Model

```text id="cs112"
LEVEL 0
Scattered chats

LEVEL 1
Shared inbox + manual case tracking

LEVEL 2
Canonical Cases + order context + SLA

LEVEL 3
Automation + knowledge + analytics

LEVEL 4
AI-assisted resolution + proactive support

LEVEL 5
Exception-based autonomous customer operations
```

---

# 239. Level 0

Anti-goal.

Support exists inside personal WhatsApp/DM.

---

# 240. Level 1

Minimum:

```text id="cs113"
CUSTOMER
CASE
OWNER
STATUS
RELATED ORDER
```

---

# 241. Level 2

Adds:

```text id="cs114"
CONTACT REASON
SLA
CUSTOMER TIMELINE
RESOLUTION
```

---

# 242. Level 3

Adds:

```text id="cs115"
KNOWLEDGE BASE
MACROS
AUTOMATIC ROUTING
ROOT-CAUSE DASHBOARD
```

---

# 243. Level 4

Adds:

```text id="cs116"
AI DRAFTS
PROACTIVE CASES
SELF-SERVICE
AUTOMATED SIMPLE RESOLUTION
```

---

# 244. Level 5

Normal low-risk support runs automatically.

Humans handle:

```text id="cs117"
EXCEPTION
EMOTIONALLY SENSITIVE
HIGH VALUE
HIGH RISK
AMBIGUOUS
```

cases.

---

# 245. Current Recommended Stage

TeeStock should target:

```text id="cs118"
LEVEL 1
→
LEVEL 2
```

first.

---

# 246. V1 Required Capabilities

Priority:

```text id="cs119"
Customer Identity
Customer Case
Contact Reason
Related Order
Owner
Status
Resolution
```

---

# 247. V1 Channels

Can begin with:

```text id="cs120"
WHATSAPP
EMAIL
MARKETPLACE
```

but normalize important issues into Cases.

---

# 248. V1 SLA

Start with a few meaningful targets.

Do not create dozens of support timers.

---

# 249. V1 Response Library

Create macros for:

```text id="cs121"
ORDER STATUS
SHIPPING
SIZE
PAYMENT
RETURN
QUALITY CLAIM
```

after actual repeated demand appears.

---

# 250. V1 Compensation

Define small controlled recovery authority.

Founder handles material exceptions.

---

# 251. V1 Avoid

Do not immediately build:

```text id="cs122"
huge call center system
complex sentiment scoring
hundreds of contact reasons
24/7 promise
fully autonomous refunds
```

---

# 252. V2 Expansion

Possible:

```text id="cs123"
UNIFIED INBOX
CUSTOMER TIMELINE
SLA AUTOMATION
KNOWLEDGE BASE
CSAT
```

---

# 253. V3 Expansion

Possible:

```text id="cs124"
AI ASSIST
SELF-SERVICE
PROACTIVE SUPPORT
ROOT-CAUSE ANALYTICS
```

---

# 254. V4 Expansion

Possible:

```text id="cs125"
AUTOMATED LOW-RISK RESOLUTION
PREDICTIVE SUPPORT
OMNICHANNEL CASE ROUTING
```

---

# 255. Case Creation Gate

Create Case when interaction requires:

```text id="cs126"
FOLLOW-UP
ACTION
DECISION
TRACEABILITY
```

Simple one-message FAQ may not require persistent Case if system design intentionally handles it statelessly.

---

# 256. Escalation Gate

Escalate when:

```text id="cs127"
IMPACT HIGH
+
AUTHORITY INSUFFICIENT
or
SPECIALIST INPUT REQUIRED
```

---

# 257. Compensation Gate

Compensation should require:

```text id="cs128"
VALID CUSTOMER IMPACT
+
POLICY / AUTHORITY
+
RECORDED REASON
```

---

# 258. Proactive Communication Gate

Communicate proactively when:

```text id="cs129"
PROBLEM CONFIRMED
+
CUSTOMER IMPACT MATERIAL
+
MESSAGE CAN REDUCE UNCERTAINTY
```

---

# 259. Automation Gate

Automate a support action only when:

```text id="cs130"
INTENT CLEAR
DATA RELIABLE
RULE STABLE
RISK LOW
```

---

# 260. AI Execution Gate

Allow AI to act autonomously only when:

```text id="cs131"
ACTION REVERSIBLE
+
POLICY DETERMINISTIC
+
FINANCIAL / LEGAL RISK LOW
```

---

# 261. Customer Service Failure Modes

## Chat as Database

No customer history.

## Customer Repeats Everything

Poor context.

## No Case Owner

Issues get lost.

## Every Issue to Founder

No scalability.

## Generic Copy-Paste Replies

Low trust.

## Refund Without Root Cause

Failure repeats.

## Complaint Closed Without Resolution

Fake metrics.

## Support Fixes Symptoms Forever

Upstream systems never improve.

## AI Guesses Order Status

Trust failure.

---

# 262. What Customer Service Must Not Become

## Apology Department

Resolution matters more than repetitive apologies.

## Compensation Machine

Money is not substitute for fixing process.

## Customer-Blame Firewall

Support must represent reality fairly.

## Founder Inbox

Support relationships belong to system.

## Chatbot Wall

Automation should reduce friction, not block human help.

---

# 263. Customer Service Success Definition

The system succeeds when TeeStock can answer:

```text id="cs132"
WHO
is the customer?

WHAT
are they asking?

WHAT ORDER / PRODUCT
is involved?

HOW SERIOUS
is the problem?

WHO
owns the case?

WHAT
has already happened?

WHAT
is the next action?

WHEN
should we respond?

HOW
was it resolved?

WHAT
should TeeStock improve because of it?
```

---

# 264. Canonical Customer Service Summary

```text id="cs133"
CUSTOMER
creates contact.

CHANNEL
captures the message.

CASE
creates operational ownership.

CONTEXT
reveals reality.

SLA
creates urgency.

RESOLUTION
solves the problem.

ROOT CAUSE
creates learning.

MGBOS
turns support into operating intelligence.
```

---

# 265. Canonical Customer Service Principles

```text id="cs134"
CASE BEFORE CHAT MEMORY.

CONTEXT BEFORE QUESTIONING.

OWNER BEFORE HANDOFF.

CLEAR NEXT ACTION BEFORE CLOSURE.

MEANINGFUL RESPONSE BEFORE FAST RESPONSE.

RESOLUTION BEFORE METRIC.

PROACTIVE COMMUNICATION BEFORE CUSTOMER ANXIETY.

COMPENSATION WITH AUTHORITY AND REASON.

CUSTOMER COMPLAINT IS DATA.

FIX ROOT CAUSE, NOT ONLY THE MESSAGE.

AUTOMATE SIMPLE WORK, ESCALATE COMPLEXITY.

AI MAY ASSIST. SYSTEM TRUTH MUST LEAD.

RESOLVE THE CUSTOMER PROBLEM. CAPTURE THE OPERATIONAL LESSON.
```

---

# 266. Dependency

Dokumen berikut harus follow Customer Service System:

1. `07-operations/returns-and-warranty.md`
2. `08-finance/financial-model.md`
3. `08-finance/unit-economics.md`
4. `08-finance/cost-accounting.md`
5. `09-marketing/audience-segmentation.md`
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

TeeStock Customer Service boleh berkembang menjadi omnichannel, proactive, self-service, dan AI-assisted operation, tetapi automation hanya boleh berdiri di atas canonical customer identity, reliable order context, structured Cases, current policies, clear authority, traceable resolutions, dan disciplined feedback loops.