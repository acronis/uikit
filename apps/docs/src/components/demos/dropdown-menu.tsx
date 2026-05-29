'use client';

import dynamic from 'next/dynamic';

export { DropdownMenuWithCheckboxes } from '@acronis-platform/shadcn-uikit-demos/dropdown-menu';
export { DropdownMenuWithRadio } from '@acronis-platform/shadcn-uikit-demos/dropdown-menu';
export { DropdownMenuVariants } from '@acronis-platform/shadcn-uikit-demos/dropdown-menu';
export { DropdownMenuWithSearch } from '@acronis-platform/shadcn-uikit-demos/dropdown-menu';
export { DropdownMenuDisabled } from '@acronis-platform/shadcn-uikit-demos/dropdown-menu';
export { DropdownMenuAlignments } from '@acronis-platform/shadcn-uikit-demos/dropdown-menu';

// Dynamic imports for demos that reference missing-icons
export const DropdownMenuBasic = dynamic(
  () =>
    import('@acronis-platform/shadcn-uikit-demos/dropdown-menu').then(
      (mod) => mod.DropdownMenuBasic
    ),
  { ssr: false }
);

export const DropdownMenuWithLabels = dynamic(
  () =>
    import('@acronis-platform/shadcn-uikit-demos/dropdown-menu').then(
      (mod) => mod.DropdownMenuWithLabels
    ),
  { ssr: false }
);

export const DropdownMenuWithIcons = dynamic(
  () =>
    import('@acronis-platform/shadcn-uikit-demos/dropdown-menu').then(
      (mod) => mod.DropdownMenuWithIcons
    ),
  { ssr: false }
);

export const DropdownMenuWithSubmenu = dynamic(
  () =>
    import('@acronis-platform/shadcn-uikit-demos/dropdown-menu').then(
      (mod) => mod.DropdownMenuWithSubmenu
    ),
  { ssr: false }
);

export const DropdownMenuMultipleSections = dynamic(
  () =>
    import('@acronis-platform/shadcn-uikit-demos/dropdown-menu').then(
      (mod) => mod.DropdownMenuMultipleSections
    ),
  { ssr: false }
);

export const DropdownMenuComplex = dynamic(
  () =>
    import('@acronis-platform/shadcn-uikit-demos/dropdown-menu').then(
      (mod) => mod.DropdownMenuComplex
    ),
  { ssr: false }
);
