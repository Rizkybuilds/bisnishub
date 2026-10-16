---
canonical_id: proposed.mgbos.product.teestock-customer-platform.cx-06
status: DRAFT
version: 0.1.1
owner: Rizky
author: ChatGPT / AI Co-Founder & Product Strategy
approver: PENDING_OWNER_APPROVAL
scope: teestock-customer-platform-account-self-service-and-customer-care
product_program: PROPOSED_TEESTOCK_CUSTOMER_EXPERIENCE_COMMERCE
product_maturity: PROPOSED_CUSTOMER_ACCOUNT_AND_SERVICE_CONTRACT
document_class: product-specification
normative_authority: NONE_UNTIL_APPROVED_AND_ROUTED
engineering_readiness: NOT_READY_FOR_ENGINEERING
implementation_status: PRODUCT_DEFINITION_ONLY
repository: Rizkybuilds/bisnishub
repository_branch: main
source_baseline_commit: 2800c474563309bda49d84d712f79b68c9dde36a
source_baseline_checked: 2026-10-16
source_inspection: SELECTED_GITHUB_SOURCES_AND_CONVERSATION_COMPANION_DRAFTS_NOT_RUNTIME_ACCEPTANCE
created: 2026-10-16
proposed_destination: systems/mgbos/docs/product/teestock-customer-platform/cx-06-customer-account-service-experience.md
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
proposed_authoritative_for_after_approval:
  - teestock_customer_account_navigation_and_customer_self_service_experience
  - customer_facing_order_quote_proof_invoice_tracking_support_and_returns_interactions
  - privacy_preserving_guest_lookup_and_organization_scoped_account_journeys
  - customer_case_experience_human_handoff_and_notification_preferences
  - customer_portal_feature_acceptance_and_recovery_behaviors
not_authoritative_for:
  - teestock_legal_customer_entitlements_return_and_refund_policy
  - teestock_business_product_pricing_and_SLA_policies
  - mgbos_identity_permission_role_capability_or_row_level_security_semantics
  - mgbos_canonical_customer_case_or_return_entity_creation
  - mgbos_order_payment_invoice_production_and_shipment_state_machines
  - external_marketplace_support_dispute_and_payment_provider_behavior
  - data_protection_statutory_interpretation_or_legal_advice
  - jarvis_runtime_agent_permissions_and_autonomous_decision_rights
  - new_database_schema_event_names_commands_API_or_frontend_route_commitments
  - production_deployment_or_implementation_authorization
primary_sources:
  - bisnis/teestock/10-product-tech/digital-product-vision.md
  - bisnis/teestock/10-product-tech/website-information-architecture.md
  - bisnis/teestock/10-product-tech/commerce-platform.md
  - bisnis/teestock/07-operations/customer-service.md
  - bisnis/teestock/07-operations/returns-and-warranty.md
  - bisnis/teestock/12-legal-ip/customer-commerce-policy.md
  - bisnis/teestock/04-services/business.md
  - bisnis/teestock/04-services/custom.md
  - bisnis/teestock/09-marketing/retention-and-community.md
  - systems/mgbos/docs/architecture/permission-authorization-model.md
  - systems/mgbos/docs/architecture/domain-map-capability-ownership.md
  - systems/mgbos/docs/product/README.md
  - docs/governance/documentation-constitution.md
  - docs/governance/canonical-source-map.md
  - docs/roadmaps/solo-founder-launch-roadmap.md
---

# CX-06 — TeeStock Customer Account & Service Experience Specification v0.1.1

> **Working principle:** A customer should not have to ask a human for information they are safely entitled to retrieve, but the portal must never invent business truth, disclose another party's data, or pretend a service request is a completed remedy.
>
> **Disposition:** Complete proposed *product-definition draft*. This is not an authorized product contract, UI implementation, authentication design, or production-readiness finding. All proposed requirements remain subject to Owner approval, canonical routing, product-to-architecture impact review, and bounded engineering contracts.

---

## 0. Executive contract and evidentiary limits

### 0.1 Problem this document solves

TeeStock's customer experience does not end at checkout or inquiry. After submitting a request, accepting a quotation or placing an order, the customer needs to know **what happened, what happens next, whether they must act, what records they are authorized to see, and how to obtain a fair resolution**. The common failure pattern is a high-touch WhatsApp thread in which customers repeatedly ask for status while the founder reconstructs information from payment, vendor, production, carrier and messages.

CX-06 converts that problem into a coherent experience for individual retail customers, Custom buyers and business account contacts. It defines the **visible product behavior**, not the canonical implementation of Customer, Order, Case, Return, Refund, Invoice, Authorization, or Notification domains.

### 0.2 Success thesis

1. **Find:** Customers can find a real order, quotation, approved proof, document, or help topic without navigating internal business taxonomy.
2. **Understand:** Every status includes its meaning, source-confidence limitations, next action and help path.
3. **Act:** Eligible customers can complete authorized tasks such as reviewing a quotation, submitting a correction, requesting assistance or initiating an eligible return without repeating already-held facts.
4. **Trust:** Account identity, organization context, object-level authorization and transactional state remain correct even if the browser, integrations or AI are unreliable.
5. **Recover:** Errors, stale documents and uncertain payment/shipment states do not lead to duplicate charges, phantom approvals, silent data loss or deceptive completion messages.
6. **Reduce founder burden:** Frequent factual questions are answered through a safe read model, while human attention goes toward real exceptions and approvals.

### 0.3 Status vocabulary

| Term | Meaning in CX-06 |
|---|---|
| `SOURCE_VERIFIED` | A statement or restriction observed in named existing repo documents/source at the fixed baseline |
| `PRODUCT_PROPOSED` | A desired customer experience in this draft; not yet accepted as canonical |
| `CONDITIONAL` | Requires business/architecture/provider/security gating before activation |
| `NOT_VERIFIED` | No sufficient implementation, test, legal/policy, or runtime evidence was inspected |
| `NOT_APPLICABLE` | The feature does not apply to that actor/offer/stage |
| `NOT_AUTHORIZED` | A draft cannot grant execution, deploy, migration or credential access |

A strategy document describing a future portal **does not prove** that the live portal exists. At inspected `main` commit `2800c474563309bda49d84d712f79b68c9dde36a`, `systems/mgbos/apps/teestock/src/app/page.tsx` remains an introductory shell; the internal MGBOS Customer 360 operator page is not an authenticated public customer portal. This claim is limited to inspected sources, not an exhaustive system penetration test or live deployment inspection.

### 0.4 Dependency and precedence rule

If this draft conflicts with accepted business policy, executed commercial terms, statutory obligations, governed MGBOS architecture or the current source reality, **do not silently override them**. Flag `POLICY_OR_ARCHITECTURE_RECONCILIATION_REQUIRED` and stop the affected promise/action. Maintain a single authoritative source per semantic concern. Product UX requirements may require new read projections or command contracts, but they do not authorize new root entities by themselves.

---

## 1. Authoritative source alignment

| Source | Established intent or restriction consumed here | CX-06 consequence |
|---|---|---|
| `digital-product-vision.md` §§10–14, 27–29 | One identity where practical; person + organization + role; account should reduce friction; guest checkout possible | Shared identity vision, no forced login for all visitors; object access still separately authorized |
| `website-information-architecture.md` §§108–117, 221–223 | Candidate `/account`, `/account/business`, `/tracking`, `/support`; no portal maze; human support remains visible | Page taxonomy is **candidate IA**, not approved route implementation; progressive account modules |
| `commerce-platform.md` §§69–86, 142–157 | Payment/order/fulfillment truth separate, channel IDs preserved, imported orders governed | Account consumes trusted projections, not inferred success or rebuilt transaction logic |
| `customer-service.md` §§8–40, 104–125, 192–202 | Structured, owned cases; self-service should remove friction; context before reply; AI cannot invent status | Case experience with owner/next action, human access, controlled AI |
| `returns-and-warranty.md` §§3–15, 100–105 | Request ≠ approved return ≠ refund; eligibility varies by product and terms | Return request wizard and distinct outcome vocabulary |
| `customer-commerce-policy.md` §§1–6 | Clear before purchase, traceable afterward, fair when wrong; relevant policy hierarchy | Show customer-approved terms with versions; do not set new entitlements here |
| `business.md` §§26–34, 71–75, 107–110 | Quotes/PO/credit/approver roles, future organization portal and reorder | P1/P2 B2B features are role-gated and evidence-gated |
| `custom.md` §§18–21, 44–50, 64–70 | Artwork versions and approval, custom status and production work order boundaries | Exact proof version action; production not automatically approved by UI |
| `permission-authorization-model.md` §§6–10, 35–40, 81 | Authentication ≠ membership ≠ permission, deny-by-default, non-disclosure on denial | Security requirements; customer capabilities need architecture review, not reuse of staff roles by assumption |
| `systems/mgbos/docs/product/README.md` §§43–44, 51–53 | Customer Case ≠ Operational Exception; PRD ≠ implementation contract | Support and founder exceptions never conflated; no direct Antigravity implementation |
| `solo-founder-launch-roadmap.md` §§24–25 | Initial real validation may use assisted Custom/Business; storefront not required first | Preserve initial assisted-sales scope; build optional self-service only after readiness gates |
| `cx-01..05` companion drafts | Proposed master journeys, UI interaction, retail truth and Custom/B2B approval | Consistent customer experience; no separate business state rules invented here |

