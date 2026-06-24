import type { Meta, StoryObj } from '@storybook/react-vite';

import { ButtonMenu } from '../button-menu';

const meta = {
  title: 'UI/ButtonMenu',
  component: ButtonMenu,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary'],
      description: 'Visual style — mirrors the Figma ButtonMenu `variant` property.',
      table: {
        type: { summary: "'primary' | 'secondary'" },
        defaultValue: { summary: 'primary' },
        category: 'Appearance',
      },
    },
    open: {
      control: 'boolean',
      description:
        'Whether the associated menu is open. Flips the trailing chevron (down → up), applies the open (`*-active`) treatment, and reflects `aria-expanded`.',
      table: { type: { summary: 'boolean' }, category: 'State' },
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the button and applies the disabled token set.',
      table: { type: { summary: 'boolean' }, category: 'State' },
    },
    children: {
      control: 'text',
      description: 'Label content rendered before the chevron.',
      table: { type: { summary: 'ReactNode' }, category: 'Content' },
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
        'Base UI render prop — replace the underlying `<button>` (e.g. render as an `<a>`).',
      table: { type: { summary: 'RenderProp' }, category: 'Composition' },
    },
  },
  args: {
    children: 'Label',
  },
} satisfies Meta<typeof ButtonMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Secondary: Story = {
  args: { variant: 'secondary' },
};

export const Open: Story = {
  args: { open: true },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const Variants: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <ButtonMenu variant="primary">Label</ButtonMenu>
      <ButtonMenu variant="secondary">Label</ButtonMenu>
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <ButtonMenu variant="primary">Label</ButtonMenu>
        <ButtonMenu variant="primary" open>
          Label
        </ButtonMenu>
        <ButtonMenu variant="primary" disabled>
          Label
        </ButtonMenu>
      </div>
      <div className="flex items-center gap-3">
        <ButtonMenu variant="secondary">Label</ButtonMenu>
        <ButtonMenu variant="secondary" open>
          Label
        </ButtonMenu>
        <ButtonMenu variant="secondary" disabled>
          Label
        </ButtonMenu>
      </div>
    </div>
  ),
};
