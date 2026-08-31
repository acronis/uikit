import type { Meta, StoryObj } from '@storybook/react-vite';
import { Bar, BarChart as RechartsBarChart, CartesianGrid, XAxis } from 'recharts';
import { EllipsisIcon, SquareDashedIcon } from '@acronis-platform/icons-react/stroke-mono';

import {
  BarChart,
  type BarChartItem,
  type BarChartVerticalProps,
} from '../bar-chart';
import { paletteArgTypes } from '../../chart/__stories__/palette-control';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  formatCompactNumber,
  type ChartConfig,
} from '../../chart';
import { ButtonIcon } from '../../button-icon';
import { ChartWidget } from '../../chart-widget';
import { Metric } from '../../metric';

// Series colors are supplied by the caller via `config`. There is no chart token
// tier yet, so these reference the shared semantic brand/status tokens (a
// dedicated data-viz palette is pending an upstream design pass). The status
// tokens are chromatic in every brand; `brand-secondary` is brand-dependent.
const data = [
  { month: 'Jan', desktop: 186, mobile: 80, tablet: 40 },
  { month: 'Feb', desktop: 305, mobile: 200, tablet: 90 },
  { month: 'Mar', desktop: 237, mobile: 120, tablet: 60 },
  { month: 'Apr', desktop: 73, mobile: 190, tablet: 30 },
  { month: 'May', desktop: 209, mobile: 130, tablet: 70 },
  { month: 'Jun', desktop: 214, mobile: 140, tablet: 80 },
];

const config = {
  desktop: { label: 'Desktop', tone: { status: 'info' as const } },
  mobile: { label: 'Mobile', tone: { status: 'success' as const } },
  tablet: { label: 'Tablet', tone: { status: 'warning' as const } },
} satisfies ChartConfig;

