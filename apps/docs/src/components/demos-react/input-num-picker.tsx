'use client';

import * as React from 'react';
import { InputNumPicker } from '@acronis-platform/ui-react';

export function InputNumPickerDemo() {
  const [seats, setSeats] = React.useState<number | null>(3);

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
      <InputNumPicker label="Quantity" defaultValue={1} min={0} max={10} />
      <InputNumPicker label="Required field" required defaultValue={0} />
      <InputNumPicker
        label="Seats"
        value={seats}
        onValueChange={setSeats}
        min={1}
        max={20}
      />
      <InputNumPicker label="Disabled" disabled defaultValue={5} />
    </div>
  );
}
