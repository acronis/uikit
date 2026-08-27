'use client';

import {
  ButtonIcon,
  ChartWidget,
  FunnelChart,
  Grid,
  type ChartConfig,
} from '@acronis-platform/ui-react';
import { EllipsisIcon } from '@acronis-platform/icons-react/stroke-mono';

const data = [
  { stage: 'Visits', value: 5000 },
  { stage: 'Signups', value: 2600 },
  { stage: 'Trials', value: 1400 },
  { stage: 'Purchases', value: 620 },
];

// Stage colors come from the chart's default palette — the sequential blue ramp.
const config = {
  Visits: { label: 'Visits' },
  Signups: {
    label: 'Signups',
  },
  Trials: { label: 'Trials' },
  Purchases: {
    label: 'Purchases',
  },
} satisfies ChartConfig;

const actions = (
  <ButtonIcon variant="ghost" aria-label="Widget actions">
    <EllipsisIcon size={16} />
  </ButtonIcon>
);

export function FunnelChartDemo() {
  return (
    <Grid container cols={2}>
      <ChartWidget header={{ title: 'Conversion', actions }}>
        <FunnelChart
          config={config}
          data={data}
          dataKey="value"
          nameKey="stage"
          className="size-full"
        />
      </ChartWidget>
      <ChartWidget header={{ title: 'Conversion', actions }}>
        <FunnelChart
          config={config}
          data={data}
          dataKey="value"
          nameKey="stage"
          lastShape="rectangle"
          legendValueFormatter={(value) => Number(value).toLocaleString()}
          className="size-full"
        />
      </ChartWidget>
    </Grid>
  );
}
