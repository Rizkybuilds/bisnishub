-- Migration: 20261008140000_payment_rpc_boundary_hardening.sql
-- Description: SEC-01 Payment and Retail Order RPC Boundary Hardening
-- Context: Revoke EXECUTE privileges from PUBLIC, anon, and authenticated roles
--          on financial mutation and retail ordering stored procedures.
--          Preserve EXECUTE strictly for service_role (trusted server-side commands).

-- 1. Payment Actor Role Helper
revoke all on function app.payment_actor_role(uuid, uuid)
  from public, anon, authenticated, service_role;

grant execute on function app.payment_actor_role(uuid, uuid)
  to service_role;

-- 2. Payment Recording & Allocation Procedure
revoke all on function app.record_payment_and_allocate(
  uuid, uuid, uuid, text, bigint, date, text, text, text, text, text, text, text, text, jsonb, uuid
) from public, anon, authenticated, service_role;

grant execute on function app.record_payment_and_allocate(
  uuid, uuid, uuid, text, bigint, date, text, text, text, text, text, text, text, text, jsonb, uuid
) to service_role;

-- 3. Payment Allocation Procedure
revoke all on function app.allocate_existing_payment(
  uuid, uuid, uuid, uuid, bigint, text
) from public, anon, authenticated, service_role;

grant execute on function app.allocate_existing_payment(
  uuid, uuid, uuid, uuid, bigint, text
) to service_role;

-- 4. Payment Reversal Procedure
revoke all on function app.revert_payment(
  uuid, uuid, uuid, text
) from public, anon, authenticated, service_role;

grant execute on function app.revert_payment(
  uuid, uuid, uuid, text
) to service_role;

-- 5. Fast Retail Ordering Procedure (including auto_pay nested payment path)
revoke all on function app.create_retail_order(
  uuid, uuid, uuid, uuid, jsonb, uuid, jsonb, bigint, text, boolean, text, text, text
) from public, anon, authenticated, service_role;

grant execute on function app.create_retail_order(
  uuid, uuid, uuid, uuid, jsonb, uuid, jsonb, bigint, text, boolean, text, text, text
) to service_role;
