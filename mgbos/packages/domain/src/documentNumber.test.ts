import { describe, expect, it } from 'vitest';
import {
  formatDocumentNumber,
  parseDocumentNumber,
  isValidDocumentNumber,
  normalizeDocumentType,
} from './documentNumber';

describe('Document Number Domain Logic', () => {
  it('normalizes common document type aliases to canonical acronyms', () => {
    expect(normalizeDocumentType('ORDER')).toBe('O');
    expect(normalizeDocumentType('order')).toBe('O');
    expect(normalizeDocumentType('LEAD')).toBe('L');
    expect(normalizeDocumentType('quote')).toBe('Q');
    expect(normalizeDocumentType('quotation')).toBe('Q');
    expect(normalizeDocumentType('invoice')).toBe('INV');
    expect(normalizeDocumentType('production_job')).toBe('J');
    expect(normalizeDocumentType('purchase_order')).toBe('PO');
    expect(normalizeDocumentType('payment')).toBe('PAY');
    expect(normalizeDocumentType('shipment')).toBe('DO');
    expect(normalizeDocumentType('delivery_order')).toBe('DO');
    expect(normalizeDocumentType('custom')).toBe('CUSTOM');
  });

  it('formats document numbers according to MGBOS canonical standards', () => {
    const formatted = formatDocumentNumber({
      brandCode: 'TS',
      documentType: 'L',
      year: 2026,
      sequence: 1,
    });
    expect(formatted).toBe('TS-L-2026-000001');

    const formattedCustomPad = formatDocumentNumber({
      brandCode: 'mg',
      documentType: 'order',
      year: 2026,
      sequence: 42,
      padLength: 4,
    });
    expect(formattedCustomPad).toBe('MG-O-2026-0042');
  });

  it('parses valid canonical document numbers correctly', () => {
    const parsed = parseDocumentNumber('TS-L-2026-000001');
    expect(parsed).not.toBeNull();
    expect(parsed).toEqual({
      brandCode: 'TS',
      documentType: 'L',
      year: 2026,
      sequence: 1,
      formatted: 'TS-L-2026-000001',
    });

    const parsedAlias = parseDocumentNumber('MG-INV-2026-000142');
    expect(parsedAlias).not.toBeNull();
    expect(parsedAlias?.sequence).toBe(142);
    expect(parsedAlias?.brandCode).toBe('MG');
  });

  it('rejects invalid document numbers gracefully', () => {
    expect(parseDocumentNumber('')).toBeNull();
    expect(parseDocumentNumber('invalid')).toBeNull();
    expect(parseDocumentNumber('TS-L-2026')).toBeNull();
    expect(parseDocumentNumber('TS-L-abc-0001')).toBeNull();
    expect(parseDocumentNumber('TS-L-2026-0')).toBeNull();
    expect(parseDocumentNumber('T-L-2026-0001')).toBeNull(); // brand too short (< 2)
    expect(isValidDocumentNumber('random-string')).toBe(false);
  });
});
