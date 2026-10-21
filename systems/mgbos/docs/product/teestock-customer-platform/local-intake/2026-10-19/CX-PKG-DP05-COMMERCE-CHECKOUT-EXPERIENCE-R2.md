---
canonical_id: proposed.mgbos.product.teestock-customer-platform.dp05-commerce-checkout-experience-r2
status: DRAFT
version: 0.2.0
owner: Rizky
author: ChatGPT / AI Co-Founder & Product Strategy
approver: PENDING_OWNER_AND_INDEPENDENT_PRODUCT_REVIEW
document_class: product-experience-research-and-change-proposal
scope: teestock-customer-platform-cx04-commerce-checkout-deepening
normative_authority: NONE
repository: Rizkybuilds/bisnishub
source_ref: main
source_baseline_commit: 57eaafbb0ceef99a5fc6b2d77d724f6ff510727d
source_cx04_blob_sha: 818481ee7ed18dde347480145c74d2fce173e4eb
source_cx01_blob_sha: 3602550f5d54c8b58512014b54ec916d9b75f3e4
source_cx08_blob_sha: 96ea99276255189a12fe59084f94f91337b5062d
source_trace_blob_sha: e1be5560b99c8b045eb11cbb0b128b1ec0cafa61
proposed_destination: systems/mgbos/docs/product/teestock-customer-platform/CX-PKG-DP05-COMMERCE-CHECKOUT-EXPERIENCE-R2.md
baseline_checked: 2026-10-17
research_mode: SOURCE_GROUNDED_PRODUCT_DISCOVERY_AND_EXTERNAL_UX_REFERENCE_REVIEW
self_review: PERFORMED
independent_review: NOT_PERFORMED
actual_user_research: NOT_PERFORMED
prototype_execution: NOT_PERFORMED
payment_runtime_assurance: NOT_PERFORMED
engineering_readiness: NOT_ASSESSED
implementation_authorization: NONE
merge_authorization: NONE
deployment_authorization: NONE
supersedes: null
depends_on:
  - docs/governance/documentation-constitution.md
  - docs/governance/canonical-source-map.md
  - docs/roadmaps/solo-founder-launch-roadmap.md
  - bisnis/teestock/02-brand/brand-identity-system.md
  - bisnis/teestock/03-commerce/commerce-overview.md
  - bisnis/teestock/03-commerce/product-taxonomy.md
  - bisnis/teestock/03-commerce/catalog-merchandising-system.md
  - bisnis/teestock/08-finance/pricing-framework.md
  - bisnis/teestock/07-operations/inventory-system.md
  - bisnis/teestock/07-operations/order-fulfillment.md
  - bisnis/teestock/07-operations/returns-and-warranty.md
  - bisnis/teestock/10-product-tech/digital-product-vision.md
  - bisnis/teestock/10-product-tech/website-information-architecture.md
  - systems/mgbos/docs/product/teestock-customer-platform/cx-01-master-prd.md
  - systems/mgbos/docs/product/teestock-customer-platform/cx-02-customer-journeys-service-blueprint.md
  - systems/mgbos/docs/product/teestock-customer-platform/cx-03-experience-design-interaction-spec.md
  - systems/mgbos/docs/product/teestock-customer-platform/cx-04-commerce-checkout-experience.md
  - systems/mgbos/docs/product/teestock-customer-platform/cx-06-customer-account-service-experience.md
  - systems/mgbos/docs/product/teestock-customer-platform/cx-07-omnichannel-external-integration-requirements.md
  - systems/mgbos/docs/product/teestock-customer-platform/cx-08-experience-quality-acceptance-contract.md
  - systems/mgbos/docs/product/teestock-customer-platform/cx-09-phased-delivery-product-validation-plan.md
  - systems/mgbos/docs/product/teestock-customer-platform/CX-PKG-TRACE-R1.csv
  - systems/mgbos/docs/product/teestock-customer-platform/CX-PKG-DECISIONS-R1.md
---

# DP-05 — TeeStock Commerce & Checkout Experience Deepening R2

**Disposition:** `COPY_READY / AUTHOR_SELF_REVIEWED / DRAFT / NON-CANONICAL`.

**Purpose:** A bounded, evidence-aligned proposal to deepen the customer-facing decisions, screens, interaction states, recovery, and acceptance of the existing **CX-04 — Commerce & Checkout Experience Specification v0.1.1**. DP-05 is **not** a parallel canonical retail PRD. Integration, if approved, must occur by a versioned, traceable change to CX-04 and its dependent artifacts. This file must not be treated as payment architecture, inventory policy, or an executable Antigravity work package.

**Product North Star:** **Powerful underneath, effortless on the surface.** Complex operational rules and transaction integrity must be invisible as complexity but legible as trustworthy choices, uncertainty, and feedback.

**Non-claims:** The product definitions here do not prove that the online Shop, cart, guest checkout, authorized public order access, payment gateway, shipping adapter, or product catalog are currently operating or publicly released. Examples use *synthetic* product/price/status content. No real provider entitlement, tax rule, payment configuration, inventory capacity, field performance, or customer validation is implied.

---

## 0. Executive product decision

### 0.1 The customer problem

An apparel shopper wants to find a product, assess fit and suitability, decide on a real available variant, understand the total amount and delivery conditions, pay safely, and know exactly whether the purchase succeeded. A technically rich site fails if shoppers must chase unclear stock, discover new fees at the final screen, create an unwanted account, interpret provider payment states, or ask a human whether their order exists.

For TeeStock as a solo-founder operation, every successfully accepted order should become an authorized, structured internal fulfillment obligation with no duplicate transcription. The founder must still perform real material handling, inventory/quality checks, packaging, and courier handoff where needed. Software does not certify physical actions that have not occurred.

### 0.2 Five outcomes

| Outcome | Observable evidence | Product anti-outcome |
| --- | --- | --- |
| Confident discovery | User selects a relevant actually eligible product/variant and can explain key differences | Pretty media conceals fit, stock or price basis |
| Predictable commitment | User reviews an authoritative total and material terms before commitment | Surprise charges, hidden shipping or stale total |
| Safe payment | Customer can distinguish action required, pending, paid and uncertain results | Redirect, toast or AI message treated as financial proof |
| Recoverable session | Network loss, changes, provider delay and refresh yield safe next actions without multiple accepted effects | Forced restart or ungoverned re-charge |
| Founder leverage | Valid accepted order includes permitted SKU/variant, quantity, recipient, source and next operational action | Founder copies orders from messages or manages every ordinary webhook |

### 0.3 Scope and launch sequence

| Slice | What can be designed | What must **not** be inferred |
| --- | --- | --- |
| `CX-S0` | Premium Shop-related entry, honest available service/product facts, assisted Custom/Business routes and real support path | Active self-service catalog checkout or instant payment |
| `CX-S1` | Approved retail catalog, product detail, variant selection, cart, delivery review, eligible payment, confirmation, and safe order visibility | Retail launch readiness without actual financial, inventory, provider and security gates |
| `CX-S2` | Authorized account/reorder assistance, support and selectively approved channel-linked operations | Universal multi-provider synchronization |
| `CX-S3` | Optional recommendations, personalization, eligible advanced bundles and AI guidance | Required AI for purchase or uncontrolled discount/financial authorization |

`P0/P1/P2` in CX-04 denote requirement prioritization; `CX-S0..CX-S3` denote proposed capability slices. They are not interchangeable. Existing Solo-Founder Launch Roadmap and CX-PKG-STAGE-CROSSWALK-R1 remain controlling where applicable.

### 0.4 Authority boundaries

- TeeStock canonical business documents own offer/assortment, stock-policy intent, price books, discounts, taxation assessment, shipping promises, customer rights and returns eligibility.
- MGBOS canonical architecture owns authoritative identity, organization isolation, inventory effects, order and payment semantics, idempotency, invoice, ledger, reservation and fulfillment evidence.
- CX-04 owns what retail customers can **see, understand, enter, choose, review, confirm, and recover from**. It does not choose SQL entities, RPCs, payment commands, physical ledger rules, price formulas or provider credentials.
- CX-03 owns global interaction grammar and visual tokens; CX-08 owns product test and performance evidence; CX-07 owns channel-specific expectations; CX-06 owns post-order customer account/support; Head Engineering reviews technical feasibility after product authority review.
- JARVIS/AI may explain approved information or draft assistance. It cannot assert a charge, refund, stock reservation, confirmed courier milestone or binding total.

**Financial integrity invariant for the user-facing journey:** An attractive checkout is not allowed to transform an unknown backend result into an invented successful business event.

---

## 1. Evidence and source reconciliation

### 1.1 Exact inspected snapshot

