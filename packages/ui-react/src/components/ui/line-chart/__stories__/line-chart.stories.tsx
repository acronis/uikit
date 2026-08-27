import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  LineChart as RechartsLineChart,
  XAxis,
} from 'recharts';
import {
  EllipsisIcon,
  SquareDashedIcon,
} from '@acronis-platform/icons-react/stroke-mono';

import { LineChart, createBandStrippedTooltip } from '../line-chart';
import { paletteArgTypes } from '../../chart/__stories__/palette-control';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  createTickFormatter,
  formatCompactNumber,
  type ChartConfig,
} from '../../chart';
import { ChartWidget } from '../../chart-widget';
import { ButtonIcon } from '../../button-icon';
import { Metric } from '../../metric';
import { Tag } from '../../tag';

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
  desktop: { label: 'Desktop' },
  mobile: { label: 'Mobile' },
  tablet: {
    label: 'Tablet',
  },
} satisfies ChartConfig;

const meta = {
  title: 'Widgets/LineChart',
  component: LineChart,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: {
    config,
    data,
    dataKeys: ['desktop', 'mobile', 'tablet'],
    xKey: 'month',
    className: 'h-[320px] w-[560px]',
  },
  argTypes: {
    ...paletteArgTypes,
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
    lineStyle: { control: 'inline-radio', options: ['solid', 'dashed'] },
    strokeWidth: { control: { type: 'number', min: 1, max: 6 } },
    showDots: { control: 'boolean' },
    dotSize: { control: { type: 'number', min: 1, max: 10 } },
    showActiveDot: { control: 'boolean' },
    lineSettings: {
      control: 'object',
      description:
        'Per-series overrides keyed by data key, e.g. `{ mobile: { dashed: true, strokeWidth: 3 } }`.',
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
    comparisonKeys: {
      control: 'object',
      description:
        'Subset of `dataKeys` drawn as dashed, dimmed comparison overlays (e.g. `["lastYear"]`).',
    },
    deltaBands: {
      control: 'object',
      description:
        'Pairs `[current, comparison]` to shade the gap between (e.g. `[["thisYear","lastYear"]]`).',
    },
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
} satisfies Meta<typeof LineChart>;

export default meta;
type Story = StoryObj<typeof meta>;

// The chart rendered with all default props — matches the Figma design node.
// Any visual delta here means the component defaults are wrong.
export const Default: Story = {};

const widgetData = [
  { month: 'Jan', desktop: 186, mobile: 80 },
  { month: 'Feb', desktop: 305, mobile: 200 },
  { month: 'Mar', desktop: 237, mobile: 120 },
  { month: 'Apr', desktop: 273, mobile: 190 },
  { month: 'May', desktop: 209, mobile: 130 },
  { month: 'Jun', desktop: 214, mobile: 140 },
];

const widgetConfig = {
  desktop: { label: 'Desktop' },
  mobile: { label: 'Mobile' },
} satisfies ChartConfig;

// The design's `ChartLine` in full: the card, its header and ⋯ menu, and the
// metric row all belong to `ChartWidget` — LineChart is only the plot and its
// legend, and fills the widget body responsively.
//
// Figma `8811:175678` (size=md, 592px wide).
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
            caption={<Tag variant="neutral">Last 6 months</Tag>}
          />
        }
      >
        <LineChart
          config={widgetConfig}
          data={widgetData}
          dataKeys={['desktop', 'mobile']}
          xKey="month"
          className="size-full"
        />
      </ChartWidget>
    </div>
  ),
};

// Figma `8982:27957` — projection zone starts at Apr.
export const WithProjections: Story = {
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
            caption={<Tag variant="neutral">Last 3 months</Tag>}
          />
        }
      >
        <LineChart
          config={widgetConfig}
          data={widgetData}
          dataKeys={['desktop', 'mobile']}
          xKey="month"
          projectionStart="Apr"
          className="size-full"
        />
      </ChartWidget>
    </div>
  ),
};

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

// A single series.
export const SingleLine: Story = {
  args: { dataKeys: ['desktop'] },
};

// Straight segments between points.
export const Linear: Story = {
  args: { curve: 'linear' },
};

// Stepped interpolation.
export const Stepped: Story = {
  args: { curve: 'step' },
};

