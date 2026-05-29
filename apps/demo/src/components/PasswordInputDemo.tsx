import * as React from 'react'
import {
  PasswordInputDefault,
  PasswordInputFilled,
  PasswordInputWithHint,
  PasswordInputError,
  PasswordInputDisabled,
  PasswordInputSpecs,
} from '@acronis-platform/shadcn-uikit-demos/password-input'
import { DemoWithCode } from './DemoWithCode'

// Import actual source code files as raw strings
import passwordInputDefaultCode from '../../../demos/src/password-input/PasswordInputDefault.tsx?raw'
import passwordInputFilledCode from '../../../demos/src/password-input/PasswordInputFilled.tsx?raw'
import passwordInputWithHintCode from '../../../demos/src/password-input/PasswordInputWithHint.tsx?raw'
import passwordInputErrorCode from '../../../demos/src/password-input/PasswordInputError.tsx?raw'
import passwordInputDisabledCode from '../../../demos/src/password-input/PasswordInputDisabled.tsx?raw'
import passwordInputSpecsCode from '../../../demos/src/password-input/PasswordInputSpecs.tsx?raw'

export function PasswordInputDemo() {
  return (
    <section className="demo-section">
      <h2>Password Input Component</h2>
      <p className="demo-description mb-8 text-muted-foreground">
        Password input component with visibility toggle, error states, hint
        messages, and disabled states. Based on Acronis Design System
        specifications from Figma.
      </p>

      <div className="space-y-8">
        <DemoWithCode
          title="Password Input - Default State"
          description="Empty password input with placeholder and visibility toggle button."
          code={passwordInputDefaultCode}
        >
          <PasswordInputDefault />
        </DemoWithCode>

        <DemoWithCode
          title="Password Input - Filled State"
          description="Password input with value and floating label inside the input field."
          code={passwordInputFilledCode}
        >
          <PasswordInputFilled />
        </DemoWithCode>

        <DemoWithCode
          title="Password Input - With Hint"
          description="Password input with hint message displayed below the input field."
          code={passwordInputWithHintCode}
        >
          <PasswordInputWithHint />
        </DemoWithCode>

        <DemoWithCode
          title="Password Input - Error State"
          description="Password input showing error state with red border, icon, and error message."
          code={passwordInputErrorCode}
        >
          <PasswordInputError />
        </DemoWithCode>

        <DemoWithCode
          title="Password Input - Disabled State"
          description="Password input in disabled state with reduced opacity and non-interactive elements."
          code={passwordInputDisabledCode}
        >
          <PasswordInputDisabled />
        </DemoWithCode>

        <DemoWithCode
          title="Design Specifications"
          description="Key design tokens and specifications from Figma."
          code={passwordInputSpecsCode}
        >
          <PasswordInputSpecs />
        </DemoWithCode>
      </div>
    </section>
  );
}
