---
canonical_id: proposed.mgbos.product.teestock-customer-platform.cx-04
status: ACTIVE
version: 0.1.1
owner: Rizky
author: ChatGPT / AI Co-Founder & Product Strategy
approver: Rizky
scope: teestock-customer-platform-commerce-and-checkout-experience
document_class: product-specification
normative_authority: CANONICAL_PRODUCT_SPECIFICATION
product_program: PROPOSED_TEESTOCK_CUSTOMER_EXPERIENCE_COMMERCE
product_maturity: PROPOSED_COMMERCE_EXPERIENCE_CONTRACT
engineering_readiness: NOT_READY_FOR_ENGINEERING
implementation_status: PRODUCT_DEFINITION_ONLY
repository: Rizkybuilds/bisnishub
repository_branch: main
source_baseline_commit: 2800c474563309bda49d84d712f79b68c9dde36a
source_baseline_checked: 2026-10-16
source_inspection: focused_repository_documents_and_public_app_source_not_full_runtime_audit
created: 2026-10-16
proposed_destination: systems/mgbos/docs/product/teestock-customer-platform/cx-04-commerce-checkout-experience.md
supersedes: null
remediation_package: CX-REM-R1
remediation_review: AUTHOR_SELF_REVIEW_NOT_INDEPENDENT
companion_drafts:
  - cx-00-source-gap-audit.md
  - cx-01-master-prd.md
  - cx-02-customer-journeys-service-blueprint.md
  - cx-03-experience-design-interaction-spec.md
proposed_authoritative_for_after_approval:
  - retail_customer_discovery_to_checkout_behavior
  - customer_facing_catalog_variant_cart_checkout_and_payment_status_contracts
  - proposed_retail_commencement_and_recovery_acceptance_cases
  - customer_commerce_handoffs_and_founder_admin_reduction
not_authoritative_for:
  - teestock_business_pricing_promotion_tax_shipping_or_refund_policy
  - mgbos_order_payment_inventory_accounting_or_financial_transaction_invariants
  - database_schema_public_rpc_design_or_provider_integration_implementation
  - legal_compliance_certification_or_external_provider_eligibility
  - final_design_tokens_or_pixel_perfect_design_artifacts
  - security_permissions_or_identity_architecture
  - operational_pilot_scope_or_automatic_retail_launch_authorization
  - jarvis_runtime_or_ai_financial_authority
  - multigraph_commercial_customer_platform
source_dependencies:
  - docs/governance/documentation-constitution.md
  - docs/governance/canonical-source-map.md
  - docs/roadmaps/solo-founder-launch-roadmap.md
  - docs/operating-model/solo-founder-operating-system.md
  - bisnis/teestock/02-brand/brand-identity-system.md
  - bisnis/teestock/02-brand/voice-and-copy-system.md
  - bisnis/teestock/03-commerce/commerce-overview.md
  - bisnis/teestock/03-commerce/product-taxonomy.md
  - bisnis/teestock/03-commerce/catalog-merchandising-system.md
  - bisnis/teestock/08-finance/pricing-framework.md
  - bisnis/teestock/07-operations/inventory-system.md
  - bisnis/teestock/07-operations/order-fulfillment.md
  - bisnis/teestock/07-operations/returns-and-warranty.md
  - bisnis/teestock/09-marketing/channel-strategy.md
  - bisnis/teestock/10-product-tech/digital-product-vision.md
  - bisnis/teestock/10-product-tech/website-information-architecture.md
  - bisnis/teestock/10-product-tech/commerce-platform.md
  - bisnis/teestock/11-data-mgbos/mgbos-integration.md
  - systems/mgbos/docs/product/teestock-founder-control-prd.md
  - systems/mgbos/docs/product/teestock-operational-pilot-plan.md
  - systems/mgbos/docs/architecture/domain-map-capability-ownership.md
  - systems/mgbos/docs/architecture/business-invariants.md
  - systems/mgbos/docs/architecture/business-state-machines.md
  - systems/mgbos/docs/architecture/permission-authorization-model.md

effective_from: 2026-10-20---

# CX-04 — TeeStock Commerce & Checkout Experience Specification v0.1.1

> **STATE: DRAFT / SELF-REVIEWED / NO CANONICAL OR IMPLEMENTATION AUTHORITY.** CX-04 translates existing TeeStock commerce and operational strategy into a proposed retail customer-experience contract. It does not replace pricing, payment, inventory, tax, return, MGBOS, identity, or provider authority. Existing canonical specifications remain controlling until approved governance reconciles any difference. Tests described here are **proposed, NOT EXECUTED**. GitHub has **NOT** been changed.

## 0. Executive product contract

**North star:** A customer should be able to discover the right eligible apparel product, understand its specifications and availability, see the full amount they are agreeing to pay, make one deliberate purchasing decision, and receive a truthful, recoverable outcome—without TeeStock forcing them to become an expert in its operations.

**Dual-success condition:**

1. The customer experiences **premium simplicity** across search, product selection, cart and payment; complex features become visible only when necessary.
2. An accepted customer action produces **one correct governed commercial effect**, or a clearly uncertain/recoverable outcome. The founder should not have to re-enter order details, manually interpret a payment screenshot, or reconcile duplicate orders created by normal retries.

**No fake commerce:** Retail checkout exists only for offerings backed by approved sellability, price, supply/lead-time, payment and fulfillment policy. The P0 assisted-sales launch may present product information and request an inquiry, but it **must not advertise a functioning retail checkout** until its P1 transaction gates pass.

**Design direction:** `Neutral Core + Expressive Product Layer` from TeeStock Brand Identity. Storefront appearance, motion and accessibility are governed at experience level by proposed CX-03, not independently redefined here.

### 0.1 Status and authority vocabulary

| Term                      | Meaning                                                                                                           |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `SOURCE_CANONICAL`        | Existing active business/architecture specification and commercial policy; must not be overwritten by this draft. |
| `PROPOSED_PRODUCT`        | Desired commerce behavior for owner consideration, not implemented or approved.                                   |
| `P0`                      | Premium assisted-sales and discoverability foundation; no invented self-service retail.                           |
| `P1_GATED`                | Eligible direct ecommerce flows after business truth, payment/authorization and reliability gates are proven.     |
| `P2_CONDITIONAL`          | Advanced capability requiring real demand, validated economics and independent review.                            |
| `CURRENT_VERIFIED_SOURCE` | Observed in repository source at the baseline revision, not production runtime proof.                             |
| `NOT_VERIFIED`            | Missing runtime, provider, payment, operations or independent test evidence.                                      |
| `BLOCKED`                 | User action cannot safely complete without required verification or policy.                                       |

### 0.2 Sources and exact evidence boundary

Source review is **selected-path** at `main` `2800c474563309bda49d84d712f79b68c9dde36a` (2026-10-16), not a complete repository, staging or production audit.

- `bisnis/teestock/10-product-tech/commerce-platform.md` sections 69–85: checkout, identity, address, revalidation, payment, order, customer-facing lifecycle; sections 142–157: marketplace adapters and idempotency; sections 243–252: staged V1.
- `bisnis/teestock/10-product-tech/website-information-architecture.md`: Shop / Selects / Essentials / Originals, PLP, PDP, navigation, mobile-first and accessibility principles.
- `bisnis/teestock/08-finance/pricing-framework.md`: policy and margin, channel pricing and commercial decisions. This document cannot invent a promotion, tax rate, discount or product price.
- `bisnis/teestock/11-data-mgbos/mgbos-integration.md` sections 110–121: website reads/writes via commerce interfaces, canonical normalization, inventory and marketplace responsibilities.
- `systems/mgbos/docs/product/teestock-operational-pilot-plan.md`: initial **Custom + Business, assisted-sales** pilot; full public retail commerce explicitly not pilot prerequisite.
- `systems/mgbos/apps/teestock/src/app/page.tsx`: actual public homepage is a preparation shell. `custom-atelier/page.tsx` states ordering is not available. `packages/integrations/src/index.ts` remains a reserved boundary at the inspected baseline.
- Draft CX-01 `CX1-FR-006..007`, `CX1-FR-020..028`, `CX1-FR-038..044`; CX-02 `JRN-04/JRN-07` and recovery cases; CX-03 components, screen patterns, payment/uncertainty UI and performance guardrails.

### 0.3 Conflicts and preservation policy

Existing canonical business source may recommend P1-level direct checkout as a _future V1 product stage_. It does not imply the **current Q4 assisted-sales pilot** must contain checkout. CX-04 retains the distinction: **commercial V1 as a future commerce slice ≠ initial pilot scope**.

The business document outlines possible order states but is not a license to create duplicate MGBOS order/payment state machines. CX-04 defines only safe **customer projections** over reviewed authoritative statuses; technical mapping is deferred to Head Engineering.

## 1. Product outcomes and success criteria

| Outcome                        | Customer benefit                                              | Founder/business benefit                                         | Evidence gate                                 |
| ------------------------------ | ------------------------------------------------------------- | ---------------------------------------------------------------- | --------------------------------------------- |
| Correct product discovery      | Finds a suitable item quickly                                 | Fewer repetitive product/size questions                          | Usability task + search data fidelity         |
| Honest availability            | Knows whether item is in stock, MTO or preorder               | Less chasing oversold or impossible commitments                  | Product/inventory policy + negative tests     |
| Clear price/terms              | No surprise change or hidden totals at final decision         | Fewer manual disputes/requotes                                   | Final amount reconciliation + customer review |
| Smooth mobile checkout         | Completes eligible purchase without forced account by default | Less manual order capture                                        | Mobile/keyboard test and governed guest scope |
| Recoverable payment            | Understands whether payment is pending, failed or verified    | Fewer screenshot-based payment escalations                       | Provider + MGBOS reconciliation evidence      |
| Reliable order acknowledgement | Has a durable reference and next steps                        | Zero retyping and controlled retries                             | Exact command/result replay tests             |
| Calm support                   | Can resolve incorrect order or delay                          | Founder sees genuine exceptions, not every normal event          | Customer support + exception evidence         |
| Premium performance            | Rich visuals without lag and confusing interactions           | Better experience without costly unnecessary platform complexity | CX-08 lab + field metrics when available      |

**Explicit anti-metrics:** large feature count, animated mockup alone, checkout conversion without valid fulfillment, GMV without contribution margin, AI token throughput, or "all-green" UI states without domain evidence.

## 2. Actors, offer types, and product eligibility

### 2.1 Actor roles

| Actor                       | Primary tasks                                                        | Product boundary                                               |
| --------------------------- | -------------------------------------------------------------------- | -------------------------------------------------------------- |
| Retail visitor/guest        | Browse, select, validate terms and purchase eligible item            | No access to another customer's cart/order                     |
| Retail account customer     | Same plus history/reorder where supported                            | Account/identity is owned by CX-06 and security authority      |
| Custom shopper              | Request personalized apparel, upload artwork, receive governed quote | P0 assisted Custom is **not** an automatic checkout SKU        |
| B2B purchaser               | Submit requirements, request quote and later approved repeat order   | Roles, permissions and commitments owned by CX-05/06 and MGBOS |
| Founder/operator            | Verify exceptions, physical stock, QC, pack and courier handoff      | UI must not fabricate evidence for physical completion         |
| MGBOS                       | Authoritative lifecycle/financial/inventory/organization truth       | Storefront is a client, not a second ledger                    |
| Payment/carrier/marketplace | External provider evidence, constrained by contract and availability | Redirect/webhook/public UI not independently authoritative     |
| Optional AI                 | Explain, search approved knowledge, suggest products                 | No autonomous price, inventory, cash or refund authority       |

