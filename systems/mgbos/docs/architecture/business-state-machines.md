---
canonical_id: mgbos.architecture.business-state-machines
status: ACTIVE
version: 1.1
owner: Rizky
author: OpenAI / ChatGPT
approver: Rizky
scope: mgbos
document_class: canonical-specification
effective_from: 2026-10-06
authoritative_for:
  - mgbos lifecycle semantics
  - canonical state vocabularies
  - allowed business transitions
  - terminal-state semantics
  - derived-vs-stored state rules
  - cross-domain lifecycle coordination
  - state transition enforcement expectations
  - operational exception lifecycle
last_reviewed: 2026-10-06
review_cadence: quarterly
depends_on:
  - ../../../../docs/governance/documentation-constitution.md
  - ../../../../docs/governance/canonical-source-map.md
  - ../../../../docs/architecture/master-system-blueprint.md
  - ../../../../docs/architecture/system-boundaries.md
  - ../../../../docs/architecture/architectural-laws.md
  - canonical-data-model.md
  - README.md
  - ../product/operational-exception-spec.md
  - ../product/founder-attention-experience-spec.md
supersedes:
  - ../../../../catatan/sesi/2026-09-23 - MGBOS 0.3 — Business State Machines.md
implementation_basis:
  - ../../supabase/migrations/
implementation_through: MGBOS-020
---

# MGBOS Business State Machines v1.1

## 1. Purpose

Dokumen ini mendefinisikan lifecycle semantics canonical untuk entity bisnis MGBOS.

Ia menjawab:

- status apa yang dimiliki suatu domain;
- arti setiap state;
- transition apa yang diperbolehkan;
- state mana yang terminal;
- guard apa yang harus berlaku;
- status mana yang stored dan mana yang derived;
- siapa yang boleh melakukan transition;
- dan bagaimana lifecycle berbeda berkoordinasi tanpa dicampur menjadi satu status besar.

Prinsip utama:

> **Business state belongs to the domain that owns it.**

---

# 2. Fundamental Rule

MGBOS MUST NOT menggunakan satu `order.status` untuk mewakili seluruh keadaan transaksi.

Contoh yang dilarang:

```text id="un6t16"
ORDER_STATUS =
PAID_PRODUCTION_QC_DONE_WAITING_COURIER
```

Sebaliknya:

```text id="cw4vlb"
Commercial State
Financial State
Production State
QC Result
Inventory State
Procurement State
Fulfillment State
```

berjalan sebagai lifecycle terpisah.

---

# 3. Why Independent Lifecycles Matter

Satu order dapat secara bersamaan berada dalam keadaan:

```text id="bfhoqe"
Order:
ACTIVE

Invoice:
PARTIALLY_PAID

Production Job A:
COMPLETED

Production Job B:
IN_PRODUCTION

QC:
PASS

Shipment:
READY_TO_DISPATCH
```

Tidak ada satu string status yang dapat merepresentasikan semua fakta tersebut secara sehat.

---

# 4. State Classification

Dokumen ini membedakan empat konsep.

## Stored State

Status yang disimpan sebagai canonical entity state.

Contoh:

```text id="5w5gvb"
production_jobs.status
```

## Derived State

Condition yang dihitung dari canonical data.

Contoh:

```text id="yr1ari"
invoice_is_overdue
order_fulfillment_progress
order_health
```

## Event

Pernyataan bahwa sesuatu telah terjadi.

Contoh:

```text id="15bq8u"
quote.accepted
payment.recorded
shipment.delivered
```

## Condition / Flag

Fakta temporer yang tidak harus menjadi lifecycle state.

Contoh:

```text id="sf3j8m"
production delayed
margin below threshold
inventory low
```

Keempat konsep tersebut MUST NOT dicampur.

---

# 5. Implementation Maturity Vocabulary

Karena tidak semua transition sudah mempunyai command enforcement yang sama matang, state machine menggunakan klasifikasi berikut.

## ENFORCED

Transition sudah dijaga oleh current command/database implementation.

## CANONICAL

Transition ditetapkan oleh dokumen ini sebagai intended lifecycle dan harus menjadi target implementation.

## CANONICAL_TARGET

Lifecycle model dan state transition kanonikal yang telah disetujui secara arsitektural untuk kebutuhan program Founder Control (misal Operational Exception), tetapi implementasi command penegakannya di database/kode belum dibangun.

## SCHEMA_RESERVED

Status sudah tersedia pada schema tetapi belum mempunyai lifecycle command yang cukup jelas untuk diperlakukan sebagai fully operational transition.

## DERIVED

Condition dihitung secara logis atau merupakan proyeksi baca, bukan menjadi transition state mesin transaksional master.

Ini menjaga dokumentasi tetap jujur terhadap current implementation.

---

# 6. State Transition Architecture

Canonical transition flow:

```text id="k0yoe8"
COMMAND
   ↓
AUTHENTICATION
   ↓
AUTHORIZATION
   ↓
CURRENT STATE READ + LOCK
   ↓
TRANSITION GUARD
   ↓
BUSINESS INVARIANT CHECK
   ↓
DATABASE TRANSACTION
   ↓
STATE CHANGE
   ↓
AUDIT
   ↓
EVENT / SIDE EFFECT
```

UI, automation, dan AI MUST NOT melewati proses tersebut untuk mutation kritis.

---

# 7. State Commands, Not Arbitrary Updates

Preferred:

```text id="tk0fq9"
transition_requirement_status(...)
mark_quote_sent(...)
mark_quote_accepted(...)
transition_production_job_status(...)
issue_invoice(...)
record_payment_and_allocate(...)
dispatch_shipment(...)
```

Forbidden pattern:

```text id="2pbbvx"
UPDATE business_table
SET status = 'WHATEVER'
```

dari UI, AI, atau n8n tanpa authoritative command.

---

# 8. Idempotency Rule

Command penting SHOULD memiliki behavior idempotent ketika practical.

Repeated request akibat:

```text id="o5gvop"
network retry
browser retry
worker retry
callback duplication
```

MUST NOT secara otomatis menghasilkan duplicate business effect.

---

# 9. Transition Audit Rule

Material lifecycle transitions SHOULD menghasilkan audit evidence minimal:

```text id="3uh2wv"
entity
from state
to state
actor
timestamp
reason/context
```

Tidak semua lifecycle saat ini memiliki generic transition table.

Domain-specific audit tables tetap valid.

---

# 10. Lead State Machine

Canonical entity:

```text id="kc3a75"
leads.status
```

States:

```text id="9ln6w7"
NEW
CONTACTED
QUALIFYING
QUALIFIED
DISQUALIFIED
CONVERTED
LOST
```

Current enforcement:

