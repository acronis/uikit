import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  CircleCheckIcon,
  CircleInfoIcon,
  CircleWarningIcon,
  TriangleWarningIcon,
} from '@acronis-platform/icons-react/stroke-mono';

import { Timeline } from '../timeline';
import { Tag } from '../../tag';

const meta = {
  title: 'UI/Timeline',
  component: Timeline,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  decorators: [
    (Story) => (
      <div className="w-[848px] bg-[var(--ui-background-surface-secondary)] p-5">
        <Story />
      </div>
    ),
  ],
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['default', 'tree'],
      description:
        '`tree` reserves a disclosure button ahead of the marker, widening the indent step.',
      table: {
        type: { summary: "'default' | 'tree'" },
        defaultValue: { summary: "'default'" },
        category: 'Appearance',
      },
    },
    children: {
      control: false,
      description: '`Timeline.Item`s, in visual order.',
      table: { type: { summary: 'ReactNode' }, category: 'Content' },
    },
    className: {
      control: 'text',
      description: 'Extra classes merged onto the `<ol>`.',
      table: { type: { summary: 'string' }, category: 'Appearance' },
    },
  },
} satisfies Meta<typeof Timeline>;

export default meta;
type Story = StoryObj<typeof meta>;

const WarningTag = () => <Tag variant="warning">Tag</Tag>;

// Mirrors Figma's `bodySection`: a 1fr/2fr grid, 14px/24 text in the primary
// color, with the *description* set in medium and the title in regular.
const BodySection = () => (
  <div className="grid grid-cols-[1fr_2fr] gap-6 px-4 py-2">
    <span className="text-sm leading-6 text-foreground">Section title</span>
    <span className="text-sm font-medium leading-6 text-foreground">
      Section description
    </span>
  </div>
);

/** The Figma widget: a nested audit trail, L1 → L2 → L3. */
export const Default: Story = {
  render: (args) => (
    <Timeline {...args}>
      <Timeline.Item
        icon={<CircleInfoIcon />}
        title="Title"
        tag={<WarningTag />}
        timestamp="Dec 22, 08:30 AM"
        description="Description"
      />
      <Timeline.Item
        level={2}
        branchStart
        icon={<CircleInfoIcon />}
        title="Title"
        tag={<WarningTag />}
        timestamp="Dec 22, 08:30 AM"
        description="Description"
      />
      <Timeline.Item
        level={2}
        icon={<CircleInfoIcon />}
        title="Title"
        tag={<WarningTag />}
        timestamp="Dec 22, 08:30 AM"
        description="Description"
      />
      <Timeline.Item
        level={3}
        branchStart
        icon={<CircleInfoIcon />}
        title="Title"
        tag={<WarningTag />}
        timestamp="Dec 22, 08:30 AM"
        description="Description"
      />
      <Timeline.Item
        level={3}
        icon={<CircleInfoIcon />}
        title="Title"
        tag={<WarningTag />}
        timestamp="Dec 22, 08:30 AM"
        description="Description"
      />
    </Timeline>
  ),
};

/** A flat feed — every row at level 1. */
export const Flat: Story = {
  render: (args) => (
    <Timeline {...args}>
      <Timeline.Item
        icon={<CircleCheckIcon />}
        color="green"
        title="Backup completed"
        timestamp="Dec 22, 08:30 AM"
        description="12 of 12 workloads protected"
      />
      <Timeline.Item
        icon={<TriangleWarningIcon />}
        color="yellow"
        title="Success rate dropped"
        tag={<WarningTag />}
        timestamp="Dec 22, 09:15 AM"
        description="Fell from 96% to 72%"
      />
      <Timeline.Item
        icon={<CircleInfoIcon />}
        title="Retention policy applied"
        timestamp="Dec 22, 10:00 AM"
        description="Weekly archives pruned"
      />
    </Timeline>
  ),
};

