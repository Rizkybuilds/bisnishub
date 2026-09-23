import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config';
export default mergeConfig(viteConfig, defineConfig({
  test: {
    include: [
      'src/**/*.test.{js,jsx,ts,tsx}',
      '../../packages/shared/src/**/*.test.{js,jsx,ts,tsx}'
    ],
    setupFiles: ['./src/test/setup.js']
  }
}));
