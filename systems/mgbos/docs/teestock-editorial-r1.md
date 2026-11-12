# TeeStock Storefront — Quietly Bold Commerce (R1)

Status: REVIEW CANDIDATE — not approved for production.

## Purpose

Editorial retail design that reads like a serious clothing label: purposeful monochrome chrome, assertive hierarchy, clear commerce paths, and a visible distinction between **verified product releases** and **illustrative studio studies**. Product artwork may retain its own color. This is not a Notion clone, a generic AI landing page, or an animation kit.

## Visual decisions

- Almost-white paper (#fff), black ink (#111), warm neutral (#f4f4f1), restrained hairline dividers (#dededb).
- Clean sans for functional UI, a small amount of serif italic for brand storytelling. No ornamental ticker/marquee, neon gradients, circular fake stamps or glassmorphism.
- 1440px max shell with 48px side gutters on desktop and 18px on narrow mobile.
- Functional header: The Edit (primary), Studio Archive, Our Point of View, and real Bag. Demo simulator remains available from mobile navigation and existing demo routes, but is not the main retail CTA.
- One editorial statement in the hero; actual release section remains independent and empty states explain what is not ready.
- Concept mockups are explicitly **not for sale**. Remove visual emphasis from simulated prices. Never invent product images, SKUs, rights approvals, verified costs, stock, or QRIS.
- PDP keeps variant-aware server prices and accessibility; cart and checkout preserve existing contract and disabled-by-default activation.
- Responsive typography and product grids; visible keyboard focus; reduced-motion support.

## Reference synthesis (not copied)

- Notion: simple navigational hierarchy, whitespace, clean typography and predictable controls.
- OpenClothing (owner reference): a sharp retail-first fashion sensibility; page-level specifics unverified due to restricted readable page access.
- 21st.dev: use high-quality interaction patterns *selectively*, not widget accumulation.
- Minimal fashion retail: generous item photography and magazine-grade composition rather than a noisy collection of micro-components.

## Review gates

1. Confirm first impression at 360px, 390px, 768px and 1440px; look for text clipping and genuinely tappable controls.
2. Check keyboard focus, mobile navigation Escape/restore, view scrolling and card reading order.
3. Verify unconfigured preview displays no purchasable product / checkout is still OFF.
4. After approval and real assets: replace illustrative hero tees with rights-cleared high-quality product photography and accurate photographed mockups.
5. Do not merge for production based on a passing build alone. Founder should review working preview first.

## Known limitations

- No verified retail products/photography in preview, so the design uses clearly labeled in-repo illustrations.
- Long-tail legacy /custom and /business pages still use previous content structure; the new shared chrome is in place, and those pages should be separately audited if retained in retail navigation.
- This R1 is a production-safe presentation iteration. It does not modify catalog, orders, QRIS, database, or deployment activation.
