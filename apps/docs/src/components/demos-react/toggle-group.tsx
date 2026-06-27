'use client';

import {
  Toggle,
  ToggleGroup,
  ToggleGroupItem,
} from '@acronis-platform/ui-react';
import {
  LayoutGridIcon,
  LayoutTableIcon,
  ListIcon,
  StarIcon,
} from '@acronis-platform/icons-react/stroke-mono';

export function ToggleGroupDemo() {
  return (
    <div className="flex flex-col items-start gap-6">
      <ToggleGroup defaultValue={['grid']} aria-label="View mode">
        <ToggleGroupItem value="grid" aria-label="Grid view">
          <LayoutGridIcon size={16} />
        </ToggleGroupItem>
        <ToggleGroupItem value="table" aria-label="Table view">
          <LayoutTableIcon size={16} />
        </ToggleGroupItem>
        <ToggleGroupItem value="list" aria-label="List view">
          <ListIcon size={16} />
        </ToggleGroupItem>
      </ToggleGroup>
      <Toggle defaultPressed aria-label="Favorite">
        <StarIcon size={16} />
        Favorite
      </Toggle>
    </div>
  );
}
