---
canonical_id: mgbos.architecture.command-event-model
status: ACTIVE
version: 1.0
owner: Rizky
author: OpenAI / ChatGPT
approver: Rizky
scope: mgbos
document_class: canonical-specification
effective_from: 2026-09-29
authoritative_for:
  - mgbos command semantics
  - mgbos query-command separation
  - command execution lifecycle
  - command identity and idempotency
  - actor and request context
  - business event semantics
  - event envelope
  - audit-event separation
  - transactional outbox semantics
  - inbound external event handling
  - JARVIS and n8n mutation boundary
  - event delivery and consumer expectations
last_reviewed: 2026-09-29
review_cadence: quarterly
depends_on:
  - ../../../../docs/governance/documentation-constitution.md
  - ../../../../docs/governance/canonical-source-map.md
  - ../../../../docs/architecture/master-system-blueprint.md
  - ../../../../docs/architecture/system-boundaries.md
  - ../../../../docs/architecture/architectural-laws.md
  - canonical-data-model.md
  - business-state-machines.md
  - business-invariants.md
  - README.md
  - ../adr/004-n8n-orchestrator.md
  - ../adr/005-transactional-outbox.md
  - ../adr/006-ai-gateway.md
supersedes: null
implementation_basis:
  - ../../supabase/migrations/
  - ../../packages/events/
implementation_through: MGBOS-020
---

# MGBOS Command & Event Model v1.0

## 1. Purpose

Dokumen ini mendefinisikan bagaimana perubahan bisnis:

```text id="aw0iqo"
masuk ke MGBOS
```

dan bagaimana fakta bisnis:

```text id="5700xz"
keluar dari MGBOS
```

secara aman.

Canonical pattern:

```text id="5vjol3"
INTENT
  ↓
COMMAND
  ↓
AUTHORIZATION
  ↓
VALIDATION
  ↓
BUSINESS RULES
  ↓
TRANSACTION
  ↓
STATE CHANGE
  ├── AUDIT
  └── BUSINESS EVENT
          ↓
        OUTBOX
          ↓
       CONSUMERS
```

---

# 2. Fundamental Principle

> **Commands request change. Events report facts.**

Command menggunakan bentuk imperative:

```text id="2qt8id"
CreateOrder
RecordPayment
ReserveInventory
DispatchShipment
```

Event menggunakan bentuk past-tense fact:

```text id="ohqziq"
OrderCreated
PaymentRecorded
InventoryReserved
ShipmentDispatched
```

Keduanya MUST NOT diperlakukan sebagai konsep yang sama.

---

# 3. Current Implementation State

Saat dokumen ini diaktifkan:

## Command Boundary

```text id="qobzu8"
CURRENT / IMPLEMENTED
```

MGBOS sudah memiliki banyak authoritative mutation functions dengan pola:

```text id="ord9ce"
organization context
actor context
authorization
validation
row locking
business guards
transaction
audit
structured result
```

Contoh:

```text id="867htr"
save_quote_version(...)
mark_quote_sent(...)
mark_quote_accepted(...)
create_order_from_quote(...)
transition_production_job_status(...)
record_payment_and_allocate(...)
reserve_inventory_for_order(...)
dispatch_shipment(...)
receive_purchase_order_items(...)
pay_vendor_bill(...)
```

---

# 4. Current Event Implementation State

Full business event runtime saat ini:

```text id="sa44xv"
NOT YET IMPLEMENTED
```

Current repository contains:

```text id="fuwjh3"
@mgbos/events
```

as a reserved boundary.

It currently contains no production event implementation.

---

# 5. Current Outbox State

Transactional Outbox is:

```text id="ke9x79"
ACCEPTED ARCHITECTURAL PATTERN
+
NOT YET IMPLEMENTED AS A VERIFIED PRODUCTION SLICE
```

This follows ADR-005.

No system SHOULD claim:

```text id="f1gqp7"
"MGBOS events are already reliably dispatched"
```

until implementation evidence exists.

---

# 6. Command Definition

A Command is:

> **an explicit request to MGBOS to perform a business operation that may change authoritative state.**

Examples:

```text id="3g5nvd"
QualifyLead
SendQuote
AcceptQuote
CreateOrderFromQuote
AssignProductionJob
RecordPayment
ReserveInventory
ReceivePurchaseOrder
DispatchShipment
```

---

# 7. Query Definition

A Query is:

> **a request to retrieve information without changing authoritative business state.**

Examples:

```text id="cabfuj"
GetOrder
GetInvoice
GetCustomerHistory
GetInventoryAvailability
GetProductionExceptions
GetFinancialSummary
```

---

# 8. Conceptual CQRS Only

MGBOS uses command/query separation conceptually.

It does NOT require full CQRS infrastructure.

Current architecture remains:

```text id="c5171p"
Modular Monolith
+
PostgreSQL
```

We separate semantics, not necessarily deployment.

---

# 9. Query Must Not Produce Hidden Mutation

A Query MUST NOT secretly perform a business mutation.

Bad:

```text id="vl48i2"
get_order()
→ also marks order as reviewed
```

If mutation is required, expose it explicitly as a Command.

---

# 10. Command Naming

Canonical logical format SHOULD be:

```text id="mi316u"
mgbos.<resource>.<action>
```

Examples:

```text id="8p3809"
mgbos.lead.qualify
mgbos.quote.send
mgbos.quote.accept
mgbos.order.create_from_quote
mgbos.production.assign
mgbos.payment.record
mgbos.inventory.reserve
mgbos.shipment.dispatch
```

Naming describes business capability.

Not implementation technology.

---

# 11. Command Names Must Not Encode Provider

Avoid:

```text id="1ctyk9"
supabase_record_payment
postgres_create_order
n8n_reserve_inventory
```

Prefer:

```text id="cbz2oc"
mgbos.payment.record
mgbos.order.create
mgbos.inventory.reserve
```

Providers are replaceable implementation details.

---

# 12. Command Contract

Every material command SHOULD have an explicit contract containing:

```text id="b5cl4b"
name
version
purpose
actor requirements
organization scope
input schema
authorization requirements
business preconditions
idempotency behavior
transaction boundary
possible results
possible failures
audit behavior
event behavior
```

---

# 13. Canonical Command Envelope

Target logical envelope:

```yaml id="jkagha"
command_id: 'uuid'
command_name: 'mgbos.payment.record'
command_version: 1

organization_id: 'uuid'

actor:
  type: HUMAN
  principal_id: 'uuid'

idempotency_key: 'uuid'

correlation_id: 'uuid'
causation_id: null

issued_at: '2026-09-29T10:00:00Z'

payload: ...
```

