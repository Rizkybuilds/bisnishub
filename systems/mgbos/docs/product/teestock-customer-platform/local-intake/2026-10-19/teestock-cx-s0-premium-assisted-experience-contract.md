---
canonical_id: proposed.mgbos.product.teestock-customer-platform.cx-s0-premium-assisted-experience
status: DRAFT
version: 1.0.0
owner: Rizky
author: OpenAI / ChatGPT — Head Engineering
approver: PENDING_OWNER
scope: teestock-customer-platform-cx-s0
document_class: product-specification
normative_authority: NONE_UNTIL_GOVERNED_APPROVAL
prepared_at: '2026-10-17'
baseline_main: b9032bc26e8a623e75aa0ef7ab48249b5230bf56
reference_pr: https://github.com/Rizkybuilds/bisnishub/pull/75
reference_pr_head: 59476dc2ba47a9ca1ba5347f6fa8554962006192
implementation_authorization: NONE
source_path: systems/mgbos/docs/product/teestock-customer-platform/cx-s0-premium-assisted-experience-contract.md
depends_on:
- cx-01-master-prd.md
- cx-02-customer-journeys-service-blueprint.md
- cx-03-experience-design-interaction-spec.md
- cx-05-custom-b2b-ordering-experience.md
- cx-08-experience-quality-acceptance-contract.md
- cx-09-phased-delivery-product-validation-plan.md
- ../../../../../docs/roadmaps/solo-founder-launch-roadmap.md
supersedes: null
last_reviewed: '2026-10-17'
review_cadence: per-material-CX-S0-product-change
---
# TeeStock CX-S0 — Premium Assisted Experience Delivery Contract v1.0.0

**DOCUMENT QUALITY:** final author-reviewed integration candidate; **GOVERNANCE STATE:** `DRAFT / NOT ACTIVE / NOT IMPLEMENTATION APPROVAL`. This is a single product delivery contract, not a new master PRD, implementation specification, technical architecture, work package, code change, or real-world test report.

**Purpose:** turn the approved *direction* of `CX-S0` (not yet Owner-activated as a canonical implementation contract) into one bounded, internally coherent, testable first customer experience. Copy the entire file to the exact path in frontmatter. No separate supplementary file is required.

> **Critical two-mode rule:** A useful premium TeeStock website MAY publish approved information and real human contact without an operational online inquiry form. A public online form MUST NOT claim “request received”, produce a reference, or advertise automation until its governed persistence, privacy, recovery and operator handoff have been proven.

## 1. Executive decision and source-of-truth boundary

| Property | Contract |
|---|---|
| Product slice | `CX-S0` — premium entry, Custom/Business orientation, truthful assisted customer conversion |
| Business priority | TeeStock Custom and Business, *assisted-sales first* |
| Target customers | First-time personal custom buyer; organization purchasing contact; repeat buyer needing clarification; mobile-first visitor |
| Success event | Visitor identifies relevant offered service and reaches a real authorized inquiry/contact route; where the governed intake exists, a single traceable request is accepted and routed to a human owner |
| Non-event | Website impression, click, outbound WhatsApp action, client-side form state, chat transcript, provider callback or synthetic reference is **not** an accepted MGBOS lead by itself |
| Out of scope | Retail cart/checkout/payments; self-service order lookup; B2B login/portal; autonomous quote; instant binding price; auto artwork approval; public stock; real-time marketplaces; AI-as-authority |
| Consumer value | Know what TeeStock offers, what information is needed, which options are conditional, and what comes next |
| Founder value | One coherent inbound request with context, reason and next action; minimal duplicate questions and re-entry |
| Implementation proof | **Not asserted.** This document specifies future behavior and gates, not deployed capability |

**Source precedence:** GitHub `main` canonical governance and TeeStock business policy > active MGBOS product, command, identity and operational specifications > CX-01..09 PR #75 **DRAFT references** > this proposed child contract. Conflicts must be routed to the semantic owner, not patched into business truth from this document.

**Snapshot provenance:** GitHub `main` at `b9032bc26e8a623e75aa0ef7ab48249b5230bf56`; PR #75 documentation candidate at `59476dc2ba47a9ca1ba5347f6fa8554962006192`. These are *read snapshots*, not assertions that PR #75 has merged. The active implementation source checked under `systems/mgbos/apps/teestock/src/app/` includes Home, `/custom-atelier`, `/health`, root layout and not-found. At the main snapshot Home and Custom Atelier are placeholder pages; `/for-business` was not present. Do **not** infer a functioning inquiry endpoint, database write, upload workflow or customer portal.

## 2. Canonical alignment and non-duplication

| Existing owner / artifact | What this contract consumes | What it does NOT redefine |
|---|---|---|
| `docs/roadmaps/solo-founder-launch-roadmap.md` | Assisted-first sequencing; customer storefront not prerequisite for existing real pilot | Operational pilot readiness or launch order |
| `bisnis/teestock/10-product-tech/website-information-architecture.md` | Customer intent routing: `Shop`, `Custom`, `For Business`, `Build Merch`; simplified global nav | Company/brand portfolio or sitemap authority |
| `bisnis/teestock/02-brand/brand-identity-system.md` | TeeStock design direction and identity | New brand palette, logos, or typography mandate |
| `cx-01-master-prd.md` | `CX1-FR-001..005`, `009..015`, `029..030`, `038..040`; P0 rules and NFR | Master requirement wording or priority class |
| `cx-02-customer-journeys-service-blueprint.md` | `CX2-BP-01/02/03/05/06`; customer/frontstage/backstage/human handoff | MGBOS business state machine |
| `cx-03-experience-design-interaction-spec.md` | `CX3-SP-01/04/05/06/07/11`; mobile, form, a11y, interaction | Separate design system or UI component code |
| `cx-05-custom-b2b-ordering-experience.md` | Assisted inquiry, artwork readiness, quote vocabulary, receipt, human feasibility | Formal quote or acceptance authorization |
| `cx-06-customer-account-service-experience.md` | Public help and verified assisted status | Public customer-account authorization |
| `cx-08-experience-quality-acceptance-contract.md` | Device/a11y/performance/error/security release evidence | Replacement for independent technical or security tests |
| `cx-09-phased-delivery-product-validation-plan.md` | `CX09-S0-E`, `CX09-S0-X`, slice boundary and gates | Entire development roadmap or investment approval |
| MGBOS canonical architecture, command and permission models | Authorized lead/requirement/quote mutation and org isolation | SQL tables, endpoints, grants, policies or service identities |

**Rule:** `CX-S0` is not a standalone system with its own CRM. It is a customer-facing path into governed MGBOS records if and only if a secure implementation contract subsequently exists.

## 3. Bounded release shape: two truthful modes

The delivery may be staged without changing the fundamental `CX-S0` business intent.

| Mode | Capability | Permitted public language | Required evidence | Not permitted |
|---|---|---|---|---|
| `S0-A — Information + human assisted` | Visually complete Home, service explanation, real approved contact route, visible help and FAQs, truthful unavailable features | “Konsultasikan kebutuhan Custom” when a real contact handler exists | Approved service content, contact destination owned/monitored, accessible route, responsive/browser checks | Simulated order/cart; fake form submission; invented response time; contact button to unowned inbox |
| `S0-B — Governed structured online inquiry` | S0-A plus minimal Custom/Business form, dynamic fields, guarded submission, real accepted reference, operator routing | “Permintaan diterima” **only after authoritative write acknowledgment** | Source-level MGBOS command/permission review, duplicate/lost-response tests, PII protection, effective operator handoff and fault recovery | Assuming front-end toast, analytics event, email delivery or n8n workflow creates canonical business truth |

