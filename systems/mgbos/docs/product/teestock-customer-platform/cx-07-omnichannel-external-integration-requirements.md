---
canonical_id: proposed.mgbos.product.teestock-customer-platform.cx-07
status: DRAFT
version: 0.1.1
owner: Rizky
author: ChatGPT / AI Co-Founder & Product Strategy
approver: PENDING_OWNER_APPROVAL
scope: teestock-customer-platform-omnichannel-and-external-integration-experience
product_program: PROPOSED_TEESTOCK_CUSTOMER_EXPERIENCE_COMMERCE
product_maturity: PROPOSED_OMNICHANNEL_PRODUCT_CONTRACT
document_class: product-specification
normative_authority: NONE_UNTIL_APPROVED_AND_ROUTED
engineering_readiness: NOT_READY_FOR_ENGINEERING
implementation_status: PRODUCT_DEFINITION_ONLY
repository: Rizkybuilds/bisnishub
repository_branch: main
source_baseline_commit: 2800c474563309bda49d84d712f79b68c9dde36a
source_baseline_checked: 2026-10-16
source_inspection: SELECTED_READ_ONLY_GITHUB_SOURCES_AND_LOCAL_COMPANION_DRAFTS_NOT_LIVE_PROVIDER_TESTS
created: 2026-10-16
proposed_destination: systems/mgbos/docs/product/teestock-customer-platform/cx-07-omnichannel-external-integration-requirements.md
supersedes: null
remediation_package: CX-REM-R1
remediation_review: AUTHOR_SELF_REVIEW_NOT_INDEPENDENT
companion_drafts:
  - cx-00-source-gap-audit.md
  - cx-01-master-prd.md
  - cx-02-customer-journeys-service-blueprint.md
  - cx-03-experience-design-interaction-spec.md
  - cx-04-commerce-checkout-experience.md
  - cx-05-custom-b2b-ordering-experience.md
  - cx-06-customer-account-service-experience.md
proposed_authoritative_for_after_approval:
  - teestock_customer_visible_cross_channel_handoffs_and_quality_expectations
  - product_requirements_for_marketplace_payment_logistics_messaging_and_support_integrations
  - integration_failure_recovery_experience_and_operational_exception_visibility
  - product_release_gates_and_acceptance_scenarios_for_cross_channel_capabilities
not_authoritative_for:
  - provider_selection_credentials_contracts_or_live_api_capabilities
  - canonical_mgbos_entity_ids_database_schema_business_commands_or_states
  - actual_integration_runtime_outbox_event_dispatcher_or_production_readiness
  - teestock_business_price_policy_channel_economics_or_legal_consent_entitlement
  - jarvis_tool_permissions_runtime_agents_or_autonomous_financial_decisions
  - technical_webhook_signatures_specific_apis_connector_schemas_or_transport_guarantees
  - independent_qa_security_approval_deployment_or_work_package_authorization
primary_sources:
  - bisnis/teestock/11-data-mgbos/mgbos-integration.md
  - bisnis/teestock/11-data-mgbos/event-model.md
  - bisnis/teestock/10-product-tech/commerce-platform.md
  - bisnis/teestock/10-product-tech/automation-architecture.md
  - bisnis/teestock/09-marketing/channel-strategy.md
  - systems/mgbos/docs/architecture/command-event-model.md
  - systems/mgbos/docs/architecture/permission-authorization-model.md
  - systems/mgbos/docs/architecture/business-invariants.md
  - docs/architecture/system-boundaries.md
  - docs/governance/documentation-constitution.md
  - docs/governance/canonical-source-map.md
  - systems/mgbos/docs/product/README.md
  - docs/roadmaps/solo-founder-launch-roadmap.md
last_reviewed: 2026-10-16
review_cadence: per_product_decision_or_material_change
---

# CX-07 — TeeStock Omnichannel & External Integration Requirements v0.1.1

> **Disposition: DRAFT / SELF-REVIEWED / NON-AUTHORITATIVE / NOT IMPLEMENTATION-READY.**
>
> This is a proposed _product experience and business-facing integration contract_, not an API specification. Event names, internal commands, provider APIs, example payloads, status labels, and URL shapes are not adopted by this document. No external provider is selected or declared live here.

## 0. Executive contract and scope

### 0.1 Product mission

A TeeStock customer may discover products on social media, inquire by WhatsApp, buy through a marketplace, pay through a provider, receive a parcel from a courier, and return to the TeeStock website for assistance. These channels must not create contradictory promises, duplicate orders, or require the founder to copy the same details repeatedly.

**Product thesis:** **Many entry channels; one governed business truth; trustworthy cross-channel experience; safe and observable recovery.**

The product should appear simple to customers even though integration, exception handling, settlement, and provenance are complex. A visually connected UI is not proof that the systems themselves are connected.

### 0.2 Inspected repository reality

- Inspected `main` at exact SHA `2800c474563309bda49d84d712f79b68c9dde36a`, 2026-10-16.
- `systems/mgbos/apps/teestock/src/app/page.tsx` remains a public TeeStock preparation shell; it is not a functioning commerce storefront.
- `systems/mgbos/packages/integrations/src/index.ts`, `packages/ai/src/index.ts`, and `packages/ui/src/index.ts` are reserved boundaries without verified feature implementations.
- `systems/mgbos/docs/architecture/command-event-model.md` describes existing controlled command boundaries but classifies **full business event runtime as NOT YET IMPLEMENTED**; transactional outbox is an accepted design, not a proven operating component.
- Business docs contain significant target design for marketplace normalization, payment reconciliation, messaging, shipping, event identity, idempotency and n8n. Those are intended capabilities, not evidence of live adapters.
- The Q4 controlled pilot allows Custom/Business assisted-sales ahead of complete retail storefront.
- PR #73, the documentation entrypoint routing reconciliation, was open/draft when rechecked. Proposed folder links must be reconciled with its final state before repository adoption.
- No provider credentials, current provider API eligibility, sandbox payment, actual webhook delivery, consumer integration E2E, production account, or external contract was inspected or exercised.

### 0.3 Release scope vocabulary (PROPOSED, not implementation status)

| Stage                        | Customer and business capability                                                                                                        | Explicit non-claim                                                                                               |
| ---------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `P0 / CONTROLLED_ENTRY`      | High-quality channel landing, source capture, human-assisted WhatsApp/social/direct Custom/B2B intake, controlled manual reconciliation | Automated marketplace synchronization, live payment gateway, unrestricted AI chatbot or 24/7 courier integration |
| `P1 / SELECTIVE_INTEGRATION` | Integrate specific approved provider capabilities once implementation, security, reconciliation and QA gates are met                    | Every provider, complete API coverage, or unconditional order-to-production automation                           |
| `P2 / SCALED_OMNICHANNEL`    | Selective listing, ATS, price sync, more channels and automation when genuine volume/economics prove need                               | Real-time consistency everywhere, zero provider errors, or general agent autonomy                                |

**Sequencing constraint:** This proposed CX tiering must be reconciled with the authoritative solo-founder launch roadmap. CX-07 cannot supersede it.

### 0.4 Authority boundary

| Concept                                                                   | Source of truth / owner                                 | CX-07 role                                                   |
| ------------------------------------------------------------------------- | ------------------------------------------------------- | ------------------------------------------------------------ |
| Offer, channel strategy, marketplace fees and price policy                | TeeStock business strategy, finance and commerce docs   | Customer-facing consistency without new price authority      |
| Return, refund, cancellation, privacy and customer terms                  | TeeStock operations and legal documents; applicable law | Reliable display and appropriate request routing             |
| Order, Payment, Invoice, Inventory, Shipment, Production and governance   | MGBOS architecture, commands, permission model          | State presentation, required outcomes and acceptance only    |
| Integration contracts, event runtime, auth and database schema            | Head Engineering and MGBOS architecture                 | Product requirements, not technical implementation decisions |
| AI tools, JARVIS and automation autonomy                                  | JARVIS architecture and engineering governance          | Assistive experience bounded by existing authorities         |
| Provider-local order, transaction, courier scan and message delivery fact | External provider                                       | Verify, preserve provenance, map and reconcile               |

## 1. Target outcomes and channel portfolio

### 1.1 Customer and founder jobs

1. **Discover:** arrive from a campaign/channel and find the correct retail, Custom or Business service without repeating everything.
2. **Inquire:** provide specifications once, receive an honest status and clear follow-up path.
3. **Buy:** know which channel owns checkout terms and whether price, stock and delivery are confirmed.
4. **Pay:** never be told a payment succeeded because the browser returned to a success URL; pending and unknown outcomes remain understandable.
5. **Track:** see reliable shipping updates, source timestamps and human fallback when carrier data is stale.
6. **Request support:** change channels without unnecessary information re-entry, while respecting identity and access rules.
7. **Recover:** failures, provider downtime and duplicated messages never cause hidden financial or production effects.
8. **Operate:** founder sees material exceptions with evidence and next actions, not every transient retry event.

### 1.2 Experience metrics (proposals; baseline UNKNOWN)

