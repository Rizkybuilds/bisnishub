import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';
export default defineConfig([
  ...nextVitals,
  ...nextTypescript,
  { settings: { next: { rootDir: ['apps/mgbos/', 'apps/teestock/'] } } },
  {
    files: ['**/*.{ts,tsx}'],
    rules: { '@typescript-eslint/no-explicit-any': 'error' },
  },
  {
    files: ['packages/domain/**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            'next',
            'next/*',
            'react',
            '@supabase/*',
            '@mgbos/database',
            '@mgbos/auth',
          ],
        },
      ],
    },
  },
  globalIgnores([
    '**/.next/**',
    '**/next-env.d.ts',
    '**/generated/**',
    '**/node_modules/**',
  ]),
]);
