import type { Meta, StoryObj } from '@storybook/react-vite';

import { ButtonIcon } from '../button-icon';

const PlusIcon = () => (
  <svg aria-hidden="true" focusable="false" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M8 3.5v9M3.5 8h9" strokeLinecap="round" />
  </svg>
);

const meta = {
  title: 'UI/ButtonIcon',
  component: ButtonIcon,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['ghost', 'secondary'],
      description: 'Visual style — mirrors the Figma ButtonIcon `variant` property.',
      table: {
        type: { summary: "'ghost' | 'secondary'" },
        defaultValue: { summary: 'ghost' },
        category: 'Appearance',
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the button and applies the disabled token set.',
      table: { type: { summary: 'boolean' }, category: 'State' },
    },
    'aria-label': {
      control: 'text',
      description:
        'Accessible name for the icon-only button. Provide this (or `aria-labelledby`) so the control has a label.',
      table: { type: { summary: 'string' }, category: 'Content' },
    },
    children: {
      control: false,
      description: 'The icon element rendered inside the button.',
      table: { type: { summary: 'ReactNode' }, category: 'Content' },
    },
    onClick: {
      control: false,
      description: 'Click handler.',
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
    'aria-label': 'Add',
    children: <PlusIcon />,
  },
} satisfies Meta<typeof ButtonIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Secondary: Story = {
  args: { variant: 'secondary' },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const Variants: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <ButtonIcon aria-label="Add">
        <PlusIcon />
      </ButtonIcon>
      <ButtonIcon aria-label="Add" variant="secondary">
        <PlusIcon />
      </ButtonIcon>
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <ButtonIcon aria-label="Add">
          <PlusIcon />
        </ButtonIcon>
        <ButtonIcon aria-label="Add" disabled>
          <PlusIcon />
        </ButtonIcon>
      </div>
      <div className="flex items-center gap-3">
        <ButtonIcon aria-label="Add" variant="secondary">
          <PlusIcon />
        </ButtonIcon>
        <ButtonIcon aria-label="Add" variant="secondary" disabled>
          <PlusIcon />
        </ButtonIcon>
      </div>
    </div>
  ),
};
