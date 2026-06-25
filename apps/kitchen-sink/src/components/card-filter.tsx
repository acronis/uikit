import { CircleInfoIcon } from '@acronis-platform/icons-react/stroke-mono';
import { CardFilter } from '@acronis-platform/ui-react';

import {
  Forced,
  SampleRow,
  SpecimenPage,
  StateGrid,
  Subsection,
  type ForceState,
  type GridAxis,
} from '@/lib/specimen';

const CLICKABLE_STATES: GridAxis[] = [
  { key: 'idle', label: 'Default' },
  { key: 'hover', label: 'Hover' },
  { key: 'active', label: 'Active' },
];

function clickableCell(state: string) {
  const s = state as ForceState;
  return (
    <Forced tier="card-filter" state={s}>
      <CardFilter
        variant="clickable"
        label="Active filters"
        value="3"
        icon={<CircleInfoIcon />}
      />
    </Forced>
  );
}

export function CardFilterSpecimen() {
  return (
    <SpecimenPage
      title="CardFilter"
      description="A compact stat/filter card with static, empty, and clickable variants."
    >
      <Subsection title="Variants">
        <SampleRow>
          <CardFilter label="Total assets" value="125" icon={<CircleInfoIcon />} />
          <CardFilter variant="static-empty" label="Pending" />
          <CardFilter variant="clickable" label="Active filters" value="3" icon={<CircleInfoIcon />} />
        </SampleRow>
      </Subsection>

      <Subsection title="Clickable states">
        <StateGrid
          rows={[{ key: 'clickable', label: 'Clickable' }]}
          columns={CLICKABLE_STATES}
          rowHeaderWidth={120}
          renderCell={(_, state) => clickableCell(state)}
        />
      </Subsection>
    </SpecimenPage>
  );
}
