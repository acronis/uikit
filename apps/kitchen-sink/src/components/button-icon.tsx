import { ButtonIcon } from '@acronis-platform/ui-react';
import {
  BinIcon,
  EllipsisIcon,
  PlusIcon,
} from '@acronis-platform/icons-react/stroke-mono';

import {
  Forced,
  SampleRow,
  SpecimenPage,
  StateGrid,
  Subsection,
  type ForceState,
  type GridAxis,
} from '@/lib/specimen';

const VARIANTS: GridAxis[] = [
  { key: 'ghost', label: 'Ghost' },
  { key: 'secondary', label: 'Secondary' },
];

const STATES: GridAxis[] = [
  { key: 'idle', label: 'Default' },
  { key: 'hover', label: 'Hover' },
  { key: 'active', label: 'Active' },
  { key: 'focus', label: 'Focus' },
  { key: 'disabled', label: 'Disabled' },
];

function cell(variant: string, state: string) {
  const s = state as ForceState;
  return (
    <Forced tier="button-icon" state={s}>
      <ButtonIcon
        variant={variant as 'ghost' | 'secondary'}
        aria-label="Add"
        disabled={s === 'disabled'}
      >
        <PlusIcon />
      </ButtonIcon>
    </Forced>
  );
}

export function ButtonIconSpecimen() {
  return (
    <SpecimenPage
      title="ButtonIcon"
      description="Icon-only button (square 32px box, 16px glyph) with ghost and secondary variants. Container fill + glyph color are shared across variants; secondary adds a 1px border."
    >
      <Subsection title="Variants × states">
        <StateGrid rows={VARIANTS} columns={STATES} renderCell={cell} />
      </Subsection>

      <Subsection title="Glyphs">
        <SampleRow>
          <ButtonIcon aria-label="Add">
            <PlusIcon />
          </ButtonIcon>
          <ButtonIcon aria-label="More">
            <EllipsisIcon />
          </ButtonIcon>
          <ButtonIcon variant="secondary" aria-label="Delete">
            <BinIcon />
          </ButtonIcon>
        </SampleRow>
      </Subsection>
    </SpecimenPage>
  );
}
