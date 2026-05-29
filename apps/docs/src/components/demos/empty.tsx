'use client';

import dynamic from 'next/dynamic';

export { EmptyBasic } from '@acronis-platform/shadcn-uikit-demos/empty';
export { EmptyWithAction } from '@acronis-platform/shadcn-uikit-demos/empty';
export { EmptyWithButtonAndLink } from '@acronis-platform/shadcn-uikit-demos/empty';
export { EmptyWithMultipleLinks } from '@acronis-platform/shadcn-uikit-demos/empty';
export { EmptyOnlyLinks } from '@acronis-platform/shadcn-uikit-demos/empty';
export { EmptyError } from '@acronis-platform/shadcn-uikit-demos/empty';
export { EmptyDiscoveryAgent } from '@acronis-platform/shadcn-uikit-demos/empty';

// Dynamic import for demo that references missing-icons
export const EmptyVariousStates = dynamic(
  () =>
    import('@acronis-platform/shadcn-uikit-demos/empty').then(
      (mod) => mod.EmptyVariousStates
    ),
  { ssr: false }
);
