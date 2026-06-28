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