This envelope describes semantic intent.

Transport MAY differ.

---

# 14. `command_id`

`command_id` identifies one logical command.

Retrying the same logical command SHOULD preserve the same command identity or equivalent idempotency identity.

A transport retry is not a new business intent.

---

# 15. Idempotency Key

`idempotency_key` protects against duplicate business effects.

Canonical semantics:

```text id="h9xt92"
same idempotency key
+
same business intent
=
same business effect
```

It MUST NOT create another transaction.

---

# 16. Current `request_id`

Several current MGBOS flows already use:

```text id="00ki1m"
request_id
```

for idempotency.

This is the current physical representation of the logical idempotency concept.

Future APIs MAY expose:

```text id="f7wskj"
idempotency_key
```

while mapping it internally to `request_id`.

---

# 17. Strong Idempotency

Preferred standard:

```text id="lkq76e"
same key + same payload
→ replay original result

same key + materially different payload
→ IDEMPOTENCY_CONFLICT
```

Current quote versioning already approaches this model.

All high-value mutation commands SHOULD eventually converge on it.

---

# 18. Correlation ID

`correlation_id` groups related actions into one larger business process.

Example:

```text id="lbuenj"
Customer Checkout
      │
      ├── OrderCreated
      ├── InventoryReserved
      ├── InvoiceIssued
      └── PaymentRecorded
```

All may share:

```text id="v991fd"
correlation_id = abc123
```

---

# 19. Causation ID

`causation_id` identifies the direct reason a command/event occurred.

Example:

```text id="jkzovx"
event:
mgbos.quote.accepted
event_id: EVT-1

        ↓ causes

command:
mgbos.order.create_from_quote
causation_id: EVT-1
```

Correlation answers:

> Which workflow is this part of?

Causation answers:

> What directly triggered this?

---

# 20. Correlation Is Not Authority

Having a valid correlation ID does not authorize a command.

It exists for traceability.

Permission remains separately evaluated.

---

# 21. Actor Context

Every material command SHOULD contain trusted actor context.

Target actor types:

```text id="lgmv2y"
HUMAN
SERVICE
JARVIS
AUTOMATION
SYSTEM
```

---

# 22. Current Human Actor Model

Current database command functions commonly accept:

```text id="463pr8"
p_actor_id
```

mapped to MGBOS users/membership/role.

This is CURRENT.

---

# 23. Future Service Principals

JARVIS and n8n MUST NOT impersonate a human merely because current commands expect `actor_id`.

Future runtime needs explicit service-principal semantics.

Example:

```yaml id="n1n7ai"
actor:
  type: JARVIS
  principal_id: jarvis-runtime

on_behalf_of:
  type: HUMAN
  principal_id: rizky
```

when an approved human decision is being executed.

---

# 24. `on_behalf_of`

Delegated execution SHOULD distinguish:

```text id="o3oqqh"
who executed
```

from:

```text id="39jp12"
whose authority authorized it
```

Example:

```text id="oyg8gj"
Executor:
JARVIS

Approved by:
Rizky
```

This prevents misleading audit history.

---

# 25. Command Authorization

Every consequential command passes:

```text id="ft4tv3"
ACTOR
  +
ORGANIZATION
  +
CAPABILITY
  +
CURRENT STATE
  +
POLICY
```

before mutation.

Possession of a command name does not grant its use.

---

# 26. Command Authorization vs Business Validation

These are separate.

Authorization asks:

> May this actor attempt this operation?

Validation asks:

> Is this operation valid given current business state?

Example:

```text id="ndzk0u"
Finance role
may record payment

BUT

allocation > invoice balance
→ still rejected
```

---

# 27. Command Execution Pipeline

Canonical pipeline:

```text id="e1t1oi"
Receive command
      ↓
Validate envelope
      ↓
Authenticate principal
      ↓
Resolve organization
      ↓
Authorize capability
      ↓
Validate input
      ↓
Load authoritative state
      ↓
Lock where necessary
      ↓
Check state machine
      ↓
Check business invariants
      ↓
Execute mutation
      ↓
Write audit
      ↓
Write business event/outbox when required
      ↓
Commit
      ↓
Return result
```

---

# 28. Commands Should Be Atomic

One business command should produce one coherent authoritative outcome.

Example:

```text id="0ge7kp"
RecordPayment
```

may require:

```text id="1nhrio"
create payment
create allocations
update invoice balances
write audit
write ledger entries
```

These must not leave inconsistent half-results.

---

# 29. One Command May Touch Several Entities

Atomicity does not mean:

```text id="t85nbb"
one command
=
one table
```

A business operation often spans several tables.

The boundary is business meaning.

Not SQL table count.

---

# 30. One Command May Produce Zero or More Events

Not every mutation deserves an external event.

Example:

```text id="6flfw8"
internal metadata update
```

may not matter outside MGBOS.

A material business transition may produce one or multiple events.

---

# 31. Command Results

Synchronous command result SHOULD return enough information to identify the result.

Example:

```yaml id="2i0iww"
command_id: '...'
status: SUCCEEDED

result:
  order_id: '...'
  order_number: 'TS-O-2026-000001'

idempotent_replay: false
```

---

# 32. Canonical Command Result States

Logical result states include:

```text id="fr9u4t"
SUCCEEDED
REJECTED
IDEMPOTENT_REPLAY
```

For asynchronous/external workflows, other orchestration states MAY exist:

```text id="8qstdo"
ACCEPTED
PENDING
UNKNOWN
```

but they MUST NOT be confused with completed business success.

---

# 33. Rejected Commands

A rejected command MUST NOT create the requested business mutation.

Typical reason categories:

```text id="0q9qlu"
VALIDATION_FAILED
AUTHORIZATION_DENIED
NOT_FOUND
STATE_CONFLICT
INVARIANT_VIOLATION
IDEMPOTENCY_CONFLICT
CONCURRENCY_CONFLICT
```

---

# 34. Failure Is Not an Event of Success

If:

```text id="55fczt"
RecordPayment
```

is rejected,

MGBOS MUST NOT emit:

```text id="c4d3fy"
PaymentRecorded
```

A failure/denial may belong in observability/security history.

It is not a successful domain fact.

---

# 35. Business Event Definition

A Business Event is:

> **an immutable statement that a meaningful business fact occurred inside MGBOS.**

