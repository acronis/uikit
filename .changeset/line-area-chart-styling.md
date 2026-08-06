---
'@acronis-platform/ui-react': minor
---

Add the curve set, dot sizing, per-series overrides and reference lines to `LineChart` and `AreaChart`.

**Curves.** `curve` now takes `natural`, `basis`, `stepBefore` and `stepAfter` alongside `linear`, `monotone` and `step` — from a natural cubic spline (smoother than `monotone`, and free to overshoot a point) to a B-spline that need not pass through the points at all, plus the two one-sided step variants. The default stays `monotone`.

**Dots.** `dotSize` sets the point radius (3px as before; the hover dot stays 2px larger). `showActiveDot` decouples the hover dot from the static ones — unset it follows `showDots`, so existing charts are unchanged, and setting it gives either a bare line that still emphasizes the hovered point or static dots with no hover emphasis.

**Per-series overrides.** `lineSettings` / `areaSettings` restyle one series without touching the others, keyed by data key: `color`, `strokeWidth`, `dashed`, `curveType`, `showDots`, `dotSize`, `showLabel` / `labelPosition`, and — on areas — `fillOpacity`. Any field left out falls back to the chart-wide prop. A `color` override also recolors that series' gradient stops on `AreaChart`, and a series listed in `LineChart`'s `comparisonKeys` keeps its dashed, dimmed, dot-less overlay treatment (its `showDots` / `dotSize` entries do not promote it back).

**Reference lines.** `referenceLine` draws one or more dashed rules across the value axis — a fixed `value`, or the mean of one series or of every plotted series (`average`) — each with an optional caption, in the muted text token. The rule extends the axis domain so a target above the data maximum stays visible. A caption sits at its rule's top right; where that collides with the series, `labelPosition` moves it — on all three charts, `BarChart` included. It is otherwise the same config `BarChart` already accepts; the resolver and styling now live in the shared chart helpers (`ChartReferenceLine`, `resolveChartReferenceValue`, `resolveReferenceLineProps`), and `BarChartReferenceLine` is now an alias of the shared type.

With all of the new props unset, both charts render exactly as before.
