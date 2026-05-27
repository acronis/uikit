import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
  plugins: [
    react(),
    svgr({
      svgrOptions: {
        exportType: 'default',
        ref: true,
        svgo: false,
        titleProp: true,
      },
      include: '**/*.svg?react',
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      // tw-animate-css only exports "." with a "style" condition — Vite
      // can't resolve the subpath import used in SCSS files
      'tw-animate-css/dist/tw-animate.css': resolve(
        __dirname,
        'node_modules/tw-animate-css/dist/tw-animate.css'
      ),
    },
  },
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: ['./vitest.setup.ts'],
  },
});
