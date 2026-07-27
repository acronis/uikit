'use client';

import { useState } from 'react';
import { Button, Dialog } from '@acronis-platform/ui-react';

export function DialogDemo() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        Open dialog
      </Button>
      <Dialog
        variant="discard changes"
        open={open}
        onOpenChange={setOpen}
        onPrimaryAction={() => setOpen(false)}
      />
    </>
  );
}
