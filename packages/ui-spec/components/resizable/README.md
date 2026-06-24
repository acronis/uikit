# Resizable

A group of panels separated by draggable handles, letting users resize adjacent
regions along one axis. Composable from a panel group, panels, and handles — the
React adapter wraps [`react-resizable-panels`](https://github.com/bvaughn/react-resizable-panels).

## When to use

- Split layouts the user should be able to re-proportion: a sidebar + content, a
  list + detail (master/detail), an editor + preview.
- Any two-or-more-pane surface where a fixed split would be too rigid.

## When not to use

- Fixed layout chrome that shouldn't move — use a plain sidebar/grid.
- Reordering or moving items — that's drag-and-drop, not resizing.
- A single scrollable region — resizing needs at least two panels.

## Parts

| Part                  | Role                                                          |
| --------------------- | ------------------------------------------------------------- |
| `ResizablePanelGroup` | Container; sets the axis via `orientation` and tracks sizes.  |
| `ResizablePanel`      | A resizable region (`defaultSize` / `minSize` / `maxSize`).   |
| `ResizableHandle`     | The draggable separator; `withHandle` adds the grab-bar grip. |

## Examples

```tsx
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from '@acronis-platform/ui-react';

// Horizontal split with a visible grip
<ResizablePanelGroup orientation="horizontal" className="h-64 rounded border">
  <ResizablePanel defaultSize={30} minSize={20}>
    Sidebar
  </ResizablePanel>
  <ResizableHandle withHandle />
  <ResizablePanel defaultSize={70}>Content</ResizablePanel>
</ResizablePanelGroup>;

// Vertical split (panels stacked)
<ResizablePanelGroup orientation="vertical" className="h-96">
  <ResizablePanel defaultSize={60}>Editor</ResizablePanel>
  <ResizableHandle />
  <ResizablePanel defaultSize={40}>Preview</ResizablePanel>
</ResizablePanelGroup>;
```

> The group needs a bounded height (or width, when vertical) from its container —
> set one on the group or its parent, as in the `h-64` / `h-96` above.

## Theming

Colors, sizes, and the cursor come from the `--ui-resizable-*` token tier in
`@acronis-platform/tokens-pd` (generated from `@acronis-platform/design-tokens`)
and resolve per brand/theme — see `tokens.yaml`. Don't hard-code values.
