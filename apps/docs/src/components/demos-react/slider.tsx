'use client';

import { Slider } from '@acronis-platform/ui-react';

export function SliderDemo() {
  return (
    <div className="flex flex-col gap-8" style={{ width: 300 }}>
      <Slider defaultValue={40} aria-label="Volume" />
      <Slider defaultValue={[20, 80]} aria-label="Price range" />
    </div>
  );
}