```text id="qvos67"
ENFORCED
```

through:

```text id="o7plls"
transition_lead_status(...)
convert_lead_to_customer(...)
```

---

# 11. Lead Primary Flow

```text id="bdkv0a"
NEW
 ↓
CONTACTED
 ↓
QUALIFYING
 ↓
QUALIFIED
 ↓
CONVERTED
```

Alternative exits:

```text id="daaxiy"
NEW
 ├── DISQUALIFIED
 └── LOST

CONTACTED
 ├── DISQUALIFIED
 └── LOST

QUALIFYING
 ├── DISQUALIFIED
 └── LOST
```

---

# 12. Lead Allowed Transitions

Current enforced transition graph:

```text id="rjjerz"
NEW
├── CONTACTED
├── QUALIFYING
├── QUALIFIED
├── DISQUALIFIED
└── LOST

CONTACTED
├── QUALIFYING
├── QUALIFIED
├── DISQUALIFIED
└── LOST

QUALIFYING
├── QUALIFIED
├── DISQUALIFIED
└── LOST

QUALIFIED
├── QUALIFYING
├── LOST
└── CONVERTED
    only via lead conversion command

DISQUALIFIED
├── QUALIFYING
└── QUALIFIED

LOST
├── QUALIFYING
└── QUALIFIED

CONVERTED
└── TERMINAL
```

---

# 13. Lead Qualification Guard

Transition to:

```text id="03nr4k"
QUALIFIED
```

currently requires:

```text id="nj1fda"
phone OR email present

AND

raw inquiry OR title present

AND

estimated quantity > 0
when quantity is provided
```

Qualification remains deterministic business validation.

AI may suggest qualification.

AI MUST NOT bypass the guard.

---

# 14. Lead Disqualification

`DISQUALIFIED` requires a structured reason.

Disqualification is different from:

```text id="2yuhus"
LOST
```

Meaning:

```text id="1s8lud"
DISQUALIFIED
→ lead does not meet qualification criteria

LOST
→ opportunity to continue was lost after valid interest/context
```

---

# 15. Lead Conversion

`CONVERTED` MUST NOT be reached by arbitrary status update.

Canonical:

```text id="48xav3"
QUALIFIED
   ↓
convert_lead_to_customer(...)
   ↓
customer relationship created/resolved
   ↓
CONVERTED
```

This protects conversion atomicity.

---

# 16. Requirement State Machine

Canonical entity:

```text id="d6dkwr"
requirements.status
```

States:

```text id="9cd3p7"
DRAFT
NEEDS_INFORMATION
READY
LOCKED
CANCELLED
```

Current enforcement:

```text id="qfb1lg"
ENFORCED
```

---

# 17. Requirement Transition Graph

```text id="o6jg5x"
DRAFT
├── NEEDS_INFORMATION
├── READY
└── CANCELLED

NEEDS_INFORMATION
├── DRAFT
├── READY
└── CANCELLED

READY
├── NEEDS_INFORMATION
├── LOCKED
└── CANCELLED

LOCKED
└── CANCELLED

CANCELLED
└── TERMINAL
```

---

# 18. Requirement Meaning

## DRAFT

Requirement is being assembled.

## NEEDS_INFORMATION

Required business/specification information is missing.

## READY

Requirement is sufficiently complete for commercial use.

## LOCKED

A requirement version is being preserved as a commercial snapshot.

## CANCELLED

Requirement lifecycle has been abandoned.

---

# 19. Requirement Version Lock

`LOCKED` has a strong historical meaning.

When a requirement version becomes part of an issued commercial artifact:

```text id="anplfd"
Requirement Version
     ↓
Quote SENT
```

the relevant version becomes locked.

Locked version MUST NOT be mutated.

---

# 20. Requirement Revision After Lock

If customer changes specification:

Do not modify locked history.

Correct:

```text id="96w2wh"
LOCKED requirement version
        ↓
create new version
        ↓
Requirement root returns READY
        ↓
new commercial revision
```

This is fundamental to dispute prevention.

---

# 21. Quote Version State Machine

Canonical entity:

```text id="kigrgh"
quote_versions.status
```

State vocabulary:

```text id="6l2451"
DRAFT
SENT
ACCEPTED
REJECTED
EXPIRED
SUPERSEDED
CANCELLED
```

Implementation maturity is mixed.

---

# 22. Quote Core Enforced Flow

Current fully enforced primary flow:

```text id="fp4tyo"
DRAFT
  ↓
SENT
  ↓
ACCEPTED
```

with:

```text id="6l0uje"
DRAFT or SENT
      ↓
SUPERSEDED
```

when a new revision replaces the current version.

---

# 23. Quote DRAFT

`DRAFT` may still be revised internally.

It is not yet an external commercial commitment.

Before sending, current guards include:

```text id="ure7u0"
current quote version
valid requirement
active customer
active brand
valid pricing
pricing override approval if required
valid-until not expired
```

---

# 24. Quote SENT

Transition:

```text id="zgjk1n"
DRAFT → SENT
```

is currently:

```text id="ovleq1"
ENFORCED
```

through:

```text id="tl90l4"
mark_quote_sent(...)
```

Sending also locks the referenced requirement version.

---

# 25. Quote Acceptance

Transition:

```text id="epkxgq"
SENT → ACCEPTED
```

is:

```text id="4r3x11"
ENFORCED
```

through:

```text id="df7sn5"
mark_quote_accepted(...)
```

Canonical guards include:

```text id="46hv9i"
current quote version
SENT state
not expired
requirement version LOCKED
active customer
active brand
required pricing override present
valid acceptance method
```

---

# 26. Quote Supersession

When quote is revised:

```text id="jk81wb"
current DRAFT/SENT version
        ↓
SUPERSEDED
        +
new DRAFT version
```

Old commercial history is retained.

It MUST NOT be overwritten.

---

# 27. Quote Exception States

Schema also supports:

```text id="zkgtgt"
REJECTED
EXPIRED
CANCELLED
```

These are canonical lifecycle concepts.

However dedicated transition commands for all three are not yet consistently present in the audited implementation.

Classification:

```text id="6dhfv9"
CANONICAL
+
IMPLEMENTATION GAP
```

Target semantics:

```text id="i17ccw"
SENT → REJECTED
SENT → EXPIRED
DRAFT/SENT → CANCELLED
```

subject to future explicit commands and audit.

---

# 28. Quote Terminal Semantics

Normally terminal version states:

```text id="5gvkgv"
ACCEPTED
REJECTED
EXPIRED
SUPERSEDED
CANCELLED
```

A terminal quote version SHOULD NOT return to DRAFT.

New commercial intent requires a new version or new quote.

---

