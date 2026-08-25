'use client';

import {
  AreaChart,
  ButtonIcon,
  ChartWidget,
  Tag,
  type ChartConfig,
} from '@acronis-platform/ui-react';
import { EllipsisIcon } from '@acronis-platform/icons-react/stroke-mono';

const data = [
  { month: 'Jan', sessions: 186 },
  { month: 'Feb', sessions: 305 },
  { month: 'Mar', sessions: 237 },
  { month: 'Apr', sessions: 273 },
  { month: 'May', sessions: 209 },
  { month: 'Jun', sessions: 264 },
];

const config = { sessions: { label: 'Sessions' } } satisfies ChartConfig;

const actions = (
  <ButtonIcon aria-label="Widget actions">
    <EllipsisIcon size={16} />
  </ButtonIcon>
);

export function ChartWidgetDemo() {
  return (
    <div className="grid grid-cols-1 gap-4 [grid-auto-rows:300px] sm:grid-cols-2">
      <ChartWidget
        header={{
          title: 'Sessions',
          extras: <Tag variant="info">Last 6 months</Tag>,
          actions,
        }}
      >
        <AreaChart
          config={config}
          data={data}
          dataKeys={['sessions']}
          xKey="month"
          showLegend={false}
          className="size-full"
        />
      </ChartWidget>
      <ChartWidget header={{ title: 'Sessions', actions }} state="empty" variant="area" />
    </div>
  );
}
