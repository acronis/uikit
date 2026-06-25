'use client';

import { ButtonMenu } from '@acronis-platform/ui-react';

export function ButtonMenuDemo() {
  return (
    <>
      <ButtonMenu variant="primary">Actions</ButtonMenu>
      <ButtonMenu variant="secondary">Filter</ButtonMenu>
      <ButtonMenu variant="secondary" open>
        Sort by
      </ButtonMenu>
    </>
  );
}
