// AUTO-GENERATED from @acronis-platform/ui-spec — DO NOT EDIT.
// Regenerate: pnpm --filter @acronis-platform/ui-spec generate:stories
// `:hover` / `:active` stories require a Storybook pseudo-states addon to paint.

import type { Meta, StoryObj } from '@storybook/react-vite';
import { CardFilter } from '../../card-filter/card-filter';
import { SquareDashedIcon } from '@acronis-platform/icons-react/stroke-mono';
import { FilterCards } from '../filter-cards';

const meta = {
  title: 'UI/FilterCards/All States (generated)',
  component: FilterCards,
} satisfies Meta<typeof FilterCards>;

export default meta;
type Story = StoryObj<typeof meta>;

export const States: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <FilterCards>
      <CardFilter label="Total assets" value="125" icon={<SquareDashedIcon />} />
      <CardFilter label="Active filters" value="3" icon={<SquareDashedIcon />} />
      <CardFilter label="Pending" variant="static-empty" />
    </FilterCards>
    </div>
  ),
};
