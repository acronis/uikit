'use client';

import { TrendIndicator } from '@acronis-platform/ui-react';

export function TrendIndicatorDemo() {
  return (
    <div className="flex flex-col gap-2">
      <TrendIndicator
        direction="up"
        sentiment="positive"
        value="8%"
      />
      <TrendIndicator
        direction="up"
        sentiment="negative"
        value="35%"
      />
      <TrendIndicator
        direction="down"
        sentiment="positive"
        value="1.4 h"
      />
      <TrendIndicator
        direction="flat"
        sentiment="neutral"
        value="Stable"
      />
    </div>
  );
}
