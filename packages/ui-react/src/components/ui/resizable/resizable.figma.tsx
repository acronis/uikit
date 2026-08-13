// Figma Code Connect — status: COMPLETE
// Mapped to the "Resizable" component set in the ui-react Figma file (node
// 4649:6681) — a 9px-wide draggable separator with a 1px divider and 4px each
// side. The implementation keeps those 9px as the hit area but **overlays** them on
// the panel boundary (negative margins cancel the width) instead of taking up 9px
// of layout space between the panels, which is the one place it departs from the
// node: the design frame sits between the panels, the implementation's box straddles
// their shared edge. Sizes match; only the box's contribution to layout differs.
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
