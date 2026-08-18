import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { CircleInfoIcon } from '@acronis-platform/icons-react/stroke-mono';

import { Button } from '../../button/button';
import { Chip } from '../chip';

const meta = {
  title: 'UI/Chip',
  component: Chip,
  tags: ['autodocs'],
  args: { children: 'Label', variant: 'removable' },
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['removable', 'selectable', 'operational'],
      description:
        '`removable` carries a trailing × remove button; `selectable` is a toggle that shows the active styling when `selected`; `operational` is a plain action chip with a strong-link label.',
      table: {
        type: { summary: "'removable' | 'selectable' | 'operational'" },
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

// Removal is controlled — Chip emits `onRemove` and the consumer drops it. The
// story owns that state so clicking × actually makes the chip disappear (a
// no-op `onRemove` reads as "the × is broken"). The restore affordance only
// appears after removal, so the story's initial render is unchanged.
export const Removable: Story = {
  args: { variant: 'removable' },
  render: (args) => {
    const [removed, setRemoved] = React.useState(false);
    if (removed) {
      return (
        <Button variant="ghost" onClick={() => setRemoved(false)}>
          Restore chip
        </Button>
      );
    }
    return <Chip {...args} variant="removable" onRemove={() => setRemoved(true)} />;
  },
};

export const Selectable: Story = {
  args: { variant: 'selectable' },
  render: (args) => {
    const [selected, setSelected] = React.useState(false);
    return (
      <Chip
        {...args}
        variant="selectable"
        selected={selected}
        onClick={() => setSelected((prev) => !prev)}
      />
    );
  },
};

export const Operational: Story = {
  args: { variant: 'operational', children: 'Add filter' },
};

export const WithIcon: Story = {
  args: { variant: 'selectable', icon: <CircleInfoIcon size={16} /> },
  // Selectable, so it toggles on click like the Selectable story — an inert
  // selectable chip looks broken even when the icon is the point of the story.
  render: (args) => {
    const [selected, setSelected] = React.useState(false);
    return (
      <Chip
        {...args}
        selected={selected}
        onClick={() => setSelected((prev) => !prev)}
      />
    );
  },
};

export const Overview: Story = {
  render: () => (
    <div className="flex flex-col items-start gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <Chip variant="removable" onRemove={() => {}}>
          Removable
        </Chip>
        <Chip variant="removable" icon={<CircleInfoIcon size={16} />} onRemove={() => {}}>
          With icon
        </Chip>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Chip variant="selectable">Selectable</Chip>
        <Chip variant="selectable" selected>
          Selected
        </Chip>
        <Chip variant="selectable" icon={<CircleInfoIcon size={16} />} selected>
          Selected · icon
        </Chip>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Chip variant="operational">Add filter</Chip>
        <Chip variant="operational" icon={<CircleInfoIcon size={16} />}>
          Operational · icon
        </Chip>
      </div>
    </div>
  ),
};