const meta = {
  title: 'Widgets/BarChart',
  component: BarChart,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: {
    // Figma canonical: status palette — each series is colored by its tone.
    palette: { type: 'status' },
    config,
    data,
    dataKeys: ['desktop', 'mobile', 'tablet'],
    xKey: 'month',
    className: 'h-[320px] w-[560px]',
  },
  argTypes: {
    // Override the shared default so the Controls panel shows `status`.
    ...paletteArgTypes,
    palette: {
      ...paletteArgTypes.palette,
      table: {
        ...paletteArgTypes.palette.table,
        defaultValue: { summary: 'status' },
      },
    },

    // --- Bar shape ---
    layout: {
      control: 'inline-radio',
      options: ['grouped', 'stacked'],
      description: 'Side-by-side bars (`grouped`) or segments stacked on a shared column (`stacked`).',
      table: { defaultValue: { summary: "'grouped'" } },
    },
    barRadius: {
      control: { type: 'number', min: 0, max: 20 },
      description: 'Corner radius on the growing end of each bar. `0` gives square corners.',
      table: { defaultValue: { summary: '8' } },
    },
    barShape: {
      control: 'inline-radio',
      options: ['rounded', 'pill', 'gradient', 'pattern'],
      description:
        'How bars are painted: rounded end, full capsule, color fade, or diagonal hatching. Per-range overrides come from `barSettings`.',
      table: { defaultValue: { summary: "'rounded'" } },
    },
    barSize: {
      control: { type: 'number', min: 1 },
      description: 'Fixed bar thickness in px. Unset — recharts sizes bars from the available width.',
      table: { defaultValue: { summary: '8' } },
    },
    maxBarSize: {
      control: { type: 'number', min: 1 },
      description: 'Upper bound on the computed bar thickness in px.',
    },
    barGap: {
      control: { type: 'number' },
      description: 'Gap between bars of one category, in px (or a percentage string).',
      table: { defaultValue: { summary: '4' } },
    },
    barCategoryGap: {
      control: { type: 'number' },
      description: 'Gap between category groups, in px (or a percentage string).',
    },
    minPointSize: {
      control: { type: 'number', min: 0 },
      description: 'Minimum rendered length for a non-zero bar in px — keeps tiny values visible.',
    },

    // --- Background / active ---
    showBackground: {
      control: 'boolean',
      description: 'Draw a full-height track behind every bar.',
      table: { defaultValue: { summary: 'false' } },
    },
    backgroundFill: {
      control: 'text',
      description: 'Fill for the track background (any CSS color).',
      table: { defaultValue: { summary: "'var(--ui-background-surface-secondary)'" } },
    },
    showActiveBar: {
      control: 'boolean',
      description: 'Highlight the hovered bar.',
      table: { defaultValue: { summary: 'false' } },
    },
    activeBar: { control: false },

    // --- Grid ---
    showGrid: {
      control: 'boolean',
      description: 'Render the CartesianGrid.',
      table: { defaultValue: { summary: 'true' } },
    },
    gridDashed: {
      control: 'boolean',
      description: 'Draw grid lines dashed instead of solid.',
      table: { defaultValue: { summary: 'true' } },
    },
    gridHorizontal: {
      control: 'boolean',
      description: 'Show horizontal grid lines. Defaults to `true` for vertical bars.',
    },
    gridVertical: {
      control: 'boolean',
      description: 'Show vertical grid lines. Defaults to `false` for vertical bars.',
    },

    // --- Axes ---
    showXAxis: {
      control: 'boolean',
      description: 'Render the X axis (ticks + title).',
      table: { defaultValue: { summary: 'true' } },
    },
    showYAxis: {
      control: 'boolean',
      description: 'Render the Y axis (ticks + title).',
      table: { defaultValue: { summary: 'true' } },
    },
    xAxisLabel: { control: 'text', description: 'Title rendered beneath the X axis.' },
    yAxisLabel: { control: 'text', description: 'Title rendered beside the Y axis (rotated).' },
    yUnit: { control: 'text', description: 'Unit suffix appended to Y-axis tick values.' },
    xAxisAngle: {
      control: { type: 'number', min: -90, max: 90 },
      description: 'Rotate X-axis tick labels by this many degrees (negative = tilt up-right).',
    },
    yAxisTickCount: {
      control: { type: 'number', min: 2, max: 10 },
      description: 'Desired number of Y-axis ticks (a hint — recharts may adjust).',
    },
    yAxisDomain: {
      control: 'inline-radio',
      options: ['auto', 'dataMin-dataMax', 'zero'],
      description:
        '`zero` anchors the axis at 0 (recharts default). `auto` fits the data at both ends. `dataMin-dataMax` is tight to the data with no padding.',
    },

    // --- Tooltip & legend ---
    showTooltip: {
      control: 'boolean',
      description: 'Render the hover tooltip.',
      table: { defaultValue: { summary: 'true' } },
    },
    showLegend: {
      control: 'boolean',
      description: 'Render the legend.',
      table: { defaultValue: { summary: 'true' } },
    },

    // --- Reference lines ---
    referenceLine: {
      control: 'object',
      description:
        'One line or an array. Each: `{ value }` (fixed) or `{ average: true | "<key>" }`, with an optional `{ label }`. The object editor needs **strict JSON** (double-quoted keys) — e.g. `[{ "value": 300, "label": "Target" }]` — then click the submit arrow.',
    },

    // --- Labels ---
    showLabels: {
      control: 'boolean',
      description: 'Render a value label on each bar segment.',
      table: { defaultValue: { summary: 'false' } },
    },
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
      description:
        'Where value labels sit. Defaults to the bar\'s growing end (top for vertical bars), or center when stacked.',
    },

    // --- Animation ---
    animate: {
      control: 'boolean',
      description: 'Enable entrance animation. Off by default so VR baselines are stable.',
      table: { defaultValue: { summary: 'false' } },
    },
    animationDuration: {
      control: { type: 'number', min: 0 },
      description: 'Animation duration in ms.',
    },
    animationBegin: {
      control: { type: 'number', min: 0 },
      description: 'Delay before the animation starts in ms.',
    },
    animationEasing: {
      control: 'select',
      options: ['ease', 'ease-in', 'ease-out', 'ease-in-out', 'linear'],
      description: 'Easing curve for the entrance animation.',
      table: { defaultValue: { summary: "'ease'" } },
    },

    // --- Brush ---
    showBrush: {
      control: 'boolean',
      description: 'Render a range brush beneath the chart to zoom the series.',
      table: { defaultValue: { summary: 'false' } },
    },
    brushHeight: {
      control: { type: 'number', min: 16, max: 80 },
      description: 'Height of the brush strip in px.',
      table: { defaultValue: { summary: '28' } },
    },
    brushAriaLabel: {
      control: 'text',
      description: 'Accessible name for the brush range handles.',
      table: { defaultValue: { summary: "'Chart range selector'" } },
    },
  },
} satisfies Meta<BarChartVerticalProps>;