| Desired outcome                   | Metric candidate                                                       | Evidence / safeguard                                                                      |
| --------------------------------- | ---------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| Minimize admin burden             | manual touches per order/lead, including correction and recovery       | Instrument human actions, not just automation runs                                        |
| Zero duplicate commercial effects | distinct excess canonical orders/payments/fulfillment caused by replay | Duplicate provider deliveries themselves are expected; duplicate business effects are not |
| Honest customer promise           | unsupported statuses/promises detected per journey                     | Cannot count an unverified status as verified                                             |
| Meaningful recovery               | unresolved integration discrepancy count and oldest age                | Never hide a failed import from backlog                                                   |
| Healthy channel economics         | contribution after fees, returns, promotional spend and shipping       | GMV cannot substitute for margin                                                          |
| Less avoidable support            | repeat information requests and status-only contacts per 100 orders    | Protect human support availability                                                        |
| Privacy correctness               | wrong-recipient messages, unauthorized joins/reads                     | Critical defects block release                                                            |

### 1.3 Channel capability map

| Channel           | Primary role                   | P0                                                | P1 candidate                                 | P2 candidate                       | Important limit                                      |
| ----------------- | ------------------------------ | ------------------------------------------------- | -------------------------------------------- | ---------------------------------- | ---------------------------------------------------- |
| TeeStock website  | Digital home, contextual entry | Structured assisted intake and brand experience   | Retail/account features after separate gates | Deeper integration                 | Not a separate order truth                           |
| WhatsApp          | Sales/support conversation     | Human-assisted; approved handoff                  | Selective transactional templates            | Verified AI assistance             | Provider entitlement/consent must be checked         |
| Email             | Quote and updates              | Human-assisted                                    | Governed transactional sends                 | Preferences/lifecycle              | Do not mix marketing consent and fulfillment notices |
| Social media      | Discovery and conversation     | Link to correct guided flow                       | Selective approved lead integration          | Attribution where allowed          | No scraping or assumed API access                    |
| Marketplace       | Third-party commerce           | Manual provenance capture where applicable        | Specific verified order imports              | Selective listing/price/ATS sync   | Platform owns its local order terms                  |
| Payment provider  | External payment processing    | Verified manual reconciled payment when permitted | Governed gateway + reconciliation            | Additional methods                 | Provider result is not authoritative ledger effect   |
| Carrier/logistics | Shipping and tracking          | Evidence-backed manual tracking                   | Verified integration for shipment/scan       | Selective routing and optimization | Label creation is not physical handoff               |
| Customer support  | Unified help                   | Authorized assisted support                       | Portal/Case integration as validated         | More self-service                  | Customer Case ≠ Operational Exception                |
| JARVIS/AI         | Grounded assistance            | Not required                                      | Classification and drafts                    | Approved bounded tools             | No invented money/inventory promises                 |

Named provider support is **NOT VERIFIED**. Business documents containing examples of Shopee, Xendit, JNE or other brands are reference concepts, not selected or certified integrations.

## 2. Cross-channel journey and service blueprints

These are customer-service interactions, NOT canonical MGBOS state machines or guaranteed live integrations. For every scenario, the test must distinguish a simulated adapter, a real provider sandbox and an approved production provider.

### `CX7-JRN-01` — Social discovery → Custom request (`P0`)

**Frontstage:** Customer opens a campaign link, sees relevant offer, chooses Custom/Business guided intake and optionally uses WhatsApp. A shareable summary carries permitted requirement details to the human follow-up. The customer sees truthful expected response window, not a fabricated automatically generated quote.

**Backstage:** Source/channel attribution is recorded with appropriate permission, requirement is reviewed in an approved MGBOS path, and sales owns next action. Names, phone numbers and campaign tracking are never used as universal identity proof.

**Failures:** Lost attribution cannot prevent submission; repeated form submit must not create uncontrolled duplicate work; unavailable CRM shows truthful acknowledgment only if durable receipt is proven.

### `CX7-JRN-02` — WhatsApp → governed quote (`P0`)

**Frontstage:** Customer provides product intent and references; human sales reuses valid known details rather than asking everything again. If the integration is manual, this fact stays internally visible.

**Backstage:** The operator identifies customer context and records a structured inquiry, source reference and follow-up. A chat reply saying "okay" must not be silently interpreted as formal quote approval absent its required proof.

**Failures:** Wrong recipient and fuzzy customer matches are rejected; conflicting leads are flagged without merging identities or overwriting original request.

### `CX7-JRN-03` — Marketplace purchase → internal fulfillment (`P1`)

**Frontstage:** Marketplace customer receives notifications consistent with platform-specific terms. TeeStock does not promise an independent refund or support channel that supersedes the marketplace contract.

**Backstage:** Verified external order and item IDs are mapped to correct SKU/variation and brand/organization context, imported via authorized command, with a durable link to original source. Unknown SKU, unresolved price, unavailable shipping destination and conflicting order revision are held for review.

**Failures:** Repeated webhook/poll updates do not create another order, reserve more inventory or duplicate vendor work. Later _legitimate_ source revisions remain processable.

### `CX7-JRN-04` — TeeStock retail → payment provider → financial confirmation (`P1`)

**Frontstage:** Customer pays through an approved payment method; returns to an intelligible `awaiting confirmation` state until authoritative backend reconciliation proves actual outcome.

**Backstage:** An authenticated provider result is correlated with the correct order/intent, amount, currency and tenant; reconciled through MGBOS rules. Provider redirect, notification reception and final MGBOS payment effect remain separate.

**Failures:** Timeout means unknown outcome, not necessarily failed. Duplication, refund, reversal, amount mismatch and out-of-order notifications do not change accounting without explicit governed reconciliation.

### `CX7-JRN-05` — Physical dispatch → carrier tracking (`P1`)

**Frontstage:** Once actual handoff is verified, tracking and qualified estimated delivery become available, with timestamps and an accessible fallback contact.

**Backstage:** Courier scan and tracking data are mapped to the relevant _shipment_, not all orders sharing a customer. Scan history is preserved with provider provenance.

**Failures:** Generated tracking/label does not mean dispatched. Stale or duplicate scans cannot falsely roll status backward. RTS, partial shipment and delivery disputes require separate handling.

### `CX7-JRN-06` — Transactional message and delivery confidence (`P1`)

**Frontstage:** Customer receives an accurate confirmation or status update via permitted channel, with working link to self-service/help when available.

**Backstage:** Notification request is created from authoritative state/version with purpose, template, recipient, policy and dedupe identity; transport/provider response is tracked separately from order state.

**Failures:** A provider `accepted` response is not proof of message delivery. Timeout/ambiguous send must be reconciled before high-impact resend; marketing without established permission remains blocked.

### `CX7-JRN-07` — Cross-channel support → Customer Case (`P1`)

**Frontstage:** Customer switches between supported channels and does not have to retell a validated issue repeatedly. They can reach human support and see which requested action is pending.

**Backstage:** Support reads authorized customer/order context, maintains a case owner and relates relevant channel messages; do not expose internal notes. A customer complaint may also generate an operational exception, but the two concepts are not equivalent.

**Failures:** Unauthorized lookup, mismatched identities, duplicates and low-confidence AI classifications must not merge unrelated problems.

### `CX7-JRN-08` — Cancellation / return / settlement across channels (`P1/P2`)

**Frontstage:** Customer sees the applicable platform or TeeStock remedy process and actual progress, not a generalized success badge.

**Backstage:** Marketplace cancellations, disputes and returns are reconciled with physical fulfillment, valid financial entries and policy. Refund, return, reversal, settlement and payout are distinct concepts.

**Failures:** A cancellation arriving after physical dispatch must not erase shipped inventory. Partial refund or chargeback must not double-adjust money.

### `CX7-JRN-09` — Provider outage → recovered founder workflow (`P1/P2`)

**Frontstage:** If a provider is unavailable, show useful delayed/unknown status and safe fallback without claiming purchase or delivery completion.

**Backstage:** bounded retries, backoff, discrepancy queues and owner responsibilities prevent silent loss. Financial/physical side effects with unknown outcome trigger reconciliation-first, not blind retry. Founder receives material decisions, not one alert per 429 response.

**Failures:** Expired token, API quota, malformed data and permanent provider failure each have distinct recovery action and closure evidence.

### `CX7-JRN-10` — Catalog/stock/price publication (`P2`)

**Frontstage:** Customer sees only channel-appropriate validated product/price/availability statements. Any pending publication discrepancy is not advertised as synchronized.

**Backstage:** Approved product, variant mapping and pricing policy drive outbound updates. Compare desired and observed channel listings, capture echo/origin and prevent bidirectional feedback loops.

**Failures:** Inventory changes during propagation, rate-limit errors and rejected listings create discrepancies; never assume instant multi-channel stock consistency.

## 3. Source-of-truth, external identity, and authority

### 3.1 Five layers of truth

1. **Channel acquisition** records where contact originated, not who has permission over an account.
2. **Provider-local facts** represent that platform's own order, transaction, scan and messaging result.
3. **MGBOS canonical business state** owns the governed internal representation of orders, payments, inventory, shipments and production.
4. **Customer presentation** is a filtered and qualified projection of authorized information, not a mutation authority.
5. **Analytics/AI** may derive interpretations but cannot create business truth merely by describing it.

### 3.2 Logical cross-reference contract (NOT physical schema)

