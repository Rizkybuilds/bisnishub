import { describe, expect, it } from 'vitest';
import {
  calculatePurchaseOrderTotals,
  calculateRemainingReceiptQuota,
  formatPurchaseOrderStatusLabel,
  formatVendorBillStatusLabel,
} from './procurement';

describe('Procurement Domain Logic', () => {
  it('calculates PO subtotal and grand total with zero-float integer arithmetic', () => {
    const totals = calculatePurchaseOrderTotals(
      [
        { quantity: 100, unitCost: 38000n },
        { quantity: 5, unitCost: 350000n },
      ],
      50000n,
      0n,
    );

    expect(totals.subtotal).toBe(5550000n);
    expect(totals.shippingCost).toBe(50000n);
    expect(totals.taxAmount).toBe(0n);
    expect(totals.totalAmount).toBe(5600000n);
  });

  it('calculates remaining receipt quota correctly', () => {
    expect(calculateRemainingReceiptQuota(100, 60)).toBe(40);
    expect(calculateRemainingReceiptQuota(100, 100)).toBe(0);
    expect(calculateRemainingReceiptQuota(50, 60)).toBe(0);
  });

  it('formats Indonesian labels for PO and Vendor Bill statuses', () => {
    expect(formatPurchaseOrderStatusLabel('ORDERED')).toBe(
      'Dipesan (Menunggu Barang)',
    );
    expect(formatPurchaseOrderStatusLabel('PARTIALLY_RECEIVED')).toBe(
      'Diterima Sebagian',
    );
    expect(formatPurchaseOrderStatusLabel('RECEIVED')).toBe('Lengkap Diterima');

    expect(formatVendorBillStatusLabel('OPEN')).toBe('Belum Dibayar (Open)');
    expect(formatVendorBillStatusLabel('PARTIALLY_PAID')).toBe(
      'Dibayar Sebagian',
    );
    expect(formatVendorBillStatusLabel('PAID')).toBe('Lunas (Paid)');
  });
});
