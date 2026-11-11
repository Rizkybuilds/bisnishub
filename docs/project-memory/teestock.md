# TeeStock — Project Memory

**Updated:** 2026-11-11 (Asia/Jakarta)  
**Type:** Curated context for strategy/product/development conversations. **Not** a replacement for the [canonical TeeStock decision register](../../bisnis/teestock/00-foundation/decision-register.md) or live implementation evidence.

## 1. Founder-decided direction

| Status | Decision | Rationale / boundary |
| --- | --- | --- |
| **FOUNDER_DECIDED** (2026-10-20) | TeeStock is a **curated-design-first apparel brand**, not primarily a B2B/custom printing company. | Commerce/Selects leads customer positioning; Custom/Business is secondary. See [DEC-TS-2026-012](../../bisnis/teestock/00-foundation/decision-2026-012-curated-design-first.md). |
| **FOUNDER_DECIDED** (2026-11-11) | Choose **A — Design-led Everyday** as TeeStock's primary identity, borrowing the intellectual edge of **Intelligent Statement Wear** and the artistic freedom of **Art & Culture Label**. | Design-led, wearable everyday apparel with personality; do not restrict all designs to one artistic style, typography system, or satire. This is the founder's confirmation in the strategic discussion of 2026-11-11; related detailed branding/pricing proposals are not automatically locked. |
| **FOUNDER_DECIDED** (2026-11-11) | Use **lean, feature-by-feature development**; ChatGPT may work directly on GitHub instead of defaulting to multi-agent/Antigravity/ATLAS/ORION handoff ceremonies. | See [ACTIVE workflow](../../docs/engineering/lean-feature-delivery.md); preserve real security, testing and production controls. |
| **FOUNDER_DECIDED** (2026-11-11) | Adopt **Launch Capsule 001** as the initial, lean commercial validation work plan: **4 proposed product slots (3 Selects, 1 Originals), plus 2 reserve candidates** (1 Selects, 1 Originals); test **two physical samples first** before expanding; prioritize consistent garment qualification, rights/DTF/QC, truthful presentation and order readiness. | This is an approval of the **capsule strategy and validation sequence**, not selection of actual designs, vendors, fabric/fit, size chart, SKU, colorway, HPP, prices, inventory commitment, launch date or production/release. Actual product selection and saleability require evidence and further decisions. |
| **FOUNDER_DECIDED** (2026-11-11) | Initial commerce payment approach: existing merchant **QRIS + admin-verified manual confirmation**, not automatic payment-gateway activation. | Last-three-digit unique amounts are at most matching hints; provider-policy, collision, rounding and payment-verification checks are needed before implementation. See [AGENTS.md](../../AGENTS.md). |

## 2. Business architecture (read the owners for detail)

- **TeeStock Selects**: curated third-party designs distributed on apparel, subject to each source's actual resale/reproduction rights; curation is not a claim of original authorship. Commercial discovery and early sales validation focus.
- **TeeStock Originals**: original owned-IP creative program with collections and potential independent labels; differentiated creative assets, not necessarily a new Commerce line. Develop concepts and art directions seriously, but prioritize market response and printability over raw concept volume.
- **TeeStock Essentials**: supporting apparel basics/garment fundamentals.
- **Services / Business / Custom**: secondary/conditional, not the homepage's central identity.
- **Brand expression**: premium clean monochrome/black-white UI; restrained editorial layout, high usability and mobile accessibility. The garment artwork itself may use full color. Actual product photography and truthful availability outrank decorative layouts.
- **Launch operations**: asset-light DTF + blank garments, pressing on order, verification of supplier, fit, fabric, rights, sample prints, HPP, QC and fulfillment before selling.

**Primary sources:** [master brand strategy](../../bisnis/teestock/02-brand/master-brand-strategy.md), [commerce overview](../../bisnis/teestock/03-commerce/commerce-overview.md), [roadmap](../../bisnis/teestock/14-roadmap/master-roadmap.md), [IP policy](../../bisnis/teestock/12-legal-ip/ip-policy.md).

## 3. Strategic hypotheses — do NOT silently treat as locked

