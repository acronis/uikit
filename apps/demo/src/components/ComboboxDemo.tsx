import * as React from 'react'
import {
  ComboboxBasic,
  ComboboxWidths,
  ComboboxSmall,
  ComboboxForm,
  ComboboxDisabled,
} from '@acronis-platform/shadcn-uikit-demos/combobox'
import { DemoWithCode } from './DemoWithCode'

// Import actual source code files as raw strings
import comboboxBasicCode from '../../../demos/src/combobox/ComboboxBasic.tsx?raw'
import comboboxWidthsCode from '../../../demos/src/combobox/ComboboxWidths.tsx?raw'
import comboboxSmallCode from '../../../demos/src/combobox/ComboboxSmall.tsx?raw'
import comboboxFormCode from '../../../demos/src/combobox/ComboboxForm.tsx?raw'
import comboboxDisabledCode from '../../../demos/src/combobox/ComboboxDisabled.tsx?raw'

export function ComboboxDemo() {
  return (
    <section className="demo-section">
      <h2>Combobox Component</h2>
      <p className="demo-description mb-8 text-muted-foreground">
        Allows users not only to select a value from a list of predefined values but also to enter
        data manually.
      </p>

      <div className="space-y-8">
        <DemoWithCode
          title="Basic Combobox"
          description="A searchable dropdown that allows selecting from a list of options."
          code={comboboxBasicCode}
        >
          <ComboboxBasic />
        </DemoWithCode>

        <DemoWithCode
          title="Different Widths"
          description="Comboboxes with various widths."
          code={comboboxWidthsCode}
        >
          <ComboboxWidths />
        </DemoWithCode>

        <DemoWithCode
          title="Small Combobox"
          description="Compact combobox with smaller size."
          code={comboboxSmallCode}
        >
          <ComboboxSmall />
        </DemoWithCode>

        <DemoWithCode
          title="Form Example"
          description="Combobox used within a form with labels and helper text."
          code={comboboxFormCode}
        >
          <ComboboxForm />
        </DemoWithCode>

        <DemoWithCode
          title="Disabled State"
          description="Combobox in disabled state."
          code={comboboxDisabledCode}
        >
          <ComboboxDisabled />
        </DemoWithCode>
      </div>
    </section>
  );
}
