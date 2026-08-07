// AUTO-GENERATED from @acronis-platform/ui-spec — DO NOT EDIT.
// Regenerate: pnpm --filter @acronis-platform/ui-spec generate:stories
// `:hover` / `:active` stories require a Storybook pseudo-states addon to paint.

import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { CircleInfoIcon } from '@acronis-platform/icons-react/stroke-mono';
import { Tag } from '../../tag';
import { Timeline } from '../timeline';

const meta = {
  title: 'UI/Timeline/All States (generated)',
  component: Timeline,
} satisfies Meta<typeof Timeline>;

export default meta;
type Story = StoryObj<typeof meta>;

const VARIANTS = ['default', 'tree'] as const;

export const Variants: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 12,
        alignItems: 'center',
      }}
    >
      {VARIANTS.map((v) => (
        <Timeline className="w-[520px] shrink-0" key={v} variant={v}>
          <Timeline.Item
            collapsible
            icon={<CircleInfoIcon />}
            title="Title"
            tag={<Tag variant="warning">Tag</Tag>}
            timestamp="Dec 22, 08:30 AM"
            description="Description"
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 2fr',
                gap: 24,
                padding: '8px 16px',
              }}
            >
              <span>Section title</span>
              <span style={{ fontWeight: 500 }}>Section description</span>
            </div>
          </Timeline.Item>
          <Timeline.Item
            level={2}
            branchStart
            icon={<CircleInfoIcon />}
            title="Title"
            tag={<Tag variant="warning">Tag</Tag>}
            timestamp="Dec 22, 08:31 AM"
            description="Description"
          />
          <Timeline.Item
            level={3}
            branchStart
            icon={<CircleInfoIcon />}
            title="Title"
            timestamp="Dec 22, 08:32 AM"
            description="Description"
          />
          <Timeline.Item
            level={3}
            icon={<CircleInfoIcon />}
            title="Title"
            timestamp="Dec 22, 08:33 AM"
            description="Description"
          />
          <Timeline.Item
            icon={<CircleInfoIcon />}
            title="Title"
            timestamp="Dec 22, 09:00 AM"
            description="Description"
          />
        </Timeline>
      ))}
    </div>
  ),
};

export const Hover: Story = {
  parameters: { pseudo: { hover: true } },
  render: () => (
    <Timeline className="w-[520px] shrink-0">
      <Timeline.Item
        collapsible
        icon={<CircleInfoIcon />}
        title="Title"
        tag={<Tag variant="warning">Tag</Tag>}
        timestamp="Dec 22, 08:30 AM"
        description="Description"
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 2fr',
            gap: 24,
            padding: '8px 16px',
          }}
        >
          <span>Section title</span>
          <span style={{ fontWeight: 500 }}>Section description</span>
        </div>
      </Timeline.Item>
      <Timeline.Item
        level={2}
        branchStart
        icon={<CircleInfoIcon />}
        title="Title"
        tag={<Tag variant="warning">Tag</Tag>}
        timestamp="Dec 22, 08:31 AM"
        description="Description"
      />
      <Timeline.Item
        level={3}
        branchStart
        icon={<CircleInfoIcon />}
        title="Title"
        timestamp="Dec 22, 08:32 AM"
        description="Description"
      />
      <Timeline.Item
        level={3}
        icon={<CircleInfoIcon />}
        title="Title"
        timestamp="Dec 22, 08:33 AM"
        description="Description"
      />
      <Timeline.Item
        icon={<CircleInfoIcon />}
        title="Title"
        timestamp="Dec 22, 09:00 AM"
        description="Description"
      />
    </Timeline>
  ),
};

export const FocusVisible: Story = {
  render: () => (
    <Timeline className="w-[520px] shrink-0">
      <Timeline.Item
        collapsible
        icon={<CircleInfoIcon />}
        title="Title"
        tag={<Tag variant="warning">Tag</Tag>}
        timestamp="Dec 22, 08:30 AM"
        description="Description"
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 2fr',
            gap: 24,
            padding: '8px 16px',
          }}
        >
          <span>Section title</span>
          <span style={{ fontWeight: 500 }}>Section description</span>
        </div>
      </Timeline.Item>
      <Timeline.Item
        level={2}
        branchStart
        icon={<CircleInfoIcon />}
        title="Title"
        tag={<Tag variant="warning">Tag</Tag>}
        timestamp="Dec 22, 08:31 AM"
        description="Description"
      />
      <Timeline.Item
        level={3}
        branchStart
        icon={<CircleInfoIcon />}
        title="Title"
        timestamp="Dec 22, 08:32 AM"
        description="Description"
      />
      <Timeline.Item
        level={3}
        icon={<CircleInfoIcon />}
        title="Title"
        timestamp="Dec 22, 08:33 AM"
        description="Description"
      />
      <Timeline.Item
        icon={<CircleInfoIcon />}
        title="Title"
        timestamp="Dec 22, 09:00 AM"
        description="Description"
      />
    </Timeline>
  ),
  // Real keyboard focus — paints :focus-visible without a pseudo-states addon.
  play: async () => {
    await userEvent.tab();
  },
};
