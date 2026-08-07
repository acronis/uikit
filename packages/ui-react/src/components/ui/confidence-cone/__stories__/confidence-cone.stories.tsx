import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
} from 'recharts';

import {
  ConfidenceCone,
  createConeTooltip,
  dropConeBand,
  type ConfidenceConeBaseProps,
} from '../confidence-cone';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  createTickFormatter,
  type ChartConfig,
  type ChartTooltipContentProps,
} from '../../chart';

// Actual values run to the hand-off point (Jun, where actual = forecast and the
// cone starts at a point), then the forecast projects with a widening band.
// Series colors are caller-supplied via `config` (no chart token tier yet).
const data = [
  { month: 'Jan', actual: 100 },
  { month: 'Feb', actual: 118 },
  { month: 'Mar', actual: 112 },
  { month: 'Apr', actual: 130 },
  { month: 'May', actual: 141 },
  { month: 'Jun', actual: 150, forecast: 150, lower: 150, upper: 150 },
  { month: 'Jul', forecast: 162, lower: 150, upper: 176 },
  { month: 'Aug', forecast: 173, lower: 154, upper: 196 },
  { month: 'Sep', forecast: 185, lower: 158, upper: 218 },
  { month: 'Oct', forecast: 198, lower: 160, upper: 240 },
];

const config = {
  actual: { label: 'Actual', color: 'var(--ui-background-brand-secondary)' },
  forecast: {
    label: 'Forecast',
    color: 'var(--ui-background-brand-secondary)',
  },
} satisfies ChartConfig;

const meta = {
  title: 'Widgets/ConfidenceCone',
  component: ConfidenceCone,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  // The ChartContainer is transparent by design (it inherits the surface it sits
  // on — usually a Card). Render the stories on a themed surface so the chart is
  // legible in both light and dark.
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
    xKey: 'month',
    actualKey: 'actual',
    forecastKey: 'forecast',
    lowerKey: 'lower',
    upperKey: 'upper',
    strokeWidth: 2,
    showGrid: true,
    showTooltip: true,
    showLegend: true,
    className: 'h-[320px] w-[560px]',
  },
  argTypes: {
    strokeWidth: { control: { type: 'number', min: 1, max: 6 } },
    xAxisLabel: { control: 'text' },
    yAxisLabel: { control: 'text' },
    yUnit: { control: 'text' },
    actualType: { control: 'inline-radio', options: ['area', 'line'] },
    showDots: { control: 'boolean' },
    styleForecastTicks: { control: 'boolean' },
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
} satisfies Meta<typeof ConfidenceCone>;

export default meta;
// Keyed to the base props rather than `typeof meta`: the component's own props are
// a union (either `series` or the flat shorthand), and Storybook can't tell that
// `meta.args` already satisfies one branch — every story below that sets only a
// couple of args would be asked for `series` too.
type Story = StoryObj<ConfidenceConeBaseProps>;

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

// Compact currency on the MRR axis — `146500 → "$146.5K"`. A `unit` suffix
// can't abbreviate the value or prefix `$`.
const mrrData = [
  { month: 'Aug', actual: 92900 },
  { month: 'Sep', actual: 101200 },
  { month: 'Oct', actual: 112400 },
  { month: 'Nov', actual: 121800 },
  { month: 'Dec', actual: 133500 },
  { month: 'Jan', actual: 146500, forecast: 146500, lower: 146500, upper: 146500 },
  { month: 'Feb', forecast: 158000, lower: 150000, upper: 168000 },
  { month: 'Mar', forecast: 171000, lower: 156000, upper: 190000 },
  { month: 'Apr', forecast: 185000, lower: 160000, upper: 214000 },
  { month: 'May', forecast: 200000, lower: 163000, upper: 240000 },
];

export const CompactCurrencyAxis: Story = {
  args: {
    data: mrrData,
    yTickFormatter: createTickFormatter({
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 1,
    }),
  },
};

// Actual (solid) + forecast (dashed) + the widening prediction cone.
export const Default: Story = {};

// Mark each point: filled on the observed values, hollow on the projection — so
// a point reads as measured or predicted without consulting the line style.
export const Dots: Story = {
  args: { showDots: true },
};

