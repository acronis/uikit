# Metric — accessibility

- **DOM order matches reading order**: icon badge → value + unit → badge →
  tooltip affordance (left), caption (right), then trend, supporting text, body.
  Assistive tech reads a coherent "73 % ↓ 5% …".
- The unit stays adjacent to the value so they're announced together.
- The icon in the badge is decorative (`aria-hidden`). The badge tint is always
  the info color — it is a contextual slot, not a status signal, so it carries
  no meaning that must be communicated via ARIA.
- **Tooltip affordance**: when `tooltip` is set, the info trigger is a real
  focusable element named by `tooltipLabel` (default "More information"), so it
  is keyboard-reachable and announced. The tooltip must not be the only source
  of essential information.
- **Trend**: the rendered `TrendIndicator` is decorative by default (glyph +
  text, no `role="img"`). Supply an `ariaLabel` on the TrendIndicator directly
  when a screen reader needs the full sentence ("Revenue down 5% vs last
  quarter").
- Abbreviations (ARR, MTTR) may need a `tooltip` / accessible expansion supplied
  by the consumer.
- Dynamically-updating values are not announced via `aria-live` unless the
  consumer wraps them.

## Contrast

The value resolves the primary surface-text token; unit, supporting text, and
the tooltip icon use the secondary token. The info badge pairs
`--ui-background-status-info` with `--ui-glyph-on-surface-neutral-dark`. All
meet contrast in light and dark.
