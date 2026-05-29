import * as React from 'react'
import {
  FilterBasic,
  FilterWithCounter,
  FilterActiveState,
  FilterVariants,
  FilterInteractive,
  FilterWithDropdown,
  FilterMultipleGroups,
  FilterInToolbar,
  FilterDisabled,
} from '@acronis-platform/shadcn-uikit-demos/filter'
import { DemoWithCode } from './DemoWithCode'

// Import actual source code files as raw strings
import filterBasicCode from '../../../demos/src/filter/FilterBasic.tsx?raw'
import filterWithCounterCode from '../../../demos/src/filter/FilterWithCounter.tsx?raw'
import filterActiveStateCode from '../../../demos/src/filter/FilterActiveState.tsx?raw'
import filterVariantsCode from '../../../demos/src/filter/FilterVariants.tsx?raw'
import filterInteractiveCode from '../../../demos/src/filter/FilterInteractive.tsx?raw'
import filterWithDropdownCode from '../../../demos/src/filter/FilterWithDropdown.tsx?raw'
import filterMultipleGroupsCode from '../../../demos/src/filter/FilterMultipleGroups.tsx?raw'
import filterInToolbarCode from '../../../demos/src/filter/FilterInToolbar.tsx?raw'
import filterDisabledCode from '../../../demos/src/filter/FilterDisabled.tsx?raw'

export function FilterDemo() {
  return (
    <section className="demo-section">
      <h2>Filter Component</h2>
      <p className="demo-description mb-8 text-muted-foreground">
        A filter button component with optional counter badge for displaying active filter counts.
      </p>

      <div className="space-y-8">
        <DemoWithCode
          title="Basic Filter"
          description="Simple filter button with icon and text."
          code={filterBasicCode}
        >
          <FilterBasic />
        </DemoWithCode>

        <DemoWithCode
          title="Filter with Counter"
          description="Filter button showing the number of active filters."
          code={filterWithCounterCode}
        >
          <FilterWithCounter />
        </DemoWithCode>

        <DemoWithCode
          title="Active State"
          description="Filter button in active state with counter."
          code={filterActiveStateCode}
        >
          <FilterActiveState />
        </DemoWithCode>

        <DemoWithCode
          title="Different Variants"
          description="Filter button with different button variants."
          code={filterVariantsCode}
        >
          <FilterVariants />
        </DemoWithCode>

        <DemoWithCode
          title="Interactive Filter Example"
          description="Click filters to toggle them on/off and see the counter update."
          code={filterInteractiveCode}
        >
          <FilterInteractive />
        </DemoWithCode>

        <DemoWithCode
          title="Filter with Dropdown Menu"
          description="Filter button that opens a dropdown menu with filter options."
          code={filterWithDropdownCode}
        >
          <FilterWithDropdown />
        </DemoWithCode>

        <DemoWithCode
          title="Multiple Filter Groups"
          description="Multiple filter buttons working together with a total count."
          code={filterMultipleGroupsCode}
        >
          <FilterMultipleGroups />
        </DemoWithCode>

        <DemoWithCode
          title="Filter in Toolbar"
          description="Filter button as part of a toolbar with other actions."
          code={filterInToolbarCode}
        >
          <FilterInToolbar />
        </DemoWithCode>

        <DemoWithCode
          title="Disabled State"
          description="Filter button in disabled state."
          code={filterDisabledCode}
        >
          <FilterDisabled />
        </DemoWithCode>
      </div>
    </section>
  );
}