All line/section locations reference the repository snapshot in frontmatter; recheck on future promotion. Companion CX drafts are **not currently in `main`** based solely on being authored in this conversation.

---

## 2. Product scope, actors and clear exclusions

### 2.1 Actors / user intents

| Actor | Job to do | Core restriction |
|---|---|---|
| Anonymous visitor | Learn process, find policy, find supported help, start legitimate guest lookup | No exposure of private order facts before secure verification |
| Retail guest buyer | Confirm an order or delivery and request help without mandatory account | Scoped proof of entitlement for each private object/action |
| Registered retail customer | View their own allowed orders, account details and requests | Identity is not automatically permission to import or claim all historical orders |
| Custom buyer | Review active quote, artwork/proof, next steps and a change request | Every commercial/artwork action bound to exact approved version and actor |
| B2B requester | View only organization's permitted requests and related work | Membership alone does not imply ability to approve quotes or access invoices |
| B2B approver / finance contact | Complete explicit approved review/action on permitted objects | Cannot approve beyond grant, threshold, validity, or policy |
| TeeStock support/operator | Handle owned case and inspect minimum necessary linked operational context | Customer-facing communications distinct from internal notes and permissioned operations |
| Founder | Intervene in genuinely escalated decisions or physical operations | Routine factual support must not automatically escalate to Owner |
| AI assistance | Retrieve permitted facts, summarize, suggest guidance or draft replies | No unreviewed authority to refund, approve proof, change payment data or promise SLA |
| External channel or carrier | Produce provider-scoped status/context via governed adapter | Provider message is not automatically canonical status |

### 2.2 Capability tiers

`P0` = initial assisted-sales experience; `P1` = controlled customer account and transactional self-service after respective gates; `P2` = evidence-driven advanced B2B/retention/AI extension. Priority is **relative product sequencing**, not an implementation promise or release date.

| Surface / capability | P0 — assisted | P1 — governed self-service | P2 — selective expansion |
|---|---|---|---|
| Help center / contact | Honest FAQ + human route | Search, contextual support | Adaptive assistance from approved knowledge |
| Inquiry acknowledgement | Reference and follow-up contact | Authenticated request timeline where valid | Proactive next-action guidance |
| Order visibility | Human-assisted verified status; gated lookup if safe | Scoped retail + Custom order lists and details | Cross-channel consolidation where verified |
| Guest lookup | Human verification or protected, time-limited method | Secure scoped tracking when approved | Optional claim/link into account after proof |
| Account identity/profile | No forced customer portal | Verified sign-in, profile/preferences where approved | Additional eligible identities/roles |
| Quote/proof actions | Assisted review and traceable confirmation | Controlled exact-version review and action | Multi-approver B2B workflow after proven demand |
| Invoice/financial documents | Approved assisted delivery | Read-only scoped documents with truth labels | Business finance workspace if justified |
| Service case | Clear contact route, internal ownership | Track request, reply, evidence, resolution | Select automation on low-risk bounded cases |
| Returns/cancellations | Contact/request route with policy explanation | Eligible digital request + tracking | Approved low-risk automation only |
| Reorder | Assisted repeat from known context | Controlled repeat with fresh validation | Authorized account templates/recommendations |
| Notifications | Approved operational acknowledgment | Customer preference/consent where needed | Progressive provider integrations and digest |

P0 is not a commitment to ship a public dashboard. P1/P2 depend on real authorization, legal/customer policy, financial assurance, data availability, usability testing and support operations.

### 2.3 Out of scope

This specification does **not** create a generic ERP/customer CRM, new business credit policy, creator/partner portal, universal identity provider, novel payment gateway, return policy, full-case backend, omnichannel adapter, autonomous refunds, or unconditional real-time carrier status. Dedicated owners handle those topics. Future feature intent is not permission to bypass readiness controls.

---

## 3. Portal information architecture and navigation contract

### 3.1 Proposed customer sitemap (non-binding URL names)

```text
/account                          Personal overview: current actions and recent activity
  /orders                        Authorized orders only
  /orders/{reference}            Order timeline, items, shipments, support
  /quotes                        Permitted quote list (Custom/Business)
  /proofs                        Action-required approved proof review
  /invoices                      Permitted document access where supported
  /requests                      Support and return request history
  /profile                       Customer's permitted identity/contact details
  /addresses                     Addresses with verification where needed
  /preferences                   Communication/privacy choices
/account/business                 Organization workspace (only if enabled)
  /quotes                        Role-scoped commercial offers
  /orders                        Organization-scoped orders
  /invoices                      Allowed documents and payment visibility
  /artwork                       Authorized versioned assets
  /reorder                       Approved account-specific configurations
/tracking                         Guest lookup with bounded verification
/support                          Public knowledge and legitimate human contact
```

Physical URLs are **IA proposals** inherited from the TeeStock website architecture. Avoid routing schemes that create one separate login for every business program.

### 3.2 Default personalized overview

The overview should answer in descending order:

1. **Do you need to act?** E.g., quote acceptance, proof revision, requested information, pending payment requiring customer action. Only if the action is real and the actor can perform it.
2. **What changed?** Last verified, customer-relevant order/case/fulfillment milestones, with timestamp/source if available.
3. **What is next?** Confirmed next operational step or honest uncertainty; link to context.
4. **Need help?** Context-aware support accessible within one obvious navigation step.

A returning user with no work should see useful empty states, not fabricated tasks, stale marketing banners or artificial urgency. Dashboard complexity should grow only as legitimate jobs increase.

### 3.3 Product interaction rules

- Display **customer language**; internal states such as `WAITING_INTERNAL`, financial ledger entries and internal queue names must be mapped to customer-safe explanatory labels.
- Distinguish `NO DATA`, `DATA LOADING`, `DATA UNAVAILABLE`, `NO PERMISSION`, `NOT FOUND IN SCOPE`, `STALE DATA`, and `PENDING CONFIRMATION` where safe to distinguish publicly.
- Show a single canonical order or request reference with links; repeated summaries should not create duplicate objects.
- Never show actions unavailable to the user's role as functional controls. If hidden actions are known via direct URL, server still denies access.
- Prioritize responsive layout, short reading paths, accessible tab/accordion/dialog controls, explicit focus treatment, and no mandatory AI interaction.

---

## 4. Journey portfolio — service blueprint

### `CX6-JRN-01` — Guest purchases or inquiries and later needs tracking (`P0` assisted / `P1` secure lookup)

| Lane | Proposed flow |
|---|---|
| Trigger | Customer has a confirmed channel/order or inquiry reference, but has no account |
| Customer | Opens tracking/help → submits minimum approved verification evidence → receives *scoped* result or safe help route |
| Frontstage | Explanation of verification; no hidden-order details before verification; accessible result with timestamp/status/next action |
| Backstage | Verify reference and entitlement without account enumeration; read permitted projection; log sensitive retrieval appropriately |
| Human/AI | Human-assisted verification if automated proof unavailable; AI may explain process, never decide entitlement |
| Exception | Invalid/expired/wrong proof, excessive attempts, unsupported marketplace order, ambiguous status, unavailable provider |
| Acceptance | A valid guest sees only permitted facts; invalid lookup cannot discover whether another person's reference exists |

### `CX6-JRN-02` — Customer signs in and sees actual owned orders (`P1`)

| Lane | Proposed flow |
|---|---|
| Trigger | Returning registered customer wants to see history, current action and receipts |
| Customer | Authenticate → select personal or permitted business context → view own resources → open an item |
| Frontstage | Context and account scope visible, actionable summary, honest empty/error/pending states |
| Backstage | Bind authenticated principal to approved customer/profile mapping; enforce resource-level authorization on every read |
| Human/AI | Support may investigate missing association after safe verification, never manually assert ownership based on matching email alone |
| Exception | Historical account mismatch, duplicate record, expired session, revoked organization membership |
| Acceptance | Switching context removes previously visible forbidden data; deep-link and API direct access are independently guarded |

### `CX6-JRN-03` — Customer checks status and fulfillment after an order (`P1`)

| Lane | Proposed flow |
|---|---|
| Trigger | Customer wants to know whether payment/production/shipment is progressing |
| Customer | Open order → read timeline/line items/shipments → follow carrier where verified → request help if late/uncertain |
| Frontstage | Separate order, payment, production and shipment meaning; last confirmed milestone and next known action |
| Backstage | Retrieve canonical read model; merge only allowed provider evidence; preserve provenance and freshness |
| Human/AI | AI may summarize trusted evidence; operator owns investigation for mismatched or missing status |
| Exception | Payment callback pending, split shipment, label created but not handed over, delayed carrier event |
| Acceptance | Neither payment nor delivery is marked complete from redirect, generated label, ETA, or user screenshot alone |

### `CX6-JRN-04` — Custom/B2B customer reviews quote or artwork proof (`P1`)

| Lane | Proposed flow |
|---|---|
| Trigger | A permitted quote/proof is awaiting customer decision |
| Customer | Open exact-version document → review scope/price/terms/artwork → accept, request revision or decline where authorized |
| Frontstage | Latest approved object version, validity, consequences, required role, accessible preview/download and explicit confirmation |
| Backstage | Revalidate version/permissions/validity/approval prerequisites; record durable decision, audit and resulting status |
| Human/AI | Human reviews complex financial/IP/tolerance dispute; AI can summarize but not accept on customer's behalf |
| Exception | Two open versions, concurrent revision, expired quote, unrecognized actor, quote/proof approval confusion |
| Acceptance | Stale-version acceptance fails safely; visual proof consent does not silently authorize payment or release production |

