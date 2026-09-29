import { describe, it, expect } from 'vitest';
import {
  createRequirementSchema,
  createRequirementVersionSchema,
  transitionRequirementStatusSchema,
  lockRequirementVersionSchema,
} from './requirement';

describe('Requirement Validation Schemas (MGBOS-007)', () => {
  const validUUID1 = '123e4567-e89b-12d3-a456-426614174000';
  const validUUID2 = '123e4567-e89b-12d3-a456-426614174001';

  it('validates a complete createRequirement input', () => {
    const valid = createRequirementSchema.safeParse({
      organizationId: validUUID1,
      brandId: validUUID2,
      title: 'Kebutuhan Kaos Reuni 2026',
      summary: 'Kaos Cotton Combed 24s dengan Sablon DTF A3',
      quantity: 120,
      unit: 'PCS',
      targetDate: '2026-10-15',
      specification: {
        garment: { type: 'tshirt', color: 'navy' },
        printing: { method: 'DTF' },
      },
    });

    expect(valid.success).toBe(true);
  });

  it('rejects invalid UUIDs or negative quantity in createRequirement', () => {
    const invalid = createRequirementSchema.safeParse({
      organizationId: 'not-a-uuid',
      brandId: validUUID2,
      title: 'T',
      summary: 'S',
      quantity: -5,
    });

    expect(invalid.success).toBe(false);
    if (!invalid.success) {
      expect(
        invalid.error.issues.some((i) => i.path.includes('organizationId')),
      ).toBe(true);
      expect(invalid.error.issues.some((i) => i.path.includes('title'))).toBe(
        true,
      );
      expect(
        invalid.error.issues.some((i) => i.path.includes('quantity')),
      ).toBe(true);
    }
  });

  it('validates createRequirementVersion schema', () => {
    const valid = createRequirementVersionSchema.safeParse({
      requirementId: validUUID1,
      summary: 'Revisi versi 2: Tambah sablon logo di lengan kiri',
      quantity: 150,
      specification: { sleevePrint: true },
    });

    expect(valid.success).toBe(true);
  });

  it('validates transitionRequirementStatus schema', () => {
    const valid = transitionRequirementStatusSchema.safeParse({
      requirementId: validUUID1,
      targetStatus: 'READY',
    });
    expect(valid.success).toBe(true);

    const invalid = transitionRequirementStatusSchema.safeParse({
      requirementId: validUUID1,
      targetStatus: 'INVALID_STATUS',
    });
    expect(invalid.success).toBe(false);
  });

  it('validates lockRequirementVersion schema', () => {
    const valid = lockRequirementVersionSchema.safeParse({
      versionId: validUUID1,
      reason: 'Quotation TS-Q-2026-000001 resmi diterbitkan ke klien',
    });
    expect(valid.success).toBe(true);

    const invalid = lockRequirementVersionSchema.safeParse({
      versionId: validUUID1,
      reason: '',
    });
    expect(invalid.success).toBe(false);
  });
});

describe('Requirement money and date boundaries', () => {
  it('rejects fractional, negative, and unsafe numeric budgets', () => {
    const base = {
      requirementId: '123e4567-e89b-12d3-a456-426614174000',
      summary: 'Valid summary',
    };
    for (const targetBudget of [-1, 0.5, Number.MAX_SAFE_INTEGER + 1]) {
      expect(
        createRequirementVersionSchema.safeParse({ ...base, targetBudget })
          .success,
      ).toBe(false);
    }
    expect(
      createRequirementVersionSchema.safeParse({
        ...base,
        targetBudget: 9223372036854775807n,
      }).success,
    ).toBe(true);
    expect(
      createRequirementVersionSchema.safeParse({
        ...base,
        targetDate: '2026-02-30',
      }).success,
    ).toBe(false);
    expect(
      createRequirementVersionSchema.safeParse({ ...base, summary: '  ' })
        .success,
    ).toBe(false);
  });
});