// A dashed horizontal threshold on the value axis (a target, a capacity limit).
// Pass an array to draw several at once.
export const Threshold: Story = {
  args: { referenceLine: { value: 190, label: 'Capacity' } },
};

// Italic, metric-colored X ticks over the projected periods — the columns read
// as projected even where the shaded region is off.
export const StyledForecastTicks: Story = {
  args: { styleForecastTicks: true, showForecastRegion: false },
};

// `actualType="line"` drops the filled region under the actuals, leaving the
// cone as the only shaded area — the fill reads as noise once a chart carries
// more than one metric, or where the band is the point.
export const ActualAsLine: Story = {
  args: { actualType: 'line' },
};

// Dots on a bare line: with no area fill beneath them, the filled/hollow
// contrast between a measured and a predicted point is at its clearest.
export const DotsOnLine: Story = {
  args: { actualType: 'line', showDots: true },
};

// Omit `lowerKey`/`upperKey` for a band-less projection: the actual line hands
// off to a bare dashed forecast, with no cone. For a metric whose model gives a
// point estimate but no interval.
export const NoBand: Story = {
  args: { lowerKey: undefined, upperKey: undefined },
};

// The single-series forecast in full: cone + threshold + dots + styled ticks.
export const SingleSeriesForecast: Story = {
  args: {
    showDots: true,
    styleForecastTicks: true,
    referenceLine: { value: 190, label: 'Capacity' },
  },
};

// Several metrics against one shared axis, each with its own actual / forecast /
// bound fields, its own hue and its own independent cone. Drawn with
// `actualType="line"`: with more than one metric, stacked area fills muddy each
// other and the cones, so the bands stay the only shaded regions.
const multiData = [
  { month: 'Jan', storage: 100, backups: 40 },
  { month: 'Feb', storage: 118, backups: 46 },
  { month: 'Mar', storage: 112, backups: 51 },
  { month: 'Apr', storage: 130, backups: 55 },
  { month: 'May', storage: 141, backups: 58 },
  {
    month: 'Jun',
    storage: 150,
    storageForecast: 150,
    storageLower: 150,
    storageUpper: 150,
    backups: 62,
    backupsForecast: 62,
    backupsLower: 62,
    backupsUpper: 62,
  },
  {
    month: 'Jul',
    storageForecast: 162,
    storageLower: 150,
    storageUpper: 176,
    backupsForecast: 66,
    backupsLower: 63,
    backupsUpper: 70,
  },
  {
    month: 'Aug',
    storageForecast: 173,
    storageLower: 154,
    storageUpper: 196,
    backupsForecast: 71,
    backupsLower: 65,
    backupsUpper: 78,
  },
  {
    month: 'Sep',
    storageForecast: 185,
    storageLower: 158,
    storageUpper: 218,
    backupsForecast: 74,
    backupsLower: 66,
    backupsUpper: 85,
  },
  {
    month: 'Oct',
    storageForecast: 198,
    storageLower: 160,
    storageUpper: 240,
    backupsForecast: 79,
    backupsLower: 67,
    backupsUpper: 94,
  },
];

const multiConfig = {
  storage: { label: 'Storage', color: 'var(--ui-background-brand-secondary)' },
  storageForecast: { label: 'Storage forecast' },
  backups: {
    label: 'Backups',
    color: 'var(--ui-background-status-strong-success)',
  },
  backupsForecast: { label: 'Backups forecast' },
} satisfies ChartConfig;

export const MultiSeries: Story = {
  args: {
    data: multiData,
    config: multiConfig,
    actualType: 'line',
    series: [
      {
        actualKey: 'storage',
        forecastKey: 'storageForecast',
        lowerKey: 'storageLower',
        upperKey: 'storageUpper',
      },
      {
        actualKey: 'backups',
        forecastKey: 'backupsForecast',
        lowerKey: 'backupsLower',
        upperKey: 'backupsUpper',
      },
    ],
    // `series` supersedes the single-series shorthand; cleared so the args table
    // doesn't advertise columns this data doesn't have.
    actualKey: undefined,
    forecastKey: undefined,
    lowerKey: undefined,
    upperKey: undefined,
  },
};

