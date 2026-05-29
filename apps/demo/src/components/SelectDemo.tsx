import * as React from 'react'
import {
  BasicSelect,
  ControlledSelect,
  GroupedSelect,
  MultipleSelect,
  ObjectValuesSelect,
  DisabledSelect,
  FormattedValueSelect,
  ScrollableSelect,
} from '@acronis-platform/shadcn-uikit-demos/select'
import { DemoWithCode } from './DemoWithCode'

// Import actual source code files as raw strings
import basicSelectCode from '../../../demos/src/select/BasicSelect.tsx?raw'
import controlledSelectCode from '../../../demos/src/select/ControlledSelect.tsx?raw'
import groupedSelectCode from '../../../demos/src/select/GroupedSelect.tsx?raw'
import multipleSelectCode from '../../../demos/src/select/MultipleSelect.tsx?raw'
import objectValuesSelectCode from '../../../demos/src/select/ObjectValuesSelect.tsx?raw'
import disabledSelectCode from '../../../demos/src/select/DisabledSelect.tsx?raw'
import formattedValueSelectCode from '../../../demos/src/select/FormattedValueSelect.tsx?raw'
import scrollableSelectCode from '../../../demos/src/select/ScrollableSelect.tsx?raw'

export function SelectDemo() {
  return (
    <section className="demo-section">
      <h2>Select Component (Base UI)</h2>
      <p className="demo-description mb-8 text-muted-foreground">
        Select component built with MUI Base UI.
        Provides accessible, unstyled primitives with full Tailwind CSS styling support.
        Features include controlled/uncontrolled state, multiple selection, object values, grouping, and custom formatting.
      </p>

      <div className="space-y-8">
        <DemoWithCode
          title="Basic Select"
          description="Simple select dropdown with predefined options."
          code={basicSelectCode}
        >
          <BasicSelect />
        </DemoWithCode>

        <DemoWithCode
          title="Controlled Select"
          description="Select with controlled state using React state management."
          code={controlledSelectCode}
        >
          <ControlledSelect />
        </DemoWithCode>

        <DemoWithCode
          title="Grouped Options"
          description="Select with options organized into labeled groups."
          code={groupedSelectCode}
        >
          <GroupedSelect />
        </DemoWithCode>

        <DemoWithCode
          title="Multiple Selection"
          description="Select multiple values from the list. Uses array-based value state."
          code={multipleSelectCode}
        >
          <MultipleSelect />
        </DemoWithCode>

        <DemoWithCode
          title="Object Values"
          description="Select with complex object values. Demonstrates custom equality comparison and string conversion functions."
          code={objectValuesSelectCode}
        >
          <ObjectValuesSelect />
        </DemoWithCode>

        <DemoWithCode
          title="Disabled States"
          description="Examples of disabled select and individual disabled options."
          code={disabledSelectCode}
        >
          <DisabledSelect />
        </DemoWithCode>

        <DemoWithCode
          title="Formatted Value Display"
          description="Custom rendering of selected values with icons and formatting."
          code={formattedValueSelectCode}
        >
          <FormattedValueSelect />
        </DemoWithCode>

        <DemoWithCode
          title="Scrollable List"
          description="Select with a long list of options demonstrating scroll behavior and keyboard navigation."
          code={scrollableSelectCode}
        >
          <ScrollableSelect />
        </DemoWithCode>
      </div>

      <div className="mt-8 p-4 rounded-lg bg-muted/50">
        <h4 className="font-semibold mb-2">Key Features</h4>
        <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
          <li>Built on MUI Base UI primitives for maximum accessibility</li>
          <li>Full keyboard navigation support (Arrow keys, Enter, Escape, Home, End)</li>
          <li>Typeahead functionality for quick item selection</li>
          <li>Supports single and multiple selection modes</li>
          <li>Object values with custom comparison and formatting</li>
          <li>Grouped options with labels</li>
          <li>Customizable positioning and alignment</li>
          <li>Fully styled with Tailwind CSS</li>
        </ul>
      </div>
    </section>
  )
}
