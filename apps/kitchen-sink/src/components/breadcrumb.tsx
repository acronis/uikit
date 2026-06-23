import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@acronis-platform/ui-react';

import {
  Forced,
  SampleRow,
  SpecimenPage,
  StateGrid,
  Subsection,
  type ForceState,
  type GridAxis,
} from '@/lib/specimen';

const ROWS: GridAxis[] = [
  { key: 'link', label: 'Link' },
  { key: 'page', label: 'Current page' },
];

const STATES: GridAxis[] = [
  { key: 'idle', label: 'Default' },
  { key: 'hover', label: 'Hover' },
  { key: 'active', label: 'Active' },
];

function cell(row: string, state: string) {
  if (row === 'page') {
    // The current page is a static, non-interactive label — only the idle cell.
    if (state !== 'idle') return <span style={{ opacity: 0.35 }}>—</span>;
    return (
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>Workstation</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
  }
  return (
    <Forced tier="breadcrumb" state={state as ForceState}>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="#">Devices</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </Forced>
  );
}

export function BreadcrumbSpecimen() {
  return (
    <SpecimenPage
      title="Breadcrumb"
      description="A hierarchy trail of links ending in the current page. Links carry idle / hover / active label colors; the current page uses its own muted color."
    >
      <Subsection title="Item states">
        <StateGrid rows={ROWS} columns={STATES} renderCell={cell} />
      </Subsection>

      <Subsection title="Full trail">
        <SampleRow>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="#">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="#">Devices</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Workstation</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </SampleRow>
      </Subsection>
    </SpecimenPage>
  );
}
