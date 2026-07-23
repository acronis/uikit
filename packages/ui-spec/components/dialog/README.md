# Dialog

A higher-level "recipe" dialog built on top of the DialogRoot primitive parts.
One `variant` prop selects a ready-made title, body copy and footer for the
seven most common dialog use-cases, so product code doesn't reassemble the
same `DialogRoot` + `DialogHeader` + `DialogFooter` boilerplate each time. In
Figma the matching component set is named "DialogDefault"; the code-facing
name is `Dialog`.

> **Status: draft (design-pending geometry).** Colors and typography resolve to
> shipped semantic tokens, but there is no `--ui-dialog-*`/`--ui-footer-*` token
> tier yet, so container/header/footer geometry (radius, widths, heights,
> paddings, gaps, divider widths) is applied as plain Tailwind utilities — a
> tracked exception, not an oversight. Reconcile with a Dialog/Footer tier once
> the design team ships one. See `tokens.yaml`.

## When to use

- One of the seven canned use-cases fits: `default`, `rename`, `save changes`,
  `reset password`, `discard changes`, `accept`, `read-only`.
- You want a consistent confirmation/decision dialog without hand-composing the
  DialogRoot parts.
- You have a legacy call site that needs a wider popup and fully custom footer
  buttons — use `variant="wide"` (see below). This is a backward-compatibility
  escape hatch, not a recommended pattern for new work.
- You need a body-only dialog with no title bar and/or no action bar — set
  `hasHeader`/`hasFooter` to `false`. Both default to `true`; this is beyond
  the strict Figma contract (all seven canned variants always show both).

## When not to use

- You need a bespoke layout or extra parts none of the seven variants (or the
  `wide` escape hatch) cover — this is a gap to raise with the design system
  team (the underlying `DialogRoot` primitive is internal-only, not a public
  escape hatch).
- For transient, non-blocking feedback — use a toast.
- For contextual hints anchored to an element — use a tooltip or popover.

## Variants

| Variant           | Title              | Footer                                    |
| ----------------- | ------------------ | ----------------------------------------- |
| `default`         | Dialog title       | Cancel · Label                            |
| `rename`          | Rename object name | Cancel · Rename (body: text field)        |
| `save changes`    | Save changes       | Go back · Save                            |
| `reset password`  | Reset password     | Cancel · Reset                            |
| `discard changes` | Discard changes    | Go back · **Confirm** (destructive)       |
| `accept`          | Accept object name | Cancel · Accept                           |
| `read-only`       | License agreement  | Done (single primary action)              |
| `wide`            | (caller-supplied)  | Free-form, via `footer` — no Figma preset |

`rename`, `discard changes`, and `accept`'s canned title/body embed a generic
"object name" placeholder — pass `objectName` to interpolate the real name
(e.g. a file name) instead of overriding `title`/`children` by hand.

## Parts

| Part              | Element (default)  | Purpose                                              |
| ----------------- | ------------------ | ---------------------------------------------------- |
| `container`       | `div[role=dialog]` | The portaled, centered popup card.                   |
| `header`          | `div`              | Top bar; title + close button.                       |
| `title`           | `h2`               | Accessible dialog name (`aria-labelledby`).          |
| `close-button`    | `button`           | Icon button that dismisses the dialog.               |
| `body`            | `div`              | Variant copy or the `children` override.             |
| `footer`          | `div`              | Right-aligned action bar; or the free-form `footer`. |
| `loading-overlay` | `div`              | Spinner scrim shown while `hasLoading`.              |

## Example

```tsx
import { Dialog } from '@acronis-platform/ui-react';

// Canned use-case, controlled open state
<Dialog variant="discard changes" open={open} onOpenChange={setOpen} />;

// Override the body slot (header + footer chrome preserved)
<Dialog variant="default" defaultOpen>
  <p>Any custom body content.</p>
</Dialog>;

// Busy state
<Dialog variant="save changes" hasLoading open />;

// Localize the canned copy (title/secondaryLabel/primaryLabel/closeLabel all
// override the variant's default English string)
<Dialog
  variant="discard changes"
  title="Modifications non enregistrées"
  secondaryLabel="Retour"
  primaryLabel="Confirmer"
  closeLabel="Fermer"
  open
/>;

// Interpolate the real object name into the rename/discard changes/accept
// variants' canned title/body, instead of the generic placeholder text
<Dialog
  variant="rename"
  objectName="Q3 Report.xlsx"
  open
  onOpenChange={setOpen}
/>;

// Hide the header and/or footer chrome (beyond the Figma contract)
<Dialog hasHeader={false} open>
  <p>Body-only content — no title bar, no close button.</p>
</Dialog>;

// Legacy wide variant — free-form footer, kept for backward compatibility
import { Button, DialogClose } from '@acronis-platform/ui-react';

<Dialog
  variant="wide"
  size="large"
  title="Configure discovery agent"
  open
  footer={
    <>
      <DialogClose render={<Button variant="ghost">Cancel</Button>} />
      <Button>Configure</Button>
    </>
  }
>
  <p>The discovery agent will obtain the neighbor IP addresses…</p>
</Dialog>;
```
