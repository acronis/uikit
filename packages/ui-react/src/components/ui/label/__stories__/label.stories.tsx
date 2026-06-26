import type { Meta, StoryObj } from '@storybook/react-vite';

import { InputText } from '../../input-text';
import { Label } from '../label';

const meta = {
  title: 'UI/Label',
  component: Label,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: {
    children: 'Email address',
  },
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithControl: Story = {
  render: () => (
    <div className="flex w-64 flex-col gap-2">
      <Label htmlFor="email">Email address</Label>
      <InputText id="email" placeholder="name@acronis.com" />
    </div>
  ),
};

// `peer-disabled:` only matches a `peer`-marked sibling that precedes the label,
// so the control comes first here — the label dims when the control is disabled.
export const Disabled: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <input id="terms" type="checkbox" className="peer" disabled />
      <Label htmlFor="terms">Accept terms and conditions</Label>
    </div>
  ),
};