Examples:

```text id="fz2dv1"
mgbos.lead.qualified
mgbos.quote.sent
mgbos.quote.accepted
mgbos.order.created
mgbos.production.started
mgbos.qc.inspection_failed
mgbos.payment.recorded
mgbos.shipment.dispatched
```

---

# 36. Event Naming

Canonical format SHOULD be:

```text id="yeab8x"
mgbos.<resource>.<past_tense_fact>
```

Examples:

```text id="trqlxa"
mgbos.order.created
mgbos.invoice.issued
mgbos.payment.reversed
mgbos.inventory.reserved
mgbos.purchase_order.received
```

---

# 37. Event Names Describe Business Facts

Bad:

```text id="w8p8ui"
orders_table_updated
sql_trigger_fired
api_call_completed
```

Good:

```text id="gpgh4m"
mgbos.order.created
mgbos.payment.recorded
```

Consumers should understand business meaning without knowing database implementation.

---

# 38. Canonical Event Envelope

Target:

```yaml id="l952zv"
event_id: 'uuid'
event_name: 'mgbos.payment.recorded'
event_version: 1

organization_id: 'uuid'

aggregate:
  type: payment
  id: 'uuid'

occurred_at: '2026-09-29T10:01:04Z'

actor:
  type: HUMAN
  principal_id: 'uuid'

correlation_id: 'uuid'
causation_id: 'uuid'

payload:
  payment_id: 'uuid'
  invoice_ids:
    - 'uuid'
  amount: 10000000
  currency: IDR
```

---

# 39. Event ID

`event_id` MUST uniquely identify one business event.

Redelivery MUST preserve the same `event_id`.

Consumer deduplication can therefore operate on:

```text id="slgwx3"
event_id
```

---

# 40. Event Version

`event_version` versions the event contract.

It does NOT represent aggregate version.

Example:

```text id="kzrxbt"
mgbos.payment.recorded
event_version: 1
```

may later become version 2 if contract changes incompatibly.

---

# 41. Event Time

`occurred_at` represents when the authoritative business fact occurred.

Transport metadata such as:

```text id="leub1e"
published_at
received_at
retried_at
```

is separate.

---

# 42. Aggregate Identity

An event SHOULD identify its primary aggregate.

Example:

```yaml id="61so90"
aggregate:
  type: shipment
  id: '...'
```

Consumers SHOULD NOT infer identity solely from human document number.

---

# 43. Event Payload Principle

Event payload SHOULD contain:

> **minimum sufficient immutable fact.**

Avoid publishing huge full database records by default.

Prefer:

```text id="07hvas"
entity IDs
important changed facts
relevant immutable values
```

Consumers needing current state can query MGBOS.

---

# 44. Event Payload Must Minimize Sensitive Data

Do not automatically publish:

```text id="4hkyk0"
full customer profile
bank information
private notes
credentials
PII snapshots
```

unless a legitimate consumer requires them.

Event distribution increases data exposure.

---

# 45. Event Is a Historical Fact, Not Current State

Example:

```text id="ocnyuk"
PaymentRecorded
```

means a payment was recorded.

It does not prove the payment is still current.

A later event may exist:

```text id="xu3swn"
PaymentReversed
```

Critical consumers SHOULD re-read current state when necessary.

---

# 46. Audit Is Not Event

Audit and Event serve different purposes.

## Audit

Answers:

```text id="yrbpef"
who did what
when
why
with what context
```

## Business Event

Answers:

```text id="km2opn"
what business fact occurred
that another system may care about
```

---

# 47. Current Audit Actions Are Not Automatically Event Contracts

Current strings such as:

```text id="p7hitg"
quote.sent
payment.recorded
shipment.dispatched
```

inside domain audit tables may look event-like.

They are still:

```text id="2fxf44"
AUDIT ACTIONS
```

until explicitly promoted into versioned business-event contracts.

---

# 48. Not Every Audit Produces an Event

Example:

```text id="gkb3ch"
quote.price_override_approved
```

might be relevant only for audit/internal logic.

If no consumer requires it, no integration event is necessary.

---

# 49. Not Every Event Needs a Human-Facing Audit Row

Some technical integration events may exist without requiring dedicated human-visible audit presentation.

But material business mutation SHOULD remain auditable.

---

# 50. Domain Event vs Integration Event

MGBOS MAY conceptually distinguish:

## Domain Event

Internal business occurrence.

## Integration Event

Stable external-facing representation intended for consumers.

For v1 these MAY use the same logical contract when appropriate.

Do not introduce two infrastructures until need exists.

---

# 51. Transactional Outbox Principle

When a business event has external consumers:

```text id="le1r91"
STATE MUTATION
+
OUTBOX RECORD
```

MUST be committed atomically.

Canonical:

```text id="uxbrz0"
BEGIN
  mutate business state
  write audit
  write event/outbox
COMMIT
```

---

# 52. Forbidden Event Publication Pattern

Do NOT make external network call inside critical transaction:

```text id="utggrl"
BEGIN

update order

HTTP → n8n

COMMIT
```

because:

```text id="stkh5c"
HTTP success + DB rollback
```

or:

```text id="6ulv5k"
DB commit + HTTP failure
```

creates ambiguity.

---

# 53. Outbox Purpose

Outbox solves:

```text id="cs94s3"
"business transaction committed,
but integration publication failed"
```

The event remains recoverable after commit.

---

# 54. Target Outbox Record

Logical future record:

```yaml id="i10g5j"
id: 'uuid'
event_id: 'uuid'

event_name: 'mgbos.order.created'
event_version: 1

organization_id: 'uuid'

payload: ...

status: PENDING

attempt_count: 0
next_attempt_at: null
published_at: null
last_error: null

created_at: '...'
```

Exact physical schema belongs to implementation.

---

# 55. Outbox Delivery States

Possible dispatcher states:

```text id="x9qjen"
PENDING
PROCESSING
PUBLISHED
FAILED
```

These are infrastructure delivery states.

They MUST NOT become business lifecycle states.

---

# 56. Outbox Dispatcher

Future flow:

```text id="7xij7c"
OUTBOX
  ↓
DISPATCHER
  ↓
SIGNED / AUTHENTICATED DELIVERY
  ↓
n8n / webhook / consumer
```

Dispatcher MUST support retry.

---

# 57. Delivery Is At-Least-Once by Default

Consumers SHOULD assume a business event may be delivered more than once.

Therefore:

```text id="dq99li"
CONSUMER
MUST BE IDEMPOTENT
```

