// Figma Code Connect — status: COMPLETE
// Mapped to the "Tooltip" component in the shadcn-uikit Figma file. The Figma
// node is just the popup (a label); in code the tooltip is composed from a
// trigger plus the content popup.
import figma from '@figma/code-connect';

import { Tooltip, TooltipContent, TooltipTrigger } from './tooltip';

figma.connect(
  Tooltip,
  'https://www.figma.com/design/lrU3ydIyvPYQNE6ixdsKtJ/shadcn-uikit?node-id=1010-36',
  {
    example: () => (
      <Tooltip>
        <TooltipTrigger>Trigger</TooltipTrigger>
        <TooltipContent>Tooltip</TooltipContent>
      </Tooltip>
    ),
  }
);