/** Each marker color scheme the Avatar exposes. */
export const MarkerColors: Story = {
  render: (args) => (
    <Timeline {...args}>
      {(
        [
          'blue',
          'gray',
          'green',
          'teal',
          'violet',
          'red',
          'yellow',
          'orange',
        ] as const
      ).map((color) => (
        <Timeline.Item
          key={color}
          color={color}
          icon={<CircleInfoIcon />}
          title={color}
          timestamp="Dec 22, 08:30 AM"
        />
      ))}
    </Timeline>
  ),
};

/** Connectors are derived: a branch's last row never leaves a dangling line. */
export const BranchEnd: Story = {
  render: (args) => (
    <Timeline {...args}>
      <Timeline.Item
        icon={<CircleInfoIcon />}
        title="Root"
        timestamp="Dec 22, 08:30 AM"
      />
      <Timeline.Item
        level={2}
        branchStart
        icon={<CircleInfoIcon />}
        title="Only child"
        timestamp="Dec 22, 08:31 AM"
      />
      <Timeline.Item
        icon={<CircleInfoIcon />}
        title="Next root"
        timestamp="Dec 22, 08:40 AM"
      />
    </Timeline>
  ),
};

/**
 * Tree mode: every row with descendants derives a disclosure button; leaves don't.
 * No `collapsible` anywhere below — the levels alone drive it.
 */
export const Tree: Story = {
  args: { variant: 'tree' },
  render: (args) => (
    <Timeline {...args}>
      <Timeline.Item
        icon={<CircleInfoIcon />}
        title="Title"
        tag={<WarningTag />}
        timestamp="Dec 22, 08:30 AM"
        description="Description"
      />
      <Timeline.Item
        level={2}
        branchStart
        icon={<CircleInfoIcon />}
        title="Title"
        tag={<WarningTag />}
        timestamp="Dec 22, 08:30 AM"
        description="Description"
      />
      <Timeline.Item
        level={3}
        branchStart
        icon={<CircleInfoIcon />}
        title="Title"
        tag={<WarningTag />}
        timestamp="Dec 22, 08:30 AM"
        description="Description"
      />
      <Timeline.Item
        level={3}
        icon={<CircleInfoIcon />}
        title="Title"
        tag={<WarningTag />}
        timestamp="Dec 22, 08:30 AM"
        description="Description"
      />
    </Timeline>
  ),
};

/**
 * Collapsed tree rows — the chevron points toward the inline end. Expanding one
 * reveals its nested rows.
 */
export const TreeCollapsed: Story = {
  args: { variant: 'tree' },
  render: (args) => (
    <Timeline {...args}>
      <Timeline.Item
        defaultExpanded={false}
        icon={<CircleInfoIcon />}
        title="First group"
        tag={<WarningTag />}
        timestamp="Dec 22, 08:30 AM"
        description="Collapsed — two nested rows"
      />
      <Timeline.Item
        level={2}
        branchStart
        icon={<CircleCheckIcon />}
        color="green"
        title="Nested row"
        timestamp="Dec 22, 08:31 AM"
      />
      <Timeline.Item
        level={2}
        icon={<CircleCheckIcon />}
        color="green"
        title="Nested row"
        timestamp="Dec 22, 08:32 AM"
      />
      <Timeline.Item
        defaultExpanded={false}
        icon={<CircleInfoIcon />}
        title="Second group"
        tag={<WarningTag />}
        timestamp="Dec 22, 08:40 AM"
        description="Collapsed — one nested row"
      />
      <Timeline.Item
        level={2}
        branchStart
        icon={<CircleWarningIcon />}
        color="red"
        title="Nested row"
        timestamp="Dec 22, 08:41 AM"
      />
    </Timeline>
  ),
};

/**
 * Collapsing needs no wiring: `Timeline` reads its children's levels and drops
 * the rows beneath a collapsed one.
 */
