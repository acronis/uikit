import type { Meta, StoryObj } from '@storybook/react-vite';
import { CircleInfoIcon } from '@acronis-platform/icons-react/stroke-mono';

import { Chip } from '../chip';

const meta = {
  title: 'UI/Chip',
  component: Chip,
  tags: ['autodocs'],
  args: { children: 'Label', variant: 'removable' },
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['removable', 'selectable'],
      description:
        '`removable` carries a trailing × remove button; `selectable` is a toggle that shows the active styling when `selected`.',
      table: {
        type: { summary: "'removable' | 'selectable'" },
        defaultValue: { summary: 'removable' },
        category: 'Appearance',
      },
    },
    selected: {
      control: 'boolean',
      description:
        '`selectable` only — applies the selected (active) styling and sets `aria-pressed`.',
      table: { type: { summary: 'boolean' }, category: 'State' },
    },
    icon: {
      control: false,
      description: 'Optional leading icon, rendered at 16px before the label.',
      table: { type: { summary: 'ReactNode' }, category: 'Content' },
    },
    children: {
      control: 'text',
      description: 'Chip label. Truncates with an ellipsis when it overflows.',
      table: { type: { summary: 'ReactNode' }, category: 'Content' },
    },
    onRemove: {
      control: false,
      description: '`removable` only — called when the × button is pressed.',
      table: { type: { summary: '() => void' }, category: 'Events' },
    },
    removeLabel: {
      control: 'text',
      description: 'Accessible label for the remove button.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'Remove' },
        category: 'Content',
      },
    },
    className: {
      control: false,
      description: 'Additional classes merged onto the chip root.',
      table: { type: { summary: 'string' }, category: 'Appearance' },
    },
  },
} satisfies Meta<typeof Chip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Removable: Story = {
  args: { variant: 'removable', onRemove: () => {} },
};

export const Selectable: Story = {
  args: { variant: 'selectable' },
};

export const SelectableSelected: Story = {
  args: { variant: 'selectable', selected: true },
};

export const WithIcon: Story = {
  args: { variant: 'selectable', icon: <CircleInfoIcon /> },
};

export const Overview: Story = {
  render: () => (
    <div className="flex flex-col items-start gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <Chip variant="removable" onRemove={() => {}}>
          Removable
        </Chip>
        <Chip variant="removable" icon={<CircleInfoIcon />} onRemove={() => {}}>
          With icon
        </Chip>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Chip variant="selectable">Selectable</Chip>
        <Chip variant="selectable" selected>
          Selected
        </Chip>
        <Chip variant="selectable" icon={<CircleInfoIcon />} selected>
          Selected · icon
        </Chip>
      </div>
    </div>
  ),
};
