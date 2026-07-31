---
'@acronis-platform/ui-react': minor
---

Add an opt-in range brush to the cartesian charts that can carry one — `BarChart`, `LineChart`, `AreaChart` and `ComposedChart` — via shared `showBrush` / `brushHeight` / `brushAriaLabel` props. Dragging a handle (or the selected window) zooms the series into a slice of the data; the category axis and tooltip follow the selection, and it works with the category axis hidden and in either bar orientation. Off by default, so charts without it render unchanged.

The brush is themed from `--ui-*` tokens rather than recharts' hardcoded `#fff` / `#666` defaults, so the strip, its handles and its range captions read in light and dark alike.

Its two handles are real controls — focusable `role="slider"` elements driven by the arrow keys — so they are named from `brushAriaLabel` (default `'Chart range selector'`, overridable to localize) instead of recharts' fallback, which reads "Min value: undefined, Max value: undefined" for any data without a `name` field. `ChartContainer` also restores a visible focus indicator on them, which its blanket outline reset would otherwise suppress.
