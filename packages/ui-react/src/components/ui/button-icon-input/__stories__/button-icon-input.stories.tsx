import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  EyeIcon,
  TimesIcon,
} from '@acronis-platform/icons-react/stroke-mono';

import { ButtonIconInput, type ButtonIconInputProps } from '../button-icon-input';

// The two real-world consumers of this button: `InputPassword`'s
// show/hide toggle (`EyeIcon`) and `InputText`'s clear button (`TimesIcon`).
// Every story renders both side by side so they can be compared directly.
const IconPair = (props: Omit<ButtonIconInputProps, 'aria-label' | 'children'>) => (
  <div className="flex items-center gap-3">
    <ButtonIconInput aria-label="Show password" {...props}>
      <EyeIcon />
    </ButtonIconInput>
    <ButtonIconInput aria-label="Clear" {...props}>
      <TimesIcon />
    </ButtonIconInput>
  </div>
);

const meta = {
  title: 'UI/ButtonIconInput',
  component: ButtonIconInput,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['normal', 'error'],
      description:
        "Visual tone — mirrors the field it's embedded in. Maps to the Figma ButtonIconInput `variant` property.",
      table: {
        type: { summary: "'normal' | 'error'" },
        defaultValue: { summary: 'normal' },
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
    variant: 'normal',
  },
} satisfies Meta<typeof ButtonIconInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Normal: Story = {
  args: { variant: 'normal' },
  render: (args) => <IconPair {...args} />,
};

export const Error: Story = {
  args: { variant: 'error' },
  render: (args) => <IconPair {...args} />,
};

export const Disabled: Story = {
  args: { disabled: true },
  render: (args) => <IconPair {...args} />,
};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <IconPair variant="normal" />
      <IconPair variant="error" />
    </div>
  ),
};
