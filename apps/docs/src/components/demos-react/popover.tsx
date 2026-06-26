'use client';

import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@acronis-platform/ui-react';
import { useShadowMount } from '@/components/ShadowDemo';

export function PopoverDemo() {
  const mount = useShadowMount();
  return (
    <Popover defaultOpen>
      <PopoverTrigger render={<Button variant="secondary">Open popover</Button>} />
      <PopoverContent portalContainer={mount}>
        <div className="grid gap-2">
          <h4 className="font-medium leading-none">Dimensions</h4>
          <p className="text-sm text-muted-foreground">
            Set the dimensions for the layer.
          </p>
        </div>
      </PopoverContent>
    </Popover>
  );
}
