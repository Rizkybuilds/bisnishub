---
canonical_id: proposed.mgbos.product.teestock-customer-platform.dp06-customer-account-service-experience-r2
status: DRAFT
version: 0.2.0
owner: Rizky
author: ChatGPT / AI Co-Founder & Product Strategy
approver: PENDING_OWNER_AND_INDEPENDENT_PRODUCT_REVIEW
document_class: product-experience-research-and-change-proposal
scope: teestock-customer-platform-cx06-account-and-service-deepening
normative_authority: NONE
repository: Rizkybuilds/bisnishub
source_ref: main
source_baseline_commit: 57eaafbb0ceef99a5fc6b2d77d724f6ff510727d
source_cx06_blob_sha: a2e0822ff0a2d5a15da494879a95919d5f3168f3
source_cx01_blob_sha: 3602550f5d54c8b58512014b54ec916d9b75f3e4
source_cx02_blob_sha: f77bca68b26ebf1132b1076f152e72dcbba0a7df
source_cx08_blob_sha: 96ea99276255189a12fe59084f94f91337b5062d
source_business_customer_service_blob_sha: a4f15f62629ce0814ad4af65cb4d8f5267fe7536
source_business_returns_blob_sha: da39f66bde3e738bae410244cee56dbfd60f0354
source_business_commerce_policy_blob_sha: e4bf93bca7b0a5d607a60fdac6fbc84e6f992622
source_mgbos_authorization_blob_sha: 750f7ee25bd998d13212b25238e5e34ffed940ac
proposed_destination: systems/mgbos/docs/product/teestock-customer-platform/CX-PKG-DP06-CUSTOMER-ACCOUNT-SERVICE-EXPERIENCE-R2.md
baseline_checked: 2026-10-17
research_mode: SOURCE_GROUNDED_PRODUCT_DISCOVERY_AND_EXTERNAL_UX_SECURITY_REFERENCE_REVIEW
self_review: PERFORMED
independent_review: NOT_PERFORMED
actual_user_research: NOT_PERFORMED
prototype_execution: NOT_PERFORMED
security_runtime_assurance: NOT_PERFORMED
engineering_readiness: NOT_ASSESSED
implementation_authorization: NONE
merge_authorization: NONE
deployment_authorization: NONE
supersedes: null
depends_on:
  - docs/governance/documentation-constitution.md
  - docs/governance/canonical-source-map.md
  - docs/roadmaps/solo-founder-launch-roadmap.md
  - bisnis/teestock/10-product-tech/digital-product-vision.md
  - bisnis/teestock/10-product-tech/website-information-architecture.md
  - bisnis/teestock/07-operations/customer-service.md
  - bisnis/teestock/07-operations/returns-and-warranty.md
  - bisnis/teestock/12-legal-ip/customer-commerce-policy.md
  - bisnis/teestock/04-services/business.md
  - bisnis/teestock/04-services/custom.md
  - systems/mgbos/docs/architecture/permission-authorization-model.md
  - systems/mgbos/docs/product/teestock-customer-platform/cx-01-master-prd.md
  - systems/mgbos/docs/product/teestock-customer-platform/cx-02-customer-journeys-service-blueprint.md
  - systems/mgbos/docs/product/teestock-customer-platform/cx-03-experience-design-interaction-spec.md
  - systems/mgbos/docs/product/teestock-customer-platform/cx-04-commerce-checkout-experience.md
  - systems/mgbos/docs/product/teestock-customer-platform/cx-05-custom-b2b-ordering-experience.md
  - systems/mgbos/docs/product/teestock-customer-platform/cx-06-customer-account-service-experience.md
  - systems/mgbos/docs/product/teestock-customer-platform/cx-07-omnichannel-external-integration-requirements.md
  - systems/mgbos/docs/product/teestock-customer-platform/cx-08-experience-quality-acceptance-contract.md
  - systems/mgbos/docs/product/teestock-customer-platform/cx-09-phased-delivery-product-validation-plan.md
  - systems/mgbos/docs/product/teestock-customer-platform/CX-PKG-TRACE-R1.csv
  - systems/mgbos/docs/product/teestock-customer-platform/CX-PKG-DECISIONS-R1.md
---

# DP-06 — TeeStock Customer Account & Service Experience Deepening R2

**Disposition:** `COPY_READY / AUTHOR_SELF_REVIEWED / DRAFT / NON-CANONICAL`.

**Purpose:** A bounded and source-grounded product-experience change proposal that **deepens** existing [CX-06 — TeeStock Customer Account & Service Experience v0.1.1](cx-06-customer-account-service-experience.md). It is **not** a replacement CX-06, a parallel canonical PRD, an account/authorization design, a refund policy, a new Customer Case entity contract, a payment integration contract, or an Antigravity implementation work package.

**North star:** **Powerful underneath, effortless on the surface.** The customer's account is a place to understand what is real and act on what matters, not a public copy of the internal MGBOS administration console.

**Evidence constraints:** This file describes *proposed behavior*, not a functioning public customer account. There is no independent demonstration here of guest access, account sign-in, private status read models, B2B organization access, case creation, return workflows, payment truth, provider rights, or user testing. All example states and references are illustrative. Current TeeStock public `/support/contact` source at the reviewed baseline explicitly describes the direct contact channel as **not yet activated**. Do not mistake an internal specification, displayed route, or accepted draft for a deployed and usable customer service capability.

---

## 0. Executive product decision

### 0.1 The outcome to design

A customer should be able to answer five questions without repeatedly contacting the founder:

1. **What exists?** Is this a draft, accepted inquiry, quotation, confirmed order, open case or return request?
2. **What changed?** What is the last verified milestone, and when was it verified?
3. **Do I need to act?** Is there an authorized payment, proof/quote review, clarification, or service decision requiring the customer's attention?
4. **What can I safely see?** Does this customer or organization contact have the right to see the document and perform the proposed action?
5. **Where do I get help?** Can the customer reach an actual supported contact channel when self-service is insufficient?

Customer success and founder leverage must both be present. Showing customers a status that creates three more clarification messages is not a self-service win. An automated message without a customer-authorized source of truth is not a customer-service improvement.

### 0.2 Experience character

- **Quietly useful:** Present the most important next action or fact first; never force customers to interpret internal stage codes.
- **Confidently honest:** Distinguish confirmed fact, permitted estimate, missing evidence, stale information, and unknown external state.
- **Action-oriented:** A task card has a meaningful action, prerequisite, permission, expiry/review condition, and recovery path.
- **Privacy-respecting:** The UI never relies on the existence of a URL or a logged-in session alone to imply resource authorization.
- **Resilient by default:** Missing AI, messaging providers or optional dashboards must not prevent safe account tasks or genuine assistance.
- **Founder-efficient:** Every valid service request carries previously authorized transaction context into the operator workflow without building parallel shadow records.

### 0.3 Scope by proposed product slice

| Slice | Customer capability design | Explicit boundary |
| --- | --- | --- |
| `CX-S0` | Honest public help, verified policy information, assisted status and request confirmation where a legitimate channel actually operates | No invented sign-in, order-history API, guest lookup, live chat, response SLA, or automated return approval |
| `CX-S1` | Eligible retail order confirmation/status, verified identity/guest support if individually authorized, scoped account basics if business and security gates justify them | Full B2B portal, broad file access, and automatic account claiming are not implied |
| `CX-S2` | Proven customer action center, secured cases, return requests, documents, exact-version quote/proof actions, repeat inquiry/order where eligible, selective channel support | Only after resource authorization, legal/business policy and transaction command assurance |
| `CX-S3` | Optional advanced AI, proactive digest, account-specific templates, richer multi-organization workflows where measurable benefit exists | No autonomous financial, refund, proof, credit or production commitments |

**Important:** CX-06 uses `P0/P1/P2` for parent requirement priority; CX slices express a proposed capability sequence. Preserve `CX-PKG-STAGE-CROSSWALK-R1.md` and existing roadmap interpretations until the relevant owner approves any change. The table above is an experience-planning interpretation, not an independent schedule or forced rescope.

### 0.4 What this specification does not own

- TeeStock business documentation owns commercial, customer-service, warranty/returns, privacy and communication policies.
- MGBOS architecture owns identity, organization/resource authorization, state semantics, financial transaction effects, order and fulfillment evidence, audit and domain models.
- CX-06 owns the **customer-visible experience requirements** and legitimate interaction outcomes after approval.
- CX-03 owns reusable visual/interaction grammar, CX-04 owns purchase and checkout behavior, CX-05 owns Custom/B2B quote/proof workflows, CX-07 owns provider/channel expectations, CX-08 owns measurable verification and CX-09 owns proposed sequence.
- Head Engineering determines technical risk, test assurance, architecture and implementation work packages. A proposed product UX rule is not a new backend command.

---

## 1. Source alignment and reconciliation method

### 1.1 Exact upstream state

At inspected main `57eaafbb0ceef99a5fc6b2d77d724f6ff510727d`:

- CX-06 v0.1.1: 48 `CX6-FR`, 28 `CX6-BR`, 44 `CX6-AC`, 17 proposed decisions and 14 proposed risks.
- CX-01: parent outcome / scope owner; CX-02: eight customer service blueprints including post-order `JRN-06`; CX-03: 12 common presentational states; CX-04 and CX-05: purchase / exact-proof and quotation contracts; CX-08: performance, accessibility and QA.
- Canonical upstream TeeStock `customer-service.md` governs case ownership and support philosophy; `returns-and-warranty.md` governs operating handling; `customer-commerce-policy.md` governs customer terms, subject to applicable law and legal review.
- MGBOS `permission-authorization-model.md` distinguishes identity, membership, capability, resource scope and business-rule authorization.

This document **does not close** outstanding `CX6-DEC-01..017` or `CX-DP-01..17` decisions. The previously delivered conversational DP-01..05 artifacts are useful companion research only; they were **not found on inspected main** and cannot be reported as adopted repository contracts.

### 1.2 Change discipline

- Keep all existing `CX6-FR-001..048`, `CX6-BR-001..028` and `CX6-AC-001..044` IDs and meaning intact.
- Use the `DP06-*` namespace for *candidate* refinements and tests; do not silently renumber existing requirements.
- Crosswalk every candidate with an existing semantic owner before any modification to CX-06.
- When a parent or child conflicts with business rules or backend transaction semantics, **STOP AND ESCALATE** to the owner; do not invent the resolution.
- Use separate classification for `PROPOSED`, `SOURCE-VERIFIED`, `USER-OBSERVED`, `SECURITY-VERIFIED`, `IMPLEMENTED`, and `NOT_VERIFIED`.

### 1.3 Eight existing service journeys, no replacement

| CX-06 journey | User outcome | DP-06 enrichment |
| --- | --- | --- |
| `CX6-JRN-01` | Guest can reach status/help after a valid purchase/inquiry | Scope proof, low-disclosure lookup states, account-free fallback |
| `CX6-JRN-02` | Authenticated customer sees genuinely owned records | Personal/business context, reliable empty/error distinction, private data cleanup |
| `CX6-JRN-03` | Customer understands order, payment and shipment | Meaningful timeline, evidence freshness, split delivery, next action |
| `CX6-JRN-04` | Customer reviews an authorized quotation/proof | Action cards, exact versions and stale/concurrent decision recovery |
| `CX6-JRN-05` | Customer gets a real resolution path | Service intake, contextual case history and accountable escalation |
| `CX6-JRN-06` | Customer requests an applicable return/remedy | Policy transparency, step-by-step milestones, no false refund completion |
| `CX6-JRN-07` | Organization contact acts within current permission | Context switch, role-specific tasks and document scoping |
| `CX6-JRN-08` | Customer repeats an eligible purchase/order request | Historical-template reuse with fresh price/availability/permission review |

---

## 2. High-level information architecture: a customer action center

### 2.1 Core model

The future account home should be a **Customer Action Center**, not a generic multi-tab admin dashboard. An individual's first screen answers:

1. **Action needed from you**, if any validated action exists.
2. **Your current orders and inquiries**, sorted by customer relevance rather than raw database order.
3. **Latest confirmed updates**, with clear freshness/provenance.
4. **Help and service requests**, including cases still awaiting response or resolution.
5. **Useful account resources**, with accessible history, documents and reorder where permitted.

For first-time users with no legitimate records, show an honest first-use empty state and helpful Shop/Custom/Business entry points. Do not conjure dummy cards or infer they have no orders when backend data was unavailable.

### 2.2 Proposed conceptual navigation (not URL contract)

| Area | What appears | Scope |
| --- | --- | --- |
| Overview | Pending valid actions, recent orders, cases and updates | P1/S2 as authorized |
| Pesanan & Permintaan | Orders and accepted inquiries, clearly distinguished | P0 assisted / P1+ protected |
| Penawaran & Persetujuan | Quotes and proof review, exact version and permission | S2 gated by CX-05/MGBOS |
| Bantuan | Topics, case submission and history, legitimate human escalation | S0 public facts / S2 account |
| Retur & Solusi | Request, eligibility, evidence, decisions and remedies | S0 informational / S2 eligible actions |
| Dokumen | Only allowed invoices, quotes, proofs, applicable terms | S2, file-specific access |
| Profil & Preferensi | Contact methods, permitted addresses, communications and consent | P1 gated |
| Organisasi | Account switch and role-specific tasks | S2/S3 only after authorization assurance |

Customer-facing labels are conceptual and subject to the brand voice and IA owner. **Do not** turn these into eight permanent primary navigation buttons. On mobile, the same hierarchy can be exposed via a smaller, task-first navigation surface.

### 2.3 Action card anatomy

Every action card must be grounded in an actual authorized source:

- **Plain-language task:** e.g., `Tinjau penawaran versi 3`.
- **Reference:** an actually accepted order/inquiry/quote identifier, appropriately masked.
- **Reason:** why the customer needs to act, not a raw internal state enum.
- **Consequence:** what will and will not happen after the action.
- **Validity:** current version, expiry or action prerequisites where relevant.
- **Primary action:** only if current user, resource, action, channel and business policy allow it.
- **Fallback:** what to do when the action is outdated, unavailable, or cannot be confirmed.

On card open, **re-check** permission and state rather than relying solely on an earlier home-screen snapshot. An expired quote or revoked organizational role cannot remain actionable because the frontend cached a button.

### 2.4 Illustrative personalized overview

> **Perlu tindakan Anda**: Satu penawaran sedang menunggu tinjauan.  
> **Status terbaru**: Paket pertama telah diserahkan ke kurir berdasarkan bukti yang diterima.  
> **Bantuan**: Satu permintaan sedang diperiksa.  
> **Catatan**: Data terakhir diperbarui berdasarkan catatan terverifikasi yang tersedia.

These are **synthetic examples**, never universal default content or proofs of an actual transaction. If no authorized data exists, do not render the cards.

---

## 3. Screen anatomy and state inventory

The following screen identifiers are **DP06 conceptual screen specimens**, not actual routes. CX-03 owns global component behavior; CX-06 retains eventual owner of account/service experience semantics.

| Screen ID | Screen and focal information | Primary task | Critical empty/error/recovery |
| --- | --- | --- | --- |
| `DP06-SC-01` | Public help & policy home: service topics, actual hours, available channels | Find answer or contact supported staff | Channel unavailable; no invented live support |
| `DP06-SC-02` | Private account overview: next actions, latest progress, case shortcuts | Orient and prioritize | No owned records vs retrieval failure vs unauthorized |
| `DP06-SC-03` | Guest verification: explanation, minimum proof, limited status result | Retrieve permitted status | Expired/invalid/throttled/nonexistent treated without enumeration |
| `DP06-SC-04` | Orders/inquiries list: filter by meaningful state and type | Find a specific accepted record | Legitimate empty, loading, error, stale and partial-result states |
| `DP06-SC-05` | Order detail: purchased item snapshot, payment, fulfillment and actions | Understand real progress | Provider pending, partial shipment, archived/legacy record, stale status |
| `DP06-SC-06` | Quote/proof action: exact document version and consequences | Review/revise/accept if allowed | Concurrent edit, expired link, unauthorized actor, unknown submit result |
| `DP06-SC-07` | Service request: attached order context, description, evidence | Ask for resolution without retyping | Double submit, failed attachment, no support route, missing info |
| `DP06-SC-08` | Case detail: customer-visible messages, owner/next step, timeline | Follow issue and respond when needed | Internal note exclusion, case ownership transfer, lost provider messages |
| `DP06-SC-09` | Return/remedy: policy context, eligibility and evidence request | Start and track legitimate remedy | Unsupported product/channel, pending inspection, refund not settled |
| `DP06-SC-10` | Account preferences: contact, addresses, consent | Change future preferences | Security recheck, old shipment immutable, opt-out separate |
| `DP06-SC-11` | Organization context and documents | Find business tasks/records with proper authority | Revoked role, wrong organization cache, direct URL leakage |
| `DP06-SC-12` | Reorder/quote-again: old specs versus fresh conditions | Begin a new governed intention | Retired SKU, expired pricing, revoked art rights, missing quantities |

### 3.1 Universal UI state distinctions

Inherit `CX3-STATE-01..12` for shared presentational behavior; do not create competing backend states. Especially keep the following customer-visible meanings separate:

| State | Appropriate message behavior | Forbidden misinterpretation |
| --- | --- | --- |
| Waiting for data | Clear loading affordance and safe unchanged context | Treat as no orders/cases |
| Confirmed empty | Valid authorized retrieval yielded no permitted records | Claim backend succeeded when it failed |
| Service unavailable | Relevant data cannot currently be retrieved | Claim a missing order does not exist |
| Unauthorized | Safe denial, sign-in or help route where legitimate | Reveal the protected object exists |
| Stale | Last verified value labeled, check/retry as supported | Show stale state as current truth |
| Action submitting | Request accepted outcome not yet known | Optimistic `approved` or `paid` |
| Outcome uncertain | Verification/recovery path without blind duplicate writes | Automatically present success or failure |
| Accepted action | Durable authorized receipt with permitted reference | Equate request, authorization, settlement or resolution |

