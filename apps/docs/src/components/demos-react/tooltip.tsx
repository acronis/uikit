'use client';

import {
  Button,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@acronis-platform/ui-react';
import { useShadowMount } from '@/components/ShadowDemo';

export function TooltipDemo() {
  const mount = useShadowMount();
  return (
    <div style={{ padding: '48px 0' }}>
      <Tooltip defaultOpen>
        <TooltipTrigger render={<Button variant="secondary">Hover me</Button>} />
        <TooltipContent portalContainer={mount}>Helpful hint</TooltipContent>
      </Tooltip>
    </div>
  );
}
