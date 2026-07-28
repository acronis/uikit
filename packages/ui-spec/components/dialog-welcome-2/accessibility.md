# DialogWelcome2 — accessibility

- Reuses Base UI `Dialog.Root`/`Dialog.Popup` (via `DialogContent`) for focus
  trapping, scroll locking, `role="dialog"`/`aria-modal`, and Escape/
  outside-press dismissal — the same primitive `Dialog` builds on.
- Exactly one `Dialog.Title`/`Dialog.Description` pair is mounted at a time —
  the active slide's (`variant="carousel"`) or the single body's
  (`variant="single"`). This keeps `aria-labelledby`/`aria-describedby`
  pointed at real, visible content instead of an off-screen duplicate.
- **Non-active carousel slides are hidden from assistive tech and the
  keyboard** (`aria-hidden` + `inert`) — a screen reader or Tab press cannot
  land on a slide that isn't currently shown, which a naive "just clip it
  visually" carousel would get wrong.
- The footer's `Back`/`Next`/call-to-action controls and dot indicators
  inherit `DialogFooterCarousel2`'s accessibility contract (see its own
  `accessibility.md`) — real `<button>`s, explicit dot labels, `aria-current`
  on the active dot.
- `variant="single"`'s primary action and `Close` are both real `Button`s;
  `Close` is wrapped in `Dialog.Close` so Escape and the button both dismiss
  the same way.

## Contrast

`image`'s placeholder surface (`--ui-background-surface-active`) and
`title`/`description`'s text (`--ui-text-on-surface-primary`, bridged via
`text-foreground`) are the same semantic surface/text pairing used across the
kit — contrast-checked in both light and dark by construction.
