---
canonical_id: proposed.mgbos.product.teestock-customer-platform.dp02-signature-storyboards-r2
status: DRAFT
version: 0.2.0
owner: Rizky
author: ChatGPT / AI Co-Founder & Product Strategy
approver: PENDING_OWNER_AND_INDEPENDENT_PRODUCT_REVIEW
document_class: product-research-and-experience-change-proposal
scope: teestock-customer-platform-cx02-signature-experience-deepening
normative_authority: NONE
repository: Rizkybuilds/bisnishub
source_ref: main
source_baseline_commit: 57eaafbb0ceef99a5fc6b2d77d724f6ff510727d
source_cx02_blob_sha: f77bca68b26ebf1132b1076f152e72dcbba0a7df
source_cx01_blob_sha: 3602550f5d54c8b58512014b54ec916d9b75f3e4
proposed_destination: systems/mgbos/docs/product/teestock-customer-platform/CX-PKG-DP02-SIGNATURE-EXPERIENCE-STORYBOARDS-R2.md
depends_on:
  - docs/governance/documentation-constitution.md
  - docs/governance/canonical-source-map.md
  - docs/roadmaps/solo-founder-launch-roadmap.md
  - bisnis/teestock/10-product-tech/digital-product-vision.md
  - bisnis/teestock/10-product-tech/website-information-architecture.md
  - systems/mgbos/docs/product/teestock-customer-platform/cx-01-master-prd.md
  - systems/mgbos/docs/product/teestock-customer-platform/cx-02-customer-journeys-service-blueprint.md
  - systems/mgbos/docs/product/teestock-customer-platform/CX-PKG-TRACE-R1.csv
  - systems/mgbos/docs/product/teestock-customer-platform/CX-PKG-DECISIONS-R1.md
baseline_checked: 2026-10-17
preparation_mode: READ_ONLY_PRODUCT_AND_SERVICE_DESIGN
self_review: PERFORMED
independent_review: NOT_PERFORMED
actual_user_research: NOT_PERFORMED
prototype_execution: NOT_PERFORMED
engineering_readiness: NOT_ASSESSED
implementation_authorization: NONE
merge_authorization: NONE
deployment_authorization: NONE
supersedes: null
---

# DP-02 — TeeStock Signature Experience Storyboards & Service Handoffs R2

**Document disposition:** `COPY_READY / AUTHOR_SELF_REVIEWED / DRAFT / NON-CANONICAL`  
**Document role:** Bounded, experience-level deepening proposal for the **existing** `cx-02-customer-journeys-service-blueprint.md`, not a new canonical service blueprint or implementation contract.  
**Destination:** `systems/mgbos/docs/product/teestock-customer-platform/CX-PKG-DP02-SIGNATURE-EXPERIENCE-STORYBOARDS-R2.md`

> **Authority warning:** This proposal does not activate a new service, approve customer contact channels, guarantee stock or production capacity, define MGBOS database states, authorize AI tools or providers, or alter the Solo-Founder Launch Roadmap. The storyboard scenes are **future-state product requirements for evaluation**, not screenshots of implemented interfaces. Only a separately reviewed and approved documentation integration may change the existing CX-02. Customer tests and user research proposed below have **not** been executed.

## 1. Executive result

### 1.1 What we are deepening

The current CX-02 v0.1.1 already contains eight journey blueprints (`CX2-BP-01..08`), founder-operation mappings, risk and recovery cases, synthetic test fixtures, 26 candidate acceptance scenarios, and an existing traceability package. Replacing it with a shorter document would lose valuable information and destabilize downstream references.

This DP-02 packet adds the missing *reviewable customer experience sequence* across six signature experiences (`SX-01..06`) while retaining the current service-blueprint ownership and original IDs. Each signature makes explicit: screen or touchpoint, customer mental model, interaction, display truth, permitted next action, backstage owner, solo-founder workload, and recovery.

### 1.2 Product outcome

**Powerful underneath, effortless on the surface.**

The interface must make sophisticated apparel ordering, procurement, transaction and follow-up feel understandable without hiding uncertainty or transferring avoidable administrative work to the founder.

**Customer success:** people can find the correct path, submit accurate intent, understand the difference between a request and a commitment, complete authorized actions, and recover from interruptions.

**Founder success:** information is structured and reusable at the point of customer interaction; routine acknowledgements and reminders can be delegated when authorized; physical sourcing, quality control, packing, dispatch and important commercial judgments remain visibly assigned.

### 1.3 Two perspectives, never conflated

- **Storyboard / frontstage:** What the customer sees, thinks, chooses, and is allowed to do.
- **Service blueprint / backstage:** What an authorized business service, deterministic rule, optional AI, founder, vendor or provider does to support that step.

A customer-facing status label is a **projection**, not a new canonical business-state transition. A screen saying “Permintaan diterima” is forbidden until the authorized intake actually confirms receipt. A browser payment redirect is not proof of settled/confirmed payment.

### 1.4 Evidence and reality boundary

Inspected repository baseline: `main@57eaafbb0ceef99a5fc6b2d77d724f6ff510727d`.

At this revision PR #75 (CX docs) and PR #76 (premium public entry) were merged; the `teestock` app includes informational public entry, `/custom`, `/business`, and `/support/contact` routes. The inspected contact page discloses that direct contact channels are still being prepared. A working public intake, retail checkout, secure customer account or live marketplace adapter is **not evidenced by these observations**. Active deployment and operational customer outcomes are `NOT_VERIFIED`.

The DP-01 Master PRD Deepening R2 artifact exists in the current documentation-planning conversation/local output but was **not found on the inspected GitHub main**. It is a proposed input, not repository authority. Its six `SX` concepts and source mappings are reused here only as design hypotheses to reconcile.

## 2. Relationship with the eight existing journeys

| Signature experience | Primary existing blueprint | Related existing blueprint(s) | Experience-specific downstream semantic owner | Proposed earliest applicable slice |
|---|---|---|---|---|
| `SX-01` Intelligent Product Discovery | `CX2-BP-01` / `JRN-01` | `CX2-BP-04` | CX-03 navigation; CX-04 catalog | `CX-S0` informative / `CX-S1` sellable |
| `SX-02` Guided Custom Studio | `CX2-BP-02` / `JRN-02` | `CX2-BP-05`, `CX2-BP-08` | CX-05 Custom/artwork; CX-03 interaction | `CX-S0` assisted inquiry / `CX-S3` rich editor |
| `SX-03` Business Procurement Workspace | `CX2-BP-03` / `JRN-03` | `CX2-BP-05`, `CX2-BP-06` | CX-05 B2B quote; CX-06 account | `CX-S0` assisted / `CX-S2` gated workspace |
| `SX-04` Frictionless Commerce | `CX2-BP-04` / `JRN-04` | `CX2-BP-06` | CX-04 checkout; CX-08 transaction UX assurance | `CX-S1` |
| `SX-05` Living Order Experience | `CX2-BP-06` / `JRN-06` | `CX2-BP-05` | CX-06 status/support; CX-05 proof | `CX-S0` assisted / `CX-S1/S2` secure self-service |
| `SX-06` Connected Commerce | `CX2-BP-07` / `JRN-07` | `CX2-BP-06`, `CX2-BP-08` | CX-07 provider/channel; CX-06 support | `CX-S0` source provenance / `CX-S2` selective integration |

