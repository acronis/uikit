# Timeline — accessibility

- **Semantic sequence**: rendered as an `<ol>` of `<li>`s, so assistive tech
  announces an ordered list of events.
- **Markers and the connector are decorative** (`aria-hidden`) — the meaning is
  in the title / description / timestamp text, never in the marker color alone.
- **Timestamps**: pass a `<time dateTime="…">` so the time is machine-readable
  and clearly announced; the kit does not format or localize dates.
- **Status is not color-only**: `status` only tints the marker; the event's
  meaning must be carried by its text (and, if needed, a `Tag` in `metadata`).
- **Actions**: compose real `Link`/`Button`s in `actions`; do not nest multiple
  interactive elements inside one another, and don't make the whole item a
  single clickable target unless it's a proper link.
- **Expandable detail**: compose an `Accordion` (or similar) as `children`; the
  disclosure semantics come from that component.
- **Disabled**: a `disabled` item is dimmed **and** exposes `aria-disabled` so
  assistive tech announces it as inactive (not color/opacity alone), and sets
  `pointer-events-none` so its slotted controls stop taking pointer input.
- Dynamically-added items are not announced via `aria-live` unless the consumer
  wraps them.

## Contrast

Title uses the primary surface-text token; timestamp / description / metadata use
the secondary (muted) token; marker colors use the status text/`-pressed`
families — all meeting contrast in light and dark.
