import { z } from 'zod';
import { QUOTE_COST_TYPES, QUOTE_MONEY_MAX } from '@mgbos/domain';
export const quoteMoneySchema = z
  .string()
  .regex(/^\d+$/, 'Gunakan rupiah bulat tanpa pemisah')
  .refine(
    (v) => v.length <= 19 && /^\d+$/.test(v) && BigInt(v) <= QUOTE_MONEY_MAX,
    'Nominal terlalu besar',
  );
export const quoteCostSchema = z
  .object({
    cost_type: z.enum(QUOTE_COST_TYPES),
    description: z.string().trim().min(2).max(200),
    quantity: z.number().int().positive().max(2147483647),
    unit_cost: quoteMoneySchema,
  })
  .strict();
export const saveQuoteSchema = z.object({
  requestId: z.string().uuid(),
  quoteId: z.string().uuid().nullable(),
  expectedVersionId: z.string().uuid().nullable(),
  requirementVersionId: z.string().uuid(),
  customerId: z.string().uuid(),
  unitPrice: quoteMoneySchema,
  discount: quoteMoneySchema,
  shipping: quoteMoneySchema,
  costs: z
    .array(quoteCostSchema)
    .min(1, 'Isi sedikitnya satu komponen HPP')
    .max(30),
  validUntil: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .refine(
      (v) =>
        !Number.isNaN(Date.parse(v)) &&
        new Date(v).toISOString().slice(0, 10) === v,
      'Tanggal tidak valid',
    ),
  terms: z.string().trim().min(2, 'Termin pembayaran wajib diisi').max(2000),
  notes: z.string().trim().max(2000),
  leadTime: z.string().trim().min(1).max(200),
});

export type SaveQuoteInput = z.infer<typeof saveQuoteSchema>;