`JRN-05` exact-artwork approvals and `JRN-08` optional AI are **cross-cutting service journeys**, not removed by this six-experience grouping. The proposed `SX` labels are discovery anchors, not replacements for `CX2-BP-*`, `JRN-*`, existing master FR/AC IDs or a commitment that a particular implementation slice ships as one bundle.

## 3. Storyboard notation and safety rules

Each scene uses a stable **DP02 scene ID**, such as `DP02-SX02-S03`. These IDs exist only within this proposal until appropriately integrated.

- **C:** Customer (retail, custom, purchaser, approver, or guest).
- **F:** Customer-facing webpage, mobile interaction, or approved assisted touchpoint.
- **B:** Governed MGBOS business logic / authorized actor operating it.
- **D:** Approved deterministic validation, notification or workflow logic; *not assumed deployed*.
- **A?:** Optional bounded AI assistance; never independent business authority.
- **H:** Founder, including physical activities and high-impact human decisions.
- **X:** Approved external vendor, marketplace, courier, payment, or messaging provider.

**Presentation truth levels:**

1. **Informational:** Published description or general process; no implied transaction.
2. **Draft / entered:** User input not yet accepted by a governed service.
3. **Received:** Durable accepted inquiry or permitted request, with authoritative reference.
4. **Under review:** Approved manual or policy-driven review, not a price/date/production commitment.
5. **Committed:** Authorized and version-correct commercial/order/payment facts, each under its own canonical owner.
6. **Unavailable / uncertain:** Current truth cannot be verified; show truthful recovery, not guessed success/empty status.

No storyboard invents actual stock figures, prices, response SLAs, lead times, provider credentials, supported upload limits, routes, or external API capabilities. All examples are *synthetic research fixtures*. “Preview” is **not** “production proof”; accepted quote is **not** “payment confirmed”; courier label is **not** carrier pickup evidence.

## 4. SX-01 — Intelligent Product Discovery

**Primary customer:** first-time visitor on an ordinary mobile phone.  
**User job:** “Saya mau menemukan kaos yang tepat tanpa harus ngerti struktur bisnis atau istilah produksinya.”  
**Entry:** search result, social reference, shared link or homepage.  
**End:** relevant available path, qualified inquiry or eligible product selection; no unsupported checkout promise.  
**Stages:** S0 informational service discovery; S1 approved catalog/PDP.

### 4.1 Customer storyboard

| Scene | Customer sees / understands | Action and visible feedback | Backstage and handoff | Negative path / recovery |
|---|---|---|---|---|
| `DP02-SX01-S01` Arrival | Clear TeeStock promise, readable hero, primary intent choices | Choose `Shop`, `Customize`, `For Business` or `Build Merch` based on need | F serves approved content; no lead created from pageview | Missing content shows functional navigation/help rather than blank animation |
| `DP02-SX01-S02` Intent | One recommended next path; alternatives remain discoverable | Open selected job without forced account | F routes to verified published destination; H none | Unavailable route is labeled informational, not masquerading as buyable |
| `DP02-SX01-S03` Explore | Catalog or service overview relevant to intent | Browse categories; search/filter only when actual sellable catalog available | B supplies authorized published assortment/offer facts | No results / stale listing gives reset, explanation and safe alternative |
| `DP02-SX01-S04` Understand | Product material, sizing, variants, availability mode, price qualifier | Inspect variant/size without misreading color or stock | B/product policy owns actual offer; F shows provenance/freshness as needed | Unknown stock/price triggers honest verification path, not false ATS |
| `DP02-SX01-S05` Decide | Clearly differentiated `Learn more`, `Request quote`, or `Buy` for eligible offer | Continue to relevant authorized next action | F carries permitted intent context; B creates record **only after valid submission** | Browser back/deep link restores intent or guides to current equivalent |
| `DP02-SX01-S06` Re-enter | Previously selected category or product context where safe | Return without losing basic orientation or being forced into personalization | F maintains non-sensitive context subject to consent | Consent denied or personalization unavailable: ordinary browse remains functional |

### 4.2 Exact scope boundaries

At `CX-S0`, `Shop` and `Build Merch` may be informational if not sellable/active; their visual affordances must not simulate a live cart. At `CX-S1`, search, filters, product cards and PDP are permitted only for approved catalog data. Catalog performance cannot depend on loading editor, AI assistant, or unrelated marketplace runtimes.

**Moment of truth:** Customer can answer: *“Apakah ini produk/layanan yang saya butuhkan, apakah tersedia, dan tindakan apa yang bisa saya lakukan sekarang?”*

**Founder time saved (hypothesis):** fewer repetitive “produk apa yang tersedia / bedanya apa” questions. Not counted as realized until measured.

**Trace:** `CX1-FR-001..008`, `CX1-FR-020`, `CX1-FR-027`; `CX1-NFR-001..005`, `CX1-NFR-013`; `CX2-BP-01`; CX-03/04/08.

## 5. SX-02 — Guided Custom Studio

**Primary customer:** customer ordering synthetic 100 custom shirts, has a logo but uncertain about print method.  
**User job:** “Bantu gue menjelaskan kebutuhan dengan benar, jangan paksa gue paham teknik produksi.”  
**Entry:** `/custom` / appropriate assisted route; no claim that a public form is currently active.  
**End:** safely acknowledged structured request and governed reviewed quote; later, separately gated builder/proof ability.  
**Stages:** S0 assisted intake; S2 proof self-service if authorized; S3 standardized interactive builder.

### 5.1 Customer storyboard

