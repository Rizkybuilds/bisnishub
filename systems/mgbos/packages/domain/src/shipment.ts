/**
 * MultiGraph Business OS — Shipment & Delivery Order Domain Service (MGBOS-017 / TS-PLAN-06)
 * Pure domain contracts, shipment lifecycle state machines, and fulfillment allocation validation.
 */

export const SHIPMENT_STATUSES = [
  'DRAFT',
  'READY_TO_DISPATCH',
  'DISPATCHED',
  'IN_TRANSIT',
  'DELIVERED',
  'FAILED',
  'RETURNED',
  'CANCELLED',
] as const;

export type ShipmentStatus = (typeof SHIPMENT_STATUSES)[number];

export const SHIPMENT_STATUS_LABELS: Record<ShipmentStatus, string> = {
  DRAFT: 'Draf',
  READY_TO_DISPATCH: 'Siap Diserahkan (Ready)',
  DISPATCHED: 'Diserahkan ke Kurir',
  IN_TRANSIT: 'Dalam Perjalanan',
  DELIVERED: 'Terkirim & Diterima (Delivered)',
  FAILED: 'Gagal Kirim',
  RETURNED: 'Retur ke Gudang',
  CANCELLED: 'Dibatalkan',
};

export const COURIER_NAMES = [
  'JNE',
  'JNT',
  'SICEPAT',
  'LALAMOVE',
  'GOSEND',
  'INTERNAL_COURIER',
  'CUSTOMER_PICKUP',
  'OTHER',
] as const;

export type CourierName = (typeof COURIER_NAMES)[number];

export const COURIER_LABELS: Record<CourierName, string> = {
  JNE: 'JNE Express',
  JNT: 'J&T Cargo / Express',
  SICEPAT: 'SiCepat Ekspres',
  LALAMOVE: 'Lalamove Instant / Van',
  GOSEND: 'GoSend Instant / Sameday',
  INTERNAL_COURIER: 'Kurir Internal Holding',
  CUSTOMER_PICKUP: 'Ambil Sendiri di Workshop (Self-Pickup)',
  OTHER: 'Ekspedisi Lainnya',
};

export const VALID_SHIPMENT_TRANSITIONS: Record<
  ShipmentStatus,
  readonly ShipmentStatus[]
> = {
  DRAFT: ['READY_TO_DISPATCH', 'CANCELLED'],
  READY_TO_DISPATCH: ['DISPATCHED', 'CANCELLED'],
  DISPATCHED: ['IN_TRANSIT', 'DELIVERED', 'FAILED', 'RETURNED'],
  IN_TRANSIT: ['DELIVERED', 'FAILED', 'RETURNED'],
  DELIVERED: [], // Terminal & permanently immutable
  FAILED: ['READY_TO_DISPATCH', 'DISPATCHED', 'RETURNED', 'CANCELLED'],
  RETURNED: [], // Terminal
  CANCELLED: [], // Terminal
};

export function canTransitionShipment(
  from: ShipmentStatus,
  to: ShipmentStatus,
): boolean {
  if (from === to) return true;
  return VALID_SHIPMENT_TRANSITIONS[from]?.includes(to) ?? false;
}

export interface OrderItemAllocationContext {
  orderItemId: string;
  description: string;
  orderedQuantity: number;
  previouslyShippedQuantity: number;
}

export interface RequestedShipmentItem {
  orderItemId: string;
  quantity: number;
  notes?: string;
}

export interface ShipmentAllocationResult {
  isValid: boolean;
  error?: string;
  items: Array<{
    orderItemId: string;
    description: string;
    orderedQuantity: number;
    previouslyShippedQuantity: number;
    requestedQuantity: number;
    remainingAfterShipment: number;
  }>;
  totalOrderedQty: number;
  totalShippedSoFar: number;
  totalRequestedQty: number;
  isFullyFulfilled: boolean;
  fulfillmentPercentage: number;
}

/**
 * Validates requested shipment quantities against ordered and previously shipped quantities.
 * Prevents over-shipping and computes overall fulfillment progress.
 */
export function calculateShipmentAllocation(
  contextItems: OrderItemAllocationContext[],
  requestedItems: RequestedShipmentItem[],
): ShipmentAllocationResult {
  if (requestedItems.length === 0) {
    return {
      isValid: false,
      error: 'Pengiriman harus memuat minimal satu item pesanan',
      items: [],
      totalOrderedQty: 0,
      totalShippedSoFar: 0,
      totalRequestedQty: 0,
      isFullyFulfilled: false,
      fulfillmentPercentage: 0,
    };
  }

  const contextMap = new Map<string, OrderItemAllocationContext>(
    contextItems.map((item) => [item.orderItemId, item]),
  );

  let totalOrdered = 0;
  let totalShipped = 0;
  let totalRequested = 0;
  const processedItems: ShipmentAllocationResult['items'] = [];

  for (const ctx of contextItems) {
    totalOrdered += ctx.orderedQuantity;
    totalShipped += ctx.previouslyShippedQuantity;
  }

  for (const req of requestedItems) {
    if (req.quantity <= 0) {
      return {
        isValid: false,
        error: `Jumlah pengiriman untuk item ${req.orderItemId} harus lebih besar dari 0`,
        items: [],
        totalOrderedQty: totalOrdered,
        totalShippedSoFar: totalShipped,
        totalRequestedQty: 0,
        isFullyFulfilled: false,
        fulfillmentPercentage: 0,
      };
    }

    const ctx = contextMap.get(req.orderItemId);
    if (!ctx) {
      return {
        isValid: false,
        error: `Item pesanan ${req.orderItemId} tidak ditemukan dalam kontrak pesanan`,
        items: [],
        totalOrderedQty: totalOrdered,
        totalShippedSoFar: totalShipped,
        totalRequestedQty: 0,
        isFullyFulfilled: false,
        fulfillmentPercentage: 0,
      };
    }

    const availableToShip = ctx.orderedQuantity - ctx.previouslyShippedQuantity;
    if (req.quantity > availableToShip) {
      return {
        isValid: false,
        error: `Jumlah kirim (${req.quantity} pcs) melebihi sisa kuota yang belum dikirim (${availableToShip} pcs) untuk "${ctx.description}"`,
        items: [],
        totalOrderedQty: totalOrdered,
        totalShippedSoFar: totalShipped,
        totalRequestedQty: 0,
        isFullyFulfilled: false,
        fulfillmentPercentage: 0,
      };
    }

    totalRequested += req.quantity;
    processedItems.push({
      orderItemId: ctx.orderItemId,
      description: ctx.description,
      orderedQuantity: ctx.orderedQuantity,
      previouslyShippedQuantity: ctx.previouslyShippedQuantity,
      requestedQuantity: req.quantity,
      remainingAfterShipment: availableToShip - req.quantity,
    });
  }

  const cumulativeShipped = totalShipped + totalRequested;
  const isFullyFulfilled = cumulativeShipped >= totalOrdered;
  const fulfillmentPercentage =
    totalOrdered > 0
      ? Math.round((cumulativeShipped / totalOrdered) * 10000) / 100
      : 0;

  return {
    isValid: true,
    items: processedItems,
    totalOrderedQty: totalOrdered,
    totalShippedSoFar: totalShipped,
    totalRequestedQty: totalRequested,
    isFullyFulfilled,
    fulfillmentPercentage,
  };
}
