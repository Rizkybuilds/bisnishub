# LITTLE TREAT KITCHEN OS — OPERATIONAL MVP V3

**State (2026-11-11):** Dedicated Supabase project **ACTIVE_HEALTHY** and v3 schema applied; real owner Auth account is **provisioned and enabled**; staff accounts are not yet provisioned. Database role tests used synthetic users in ROLLBACK-only transactions. No changes to existing MGBOS databases.

## Owner-approved scope, 11 November 2026

1. Owner and staff sign in on separate phones.
2. Staff enter orders from GoFood/GrabFood/ShopeeFood/direct manually, prepare items, and mark completed.
3. Database atomically deducts ingredient/packaging stock and calculates HPP from each menu's bill of materials when order reaches **READY**.
4. Owner records platform discounts/fees and actual payout, logs purchases/asset acquisition, and saves Daily Closing.
5. No automatic payment capture, marketplace API synchronization, or manufacturing/ERP complexity.

## Architecture

- App: existing \`apps/little-treat-kitchen/\`, plus \`ops.html\`, \`ops.js\`, \`ops.css\`, \`ops-config.js\`, and existing \`recipes.js\`.
- Backend: **new dedicated Supabase project** (NOT the dormant \`mgbos-production\` project), PostgreSQL and Supabase Auth REST with publishable key and row level security.
- Database bootstrap: \`ops/sql/bootstrap.sql\`. **NOT EXECUTED**.
- Staff and owner share order and stock views; owner alone can read cost tables, purchase/financials, and closing.
- Server-side atomic RPCs validate membership and role independently of the UI: \`lt_create_order\`, \`lt_transition_order\`, \`lt_record_purchase\`, \`lt_receive_purchase\`, \`lt_record_waste\`, \`lt_close_day\`.
- RPC functions use SECURITY DEFINER only where needed for transaction atomicity, explicitly check membership and role, fully qualify table names, and have execution revoked from anonymous roles.
- Data is **online only**; financial writes are never queued offline or considered successful before server confirmation.
- Browser session tokens are held in per-tab sessionStorage (not a long-term vault). No service-role/secret key in browser.
- No automatic importing of v2 localStorage financial data; importing unverified local transactions into the new financial ledger would be unsafe.

## Setup, in strict order

1. **COMPLETED:** user selected the existing MGBOS organization; creation cost quoted **US$0/month** at provisioning.
2. Create NEW project in \`ap-southeast-1\` (Singapore) and verify active database. Never reactivate or run migrations on the existing MGBOS projects.
3. Review and apply \`ops/sql/bootstrap.sql\` to this new project only. Run SQL readback to confirm 12 RLS-enabled tables, grants, and RPC functions, then Supabase security/performance advisors.
4. **COMPLETED:** owner created Auth account via Supabase Dashboard; verified exactly one new email-confirmed Auth user with password configured. No password was shared in ChatGPT.
5. Add account to \`public.lt_members\` through a privileged SQL editor:
   \`\`\`sql
   insert into public.lt_members(user_id,role,active)
   values ('OWNER_AUTH_UUID'::uuid,'owner',true)
   on conflict(user_id) do update set role='owner',active=true;
   \`\`\`
   This must not be exposed as public signup or called through a service_role key in the browser.
6. Create STAFF accounts one by one and add role \`staff\` using the same SQL with their UID. **Never grant owner merely because an email says so.**
7. Obtain Supabase **Project URL** and **publishable key** (NOT a secret/service role key). Populate \`ops-config.js\` only after checking the new project ID. The publishable key is browser-public by design; RLS is mandatory.
8. **PENDING deployment acceptance:** configure Supabase Auth Site URL and redirect allowlist for the eventual stable domain. Disable open self-registration; provision staff through the Auth admin UI.
9. In owner interface, use **Impor 30 menu dasar**. All 30 are imported inactive at zero price, not permitted for sale. Record prices, materials with consistent units (\`g\`, \`ml\`, \`pcs\`), stock purchases, and BOM per product.
10. Activate only tested products whose BOM and material costs have been provided. Staff log in separately and verify authorization behavior.

## Owner workflow

- **Menu & HPP:** owner imports initial 30 catalog entries as inactive; fills price; registers each ingredient/packaging and per-portion recipe BOM.
- **Belanja:** owner records paid purchase and whether stock already arrived. A paid shipment does not increase on-hand until receipt. Equipment purchase records useful life, residual value, and date put into service.
- **Pesanan:** owner or staff manually enters external order ref, channel, and items. Server captures selling price (gross) at order creation.
- **Produksi:** mark \`Mulai\`, then \`QC selesai → Siap\` *once*. Server locks inventory records, validates stock, deducts all BOM quantities, records stock movements and frozen HPP snapshot in one transaction. If shortage, the whole transition rolls back.
- **Handover:** after packing/driver handoff, mark \`Sudah diserahkan\`.
- **Rekonsiliasi:** owner enters discount actually funded by merchant, platform fee, and other fees based on the real platform statement; marks \`fees_confirmed\`, sets payout received date only after funds really settle.
- **Daily Closing:** owner chooses business date and confirms. Server stores order counts, gross, discounts, fees, HPP, waste costs, operating purchases, purchase payments, and payouts received. Any unverified fees or open orders are flagged; do not call the report final while warnings remain.
- **Penyusutan:** owner view shows monthly straight-line *estimate* for equipment, but daily closing does NOT allocate depreciation/gaji/pajak as expenses; the resulting daily metric is **contribution**, not net profit.

## Employee permissions

| Action | Staff | Owner |
|---|---:|---:|
| Browse all recipes (static) | Yes | Yes |
| Create order; start; ready; handoff; cancel pre-ready | Yes | Yes |
| View material names, quantities and minimum stock | Yes | Yes |
| Report waste (with actor and reason) | Yes | Yes |
| Update prices, BOM, and material master | No | Yes |
| Record purchases, assets, supplier prices | No | Yes |
| Read financials, COGS and Daily Closing | No | Yes |
| Manage Auth users or roles | No | Dashboard/authorized admin only |

Server RLS and explicitly checked RPCs enforce this matrix; hiding UI tabs alone is NOT security.

## Launch acceptance tests (mandatory)

1. Owner and staff can log in on separate real phones, and each account resolves the correct role.
2. Without login, all Data API tables deny private data; staff specifically gets **403 or zero rows** on \`lt_order_financials\`, \`lt_material_costs\`, \`lt_purchases\`, \`lt_daily_closings\`.
3. Staff attempts direct \`PATCH lt_products\`, \`PATCH lt_materials.qty_on_hand\`, and \`PATCH lt_order_financials\` are denied by grants/RLS.
4. Import catalog, configure exactly one product with known BOM, material purchase and cost. Submit order. Verify HPP = sum(ingredient quantity × avg unit cost).
5. Double-tap READY concurrently. Exactly one succeeds; stock deducted once; one financial COGS snapshot and matching moves.
6. Process order with insufficient stock: READY fails, no partial deduction or HPP change, order remains uncompleted.
7. Purchase paid but not received: cash purchase appears, stock quantity does not increase until receipt RPC.
8. Record waste and confirm both stock decrement and daily waste expense.
9. Owner confirms platform statement payout on a different day; Daily Closing shows cash receipts only on payout day.
10. Verify Daily Closing returns a warning count if fees are unverified, and orders still preparing are counted as open.
11. Test expired token refresh, disabled membership, sign-out, slow/offline network, and reload between mobile and desktop.

## Deliberate non-goals and known limitations

- No marketplace API credentials or automatic QRIS checkout. Payment confirmation remains manual.
- No automatic conversion of older v2 local finance records.
- No vendor bills/credit purchases, debt, tax return engine, multi-outlet architecture, lot/FEFO, payroll, or true double-entry accounting.
- Staff cannot edit previously completed orders. Refund/return or mistaken "READY" requires an owner-controlled correction flow in a subsequent work package.
- Product BOM is evaluated at READY; avoid editing recipes while open orders are in production. A later enhancement could snapshot each BOM at order creation.
- Daily Closing is not a complete tax or statutory profit-and-loss report.
- Existing Kitchen OS v2 is still available as a separate static app during the migration; its local-only finance pages are **not** synchronized with v3.

**Release rule:** no production link, no live sales or real finance entries until project provisioning, RLS integration testing and owner acceptance succeed.

## Verified on isolated project (2026-11-11)

- No leftover fixture rows after synthetic tests: all fixture SQL was inside BEGIN/ROLLBACK.
- Test matrix: RLS 12/12; six role-checked RPCs unavailable to anon; staff sees orders and material quantities but zero finance, cost or purchase rows even when populated.
- Restrictive grants: authenticated cannot directly write COGS, stock quantity, order or stock movement tables. Default Supabase grants were detected and explicitly revoked through `little_treat_v3_lockdown_grants`.
- Functional simulation: owner can record paid-but-unreceived purchase, receive exactly once, create order, atomically deduct stock and calculate HPP, record waste, reconcile and close day. Repeated receipt and READY attempt rejected. Financial payout before handoff rejected by trigger.
- **Not yet verified:** live browser sign-in with actual Supabase Auth users, staff vs owner on separate phones, production domain settings, all 30 menu BOM inputs, and real supplier/payout reconciliation. No claim of live launch readiness.

## Account onboarding checkpoint (11 November 2026)

- One real, email-confirmed Supabase Auth user with password set; one active `owner` membership; zero staff accounts.
- Real owner role was exercised under `SET LOCAL ROLE authenticated` with `auth.uid()` impersonation in a transaction that was rolled back. Assertions passed: owner membership visible, ingredient/product/BOM creation allowed, purchasing and receiving allowed, order flow and HPP calculated, payout fees update after handoff allowed.
- There are currently zero real products, orders and purchases in Little Treat's project. All synthetic workflow tests were rolled back.
- **Not yet verified:** actual login via browser with the owner's private password; staff invite and live two-device access checks; Vercel last-updated landing page deployment (free-tier daily deployment limit reached). The existing READY v3 preview at `/ops.html` does reference the correct dedicated Supabase instance and works as a sign-in test target.
- **Next owner action:** sign in on existing READY v3 preview, report whether the `Pesanan` dashboard opens. Never send the account password to ChatGPT.