| Scene | Customer sees / understands | Action and visible feedback | Backstage and handoff | Negative path / recovery |
|---|---|---|---|---|
| `DP02-SX02-S01` Start | Plain-language garment types and “how it works” | Choose garment/usage; no payment claim | F displays approved service scope | Unsupported class routes to consultation instead of false selectable option |
| `DP02-SX02-S02` Core specifications | Need-based inputs: approximate quantity, sizes if known, color, target date | Enter minimum fields; visible editable summary | D validates only approved rules; B still owns request acceptance | Missing/uncertain answer can be marked `belum tahu` if policy allows |
| `DP02-SX02-S03` Conditional guidance | Printing/placement questions only when meaningful | Optional guided explanations; AI, if present, is clearly assistive | A? may propose plain-language help; not choose authoritative recipe/price | AI disabled: all essential questions and submit path still work |
| `DP02-SX02-S04` Artwork readiness | Explicit `Upload permitted file` or `Desain belum siap` | User chooses path; upload, scanning/review state distinct | B/file-security owner approves intake; H reviews technical suitability | Unsupported format/failed upload: explain and preserve other entered details |
| `DP02-SX02-S05` Review | One concise specification summary, requested date, quote status **not final** | Edit an answer; confirm contact purpose and submit intent | F validates; accepted B handler later may create traceable request | Timeout/double tap: cannot assert receipt until confirmed or reconciled |
| `DP02-SX02-S06` Receipt | Stable reference **only after durable acceptance**; what remains under review | Customer sees next valid follow-up, no invented SLA | B confirms; D may notify from authoritative effect; H sees actionable queue | Unknown result displays `Belum dapat dikonfirmasi` with safe lookup/contact path |
| `DP02-SX02-S07` Review & proposal | Clarification request or current approved quotation with expiry/version when available | Clarify or review terms, not confuse estimate with quote | H checks vendor, costs, capacity, needed QC; B owns quote version/state | Vendor unavailable / requested date unrealistic: revise or decline without false promise |
| `DP02-SX02-S08` Advanced builder (future only) | Optional 2D/visual placement, permitted print area, variant preview, fidelity disclaimer | Configure **eligible** combinations; request proof or quote | B/production policy validates eligibility; A? optional, H handles exceptions | Unverified combination: assisted quote; preview never claims production approval |

### 5.2 Non-negotiable distinctions

`Draft input → Received request → Feasibility review → Approved quote → Accepted commercial action` are **customer journey concepts**, not new MGBOS state enums.

`Uploaded asset ≠ print-quality approved artwork ≠ exact-version customer-approved proof ≠ production release`.

Dates supplied by customers express **requested in-hand date**, not guaranteed dispatch/delivery. Price is final only when business policy and the authorized quotation/payment flow support that claim.

### 5.3 Founder service handoff

- **Delegation candidates:** minimum input validation, plain-language help, summarized brief, permitted receipt/notification, follow-up reminders, organized clarification queue, and draft quote preparation within policy.
- **Founder remains accountable:** supplier selection/negotiation, physical sampling when necessary, material procurement, commercial exceptions, physical production coordination, QC, packing and courier handoff.
- **Net-benefit condition:** measure time to clarify missing requirements and manual transcription **plus** review burden from AI-generated summaries. An agent that requires constant checking has not proven leverage.

**Moment of truth:** Customer knows what was submitted, what still needs human review, and what action is next; founder sees usable structured specifications without reconstructing chat.

**Trace:** `CX1-FR-009..019`, `CX1-FR-034`, `CX1-FR-038..040`, `CX1-FR-043`, `CX1-FR-046`; `CX2-BP-02`, `CX2-BP-05`, `CX2-BP-08`; CX-03/05/08/09.

## 6. SX-03 — Business Procurement Workspace

**Primary customer:** purchasing contact for synthetic 250 uniforms with a separate decision approver.  
**User job:** “Saya butuh proposal yang jelas, administrasi rapi, dan persetujuan yang bisa dipertanggungjawabkan.”  
**Entry:** `For Business` / assisted request route.  
**End:** valid inquiry and version-correct assisted quote; gated digital workspace for proven repeat needs.  
**Stages:** S0 human-assisted; S2 scoped digital procurement and repeat actions.

### 6.1 Customer storyboard

| Scene | Customer sees / understands | Action and visible feedback | Backstage and handoff | Negative path / recovery |
|---|---|---|---|---|
| `DP02-SX03-S01` Orient | B2B offerings and truthful review process | Select uniforms, event merch or corporate kit context | F shows approved service categories | Customer needing unsupported service gets consultation path |
| `DP02-SX03-S02` Requirement | Quantity/size distribution, organization context, needed-by date, delivery destination(s), documents | Enter partial verified information without being forced to solve internal production | D/B validate approved form and request; no assumed B2B login | Missing mandatory purchasing data is explained contextually, not silently guessed |
| `DP02-SX03-S03` Qualification | Whether sample, detailed artwork, special shipping or additional approval is needed | Review requirements and submit when authorized | B creates request with source; H reviews margin, vendor capacity and terms | Complex/credit/urgent requirement requires manual review, not instant final checkout |
| `DP02-SX03-S04` Quotation | Identified quote version, scope, inclusions/exclusions, valid-until and pricing conditions | Ask clarification or request revision through enabled channel | H approves commercial terms; B owns quote revision and business authority | Expired/superseded proposal cannot be “approved” from cached UI |
| `DP02-SX03-S05` Approval | Role-aware approval action **only after** secure organization identity exists | Authorized approver explicitly accepts **exact version** | B verifies organization membership/role and records required evidence | Viewer/foreign org cannot view protected documents or accept terms |
| `DP02-SX03-S06` Follow-up | Customer-readable procurement/order progress and required actions | Check evidence and next step; not raw production dashboard | F projects B-approved facts; H performs real work | Provider delay does not invent shipment or completion |
| `DP02-SX03-S07` Repeat (future) | Previously agreed product specification as reference, not same price guarantee | Start new request/reorder with current pricing and availability | B revalidates new intent; H reviews nonstandard changed terms | Historical item retired or new minimum quantity prompts fresh review |

### 6.2 Separate buyer, approver, and company identity

A shared company email or knowledge of quotation reference does not establish authority to approve. Role and organization boundaries belong to the existing MGBOS authorization owner and future audited customer identity solution. Early assisted approval remains valid where documented under existing policy; this storyboard does not authorize a new credit account or signed approval mechanism.

**Founder benefit hypothesis:** fewer proposal version disputes, re-entered specifications and manual chase messages. **Physical obligations remain:** sampling, sourcing, vendor coordination, QC and fulfillment.

**Moment of truth:** Buyer can tell *which version they are reviewing, who must act, and what is legally/operationally committed*.

**Trace:** `CX1-FR-012`, `CX1-FR-014..017`, `CX1-FR-029..034`, `CX1-FR-035`, `CX1-FR-037..039`; `CX2-BP-03`, `CX2-BP-05`, `CX2-BP-06`; CX-05/06/08.

## 7. SX-04 — Frictionless Commerce

**Primary customer:** retail buyer of an actually eligible standard SKU/variant.  
**User job:** “Saya ingin membayar dengan yakin tanpa langkah atau kejutan yang tak perlu.”  
**Entry:** approved sellable listing/PDP; **no S0 checkout implication**.  
**End:** one authorized order/payment outcome or honest recoverable uncertainty.  
**Stage:** S1 only after stock/price/payment/security gates.

### 7.1 Customer storyboard

