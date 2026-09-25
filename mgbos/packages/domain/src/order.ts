/**
 * MultiGraph Business OS — Order Domain Service (MGBOS-011)
 * Pure domain contracts, status transitions, and financial invariant rules for Orders.
 */

export const ORDER_STATUSES = [
  'DRAFT',
  'CONFIRMED',
  'ACTIVE',
  'ON_HOLD',
  'COMPLETED',
  'CANCELLED',
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const ACCEPTANCE_METHODS = [
  'WHATSAPP',
  'EMAIL',
  'SIGNATURE',
  'DIRECT',
] as const;

export type AcceptanceMethod = (typeof ACCEPTANCE_METHODS)[number];

export const ORDER_MONEY_MAX = 9223372036854775807n;

export const VALID_ORDER_TRANSITIONS: Record<
  OrderStatus,
  readonly OrderStatus[]
> = {
  DRAFT: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['ACTIVE', 'ON_HOLD', 'CANCELLED'],
  ACTIVE: ['ON_HOLD', 'COMPLETED', 'CANCELLED'],
  ON_HOLD: ['ACTIVE', 'CANCELLED'],
  COMPLETED: [],
  CANCELLED: [],
};

/**
 * Validates state machine progression for an order commercial lifecycle.
 */
export function validateOrderTransition(
  from: OrderStatus,
  to: OrderStatus,
): { valid: boolean; reason?: string } {
  if (from === to) {
    return { valid: true };
  }

  const allowed = VALID_ORDER_TRANSITIONS[from];
  if (!allowed || !allowed.includes(to)) {
    return {
      valid: false,
      reason: `Transisi order dari ${from} ke ${to} tidak diizinkan dalam siklus komersial`,
    };
  }

  return { valid: true };
}

/**
 * Validates financial invariants for an order contract snapshot.
 * Enforces Zero-Float arithmetic (bigint integer Rupiah) and courier fee isolation.
 */
export function validateOrderFinancials(
  subtotal: bigint,
  discountTotal: bigint,
  shippingTotal: bigint,
  estimatedCostTotal: bigint,
) {
  for (const amount of [
    subtotal,
    discountTotal,
    shippingTotal,
    estimatedCostTotal,
  ]) {
    if (amount < 0n || amount > ORDER_MONEY_MAX) {
      throw new Error('Nominal order di luar batas valid');
    }
  }

  if (subtotal <= 0n) {
    throw new Error('Subtotal pesanan harus lebih besar dari 0');
  }

  if (discountTotal >= subtotal) {
    throw new Error('Diskon tidak boleh melebihi atau sama dengan subtotal');
  }

  if (estimatedCostTotal <= 0n) {
    throw new Error('Estimasi HPP modal pesanan harus lebih besar dari 0');
  }

  const netProductRevenue = subtotal - discountTotal;
  const grandTotal = netProductRevenue + shippingTotal;
  const estimatedGrossProfit = netProductRevenue - estimatedCostTotal;

  if (grandTotal > ORDER_MONEY_MAX) {
    throw new Error('Grand total melebihi kapasitas integer batas maksimum');
  }

  return {
    netProductRevenue,
    grandTotal,
    estimatedGrossProfit,
    shippingTotal, // pass-through escrow
  };
}