`S0-A` can be useful as a complete and polished public entry product, but **must not be represented as acceptance of the full S0-B inquiry contract**. A later S0-B activation is a separate implementation risk/gate, not a copy change hidden inside content deployment.

**Contingency:** If approved real contact channel is absent or unattended, neither S0-A nor S0-B should present a customer action that appears available. Hold external exposure and escalate to Owner/Operations. Under no circumstance put private production submissions into public GitHub issues or shared unprotected spreadsheets.

## 4. Customers, intents, tasks and success definition

| Code | Customer intent | User's real question | Successful P0 next step | Founder/operator obligation |
|---|---|---|---|---|
| `INT-01` | Browse TeeStock | “Apa yang bisa gue pesan di sini?” | Understand currently supported offers vs planned experiences | Maintain published offer truth |
| `INT-02` | Personal Custom | “Bisa bikin kaos dengan desain gue?” | Reach simple Custom inquiry or real assisted contact | Qualify size/quantity/method/artwork/due date where needed |
| `INT-03` | Business order | “Bisa produksi seragam/merch perusahaan?” | Reach Business orientation and formal assisted intake | Handle procurement, company context, quote feasibility |
| `INT-04` | Merch program | “Bisa kerja sama untuk merchandise?” | Understand current availability, then reach approved assisted review if offered | Explicit routing rather than promise universal fulfillment |
| `INT-05` | Artwork not ready | “Belum punya desain, tetap bisa tanya?” | Continue to assistance without forced file upload | Clarify design service/next steps without auto-approval |
| `INT-06` | Need help/status | “Permintaan gue tadi bagaimana?” | Access public support and safely verified human status assistance | Verify identity before sharing private order facts |

**Primary success metric** is useful customer task completion with truthful follow-up, not checkout conversion for a product that is not live. A click on WhatsApp counts as a navigation or handoff event only; it cannot be reported as a confirmed lead until the approved business intake has actually accepted and recorded it.

**Critical customer effort constraint:** Ordinary customers should not be forced to know printing method, artwork dimensions, textile technique or invoice technicalities just to ask a question. Unknown values are valid “perlu diskusi” signals where commercial policy allows.

## 5. Information architecture and route disposition

**Do not invent final URL paths in a PRD.** Head Engineering must validate actual Next.js routing and chosen public permalink scheme before implementation. The labels below describe user-facing destinations, not mandatory path names.

| Experience surface | Public state in `S0-A` | Public state in `S0-B` | Minimum content and next action |
|---|---|---|---|
| Home / job router | ACTIVE after quality + content gate | Same | Brand value, four customer-job choices, active/deferred status, real contact, help |
| Custom | ACTIVE after real supported service + contact gate | ACTIVE with authorized structured inquiry | What it covers; constraints; process; artwork-ready and not-ready; assistance CTA |
| For Business | ACTIVE after verified B2B scope/contact gate | ACTIVE with governed company inquiry | Bulk/organization use cases, quantity review, company needs, human quote |
| Shop | Informational only if catalog/checkout not approved; otherwise label forthcoming or hide buy actions | Same | No fake “Buy”, “Pay Now”, inventory guarantee or mock checkout |
| Build Merch | Informational or assisted handoff only if program actually offered | Same | Qualification; no promise of active creator portal or instant fulfillment |
| Help / policies | Approved visible help and fallback | Same, with request reference contact guidance | Validated policies only, no invented refund/turnaround SLA |
| Submit confirmation | Not applicable for web submissions | Conditional, evidence-backed | Only real intake reference and next step; no automatic Order/Payment claim |
| Error / unavailable | Safe fallback, maintained content clarity | Safe result reconciliation/no false receipt | Recovery, persistent context where safe, human alternative |

**Navigation:** Four primary jobs may remain visible as clear intent choices; presentation MUST signal if a job is only information/assisted inquiry. Utility `Account`/`Cart` must be omitted, disabled with truthful explanation, or be genuinely implemented; mock checkout/account UI is prohibited. Footer may include lower-frequency corporate programs, legal and support links without competing with primary CTAs.

**Deep links:** unsupported/expired route should maintain orientation and offer a relevant valid destination. Mobile menu, page title, focus order, keyboard access, browser back, error recovery and no-asset rendering must remain functional. Site navigation must not create a new lead simply by being visited.

## 6. Page-level content and interaction contracts

### 6.1 Home — `CX3-SP-01`

1. Above fold: clear TeeStock proposition, relevant primary options, and one dominant eligible action. Hero art is enhancement; headline and CTA must render without it.
2. Job cards: `Shop`, `Customize`, `For Business`, `Build Merch` organized by intent, with active/assisted/coming-soon treatment independently determined from approved availability.
3. Genuine evidence only: real portfolio sample with legal rights, real product/service capability, real stated limitations. No fake order count, customer logos or 5-star testimonial.
4. Process preview: explains customer inquiry → feasibility review → quote → permitted order; does not suggest every order instantly enters production.
5. Reassurance: FAQ/support, business identity/contact terms and truthful privacy explanation are reachable.
6. Avoid giant autoplay hero, heavy 3D model, video dependency, motion-trap, AI chatbot covering actionable CTAs or universal “Pesan Sekarang” button when purchase cannot occur.

### 6.2 Custom landing — `CX3-SP-04`

1. Explain garment types and customization methods only to the extent approved and genuinely serviceable.
2. Show examples as examples, not guaranteed vendor-equivalent output. Proposed mockup must not imply final QC acceptance.
3. Describe how quote feasibility works; requested date and indicative price are not guaranteed.
4. Offer explicit “Sudah punya desain” and “Belum punya desain” pathways **if supported**; either yields a legitimate next step.
5. `S0-A`: a real contact destination, with what to prepare and confidentiality safeguards. `S0-B`: a short, progressive online form.
6. Customer need not select technical printing method; offer a human-review option if unclear.

### 6.3 Business landing — `CX3-SP-05`

1. Address business use cases in ordinary buyer language (e.g., uniforms or event merchandise only if approved).
2. Explain what a corporate buyer may prepare: approximate quantity, required delivery date, purpose, artwork status, company procurement constraints.
3. Make pricing and delivery terms subject to actual feasibility review; no blanket bulk discount or credit promise.
4. Preserve already-entered Custom context when switching to Business; no restart unless privacy/security demands it.
5. Use a human-assisted quotation route; a draft or estimate must never be accepted automatically as binding.

### 6.4 Request form — `CX3-SP-04/05`, only `S0-B`

1. Form starts with small required set; advanced fields reveal only when meaningful.
2. Contact and customer-purpose fields have clear helper text and policy-aligned validation.
3. Show a readable review summary before committing. Editing an earlier step must not erase valid unrelated input.
4. Visual success only after authoritative response. Duplicates and lost responses are surfaced as uncertainty with safe recovery.
5. On bad network, preserve permitted unsent fields while avoiding long-term storage of sensitive artwork or private data in public/browser caches.

### 6.5 Confirmation / unavailable / help — `CX3-SP-06/11`

- Confirmation clearly says **Permintaan diterima untuk ditinjau**, not “Pesanan berhasil” unless a separately governed order exists.
- Reference ID is source-issued. A successful email or auto-reply is not itself authoritative acceptance.
- Expose expected *process*, not invented guaranteed hour/day response times. Show the actual owner/channel when approved.
- Failed, pending or unknown result must be distinct. “Tidak bisa memastikan apakah permintaan tersimpan” is safer than a fabricated failure or success.
- Help path must not disclose private order status to anyone armed only with a guessable reference.