- GitHub repository `Rizkybuilds/bisnishub`; `main` resolved to `57eaafbb0ceef99a5fc6b2d77d724f6ff510727d` on 2026-10-17.
- Existing CX-04 blob: `818481ee7ed18dde347480145c74d2fce173e4eb`, DRAFT v0.1.1, **42** `CX4-FR-001..042`, **22** `CX4-BR-001..022`, **38** `CX4-AC-001..038`, and `CX4-JRN-01..09`.
- Existing CX-01 source blob `3602550f5d54c8b58512014b54ec916d9b75f3e4` specifies customer platform parent behaviors, including `CX1-FR-006..007` and `CX1-FR-020..028` for retail.
- Existing CX-08 source blob `96ea99276255189a12fe59084f94f91337b5062d` contains prospective product acceptance and measurement methods. Their presence does not prove passing measurements.
- Existing CX package trace artifact is `CX-PKG-TRACE-R1.csv`, with proposed mapping and no implementation acceptance.
- `CX-PKG-DECISIONS-R1.md` contains Owner decisions whose status remains `OPEN` or `DEFER` unless authoritative subsequent evidence proves otherwise.
- Earlier DP-01..DP-04 companion files were generated in the conversation but **not found on inspected GitHub main**. They may be consulted as non-canonical draft design inputs only; no GitHub link to these paths is claimed. The DP-05 destination was not present on inspected `main`.
- Existing PR #73 is open/draft and limited to repository entrypoint routing files; this document does not change its scope.

### 1.2 Source-to-experience preservation table

| Current CX-04 concern | Existing ownership | DP-05 bounded refinement |
| --- | --- | --- |
| Discovery/merchandising | `CX4-JRN-01..02`, `CX4-FR-001..010` | Job-based browsing, search/filter/PDP micro-decisions and honest empty/failure states |
| Product choice | `CX4-JRN-03`, `CX4-FR-005..009` | Variant confirmation, availability basis, sizing confidence, accessible media fallbacks |
| Cart | `CX4-JRN-04`, `CX4-FR-011..017` | Clear provisional pricing, cart versus reservation, change/reconciliation UX |
| Delivery/identity | `CX4-JRN-05`, `CX4-FR-018..022` | Guest-first decision model where approved, minimum data, shipping eligibility and user review |
| Payment | `CX4-JRN-06`, `CX4-FR-023..027` | Exact truth labels, uncertain-outcome recovery, no duplicate customer intent |
| Confirmation & care | `CX4-JRN-07..08`, `CX4-FR-026..032` | Durable receipt comprehension, order versus payment, post-order handoff |
| External channels | `CX4-JRN-09`, `CX4-FR-033..034/041` | Channel boundary copy and mismatch/replay handling in customer experience |
| Operational offload | `CX4-FR-035..037/042` | Administrative touch measurement and no-AI normal checkout |
| Quality and sequencing | `CX4-AC-001..038`, `CX4-BR-001..022` | Additional screen fixtures, negative tests and targeted acceptance without renumbering |

### 1.3 Copy-forward rule

Preserve all existing `CX4-FR-001..042`, `CX4-BR-001..022`, `CX4-AC-001..038`, `CX4-JRN-01..09`, downstream references, and current risk/unknown/decision record IDs during discovery. This proposal uses the separate `DP05-*` prefix for suggested refinements. Do not renumber or replace a current CX4 identifier simply because a richer scenario is now available.

### 1.4 Methodology references

- W3C WCAG 2.2 SC 3.3.4 requires at least one of reversibility, input checking with correction opportunity, or review/confirmation/correction for covered financial/legal submissions. In this product, deliberate pre-commitment review is the preferred **design direction**, subject to precise workflow and accessibility review; it is not a representation that every payment can be reversed.
- W3C input-assistance guidance is used for error labels, explanations and retained valid input.
- web.dev Core Web Vitals uses p75 field targets, where applicable, of LCP <=2.5s, INP <=200ms and CLS <=0.1; existing CX-08 already carries these as proposed product quality goals.
- Baymard's ecommerce checkout research supports treating guest checkout discoverability and form friction as research hypotheses, **not** observed TeeStock user evidence.

---

## 2. Audience, jobs and purchase-mode model

### 2.1 Primary customers

| Segment | Job | Common confusion | Preferred product response |
| --- | --- | --- | --- |
| First-time mobile retail shopper | Find right garment and finish eligible purchase | Which size? What is available? Does price include shipping? | Compact verified information, clear options, staged disclosure |
| Size/fit-sensitive buyer | Compare garment and measurements | Product shots do not prove fit | Accessible size chart, measurements, fabric and model info where verified |
| Ready-stock buyer | Buy available variant quickly | Cart addition interpreted as stock reservation | Explicit availability basis and final checkout revalidation |
| MTO/preorder buyer | Understand special fulfillment mode | Assumes instant dispatch | Clearly differentiated mode, timing qualification and applicable rights |
| Returning buyer | Rebuy familiar item | Previous item/price no longer eligible | Current variant and terms revalidation |
| Guest buyer | Avoid unrelated account creation | Forced signup blocks purchase | Guest-first eligible route with privacy and secure retrieval safeguards |
| Founder-operator | Execute legitimate accepted order | Customer details distributed across chat/provider | Structured operational snapshot and exception-only attention |

### 2.2 Sellability is a policy decision, not a CSS badge

A product is visually purchasable **only when** the approved business and authoritative systems establish eligibility for the relevant variant, quantity, seller, customer, channel, shipping destination, payment method and time. A product being present in content or cache is not a sellability proof.

Use the following proposed *UI interpretation classes* (not database enums):

| Interpretation | Customer presentation | Permitted next step |
| --- | --- | --- |
| Published + currently eligible | Variant-specific purchase action with qualified price/availability | Add to cart, then revalidate |
| Published but temporarily out of stock | Out-of-stock language from verified source | Approved alternative, availability info or help |
| MTO eligible | Explicit made-to-order terms and realistic, source-backed expectation | Approved MTO purchase only after policy gate |
| Preorder eligible | Clear preorder terms, timeline basis and applicable cancellation/return policy | Preorder only if specifically authorized |
| Published but review required | Contact/request review; no instant binding price | Assisted Custom/Business inquiry |
| Unpublished/retired | Not exposed as a live purchase offer | Safe redirect or unavailability explanation |
| Availability data unavailable | Source currently cannot confirm eligibility | Retry/help, do not display false zero stock or successful reservation |
| Invalid/unknown destination | No shipping promise | Change address/region, choose approved assistance |

**No substitution:** A customer who selected black size L cannot silently be charged for navy size M or another SKU when the first becomes unavailable.

### 2.3 Boundary between Shop and Customize

Shop handles **actually eligible standardized commerce offers**. Custom routes demand that needs special artwork, decoration, quantity-specific production or reviewed price/lead time. If the customer arrives on a product that cannot be sold as an instant item, explain the assisted Custom alternative without losing lawful, non-sensitive choices. Moving from Shop to Customize must not create an order or publish a binding price.

---

## 3. End-to-end premium commerce journey

Each row is a proposed customer-experience checkpoint; it is not a new MGBOS business lifecycle. The complete root journeys remain `CX4-JRN-01..09`.

| Step | Screen / customer action | Visible feedback | Source/dependency | Failure and safe recovery |
| --- | --- | --- | --- | --- |
| `DP05-SC-01` Enter | Landing/collection resolves customer's intent | Brand/product meaning + valid route | Public approved content/IA | Dead deep link => useful route, not fictitious offer |
| `DP05-SC-02` Explore | Search, sort, filter | Applied state, result count, clear filters | Published catalog/query | No matches != backend unavailable |
| `DP05-SC-03` Evaluate | Open PDP, view images, material, size/fit | Relevant facts and qualifiers available | Catalog/media and policy | Missing visual => text/size details remain |
| `DP05-SC-04` Specify | Choose valid variant/quantity | Selected combination and terms refresh | Item eligibility/price inventory | Invalid selection => correction, no substitution |
| `DP05-SC-05` Cart | Add item and review selected items | Distinct provisional total; no reservation claim | Governed cart/eligibility | Unknown add outcome => check, no blind duplicate |
| `DP05-SC-06` Identity | Choose approved guest/account route | Only required personal fields | Identity/security/privacy | Session expired => safe restoration/restart |
| `DP05-SC-07` Delivery | Enter address/region, choose legitimate shipping option | Shipping amount/eligibility and qualification | Shipping/business policy/provider | Provider unavailable => unknown not free shipping |
| `DP05-SC-08` Review | Inspect line items, destination, all charges and terms | Explicit total and material disclosures | Authoritative reviewed checkout context | Material change => visible reconfirmation |
| `DP05-SC-09` Commit | Deliberately confirm purchase/payment step | Clearly labeled processing and provider handoff | Authorized MGBOS transaction/payment orchestration | Double click/timeout => idempotent accepted effects, uncertainty UI |
| `DP05-SC-10` Return | Land on result/verification surface | Pending, action needed, confirmed, failed or unknown | Trusted backend/provider reconciliation | Redirect parameters never establish paid status |
| `DP05-SC-11` Receive | View durable receipt/reference if accepted | Separate order and payment meanings | Authorized order/payment query | No success reference if acceptance unproven |
| `DP05-SC-12` Fulfill | Track genuine steps and get help | Only verified milestone and next action | Operations/fulfillment/customer care | Label created != handed to carrier; failure gets support |

**Journey acceptance thesis:** A user can leave each stage understanding what they chose, what has been accepted, what remains uncertain, and what to do next. Delayed external confirmation is a normal state with an intentional UX, not an error to conceal.

