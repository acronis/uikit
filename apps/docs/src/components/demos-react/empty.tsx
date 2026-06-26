'use client';

import {
  Button,
  Empty,
  EmptyActions,
  EmptyDescription,
  EmptyHeader,
  EmptyIcon,
  EmptyTitle,
} from '@acronis-platform/ui-react';
import { InboxIcon } from '@acronis-platform/icons-react/stroke-mono';

export function EmptyDemo() {
  return (
    <Empty>
      <EmptyIcon>
        <InboxIcon />
      </EmptyIcon>
      <EmptyHeader>
        <EmptyTitle>No backups found</EmptyTitle>
        <EmptyDescription>
          Create your first backup plan to start protecting this workload.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyActions>
        <Button>Create backup plan</Button>
      </EmptyActions>
    </Empty>
  );
}
