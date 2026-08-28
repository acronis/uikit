import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { ChartContainer, type ChartConfig } from '../chart';
import {
  CHART_CATEGORICAL_TOKENS,
  CHART_DIVERGING_TOKENS,
  CHART_SEQUENTIAL_TOKENS,
  CHART_STATUS_TOKENS,
} from '../chart-palette';
import { AreaChart } from '../../area-chart';
import { BarChart } from '../../bar-chart';
import { LineChart } from '../../line-chart';
import { PieChart } from '../../pie-chart';
import { ScatterChart } from '../../scatter-chart';
import { ComposedChart } from '../../composed-chart';
import { RadarChart } from '../../radar-chart';
import { RadialBarChart } from '../../radial-bar-chart';
import { FunnelChart } from '../../funnel-chart';
import { Treemap } from '../../treemap';
import { Histogram } from '../../histogram';
import { ConfidenceCone } from '../../confidence-cone';
import { SankeyChart } from '../../sankey-chart';
import { CategoryBar } from '../../category-bar';

// The `Chart` entry is the shared primitives (`ChartContainer` + tooltip/legend);
// autodocs documents that primitive API. Its one visual story is an Overview
// gallery: one compact example of every per-type chart component in the suite,
// each built from the REAL component (no hand-wired recharts) with the minimal,
// valid prop set from that component's own story. Its series use the default
// categorical palette — the same as any other chart with no explicit palette;
// the four palette stories below contrast the four palette types
// side-by-side.
const meta = {
  title: 'Widgets/Chart',
  component: ChartContainer,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  // The ChartContainer is transparent by design (it inherits the surface it sits
  // on — usually a Card). Render on a themed surface so the charts are legible in
  // both light and dark; without it, dark mode flips the token-driven text/grid
  // but leaves the backdrop unthemed.
  decorators: [
    (Story) => (
      <div className="rounded-lg border border-border bg-background p-6 text-foreground">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ChartContainer>;

export default meta;
type Story = StoryObj<typeof meta>;

// Shared category/series data for the cartesian components (Area/Bar/Line/Composed).
const cartesianData = [
  { month: 'Jan', desktop: 186, mobile: 80 },
  { month: 'Feb', desktop: 305, mobile: 200 },
  { month: 'Mar', desktop: 237, mobile: 120 },
  { month: 'Apr', desktop: 173, mobile: 190 },
];

const cartesianConfig = {
  desktop: { label: 'Desktop' },
  mobile: {
    label: 'Mobile',
  },
} satisfies ChartConfig;

// Shared name-keyed data for the part-to-whole components (Pie/RadialBar/Funnel/Treemap).
const partData = [
  { name: 'Chrome', value: 275 },
  { name: 'Safari', value: 200 },
  { name: 'Firefox', value: 187 },
  { name: 'Edge', value: 120 },
];

const partConfig = {
  Chrome: { label: 'Chrome' },
  Safari: {
    label: 'Safari',
  },
  Firefox: {
    label: 'Firefox',
  },
  Edge: { label: 'Edge' },
} satisfies ChartConfig;

const scatterSeries = [
  {
    key: 'classA',
    data: [
      { hours: 2, score: 55 },
      { hours: 4, score: 65 },
      { hours: 6, score: 78 },
      { hours: 8, score: 92 },
    ],
  },
  {
    key: 'classB',
    data: [
      { hours: 1, score: 70 },
      { hours: 5, score: 60 },
      { hours: 9, score: 95 },
      { hours: 3, score: 48 },
    ],
  },
];

const scatterConfig = {
  classA: { label: 'Class A' },
  classB: {
    label: 'Class B',
  },
} satisfies ChartConfig;

const radarData = [
  { subject: 'Math', alice: 120, bob: 110 },
  { subject: 'English', alice: 86, bob: 130 },
  { subject: 'Physics', alice: 85, bob: 90 },
  { subject: 'History', alice: 65, bob: 85 },
  { subject: 'Geo', alice: 99, bob: 100 },
];

const radarConfig = {
  alice: { label: 'Alice' },
  bob: { label: 'Bob' },
} satisfies ChartConfig;

const histogramValues = [
  12, 15, 18, 20, 22, 23, 24, 25, 26, 28, 30, 32, 35, 40, 45, 52, 64,
];

const histogramConfig = {
  count: { label: 'Frequency' },
} satisfies ChartConfig;

const coneData = [
  { month: 'Jan', actual: 100 },
  { month: 'Feb', actual: 118 },
  { month: 'Mar', actual: 130 },
  { month: 'Apr', actual: 150, forecast: 150, lower: 150, upper: 150 },
  { month: 'May', forecast: 165, lower: 150, upper: 182 },
  { month: 'Jun', forecast: 180, lower: 156, upper: 210 },
];

const coneConfig = {
  actual: { label: 'Actual' },
  forecast: {
    label: 'Forecast',
  },
} satisfies ChartConfig;

const sankeyData = {
  nodes: [{ name: 'signups' }, { name: 'active' }, { name: 'churned' }],
  links: [
    { source: 0, target: 1, value: 68 },
    { source: 0, target: 2, value: 32 },
  ],
};

const sankeyConfig = {
  signups: {
    label: 'Sign-ups',
  },
  active: {
    label: 'Active',
  },
  churned: {
    label: 'Churned',
  },
} satisfies ChartConfig;

const categoryBarData = [
  { key: 'passed', value: 68 },
  { key: 'warnings', value: 22 },
  { key: 'failed', value: 10 },
];

const categoryBarConfig = {
  passed: {
    label: 'Passed',
  },
  warnings: {
    label: 'Warnings',
  },
  failed: {
    label: 'Failed',
  },
} satisfies ChartConfig;

// Every per-type chart component in the suite, one compact example each.
// The gallery is taller than the default viewport, so capture the full page
// (otherwise the lower rows are clipped from the VR baseline).
export const Overview: Story = {
  parameters: { snapshot: { fullPage: true } },
  args: { config: cartesianConfig, children: <span /> },
  render: () => (
    <div className="grid w-[960px] grid-cols-2 gap-6">
      <div>
        <h3 className="mb-2 text-sm font-medium text-muted-foreground">
          Area chart
        </h3>
        <AreaChart
          config={cartesianConfig}
          data={cartesianData}
          dataKeys={['desktop', 'mobile']}
          xKey="month"
          showLegend={false}
          className="h-[180px] w-full"
        />
      </div>
      <div>
        <h3 className="mb-2 text-sm font-medium text-muted-foreground">
          Bar chart
        </h3>
        <BarChart
          config={cartesianConfig}
          data={cartesianData}
          dataKeys={['desktop', 'mobile']}
          xKey="month"
          showLegend={false}
          className="h-[180px] w-full"
        />
      </div>
      <div>
        <h3 className="mb-2 text-sm font-medium text-muted-foreground">
          Line chart
        </h3>
        <LineChart
          config={cartesianConfig}
          data={cartesianData}
          dataKeys={['desktop', 'mobile']}
          xKey="month"
          showLegend={false}
          className="h-[180px] w-full"
        />
      </div>
      <div>
        <h3 className="mb-2 text-sm font-medium text-muted-foreground">
          Pie chart
        </h3>
        <PieChart
          config={partConfig}
          data={partData}
          dataKey="value"
          nameKey="name"
          showLegend={false}
          className="h-[180px] w-full"
        />
      </div>
      <div>
        <h3 className="mb-2 text-sm font-medium text-muted-foreground">
          Scatter chart
        </h3>
        <ScatterChart
          config={scatterConfig}
          series={scatterSeries}
          xKey="hours"
          yKey="score"
          showLegend={false}
          className="h-[180px] w-full"
        />
      </div>
      <div>
        <h3 className="mb-2 text-sm font-medium text-muted-foreground">
          Composed chart
        </h3>
        <ComposedChart
          config={cartesianConfig}
          data={cartesianData}
          series={[
            { key: 'desktop', type: 'bar' },
            { key: 'mobile', type: 'line' },
          ]}
          xKey="month"
          showLegend={false}
          className="h-[180px] w-full"
        />
      </div>
      <div>
        <h3 className="mb-2 text-sm font-medium text-muted-foreground">
          Radar chart
        </h3>
        <RadarChart
          config={radarConfig}
          data={radarData}
          dataKeys={['alice', 'bob']}
          angleKey="subject"
          showLegend={false}
          className="w-full"
        />
      </div>
      <div>
        <h3 className="mb-2 text-sm font-medium text-muted-foreground">
          Radial bar chart
        </h3>
        <RadialBarChart
          config={partConfig}
          data={partData}
          dataKey="value"
          nameKey="name"
          showLegend={false}
        />
      </div>
      <div>
        <h3 className="mb-2 text-sm font-medium text-muted-foreground">
          Funnel chart
        </h3>
        <FunnelChart
          config={partConfig}
          data={partData}
          dataKey="value"
          nameKey="name"
          className="h-[180px] w-full"
        />
      </div>
      <div>
        <h3 className="mb-2 text-sm font-medium text-muted-foreground">
          Treemap
        </h3>
        <Treemap
          config={partConfig}
          data={partData}
          dataKey="value"
          nameKey="name"
          className="h-[180px] w-full"
        />
      </div>
      <div>
        <h3 className="mb-2 text-sm font-medium text-muted-foreground">
          Histogram
        </h3>
        <Histogram
          config={histogramConfig}
          values={histogramValues}
          binCount={6}
          className="h-[180px] w-full"
        />
      </div>
      <div>
        <h3 className="mb-2 text-sm font-medium text-muted-foreground">
          Confidence cone
        </h3>
        <ConfidenceCone
          config={coneConfig}
          data={coneData}
          xKey="month"
          actualKey="actual"
          forecastKey="forecast"
          lowerKey="lower"
          upperKey="upper"
          showLegend={false}
          className="h-[180px] w-full"
        />
      </div>
      <div className="col-span-2">
        <h3 className="mb-2 text-sm font-medium text-muted-foreground">
          Sankey chart
        </h3>
        <SankeyChart
          config={sankeyConfig}
          data={sankeyData}
          className="h-[220px] w-full"
        />
      </div>
      <div className="col-span-2">
        <h3 className="mb-2 text-sm font-medium text-muted-foreground">
          Category bar
        </h3>
        <CategoryBar
          config={categoryBarConfig}
          data={categoryBarData}
          showLegend
          className="w-full"
        />
      </div>
    </div>
  ),
};

// ---------------------------------------------------------------------------
// Palettes — one story each, so a reader lands on the palette they need rather
// than scrolling a combined sheet. Every story shows the palette's stops above
// a chart that actually calls for it: the question these answer is *when* to
// reach for a palette, not that colors can be swapped.
//
// Series walk the palette in its defined order — series 1 takes stop 1, and so
// on — unless they carry a `tone`. `status` is always tone-driven (colors carry
// meaning); `diverging` also accepts `{ side: 'a' | 'b' }` to pin a series to
// one hue family.
//
// Note the slug keys (`signedUp`, not `Signed up`). A config key becomes part
// of a `--color-<key>` custom property, so it has to be CSS-safe; the display
// name goes in `label`. A key with a space yields an invalid property and the
// series paints SVG-default black.

function PaletteFrame({
  when,
  stops,
  stopGroups,
  children,
}: {
  when: string;
  /** Flat stop list — use for palettes with a single set (categorical, status). */
  stops?: readonly string[];
  /** Labeled stop sets — use when a palette ships multiple ramps or pairs. */
  stopGroups?: Array<{ label: string; stops: readonly string[] }>;
  children: React.ReactNode;
}) {
  return (
    <div className="w-[860px] space-y-3">
      <p className="text-sm text-muted-foreground">{when}</p>
      {stops && (
        <div className="flex flex-wrap gap-1">
          {stops.map((color) => (
            <div
              key={color}
              className="h-5 w-5 rounded-sm border border-border"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      )}
      {stopGroups && (
        <div className="space-y-1.5">
          {stopGroups.map(({ label, stops: groupStops }) => (
            <div key={label} className="flex items-center gap-2">
              <span className="w-20 shrink-0 text-right text-xs text-muted-foreground">
                {label}
              </span>
              <div className="flex gap-1">
                {groupStops.map((color) => (
                  <div
                    key={color}
                    className="h-5 w-5 rounded-sm border border-border"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
      {children}
    </div>
  );
}

/** A labelled cell inside a story that shows several variants side by side. */
function Variant({
  name,
  children,
}: {
  name: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <h4 className="text-xs font-medium text-muted-foreground">{name}</h4>
      {children}
    </div>
  );
}

const browserData = [
  { name: 'chrome', value: 275 },
  { name: 'safari', value: 200 },
  { name: 'firefox', value: 187 },
  { name: 'edge', value: 120 },
  { name: 'opera', value: 90 },
  { name: 'brave', value: 64 },
  { name: 'vivaldi', value: 41 },
  { name: 'other', value: 28 },
];

const browserConfig = {
  chrome: { label: 'Chrome' },
  safari: { label: 'Safari' },
  firefox: { label: 'Firefox' },
  edge: { label: 'Edge' },
  opera: { label: 'Opera' },
  brave: { label: 'Brave' },
  vivaldi: { label: 'Vivaldi' },
  other: { label: 'Other' },
} satisfies ChartConfig;

/**
 * Unrelated categories with no order between them — browsers, teams, products,
 * regions. Sixteen distinct hues, assigned in order and wrapping past the last.
 * The only thing a reader should take from two colors here is "different
 * thing", never "more" or "worse".
 */
export const CategoricalPalette: Story = {
  name: 'Palette — categorical',
  args: { config: browserConfig, children: <span /> },
  render: () => (
    <PaletteFrame
      when="Unrelated categories with no order between them. Colour carries identity, not magnitude."
      stops={CHART_CATEGORICAL_TOKENS}
    >
      <PieChart
        config={browserConfig}
        palette={{ type: 'categorical' }}
        data={browserData}
        dataKey="value"
        nameKey="name"
        shape="donut"
        className="h-[240px] w-full"
      />
    </PaletteFrame>
  ),
};

const funnelData = [
  { name: 'Visited', value: 1200 },
  { name: 'Signup', value: 760 },
  { name: 'Activated', value: 410 },
  { name: 'Subscribed', value: 180 },
];

// Keys double as the on-chart stage labels: `FunnelChart` composes its label
// from the raw `nameKey` value rather than from `config[].label` (unlike
// `Treemap`), and that value has to be CSS-safe for `--color-<name>`. So the
// display names here are deliberately space-free.
const funnelConfig = {
  Visited: { label: 'Visited' },
  Signup: { label: 'Signup' },
  Activated: { label: 'Activated' },
  Subscribed: { label: 'Subscribed' },
} satisfies ChartConfig;

const SEQUENTIAL_RAMPS = ['blue', 'teal', 'orange', 'violet'] as const;

/**
 * One quantity along an ordered scale, where darker reads as further along —
 * funnel stages, heat, tiers, recency. Four ramps ship; all four are here,
 * because the choice between them is brand/context, not meaning.
 */
export const SequentialPalette: Story = {
  name: 'Palette — sequential',
  parameters: { snapshot: { fullPage: true } },
  args: { config: funnelConfig, children: <span /> },
  render: () => (
    <PaletteFrame
      when="One quantity along an ordered scale. Darker reads as further along; the hue itself means nothing. Stops run darkest-to-lightest so series 1 gets the most saturated colour."
      stopGroups={SEQUENTIAL_RAMPS.map((ramp) => ({
        label: ramp,
        stops: CHART_SEQUENTIAL_TOKENS[ramp],
      }))}
    >
      <div className="grid grid-cols-2 gap-6">
        {SEQUENTIAL_RAMPS.map((ramp) => (
          <Variant key={ramp} name={ramp}>
            <FunnelChart
              config={funnelConfig}
              palette={{ type: 'sequential', ramp }}
              data={funnelData}
              dataKey="value"
              nameKey="name"
              className="h-[200px] w-full"
            />
          </Variant>
        ))}
      </div>
    </PaletteFrame>
  ),
};

const storageData = [
  { name: 'archive', value: 420 },
  { name: 'backups', value: 300 },
  { name: 'snapshots', value: 180 },
  { name: 'logs', value: 120 },
  { name: 'temp', value: 80 },
  { name: 'other', value: 40 },
];

const storageConfig = {
  archive: { label: 'Archive' },
  backups: { label: 'Backups' },
  snapshots: { label: 'Snapshots' },
  logs: { label: 'Logs' },
  temp: { label: 'Temp' },
  other: { label: 'Other' },
} satisfies ChartConfig;

const DIVERGING_PAIRS = ['blue-orange', 'teal-violet'] as const;

/**
 * Two directions away from a midpoint — over/under budget, gain/loss,
 * hot/cold. The pale middle is the neutral point, so a reader can tell which
 * side of it a value falls on at a glance. Both shipped pairs are here.
 */
export const DivergingPalette: Story = {
  name: 'Palette — diverging',
  args: { config: storageConfig, children: <span /> },
  render: () => (
    <PaletteFrame
      when="Two directions away from a midpoint. The pale centre is the neutral point. Stops interleave strongest-first (a3-b3-a2-b2-a1-b1) so adjacent series contrast maximally."
      stopGroups={DIVERGING_PAIRS.map((pair) => ({
        label: pair,
        stops: CHART_DIVERGING_TOKENS[pair],
      }))}
    >
      <div className="grid grid-cols-2 gap-6">
        {DIVERGING_PAIRS.map((pair) => (
          <Variant key={pair} name={pair}>
            <Treemap
              config={storageConfig}
              palette={{ type: 'diverging', pair }}
              data={storageData}
              dataKey="value"
              nameKey="name"
              className="h-[220px] w-full"
            />
          </Variant>
        ))}
      </div>
    </PaletteFrame>
  ),
};

// Four-series data: two on each diverging side (e.g. two "hot" categories and
// two "cold" categories).
const divSideData = [
  { month: 'Jan', hotA: 40, hotB: 35, coldA: 15, coldB: 10 },
  { month: 'Feb', hotA: 55, hotB: 48, coldA: 22, coldB: 18 },
  { month: 'Mar', hotA: 70, hotB: 62, coldA: 30, coldB: 25 },
  { month: 'Apr', hotA: 80, hotB: 72, coldA: 38, coldB: 32 },
];

const divSideConfig = {
  hotA: { label: 'Gain A', tone: { side: 'a' as const } },
  hotB: { label: 'Gain B', tone: { side: 'a' as const } },
  coldA: { label: 'Loss A', tone: { side: 'b' as const } },
  coldB: { label: 'Loss B', tone: { side: 'b' as const } },
} satisfies ChartConfig;

/**
 * Two series declared `side: "a"` get the a-hue stops (a3 then a2); two
 * declared `side: "b"` get the b-hue stops (b3 then b2). This lets a chart
 * with multiple series express a clear two-group structure — all gains share
 * one hue family, all losses share another — without losing differentiation
 * within each group.
 */
export const DivergingSidePalette: Story = {
  name: 'Palette — diverging side override',
  args: { config: divSideConfig, children: <span /> },
  parameters: {
    docs: {
      source: {
        code: `import { BarChart, type ChartConfig } from '@acronis-platform/ui-react';

const data = [
  { month: 'Jan', gainA: 40, gainB: 35, lossA: 15, lossB: 10 },
  { month: 'Feb', gainA: 55, gainB: 48, lossA: 22, lossB: 18 },
  { month: 'Mar', gainA: 70, gainB: 62, lossA: 30, lossB: 25 },
  { month: 'Apr', gainA: 80, gainB: 72, lossA: 38, lossB: 32 },
];

// side: 'a' → a-hue stops (a3, a2, a1), strongest first.
// side: 'b' → b-hue stops (b3, b2, b1), strongest first.
// Series without a side walk the default interleaved ramp.
const config = {
  gainA: { label: 'Gain A', tone: { side: 'a' } },
  gainB: { label: 'Gain B', tone: { side: 'a' } },
  lossA: { label: 'Loss A', tone: { side: 'b' } },
  lossB: { label: 'Loss B', tone: { side: 'b' } },
} satisfies ChartConfig;

<BarChart
  config={config}
  palette={{ type: 'diverging', pair: 'blue-orange' }}
  data={data}
  dataKeys={['gainA', 'gainB', 'lossA', 'lossB']}
  xKey="month"
  layout="grouped"
/>`,
      },
    },
  },
  render: () => (
    <PaletteFrame
      when='Four series, two declared side="a" (a-hue stops) and two declared side="b" (b-hue stops). Each side walks its own three stops strongest-first; series without a side walk the interleaved ramp.'
      stopGroups={DIVERGING_PAIRS.map((pair) => ({
        label: pair,
        stops: CHART_DIVERGING_TOKENS[pair],
      }))}
    >
      <div className="grid grid-cols-2 gap-6">
        {DIVERGING_PAIRS.map((pair) => (
          <Variant key={pair} name={pair}>
            <BarChart
              config={divSideConfig}
              palette={{ type: 'diverging', pair }}
              data={divSideData}
              dataKeys={['hotA', 'hotB', 'coldA', 'coldB']}
              xKey="month"
              layout="grouped"
              className="h-[220px] w-full"
            />
          </Variant>
        ))}
      </div>
    </PaletteFrame>
  ),
};

const alertData = [
  { month: 'Jan', danger: 12, warning: 30, success: 210 },
  { month: 'Feb', danger: 18, warning: 24, success: 240 },
  { month: 'Mar', danger: 7, warning: 33, success: 265 },
  { month: 'Apr', danger: 21, warning: 19, success: 250 },
];

// The one palette whose colors are chosen rather than walked — a series is red
// because it *is* the critical one, not because it comes third.
const alertConfig = {
  danger: { label: 'Critical', tone: { status: 'danger' } },
  warning: { label: 'Warning', tone: { status: 'warning' } },
  success: { label: 'Healthy', tone: { status: 'success' } },
} satisfies ChartConfig;

/**
 * The value *means* a severity. Never decorative: red has to mean bad, and a
 * series names its tone instead of taking a position. Six tones, ordered by
 * severity — danger, critical, warning, success, info, neutral. (`critical` is
 * the orange one and ranks below `danger`; that is what the tokens say.)
 */
export const StatusPalette: Story = {
  name: 'Palette — status',
  args: { config: alertConfig, children: <span /> },
  render: () => (
    <PaletteFrame
      when="The value means a severity. Each series names its tone rather than taking a position."
      stops={Object.values(CHART_STATUS_TOKENS)}
    >
      <BarChart
        config={alertConfig}
        palette={{ type: 'status' }}
        data={alertData}
        dataKeys={['danger', 'warning', 'success']}
        xKey="month"
        layout="stacked"
        className="h-[240px] w-full"
      />
    </PaletteFrame>
  ),
};

const legendData = [
  { month: 'Jan', desktop: 186, mobile: 80 },
  { month: 'Feb', desktop: 305, mobile: 200 },
  { month: 'Mar', desktop: 237, mobile: 120 },
  { month: 'Apr', desktop: 173, mobile: 190 },
  { month: 'May', desktop: 209, mobile: 130 },
  { month: 'Jun', desktop: 214, mobile: 140 },
];

const legendConfig = {
  desktop: { label: 'Desktop' },
  mobile: { label: 'Mobile' },
} satisfies ChartConfig;

/**
 * The legend is centered (`justify-center`) with a 24 px column gap
 * (`gap-x-6`) and a 8 px row gap (`gap-y-2`) when entries wrap. This mirrors
 * the Figma spec for every cartesian chart that uses `showLegend`.
 */
export const Legend: Story = {
  name: 'Legend — centered layout',
  args: { config: legendConfig, children: <span /> },
  render: () => (
    <LineChart
      config={legendConfig}
      data={legendData}
      dataKeys={['desktop', 'mobile']}
      xKey="month"
      showLegend
      className="h-[260px] w-[560px]"
    />
  ),
};
