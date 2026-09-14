import type { Meta, StoryObj } from '@storybook/react-vite';

import { SquareDashedIcon } from '@acronis-platform/icons-react/stroke-mono';

import { SegmentControl, SegmentControlItem } from '../segment-control';

const meta = {
  title: 'UI/SegmentControl',
  component: SegmentControl,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    className: { control: false, table: { disable: true } },
    variant: {
      control: 'select',
      options: ['hug', 'fill'],
      description:
        'Layout mode — mirrors the Figma SegmentControl `variant` property. `hug` for one or two choices, `fill` for three or more.',
      table: {
        type: { summary: "'hug' | 'fill'" },
        defaultValue: { summary: 'hug' },
        category: 'Appearance',
      },
    },
    hasScroll: {
      control: 'boolean',
      description:
        'Figma `hasScroll` — puts the items on a scrollable track and pins paging chevrons to the inline end.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
        category: 'Appearance',
      },
    },
    children: {
      control: false,
      description: 'The `SegmentControlItem` choices.',
      table: { type: { summary: 'ReactNode' }, category: 'Content' },
    },
    scrollPrevLabel: {
      control: 'text',
      description: 'Accessible label for the previous-page chevron.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'Previous' },
        category: 'Content',
      },
    },
    scrollNextLabel: {
      control: 'text',
      description: 'Accessible label for the next-page chevron.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'Next' },
        category: 'Content',
      },
    },
    value: {
      control: 'text',
      description: 'Controlled selected item value. Pair with `onValueChange`.',
      table: { type: { summary: 'string' }, category: 'State' },
    },
    defaultValue: {
      control: 'text',
      description: 'Initially selected item value when uncontrolled.',
      table: { type: { summary: 'string' }, category: 'State' },
    },
    disabled: {
      control: 'boolean',
      description:
        'Disables every item in the group; items may also be disabled individually.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
        category: 'State',
      },
    },
    readOnly: {
      control: 'boolean',
      description:
        'Prevents selection changes while keeping the group focusable.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
        category: 'State',
      },
    },
    required: {
      control: 'boolean',
      description: 'Requires a selected item before a containing form submits.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
        category: 'Behavior',
      },
    },
    name: {
      control: 'text',
      description: 'Form field name submitted with the selected value.',
      table: { type: { summary: 'string' }, category: 'Behavior' },
    },
    onValueChange: {
      control: false,
      description: 'Fired when an enabled item is selected.',
      table: {
        type: { summary: '(value: unknown, details: Details) => void' },
        category: 'Events',
      },
    },
    render: {
      control: false,
      description:
        'Base UI render prop — replace the underlying group element.',
      table: { type: { summary: 'RenderProp' }, category: 'Composition' },
    },
  },
} satisfies Meta<typeof SegmentControl>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    variant: 'hug',
    hasScroll: false,
    defaultValue: 'active',
    scrollPrevLabel: 'Previous',
    scrollNextLabel: 'Next',
  },
  render: (args) => (
    <SegmentControl {...args} aria-label="Status">
      <SegmentControlItem value="active">Active value</SegmentControlItem>
      <SegmentControlItem value="second">Second value</SegmentControlItem>
    </SegmentControl>
  ),
};

/** Figma `variant=hug`: use for one or two choices. */
/** Figma `variant=fill`: use for three or more choices. */
export const Fill: Story = {
  render: () => (
    <SegmentControl variant="fill" defaultValue="active" aria-label="Status">
      <SegmentControlItem value="active">Active value</SegmentControlItem>
      <SegmentControlItem value="second">Second value</SegmentControlItem>
      <SegmentControlItem value="third">Third value</SegmentControlItem>
      <SegmentControlItem value="fourth">Fourth value</SegmentControlItem>
      <SegmentControlItem value="fifth">Fifth value</SegmentControlItem>
    </SegmentControl>
  ),
};

/** Figma `hasCounter=true`: the Tag exists only when the gate is enabled. */
export const ItemWithCounter: Story = {
  render: () => (
    <SegmentControl defaultValue="active" aria-label="Status">
      <SegmentControlItem
        value="active"
        hasCounter
        counter={{
          variant: 'neutral',
          size: 'sm',
          icon: <SquareDashedIcon size={16} />,
          children: '7',
        }}
      >
        Value
      </SegmentControlItem>
      <SegmentControlItem value="second">Second value</SegmentControlItem>
    </SegmentControl>
  ),
};

export const Disabled: Story = {
  render: () => (
    <SegmentControl defaultValue="grid" aria-label="View mode">
      <SegmentControlItem value="grid">Grid</SegmentControlItem>
      <SegmentControlItem value="list" disabled>
        List
      </SegmentControlItem>
    </SegmentControl>
  ),
};

/**
 * Figma `hasScroll=true`: the items sit on a scrollable track and the paging
 * chevrons pin to the inline end. Each chevron disables itself at its end of
 * the track, matching the design's `position=start | middle | end` variants.
 */
export const HasScroll: Story = {
  render: () => (
    <div className="w-[280px] max-w-full">
      <SegmentControl hasScroll defaultValue="active" aria-label="Status">
        <SegmentControlItem value="active">Active value</SegmentControlItem>
        <SegmentControlItem value="second">Second value</SegmentControlItem>
        <SegmentControlItem value="third">Third value</SegmentControlItem>
        <SegmentControlItem value="fourth">Fourth value</SegmentControlItem>
        <SegmentControlItem value="fifth">Fifth value</SegmentControlItem>
        <SegmentControlItem value="sixth">Sixth value</SegmentControlItem>
      </SegmentControl>
    </div>
  ),
};