## 7. Custom and Business form contract — single authoritative intent

### 7.1 Field contract

This is an **experience semantics table**, not a DB/API schema. The final technical contract must reuse governed MGBOS fields/commands when authorized and proven.

| Field family | Initially shown | Conditional behavior | Acceptance requirement |
|---|---|---|---|
| Customer need / type | Yes | Custom / Business / uncertain; no internal org menu | Actual customer purpose captured in natural language |
| Product or garment interest | Yes, minimal | “Belum tahu” supported for assisted review | Never force an unapproved SKU selection |
| Approximate quantity | Yes if needed for feasibility | Size/color split only if applicable; reject nonsensical negative/non-numeric values | Preserve stated uncertainty; no silent invented quantities |
| Requested delivery date | Optional/conditional based on service | Date may be unknown; label **diminta/belum dikonfirmasi** | No guarantee based on user input alone |
| Artwork readiness | Yes, simple choice | Have file / not ready / need design advice; actual upload only when separately enabled | No forced upload to request review |
| Print placement/method | Optional | Appears after specific valid choice or expert-assist path | Unknown is review-needed, not false rejection |
| Company/organization context | Only Business or buyer indicates procurement | Show relevant company, approver/PO needs without promising B2B credit | Do not ask individuals for irrelevant finance identifiers |
| Delivery city/region | If material to feasibility | Exact address only when justified/approved | No courier quote or guaranteed shipping without source |
| Customer contact | Yes, minimally sufficient | Chosen contact channel must actually be usable; lawful notice/consent | Invalid details get localized accessible feedback |
| Marketing permission | Only if marketing is proposed | Distinct from service-contact permission, not prechecked coercively | No promotional subscription bundled into inquiry |
| Customer notes | Optional | Avoid encouraging upload of secrets/financial credentials | Sanitize, length/format-check; do not render unsafe content |

### 7.2 Progressive rules

- Personal Custom without invoice need must never be blocked by hidden Business-only procurement questions.
- Choosing “Belum punya desain” reveals assistance guidance, not a mandatory uploader.
- Changing intent Custom ↔ Business preserves permissible shared answers. Remove/clear only fields whose reuse would be misleading or unsafe, and explain any loss.
- Where business policy demands quantity breakdown, make the requirement explicit when triggered and show discrepancy correction (sum of sizes vs declared total) without silently modifying user totals.
- Progressive reveal/collapse is accessible to keyboard and screen reader. Requiredness changes are announced, fields are labeled and errors point to controls.
- Saving a local draft before authoritative submission is a UI convenience, not a canonical lead or approval. State its privacy/expiry limitations.

### 7.3 Three separate review milestones

1. **Customer input reviewed:** customer has checked what they typed; this is not technical feasibility approval.
2. **Inquiry accepted for review:** authorized source persisted a valid request and issued a stable reference; still not an order.
3. **Formal quote/customer offer accepted:** distinct governed commercial process, outside this public form's authority.

## 8. MGBOS connection and business-effects contract

**Mandatory runtime truth boundary:** website can request an operation, but only an approved server-side MGBOS command or permitted integration handler can accept business mutation. Neither React state, browser local storage, n8n nodes, JARVIS proposals, nor a posted chat message is the canonical source of order/lead state.

### 8.1 Logical event flow for `S0-B` (illustrative, not implemented claim)

```text
Visitor form (validated for usability)
    ↓
Authorized server boundary verifies actor/intent, anti-abuse, input, consent
    ↓
Existing permitted MGBOS lead/requirement command (or reviewed bounded adaptation)
    ↓
Atomic accepted effect + stable source-issued reference
    ↓
Customer-safe response → legitimate operator routing / retry-safe follow-up
    ↓
Human feasibility → formal quote via governed workflow (out of public form)
```

**STOP:** If an authorized command, safe actor/organization binding, idempotent retry or durable handoff is absent, the technical proposal must remain in discovery. The public form must not be enabled merely to complete the visuals. Manual `S0-A` remains allowed if it has a real attended channel and approved record-keeping route.

### 8.2 Canonical identities and classification

- A `visitor` is not an authenticated B2B approver.
- A `contact inquiry` is not a `lead QUALIFIED`, accepted quote, order, payment, work order or production job.
- `source_channel` / campaign attribution must not change business permission, customer identity or quote authority.
- `organization_id` must be resolved through current trusted authority; never trust arbitrary client-selected org values.
- External contact identifiers are supporting references, not canonical entity IDs.
- Submission must not create vendor procurement, financial effects or production status.

### 8.3 Retry and uncertain result

| Situation | Required product response | Backend requirement to be proven before activation |
|---|---|---|
| Double tap on submit | Prevent repetitive apparent request; keep accessible feedback | Repeated same intent yields at most one accepted intended effect |
| Response lost after commit | Show **unknown**, offer safe reference/status reconciliation | Exact request identity/replay guard + read path with authorization |
| Invalid input | Localized correction, preserve valid values | No partial accepted command or unbounded side effect |
| Storage/service offline | Never show “received”; offer real alternate attended channel | No hidden acceptance to uncontrolled provider or spreadsheet |
| Operator notification fails | Customer success may remain if canonical request accepted; next step still real | Durable work visibility independent of notification channel |
| Unauthorized status lookup | Do not disclose order existence, address, artwork or financial facts | Server-side scope check independent of URL/token format |

**Data minimization:** avoid transmitting full artwork, customer private documents, payments, IDs or unrestricted PII to analytics, logs, AI, marketing vendors or message previews.

## 9. Artwork and legal/IP safety

`S0-A` may accept artwork through an **approved human-assisted process** if the Owner/Operations confirms where it is received, who can view it, what the customer should be told and how it is handled. `S0-B` must not silently enable file upload.

| State | Customer wording / behavior | Never inferred |
|---|---|---|
| `NOT_READY` | “Belum punya desain; butuh arahan” proceeds to assistance | Rejected order, required upload, included professional design service |
| `FILE_SELECTED` | File selected locally, not yet received | Provider/storage receipt |
| `FILE_RECEIVED` | Trusted server records receipt after approved checks | Malware-free, rights-cleared, print-ready |
| `UNDER_REVIEW` | Feasibility/security/IP/production review needed | Approved production proof |
| `PROOF_APPROVED` | Exact asset/version, actor and scope via separately authorized flow | Automatic production release or payment |

Upload gate requires confirmed allowed file types/max size, malicious-content handling, private storage, authorization, retention/erasure policy, user feedback and fail-closed path. **Do not publish sample pricing for design assistance, IP warranties or refund terms absent confirmed policy.**

## 10. Trustworthy public copy: approved facts vs placeholders

The examples below define *meaning*, not final approved brand wording. Owner/Marketing must confirm any offer, contact availability, service capacity, legal phrase and promotion before publishing.

| Context | Safe proposed microcopy | Forbidden implication |
|---|---|---|
| Hero | “TeeStock — pakaian dan merchandise untuk kebutuhan personal maupun bisnis.” | All options can be checked out immediately |
| Custom CTA, S0-A | “Konsultasikan kebutuhan Custom” → **real** attended route | “Beli sekarang” when no checkout exists |
| Custom CTA, S0-B | “Kirim permintaan untuk ditinjau” | Instant approved quote/order |
| Business | “Ceritakan kebutuhan perusahaan. Detail dan penawaran ditinjau sebelum dikonfirmasi.” | Unverified bulk pricing/credit/SLA |
| Requested deadline | “Tanggal yang diharapkan — akan diperiksa kelayakannya.” | Guaranteed delivery date |
| No design | “Belum punya desain? Jelaskan idenya terlebih dahulu.” | Free design automatically included |
| Receipt | “Permintaan diterima untuk ditinjau. Referensi: [source-issued ID].” | Production/payment has started |
| Unknown outcome | “Kami belum bisa memastikan permintaan tersimpan. Gunakan cara pengecekan yang tersedia sebelum mengirim ulang.” | “Gagal” after possibly committed request |
| Product not for purchase | “Belum tersedia untuk pemesanan langsung di website.” | Working cart or inventory |
| Help | “Butuh bantuan? Hubungi kanal layanan yang tersedia.” | 24/7 staffed service absent evidence |

