import type { Meta, StoryObj } from '@storybook/react-vite';

import { Treemap } from '../treemap';
import { type ChartConfig } from '../../chart';

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
  React: { label: 'React', color: 'var(--ui-background-brand-secondary)' },
  Vue: { label: 'Vue', color: 'var(--ui-background-status-strong-success)' },
  Angular: {
    label: 'Angular',
    color: 'var(--ui-background-status-strong-danger)',
  },
  Svelte: {
    label: 'Svelte',
    color: 'var(--ui-background-status-strong-warning)',
  },
  Solid: {
    label: 'Solid',
    color: 'var(--ui-background-status-strong-critical)',
  },
} satisfies ChartConfig;

const meta = {
  title: 'Widgets/Treemap',
  component: Treemap,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  // The ChartContainer is transparent by design (it inherits the surface it sits
  // on — usually a Card). Render the stories on a themed surface so the chart is
  // legible in both light and dark; without it, dark mode flips the token-driven
  // cell separators but leaves the backdrop unthemed.
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
    dataKey: 'size',
    nameKey: 'name',
    aspectRatio: 4 / 3,
    showLabels: true,
    showTooltip: true,
    className: 'h-[320px] w-[520px]',
  },
  argTypes: {
    aspectRatio: { control: { type: 'number', min: 0.5, max: 4, step: 0.1 } },
    showLabels: { control: 'boolean' },
    labelAlign: { control: 'inline-radio', options: ['top-left', 'center'] },
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

// The pre-`labelAlign` placement: the block centered in its cell instead of
// anchored to the tile's top-left corner.
export const CenteredLabels: Story = {
  args: { labelAlign: 'center', secondaryKeys: ['size'] },
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
      won: { label: 'Won', color: 'var(--ui-background-status-strong-success)' },
      approved: {
        label: 'Approved',
        color: 'var(--ui-background-brand-secondary)',
      },
      'awaiting-approval': {
        label: 'Awaiting approval',
        color: 'var(--ui-background-status-strong-warning)',
      },
      'final-review': {
        label: 'Final review',
        color: 'var(--ui-background-status-strong-info)',
      },
      draft: {
        label: 'Draft',
        color: 'var(--ui-background-status-strong-neutral)',
      },
      lost: { label: 'Lost', color: 'var(--ui-background-status-strong-danger)' },
      disqualified: {
        label: 'Disqualified',
        color: 'var(--ui-background-status-strong-critical)',
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
