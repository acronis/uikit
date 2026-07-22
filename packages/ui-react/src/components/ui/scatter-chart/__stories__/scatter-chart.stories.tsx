import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  CartesianGrid,
  Scatter,
  ScatterChart as RechartsScatterChart,
  XAxis,
  YAxis,
} from 'recharts';

import { ScatterChart } from '../scatter-chart';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '../../chart';

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
  classA: { label: 'Class A', color: 'var(--ui-background-brand-secondary)' },
  classB: { label: 'Class B', color: 'var(--ui-background-status-strong-danger)' },
} satisfies ChartConfig;

const meta = {
  title: 'UI/ScatterChart',
  component: ScatterChart,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  // The ChartContainer is transparent by design (it inherits the surface it sits
  // on — usually a Card). Render the stories on a themed surface so the chart is
  // legible in both light and dark; without it, dark mode flips the token-driven
  // text/grid but leaves the backdrop unthemed.
  decorators: [
    (Story) => (
      <div className="rounded-lg border border-border bg-background p-6 text-foreground">
        <Story />
      </div>
    ),
  ],
  args: {
    config,
    series,
    xKey: 'hours',
    yKey: 'score',
    shape: 'circle',
    showGrid: true,
    showTooltip: true,
    showLegend: true,
    className: 'h-[360px] w-[520px]',
  },
  argTypes: {
    shape: {
      control: 'inline-radio',
      options: ['circle', 'square', 'triangle', 'diamond', 'star', 'cross', 'wye'],
    },
    zKey: { control: 'text' },
    showGrid: { control: 'boolean' },
    showTooltip: { control: 'boolean' },
    showLegend: { control: 'boolean' },
  },
} satisfies Meta<typeof ScatterChart>;

export default meta;
type Story = StoryObj<typeof meta>;

// Two groups plotted as points on shared x/y axes.
export const Grouped: Story = {};

// Map a third numeric field to point size (a bubble chart) via zKey.
export const Bubble: Story = {
  args: { zKey: 'weight', zRange: [60, 500] },
};

// Triangle markers instead of the default circles.
export const TriangleMarkers: Story = {
  args: { shape: 'triangle' },
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
