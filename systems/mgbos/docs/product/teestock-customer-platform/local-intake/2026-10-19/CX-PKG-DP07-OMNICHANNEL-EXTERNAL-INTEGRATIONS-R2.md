---
canonical_id: proposed.mgbos.product.teestock-customer-platform.dp07-omnichannel-external-integrations-r2
status: DRAFT
version: 0.2.0
owner: Rizky
author: ChatGPT / AI Co-Founder & Product Strategy
approver: PENDING_OWNER_AND_INDEPENDENT_PRODUCT_SECURITY_REVIEW
document_class: product-experience-research-and-change-proposal
scope: teestock-customer-platform-cx07-omnichannel-external-integration-deepening
normative_authority: NONE
repository: Rizkybuilds/bisnishub
source_ref: main
source_baseline_commit: 57eaafbb0ceef99a5fc6b2d77d724f6ff510727d
source_cx07_blob_sha: b3727ee1d590ba83a8a58c58e5450701c39f627d
source_cx09_blob_sha: d0985bf8873c6c0e4086147cd989b783a5b30274
source_business_channel_blob_sha: 1a857286ef8a716e40f0ee95d397da100759abff
source_business_integration_blob_sha: df22093c9174703419d3e8a0e67869f8c0412a53
source_cx_decisions_blob_sha: e7d0235d78e068d274865a53e30b2084df99b5ae
proposed_destination: systems/mgbos/docs/product/teestock-customer-platform/CX-PKG-DP07-OMNICHANNEL-EXTERNAL-INTEGRATIONS-R2.md
baseline_checked: 2026-10-17
research_mode: REPOSITORY_GROUNDED_PRODUCT_REVIEW_AND_PUBLIC_PROVIDER_REFERENCE_REVIEW
self_review: PERFORMED
independent_review: NOT_PERFORMED
provider_account_entitlement: NOT_VERIFIED
provider_sandbox_execution: NOT_PERFORMED
actual_customer_research: NOT_PERFORMED
integration_runtime_assurance: NOT_PERFORMED
engineering_readiness: NOT_ASSESSED
implementation_authorization: NONE
merge_authorization: NONE
deployment_authorization: NONE
supersedes: null
depends_on:
  - docs/governance/documentation-constitution.md
  - docs/governance/canonical-source-map.md
  - docs/roadmaps/solo-founder-launch-roadmap.md
  - bisnis/teestock/09-marketing/channel-strategy.md
  - bisnis/teestock/11-data-mgbos/mgbos-integration.md
  - bisnis/teestock/11-data-mgbos/event-model.md
  - bisnis/teestock/10-product-tech/commerce-platform.md
  - bisnis/teestock/10-product-tech/automation-architecture.md
  - bisnis/teestock/12-legal-ip/customer-commerce-policy.md
  - systems/mgbos/docs/architecture/permission-authorization-model.md
  - systems/mgbos/docs/architecture/business-invariants.md
  - systems/mgbos/docs/architecture/command-event-model.md
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

# DP-07 — TeeStock Omnichannel & External Integrations Deepening R2

**Disposition:** `COPY_READY / AUTHOR_SELF_REVIEWED / DRAFT / NON-CANONICAL`.

**Purpose:** A complete, bounded product-experience delta for [CX-07 — Omnichannel & External Integration Requirements v0.1.1](cx-07-omnichannel-external-integration-requirements.md). This file is **not** a replacement CX-07, a second canonical integration architecture, a provider API contract, a pricing policy, an implementation/Antigravity brief, or evidence that any live provider account is connected. Preserve all pre-existing CX7 requirements and acceptance cases until a governed reconciliation explicitly updates them.

**North star:** **Many customer entrypoints. One governed business truth. Minimal founder reconstruction. Trustworthy recovery.**

**Critical distinction:** Connected UX is a design goal; provider account authorization, exact feature eligibility, production adapter implementation, trustworthy data reconciliation, and actual runtime readiness are separate facts, all `NOT_VERIFIED` in this product-drafting exercise.

---

## 0. Executive Product Contract

### 0.1 Product thesis

A customer may discover TeeStock on social, ask about uniforms in a message, submit a Custom inquiry on the website, pay on an external platform, and check fulfillment via a carrier. Each touchpoint should clarify who holds the transaction, which information has actually been received, what the customer may legitimately do next, and who owns any exception. **TeeStock must not require the customer—or founder—to reconstruct the purchase from fragmented messages.**

### 0.2 Success criteria: customer and founder together

1. **Customer continuity:** A permitted change of channel does not force unnecessary re-entry of previously authorized requirements.
2. **Source clarity:** Customers understand whether they are transacting with TeeStock directly, through a marketplace, or through an assisted channel.
3. **Truthful state:** Inquiry, external order, internal order, payment, settlement, physical dispatch, and refund are distinguished.
4. **Recovery:** Failure, delay, duplicate message and conflicting source update produce a safe next action, not misleading success or repeat charge.
5. **Founder leverage:** Only material exceptions demand founder judgment; ordinary confirmations and structured intake do not become repetitive retyping.
6. **Economic control:** Integration cost, provider restrictions, support burden, and maintenance are evaluated before expanding automation.

### 0.3 Release slices are proposals, not permissions

| Product slice | Intended experience | Must not be inferred |
| --- | --- | --- |
| `CX-S0` | High-quality website/social entry; assisted Custom/Business contact; source attribution where permitted; manual external-reference discipline | Live WhatsApp API, marketplace API, checkout, automatic bidirectional sync or guaranteed contact SLA |
| `CX-S1` | Approved direct retail checkout and payment when transaction/finance gates pass; truthful order confirmation | Universal marketplace adapters or customer rights not supported by providers |
| `CX-S2` | One selected, economically justified inbound marketplace adapter; selective carrier/messaging and secure customer account handoff, each independently gated | All integrations launch together or are equivalent in authorization risk |
| `CX-S3` | Selective outbound catalog, price and available-to-sell reconciliation; more advanced orchestration only when safe and valuable | Unrestricted real-time sync, AI-led money changes or unlimited provider access |

**Crosswalk caution:** CX-07 parent priorities `P0/P1/P2` and CX-09 proposed `CX-S0..S3` do not map one-to-one. In particular, an existing `CX7-FR-*` item labelled P1 does not automatically become a CX-S1 implementation requirement. Existing `CX-PKG-STAGE-CROSSWALK-R1.md`, business launch roadmap and owner approvals govern final sequencing. No dates or engineering authority are asserted.

### 0.4 Scope and ownership

This DP-07 proposes **customer-facing behavior**, cross-channel journey continuity, support/operations visibility, prerequisite evidence, interaction recovery, and acceptance tests. It does **not** own the canonical definition of money, discounts, customer identity, organization access, customer case, inventory, payment allocation, production, shipment, refund, provider authentication, webhook signature, database tables or command/event naming.

- TeeStock `TS-MKT-004` and commerce strategy own channel roles and economics.
- TeeStock customer commerce/legal policy owns commercial terms, communication permissions and return/consumer commitments subject to applicable law.
- MGBOS owns source-of-truth financial/order/inventory/identity/domain effects.
- CX-03 owns UI interaction grammar; CX-04 checkout; CX-05 Custom/B2B; CX-06 accounts/support; CX-08 tested quality; CX-09 sequence.
- JARVIS/n8n may assist under approved tool/authorization boundaries; they are never independent business-state authorities.
- Head Engineering controls architecture impact and bounded work packages, risk classification, independent QA and implementation readiness. Owner alone approves material business choices and release decisions.

### 0.5 Evidence integrity

Inspected repository `main`: `57eaafbb0ceef99a5fc6b2d77d724f6ff510727d` on 2026-10-17. Existing CX-07 is DRAFT v0.1.1, with 48 functional requirements, 28 business/experience rules, 14 NFRs, 44 proposed acceptance scenarios, 18 proposed decisions and 16 risks. The proposed DP-01..DP-06 files from earlier chat have **not been verified on main** at this baseline; do not treat their prior copy-ready status as merged/canonical. Open PR #73 governs unrelated documentation-entrypoint routing and must not be overwritten by this task. No current payment/marketplace/messaging entitlement, sandbox test, webhook implementation or production connection was verified here.

---

## 1. Customer Channel Roles and Identity of Transactions

### 1.1 Channel role model

| Entry/channel | Customer job | Source of channel-specific obligation | TeeStock experience ownership | Minimal continuity evidence |
| --- | --- | --- | --- | --- |
| TeeStock website | Learn, compare, request, eventually buy | TeeStock authorized offer/transaction source | Public UI, permitted form/checkout, safe help | Entry context, actual request/order reference |
| Social organic/advertising | Discover products and start a journey | Platform rules govern social surface; TeeStock owns approved landing content | Truthful link destination and source attribution where permitted | Campaign/referral context; no unauthorized identity joins |
| Human WhatsApp/chat | Ask questions, share Custom requirements, follow up | Approved customer service policy and actual channel context | Structured assisted summary, permitted receipt, handoff | Verified contact/context; messages not canonical orders |
| Marketplace seller channel | Browse/buy using marketplace terms | Platform-specific seller/order/return/payment terms | Accurate externally owned status, permitted internal fulfillment and help | Provider + seller account + external order reference |
| Payment provider | Perform configured payment action | Provider payment attempt, verified financial authority | Pending/confirmed/failed/unknown presentation and retrieval | Provider attempt/ref + governed payment intent |
| Carrier/logistics | Physical movement and scans | Fulfillment evidence and carrier state (qualified) | Shipment status, tracking, realistic caveat | Shipment identity + carrier ref + accepted handoff facts |
| Email/transactional message | Inform customer or request action | Approved communication purpose, provider send evidence | Message content, destination, unsubscribe/consent where relevant | Event reason, source reference, recipient permission |
| Customer account/support | Retrieve authorized facts, request service | MGBOS/customer-care source, resource authorization | Accessible next action and case progress | Principal, scoped account/order/case reference |

**Channel ownership is not a single boolean.** An external marketplace may own checkout/payment/disputes while TeeStock is accountable for eligible packing, carrier handoff or seller communication. Each action needs an explicit *who may act* and *who must resolve* owner. Do not claim the website can cancel or refund an externally governed transaction unless verified and authorized.

### 1.2 Customer-facing channel copy classification

- `DIRECT_TEE`: TeeStock controls the eligible offer and approved transaction path.
- `PROVIDER_OWNED`: Customer completes specified steps on a named third-party platform; exact rights remain subject to its applicable rules.
- `ASSISTED`: Genuine human review/interaction needed; no automatic acceptance implied.
- `NOT_ACTIVE`: Feature/channel not actually enabled; no functional-looking CTA to a dead action.
- `UNKNOWN`: External state cannot currently be confirmed; retain last verified fact, disclose uncertainty, offer safe next step.

