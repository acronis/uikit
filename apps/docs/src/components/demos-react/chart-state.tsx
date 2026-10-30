'use client';

import { ChartState } from '@acronis-platform/ui-react';

const states = ['loading', 'empty', 'warning', 'error', 'number'] as const;

export function ChartStateDemo() {
  return (
    <div className="flex flex-wrap gap-4">
      {states.map((state) => (
        <div
          key={state}
          className="rounded-lg border border-border"
          style={{ height: 200, width: 260 }}
        >
          <ChartState
            state={state}
            description={
              state === 'warning'
                ? 'Data may be incomplete'
                : state === 'number'
                  ? '0 GB'
                  : undefined
            }
          />
        </div>
      ))}
    </div>
  );
}
