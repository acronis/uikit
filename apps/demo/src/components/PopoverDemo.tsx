import * as React from 'react'
import {
  PopoverBasic,
  PopoverWithForm,
  PopoverWithCalendar,
  PopoverWithActions,
  PopoverPlacements,
  PopoverAlignments,
  PopoverIconTriggers,
  PopoverFilter,
} from '@acronis-platform/shadcn-uikit-demos/popover'
import { DemoWithCode } from './DemoWithCode'

// Import actual source code files as raw strings
import popoverBasicCode from '../../../demos/src/popover/PopoverBasic.tsx?raw'
import popoverWithFormCode from '../../../demos/src/popover/PopoverWithForm.tsx?raw'
import popoverWithCalendarCode from '../../../demos/src/popover/PopoverWithCalendar.tsx?raw'
import popoverWithActionsCode from '../../../demos/src/popover/PopoverWithActions.tsx?raw'
import popoverPlacementsCode from '../../../demos/src/popover/PopoverPlacements.tsx?raw'
import popoverAlignmentsCode from '../../../demos/src/popover/PopoverAlignments.tsx?raw'
import popoverIconTriggersCode from '../../../demos/src/popover/PopoverIconTriggers.tsx?raw'
import popoverFilterCode from '../../../demos/src/popover/PopoverFilter.tsx?raw'

export function PopoverDemo() {
  return (
    <section className="demo-section">
      <h2>Popover Component</h2>
      <p className="demo-description mb-8 text-muted-foreground">
        Used to provide additional information and actions related to the selected object when
        clicked.
      </p>

      <div className="space-y-8">
        <DemoWithCode
          title="Basic Popover"
          description="Simple popover with text content."
          code={popoverBasicCode}
        >
          <PopoverBasic />
        </DemoWithCode>

        <DemoWithCode
          title="Popover with Form"
          description="Popover containing form inputs."
          code={popoverWithFormCode}
        >
          <PopoverWithForm />
        </DemoWithCode>

        <DemoWithCode
          title="Popover with Calendar"
          description="Popover containing a calendar picker."
          code={popoverWithCalendarCode}
        >
          <PopoverWithCalendar />
        </DemoWithCode>

        <DemoWithCode
          title="Popover with Actions"
          description="Popover with multiple action buttons matching Figma design."
          code={popoverWithActionsCode}
        >
          <PopoverWithActions />
        </DemoWithCode>

        <DemoWithCode
          title="Different Placements"
          description="Popovers positioned at different sides."
          code={popoverPlacementsCode}
        >
          <PopoverPlacements />
        </DemoWithCode>

        <DemoWithCode
          title="Different Alignments"
          description="Popovers with different alignment options."
          code={popoverAlignmentsCode}
        >
          <PopoverAlignments />
        </DemoWithCode>

        <DemoWithCode
          title="Icon Triggers"
          description="Popovers triggered by icon buttons."
          code={popoverIconTriggersCode}
        >
          <PopoverIconTriggers />
        </DemoWithCode>

        <DemoWithCode
          title="Filter Popover"
          description="Popover with filter options and checkboxes."
          code={popoverFilterCode}
        >
          <PopoverFilter />
        </DemoWithCode>
      </div>
    </section>
  );
}
