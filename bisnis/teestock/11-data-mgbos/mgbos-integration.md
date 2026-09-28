---
title: "TeeStock MGBOS Integration"
document_id: "TS-DAT-005"
version: "1.0"
status: "CANONICAL"
category: "data-mgbos"
business: "teestock"
last_updated: "2026-09-28"
depends_on:
  - "TS-DAT-001"
  - "TS-DAT-002"
  - "TS-DAT-003"
  - "TS-DAT-004"
  - "TS-TEC-001"
  - "TS-TEC-003"
  - "TS-TEC-004"
  - "TS-TEC-005"
  - "TS-TEC-006"
---

# TeeStock MGBOS Integration v1.0

> **Canonical TeeStock Systems Integration, Source-of-Truth, API, Adapter & MGBOS Connectivity Framework**  
> Dokumen ini mendefinisikan bagaimana TeeStock Website, Commerce, MGBOS, CRM, n8n, Creator Platform, Partner Platform, Finance, marketplace, payment provider, logistics, analytics, knowledge systems, dan future Jarvis/AI agents terhubung melalui canonical APIs, events, adapters, synchronization rules, read models, identity, permissions, observability, and recovery controls.

---

# 1. Purpose

MGBOS Integration menjawab:

> **Bagaimana berbagai sistem TeeStock saling bertukar data dan menjalankan proses tanpa menciptakan duplicate truth, hidden business logic, fragile point-to-point integrations, dan dependency chaos?**

Canonical principle:

> **Integrate through contracts. Coordinate through MGBOS. Preserve domain truth.**

---

# 2. Canonical Definition

> **TeeStock MGBOS Integration adalah governed connectivity architecture yang menghubungkan internal and external systems melalui canonical domain interfaces, APIs, events, adapters, workflows, read models, identity, permissions, and reconciliation sehingga setiap system dapat berinteraksi tanpa mengambil alih authoritative ownership dari domain yang bukan miliknya.**

---

# 3. MGBOS Role

Canonical:

> **MGBOS is the operational control plane connecting canonical business objects, workflows, approvals, exceptions, analytics, integrations, and AI—not a replacement for every specialist system.**

---

# 4. MGBOS Is Not a Giant Database Wrapper

Avoid architecture:

```text
EVERY EXTERNAL SYSTEM
↓
MGBOS TABLE
↓
MANUAL SYNC
```

Instead:

```text
DOMAIN TRUTH
+
GOVERNED INTERFACES
+
MGBOS CONTROL
```

---

# 5. Integration Architecture

Canonical:

```text
USER / EXTERNAL SYSTEM
        │
        ▼
INTERFACE / ADAPTER
        │
        ▼
CANONICAL DOMAIN SERVICE
        │
        ├── STATE
        ├── API
        └── EVENTS
        │
        ▼
       MGBOS
        │
        ├── WORKFLOW
        ├── APPROVAL
        ├── EXCEPTION
        ├── READ MODELS
        └── AUTOMATION
        │
        ▼
INTEGRATIONS / AI / ANALYTICS
```

---

# 6. Core Integration Principles

```text
ONE DOMAIN
OWNS ONE TRUTH.

SYSTEMS EXCHANGE CONTRACTS,
NOT DATABASE ASSUMPTIONS.

EXTERNAL SCHEMAS
ADAPT INTO CANONICAL SCHEMAS.

EVENTS
BROADCAST FACTS.

APIS
PERFORM QUERIES / COMMANDS.

WORKFLOWS
COORDINATE LONG-RUNNING PROCESSES.

MGBOS
OBSERVES AND ORCHESTRATES.
```

---

# 7. Integration Patterns

Canonical integration mechanisms:

```text
SYNCHRONOUS API
EVENT
WEBHOOK
QUEUE / JOB
BATCH / SCHEDULED SYNC
READ MODEL
FILE EXCHANGE
```

---

# 8. Synchronous API

Use when caller needs immediate response.

Examples:

```text
GET PRODUCT
CREATE ORDER
CHECK PRICE
REQUEST APPROVAL
```

---

# 9. Event

Use when fact has already happened and downstream consumers may react independently.

Examples:

```text
order.created
payment.completed
shipment.delivered
```

---

# 10. Webhook

Delivery mechanism from external systems.

Canonical:

```text
EXTERNAL WEBHOOK
↓
VERIFY
↓
NORMALIZE
↓
DOMAIN ACTION / EVENT
```

---

# 11. Queue / Job

Use for asynchronous executable work.

Examples:

```text
SYNC MARKETPLACE LISTING
GENERATE DOCUMENT
SEND NOTIFICATION
```

---

# 12. Batch / Scheduled Sync

Use when:

```text
REAL-TIME NOT REQUIRED
or
EXTERNAL SYSTEM HAS NO EVENT/API SUPPORT
```

---

# 13. Read Model

Optimized combined view for:

```text
MGBOS
PORTAL
DASHBOARD
AI CONTEXT
```

without duplicating authoritative write ownership.

---

# 14. File Exchange

Useful for legacy/partner flows:

```text
CSV
PDF
SPREADSHEET
```

but should not become preferred integration method where APIs/events exist.

---

# 15. API vs Event

Canonical:

```text
API
ASK / COMMAND.

EVENT
ANNOUNCE FACT.
```

---

# 16. Example

```text
API:
POST /orders

EVENT:
order.created
```

---

# 17. Sync vs Async

Use synchronous flow only when immediate dependency is required.

---

# 18. Example — Checkout

Customer needs immediate:

```text
PRICE
AVAILABILITY
PAYMENT SESSION
```

so synchronous APIs are appropriate.

---

# 19. Example — Retention

`order.completed` can asynchronously trigger:

```text
retention
review request
analytics
```

---

# 20. Avoid Long Synchronous Chains

Anti-pattern:

```text
Website
→ Commerce
→ Inventory
→ Finance
→ n8n
→ WhatsApp
→ CRM
→ Analytics
```

all before responding to customer.

---

# 21. Core Transaction First

Canonical:

```text
COMMIT CORE BUSINESS STATE
↓
RESPOND
↓
ASYNC SIDE EFFECTS
```

where appropriate.

---

# 22. Source-of-Truth Matrix

Every domain should declare authoritative owner.

---

# 23. Identity Truth

Canonical owner:

```text
IDENTITY DOMAIN / MGBOS IDENTITY SERVICE
```

owns:

```text
PERSON
ORGANIZATION ACCOUNT
USER ACCOUNT
ROLE / MEMBERSHIP
```

---

# 24. Product Truth

Canonical owner:

```text
PRODUCT DOMAIN
```

owns:

```text
PRODUCT
VARIANT
SKU
MATERIAL
BOM
RECIPE
```

---

# 25. Pricing Truth

Canonical owner:

```text
PRICING DOMAIN
```

owns:

```text
PRICE BOOK
PRICE RULE
PROMOTION RULE
```

---

# 26. Inventory Truth

Canonical owner:

```text
INVENTORY LEDGER
```

owns:

```text
MOVEMENTS
RESERVATIONS
AVAILABLE-TO-SELL
```

---

# 27. Commerce Truth

Canonical owner:

```text
COMMERCE / ORDER DOMAIN
```

owns:

```text
CART
CHECKOUT
ORDER
ORDER ITEM
```

---

# 28. Payment Truth

Canonical owner:

```text
PAYMENT DOMAIN
```

owns normalized:

```text
PAYMENT
PAYMENT ATTEMPT
REFUND
SETTLEMENT CONTEXT
```

---

# 29. Production Truth

Canonical owner:

```text
PRODUCTION DOMAIN
```

owns:

```text
PRODUCTION JOB
WORK ORDER
EXECUTION STATE
```

---

# 30. Quality Truth

Canonical owner:

```text
QUALITY DOMAIN
```

owns:

```text
INSPECTION
DEFECT
QC RESULT
REWORK
```

---

# 31. Fulfillment Truth

Canonical owner:

```text
FULFILLMENT DOMAIN
```

owns:

```text
FULFILLMENT
SHIPMENT
PACKAGE
TRACKING NORMALIZATION
```

---

# 32. Customer Service Truth

Canonical owner:

```text
CUSTOMER OPS
```

owns:

```text
CASE
RESOLUTION
CASE STATUS
```

---

# 33. Creator Truth

Canonical owner:

```text
CREATOR DOMAIN
```

owns:

```text
CREATOR RELATIONSHIP
ENROLLMENT
ARTWORK
COLLAB
CREATOR PRODUCT RELATIONSHIP
```

---

# 34. Earning Truth

Canonical owner:

```text
CREATOR / FINANCE LEDGER
```

owns:

```text
EARNING
REVERSAL
PAYABLE STATUS
```

---

# 35. Payout Truth

Canonical owner:

```text
FINANCE / TREASURY
```

owns:

```text
PAYOUT
CASH EXECUTION
```

---

# 36. Partner Truth

Canonical owner:

```text
PARTNER DOMAIN
```

owns:

```text
PARTNER RELATIONSHIP
CAPABILITY
RATE
CAPACITY
```

---

# 37. Procurement Truth

Canonical owner:

```text
PROCUREMENT DOMAIN
```

owns:

```text
PURCHASE REQUEST
PURCHASE ORDER
GOODS RECEIPT
```

---

# 38. Finance Truth

Canonical owner:

```text
FINANCE
```

owns:

```text
RECEIVABLE
PAYABLE
COST ENTRY
CASH TRANSACTION
RECONCILIATION
```

---

# 39. Marketing Truth

Canonical owner:

```text
MARKETING DOMAIN
```

owns:

```text
CAMPAIGN
CONTENT
SEGMENT
ATTRIBUTION RULES
```

---

# 40. Automation Truth

Canonical owner:

```text
AUTOMATION / MGBOS CONTROL
```

owns:

```text
AUTOMATION
WORKFLOW RUN
JOB
APPROVAL
EXCEPTION
AGENT CONFIG
```

---

# 41. External System Principle

Canonical:

> **External platform can be authoritative for facts that happen inside that platform, but TeeStock must normalize those facts into its own canonical business model.**

---

# 42. Payment Provider Example

Provider owns:

```text
provider transaction result
```

TeeStock owns normalized:

```text
Payment state
```

---

# 43. Carrier Example

Carrier owns:

```text
carrier tracking scans
```

TeeStock owns normalized:

```text
Shipment state
```

---

# 44. Marketplace Example

Marketplace owns:

```text
external listing/order state
```

TeeStock owns normalized:

```text
Channel Listing
Order
Order Item
```

---

# 45. External System Never Becomes Canonical Identity

Canonical internal IDs remain primary.

---

# 46. Adapter Pattern

Canonical:

```text
EXTERNAL MODEL
↓
ADAPTER
↓
CANONICAL MODEL
```

and outbound:

```text
CANONICAL MODEL
↓
ADAPTER
↓
EXTERNAL MODEL
```

---

# 47. Adapter Responsibility

Adapter handles:

```text
FIELD MAPPING
ENUM MAPPING
ID MAPPING
VALIDATION
ERROR NORMALIZATION
```

---

# 48. Adapter Must Not Own Business Policy

Example:

Marketplace adapter should not determine TeeStock margin floor.

---

# 49. Integration Boundary

Canonical:

```text
BUSINESS POLICY
in domain.

PLATFORM TRANSLATION
in adapter.
```

---

# 50. External Object Mapping

Canonical mapping:

```text
INTEGRATION
+
EXTERNAL OBJECT TYPE
+
EXTERNAL ID
↔
CANONICAL ENTITY
```

---

# 51. External Mapping Examples

```text
Shopee Order → TeeStock Order
Xendit Payment → TeeStock Payment
JNE Tracking → TeeStock Shipment
```

---

# 52. Mapping Uniqueness

Prevent two canonical objects mapping accidentally to same external object unless explicitly valid.

---

# 53. Sync Direction

Every integration should declare:

```text
INBOUND
OUTBOUND
BIDIRECTIONAL
```

---

# 54. Inbound

External → TeeStock.

Example:

```text
MARKETPLACE ORDER
→ TEEStock
```

---

# 55. Outbound

TeeStock → external.

Example:

```text
INVENTORY ATS
→ MARKETPLACE
```

---

# 56. Bidirectional

Use cautiously.

Bidirectional state ownership can create loops.

---

# 57. Field-Level Ownership

For bidirectional integrations, declare ownership per field.

---

# 58. Example Marketplace Listing

```text
Product master data:
TeeStock owns.

External review count:
Marketplace owns.

Stock:
TeeStock canonical inventory owns.

Marketplace listing status:
Marketplace owns external status,
TeeStock stores normalized mapping.
```

---

# 59. Conflict Resolution

Canonical:

> **Conflict should be resolved by authoritative field ownership, not last-write-wins by default.**

---

# 60. Last-Write-Wins Risk

May overwrite valid canonical truth with stale external state.

---

# 61. Sync Loop Protection

Need:

```text
ORIGIN
MAPPING
IDEMPOTENCY
CHANGE VERSION
```

where applicable.

---

# 62. Example Echo Loop

```text
MGBOS updates marketplace price
↓
marketplace webhook
↓
MGBOS thinks new price change
↓
pushes again
```

Must stop.

---

# 63. Origin Tracking

Integration changes should preserve:

```text
source_system
source_event_id
```

---

# 64. API Architecture

Canonical internal API domains may include:

```text
Identity API
Product API
Pricing API
Commerce API
Inventory API
Production API
Fulfillment API
Creator API
Partner API
Finance API
Automation API
```

---

# 65. API-First Thinking

Does not mean every module must become separate microservice.

---

# 66. Modular Monolith

Early architecture can expose logical APIs/modules within one application.

---

# 67. API Contracts

Every material API should define:

```text
INPUT
OUTPUT
AUTH
VALIDATION
ERRORS
IDEMPOTENCY
VERSION
```

---

# 68. Command API

Performs business action.

Example:

```text
POST /orders/{id}/cancel
```

---

# 69. Query API

Retrieves state.

Example:

```text
GET /orders/{id}
```

---

# 70. Avoid CRUD-Only Thinking

Business actions often deserve semantic commands.

Better:

```text
POST /work-orders/{id}/acknowledge
```

than arbitrary:

```text
PATCH status = ACKNOWLEDGED
```

---

# 71. Why Semantic Commands

They allow:

```text
VALIDATION
AUTHORIZATION
EVENT EMISSION
AUDIT
```

---

# 72. API Versioning

Breaking contract requires version strategy.

---

# 73. Internal API Stability

Internal consumers still need controlled changes.

---

# 74. API Gateway

Not mandatory V1.

Can become useful when:

```text
SERVICES
PORTALS
AI TOOLS
EXTERNAL INTEGRATIONS
```

increase.

---

# 75. API Gateway Responsibilities

Potential:

```text
AUTH
RATE LIMIT
ROUTING
LOGGING
VERSIONING
```

---

# 76. MGBOS Service Layer

MGBOS should call domain interfaces.

Avoid direct uncontrolled cross-table mutations.

---

# 77. MGBOS Read Access

May use optimized read models.

---

# 78. MGBOS Write Access

Should invoke domain commands.

---

# 79. Example

Bad:

```text
MGBOS directly:
UPDATE orders SET status='CANCELLED'
```

Preferred:

```text
CancelOrder command
↓
Commerce validates
↓
Order cancelled
↓
event emitted
```

---

# 80. Read Model Architecture

MGBOS needs cross-domain views.

---

# 81. Order 360 Read Model

Potential combines:

```text
ORDER
CUSTOMER
PAYMENT
PRODUCTION
SHIPMENT
RETURN
CASE
```

---

# 82. Customer 360 Read Model

Potential:

```text
IDENTITY
ORDERS
PROJECTS
CASES
RETENTION
VALUE
```

---

# 83. Product 360 Read Model

Potential:

```text
PRODUCT
SKU
INVENTORY
SALES
COST
RETURNS
CREATOR
```

---

# 84. Partner 360 Read Model

Potential:

```text
CAPABILITY
WORK ORDERS
QC
COST
CLAIMS
PERFORMANCE
```

---

# 85. Read Model Is Disposable

Canonical truth remains in source domains.

Read model can be rebuilt.

---

# 86. Read Model Freshness

Define:

```text
REAL-TIME
NEAR REAL-TIME
BATCH
```

according to use case.

---

# 87. Order Operations

Need near-real-time.

---

# 88. Executive Dashboard

May tolerate modest delay.

---

# 89. Analytics

Often batch/near-real-time.

---

# 90. AI Context

Needs freshness appropriate to action risk.

---

# 91. Jarvis Integration

Canonical:

```text
USER INTENT
↓
JARVIS
↓
TOOL GATEWAY
↓
DOMAIN API / READ MODEL
↓
MGBOS
```

---

# 92. Jarvis Does Not Get Database Superuser Access

Canonical.

---

# 93. Jarvis Tool Gateway

Exposes bounded capabilities:

```text
GET_ORDER
SEARCH_CUSTOMER
CREATE_TASK
REQUEST_REFUND
GET_CASH_SUMMARY
```

---

# 94. Tool Contract

Every tool should define:

```text
PURPOSE
INPUT
OUTPUT
PERMISSION
RISK
SIDE EFFECT
```

---

# 95. Read Tool

No material side effect.

---

# 96. Write Tool

Mutates state through domain command.

---

# 97. High-Risk Tool

Requires:

```text
POLICY
+
APPROVAL
```

---

# 98. Tool Authorization

Evaluate:

```text
USER
+
AGENT
+
TOOL
+
RESOURCE
+
ACTION
```

---

# 99. Jarvis Permission Principle

Canonical:

> **Jarvis can never grant itself more authority than the requesting user and agent policy allow.**

---

# 100. Agent Service Identity

Every agent/tool execution should use scoped identity.

---

# 101. No Shared Root Credential

Canonical.

---

# 102. AI Read Models

AI may receive dedicated contextual read models.

Example:

```text
OrderSupportContext
```

containing only relevant order/support information.

---

# 103. Why AI-Specific Read Model

Reduces:

```text
TOKEN USE
DATA EXPOSURE
CONTEXT NOISE
```

---

# 104. Knowledge Integration

Canonical docs/SOPs can later be exposed through knowledge retrieval.

---

# 105. Knowledge vs Operational Data

Critical:

```text
POLICY
→ KNOWLEDGE

CURRENT ORDER STATUS
→ DOMAIN DATA
```

---

# 106. Jarvis Should Retrieve Both

Example:

> Can this order still be cancelled?

Requires:

```text
current Order state
+
cancellation policy
```

---

# 107. Knowledge Source

Canonical Business Hub documents become machine-readable policy layer.

---

# 108. Document Version Awareness

Agent should know which canonical version is active.

---

# 109. Knowledge Citations

Future internal AI responses should be traceable to source policy/document where useful.

---

# 110. Website Integration

Website should interact through:

```text
Commerce APIs
Content APIs
Identity
Lead APIs
```