export default meta;
type Story = StoryObj<BarChartVerticalProps>;

export const Default: Story = {
  parameters: {
    docs: {
      source: {
        code: `
import { BarChart, type ChartConfig } from '@acronis-platform/ui-react';

const config = {
  desktop: { label: 'Desktop', tone: { status: 'info' } },
  mobile:  { label: 'Mobile',  tone: { status: 'success' } },
  tablet:  { label: 'Tablet',  tone: { status: 'warning' } },
} satisfies ChartConfig;

const data = [
  { month: 'Jan', desktop: 186, mobile:  80, tablet: 40 },
  { month: 'Feb', desktop: 305, mobile: 200, tablet: 90 },
  { month: 'Mar', desktop: 237, mobile: 120, tablet: 60 },
  { month: 'Apr', desktop:  73, mobile: 190, tablet: 30 },
  { month: 'May', desktop: 209, mobile: 130, tablet: 70 },
  { month: 'Jun', desktop: 214, mobile: 140, tablet: 80 },
];

<BarChart
  palette={{ type: 'status' }}
  config={config}
  data={data}
  dataKeys={['desktop', 'mobile', 'tablet']}
  xKey="month"
  className="h-[320px] w-[560px]"
/>`,
      },
    },
  },
};

// Axis and grid knobs: rotated X ticks, a zero-anchored Y domain, a fixed Y
// tick count. gridDashed is true by default; this story shows the solid override.
export const AxisAndGridConfig: Story = {
  args: {
    xAxisAngle: -45,
    yAxisDomain: 'zero',
    yAxisTickCount: 4,
    gridDashed: false,
  },
};

const widgetConfig = {
  desktop: { label: 'Desktop', tone: { status: 'info' as const } },
  tablet: { label: 'Tablet', tone: { status: 'warning' as const } },
  mobile: { label: 'Mobile', tone: { status: 'success' as const } },
} satisfies ChartConfig;

const widgetData = [
  { month: 'Jan', desktop: 186, tablet: 40, mobile: 80 },
  { month: 'Feb', desktop: 305, tablet: 90, mobile: 200 },
  { month: 'Mar', desktop: 237, tablet: 60, mobile: 120 },
  { month: 'Apr', desktop: 73, tablet: 30, mobile: 190 },
  { month: 'May', desktop: 209, tablet: 70, mobile: 130 },
  { month: 'Jun', desktop: 214, tablet: 80, mobile: 140 },
];

// Matches Figma forecast widget node 8982:26898 — 3 series, dashed divider at
// Apr, translucent bars from Apr onward (no label, no background tracks, no
// dashed outlines on the projected bars). Reuses widgetConfig/widgetData.
export const ForecastWidget: Story = {
  render: () => (
    <div className="w-[592px] h-[297px]">
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
          <Metric icon={<SquareDashedIcon />} value="125" unit="Label" />
        }
      >
        <BarChart
          palette={{ type: 'status' }}
          config={widgetConfig}
          data={widgetData}
          dataKeys={['desktop', 'tablet', 'mobile']}
          xKey="month"
          referenceArea={{ from: 'Apr', divider: true }}
          barSettings={{
            desktop: { from: 'Apr', opacity: 0.35 },
            tablet: { from: 'Apr', opacity: 0.35 },
            mobile: { from: 'Apr', opacity: 0.35 },
          }}
          className="size-full"
        />
      </ChartWidget>
    </div>
  ),
};

