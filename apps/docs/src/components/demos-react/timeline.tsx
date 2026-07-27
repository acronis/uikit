'use client';

import { Timeline, Tag, Link } from '@acronis-platform/ui-react';
import {
  CircleCheckIcon,
  ChartPieIcon,
  CircleInfoIcon,
} from '@acronis-platform/icons-react/stroke-mono';

export function TimelineDemo() {
  return (
    <Timeline className="w-[380px]">
      <Timeline.Item
        timestamp={
          <time dateTime="2026-07-24T10:35:00+02:00">24 Jul 2026, 10:35</time>
        }
        title="Backup success rate dropped"
        description="Success rate fell from 96% to 72%"
        status="critical"
        icon={<ChartPieIcon />}
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
        timestamp={
          <time dateTime="2026-07-23T16:20:00+02:00">23 Jul 2026, 16:20</time>
        }
        title="P1 support ticket resolved"
        description="Resolution improved the customer health score"
        status="success"
        icon={<CircleCheckIcon />}
      />
      <Timeline.Item
        timestamp={
          <time dateTime="2026-07-22T09:10:00+02:00">22 Jul 2026, 09:10</time>
        }
        title="Security policy updated"
        status="info"
        icon={<CircleInfoIcon />}
      />
    </Timeline>
  );
}
