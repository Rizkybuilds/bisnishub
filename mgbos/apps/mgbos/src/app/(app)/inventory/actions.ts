'use server';

import { revalidatePath } from 'next/cache';
import { checkPermission } from '@mgbos/auth';
import {
  createInventoryItemSchema,
  recordInventoryMutationSchema,
  performStockOpnameSchema,
} from '@mgbos/validation';
import { inventoryContext } from './data';

export interface InventoryActionResult {
  success?: boolean;
  error?: string;
  inventoryItemId?: string;
  sku?: string;
  status?: string;
}

export async function createInventoryItemAction(
  input: unknown,
): Promise<InventoryActionResult> {
  try {
    const ctx = await inventoryContext();
    const permission = checkPermission(ctx.session, 'inventory:create');
    if (!permission.allowed) return { error: permission.error };

    const parsed = createInventoryItemSchema.safeParse(input);
    if (!parsed.success) {
      return {
        error:
          parsed.error.issues[0]?.message ??
          'Periksa kembali data item persediaan yang diinput.',
      };
    }

    const d = parsed.data;

    const response = await fetch(ctx.endpoint + '/rpc/create_inventory_item', {
      method: 'POST',
      headers: ctx.headers,
      body: JSON.stringify({
        p_organization_id: ctx.session.organization.id,
        p_actor_id: ctx.session.user.id,
        p_brand_id: d.brandId ?? null,
        p_sku: d.sku,
        p_name: d.name,
        p_category: d.category,
        p_unit: d.unit,
        p_attributes: d.attributes,
        p_cost_price: d.costPrice.toString(),
        p_min_stock_alert: d.minStockAlert,
        p_initial_stock: d.initialStock,
        p_location_code: d.locationCode,
        p_bin_location: d.binLocation ?? null,
      }),
    });

    const result: unknown = await response.json();

    if (!response.ok) {
      const err = result as { message?: string; details?: string };
      return {
        error: err.message ?? 'Gagal membuat data master SKU persediaan.',
      };
    }

    revalidatePath('/inventory');
    const data = result as { inventory_item_id?: string; sku?: string };
    return {
      success: true,
      inventoryItemId: data.inventory_item_id,
      sku: data.sku,
    };
  } catch (err) {
    return {
      error:
        err instanceof Error
          ? err.message
          : 'Terjadi kesalahan sistem saat menyimpan item inventori.',
    };
  }
}

export async function recordInventoryMutationAction(
  input: unknown,
): Promise<InventoryActionResult> {
  try {
    const ctx = await inventoryContext();
    const permission = checkPermission(ctx.session, 'inventory:mutate');
    if (!permission.allowed) return { error: permission.error };

    const parsed = recordInventoryMutationSchema.safeParse(input);
    if (!parsed.success) {
      return {
        error:
          parsed.error.issues[0]?.message ??
          'Periksa kembali parameter mutasi stok fisik.',
      };
    }

    const d = parsed.data;

    const response = await fetch(
      ctx.endpoint + '/rpc/record_inventory_mutation',
      {
        method: 'POST',
        headers: ctx.headers,
        body: JSON.stringify({
          p_organization_id: ctx.session.organization.id,
          p_actor_id: ctx.session.user.id,
          p_inventory_item_id: d.inventoryItemId,
          p_mutation_type: d.mutationType,
          p_quantity: d.quantity,
          p_location_code: d.locationCode,
          p_reference_type: d.referenceType ?? null,
          p_reference_id: d.referenceId ?? null,
          p_notes: d.notes ?? null,
        }),
      },
    );

    const result: unknown = await response.json();

    if (!response.ok) {
      const err = result as { message?: string; details?: string };
      return {
        error: err.message ?? 'Gagal mencatat mutasi stok inventori.',
      };
    }

    revalidatePath('/inventory');
    revalidatePath(`/inventory/${d.inventoryItemId}`);
    return {
      success: true,
      inventoryItemId: d.inventoryItemId,
    };
  } catch (err) {
    return {
      error:
        err instanceof Error
          ? err.message
          : 'Terjadi kesalahan saat memproses mutasi stok fisik.',
    };
  }
}

export async function performStockOpnameAction(
  input: unknown,
): Promise<InventoryActionResult> {
  try {
    const ctx = await inventoryContext();
    const permission = checkPermission(ctx.session, 'inventory:opname');
    if (!permission.allowed) return { error: permission.error };

    const parsed = performStockOpnameSchema.safeParse(input);
    if (!parsed.success) {
      return {
        error:
          parsed.error.issues[0]?.message ??
          'Periksa kembali input data stock opname fisik.',
      };
    }

    const d = parsed.data;

    const response = await fetch(ctx.endpoint + '/rpc/perform_stock_opname', {
      method: 'POST',
      headers: ctx.headers,
      body: JSON.stringify({
        p_organization_id: ctx.session.organization.id,
        p_actor_id: ctx.session.user.id,
        p_inventory_item_id: d.inventoryItemId,
        p_actual_physical_count: d.actualPhysicalCount,
        p_location_code: d.locationCode,
        p_reason: d.reason,
      }),
    });

    const result: unknown = await response.json();

    if (!response.ok) {
      const err = result as { message?: string; details?: string };
      return {
        error: err.message ?? 'Gagal melakukan penyesuaian stock opname fisik.',
      };
    }

    revalidatePath('/inventory');
    revalidatePath(`/inventory/${d.inventoryItemId}`);
    return {
      success: true,
      inventoryItemId: d.inventoryItemId,
    };
  } catch (err) {
    return {
      error:
        err instanceof Error
          ? err.message
          : 'Terjadi kesalahan saat mengeksekusi penyesuaian stock opname.',
    };
  }
}