| Status | Working theory / proposed test |
| --- | --- |
| **HYPOTHESIS** | Primary buyer: "Observant Individualist" (people drawn to thoughtful, unusual, funny or personally relevant design). Secondary "Visual Explorer" likes strong aesthetics. Validate with actual buyers, not demographics alone. |
| **HYPOTHESIS** | Brand personality compass: **Thoughtful, Curious, Playful, Unconventional**. "Designs with a point of view" is a working phrase, **not an approved tagline**. |
| **HYPOTHESIS** | Three creative territories: Intelligent Expression; Visual Storytelling; Quiet Experimentation. These are exploration modes, **not locked collection names**. |
| **SUPERSEDED** (2026-11-11) | Earlier assortment suggestion of 4–6 Selects + 1–2 Originals was replaced by the **FOUNDER_DECIDED Capsule 001 pilot structure: 3 Selects + 1 Originals main slots, 2 reserves**. This does not commit to actual launch quantities or sales readiness. |
| **HYPOTHESIS** | Early price testing ranges discussed: Selects Rp139–169k, Originals Rp169–219k. **Not official prices**. Must verify full HPP, channel fees, garment/sample quality, taxes as applicable, and willingness to pay. |
| **HYPOTHESIS** | A 30-day post-readiness pilot: product validation → photographs/content → limited selling → learn/repeat. Launch only after commercial and operational readiness checks. |
| **HYPOTHESIS** (2026-11-11 product-identity exploration) | Use one **shared TeeStock base garment** for Selects and Originals: relaxed/mild-boxy fit, cotton combed **24s** candidate around **175–195 GSM**, start sampling black and off-white. Compare with a regular-relaxed fit and at least two viable suppliers; **not** a locked garment, vendor, size chart, color, or inventory purchase. |
| **HYPOTHESIS** (2026-11-11 quality direction) | Print-first design standards: 300 DPI effective size or appropriate vector assets, clean transparent artwork, vendor-specific DTF/press profile, no excessive solid ink coverage without hand-feel testing, physical wash/fit/print QC and true size chart before publish. Existing [DTF skill](../../.agents/skills/dtf-print-ops/SKILL.md) covers technical boundaries. |
| **HYPOTHESIS** (2026-11-11 capsule execution options) | The **roles** for the founder-approved four-slot capsule are proposed as conversation starter, visual attraction, everyday favorite (Selects) and signature piece (Originals). Candidate black/off-white shared garment, one colorway per artwork, S–XL where validated, and pressing on order remain **unlocked implementation choices**. Test economics and customer preference before committing. |

For TeeStock Original concepts, the working art-review rubric is originality/differentiation 25, commercial appeal 25, art direction 20, execution 15, DTF printability 15; >=80 is a proposed threshold with rights/major defects as hard fails. This is an internal **creative review**, not proof of customer demand. A 100-artwork/month ambition should not block initial sales.

## 3A. Actual artwork curation audit — OBSERVED 2026-11-11; not founder-approved selection

