// Figma Code Connect — status: NEEDS_FIGMA_URL
// Ported from ui-legacy without a "ready for dev" Figma node. Popover is a
// compositional overlay; the positioning props live on Base UI's Positioner, so
// there are no enum property mappings to verify here — only the node URL is
// missing. Replace 'FIGMA_NODE_URL' with the component-set link and flip the
// status to COMPLETE via `/figma-component Popover <url> --update`, then validate
// with `figma:connect`.
import figma from '@figma/code-connect';

import { Popover, PopoverContent, PopoverTrigger } from './popover';

figma.connect(Popover, 'FIGMA_NODE_URL', {
  example: () => (
    <Popover>
      <PopoverTrigger>Open</PopoverTrigger>
      <PopoverContent>Popover content</PopoverContent>
    </Popover>
  ),
});
