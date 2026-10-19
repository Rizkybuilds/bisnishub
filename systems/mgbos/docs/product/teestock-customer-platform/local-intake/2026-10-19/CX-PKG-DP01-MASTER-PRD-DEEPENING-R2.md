---
canonical_id: proposed.mgbos.product.teestock-customer-platform.dp01-master-prd-deepening-r2
status: DRAFT
version: 0.2.0
owner: Rizky
author: ChatGPT / AI Co-Founder & Product Strategy
approver: PENDING_OWNER_AND_INDEPENDENT_PRODUCT_REVIEW
document_class: product-research-and-change-proposal
scope: teestock-customer-platform-cx01-deepening
normative_authority: NONE
repository: Rizkybuilds/bisnishub
source_ref: main
source_baseline_commit: 57eaafbb0ceef99a5fc6b2d77d724f6ff510727d
source_cx01_blob_sha: 3602550f5d54c8b58512014b54ec916d9b75f3e4
baseline_checked: 2026-10-17
preparation_mode: READ_ONLY_PRODUCT_DISCOVERY
self_review: PERFORMED
independent_review: NOT_PERFORMED
actual_user_research: NOT_PERFORMED
implementation_authorization: NONE
merge_authorization: NONE
deployment_authorization: NONE
supersedes: null
---

# DP-01 — TeeStock Customer Platform Master PRD Deepening R2

**Document disposition:** `COPY_READY / AUTHOR_SELF_REVIEWED / DRAFT / NON-CANONICAL`  
**Document purpose:** A bounded, evidence-grounded product-definition change proposal for the *existing* `cx-01-master-prd.md`, not a second authoritative PRD and not a builder work package.

**Target existing PRD:** `systems/mgbos/docs/product/teestock-customer-platform/cx-01-master-prd.md`  
**This file's intended path:** `systems/mgbos/docs/product/teestock-customer-platform/CX-PKG-DP01-MASTER-PRD-DEEPENING-R2.md`

> **Scope safety:** This document defines what to deepen and how to review it. It **does not replace** the 115,653-character source PRD, change any `CX1-FR-*` or `CX1-NFR-*` ID, activate customer functionality, approve provider use, or override business, MGBOS, JARVIS, or existing roadmap authority. A future controlled documentation PR may integrate accepted deltas *in place*, preserving existing source content and traceability.

---

## 1. Executive decision and precise problem

The existing CX-01 v0.1.1 already defines 46 functional requirements, 15 non-functional requirements, customer roles, 8 master-level journeys, product-level acceptance, business rules, risk/unknown registers, external authorities, and the `CX-S0..S3` release model. **The missing product work is primarily depth, clarity of differentiation, experience-level falsifiability, and the relationship between customer delight and founder capacity — not a shortage of headline features.**

### 1.1 Desired customer and founder outcome

**Customer:** A premium, feature-rich, responsive, accessible TeeStock experience that helps shoppers, custom buyers, and business purchasers complete legitimate tasks with low cognitive load, little repetition, understandable commercial terms, and reliable next actions.

**Solo founder:** Customer input becomes reusable, structured work. The founder still procures materials, coordinates physical production, performs physical QC/packing/courier handoff, and approves material commitments. Automation should remove repetitive transcription, routine status answering, reminders, and coordination overhead without requiring continuous AI babysitting.

**North Star:** **Powerful underneath, effortless on the surface.**

### 1.2 Product laws proposed for CX-01 clarification

1. **Capability depth is not menu density.** Advanced options appear in context; the basic path stays simple.
2. **Premium is observable behavior.** Clear content, visual consistency, keyboard and screen-reader support, predictable interaction, and graceful recovery are first-class requirements. Decorative effects are optional.
3. **Trust beats conversion tricks.** Estimate, approved quotation, payment confirmation, available stock, and production status each need distinct truth sources.
4. **One customer action, one governed business intent.** Repeated taps, browser refresh, delayed callbacks, and channel retries cannot silently double-create operational commitments.
5. **Human work is explicit, not hidden.** System tasks and necessary physical founder work remain visible in the service blueprint and acceptance evidence.
6. **AI is optional and subordinate.** Useful as explanation, drafting, and contextual help; never a source of unauthorized monetary, production, refund, or identity authority.
7. **Futures are designed but not pretended live.** Elaborate configurator, marketplace syncing, and customer workspace may be designed early and enabled only when independently justified and safe.
8. **No copy of MGBOS internals into public UX.** Customer-facing projections remain privacy-scoped and easy to understand.

---

## 2. Source and authority boundaries

### 2.1 Exact baseline and observed state

