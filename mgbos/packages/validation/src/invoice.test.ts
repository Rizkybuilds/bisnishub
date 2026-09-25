import { describe, it, expect } from 'vitest';
import {
  createInvoiceSchema,
  issueInvoiceSchema,
  voidInvoiceSchema,
} from './invoice';

describe('Invoice Validation Schemas', () => {
  it('validates a valid create invoice payload', () => {
    const parsed = createInvoiceSchema.safeParse({
      orderId: '11111111-2222-4333-8444-555555555555',
      invoiceType: 'DOWN_PAYMENT',
      amountSubtotal: 5000000,
      amountShipping: 150000,
      amountTax: 0,
      dueDate: '2026-10-01',
      notes: 'Tagihan DP 50%',
    });
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.amountSubtotal).toBe(5000000n);
      expect(parsed.data.amountShipping).toBe(150000n);
    }
  });

  it('rejects invalid orderId or invoiceType', () => {
    const badId = createInvoiceSchema.safeParse({
      orderId: 'not-a-uuid',
      invoiceType: 'DOWN_PAYMENT',
      amountSubtotal: 5000000,
    });
    expect(badId.success).toBe(false);

    const badType = createInvoiceSchema.safeParse({
      orderId: '11111111-2222-4333-8444-555555555555',
      invoiceType: 'INVALID_TYPE',
      amountSubtotal: 5000000,
    });
    expect(badType.success).toBe(false);
  });

  it('validates issue and void schemas', () => {
    const validIssue = issueInvoiceSchema.safeParse({
      invoiceId: '11111111-2222-4333-8444-555555555555',
    });
    expect(validIssue.success).toBe(true);

    const shortReason = voidInvoiceSchema.safeParse({
      invoiceId: '11111111-2222-4333-8444-555555555555',
      reason: 'No',
    });
    expect(shortReason.success).toBe(false);

    const validVoid = voidInvoiceSchema.safeParse({
      invoiceId: '11111111-2222-4333-8444-555555555555',
      reason: 'Pesanan diubah pelanggan ke pelunasan penuh',
    });
    expect(validVoid.success).toBe(true);
  });
});