These labels describe **UX meaning only**, not new canonical database enums. Customer wording should be natural Indonesian, with the channel name and source explicitly visible when needed.

### 1.3 Identity and provenance boundaries

A phone number, email, full name, social handle, marketplace buyer ID and customer account are **not automatically interchangeable identities**. Matching two fields is not proof of personhood, ownership, or organization membership.

Every cross-channel linkage proposal shall identify: provider/platform, seller account, external reference, approved TeeStock context, relevant verification, permission scope, evidence timestamp, and a revocation/correction path. A customer may intentionally use distinct channels without authorizing all identities to be merged. Never place PII/secrets into marketing URLs, analytics events or public client logs.

---

## 2. Experience Journey Portfolio and Service Handoffs

### 2.1 Existing journey preservation

Retain existing `CX7-JRN-01..10` in CX-07 and `CX2-BP-01..08` in CX-02. DP-07 enriches them with cross-channel screens and recovery; it **does not rename or silently replace** either inventory.

| Existing journey | Cross-channel job | DP-07 deepening |
| --- | --- | --- |
| `CX7-JRN-01` | Social → Custom | Campaign/deep-link intent, no premature identity/lead creation |
| `CX7-JRN-02` | WhatsApp → quote | Real assisted receipt, structured requirement and customer consent |
| `CX7-JRN-03` | Marketplace → fulfillment | Order ownership, correlation, duplicate and changed-order handling |
| `CX7-JRN-04` | TeeStock → payment provider | Unknown result, safe return, no browser-success assumption |
| `CX7-JRN-05` | Dispatch → carrier | Physical handoff versus label/scan truth |
| `CX7-JRN-06` | Customer notification | Source-triggered, permission-aware, send/delivery distinctions |
| `CX7-JRN-07` | Cross-channel support | One accountable case/next action without unsafe identity merge |
| `CX7-JRN-08` | Cancel/return/settlement | Provider-vs-seller rights, separate refund effects |
| `CX7-JRN-09` | Provider outage | Human recovery, error isolation, no retry storm |
| `CX7-JRN-10` | Catalog/stock/price publication | Desired vs observed state, explicit drift, echo suppression |

### 2.2 UX checkpoints shared by all handoffs

At **any** transition between surfaces, answer:

1. Where is the customer now, and who controls this channel?
2. What action has actually succeeded? What is merely attempted or pending?
3. What source reference can the customer and an authorized operator safely use?
4. What information carries forward lawfully? What requires re-verification?
5. Is there a supported next action? What happens if the provider is unavailable?
6. Can the founder trace the source, evidence, pending exception and accountable owner without retyping?

A handoff that simply opens a new tab without clarifying transaction ownership is incomplete experience design.

### 2.3 Journey S1 — Social campaign to assisted Custom

**Entry:** Customer taps a product/custom promotion. **Primary screen:** TeeStock Custom landing with brief offer facts, availability disclaimers, and a real inquiry/assisted contact action.

| Step | Customer-visible behavior | Backstage/founder | Exception and recovery |
| --- | --- | --- | --- |
| S1.1 | Landing preserves relevant product/project intent, not raw sensitive tracking parameters | Approved source/campaign may be retained with purpose controls | Unsupported link opens safe category/help route |
| S1.2 | Guided Custom asks only necessary garment, quantity, artwork readiness and requested date | Approved contact/intake owner captures context | Unknown product/method becomes review-needed |
| S1.3 | Customer reviews details and submits through an actually functioning endpoint/channel | Durable accepted request, if any, creates one authorized actionable record | Provider/CRM unavailable: no fake receipt, use real alternate contact |
| S1.4 | Receipt states whether an inquiry was really accepted and what happens next | Founder sees structured request/source, not a copied ad conversation | Duplicate tap handled without two business obligations |

**Moment of truth:** Customer understands that starting an inquiry is not buying a product; founder receives the same context without a shadow spreadsheet.

### 2.4 Journey S2 — Human WhatsApp discussion to quotation

**Entry:** Customer asks for 100 shirts and sends artwork over approved human channel. **P0 reality:** Treat WhatsApp as assisted communication, **not as proof that a WhatsApp Business API is integrated**.

1. Human asks for minimum missing requirements; reuse facts already provided with permission.
2. If a governed intake/quotation workflow exists, authorized operator records referenced request and source, avoiding a second conflicting customer identity.
3. Customer receives an approved receipt/reference through a supported channel only after real source acceptance.
4. Vendor availability, price and lead time are reviewed. No AI or chat message makes an unapproved binding quote.
5. A reviewed quote identifies exact version and validity. Changed artwork/quantity produces a versioned reassessment.
6. Customer approval is accepted only via approved authorization and evidence method; production release remains separately governed.
7. If API, chatbot or message automation is missing, the human route stays honest and functional.

**Abnormal cases:** Customer forwards a third party's quote screenshot; edits a quote in chat; sends the same request to two accounts; changes phone; asks an AI for immediate discount. None of these imply entitlement or a confirmed order. Escalate ambiguous correlation to bounded human reconciliation.

### 2.5 Journey S3 — Marketplace purchase to TeeStock fulfillment

**Prerequisite:** Named provider, approved seller account, actual permission/scope, verified mapping, legitimate order/financial context and independently tested import safeguards. This is **future proposed CX-S2**, not a current P0 implementation claim.

| Step | Customer sees | Internal requirements | Negative condition |
| --- | --- | --- | --- |
| S3.1 Buy externally | Platform checkout/confirmation as provider controls | Preserve seller/account/external reference; no fabricated TeeStock checkout | No marketplace transaction re-created merely from a message screenshot |
| S3.2 Import eligibility | No cross-platform status promise yet | Authenticate origin, link scoped external identity, evaluate product/variant/terms | Unknown SKU/brand/org or wrong seller account → hold/quarantine |
| S3.3 Accept business effect | Customer status only once legitimate under approved channel policy | One canonical intended effect and controlled replay evidence | Concurrent repeated event → not two production orders |
| S3.4 Fulfill physically | Provider and TeeStock communication follow actual rights | Founder/vendor physical picks, packs, QC, carrier handoff where appropriate | Event received ≠ product available or shipped |
| S3.5 Changed/cancelled | Customer receives correct platform-owned next steps | Preserve accepted history; reconcile change/cancellation after commitments | Late cancellation does not erase shipped/payment truth |
| S3.6 Support | Clear responsible contact route for type of issue | Customer Case correlated only when verified and permitted | Wrong platform return/refund authority never claimed |

**Moment of truth:** A marketplace order drives only the legitimate internal work once, and a support agent can find its source and constraints.

### 2.6 Journey S4 — Website checkout to payment gateway and back

**Prerequisites:** Approved CX-S1 retail scope, actual payment provider, approved financial semantics, independent testing and appropriate security assurance.

1. Customer sees reviewed items, source-grounded full payable amount and material terms.
2. One authorized payment/order intent is initiated; UI shows processing, not paid.
3. Customer may leave for provider payment action; destination ownership and expected return are clear.
4. Returning browser signal is **not proof** of paid state. Canonical verification/reconciliation yields `pending`, `confirmed`, `failed`, or `unknown` experience as justified.
5. If provider may have charged but callback is missing, customer sees 'Sedang memeriksa pembayaran' with a safe check/help path. Never advertise a second payment attempt blindly.
6. A trusted verified payment produces governed financial effect once; order, payment and fulfillment milestones remain separate.
7. Founder handles unresolved high-impact discrepancy through approved workflow; routine pending callbacks should not spam human attention.

### 2.7 Journey S5 — Dispatch to courier and customer notification

**Entry:** Shipment prepared after real authorized fulfillment prerequisites.

- `LABEL_CREATED`: Customer may see 'Pengiriman sedang disiapkan' if evidence supports; not 'Dikirim'.
- `PHYSICAL_HANDOFF_CONFIRMED`: A valid custody/acceptance record supports dispatch wording.
- `SCAN_UPDATE_RECEIVED`: Carrier scans may be delayed/out of order; retain source time and do not regress to fictitious progress.
- `DELIVERY_EXCEPTION`: Distinguish late scan, returned parcel, failed delivery and recipient action only from reliable evidence.
- `DELIVERED_VERIFIED`: Do not infer delivery from expected date alone.

Notify only via provider/channel with legitimate recipient and purpose. Delivery of a notification to the provider ≠ delivery to customer ≠ read by customer. A missing message never changes physical shipment truth.

### 2.8 Journey S6 — Support moves from marketplace/WhatsApp/site to one accountable owner

Customer describes a wrong item in marketplace chat, contacts TeeStock's WhatsApp, then opens a web help page. A support operator must:

1. Verify which transaction and policy owner controls the dispute, not just match a phone number.
2. Retrieve authorized existing request/order/case context and preserve exact channel source.
3. Distinguish a continued existing case from a genuinely distinct problem; do not merge automatically by fuzzy similarity.
4. Provide the customer a safe next step and truthful timeline; avoid routing endlessly between platform, vendor and TeeStock.
5. Preserve internal notes privately; share only approved customer-facing communication.
6. Keep one accountable case/service owner; Operational Exception remains a separate internal concept.
7. Handle return request, authorization, inspection, refund approval and disbursement as distinct steps.

### 2.9 Journey S7 — Provider outage or revoked authorization

**Trigger:** Marketplace token revoked, messaging quota exhausted, payment API timeout, or carrier tracking inaccessible.

- Customer sees only the affected feature degraded; generic Shop/Custom browsing remains usable.
- Current confirmed facts remain visible with freshness qualifiers; unavailable retrieval ≠ empty order list.
- No aggressive blind retries for financial or identity-affecting operations.
- Bounded technical retry for known transient safe operations; unresolved effect held with correlation/evidence and owner.
- Operator sees one meaningful problem with source, age, business impact, attempts, and authorized recovery options.
- If the external account connection was revoked, disable affected capability; never claim silently recovered integration.

### 2.10 Journey S8 — Future catalog, price and ATS reconciliation

This is candidate `CX-S3` only. Before publication, product, variant, media, price, channel fee, policy and available-to-sell require explicit eligibility and current approvals. Outbound writes have scoped source, desired version, channel-specific state, confirmation evidence and re-read or reconciliation where possible. Failed update is not 'published.' Reflected inbound change must not cause endless echo. Missing provider capability remains `NOT_VERIFIED` and blocks activation.

---

