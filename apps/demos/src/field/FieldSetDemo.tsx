import * as React from 'react'
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldSet,
  FieldLegend,
  FieldGroup,
  FieldContent,
} from '@acronis-platform/shadcn-uikit/react'
import { Switch } from '@acronis-platform/shadcn-uikit/react'
import { RadioGroup, RadioGroupItem } from '@acronis-platform/shadcn-uikit/react'

export function FieldSetDemo() {
  return (
    <div className="w-full max-w-md space-y-8">
      {/* Switch group */}
      <FieldSet>
        <FieldLegend>Notifications</FieldLegend>
        <FieldGroup>
          <Field orientation="horizontal">
            <FieldLabel htmlFor="notif-email">
              <FieldContent>
                <span>Email</span>
                <FieldDescription>Account activity and updates.</FieldDescription>
              </FieldContent>
            </FieldLabel>
            <Switch id="notif-email" defaultChecked />
          </Field>
          <Field orientation="horizontal">
            <FieldLabel htmlFor="notif-push">
              <FieldContent>
                <span>Push notifications</span>
                <FieldDescription>Critical alerts only.</FieldDescription>
              </FieldContent>
            </FieldLabel>
            <Switch id="notif-push" />
          </Field>
          <Field orientation="horizontal">
            <FieldLabel htmlFor="notif-marketing">
              <FieldContent>
                <span>Marketing</span>
                <FieldDescription>New features and promotions.</FieldDescription>
              </FieldContent>
            </FieldLabel>
            <Switch id="notif-marketing" />
          </Field>
        </FieldGroup>
      </FieldSet>

      {/* Radio group */}
      <FieldSet>
        <FieldLegend>Theme</FieldLegend>
        <RadioGroup defaultValue="system" className="space-y-2">
          <Field orientation="horizontal">
            <FieldLabel htmlFor="theme-light">Light</FieldLabel>
            <RadioGroupItem id="theme-light" value="light" />
          </Field>
          <Field orientation="horizontal">
            <FieldLabel htmlFor="theme-dark">Dark</FieldLabel>
            <RadioGroupItem id="theme-dark" value="dark" />
          </Field>
          <Field orientation="horizontal">
            <FieldLabel htmlFor="theme-system">System</FieldLabel>
            <RadioGroupItem id="theme-system" value="system" />
          </Field>
        </RadioGroup>
      </FieldSet>
    </div>
  )
}
