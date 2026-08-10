# Timeline — accessibility

- **Semantic sequence**: rendered as an `<ol>` of `<li>`s, so assistive tech
  announces an ordered list of events.
- **Markers and connectors are decorative** (`aria-hidden`) — the meaning is in
  the title / description / timestamp text, never in the marker color alone. The
  marker Avatar carries the icon for visual scanning only.
- **Nesting is visual, not structural**: because rows are a flat list with an
  indent, depth is **not** conveyed to assistive tech. If hierarchy is meaningful
  to the user, put it in the text (or use a real tree widget instead).
- **Timestamps**: pass a `<time dateTime="…">` so the time is machine-readable
  and clearly announced; the kit does not format or localize dates.
- **Marker color is not information**: `color` only tints the marker; the event's
  meaning must be carried by its text (and, if needed, a `Tag`).
- **Disclosure control**: a real `<button>` with `aria-expanded` reflecting the
  current state. Its accessible name comes from `toggleLabel`, which defaults to
  an English string — pass a localized value. It is keyboard-reachable and
  activates with Enter/Space; focus is visible via ButtonIcon's focus ring.
- **Two controls on one row**: a `tree` row with descendants and `collapsibleBody`
  renders both buttons inside the same `<li>`, performing different actions. Their
  defaults (`toggleLabel` "Toggle nested events", `bodyToggleLabel` "Toggle event
  details") name their own action, so the pair is never ambiguous out of the box —
  keep them distinct when you localize.
- **Collapsing removes rows from the DOM**, so assistive tech sees the same list a
  sighted user does. It does not set `aria-controls`: the collapsed rows are
  siblings of the control's own `<li>`, not a single wrapping region, so there is
  no one element to point at.
- **Marker content**: `icon` and `initials` both sit inside the decorative marker,
  so neither is announced. Never put information there that isn't also in the text.
- **Actions and links**: compose real `Link`/`Button`s in the card body, each with
  its own accessible name; do not nest multiple interactive elements inside one
  another, and don't make the whole row a single clickable target unless it's a
  proper link.
- Dynamically-added rows are not announced via `aria-live` unless the consumer
  wraps them.

## Contrast

Title uses the primary surface-text token; timestamp and description use the
secondary (muted) token; the connector and elbow use the shared border token; the
marker and disclosure button inherit Avatar's and ButtonIcon's own token tiers —
all meeting contrast in light and dark.