### 2.2 Offer eligibility table

| Offer class                            | P0 handling                                                            | Earliest direct-checkout candidate                     | Guard                                                                            |
| -------------------------------------- | ---------------------------------------------------------------------- | ------------------------------------------------------ | -------------------------------------------------------------------------------- |
| Ready-stock approved apparel           | Published product information, assisted purchase route only if genuine | P1                                                     | Verified active listing, inventory/ATS, final price, payment and shipment policy |
| Made-to-order standardized apparel     | Clear request and lead-time qualification                              | P1 after bounded deterministic policy                  | No guaranteed date or capacity without evidence                                  |
| Preorder campaign                      | Informational if campaign policy exists                                | P1 or P2; **not assumed**                              | Approved prepayment/refund, dates, fulfillment and campaign terms                |
| Custom with artwork                    | Structured Custom inquiry/assisted quotation                           | P2 if standardized and independently gated             | No false proof, instant price or production-ready claim                          |
| Corporate/B2B complex order            | Assisted Business request → reviewed quote                             | P1/P2 limited self-service for qualified repeat orders | Commercial approval, organization and payment terms                              |
| Originals/Collaboration                | Product catalog through Commerce if approved                           | P1 when rights, product and sellability proven         | IP clearance, pricing, supply and merchandising truth                            |
| Unpublished, expired or suspended item | Should not present as purchasable                                      | Not eligible                                           | Back-office publication status and permissions                                   |

**No implicit cross-line promotion:** The fact that TeeStock owns Original IP or supports Custom does not mean its item has a valid published SKU, price or stock.

### 2.3 Commercial prerequisites before enabling checkout

1. Approved product master, sellable variant/configuration and listing publication rules.
2. Defensible price-book context, taxes/fees and promotions if applicable; responsible authority for final price.
3. Verified availability-mode rule and inventory/capacity check where required.
4. Destination, shipping option and reliable delivery **qualification**.
5. Approved cancellation/return/refund terms per product class and applicable law; not inferred by UI.
6. Payment integration, callback/reconciliation, retry/idempotency and financial authorization assurance.
7. Security for guest/customer/organization and protected order status access.
8. End-to-end source-to-customer confirmation and negative/error tests at exact source revision.
9. Manual fallback and operational recovery when provider/automation unavailable.

Failure in any material prerequisite disables the affected purchase path, without necessarily disabling browsing or assisted inquiry.

## 3. Release scope and capability progression

| Capability                | P0 — premium assisted entry                                | P1 — gated eligible retail                              | P2 — advanced optional                                   |
| ------------------------- | ---------------------------------------------------------- | ------------------------------------------------------- | -------------------------------------------------------- |
| Discover offers           | Actual offer/service pages, curated imagery, clear routing | Search, filters, PLP, PDP, merchandising                | Recommendations/personalization                          |
| Variants and availability | Informational, honest limits                               | Verified SKU/variant selection, ATS and MTO status      | Advanced waitlist/preorder if justified                  |
| Direct checkout           | Not exposed as operational                                 | Cart, guest/approved login, verified totals and payment | Saved preferences, promotions, bundles                   |
| Pricing                   | Policy-grounded range or "request quote" only if permitted | Final authoritative amount before commitment            | Advanced pricing only under reviewed deterministic rules |
| Payment                   | Assisted invoicing via existing governed pilot             | Provider-based session, pending/verified distinctions   | Additional methods/providers after assurance             |
| Customer follow-up        | Safe receipt/reference and human support                   | Confirmed order and protected tracking                  | Advanced reorder/recommendations                         |
| Marketplace               | Manual intake only if approved                             | Scoped normalized order ingestion if approved           | Bidirectional near-real-time sync with guards            |
| Custom/B2B                | Structured request + human quote                           | Quote and approved digital review via CX-05             | Configurator and standardized recurring B2B              |

**P0 definition of quality:** navigation, terminology, speed, accurate service descriptions, accessible input and a recoverable valid inquiry are premium. A fake add-to-cart icon or empty checkout route is not a premium experience.

### 3.1 Exclusions / non-goals

- No forced creation of an entire retail commerce system as prerequisite for current Custom/Business pilot.
- No new MGBOS root entities, double ledger, implicit taxes, discounts, margins, or inventory semantics from this UX proposal.
- No guarantee that any payment gateway, marketplace API, carrier or WhatsApp account is enabled.
- No auto-refund/credit decision; no AI-generated confirmed financial outcome.
- No full ERP back office, creator/partner portal, microservices mesh or advanced fulfillment allocation designed here.
- No bypassing PR #68/#70/#72/#73 independent review and production/merge gates.

## 4. Customer journey portfolio

### `CX4-JRN-01` — From entry to correct retail category (`P0/P1`)

**Entry:** homepage, SEO/deep link, social referral or explicit Shop action. **Customer goal:** identify a relevant available item/service in plain language.

1. Frontstage: show verified category and primary navigation; avoid displaying internal business lines as the customer's classification burden.
2. Frontstage: allow browsing of approved Selects, Essentials, Originals or collaborations only where the corresponding catalog is truly published.
3. Frontstage: show actual image/description and availability qualifier rather than generic "all products ready stock".
4. Backstage: catalog/read model provides public projection, not internal production/cost/partner details.
5. Exit: P0 can explain an item and route to assisted order; P1 can continue to verified variant/PDP. Unavailable channel remains clear, not a dead end.

**Failures:** empty catalog vs API failure must differ; missing media should not hide material facts; draft item never appears in public results.

### `CX4-JRN-02` — Search/filter → eligible product (`P1`)

1. Search accepts clear customer-language product terms; results come only from published, accessible catalog.
2. Applied filters are identifiable, removable and optionally URL shareable if approved by design contract.
3. Sorting communicates meaning (e.g., relevance or price) without implying unsupported stock or discounts.
4. Product card shows real variant/starting-price qualifier, never a stale guaranteed final total.
5. No-results offers filter reset or alternate help; retrieval failure offers retry and does **not** masquerade as zero results.

**Exit:** specific valid PDP or assistance; pagination/infinite-scroll approach remains a CX-03/head-engineering UX/performance choice.

### `CX4-JRN-03` — PDP → variant → availability → deliberate add to cart (`P1`)

1. Present essential facts first: type, fit/material, sizing, colors, print/brand context, final/current price qualifier and availability mode.
2. Where a choice affects SKU, price or eligibility, update it visibly and announce changes accessibly.
3. Missing size/color/quantity prevents buying invalid selection; state cannot silently fall back to another variant.
4. Customer can inspect accessible images/size guide without heavy visual scripts being a prerequisite to purchase.
5. On add, source must validate the chosen catalog/variant and cart rules; the UI shows accepted cart result or honest pending/unknown.

**Critical:** `ADD TO CART` **does not mean stock reserved** unless active inventory policy explicitly says so, with a documented expiration and verification mechanism.

### `CX4-JRN-04` — Cart review → explicit reconfirmation (`P1`)

1. Customer sees line item, variant, quantity, price qualifier, subtotal and discount qualification, edit/remove actions.
2. Changes re-evaluate eligibility, totals and related shipping conditions; errors attach to the affected item.
3. Expired item, out-of-stock item or changed price is **not silently substituted or charged**.
4. Customer sees the changed material term before proceeding and explicitly acknowledges revised amount/terms.
5. Empty cart has helpful browse/assistance entry; cart retrieval failure stays distinct from empty cart.

**Exit:** eligible, revalidated cart can enter checkout. Persistent cart duration/login merge remains uncommitted until CX-06/security review.

### `CX4-JRN-05` — Identity and delivery → full amount review (`P1`)

1. Customer chooses guest checkout or approved account route where supported; do not force account without documented business/security need.
2. Collect minimum contact/recipient/delivery information required by chosen fulfillment channel and legally applicable needs.
3. Deliverable address is validated using appropriate policy/provider or safely surfaced for review; no unsupported carrier reachability promise.
4. Show shipping options/rates/estimates only when grounded in provider/rules and clearly labeled.
5. Product, promotions, availability, shipping, tax/fees if applicable, address and amount are revalidated before final commitment.
6. Customer confirms latest terms and is not redirected to provider based solely on client-calculated amount.

**Exit:** one authoritative checkout/payment attempt with a durable correlation path; failed delivery or pricing validation offers correction, not phantom order success.

### `CX4-JRN-06` — Payment attempt → pending/reconciliation → verified outcome (`P1`)

1. Show chosen method/provider and what will happen next before the customer leaves or invokes the payment flow.
2. Initiate a governed checkout/payment session and represent true states (not started, awaiting action, pending, confirmed, failed, canceled, unknown).
3. The return URL/browser redirect may update the screen **only after** a trusted authoritative check. It is not proof of money received.
4. On refresh or interrupted browser session, permitted order lookup shows the current verified projection or unknown/reconciliation state.
5. If status is delayed, provide a safe refresh/help path without encouraging a second payment attempt before the first attempt is reconciled.
6. On confirmed financial state, show confirmed order reference, next steps and fulfillment expectations only when permitted by the underlying order/payment source.

**Exit:** visible verified payment/order state or a recoverable nonfinal case; payment is never 'confirmed' because a spinner or external success query parameter says so.

### `CX4-JRN-07` — Confirmed order → operations and customer updates (`P1`)

1. Accepted order is represented by a stable human-readable reference (not permission to reveal internal identifiers).
2. Customer receives approved communication about payment and processing without exposing internal vendor, cost or risk details.
3. Actual production, QC, packing, label, carrier handoff and delivery evidence arrive from their true owners; no UI auto-advances physical stages.
4. Customer status maps detailed internal states into accurate, simple customer language; partial/split fulfillment is supported only if actual capability exists.
5. Customer can securely access approved support/tracking options; CX-06 owns account/case details.

**Founder outcome:** organized work queue/packing and real action evidence, not manually transcribing customer name, SKU, address and price into separate spreadsheets.

### `CX4-JRN-08` — Failed/aborted purchase → controlled recovery (`P1`)

- **Payment declined:** state honestly, preserve valid cart where safe, show payment retry conditions according to provider/order rules.
- **Inventory changed:** show affected item and remove/correct/help; no silent downsize or order acceptance.
- **Delivery unavailable:** show affected address/option and alternative; do not fabricate shipping fee or timeline.
- **Timeout after command:** offer status reconciliation, **not blind duplicate submit**.
- **Canceled checkout:** distinguish canceled _payment attempt_ from order cancellation; show consequence honestly.
- **Provider outage:** stop financial commitment if authority cannot be verified; show safe customer/support path.
- **Session expired:** restore non-sensitive eligible cart choices when feasible, then revalidate all price/inventory/shipping terms.
- **Unauthorized order view:** deny without leaking existence of another order/customer.

### `CX4-JRN-09` — External-channel order, internal fulfillment (`P1/P2 conditional`)

