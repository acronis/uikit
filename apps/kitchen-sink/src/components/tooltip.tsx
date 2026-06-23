import {
  Button,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@acronis-platform/ui-react';

import { SpecimenPage, Subsection } from '@/lib/specimen';

const SIDES = ['top', 'right', 'bottom', 'left'] as const;

export function TooltipSpecimen() {
  return (
    <SpecimenPage
      title="Tooltip"
      description="A small popover label shown on hover/focus. Each example is pinned open to show the container and its placement on every side."
    >
      <Subsection title="Sides (open)">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 16,
          }}
        >
          {SIDES.map((side) => (
            <div
              key={side}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: 130,
                borderRadius: 8,
                border: '1px solid var(--ui-border-on-surface-divider)',
                background: 'var(--ui-background-surface-secondary)',
              }}
            >
              <Tooltip defaultOpen>
                <TooltipTrigger
                  render={<Button variant="secondary">{side}</Button>}
                />
                <TooltipContent side={side}>Helpful hint</TooltipContent>
              </Tooltip>
            </div>
          ))}
        </div>
      </Subsection>
    </SpecimenPage>
  );
}
