// AUTO-GENERATED from @acronis-platform/ui-spec — DO NOT EDIT.
// Regenerate: pnpm --filter @acronis-platform/ui-spec generate:stories
// `:hover` / `:active` stories require a Storybook pseudo-states addon to paint.

import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { CircleInfoIcon } from '@acronis-platform/icons-react/stroke-mono';
import { CardFilter } from '../card-filter';

const meta = {
  title: 'UI/CardFilter/All States (generated)',
  component: CardFilter,
} satisfies Meta<typeof CardFilter>;

export default meta;
type Story = StoryObj<typeof meta>;

const VARIANTS = ['static', 'static-empty', 'clickable'] as const;

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
      {VARIANTS.map((v) => <CardFilter label="Active filters" value="125" icon={<CircleInfoIcon />} key={v} variant={v} />)}
    </div>
  ),
};

export const Hover: Story = {
  parameters: { pseudo: { hover: true } },
  render: () => <CardFilter label="Active filters" value="125" icon={<CircleInfoIcon />} />,
};

export const Active: Story = {
  parameters: { pseudo: { active: true } },
  render: () => <CardFilter label="Active filters" value="125" icon={<CircleInfoIcon />} />,
};

export const FocusVisible: Story = {
  render: () => <CardFilter label="Active filters" value="125" icon={<CircleInfoIcon />} />,
  // Real keyboard focus — paints :focus-visible without a pseudo-states addon.
  play: async () => {
    await userEvent.tab();
  },
};