---

## 4. Catalog discovery and merchandising interactions

### 4.1 Product listing / collection anatomy

Proposed priority order on a mobile listing:

1. Clear current collection context and task-oriented title.
2. Search or obvious collection discovery path where relevant.
3. Filters and sort reachable without displacing product identity.
4. Product cards with recognizable image, name, meaningful distinguishing attributes and price/availability qualifier.
5. Result count, active filters, removal/reset affordance and understandable no-match state.
6. Secondary merchandising stories or optional recommendations after the decision-critical content.

Collection/campaign messaging can be expressive in TeeStock's approved brand layer, while purchase information remains accurate and visually stable. Recommendations cannot hide ordinary browsing or secretly override customer filters.

### 4.2 Search decision matrix

| User/input state | Required behavior | Never do |
| --- | --- | --- |
| Empty search | Helpful browse affordance, suggested categories where supported | Invent trending inventory |
| Typo or synonym | Explain possible relevant results where supported; user can revise | Substitute results without explanation |
| Result found | Query reflected; relevant products displayed | Leak unpublished/retired products |
| No match after successful search | “Tidak ada produk yang cocok” plus filter reset | Imply catalog service failed |
| Query failed/offline | “Produk belum bisa dimuat” and retry | Say “stok habis” for all products |
| Applied filters cause zero results | Show active conditions and reset/adjust action | Hide selected filters |
| Deep link to invalid variant | Safe product page with explicit invalid selection or legitimate fallback | Reconstruct old purchasability from URL |
| Results become stale | Reflect latest verified information before binding action | Preserve old buy eligibility invisibly |

### 4.3 Filters, sort and URL behavior

- Filters represent useful customer concepts: garment type, size, color, fit, material, price band, eligible availability or collection, when published reliable data exists.
- Sort controls should describe their interpretation (e.g., price basis) and not imply a quality ranking with no evidence.
- Active filters must be visible and clearable; back/forward navigation should behave sensibly, subject to UX/technical feasibility.
- A product list should not require scrolling through a long editorial introduction for access to relevant items.
- Filter changes must not unexpectedly move keyboard/screen-reader focus. Loading and result changes should be announced appropriately without noisy repeated announcements.
- Product recommendations, if later used, need a deliberate separation from core filtered results.

### 4.4 PDP quality checklist

| Region | First-class facts | Secondary value |
| --- | --- | --- |
| Identity | Product name, garment type, variant and collection/source as legitimate | Campaign concept/story |
| Fit | Size guide with units and suitable reference measurements | Model imagery and styling notes |
| Fabric | Verified composition/weight/care facts where known | Material texture imagery |
| Offer | Approved price basis, promotion if valid, terms/availability | Optional comparative guidance |
| Decision | Valid size/color/quantity and clear active next action | Recommendations |
| Delivery | Availability mode, relevant shipping/lead-time qualifiers | Detailed help/FAQ |
| Trust | Return/care information that actually applies | Related editorial/brand content |

**Screen-level proof requirement:** Customer can understand fit, selection, availability mode and next action from the PDP even if image zoom, font, recommendation service, autoplay media or optional AI fail.

---

## 5. Variant, stock, and availability truth

### 5.1 Variant change contract

1. Selection updates the displayed variant name/attributes and identifiable choice state.
2. Any current price/availability information is revalidated or explicitly marked not yet confirmed.
3. A conditional combination that is unavailable cannot be selected as a valid eligible order line.
4. If change affects price or delivery mode, the user sees the impact at the decision point.
5. Availability remains qualified until the appropriate binding checkout check; no “reserved” statement unless the source has actually created a policy-valid reservation.
6. Use accessible text for color names, sizes and sold-out state rather than color swatch or strike-through alone.
7. A stale product page may remain browsable, but add-to-cart cannot act on invalid eligibility.

### 5.2 Quantity handling

- Explain units and customer-relevant maxima/minima from actual product policy. No default invented MOQ.
- Reject zero, negative, non-integer for piece-based offers, and above-policy quantity unless an explicitly approved alternative exists.
- For a large or non-standard volume, prefer a visible Business/Custom quote route rather than deceptive wholesale discounts.
- If sizes have separate quantities, summary must make the breakdown checkable before purchase.
- Price badges and shipping previews must not imply fixed cost across quantities if legitimate price tiers or volume limits change.

### 5.3 Time and reservation vocabulary

| Customer phrase | Allowed only when | Forbidden confusion |
| --- | --- | --- |
| “Tersedia untuk dibeli” | Product/variant currently eligible under authoritative policy | Physical stock allocated by merely opening PDP |
| “Masuk keranjang” | Cart action accepted by its actual owner | Stock reserved or order placed |
| “Stok disisihkan hingga ...” | Actual approved reservation evidence and time bound exist | Cart cookie/session expiration represented as reservation |
| “Sedang dibuat setelah dipesan” | Valid MTO terms and production eligibility exist | Same-day ready stock |
| “Preorder” | Campaign/offer policy, timing and customer rights verified | Standard product with merely missing inventory |
| “Pengiriman diperkirakan ...” | Grounded eligible estimate exists and qualifiers displayed | Guaranteed arrival by selected date |

**Inventory race principle:** Two customers can inspect the last unit concurrently. UI clarity cannot replace authoritative concurrency and allocation checks. If eligibility changes before commitment, the experience must stop the invalid purchase and offer a correction.

---

## 6. Cart design and commercial revalidation

### 6.1 Cart page anatomy

- Product thumbnail/text, variant, size/color, item price basis, quantity, line subtotal and permitted remove/edit.
- Summary of subtotal, discounts and shipping/tax/fees that are known, with unresolved charges explicitly identified as pending calculation.
- Link to delivery policies, correct mode/lead-time expectation and eligible next step.
- Clear “Keranjang belum berisi produk” only when successfully retrieved and actually empty.
- Relevant alternative when item becomes unavailable; no silent product substitution.
- No payment success or reservation claim from the cart.

### 6.2 Provisional versus binding amount

The cart represents a **working calculation**. The checkout review must show the authoritative amount and terms applicable to the exact reviewed intent. Neither the cart display nor a browser-only total grants pricing authority.

| Event | Customer-visible response | Commitment rule |
| --- | --- | --- |
| Quantity changed | Line and provisional total visibly recalculate | Revalidate at checkout |
| Variation changed | Updated variant and price basis; user reconfirms relevant difference | Never silently substitute SKU |
| Discount expired | Show removal reason and revised total | Previous discount not carried into charge |
| Shipping revised | Show changed shipping option/cost before final decision | No hidden fee change |
| Stock depleted | Block current item with clear removal or assistance path | No oversell through stale cart |
| Cart data unavailable | Show loading/error/retry, preserve lawful context | Not “empty cart” |
| Session expires | Explain what can be restored versus requires re-entry | Do not use unapproved persistent PII storage |
| Binding amount changed after review | Return user to updated final review and obtain deliberate acceptance | Never charge old or undisclosed new total |

### 6.3 Cart item recovery

If restoring prior selections is allowed, recovered cart lines must be revalidated against current price, variant, availability, promotion, quantity, shipping and eligibility. Do not re-apply a past payment token, customer authorization, or quote/proof approval. Sharing a cart is not an account authorization mechanism.

### 6.4 Cart interaction anti-patterns

Avoid: cart-expiry timers without real reservation, forced account registration, “free shipping” without source, last-minute marketing popups, confusing bundles that conceal itemized amount, and redirecting ordinary failures to an unrelated founder chat without preserving permitted context.

---

## 7. Guest checkout, identity, address and privacy

### 7.1 Guest-first when the capability is authorized

**Proposal:** Eligible ordinary retail customers should be able to choose guest checkout without forced account creation if Owner, privacy, identity and financial/security owners approve. This is `CX4-DEC-02` and remains **OPEN**, not automatically approved by this document.

- Do not present login as the only way forward when an approved guest path is available.
- Ask for no more than legitimate contact, recipient, address and fulfillment requirements.
- Explain contact use and independent marketing consent according to approved policy.
- A guest order reference alone must not authorize private order lookup or exposing shipping addresses.
- Creating or linking an account must not silently merge orders/carts across people or organizations.
- If identity must be strengthened for a particular service/method, explain the reason and provide a supported route.

### 7.2 Delivery address and contact interaction

| Input | Proposed UX guidance | Source of truth / privacy |
| --- | --- | --- |
| Recipient name | Plain label, minimal approved data | Customer/shipping policy |
| Phone/contact | Explain usage, format validation, corrections | Notification and data protection policy |
| Region/address | Structured enough for carrier eligibility and correct delivery | Shipping service/policy; no invented service area |
| Postal code | Example and validation matching permitted delivery country/region | Address/fulfillment rules |
| Delivery notes | Optional and permission-sensitive | Do not place private notes in open analytics |
| Invoice/B2B data | Conditional only when policy requires | Correct business identity and invoice authority |
| Marketing preference | Separate consent, not disguised as checkout prerequisite | Privacy and channel rules |