rather than directly manipulating operational records.

---

# 111. Public Website Reads

Potential:

```text
PRODUCT
CATALOG
PRICE
AVAILABILITY
CONTENT
```

---

# 112. Public Website Writes

Potential:

```text
CART
ORDER
LEAD
APPLICATION
SUPPORT REQUEST
```

---

# 113. Website Should Not Know Internal Production Logic

Canonical.

---

# 114. Commerce Integration

Commerce integrates with:

```text
Product
Pricing
Inventory
Payment
Fulfillment
Customer
```

---

# 115. Commerce-to-Inventory

Synchronous:

```text
CHECK ATS
RESERVE
```

where required.

---

# 116. Commerce-to-Payment

Creates payment intent/session.

---

# 117. Commerce-to-Production

Prefer event-driven after Order eligibility.

---

# 118. Commerce-to-Retention

Event-driven.

---

# 119. Marketplace Integration

Canonical flow:

```text
MARKETPLACE
↓
ADAPTER
↓
CANONICAL ORDER
↓
MGBOS
```

Outbound:

```text
PRODUCT / PRICE / ATS
↓
ADAPTER
↓
MARKETPLACE LISTING
```

---

# 120. Marketplace Integration Modules

Potential:

```text
LISTING SYNC
INVENTORY SYNC
PRICE SYNC
ORDER INGESTION
CANCELLATION
RETURN
SETTLEMENT
```

---

# 121. Marketplace Integration Maturity

Start with:

```text
ORDER INGESTION
+
MANUAL / SEMI-MANUAL LISTING
```

before real-time everything.

---

# 122. Payment Integration

Canonical flow:

```text
TEEStock Payment Intent
↓
Provider
↓
Webhook
↓
Verify
↓
Normalize
↓
Payment State
↓
payment.completed
```

---

# 123. Payment Reconciliation

Separate:

```text
Payment
↔
Settlement
```

---

# 124. Provider Callback Is Not Enough

Need:

```text
SIGNATURE CHECK
AMOUNT CHECK
REFERENCE CHECK
IDEMPOTENCY
```

---

# 125. Logistics Integration

Canonical flow:

```text
FULFILLMENT
↓
CREATE SHIPMENT
↓
CARRIER
↓
TRACKING
↓
WEBHOOK / POLL
↓
NORMALIZED SHIPMENT EVENT
```

---

# 126. Carrier Status Mapping

External statuses map to canonical:

```text
CREATED
SHIPPED
IN_TRANSIT
DELIVERED
FAILED
RETURNED
```

as appropriate.

---

# 127. Carrier Status Should Not Leak Everywhere

Normalize once.

---

# 128. Messaging Integration

Potential:

```text
EMAIL
WHATSAPP
SMS
PUSH
```

---

# 129. Messaging Service

Should receive structured notification request.

---

# 130. Notification Request

Potential:

```text
recipient
template
context
channel
purpose
```

---

# 131. Domain Should Not Hardcode Provider

Example:

```text
Commerce
should request
Send Order Confirmation

not
call WhatsApp vendor X directly.
```

---

# 132. Messaging Adapter

Maps canonical notification into provider.

---

# 133. Transactional vs Marketing

Must be separate purpose/context.

---

# 134. CRM Integration

MGBOS may initially function as internal CRM spine.

If external CRM later used:

```text
Person / Account / Lead / Opportunity
```

must map canonically.

---

# 135. CRM Should Not Become Separate Customer Truth

Canonical.

---

# 136. CRM Sync

Potential:

```text
MGBOS → CRM
for sales engagement.

CRM → MGBOS
for interaction outcomes.
```

Field ownership required.

---

# 137. Creator Platform Integration

Creator Platform consumes:

```text
Identity
Commerce
Product
Finance
Marketing
```

---

# 138. Creator-to-Commerce

Creator Product relationships reference canonical Products.

---

# 139. Commerce-to-Creator

Eligible Order Item events can generate Earnings.

---

# 140. Earnings-to-Finance

Validated Earnings feed Payables/Payout.

---

# 141. Creator Platform Should Not Calculate Cash Movement

Finance/Treasury does.

---

# 142. Partner Platform Integration

Partner Platform connects:

```text
Production
Procurement
Quality
Finance
```

---

# 143. Production-to-Partner

Work Order references Partner Capability.

---

# 144. Partner-to-QC

Execution completion enters QC.

---

# 145. QC-to-Finance

Accepted output helps validate payable/invoice.

---

# 146. Partner Invoice-to-Treasury

Approved payable enters payment queue.

---

# 147. Finance Integration

Finance consumes transactional events.

Potential:

```text
ORDER
REFUND
PURCHASE
PAYMENT
PAYOUT
INVENTORY
COST
```

---

# 148. Finance Should Not Scrape UI

Canonical APIs/events preferred.

---

# 149. Accounting System

If external accounting software is introduced:

```text
MGBOS / Finance
↓
ACCOUNTING ADAPTER
↓
ACCOUNTING SYSTEM
```

---

# 150. Accounting Mapping

Potential:

```text
Customer
Invoice
Payment
Expense
Supplier
```

---

# 151. Accounting System May Hold Statutory Books

If so, declare explicit authority boundary.

---

# 152. Management Model vs Accounting Model

Canonical:

```text
MGBOS
management/operating truth.

ACCOUNTING SYSTEM
formal accounting/statutory truth
```

where applicable.

---

# 153. Reconciliation Between Systems

Required.

---

# 154. Analytics Integration

Canonical:

```text
DOMAIN EVENTS / TABLES
↓
ANALYTICAL PIPELINE
↓
REPORTING MODEL
```

---

# 155. Analytics Should Be Read-Only Consumer

Generally.

---

# 156. Analytics Must Not Mutate Core State

Canonical.

---

# 157. Analytics Output

May feed recommendations.

Recommendations still require operational action through domains.

---

# 158. BI Tool

If used, should connect to reporting layer/read model, not production DB unrestricted where avoidable.

---

# 159. Search Integration

Future universal MGBOS search can index:

```text
CUSTOMER
ORDER
PRODUCT
PROJECT
CREATOR
PARTNER
```

---

# 160. Search Index Is Derived

Not source of truth.

---

# 161. Search Index Update

Event-driven:

```text
entity.changed
↓
search reindex
```

where appropriate.

---

# 162. Search Failure

Should not block core transaction.

---

# 163. File Storage Integration

Files should use object storage/provider.