| Evidence | Verified interpretation |
|---|---|
| `main` at `57eaafbb0ceef99a5fc6b2d77d724f6ff510727d` | Exact inspected GitHub revision; **not** a deployment assertion |
| PR #75 | CX-00..09 draft package was merged into repository; **not** canonical activation |
| PR #76 | Premium public entry implementation merged; **not** complete commerce activation |
| `cx-01-master-prd.md` (blob `3602550f...`) | `DRAFT v0.1.1`, 46 FRs, 15 NFRs; source baseline of this document |
| `CX-PKG-TRACE-R1.csv` | Existing 46-row trace registry; preserve its parent ID semantics |
| `CX-PKG-STAGE-CROSSWALK-R1.md` | Separates requirement priority from earliest eligible delivery slice |
| `CX-PKG-DECISIONS-R1.md` | Records unresolved Owner decisions; do not mark approved by implication |
| PR #73 | Documentation entrypoint routing was open/draft at inspection; do not edit its four-file scope |
| User interviews, field analytics, provider production access | `NOT_VERIFIED` in this product investigation |

**Historical source correction:** CX-01 v0.1.1 records the earlier baseline `2800c474...` and describes the then-existing TeeStock placeholder. Those source observations are historical after PR #76. Any eventual CX-01 edit must distinguish *original audit evidence* from the *new observed public entry*, without backdating customer, deployment, or runtime claims.

### 2.2 Canonical source precedence (claim-specific)

- `docs/governance/documentation-constitution.md` and `docs/governance/canonical-source-map.md`: documentation authority, ownership, lifecycle, source routing.
- `bisnis/teestock/10-product-tech/digital-product-vision.md`, `website-information-architecture.md`, brand and commerce sources: business intent, audience, navigation and policy.
- `docs/roadmaps/solo-founder-launch-roadmap.md`: strategic solo-founder launch sequencing. This proposed CX experience program does not supersede it.
- MGBOS architecture and source: canonical transaction, payment, order, inventory, authorization, production and fulfillment truth.
- `cx-01-master-prd.md` *after formal adoption*: the one proposed master owner for TeeStock customer-platform product requirements.
- CX-02..09: dedicated refinements and acceptance/validation ownership; not competing master PRDs.
- JARVIS governance: tool-use authority, agent capabilities and runtime risk, not inherited by an AI widget.

### 2.3 Prohibited inference

**A source file is not a deployed feature. A DRAFT is not Owner approval. A passed document cross-reference check is not proof of usability. A marketplace integration concept is not provider API entitlement.**

---

## 3. The six signature experiences — differentiated but coherent

These six experiences describe measurable products at appropriate release slices. Their detailed interaction states belong in CX-02..07, not as duplicated parent-level normative contracts here.

### SX-01 — Intelligent Product Discovery (`CX-S0` content, `CX-S1` sellable browsing)

**Customer job:** “Saya mencari kaos untuk kebutuhan tertentu dan ingin menemukan pilihan yang sesuai.”

**Entry:** Search, direct URL, social referral, category, homepage Shop CTA.  
**Inputs:** Intent/category/search, relevant material/style/size/price/availability preferences.  
**Successful outcome:** Customer distinguishes sellable items from informational offers, understands relevant variants, sizing, availability and next action. The path does not require a chatbot.  
**Operating outcome:** Browsing alone does not create duplicate CRM work; meaningful inquiry has structured, attributable source context.  
**Recovery:** No results → useful alternatives and reset; retired variant → no invalid cart intent; stale price/availability → safe correction before commitment.  
**Failure conditions:** Unpublished product exposed, phantom ready stock, critical filter unusable on mobile, generic “error” without recovery.  
**Trace:** `CX1-FR-001..008`, `020`, `027`; CX-03/04/08.  
**Research test:** Observe first-time users choosing an appropriate path and locating a suitable item without coaching; record failure causes before freezing quantitative thresholds.

### SX-02 — Guided Custom Studio (`CX-S0` inquiry, later `CX-S3` builder)

**Customer job:** “Saya ingin membuat apparel custom meskipun belum memahami bahan, metode cetak, atau persyaratan file.”

**Early journey:** Select intended use and garment → specify approximate quantity, variant and target date → upload permitted artwork *or select ‘belum siap’* → review retained details → submit one inquiry → receive durable reference and honest next step.  
**Progressive display:** Print placement, production technicalities, and advanced options appear only when useful and supportable.  
**Operating outcome:** Founder receives a normalized request containing known facts, uncertainties, and the next action; does not reconstruct a WhatsApp conversation.  
**Critical differentiation:** `Preview visual ≠ exact-version approved proof ≠ production release`. Instant custom price is limited to standardized, explicitly eligible configurations with deterministic pricing authority; otherwise formal review.  
**Recovery:** Upload rejected/slow; file absent; browser interrupted; changed specification; duplicate submit; requested deadline beyond capacity.  
**Failure conditions:** False “ready for production” signal, hidden upload limits, erased valid input, automatically guaranteed target date.  
**Trace:** `CX1-FR-009..019`, `034`, `038..040`; CX-02/03/05/08.  
**Research test:** A novice and an informed buyer each express a credible Custom request, including a “no-artwork-yet” route; record missing critical fields and unnecessary questions.