- **SOURCE SCOPE:** Design Lab evidence was read from the **unmerged** branch `fix/tdl-canonical-registry-reconciliation`, not from `main`. Registry path: `bisnis/teestock/design-lab/05_REGISTRY/`. Recheck the branch and source evidence before using this snapshot.
- Registry enumerates **15 design candidates** (5 Human Condition, 5 Oddly Ordinary, 5 Quiet Rebellion), **0 with `commercial_status=READY`**. This is registry evidence, not a definitive audit of every creative file outside the repository.
- **HC-001 — The Dangerous Species:** A real selected raw JPG, crest PNG, print PNG, and mockup files were located in `01_COLLECTIONS/TEESTOCK_ORIGINAL/01_HUMAN_CONDITION/07_ARTWORK_DEVELOPMENT/HC-001_THE-DANGEROUS-SPECIES/`. The selected visual shows a classical philosopher bust and measuring caliper. **INDEPENDENT CREATIVE ASSESSMENT (HYPOTHESIS):** concept is strong but existing Greek/Roman bust artwork is too conventional for a TeeStock hero; rework visual mechanism before selling.
- **CONFLICT:** HC-001 QA and approval narratives claim `PRODUCTION READY`, whereas reconciled design registry says `IN_DEVELOPMENT`, `IN_REVIEW` rights, `NOT_TESTED` production, `NOT_READY` commercial; `08_PRODUCTION.csv` has no physical test. Earlier historical asset rows refer to a different `TSD-001-001` concept. Do **not** promote production or commercial status.
- QA arithmetic error: `2px` at `300 PPI` is about **0.169 mm**, not `0.51 mm`. Supplier-specific lineweight and actual print test must be checked; don't assume every fine line passes.
- **HYPOTHESIS (candidate concept shortlist, not final art):** `QR-004 Unfollow the Noise` and `OO-005 Replying in My Head` merit priority art development; `QR-006 No Audience Required` is a reserve; `OO-001 Social Battery: 1%` is relevant but linguistically crowded; `HC-001` deserves a new art direction with concept preserved. No visual masters or sampling are verified for the other concepts.
- **SELECTS:** No rights-cleared, individually accepted third-party artwork identified in the source registry or initial Etsy exploration. Etsy digital designs have seller-specific licensing: commercial use may **exclude POD or subcontracted printing**, cap product units, require additional licenses, or prohibit resale under other labels. Purchasing a download or a vague "commercial use" phrase is insufficient. Avoid mass-design clipart bundles as the distinctive first TeeStock assortment. Do not invent approved SKU/designs or attribute originals to TeeStock.
- **NEXT ACTION:** Inspect and score actual art assets (not concepts only), obtain explicit third-party apparel merchandising rights for Selects, test buyer reactions, sample/QA and then choose the 3 Selects + 1 Originals launch slots already approved as the structure. No product selection approved at this audit stage.

## 4. Verified engineering snapshot — OBSERVED 2026-11-11, RECHECK LIVE

- **VERIFIED_AT 2026-11-11:** `main` observed at `4dec7fb2db7b2fc9f2a4f9920bf07dce4a0d3f5c`. **This snapshot will become stale; do not describe it as current without a new check.**
- [PR #110](https://github.com/Rizkybuilds/bisnishub/pull/110) merged: TeeStock commercial catalog F01, variant/SKU/price/HPP management, rights/sample publication gates, public published product listing and PDP. **No live checkout or payment activation** is implied.
- [PR #107](https://github.com/Rizkybuilds/bisnishub/pull/107) merged: lean development instructions and product direction for manual QRIS.
- [PR #103](https://github.com/Rizkybuilds/bisnishub/pull/103) merged: monochrome design-system foundation.
- [PR #104](https://github.com/Rizkybuilds/bisnishub/pull/104) observed **OPEN**: curated homepage/discovery improvements; inspect up-to-date status and diff before deciding to merge or replace.
- In observed storefront source, the `/shop` page also displays six **preview/study-only** concepts. Do not present them as buyable stock. Publish verified real products first.
- **Not verified as operational:** fully working commercial checkout, manual payment receipt workflow, final production deployment, real sample quality, verified sales/margins.

## 5. Near-term next actions / OPEN

1. **OPEN:** Finish verifying a small release assortment: rights, samples, blank supplier, sizes, print, packaging, cost and margin.
2. **OPEN:** Complete a truthful commercial PDP → cart/checkout → order → QRIS manual verification → production/QC → delivery flow, with security and duplicate-order protections appropriate to real payments.
3. **OPEN:** Fix/verify storefront presentation and deployment; avoid repeated visual redesign without real product photos and customer testing.
4. **OPEN:** Validate actual buyer segments, demand, content formats and prices with first sales rather than assuming the hypotheses above are correct.

## 6. How to update this file

After a **material** founder decision, append or edit the specific decision with date and rationale; explicitly change earlier contradictory claims to **SUPERSEDED** when necessary. Move confirmed business decisions into the [owning TeeStock decision register](../../bisnis/teestock/00-foundation/decision-register.md) when the larger canonical update is actually warranted. Never let this dated snapshot overrule live repository evidence, legal rights, verified prices, or operational facts. Do not put private founder or customer data here.
