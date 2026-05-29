import * as React from 'react'
import {
  DialogBasic,
  DialogSizes,
  DialogForm,
  DialogConfirmation,
  DialogLoading,
  DialogSuccess,
  DialogInfo,
  DialogWithTextarea,
  DialogScrollable,
} from '@acronis-platform/shadcn-uikit-demos/dialog'
import { DemoWithCode } from './DemoWithCode'

// Import actual source code files as raw strings
import dialogBasicCode from '../../../demos/src/dialog/DialogBasic.tsx?raw'
import dialogSizesCode from '../../../demos/src/dialog/DialogSizes.tsx?raw'
import dialogFormCode from '../../../demos/src/dialog/DialogForm.tsx?raw'
import dialogConfirmationCode from '../../../demos/src/dialog/DialogConfirmation.tsx?raw'
import dialogLoadingCode from '../../../demos/src/dialog/DialogLoading.tsx?raw'
import dialogSuccessCode from '../../../demos/src/dialog/DialogSuccess.tsx?raw'
import dialogInfoCode from '../../../demos/src/dialog/DialogInfo.tsx?raw'
import dialogWithTextareaCode from '../../../demos/src/dialog/DialogWithTextarea.tsx?raw'
import dialogScrollableCode from '../../../demos/src/dialog/DialogScrollable.tsx?raw'

export function DialogDemo() {
  return (
    <section className="demo-section">
      <h2>Dialog Component</h2>
      <p className="demo-description mb-8 text-muted-foreground">
        Used to focus the user&apos;s attention exclusively on one task or piece of information via
        a dialog that sits on top of the page content.
      </p>

      <div className="space-y-8">
        <DemoWithCode
          title="Basic Dialog"
          description="Simple dialog with title, content, and action buttons."
          code={dialogBasicCode}
        >
          <DialogBasic />
        </DemoWithCode>

        <DemoWithCode
          title="Dialog Sizes"
          description="Dialogs in different sizes: small, medium, large, and extra large."
          code={dialogSizesCode}
        >
          <DialogSizes />
        </DemoWithCode>

        <DemoWithCode
          title="Form Dialog"
          description="Dialog with form inputs for collecting user data."
          code={dialogFormCode}
        >
          <DialogForm />
        </DemoWithCode>

        <DemoWithCode
          title="Confirmation Dialog"
          description="Dialog for confirming destructive actions."
          code={dialogConfirmationCode}
        >
          <DialogConfirmation />
        </DemoWithCode>

        <DemoWithCode
          title="Loading State"
          description="Dialog showing loading state during async operations."
          code={dialogLoadingCode}
        >
          <DialogLoading />
        </DemoWithCode>

        <DemoWithCode
          title="Success Dialog"
          description="Dialog showing successful completion of an action."
          code={dialogSuccessCode}
        >
          <DialogSuccess />
        </DemoWithCode>

        <DemoWithCode
          title="Info Dialog"
          description="Dialog for displaying informational content."
          code={dialogInfoCode}
        >
          <DialogInfo />
        </DemoWithCode>

        <DemoWithCode
          title="Dialog with Textarea"
          description="Dialog with textarea for longer text input."
          code={dialogWithTextareaCode}
        >
          <DialogWithTextarea />
        </DemoWithCode>

        <DemoWithCode
          title="Scrollable Content"
          description="Dialog with scrollable content for long text."
          code={dialogScrollableCode}
        >
          <DialogScrollable />
        </DemoWithCode>
      </div>
    </section>
  );
}
