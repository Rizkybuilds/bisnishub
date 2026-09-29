import { z } from 'zod';

export const purchaseOrderItemInputSchema = z.object({
  inventoryItemId: z.string().uuid('ID item inventori tidak valid'),
  quantity: z.coerce
    .number()
    .int('Kuantiti harus bilangan bulat')
    .positive('Kuantiti harus lebih besar dari 0'),
  unitCost: z
    .union([z.string(), z.bigint(), z.number()])
    .default(0)
    .transform((val) => {
      if (typeof val === 'bigint') return val;
      if (typeof val === 'number') return BigInt(Math.max(0, Math.round(val)));
      const parsed = BigInt(val.trim() === '' ? '0' : val.trim());
      return parsed < 0n ? 0n : parsed;
    }),
  notes: z.string().trim().max(500).optional().nullable(),
});

export const createPurchaseOrderSchema = z.object({
  brandId: z.string().uuid('ID brand tidak valid').optional().nullable(),
  vendorId: z.string().uuid('ID vendor tidak valid'),
  items: z
    .array(purchaseOrderItemInputSchema)
    .min(1, 'PO harus memuat minimal 1 baris item bahan'),
  expectedDeliveryDate: z.string().optional().nullable(),
  shippingCost: z
    .union([z.string(), z.bigint(), z.number()])
    .default(0)
    .transform((val) => {
      if (typeof val === 'bigint') return val;
      if (typeof val === 'number') return BigInt(Math.max(0, Math.round(val)));
      const parsed = BigInt(val.trim() === '' ? '0' : val.trim());
      return parsed < 0n ? 0n : parsed;
    }),
  paymentTerms: z.string().trim().default('COD'),
  notes: z.string().trim().max(1000).optional().nullable(),
});

export type CreatePurchaseOrderInput = z.infer<
  typeof createPurchaseOrderSchema
>;

export const receiveGoodsReceiptItemSchema = z.object({
  purchaseOrderItemId: z.string().uuid('ID baris PO tidak valid'),
  quantityAccepted: z.coerce
    .number()
    .int('Kuantiti diterima harus bilangan bulat')
    .min(0, 'Kuantiti diterima tidak boleh negatif'),
  quantityRejected: z.coerce
    .number()
    .int('Kuantiti ditolak harus bilangan bulat')
    .min(0, 'Kuantiti ditolak tidak boleh negatif')
    .default(0),
  rejectionReason: z.string().trim().max(500).optional().nullable(),
  notes: z.string().trim().max(500).optional().nullable(),
});

export const receivePurchaseOrderSchema = z.object({
  purchaseOrderId: z.string().uuid('ID purchase order tidak valid'),
  items: z
    .array(receiveGoodsReceiptItemSchema)
    .min(1, 'Minimal 1 item yang diterima'),
  vendorDeliveryNote: z.string().trim().max(100).optional().nullable(),
  locationCode: z.string().trim().default('MAIN_WORKSHOP'),
  notes: z.string().trim().max(1000).optional().nullable(),
});

export type ReceivePurchaseOrderInput = z.infer<
  typeof receivePurchaseOrderSchema
>;

export const payVendorBillSchema = z.object({
  vendorBillId: z.string().uuid('ID tagihan vendor tidak valid'),
  amount: z.union([z.string(), z.bigint(), z.number()]).transform((val) => {
    if (typeof val === 'bigint') return val;
    if (typeof val === 'number') return BigInt(Math.max(0, Math.round(val)));
    const parsed = BigInt(val.trim() === '' ? '0' : val.trim());
    return parsed < 0n ? 0n : parsed;
  }),
  paymentMethod: z.string().trim().default('BANK_TRANSFER'),
  sourceBank: z.string().trim().max(50).optional().nullable(),
  sourceAccountNumber: z.string().trim().max(50).optional().nullable(),
  referenceNumber: z.string().trim().max(100).optional().nullable(),
  notes: z.string().trim().max(1000).optional().nullable(),
});

export type PayVendorBillInput = z.infer<typeof payVendorBillSchema>;
