import { z } from 'zod';

export const inventoryCategorySchema = z.enum([
  'BLANK_GARMENT',
  'PRINT_MATERIAL',
  'PACKAGING',
  'FINISHED_GOOD',
  'OTHER',
]);

export const inventoryMutationTypeSchema = z.enum([
  'INBOUND_PURCHASE',
  'SCRAP_DEFECT',
  'OUTBOUND_SHIPMENT',
]);

export const createInventoryItemSchema = z.object({
  brandId: z.string().uuid('ID brand tidak valid').optional().nullable(),
  sku: z
    .string()
    .trim()
    .min(2, 'SKU minimal 2 karakter')
    .max(60, 'SKU maksimal 60 karakter')
    .transform((val) => val.toUpperCase()),
  name: z
    .string()
    .trim()
    .min(2, 'Nama barang minimal 2 karakter')
    .max(120, 'Nama barang maksimal 120 karakter'),
  category: inventoryCategorySchema,
  unit: z.string().trim().min(1, 'Satuan wajib diisi').max(20).default('pcs'),
  attributes: z.record(z.string(), z.unknown()).optional().default({}),
  costPrice: z
    .union([z.string(), z.bigint(), z.number()])
    .default(0)
    .transform((val) => {
      if (typeof val === 'bigint') return val;
      if (typeof val === 'number') return BigInt(Math.max(0, Math.round(val)));
      const parsed = BigInt(val.trim() === '' ? '0' : val.trim());
      return parsed < 0n ? 0n : parsed;
    }),
  minStockAlert: z.coerce
    .number()
    .int('Batas minimum harus bilangan bulat')
    .min(0, 'Batas minimum tidak boleh negatif')
    .default(10),
  initialStock: z.coerce
    .number()
    .int('Stok awal harus bilangan bulat')
    .min(0, 'Stok awal tidak boleh negatif')
    .default(0),
  locationCode: z
    .string()
    .trim()
    .min(2, 'Kode lokasi minimal 2 karakter')
    .default('MAIN_WORKSHOP'),
  binLocation: z.string().trim().max(50).optional().nullable(),
});

export type CreateInventoryItemInput = z.infer<
  typeof createInventoryItemSchema
>;

export const recordInventoryMutationSchema = z.object({
  inventoryItemId: z.string().uuid('ID item inventori tidak valid'),
  mutationType: inventoryMutationTypeSchema,
  quantity: z.coerce
    .number()
    .int('Jumlah mutasi harus bilangan bulat')
    .positive('Jumlah mutasi harus lebih besar dari 0'),
  locationCode: z.string().trim().default('MAIN_WORKSHOP'),
  referenceType: z.string().trim().max(50).optional().nullable(),
  referenceId: z
    .string()
    .uuid('ID referensi tidak valid')
    .optional()
    .nullable(),
  notes: z.string().trim().max(1000).optional().nullable(),
});

export type RecordInventoryMutationInput = z.infer<
  typeof recordInventoryMutationSchema
>;

export const reserveInventoryItemSchema = z.object({
  inventoryItemId: z.string().uuid('ID item inventori tidak valid'),
  quantity: z.coerce
    .number()
    .int('Jumlah reservasi harus bilangan bulat')
    .positive('Jumlah reservasi harus lebih besar dari 0'),
  orderItemId: z
    .string()
    .uuid('ID item pesanan tidak valid')
    .optional()
    .nullable(),
  locationCode: z.string().trim().default('MAIN_WORKSHOP'),
});

export const reserveInventorySchema = z.object({
  orderId: z.string().uuid('ID pesanan tidak valid'),
  items: z
    .array(reserveInventoryItemSchema)
    .min(1, 'Minimal 1 item untuk reservasi'),
  notes: z.string().trim().max(1000).optional().nullable(),
});

export type ReserveInventoryInput = z.infer<typeof reserveInventorySchema>;

export const performStockOpnameSchema = z.object({
  inventoryItemId: z.string().uuid('ID item inventori tidak valid'),
  actualPhysicalCount: z.coerce
    .number()
    .int('Hasil hitung fisik harus bilangan bulat')
    .min(0, 'Hasil hitung fisik tidak boleh negatif'),
  locationCode: z.string().trim().default('MAIN_WORKSHOP'),
  reason: z
    .string()
    .trim()
    .min(3, 'Alasan penyesuaian opname minimal 3 karakter')
    .max(500, 'Alasan opname maksimal 500 karakter'),
});

export type PerformStockOpnameInput = z.infer<typeof performStockOpnameSchema>;