An approved external provider is the buyer's transactional channel; TeeStock normalizes the external order using channel/external identifiers under existing MGBOS and TeeStock commerce rules. Platform-origin price/payment status/communications may have provider-specific authority: never force own-site checkout logic onto marketplace orders. Duplicate events must not create duplicate internal orders, stock consumption or payments. Mismatched SKUs/settlement require documented reconciliation. CX-07 owns connector/provider contracts; CX-04 only owns customer-facing commerce consistency.

## 5. Product discovery, listing and merchandising

### 5.1 Search, filters and results

- Published eligible products only; exclusion of draft, inactive, unauthorized or legally blocked listings is enforced server-side, not a hidden CSS card.
- Search term normalization and synonyms are search implementation decisions; no guarantee of semantic/vector or AI search in P1.
- Filter categories derive from approved product taxonomy: customer-facing product type/size/color/fit/availability/price range as actually supported.
- Filtering must not mix internal SKU availability with public brand/category identity.
- Sorting by price uses displayed applicable pricing context and identifies starting prices if variants differ; do not sort by hidden wholesale or cost values.
- Query parameters and shareable URLs are permitted only after privacy/caching/SEO and fallback review.
- "Nothing matched" differs from "catalog unavailable"; provide reset and retry, respectively.
- Product cards should communicate limited, non-misleading essentials: name, appropriate photo, availability, contextual price, variants (if needed) and a clear next action.
- Merchandising placement, featured/collection tags and ranking must remain editorially controlled; recommendations must not override honest stock or publication state.

### 5.2 Visual and media contract

- Use existing TeeStock image/brand standards; aspect consistency should preserve apparel detail without deceptive recoloring/fit distortion.
- Primary material/size/price facts remain usable if gallery, video, animations or recommendation assets fail.
- Progressive media: responsive images, appropriate dimensions, constrained zoom, lazy noncritical visuals; probable LCP hero must not be delayed by indiscriminate lazy loading.
- Avoid autoplay heavy product videos, background 3D engines or AI inference on a normal PLP/PDP critical path.
- Accessibility: descriptive alternative text for informative imagery; decorative art does not duplicate product names in screen reader output.

### 5.3 Public listing states

| State                    | Public meaning                            | Allowed next step                        | Forbidden implication                             |
| ------------------------ | ----------------------------------------- | ---------------------------------------- | ------------------------------------------------- |
| `NOT_PUBLISHED`          | Not offered to public                     | None / internal review                   | Cannot be indexed as buyable                      |
| `PUBLISHED_READY_STOCK`  | Offered under verified ready-stock rules  | Select variant; direct checkout if gated | Unlimited or permanently reserved supply          |
| `PUBLISHED_MTO`          | Made after an order under policy          | Order/request with stated conditions     | Immediate dispatch                                |
| `PUBLISHED_PREORDER`     | Approved future campaign                  | Gated preorder action if enabled         | Ready stock or guaranteed ship date without proof |
| `SOLD_OUT`               | No buyable capacity currently             | Notify/help only if approved             | Hidden backorder acceptance                       |
| `UNCERTAIN_AVAILABILITY` | Availability cannot currently be verified | Contact/try later                        | "Available now"                                   |
| `CATALOG_UNAVAILABLE`    | Retrieval failure                         | Retry / support                          | "No products exist"                               |

These are **customer presentation concepts**, **not new database enums**. Exact mapping is deferred to MGBOS architecture and CX-08.

## 6. Product detail page (PDP) contract

### 6.1 Minimum content by product mode

| Fact                                          | Ready stock             | MTO standard                                 | Preorder (if approved)           |
| --------------------------------------------- | ----------------------- | -------------------------------------------- | -------------------------------- |
| Product/variant/size/fit/material             | Required                | Required                                     | Required                         |
| Product provenance/rights/collection identity | When applicable         | When applicable                              | When applicable                  |
| Price + currency + qualifier                  | Required                | Required                                     | Required                         |
| Availability classification                   | Verified mode/ATS       | Production eligibility                       | Campaign eligibility             |
| Dispatch/lead-time                            | Grounded shipping terms | Grounded processing + shipping qualification | Policy/campaign terms            |
| Returns/cancellation conditions               | Applicable policy       | Applicable MTO policy                        | Applicable preorder policy       |
| Promotional conditions                        | If applicable           | If applicable                                | If applicable                    |
| Customer action                               | Add to cart if eligible | Order/request depending on policy            | Reserve/preorder only if enabled |

### 6.2 Variant control

- Product options are explicit and stable: color, size, length/fit or approved sellable option, not arbitrary free text as a substitute for master data.
- Choosing a different option may alter SKU, stock, price, delivery estimate and return eligibility; all relevant changes must be visible before confirmation.
- Show invalid/unsupported combinations without pretending an orderable SKU exists.
- Accessible selection must not require dragging, hovering or color recognition alone; size names and labels are textual.
- Current selected option and quantity must survive normal in-page interaction; source is rechecked before cart acceptance.
- If product photography cannot accurately represent an exact variant, label image as illustrative according to policy; never imply image equals artwork-approved final product.

### 6.3 Sizing and expectation management

- Size guide accessible near size selection with readable measurement units and fit explanation; avoid making one size appear universally suitable.
- Highlight material variations, intended use, made-to-order conditions, and meaningful print/decoration limitations without cluttering common ready-stock purchase.
- Explain what to do when customer does not know their size or wants custom modifications; route to assistance rather than silent assumptions.
- Do not claim all colorways, blanks or fulfillment partners available because marketing photos exist.

## 7. Pricing, amount and promotion presentation

### 7.1 Price source and version boundaries

1. Catalog/PDP price is a **displayed quote context** that may be variant, region, channel, campaign and customer dependent.
2. Cart price is a **provisional calculated display**, not permission to commit stale commercial terms.
3. The checkout review shows the **most recently authoritative final payable amount** after eligibility and provider/fee validation.
4. Material changes before commitment require an understandable difference summary and explicit customer reconfirmation.
5. Accepted order/financial records preserve their appropriate historical terms under MGBOS ownership; later price-book edits do not retroactively rewrite them.
6. Quote/estimate for Custom/B2B is not interchangeable with a customer retail final price. CX-05 owns quote versioning/acceptance.

### 7.2 Price breakdown

Proposed customer-visible breakdown, only for terms actually applicable and source-supported:

| Line                  | Disclosure                                                                    | Source authority                    |
| --------------------- | ----------------------------------------------------------------------------- | ----------------------------------- |
| Products              | Variant, quantity, unit/line price in IDR or selected supported currency      | Approved sellable pricing           |
| Discounts             | Coupon, valid campaign, eligibility; not all promotions are combinable        | Approved promotion policy           |
| Shipping              | Selected shipping service and rate/fee qualification                          | Fulfillment/carrier rule            |
| Other service charges | Printing/handling/expedite fees only if explicitly applicable                 | Business pricing/fee owner          |
| Taxes                 | Only legally applicable rate/treatment, with approved calculation and wording | Finance/tax policy and legal review |
| Amount due            | Single reviewed payable amount and supported due/payment terms                | Governed checkout/order/payment     |

**Never guess tax percentage, delivery cost, store credit, coupon stack order, or provider fee.** If authoritative calculation cannot be completed, final purchase must not proceed as if total were confirmed.

### 7.3 Promotion UX

- Discount application must show accepted/rejected/pending, applied amount, eligibility reason and changes to total.
- A rejected/expired code cannot leave behind its prior discounted total.
- Promotions spanning channel/collection/product categories must follow existing policy, not UI shortcuts.
- UI cannot create a "manual override" to bypass margin/approval controls.
- P1 may use no coupon engine at all; a simple promotion is enabled only if deterministic and tested. Advanced bundles/loyalty/AI pricing are P2 conditional.

## 8. Cart, availability and reservation

### 8.1 Cart invariants

- One item line must be grounded in valid item/configuration, quantity, price context and current eligibility.
- Every edit (add/remove/quantity/variant) has bounded authoritative validation and visible result.
- Cart may be held client-side or server-side as engineering chooses, but MUST NOT become a second official order, stock ledger or money source.
- All totals and "available now" labels must be revalidated before payment/order commitment.
- "Added to cart" only means cart accepted the selection; **it never independently means inventory has been reserved**.
- Stock reservation timing/expiry and concurrency protections belong to existing MGBOS/inventory architecture; CX-04 requests their customer effect without inventing mechanisms.
- No silent substitution of size, color, quantity, or price when stock runs out; offer customer choice.
- Cart data persistence, anonymous identifiers, client storage and merge after login require approved privacy/security identity semantics.

### 8.2 Cart feedback and recovery

| Trigger                 | Customer display                                           | Correct behavior                     |
| ----------------------- | ---------------------------------------------------------- | ------------------------------------ |
| Item added successfully | Compact confirmation and cart count/summary                | Source accepted; no oversold promise |
| Invalid quantity        | Inline explanation, restore valid quantity                 | No invalid cart line accepted        |
| Price changed           | Old/new material terms and recalculated total              | Reconfirm before checkout            |
| Stock decreased         | Affected item + available action                           | No implicit backorder/swap           |
| Item unpublished        | Mark unavailable; allow remove/save reference if permitted | Never purchase withdrawn listing     |
| Cart empty              | Friendly empty state with Shop links                       | Not reported as server outage        |
| Cart lookup failed      | Clear unavailable/retry state                              | Not represented as an empty cart     |
| Session refresh/logout  | Safe restore where supported; permission reviewed          | No cross-customer cart leakage       |

### 8.3 Reservation/overselling and race conditions

**Scenario:** Two customer sessions select the last available unit. Displayed catalog/cart state is not decisive; the authoritative checkout boundary resolves concurrency under approved inventory rules. Losing customer must be told to choose/remove/seek help; **no accepted payment for a now-unfulfillable unit without defined recovery and valid financial policy**. Integration and race tests must be independent of interface assertions.

## 9. Identity, guest checkout and privacy

### 9.1 Identity choices

- Guest checkout is the **recommended P1 default** for ordinary retail, subject to identity, legal/privacy and payment review.
- Do not make the customer create an account solely to retrieve a receipt if protected guest access is possible.
- Authentication, contact verification, rate limits, anti-abuse, session TTL and object-level access are **not authored here**; CX-06/Head Engineering owns their exact contract.
- If a workflow requires login due to verified risk or buyer type, explain why before asking for information already provided.
- Account login/guest cart merge must not cross identities or organization scopes; P1 need not implement account merge.

### 9.2 Customer and shipping data

Collect only data needed by supported checkout, payments, shipment, compliance and communications. Make optional fields optional. Provide correction for typos before final commitment. Handle contact/shipping address with appropriate consent, storage/retention and security policies—not business-analytics convenience. Order lookup must require adequate authentication or scoped proof of ownership, with responses that do not disclose other customers' records.

## 10. Delivery and shipping selection

| Customer decision               | Expected behavior                                          | Guard                                            |
| ------------------------------- | ---------------------------------------------------------- | ------------------------------------------------ |
| Delivery destination            | Validate supported region/address to required completeness | Address form completion ≠ carrier acceptance     |
| Delivery type                   | Show only supported/eligible options                       | No fake same-day or free shipping                |
| Fee                             | Include verifiable amount in final checkout breakdown      | Provider estimate must be refreshed or qualified |
| Processing time                 | Clearly distinguish preparation/production from transit    | MTO lead time ≠ courier transit                  |
| Requested arrival date          | Label requested/unconfirmed until approved                 | Founder/carrier feasibility cannot be assumed    |
| Pickup (if later offered)       | Show actual location/time/availability only when enabled   | No invented shop location or hours               |
| International delivery (future) | Separate compliance/tax and carrier verification           | Out of P1 default scope                          |