# 29. Order State Machine

Canonical entity:

```text id="an8qxh"
orders.status
```

Schema states:

```text id="9s5cxv"
DRAFT
CONFIRMED
ACTIVE
ON_HOLD
COMPLETED
CANCELLED
```

Current implementation creates both B2B and retail orders directly as:

```text id="dmwjgt"
CONFIRMED
```

after authoritative creation.

---

# 30. Order Enforcement Status

Order lifecycle transition commands telah diselesaikan dan diverifikasi penuh pada penutupan Phase 1 Operating Spine.

Status penegakan:

```text id="iy8m6t"
Order lifecycle
=
CANONICAL
and
ENFORCED
```

Transisi order dijaga oleh command yang tervalidasi dan audit log transaksional. Perubahan status langsung tanpa command tetap dilarang keras.

---

# 31. Canonical Order Lifecycle

Target lifecycle:

```text id="9qfjwi"
DRAFT
  ↓
CONFIRMED
  ↓
ACTIVE
  ↓
COMPLETED
```

Exception flows:

```text id="oup25y"
CONFIRMED
├── ON_HOLD
└── CANCELLED

ACTIVE
├── ON_HOLD
├── COMPLETED
└── CANCELLED

ON_HOLD
├── CONFIRMED / ACTIVE
└── CANCELLED
```

`COMPLETED` and `CANCELLED` are terminal by default.

---

# 32. Order CONFIRMED

`CONFIRMED` means:

> A valid commercial contract exists.

For Custom B2B this follows:

```text id="65q0u0"
ACCEPTED Quote
     ↓
create_order_from_quote
     ↓
CONFIRMED Order
```

For Retail:

```text id="jfd3i7"
Direct checkout
     ↓
validated inventory/order command
     ↓
CONFIRMED Order
```

---

# 33. Order ACTIVE

`ACTIVE` should represent active fulfillment/execution after contractual confirmation.

It MUST NOT encode:

```text id="g3r4gp"
paid
in production
QC passed
shipped
```

Those remain separate domain states.

---

# 34. Order ON_HOLD

`ON_HOLD` represents suspension of the overall commercial obligation.

Reason SHOULD be preserved.

Holding an order does not automatically:

```text id="8fru68"
reverse payment
cancel invoice
cancel production
release inventory
cancel shipment
```

Cross-domain effects require explicit orchestration.

---

# 35. Order Completion

Canonical completion SHOULD require satisfaction of business obligations rather than manual convenience.

Possible guards include:

```text id="iaumz0"
required production complete
required fulfillment complete
financial obligations acceptable
no blocking exception
```

Exact completion guard requires implementation in dedicated Order transition command.

---

# 36. Production Job State Machine

Canonical entity:

```text id="aqiwo8"
production_jobs.status
```

States:

```text id="k4npsb"
PLANNED
READY
ASSIGNED
ACCEPTED
IN_PRODUCTION
AWAITING_QC
REWORK
READY_FOR_HANDOFF
COMPLETED
ON_HOLD
CANCELLED
```

Current lifecycle:

```text id="cvbymh"
ENFORCED
```

---

# 37. Production Primary Flow

```text id="sjce6y"
PLANNED
   ↓
READY
   ↓
ASSIGNED
   ↓
ACCEPTED
   ↓
IN_PRODUCTION
   ↓
AWAITING_QC
   ↓
READY_FOR_HANDOFF
   ↓
COMPLETED
```

---

# 38. Production Allowed Transitions

Current enforced graph:

```text id="a0w6wk"
PLANNED
├── READY
└── CANCELLED

READY
├── ASSIGNED
├── PLANNED
└── CANCELLED

ASSIGNED
├── ACCEPTED
├── READY
└── CANCELLED

ACCEPTED
├── IN_PRODUCTION
├── ON_HOLD
└── CANCELLED

IN_PRODUCTION
├── AWAITING_QC
├── ON_HOLD
└── CANCELLED

AWAITING_QC
├── READY_FOR_HANDOFF
├── REWORK
├── ON_HOLD
└── CANCELLED

REWORK
├── IN_PRODUCTION
├── AWAITING_QC
├── ON_HOLD
└── CANCELLED

READY_FOR_HANDOFF
├── COMPLETED
├── ON_HOLD
└── CANCELLED

ON_HOLD
├── ACCEPTED
├── IN_PRODUCTION
├── AWAITING_QC
├── READY_FOR_HANDOFF
└── CANCELLED

COMPLETED
└── TERMINAL

CANCELLED
└── TERMINAL
```

---

# 39. Production Assignment

Assignment operation can move a job into:

```text id="ez3uen"
ASSIGNED
```

from an assignable early-stage job.

Assignment also records committed cost.

This is not merely a label change.

It represents operational commitment.

---

# 40. Production Delay

Delay SHOULD NOT become a primary production lifecycle state.

Correct:

```text id="4rcmos"
status = IN_PRODUCTION
condition = DELAYED
```

rather than:

```text id="ljpcgz"
status = PRODUCTION_DELAYED
```

Delay is a condition derived from schedule/SLA context.

---

# 41. QC Lifecycle

QC is modeled as inspection records rather than one continuously mutated QC entity.

Canonical results:

```text id="67mypq"
PASS
REWORK
REJECTED
```

Current process is:

```text id="dwqaop"
Production:
AWAITING_QC
     ↓
QC Inspection
```

---

# 42. QC PASS

```text id="w6w9wx"
AWAITING_QC
   ↓
QC PASS
   ↓
READY_FOR_HANDOFF
```

Current implementation:

```text id="afqvvu"
ENFORCED
```

---

# 43. QC REWORK

```text id="6vm1qh"
AWAITING_QC
   ↓
QC REWORK
   ↓
REWORK
   ↓
IN_PRODUCTION / AWAITING_QC
```

Rework requires defect context and rework instructions.

---

# 44. QC REJECTED

Current implementation:

```text id="yzqdp4"
AWAITING_QC
   ↓
QC REJECTED
   ↓
ON_HOLD
```

This intentionally requires higher-level resolution rather than silently discarding the job.

---

# 45. QC Role Boundary

Current QC-specific authority is narrower than Operations.

QC role can transition a job from:

```text id="77nrr2"
AWAITING_QC
```

to:

```text id="lwnu9w"
READY_FOR_HANDOFF
REWORK
ON_HOLD
```

This preserves separation of responsibility.

---

# 46. Invoice State Machine

Canonical entity:

```text id="xhes59"
invoices.status
```

Schema states:

```text id="vsmrqw"
DRAFT
ISSUED
PARTIALLY_PAID
PAID
OVERDUE
VOID
CANCELLED
```

Core finance lifecycle is substantially enforced.

