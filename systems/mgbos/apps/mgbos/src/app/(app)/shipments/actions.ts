'use server';

import { revalidatePath } from 'next/cache';
import { checkPermission } from '@mgbos/auth';
import {
  createDeliveryOrderSchema,
  dispatchShipmentSchema,
  markShipmentDeliveredSchema,
  cancelShipmentSchema,
} from '@mgbos/validation';
import { shipmentContext } from './data';

export interface ShipmentActionResult {
  success?: boolean;
  error?: string;
  shipmentId?: string;
  shipmentNumber?: string;
  status?: string;
}

export async function createDeliveryOrderAction(
  input: unknown,
): Promise<ShipmentActionResult> {
  try {
    const ctx = await shipmentContext();
    const permission = checkPermission(ctx.session, 'shipments:create');
    if (!permission.allowed) return { error: permission.error };

    const parsed = createDeliveryOrderSchema.safeParse(input);
    if (!parsed.success) {
      return {
        error:
          parsed.error.issues[0]?.message ??
          'Periksa data pembuatan Surat Jalan (Delivery Order).',
      };
    }

    const d = parsed.data;

    const response = await fetch(ctx.endpoint + '/rpc/create_delivery_order', {
      method: 'POST',
      headers: ctx.headers,
      body: JSON.stringify({
        p_organization_id: ctx.session.organization.id,
        p_actor_id: ctx.session.user.id,
        p_order_id: d.orderId,
        p_courier_name: d.courierName,
        p_courier_service: d.courierService ?? null,
        p_items: d.items.map((i) => ({
          order_item_id: i.orderItemId,
          quantity: i.quantity,
          notes: i.notes ?? null,
        })),
        p_package_weight_grams: d.packageWeightGrams ?? null,
        p_package_count: d.packageCount ?? 1,
        p_notes: d.notes ?? null,
      }),
    });

    const result: unknown = await response.json();
    if (!response.ok) {
      return {
        error:
          result && typeof result === 'object' && 'message' in result
            ? String(result.message)
            : 'Gagal membuat Surat Jalan (Delivery Order).',
      };
    }

    if (!result || typeof result !== 'object' || !('shipment_id' in result)) {
      return { error: 'Respons pembuatan Surat Jalan tidak valid.' };
    }

    const data = result as { shipment_id: string; shipment_number: string };

    revalidatePath('/shipments');
    revalidatePath(`/orders/${d.orderId}`);

    return {
      success: true,
      shipmentId: data.shipment_id,
      shipmentNumber: data.shipment_number,
    };
  } catch {
    return {
      error: 'Koneksi gagal saat membuat Surat Jalan. Coba lagi.',
    };
  }
}

export async function dispatchShipmentAction(
  input: unknown,
): Promise<ShipmentActionResult> {
  try {
    const ctx = await shipmentContext();
    const permission = checkPermission(ctx.session, 'shipments:dispatch');
    if (!permission.allowed) return { error: permission.error };

    const parsed = dispatchShipmentSchema.safeParse(input);
    if (!parsed.success) {
      return {
        error:
          parsed.error.issues[0]?.message ??
          'Periksa data serah terima / dispatch pengiriman.',
      };
    }

    const d = parsed.data;

    const response = await fetch(ctx.endpoint + '/rpc/dispatch_shipment', {
      method: 'POST',
      headers: ctx.headers,
      body: JSON.stringify({
        p_organization_id: ctx.session.organization.id,
        p_actor_id: ctx.session.user.id,
        p_shipment_id: d.shipmentId,
        p_tracking_number: d.trackingNumber ?? null,
        p_actual_shipping_cost:
          d.actualShippingCost !== undefined
            ? d.actualShippingCost.toString()
            : null,
        p_notes: d.notes ?? null,
      }),
    });

    const result: unknown = await response.json();
    if (!response.ok) {
      return {
        error:
          result && typeof result === 'object' && 'message' in result
            ? String(result.message)
            : 'Gagal memproses dispatch pengiriman.',
      };
    }

    if (!result || typeof result !== 'object' || !('shipment_id' in result)) {
      return { error: 'Respons dispatch pengiriman tidak valid.' };
    }

    const data = result as {
      shipment_id: string;
      shipment_number: string;
      status: string;
    };

    revalidatePath('/shipments');
    revalidatePath(`/shipments/${d.shipmentId}`);
    revalidatePath('/orders');
    revalidatePath('/ledger');

    return {
      success: true,
      shipmentId: data.shipment_id,
      shipmentNumber: data.shipment_number,
      status: data.status,
    };
  } catch {
    return {
      error: 'Koneksi gagal saat memproses dispatch pengiriman. Coba lagi.',
    };
  }
}

