---
'@acronis-platform/ui-react': patch
---

fix(stepper): top-align wrapped rows instead of centering them

When `Stepper`'s item row wraps to a second line (narrow container, many
steps), the flex container had no `content-start`, so the browser's default
`align-content` distributed the wrapped lines across any leftover container
height instead of packing them to the top — leaving a visible gap above the
second row. Added `content-start` and switched `items-center` to
`items-start` on the item row so wrapped steps stack flush against the row
above them.
