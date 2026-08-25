import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { EllipsisIcon } from '@acronis-platform/icons-react/stroke-mono';

import { ChartWidget } from '../chart-widget';
import { AreaChart } from '../../area-chart';
import { BarChart } from '../../bar-chart';
import { ButtonIcon } from '../../button-icon';
import { FunnelChart } from '../../funnel-chart';
import { PieChart } from '../../pie-chart';
import { Tag } from '../../tag';
import { type ChartConfig } from '../../chart';

// `ChartWidget` is the Card every chart mockup is wrapped in.
//
// Every story puts it in a real `Dashboard` grid, because that is where the
// height comes from: the grid's row sizes the card, the header takes what it
// needs, and the plot fills the rest. Nothing below sets a height on a widget —
// the point of the component is that it doesn't need one.
//
// Widths are the design's three — 288 / 592 / 896 — since width is the only
// thing the Figma `size` axis changes.
const meta = {
  title: 'Widgets/ChartWidget',
  component: ChartWidget,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    state: {
      control: { type: 'inline-radio' },
      options: [undefined, 'loading', 'empty', 'error'],
    },
  },
} satisfies Meta<typeof ChartWidget>;

export default meta;
type Story = StoryObj<typeof meta>;

const trendData = [
  { month: 'Jan', sessions: 186 },
  { month: 'Feb', sessions: 305 },
  { month: 'Mar', sessions: 237 },
  { month: 'Apr', sessions: 273 },
  { month: 'May', sessions: 209 },
  { month: 'Jun', sessions: 264 },
];

const trendConfig = { sessions: { label: 'Sessions' } } satisfies ChartConfig;

// One series per severity: a series is what carries a palette colour, so
// `{ name, value }` rows would be a single series across three categories — one
// colour for all three bars.
const severityData = [
  { month: 'Apr', error: 14, critical: 9, warning: 7 },
  { month: 'May', error: 9, critical: 12, warning: 6 },
  { month: 'Jun', error: 6, critical: 8, warning: 11 },
];

const severitySplit = [
  { name: 'error', value: 14 },
  { name: 'critical', value: 9 },
  { name: 'warning', value: 7 },
];

const severityConfig = {
  error: { label: 'Error', tone: { status: 'danger' } },
  critical: { label: 'Critical', tone: { status: 'critical' } },
  warning: { label: 'Warning', tone: { status: 'warning' } },
} satisfies ChartConfig;

const funnelData = [
  { name: 'Visited', value: 1200 },
  { name: 'Signup', value: 760 },
  { name: 'Activated', value: 410 },
  { name: 'Subscribed', value: 180 },
];

const funnelConfig = {
  Visited: { label: 'Visited' },
  Signup: { label: 'Signup' },
  Activated: { label: 'Activated' },
  Subscribed: { label: 'Subscribed' },
} satisfies ChartConfig;