**Copy release rule:** if a statement has no approved business source and current operational evidence, remove or qualify it; aesthetic polish cannot compensate for a false promise.

## 11. Visual, accessible and performance acceptance

**Brand:** inherit approved TeeStock neutral-core design identity. Document visual hierarchy and reusable components in design work; do not define competing colors, typography or branding here. A premium interface means coherent whitespace/typography, clear important information, clean product imagery, readable language, honest feedback and excellent interaction, not gratuitous motion.

**Mobile-first:** test compact width, soft keyboard, long product names, enlarged text, landscape, intermittent 3G/4G-like conditions, low-end Android and desktop as available. Primary action remains reachable; sticky CTA must not obscure content, fields or keyboard. Avoid mandatory horizontal scrolling.

**Accessibility:** proposed conformance target is WCAG 2.2 AA per CX-03/CX-08, subject to applicable official standards. Require labeled semantic controls, visible focus, logical tab order, Escape/focus restoration where dialogs exist, predictable validation, sufficient contrast, touch access and reduced-motion preferences. Run both automated screening and manual keyboard/assistive checks; automated score alone cannot prove full accessibility.

**Web Vitals:** CX-08 proposes LCP ≤2.5s, INP ≤200ms and CLS ≤0.1 measured at p75 of real use, mobile and desktop separately. Before adequate real traffic, state `FIELD_NOT_VERIFIED`, and use repeatable lab evidence with route/device/network identity. Do not claim measured field performance from a score-only lab sample.

**Progressive enhancement:** critical text, nav, policy and contact must be useful without hero imagery, external fonts, animation, chatbot, analytics, notifications or artificial delay. Heavy media/SDKs cannot block P0 navigation or intake.

**Search/SEO basics:** semantic route headings, unique descriptive title/metadata, honest structured public copy, meaningful link targets, proper indexing policy and no public indexing of inquiry/private status. No invented location opening hours or business reviews.

**Security:** no PII in analytics URL, shared public caches, browser console, source maps or unapproved third-party models; do not expose internal costs or cross-org data. Test unauthorized endpoints and status lookups before public exposure.

## 12. Resilience and experience-state coverage

Use explicit presentation states, not a single spinner or catch-all failure page. Every critical customer intent must have an observable recovery.

| State | User sees | Operator/system consequence | Test shape |
|---|---|---|---|
| `AVAILABLE` | Real published next action | No passive lead created | Browser normal |
| `PLANNED` | Honest non-buyable explanation | None | Copy/routes |
| `VALIDATING` | Specific field guidance | No accepted request | Invalid input |
| `SUBMITTING` | Disabled repeat action, visible progress | One logical command attempt | Rapid double-tap |
| `RECEIVED` | Verified reference and next step | Durable accepted record | Integration source + browser |
| `UNKNOWN` | “belum terkonfirmasi”; safe check and assisted route | Reconciliation before retry | Lost response after commit |
| `REJECTED` | Correctable reason; saved permitted answers | No material side-effect | Server validation denial |
| `OFFLINE` | Real human fallback and retry instruction | No fabricated queue | Fault injection |
| `NOT_AUTHORIZED` | Neutral privacy-protective assistance | No resource existence leak | Cross-actor negative |
| `UPLOAD_UNAVAILABLE` | No forced upload; approved alternate route | No file-received claim | Provider/storage outage |
| `NOT_FOUND` | Orientation, relevant service route | No phantom status record | Invalid deep link |
| `DEGRADED_ASSET` | Text and CTA unaffected | None | Block fonts/images/JS enhancement |

## 13. Founder workload and operational handoff

The product is **not** successful if lead volume rises but the founder must retype each request into a second system. Business launch capacity remains governed by real vendor availability, physical QC and owner attention.

| Moment | Target assisted operation | Measurable evidence |
|---|---|---|
| Initial response | Customer understands what detail is needed; response owner identifiable | First-contact clarification count, user success |
| Structured intake (S0-B) | Fields attach to a valid record accessible to authorized reviewer | Operator opens one contextual case/reference without copying chat |
| Feasibility | Founder reviews exceptions, price/vendor/lead-time reality | Context switch count and elapsed handling effort |
| Quotation | Approved quote via existing MGBOS authority | Versioned source evidence, no frontend-generated binding terms |
| Notifications | Non-authoritative assistance, not the sole queue | Lost notification still appears in governed work view |
| Outage | Work can resume via approved contact/manual path | Owner can reconcile/continue without hidden SQL manipulation |

Do not set imaginary percentage improvements or guaranteed response SLAs. Establish baseline first from sampled genuine operations or privacy-safe rehearsal. Classify manual touches: necessary physical action vs avoidable re-entry, context reconstruction, status hunt and exception handling. Protect founder capacity by pausing new promises when supply/response capacity is not available.

## 14. Delivery requirements — exact one-to-one acceptance register

The following register is authoritative **within this candidate document** for proposed `CX-S0` behaviors. Each row has a **separate native acceptance ID** with a directly related Given/When/Then-style verification description. One-to-one mapping prevents earlier package errors in which acceptance referenced only a loosely related feature. Scenario **definition ≠ execution**.

**Requirement tier:** `A` applies to informational `S0-A`; `B` requires governed `S0-B`; `B+` applies only if a separately approved upload/status capability is activated. Below, mode applicability is derived explicitly in §15. The register intentionally does not duplicate all CX-01 parent requirements or inherit global IDs as native declarations.