---

# 47. Invoice Primary Flow

```text id="g6p1ye"
DRAFT
  ↓
ISSUED
  ↓
PARTIALLY_PAID
  ↓
PAID
```

`PARTIALLY_PAID` is skipped when first allocation pays the invoice completely.

---

# 48. Invoice Issue

Transition:

```text id="je1y6x"
DRAFT → ISSUED
```

is:

```text id="tjz5na"
ENFORCED
```

through:

```text id="162e7v"
issue_invoice(...)
```

Issuance requires valid payment/bank snapshot information.

---

# 49. Invoice Payment Transition

Payments move invoice:

```text id="9vuwls"
ISSUED
  ↓
PARTIALLY_PAID
  ↓
PAID
```

based on authoritative:

```text id="n0edwz"
amount_paid
balance_due
```

not arbitrary manual status.

---

# 50. Invoice Reversal Effect

When a confirmed payment is reversed:

```text id="oa2iur"
PAID
   ↓
PARTIALLY_PAID
or
ISSUED
```

depending on remaining allocation.

This is an important example of valid lifecycle movement that is not strictly forward-only.

Financial correction preserves history.

---

# 51. Invoice VOID

An invoice can be voided when no payment remains recorded.

```text id="g2imyo"
DRAFT / ISSUED / unpaid applicable state
      ↓
VOID
```

Current command prevents voiding invoices with recorded payments.

---

# 52. Invoice OVERDUE

Although `OVERDUE` exists in schema, canonical design SHOULD treat overdue primarily as a derived condition:

```text id="r2edrr"
due_date < today
AND
balance_due > 0
AND
status not in terminal states
```

Reason:

> Time passing should not require a nightly mutation merely to express an analytical condition.

Current enum support is retained for compatibility.

Future cleanup MAY remove the need for stored `OVERDUE`.

---

# 53. Invoice CANCELLED

`CANCELLED` exists in schema but no dedicated current lifecycle command was confirmed in this audit.

Classification:

```text id="785ncj"
SCHEMA_RESERVED / CANONICAL EXCEPTION
```

Use SHOULD require an explicit future command rather than arbitrary update.

---

# 54. Payment State Machine

Canonical entity:

```text id="3uf223"
payments.status
```

States:

```text id="hxge4z"
DRAFT
CONFIRMED
REJECTED
REVERSED
```

Operational current flow centers on:

```text id="vq8db0"
CONFIRMED
   ↓
REVERSED
```

---

# 55. Payment Creation

Primary payment command currently creates payment directly as:

```text id="q4gl3x"
CONFIRMED
```

after authorization and validation.

Therefore `DRAFT` and `REJECTED` are currently schema-supported states rather than major active workflow stages.

---

# 56. Payment CONFIRMED

Confirmed payment can:

```text id="w9wjrd"
remain partially/unallocated
or
be allocated to one/more invoices
```

Payment status and allocation status are separate concepts.

---

# 57. Payment Allocation

Allocation does not create a new payment state.

Instead it modifies:

```text id="587sxz"
allocated_amount
```

and corresponding invoice lifecycle.

This permits:

```text id="clihkq"
CONFIRMED payment
with
unallocated balance
```

---

# 58. Payment Reversal

Canonical:

```text id="59kum7"
CONFIRMED
   ↓
REVERSED
```

through:

```text id="znd4ip"
revert_payment(...)
```

Reversal:

```text id="5bgwvc"
adjusts invoice allocations
restores invoice balances
preserves payment history
```

It MUST NOT delete the original payment.

---

# 59. Shipment State Machine

Canonical entity:

```text id="3g2u1g"
shipments.status
```

Schema states:

```text id="frzjzj"
DRAFT
READY_TO_DISPATCH
DISPATCHED
IN_TRANSIT
DELIVERED
FAILED
RETURNED
CANCELLED
```

Current core path is partially enforced.

---

# 60. Shipment Primary Current Flow

```text id="mu8x7r"
READY_TO_DISPATCH
      ↓
DISPATCHED
      ↓
DELIVERED
```

A shipment may also be recognized as:

```text id="vzy8bw"
IN_TRANSIT
```

before delivery when external tracking integration supplies that state.

---

# 61. Shipment Creation

Current Delivery Order creation produces:

```text id="mpvayi"
READY_TO_DISPATCH
```

and allocates order-item quantities.

Ceiling guard prevents cumulative active shipment quantities from exceeding ordered quantities.

---

# 62. Shipment Dispatch

Allowed current command source states:

```text id="37rqij"
DRAFT
READY_TO_DISPATCH
```

transition to:

```text id="52ojc3"
DISPATCHED
```

External courier usually requires tracking number.

Dispatch may also record actual courier cost.

---

# 63. Shipment Delivery

Current allowed sources:

```text id="4koqxk"
DISPATCHED
IN_TRANSIT
```

transition to:

```text id="vjlzrj"
DELIVERED
```

`DELIVERED` is effectively terminal for the current normal flow.

---

# 64. Shipment Cancellation

A shipment may be cancelled before delivery.

```text id="2i9vik"
non-delivered shipment
      ↓
CANCELLED
```

Cancellation requires reason.

Delivered shipment MUST NOT be cancelled.

---

# 65. Shipment FAILED and RETURNED

Schema contains:

```text id="yyd7a7"
FAILED
RETURNED
```

but dedicated lifecycle commands were not confirmed in the current audited migration.

Therefore:

```text id="fulpnh"
CANONICAL
+
IMPLEMENTATION GAP
```

Future courier/event integration SHOULD introduce explicit transitions and reconciliation behavior.

---

# 66. Purchase Order State Machine

Canonical entity:

```text id="zmyu09"
purchase_orders.status
```

States:

```text id="a3zp5w"
DRAFT
ORDERED
PARTIALLY_RECEIVED
RECEIVED
CANCELLED
```

Current implemented flow begins at:

```text id="am8jj7"
ORDERED
```

---

# 67. Purchase Order Current Flow

```text id="ra2fmm"
ORDERED
   ↓
PARTIALLY_RECEIVED
   ↓
RECEIVED
```

Receipt command calculates whether all item quantities are fulfilled.

If all are received:

```text id="ugm5mi"
RECEIVED
```

otherwise:

```text id="9ndrb5"
PARTIALLY_RECEIVED
```

---

# 68. PO Receipt Guard

Goods receipt MUST NOT exceed ordered quantity.

Canonical invariant:

```text id="orh95g"
quantity_received
<=
quantity_ordered
```

`RECEIVED` or `CANCELLED` PO cannot accept additional receipt through current command.

---

# 69. PO DRAFT and CANCELLED

Both exist in schema.

