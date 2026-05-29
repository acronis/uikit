import { defineConfig, Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import svgr from 'vite-plugin-svgr'

// Custom plugin to resolve @/ imports based on the importing file's location
const resolveAtAlias = (): Plugin => ({
  name: 'resolve-at-alias',
  async resolveId(source, importer) {
    if (source.startsWith('@/') && importer) {
      const fs = await import('fs')
      const extensions = ['.ts', '.tsx', '.js', '.jsx', '.mjs', '.mts', '.css', '.scss']

      // Determine base path based on importer location (normalize separators for Windows)
      const normalizedImporter = importer.replace(/\\/g, '/')
      const isFromUikit = normalizedImporter.includes('/ui/src/')
      const isFromDemos = normalizedImporter.includes('/demos/src/')
      const basePath = isFromUikit
        ? source.replace('@/', '../../packages/legacy/ui/src/')
        : isFromDemos
          ? source.replace('@/', '../demos/src/')
          : source.replace('@/', './src/')
      const baseResolved = resolve(__dirname, basePath)

      // If source already has an extension, try it directly
      if (extensions.some((ext) => source.endsWith(ext))) {
        if (fs.existsSync(baseResolved)) {
          return baseResolved
        }
      }

      // Try with each extension
      for (const ext of extensions) {
        const fullPath = baseResolved + ext
        if (fs.existsSync(fullPath)) {
          return fullPath
        }
      }

      // Try as directory with index file
      for (const ext of extensions) {
        const indexPath = resolve(baseResolved, 'index' + ext)
        if (fs.existsSync(indexPath)) {
          return indexPath
        }
      }
    }
    return null
  },
})

export default defineConfig(({ mode }) => ({
  base: process.env.VITE_BASE_PATH || '/',
  plugins: [
    react(),
    resolveAtAlias(),
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
    dedupe: ['react', 'react-dom', 'react/jsx-runtime', 'react/jsx-dev-runtime'],
    alias: {
      '@acronis-platform/shadcn-uikit-demos': resolve(__dirname, '../demos/src'),
      '@acronis-platform/shadcn-uikit/react': resolve(__dirname, '../../packages/legacy/ui/src/react.ts'),
      '@acronis-platform/shadcn-uikit/styles': resolve(__dirname, '../../packages/legacy/ui/src/styles/index.scss'),
      '@acronis-platform/shadcn-uikit': resolve(__dirname, '../../packages/legacy/ui/src/react.ts'),
      '@uikit-utils': resolve(__dirname, '../../packages/legacy/ui/src/utils'),
      'tw-animate-css/dist/tw-animate.css': resolve(
        __dirname,
        '../../packages/legacy/ui/node_modules/tw-animate-css/dist/tw-animate.css'
      ),
    },
    extensions: ['.mjs', '.js', '.mts', '.ts', '.jsx', '.tsx', '.json'],
  },
  server: {
    port: 3000,
    open: true,
  },
  optimizeDeps: {
    include: ['react', 'react-dom'],
  },
}))
