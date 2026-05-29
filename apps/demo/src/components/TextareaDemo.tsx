import * as React from 'react'
import {
  TextareaBasic,
  TextareaWithLabels,
  TextareaSizes,
  TextareaWithHelper,
  TextareaDisabled,
  TextareaRequired,
  TextareaError,
  TextareaCharCounter,
  TextareaAutoResize,
  TextareaResizeOptions,
  TextareaForm,
  TextareaUseCases,
} from '@acronis-platform/shadcn-uikit-demos/textarea'
import { DemoWithCode } from './DemoWithCode'

// Import actual source code files as raw strings
import textareaBasicCode from '../../../demos/src/textarea/TextareaBasic.tsx?raw'
import textareaWithLabelsCode from '../../../demos/src/textarea/TextareaWithLabels.tsx?raw'
import textareaSizesCode from '../../../demos/src/textarea/TextareaSizes.tsx?raw'
import textareaWithHelperCode from '../../../demos/src/textarea/TextareaWithHelper.tsx?raw'
import textareaDisabledCode from '../../../demos/src/textarea/TextareaDisabled.tsx?raw'
import textareaRequiredCode from '../../../demos/src/textarea/TextareaRequired.tsx?raw'
import textareaErrorCode from '../../../demos/src/textarea/TextareaError.tsx?raw'
import textareaCharCounterCode from '../../../demos/src/textarea/TextareaCharCounter.tsx?raw'
import textareaAutoResizeCode from '../../../demos/src/textarea/TextareaAutoResize.tsx?raw'
import textareaResizeOptionsCode from '../../../demos/src/textarea/TextareaResizeOptions.tsx?raw'
import textareaFormCode from '../../../demos/src/textarea/TextareaForm.tsx?raw'
import textareaUseCasesCode from '../../../demos/src/textarea/TextareaUseCases.tsx?raw'

export function TextareaDemo() {
  return (
    <section className="demo-section">
      <h2>Textarea Component</h2>
      <p className="demo-description mb-8 text-muted-foreground">
        Used to enter data when the expected input is short. In the case of
        multiline input, need to use the Textarea component.
      </p>

      <div className="space-y-8">
        <DemoWithCode
          title="Basic Textarea"
          description="Simple textarea fields with placeholder and default values."
          code={textareaBasicCode}
        >
          <TextareaBasic />
        </DemoWithCode>

        <DemoWithCode
          title="With Labels"
          description="Textarea fields with associated labels for better accessibility."
          code={textareaWithLabelsCode}
        >
          <TextareaWithLabels />
        </DemoWithCode>

        <DemoWithCode
          title="Different Sizes"
          description="Textarea fields in various sizes."
          code={textareaSizesCode}
        >
          <TextareaSizes />
        </DemoWithCode>

        <DemoWithCode
          title="With Helper Text"
          description="Textarea fields with helper text for additional guidance."
          code={textareaWithHelperCode}
        >
          <TextareaWithHelper />
        </DemoWithCode>

        <DemoWithCode
          title="Disabled State"
          description="Disabled textarea fields that cannot be edited."
          code={textareaDisabledCode}
        >
          <TextareaDisabled />
        </DemoWithCode>

        <DemoWithCode
          title="Required Fields"
          description="Textarea fields marked as required with visual indicators."
          code={textareaRequiredCode}
        >
          <TextareaRequired />
        </DemoWithCode>

        <DemoWithCode
          title="Error State"
          description="Textarea fields showing validation errors."
          code={textareaErrorCode}
        >
          <TextareaError />
        </DemoWithCode>

        <DemoWithCode
          title="Character Counter"
          description="Textarea with character limit and counter."
          code={textareaCharCounterCode}
        >
          <TextareaCharCounter />
        </DemoWithCode>

        <DemoWithCode
          title="Auto-resize Textarea"
          description="Textarea that automatically adjusts its height."
          code={textareaAutoResizeCode}
        >
          <TextareaAutoResize />
        </DemoWithCode>

        <DemoWithCode
          title="Resize Options"
          description="Different resize behaviors for textarea."
          code={textareaResizeOptionsCode}
        >
          <TextareaResizeOptions />
        </DemoWithCode>

        <DemoWithCode
          title="Form Example"
          description="Complete form with controlled textareas and submission."
          code={textareaFormCode}
        >
          <TextareaForm />
        </DemoWithCode>

        <DemoWithCode
          title="Various Use Cases"
          description="Different textarea use cases with specific styling."
          code={textareaUseCasesCode}
        >
          <TextareaUseCases />
        </DemoWithCode>
      </div>
    </section>
  );
}
