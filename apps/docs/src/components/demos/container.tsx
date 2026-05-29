'use client';

import dynamic from 'next/dynamic';

// Dynamic import to avoid SSR failure from window reference
export const ContainerResponsive = dynamic(
  () =>
    import('@acronis-platform/shadcn-uikit-demos/container').then(
      (mod) => mod.ContainerResponsive
    ),
  { ssr: false }
);