// Dashed stroke.
export const Dashed: Story = {
  args: { lineStyle: 'dashed' },
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
          <LineChart
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

// Data-point dots with a custom radius — dots are off by default; enable them
// with `showDots`. The hover dot is always 2px larger unless `showActiveDot`
// overrides it.
export const DotSizing: Story = {
  args: { dataKeys: ['desktop'], showDots: true, dotSize: 6 },
};

// Per-series overrides: the target line reads thicker and dashed in its own
// color, and the secondary series loses its dots — without touching the third.
export const PerSeriesStyling: Story = {
  args: {
    lineSettings: {
      desktop: { strokeWidth: 3 },
      mobile: { dashed: true, showDots: false },
      tablet: { curveType: 'stepAfter', dotSize: 5 },
    },
  },
};

// A fixed target plus the mean of every plotted series, both captioned. The rule
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

// QoQ / YoY comparison: the previous-period series is marked via
// `comparisonKeys`, so it renders dashed + dimmed behind the current one.
const trendData = [
  { month: 'Jan', thisYear: 186, lastYear: 120 },
  { month: 'Feb', thisYear: 305, lastYear: 210 },
  { month: 'Mar', thisYear: 237, lastYear: 250 },
  { month: 'Apr', thisYear: 273, lastYear: 190 },
  { month: 'May', thisYear: 309, lastYear: 230 },
  { month: 'Jun', thisYear: 314, lastYear: 280 },
];

const trendConfig = {
  thisYear: { label: 'This year' },
  lastYear: {
    label: 'Last year',
  },
} satisfies ChartConfig;

export const ComparisonTrend: Story = {
  args: {
    data: trendData,
    config: trendConfig,
    dataKeys: ['thisYear', 'lastYear'],
    comparisonKeys: ['lastYear'],
  },
};

// The same comparison with a shaded delta band filling the gap between the two
// series (the QoQ/YoY difference).
export const ComparisonWithDeltaBand: Story = {
  args: {
    data: trendData,
    config: trendConfig,
    dataKeys: ['thisYear', 'lastYear'],
    comparisonKeys: ['lastYear'],
    deltaBands: [['thisYear', 'lastYear']],
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
  p95: { label: 'p95 latency' },
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

// All chrome toggled off + dots off — the baseline that would catch a toggle
// silently becoming a no-op (the unit env can't paint recharts chrome).
export const NoChrome: Story = {
  args: {
    showGrid: false,
    showTooltip: false,
    showLegend: false,
    showDots: false,
  },
};

// The tooltip is hover-only, so a normal story never snapshots it. This renders
// the raw composition so recharts' `defaultIndex` can open the tooltip
// statically for the visual-regression baseline (see the skill's VR note).
export const TooltipOpen: Story = {
  render: () => (
    <ChartContainer config={config} className="h-[320px] w-[560px]">
      <RechartsLineChart data={data}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
        <ChartTooltip defaultIndex={2} active content={<ChartTooltipContent />} />
        <Line
          type="monotone"
          dataKey="desktop"
          stroke="var(--color-desktop)"
          strokeWidth={2}
          dot={{ r: 3 }}
          isAnimationActive={false}
        />
        <Line
          type="monotone"
          dataKey="mobile"
          stroke="var(--color-mobile)"
          strokeWidth={2}
          dot={{ r: 3 }}
          isAnimationActive={false}
        />
        <Line
          type="monotone"
          dataKey="tablet"
          stroke="var(--color-tablet)"
          strokeWidth={2}
          dot={{ r: 3 }}
          isAnimationActive={false}
        />
      </RechartsLineChart>
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
          {trendConfig[name as keyof typeof trendConfig]?.label ??
            config[name as keyof typeof config]?.label ??
            name}
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

// The same custom tooltip, forced open for the VR baseline — built on the
// delta-band composition and routed through the component's real
// `createBandStrippedTooltip` wrapper, so the baseline proves the shipped filter
// drops the synthetic `__band_*` series: only the real thisYear/lastYear rows
// show, never a stray `__band_0` row.
export const CustomTooltipOpen: Story = {
  render: () => {
    const bandData = trendData.map((d) => ({
      ...d,
      __band_0: [
        Math.min(d.thisYear, d.lastYear),
        Math.max(d.thisYear, d.lastYear),
      ],
    }));
    return (
      <ChartContainer config={trendConfig} className="h-[320px] w-[560px]">
        <ComposedChart data={bandData}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
          <ChartTooltip
            defaultIndex={2}
            active
            content={createBandStrippedTooltip(customTooltipContent)}
          />
          <Area
            dataKey="__band_0"
            type="monotone"
            stroke="none"
            fill="var(--color-thisYear)"
            fillOpacity={0.12}
            dot={false}
            activeDot={false}
            isAnimationActive={false}
          />
          <Line
            type="monotone"
            dataKey="thisYear"
            stroke="var(--color-thisYear)"
            strokeWidth={2}
            dot={{ r: 3 }}
            isAnimationActive={false}
          />
          <Line
            type="monotone"
            dataKey="lastYear"
            stroke="var(--color-lastYear)"
            strokeWidth={2}
            strokeDasharray="5 5"
            strokeOpacity={0.5}
            dot={false}
            isAnimationActive={false}
          />
        </ComposedChart>
      </ChartContainer>
    );
  },
};

const mrrData = [
  { month: 'Aug', mrr: 92900 },
  { month: 'Sep', mrr: 101200 },
  { month: 'Oct', mrr: 112400 },
  { month: 'Nov', mrr: 121800 },
  { month: 'Dec', mrr: 133500 },
  { month: 'Jan', mrr: 146500 },
];

const mrrConfig = {
  mrr: { label: 'MRR' },
} satisfies ChartConfig;

// Compact currency on the value axis — `146500 → "$146.5K"`. A `unit` suffix
// can only append text; it can't abbreviate the value or prefix `$`.
export const CompactCurrencyAxis: Story = {
  args: {
    config: mrrConfig,
    data: mrrData,
    dataKeys: ['mrr'],
    yTickFormatter: createTickFormatter({
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 1,
    }),
  },
};

// Hide both axes with `showXAxis` / `showYAxis` for a compact sparkline — not
// possible with a `unit` suffix at all.
export const Sparkline: Story = {
  args: {
    config: mrrConfig,
    data: mrrData,
    dataKeys: ['mrr'],
    showXAxis: false,
    showYAxis: false,
    showGrid: false,
    showLegend: false,
    className: 'h-[120px] w-[360px]',
  },
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