| Object              | Required identity/provenance                                                                                      | Explicit separation                                       |
| ------------------- | ----------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| Provider connection | provider, external account/tenant, internal organization/brand context, credential reference and capability scope | Never embed tokens in business events or CX documentation |
| External mapping    | provider, object type, external object ID, internal canonical reference, version and mapping evidence             | Provider ID is not MGBOS ID                               |
| Inbound signal      | source verification, provider event ID, observed timestamps, sanitized evidence pointer, dedupe result            | Inbound webhook is NOT MGBOS domain event                 |
| Outbound operation  | internal command intent, permitted action, expected version, idempotency reference, provider attempt and response | Transport timeout is not business-action failure proof    |
| Discrepancy         | expected value, observed value, scope, evidence, age, severity, owner, recovery state                             | A discrepancy should not silently overwrite either side   |
| Notification        | authorized recipient, purpose, template version, consent/policy basis, provider attempt, delivery confidence      | Provider acceptance is not customer reading               |
| Settlement          | external merchant reference, related internal payment, fees, chargebacks and match status                         | Payment confirmation and merchant settlement differ       |

### 3.3 Identity conflict policy

Names, matching phone fragments, platform handles, email display strings, social follows, IP addresses and order addresses are **not sufficient on their own** to merge customer identities. Account linking, company-contact access and support lookup need tenant-aware authorization and necessary proof. In ambiguous cases, preserve separate references and route a reconciliation task.

### 3.4 Event, effect, and version distinctions

A single external order can produce multiple _legitimate_ updates. The deduplication target is duplicate business effect, not the entire external order ID. Provider event identity, source revision, idempotency identity, attempted operation and internal business command are separate concepts. Same idempotency identity with materially different payload must be recognized as conflict, rather than silently replaying or overwriting.

### 3.5 Conflict classes and resolution behavior

| Conflict                                                          | Safe product behavior                            | Forbidden shortcut                         |
| ----------------------------------------------------------------- | ------------------------------------------------ | ------------------------------------------ |
| Duplicate payment/order webhook                                   | No duplicate effect; preserve same outcome       | Create second payment/order                |
| New revision of same marketplace order                            | Validate, compare, apply allowed change          | Reject every later update as duplicate     |
| Unmapped external SKU                                             | Quarantine with owner/action                     | Invent an arbitrary product                |
| Provider reports paid, local is pending                           | Reconcile identity/amount/state                  | Mark invoice paid directly from webhook    |
| Carrier scan says delivered without coherent fulfillment evidence | Review conflicting evidence; qualify view        | Assert delivery unconditionally            |
| Stale inventory/price on marketplace                              | Report discrepancy, apply approved safe fallback | Promise immediate sync                     |
| Customer identity collision                                       | Require proper verification                      | Merge by matching name/phone alone         |
| Refund/return after fulfilled shipment                            | Use policy and financial command rules           | Delete historical shipment or refund twice |
| Message accepted by provider                                      | Show delivery telemetry separately               | Mark customer as notified/read             |
| Timeout after external charge creation                            | Query/reconcile unknown attempt                  | Automatically charge again                 |

## 4. Marketplace integration specification

### 4.1 Order ingestion

The chosen adapter must preserve external platform and account, source order and line identities, SKU/variation mapping, quantity, price, discount, shipping, platform fees/taxes where supplied and legally permitted, plus state/revision provenance. A valid import results in _one_ governed internal obligation. Incomplete mapping is visible, not silently filled by assumption.

Provider checkout ownership is preserved. Customer marketplace rights, platform dispute processes and data-sharing restrictions must be understood for each actual marketplace. The portal cannot promise a marketplace refund action it does not have permission or capability to perform.

### 4.2 Outbound catalog, pricing and availability

Advanced outbound sync may only use approved product readiness, channel-specific commercial policy, canonical ATS/fulfillment capacity, mapping revision and scoped credentials. Product creation, inventory sync and price sync are distinct capabilities with independent release gates. Outbound updates can fail despite valid MGBOS data; reconciliation compares intended against actual provider values.

**Echo suppression:** a provider echo of TeeStock's own update may be recorded but must not recursively republish forever. Bidirectional behavior requires ownership of each field and a documented conflict policy.

### 4.3 Marketplace operations and manual fallback

Cancellation, partial shipment, returns, fee/settlement details and platform messages require capability-by-capability validation. During early volume, approved manual ingestion can remain preferable to a brittle adapter. Manual entry must record external order reference and preserve original commercial source, and must still pass financial/authorization/inventory invariants.

### 4.4 Provider evaluation before adoption

For each marketplace verify current API access/eligibility, local seller account permissions, approved app scopes, webhook/poll availability, idempotency limits, product-data restrictions, fees, rate limits, refund/cancellation handling, sandbox capability (if offered) and operational cost. **Never assume a public API or a particular integration tier is available to TeeStock.**

## 5. Payment provider and financial state experience

### 5.1 Checkout/payment handoff

An external payment attempt must begin only after authorized checkout eligibility and intended commercial amount have been established. Customer-facing view displays payable amount, currency, chosen method, expiry and how to recover. Payment redirect back to TeeStock is not payment confirmation. A customer refresh, browser close or retry must not produce duplicate economic effects.

### 5.2 Authenticity, matching and canonical effect

Prior to any financial command, verify the provider signal through its documented authentication/signature model, match provider account and tenant context, source transaction reference, amount/currency, corresponding order or invoice, expected state, and duplicate/replay identity. Provider-local success is an **input to reconciliation**, not permission to set `PAID` or change invoice/payment tables directly. Never use raw payment provider payload as a canonical domain event without validation.

### 5.3 Exception categories

| Payment condition              | Customer presentation                                    | MGBOS / operator expectation                            |
| ------------------------------ | -------------------------------------------------------- | ------------------------------------------------------- |
| Created but pending            | Waiting; clear next step and expiry                      | No fabricated paid/order production commitment          |
| Verified complete              | Confirm only when authorized financial record is correct | Correct allocation and business invariants; audit       |
| Provider timeout               | Unknown; don't press customer to pay again blindly       | Query/reconcile provider before a risky retry           |
| Amount/currency mismatch       | Verification needed                                      | Block money command; quarantine evidence                |
| Repeated verified notification | No duplicate success messages or charges                 | Reuse governed result/no extra financial effect         |
| Expired unpaid attempt         | Expired with safe restart option                         | Never change past verified payment inadvertently        |
| Partial/deposit                | Accurate paid/remaining communication                    | Follow specific payment-plan semantics if approved      |
| Chargeback/refund/settlement   | Truthful qualified progress                              | Separate settlement, reversal, refund and payment facts |

### 5.4 Hard gate: financial mutation assurance

A selected payment provider requires sandbox/simulation tests where available, exact schema and provider docs, safe signature handling, adversarial duplicate/concurrency tests, isolation between organizations, correct amount/fingerprint, money invariants, operator runbook, independent security review and owner/deployment approval before live monetary effects. No automated financial mutation is authorized by CX-07.

## 6. Logistics, courier and fulfillment evidence

### 6.1 Customer-visible shipment truth

TeeStock must distinguish **label generated**, **carrier pickup arranged**, **parcel physically handed over**, **carrier in transit**, **carrier claims delivered**, **delivery verified or disputed**. A tracking number alone is not physical dispatch evidence. Multiple shipments, partial deliveries, return-to-sender and lost parcel cases require per-shipment context, not a misleading order-level shortcut.

### 6.2 Provider scans, delivery promises and outages

Courier tracking scans are provider facts; maps from those scans to MGBOS Shipment must use reviewed rules and maintain source timestamps. Duplicate/out-of-order scans must not roll operational state backward. Display last verified update and support path when a provider is slow or unavailable, with clear difference between estimate and guarantee. Promise date must not be fabricated from external carrier SLA alone.

### 6.3 Recovery and privacy

If integration fails, physical handoff and manual evidence-backed updates may continue through an approved controlled process. Address and phone are only shared with necessary providers, with appropriate protection, retention and role restrictions. Wrong-shipment lookup must not expose another customer's address or tracking.

## 7. Messaging: WhatsApp, email and social communication

### 7.1 Purpose and permission

Transactional and promotional messaging are separate purposes. Approval for shipping updates must not be silently reused for campaigns. Verify selected provider's account eligibility, messaging policies, approved templates where applicable, contact consent rules, opt-out, quota, fees, deliverability and data restrictions. Local legal interpretation is owned outside CX-07.

### 7.2 Structured notification request (logical requirement only)

Source is verified business fact/version with recipient authorization, communication purpose, allowed channel, template revision, localized content, correlation/idempotency identity, delivery priority and safe fallback. Provider `accepted`, `sent`, `delivered`, `failed`, `unknown` and `read` (where available) must not be collapsed into one success flag. Do not send duplicate sensitive notices merely because acknowledgement timed out.

### 7.3 Inquiry handoff and human support

Website forms, WhatsApp, email and social DMs should preserve permitted context without scraping personal inboxes, storing all raw messages, or exposing sensitive histories to AI. Unsupported direct API integration uses customer-guided contact/share fallback. Human help stays findable; chatbot support must not act as the only path for urgent order or financial problems.

### 7.4 Content safety

Payment links should use verified provider/merchant URLs and appropriate anti-phishing language. Templates cannot claim shipment dispatched, refund completed, vendor stock reserved or quotation accepted without evidence. Communication snapshots must avoid exposing internal margin, vendor bills or private operator notes.

## 8. Support, CRM, Customer Case and returns

**Customer master:** CRM and provider contacts never create a second authoritative customer system. An integration must not auto-merge person/company records by fuzzy name or phone. Cross-brand/customer/organization access requires relevant permissions and disclosure boundaries.

**Case:** A customer contacting two channels about one issue can have one governed Customer Case reference if identity and issue match; creating that case is subject to product/architecture readiness. An Operational Exception represents an abnormal internal condition, not necessarily the customer's complaint. Both may be linked without redefining one as the other.