| Requirement | Intended behavior | Upstream reference |
|---|---|---|
| `S0-FR-001` | Route visitors by customer intent with truthful availability | `CX1-FR-001`; `CX1-FR-002` |
| `S0-FR-002` | Make a contextual active contact or inquiry CTA discoverable | `CX1-FR-003` |
| `S0-FR-003` | Display only approved product/service claims and constraints | `CX1-FR-004` |
| `S0-FR-004` | Preserve mobile navigation and recoverable deep links | `CX1-FR-005` |
| `S0-FR-005` | Show Shop as non-transactional while commerce is unapproved | `CX1-FR-002` |
| `S0-FR-006` | Show brand/portfolio proof without fabrication | `CX1-FR-004` |
| `S0-FR-007` | Provide approved public help without mandatory AI/login | `CX1-FR-030` |
| `S0-FR-008` | Explain quote vs estimate and approval milestones honestly | `CX1-FR-015` |
| `S0-FR-009` | Use requested deadline as request not commitment | `CX1-FR-012` |
| `S0-FR-010` | Accept artwork not-ready pathway without blocking inquiry | `CX1-FR-011` |
| `S0-FR-011` | Keep Customer and Business paths distinct but transferable | `CX1-FR-014` |
| `S0-FR-012` | Collect the minimum safe set of inquiry fields | `CX1-FR-009` |
| `S0-FR-013` | Reveal relevant advanced questions conditionally | `CX1-FR-010` |
| `S0-FR-014` | Validate quantity and size breakdown without invention | `CX1-FR-009`; `CX1-FR-010` |
| `S0-FR-015` | Provide assisted option for unknown decoration method | `CX1-FR-009` |
| `S0-FR-016` | Collect contact purpose and lawful choice separately | `CX1-FR-009` |
| `S0-FR-017` | Display summary and allow editing without unrelated loss | `CX1-FR-009` |
| `S0-FR-018` | Submit only through a governed authenticated/authorized boundary | `CX1-FR-013`; `CX1-FR-038` |
| `S0-FR-019` | Acknowledge only real durable acceptance | `CX1-FR-013` |
| `S0-FR-020` | Return a stable source-issued acceptance reference | `CX1-FR-013` |
| `S0-FR-021` | Prevent duplicate accepted effects on double submit | `CX1-FR-013` |
| `S0-FR-022` | Reconcile unknown outcome after response loss | `CX1-FR-013` |
| `S0-FR-023` | Retain valid input on correctable error | `CX1-FR-010` |
| `S0-FR-024` | Provide real fallback when intake/provider is unavailable | `CX1-FR-040` |
| `S0-FR-025` | Make every accepted inquiry retrievable by authorized operator | `CX1-FR-038` |
| `S0-FR-026` | Keep passive analytics separate from real leads | `CX1-FR-038` |
| `S0-FR-027` | Protect private inquiry and organization details | `CX1-FR-030` |
| `S0-FR-028` | Offer safely verified human-assisted status | `CX1-FR-030` |
| `S0-FR-029` | Distinguish file selection, receipt, review and approval | `CX1-FR-011` |
| `S0-FR-030` | Fail closed on unsafe public artwork upload | `CX1-FR-011` |
| `S0-FR-031` | Prevent public exposure of customer assets and costs | `CX1-FR-030` |
| `S0-FR-032` | Use accessible semantic navigation, inputs and feedback | `CX1-FR-005` |
| `S0-FR-033` | Keep core tasks usable without media, fonts or AI | `CX1-FR-040` |
| `S0-FR-034` | Meet CX-08 measured performance contract without false field claim | `CX1-NFR-002` |
| `S0-FR-035` | Provide privacy-safe error and operational diagnostics | `CX1-NFR-007`; `CX1-NFR-012` |
| `S0-FR-036` | Preserve actual current public route truth | `CX1-FR-002` |
| `S0-FR-037` | Separate customer intake from quotation/payment/production | `CX1-FR-015`; `CX1-FR-038` |
| `S0-FR-038` | Protect service promises against capacity constraints | `CX1-FR-004`; `CX1-FR-012` |
| `S0-FR-039` | Assign next action and distinguish physical operator work from digital assistance | `CX1-FR-038`; `CX1-FR-039` |
| `S0-FR-040` | Ensure feature-limited release is transparent | `CX1-FR-002`; `CX1-FR-040` |

### 14.1 Acceptance scenario register (every ID directly tests the paired requirement)

The test described is executable **only in a verified implementation environment**. No row below is claimed to have been executed.

| Acceptance | Parent requirement | Acceptance scenario / observable result |
|---|---|---|
| `S0-AC-001` | `S0-FR-001` | Given first-time mobile and desktop visitors, when they choose Custom/Business/Shop/Merch, then each reaches a truthful available route or a clearly disclosed unavailable route; no fake purchase action. |
| `S0-AC-002` | `S0-FR-002` | Given a visitor seeking Custom or Business, when viewing the appropriate landing, then a real accessible CTA and next-step expectation are visible and the destination actually accepts contact. |
| `S0-AC-003` | `S0-FR-003` | Given an unavailable or unconfirmed service quantity/turnaround, when content is published, then the unverified attribute is omitted or qualified and no guaranteed price/date/capacity is asserted. |
| `S0-AC-004` | `S0-FR-004` | Given small-screen, keyboard and direct deep-link entry, when navigating or following an unavailable route, then intent and accessible next step remain available without losing focus. |
| `S0-AC-005` | `S0-FR-005` | Given disabled retail checkout, when Shop is viewed, then neither working cart nor “Pay Now” appears and a valid information/contact alternative is supplied. |
| `S0-AC-006` | `S0-FR-006` | Given sample imagery or testimonial is proposed, when published, then source rights and factual evidence are approved; absent evidence prevents display, not replaced by synthetic reviews. |
| `S0-AC-007` | `S0-FR-007` | Given visitor needs support, when AI or account features are not available, then an actual staffed/owned help route is accessible without login. |
| `S0-AC-008` | `S0-FR-008` | Given estimate, draft quote, authorized formal quote and accepted offer exemplars, when customer sees each, then stage labels and possible actions differ; draft/estimate cannot act as accepted offer. |
| `S0-AC-009` | `S0-FR-009` | Given a requested rush date without capacity confirmation, when inquiry is reviewed, then UI labels it unconfirmed and explains human feasibility review instead of guaranteeing shipment. |
| `S0-AC-010` | `S0-FR-010` | Given visitor has no artwork, when choosing “belum punya desain”, then they can reach the approved assisted next step without uploading a placeholder. |
| `S0-AC-011` | `S0-FR-011` | Given visitor begins Custom then reveals procurement/large-volume need, when switching Business, then valid common inputs remain and unsupported approval/credit promises do not appear. |
| `S0-AC-012` | `S0-FR-012` | Given a straightforward Custom need, when starting S0-B form, then only needed initial questions are required and a valid simple inquiry can reach review. |
| `S0-AC-013` | `S0-FR-013` | Given personal vs organization intent, when changing the selection, then procurement/tax fields reveal only for relevant cases with accessible requiredness changes and prior safe answers preserved. |
| `S0-AC-014` | `S0-FR-014` | Given inconsistent garment size totals or negative quantity, when reviewing the form, then mismatches are clearly identified; server rejects invalid submission and does not silently adjust quantities. |
| `S0-AC-015` | `S0-FR-015` | Given visitor does not know print method, when selecting “perlu rekomendasi”, then an inquiry can proceed for human review without fabricated technical sellability. |
| `S0-AC-016` | `S0-FR-016` | Given service contact with optional marketing, when submitting, then necessary contact and optional promotion permission are separate, understandable and not bundled coercively. |
| `S0-AC-017` | `S0-FR-017` | Given a partially complete valid inquiry, when customer reviews or edits an earlier answer, then permitted other fields persist and changed conditional fields are handled predictably. |
| `S0-AC-018` | `S0-FR-018` | Given untrusted client organization or actor fields, when submit is attempted, then the server ignores untrusted authority and accepts only through validated MGBOS role/context or explicitly reviewed equivalent. |
| `S0-AC-019` | `S0-FR-019` | Given server rejects or fails before durable commit, when response returns, then no invented reference or received-success is displayed. |
| `S0-AC-020` | `S0-FR-020` | Given a successful authorized intake, when confirmation renders, then its reference matches the persisted record and status explicitly means inquiry pending review. |
| `S0-AC-021` | `S0-FR-021` | Given rapid double click and duplicate request, when same intent is sent twice, then no more than one intended accepted request is created. |
| `S0-AC-022` | `S0-FR-022` | Given persistence succeeds but response is lost, when visitor retries or asks for help, then uncertain state is shown and approved reconciliation prevents duplicate work. |
| `S0-AC-023` | `S0-FR-023` | Given one invalid field after others are valid, when validation fails, then accessible field-level correction appears without erasing unrelated valid answers. |
| `S0-AC-024` | `S0-FR-024` | Given intake endpoint or notification provider unavailable, when customer seeks help, then the product offers a currently functional human route; it never implies an accepted web request. |
| `S0-AC-025` | `S0-FR-025` | Given accepted S0-B intake, when authorized operator opens it, then customer intent, fields, source reference, artwork choice and owned next step can be recovered without chat transcription. |
| `S0-AC-026` | `S0-FR-026` | Given pageview, nav click or WhatsApp handoff with no accepted record, when dashboard reports pipeline, then no qualified/accepted MGBOS lead is fabricated from the analytics event. |
| `S0-AC-027` | `S0-FR-027` | Given guessed reference, unauthorized user or cross-org actor, when attempting to read status/details, then access fails without exposing record existence, address, price or private artwork. |
| `S0-AC-028` | `S0-FR-028` | Given legitimate returning customer, when seeking request status, then a verified human/approved channel can explain actual status without granting unverified public self-service access. |
| `S0-AC-029` | `S0-FR-029` | Given customer selects file but upload fails or enters review, when UI updates, then local selection/receipt/approval are labeled separately; no print-ready claim is made. |
| `S0-AC-030` | `S0-FR-030` | Given unauthorized, oversize or unsupported/malicious upload, when submission occurs, then file is rejected/quarantined per approved policy, private content is protected and alternative assistance offered. |
| `S0-AC-031` | `S0-FR-031` | Given private request artwork, vendor quote or internal unit cost, when public pages and message previews render, then none exposes protected data, direct storage paths or cross-customer records. |
| `S0-AC-032` | `S0-FR-032` | Given keyboard-only, zoom and screen-reader trials, when completing P0 tasks, then focus remains logical/visible, labels and errors associate correctly, and touch-only gestures are not required. |
| `S0-AC-033` | `S0-FR-033` | Given blocked images, font, animation, analytics or AI, when visitor navigates Custom/Business or attempts permissible contact, then content and real next step remain available. |
| `S0-AC-034` | `S0-FR-034` | Given controlled lab on required page/device/network profiles, when scored, then results include route and reproducible metrics; absent sufficient field data remains NOT_VERIFIED_FIELD, never reported PASS. |
| `S0-AC-035` | `S0-FR-035` | Given failed submission or page exception, when logs and analytics are inspected, then correlation/error classification exists without full PII, artwork, secrets or financial data leakage. |
| `S0-AC-036` | `S0-FR-036` | Given source implements only Home and Custom placeholder, when release claim is reviewed, then unsupported features are not described as deployed and new routes require source/HTTP evidence. |
| `S0-AC-037` | `S0-FR-037` | Given accepted inquiry, when UI or operator reviews outcome, then there is no automatic quote acceptance, paid badge, purchase order, vendor job or QC completion. |
| `S0-AC-038` | `S0-FR-038` | Given vendor or founder capacity unknown, when marketing and form copy present options, then availability and dates remain conditional; no auto-confirmed delivery slot is sold. |
| `S0-AC-039` | `S0-FR-039` | Given accepted inquiry rehearsal, when operator processes it, then the reviewer can recover the source fields without retyping, next-action ownership is explicit, and vendor procurement, physical QC, packing and courier handoff remain separately evidenced human/physical responsibilities. |
| `S0-AC-040` | `S0-FR-040` | Given S0-A publishes without S0-B or P1 commerce, when customer explores site, then UI clearly reflects supported capability; launch reporting does not count unbuilt form/checkout as shipped. |

