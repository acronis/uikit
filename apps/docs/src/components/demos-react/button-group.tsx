'use client';

import { useState } from 'react';
import { ButtonGroup, ButtonGroupItem } from '@acronis-platform/ui-react';
import {
  LayoutGridIcon,
  LayoutTableIcon,
  ListIcon,
  MagnifierMinusIcon,
  MagnifierPlusIcon,
} from '@acronis-platform/icons-react/stroke-mono';

const views = [
  { id: 'list', label: 'List view', Icon: ListIcon },
  { id: 'grid', label: 'Grid view', Icon: LayoutGridIcon },
  { id: 'table', label: 'Table view', Icon: LayoutTableIcon },
] as const;

export function ButtonGroupDemo() {
  const [view, setView] = useState<string>('list');
  const [zoom, setZoom] = useState(100);

  return (
    <div className="flex flex-col items-start gap-4">
      <ButtonGroup aria-label="View mode">
        {views.map(({ id, label, Icon }) => (
          <ButtonGroupItem
            key={id}
            aria-label={label}
            onClick={() => setView(id)}
          >
            <Icon size={16} />
          </ButtonGroupItem>
        ))}
      </ButtonGroup>
      <p className="text-sm">
        Selected view: <strong>{view}</strong>
      </p>

      <ButtonGroup aria-label="Zoom">
        <ButtonGroupItem
          aria-label="Zoom out"
          onClick={() => setZoom((z) => Math.max(25, z - 25))}
        >
          <MagnifierMinusIcon size={16} />
        </ButtonGroupItem>
        <ButtonGroupItem
          aria-label="Zoom in"
          onClick={() => setZoom((z) => Math.min(400, z + 25))}
        >
          <MagnifierPlusIcon size={16} />
        </ButtonGroupItem>
      </ButtonGroup>
      <p className="text-sm">
        Zoom: <strong>{zoom}%</strong>
      </p>

      <ButtonGroup aria-label="View mode, with one action unavailable">
        <ButtonGroupItem aria-label="List view">
          <ListIcon size={16} />
        </ButtonGroupItem>
        <ButtonGroupItem aria-label="Grid view" disabled>
          <LayoutGridIcon size={16} />
        </ButtonGroupItem>
        <ButtonGroupItem aria-label="Table view">
          <LayoutTableIcon size={16} />
        </ButtonGroupItem>
      </ButtonGroup>
    </div>
  );
}
