// Figma Code Connect — status: NEEDS_FIGMA_URL
// Ported from ui-legacy without a "ready for dev" Figma node. Replace
// 'FIGMA_NODE_URL' with the component link and flip to COMPLETE via
// `/figma-component Separator <url> --update`, then validate with `figma:connect`.
import figma from '@figma/code-connect';

import { Separator } from './separator';

figma.connect(Separator, 'FIGMA_NODE_URL', {
  props: {
    orientation: figma.enum('orientation', {
      horizontal: 'horizontal',
      vertical: 'vertical',
    }),
  },
  example: ({ orientation }) => <Separator orientation={orientation} />,
});