### SX-03 — Business Procurement Workspace (`CX-S0` assisted, `CX-S2` gated self-service)

**Customer job:** “Saya membutuhkan seragam atau merchandise organisasi beserta penawaran, persetujuan, dokumen, dan pemesanan ulang.”

**Early journey:** Business inquiry collects procurement context → founder reviews viability → quotation presented through approved channel → customer understands price validity, inclusions, revision and next steps.  
**Advanced journey:** Authorized organization contact reads exact quote version, requests revision, follows approval and payment prerequisites, accesses permitted documents and requests reorder with reconfirmation.  
**Operating outcome:** Fewer repeated detail requests, transparent approver responsibility, no contradictory versions across channels.  
**Recovery:** Changed approver, stale quote, missing purchase order, changed quantity/price, multiple organizational contacts.  
**Failure conditions:** Unauthorized organizational view, ambiguous “accepted” state, automated credit commitment or order acceptance outside policy.  
**Trace:** `CX1-FR-014..017`, `034..037`; CX-05/06/08.  
**Research test:** A purchasing contact can identify which version is actionable and which approvals remain necessary; verify across permitted roles, not only a privileged test account.

### SX-04 — Frictionless Commerce (`CX-S1`, governed retail only)

**Customer job:** “Saya ingin checkout tanpa biaya mengejutkan, tanpa kewajiban akun yang tidak perlu, dan tanpa pembayaran ganda.”

**Journey:** Eligible SKU/variant → cart → price/stock revalidation → address/shipping and payable breakdown → approved payment flow → authoritative pending/success/failure outcome → stable order reference.  
**Operating outcome:** One governed order intent and correct payment reconciliation, not manual reading of screenshots or duplicate financial effects.  
**Recovery:** Abandoned/expired checkout, payment uncertainty, delayed callback, browser redirect without payment confirmation, stock changed, double-tap or retry.  
**Failure conditions:** UI asserts paid merely on redirect, duplicate order from retry, hidden adjustment, unprotected guest lookup.  
**Trace:** `CX1-FR-020..028`, CX-04/08 and MGBOS financial/identity authorities.  
**Research test:** User understands payable amount and the meaning of “payment pending”; transaction tests are separately independently verified and cannot be replaced by usability tests.

### SX-05 — Living Order Experience (`CX-S0` honest inquiry update, `CX-S1/S2` scoped self-service)

**Customer job:** “Apa status pesanan saya, apakah ada tindakan yang harus saya lakukan, dan bagaimana memperoleh bantuan?”

**Journey:** Stable reference → readable status and last-confirmed information → customer-required action if authorized → safe support or correction → next verified milestone.  
**Operating outcome:** Less repetitive status answering, accessible context for support, founder attention concentrated on genuine exceptions.  
**Recovery:** Status unavailable or stale; shipment update delayed; unauthorized lookup; version of proof changed; customer needs correction.  
**Failure conditions:** Fabricated production percentage, leakage of vendor margin or other customer's order, unsupported guaranteed delivery date.  
**Trace:** `CX1-FR-029..036`, `042`, `044`; CX-06/08.  
**Research test:** Customer can answer “what is my next action?” from an order screen, including a delayed or uncertain status scenario.

### SX-06 — Connected Commerce (`CX-S0` channel provenance, `CX-S2` first eligible integration)

**Customer job:** “Saya memesan melalui channel pilihan dan ingin memperoleh informasi yang sesuai dengan kebijakan channel tersebut.”

**Journey:** External order/event → verified identity/source → dedupe/matching → permitted internal business transition → appropriate provider and customer updates → reconciliation on mismatch.  
**Operating outcome:** Founder sees one actionable obligation, not duplicate order rows or reconciliation-by-memory.  
**Recovery:** Webhook replay, out-of-order event, provider outage, missing permissions, changed status, cancellation/return conflict.  
**Failure conditions:** Assuming provider API rights, leaking externally restricted information, unauthorized off-platform refund, false “fully synchronized” claim.  
**Trace:** `CX1-FR-041`, `042`, `045`; CX-07/08 and provider contracts.  
**Research test:** Simulated event scenarios first; real provider-capability tests only when account permissions and sandbox access are confirmed.

---

## 4. Exact master requirement reconciliation (`CX1-FR-001..046`)

