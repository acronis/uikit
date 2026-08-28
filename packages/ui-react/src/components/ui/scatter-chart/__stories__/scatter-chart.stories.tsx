import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  EllipsisIcon,
  SquareDashedIcon,
} from '@acronis-platform/icons-react/stroke-mono';
import {
  CartesianGrid,
  Scatter,
  ScatterChart as RechartsScatterChart,
  XAxis,
  YAxis,
} from 'recharts';

import { ScatterChart } from '../scatter-chart';
import { paletteArgTypes } from '../../chart/__stories__/palette-control';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '../../chart';
import { ChartWidget } from '../../chart-widget';
import { ButtonIcon } from '../../button-icon';
import { Metric } from '../../metric';

// Series colors are supplied by the caller via `config`, keyed by each series'
// `key`. There is no chart token tier yet, so these reference the shared semantic
// brand/status tokens (a dedicated data-viz palette is pending an upstream design
// pass). The status tokens are chromatic in every brand; `brand-secondary` is
// brand-dependent.
const series = [
  {
    key: 'classA',
    data: [
      { hours: 2, score: 55, weight: 60 },
      { hours: 4, score: 65, weight: 72 },
      { hours: 6, score: 78, weight: 85 },
      { hours: 8, score: 92, weight: 95 },
      { hours: 3, score: 48, weight: 55 },
      { hours: 7, score: 85, weight: 90 },
    ],
  },
  {
    key: 'classB',
    data: [
      { hours: 1, score: 70, weight: 40 },
      { hours: 5, score: 82, weight: 78 },
      { hours: 9, score: 95, weight: 98 },
      { hours: 3, score: 60, weight: 65 },
      { hours: 6, score: 75, weight: 82 },
      { hours: 4, score: 58, weight: 70 },
    ],
  },
];

const config = {
  classA: { label: 'Class A' },
  classB: { label: 'Class B' },
} satisfies ChartConfig;

const meta = {
  title: 'Widgets/ScatterChart',
  component: ScatterChart,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: {
    config,
    series,
    xKey: 'hours',
    yKey: 'score',
    palette: 'diverging-teal-violet',
    className: 'h-[360px] w-[520px]',
  },
  argTypes: {
    ...paletteArgTypes,
    palette: {
      ...paletteArgTypes.palette,
      table: { category: 'Appearance', defaultValue: { summary: 'diverging-teal-violet' } },
    },
    shape: {
      control: 'inline-radio',
      options: ['circle', 'square', 'triangle', 'diamond', 'star', 'cross', 'wye'],
    },
    zKey: { control: 'text' },
    xAxisLabel: { control: 'text' },
    yAxisLabel: { control: 'text' },
    xUnit: { control: 'text' },
    yUnit: { control: 'text' },
    showGrid: { control: 'boolean' },
    showTooltip: { control: 'boolean' },
    showLegend: { control: 'boolean' },
    animate: { control: 'boolean' },
    animationDuration: { control: { type: 'number' } },
    animationBegin: { control: { type: 'number' } },
    animationEasing: {
      control: 'select',
      options: ['ease', 'ease-in', 'ease-out', 'ease-in-out', 'linear'],
    },
  },
} satisfies Meta<typeof ScatterChart>;

export default meta;
type Story = StoryObj<typeof meta>;

// Two groups plotted as points on shared x/y axes — the zero-override baseline.
export const Default: Story = {};

// Separate widget data matching the Figma scatter node (9005:73973, size=size2).
const widgetSeries = [
  {
    key: 'ransomware',
    data: [
      { pct: 0, count: 160 }, { pct: 10, count: 140 },
      { pct: 20, count: 230 }, { pct: 25, count: 170 },
      { pct: 30, count: 180 }, { pct: 50, count: 140 },
      { pct: 60, count: 120 }, { pct: 75, count: 60 },
      { pct: 80, count: 70 }, { pct: 100, count: 30 },
    ],
  },
  {
    key: 'phishing',
    data: [
      { pct: 5, count: 180 }, { pct: 15, count: 100 },
      { pct: 22, count: 60 }, { pct: 28, count: 140 },
      { pct: 55, count: 200 }, { pct: 58, count: 190 },
      { pct: 65, count: 195 }, { pct: 78, count: 280 },
      { pct: 98, count: 310 },
    ],
  },
];

const widgetConfig = {
  ransomware: { label: 'Ransomware' },
  phishing: { label: 'Phishing' },
} satisfies ChartConfig;

// The chart inside a ChartWidget — the way it appears in a product dashboard.
// Matches Figma node `9005:73973` (size=size2, 592 × 300 px).
export const WidgetExample: Story = {
  render: () => (
    <div className="h-[300px] w-[592px]">
      <ChartWidget
        header={{
          title: 'Title',
          actions: (
            <ButtonIcon variant="ghost" aria-label="Widget actions">
              <EllipsisIcon size={16} />
            </ButtonIcon>
          ),
        }}
        metric={
          <Metric
            icon={<SquareDashedIcon />}
            value="125"
            unit="Label"
          />
        }
      >
        <ScatterChart
          config={widgetConfig}
          series={widgetSeries}
          xKey="pct"
          yKey="count"
          className="size-full"
        />
      </ChartWidget>
    </div>
  ),
};