Carrier tracking number created is **not** evidence of parcel acceptance, dispatch or successful delivery; see CX-02 physical-operations blueprint and MGBOS Shipment authority.

## 11. Checkout experience contract

### 11.1 Checkout states (customer-view projections, NOT MGBOS enums)

| Customer state        | Customer sees                                      | Required verified input                             | Forbidden effect                               |
| --------------------- | -------------------------------------------------- | --------------------------------------------------- | ---------------------------------------------- |
| `EDITING`             | Address/contact/cart and chosen options            | Permitted current session                           | Creating payment or order without action       |
| `REVALIDATING`        | Clear progress and non-blocking context            | Catalog, price, stock, promo, destination, shipping | Stale amount treated as final                  |
| `CORRECTION_REQUIRED` | What changed + corrective options                  | Definitive validation response                      | Silent charge, auto swap or auto increase      |
| `READY_TO_CONFIRM`    | Exact final amount, applicable terms and CTA       | Authoritative eligible checkout snapshot            | Client-only amount as authority                |
| `SUBMITTING`          | Idempotent single-intent feedback                  | Governing server command boundary                   | Repeated clicks create extra order/payment     |
| `OUTCOME_UNKNOWN`     | "Status belum dapat dipastikan" and safe next step | Reconciliation pending                              | False success or failure; blind new payment    |
| `AWAITING_PAYMENT`    | Correct action and expiry if known                 | Verified provider/payment session                   | "Paid" label                                   |
| `PAYMENT_PENDING`     | Awaiting trusted confirmation                      | Reconciled canonical/pending evidence               | "Order paid" assumption                        |
| `PAYMENT_CONFIRMED`   | Verified confirmed outcome                         | Authoritative financial source                      | Treat mere redirect as financial success       |
| `CANNOT_PROCEED`      | Clear retry/assistance route                       | Documented payment/offer/identity blocker           | Lossy repeated submission or fabricated amount |

Detailed MGBOS order/payment states, financial effect, authorization rules, transaction isolation and retry semantics are retained by existing MGBOS architecture and a future approved checkout implementation contract.

### 11.2 Proposed steps

1. **Review items** — selected variants, quantities, price context and item-level constraints.
2. **Identify recipient** — guest/account in supported scope, minimal consent and secure contact.
3. **Fulfillment** — destination, grounded shipping option, applicable processing expectations.
4. **Review final terms** — item totals, discounts, applicable fees/tax, final payable, policy links and estimated vs confirmed language.
5. **One deliberate order/payment action** — clear CTA; governed server session/intent.
6. **Verification screen** — pending/confirmed/failed/unknown handled according to actual trusted state, with stable reference as available.

Step count/visual format (one-page vs progressive steps) is a CX-03 usability choice, not a backend mandate. Avoid re-asking the same data without cause; avoid hiding consent/total review to reduce clicks artificially.

### 11.3 Confirmation moment and terms

Final review MUST disclose total and materially relevant terms immediately before a binding customer action. If shipment/tax/stock/risk cannot be validated, disabled/complementary assistance is more honest than acceptance with an unknowable total. An order **can exist before confirmed payment** under approved MGBOS semantics; display "order received" and "payment confirmed" independently. Exact order-creation timing remains an architecture decision.

### 11.4 Double-click, refresh and expired sessions

A customer's repeated click, browser reconnect, external return, or legitimate retry must not cause duplicate canonical orders or financial effects. The UX must show a stable permitted way to reconcile uncertain outcomes rather than blindly inviting payment again. The client is not trusted to invent idempotency from an ephemeral button lock alone: back-end exact semantics and error classification must be independently assured.

## 12. Payment and post-payment trust boundaries

### 12.1 Payment result truth table

| Observed event                                              | What customer may be told                                         | What customer must NOT be told                           |
| ----------------------------------------------------------- | ----------------------------------------------------------------- | -------------------------------------------------------- |
| Initiated redirect/QR/VA/invoice flow                       | Payment instructions created if provider confirms                 | Payment received                                         |
| Browser arrives with `success=true`                         | Verification ongoing unless trusted financial state supports more | Payment confirmed                                        |
| Provider processing/pending                                 | Awaiting confirmation; check back/receive approved updates        | Order guaranteed paid                                    |
| Webhook arrives but verification/integration not reconciled | Pending/under verification                                        | Canonical ledger updated by webpage event alone          |
| Trusted MGBOS financial event confirms accepted amount      | Payment confirmed for appropriate transaction/order               | Other order or wrong amount confirmed                    |
| Provider decline/cancel                                     | Attempt failed/canceled if definitively known                     | Whole order automatically canceled unless policy says so |
| Callback lost, state unknown                                | Outcome not yet confirmed; safe support/reconciliation            | Definitive success or definitive failed charge           |
| Already-paid order revisited                                | Verified current status and receipt                               | Invite duplicate charge without policy                   |

This table describes **UX truth labels**. It does not authorize calling a provider-specific endpoint, crediting cash or modifying ledger state.

### 12.2 Financial assurance non-negotiables

- No money movement, payment capture, allocations, fees, refunds or financial effects from raw client fields.
- Exact source IDs, provider event IDs, amount/currency/order binding and replay guarantees require engineering/financial architecture review.
- Any payment that cannot be reconciled against supported authoritative evidence remains pending/unknown; it may require a well-documented human investigation without accidental second capture.
- Redirect query parameters, screenshots, email receipts, customer claims or AI narration are not authoritative for a paid state.
- Payment/cancellation/refund business policy must be disclosed when material but remains owned by Finance/Returns, not CX-04.
- Pending-paid/part-paid/on-account scenarios must use existing approved payment and commerce rules, not one boolean `paid` field chosen by frontend convenience.

### 12.3 Payment support and retry

Customer should see action depending on definitively observed error: fix input, retry via approved mechanism, choose supported method, wait for confirmation or contact support with a stable reference. Where the prior provider attempt may have captured money, do not start another charge without reconciliation or safely supported attempt orchestration. Recovery paths must remain useful on mobile browser return from provider app.

## 13. Confirmation, support and after-sales handoff

- Receipt includes valid human-readable order/reference, summary of agreed sellable items, method/status of payment where supported, relevant delivery expectations and help path.
- Avoid exposing internal master IDs, financial ledger details, third-party partner prices or sensitive data in shared links.
- Confirmation screen, transactional notification and account view should use the same trusted projection, even when channels deliver at different times.
- Do not say packed/shipped/delivered before physical/third-party evidence. A label/tracking ID alone is insufficient.
- Customers need a clear way to contest incorrect item, address, accidental duplicate or delay. CX-06/customer service owns service-case lifecycle; CX-04 only supplies relevant purchase context and honest next steps.
- Cancellation/return/refund eligibility is policy-specific; request receipt is not approval and approval is not payout verification.
- Reorder may use prior cart as convenience, but must refresh prices, stock, terms, address and authorization before accepting a new purchase.

## 14. External provider and omnichannel boundary

The Website is not an alternative source of truth, and external marketplace receipts are not local retail checkouts. The customer channel determines which merchant promises, settlement and communications rules apply. Preserve source channel and external identifiers, normalize only through approved channel adapter, and reconcile provider-specific status to MGBOS business state without overwriting their authority. CX-07 must verify each provider's API eligibility, webhook/retry characteristics, settlement, privacy and communication rules against actual credentials/contract. Do not assert Shopee/TikTok/other providers are already connected.

**Cross-channel consistency objective:** One customer's eligible order produces one governed operational unit after valid normalization, not one per message, webhook, screen refresh, AI agent or staff spreadsheet.

## 15. Accessibility, responsive design and performance

### 15.1 Responsive behavior

- On small mobile screens, show primary purchase action and most important product/price/status information without losing the legal/material review step.
- Product option controls have readable labels, sufficient touch targets and clear availability beyond color alone.
- Sticky bottom actions must not obscure focused inputs, notices, provider controls, consent or checkout totals; respect safe areas, virtual keyboard and zoom.
- Screen-reader users must hear selected variants, cart total changes and validation/payment state changes in an intentional and non-spammy manner.
- Browser back navigation should preserve safe user input when appropriate and revalidate stale price/stock on return.
- Payment-provider handoff should not trap keyboard focus or create inaccessible dead-end if third-party UI fails.

### 15.2 Experience quality gates

Proposed quality objectives inherited from CX-01/CX-03 and finalized by CX-08:

| Dimension         | Required intent                                                                                                       | Verification condition                                                                              |
| ----------------- | --------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| Core Web Vitals   | Good user-experience thresholds as proposed by CX-03: LCP ≤2.5 s, INP ≤200 ms, CLS ≤0.1 at p75 field where measurable | Properly segmented real-user cohort, devices and period; no assumed current PASS                    |
| Accessibility     | Target WCAG 2.2 AA for controlled customer surface                                                                    | Automated checks + manual keyboard/screen reader/mobile QA; external provider exceptions documented |
| Visual trust      | Label estimated, unavailable, pending, accepted and confirmed differently                                             | Cross-screen language consistency and source reconciliation                                         |
| Feature isolation | Heavy optional configurator/AI/video does not slow normal product purchase                                            | Critical route bundle/media/network and lab + RUM instrumentation                                   |
| Resilience        | Functional fallback for transient API/provider failure                                                                | Controlled fault injection and user journey replay                                                  |
| Privacy           | Order/identity/contact details scoped and minimally disclosed                                                         | Independent authz/negative testing, retention/consent review                                        |

No specific device benchmark, conversion uplift or full transfer budget is asserted from unmeasured baseline. UI/UX quality is independently verifiable; it is not a substitute for payment/database assurance.

## 16. Analytics, observability and economic responsibility

### 16.1 Proposed customer events (conceptual, non-authoritative)

| Event family                | Minimum safe observations                                         | Do not collect or infer                                                  |
| --------------------------- | ----------------------------------------------------------------- | ------------------------------------------------------------------------ |
| Catalog view/search         | Query category/outcome, rendered state, time, filter context      | Sensitive raw personal queries beyond approved retention                 |
| PDP/variant interaction     | Product/variant public context, selection failure, help usage     | Confidential supplier economics                                          |
| Cart mutation               | Accepted/rejected edit, reason, aggregate count                   | Sensitive customer/cart session tokens                                   |
| Checkout entry/revalidation | Step, validation outcome, recovery route                          | Full card details or secret provider credentials                         |
| Payment experience          | Safe correlation/status code, latency, unresolved count           | Bank account credentials, raw payment secrets, private financial history |
| Order receipt               | Accepted order reference class, channel, delivery of confirmation | Raw personally identifying order details in general analytics            |
| Support handoff             | Reason class, case created, link to authoritative context         | Complaint text/attachments without appropriate privacy controls          |

Detailed event schema, retention and consent are owned by privacy/security/analytics architecture; CX-04 does not demand client-visible leaked IDs. Internal monitoring must distinguish **business failures**, **provider failures**, **UX failures** and **genuine successful checkout**.