Prioritize mobile input types/autocomplete, visible labels, clear inline errors and preservation of other valid fields. A malformed postal code should not clear cart contents. Server validation is always necessary; browser input validation is a usability aid, not transaction authority.

### 7.3 Returning after interruption

Returning users should see whether their *selection* is still available and which fields require reconfirmation. Account/guest recovery cannot reveal whether a private order exists to an unauthorized visitor. Do not store raw payment credentials, private customer documents or sensitive address content in unapproved browser storage or analytics.

---

## 8. Shipping options, taxes, fees and timing

### 8.1 Customer shipping decision

1. Customer supplies a sufficiently precise destination through approved minimal input.
2. System evaluates valid serviceability and supported shipping methods; no assumption every courier or region is connected.
3. UI shows eligible method, charge, estimated handling/delivery basis and any material exclusions that can be verified.
4. If a rate is stale/unavailable, UI shows the uncertainty and offers safe retry, alternative or assistance. It must not default unknown shipping to free.
5. At final review, applicable shipment fees and address are bound to the reviewed commercial intent.
6. Customer is asked to reconfirm a material rate or serviceability change before committing.

### 8.2 Total disclosure inventory

| Component | Show when applicable and verified | Risk if omitted or assumed |
| --- | --- | --- |
| Product/variant subtotal | From approved price/quantity | Incorrect commercial basis |
| Authorized discount | Include scope/eligibility and actual amount | Phantom promotion |
| Taxes | Only per applicable law, entity and authoritative calculation | Improper tax or misleading total |
| Delivery cost | Relevant eligible method and destination | Surprise cost / loss |
| Other permitted fee | Descriptive label and approved calculation | Unexplained charges |
| Final payable amount | Exact, reconciled total before binding decision | Customer approves wrong amount |
| Payment method terms | Eligibility, method-specific fees/steps where applicable | Provider misunderstanding |
| MTO/preorder terms | Applicable fulfillment and customer-rights qualifiers | Unrealistic dispatch/return expectations |

The product spec intentionally defines **disclosure UX**, not Indonesian tax liability, exact tax percentages, discount floors, or shipping tariffs. Legal/finance owner review is needed before publishing such figures.

### 8.3 Timing semantics

Distinguish: customer requested delivery date; source-backed approximate handling/dispatch; physical handoff to carrier; tracking accepted by carrier; and actual delivered state. A generated courier label is **not** evidence the carrier has accepted the parcel. Never construct a guaranteed delivery date by adding a fixed number of days to the browser clock.

---

## 9. The checkout review and final commitment

### 9.1 Proposed screen progression

Use the simplest flow demonstrated by prototype testing. A recommended progressive structure for complex retail carts is:

**Identity/contact → Delivery details → Payment method → Review & confirm → Provider action/outcome.**

This is an interaction **hypothesis**, not a mandate to build five separate pages; straightforward carts may work better with fewer screens. Preserve legitimate data when users move back, while recalculating the price/eligibility context where appropriate.

### 9.2 Pre-commitment review must show

- Exact line items, SKU-relevant variant, quantity and final eligible amount per item.
- Shipping destination and selected legitimate method; visible shipping charge and any qualifying information.
- Subtotal, approved reductions, applicable taxes and fees, exact **reviewed total payable**.
- Mode of availability and essential delivery/return conditions.
- Clear distinction between purchasing now and **requesting a quote**.
- Payment step consequences, external provider transition if used, and help/recovery route.
- A deliberate submit control with contextual action language.
- A way to edit incorrect details **before** binding commitment, as permitted by transactional policy.

An illustrative microcopy pattern is “Periksa pesanan sebelum melanjutkan pembayaran”, not an assertion that the seller can reverse a completed charge at will. W3C SC 3.3.4 is satisfied via the applicable supported prevention pattern, not by assuming all payments are refundable.

### 9.3 Material re-approval conditions

A new review is required when an authoritative source establishes a material change to: item/variant, quantity, discount, tax/fee, shipping service/rate, payable amount, eligible payment method or essential commercial terms. The UI should identify the changed component and permit correction/abandonment. Never hide revised terms behind an already-clicked pay button.

### 9.4 Pre-commitment failure and session expiry

| Failure | Customer sees | System must preserve |
| --- | --- | --- |
| Validation error | Precise field and correction, readable error summary if useful | Other valid user input as permitted |
| Cart stale | What changed and current available alternatives | Identified previously selected intent, without accepting stale commitment |
| Shipping provider unavailable | Cannot calculate/confirm method yet | User's lawful address/cart context; no free-rate default |
| Checkout session expired | Revalidation/restart required, reason and safe route | No stale payment action or exposed secrets |
| Eligibility changed at last item | Updated final review and deliberate reconfirmation | Never create unrelated substitute order |
| Browser offline | Connection uncertainty and safe continue/retry semantics | No false accepted server result |

---

## 10. Payment customer experience and transaction integrity

### 10.1 Presentation-level payment truth model

These labels represent **customer-facing projections**, **not** authorized MGBOS state values or an API schema.

| Display meaning | Evidence/UI action | Forbidden inference |
| --- | --- | --- |
| Not started | No verified initiated payment attempt for the current valid intent | Abandoned cart means a failed charge |
| Action required | Actual provider/user step remains necessary; explain supported method | Merchant already received money |
| Processing/pending | Authoritative source says still awaiting or reconciling | Provider redirect proves paid |
| Confirmed paid | Governed financial source verifies accepted matching payment | Screenshot or client query string is sufficient |
| Declined/failed | Trusted status shows outcome and approved next method | Retrying same charge is always safe |
| Outcome unknown | Could not determine actual accepted result; recovery/reconciliation necessary | Assume failed and submit second charge |
| Refunded/partially refunded (if eligible) | Governed refund financial result and appropriate amount proven | Return/cancellation request equals completed refund |

**Payment consistency obligation:** Show actual status and timestamp/freshness qualifier when justified; no customer-facing optimistic financial confirmation. If source is unreachable, show “status belum dapat dipastikan” with an approved check/contact path—not “belum dibayar” or “lunas”.

### 10.2 Customer-side idempotency and reconciliation experience

- Once a deliberate payment/order command is underway, reflect that the existing intent is being processed; disable accidental duplicate button activations without hiding supported recovery.
- The backend must provide proper transaction identity, concurrency handling, and idempotency according to the authoritative finance architecture, not merely frontend button disabling.
- After reload, back navigation, timeout or redirect, query the existing authorized transaction status. Do not regenerate a new payment intent solely because the client lost state.
- If outcome is uncertain, show an explicit safe check path and escalate an unresolved material exception rather than directing the user to “pay again” by default.
- Any approved retry must follow provider/MGBOS contract; the UX should explain whether it continues the same intent or starts a separately authorized attempt.
- Notifications, webhooks and AI explanations never independently mutate paid status. External events need verified provider identity and reconciliation before business effects.

### 10.3 Illustrative failure storyboard

**Synthetic fixture:** Buyer selects one eligible garment in size M, amount shown at checkout review as an example only (not TeeStock price). The user submits an approved payment attempt. Browser redirects back with `status=success`, but provider callback has not been verified by the merchant.

1. UI displays **“Pembayaran sedang diverifikasi”** (only if backend supports that statement), not “Pembayaran berhasil”.
2. Order/payment reference appears only if securely available from actual accepted source.
3. User is told not to repeat the transfer/charge blindly; an approved status-check option and support route are shown.
4. On a later valid source confirmation, UI can show confirmed payment and updated order next step.
5. If callback remains missing and status cannot be fetched, UI shows unknown and routes to governed reconciliation; backend-finance owners determine actual resolution.
6. Founder is notified only if a real actionable exception requires human intervention, not on every normal pending state.

**Pass condition:** No misleading paid indication, no second accepted financial effect, and no loss of traceability due to client refresh. Actual pass still requires independent finance/integration execution, not PRD review.

### 10.4 R5 finance boundary

Existing R5 payment/idempotency work is separate and must be reviewed at its **current authoritative revision** before any future CX-S1 activation. This document does not freeze `payment.record.v1`, command fingerprints, ledger posting order, invoice allocation, refund semantics, caller migration, or accepted role boundaries. Approval of this customer experience cannot waive a required R5 security/integrity gate.

---

## 11. Confirmation, order receipt and customer status

### 11.1 Confirmation content

Where accepted order is truly established, the confirmation should show:

- Stable permitted order reference and whether payment is separately confirmed/pending/unknown.
- The actual reviewed order summary and payable context as appropriate.
- Fulfillment or processing expectation grounded in verified information.
- Safe order-help/recovery link and truthful next action.
- No unrelated internal margin, vendor rates, ledger rows or other customers' confidential information.

A successful request for help, payment attempt, cart creation, quote request and an accepted order are different facts. UI must not reuse the same green “Success!” treatment to imply identical commitments.

### 11.2 Authorized guest access

Receipt/retrieval links require appropriately scoped controls; the order number alone is not a proof of identity. An invalid, unrelated or expired guest link should reveal no private data or existence clue. CX-06 determines the broader customer-account/service experience; Head Engineering owns authentication and authorization implementation.

### 11.3 Customer-facing order progress