### 3.2 Content priority and mobile

- On small screens, display **one important action and the most useful current fact** before showing a dense activity feed.
- Do not rely on horizontal scroll to access quote terms, payment facts, case reply or dispute escalation.
- Sticky controls must not cover bottom-of-screen inputs or the virtual keyboard; readable legal/commercial terms remain accessible.
- Status labels must include plain meaning; color/icon alone is insufficient.
- All relevant focus, error and status changes must work with keyboard and assistive technologies.
- A screen-reader user should not need to traverse an entire historical timeline before reaching the current relevant action.
- Complex organization workspaces remain optional; no forced internal-dashboard metaphors for regular customers.

---

## 4. Guest experience and personal identity boundary

### 4.1 Account-free where legitimate, but never open access

The customer who purchased as a guest should not automatically be required to register merely to contact support. This is different from authorizing an unauthenticated person to read someone else's order.

Guest access, if activated, must use an approved, abuse-resistant proof flow with **limited scope**. A visible order number, email address or public URL alone is not evidence of ownership. Exact proof technology, strength, expiry, session and revocation semantics belong to Identity/Security architecture, not this PRD.

### 4.2 Guest lookup step contract (`DP06-SC-03`)

1. Explain what kind of record can be retrieved and how identity will be verified.
2. Ask only for required proof according to the approved mechanism; do not collect unnecessary national IDs or sensitive customer data.
3. Show neutral progress without disclosing whether another person's order exists.
4. On valid proof, reveal only the minimum permitted status/action and not full account financial history by default.
5. On expired proof, use a safe re-verification/help path; throttle abusive attempts without punishing legitimate users arbitrarily.
6. On source failure, show `belum dapat memverifikasi saat ini` rather than `pesanan tidak ditemukan`.
7. On shared device or logout, clear previous private screen state and reject stale private data at the server; browser cache policy must be architecture-reviewed.

**Anti-pattern:** An attacker changes the order ID in the URL and sees another customer's address. The interface must not be designed to rely on a hidden button or opaque ID as access control. OWASP API1:2023 specifically calls out broken object-level authorization risk.

### 4.3 Register and link historical orders (later stage)

Account creation and historical claim/linking are separate customer events. Matching a phone/email string to a historical order is not sufficient evidence to transfer access. Unproven historical linking must remain deferred even if it makes the UI appear more convenient.

### 4.4 Organization contact is not a staff user

A B2B buyer, order requester, artwork reviewer, accounting recipient, finance approver and business owner may be different people. Their access must reflect verified current membership and resource/capability scopes, not reuse of MGBOS's internal `OWNER`, `SALES` or `FINANCE` labels by visual analogy.

---

## 5. Order detail as a living, evidence-backed explanation

### 5.1 Four independent views of progress

A status interface should show relevant dimensions separately:

| Dimension | Customer may understand | Evidence owner | Distortion to prohibit |
| --- | --- | --- | --- |
| Commercial order | Request, quote, accepted order and current scope are distinct | MGBOS order/quote source | Treat inquiry receipt as accepted paid order |
| Financial | Payment action needed, verification pending, confirmed effect or refund stage | MGBOS payment/invoice/ledger owner | Confirm payment from redirect, bank screenshot or AI text |
| Production | Actual authorized progress of Custom/Business work, where disclosable | MGBOS production/QC source | Auto-advance because a scheduled date passed |
| Fulfillment | Packed, label created, carrier accepted, delivered when actually supported | Fulfillment/carrier evidence | Equate tracking ID/label with carrier possession |

These dimensions need not all appear on every order. Show only relevant, permitted facts; a retail ready-stock order should not display meaningless artwork/proof steps, and a Custom inquiry without an accepted order must not present a payment timeline.

### 5.2 Timeline evidence contract

For every customer-visible milestone, record the conceptual relationship between:

- customer-safe label and explanation;
- authoritative source and last known proof;
- evidence timestamp **and** presentation freshness;
- whether the fact is verified, pending, externally reported or unavailable;
- customer action when required;
- limitations on estimated future milestones;
- human recovery when provider information contradicts internal evidence.

A timestamp of a customer-facing page load is not the same as the date when the business event became true.

### 5.3 Split shipment and uncertain delivery

When an order has multiple legitimately separated parcels, the customer should see distinct parcel statuses and useful association with item(s), if the source supports it. One package delivered cannot mark the complete order delivered unless all relevant conditions and policy are fulfilled. A carrier notification that has not reconciled must not overwrite a stronger canonical internal fact without approved integration rules.

### 5.4 Screen illustration: one Custom order, synthetic

> **Pesanan contoh — pekerjaan apparel custom**  
> **Status utama:** Sedang menunggu tindakan Anda.  
> **Artwork:** Bukti desain versi 2 perlu ditinjau.  
> **Pembayaran:** Status belum dapat dipastikan; kami sedang memverifikasi.  
> **Produksi:** Belum dapat dinyatakan dimulai.  
> **Langkah berikutnya:** Tinjau dokumen desain yang benar atau hubungi bantuan jika terdapat perbedaan.

This is not permission to show a quote/proof link without authenticated object access. The example neither states a real payment/provider status nor defines a new canonical enum.

### 5.5 Important failure cases

- **Failed read:** do not reset to `belum ada pesanan`.
- **Old tab:** before a risky action, revalidate the current quote/proof/payment precondition and show changes.
- **Missing carrier event:** do not backfill invented `shipped` evidence.
- **Provider outage:** preserve last reliable status labeled as stale; show approved channel help when needed.
- **Unknown payment:** route to the approved reconciliation path, never offer a blind new charge.
- **Order change:** historical purchased specification stays distinct from a catalog product that is now edited or retired.

---

## 6. Quotations, artwork, invoices and B2B workspace

### 6.1 Document action is a privilege, not a navigation affordance

Viewing an invoice, retrieving an artwork proof and approving a quote are different privileges. A user permitted to request a price is not necessarily permitted to accept commercial terms. The UI must present meaningful actions only after current server authorization, and direct link/API/file requests must be independently protected.

### 6.2 Quote/proof card anatomy (`DP06-SC-06`)

| Region | User requirement |
| --- | --- |
| Context | Document type and owning customer/organization, without exposing unauthorized names |
| Reference | Exact version, effective status, validity and linked request/order where authorized |
| Contents | Readable scope, item/quantity, approved totals/terms or proof placement constraints |
| Comparison | When applicable, what changed since a previous *permitted* version |
| Caution | Expired/stale/version-changed status and impact on acceptance |
| Action | Exact current actor-permitted approve/revise/decline/question flow |
| Evidence | Durable accepted action result, reference and customer-friendly meaning |
| Recovery | Recover safely from timeout, expired session, newly revoked role and concurrent revision |

**Four separations:** `proof preview ≠ proof approved`, `quote viewed ≠ quote accepted`, `PO uploaded ≠ payment confirmed`, and `proof approved ≠ production released`. No single visual “Done” badge may collapse these meanings.

### 6.3 Formal B2B context switch (`DP06-SC-11`)

When an actor is approved for more than one business account, the interface clearly identifies the **active organization context** and a user-permitted ability to switch. On switch:

1. Do not retain previously visible private documents or action cards from another organization in rendered state.
2. Re-fetch current authorized resources after the switch.
3. Revalidate capability for every action including direct deep links.
4. Ensure private client cache, prefetch and downloadable files cannot leak old-account data.
5. Present a safe exit/help message for revoked or unavailable membership without confirming existence of foreign objects.

Even in a single organization, the quote approver may not be the invoice recipient. Avoid a universal “organization member = all document access” assumption.

### 6.4 File and invoice access

- Use scoped, revocable, sufficiently protected access according to security architecture.
- Private artwork and invoice URLs do not become safe merely because they are difficult to guess.
- Show document version and provenance where required to distinguish current from outdated.
- For file preview/print/download, reuse the same policy-enforced resource access; do not trust browser-only hiding.
- Do not expose internal vendor margins, supplier costs, staff notes or other organizations' commercial details.
- Financial documents reflect finance authority; customer account must not recalculate accounting facts.

### 6.5 Multiple stakeholders

A business request may be submitted by one employee and approved by another. “Waiting for your approval” may be shown only when the current actor is the actual permitted approver; other contacts may see a non-sensitive `menunggu persetujuan pihak berwenang` if policy permits. Do not leak the approver's identity or privileged activity to a user without that entitlement.

---

## 7. Service case experience: solve the problem, not the ticket count

### 7.1 Contextual support entry (`DP06-SC-07`)

Where allowed, launch help from the relevant order, inquiry, quote, artwork proof or shipment. Prefill only approved non-sensitive context from authoritative objects and let the customer review/adjust their description. A help form should not ask the same customer to re-enter order ID, item, quantity and contact facts already verified in a safe current session.