### `CX6-JRN-05` — Customer needs help, not another chatbot (`P0/P1`)

| Lane | Proposed flow |
|---|---|
| Trigger | Customer asks about an order, product, delivery, account, invoice, artwork or complaint |
| Customer | Choose issue → optionally link permitted order/item → describe with minimum extra data → submit → receive reference/next step |
| Frontstage | Self-service knowledge first when useful, always-visible human route, case timeline and what action is needed |
| Backstage | Deduplicate matching contacts when warranted; create/link owned Customer Case via governed owner; route to appropriate work |
| Human/AI | AI suggests response and triage with current policy; customer-facing reply stays within approved authority |
| Exception | Missing information, abusive/ambiguous content, offline channel, payment dispute, safety/IP issue, unavailable operator |
| Acceptance | Active cases have real ownership; internal handoff is not presented as customer abandonment; no false response SLA |

### `CX6-JRN-06` — Customer requests return, replacement, cancellation or remedy (`P0` assisted / `P1` eligible self-service)

| Lane | Proposed flow |
|---|---|
| Trigger | Wrong item, damage, fit/size issue, print defect or approved other reason |
| Customer | Choose order/item → request reason and remedy → provide appropriate evidence → receive request reference and review state |
| Frontstage | Display applicable terms/restrictions and state `request submitted`, **not** `return approved/refunded` |
| Backstage | Verify identity/order/channel/product/policy; create case/request in approved domain; human/policy controls govern decisions |
| Human/AI | Human decides non-standard/custom/high-value claims; AI may explain known policy but not grant refunds |
| Exception | Outside stated eligibility, marketplace-owned dispute, insufficient evidence, custom order, physical item not received |
| Acceptance | Return, refund, exchange, replacement and support case remain distinguishable throughout lifecycle |

### `CX6-JRN-07` — B2B contact acts for an organization (`P1/P2`)

| Lane | Proposed flow |
|---|---|
| Trigger | Corporate customer needs quote, PO, invoice, artwork or repeat purchase |
| Customer | Sign in → choose authorized organization → see only allowed work → request/approve within granted role |
| Frontstage | Display active account and role, restricted modules, pending team approvals, document version |
| Backstage | Check person identity, organization membership, capability, resource ownership and current business constraint |
| Human/AI | Sales/support manages relationship; finance/policy approver handles exceptional terms |
| Exception | Removed employee, wrong organization selected, shared device, unauthorized financial detail, invalid PO |
| Acceptance | Requester cannot become quote approver merely by reaching URL; revocation takes effect for future reads/actions |

### `CX6-JRN-08` — Customer repeats a previously successful purchase (`P1/P2`)

| Lane | Proposed flow |
|---|---|
| Trigger | Customer wants to reorder an approved ready-stock, Custom or account product |
| Customer | Select past eligible item/spec → modify quantity/address/size → review **current** price/stock/assets/terms → commit via approved commerce or quote path |
| Frontstage | Historical reference shown as baseline, non-reusable options flagged, no one-click surprise charge |
| Backstage | Resolve immutable previous version; recheck eligibility and material feasibility; create new governed request/order identity |
| Human/AI | Complex custom change routes to human review; AI can suggest but cannot validate unavailable capacity |
| Exception | Retired SKU, revoked artwork usage, changed print method, old promotion/credit, mismatched organization |
| Acceptance | Reorder does not mutate the original order or copy stale payment/approval/discount decisions |

---

## 5. Customer identity, guest access and account linking

### 5.1 Principle: identity is not entitlement

One person may be a retail customer, business contact or creator, consistent with the digital vision. This does **not** imply a universal public permission model already exists. Internal MGBOS `app.users` and `organization_members` are governed business/operator identities; they must not be naively reused as customer role grants. A customer identity design requires separate architecture, threat modeling and explicit mapping to relevant customer/account objects.

### 5.2 Proposed registration and sign-in experience

1. Allow customer to complete approved discovery, Custom inquiry and eligible guest checkout without forced registration.
2. Offer sign-in/account as a value path: history, document actions and preferences, not a gate to basic help.
3. After authentication, clearly identify current personal/business context; do not silently default to a different organization.
4. Apply session expiry, re-authentication and optional stronger proof according to risk of the requested action.
5. Show safe account recovery without leaking registration/existence information.
6. Make log-out and shared-device safe exit discoverable; protected pages must not reveal prior-account data when changing accounts.
7. Do not infer customer-object ownership from shared phone, email or marketing attribution alone.

### 5.3 Guest order lookup

**Product proposal:** support human-assisted lookup at P0 and later a verified, rate-limited, time-bounded self-service lookup when architecture approves a secure mechanism.

- A bare public order number is **not** sufficient authorization.
- A verification token must have appropriate entropy, expiry, scope and replay/revocation policy; never expose token in public analytics, referrer URLs or application logs.
- Prefer limited read scope (e.g., permitted current status), not a broad authenticated account claim.
- Treat unauthenticated unknown, wrong owner, expired token and not found with messages that do not facilitate enumeration.
- Rate limits, abuse telemetry, accessible recovery and customer human support are required; exact proof method/threshold remains architecture-owned.
- If channel rules require the marketplace to handle tracking/disputes, clearly route to that platform rather than pretending TeeStock controls those rights.

### 5.4 Account claiming/linking — CONDITIONAL

Historical guest order linking may be useful but is **not** automatic just because a newly registered email matches an old order. A linking action needs approved entitlement proof, ownership-of-record constraints, fraud protections and audit. If ambiguous, expose a helpful verification/support path, not a manual irreversible merge.

### 5.5 Profile, address and sensitive changes

Basic profile updates may be permitted after authorization. Address, contact, tax/company details, delivery destination, bank/payment destination and account membership changes may require differentiated verification and restrictions according to fulfillment state. Never treat changing an account default address as authorization to alter a committed shipment/order. Privacy rights requests are routed to the legal/privacy owner and authenticated as appropriate; this PRD does not invent retention or deletion guarantees.

---

## 6. Account overview, order history and order detail

### 6.1 Order list and discovery

Display minimal stable summary: recognized order reference, authorized product/brand context, submitted date, current customer-readable status, a meaningful total/payment label if permitted, and primary next action. Search/filter by product/date/status may be progressive, but not required for low-volume initial account cohorts.

Order list is **not** allowed to guess:

- Paid status based on a green browser redirect.
- Shipped status based on a tracking number generated but not handed off.
- Completion merely because the production date passed.
- Canceled/refunded state from a support message without governed financial/fulfillment outcome.
- Empty history when authorized source retrieval has failed.

### 6.2 Order detail: minimum useful view

| Section | Required customer behavior | Source owner |
|---|---|---|
| Overview | Clear purpose, reference, date, current customer-safe status, last trustworthy change | Governed MGBOS/customer-facing projection |
| Items/spec | Product/variant/quantity, immutable bought specification where allowed, production/custom notes safe for customer | Accepted order snapshot, not mutable catalog |
| Price/payment | Applicable subtotal, fees/discounts, payment obligation and confirmed/pending meaning | Finance/payment canonical owner |
| Fulfillment | Shipment group(s), carrier evidence, tracking, delivery limitations, support route | Fulfillment/shipment owner; external carrier caveats |
| Customer action | Authentic unpaid step, proof approval, requested detail or service response only when valid | Real command/action capability |
| Documents | Allowed quote, invoice, receipt, proof, contractual terms, with version/source | Document/business owner |
| Help | Contextual issue category and case link; human support available | Customer service owner |

For split shipments, show shipment-level tracking; don't collapse multiple parcels into a false single completed status. Customer-visible status mapping must be approved against actual MGBOS states before engineering handoff.

### 6.3 Freshness and unavailable-state UX

A customer should know when a status is recently verified, delayed from a provider, pending trusted reconciliation, or temporarily unavailable. Present the **last known verified** state with timestamp when safe and reliable. Do not invent exact promise dates or auto-retry unsafe commands. If freshness cannot be established, say so and provide escalation.

### 6.4 Financial truth and invoices

`Invoice issued`, `payment pending`, `payment recorded`, `refunded`, and `credit applied` represent different governed facts. Show only verified documents/allowed actions; no raw internal ledger, staff-only supplier costs or accounting notes. Invoice downloads must enforce authorization and short-lived file access (or equivalently safe delivery method) rather than static globally shareable paths.

---

## 7. Custom proof, quotation and B2B workspace

### 7.1 Quote/proof card pattern

Each reviewable object displays: document type (quotation vs artwork proof), explicit version, intended approver, material scope, amount/validity when applicable, link to relevant approved terms, outcome buttons allowed for that actor, and impact of action. Submit actions are intentional, confirmed and idempotent by governed command design after engineering approval.

**Never conflate:**

- `Quote viewed` with `quote accepted`.
- `Proof preview loaded` with `artwork approved`.
- `Artwork approved` with `production ready`.
- `PO received` with `invoice settled`.
- `Customer requested change` with `TeeStock accepted a revised price/date`.

