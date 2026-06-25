'use client';

import {
  Button,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@acronis-platform/ui-react';

export function TooltipDemo() {
  return (
    <div style={{ padding: '48px 0' }}>
      <Tooltip defaultOpen>
        <TooltipTrigger render={<Button variant="secondary">Hover me</Button>} />
        <TooltipContent>Helpful hint</TooltipContent>
      </Tooltip>
    </div>
  );
}