Current `create_purchase_order(...)` creates PO directly as:

```text id="gci2cu"
ORDERED
```

No complete DRAFT/CANCELLED command lifecycle was confirmed in audited implementation.

Classification:

```text id="ms6slp"
SCHEMA_RESERVED / CANONICAL
```

Future procurement commands should formalize these transitions.

---

# 70. Goods Receipt Semantics

Goods Receipt does not have a mutable lifecycle state in current schema.

It represents an observed physical event.

Conceptually:

```text id="ug4z3a"
Purchase Commitment
      ↓
Physical Delivery
      ↓
Goods Receipt Record
```

Receipt should be treated as historical evidence rather than a long-lived state machine.

---

# 71. Vendor Bill State Machine

Canonical entity:

```text id="1kv32p"
vendor_bills.status
```

States:

```text id="ugv1gm"
OPEN
PARTIALLY_PAID
PAID
VOID
```

Current payment flow is enforced.

---

# 72. Vendor Bill Flow

```text id="0i7eqh"
OPEN
 ↓
PARTIALLY_PAID
 ↓
PAID
```

Payment may jump directly:

```text id="icw16w"
OPEN → PAID
```

when paid in full.

---

# 73. Vendor Bill Payment Guard

Cannot pay:

```text id="bevo8m"
PAID
VOID
```

Vendor bill payment cannot exceed:

```text id="d0mg0b"
balance_due
```

---

# 74. Vendor Bill VOID

`VOID` exists in schema.

A dedicated current void command was not confirmed.

Classification:

```text id="v5yxo6"
CANONICAL
+
IMPLEMENTATION GAP
```

---

# 75. Inventory Reservation State Machine

Canonical entity:

```text id="f4p50p"
inventory_reservations.status
```

States:

```text id="ycvad2"
ACTIVE
CONSUMED
RELEASED
```

Current lifecycle is enforced through inventory commands.

---

# 76. Inventory Reservation Flow

Normal usage:

```text id="q3wa0a"
ACTIVE
├── CONSUMED
└── RELEASED
```

`CONSUMED` and `RELEASED` are terminal historical states.

---

# 77. Inventory Reservation Meaning

## ACTIVE

Quantity is reserved and unavailable for competing allocation.

## CONSUMED

Reserved stock has been physically/operationally consumed.

## RELEASED

Reservation was cancelled/released without consumption.

---

# 78. Inventory Balance Is Not a State Machine

`inventory_levels` uses numeric state:

```text id="ekigb1"
quantity_on_hand
quantity_reserved
```

Availability is derived:

```text id="10l6nu"
available =
on_hand - reserved
```

Do not create artificial statuses such as:

```text id="g0zzgh"
IN_STOCK
LOW_STOCK
OUT_OF_STOCK
```

as canonical lifecycle unless a future use case requires them.

Those are better derived conditions.

---

# 79. Inventory Mutation Is an Event Ledger

`inventory_mutations` is append-oriented history.

Mutation types such as:

```text id="dlfar8"
INBOUND_PURCHASE
RESERVATION
RELEASE_RESERVATION
CONSUMED_PRODUCTION
SCRAP_DEFECT
OUTBOUND_SHIPMENT
STOCK_OPNAME
```

are event categories, not lifecycle states.

---

# 80. Vendor State

`vendors.status` currently supports:

```text id="nmeyoz"
ACTIVE
INACTIVE
SUSPENDED
```

This is master-data availability, not a transactional lifecycle.

Canonical semantics:

```text id="xhhl01"
ACTIVE
→ may participate in new business

INACTIVE
→ not currently used for new business

SUSPENDED
→ intentionally restricted due to operational/business concern
```

Existing historical references remain valid.

---

# 81. Organization / Brand Status

Master entities may use:

```text id="jw6frp"
ACTIVE
INACTIVE
ARCHIVED
```

These are lifecycle states of master configuration, not transaction states.

ARCHIVED data SHOULD remain referentially available for historical transactions.

---

# 82. User Status

Current user state:

```text id="et4ixz"
ACTIVE
INACTIVE
SUSPENDED
```

Identity lifecycle MUST remain separate from organization membership lifecycle.

---

# 83. Organization Membership State

Current membership:

```text id="7wfgsq"
ACTIVE
INACTIVE
INVITED
```

A valid User does not automatically have active access to every Organization.

---

# 84. Cross-Domain Commercial Flow

Canonical Custom B2B flow:

```text id="5v77kz"
Lead
NEW
 ↓
QUALIFIED
 ↓
CONVERTED

Requirement
DRAFT
 ↓
READY
 ↓
LOCKED

Quote
DRAFT
 ↓
SENT
 ↓
ACCEPTED

Order
CONFIRMED
 ↓
ACTIVE
 ↓
COMPLETED
```

Each transition belongs to its own domain.

---

# 85. Cross-Domain Production Flow

```text id="jxsxf7"
Order CONFIRMED
      ↓
Production Job PLANNED
      ↓
READY
      ↓
ASSIGNED
      ↓
ACCEPTED
      ↓
IN_PRODUCTION
      ↓
AWAITING_QC
      ↓
QC PASS
      ↓
READY_FOR_HANDOFF
      ↓
COMPLETED
```

Order does not become `IN_PRODUCTION`.

Production Job does.

---

# 86. Cross-Domain Financial Flow

```text id="fe9sx0"
Order
  ↓
Invoice DRAFT
  ↓
Invoice ISSUED
  ↓
Payment CONFIRMED
  ↓
Payment Allocation
  ↓
Invoice PARTIALLY_PAID / PAID
```

Payment state and Invoice state remain separate.

---

# 87. Cross-Domain Fulfillment Flow

```text id="q5k95r"
Order
  ↓
Shipment READY_TO_DISPATCH
  ↓
DISPATCHED
  ↓
IN_TRANSIT optional
  ↓
DELIVERED
```

Shipment status MUST NOT become Order status.

---

# 88. Cross-Domain Procurement Flow

```text id="ukug5r"
Purchase Order ORDERED
       ↓
Goods Receipt
       ↓
PO PARTIALLY_RECEIVED / RECEIVED
       ↓
Vendor Bill OPEN
       ↓
PARTIALLY_PAID / PAID
```

Inventory increases from accepted physical receipt.

Not merely from Purchase Order creation.

---

# 89. Derived Order Health

Founder-facing UI MAY calculate:

```text id="meps9f"
HEALTHY
ATTENTION
AT_RISK
BLOCKED
```

from multiple domain signals.

For example:

```text id="3ty66z"
production delay
invoice overdue
failed QC
shipment failure
margin degradation
```

These are:

```text id="azjcda"
DERIVED
```

not canonical `orders.status`.

---

