import { describe, it, expect } from 'vitest';
import { generateOrderNumber, isValidOrderNumber } from '../orderNumber';

describe('Standardized Order Number Generator (orderNumber.js)', () => {
  it('menghasilkan nomor order berformat standar TS-YYMMDD-XXXXXX (6 hex digits)', () => {
    const orderNumber = generateOrderNumber('TS');
    expect(orderNumber).toMatch(/^TS-\d{6}-[0-9A-F]{6}$/);
  });

  it('memvalidasi nomor order yang sah dan menolak yang tidak valid', () => {
    expect(isValidOrderNumber('TS-260913-A8F2')).toBe(true); // 4-digit hex legacy
    expect(isValidOrderNumber('TS-260914-A8F2C1')).toBe(true); // 6-digit hex modern
    expect(isValidOrderNumber('WEB-123456')).toBe(true);
    expect(isValidOrderNumber('invalid-order')).toBe(false);
    expect(isValidOrderNumber(null)).toBe(false);
    expect(isValidOrderNumber('')).toBe(false);
  });

  it('menghasilkan nomor order unik untuk transaksi berurutan', () => {
    const set = new Set();
    for (let i = 0; i < 50; i++) {
      set.add(generateOrderNumber());
    }
    // Minimal 49 atau 50 unik (probabilitas tabrakan 16^4 = 65536 sangat rendah untuk 50)
    expect(set.size).toBeGreaterThanOrEqual(49);
  });
});
