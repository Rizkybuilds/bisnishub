# LITTLE TREAT — MENU & HPP
**Status: ACTIVE — Catalog & costing infrastructure (not commercial launch approval)**  
**As of:** 11 November 2026  
**Database:** dedicated Supabase `ujmojkgipvckwdegcoph` only  
**PR:** [#117](https://github.com/Rizkybuilds/bisnishub/pull/117)

## 1. What is completed

- Source of truth for quantities: `recipes.js` (owner-approved 11 Nov 2026 SOP baselines).
- 30 recipe identities: 16 coffee drinks × 4 cup sizes = 64 sellable coffee SKU records, 9 banana SKUs, 5 dimsum SKUs, **78 total selectable products**.
- Existing 16 unsized coffee template records remain inactive for backwards compatibility: **94 total `lt_products` rows**, NOT 94 distinct final menu identities.
- 45 normalized material names and 634 per-serving `lt_bom` rows. No prior prices, receipts, or BOM entries overwritten.
- `lt_material_quotes` stores current supplier estimate as pack price / pack quantity, accessible only to active owner.
- Actual HPP is computed from `lt_material_costs.avg_cost_per_unit` fed by received purchases. Supplier quote does **not** count as a stock receipt or production-ready actual HPP.
- Owner interface shows 30 menu groups, four coffee sizes, material breakdown, supplier quote entry, price/status editing, BOM corrections and marketplace cost simulator.
- Restaurant profit calculations and pricing simulator are planning tools only; no marketplace integration, auto payment, or automatic listing price update.

## 2. Safety / approved assumptions

**Do not activate an SKU solely because the quote simulator shows a margin.**

The seed includes source recipe quantities and the following `UNVERIFIED` packaging assumptions:
- each coffee: 1 correctly sized cup, 1 lid/seal, 1 straw;
- each banana menu: 1 relevant box; sauce cup quantities reflect SOP packing instructions;
- dimsum boxes and sauce cups sourced directly from SOP where specified.

Frying oil absorbed, gas, electricity, labeling, food waste, labor, platform fee rates, merchant discounts, and batch production losses are **not** automatically priced. Owner must confirm supplier receipts and input extra production costs into the simulator. No vendor or channel prices have been invented.

Internal premixes, sauce dips, creamy mentai, syrup, and coffee jelly are treated as intermediate materials in sale BOM. The 8 prep SOPs S01–S08 exist but **actual batch yield and consumption are not yet reconciled with inventory**. For actual commercial HPP, this must be addressed by valid purchased semi-finished supplies or a separate actual batch-production workflow. Never record a fake external purchase for ingredients made internally merely to make costing turn green.

## 3. Daily workflow

1. **Menu & HPP:** choose a recipe group and, for coffee, the actual cup size. Review the seeded BOM and packaging.
2. **Supplier estimate:** choose a BOM material, enter supplier, pack cost, pack quantity and quote date; view HPP estimate. Quotes do not change stock and are not actual costs.
3. **Belanja:** record a real supplier purchase against one material, then confirm receipt. Weighted-average stock cost is recalculated by the server; use consistent `g`, `ml`, or `pcs`.
4. Return to **Menu & HPP**: HPP actual appears only when every direct BOM item has positive actual unit cost. Verify unmodeled production costs separately.
5. Enter an owner-approved price (Rp), then enable only the tested menu. PostgreSQL trigger rejects activation if any BOM material cost is missing/zero, packaging is missing, or an unsized coffee template is selected.
6. For channel profitability, enter **real platform percentage**, fixed fee, merchant-funded discount, additional cost, and contribution target in the calculator. Simulation is not stored as marketplace listing price.

## 4. Verified technical gates

- SQL seed dry-run completed inside `BEGIN/ROLLBACK`: 94 product rows, 45 materials, 634 BOM lines.
- Migration applied to the dedicated Little Treat database and read back with **64 coffee variants, 14 banana/dimsum, 45 materials, 634 BOM lines; zero active products**, zero supplier quotes and zero recorded sales at deployment.
- Owner quote entry returned computed cost per unit, and uncatalogued-cost activation was blocked by database trigger; staff quote read/write was rejected. Tests run in rolled-back transactions; no test price persisted.
- Node22 CI validates exact source quantities, distinct coffee sizes, missing-price calculations, channel fee arithmetic, owner Menu & HPP rendering, and variant selection.
- RLS is enabled on `lt_material_quotes` and cross-app MGBOS databases were not touched.

## 5. Remaining business gates (P0 for selling)

- **Real supplier prices and receipts** for each selected sale SKU, not all 78 simultaneously.
- **Physical sample:** cup sizing, packaging, cooking time, food safety and process yield.
- **In-house batch material cost and yield** for relevant premixes / sauces; current intermediate inventory has no atomic production-batch recording.
- **Final selling prices** for GoFood, GrabFood, ShopeeFood and direct customers, based on actual platform contract. Simulator values are not persisted to order channel pricing.
- Real-browser owner/staff E2E with one order, stock, HPP, waste, and closing before commercial release.

**Recommendation:** prepare and test **D01 — Classic Chicken Dimsum** first. Real supplier quote + goods receipt for four BOM components, then use the market fee simulator to decide the initial price. Do not activate before QA and actual costs.
