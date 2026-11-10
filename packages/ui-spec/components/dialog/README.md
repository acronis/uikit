# Dialog

A higher-level "recipe" dialog built on top of the DialogRoot primitive parts.
One `variant` prop selects a ready-made title, body copy and footer for the
seven most common dialog use-cases, so product code doesn't reassemble the
same `DialogRoot` + `DialogHeader` + `DialogFooter` boilerplate each time. In
Figma the matching component set is named "DialogDefault"; the code-facing
name is `Dialog`.

> **Status: draft.** Container/header/footer geometry and color resolve to the
> `--ui-dialog-*`/`--ui-footer-*` token tier (reconciled against the Figma
> "DialogDefault" node). `size="large"` (832px) is the one exception — a legacy
> backward-compatibility value with no matching token. See `tokens.yaml`.

## When to use

- One of the seven canned use-cases fits: `default`, `rename`, `save changes`,
  `reset password`, `discard changes`, `accept`, `read-only`.
- You want a consistent confirmation/decision dialog without hand-composing the
  DialogRoot parts.
- You have a legacy call site that needs a wider popup and fully custom footer
  buttons — use `variant="wide"` (see below). This is a backward-compatibility
  escape hatch, not a recommended pattern for new work.
- You need a full-bleed or fixed-height body while keeping the recipe's header
  and footer — use `bodyClassName` to adjust the body wrapper and compose the
  panes inside `children`.
- You need a body-only dialog with no title bar and/or no action bar — set
  `hasHeader`/`hasFooter` to `false`. Both default to `true`; this is beyond
  the strict Figma contract (all seven canned variants always show both).

## When not to use

- You need a completely bespoke dialog structure or extra parts the recipe
  cannot express — this is a gap to raise with the design system team (the
  underlying `DialogRoot` primitive is internal-only, not a public escape
  hatch).
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

| Part              | Element (default)  | Purpose                                                 |
| ----------------- | ------------------ | ------------------------------------------------------- |
| `container`       | `div[role=dialog]` | The portaled popup card; centered (or top-aligned).     |
| `header`          | `div`              | Top bar; title + close button.                          |
| `title`           | `h2`               | Accessible dialog name (`aria-labelledby`).             |
| `close-button`    | `button`           | Icon button that dismisses the dialog.                  |
| `body`            | `div`              | Variant copy or `children`; styled via `bodyClassName`. |
| `footer`          | `div`              | Right-aligned action bar; or the free-form `footer`.    |
| `loading-overlay` | `div`              | Spinner scrim shown while `hasLoading`.                 |

## Example

```tsx
import { Dialog } from '@acronis-platform/ui-react';

// Canned use-case, controlled open state
<Dialog variant="discard changes" open={open} onOpenChange={setOpen} />;

// Override the body slot (header + footer chrome preserved)
<Dialog variant="default" defaultOpen>
  <p>Any custom body content.</p>
</Dialog>;

// Full-bleed, fixed-height body with independent scroll panes
<Dialog
  variant="wide"
  size="large"
  title="Add a widget"
  open
  className="h-[90vh] max-w-[min(71rem,calc(100dvw-96px))]"
  bodyClassName="flex-1 min-h-0 p-0 justify-start overflow-hidden"
>
  <div className="flex min-h-0 min-w-0 flex-1">
    <aside
      tabIndex={0}
      className="w-28 shrink-0 overflow-y-auto border-e border-border sm:w-60"
    >
      Categories
    </aside>
    <section tabIndex={0} className="min-h-0 min-w-0 flex-1 overflow-y-auto">
      Widget cards
    </section>
  </div>
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

// Pin the popup 48px from the top of the viewport instead of centering it
<Dialog variant="default" verticalAlign="top" open>
  <p>Any custom body content.</p>
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