### 16.2 Founder-burden measures

Measure separately: manual re-entry of retail orders; payment screenshot triage; customer follow-ups caused by unclear status; packing/label preparation effort; physical QC/packing/courier tasks; cancellations/refunds due to avoidable checkout misunderstanding; actual provider/automation operating cost per completed eligible order. Do not count real physical actions as automated merely because a checkbox was clicked.

### 16.3 Quality vs conversion

A higher conversion rate achieved by suppressing disclosures or accepting orders without reliable supply is not product success. Evaluations should balance completion rate, customer confusion, payment reconciliation, avoidable support, returns, contribution margin and founder effort. Targets require an observed baseline and comparable cohorts.

## 17. Detailed proposed functional requirement inventory — `CX4-FR-001..042`

**Reading rule:** Each `CX4-FR` specifies proposed _customer-observable outcomes_ that refine an existing CX-01 `CX1-FR`. A lower-level specification must not create new authoritative financial or inventory state. `P0`, `P1`, `P2` are priorities **within the proposed customer product**, not blanket permission to develop/ship. `FR trace` is the CX-01 namespace; split references like `020/027` mean `CX1-FR-020` and `CX1-FR-027`.

### 17.1 Public discovery and PDP

| Requirement ID | Stage | Required product behavior                                                                                    | Measurable exit/negative condition                                                | CX-01 trace   |
| -------------- | ----- | ------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------- | ------------- |
| `CX4-FR-001`   | P0    | Surface customer jobs and real available Shop/Custom/Business routes without suggesting nonexistent checkout | P0 website user can find valid assisted route; buy CTA absent/clearly unavailable | `001/002/003` |
| `CX4-FR-002`   | P0    | Present approved product/service information with truthful availability/price qualifiers                     | No hypothetical inventory, date, coupon or sale price displayed as active         | `002/004`     |
| `CX4-FR-003`   | P1    | Search published sellable assortment using ordinary customer terms                                           | Only authorized published results returned; retrieval failure ≠ empty match       | `006/020`     |
| `CX4-FR-004`   | P1    | Provide controlled product filters and transparent sorting                                                   | Selected filters visible/removable; result state and sort semantics deterministic | `006`         |
| `CX4-FR-005`   | P1    | Render trustworthy PDP with material, size, fit, variant, price basis, mode and expected steps               | Customer can identify current option and its limitation before purchase           | `007/020/027` |
| `CX4-FR-006`   | P1    | Validate availability and SKU option for chosen variant                                                      | Unpublished/ineligible combination rejected before cart acceptance                | `020/026/027` |
| `CX4-FR-007`   | P1    | Show applicable ready-stock/MTO/preorder distinctions                                                        | User cannot infer immediate delivery of an MTO or future preorder                 | `007/027`     |
| `CX4-FR-008`   | P1    | Make image, size guide and key product information accessible without mandatory video/3D/AI                  | Critical facts available with assistive technology and media failure              | `005/007`     |
| `CX4-FR-009`   | P1    | Offer clear unavailable/sold-out/unconfirmed product states and next permitted action                        | No purchase enabled on a definitive invalid or unknown item                       | `002/026/027` |
| `CX4-FR-010`   | P2    | Add optional recommendations/merchandising enhancements without displacing ordinary discovery                | Conventional browse/search remains usable when personalization disabled           | `008/028`     |

### 17.2 Cart, pricing and offer eligibility

| Requirement ID | Stage | Required product behavior                                                                  | Measurable exit/negative condition                                                | CX-01 trace   |
| -------------- | ----- | ------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------- | ------------- |
| `CX4-FR-011`   | P1    | Add only authorized eligible variant/quantity to cart, with accepted/rejected feedback     | Invalid SKU, quantity, price context or retired listing cannot pass               | `020/021`     |
| `CX4-FR-012`   | P1    | Support review/edit/remove and meaningful empty cart                                       | Updated item and amount shown without unintended side effects                     | `021`         |
| `CX4-FR-013`   | P1    | Recalculate provisional totals and reveal changes before customer commitment               | Stale total, removed promotion or changed variant never charged silently          | `021/023/026` |
| `CX4-FR-014`   | P1    | Explain cart vs inventory reservation accurately                                           | Cart-added success never claims reserved inventory by default                     | `021/026/027` |
| `CX4-FR-015`   | P1    | Provide approved promotion application and honest rejection feedback when promotions exist | Expired/invalid discount removed; accepted total source-grounded                  | `023/028`     |
| `CX4-FR-016`   | P1    | Require deliberate reconfirmation on materially changed commercial terms                   | No automated acceptance of greater price, variant substitution or shipping change | `023/026`     |
| `CX4-FR-017`   | P1    | Distinguish cart data unavailable/expired from genuinely empty                             | Customer can retry or safely rebuild without false no-items claim                 | `021/040`     |

### 17.3 Checkout, delivery and payment

| Requirement ID | Stage | Required product behavior                                                                               | Measurable exit/negative condition                                             | CX-01 trace       |
| -------------- | ----- | ------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ | ----------------- |
| `CX4-FR-018`   | P1    | Offer guest checkout for ordinary eligible consumer retail when approved                                | Account requirement not silently introduced; private lookup still protected    | `022`             |
| `CX4-FR-019`   | P1    | Collect minimum legitimate recipient/contact/delivery inputs with inline correction                     | Invalid fields identified; good inputs preserved on safe retry                 | `022/023`         |
| `CX4-FR-020`   | P1    | Present eligible shipping option/cost/estimate from grounded rules/provider                             | No invented carrier availability, fee, schedule or promised arrival            | `023/027`         |
| `CX4-FR-021`   | P1    | Revalidate item, quantity, price, promotion, availability, address, fees and shipping before commitment | Cannot submit when critical value unknown or materially mismatched             | `023/026`         |
| `CX4-FR-022`   | P1    | Show exact reviewed payable amount and material terms immediately before binding action                 | No undisclosed mandatory charge or false "all-inclusive" price                 | `023`             |
| `CX4-FR-023`   | P1    | Initiate one governed payment/order intent and expose safe in-progress response                         | Double click/refresh cannot create duplicate effect                            | `024/025`         |
| `CX4-FR-024`   | P1    | Differentiate payment not-started, action-needed, pending, confirmed, declined and uncertain            | Redirect/browser flag alone cannot render confirmed paid                       | `024`             |
| `CX4-FR-025`   | P1    | Reconcile unknown outcome through approved trusted path before permitting another charge                | Unknown status does not encourage unsafe blind re-payment                      | `024/025/040`     |
| `CX4-FR-026`   | P1    | Provide stable accepted order/receipt reference with accurate order-vs-payment meaning                  | Order accepted does not imply paid or shipped                                  | `025`             |
| `CX4-FR-027`   | P1    | Preserve safe review/recovery path after session interruption or provider failure                       | Sensitive data not exposed; stale terms revalidated                            | `021/024/025/040` |
| `CX4-FR-028`   | P1    | Explain unsupported destination/fulfillment or changed rate and allow correction/help                   | No payment under false shipping promise                                        | `023/026/027`     |
| `CX4-FR-029`   | P1    | Securely scope order confirmation and retrieval                                                         | Guessable IDs or cross-organization/customer reads rejected without disclosure | `022/025/030`     |

### 17.4 Operations, channels and progressive capabilities

| Requirement ID | Stage | Required product behavior                                                                                       | Measurable exit/negative condition                                                           | CX-01 trace   |
| -------------- | ----- | --------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- | ------------- |
| `CX4-FR-030`   | P1    | Derive meaningful customer order status from actual governed order/payment/fulfillment evidence                 | No "shipped" on label-only; no "paid" on user screenshot                                     | `025/031/042` |
| `CX4-FR-031`   | P1    | Provide scoped support path related to purchase and order                                                       | Customer/support staff can find authorized context without copying private data unsafely     | `031/032/044` |
| `CX4-FR-032`   | P1    | Honor existing cancellation/return/refund eligibility and show request vs approval separately                   | Initiating request does not claim refund granted/paid                                        | `032/033`     |
| `CX4-FR-033`   | P1    | Maintain coherent offer, order and fulfillment language for a valid imported marketplace order                  | Platform-specific status/terms are not replaced with own-site guarantees                     | `041/042`     |
| `CX4-FR-034`   | P1    | Separate external-channel duplicate/unknown integration outcome from customer purchase state                    | Repeated webhook/order does not become multiple canonical orders                             | `041/040`     |
| `CX4-FR-035`   | P1    | Prepare accepted retail-order operational context (SKU, qty, recipient, next action) for governed internal work | No founder manual transcription of accepted structured order necessary                       | `038/039/044` |
| `CX4-FR-036`   | P1    | Produce approved customer-facing notifications from trusted transaction states, when enabled                    | Notification failure doesn't falsify business state or claim delivery                        | `042`         |
| `CX4-FR-037`   | P1    | Provide non-AI checkout fallback if optional assistant/service unavailable                                      | Ordinary eligible purchase remains usable without AI provider                                | `040/043`     |
| `CX4-FR-038`   | P2    | Add authorized reorder/cart reuse under current pricing/stock/eligibility rules                                 | Previous order is never recharged or cloned without reconfirmation                           | `035`         |
| `CX4-FR-039`   | P2    | Provide approved advanced bundles/personalization without hiding financial terms                                | Effective discount and conditions reproducible and deterministic                             | `008/028`     |
| `CX4-FR-040`   | P2    | Add gated preorder/waitlist product experiences where policy and fulfillment readiness justify                  | No preorder acceptance without approved lead-time, prepayment/refund and communication rules | `027/028`     |
| `CX4-FR-041`   | P2    | Allow multichannel price/listing/stock presentation when adapter and reconciliation are verified                | No silent stock drift or customer promise contradiction                                      | `041/042`     |
| `CX4-FR-042`   | P2    | Provide compliant optional AI choice guidance without direct monetary authority                                 | Wrong recommendation never changes confirmed SKU, price, order or payment                    | `008/043`     |

## 18. Cross-cutting proposed business-and-interface rules — `CX4-BR-001..022`

These rules **derive or constrain customer UI** and are not replacements for TeeStock Finance, Inventory, Payment or MGBOS invariants. Any source discrepancy triggers `OPEN_DECISION` rather than quiet reinterpretation.

