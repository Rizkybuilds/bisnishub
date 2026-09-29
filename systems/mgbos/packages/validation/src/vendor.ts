import { z } from 'zod';
import {
  VENDOR_CATEGORIES,
  VENDOR_PAYMENT_TERMS,
  RATE_CARD_UNITS,
} from '@mgbos/domain';

export const createVendorSchema = z.object({
  code: z
    .string()
    .trim()
    .min(3, 'Kode vendor minimal 3 karakter')
    .max(50, 'Kode vendor maksimal 50 karakter'),
  name: z
    .string()
    .trim()
    .min(2, 'Nama vendor minimal 2 karakter')
    .max(150, 'Nama vendor maksimal 150 karakter'),
  category: z.enum(VENDOR_CATEGORIES, {
    message: 'Kategori vendor tidak valid',
  }),
  contactPerson: z.string().trim().max(100).optional().nullable(),
  phone: z.string().trim().max(50).optional().nullable(),
  email: z.string().trim().email('Email tidak valid').optional().nullable(),
  address: z.string().trim().max(500).optional().nullable(),
  leadTimeDays: z
    .number()
    .int()
    .min(0, 'Lead time tidak boleh negatif')
    .default(3),
  paymentTerms: z.enum(VENDOR_PAYMENT_TERMS).default('COD'),
  notes: z.string().trim().max(2000).optional().nullable(),
});

export type CreateVendorInput = z.infer<typeof createVendorSchema>;

export const upsertVendorRateCardSchema = z.object({
  vendorId: z.string().uuid('ID vendor tidak valid'),
  serviceCode: z
    .string()
    .trim()
    .min(2, 'Kode layanan minimal 2 karakter')
    .max(50, 'Kode layanan maksimal 50 karakter'),
  description: z
    .string()
    .trim()
    .min(3, 'Deskripsi layanan minimal 3 karakter')
    .max(255, 'Deskripsi layanan maksimal 255 karakter'),
  unit: z.enum(RATE_CARD_UNITS, {
    message: 'Satuan unit tidak valid',
  }),
  unitCost: z
    .bigint()
    .nonnegative('Biaya satuan tidak boleh negatif')
    .or(
      z
        .number()
        .nonnegative()
        .transform((n) => BigInt(Math.floor(n))),
    ),
  minOrderQuantity: z
    .number()
    .int()
    .min(1, 'Minimum order quantity minimal 1')
    .default(1),
  notes: z.string().trim().max(1000).optional().nullable(),
});

export type UpsertVendorRateCardInput = z.infer<
  typeof upsertVendorRateCardSchema
>;
