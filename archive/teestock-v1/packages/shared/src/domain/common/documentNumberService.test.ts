import { describe, it, expect } from 'vitest';
import {
  generateDocumentNumber,
  parseDocumentNumber,
  isValidDocumentNumber,
} from './documentNumberService';

describe('DocumentNumberService (MGBOS-004)', () => {
  it('should generate canonical document numbers accurately', () => {
    const orderDoc = generateDocumentNumber({
      brandPrefix: 'TS',
      docType: 'ORD',
      year: 2026,
      sequence: 1,
    });
    expect(orderDoc).toBe('TS-ORD-2026-0001');

    const quoteDoc = generateDocumentNumber({
      brandPrefix: 'MG',
      docType: 'QUO',
      year: 2026,
      sequence: 42,
    });
    expect(quoteDoc).toBe('MG-QUO-2026-0042');

    const poDoc = generateDocumentNumber({
      brandPrefix: 'TS',
      docType: 'PO',
      year: 2026,
      sequence: 105,
    });
    expect(poDoc).toBe('TS-PO-2026-0105');
  });

  it('should correctly parse valid canonical document numbers', () => {
    const parsed = parseDocumentNumber('TS-ORD-2026-0142');
    expect(parsed).not.toBeNull();
    expect(parsed).toEqual({
      brandPrefix: 'TS',
      docType: 'ORD',
      year: 2026,
      sequence: 142,
    });
  });

  it('should return null when parsing invalid document numbers', () => {
    expect(parseDocumentNumber('INVALID-DOC')).toBeNull();
    expect(parseDocumentNumber('TS-ORD-INVALID-001')).toBeNull();
    expect(parseDocumentNumber('TS-ORD-2026-XYZ')).toBeNull();
    expect(parseDocumentNumber('')).toBeNull();
  });

  it('should validate canonical format correctly', () => {
    expect(isValidDocumentNumber('TS-ORD-2026-0001')).toBe(true);
    expect(isValidDocumentNumber('MG-QUO-2026-0999')).toBe(true);
    expect(isValidDocumentNumber('random_string')).toBe(false);
  });
});
