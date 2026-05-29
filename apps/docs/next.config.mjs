import { createMDX } from 'fumadocs-mdx/next';
import { createRequire } from 'node:module';
import { dirname } from 'node:path';

const require = createRequire(import.meta.url);
const withMDX = createMDX();

// The ui package's dist bundles cmdk and vaul with pnpm-store node_modules
// paths that can't resolve @radix-ui/react-dialog. We alias the import so
// webpack can find it from the docs package's own dependencies.
const radixDialogDir = dirname(require.resolve('@radix-ui/react-dialog'));
// Force a single sonner instance across the bundle. apps/demos uses React 18
// peers so pnpm installs a separate sonner build; without this alias, toast()
// from demos fires on a different event bus than the <Toaster> in the docs layout.
const sonnerDir = dirname(require.resolve('sonner'));

const isStaticExport = process.env.DOCS_STATIC_EXPORT === 'true';
const basePath = process.env.DOCS_BASE_PATH ?? '';

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  transpilePackages: ['@acronis-platform/shadcn-uikit-demos'],
  // Skip type checking during build -- the monorepo has @types/react version
  // conflicts between the root (v18) and docs (v19) packages that cause false
  // positives. Type checking is done separately via tsc.
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Static export for GitHub Pages deployment (set DOCS_STATIC_EXPORT=true)
  ...(isStaticExport && {
    output: 'export',
    basePath,
    images: { unoptimized: true },
  }),
  webpack: (config) => {
    config.resolve.alias['@radix-ui/react-dialog'] = radixDialogDir;
    config.resolve.alias['sonner'] = sonnerDir;
    return config;
  },
};

export default withMDX(config);
