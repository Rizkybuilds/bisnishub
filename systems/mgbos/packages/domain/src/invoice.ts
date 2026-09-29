/**
 * MultiGraph Business OS — Commercial Invoicing Domain Service (MGBOS-014)
 * Pure domain contracts, status transitions, balance due calculation, and milestone splits.
 */

export const INVOICE_TYPES = [
  'DOWN_PAYMENT',
  'PROGRESS',
  'FINAL_PAYMENT',
  'FULL_PAYMENT',
  'RETENTION',
] as const;

export type InvoiceType = (typeof INVOICE_TYPES)[number];

export const INVOICE_STATUSES = [
  'DRAFT',
  'ISSUED',
  'PARTIALLY_PAID',
  'PAID',
  'OVERDUE',
  'VOID',
  'CANCELLED',
] as const;

export type InvoiceStatus = (typeof INVOICE_STATUSES)[number];

export const VALID_INVOICE_TRANSITIONS: Record<
  InvoiceStatus,
  readonly InvoiceStatus[]
> = {
  DRAFT: ['ISSUED', 'CANCELLED'],
  ISSUED: ['PARTIALLY_PAID', 'PAID', 'OVERDUE', 'VOID'],
  OVERDUE: ['PARTIALLY_PAID', 'PAID', 'VOID'],
  PARTIALLY_PAID: ['PAID', 'OVERDUE'],
  PAID: [],
  VOID: [],
  CANCELLED: [],
};

export function validateInvoiceTransition(
  from: InvoiceStatus,
  to: InvoiceStatus,
): { valid: boolean; reason?: string } {
  if (from === to) {
    return { valid: true };
  }

  const allowed = VALID_INVOICE_TRANSITIONS[from];
  if (!allowed || !allowed.includes(to)) {
    return {
      valid: false,
      reason: `Transisi invoice dari ${from} ke ${to} tidak valid dalam state machine`,
    };
  }

  return { valid: true };
}

export const INVOICE_MONEY_MAX = 9223372036854775807n;

export function calculateBalanceDue(
  amountTotal: bigint,
  amountPaid: bigint,
): bigint {
  if (amountTotal < 0n || amountTotal > INVOICE_MONEY_MAX) {
    throw new Error('Nilai total invoice tidak valid');
  }

  if (amountPaid < 0n || amountPaid > amountTotal) {
    throw new Error(
      'Jumlah pembayaran tidak boleh negatif atau melebihi total invoice',
    );
  }

  return amountTotal - amountPaid;
}

export function calculateInvoiceMilestones(
  grandTotal: bigint,
  dpPercent: number = 50,
): { dpAmount: bigint; finalAmount: bigint } {
  if (grandTotal <= 0n) {
    throw new Error('Total kontrak pesanan harus positif');
  }

  if (dpPercent <= 0 || dpPercent >= 100) {
    throw new Error('Persentase DP harus berada di antara 1 dan 99');
  }

  const dpAmount = (grandTotal * BigInt(dpPercent)) / 100n;
  const finalAmount = grandTotal - dpAmount;

  return { dpAmount, finalAmount };
}

export function validateInvoiceCeiling(
  currentActiveInvoiced: bigint,
  newInvoiceAmount: bigint,
  orderGrandTotal: bigint,
): { valid: boolean; reason?: string } {
  const projectedTotal = currentActiveInvoiced + newInvoiceAmount;
  if (projectedTotal > orderGrandTotal) {
    return {
      valid: false,
      reason: `Total tagihan (${projectedTotal.toString()}) melebihi plafon grand total pesanan (${orderGrandTotal.toString()})`,
    };
  }

  return { valid: true };
}
