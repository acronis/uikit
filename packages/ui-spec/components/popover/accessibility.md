# Popover — accessibility

Popover leans on the Base UI Popover primitive for focus management, dismissal,
and ARIA wiring.

## Roles & semantics

- The popup has `role="dialog"`; the trigger is associated with it via
  `aria-haspopup` / `aria-expanded` and `aria-controls` (managed by Base UI).
- **Name the popup** when it isn't self-evident: render a heading inside and
  reference it (or pass `aria-label`/`aria-labelledby` on the content), so screen
  readers announce what the popover is.
- Unlike a modal dialog, a popover is **non-modal** by default — focus is placed
  inside on open but background content remains available.

## Keyboard

- The trigger opens the popover on **Enter / Space** (it's a button).
- On open, focus moves into the popup (first focusable, or the popup itself).
- **Escape** closes the popover and returns focus to the trigger.
- **Tab** moves through the popup's focusable content; focus is not trapped
  (non-modal), so tabbing past the end returns to the page.

## Screen reader

- Opening announces the dialog role and its name (heading / label). Closing
  returns the user to the trigger.

## Contrast

- The popup uses `--ui-text-on-surface-primary` on `--ui-background-surface-primary`
  with a `--ui-border-on-surface-border` border — meeting WCAG AA in light and
  dark. Re-verify against the final palette once a `--ui-popover-*` tier and Figma
  reference exist.
