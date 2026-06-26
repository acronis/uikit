# Dialog

A modal overlay that interrupts the user to show focused content or request a
decision. Composable from parts; built on the Base UI Dialog primitive.

> **Status: draft (design-pending v1).** Ported from the legacy
> `@acronis-platform/shadcn-uikit` `Dialog`. There is no `--ui-dialog-*` token
> tier yet, so colors resolve to the shared semantic tokens. Enter/exit
> animations use `tw-animate-css` (overlay fade, popup fade + zoom), keyed to
> Base UI's open/closed state. Reconcile against Figma with
> `/figma-component Dialog <url> --update` once a mockup lands.

## When to use

- Confirming a destructive or significant action ("Delete account?").
- Showing a focused, self-contained task that should block the rest of the UI
  until completed or dismissed (a short form, details, a decision).

## When not to use

- For transient, non-blocking feedback — use a toast.
- For contextual hints anchored to an element — use a tooltip or popover.
- For large, navigable content — prefer a full page or a side panel.

## Parts

| Part                             | Element (default)  | Purpose                                           |
| -------------------------------- | ------------------ | ------------------------------------------------- |
| `Dialog`                         | —                  | Root; owns the open state (Base UI `Root`).       |
| `DialogTrigger`                  | `button`           | Opens the dialog.                                 |
| `DialogContent`                  | `div[role=dialog]` | The portaled, centered popup (+ overlay).         |
| `DialogHeader`                   | `div`              | Top bar; holds the title and close button.        |
| `DialogTitle`                    | `h2`               | Accessible dialog name (`aria-labelledby`).       |
| `DialogCloseButton`              | `button`           | Icon button that dismisses the dialog.            |
| `DialogBody`                     | `div`              | Scrollable content region.                        |
| `DialogDescription`              | `p`                | Supporting copy (`aria-describedby`).             |
| `DialogFooter`                   | `div`              | Right-aligned action bar.                         |
| `DialogClose`                    | `button`           | Closes the dialog; wrap a Button via `render`.    |
| `DialogOverlay` / `DialogPortal` | —                  | Lower-level parts (`DialogContent` renders them). |

## Sizes

`DialogContent` takes a `size` prop controlling the popup max-width: `xs` 464 ·
`sm` 512 (default) · `md` 672 · `lg` 832 · `xl` 992 · `2xl` 1136 (px). These
mirror the reference design's six width steps; until a `--ui-dialog-*` tier
defines them they are plain max-width utilities.

## Example

```tsx
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogCloseButton,
  DialogBody,
  DialogDescription,
  DialogFooter,
  DialogClose,
  Button,
} from '@acronis-platform/ui-react';

<Dialog>
  <DialogTrigger render={<Button variant="secondary">Open dialog</Button>} />
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Are you absolutely sure?</DialogTitle>
      <DialogCloseButton />
    </DialogHeader>
    <DialogBody>
      <DialogDescription>This action cannot be undone.</DialogDescription>
    </DialogBody>
    <DialogFooter>
      <DialogClose render={<Button variant="ghost">Cancel</Button>} />
      <Button variant="destructive">Delete account</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>;
```