Canonical DB stores:

```text
FILE ID
LOCATION
METADATA
RIGHTS
LINKED ENTITY
```

---

# 164. Storage Provider Does Not Own Business Relationship

Canonical.

---

# 165. File Upload

Flow:

```text
REQUEST UPLOAD
↓
STORAGE
↓
FILE RECORD
↓
LINK TO ENTITY
```

---

# 166. File Deletion

Must consider:

```text
LEGAL
AUDIT
RIGHTS
BUSINESS HISTORY
```

---

# 167. Document Generation

Potential:

```text
QUOTE
WORK ORDER
INVOICE
STATEMENT
```

generated from canonical objects.

---

# 168. Generated Document Is Snapshot

Document should reflect source object/version at generation time.

---

# 169. n8n Integration Role

Canonical:

```text
EVENT / API
↓
n8n
↓
EXTERNAL ACTION / CROSS-SYSTEM FLOW
```

---

# 170. n8n Good Boundaries

Use for:

```text
NOTIFICATIONS
INTEGRATION ADAPTER ORCHESTRATION
SCHEDULED JOBS
AI ENRICHMENT
LOW-MEDIUM COMPLEXITY WORKFLOW
```

---

# 171. n8n Bad Boundaries

Do not make n8n authoritative for:

```text
ORDER STATE
INVENTORY BALANCE
PAYMENT TRUTH
PRICING CORE
```

---

# 172. Workflow IDs

n8n workflow should map to canonical Automation ID.

---

# 173. Example

```text
MGBOS Automation:
AUT-ORD-001

Runtime:
n8n workflow ID xyz
```

---

# 174. Runtime Can Change

Canonical automation identity stays.

---

# 175. n8n Failure

Should create:

```text
AUTOMATION FAILURE
or
EXCEPTION
```

in MGBOS for material workflows.

---

# 176. Integration Registry

MGBOS should maintain registry.

---

# 177. Integration Registry Fields

Potential:

```text
Integration ID
System
Purpose
Direction
Owner
Authentication
Domains
Criticality
Status
```

---

# 178. Integration Status

Potential:

```text
PLANNED
TESTING
ACTIVE
DEGRADED
PAUSED
RETIRED
```

---

# 179. Integration Owner

Every integration needs human owner.

---

# 180. Integration Criticality

Potential:

```text
CRITICAL
IMPORTANT
SUPPORTING
```

---

# 181. Critical Integration Examples

Potential:

```text
PAYMENT
ORDER INGESTION
INVENTORY
```

---

# 182. Supporting Integration

Example:

```text
social analytics import
```

---

# 183. Integration Contract Registry

Should document:

```text
ENDPOINTS
WEBHOOKS
SCHEMA
AUTH
RETRY
IDEMPOTENCY
RATE LIMIT
SLA
```

---

# 184. Secret Management

Credentials stored separately from registry.

---

# 185. Integration Health

Monitor:

```text
LAST SUCCESS
LAST FAILURE
ERROR RATE
LATENCY
QUEUE LAG
```

---

# 186. Integration Dashboard

Potential:

```text
SYSTEM
STATUS
LAST SYNC
FAILED JOBS
DLQ
RATE LIMIT
```

---

# 187. Integration Failure Modes

Potential:

```text
AUTH FAILURE
TIMEOUT
RATE LIMIT
SCHEMA CHANGE
INVALID PAYLOAD
REMOTE OUTAGE
```

---

# 188. Error Normalization

External provider errors should map into internal categories.

---

# 189. Example

```text
HTTP 429
→ RATE_LIMITED
```

---

# 190. Retry Policy

Transient failures retry.

Permanent failures escalate.

---

# 191. Retry Policy Should Be Integration-Specific

Payment ≠ content analytics.

---

# 192. Circuit Breaker

Use for repeatedly failing providers.

---

# 193. Circuit Breaker Goal

Prevent:

```text
THOUSANDS OF DOOMED CALLS
```

and allow controlled recovery.

---

# 194. Fallback

Critical integrations should define fallback.

---

# 195. Payment Fallback

Potential:

```text
alternate payment method
manual confirmation
```

depending business capability.

---

# 196. Logistics Fallback

Potential:

```text
alternate carrier
manual booking
```

---

# 197. Messaging Fallback

Potential:

```text
email instead of WhatsApp
```

for certain message types.

---

# 198. Manual Recovery

Canonical:

> **Every critical integration needs a documented manual recovery path.**

---

# 199. Recovery Should Preserve Canonical State

Do not bypass system by permanently processing off-platform without back-entry.

---

# 200. Reconciliation

After outage:

```text
WHAT SHOULD HAVE HAPPENED?
vs
WHAT ACTUALLY HAPPENED?
```

---

# 201. Reconciliation Examples

```text
PAYMENT PROVIDER ↔ PAYMENTS
MARKETPLACE ↔ ORDERS
CARRIER ↔ SHIPMENTS
BANK ↔ CASH TRANSACTIONS
```

---

# 202. Reconciliation Jobs

Potential:

```text
DAILY
HOURLY
EVENT-BASED
```

depending risk.

---

# 203. Payment Reconciliation

High priority.

---

# 204. Order Reconciliation

Marketplace/import integrations should check missing orders.

---

# 205. Inventory Reconciliation

Compare:

```text
CANONICAL INVENTORY
vs
EXTERNAL CHANNEL STOCK
```

where relevant.

---

# 206. Shipment Reconciliation

Detect stale tracking/status.

---

# 207. Payout Reconciliation

Ensure approved payout matches executed bank/provider transfer.

---

# 208. Integration Idempotency

Critical for:

```text
ORDER IMPORT
PAYMENT
REFUND
SHIPMENT CREATION
PAYOUT
```

---

# 209. External Request ID

Use provider/client idempotency keys where supported.

---

# 210. Internal Idempotency

Still required even if provider supports idempotency.

---

# 211. Integration Ordering

Do not assume webhooks arrive in order.

---

# 212. Current State Verification

Before applying external event:

```text
READ CURRENT ENTITY
+
VALIDATE TRANSITION
```

---

# 213. Stale Event

Can be ignored or stored for audit depending contract.

---

# 214. Duplicate Mapping

Must be detected.

---

# 215. Integration Versioning

External APIs change.

Adapters should isolate provider-version changes.

---

# 216. Provider Migration

Canonical domains should survive replacing:

```text
PAYMENT PROVIDER
CARRIER
MARKETPLACE CONNECTOR
```

---

# 217. Provider Abstraction

Canonical:

> **Business logic should depend on capabilities, not unnecessarily on provider-specific vocabulary.**

---

# 218. Payment Capability

Example:

```text
CREATE PAYMENT
VERIFY PAYMENT
REFUND PAYMENT
```

---

# 219. Shipping Capability

Example:

```text
QUOTE SHIPPING
CREATE SHIPMENT
TRACK SHIPMENT
```

---

# 220. Messaging Capability

Example:

```text
SEND TRANSACTIONAL MESSAGE
SEND MARKETING MESSAGE
```

---

# 221. Provider Capability Registry

Can evolve later.

---

# 222. Build vs Buy Integration

Use connectors/platforms when they reduce commodity work.

Build adapter/business layer when control is strategically important.

---

# 223. Integration Spaghetti

Anti-pattern:

```text
Website → Spreadsheet
Spreadsheet → n8n
n8n → WhatsApp
WhatsApp → Manual ERP
ERP → Marketplace
```

with unclear ownership.

---

# 224. Hub-and-Spoke Principle

Canonical:

```text
DOMAIN SYSTEMS
↔
MGBOS / INTEGRATION LAYER
↔
EXTERNAL SYSTEMS
```

rather than every external system talking to every other external system.

---

# 225. MGBOS Is Logical Hub

Does not mean every packet must physically pass through one server.

---

# 226. Domain-to-Domain Integration

Internal domains may call each other through defined interfaces/events.

---

# 227. No Shared-Table Coupling Across Domains

Avoid when system matures.

---

# 228. Early Shared Database

Acceptable inside modular application if ownership boundaries remain logical.

---

# 229. Integration Migration Path

Canonical:

```text
DIRECT INTERNAL CALL
↓
MODULE API
↓
SERVICE API / EVENT
```

as scale grows.

---

# 230. Data Duplication

Some duplication is acceptable for read performance.

---

# 231. Authoritative vs Cached

Every duplicated field should conceptually know:

```text
AUTHORITATIVE?
or
CACHE / SNAPSHOT?
```

---

# 232. Cache Invalidation

Events can refresh derived caches/read models.

---

# 233. Stale Data Tolerance

Define by use case.

---

# 234. Example

Product description:

minor staleness acceptable.

---

# 235. Inventory ATS

Staleness risk much higher.

---

# 236. Payment Status

Must be highly reliable.

---

# 237. Integration SLA

Potential dimensions:

```text
AVAILABILITY
LATENCY
FRESHNESS
RECOVERY
```

---

# 238. Internal Integration SLA

Use only where operationally justified.

---

# 239. External Provider SLA

May inform fallback/risk decisions.

---

# 240. Integration Permissions

External integration receives minimum scopes.

---

# 241. Payment Provider

Does not need creator artwork access.

---

# 242. Marketplace Connector

Does not need treasury bank account data.

---

# 243. Logistics Provider

Receives only shipment-relevant customer data.

---

# 244. Data Minimization

Canonical.

---

# 245. PII Boundary

Adapters should remove unnecessary sensitive fields.

---

# 246. Logging Boundary

Do not log full sensitive payloads indiscriminately.

---

# 247. Integration Audit

Material outbound actions should preserve:

```text
WHO / WHAT
SYSTEM
ACTION
REQUEST REFERENCE
RESULT
```

---

# 248. API Authentication

Potential:

```text
SERVICE TOKEN
OAUTH
SIGNED REQUEST
```

depending integration.

---

# 249. Human User Authentication

Separate from service credentials.

---

# 250. Service Account

Each production integration should ideally have dedicated identity.

---

# 251. Credential Rotation

Should not require rewriting business logic.

---

# 252. Environment Separation

Canonical:

```text
DEV
STAGING
PRODUCTION
```

for integrations.

---

# 253. Sandbox Provider

Use where provider offers test mode.

---

# 254. Production Secret

Never used in local development casually.

---

# 255. Cross-Environment Guard

Staging must never send:

```text
REAL PAYOUT
REAL SHIPMENT
REAL CUSTOMER CAMPAIGN
```

unless explicitly isolated test recipient.

---

# 256. Test Adapters

May emulate external provider behavior.

---

# 257. Integration Testing

Canonical levels:

```text
CONTRACT
ADAPTER
SANDBOX
END-TO-END
```

---

# 258. Contract Test

Ensures canonical interface remains compatible.

---

# 259. Adapter Test

Ensures provider mapping correct.

---

# 260. Sandbox Test

Uses provider test environment.

---

# 261. End-to-End Test

Tests full business flow safely.

---

# 262. Webhook Test

Must include:

```text
VALID
DUPLICATE
INVALID SIGNATURE
OUT OF ORDER
```

scenarios.

---

# 263. Failure Injection

Useful later to test resilience.

---

# 264. Integration Documentation

Every active integration should have:

```text
PURPOSE
OWNER
SYSTEM
DATA
DIRECTION
CONTRACT
FAILURE
RECOVERY
```

---

# 265. Integration Runbook

Critical integrations need operational runbook.

---

# 266. Runbook Includes

```text
HOW TO DETECT FAILURE
HOW TO PAUSE
HOW TO REPLAY
HOW TO RECONCILE
WHO TO ESCALATE
```

---

# 267. MGBOS Integration Control Center

Future view:

```text
INTEGRATION HEALTH
FAILED JOBS
DLQ
SYNC LAG
RECONCILIATION
PROVIDER STATUS
```

---

# 268. MGBOS Exception Integration

Integration failures should create structured Exceptions where material.

---

# 269. Example

```text
Marketplace order failed to import
↓
EXC-...
↓
owner
↓
recovery
```

---

# 270. Integration Alert Fatigue

Do not alert humans for every transient retry.

---

# 271. Alert on Material Failure

Examples:

```text
PAYMENT WEBHOOK FAILING
ORDERS MISSING
INVENTORY SYNC STALE
```

---

# 272. Integration Health States

Potential:

```text
HEALTHY
DEGRADED
FAILING
PAUSED
```

---

# 273. MGBOS and Analytics

MGBOS operational data feeds Analytics Model.

Analytics should not become dependency for core transactions.

---

# 274. Analytics Recommendation Loop

Potential:

```text
ANALYTICS
↓
RECOMMENDATION
↓
MGBOS
↓
HUMAN / RULE / AGENT
↓
ACTION
```