| Scene | Customer sees / understands | Action and visible feedback | Backstage and handoff | Negative path / recovery |
|---|---|---|---|---|
| `DP02-SX04-S01` PDP | Correct product/variant, material, dimensions, sale mode and trustworthy price | Select size, color, quantity | B supplies eligible catalog, price and availability | Sold-out/MTO/preorder distinctly explained; no fake ready-stock badge |
| `DP02-SX04-S02` Cart | Selected items, quantities, price conditions; edit controls | Edit, remove, continue; no irreversible payment | D/B recompute or validate only when authorized | Variant retired/price changed prompts explicit correction/reconfirmation |
| `DP02-SX04-S03` Identity | Short necessary checkout fields and lawful contact expectations | Guest route only if approved; contact/address validation | Auth/PII owner validates data; no default public access to orders | Email/phone insufficient to reveal arbitrary previous orders |
| `DP02-SX04-S04` Review total | Item, discount, tax/fee/shipping when applicable, total payable and terms | Confirm deliberate financial intent | B owns amount/stock/order atomic authorization | Shipping or total still unknown: cannot silently charge an inferred amount |
| `DP02-SX04-S05` Payment action | Provider handoff and clear payment instructions | Initiate payment once; visible waiting state | Approved payment command/provider; B reconciles true outcome | Double-click/retry/redirect loss preserves exactly one valid business intent/effect |
| `DP02-SX04-S06` Pending | No misleading green “paid” on browser return alone | Wait, check status, use support/recovery | B/provider callback or authorized verification determines state | Callback delayed/outage: retain pending/uncertain with reference and safe recheck |
| `DP02-SX04-S07` Confirmation | Only verified accepted order/payment status, reference and next steps | Save receipt/track where permission allows | B authoritative order and payment; D notifications after confirmed event | Notification failed: source truth remains, founder discrepancy visible |
| `DP02-SX04-S08` After-sale | How to check status, request help or eligible return | Follow up without re-entering known order context | B/Customer Case/returns owners control resolution; H handles exceptions | Refund request not auto-approval; support service honors approved policy |

### 7.2 Trust invariants

- Customer sees final authorized amount **before** commercial commitment; no hidden changed charge.
- Payment success must derive from canonical/provider-authenticated evidence, not a query parameter or screenshot.
- Cart and order identity are distinct; repeat submission cannot silently create duplicate accepted orders.
- A valid refund, shipment or inventory claim belongs to its own authority, not frontend copy.

**Founder benefit hypothesis:** fewer “sudah dibayar belum?” status messages, manual receipt checks, duplicate orders and abandoned-cart clarification work.

**Moment of truth:** A customer can identify the exact financial state and next action after redirect, retry, or delayed confirmation.

**Trace:** `CX1-FR-006..007`, `CX1-FR-020..028`, `CX1-FR-029..033`, `CX1-FR-041..042`; `CX2-BP-04`, `CX2-BP-06`; CX-04/06/08.

## 8. SX-05 — Living Order Experience

**Primary customer:** Custom or retail customer seeking progress; B2B buyer with organization-scoped authority.  
**User job:** “Apa status sebenarnya, apakah gue perlu bertindak, dan siapa yang bisa membantu?”  
**Entry:** confirmed authorized reference; assisted channel at S0 or verified account/link at later slices.  
**End:** user understands current reliable status and next legitimate action, with contact/support escalation.  
**Stages:** S0 human-assisted status; S1 bounded status; S2 secure reusable workspace.

### 8.1 Customer storyboard

| Scene | Customer sees / understands | Action and visible feedback | Backstage and handoff | Negative path / recovery |
|---|---|---|---|---|
| `DP02-SX05-S01` Access | Appropriate link, approved human-help route, or gated account | Verify entitlement before revealing sensitive order detail | B/auth checks customer and organization scope | Guessable ID/foreign org link gives nondisclosing denial, not metadata leak |
| `DP02-SX05-S02` Overview | Clear headline: last **verified** event and “perlu tindakan saya?” | Scan active order/inquiry without reading internal status codes | F maps B facts to customer-safe language | Status source unreachable: `sementara tidak tersedia`, not “tidak ada pesanan” |
| `DP02-SX05-S03` Timeline | Verified milestones vs pending/expected steps visibly distinguished | Open detail only where useful | B supplies permitted evidence; H records physical truth | Vendor “siap” is not QC PASS; label printing is not courier pickup |
| `DP02-SX05-S04` Customer action | Exact work needing action: clarification, proof review or payment instruction when authorized | Complete only permitted action; show ack/result | B owns versioned approval/payment state, D may remind | Outdated proof/quote action stops and points to current version |
| `DP02-SX05-S05` Support | Contextual help without requiring customer to repeat known permitted facts | Request correction, complaint, assistance or return inquiry | B/service owner creates authorized request; A? may explain, H resolves exceptions | “Kasus diterima” not “refund disetujui”; privacy controls retained |
| `DP02-SX05-S06` Repeat | Relevant historical item/context only with permission | Start reorder/request for fresh validation | B revalidates current product, stock, price and actor authority | Retired product or changed terms result in alternative/assisted path |
| `DP02-SX05-S07` Delivery uncertainty | Truthful carrier status and last update time when available | Follow approved carrier/help link where eligible | X scan verified via approved connector/manual evidence; B owns projection | Missing carrier receipt: no invented `shipped` or `delivered` |

### 8.2 Customer Action Center (experience concept only)

A future customer overview should answer three prioritized questions: **What happened? What should I do? What happens next?** The screen shows only authorized, source-backed items. It is not a new internal task engine, case state machine, or blanket right to all organization documents.

**Founder benefit hypothesis:** fewer repeated status chats and document resends. Founder still inspects real goods, photographs/document proofs when required, resolves QC failures, packages and ships physical orders.

**Moment of truth:** The customer distinguishes **last confirmed fact**, **next required action**, and **unknown/estimated timing** without contacting the founder for routine facts.

**Trace:** `CX1-FR-016`, `CX1-FR-019`, `CX1-FR-029..037`, `CX1-FR-042..044`; `CX2-BP-05`, `CX2-BP-06`; CX-05/06/08.

## 9. SX-06 — Connected Commerce

**Primary actors:** customer shopping on a third-party marketplace; solo founder fulfilling via TeeStock/MGBOS when legally and technically permitted.  
**User job:** “Order dari channel mana pun tetap tertangani, tanpa status atau janji yang saling bertentangan.”  
**Entry:** external marketplace origin or approved manual channel source capture.  
**End:** one legitimate reconciled internal work item and channel-appropriate customer communication.  
**Stages:** S0 provenance/manual capture; S2 justified inbound integration; later outbound sync as separately proven.

### 9.1 Customer-facing and internal storyboard

