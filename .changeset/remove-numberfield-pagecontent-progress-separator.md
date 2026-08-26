---
'@acronis-platform/ui-react': major
---

Removed `NumberField`, `PageContent`, `Progress`, `ProgressCircle`, and
`Separator` — none had a Figma node or internal consumers left in the
codebase. `Separator` was also inlined inside `FieldSeparator`'s divider
markup (same DOM/a11y output, no import left); there is no drop-in
replacement for any of the five in this release.