**Return/refund:** A request to return is not an approved physical return, an inspection result, a financial refund or completed dispute. Marketplace-specific customer policy applies where it is the governing seller channel. Approved internal processes preserve state, audit and financial correctness.

**Support continuity:** Provide verified summary, source references, owner, next step and reply status for authorized human handoff; never expose internal notes, security decisions, third-party customer details or uncontrolled AI-generated assumptions.

## 9. AI, JARVIS and n8n boundary

| Activity                                   | Proposed AI/automation role                 | Required control                                                   |
| ------------------------------------------ | ------------------------------------------- | ------------------------------------------------------------------ |
| Classify messages/leads                    | Suggest intent and category                 | Human correction; provenance; allowed data handling                |
| Translate unstructured order details       | Draft structured candidate                  | Validate against domain model and source; no silent action         |
| Summarize conversations                    | Authorized privacy-minimized brief          | Do not include unrelated private chats or confidential identifiers |
| Explain tracking/payment                   | Retrieve last verified state and timestamps | Never invent status or mark paid/delivered                         |
| Suggest recovery action                    | Identify known safe next step               | Human/authorized command owns high-risk action                     |
| Route simple notification                  | Deterministic validated workflow            | Templates, recipient checks, consent and dedupe                    |
| Produce founder exception summary          | Compact impact/evidence/options             | No universal founder auto-approval; audit source                   |
| Trigger financial/refund/inventory changes | No direct authority from this PRD           | Separate MGBOS permission and risk/approval checks                 |

n8n may orchestrate approved delivery, scheduled checks and cross-system tasks. It is not a second order, inventory or payment ledger. JARVIS may coordinate through permitted tools, never through inferred database superuser privileges. AI model availability should not be a precondition to completing deterministic business-critical tasks.

## 10. Failure containment and reliability contract

### 10.1 State vocabulary for operator-facing integration health (NOT canonical enums)

| Presentation label        | Meaning                                       | What must not be inferred              |
| ------------------------- | --------------------------------------------- | -------------------------------------- |
| `NOT_VERIFIED`            | Missing current provider proof                | Provider is connected                  |
| `CONNECTED`               | Latest scoped technical check passed          | Every business operation works         |
| `DEGRADED`                | Some functions delayed/reduced                | Safe to make financial promises        |
| `DISCONNECTED`            | Connection/credentials unavailable            | Previously sent commands had no effect |
| `RECONCILIATION_REQUIRED` | Source and target differ or outcome ambiguous | Retry is automatically safe            |
| `MANUAL_FALLBACK`         | Controlled approved human procedure is active | Sync has happened automatically        |

### 10.2 Safe recovery sequence

```text
EXTERNAL INPUT OR OUTBOUND INTENT
    ↓
AUTHENTICATE / AUTHORIZE / VALIDATE / ASSOCIATE
    ↓
DEDUPE AND READ CURRENT CORRECT CONTEXT
    ↓
EXECUTE APPROVED COMMAND OR ADAPTER ACTION
    ↓
RECORD RESULT + PROVENANCE
    ↓
VERIFIED → COMPLETE / PUBLISH ONLY PROVEN STATE
UNKNOWN → RECONCILE BEFORE RISKY RETRY
TRANSIENT FAILURE → BOUNDED RETRY + BACKOFF
PERMANENT FAILURE → QUARANTINE / OWNER / ACTION / AUDIT
```

This is a conceptual outcome model, not a claim of existing queue, outbox, APIs or persisted state.

### 10.3 Reliability and cost principles

1. Provider calls have bounded timeout; timeout can mean **unknown side effect**.
2. Retry is allowed only for safe/idempotent behavior and within provider limits; include backoff and jitter as suitable.
3. Never retry high-risk payment creation, reservation or shipment dispatch blindly after ambiguous outcome.
4. Replay with same logical identity and same payload must not duplicate business effects; replay with materially changed payload must be surfaced as conflict.
5. Permanent failures require retained sanitized evidence and an actionable recovery owner; no invisible data loss.
6. Out-of-order and duplicated external signals are normal distributed-system cases, not proof of attack alone.
7. Backpressure should degrade optional channel updates rather than block public website navigation or unrelated core commands.
8. Preserve actual external IDs, mapping versions, correlation, producer and consumer timestamps for traceability; limit sensitive payload.
9. Reconciliation schedule, freshness display and provider health checks have explicit cost/performance budgets established per selected vendor.
10. Restrict automated escalation to material customer/business impact. Do not wake founder for every transient HTTP error.
11. Retry, recovery and replay operations must be auditable and role-scoped; no direct database mutation shortcuts.
12. When event runtime/outbox is absent, approved manual/batch/controlled synchronous paths are possible only after independent Head Engineering feasibility review.

### 10.4 Founder exception contract

A meaningful incident card answers: **which channel failed, how many orders/customers are affected, which step is unverified, monetary/fulfillment consequence, age, next safe action, owner, and evidence reference**. Founder attention should be reserved for necessary judgment, while routine retries and operator tasks remain delegated. This product UX must not assume the existence of a new canonical `IntegrationException` entity.

### 10.5 Performance and customer experience

Third-party messaging, review widgets and shipping quote SDKs must not be permitted to degrade TeeStock's critical rendering path without a deliberate product decision. Prefer deferred/non-blocking integrations for optional UI elements, secure server-boundary interactions for secrets, and useful placeholders/fallbacks. Core Web Vitals and accessibility acceptance are owned downstream by CX-08, inheriting CX-03's UX principles.

## 11. Security, privacy and provider trust

- Integration principal identity is not the same as human customer, business operator, or corporate organization membership.
- Provider credentials and service-role secrets must stay out of browser bundles, repository docs, screenshots, analytics and AI prompts; plan rotation/revocation and least privilege.
- Every imported signal must be authenticated using the **actual** provider-supported verification scheme and checked against expected account, tenant, object and time/replay constraints.
- For chosen webhook APIs, inspect official documentation for signature mechanisms, key rotation, replay semantics, request size, response/ack behavior, retry frequency and allowed scope. Do not invent a generic provider contract.
- Malformed/cross-tenant input must not reveal internal record existence. Test wrong organization, brand, customer, object owner and integration account combinations.
- Handle external URLs/attachments as untrusted: avoid SSRF, active file execution, unrestricted file access, direct public storage and unsafe PDF/SVG rendering.
- Minimize PII shared with providers/AI; classify and redact logs; consent, retention and privacy legal review belong to applicable policy owners.
- Platform terms, APIs, legal availability and restrictions must be validated for the selected Indonesian seller account at integration decision time.
- Sensitive writes must pass server-side authorization, financial/domain invariants and their own approval gates. An API key's ability to call a provider does not authorize MGBOS business commands.

## 12. Provider capability registry proposal

| Registry entry                 | What the Owner/ops must know                                                                  |
| ------------------------------ | --------------------------------------------------------------------------------------------- |
| Provider and function          | Exactly which tasks are supported, by which provider account                                  |
| Legal/commercial context       | Applicable platform terms, costs, fee schedule, support status                                |
| Direction and objects          | Inbound, outbound, both; allowed data and action types                                        |
| Organization/brand scope       | Which business context is allowed to import/export                                            |
| Authentication / secret owner  | Renewal, scope, incident revoke, no actual secret values                                      |
| Mapping owner and version      | How product/customer/order identities correspond                                              |
| Behavior on timeout/duplicates | Safe replay, reconciliation and unknown-outcome strategy                                      |
| Monitoring and rate limits     | Supported polling/webhook frequency and quotas                                                |
| Fallback and human owner       | What to do when provider is slow or disconnected                                              |
| Launch and QA status           | `PROPOSED`, `NOT_VERIFIED`, `TESTED`, `APPROVED` etc as **labels**, not assumed state machine |
| Evidence references            | Exact provider docs, environment, test dates, reviewer, git revision                          |

**Evidence boundary:** A provider selected for one function is not certified for every capability (e.g., order import does not imply stock sync). A sandbox result cannot be presented as live merchant operations.

## 13. Proposed functional requirements — `CX7-FR-001..048`

**Reading rule:** These are proposed _product outcomes_, not command names or implementation grants. `P0` applies only within approved assisted-sales capability; `P1/P2` require provider-specific feasibility and technical gates. Each has an observable acceptance statement to feed CX-08.

