'use client';

import dynamic from 'next/dynamic';

export { ChipBasic } from '@acronis-platform/shadcn-uikit-demos/chip';
export { ChipRemovable } from '@acronis-platform/shadcn-uikit-demos/chip';

// Dynamic imports for demos that reference missing-icons
export const ChipWithIcons = dynamic(
  () =>
    import('@acronis-platform/shadcn-uikit-demos/chip').then(
      (mod) => mod.ChipWithIcons
    ),
  { ssr: false }
);

export const ChipWithIconsRemovable = dynamic(
  () =>
    import('@acronis-platform/shadcn-uikit-demos/chip').then(
      (mod) => mod.ChipWithIconsRemovable
    ),
  { ssr: false }
);

export const ChipFilters = dynamic(
  () =>
    import('@acronis-platform/shadcn-uikit-demos/chip').then(
      (mod) => mod.ChipFilters
    ),
  { ssr: false }
);
