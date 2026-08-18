import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  LayoutGridIcon,
  LayoutTableIcon,
  ListIcon,
  MagnifierMinusIcon,
  MagnifierPlusIcon,
} from '@acronis-platform/icons-react/stroke-mono';

import { ButtonGroup, ButtonGroupItem } from '../button-group';

const viewModes = (
  <>
    <ButtonGroupItem aria-label="List view">
      <ListIcon size={16} />
    </ButtonGroupItem>
    <ButtonGroupItem aria-label="Grid view">
      <LayoutGridIcon size={16} />
    </ButtonGroupItem>
    <ButtonGroupItem aria-label="Table view">
      <LayoutTableIcon size={16} />
    </ButtonGroupItem>
  </>
);

const meta = {
  title: 'UI/ButtonGroup',
  component: ButtonGroup,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['outlined', 'inlined'],
      description:
        'Container style — mirrors the Figma ButtonGroup `variant` property. `outlined` draws the border + radius; `inlined` draws neither.',
      table: {
        type: { summary: "'outlined' | 'inlined'" },
        defaultValue: { summary: 'outlined' },
        category: 'Appearance',
      },
    },
    disabled: {
      control: 'boolean',
      description:
        'Disables every item in the group. Individual items can also be disabled on their own.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
        category: 'State',
      },
    },
    loopFocus: {
      control: 'boolean',
      description:
        'Whether arrow-key navigation wraps from the last item back to the first.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
        category: 'Behavior',
      },
    },
    'aria-label': {
      control: 'text',
      description:
        'Accessible name for the toolbar. Required in practice — the component ships no default, since a generic one would be unlocalizable noise.',
      table: { type: { summary: 'string' }, category: 'Content' },
    },
    children: {
      control: false,
      description: '`ButtonGroupItem` elements, in visual order.',
      table: { type: { summary: 'ReactNode' }, category: 'Content' },
    },
    className: {
      control: false,
      description: 'Extra classes merged onto the container.',
      table: { type: { summary: 'string' }, category: 'Appearance' },
    },
    render: {
      control: false,
      description:
        'Base UI render prop — replace the underlying container `<div>`.',
      table: { type: { summary: 'RenderProp' }, category: 'Composition' },
    },
  },
  args: {
    'aria-label': 'View mode',
    children: viewModes,
  },
} satisfies Meta<typeof ButtonGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Inlined: Story = {
  args: { variant: 'inlined' },
};

// `inlined` exists for exactly this: the surrounding surface already draws a
// border, so an `outlined` group would double up on chrome.
export const InlinedOnSurface: Story = {
  render: (args) => (
    <div className="inline-flex items-center rounded border border-[color:var(--ui-button-group-global-container-border-color)] p-1">
      <ButtonGroup {...args} variant="inlined" />
    </div>
  ),
};

export const WithDisabledItem: Story = {
  render: (args) => (
    <ButtonGroup {...args}>
      <ButtonGroupItem aria-label="List view">
        <ListIcon size={16} />
      </ButtonGroupItem>
      <ButtonGroupItem aria-label="Grid view" disabled>
        <LayoutGridIcon size={16} />
      </ButtonGroupItem>
      <ButtonGroupItem aria-label="Table view">
        <LayoutTableIcon size={16} />
      </ButtonGroupItem>
    </ButtonGroup>
  ),
};

// A two-item cluster — the smallest group that still shows a separator.
export const ZoomControls: Story = {
  args: { 'aria-label': 'Zoom' },
  render: (args) => (
    <ButtonGroup {...args}>
      <ButtonGroupItem aria-label="Zoom out">
        <MagnifierMinusIcon size={16} />
      </ButtonGroupItem>
      <ButtonGroupItem aria-label="Zoom in">
        <MagnifierPlusIcon size={16} />
      </ButtonGroupItem>
    </ButtonGroup>
  ),
};