| ID           | Stage | Proposed requirement                                            | Observable acceptance / negative constraint                                           |
| ------------ | ----- | --------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| `CX7-FR-001` | P0    | Route website/social arrivals to relevant TeeStock intent       | User can reach Shop/Custom/Business content without channel-specific confusion        |
| `CX7-FR-002` | P0    | Retain permitted acquisition origin                             | Source is preserved without claiming person identity or overwriting channel ownership |
| `CX7-FR-003` | P0    | Carry inquiry context to approved assisted follow-up            | Human sees verified submitted details and explicit missing fields                     |
| `CX7-FR-004` | P0    | Show human-assisted fallback for unsupported integrations       | Customer can still inquire; not told integration succeeded without durable receipt    |
| `CX7-FR-005` | P0    | Differentiate inquiry acknowledged from quote/order accepted    | UI and communications show actual next step and real evidence                         |
| `CX7-FR-006` | P0    | Preserve external references for manually handled orders        | Operator records channel, external ID, proof and allowed organization                 |
| `CX7-FR-007` | P0    | Prevent accidental repeated manual source effect                | Repeated input flags potential duplicate while permitting valid revision              |
| `CX7-FR-008` | P0    | Make channel responsibility clear to customers                  | Channel-specific checkout, refunds and support terms not misrepresented               |
| `CX7-FR-009` | P1    | Maintain scoped provider capability inventory                   | Integration status reflects evidence per account, action and environment              |
| `CX7-FR-010` | P1    | Verify provider inbound authenticity before use                 | Invalid source/scope cannot create business effects                                   |
| `CX7-FR-011` | P1    | Preserve provider-local and canonical identities separately     | Multiple events correlate without internal ID collision                               |
| `CX7-FR-012` | P1    | Support safe replay/idempotency for source import               | Duplicate notification produces no duplicate order or fulfillment                     |
| `CX7-FR-013` | P1    | Detect changed payload for same logical idempotency identity    | Conflict reported instead of silent overwrite                                         |
| `CX7-FR-014` | P1    | Normalize mapped marketplace order and item data                | Correct SKU/variant/quantity/channel and terms visible for eligible order             |
| `CX7-FR-015` | P1    | Hold unmapped or inconsistent external purchases                | Quarantined with owner, reason and recovery action; no fake finished order            |
| `CX7-FR-016` | P1    | Preserve provider order revisions and valid later updates       | Revised order can be reviewed without duplicating original obligation                 |
| `CX7-FR-017` | P1    | Reconcile external cancellation with internal commitment        | Shipment/payment history is not erased by late cancel event                           |
| `CX7-FR-018` | P1    | Preserve provider settlement/dispute references                 | Payment, settlement, fee and refund are not conflated                                 |
| `CX7-FR-019` | P1    | Route eligible retail payment to approved provider              | Customer sees confirmed amount, identity, expiry and permitted method                 |
| `CX7-FR-020` | P1    | Treat return URL/browser success as unverified                  | UI does not assert paid without authorized reconciliation                             |
| `CX7-FR-021` | P1    | Reconcile provider payment against internal order/intent        | Amount/currency/reference/tenant mismatch prevents money mutation                     |
| `CX7-FR-022` | P1    | Handle duplicate/late payment notifications safely              | Only one intended economic effect; valid later reversal remains possible              |
| `CX7-FR-023` | P1    | Resolve ambiguous timeout before risky payment retry            | No blind second charge; customer gets a useful pending path                           |
| `CX7-FR-024` | P1    | Represent deposits/partial payments truthfully when supported   | Remaining balance is not displayed as fully paid                                      |
| `CX7-FR-025` | P1    | Associate carrier reference with exact shipment                 | Wrong shipment/organization tracking is inaccessible                                  |
| `CX7-FR-026` | P1    | Separate shipping label from actual dispatch                    | No "shipped" claim from label creation only                                           |
| `CX7-FR-027` | P1    | Normalize verified courier scans with source timestamps         | Duplicate/out-of-order scan does not silently roll back delivery progress             |
| `CX7-FR-028` | P1    | Display unavailable/stale courier data honestly                 | Last known status/time and fallback remain visible                                    |
| `CX7-FR-029` | P1    | Generate notifications only from supported business truth       | No fabricated refund, paid, stock or shipment confirmation                            |
| `CX7-FR-030` | P1    | Separate transactional from promotional sends                   | Marketing action requires its own permitted basis and preferences                     |
| `CX7-FR-031` | P1    | Track provider send status separately from customer receipt     | API accepted is never displayed as known customer read                                |
| `CX7-FR-032` | P1    | Deduplicate customer-visible notification effects               | A provider timeout cannot trigger uncontrolled duplicate messages                     |
| `CX7-FR-033` | P1    | Preserve authorized support context across channels             | No repeated data entry for known facts; no disclosure of internal notes               |
| `CX7-FR-034` | P1    | Route cross-channel complaints with appropriate case owner      | Customer Case remains distinct from internal Operational Exception                    |
| `CX7-FR-035` | P1    | Prevent unsafe customer/contact/account linkage                 | Fuzzy match alone never grants access or merges data                                  |
| `CX7-FR-036` | P1    | Provide visible provider connection health and scope            | A connection check is not sold as full functional sync                                |
| `CX7-FR-037` | P1    | Surface unresolved integration discrepancies to ops             | Failure age, impacted objects, owner and next action visible                          |
| `CX7-FR-038` | P1    | Retry transient provider actions safely                         | Bounded backoff and outcome checks; no blind high-risk replay                         |
| `CX7-FR-039` | P1    | Preserve evidence and recover permanent failures                | Quarantine/manual process retains trace, avoids data loss                             |
| `CX7-FR-040` | P1    | Isolate provider degradation from core browsing and operations  | Optional provider outage doesn't make unrelated pages unusable                        |
| `CX7-FR-041` | P1    | Protect credentials, PII and cross-org boundaries               | No secret in browser; unauthorized source events rejected                             |
| `CX7-FR-042` | P1    | Attribute material exceptions without founder notification spam | Founder sees decision-worthy impact; routine retry remains delegated                  |
| `CX7-FR-043` | P2    | Publish selected catalog/listings after readiness checks        | Approved SKU and listing mapping; rejection visible                                   |
| `CX7-FR-044` | P2    | Sync governed available-to-sell with safe buffers               | External discrepancy or oversell risk detected and actioned                           |
| `CX7-FR-045` | P2    | Sync approved channel-specific pricing                          | No arbitrary shared global price overwrite; fee policy preserved                      |
| `CX7-FR-046` | P2    | Prevent echoed updates from circular synchronization            | Same-origin echoed changes do not cause indefinite republish                          |
| `CX7-FR-047` | P2    | Compare desired versus observed provider state                  | Reconciliation reports differences and freshness, not imaginary real-time             |
| `CX7-FR-048` | P2    | Gate more automation against demand, cost and risk              | Additional provider does not launch solely because an adapter exists                  |

## 14. Proposed business and integration experience rules — `CX7-BR-001..028`

| ID           | Proposed rule                                                                                     |
| ------------ | ------------------------------------------------------------------------------------------------- |
| `CX7-BR-001` | A provider's fact is authoritative locally, not directly for MGBOS transaction state.             |
| `CX7-BR-002` | External IDs and canonical IDs must remain distinct and verifiably associated.                    |
| `CX7-BR-003` | All cross-channel writes must pass existing MGBOS command, invariant and authorization ownership. |
| `CX7-BR-004` | An external event is never automatically a committed internal business event.                     |
| `CX7-BR-005` | One logical retry must not create repeated economic/fulfillment effects.                          |
| `CX7-BR-006` | Same idempotency key with materially different input is a conflict, not an update.                |
| `CX7-BR-007` | Browser redirect and payment-provider success screen are not financial proof.                     |
| `CX7-BR-008` | Payment confirmation, internal allocation, provider settlement and refund are different facts.    |
| `CX7-BR-009` | An ambiguous external side effect must be reconciled before high-risk retry.                      |
| `CX7-BR-010` | Catalog and price policy are never decided by a generic provider adapter.                         |
| `CX7-BR-011` | Unmapped product/order data cannot be silently transformed into executable production orders.     |
| `CX7-BR-012` | Every meaningful integration discrepancy requires ownership and recovery evidence.                |
| `CX7-BR-013` | Provider health check success does not prove that all operations or mappings work.                |
| `CX7-BR-014` | Marketplace cancellation does not delete committed shipment or payment history.                   |
| `CX7-BR-015` | Customer marketing permission is different from transactional communication authority.            |
| `CX7-BR-016` | Notification-provider acceptance is not evidence that the customer read or received the message.  |
| `CX7-BR-017` | Label creation is not proof of physical courier handoff.                                          |
| `CX7-BR-018` | External delivery estimate is not an unconditional TeeStock deadline guarantee.                   |
| `CX7-BR-019` | Customer identity cannot be established solely by fuzzy profile similarity.                       |
| `CX7-BR-020` | Customer Case and internal Operational Exception are separate concepts.                           |
| `CX7-BR-021` | n8n and JARVIS do not hold independent business-state authority.                                  |
| `CX7-BR-022` | AI may draft/interpret, but cannot invent channel status or approve financial deviations.         |
| `CX7-BR-023` | Secrets, service keys and raw sensitive payloads never belong in public/browser telemetry.        |
| `CX7-BR-024` | Live provider capability must be proven for exact account, environment, operation and revision.   |
| `CX7-BR-025` | Provider integration outages must not silently disable unrelated web/customer journeys.           |
| `CX7-BR-026` | P0 assisted sales must not be misrepresented as a live real-time omnichannel platform.            |
| `CX7-BR-027` | Customer status reflects verified, qualified and timely evidence, including unknown outcomes.     |
| `CX7-BR-028` | Integration work cannot be handed to Builder directly from this product draft.                    |

## 15. Non-functional product requirements — `CX7-NFR-001..014`

