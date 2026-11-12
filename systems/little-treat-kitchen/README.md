# Little Treat Kitchen OS v3 — Canonical Source

**Production UI:** https://rizkybuilds.github.io/bisnishub/  
**Source:** `main/systems/little-treat-kitchen/`  
**Publication branch:** `gh-pages` (root directory).  
**Backend:** dedicated Supabase project `little-treat-kitchen`. Never use the MGBOS database.

## Operational modules

- Supabase Auth sign-in, active `lt_members` owner/staff authorization.
- Mobile queue: new → preparing → ready → handed off or cancelled.
- 30 recipe identities (16 coffee with four cup sizes, 9 banana, 5 dimsum), preparation and safety SOP.
- Inventory, purchase receipts, waste and stock movement records.
- Owner-only Menu & HPP, supplier-price planning, order finance, payout receipts and daily closing.
- Server-side mutation retry protection via UUID for purchases, waste, orders and payouts.

## Not yet ready for commercial launch

As of 2026-11-12 the database contains 94 product rows (16 unsized legacy coffee templates, 78 sellable variants) but no active items, positive product prices or actual material costs. Do not bypass activation guards. Supplier purchase receipts, production yield, packaging and preparation validation are required before activating items. Real operator/staff two-device E2E is still a manual acceptance gate.

## Release

See [RELEASE.md](RELEASE.md) for the **allowlisted** static files used in the GitHub Pages build and the mandatory CI/health checks. Do not deploy `legacy.html`, local finance storage code, SQL migrations, test fixtures or credentials to public Pages. A publishable Supabase key is public by design; all sensitive access is enforced in DB RLS/RPC guards.

### Tests

```sh
node --test systems/little-treat-kitchen/catalog.test.cjs systems/little-treat-kitchen/finance.test.cjs systems/little-treat-kitchen/stock.test.cjs systems/little-treat-kitchen/ops.test.cjs systems/little-treat-kitchen/ops-ui.test.cjs systems/little-treat-kitchen/ops-integrity.test.cjs systems/little-treat-kitchen/menu-costing.test.cjs systems/little-treat-kitchen/menu-costing-ui.test.cjs systems/little-treat-kitchen/release-gates.test.cjs
```

Before sales, confirm dimsum supplier status/cooking calibration, recipe gramation, allergens, packaging, cost inputs and real two-phone owner/staff flow. Production entries must remain authentic, never invent test purchases or orders.
