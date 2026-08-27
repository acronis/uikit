import { resolve } from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

import { PACKS } from './scripts/packs.ts';

const entries: Record<string, string> = {
  index: resolve(import.meta.dirname, 'src/index.ts'),
};
for (const pack of PACKS) {
  entries[`${pack.name}/index`] = resolve(
    import.meta.dirname,
    `src/packs/${pack.name}/index.ts`
  );
}

export default defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
      include: ['src/**/*'],
      exclude: [
        'src/**/*.stories.tsx',
        'src/**/*.test.ts',
        'src/**/*.test.tsx',
        // build-time generator helper, not part of the runtime API
        'src/lib/naming.ts',
      ],
    }),
  ],
  build: {
    lib: {
      entry: entries,
      formats: ['es'],
      fileName: (_format, entryName) => `${entryName}.js`,
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
      output: {
        // Preserve module structure so consumers tree-shake to single icons.
        preserveModules: true,
        preserveModulesRoot: 'src',
        entryFileNames: '[name].js',
        globals: { react: 'React', 'react-dom': 'ReactDOM' },
      },
    },
    sourcemap: true,
    emptyOutDir: true,
  },
  resolve: {
    alias: { '@': resolve(import.meta.dirname, './src') },
  },
});