# 90. Derived Payment Condition

Examples:

```text id="r09kop"
UNPAID
PARTIALLY_SETTLED
FULLY_SETTLED
OVERDUE_RECEIVABLE
```

may be derived for reporting.

Canonical invoice/payment records remain authoritative.

---

# 91. Derived Production Delay

Example:

```text id="fg5m8b"
target_completion_date < today
AND
status not terminal
```

may produce:

```text id="t5al23"
DELAYED
```

as condition.

Do not require lifecycle mutation just because time passed.

---

# 92. Derived Fulfillment Progress

Possible derived state:

```text id="09857l"
NOT_STARTED
PARTIAL
FULLY_ALLOCATED
DELIVERED
```

computed from Shipment Item quantities and Shipment states.

This SHOULD NOT create competing Order statuses.

---

# 93. Terminal State Rule

Terminal means:

> Normal lifecycle transition no longer continues from this state.

Terminal does not necessarily mean record becomes immutable in every field.

Common terminal states include:

```text id="cvmrvk"
Lead:
CONVERTED

Requirement:
CANCELLED

Quote Version:
ACCEPTED
REJECTED
EXPIRED
SUPERSEDED
CANCELLED

Production:
COMPLETED
CANCELLED

Payment:
REVERSED

Shipment:
DELIVERED
CANCELLED

PO:
RECEIVED
CANCELLED

Vendor Bill:
PAID
VOID

Inventory Reservation:
CONSUMED
RELEASED
```

---

# 94. Reopening Rule

A terminal entity SHOULD NOT be reopened through direct status reversal.

If reopening is legitimate, it requires an explicit command and business semantics.

Often correct pattern is:

```text id="xcjmxv"
old entity remains historical
+
new version / new transaction created
```

---

# 95. Cancellation Rule

Cancellation SHOULD require:

```text id="0wh3dq"
actor
reason
timestamp
audit
```

for material transactional entities.

Cancellation MUST NOT erase historical records.

---

# 96. Hold Rule

`ON_HOLD` SHOULD capture reason/context.

Hold is temporary suspension.

It MUST NOT automatically imply:

```text id="g9z8z6"
cancel
refund
reverse
delete
```

---

# 97. State Transition Authority

Permission and transition validity are separate.

A transition is allowed only if:

```text id="uj7i62"
transition graph permits it
AND
actor is authorized
AND
business guards pass
```

Human authority does not make invalid transition graph legal unless an explicit override command exists.

---

# 98. AI State Boundary

AI MAY:

```text id="hgd89n"
recommend transition
explain transition
detect stale state
predict risk
draft reason
```

AI MUST NOT:

```text id="q4uukm"
directly mutate status columns
invent current state
override guards
```

---

# 99. n8n State Boundary

n8n MAY orchestrate:

```text id="fnuzl4"
event
→ authorized command
```

n8n MUST NOT own transition semantics.

Correct:

```text id="mkioyr"
n8n
→ mark_quote_sent command
```

Not:

```text id="clddux"
n8n
→ UPDATE quote_versions
```

---

# 100. UI State Boundary

UI labels may simplify lifecycle presentation.

They MUST NOT redefine state semantics.

Example UI:

```text id="nrkr2e"
"Selesai"
```

could represent:

```text id="j8sg9a"
Order COMPLETED
```

but the UI text itself is not canonical state vocabulary.

---

# 101. Event Relationship

Material transitions SHOULD eventually generate corresponding business events.

Examples:

```text id="zonx6z"
lead.qualified
quote.sent
quote.accepted
production.started
qc.failed
payment.received
shipment.delivered
```

Event architecture remains separate from lifecycle storage.

---

# 102. Commands vs Events

Command:

```text id="drpcib"
MarkQuoteAccepted
```

means:

> Please attempt this state change.

Event:

```text id="m8m3w7"
QuoteAccepted
```

means:

> The state change happened.

These concepts MUST NOT be conflated.

---

# 103. State Transition History

Current implementation mostly uses domain audit tables.

Future MGBOS MAY introduce a normalized transition-history projection.

It SHOULD NOT replace existing domain audit history without migration.

Potential shape:

```text id="j84r9w"
entity_type
entity_id
from_state
to_state
actor
reason
occurred_at
correlation_id
```

This remains a future enhancement.

---

# 104. Current Enforcement Gaps

As of MGBOS-020, important gaps include:

```text id="p9pmhz"
Order:
complete transition command not yet implemented

Quote:
REJECTED / EXPIRED / CANCELLED
commands incomplete

Invoice:
CANCELLED semantics incomplete
OVERDUE better treated as derived

Shipment:
IN_TRANSIT / FAILED / RETURNED
provider transition commands incomplete

Purchase Order:
DRAFT / CANCELLED
commands incomplete

Vendor Bill:
VOID command incomplete
```

These are known implementation gaps.

They MUST NOT be interpreted as permission for raw status updates.

---

# 105. Enforcement Priority

Catatan penyelesaian Phase 1 Operating Spine:

- **Order lifecycle commands**: `COMPLETED & ENFORCED`
- **Vendor-backed Production Assignment & transitions**: `COMPLETED & ENFORCED`
- **QC / Fulfillment Readiness gate**: `COMPLETED & ENFORCED`

Sisa prioritas implementasi lifecycle di luar spine utama:

```text id="bcffqb"
P0
Quote exception transitions

P1
Shipment provider/reconciliation transitions

P1
Purchase Order cancellation

P1
Vendor Bill void semantics

P2
Invoice overdue normalization

P2
Generic transition observability
```

---

# 106. State Machine Testing Standard

Each enforced lifecycle SHOULD test:

```text id="ud2z7p"
valid forward transition
invalid transition
terminal-state rejection
authorization failure
organization isolation
idempotent retry where applicable
concurrent mutation where relevant
required reason/guard
audit creation
```

High-risk financial lifecycles require stronger negative testing.

---

# 107. Concurrency Rule

Transitions affecting:

```text id="r7y5o6"
money
inventory
allocation
document numbering
production assignment
shipment quantity
procurement receipt
```

SHOULD lock or otherwise protect authoritative state against concurrent conflicting mutation.

---

# 108. Cross-Domain Atomicity

When one business command must change several tightly coupled states, changes SHOULD be atomic when practical.

Example:

```text id="9s6a2k"
record payment
+
create allocation
+
update invoice balance
```

should not leave partial state.

---

# 109. Cross-Domain Orchestration

Not all state changes belong in one transaction.

Example:

```text id="r8q9kt"
Quote ACCEPTED
        ↓
Order creation
        ↓
future production planning
        ↓
notification
```

Only integrity-critical state should be tightly coupled.

Other reactions may be event-driven.