## 3. Cross-Channel Screen and State Design Contract

### 3.1 Screen inventory (`DP07-SC-01..12`)

| Screen | Proposed anatomy | Essential state / recovery | Eligible slice |
| --- | --- | --- | --- |
| `DP07-SC-01` Channel-origin landing | Brand promise; context-specific hero; intended offer; meaningful CTA | Inactive offer clearly marked, safe alternate route | S0 |
| `DP07-SC-02` Assisted inquiry continuation | Verified known context; minimal remaining questions; privacy notice | Missing identity not autofilled by name/phone guess | S0 |
| `DP07-SC-03` Real inquiry receipt | Authorized reference; submitted details; next step and contact | Unknown submit must not fabricate reference | S0 |
| `DP07-SC-04` External-channel explanation | Provider name; owner of checkout, payment, disputes, support | External link failure; plain-language return route | S0+ |
| `DP07-SC-05` Imported order customer view | Source platform; permitted order status; genuine next step | Import not yet verified → no fictional universal order portal | S2 gated |
| `DP07-SC-06` Payment handoff and return | Reviewed amount; payment provider; pending/unknown/confirmed facts | Unknown charge reconciled before safe retry | S1 gated |
| `DP07-SC-07` Shipment timeline | Label, handoff, scans, exception with proof/source time | Provider down → last confirmed milestone and help | S1/S2 gated |
| `DP07-SC-08` Customer notification details | Message purpose; transaction reference; link to authorized action | Send accepted ≠ customer notified/read | S2 gated |
| `DP07-SC-09` Cross-channel help | Current verified issue; source/account context; responsible next owner | Identity uncertain → scoped verification/manual process | S0 assisted/S2 portal |
| `DP07-SC-10` Founder integration exceptions | Provider; object/ref; severity; age; impact; permitted next action | Retry disabled if outcome unknown/high impact | S2 gated |
| `DP07-SC-11` Connection and scope health | Provider connection and last verified capability; environment | Connected badge cannot assert every operation works | S2 gated |
| `DP07-SC-12` Desired vs observed publication | Published/queued/rejected/stale per eligible listing | Failed provider update stays mismatch, not success | S3 gated |

These are **experience screen archetypes**, not new route commitments, schemas, live dashboards or direct builder instructions. Specialized presentation rules remain in CX-03/04/05/06.

### 3.2 State grammar

| Presentation class | Meaning | Customer-facing sample (illustrative only) | Forbidden implication |
| --- | --- | --- | --- |
| `NOT_CONNECTED` | Feature is not enabled for this account/provider | 'Layanan ini belum tersedia' | Another account/provider is already functional |
| `ACTION_REQUIRED` | Legitimate user/provider/operator action needed | 'Lengkapi informasi yang diminta' | A role without permission may complete it |
| `SUBMITTED_UNCONFIRMED` | Submit attempted but durable outcome unknown | 'Kami belum bisa memastikan permintaan diterima' | Receipt/order identity exists |
| `VERIFIED_RECEIVED` | Authoritative source accepted a bounded request/event | 'Permintaan berhasil diterima' | Order/quote/payment approved |
| `PROCESSING` | An eligible external/internal action in progress | 'Sedang memeriksa hasilnya' | A timed progress bar guarantees completion |
| `PARTIAL` | Some, but not all, related effects proved | 'Sebagian pengiriman telah diproses' | Full order delivered/settled |
| `CONFLICT` | Trusted sources disagree or data changed materially | 'Status sedang ditinjau karena ada perbedaan data' | Last result can safely overwrite newer fact |
| `STALE` | Last confirmed data is older than relevant freshness budget | 'Pembaruan terakhir tersedia pada …' | Current state remains guaranteed |
| `UNAVAILABLE_DATA` | Cannot retrieve or verify now | 'Status belum dapat diperiksa' | No order/payment exists |
| `AUTH_REQUIRED` | Proof or role authorization needed | 'Verifikasi akses untuk melanjutkan' | Reference alone establishes identity |
| `RECOVERY_REQUIRED` | System cannot safely auto-complete | 'Kami akan memeriksa transaksi ini terlebih dahulu' | Blind retry is always harmless |

**State vocabulary is not a request to add enum columns to MGBOS.** CX-03 existing `CX3-STATE-01..12` and domain state projections take precedence. Show a timestamp and origin only when trustworthy and permission-safe. Error copy must not leak foreign order or customer existence.

### 3.3 Accessibility and progressive loading

- Provider widget or SDK is *never* required to load homepage, Custom inquiry or normal product browsing.
- External iframe/payment flows must have accessible labels, keyboard handoff and functional recovery from browser back/reload.
- Do not use color alone to show failed/pending/success, nor spinner alone to explain unknown outcomes.
- On mobile, the next legitimate action remains identifiable when fonts/images/scripts are slow or blocked.
- WCAG 2.2 AA remains a proposed target under CX-03/CX-08; not certified by this document.
- Proposed Core Web Vitals targets retained from CX-08: LCP ≤2.5 s, INP ≤200 ms and CLS ≤0.1 at field p75 when sample validity permits. No claim that TeeStock currently passes; lab measurements have distinct provenance.

---

## 4. Provider Capability and Evidence Registry

### 4.1 The registry is the gate, not a marketing integration checklist

Do not mark 'TikTok Shop', 'Shopee', 'WhatsApp', 'payment' or 'courier' as 'integrated' because public API documentation exists. Record **exact seller account, app identity, region, authorized scope, feature, environment, rate/fee policies, API version, signed webhook and test evidence**. Cross-region documentation does not prove availability to an Indonesian seller account.

### 4.2 Minimum capability record (`DP07-PROV-01` conceptual)

| Attribute | Required evidence question |
| --- | --- |
| Provider and service type | Which provider, specific product and integration service? |
| Region/country/shop ownership | Which Indonesian/other market and exact seller/merchant account is eligible? |
| App/permission model | What app approval, seller authorization, OAuth/scopes or manual procedure is required? |
| Capability and operation | Read order? Update stock? Send message? Create shipping label? Issue refund? Each evaluated separately |
| API/docs revision | Which official documentation version/date was reviewed? Is feature beta/allowlist-only? |
| Authentication/webhook | How is origin/signature validated, token renewed/revoked, expiry handled? Engineering-owned detail later |
| Sandbox/preview | Is a suitable non-production/test environment supported and legally permitted? |
| Event/order identity | Which provider seller/shop/order/event identifiers and revision/version guarantees exist? |
| Ordering/delivery behavior | Duplicates, event ordering, retry behavior, pagination, quotas and reliability characteristics |
| Contract/consent | Seller terms, customer communication restrictions, recipient permissions, retention |
| Financial/economic impact | Fixed/transaction fees, exchange/payout delays, messaging fees, refund liabilities, maintenance cost |
| Operator fallback | What exact manual source process remains possible during outage or revocation? |
| Evidence state | `NOT_VERIFIED`, `DOCS_REVIEWED`, `ACCOUNT_AUTH_VERIFIED`, `SANDBOX_VERIFIED`, `INDEPENDENT_QA_PASSED`, `OWNER_ACTIVATED` |

**These are proposed evidence classifications, not a new BisnisHub governance lifecycle or provider database table.** A capability's highest label must be supported by evidence for that precise account and operation. Public API docs alone justify at most `DOCS_REVIEWED`.

### 4.3 Candidate channel evaluation (no selection)

| Candidate | Public knowledge relevant to discovery | TeeStock evidence state at authored baseline | Before any commitment |
| --- | --- | --- | --- |
| TikTok Shop | Official Partner Center documents API families, authorization, shop/order/fulfillment APIs and regional developer controls | `PUBLIC_DOCS_EXIST; ACCOUNT_ENTITLEMENT_NOT_VERIFIED` | Verify exact Indonesian shop/seller authorization, approved scopes, commercial terms, sandbox and data rights |
| Shopee | Potential marketplace candidate by TeeStock channel strategy; no exact account/API permission proof inspected here | `NOT_VERIFIED` | Obtain official applicable seller/developer documentation and exact shop entitlements |
| Other marketplaces | Potential only after commercial proof | `NOT_VERIFIED` | One-provider-at-a-time evaluation and owner choice |
| WhatsApp Business Platform | Messaging API may be a later option; human WhatsApp does not establish API access | `NOT_VERIFIED` | Verify Meta/WABA/number/provider eligibility, templates, consent, window rules, cost and recipient safety from official current docs |
| Email delivery provider | Transactional email possible in theory, but no provider chosen | `NOT_VERIFIED` | Verify sending domain, transactional purpose, abuse, delivery status semantics, privacy |
| Payment gateway | Provider required for eligible direct retail checkout | `NOT_VERIFIED` | Finance approvals, settlement/refund behavior, signature and callback testing, R5-assurance as applicable |
| Carrier aggregator / courier | Customer tracking may require provider APIs or verified manual evidence | `NOT_VERIFIED` | Carrier identity, source scans, COD/special mode limitations, fallback, confidentiality |

Provider selection is not an aesthetic UI preference. Choose according to **verified commercial demand, seller access, per-operation safety, founder time savings, compliance and total operating cost**. The first marketplace should be an inbound-only candidate if justified by demand; outbound catalog/price/ATS remain a later separate gate.

### 4.4 Provider document evidence and limitations

Public references reviewed in October 2026:

- TikTok Shop Partner Center public documentation: https://partner.tiktokshop.com/docv2/api-document — public API categories and authorization guidance; does **not** verify TeeStock account permissions.
- TikTok Shop developer app/authorization guide: https://partner.us.tiktokshop.com/docv2/page/create-your-app — US/ROW domain and app authorization details; verify regional applicability and version before implementation.
- TikTok Seller Center setup: https://ads.tiktok.com/resources/help/article/set-up-tiktok-shop-using-tiktok-seller-center — seller account prerequisites, not proof of integration approval.
- OWASP API Security Top 10 / BOLA: https://api-security.owasp.org/editions/2023/en/0xa1-broken-object-level-authorization/ — server-side object access control principle.
- web.dev Core Web Vitals: https://web.dev/articles/vitals — measured quality targets, not project runtime evidence.

No official Shopee account-level entitlement or WhatsApp messaging template/window/price was validated in this task; deliberately avoid hardcoded provider restrictions, rates, message limits, eligibility or SLA. These require fresh official-source/account review during provider selection.

---

## 5. Truth, Identity, Event and Action Boundaries

### 5.1 Five distinct layers of evidence

