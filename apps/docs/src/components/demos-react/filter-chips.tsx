'use client';

import { useState } from 'react';
import {
  Chip,
  FilterChips,
  FilterChipsList,
  FilterChipsReset,
} from '@acronis-platform/ui-react';
import {
  ServerIcon,
  ShieldCheckIcon,
  TagIcon,
} from '@acronis-platform/icons-react/stroke-mono';

const INITIAL = [
  { id: 'type', label: 'Type: Server', icon: <ServerIcon /> },
  { id: 'status', label: 'Status: Protected', icon: <ShieldCheckIcon /> },
  { id: 'plan', label: 'Plan: Daily backup', icon: <TagIcon /> },
];

export function FilterChipsDemo() {
  const [applied, setApplied] = useState(INITIAL);

  if (applied.length === 0) {
    return (
      <button
        type="button"
        className="text-sm underline"
        onClick={() => setApplied(INITIAL)}
      >
        No filters applied — restore the sample filters
      </button>
    );
  }

  return (
    <FilterChips>
      <FilterChipsList>
        {applied.map((filter) => (
          <Chip
            key={filter.id}
            icon={filter.icon}
            removeLabel={`Remove ${filter.id} filter`}
            onRemove={() =>
              setApplied((current) =>
                current.filter((entry) => entry.id !== filter.id)
              )
            }
          >
            {filter.label}
          </Chip>
        ))}
        <FilterChipsReset onClick={() => setApplied([])} />
      </FilterChipsList>
    </FilterChips>
  );
}
