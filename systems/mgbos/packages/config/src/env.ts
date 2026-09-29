import { z } from 'zod';
const optionalUrl = z.preprocess(
  (value) => (value === '' ? undefined : value),
  z
    .url()
    .refine((value) => /^https?:\/\//.test(value))
    .optional(),
);
const optionalKey = z.preprocess(
  (value) => (value === '' ? undefined : value),
  z.string().min(1).optional(),
);
const publicSchema = z
  .object({
    NEXT_PUBLIC_SUPABASE_URL: optionalUrl,
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: optionalKey,
  })
  .superRefine((value, ctx) => {
    if (
      Boolean(value.NEXT_PUBLIC_SUPABASE_URL) !==
      Boolean(value.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)
    ) {
      ctx.addIssue({
        code: 'custom',
        message:
          'Supply both public Supabase values, or neither for the bootstrap shell.',
      });
    }
    if (value.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.startsWith('sb_secret_')) {
      ctx.addIssue({
        code: 'custom',
        message: 'A secret key cannot be used as a publishable key.',
      });
    }
    const key = value.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    if (key?.startsWith('eyJ')) {
      try {
        const payload: unknown = JSON.parse(
          atob((key.split('.')[1] ?? '').replace(/-/g, '+').replace(/_/g, '/')),
        );
        if (
          typeof payload !== 'object' ||
          payload === null ||
          !('role' in payload) ||
          payload.role !== 'anon'
        ) {
          throw new Error('Not an anonymous key');
        }
      } catch {
        ctx.addIssue({
          code: 'custom',
          message: 'Only an anonymous legacy JWT may be public.',
        });
      }
    }
  });
const serverSchema = z.object({
  MGBOS_APP_URL: optionalUrl,
  TEESTOCK_APP_URL: optionalUrl,
  SUPABASE_SERVICE_ROLE_KEY: optionalKey,
});
function parse<T>(schema: z.ZodType<T>, input: unknown): T {
  const result = schema.safeParse(input);
  if (!result.success) {
    // Never include configuration values in errors or logs.
    throw new Error(
      'Invalid environment configuration. Check variable names and formats in .env.example.',
    );
  }
  return result.data;
}
export function parsePublicEnvironment(input: unknown) {
  return parse(publicSchema, input);
}
export function parseServerEnvironment(input: unknown) {
  return parse(serverSchema, input);
}