Suggested steps:

1. Identify a user-understandable problem category.
2. Show a useful existing answer if it genuinely resolves the situation, **without blocking human escalation**.
3. Present the relevant safe context and ask for only missing details.
4. Allow approved evidence attachment with clear privacy and size/type constraints.
5. Summarize the issue and desired resolution; explain that submitting a case is not approval of a refund/change.
6. Acknowledge only after an authorized durable receipt; show a case reference and supported contact expectation.
7. Link future follow-ups to the same issue when the business process supports it, while avoiding improper mergers of unrelated issues.

### 7.2 Case detail (`DP06-SC-08`)

The customer view should expose:

- one concise problem summary;
- readable customer-visible case stage (not internal `WAITING_INTERNAL` enum);
- latest relevant response and whether the **customer** must act;
- what has been received/verified, not what is assumed;
- allowable evidence, correction, follow-up or closure/reopen routes;
- known next step and response expectation only when grounded in an approved service policy.

A case may relate to a separate MGBOS Operational Exception; it does **not** replace that exception, assume its authority, or reveal internal vendor failures/costs that are not appropriate customer disclosures.

### 7.3 Ownership and founder effort

The founder might perform service, supply coordination, QC, finance review and shipment handoff alone. A customer should still have a coherent case owner/next step; internal role multiplexing does not justify disappearing case accountability.

Automate (when approved) classification, safe context retrieval, repeated FAQ presentation and reminders; keep human responsibility for policy exceptions, difficult claims, conflict resolution, commercial concessions, vendor and physical investigation, and customer escalation needing judgment.

**Do not** optimize simply for low ticket count. Track successful resolution, repeat contact, response quality, time-to-resolution and founder administrative minutes. A chatbot that discourages legitimate claims is not a service success.

### 7.4 Channel migration

WhatsApp, email, marketplace messaging and website account views are **channels**, not substitutes for the governed Customer Case history. Any channel shift should preserve a permitted and verified case reference; customer context should be transferred securely and only when provider and consent policy allow. Do not silently broadcast private case content across channels.

### 7.5 Human availability state

If the founder or approved support channel is not active, say so accurately. Do not display `Chat live sekarang`, response hours, or guaranteed SLA that the operating model cannot meet. Provide published self-help or a genuine alternative if available; do not generate a dead-end form that never reaches an operator.

---

## 8. Returns, refunds, replacements, cancellation and disputes

### 8.1 Remedy journey (`DP06-SC-09`)

The product must make the **customer's request** separate from **TeeStock's decision** and separate again from **actual physical/financial execution**:

1. Open only a permitted order/item (or legitimate verified assisted alternative).
2. Display currently applicable returns policy and channel-owner limitations.
3. Let the customer explain the issue and the desired remedy, without promising availability.
4. Collect relevant evidence only; provide accessible alternatives when upload is unavailable.
5. Present a review summary before submission.
6. On durable acceptance, show `permintaan diterima untuk diperiksa` with an appropriate reference.
7. Show any authorized later decision, shipping instructions, physical receipt/inspection, replacement shipping or refund processing as **distinct evidenced milestones**.
8. Provide a next step or human escalation for unclear policies, Custom/personalized products and marketplace-owned cases.

### 8.2 Remedy truth table

| What the source confirms | Allowed presentation | Not allowed |
| --- | --- | --- |
| Return/claim request received | `Permintaan diterima untuk ditinjau` | `Retur disetujui` |
| Eligibility approved | `Pengembalian disetujui sesuai instruksi` if actually authorized | `Dana sudah dikembalikan` |
| Item received for inspection | `Produk telah diterima untuk pemeriksaan` | `Klaim otomatis diterima` |
| Refund approved | `Pengembalian dana disetujui` | `Dana sudah masuk rekening` |
| Refund processing verified | State processing channel and expected next steps if supported | `Refund selesai` without settled effect evidence |
| Refund settled under authoritative provider/finance record | Explain the confirmed settlement fact and practical bank caveat as policy permits | Invent customer bank posting time |
| Replacement approved | `Produk pengganti direncanakan` if capacity/commitment supports this language | `Paket pengganti telah dikirim` without handoff |
| Cancellation requested | `Permintaan pembatalan sedang ditinjau` | `Pesanan batal` or halted production absent actual action |

### 8.3 Policy boundaries and product differences

The customer experience must distinguish ready stock, made-to-order, personalized Custom and B2B contractual work because rights and procedures may differ. **Do not invent specific return windows, “non-returnable” clauses, refund amounts or cancellation cutoffs** from generic assumptions. The canonical TeeStock Customer Commerce Policy and applicable law control customer entitlements. A legal or policy conflict stops product promotion of the affected flow.

### 8.4 Marketplace-owned disputes

Where a marketplace controls claim deadlines, disputes, chat and payment/refund actions, the customer must receive the provider-appropriate route. TeeStock may still show facts allowed by integration terms, but it cannot represent itself as having unilateral control over marketplace refund eligibility. Preserve the external order/source identity and reconcile with internal fulfillment safely.

### 8.5 Cancellation vs irreversible operations

Requesting cancellation is not the same as stopping production, recalling a courier, reversing payment or restocking inventory. Customer-facing language should explain when a request needs investigation; only approved authoritative commands cause business effects. If the customer's request is too late to guarantee an outcome, present the real options rather than false certainty.

---

## 9. Reorders, historical context and private profile

### 9.1 Reorder as a new commercial proposal (`DP06-SC-12`)

Past orders should simplify new requests without silently carrying forward historical terms. When customer chooses `Pesan lagi`:

- Load only an eligible prior order/specification they may access.
- Distinguish **historical paid/accepted specification** from **current sellable variant/configuration**.
- Recheck stock, production method, current price book, available options, artwork rights, quantities, delivery requirements, and business actor authorization.
- Present changed options and commercial terms for customer review.
- Create a fresh governed intent, quotation or order only through approved commands, with a new identity and no copied payment evidence.
- Route unsupported or complex Custom reorders to reviewed inquiry with previous context preserved.

### 9.2 Profile edits are not historic transaction rewrites (`DP06-SC-10`)

Updating a saved address or phone should change future behavior according to approved policy. It must not automatically rewrite an accepted order, financial record, parcel label or courier shipment. The user sees when changes apply; sensitive profile changes require appropriate verification and audit as determined by architecture/legal owners.

### 9.3 Account preferences and marketing

Marketing consent, product suggestions, transactional service messages and sensitive security notifications have distinct basis and preference controls. The account screen must not bundle a mandatory checkout/service right with optional promotional consent. Relevant law/provider rules and legal review govern actual communication behavior.

---

## 10. Notifications and bounded AI assistance

### 10.1 Notification design contract

Every notification must answer: **what happened**, **which legitimate resource**, **what the customer should do**, **what the source knows**, **whether this is a marketing or service communication**, and **how to verify without exposing secrets**.

- Notifications originate from accepted source facts or clearly labeled requests, not speculative elapsed-time milestones.
- Retries and out-of-order events do not create a second approval, payment, order, return or case.
- Links must not reveal private records to any forwarded recipient; use appropriately scoped verification.
- Public snippets should minimize private data even on shared lock screens or inbox previews.
- Provider delivery success/failure cannot mutate commercial truth.
- Suppress redundant alerts and provide a reasoned batching/digest experience only where validated beneficial.

### 10.2 AI is optional, grounded, and escalation-ready

In a later evidence-gated release, AI may explain public policy, summarize **authorized** status, structure a support question, draft a customer-safe reply and recommend a legitimate next step. It must not:

- infer a payment/refund completion from a screenshot or browser redirect;
- claim a legal entitlement or guarantee unapproved resolution;
- change price/credit/quote/proof approval or organization membership;
- alter operational state or confidential file access;
- fabricate lead time, provider shipment event, or case handling commitment;
- block the human route or hide that its response lacks current evidence.

If the AI tool or model is unavailable, standard portal actions and actual support paths continue where independently available. The access context for AI tools must be scoped to the authenticated actor and object; prompt text is never authorization.

### 10.3 Support automation versus founder attention

| Task | Candidate digital delegation | Human remains responsible for |
| --- | --- | --- |
| Status question | Source-grounded answer from authorized read view | Conflicting/missing source evidence and sensitive disputes |
| FAQ question | Approved policy explanation and help link | New exceptions and unapproved promises |
| Case intake | Structured issue classification, context linking, receipt | Complex prioritization, liability and genuine customer recovery |
| Proof/quote reminder | Deterministic reminder from valid pending action | Authoritative decision and negotiation |
| Return evidence | Safe intake, progress and missing-information prompts | Eligibility dispute, inspection, concessions, refund authorization |
| Reorder | Previous approved specification as a starting point | New price, vendor feasibility and commercial exception |
| Notifications | Policy-driven delivery/retry, bounded logging | Data/consent incidents, wrong recipient, service-critical delivery failure |

---

