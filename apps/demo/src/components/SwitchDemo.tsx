import * as React from 'react'
import {
  SwitchBasic,
  SwitchWithLabel,
  SwitchControlled,
  SwitchForm,
} from '@acronis-platform/shadcn-uikit-demos/switch'
import { DemoWithCode } from './DemoWithCode'

// Import actual source code files as raw strings
import switchBasicCode from '../../../demos/src/switch/SwitchBasic.tsx?raw'
import switchWithLabelCode from '../../../demos/src/switch/SwitchWithLabel.tsx?raw'
import switchControlledCode from '../../../demos/src/switch/SwitchControlled.tsx?raw'
import switchFormCode from '../../../demos/src/switch/SwitchForm.tsx?raw'

export function SwitchDemo() {
  return (
    <section className="demo-section">
      <h2>Switch Component</h2>
      <p className="demo-description mb-8 text-muted-foreground">
        Used to turn an individual option on or off. It is usually used to activate or deactivate a
        specific setting.
      </p>

      <div className="space-y-8">
        <DemoWithCode
          title="Basic Switch"
          description="Simple on/off toggle switch."
          code={switchBasicCode}
        >
          <SwitchBasic />
        </DemoWithCode>

        <DemoWithCode
          title="With Label"
          description="Switch with an associated label."
          code={switchWithLabelCode}
        >
          <SwitchWithLabel />
        </DemoWithCode>

        <DemoWithCode
          title="Controlled Switch"
          description="Switch with controlled state."
          code={switchControlledCode}
        >
          <SwitchControlled />
        </DemoWithCode>

        <DemoWithCode
          title="In a Form"
          description="Switches used within a form context with descriptions."
          code={switchFormCode}
        >
          <SwitchForm />
        </DemoWithCode>
      </div>
    </section>
  )
}

