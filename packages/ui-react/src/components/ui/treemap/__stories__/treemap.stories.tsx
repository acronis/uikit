import type { Meta, StoryObj } from '@storybook/react-vite';
import { EllipsisIcon } from '@acronis-platform/icons-react/stroke-mono';

import { Treemap } from '../treemap';
import { type ChartConfig } from '../../chart';
import { paletteArgTypes } from '../../chart/__stories__/palette-control';
import { ButtonIcon } from '../../button-icon';
import { ChartWidget } from '../../chart-widget';

// NOTE: no `TooltipOpen` story here (unlike the other chart types). recharts'
// Treemap tooltip is purely hover-driven and does not honor `defaultIndex`/
// `active`, so it can't be opened statically for a VR snapshot. The tooltip
// surface is the shared `ChartTooltipContent` — already VR-covered by the
// open-tooltip baselines of the axis/polar chart types. Hover works at runtime.

// Cell colors are supplied by the caller via `config`, keyed by each leaf's
// nameKey value. There is no chart token tier yet, so these reference the shared
// semantic brand/status tokens (a dedicated data-viz palette is pending an
// upstream design pass). The status tokens are chromatic in every brand;
// `brand-secondary` is brand-dependent.
const data = [
  { name: 'React', size: 2400, count: 24 },
  { name: 'Vue', size: 1600, count: 16 },
  { name: 'Angular', size: 1200, count: 12 },
  { name: 'Svelte', size: 800, count: 8 },
  { name: 'Solid', size: 500, count: 5 },
];

const config = {
  React: { label: 'React' },
  Vue: { label: 'Vue' },
  Angular: {
    label: 'Angular',
  },
  Svelte: {
    label: 'Svelte',
  },
  Solid: {
    label: 'Solid',
  },
} satisfies ChartConfig;

// Separate data for the WidgetExample — matches the Figma widget node 8999:72036.
const widgetData = [
  { name: 'cat-a', size: 2400 },
  { name: 'cat-b', size: 1800 },
  { name: 'cat-c', size: 1200 },
  { name: 'cat-d', size: 900 },
  { name: 'cat-e', size: 600 },
  { name: 'cat-f', size: 400 },
];

const widgetConfig = {
  'cat-a': { label: 'Category A' },
  'cat-b': { label: 'Category B' },
  'cat-c': { label: 'Category C' },
  'cat-d': { label: 'Category D' },
  'cat-e': { label: 'Category E' },
  'cat-f': { label: 'Category F' },
} satisfies ChartConfig;

// Six leaves — one per diverging stop — to demonstrate adaptive text color.
// a3 (index 0) and b3 (index 5) are dark fills → white text;
// a2/a1/b1/b2 (indices 1–4) are pale fills → dark text.
const divergingData = [
  { name: 'a3', size: 2400 },
  { name: 'a2', size: 1600 },
  { name: 'a1', size: 1200 },
  { name: 'b1', size: 900 },
  { name: 'b2', size: 600 },
  { name: 'b3', size: 400 },
];

const divergingConfig = {
  a3: { label: 'Category A' },
  a2: { label: 'Category B' },
  a1: { label: 'Category C' },
  b1: { label: 'Category D' },
  b2: { label: 'Category E' },
  b3: { label: 'Category F' },
} satisfies ChartConfig;

const meta = {
  title: 'Widgets/Treemap',
  component: Treemap,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: {
    config,
    data,
    dataKey: 'size',
    nameKey: 'name',
    className: 'h-[320px] w-[520px]',
  },
  argTypes: {
    ...paletteArgTypes,
    aspectRatio: { control: { type: 'number', min: 0.5, max: 4, step: 0.1 } },
    showLabels: { control: 'boolean' },
    labelAlign: {
      control: 'inline-radio',
      options: ['bottom-start', 'top-start', 'center'],
    },
    secondaryKeys: { control: 'object' },
    secondarySeparator: { control: 'text' },
    showTooltip: { control: 'boolean' },
    showLegend: { control: 'boolean' },
    legendPos: { control: 'inline-radio', options: ['top', 'bottom'] },
    animate: { control: 'boolean' },
    animationDuration: { control: { type: 'number' } },
    animationBegin: { control: { type: 'number' } },
    animationEasing: {
      control: 'select',
      options: ['ease', 'ease-in', 'ease-out', 'ease-in-out', 'linear'],
    },
  },
} satisfies Meta<typeof Treemap>;

export default meta;
type Story = StoryObj<typeof meta>;

// A flat treemap: leaves sized by value, colored + labelled per name.
export const Default: Story = {};

// Figma `8999:72036` — treemap inside a ChartWidget with title and actions.
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
      >
        <Treemap
          config={widgetConfig}
          data={widgetData}
          dataKey="size"
          nameKey="name"
          className="size-full"
        />
      </ChartWidget>
    </div>
  ),
};

// A wider aspect ratio changes the tiling.
export const WideAspect: Story = {
  args: { aspectRatio: 2.5 },
};

