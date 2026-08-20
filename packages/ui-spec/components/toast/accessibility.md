# Toast — accessibility

- The `<Toaster>` region is a live region (`role="region"`, `aria-live="polite"`)
  named by the `label` prop (default `"Notifications"`), so screen readers
  announce new toasts without moving focus. Pass `label` to localize it.
- Base UI manages the announcement: it exposes an off-screen copy of each toast's
  text to assistive tech and marks the visible card `aria-hidden`, so the message
  is announced once and not duplicated. The card's accessible name comes from its
  title.
- The dismiss and action buttons are reachable by keyboard via the viewport's
  focus management (F6 / Tab into the region). The dismiss control's accessible
  name comes from `closeAriaLabel` (default `"Close"`) — pass it to localize —
  and it shows a visible focus ring (`--ui-focus-primary`) via ButtonIcon.
- Severity is never conveyed by color alone: each severity has its own status
  icon, and the title/description carry the message in words.
- Don't put essential, time-critical information only in a toast — it
  auto-dismisses. Pair destructive confirmations with a persistent surface, and
  prefer `Alert` (the same visual, inline and persistent) when the message must
  stay on screen.

## Contrast

The card uses `--ui-toast-global-content-text-container-title-color` (title) and
`--ui-toast-global-content-text-container-description-color` (description) over
the neutral `--ui-toast-global-container-background`, meeting text contrast in
light and dark. The severity border and status line
(`--ui-toast-<severity>-border-color` / `-left-line`) are decorative — they
reinforce the status icon rather than carrying meaning on their own — so they are
not held to text contrast. Action buttons and the dismiss control inherit the
contrast-checked `--ui-button-*` / `--ui-button-icon-*` tiers.
