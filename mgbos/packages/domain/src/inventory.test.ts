import { describe, expect, it } from 'vitest';
import {
  calculateAvailableStock,
  isStockAlertTriggered,
  calculateInventoryValuation,
  formatInventoryCategoryLabel,
  formatMutationTypeLabel,
} from './inventory';

describe('Inventory Domain Logic', () => {
  it('calculates available stock subtracting reservations', () => {
    expect(calculateAvailableStock(100, 40)).toBe(60);
    expect(calculateAvailableStock(50, 50)).toBe(0);
    expect(calculateAvailableStock(30, 40)).toBe(0); // clamp at 0
    expect(calculateAvailableStock(20, -5)).toBe(20);
  });

  it('triggers stock alert when available stock <= minStockAlert', () => {
    expect(isStockAlertTriggered(100, 40, 10)).toBe(false); // 60 > 10
    expect(isStockAlertTriggered(50, 40, 10)).toBe(true); // 10 <= 10
    expect(isStockAlertTriggered(45, 40, 10)).toBe(true); // 5 <= 10
    expect(isStockAlertTriggered(0, 0, 5)).toBe(true); // 0 <= 5
  });

  it('calculates inventory valuation with zero-float integer arithmetic', () => {
    expect(calculateInventoryValuation(100, 38000n)).toBe(3800000n);
    expect(calculateInventoryValuation(0, 50000n)).toBe(0n);
    expect(calculateInventoryValuation(25, 650000)).toBe(16250000n);
  });

  it('formats categories and mutation labels into Indonesian text', () => {
    expect(formatInventoryCategoryLabel('BLANK_GARMENT')).toBe(
      'Kaos Polos (Blanks)',
    );
    expect(formatInventoryCategoryLabel('PRINT_MATERIAL')).toBe(
      'Bahan Cetak (DTF/Tinta)',
    );
    expect(formatInventoryCategoryLabel('PACKAGING')).toBe(
      'Kemasan & Packaging',
    );
    expect(formatInventoryCategoryLabel('FINISHED_GOOD')).toBe(
      'Barang Jadi (Ready)',
    );

    expect(formatMutationTypeLabel('INBOUND_PURCHASE')).toBe(
      'Penerimaan Pembelian (PO)',
    );
    expect(formatMutationTypeLabel('RESERVATION')).toBe('Reservasi Pesanan');
    expect(formatMutationTypeLabel('STOCK_OPNAME')).toBe(
      'Stock Opname / Penyesuaian',
    );
    expect(formatMutationTypeLabel('CONSUMED_PRODUCTION')).toBe(
      'Pemakaian Produksi',
    );
  });
});
