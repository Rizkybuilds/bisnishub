import { z } from 'zod';
import { INVOICE_TYPES } from '@mgbos/domain';

export const createInvoiceSchema = z.object({
  orderId: z.string().uuid('ID order kontrak tidak valid'),
  invoiceType: z.enum(INVOICE_TYPES, {
    message: 'Tipe termin tagihan tidak valid',
  }),
  amountSubtotal: z
    .bigint()
    .nonnegative('Subtotal tidak boleh negatif')
    .or(
      z
        .number()
        .nonnegative()
        .transform((n) => BigInt(Math.floor(n))),
    ),
  amountShipping: z
    .bigint()
    .nonnegative('Ongkir tidak boleh negatif')
    .or(
      z
        .number()
        .nonnegative()
        .transform((n) => BigInt(Math.floor(n))),
    )
    .default(0n),
  amountTax: z
    .bigint()
    .nonnegative('Pajak tidak boleh negatif')
    .or(
      z
        .number()
        .nonnegative()
        .transform((n) => BigInt(Math.floor(n))),
    )
    .default(0n),
  dueDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Format tanggal jatuh tempo harus YYYY-MM-DD')
    .optional()
    .nullable(),
  paymentInstructions: z.string().trim().max(1000).optional().nullable(),
  notes: z.string().trim().max(2000).optional().nullable(),
  items: z
    .array(
      z.object({
        order_item_id: z.string().uuid().optional().nullable(),
        description: z
          .string()
          .trim()
          .min(2, 'Deskripsi item minimal 2 karakter'),
        quantity: z.number().int().min(1, 'Kuantitas minimal 1'),
        unit_price: z
          .bigint()
          .nonnegative()
          .or(
            z
              .number()
              .nonnegative()
              .transform((n) => BigInt(Math.floor(n))),
          ),
        notes: z.string().trim().max(500).optional().nullable(),
      }),
    )
    .optional()
    .nullable(),
});

export type CreateInvoiceInput = z.infer<typeof createInvoiceSchema>;

export const issueInvoiceSchema = z.object({
  invoiceId: z.string().uuid('ID invoice tidak valid'),
});

export type IssueInvoiceInput = z.infer<typeof issueInvoiceSchema>;

export const voidInvoiceSchema = z.object({
  invoiceId: z.string().uuid('ID invoice tidak valid'),
  reason: z
    .string()
    .trim()
    .min(3, 'Alasan pembatalan minimal 3 karakter')
    .max(500, 'Alasan pembatalan maksimal 500 karakter'),
});

export type VoidInvoiceInput = z.infer<typeof voidInvoiceSchema>;