| ID            | Quality requirement               | Testable direction / evidence required                                                                          |
| ------------- | --------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `CX7-NFR-001` | Availability isolation            | Simulated provider outage cannot crash essential website navigation or valid independent operations             |
| `CX7-NFR-002` | Idempotent business effects       | Duplicate external notifications and retries produce one intended effect with correct conflict classification   |
| `CX7-NFR-003` | Authorization and tenancy         | Every source account/event maps to allowed organization/brand; negative actor tests deny cross-tenant data      |
| `CX7-NFR-004` | Authenticated providers           | Verify actual signed/webhook/provider requirements using current provider docs; block forged/malformed requests |
| `CX7-NFR-005` | Unknown outcome control           | Timeout does not equal no effect; financial and high-impact operations reconcile before replay                  |
| `CX7-NFR-006` | Retry and queue boundedness       | Transient rate limits back off; permanent failures are preserved and actionable, not retried forever            |
| `CX7-NFR-007` | Data quality and mapping          | Invalid external IDs, SKU and inconsistent order revisions cannot silently corrupt canonical data               |
| `CX7-NFR-008` | Customer information freshness    | Show timestamp/confidence of provider data and avoid unsupported status claims                                  |
| `CX7-NFR-009` | Privacy and data minimization     | Logs/templates/export/AI context have PII, secrets and private notes redacted/controlled                        |
| `CX7-NFR-010` | Accessible graceful degradation   | Contact and error recovery are keyboard/screen-reader accessible on mobile; slow SDKs non-blocking              |
| `CX7-NFR-011` | Cost and quotas                   | Provider-specific concurrency, polling, message usage and cost budgets measured against operator value          |
| `CX7-NFR-012` | Observability and reproducibility | Trace from provider event or manual source to authorized outcome with redacted evidence and exact environment   |
| `CX7-NFR-013` | Reconciliation operability        | Human can find discrepancies by channel, age, object and owner and execute approved safe recovery               |
| `CX7-NFR-014` | Platform stability                | Integration releases must not bypass governance, rollback/disable procedures or approved security gates         |

No fixed integration-latency or uptime number is invented. For each selected provider, CX-08 and Head Engineering must establish realistic measurable SLO/error budgets based on current provider capabilities, operational needs, and economic constraints, with a specific evidence baseline.

## 16. Proposed acceptance scenarios — `CX7-AC-001..044`

**Test-state rule:** Each scenario must be marked `NOT_RUN`, `SIMULATED_PASS/FAIL`, `PROVIDER_SANDBOX_PASS/FAIL`, `HOSTED_CI_PASS/FAIL`, or `VERIFIED_LIVE` according to real evidence. Synthetic tests alone cannot certify provider behavior. No scenario here has been executed merely by writing this document.

### 16.1 P0 entry, assisted channel provenance and founder operations

| ID           | Scenario                                   | Expected evidence and negative test                                                       |
| ------------ | ------------------------------------------ | ----------------------------------------------------------------------------------------- |
| `CX7-AC-001` | Social campaign → valid Custom inquiry     | User sees relevant page; stored source when permitted; no unsupported account association |
| `CX7-AC-002` | WhatsApp-assisted structured intake        | Operator can trace requirement to source and owner; manual path is explicit               |
| `CX7-AC-003` | Repeated inquiry submission                | No uncontrolled duplicate operational demand; changed inquiry still reviewable            |
| `CX7-AC-004` | Invalid customer identity across channels  | Similar names/phone do not merge customers or expose previous orders                      |
| `CX7-AC-005` | CRM unavailable during submission          | User receives truthful delivery/retention feedback and reachable fallback                 |
| `CX7-AC-006` | External marketplace sale entered manually | Source/platform/external reference recorded; no bypass of governing checks                |
| `CX7-AC-007` | Assisted quote is merely discussed         | UI never claims approval/payment/order without authoritative proof                        |
| `CX7-AC-008` | Website has no connected marketplace       | Feature does not claim automatic sync, but supported inquiry path works                   |

### 16.2 P1 marketplace import, dedupe and concurrency

| ID           | Scenario                                             | Expected evidence and negative test                                      |
| ------------ | ---------------------------------------------------- | ------------------------------------------------------------------------ |
| `CX7-AC-009` | Valid authenticated marketplace order import         | One scoped order with correct items/terms/external ID and audit evidence |
| `CX7-AC-010` | Identical webhook repeated 10 times                  | Exactly one intended canonical business effect, all attempts traceable   |
| `CX7-AC-011` | Same idempotency key with materially changed payload | Explicit conflict with no silent overwrite                               |
| `CX7-AC-012` | Two concurrent deliveries of same order              | No duplicate canonical order, reservation or vendor assignment           |
| `CX7-AC-013` | Same order ID from two provider accounts             | Scoped identities cannot collide; wrong tenant rejected                  |
| `CX7-AC-014` | Unknown SKU/variant in external order                | Quarantine with owner and reason; no production-ready order created      |
| `CX7-AC-015` | Legitimate updated marketplace order revision        | Safe review/application, not rejected as duplicate original event        |
| `CX7-AC-016` | Late marketplace cancellation after shipment         | Preserve shipment/financial history; route policy-governed resolution    |

### 16.3 P1 payment, reversal and ambiguous outcomes

| ID           | Scenario                                               | Expected evidence and negative test                                        |
| ------------ | ------------------------------------------------------ | -------------------------------------------------------------------------- |
| `CX7-AC-017` | Browser returns payment success, provider not verified | Customer sees pending/unknown, no paid invoice or production release       |
| `CX7-AC-018` | Verified paid event matching correct intent            | Governed command records one valid financial result with right allocation  |
| `CX7-AC-019` | Webhook forged/invalid signature/replay                | No business mutation; redacted security evidence produced                  |
| `CX7-AC-020` | Provider payment amount differs from expected          | Reject/quarantine; no partial hidden financial effect                      |
| `CX7-AC-021` | Duplicate payment webhook concurrent arrival           | Exactly one financial effect/ledger allocation; no double confirmation     |
| `CX7-AC-022` | Payment API times out after provider acted             | Reconcile original attempt; no blind second charge                         |
| `CX7-AC-023` | Reversal or chargeback arrives after success           | Separate guarded reconciliation and honest customer state; no data erasure |
| `CX7-AC-024` | Deposit or partial payment through approved flow       | Remaining obligation accurately represented; not marked fully settled      |

### 16.4 P1 carrier, messaging and service handoff

| ID           | Scenario                                                     | Expected evidence and negative test                                   |
| ------------ | ------------------------------------------------------------ | --------------------------------------------------------------------- |
| `CX7-AC-025` | Carrier label exists but no physical handoff                 | Shipment/customer UI does not claim dispatched                        |
| `CX7-AC-026` | Duplicate/out-of-order carrier scans                         | No false regression; history and source timestamps available          |
| `CX7-AC-027` | Courier API unavailable or scan stale                        | Last verified status/time visible with human fallback                 |
| `CX7-AC-028` | Shipment tracking requested by unrelated user                | Access denied without leaking address, recipient or existence         |
| `CX7-AC-029` | Transactional notification based on verified event           | Correct recipient/purpose/template/status with traceable send attempt |
| `CX7-AC-030` | Provider accepted message but delivery unknown               | UI/operator does not mark customer read/notified conclusively         |
| `CX7-AC-031` | Marketing attempt without applicable permission              | Prevent send, preserve safe reason without exposing personal data     |
| `CX7-AC-032` | Customer switches WhatsApp/email/site for same support issue | Authorized verified context retained; human owner remains accountable |
| `CX7-AC-033` | AI suggests wrong refund/payment status                      | Unsupported claim blocked from customer response; human can correct   |
| `CX7-AC-034` | Same customer sends unrelated second complaint               | Separate case context preserved, no accidental merge                  |

### 16.5 P1/P2 recovery, security and expansion

| ID           | Scenario                                              | Expected evidence and negative test                                                 |
| ------------ | ----------------------------------------------------- | ----------------------------------------------------------------------------------- |
| `CX7-AC-035` | Provider quota/rate limit                             | Bounded retry/backoff; graceful degradation and visible unresolved work             |
| `CX7-AC-036` | Persistent malformed/poison signal                    | Quarantined with sanitized evidence/owner; no endless failure loop                  |
| `CX7-AC-037` | Provider credential revoked                           | Affected capability disabled with operator action; unrelated flows remain available |
| `CX7-AC-038` | Cross-organization external ID replays                | No unauthorized data read or financial/fulfillment mutation                         |
| `CX7-AC-039` | Provider webhook contains malicious URL/file          | Validation/quarantine prevents unsafe server fetching or active execution           |
| `CX7-AC-040` | Expensive optional provider widget fails              | Critical page performance/accessibility and core navigation remain usable           |
| `CX7-AC-041` | P2 catalog update rejected by marketplace             | Desired/observed discrepancy and recovery visible; no success illusion              |
| `CX7-AC-042` | P2 competing sales produce ATS drift                  | Buffer/hold/reconciliation as approved; no invented stock guarantee                 |
| `CX7-AC-043` | P2 outbound update echoed inbound                     | No infinite source-republication loop                                               |
| `CX7-AC-044` | Proposed integration lacks official provider evidence | Status remains `NOT_VERIFIED`; production activation blocked                        |

### 16.6 Mandatory evidence matrix per integration slice

For each accepted provider capability, retain: approved business scenario, exact code SHA, canonical contracts and ADR refs as applicable, risk/permission classification, provider docs version/date and account eligibility, adapter configuration without secret values, test environment identity, benign/negative/concurrent execution logs, failure recovery trace, customer UX screenshots or accessible test trace, PII-safe observability evidence, independent reviewer result, owner-decision reference and explicit deployment approval (if applicable).

`NOT_VERIFIED` is an allowed factual result during planning; it is **not** automatic permission to ship a high-risk integration.

## 17. Product decisions — `CX7-DEC-01..018` (OPEN / PROPOSED)

None of the following decisions is frozen by writing this document. An existing canonically approved business policy takes precedence; do not reopen it casually.