| ID           | Proposed rule                                                                                      | Governing owner / source boundary                |
| ------------ | -------------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| `CX4-BR-001` | Public "buy" exists only for fully approved eligible offers; assisted inquiry must remain truthful | Commerce publication + CX-01                     |
| `CX4-BR-002` | `P0` may be premium without any operational direct checkout                                        | Solo-Founder Roadmap, TeeStock operational pilot |
| `CX4-BR-003` | Catalog/customer-facing taxonomy hides internal organizational complexity                          | Website IA `TS-TEC-002`                          |
| `CX4-BR-004` | Product variants cannot be silently substituted when out of stock or invalid                       | Commerce product/configuration + inventory       |
| `CX4-BR-005` | Item availability cannot be inferred solely from cached product card/cart                          | Inventory/capacity authority                     |
| `CX4-BR-006` | Cart acceptance does not itself promise physical stock reservation                                 | Inventory reservation policy                     |
| `CX4-BR-007` | An MTO/preorder label must disclose applicable production/campaign expectation                     | Approved merchandise/fulfillment policy          |
| `CX4-BR-008` | Catalog/cart displayed prices are distinct from reviewed binding checkout terms                    | Pricing framework + order/payment source         |
| `CX4-BR-009` | Material price, fee, method, quantity or item changes need explicit reconfirmation                 | Customer commercial fairness + payment policy    |
| `CX4-BR-010` | A promotional badge or code never grants discount outside approved price policy                    | Finance/commercial owner                         |
| `CX4-BR-011` | Taxes/shipping/rush fees must be applicable and verifiable, not invented                           | Finance/tax/shipping authority                   |
| `CX4-BR-012` | Requested delivery timing is not a committed service-level promise                                 | Production/fulfillment policy                    |
| `CX4-BR-013` | Browser payment success redirect is not payment confirmation                                       | Governed MGBOS payment/ledger source             |
| `CX4-BR-014` | Order receipt, payment confirmed, production started and shipped are distinct concepts             | MGBOS lifecycle and physical evidence            |
| `CX4-BR-015` | Replaying customer command/provider event cannot multiply accepted commercial or financial effects | MGBOS transaction/idempotency invariants         |
| `CX4-BR-016` | Unknown outcome must remain unknown until trusted reconciliation; do not default to failed/success | MGBOS payment/order authority                    |
| `CX4-BR-017` | Guest/customer and organization data are scoped by server authority, not shareable URL alone       | Identity/authorization model                     |
| `CX4-BR-018` | Automatic receipt/notification does not create a financial or fulfillment event                    | Notification and business authority separation   |
| `CX4-BR-019` | Customer support/returns requests do not automatically authorize refund or order cancellation      | Customer service/returns/finance policies        |
| `CX4-BR-020` | External marketplace terms/source identifiers remain inspectable and reconciled appropriately      | Commerce channels + CX-07                        |
| `CX4-BR-021` | AI can assist explanation, never decide authoritative payment/price/refund/stock truth             | JARVIS/MGBOS boundaries                          |
| `CX4-BR-022` | Customer UX quality and founder workload reduction must be both measured                           | CX-01/CX-02 and Solo-Founder Operating Model     |

## 19. Acceptance scenarios — `CX4-AC-001..038`

**All cases below: PROPOSED / NOT_EXECUTED.** Exact fixture identity, test dataset, hosted CI, independent review, real provider sandbox and live-pilot scope are separate gates. Each accepted scenario requires **expected vs actual**, environment, exact revision, actor identity, evidence URL/artifact, cleanup, and residuals. UI test passing alone cannot certify money/stock effects.

### 19.1 P0 discovery and honest assisted commerce

| ID           | Given / When / Then                                                                                                                                     | Evidence class           | FR trace  |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------ | --------- |
| `CX4-AC-001` | Given current P0 site without retail checkout, when customer visits Shop-related path, then they are not falsely offered a functioning instant purchase | UX + route/source audit  | `001/002` |
| `CX4-AC-002` | Given real Custom/B2B need, when selecting public path, then customer reaches approved assisted intake instead of fake cart                             | Customer journey/browser | `001/002` |
| `CX4-AC-003` | Given unknown product lead time, when display renders, then time is labeled unconfirmed rather than a guaranteed dispatch date                          | Copy/content policy      | `002`     |
| `CX4-AC-004` | Given public mobile/keyboard user, when browsing available P0 information, then key facts and contact are usable without video/AI                       | Mobile accessibility     | `001/002` |

### 19.2 P1 discovery, variants and availability

| ID           | Given / When / Then                                                                                                       | Evidence class           | FR trace  |
| ------------ | ------------------------------------------------------------------------------------------------------------------------- | ------------------------ | --------- |
| `CX4-AC-005` | Given draft/retired SKU, when search or listing renders, then item is not buyable or exposed outside approved preview     | Server-authz + content   | `003/006` |
| `CX4-AC-006` | Given no matching products, when filters apply, then empty-result guidance appears, not server-error message              | UI + search fixture      | `003/004` |
| `CX4-AC-007` | Given catalog service outage, when search runs, then unavailable/retry state appears, not zero matches                    | Fault injection          | `003/004` |
| `CX4-AC-008` | Given variant with different price/stock, when selection changes, then accurate change communicated with accessible label | Browser + domain         | `005/006` |
| `CX4-AC-009` | Given invalid size/color/variant combination, when add is attempted, then action denied without substitute SKU            | UI + server negative     | `006/011` |
| `CX4-AC-010` | Given MTO offer, when PDP viewed, then mode and processing expectation are distinguished from ready stock                 | Content + policy         | `007`     |
| `CX4-AC-011` | Given out-of-stock product, when customer seeks purchase, then only approved alternatives shown; no hidden backorder      | Inventory + UX           | `007/009` |
| `CX4-AC-012` | Given product gallery script failure, when PDP viewed, then essential material/fit/size/price facts remain available      | No-media / accessibility | `008`     |

### 19.3 P1 cart and price reconciliation

| ID           | Given / When / Then                                                                                                            | Evidence class               | FR trace      |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------ | ---------------------------- | ------------- |
| `CX4-AC-013` | Given eligible SKU/qty, when add succeeds, then cart shows correct item/variant/quantity but **not** false reservation         | Unit + integration + browser | `011/014`     |
| `CX4-AC-014` | Given quantity exceeds permitted limit, when user edits cart, then valid last state remains and reason is clear                | Negative cart test           | `011/012`     |
| `CX4-AC-015` | Given eligible cart and price-book change, when checkout starts, then changed amount displayed and must be reconfirmed         | Catalog pricing + UX         | `013/016`     |
| `CX4-AC-016` | Given coupon expires, when total refreshes, then discount removed and old total cannot be charged                              | Promotion negative           | `013/015`     |
| `CX4-AC-017` | Given sold-out item in saved cart, when checkout revalidates, then item can't be purchased and corrective choices appear       | Inventory concurrency        | `006/016`     |
| `CX4-AC-018` | Given cart fetch times out, when page renders, then uncertainty/retry shown, not an empty cart                                 | Fault injection              | `017`         |
| `CX4-AC-019` | Given two buyers choose final unit, when purchase attempts race, then stock/order rules prevent inconsistent accepted purchase | Concurrency E2E + UI         | `006/014/021` |

### 19.4 P1 checkout, shipping and payment

| ID           | Given / When / Then                                                                                                                     | Evidence class                    | FR trace      |
| ------------ | --------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------- | ------------- |
| `CX4-AC-020` | Given approved guest buyer, when eligible checkout begins, then forced signup not required and private data protected                   | Browser + independent authz       | `018/029`     |
| `CX4-AC-021` | Given incomplete/invalid recipient address, when continuing, then field-specific correction preserves valid input                       | Accessibility + validation        | `019`         |
| `CX4-AC-022` | Given delivery area unsupported, when option requested, then no invented carrier/time/fee offered                                       | Logistics negative                | `020/028`     |
| `CX4-AC-023` | Given eligible checkout, when final review appears, then exact source-grounded payable amount and material terms shown                  | Financial pricing E2E             | `021/022`     |
| `CX4-AC-024` | Given fee or shipping rate changes after review, when confirm clicked, then revised amount requires explicit acceptance                 | UI/transaction negative           | `016/020/021` |
| `CX4-AC-025` | Given customer double-clicks purchase, when backend completes, then at most one accepted intended commercial effect produced            | Transaction idempotency + browser | `023`         |
| `CX4-AC-026` | Given browser returns with success query but source still pending, when result loads, then status is pending/unknown, never paid        | Payment status E2E                | `024`         |
| `CX4-AC-027` | Given provider confirmation delayed, when customer refreshes, then no automatic second charge is encouraged                             | Replay/UX recovery                | `025/027`     |
| `CX4-AC-028` | Given trusted verified financial state, when receipt loads, then current payment and order reference match intended order/amount        | Financial reconciliation          | `024/026`     |
| `CX4-AC-029` | Given provider may have charged but callback missing, when retry requested, then reconciliation or approved safe retry strategy applies | Provider failure E2E              | `025/027`     |
| `CX4-AC-030` | Given expired checkout session, when user resumes, then values are revalidated and sensitive data is not leaked                         | Session security + UX             | `027/029`     |
| `CX4-AC-031` | Given unauthorized guest/organization request, when private order URL guessed, then no private record or existence clue disclosed       | Independent security/negative     | `029`         |

### 19.5 P1 operations, marketplace and post-order

| ID           | Given / When / Then                                                                                                                    | Evidence class            | FR trace  |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------------- | ------------------------- | --------- |
| `CX4-AC-032` | Given valid order but no carrier acceptance, when tracking viewed, then "shipped" not displayed from label alone                       | Fulfillment + UI evidence | `030`     |
| `CX4-AC-033` | Given return requested, when receipt shown, then refund/cancellation approval or payout is not claimed                                 | Returns + UX              | `032`     |
| `CX4-AC-034` | Given repeated imported marketplace event, when normalized, then one canonical order/result and coherent status remains                | Channel idempotency E2E   | `033/034` |
| `CX4-AC-035` | Given accepted retail purchase, when founder processes order, then SKU, quantity and recipient are available without copying from chat | Operator walkthrough      | `035`     |
| `CX4-AC-036` | Given notification service down, when order accepted, then order/financial truth unchanged and delivery failure separately trackable   | Event/notification test   | `036`     |

### 19.6 P2 progressive capability and negative quality

| ID           | Given / When / Then                                                                                                                      | Evidence class            | FR trace      |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------- | ------------------------- | ------------- |
| `CX4-AC-037` | Given advanced recommendations or AI unavailable, when normal P1 retail path used, then core purchase remains usable/performance bounded | Feature-off + performance | `010/037/042` |
| `CX4-AC-038` | Given previous order, when using reorder, then current price, variant, inventory, shipping and conditions require reconfirmation         | E2E and negative          | `038`         |

### 19.7 Required evidence matrix per accepted P1 slice

| Assurance lane   | Required evidence (not claimed complete)                                                             | Independent owner             |
| ---------------- | ---------------------------------------------------------------------------------------------------- | ----------------------------- |
| Product UX       | Representative mobile/desktop tasks, comprehension, state errors, responsive and keyboard navigation | Product/UX reviewer           |
| Accessibility    | Automated scans plus manual critical flows, focus, labels, alt states and third-party handoff        | Accessibility QA              |
| Pricing/catalog  | Variant/offer truth, promotions, totals, stale/revalidation scenarios                                | Commerce + financial reviewer |
| Inventory        | ATS/source, reservation, race/oversell and compensated failure tests                                 | Backend/database reviewer     |
| Payments         | Provider sandbox, callback/replay, pending/partial/verified and wrong-order tests                    | R5 financial/security QA      |
| Identity/privacy | Guest ownership, cross-actor, cross-org, token/URL leakage and consent                               | Security QA                   |
| Fulfillment      | Carrier/provider state, label-vs-handoff, status projection and recovery                             | Operations + integration QA   |
| Performance      | Page-template lab runs and qualifying real-user reports as available                                 | Performance QA                |
| Reliability      | Outage/retry/unknown effects and disaster recovery scope                                             | Engineering reliability       |
| Founder burden   | Manual-touch baseline/after, exception load and provider cost                                        | Owner/operations product lead |

