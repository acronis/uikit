'use client';

import dynamic from 'next/dynamic';

export const SecondaryMenuBasic = dynamic(
  () =>
    import('@acronis-platform/shadcn-uikit-demos/secondary-menu').then(
      (mod) => mod.SecondaryMenuBasic
    ),
  { ssr: false }
);

export const SecondaryMenuWithIcons = dynamic(
  () =>
    import('@acronis-platform/shadcn-uikit-demos/secondary-menu').then(
      (mod) => mod.SecondaryMenuWithIcons
    ),
  { ssr: false }
);

export const SecondaryMenuWithGroups = dynamic(
  () =>
    import('@acronis-platform/shadcn-uikit-demos/secondary-menu').then(
      (mod) => mod.SecondaryMenuWithGroups
    ),
  { ssr: false }
);

export const SecondaryMenuWithTags = dynamic(
  () =>
    import('@acronis-platform/shadcn-uikit-demos/secondary-menu').then(
      (mod) => mod.SecondaryMenuWithTags
    ),
  { ssr: false }
);

export const SecondaryMenuWithRightIcons = dynamic(
  () =>
    import('@acronis-platform/shadcn-uikit-demos/secondary-menu').then(
      (mod) => mod.SecondaryMenuWithRightIcons
    ),
  { ssr: false }
);

export const SecondaryMenuWithDisabled = dynamic(
  () =>
    import('@acronis-platform/shadcn-uikit-demos/secondary-menu').then(
      (mod) => mod.SecondaryMenuWithDisabled
    ),
  { ssr: false }
);

export const SecondaryMenuComplete = dynamic(
  () =>
    import('@acronis-platform/shadcn-uikit-demos/secondary-menu').then(
      (mod) => mod.SecondaryMenuComplete
    ),
  { ssr: false }
);

export const SecondaryMenuSpecs = dynamic(
  () =>
    import('@acronis-platform/shadcn-uikit-demos/secondary-menu').then(
      (mod) => mod.SecondaryMenuSpecs
    ),
  { ssr: false }
);