---

# 275. Analytics Cannot Directly Alter Business State

Canonical.

---

# 276. MGBOS and Knowledge

Knowledge layer provides:

```text
POLICY
SOP
PLAYBOOK
CANONICAL DOCS
```

---

# 277. Knowledge Sync

Documents may eventually be indexed into retrieval system.

---

# 278. Knowledge Index Is Derived

Source documents remain canonical.

---

# 279. MGBOS and Jarvis

Long-term:

```text
JARVIS
↓
MGBOS TOOL GATEWAY
↓
DOMAIN APIs
↓
EVENTS / WORKFLOWS
```

---

# 280. Jarvis Read Flow

Example:

```text
"Order mana yang bermasalah?"
↓
query exception/read models
↓
retrieve related orders/events
↓
summarize
```

---

# 281. Jarvis Write Flow

Example:

```text
"Follow up semua qualified leads hari ini."
↓
resolve eligible leads
↓
policy check
↓
create bounded jobs
↓
execute messaging workflow
↓
audit
```

---

# 282. Jarvis High-Risk Flow

Example:

```text
"Bayar semua supplier."
```

should become:

```text
retrieve eligible payables
↓
policy / cash check
↓
present approval set
↓
human approval
↓
Treasury tool
```

not immediate autonomous payment.

---

# 283. Jarvis Integration Principle

Canonical:

> **Natural language is an interface. Canonical APIs and rules remain the execution contract.**

---

# 284. Multi-Agent Integration

Future:

```text
JARVIS
├── SALES AGENT
├── CONTENT AGENT
├── OPS AGENT
├── FINANCE AGENT
└── PARTNER AGENT
```

All share MGBOS tools/contracts.

---

# 285. Agent-to-Agent Communication

Should pass structured task/result objects.

Avoid uncontrolled free-form autonomous loops.

---

# 286. Agent Task Object

Potential:

```text
Task ID
Goal
Context IDs
Allowed Tools
Budget
Deadline
Risk
```

---

# 287. Agent Result Object

Potential:

```text
Outcome
Evidence
Actions Taken
Pending Decisions
Exceptions
```

---

# 288. Agent Orchestration Trace

Should preserve:

```text
WHO DELEGATED
WHO ACTED
TOOLS
RESULT
```

---

# 289. Integration with MultiGraph

Future shared architecture:

```text
MULTIGRAPH GROUP
        │
        ▼
ENTERPRISE MGBOS
├── TeeStock Domains
└── MultiGraph Domains
```

---

# 290. Shared Enterprise Services

Potential:

```text
IDENTITY
PARTNER
FINANCE
KNOWLEDGE
AI / JARVIS
```

---

# 291. Business-Unit Boundaries

Even shared infrastructure should preserve:

```text
OWNERSHIP
P&L
PERMISSION
DATA SCOPE
```

---

# 292. Intercompany Integration

TeeStock ↔ MultiGraph internal production may use:

```text
WORK ORDER
TRANSFER PRICE
INVOICE / INTERCOMPANY RECORD
```

as appropriate.

---

# 293. Do Not Use “Same Group” as Excuse for No Records

Canonical.

---

# 294. Integration Maturity Model

```text
LEVEL 0
Manual copy/paste

LEVEL 1
Point integrations

LEVEL 2
Canonical APIs + adapters + events

LEVEL 3
Integration registry + reconciliation + control center

LEVEL 4
Real-time cross-domain orchestration

LEVEL 5
Jarvis-operated enterprise integration fabric
```

---

# 295. Level 0

Anti-goal:

```text
copy marketplace orders
to spreadsheet
then WhatsApp production.
```

---

# 296. Level 1

Build:

```text
n8n
webhooks
simple APIs
```

with clear ownership.

---

# 297. Level 2

Add:

```text
CANONICAL APIs
EVENTS
EXTERNAL MAPPINGS
IDEMPOTENCY
```

---

# 298. Level 3

Add:

```text
INTEGRATION REGISTRY
HEALTH MONITORING
RECONCILIATION
DLQ
RUNBOOKS
```

---

# 299. Level 4

Add:

```text
EVENT BUS
DOMAIN SERVICES
REAL-TIME READ MODELS
```

where justified.

---

# 300. Level 5

Jarvis and agents can coordinate business through governed tool contracts across MultiGraph Group.

---

# 301. Current Recommended Stage

TeeStock should target:

```text
LEVEL 1
→
LEVEL 2
```

first.

---

# 302. V1 Integration Priorities

Recommended:

```text
WEBSITE ↔ MGBOS / COMMERCE
PAYMENT ↔ COMMERCE
COMMERCE ↔ INVENTORY
COMMERCE ↔ PRODUCTION
PRODUCTION ↔ PARTNER
FULFILLMENT ↔ LOGISTICS
MGBOS ↔ n8n
```

---

# 303. V1 Marketing Integration

Potential:

```text
FORM
→ MGBOS Lead

MGBOS Event
→ Notification / Follow-up
```

---

# 304. V1 Creator Integration

Potential:

```text
Order Item
→ Earning Calculation
→ Payout Queue
```

---

# 305. V1 Finance Integration

Potential:

```text
Payment
Purchase
Payout
Refund
```

flow into finance records.

---

# 306. V1 Marketplace

Can remain semi-manual initially.

But External Object Mapping should already be canonical.

---

# 307. V1 Analytics

Reporting views over canonical operational data.

No full warehouse required.

---

# 308. V1 Jarvis

Read-heavy assistant initially:

```text
SEARCH
SUMMARIZE
RECOMMEND
CREATE LOW-RISK TASK
```

---

# 309. V1 Avoid

Do not immediately build:

```text
ENTERPRISE SERVICE BUS
DOZENS OF MICROSERVICES
CUSTOM API GATEWAY PLATFORM
REAL-TIME EVERYTHING
MULTI-AGENT AUTONOMOUS FABRIC
```

---

# 310. V2 Expansion

Possible:

```text
MARKETPLACE ADAPTERS
CRM INTEGRATION
ACCOUNTING INTEGRATION
INTEGRATION HEALTH
RECONCILIATION JOBS
```

---

# 311. V3 Expansion

Possible:

```text
API GATEWAY
QUEUE / BROKER
CENTRAL TOOL GATEWAY
READ MODEL PIPELINE
```

---

# 312. V4 Expansion

Possible:

```text
MULTI-BU SHARED SERVICES
REAL-TIME EVENT BUS
AGENT ORCHESTRATION
```

---

# 313. V5 Expansion

Potential:

```text
ENTERPRISE JARVIS
+
GOVERNED MULTI-AGENT OPERATING FABRIC
```

---

# 314. Integration Creation Gate

Create integration when:

```text
REPEATED DATA TRANSFER
+
CLEAR OWNER
+
MEANINGFUL VALUE
```

---

# 315. Real-Time Gate

Use real-time integration only when delay materially harms:

```text
CUSTOMER EXPERIENCE
OPERATIONS
FINANCIAL CONTROL
```

---

# 316. Bidirectional Gate

Only when both systems legitimately own distinct parts of state.

---

# 317. External Dependency Gate

Before critical dependency:

```text
RELIABILITY
FALLBACK
RECOVERY
SECURITY
```

must be understood.

---

# 318. New Provider Gate

Require:

```text
CANONICAL ADAPTER
+
DATA OWNERSHIP
+
MAPPING
+
FAILURE STRATEGY
```

---

# 319. Jarvis Tool Gate

Expose tool only when:

```text
ACTION DEFINED
+
PERMISSION DEFINED
+
RISK DEFINED
+
AUDIT DEFINED
```

---

# 320. AI Write Gate

Agent may write only through:

```text
VALIDATED TOOL
+
DOMAIN RULES
+
AUTHORIZATION
```

---

# 321. Cross-Business Integration Gate

Shared service only when reuse outweighs coupling.

---

# 322. Integration Failure Modes

## Point-to-Point Everywhere

Unmaintainable topology.

## External System Becomes Canonical

Vendor lock-in.

## Direct Database Writes

Broken domain rules.

## Bidirectional Everything

Sync conflict.

## Last-Write-Wins

Stale data corruption.

## No Reconciliation

Silent drift.

## Integration Without Owner

Orphan system.

---

# 323. AI Integration Failure Modes

## Agent Gets Database Root

Excessive risk.

## Natural Language Is Execution Contract

Ambiguity.

## Agent Bypasses Domain Rules

Policy failure.

## Agent Uses Stale Read Model for Money

High-risk error.

## Tool Has No Scope

Privilege escalation.

---

# 324. What MGBOS Integration Must Not Become

## Central Bottleneck

MGBOS coordinates; domains still own truth.

## Integration Spaghetti

Contracts before connections.

## SaaS Lock-In Architecture

Canonical business model remains TeeStock-owned.

## Real-Time Obsession

Fresh enough beats unnecessarily complex.

## One Giant API

Use clear domains.

## Jarvis Superuser Layer

Natural-language convenience must not bypass governance.

---

# 325. Integration Success Definition

The architecture succeeds when TeeStock can answer:

```text
WHICH SYSTEM
owns this data?

HOW
does another system read it?

HOW
does another system request change?

WHAT EVENT
announces the change?

WHICH EXTERNAL ID
maps to this entity?

WHAT HAPPENS
if integration fails?

CAN WE
retry safely?

CAN WE
reconcile afterward?

CAN WE
replace the provider?

CAN JARVIS
act through bounded tools?

CAN MGBOS
see health and failures centrally?
```

---

# 326. Canonical Integration Summary

```text
DOMAIN SYSTEMS
own truth.

APIs
perform queries and commands.

EVENTS
announce facts.

ADAPTERS
translate external systems.

n8n
orchestrates integrations.

QUEUES
manage asynchronous work.

READ MODELS
support cross-domain visibility.

RECONCILIATION
detects drift.

MGBOS
controls and observes.

JARVIS
provides human-facing orchestration.
```

---

# 327. Canonical MGBOS Integration Principles

```text
INTEGRATE THROUGH CONTRACTS. COORDINATE THROUGH MGBOS. PRESERVE DOMAIN TRUTH.

ONE DOMAIN OWNS ONE AUTHORITATIVE STATE.

EXTERNAL SYSTEMS MAP INTO CANONICAL ENTITIES.

APIS ASK AND COMMAND. EVENTS ANNOUNCE FACTS.

ADAPTERS TRANSLATE. THEY DO NOT OWN BUSINESS POLICY.

MGBOS SHOULD CALL DOMAIN COMMANDS, NOT PATCH TABLES.

READ MODELS MAY DUPLICATE DATA. THEY DO NOT DUPLICATE AUTHORITY.

FIELD OWNERSHIP BEFORE BIDIRECTIONAL SYNC.

IDEMPOTENCY BEFORE RETRY.

RECONCILIATION BEFORE ASSUMING SYNC IS PERFECT.

EVERY CRITICAL INTEGRATION NEEDS AN OWNER AND A RECOVERY PATH.

PROVIDER-SPECIFIC LOGIC SHOULD BE ISOLATED.

REAL-TIME ONLY WHERE BUSINESS VALUE REQUIRES IT.

n8n ORCHESTRATES. CANONICAL DOMAINS HOLD TRUTH.

ANALYTICS READS. IT DOES NOT MUTATE OPERATIONS.

JARVIS USES GOVERNED TOOLS. IT DOES NOT BYPASS SYSTEMS.

NATURAL LANGUAGE IS AN INTERFACE. CANONICAL APIS ARE THE CONTRACT.

MULTIGRAPH SHARED INFRASTRUCTURE MUST PRESERVE BUSINESS-UNIT ECONOMICS AND PERMISSIONS.
```

---

# 328. Dependency

Dokumen berikut harus follow MGBOS Integration:

1. `11-data-mgbos/analytics-model.md`
2. `12-legal-ip/ip-policy.md`
3. `12-legal-ip/design-licensing-policy.md`
4. `12-legal-ip/creator-agreement-framework.md`
5. `13-metrics-experiments/kpi-framework.md`
6. `13-metrics-experiments/experimentation-framework.md`
7. `13-metrics-experiments/decision-thresholds.md`
8. `14-roadmap/master-roadmap.md`
9. `14-roadmap/capability-roadmap.md`

TeeStock MGBOS Integration boleh berkembang dari API + n8n + webhook architecture menjadi reliable queue/event-driven integration platform, cross-business shared services, AI tool gateway, dan akhirnya Jarvis-operated enterprise orchestration fabric, tetapi setiap integration layer baru harus mempertahankan source-of-truth ownership, canonical IDs, explicit contracts, scoped permissions, idempotency, observability, reconciliation, replaceable providers, dan recoverable business operations.