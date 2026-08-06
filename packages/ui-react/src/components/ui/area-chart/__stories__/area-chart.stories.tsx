import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Area,
  AreaChart as RechartsAreaChart,
  CartesianGrid,
  XAxis,
} from 'recharts';

import { AreaChart } from '../area-chart';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  formatCompactNumber,
  type ChartConfig,
} from '../../chart';

// Series colors are supplied by the caller via `config`. There is no chart token
// tier yet, so these reference the shared semantic brand/status tokens (a
// dedicated data-viz palette is pending an upstream design pass). The status
// tokens are chromatic in every brand; `brand-secondary` is brand-dependent.
const data = [
  { month: 'Jan', desktop: 186, mobile: 80, tablet: 40 },
  { month: 'Feb', desktop: 305, mobile: 200, tablet: 90 },
  { month: 'Mar', desktop: 237, mobile: 120, tablet: 60 },
  { month: 'Apr', desktop: 173, mobile: 190, tablet: 30 },
  { month: 'May', desktop: 209, mobile: 130, tablet: 70 },
  { month: 'Jun', desktop: 214, mobile: 140, tablet: 80 },
];

const config = {
  desktop: { label: 'Desktop', color: 'var(--ui-background-brand-secondary)' },
  mobile: { label: 'Mobile', color: 'var(--ui-background-status-strong-danger)' },
  tablet: {
    label: 'Tablet',
    color: 'var(--ui-background-status-strong-success)',
  },
} satisfies ChartConfig;

const meta = {
  title: 'Widgets/AreaChart',
  component: AreaChart,
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
    data,
    dataKeys: ['desktop', 'mobile', 'tablet'],
    xKey: 'month',
    curve: 'monotone',
    strokeWidth: 2,
    fillOpacity: 0.4,
    showDots: false,
    connectNulls: false,
    showGrid: true,
    showTooltip: true,
    showLegend: true,
    className: 'h-[320px] w-[560px]',
  },
  argTypes: {
    layout: { control: 'inline-radio', options: ['single', 'stacked'] },
    fill: { control: 'inline-radio', options: ['solid', 'gradient'] },
    curve: {
      control: 'select',
      options: [
        'linear',
        'monotone',
        'natural',
        'basis',
        'step',
        'stepBefore',
        'stepAfter',
      ],
    },
    strokeWidth: { control: { type: 'number', min: 0, max: 6 } },
    fillOpacity: { control: { type: 'number', min: 0, max: 1, step: 0.1 } },
    showDots: { control: 'boolean' },
    dotSize: { control: { type: 'number', min: 1, max: 10 } },
    showActiveDot: { control: 'boolean' },
    areaSettings: {
      control: 'object',
      description:
        'Per-series overrides keyed by data key, e.g. `{ mobile: { dashed: true, fillOpacity: 0.1 } }`.',
    },
    referenceLine: {
      control: 'object',
      description:
        'A dashed target/average rule, e.g. `{ value: 250, label: "Target" }` or `{ average: true }`.',
    },
    connectNulls: { control: 'boolean' },
    xAxisLabel: { control: 'text' },
    yAxisLabel: { control: 'text' },
    yUnit: { control: 'text' },
    showGrid: { control: 'boolean' },
    showTooltip: { control: 'boolean' },
    showLegend: { control: 'boolean' },
    showBrush: { control: 'boolean' },
    brushHeight: { control: { type: 'number', min: 16, max: 80 } },
    brushAriaLabel: { control: 'text' },
    animate: { control: 'boolean' },
    animationDuration: { control: { type: 'number' } },
    animationBegin: { control: { type: 'number' } },
    animationEasing: {
      control: 'select',
      options: ['ease', 'ease-in', 'ease-out', 'ease-in-out', 'linear'],
    },
    showLabels: { control: 'boolean' },
    labelPosition: {
      control: 'select',
      options: [
        'top',
        'bottom',
        'left',
        'right',
        'center',
        'insideTop',
        'insideBottom',
        'insideLeft',
        'insideRight',
        'insideStart',
        'insideEnd',
      ],
    },
  },
} satisfies Meta<typeof AreaChart>;

export default meta;
type Story = StoryObj<typeof meta>;

