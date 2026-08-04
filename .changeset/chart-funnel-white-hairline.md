---
'@acronis-platform/ui-react': patch
---

fix(chart): neutralize recharts' hardcoded white outline on funnel segments

recharts defaults a `Funnel`'s segment stroke to `#fff`. `ChartContainer` already
undid that hardcoded white on pie/radial sectors and line dots, but not on funnel
trapezoids — so every `FunnelChart` drew a white hairline between its stages in
**both** themes, reading as a light outline around each segment in dark mode. The
container now neutralizes `.recharts-trapezoid[stroke='#fff']` alongside the other
two. A caller-supplied `stroke` is untouched, so an intentional segment border
still paints.
