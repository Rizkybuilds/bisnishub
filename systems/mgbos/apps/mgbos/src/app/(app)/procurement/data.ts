import 'server-only';
import { assertPermission } from '@mgbos/auth';
import { requirementContext, readRows } from '../requirements/data';
import type { PurchaseOrderStatus, VendorBillStatus } from '@mgbos/domain';

export async function procurementContext() {
  const ctx = await requirementContext();
  assertPermission(ctx.session, 'procurement:read');
  return ctx;
}

export { readRows };

export interface PurchaseOrderRow {
  id: string;
  organization_id: string;
  brand_id: string | null;
  vendor_id: string;
  po_number: string;
  status: PurchaseOrderStatus;
  order_date: string;
  expected_delivery_date: string | null;
  subtotal: string;
  tax_amount: string;
  shipping_cost: string;
  total_amount: string;
  payment_terms: string;
  notes: string | null;
  created_by_user_id: string;
  created_at: string;
  updated_at: string;
  vendors?: {
    id: string;
    code: string;
    name: string;
    category: string;
  } | null;
}

export interface PurchaseOrderItemRow {
  id: string;
  organization_id: string;
  purchase_order_id: string;
  inventory_item_id: string;
  quantity_ordered: number;
  quantity_received: number;
  unit_cost: string;
  subtotal: string;
  notes: string | null;
  created_at: string;
  inventory_items?: {
    id: string;
    sku: string;
    name: string;
    unit: string;
    category: string;
  } | null;
}

export interface GoodsReceiptRow {
  id: string;
  organization_id: string;
  brand_id: string | null;
  purchase_order_id: string;
  receipt_number: string;
  received_date: string;
  vendor_delivery_note_number: string | null;
  location_code: string;
  received_by_user_id: string;
  notes: string | null;
  created_at: string;
  goods_receipt_items?: {
    id: string;
    quantity_accepted: number;
    quantity_rejected: number;
    rejection_reason: string | null;
    inventory_items?: {
      sku: string;
      name: string;
    } | null;
  }[];
}

export interface VendorBillRow {
  id: string;
  organization_id: string;
  brand_id: string | null;
  purchase_order_id: string;
  vendor_id: string;
  bill_number: string;
  vendor_invoice_number: string | null;
  bill_date: string;
  due_date: string | null;
  total_amount: string;
  amount_paid: string;
  balance_due: string;
  status: VendorBillStatus;
  paid_at: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  vendors?: {
    name: string;
  } | null;
  purchase_orders?: {
    po_number: string;
  } | null;
}

export async function listPurchaseOrders(): Promise<{
  orders: PurchaseOrderRow[];
  kpis: {
    totalOrders: number;
    activeOrders: number;
    totalAmountOrdered: bigint;
    totalBillsOutstanding: bigint;
  };
}> {
  const ctx = await procurementContext();

  const [orders, bills] = await Promise.all([
    readRows<PurchaseOrderRow>(
      `purchase_orders?organization_id=eq.${ctx.session.organization.id}&select=*,vendors(id,code,name,category)&order=created_at.desc&limit=100`,
      ctx,
    ),
    readRows<VendorBillRow>(
      `vendor_bills?organization_id=eq.${ctx.session.organization.id}&status=neq.PAID&select=balance_due`,
      ctx,
    ),
  ]);

  let totalOrders = 0;
  let activeOrders = 0;
  let totalAmountOrdered = 0n;

  for (const o of orders) {
    totalOrders += 1;
    if (o.status === 'ORDERED' || o.status === 'PARTIALLY_RECEIVED') {
      activeOrders += 1;
    }
    totalAmountOrdered += BigInt(o.total_amount);
  }

  let totalBillsOutstanding = 0n;
  for (const b of bills) {
    totalBillsOutstanding += BigInt(b.balance_due);
  }

  return {
    orders,
    kpis: {
      totalOrders,
      activeOrders,
      totalAmountOrdered,
      totalBillsOutstanding,
    },
  };
}

export async function getPurchaseOrderDetail(poId: string): Promise<{
  order: PurchaseOrderRow;
  items: PurchaseOrderItemRow[];
  receipts: GoodsReceiptRow[];
  bill: VendorBillRow | null;
} | null> {
  const ctx = await procurementContext();

  const [orderRows, items, receipts, billRows] = await Promise.all([
    readRows<PurchaseOrderRow>(
      `purchase_orders?id=eq.${poId}&organization_id=eq.${ctx.session.organization.id}&select=*,vendors(id,code,name,category)&limit=1`,
      ctx,
    ),
    readRows<PurchaseOrderItemRow>(
      `purchase_order_items?purchase_order_id=eq.${poId}&organization_id=eq.${ctx.session.organization.id}&select=*,inventory_items(id,sku,name,unit,category)&order=created_at.asc`,
      ctx,
    ),
    readRows<GoodsReceiptRow>(
      `goods_receipts?purchase_order_id=eq.${poId}&organization_id=eq.${ctx.session.organization.id}&select=*,goods_receipt_items(*,inventory_items(sku,name))&order=created_at.desc`,
      ctx,
    ),
    readRows<VendorBillRow>(
      `vendor_bills?purchase_order_id=eq.${poId}&organization_id=eq.${ctx.session.organization.id}&select=*,vendors(name)&limit=1`,
      ctx,
    ),
  ]);

  const order = orderRows[0];
  if (!order) return null;

  return {
    order,
    items,
    receipts,
    bill: billRows[0] ?? null,
  };
}
