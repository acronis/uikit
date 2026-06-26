# Progress — accessibility

- The root is `role="progressbar"` (provided by Base UI Progress.Root). It
  exposes `aria-valuenow`, `aria-valuemin`, and `aria-valuemax` for determinate
  bars, and omits `aria-valuenow` when indeterminate.
- Give the bar an accessible name with `aria-label` or `aria-labelledby` (e.g.
  pointing at a nearby Label) so assistive tech announces what is progressing.
- Use `aria-valuetext` / `getAriaValueText` (forwarded to Base UI) when a
  human-friendly value is clearer than the raw number (e.g. "Step 2 of 5").

## Contrast

The indicator uses `--ui-background-brand-secondary` (brand blue) over the
`--ui-border-on-surface-border` track; both meet non-text contrast against the
page surface in light and dark.
