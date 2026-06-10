import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from '../button';

const meta = {
  title: 'UI/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'secondary', 'ghost', 'destructive', 'ai', 'inverted'],
    },
    disabled: { control: 'boolean' },
  },
  args: {
    children: 'Button',
    variant: 'default',
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button variant="default">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="ai">Ai</Button>
      <Button variant="inverted">Inverted</Button>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button variant="default" disabled>
        Primary
      </Button>
      <Button variant="secondary" disabled>
        Secondary
      </Button>
      <Button variant="ghost" disabled>
        Ghost
      </Button>
      <Button variant="destructive" disabled>
        Destructive
      </Button>
      <Button variant="ai" disabled>
        Ai
      </Button>
      <Button variant="inverted" disabled>
        Inverted
      </Button>
    </div>
  ),
};

export const AsLink: Story = {
  name: 'As link (render prop)',
  render: () => (
    <Button render={<a href="https://www.acronis.com" />} variant="ghost">
      Rendered as an anchor
    </Button>
  ),
};