// The dashboard the widgets live in — the grid, and nothing else. The row height
// lives here rather than on any card: 300px is what a cartesian widget measures
// in Figma (a 48px header over a 252px body), standing in for a real dashboard's
// row. No backdrop: the card brings its own surface, and a tinted page behind it
// only makes the baselines harder to read.
function Dashboard({
  cols = 1,
  className,
  children,
}: {
  cols?: 1 | 2;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={[
        'grid gap-4 [grid-auto-rows:300px]',
        cols === 2 ? 'grid-cols-2' : 'grid-cols-1',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </div>
  );
}

/** The ⋯ menu button every mockup puts in the header's actions slot. */
const MoreActions = () => (
  <ButtonIcon variant="ghost" aria-label="Widget actions">
    <EllipsisIcon size={16} />
  </ButtonIcon>
);

// `size-full`: the chart fills the body the card gives it, rather than carrying
// a height of its own.
const area = (
  <AreaChart
    config={trendConfig}
    data={trendData}
    dataKeys={['sessions']}
    xKey="month"
    showLegend={false}
    className="size-full"
  />
);

export const Default: Story = {
  args: {
    header: { title: 'Sessions', actions: <MoreActions /> },
    children: area,
  },
  render: (args) => (
    <Dashboard className="w-[592px]">
      <ChartWidget {...args} />
    </Dashboard>
  ),
};

/**
 * A title, a filter chip in `extras`, the ⋯ menu in `actions`. Nothing here is
 * re-implemented — `header` is spread straight onto `CardHeader`, so the props
 * this component never mentions (`isDraggable`, `hasRename`, `isCollapsible`, …)
 * work just the same.
 */
export const WithHeaderChrome: Story = {
  args: {
    header: {
      title: 'Sessions',
      extras: <Tag variant="info">Last 6 months</Tag>,
      actions: <MoreActions />,
    },
    children: area,
  },
  render: (args) => (
    <Dashboard className="w-[592px]">
      <ChartWidget {...args} />
    </Dashboard>
  ),
};

/**
 * The three dashboard widths, `sm` / `md` / `lg`. Only the width changes: the
 * height is the same in all three, which is why the widget takes no `size` — the
 * grid gives it one and the plot fills it.
 */
export const Widths: Story = {
  args: { children: area },
  parameters: { snapshot: { fullPage: true } },
  render: (args) => (
    <Dashboard>
      {[288, 592, 896].map((width) => (
        <ChartWidget
          {...args}
          key={width}
          header={{ title: `${width}px`, actions: <MoreActions /> }}
          style={{ width }}
        />
      ))}
    </Dashboard>
  ),
};

/**
 * `loading` / `empty` / `error` replace the plot. `error` also gives the Card its
 * error border — one prop, not two. The placeholder fills the same body the plot
 * would, so the card keeps its size.
 */
export const States: Story = {
  args: { children: area },
  parameters: { snapshot: { fullPage: true } },
  render: (args) => (
    <Dashboard cols={2} className="w-[608px]">
      {(['loading', 'empty', 'error'] as const).map((state) => (
        <ChartWidget
          {...args}
          key={state}
          state={state}
          variant="area"
          header={{ title: state, actions: <MoreActions /> }}
          stateAction={
            state === 'error' ? (
              <button type="button" className="text-sm underline">
                Try again
              </button>
            ) : undefined
          }
        />
      ))}
    </Dashboard>
  ),
};

/**
 * The same card around different chart types — only the content changes. Every
 * chart is `size-full`, so each fills the identical body.
 */
export const ChartTypes: Story = {
  args: { children: area },
  parameters: { snapshot: { fullPage: true } },
  render: () => (
    <Dashboard cols={2} className="w-[608px]">
      <ChartWidget header={{ title: 'Sessions', actions: <MoreActions /> }}>
        {area}
      </ChartWidget>
      <ChartWidget
        header={{ title: 'Alerts by severity', actions: <MoreActions /> }}
      >
        <BarChart
          config={severityConfig}
          palette={{ type: 'status' }}
          data={severityData}
          dataKeys={['error', 'critical', 'warning']}
          xKey="month"
          layout="stacked"
          showLegend={false}
          className="size-full"
        />
      </ChartWidget>
      <ChartWidget
        header={{ title: 'Severity split', actions: <MoreActions /> }}
      >
        <PieChart
          config={severityConfig}
          palette={{ type: 'status' }}
          data={severitySplit}
          dataKey="value"
          nameKey="name"
          shape="donut"
          className="size-full"
        />
      </ChartWidget>
      <ChartWidget header={{ title: 'Conversion', actions: <MoreActions /> }}>
        <FunnelChart
          config={funnelConfig}
          palette={{ type: 'sequential', ramp: 'blue' }}
          data={funnelData}
          dataKey="value"
          nameKey="name"
          className="size-full"
        />
      </ChartWidget>
    </Dashboard>
  ),
};

/**
 * A header-less widget — the plot fills the whole card. For a dashboard tile
 * whose heading lives outside the card, or a chart inside a larger panel.
 */
export const NoHeader: Story = {
  args: { children: area },
  render: (args) => (
    <Dashboard className="w-[288px]">
      <ChartWidget {...args} />
    </Dashboard>
  ),
};
