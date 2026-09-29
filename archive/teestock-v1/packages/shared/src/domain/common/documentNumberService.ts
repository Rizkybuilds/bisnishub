/**
 * MGBOS Document Number Service (MGBOS-004)
 * Deterministic business document number generator, parser, and validator.
 * Format: <BRAND_PREFIX>-<DOC_TYPE>-<YYYY>-<SEQUENCE> (e.g. TS-ORD-2026-0001)
 */

import { DocumentType, DocumentNumberComponents } from '../types';

export interface DocumentNumberOptions {
  brandPrefix: string;
  docType: DocumentType;
  year?: number;
  sequence: number;
  padLength?: number;
}

/**
 * Formats a document number according to MGBOS canonical standards.
 * Example: generateDocumentNumber({ brandPrefix: 'TS', docType: 'ORD', sequence: 42 }) => 'TS-ORD-2026-0042'
 */
export function generateDocumentNumber(options: DocumentNumberOptions): string {
  const year = options.year ?? new Date().getFullYear();
  const padLength = options.padLength ?? 4;
  const formattedSeq = String(options.sequence).padStart(padLength, '0');
  const prefix = options.brandPrefix.toUpperCase().trim();
  const type = options.docType.toUpperCase().trim();

  return `${prefix}-${type}-${year}-${formattedSeq}`;
}

/**
 * Parses a canonical document number back into its constituent components.
 */
export function parseDocumentNumber(documentNumber: string): DocumentNumberComponents | null {
  if (!documentNumber || typeof documentNumber !== 'string') {
    return null;
  }

  const parts = documentNumber.trim().split('-');
  if (parts.length !== 4) {
    return null;
  }

  const [brandPrefix, docTypeStr, yearStr, sequenceStr] = parts;
  const year = parseInt(yearStr, 10);
  const sequence = parseInt(sequenceStr, 10);

  if (isNaN(year) || isNaN(sequence) || year < 2020 || sequence < 1) {
    return null;
  }

  return {
    brandPrefix,
    docType: docTypeStr as DocumentType,
    year,
    sequence,
  };
}

/**
 * Validates whether a given string is a valid MGBOS document number format.
 */
export function isValidDocumentNumber(documentNumber: string): boolean {
  return parseDocumentNumber(documentNumber) !== null;
}
