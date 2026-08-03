import type { Meta, StoryObj } from '@storybook/react-vite';
import { Cell, Pie, PieChart as RechartsPieChart } from 'recharts';

import { PieChart } from '../pie-chart';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '../../chart';

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
  Chrome: { label: 'Chrome', color: 'var(--ui-background-brand-secondary)' },
  Safari: { label: 'Safari', color: 'var(--ui-background-status-strong-danger)' },
  Firefox: {
    label: 'Firefox',
    color: 'var(--ui-background-status-strong-success)',
  },
  Edge: { label: 'Edge', color: 'var(--ui-background-status-strong-warning)' },
} satisfies ChartConfig;

const meta = {
  title: 'Widgets/PieChart',
  component: PieChart,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  // The ChartContainer is transparent by design (it inherits the surface it sits
  // on — usually a Card). Render the stories on a themed surface so the chart is
  // legible in both light and dark; without it, dark mode flips the token-driven
  // text/legend but leaves the backdrop unthemed.
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
    dataKey: 'value',
    nameKey: 'browser',
    innerRadius: 60,
    paddingAngle: 0,
    showTooltip: true,
    showLegend: true,
    className: 'h-[360px] w-[360px]',
  },
  argTypes: {
    shape: { control: 'inline-radio', options: ['pie', 'donut'] },
    centerLabel: {
      control: 'object',
      description:
        'Donut-only center content: `{ value, label }`. The object editor needs strict JSON — e.g. `{ "value": "835", "label": "Visitors" }`.',
    },
    innerRadius: { control: { type: 'number', min: 0, max: 120 } },
    outerRadius: { control: { type: 'number', min: 40, max: 160 } },
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
    legendPos: { control: 'inline-radio', options: ['top', 'bottom'] },
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

// A filled pie.
export const Pie_: Story = {
  args: { shape: 'pie' },
};

// A hollow-centre donut.
export const Donut: Story = {
  args: { shape: 'donut' },
};

// Data labels (T15): each slice's value drawn on the arc.
export const Labels: Story = {
  args: { shape: 'pie', showLabels: true },
};

// A donut with a custom center metric (here the total) + a caption.
export const DonutWithCenterLabel: Story = {
  args: {
    shape: 'donut',
    centerLabel: { value: '835', label: 'Visitors' },
  },
};

// Center label with the legend hidden — exercises the `showLegend: false` branch
// of the center nudge (raw cy, no legend-row offset), which the legend-on
// DonutWithCenterLabel baseline can't cover.
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
    className: 'h-[240px] w-[360px]',
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
    className: 'h-[360px] w-[520px]',
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
    className: 'h-[360px] w-[520px]',
  },
};

// Per-slice overrides: one slice recoloured, one with its label dropped, one
// reading its raw value while the rest show a percentage. The hidden slice
// loses its leader line too, rather than keeping a line that points at nothing.
export const SliceOverrides: Story = {
  args: {
    shape: 'pie',
    showLabels: true,
    labelLine: true,
    labelFormat: 'percent',
    className: 'h-[360px] w-[520px]',
    sliceSettings: {
      Firefox: { color: 'var(--ui-background-status-strong-neutral)' },
      Edge: { hideLabel: true },
      Chrome: { labelFormat: 'name-value' },
    },
  },
};

// The legend above the chart. For a donut this also flips the centre-label
// nudge: recharts reserves the legend row at the top, so the arc centre moves
// down rather than up.
export const LegendTop: Story = {
  args: {
    shape: 'donut',
    legendPos: 'top',
    centerLabel: { value: '835', label: 'Visitors' },
  },
};

// The `value-percent` tooltip preset — a slice's value followed by its share,
// without hand-rolling a `tooltipContent`. The tooltip is hover-only and this
// preset lives inside the component (recharts can only force one open on a raw
// composition), so this is a usage example, not a visual-regression case.
export const TooltipValuePercent: Story = {
  parameters: { snapshot: { skip: true } },
  args: { shape: 'donut', tooltipFormat: 'value-percent' },
};
