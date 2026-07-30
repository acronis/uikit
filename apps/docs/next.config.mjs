import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

const isStaticExport = process.env.DOCS_STATIC_EXPORT === 'true';
const basePath = process.env.DOCS_BASE_PATH ?? '';

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  // Expose the basePath to client code. basePath auto-applies to <Link>,
  // next/image, and `_next` assets, but NOT to manual fetch() — the shadow-DOM
  // previews fetch /api/ui-react-css, which must be prefixed when deployed
  // under a subpath (e.g. /uikit/docs on GitHub Pages).
  env: {
    NEXT_PUBLIC_DOCS_BASE_PATH: basePath,
  },
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
};

export default withMDX(config);
