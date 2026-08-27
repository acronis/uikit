import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  EllipsisIcon,
  SquareDashedIcon,
} from '@acronis-platform/icons-react/stroke-mono';
import { Cell, Funnel, FunnelChart as RechartsFunnelChart } from 'recharts';

import {
  FUNNEL_CHART_DEFAULT_PALETTE,
  FunnelChart,
  funnelChartStageInset,
  funnelChartStagePath,
} from '../funnel-chart';
import { paletteArgTypes } from '../../chart/__stories__/palette-control';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
  type ChartPalette,
} from '../../chart';
import { ChartWidget } from '../../chart-widget';
import { ButtonIcon } from '../../button-icon';
import { Metric } from '../../metric';
import { Tag } from '../../tag';

// Stage colours come from `palette` and nothing else. FunnelChart's default is
// the sequential blue ramp — the palette Figma paints the funnel with, and the
// one that reads an ordered set of stages as an ordered set.
const data = [
  { stage: 'Visits', value: 5000 },
  { stage: 'Signups', value: 2600 },
  { stage: 'Trials', value: 1400 },
  { stage: 'Purchases', value: 620 },
];

const config = {
  Visits: { label: 'Visits' },
  Signups: {
    label: 'Signups',
  },
  Trials: {
    label: 'Trials',
  },
  Purchases: {
    label: 'Purchases',
  },
} satisfies ChartConfig;

// The widget mockup's own copy — a long first label, so the legend's truncation
// and its two-column alignment are both visible.
//
// The long text is each stage's `label`, never its `nameKey` value: a stage's
// name becomes a `--color-<name>` custom property, and prose with spaces and
// commas in it is not a valid CSS identifier — the stage would paint black. Same
// short-key/long-label split the `PieChart` widget story uses.
const widgetData = [
  { stage: 'first', value: 100 },
  { stage: 'second', value: 55 },
  { stage: 'third', value: 35 },
  { stage: 'fourth', value: 15 },
];

const widgetConfig = {
  first: {
    label:
      'First Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod incididunt ut labore et dolore magna aliqua',
  },
  second: { label: 'Second Lorem ipsum dolor sit amet, consectetur:' },
  third: { label: 'Third:' },
  fourth: { label: 'Fourth:' },
} satisfies ChartConfig;

const meta = {
  title: 'Widgets/FunnelChart',
  component: FunnelChart,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: {
    config,
    data,
    dataKey: 'value',
    nameKey: 'stage',
    // `palette` uses a string key so the mapping in `paletteArgTypes` correctly
    // reflects the selection in the Controls panel. FunnelChart's default is
    // `sequential-blue`, not the shared `categorical` every other chart uses.
    palette: 'sequential-blue' as unknown as ChartPalette,
    lastShape: 'triangle',
    reversed: false,
    showLabels: false,
    labelFormat: 'name',
    labelPosition: 'right',
    showValueLabels: false,
    showLegend: true,
    showActiveShape: false,
    showTooltip: true,
    // A width only, never a height: the plot is a square and the legend column
    // takes the rest, so the row sizes itself. A story still pins the width so
    // the visual-regression baselines don't move with the viewport.
    className: 'w-[320px]',
  },
  argTypes: {
    // Override the shared default-value label: FunnelChart's palette default is
    // `sequential-blue`, not the `categorical` every other chart uses.
    ...paletteArgTypes,
    palette: {
      ...paletteArgTypes.palette,
      table: {
        ...paletteArgTypes.palette.table,
        defaultValue: { summary: 'sequential-blue' },
      },
    },
    lastShape: { control: 'inline-radio', options: ['triangle', 'rectangle'] },
    reversed: { control: 'boolean' },
    showLabels: { control: 'boolean' },
    labelFormat: {
      control: 'select',
      options: [
        'name',
        'value',
        'percent',
        'name-value',
        'name-percent',
        'value-percent',
      ],
    },
    labelPosition: {
      control: 'inline-radio',
      options: ['right', 'left', 'inside'],
    },
    showValueLabels: { control: 'boolean' },
    valuePosition: {
      control: 'inline-radio',
      options: ['right', 'left', 'inside'],
    },
    showLegend: { control: 'boolean' },
    showActiveShape: { control: 'boolean' },
    funnelWidth: { control: { type: 'number' } },
    showTooltip: { control: 'boolean' },
    animate: { control: 'boolean' },
    animationDuration: { control: { type: 'number' } },
    animationBegin: { control: { type: 'number' } },
    animationEasing: {
      control: 'select',
      options: ['ease', 'ease-in', 'ease-out', 'ease-in-out', 'linear'],
    },
  },
} satisfies Meta<typeof FunnelChart>;