## 11. Accessibility, performance and failure resilience

### 11.1 Inclusive interaction obligations

- Target **WCAG 2.2 AA** for customer-controlled routes and task states, subject to scoped specialist verification.
- Provide meaningful page titles, structure, field labels, error suggestions, focus indication and keyboard operation.
- Use status message semantics where applicable (WCAG 2.2 SC 4.1.3) for case submission, new action cards, save failures and pending results—without stealing focus arbitrarily.
- Support zoom/reflow, keyboard/mobile virtual keyboard, screen readers, high contrast and reduced-motion preferences.
- For complex terms, let customers read the complete document before approval, with a correction path for material mistakes.
- Do not require visual-only status timelines, arbitrary dragging, hover-only actions or AI voice/chat to complete important service tasks.
- For guest verification, security controls must remain accessible; do not introduce a CAPTCHA or inaccessible proof mechanism without an appropriate alternative.

### 11.2 Core performance principle

Customer account pages can have more dynamic data than public landing pages, but they must remain responsive on representative mid-range mobile devices. Only load authorized account sections, attachment previews and AI features when relevant; avoid downloading every invoice/proof on initial dashboard render. Prioritize current action and order summary before optional history charts or assistant widgets. CX-08 owns measured budgets and actual release evidence; this proposal sets no fabricated bundle-size or field p75 measurements.

### 11.3 Errors requiring deliberate recovery

| Failure | Customer-facing obligation | Backend/security review obligation |
| --- | --- | --- |
| Internet drops during case submission | State unknown, preserve permitted draft, offer verified recovery | Check accepted effect/idempotency before retry |
| Source order list unavailable | Show unavailable with retry; no misleading empty | Error isolation/telemetry without PII leak |
| Quote updates during approval | Explain old version no longer actionable | Revalidate version/authority/concurrency |
| Session expires during file download | Authenticate safely; preserve context if permitted | Recheck resource and file authorization |
| Org membership revoked while tab open | Remove visible private content; safe access denied | Verify server checks and cache isolation |
| AI fails or answers uncertainly | Show standard navigation and human help | No model-authenticated side effects |
| Payment provider pending | Show pending/unknown grounded status | Reconciliation; no blind duplicate charge |
| Notification sender fails | Explain only if customer needs to act elsewhere | Delivery failure recorded separately from business state |
| Marketplace dispute unresolved | Appropriate provider path and reference | Preserve channel ownership and separate source identity |

---

## 12. Founder effort and service-quality measurement

### 12.1 Product outcome metrics

| Proposed measure | Unit / numerator and denominator | Why important | Caveat |
| --- | --- | --- | --- |
| Verified self-service task completion | Successfully completed permitted status/help tasks / attempted valid tasks | Is portal useful, not just visited? | Sample and eligible tasks must be defined |
| Repeat-contact rate | Cases or order subjects with avoidable repeat contact / relevant cohort | Is uncertainty resolved? | Do not discourage legitimate escalation |
| Time to understand next action | Observed time in moderated sessions | Does card hierarchy help? | Prototype data is not production telemetry |
| False status complaints | Verified complaints caused by incorrect or misleading status / relevant cohort | Protects customer trust | Need human adjudication and denominator |
| Administrative founder minutes | Minutes copying/context-searching/manual acknowledgement per accepted case/order | Measures work actually removed | Separate physical operations time |
| Customer effort score | Measured response after actual task if research policy permits | Detects chatbot walls/friction | Survey convenience bias |
| Resolved/reopened cases | Cases resolved with later reopen per appropriate cohort | Tests actual remedy quality | Resolved is not identical to closed |
| Support intervention per 100 legitimate orders | Founder actions per normalized volume | Indicates leverage | Compare mix and case complexity |
| Cost per useful service action | Provider/messaging/AI costs per successfully completed task | Prevents expensive automation theater | Include operator cost and failed retries |

All baselines and numerical targets require actual data and explicit acceptance criteria. There is no claim that any savings or conversion uplift has occurred.

### 12.2 Physical and exception responsibilities

Founder may still need to inspect product defects, contact suppliers, negotiate returns, pack replacement goods, deliver to courier and authorize financial or commercial remedies. Product success means those **real tasks remain visible and correctly controlled** while avoidable transcription and status repetition decrease.

---

## 13. Candidate requirement refinements — `DP06-RQ-01..20`

Each row is a **proposed refinement** of existing CX-06 semantics, not a new authoritative requirement. A later integration author must link to exact existing definitions and preserve any existing more restrictive behavior.

| Candidate ID | Refinement | Observable expected behavior | Existing semantic trace | Candidate slice |
| --- | --- | --- | --- | --- |
| `DP06-RQ-01` | One actionable customer overview | Only real, authorized tasks shown; explain next action and object/version | CX6-FR-010/022; CX6-AC-007/018 | CX-S2 |
| `DP06-RQ-02` | Read-model truth and freshness | Every key milestone shows provenance/last verified update and non-false unknown states | CX6-FR-013/016; CX6-BR-004/016 | CX-S1/S2 |
| `DP06-RQ-03` | Guest-safe limited status | Proof-gated, low-disclosure guest flow with abuse-resistant recovery | CX6-FR-015/035; CX6-AC-009/010 | CX-S1 gated |
| `DP06-RQ-04` | Privacy-preserving personal history | Owned history with valid empty/error differentiation and historical snapshots | CX6-FR-011/012/035; CX6-AC-007/008/016 | CX-S1 gated |
| `DP06-RQ-05` | Contextual status explanation | Order/payment/production/shipment independent and actionably explained | CX6-FR-013/014/016; CX6-AC-013..015 | CX-S1/S2 |
| `DP06-RQ-06` | Verified quote/proof action card | Exact actor/resource/version/expiry, consequences and safe retry | CX6-FR-017..020; CX6-AC-018..021 | CX-S2 gated |
| `DP06-RQ-07` | B2B organization context hygiene | Visible current organization and no cross-org cache or action leakage | CX6-FR-036/042/043; CX6-AC-036/041/042 | CX-S2/S3 gated |
| `DP06-RQ-08` | Document-by-document permission | Server-checked invoice/proof/download preview and revocation handling | CX6-FR-021/037; CX6-AC-022 | CX-S2 gated |
| `DP06-RQ-09` | Problem-first service intake | Carry verified order context into case without duplicate transcription | CX6-FR-023/038; CX6-AC-023/040 | CX-S2 gated |
| `DP06-RQ-10` | Case accountability and follow-up | Customer sees owner-backed next step and safe public messages | CX6-FR-024..026/040; CX6-AC-024/025 | CX-S2 gated |
| `DP06-RQ-11` | Return/remedy milestone fidelity | Request, inspection, decision and actual refund separate | CX6-FR-027..029; CX6-AC-027..030 | CX-S2 gated |
| `DP06-RQ-12` | Channel-aware service routing | Direct marketplace/provider action to legitimate platform without false rights | CX6-FR-039/047; CX6-AC-038 | CX-S2 gated |
| `DP06-RQ-13` | Current-terms reorder | Old spec as context, new price/capacity/rights reviewed and re-authorized | CX6-FR-030/044; CX6-AC-031 | CX-S2/S3 |
| `DP06-RQ-14` | Correct future profile updates | Profile edits do not mutate committed orders/shipping | CX6-FR-031; CX6-AC-032 | CX-S1/S2 |
| `DP06-RQ-15` | Communication consent clarity | Distinct marketing preferences and necessary service notifications | CX6-FR-032/033/046; CX6-AC-033/034 | CX-S2/S3 |
| `DP06-RQ-16` | No false service availability | Only real contact route, response expectation and source receipts are promised | CX6-FR-001..008/037; CX6-AC-001..006 | CX-S0 |
| `DP06-RQ-17` | AI independent fallback | Optional grounded assistance never blocks governed or human help | CX6-FR-045; CX6-AC-026/043 | CX-S3 optional |
| `DP06-RQ-18` | Inclusive recoverable account tasks | Assistive/keyboard/mobile coverage and unknown-result recovery | CX6-FR-034/035; CX6-AC-035/037 | CX-S1/S2 |
| `DP06-RQ-19` | Service resolution over deflection | Count genuine resolution, customer effort and repeated contacts together | CX6-FR-038/048; CX6-AC-040/044 | CX-S0 baseline / S3 telemetry |
| `DP06-RQ-20` | No shadow operational truth | Case is not exception; notifications/UI are not transaction authority | CX6-FR-040/047; CX6-BR-008/015/023 | All slices |

### 13.1 Reconciliation verdict for candidate requirements

- **Not new entities:** No row above defines Customer Case, return, order, guest token, invoice or notification domain lifecycle.
- **Not automatic launch commitments:** The proposed first eligible slice remains subject to business, authorization and product validation gates.
- **Not a competing design system:** CTA, focus, error, feedback and responsive behavior continue to inherit CX-03.
- **Not payment/commercial policy:** No customer-visible estimate, refund label or document may change MGBOS finance or business-policy truth.
- **Not requirement re-numbering:** Existing CX6 IDs stay unchanged even where the R2 proposal sharpens acceptance.

