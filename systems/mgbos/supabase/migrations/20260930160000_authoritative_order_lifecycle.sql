-- Migration: 20260930160000_authoritative_order_lifecycle.sql
-- Description: MGBOS Phase 1 P0-02 Authoritative Order Lifecycle Enforcement
-- Specification: MultiGraph Business OS — Sprint 5 / Phase 1 Operating Spine Backlog P0-02
--
-- Enforces canonical order transitions:
--   DRAFT     -> CONFIRMED, CANCELLED
--   CONFIRMED -> ACTIVE, ON_HOLD, CANCELLED
--   ACTIVE    -> ON_HOLD, COMPLETED, CANCELLED
--   ON_HOLD   -> ACTIVE, CANCELLED
--   COMPLETED -> terminal (immutable)
--   CANCELLED -> terminal (immutable)
--
-- Completion Guard (ACTIVE -> COMPLETED):
--   1. All linked production jobs must be COMPLETED or CANCELLED (no unfinished jobs).
--   2. All linked shipments must be DELIVERED or CANCELLED (no open/in-transit shipments).
--   3. All active commercial invoices must be PAID (conservative launch-safe financial policy).
--
-- Security:
--   - Restricted to OWNER and ADMIN roles within the active organization.
--   - Immutable audit trail recorded in app.order_audit.
--   - Row-level locking (FOR UPDATE) to prevent concurrency races.

begin;

-- ============================================================================
-- 1. Helper function: order actor role
-- ============================================================================
create or replace function app.order_actor_role(
  p_organization_id uuid,
  p_actor_id uuid
) returns text language sql stable security definer set search_path=app,pg_temp as $$
  select r.code
  from app.organization_members om
  join app.roles r on r.id = om.role_id
  join app.users u on u.id = om.user_id
  join app.organizations o on o.id = om.organization_id
  where om.organization_id = p_organization_id
    and om.user_id = p_actor_id
    and om.status = 'ACTIVE'
    and u.status = 'ACTIVE'
    and o.status = 'ACTIVE'
  limit 1;
$$;

-- ============================================================================
-- 2. Stored procedure: transition_order_status
-- ============================================================================
create or replace function app.transition_order_status(
  p_organization_id uuid,
  p_actor_id uuid,
  p_order_id uuid,
  p_target_status text,
  p_reason text default null
) returns jsonb language plpgsql security definer set search_path=app,pg_temp as $$
declare
  v_role text;
  v_order app.orders%rowtype;
  v_target_clean text;
  v_open_jobs integer;
  v_open_shipments integer;
  v_unpaid_invoices integer;
begin
  -- 1. Actor authorization & active organization isolation (AC-05, AC-06)
  v_role := app.order_actor_role(p_organization_id, p_actor_id);
  if v_role not in ('OWNER', 'ADMIN') then
    raise exception 'Unauthorized to update order status';
  end if;

  v_target_clean := upper(trim(coalesce(p_target_status, '')));
  if v_target_clean not in ('DRAFT', 'CONFIRMED', 'ACTIVE', 'ON_HOLD', 'COMPLETED', 'CANCELLED') then
    raise exception 'Invalid target order status: %', p_target_status;
  end if;

  if p_reason is not null and length(p_reason) > 1000 then
    raise exception 'Transition reason exceeds maximum 1000 characters';
  end if;

  -- 2. Lock Order row (Required Guards: current Order locked)
  select * into v_order
  from app.orders
  where id = p_order_id and organization_id = p_organization_id
  for update;

  if not found then
    raise exception 'Order % not found in organization', p_order_id;
  end if;

  -- 3. Idempotent no-op check
  if v_order.status = v_target_clean then
    return jsonb_build_object(
      'order_id', v_order.id,
      'order_number', v_order.order_number,
      'previous_status', v_order.status,
      'new_status', v_order.status,
      'is_no_op', true
    );
  end if;

  -- 4. Terminal state protection (AC-03, AC-04)
  if v_order.status = 'COMPLETED' then
    raise exception 'Order % is in terminal status COMPLETED and cannot be transitioned', v_order.order_number;
  end if;

  if v_order.status = 'CANCELLED' then
    raise exception 'Order % is in terminal status CANCELLED and cannot be transitioned', v_order.order_number;
  end if;

  -- 5. Canonical transition graph validation (AC-01, AC-02)
  if v_order.status = 'DRAFT' and v_target_clean not in ('CONFIRMED', 'CANCELLED') then
    raise exception 'Illegal order status transition from % to %', v_order.status, v_target_clean;
  elsif v_order.status = 'CONFIRMED' and v_target_clean not in ('ACTIVE', 'ON_HOLD', 'CANCELLED') then
    raise exception 'Illegal order status transition from % to %', v_order.status, v_target_clean;
  elsif v_order.status = 'ACTIVE' and v_target_clean not in ('ON_HOLD', 'COMPLETED', 'CANCELLED') then
    raise exception 'Illegal order status transition from % to %', v_order.status, v_target_clean;
  elsif v_order.status = 'ON_HOLD' and v_target_clean not in ('ACTIVE', 'CANCELLED') then
    raise exception 'Illegal order status transition from % to %', v_order.status, v_target_clean;
  end if;

  -- 6. Completion Guards (ACTIVE -> COMPLETED) (AC-07, AC-08)
  if v_target_clean = 'COMPLETED' then
    -- A. Operational: Production jobs must be completed or cancelled
    select count(*) into v_open_jobs
    from app.production_jobs
    where order_id = v_order.id
      and status not in ('COMPLETED', 'CANCELLED');

    if v_open_jobs > 0 then
      raise exception 'Cannot complete order: % active production job(s) remain unfinished', v_open_jobs;
    end if;

    -- B. Operational: Fulfillment shipments must be delivered or cancelled
    select count(*) into v_open_shipments
    from app.shipments
    where order_id = v_order.id
      and status not in ('DELIVERED', 'CANCELLED');

    if v_open_shipments > 0 then
      raise exception 'Cannot complete order: % delivery order(s) remain undelivered or pending resolution', v_open_shipments;
    end if;

    -- C. Financial: All issued commercial invoices must be PAID (or VOID/CANCELLED)
    select count(*) into v_unpaid_invoices
    from app.invoices
    where order_id = v_order.id
      and status not in ('PAID', 'VOID', 'CANCELLED');

    if v_unpaid_invoices > 0 then
      raise exception 'Cannot complete order: % commercial invoice(s) remain unpaid or pending settlement', v_unpaid_invoices;
    end if;
  end if;

  -- 7. Execute status update
  update app.orders
  set status = v_target_clean,
      updated_at = now()
  where id = v_order.id;

  -- 8. Write audit trail (AC-09)
  insert into app.order_audit (
    organization_id,
    order_id,
    actor_id,
    action,
    details
  ) values (
    p_organization_id,
    v_order.id,
    p_actor_id,
    'order.status_transitioned',
    jsonb_build_object(
      'from_status', v_order.status,
      'to_status', v_target_clean,
      'reason', p_reason
    )
  );

  return jsonb_build_object(
    'order_id', v_order.id,
    'order_number', v_order.order_number,
    'previous_status', v_order.status,
    'new_status', v_target_clean,
    'is_no_op', false
  );
end; $$;

-- ============================================================================
-- 3. Permissions & Grants
-- ============================================================================
revoke all on function app.order_actor_role(uuid,uuid), app.transition_order_status(uuid,uuid,uuid,text,text) from public,anon,authenticated,service_role;
grant execute on function app.order_actor_role(uuid,uuid), app.transition_order_status(uuid,uuid,uuid,text,text) to service_role;

commit;
