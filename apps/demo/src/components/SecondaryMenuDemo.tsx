import * as React from 'react'
import {
  SecondaryMenuBasic,
  SecondaryMenuWithIcons,
  SecondaryMenuWithGroups,
  SecondaryMenuWithTags,
  SecondaryMenuWithRightIcons,
  SecondaryMenuWithDisabled,
  SecondaryMenuComplete,
  SecondaryMenuSpecs,
} from '@acronis-platform/shadcn-uikit-demos/secondary-menu'
import { DemoWithCode } from './DemoWithCode'

// Import actual source code files as raw strings
import secondaryMenuBasicCode from '../../../demos/src/secondary-menu/SecondaryMenuBasic.tsx?raw'
import secondaryMenuWithIconsCode from '../../../demos/src/secondary-menu/SecondaryMenuWithIcons.tsx?raw'
import secondaryMenuWithGroupsCode from '../../../demos/src/secondary-menu/SecondaryMenuWithGroups.tsx?raw'
import secondaryMenuWithTagsCode from '../../../demos/src/secondary-menu/SecondaryMenuWithTags.tsx?raw'
import secondaryMenuWithRightIconsCode from '../../../demos/src/secondary-menu/SecondaryMenuWithRightIcons.tsx?raw'
import secondaryMenuWithDisabledCode from '../../../demos/src/secondary-menu/SecondaryMenuWithDisabled.tsx?raw'
import secondaryMenuCompleteCode from '../../../demos/src/secondary-menu/SecondaryMenuComplete.tsx?raw'
import secondaryMenuSpecsCode from '../../../demos/src/secondary-menu/SecondaryMenuSpecs.tsx?raw'

export function SecondaryMenuDemo() {
  return (
    <section className="demo-section">
      <h2>Secondary Menu Component</h2>
      <p className="demo-description mb-8 text-muted-foreground">
        A tertiary navigation menu component designed to work alongside the main sidebar. Can be used
        for sub-navigation, filtering, or organizing content into categories. Based on Acronis Design
        System specifications from Figma.
      </p>

      <div className="space-y-8">
        <DemoWithCode
          title="Basic Menu"
          description="Simple menu with basic items and active state."
          code={secondaryMenuBasicCode}
        >
          <SecondaryMenuBasic />
        </DemoWithCode>

        <DemoWithCode
          title="Menu with Icons"
          description="Menu items with left-aligned icons for visual context."
          code={secondaryMenuWithIconsCode}
        >
          <SecondaryMenuWithIcons />
        </DemoWithCode>

        <DemoWithCode
          title="Menu with Groups"
          description="Organized menu with titled groups and dividers."
          code={secondaryMenuWithGroupsCode}
        >
          <SecondaryMenuWithGroups />
        </DemoWithCode>

        <DemoWithCode
          title="Menu with Tags"
          description="Menu items with tags to highlight new or important features."
          code={secondaryMenuWithTagsCode}
        >
          <SecondaryMenuWithTags />
        </DemoWithCode>

        <DemoWithCode
          title="Menu with Right Icons"
          description="Menu items with right-aligned icons for navigation indicators."
          code={secondaryMenuWithRightIconsCode}
        >
          <SecondaryMenuWithRightIcons />
        </DemoWithCode>

        <DemoWithCode
          title="Menu with Disabled Items"
          description="Menu with some items in disabled state."
          code={secondaryMenuWithDisabledCode}
        >
          <SecondaryMenuWithDisabled />
        </DemoWithCode>

        <DemoWithCode
          title="Complete Menu with Header & Footer"
          description="Full-featured menu with header, content groups, and footer."
          code={secondaryMenuCompleteCode}
        >
          <SecondaryMenuComplete />
        </DemoWithCode>

        <DemoWithCode
          title="Design Specifications"
          description="Key design tokens and specifications from Figma."
          code={secondaryMenuSpecsCode}
        >
          <SecondaryMenuSpecs />
        </DemoWithCode>
      </div>
    </section>
  );
}
