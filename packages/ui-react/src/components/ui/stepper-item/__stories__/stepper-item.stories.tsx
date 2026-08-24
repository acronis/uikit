import type { Meta, StoryObj } from '@storybook/react-vite';
import { CheckIcon } from '@acronis-platform/icons-react/stroke-mono';

import { Avatar, AvatarFallback } from '../../avatar';
import { StepperItem } from '../stepper-item';

// Figma recolors the digit inside a `current`/`future` avatar to that step's
// own label-color token (overriding Avatar's own per-scheme color) — see the
// comment in stepper-item.tsx. `completed` uses a fixed checkmark icon, so it
// needs no such override.
const numberAvatar = (
  n: number,
  color: 'blue' | 'gray' | 'green' = 'blue',
  digitVariant: 'current' | 'future' = 'current'
) => (
  <Avatar
    color={color}
    className={`text-[var(--ui-stepper-item-${digitVariant}-label-color)]`}
  >
    <AvatarFallback>{n}</AvatarFallback>
  </Avatar>
);

const checkAvatar = (
  <Avatar color="green">
    <CheckIcon size={16} />
  </Avatar>
);

const meta = {
  title: 'UI/StepperItem',
  component: StepperItem,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['current', 'completed', 'future'],
      description:
        "The step's structural role in the sequence — mirrors the Figma `type` property. Drives the container background, border, and the label color.",
      table: {
        type: { summary: "'current' | 'completed' | 'future'" },
        defaultValue: { summary: 'current' },
        category: 'Appearance',
      },
    },
    state: {
      control: 'select',
      options: ['idle', 'hover', 'active', 'focus'],
      description:
        "Interaction state — mirrors the tokens-pd `Stepper` tier's completed-container color roles. Only changes the look when `variant` is `completed`; `current` always renders highlighted and `future` always renders disabled.",
      table: {
        type: { summary: "'idle' | 'hover' | 'active' | 'focus'" },
        defaultValue: { summary: 'idle' },
        category: 'State',
      },
    },
    avatar: {
      control: false,
      description:
        'Required marker element. Fully consumer-composed — pass any `Avatar` (color, initials, icon, image); the component renders it verbatim.',
      table: { type: { summary: 'ReactElement' }, category: 'Content' },
    },
    label: {
      control: 'text',
      description: 'The step name.',
      table: { type: { summary: 'ReactNode' }, category: 'Content' },
    },
    children: {
      control: false,
      description: 'Extra trailing content, rendered after the label.',
      table: { type: { summary: 'ReactNode' }, category: 'Content' },
    },
    onClick: {
      control: false,
      description:
        'Fired on activation — meaningful when the step is rendered as a real control via `render`.',
      table: { type: { summary: 'MouseEventHandler' }, category: 'Events' },
    },
    render: {
      control: false,
      description:
        'Base UI render prop — replace the underlying `<div>` (e.g. render a completed step as a `<button>`).',
      table: { type: { summary: 'RenderProp' }, category: 'Composition' },
    },
  },
  args: {
    variant: 'current',
    state: 'idle',
    label: 'Choose a plan',
    avatar: numberAvatar(1),
  },
} satisfies Meta<typeof StepperItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** The only combo Figma draws for `variant="current"` — always highlighted. */
export const CurrentActive: Story = {
  name: 'Current / active',
  args: { variant: 'current', state: 'active', label: 'Choose a plan' },
};

export const CompletedIdle: Story = {
  name: 'Completed / idle',
  args: {
    variant: 'completed',
    state: 'idle',
    label: 'Create an account',
    avatar: checkAvatar,
  },
};

export const CompletedHover: Story = {
  name: 'Completed / hover',
  args: {
    variant: 'completed',
    state: 'hover',
    label: 'Create an account',
    avatar: checkAvatar,
  },
};

export const CompletedActive: Story = {
  name: 'Completed / active',
  args: {
    variant: 'completed',
    state: 'active',
    label: 'Create an account',
    avatar: checkAvatar,
  },
};

export const CompletedFocus: Story = {
  name: 'Completed / focus',
  args: {
    variant: 'completed',
    state: 'focus',
    label: 'Create an account',
    avatar: checkAvatar,
  },
};

/** The only combo Figma draws for `variant="future"` — always disabled. */
export const FutureDisabled: Story = {
  name: 'Future / disabled',
  args: {
    variant: 'future',
    state: 'idle',
    label: 'Confirm and pay',
    avatar: numberAvatar(3, 'gray', 'future'),
  },
};

/** A completed step is a way back — compose it as a real `<button>`. */
export const AsButton: Story = {
  name: 'As button (render prop)',
  render: () => (
    <StepperItem
      render={<button type="button" />}
      variant="completed"
      label="Create an account"
      avatar={checkAvatar}
    />
  ),
};