---

## 14. Existing CX-06 coverage and preservation matrix

All 48 `CX6-FR` must remain intact. This table lists *coverage groupings*, not replacement definitions.

| Existing functional IDs | Primary preserved obligation | DP-06 enhancement owner |
| --- | --- | --- |
| `CX6-FR-001..008` | Public help, honest receipt, correct assisted recovery, actual support and uncertainty | Sections 0/7, `DP06-RQ-16` |
| `CX6-FR-009..016` | Identity, owned history, order detail, guest access, financial/fulfillment truth and freshness | Sections 2–5, `DP06-RQ-01..05` |
| `CX6-FR-017..022` | Scoped quote/proof/invoice actions and real pending tasks | Section 6, `DP06-RQ-06..08` |
| `CX6-FR-023..026` | Case receipt, messages, follow-up and resolution | Section 7, `DP06-RQ-09/10` |
| `CX6-FR-027..029` | Eligibility-sensitive return, remedy and cancellation requests | Section 8, `DP06-RQ-11` |
| `CX6-FR-030..034` | Reorder, profile/consent, notifications and session recovery | Sections 9–11, `DP06-RQ-13..15/18` |
| `CX6-FR-035..040` | Server authorization, org context, human help, founder context, provider ownership and exception separation | Sections 4/6/7/10, `DP06-RQ-07..10/12/16/20` |
| `CX6-FR-041..048` | Advanced claim, B2B workspace, templates, optional AI, proactive messaging and value instrumentation | Sections 4/6/9/10/12, `DP06-RQ-07/13/15/17/19` |

**Preserve 28 existing business rules:** `CX6-BR-001..028` remain the controlling proposed business/UX safety rules in the existing draft, including authorization versus identity, state honesty, proof version, return/refund separation, consent, channel rights, replay safety, revocation, no leaked internal notes and mandatory human support availability where offered.

**Preserve 44 existing acceptance cases:** `CX6-AC-001..044` remain unchanged. DP06 acceptance below proposes **additional tests and test clarifications**, not deletion or success claims about the existing scenarios.

---

## 15. Additional proposed acceptance scenarios — `DP06-AC-01..28`

Every acceptance case below is **NOT EXECUTED** and needs implementation-specific test design before enforcement. The wording intentionally distinguishes testable customer outcomes from engineering implementation. Some tests require separate independent security or finance assurance.

| Candidate AC | Given / when / then outcome | Existing CX6 acceptance link | Eligibility slice |
| --- | --- | --- | --- |
| `DP06-AC-01` | **Public help lists an inactive channel:** Given contact route not activated, when customer seeks help, then no working live-contact CTA or guaranteed reply is asserted; real alternatives only | CX6-AC-001/006 | S0 |
| `DP06-AC-02` | **Inquiry source is unavailable:** Given request submit outcome unknown, when customer refreshes, then no fictitious receipt is created and verified recovery available | CX6-AC-002/005 | S0 |
| `DP06-AC-03` | **Guest order ID guessing:** Given another customer order ID, when caller attempts lookup without approved proof, then no existence or private facts disclosed | CX6-AC-003/009/010 | S1 |
| `DP06-AC-04` | **Guest verification expires:** Given expired/scoped proof, when request retried, then safe denial/reverify without past private content | CX6-AC-009/010 | S1 |
| `DP06-AC-05` | **Order list service fails:** Given valid signed-in principal and failed history fetch, when overview renders, then unavailable/retry not zero-order claim | CX6-AC-008 | S1 |
| `DP06-AC-06` | **Shared device context changes:** Given Customer A session followed by B, when switching, then A history/cache/files are inaccessible to B | CX6-AC-012 | S1 |
| `DP06-AC-07` | **Purchased item vs catalog:** Given catalog now has changed price/photos, when prior order opens, then accepted order snapshot stays faithful | CX6-AC-016 | S1 |
| `DP06-AC-08` | **Payment redirect before confirmation:** Given payment provider redirect but no trusted settled confirmation, when order opens, then payment remains pending/uncertain | CX6-AC-013 | S1 |
| `DP06-AC-09` | **Label generated but no courier handoff:** Given shipping label only, when tracking opens, then order not represented as handed to carrier | CX6-AC-014 | S1 |
| `DP06-AC-10` | **Two parcels and out-of-order events:** Given split order and delayed provider update, when tracking renders, then parcels remain distinct and none falsely complete | CX6-AC-015/017 | S1 |
| `DP06-AC-11` | **Action expired during account overview:** Given queued quote is superseded, when card opened, then current version fetched and stale approval not offered | CX6-AC-020 | S2 |
| `DP06-AC-12` | **Requester not B2B approver:** Given member authorized to request but not approve, when direct approve action invoked, then denied without altering quote | CX6-AC-019 | S2 |
| `DP06-AC-13` | **Quote/proof differences:** Given artwork proof approved but financial terms pending, when account timeline loads, then production/payment not inferred complete | CX6-AC-021 | S2 |
| `DP06-AC-14` | **Foreign invoice URL:** Given foreign or revoked org actor, when invoice endpoint/file URL accessed, then no private bytes/metadata returned | CX6-AC-022/036/042 | S2 |
| `DP06-AC-15` | **Org switch and cached action:** Given actor switches organizations, when previously cached action clicked, then new resource/capability scope enforced | CX6-AC-036/041 | S2 |
| `DP06-AC-16` | **Double-submit support case:** Given retry after uncertain result, when request submitted again, then source creates at most one accepted case for same intent | CX6-AC-023/037 | S2 |
| `DP06-AC-17` | **Internal case note privacy:** Given internal support note exists, when customer opens case, then only customer-approved messages are rendered | CX6-AC-024 | S2 |
| `DP06-AC-18` | **Case ownership during escalation:** Given case moves between operator/vendor, when customer views it, then tracked owner and next real action persist | CX6-AC-025/039 | S2 |
| `DP06-AC-19` | **Return request not approval:** Given legitimate request accepted, when confirmation displayed, then still review-required, not refund complete | CX6-AC-027 | S2 |
| `DP06-AC-20` | **Custom return policy uncertainty:** Given personalized item and unresolved eligibility, when customer asks refund, then applicable terms/review shown without fabricated final ruling | CX6-AC-028 | S2 |
| `DP06-AC-21` | **Refund stages distinguished:** Given physical return received and finance not yet settled, when status displays, then inspection, approval, processing and settlement not conflated | CX6-AC-029 | S2 |
| `DP06-AC-22` | **Cancellation during physical production:** Given cancellation requested after production has begun, when submitted, then order not marked canceled until governed authorization | CX6-AC-030 | S2 |
| `DP06-AC-23` | **Reorder stale discount/rights:** Given old spec eligible but discount/stock/art-rights changed, when reorder occurs, then new terms review and no copied payment effect | CX6-AC-031 | S2 |
| `DP06-AC-24` | **Marketing versus service consent:** Given marketing opt-out, when source-verified service update occurs, then preferences respected according to separate legal bases | CX6-AC-033/034 | S2 |
| `DP06-AC-25` | **Account assistive use:** Given mobile keyboard, screen reader, 200 percent zoom or reduced motion, when service request completed, then core path remains usable | CX6-AC-035 | S2 |
| `DP06-AC-26` | **Optional AI outage and forbidden action:** Given AI unavailable or asked to refund/approve quote, when user needs support, then normal paths remain and no unauthorized effect occurs | CX6-AC-026/043 | S3 |
| `DP06-AC-27` | **Provider-owned claim:** Given marketplace-origin order requiring provider dispute channel, when customer opens support, then correct source/channel instructions shown | CX6-AC-038 | S2 |
| `DP06-AC-28` | **Founder workload evidence:** Given cohort of accepted real cases, when service outcomes evaluated, then measure completion, repeats, satisfaction, admin minutes and physical exceptions | CX6-AC-040/044 | S0 baseline/S3 telemetry |

### 15.1 Evidence classes required, not claimed

- **Browser/UX:** journey recording, mobile viewport and status/error accessibility.
- **Server authorization:** authenticated personal/guest/business contexts, direct file/API access, revoked users, cross-org and cross-account negative probes.
- **Financial/transaction:** actual canonical status/read result, no implied refund/paid state, concurrent version acceptance, safe replay and unknown-outcome recovery.
- **Provider/channel:** marketplace ownership, delayed/repeated messaging and carrier events, unsupported provider states.
- **Human operations:** real case owner, response path, founder burden measurement and physically evidenced service outcome.
- **Legal/commercial:** current return, cancellation, privacy, communication and document disclosure terms, interpreted by the appropriate owner.
- **Research:** usability task evidence from real representative participants, not founder/AI roleplay treated as market validation.

### 15.2 No unilateral pass language

A future builder's unit tests, lint checks and screenshot review are helpful but do not replace independent adversarial organization-isolation tests or actual support-journey research. If private file/object authorization is unverified, the corresponding customer portal capability remains gated even when the page renders correctly.

