import { SearchGlobal } from '@acronis-platform/ui-react';

import {
  Forced,
  SampleRow,
  SpecimenPage,
  StateGrid,
  Subsection,
  type ForceState,
} from '@/lib/specimen';

const STATES = [
  { key: 'idle', label: 'Default' },
  { key: 'hover', label: 'Hover' },
  { key: 'active', label: 'Active' },
] as const;

function cell(state: string) {
  return (
    <Forced tier="search-global" state={state as ForceState}>
      <SearchGlobal />
    </Forced>
  );
}

export function SearchGlobalSpecimen() {
  return (
    <SpecimenPage
      title="SearchGlobal"
      description="A global search field with gradient border and optional shortcut hint."
    >
      <Subsection title="States">
        <StateGrid
          rows={[{ key: 'global', label: 'Field' }]}
          columns={[...STATES]}
          renderCell={(_, state) => cell(state)}
          rowHeaderWidth={96}
        />
      </Subsection>

      <Subsection title="Content variations">
        <SampleRow>
          <SearchGlobal defaultValue="backup policy" />
          <SearchGlobal shortcut="/" placeholder="Search the platform" />
          <SearchGlobal shortcut={null} />
        </SampleRow>
      </Subsection>
    </SpecimenPage>
  );
}
