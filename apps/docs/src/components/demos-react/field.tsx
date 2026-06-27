'use client';

import {
  Checkbox,
  Field,
  FieldControl,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  InputBox,
} from '@acronis-platform/ui-react';

export function FieldDemo() {
  return (
    <div className="flex flex-col gap-8" style={{ width: 360 }}>
      <Field>
        <FieldLabel>Email</FieldLabel>
        <FieldControl render={<InputBox type="email" placeholder="you@example.com" />} />
        <FieldDescription>We&apos;ll never share your email.</FieldDescription>
      </Field>

      <FieldSet>
        <FieldLegend>Notifications</FieldLegend>
        <FieldGroup style={{ gap: 12 }}>
          <Checkbox defaultChecked label="Product updates" description="New features and improvements." />
          <Checkbox label="Security alerts" description="Important account notices." />
        </FieldGroup>
      </FieldSet>
    </div>
  );
}