---

# 110. Failure Principle

If transition result is uncertain:

```text id="8qxy9l"
UNKNOWN
```

is preferable to inventing success.

External side effects may require reconciliation before retry.

This is especially important for:

```text id="qpw8i9"
payments
shipments
external provider commands
notifications with material consequence
```

---

# 111. State Ownership Summary

| Domain                | Canonical State Owner           |
| --------------------- | ------------------------------- |
| Lead                  | `leads.status`                  |
| Requirement           | `requirements.status`           |
| Quote                 | `quote_versions.status`         |
| Order                 | `orders.status`                 |
| Production            | `production_jobs.status`        |
| Production Assignment | `production_assignments.status` |
| QC                    | `qc_inspections.result`         |
| Invoice               | `invoices.status`               |
| Payment               | `payments.status`               |
| Shipment              | `shipments.status`              |
| Purchase Order        | `purchase_orders.status`        |
| Vendor Bill           | `vendor_bills.status`           |
| Inventory Reservation | `inventory_reservations.status` |
| Vendor availability   | `vendors.status`                |
| Membership            | `organization_members.status`   |

---

# 112. Lifecycle Separation Invariant

The following substitutions are prohibited:

```text id="q99v7s"
invoice PAID
≠ order COMPLETED

production COMPLETED
≠ shipment DELIVERED

quote ACCEPTED
≠ payment RECEIVED

shipment DELIVERED
≠ invoice PAID

PO RECEIVED
≠ vendor bill PAID

inventory RESERVED
≠ inventory CONSUMED
```

Each fact has its own owner.

---

# 113. Founder Command Center Rule

Founder Command Center MAY combine state machines into derived business understanding.

Example:

```text id="lrwwh5"
Order TS-O-2026-000121

Commercial: ACTIVE
Finance: PARTIALLY_PAID
Production: AT_RISK
QC: WAITING
Fulfillment: NOT_STARTED
Margin: WARNING
```

This is the correct use of aggregation.

It MUST NOT flatten those domains into a single persisted state.

---

# 114. Canonicalization Effect

With activation of this document:

```text id="rd1pfq"
catatan/sesi/
MGBOS 0.3 — Business State Machines
```

changes from:

```text id="cs297j"
TRANSITIONAL_AUTHORITY
```

to:

```text id="3quoc1"
HISTORICAL / DESIGN PROVENANCE
```

for lifecycle semantics.

This document becomes the canonical source.

---

# 115. Relationship to Implementation

Hierarchy:

```text id="6ib95o"
THIS DOCUMENT
→ canonical lifecycle semantics

COMMANDS / DATABASE FUNCTIONS
→ enforcement

SCHEMA CONSTRAINTS
→ vocabulary / integrity

AUDIT TABLES
→ transition evidence

TESTS
→ verification
```

A state added to schema without lifecycle semantics is not sufficient.

A lifecycle change requires review of this specification.

---

# 116. Operational Exception State Machine (CANONICAL_TARGET)

Status kematangan:

```text
CANONICAL_TARGET
```

## Canonical States

```text
OPEN
ACKNOWLEDGED
RESOLVED
DISMISSED
```

Arti setiap state:

- **`OPEN`**: Anomali operasional baru terdeteksi secara otomatis atau dibuka manual; belum diakui oleh handler yang ditugaskan.
- **`ACKNOWLEDGED`**: Exception telah diakui oleh penanggung jawab operasional (_handler_). Tanggung jawab penanganan/investigasi telah diterima.
- **`RESOLVED`**: Masalah akar operasional telah diselesaikan dengan tindakan nyata, perbaikan akar masalah, ATAU risiko operasional riil telah diterima secara formal oleh Owner (_accepted risk resolution_). Sesuai D3: **Accepted Risk Is Resolution, Not Dismissal**. Resolusi berbasis _accepted risk_ wajib menyertakan justifikasi formal dan otorisasi Owner.
- **`DISMISSED`**: Exception ditutup karena anomali tersebut terbukti tidak valid atau tidak dapat diaplikasikan (misal: `FALSE_POSITIVE`, `DUPLICATE`, `NOT_APPLICABLE`, `OPENED_IN_ERROR`). **`DISMISSED` TIDAK BOLEH digunakan untuk menerima risiko riil.** Penerimaan risiko operasional riil harus melalui alur `RESOLVED` dengan konteks _accepted risk_.

## Canonical Transition Paths

```text
OPEN ───────────► ACKNOWLEDGED ───────────► RESOLVED
  │                     │                      ▲
  │                     │                      │
  │                     ▼                      │
  ├───────────────► DISMISSED                  │
  │                                            │
  └────────────────────────────────────────────┘
```

Path transisi kanonikal:

1. `OPEN → ACKNOWLEDGED`: Handler menerima tanggung jawab investigasi dan penanganan.
2. `ACKNOWLEDGED → RESOLVED`: Masalah operasional diselesaikan dengan bukti penyelesaian operasional, atau ditutup melalui resolusi penerimaan risiko formal (_accepted risk_) dengan otorisasi Owner.
3. `OPEN → RESOLVED`: Penyelesaian langsung atau penerimaan risiko formal langsung tanpa fase investigasi perantara.
4. `OPEN → DISMISSED`: Penutupan karena kesalahan pencatatan atau anomali tidak valid/non-aplikabel (`FALSE_POSITIVE`, `DUPLICATE`, `NOT_APPLICABLE`, `OPENED_IN_ERROR`).
5. `ACKNOWLEDGED → DISMISSED`: Penutupan setelah investigasi membuktikan anomali tidak valid, duplikat, atau tidak dapat diaplikasikan. **Bukan untuk penerimaan risiko operasional riil.**

## Governed Reopen Transitions

Diperbolehkan transisi balik eksplisit:

```text
RESOLVED ──────(governed REOPEN)──────► OPEN
DISMISSED ─────(governed REOPEN)──────► OPEN
```

Aturan reopen:

- `REOPENED` adalah **EVENT / TRANSITION SEMANTIC**, **bukan** status _current state_ jangka panjang.
- Ketika command reopen dieksekusi, sistem mencatat event reopen pada audit trail dan mengembalikan status entitas menjadi `OPEN`.
- Episode exception yang di-reopen tetap mempertahankan stable identity dan riwayat audit penuh sebelumnya (_same logical episode_).

## State Machine Boundaries & Invariants

