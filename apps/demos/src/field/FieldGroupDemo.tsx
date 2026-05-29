import * as React from 'react'
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldGroup,
} from '@acronis-platform/shadcn-uikit/react'
import { Input } from '@acronis-platform/shadcn-uikit/react'
import { Textarea } from '@acronis-platform/shadcn-uikit/react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@acronis-platform/shadcn-uikit/react'
import { Button } from '@acronis-platform/shadcn-uikit/react'

export function FieldGroupDemo() {
  return (
    <div className="w-full max-w-md">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="fg-name">Full name</FieldLabel>
          <Input id="fg-name" placeholder="Jane Doe" />
        </Field>

        <Field>
          <FieldLabel htmlFor="fg-email">Email</FieldLabel>
          <Input id="fg-email" type="email" placeholder="jane@example.com" />
          <FieldDescription>We will never share your email.</FieldDescription>
        </Field>

        <Field>
          <FieldLabel htmlFor="fg-role">Role</FieldLabel>
          <Select>
            <SelectTrigger id="fg-role">
              <SelectValue placeholder="Select a role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="editor">Editor</SelectItem>
              <SelectItem value="viewer">Viewer</SelectItem>
            </SelectContent>
          </Select>
        </Field>

        <Field>
          <FieldLabel htmlFor="fg-bio">Bio</FieldLabel>
          <Textarea id="fg-bio" placeholder="A short bio…" className="resize-none" />
          <FieldDescription>Up to 160 characters.</FieldDescription>
        </Field>

        <Button>Save</Button>
      </FieldGroup>
    </div>
  )
}
