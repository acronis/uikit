import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import dts from 'vite-plugin-dts'
import svgr from 'vite-plugin-svgr'

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
    dts({
      insertTypesEntry: true,
      include: ['src/**/*'],
      exclude: [
        'src/**/*.stories.tsx',
        'src/**/*.test.tsx',
        'src/**/*.spec.tsx',
      ],
    }),
  ],
  build: {
    cssCodeSplit: true,
    lib: {
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        react: resolve(__dirname, 'src/react.ts'),
        styles: resolve(__dirname, 'src/styles/index.scss'),
        'styles-tokens': resolve(__dirname, 'src/styles/tokens-only.scss'),
        'styles-base': resolve(__dirname, 'src/styles/base-only.scss'),
        'styles-components': resolve(
          __dirname,
          'src/styles/components-only.scss'
        ),
        'styles-utilities': resolve(
          __dirname,
          'src/styles/utilities-only.scss'
        ),
        'themes/acronis-default': resolve(
          __dirname,
          'src/styles/theme-acronis-default.scss'
        ),
        'themes/acronis-ocean': resolve(
          __dirname,
          'src/styles/theme-acronis-ocean.scss'
        ),
        'themes/cyber-chat': resolve(
          __dirname,
          'src/styles/theme-cyber-chat.scss'
        ),
        'themes/acronis-white-label': resolve(
          __dirname,
          'src/styles/theme-acronis-white-label.scss'
        ),
      },
      formats: ['es'],
      fileName: (format, entryName) => `${entryName}.js`,
    },
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        'next-themes',
        'sonner',
        '@base-ui/react',
        /^@base-ui\/react\//,
        '@radix-ui/react-accordion',
        '@radix-ui/react-checkbox',
        '@radix-ui/react-dialog',
        '@radix-ui/react-dropdown-menu',
        '@radix-ui/react-label',
        '@radix-ui/react-navigation-menu',
        '@radix-ui/react-popover',
        '@radix-ui/react-progress',
        '@radix-ui/react-radio-group',
        '@radix-ui/react-scroll-area',
        '@radix-ui/react-select',
        '@radix-ui/react-separator',
        '@radix-ui/react-slot',
        '@radix-ui/react-switch',
        '@radix-ui/react-tabs',
        '@radix-ui/react-tooltip',
      ],
      output: {
        // Enable tree-shaking by preserving module structure
        preserveModules: true,
        preserveModulesRoot: 'src',
        entryFileNames: '[name].js',
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
        assetFileNames: (assetInfo) => {
          // Tokens CSS
          if (assetInfo.name === 'styles-tokens.css') return 'tokens.css';

          // Modular builds
          if (assetInfo.name === 'styles-base.css') return 'base.css';
          if (assetInfo.name === 'styles-components.css')
            return 'components.css';
          if (assetInfo.name === 'styles-utilities.css') return 'utilities.css';

          // Main styles output
          if (
            assetInfo.name === 'style.css' ||
            assetInfo.name === 'styles.css'
          ) {
            return 'shadcn-uikit.css';
          }
          // Theme CSS files are already named correctly by cssCodeSplit
          return assetInfo.name || 'assets/[name]-[hash][extname]';
        },
      },
    },
    sourcemap: true,
    emptyOutDir: true,
  },
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
