// Figma Code Connect — status: COMPLETE
// Mapped to the "Resizable" component in the shadcn-uikit Figma file — the
// draggable handle (a 7px divider with a grab-bar pill). It has no variant
// properties; the example shows the handle composed into a panel group so the
// snippet documents real usage.
import figma from '@figma/code-connect';

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from './resizable';

figma.connect(
  ResizableHandle,
  'https://www.figma.com/design/lrU3ydIyvPYQNE6ixdsKtJ/shadcn-uikit?node-id=3476-5078',
  {
    example: () => (
      <ResizablePanelGroup orientation="horizontal">
        <ResizablePanel defaultSize={50}>Panel one</ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={50}>Panel two</ResizablePanel>
      </ResizablePanelGroup>
    ),
  }
);
