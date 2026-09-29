import { z } from 'zod';
import { COURIER_NAMES } from '@mgbos/domain';

export const courierNameSchema = z.enum(COURIER_NAMES);

export const shipmentItemInputSchema = z.object({
  orderItemId: z.string().uuid('ID order item tidak valid'),
  quantity: z.number().int().positive('Jumlah kirim harus lebih besar dari 0'),
  notes: z.string().trim().max(500).optional(),
});

export const createDeliveryOrderSchema = z.object({
  orderId: z.string().uuid('ID pesanan tidak valid'),
  courierName: z.string().trim().min(2, 'Nama kurir / ekspedisi wajib diisi'),
  courierService: z.string().trim().max(50).optional(),
  items: z
    .array(shipmentItemInputSchema)
    .min(1, 'Pengiriman wajib memuat minimal 1 item pesanan'),
  packageWeightGrams: z
    .number()
    .int()
    .positive('Berat paket harus lebih besar dari 0 gram')
    .optional(),
  packageCount: z
    .number()
    .int()
    .positive('Jumlah koli / kardus minimal 1')
    .default(1),
  notes: z.string().trim().max(1000).optional(),
});

export type CreateDeliveryOrderInput = z.infer<
  typeof createDeliveryOrderSchema
>;

export const dispatchShipmentSchema = z.object({
  shipmentId: z.string().uuid('ID pengiriman tidak valid'),
  trackingNumber: z.string().trim().max(100).optional(),
  actualShippingCost: z
    .union([z.string(), z.bigint(), z.number()])
    .optional()
    .transform((val) => {
      if (val === undefined || val === null || val === '') return undefined;
      return BigInt(val);
    }),
  notes: z.string().trim().max(1000).optional(),
});

export type DispatchShipmentInput = z.infer<typeof dispatchShipmentSchema>;

export const markShipmentDeliveredSchema = z.object({
  shipmentId: z.string().uuid('ID pengiriman tidak valid'),
  receivedBy: z.string().trim().max(100).optional(),
  deliveredDate: z.string().datetime().optional(),
  notes: z.string().trim().max(1000).optional(),
});

export type MarkShipmentDeliveredInput = z.infer<
  typeof markShipmentDeliveredSchema
>;

export const cancelShipmentSchema = z.object({
  shipmentId: z.string().uuid('ID pengiriman tidak valid'),
  reason: z
    .string()
    .trim()
    .min(3, 'Alasan pembatalan minimal 3 karakter')
    .max(500),
});

export type CancelShipmentInput = z.infer<typeof cancelShipmentSchema>;
