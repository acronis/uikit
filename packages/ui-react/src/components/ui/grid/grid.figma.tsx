// Figma Code Connect — status: NEEDS_FIGMA_URL
// Layout primitive ported from ui-legacy; no dedicated Figma node. Replace
// 'FIGMA_NODE_URL' and flip to COMPLETE via `/figma-component Grid <url> --update`.
import figma from '@figma/code-connect';

import { Grid } from './grid';

figma.connect(Grid, 'FIGMA_NODE_URL', {
  example: () => <Grid cols={3} />,
});
