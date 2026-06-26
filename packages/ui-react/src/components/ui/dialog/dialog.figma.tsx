// Figma Code Connect — status: NEEDS_FIGMA_URL
// Ported from ui-legacy without a "ready for dev" Figma node. Dialog is a
// compositional overlay (no variant/size props), so there are no property
// mappings to verify — only the node URL is missing. Replace 'FIGMA_NODE_URL'
// with the component-set link and flip the status to COMPLETE via
// `/figma-component Dialog <url> --update`, then validate with `figma:connect`.
import figma from '@figma/code-connect';

import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './dialog';

figma.connect(Dialog, 'FIGMA_NODE_URL', {
  example: () => (
    <Dialog defaultOpen>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Title</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <DialogDescription>Description</DialogDescription>
        </DialogBody>
        <DialogFooter>Actions</DialogFooter>
      </DialogContent>
    </Dialog>
  ),
});
