import * as React from 'react'
import {
  ButtonGroupBasic,
  ButtonGroupDaySelector,
  ButtonGroupDaySelectorSmall,
  ButtonGroupTextAlignment,
  ButtonGroupTextFormatting,
  ButtonGroupWithSeparators,
  ButtonGroupWithTextLabels,
  ButtonGroupVertical,
  ButtonGroupMediaControls,
  ButtonGroupZoomControls,
  ButtonGroupSizes,
  ButtonGroupComplexToolbar,
} from '@acronis-platform/shadcn-uikit-demos/button-group'
import { DemoWithCode } from './DemoWithCode'

// Import actual source code files as raw strings
import buttonGroupBasicCode from '../../../demos/src/button-group/ButtonGroupBasic.tsx?raw'
import buttonGroupDaySelectorCode from '../../../demos/src/button-group/ButtonGroupDaySelector.tsx?raw'
import buttonGroupDaySelectorSmallCode from '../../../demos/src/button-group/ButtonGroupDaySelectorSmall.tsx?raw'
import buttonGroupTextAlignmentCode from '../../../demos/src/button-group/ButtonGroupTextAlignment.tsx?raw'
import buttonGroupTextFormattingCode from '../../../demos/src/button-group/ButtonGroupTextFormatting.tsx?raw'
import buttonGroupWithSeparatorsCode from '../../../demos/src/button-group/ButtonGroupWithSeparators.tsx?raw'
import buttonGroupWithTextLabelsCode from '../../../demos/src/button-group/ButtonGroupWithTextLabels.tsx?raw'
import buttonGroupVerticalCode from '../../../demos/src/button-group/ButtonGroupVertical.tsx?raw'
import buttonGroupMediaControlsCode from '../../../demos/src/button-group/ButtonGroupMediaControls.tsx?raw'
import buttonGroupZoomControlsCode from '../../../demos/src/button-group/ButtonGroupZoomControls.tsx?raw'
import buttonGroupSizesCode from '../../../demos/src/button-group/ButtonGroupSizes.tsx?raw'
import buttonGroupComplexToolbarCode from '../../../demos/src/button-group/ButtonGroupComplexToolbar.tsx?raw'

export function ButtonGroupDemo() {
  return (
    <section className="demo-section">
      <h2>Button Group Component</h2>
      <p className="demo-description mb-8 text-muted-foreground">
        Group related buttons together with consistent styling and spacing. Supports horizontal and
        vertical orientations.
      </p>

      <div className="space-y-8">
        <DemoWithCode
          title="Basic Button Group"
          description="Simple horizontal button group with multiple buttons."
          code={buttonGroupBasicCode}
        >
          <ButtonGroupBasic />
        </DemoWithCode>

        <DemoWithCode
          title="Day Selector (Default Size)"
          description="Button group for selecting days of the week - Default 48px height."
          code={buttonGroupDaySelectorCode}
        >
          <ButtonGroupDaySelector />
        </DemoWithCode>

        <DemoWithCode
          title="Day Selector (Small Size)"
          description="Button group for selecting days of the week - Small 32px height."
          code={buttonGroupDaySelectorSmallCode}
        >
          <ButtonGroupDaySelectorSmall />
        </DemoWithCode>

        <DemoWithCode
          title="Text Alignment"
          description="Button group for text alignment with icons."
          code={buttonGroupTextAlignmentCode}
        >
          <ButtonGroupTextAlignment />
        </DemoWithCode>

        <DemoWithCode
          title="Text Formatting"
          description="Multi-select button group for text formatting options."
          code={buttonGroupTextFormattingCode}
        >
          <ButtonGroupTextFormatting />
        </DemoWithCode>

        <DemoWithCode
          title="With Separators"
          description="Button group with visual separators between sections."
          code={buttonGroupWithSeparatorsCode}
        >
          <ButtonGroupWithSeparators />
        </DemoWithCode>

        <DemoWithCode
          title="With Text Labels"
          description="Button group with text and icon combinations."
          code={buttonGroupWithTextLabelsCode}
        >
          <ButtonGroupWithTextLabels />
        </DemoWithCode>

        <DemoWithCode
          title="Vertical Orientation"
          description="Button group stacked vertically instead of horizontally."
          code={buttonGroupVerticalCode}
        >
          <ButtonGroupVertical />
        </DemoWithCode>

        <DemoWithCode
          title="Media Controls"
          description="Button group for media playback controls."
          code={buttonGroupMediaControlsCode}
        >
          <ButtonGroupMediaControls />
        </DemoWithCode>

        <DemoWithCode
          title="Zoom Controls"
          description="Button group with text display between buttons."
          code={buttonGroupZoomControlsCode}
        >
          <ButtonGroupZoomControls />
        </DemoWithCode>

        <DemoWithCode
          title="Different Sizes"
          description="Button groups with different button sizes."
          code={buttonGroupSizesCode}
        >
          <ButtonGroupSizes />
        </DemoWithCode>

        <DemoWithCode
          title="Complex Toolbar"
          description="Multiple button groups combined to create a rich toolbar."
          code={buttonGroupComplexToolbarCode}
        >
          <ButtonGroupComplexToolbar />
        </DemoWithCode>
      </div>
    </section>
  )
}