1. **Channel observation:** A user/message/event exists in an external system; may be incomplete or untrusted.
2. **Authenticated provider fact:** The authorized shop/provider says a scoped fact, such as an order/charge/shipment exists.
3. **Mapped business intent:** The provider fact is correlated to the correct TeeStock product/order/customer/organization and permission context.
4. **Canonical MGBOS effect:** An approved command has created/updated business truth once under correct invariants.
5. **Customer-safe projection:** The product shows only verified, authorized and current information with next actions.

A fact at layer 1 or 2 does **not** automatically prove layer 4. Presentation (layer 5) must never create its own financial/physical truth.

### 5.2 External reference versus canonical reference

A sample external order string `EXT-EXAMPLE-123` is neither a guaranteed unique global order ID nor an internal MGBOS ID. Uniqueness must be scoped by provider, seller/account, environment and the specific external resource key. Exact storage design belongs to architecture.

When a provider account has two orders with the same display number in different scopes, never merge them. Customer mobile number equality is not permission to join records. The record that binds identities must be traceable and revocable where rights/policy require.

### 5.3 Event replay and causality

- Repeated delivery of the *same* logical event must not create a second intended economic, production or fulfillment effect.
- Concurrent arrivals cannot rely solely on a UI disabled button or single-process memory.
- Repeated identifiers with materially changed content must be classified by provider's update semantics; an identity collision is not silently treated as a valid update.
- Legitimate later order revisions/cancellations are not categorically rejected as duplicates; apply guarded version/causal rules.
- Unknown outcomes after provider timeout require reconciliation before unsafe retry.
- Store or surface operator evidence with redaction; never expose signed payloads, secrets or full customer data in public telemetry.
- Provenance of observed event, validated source, intended command, committed effect and customer notification must remain distinguishable.

These are **product assurance outcomes**; not a proposed SQL schema, event topic taxonomy, or implementation of an outbox.

### 5.4 Conflict matrix

| Conflict | Customer-facing consequence | Required backstage action | No-go failure |
| --- | --- | --- | --- |
| Two provider events for same order | Single coherent order and no duplicate notification | Deduplicate according to scoped identity/semantics; audit repeat | Two production jobs or charges |
| Same external order ref different seller accounts | Do not display cross-account order | Enforce provider/account tenancy | Merge or leak confidential order |
| Marketplace order SKU unknown | Product may need human confirmation | Quarantine and map under authorized policy | Guess garment/size and start production |
| Marketplace cancellation after courier handoff | Explain exception with platform-owned rights | Reconcile accepted physical/payment facts | Erase shipment or blindly cancel |
| Payment attempt timed out | Show 'sedang diverifikasi' only if supported | Correlate/reconcile original charge before retry | Trigger second charge due to browser timeout |
| Shipping label created but not handed over | 'Pengiriman disiapkan', not 'sudah dikirim' | Require physical custody evidence | Mark shipped from tracking number alone |
| Courier scans delayed/out of order | Last proven status and time, not fabricated ETA | Record source timestamps; evaluate newer authoritative evidence | False delivered or backward contradictory timeline |
| Failed outbound price update | No claim that channel price has changed | Desired vs observed discrepancy, owner and safe retry | Consumer buys using assumed new price |
| WhatsApp contact resembles past buyer | Offer verification, no exposed history | Separate identity until proof | Display prior orders from phone matching |
| Notification provider accepted but delivery unknown | Avoid claim customer read message | Store provider receipt separately from verified delivery/read where supported | Mark customer approved because message sent |

### 5.5 Data minimization and security ownership

A cross-channel event can carry addresses, email, phone, IP, recipient identity, purchase history and financial metadata. Only the data required for legitimate fulfillment/customer care may be processed according to approved policy and contractual rights. External URLs/attachments cannot be fetched or rendered unconditionally. Confidential vendor rates, internal margin, security metadata, payment instruments and staff-only notes remain private.

Resource authorization is required on server-backed customer/order/case/document access, independent of route obscurity. The presence of a public ref or previous verified message is not a broad customer-login grant. Enforce tenant/organization/account separation at every applicable boundary. Avoid accidental PII leaks in marketing campaign logs, AI prompts, support exports, failure screenshots and third-party analytics.

---

## 6. Founder Integration Operations Experience

### 6.1 The 'one meaningful exception' contract

The founder does not need a dashboard with every successful webhook call. The operations experience should surface only **work that requires human judgment or safe intervention**, with enough context to act in one sitting.

A useful exception panel must contain: provider/seller account (permission-safe), affected customer/order category, business impact, first/last known timestamp, evidence confidence, failed or blocked action, recovery owner, allowed next action and retry/reconciliation status. Include a link to governed business record when authorized. Never treat unknown effect as harmless because only one event is visible.

### 6.2 Founder workload before/after workflow

| Task | Manual current/proposed assisted baseline | Target authorized automation | Founder remains accountable for |
| --- | --- | --- | --- |
| Receive Custom inquiry from social | Read message and clarify/enter critical requirements | Structured intake + context carrying + draft classification | Ambiguous requirements and commercial promise |
| Read marketplace sale | Inspect source and record order/reference | Selected verified inbound adapter, one governed effect | Unmapped products, suspicious or conflicting orders |
| Payment uncertainty | Ask finance/provider and investigate original payment | Safe source reconciliation + one material exception | Unresolved financial decision under approved authority |
| Shipping update | Check actual handoff and carrier evidence | Verified carrier status projection and factual notification | Physical custody, QC, packing, disputed delivery |
| Support conversation | Reconstruct every channel thread | Verified case/order context and draft response | Fair customer resolution and escalation |
| Channel listing discrepancy | Manually compare approved listing/price/stock | Future desired-versus-observed reconciliation | Pricing/economics and stock allocation decisions |

### 6.3 Notification suppression and escalation

- Transient, recoverable provider failures should not individually page the founder.
- An issue becomes actionable when expected safe retry exhausted, customer impact material, high-risk money/order integrity uncertain, or manual intervention required.
- Combine repeated same-root errors into one current exception with attempt history, without erasing distinct customer effects.
- Categorize security/financial/privacy risk as stop-and-escalate, not an automated 'fix by retry' queue.
- Every unresolved material discrepancy needs owner, age, next action, and a review/escalation path.
- Set threshold and pager/notification policy only from observed volumes, founder capacity and approved operating model, not guessed numbers.

### 6.4 Resilience in solo-founder conditions

Physical tasks cannot be automated by a chat agent: inspect garments, arrange supplier stock, verify printed proof, pack, hand to courier, handle damaged goods. Preserve these steps as explicit manual work and evidence. An adapter should reduce **transcription**, not conceal real sourcing/capacity risk. If the founder is offline, customer-facing claims must not imply real-time human staffing or provider recovery.

### 6.5 Performance isolation and observability

Run provider integration logic outside customer critical rendering paths wherever feasible after architecture review; third-party widgets must be optional and degraded gracefully. Capture metrics that separate upstream provider latency from TeeStock page responsiveness. The product quality target does not override provider rate limits or legitimated business operation, and must not turn a temporary outage into a false 'no orders' screen.

---

## 7. Support, Messaging, Consent and Optional AI

### 7.1 Customer message purposes

| Purpose | Allowed trigger principle | Common failure |
| --- | --- | --- |
| Inquiry acknowledgment | Actual accepted request and approved contact route | Auto-message claims quote confirmed |
| Formal quote available | Reviewed current quote/validity from owner | Sent obsolete/expired version |
| Proof needs review | Exact document and authorized recipient | Public link exposes proprietary artwork |
| Payment update | Verified payment state and permission to notify | Browser redirect triggers false 'paid' |
| Shipment update | Real shipment/carrier milestone, correct recipient | Label mistakenly announced as dispatched |
| Service case response | Customer-safe case message and accountable owner | Internal note exposed as customer reply |
| Promotion | Applicable marketing consent and provider rules | Transactional permission reused for advertising |

### 7.2 Consent and recipient correctness

Use approved legal/business communication rules by purpose and channel. A channel identifier observed in an order does not prove permission to send arbitrary marketing messages. Before notifying, verify recipient and allowed purpose; avoid leaking private quote/invoice/addresses through generic broadcast or copied links. Recipient delivery/read receipts should be labelled only when actually supported and proven by the provider; otherwise report send attempt or accepted-by-provider separately.

### 7.3 Customer support must not become chatbot jail

Customers need a real, usable channel to reach authorized support without being forced through an AI assistant. AI may draft replies, classify an inquiry and summarize allowed data within approved JARVIS privacy and tool controls. It may not accept payment, change financial terms, promise refunds/dispatch dates, merge customer identities, override marketplace rights, or mark orders shipped. When unknown, request factual verification or escalate.

### 7.4 Cross-channel returns and dispute ownership

A return request is not a return authorization; return authorization is not item inspection; refund approval is not payment disbursement or settlement. Distinguish each customer-visible milestone. Provider-origin orders may require marketplace-controlled initiation or dispute handling. Do not advertise an equivalent in-site action when platform policy, seller account permissions or data access do not support it. Direct-store policy is not automatically transplanted to external marketplace transactions.

---

## 8. Operational Failures, State Recovery and Security Tests

### 8.1 Failure triage matrix (`DP07-FAIL-01..12`)

| ID | Trigger | Customer-visible response | Founder/system safe next action |
| --- | --- | --- | --- |
| `DP07-FAIL-01` | Social landing destination retired | Show current truthful offer/help alternative | Fix routing/source without fake offer |
| `DP07-FAIL-02` | Form submit times out | Unconfirmed result; lookup/retry only where safe | Check accepted request before duplicating |
| `DP07-FAIL-03` | WhatsApp API unavailable, human contact exists | Route to verified human channel | Do not claim bot/webhook delivered |
| `DP07-FAIL-04` | Marketplace webhook forged | No customer order result from untrusted event | Security quarantine, safe redacted evidence |
| `DP07-FAIL-05` | Same external order repeats concurrently | One visible legitimate order | Verify single effect and correlation |
| `DP07-FAIL-06` | Same ref, different seller account | No foreign order exposed | Deny cross-tenant mapping and investigate |
| `DP07-FAIL-07` | Unknown SKU on imported order | Honest review/pending where policy allows | Hold, map/confirm safely before production |
| `DP07-FAIL-08` | Payment status unknown after redirect | Pending/verify; no false success | Reconcile source before high-impact retry |
| `DP07-FAIL-09` | Courier scan delayed, label exists | Last confirmed shipment milestone | Physical handoff/source evidence check |
| `DP07-FAIL-10` | Wrong message recipient proposed | Block send, do not disclose private fields | Correct entitlement/recipient with audit |
| `DP07-FAIL-11` | Provider rate-limited or token revoked | Affected feature unavailable, unrelated routes work | Bounded retry or disable and human recovery |
| `DP07-FAIL-12` | Price/ATS outbound update rejected | No 'synchronized' claim | Compare desired/observed; safe re-publication |

