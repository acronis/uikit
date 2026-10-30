# ChartState

A shared visual state for one chart slot. Use it while chart data is loading,
missing, incomplete, or has failed, or when a KPI should show its numeric empty
value. Empty, warning, and error share the Breakpoints state circles; number
uses the centered disabled-style KPI value; loading uses the shared spinner.

Consumers select the semantic state and pass localized or context-specific
content through `description`. `ChartState` does not infer the state from data.

```tsx
import { ChartState } from '@acronis-platform/ui-react';

if (status === 'loading') return <ChartState state="loading" />;
if (status === 'warning')
  return <ChartState state="warning" description={t('chart.partialData')} />;
if (status === 'error')
  return <ChartState state="error" description={t('chart.loadError')} />;
if (isEmptyKpi) return <ChartState state="number" description="0 GB" />;
if (!data.length)
  return <ChartState state="empty" description={t('chart.noData')} />;
```

`ChartState` fills the chart's slot. It does not own the containing widget card
or dashboard composition; see `ChartWidget` for a single chart card.
