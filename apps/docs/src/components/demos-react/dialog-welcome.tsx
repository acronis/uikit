'use client';

import { useState } from 'react';
import { Button, DialogWelcome } from '@acronis-platform/ui-react';

const FEATURE_SLIDES = [
  {
    title: 'Automated backups',
    description: 'Your data is backed up on a schedule you control.',
  },
  {
    title: 'Instant recovery',
    description: 'Restore a full workload in minutes, not hours.',
  },
  {
    title: 'Built-in protection',
    description: 'Ransomware detection runs on every backup automatically.',
  },
];

export function DialogWelcomeDemo() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        Open dialog
      </Button>
      <DialogWelcome
        variant="carousel"
        slides={FEATURE_SLIDES}
        open={open}
        onOpenChange={setOpen}
        onPrimaryAction={() => setOpen(false)}
      />
    </>
  );
}
