'use client';

import dynamic from 'next/dynamic';

export { InputBasic } from '@acronis-platform/shadcn-uikit-demos/input';
export { InputTypes } from '@acronis-platform/shadcn-uikit-demos/input';
export { InputWithLabels } from '@acronis-platform/shadcn-uikit-demos/input';
export { InputWithIcons } from '@acronis-platform/shadcn-uikit-demos/input';
export { InputDisabled } from '@acronis-platform/shadcn-uikit-demos/input';
export { InputRequired } from '@acronis-platform/shadcn-uikit-demos/input';
export { InputWithHelper } from '@acronis-platform/shadcn-uikit-demos/input';
export { InputError } from '@acronis-platform/shadcn-uikit-demos/input';
export { InputSizes } from '@acronis-platform/shadcn-uikit-demos/input';
export { InputForm } from '@acronis-platform/shadcn-uikit-demos/input';
export { InputSearch } from '@acronis-platform/shadcn-uikit-demos/input';

// Dynamic import for demo that references missing-icons
export const InputVariousTypes = dynamic(
  () =>
    import('@acronis-platform/shadcn-uikit-demos/input').then(
      (mod) => mod.InputVariousTypes
    ),
  { ssr: false }
);