### 8.2 Trust and attack surfaces requiring independent testing

- Forged, replayed, malformed and concurrently arriving signed events; replay semantics differ by provider.
- Mismatched provider account/order/customer/organization source; event identity collisions and account revocation.
- Cross-customer/order/document access through guessed URLs, public tracking numbers or wrong tenant context.
- Unsafe external URLs, remote images/files/attachment preview, redirect targets and personally identifying failure logs.
- Provider token exposure in client bundles, third-party analytics, support tickets, screenshots or build logs.
- Payment replay, amount mismatch, timeout after charge, delayed reversal/refund/chargeback, concurrent allocation.
- Partial shipment / cancellation after dispatch / forged delivery evidence / out-of-order scans.
- Accidental message delivery to wrong contact, unsubscribed marketing, source event out of sync.
- Provider scripts causing web performance/accessibility regressions under slow network or reduced-motion/keyboard conditions.

All tests must use an approved disposable environment or safely mocked/sandboxed provider evidence; never use production money, credentials or customer records merely to validate a product draft. Formal severity/risk class, exact migrations, test matrix and QA responsibility are owned by Head Engineering.

### 8.3 No unsupported convenience shortcuts

No scraping of protected marketplace sessions or browser extensions that bypass provider rights as a replacement for authorized APIs. No copy of raw access tokens into spreadsheets or n8n execution logs. No 'exactly once delivery' assertion from webhook transport alone; assert one *intended committed business effect* under tested idempotency and transactions. No assumed automatic cancel/refund authority. No universal support status that masks legitimate marketplace differences.

---

## 9. Measurement and Research Design

### 9.1 Experience and operational scorecard

| Metric | Proposed definition / denominator | Required distinction |
| --- | --- | --- |
| Valid cross-channel completion | Relevant job completed without re-entry or deception / eligible observed attempts | Segment and actual provider readiness |
| Duplicate economic effect count | Distinct unintended duplicate business effects per tested/real valid intent | An absolute safety issue; never a conversion KPI |
| Mapping exception incidence | Unmapped/conflicting external transactions / inbound eligible transactions | Report by provider, SKU, reason |
| Unknown financial outcome age | Time from first ambiguity to verified safe disposition | Clock source and unresolved volume |
| Provider discrepancy backlog | Material source-vs-canonical mismatches with owner/age | Never hide items through retry count |
| Customer status misunderstanding | Tested users unable to explain last true fact/next action | Recorded sessions, not invented score |
| Repeated customer contact | Same issue re-contact within agreed evaluation window | Separate healthy escalation from poor self-service |
| Founder admin touches | Human transcription/lookup/repeated message steps per eligible order | Physical work separately counted |
| Founder physical touches | Sourcing, QC, packing, carrier handoff per order | Cannot claim software eliminated |
| Notification correctness | Correct authorized recipient/purpose/proven event across sampled sends | Provider accepted ≠ delivered/read |
| Integration economic value | Total maintenance/provider/messaging/support cost versus observed time saved and legitimate sales outcomes | Costs measured, not guessed |
| Web quality on core routes | CX-08 CWV lab/field and accessibility checks before/after connector addition | Field p75 only with valid sample |

Metrics are planning contracts. **All baselines and target thresholds not measured remain `NOT_VERIFIED` or `TBD_BY_APPROVED_BASELINE`.** No fake percentage of automation or guaranteed response time.

### 9.2 User and operator studies (`DP07-UT-01..10`)

| Task | Participant/task | Evidence to capture |
| --- | --- | --- |
| `DP07-UT-01` | Mobile shopper enters from social and identifies valid offer/CTA | Wrong-path choices, first-action comprehension |
| `DP07-UT-02` | Custom buyer starts in chat and continues to approved site inquiry | Re-entry burden, privacy/context consent |
| `DP07-UT-03` | Customer receives real inquiry acknowledgment, not order confirmation | Correct interpretation without coaching |
| `DP07-UT-04` | Marketplace buyer asks 'where do I complain?' | Provider vs TeeStock ownership understood |
| `DP07-UT-05` | Returning browser shows successful payment but authority pending | Customer recognizes not-yet-confirmed payment |
| `DP07-UT-06` | Customer views label-created and stale carrier scan | Understands dispatch not yet proven |
| `DP07-UT-07` | Customer moves same support issue across channels | No unnecessary repeat explanation; correct case correlation |
| `DP07-UT-08` | Founder processes duplicate and unmapped marketplace order fixture | Correct safe handling and no duplicate work |
| `DP07-UT-09` | Founder reviews one material provider outage among benign retries | Exception is actionable and not noisy |
| `DP07-UT-10` | Customer navigates without optional chat/widget/AI on low-end phone | Core path accessible and responsive |

Participant cohorts and sample size require research plan; no claim testing has occurred. S0 studies may use prototype and synthetic messages with consent; provider financial tests require separate controlled architecture/QA approval.

---

## 10. Product Requirement Delta — Proposed Refinements, Not New Canonical FRs

The next `DP07-RQ-*` rows clarify existing CX7 behaviors. They **must not replace or renumber** the existing `CX7-FR-001..048`, `CX7-BR-001..028`, `CX7-NFR-001..014` or `CX7-AC-001..044`. Any downstream promotion requires semantic owner review, owner adoption and corresponding traceability update.

| Refinement | Desired observable product behavior | Existing semantic owner | Earliest consideration | Detailed trace |
| --- | --- | --- | --- | --- |
| `DP07-RQ-01` — Context-aware landing | Preserve valid campaign/product intent across legitimate channel entry without assuming identity or inventing eligible product | `CX7-FR-001..003` | `S0` | S1; SC-01 |
| `DP07-RQ-02` — Real assisted receipt | Distinguish successful human/website acknowledgment from pending question, reviewed quote, order or channel purchase | `CX7-FR-003..005` | `S0` | S1/S2; SC-02/03 |
| `DP07-RQ-03` — Manual source correlation | When recording external orders in assisted operations, preserve provider/account/source ref and conflict review instead of relying on memory | `CX7-FR-006..008` | `S0` | S2; FAIL-02 |
| `DP07-RQ-04` — Who-owns-what disclosure | Indicate which provider/seller owns checkout, payment, returns and support action for each channel | `CX7-FR-008/033/034` | `S0+` | SC-04; S3/S6 |
| `DP07-RQ-05` — Capability-by-operation registry | Record exact provider/account/region/scope, entitlement, test environment, version and evidence per operation; no generic Connected implies ready | `CX7-FR-009/036` | `S2` | PROV-01; SC-11 |
| `DP07-RQ-06` — Signed origin and scoped IDs | No import effect before proven provider authenticity and seller/account/organization mapping | `CX7-FR-010/011/041` | `S2` | S3; FAIL-04/06 |
| `DP07-RQ-07` — Replay and conflict grammar | Repeated logical event produces no duplicate economic effect; same identity with materially conflicting payload and valid later updates handled distinctly | `CX7-FR-012/013/016` | `S2` | S3; FAIL-05 |
| `DP07-RQ-08` — Unmapped SKU quarantine | Show factual unresolved state and accountable operator option for unknown item/variant/price/fulfillment mode | `CX7-FR-014/015` | `S2` | S3; FAIL-07 |
| `DP07-RQ-09` — Cancellation after commitment | Preserve physical shipment/financial history while routing marketplace cancellation to approved policy owner | `CX7-FR-017/018` | `S2` | S3/S6 |
| `DP07-RQ-10` — Provider financial uncertainty | Separate returned browser, attempted charge, verified provider fact, internal allocation, settlement and reversal | `CX7-FR-019..024` | `S1 gated` | S4; FAIL-08 |
| `DP07-RQ-11` — Carrier evidence ladder | Present label, accepted handoff, carrier scan, delivery exception and verified completion distinctly | `CX7-FR-025..028` | `S1/S2 gated` | S5; SC-07 |
| `DP07-RQ-12` — Notification purpose model | Preserve event provenance, transactional/marketing authorization, recipient proof and sent/delivered/read uncertainty | `CX7-FR-029..032` | `S2` | S5/S6; SC-08 |
| `DP07-RQ-13` — Verified support continuity | Keep customer case accountable across channels only after appropriate order/identity proof | `CX7-FR-033..035` | `S0 assisted/S2` | S6; SC-09 |
| `DP07-RQ-14` — Operator discrepancy card | Expose one actionable issue with provider, scope, age, business harm, attempts, evidence and safe next action | `CX7-FR-036/037/042` | `S2` | SC-10; S7 |
| `DP07-RQ-15` — Bounded retry and permanent failure | Differentiate safe transient retries, unknown financial effect, permanently rejected input and revoked credentials | `CX7-FR-038/039` | `S2` | S7; FAIL-11 |
| `DP07-RQ-16` — Provider failure isolation | Keep public browsing, valid contact and unrelated operations usable when optional connector/widget fails | `CX7-FR-040` | `S0+` | S7; SC-01 |
| `DP07-RQ-17` — PII and secret minimization | Guard object-level access, seller account boundaries, files, tokens, recipient identity and telemetry | `CX7-FR-041` | `all` | Security 5.5; FAIL-10 |
| `DP07-RQ-18` — Outbound desired vs observed | Separate publish request, provider receipt and verified observed listing/price/ATS with echo suppression | `CX7-FR-043..047` | `S3` | S8; SC-12 |
| `DP07-RQ-19` — One-channel-first economic gate | Expand automation only if actual demand, account entitlements, risk controls, cost and founder time savings justify it | `CX7-FR-048` | `all` | Provider registry; §9 |
| `DP07-RQ-20` — Founder work integrity | Evaluate administrative work removed separately from unavoidable physical QC, pack and dispatch; no invented automation score | `CX7-FR-003/042/048` | `all` | §6; §9 |

---

## 11. Additional Acceptance Scenarios (`DP07-AC-01..28`)

These scenarios supplement, never supersede, the existing 44 `CX7-AC-*` tests. They are **proposed and unexecuted**. Real backend, concurrency and provider tests require the appropriate architecture, security and QA work package.