export const TreeCollapsing: Story = {
  args: { variant: 'tree' },
  render: (args) => (
    <Timeline {...args}>
      <Timeline.Item
        icon={<CircleInfoIcon />}
        title="Retention policy applied"
        tag={<WarningTag />}
        timestamp="Dec 22, 08:30 AM"
        description="Weekly archives pruned"
      />
      <Timeline.Item
        level={2}
        branchStart
        icon={<CircleCheckIcon />}
        color="green"
        title="Archive pruned"
        timestamp="Dec 22, 08:31 AM"
        description="14 recovery points removed"
      />
      <Timeline.Item
        level={2}
        icon={<CircleCheckIcon />}
        color="green"
        title="Index rebuilt"
        timestamp="Dec 22, 08:33 AM"
        description="Catalog refreshed"
      />
      <Timeline.Item
        icon={<CircleInfoIcon />}
        title="Next root event"
        timestamp="Dec 22, 09:00 AM"
        description="Unaffected by the collapse above"
      />
      <Timeline.Item
        level={2}
        branchStart
        icon={<CircleInfoIcon />}
        title="Its own nested row"
        timestamp="Dec 22, 09:01 AM"
      />
    </Timeline>
  ),
};

/**
 * `collapsibleBody` puts a chevron at the trailing edge of a card's header that
 * folds that card's own body (Figma's `Action Button`). It is the *card's* control,
 * not the timeline's, so it is unrelated to `variant` and leaves the rows nested
 * under it untouched. The second row starts folded.
 */
export const ExpandableCard: Story = {
  render: (args) => (
    <Timeline {...args}>
      <Timeline.Item
        collapsibleBody
        icon={<CircleWarningIcon />}
        color="red"
        title="Nightly protection plan failed"
        tag={<WarningTag />}
        timestamp="Dec 22, 08:30 AM"
        description="3 of 12 workloads were not protected"
      >
        <BodySection />
      </Timeline.Item>
      <Timeline.Item
        collapsibleBody
        defaultBodyExpanded={false}
        icon={<TriangleWarningIcon />}
        color="yellow"
        title="Success rate dropped"
        timestamp="Dec 22, 09:15 AM"
        description="Folded — click the chevron to reveal"
      >
        <BodySection />
      </Timeline.Item>
      <Timeline.Item
        level={2}
        branchStart
        icon={<CircleInfoIcon />}
        title="Retention policy applied"
        timestamp="Dec 22, 10:00 AM"
        description="Unaffected by the card above"
      />
    </Timeline>
  ),
};

/**
 * The two controls are orthogonal. In `tree` mode a row with descendants gets the
 * branch button ahead of its marker *and*, with `collapsibleBody`, a chevron in its
 * card header: the first drops the rows below, the second folds this card's body.
 */
export const TreeWithExpandableCard: Story = {
  args: { variant: 'tree' },
  render: (args) => (
    <Timeline {...args}>
      <Timeline.Item
        collapsibleBody
        icon={<CircleWarningIcon />}
        color="red"
        title="Nightly protection plan failed"
        tag={<WarningTag />}
        timestamp="Dec 22, 08:30 AM"
        description="Branch button ahead of the marker, chevron in the header"
      >
        <BodySection />
      </Timeline.Item>
      <Timeline.Item
        level={2}
        branchStart
        icon={<TriangleWarningIcon />}
        color="yellow"
        title="Three workloads missed their window"
        timestamp="Dec 22, 08:31 AM"
        description="db-01, db-02, files-07"
      />
      <Timeline.Item
        level={2}
        icon={<CircleCheckIcon />}
        color="green"
        title="Retry succeeded"
        timestamp="Dec 22, 09:02 AM"
        description="All three workloads protected"
      />
    </Timeline>
  ),
};

/** Markers can carry initials instead of an icon. */
export const InitialsMarkers: Story = {
  render: (args) => (
    <Timeline {...args}>
      <Timeline.Item
        initials="AA"
        color="violet"
        title="Operator updated the policy"
        timestamp="Dec 22, 08:30 AM"
        description="Retention raised to 90 days"
      />
      <Timeline.Item
        initials="BB"
        color="teal"
        title="Reviewer approved the change"
        timestamp="Dec 22, 09:10 AM"
        description="Two approvals required"
      />
      <Timeline.Item
        initials="CC"
        color="orange"
        title="Workspace owner was notified"
        timestamp="Dec 22, 09:12 AM"
      />
    </Timeline>
  ),
};