Exactly-once network delivery MUST NOT be assumed.

---

# 58. Consumer Deduplication

Canonical consumer pattern:

```text id="cjm5m7"
receive event
      ↓
check event_id
      ↓
already processed?
├── yes → acknowledge safely
└── no  → process + record event_id
```

---

# 59. Event Ordering

Global event ordering MUST NOT be assumed.

Where ordering matters, consumers SHOULD use:

```text id="97qmby"
aggregate identity
occurred_at
event version/sequence where implemented
current-state re-read
```

MGBOS may later introduce aggregate sequence numbers if real consumers require them.

Do not build them prematurely.

---

# 60. Events Must Be Immutable

Published event payload MUST NOT be edited after publication.

Correction means:

```text id="zz9lzp"
new corrective event
```

not rewriting historical event.

---

# 61. Event Contract Versioning

Backward-compatible additions MAY retain event version.

Breaking changes require a new event version.

Examples of breaking change:

```text id="n3rqte"
remove required field
change semantic meaning
change field type
change money units
```

---

# 62. Consumers Must Tolerate Additive Fields

Consumers SHOULD ignore unknown additional fields unless strict schema reasons require otherwise.

This allows safe contract evolution.

---

# 63. Event Schema Ownership

Future:

```text id="1l5yuf"
@mgbos/events
```

is the natural repository boundary for shared event contract definitions.

Current package is reserved.

Implementation MUST NOT be claimed until actual exports/contracts exist.

---

# 64. Inbound External Event Is Not an MGBOS Business Event

An inbound webhook from:

```text id="p9ynvc"
payment provider
courier
marketplace
WhatsApp
```

is an:

```text id="iuy8np"
EXTERNAL SIGNAL
```

not yet canonical internal fact.

---

# 65. External Signal Processing

Correct:

```text id="19nxhv"
PROVIDER
   ↓
WEBHOOK
   ↓
VERIFY SIGNATURE
   ↓
VALIDATE TIMESTAMP
   ↓
DEDUPLICATE PROVIDER EVENT
   ↓
NORMALIZE
   ↓
INTERNAL COMMAND
   ↓
MGBOS VALIDATION
   ↓
STATE CHANGE
   ↓
MGBOS BUSINESS EVENT
```

---

# 66. External Provider Payload Does Not Mutate MGBOS Directly

Forbidden:

```text id="uuhr5l"
Payment provider webhook
        ↓
UPDATE invoices SET status='PAID'
```

Correct:

```text id="1rz903"
provider webhook
      ↓
ReconcilePayment command
      ↓
MGBOS payment rules
```

---

# 67. Provider Event Identity

Inbound integration SHOULD preserve provider event/reference identity.

This supports:

```text id="9h3nak"
deduplication
reconciliation
support investigation
```

Provider ID is external identity.

MGBOS internal transaction identity remains separate.

---

# 68. Provider Verification

Provider status such as:

```text id="4oy034"
SUCCESS
DELIVERED
PAID
```

MUST be translated through provider adapter/business interpretation.

External vocabulary MUST NOT leak directly into canonical business semantics where avoidable.

---

# 69. n8n Boundary

n8n is:

```text id="c5btym"
ORCHESTRATOR
```

It MAY:

```text id="6nh4e2"
receive MGBOS events
schedule
wait
retry integration steps
transform provider payload
send notifications
invoke authorized MGBOS commands
```

---

# 70. n8n Must Not Directly Own Business State

Forbidden:

```text id="0s2eis"
n8n
→ raw UPDATE app.orders
```

Preferred:

```text id="8gcsdj"
n8n
→ mgbos.order.<authorized-command>
```

---

# 71. n8n Must Revalidate Current State

Event payload represents a historical occurrence.

For critical delayed workflow:

```text id="oyjm2k"
QuoteSent
      ↓
wait 3 days
      ↓
follow-up
```

n8n SHOULD first query:

```text id="yl16li"
current quote status
```

before taking consequential action.

---

# 72. Scheduled Automation Is a Trigger, Not Authority

Cron says:

```text id="iurptq"
"run now"
```

It does not say:

```text id="yskyhj"
"action is authorized"
```

Scheduled mutations still go through MGBOS command validation.

---

# 73. JARVIS Boundary

JARVIS MUST interact with MGBOS through:

```text id="5nvmqt"
bounded queries
+
bounded commands
```

not:

```text id="g8ib8s"
arbitrary SQL
```

---

# 74. JARVIS Tool vs MGBOS Command

These concepts are related but not identical.

Example:

```text id="7m8o4o"
JARVIS TOOL:
mgbos.payment.record

        ↓ wraps

MGBOS COMMAND:
mgbos.payment.record

        ↓ executes

MGBOS DOMAIN / DATABASE
```

A Tool is an external capability boundary.

A Command is the authoritative business mutation request.

They MAY share the same logical capability name.

---

# 75. Tool Permission Is Checked Before Command

Future flow:

```text id="v2py2b"
JARVIS PLAN
     ↓
TOOL POLICY
     ↓
TOOL CALL
     ↓
MGBOS AUTHENTICATION
     ↓
MGBOS AUTHORIZATION
     ↓
BUSINESS COMMAND
```

MGBOS remains the final domain-integrity guard.

---

# 76. JARVIS Cannot Override Rejected Commands

If MGBOS responds:

```text id="tkyrga"
INVARIANT_VIOLATION
```

JARVIS MUST NOT retry with altered raw data merely to defeat the rule.

It may:

```text id="558rl3"
explain
request explicit override capability
escalate
```

where such override exists.

---

# 77. AI-Originated Command Context

Future AI-originated commands SHOULD preserve that AI participated.

Example:

```yaml id="5qluvh"
actor:
  type: JARVIS
  principal_id: jarvis-core

authorized_by:
  type: HUMAN
  principal_id: '...'
```

This supports trustworthy audit.

---

# 78. AI Suggestions Are Not Commands

AI output:

```text id="um44cq"
"Vendor B sebaiknya dipilih."
```

is recommendation.

Only after policy/decision does it become:

```text id="1z0hob"
mgbos.production.assign
```

---

# 79. Public Website Boundary

Public apps may request commands.

They MUST NOT contain authoritative business rule implementation.

Example:

```text id="v8c4ym"
TeeStock Checkout
       ↓
CreateRetailOrder Command
       ↓
MGBOS
```

---

# 80. Public Frontend Must Not Hold Privileged Credentials

