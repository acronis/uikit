---
'@acronis-platform/ui-react': patch
---

Align the Chart tooltip chrome with the design system. The tooltip now uses the
Tooltip tier's shape tokens (`--ui-tooltip-container-border-radius` /
`-padding-x` / `-padding-y`) and the kit's standard `shadow-md`, and drops the
`font-mono` numeric style — removing the `rounded-lg` / `shadow-xl` / monospace
outliers that appeared nowhere else in the library. Radius, padding, shadow, and
the numeric font change in both modes; the surface colors (`bg-background` /
`text-foreground`) and the two-tone label/value hierarchy are unchanged.