A revised quote/proof invalidates actions tied to the old version unless canonical policy explicitly permits them. A failed operation must not create a fake optimistic approved state.

### 7.2 B2B organization switch and role aware actions

A logged-in individual may have multiple business relationships. Require deliberate organization context; show visible organization name and available role/capabilities, but ensure backend authorization decides allowed access. Roles such as requester, reviewer, purchaser, finance viewer and approver are **product actor intents**, not newly approved MGBOS role identifiers. Separate account-private documents from public products. An authorized quote reviewer need not be authorized to see all invoices.

### 7.3 Customer organization document access

- Allowed document categories: approved scope, quotation, accepted terms, PO evidence, approved artwork, order summary, relevant invoices, and delivery paperwork where business policy authorizes them.
- Private file previews and downloads require entity + file-level access checks, revocation handling and version display.
- Browser print, download, generated PDF or screenshot capability does not change ownership/privacy rights; watermarking may help but never substitutes access enforcement.
- External email links are time-bounded and least-privilege; forwarding an email should not automatically grant new account rights.
- A former employee or revoked contact must lose server-side access; security tests must cover stale sessions/direct file URLs.

### 7.4 Reorders and account-specific products

Show reorders as a *new commercial request* using the historical approved configuration as input. Before acceptance, recheck current product availability, size breakdown, artwork rights/version, print method, capacity, prices, taxes, delivery, PO/credit and organizational approval where applicable. Unsupported combinations fall back to assisted quotation without data loss.

---

## 8. Support, Customer Case and service recovery

### 8.1 Support IA

Suggested entry from public pages, order detail, quote/proof, or account:

```text
Find an answer ──> Relevant approved policy, product/size guide, order tracking
      │
      └── Not resolved ──> Contact TeeStock ──> Contextual Customer Case
                                      │
                     owned response, next step, safe evidence
                                      │
                         resolution ──> feedback, audit
```

A chatbot may assist but **cannot be a mandatory wall** between the customer and a legitimate human/support channel.

### 8.2 Case capture and deduplication

The experience should request reason, description, linked authorized order/item, contact route and required evidence only. Auto-populate reliable known context, never force customer to retype it. Show a case reference after *durable* acceptance. Deduplicate only when the same customer, issue and context can be confidently established; otherwise preserve separate cases and link them for operators.

`Customer Case` is a customer-facing support problem/request. `Operational Exception` represents an abnormal operating condition and is not automatically the same entity or lifecycle. A complaint can lead to an operational exception or vice versa, but any correlation is governed by MGBOS ownership—not invented by portal code.

### 8.3 Customer-visible case lifecycle

| Internal conceptual state from business documentation | Example customer-safe expression | Meaning / action |
|---|---|---|
| OPEN | Permintaan diterima | Awaiting assignment; do not claim agent already replied |
| ASSIGNED | Sedang ditangani | An accountable handler exists |
| WAITING_INTERNAL | Kami sedang memeriksa | No need to chase multiple internal teams |
| WAITING_CUSTOMER | Kami memerlukan informasi Anda | State exact requested information and safe response control |
| RESOLVED | Solusi telah diberikan | State resolution and whether further customer action needed |
| CLOSED | Permintaan selesai | Explain reopening/new-case path when applicable |

These labels are **illustrative interface copy**, not an approved backend state machine. Show the timeline from allowed case events; keep internal notes strictly private. If actual support backend is not ready, do not fabricate a case object; retain an honest assisted-support route.

### 8.4 Case ownership and routing

Every ongoing case requires an accountable owner under customer-service policy. Internal production, warehouse, payment, logistics, or vendor handoffs should preserve ownership and customer context. Escalations to founder are bounded to high-impact judgment, authority gaps and meaningful exceptions—not all ordinary delayed status requests. Escalations should include source object, verified facts, attempts already made, customer impact, options and decision sought.

### 8.5 Human fallback and channel migration

A WhatsApp/marketplace/email conversation may be an intake surface; channel normalization is a separate integration problem. For P0, safe human-assisted processing is legitimate as long as the record/next step is governed, not lost in chat memory. Do not promise unified cross-channel timeline until linking and entitlement are actually implemented. If provider policy owns a dispute or payment outcome, tell the customer which platform controls the process.

### 8.6 Support response expectation

Use response hours and service windows only if backed by current published policy and operation. Show acknowledgement and contact route; avoid made-up `instant 24/7 human response`, courier interventions or resolution deadlines. Out-of-hours flows explain next available service window only when reliable. The ability for AI to answer at any hour is **not** evidence that human recovery is available 24/7.

---

## 9. Returns, cancellation, refund and complaint experiences

### 9.1 Remedy vocabulary

| Customer action/fact | Must never be presented as |
|---|---|
| Return **request submitted** | Return approved |
| Return **approved** | Item inspected or refund executed |
| Parcel **received for inspection** | Claim automatically valid |
| Refund **approved** | Money already arrived |
| Refund **sent/processed** | Bank/provider settlement complete unless confirmed |
| Cancellation **requested** | Original order safely canceled and production stopped |
| Replacement **offered** | Replacement shipped |

### 9.2 Return request minimum path

1. Identify authorized order and item (or legitimate assisted path).
2. Show product/channel-specific return eligibility **according to actual approved business/customer terms**.
3. Ask reason, requested remedy and evidence proportionately; upload with CX-05 file safety controls when relevant.
4. Display the difference between a request under review, approved physical return, inspection, refund and replacement.
5. Provide a stable reference and approved instructions when available.
6. Preserve ability to contact human support, especially for custom, defect, partial shipment, vulnerable cases or platform disputes.

No universal refund windows, shipping responsibility, return exception or automatic decision threshold is established by CX-06. If rights are uncertain, do not assert ineligibility solely from an incomplete read model; request controlled review.

### 9.3 Cancellation and order change

A profile update, address edit, artwork comment or support request does not mutate an accepted order. Cancellation or change must use governed order/payment/production policy, including safe handling when fabric has already been bought or print work started. Display whether the request has been received and is pending decision. If cancellation is not available, present applicable reason and authorized help route without a fake disabled-but-working control.

---

## 10. Notifications, consent and customer messages

### 10.1 Notification types

| Category | Proposed examples | Authority and suppression rule |
|---|---|---|
| Transactional/status | Inquiry received, quote issued, proof requires action, payment confirmed, shipment event, case reply | Only triggered from source evidence; applicable legal/channel requirements must be respected |
| Customer action | Needs approval, missing artwork clarification, failed verification | Must correlate to genuine pending customer action and authorized recipient |
| Service recovery | Fulfillment delay, support escalation, known delivery failure | Verified material event or approved operational explanation; no guessed outcome |
| Marketing | New collection, optional reorder reminder, relevant offer | Consent/preference and policy separated from necessary service communications |

### 10.2 Customer preference and channel correctness

- Let eligible users set approved non-essential communication preferences; do not treat promotional opt-in as a necessary condition of purchase.
- Avoid silently unsubscribing a customer from legally/contractually necessary transactional notices when changing marketing preferences; obey local channel/legal rules rather than inventing a universal policy.
- Track authoritative delivery status separately from provider submission/queued status; email accepted by provider is not necessarily received or read.
- Failed, duplicate and out-of-order notifications should not alter business object truth; prevent repetitive spam from retries where possible.
- Guest contacts and organization users require context-specific recipient authorization and notification routing.
- Never include sensitive invoice, detailed payment, token or private document content in unprotected message previews.

### 10.3 Message composition

Customer-facing messages should follow the canonical TeeStock voice: clear, warm, direct, informed, calm and practical. Each material message should answer: **what changed, what this means, what the customer should do, where to get help**. Avoid fake urgency, opaque abbreviations, unexplained system codes, and notification floods for minor internal status changes.

---

## 11. AI-assisted customer care and founder leverage

AI assistance is optional and must not be a dependency for the basic help or order status flow.

**Allowed proposed tasks, with bounded read permissions:** identify intent, retrieve approved FAQs/policies, summarize an authorized order's verified state, propose a reply, identify repeated contacts, prepare a human escalation brief, and suggest a safe next action. The response should expose uncertainty when data is unavailable or outdated.

**Prohibited independent effects unless future explicit authorized deterministic contract allows them:** initiating refunds, approving credit, changing bank account/payment destination, impersonating a quote approver, approving artwork, editing actual order state, declaring a package delivered, altering approved commercial terms, or inventing delivery dates. JARVIS is not a replacement for MGBOS identity or transaction authority.

**Human escalation design:** show who handles the request and why, pass prior customer input and verified context once, avoid customer having to repeat themselves, and provide a useful fall-through route even when AI/provider unavailable. For sensitive issues, do not automatically feed unrestricted personal data into models or third parties; use approved classification, minimization, consent and contractual protections.

**Founder-burden contract:** measure routine contact deflection **alongside** failed self-service, repeated contact, customer effort and cases requiring founder judgment. A lower contact count caused by hiding support is a failure, not a success.

---

## 12. Accessibility, mobile, performance and inclusive recovery

CX-03 owns the overarching interaction/design-system contract; CX-08 will own independent quality gates. CX-06 requires account-specific behaviors:

- Logical headings and landmark structure for overview/orders/quotes/cases; predictable focus restoration after dialogs and context switches.
- Keyboard-accessible status details, proof/quote review, downloads and attachment upload; no drag-and-drop-only path.
- Accessible error and success messages via appropriate live regions without noisy announcements.
- High-contrast distinction of actionable, pending, stale and verified statuses without relying on color alone.
- Small-screen account cards or accessible tables for order/quote/invoice; no forced horizontal scrolling for primary actions.
- Avoid default downloading very large artwork or full history; paginate and lazy-load nonessential portal modules.
- No mandatory AI chat, animation, video or excessive personalization to complete common support jobs.
- Personal data and sensitive documents must not be stored in public CDN caches or exposed by shared-device client caches.
- Offline/timeout after submitting a case must offer a safe outcome reconciliation path instead of uncontrolled retries.
- An unauthenticated user who follows an expired link gets actionable safe guidance; never sees residual private content.

Performance intent: order/account flows must meet later approved mobile real-user experience budgets; this document does not declare observed Web Vitals or numerical SLO evidence. Use existing CX-01/03 proposed performance standards subject to CX-08 confirmation.

---

## 13. Proposed functional requirements — `CX6-FR-001..048`

All rows are *proposed product behaviors*. `P0/P1/P2` refer to staged, gated delivery, not today's implementation. Tests are traceable in §15.

| ID | Tier | Requirement | Minimum acceptance condition |
|---|---|---|---|
| `CX6-FR-001` | P0 | Provide visible public support and approved policy/FAQ access | User reaches relevant help without login or AI gate |
| `CX6-FR-002` | P0 | Provide honest inquiry confirmation and next-contact explanation | Durable receipt uses actual reference or explicitly describes assisted channel |
| `CX6-FR-003` | P0 | Support authenticated or human-assisted case verification path | No unauthorized order facts exposed from user-typed identifier |
| `CX6-FR-004` | P0 | Route service contact by reason and preserve submitted context | Correct intake destination, no unsupported refund or return promise |
| `CX6-FR-005` | P0 | Distinguish support receipt from resolution/approval | UI cannot show closed/refunded for a newly filed request |
| `CX6-FR-006` | P0 | Provide fallback when digital portal service is not ready | Real support channel and accurate availability statement |
| `CX6-FR-007` | P0 | Expose only approved business policies and truthful return help | No invented windows or exceptions |
| `CX6-FR-008` | P0 | Explain uncertain order/payment/shipping status without guessing | User sees verification limitation and owned next step |
| `CX6-FR-009` | P1 | Provide protected account sign-in and recovery experience | Recovery is accessible and does not enumerate identities |
| `CX6-FR-010` | P1 | Show personally scoped account overview and next real actions | Unauthorized business/other-customer data absent |
| `CX6-FR-011` | P1 | Present verified own order list with empty/error separation | Provider failure not rendered as empty history |
| `CX6-FR-012` | P1 | Render order detail and bought-item snapshot | Historical order facts independent of current catalog edits |
| `CX6-FR-013` | P1 | Expose separate payment/order/shipment meaning | No false paid/shipped/delivered claim |
| `CX6-FR-014` | P1 | Support split/partial shipment customer view when actual flow requires | Each known shipment traced independently |
| `CX6-FR-015` | P1 | Provide safe guest order lookup where approved | Expired/wrong tokens reveal no private facts |
| `CX6-FR-016` | P1 | Show last trustworthy update and stale-data messaging | Timestamp/provenance and help route present where available |
| `CX6-FR-017` | P1 | Expose only role-permitted quotation review | Actor and document version checked on read |
| `CX6-FR-018` | P1 | Provide exact-version quote accept/revision/decline action | Wrong actor/expired version cannot commit |
| `CX6-FR-019` | P1 | Render customer-safe proof/artwork version review | Preview distinct from approved production instruction |
| `CX6-FR-020` | P1 | Allow permitted proof approval or revision request | Durable success from governed command, not browser assumption |
| `CX6-FR-021` | P1 | Show allowed invoice/receipt document details and download | Scoped file access and correct financial semantics |
| `CX6-FR-022` | P1 | Expose real pending customer actions, no phantom tasks | Acknowledged/revoked action disappears after trusted refresh |
| `CX6-FR-023` | P1 | Submit contextual service case linked to allowed order/item | Durable reference, minimal repetitive entry |
| `CX6-FR-024` | P1 | Display customer-safe case history and next action | Internal notes and other customer data remain hidden |
| `CX6-FR-025` | P1 | Permit authorized case follow-up and attachments | Duplicate retry doesn't create duplicate effects |
| `CX6-FR-026` | P1 | Support case resolution communication and feedback | Resolved and closed remain distinct |
| `CX6-FR-027` | P1 | Initiate return/remedy request with actual eligibility checks | Submission ≠ approval/refund |
| `CX6-FR-028` | P1 | Display return/replacement/refund milestones distinctly | No proof of financial completion based on request alone |
| `CX6-FR-029` | P1 | Provide legitimate cancellation/change request entrypoint | No direct mutation of accepted transaction without command |
| `CX6-FR-030` | P1 | Provide authorized repeat-order entry using prior context | New price, stock, assets and terms rechecked |
| `CX6-FR-031` | P1 | Allow approved profile/contact/preferences management | Role, privacy and high-risk verification rules honored |
| `CX6-FR-032` | P1 | Separate transactional and marketing communication controls | Consent changes do not falsify service events |
| `CX6-FR-033` | P1 | Notify only on verified customer-relevant events | Failed/duplicate notification does not change canonical status |
| `CX6-FR-034` | P1 | Provide meaningful timeout/session-expiry recovery | User doesn't inadvertently repeat approval/payment/case submission |
| `CX6-FR-035` | P1 | Support server-enforced authorization on every private read/action | Direct URL and API probes denied across customers/orgs |
| `CX6-FR-036` | P1 | Provide protected organization context selection when enabled | Switching scope clears stale previous-org content |
| `CX6-FR-037` | P1 | Provide human support with genuine escalation fallback | AI/provider outage does not block support access |
| `CX6-FR-038` | P1 | Prepare verified support context for operator/founder | No duplicate manual transcription, no overshared private data |
| `CX6-FR-039` | P1 | Distinguish platform-owned vs TeeStock-owned order/support path | Marketplace policy not overridden by own portal |
| `CX6-FR-040` | P1 | Safely relate cases to underlying relevant operational exceptions when supported | Distinct identities/lifecycle preserved, no schema invented by UI |
| `CX6-FR-041` | P2 | Offer controlled historical guest-order account claiming | Requires specific proof and audit, not email auto-match |
| `CX6-FR-042` | P2 | Provide organization role-specific document workspace | Restricted PO/invoices/quotes based on per-resource authorization |
| `CX6-FR-043` | P2 | Support multi-party customer-side approval chains where justified | Requester cannot approve without explicit capability |
| `CX6-FR-044` | P2 | Support account-specific reorder templates | Version, right to use assets, price/credit and capacity rechecked |
| `CX6-FR-045` | P2 | Add contextual governed AI help for authorized facts | AI cannot approve/refund/invent state and has human fallback |
| `CX6-FR-046` | P2 | Add selective proactive notifications/digests for legitimate needs | Approved, consent-aware, deduplicated and measured |
| `CX6-FR-047` | P2 | Support controlled external-channel status reconciliation | Per-adapter capability and source provenance verified |
| `CX6-FR-048` | P2 | Measure help, repeat contacts, effort and founder attention together | No false success from suppression of support demand |

---

## 14. Proposed business and UX safety rules — `CX6-BR-001..028`

| ID | Proposed rule / invariant consumed by experience | Failure blocked |
|---|---|---|
| `CX6-BR-001` | Authentication, organization membership, capability and resource ownership are separate gates | Login-as-authorization |
| `CX6-BR-002` | Deny by default; denial need not disclose target existence | Cross-account enumeration |
| `CX6-BR-003` | Public identifiers alone do not authorize private reads | Order-number guessing |
| `CX6-BR-004` | Customer-facing status is a faithful governed projection, not a new state machine | False operational truth |
| `CX6-BR-005` | Document actions must target explicit current version and actor | Stale quote/proof approval |
| `CX6-BR-006` | Quote acceptance, artwork proof acceptance, payment, and production release are separate gates | Accidental production promise |
| `CX6-BR-007` | Return request, authorized return, refund approval, execution and settlement stay separate | Fake refund notice |
| `CX6-BR-008` | Customer Case and Operational Exception are distinct concepts | Wrong ownership/state |
| `CX6-BR-009` | Every ongoing customer case needs accountable owner and next action | Lost case |
| `CX6-BR-010` | Internal case notes are never exposed as customer messages | Privacy breach |
| `CX6-BR-011` | Customer self-service must not transfer internal confusion to customer | Forced customer ping-pong |
| `CX6-BR-012` | Guest checkout does not mandate full account registration | Avoidable purchase friction |
| `CX6-BR-013` | Historical guest order association requires proof beyond matching contact data | Account takeover |
| `CX6-BR-014` | Marketing consent and transactional requirements remain separable | Unlawful/spam behavior |
| `CX6-BR-015` | Browser/UI completion is not persisted backend completion | Optimistic false approval |
| `CX6-BR-016` | Failure, empty, unavailable, stale and unauthorized have deliberate distinct handling | Deceptive no data |
| `CX6-BR-017` | Reorder creates fresh governed commercial intent after eligibility and price checks | Reuse of stale contract |
| `CX6-BR-018` | Profile address changes do not rewrite accepted shipment/order | Unauthorized mutation |
| `CX6-BR-019` | Direct file download and cached private pages enforce resource scope | URL/file leakage |
| `CX6-BR-020` | Marketplace ownership/terms survive channel normalization | False rights or wrong remedy |
| `CX6-BR-021` | Delivery ETA, SLA and human availability only stated from approved evidence/policy | Fake promise |
| `CX6-BR-022` | AI has bounded read/draft assistance, no implicit command authority | Automated financial/identity harm |
| `CX6-BR-023` | Notification success/failure never mutates order/financial truth | State corruption from messaging |
| `CX6-BR-024` | No duplicate financial/case/approval effect on retry after uncertain result | Duplicate action |
| `CX6-BR-025` | Customer-facing text avoids exposing staff-only production, supplier, cost or risk details | Internal data disclosure |
| `CX6-BR-026` | Revoked B2B contacts lose future access regardless of previously open pages | Stale role access |
| `CX6-BR-027` | Support must remain reachable when self-service or AI fails | Chatbot wall / dead end |
| `CX6-BR-028` | No backend entity/authorization grant is created merely by writing this PRD | Architecture drift |

