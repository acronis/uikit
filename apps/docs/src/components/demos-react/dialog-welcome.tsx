'use client';

import { useState } from 'react';

import {
  Button,
  DialogWelcome,
  DialogWelcomeSlide,
} from '@acronis-platform/ui-react';

export function DialogWelcomeSingleDemo() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        Open
      </Button>
      <DialogWelcome
        open={open}
        onOpenChange={setOpen}
        aria-label="Welcome"
        onPrimaryAction={() => setOpen(false)}
      >
        <DialogWelcomeSlide
          image={null}
          title="Welcome to the new dashboard"
          description="Here's a quick look at what's new."
        />
      </DialogWelcome>
    </>
  );
}

export function DialogWelcomeCarouselDemo() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        Start tour
      </Button>
      <DialogWelcome
        open={open}
        onOpenChange={setOpen}
        aria-label="Product tour"
      >
        <DialogWelcomeSlide
          image={null}
          title="Step one"
          description="Welcome to the new dashboard."
        />
        <DialogWelcomeSlide
          image={null}
          title="Step two"
          description="Here's where your alerts live now."
        />
        <DialogWelcomeSlide
          image={null}
          title="Step three"
          description="You're all set."
        />
      </DialogWelcome>
    </>
  );
}
