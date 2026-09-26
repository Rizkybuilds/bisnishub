import { z } from 'zod';

export const canonicalDocumentTypes = [
  'L',
  'Q',
  'O',
  'INV',
  'J',
  'PO',
  'PAY',
  'SHIP',
  'DO',
  'LED',
  'GR',
  'VB',
] as const;

export const documentTypeSchema = z
  .string()
  .trim()
  .min(1, 'Document type is required')
  .max(20, 'Document type must be at most 20 characters')
  .transform((val) => val.toUpperCase());

export const documentNumberRegex =
  /^[A-Z0-9]{2,6}-[A-Z0-9]{1,6}-\d{4}-\d{4,8}$/;

export const documentNumberSchema = z
  .string()
  .trim()
  .regex(
    documentNumberRegex,
    'Invalid MGBOS document number format (expected {BRAND}-{TYPE}-{YEAR}-{SEQUENCE})',
  );

export const generateDocumentNumberInputSchema = z.object({
  organizationId: z.string().uuid('Invalid organization ID'),
  brandId: z.string().uuid('Invalid brand ID'),
  documentType: z.string().trim().min(1, 'Document type is required'),
  year: z.number().int().min(2020).max(2100).optional(),
  padLength: z.number().int().min(4).max(10).optional().default(6),
});

export type GenerateDocumentNumberInput = z.infer<
  typeof generateDocumentNumberInputSchema
>;
