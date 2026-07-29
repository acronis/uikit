// Figma Code Connect — status: COMPLETE
// The "CarouselDialog" node isolates three fixed instances for the
// first/middle/last footer states — same shape as
// `dialog-footer-carousel.figma.tsx`: one `figma.connect` call per variant,
// each fixed to a representative 3-slide carousel. `slideCount`/
// `selectedIndex` have no Figma property (the design shows one static state
// per variant); the nested Button's label is a descendant property, not
// exposed on the component itself, so it isn't mapped.
import figma from '@figma/code-connect';

import { CarouselDialog } from './carousel-dialog';

figma.connect(
  CarouselDialog,
  'https://www.figma.com/design/lrU3ydIyvPYQNE6ixdsKtJ/ui-react?node-id=6353-4718',
  {
    example: () => (
      <CarouselDialog variant="first" slideCount={3} selectedIndex={0} />
    ),
  }
);

figma.connect(
  CarouselDialog,
  'https://www.figma.com/design/lrU3ydIyvPYQNE6ixdsKtJ/ui-react?node-id=6353-4891',
  {
    example: () => (
      <CarouselDialog variant="middle" slideCount={3} selectedIndex={1} />
    ),
  }
);

figma.connect(
  CarouselDialog,
  'https://www.figma.com/design/lrU3ydIyvPYQNE6ixdsKtJ/ui-react?node-id=6353-4922',
  {
    example: () => (
      <CarouselDialog variant="last" slideCount={3} selectedIndex={2} />
    ),
  }
);