export async function markShipmentDeliveredAction(
  input: unknown,
): Promise<ShipmentActionResult> {
  try {
    const ctx = await shipmentContext();
    const permission = checkPermission(ctx.session, 'shipments:dispatch');
    if (!permission.allowed) return { error: permission.error };

    const parsed = markShipmentDeliveredSchema.safeParse(input);
    if (!parsed.success) {
      return {
        error:
          parsed.error.issues[0]?.message ??
          'Periksa data konfirmasi paket diterima.',
      };
    }

    const d = parsed.data;
    const combinedNotes = d.notes
      ? d.receivedBy
        ? `[Penerima: ${d.receivedBy}] ${d.notes}`
        : d.notes
      : d.receivedBy
        ? `[Penerima: ${d.receivedBy}]`
        : null;

    const response = await fetch(
      ctx.endpoint + '/rpc/mark_shipment_delivered',
      {
        method: 'POST',
        headers: ctx.headers,
        body: JSON.stringify({
          p_organization_id: ctx.session.organization.id,
          p_actor_id: ctx.session.user.id,
          p_shipment_id: d.shipmentId,
          p_delivered_date: d.deliveredDate ?? null,
          p_notes: combinedNotes,
        }),
      },
    );

    const result: unknown = await response.json();
    if (!response.ok) {
      return {
        error:
          result && typeof result === 'object' && 'message' in result
            ? String(result.message)
            : 'Gagal mengonfirmasi status terkirim.',
      };
    }

    if (!result || typeof result !== 'object' || !('shipment_id' in result)) {
      return { error: 'Respons konfirmasi terkirim tidak valid.' };
    }

    const data = result as {
      shipment_id: string;
      shipment_number: string;
      status: string;
    };

    revalidatePath('/shipments');
    revalidatePath(`/shipments/${d.shipmentId}`);
    revalidatePath('/orders');

    return {
      success: true,
      shipmentId: data.shipment_id,
      shipmentNumber: data.shipment_number,
      status: data.status,
    };
  } catch {
    return {
      error: 'Koneksi gagal saat mengonfirmasi status terkirim. Coba lagi.',
    };
  }
}

export async function cancelShipmentAction(
  input: unknown,
): Promise<ShipmentActionResult> {
  try {
    const ctx = await shipmentContext();
    const permission = checkPermission(ctx.session, 'shipments:cancel');
    if (!permission.allowed) return { error: permission.error };

    const parsed = cancelShipmentSchema.safeParse(input);
    if (!parsed.success) {
      return {
        error:
          parsed.error.issues[0]?.message ??
          'Periksa data pembatalan pengiriman.',
      };
    }

    const d = parsed.data;

    const response = await fetch(ctx.endpoint + '/rpc/cancel_shipment', {
      method: 'POST',
      headers: ctx.headers,
      body: JSON.stringify({
        p_organization_id: ctx.session.organization.id,
        p_actor_id: ctx.session.user.id,
        p_shipment_id: d.shipmentId,
        p_reason: d.reason,
      }),
    });

    const result: unknown = await response.json();
    if (!response.ok) {
      return {
        error:
          result && typeof result === 'object' && 'message' in result
            ? String(result.message)
            : 'Gagal membatalkan pengiriman.',
      };
    }

    if (!result || typeof result !== 'object' || !('shipment_id' in result)) {
      return { error: 'Respons pembatalan tidak valid.' };
    }

    const data = result as {
      shipment_id: string;
      shipment_number: string;
      status: string;
    };

    revalidatePath('/shipments');
    revalidatePath(`/shipments/${d.shipmentId}`);
    revalidatePath('/orders');

    return {
      success: true,
      shipmentId: data.shipment_id,
      shipmentNumber: data.shipment_number,
      status: data.status,
    };
  } catch {
    return {
      error: 'Koneksi gagal saat membatalkan pengiriman. Coba lagi.',
    };
  }
}