export default meta;
type Story = StoryObj<typeof meta>;

// No props beyond the data: four stages off the sequential blue ramp, no on-plot
// text, and the stage list beside the funnel. This is what the design draws.
export const Default: Story = {};

// The design's `ChartFunnel` in full: the card, its header and ⋯ menu, and the
// metric row all belong to `ChartWidget` — FunnelChart is only the plot and its
// legend, and fills the widget body responsively.
//
// Figma `8811:175245` (size=md, 592px wide).
export const WidgetExample: Story = {
  render: () => (
    <div className="w-[592px]">
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
        <FunnelChart
          config={widgetConfig}
          data={widgetData}
          dataKey="value"
          nameKey="stage"
          className="size-full"
        />
      </ChartWidget>
    </div>
  ),
};

// The classic funnel narrowing to a point (the default `lastShape`).
export const Triangle: Story = {
  args: { lastShape: 'triangle' },
};

// A flat-bottomed funnel (stacked trapezoids).
export const Rectangle: Story = {
  args: { lastShape: 'rectangle' },
};

// The funnel widening downward instead. The gap-free stage follows the flip, so
// the stack still starts flush at the top of the plot.
export const Reversed: Story = {
  args: { reversed: true },
};

// Legend + tooltip off — the bare plot, and the baseline that would catch a
// toggle silently becoming a no-op.
export const NoChrome: Story = {
  args: { showLabels: false, showLegend: false, showTooltip: false },
};

// Every stage painted from a different palette than the default ramp.
export const CategoricalPalette: Story = {
  args: { palette: { type: 'categorical' } },
};

// The stage list is the default, so this is the same as `Default` — kept as the
// explicit case, and to show a formatted legend value.
export const WithLegend: Story = {
  args: {
    showLegend: true,
    legendValueFormatter: (value) => `${Number(value) / 1000}k`,
  },
};

// The stage geometry the component draws — the 2px gap between stages and the
// 2px rounded corners — so the raw recharts compositions below match what
// `FunnelChart` itself paints instead of recharts' flush, square-cornered
// `Trapezoid`.
type RawStageProps = {
  x?: number;
  y?: number;
  upperWidth?: number;
  lowerWidth?: number;
  height?: number;
  fill?: string;
  payload?: Record<string, unknown>;
};

const renderRawStage = ({
  x = 0,
  y = 0,
  upperWidth = 0,
  lowerWidth = 0,
  height = 0,
  fill,
  payload,
}: RawStageProps) => (
  <path
    d={funnelChartStagePath(
      funnelChartStageInset({
        x,
        y,
        upperWidth,
        lowerWidth,
        height,
        gap: payload?.stage === data[0].stage ? 0 : 2,
      })
    )}
    fill={fill}
  />
);

const rawFunnelData = data.map((d) => ({
  ...d,
  fill: `var(--color-${d.stage})`,
}));

// The tooltip is hover-only, so a normal story never snapshots it. This renders
// the raw composition so recharts' `defaultIndex` can open the tooltip
// statically for the visual-regression baseline (see the skill's VR note).
export const TooltipOpen: Story = {
  render: () => (
    <ChartContainer
      config={config}
      palette={FUNNEL_CHART_DEFAULT_PALETTE}
      className="size-[200px]"
    >
      <RechartsFunnelChart margin={{ top: 4, right: 8, bottom: 4, left: 8 }}>
        <ChartTooltip
          defaultIndex={1}
          active
          content={<ChartTooltipContent nameKey="stage" hideLabel />}
        />
        <Funnel
          dataKey="value"
          nameKey="stage"
          data={rawFunnelData}
          shape={renderRawStage}
          isAnimationActive={false}
        >
          {data.map((entry) => (
            <Cell key={entry.stage} fill={`var(--color-${entry.stage})`} />
          ))}
        </Funnel>
      </RechartsFunnelChart>
    </ChartContainer>
  ),
};

