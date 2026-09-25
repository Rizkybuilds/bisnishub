import { describe, it, expect } from 'vitest';
import {
  validatePaymentTransition,
  calculatePaymentAllocations,
  calculateInvoicePaymentOutcome,
} from './payment';

describe('Payment Domain Logic (MGBOS-015)', () => {
  it('validates legal transitions in payment state machine', () => {
    expect(validatePaymentTransition('DRAFT', 'CONFIRMED').valid).toBe(true);
    expect(validatePaymentTransition('DRAFT', 'REJECTED').valid).toBe(true);
    expect(validatePaymentTransition('CONFIRMED', 'REVERSED').valid).toBe(true);
    expect(validatePaymentTransition('CONFIRMED', 'CONFIRMED').valid).toBe(
      true,
    );
  });

  it('rejects illegal transitions in payment state machine', () => {
    expect(validatePaymentTransition('CONFIRMED', 'DRAFT').valid).toBe(false);
    expect(validatePaymentTransition('REVERSED', 'CONFIRMED').valid).toBe(
      false,
    );
    expect(validatePaymentTransition('REJECTED', 'CONFIRMED').valid).toBe(
      false,
    );
  });

  it('calculates allocation summary and unallocated balance', () => {
    const paymentAmount = 10000000n;
    const allocations = [{ amount: 4000000n }, { amount: 3500000n }];

    const result = calculatePaymentAllocations(paymentAmount, allocations);
    expect(result.totalAllocated).toBe(7500000n);
    expect(result.unallocatedAmount).toBe(2500000n);
    expect(result.isOverAllocated).toBe(false);
  });

  it('detects over-allocated payments', () => {
    const paymentAmount = 5000000n;
    const allocations = [{ amount: 4000000n }, { amount: 2000000n }];

    const result = calculatePaymentAllocations(paymentAmount, allocations);
    expect(result.totalAllocated).toBe(6000000n);
    expect(result.isOverAllocated).toBe(true);
  });

  it('calculates invoice payment outcome for partial and full payment', () => {
    const invoiceTotal = 10000000n;

    // Partial payment
    const partial = calculateInvoicePaymentOutcome(invoiceTotal, 0n, 4000000n);
    expect(partial.newAmountPaid).toBe(4000000n);
    expect(partial.newBalanceDue).toBe(6000000n);
    expect(partial.isFullyPaid).toBe(false);
    expect(partial.newStatus).toBe('PARTIALLY_PAID');

    // Second payment reaching 100%
    const full = calculateInvoicePaymentOutcome(
      invoiceTotal,
      4000000n,
      6000000n,
    );
    expect(full.newAmountPaid).toBe(10000000n);
    expect(full.newBalanceDue).toBe(0n);
    expect(full.isFullyPaid).toBe(true);
    expect(full.newStatus).toBe('PAID');
  });
});
