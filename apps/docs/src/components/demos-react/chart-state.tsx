'use client';

import { Button, ChartState } from '@acronis-platform/ui-react';

const states = ['loading', 'empty', 'error'] as const;

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
            action={
              state === 'error' ? (
                <Button variant="ghost">Try again</Button>
              ) : undefined
            }
          />
        </div>
      ))}
    </div>
  );
}
