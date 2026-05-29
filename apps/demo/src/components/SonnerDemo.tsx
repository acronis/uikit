import * as React from 'react'
import { Toaster } from '@acronis-platform/shadcn-uikit/react'
import {
  SonnerBasic,
  SonnerWithDescription,
  SonnerSuccess,
  SonnerInfo,
  SonnerWarning,
  SonnerError,
  SonnerLoading,
  SonnerWithAction,
  SonnerWithCancel,
  SonnerPromise,
  SonnerCustomDuration,
  SonnerRichContent,
  SonnerMultiple,
  SonnerDismissible,
  SonnerPositions,
  SonnerRealWorld,
} from '@acronis-platform/shadcn-uikit-demos/sonner'
import { DemoWithCode } from './DemoWithCode'

// Import actual source code files as raw strings
import sonnerBasicCode from '../../../demos/src/sonner/SonnerBasic.tsx?raw'
import sonnerWithDescriptionCode from '../../../demos/src/sonner/SonnerWithDescription.tsx?raw'
import sonnerSuccessCode from '../../../demos/src/sonner/SonnerSuccess.tsx?raw'
import sonnerInfoCode from '../../../demos/src/sonner/SonnerInfo.tsx?raw'
import sonnerWarningCode from '../../../demos/src/sonner/SonnerWarning.tsx?raw'
import sonnerErrorCode from '../../../demos/src/sonner/SonnerError.tsx?raw'
import sonnerLoadingCode from '../../../demos/src/sonner/SonnerLoading.tsx?raw'
import sonnerWithActionCode from '../../../demos/src/sonner/SonnerWithAction.tsx?raw'
import sonnerWithCancelCode from '../../../demos/src/sonner/SonnerWithCancel.tsx?raw'
import sonnerPromiseCode from '../../../demos/src/sonner/SonnerPromise.tsx?raw'
import sonnerCustomDurationCode from '../../../demos/src/sonner/SonnerCustomDuration.tsx?raw'
import sonnerRichContentCode from '../../../demos/src/sonner/SonnerRichContent.tsx?raw'
import sonnerMultipleCode from '../../../demos/src/sonner/SonnerMultiple.tsx?raw'
import sonnerDismissibleCode from '../../../demos/src/sonner/SonnerDismissible.tsx?raw'
import sonnerPositionsCode from '../../../demos/src/sonner/SonnerPositions.tsx?raw'
import sonnerRealWorldCode from '../../../demos/src/sonner/SonnerRealWorld.tsx?raw'

export function SonnerDemo() {
  return (
    <section className="demo-section">
      <h2>Sonner (Toast) Component</h2>
      <p className="demo-description mb-8 text-muted-foreground">
        Toast notifications for displaying temporary messages to users using Sonner library.
      </p>

      <Toaster position="top-right" />

      <div className="space-y-8">
        <DemoWithCode
          title="Basic Toast"
          description="Simple toast notification with a message."
          code={sonnerBasicCode}
        >
          <SonnerBasic />
        </DemoWithCode>

        <DemoWithCode
          title="Toast with Description"
          description="Toast with title and description."
          code={sonnerWithDescriptionCode}
        >
          <SonnerWithDescription />
        </DemoWithCode>

        <DemoWithCode
          title="Success Toast"
          description="Success toast with green background and checkmark icon."
          code={sonnerSuccessCode}
        >
          <SonnerSuccess />
        </DemoWithCode>

        <DemoWithCode
          title="Info Toast"
          description="Info toast with blue background and info icon."
          code={sonnerInfoCode}
        >
          <SonnerInfo />
        </DemoWithCode>

        <DemoWithCode
          title="Warning Toast"
          description="Warning toast with yellow background and warning icon."
          code={sonnerWarningCode}
        >
          <SonnerWarning />
        </DemoWithCode>

        <DemoWithCode
          title="Error Toast"
          description="Error toast with red background and error icon."
          code={sonnerErrorCode}
        >
          <SonnerError />
        </DemoWithCode>

        <DemoWithCode
          title="Loading Toast"
          description="Loading toast with spinner icon."
          code={sonnerLoadingCode}
        >
          <SonnerLoading />
        </DemoWithCode>

        <DemoWithCode
          title="Toast with Action"
          description="Toast with an action button."
          code={sonnerWithActionCode}
        >
          <SonnerWithAction />
        </DemoWithCode>

        <DemoWithCode
          title="Toast with Cancel Button"
          description="Toast with a cancel button."
          code={sonnerWithCancelCode}
        >
          <SonnerWithCancel />
        </DemoWithCode>

        <DemoWithCode
          title="Promise Toast"
          description="Toast that updates based on promise state."
          code={sonnerPromiseCode}
        >
          <SonnerPromise />
        </DemoWithCode>

        <DemoWithCode
          title="Custom Duration"
          description="Toast with custom display duration."
          code={sonnerCustomDurationCode}
        >
          <SonnerCustomDuration />
        </DemoWithCode>

        <DemoWithCode
          title="Rich Content Toast"
          description="Toast with custom JSX content."
          code={sonnerRichContentCode}
        >
          <SonnerRichContent />
        </DemoWithCode>

        <DemoWithCode
          title="Multiple Toasts"
          description="Show multiple toasts at once."
          code={sonnerMultipleCode}
        >
          <SonnerMultiple />
        </DemoWithCode>

        <DemoWithCode
          title="Dismissible Toasts"
          description="Control toast dismissal behavior."
          code={sonnerDismissibleCode}
        >
          <SonnerDismissible />
        </DemoWithCode>

        <DemoWithCode
          title="Toast Positions"
          description="Click a button to change the toast position and show a toast."
          code={sonnerPositionsCode}
        >
          <SonnerPositions />
        </DemoWithCode>

        <DemoWithCode
          title="Real-world Examples"
          description="Common use cases for toast notifications."
          code={sonnerRealWorldCode}
        >
          <SonnerRealWorld />
        </DemoWithCode>
      </div>
    </section>
  );
}
