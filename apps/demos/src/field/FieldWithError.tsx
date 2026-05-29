import * as React from 'react'
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
} from '@acronis-platform/shadcn-uikit/react'
import { Input } from '@acronis-platform/shadcn-uikit/react'

export function FieldWithError() {
  return (
    <div className="w-full max-w-sm space-y-6">
      {/* Single error */}
      <Field data-invalid="true">
        <FieldLabel htmlFor="email-error">Email</FieldLabel>
        <Input
          id="email-error"
          type="email"
          defaultValue="notanemail"
          aria-invalid
        />
        <FieldError errors={[{ message: 'Please enter a valid email address.' }]} />
      </Field>

      {/* Multiple errors */}
      <Field data-invalid="true">
        <FieldLabel htmlFor="password-error">Password</FieldLabel>
        <Input
          id="password-error"
          type="password"
          defaultValue="abc"
          aria-invalid
        />
        <FieldDescription>Must be strong and unique.</FieldDescription>
        <FieldError
          errors={[
            { message: 'Must be at least 8 characters.' },
            { message: 'Must contain at least one number.' },
          ]}
        />
      </Field>
    </div>
  )
}
