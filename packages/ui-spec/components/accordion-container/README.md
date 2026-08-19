# AccordionContainer

The shared disclosure primitive behind Card's and Section's `isCollapsable`
variant. Owns open state, the trigger button, chevron rotation, and panel
animation — nothing else. It never imposes visual styling beyond what the
disclosure mechanic itself requires: no padding/background/border on `Root` or
`Content`, no position/hover opinion on `Trigger` beyond the chevron's glyph
color (matching the Figma reference). Every other visual decision (header
layout, spacing, background, borders) stays owned by the component composing
it.

> **Status: draft.** No single Figma node maps 1:1 to this component — it's a
> generic primitive factored out of Card's and Section's confirmed
> `isCollapsable` contract (Figma file `lrU3ydIyvPYQNE6ixdsKtJ`, node
> `10561:83806`). No Figma Code Connect file exists for this reason.

## When to use

- Composing a disclosure (expand/collapse) mechanic into your own component's
  header layout, where you control the header's spacing, borders, and which
  content varies by state.

## When not to use

- A standalone, generically-styled disclosure with no host component — use
  **`Collapsible`** directly.
- A vertical set of mutually-exclusive disclosure sections — use
  **`Accordion`**.

## Parts

| Export                       | Purpose                                                                              |
| ---------------------------- | ------------------------------------------------------------------------------------ |
| `AccordionContainer`         | Root — holds the open state. Renders no element when `collapsible` is false.         |
| `AccordionContainer.Trigger` | Toggles the panel; renders a rotating chevron. Renders nothing when not collapsible. |
| `AccordionContainer.Content` | The height-animating panel. Renders children unwrapped when not collapsible.         |

## Example

```tsx
import { AccordionContainer } from '@acronis-platform/ui-react';

function CollapsibleCard({ collapsible, title, children }) {
  return (
    <AccordionContainer collapsible={collapsible} defaultOpen>
      {({ open }) => (
        <>
          <div className="flex items-center justify-between border-b p-4">
            <span className="font-medium">{title}</span>
            <AccordionContainer.Trigger
              aria-label={open ? 'Collapse' : 'Expand'}
              className="size-8 rounded-md hover:bg-[var(--ui-background-surface-hover)]"
            />
          </div>
          <AccordionContainer.Content>
            <div className="p-4">{children}</div>
          </AccordionContainer.Content>
        </>
      )}
    </AccordionContainer>
  );
}
```
