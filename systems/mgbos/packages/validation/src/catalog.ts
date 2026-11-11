import { z } from 'zod';

export const catalogVariantSchema = z
  .object({
    sku: z.string().regex(/^[A-Z0-9-]{3,40}$/),
    size: z.enum(['S', 'M', 'L', 'XL', 'XXL']),
    color: z.string().trim().min(2).max(50),
    priceIdr: z.number().int().positive().max(9999999999),
    costIdr: z.number().int().min(0).max(9999999999),
  })
  .refine((value) => value.costIdr <= value.priceIdr, {
    message: 'HPP tidak boleh melebihi harga jual.',
  });

const mockupPathSchema = z
  .string()
  .regex(/^[0-9a-f-]{36}\/[0-9a-f-]{36}\/[0-9a-f-]{36}\.(png|jpg|webp)$/);
const artworkPathSchema = z
  .string()
  .regex(/^[0-9a-f-]{36}\/[0-9a-f-]{36}\/[0-9a-f-]{36}\.(png|pdf)$/);

export const catalogProductSchema = z
  .object({
    id: z.uuid().nullable(),
    expectedVersion: z.number().int().min(0),
    slug: z
      .string()
      .trim()
      .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/)
      .max(80),
    title: z.string().trim().min(3).max(120),
    collectionName: z.string().trim().min(2).max(80),
    description: z.string().max(3000),
    mockupPath: mockupPathSchema.nullable(),
    artworkPath: artworkPathSchema.nullable(),
    rightsStatus: z.enum(['PENDING', 'APPROVED']),
    sampleStatus: z.enum(['PENDING', 'PASSED']),
    status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']),
    variants: z.array(catalogVariantSchema).min(1).max(40),
  })
  .superRefine((product, ctx) => {
    const skuSet = new Set<string>();
    product.variants.forEach((variant, index) => {
      if (skuSet.has(variant.sku)) {
        ctx.addIssue({
          code: 'custom',
          message: 'SKU tidak boleh duplikat.',
          path: ['variants', index, 'sku'],
        });
      }
      skuSet.add(variant.sku);
    });
    if (product.id === null && product.expectedVersion !== 0) {
      ctx.addIssue({
        code: 'custom',
        message: 'Versi produk baru harus nol.',
        path: ['expectedVersion'],
      });
    }
    if (product.id !== null && product.expectedVersion < 1) {
      ctx.addIssue({
        code: 'custom',
        message: 'Versi revisi tidak valid.',
        path: ['expectedVersion'],
      });
    }
    if (product.status === 'PUBLISHED') {
      if (
        product.rightsStatus !== 'APPROVED' ||
        product.sampleStatus !== 'PASSED' ||
        !product.mockupPath ||
        !product.artworkPath ||
        product.variants.some((v) => v.costIdr === 0)
      ) {
        ctx.addIssue({
          code: 'custom',
          message:
            'Publikasi memerlukan hak penggunaan, sampel PASS, mockup, artwork dan HPP lengkap.',
          path: ['status'],
        });
      }
    }
  });

export type CatalogProductInput = z.infer<typeof catalogProductSchema>;
export type CatalogVariantInput = z.infer<typeof catalogVariantSchema>;
