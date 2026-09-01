---
'@acronis-platform/ui-react': patch
---

**Checkbox**: fixed a visual bug where the check/minus indicator glyph rendered
oversized and off-proportion versus the Figma design. The indicator used the
full-size `CheckIcon`/`MinusIcon`, whose 16px entry reuses the same
edge-to-edge path geometry as the 24px one (only the stroke width changes), so
the glyph filled the 16px box corner to corner and its stroke read as thin
against it. It now uses `CheckSmallIcon`/`MinusSmallIcon`, whose inset path is
purpose-built for a 16px slot — the same pattern Chip already uses with
`TimesSmallIcon`. No token, geometry, or API change.
