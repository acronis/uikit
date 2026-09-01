import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ColumnDef } from '@tanstack/react-table';
import { ChartPieIcon, EllipsisIcon, TagIcon } from '@acronis-platform/icons-react/stroke-mono';
import { DotBlueIcon, DotGreenIcon } from '@acronis-platform/icons-react/stroke-multi';

import { ChartWidget } from '../chart-widget';
import { AreaChart } from '../../area-chart';
import { BarChart } from '../../bar-chart';
import { ButtonIcon } from '../../button-icon';
import { DataTable } from '../../data-table';
import { FunnelChart } from '../../funnel-chart';
import { PieChart } from '../../pie-chart';
import { Tag } from '../../tag';
import { Metric } from '../../metric';
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
 * Long unbroken CTI error paths (API error messages, URLs) stay contained
 * within the card. The text wraps at any character boundary, and when the
 * message is taller than the card body the user can scroll vertically. The
 * icon stays anchored at the top so it's always visible.
 *
 * Two sizes: a KPI-sized widget (200px tall, 300px wide — matching the bug
 * report) and a standard dashboard cell (300px tall, 592px wide).
 */
export const ErrorLongDescription: Story = {
  args: { children: area },
  parameters: { snapshot: { fullPage: true } },
  render: () => (
    <div className="flex gap-4">
      <ChartWidget
        header={{ title: 'My widget' }}
        state="error"
        stateDescription="failed to execute 'cti.a.p.dts.func.v1.0~a.ax_core.query.v1.0~a.ax_core.widget.v1.0~a.ax_core.daily_activity_table.v1.0': failed to execute node 'func': failed to build return: failed to execute expression '$func[cti.a.p.dts.func.v1.0~a.ax_core.platform.daily_activity_table.v1.0](query=$.params.query)': failed to execute module function 'Platform.GetDailyActivityTableQuery': failed to query daily_activity_table: unmarshaling error"
        stateAction={
          <button type="button" className="text-sm underline">
            Try again
          </button>
        }
        className="h-[200px] w-[300px]"
      />
      <Dashboard className="w-[592px]">
        <ChartWidget
          header={{ title: 'Daily Activity', actions: <MoreActions /> }}
          state="error"
          stateDescription="failed to execute 'cti.a.p.dts.func.v1.0~a.ax_core.query.v1.0~a.ax_core.widget.v1.0~a.ax_core.daily_activity_table.v1.0': failed to execute node 'func': failed to build return: failed to execute expression '$func[cti.a.p.dts.func.v1.0~a.ax_core.platform.daily_activity_table.v1.0](query=$.params.query)': failed to execute module function 'Platform.GetDailyActivityTableQuery': failed to query daily_activity_table: unmarshaling error"
          stateAction={
            <button type="button" className="text-sm underline">
              Try again
            </button>
          }
        />
      </Dashboard>
    </div>
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

const successRateData = [
  { month: 'Jan', rate: 78 },
  { month: 'Feb', rate: 82 },
  { month: 'Mar', rate: 88 },
  { month: 'Apr', rate: 84 },
  { month: 'Jun', rate: 90 },
  { month: 'Dec', rate: 95 },
];
const successRateConfig = { rate: { label: 'Success rate' } } satisfies ChartConfig;

/**
 * `orientation="vertical"` (default): metric above the plot, full width. Use
 * at md/lg widths. Figma: node 8174:22335.
 */
export const MetricVertical: Story = {
  render: () => (
    <Dashboard className="w-[592px]">
      <ChartWidget
        header={{ title: 'Backup success rate', actions: <MoreActions /> }}
        metric={
          <Metric
            icon={<ChartPieIcon />}
            value="95"
            unit="%"
          />
        }
      >
        <AreaChart
          data={successRateData}
          config={successRateConfig}
          dataKeys={['rate']}
          xKey="month"
          className="size-full"
        />
      </ChartWidget>
    </Dashboard>
  ),
};

/**
 * `orientation="horizontal"`: metric left, chart right, each `flex-1`. Use at
 * sm (288px) where stacking would leave too little height for the chart.
 * Figma: node 8982:31681.
 */
export const MetricHorizontal: Story = {
  render: () => (
    <Dashboard className="w-[592px]">
      <ChartWidget
        header={{ title: 'Backup success rate', actions: <MoreActions /> }}
        orientation="horizontal"
        metric={
          <Metric
            icon={<ChartPieIcon />}
            value="95"
            unit="%"
            trend="up"
            trendValue="20%"
            supportingText="over 6 months"
          />
        }
      >
        <AreaChart
          data={successRateData}
          config={successRateConfig}
          dataKeys={['rate']}
          xKey="month"
          className="size-full"
        />
      </ChartWidget>
    </Dashboard>
  ),
};

type WidgetTableRow = {
  col1: string;
  tags: Array<{ label: string; variant: 'info' | 'neutral' }>;
  col3: string;
  status: 'success' | 'info';
  col5: string;
};

const widgetTableData: WidgetTableRow[] = [
  {
    col1: 'Simple value',
    tags: [
      { label: 'Label', variant: 'info' },
      { label: '+4', variant: 'neutral' },
    ],
    col3: 'Simple value',
    status: 'success',
    col5: 'Simple value',
  },
  {
    col1: 'Simple value',
    tags: [{ label: 'Label', variant: 'info' }],
    col3: 'Simple value',
    status: 'info',
    col5: 'Simple value',
  },
  {
    col1: 'Simple value',
    tags: [{ label: 'Label', variant: 'info' }],
    col3: 'Simple value',
    status: 'info',
    col5: 'Simple value',
  },
  {
    col1: 'Simple value',
    tags: [{ label: 'Label', variant: 'info' }],
    col3: 'Simple value',
    status: 'info',
    col5: 'Simple value',
  },
  {
    col1: 'Simple value',
    tags: [{ label: 'Label', variant: 'info' }],
    col3: 'Simple value',
    status: 'info',
    col5: 'Simple value',
  },
];

const tableHeader = () => <span className="whitespace-nowrap">Table header</span>;

const widgetTableColumns: ColumnDef<WidgetTableRow>[] = [
  {
    accessorKey: 'col1',
    header: tableHeader,
    cell: ({ row }) => <span className="truncate">{row.original.col1}</span>,
  },
  {
    accessorKey: 'tags',
    header: tableHeader,
    cell: ({ row }) => (
      <div className="flex min-w-0 gap-2 overflow-hidden">
        {row.original.tags.map(({ label, variant }) => (
          <Tag key={label} variant={variant} icon={variant === 'info' ? <TagIcon /> : undefined}>
            {label}
          </Tag>
        ))}
      </div>
    ),
  },
  {
    accessorKey: 'col3',
    header: tableHeader,
    cell: ({ row }) => <span className="truncate">{row.original.col3}</span>,
  },
  {
    accessorKey: 'status',
    header: tableHeader,
    cell: ({ row }) => (
      <div className="flex min-w-0 items-center gap-2 overflow-hidden">
        {row.original.status === 'success' ? (
          <DotGreenIcon size={16} />
        ) : (
          <DotBlueIcon size={16} />
        )}
        <span className="truncate">Simple value</span>
      </div>
    ),
  },
  {
    accessorKey: 'col5',
    header: tableHeader,
    cell: ({ row }) => <span className="truncate">{row.original.col5}</span>,
  },
];

/**
 * A `DataTable` inside a `ChartWidget`. `bodyClassName="p-0"` removes the
 * card body padding so the table fills edge-to-edge. Figma: node 8982:34522.
 */
export const WithDataTable: Story = {
  render: () => (
    <div className="w-[592px]">
      <ChartWidget
        header={{ title: 'Title', actions: <MoreActions /> }}
        bodyClassName="p-0"
      >
        <DataTable
          columns={widgetTableColumns}
          data={widgetTableData}
          hideActionColumn
        />
      </ChartWidget>
    </div>
  ),
};