| Scene | Customer sees / understands | Action and visible feedback | Backstage and handoff | Negative path / recovery |
|---|---|---|---|---|
| `DP02-SX06-S01` Buy externally | Checkout and commercial policy owned by actual marketplace | Customer purchases via platform’s supported flow | X originates external order and platform-specific identifiers | TeeStock cannot promise a website refund/approval action prohibited by X |
| `DP02-SX06-S02` Receive / ingest | Customer sees platform-confirmed outcome only | No need to manually repeat the same order details to TeeStock unless lawful process requires | Approved X connector or manual operation captures source, external ref and permissible fields | Provider unavailable → observed queue/manual fallback, not guessed successful import |
| `DP02-SX06-S03` Normalize | Usually no extra action for customer | Founder sees normalized eligible product/quantity/source context | B matches organization/channel, SKU mapping and durable command idempotency | Duplicate event/replay cannot duplicate canonical order or financial effects |
| `DP02-SX06-S04` Produce / fulfill | Customer receives provider-appropriate updates | May respond to authorized requests if provider permits | H buys/coordinates, checks QC, packs and hands to courier; B records supported evidence | Price/stock discrepancy goes to exception review, not silent inventory adjustment |
| `DP02-SX06-S05` Track | Accurate updates reflecting supported provider semantics | Customer uses provider-prescribed tracking/support | D publishes only approved events, X defines message/update permissions | Carrier status lags: show last verified information, do not invent delivery |
| `DP02-SX06-S06` Change / dispute | Correct platform-specific path for cancellation, refund, return | Uses permitted channel and authentic identity | B separates cancellation, refunds, settlement/payout and physical return; H reconciles exceptions | Conflict/status mismatch is surfaced for manual review, never silently forced to success |
| `DP02-SX06-S07` Channel outage | Honest information about what can and cannot be completed | Retry via platform or approved human support | X adapter backoff/reconciliation when authorized; D avoids blind high-risk retries | Lost event or uncertain side effect handled via evidence-first reconciliation |

### 9.2 Integration anti-goals

No promise of automatic Shopee/TikTok/Tokopedia integration, universal stock sync, direct marketplace data portability, off-platform refund, unlimited messaging or webhook access without actual provider contract and capability review. Each provider needs its own eligibility, API, fees, rate limits, privacy, state-mapping and operational recovery evidence.

**Founder benefit hypothesis:** less copy-paste of orders between channels, fewer discrepancies and fewer repeated fulfillment updates. Connector monitoring and reconciliation time must be counted as cost, not ignored.

**Moment of truth:** An external order creates exactly one legitimate internally traceable obligation when allowed, and no channel falsely claims an unsupported financial or logistics result.

**Trace:** `CX1-FR-041..046`, `CX1-FR-038..040`, `CX2-BP-07`, `CX2-BP-08`; CX-06/07/08/09.

## 10. Experience-wide screen and state inventory

The following is a **research/design inventory**, not approved routes, component names or required first-launch pages. UX behavior ownership remains CX-03 and domain-specific CX-04..07.

| Proposed screen / touchpoint | Signature(s) | Primary state(s) to specify | Required failure/recovery | Stage / owner |
|---|---|---|---|---|
| Public homepage & intent router | SX-01 | ready, unavailable-offer, navigation-focus | deep link, JS/media failure, no fake CTA | S0 / CX-03 |
| Custom landing | SX-02 | informative, assisted-route-active/unavailable | no current contact destination | S0 / CX-03/05 |
| Business landing | SX-03 | informative, qualification-needed | unsupported commercial claim | S0 / CX-03/05 |
| Shop/category listing | SX-01/04 | loading, ready, no-results, product-not-sellable | stale listing, filter reset | S1 / CX-04 |
| Product detail | SX-01/04 | eligible, unavailable, stock uncertain, variant invalid | price/availability reconfirmation | S1 / CX-04 |
| Custom stepper | SX-02 | untouched, partial, invalid, recoverable-draft | lost connection, conditional questions | S0 target / CX-05 |
| Artwork intake | SX-02/03 | not-ready, selected, uploading, received, review-needed | file invalid, upload interrupted | S0 assisted/S2 / CX-05 |
| Submission review & receipt | SX-02/03 | draft, pending-submit, accepted, uncertain | double submit, response lost | S0 target / CX-05/08 |
| Quote summary & versions | SX-02/03 | estimate, proposed, approved, expired, superseded | stale approval, missing authority | S0 assisted/S2 / CX-05 |
| Optional visual builder | SX-02 | eligible-config, invalid-config, preview, needs review | slow canvas/unsupported method | S3 / CX-05/03 |
| Cart | SX-04 | ready, edited, revalidation, invalid | price/stock change | S1 / CX-04 |
| Checkout | SX-04 | field-valid/invalid, amount-confirmable, provider-pending | failed shipping/identity/amount | S1 / CX-04 |
| Payment result | SX-04 | not-started, needs-action, pending, verified, failed | delayed callback, duplicate attempt | S1 / CX-04/08 |
| Confirmation | SX-02/04 | confirmed receipt vs unknown outcome | reload after commit, notification loss | S0/S1 / CX-04/05 |
| Customer overview | SX-05 | authorized, no-owned-items, unavailable-data | guest/foreign org denial | S1/S2 / CX-06 |
| Order detail/timeline | SX-05 | last-verified, action-required, delayed, unavailable | delayed vendor/courier evidence | S1/S2 / CX-06 |
| Proof review | SX-02/03/05 | draft proof, current approved version, superseded | stale version, actor unauthorized | S2 / CX-05 |
| Help/case request | SX-05 | help, submitted, unresolved, case update | wrong entitlement, no false refund | S0 assisted/S2 / CX-06 |
| Reorder flow | SX-03/05 | historical reference, current revalidation | variant discontinued, changed terms | S2 / CX-05/06 |
| Marketplace status/fallback | SX-06 | external-source, imported, discrepancy, retrying | provider unavailable, duplicate event | S2 / CX-07 |
| Optional AI contextual help | SX-02/05/06 | not-loaded, grounded response, uncertainty, escalation | AI unavailable, rate/cost limit | gated / CX-06/07 + JARVIS |

**Screen inventory is not site navigation.** Multiple rows may share one route; design must minimize initial cognitive load. Screens may be absent until relevant implementation authorization, commercial availability, identity and service gates pass.

## 11. Cross-cutting experience contracts

### 11.1 Accessible interaction and mobile-first behavior

1. Information hierarchy remains clear without motion or animation.
2. Keyboard, touch, visible focus, zoom/reflow, and relevant assistive technology access must support essential tasks.
3. Form errors describe the problem in text and preserve unrelated valid responses where safe.
4. Progress indication is not an excuse for blocking a recoverable user action.
5. Heavy editor, marketplace SDK, visual preview or AI dependencies may not be required to render an ordinary homepage, Custom inquiry or product selection.
6. Preferred reduced-motion mode must retain all essential state meaning.
7. Target accessibility and route-specific performance evaluation remain governed by CX-03/CX-08, not newly invented values in this storyboard.

### 11.2 Interruption and uncertain responses

- **Unsubmitted input:** may be locally recoverable only under an approved privacy/sensitive-data policy; do not promise persistence where it has not been designed.
- **Submission pending:** disable accidental duplicates at UI level, but authoritative dedup/reconciliation belongs to B and must be independently proven.
- **Accepted request:** stable reference exists only when B confirms it.
- **Checkout pending:** payment and order state separately determined by authorized sources; do not reissue blind commands after a timeout.
- **Status unavailable:** display inability to verify; never replace unavailable with “tidak ada order”, “lunas”, “selesai”, or “terkirim”.

