---
'@acronis-platform/design-assets': patch
---

Fix the `stroke-mono` group's `16` dimension: add the missing `scale-16` rule
(`$values["16"]` is now `["current-color", "scale-16", "stroke-1-6"]`). Without
`scale-16`, `stroke-1-6` resolved to 1.6 user units in the 24 viewBox, rendering
a ~1.067px stroke at 16px instead of the design's 1.6px — thinner than the
prior set and inconsistent with `stroke-multi` (which already carried
`scale-16`). It now resolves to 2.4 user units (= 1.6px visual), matching the
Figma `components/Icon/_global/sm/stroke` = 1.6 variable. Consumers generating
from this pack (e.g. `@acronis-platform/icons-react`) get the corrected 16px
stroke.
