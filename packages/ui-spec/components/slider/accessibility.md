# Slider — accessibility

- Built on Base UI's Slider: each thumb is keyboard-operable (←/→/↑/↓, Home/End,
  PageUp/PageDown) and exposes `aria-valuenow` / min / max so assistive tech reads
  the current value.
- Give the slider an accessible name — `aria-label` on `Slider`, or pair it with a
  `Field` / `FieldLabel`. For a range, label each end if they have distinct meaning.

## Contrast

The filled indicator (`--ui-background-brand-secondary`) against the rail
(`--ui-border-on-surface-border`) and the thumb border are distinguishable in light
and dark; the focus ring uses `--ui-focus-primary`.
