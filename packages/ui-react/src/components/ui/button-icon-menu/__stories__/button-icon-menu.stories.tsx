import type { Meta, StoryObj } from '@storybook/react-vite';

import { ButtonIconMenu } from '../button-icon-menu';

const meta = {
  title: 'UI/ButtonIconMenu',
  component: ButtonIconMenu,
  tags: ['autodocs'],
  argTypes: {
    open: {
      control: 'boolean',
      description:
        'Whether the associated menu is open. Applies the open (`*-active`) treatment and reflects `aria-expanded`.',
      table: { type: { summary: 'boolean' }, category: 'State' },
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the button and applies the disabled token set.',
      table: { type: { summary: 'boolean' }, category: 'State' },
    },
    ariaLabel: {
      control: 'text',
      description:
        'Accessible name for the icon-only trigger. Pass a localized string.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'More options' },
        category: 'Content',
      },
    },
    type: {
      control: 'select',
      options: ['button', 'submit', 'reset'],
      description: 'Native HTML button type.',
      table: {
        type: { summary: "'button' | 'submit' | 'reset'" },
        category: 'Behavior',
      },
    },
    onClick: {
      control: false,
      description: 'Click handler — typically toggles the menu it controls.',
      table: {
        type: { summary: '(event: MouseEvent) => void' },
        category: 'Events',
      },
    },
    render: {
      control: false,
      description:
        'Base UI render prop — replace the underlying `<button>` (e.g. a menu trigger).',
      table: { type: { summary: 'RenderProp' }, category: 'Composition' },
    },
  },
} satisfies Meta<typeof ButtonIconMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Open: Story = {
  args: { open: true },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const States: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <ButtonIconMenu />
      <ButtonIconMenu open />
      <ButtonIconMenu disabled />
    </div>
  ),
};
