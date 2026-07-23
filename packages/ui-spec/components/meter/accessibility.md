# Meter — accessibility

- Built on Base UI `Meter`, so the root carries `role="meter"` with
  `aria-valuenow` / `aria-valuemin` (0) / `aria-valuemax` (the `max`), an
  accessible name wired from `Meter.Label` (`aria-labelledby`), and an
  `aria-valuetext` giving the human-readable "value of max (pct%)".
- `role="meter"` (not `progressbar`) is deliberate — a meter is a scalar value
  within a known range, not task progress over time. Screen readers announce it
  as a gauge/measurement.
- The percentage and value are real text in the row, so the meaning is in the
  accessible tree, not only the bar. **Don't rely on the fill color alone** to
  distinguish stacked meters — pair each with its label (already shown).
- The tooltip repeats the value/share; it's supplementary. When it's shown the
  meter root is focusable (`tabIndex={0}`), so keyboard users reach it on focus,
  not just hover. The bar's color is caller-supplied, so pick a token with enough
  contrast on the surface.

## Contrast

The label, value, track, and tooltip resolve semantic `--ui-*` tokens that meet
contrast in both themes. The fill color is the caller's responsibility.