1. **`ACKNOWLEDGED ≠ RESOLVED`**: Mengakui masalah bukan berarti masalah telah selesai. Status `ACKNOWLEDGED` tidak menutup pengecualian.
2. **`ACCEPTED RISK IS RESOLUTION, NOT DISMISSAL`**: Penerimaan risiko operasional riil adalah hasil resolusi sah (`RESOLVED`), bukan pembatalan/penolakan (`DISMISSED`). Dismissal terbatas mutlak pada anomali palsu, duplikat, tidak relevan, atau salah input.
3. **`SEVERITY ≠ LIFECYCLE`**: Tingkat keparahan (`LOW`, `MEDIUM`, `HIGH`, `CRITICAL`) adalah atribut klasifikasi dampak bisnis, bukan state transisi mesin. Perubahan severity adalah mutasi data yang tercatat di audit log, bukan pergantian lifecycle state.
4. **`SEVERITY ≠ FOUNDER ATTENTION PRIORITY`**: Tingkat keparahan `CRITICAL` tidak otomatis memaksa prioritas perhatian founder menjadi `INTERRUPT`. Prioritas dihitung terpisah oleh proyeksi perhatian.
5. **`FOUNDER DECISION REQUIRED ≠ EXCEPTION STATE`**: Flag kebutuhan keputusan founder adalah dimensi perhatian ortogonal, bukan status mesin exception.
6. **Penugasan Bukan Transisi Lifecycle**: Perubahan penugasan (_assign / reassign_) adalah mutasi atribut penanggung jawab, bukan perubahan status lifecycle state machine.
7. **Isolasi Mutasi Domain Asal**: Resolusi Operational Exception **TIDAK BOLEH** secara implisit mengubah state domain asal (misal: menyelesaikan exception pengiriman terlambat tidak otomatis menandai shipment terkirim; menandai exception selesai tidak otomatis menyelesaikan order). Perubahan domain asal harus dipicu melalui command domain masing-masing.

---

# 117. Founder Attention Projection Semantics (CANONICAL_TARGET)

Status kematangan:

```text
CANONICAL_TARGET (DERIVED PROJECTION)
```

Perhatian founder (**Founder Attention**) adalah proyeksi baca (_read projection_) yang diturunkan secara dinamis dari domain transaksional dan Operational Exceptions.

Sesuai spesifikasi produk D2:

- Perhatian founder **BUKAN** mesin state transaksional yang persisten secara independen.
- **TIDAK ADA** lifecycle transaksional mandiri (proyeksi tidak memiliki state transaksional tersendiri).
- **TIDAK ADA** aksi generik _Dismiss_ pada v1.
- **TIDAK ADA** kebutuhan generik _Snooze_ pada v1.
- **TIDAK ADA** lifecycle _Mark Done_ generik pada v1.

Item perhatian muncul dan hilang secara dinamis ketika kondisi fakta operasional yang mendasarinya berubah.

## Dimensi Klasifikasi & Atribut Proyeksi

Proyeksi perhatian mengklasifikasikan item perhatian berdasarkan:

1. **Attention Kind (D2 Authoritative Taxonomy)**:
   - `DECISION`: Membutuhkan keputusan founder untuk membuka hambatan bisnis.
   - `ACTION`: Membutuhkan tindakan langsung founder.
   - `WAITING`: Menunggu pihak eksternal/internal dengan batas waktu yang dipantau.
   - `WATCH`: Memantau risiko atau anomali yang belum memerlukan intervensi langsung.
   - `DATA_GAP`: Informasi operasional kritis belum lengkap atau inkonsisten.
2. **Priority**: Urutan prioritas penanganan perhatian founder (`P0`, `P1`, `P2`, `P3`).
3. **Urgency**: Tingkat kedesakan waktu operasional.
4. **Founder Decision Required**: Flag eksplisit apakah keputusan founder secara aktif memblokir alur operasional.
5. **Flow Impact**: Dampak terhadap kelancaran arus operasional dan komitmen pelanggan.

## Aturan Proyeksi & Batasan Kanonikal

1. **State-Neutral Reads**: Membuka Founder Home, mengevaluasi proyeksi, atau menjalankan query perhatian founder **TIDAK BOLEH** memicu mutasi sampingan pada domain transaksional maupun Operational Exceptions.
2. **Hilangnya Perhatian Bukan Berarti Exception Selesai**: Hilangnya suatu item perhatian dari proyeksi founder (misal karena filter, pergeseran waktu, atau kondisi perhatian teratasi) **TIDAK BERARTI** Operational Exception di domain operasional telah selesai. Operational Exception tetap berstatus aktif (`OPEN` atau `ACKNOWLEDGED`) dan harus diselesaikan melalui command transaksional governed tersendiri.
3. **Transient Dynamic Evaluation**: Proyeksi perhatian dievaluasi ulang saat data dibaca; tidak memerlukan tabel riwayat audit mandiri di luar audit trail domain asal dan operational exceptions.

---

# 118. Architectural Invariants

1. Each domain owns its own lifecycle.
2. Order status does not encode payment, production, QC, or shipping.
3. Stored state is separate from derived condition.
4. Commands request transitions; events report completed transitions.
5. Critical transitions require authorization and validation.
6. Terminal history is not reopened casually.
7. Cancellation preserves history.
8. Locked commercial snapshots are not rewritten.
9. Financial correction uses reversal, not deletion.
10. Physical receipt/delivery requires trusted observation.
11. AI does not own state transitions.
12. n8n does not define lifecycle semantics.
13. UI labels do not define canonical state.
14. Unknown external outcome is not success.
15. Cross-domain side effects should preserve atomicity where required.
16. Status vocabulary alone does not prove transition enforcement.
17. Derived health belongs to projections, not transactional state.
18. Historical transitions should remain auditable.
19. Implementation gaps remain explicit until commands enforce them.
20. State machine complexity must reflect real business lifecycle, not imagined edge cases.

---

# 119. Final Mental Model

```text id="4ufuj1"
CUSTOMER INTENT
      ↓
LEAD STATE
      ↓
REQUIREMENT STATE
      ↓
QUOTE STATE
      ↓
ORDER STATE
      │
      ├─────────── FINANCE STATE
      │
      ├─────────── PRODUCTION STATE
      │                    │
      │                    └── QC RESULT
      │
      ├─────────── INVENTORY STATE
      │
      ├─────────── PROCUREMENT STATE
      │
      ├─────────── FULFILLMENT STATE
      │                    │
      ▼                    ▼
OPERATIONAL EXCEPTION  BUSINESS REALITY
      │                    │
      ▼                    ▼
FOUNDER ATTENTION PROJECTION
```

Founder-facing intelligence is derived from all of them.

---

# 120. Final Principle

> **State machines exist to represent business reality precisely—not to make UI filtering convenient.**

A mature MGBOS should always be able to explain:

```text id="d5sndh"
what state an entity is in,
how it got there,
who caused the change,
whether the transition was allowed,
and what other domain states remain independent.
```