| Business-side evidence | Customer-safe meaning | Disallowed extrapolation |
| --- | --- | --- |
| Payment pending / unknown | Payment still awaiting verified outcome | Financially completed |
| Order accepted with prerequisites outstanding | Order received; next permitted action described | Production automatically started |
| Production work initiated and verified | Production progress may be described at appropriate level | Every promised item passed QC |
| Label generated | Preparing shipment / label ready where true | Courier has collected parcel |
| Carrier acceptance recorded | Handed to courier with legitimate tracking | Package delivered |
| Actual delivery confirmation | Delivered according to evidence, with help path | No possible complaint or return right |
| QC/fulfillment exception | Checked status and next action without internal confidential details | Invented date or auto-refund |

CX-06 and existing order/fulfillment owners remain the authority for status projection and exact customer copy after product adoption.

---

## 12. Premium UI patterns without performance debt

### 12.1 Visual interaction grammar

- Follow TeeStock's **Neutral Core + Expressive Product Layer**; restrained chrome around high-quality product imagery and clear commercial content.
- Use product photography to inform fit/fabric and campaign imagery to communicate identity. Do not require expensive 3D or autoplay hero video for ordinary shopping.
- A primary CTA must convey the action truly available now; an inactive route cannot impersonate working commerce.
- Preserve visible contextual price, selected variant, purchase mode and appropriate delivery expectation near the purchase decision.
- Keep support/help contextual and nonintrusive. A chatbot overlay must not cover the pay, edit or accessibility controls.
- Motion communicates focus, selection and feedback; it cannot convey authoritative payment or inventory status independently of text.

### 12.2 Screen/component inventory

| Proposed component | Required states | Dependent CX contract |
| --- | --- | --- |
| Listing result card | Eligible, unavailable, uncertain, image fallback | CX-03 / CX-04 |
| Search and filter | Idle, applying, no matches, unavailable, reset | CX-03 / CX-04 |
| Product gallery | Loaded, missing image, zoom unavailable, reduced motion | CX-03 |
| Size and color selector | Active, invalid, unavailable, changed price | CX-04 |
| Quantity control | Valid, below/above policy bounds, revalidated | CX-04 |
| Add-to-cart button | Ready, processing, accepted, rejected, outcome unknown | CX-03 / CX-04 |
| Cart line | Current, stale, ineligible, revalidated, removable | CX-04 |
| Delivery estimator | Not enough input, eligible, invalid, provider unavailable, changed | CX-04 / CX-07 |
| Checkout form | Ready, validation error, interrupted, restored, protected | CX-03 / CX-04 |
| Final amount review | Current, changed terms, user reconfirmed | CX-04 + finance owner |
| Payment choice/result | Action required, pending, confirmed, failed, unknown | CX-04 / finance owner |
| Order confirmation | Accepted, authorization denied, stale, unavailable | CX-04 / CX-06 |
| Post-order help | Ready, channel unavailable, handoff pending/accepted | CX-06 |

### 12.3 Device and accessibility conditions

- Design for first-time mobile users, midrange devices, slow networks and virtual-keyboard overlap.
- Operable controls with visible focus, semantic labels, error descriptions and keyboard navigation.
- Accessible announcement of material changes and payment status, without stealing focus repeatedly.
- Do not rely only on color to express stock, payment state or product variation.
- Provide non-drag alternatives for image galleries and any complex interactive control as required by applicable WCAG criteria.
- Respect reduced-motion settings; retain all transaction information without animation.
- Apply WCAG 2.2 Level AA as a **proposed target** for the relevant controlled UI, including checkout flow and third-party handoffs where covered by the acceptance scope; assess provider limitations explicitly.

### 12.4 Fast-by-default boundaries

- Critical home/listing/PDP/cart/checkout tasks must not depend on AI chat, personalization, advanced configurator, synchronous marketplace sync or heavy media editor.
- Defer nonessential product recommendations and below-the-fold media. Preserve likely LCP imagery priority; do not lazily load the primary LCP image merely for fewer requests.
- Give product images dimensions/responsive variants to protect layout stability. Use safe font fallback to avoid severe layout shift.
- Establish per-template transferred JavaScript, media and CPU budgets **after profiling a representative implementation**; do not invent fixed thresholds or assert current site passes.
- Re-test basic browsing and checkout with optional AI/recommendations disabled and enabled. Heavy future additions must not degrade already-approved core path.
- CX-08 owns reproducible lab test profiles and field p75 quality evidence. No field PASS claim without sufficient real-user observations.

---

## 13. Screen microcopy / content safety examples

These are **illustrative Indonesian copy candidates**, not final approved brand/legal/commercial text.

| Context | Safer draft | Avoid |
| --- | --- | --- |
| No stock confirmation | “Ketersediaan belum bisa dipastikan. Periksa lagi atau hubungi kami.” | “Stok aman, pasti dikirim” |
| MTO product | “Produk dibuat setelah pesanan memenuhi persyaratan yang berlaku.” | “Langsung dikirim hari ini” |
| Cart | “Ditambahkan ke keranjang. Ketersediaan diperiksa kembali saat checkout.” | “Stok sudah milik Anda” |
| Price changed | “Harga atau biaya berubah. Tinjau total terbaru sebelum melanjutkan.” | Quietly update amount |
| Shipping missing | “Opsi pengiriman belum dapat dihitung untuk alamat ini.” | “Gratis ongkir” default |
| Payment action pending | “Kami masih memeriksa status pembayaran. Jangan melakukan pembayaran ulang sebelum status jelas.” | “Pembayaran sukses” from URL |
| Order accepted; pay pending | “Pesanan tercatat; pembayaran belum terkonfirmasi.” | “Pesanan lunas” |
| Checkout outcome unknown | “Kami belum bisa memastikan hasil proses ini. Periksa status atau minta bantuan.” | “Gagal—bayar lagi sekarang” |
| Fulfillment label only | “Pesanan sedang disiapkan untuk diserahkan ke kurir.” | “Dalam pengiriman” |
| Customer asks refund | “Permintaan penanganan diterima untuk ditinjau sesuai kebijakan.” | “Refund disetujui” |

Copy must be reviewed against existing service rights, commercial policy, provider terms and the applicable customer language/brand source before public use.

---

## 14. Founder workload and backstage service handoff

### 14.1 Human/system responsibilities

| Stage | Can be delegated if approved | Founder/human still needed | Evidence that matters |
| --- | --- | --- | --- |
| Product publishing | Template, content checks, variant import assistance | Approve actual offer, price and sellability | Authorized publish/offer record |
| Purchase intake | Structured order acceptance and notification | Resolve exceptional commercial ambiguity | Accepted order identity and items |
| Payment | Trusted status projection, governed provider reconciliation, ordinary notifications | Investigate irreconcilable monetary discrepancies | Financial source; never AI judgment |
| Fulfillment preparation | Pick/pack list, label task, address validation where supported | Physically pick, inspect, pack and hand over | Actual stock/QC/carrier evidence |
| Customer updates | Event-grounded status messaging, accessible self-service | Handle exceptions, service disputes, goodwill decisions | Approved message event and actual status |
| Marketplace order | Governed correlation/dedupe and queue | Resolve true external/internal mismatch | Channel reference and canonical order |
| Returns | Structured case intake, policy explanation | Verify eligibility, item inspection and authorized refund decisions | Service/finance records |

### 14.2 Founder attention design

A successful normal order should not create multiple independent manual tasks to confirm the same facts. Exceptions must identify exact reason, urgency, source, affected customer/order and one next actionable step. A notification that cannot be acted upon is noise, not automation success.

### 14.3 Manual-touch observational schema

For a controlled synthetic rehearsal or approved pilot, record `scenario`, `customer_task_completion`, `submitted_input_count`, `founder_retyping_count`, `founder_clarification_count`, `founder_manual_status_reply_count`, `physical_action_minutes`, `exception_handling_minutes`, `provider_cost`, `retry_count`, `duplicate_effect_count`, `actual_evidence_source`, `limitations`.

The program must not claim zero human work: sourcing, quality, packing and courier handoff remain physical until a genuinely different operating arrangement is adopted. Metrics and target thresholds belong to CX-09 after baseline evidence is gathered.

---

## 15. DP-05 proposed refinement inventory

These are **new discovery labels**, not approved CX4 functional requirements. Their parent references indicate exactly where each improvement belongs; all **42** existing CX4 functional requirements remain preserved.