---

## 15. Proposed acceptance scenarios — `CX6-AC-001..044`

Test cases must use both positive and negative evidence. A visual mock is not proof of authorization, payment correctness or accessible navigation. A `PASS` may only be recorded after tests are actually executed on the exact candidate revision/environment in a future authorized engineering work package.

| ID | Tier | Scenario and expected outcome |
|---|---|---|
| `CX6-AC-001` | P0 | Public support home explains shipping/custom/returns help without login or mandatory chatbot |
| `CX6-AC-002` | P0 | Valid Custom inquiry receives durable acknowledgement or truthful assisted channel confirmation |
| `CX6-AC-003` | P0 | Invalid private order identifier does not expose customer, order existence or address |
| `CX6-AC-004` | P0 | Refund request submitted cannot display `refund completed` |
| `CX6-AC-005` | P0 | Unknown delivery/payment status routes to real verification/support rather than fabricated answer |
| `CX6-AC-006` | P0 | Human support unavailable at the moment is disclosed using actual policy, not fake live SLA |
| `CX6-AC-007` | P1 | Authenticated personal customer sees only permitted own orders; different customer's direct link fails safely |
| `CX6-AC-008` | P1 | Account list query failure renders unavailable/retry, not `no orders` |
| `CX6-AC-009` | P1 | Guest lookup valid scoped verification returns minimal allowed data only |
| `CX6-AC-010` | P1 | Guest token expired, reused improperly or guessed cannot yield private data; abuse attempt is limited |
| `CX6-AC-011` | P1 | Same email on separate customers does not auto-link historic order without proof |
| `CX6-AC-012` | P1 | Shared device logout/switch removes prior customer private state from visible UI and data responses |
| `CX6-AC-013` | P1 | Unpaid/pending payment shows appropriate pending state even after browser payment-success redirect |
| `CX6-AC-014` | P1 | Generated shipment label does not render `shipped` without carrier/handoff evidence |
| `CX6-AC-015` | P1 | Order with two parcels renders independent shipment progress |
| `CX6-AC-016` | P1 | Catalog price change never mutates historical ordered item price/spec |
| `CX6-AC-017` | P1 | Known stale status labels last verified state and safe next check without inventing timeline |
| `CX6-AC-018` | P1 | Authorized quote approver reviews correct version and receives durable acceptance confirmation |
| `CX6-AC-019` | P1 | Quote acceptance by requester without approval right is denied even via direct command |
| `CX6-AC-020` | P1 | Expired or superseded quote/proof approval is blocked; preserved input is recoverable |
| `CX6-AC-021` | P1 | Proof accepted does not automatically mark payment or production released |
| `CX6-AC-022` | P1 | Authorized invoice download works; foreign account and revoked role download denied at file layer |
| `CX6-AC-023` | P1 | A case linked to authorized order is created exactly once through repeated submit/retry |
| `CX6-AC-024` | P1 | Case timeline contains customer-visible replies while internal note remains inaccessible |
| `CX6-AC-025` | P1 | Support escalation keeps accountable case owner and meaningful customer update |
| `CX6-AC-026` | P1 | AI outage preserves self-service read access and human contact route |
| `CX6-AC-027` | P1 | Valid return claim becomes request-under-review, not authorized return or refund |
| `CX6-AC-028` | P1 | Personalized/custom return displays approved differentiated policy or routes unclear case for review |
| `CX6-AC-029` | P1 | Return physical receipt and finance refund milestones remain distinct |
| `CX6-AC-030` | P1 | Cancellation inquiry never mutates accepted production order until governed action completes |
| `CX6-AC-031` | P1 | Reorder fails safe or requests fresh approval if product, price, stock or rights changed |
| `CX6-AC-032` | P1 | Profile address change does not rewrite existing carrier label or committed shipment |
| `CX6-AC-033` | P1 | Marketing opt-out is honored, while essential approved transactional updates are independently governed |
| `CX6-AC-034` | P1 | Duplicate/delayed/out-of-order notification does not falsify timeline or create duplicate action |
| `CX6-AC-035` | P1 | Phone viewport, keyboard, screen reader and reduced motion can complete core tracking/support tasks |
| `CX6-AC-036` | P1 | Stale organization context cannot expose private customer or invoice data after account switch |
| `CX6-AC-037` | P1 | Expired session during case or proof submission reports uncertain outcome and recovers without duplicate change |
| `CX6-AC-038` | P1 | Marketplace-origin order follows proper dispute/support ownership; customer not given false in-store rights |
| `CX6-AC-039` | P1 | Customer Case and Operational Exception remain independently identified/owned if associated |
| `CX6-AC-040` | P1 | Internal context is available to authorized support without manual retyping customer facts |
| `CX6-AC-041` | P2 | Multi-organization B2B actor sees different permitted objects/actions per active membership and capability |
| `CX6-AC-042` | P2 | Revoked business approver loses approval/document access despite a preexisting open browser tab |
| `CX6-AC-043` | P2 | AI assistance for configuration and grounded status answers operates strictly within authorized tool definitions, respects garment/method/placement constraints without invented pricing or commitments, and cites actual governed records or routes to human support when outside bounds |
| `CX6-AC-044` | P2 | Product telemetry shows contact reduction together with effort/repeat-contact/quality, not merely lower support volume |

### 15.1 Security and usability coverage matrix

| Surface | Minimum attack/negative probes | Minimum useful usability test |
|---|---|---|
| Guest tracking | ID enumeration, token expiry, replay/misuse, rate limit, link-sharing leakage | Guest can distinguish tracking, verification and human recovery |
| Personal account | Cross-customer direct URL/API read, session expiry, cache separation, historical claim | Customer can find an order and interpret current milestone |
| Business account | Wrong org/membership/capability, revocation, finance-only file, cached org switch | Requester vs approver find correct role-permitted action |
| Quote/proof | Old version submission, actor spoof, double-submit, malformed file, revoked assets | Customer recognizes quote/proof difference and consequence of accept |
| Case/help | Hidden internal notes, duplicate case creation, backend unavailable, AI outage | Customer submits case without retyping order data |
| Return/remedy | Policy mismatch, unauthenticated claim, premature refund label, marketplace ownership | Customer can distinguish request, inspection and refund stages |
| Notifications | Wrong recipient, opt-out, duplicate/out-of-order event, private-data leak | Action-required vs informational messages understood |

---

## 16. Experience metrics, operational observability and research

### 16.1 Outcomes and instrumentation candidates

| Measurement | Interpretation / guardrail |
|---|---|
| `status_lookup_success_rate` | Eligible customers reach verified useful status; exclude unauthorized reads from success |
| `avoidable_status_contacts_per_100_orders` | Lower is useful **if** resolution, customer trust and contact accessibility remain healthy |
| `support_first_response_by_reason` | Compare against *approved* actual SLA and eligible service window only |
| `repeat_contact_rate` | Rising rate may reveal low quality self-service or false status updates |
| `case_resolution_quality` | Resolution truly useful, not merely fast close/reassign |
| `guest_lookup_safe_failure_rate` | Detect proof errors/abuse without penalizing legitimate recovery unfairly |
| `quote_proof_task_completion` | Successfully authorized exact-version action, not simple button click |
| `portal_authorization_denials` | Security signal; do not store sensitive tokens, raw attachments, card details |
| `return_request_to_resolution_journey` | Distinguish requests/approval/physical receipt/refund completion |
| `founder_manual_status_touch_count` | Count manual status reconstruction and avoidable reply effort |
| `support_handoff_repeat_input_rate` | Measures whether customers have to explain the same issue repeatedly |
| `notification_opt_out_and_errors` | Respect preferences, control excessive sends and identify delivery issues |

Events are **conceptual analytics semantics**, not approved event names or database columns. Retention, lawful basis, consent, aggregation and data classification must be approved before instrumentation. CX-08/CX-09 will set sampling method, baseline, acceptable thresholds and release gates. Zero messages is not proof of success; it can also signal inaccessible support.

### 16.2 Usability study tasks