**Audit rule:** This matrix is a *delta proposal*, not an alternate normative requirement inventory. Existing 46 IDs, priorities, and wording in `cx-01-master-prd.md` **remain unchanged** pending approved in-place integration. `KEEP` means no master-level semantic change; `DEEPEN` means add clearer evidence/behavior in existing CX owner; `DECISION` means an unresolved policy/priority may affect future implementation, not an error in current requirement.

| Master ID | Proposed disposition | Focus of enhancement / evidence |
|---|---|---|
| `CX1-FR-001` | DEEPEN | Four primary customer intents remain discoverable and explain their availability on mobile. |
| `CX1-FR-002` | KEEP | Distinguish available/informational/planned offers; no fake CTA. |
| `CX1-FR-003` | DEEPEN | Test CTA comprehension with real tasks, not author preference. |
| `CX1-FR-004` | KEEP | Only approved service, quantity, lead-time and garment facts. |
| `CX1-FR-005` | DEEPEN | Deep-link recovery, keyboard, mobile zoom, and backward navigation. |
| `CX1-FR-006` | DEEPEN | Search/filter/sort taxonomy, no-results, stale/retired-product states. |
| `CX1-FR-007` | DEEPEN | PDP truth about variants, sizing, price and availability. |
| `CX1-FR-008` | KEEP | Optional personalization never blocks ordinary browsing. |
| `CX1-FR-009` | DEEPEN | Minimum sufficient Custom intake; measure founder missing-info follow-ups. |
| `CX1-FR-010` | DEEPEN | Conditional questions by user intent and answered fields. |
| `CX1-FR-011` | DEEPEN | File permitted/unknown/not-ready paths and upload recovery. |
| `CX1-FR-012` | KEEP | Requested date is not an automatically guaranteed lead time. |
| `CX1-FR-013` | DEEPEN | Durable confirmation, duplicate submission and uncertain response handling. |
| `CX1-FR-014` | KEEP | Complex B2B needs move to assisted Business with context retained. |
| `CX1-FR-015` | DEEPEN | Customer comprehension of estimate/draft/approved quote/acceptance. |
| `CX1-FR-016` | KEEP | Scoped, versioned quote acceptance with authorization. |
| `CX1-FR-017` | DECISION | Organization workspace after demand, identity and role assurance. |
| `CX1-FR-018` | DECISION | Builder only with standardized production configuration and pricing eligibility. |
| `CX1-FR-019` | DEEPEN | Preview/proof fidelity, exact version, explicit customer consent boundary. |
| `CX1-FR-020` | DEEPEN | Product listing only for eligible real SKU/variant offers. |
| `CX1-FR-021` | KEEP | Cart quantity/price/state reconciliation. |
| `CX1-FR-022` | DECISION | Guest checkout depends on legal/security/commercial feasibility. |
| `CX1-FR-023` | DEEPEN | Full payable breakdown and user comprehension. |
| `CX1-FR-024` | KEEP | Pending vs success is payment-authority controlled. |
| `CX1-FR-025` | DEEPEN | Stable confirmation and network retry comprehension. |
| `CX1-FR-026` | KEEP | Safe recovery for changed price/stock. |
| `CX1-FR-027` | DEEPEN | Consistent stock/MTO/preorder states across PDP and checkout. |
| `CX1-FR-028` | KEEP | Optional deterministic and audited promotion rules only. |
| `CX1-FR-029` | DEEPEN | Inquiry receipt and policy-grounded follow-up expectations. |
| `CX1-FR-030` | KEEP | No unauthorized detail in customer status/help. |
| `CX1-FR-031` | DEEPEN | Last confirmed status, freshness and unavailable state clarity. |
| `CX1-FR-032` | DEEPEN | Contextual support entry without re-entering facts. |
| `CX1-FR-033` | KEEP | Return/service *request* is not automatic adjudication. |
| `CX1-FR-034` | DEEPEN | Artwork correction and exact-version action differentiation. |
| `CX1-FR-035` | KEEP | Reorders require new price/availability/policy validation. |
| `CX1-FR-036` | KEEP | Privacy-scoped preferences and explicit lawful consent. |
| `CX1-FR-037` | DECISION | Advanced organization documents and multi-role access after evidence. |
| `CX1-FR-038` | DEEPEN | Each actual request yields structured reusable business context, not chat-only memory. |
| `CX1-FR-039` | DEEPEN | Measure admin versus physically necessary founder work; do not count hidden AI supervision as saved time. |
| `CX1-FR-040` | KEEP | Safe manual fallback when AI/external service unavailable. |
| `CX1-FR-041` | DEEPEN | External identity, replay, legal channel distinction, reconciliation. |
| `CX1-FR-042` | KEEP | Event-and-authorization-grounded notifications. |
| `CX1-FR-043` | DECISION | Existing P1 optional help vs later P2 advanced AI must be explicitly sliced. |
| `CX1-FR-044` | DEEPEN | Actual founder effort and customer friction measurements. |
| `CX1-FR-045` | DECISION | Outbound stock/price/sellable sync requires provider and consistency proofs. |
| `CX1-FR-046` | KEEP | AI tool use separately governed, auditable, cost-bounded and safe to disable. |

