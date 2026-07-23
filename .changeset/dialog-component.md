---
'@acronis-platform/ui-react': major
---

Add `Dialog`, a variant-driven dialog recipe built on an internal, non-exported
composable primitive. A single `variant` prop selects one of eight canned
use-cases (`default`, `rename`, `save changes`, `reset password`, `discard
changes`, `accept`, `read-only`, `wide`) — each with its own title, body copy,
and footer buttons; `children` overrides the body slot, `hasLoading` shows a
loading overlay across the body + footer, and `hasHeader`/`hasFooter` (both
default `true`) hide the header and/or footer for a body-only dialog (the
title still renders off-screen for accessibility when the header is hidden).

Localize or override canned copy with `title`, `secondaryLabel`,
`primaryLabel`, `closeLabel`, `objectName` (interpolated into the `rename`/
`discard changes`/`accept` variants' copy), and `objectNameLabel` (the
`rename` field's accessible name). Attach behavior to the primary footer
button with `onPrimaryAction` — the dialog does not close automatically;
pair it with `open`/`onOpenChange`. The `wide` variant takes a `footer` prop
for free-form footer content instead of canned buttons, and defaults
`size` to `"large"` (832px, no design token); the default `size="sm"`
(512px) resolves to the `--ui-dialog-*`/`--ui-footer-*` token tier.

Only `Dialog` and `DialogClose` (required by `wide`'s custom-footer escape
hatch) are exported for building dialogs — the composable primitive parts
are an internal implementation detail.

**Migration:** build dialogs with `Dialog` and its `variant` prop. If you
were importing dialog primitive parts (`DialogContent`, `DialogTrigger`,
`DialogHeader`, `DialogFooter`, `DialogBody`, `DialogDescription`,
`DialogCloseButton`, etc.) directly via a deep import, those are no longer
exported from the package root.
