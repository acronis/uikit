import * as React from 'react'
import {
  FormBasic,
  FormLogin,
  FormProfile,
  FormRegistration,
  FormContact,
  FormSettings,
} from '@acronis-platform/shadcn-uikit-demos/form'
import { DemoWithCode } from './DemoWithCode'

// Import actual source code files as raw strings
import formBasicCode from '../../../demos/src/form/FormBasic.tsx?raw'
import formLoginCode from '../../../demos/src/form/FormLogin.tsx?raw'
import formProfileCode from '../../../demos/src/form/FormProfile.tsx?raw'
import formRegistrationCode from '../../../demos/src/form/FormRegistration.tsx?raw'
import formContactCode from '../../../demos/src/form/FormContact.tsx?raw'
import formSettingsCode from '../../../demos/src/form/FormSettings.tsx?raw'

export function FormDemo() {
  return (
    <section className="demo-section">
      <h2>Form Component</h2>
      <p className="demo-description mb-8 text-muted-foreground">
        Forms with validation using React Hook Form and Zod schema validation.
      </p>

      <div className="space-y-8">
        <DemoWithCode
          title="Basic Form"
          description="Simple form with single field validation."
          code={formBasicCode}
        >
          <FormBasic />
        </DemoWithCode>

        <DemoWithCode
          title="Login Form"
          description="Login form with email, password, and remember me checkbox."
          code={formLoginCode}
        >
          <FormLogin />
        </DemoWithCode>

        <DemoWithCode
          title="Profile Form"
          description="Update your profile information with validation."
          code={formProfileCode}
        >
          <FormProfile />
        </DemoWithCode>

        <DemoWithCode
          title="Registration Form"
          description="Complete registration form with password confirmation and terms acceptance."
          code={formRegistrationCode}
        >
          <FormRegistration />
        </DemoWithCode>

        <DemoWithCode
          title="Contact Form"
          description="Contact form with select dropdown and textarea."
          code={formContactCode}
        >
          <FormContact />
        </DemoWithCode>

        <DemoWithCode
          title="Settings Form"
          description="Settings form with checkboxes, select, and radio group."
          code={formSettingsCode}
        >
          <FormSettings />
        </DemoWithCode>
      </div>
    </section>
  );
}