**Integrity note:** Exactly 46 existing FR IDs are retained. This table does not itself modify priority `P0/P1/P2` or earliest `CX-S0..S3` readiness mapping. The repo's `CX-PKG-TRACE-R1.csv` and stage crosswalk remain the controlling *draft trace inventories* until a coordinated documentation PR updates them.

---

## 5. NFR reconciliation (`CX1-NFR-001..015`)

| Existing ID | Existing subject | Evidence/refinement, without unapproved threshold invention |
|---|---|---|
| `CX1-NFR-001` | Mobile-first responsiveness | Representative device, viewport, zoom, keyboard and orientation tasks. |
| `CX1-NFR-002` | Core Web Vitals | Proposed LCP ≤2.5s, INP ≤200ms, CLS ≤0.1 at p75 where field data is sufficient; never relabel lab as field. |
| `CX1-NFR-003` | Page/interaction budgets | Baseline and approved per-route budgets for home/PDP/Custom/checkout/editor. |
| `CX1-NFR-004` | Progressive loading | AI, graphics editor, heavy SDK and 3D must not block ordinary navigation. |
| `CX1-NFR-005` | Accessibility | Target WCAG 2.2 AA; automated plus manual task/assistive technology evidence. |
| `CX1-NFR-006` | Core-task availability | Truthful, useful degradation and accessible support fallback. |
| `CX1-NFR-007` | Security/privacy | Ownership, customer/organization isolation, least privilege, non-disclosure. |
| `CX1-NFR-008` | Input/file/data safety | Secure upload constraints, private assets, rejection reasons, safe recovery. |
| `CX1-NFR-009` | SEO/discoverability | Crawlability for public valid content; avoid leaked private states and fake product metadata. |
| `CX1-NFR-010` | Localization/content | Natural Indonesian terminology and unambiguous price/time/state language. |
| `CX1-NFR-011` | Draft/interruption | Preserve recoverable form intent under an approved retention/security model. |
| `CX1-NFR-012` | Observability | Distinguish marketing interactions from committed business effects; privacy-aware event definitions. |
| `CX1-NFR-013` | Design consistency | Component state coverage, tokens aligned with TeeStock brand owner, real mobile usability. |
| `CX1-NFR-014` | Cost efficiency | Per-order system cost, AI/provider spend, intervention overhead and net founder time benefit. |
| `CX1-NFR-015` | Compatibility/recovery | Browser/device support and tested navigation after partial failures. |

**Lab/field boundary:** Until an actual release has statistically meaningful field observations, classify customer Core Web Vitals as `NOT_VERIFIED_FIELD`. The proposed targets guide QA; they are not existing performance results.

---

## 6. Twelve precise candidate acceptance scenarios (`DP01-AC-01..12`)

These are **review scenarios, not tests executed**. They supplement, and must eventually map into, existing `CX1-AC-*` and relevant CX-02..09 IDs. No duplicate public acceptance authority is created by this planning file.

| Scenario | Preconditions and stimulus | Observable pass outcome | Relevant owner |
|---|---|---|---|
| `DP01-AC-01` Public intent | New mobile visitor, Shop unavailable, Custom inquiry planned | Correct route is understandable; unavailable Shop cannot be mistaken for sellable checkout | CX-03/08 |
| `DP01-AC-02` Missing artwork | Custom user has garment/quantity but no usable file | Explicit not-ready path remains actionable; upload never misrepresented as proof approval | CX-05/08 |
| `DP01-AC-03` Progressive questions | Basic personal Custom vs complex organization scenario | Only necessary fields are required; answers survive switching to Business path | CX-03/05 |
| `DP01-AC-04` Interrupted intake | Validated form plus dropped network/refresh/retry | No silent duplicate committed request; approved recoverable context and honest uncertain state | CX-05/MGBOS |
| `DP01-AC-05` Quote semantics | Customer sees draft estimate and later approved quotation | Labels, validity, version and authority distinguish non-binding estimate from approved quote | CX-05/08 |
| `DP01-AC-06` Preview mismatch | Illustrative garment artwork preview with production-limited uncertainty | Preview limitations explicit; no UI event equates viewing preview with proof approval | CX-05/03 |
| `DP01-AC-07` Payment uncertainty | Checkout redirected; authoritative callback delayed | UI shows pending/reconciling, not paid or new order from repeat attempt | CX-04/MGBOS |
| `DP01-AC-08` Organization isolation | Unauthorized contact requests another organization's order/quote | No sensitive detail, existence disclosure or privileged action | CX-06/Security |
| `DP01-AC-09` Marketplace replay | Same verified external order event delivered twice/out of sequence | One permitted canonical effect, coherent reconciliation state, no lost side effects | CX-07/MGBOS |
| `DP01-AC-10` AI outage | AI assistant unavailable during ordinary purchase/inquiry | Core task has useful non-AI route, without content loss or fabricated facts | CX-03/06/08 |
| `DP01-AC-11` Heavy feature | Basic mobile browse with editor and AI unrequested | Core path does not depend on loading heavy optional runtimes; budgets measured on target profile | CX-03/08 |
| `DP01-AC-12` Founder workload | Same simulated Custom scenario in assisted/manual vs structured-intake model | Manual transcription and avoidable follow-ups are recorded; savings net of review/exception overhead | CX-02/09 |

