'use client';

import { useState } from 'react';
import { Chip } from '@acronis-platform/ui-react';
import { CircleInfoIcon } from '@acronis-platform/icons-react/stroke-mono';

const initialFilters = ['Status: Active', 'Location: EU', 'Type: Backup'];

export function ChipDemo() {
  const [filters, setFilters] = useState(initialFilters);
  const [onlyMine, setOnlyMine] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          flexWrap: 'wrap',
        }}
      >
        {filters.map((filter) => (
          <Chip
            key={filter}
            removeLabel={`Remove ${filter}`}
            onRemove={() => setFilters(filters.filter((f) => f !== filter))}
          >
            {filter}
          </Chip>
        ))}
        {filters.length === 0 && (
          <Chip variant="selectable" onClick={() => setFilters(initialFilters)}>
            Reset filters
          </Chip>
        )}
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          flexWrap: 'wrap',
        }}
      >
        <Chip
          variant="selectable"
          selected={onlyMine}
          onClick={() => setOnlyMine(!onlyMine)}
        >
          Only my devices
        </Chip>
        <Chip variant="selectable" icon={<CircleInfoIcon />}>
          With icon
        </Chip>
      </div>
    </div>
  );
}
