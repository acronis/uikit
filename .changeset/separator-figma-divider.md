---
'@acronis-platform/ui-react': minor
---

**Separator**: aligned with Figma's `DividerHorizontal` component (node `788:15147`).

- The rule now references `--ui-border-on-surface-divider` directly instead of
  the `bg-border` bridge (`--ui-border-on-surface-divider` is the correct
  semantic token for a divider line; it only happened to share `bg-border`'s
  value today).
- New `size` prop (`'S1' | 'S2' | 'S3'`, default `'S1'`) applies the rule's own
  surrounding spacing, matching Figma's `Size` variant — `S2`/`S3` add
  `--ui-gap-4`/`--ui-gap-8` as margin on the axis perpendicular to the line.
- Added the Figma Code Connect mapping.
