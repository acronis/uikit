'use client';

import { useState } from 'react';
import { DialogFooterCarousel } from '@acronis-platform/ui-react';

export function DialogFooterCarouselDemo() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const slideCount = 3;

  const variant =
    selectedIndex === 0 ? 'start' : selectedIndex === slideCount - 1 ? 'end' : 'middle';

  return (
    <DialogFooterCarousel
      className="w-full max-w-[512px]"
      variant={variant}
      slideCount={slideCount}
      selectedIndex={selectedIndex}
      onSelectIndex={setSelectedIndex}
      onBack={() => setSelectedIndex((index) => Math.max(index - 1, 0))}
      onNext={() => setSelectedIndex((index) => Math.min(index + 1, slideCount - 1))}
    />
  );
}
