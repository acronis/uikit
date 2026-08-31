import { resolve } from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
      include: ['src/**/*'],
      exclude: [
        'src/**/*.stories.tsx',
        'src/**/*.test.tsx',
        'src/**/*.spec.tsx',
        'src/**/*.figma.tsx',
      ],
    }),
  ],
  build: {
    cssCodeSplit: true,
    lib: {
      entry: {
        index: resolve(import.meta.dirname, 'src/index.ts'),
        react: resolve(import.meta.dirname, 'src/react.ts'),
        styles: resolve(import.meta.dirname, 'src/styles/index.css'),
      },
      formats: ['es'],
      fileName: (_format, entryName) => `${entryName}.js`,
    },
    rollupOptions: {
      // Every bare import (a real npm package, not our own `.`/`@/`-aliased
      // source) is external. With `preserveModules: true`, bundling a
      // dependency emits it as a chunk under its own resolved node_modules
      // path — under pnpm that's the versioned `.pnpm/<pkg>@<version>/...`
      // store path, which doesn't exist in a consumer's install. Keeping
      // deps external avoids that entirely; they're all regular
      // `dependencies` here, so npm/pnpm/yarn installs them for consumers.
      external: (id) => !id.startsWith('.') && !id.startsWith('/') && !id.startsWith('@/'),
      output: {
        // Preserve module structure so consumers tree-shake unused components.
        preserveModules: true,
        preserveModulesRoot: 'src',
        entryFileNames: '[name].js',
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
        assetFileNames: (assetInfo) => {
          if (
            assetInfo.names.includes('style.css') ||
            assetInfo.names.includes('styles.css')
          ) {
            return 'ui-react.css';
          }
          return assetInfo.names[0] || 'assets/[name]-[hash][extname]';
        },
      },
    },
    sourcemap: true,
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      '@': resolve(import.meta.dirname, './src'),
    },
  },
});
