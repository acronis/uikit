'use client';

import {
  InputSelect,
  InputSelectContent,
  InputSelectDescription,
  InputSelectField,
  InputSelectItem,
  InputSelectLabel,
  InputSelectTrigger,
  InputSelectValue,
} from '@acronis-platform/ui-react';

const regions = {
  us: 'United States',
  eu: 'Europe',
  apac: 'Asia Pacific',
};

export function InputSelectDemo() {
  return (
    <div style={{ width: 260 }}>
      <InputSelect items={regions} defaultValue="eu">
        <InputSelectField>
          <InputSelectLabel required>Region</InputSelectLabel>
          <InputSelectTrigger>
            <InputSelectValue placeholder="Select a region" />
          </InputSelectTrigger>
          <InputSelectDescription>Where workloads are stored.</InputSelectDescription>
        </InputSelectField>
        <InputSelectContent>
          <InputSelectItem value="us">United States</InputSelectItem>
          <InputSelectItem value="eu">Europe</InputSelectItem>
          <InputSelectItem value="apac">Asia Pacific</InputSelectItem>
        </InputSelectContent>
      </InputSelect>
    </div>
  );
}