// Axis titles + a Y-axis unit suffix, forwarded to recharts' native
// `label` / `unit`. The title inherits the theme token via the container's
// `.recharts-label` fill selector.
export const AxisLabels: Story = {
  args: {
    xAxisLabel: 'Month',
    yAxisLabel: 'Storage',
    yUnit: 'GB',
  },
};

// A configured `ChartTooltipContent` (from this library, no recharts needed).
// Shared by the two stories below. The synthetic cone band is filtered out of
// the payload by the component before this content sees it.
const customTooltipContent = (
  <ChartTooltipContent
    labelFormatter={(label) => `${label} · projection`}
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

// The same custom tooltip, forced open for the VR baseline. recharts only paints
// a tooltip on hover, so the raw composition is used purely to open it statically
// (`defaultIndex` + `active`) — but the tooltip content routes through the
// component's real `createConeTooltip` wrapper, so the baseline proves the
// shipped filter shows only the actual/forecast rows, never a `__cone` row.
export const CustomTooltipOpen: Story = {
  render: () => {
    const coneData = data.map((d) => ({
      ...d,
      __cone:
        typeof d.lower === 'number' && typeof d.upper === 'number'
          ? [d.lower, d.upper]
          : undefined,
    }));
    return (
      <ChartContainer config={config} className="h-[320px] w-[560px]">
        <ComposedChart data={coneData}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="month" tickLine={false} axisLine={false} />
          <YAxis tickLine={false} axisLine={false} />
          <ChartTooltip
            defaultIndex={7}
            active
            content={createConeTooltip(customTooltipContent)}
          />
          <Area
            dataKey="__cone"
            type="monotone"
            stroke="none"
            fill="var(--color-forecast)"
            fillOpacity={0.15}
            dot={false}
            activeDot={false}
            isAnimationActive={false}
          />
          <Area
            dataKey="actual"
            type="monotone"
            stroke="var(--color-actual)"
            strokeWidth={2}
            fill="var(--color-actual)"
            fillOpacity={0.15}
            dot={false}
            activeDot={false}
            connectNulls
            isAnimationActive={false}
          />
          <Line
            dataKey="forecast"
            type="monotone"
            stroke="var(--color-forecast)"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={false}
            connectNulls
            isAnimationActive={false}
          />
        </ComposedChart>
      </ChartContainer>
    );
  },
};

// Chrome toggled off — the baseline that would catch a toggle silently becoming
// a no-op (the unit env can't paint recharts chrome).
export const NoChrome: Story = {
  args: { showGrid: false, showTooltip: false, showLegend: false },
};

// The tooltip is hover-only, so a normal story never snapshots it. This renders
// the raw composition (with the same band filtered out of the tooltip) so
// recharts' `defaultIndex` can open it statically for the VR baseline.
export const TooltipOpen: Story = {
  render: () => {
    const coneData = data.map((d) => ({
      ...d,
      __cone:
        typeof d.lower === 'number' && typeof d.upper === 'number'
          ? [d.lower, d.upper]
          : undefined,
    }));
    return (
      <ChartContainer config={config} className="h-[320px] w-[560px]">
        <ComposedChart data={coneData}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="month" tickLine={false} axisLine={false} />
          <YAxis tickLine={false} axisLine={false} />
          <ChartTooltip
            defaultIndex={7}
            active
            content={(tp) => (
              <ChartTooltipContent
                active={tp.active}
                label={tp.label}
                payload={
                  dropConeBand(tp.payload) as ChartTooltipContentProps['payload']
                }
              />
            )}
          />
          <Area
            dataKey="__cone"
            type="monotone"
            stroke="none"
            fill="var(--color-forecast)"
            fillOpacity={0.15}
            dot={false}
            activeDot={false}
            isAnimationActive={false}
          />
          <Area
            dataKey="actual"
            type="monotone"
            stroke="var(--color-actual)"
            strokeWidth={2}
            fill="var(--color-actual)"
            fillOpacity={0.15}
            dot={false}
            activeDot={false}
            connectNulls
            isAnimationActive={false}
          />
          <Line
            dataKey="forecast"
            type="monotone"
            stroke="var(--color-forecast)"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={false}
            connectNulls
            isAnimationActive={false}
          />
        </ComposedChart>
      </ChartContainer>
    );
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
