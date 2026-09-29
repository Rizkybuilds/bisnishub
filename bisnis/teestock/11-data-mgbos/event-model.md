---
title: "TeeStock Event Model"
date: "2026-09-28"
bisnis: teestock
kategori: operasional
status: active
tags:
  - bisnis/teestock
  - kategori/operasional
  - teestock/canonical
  - teestock/data-mgbos
document_id: "TS-DAT-004"
version: "1.0"
category: "data-mgbos"
business: "teestock"
last_updated: "2026-09-28"
path: "11-data-mgbos/event-model.md"
depends_on:
  - "TS-DAT-001"
  - "TS-DAT-002"
  - "TS-DAT-003"
  - "TS-TEC-003"
  - "TS-TEC-004"
  - "TS-TEC-005"
  - "TS-TEC-006"
---


# TeeStock Event Model v1.0

> [!abstract] **Canonical TeeStock Business Event, State Change & Integration Messaging Framework  **
> Dokumen ini mendefinisikan event taxonomy, event envelope, naming, entity references, actor/source, correlation, causation, idempotency, ordering, delivery, event ownership, outbox, integration events, state-transition events, replay boundaries, failure handling, audit separation, analytics consumption, automation triggers, dan AI/Jarvis event interaction.
>
> [!info] **Dependencies & Data Flow (SSOT)**
> [[bisnis/teestock/11-data-mgbos/canonical-data-model|TS-DAT-001: TeeStock Canonical Data Model]] • [[bisnis/teestock/11-data-mgbos/entity-hierarchy|TS-DAT-002: TeeStock Entity Hierarchy]] • [[bisnis/teestock/11-data-mgbos/sku-and-id-convention|TS-DAT-003: TeeStock SKU & ID Convention]] • [[bisnis/teestock/10-product-tech/commerce-platform|TS-TEC-003: TeeStock Commerce Platform]] • [[bisnis/teestock/10-product-tech/creator-platform|TS-TEC-004: TeeStock Creator Platform]] • [[bisnis/teestock/10-product-tech/partner-platform|TS-TEC-005: TeeStock Partner Platform]] • [[bisnis/teestock/10-product-tech/automation-architecture|TS-TEC-006: TeeStock Automation Architecture]]


---

# 1. Purpose

Event Model menjawab:

> **Bagaimana setiap perubahan penting dalam TeeStock dapat dinyatakan sebagai business fact yang dapat dipahami, ditelusuri, digunakan oleh automation, dianalisis, dan dikonsumsi oleh sistem lain tanpa membuat seluruh aplikasi saling terikat secara rapuh?**

Canonical principle:

> **State tells us what is true now. Events tell us what happened.**

---

# 2. Canonical Definition

> **TeeStock Event Model adalah shared canonical framework untuk merepresentasikan business facts yang telah terjadi sebagai immutable, uniquely identifiable, domain-owned, timestamped, entity-referenced records yang dapat digunakan oleh MGBOS, workflows, integrations, analytics, notifications, dan AI agents.**

---

# 3. Event Is a Fact

Canonical:

```text id="evt001"
EVENT
=
SOMETHING THAT ALREADY HAPPENED
```

Examples:

```text id="evt002"
order.created
payment.completed
work_order.issued
qc.failed
shipment.shipped
```

---

# 4. Event Is Not a Command

Critical:

```text id="evt003"
COMMAND
requests something to happen.

EVENT
states that something happened.
```

Example:

```text id="evt004"
COMMAND:
Create Shipment

EVENT:
shipment.created
```

---

# 5. Event Is Not Current State

Canonical:

```text id="evt005"
CURRENT STATE:
order.status = PAID

EVENT:
payment.completed
```

Both are useful.

They serve different purposes.

---

# 6. State and Event Relationship

Canonical:

```text id="evt006"
COMMAND
↓
VALIDATION
↓
STATE CHANGE
↓
EVENT
```

---

# 7. Why Events Matter

Events allow TeeStock to decouple:

```text id="evt007"
COMMERCE
FINANCE
PRODUCTION
FULFILLMENT
MARKETING
CREATOR
PARTNER
AUTOMATION
ANALYTICS
AI
```

while preserving one shared history of what happened.

---

# 8. Event Architecture Role

Canonical:

```text id="evt008"
DOMAIN SYSTEM
↓
BUSINESS EVENT
↓
EVENT DELIVERY
↓
CONSUMERS
```

Consumers may include:

```text id="evt009"
MGBOS
n8n
notifications
analytics
agents
integrations
```

---

# 9. Event Ownership

Canonical:

> **The domain that owns the state change owns the event.**

Example:

```text id="evt010"
Payment domain
owns
payment.completed
```

Commerce may consume it.

---

# 10. Event Producer

The producer is the authoritative domain/system that observed and committed the business fact.

---

# 11. Event Consumer

Any system/process that reacts to the fact.

---

# 12. Producer Independence

Canonical:

> **Producer should not need to know every downstream consumer.**

---

# 13. Event Taxonomy

Canonical event categories:

```text id="evt013"
DOMAIN EVENT
INTEGRATION EVENT
STATE TRANSITION EVENT
SYSTEM EVENT
ANALYTICAL EVENT
```

---

# 14. Domain Event

Represents meaningful business fact inside TeeStock domain.

Examples:

```text id="evt014"
order.created
quote.approved
creator.activated
```

---

# 15. Integration Event

Represents event deliberately published for external/other-system consumption.

---

# 16. Domain vs Integration Event

Critical:

```text id="evt015"
DOMAIN EVENT
may contain internal semantics.

INTEGRATION EVENT
has stable consumer-facing contract.
```

---

# 17. State Transition Event

Represents canonical state change.

Example:

```text id="evt016"
work_order.status_changed
```

Useful selectively.

---

# 18. Prefer Semantic Events

Where meaningful, prefer:

```text id="evt017"
work_order.issued
```

over generic:

```text id="evt018"
work_order.status_changed
```

because semantic event communicates business meaning.

---

# 19. Generic State Events

Still useful for:

```text id="evt019"
audit
internal monitoring
generic UI refresh
```

but should not replace semantic business events everywhere.

