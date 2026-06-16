---
'@acronis-platform/ui-react': minor
---

Re-theme `Checkbox` against the next-gen tokens and grow it into the full Figma
field.

- Fixed dead token refs: the box fill and glyph referenced `--ui-checkbox-*-box-{state}`
  / `--ui-checkbox-*-icon-{state}`, which were renamed to `*-box-color-{state}` /
  `*-icon-color-{state}` — so fills and glyphs silently fell back to inherited
  colors. Every state (unchecked / checked / indeterminate × idle / hover / active
  / disabled) is now wired to its current `--ui-checkbox-*` token.
- Added optional `label` and `description` props. When provided, the box, label,
  and description compose a clickable `<label>` row (wired via aria-labelledby /
  aria-describedby) using the `--ui-checkbox-global-{label,description,container}-*`
  tokens. With neither, the bare box renders as before — name it with `aria-label`.
