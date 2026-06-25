'use client';

import { ButtonIcon } from '@acronis-platform/ui-react';
import { PlusIcon, PencilIcon, CogIcon } from '@acronis-platform/icons-react/stroke-mono';

export function ButtonIconDemo() {
  return (
    <>
      <ButtonIcon variant="ghost" aria-label="Add">
        <PlusIcon />
      </ButtonIcon>
      <ButtonIcon variant="secondary" aria-label="Edit">
        <PencilIcon />
      </ButtonIcon>
      <ButtonIcon variant="secondary" aria-label="Settings" disabled>
        <CogIcon />
      </ButtonIcon>
    </>
  );
}