**Evidence template:** `scenario_id | source SHA | route/state | test device/profile | data fixture | action | expected | observed | result PASS/FAIL/NOT_VERIFIED | defect | reviewer | date`.

---

## 7. Customer-and-founder scorecard contract

Do not commit made-up targets before research. Record baseline, sample, confidence/limitations and proposed threshold before validating a design.

| Measurement | What it protects | Owner / initial evidence |
|---|---|---|
| Intent route success | Customer can find Shop/Custom/Business/Merch | UX: moderated, task-based tests |
| Unassisted task completion | Complexity is hidden, not transferred to users | UX: prototype tasks |
| Quote-status comprehension | Customers know estimate vs approved commercial commitment | UX/Product: comprehension questions |
| Missing requirements per Custom inquiry | Lower founder clarification burden | Business/Product: sanitized synthetic rehearsal, later pilot data |
| Manual founder minutes per eligible order | Automation creates genuine leverage | Operations: measured task journal including oversight |
| Duplicate/recovery incidents | Customer actions do not produce double effects | QA/Engineering: negative transaction tests |
| Support contacts per successful order | Self-service reduces repeated status inquiries | CX/Operations: privacy-aware classification |
| Core Web Vitals per template | Capability does not create slow core routes | Frontend/QA: reproducible lab and eventual field p75 |
| Accessibility defects by task/severity | Essential tasks work across accessible inputs | QA/UX: manual keyboard/AT + automated screening |
| Variable AI/provider cost per order | Automation is economic at low volume | Owner/Ops: cost-of-service model |

**Net operational benefit:** Time saved is counted only after subtracting new monitoring, AI intervention, reconciliation, exception and maintenance effort. A flashy feature that increases founder burden does not automatically pass the product gate.

---

## 8. Decision register and freeze boundary

The Owner's stated product direction — feature-rich, premium, fast/lightweight, omnichannel-capable, AI-assisted, solo-founder-efficient — is treated as **approved strategic intent**, not blanket acceptance of every business policy or provider commitment.

| Decision family | Proposed direction | State / authority |
|---|---|---|
| Public entry and assisted intake (`CX-DP-01..02`) | Premium Custom/Business-first while clearly showing future Shop/Merch; structured valid intake with fallback | Product-aligned direction; formal package decision still open |
| Launch sellable offers and pricing (`CX-DP-03..04`) | Only verified garment/service/quantity/capacity; do not imply unapproved final price or date | OPEN / Owner and relevant business policy |
| Initial contact and provider budget (`CX-DP-05..06`) | Real reachable approved channel; no spend based on invented demand | OPEN / Owner |
| Retail checkout, guests and accounts (`CX-DP-07..08`) | Low-friction only after security/payment/sellability readiness | DEFER / gated |
| B2B workspace, approvals, reorders (`CX-DP-09..10`, `15`) | Demand-driven scoped capability with exact approver/version | DEFER / gated |
| First marketplace and outbound synchronization (`CX-DP-11`, `16`) | One eligible inbound adapter before broad two-way sync; explicit provider authority | DEFER / provider and engineering gates |
| Advanced builder and preview (`CX-DP-12`, `17`) | Standardized configuration and a verified user benefit before heavy editor | DEFER / product evidence plus production rules |
| AI timing and founder telemetry (`CX-DP-13..14`) | Distinguish baseline rule-based/helpful information from tool-using AI; measure benefit and total cost | OPEN / reconcile CX-01 and detail stages |

**Do not close these statuses without the required decision and evidence.** No new release date, feature entitlement or automatic Owner approval is set here.

---

## 9. Release alignment without roadmap drift

