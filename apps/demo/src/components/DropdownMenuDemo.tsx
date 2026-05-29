import * as React from 'react'
import {
  DropdownMenuBasic,
  DropdownMenuWithLabels,
  DropdownMenuWithCheckboxes,
  DropdownMenuWithRadio,
  DropdownMenuWithSubmenu,
  DropdownMenuVariants,
  DropdownMenuWithSearch,
  DropdownMenuWithIcons,
  DropdownMenuMultipleSections,
  DropdownMenuDisabled,
  DropdownMenuAlignments,
  DropdownMenuComplex,
} from '@acronis-platform/shadcn-uikit-demos/dropdown-menu'
import { DemoWithCode } from './DemoWithCode'

// Import actual source code files as raw strings
import dropdownMenuBasicCode from '../../../demos/src/dropdown-menu/DropdownMenuBasic.tsx?raw'
import dropdownMenuWithLabelsCode from '../../../demos/src/dropdown-menu/DropdownMenuWithLabels.tsx?raw'
import dropdownMenuWithCheckboxesCode from '../../../demos/src/dropdown-menu/DropdownMenuWithCheckboxes.tsx?raw'
import dropdownMenuWithRadioCode from '../../../demos/src/dropdown-menu/DropdownMenuWithRadio.tsx?raw'
import dropdownMenuWithSubmenuCode from '../../../demos/src/dropdown-menu/DropdownMenuWithSubmenu.tsx?raw'
import dropdownMenuVariantsCode from '../../../demos/src/dropdown-menu/DropdownMenuVariants.tsx?raw'
import dropdownMenuWithSearchCode from '../../../demos/src/dropdown-menu/DropdownMenuWithSearch.tsx?raw'
import dropdownMenuWithIconsCode from '../../../demos/src/dropdown-menu/DropdownMenuWithIcons.tsx?raw'
import dropdownMenuMultipleSectionsCode from '../../../demos/src/dropdown-menu/DropdownMenuMultipleSections.tsx?raw'
import dropdownMenuDisabledCode from '../../../demos/src/dropdown-menu/DropdownMenuDisabled.tsx?raw'
import dropdownMenuAlignmentsCode from '../../../demos/src/dropdown-menu/DropdownMenuAlignments.tsx?raw'
import dropdownMenuComplexCode from '../../../demos/src/dropdown-menu/DropdownMenuComplex.tsx?raw'

export function DropdownMenuDemo() {
  return (
    <section className="demo-section">
      <h2>Dropdown Menu Component</h2>
      <p className="demo-description mb-8 text-muted-foreground">
        Used as a list of options from which a user can select one option or several. A selected
        option can represent a value in a form or can be used as an action.
      </p>

      <div className="space-y-8">
        <DemoWithCode
          title="Basic Dropdown"
          description="Simple dropdown menu with icons and actions."
          code={dropdownMenuBasicCode}
        >
          <DropdownMenuBasic />
        </DemoWithCode>

        <DemoWithCode
          title="With Labels"
          description="Dropdown menu with labels and keyboard shortcuts."
          code={dropdownMenuWithLabelsCode}
        >
          <DropdownMenuWithLabels />
        </DemoWithCode>

        <DemoWithCode
          title="With Checkboxes"
          description="Dropdown menu with checkbox items for multiple selections."
          code={dropdownMenuWithCheckboxesCode}
        >
          <DropdownMenuWithCheckboxes />
        </DemoWithCode>

        <DemoWithCode
          title="With Radio Group"
          description="Dropdown menu with radio group for single selection."
          code={dropdownMenuWithRadioCode}
        >
          <DropdownMenuWithRadio />
        </DemoWithCode>

        <DemoWithCode
          title="With Submenu"
          description="Dropdown menu with nested submenu items."
          code={dropdownMenuWithSubmenuCode}
        >
          <DropdownMenuWithSubmenu />
        </DemoWithCode>

        <DemoWithCode
          title="Different Variants"
          description="Dropdown menus with different button variants."
          code={dropdownMenuVariantsCode}
        >
          <DropdownMenuVariants />
        </DemoWithCode>

        <DemoWithCode
          title="With Search"
          description="Dropdown with search functionality to filter items."
          code={dropdownMenuWithSearchCode}
        >
          <DropdownMenuWithSearch />
        </DemoWithCode>

        <DemoWithCode
          title="With Icons and Actions"
          description="Dropdown menu with icons for each action."
          code={dropdownMenuWithIconsCode}
        >
          <DropdownMenuWithIcons />
        </DemoWithCode>

        <DemoWithCode
          title="With Title and Multiple Sections"
          description="Organized dropdown with title and grouped sections."
          code={dropdownMenuMultipleSectionsCode}
        >
          <DropdownMenuMultipleSections />
        </DemoWithCode>

        <DemoWithCode
          title="Disabled Items"
          description="Dropdown with some items disabled."
          code={dropdownMenuDisabledCode}
        >
          <DropdownMenuDisabled />
        </DemoWithCode>

        <DemoWithCode
          title="Alignment Options"
          description="Dropdown menus with different alignment options."
          code={dropdownMenuAlignmentsCode}
        >
          <DropdownMenuAlignments />
        </DemoWithCode>

        <DemoWithCode
          title="Complex Menu with All Features"
          description="Comprehensive dropdown combining multiple features."
          code={dropdownMenuComplexCode}
        >
          <DropdownMenuComplex />
        </DemoWithCode>
      </div>
    </section>
  );
}
