---
'@acronis-platform/ui-react': minor
---

Add the `operational` variant to `Chip` and correct the remove icon's size.

- `variant="operational"` is a plain action chip from the Figma `type=operational`
  design: `role="button"` with no × and no `aria-pressed`, and a strong-link label
  (semibold, `--ui-chip-operational-label-color`).
- The remove (×) glyph was rendering ~1.6× too large: it used `TimesIcon`, whose
  mark spans ~85% of the icon box, where the design uses `TimesSmall` (~52%). It
  now renders `TimesSmallIcon` with `size={16}`, which also picks the 16px stroke
  spec (1.6px) instead of scaling the 24px master down to 1.33px. This changes the
  appearance of every `removable` chip, including those inside `FilterSearch` and
  the data-table toolbar.
