'use client';

import { useState } from 'react';

import {
  Button,
  DialogWelcome,
  DialogWelcomeSlide,
} from '@acronis-platform/ui-react';

// DialogFooterCarousel (the Back/dots/Next/Close bar) is composed inside
// DialogWelcome's `carousel` layout and reads its state from the ambient
// <Carousel> context — that context provider isn't part of the public API on
// its own, so this is the supported way to see it render. See its own docs
// page for its props.
export function DialogFooterCarouselDemo() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        Open
      </Button>
      <DialogWelcome
        open={open}
        onOpenChange={setOpen}
        aria-label="Footer demo"
      >
        <DialogWelcomeSlide
          image={null}
          title="Slide 1"
          description="First slide."
        />
        <DialogWelcomeSlide
          image={null}
          title="Slide 2"
          description="Second slide."
        />
        <DialogWelcomeSlide
          image={null}
          title="Slide 3"
          description="Third slide."
        />
      </DialogWelcome>
    </>
  );
}
