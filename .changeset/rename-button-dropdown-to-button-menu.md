---
'@acronis-platform/ui-react': minor
---

**Breaking:** rename `ButtonDropdown` → `ButtonMenu` to match the Figma component
set (named "ButtonMenu") and its `--ui-button-menu-*` token tier. The exports
`ButtonDropdown`, `ButtonDropdownProps`, and `buttonDropdownVariants` are now
`ButtonMenu`, `ButtonMenuProps`, and `buttonMenuVariants`; update imports
accordingly. The API (props, variants, behavior) is otherwise unchanged.

Also fixes the focus ring to match the current Figma design — was a 2px
`--ui-focus-brand` ring with a 2px offset; now a 3px `--ui-focus-primary` ring
flush to the button edge (no offset), matching `Button` and `ButtonIcon`.
