import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';
export default defineConfig({
  resolve: {
    alias: {
      'next/cache': fileURLToPath(
        new URL('./apps/mgbos/node_modules/next/cache.js', import.meta.url),
      ),
    },
  },
  test: {
    environment: 'node',
    include: ['packages/**/*.test.ts', 'scripts/**/*.test.ts'],
  },
});
