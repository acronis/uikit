# Popover

A floating panel anchored to a trigger, shown on demand for secondary content or
quick actions. Built on the Base UI Popover primitive.

> **Status: draft (design-pending v1).** Ported from the legacy
> `@acronis-platform/shadcn-uikit` `Popover`. No `--ui-popover-*` token tier yet,
> so the popup uses the shared semantic surface tokens (`bg-background` /
> `text-foreground` / `border-border`); enter/exit animations use `tw-animate-css`.
> Reconcile with `/figma-component Popover <url> --update` once a mockup lands.

## When to use

- Showing secondary content or a small set of controls anchored to a trigger
  (a filter form, a quick edit, extra detail) without leaving the page.

## When not to use

- For a blocking decision or a focused task — use a **Dialog** (modal).
- For a short, non-interactive hint on hover/focus — use a **Tooltip**.
- For a list of actions/commands — use a menu.

## Parts

| Part             | Element            | Purpose                                        |
| ---------------- | ------------------ | ---------------------------------------------- |
| `Popover`        | — (Root)           | Owns the open state.                           |
| `PopoverTrigger` | `button`           | Toggles and anchors the popover.               |
| `PopoverContent` | `div[role=dialog]` | The portaled, positioned popup panel.          |
| `PopoverPortal`  | —                  | Lower-level portal (`PopoverContent` uses it). |

## Example

```tsx
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Button,
} from '@acronis-platform/ui-react';

<Popover>
  <PopoverTrigger render={<Button variant="secondary">Open</Button>} />
  <PopoverContent side="bottom" align="center">
    <div className="grid gap-2">
      <h4 className="font-medium leading-none">Dimensions</h4>
      <p className="text-sm text-muted-foreground">
        Set the dimensions for the layer.
      </p>
    </div>
  </PopoverContent>
</Popover>;
```

For an isolated container (e.g. a shadow root), pass `portalContainer` so the
popup inherits that scope's styles.