// New shared axis/grid knobs: rotated X ticks, a zero-anchored Y domain, a
// fixed Y tick count, and a dashed grid. See "Formatting and hiding axes".
export const AxisAndGridConfig: Story = {
  args: {
    xAxisAngle: -45,
    yAxisDomain: 'zero',
    yAxisTickCount: 4,
    gridDashed: true,
  },
};

// Overlapping areas with the default gradient fill.
export const Single: Story = {
  args: { layout: 'single', fill: 'gradient' },
};

// Areas summed on a shared stack.
export const Stacked: Story = {
  args: { layout: 'stacked', fill: 'gradient' },
};

// Flat translucent fill instead of a gradient.
export const SolidFill: Story = {
  args: { fill: 'solid' },
};

// The four curve types beyond linear/monotone/step, side by side on one series
// so the interpolation is the only difference: `natural` and `basis` smooth more
// (and `basis` need not pass through the points), while `stepBefore` /
// `stepAfter` move the step to the leading or trailing point.
export const ExtendedCurves: Story = {
  render: (args) => (
    <div className="grid grid-cols-2 gap-4">
      {(['natural', 'basis', 'stepBefore', 'stepAfter'] as const).map((curve) => (
        <div key={curve} className="space-y-1">
          <p className="text-xs text-muted-foreground">{curve}</p>
          <AreaChart
            {...args}
            curve={curve}
            dataKeys={['desktop']}
            showLegend={false}
            className="h-[160px] w-[260px]"
          />
        </div>
      ))}
    </div>
  ),
};

// Per-series overrides: a faint, dashed projection beside solid actuals, and a
// third series stepped with its own dots.
export const PerSeriesStyling: Story = {
  args: {
    fill: 'solid',
    showDots: true,
    areaSettings: {
      mobile: { dashed: true, fillOpacity: 0.1, showDots: false },
      tablet: { curveType: 'stepAfter', dotSize: 5 },
    },
  },
};

// A fixed target plus the mean of the plotted series, both captioned. The rule
// extends the axis domain, so a target above the data maximum stays visible.
export const ReferenceLines: Story = {
  args: {
    dataKeys: ['desktop'],
    referenceLine: [
      { value: 320, label: 'Target' },
      { average: true, label: 'Average' },
    ],
  },
};

// Response times in ms — real units, so `yUnit`/`xUnit` read truthfully. (The
// session-count data above has no unit; the former `yUnit="k"` was an
// abbreviation masquerading as one.)
const latencyData = [
  { month: 'Jan', p95: 180 },
  { month: 'Feb', p95: 240 },
  { month: 'Mar', p95: 210 },
  { month: 'Apr', p95: 320 },
  { month: 'May', p95: 260 },
  { month: 'Jun', p95: 290 },
];

const latencyConfig = {
  p95: { label: 'p95 latency', color: 'var(--ui-background-brand-secondary)' },
} satisfies ChartConfig;

// Axis titles + a Y-axis unit suffix, forwarded to recharts' native
// `label` / `unit`. The title inherits the theme token via the container's
// `.recharts-label` fill selector.
export const AxisLabels: Story = {
  args: {
    config: latencyConfig,
    data: latencyData,
    dataKeys: ['p95'],
    xAxisLabel: 'Month',
    yAxisLabel: 'Response time',
    yUnit: 'ms',
  },
};

// All chrome toggled off + a solid flat fill — the baseline that would catch a
// toggle silently becoming a no-op (the unit env can't paint recharts chrome).
export const NoChrome: Story = {
  args: {
    showGrid: false,
    showTooltip: false,
    showLegend: false,
    showDots: false,
    fill: 'solid',
  },
};

// The tooltip is hover-only, so a normal story never snapshots it. This renders
// the raw composition so recharts' `defaultIndex` can open the tooltip
// statically for the visual-regression baseline (see the skill's VR note).
export const TooltipOpen: Story = {
  render: () => (
    <ChartContainer config={config} className="h-[320px] w-[560px]">
      <RechartsAreaChart data={data}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
        <ChartTooltip defaultIndex={2} active content={<ChartTooltipContent />} />
        <Area
          type="monotone"
          dataKey="desktop"
          stroke="var(--color-desktop)"
          fill="var(--color-desktop)"
          fillOpacity={0.4}
          isAnimationActive={false}
        />
        <Area
          type="monotone"
          dataKey="mobile"
          stroke="var(--color-mobile)"
          fill="var(--color-mobile)"
          fillOpacity={0.4}
          isAnimationActive={false}
        />
        <Area
          type="monotone"
          dataKey="tablet"
          stroke="var(--color-tablet)"
          fill="var(--color-tablet)"
          fillOpacity={0.4}
          isAnimationActive={false}
        />
      </RechartsAreaChart>
    </ChartContainer>
  ),
};

