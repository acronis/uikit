# Dialog — accessibility

Dialog leans on the Base UI Dialog primitive for its modal semantics, focus
management, and keyboard handling. The author's job is to provide an accessible
name and description and to use the parts as intended.

## Roles & semantics

- The popup (`root`) has `role="dialog"` and `aria-modal="true"` when modal.
- **Name the dialog.** Render a `DialogTitle` — it is wired to the popup via
  `aria-labelledby`. Without a title the dialog has no accessible name.
- **Describe it when useful.** A `DialogDescription` is wired via
  `aria-describedby`, so supporting copy is announced after the name.
- The close button exposes an accessible name ("Close") via an `sr-only` label
  alongside the icon.

## Keyboard

- **Tab / Shift+Tab** — focus cycles **within** the dialog only; the focus trap
  prevents reaching background content while modal.
- **Escape** — closes the dialog (fires the change event).
- On open, focus moves into the dialog (the first focusable element, or the
  popup); on close, focus returns to the element that opened it (the trigger).

## Screen reader

- Entering the dialog announces its role, name (title), and description.
- While modal, background content is marked inert, so assistive tech stays
  within the dialog.

## Contrast

- Title/body text use `--ui-text-on-surface-primary`; the description and idle
  close icon use `--ui-text-on-surface-secondary`; both meet WCAG AA against the
  `--ui-background-surface-secondary` popup and `--ui-background-surface-primary`
  header/footer in light and dark themes. The close button shows a 2px
  `--ui-focus-primary` ring on keyboard focus.
- This is a design-pending v1 on semantic tokens — re-verify contrast against the
  final palette once a `--ui-dialog-*` tier and Figma reference exist.
