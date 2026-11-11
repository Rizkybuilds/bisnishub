import { z } from 'zod';

export const catalogProductDetailsSchema = z.object({
  material: z.string().trim().max(160),
  fit: z.string().trim().max(80),
  care: z.string().trim().max(600),
  productionDays: z.number().int().min(0).max(45),
  sizeChart: z.array(z.object({
    size: z.enum(['S', 'M', 'L', 'XL', 'XXL']),
    widthCm: z.number().min(20).max(150),
    lengthCm: z.number().min(20).max(150),
  })).max(5),
});

export const emptyCatalogProductDetails = {
  material: '',
  fit: '',
  care: '',
  productionDays: 0,
  sizeChart: [],
} as const;

export type CatalogProductDetails = z.infer<typeof catalogProductDetailsSchema>;

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
    details: catalogProductDetailsSchema.default(emptyCatalogProductDetails),
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
    const chartSizes = product.details.sizeChart.map((row) => row.size);
    const requiredSizes = [...new Set(product.variants.map((variant) => variant.size))];
    if (new Set(chartSizes).size !== chartSizes.length) {
      ctx.addIssue({
        code: 'custom',
        message: 'Ukuran pada tabel pengukuran tidak boleh duplikat.',
        path: ['details', 'sizeChart'],
      });
    }
    if (product.status === 'PUBLISHED') {
      if (
        product.details.material.length < 3 ||
        product.details.fit.length < 3 ||
        product.details.care.length < 10 ||
        product.details.productionDays < 1 ||
        requiredSizes.some((size) => !chartSizes.includes(size))
      ) {
        ctx.addIssue({
          code: 'custom',
          message: 'Sebelum publish, lengkapi bahan, fit, perawatan, waktu produksi, dan pengukuran setiap ukuran.',
          path: ['details'],
        });
      }
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