| Proposed customer slice | Customer-visible outcome | Must be true first | Explicit non-goal |
|---|---|---|---|
| `CX-S0` | Premium public navigation, truthful Custom/Business guidance and governed inquiry as separately authorized | Approved contact/intake endpoint, truthful offer facts, founder manual fallback | Instant checkout, unrestricted login, 3D builder |
| `CX-S1` | Eligible product catalog, cart/checkout, dependable payment confirmation and bounded status | Valid SKU/price/stock, payment/invoice/R5 assurance where applicable, secure customer visibility | Every product/channel enabled |
| `CX-S2` | Select self-service, B2B approvals/reorders, one justified provider integration | Proven customer identity, organization isolation, provider permissions, reconcile/replay safeguards | Universal marketplace sync |
| `CX-S3` | Advanced governed Custom Studio, selective AI and personalization | Standardized print recipe/pricing/proof, measured user need, good editor performance and AI evaluation | AI financial authority or imaginary production capacity |

**Priority is not slice:** P0/P1/P2 express requirement priority; CX-S0..S3 express separate capabilities and readiness. The crosswalk remains authoritative for the current *draft* mapping. The operating pilot and Founder Control track stay independently governed.

---

## 10. Controlled integration instructions (future documentation PR only)

This is the exact document-reconciliation method, not permission to execute it now.

1. **Read current repo first.** Reconfirm live main, PR #73 state, CX-01 current blob and active draft trace files. If changed, inspect semantic diff before applying anything.
2. **Preserve CX-01.** Do not replace its 935-line / 115,653-character baseline wholesale with a shorter rewrite; its 46 FRs, 15 NFRs, 8 journeys, `CX1-BR-*`, existing acceptance inventory, scorecard, risks, unknowns, source register and remediation appendix must survive except for explicit approved changes.
3. **Bound additions:** Refine CX-01 North Star and product success using Section 1 of this file; add six SX summaries as a *non-competing* cross-reference under its master journey section; add customer/founder metrics and proposed evaluation method under Sections 10/15; link full journey details to CX-02..07.
4. **Use semantic owner:** Move screen behavior into CX-03, Custom/B2B detail into CX-05, checkout into CX-04, account into CX-06, integration into CX-07, acceptance into CX-08, and delivery/experiments into CX-09. CX-01 should not duplicate their detailed normative obligations.
5. **Retain IDs:** Keep `CX1-FR-001..046`, `CX1-NFR-001..015`, existing business rules and acceptance IDs stable. New IDs require demonstrated semantic gaps and revalidation of `CX-PKG-TRACE-R1.csv`/stage crosswalk.
6. **Record open decisions:** Use `CX-PKG-DECISIONS-R1.md` (or a governed successor) with explicit Owner decisions; do not silently amend a pending item.
7. **Update source evidence correctly:** Keep original historical observations explicitly dated; add PR #76 implementation-source reality without claiming live operational success. Update `source_baseline_commit` and relevant links if and when an in-place PRD candidate is actually authored.
8. **Run review:** Documentation reference validation, semantic traceability review (not mere exact-string presence), frontmatter/schema validation, scope diff, author QA and independent product/UX QA.
9. **Freeze only what is evidenced:** Once approved, record SHA/version/decision IDs and route through the established documentation lifecycle. PR creation, green CI and file presence do not automatically activate a DRAFT or authorize engineering.
10. **Stop on conflict:** If upstream brand/business policy, launch roadmap, MGBOS financial/identity semantics or active engineering PR conflicts with the proposed text, report `SOURCE_CONFLICT` / `ARCHITECTURE_IMPACT_REQUIRED`; do not silently choose a convenient interpretation.

### 10.1 Future Antigravity handoff eligibility

A bounded, **docs-only** handoff may be prepared after Owner explicitly authorizes integration. It should name exact allowed document paths, expected main SHA, approved source text/delta, validators, independent reviewer, and stop conditions. No application code, SQL, provider configuration, CI deployment, merge or production access is implicitly allowed.

---

## 11. Evidence-driven review protocol for the next stage

### 11.1 Discovery and storyboards

Use six SX journeys to produce screen/state inventories in CX-02/CX-03. Each storyboard must include user intent, role, entry condition, information available, visible step, next action, founder handoff, error/interruption state and measurable test case.

### 11.2 Actual participant research

Define test participants by retail, Custom and B2B needs; distinguish novices from experienced purchasers. Use moderated tasks and record observed behavior, not hypothetical preference. Research sample sizes and pass thresholds must reflect available resources and explicit confidence limits, not a fabricated universal number.

### 11.3 Independent challenge

An independent reviewer must attempt to falsify product assumptions: Could a user be misled by estimate/pricing? Can a guest see data they do not own? Does the design really reduce founder work after including AI supervision? Is the heavy editor demanded by customer evidence? Can a failing provider event be recovered without duplicate business effect?

### 11.4 Exit from DP-01

`DP01_AUTHOR_RELEASE = COPY_READY` means this **planning/reconciliation artifact** passed internal checks and is safe for placement as a new DRAFT file. It is *not* `CX01_CANONICAL_ACTIVATED` and not `CX01_IN_PLACE_REVISED`. The latter statuses require the controlled PRD integration and review steps above.

