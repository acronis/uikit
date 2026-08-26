import type { Meta, StoryObj } from '@storybook/react-vite';
import { paletteArgTypes } from '../../chart/__stories__/palette-control';
import {
  Cell,
  PolarAngleAxis,
  RadialBar,
  RadialBarChart as RechartsRadialBarChart,
} from 'recharts';
import { ChartPieIcon, EllipsisIcon } from '@acronis-platform/icons-react/stroke-mono';

import { ButtonIcon } from '../../button-icon';
import { ChartWidget } from '../../chart-widget';
import { Metric } from '../../metric';
import {
  RadialBarChart,
  RadialBarChartSegmentedTooltipContent,
  radialBarChartBandName,
  radialBarChartSegmentFill,
  radialBarChartSegments,
} from '../radial-bar-chart';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  formatCompactNumber,
  type ChartConfig,
} from '../../chart';

// Arc colors are supplied by the caller via `config`, keyed by each arc's nameKey
// value. There is no chart token tier yet, so these reference the shared semantic
// brand/status tokens (a dedicated data-viz palette is pending an upstream design
// pass). The status tokens are chromatic in every brand; `brand-secondary` is
// brand-dependent.
const data = [
  { browser: 'Chrome', value: 65 },
  { browser: 'Safari', value: 50 },
  { browser: 'Firefox', value: 35 },
  { browser: 'Edge', value: 25 },
];

const config = {
  Chrome: { label: 'Chrome' },
  Safari: { label: 'Safari' },
  Firefox: {
    label: 'Firefox',
  },
  Edge: { label: 'Edge' },
} satisfies ChartConfig;

const meta = {
  title: 'Widgets/RadialBarChart',
  component: RadialBarChart,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: {
    config,
    data,
    dataKey: 'value',
    nameKey: 'browser',
    innerRadius: 20,
    outerRadius: 60,
    startAngle: 90,
    endAngle: -270,
    cornerRadius: 4,
    showBackground: true,
    showTooltip: true,
    showLegend: true,
    className: 'w-[256px]',
  },
  argTypes: {
    ...paletteArgTypes,
    innerRadius: { control: { type: 'number', min: 0, max: 60 } },
    outerRadius: { control: { type: 'number', min: 0, max: 60 } },
    startAngle: { control: { type: 'number', min: -360, max: 360 } },
    endAngle: { control: { type: 'number', min: -360, max: 360 } },
    cornerRadius: { control: { type: 'number', min: 0, max: 20 } },
    showBackground: { control: 'boolean' },
    showTooltip: { control: 'boolean' },
    showLegend: { control: 'boolean' },
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
        'outside',
        'center',
        'centerTop',
        'centerBottom',
        'insideStart',
        'insideEnd',
        'end',
      ],
    },
    labelFormat: { control: 'select', options: ['value', 'name-value'] },
    showPolarGrid: { control: 'boolean' },
    barSize: { control: { type: 'number', min: 2, max: 60 } },
    barGap: { control: { type: 'number' } },
    barCategoryGap: { control: { type: 'text' } },
    minAngle: { control: { type: 'number', min: 0, max: 90 } },
  },
} satisfies Meta<typeof RadialBarChart>;

export default meta;
type Story = StoryObj<typeof meta>;

// Concentric arcs sweeping a full circle (default).
export const FullCircle: Story = {};

// Replication of the Figma design mockup: the chart widget inside a card with
// a metric readout above the concentric arcs + legend. Rendered with a fixed
// composition so it shows real consumer usage rather than the meta args playground.
export const WidgetExample: Story = {
  render: () => (
    <div className="w-[480px]">
      <ChartWidget
        header={{
          title: 'Title',
          actions: (
            <ButtonIcon variant="ghost" aria-label="Widget actions">
              <EllipsisIcon size={16} />
            </ButtonIcon>
          ),
        }}
        metric={<Metric icon={<ChartPieIcon />} value="125" unit="Label" />}
      >
        <RadialBarChart
          data={[
            { item: 'first', value: 10 },
            { item: 'second', value: 10 },
            { item: 'third', value: 10 },
            { item: 'fourth', value: 10 },
          ]}
          config={{
            first: { label: 'First Lorem ipsum dolor sit' },
            second: { label: 'Second Lorem ipsum dolor sit' },
            third: { label: 'Third:' },
            fourth: { label: 'Fourth:' },
          }}
          nameKey="item"
          dataKey="value"
          valueDomain={[0, 12]}
        />
      </ChartWidget>
    </div>
  ),
};

// A half-circle gauge (startAngle 180 → endAngle 0).
export const Gauge: Story = {
  args: { startAngle: 180, endAngle: 0 },
};

// Background track + tooltip + legend toggled off — the baseline that would catch
// a toggle silently becoming a no-op (the unit env can't paint recharts chrome).
export const NoChrome: Story = {
  args: { showBackground: false, showTooltip: false, showLegend: false },
};