---

# 20. System Event

Represents technical operational fact.

Examples:

```text id="evt020"
integration.failed
automation.failed
agent.run_failed
```

---

# 21. Analytical Event

Represents behavioral/measurement signal.

Examples:

```text id="evt021"
product.viewed
checkout.started
content.clicked
```

---

# 22. Analytical Event Is Not Always Transactional Fact

Different durability/reliability requirements may apply.

---

# 23. Event Naming Convention

Canonical:

```text id="evt023"
{entity_or_domain}.{past_tense_fact}
```

Examples:

```text id="evt024"
order.created
payment.completed
shipment.delivered
creator.approved
```

---

# 24. Use Past Tense Meaning

Event already happened.

Prefer:

```text id="evt025"
order.cancelled
```

not:

```text id="evt026"
order.cancel
```

---

# 25. Event Names Should Describe Business Meaning

Avoid:

```text id="evt027"
order.updated
record.changed
data.saved
```

for important business events.

---

# 26. Avoid Implementation Names

Bad:

```text id="evt028"
order_row_inserted
postgres_trigger_fired
```

Canonical events describe business facts, not database mechanisms.

---

# 27. Event Namespace

Potential domains:

```text id="evt029"
identity
customer
lead
quote
order
payment
inventory
production
work_order
qc
shipment
return
creator
partner
finance
campaign
content
automation
agent
```

---

# 28. Event Name Stability

Once publicly consumed, event names should remain stable.

---

# 29. Event Schema Versioning

Schema changes require version awareness.

---

# 30. Canonical Event Envelope

Recommended:

```text id="evt030"
event_id
event_type
event_version
occurred_at
recorded_at
entity_type
entity_id
business_unit_id
actor
source
correlation_id
causation_id
payload
metadata
```

---

# 31. Event ID

Globally unique immutable identifier.

---

# 32. Event Type

Canonical semantic name.

Example:

```text id="evt032"
order.created
```

---

# 33. Event Version

Schema/contract version.

Example:

```text id="evt033"
1
```

---

# 34. Occurred At

When business fact actually happened.

---

# 35. Recorded At

When system persisted the event.

---

# 36. Occurred vs Recorded

Critical:

```text id="evt036"
occurred_at
=
business time.

recorded_at
=
system ingestion time.
```

---

# 37. Entity Type

Primary subject entity.

Example:

```text id="evt037"
Order
```

---

# 38. Entity ID

Canonical immutable ID.

---

# 39. Business Unit ID

Useful for MultiGraph Group scoping.

---

# 40. Actor

Who/what caused the initiating action.

Potential:

```text id="evt040"
PERSON
SYSTEM
AGENT
EXTERNAL PLATFORM
```

---

# 41. Actor Structure

Potential:

```text id="evt041"
actor_type
actor_id
```

---

# 42. System Actor

Example:

```text id="evt042"
actor_type = SYSTEM
actor_id = AUT-ORD-001
```

---

# 43. Agent Actor

Example:

```text id="evt043"
actor_type = AGENT
actor_id = AGT-SALES-001
```

---

# 44. External Actor

Example:

```text id="evt044"
actor_type = EXTERNAL_SYSTEM
actor_id = PAYMENT_PROVIDER
```

---

# 45. Source

Identifies system/domain that produced event.

Example:

```text id="evt045"
commerce
payment
mgbos
marketplace_adapter
```

---

# 46. Actor vs Source

Critical:

```text id="evt046"
ACTOR
who initiated.

SOURCE
which system emitted.
```

---

# 47. Correlation ID

Groups multiple events belonging to one business flow.

---

# 48. Example Correlation

```text id="evt048"
ORDER
↓
PAYMENT
↓
PRODUCTION
↓
SHIPMENT
```

can share correlation context.

---

# 49. Correlation ID Use

Useful for:

```text id="evt049"
tracing
incident recovery
workflow monitoring
Jarvis explanation
```

---

# 50. Causation ID

References event/command that directly caused this event.

---

# 51. Example

```text id="evt051"
payment.completed
causes
order.confirmed
```

---

# 52. Correlation vs Causation

Canonical:

```text id="evt052"
CORRELATION
same business journey.

CAUSATION
direct cause.
```

---

# 53. Payload

Contains event-specific facts.

---

# 54. Payload Principle

Canonical:

> **Include enough facts for consumers to understand the event, but do not duplicate the entire entity unless intentionally required.**

---

# 55. Event Payload Example

```text id="evt055"
order.created

payload:
order_number
customer_id
currency
total_amount
channel_id
```

---

# 56. Event Payload Is Historical Snapshot

Values in event represent fact at that time.

---

# 57. Do Not Depend Entirely on Current Entity

If consumer needs historical transaction amount, include relevant snapshot.

---

# 58. But Do Not Publish Entire Database Row

Canonical.

---

# 59. Metadata

Potential non-business context:

```text id="evt059"
request_id
trace_id
environment
schema_source
```

---

# 60. Event Immutability

Once persisted/published:

```text id="evt060"
DO NOT EDIT
```

---

# 61. Event Correction

If fact was wrong:

create corrective event.

---

# 62. Example Correction

```text id="evt062"
inventory.adjusted
```

instead of editing old receipt event.

---

# 63. Event Deletion

Should be extremely limited.

---

# 64. Privacy Exception

Certain personal data may require redaction/retention policies.

Event architecture must avoid unnecessary sensitive payloads.

---

# 65. Event Payload Privacy

Do not include:

```text id="evt065"
password
OTP
bank credential
full private token
```

---

# 66. Prefer Entity References

Instead of embedding sensitive profile data.

---

# 67. Event Ordering

Distributed consumers may receive events:

```text id="evt067"
LATE
DUPLICATED
OUT OF ORDER
```

Architecture must expect this.

---

# 68. Global Ordering

Do not assume one global perfect event order.

---

# 69. Entity Ordering

Where needed, preserve per-entity sequence/version.

Potential field:

```text id="evt069"
entity_version
```

---

# 70. Entity Version

Example:

```text id="evt070"
Order version:
12
```

Consumer can identify stale events.

---

