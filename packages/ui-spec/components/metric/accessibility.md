# Metric — accessibility

- **DOM order matches reading order**: label → value → unit → trend → supporting
  text → body, so assistive tech reads a coherent "Gross margin 73 % ↓ 5% …".
- The unit stays adjacent to the value so they're announced together.
- **Status is not color-only**: it only tints the icon badge; the real meaning is
  carried by the value, trend, and supporting text (all caller-supplied).
- The icon in the badge is decorative (`aria-hidden`).
- **Tooltip affordance**: when `tooltip` is set, the info trigger is a real
  `<button>` named by `tooltipLabel` (default "More information"), so it is
  focusable and announced. The tooltip must not be the only source of essential
  information.
- Abbreviations (ARR, MTTR) may need a `tooltip` / accessible expansion supplied
  by the consumer.
- Dynamically-updating values are not announced via `aria-live` unless the
  consumer wraps them.

## Contrast

The value resolves the primary surface-text token and the label / unit /
supporting text the secondary token; the icon badge pairs a light status
background with its readable status text color. All meet contrast in light and
dark.
