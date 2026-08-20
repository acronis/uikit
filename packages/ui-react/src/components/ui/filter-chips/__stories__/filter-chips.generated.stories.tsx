// AUTO-GENERATED from @acronis-platform/ui-spec — DO NOT EDIT.
// Regenerate: pnpm --filter @acronis-platform/ui-spec generate:stories
// `:hover` / `:active` stories require a Storybook pseudo-states addon to paint.

import type { Meta, StoryObj } from '@storybook/react-vite';
import { FilterChipsList, FilterChipsReset } from '../filter-chips';
import { Chip } from '../../chip/chip';
import { SquareDashedIcon } from '@acronis-platform/icons-react/stroke-mono';
import { FilterChips } from '../filter-chips';

const meta = {
  title: 'UI/FilterChips/All States (generated)',
  component: FilterChips,
} satisfies Meta<typeof FilterChips>;

export default meta;
type Story = StoryObj<typeof meta>;

export const States: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <FilterChips>
        <FilterChipsList>
          <Chip icon={<SquareDashedIcon size={16} />}>Label</Chip>
          <Chip icon={<SquareDashedIcon size={16} />}>Label</Chip>
          <Chip icon={<SquareDashedIcon size={16} />}>Label</Chip>
          <FilterChipsReset />
        </FilterChipsList>
      </FilterChips>
    </div>
  ),
};
