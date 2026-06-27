// Figma Code Connect — status: NEEDS_FIGMA_URL
// Ported from ui-legacy without a wired "ready for dev" node. The intended design
// is Cyber-Compliance node 3442-31542 (the side panel that was `Details` in Vue).
// Replace 'FIGMA_NODE_URL' and flip to COMPLETE via
// `/figma-component Sheet <url> --update`, then validate with `figma:connect`.
import figma from '@figma/code-connect';

import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from './sheet';

figma.connect(Sheet, 'FIGMA_NODE_URL', {
  props: {
    side: figma.enum('side', {
      left: 'left',
      right: 'right',
      top: 'top',
      bottom: 'bottom',
    }),
  },
  example: ({ side }) => (
    <Sheet>
      <SheetContent side={side}>
        <SheetHeader>
          <SheetTitle>Details</SheetTitle>
        </SheetHeader>
        <SheetBody>Panel content</SheetBody>
      </SheetContent>
    </Sheet>
  ),
});
