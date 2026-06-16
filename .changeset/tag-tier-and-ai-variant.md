---
'@acronis-platform/ui-react': minor
---

`Tag`: migrate to the dedicated `--ui-tag-*` component tier and add an `ai`
variant. Each variant now wires its container fill, border, label, and icon to
`--ui-tag-<variant>-*` (previously the shared `--ui-background-status-*` /
`--ui-border-on-status-*` / `--ui-text-on-status-*` semantic tokens), and
geometry (radius, border width, gap, padding, max/min width, heights, icon size)
comes from `--ui-tag-global-*`. The new `ai` variant paints a gradient border
over a tinted fill. `size` now only changes the height; padding is uniform.
