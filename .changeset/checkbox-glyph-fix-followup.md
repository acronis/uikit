---
'@acronis-platform/ui-react': patch
---

**Combobox, InputSelect, DropdownMenu**: extended the Checkbox indicator glyph
fix to the remaining 16px selection-indicator slots. Combobox's selected-option
check, InputSelect's selected-option check (two call sites), and DropdownMenu's
checked menu-item indicator all rendered the full-size `CheckIcon`, whose 16px
entry reuses the same edge-to-edge path geometry as the 24px one (only the
stroke width changes), so the glyph filled the 16px box corner to corner. They
now use `CheckSmallIcon`, whose inset path is purpose-built for a 16px slot —
the same fix pattern already applied to Checkbox.

DropdownMenu additionally passed no `size` prop at all, so the icon fell back to
`defaultSize={24}` and was squeezed to 16px by `className="size-4"`, rendering a
thinner stroke than the 16px contract intends; it now passes `size={16}` like
the other indicators. No token, geometry, or API change.