### 11.3 AI assistance contract

AI may summarize a customer's self-described need, explain published specifications, propose clarification questions, or prepare drafts when permissioned. AI may not claim approved price, vendor capacity, accepted quotation, customer credit, refund entitlement, payment receipt, physical QC, shipment or production approval on its own. Human escalation and ordinary deterministic interaction must remain usable with AI off. Tool scopes and execution policy remain JARVIS/MGBOS-owned.

### 11.4 Customer privacy and channel restrictions

Customers only see their own authorized information, or appropriately approved organization information. Shared order references are not sufficient evidence of identity. Source and purpose of notifications matter. Marketplace policies and payment/logistics providers may constrain cross-channel actions and messaging; this document is not an API entitlement.

## 12. Solo-founder operational blueprint — synthetic 100-shirt scenario

**Fixture:** 100 custom shirts, logo supplied, date requested, vendor manufacturing, customer later requests artwork change. This is not a claim about current price, MOQ, capacity, or lead time.

| Step | Customer-facing goal | System / deterministic automation (candidate, if approved) | Optional AI (candidate) | Founder physical / decision work | Evidence or exception |
|---|---|---|---|---|---|
| Intake | Requirement complete | Capture structured intent, flag missing mandatory fields, record source | Plain-language clarifications | Review unusual requests only | Actual accepted request reference |
| Artwork | Valid asset path | Record permitted file receipt and review need | Explain allowed source formats | Check real print suitability or commission expert review | File receipt distinct from approved proof |
| Feasibility | Realistic proposal | Retrieve governed material/vendor/pricing inputs | Draft customer-friendly summary | Verify supplier capability, physical sample/cost and quoted commitment | Vendor/cost evidence, versioned quote |
| Commercial acceptance | Understand binding terms | Present authorized quote and required next steps | Explain meaning, never approve | Approve special terms and fulfillment readiness when required | Exact quote version, actor authorization |
| Procurement | Prepare physical order | Generate governed shopping/production checklist | Optional item descriptions | Buy materials or coordinate purchase and delivery | Purchase/cost and supplier confirmation |
| Production | Know real status | Surface only verified milestones and due actions | Draft update based on source facts | Visit/coordinate vendor; handle rework | Recorded assignment/progress evidence |
| QC | Distinguish pass from work-in-progress | Capture QC checklist/outcome as governed | No authority to assert pass | Physically inspect pieces and resolve defects | QC evidence |
| Packaging | Prepare shipment | Produce approved packing details, label docs if available | Routine copy draft | Pack/label, hand off to courier | Package count, receipt/evidence |
| Delivery | Accurate tracking | Map verified carrier events where supported | Explain next action | Handle carrier exceptions / missing parcel | Carrier pickup/delivery confirmation |
| Aftercare | Resolve without repetition | Link case to relevant order where permitted | Safe FAQ/draft reply | Decide legitimate replacement/refund exceptions | Case/return/refund authority and evidence |

**Failure rehearsal:** Suppose customer requests a different artwork after production has begun. The system may record the request and notify the founder, but it must not silently overwrite the approved production artifact. The founder and business authorities determine feasibility, re-quote or restart requirements, and customer-visible next steps. Existing production and financial effects remain traceable.

**Founder efficiency rule:** Saved time = removed manual work **minus** added monitoring, correction, AI supervision, reconciliation and maintenance overhead. Physical actions are never counted as removed merely because the dashboard displays them.

## 13. Proposed falsification-oriented acceptance scenarios

All below are **candidate experience scenarios, NOT EXECUTED**, with DP02-specific IDs. They do not replace `CX2-AC-001..026`, `CX1-AC-*`, `CX3-AC-*` or any security/financial assurance test owned elsewhere.

| ID | Given / When | Expected observable result | Primary evidence owner |
|---|---|---|---|
| `DP02-AC-01` | New mobile visitor with no prior TeeStock knowledge chooses an offer | Correct intent route and availability understandable without explanation; record misunderstandings | UX / SX-01 |
| `DP02-AC-02` | Visitor selects an unavailable Shop/Merch capability | No fake purchase/portal entry; truthful alternative visible and usable | UX / SX-01 |
| `DP02-AC-03` | Custom customer does not know print method or sizes | Can state uncertainty and proceed through permitted minimum request path | UX / SX-02 |
| `DP02-AC-04` | Customer selects “artwork not ready” | Submission does not require a fabricated file; summary truthfully records absence | UX / SX-02 |
| `DP02-AC-05` | Accepted intake response is lost then customer retries | No false receipt or duplicate actionable request; safe lookup/recovery is demonstrated | CX-05/QA/Security / SX-02 |
| `DP02-AC-06` | Customer requests impossible in-hand date | Requested date is captured but unsupported delivery commitment is not made | Product/Ops / SX-02 |
| `DP02-AC-07` | Quote v2 supersedes v1; purchaser tries to approve v1 | Old approval unavailable/denied by governing authority; version and next step clear | CX-05/Security / SX-03 |
| `DP02-AC-08` | User from another organization guesses quote/order reference | No protected existence or contents leaked; safe generic response | Security / SX-03/05 |
| `DP02-AC-09` | Customer edits cart after price/stock change | Correct revalidation and explicit reconfirmation; no charge at undisclosed terms | CX-04/QA / SX-04 |
| `DP02-AC-10` | Provider redirect returns but payment callback is delayed | Payment remains pending/unverified, with stable recovery and no false paid state | Payments/QA / SX-04 |
| `DP02-AC-11` | Customer opens status when backend data is unavailable | “Unable to verify” state, not “no orders” or “delivered”; help path available | CX-06/QA / SX-05 |
| `DP02-AC-12` | Courier label exists but no pickup receipt | Customer must not see authoritative shipped/delivered assertion | Fulfillment/QA / SX-05 |
| `DP02-AC-13` | Customer requests refund/support | A request may be acknowledged, not falsely auto-approved | CX-06/Ops / SX-05 |
| `DP02-AC-14` | Same marketplace event arrives twice | One legitimate internal business effect, provider identity retained, discrepancy visible | CX-07/Integration/QA / SX-06 |
| `DP02-AC-15` | Provider returns uncertain result then recovers | Reconciliation-first recovery; no blind duplicate orders/refunds/shipments | Integration/QA / SX-06 |
| `DP02-AC-16` | AI disabled / unavailable during core inquiry | Customer retains a usable deterministic/assisted route | UX/AI QA / SX-02/05 |
| `DP02-AC-17` | Rich builder not opened during basic mobile browsing | Core route does not depend on editor/3D/AI bundles; measure agreed lab and later field targets | Frontend/QA / SX-01/02 |
| `DP02-AC-18` | Founder rehearses same permitted synthetic request manually and via structured intake | Count and compare transcription, follow-up, physical work, correction and monitoring time; no unmeasured savings claim | Product/Ops / cross-cutting |
| `DP02-AC-19` | Customer navigates using keyboard/screen reader/reduced motion | Correct task action and error feedback preserved for tested combination; findings recorded | Accessibility UX/QA / cross-cutting |
| `DP02-AC-20` | First-time buyer reads estimate, quote and payment states | Research participant can distinguish uncommitted estimate, approved quote and verified payment; misunderstandings recorded | Product/UX / cross-cutting |

