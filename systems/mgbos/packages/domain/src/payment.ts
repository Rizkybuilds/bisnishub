/**
 * MultiGraph Business OS — Payment Recording & Allocation Domain Service (MGBOS-015)
 * Pure domain contracts, status transitions, allocation calculation, and zero-float helpers.
 */

export const PAYMENT_METHODS = [
  'BANK_TRANSFER',
  'QRIS',
  'CASH',
  'GIRO',
  'PAYMENT_GATEWAY',
  'OTHER',
] as const;

export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  BANK_TRANSFER: 'Transfer Bank',
  QRIS: 'QRIS',
  CASH: 'Tunai (Cash)',
  GIRO: 'Bilyet Giro / Cek',
  PAYMENT_GATEWAY: 'Payment Gateway',
  OTHER: 'Lainnya',
};

export const PAYMENT_STATUSES = [
  'DRAFT',
  'CONFIRMED',
  'REJECTED',
  'REVERSED',
] as const;

export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  DRAFT: 'Draf',
  CONFIRMED: 'Terkonfirmasi',
  REJECTED: 'Ditolak',
  REVERSED: 'Dibatalkan (Reversed)',
};

export const VALID_PAYMENT_TRANSITIONS: Record<
  PaymentStatus,
  readonly PaymentStatus[]
> = {
  DRAFT: ['CONFIRMED', 'REJECTED'],
  CONFIRMED: ['REVERSED'],
  REJECTED: [],
  REVERSED: [],
};

export function validatePaymentTransition(
  from: PaymentStatus,
  to: PaymentStatus,
): { valid: boolean; reason?: string } {
  if (from === to) {
    return { valid: true };
  }

  const allowed = VALID_PAYMENT_TRANSITIONS[from];
  if (!allowed || !allowed.includes(to)) {
    return {
      valid: false,
      reason: `Transisi pembayaran dari ${from} ke ${to} tidak valid dalam state machine`,
    };
  }

  return { valid: true };
}

export interface PaymentAllocationItem {
  invoiceId: string;
  amount: bigint;
  notes?: string;
}

export function calculatePaymentAllocations(
  paymentAmount: bigint,
  allocations: readonly { amount: bigint }[],
): {
  totalAllocated: bigint;
  unallocatedAmount: bigint;
  isOverAllocated: boolean;
} {
  let totalAllocated = 0n;
  for (const item of allocations) {
    totalAllocated += item.amount;
  }

  const unallocatedAmount = paymentAmount - totalAllocated;
  const isOverAllocated = unallocatedAmount < 0n;

  return {
    totalAllocated,
    unallocatedAmount: isOverAllocated ? 0n : unallocatedAmount,
    isOverAllocated,
  };
}

export function calculateInvoicePaymentOutcome(
  invoiceAmountTotal: bigint,
  currentAmountPaid: bigint,
  newAllocationAmount: bigint,
): {
  newAmountPaid: bigint;
  newBalanceDue: bigint;
  isFullyPaid: boolean;
  newStatus: 'PAID' | 'PARTIALLY_PAID';
} {
  const newAmountPaid = currentAmountPaid + newAllocationAmount;
  const newBalanceDue =
    invoiceAmountTotal > newAmountPaid
      ? invoiceAmountTotal - newAmountPaid
      : 0n;
  const isFullyPaid = newBalanceDue === 0n;

  return {
    newAmountPaid,
    newBalanceDue,
    isFullyPaid,
    newStatus: isFullyPaid ? 'PAID' : 'PARTIALLY_PAID',
  };
}
