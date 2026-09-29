'use server';

import { revalidatePath } from 'next/cache';
import { checkPermission } from '@mgbos/auth';
import {
  createPurchaseOrderSchema,
  receivePurchaseOrderSchema,
  payVendorBillSchema,
} from '@mgbos/validation';
import { procurementContext } from './data';

export interface ProcurementActionResult {
  success?: boolean;
  error?: string;
  purchaseOrderId?: string;
  poNumber?: string;
  goodsReceiptId?: string;
  receiptNumber?: string;
  vendorBillId?: string;
  status?: string;
}

export async function createPurchaseOrderAction(
  input: unknown,
): Promise<ProcurementActionResult> {
  try {
    const ctx = await procurementContext();
    const permission = checkPermission(ctx.session, 'procurement:create');
    if (!permission.allowed) return { error: permission.error };

    const parsed = createPurchaseOrderSchema.safeParse(input);
    if (!parsed.success) {
      return {
        error:
          parsed.error.issues[0]?.message ??
          'Periksa kembali data Purchase Order.',
      };
    }

    const d = parsed.data;

    const response = await fetch(ctx.endpoint + '/rpc/create_purchase_order', {
      method: 'POST',
      headers: ctx.headers,
      body: JSON.stringify({
        p_organization_id: ctx.session.organization.id,
        p_actor_id: ctx.session.user.id,
        p_brand_id: d.brandId ?? null,
        p_vendor_id: d.vendorId,
        p_items: d.items.map((i) => ({
          inventory_item_id: i.inventoryItemId,
          quantity: i.quantity,
          unit_cost: i.unitCost.toString(),
          notes: i.notes ?? null,
        })),
        p_expected_delivery_date: d.expectedDeliveryDate || null,
        p_shipping_cost: d.shippingCost.toString(),
        p_payment_terms: d.paymentTerms,
        p_notes: d.notes ?? null,
      }),
    });

    const result: unknown = await response.json();

    if (!response.ok) {
      const err = result as { message?: string; details?: string };
      return {
        error: err.message ?? 'Gagal membuat Purchase Order baru.',
      };
    }

    revalidatePath('/procurement');
    const data = result as {
      purchase_order_id?: string;
      po_number?: string;
      status?: string;
    };
    return {
      success: true,
      purchaseOrderId: data.purchase_order_id,
      poNumber: data.po_number,
      status: data.status,
    };
  } catch (err) {
    return {
      error:
        err instanceof Error
          ? err.message
          : 'Terjadi kesalahan sistem saat membuat Purchase Order.',
    };
  }
}

export async function receivePurchaseOrderAction(
  input: unknown,
): Promise<ProcurementActionResult> {
  try {
    const ctx = await procurementContext();
    const permission = checkPermission(ctx.session, 'procurement:receive');
    if (!permission.allowed) return { error: permission.error };

    const parsed = receivePurchaseOrderSchema.safeParse(input);
    if (!parsed.success) {
      return {
        error:
          parsed.error.issues[0]?.message ??
          'Periksa kembali rincian barang yang diterima.',
      };
    }

    const d = parsed.data;

    const response = await fetch(
      ctx.endpoint + '/rpc/receive_purchase_order_items',
      {
        method: 'POST',
        headers: ctx.headers,
        body: JSON.stringify({
          p_organization_id: ctx.session.organization.id,
          p_actor_id: ctx.session.user.id,
          p_purchase_order_id: d.purchaseOrderId,
          p_items: d.items.map((i) => ({
            purchase_order_item_id: i.purchaseOrderItemId,
            quantity_accepted: i.quantityAccepted,
            quantity_rejected: i.quantityRejected,
            rejection_reason: i.rejectionReason ?? null,
            notes: i.notes ?? null,
          })),
          p_vendor_delivery_note: d.vendorDeliveryNote ?? null,
          p_location_code: d.locationCode,
          p_notes: d.notes ?? null,
        }),
      },
    );

    const result: unknown = await response.json();

    if (!response.ok) {
      const err = result as { message?: string; details?: string };
      return {
        error: err.message ?? 'Gagal mencatat penerimaan barang gudang.',
      };
    }

    revalidatePath('/procurement');
    revalidatePath(`/procurement/${d.purchaseOrderId}`);
    revalidatePath('/inventory');

    const data = result as {
      goods_receipt_id?: string;
      receipt_number?: string;
      po_status?: string;
      vendor_bill_id?: string;
    };

    return {
      success: true,
      purchaseOrderId: d.purchaseOrderId,
      goodsReceiptId: data.goods_receipt_id,
      receiptNumber: data.receipt_number,
      vendorBillId: data.vendor_bill_id,
      status: data.po_status,
    };
  } catch (err) {
    return {
      error:
        err instanceof Error
          ? err.message
          : 'Terjadi kesalahan sistem saat memproses penerimaan barang.',
    };
  }
}

export async function payVendorBillAction(
  input: unknown,
): Promise<ProcurementActionResult> {
  try {
    const ctx = await procurementContext();
    const permission = checkPermission(ctx.session, 'procurement:pay');
    if (!permission.allowed) return { error: permission.error };

    const parsed = payVendorBillSchema.safeParse(input);
    if (!parsed.success) {
      return {
        error:
          parsed.error.issues[0]?.message ??
          'Periksa kembali data pembayaran tagihan vendor.',
      };
    }

    const d = parsed.data;

    const response = await fetch(ctx.endpoint + '/rpc/pay_vendor_bill', {
      method: 'POST',
      headers: ctx.headers,
      body: JSON.stringify({
        p_organization_id: ctx.session.organization.id,
        p_actor_id: ctx.session.user.id,
        p_vendor_bill_id: d.vendorBillId,
        p_amount: d.amount.toString(),
        p_payment_method: d.paymentMethod,
        p_source_bank: d.sourceBank ?? null,
        p_source_account_number: d.sourceAccountNumber ?? null,
        p_reference_number: d.referenceNumber ?? null,
        p_notes: d.notes ?? null,
      }),
    });

    const result: unknown = await response.json();

    if (!response.ok) {
      const err = result as { message?: string; details?: string };
      return {
        error: err.message ?? 'Gagal mencatat pembayaran tagihan vendor.',
      };
    }

    revalidatePath('/procurement');
    revalidatePath('/ledger');

    return {
      success: true,
      vendorBillId: d.vendorBillId,
    };
  } catch (err) {
    return {
      error:
        err instanceof Error
          ? err.message
          : 'Terjadi kesalahan sistem saat membukukan pembayaran vendor.',
    };
  }
}
