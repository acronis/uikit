import { Link } from '@acronis-platform/ui-react';

import {
  Forced,
  SpecimenPage,
  StateGrid,
  Subsection,
  type ForceState,
  type GridAxis,
} from '@/lib/specimen';

const ROWS: GridAxis[] = [
  { key: 'regular', label: 'Regular' },
  { key: 'external', label: 'External icon' },
];

const STATES: GridAxis[] = [
  { key: 'idle', label: 'Default' },
  { key: 'hover', label: 'Hover' },
  { key: 'active', label: 'Active' },
  { key: 'disabled', label: 'Disabled' },
];

function cell(row: string, state: string) {
  const s = state as ForceState;
  return (
    <Forced tier="link" state={s}>
      <Link href="#" external={row === 'external'} disabled={s === 'disabled'}>
        Documentation
      </Link>
    </Forced>
  );
}

export function LinkSpecimen() {
  return (
    <SpecimenPage
      title="Link"
      description="Inline text links with optional trailing external icon."
    >
      <Subsection title="Variants × states">
        <StateGrid rows={ROWS} columns={STATES} renderCell={cell} rowHeaderWidth={120} />
      </Subsection>
    </SpecimenPage>
  );
}