# 71. Optimistic Concurrency

Entity version can help prevent conflicting writes.

---

# 72. Event Delivery

Canonical assumption:

```text id="evt072"
AT-LEAST-ONCE
```

is acceptable for many distributed integrations if consumers are idempotent.

---

# 73. At-Least-Once Meaning

Consumer may receive same event more than once.

---

# 74. Therefore

```text id="evt074"
IDEMPOTENCY
IS REQUIRED
```

for material actions.

---

# 75. Consumer Idempotency

Consumer records processed:

```text id="evt075"
event_id
+
consumer
```

or equivalent idempotency key.

---

# 76. Duplicate Event

Should result in:

```text id="evt076"
NO DUPLICATE BUSINESS EFFECT
```

---

# 77. Example

Same `payment.completed` delivered twice must not create two shipments.

---

# 78. Event Deduplication

Can happen at:

```text id="evt078"
transport
consumer
business action
```

but business operation should still be safe.

---

# 79. Exactly-Once

Do not design around assumption of perfect exactly-once distributed delivery.

---

# 80. Event Publication Reliability

Critical problem:

```text id="evt080"
DATABASE COMMIT SUCCEEDS
but
EVENT PUBLISH FAILS
```

---

# 81. Outbox Pattern

Recommended:

```text id="evt081"
DOMAIN TRANSACTION
├── update state
└── write outbox event

same database transaction
```

Then:

```text id="evt082"
OUTBOX
↓
PUBLISHER
↓
EVENT BUS / n8n / consumers
```

---

# 82. Why Outbox

Prevents state/event inconsistency.

---

# 83. Canonical Direction

For business-critical domains:

```text id="evt083"
TRANSACTIONAL OUTBOX
```

should be preferred as maturity increases.

---

# 84. V1 Event Delivery

Can initially use simpler:

```text id="evt084"
APPLICATION
→ DATABASE EVENT RECORD
→ n8n / worker
```

if reliable enough.

---

# 85. Event Record First

Prefer persist-before-dispatch for critical events.

---

# 86. n8n Role

n8n can consume event and orchestrate reactions.

---

# 87. n8n Must Not Invent Core Event

Canonical events should originate from authoritative domain state transition where possible.

---

# 88. Example Bad Pattern

```text id="evt088"
n8n receives form
then assumes payment happened
then emits payment.completed
```

without Payment domain confirmation.

---

# 89. External Webhook Events

External systems produce external facts.

These should first be normalized.

---

# 90. Example

```text id="evt090"
payment_provider.webhook
↓
verify
normalize
↓
payment.completed
```

---

# 91. External Event ≠ Canonical Event Automatically

Validation required.

---

# 92. Marketplace Example

```text id="evt092"
external marketplace order
↓
adapter
↓
canonical order.created
```

---

# 93. Carrier Example

```text id="evt093"
carrier delivered webhook
↓
verify/map shipment
↓
shipment.delivered
```

---

# 94. Event Validation

Before canonical publication:

```text id="evt094"
SCHEMA VALID
ENTITY VALID
STATE TRANSITION VALID
SOURCE AUTHENTIC
```

---

# 95. State Machine Integration

Events should respect valid entity transitions.

---

# 96. Example Order

```text id="evt096"
PENDING_PAYMENT
→ PAID
→ PROCESSING
→ COMPLETED
```

---

# 97. Invalid Transition

Example:

```text id="evt097"
CANCELLED
→ SHIPPED
```

should be blocked or handled through explicit recovery process.

---

# 98. Transition Event

Only emitted after valid state change commits.

---

# 99. Event Before State Change

Avoid for definitive business events.

---

# 100. Intent Events

If needed, distinguish:

```text id="evt100"
refund.requested
```

from:

```text id="evt101"
refund.completed
```

---

# 101. Requested vs Approved vs Completed

These are distinct facts.

---

# 102. Lifecycle Event Pattern

Potential:

```text id="evt102"
requested
approved
started
completed
failed
cancelled
```

depending entity.

---

# 103. Order Events

Canonical candidate set:

```text id="evt103"
order.created
order.confirmed
order.cancelled
order.completed
```

---

# 104. Order Item Events

Use only when material.

Potential:

```text id="evt104"
order_item.cancelled
order_item.fulfilled
```

---

# 105. Payment Events

Potential:

```text id="evt105"
payment.created
payment.authorized
payment.completed
payment.failed
payment.expired
payment.refunded
```

---

# 106. Inventory Events

Potential:

```text id="evt106"
inventory.received
inventory.reserved
inventory.released
inventory.issued
inventory.transferred
inventory.adjusted
inventory.scrapped
```

---

# 107. Production Events

Potential:

```text id="evt107"
production_job.created
production_job.released
production_job.started
production_job.completed
production_job.cancelled
```

---

# 108. Work Order Events

Potential:

```text id="evt108"
work_order.created
work_order.issued
work_order.acknowledged
work_order.started
work_order.blocked
work_order.ready_for_qc
work_order.accepted
work_order.completed
work_order.cancelled
```

---

# 109. QC Events

Potential:

```text id="evt109"
qc.started
qc.passed
qc.failed
qc.rework_required
```

---

# 110. Shipment Events

Potential:

```text id="evt110"
shipment.created
shipment.packed
shipment.handed_over
shipment.shipped
shipment.delivered
shipment.failed
shipment.returned
```

---

# 111. Return Events

Potential:

```text id="evt111"
return.requested
return.approved
return.rejected
return.received
return.inspected
return.completed
```

---

# 112. Refund Events

Potential:

```text id="evt112"
refund.requested
refund.approved
refund.completed
refund.failed
```

---

# 113. Customer Events

Potential:

```text id="evt113"
customer.created
customer.lifecycle_changed
customer.reactivated
customer.lapsed
```

---

# 114. Lead Events

Potential:

```text id="evt114"
lead.created
lead.qualified
lead.disqualified
lead.assigned
lead.converted
```

---

# 115. Opportunity Events

Potential:

```text id="evt115"
opportunity.created
opportunity.stage_changed
opportunity.won
opportunity.lost
```

---

# 116. Quote Events

Potential:

