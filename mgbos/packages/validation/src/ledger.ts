import { z } from 'zod';

export const recordActualJobCostSchema = z.object({
  jobId: z
    .string()
    .uuid({ message: 'ID SPK produksi harus berupa UUID valid' }),
  actualCost: z
    .union([z.string(), z.number(), z.bigint()])
    .transform((val) => {
      if (typeof val === 'bigint') return val;
      if (typeof val === 'number') return BigInt(Math.floor(val));
      const clean = val.replace(/[^\d]/g, '');
      if (!clean) return 0n;
      return BigInt(clean);
    })
    .refine((val) => val >= 0n, {
      message: 'Biaya aktual harus lebih besar atau sama dengan 0',
    }),
  notes: z
    .string()
    .max(1000, { message: 'Catatan maksimal 1000 karakter' })
    .optional()
    .nullable(),
});

export type RecordActualJobCostInput = z.infer<
  typeof recordActualJobCostSchema
>;