Browser clients MUST NOT receive credentials capable of bypassing MGBOS authorization.

Privileged command execution belongs server-side.

---

# 81. Database Function Boundary — Current Reality

Current MGBOS command implementation relies heavily on:

```text id="mbog4n"
SECURITY DEFINER database functions
```

with business validation and role checks.

This is a valid current implementation.

---

# 82. Database Function Is Not the Eternal Public API

JARVIS, public apps, and external systems SHOULD NOT become tightly coupled to PostgreSQL function signatures forever.

Future application/internal API MAY wrap current functions.

Logical command contract should remain stable even if implementation moves from:

```text id="yhbfji"
PostgreSQL function
```

to:

```text id="a7fhcd"
TypeScript application service
```

or another bounded implementation.

---

# 83. Service Role Is Infrastructure Authority

`service_role` or equivalent privileged credentials are implementation credentials.

Possession of such credentials MUST NOT be interpreted as business permission.

Trusted application boundary must still enforce:

```text id="c2s23s"
actor
organization
command capability
business rule
```

---

# 84. Command Gateway Direction

Future preferred architecture:

```text id="cv6x5j"
CLIENT / JARVIS / N8N
          ↓
    COMMAND GATEWAY
          ↓
AUTHN / AUTHZ / POLICY
          ↓
 APPLICATION COMMAND
          ↓
  DOMAIN / DATABASE
```

This does not need to be built before a real consumer requires it.

---

# 85. Query Gateway Direction

Similarly:

```text id="vk0i8b"
JARVIS / APP
    ↓
QUERY CAPABILITY
    ↓
BUSINESS PROJECTION
```

rather than giving consumers arbitrary table access.

---

# 86. Command Payload Rule

Command payload MUST contain intent data.

It SHOULD NOT allow callers to submit fields owned by MGBOS calculation.

Bad:

```text id="j2071m"
RecordPayment:
new_invoice_balance = 0
```

Correct:

```text id="1o7j67"
RecordPayment:
payment_amount = ...
invoice_id = ...
```

MGBOS calculates balance.

---

# 87. Command Owns Intent; Domain Owns Consequences

Caller asks:

```text id="44owp0"
reserve 10 units
```

MGBOS determines:

```text id="pnh89e"
availability
reservation validity
stock balance
audit
```

Caller MUST NOT dictate the resulting authoritative state.

---

# 88. Server-Generated Fields

Fields such as:

```text id="5ogm1p"
business document number
created_at
actor-derived context
calculated balance
calculated margin
audit metadata
```

SHOULD be produced by trusted system logic.

Not trusted directly from caller payload.

---

# 89. Event Consumer Rule

An event consumer MUST NOT assume it owns the originating domain.

Example:

```text id="11088c"
PaymentRecorded
↓
Marketing automation
```

Marketing may react.

It MUST NOT redefine payment state.

---

# 90. Consumer Failure Must Not Roll Back Committed Business Truth

If:

```text id="m6fy43"
OrderCreated
```

is committed and later WhatsApp notification fails:

```text id="4by74r"
Order remains created.
```

The integration is retried/recovered separately.

---

# 91. Consumer-Specific Failure

A failure delivering to one consumer SHOULD NOT automatically prevent others from receiving an event.

Example:

```text id="609u54"
WhatsApp FAILED
Analytics SUCCESS
JARVIS SUCCESS
```

unless policy explicitly requires all-or-nothing downstream handling.

---

# 92. Retry Policy

Outbox/integration retry SHOULD distinguish:

```text id="v93k28"
retryable errors
vs
permanent errors
```

Examples:

Retry:

```text id="ilf1u9"
timeout
temporary network failure
rate limit
provider 5xx
```

Potentially permanent:

```text id="jrzfoz"
invalid credential
invalid payload contract
removed destination
policy denial
```

---

# 93. Dead-Letter / Exception Direction

Repeated permanent event delivery failure SHOULD eventually move into an explicit exception state/queue.

Conceptually:

```text id="686cld"
PENDING
 ↓
retry
 ↓
retry
 ↓
FAILED
 ↓
NEEDS_HUMAN / RECONCILIATION
```

Exact queue infrastructure remains future implementation.

---

# 94. Event Reprocessing

Historical event reprocessing MAY be useful.

Consumers MUST distinguish:

```text id="3cq07b"
original business occurrence
```

from:

```text id="looeew"
later replay
```

Replay MUST NOT cause duplicate external mutation.

---

# 95. Observability

Command/event infrastructure SHOULD expose:

```text id="mp000z"
command count
command latency
command rejection rate
invariant failures
event creation rate
outbox depth
delivery latency
retry count
failed deliveries
consumer lag
```

Observability metrics do not replace business audit.

---

# 96. Command Audit

For consequential command execution, evidence SHOULD allow reconstruction of:

```text id="mvp80i"
command
actor
organization
target entity
result
timestamp
reason
correlation
```

Not every raw input needs permanent storage if privacy/security advises against it.

---

# 97. Sensitive Payload Handling

Command/event logs MUST NOT indiscriminately record:

```text id="2sxzkq"
credentials
authentication tokens
full bank credentials
secret webhook signatures
unnecessary PII
```

Traceability must coexist with data minimization.

---

# 98. Request Payload Storage

Some current entities preserve `request_payload` for strong idempotency/provenance.

This is valid where justified.

However:

> **request payload persistence is not a universal requirement for every command.**

Store it only when useful and safe.

---

# 99. Query Observability

Sensitive or expensive queries MAY be logged for:

```text id="52kxrf"
security
cost
audit
debugging
```

But ordinary query reads do not necessarily need domain business events.

---

# 100. Event Publication Rule

Create an event when:

```text id="al9x0q"
another bounded subsystem legitimately needs to know
that a meaningful business fact occurred
```

Do NOT emit events for every SQL mutation by default.

---

# 101. Event Granularity

Prefer:

```text id="b5g8yg"
mgbos.order.created
```

over dozens of implementation events:

```text id="e4pprj"
orders_row_inserted
order_items_inserted
order_audit_inserted
sequence_incremented
```

Business consumers care about business facts.

---

# 102. Event Explosion Is an Anti-Pattern

Event-driven architecture does not mean:

> every function emits five events.

Events add:

```text id="g318bh"
contracts
versioning
monitoring
failure modes
consumer dependencies
```

Complexity must be earned.

---

# 103. Current Events Priority

First events should be introduced only when a real consumer exists.

Likely early candidates:

