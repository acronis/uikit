# ChartState — accessibility

- The root is the live region: loading, empty, warning, and number use
  `role="status"` with `aria-live="polite"`; error uses `role="alert"` with
  `aria-live="assertive"`.
- The root live-region attributes are applied after the prop spread, so the
  selected state's announcement semantics cannot be overwritten by consumer
  props.
- The loading Spinner and state glyphs are decorative. The displayed content
  supplies the state meaning independently of icon color.
- The root does not carry `aria-busy`. This placeholder is unmounted when the
  chart replaces it, and some screen readers defer announcements inside a busy
  region. Put `aria-busy` on the chart-slot container if a busy signal is needed.
- Long error text can scroll vertically, and long unbroken strings wrap within
  the available width.

## Contrast

Message text uses `--ui-text-on-surface-primary`. The state glyphs are the
multi-color design assets, placed on semantic neutral, warning, and critical
background tokens. The textual message communicates meaning without relying on
color.
