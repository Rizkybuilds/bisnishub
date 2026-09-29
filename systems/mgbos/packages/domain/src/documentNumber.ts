/**
 * MultiGraph Business OS — Document Number Domain Service (MGBOS-004)
 * Deterministic business document number generator, parser, and validator.
 * Canonical Format: {BRAND}-{TYPE}-{YEAR}-{SEQUENCE} (e.g. TS-L-2026-000001)
 */

export const CANONICAL_DOCUMENT_TYPES = [
  'L', // Lead (Inbound Lead)
  'REQ', // Requirement (Custom Order Requirement)
  'Q', // Quote (Quotation)
  'O', // Order (Sales / Production Order)
  'INV', // Commercial Invoice
  'J', // Production Job
  'PO', // Purchase Order
  'PAY', // Payment
  'SHIP', // Shipment
  'DO', // Delivery Order (Surat Jalan)
  'LED', // Financial Ledger Entry
  'GR', // Goods Receipt (Penerimaan Barang)
  'VB', // Vendor Bill (Tagihan Vendor)
] as const;

export type CanonicalDocumentType = (typeof CANONICAL_DOCUMENT_TYPES)[number];

export const DOCUMENT_TYPE_ALIASES: Record<string, CanonicalDocumentType> = {
  LEAD: 'L',
  REQ: 'REQ',
  REQUIREMENT: 'REQ',
  QUOTE: 'Q',
  QUOTATION: 'Q',
  ORDER: 'O',
  INVOICE: 'INV',
  JOB: 'J',
  PRODUCTION_JOB: 'J',
  PURCHASE_ORDER: 'PO',
  PAYMENT: 'PAY',
  SHIPMENT: 'DO',
  SHIP: 'DO',
  DO: 'DO',
  DELIVERY_ORDER: 'DO',
  SURAT_JALAN: 'DO',
  LEDGER: 'LED',
  LED: 'LED',
  GOODS_RECEIPT: 'GR',
  GR: 'GR',
  PENERIMAAN_BARANG: 'GR',
  VENDOR_BILL: 'VB',
  VB: 'VB',
  TAGIHAN_VENDOR: 'VB',
};

export interface DocumentNumberComponents {
  brandCode: string;
  documentType: string;
  year: number;
  sequence: number;
  formatted: string;
}

export interface DocumentSequence {
  id: string;
  organizationId: string;
  brandId: string;
  documentType: string;
  year: number;
  lastNumber: number;
  createdAt: string;
  updatedAt: string;
}

export interface FormatDocumentNumberOptions {
  brandCode: string;
  documentType: string;
  year?: number;
  sequence: number | bigint;
  padLength?: number;
}

/**
 * Normalizes document type, resolving common long-form aliases to canonical acronyms.
 * Example: 'ORDER' -> 'O', 'invoice' -> 'INV', 'L' -> 'L'
 */
export function normalizeDocumentType(docType: string): string {
  const clean = docType.trim().toUpperCase();
  return DOCUMENT_TYPE_ALIASES[clean] ?? clean;
}

/**
 * Formats a canonical document number according to MGBOS standards.
 * Default padLength is 6 digits (e.g. TS-L-2026-000001).
 */
export function formatDocumentNumber(
  options: FormatDocumentNumberOptions,
): string {
  const brand = options.brandCode.trim().toUpperCase();
  const type = normalizeDocumentType(options.documentType);
  const year = options.year ?? new Date().getFullYear();
  const padLength = options.padLength ?? 6;
  const seqStr = String(options.sequence).padStart(padLength, '0');

  return `${brand}-${type}-${year}-${seqStr}`;
}

/**
 * Parses a canonical document number back into its constituent components.
 * Returns null if the format is invalid.
 */
export function parseDocumentNumber(
  documentNumber: string,
): DocumentNumberComponents | null {
  if (!documentNumber || typeof documentNumber !== 'string') {
    return null;
  }

  const parts = documentNumber.trim().split('-');
  if (parts.length !== 4) {
    return null;
  }

  const [brandCode, docTypeStr, yearStr, sequenceStr] = parts;
  if (!brandCode || !docTypeStr || !yearStr || !sequenceStr) {
    return null;
  }
  const brand = brandCode.trim().toUpperCase();
  const docType = normalizeDocumentType(docTypeStr);
  const year = parseInt(yearStr, 10);
  const sequence = parseInt(sequenceStr, 10);

  // Validation rules:
  // Brand: 2-6 alphanumeric chars
  if (!/^[A-Z0-9]{2,6}$/.test(brand)) {
    return null;
  }

  // DocType: 1-6 alphanumeric chars
  if (!/^[A-Z0-9]{1,6}$/.test(docType)) {
    return null;
  }

  // Year: reasonable business era
  if (isNaN(year) || year < 2020 || year > 2100) {
    return null;
  }

  // Sequence: positive integer
  if (isNaN(sequence) || sequence < 1) {
    return null;
  }

  return {
    brandCode: brand,
    documentType: docType,
    year,
    sequence,
    formatted: documentNumber.trim(),
  };
}

/**
 * Validates whether a given string is a valid MGBOS document number format.
 */
export function isValidDocumentNumber(documentNumber: string): boolean {
  return parseDocumentNumber(documentNumber) !== null;
}
