// Figma Code Connect — status: NEEDS_FIGMA_URL
// Ported from ui-legacy without a "ready for dev" Figma node. Replace
// 'FIGMA_NODE_URL' with the component link and flip to COMPLETE via
// `/figma-component Progress <url> --update`, then validate with `figma:connect`.
import figma from '@figma/code-connect';

import { Progress } from './progress';

figma.connect(Progress, 'FIGMA_NODE_URL', {
  example: () => <Progress value={40} />,
});
