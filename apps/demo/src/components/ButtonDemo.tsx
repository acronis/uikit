import * as React from 'react'
import {
  ButtonVariants,
  ButtonTranslucent,
  ButtonSizes,
  ButtonDisabled,
} from '@acronis-platform/shadcn-uikit-demos/button'
import { DemoWithCode } from './DemoWithCode'

// Import actual source code files as raw strings
import buttonVariantsCode from '../../../demos/src/button/ButtonVariants.tsx?raw'
import buttonTranslucentCode from '../../../demos/src/button/ButtonTranslucent.tsx?raw'
import buttonSizesCode from '../../../demos/src/button/ButtonSizes.tsx?raw'
import buttonDisabledCode from '../../../demos/src/button/ButtonDisabled.tsx?raw'

export function ButtonDemo() {
  return (
    <section className="demo-section">
      <h2>Button Component</h2>
      <p className="demo-description mb-8 text-muted-foreground">
        Versatile button component with multiple variants, sizes, and states.
      </p>

      <div className="space-y-8">
        <DemoWithCode
          title="Button Variants"
          description="Different visual styles for various use cases."
          code={buttonVariantsCode}
        >
          <ButtonVariants />
        </DemoWithCode>

        <DemoWithCode
          title="Translucent Variant"
          description="Semi-transparent button style for overlay contexts."
          code={buttonTranslucentCode}
        >
          <ButtonTranslucent />
        </DemoWithCode>

        <DemoWithCode
          title="Button Sizes"
          description="Various button sizes including icon-only buttons."
          code={buttonSizesCode}
        >
          <ButtonSizes />
        </DemoWithCode>

        <DemoWithCode
          title="Disabled State"
          description="Buttons in disabled state are not interactive."
          code={buttonDisabledCode}
        >
          <ButtonDisabled />
        </DemoWithCode>
      </div>
    </section>
  )
}
