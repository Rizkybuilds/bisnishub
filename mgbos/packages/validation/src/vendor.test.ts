import { describe, it, expect } from 'vitest';
import { createVendorSchema, upsertVendorRateCardSchema } from './vendor';

describe('Vendor Validation Schemas', () => {
  it('validates valid vendor creation payload', () => {
    const parsed = createVendorSchema.safeParse({
      code: 'VND-NSA-01',
      name: 'PT Mulia Garmen Blanks',
      category: 'GARMENT_SUPPLIER',
      contactPerson: 'Budi Santoso',
      phone: '081234567890',
      email: 'budi@muliagarmen.co.id',
      leadTimeDays: 3,
      paymentTerms: 'NET_14',
    });
    expect(parsed.success).toBe(true);
  });

  it('rejects vendor with invalid code or category', () => {
    const shortCode = createVendorSchema.safeParse({
      code: 'V',
      name: 'Vendor X',
      category: 'GARMENT_SUPPLIER',
    });
    expect(shortCode.success).toBe(false);

    const badCategory = createVendorSchema.safeParse({
      code: 'VND-01',
      name: 'Vendor X',
      category: 'INVALID_CATEGORY',
    });
    expect(badCategory.success).toBe(false);
  });

  it('validates rate card payload and transforms numeric unit cost to bigint', () => {
    const parsed = upsertVendorRateCardSchema.safeParse({
      vendorId: '11111111-2222-4333-8444-555555555555',
      serviceCode: 'DTF_PRINT_58CM',
      description: 'Cetak Sablon DTF Roll 58cm',
      unit: 'meter',
      unitCost: 35000,
      minOrderQuantity: 5,
    });
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.unitCost).toBe(35000n);
    }
  });
});
