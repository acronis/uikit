'use client';

import { TrendIndicator } from '@acronis-platform/ui-react';

export function TrendIndicatorDemo() {
  return (
    <div className="flex flex-col gap-2">
      <TrendIndicator
        direction="up"
        sentiment="positive"
        value="8%"
        comparisonLabel="revenue QoQ"
      />
      <TrendIndicator
        direction="up"
        sentiment="negative"
        value="35%"
        comparisonLabel="threats this quarter"
      />
      <TrendIndicator
        direction="down"
        sentiment="positive"
        value="1.4 h"
        comparisonLabel="MTTR over 6 months"
      />
      <TrendIndicator
        direction="flat"
        sentiment="neutral"
        value="Stable"
        comparisonLabel="ticket volume"
      />
      <div className="flex items-center gap-2">
        <TrendIndicator variant="badge" direction="up" sentiment="positive" value="12%" />
        <TrendIndicator variant="badge" direction="down" sentiment="negative" value="8%" />
        <TrendIndicator variant="badge" direction="flat" sentiment="neutral" value="0%" />
      </div>
    </div>
  );
}