## 15. Scope selection per capability mode

Each work package must explicitly choose only a subset and map chosen requirement IDs to exact test evidence. The following classification avoids pretending S0-A itself achieves S0-B.

| Mode | Required requirement IDs | Conditions |
|---|---|---|
| `S0-A — P0 public entry` | `001..010`, `024`, `027..028` (only authorized human support aspect), `031..036`, `038`, `040` | Customer-facing offer/contact safety, navigation, privacy and quality; no S0-B acceptance implied |
| `S0-B — Online structured inquiry` | All applicable S0-A IDs plus `011..023`, `025..026`, `029` if upload-enabled, `030` if upload-enabled, `037`, `039` | Only after approved command, authorized actor, storage, replay, diagnostics, human owner, monitoring, and recovery |
| `B+ — Optional public artwork upload` | `029`, `030`, `031` plus applicable S0-B IDs | File security/storage/rights policy and independent exposure review, otherwise assisted path only |

**Interpretation of ranges:** `001..011` means IDs numbered inclusively from `S0-FR-001` to `S0-FR-011`; **these ranges are for scope selection only**, not acceptance cross-reference aliases. Work packages should enumerate exact IDs in their test matrix.

### 15.1 Priority test scenarios with expected evidence

| Case | Execution setup | What must be captured | Blocks which activation |
|---|---|---|---|
| `S0-TST-01` | Cold mobile first visit, with and without imagery | Real CTA/navigation destination, screen recording, source offer approval | A |
| `S0-TST-02` | Keyboard-only Home → Custom → Help | Focus order, menu open/close, labels, landmarks, keyboard screenshot | A |
| `S0-TST-03` | Slow network + absent fonts/animation | Critical text/CTA accessible; measured lab trace | A |
| `S0-TST-04` | Planned Shop/Builder/Account | No fake purchase/login or fabricated capability; public crawl | A |
| `S0-TST-05` | Assisted contact recipient disabled/bounce | Active owner and alternate path proven, otherwise route disabled | A |
| `S0-TST-06` | Simple Custom vs company procurement | Dynamic field rules, screen reader updates, values preserved | B |
| `S0-TST-07` | Artwork not ready and no upload | Inquiry proceeds legitimately; next human step shown | B |
| `S0-TST-08` | Invalid quantity, privacy/consent, missing contact | No accepted effect; accessible actionable errors | B |
| `S0-TST-09` | Double click / duplicate command | One source record and one intended work item | B |
| `S0-TST-10` | Simulated response drop after committed write | Unknown UI and safe reconciliation; no duplicate accepted effect | B |
| `S0-TST-11` | Operator receives valid request with notification disabled | Source record/reference, owner queue and fields recoverable | B |
| `S0-TST-12` | Unauthenticated/cross-org status and file probing | Access denied with no private record disclosure | B / B+ |
| `S0-TST-13` | Oversized/malicious/disallowed artwork file | Safe reject/quarantine, no data leak, no false received-proof | B+ |
| `S0-TST-14` | Estimate vs draft/formal/accepted quote communication | No invalid commercial commitment; source review | B / assisted operator |
| `S0-TST-15` | Customer asks for date beyond unverified capacity | Requested date not committed; feasibility routed | A / B |
| `S0-TST-16` | Operator dry run + real-safe observation | Founder repeated-entry minutes, status hunt, next-action clarity | B before pilot promotion |

**Not all test cases are CI-only.** Independent security/transaction review uses exact source and disposable/synthetic data. Human comprehension and keyboard tests require real interaction evidence. Observed real-user metrics cannot be fabricated through a scripted test.

## 16. Cross-document trace: scope, no reverse redefinition

| S0 native area | CX-01 anchor | CX-02 blueprint | CX-03/05/06/08/09 evidence owner |
|---|---|---|---|
| Entry/nav, offer truth | `CX1-FR-001..005` | `CX2-BP-01` | `CX3-SP-01`, `CX3-AC-001..008`, `CX8-GATE-A/B/C` |
| Custom progressive inquiry | `CX1-FR-009..013` | `CX2-BP-02` | `CX3-SP-04`, `CX5-FR-003..013`, `CX8-AC-005/006/028` |
| B2B assisted qualification | `CX1-FR-014/015` | `CX2-BP-03` | `CX3-SP-05`, `CX5-FR-014..020`, `CX5-AC-012/013` |
| Artwork not-ready and file safety | `CX1-FR-011` | `CX2-BP-05` | `CX3-SP-07`, `CX5-AC-002/024/025`, `CX8-AC-028` |
| Receipt, retry, founder handoff | `CX1-FR-013/038/039` | `CX2-BP-02` | `CX5-AC-008..011`, `CX8-AC-005/006`, `CX09-S0-X` |
| Public help and private scope | `CX1-FR-029/030` | `CX2-BP-06` | CX-06 public help; CX-08 security/recovery gates |
| Performance and a11y | `CX1-NFR-001..015` as applicable | All active P0 journeys | `CX3-AC-002/005/007`, CX-08 performance/a11y gates |

