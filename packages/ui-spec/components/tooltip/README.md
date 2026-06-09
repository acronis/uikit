# Tooltip

A contextual hint shown on hover or focus of its trigger.

## When to use

- Supplementary information that clarifies an element or action (e.g. what an
  icon button does) without cluttering the UI.

## When not to use

- Critical information or actions — tooltips aren't available to touch users and
  disappear on blur. Use inline text, a Popover, or a Dialog.
- Rich or interactive content — the popup is non-interactive. Use a Popover.

## Anatomy

A composable set of parts:

| Part              | Element    | Role      | Purpose                        |
| ----------------- | ---------- | --------- | ------------------------------ |
| `Tooltip`         | — (no DOM) | —         | Owns open state.               |
| `TooltipTrigger`  | `button`   | —         | The anchor (wrap any element). |
| `TooltipContent`  | `div`      | `tooltip` | The floating hint bubble.      |
| `TooltipProvider` | — (no DOM) | —         | Shares open/close delays.      |

## Examples

```tsx
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from '@acronis-platform/ui-react';
import { Button } from '@acronis-platform/ui-react';

// Wrap your app (or a region) once to share delays:
<TooltipProvider delay={300}>
  <Tooltip>
    <TooltipTrigger render={<Button>Save</Button>} />
    <TooltipContent>Save your changes</TooltipContent>
  </Tooltip>
</TooltipProvider>;
```

`TooltipContent` accepts `side` / `align` / `sideOffset` to control placement. No
arrow is rendered, matching the design.
