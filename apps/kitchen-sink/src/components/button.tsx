import type { ReactNode } from 'react';
import { Button } from '@acronis-platform/ui-react';
import { PlusIcon } from '@acronis-platform/icons-react/stroke-mono';

import {
  Forced,
  SampleRow,
  SpecimenPage,
  StateGrid,
  Subsection,
  type ForceState,
  type GridAxis,
} from '@/lib/specimen';

// Button variant prop → display label. `default` is the Figma "Primary" style.
const VARIANTS: GridAxis[] = [
  { key: 'default', label: 'Primary' },
  { key: 'secondary', label: 'Secondary' },
  { key: 'ghost', label: 'Ghost' },
  { key: 'destructive', label: 'Destructive' },
  { key: 'ai', label: 'AI' },
  { key: 'inverted', label: 'Inverted' },
];

const STATES: GridAxis[] = [
  { key: 'idle', label: 'Default' },
  { key: 'hover', label: 'Hover' },
  { key: 'active', label: 'Active' },
  { key: 'focus', label: 'Focus' },
  { key: 'disabled', label: 'Disabled' },
];

// The `inverted` variant is designed for dark/inverted surfaces, so its cells
// would be near-invisible on the light canvas — drop it onto an inverted swatch.
function CellCanvas({ variant, children }: { variant: string; children: ReactNode }) {
  if (variant !== 'inverted') return <>{children}</>;
  return (
    <div
      style={{
        display: 'inline-flex',
        padding: 12,
        borderRadius: 8,
        background: 'var(--ui-background-inverted-primary)',
      }}
    >
      {children}
    </div>
  );
}

function cell(variant: string, state: string) {
  const s = state as ForceState;
  const variantProp = variant as
    | 'default'
    | 'secondary'
    | 'ghost'
    | 'destructive'
    | 'ai'
    | 'inverted';
  return (
    <CellCanvas variant={variant}>
      <Forced tier="button" state={s}>
        <Button variant={variantProp} disabled={s === 'disabled'}>
          Label
        </Button>
      </Forced>
    </CellCanvas>
  );
}

export function ButtonSpecimen() {
  return (
    <SpecimenPage
      title="Button"
      description="Text button with six variants. Each cell pins the variant to a state by remapping its --ui-button-* idle tokens to the matching state stop, so hover / active / focus render statically."
    >
      <Subsection title="Variants × states">
        <StateGrid rows={VARIANTS} columns={STATES} renderCell={cell} />
      </Subsection>

      <Subsection title="With icon" description="Leading icon at 16px before the label.">
        <SampleRow>
          <Button>
            <PlusIcon /> Add item
          </Button>
          <Button variant="secondary">
            <PlusIcon /> Add item
          </Button>
          <Button variant="ghost">
            <PlusIcon /> Add item
          </Button>
        </SampleRow>
      </Subsection>
    </SpecimenPage>
  );
}
