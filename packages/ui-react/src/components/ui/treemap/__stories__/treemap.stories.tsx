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
  { name: 'React', size: 2400 },
  { name: 'Vue', size: 1600 },
  { name: 'Angular', size: 1200 },
  { name: 'Svelte', size: 800 },
  { name: 'Solid', size: 500 },
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
  title: 'UI/Treemap',
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
    showTooltip: { control: 'boolean' },
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
