// Figma Code Connect — status: NEEDS_FIGMA_URL
// Ported from ui-legacy without a "ready for dev" Figma node. Collapsible is a
// behavioral disclosure primitive (no standalone design). Replace 'FIGMA_NODE_URL'
// and flip to COMPLETE via `/figma-component Collapsible <url> --update`.
import figma from '@figma/code-connect';

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from './collapsible';

figma.connect(Collapsible, 'FIGMA_NODE_URL', {
  example: () => (
    <Collapsible>
      <CollapsibleTrigger>Toggle</CollapsibleTrigger>
      <CollapsibleContent>Content</CollapsibleContent>
    </Collapsible>
  ),
});
