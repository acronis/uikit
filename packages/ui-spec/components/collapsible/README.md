# Collapsible

A disclosure primitive: a trigger toggles a height-animating panel. Built on Base
UI's Collapsible — it's the primitive behind `Accordion` and the sidebars.

> Design-pending v1, ported from the legacy shadcn-uikit `collapsible`.

## When to use

- Show/hide a single section of optional content under a trigger.

## When not to use

- A set of mutually-exclusive sections — use `Accordion`.

## Parts

| Export               | Purpose                      |
| -------------------- | ---------------------------- |
| `Collapsible`        | Root — holds the open state. |
| `CollapsibleTrigger` | Toggles the panel.           |
| `CollapsibleContent` | The height-animating panel.  |

## Example

```tsx
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from '@acronis-platform/ui-react';

<Collapsible>
  <CollapsibleTrigger>Show advanced settings</CollapsibleTrigger>
  <CollapsibleContent>…</CollapsibleContent>
</Collapsible>;
```
