import * as React from 'react'
import {
  InputBasic,
  InputTypes,
  InputWithLabels,
  InputWithIcons,
  InputDisabled,
  InputRequired,
  InputWithHelper,
  InputError,
  InputSizes,
  InputForm,
  InputSearch,
  InputVariousTypes,
} from '@acronis-platform/shadcn-uikit-demos/input'
import { DemoWithCode } from './DemoWithCode'

// Import actual source code files as raw strings
import inputBasicCode from '../../../demos/src/input/InputBasic.tsx?raw'
import inputTypesCode from '../../../demos/src/input/InputTypes.tsx?raw'
import inputWithLabelsCode from '../../../demos/src/input/InputWithLabels.tsx?raw'
import inputWithIconsCode from '../../../demos/src/input/InputWithIcons.tsx?raw'
import inputDisabledCode from '../../../demos/src/input/InputDisabled.tsx?raw'
import inputRequiredCode from '../../../demos/src/input/InputRequired.tsx?raw'
import inputWithHelperCode from '../../../demos/src/input/InputWithHelper.tsx?raw'
import inputErrorCode from '../../../demos/src/input/InputError.tsx?raw'
import inputSizesCode from '../../../demos/src/input/InputSizes.tsx?raw'
import inputFormCode from '../../../demos/src/input/InputForm.tsx?raw'
import inputSearchCode from '../../../demos/src/input/InputSearch.tsx?raw'
import inputVariousTypesCode from '../../../demos/src/input/InputVariousTypes.tsx?raw'

export function InputDemo() {
  return (
    <section className="demo-section">
      <h2>Input Component</h2>
      <p className="demo-description mb-8 text-muted-foreground">
        Used to enter data when the expected input is short. In the case of multiline input, need to
        use the Textarea component.
      </p>

      <div className="demo-grid">
        <DemoWithCode
          title="Basic Input"
          description="Simple input fields with placeholder and default values."
          code={inputBasicCode}
        >
          <InputBasic />
        </DemoWithCode>

        <DemoWithCode
          title="Input Types"
          description="Different HTML input types for various data formats."
          code={inputTypesCode}
        >
          <InputTypes />
        </DemoWithCode>

        <DemoWithCode
          title="With Labels"
          description="Input fields with associated labels for better accessibility."
          code={inputWithLabelsCode}
        >
          <InputWithLabels />
        </DemoWithCode>

        <DemoWithCode
          title="With Icons"
          description="Input fields with icon decorations for visual context."
          code={inputWithIconsCode}
        >
          <InputWithIcons />
        </DemoWithCode>

        <DemoWithCode
          title="Disabled State"
          description="Disabled input fields that cannot be edited."
          code={inputDisabledCode}
        >
          <InputDisabled />
        </DemoWithCode>

        <DemoWithCode
          title="Required Fields"
          description="Input fields marked as required with visual indicators."
          code={inputRequiredCode}
        >
          <InputRequired />
        </DemoWithCode>

        <DemoWithCode
          title="With Helper Text"
          description="Input fields with helper text for additional guidance."
          code={inputWithHelperCode}
        >
          <InputWithHelper />
        </DemoWithCode>

        <DemoWithCode
          title="Error State"
          description="Input fields showing validation errors."
          code={inputErrorCode}
        >
          <InputError />
        </DemoWithCode>

        <DemoWithCode
          title="Different Sizes"
          description="Input fields in various sizes."
          code={inputSizesCode}
        >
          <InputSizes />
        </DemoWithCode>

        <DemoWithCode
          title="Form Example"
          description="Complete form with controlled inputs and submission."
          code={inputFormCode}
        >
          <InputForm />
        </DemoWithCode>

        <DemoWithCode
          title="Search Input"
          description="Search input with live feedback."
          code={inputSearchCode}
        >
          <InputSearch />
        </DemoWithCode>

        <DemoWithCode
          title="Various Input Types"
          description="Collection of different input types with icons."
          code={inputVariousTypesCode}
        >
          <InputVariousTypes />
        </DemoWithCode>
      </div>
    </section>
  )
}