// The tooltip is hover-only, so a normal story never snapshots it. This renders
// the raw composition so recharts' `defaultIndex` can open the tooltip
// statically for the visual-regression baseline (see the skill's VR note).
export const TooltipOpen: Story = {
  render: () => (
    <ChartContainer config={config} className="h-[360px] w-[360px]">
      <RechartsRadialBarChart
        data={data.map((d) => ({ ...d, fill: `var(--color-${d.browser})` }))}
        dataKey="value"
        innerRadius={30}
        outerRadius={110}
        startAngle={90}
        endAngle={-270}
      >
        <ChartTooltip
          defaultIndex={0}
          active
          content={<ChartTooltipContent nameKey="browser" hideLabel />}
        />
        <RadialBar dataKey="value" background cornerRadius={4} isAnimationActive={false}>
          {data.map((entry) => (
            <Cell key={entry.browser} fill={`var(--color-${entry.browser})`} />
          ))}
        </RadialBar>
      </RechartsRadialBarChart>
    </ChartContainer>
  ),
};

// A configured `ChartTooltipContent` (from this library, no recharts needed).
// Shared by the two stories below.
const customTooltipContent = (
  <ChartTooltipContent
    nameKey="browser"
    hideLabel
    formatter={(value, name, item) => (
      <div className="flex w-full items-center gap-2">
        <span
          className="size-2.5 shrink-0 rounded-[2px]"
          style={{ backgroundColor: item.color }}
        />
        <span className="capitalize text-muted-foreground">
          {config[name as keyof typeof config]?.label ?? name}
        </span>
        <span className="ms-auto font-mono font-medium tabular-nums">
          {Number(value).toLocaleString()} users
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
    <ChartContainer config={config} className="h-[360px] w-[360px]">
      <RechartsRadialBarChart
        data={data.map((d) => ({ ...d, fill: `var(--color-${d.browser})` }))}
        dataKey="value"
        innerRadius={30}
        outerRadius={110}
        startAngle={90}
        endAngle={-270}
      >
        <ChartTooltip defaultIndex={0} active content={customTooltipContent} />
        <RadialBar dataKey="value" background cornerRadius={4} isAnimationActive={false}>
          {data.map((entry) => (
            <Cell key={entry.browser} fill={`var(--color-${entry.browser})`} />
          ))}
        </RadialBar>
      </RechartsRadialBarChart>
    </ChartContainer>
  ),
};

// Entrance animation on — a live example. Excluded from VR (snapshot.skip):
// the motion is non-deterministic, so it must not become a baseline.
export const Animated: Story = {
  parameters: { snapshot: { skip: true } },
  args: { animate: true, animationDuration: 800 },
};

// Value labels inside each arc, compact-formatted.
export const Labels: Story = {
  args: {
    showLabels: true,
    labelFormatter: formatCompactNumber,
  },
};

// Each label reads its arc's name alongside the value. A name-value label is
// long, so the innermost arc needs enough circumference to hold it — hence the
// wider `innerRadius` than the default.
export const LabelsNameValue: Story = {
  args: {
    showLabels: true,
    labelFormat: 'name-value',
  },
};

// The gauge: one value arc over its track, with the readout in the hole. The
// `valueDomain` is what makes it a gauge — without it a single value always
// fills the sweep. `cy` pulls the centre down so the drawn half is centred.
const gaugeData = [{ browser: 'Chrome', value: 65 }];

export const SingleValueGauge: Story = {
  args: {
    data: gaugeData,
    valueDomain: [0, 100],
    startAngle: 180,
    endAngle: 0,
    innerRadius: 48,
    centerLabel: { value: '65%', label: '' },
    showLegend: false,
  },
};

// The same readout in a full ring of concentric arcs.
export const CenterLabel: Story = {
  args: {
    innerRadius: 48,
    centerLabel: { value: '175', label: 'sessions' },
  },
};

// Multi-metric: one arc per `dataKeys` entry, colored and named by the metric
// (so `config` is keyed by the key here, not by `nameKey`). A shared
// `valueDomain` is what keeps the two arcs comparable.
const metricData = [{ tier: 'Production', used: 72, quota: 90 }];

const metricConfig = {
  used: { label: 'Used' },
  quota: { label: 'Quota' },
} satisfies ChartConfig;

// Labels are intentionally off here: recharts rotates an arc label to follow its
// arc, and on a half sweep the start of the arc is vertical — the legend and the
// tooltip carry the metric names instead. `Labels*` covers the label formats.
export const MultiMetric: Story = {
  args: {
    config: metricConfig,
    data: metricData,
    dataKeys: ['used', 'quota'],
    dataKey: 'used',
    nameKey: 'tier',
    valueDomain: [0, 100],
    startAngle: 180,
    endAngle: 0,
    innerRadius: 40,
  },
};

// The tooltip is hover-only, so the multi-metric header — which names the band
// rather than recharts' bare radius-axis index — never lands in a normal
// story's baseline. Same raw-composition trick as `TooltipOpen`.
export const MultiMetricTooltipOpen: Story = {
  render: () => (
    <ChartContainer config={metricConfig} className="size-[360px]">
      <RechartsRadialBarChart
        data={metricData}
        innerRadius={73}
        outerRadius={110}
        startAngle={180}
        endAngle={0}
        cy="65%"
        margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
      >
        <PolarAngleAxis
          type="number"
          domain={[0, 100]}
          tick={false}
          axisLine={false}
        />
        <ChartTooltip
          defaultIndex={0}
          active
          content={
            <ChartTooltipContent
              labelFormatter={(_, payload) =>
                radialBarChartBandName(
                  payload?.[0]?.payload as
                    | Record<string, string | number>
                    | undefined,
                  'tier'
                )
              }
            />
          }
        />
        {(['used', 'quota'] as const).map((key) => (
          <RadialBar
            key={key}
            dataKey={key}
            fill={`var(--color-${key})`}
            background
            cornerRadius={4}
            isAnimationActive={false}
          />
        ))}
      </RechartsRadialBarChart>
    </ChartContainer>
  ),
};

// The segmented gauge: one metric cut into notched segments, filled up to its
// value, with the readout in the ring. The unreached segments are the track, so
// `showBackground` plays no part, and the legend is suppressed — the pieces are
// geometry, not data rows. Hovering any of them reads the metric and its maximum.
//
// `nameKey` values become part of a custom-property name, so they stay CSS-safe —
// the human-readable copy lives in `config.label` / `centerLabel`.
const segmentedRow = { criteria: 'criteria', value: 29 };

const segmentedConfig = {
  criteria: {
    label: 'Criteria met',
  },
} satisfies ChartConfig;

const SEGMENTED_GEOMETRY = {
  valueDomain: [0, 38] as [number, number],
  segments: 8,
  segmentGap: 4,
  innerRadius: 48,
  outerRadius: 60,
};

export const SegmentedGauge: Story = {
  args: {
    data: [segmentedRow],
    config: segmentedConfig,
    dataKey: 'value',
    nameKey: 'criteria',
    ...SEGMENTED_GEOMETRY,
    centerLabel: { value: 29, label: '/ 38 criteria met' },
  },
};

// A segmented ring's series are geometry, so its tooltip rebuilds the reading
// from the data row ("Criteria met — 29 / 38") instead of naming the hovered
// piece. That's a whole custom row, and it only exists on hover — so it needs its
// own forced-open baseline.
//
// The ring is assembled from the same exported helpers the component uses
// (`radialBarChartSegments` + `radialBarChartSegmentFill` +
// `RadialBarChartSegmentedTooltipContent`), so this story can't drift away from
// the real rendering the way a hand-copied ring would.
export const SegmentedGaugeTooltipOpen: Story = {
  render: () => {
    const pieces = radialBarChartSegments({
      value: segmentedRow.value,
      domain: SEGMENTED_GEOMETRY.valueDomain,
      segments: SEGMENTED_GEOMETRY.segments,
      gap: SEGMENTED_GEOMETRY.segmentGap,
      sweep: 360,
      closed: true,
    });
    const row = {
      ...segmentedRow,
      ...Object.fromEntries(pieces.map((piece) => [piece.key, piece.degrees])),
    };

    return (
      <ChartContainer config={segmentedConfig} className="h-[360px] w-[360px]">
        <RechartsRadialBarChart
          data={[row]}
          innerRadius={SEGMENTED_GEOMETRY.innerRadius}
          outerRadius={SEGMENTED_GEOMETRY.outerRadius}
          startAngle={90}
          endAngle={-270}
        >
          <PolarAngleAxis
            type="number"
            domain={[0, 360]}
            tick={false}
            axisLine={false}
          />
          <ChartTooltip
            defaultIndex={0}
            active
            cursor={false}
            content={
              <RadialBarChartSegmentedTooltipContent
                config={segmentedConfig}
                row={row}
                nameKey="criteria"
                dataKey="value"
                domainMax={SEGMENTED_GEOMETRY.valueDomain[1]}
              />
            }
          />
          {pieces.map((piece) => (
            <RadialBar
              key={piece.key}
              dataKey={piece.key}
              stackId="segments"
              name="criteria"
              fill={radialBarChartSegmentFill(piece.kind, 'criteria')}
              cornerRadius={4}
              isAnimationActive={false}
            />
          ))}
        </RechartsRadialBarChart>
      </ChartContainer>
    );
  },
};

// The concentric polar grid behind the arcs.
export const PolarGrid: Story = {
  args: { showPolarGrid: true, showBackground: false },
};

// `minAngle` floors a tiny arc so it stays visible and hoverable — here the
// 0.4 row would otherwise be a hairline.
export const MinAngle: Story = {
  args: {
    data: [
      { browser: 'Chrome', value: 65 },
      { browser: 'Safari', value: 50 },
      { browser: 'Firefox', value: 35 },
      { browser: 'Edge', value: 0.4 },
    ],
    valueDomain: [0, 100],
    minAngle: 12,
  },
};