// A two-line label: the leaf's name over its size and its count, formatted per
// field. The second line is dropped on any tile too short to hold it.
export const SecondaryLabels: Story = {
  args: {
    secondaryKeys: ['size', 'count'],
    secondaryFormatter: (value, index) =>
      index === 0 ? `${value} kB` : `${value} files`,
  },
};

// The block hung from the tile's opposite corner — the top start edge — rather
// than the default bottom one.
export const TopStartLabels: Story = {
  args: { labelAlign: 'top-start', secondaryKeys: ['size'] },
};

// The block hung from the tile's bottom start corner — the old default, now an
// explicit opt-in. The first leaf's label is deliberately longer than even the
// widest tile: a start-aligned line has to truncate against the tile, and a baseline
// where the label happens to fit would pass even if it sized itself to its own text.
export const BottomStartLabels: Story = {
  args: {
    labelAlign: 'bottom-start',
    secondaryKeys: ['size'],
    config: {
      ...config,
      React: {
        ...config.React,
        label: 'React, the client rendering runtime, and its build toolchain',
      },
    },
  },
};

// The Figma-canonical diverging blue-orange palette. Six leaves map to the six
// diverging stops (a3→b3). Adaptive text: white on dark fills (a3 at index 0, b3
// at index 5), dark text on pale fills (a2, a1, b1, b2 at indices 1–4).
export const DivergingPalette: Story = {
  args: {
    data: divergingData,
    config: divergingConfig,
    palette: { type: 'diverging', pair: 'blue-orange' },
  },
};

// Sequential palette — stops 1–2 (pale) get dark text; stops 3–8 (saturated) keep white text.
export const SequentialPalette: Story = {
  args: {
    palette: { type: 'sequential', ramp: 'blue' },
  },
};

// Status palette — all tones are chromatic, so white text is preserved on all tiles.
export const StatusPalette: Story = {
  args: {
    data: [
      { name: 'success', size: 2400 },
      { name: 'info', size: 1600 },
      { name: 'warning', size: 1200 },
      { name: 'critical', size: 800 },
    ],
    config: {
      success: { label: 'Success', tone: { status: 'success' } },
      info: { label: 'Info', tone: { status: 'info' } },
      warning: { label: 'Warning', tone: { status: 'warning' } },
      critical: { label: 'Critical', tone: { status: 'critical' } },
    },
    palette: { type: 'status' },
  },
};

// The legend — one entry per leaf, on the same markers and labels as every other
// chart type. The container reserves a strip for it, since recharts' treemap tiles
// the whole surface and would otherwise be painted over.
export const WithLegend: Story = {
  args: { showLegend: true },
};

// The legend on the top edge.
export const LegendTop: Story = {
  args: { showLegend: true, legendPos: 'top' },
};

// Graceful degradation on a long-tail dataset: the small tiles drop the second
// line, then clamp the name, then go blank — and the legend, which wraps onto a
// second row once the entries outgrow the chart's width, names what the tiles no
// longer can.
export const SmallTiles: Story = {
  args: {
    // Leaf keys are slugs (they become part of a `--color-<name>` property, so they
    // have to be CSS-safe); the human name lives in each config entry's label,
    // which is what the tile and the legend show.
    data: [
      { name: 'won', amount: 128600, deals: 7 },
      { name: 'approved', amount: 87400, deals: 5 },
      { name: 'awaiting-approval', amount: 61500, deals: 4 },
      { name: 'final-review', amount: 52300, deals: 3 },
      { name: 'draft', amount: 48200, deals: 6 },
      { name: 'lost', amount: 24800, deals: 2 },
      { name: 'disqualified', amount: 9400, deals: 1 },
    ],
    config: {
      won: {
        label: 'Won',
      },
      approved: {
        label: 'Approved',
      },
      'awaiting-approval': {
        label: 'Awaiting approval',
      },
      'final-review': {
        label: 'Final review',
      },
      draft: {
        label: 'Draft',
      },
      lost: {
        label: 'Lost',
      },
      disqualified: {
        label: 'Disqualified',
      },
    },
    dataKey: 'amount',
    secondaryKeys: ['amount', 'deals'],
    secondaryFormatter: (value, index) =>
      index === 0
        ? `${Number(value).toLocaleString('en-US')} USD`
        : `${value} deals`,
    showLegend: true,
  },
};

// Labels + tooltip toggled off — the baseline that would catch a toggle silently
// becoming a no-op (the unit env can't paint recharts chrome).
export const NoChrome: Story = {
  args: { showLabels: false, showTooltip: false },
};

// Empty data must render a clean (blank) surface — recharts still renders the
// synthetic root node through the cell renderer, so this baseline guards against
// it painting a full black box when there are no leaves to cover it.
export const EmptyData: Story = {
  args: { data: [] },
};

// Entrance animation on — a live example. Excluded from VR (snapshot.skip):
// the motion is non-deterministic, so it must not become a baseline.
export const Animated: Story = {
  parameters: { snapshot: { skip: true } },
  args: { animate: true, animationDuration: 800 },
};
