# TeeStock — Project Memory

**Updated:** 2026-11-11 (Asia/Jakarta)  
**Type:** Curated context for strategy/product/development conversations. **Not** a replacement for the [canonical TeeStock decision register](../../bisnis/teestock/00-foundation/decision-register.md) or live implementation evidence.

## 1. Founder-decided direction

| Status | Decision | Rationale / boundary |
| --- | --- | --- |
| **FOUNDER_DECIDED** (2026-10-20) | TeeStock is a **curated-design-first apparel brand**, not primarily a B2B/custom printing company. | Commerce/Selects leads customer positioning; Custom/Business is secondary. See [DEC-TS-2026-012](../../bisnis/teestock/00-foundation/decision-2026-012-curated-design-first.md). |
| **FOUNDER_DECIDED** (2026-11-11) | Choose **A — Design-led Everyday** as TeeStock's primary identity, borrowing the intellectual edge of **Intelligent Statement Wear** and the artistic freedom of **Art & Culture Label**. | Design-led, wearable everyday apparel with personality; do not restrict all designs to one artistic style, typography system, or satire. This is the founder's confirmation in the strategic discussion of 2026-11-11; related detailed branding/pricing proposals are not automatically locked. |
| **FOUNDER_DECIDED** (2026-11-11) | Use **lean, feature-by-feature development**; ChatGPT may work directly on GitHub instead of defaulting to multi-agent/Antigravity/ATLAS/ORION handoff ceremonies. | See [ACTIVE workflow](../../docs/engineering/lean-feature-delivery.md); preserve real security, testing and production controls. |
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
| **HYPOTHESIS** | Test launch assortment roughly 4–6 rights-cleared Selects and 1–2 physically validated Originals, potentially starting smaller. This is **not a promised quantity**. |
| **HYPOTHESIS** | Early price testing ranges discussed: Selects Rp139–169k, Originals Rp169–219k. **Not official prices**. Must verify full HPP, channel fees, garment/sample quality, taxes as applicable, and willingness to pay. |
| **HYPOTHESIS** | A 30-day post-readiness pilot: product validation → photographs/content → limited selling → learn/repeat. Launch only after commercial and operational readiness checks. |

For TeeStock Original concepts, the working art-review rubric is originality/differentiation 25, commercial appeal 25, art direction 20, execution 15, DTF printability 15; >=80 is a proposed threshold with rights/major defects as hard fails. This is an internal **creative review**, not proof of customer demand. A 100-artwork/month ambition should not block initial sales.

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
