import { describe, it, expect } from 'vitest';
import {
  validateInvoiceTransition,
  calculateBalanceDue,
  calculateInvoiceMilestones,
  validateInvoiceCeiling,
  INVOICE_TYPES,
  INVOICE_STATUSES,
} from './invoice';

describe('Commercial Invoice Domain Service', () => {
  it('defines standard invoice types and statuses', () => {
    expect(INVOICE_TYPES).toContain('DOWN_PAYMENT');
    expect(INVOICE_TYPES).toContain('FINAL_PAYMENT');
    expect(INVOICE_TYPES).toContain('FULL_PAYMENT');

    expect(INVOICE_STATUSES).toContain('DRAFT');
    expect(INVOICE_STATUSES).toContain('ISSUED');
    expect(INVOICE_STATUSES).toContain('PAID');
    expect(INVOICE_STATUSES).toContain('VOID');
  });

  it('validates state machine transitions', () => {
    expect(validateInvoiceTransition('DRAFT', 'ISSUED').valid).toBe(true);
    expect(validateInvoiceTransition('ISSUED', 'PARTIALLY_PAID').valid).toBe(
      true,
    );
    expect(validateInvoiceTransition('ISSUED', 'PAID').valid).toBe(true);
    expect(validateInvoiceTransition('ISSUED', 'VOID').valid).toBe(true);
    expect(validateInvoiceTransition('PARTIALLY_PAID', 'PAID').valid).toBe(
      true,
    );

    // Invalid transitions
    expect(validateInvoiceTransition('PAID', 'DRAFT').valid).toBe(false);
    expect(validateInvoiceTransition('VOID', 'ISSUED').valid).toBe(false);
  });

  it('calculates balance due with Zero-Float bigint precision', () => {
    const balance = calculateBalanceDue(10000000n, 5000000n);
    expect(balance).toBe(5000000n);

    expect(calculateBalanceDue(10000000n, 10000000n)).toBe(0n);

    expect(() => calculateBalanceDue(10000000n, 12000000n)).toThrow(
      'Jumlah pembayaran tidak boleh negatif atau melebihi total invoice',
    );
  });

  it('splits order into DP and Pelunasan milestones', () => {
    const milestones = calculateInvoiceMilestones(10200000n, 50);
    expect(milestones.dpAmount).toBe(5100000n);
    expect(milestones.finalAmount).toBe(5100000n);

    // 30% DP split
    const customSplit = calculateInvoiceMilestones(10000000n, 30);
    expect(customSplit.dpAmount).toBe(3000000n);
    expect(customSplit.finalAmount).toBe(7000000n);
  });

  it('enforces order invoicing ceiling', () => {
    const valid = validateInvoiceCeiling(5000000n, 5000000n, 10000000n);
    expect(valid.valid).toBe(true);

    const exceed = validateInvoiceCeiling(5000000n, 6000000n, 10000000n);
    expect(exceed.valid).toBe(false);
    expect(exceed.reason).toContain('melebihi plafon grand total pesanan');
  });
});
