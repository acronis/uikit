'use client';

import {
  NumberField,
  NumberFieldDecrement,
  NumberFieldGroup,
  NumberFieldIncrement,
  NumberFieldInput,
} from '@acronis-platform/ui-react';

export function NumberFieldDemo() {
  return (
    <div style={{ width: 180 }}>
      <NumberField defaultValue={3} min={0} max={99}>
        <NumberFieldGroup>
          <NumberFieldDecrement aria-label="Decrease" />
          <NumberFieldInput aria-label="Quantity" />
          <NumberFieldIncrement aria-label="Increase" />
        </NumberFieldGroup>
      </NumberField>
    </div>
  );
}