---

## 12. Author QA and remaining uncertainties

| QA check | Result | Evidence/limit |
|---|---|---|
| Repository identity and exact source revision | PASS | GitHub main and CX-01 blob checked at declared SHA |
| Target document path collision | PASS | New DP-01 file path proposed; existing CX-01 path unchanged |
| Existing FR numbering and coverage | PASS | 46 unique IDs, `CX1-FR-001..046`, explicitly mapped here |
| Existing NFR numbering and coverage | PASS | 15 unique IDs, `CX1-NFR-001..015`, explicitly mapped here |
| Master vs CX-02..09 ownership | PASS — design review | Detail assigned to its existing proposed owner; no second authoritative PRD |
| Owner business and canonical roadmap integrity | PASS — design review | Open decisions and release gates preserved; no implied approval |
| Actual user-validated experience | NOT_VERIFIED | Requires real participant research and prototype execution |
| Independent reviewer acceptance | NOT_PERFORMED | Authorship review is not independent QA |
| Current deployed/public provider readiness | NOT_VERIFIED | GitHub source/PR merger does not establish deployment or provider access |
| Post-copy repository validators | NOT_PERFORMED | Run only when candidate is actually integrated via approved process |

**Author confidence boundary:** This document is a source-grounded product review and controlled change proposal, not a product-launch certification. Open decisions and evidence gaps are deliberate, not concealed missing facts.

### 12.1 No-rework release criteria

This file is intended to be copied as-is at the specified new path. Reissue only for material evidence, factual error, approved scope change, source conflict, or independent QA finding — not cosmetic churn. A later verified source update may still require controlled revision.

---

## 13. Source register

**Pinned repository sources (inspected):**

- CX-01 Master PRD: `https://github.com/Rizkybuilds/bisnishub/blob/57eaafbb0ceef99a5fc6b2d77d724f6ff510727d/systems/mgbos/docs/product/teestock-customer-platform/cx-01-master-prd.md`
- CX package README: `systems/mgbos/docs/product/teestock-customer-platform/README.md`
- CX-02..09: same customer-platform directory, version v0.1.1 at inspected SHA.
- 46-row trace: `systems/mgbos/docs/product/teestock-customer-platform/CX-PKG-TRACE-R1.csv`
- Stage crosswalk: `systems/mgbos/docs/product/teestock-customer-platform/CX-PKG-STAGE-CROSSWALK-R1.md`
- Product decisions: `systems/mgbos/docs/product/teestock-customer-platform/CX-PKG-DECISIONS-R1.md`
- Source and gap audit: `systems/mgbos/docs/product/teestock-customer-platform/cx-00-source-gap-audit.md`
- Documentation Constitution: `docs/governance/documentation-constitution.md`
- Canonical Source Map: `docs/governance/canonical-source-map.md`
- Solo-Founder Launch Roadmap: `docs/roadmaps/solo-founder-launch-roadmap.md`
- TeeStock business product vision: `bisnis/teestock/10-product-tech/digital-product-vision.md`
- TeeStock IA: `bisnis/teestock/10-product-tech/website-information-architecture.md`
- PR #75: `https://github.com/Rizkybuilds/bisnishub/pull/75`
- PR #76: `https://github.com/Rizkybuilds/bisnishub/pull/76`
- PR #73: `https://github.com/Rizkybuilds/bisnishub/pull/73`

**External method/reference (not proof of TeeStock performance or user demand):**

- GOV.UK Service Standard: `https://www.gov.uk/service-manual/service-standard`
- W3C WCAG 2.2: `https://www.w3.org/TR/WCAG22/`
- web.dev Web Vitals: `https://web.dev/articles/vitals`
- Nielsen Norman Group, 10 usability heuristics: `https://www.nngroup.com/articles/ten-usability-heuristics/`

---

## 14. Final disposition

**DP01_DOCUMENT:** `COPY_READY / SELF_REVIEWED / NON_CANONICAL_DRAFT`  
**CX01_EXISTING:** `PRESERVED / NOT_MODIFIED`  
**CX01_DEEPENING_DIRECTION:** `MAPPED / READY_FOR_OWNER_PRODUCT_REVIEW`  
**CX01_FORMAL_OWNER_ADOPTION:** `PENDING`  
**CX01_CANONICAL_ACTIVATION:** `NOT_AUTHORIZED`  
**ENGINEERING_BUILDER_HANDOFF:** `NONE`  
**DEPLOYMENT:** `NONE`

**Single next product work item:** `DP-02 — Signature Experience Storyboards` in CX-02 planning scope, after this DP-01 packet is reviewed/placed. Do not infer a delivery deadline or authorize engineering from this declaration.

**End of document.**
