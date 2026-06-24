---
'@acronis-platform/ui-react': patch
---

`ButtonIcon`: fix the focus ring to match the Figma design — was a 2px
`--ui-focus-brand` ring with a 2px offset; now a 3px `--ui-focus-primary` ring
flush to the button edge (no offset), matching the Figma focus state (same fix as
`Button`). Also drops the blanket transparent `border` so only the `secondary`
variant draws one (the Figma `ghost` has no border); the centered icon's geometry
is unchanged.
