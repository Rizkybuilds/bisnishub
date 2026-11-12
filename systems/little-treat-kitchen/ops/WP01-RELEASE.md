# Little Treat Kitchen OS — WP-01 Transaction Integrity

**State:** completed in feature code + database; verification ongoing for public browser hosting and real-device E2E.  
**Date:** 11 November 2026  
**Scope:** only project `ujmojkgipvckwdegcoph`, not MGBOS database.  
**Implementation PR:** [#115](https://github.com/Rizkybuilds/bisnishub/pull/115)

## Deployed database (additive, no reset)

Migration `little_treat_wp01_idempotent_operations_actual_cash` applied successfully to the Little Treat Supabase project. New tables `lt_mutation_receipts` (private, no direct user grants, RLS enabled) and `lt_payout_receipts` (owner read only, RLS enabled). New authenticated RPCs are role-checked:

- `lt_create_order_v2`, `lt_record_purchase_v2`, `lt_record_waste_v2` — idempotent request UUID, canonical payload digest, single committed result. All related stock and cost writes are atomic.
- `lt_record_payout` — owner-only actual bank receipt (GoFood, GrabFood, ShopeeFood, Lainnya) keyed by channel + statement reference, no future dates, only positive amount.
- `lt_close_day` now calculates `payouts_received` from actual `lt_payout_receipts.amount` on `received_on`. It NO LONGER derives cash receipts from per-order sales less fees.

Historical per-order `payout_received_at` is preserved (not erased), but is no longer an authoritative source of bank receipts. The old RPC endpoints remain callable **temporarily** for compatibility with cached/older frontend versions; they do not provide the new request-ID idempotency guarantee. Do not use legacy preview for recording real purchases/waste/orders.

## Frontend

`ops.js` uses SHA-256 hash of the submitted body + a random request UUID scoped by user ID and transaction type. Only hash + UUID is retained in `sessionStorage` for uncertain requests; passwords, tokens and full financial forms are not stored in the pending ledger. If the same request is retried after a lost response, the server returns the same committed result. A changed request body is blocked until operator verifies history and clears the pending entry.

`transact()` now treats commit success and follow-up refresh independently. A failed refresh after commit shows an affirmative **already saved, refresh pending** notice, not a generic write failure. Form fields are retained in current tab memory on uncertain network results. Payout has its own owner form and bank statement reference instead of being treated as order-level payout date.

**GitHub Pages source:** `gh-pages/ops.js` updated to the tested WP-01 client. The public GitHub Pages HTTP URL has not been independently verified from the connector environment; if Pages is not enabled, configure Pages branch `gh-pages`, root directory. No Vercel deployment or production promotion was attempted for this package.

## Evidence and acceptance

- Test SQL was run inside `BEGIN ... ROLLBACK` before application. Assertions covered double purchase, double waste, duplicate order, duplicate payout reference, mismatched reuse of an idempotency UUID, actual-cash closing, and staff payout denial.
- Migration was applied successfully and listed in Supabase migrations; readback showed 2/2 new tables had RLS and 4/4 new authenticated RPCs denied `anon` execution.
- Immediately after migration: 30 products preserved, 0 order rows, 0 purchases, 0 cash receipts, 0 mutation receipts.
- `ops-integrity.test.cjs` plus existing Kitchen OS CI passed on PR #115's implementation head.
- Advisors remain: authenticated SECURITY DEFINER functions are warned, and Auth leaked-password protection is not enabled. New private receipt table intentionally has RLS with no policies. Index tuning is subsequent work.
- **Not yet signed off:** device-to-device real user flow, staff invite/login, browser-level reconciliation of actual bank payout, and GitHub Pages live URL verification. No claim of production readiness.

## Safe next steps

1. Verify GitHub Pages UI loads the WP-01 version (look for a new **Payout aktual** form under Daily Closing).
2. Simulate one order and one verified payout with fixture values before using real money data. Actual money must match bank statement.
3. Provision one staff account and verify it cannot see the new payout ledger.
4. After every active user/browser is on the WP-01 UI, revoke older non-idempotent order/purchase/waste endpoints, subject to a focused compatibility check.
