import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  LayoutGridIcon,
  LayoutTableIcon,
  ListIcon,
  StarIcon,
} from '@acronis-platform/icons-react/stroke-mono';

import { Toggle, ToggleGroup, ToggleGroupItem } from '../toggle-group';

const meta = {
  title: 'UI/ToggleGroup',
  component: ToggleGroup,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof ToggleGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <ToggleGroup defaultValue={['grid']} aria-label="View mode">
      <ToggleGroupItem value="grid" aria-label="Grid view">
        <LayoutGridIcon size={16} />
      </ToggleGroupItem>
      <ToggleGroupItem value="table" aria-label="Table view">
        <LayoutTableIcon size={16} />
      </ToggleGroupItem>
      <ToggleGroupItem value="list" aria-label="List view">
        <ListIcon size={16} />
      </ToggleGroupItem>
    </ToggleGroup>
  ),
};

export const StandaloneToggle: Story = {
  render: () => (
    <Toggle defaultPressed aria-label="Favorite">
      <StarIcon size={16} />
      Favorite
    </Toggle>
  ),
};

export const Disabled: Story = {
  render: () => (
    <ToggleGroup defaultValue={['grid']} disabled aria-label="View mode">
      <ToggleGroupItem value="grid" aria-label="Grid view">
        <LayoutGridIcon size={16} />
      </ToggleGroupItem>
      <ToggleGroupItem value="table" aria-label="Table view">
        <LayoutTableIcon size={16} />
      </ToggleGroupItem>
    </ToggleGroup>
  ),
};
