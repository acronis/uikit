'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@acronis-platform/ui-react';

const regions = {
  us: 'United States',
  eu: 'Europe',
  apac: 'Asia Pacific',
};

export function SelectDemo() {
  return (
    <div style={{ width: 256 }}>
      <Select items={regions} defaultValue="eu">
        <SelectTrigger aria-label="Region">
          <SelectValue placeholder="Select a region" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="us">United States</SelectItem>
          <SelectItem value="eu">Europe</SelectItem>
          <SelectItem value="apac">Asia Pacific</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