**Test fixtures:** Use disposable/synthetic isolated environments for destructive or financial-effect test scenarios as authorized by the separate engineering contract. Do not use existing uncontrolled databases or live money for convenience. Exact environment identity and allowed reset semantics must be proven before execution.

## 20. Product unknowns and owner decisions — `CX4-DEC-01..015`

No item in this section is a disguised Owner approval. Each item is a decision **candidate** with safe interim treatment. Research/architecture questions belong to relevant owners; choices that alter price, customer promise, capital or brand are escalated to Owner.

| ID           | Decision / unknown                                                             | Recommended direction                                                              | Decision authority                | Until resolved                                        |
| ------------ | ------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------- | --------------------------------- | ----------------------------------------------------- |
| `CX4-DEC-01` | Which P1 retail assortment is first truly sellable?                            | Curated small proven SKU set, avoid entire catalog at launch                       | TeeStock Owner + commerce         | P0 product/service information only                   |
| `CX4-DEC-02` | Is guest checkout available on first P1 retail release?                        | Prefer yes for ordinary retail, after security/payment proof                       | Product Owner + identity/security | No forced unapproved login; P1 blocked until accepted |
| `CX4-DEC-03` | Which payment provider/methods are supported?                                  | Select only after cost, settlement, callback and R5 integrity review               | Finance/Owner + Head Engineering  | No live payment claim                                 |
| `CX4-DEC-04` | When does retail Order become authoritative relative to payment?               | Follow existing MGBOS and approved commerce transaction policy                     | MGBOS Architecture / Finance      | No new state/action invented by frontend              |
| `CX4-DEC-05` | What is reservation point and expiry for ready stock?                          | Explicit checkout/inventory policy with race assurance                             | Inventory/MGBOS architecture      | Cart never claims reservation                         |
| `CX4-DEC-06` | Are MTO standardized products eligible for instant payment?                    | Only after stable recipe, cost, supply and truthful lead time                      | Owner + production/pricing        | Assisted inquiry until eligibility proven             |
| `CX4-DEC-07` | Are preorders enabled at initial ecommerce release?                            | Default defer absent approved campaign/return terms                                | Owner + Finance/Operations        | No preorder transaction                               |
| `CX4-DEC-08` | Exact taxes and fee disclosure policy?                                         | Tax/legal/accounting review per actual business entity and provider                | Finance/Legal + Owner             | No assumed tax/fee rates or labels                    |
| `CX4-DEC-09` | Which shipping area/options promise can be offered?                            | Begin only with verified serviceable regions and honest estimates                  | Operations/Logistics + Owner      | No unsupported ETA or delivery option                 |
| `CX4-DEC-10` | Allowed coupon, bundle, loyalty and free-shipping policy?                      | Simple deterministic promotions if demonstrated useful                             | Commercial/Finance + Owner        | Optional disabled instead of phantom discounts        |
| `CX4-DEC-11` | Cart persistence and guest-to-account linking?                                 | Minimal scoped support; advanced merge deferred                                    | Product + identity/security       | Avoid cross-actor/cart leakage                        |
| `CX4-DEC-12` | What cancellation, MTO and preorder return rights are displayed?               | Reuse approved policy after legal review                                           | Legal/Finance/Customer Service    | No broad unsupported "all refundable" promise         |
| `CX4-DEC-13` | Which first marketplace integration is economically viable and authorized?     | Manual/semi-manual first; verify provider access/volume                            | Owner + CX-07 integrator          | No implied enabled API or order sync                  |
| `CX4-DEC-14` | What lab budgets and real-user performance baselines apply to each template?   | CX-08 + Head Engineering empirical budget proposal                                 | Head Engineering + Performance QA | Targets are proposed, not PASS                        |
| `CX4-DEC-15` | How to use payment failure/unknown notifications without overwhelming founder? | Human only for unreconciled material exceptions; deterministic retry when governed | Owner + Founder Control / Finance | No AI auto-approve, blind retries or spamming         |

### 20.1 Decision packet format

To resolve any ID, provide: exact canonical source, options with constraints, cost to operate, effect on customer effort, effect on founder hours, payment/security/legal exposure, vendor/provider assumptions, fallback behavior, owner of choice, approval record, revision, and downstream acceptance/test updates. Decisions that materially change the parent CX-01 promise must be reconciled there before CX-04 can be activated.

## 21. Key risks and mitigations — `CX4-RISK-01..013`

| ID            | Priority | Risk                                                                | Customer/founder consequence                       | Minimum mitigation                                                           |
| ------------- | -------- | ------------------------------------------------------------------- | -------------------------------------------------- | ---------------------------------------------------------------------------- |
| `CX4-RISK-01` | Critical | Fake storefront availability or inactive checkout CTA               | Broken trust, stranded intent                      | Server-grounded sellability + active-route validation                        |
| `CX4-RISK-02` | Critical | Duplicate payment or order on refresh/retry/webhook                 | Financial loss, disputes, reconciliation burden    | Governed idempotency, financial replay and reconciliation QA                 |
| `CX4-RISK-03` | Critical | Cross-customer/order access through guest URL                       | Data breach and trust damage                       | Scoped identity, server authz, negative/cross-org tests                      |
| `CX4-RISK-04` | High     | Stale inventory/price data                                          | Overselling, unfulfillable orders, surprise totals | Authoritative revalidation and customer reconfirmation                       |
| `CX4-RISK-05` | High     | UI reports money paid from unverified provider redirect             | Wrong fulfillment/CS, hidden bad debt              | Distinct payment projection and trusted proof                                |
| `CX4-RISK-06` | High     | Tax/discount/shipping computed with UI defaults                     | Under/overcharge and legal/commercial conflict     | Approved policy and deterministic source-of-truth totals                     |
| `CX4-RISK-07` | High     | MTO/preorder sold without reliable time/terms                       | Delays, refunds, capacity strain                   | Product eligibility gates, transparent terms, controlled disable             |
| `CX4-RISK-08` | High     | Marketplace oversell/duplicate ingest                               | Channel penalties, stock and ledger mismatch       | Exact external IDs, buffers and reconciliation via CX-07                     |
| `CX4-RISK-09` | High     | Heavy visuals/scripts harm low-end mobile                           | Low completion and support load                    | CX-03/CX-08 performance gates and progressive media                          |
| `CX4-RISK-10` | High     | Inaccessible form/provider handoff                                  | Customers unable to finish                         | WCAG target + manual assisted alternative + provider evaluation              |
| `CX4-RISK-11` | Medium   | Excessive forced account, required fields and popups                | Checkout abandonment                               | Progressive disclosure, guest preference and user testing                    |
| `CX4-RISK-12` | High     | Customer portal, case, cart create overlapping business authorities | Drift, future costly rewrites                      | Canonical owner mapping + architecture impact review                         |
| `CX4-RISK-13` | High     | Checkout shifts work to founder instead of removing it              | Burnout and admin overhead                         | Manual-touch measurement, exception-only routing, no redundant transcription |

`Critical/High/Medium` here denote product risk prioritization only. They are **not replacements** for BisnisHub canonical engineering risk classification (R0–R5). Payment/security-specific risk must be independently assigned by authorized engineering governance.

## 22. Downstream dependency and non-duplication matrix

| Source/program                                         | Owns                                                                         | CX-04 contributes                                 | Must NOT do                                    |
| ------------------------------------------------------ | ---------------------------------------------------------------------------- | ------------------------------------------------- | ---------------------------------------------- |
| `TS-TEC-001` TeeStock Digital Product Vision           | Cross-surface digital business ambition                                      | Retail journey execution details                  | Rewrite TeeStock long-term strategy            |
| `TS-TEC-002` Website IA                                | Information hierarchy / customer job navigation                              | Search/PLP/PDP/cart user behavior                 | Supersede nav silently                         |
| `TS-TEC-003` Commerce Platform                         | Business commerce concepts, shared transaction and channel requirements      | Customer-visible outcomes/tests                   | Create parallel product/order commerce model   |
| TeeStock product/finance/inventory/fulfillment sources | Product meaning, pricing, sellability, fees, lead time, physical fulfillment | Truthful communication of their results           | Make new commercial policy                     |
| `CX-01` Master PRD                                     | Parent proposed product objectives and stage priorities                      | Refine `CX1-FR-006/007`, `020..028`, `038..044`   | Raise/decrease priority without reconciliation |
| `CX-02` Journey/Service Blueprint                      | Frontstage/backstage and physical-founder handoffs                           | Retail checkout-specific stages and failure proof | Claim labels equal physical delivery           |
| `CX-03` Design/Interaction                             | Design system direction, components, screen and state grammar                | Commerce component states and content priorities  | Fix final fonts/colors/styles unilaterally     |
| `CX-05` Custom & B2B                                   | Artwork, assisted/reviewed quotes, revisions, approval, configurator gates   | Retail-vs-custom routing                          | Convert Custom to unreviewed SKU/price         |
| `CX-06` Account/Support                                | Identity UX, order history, case/return/reorder details                      | Purchase context and status handoff               | Duplicate customer-case ownership              |
| `CX-07` Omnichannel                                    | Provider/API/settlement/carrier/channel integration contracts                | Customer-visible consistency, source separation   | Claim live provider permissions or connectors  |
| `CX-08` Quality/Acceptance                             | Reproducible performance, accessibility, R4/R5 safety and QA gates           | Retail negative/positive acceptance design        | Claim test PASS or production readiness        |
| `CX-09` Phased Delivery                                | Dependency-aware priority and validation roadmap                             | Ecommerce release prerequisites                   | Preempt active Owner-approved roadmap          |
| MGBOS canonical architecture and Finance               | Entity/state/payment/inventory/audit/identity semantics                      | Requirement for safe projection and transactions  | Design DB schema or modify financial state     |
| JARVIS/automation owners                               | Runtime agent authority, policy and event orchestration                      | Optional assistive customer experience            | Grant AI money/refund/authorization authority  |
| Head Engineering                                       | Architecture reconciliation, exact-source scope, IC/WP, QA, merge gates      | Proposed product inputs and acceptance            | Treat this PRD as Builder authorization        |

### 22.1 Requirement trace slice

| CX-01 parent         | CX-04 detail                  | Acceptance           | Dependency                    |
| -------------------- | ----------------------------- | -------------------- | ----------------------------- |
| `CX1-FR-002/006/007` | `CX4-FR-001..010`             | `CX4-AC-001..012`    | IA/brand/catalog              |
| `CX1-FR-020/021`     | `CX4-FR-011..014/017`         | `CX4-AC-013..019`    | Product master/inventory      |
| `CX1-FR-023/026/028` | `CX4-FR-013/015/016/020..022` | `CX4-AC-015..024`    | Pricing/promo/carrier policy  |
| `CX1-FR-022/024/025` | `CX4-FR-018/023..029`         | `CX4-AC-020..031`    | Identity/payment R5           |
| `CX1-FR-031..035`    | `CX4-FR-030..032/038`         | `CX4-AC-032/033/038` | CX-06/customer service        |
| `CX1-FR-038..044`    | `CX4-FR-033..037/041..042`    | `CX4-AC-034..037`    | CX-02, CX-07, Founder Control |

