import * as React from 'react'
import {
  NavigationMenuHorizontal,
  NavigationMenuSecondaryTab,
  NavigationMenuSimple,
  NavigationMenuWithIcons,
} from '@acronis-platform/shadcn-uikit-demos/navigation-menu'
import { DemoWithCode } from './DemoWithCode'

// Import actual source code files as raw strings
import navigationMenuHorizontalCode from '../../../demos/src/navigation-menu/NavigationMenuHorizontal.tsx?raw'
import navigationMenuSecondaryTabCode from '../../../demos/src/navigation-menu/NavigationMenuSecondaryTab.tsx?raw'
import navigationMenuSimpleCode from '../../../demos/src/navigation-menu/NavigationMenuSimple.tsx?raw'
import navigationMenuWithIconsCode from '../../../demos/src/navigation-menu/NavigationMenuWithIcons.tsx?raw'

export function NavigationMenuDemo() {
  return (
    <section className="demo-section">
      <h2>Navigation Menu Component</h2>
      <p className="demo-description mb-8 text-muted-foreground">
        Used as secondary navigation through the content of a particular section and cannot lead the
        user outside the parent section.
      </p>

      <div className="space-y-8">
        <DemoWithCode
          title="Horizontal Navigation Menu"
          description="A collection of links for navigating websites."
          code={navigationMenuHorizontalCode}
        >
          <NavigationMenuHorizontal />
        </DemoWithCode>

        <DemoWithCode
          title="Secondary Tab Navigation"
          description="Tab-style navigation with active indicator matching Figma design."
          code={navigationMenuSecondaryTabCode}
        >
          <NavigationMenuSecondaryTab />
        </DemoWithCode>

        <DemoWithCode
          title="Simple Tab Navigation"
          description="Basic tab navigation without counters."
          code={navigationMenuSimpleCode}
        >
          <NavigationMenuSimple />
        </DemoWithCode>

        <DemoWithCode
          title="Navigation with Icons"
          description="Tab navigation with icon indicators."
          code={navigationMenuWithIconsCode}
        >
          <NavigationMenuWithIcons />
        </DemoWithCode>
      </div>
    </section>
  );
}
