import * as React from 'react'
import {
  TooltipBasic,
  TooltipWithIcon,
  TooltipPositions,
  TooltipLongText,
  TooltipCustomDelay,
  TooltipMultiple,
} from '@acronis-platform/shadcn-uikit-demos/tooltip'
import { DemoWithCode } from './DemoWithCode'

// Import actual source code files as raw strings
import tooltipBasicCode from '../../../demos/src/tooltip/TooltipBasic.tsx?raw'
import tooltipWithIconCode from '../../../demos/src/tooltip/TooltipWithIcon.tsx?raw'
import tooltipPositionsCode from '../../../demos/src/tooltip/TooltipPositions.tsx?raw'
import tooltipLongTextCode from '../../../demos/src/tooltip/TooltipLongText.tsx?raw'
import tooltipCustomDelayCode from '../../../demos/src/tooltip/TooltipCustomDelay.tsx?raw'
import tooltipMultipleCode from '../../../demos/src/tooltip/TooltipMultiple.tsx?raw'

export function TooltipDemo() {
  return (
    <section className="demo-section">
      <h2>Tooltip Component</h2>
      <p className="demo-description mb-8 text-muted-foreground">
        Used as an overlay object that provides context or explains the function of a UI element. It
        cannot contain a clickable element inside itself and is called on hovering.
      </p>

      <div className="space-y-8">
        <DemoWithCode
          title="Basic Tooltip"
          description="Simple tooltip triggered on hover."
          code={tooltipBasicCode}
        >
          <TooltipBasic />
        </DemoWithCode>

        <DemoWithCode
          title="Tooltip with Icon"
          description="Tooltip attached to an icon button."
          code={tooltipWithIconCode}
        >
          <TooltipWithIcon />
        </DemoWithCode>

        <DemoWithCode
          title="Tooltip Positions"
          description="Tooltips positioned on different sides of the trigger."
          code={tooltipPositionsCode}
        >
          <TooltipPositions />
        </DemoWithCode>

        <DemoWithCode
          title="Tooltip with Longer Text"
          description="Tooltip with more detailed information."
          code={tooltipLongTextCode}
        >
          <TooltipLongText />
        </DemoWithCode>

        <DemoWithCode
          title="Tooltip with Custom Delay"
          description="Tooltip with a longer delay before appearing."
          code={tooltipCustomDelayCode}
        >
          <TooltipCustomDelay />
        </DemoWithCode>

        <DemoWithCode
          title="Multiple Tooltips"
          description="Multiple tooltips in a single provider."
          code={tooltipMultipleCode}
        >
          <TooltipMultiple />
        </DemoWithCode>
      </div>
    </section>
  );
}
