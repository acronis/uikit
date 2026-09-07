---
'@acronis-platform/ui-react': patch
---

Import the 4 component token tiers missing from `src/styles/index.css`
(`AlertRibbon`, `Chat`, `SegmentControl`, `SideSheet`). `ui-react/styles` is
meant to load every component tier `@acronis-platform/tokens-pd` ships for the
default brand; these four `--ui-<component>-*` custom property sets were absent
from the bundle, so anything referencing them directly had no defined value.
