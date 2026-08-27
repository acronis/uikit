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
      external: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        '@base-ui/react',
        /^@base-ui\/react\//,
        // Sibling published packages — consumers install them separately, so
        // don't inline them into ui-react's bundle.
        '@acronis-platform/icons-react',
        /^@acronis-platform\/icons-react\//,
        // recharts is a heavy, opt-in charting dep — keep it out of the bundle
        // and let consumers resolve it (declared in dependencies).
        'recharts',
        /^recharts\//,
      ],
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
