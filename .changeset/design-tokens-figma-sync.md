---
'@acronis-platform/design-tokens': minor
'@acronis-platform/tokens-pd': minor
---

Sync design tokens with Figma.

Adds the `dataviz` colour palettes to the semantics tier — 66 tokens across
`categorical` (16), `sequential` (4 ramps × 8), `diverging` (2 pairs × 6) and
`meaningful.status` (6), each resolved for all six brands. They surface as
`--ui-dataviz-*` custom properties in CSS and in the Tailwind presets' `fill`
namespace. No existing token changed value; the Stepper component tokens present
in Figma were reviewed and deliberately left out of this sync.