- U1: An anonymous buyer with an order reference finds safe delivery status and can recover from expired lookup.
- U2: A signed-in retail customer finds a recent order and differentiates pending payment from confirmed payment.
- U3: A B2B requester and approver separately attempt to review a quote; only approver may commit.
- U4: A Custom buyer reviews version 2 proof while version 1 is open on another tab.
- U5: A customer with a print defect files an eligible claim and understands that refund is not automatic.
- U6: A customer receives an unclear carrier update and finds a human help route without a chatbot wall.
- U7: A repeat B2B buyer initiates another order and notices outdated price/garment options.
- U8: A customer changes notification preferences and knows which communication remains necessary.
- U9: A customer uses keyboard + screen reader to review status and submit support evidence.
- U10: An operator locates one linked case without copying sensitive raw customer messages into new tools.

Test with representative mobile connectivity, non-technical users, and low-data contexts. No study result is claimed by this draft.

---

## 17. Decision register — `CX6-DEC-01..017` (all OPEN / PROPOSED)

| ID | Question requiring product, business, legal or architecture decision | Recommended default pending evidence | Owner of decision |
|---|---|---|---|
| `CX6-DEC-01` | Earliest public account scope? | Keep P0 assisted, introduce useful account only with proven need | Product Owner + Roadmap Owner |
| `CX6-DEC-02` | Guest verification mechanism? | Protected scoped proof; do not commit implementation mechanism in PRD | Security/Architecture |
| `CX6-DEC-03` | Account identity relationship to operator MGBOS principals? | Explicit separate access design; no implicit staff-role reuse | Architecture/Auth |
| `CX6-DEC-04` | Order-claiming policy? | Not automatic from email/phone equality | Security/Product |
| `CX6-DEC-05` | Supported customer status mapping? | Approve mapping after state-machine/projection audit | MGBOS Architecture + Product |
| `CX6-DEC-06` | Customer Case domain maturity and owner? | Product intent only; architecture impact before creating commands/schema | Head Engineering + Business Support |
| `CX6-DEC-07` | Public support hours and response SLA? | Display only operationally validated policy | Business Customer Service |
| `CX6-DEC-08` | Self-service return eligibility/window? | Consume existing customer commerce policy; no new rule | Legal/Business Owner |
| `CX6-DEC-09` | Invoice/financial document access model? | Least-privilege object/file scopes per actor | Finance/Architecture |
| `CX6-DEC-10` | Which B2B roles get approve rights? | Requester/read/approver separately, no role-name assumption | Business Owner + Authorization Owner |
| `CX6-DEC-11` | Customer proof acceptance form & signature evidence? | Exact-version durable auditable consent, method later | Legal + Product + Architecture |
| `CX6-DEC-12` | Notification providers and opt-in rules? | Transactional/marketing separation; no forced provider | Legal/Channel Integration |
| `CX6-DEC-13` | Marketplace cases handled by whom? | Preserve each platform's dispute/communication policy | Commercial Operations + Integration |
| `CX6-DEC-14` | AI availability/autonomy? | Optional factual assistance and human recovery; no money/action privilege | JARVIS/Auth/Product |
| `CX6-DEC-15` | Which documents can customers download? | Minimal necessary, dynamic access and revocation | Legal/Business/Architecture |
| `CX6-DEC-16` | Portal success and launch thresholds? | Validate task completion plus support reduction and satisfaction | Product/CX-08/CX-09 |
| `CX6-DEC-17` | Support privacy, retention and identity data rights? | Defer to verified legal/privacy requirements and approved operational model | Legal/Privacy + Security |

Product author recommends defaults, but **does not pre-approve** disputed decisions. Owner need only intervene in strategic choice; delegated canonical owners handle technical and policy details through established governance.

---

## 18. Risk register — `CX6-RISK-01..014`

| ID | Risk | Severity proposal | Control / disposition |
|---|---|---|---|
| `CX6-RISK-01` | Guest lookup leaks order/customer data through guessed identifiers | High | Least-privilege proof, enumeration negative tests, throttling |
| `CX6-RISK-02` | Public customer account incorrectly reuses staff/organization authorization | Critical | Architecture review, role/capability tests before implementation |
| `CX6-RISK-03` | Business contact sees wrong account invoice/quote after switching org | Critical | Server resource checks, cache partitioning, revocation tests |
| `CX6-RISK-04` | Portal shows paid/refunded/shipped absent evidence | High | Read projection provenance + negative reconciliation tests |
| `CX6-RISK-05` | Duplicate retry creates case/approval/charge effect | High | Governed idempotent commands and unknown-outcome recovery |
| `CX6-RISK-06` | Customer mistakenly approves stale quote/proof | High | Version lock, expiry and actor-specific action validation |
| `CX6-RISK-07` | Support case loses owner across vendor/internal handoff | High | Durable case owner and audited next action |
| `CX6-RISK-08` | Return decision contradicts legal/customer policy | High | Canonical policy mapping and legal review |
| `CX6-RISK-09` | Support widget/channels expose private internal notes | High | Separate views, RLS/API/file permission tests |
| `CX6-RISK-10` | Notifications spam customer or reveal private info to wrong recipient | High | Source events, consent, recipient verification, least data |
| `CX6-RISK-11` | AI provides false confident refunds/date/credit answers | High | Grounding, prompt/data bounds, answer policy, human fallback |
| `CX6-RISK-12` | Portal features add founder operations instead of saving time | Medium | Support cost, self-service usability and manual-touch metrics |
| `CX6-RISK-13` | Marketplace disputes treated as own-store return authority | High | Channel-specific terms and source provenance |
| `CX6-RISK-14` | Privacy/retention requirements undocumented or cross-border provider unsuitable | High | Legal/security review before collecting or exporting personal data |

`Critical/High/Medium` above are product planning impact labels, **not** repository R0–R5 governance classifications. Formal engineering risk classification must be assigned by the appropriate canonical authority before work packages.

---

## 19. Traceability, dependencies and specification boundaries

### 19.1 Upstream requirement inheritance

| CX-01 / CX-02 / CX-04 / CX-05 owner | CX-06 fulfillment | Downstream owner |
|---|---|---|
| `CX1-FR-022`, `CX4-FR-018` — Guest checkout | `CX6-FR-015`, `CX6-BR-012/013` | Security, customer identity, CX-08 |
| `CX1-FR-025`, `CX4-FR-026/029` — Order reference and privacy | `CX6-FR-011..016/035` | MGBOS order/permission architecture |
| `CX1-FR-029..036`, `CX2` JRN-06 — Post-order and service | `CX6-FR-001..008/023..033` | Customer Service, CX-07/08/09 |
| `CX1-FR-016/017/034`, `CX5-FR-024..033` — Quote/proof/organization | `CX6-FR-017..022/036/042/043` | MGBOS authorization and governed quote/artwork |
| `CX1-FR-035`, `CX5-FR-035`, `CX4-FR-038` — Reorder | `CX6-FR-030/044` | Product/pricing, commerce commands |
| `CX1-FR-041..043` — Channel / notification / AI | `CX6-FR-033/039/045/047` | CX-07 adapters and JARVIS, CX-08 |
| CX-03 account, status, support and file interaction patterns | Portal UI behaviors, keyboard and responsive states | CX-03 Design System; CX-08 evidence |

### 19.2 Semantic ownership map

| Question | Primary owner | Not allowed to override |
|---|---|---|
| Who is customer and commercial account? | MGBOS domain architecture + approved TeeStock business identity requirements | Account UI code |
| Who may read/approve this quote/invoice/order? | MGBOS authorization/permission governance | Profile preference or frontend role check |
| What does `paid`, `shipped`, `accepted` mean? | MGBOS canonical states/invariants and payment/fulfillment truth | Translated status card or notification |
| Which return terms apply? | TeeStock Customer Commerce Policy + executed terms + mandatory law | Portal wizard |
| What is a Customer Case? | Business support concept; MGBOS implementation semantics only if approved | CX-06 product draft cannot create entity |
| What needs founder action? | Founder Control/exception ownership after source review | Default support escalation |
| How do AI and channels act? | JARVIS + integration/authorization contracts | Chat prompt or provider connector alone |
| What must UI feel like? | TeeStock Brand + CX-03 design/interaction | Technical routing policy |
| When can feature ship? | Head Engineering gated implementation/QA + Owner release authority | Documentation completeness alone |

### 19.3 Proposed service contracts for engineering discovery (not APIs)

Any future product-to-architecture pass should document at least the following conceptual capabilities **without preselecting schemas**:

- `account.read_my_summary`: principal, current context, permitted next-action projection, stale/source labeling.
- `order.read_scoped_history` and `order.read_customer_view`: immutable order snapshot, payment/fulfillment customer projection, object/file authorization.
- `guest.verify_order_lookup`: bounded proof, non-enumeration, scoped result, throttling and audit.
- `quote/proof.read_and_act`: explicit object version, actor capability, policy validity, durable command result and safe replay.
- `service.request_and_follow_up`: customer case scope, owner/next action, messages vs internal notes, idempotent submission.
- `return.request_and_track`: policy eligibility, return/claim/refund distinction, supporting evidence.
- `notification.preference_and_view`: consent, recipient/authorization, authoritative event correlation.

Names are **human-readable discovery placeholders only**; none are real RPC/API definitions, published contracts or implemented features.

---