| Proposal ID | Measurable proposed refinement | Parent mapping / first relevant slice |
| --- | --- | --- |
| `DP05-RQ-01` | Browsing differentiates zero results from unavailable catalog and offers appropriate reset/retry | `CX4-FR-003..004`, `CX-S1` |
| `DP05-RQ-02` | PDP preserves essential fit/variant/pricing facts despite gallery failure | `CX4-FR-005..009`, `CX-S1` |
| `DP05-RQ-03` | Product eligibility changes are explained at the selection decision, with no substitution | `CX4-FR-006..007/009`, `CX-S1` |
| `DP05-RQ-04` | Cart explicitly says it is not a reservation absent actual reservation proof | `CX4-FR-011..014`, `CX-S1` |
| `DP05-RQ-05` | Cart recalculation and promotion expiration show affected amounts before proceeding | `CX4-FR-013/015..016`, `CX-S1` |
| `DP05-RQ-06` | Unavailable cart data is not displayed as genuinely empty cart | `CX4-FR-017`, `CX-S1` |
| `DP05-RQ-07` | Guest path is prominent when and only when commercial/security approval exists | `CX4-FR-018..019`, `CX-S1` |
| `DP05-RQ-08` | Shipping unavailable/ineligible/changed is distinguished without invented zero fee | `CX4-FR-020/028`, `CX-S1` |
| `DP05-RQ-09` | Customer reviews exact item, address, taxes/fees, method and total before binding action | `CX4-FR-021..022`, `CX-S1` |
| `DP05-RQ-10` | Material change after review requires explicit user reconfirmation | `CX4-FR-016/021..023`, `CX-S1` |
| `DP05-RQ-11` | Pending/unknown payment outcome has authoritative check/recovery path, never blind repeat | `CX4-FR-023..027`, `CX-S1` |
| `DP05-RQ-12` | Confirmation separates accepted order, financial state and fulfillment evidence | `CX4-FR-026/029..030`, `CX-S1` |
| `DP05-RQ-13` | Privacy-scoped order/help links do not leak private customer/organization information | `CX4-FR-029/031..032`, `CX-S1` |
| `DP05-RQ-14` | Imported marketplace events are clearly labeled by source and deduplicated through approved boundaries | `CX4-FR-033..034/041`, `CX-S2` conditional |
| `DP05-RQ-15` | Normal accepted order yields usable operator context without duplicate transcription | `CX4-FR-035..036`, `CX-S1` |
| `DP05-RQ-16` | Optional AI/recommendation fail-off leaves ordinary retail fully usable and measured | `CX4-FR-010/037/039/042`, `CX-S3` conditional |
| `DP05-RQ-17` | Current terms validated before repeat purchase, waitlist or preorder action | `CX4-FR-038/040`, `CX-S3` conditional |
| `DP05-RQ-18` | All core commerce states preserve understandable accessibility/reduced-motion behavior | `CX4-FR-003..037`, `CX-S1` |
| `DP05-RQ-19` | Unsupported P0 retail CTA is removed or qualified; real assisted path remains visible | `CX4-FR-001..002`, `CX-S0` |
| `DP05-RQ-20` | Founder/admin and actual provider spend measured alongside customer task success | `CX4-FR-035..037/042`, `CX-S1/S3` |

### 15.1 Requirement delta disposition

- `REFINE_EXISTING`: All 20 proposals currently map to at least one established CX4 requirement; they should be incorporated into detailed UX criteria, test fixtures or child document sections after independent review.
- `NEW_PARENT_FR`: **NONE PROPOSED**. Avoid artificially inflating the master PRD.
- `MODIFY_BUSINESS_POLICY`: **NONE AUTHORIZED**.
- `MODIFY_FINANCIAL_TRANSACTION_CONTRACT`: **NONE AUTHORIZED**.
- `RELEASE_ACTIVATION`: **NONE AUTHORIZED**.

### 15.2 Preservation crosswalk — all 42 existing functional IDs

This table verifies **coverage**, not customer/engineering acceptance. Exact current wording lives in CX-04 and must not be rewritten from this condensed table.

| Existing CX4 requirement IDs | Experience chapter(s) in this DP-05 | Related acceptance evidence direction |
| --- | --- | --- |
| `CX4-FR-001..002` | 0, 2, 3, 13 | Accurate P0 public routes and non-fake offer |
| `CX4-FR-003..004` | 4, 12 | Search/filter/sort and unavailable vs empty fixtures |
| `CX4-FR-005..010` | 4, 5, 12 | PDP facts, variant, fit, media, optional recommendations |
| `CX4-FR-011..017` | 6 | Cart recovery, promotion, stock and updated terms |
| `CX4-FR-018..019` | 7 | Guest/identity and minimal validated contact data |
| `CX4-FR-020..022` | 8, 9 | Shipping/fee eligibility, itemized final review |
| `CX4-FR-023..027` | 9, 10, 11 | Payment/replay, unknown outcome and secure confirmation |
| `CX4-FR-028..029` | 8, 11 | Unsupported destination and private scoped lookup |
| `CX4-FR-030..032` | 11, 13, 14 | Fulfillment/care/returns truth |
| `CX4-FR-033..034` | 14 | External source labels and replay boundaries |
| `CX4-FR-035..037` | 12, 14 | Operator snapshot, notifications, no-AI safe path |
| `CX4-FR-038..042` | 0, 12, 15, 17 | Optional reorder/bundles/preorder/channels/AI gated |

The consecutive ranges above cover `CX4-FR-001..042` once as a partition. Existing `CX4-BR-001..022` and `CX4-AC-001..038` remain normative **within their current draft package only**, pending valid approval, and are not displaced by `DP05-RQ-*`.

---

## 16. Proposed acceptance and negative scenario pack

**All entries below are `PROPOSED / NOT_EXECUTED` and cannot be reported as PASS.** They refine existing acceptance rather than replacing it. Financial/security ones explicitly require independent backend evidence.

| Scenario | Given / When / Then | Evidence requirement | Existing CX4 trace |
| --- | --- | --- | --- |
| `DP05-AC-01` | Given P0 Shop informational page without sale eligibility, when user follows CTA, then no fake active cart/pay path appears | Current source/browser + content policy | `CX4-AC-001..004` |
| `DP05-AC-02` | Given successful no-match search, when filters are removed, then helpful results or true empty state appears, not service error | Browser/search fixture | `CX4-AC-006` |
| `DP05-AC-03` | Given failed catalog source, when opening a collection, then error/retry is distinct from zero published products | Fault-injection browser | `CX4-AC-007` |
| `DP05-AC-04` | Given accessible PDP with gallery script disabled, when viewed on mobile/keyboard, then fit/size/material/price basis remain available | Browser/a11y/manual test | `CX4-AC-012` |
| `DP05-AC-05` | Given invalid or stale variant, when selected/add requested, then transaction eligibility is denied without silent substitution | UI + authoritative negative test | `CX4-AC-008..011` |
| `DP05-AC-06` | Given last unit appears available, when two users attempt accepted purchase, then backend denies conflicting accepted effects; losers receive correction | Concurrency E2E in disposable env | `CX4-AC-017/019` |
| `DP05-AC-07` | Given item enters cart but reservation not created, when cart shown, then no reserved/guaranteed-stock claim appears | Browser + reservation evidence | `CX4-AC-013` |
| `DP05-AC-08` | Given expired discount or updated price, when checkout starts, then difference and revised payable shown before continuation | Pricing/business + UI negative | `CX4-AC-015..016` |
| `DP05-AC-09` | Given cart source times out, when cart opens, then unknown/retry rather than empty cart is shown | Fault injection | `CX4-AC-018` |
| `DP05-AC-10` | Given approved ordinary guest checkout, when customer starts, then guest path is discoverable and does not reveal another customer's data | UX + independent authz | `CX4-AC-020/031` |
| `DP05-AC-11` | Given invalid address/region, when delivery chosen, then actionable field error or ineligible-method explanation appears with other fields retained | Browser + shipping negative | `CX4-AC-021..022` |
| `DP05-AC-12` | Given shipping rate changes after review, when user confirms, then new total and changed source explained and explicit reconfirmation required | Price/shipping E2E + browser | `CX4-AC-023..024` |
| `DP05-AC-13` | Given exact valid checkout, when final review opens, then items, quantity, source-backed charges, payable and material terms can be checked/corrected | UX + financial contract check | `CX4-AC-023` |
| `DP05-AC-14` | Given duplicate taps/refresh, when one governed purchase intent is accepted, then duplicate user actions do not produce duplicate accepted order/charge | Browser + idempotency/concurrency | `CX4-AC-025` |
| `DP05-AC-15` | Given provider redirect reports success but trusted payment still pending, when result opens, then UI shows pending/unknown, not paid | Provider simulation + canonical state | `CX4-AC-026` |
| `DP05-AC-16` | Given provider callback delayed and buyer returns/retries, when checking payment, then source reconciliation precedes any new charge intent | Provider E2E + finance | `CX4-AC-027..029` |
| `DP05-AC-17` | Given payment status cannot be fetched, when opening confirmation, then UI reports cannot verify and provides safe next step | Fault injection + UX | `CX4-AC-026..030` |
| `DP05-AC-18` | Given expired private receipt URL, when unauthorized browser opens it, then no order existence or personal details leak | Independent server-side negative test | `CX4-AC-031` |
| `DP05-AC-19` | Given carrier label generated but no handoff proof, when order viewed, then UI does not claim dispatched/delivered | Fulfillment evidence + browser | `CX4-AC-032` |
| `DP05-AC-20` | Given refund request submitted, when customer sees acknowledgement, then it is not described as completed refund | Service/finance + browser | `CX4-AC-033` |
| `DP05-AC-21` | Given duplicate external marketplace order event, when ingested, then one permitted canonical commercial effect remains | Channel idempotency E2E | `CX4-AC-034` |
| `DP05-AC-22` | Given accepted order with vendor/packing work ahead, when operator opens work, then SKU/variant/qty/destination and next authorized action available without retyping | Controlled operator rehearsal | `CX4-AC-035` |
| `DP05-AC-23` | Given notification or AI service unavailable, when retail transaction proceeds, then payment/order truth is unchanged and a non-AI route remains | Fault-injection/regression | `CX4-AC-036..037` |
| `DP05-AC-24` | Given historic order used for reorder, when creating new cart, then current eligible variant, price, inventory and shipping reconfirmed | Product E2E | `CX4-AC-038` |
| `DP05-AC-25` | Given slow mobile/reduced-motion setting, when PDP/cart/checkout used, then critical content and actions remain accessible without optional rich media | Manual a11y + lab performance | `CX4-AC-004/012/037` |
| `DP05-AC-26` | Given customer presses Back after address validation error, when correcting a field, then lawful valid selections remain while sensitive/payment secrets are not retained improperly | Privacy/UX/security | `CX4-AC-021/030` |
| `DP05-AC-27` | Given unexpected tax/fee cannot be established, when calculating binding amount, then checkout does not claim complete total or charge by default | Finance negative + UX | `CX4-AC-023..024` |
| `DP05-AC-28` | Given manual delivery/support exception, when founder handles order, then physical action requires actual completion evidence rather than AI/UI timer | Operator + fulfillment evidence | `CX4-AC-032/035` |

