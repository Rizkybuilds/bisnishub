import 'server-only';
import { assertPermission } from '@mgbos/auth';
import { requirementContext, readRows } from '../requirements/data';
import type {
  InventoryCategory,
  InventoryMutationType,
  ReservationStatus,
} from '@mgbos/domain';
import {
  calculateAvailableStock,
  calculateInventoryValuation,
} from '@mgbos/domain';

export async function inventoryContext() {
  const ctx = await requirementContext();
  assertPermission(ctx.session, 'inventory:read');
  return ctx;
}

export { readRows };

export interface InventoryItemRow {
  id: string;
  organization_id: string;
  brand_id: string | null;
  sku: string;
  name: string;
  category: InventoryCategory;
  unit: string;
  attributes: Record<string, unknown>;
  cost_price: string;
  min_stock_alert: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface InventoryLevelRow {
  id: string;
  organization_id: string;
  inventory_item_id: string;
  location_code: string;
  bin_location: string | null;
  quantity_on_hand: number;
  quantity_reserved: number;
  created_at: string;
  updated_at: string;
}

export interface InventoryMutationRow {
  id: string;
  organization_id: string;
  inventory_item_id: string;
  location_code: string;
  mutation_type: InventoryMutationType;
  quantity_change: number;
  quantity_on_hand_after: number;
  quantity_reserved_after: number;
  reference_type: string | null;
  reference_id: string | null;
  notes: string | null;
  actor_id: string;
  created_at: string;
  actor?: {
    email: string;
    full_name: string | null;
  };
}

export interface InventoryReservationRow {
  id: string;
  organization_id: string;
  inventory_item_id: string;
  order_id: string;
  order_item_id: string | null;
  location_code: string;
  quantity: number;
  status: ReservationStatus;
  created_at: string;
  updated_at: string;
  order?: {
    order_number: string;
  };
}

export interface InventoryItemWithLevels extends InventoryItemRow {
  levels: InventoryLevelRow[];
  totalOnHand: number;
  totalReserved: number;
  totalAvailable: number;
  isLowStock: boolean;
  totalValuation: bigint;
}

export async function listInventoryItems(categoryFilter?: string): Promise<{
  items: InventoryItemWithLevels[];
  kpis: {
    totalSkus: number;
    totalUnitsOnHand: number;
    totalUnitsReserved: number;
    totalUnitsAvailable: number;
    totalValuation: bigint;
    lowStockSkusCount: number;
  };
}> {
  const ctx = await inventoryContext();

  const queryParams = new URLSearchParams({
    organization_id: `eq.${ctx.session.organization.id}`,
    order: 'sku.asc',
  });

  if (categoryFilter && categoryFilter !== 'ALL') {
    queryParams.set('category', `eq.${categoryFilter}`);
  }

  const [items, levels] = await Promise.all([
    readRows<InventoryItemRow>(
      `inventory_items?${queryParams.toString()}`,
      ctx,
    ),
    readRows<InventoryLevelRow>(
      `inventory_levels?organization_id=eq.${ctx.session.organization.id}`,
      ctx,
    ),
  ]);

  const levelsByItemId = new Map<string, InventoryLevelRow[]>();
  for (const lvl of levels) {
    const list = levelsByItemId.get(lvl.inventory_item_id) ?? [];
    list.push(lvl);
    levelsByItemId.set(lvl.inventory_item_id, list);
  }

  let totalSkus = 0;
  let totalUnitsOnHand = 0;
  let totalUnitsReserved = 0;
  let totalUnitsAvailable = 0;
  let totalValuation = 0n;
  let lowStockSkusCount = 0;

  const itemsWithLevels: InventoryItemWithLevels[] = items.map((item) => {
    totalSkus += 1;
    const itemLevels = levelsByItemId.get(item.id) ?? [];
    let onHand = 0;
    let reserved = 0;

    for (const l of itemLevels) {
      onHand += l.quantity_on_hand;
      reserved += l.quantity_reserved;
    }

    const available = calculateAvailableStock(onHand, reserved);
    const valuation = calculateInventoryValuation(
      onHand,
      BigInt(item.cost_price),
    );
    const isLow = available <= item.min_stock_alert;

    totalUnitsOnHand += onHand;
    totalUnitsReserved += reserved;
    totalUnitsAvailable += available;
    totalValuation += valuation;
    if (isLow) lowStockSkusCount += 1;

    return {
      ...item,
      levels: itemLevels,
      totalOnHand: onHand,
      totalReserved: reserved,
      totalAvailable: available,
      isLowStock: isLow,
      totalValuation: valuation,
    };
  });

  return {
    items: itemsWithLevels,
    kpis: {
      totalSkus,
      totalUnitsOnHand,
      totalUnitsReserved,
      totalUnitsAvailable,
      totalValuation,
      lowStockSkusCount,
    },
  };
}

export async function getInventoryItemDetail(itemId: string): Promise<{
  item: InventoryItemRow;
  levels: InventoryLevelRow[];
  mutations: InventoryMutationRow[];
  reservations: InventoryReservationRow[];
  totalOnHand: number;
  totalReserved: number;
  totalAvailable: number;
  totalValuation: bigint;
  isLowStock: boolean;
} | null> {
  const ctx = await inventoryContext();

  const items = await readRows<InventoryItemRow>(
    `inventory_items?id=eq.${itemId}&organization_id=eq.${ctx.session.organization.id}&limit=1`,
    ctx,
  );
  const item = items[0];
  if (!item) return null;

  const [levels, mutations, reservations] = await Promise.all([
    readRows<InventoryLevelRow>(
      `inventory_levels?inventory_item_id=eq.${itemId}&organization_id=eq.${ctx.session.organization.id}&order=location_code.asc`,
      ctx,
    ),
    readRows<InventoryMutationRow>(
      `inventory_mutations?inventory_item_id=eq.${itemId}&organization_id=eq.${ctx.session.organization.id}&order=created_at.desc&limit=50`,
      ctx,
    ),
    readRows<InventoryReservationRow>(
      `inventory_reservations?inventory_item_id=eq.${itemId}&organization_id=eq.${ctx.session.organization.id}&order=created_at.desc&limit=20`,
      ctx,
    ),
  ]);

  let onHand = 0;
  let reserved = 0;
  for (const l of levels) {
    onHand += l.quantity_on_hand;
    reserved += l.quantity_reserved;
  }

  const available = calculateAvailableStock(onHand, reserved);
  const valuation = calculateInventoryValuation(
    onHand,
    BigInt(item.cost_price),
  );
  const isLow = available <= item.min_stock_alert;

  return {
    item,
    levels,
    mutations,
    reservations,
    totalOnHand: onHand,
    totalReserved: reserved,
    totalAvailable: available,
    totalValuation: valuation,
    isLowStock: isLow,
  };
}
