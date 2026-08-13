// Figma Code Connect — status: COMPLETE
// Mapped to the "Resizable" component set in the ui-react Figma file (node
// 4649:6681) — a draggable separator with a 1px divider, whose hit area overlays
// the panel boundary instead of taking up layout space between the panels.
// The component set has a `state` variant (idle/hover/active/focus) that
// documents interaction states; these map to CSS pseudo-classes, not props.
// The example shows the handle composed into a panel group.
import figma from '@figma/code-connect';

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from './resizable';

figma.connect(
  ResizableHandle,
  'https://www.figma.com/design/lrU3ydIyvPYQNE6ixdsKtJ/ui-react?node-id=4649-6681',
  {
    example: () => (
      <ResizablePanelGroup orientation="horizontal">
        <ResizablePanel defaultSize={50}>Panel one</ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={50}>Panel two</ResizablePanel>
      </ResizablePanelGroup>
    ),
  }
);
