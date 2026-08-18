---
'@acronis-platform/ui-react': patch
---

fix(input-password): follow the icons-react rename of `EyeCrossedIcon`

The reveal toggle imported `EyeCrossedIcon`, which the resynced `icons` pack
renames to `EyeOffIcon`. Internal only — `InputPassword`'s own API is
unchanged — but the glyph is redrawn as part of the same resync, so the
rendered toggle is not pixel-identical.