// A configured `ChartTooltipContent` (from this library, no recharts needed).
// Shared by the two stories below.
const customTooltipContent = (
  <ChartTooltipContent
    nameKey="stage"
    hideLabel
    formatter={(value, name, item) => (
      <div className="flex w-full items-center gap-2">
        <span
          className="size-2.5 shrink-0 rounded-[2px]"
          style={{
            backgroundColor:
              (item.payload as Record<string, string>).fill ?? item.color,
          }}
        />
        <span className="text-muted-foreground">
          {config[name as keyof typeof config]?.label ?? name}
        </span>
        <span className="ms-auto font-mono font-medium tabular-nums">
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
    <ChartContainer
      config={config}
      palette={FUNNEL_CHART_DEFAULT_PALETTE}
      className="size-[200px]"
    >
      <RechartsFunnelChart margin={{ top: 4, right: 8, bottom: 4, left: 8 }}>
        <ChartTooltip defaultIndex={1} active content={customTooltipContent} />
        <Funnel
          dataKey="value"
          nameKey="stage"
          data={rawFunnelData}
          shape={renderRawStage}
          isAnimationActive={false}
        >
          {data.map((entry) => (
            <Cell key={entry.stage} fill={`var(--color-${entry.stage})`} />
          ))}
        </Funnel>
      </RechartsFunnelChart>
    </ChartContainer>
  ),
};

// `stageSettings` recolours one stage and drops another. A hidden stage leaves
// the funnel entirely, so the conversions are measured over what's left — and
// the recoloured stage's legend marker follows it.
export const PerStage: Story = {
  args: {
    stageSettings: {
      // The `strong` status tokens are the data-viz-weight ones; the plain
      // `status-*` backgrounds are tints for banners and wash out as a fill.
      Trials: { color: 'var(--ui-background-status-strong-info)' },
      Purchases: { hidden: true },
    },
  },
};

// On-plot labels are off by default. Turning them on puts each stage's name
// beside its segment, which needs room the design's tight plot doesn't reserve —
// so these label stories give the chart a wider box.
export const WithLabels: Story = {
  args: { showLabels: true, className: 'w-[520px]' },
};

// Both label lists at once: the name on one side of the funnel, its value on the
// other. The default `valuePosition`, so the last stage's number stays legible —
// a funnel narrows, so its tail segments can't hold a label.
export const ValueLabels: Story = {
  args: { showLabels: true, showValueLabels: true, className: 'w-[520px]' },
};

// Labels on the segments. Only the short formats fit down there, so this pairs an
// `inside` conversion with the legend carrying the names.
export const InsideLabels: Story = {
  args: {
    showLabels: true,
    labelPosition: 'inside',
    labelFormat: 'percent',
    showLegend: true,
  },
};

// The stage names on the left instead. `valuePosition` isn't set: the values
// default to the side opposite the names, so they follow them to the right.
export const LeftLabels: Story = {
  args: {
    showLabels: true,
    labelPosition: 'left',
    labelFormat: 'name-percent',
    showValueLabels: true,
    className: 'w-[520px]',
  },
};

// `showActiveShape` outlines the hovered segment instead of recolouring it. The
// hover itself is not deterministic, so this is excluded from VR (it exists for
// the docs/controls); the outline is asserted in the unit tests.
export const ActiveShape: Story = {
  args: { showActiveShape: true },
  parameters: { snapshot: { skip: true } },
};

// Segment borders + a narrowed funnel: `stroke` / `strokeWidth` outline the
// stages on top of the gap they already have, `funnelWidth` narrows the shape.
export const SegmentBorders: Story = {
  args: {
    stroke: 'var(--ui-border-on-surface-border)',
    strokeWidth: 2,
    funnelWidth: '65%',
  },
};

// Entrance animation on — a live example. Excluded from VR (snapshot.skip):
// the motion is non-deterministic, so it must not become a baseline.
export const Animated: Story = {
  parameters: { snapshot: { skip: true } },
  args: { animate: true, animationDuration: 800 },
};
