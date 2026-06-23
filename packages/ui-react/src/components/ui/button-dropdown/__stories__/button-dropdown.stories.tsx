import type { Meta, StoryObj } from '@storybook/react-vite';

import { ButtonDropdown } from '../button-dropdown';

const meta = {
  title: 'UI/ButtonDropdown',
  component: ButtonDropdown,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary'],
      description: 'Visual style — mirrors the Figma ButtonDropdown `variant` property.',
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
} satisfies Meta<typeof ButtonDropdown>;

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
      <ButtonDropdown variant="primary">Label</ButtonDropdown>
      <ButtonDropdown variant="secondary">Label</ButtonDropdown>
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <ButtonDropdown variant="primary">Label</ButtonDropdown>
        <ButtonDropdown variant="primary" open>
          Label
        </ButtonDropdown>
        <ButtonDropdown variant="primary" disabled>
          Label
        </ButtonDropdown>
      </div>
      <div className="flex items-center gap-3">
        <ButtonDropdown variant="secondary">Label</ButtonDropdown>
        <ButtonDropdown variant="secondary" open>
          Label
        </ButtonDropdown>
        <ButtonDropdown variant="secondary" disabled>
          Label
        </ButtonDropdown>
      </div>
    </div>
  ),
};
