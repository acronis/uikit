---
'@acronis-platform/ui-react': patch
---

fix(ScatterChart): Figma-align grid defaults and palette

- **BREAKING**: grid lines are now dashed by default (pass `gridDashed={false}` for solid)
- **BREAKING**: vertical grid lines are now hidden by default (pass `gridVertical` to restore)
- **BREAKING**: default palette changed from `categorical` to `diverging teal-violet` (pass `palette={{ type: 'categorical' }}` to restore the old behavior)
- Add `Default` story, clean up meta.args (remove redundant default overrides)
- Add `WidgetExample` story matching the Figma widget frame
- Update Figma Code Connect URL