**Evidence template:** `scenario_id | source_commit | prototype/build_revision | segment | task/context | device/browser/AT | fixture | expected | observed | PASS/FAIL/NOT_VERIFIED | issue | reviewer | date`. An author reading the table is **not** execution evidence; high-risk backend effects require their own properly isolated end-to-end tests and audit.

## 14. Research plan, not fabricated research

### 14.1 Participant profiles

Recruit, as feasible and with appropriate consent, users representing: (a) first-time mobile apparel buyers, (b) Custom novices with and without artwork, (c) experienced Custom buyers, (d) B2B requesters and distinct approvers, (e) returning customers seeking delivery/support, and (f) users with relevant accessibility needs. Include founder/operator rehearsal separately. Founder and AI roleplay can expose logical gaps; they do **not** replace independent customer evidence.

### 14.2 Task set and hypotheses

| Study | Task | Risk to falsify | Useful observations |
|---|---|---|---|
| Intent comprehension | “Find how to request custom shirts” | Four choices feel like internal departments | Selected path, hesitation, incorrect CTA |
| Custom clarity | “Request 100 shirts with an unfinished logo” | Process requires impossible technical knowledge | Missing fields, misunderstanding, time, questions |
| Quote comprehension | “Explain what you can approve here” | Estimate/quote/acceptance conflated | Statements, incorrect approval expectation |
| Retail trust | “Buy eligible size and handle stock change” | Unclear availability/hidden changes | Wrong assumption, recovery, abandonment reason |
| Status confidence | “Find the next action and last confirmed update” | Timeline pretends unverified milestone | Confidence, wrong action, support dependence |
| Channel boundary | “Resolve marketplace delivery complaint” | Website contradicts provider-owned policy | Wrong-channel attempt, clarity of action |
| Founder rehearsal | “Handle synthetic 100-shirt order plus one vendor delay” | Automation shifts work rather than reduces it | Admin minutes, physical minutes, override/reconciliation minutes |

Record raw observations and limitations, not only preferences or a subjective premium score. Quantitative acceptance thresholds should be proposed **after** a baseline and the recruitment/device scope are explicit. Do not assert statistical representativeness of small qualitative samples.

### 14.3 Research evidence disposition

- `ASSUMPTION`: hypothesized behavior from documentation or author reasoning.
- `SYNTHETIC_REHEARSAL`: founder/QA dry run using artificial fixtures.
- `PARTICIPANT_OBSERVED`: real user behavior under documented task conditions.
- `LAB_MEASURED`: repeatable instrumented performance/accessibility evidence with stated device/build.
- `FIELD_MEASURED`: appropriately sampled real usage metrics.
- `NOT_VERIFIED`: no applicable evidence.

Research participant personal data and unredacted sensitive customer records must not be committed to a public repository.

## 15. Requirements and ownership reconciliation

| Signature | Existing parent requirement coverage | Existing blueprint coverage | Proposed enhancement location (once approved) |
|---|---|---|---|
| `SX-01` | `CX1-FR-001..008`, `020`, `027` | `CX2-BP-01`, `CX2-BP-04` | CX-02 BP-01 moment-of-truth/screens; CX-03 public IA; CX-04 listing/PDP |
| `SX-02` | `CX1-FR-009..019`, `034`, `038..040`, `043`, `046` | `CX2-BP-02`, `CX2-BP-05`, `CX2-BP-08` | CX-02 BP-02 handoffs; CX-05 intake/artwork/proof; CX-03 visual states |
| `SX-03` | `CX1-FR-012`, `014..017`, `029..035`, `037..039` | `CX2-BP-03`, `CX2-BP-05`, `CX2-BP-06` | CX-02 BP-03/06 handoffs; CX-05 quote/approval; CX-06 org access |
| `SX-04` | `CX1-FR-006..007`, `020..028`, `029..033`, `041..042` | `CX2-BP-04`, `CX2-BP-06` | CX-04 cart/checkout; CX-08 financial-state UX acceptance |
| `SX-05` | `CX1-FR-016`, `019`, `029..037`, `042..044` | `CX2-BP-05`, `CX2-BP-06` | CX-06 action center; CX-05 versioned proof; CX-08 secure states |
| `SX-06` | `CX1-FR-038..046` | `CX2-BP-07`, `CX2-BP-08` | CX-07 channel/source mapping; CX-06 support rights; CX-09 integration gates |

**Parent ID conservation:** All 46 existing `CX1-FR-001..046` remain unchanged. All existing 15 `CX1-NFR-001..015` and `CX2-BP-01..08` remain unchanged. This table is a **many-to-many candidate experience-to-parent mapping**; it does not replace the package-wide 46-row `CX-PKG-TRACE-R1.csv` or its approval statuses.

**Boundary and overlapping semantics:** Exact-version quote approval remains governed commerce. Proof approval belongs to existing artwork/production source. Customer Action Center is **an interface view**, not a new entity. An AI-assisted custom experience is optional and does not inherit transactional write privileges.

## 16. Open decisions, unknowns and stop conditions

### 16.1 Owner decision register cross-reference

Use the existing `CX-PKG-DECISIONS-R1.md`, not a competing new decision registry:

- `CX-DP-01..02`: earliest premium entry and public intake direction. Product direction discussed; formal decisions still `OPEN` in repository.
- `CX-DP-03..06`: actual sellable categories, pricing/date claims, contact route and provider budget. Still requires evidence and Owner policy decisions.
- `CX-DP-07..10`: checkout/account/B2B/reorder gates. Future conditional decisions.
- `CX-DP-11`, `CX-DP-16`: provider selection and outbound sync. No assumed authorization.
- `CX-DP-12`, `CX-DP-17`: advanced builder/visual proof value and readiness. Evidence first.
- `CX-DP-13`: existing P1 help versus later advanced AI must be explicitly resolved for each scoped feature.
- `CX-DP-14..15`: founder measurement timing and advanced organization access remain deferred/conditional.

### 16.2 Material unknowns

- Whether an approved real contact channel or structured intake endpoint is operational at public activation.
- Which garment offers, price sources, turnaround policy and vendor slots are actually validated.
- Which file types/limits and storage/security controls are approved for artwork.
- Whether customer guest/account identity and protected read models are ready.
- Whether any target external provider permits the proposed action, with what cost and recovery conditions.
- Which real customer cohorts find the storyboard understandable and useful.
- Whether the rich builder reduces rework enough to justify mobile performance and maintenance cost.
- How much founder time is actually saved after AI checking and exception recovery.

