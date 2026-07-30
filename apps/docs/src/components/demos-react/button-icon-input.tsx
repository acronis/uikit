'use client';

import { useState } from 'react';
import { ButtonIconInput } from '@acronis-platform/ui-react';
import { EyeIcon, EyeCrossedIcon, TimesIcon } from '@acronis-platform/icons-react/stroke-mono';

export function ButtonIconInputDemo() {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <ButtonIconInput
        aria-label={visible ? 'Hide password' : 'Show password'}
        aria-pressed={visible}
        onClick={() => setVisible((prev) => !prev)}
      >
        {visible ? <EyeIcon /> : <EyeCrossedIcon />}
      </ButtonIconInput>
      <ButtonIconInput aria-label="Clear">
        <TimesIcon />
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
