import { z } from 'zod';
import { ACCEPTANCE_METHODS, ORDER_STATUSES } from '@mgbos/domain';

export const acceptanceMethodSchema = z.enum(ACCEPTANCE_METHODS);

export const orderStatusSchema = z.enum(ORDER_STATUSES);

export const markQuoteAcceptedSchema = z.object({
  versionId: z.string().uuid('ID versi quotation tidak valid'),
  acceptanceMethod: acceptanceMethodSchema,
  acceptedByContactId: z.string().uuid().optional().nullable(),
  notes: z
    .string()
    .max(2000, 'Catatan penerimaan maksimal 2000 karakter')
    .optional()
    .nullable(),
});

export type MarkQuoteAcceptedInput = z.infer<typeof markQuoteAcceptedSchema>;

export const shippingAddressSnapshotSchema = z.object({
  recipient_name: z
    .string()
    .min(2, 'Nama penerima minimal 2 karakter')
    .max(100),
  phone: z.string().min(5, 'Nomor telepon minimal 5 karakter').max(30),
  street: z.string().min(5, 'Alamat jalan minimal 5 karakter').max(500),
  city: z.string().min(2, 'Kota/Kabupaten minimal 2 karakter').max(100),
  province: z.string().max(100).optional().nullable(),
  postal_code: z.string().max(20).optional().nullable(),
  courier_service: z.string().max(100).optional().nullable(),
  notes: z.string().max(500).optional().nullable(),
});

export type ShippingAddressSnapshot = z.infer<
  typeof shippingAddressSnapshotSchema
>;

export const createOrderFromQuoteSchema = z.object({
  quoteVersionId: z.string().uuid('ID versi quote tidak valid'),
  shippingAddress: shippingAddressSnapshotSchema,
  billingAddress: shippingAddressSnapshotSchema.optional().nullable(),
  paymentTermsOverride: z.record(z.string(), z.unknown()).optional().nullable(),
  notes: z.string().max(2000).optional().nullable(),
});

export type CreateOrderFromQuoteInput = z.infer<
  typeof createOrderFromQuoteSchema
>;

export const retailOrderItemInputSchema = z.object({
  inventoryItemId: z.string().uuid('ID inventory item tidak valid'),
  quantity: z.number().int().min(1, 'Kuantiti minimal 1 unit'),
  unitPrice: z
    .string()
    .regex(/^\d+$/, 'Harga satuan harus angka bulat positif'),
  discountTotal: z
    .string()
    .regex(/^\d+$/, 'Diskon harus berupa angka')
    .optional()
    .default('0'),
  notes: z.string().max(500).optional().nullable(),
});

export type RetailOrderItemInput = z.infer<typeof retailOrderItemInputSchema>;

export const createRetailOrderSchema = z.object({
  brandId: z.string().uuid().optional(),
  customerAccountId: z.string().uuid('ID akun customer tidak valid'),
  items: z
    .array(retailOrderItemInputSchema)
    .min(1, 'Minimal pilih 1 produk/item ritel'),
  shippingAddress: shippingAddressSnapshotSchema.optional().nullable(),
  shippingCost: z
    .string()
    .regex(/^\d+$/, 'Biaya kirim harus berupa angka')
    .optional()
    .default('0'),
  notes: z.string().max(2000).optional().nullable(),
  autoPay: z.boolean().optional().default(false),
  paymentMethod: z
    .enum(['CASH', 'QRIS', 'BANK_TRANSFER', 'PAYMENT_GATEWAY', 'OTHER'])
    .optional()
    .default('CASH'),
  paymentReference: z.string().max(100).optional().nullable(),
  paymentBank: z.string().max(50).optional().nullable(),
});

export type CreateRetailOrderInput = z.infer<typeof createRetailOrderSchema>;
