# Dialog — accessibility

Dialog inherits the Base UI Dialog primitive's modal semantics, focus
management and keyboard handling (via `DialogContent`/`DialogTitle`/
`DialogClose`). The recipe supplies the accessible name and the action controls.

## Roles & semantics

- The popup (`container`) has `role="dialog"` and `aria-modal="true"` when modal.
- **Name.** Every variant renders a `DialogTitle`, wired to the popup via
  `aria-labelledby`, so the dialog always has an accessible name.
- The close button exposes an accessible name ("Close") via an `sr-only` label
  alongside the icon, and is present whenever the header is shown (the
  default). Setting `hasHeader = false` removes the header bar, and with it
  the close button — the dialog is then dismissed via `Escape` or a
  caller-supplied action instead.
- The loading overlay's spinner carries `role="status"` with an accessible name
  ("Loading") so the busy state is announced.
- The `rename` variant's text field has a built-in accessible name
  (`aria-label="Object name"`) — the field renders without a visible label in
  the design, so the component supplies the label itself.
- The `wide` variant's `footer` override is free-form — the caller is
  responsible for giving each action button an accessible name (e.g. visible
  label text), the same as any other Button usage.

## Keyboard

- **Tab / Shift+Tab** — focus cycles within the dialog only; the focus trap
  prevents reaching background content while modal.
- **Escape** — closes the dialog (fires the change event).
- On open, focus moves into the dialog; on close, focus returns to the opener.

## Screen reader

- Entering the dialog announces its role and name (title).
- While modal, background content is inert, so assistive tech stays within the
  dialog.

## Contrast

- Title and body text use `--ui-text-on-surface-primary`; the idle close icon
  uses `--ui-text-on-surface-secondary`; both meet WCAG AA against the
  `--ui-background-surface-secondary` container and `--ui-background-surface-primary`
  header/footer in light and dark themes. The close button shows a
  `--ui-focus-primary` ring on keyboard focus.