// Axis/grid configuration: rotated X ticks, zero-anchored Y domain, fixed tick
// count, solid grid (gridDashed={false} overrides the dashed default).
export const AxisAndGridConfig: Story = {
  args: {
    xAxisAngle: -45,
    yAxisDomain: 'zero',
    yAxisTickCount: 4,
    gridDashed: false,
  },
};

// Map a third numeric field to point size (a bubble chart) via zKey.
export const Bubble: Story = {
  args: { zKey: 'weight', zRange: [60, 500] },
};

// Triangle markers instead of the default circles.
export const TriangleMarkers: Story = {
  args: { shape: 'triangle' },
};

// Axis titles + unit suffixes on both numeric axes, forwarded to recharts'
// native `label` / `unit`. The title inherits the theme token via the
// container's `.recharts-label` fill selector.
export const AxisLabels: Story = {
  args: {
    xAxisLabel: 'Spend',
    yAxisLabel: 'Conversions',
    xUnit: '$',
    yUnit: '%',
  },
};

// All chrome toggled off — the baseline that would catch a toggle silently
// becoming a no-op (the unit env can't paint recharts chrome).
export const NoChrome: Story = {
  args: { showGrid: false, showTooltip: false, showLegend: false },
};

// The tooltip is hover-only, so a normal story never snapshots it. This renders
// the raw composition so recharts' `defaultIndex` can open the tooltip
// statically for the visual-regression baseline (see the skill's VR note).
export const TooltipOpen: Story = {
  render: () => (
    <ChartContainer config={config} className="h-[360px] w-[520px]">
      <RechartsScatterChart margin={{ top: 16, right: 16, bottom: 16, left: 16 }}>
        <CartesianGrid />
        <XAxis type="number" dataKey="hours" name="hours" tickLine={false} axisLine={false} />
        <YAxis type="number" dataKey="score" name="score" tickLine={false} axisLine={false} />
        <ChartTooltip
          defaultIndex={2}
          active
          cursor={{ strokeDasharray: '3 3' }}
          content={<ChartTooltipContent />}
        />
        <Scatter
          name="classA"
          data={series[0].data}
          fill="var(--color-classA)"
          isAnimationActive={false}
        />
        <Scatter
          name="classB"
          data={series[1].data}
          fill="var(--color-classB)"
          isAnimationActive={false}
        />
      </RechartsScatterChart>
    </ChartContainer>
  ),
};

// A configured `ChartTooltipContent` (from this library, no recharts needed):
// `hideLabel` drops the header; `formatter` renders each axis row. Shared below.
const customTooltipContent = (
  <ChartTooltipContent
    hideLabel
    formatter={(value, name) => (
      <div className="flex w-full justify-between gap-3">
        <span className="capitalize text-muted-foreground">{name}</span>
        <span className="font-mono font-medium tabular-nums">
          {Number(value).toLocaleString()}
        </span>
      </div>
    )}
  />
);

// Customize the tooltip through the component's `tooltipContent` prop — this is
// the usage example (autodocs). The tooltip is hover-only, so it isn't painted
// here; `CustomTooltipOpen` below is the visual-regression case.
export const CustomTooltip: Story = {
  args: { tooltipContent: customTooltipContent },
};

// The same custom tooltip, forced open for the VR baseline: like `TooltipOpen`,
// this renders the raw composition (recharts can't open a hover tooltip
// statically otherwise) with the shared custom content wired in.
export const CustomTooltipOpen: Story = {
  render: () => (
    <ChartContainer config={config} className="h-[360px] w-[520px]">
      <RechartsScatterChart margin={{ top: 16, right: 16, bottom: 16, left: 16 }}>
        <CartesianGrid />
        <XAxis type="number" dataKey="hours" name="hours" tickLine={false} axisLine={false} />
        <YAxis type="number" dataKey="score" name="score" tickLine={false} axisLine={false} />
        <ChartTooltip
          defaultIndex={2}
          active
          cursor={{ strokeDasharray: '3 3' }}
          content={customTooltipContent}
        />
        <Scatter
          name="classA"
          data={series[0].data}
          fill="var(--color-classA)"
          isAnimationActive={false}
        />
        <Scatter
          name="classB"
          data={series[1].data}
          fill="var(--color-classB)"
          isAnimationActive={false}
        />
      </RechartsScatterChart>
    </ChartContainer>
  ),
};

// Map numeric ticks to labels with `yTickFormatter` — a value→band transform
// (`score → Low / Mid / High`) a `unit` suffix can't express.
export const MappedValueAxis: Story = {
  args: {
    yTickFormatter: (score) =>
      Number(score) >= 80 ? 'High' : Number(score) >= 60 ? 'Mid' : 'Low',
  },
};

// Hide both axes with `showXAxis` / `showYAxis` — the compact/sparkline layout.
// Carries a baseline so a regression in either toggle is caught visually; the
// unit tests can't assert it (recharts needs a laid-out container).
export const HiddenAxes: Story = {
  args: { showXAxis: false, showYAxis: false },
};

// Entrance animation on — a live example. Excluded from VR (snapshot.skip):
// the motion is non-deterministic, so it must not become a baseline.
export const Animated: Story = {
  parameters: { snapshot: { skip: true } },
  args: { animate: true, animationDuration: 800 },
};