| ID | Slice | Given / When | Then (expected) | Required future evidence |
| --- | --- | --- | --- | --- |
| `DP07-AC-01` | `S0` | Social entry with unsupported/deleted campaign URL | A valid public category/help path is available; no fictitious active sales offer | browser/mobile navigation fixture |
| `DP07-AC-02` | `S0` | Customer arrives from ad with trackable source but no permission for personal identity join | Only permitted campaign context retained; no automatic customer-account merge | privacy/event-inspection fixture |
| `DP07-AC-03` | `S0` | Customer submits Custom inquiry but approved intake service times out | Screen shows unconfirmed state; no invented request ID or fulfilled quote | fault injection + customer comprehension |
| `DP07-AC-04` | `S0` | Human WhatsApp chat refers to a quote not yet approved | Customer does not see paid/ordered/accepted claim | operator script + sample quote |
| `DP07-AC-05` | `S0` | Same buyer submits similar requests in two channels | Source owner sees potential duplicate with safe resolution, not an assumed merged identity | operator exercise + sample inquiry |
| `DP07-AC-06` | `S0` | Customer asks to buy from marketplace when no integration is activated | No sync claim; legitimate provider checkout/support boundaries explained | link/copy audit |
| `DP07-AC-07` | `S2` | Account appears Connected but lacks authorized order scope | Order-import controls remain disabled with evidence status of missing scope | capability-registry negative |
| `DP07-AC-08` | `S2` | Forged external event includes someone else’s seller ID | No internal effect and no cross-org information exposed | security negative |
| `DP07-AC-09` | `S2` | Same marketplace order event delivered twice and concurrently | One governed intended order effect; duplicate evidence preserved | disposable concurrency assurance |
| `DP07-AC-10` | `S2` | Same provider event ID arrives with materially different payload | Conflict is quarantined or version-treated by provider semantics; no silent overwrite | idempotency/fingerprint negative |
| `DP07-AC-11` | `S2` | Provider later sends legitimate order amendment | Existing accepted facts retained; approved revision processing, not duplicate rejection | version/revision suite |
| `DP07-AC-12` | `S2` | Unmapped marketplace variant would trigger production | Effect held; founder sees mapping exception, no guessed SKU | import fixture + operator rehearsal |
| `DP07-AC-13` | `S2` | Marketplace cancellation arrives after physical dispatch | Payment/shipment history remains; channel-specific policy resolution | cancellation E2E |
| `DP07-AC-14` | `S1` | Browser redirects from payment success while financial source pending | Status remains pending/unknown, not paid | gateway simulated callback |
| `DP07-AC-15` | `S1` | Payment provider timed out after possible charge | No blind second charge; reconciliation path and customer next step | financial concurrency/unknown test |
| `DP07-AC-16` | `S1` | Payment event amount differs from expected intent | No misleading paid label; independent finance assurance blocks invalid effect | financial negative |
| `DP07-AC-17` | `S1` | Delivery label exists but no carrier receipt | Customer timeline says preparation, not shipped | fulfillment physical-evidence fixture |
| `DP07-AC-18` | `S2` | Carrier scans arrive late, duplicate, out of order | Last verified safe milestone with provenance; no fictitious progress | carrier mock replay |
| `DP07-AC-19` | `S2` | Notification provider accepts send but delivery/read unknown | System reports accepted-by-provider only, not confirmed read | notification fixture |
| `DP07-AC-20` | `S2` | Marketing message lacks valid permission | Send blocked; transactional obligations remain separately governed | consent negative |
| `DP07-AC-21` | `S2` | Wrong customer phone appears in channel transcript | No prior orders, invoice or addresses disclosed without authorization | identity/privacy negative |
| `DP07-AC-22` | `S2` | Same case continued from email into social channel | Context retained only after verification; case owner not lost | support case simulation |
| `DP07-AC-23` | `S2` | Provider app access revoked after earlier success | Affected capability disabled; no false health claim; manual fallback visible | revocation mock |
| `DP07-AC-24` | `S2` | Optional provider widget stalls homepage | Core navigation, CTA and relevant accessibility/performance requirements remain usable | slow network/browser/AT |
| `DP07-AC-25` | `S2` | Ten transient webhook failures reach alerting rules | One actionable root-cause exception; attempts still traceable, distinct effects preserved | operator notification experiment |
| `DP07-AC-26` | `S3` | Outbound catalog update rejected | Desired/observed mismatch visible with owner; no success badge | provider rejection simulation |
| `DP07-AC-27` | `S3` | Same outbound update echoes back as incoming event | No infinite republish loop or unauthorized pricing overwrite | loop/causality fixture |
| `DP07-AC-28` | `all` | Founder processes two channel orders and one physical return | Admin touches, physical touches, cost and recovery burden measured separately | controlled founder rehearsal |

---

## 12. Existing Requirement Preservation and Reconciliation Matrix

This is a **coverage and change-intent index**, not a claim that independent semantic QA has certified all rows. Existing IDs remain owned by [CX-07](cx-07-omnichannel-external-integration-requirements.md); implementation evidence from those rows remains `NOT_PERFORMED` until real tests. A downstream integrator must compare exact current sources before editing.

### 12.1 All 48 existing functional requirements

Mapping convention: `DP07-RQ` points to candidate explanation, not a new higher-priority requirement. Group names are summaries and are not substituted as canonical CX-07 requirement text.

| Existing ID | Existing product behavior (short label) | Candidate DP07-RQ reference |
| --- | --- | --- |
| `CX7-FR-001` | Route website/social arrivals to TeeStock intent | `DP07-RQ-01`, `DP07-RQ-02` |
| `CX7-FR-002` | Retain permitted acquisition origin | `DP07-RQ-01`, `DP07-RQ-02` |
| `CX7-FR-003` | Carry inquiry context to assisted follow-up | `DP07-RQ-01`, `DP07-RQ-02` |
| `CX7-FR-004` | Show human fallback for unsupported integrations | `DP07-RQ-01`, `DP07-RQ-02` |
| `CX7-FR-005` | Differentiate inquiry acknowledged from quote/order accepted | `DP07-RQ-01`, `DP07-RQ-02` |
| `CX7-FR-006` | Preserve external refs for manual orders | `DP07-RQ-03` |
| `CX7-FR-007` | Prevent repeated manual source effect | `DP07-RQ-03` |
| `CX7-FR-008` | Make channel responsibility clear | `DP07-RQ-04` |
| `CX7-FR-009` | Scoped provider capability inventory | `DP07-RQ-05` |
| `CX7-FR-010` | Verify provider inbound authenticity | `DP07-RQ-05` |
| `CX7-FR-011` | Provider-local/canonical IDs distinct | `DP07-RQ-05` |
| `CX7-FR-012` | Safe replay/idempotency | `DP07-RQ-07` |
| `CX7-FR-013` | Detect changed payload same idempotency identity | `DP07-RQ-07` |
| `CX7-FR-014` | Normalize marketplace order/item | `DP07-RQ-08` |
| `CX7-FR-015` | Hold unmapped/inconsistent purchase | `DP07-RQ-08` |
| `CX7-FR-016` | Preserve legitimate revisions | `DP07-RQ-08` |
| `CX7-FR-017` | Reconcile external cancellation | `DP07-RQ-09` |
| `CX7-FR-018` | Preserve provider settlement/dispute refs | `DP07-RQ-09` |
| `CX7-FR-019` | Eligible retail to approved payment | `DP07-RQ-10` |
| `CX7-FR-020` | Return URL not payment proof | `DP07-RQ-10` |
| `CX7-FR-021` | Match payment to order/intent | `DP07-RQ-10` |
| `CX7-FR-022` | Handle duplicate/late payment notifications | `DP07-RQ-10` |
| `CX7-FR-023` | Reconcile unknown payment before retry | `DP07-RQ-10` |
| `CX7-FR-024` | Truthful partial/deposit payments | `DP07-RQ-10` |
| `CX7-FR-025` | Carrier ref with exact shipment | `DP07-RQ-11` |
| `CX7-FR-026` | Label distinct from dispatch | `DP07-RQ-11` |
| `CX7-FR-027` | Verified scans and timestamps | `DP07-RQ-11` |
| `CX7-FR-028` | Stale/unavailable courier data | `DP07-RQ-11` |
| `CX7-FR-029` | Notifications from business truth | `DP07-RQ-12` |
| `CX7-FR-030` | Transactional vs promotional messaging | `DP07-RQ-12` |
| `CX7-FR-031` | Send status distinct from customer receipt | `DP07-RQ-12` |
| `CX7-FR-032` | Deduplicate notifications | `DP07-RQ-12` |
| `CX7-FR-033` | Preserve authorized support context | `DP07-RQ-13` |
| `CX7-FR-034` | Case owner across channels | `DP07-RQ-13` |
| `CX7-FR-035` | Avoid unsafe account linkage | `DP07-RQ-13` |
| `CX7-FR-036` | Connection health and scope | `DP07-RQ-14` |
| `CX7-FR-037` | Surface unresolved discrepancies | `DP07-RQ-14` |
| `CX7-FR-038` | Bounded retry safe transient actions | `DP07-RQ-15` |
| `CX7-FR-039` | Preserve permanent failure evidence | `DP07-RQ-15` |
| `CX7-FR-040` | Isolate provider degradation | `DP07-RQ-16` |
| `CX7-FR-041` | Protect credentials, PII and tenancy | `DP07-RQ-17` |
| `CX7-FR-042` | Avoid founder alert spam | `DP07-RQ-14` |
| `CX7-FR-043` | Governed catalog outbound publication | `DP07-RQ-18` |
| `CX7-FR-044` | Sync approved ATS safely | `DP07-RQ-18` |
| `CX7-FR-045` | Sync approved channel pricing | `DP07-RQ-18` |
| `CX7-FR-046` | Prevent outbound/inbound echo | `DP07-RQ-18` |
| `CX7-FR-047` | Desired vs observed provider state | `DP07-RQ-18` |
| `CX7-FR-048` | Economic and risk gate before expansion | `DP07-RQ-19` |

### 12.2 Existing 28 business rules and 14 NFRs

**All existing semantic IDs remain in force for draft reconciliation:**

| Existing range | Preservation instruction | DP-07 relevant detail |
| --- | --- | --- |
| `CX7-BR-001..006` | Preserve provider-vs-canonical truth, scoped IDs, authority and idempotency conflicts | §5.1–5.4; `DP07-RQ-06..09` |
| `CX7-BR-007..014` | Preserve financial unknown, payment/settlement distinctions, business eligibility and immutable post-cancel evidence | §2.5–2.7; §5.4 |
| `CX7-BR-015..020` | Preserve permission separation, notification receipt uncertainty, physical courier handoff and safe case identity | §2.7–2.8; §7 |
| `CX7-BR-021..028` | Preserve bounded AI/n8n, credentials privacy, provider proof, outage isolation and builder governance | §4–8; §15–17 |
| `CX7-NFR-001..004` | Provider isolation, single intended business effect, server tenancy, signed origin | §5; §8 |
| `CX7-NFR-005..008` | Unknown outcome, bounded retry, correct mapping and information freshness | §3.2; §5.3–5.4; §8 |
| `CX7-NFR-009..011` | Privacy, accessible degradation and provider quota/cost awareness | §3.3; §4; §6; §7 |
| `CX7-NFR-012..014` | Reproducible observability, operable reconciliation and change control | §6; §8; §9; §16 |