```text id="evt116"
quote.created
quote.sent
quote.approved
quote.rejected
quote.expired
quote.revised
```

---

# 117. Project Events

Potential:

```text id="evt117"
project.created
project.started
project.blocked
project.completed
project.cancelled
```

---

# 118. Creator Events

Potential:

```text id="evt118"
creator.applied
creator.approved
creator.activated
creator.paused
creator.offboarded
```

---

# 119. Artwork Events

Potential:

```text id="evt119"
artwork.submitted
artwork.revision_requested
artwork.approved
artwork.production_ready
artwork.rights_expiring
```

---

# 120. Collaboration Events

Potential:

```text id="evt120"
collaboration.proposed
collaboration.approved
collaboration.launched
collaboration.completed
```

---

# 121. Creator Earnings Events

Potential:

```text id="evt121"
earning.created
earning.validated
earning.held
earning.reversed
earning.payable
```

---

# 122. Payout Events

Potential:

```text id="evt122"
payout.prepared
payout.approved
payout.completed
payout.failed
```

---

# 123. Partner Events

Potential:

```text id="evt123"
partner.approved
partner.activated
partner.paused
partner.suspended
partner.offboarded
```

---

# 124. Capability Events

Potential:

```text id="evt124"
capability.activated
capability.updated
capability.deactivated
```

---

# 125. Partner Capacity Events

Potential:

```text id="evt125"
capacity.updated
capacity.limited
capacity.unavailable
```

only when operationally meaningful.

---

# 126. Procurement Events

Potential:

```text id="evt126"
purchase_request.created
purchase_order.approved
purchase_order.issued
goods_receipt.completed
```

---

# 127. Finance Events

Potential:

```text id="evt127"
receivable.created
payable.created
invoice.issued
invoice.overdue
cash_transaction.recorded
```

---

# 128. Treasury Events

Potential:

```text id="evt128"
payment_request.created
payment_request.approved
disbursement.completed
settlement.received
```

---

# 129. Marketing Events

Potential:

```text id="evt129"
campaign.created
campaign.started
campaign.completed
segment.updated
```

---

# 130. Content Events

Potential:

```text id="evt130"
content.idea_created
content.approved
content.published
content.repurposed
content.archived
```

---

# 131. Retention Events

Potential:

```text id="evt131"
review.submitted
referral.created
referral.converted
customer.repeat_order
```

---

# 132. Automation Events

Potential:

```text id="evt132"
automation.started
automation.completed
automation.failed
automation.escalated
```

---

# 133. Approval Events

Potential:

```text id="evt133"
approval.requested
approval.approved
approval.rejected
approval.expired
```

---

# 134. Exception Events

Potential:

```text id="evt134"
exception.opened
exception.assigned
exception.resolved
exception.closed
```

---

# 135. Agent Events

Potential:

```text id="evt135"
agent.run_started
agent.tool_invoked
agent.escalated
agent.run_completed
agent.run_failed
```

---

# 136. Tool Invocation Event

Useful for material tools.

Not every token/model operation needs canonical business event.

---

# 137. Event Granularity

Canonical:

> **Emit events for meaningful business or system facts, not every field mutation.**

---

# 138. Too Few Events

Leads to poor observability and tight coupling.

---

# 139. Too Many Events

Leads to noise and operational complexity.

---

# 140. Event Creation Test

Ask:

```text id="evt140"
WOULD ANOTHER SYSTEM
CARE THAT THIS HAPPENED?

DO WE NEED
HISTORICAL TRACE?

COULD THIS
TRIGGER WORK?

DOES THIS
CHANGE BUSINESS MEANING?
```

---

# 141. Field Change vs Event

Example:

Changing customer typo:

```text id="evt141"
customer.name_corrected
```

may not need broad event distribution.

---

# 142. Material Customer Change

Example:

```text id="evt142"
customer.lifecycle_changed
```

is meaningful.

---

# 143. Event Contract

Each published event should define:

```text id="evt143"
NAME
OWNER
DESCRIPTION
TRIGGER
PAYLOAD
VERSION
CONSUMERS
DELIVERY EXPECTATION
```

---

# 144. Event Registry

MGBOS should eventually maintain canonical Event Registry.

---

# 145. Event Registry Fields

Potential:

```text id="evt145"
Event Type
Owning Domain
Schema Version
Primary Entity
Criticality
Retention
Consumers
Status
```

---

# 146. Event Status

Potential:

```text id="evt146"
DRAFT
ACTIVE
DEPRECATED
RETIRED
```

---

# 147. Deprecation

Old event contract should remain available until consumers migrate.

---

# 148. Breaking Event Change

Requires new schema version.

---

# 149. Additive Change

Can sometimes remain same version if consumers tolerate unknown fields.

Policy must be consistent.

---

# 150. Consumer Contract

Consumers should ignore unknown optional fields where possible.

---

# 151. Required Fields

Envelope required fields should remain stable.

---

# 152. Payload Schema

Use explicit typed contract.

---

# 153. Schema Validation

Producer should validate before publication.

Consumer should validate before acting.

---

# 154. Poison Event

Event with permanently invalid payload should not retry forever.

---

# 155. Dead-Letter Event

Invalid/unprocessable event goes to:

```text id="evt155"
DEAD LETTER / EXCEPTION
```

with diagnostic context.

---

# 156. Event Retry

Transient delivery/consumer failures can retry.

---

# 157. Retry Should Not Republish New Event ID

Same event delivery retry keeps same `event_id`.

---

# 158. New Business Attempt

If business action is retried separately and creates new fact, it may create new event.

---

# 159. Consumer Failure Isolation

One failed consumer should not stop unrelated consumers.

---

# 160. Example

`order.completed` may trigger:

```text id="evt160"
retention
creator earnings
analytics
```

Creator earning failure should not undo Order completion.

---

# 161. Critical vs Non-Critical Consumer

Different response requirements.

---

# 162. Critical Consumer

Examples:

```text id="evt162"
INVENTORY
PAYMENT
FINANCIAL LEDGER
```

---

# 163. Non-Critical Consumer

Examples:

```text id="evt163"
ANALYTICS
EMAIL REPORT
RECOMMENDATION MODEL
```

