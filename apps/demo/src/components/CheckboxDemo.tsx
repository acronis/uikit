import * as React from 'react'
import {
  CheckboxBasic,
  CheckboxWithLabel,
  CheckboxWithDescription,
  CheckboxControlled,
  CheckboxIndeterminate,
  CheckboxDisabled,
  CheckboxParentChild,
  CheckboxForm,
  CheckboxMultipleSelection,
  CheckboxList,
  CheckboxStates,
} from '@acronis-platform/shadcn-uikit-demos/checkbox'
import { DemoWithCode } from './DemoWithCode'

// Import actual source code files as raw strings
import checkboxBasicCode from '../../../demos/src/checkbox/CheckboxBasic.tsx?raw'
import checkboxWithLabelCode from '../../../demos/src/checkbox/CheckboxWithLabel.tsx?raw'
import checkboxWithDescriptionCode from '../../../demos/src/checkbox/CheckboxWithDescription.tsx?raw'
import checkboxControlledCode from '../../../demos/src/checkbox/CheckboxControlled.tsx?raw'
import checkboxIndeterminateCode from '../../../demos/src/checkbox/CheckboxIndeterminate.tsx?raw'
import checkboxDisabledCode from '../../../demos/src/checkbox/CheckboxDisabled.tsx?raw'
import checkboxParentChildCode from '../../../demos/src/checkbox/CheckboxParentChild.tsx?raw'
import checkboxFormCode from '../../../demos/src/checkbox/CheckboxForm.tsx?raw'
import checkboxMultipleSelectionCode from '../../../demos/src/checkbox/CheckboxMultipleSelection.tsx?raw'
import checkboxListCode from '../../../demos/src/checkbox/CheckboxList.tsx?raw'
import checkboxStatesCode from '../../../demos/src/checkbox/CheckboxStates.tsx?raw'

export function CheckboxDemo() {
  return (
    <section className="demo-section">
      <h2>Checkbox Component</h2>
      <p className="demo-description mb-8 text-muted-foreground">
        A control that allows the user to toggle between checked and not checked states.
      </p>

      <div className="space-y-8">
        <DemoWithCode
          title="Basic Checkbox"
          description="Simple checkbox without label."
          code={checkboxBasicCode}
        >
          <CheckboxBasic />
        </DemoWithCode>

        <DemoWithCode
          title="With Label"
          description="Checkbox with associated label."
          code={checkboxWithLabelCode}
        >
          <CheckboxWithLabel />
        </DemoWithCode>

        <DemoWithCode
          title="With Label and Description"
          description="Checkbox with label and description text."
          code={checkboxWithDescriptionCode}
        >
          <CheckboxWithDescription />
        </DemoWithCode>

        <DemoWithCode
          title="Controlled Checkbox"
          description="Checkbox with controlled state."
          code={checkboxControlledCode}
        >
          <CheckboxControlled />
        </DemoWithCode>

        <DemoWithCode
          title="Indeterminate State"
          description="Checkbox with indeterminate (mixed) state."
          code={checkboxIndeterminateCode}
        >
          <CheckboxIndeterminate />
        </DemoWithCode>

        <DemoWithCode
          title="Disabled State"
          description="Disabled checkboxes in different states."
          code={checkboxDisabledCode}
        >
          <CheckboxDisabled />
        </DemoWithCode>

        <DemoWithCode
          title="Parent-Child Checkboxes"
          description="Parent checkbox with indeterminate state based on children."
          code={checkboxParentChildCode}
        >
          <CheckboxParentChild />
        </DemoWithCode>

        <DemoWithCode
          title="Form Example"
          description="Checkboxes in a form context."
          code={checkboxFormCode}
        >
          <CheckboxForm />
        </DemoWithCode>

        <DemoWithCode
          title="Multiple Selection"
          description="Multiple checkboxes for selecting options."
          code={checkboxMultipleSelectionCode}
        >
          <CheckboxMultipleSelection />
        </DemoWithCode>

        <DemoWithCode
          title="Checkbox List"
          description="List of items with checkboxes."
          code={checkboxListCode}
        >
          <CheckboxList />
        </DemoWithCode>

        <DemoWithCode
          title="Checkbox States Overview"
          description="All checkbox states in one view."
          code={checkboxStatesCode}
        >
          <CheckboxStates />
        </DemoWithCode>
      </div>
    </section>
  )
}