**Individual inventory audit (existing rules preserved; this index is not their replacement text):**

| Existing rule ID | Existing rule (short label) | Reconciliation |
| --- | --- | --- |
| `CX7-BR-001` | Provider fact is local, not canonical transaction | §5.1 |
| `CX7-BR-002` | External and canonical IDs must differ | §5.2 |
| `CX7-BR-003` | Cross-channel writes follow governed MGBOS commands | §5.1 |
| `CX7-BR-004` | External event not committed business event | §5.1 |
| `CX7-BR-005` | Replay never duplicates economic/fulfillment effect | §5.3 |
| `CX7-BR-006` | Same identity with changed payload is a conflict | §5.3 |
| `CX7-BR-007` | Redirect is not payment proof | §2.6 |
| `CX7-BR-008` | Payment, allocation, settlement and refund differ | §2.6 |
| `CX7-BR-009` | Unknown external effect reconciled before risky retry | §5.3 |
| `CX7-BR-010` | Provider adapter does not determine prices | §2.10 |
| `CX7-BR-011` | Unmapped items cannot become production-ready orders | §2.5 |
| `CX7-BR-012` | Each discrepancy requires owner and recovery evidence | §6.1 |
| `CX7-BR-013` | Health check is not proof all operations work | §4.2 |
| `CX7-BR-014` | Cancellation never erases committed shipment/finance | §2.5 |
| `CX7-BR-015` | Marketing purpose differs from transaction messaging | §7.2 |
| `CX7-BR-016` | Provider accepted not customer read | §7.1 |
| `CX7-BR-017` | Label created not physically dispatched | §2.7 |
| `CX7-BR-018` | Delivery estimate not unconditional guarantee | §2.7 |
| `CX7-BR-019` | No fuzzy customer identity joining | §1.3 |
| `CX7-BR-020` | Customer Case distinct from Operational Exception | §2.8 |
| `CX7-BR-021` | n8n/JARVIS have no independent state authority | §7.3 |
| `CX7-BR-022` | AI cannot invent statuses or approve money changes | §7.3 |
| `CX7-BR-023` | Credentials and private payloads not public logs | §5.5 |
| `CX7-BR-024` | Exact provider account/operation proof required | §4.2 |
| `CX7-BR-025` | Connector outage isolated from core website | §2.9 |
| `CX7-BR-026` | P0 assisted sales not falsely claimed live sync | §0.3 |
| `CX7-BR-027` | Customer status sourced, qualified and fresh | §3.2 |
| `CX7-BR-028` | Product draft not direct builder authorization | §15.2 |

| Existing NFR ID | Existing non-functional outcome (short label) | Reconciliation |
| --- | --- | --- |
| `CX7-NFR-001` | Provider failure isolation | §2.9 |
| `CX7-NFR-002` | Idempotent business effect | §5.3 |
| `CX7-NFR-003` | Authorization / tenant separation | §5.5 |
| `CX7-NFR-004` | Provider origin authentication | §8.2 |
| `CX7-NFR-005` | Unknown outcome handling | §2.6 |
| `CX7-NFR-006` | Bounded retry / queue | §2.9 |
| `CX7-NFR-007` | External mapping integrity | §5.4 |
| `CX7-NFR-008` | Freshness and confidence labels | §3.2 |
| `CX7-NFR-009` | PII minimization | §5.5 |
| `CX7-NFR-010` | Accessible degradation | §3.3 |
| `CX7-NFR-011` | Provider cost/quota control | §4.2 |
| `CX7-NFR-012` | Reproducible correlation | §6.1 |
| `CX7-NFR-013` | Operator discrepancy recovery | §6.3 |
| `CX7-NFR-014` | Governed release and rollback | §15.2 |

No business-rule or NFR range is repealed, downgraded or replaced by this companion. After adoption, exact individual link validation belongs in the package traceability audit.

### 12.3 All 44 existing acceptance IDs

The existing cases are not erased, rewritten or counted as executed. Their intended scope is preserved through the following matrix.

| Existing acceptance | Protected scenario (short label) | Main DP-07 reconciliation section |
| --- | --- | --- |
| `CX7-AC-001` | Social → Custom | §2.3 |
| `CX7-AC-002` | WhatsApp assisted | §2.4 |
| `CX7-AC-003` | Repeated inquiry | §2.3 |
| `CX7-AC-004` | Invalid identity merge | §1.3 |
| `CX7-AC-005` | CRM down | §2.3 |
| `CX7-AC-006` | Manual marketplace order | §2.5 |
| `CX7-AC-007` | No premature quote/order | §2.4 |
| `CX7-AC-008` | No false sync claim | §4.3 |
| `CX7-AC-009` | Valid marketplace import | §2.5 |
| `CX7-AC-010` | Repeated webhook | §5.3 |
| `CX7-AC-011` | Changed same idempotency key | §5.3 |
| `CX7-AC-012` | Concurrent same order | §5.3 |
| `CX7-AC-013` | Same ID different accounts | §5.2 |
| `CX7-AC-014` | Unmapped SKU | §5.4 |
| `CX7-AC-015` | Valid changed revision | §5.3 |
| `CX7-AC-016` | Cancellation after shipment | §2.5 |
| `CX7-AC-017` | Browser payment redirect unknown | §2.6 |
| `CX7-AC-018` | Verified payment effect | §2.6 |
| `CX7-AC-019` | Forged event | §8.2 |
| `CX7-AC-020` | Payment amount mismatch | §5.4 |
| `CX7-AC-021` | Concurrent payment webhook | §8.2 |
| `CX7-AC-022` | Payment timeout | §2.6 |
| `CX7-AC-023` | Chargeback/reversal | §7.4 |
| `CX7-AC-024` | Partial deposit | §2.6 |
| `CX7-AC-025` | Label not handoff | §2.7 |
| `CX7-AC-026` | Out-of-order scans | §2.7 |
| `CX7-AC-027` | Courier unavailable | §2.7 |
| `CX7-AC-028` | Foreign user denied | §5.5 |
| `CX7-AC-029` | Notification source/recipient | §7.1 |
| `CX7-AC-030` | Send accepted not read | §7.1 |
| `CX7-AC-031` | Marketing permission | §7.2 |
| `CX7-AC-032` | Cross-channel case context | §2.8 |
| `CX7-AC-033` | AI incorrect refund | §7.3 |
| `CX7-AC-034` | Unrelated complaint separation | §2.8 |
| `CX7-AC-035` | Provider rate limit | §8.1 |
| `CX7-AC-036` | Poison event | §8.1 |
| `CX7-AC-037` | Revoked credentials | §2.9 |
| `CX7-AC-038` | Cross-org event | §5.5 |
| `CX7-AC-039` | Malicious URL/file | §8.2 |
| `CX7-AC-040` | Optional widget failure | §3.3 |
| `CX7-AC-041` | Outbound update rejected | §2.10 |
| `CX7-AC-042` | ATS drift | §2.10 |
| `CX7-AC-043` | Echo prevention | §2.10 |
| `CX7-AC-044` | Provider evidence not proven | §4.1 |

**Traceability rule:** The base `CX-PKG-TRACE-R1.csv` maps the 46 CX-01 parent FRs across the CX package. DP-07 intentionally adds candidate `DP07-*` IDs only. Any accepted change to existing `CX7-FR`, acceptance links, slice assignment or owner decision must be reconciled with CX-01, CX-02, CX-03, CX-04, CX-05, CX-06, CX-08, CX-09, source map and trace matrix; never update one side only.

---

## 13. Research Unknowns and Owner Decision Routing

### 13.1 Existing decisions remain open

All `CX7-DEC-01..18` remain proposed/open as classified in CX-07; the separate `CX-PKG-DECISIONS-R1.md` remains the package-level owner decision register. A direction agreed in chat (premium, capable, fast, founder-efficient) **does not silently approve a named provider, spend or first automated marketplace**.

| Decision family | Existing IDs | Recommended default — not approval | Evidence owner |
| --- | --- | --- | --- |
| Channel/marketplace | `CX7-DEC-01..05` | Keep assisted sales truthful; choose at most one first inbound provider after eligibility/demand proof | Owner + product + provider feasibility |
| Payment | `CX7-DEC-06..08` | No live money flow until provider, canonical ledger/replay and authorized financial readiness | Finance + Head Engineering + Owner |
| Carrier | `CX7-DEC-09` | Show verified physical milestones; one necessary integration after genuine operating demand | Ops + provider + Head Engineering |
| Messaging / WhatsApp | `CX7-DEC-10..11` | Human-assisted S0; messaging API conditional on exact account/consent/provider terms | Owner + legal/channel + provider |
| Identity / support / AI | `CX7-DEC-12..14` | No fuzzy user merges, money-autonomous AI, spammy event alerts | CX-06 + JARVIS + Head Engineering |
| Freshness / transport | `CX7-DEC-15..16` | Evidence-led freshness; no assumption of existing outbox or scheduler reliability | Architecture + QA |
| Attribution / economics | `CX7-DEC-17..18` | Data-minimized acquisition context; provider spend justified by measured workload benefit | Owner + finance + product |

### 13.2 Material unknown register (`DP07-UNK-01..12`)

| ID | Unverified decision input | Why it matters | Evidence to resolve |
| --- | --- | --- | --- |
| `DP07-UNK-01` | Actual first sales channel volumes by relevant customer job | Priority should follow real demand | Sales/contact observations, not guesses |
| `DP07-UNK-02` | Exact seller accounts/marketplaces authorized | Determines legal/access feasibility | Account ownership, official capability scopes |
| `DP07-UNK-03` | Approved WhatsApp/email messages, consent and lawful bases | Recipient privacy and messaging rights | Current official policy/account review |
| `DP07-UNK-04` | Selected payment provider, settlement/refund mechanics | Avoids financial-risk implementation | Finance + provider sandbox/contracts |
| `DP07-UNK-05` | Safe MGBOS external identity and command mapping | Prevents duplicate/foreign effects | Exact-source architecture + security audit |
| `DP07-UNK-06` | Real event/queue/outbox/reconciliation implementation | Avoids fictional reliability promises | Head Engineering runtime/source/CI evidence |
| `DP07-UNK-07` | Vendor and courier coverage/physical handoff evidence | Shipping truth and customer expectations | Logistics account/real operating evidence |
| `DP07-UNK-08` | Current product variant and ATS publication rules | Overselling/financial losses | Inventory/commerce policy and tests |
| `DP07-UNK-09` | Customer right to see cross-channel order data | Avoid privacy/marketplace term breaches | Legal/provider/account review |
| `DP07-UNK-10` | Real support volume, repeated contact and manual retyping | Determines value of automation | Founder workload observation |
| `DP07-UNK-11` | Transaction dispute/refund division per provider | Avoids false customer rights | Current provider terms and seller process |
| `DP07-UNK-12` | Mobile/device/network/provider widget costs | Prevents UX deterioration | CX-08 profiling on representative build |

