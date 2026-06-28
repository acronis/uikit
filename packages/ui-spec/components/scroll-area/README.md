# ScrollArea

A scrollable region with a custom **overlay** scrollbar built on the Base UI
Scroll Area primitive. The bar floats over the content and reserves **no**
layout space, so full-bleed content is never cropped by a scrollbar gutter — on
every OS and browser, not just where the platform happens to provide overlay
scrollbars. It is hidden at rest and revealed on hover/scroll.

> Design-pending v1: ported from the legacy shadcn-uikit `ScrollArea`. No Figma
> node yet; reconcile with `/figma-component ScrollArea <url> --update` once a
> design lands.

## When to use

- A fixed-height (or fixed-width) region whose content can overflow — sidebars,
  menus, popovers, lists, code blocks, image strips.
- Anywhere a native `overflow: auto` scrollbar's **reserved gutter** would crop
  edge-to-edge content (e.g. a sidebar's full-width selected row) or shift the
  layout when the scrollbar appears.

## When not to use

- Page-level / document scrolling — let the browser own that.
- Very large/virtualized data sets — pair a virtualizer with the viewport, or
  use a component designed for virtualization.

## Examples

```tsx
import { ScrollArea } from '@acronis-platform/ui-react';

<ScrollArea className="h-72 w-64 rounded-md border border-border">
  {longList}
</ScrollArea>;
```

```tsx
// Both axes (renders the corner too)
<ScrollArea orientation="both" className="h-72 w-96">
  {wideTallContent}
</ScrollArea>
```

```tsx
// Compose the parts directly for custom scrollbar placement
import { ScrollArea, ScrollBar } from '@acronis-platform/ui-react';

<ScrollArea orientation="horizontal">
  {row}
  <ScrollBar orientation="horizontal" />
</ScrollArea>;
```

## Parts

| Part         | Element | Notes                                                         |
| ------------ | ------- | ------------------------------------------------------------- |
| `ScrollArea` | `div`   | Root + viewport + content + built-in scrollbar(s) (+ corner). |
| `ScrollBar`  | `div`   | Standalone overlay scrollbar (track + thumb); `orientation`.  |

## Props

- `orientation` — `'vertical'` (default) · `'horizontal'` · `'both'`. Selects
  the built-in scrollbar(s); `'both'` also renders the corner.
- All other props pass through to the Base UI `ScrollArea.Root`.
