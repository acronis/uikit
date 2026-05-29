'use client';

import dynamic from 'next/dynamic';

export { ButtonGroupBasic } from '@acronis-platform/shadcn-uikit-demos/button-group';
export { ButtonGroupDaySelector } from '@acronis-platform/shadcn-uikit-demos/button-group';
export { ButtonGroupDaySelectorSmall } from '@acronis-platform/shadcn-uikit-demos/button-group';
export { ButtonGroupVertical } from '@acronis-platform/shadcn-uikit-demos/button-group';
export { ButtonGroupSizes } from '@acronis-platform/shadcn-uikit-demos/button-group';
export { ButtonGroupZoomControls } from '@acronis-platform/shadcn-uikit-demos/button-group';

// Dynamic imports for demos that reference missing-icons
export const ButtonGroupWithIcons = dynamic(
  () =>
    import('@acronis-platform/shadcn-uikit-demos/button-group').then(
      (mod) => mod.ButtonGroupWithIcons
    ),
  { ssr: false }
);

export const ButtonGroupTextAlignment = dynamic(
  () =>
    import('@acronis-platform/shadcn-uikit-demos/button-group').then(
      (mod) => mod.ButtonGroupTextAlignment
    ),
  { ssr: false }
);

export const ButtonGroupTextFormatting = dynamic(
  () =>
    import('@acronis-platform/shadcn-uikit-demos/button-group').then(
      (mod) => mod.ButtonGroupTextFormatting
    ),
  { ssr: false }
);

export const ButtonGroupWithSeparators = dynamic(
  () =>
    import('@acronis-platform/shadcn-uikit-demos/button-group').then(
      (mod) => mod.ButtonGroupWithSeparators
    ),
  { ssr: false }
);

export const ButtonGroupWithTextLabels = dynamic(
  () =>
    import('@acronis-platform/shadcn-uikit-demos/button-group').then(
      (mod) => mod.ButtonGroupWithTextLabels
    ),
  { ssr: false }
);

export const ButtonGroupMediaControls = dynamic(
  () =>
    import('@acronis-platform/shadcn-uikit-demos/button-group').then(
      (mod) => mod.ButtonGroupMediaControls
    ),
  { ssr: false }
);

export const ButtonGroupComplexToolbar = dynamic(
  () =>
    import('@acronis-platform/shadcn-uikit-demos/button-group').then(
      (mod) => mod.ButtonGroupComplexToolbar
    ),
  { ssr: false }
);
