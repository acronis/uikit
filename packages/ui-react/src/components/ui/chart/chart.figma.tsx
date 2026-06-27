// Figma Code Connect — status: NEEDS_FIGMA_URL
// Ported from ui-legacy without a "ready for dev" Figma node. Chart is a thin
// theming layer over recharts (container + tooltip/legend chrome); a Figma node
// would map a representative chart frame. Replace 'FIGMA_NODE_URL' and flip to
// COMPLETE via `/figma-component Chart <url> --update`.
import figma from '@figma/code-connect';

import { ChartContainer } from './chart';

figma.connect(ChartContainer, 'FIGMA_NODE_URL', {
  example: () => (
    <ChartContainer config={{}}>
      <div />
    </ChartContainer>
  ),
});
