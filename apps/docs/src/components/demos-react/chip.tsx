'use client';

import { useState } from 'react';
import { Button, Chip } from '@acronis-platform/ui-react';
import { CircleInfoIcon } from '@acronis-platform/icons-react/stroke-mono';

const row = {
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: 8,
} as const;

const APPLIED_FILTERS = [
  { id: 'status', label: 'Status: Active' },
  { id: 'type', label: 'Type: Workload' },
  { id: 'plan', label: 'Plan: Trial' },
];

export function ChipDemo() {
  const [filters, setFilters] = useState(APPLIED_FILTERS);
  const [onlyMine, setOnlyMine] = useState(true);
  const [needsAttention, setNeedsAttention] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* removable — applied filters the user can drop one by one */}
      <div style={row}>
        {filters.map((filter) => (
          <Chip
            key={filter.id}
            removeLabel={`Remove ${filter.label}`}
            onRemove={() =>
              setFilters((prev) => prev.filter((item) => item.id !== filter.id))
            }
          >
            {filter.label}
          </Chip>
        ))}
        {filters.length < APPLIED_FILTERS.length && (
          <Button variant="ghost" onClick={() => setFilters(APPLIED_FILTERS)}>
            Reset filters
          </Button>
        )}
      </div>

      {/* operational — an inline action sitting among the chips */}
      <div style={row}>
        {filters.map((filter) => (
          <Chip key={filter.id} variant="selectable">
            {filter.label}
          </Chip>
        ))}
        <Chip variant="operational" onClick={() => setFilters(APPLIED_FILTERS)}>
          Reset all
        </Chip>
      </div>

      {/* selectable — small toggles that own their pressed state */}
      <div style={row}>
        <Chip
          variant="selectable"
          selected={onlyMine}
          onClick={() => setOnlyMine((prev) => !prev)}
        >
          Only my devices
        </Chip>
        <Chip
          variant="selectable"
          selected={needsAttention}
          icon={<CircleInfoIcon size={16} />}
          onClick={() => setNeedsAttention((prev) => !prev)}
        >
          Needs attention
        </Chip>
      </div>
    </div>
  );
}