| ID           | Decision needed                                     | Recommended starting posture                                                  | Evidence before freeze                       | Owner                         |
| ------------ | --------------------------------------------------- | ----------------------------------------------------------------------------- | -------------------------------------------- | ----------------------------- |
| `CX7-DEC-01` | Which business channel should integrate first?      | P0 assisted Custom/Business, selectively automate proven friction             | Pilot channel volume/manual burden           | Owner/Product                 |
| `CX7-DEC-02` | Which marketplace provider and account tier?        | Do not choose until API eligibility and economics verified                    | Official platform docs/account approval      | Owner + Engineering           |
| `CX7-DEC-03` | Marketplace imports in first automated slice?       | Inbound one-channel order import before bidirectional sync                    | Valid mappings and replay tests              | Owner/Product                 |
| `CX7-DEC-04` | When to enable price/ATS sync?                      | P2 gated by volume, product truth and conflict controls                       | Oversell simulations and economic case       | Owner/Product                 |
| `CX7-DEC-05` | How to handle unsupported marketplace sale classes? | Explicit review/manual fallback; no silent partial import                     | Data/spec discrepancy taxonomy               | Head Engineering/Product      |
| `CX7-DEC-06` | Which payment provider and methods?                 | Choose by supported account, customer demand and transaction integrity        | Official provider scope, fees, sandbox proof | Owner + Finance + Engineering |
| `CX7-DEC-07` | Payment pending/unknown UX?                         | Conservative status, clear retrieval/retry flow                               | UX tests and safe reconciliation evidence    | Product                       |
| `CX7-DEC-08` | Are partial payments/refunds in P1?                 | Only if canonical flow proven; otherwise defer                                | Financial architecture/QA                    | Owner + Head Engineering      |
| `CX7-DEC-09` | Which courier integration first?                    | One necessary provider tracking path, fallback first                          | Volume, coverage, API capability             | Owner/Operations              |
| `CX7-DEC-10` | Customer messages channel priority?                 | Prefer consented and cost-effective reliable channel, no broad automatic spam | Consent, template, deliverability proof      | Owner/Product                 |
| `CX7-DEC-11` | WhatsApp Business API vs human-only?                | Human-assisted P0; API only after provider entitlement validated              | Official eligibility and provider cost       | Owner/Product                 |
| `CX7-DEC-12` | Customer support cross-channel identity linkage?    | Require verified data scope; separate ambiguous records                       | Auth architecture and negative tests         | Head Engineering + Product    |
| `CX7-DEC-13` | Allowed AI assistive functions?                     | Draft/classify/summarize only with proven privacy and human fallback          | AI evals, permission plan                    | Owner + JARVIS Governance     |
| `CX7-DEC-14` | Founder's exception notification threshold?         | Material business/financial/customer harm, not transient HTTP failures        | Controlled pilot founder attention data      | Owner/Product                 |
| `CX7-DEC-15` | Sync freshness expectation per provider?            | Publish only verified SLA and observed timestamps                             | Provider rate limits, acceptable staleness   | Owner + Engineering           |
| `CX7-DEC-16` | Event/outbox prerequisite per integration slice?    | Require proof for reliable async cases; allow bounded manual slice            | Engineering gap analysis and tests           | Head Engineering              |
| `CX7-DEC-17` | Source attribution/PII retention?                   | Minimize, consent/purpose-aware; no silent identity enrichment                | Legal/privacy and channel policy             | Business Policy + Engineering |
| `CX7-DEC-18` | Integration cost/performance ceiling?               | Per-provider cost budget + founder burden and conversion outcome              | Unit economics, provider and CX measurements | Owner/Finance                 |

## 18. Risk register — `CX7-RISK-01..016`

| ID            | Risk                                                | Severity direction | Product mitigation / stop condition                                           |
| ------------- | --------------------------------------------------- | ------------------ | ----------------------------------------------------------------------------- |
| `CX7-RISK-01` | Duplicate external order → duplicate production     | High               | Idempotency/concurrency tests before import enable                            |
| `CX7-RISK-02` | Payment webhook double effect                       | Critical           | Governed command, exact money invariants, independent security/QA             |
| `CX7-RISK-03` | Cross-organization external ID overlap              | Critical           | Tenant/account scoping and negative authorization tests                       |
| `CX7-RISK-04` | Compromised webhook or leaked credentials           | Critical           | Provider-accurate verification, least privilege, rotation, no browser secrets |
| `CX7-RISK-05` | Inventory channel latency causes oversell           | High               | Hold/buffers/eligibility/reconciliation before outbound ATS sync              |
| `CX7-RISK-06` | Provider return URL falsely treated as paid         | Critical           | Verified backend projection and pending-state design                          |
| `CX7-RISK-07` | Customer contact mistaken for another identity      | High               | Scoped proof, no fuzzy identity merge                                         |
| `CX7-RISK-08` | Customer receives wrong private notification        | Critical           | Recipient/purpose checks, redaction, authorization, negative tests            |
| `CX7-RISK-09` | AI invents refund/stock/delivery                    | High               | Grounded context, safe fallback, no autonomous critical actions               |
| `CX7-RISK-10` | Retry storm worsens outage or duplicate effect      | High               | Backoff, rate limits, quarantine, outcome checks                              |
| `CX7-RISK-11` | Unverified provider claims in PRD                   | High               | Official capability matrix and `NOT_VERIFIED` status                          |
| `CX7-RISK-12` | Premature full integration causes burnout and costs | High               | P0 assisted sales, prove channel economics, bounded releases                  |
| `CX7-RISK-13` | Missing event/outbox implementation assumed ready   | High               | Per-slice architecture audit and no event-driven rollout without evidence     |
| `CX7-RISK-14` | Channel-specific fees not reconciled                | Medium/High        | Preserve fee, settlement and refund references; report contribution           |
| `CX7-RISK-15` | Provider SDK slows public website                   | Medium/High        | Defer optional SDK, budget performance, accessible fallback                   |
| `CX7-RISK-16` | PR #73/path conflict creates duplicate canon        | Medium             | Review routing after PR outcome, no duplicate semantic owner                  |

Severity labels are **product prioritization estimates**; they are **not** formal repository R0–R5 classifications. Engineering security governance is authoritative for any later risk rating.

## 19. Product dependency and implementation readiness

### 19.1 Input-to-output traceability

| Upstream companion/source                        | This document consumes                                                   | Downstream consumer                                                  |
| ------------------------------------------------ | ------------------------------------------------------------------------ | -------------------------------------------------------------------- |
| `CX-00`                                          | Reuse/unknown gaps and canonical routing                                 | `CX-07` provider truth/evidence boundaries                           |
| `CX-01`                                          | `JRN-07` external order and `JRN-08` AI handoff, master experience goals | Detailed integration journeys and provider states                    |
| `CX-02`                                          | Service blueprints, physical proof and founder workload                  | Cross-channel handoffs, incident/fallback UX                         |
| `CX-03`                                          | Premium fast/lightweight accessible interaction rules                    | Integration status, non-blocking SDK and fallback patterns           |
| `CX-04`                                          | Pricing, checkout, payment and retail order integrity                    | Payment/marketplace integration acceptance                           |
| `CX-05`                                          | Custom/B2B lead, quote, approval and production gates                    | Assisted WhatsApp/social intake and source mapping                   |
| `CX-06`                                          | Account security, customer service, case/return, notifications           | Support and channel messaging privacy boundaries                     |
| TeeStock `TS-TEC-003`, `TS-DAT` and channel docs | Canonical business integration/commerce direction                        | Avoid policy duplication                                             |
| MGBOS command/event/permission/invariant docs    | Technical ownership and existing limitations                             | Head Engineering gap/reuse assessment                                |
| `CX-08` (next)                                   | This document's 48 FR, 28 BR, 14 NFR and 44 AC proposals                 | Quantitative quality metrics, test taxonomy and release quality gate |
| `CX-09` (later)                                  | P0/P1/P2, costs, provider risk and adoption constraints                  | Evidence-gated phased delivery plan                                  |

### 19.2 Product-to-architecture gap checklist

Head Engineering must decide from _fresh exact repository revision_, not from this draft alone:

1. Is current customer/organization/channel reference representation adequate without new authoritative entities?
2. Which controlled MGBOS commands are already available to a bounded adapter and which need separate IC/WP?
3. Is provider event deduplication and business command idempotency strong enough for the exact financial/order operation?
4. Does reliable asynchronous delivery/outbox truly exist in current code and CI? If not, which proposed flows cannot launch?
5. Can read/write permission and RLS protect external account scope, customer/organization identity and brand context?
6. Are there actual integration-adapter exports, providers and tested transport schemas, not only reserved package boundaries?
7. How are partial fulfillment, cancellation, refunds, settlements and correction workflow represented, with immutable audit?
8. Which provider-controlled data and customer consent may be stored and for how long?
9. What operator fallback, incident owner, retry and emergency-disable mechanism is concretely available?
10. Which security and independent QA suites prove exact negative/concurrent cases on an isolated safe environment?

No model/schema/API choice is made by this product document. Existing root governance, legal/commercial policy, canonical state and exact runtime evidence prevail.

### 19.3 Suggested gated technical work packages (NOT authorization)

These are discovery boundaries only, **not** Antigravity instructions:

| Proposed discovery area | Product objective                             | Preconditions                                                                    |
| ----------------------- | --------------------------------------------- | -------------------------------------------------------------------------------- |
| `DISC-CX7-A`            | Cross-channel references and manual P0 intake | CX-01..07 approved; fresh source/identity audit                                  |
| `DISC-CX7-B`            | Provider capability and security feasibility  | Named provider/account scope and official current docs                           |
| `DISC-CX7-C`            | Single marketplace inbound adapter            | Domain mapping, idempotency and negative test plan                               |
| `DISC-CX7-D`            | Payment provider financial assurance          | Money invariants, approval and R5-level risk assessment as decided by governance |
| `DISC-CX7-E`            | Carrier/messaging integration                 | Physical truth, consent, template, fallback and privacy tests                    |
| `DISC-CX7-F`            | Durable event/outbox if justified             | Separate architecture plan, implementation and independent QA                    |
| `DISC-CX7-G`            | P2 catalog/ATS/price synchronization          | Proven commercial need, mapping, freshness and conflict controls                 |

Each next action requires a bounded implementation contract, exact changed-file scope, risk classification, deterministic tests and owner authorization through established Head Engineering workflow. No implementation/deployment/production access is granted by any row here.

### 19.4 Activation gates

**Gate A — Product:** CX-07 product decisions reconciled with business strategy, customer journeys and customer policy. Material unknowns identified.

**Gate B — Architecture:** source-of-truth, tenant, command, event, outbox, API, provider and permission implications reviewed at fresh exact code. Unsupported promises removed.

**Gate C — Provider feasibility:** actual vendor terms/eligibility, account scope, sandbox or equivalent test, quotas, cost and provider security docs verified.

**Gate D — QA/security:** negative, race, replay, unknown outcome, PII and failure/recovery scenarios independently tested with stated environment identity.

**Gate E — Operational readiness:** owner, fallback, rollback/kill switch, support plan, monitoring, finance reconciliation and physical handoff ready where applicable.

**Gate F — Owner release decision:** exact work package approval, current required CI/status and environment-specific deployment permission. CX-07 alone never passes these gates.

## 20. Example failure investigation fixtures (synthetic, non-production)

### 20.1 Duplicate marketplace callback

- Given: marketplace order `EXT-ORDER-A` maps to a scoped canonical order; original import succeeded.
- When: provider delivers same event 10 times and also sends a valid later revision.
- Then: exactly one original order effect; each duplicate is recognized; the new revision is separately reviewed; there are no duplicate vendor jobs/reservations. Test must check _business effect count_, not merely HTTP 200 count.

### 20.2 Gateway unknown payment outcome

- Given: payment creation request sent; network times out, but provider may have created an attempt.
- When: customer retries, gateway callback arrives late and background reconciliation is delayed.
- Then: system queries/reconciles original attempt as permitted; rejects duplicate charge/record, shows pending until confirmed, and preserves trace for support.

### 20.3 Cross-tenant webhook association

- Given: two organizations share external-looking order numbers on different marketplace seller accounts.
- When: event from one provider account references the other tenant's canonical object.
- Then: no data disclosure or cross-org mutation; event quarantined with redacted security evidence.

### 20.4 Courier scan out of order

- Given: carrier reports in-transit, then delivered; an older in-transit scan arrives later.
- When: adapter replays events in received order.
- Then: history records original provider timestamps; customer status is not silently regressed without an approved correction semantic.

### 20.5 Wrong communication consent

- Given: customer allowed order status updates but opted out of marketing.
- When: campaign engine proposes promotional WhatsApp/email message.
- Then: request does not send under transactional permission; audit records the blocked purpose safely.

### 20.6 Offline founder manual fallback

- Given: external provider account token is revoked during daily sales.
- When: customer makes valid assisted inquiry through the website.
- Then: product continues functioning where possible; operator can capture an approved manual case with source and evidence; UI avoids claiming automatic update.

## 21. Self-review checklist and verification status

| Check                                     | Status at drafting            | Limitation                                                  |
| ----------------------------------------- | ----------------------------- | ----------------------------------------------------------- |
| Frontmatter and document status           | SELF-REVIEW                   | Owner approval not obtained                                 |
| Repository `main` identity                | VERIFIED_READ_ONLY            | Timeboxed snapshot; may change before adoption              |
| Companion CX-00..06 references            | RECONCILED_AS_DRAFTS          | None is declared active canonical authority                 |
| Cross-channel money and identity boundary | DOCUMENTED                    | No new independent security audit or runtime tests          |
| External provider API eligibility         | NOT_VERIFIED                  | No provider selected or interrogated                        |
| Full MGBOS event/outbox readiness         | NOT_VERIFIED_AS_IMPLEMENTED   | Existing canonical architecture reports not yet implemented |
| E2E integration behavior                  | NOT_RUN                       | Specifications are not executable proof                     |
| P0 business pilot viability               | NOT_VERIFIED_BY_THIS_DOCUMENT | Current roadmap controls operational pilot scope            |
| PR #73 routing impact                     | PENDING                       | Resolve after final PR outcome                              |
| Production and deployment authorization   | NONE                          | Explicitly outside product contract                         |

**Result:** CX-07 is ready for _product-owner and independent editorial review_, not implementation. No GitHub file, PR, branch, infrastructure or external-provider state has been changed as part of drafting.

## 22. Stable source register and reading order

### 22.1 Repository authority sources — inspected at exact `main` SHA

1. `docs/governance/documentation-constitution.md` — documentation authority, lifecycle, no duplicate canon.
2. `docs/governance/canonical-source-map.md` — business/system/engineering ownership routing.
3. `docs/roadmaps/solo-founder-launch-roadmap.md` — assisted-sales first, storefront not required for pilot.
4. `bisnis/teestock/09-marketing/channel-strategy.md` — website, marketplaces and multichannel customer roles/economics.
5. `bisnis/teestock/10-product-tech/commerce-platform.md` — orders, payment, SKU, marketplace order import and expected V1 limits.
6. `bisnis/teestock/10-product-tech/automation-architecture.md` — n8n, deduplication, retry, unknown outcome and AI governance.
7. `bisnis/teestock/11-data-mgbos/mgbos-integration.md` — provider adapter, source-of-truth, payment, logistics and messaging interfaces.
8. `bisnis/teestock/11-data-mgbos/event-model.md` — proposed business/integration event distinction and provenance.
9. `systems/mgbos/docs/architecture/command-event-model.md` — actual command maturity, event/outbox non-implementation and inbound external signal controls.
10. `systems/mgbos/docs/architecture/permission-authorization-model.md` — tenant, capability, provider/AI authority and denial principles.
11. `systems/mgbos/docs/architecture/business-invariants.md` — transaction ownership and deterministic enforcement.
12. `docs/architecture/system-boundaries.md` — external-to-canonical and physical-to-digital trust boundary.
13. `systems/mgbos/docs/product/README.md` — customer portal/founder scope and product-to-engineering gateway.
14. `systems/mgbos/apps/teestock/src/app/page.tsx` — public app remains placeholder.
15. `systems/mgbos/packages/integrations/src/index.ts` — reserved integration package.

Source navigation: `https://github.com/Rizkybuilds/bisnishub/tree/2800c474563309bda49d84d712f79b68c9dde36a`.

### 22.2 Local companion draft order — not yet repository authority

`CX-00 → CX-01 → CX-02 → CX-03 → CX-04 → CX-05 → CX-06 → CX-07 (this) → CX-08 → CX-09 → repository package README`.

### 22.3 Follow-on specific tasks

- **CX-08 — Experience Quality & Acceptance Contract:** merge the negative testing taxonomy, security/privacy, WCAG, performance, observability, evidence grades, quantitative thresholds and provider-specific validation gates into one measurable product quality contract.
- **CX-09 — Phased Delivery & Product Validation Plan:** reconcile P0–P2 with canonical business roadmap and implementation dependencies; quantify operations effort, capital, risk and launch order.
- **Post-package cross-review:** check every requirement/ID against parent PRD and canonical source owner, eliminate duplicate rules, settle proposed path after PR #73, and submit to Owner and Head Engineering without any raw Builder handoff.

**Final disposition: `DRAFT_COMPLETE_FOR_INTERNAL_PRODUCT_REVIEW` — `NOT_CANONICAL` — `NOT_IMPLEMENTED` — `NOT_DEPLOY_AUTHORIZED`.**

---

## Remediation R1 — explicit master requirement trace (generated draft, non-authoritative)

The rows below are generated from `CX-PKG-TRACE-R1.csv` (the sole package-wide mapping table). They do not introduce additional product requirements, approve a release stage, change any domain/architecture policy, or prove acceptance. Only exact locally declared IDs are linked; review the complete matrix for gates, ambiguities and candidate staging.

| CX-01 master ID | Exact declared detail IDs in this document | Selected existing acceptance | Candidate slice |
| :-------------- | :----------------------------------------- | :--------------------------- | :-------------- |
| `CX1-FR-024`    | `CX7-FR-020`                               | `CX8-AC-019`                 | `CX-S1`         |
| `CX1-FR-038`    | `CX7-FR-003`                               | `CX5-AC-011`, `CX8-AC-005`   | `CX-S0`         |
| `CX1-FR-040`    | `CX7-FR-004`                               | `CX8-AC-012`                 | `CX-S0`         |
| `CX1-FR-041`    | `CX7-FR-006`, `CX7-FR-014`                 | `CX7-AC-010`                 | `CX-S2`         |
| `CX1-FR-042`    | `CX7-FR-029`, `CX7-FR-030`                 | `CX7-AC-029`                 | `CX-S2`         |
| `CX1-FR-045`    | `CX7-FR-043`, `CX7-FR-044`, `CX7-FR-045`   | `CX7-AC-042`                 | `CX-S2`         |
