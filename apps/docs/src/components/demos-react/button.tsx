'use client';

import { Button } from '@acronis-platform/ui-react';
import { PlusIcon } from '@acronis-platform/icons-react/stroke-mono';

export function ButtonDemo() {
  return (
    <>
      <Button variant="default">Save</Button>
      <Button variant="secondary">Cancel</Button>
      <Button variant="ghost">Learn more</Button>
      <Button variant="destructive">Delete</Button>
      <Button variant="ai">Ask AI</Button>
      <Button variant="default">
        <PlusIcon />
        Add item
      </Button>
      <Button variant="default" disabled>
        Disabled
      </Button>
    </>
  );
}
