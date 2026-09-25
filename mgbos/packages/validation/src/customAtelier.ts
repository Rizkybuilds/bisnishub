import { z } from 'zod';
import {
  ATELIER_SCHEMA,
  GARMENT_TYPES,
  GARMENT_FITS,
  GARMENT_SIZES,
  DECORATION_METHODS,
  DECORATION_LOCATIONS,
} from '@mgbos/domain';
const count = z.number().int().min(0).max(2147483647);
const dimension = z.number().positive().max(300).nullable();
export const customAtelierSchema = z
  .object({
    schemaCode: z.literal(ATELIER_SCHEMA),
    garment: z
      .object({
        type: z.enum(GARMENT_TYPES),
        fit: z.enum(GARMENT_FITS),
        material: z.string().trim().min(1, 'Bahan wajib diisi').max(120),
        color: z.string().trim().min(1, 'Warna dasar wajib diisi').max(120),
        gsm: z.number().int().positive().max(2000).nullable(),
        blankPreference: z.string().trim().max(200),
      })
      .strict(),
    sizes: z
      .object(
        Object.fromEntries(
          GARMENT_SIZES.map((size) => [size, count]),
        ) as Record<(typeof GARMENT_SIZES)[number], typeof count>,
      )
      .strict()
      .nullable(),
    decorations: z
      .array(
        z
          .object({
            location: z.enum(DECORATION_LOCATIONS),
            method: z.enum(DECORATION_METHODS),
            widthCm: dimension,
            heightCm: dimension,
            colors: z.number().int().positive().max(100).nullable(),
            artworkReference: z.string().trim().max(500),
            notes: z.string().trim().max(2000),
          })
          .strict(),
      )
      .max(7)
      .superRefine((items, ctx) => {
        if (new Set(items.map((i) => i.location)).size !== items.length)
          ctx.addIssue({
            code: 'custom',
            message: 'Posisi dekorasi tidak boleh berulang',
          });
      }),
    customization: z.string().trim().max(2000),
  })
  .strict();
export const customAtelierRequirementSchema = z
  .object({
    specification: customAtelierSchema,
    quantity: z.number().int().positive().max(2147483647),
    unit: z.literal('PCS'),
  })
  .superRefine(({ specification, quantity }, ctx) => {
    if (
      specification.sizes &&
      Object.values(specification.sizes).reduce((a, b) => a + b, 0) !== quantity
    ) {
      ctx.addIssue({
        code: 'custom',
        path: ['specification', 'sizes'],
        message: 'Total rincian ukuran harus sama dengan jumlah pesanan',
      });
    }
  });
