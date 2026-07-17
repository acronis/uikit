import {
  ChevronDownIcon,
  PlusIcon,
} from '@acronis-platform/icons-react/stroke-mono';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from '../button';
import { ButtonIcon } from '../../button-icon';

/**
 * Buttons composed with `@acronis-platform/icons-react`. The icons use
 * `currentColor`, so they inherit the Button's text color per variant, and the
 * Button's `[&_svg]:size-4` rule sizes them automatically.
 */
const meta = {
  title: 'UI/Button/With Icons',
  component: Button,
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'secondary', 'ghost', 'destructive', 'ai'],
      description: 'Visual style — mirrors the Figma Button `Variant` property.',
      table: {
        type: {
          summary:
            "'default' | 'secondary' | 'ghost' | 'destructive' | 'ai'",
        },
        defaultValue: { summary: 'default' },
        category: 'Appearance',
      },
    },
    children: {
      control: 'text',
      description: 'Button content — here an icon alongside the label.',
      table: { type: { summary: 'ReactNode' }, category: 'Content' },
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the button and applies the disabled token set.',
      table: { type: { summary: 'boolean' }, category: 'State' },
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
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LeadingIcon: Story = {
  render: () => (
    <Button>
      <PlusIcon /> Add item
    </Button>
  ),
};

export const IconAcrossVariants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button variant="default">
        <PlusIcon /> Create
      </Button>
      <Button variant="secondary">
        Options <ChevronDownIcon />
      </Button>
      <Button variant="ghost">
        <PlusIcon /> Add
      </Button>
      <ButtonIcon aria-label="Add">
        <PlusIcon />
      </ButtonIcon>
    </div>
  ),
};
