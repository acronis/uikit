import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from '../../button';
import { Popover, PopoverContent, PopoverTrigger } from '../popover';

const meta = {
  title: 'UI/Popover',
  component: Popover,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    defaultOpen: {
      control: 'boolean',
      description: 'Open on mount, uncontrolled.',
      table: { type: { summary: 'boolean' }, category: 'State' },
    },
    open: {
      control: 'boolean',
      description: 'Controlled open state. Pair with `onOpenChange`.',
      table: { type: { summary: 'boolean' }, category: 'State' },
    },
    onOpenChange: {
      control: false,
      description: 'Fires when the popover opens or closes.',
      table: { type: { summary: '(open, eventDetails) => void' }, category: 'Events' },
    },
    children: {
      control: false,
      description: 'A `PopoverTrigger` and a `PopoverContent`.',
      table: { type: { summary: 'ReactNode' }, category: 'Content' },
    },
  },
} satisfies Meta<typeof Popover>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Popover defaultOpen>
      <PopoverTrigger render={<Button variant="secondary">Open popover</Button>} />
      <PopoverContent>
        <div className="grid gap-2">
          <h4 className="font-medium leading-none">Dimensions</h4>
          <p className="text-sm text-muted-foreground">
            Set the dimensions for the layer.
          </p>
        </div>
      </PopoverContent>
    </Popover>
  ),
};

export const WithActions: Story = {
  render: () => (
    <Popover defaultOpen>
      <PopoverTrigger render={<Button variant="secondary">Filters</Button>} />
      <PopoverContent>
        <div className="grid gap-3">
          <p className="text-sm text-muted-foreground">
            Apply filters to the current view.
          </p>
          <div className="flex justify-end gap-2">
            <Button variant="ghost">Reset</Button>
            <Button>Apply</Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  ),
};