### 16.1 Evidence provenance rules

- Browser screenshot alone does **not** prove payment integrity, idempotency, finance source, backend authorization or physical fulfillment.
- Backend tests alone do **not** prove product clarity, accessibility or mobile task completion.
- A passing static accessibility scanner does **not** prove WCAG conformance; manually evaluate critical forms, focus, notices and provider transitions.
- Staging/ephemeral provider simulation must be explicitly identified. No unapproved real payment, courier shipment, production vendor order or production-data access is permitted for document validation.
- No test in this section has been executed by the author; requirements cannot be labeled `PASSED` until actual independent execution evidence exists.

---

## 17. UX research, usability fixtures and pilot economics

### 17.1 Proposed customer research tasks

| Research ID | Participant and task | What to observe |
| --- | --- | --- |
| `DP05-UX-01` | First-time mobile buyer finds a plain tee for intended use | Navigation clarity, language, search versus browse |
| `DP05-UX-02` | Fit-uncertain buyer selects size using guide | Size confidence, comprehension, correction |
| `DP05-UX-03` | Customer faces sold-out variant during cart review | Response and ability to correct without confusion |
| `DP05-UX-04` | Guest shopper attempts authorized checkout | Ease of finding guest, registration friction, data minimization |
| `DP05-UX-05` | Shopper discovers delivery fee change | Comprehension and willingness to reconfirm/abandon |
| `DP05-UX-06` | Shopper reads pending-payment result after returning from provider | Understands they must not blindly repeat payment |
| `DP05-UX-07` | Returning customer asks about shipment with label but no handoff | Status comprehension and appropriate support intent |
| `DP05-UX-08` | Low-connectivity user loses catalog/cart source mid-step | Error-versus-empty distinction and recovery |
| `DP05-UX-09` | Keyboard/screen-reader user selects variant and completes review | Semantics, focus, announced status/error and labels |
| `DP05-UX-10` | Founder rehearses multiple simultaneously accepted retail orders | Duplicate transcription, exception triage and physical-work boundary |

Recruit representative people outside author/builder for actual usability findings. Synthetic walkthroughs reveal logic problems but are **not customer validation**. Pre-register task success definition, sample, device/network, script, data permissions and evidence retention before field tests; do not invent a pass percentage without a baseline.

### 17.2 Synthetic scenario pack

- `DP05-FIX-01`: Published ready-stock garment, two valid sizes, one invalid size, shipping area supported.
- `DP05-FIX-02`: Product price changes after the customer saves a cart; discount also expires.
- `DP05-FIX-03`: Customer's shipping postcode is unsupported; no rate is available.
- `DP05-FIX-04`: Two buyers race for the last authorized unit.
- `DP05-FIX-05`: Payment provider redirects to success but backend never receives valid confirmation during initial test window.
- `DP05-FIX-06`: Customer refreshes a pending payment three times and taps pay again.
- `DP05-FIX-07`: Authorized guest tries to open unrelated order confirmation.
- `DP05-FIX-08`: Shipment label created but parcel remains physically with founder.
- `DP05-FIX-09`: Marketplace repeats same external event; existing canonical order already recorded.
- `DP05-FIX-10`: AI, personalization and rich media disabled on a slow phone; ordinary purchase must remain possible where otherwise eligible.

All fixtures are invented controlled-test conditions, **not evidence of real TeeStock inventory, prices, buyers, providers or accepted transactions**.

### 17.3 Metrics and anti-metrics

| Metric | What it can illuminate | Guardrail |
| --- | --- | --- |
| Eligible task completion | Can the user actually buy or reach legitimate assisted route? | Do not count invalid/unapproved checkout attempts as conversions |
| Variant correction rate | Sizing and product-choice comprehension | Separate normal variant browsing from actual mistakes |
| Abandonment by stage | Unexpected friction or insufficient offer relevance | Attribution is hypothesis, not fact without research |
| Checkout error recovery | Ability to fix address, price, service and payment uncertainty | Count unresolved/uncertain states separately |
| Payment reconciliation exception | Integrity and customer effort | Do not optimize by suppressing genuine exceptions |
| Duplicate accepted effect count | Financial/commercial safety | Must not be disguised as two legitimate user intents |
| Founder retyping / manual touch | Real automation benefit | Track physical work separately |
| Support contact per accepted order | Status clarity or defect signals | Do not discourage customers with legitimate concerns |
| Device-scoped field Core Web Vitals | Experience under actual conditions | p75 only with sufficient qualified data |
| Provider/AI cost per legitimate order | Long-term unit economics | Do not count novelty as ROI |

### 17.4 Release and exit criteria

- **Product candidate complete:** Experience deltas mapped to existing CX4 IDs, critical success/error/unknown flows detailed, testable acceptance and open decisions recorded.
- **Product accepted:** Owner and independent UX/documentation reviewer accept the applicable product scope/risks, and all material conflicts resolved or explicitly controlled.
- **Engineering ready:** Head Engineering separately validates finance, inventory, identity, API/provider, tax/shipping, concurrency and operational dependencies; produces and seeks approval for any bounded IC/WP.
- **Retail release ready:** Actual authorized platform, provider, data, support, accessibility/performance and independent security/transaction evidence satisfy applicable release gates; this document cannot grant that status.

---

## 18. Decisions, dependency gates and stop conditions

### 18.1 Owner decisions not presumed closed

| Existing decision | Why it matters now | Default noncommittal position |
| --- | --- | --- |
| `CX4-DEC-01` | First truly sellable retail assortment | Design with synthetic products, no activation |
| `CX4-DEC-02` | Eligible guest checkout | Product preference only; security review required |
| `CX4-DEC-03..05` | Payment methods, order authority, stock reservation | No provider/financial implementation chosen by UX |
| `CX4-DEC-06..07` | MTO/preorder sellability | Assisted or disabled until explicitly proven |
| `CX4-DEC-08..10` | Tax/fees, delivery regions, promo policy | Display only approved calculated terms |
| `CX4-DEC-11..12` | Cart retention and cancellation rights | Do not assume access/retention or universal refunds |
| `CX4-DEC-13` | First marketplace provider | Readiness research; CX-07 owns detailed adapter constraints |
| `CX4-DEC-14` | Empirical performance budgets | Profiling before budget freeze |
| `CX4-DEC-15` | Finance failure alerts for founder | Exception-only, no hidden retry or spam |

`CX-DP-07` (retail checkout readiness) is explicitly deferred in the consolidated package decision registry. This DP-05 research does **not** convert that into a launch approval.

### 18.2 Hard stop / escalation conditions

Stop any attempt to freeze an affected requirement for implementation if:

1. User-visible binding amount conflicts with authoritative pricing/fees/taxes.
2. Transaction receipt, payment success or refund interpretation conflicts with MGBOS finance contract or unresolved R5 assurance.
3. Stock/reservation or concurrent purchase semantics are not sufficiently specified and tested.
4. Cross-organization/guest access might reveal private order, address, invoice or payment information.
5. Approved product/legal return rights or provider entitlements are unknown but the UI would promise them.
6. Payment provider charge outcome could be repeated or marked paid without authoritative verification.
7. The design assumes an active customer commerce capability that repository/runtime evidence does not establish.
8. A developer would have to invent order/payment enums, endpoints, credit authority or shipping guarantees from this PRD.
9. An existing Head Engineering PR/work-package owns the same target files and there is no approved integration route.
10. Representative UX or performance measurement reveals a material blocker not covered by the current acceptance contract.

### 18.3 Product-to-engineering questions (not decisions made here)

