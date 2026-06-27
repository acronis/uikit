// Figma Code Connect — status: NEEDS_FIGMA_URL
// Layout primitive ported from ui-legacy; no dedicated Figma node. Replace
// 'FIGMA_NODE_URL' and flip to COMPLETE via `/figma-component Stack <url> --update`.
import figma from '@figma/code-connect';

import { Stack } from './stack';

figma.connect(Stack, 'FIGMA_NODE_URL', {
  props: {
    direction: figma.enum('Direction', { vertical: 'vertical', horizontal: 'horizontal' }),
  },
  example: ({ direction }) => <Stack direction={direction} />,
});