**Trace quality note:** Slash/range notation is shorthand only in human-readable tables. Any automated machine registry should expand to explicit ID arrays and validate every referenced source identifier against exact companion versions. This document does not modify an existing traceability registry.

## 23. Proposed evidence gates and definition of ready

### 23.1 Product-definition readiness (before owner approval)

- [ ] Owner confirms first sellable P1 retail product cohort and whether guest checkout is preferred.
- [ ] Existing business pricing, inventory, shipping, returns, tax and storefront responsibilities are reconciled; no duplicate semantic authority.
- [ ] CX-04 IDs, sample journeys and negative payment/error cases align with accepted parent CX-01/CX-02/CX-03.
- [ ] CX-05 and CX-06 declare their own boundaries so quoted Custom/B2B order does not accidentally share unapproved retail payment journey.
- [ ] Checkout design specimens include mobile keyboard, variant error, cart price change, delivery unsupported, payment pending/unknown, successful verified receipt, guest denied access and provider down.
- [ ] Open decisions `CX4-DEC-*` explicitly closed, deferred or carried as blocking where relevant.
- [ ] Owner approval is recorded against exact document revision; a future canonical routing decision locates this document without conflicting with PR #73.

### 23.2 P1 engineering discovery and implementation gate (NOT authorized by this draft)

1. Head Engineering restores current `main`, reads active PRs and relevant production-scope contracts; identifies exact dependency branch/revision.
2. For each eligible slice, it audits current source, domain APIs/read models, business invariants, payment/inventory/identity implementation and existing tests.
3. It determines whether current canonical architecture can support the product; if not, performs bounded architecture impact review first.
4. It establishes payment-provider sandbox and disposable, isolated test environments under approved destructive-test guards (no existing DB reset by assumption).
5. It produces bounded IC/WP with specific file scope, migrations (if any), role permissions, rollback, verification and independent QA requirements.
6. Owner separately approves implementation. Builder executes only approved scope. Independent security/financial QA evaluates exact head; merge/deploy require their own gates.

### 23.3 Proposed minimal P1 launch gates (illustrative; later CX-09 approval)

| Gate                      | Exit condition                                                                    | Consequence if not met                            |
| ------------------------- | --------------------------------------------------------------------------------- | ------------------------------------------------- |
| Commerce semantics        | Valid eligible SKU, price/availability rules, MTO limitations                     | Keep assisted-sales; no direct checkout           |
| Transaction integrity     | Trusted idempotent order and payment effects with error/recovery paths            | Block live checkout                               |
| Customer access           | Secure guest/account access to actual order receipt, no cross-user leak           | Block exposed order pages                         |
| Operational handoff       | Paid/eligible order reaches authorized fulfillment queue without retyping         | Do not claim fully self-service                   |
| Experience quality        | Mobile/usability/accessibility/performance target evidence for relevant templates | Remediate or explicitly defer affected capability |
| Logistics and after-sales | Honest shipping/returns/support, physical evidence chain                          | Restrict eligible shipping area/product           |
| Production safety         | No critical open security/financial defect; independent assurance and recovery    | No production authorization                       |

### 23.4 Operator acceptance and real pilot

Test a small number of **real eligible retail transactions only after** the dedicated commerce readiness gate and owner authorization, separately from the existing Custom/Business assisted pilot. Record actual customer effort, errors, payment reconciliation, packing/dispatch evidence, founder admin touches, provider cost and customer support demand. Synthetic test passes, polished designs and catalog content alone do not prove commercial/operational readiness.

## 24. Research and usability validation pack

**Proposed moderated tasks (no claimed findings):**

1. A first-time visitor chooses between buying a standard TeeStock shirt and requesting a custom run, without seeing an inactive buy path.
2. Mobile visitor finds a suitable ready-stock shirt, checks size guide, changes color, understands availability and identifies next action.
3. Shopper searches/filter/sorts products, then recovers from a true no-results state and a simulated unavailable API.
4. Shopper adds two variants, edits quantity and recognizes material price change in cart.
5. Guest buyer enters valid recipient/destination and recognizes shipping/processing time as estimate vs confirmed promise.
6. Shopper identifies full payable amount, including approved applicable fee or promotion, before final purchase.
7. Shopper returns from payment app while state is pending and correctly explains whether to pay again.
8. Shopper recovers from declined payment, an unknown timeout, an out-of-stock item and an expired session without duplicate charge.
9. Customer retrieves an authorized receipt, distinguishes confirmed payment from dispatch, and can reach support without copying full order details.
10. Founder processes valid retail order using MGBOS context without manual retyping; founder's physical steps and decision escalations stay accurate.

**Research record:** participant/device/browser/input method, consent, test environment/fixture, task, expected outcome, actual path, errors, assist requests, comprehension of price/status, time-on-task, navigation burden, observed friction, accessible alternative, source revision, unresolved blocker. Do **not** invent conversion uplift, statistical power or representative performance from a handful of tests.

## 25. Proposed document review checklist

- [ ] Metadata declares correct non-authority; path and companion versions are stable.
- [ ] CX-04 scope starts at discovery and ends at customer-side order/payment/fulfillment handoff; doesn't redefine CX-05/06/07.
- [ ] `FR-001..042`, `BR-001..022`, `AC-001..038`, `DEC-01..15`, `RISK-01..13` identifiers are unique and contiguous.
- [ ] Every P1 financial/stock action has at least one negative/replay/reconciliation scenario.
- [ ] Every inferred capability is explicitly proposed or `NOT_VERIFIED`, never "already working".
- [ ] P0 assisted-sales pilot remains valid without a retail checkout.
- [ ] Brand/IA/commercial policy preserved, not silently superseded.
- [ ] Guest and cross-org access negative testing required; no sensitive data in URLs/analytics.
- [ ] Screen labels for "cart", "order received", "payment pending", "paid", "label created", "shipped" have different authoritative evidence.
- [ ] Final price/tax/shipping/refund terms remain a decision of legitimate owners.
- [ ] No provider entitlement, production readiness, deployment/merge authorization, refund or AI monetary autonomy assumed.

## 26. Final proposed disposition

`CX-04` is suitable as a **draft input to cross-document product review**, not as a canonical spec and not as an Antigravity implementation prompt. The final Owner and Head Engineering gates must resolve blocked commerce/payment/inventory/security questions first.

**Next product companion:** `CX-05 — Custom & B2B Ordering Experience`, which refines the _non-cart_, quote/artwork/approval and standardized-reorder paths while preserving this document's retail-only checkout integrity model.

### Source links (baseline `main` and companion drafts)

- [TeeStock Commerce Platform — TS-TEC-003](https://github.com/Rizkybuilds/bisnishub/blob/2800c474563309bda49d84d712f79b68c9dde36a/bisnis/teestock/10-product-tech/commerce-platform.md)
- [TeeStock Digital Product Vision — TS-TEC-001](https://github.com/Rizkybuilds/bisnishub/blob/2800c474563309bda49d84d712f79b68c9dde36a/bisnis/teestock/10-product-tech/digital-product-vision.md)
- [TeeStock Website Information Architecture — TS-TEC-002](https://github.com/Rizkybuilds/bisnishub/blob/2800c474563309bda49d84d712f79b68c9dde36a/bisnis/teestock/10-product-tech/website-information-architecture.md)
- [TeeStock Pricing Framework](https://github.com/Rizkybuilds/bisnishub/blob/2800c474563309bda49d84d712f79b68c9dde36a/bisnis/teestock/08-finance/pricing-framework.md)
- [TeeStock MGBOS Integration](https://github.com/Rizkybuilds/bisnishub/blob/2800c474563309bda49d84d712f79b68c9dde36a/bisnis/teestock/11-data-mgbos/mgbos-integration.md)
- [Current Operational Pilot Plan](https://github.com/Rizkybuilds/bisnishub/blob/2800c474563309bda49d84d712f79b68c9dde36a/systems/mgbos/docs/product/teestock-operational-pilot-plan.md)
- [Canonical Documentation Constitution](https://github.com/Rizkybuilds/bisnishub/blob/2800c474563309bda49d84d712f79b68c9dde36a/docs/governance/documentation-constitution.md)
- [Public TeeStock app source](https://github.com/Rizkybuilds/bisnishub/blob/2800c474563309bda49d84d712f79b68c9dde36a/systems/mgbos/apps/teestock/src/app/page.tsx)

---

**Provenance:** Prepared 2026-10-16 as read-only product planning from selected GitHub files and companion CX-00..03 drafts present in the current working container. Owner has not separately approved this exact revision. No GitHub file, PR, database, deployment or payment provider was modified.

---

## Remediation R1 — explicit master requirement trace (generated draft, non-authoritative)

The rows below are generated from `CX-PKG-TRACE-R1.csv` (the sole package-wide mapping table). They do not introduce additional product requirements, approve a release stage, change any domain/architecture policy, or prove acceptance. Only exact locally declared IDs are linked; review the complete matrix for gates, ambiguities and candidate staging.

| CX-01 master ID | Exact declared detail IDs in this document | Selected existing acceptance | Candidate slice |
| :-------------- | :----------------------------------------- | :--------------------------- | :-------------- |
| `CX1-FR-001`    | `CX4-FR-001`                               | `CX8-AC-001`                 | `CX-S0`         |
| `CX1-FR-002`    | `CX4-FR-001`, `CX4-FR-002`                 | `CX9-AC-006`                 | `CX-S0`         |
| `CX1-FR-004`    | `CX4-FR-002`                               | `CX9-AC-005`                 | `CX-S0`         |
| `CX1-FR-006`    | `CX4-FR-003`, `CX4-FR-004`                 | `CX8-AC-013`                 | `CX-S1`         |
| `CX1-FR-007`    | `CX4-FR-005`, `CX4-FR-008`                 | `CX8-AC-014`                 | `CX-S1`         |
| `CX1-FR-008`    | `CX4-FR-010`                               | `CX8-AC-012`                 | `CX-S3`         |
| `CX1-FR-020`    | `CX4-FR-003`, `CX4-FR-005`                 | `CX8-AC-013`                 | `CX-S1`         |
| `CX1-FR-021`    | `CX4-FR-011`, `CX4-FR-012`, `CX4-FR-013`   | `CX8-AC-015`                 | `CX-S1`         |
| `CX1-FR-022`    | `CX4-FR-018`                               | `CX8-AC-017`                 | `CX-S1`         |
| `CX1-FR-023`    | `CX4-FR-021`, `CX4-FR-022`                 | `CX4-AC-023`                 | `CX-S1`         |
| `CX1-FR-024`    | `CX4-FR-024`                               | `CX8-AC-019`                 | `CX-S1`         |
| `CX1-FR-025`    | `CX4-FR-026`                               | `CX4-AC-028`                 | `CX-S1`         |
| `CX1-FR-026`    | `CX4-FR-016`, `CX4-FR-021`                 | `CX8-AC-016`                 | `CX-S1`         |
| `CX1-FR-027`    | `CX4-FR-007`                               | `CX4-AC-010`                 | `CX-S1`         |
| `CX1-FR-028`    | `CX4-FR-010`, `CX4-FR-039`                 | `CX4-AC-016`, `CX9-AC-029`   | `CX-S3`         |
| `CX1-FR-032`    | `CX4-FR-031`                               | `CX6-AC-023`                 | `CX-S2`         |
