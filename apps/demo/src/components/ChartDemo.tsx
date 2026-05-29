import * as React from 'react'
import { ChartAll } from '@acronis-platform/shadcn-uikit-demos/chart'
import { DemoWithCode } from './DemoWithCode'

// Import actual source code files as raw strings
import chartAllCode from '../../../demos/src/chart/ChartAll.tsx?raw'

export function ChartDemo() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h2 className="text-2xl font-bold">Charts</h2>
        <p className="text-muted-foreground">
          Beautiful and interactive charts built with Recharts
        </p>
      </div>

      <DemoWithCode
        title="All Chart Types"
        description="Comprehensive chart showcase including Line, Area, Bar, Pie, Radial Bar, Scatter, Composed, and Treemap charts."
        code={chartAllCode}
      >
        <ChartAll />
      </DemoWithCode>
    </div>
  );
}