// Matches Figma widget node 8804:170837 — full widget composition (592 × 297 px).
export const WidgetVertical: Story = {
  render: () => (
    <div className="w-[592px] h-[297px]">
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
          <Metric icon={<SquareDashedIcon />} value="125" unit="Label" />
        }
      >
        <BarChart
          palette={{ type: 'status' }}
          config={widgetConfig}
          data={widgetData}
          dataKeys={['desktop', 'tablet', 'mobile']}
          xKey="month"
          className="size-full"
        />
      </ChartWidget>
    </div>
  ),
};

// Data labels on each bar (T15): the value at the growing end, formatted with the
// same compact formatter the axis can use. A single series keeps the labels from
// colliding in a grouped chart.
export const Labels: Story = {
  args: {
    dataKeys: ['desktop'],
    showLabels: true,
    labelFormatter: formatCompactNumber,
    showLegend: false,
  },
};

export const VerticalGrouped: Story = {
  args: { orientation: 'vertical', layout: 'grouped' },
};

export const VerticalStacked: Story = {
  args: { orientation: 'vertical', layout: 'stacked' },
};

// A fixed target line on the value axis, captioned.
export const ReferenceLine: Story = {
  args: {
    dataKeys: ['desktop'],
    referenceLine: { value: 250, label: 'Target' },
  },
};

// The reference line computed as the mean of every plotted series.
export const AverageLine: Story = {
  args: {
    dataKeys: ['desktop'],
    referenceLine: { average: true, label: 'Average' },
  },
};

// Several lines at once — pass an array (here a fixed target + the average).
export const MultipleReferenceLines: Story = {
  args: {
    dataKeys: ['desktop'],
    referenceLine: [
      { value: 300, label: 'Target' },
      { average: true, label: 'Average' },
    ],
  },
};

// Response times in ms — real units, so `yUnit` reads truthfully. (The
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
  p95: { label: 'p95 latency', tone: { status: 'info' as const } },
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

// All chrome toggled off + squared corners — the baseline that would catch a
// toggle silently becoming a no-op (the unit env can't paint recharts chrome).
export const NoChrome: Story = {
  args: {
    showGrid: false,
    showTooltip: false,
    showLegend: false,
    barRadius: 0,
  },
};

