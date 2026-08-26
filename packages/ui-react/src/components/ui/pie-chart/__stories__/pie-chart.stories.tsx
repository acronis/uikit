import type { Meta, StoryObj } from '@storybook/react-vite';
import { Cell, Pie, PieChart as RechartsPieChart } from 'recharts';
import { ChartPieIcon, EllipsisIcon } from '@acronis-platform/icons-react/stroke-mono';

import { PieChart, pieChartValuePercentTooltip } from '../pie-chart';
import { paletteArgTypes } from '../../chart/__stories__/palette-control';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '../../chart';
import { ButtonIcon } from '../../button-icon';
import { ChartWidget } from '../../chart-widget';
import { Metric } from '../../metric';

// Slice colors are supplied by the caller via `config`, keyed by the slice's
// nameKey value. There is no chart token tier yet, so these reference the shared
// semantic brand/status tokens (a dedicated data-viz palette is pending an
// upstream design pass). The status tokens are chromatic in every brand;
// `brand-secondary` is brand-dependent.
const data = [
  { browser: 'Chrome', value: 275 },
  { browser: 'Safari', value: 200 },
  { browser: 'Firefox', value: 187 },
  { browser: 'Edge', value: 173 },
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
  title: 'Widgets/PieChart',
  component: PieChart,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: {
    config,
    data,
    dataKey: 'value',
    nameKey: 'browser',
    innerRadius: 48,
    paddingAngle: 2,
    showTooltip: true,
    showLegend: true,
    className: 'w-[256px]',
  },
  argTypes: {
    ...paletteArgTypes,
    shape: { control: 'inline-radio', options: ['pie', 'donut'] },
    centerLabel: {
      control: 'object',
      description:
        'Donut-only center content: `{ value, label }`. The object editor needs strict JSON — e.g. `{ "value": "835", "label": "Visitors" }`.',
    },
    innerRadius: { control: { type: 'number', min: 0, max: 60 } },
    outerRadius: { control: { type: 'number', min: 0, max: 60 } },
    paddingAngle: { control: { type: 'number', min: 0, max: 10 } },
    cornerRadius: { control: { type: 'number', min: 0, max: 24 } },
    startAngle: { control: { type: 'number', min: -360, max: 360 } },
    endAngle: { control: { type: 'number', min: -360, max: 360 } },
    minAngle: { control: { type: 'number', min: 0, max: 45 } },
    sliceSettings: {
      control: 'object',
      description:
        'Per-slice overrides keyed by the slice name — e.g. `{ "Edge": { "hideLabel": true } }`. The object editor needs strict JSON.',
    },
    showTooltip: { control: 'boolean' },
    tooltipFormat: {
      control: 'inline-radio',
      options: ['value', 'value-percent'],
    },
    showLegend: { control: 'boolean' },
    showLabels: { control: 'boolean' },
    labelFormat: {
      control: 'select',
      options: ['value', 'name-value', 'name-percent', 'percent'],
    },
    labelLine: { control: 'boolean' },
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
    animate: { control: 'boolean' },
    animationDuration: { control: { type: 'number' } },
    animationBegin: { control: { type: 'number' } },
    animationEasing: {
      control: 'select',
      options: ['ease', 'ease-in', 'ease-out', 'ease-in-out', 'linear'],
    },
  },
} satisfies Meta<typeof PieChart>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default: hollow-centre donut with legend — what you get with no extra props.
export const Donut: Story = {
  args: { shape: 'donut' },
};

// Replication of the Figma design mockup: the chart widget inside a card with
// a metric readout above the donut + legend. Rendered with a fixed composition
// so it shows real consumer usage rather than the meta args playground.
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
        <PieChart
          data={[
            { item: 'first', value: 10 },
            { item: 'second', value: 10 },
            { item: 'third', value: 10 },
            { item: 'fourth', value: 10 },
            { item: 'fifth', value: 10 },
            { item: 'sixth', value: 10 },
            { item: 'seventh', value: 10 },
            { item: 'eighth', value: 10 },
          ]}
          config={{
            first: { label: 'First Lorem ipsum dolor sit amet' },
            second: { label: 'Second Lorem ipsum dolor sit:' },
            third: { label: 'Third:' },
            fourth: { label: 'Fourth:' },
            fifth: { label: 'Fifth:' },
            sixth: { label: 'Sixth:' },
            seventh: { label: 'Seventh:' },
            eighth: { label: 'Eighth:' },
          }}
          nameKey="item"
          dataKey="value"
          shape="donut"
        />
      </ChartWidget>
    </div>
  ),
};

// A filled pie.
export const Pie_: Story = {
  args: { shape: 'pie' },
};

// Data labels (T15): each slice's value drawn on the arc.
export const Labels: Story = {
  args: { shape: 'pie', showLabels: true, className: 'w-[380px]' },
};

// A donut with a custom center metric (here the total) + a caption.
export const DonutWithCenterLabel: Story = {
  args: {
    shape: 'donut',
    centerLabel: { value: '835', label: 'Visitors' },
  },
};

// Center label with the legend hidden — exercises the center-only render path.
export const DonutWithCenterLabelNoLegend: Story = {
  args: {
    shape: 'donut',
    centerLabel: { value: '835', label: 'Visitors' },
    showLegend: false,
  },
};

