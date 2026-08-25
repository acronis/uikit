---
'@acronis-platform/ui-react': major
---

**Breaking changes** — `Metric` and `TrendIndicator`; new `orientation` prop on `ChartWidget`

### `Metric`

- **Card removal.** `Metric` no longer renders its own `Card` wrapper. It is now a plain stats strip (`<div>`). For a standalone card tile, wrap it: `<Card className="p-4"><Metric .../></Card>`. When used inside `ChartWidget`, the card chrome comes from the widget.
- **Removed props:** `size`, `status`, `label`, `trendSlot`.
- **New first-class `trend` prop.** `trend?: 'up' | 'down' | 'stable'` renders a `TrendIndicator` automatically below the value. Sentiment follows direction: `up` → positive, `down` → negative, `stable` → neutral. Pair with `trendValue?: ReactNode` for the change text.
- **Icon badge color fix.** The icon inside the badge now uses `--ui-glyph-on-surface-neutral-dark` (neutral dark gray) instead of `--ui-text-on-status-info`.

### `TrendIndicator`

- **Removed props:** `size`, `variant` (the `badge` variant), `comparisonLabel`.

### `ChartWidget`

- **New `orientation` prop.** `orientation?: 'vertical' | 'horizontal'` (default `'vertical'`). Vertical keeps the existing layout — metric strip above the chart, full width. Horizontal places metric and chart side by side (`flex-1` each), intended for the sm (288px) widget width. Figma: vertical → node 8174:22335, horizontal → node 8982:31681.
