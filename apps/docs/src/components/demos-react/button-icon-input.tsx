'use client';

import { ButtonIconInput } from '@acronis-platform/ui-react';
import { EyeIcon, TimesIcon } from '@acronis-platform/icons-react/stroke-mono';

export function ButtonIconInputDemo() {
  return (
    <>
      <ButtonIconInput aria-label="Show password">
        <EyeIcon />
      </ButtonIconInput>
      <ButtonIconInput variant="error" aria-label="Clear">
        <TimesIcon />
      </ButtonIconInput>
      <ButtonIconInput aria-label="Clear" disabled>
        <TimesIcon />
      </ButtonIconInput>
    </>
  );
}