---

## 16. Research script and controlled fixtures

Research should start with scenarios rather than preference polling. Participants represent **customer jobs**, not fabricated personas. All fixtures use synthetic data, and actual user recordings require appropriate consent and private storage.

| Research task | Participant/job | Task prompt | Observe and record |
| --- | --- | --- | --- |
| `DP06-UX-01` | First-time guest | Find permitted order status without creating a full account | Understanding of verification, false assumptions, help-route clarity |
| `DP06-UX-02` | Retail returning buyer | Locate last order and distinguish paid from processing | Task completion, timeline interpretation, uncertainty comprehension |
| `DP06-UX-03` | Custom customer | Find and review artwork proof and explain consequence of approval | Exact version comprehension and proof-vs-production distinction |
| `DP06-UX-04` | B2B requester | Locate organization quote but discover action must be done by approver | Role clarity, frustration, false approval path |
| `DP06-UX-05` | B2B approver | Inspect version change and reject stale quote | Term review behavior and accessible error recovery |
| `DP06-UX-06` | Customer with QC problem | Create help request linked to actual item without repeating information | Re-entry count, context accuracy, case receipt meaning |
| `DP06-UX-07` | Customer returning personalized product | Understand eligibility uncertainty and submit appropriate evidence | Remedy expectation, policy comprehension, perceived fairness |
| `DP06-UX-08` | Customer with split shipment | Explain which parcel shipped, what remains uncertain and what to do next | Multi-parcel task success and wrong assumptions |
| `DP06-UX-09` | Customer using assistive technology | Complete service task using keyboard/screen reader/reduced motion | Focus order, announcement, error recovery and alternative channels |
| `DP06-UX-10` | Solo founder operator | Resolve three synthetic support cases with one payment, one return and one vendor issue | Administrative minutes, physical touches, lost context, reconciliation steps |

### 16.1 Research evidence record

For each attempt, record `{test_revision, user_segment, task, start_state, authorized_data_fixture, result, task_time, wrong_assumptions, help_request_count, errors, assistive_technology_if_used, observed_founder_transcription, moderator_intervention, evidence_location, consent_scope, limitation}`. This is a **research record concept**, not a schema/API instruction.

### 16.2 Stage-specific interpretation

- **Before S0 support claim:** test whether customer knows how to contact actual supported staff and what is/not currently offered.
- **Before scoped account release:** complete usability, accessibility and independent security checks for every account and file action, including unauthorized and revoked actors.
- **Before self-service remedies:** test actual policy comprehension and the difference between request, approval and completion.
- **Before advanced AI/digest:** demonstrate better customer outcomes and founder effort versus conventional, lower-cost experiences.

Do not manufacture a quantitative task-success threshold until baseline and sample definitions are approved; CX-08 and CX-09 own quality and validation gates.

---

## 17. Product decisions and conditional gates

Existing decision register `CX6-DEC-01..017` remains OPEN/PROPOSED as recorded in CX-06. Rather than recopying seventeen unapproved decisions as new policy, group work by accountable authority:

| Decision domain | Existing decision IDs | Proposed direction, not approval | Evidence needed |
| --- | --- | --- | --- |
| Public account, guest and claiming | `CX6-DEC-01..04` | S0 human-assisted; guest proof limited; no email-match account claim | Identity threat model, customer need, security tests |
| Status/case/response | `CX6-DEC-05..07` | Only authorized projected status; case owner and truthful availability | MGBOS source mapping, operator capacity, service policy |
| Returns/invoice/B2B | `CX6-DEC-08..11` | Specific policy and scoped document/action access | Legal/finance review and authorization proof |
| Notifications/channel | `CX6-DEC-12/13/15` | Separate marketing/service, minimize document access, preserve marketplace rights | Provider terms, consent policy, secure links |
| AI and measurement | `CX6-DEC-14/16` | Optional grounded AI; protect high-risk actions; measure real resolution | Tool evaluation, user research and cost/benefit |
| Data rights and privacy | `CX6-DEC-17` | No guessed privacy obligations; accountable review before sensitive collection | Legal/security assessment and retention policy |

Also reconcile `CX-DP-08` for customer identity/read models, `CX-DP-09` for B2B approvals, and `CX-DP-13..15` where AI/telemetry/role-workspace activation changes. **Owner approval of the general next-level vision does not close these choices.**

### 17.1 Decision escalation criteria

Ask Owner only for a material trade-off such as service channels/cost, launch feature priorities, account strategy, commercially consequential promises, and nontrivial budget. Head Engineering, legal/business semantic owners and security reviewers must resolve technical implementation and lawful policy constraints within their authority. Unknowns remain visibly `OPEN` rather than becoming a false default.

---

## 18. Risk and stop conditions

### 18.1 R2 risks (specific to UX refinement)

| Risk | Product failure | Safeguard | Owner |
| --- | --- | --- | --- |
| `DP06-RISK-01` | Public account launch leaks customer/B2B files | Resource and file-specific authorization; deny by default; independent security probes | Security / Head Engineering |
| `DP06-RISK-02` | Dashboard converts source outage into empty history | Loading, empty and unavailable separated; evidence freshness | CX-06 / CX-03 / QA |
| `DP06-RISK-03` | Suggested action invites stale quote/proof approval | On-action version and capability recheck | CX-05 / MGBOS |
| `DP06-RISK-04` | False paid/refund/delivery status | Source-backed projections and reconciled provider evidence | Finance / Fulfillment |
| `DP06-RISK-05` | User-friendly guest access becomes ID enumeration | Approved scoped verification, throttling and non-disclosure | Security |
| `DP06-RISK-06` | Support automation increases customer abandonment | Visible human fallback and true case owner | Customer Service / Product |
| `DP06-RISK-07` | Return wizard promises unsupported rights | Policy/source mapping and legal review | Legal / Business |
| `DP06-RISK-08` | Multi-organization switching retains private cache | Clear old context, server recheck, revocation tests | Security / Frontend |
| `DP06-RISK-09` | AI generates fabricated remedies or commitments | Tool permissions, factual grounding, off-switch and evaluation | JARVIS / Head Engineering |
| `DP06-RISK-10` | Automated portal hides founder's real physical work | Task quality, admin vs physical effort split and exceptions | Founder Control / Product |

These are **proposed product risk descriptions**, not a formal BisnisHub `R0..R5` assignment.

### 18.2 Mandatory stop conditions

1. Public resource reads are possible without proven object-, organization-, capability- and file-specific authorization.
2. Any customer-facing financial, quote, proof or refund action cannot survive retries and concurrency without false confirmation or duplicate effects.
3. Privacy/returns/notification copy contradicts current customer policies, marketplace rights or applicable legal review.
4. Current source data cannot safely and truthfully support the proposed milestone or document.
5. Founder support channel is not operating but the product would imply real-time service or reliable response promises.
6. A Customer Case, Return, Order, Authorization or Operational Exception domain is implicitly redesigned by a screen proposal.
7. A proposed release depends on AI, marketplace provider access or backend capabilities without verified readiness.
8. Another active PR, approved architecture direction or roadmap conflicts with the contemplated scope.

STOP means **record the specific contradiction and route it for owner/architecture review**, not silently invent the missing rule.

---

## 19. Integration plan and bounded change routing

### 19.1 Reconcile into existing semantic owners

| Existing target | Proposed integration | Must not introduce |
| --- | --- | --- |
| CX-06 §2–4 | Refine task-first account surface, guest/status/support journeys and error states | Duplicate master PRD or release promise |
| CX-06 §5–6 | Refine verification, identity/resource distinction, order details and freshness | Unapproved auth/tokens/data schema |
| CX-06 §7 | Refine quote/proof/card, organization switch and file access experience | New quote/proof authorization semantics |
| CX-06 §8–9 | Refine case, return, cancellation and human escalation outcomes | New refund or Customer Case canonical authority |
| CX-06 §10–12 | Refine notification, AI, accessibility and performance behavior | Provider/agent privileges or fixed unverified budgets |
| CX-06 §13–15 | Map `DP06-RQ-01..20` and `DP06-AC-01..28` to existing IDs | Renumber existing `CX6-FR`, `BR`, `AC` |
| CX-06 §16–22 | Update research, risks, decisions and readiness with evidence | Claims of actual user testing or production launch |
| CX-03 | Reference universal component/state rules | Independent competing design tokens |
| CX-04/05 | Align order detail/quote/artwork customer handoffs | Override checkout, quote or proof rules |
| CX-07 | Align marketplace, messaging and source-provenance expectations | Provider behavior not actually supported |
| CX-08/09 | Refine evidence gates, tests, staging and metrics | Claim qualitative proposal equals independent PASS |
| CX-PKG-TRACE-R1.csv | Update through a separately approved traceability PR when required | Break 46 existing CX-01 parent rows |

### 19.2 GitHub change discipline

**This DP-06 deliverable:** Create a new standalone, explicit non-canonical Markdown file at the proposed destination in this document's frontmatter.