```text id="f207my"
mgbos.quote.sent
mgbos.quote.accepted
mgbos.order.created
mgbos.payment.recorded
mgbos.production.status_changed
mgbos.qc.inspected
mgbos.shipment.dispatched
mgbos.shipment.delivered
```

This list is direction, not proof they currently exist.

---

# 104. JARVIS Early Event Use

Early JARVIS does not require event infrastructure to function.

Morning Briefing may initially use:

```text id="vv9b0o"
scheduled read queries
```

This keeps first implementation simple.

Event-driven proactive intelligence should be added when:

```text id="l94swf"
real business value
+
reliable consumers
```

justify it.

---

# 105. Event-Driven JARVIS Target

Later:

```text id="y7tszh"
MGBOS event
    ↓
JARVIS event intake
    ↓
context enrichment
    ↓
policy
    ↓
analysis
    ↓
recommendation / action
```

Example:

```text id="8fxtf5"
mgbos.production.delayed
      ↓
JARVIS
      ↓
analyze deadline impact
      ↓
Founder attention item
```

---

# 106. Event Does Not Automatically Trigger Mutation

Even in future:

```text id="j6l9h4"
EVENT
  ↓
JARVIS
```

must not mean:

```text id="mle61v"
automatic unrestricted command
```

Policy and autonomy rules still apply.

---

# 107. Human Approval Flow

Example:

```text id="2ctj6c"
Event:
margin warning

      ↓

JARVIS recommendation

      ↓

Rizky APPROVE

      ↓

Command:
mgbos.quote.pricing_override

      ↓

MGBOS validates

      ↓

Audit + business effect
```

Approval and command remain distinct records.

---

# 108. External Command Flow

Example marketplace order:

```text id="rd36x4"
MARKETPLACE
      ↓
external order webhook
      ↓
signature validation
      ↓
provider event dedupe
      ↓
NormalizeMarketplaceOrder
      ↓
mgbos.order.import / create
      ↓
MGBOS validation
      ↓
transaction
      ↓
OrderCreated
```

---

# 109. External Payment Flow

```text id="43lv33"
PAYMENT PROVIDER
      ↓
webhook
      ↓
signature verification
      ↓
provider transaction lookup if needed
      ↓
ReconcilePayment Command
      ↓
MGBOS validates amount/reference
      ↓
payment state
      ↓
PaymentRecorded / Reconciled event
```

Never:

```text id="7iq7pn"
provider says success
→ directly mark invoice paid
```

---

# 110. Command Versioning

Breaking command-contract changes require:

```text id="qq2472"
command_version increment
```

Breaking examples:

```text id="20jeo8"
required field meaning changes
money semantics changes
authorization semantics change
input type incompatibility
```

---

# 111. Command Internal Refactoring

Changing implementation from:

```text id="fpm6jy"
SQL function
```

to:

```text id="4oc1bc"
TypeScript domain service
```

does NOT require command version change if external semantic contract remains compatible.

---

# 112. Event Contract Registry Direction

Future `@mgbos/events` SHOULD contain machine-readable event definitions.

Possible structure:

```text id="ne61yz"
events/
├── envelope.ts
├── order/
│   ├── order-created.v1.ts
│   └── order-completed.v1.ts
├── payment/
└── shipment/
```

Do not create placeholder complexity until first consumer requires it.

---

# 113. Command Registry Direction

Future MGBOS MAY maintain a capability registry such as:

```text id="5xi0uy"
mgbos.quote.send
mgbos.order.create
mgbos.payment.record
mgbos.inventory.reserve
```

This registry would support:

```text id="4udfkr"
JARVIS tools
permission mapping
risk classification
API documentation
testing
```

It is not yet canonical runtime implementation.

---

# 114. Commands and Risk

A future command registry SHOULD map each command to a risk classification.

Example:

```text id="tkz76u"
mgbos.order.read
→ low risk

mgbos.payment.record
→ high risk
```

Risk semantics belong to cross-system governance.

MGBOS owns command validity.

---

# 115. Commands and Autonomy

Autonomy is external to command semantics.

The same valid command may be:

```text id="e5hor5"
human-only today

approval-gated tomorrow

automated later
```

MGBOS command remains the same authoritative business boundary.

---

# 116. Commands and UI

UI SHOULD call commands based on user intent.

It SHOULD NOT reproduce the full business rules merely to decide whether a command is allowed.

UI MAY prevalidate for UX.

MGBOS revalidates authoritatively.

---

# 117. Commands and APIs

API endpoint is transport.

Command is semantic operation.

Example:

```text id="pqtm5i"
POST /internal/payments
```

might map to:

```text id="lo862j"
mgbos.payment.record
```

Changing URL need not change command semantics.

---

# 118. Events and Webhooks

Webhook is transport.

Event is business fact.

Example:

```text id="3ednua"
POST /webhooks/mgbos
```

may transport:

```text id="0j27lw"
mgbos.order.created
```

Do not treat webhook URL as event identity.

---

# 119. Commands and Database Transactions

Every critical command SHOULD explicitly understand its transaction boundary.

It MUST NOT depend on application callers knowing which tables need to update.

That knowledge belongs inside MGBOS.

---

# 120. Command Concurrency

Commands affecting contention-sensitive resources SHOULD lock/serialize authoritative state.

Examples:

```text id="h1xfuu"
inventory reservation
payment allocation
quote revision
PO receipt
document numbering
```

Caller should not implement its own race-prone check-then-write flow.

---

# 121. Command Precondition Conflict

When entity changed between read and write:

```text id="4dkfwe"
client expected version X
but current is Y
```

command SHOULD reject explicitly rather than overwrite newer truth.

Current quote revision already applies this principle through expected/current version semantics.

---

# 122. Optimistic Concurrency Direction

Future command contracts MAY expose:

```text id="7qoej7"
expected_version
expected_state
```

where useful.

Do not add generic entity versioning to every table until required.

---

# 123. Event Correlation Example

```text id="4ncyz9"
Correlation: SALE-ABC

Command:
mgbos.order.create
        ↓
Event:
mgbos.order.created
        ↓
Command:
mgbos.inventory.reserve
        ↓
Event:
mgbos.inventory.reserved
        ↓
Command:
mgbos.invoice.issue
        ↓
Event:
mgbos.invoice.issued
```

One business process remains traceable.

---

# 124. Causation Example

```text id="lc6xev"
Event E1:
OrderCreated

      ↓

Command C2:
ReserveInventory
caused_by E1

      ↓

Event E2:
InventoryReserved
caused_by C2
```

