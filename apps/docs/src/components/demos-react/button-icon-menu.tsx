'use client';

import { useState } from 'react';
import { ButtonIconMenu } from '@acronis-platform/ui-react';

export function ButtonIconMenuDemo() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <ButtonIconMenu ariaLabel="Row actions" />
      <ButtonIconMenu
        ariaLabel="Backup plan actions"
        open={open}
        onClick={() => setOpen((prev) => !prev)}
      />
      <ButtonIconMenu ariaLabel="Unavailable actions" disabled />
    </>
  );
}
