'use client';

import { Timeline, Tag } from '@acronis-platform/ui-react';
import {
  CircleCheckIcon,
  CircleInfoIcon,
  CircleWarningIcon,
  TriangleWarningIcon,
} from '@acronis-platform/icons-react/stroke-mono';

export function TimelineDemo() {
  return (
    <Timeline className="w-[560px]">
      <Timeline.Item
        icon={<TriangleWarningIcon />}
        color="yellow"
        title="Backup success rate dropped"
        tag={<Tag variant="warning">Warning</Tag>}
        timestamp={
          <time dateTime="2026-07-24T10:35:00+02:00">24 Jul, 10:35</time>
        }
        description="Success rate fell from 96% to 72%"
      />
      <Timeline.Item
        level={2}
        icon={<CircleInfoIcon />}
        title="Three workloads missed their window"
        timestamp={
          <time dateTime="2026-07-24T10:36:00+02:00">24 Jul, 10:36</time>
        }
        description="db-01, db-02, files-07"
      />
      <Timeline.Item
        level={2}
        icon={<CircleCheckIcon />}
        color="green"
        title="Retry succeeded"
        timestamp={
          <time dateTime="2026-07-24T11:02:00+02:00">24 Jul, 11:02</time>
        }
        description="All three workloads protected"
      />
      <Timeline.Item
        icon={<CircleCheckIcon />}
        color="green"
        title="P1 support ticket resolved"
        timestamp={
          <time dateTime="2026-07-23T16:20:00+02:00">23 Jul, 16:20</time>
        }
        description="Resolution improved the customer health score"
      />
    </Timeline>
  );
}

export function TimelineTreeDemo() {
  return (
    <Timeline variant="tree" className="w-[560px]">
      <Timeline.Item
        icon={<CircleInfoIcon />}
        title="Retention policy applied"
        tag={<Tag variant="warning">Warning</Tag>}
        timestamp={
          <time dateTime="2026-12-22T08:30:00+01:00">Dec 22, 08:30 AM</time>
        }
        description="Weekly archives pruned"
        toggleLabel="Toggle policy steps"
      />
      <Timeline.Item
        level={2}
        icon={<CircleCheckIcon />}
        color="green"
        title="Archive pruned"
        timestamp={
          <time dateTime="2026-12-22T08:31:00+01:00">Dec 22, 08:31 AM</time>
        }
        description="14 recovery points removed"
      />
      <Timeline.Item
        level={2}
        icon={<CircleCheckIcon />}
        color="green"
        title="Index rebuilt"
        timestamp={
          <time dateTime="2026-12-22T08:33:00+01:00">Dec 22, 08:33 AM</time>
        }
        description="Catalog refreshed"
      />
      <Timeline.Item
        icon={<CircleInfoIcon />}
        title="Next root event"
        timestamp={
          <time dateTime="2026-12-22T09:00:00+01:00">Dec 22, 09:00 AM</time>
        }
        description="Unaffected by the collapse above"
        toggleLabel="Toggle event steps"
      />
      <Timeline.Item
        level={2}
        icon={<CircleCheckIcon />}
        color="green"
        title="Its own nested row"
        timestamp={
          <time dateTime="2026-12-22T09:01:00+01:00">Dec 22, 09:01 AM</time>
        }
      />
    </Timeline>
  );
}

export function TimelineExpandableDemo() {
  return (
    <Timeline className="w-[560px]">
      <Timeline.Item
        collapsibleBody
        icon={<CircleWarningIcon />}
        color="red"
        title="Nightly protection plan failed"
        timestamp={
          <time dateTime="2026-12-22T09:12:00+01:00">Dec 22, 09:12 AM</time>
        }
        description="3 of 12 workloads were not protected"
        bodyToggleLabel="Toggle affected workloads"
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
        level={2}
        initials="AA"
        color="violet"
        title="Operator acknowledged the alert"
        timestamp={
          <time dateTime="2026-12-22T09:14:00+01:00">Dec 22, 09:14 AM</time>
        }
        description="Retry scheduled for the next window"
      />
    </Timeline>
  );
}