---

# 164. Critical Consumer Recovery

Must support:

```text id="evt164"
RETRY
RECONCILIATION
EXCEPTION
```

---

# 165. Event Replay

Replay means re-delivering historical events to a consumer.

---

# 166. Replay Use Cases

Potential:

```text id="evt166"
rebuild analytics
new consumer bootstrap
recover lost derived state
```

---

# 167. Replay Risk

Canonical:

> **Replaying an event must not accidentally repeat irreversible external actions.**

---

# 168. Example Dangerous Replay

Historical:

```text id="evt168"
payment.completed
```

must not send shipment again during analytics replay.

---

# 169. Replay-Aware Consumer

Consumer should know context:

```text id="evt169"
LIVE
REPLAY
BACKFILL
```

where necessary.

---

# 170. External Side Effects

Replay should usually disable:

```text id="evt170"
EMAIL
PAYMENT
SHIPMENT
PAYOUT
```

unless intentionally requested.

---

# 171. Event Retention

Different event classes may have different retention.

---

# 172. Financial/Transaction Events

Long retention due to audit/business lineage.

---

# 173. Behavioral Analytics Events

May have shorter/different retention according to privacy/value.

---

# 174. System Debug Events

May expire sooner.

---

# 175. Retention Policy

Should be defined by:

```text id="evt175"
BUSINESS NEED
LEGAL
PRIVACY
STORAGE COST
```

---

# 176. Event Store

Canonical event history can begin as:

```text id="evt176"
DATABASE TABLE / LOG
```

without specialized event-store technology.

---

# 177. Dedicated Event Streaming

Not required early.

---

# 178. Infrastructure Evolution

Canonical:

```text id="evt178"
DATABASE OUTBOX
↓
QUEUE / BROKER
↓
DEDICATED EVENT BUS
↓
STREAMING INFRASTRUCTURE
```

only as scale justifies.

---

# 179. V1 Event Transport

Potential:

```text id="evt179"
MGBOS/API
↓
event table/outbox
↓
n8n / worker
```

---

# 180. V2 Event Transport

Potential message queue/broker.

---

# 181. V3 Event Bus

Used when:

```text id="evt181"
consumer count
volume
reliability
cross-service architecture
```

justify.

---

# 182. Do Not Adopt Kafka Because It Sounds Scalable

Canonical.

---

# 183. Event vs Webhook

Critical:

```text id="evt183"
EVENT
business fact.

WEBHOOK
delivery mechanism.
```

---

# 184. Event vs Queue Job

Canonical:

```text id="evt184"
EVENT
describes fact.

JOB
requests executable work.
```

---

# 185. Example

```text id="evt185"
EVENT:
order.completed

JOB:
send_review_request
```

---

# 186. Event vs Notification

Notification is downstream effect.

---

# 187. Event vs Audit

Critical:

```text id="evt187"
EVENT
what happened in business.

AUDIT
who changed what.
```

---

# 188. Same Action Can Produce Both

Example:

```text id="evt188"
AUDIT:
Rizky approved refund.

EVENT:
refund.approved.
```

---

# 189. Event vs Analytics Event

Transactional event requires strong consistency.

Behavioral analytics may tolerate loss/delay differently.

---

# 190. Analytics Consumption

Canonical events can feed:

```text id="evt190"
ORDER FACTS
REVENUE
FULFILLMENT
RETENTION
CREATOR
PARTNER PERFORMANCE
```

---

# 191. Analytics Should Not Infer Everything from Current State

Historical event time matters.

---

# 192. Example

To calculate:

```text id="evt192"
TIME TO SHIP
```

use timestamps:

```text id="evt193"
order.confirmed
shipment.shipped
```

---

# 194. SLA Analytics

Events provide objective timing.

---

# 195. Funnel Analytics

Behavioral events provide:

```text id="evt195"
product.viewed
cart.created
checkout.started
order.created
```

---

# 196. Funnel Event Volume

May be much higher than business transactional event volume.

---

# 197. Behavioral Event Envelope

Can use lighter schema but should preserve:

```text id="evt197"
event_id
event_type
occurred_at
session/customer
source
context
```

---

# 198. Anonymous Event

Can reference:

```text id="evt198"
anonymous_id
session_id
```

before identity resolution.

---

# 199. Identity Resolution

Future known customer may link anonymous history carefully.

---

# 200. Do Not Overcollect Behavioral Data

Canonical.

---

# 201. Automation Triggering

Automation should subscribe to stable canonical events.

---

# 202. Good Trigger

```text id="evt202"
payment.completed
```

---

# 203. Bad Trigger

```text id="evt203"
database row changed
```

when business meaning is unclear.

---

# 204. n8n Trigger Example

```text id="evt204"
lead.created
↓
AUT-SALES-QUALIFY-001
```

---

# 205. Workflow Trigger Record

Should preserve triggering `event_id`.

---

# 206. Automation Causation

Workflow-generated event can reference original event.

---

# 207. Example

```text id="evt207"
lead.created
↓
automation
↓
lead.qualified
```

with:

```text id="evt208"
causation_id = lead.created event
```

---

# 209. Event Chains

Useful for Jarvis and incident tracing.

---

# 210. Jarvis Question Example

> Kenapa order ini belum dikirim?

Jarvis can inspect:

```text id="evt210"
order.created
payment.completed
inventory.reserved
production_job.created
work_order.blocked
```

to identify blocker.

---

# 211. Jarvis Should Use Event History

Not only current status.

---

# 212. Current Status Tells What

Event history tells why/how.

---

# 213. AI Event Consumption

Agents may subscribe indirectly to events through automation layer.

---

# 214. Agent Trigger Example

```text id="evt214"
exception.opened
↓
Agent summarizes cause
↓
human receives recommendation
```

---

# 215. Agent Should Not Subscribe to Everything

Canonical.

---

# 216. Event Filtering

Use:

```text id="evt216"
event_type
entity
business_unit
risk
```

to route relevant events.

---

# 217. AI Enrichment Event

Potential:

```text id="evt217"
lead.classification_completed
```

if classification itself becomes operationally meaningful.