**Explicit check on discovered PR #75 gap:** `CX5-AC-005` originally concerns quantity/size breakdown, **not** conditional form reveal. Use `CX3-AC-010` and `CX8-AC-006` when claiming progressive behavior. `CX3-AC-017` validates Business assisted routing, **not** estimate-vs-formal quote terminology. `CX3-AC-029` is marketplace deep-link UX, **not** inventory/channel price synchronization. This contract does not repeat those incorrect associations.

## 17. Release readiness gates and stop conditions

### `S0-GATE-1`: Content and offer truth

Owner/Operations confirms real Custom and Business offers, contact availability, service boundaries, rights for images/examples, privacy/support/legal copy and realistic handling capacity. Without this evidence: **DO NOT PUBLISH THE AFFECTED OFFER/CTA**.

### `S0-GATE-2`: Product and interaction

UX artifacts for active routes cover normal, disabled, invalid, network error and recovery states; mobile/keyboard and screen reader representative tasks are documented; no fake commerce. Requires design review compatible with CX-03/CX-08, not necessarily a finished universal design system.

### `S0-GATE-3`: Intake architecture, only for S0-B

Exact current MGBOS authorized write surface, input validation, actor/org scoping, idempotency/unknown outcomes, private storage, failure monitoring and operator visibility have been audited. If absent, remain S0-A. No direct browser DB role escalation, SQL bypass or public file access.

### `S0-GATE-4`: Quality/security evidence

On exact implementation revision, relevant UI, browser E2E, authz negative tests, retry, fault injection, privacy check, accessible form, lab performance and deploy-target checks pass. Existing repo CI on unrelated screens is insufficient. Required independent assurance follows canonical risk classification, never lowered because frontend has few lines.

### `S0-GATE-5`: Operational owner and controlled exposure

An attended destination for every active CTA exists. Owner can process one real or synthetic inquiry, close the loop to approved MGBOS lead/requirement handling where relevant, and execute rollback/fallback. Real pilot launch gates remain separate; public website cannot bypass operational readiness, credential hygiene or physical validation.

### `S0-GATE-6`: Release authorization

Implementation must have an approved work package, tested candidate SHA, checks/branch protection and deployment authorization. This document alone does **not** authorize source edits, PR merge, release, production accounts, vendor commitments or real-customer testing.

**Hard stops:** uncontrolled duplicate business effects; cross-customer leakage; unsupported terms displayed as guaranteed; fake success; unattended contact; unverified public upload; an implementation candidate that cannot be reverted or safely disabled; scope extension into retail payment/checkout/identity without separate approval.

## 18. Critical dependencies, owners and readiness status

The table below is a proposed decision ledger. `NOT_VERIFIED` records that current source evidence reviewed for this document does not prove the capability; it is not a claim that capability cannot exist elsewhere.

| Dependency | Required evidence owner | Baseline disposition | Decision required to enable |
|---|---|---|---|
| Approved sellable Custom/Business offerings and current contact policy | Owner/TeeStock operations | `NOT_VERIFIED_FOR_PUBLIC_S0` | Confirm actual launch offers + response ownership |
| Brand identity and content review | Brand/Owner | Existing brand source read; page content not yet accepted | Approve customer-facing visual/copy against existing brand |
| Approved public route and deploy environment | Head Engineering | `main` has placeholder Home/Custom, `/for-business` not observed | Source-level route/infra selection and work contract |
| Governed inquiry mutation/access | MGBOS architecture/security | Not proven for TeeStock storefront | Discover existing command, principal and org scope before S0-B |
| Safe idempotency and lost-response recovery | Head Engineering/security | `NOT_VERIFIED` in public intake | Test replay+reconciliation before activation |
| Artwork direct upload | Security/Legal/Operations | `NOT_VERIFIED` | Keep assisted upload unless separately reviewed |
| Help/receipt contact owner | Owner/Operations | `NOT_VERIFIED` for new public customer traffic | Name real handling route before CTA live |
| Founder operation capacity | Owner/Pilot | No newly measured S0 capacity | Align funnel volume with real throughput |
| Browser/a11y/performance | QA/Head Engineering | `NOT_EXECUTED_FOR_THIS_SLICE` | Verify exact customer route implementation |
| P0 web publication and site-wide policy | Owner/Head Engineering | `NOT_AUTHORIZED_BY_THIS_DOCUMENT` | Approve exact bounded implementation and release |

**No speculative deadlines/budgets:** costs, response SLA, provider fees, vendor turnaround and quantified benefit are not invented here. They require actual offers/quotes, telemetry or Owner decision. Absence of these facts is **not** a reason to dilute the truthfulness of a proposed CTA.

## 19. Owner decisions — narrow, pre-filled recommendations

Only choices that affect *the first live customer-facing scope* should block an S0-A/S0-B publication. Later feature preferences are deferred by default to CX-S1..S3.

| ID | Question | Recommended default | Owner action / gate |
|---|---|---|---|
| `S0-DEC-01` | What is first publicly actionable offer? | Custom and Business inquiry for confirmed services only; do not publish unsupported catalog/cart | Approve specific marketed offer subset |
| `S0-DEC-02` | Is S0-A enough initially? | Yes, as a truthful first publish if real attended contact exists; S0-B separately gated | Accept conditional two-mode rollout |
| `S0-DEC-03` | Which contact route is public? | Only the verified, monitored channel currently staffed by Owner/Operations | Provide/approve actual destination; never invent URL/phone |
| `S0-DEC-04` | Which data fields are mandatory? | Need, approximate quantity, contact, product intent; requested date/artwork and Business fields conditional | Confirm per active service and legal need |
| `S0-DEC-05` | Can the website receive artwork? | No public upload initially unless all security/legal/storage controls proven; assisted alternative | Approve only with audited storage and processing |
| `S0-DEC-06` | Response promise? | State process without numeric time; upgrade only with owner and capacity evidence | Approve final copy, not invented SLA |
| `S0-DEC-07` | Direct checkout/Account/Builder in S0? | Not included. Informational or hidden paths only | No new decision needed unless expanding scope |
| `S0-DEC-08` | What counts as completion? | Customer reaches legitimate contact, or one genuinely accepted request with accessible next step; founder burden checked | Accept experience + operational dual outcome |

**Defaults are recommendations, not automatic Owner approvals.** Unknown facts are precisely listed so the Owner only decides what cannot be resolved by repository/source inspection.

## 20. Risk register and mitigation

