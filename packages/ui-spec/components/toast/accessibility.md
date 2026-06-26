# Toast — accessibility

- The `<Toaster>` region is a live region (`role="region"`,
  `aria-label="Notifications"`, `aria-live="polite"`), so screen readers announce
  new toasts without moving focus. Use `toast.error` (mapped to a higher priority
  by the manager) for urgent messages that should interrupt.
- Base UI manages the announcement: it exposes an off-screen copy of each toast's
  text to assistive tech and marks the visible card `aria-hidden`, so the message
  is announced once and not duplicated.
- The close and action buttons are reachable by keyboard via the viewport's focus
  management (F6 / Tab into the region); the close button shows a visible focus
  ring (`--ui-focus-primary`) and has an accessible label.
- Don't put essential, time-critical information only in a toast — it
  auto-dismisses. Pair destructive confirmations with a persistent surface.

## Contrast

The card uses `--ui-text-on-surface-primary` (title) and
`--ui-text-on-surface-secondary` (description) over
`--ui-background-surface-primary`, meeting text contrast in light and dark. The
status icons use `--ui-text-on-status-*` and the action uses the brand action
color (`--ui-background-brand-secondary`).
