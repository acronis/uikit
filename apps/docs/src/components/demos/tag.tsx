'use client';

import dynamic from 'next/dynamic';

export const TagDefault = dynamic(
  () =>
    import('@acronis-platform/shadcn-uikit-demos/tag').then(
      (mod) => mod.TagDefault
    ),
  { ssr: false }
);

export const TagSmall = dynamic(
  () =>
    import('@acronis-platform/shadcn-uikit-demos/tag').then(
      (mod) => mod.TagSmall
    ),
  { ssr: false }
);

export const TagWithIcons = dynamic(
  () =>
    import('@acronis-platform/shadcn-uikit-demos/tag').then(
      (mod) => mod.TagWithIcons
    ),
  { ssr: false }
);

export const TagSmallWithIcons = dynamic(
  () =>
    import('@acronis-platform/shadcn-uikit-demos/tag').then(
      (mod) => mod.TagSmallWithIcons
    ),
  { ssr: false }
);

export const TagStatus = dynamic(
  () =>
    import('@acronis-platform/shadcn-uikit-demos/tag').then(
      (mod) => mod.TagStatus
    ),
  { ssr: false }
);

export const TagPriority = dynamic(
  () =>
    import('@acronis-platform/shadcn-uikit-demos/tag').then(
      (mod) => mod.TagPriority
    ),
  { ssr: false }
);

export const TagSecurity = dynamic(
  () =>
    import('@acronis-platform/shadcn-uikit-demos/tag').then(
      (mod) => mod.TagSecurity
    ),
  { ssr: false }
);

export const TagFeature = dynamic(
  () =>
    import('@acronis-platform/shadcn-uikit-demos/tag').then(
      (mod) => mod.TagFeature
    ),
  { ssr: false }
);

export const TagEnvironment = dynamic(
  () =>
    import('@acronis-platform/shadcn-uikit-demos/tag').then(
      (mod) => mod.TagEnvironment
    ),
  { ssr: false }
);

export const TagVersion = dynamic(
  () =>
    import('@acronis-platform/shadcn-uikit-demos/tag').then(
      (mod) => mod.TagVersion
    ),
  { ssr: false }
);

export const TagCategory = dynamic(
  () =>
    import('@acronis-platform/shadcn-uikit-demos/tag').then(
      (mod) => mod.TagCategory
    ),
  { ssr: false }
);

export const TagMixedSizes = dynamic(
  () =>
    import('@acronis-platform/shadcn-uikit-demos/tag').then(
      (mod) => mod.TagMixedSizes
    ),
  { ssr: false }
);
