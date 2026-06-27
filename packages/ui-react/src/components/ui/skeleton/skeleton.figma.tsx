// Figma Code Connect — status: NEEDS_FIGMA_URL
// Ported from ui-legacy without a "ready for dev" Figma node. Skeleton is a styled
// placeholder box; a Figma node would map a loading-state shape. Replace
// 'FIGMA_NODE_URL' and flip to COMPLETE via `/figma-component Skeleton <url> --update`.
import figma from '@figma/code-connect';

import { Skeleton } from './skeleton';

figma.connect(Skeleton, 'FIGMA_NODE_URL', {
  example: () => <Skeleton className="h-4 w-[250px]" />,
});
