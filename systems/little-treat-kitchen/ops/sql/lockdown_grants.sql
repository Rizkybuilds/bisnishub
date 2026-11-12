-- Little Treat v3: explicit privilege lockdown after Supabase default grants.
-- Only applies to lt_ tables on dedicated project ujmojkgipvckwdegcoph.
revoke all privileges on table public.lt_members, public.lt_products, public.lt_materials, public.lt_material_costs, public.lt_bom, public.lt_orders, public.lt_order_items, public.lt_order_financials, public.lt_stock_moves, public.lt_purchases, public.lt_waste_events, public.lt_daily_closings from PUBLIC, anon, authenticated;
grant select on table public.lt_members, public.lt_products, public.lt_materials, public.lt_material_costs, public.lt_bom, public.lt_orders, public.lt_order_items, public.lt_order_financials, public.lt_stock_moves, public.lt_purchases, public.lt_waste_events, public.lt_daily_closings to authenticated;
-- Membership and all other row privacy still enforced through RLS.
grant insert,update,delete on public.lt_products,public.lt_bom to authenticated;
grant insert on public.lt_materials to authenticated;
grant update(name,unit,min_stock,active) on public.lt_materials to authenticated;
grant update(discount,platform_fee,other_fee,fees_confirmed,payout_received_at,updated_at)
  on public.lt_order_financials to authenticated;
-- Owner-only RLS gates are still mandatory for the above mutations.
