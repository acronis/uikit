# Accordion — accessibility

- Built on Base UI's Accordion: each trigger sits in an `Accordion.Header`
  (heading role) and is a `<button>` with `aria-expanded` / `aria-controls`; the
  panel is associated back via `aria-labelledby`. Arrow keys move between headers,
  Enter/Space toggles, and Home/End jump to the first/last.
- The chevron rotation is decorative — the open state is conveyed by
  `aria-expanded`, so don't rely on the icon alone.
- Give each trigger a clear, distinct label.

## Contrast

The divider (`--ui-border-on-surface-border`) and the muted chevron/panel text
(`--ui-text-on-surface-secondary`) meet contrast in light and dark; trigger labels
inherit the foreground.
