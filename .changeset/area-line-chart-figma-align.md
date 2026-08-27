---
'@acronis-platform/ui-react': minor
---

feat(charts): Figma-align AreaChart & LineChart defaults and add projection support

- AreaChart: changed `fill` default from `'gradient'` to `'solid'` (Figma shows flat translucent fill)
- LineChart: changed `showDots` default from `true` to `false` (Figma shows clean lines without dots)
- Added `projectionStart` prop to both: ticks past the boundary render in disabled color,
  lines become dashed, and AreaChart fill is suppressed in the projection zone
- Added WidgetExample and WithProjections stories for both charts
- Updated Figma Code Connect URLs