/** Extra content rendered in the card body, below the header. */
export const WithBody: Story = {
  render: (args) => (
    <Timeline {...args}>
      <Timeline.Item
        icon={<TriangleWarningIcon />}
        color="yellow"
        title="Success rate dropped"
        tag={<WarningTag />}
        timestamp="Dec 22, 09:15 AM"
        description="Fell from 96% to 72%"
      >
        <div className="grid grid-cols-[1fr_2fr] gap-6 px-4 py-2">
          <span className="text-sm leading-6 text-foreground">
            Affected workloads
          </span>
          <span className="text-sm font-medium leading-6 text-foreground">
            db-01, db-02, files-07
          </span>
        </div>
      </Timeline.Item>
      <Timeline.Item
        icon={<CircleInfoIcon />}
        title="Retention policy applied"
        timestamp="Dec 22, 10:00 AM"
        description="Weekly archives pruned"
      />
    </Timeline>
  ),
};

/**
 * The full Figma "Nesting test" sequence: a branch that descends to L3 and returns
 * to L1, so every connector/elbow combination is exercised at once.
 */
export const NestingSequence: Story = {
  render: (args) => (
    <Timeline {...args}>
      <Timeline.Item
        icon={<CircleWarningIcon />}
        color="red"
        title="Title"
        description="Description"
      >
        <BodySection />
      </Timeline.Item>
      <Timeline.Item
        level={2}
        branchStart
        icon={<TriangleWarningIcon />}
        color="yellow"
        title="Title"
        tag={<WarningTag />}
        timestamp="Dec 22, 08:30 AM"
        description="Description"
      />
      <Timeline.Item
        level={2}
        icon={<TriangleWarningIcon />}
        color="yellow"
        title="Title"
        tag={<WarningTag />}
        timestamp="Dec 22, 08:30 AM"
        description="Description"
      />
      <Timeline.Item
        level={2}
        icon={<CircleWarningIcon />}
        color="red"
        title="Title"
        tag={<WarningTag />}
        timestamp="Dec 22, 08:30 AM"
        description="Description"
      />
      <Timeline.Item
        level={3}
        branchStart
        icon={<TriangleWarningIcon />}
        color="yellow"
        title="Title"
        tag={<WarningTag />}
        timestamp="Dec 22, 08:30 AM"
        description="Description"
      />
      <Timeline.Item
        level={3}
        icon={<CircleWarningIcon />}
        color="red"
        title="Title"
        tag={<WarningTag />}
        timestamp="Dec 22, 08:30 AM"
        description="Description"
      />
      <Timeline.Item
        icon={<CircleWarningIcon />}
        color="red"
        title="Title"
        tag={<WarningTag />}
        timestamp="Dec 22, 08:30 AM"
        description="Description"
      />
      <Timeline.Item
        icon={<CircleWarningIcon />}
        color="red"
        title="Title"
        tag={<WarningTag />}
        timestamp="Dec 22, 08:30 AM"
        description="Description"
      />
    </Timeline>
  ),
};

/** Long single-line values truncate rather than wrap or push the card wider. */
export const Truncation: Story = {
  render: (args) => (
    <Timeline {...args}>
      <Timeline.Item
        icon={<CircleInfoIcon />}
        title="A protection plan title long enough that it has to be truncated before the tag and the timestamp"
        tag={<WarningTag />}
        timestamp="Dec 22, 08:30 AM"
        description="A description that also runs past the available width of the card and therefore truncates"
      />
      <Timeline.Item
        level={2}
        branchStart
        icon={<CircleInfoIcon />}
        title="Nested rows truncate against their narrower card too, because the indent takes width away"
        timestamp="Dec 22, 08:31 AM"
      />
    </Timeline>
  ),
};