---

# 218. AI Recommendation Event

Potential:

```text id="evt218"
recommendation.generated
```

but recommendation remains non-authoritative.

---

# 219. Decision Event

If human accepts recommendation:

```text id="evt219"
routing.approved
```

or domain-specific event.

---

# 220. AI Does Not Emit Canonical Business Completion Without Tool Confirmation

Canonical.

---

# 221. Example

Agent cannot merely say:

> payout completed.

Treasury/payment system must confirm and emit:

```text id="evt221"
payout.completed
```

---

# 222. Event Criticality

Potential classification:

```text id="evt222"
CRITICAL
IMPORTANT
INFORMATIONAL
ANALYTICAL
```

---

# 223. Critical Events

Potential:

```text id="evt223"
payment.completed
order.created
inventory.adjusted
payout.completed
```

---

# 224. Important Events

Potential:

```text id="evt224"
work_order.blocked
qc.failed
shipment.delayed
```

---

# 225. Informational Events

Potential:

```text id="evt225"
content.published
creator.profile_updated
```

---

# 226. Analytical Events

High-volume behavior.

---

# 227. Criticality Affects

```text id="evt227"
delivery guarantees
monitoring
retention
alerting
```

---

# 228. Event Monitoring

MGBOS should eventually monitor:

```text id="evt228"
PUBLISH FAILURE
DELIVERY FAILURE
CONSUMER LAG
DEAD LETTERS
```

---

# 229. Event Lag

Measures delay between:

```text id="evt229"
occurred
published
processed
```

---

# 230. Consumer Lag

Important for near-real-time operations.

---

# 231. Event Dashboard

Potential:

```text id="evt231"
EVENTS / MIN
FAILED PUBLICATIONS
FAILED CONSUMERS
DLQ
TOP EVENT TYPES
PROCESSING LAG
```

---

# 232. Business Event Timeline

Entity detail pages should show meaningful events.

---

# 233. Order Timeline Example

```text id="evt233"
Order Created
Payment Completed
Production Released
QC Passed
Shipment Shipped
Delivered
```

---

# 234. Raw Technical Events Should Be Hidden from Normal Operators

Unless troubleshooting.

---

# 235. User-Friendly Event Labels

Canonical event:

```text id="evt235"
work_order.acknowledged
```

UI:

```text id="evt236"
Partner confirmed Work Order
```

---

# 237. Event Localization

UI can localize labels.

Canonical event type remains stable.

---

# 238. Event Source-of-Truth

Event fact belongs to authoritative producer.

---

# 239. Consumer Should Not Rewrite Producer Event

Canonical.

---

# 240. Derived Event

Consumer may produce a new domain event from its own domain.

---

# 241. Example

```text id="evt241"
payment.completed
↓
Commerce validates order
↓
order.confirmed
```

---

# 242. Avoid Event Echo

Systems should not republish identical fact endlessly.

---

# 243. Event Loop Protection

Potential:

```text id="evt243"
source
event_id
causation
```

used to prevent loops.

---

# 244. Integration Echo Example

```text id="evt244"
TEEStock updates marketplace
→ marketplace webhook
→ TeeStock thinks new change
→ updates marketplace again
```

must be prevented.

---

# 245. Origin Metadata

Can preserve external origin.

---

# 246. Reconciliation Events

Potential:

```text id="evt246"
payment.reconciled
inventory.reconciled
settlement.reconciled
```

where material.

---

# 247. Reconciliation Is Different from Initial Event

Example:

```text id="evt247"
payment.completed
```

means transaction success.

```text id="evt248"
settlement.reconciled
```

means financial settlement matched later.

---

# 249. Scheduled Events

Some business facts arise from time.

Examples:

```text id="evt249"
invoice.overdue
agreement.expiring
rights.expiring
```

---

# 250. Temporal Event Generation

Scheduled worker evaluates condition then emits semantic event.

---

# 251. Example

```text id="evt251"
current_date > invoice_due_date
AND unpaid
↓
invoice.overdue
```

---

# 252. Avoid Repeated Daily Duplicate Overdue Event

Emit once per state transition or defined reminder event.

---

# 253. Reminder Event

Different concept:

```text id="evt253"
invoice.overdue_reminder_due
```

if operationally useful.

---

# 254. Effective-Date Events

Potential:

```text id="evt254"
price.activated
agreement.expired
promotion.started
promotion.ended
```

---

# 255. Event Clock

Use canonical system time.

---

# 256. Business Timezone

Human schedules may use:

```text id="evt256"
Asia/Jakarta
```

while storage should use offset-aware/UTC-safe timestamps at implementation level.

---

# 257. Event Schema Example

Conceptual:

```text id="evt257"
{
  "event_id": "...",
  "event_type": "order.created",
  "event_version": 1,
  "occurred_at": "...",
  "recorded_at": "...",
  "entity_type": "Order",
  "entity_id": "...",
  "business_unit_id": "...",
  "actor": {
    "type": "Customer",
    "id": "..."
  },
  "source": "commerce",
  "correlation_id": "...",
  "causation_id": "...",
  "payload": {}
}
```

---

# 258. Payload Should Avoid UI Formatting

Store machine facts.

Presentation happens downstream.

---

# 259. Currency Example

Financial event should include:

```text id="evt259"
amount
currency
```

not formatted `"Rp100.000"`.

---

# 260. Quantity Example

Include:

```text id="evt260"
quantity
unit
```

where relevant.

---

# 261. Event Entity References

Use canonical immutable IDs.

---

# 262. Human Business Number

Can optionally be included for convenience.

But consumers should use internal ID.

---

# 263. External Reference

May be included when source is external.

---

# 264. Event Sensitive Data

Prefer:

```text id="evt264"
customer_id
```

over:

```text id="evt265"
full customer profile
```

---

# 266. Event Data Minimization

Canonical.

---

# 267. Event Ownership Registry

Example:

```text id="evt267"
order.created
Owner: Commerce

payment.completed
Owner: Finance/Payment

work_order.issued
Owner: Production

earning.created
Owner: Creator/Finance
```

---

# 268. Cross-Domain Event Naming

