import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@bisnishub/shared': path.resolve(__dirname, '../../../packages/shared/src'),
    },
    dedupe: ['react', 'react-dom', 'react-router-dom', '@supabase/supabase-js', 'lucide-react'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          supabase: ['@supabase/supabase-js'],
          icons: ['lucide-react'],
          forms: ['zod', 'react-hook-form', '@hookform/resolvers'],
        },
      },
    },
  },
  server: {
    port: 5173,
    open: false,
    fs: {
      allow: [
        path.resolve(__dirname),
        path.resolve(__dirname, '../../../packages/shared/src'),
      ],
    },
  },
  test: {
    setupFiles: ['./src/test/setup.js'],
    include: ['src/**/*.{test,spec}.{js,jsx,ts,tsx}'],
    exclude: ['tests/e2e/**', 'node_modules/**']
  },
});