| Risk | Trigger | User/business impact | Gate or mitigation |
|---|---|---|---|
| `S0-R-01` Misleading CTA | Link to unbuilt checkout or unattended channel | Lost trust, conversion loss | Offer publication checklist and click-through test |
| `S0-R-02` Fake accepted inquiry | Frontend success before source commit | Lost business request | Source-backed receipt only |
| `S0-R-03` Duplicate lead | Retry/double-click after timeout | Founder rework and polluted pipeline | Replay-safe idempotency, unknown reconciliation |
| `S0-R-04` PII leakage | Public status or private asset link | Privacy/security incident | Authorization, privacy-negative checks, no public caching |
| `S0-R-05` Unapproved production promise | Dates/price generated from user input | Margin loss, customer disappointment | Human feasibility, verified terms |
| `S0-R-06` Artwork malware/IP issue | Direct upload without safe controls | Security and legal risk | Assisted fallback, upload gate |
| `S0-R-07` Founder workload spike | High inquiry volume + unread queue | Missed follow-up, burnout | Owned queue, capacity gate, metrics |
| `S0-R-08` Over-designed heavy mobile page | Autoplay, SDK, unoptimized imagery | Abandonment and a11y failure | Progressive enhancement/performance evidence |
| `S0-R-09` Cross-brand policy leakage | MultiGraph services treated as TeeStock apparel | Incorrect commercial offer | Preserve TeeStock business owner, bounded service set |
| `S0-R-10` Premature backend design | PRD assumed to require new DB entity/RPC | ERP creep and unsafe release | Architecture impact review, reuse existing command first |
| `S0-R-11` Contact provider outage | WhatsApp/email/human not responding | Invisible lost inquiry | Health check real destination, alternate support or pause CTA |
| `S0-R-12` False QA completion | CI passes unrelated repository tests | Unproven customer behavior released | Exact customer-route browser/authz/recovery evidence |

## 21. Measurement and learning — avoid invented KPI claims

| Measure | How to observe | Caution / quality countermetric |
|---|---|---|
| Correct-intent task success | Observed customer completes Home → Custom or Business route | Counting raw CTA clicks alone is insufficient |
| Contact/action reachability | Test actual destination and available owner response | Broken/ignored outbound action not success |
| Structured valid intake completion | Accepted governed request over started S0-B form | Never count local form validation as accepted lead |
| Clarification burden | Count questions needed after first adequate inquiry | Lower rate caused by refusing help is failure |
| Founder avoidable manual touches | Re-entry, status hunt, duplicate context reconstruction per request | Necessary physical vendor/QC actions are not waste |
| Net work cost per useful lead | Founder effort + provider/automation cost, where measured | Use actual expenses, not synthetic assumed savings |
| Mobile task usability | Moderated/reproducible route completion on chosen devices | Missing accessibility complaints ≠ accessible |
| P0 route performance | Field p75 when enough volume; repeatable lab until then | No fabricated field PASS |
| Trust incidents | Wrong claims, privacy error, false receipt, missing contact | A single serious breach can block exposure |

Before interpreting trends, record cohort, sample count, observation period, actual application revision, synthetic vs genuine data, and whether the product was operating S0-A or S0-B. **No success percentages are declared in advance.**

## 22. Bounded engineering discovery handoff (not a builder order)

If and only if Owner accepts this product scope, Head Engineering should open a separately approved technical discovery with this question:

> For the actual current TeeStock Next.js app and MGBOS existing commands, what is the smallest safe implementation that enables **S0-A** and, only where proven, **S0-B** without adding duplicated business truth, unsupported financial semantics or operational burden?

Required technical discovery output: exact current app routes/components; approved content and channel contract; MGBOS callable command/reuse vs missing capability; actor/org boundary; anti-abuse/PII model; idempotency/unknown-result path; media policy; observability; responsive/a11y/browser tests; estimate; backwards-compatible rollout; rollback; bounded file list; risk classification (do not redefine R0–R5); separate Owner approval for IC/WP. Technical detail such as SQL migrations, API route shape and deployment service belongs to that approved work package—not this PRD.

**No raw PRD-to-Antigravity instruction.** If the actual implementation scope exceeds S0-A or a proven S0-B adapter, stop for architecture and Owner review rather than silently widening it.

## 23. Internal author QA and exact delivery checklist

This checklist verifies **document quality only**, not independent implementation assurance.

- [x] Single bounded slice, no creation of another master PRD, no redefinition of business authority.
- [x] Actual `main` and PR #75 head recorded separately; no unverified deployed feature claims.
- [x] S0-A vs S0-B activation and owner/customer consequences explicitly distinct.
- [x] Existing TeeStock visual identity and four-job IA consumed without inventing new brand/color/URL authority.
- [x] Source-issued receipt vs chat/analytics and customer form vs binding order distinguished.
- [x] Proof/artwork/upload/approval, deadline, estimate and quote meanings separated.
- [x] Accessibility, slow mobile, reduced motion, error/unknown, no-provider fallback and PII addressed.
- [x] Exactly forty numbered native requirements, forty paired native test scenarios, and scenario/source links auditable.
- [x] Deferred retail/portal/AI/payment/marketplace explicitly excluded.
- [x] Founder workflow and current pilot remain independently gated.
- [ ] Owner business copy/offer/availability and exact support channel acceptance — **PENDING**.
- [ ] Exact implementation review, CI, browser tests, production environment evidence — **NOT PERFORMED**.
- [ ] Independent assurance and governance activation — **NOT PERFORMED**.

**Editorial QA disposition:** `AUTHOR_SELF_REVIEW_COMPLETE / COPY_READY / PRODUCT_APPROVAL_PENDING`. No source code, application state or GitHub PR is changed by creating this document.

## 24. Source register and change discipline

Sources consulted at the pinned revisions in frontmatter:

1. `docs/roadmaps/solo-founder-launch-roadmap.md` (`main`) — assisted-sales first, storefront is not pilot gate.
2. `bisnis/teestock/10-product-tech/website-information-architecture.md` (`main`) — job-based intent nav and Home information hierarchy.
3. `bisnis/teestock/02-brand/brand-identity-system.md` (`main` catalog reference via CX-03; require final brand signoff).
4. `systems/mgbos/apps/teestock/src/app/page.tsx`, `.../custom-atelier/page.tsx`, `.../layout.tsx` (`main`) — exact current frontend placeholder evidence.
5. `systems/mgbos/docs/product/teestock-operational-pilot-plan.md` (`main`) — pilot, physical reality and storefront exemption.
6. `cx-01-master-prd.md` (`PR #75 candidate`) — P0 parent requirements and non-functional intent.
7. `cx-02-customer-journeys-service-blueprint.md` (`PR #75 candidate`) — service handoff and visitor journey.
8. `cx-03-experience-design-interaction-spec.md` (`PR #75 candidate`) — P0 page patterns and accessibility.
9. `cx-05-custom-b2b-ordering-experience.md` (`PR #75 candidate`) — Custom/Business form and quote semantics.
10. `cx-06-customer-account-service-experience.md` (`PR #75 candidate`) — safe public support and private status boundary.
11. `cx-08-experience-quality-acceptance-contract.md` (`PR #75 candidate`) — quality/performance and risk gates.
12. `cx-09-phased-delivery-product-validation-plan.md` (`PR #75 candidate`) — S0 entry/exit/abort scope.
13. `CX-PKG-STAGE-CROSSWALK-R1.md` (`PR #75 candidate`) — priority vs slice without invented dates.

**Change rules:** Keep native `S0-FR` and `S0-AC` IDs stable once linked to work packages. Material semantic change requires version increment, source/owner reconciliation, and affected acceptance updates. Editorial copy polish need not change feature scope. Do not rename the parent canonical CX-01 IDs or merge this file into active governance without following document lifecycle and approval requirements.

**Readiness interpretation:** This is a **final editorial candidate for copy/paste and PR**, not a claim of final business acceptance or independent security/engineering verification. The single next concrete action, after integration into the repository, is Owner/Head Engineering scoping of the first approved CX-S0 implementation work package—not further proliferation of broad planning files.

