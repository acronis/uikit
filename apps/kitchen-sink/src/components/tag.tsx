import { Tag } from '@acronis-platform/ui-react';
import { CircleCheckIcon } from '@acronis-platform/icons-react/stroke-mono';

import {
  SampleRow,
  SpecimenPage,
  StateGrid,
  Subsection,
  type GridAxis,
} from '@/lib/specimen';

type Variant =
  | 'info'
  | 'success'
  | 'warning'
  | 'critical'
  | 'danger'
  | 'neutral'
  | 'ai';

const VARIANTS: GridAxis[] = [
  { key: 'info', label: 'Info' },
  { key: 'success', label: 'Success' },
  { key: 'warning', label: 'Warning' },
  { key: 'critical', label: 'Critical' },
  { key: 'danger', label: 'Danger' },
  { key: 'neutral', label: 'Neutral' },
  { key: 'ai', label: 'AI' },
];

const SIZES: GridAxis[] = [
  { key: 'default', label: 'Default (24px)' },
  { key: 'sm', label: 'Small (20px)' },
];

function cell(variant: string, size: string) {
  return (
    <Tag variant={variant as Variant} size={size as 'default' | 'sm'}>
      {VARIANTS.find((v) => v.key === variant)?.label}
    </Tag>
  );
}

export function TagSpecimen() {
  return (
    <SpecimenPage
      title="Tag"
      description="A compact label for a status, category, or keyword. Each variant wires its own container fill, border, label, and icon color; size only changes the height."
    >
      <Subsection title="Variants × sizes">
        <StateGrid rows={VARIANTS} columns={SIZES} renderCell={cell} />
      </Subsection>

      <Subsection title="With icon">
        <SampleRow>
          <Tag variant="success" icon={<CircleCheckIcon />}>
            Active
          </Tag>
          <Tag variant="info" icon={<CircleCheckIcon />}>
            Verified
          </Tag>
        </SampleRow>
      </Subsection>
    </SpecimenPage>
  );
}
