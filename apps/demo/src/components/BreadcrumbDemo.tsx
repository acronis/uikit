import * as React from 'react'
import {
  BreadcrumbBasic,
  BreadcrumbWithIcons,
  BreadcrumbWithEllipsis,
  BreadcrumbIconsEllipsis,
} from '@acronis-platform/shadcn-uikit-demos/breadcrumb'
import { DemoWithCode } from './DemoWithCode'

// Import actual source code files as raw strings
import breadcrumbBasicCode from '../../../demos/src/breadcrumb/BreadcrumbBasic.tsx?raw'
import breadcrumbWithIconsCode from '../../../demos/src/breadcrumb/BreadcrumbWithIcons.tsx?raw'
import breadcrumbWithEllipsisCode from '../../../demos/src/breadcrumb/BreadcrumbEllipsis.tsx?raw'
import breadcrumbIconsEllipsisCode from '../../../demos/src/breadcrumb/BreadcrumbIconsEllipsis.tsx?raw'

export function BreadcrumbDemo() {
  return (
    <section className="demo-section">
      <h2>Breadcrumb Component</h2>
      <p className="demo-description mb-8 text-muted-foreground">
        Used to help the user to see the entire path from the parent section to the section where
        the user is currently located with the possibility to navigate to any level back.
      </p>

      <div className="space-y-8">
        <DemoWithCode
          title="Basic Breadcrumb"
          description="Simple breadcrumb navigation showing the path hierarchy."
          code={breadcrumbBasicCode}
        >
          <BreadcrumbBasic />
        </DemoWithCode>

        <DemoWithCode
          title="With Icons"
          description="Breadcrumb with icons for better visual hierarchy."
          code={breadcrumbWithIconsCode}
        >
          <BreadcrumbWithIcons />
        </DemoWithCode>

        <DemoWithCode
          title="With Ellipsis (Collapsed)"
          description="Breadcrumb with ellipsis to collapse middle items."
          code={breadcrumbWithEllipsisCode}
        >
          <BreadcrumbWithEllipsis />
        </DemoWithCode>

        <DemoWithCode
          title="With Icons and Ellipsis"
          description="Breadcrumb combining icons and ellipsis for long paths."
          code={breadcrumbIconsEllipsisCode}
        >
          <BreadcrumbIconsEllipsis />
        </DemoWithCode>
      </div>
    </section>
  )
}
