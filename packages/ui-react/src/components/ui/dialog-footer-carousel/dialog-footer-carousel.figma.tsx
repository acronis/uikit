// Figma Code Connect — status: COMPLETE
// The "DialogFooterCarousel" component set's `variant` (start / middle / end)
// is pinned to its own instance node below, mirroring the
// `dialog-footer-default.figma.tsx` precedent — `slideCount`/`selectedIndex`
// have no Figma property (the design shows one static state per variant), so
// each example fixes them to a representative 3-slide carousel.
import figma from '@figma/code-connect';

import { DialogFooterCarousel } from './dialog-footer-carousel';

figma.connect(
  DialogFooterCarousel,
  'https://www.figma.com/design/lrU3ydIyvPYQNE6ixdsKtJ/ui-react?node-id=6353-5873',
  {
    example: () => (
      <DialogFooterCarousel variant="start" slideCount={3} selectedIndex={0} />
    ),
  }
);

figma.connect(
  DialogFooterCarousel,
  'https://www.figma.com/design/lrU3ydIyvPYQNE6ixdsKtJ/ui-react?node-id=6353-5869',
  {
    example: () => (
      <DialogFooterCarousel variant="middle" slideCount={3} selectedIndex={1} />
    ),
  }
);

figma.connect(
  DialogFooterCarousel,
  'https://www.figma.com/design/lrU3ydIyvPYQNE6ixdsKtJ/ui-react?node-id=6353-5865',
  {
    example: () => (
      <DialogFooterCarousel variant="end" slideCount={3} selectedIndex={2} />
    ),
  }
);
