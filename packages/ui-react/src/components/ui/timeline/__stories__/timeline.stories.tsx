import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  CircleCheckIcon,
  CircleInfoIcon,
  ChartPieIcon,
} from '@acronis-platform/icons-react/stroke-mono';

import { Timeline } from '../timeline';
import { Tag } from '../../tag';
import { Link } from '../../link';

const meta = {
  title: 'UI/Timeline',
  component: Timeline,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  decorators: [
    (Story) => (
      <div className="w-[420px] rounded-lg border border-border bg-background p-6 text-foreground">
        <Story />
      </div>
    ),
  ],
  argTypes: {
    size: { control: 'inline-radio', options: ['small', 'medium'] },
    density: { control: 'inline-radio', options: ['compact', 'default'] },
  },
} satisfies Meta<typeof Timeline>;

export default meta;
type Story = StoryObj<typeof meta>;

// A customer-health activity feed. Status tints only the marker.
export const Default: Story = {
  render: (args) => (
    <Timeline {...args}>
      <Timeline.Item
        timestamp={
          <time dateTime="2026-07-24T10:35:00+02:00">24 Jul 2026, 10:35</time>
        }
        title="Backup success rate dropped"
        description="Success rate fell from 96% to 72%"
        status="critical"
      />
      <Timeline.Item
        timestamp={
          <time dateTime="2026-07-23T16:20:00+02:00">23 Jul 2026, 16:20</time>
        }
        title="P1 support ticket resolved"
        description="Resolution improved the customer health score"
        status="success"
      />
      <Timeline.Item
        timestamp={
          <time dateTime="2026-07-22T09:10:00+02:00">22 Jul 2026, 09:10</time>
        }
        title="Security policy updated"
        description="All managed endpoints are now compliant"
        status="info"
      />
    </Timeline>
  ),
};

// Markers carry an icon in a status-tinted badge instead of the plain dot.
export const WithIcons: Story = {
  render: (args) => (
    <Timeline {...args}>
      <Timeline.Item
        timestamp="Today, 10:30"
        title="Backup reliability improved"
        status="success"
        icon={<CircleCheckIcon />}
      />
      <Timeline.Item
        timestamp="Today, 08:05"
        title="Coverage report generated"
        status="info"
        icon={<ChartPieIcon />}
      />
      <Timeline.Item
        timestamp="Yesterday, 16:15"
        title="Three P1 tickets remain open"
        status="warning"
        icon={<CircleInfoIcon />}
      />
    </Timeline>
  ),
};

// Every status tint on the marker.
export const Statuses: Story = {
  render: (args) => (
    <Timeline {...args}>
      <Timeline.Item title="Neutral" status="neutral" />
      <Timeline.Item title="Info" status="info" />
      <Timeline.Item title="Success" status="success" />
      <Timeline.Item title="Warning" status="warning" />
      <Timeline.Item title="Danger" status="danger" />
      <Timeline.Item title="Critical" status="critical" />
    </Timeline>
  ),
};

// Compact density for sidebars / popovers.
export const Compact: Story = {
  args: { density: 'compact', size: 'small' },
  render: (args) => (
    <Timeline {...args}>
      <Timeline.Item timestamp="10:30" title="Deployed v2.4.1" status="success" />
      <Timeline.Item timestamp="10:12" title="Build passed" status="info" />
      <Timeline.Item timestamp="10:04" title="Pushed 3 commits" status="neutral" />
    </Timeline>
  ),
};

// A process: completed → current → upcoming.
export const CurrentStep: Story = {
  render: (args) => (
    <Timeline {...args}>
      <Timeline.Item title="Account created" status="success" />
      <Timeline.Item title="Configuring protection" status="info" current />
      <Timeline.Item title="First backup" status="neutral" disabled />
    </Timeline>
  ),
};

// A process with icon markers: `current` rings its badge (consistent icon
// markers throughout, so the column stays even).
export const IconsWithCurrent: Story = {
  render: (args) => (
    <Timeline {...args}>
      <Timeline.Item
        title="Account created"
        status="success"
        icon={<CircleCheckIcon />}
      />
      <Timeline.Item
        title="Configuring protection"
        status="info"
        icon={<ChartPieIcon />}
        current
      />
      <Timeline.Item
        title="First backup"
        status="neutral"
        icon={<CircleInfoIcon />}
        disabled
      />
    </Timeline>
  ),
};

// A disabled item is dimmed and marked `aria-disabled`; its slotted actions stop
// taking pointer input (the active item above keeps its live link).
export const Disabled: Story = {
  render: (args) => (
    <Timeline {...args}>
      <Timeline.Item
        timestamp="24 Jul 2026, 10:35"
        title="Restore point available"
        description="Recover this workload from the 10:35 snapshot"
        status="success"
        actions={<Link href="#restore">Restore</Link>}
      />
      <Timeline.Item
        timestamp="—"
        title="Archive to cold storage"
        description="Unavailable on this plan"
        status="neutral"
        actions={<Link href="#archive">Archive</Link>}
        disabled
      />
    </Timeline>
  ),
};

// Rich items: metadata Tags, actions, and an expandable detail (composed).
export const WithMetadataAndActions: Story = {
  render: (args) => (
    <Timeline {...args}>
      <Timeline.Item
        timestamp="24 Jul 2026, 10:35"
        title="Backup success rate dropped"
        description="Success rate fell from 96% to 72%"
        status="critical"
        metadata={
          <>
            <Tag variant="neutral" size="sm">
              Backup
            </Tag>
            <Tag variant="neutral" size="sm">
              Customer A
            </Tag>
          </>
        }
        actions={<Link href="#details">View details</Link>}
      />
      <Timeline.Item
        timestamp="23 Jul 2026, 16:20"
        title="Compound anomaly detected"
        status="warning"
      >
        <div className="rounded-md border border-border bg-muted/40 p-2 text-xs text-muted-foreground">
          Backup failures, high CPU usage and ticket spikes within 2 hours.
        </div>
      </Timeline.Item>
    </Timeline>
  ),
};
