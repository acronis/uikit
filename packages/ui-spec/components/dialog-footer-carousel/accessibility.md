# DialogFooterCarousel — accessibility

- `Back`, `Next`, and the call-to-action control render as real `Button`
  elements — native focus, keyboard activation (Enter/Space), and the
  Button's own accessible name (its label) come for free.
- Each dot in the indicator is a real `<button>` with an explicit
  `aria-label` (default `"Go to slide N of M"`, overridable via
  `goToSlideLabel`) — dots are never bare, unlabeled `<div>`s. The active
  dot carries `aria-current="true"`.
- DialogFooterCarousel is a plain layout container — no landmark role of its
  own. It's meant to live inside a dialog (e.g. `DialogWelcome`), which owns
  the `role="dialog"` / focus-trap semantics.
- Focus order follows DOM order: `Back` (when present) → dots → `Next`/
  call-to-action.

## Contrast

The active dot uses `--ui-glyph-on-surface-primary`; inactive dots use
`--ui-glyph-on-surface-disabled`. Both are guaranteed to meet contrast against
the footer's own background in both light and dark (shared semantic
glyph/surface pairing) — the same tokens `Breadcrumb`'s separator icon and
`Switch`'s track use for the equivalent idle/disabled distinction.
