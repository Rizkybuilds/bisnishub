import { describe, it, expect } from 'vitest';
import {
  recordPaymentSchema,
  allocateExistingPaymentSchema,
  revertPaymentSchema,
} from './payment';

describe('Payment Validation Schemas (MGBOS-015)', () => {
  it('validates valid payment recording input', () => {
    const valid = {
      brandId: '11111111-2222-4333-8444-555555555555',
      paymentMethod: 'BANK_TRANSFER',
      amount: '5000000',
      referenceNumber: 'BCA-TRX-099',
      allocations: [
        {
          invoiceId: '22222222-3333-4444-8555-666666666666',
          amount: 5000000n,
        },
      ],
    };

    const parsed = recordPaymentSchema.safeParse(valid);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.amount).toBe(5000000n);
      expect(parsed.data.allocations[0]?.amount).toBe(5000000n);
    }
  });

  it('rejects zero or negative payment amounts', () => {
    const invalid = {
      brandId: '11111111-2222-4333-8444-555555555555',
      paymentMethod: 'CASH',
      amount: 0,
    };

    const parsed = recordPaymentSchema.safeParse(invalid);
    expect(parsed.success).toBe(false);
  });

  it('validates existing payment allocation schema', () => {
    const valid = {
      paymentId: '11111111-2222-4333-8444-555555555555',
      invoiceId: '22222222-3333-4444-8555-666666666666',
      amount: '1500000',
    };

    const parsed = allocateExistingPaymentSchema.safeParse(valid);
    expect(parsed.success).toBe(true);
  });

  it('validates revert payment reason length', () => {
    expect(
      revertPaymentSchema.safeParse({
        paymentId: '11111111-2222-4333-8444-555555555555',
        reason: 'ok',
      }).success,
    ).toBe(false);

    expect(
      revertPaymentSchema.safeParse({
        paymentId: '11111111-2222-4333-8444-555555555555',
        reason: 'Salah input rekening pengirim transfer',
      }).success,
    ).toBe(true);
  });
});
