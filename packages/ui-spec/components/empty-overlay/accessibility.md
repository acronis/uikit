# EmptyOverlay — accessibility

## Semantics

- The root is a plain, non-interactive `<div>` — no role, not a live region.
  If the overlay replaces content that a screen reader user was tracking
  (e.g. it appears after a failed load), the consumer is responsible for any
  live-region announcement at the point where the overlay is mounted.
- `title` renders as an `<h3>`, so it participates in the page's heading
  outline — pick a container level that keeps that hierarchy sensible.
- The icon badge is decorative (the title/description already carry the
  meaning); it needs no accessible name of its own.

## Keyboard & focus

- Not focusable and not in the tab order — there is nothing to activate.

## Contrast

- Each badge color's fill/icon pair, and the title/description text colors,
  resolve from tokens that meet contrast in both light and dark themes.
