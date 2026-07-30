import type { Meta, StoryObj } from '@storybook/react-vite';

import { ChartContainer, type ChartConfig } from '../chart';
import { AreaChart } from '../../area-chart';
import { BarChart } from '../../bar-chart';
import { LineChart } from '../../line-chart';
import { PieChart } from '../../pie-chart';
import { ScatterChart } from '../../scatter-chart';
import { ComposedChart } from '../../composed-chart';
import { RadarChart } from '../../radar-chart';
import { RadialBarChart } from '../../radial-bar-chart';
import { FunnelChart } from '../../funnel-chart';
import { Treemap } from '../../treemap';
import { Histogram } from '../../histogram';
import { ConfidenceCone } from '../../confidence-cone';
import { SankeyChart } from '../../sankey-chart';
import { CategoryBar } from '../../category-bar';

// The `Chart` entry is the shared primitives (`ChartContainer` + tooltip/legend);
// autodocs documents that primitive API. Its one visual story is an Overview
// gallery: one compact example of every per-type chart component in the suite,
// each built from the REAL component (no hand-wired recharts) with the minimal,
// valid prop set from that component's own story. Series colors reference the
// shared semantic status/brand tokens (no chart token tier yet).
const meta = {
  title: 'Widgets/Chart',
  component: ChartContainer,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  // The ChartContainer is transparent by design (it inherits the surface it sits
  // on — usually a Card). Render on a themed surface so the charts are legible in
  // both light and dark; without it, dark mode flips the token-driven text/grid
  // but leaves the backdrop unthemed.
  decorators: [
    (Story) => (
      <div className="rounded-lg border border-border bg-background p-6 text-foreground">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ChartContainer>;

export default meta;
type Story = StoryObj<typeof meta>;

// Shared category/series data for the cartesian components (Area/Bar/Line/Composed).
const cartesianData = [
  { month: 'Jan', desktop: 186, mobile: 80 },
  { month: 'Feb', desktop: 305, mobile: 200 },
  { month: 'Mar', desktop: 237, mobile: 120 },
  { month: 'Apr', desktop: 173, mobile: 190 },
];

const cartesianConfig = {
  desktop: { label: 'Desktop', color: 'var(--ui-background-brand-secondary)' },
  mobile: { label: 'Mobile', color: 'var(--ui-background-status-strong-danger)' },
} satisfies ChartConfig;

// Shared name-keyed data for the part-to-whole components (Pie/RadialBar/Funnel/Treemap).
const partData = [
  { name: 'Chrome', value: 275 },
  { name: 'Safari', value: 200 },
  { name: 'Firefox', value: 187 },
  { name: 'Edge', value: 120 },
];

const partConfig = {
  Chrome: { label: 'Chrome', color: 'var(--ui-background-brand-secondary)' },
  Safari: { label: 'Safari', color: 'var(--ui-background-status-strong-danger)' },
  Firefox: {
    label: 'Firefox',
    color: 'var(--ui-background-status-strong-success)',
  },
  Edge: { label: 'Edge', color: 'var(--ui-background-status-strong-warning)' },
} satisfies ChartConfig;

const scatterSeries = [
  {
    key: 'classA',
    data: [
      { hours: 2, score: 55 },
      { hours: 4, score: 65 },
      { hours: 6, score: 78 },
      { hours: 8, score: 92 },
    ],
  },
  {
    key: 'classB',
    data: [
      { hours: 1, score: 70 },
      { hours: 5, score: 60 },
      { hours: 9, score: 95 },
      { hours: 3, score: 48 },
    ],
  },
];

const scatterConfig = {
  classA: { label: 'Class A', color: 'var(--ui-background-brand-secondary)' },
  classB: { label: 'Class B', color: 'var(--ui-background-status-strong-danger)' },
} satisfies ChartConfig;

const radarData = [
  { subject: 'Math', alice: 120, bob: 110 },
  { subject: 'English', alice: 86, bob: 130 },
  { subject: 'Physics', alice: 85, bob: 90 },
  { subject: 'History', alice: 65, bob: 85 },
  { subject: 'Geo', alice: 99, bob: 100 },
];

const radarConfig = {
  alice: { label: 'Alice', color: 'var(--ui-background-brand-secondary)' },
  bob: { label: 'Bob', color: 'var(--ui-background-status-strong-danger)' },
} satisfies ChartConfig;

const histogramValues = [
  12, 15, 18, 20, 22, 23, 24, 25, 26, 28, 30, 32, 35, 40, 45, 52, 64,
];

const histogramConfig = {
  count: { label: 'Frequency', color: 'var(--ui-background-brand-secondary)' },
} satisfies ChartConfig;

const coneData = [
  { month: 'Jan', actual: 100 },
  { month: 'Feb', actual: 118 },
  { month: 'Mar', actual: 130 },
  { month: 'Apr', actual: 150, forecast: 150, lower: 150, upper: 150 },
  { month: 'May', forecast: 165, lower: 150, upper: 182 },
  { month: 'Jun', forecast: 180, lower: 156, upper: 210 },
];

const coneConfig = {
  actual: { label: 'Actual', color: 'var(--ui-background-brand-secondary)' },
  forecast: { label: 'Forecast', color: 'var(--ui-background-brand-secondary)' },
} satisfies ChartConfig;

const sankeyData = {
  nodes: [{ name: 'signups' }, { name: 'active' }, { name: 'churned' }],
  links: [
    { source: 0, target: 1, value: 68 },
    { source: 0, target: 2, value: 32 },
  ],
};

const sankeyConfig = {
  signups: {
    label: 'Sign-ups',
    color: 'var(--ui-background-status-strong-info)',
  },
  active: {
    label: 'Active',
    color: 'var(--ui-background-status-strong-success)',
  },
  churned: {
    label: 'Churned',
    color: 'var(--ui-background-status-strong-danger)',
  },
} satisfies ChartConfig;

const categoryBarData = [
  { key: 'passed', value: 68 },
  { key: 'warnings', value: 22 },
  { key: 'failed', value: 10 },
];

const categoryBarConfig = {
  passed: {
    label: 'Passed',
    color: 'var(--ui-background-status-strong-success)',
  },
  warnings: {
    label: 'Warnings',
    color: 'var(--ui-background-status-strong-warning)',
  },
  failed: {
    label: 'Failed',
    color: 'var(--ui-background-status-strong-danger)',
  },
} satisfies ChartConfig;

// Every per-type chart component in the suite, one compact example each.
// The gallery is taller than the default viewport, so capture the full page
// (otherwise the lower rows are clipped from the VR baseline).
export const Overview: Story = {
  parameters: { snapshot: { fullPage: true } },
  args: { config: cartesianConfig, children: <span /> },
  render: () => (
    <div className="grid w-[960px] grid-cols-2 gap-6">
      <div>
        <h3 className="mb-2 text-sm font-medium text-muted-foreground">Area chart</h3>
        <AreaChart
          config={cartesianConfig}
          data={cartesianData}
          dataKeys={['desktop', 'mobile']}
          xKey="month"
          showLegend={false}
          className="h-[180px] w-full"
        />
      </div>
      <div>
        <h3 className="mb-2 text-sm font-medium text-muted-foreground">Bar chart</h3>
        <BarChart
          config={cartesianConfig}
          data={cartesianData}
          dataKeys={['desktop', 'mobile']}
          xKey="month"
          showLegend={false}
          className="h-[180px] w-full"
        />
      </div>
      <div>
        <h3 className="mb-2 text-sm font-medium text-muted-foreground">Line chart</h3>
        <LineChart
          config={cartesianConfig}
          data={cartesianData}
          dataKeys={['desktop', 'mobile']}
          xKey="month"
          showLegend={false}
          className="h-[180px] w-full"
        />
      </div>
      <div>
        <h3 className="mb-2 text-sm font-medium text-muted-foreground">Pie chart</h3>
        <PieChart
          config={partConfig}
          data={partData}
          dataKey="value"
          nameKey="name"
          shape="pie"
          showLegend={false}
          className="h-[180px] w-full"
        />
      </div>
      <div>
        <h3 className="mb-2 text-sm font-medium text-muted-foreground">Scatter chart</h3>
        <ScatterChart
          config={scatterConfig}
          series={scatterSeries}
          xKey="hours"
          yKey="score"
          showLegend={false}
          className="h-[180px] w-full"
        />
      </div>
      <div>
        <h3 className="mb-2 text-sm font-medium text-muted-foreground">Composed chart</h3>
        <ComposedChart
          config={cartesianConfig}
          data={cartesianData}
          series={[
            { key: 'desktop', type: 'bar' },
            { key: 'mobile', type: 'line' },
          ]}
          xKey="month"
          showLegend={false}
          className="h-[180px] w-full"
        />
      </div>
      <div>
        <h3 className="mb-2 text-sm font-medium text-muted-foreground">Radar chart</h3>
        <RadarChart
          config={radarConfig}
          data={radarData}
          dataKeys={['alice', 'bob']}
          angleKey="subject"
          showLegend={false}
          className="h-[180px] w-full"
        />
      </div>
      <div>
        <h3 className="mb-2 text-sm font-medium text-muted-foreground">Radial bar chart</h3>
        <RadialBarChart
          config={partConfig}
          data={partData}
          dataKey="value"
          nameKey="name"
          innerRadius={20}
          outerRadius={80}
          showLegend={false}
          className="h-[180px] w-full"
        />
      </div>
      <div>
        <h3 className="mb-2 text-sm font-medium text-muted-foreground">Funnel chart</h3>
        <FunnelChart
          config={partConfig}
          data={partData}
          dataKey="value"
          nameKey="name"
          className="h-[180px] w-full"
        />
      </div>
      <div>
        <h3 className="mb-2 text-sm font-medium text-muted-foreground">Treemap</h3>
        <Treemap
          config={partConfig}
          data={partData}
          dataKey="value"
          nameKey="name"
          className="h-[180px] w-full"
        />
      </div>
      <div>
        <h3 className="mb-2 text-sm font-medium text-muted-foreground">Histogram</h3>
        <Histogram
          config={histogramConfig}
          values={histogramValues}
          binCount={6}
          className="h-[180px] w-full"
        />
      </div>
      <div>
        <h3 className="mb-2 text-sm font-medium text-muted-foreground">Confidence cone</h3>
        <ConfidenceCone
          config={coneConfig}
          data={coneData}
          xKey="month"
          actualKey="actual"
          forecastKey="forecast"
          lowerKey="lower"
          upperKey="upper"
          showLegend={false}
          className="h-[180px] w-full"
        />
      </div>
      <div className="col-span-2">
        <h3 className="mb-2 text-sm font-medium text-muted-foreground">Sankey chart</h3>
        <SankeyChart
          config={sankeyConfig}
          data={sankeyData}
          className="h-[220px] w-full"
        />
      </div>
      <div className="col-span-2">
        <h3 className="mb-2 text-sm font-medium text-muted-foreground">Category bar</h3>
        <CategoryBar
          config={categoryBarConfig}
          data={categoryBarData}
          showLegend
          className="w-full"
        />
      </div>
    </div>
  ),
};
