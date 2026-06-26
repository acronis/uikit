// Figma Code Connect — status: NEEDS_FIGMA_URL
// Ported from ui-legacy without a "ready for dev" Figma node. DropdownMenu is a
// compositional overlay; positioning lives on Base UI's Positioner, so there are
// no enum property mappings to verify here — only the node URL is missing.
// Replace 'FIGMA_NODE_URL' with the component-set link and flip the status to
// COMPLETE via `/figma-component DropdownMenu <url> --update`, then validate with
// `figma:connect`.
import figma from '@figma/code-connect';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './dropdown-menu';

figma.connect(DropdownMenu, 'FIGMA_NODE_URL', {
  example: () => (
    <DropdownMenu>
      <DropdownMenuTrigger>Open menu</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>My account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Profile</DropdownMenuItem>
        <DropdownMenuItem>Settings</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
});