// The tooltip is hover-only, so a normal story never snapshots it. This renders
// the raw composition so recharts' `defaultIndex` can open the tooltip
// statically for the visual-regression baseline (see the skill's VR note).
export const TooltipOpen: Story = {
  render: () => (
    <ChartContainer palette={{ type: 'status' }} config={config} className="h-[320px] w-[560px]">
      <RechartsBarChart data={data}>
        <CartesianGrid horizontal vertical={false} />
        <XAxis dataKey="month" tickLine={false} axisLine={false} />
        <ChartTooltip defaultIndex={2} active content={<ChartTooltipContent />} />
        <Bar dataKey="desktop" fill="var(--color-desktop)" radius={8} isAnimationActive={false} />
        <Bar dataKey="mobile" fill="var(--color-mobile)" radius={8} isAnimationActive={false} />
        <Bar dataKey="tablet" fill="var(--color-tablet)" radius={8} isAnimationActive={false} />
      </RechartsBarChart>
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
    <ChartContainer palette={{ type: 'status' }} config={config} className="h-[320px] w-[560px]">
      <RechartsBarChart data={data}>
        <CartesianGrid horizontal vertical={false} />
        <XAxis dataKey="month" tickLine={false} axisLine={false} />
        <ChartTooltip defaultIndex={2} active content={customTooltipContent} />
        <Bar dataKey="desktop" fill="var(--color-desktop)" radius={8} isAnimationActive={false} />
        <Bar dataKey="mobile" fill="var(--color-mobile)" radius={8} isAnimationActive={false} />
        <Bar dataKey="tablet" fill="var(--color-tablet)" radius={8} isAnimationActive={false} />
      </RechartsBarChart>
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
  revenue: { label: 'Revenue', tone: { status: 'info' as const } },
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

// A rotated tick row *and* an axis title at once — the X axis has to reserve room
// for both, which the earlier label-or-angle height ternary under-allocated.
export const RotatedTicksWithAxisTitle: Story = {
  args: {
    config: latencyConfig,
    data: latencyData,
    dataKeys: ['p95'],
    xAxisAngle: -45,
    xAxisLabel: 'Month',
    yAxisLabel: 'Response time',
    yUnit: 'ms',
  },
};

// Entrance animation on — a live example. Excluded from VR (snapshot.skip):
// the motion is non-deterministic, so it must not become a baseline.
export const Animated: Story = {
  parameters: { snapshot: { skip: true } },
  args: { animate: true, animationDuration: 800 },
};

// Labels on a *stacked* bar. Guards the layout-aware default: a stacked segment
// has no room at its growing end, so each value centres inside its own segment
// and switches to the on-fill label token.
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
// 24 categories × 2 series: barSize=4 prevents bar groups from overflowing
// their slots at the fully-zoomed-out view.
export const RangeBrush: Story = {
  args: {
    data: weeklyData,
    dataKeys: ['desktop', 'mobile'],
    showBrush: true,
    barSize: 4,
  },
};

// The same override addressed by row index rather than category value, and
// bounded on both ends — the highlight sits in the middle of the series.
export const HighlightedRange: Story = {
  args: {
    dataKeys: ['desktop'],
    referenceArea: { from: 2, to: 3 },
    barSettings: { desktop: { from: 2, to: 3, fill: 'var(--ui-background-status-strong-warning)' } },
  },
};

// Bar shapes beyond the default rounded end.
export const PillBars: Story = {
  args: { dataKeys: ['desktop', 'mobile'], barShape: 'pill' },
};

export const GradientBars: Story = {
  args: { dataKeys: ['desktop', 'mobile'], barShape: 'gradient' },
};

export const PatternBars: Story = {
  args: { dataKeys: ['desktop', 'mobile'], barShape: 'pattern' },
};

// A pattern fill applied to one range only — hatching sets the projection apart
// without relying on color, which stays readable for colorblind viewers.
export const PatternRange: Story = {
  args: {
    dataKeys: ['desktop'],
    barSettings: { desktop: { from: 'Apr', shape: 'pattern' } },
  },
};

// The track behind every bar, plus the sizing knobs: a fixed thickness with a
// tighter gap between the bars of a category.
export const TrackBackgroundAndSizing: Story = {
  args: {
    dataKeys: ['desktop', 'mobile'],
    showBackground: true,
    barSize: 16,
    barGap: 2,
    barCategoryGap: '25%',
  },
};

// `minPointSize` keeps a near-zero value visible as a sliver rather than
// vanishing into the axis.
export const MinPointSize: Story = {
  args: {
    dataKeys: ['desktop'],
    data: [
      { month: 'Jan', desktop: 186 },
      { month: 'Feb', desktop: 0.4 },
      { month: 'Mar', desktop: 237 },
      { month: 'Apr', desktop: 0 },
    ],
    minPointSize: 4,
  },
};

// --- orientation="horizontal": the labelled proportional bar list ---
//
// These render explicitly rather than through `args`: the meta supplies the
// recharts data contract (`config`/`data`/`dataKeys`/`xKey`) to every story,
// and the horizontal mode spreads whatever it doesn't consume onto its root
// `<div>` — so inherited args would land on the DOM as invalid attributes.

const horizontalItems: BarChartItem[] = [
  { label: 'Critical', value: 6, tone: { status: 'danger' } },
  { label: 'High', value: 9, tone: { status: 'warning' } },
  { label: 'Medium', value: 8, tone: { status: 'info' } },
  { label: 'Low', value: 6, tone: { status: 'success' } },
];

const horizontalTotal = horizontalItems.reduce((sum, item) => sum + item.value, 0);

export const Horizontal: Story = {
  parameters: {
    docs: {
      source: {
        code: `
import { BarChart } from '@acronis-platform/ui-react';

const items = [
  { label: 'Critical', value: 6, tone: { status: 'danger'  } },
  { label: 'High',     value: 9, tone: { status: 'warning' } },
  { label: 'Medium',   value: 8, tone: { status: 'info'    } },
  { label: 'Low',      value: 6, tone: { status: 'success' } },
];

<BarChart
  orientation="horizontal"
  palette={{ type: 'status' }}
  items={items}
  max={29}
  className="w-[360px]"
/>`,
      },
    },
  },
  render: () => (
    <BarChart
      orientation="horizontal"
      palette={{ type: 'status' }}
      items={horizontalItems}
      max={horizontalTotal}
      className="w-[360px]"
    />
  ),
};

// The same rows sorted high-to-low — the ranked breakdown a dashboard widget
// puts under its headline metric.
export const HorizontalRankedBreakdown: Story = {
  render: () => (
    <BarChart
      orientation="horizontal"
      palette={{ type: 'status' }}
      items={[...horizontalItems].sort((a, b) => b.value - a.value)}
      max={horizontalTotal}
      className="w-[360px]"
    />
  ),
};

// Matches Figma widget node 8804:170580 — the horizontal bar list inside the
// same widget shell as `WidgetVertical`.
export const WidgetHorizontal: Story = {
  render: () => (
    <div className="w-[592px] h-[297px]">
      <ChartWidget
        header={{
          title: 'Title',
          actions: (
            <ButtonIcon variant="ghost" aria-label="Widget actions">
              <EllipsisIcon size={16} />
            </ButtonIcon>
          ),
        }}
        metric={<Metric icon={<SquareDashedIcon />} value="125" unit="Label" />}
      >
        <div className="px-4 pb-4">
          <BarChart
            orientation="horizontal"
            palette={{ type: 'status' }}
            items={horizontalItems}
            max={horizontalTotal}
            className="w-full"
          />
        </div>
      </ChartWidget>
    </div>
  ),
};

// Three categories with forecast extensions. The forecast bar (translucent,
// 30% opacity) extends beyond the actual solid bar to show the projected total.
const forecastItems: BarChartItem[] = [
  { label: 'Category 1', value: 21, tone: { status: 'danger' }, forecast: 28 },
  { label: 'Category 2', value: 39, tone: { status: 'warning' }, forecast: 46 },
  { label: 'Category 3', value: 65, tone: { status: 'success' }, forecast: 73 },
];
const forecastMax = 125;

export const HorizontalForecast: Story = {
  parameters: {
    docs: {
      source: {
        code: `
import { BarChart } from '@acronis-platform/ui-react';

const items = [
  { label: 'Category 1', value: 21, tone: { status: 'danger'  }, forecast: 28 },
  { label: 'Category 2', value: 39, tone: { status: 'warning' }, forecast: 46 },
  { label: 'Category 3', value: 65, tone: { status: 'success' }, forecast: 73 },
];

<BarChart
  orientation="horizontal"
  palette={{ type: 'status' }}
  items={items}
  max={125}
  className="w-[360px]"
/>`,
      },
    },
  },
  render: () => (
    <BarChart
      orientation="horizontal"
      palette={{ type: 'status' }}
      items={forecastItems}
      max={forecastMax}
      className="w-[360px]"
    />
  ),
};

// Matches Figma widget node 8982:27501 — horizontal forecast inside a widget shell.
export const ForecastWidgetHorizontal: Story = {
  render: () => (
    <div className="w-[592px] h-[297px]">
      <ChartWidget
        header={{
          title: 'Title',
          actions: (
            <ButtonIcon variant="ghost" aria-label="Widget actions">
              <EllipsisIcon size={16} />
            </ButtonIcon>
          ),
        }}
        metric={<Metric icon={<SquareDashedIcon />} value="125" unit="Label" />}
      >
        <div className="px-4 pb-4">
          <BarChart
            orientation="horizontal"
            palette={{ type: 'status' }}
            items={forecastItems}
            max={forecastMax}
            className="w-full"
          />
        </div>
      </ChartWidget>
    </div>
  ),
};
