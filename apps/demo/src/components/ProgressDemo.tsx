import * as React from 'react'
import {
  ProgressBasic,
  ProgressValues,
  ProgressWithLabels,
  ProgressWithTime,
  ProgressSizes,
  ProgressAnimated,
  ProgressMultiple,
  ProgressWidths,
  ProgressInCards,
  ProgressInteractive,
} from '@acronis-platform/shadcn-uikit-demos/progress'
import { DemoWithCode } from './DemoWithCode'

// Import actual source code files as raw strings
import progressBasicCode from '../../../demos/src/progress/ProgressBasic.tsx?raw'
import progressValuesCode from '../../../demos/src/progress/ProgressValues.tsx?raw'
import progressWithLabelsCode from '../../../demos/src/progress/ProgressWithLabels.tsx?raw'
import progressWithTimeCode from '../../../demos/src/progress/ProgressWithTime.tsx?raw'
import progressSizesCode from '../../../demos/src/progress/ProgressSizes.tsx?raw'
import progressAnimatedCode from '../../../demos/src/progress/ProgressAnimated.tsx?raw'
import progressMultipleCode from '../../../demos/src/progress/ProgressMultiple.tsx?raw'
import progressWidthsCode from '../../../demos/src/progress/ProgressWidths.tsx?raw'
import progressInCardsCode from '../../../demos/src/progress/ProgressInCards.tsx?raw'
import progressInteractiveCode from '../../../demos/src/progress/ProgressInteractive.tsx?raw'

export function ProgressDemo() {
  return (
    <section className="demo-section">
      <h2>Progress Component</h2>
      <p className="demo-description mb-8 text-muted-foreground">
        Used to visually represent the progress of a particular process. It shows how much of the
        task has been completed and how much is remaining.
      </p>

      <div className="space-y-8">
        <DemoWithCode
          title="Basic Progress Bar"
          description="Simple linear progress indicator."
          code={progressBasicCode}
        >
          <ProgressBasic />
        </DemoWithCode>

        <DemoWithCode
          title="Different Progress Values"
          description="Progress bars showing various completion states."
          code={progressValuesCode}
        >
          <ProgressValues />
        </DemoWithCode>

        <DemoWithCode
          title="With Labels"
          description="Progress bars with descriptive labels."
          code={progressWithLabelsCode}
        >
          <ProgressWithLabels />
        </DemoWithCode>

        <DemoWithCode
          title="With Time Remaining"
          description="Progress bars showing estimated time remaining."
          code={progressWithTimeCode}
        >
          <ProgressWithTime />
        </DemoWithCode>

        <DemoWithCode
          title="Different Sizes"
          description="Progress bars with various heights."
          code={progressSizesCode}
        >
          <ProgressSizes />
        </DemoWithCode>

        <DemoWithCode
          title="Animated Progress"
          description="Progress bar that animates automatically."
          code={progressAnimatedCode}
        >
          <ProgressAnimated />
        </DemoWithCode>

        <DemoWithCode
          title="Multiple Progress Bars"
          description="Multiple progress indicators for different tasks."
          code={progressMultipleCode}
        >
          <ProgressMultiple />
        </DemoWithCode>

        <DemoWithCode
          title="Different Widths"
          description="Progress bars with various widths."
          code={progressWidthsCode}
        >
          <ProgressWidths />
        </DemoWithCode>

        <DemoWithCode
          title="In Cards"
          description="Progress bars used within card components."
          code={progressInCardsCode}
        >
          <ProgressInCards />
        </DemoWithCode>

        <DemoWithCode
          title="Interactive Progress"
          description="Manually adjustable progress indicator."
          code={progressInteractiveCode}
        >
          <ProgressInteractive />
        </DemoWithCode>
      </div>
    </section>
  );
}
