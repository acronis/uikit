# ChartState

A shared loading / empty / error placeholder for the chart types. Render it in
place of a chart — inside the same sized slot — while data is loading, when
there is nothing to plot, or when the fetch failed.

> **Design-pending v1.** Ported from the Figma InputSelect dropdown states (the
> reference node for this task) and kept visually in step with the shipped
> `InputSelectStatus`. There is no `--ui-chart-*` token tier yet, so it themes
> from existing semantic tokens directly.

## When to use

- A chart cannot render yet (data in flight), has no data to plot, or failed to
  load — swap the chart for the matching `ChartState`.
- You want the same placeholder across every chart type, rather than each chart
  hand-rolling its own.

## When not to use

- A full-page empty state (illustration, title, description, primary action) —
  use the larger `Empty` component instead.
- A bare loading indicator with no surrounding message — use `Spinner` directly.

## Example

```tsx
import { ChartState, ChartContainer, Button } from '@acronis-platform/ui-react';

function Sales({ status, data, config, refetch }) {
  if (status === 'loading') return <ChartState state="loading" />;
  if (status === 'error')
    return (
      <ChartState
        state="error"
        action={
          <Button variant="ghost" onClick={refetch}>
            Try again
          </Button>
        }
      />
    );
  if (!data.length) return <ChartState state="empty" />;

  return (
    <ChartContainer config={config} className="h-[300px] w-[500px]">
      {/* …the chart… */}
    </ChartContainer>
  );
}
```

The three states share one compact layout: a leading glyph (spinner / inbox /
warning) over a centered label. Pass `message` to override a state's default
label, and `action` to add a retry affordance to the error state.
