# Audit hardening migration

Apply 20260922_audit_hardening.sql followed by 20260923_transaction_guards.sql to a backed-up staging database first. Do not deploy the updated application or functions before both migrations are applied. These migrations do not delete historical orders.

1. Export schema and business data and verify restore separately.
2. Confirm the founder has an admin profile in ts_user_profiles.
3. Run the migration in a transaction.
4. Verify anonymous clients cannot mutate orders, catalog, inventory, settings or cash ledger.
5. Verify manual payment confirmation and duplicate webhook delivery create one set of cash postings.
6. Verify insufficient stock rolls back the entire production transition.
7. Deploy create-checkout and midtrans-webhook, then both web apps.

Historical orders retain an unpaid payment_status until independently reconciled. Do not bulk mark them paid: existing cash postings must be reconciled first to prevent duplication. Refund accounting and historic shipping breakdowns require separate reconciliation.

Historical rows are marked payment_reconciliation_required. New rows default to false. The payment RPC and cash trigger reject posting against flagged rows; reconciliation must verify existing ledger entries before clearing that flag.

Local verification (23 September 2026): npm run test:database in apps/bisnishub-web executes both actual migrations against PGlite and passes 14 authorization, payment, inventory, procurement and cancellation scenarios. This does not replace staging verification of Supabase Auth, deployed policies, gateway delivery, or concurrent database connections. No production migration has been applied in this work.

The second migration locks procurement updates/deletes because insertion posts stock and cash immediately. A reversal workflow is not yet implemented. Manual cancellation only supports unpaid, unproduced manual orders without historical reconciliation flags. Gateway cancellations must be handled through the payment provider; paid/produced orders require separate refund and inventory reconciliation.

The legacy schema.sql is a destructive development reset and now refuses to run unless an operator explicitly enables bisnishub.allow_reset. Never use it as a production migration.