## 20. Readiness gate, verification plan and stop conditions

### 20.1 CX-06 draft-complete checklist

- [x] Customer, guest, Custom and B2B actor boundaries expressed.
- [x] P0 assisted vs P1/P2 self-service separation stated.
- [x] Service journeys cover status, quote/proof, support, returns, B2B and reorder.
- [x] No incorrect conflation of support, return, refund, payment and production truth.
- [x] Authentication and data ownership authorization treated as distinct questions.
- [x] Proposed requirement, business-rule and acceptance identifiers included.
- [x] Risk, owner decision and traceability maps included.
- [ ] Independent UX/product/security review completed.
- [ ] Owner-approved canonical authority and final document location confirmed.
- [ ] Architecture impact decision completed.
- [ ] Actual public account implementation tested.
- [ ] Real payment/return/customer data acceptance executed.

### 20.2 Promotion from `DRAFT` to accepted product contract

1. Re-read latest `main`, current PRs, source map, and CX-00..05; reconcile drift, particularly any documentation entrypoint/PR #73 changes.
2. Product Owner approves functional behavior/tier scope, or records explicit revisions to unresolved tradeoffs.
3. Canonical business/legal owners verify return, cancellation, consent, SLA, IP and commercial policy language; never invent entitlements.
4. MGBOS security/architecture reviews public identity, scope and Customer Case impact; explicitly record `REUSE / ADAPT / NEW / DEFER` for each candidate capability.
5. CX-08 specifies verifiable risk-appropriate security, accessibility, performance, resilience and real-failure test evidence.
6. CX-09 selects a bounded release slice with success metrics and go/no-go conditions.
7. Head Engineering creates approved implementation contracts/work packages **after** source/architecture review; Builder receives bounded work only.

### 20.3 Mandatory stop conditions

Stop promotion/implementation when any of these remain material and unresolved:

- No proven resource-level authorization for public Customer/Business identity.
- Unverified access control to private invoices, proof files, order documents or support messages.
- Backend source cannot represent expected customer status without guessing.
- Financial/approval/refund action cannot be safely retried and reconciled.
- Return/consent/policy text conflicts with accepted business/legal obligations.
- Customer Case or account schema is being created as a side effect of interface mockups without canonical architecture review.
- Support route claims capacity/response time the founder cannot actually honor.
- Tool or AI is assigned power outside approved MGBOS/JARVIS authority.
- An active PR/work package or governance entrypoint conflicts with this proposed scope.

### 20.4 Future test artifacts requested from Head Engineering

Expected evidence where relevant: exact branch/HEAD/base, feature matrix by tier, principal/organization/guest negative fixtures, auth and file-access reports, replay/concurrency probes for actions, screenshot/mobile/keyboard/screenreader QA, mocked and real provider states, observability without leaked PII, case handoff demos, real operator acceptance, financial reconciliation where involved, and outstanding `NOT_VERIFIED` classification. CI/QA claims are **not** made in CX-06.

---

## 21. Source register and reproducibility

Repository examined read-only at the fixed `main` baseline:

`https://github.com/Rizkybuilds/bisnishub/tree/2800c474563309bda49d84d712f79b68c9dde36a`

Core exact-commit source links (relative to repo root; URLs intended only for reviewer navigation):

1. [TeeStock Digital Product Vision](https://github.com/Rizkybuilds/bisnishub/blob/2800c474563309bda49d84d712f79b68c9dde36a/bisnis/teestock/10-product-tech/digital-product-vision.md)
2. [Website Information Architecture](https://github.com/Rizkybuilds/bisnishub/blob/2800c474563309bda49d84d712f79b68c9dde36a/bisnis/teestock/10-product-tech/website-information-architecture.md)
3. [Commerce Platform](https://github.com/Rizkybuilds/bisnishub/blob/2800c474563309bda49d84d712f79b68c9dde36a/bisnis/teestock/10-product-tech/commerce-platform.md)
4. [TeeStock Customer Service](https://github.com/Rizkybuilds/bisnishub/blob/2800c474563309bda49d84d712f79b68c9dde36a/bisnis/teestock/07-operations/customer-service.md)
5. [TeeStock Returns & Warranty](https://github.com/Rizkybuilds/bisnishub/blob/2800c474563309bda49d84d712f79b68c9dde36a/bisnis/teestock/07-operations/returns-and-warranty.md)
6. [Customer Commerce Policy](https://github.com/Rizkybuilds/bisnishub/blob/2800c474563309bda49d84d712f79b68c9dde36a/bisnis/teestock/12-legal-ip/customer-commerce-policy.md)
7. [TeeStock Business](https://github.com/Rizkybuilds/bisnishub/blob/2800c474563309bda49d84d712f79b68c9dde36a/bisnis/teestock/04-services/business.md)
8. [TeeStock Custom](https://github.com/Rizkybuilds/bisnishub/blob/2800c474563309bda49d84d712f79b68c9dde36a/bisnis/teestock/04-services/custom.md)
9. [MGBOS Permission & Authorization Model](https://github.com/Rizkybuilds/bisnishub/blob/2800c474563309bda49d84d712f79b68c9dde36a/systems/mgbos/docs/architecture/permission-authorization-model.md)
10. [MGBOS Product Documentation Index](https://github.com/Rizkybuilds/bisnishub/blob/2800c474563309bda49d84d712f79b68c9dde36a/systems/mgbos/docs/product/README.md)
11. [Solo Founder Launch Roadmap](https://github.com/Rizkybuilds/bisnishub/blob/2800c474563309bda49d84d712f79b68c9dde36a/docs/roadmaps/solo-founder-launch-roadmap.md)
12. [Active TeeStock Public App Shell](https://github.com/Rizkybuilds/bisnishub/blob/2800c474563309bda49d84d712f79b68c9dde36a/systems/mgbos/apps/teestock/src/app/page.tsx)

Companion CX-00..05 files were prepared in this conversation, **not asserted as merged in GitHub**. Any later copy/upload requires paths to be checked against latest canonical routing and pending documentation work.

---

## 22. Final disposition and next package

**Product draft disposition:** `DRAFT_COMPLETE / SELF_REVIEW_ONLY / NON_AUTHORITATIVE / NO_ENGINEERING_AUTHORIZATION`.

This draft provides a unified customer-account/support behavioral contract and testable acceptance scenarios, while deliberately preserving semantic ownership of payment, identity, authorization, files, support cases, returns, policies and agents. No deployment, PR, database migration, credential use or production data access is approved by its existence.

**Next bounded document:** `CX-07 — Omnichannel & External Integration Requirements`. Its job is to design provider-neutral experience/integration acceptance and reconciliation (marketplace, payment, logistics, communications and AI provider boundaries) without promising real-time sync or skipping external provider entitlement checks.

---

## Remediation R1 — explicit master requirement trace (generated draft, non-authoritative)

The rows below are generated from `CX-PKG-TRACE-R1.csv` (the sole package-wide mapping table). They do not introduce additional product requirements, approve a release stage, change any domain/architecture policy, or prove acceptance. Only exact locally declared IDs are linked; review the complete matrix for gates, ambiguities and candidate staging.

| CX-01 master ID | Exact declared detail IDs in this document | Selected existing acceptance | Candidate slice |
|---|---|---|---|
| `CX1-FR-016` | `CX6-FR-018` | `CX8-AC-027` | `CX-S2` |
| `CX1-FR-017` | `CX6-FR-036` | `CX8-AC-025` | `CX-S2` |
| `CX1-FR-019` | `CX6-FR-020` | `CX8-AC-029` | `CX-S3` |
| `CX1-FR-022` | `CX6-FR-015` | `CX8-AC-017` | `CX-S1` |
| `CX1-FR-025` | `CX6-FR-013` | `CX8-AC-018` | `CX-S1` |
| `CX1-FR-029` | `CX6-FR-002` | `CX8-AC-005` | `CX-S0` |
| `CX1-FR-030` | `CX6-FR-003`, `CX6-FR-008` | `CX8-AC-030` | `CX-S0` |
| `CX1-FR-031` | `CX6-FR-011`, `CX6-FR-012` | `CX6-AC-007` | `CX-S2` |
| `CX1-FR-032` | `CX6-FR-023` | `CX6-AC-023` | `CX-S2` |
| `CX1-FR-033` | `CX6-FR-027`, `CX6-FR-028` | `CX8-AC-032` | `CX-S2` |
| `CX1-FR-034` | `CX6-FR-019` | `CX5-AC-027` | `CX-S2` |
| `CX1-FR-035` | `CX6-FR-030` | `CX8-AC-034` | `CX-S2` |
| `CX1-FR-036` | `CX6-FR-031`, `CX6-FR-032` | `CX6-AC-033` | `CX-S2` |
| `CX1-FR-037` | `CX6-FR-042`, `CX6-FR-044` | `CX6-AC-041` | `CX-S2` |
| `CX1-FR-043` | `CX6-FR-045` | `CX6-AC-043` | `CX-S3` |
| `CX1-FR-044` | `CX6-FR-048` | `CX6-AC-044` | `CX-S2` |
| `CX1-FR-046` | `CX6-FR-045` | `CX6-AC-043` | `CX-S3` |

**Review state:** `R1_AUTHOR_SEMANTIC_MAPPING_ONLY`; requires Owner/Head Engineering decision and independent product review before canonical activation.
