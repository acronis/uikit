---
'@acronis-platform/ui-react': minor
---

Add a configurable chart-legend font size. `ChartLegendContent` takes a `fontSize` prop (`'xs' | 'sm' | 'base' | 'lg' | 'xl'`, default `'xs'` — the size legends have always rendered at), and every chart type with a shared legend (Area, Bar, Composed, ConfidenceCone, Funnel, Line, Pie, Radar, RadialBar, Scatter, Treemap) exposes it as `legendFontSize`. The list-variant legend sizes both its labels and its values. Sankey and CategoryBar keep their bespoke legends, which are unaffected.
