import * as React from 'react'
import {
  SidebarFull,
  SidebarIconsOnly,
  SidebarWithBadges,
  SidebarWithSections,
} from '@acronis-platform/shadcn-uikit-demos/sidebar'
import { DemoWithCode } from './DemoWithCode'

// Import actual source code files as raw strings
import sidebarFullCode from '../../../demos/src/sidebar/SidebarFull.tsx?raw'
import sidebarIconsOnlyCode from '../../../demos/src/sidebar/SidebarIconsOnly.tsx?raw'
import sidebarWithBadgesCode from '../../../demos/src/sidebar/SidebarWithBadges.tsx?raw'
import sidebarWithSectionsCode from '../../../demos/src/sidebar/SidebarWithSections.tsx?raw'

export function SidebarDemo() {
  return (
    <section className="demo-section">
      <h2>Sidebar Component (NavMenu Primary)</h2>
      <p className="demo-description mb-8 text-muted-foreground">
        Used as the main navigation element in the interface. Each main item can have a second level
        of navigation to provide a more flexible navigation structure.
      </p>

      <div className="space-y-8">
        <DemoWithCode
          title="Full Sidebar Example"
          description="A complete sidebar with header, grouped navigation sections, badges, tags, and footer."
          code={sidebarFullCode}
        >
          <SidebarFull />
        </DemoWithCode>

        <DemoWithCode
          title="Sidebar with Icons Only"
          description="Compact sidebar showing only icons. Hover to see tooltips."
          code={sidebarIconsOnlyCode}
        >
          <SidebarIconsOnly />
        </DemoWithCode>

        <DemoWithCode
          title="Sidebar with Badges"
          description='Navigation items with counter badges and "NEW" tags.'
          code={sidebarWithBadgesCode}
        >
          <SidebarWithBadges />
        </DemoWithCode>

        <DemoWithCode
          title="Sidebar with Sections"
          description="Organized navigation with labeled sections."
          code={sidebarWithSectionsCode}
        >
          <SidebarWithSections />
        </DemoWithCode>
      </div>
    </section>
  );
}