// Chrome (tooltip + legend) toggled off — the baseline that would catch a toggle
// silently becoming a no-op (the unit env can't paint recharts chrome).
export const NoChrome: Story = {
  args: { shape: 'donut', showTooltip: false, showLegend: false },
};

// The tooltip is hover-only, so a normal story never snapshots it. This renders
// the raw composition so recharts' `defaultIndex` can open the tooltip
// statically for the visual-regression baseline (see the skill's VR note).
export const TooltipOpen: Story = {
  render: () => (
    <ChartContainer config={config} className="h-[360px] w-[360px]">
      <RechartsPieChart>
        <ChartTooltip
          defaultIndex={0}
          active
          content={<ChartTooltipContent nameKey="browser" hideLabel />}
        />
        <Pie
          data={data}
          dataKey="value"
          nameKey="browser"
          outerRadius={120}
          isAnimationActive={false}
        >
          {data.map((entry) => (
            <Cell key={entry.browser} fill={`var(--color-${entry.browser})`} />
          ))}
        </Pie>
      </RechartsPieChart>
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
      <RechartsPieChart>
        <ChartTooltip defaultIndex={0} active content={customTooltipContent} />
        <Pie
          data={data}
          dataKey="value"
          nameKey="browser"
          outerRadius={120}
          isAnimationActive={false}
        >
          {data.map((entry) => (
            <Cell key={entry.browser} fill={`var(--color-${entry.browser})`} />
          ))}
        </Pie>
      </RechartsPieChart>
    </ChartContainer>
  ),
};

// Entrance animation on — a live example. Excluded from VR (snapshot.skip):
// the motion is non-deterministic, so it must not become a baseline.
export const Animated: Story = {
  parameters: { snapshot: { skip: true } },
  args: { animate: true, animationDuration: 800 },
};

// Labels placed on the arc rather than outside it. Uses the on-fill label token,
// which is the only one legible over a caller-supplied saturated slice colour.
export const LabelsInside: Story = {
  args: { shape: 'pie', showLabels: true, labelPosition: 'insideStart' },
};

// A half-sweep: `startAngle`/`endAngle` turn the same data into a semicircle.
// A half arc only fills half its box, so it wants a short, wide one.
export const Semicircle: Story = {
  args: {
    shape: 'donut',
    startAngle: 180,
    endAngle: 0,
  },
};

// Rounded, separated slices: `cornerRadius` on top of a `paddingAngle` gap.
export const RoundedSlices: Story = {
  args: { shape: 'donut', cornerRadius: 8, paddingAngle: 4 },
};

// Slice labels naming their share instead of their raw value. Named labels are
// long, so — like the leader-line stories — this one gets a wider box to sit in.
export const LabelsNamePercent: Story = {
  args: {
    shape: 'pie',
    showLabels: true,
    labelFormat: 'name-percent',
    className: 'w-[380px]',
  },
};

// Leader lines connect each slice to its label. This is the only mode recharts
// can draw lines in, so the labels always sit outside the arc (`labelPosition`
// no longer applies). The wider box is deliberate: a label reaching out past the
// arc needs horizontal room, or it is clipped at the surface edge.
export const LabelsWithLeaderLines: Story = {
  args: {
    shape: 'donut',
    showLabels: true,
    labelLine: true,
    labelFormat: 'name-percent',
    className: 'w-[500px]',
  },
};

// Per-slice overrides: one slice's label hidden, one reading its raw value
// while the rest show a percentage. The hidden slice loses its leader line too,
// rather than keeping a line that points at nothing.
export const SliceOverrides: Story = {
  args: {
    shape: 'pie',
    showLabels: true,
    labelLine: true,
    labelFormat: 'percent',
    className: 'w-[500px]',
    sliceSettings: {
      Edge: { hideLabel: true },
      Chrome: { labelFormat: 'name-value' },
    },
  },
};

// The `value-percent` tooltip preset — a slice's value followed by its share,
// without hand-rolling a `tooltipContent`. This is the usage example (autodocs);
// the tooltip is hover-only, so `TooltipValuePercentOpen` below is the
// visual-regression case.
export const TooltipValuePercent: Story = {
  parameters: { snapshot: { skip: true } },
  args: { shape: 'donut', tooltipFormat: 'value-percent' },
};

// The same preset, forced open for the VR baseline. Like `TooltipOpen` and
// `CustomTooltipOpen` this renders the raw composition (recharts can only open a
// hover tooltip statically via `defaultIndex`), but wires in the component's own
// preset element rather than a copy of it, so the baseline can't drift from what
// `tooltipFormat="value-percent"` actually renders.
const valuePercentTotal = data.reduce((sum, row) => sum + row.value, 0);

export const TooltipValuePercentOpen: Story = {
  render: () => (
    <ChartContainer config={config} className="h-[360px] w-[360px]">
      <RechartsPieChart>
        <ChartTooltip
          defaultIndex={0}
          active
          content={pieChartValuePercentTooltip({
            nameKey: 'browser',
            config,
            total: valuePercentTotal,
          })}
        />
        <Pie
          data={data}
          dataKey="value"
          nameKey="browser"
          innerRadius={60}
          outerRadius={120}
          isAnimationActive={false}
        >
          {data.map((entry) => (
            <Cell key={entry.browser} fill={`var(--color-${entry.browser})`} />
          ))}
        </Pie>
      </RechartsPieChart>
    </ChartContainer>
  ),
};