This enables chain reconstruction.

---

# 125. No Infinite Event Loop

Consumers issuing commands in response to events MUST guard against accidental loops.

Example dangerous cycle:

```text id="gbld3v"
OrderUpdated
→ workflow
→ UpdateOrder
→ OrderUpdated
→ workflow
→ ...
```

Use:

```text id="fp2063"
specific business event semantics
idempotency
causation
current-state checks
```

to prevent loops.

---

# 126. Event-Driven Side Effects

Good event consumers include:

```text id="c6u8b8"
notifications
analytics
JARVIS attention
external synchronization
follow-up scheduling
```

Core business invariants SHOULD NOT depend solely on eventual event consumers.

---

# 127. Strong vs Eventual Consistency

Inside one integrity-critical business command:

```text id="x1ft50"
STRONG / TRANSACTIONAL CONSISTENCY
```

should be preferred.

Across external systems:

```text id="yu0xfx"
EVENTUAL CONSISTENCY
```

is expected.

Example:

```text id="y7l4we"
Order creation
→ transactional

WhatsApp notification
→ eventual
```

---

# 128. Never Expand Transaction Boundary Across External Network

MGBOS database transaction SHOULD NOT remain open while waiting for:

```text id="8ij2s7"
WhatsApp
AI model
courier
email
n8n
payment API
```

External calls belong outside transaction unless a specialized architecture explicitly justifies otherwise.

---

# 129. External Action Reconciliation

For external command where response is uncertain:

```text id="455i72"
send request
↓
timeout
```

system MUST consider:

```text id="qeb4d8"
UNKNOWN OUTCOME
```

until provider state is reconciled.

Blind retry can duplicate external effects.

---

# 130. Event Retention

Business-event retention SHOULD reflect:

```text id="apm2ke"
audit value
replay value
legal/business need
storage cost
privacy
```

Detailed retention belongs to future data-governance specification.

---

# 131. Audit Retention Is Separate

Event retention policy and audit retention policy are not necessarily identical.

They serve different purposes.

---

# 132. Event Deletion

If event history is retained as evidence/integration history, deletion MUST follow an explicit retention policy.

Consumers must never depend on indefinite replay unless retention guarantees it.

---

# 133. Schema Validation

Commands and events SHOULD have machine-validatable schemas before broad external consumption.

Validation should occur:

```text id="vbi95z"
before command execution
```

and:

```text id="5tapb7"
before event publication
```

---

# 134. Event Consumer Schema Validation

Consumers SHOULD reject/quarantine malformed event envelopes.

They SHOULD NOT silently interpret invalid payloads.

---

# 135. Business Event Security

Event delivery SHOULD use appropriate:

```text id="lqrxgb"
authentication
signature
network policy
secret management
```

depending on transport.

An event payload alone does not prove its origin.

---

# 136. Webhook Signature Is Transport Security

Webhook signature verifies:

```text id="9izl07"
who sent this payload
```

It does not prove:

```text id="v8xafz"
business action should be accepted
```

MGBOS still performs domain validation.

---

# 137. Current Enforcement Gap — Unified Command Envelope

Current SQL functions have good command semantics but do not yet share one universal envelope containing:

```text id="r23k3l"
command_id
correlation_id
causation_id
actor type
command version
```

Classification:

```text id="874yzf"
TARGET STANDARDIZATION
```

Not a reason to replace working functions prematurely.

---

# 138. Current Enforcement Gap — Idempotency Consistency

Idempotency currently exists strongly in selected paths.

It is not yet standardized across every critical command.

Target:

```text id="1nwc4v"
all externally retryable mutations
→ explicit idempotency semantics
```

---

# 139. Current Enforcement Gap — Service Principal Identity

Current command model is primarily human-user oriented.

JARVIS/n8n runtime identity requires future explicit service-principal architecture.

Until then:

> Do not fake runtime agents as human users without an explicit design decision.

---

# 140. Current Enforcement Gap — Business Event Runtime

Current:

```text id="bg88mw"
domain audits exist
```

but:

```text id="0nxm7b"
canonical machine-consumable event runtime
```

does not yet exist.

This document defines its semantics before implementation.

---

# 141. Current Enforcement Gap — Transactional Outbox

Outbox remains:

```text id="4tgnps"
TARGET
```

per ADR-005.

Implementation should begin only with a real event consumer.

---

# 142. Recommended First Event Slice

When real need appears, recommended first end-to-end event slice is:

```text id="mds0w9"
MGBOS business command
      ↓
meaningful event
      ↓
transactional outbox
      ↓
dispatcher
      ↓
n8n or JARVIS consumer
      ↓
idempotent processing
      ↓
delivery evidence
```

Only one or two events are needed to prove architecture.

---

# 143. Recommended First Candidate

A suitable early event candidate is:

```text id="c4xgww"
mgbos.order.created
```

or:

```text id="8qd6f2"
mgbos.payment.recorded
```

depending on the first real automation requirement.

Do not implement every theoretical event at once.

---

# 144. Event Rollout Sequence

```text id="yr7x7f"
1. Define one event contract

2. Implement outbox

3. Commit event atomically with command

4. Implement dispatcher

5. Implement one consumer

6. Implement dedupe

7. Implement retry

8. Add observability

9. Verify failure/replay

10. Expand only after proven
```

---

# 145. Command Standardization Sequence

Without rewriting current working system:

```text id="4h4fui"
CURRENT DB FUNCTIONS
       ↓
document logical command IDs
       ↓
standardize idempotency
       ↓
standardize result/errors
       ↓
standardize correlation
       ↓
introduce gateway when real consumers need it
```

---

# 146. Anti-Patterns

The following violate this specification.

### Direct UI Mutation

```text id="5m1djo"
button
→ update status column
```

### Direct n8n Mutation

```text id="vqmcub"
n8n
→ Supabase UPDATE payment
```

### AI SQL Authority

```text id="6lg7fm"
JARVIS
→ arbitrary SQL
```

### Table-Change Event Contract

```text id="rzz4bi"
orders.updated
```

without business meaning.

### Event Before Commit

```text id="7quyew"
publish
→ transaction later fails
```

### Unprotected Retry

```text id="8ikqye"
timeout
→ resend mutation
→ duplicate payment/order
```

### Audit as Integration API

Consumers depending directly on:

```text id="z0idgi"
payment_audit.action string
```

instead of a versioned event contract.

### External Payload as Internal Fact