### 16.3 Stop conditions

Stop **integration/adoption of the affected requirement**, not all product planning, when:

1. It would contradict a currently ACTIVE TeeStock business policy or Solo-Founder launch sequence.
2. It silently changes MGBOS state, permissions, pricing/payment, QC/fulfillment or organizational identity semantics.
3. It assumes an unverified provider capability or approved channel.
4. It invents current customer research, technical execution, production readiness or financial outcome.
5. It overlaps another PR/work package with unclear document ownership.

Record the exact conflict/source and route to its semantic owner and Head Engineering as needed. Do not resolve by author preference.

## 17. Controlled integration roadmap (future, not authorization)

This DP-02 artifact is a **new, standalone research addendum**. It is deliberately safe to place beside the CX package without deleting or truncating `cx-02-customer-journeys-service-blueprint.md`.

After Owner-specific documentation-integration approval:

1. Resolve fresh `main` and any open overlapping PRs. Do not assume current SHA still applies.
2. Read existing CX-02 and source change since this baseline.
3. Add compact `SX-01..06` navigation mapping near existing CX-02 Section 2; leave existing `JRN-01..08` and `CX2-BP-01..08` identifiers intact.
4. Enrich existing BP sections **in place** with selected scene/state distinctions, not duplicate complete narrative blocks.
5. Route screen anatomy/prototype specifics to CX-03; retail to CX-04; Custom/B2B to CX-05; account/service to CX-06; integrations to CX-07; verification methods to CX-08; stage/economics to CX-09.
6. Preserve current `CX2-AC-001..026`, risk/unknown/fixture registers; use a governed crosswalk to connect DP02 candidate ACs, rather than renumbering old tests.
7. Recompute exact ID and semantic trace coverage in existing trace files; reconcile decision and stage crosswalk only if an **approved** material delta requires it.
8. Run repository reference/format/governance checks, independent product UX QA, and source/behavior contradiction checks.
9. Publish only a scoped docs PR; no app code, SQL, provider integration, payment change, merge or deploy is implied.

**No integration until authorized.** Antigravity may later be handed an exact bounded docs-only work package; the Head Engineering scope and governance must be respected.

## 18. Author QA, limitations and disposition

| Check | Author result | Verification boundary |
|---|---|---|
| Actual main revision and CX-02 blob | PASS | GitHub connector read-only at pinned SHA |
| New file destination collision | PASS | Path not present on inspected `main` |
| CX-02 original eight blueprints retained | PASS (design) | New supplemental file only; source unchanged |
| Six distinct SX storyboards | PASS (author inspection) | Six signature sections with bounded scenes and recovery |
| Stage vocabulary | PASS (design) | CX-S0..S3 kept separate from P0/P1/P2 priority and pilot authority |
| Existing FR and BP identity | PASS (author inspection) | Existing parent IDs used; no new canonical state/entity/API |
| Screen/state inventory | PASS (author inspection) | Explicit touchpoints, error modes and semantic owners |
| Founder versus AI and physical work | PASS (author inspection) | Workload and authority modeled distinctly |
| Candidate acceptance & research | PASS (design) | Hypotheses/test plans explicit, not fabricated execution |
| Real user research | NOT_VERIFIED | No recruited customer testing performed |
| Prototype, browser, performance results | NOT_PERFORMED | This is not a functioning prototype |
| Independent Product/UX review | NOT_PERFORMED | Author self-review is not independent assurance |
| Post-copy repository validators | NOT_PERFORMED | Run after approved integration/push |
| Product Owner adoption | PENDING | Strategic intent agreed; individual decision register remains open |

**Release disposition:** `DP02_DOCUMENT = COPY_READY / SELF_REVIEWED / NON_CANONICAL_DRAFT`  
**Existing CX-02:** `PRESERVED / NOT_MODIFIED`  
**DP-02 target experience mapping:** `PROPOSED / READY_FOR_OWNER_PRODUCT_REVIEW`  
**Formal CX-02 revision and adoption:** `NOT_AUTHORIZED`  
**Engineering/build/deploy:** `NONE AUTHORIZED`

### 18.1 Future change policy

Do not regenerate this document for cosmetic churn. A subsequent revision requires material user evidence, a discovered contradiction, a changed canonical source/commit, an Owner decision, a source QA failure, or an independent audit finding, with version and impact recorded.

### 18.2 Exactly one next product documentation task

**DP-03 — Experience Design & Interaction Deepening**: deepen the existing `cx-03-experience-design-interaction-spec.md` without overwriting it; specify screen anatomy, accessible component-state behavior, responsive layouts, progressive visual enhancement, design decision dependencies, prototype coverage and measurement so “premium and lightweight” becomes an observable contract.

---

## 19. Source register

**Pinned GitHub baseline:** `57eaafbb0ceef99a5fc6b2d77d724f6ff510727d`.

- Existing CX-01: `systems/mgbos/docs/product/teestock-customer-platform/cx-01-master-prd.md`
- Existing CX-02: `systems/mgbos/docs/product/teestock-customer-platform/cx-02-customer-journeys-service-blueprint.md`
- Existing CX-03..09: corresponding sibling documents in `systems/mgbos/docs/product/teestock-customer-platform/`.
- CX package traceability: `CX-PKG-TRACE-R1.csv`, `CX-PKG-STAGE-CROSSWALK-R1.md`.
- Owner decisions: `CX-PKG-DECISIONS-R1.md`.
- Canonical business source: `bisnis/teestock/10-product-tech/digital-product-vision.md` and `website-information-architecture.md`.
- Document authority: `docs/governance/documentation-constitution.md`; `docs/governance/canonical-source-map.md`.
- Cross-business launch sequencing: `docs/roadmaps/solo-founder-launch-roadmap.md`.
- Public entry implementation at inspected revision: `systems/mgbos/apps/teestock/src/app/page.tsx`, `src/app/custom/page.tsx`, `src/app/business/page.tsx`, `src/app/support/contact/page.tsx`.
- Previous local DP-01 planning output: `CX-PKG-DP01-MASTER-PRD-DEEPENING-R2.md` (not yet observed on inspected main; non-canonical proposed input).

**External methodology (not proof of TeeStock results):**

- Nielsen Norman Group — Service Blueprinting Template: https://www.nngroup.com/articles/service-blueprinting-template/
- Nielsen Norman Group — Service Blueprinting FAQ: https://www.nngroup.com/articles/service-blueprinting-faq/
- GOV.UK — Map and understand a user's whole problem: https://www.gov.uk/service-manual/design/map-a-users-whole-problem
- GOV.UK — Creating an experience map: https://www.gov.uk/service-manual/user-research/creating-an-experience-map
- W3C WCAG 2.2 — Error Identification: https://www.w3.org/WAI/WCAG22/Understanding/error-identification

**End of document.**
