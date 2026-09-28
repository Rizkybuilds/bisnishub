export type PurchaseOrderStatus =
  'DRAFT' | 'ORDERED' | 'PARTIALLY_RECEIVED' | 'RECEIVED' | 'CANCELLED';

export type VendorBillStatus = 'OPEN' | 'PARTIALLY_PAID' | 'PAID' | 'VOID';

export interface PurchaseOrderItemInput {
  inventoryItemId: string;
  quantity: number;
  unitCost: bigint | number;
  notes?: string;
}

export interface PurchaseOrderTotals {
  subtotal: bigint;
  shippingCost: bigint;
  taxAmount: bigint;
  totalAmount: bigint;
}

export interface PurchaseOrder {
  id: string;
  organizationId: string;
  brandId?: string | null;
  vendorId: string;
  poNumber: string;
  status: PurchaseOrderStatus;
  orderDate: string;
  expectedDeliveryDate?: string | null;
  subtotal: bigint;
  taxAmount: bigint;
  shippingCost: bigint;
  totalAmount: bigint;
  paymentTerms: string;
  notes?: string | null;
  createdByUserId: string;
  createdAt: string;
  updatedAt: string;
}

export interface PurchaseOrderItem {
  id: string;
  organizationId: string;
  purchaseOrderId: string;
  inventoryItemId: string;
  quantityOrdered: number;
  quantityReceived: number;
  unitCost: bigint;
  subtotal: bigint;
  notes?: string | null;
  createdAt: string;
}

export interface GoodsReceipt {
  id: string;
  organizationId: string;
  brandId?: string | null;
  purchaseOrderId: string;
  receiptNumber: string;
  receivedDate: string;
  vendorDeliveryNoteNumber?: string | null;
  locationCode: string;
  receivedByUserId: string;
  notes?: string | null;
  createdAt: string;
}

export interface GoodsReceiptItem {
  id: string;
  goodsReceiptId: string;
  purchaseOrderItemId: string;
  inventoryItemId: string;
  quantityAccepted: number;
  quantityRejected: number;
  rejectionReason?: string | null;
  notes?: string | null;
  createdAt: string;
}

export interface VendorBill {
  id: string;
  organizationId: string;
  brandId?: string | null;
  purchaseOrderId: string;
  vendorId: string;
  billNumber: string;
  vendorInvoiceNumber?: string | null;
  billDate: string;
  dueDate?: string | null;
  totalAmount: bigint;
  amountPaid: bigint;
  balanceDue: bigint;
  status: VendorBillStatus;
  paidAt?: string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Calculates PO subtotal and total in Zero-Float Integer Rupiah.
 */
export function calculatePurchaseOrderTotals(
  items: { quantity: number; unitCost: bigint | number }[],
  shippingCost: bigint | number = 0n,
  taxAmount: bigint | number = 0n,
): PurchaseOrderTotals {
  let subtotal = 0n;
  for (const item of items) {
    const qty = BigInt(Math.max(0, Math.floor(item.quantity)));
    const cost =
      typeof item.unitCost === 'bigint'
        ? item.unitCost
        : BigInt(Math.max(0, Math.round(item.unitCost)));
    subtotal += qty * cost;
  }

  const ship =
    typeof shippingCost === 'bigint'
      ? shippingCost
      : BigInt(Math.max(0, Math.round(shippingCost)));
  const tax =
    typeof taxAmount === 'bigint'
      ? taxAmount
      : BigInt(Math.max(0, Math.round(taxAmount)));

  const totalAmount = subtotal + ship + tax;

  return {
    subtotal,
    shippingCost: ship,
    taxAmount: tax,
    totalAmount,
  };
}

/**
 * Calculates remaining receipt quota for a PO item.
 */
export function calculateRemainingReceiptQuota(
  quantityOrdered: number,
  quantityReceived: number,
): number {
  return Math.max(0, quantityOrdered - Math.max(0, quantityReceived));
}

/**
 * Indonesian label for PO status.
 */
export function formatPurchaseOrderStatusLabel(
  status: PurchaseOrderStatus,
): string {
  switch (status) {
    case 'DRAFT':
      return 'Draf PO';
    case 'ORDERED':
      return 'Dipesan (Menunggu Barang)';
    case 'PARTIALLY_RECEIVED':
      return 'Diterima Sebagian';
    case 'RECEIVED':
      return 'Lengkap Diterima';
    case 'CANCELLED':
      return 'Dibatalkan';
    default:
      return status;
  }
}

/**
 * Indonesian label for Vendor Bill status.
 */
export function formatVendorBillStatusLabel(status: VendorBillStatus): string {
  switch (status) {
    case 'OPEN':
      return 'Belum Dibayar (Open)';
    case 'PARTIALLY_PAID':
      return 'Dibayar Sebagian';
    case 'PAID':
      return 'Lunas (Paid)';
    case 'VOID':
      return 'Batal (Void)';
    default:
      return status;
  }
}