// A configured `ChartTooltipContent` (from this library, no recharts needed):
// `labelFormatter` adds an extra header field; `formatter` renders each row
// (swatch + config label + unit-suffixed value). Shared by the two stories below.
const customTooltipContent = (
  <ChartTooltipContent
    labelFormatter={(label) => `${label} · fiscal Q3`}
    formatter={(value, name, item) => (
      <div className="flex w-full items-center gap-2">
        <span
          className="size-2.5 shrink-0 rounded-[2px]"
          style={{ backgroundColor: item.color }}
        />
        <span className="text-muted-foreground">
          {config[name as keyof typeof config]?.label ?? name}
        </span>
        <span className="ms-auto font-mono font-medium tabular-nums">
          {Number(value).toLocaleString()}k
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
    <ChartContainer config={config} className="h-[320px] w-[560px]">
      <RechartsAreaChart data={data}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
        <ChartTooltip defaultIndex={2} active content={customTooltipContent} />
        <Area
          type="monotone"
          dataKey="desktop"
          stroke="var(--color-desktop)"
          fill="var(--color-desktop)"
          fillOpacity={0.4}
          isAnimationActive={false}
        />
        <Area
          type="monotone"
          dataKey="mobile"
          stroke="var(--color-mobile)"
          fill="var(--color-mobile)"
          fillOpacity={0.4}
          isAnimationActive={false}
        />
        <Area
          type="monotone"
          dataKey="tablet"
          stroke="var(--color-tablet)"
          fill="var(--color-tablet)"
          fillOpacity={0.4}
          isAnimationActive={false}
        />
      </RechartsAreaChart>
    </ChartContainer>
  ),
};

// Compact the value axis with `yTickFormatter` — `146500 → "146.5K"`. A real
// value transform, which the plain `unit` suffix can't do (it can only append
// text).
const revenueData = [
  { month: 'Jan', revenue: 128600 },
  { month: 'Feb', revenue: 187400 },
  { month: 'Mar', revenue: 146500 },
  { month: 'Apr', revenue: 212300 },
  { month: 'May', revenue: 173900 },
  { month: 'Jun', revenue: 246800 },
];

const revenueConfig = {
  revenue: { label: 'Revenue', color: 'var(--ui-background-brand-secondary)' },
} satisfies ChartConfig;

export const CompactValueAxis: Story = {
  args: {
    config: revenueConfig,
    data: revenueData,
    dataKeys: ['revenue'],
    yTickFormatter: formatCompactNumber,
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

// Value labels on each point, compact-formatted. Reduced to one series so
// the labels don't collide.
export const Labels: Story = {
  args: {
    dataKeys: ['desktop'],
    showLabels: true,
    labelFormatter: formatCompactNumber,
  },
};

// Labels on a *stacked* area — same layout-aware default as the stacked bar:
// centred in its own band, on the on-fill label token.
export const StackedLabels: Story = {
  args: {
    layout: 'stacked',
    showLabels: true,
    labelFormatter: formatCompactNumber,
  },
};

// A longer series than the six-point default, so the brush has a range worth
// zooming into. Built from a formula rather than 24 literal rows — it stays
// deterministic, which the visual baseline requires.
const weeklyData = Array.from({ length: 24 }, (_, index) => ({
  month: `W${index + 1}`,
  desktop: 150 + ((index * 37) % 120),
  mobile: 90 + ((index * 23) % 80),
}));

// `showBrush` adds a range selector under the plot: drag a handle (or the
// selected window itself) to zoom the series into a slice of the data.
export const RangeBrush: Story = {
  args: {
    data: weeklyData,
    dataKeys: ['desktop', 'mobile'],
    showBrush: true,
  },
};