Use subject domain/entity, not consumer domain.

---

# 269. Example

Payment completing an Order is still:

```text id="evt269"
payment.completed
```

not:

```text id="evt270"
order.payment_event
```

---

# 271. Consumer-Specific Events

Avoid unless they represent real domain fact.

---

# 272. Event Aggregation

Some high-volume low-level events may aggregate for analytics.

---

# 273. But Transactional Facts Stay Individual

Canonical.

---

# 274. Event Compression

Infrastructure implementation may archive/compress old events.

Semantic accessibility should remain where required.

---

# 275. Event Migrations

If underlying canonical entity ID changes due merge:

event history should retain original entity reference plus mapping.

---

# 276. Historical Event Integrity

Do not rewrite old event subject to pretend history was different.

---

# 277. Entity Merge

Future read layer can resolve:

```text id="evt277"
old_customer_id
→ canonical_customer_id
```

---

# 278. Event Environment

Events should know:

```text id="evt278"
DEV
STAGING
PRODUCTION
```

through transport/environment isolation.

---

# 279. Never Mix Test and Production Event Streams

Canonical.

---

# 280. Staging Events

Must never trigger production:

```text id="evt280"
payments
messages
shipments
```

---

# 281. Event Security

Producer/consumer should authenticate.

---

# 282. Event Authorization

Not every consumer can subscribe to every event.

---

# 283. Restricted Event Data

Financial/sensitive domains need stricter subscriptions.

---

# 284. Event Signing

May be useful for external webhooks.

---

# 285. Webhook Verification

Validate:

```text id="evt285"
signature
timestamp
source
event ID
```

where supported.

---

# 286. Replay Attack Protection

External high-risk callbacks may need timestamp/idempotency controls.

---

# 287. Event Tampering

Canonical persisted events should be protected from unauthorized modification.

---

# 288. Event Audit

Material event publication failures should be auditable.

---

# 289. Event Documentation

Each event should document example payload.

---

# 290. Event Documentation Should Be Generated from Schema Eventually

Reduces drift.

---

# 291. V1 Event Registry

Initial critical events:

```text id="evt291"
lead.created
lead.qualified

order.created
order.cancelled

payment.completed
payment.failed

inventory.reserved
inventory.released

production_job.created
work_order.issued
work_order.blocked

qc.passed
qc.failed

shipment.shipped
shipment.delivered

return.requested
refund.completed

creator.approved
artwork.approved
earning.created
payout.completed

automation.failed
exception.opened
approval.requested
```

---

# 292. V1 Event Storage

At minimum store:

```text id="evt292"
event_id
event_type
occurred_at
entity_type
entity_id
source
payload
correlation_id
```

---

# 293. V1 Event Delivery

Recommended:

```text id="evt293"
MGBOS / DOMAIN APP
↓
EVENT / OUTBOX TABLE
↓
n8n / WORKER
```

---

# 294. V1 Critical Requirement

Payment, order, inventory, production, payout events must not depend only on transient webhook execution.

---

# 295. V1 n8n

n8n can:

```text id="evt295"
consume events
route workflows
send notifications
call integrations
open exceptions
```

---

# 296. V1 Avoid

Do not immediately build:

```text id="evt296"
KAFKA CLUSTER
EVENT SOURCING EVERY ENTITY
HUNDREDS OF EVENT TYPES
FULL CQRS PLATFORM
COMPLEX SCHEMA REGISTRY INFRA
```

---

# 297. Event Sourcing

Canonical:

> **TeeStock does not need full event sourcing merely because it uses events.**

---

# 298. Event-Driven ≠ Event-Sourced

Critical:

```text id="evt298"
EVENT-DRIVEN
uses events for coordination.

EVENT-SOURCED
uses event history as primary state source.
```

---

# 299. Recommended V1

Canonical state remains in normal domain records.

Events provide history/integration.

---

# 300. Event Sourcing Gate

Consider only for domains where:

```text id="evt300"
full historical reconstruction
complex temporal logic
ledger requirements
```

create sufficient value.

---

# 301. Ledger Domains

Inventory/Earnings/Cash already use ledger-like patterns.

Do not force same approach on every domain.

---

# 302. CQRS

Can become useful later for complex read models.

Not V1 requirement.

---

# 303. Event Infrastructure Maturity

```text id="evt303"
LEVEL 0
Direct synchronous coupling

LEVEL 1
Canonical event records + n8n triggers

LEVEL 2
Outbox + reliable queue

LEVEL 3
Central event bus + schema registry

LEVEL 4
Real-time cross-domain orchestration

LEVEL 5
AI-aware enterprise event fabric
```

---

# 304. Level 0

Anti-goal:

```text id="evt304"
Payment code
directly calls
inventory
email
shipping
creator payout
analytics
```

in one fragile chain.

---

# 305. Level 1

Build:

```text id="evt305"
EVENT RECORD
EVENT NAME
EVENT ID
CONSUMER WORKFLOW
```

---

# 306. Level 2

Add:

```text id="evt306"
OUTBOX
QUEUE
RETRY
DLQ
IDEMPOTENCY
```

---

# 307. Level 3

Add:

```text id="evt307"
SCHEMA REGISTRY
CONSUMER OWNERSHIP
EVENT MONITORING
```

---

# 308. Level 4

Add:

```text id="evt308"
REAL-TIME CROSS-DOMAIN EVENTING
REPLAY
MULTI-SERVICE ARCHITECTURE
```

---

# 309. Level 5

Jarvis/agents can understand business activity from canonical event stream.

---

# 310. Current Recommended Stage

TeeStock should target:

```text id="evt310"
LEVEL 1
→
LEVEL 2
```

while keeping contracts compatible with future event bus.

---

# 311. Event Creation Gate

Create canonical event when:

```text id="evt311"
MEANINGFUL BUSINESS FACT
+
DOWNSTREAM VALUE
+
HISTORICAL VALUE
```

exists.

---

# 312. Event Publication Gate

Publish only after authoritative state transaction succeeds.

---

# 313. External Event Acceptance Gate

Require:

```text id="evt313"
AUTHENTIC SOURCE
+
VALID SCHEMA
+
VALID MAPPING
+
IDEMPOTENCY
```

