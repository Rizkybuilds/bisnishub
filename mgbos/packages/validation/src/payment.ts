import { z } from 'zod';
import { PAYMENT_METHODS } from '@mgbos/domain';

const moneyPositiveSchema = z
  .bigint()
  .positive('Jumlah pembayaran harus lebih besar dari nol')
  .or(
    z
      .number()
      .positive('Jumlah pembayaran harus lebih besar dari nol')
      .transform((n) => BigInt(Math.floor(n))),
  )
  .or(
    z
      .string()
      .trim()
      .regex(/^\d+$/, 'Jumlah harus berupa angka bulat positif')
      .transform((s) => BigInt(s)),
  );

export const paymentAllocationItemSchema = z.object({
  invoiceId: z.string().uuid('ID invoice tidak valid'),
  amount: moneyPositiveSchema,
  notes: z.string().trim().max(500).optional().nullable(),
});

export const recordPaymentSchema = z.object({
  brandId: z.string().uuid('ID brand tidak valid'),
  paymentMethod: z.enum(PAYMENT_METHODS, {
    message: 'Metode pembayaran tidak valid',
  }),
  amount: moneyPositiveSchema,
  paymentDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Format tanggal bayar harus YYYY-MM-DD')
    .optional()
    .nullable(),
  referenceNumber: z.string().trim().max(100).optional().nullable(),
  destinationBank: z.string().trim().max(100).optional().nullable(),
  destinationAccountNumber: z.string().trim().max(100).optional().nullable(),
  payerName: z.string().trim().max(150).optional().nullable(),
  payerBank: z.string().trim().max(100).optional().nullable(),
  payerAccountNumber: z.string().trim().max(100).optional().nullable(),
  proofFileUrl: z.string().trim().max(500).optional().nullable(),
  notes: z.string().trim().max(2000).optional().nullable(),
  customerAccountId: z.string().uuid().optional().nullable(),
  allocations: z.array(paymentAllocationItemSchema).default([]),
});

export type RecordPaymentInput = z.infer<typeof recordPaymentSchema>;

export const allocateExistingPaymentSchema = z.object({
  paymentId: z.string().uuid('ID pembayaran tidak valid'),
  invoiceId: z.string().uuid('ID invoice tidak valid'),
  amount: moneyPositiveSchema,
  notes: z.string().trim().max(500).optional().nullable(),
});

export type AllocateExistingPaymentInput = z.infer<
  typeof allocateExistingPaymentSchema
>;

export const revertPaymentSchema = z.object({
  paymentId: z.string().uuid('ID pembayaran tidak valid'),
  reason: z
    .string()
    .trim()
    .min(5, 'Alasan pembatalan minimal 5 karakter')
    .max(1000, 'Alasan pembatalan maksimal 1000 karakter'),
});

export type RevertPaymentInput = z.infer<typeof revertPaymentSchema>;