**Do not edit now:** Existing CX-06/01/02/03/04/05/07/08/09, MGBOS architecture, TeeStock business/legal documents, production code, package README, trace CSV, source map or active PR #73 scope. No new library, schema, API, payment command, customer role or token design is authorized.

**Later integration:** After Owner product review, fresh exact SHA resolution and architecture/security reconciliation, a bounded documentation PR may integrate accepted deltas, validate paths/traceability, and obtain independent Product/UX review. Head Engineering separately controls implementation IC/WP and merge/deployment gates. No direct builder prompt is implied by this document.

### 19.3 Documentation sequence

Following this deliverable, the planned document is **DP-07 — Omnichannel & External Integrations Experience Deepening**, to refine CX-07 after exact-source audit. It must not silently assume any provider subscription, authorization, API entitlement, settlement, callback contract or functioning marketplace adapter.

---

## 20. Reproducibility and references

### 20.1 Exact-version internal source set

All internal links below are pinned to the inspected `main` revision to preserve audit context. File existence at a git revision is **not** production evidence.

- [CX-06 Account & Service](https://github.com/Rizkybuilds/bisnishub/blob/57eaafbb0ceef99a5fc6b2d77d724f6ff510727d/systems/mgbos/docs/product/teestock-customer-platform/cx-06-customer-account-service-experience.md)
- [CX-01 Master PRD](https://github.com/Rizkybuilds/bisnishub/blob/57eaafbb0ceef99a5fc6b2d77d724f6ff510727d/systems/mgbos/docs/product/teestock-customer-platform/cx-01-master-prd.md)
- [CX-02 Journeys](https://github.com/Rizkybuilds/bisnishub/blob/57eaafbb0ceef99a5fc6b2d77d724f6ff510727d/systems/mgbos/docs/product/teestock-customer-platform/cx-02-customer-journeys-service-blueprint.md)
- [CX-03 Experience Design](https://github.com/Rizkybuilds/bisnishub/blob/57eaafbb0ceef99a5fc6b2d77d724f6ff510727d/systems/mgbos/docs/product/teestock-customer-platform/cx-03-experience-design-interaction-spec.md)
- [CX-04 Checkout](https://github.com/Rizkybuilds/bisnishub/blob/57eaafbb0ceef99a5fc6b2d77d724f6ff510727d/systems/mgbos/docs/product/teestock-customer-platform/cx-04-commerce-checkout-experience.md)
- [CX-05 Custom/B2B](https://github.com/Rizkybuilds/bisnishub/blob/57eaafbb0ceef99a5fc6b2d77d724f6ff510727d/systems/mgbos/docs/product/teestock-customer-platform/cx-05-custom-b2b-ordering-experience.md)
- [CX-07 Omnichannel](https://github.com/Rizkybuilds/bisnishub/blob/57eaafbb0ceef99a5fc6b2d77d724f6ff510727d/systems/mgbos/docs/product/teestock-customer-platform/cx-07-omnichannel-external-integration-requirements.md)
- [CX-08 Quality](https://github.com/Rizkybuilds/bisnishub/blob/57eaafbb0ceef99a5fc6b2d77d724f6ff510727d/systems/mgbos/docs/product/teestock-customer-platform/cx-08-experience-quality-acceptance-contract.md)
- [CX-09 Delivery](https://github.com/Rizkybuilds/bisnishub/blob/57eaafbb0ceef99a5fc6b2d77d724f6ff510727d/systems/mgbos/docs/product/teestock-customer-platform/cx-09-phased-delivery-product-validation-plan.md)
- [CX Package Decisions](https://github.com/Rizkybuilds/bisnishub/blob/57eaafbb0ceef99a5fc6b2d77d724f6ff510727d/systems/mgbos/docs/product/teestock-customer-platform/CX-PKG-DECISIONS-R1.md)
- [CX Traceability](https://github.com/Rizkybuilds/bisnishub/blob/57eaafbb0ceef99a5fc6b2d77d724f6ff510727d/systems/mgbos/docs/product/teestock-customer-platform/CX-PKG-TRACE-R1.csv)
- [Customer Service](https://github.com/Rizkybuilds/bisnishub/blob/57eaafbb0ceef99a5fc6b2d77d724f6ff510727d/bisnis/teestock/07-operations/customer-service.md)
- [Returns & Warranty](https://github.com/Rizkybuilds/bisnishub/blob/57eaafbb0ceef99a5fc6b2d77d724f6ff510727d/bisnis/teestock/07-operations/returns-and-warranty.md)
- [Customer Commerce Policy](https://github.com/Rizkybuilds/bisnishub/blob/57eaafbb0ceef99a5fc6b2d77d724f6ff510727d/bisnis/teestock/12-legal-ip/customer-commerce-policy.md)
- [MGBOS Authorization](https://github.com/Rizkybuilds/bisnishub/blob/57eaafbb0ceef99a5fc6b2d77d724f6ff510727d/systems/mgbos/docs/architecture/permission-authorization-model.md)
- [Digital Product Vision](https://github.com/Rizkybuilds/bisnishub/blob/57eaafbb0ceef99a5fc6b2d77d724f6ff510727d/bisnis/teestock/10-product-tech/digital-product-vision.md)
- [Solo Founder Roadmap](https://github.com/Rizkybuilds/bisnishub/blob/57eaafbb0ceef99a5fc6b2d77d724f6ff510727d/docs/roadmaps/solo-founder-launch-roadmap.md)
- [Documentation Constitution](https://github.com/Rizkybuilds/bisnishub/blob/57eaafbb0ceef99a5fc6b2d77d724f6ff510727d/docs/governance/documentation-constitution.md)

### 20.2 External methodological references (not runtime evidence)

- [OWASP API Security Top 10 (2023)](https://api-security.owasp.org/editions/2023/en/0x11-t10/) — object- and property-level access risk; security implementation and review remain with Head Engineering.
- [OWASP API1:2023 — Broken Object Level Authorization](https://api-security.owasp.org/editions/2023/en/0xa1-broken-object-level-authorization/) — checking access for every object identified by user input, not mere possession of an ID.
- [W3C — WCAG 2.2](https://www.w3.org/TR/WCAG22/) — accessible customer flows, status messages, errors and keyboard operation.
- [W3C — WCAG 2.2 SC 4.1.3 Status Messages](https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html) — announcement of dynamically updated statuses.
- [Nielsen Norman Group — Ecommerce UX: Customer Service](https://www.nngroup.com/reports/ecommerce-ux-customer-service/) — relevant self-help information and genuine human-assistance paths; source is product research, not TeeStock user evidence.

External UX/security sources provide professional design direction. They do not authorize technical changes, displace canonical business policy, or prove any customer outcome.

---

## 21. Author QA and final release disposition

### 21.1 Self-review performed

- [x] Current repository SHA and CX-06 file blob verified against the connected GitHub source.
- [x] Existing eight journey names and functional/BR/AC ID ranges inspected.
- [x] No existing CX-06 ID is renumbered; all 48 FR grouped into explicit preservation crosswalk.
- [x] Twenty DP06-RQ candidates and twenty-eight DP06-AC proposals use separate namespace from existing CX-06 IDs.
- [x] Account/guest/business document access distinguished from login and link possession.
- [x] Order, payment, production, shipping, case, return and refund stages distinguished from presentation-only states.
- [x] Customer Case remains distinct from Operational Exception; no new domain model or role granted.
- [x] S0 assisted support remains separate from later secure self-service and AI.
- [x] Source-bound status and legally reviewed policy required for commitments, refunds and communications.
- [x] Reorder and historical account context require fresh commercial/rights authorization.
- [x] User research and production metrics distinguished from hypothetical fixtures and proposed targets.
- [x] No repository write, running business transaction, provider connection, security test or deployment was performed.

### 21.2 Not performed — never report as PASS

- [ ] Independent Product/UX/Legal/Security review.
- [ ] Actual customer research and moderated usability studies.
- [ ] Public customer account or guest lookup E2E execution.
- [ ] Actual backend authorization, cross-organization, file access and token negative tests.
- [ ] Returns/payment/refund/notification provider verification.
- [ ] Performance and accessibility conformance assessment on a real implementation.
- [ ] Owner adoption and canonical integration into CX-06.

### 21.3 Candidate status and next action

`AUTHOR_COPY_READINESS`: `COPY_READY` based on source review and artifact structure.

`INDEPENDENT_PRODUCT_QA`: `NOT_PERFORMED`.

`OWNER_PRODUCT_APPROVAL`: `PENDING` for material changes.

`CX06_CANONICAL_INTEGRATION`: `NOT_PERFORMED`.

`LIVE_CUSTOMER_ACCOUNT_AND_SUPPORT_READINESS`: `NOT_VERIFIED`.

`IMPLEMENTATION_AUTHORIZATION`: `NONE`.

**Next document:** `DP-07 — Omnichannel & External Integration Experience Deepening`.

**End of document.**