- Which authoritative eligibility check defines current sellable SKU/quantity and potential stock reservation point?
- What command identity/fingerprint and reconcilable outcome are exposed through an approved consumer action without leaking internals?
- What are the permitted public guest retrieval boundaries, expiry and anti-enumeration safeguards?
- How will approved payment-provider statuses map to customer messages while preserving ledger source truth?
- Which final totals, taxes and delivery charges are legally/commercially confirmed per channel?
- How are unavailable service, stale totals, re-entry, refresh and concurrent stock purchase tested in an independent ephemeral environment?
- What current actual source/performance baseline can support template-specific frontend budgets?
- Which exceptions genuinely require founder attention instead of an automated retry?

These are routed to the correct semantic owners. This proposal does not answer them by inventing architecture.

---

## 19. Integration contract — refine CX-04, not fork it

### 19.1 Proposed adoption locations

| Existing target | Bounded future revision |
| --- | --- |
| CX-04 §4–6 | Screen-level search/listing/PDP/variant and eligibility refinements from DP-05 §§3–5 |
| CX-04 §7–8 | Commercial review and cart/recalculation refinements from §§6, 8 |
| CX-04 §9–12 | Guest, delivery, checkout/payment truth and recovery refinements from §§7–10 |
| CX-04 §13–16 | Confirmation, operator handoff, quality and monitoring from §§11–14 |
| CX-04 §17–19 | Reconcile DP05-RQ-01..20 and DP05-AC-01..28 without changing existing ID meaning |
| CX-04 §20–26 | Link to research, preserve open decisions and independent review obligations |
| CX-03 | Reference global UI patterns only if owner confirms no duplication |
| CX-06 | Review customer-visible order tracking/guest access definitions |
| CX-07 | Review marketplace source and external provider boundary only |
| CX-08 | Adopt approved acceptance/evidence direction, not author-reported PASS |
| CX-09 | Reconcile capability slices, research validation and founder benefit |
| CX-PKG-TRACE-R1.csv | Modify only through authorized traceability change preserving all parent rows |

### 19.2 File-change discipline

**This DP-05 deliverable:** New standalone, explicitly non-canonical Markdown file at the proposed destination above.

**Do not edit now:** Existing CX-04, CX-01, CX-02, CX-03, CX-06, CX-07, CX-08, CX-09, business-policy sources, MGBOS architecture, code, migration, PR #73 files, package README or trace CSV. Later integration must use a bounded PR after checking actual current `main`, exact blob SHAs, competing PRs, owner review and governance validators.

**No direct Builder handoff:** An approved product delta is not an IC/WP. Head Engineering must decide risk/architecture/implementation routing independently; no self-issued merge/deploy authority.

### 19.3 Scope of next documentation task

Next planned document is **DP-06 — Customer Account & Service Experience Deepening**, refining CX-06. DP-05's confirmation and customer status passages are inputs to CX-06, not competing security or service authority.

---

## 20. Reproducibility and reference register

### 20.1 Pinned internal sources

Use the inspected SHA for reproducible source review. GitHub links are source evidence, **not** links to an operating ecommerce platform.

- [CX-04 Commerce & Checkout v0.1.1](https://github.com/Rizkybuilds/bisnishub/blob/57eaafbb0ceef99a5fc6b2d77d724f6ff510727d/systems/mgbos/docs/product/teestock-customer-platform/cx-04-commerce-checkout-experience.md)
- [CX-01 Master PRD v0.1.1](https://github.com/Rizkybuilds/bisnishub/blob/57eaafbb0ceef99a5fc6b2d77d724f6ff510727d/systems/mgbos/docs/product/teestock-customer-platform/cx-01-master-prd.md)
- [CX-03 Experience Design & Interaction](https://github.com/Rizkybuilds/bisnishub/blob/57eaafbb0ceef99a5fc6b2d77d724f6ff510727d/systems/mgbos/docs/product/teestock-customer-platform/cx-03-experience-design-interaction-spec.md)
- [CX-06 Customer Account & Service](https://github.com/Rizkybuilds/bisnishub/blob/57eaafbb0ceef99a5fc6b2d77d724f6ff510727d/systems/mgbos/docs/product/teestock-customer-platform/cx-06-customer-account-service-experience.md)
- [CX-07 Omnichannel Integrations](https://github.com/Rizkybuilds/bisnishub/blob/57eaafbb0ceef99a5fc6b2d77d724f6ff510727d/systems/mgbos/docs/product/teestock-customer-platform/cx-07-omnichannel-external-integration-requirements.md)
- [CX-08 Experience Quality & Acceptance](https://github.com/Rizkybuilds/bisnishub/blob/57eaafbb0ceef99a5fc6b2d77d724f6ff510727d/systems/mgbos/docs/product/teestock-customer-platform/cx-08-experience-quality-acceptance-contract.md)
- [CX package trace artifact](https://github.com/Rizkybuilds/bisnishub/blob/57eaafbb0ceef99a5fc6b2d77d724f6ff510727d/systems/mgbos/docs/product/teestock-customer-platform/CX-PKG-TRACE-R1.csv)
- [CX package decision register](https://github.com/Rizkybuilds/bisnishub/blob/57eaafbb0ceef99a5fc6b2d77d724f6ff510727d/systems/mgbos/docs/product/teestock-customer-platform/CX-PKG-DECISIONS-R1.md)
- [TeeStock Commerce Overview](https://github.com/Rizkybuilds/bisnishub/blob/57eaafbb0ceef99a5fc6b2d77d724f6ff510727d/bisnis/teestock/03-commerce/commerce-overview.md)
- [TeeStock Catalog and Merchandising](https://github.com/Rizkybuilds/bisnishub/blob/57eaafbb0ceef99a5fc6b2d77d724f6ff510727d/bisnis/teestock/03-commerce/catalog-merchandising-system.md)
- [TeeStock Pricing Framework](https://github.com/Rizkybuilds/bisnishub/blob/57eaafbb0ceef99a5fc6b2d77d724f6ff510727d/bisnis/teestock/08-finance/pricing-framework.md)
- [TeeStock Order Fulfillment](https://github.com/Rizkybuilds/bisnishub/blob/57eaafbb0ceef99a5fc6b2d77d724f6ff510727d/bisnis/teestock/07-operations/order-fulfillment.md)
- [Solo-Founder Launch Roadmap](https://github.com/Rizkybuilds/bisnishub/blob/57eaafbb0ceef99a5fc6b2d77d724f6ff510727d/docs/roadmaps/solo-founder-launch-roadmap.md)
- [Documentation Constitution](https://github.com/Rizkybuilds/bisnishub/blob/57eaafbb0ceef99a5fc6b2d77d724f6ff510727d/docs/governance/documentation-constitution.md)

### 20.2 External research — methodology, not TeeStock evidence

- [W3C — WCAG 2.2 SC 3.3.4 Error Prevention (Legal, Financial, Data)](https://www.w3.org/WAI/WCAG22/Understanding/error-prevention-legal-financial-data.html).
- [W3C — WCAG 2.2 SC 3.3.1/3.3.3 Input Errors and Suggestions](https://www.w3.org/WAI/WCAG22/Understanding/input-assistance.html).
- [web.dev — Core Web Vitals](https://web.dev/articles/vitals).
- [Baymard — Current State of Checkout UX](https://baymard.com/research-articles/current-state-of-checkout-ux).

---

## 21. Author QA and release disposition

### 21.1 Author self-review claims

- Source baseline verified and pinned; `CX4-FR-001..042`, `CX4-BR-001..022` and `CX4-AC-001..038` identified without renumbering.
- Proposed ID families `DP05-SC`, `DP05-RQ`, `DP05-AC`, `DP05-UX`, and `DP05-FIX` explicitly separate from existing CX4 identifiers.
- Price, stock, taxation, payment, refunds, logistics and customer identity delegated to their authoritative semantic owners.
- P0 informational/assisted entry separated from P1 eligible checkout; future AI/personalization and omnichannel capability not silently activated.
- Positive and negative experience pathways are presented together, especially stale price, out-of-stock, payment uncertainty, duplicate action, privacy and shipment proof.
- Independent architecture/security/finance/performance/usability tests: **NOT_PERFORMED**; no PASS claim should be inferred.

### 21.2 Candidate release state

`COPY_READY / AUTHOR_SELF_REVIEWED / DRAFT / NON-CANONICAL`.

`OWNER_PRODUCT_APPROVAL`: `PENDING` for material product decisions.

`INTEGRATED_INTO_CX04`: `NO`.

`INDEPENDENT_PRODUCT_QA`: `NOT_PERFORMED`.

`REAL_CUSTOMER_RESEARCH`: `NOT_PERFORMED`.

`TECHNICAL_AND_PROVIDER_FEASIBILITY`: `NOT_VERIFIED`.

`IMPLEMENTATION_AUTHORIZED`: `NO`.

### 21.3 Next step

Save this new document into the proposed repository directory as a DRAFT if desired. Before any future changes to CX-04 or canonical promotion, review latest actual main and existing product-PR state, confirm semantic compatibility, run repository validations, and obtain applicable separate product and engineering reviews. Next documentation work item: **DP-06 Customer Account & Service Deepening**.

**End of document.**
