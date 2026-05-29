'use client';

import dynamic from 'next/dynamic';

export const TreeBasic = dynamic(
  () =>
    import('@acronis-platform/shadcn-uikit-demos/tree').then(
      (mod) => mod.TreeBasic
    ),
  { ssr: false }
);

export const TreeWithIcons = dynamic(
  () =>
    import('@acronis-platform/shadcn-uikit-demos/tree').then(
      (mod) => mod.TreeWithIcons
    ),
  { ssr: false }
);

export const TreeWithCheckboxes = dynamic(
  () =>
    import('@acronis-platform/shadcn-uikit-demos/tree').then(
      (mod) => mod.TreeWithCheckboxes
    ),
  { ssr: false }
);

export const TreeWithIconsAndCheckboxes = dynamic(
  () =>
    import('@acronis-platform/shadcn-uikit-demos/tree').then(
      (mod) => mod.TreeWithIconsAndCheckboxes
    ),
  { ssr: false }
);

export const TreeFileSystem = dynamic(
  () =>
    import('@acronis-platform/shadcn-uikit-demos/tree').then(
      (mod) => mod.TreeFileSystem
    ),
  { ssr: false }
);

export const TreeProjectStructure = dynamic(
  () =>
    import('@acronis-platform/shadcn-uikit-demos/tree').then(
      (mod) => mod.TreeProjectStructure
    ),
  { ssr: false }
);

export const TreeOrganization = dynamic(
  () =>
    import('@acronis-platform/shadcn-uikit-demos/tree').then(
      (mod) => mod.TreeOrganization
    ),
  { ssr: false }
);

export const TreeControlled = dynamic(
  () =>
    import('@acronis-platform/shadcn-uikit-demos/tree').then(
      (mod) => mod.TreeControlled
    ),
  { ssr: false }
);

export const TreeDeepNesting = dynamic(
  () =>
    import('@acronis-platform/shadcn-uikit-demos/tree').then(
      (mod) => mod.TreeDeepNesting
    ),
  { ssr: false }
);

export const TreeMixedContent = dynamic(
  () =>
    import('@acronis-platform/shadcn-uikit-demos/tree').then(
      (mod) => mod.TreeMixedContent
    ),
  { ssr: false }
);