---

# 314. Consumer Execution Gate

Before irreversible action:

```text id="evt314"
EVENT VALID
+
STATE STILL ELIGIBLE
+
ACTION IDEMPOTENT
```

---

# 315. Replay Gate

Replay only when:

```text id="evt315"
CONSUMER REPLAY-SAFE
+
SIDE EFFECT POLICY DEFINED
```

---

# 316. Schema Change Gate

Breaking changes require:

```text id="evt316"
NEW VERSION
+
MIGRATION PLAN
+
CONSUMER REVIEW
```

---

# 317. Event Retirement Gate

Only after all known consumers migrate and historical contract remains understandable.

---

# 318. Event Failure Modes

## Event Before Commit

Consumers react to state that never became true.

## Database Changed but Event Lost

Systems drift.

## Event Has No ID

Duplicates cannot be controlled.

## Event Is a Command

Semantic confusion.

## Generic `record.updated`

No business meaning.

## Huge Payload

Privacy/coupling problems.

## No Version

Contract changes break consumers.

---

# 319. Consumer Failure Modes

## No Idempotency

Duplicate business effects.

## Retry Forever

Incident amplification.

## Assume Global Ordering

Stale state corruption.

## Replay Sends Customer Messages

Unexpected side effects.

## Consumer Mutates Producer State Directly

Domain coupling.

---

# 320. Integration Failure Modes

## External Webhook Trusted Blindly

Security/integrity risk.

## External Schema Becomes Canonical Schema

Vendor lock-in.

## External Event Republished Without Normalization

Semantic fragmentation.

## Sync Echo Loop

Infinite updates.

---

# 321. What Event Model Must Not Become

## Technical Noise Stream

Business meaning first.

## Event-for-Every-Field Architecture

Avoid meaningless volume.

## Kafka-First Project

Infrastructure follows need.

## Hidden Business Logic

Rules still belong in domain/workflow policy.

## Audit Replacement

Event and audit serve different purposes.

## AI Activity Dump

Only material agent activity should become business/system events.

---

# 322. Event Model Success Definition

The system succeeds when TeeStock can answer:

```text id="evt322"
WHAT HAPPENED?

WHEN DID IT HAPPEN?

WHICH ENTITY
did it affect?

WHO / WHAT
caused it?

WHICH SYSTEM
recorded it?

WHAT
caused this event?

WHAT OTHER EVENTS
belong to the same business flow?

HAS THIS EVENT
already been processed?

WHAT AUTOMATIONS
reacted to it?

WHAT FAILED?

CAN WE
replay it safely?

CAN JARVIS
explain how current state was reached?
```

---

# 323. Canonical Event Summary

```text id="evt323"
STATE
tells what is true now.

EVENT
tells what happened.

COMMAND
asks for change.

CORRELATION
connects the journey.

CAUSATION
connects cause and effect.

OUTBOX
protects state/event consistency.

IDEMPOTENCY
protects against duplicates.

QUEUE
protects execution reliability.

DLQ
isolates failures.

ANALYTICS
learns from history.

AUTOMATION
reacts to facts.

JARVIS
reasons across the event trail.
```

---

# 324. Canonical Event Principles

```text id="evt324"
STATE TELLS US WHAT IS TRUE NOW. EVENTS TELL US WHAT HAPPENED.

EVENTS ARE FACTS, NOT COMMANDS.

THE DOMAIN THAT OWNS THE STATE CHANGE OWNS THE EVENT.

PUBLISH AFTER COMMIT.

EVENTS SHOULD BE IMMUTABLE.

MEANING BEFORE IMPLEMENTATION.

SEMANTIC EVENTS BEFORE GENERIC UPDATE EVENTS.

EVERY EVENT NEEDS A UNIQUE ID.

AT-LEAST-ONCE DELIVERY REQUIRES IDEMPOTENT CONSUMERS.

DO NOT ASSUME GLOBAL ORDERING.

CORRELATION CONNECTS FLOWS. CAUSATION CONNECTS DIRECT CAUSES.

EXTERNAL EVENTS MUST BE VERIFIED AND NORMALIZED.

OUTBOX BEFORE FRAGILE DUAL WRITES.

REPLAY MUST NOT DUPLICATE IRREVERSIBLE SIDE EFFECTS.

EVENTS DO NOT REPLACE AUDIT LOGS.

EVENT-DRIVEN DOES NOT MEAN EVENT-SOURCED.

ANALYTICAL EVENTS AND TRANSACTIONAL EVENTS HAVE DIFFERENT RELIABILITY NEEDS.

AI MAY CONSUME EVENTS. AUTHORITATIVE DOMAINS EMIT BUSINESS TRUTH.

MGBOS SHOULD BE ABLE TO EXPLAIN CURRENT STATE THROUGH EVENT HISTORY.
```

---

# 325. Dependency

Dokumen berikut harus follow Event Model:

1. [[bisnis/teestock/11-data-mgbos/mgbos-integration|mgbos-integration.md]]
2. [[bisnis/teestock/11-data-mgbos/analytics-model|analytics-model.md]]
3. [[bisnis/teestock/12-legal-ip/ip-policy|ip-policy.md]]
4. [[bisnis/teestock/13-metrics-experiments/kpi-framework|kpi-framework.md]]
5. [[bisnis/teestock/13-metrics-experiments/experimentation-framework|experimentation-framework.md]]
6. [[bisnis/teestock/13-metrics-experiments/decision-thresholds|decision-thresholds.md]]
7. [[bisnis/teestock/14-roadmap/master-roadmap|master-roadmap.md]]
8. [[bisnis/teestock/14-roadmap/capability-roadmap|capability-roadmap.md]]

TeeStock Event Model boleh berkembang dari database-backed canonical events dan n8n consumers menjadi reliable queue/event bus, real-time cross-domain event fabric, dan akhirnya AI-aware enterprise activity layer untuk MultiGraph Group, tetapi infrastructure hanya boleh bertambah setelah event semantics, ownership, idempotency, contracts, retry behavior, observability, and recovery sudah menjadi reliable operating discipline.