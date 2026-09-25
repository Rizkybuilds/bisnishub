import { describe, it, expect } from 'vitest';
import {
  validateRateCardCost,
  calculateVendorEstimatedCost,
  VENDOR_CATEGORIES,
  VENDOR_PAYMENT_TERMS,
} from './vendor';

describe('Vendor Domain Service', () => {
  it('defines valid vendor categories and payment terms', () => {
    expect(VENDOR_CATEGORIES).toContain('GARMENT_SUPPLIER');
    expect(VENDOR_CATEGORIES).toContain('PRINT_STUDIO');
    expect(VENDOR_PAYMENT_TERMS).toContain('NET_14');
    expect(VENDOR_PAYMENT_TERMS).toContain('COD');
  });

  it('validates non-negative rate card unit costs', () => {
    const valid = validateRateCardCost(45000n, 10);
    expect(valid.unitCost).toBe(45000n);
    expect(valid.minOrderQuantity).toBe(10);

    expect(() => validateRateCardCost(-1000n, 1)).toThrow(
      'Biaya satuan rate card tidak valid',
    );
    expect(() => validateRateCardCost(50000n, 0)).toThrow(
      'Minimum order kuantitas harus minimal 1',
    );
  });

  it('calculates vendor estimated costs using Zero-Float bigint multiplication', () => {
    const cost = calculateVendorEstimatedCost(25000n, 100);
    expect(cost).toBe(2500000n);

    expect(() => calculateVendorEstimatedCost(25000n, -5)).toThrow(
      'Kuantitas pengerjaan tidak boleh negatif',
    );
  });
});