```text id="y2u118"
provider webhook
→ canonical state
```

without verification/business processing.

---

# 147. Command Review Checklist

Every new consequential command SHOULD answer:

```text id="7mk2tf"
What business intent does it represent?

Who may invoke it?

Which organization owns it?

What input is caller-owned?

What values are system-calculated?

What state is required?

Which invariants apply?

Does it need idempotency?

What does it lock?

What is its transaction boundary?

What audit is written?

What event is emitted?

How does retry behave?

How does failure behave?
```

---

# 148. Event Review Checklist

Every new event SHOULD answer:

```text id="qk1ur0"
What fact occurred?

Is it truly useful to another subsystem?

Who owns the source fact?

What aggregate does it belong to?

What is the event ID?

What version is the contract?

What data is required?

Is sensitive data minimized?

What caused it?

Which correlation does it belong to?

Can it be delivered more than once?

How does consumer dedupe it?

Does consumer need to re-read current state?
```

---

# 149. Canonical Interaction — Human

```text id="3szfui"
HUMAN
  ↓
UI
  ↓
COMMAND
  ↓
MGBOS
  ↓
STATE
  ↓
AUDIT
```

Future, if integration exists:

```text id="uecp4k"
STATE
  ↓
EVENT / OUTBOX
```

---

# 150. Canonical Interaction — JARVIS

```text id="8r70o1"
JARVIS
  ↓
policy-approved tool
  ↓
MGBOS command capability
  ↓
authorization
  ↓
business rules
  ↓
transaction
  ↓
result
  ↓
verification/evidence
```

---

# 151. Canonical Interaction — n8n

```text id="dr062w"
MGBOS EVENT
   ↓
OUTBOX
   ↓
DISPATCHER
   ↓
n8n
   ↓
external orchestration

and if business mutation is needed:

n8n
   ↓
MGBOS COMMAND
```

---

# 152. Canonical Interaction — External Provider

```text id="53ygnz"
PROVIDER
   ↓
signed external signal
   ↓
integration adapter
   ↓
dedupe
   ↓
internal command
   ↓
MGBOS
   ↓
canonical state
   ↓
internal business event
```

---

# 153. Source-of-Truth Direction

Commands:

```text id="xt0i4k"
request authority to mutate truth
```

Queries:

```text id="bpgfa3"
read truth
```

Events:

```text id="4g8wnu"
announce that truth changed
```

Audit:

```text id="veqf2f"
record who/why/how
```

Outbox:

```text id="a1ykfg"
reliably transport event
```

These responsibilities MUST remain distinct.

---

# 154. Canonical Responsibility Matrix

| Concept              | Purpose                | Owns Business Truth? |
| -------------------- | ---------------------- | -------------------: |
| Command              | Request mutation       |                   No |
| Domain Rule          | Decide validity        |   Semantic authority |
| Database Transaction | Commit truth           |                  Yes |
| Audit                | Accountability history |  Historical evidence |
| Business Event       | Announce fact          |      Historical fact |
| Outbox               | Reliable delivery      |                   No |
| n8n                  | Orchestrate reaction   |                   No |
| JARVIS               | Reason/react/request   |                   No |
| External Webhook     | External signal        |  External scope only |

---

# 155. Architectural Invariants

1. Commands request change; Events report completed facts.
2. Queries do not perform hidden business mutation.
3. Critical mutations pass an explicit authorized command boundary.
4. Business commands own intent, not caller-specified resulting state.
5. Commands revalidate current authoritative state.
6. Business invariants remain inside MGBOS.
7. Material retryable commands require idempotency semantics.
8. Same logical command must not create duplicate business effect.
9. Actor identity and organization context accompany consequential mutation.
10. Delegated execution must distinguish executor from authorizer.
11. Audit and Business Event are different concepts.
12. Current audit strings are not automatically event contracts.
13. Events are immutable historical facts.
14. Event payloads are minimal and versioned.
15. Event delivery must tolerate duplication.
16. Consumers must be idempotent.
17. Event delivery failure must not roll back committed business truth.
18. External provider signals require verification and normalization.
19. n8n orchestrates; it does not directly own MGBOS state.
20. JARVIS uses bounded commands/queries, not arbitrary SQL.
21. Privileged credentials do not grant business permission.
22. Provider transport vocabulary does not redefine domain semantics.
23. Network calls do not belong inside critical database transactions.
24. Transactional Outbox is introduced with real consumers, not speculatively.
25. Event-driven complexity must be earned by actual business need.

---

# 156. Relationship to Other Specifications

```text id="n9wk67"
Canonical Data Model
→ WHAT business entities exist

Business State Machines
→ HOW their states may change

Business Invariants
→ WHAT must always remain true

Command & Event Model
→ HOW change enters MGBOS
  and HOW completed facts leave MGBOS

Permission Model
→ WHO may request each command
```

---

# 157. Canonicalization Effect

The command/event concepts previously spread across:

```text id="xx1ecp"
MGBOS architecture README
MGBOS 0.4 session architecture
ADR-004
ADR-005
AGENTS.md
SQL functions
domain audits
```

now have a single semantic owner:

```text id="dy4l4f"
MGBOS Command & Event Model v1.0
```

The historical MGBOS 0.4 document remains valuable architecture provenance.

It no longer needs to act as command/event authority.

---

# 158. Current → Target Evolution

```text id="3a84ni"
CURRENT

UI / service
    ↓
PostgreSQL command functions
    ↓
transaction
    ↓
domain-specific audit


TARGET WHEN NEEDED

UI / JARVIS / n8n
    ↓
Command / Query Gateway
    ↓
MGBOS command
    ↓
transaction
    ├── audit
    └── business event
            ↓
          outbox
            ↓
        dispatcher
            ↓
          consumers
```

The target extends current integrity.

It does not replace working foundations merely for architectural aesthetics.

---

# 159. North Star

MGBOS should reach a point where every consequential mutation can answer:

```text id="6sew46"
Who requested this?

What command represented the intent?

Was the actor allowed?

What state existed before?

Which invariant was checked?

What changed?

Was the transaction atomic?

What audit proves it?

Which event announced it?

Which automation reacted?

Was that reaction retried?

Can the whole chain be traced?
```

---

# 160. Final Principle

> **Commands are the controlled entrance to business change.  
> Transactions create authoritative reality.  
> Audits preserve accountability.  
> Events communicate what happened.  
> Outbox makes that communication reliable.**

MGBOS should never require external systems to manipulate its internals in order to participate in the business.
