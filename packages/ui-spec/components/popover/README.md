# Popover

A floating panel anchored to a trigger, shown on demand for secondary content or
quick actions. Built on the Base UI Popover primitive.

> Ported from the legacy `@acronis-platform/shadcn-uikit` `Popover`. Container
> chrome is themed by the `--ui-popover-*` tier; the optional `PopoverBody` /
> `PopoverFooter` parts (body rhythm, default action-row footer) are themed by
> `--ui-popover-body-*` and the shared `--ui-footer-*` tier. Enter/exit
> animations use `tw-animate-css`.

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
| `PopoverBody`    | `div`              | Optional vertical-rhythm wrapper for content.  |
| `PopoverFooter`  | `div`              | Optional default action-row footer.            |

## Example

```tsx
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  Button,
} from '@acronis-platform/ui-react';

<Popover>
  <PopoverTrigger render={<Button variant="secondary">Open</Button>} />
  <PopoverContent side="bottom" align="center">
    <PopoverBody>
      <h4 className="font-medium leading-none">Dimensions</h4>
      <p className="text-sm text-muted-foreground">
        Set the dimensions for the layer.
      </p>
    </PopoverBody>
  </PopoverContent>
</Popover>;
```

With the default action-row footer (the Figma "Popover" recipe — Cancel + Apply):

```tsx
import { PopoverFooter } from '@acronis-platform/ui-react';

<PopoverContent>
  <PopoverBody>Drop any content into this slot.</PopoverBody>
  <PopoverFooter>
    <Button variant="secondary">Cancel</Button>
    <Button>Apply</Button>
  </PopoverFooter>
</PopoverContent>;
```

For an isolated container (e.g. a shadow root), pass `portalContainer` so the
popup inherits that scope's styles. When portaled into a resolved
`portalContainer`, `PopoverContent` also defaults `positionMethod` to `'fixed'`
so the popup escapes a plain overflow-clipping ancestor (e.g. a Shadow DOM host
with `overflow: hidden`) instead of being clipped at the container's edge.
