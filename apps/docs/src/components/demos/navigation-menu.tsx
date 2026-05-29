'use client';

import dynamic from 'next/dynamic';

export const NavigationMenuSimple = dynamic(
  () =>
    import('@acronis-platform/shadcn-uikit-demos/navigation-menu').then(
      (mod) => mod.NavigationMenuSimple
    ),
  { ssr: false }
);

export const NavigationMenuHorizontal = dynamic(
  () =>
    import('@acronis-platform/shadcn-uikit-demos/navigation-menu').then(
      (mod) => mod.NavigationMenuHorizontal
    ),
  { ssr: false }
);

export const NavigationMenuWithIcons = dynamic(
  () =>
    import('@acronis-platform/shadcn-uikit-demos/navigation-menu').then(
      (mod) => mod.NavigationMenuWithIcons
    ),
  { ssr: false }
);

export const NavigationMenuSecondaryTab = dynamic(
  () =>
    import('@acronis-platform/shadcn-uikit-demos/navigation-menu').then(
      (mod) => mod.NavigationMenuSecondaryTab
    ),
  { ssr: false }
);
