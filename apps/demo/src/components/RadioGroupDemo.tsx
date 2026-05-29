import * as React from 'react'
import {
  RadioGroupBasic,
  RadioGroupControlled,
  RadioGroupWithDescriptions,
  RadioGroupDisabled,
  RadioGroupHorizontal,
  RadioGroupForm,
  RadioGroupPayment,
  RadioGroupCards,
  RadioGroupSizes,
  RadioGroupPriority,
} from '@acronis-platform/shadcn-uikit-demos/radio-group'
import { DemoWithCode } from './DemoWithCode'

// Import actual source code files as raw strings
import radioGroupBasicCode from '../../../demos/src/radio-group/RadioGroupBasic.tsx?raw'
import radioGroupControlledCode from '../../../demos/src/radio-group/RadioGroupControlled.tsx?raw'
import radioGroupWithDescriptionsCode from '../../../demos/src/radio-group/RadioGroupWithDescriptions.tsx?raw'
import radioGroupDisabledCode from '../../../demos/src/radio-group/RadioGroupDisabled.tsx?raw'
import radioGroupHorizontalCode from '../../../demos/src/radio-group/RadioGroupHorizontal.tsx?raw'
import radioGroupFormCode from '../../../demos/src/radio-group/RadioGroupForm.tsx?raw'
import radioGroupPaymentCode from '../../../demos/src/radio-group/RadioGroupPayment.tsx?raw'
import radioGroupCardsCode from '../../../demos/src/radio-group/RadioGroupCards.tsx?raw'
import radioGroupSizesCode from '../../../demos/src/radio-group/RadioGroupSizes.tsx?raw'
import radioGroupPriorityCode from '../../../demos/src/radio-group/RadioGroupPriority.tsx?raw'

export function RadioGroupDemo() {
  return (
    <section className="demo-section">
      <h2>Radio Group Component</h2>
      <p className="demo-description mb-8 text-muted-foreground">
        Used when a group of options is mutually exclusive and only one option can be selected from
        that group.
      </p>

      <div className="space-y-8">
        <DemoWithCode
          title="Basic Radio Group"
          description="Simple radio group with labels."
          code={radioGroupBasicCode}
        >
          <RadioGroupBasic />
        </DemoWithCode>

        <DemoWithCode
          title="Controlled Radio Group"
          description="Radio group with controlled state."
          code={radioGroupControlledCode}
        >
          <RadioGroupControlled />
        </DemoWithCode>

        <DemoWithCode
          title="With Descriptions"
          description="Radio options with descriptive text."
          code={radioGroupWithDescriptionsCode}
        >
          <RadioGroupWithDescriptions />
        </DemoWithCode>

        <DemoWithCode
          title="Disabled Options"
          description="Radio group with some disabled options."
          code={radioGroupDisabledCode}
        >
          <RadioGroupDisabled />
        </DemoWithCode>

        <DemoWithCode
          title="Horizontal Layout"
          description="Radio group displayed horizontally."
          code={radioGroupHorizontalCode}
        >
          <RadioGroupHorizontal />
        </DemoWithCode>

        <DemoWithCode
          title="In a Form"
          description="Radio group used within a form context."
          code={radioGroupFormCode}
        >
          <RadioGroupForm />
        </DemoWithCode>

        <DemoWithCode
          title="Payment Method Selection"
          description="Radio group for selecting payment methods."
          code={radioGroupPaymentCode}
        >
          <RadioGroupPayment />
        </DemoWithCode>

        <DemoWithCode
          title="Card Selection"
          description="Radio group with card-style options."
          code={radioGroupCardsCode}
        >
          <RadioGroupCards />
        </DemoWithCode>

        <DemoWithCode
          title="Size Options"
          description="Radio group for selecting sizes."
          code={radioGroupSizesCode}
        >
          <RadioGroupSizes />
        </DemoWithCode>

        <DemoWithCode
          title="Priority Selection"
          description="Radio group for selecting priority levels."
          code={radioGroupPriorityCode}
        >
          <RadioGroupPriority />
        </DemoWithCode>
      </div>
    </section>
  )
}
