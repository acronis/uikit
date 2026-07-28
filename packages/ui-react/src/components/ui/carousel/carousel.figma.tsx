// Figma Code Connect — status: NEEDS_FIGMA_URL
// Ported from ui-legacy without a "ready for dev" Figma node. Carousel is a
// compositional slider (no variant/size props on the root), so there are no
// property mappings to verify — only the node URL is missing. Replace
// 'FIGMA_NODE_URL' with the component-set link and flip the status to
// COMPLETE via `/figma-component Carousel <url> --update`, then validate with
// `figma:connect`.
import figma from '@figma/code-connect';

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from './carousel';

figma.connect(Carousel, 'FIGMA_NODE_URL', {
  example: () => (
    <Carousel className="w-full max-w-xs">
      <CarouselContent>
        <CarouselItem>Slide 1</CarouselItem>
        <CarouselItem>Slide 2</CarouselItem>
        <CarouselItem>Slide 3</CarouselItem>
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  ),
});
