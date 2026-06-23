import { ButtonDropdown } from '@acronis-platform/ui-react';

import {
  Forced,
  SpecimenPage,
  StateGrid,
  Subsection,
  type ForceState,
  type GridAxis,
} from '@/lib/specimen';

const VARIANTS: GridAxis[] = [
  { key: 'primary', label: 'Primary' },
  { key: 'secondary', label: 'Secondary' },
];

// `open` is the Figma "active" state (chevron flips up, container takes its
// active colors); it's a real prop, so that column renders it directly.
const STATES: GridAxis[] = [
  { key: 'idle', label: 'Default' },
  { key: 'hover', label: 'Hover' },
  { key: 'open', label: 'Open' },
  { key: 'focus', label: 'Focus' },
  { key: 'disabled', label: 'Disabled' },
];

function cell(variant: string, state: string) {
  const v = variant as 'primary' | 'secondary';
  if (state === 'open') {
    return (
      <ButtonDropdown variant={v} open>
        Actions
      </ButtonDropdown>
    );
  }
  return (
    <Forced tier="button-menu" state={state as ForceState}>
      <ButtonDropdown variant={v} disabled={state === 'disabled'}>
        Actions
      </ButtonDropdown>
    </Forced>
  );
}

export function ButtonDropdownSpecimen() {
  return (
    <SpecimenPage
      title="ButtonDropdown"
      description="A Button-like trigger (label + trailing chevron) that opens a menu. Primary and secondary variants; the chevron flips up and the container takes its active treatment while open."
    >
      <Subsection title="Variants × states">
        <StateGrid rows={VARIANTS} columns={STATES} renderCell={cell} />
      </Subsection>
    </SpecimenPage>
  );
}