### 13.3 Escalate the smallest necessary Owner questions

At product drafting stage, no provider selection is necessary. When actual integration approval is requested, Owner should receive **one compact decision packet**: options, verified access, expected customer jobs, recurring/marginal cost, operator burden, security/financial risks, recommended smallest scope and explicit deferral alternative. Head Engineering decides technical feasibility; no request for Owner to select webhook algorithms, schema or OAuth details.

---

## 14. Risk Register and Stop Conditions

### 14.1 Existing risk preservation

Existing `CX7-RISK-01..16` remain explicit in CX-07, including duplicate marketplace/financial effects, cross-org mapping, provider credential loss, wrong notifications, stale ATS, AI hallucinated commerce promises, retry storms, provider entitlement gaps, cost explosion, and documentation routing collision. DP-07 does **not** overwrite their severity or the formal BisnisHub R0–R5 engineering risk classification.

### 14.2 DP-07-specific early detection risks

| Risk label | Failure signature | Product containment and evidence |
| --- | --- | --- |
| `DP07-RISK-A` Channel continuity over-promised | All-in-one account UI shows unsupported external orders | Provider-by-operation account evidence; hide unsupported surfaces |
| `DP07-RISK-B` 'Connected' hides missing scopes | Health indicator green while webhook or order API unauthorized | Per-operation connection labels and negative scope tests |
| `DP07-RISK-C` Founder alert fatigue | Flood of benign retries masks real payment discrepancy | Dedup notification and impact-based escalation, age ownership |
| `DP07-RISK-D` Misleading delivery claim | Label or delayed scan shown as handed-off/delivered | Physical evidence ladder and source timestamp |
| `DP07-RISK-E` Inaccurate source attribution | Matching phone/social profile joins unrelated customers | Scoped proof, no fuzzy identity matching |
| `DP07-RISK-F` Provider widget harms checkout/browser | Slow optional SDK delays primary CTA | Lazy isolated provider code, independent CX-08 regression |
| `DP07-RISK-G` Integration scales ahead of economics | Maintenance > founder time saved | One-provider staged adoption and measured cost-to-serve |
| `DP07-RISK-H` Historical provider terms become stale | Provider revokes app permissions or alters rules | Fresh provider capability audit, kill switch and manual fallback |

### 14.3 Explicit STOP conditions

Stop the affected proposed feature, do not continue towards public activation, if any of these hold:

1. No legitimate provider account authorization/operation scope.
2. No approved and independently assured method to prevent duplicate financial/order effects in the exact workflow.
3. Cannot distinguish unknown/failed/pending from verified source state.
4. Foreign account/customer/organization records may be observed or mutated.
5. Unsupported checkout, stock, lead-time, refund or delivery commitment would be shown publicly.
6. Third-party messaging may expose customer/order/financial documents without verified recipient/consent.
7. Revoked/expired provider credentials lead to unbounded retry or silent data corruption.
8. Provider outage blocks unrelated customer essentials or cannot be recovered through legitimate operator path.
9. A proposed CX-07 requirement silently redefines MGBOS command/event states or money authority.
10. Actual PR/branch work overlaps without one-writer coordination, especially governance/routing areas such as PR #73.

---

## 15. Implementation Boundary and Integration Routing

### 15.1 Document lifecycle

**This file is COPY_READY for a DRAFT proposed companion**, not canonical approval. It may be stored at the exact path specified in frontmatter without altering existing CX-07. The documentation constitution's `DRAFT → REVIEW → ACTIVE` process remains the only route to normative authority. An AI author self-review is not independent acceptance. A merge alone does not imply runtime truth.

### 15.2 Proposed reconciliation handoff (NOT a Builder command)

After DP-07 and the remaining DP-08/09 documents are drafted, integrate through bounded documentation-only PR(s) according to Head Engineering routing:

1. Fresh read of `main`, open PRs and current documentary authority.
2. Compare exact CX-07 source against accepted DP07 delta and existing CX-PKG-TRACE-R1.
3. Select additions and conflict fixes by semantic owner, preserving existing IDs and section structure.
4. Update affected CX-07 requirements/acceptance, downstream CX-08/09, source gap, decision, trace and README only where justified.
5. Run link/ID/frontmatter/traceability lint plus independent Product/UX and Security/Engineering reviews where applicable.
6. Publish before/after semantic diff and explicit unresolved decisions; no broad rewrite for style only.
7. Use separate owner approval and governed IC/WP before any connector, payment, identity or production implementation.

### 15.3 Candidate architecture discovery units, not implementation authority

- `DISC-DP07-A`: Source origin and manual/assisted provenance; business semantics audit.
- `DISC-DP07-B`: Provider authorization and capability/economic matrix.
- `DISC-DP07-C`: One inbound marketplace scope and exact replay/tenant assurance.
- `DISC-DP07-D`: Financial provider reconciliation and R5 assurance when required.
- `DISC-DP07-E`: Carrier/messaging privacy and truthful notifications.
- `DISC-DP07-F`: Async delivery/outbox/observability gap, if actual need demonstrated.
- `DISC-DP07-G`: Separate optional outbound catalog/price/ATS sync only after independent readiness.

No changes to production secrets, payment methods, database, API endpoints, repository source, CI, PR, merge, or deployment are authorized by this document.

---

## 16. Author Quality Assurance & Evidence Disposition

### 16.1 Pre-release checklist

- [x] Exact main source and target CX-07 inspected; no false claim of DP-01..06 merge.
- [x] Existing CX7 ID inventories accounted for: 48 FR, 28 BR, 14 NFR, 44 AC.
- [x] All ten existing CX7 journey IDs preserved; cross-channel experience scenarios added with separate IDs.
- [x] Provider account entitlement and sandbox readiness explicitly NOT_VERIFIED.
- [x] Product channel and pricing/finance/transaction semantic owners respected.
- [x] Assisted CX-S0 distinguished from future CX-S1/S2/S3, with P priority separate from slices.
- [x] Customer status, financial uncertainty, provider account mapping, privacy and security negative paths included.
- [x] Founder physical work separated from administrative automation.
- [x] New requirement refinements and acceptance IDs created in a non-canonical namespace.
- [x] No independent QA/production success is falsely claimed.
- [ ] Owner approval of provider, cost, sequence or CX-07 formal adoption — PENDING.
- [ ] Independent product/security/QA review — NOT_PERFORMED.
- [ ] Actual customer research — NOT_PERFORMED.
- [ ] Provider sandbox/production transaction tests — NOT_PERFORMED.
- [ ] Architecture feasibility assessment — NOT_PERFORMED.

### 16.2 Copy-ready scope

**Proposed destination:** `systems/mgbos/docs/product/teestock-customer-platform/CX-PKG-DP07-OMNICHANNEL-EXTERNAL-INTEGRATIONS-R2.md`.

**Do not overwrite:** `cx-07-omnichannel-external-integration-requirements.md`, business channel strategy, MGBOS architecture, provider configs, active PR #73 or project navigation/entrypoint indexes in this stage.

**Self-QA evidence:** Local Markdown/YAML/checks for unique DP07 IDs and crosswalk coverage may be performed by the author; results reported separately after execution. They are not source/runtime/user research proof.

### 16.3 Source and methodology register

**Repository sources (read-only at inspected SHA):**

- `systems/mgbos/docs/product/teestock-customer-platform/cx-07-omnichannel-external-integration-requirements.md` (existing, DRAFT v0.1.1)
- `systems/mgbos/docs/product/teestock-customer-platform/cx-01-master-prd.md`
- `systems/mgbos/docs/product/teestock-customer-platform/cx-02-customer-journeys-service-blueprint.md`
- `systems/mgbos/docs/product/teestock-customer-platform/cx-03-experience-design-interaction-spec.md`
- `systems/mgbos/docs/product/teestock-customer-platform/cx-04-commerce-checkout-experience.md`
- `systems/mgbos/docs/product/teestock-customer-platform/cx-05-custom-b2b-ordering-experience.md`
- `systems/mgbos/docs/product/teestock-customer-platform/cx-06-customer-account-service-experience.md`
- `systems/mgbos/docs/product/teestock-customer-platform/cx-08-experience-quality-acceptance-contract.md`
- `systems/mgbos/docs/product/teestock-customer-platform/cx-09-phased-delivery-product-validation-plan.md`
- `systems/mgbos/docs/product/teestock-customer-platform/CX-PKG-DECISIONS-R1.md`
- `systems/mgbos/docs/product/teestock-customer-platform/CX-PKG-TRACE-R1.csv`
- `bisnis/teestock/09-marketing/channel-strategy.md`
- `bisnis/teestock/11-data-mgbos/mgbos-integration.md`
- `docs/governance/documentation-constitution.md`
- `docs/governance/canonical-source-map.md`

**External official references:** see §4.4. Use current terms/provider documentation for any future engineering work; public pages do not prove the seller's entitlements.

### 16.4 Final author disposition

`DOCUMENT_DRAFT_COMPLETENESS: AUTHOR_SELF_REVIEWED`  
`DOCUMENT_COPY_READINESS: COPY_READY_AFTER_AUTHOR_FILE_QA`  
`CANONICAL_AUTHORITY: NONE`  
`OWNER_PRODUCT_APPROVAL: PENDING`  
`PROVIDER_ACCOUNT_ENTITLEMENT: NOT_VERIFIED`  
`INDEPENDENT_PRODUCT_SECURITY_QA: NOT_PERFORMED`  
`IMPLEMENTATION / MERGE / DEPLOYMENT: NONE AUTHORIZED`

**Next proposed document:** `DP-08 — Experience Quality & Acceptance Deepening`, after this candidate is saved and source revision rechecked. No builder handoff from DP-07 alone.

**End of DP-07.**
