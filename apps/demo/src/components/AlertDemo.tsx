import * as React from 'react'
import { AlertVariants } from '@acronis-platform/shadcn-uikit-demos/alert'
import { DemoWithCode } from './DemoWithCode'

// Import actual source code files as raw strings
import alertVariantsCode from '../../../demos/src/alert/AlertVariants.tsx?raw'

export function AlertDemo() {
  return (
    <section className="demo-section">
      <h2>Alert Component</h2>
      <p className="demo-description mb-8 text-muted-foreground">
        Alert component for displaying important messages with different severity levels and icons.
      </p>

      <div className="space-y-8">
        <DemoWithCode
          title="Alert Variants"
          description="Different alert styles for various message types: AI, neutral, success, warning, critical, destructive, and info."
          code={alertVariantsCode}
        >
          <AlertVariants />
        </DemoWithCode>
      </div>
    </section>
  )
}
