// Figma Code Connect — status: COMPLETE
// Mapped to the "DialogFooterCarousel" node in the ui-react Figma file (fileKey
// lrU3ydIyvPYQNE6ixdsKtJ), which wraps the "CarouselDialog" row (variant
// first/middle/last). DialogFooterCarousel has no `variant` prop of its own —
// the row/bar state is derived from the ambient <Carousel /> context, not set
// directly — so the Figma variant is mapped to the `opts.startIndex` that
// actually produces it in a real 3-slide Carousel.
import figma from '@figma/code-connect';

import { Carousel, CarouselContent, CarouselItem } from '../carousel';
import { DialogFooterCarousel } from './dialog-footer-carousel';

figma.connect(
  DialogFooterCarousel,
  'https://www.figma.com/design/lrU3ydIyvPYQNE6ixdsKtJ/ui-react?node-id=6353-5864',
  {
    props: {
      startIndex: figma.enum('variant', {
        first: 0,
        middle: 1,
        last: 2,
      }),
    },
    example: ({ startIndex }) => (
      <Carousel opts={{ startIndex }}>
        <CarouselContent>
          <CarouselItem>Slide 1</CarouselItem>
          <CarouselItem>Slide 2</CarouselItem>
          <CarouselItem>Slide 3</CarouselItem>
        </CarouselContent>
        <DialogFooterCarousel />
      </Carousel>
    ),
  }
);
