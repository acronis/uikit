// Figma Code Connect — status: NEEDS_FIGMA_URL
// Ported from ui-legacy without a "ready for dev" Figma node. ScrollArea is a
// compositional component (its only prop is the structural `orientation`), so
// there are no visual variant mappings to verify — only the node URL is missing.
// Replace 'FIGMA_NODE_URL' with the component link and flip the status to
// COMPLETE via `/figma-component ScrollArea <url> --update`, then validate with
// `figma:connect`.
import figma from '@figma/code-connect';

import { ScrollArea } from './scroll-area';

figma.connect(ScrollArea, 'FIGMA_NODE_URL', {
  props: {
    orientation: figma.enum('Orientation', {
      vertical: 'vertical',
      horizontal: 'horizontal',
      both: 'both',
    }),
  },
  example: ({ orientation }) => (
    <ScrollArea orientation={orientation} className="h-72">
      Content
    </ScrollArea>
  ),
});
