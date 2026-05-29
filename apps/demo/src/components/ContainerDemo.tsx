import * as React from 'react'
import { ContainerResponsive } from '@acronis-platform/shadcn-uikit-demos/container'
import { DemoWithCode } from './DemoWithCode'

// Import actual source code files as raw strings
import containerResponsiveCode from '../../../demos/src/container/ContainerResponsive.tsx?raw'

export function ContainerDemo() {
  return (
    <section className="demo-section">
      <h2>Container Component</h2>
      <p className="demo-description mb-8 text-muted-foreground">
        Responsive container with adaptive max-width and padding across different breakpoints.
      </p>

      <div className="space-y-8">
        <DemoWithCode
          title="Responsive Container"
          description="Interactive demo showing how the container adapts to different screen sizes. Resize your browser to see the responsive behavior."
          code={containerResponsiveCode}
        >
          <ContainerResponsive />
        </DemoWithCode>
      </div>
    </section>
  );
}
