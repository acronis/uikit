# DialogRoot

> **Internal-only.** Not exported from `@acronis-platform/ui-react`. This is
> the composable primitive `Dialog` (the recipe) is built on — use
> [`Dialog`](../dialog/README.md) instead. Documented here because its source
> lives alongside `Dialog`'s (`packages/ui-react/src/components/ui/dialog/`)
> and other internal code (tests, Storybook VR coverage) still references it
> directly.

A modal overlay that interrupts the user to show focused content or request a
decision. Composable from parts; built on the Base UI Dialog primitive.

> **Status: draft (design-pending v1).** Ported from the legacy
> `@acronis-platform/shadcn-uikit` `Dialog`. There is no `--ui-dialog-*` token
> tier yet, so colors resolve to the shared semantic tokens. Enter/exit
> animations use `tw-animate-css` (overlay fade, popup fade + zoom), keyed to
> Base UI's open/closed state. Reconcile against Figma with
> `/figma-component Dialog <url> --update` once a mockup lands.

## When to use

- Never directly — it has no public export. Use `Dialog`; if none of its
  seven canned use-cases (or the `wide` escape hatch) fit, that's a gap to
  raise with the design system team (a new variant), not a reason to reach
  for this primitive.

## Parts

| Part                             | Element (default)  | Purpose                                           |
| -------------------------------- | ------------------ | ------------------------------------------------- |
| `DialogRoot`                     | —                  | Root; owns the open state (Base UI `Root`).       |
| `DialogTrigger`                  | `button`           | Opens the dialog.                                 |
| `DialogContent`                  | `div[role=dialog]` | The portaled, centered popup (+ overlay).         |
| `DialogHeaderRoot`               | `div`              | Top bar; holds the title and close button.        |
| `DialogTitle`                    | `h2`               | Accessible dialog name (`aria-labelledby`).       |
| `DialogCloseButton`              | `button`           | Icon button that dismisses the dialog.            |
| `DialogBodyRoot`                 | `div`              | Scrollable content region.                        |
| `DialogDescription`              | `p`                | Supporting copy (`aria-describedby`).             |
| `DialogFooterRoot`               | `div`              | Right-aligned action bar.                         |
| `DialogClose`                    | `button`           | Closes the dialog; wrap a Button via `render`.    |
| `DialogOverlay` / `DialogPortal` | —                  | Lower-level parts (`DialogContent` renders them). |

## Sizes

`DialogContent` takes a `size` prop controlling the popup max-width. `sm`
(512px, default) has a Figma-defined token (`--ui-dialog-container-size-sm`);
`large` (832px) is a legacy backward-compatibility size with no design token,
kept for existing call sites (see the public `Dialog` recipe's `wide` variant).

## Example (internal usage only)

```tsx
// NOT a public import — './dialog' is an internal module path, shown here
// only to document what Dialog (the recipe) composes internally.
import {
  DialogRoot,
  DialogTrigger,
  DialogContent,
  DialogHeaderRoot,
  DialogTitle,
  DialogCloseButton,
  DialogBodyRoot,
  DialogDescription,
  DialogFooterRoot,
  DialogClose,
} from './dialog';
import { Button } from '../button';

<DialogRoot>
  <DialogTrigger render={<Button variant="secondary">Open dialog</Button>} />
  <DialogContent>
    <DialogHeaderRoot>
      <DialogTitle>Are you absolutely sure?</DialogTitle>
      <DialogCloseButton />
    </DialogHeaderRoot>
    <DialogBodyRoot>
      <DialogDescription>This action cannot be undone.</DialogDescription>
    </DialogBodyRoot>
    <DialogFooterRoot>
      <DialogClose render={<Button variant="ghost">Cancel</Button>} />
      <Button variant="destructive">Delete account</Button>
    </DialogFooterRoot>
  </DialogContent>
</DialogRoot>;
```
