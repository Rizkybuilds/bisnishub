import { describe, expect, it } from 'vitest';
import {
  documentNumberSchema,
  generateDocumentNumberInputSchema,
  documentTypeSchema,
} from './documentNumber';

describe('Document Number Validation Schemas', () => {
  it('validates correct document numbers with documentNumberSchema', () => {
    expect(documentNumberSchema.safeParse('TS-L-2026-000001').success).toBe(
      true,
    );
    expect(documentNumberSchema.safeParse('MG-O-2026-0042').success).toBe(true);
    expect(documentNumberSchema.safeParse('NP-INV-2026-000142').success).toBe(
      true,
    );
  });

  it('fails invalid document numbers with documentNumberSchema', () => {
    expect(documentNumberSchema.safeParse('').success).toBe(false);
    expect(documentNumberSchema.safeParse('invalid-number').success).toBe(
      false,
    );
    expect(documentNumberSchema.safeParse('TS-L-2026').success).toBe(false);
    expect(documentNumberSchema.safeParse('TS-L-abc-0001').success).toBe(false);
    expect(documentNumberSchema.safeParse('T-L-2026-0001').success).toBe(false); // brand too short (<2)
  });

  it('transforms and validates document type with documentTypeSchema', () => {
    const res = documentTypeSchema.safeParse('  order  ');
    expect(res.success).toBe(true);
    if (res.success) {
      expect(res.data).toBe('ORDER');
    }
  });

  it('validates valid generateDocumentNumberInputSchema', () => {
    const valid = {
      organizationId: '123e4567-e89b-12d3-a456-426614174000',
      brandId: '123e4567-e89b-12d3-a456-426614174001',
      documentType: 'L',
      year: 2026,
      padLength: 6,
    };
    const result = generateDocumentNumberInputSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it('rejects invalid UUIDs or invalid years in generateDocumentNumberInputSchema', () => {
    const invalid = {
      organizationId: 'not-a-uuid',
      brandId: '22222222-2222-2222-2222-222222222222',
      documentType: 'L',
      year: 1999, // < 2020
    };
    const result = generateDocumentNumberInputSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
