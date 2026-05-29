import * as React from 'react'
import {
  ChipBasic,
  ChipWithIcons,
  ChipRemovable,
  ChipWithIconsRemovable,
  ChipFilters,
} from '@acronis-platform/shadcn-uikit-demos/chip'
import { DemoWithCode } from './DemoWithCode'

// Import actual source code files as raw strings
import chipBasicCode from '../../../demos/src/chip/ChipBasic.tsx?raw'
import chipWithIconsCode from '../../../demos/src/chip/ChipWithIcons.tsx?raw'
import chipRemovableCode from '../../../demos/src/chip/ChipRemovable.tsx?raw'
import chipWithIconsRemovableCode from '../../../demos/src/chip/ChipWithIconsRemovable.tsx?raw'
import chipFiltersCode from '../../../demos/src/chip/ChipFilters.tsx?raw'

export function ChipDemo() {
  return (
    <section className="demo-section">
      <h2>Chip Component</h2>
      <p className="demo-description mb-8 text-muted-foreground">
        Used to represent a list of selected items. Chips are compact elements that represent an
        input, attribute, or action.
      </p>

      <div className="space-y-8">
        <DemoWithCode
          title="Basic Chips"
          description="Simple chips with text only."
          code={chipBasicCode}
        >
          <ChipBasic />
        </DemoWithCode>

        <DemoWithCode
          title="Chips with Icons"
          description="Chips with leading icons."
          code={chipWithIconsCode}
        >
          <ChipWithIcons />
        </DemoWithCode>

        <DemoWithCode
          title="Removable Chips"
          description="Chips with remove button. Click the X to remove."
          code={chipRemovableCode}
        >
          <ChipRemovable />
        </DemoWithCode>

        <DemoWithCode
          title="Chips with Icons and Remove"
          description="Chips with both icon and remove functionality."
          code={chipWithIconsRemovableCode}
        >
          <ChipWithIconsRemovable />
        </DemoWithCode>

        <DemoWithCode
          title="Filter Chips"
          description="Example of chips used as filters with remove functionality."
          code={chipFiltersCode}
        >
          <ChipFilters />
        </DemoWithCode>
      </div>
    </section>
  )
}
