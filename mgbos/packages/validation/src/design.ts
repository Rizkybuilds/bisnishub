import { z } from 'zod';

export const demoDesignSchema = z.object({
  code: z
    .string()
    .regex(
      /^DEMO-[A-Z0-9-]{2,32}$/,
      'Gunakan kode DEMO- diikuti huruf kapital, angka atau tanda hubung.',
    ),
  title: z.string().trim().min(2).max(120),
  theme: z.enum(['CREATIVE', 'COFFEE', 'BASIC', 'CUSTOM']),
  story: z.string().max(2000),
  placement: z.enum(['FRONT', 'BACK', 'NONE']),
});
export const saveDemoDesignSchema = z
  .object({
    requestId: z.uuid(),
    assetId: z.uuid().nullable(),
    expected: z.number().int().min(0).max(2147483646),
    data: demoDesignSchema,
  })
  .refine(
    (v) => (v.assetId ? v.expected > 0 : v.expected === 0),
    'Revisi tidak sesuai.',
  );
export type DemoDesignInput = z.infer<typeof demoDesignSchema>;
