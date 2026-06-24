---
'@acronis-platform/ui-react': patch
---

`Button`: fix the focus ring and horizontal padding to match the Figma design.

- **Focus ring**: was a 2px `--ui-focus-brand` ring with a 2px offset; now a 3px
  `--ui-focus-primary` ring flush to the button edge (no offset), matching the
  Figma focus state.
- **Horizontal padding**: the blanket transparent `border` was insetting the
  content of borderless variants (primary / ghost / destructive / ai) by 1px, so
  their effective padding was 13px instead of the design's 12px. The 1px border is
  now applied only to the variants that actually have one (`secondary` /
  `inverted`), so every variant's `px` matches the design.
