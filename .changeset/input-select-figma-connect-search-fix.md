---
'@acronis-platform/ui-react': patch
---

Fix `InputSelect`'s Figma Code Connect mapping rendering the search field's placeholder example even when the design's `hasSearch` boolean is `false`. `hasSearch` (and the data variant's `hasRecent`) now resolve directly to the example element via `figma.boolean`'s true/false map instead of a truthy render gate on the raw boolean.
