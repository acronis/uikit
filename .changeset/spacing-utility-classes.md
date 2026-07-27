---
'@acronis-platform/design-tokens': minor
'@acronis-platform/tokens-pd': minor
---

Add a `spacing` semantic token root (aliasing the existing `units.gap` primitive scale: 0–96px) and generate the full margin/padding/gap utility grammar from it — `--ui-spacing-*` custom properties, framework-agnostic `.ui-p-*`/`.ui-m-*`/`.ui-gap-*` classes (+ `.ui-mx-auto`) in `tokens-pd/css/default.css`, and `spacing-*` keys in the Tailwind presets (`p-spacing-8`, `gap-x-spacing-16`, …).
