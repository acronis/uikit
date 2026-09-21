---
'@acronis-platform/design-tokens': patch
'@acronis-platform/tokens-pd': patch
---

fix(design-tokens): correct SidebarPrimary cross-brand aliases for 14 brands

Two Figma wiring bugs shipped in the brand-modes-sync release: all 14 brands
added there had their `SidebarPrimary` MenuItem icon/label colors aliased to
`yellow_1c`'s palette instead of falling through to the semantic default (the
existing `deep_sky_itkontoret`/`virtuozzo` behavior for brands with no
dedicated primitive), and `purple` had its `SidebarPrimary`/`ButtonPrimary`
background aliased to `deep_purple` instead of its own palette. Both are
corrected from a fresh Figma export; no token paths were added, removed, or
changed for any other brand.
