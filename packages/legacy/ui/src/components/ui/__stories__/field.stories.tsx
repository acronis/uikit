import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from '../field'
import { Input } from '../input'
import { Textarea } from '../textarea'
import { Button } from '../button'
import { Checkbox } from '../checkbox'
import { Switch } from '../switch'
import { RadioGroup, RadioGroupItem } from '../radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../select'

const meta = {
  title: 'UI/Field',
  component: Field,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof Field>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Field className="w-[320px]">
      <FieldLabel htmlFor="email">Email</FieldLabel>
      <Input id="email" placeholder="Enter your email" />
      <FieldDescription>We&apos;ll never share your email with anyone.</FieldDescription>
    </Field>
  ),
}

export const WithError: Story = {
  render: () => (
    <Field className="w-[320px]" data-invalid="true">
      <FieldLabel htmlFor="email-err">Email</FieldLabel>
      <Input id="email-err" type="email" defaultValue="notanemail" aria-invalid />
      <FieldError errors={[{ message: 'Please enter a valid email address.' }]} />
    </Field>
  ),
}

export const MultipleErrors: Story = {
  render: () => (
    <Field className="w-[320px]" data-invalid="true">
      <FieldLabel htmlFor="pwd-err">Password</FieldLabel>
      <Input id="pwd-err" type="password" defaultValue="abc" aria-invalid />
      <FieldDescription>Must be strong and unique.</FieldDescription>
      <FieldError
        errors={[
          { message: 'Must be at least 8 characters.' },
          { message: 'Must contain at least one number.' },
        ]}
      />
    </Field>
  ),
}

export const Horizontal: Story = {
  render: () => (
    <div className="w-[480px] space-y-3">
      <Field orientation="horizontal">
        <FieldLabel htmlFor="h-name">Display name</FieldLabel>
        <Input id="h-name" placeholder="Your name" className="max-w-xs" />
      </Field>
      <Field orientation="horizontal">
        <FieldLabel htmlFor="h-email">Email</FieldLabel>
        <Input id="h-email" type="email" placeholder="you@example.com" className="max-w-xs" />
      </Field>
    </div>
  ),
}

export const HorizontalWithSwitch: Story = {
  render: () => (
    <div className="w-[400px] space-y-3">
      <Field orientation="horizontal">
        <FieldLabel htmlFor="sw-email">
          <FieldContent>
            <span>Email notifications</span>
            <FieldDescription>Get notified about account activity.</FieldDescription>
          </FieldContent>
        </FieldLabel>
        <Switch id="sw-email" defaultChecked />
      </Field>
      <Field orientation="horizontal">
        <FieldLabel htmlFor="sw-marketing">
          <FieldContent>
            <span>Marketing emails</span>
            <FieldDescription>Receive updates on new features.</FieldDescription>
          </FieldContent>
        </FieldLabel>
        <Switch id="sw-marketing" />
      </Field>
    </div>
  ),
}

export const HorizontalWithCheckbox: Story = {
  render: () => (
    <div className="w-[360px] space-y-3">
      <Field orientation="horizontal">
        <FieldLabel htmlFor="cb-terms">
          <FieldContent>
            <span>Accept terms</span>
            <FieldDescription>You agree to our terms of service.</FieldDescription>
          </FieldContent>
        </FieldLabel>
        <Checkbox id="cb-terms" />
      </Field>
      <Field orientation="horizontal">
        <FieldLabel htmlFor="cb-newsletter">
          <FieldContent>
            <span>Newsletter</span>
            <FieldDescription>Monthly product updates.</FieldDescription>
          </FieldContent>
        </FieldLabel>
        <Checkbox id="cb-newsletter" />
      </Field>
    </div>
  ),
}

export const Responsive: Story = {
  render: () => (
    <div className="w-[480px]">
      <FieldGroup>
        <Field orientation="responsive">
          <FieldLabel htmlFor="r-name">Full name</FieldLabel>
          <Input id="r-name" placeholder="Jane Doe" />
        </Field>
        <Field orientation="responsive">
          <FieldLabel htmlFor="r-email">Email</FieldLabel>
          <Input id="r-email" type="email" placeholder="jane@example.com" />
        </Field>
      </FieldGroup>
    </div>
  ),
}

export const WithSelect: Story = {
  render: () => (
    <Field className="w-[280px]">
      <FieldLabel htmlFor="role-sel">Role</FieldLabel>
      <Select>
        <SelectTrigger id="role-sel">
          <SelectValue placeholder="Select a role" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="admin">Admin</SelectItem>
          <SelectItem value="editor">Editor</SelectItem>
          <SelectItem value="viewer">Viewer</SelectItem>
        </SelectContent>
      </Select>
      <FieldDescription>Controls what this user can access.</FieldDescription>
    </Field>
  ),
}

export const WithTextarea: Story = {
  render: () => (
    <Field className="w-[320px]">
      <FieldLabel htmlFor="bio-ta">Bio</FieldLabel>
      <Textarea id="bio-ta" placeholder="A short bio…" className="resize-none" />
      <FieldDescription>Up to 160 characters.</FieldDescription>
    </Field>
  ),
}

export const GroupBasic: Story = {
  render: () => (
    <div className="w-[360px]">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="g-name">Full name</FieldLabel>
          <Input id="g-name" placeholder="Jane Doe" />
        </Field>
        <Field>
          <FieldLabel htmlFor="g-email">Email</FieldLabel>
          <Input id="g-email" type="email" placeholder="jane@example.com" />
          <FieldDescription>We&apos;ll never share your email.</FieldDescription>
        </Field>
        <Field>
          <FieldLabel htmlFor="g-bio">Bio</FieldLabel>
          <Textarea id="g-bio" placeholder="A short bio…" className="resize-none" />
        </Field>
        <Button>Save</Button>
      </FieldGroup>
    </div>
  ),
}

export const SetWithSwitches: Story = {
  render: () => (
    <div className="w-[400px]">
      <FieldSet>
        <FieldLegend>Notifications</FieldLegend>
        <FieldGroup>
          <Field orientation="horizontal">
            <FieldLabel htmlFor="fs-sw1">
              <FieldContent>
                <span>Email</span>
                <FieldDescription>Account activity and updates.</FieldDescription>
              </FieldContent>
            </FieldLabel>
            <Switch id="fs-sw1" defaultChecked />
          </Field>
          <Field orientation="horizontal">
            <FieldLabel htmlFor="fs-sw2">
              <FieldContent>
                <span>Push notifications</span>
                <FieldDescription>Critical alerts only.</FieldDescription>
              </FieldContent>
            </FieldLabel>
            <Switch id="fs-sw2" />
          </Field>
          <Field orientation="horizontal">
            <FieldLabel htmlFor="fs-sw3">
              <FieldContent>
                <span>Marketing</span>
                <FieldDescription>New features and promotions.</FieldDescription>
              </FieldContent>
            </FieldLabel>
            <Switch id="fs-sw3" />
          </Field>
        </FieldGroup>
      </FieldSet>
    </div>
  ),
}

export const SetWithRadio: Story = {
  render: () => (
    <div className="w-[280px]">
      <FieldSet>
        <FieldLegend>Theme</FieldLegend>
        <RadioGroup defaultValue="system" className="space-y-2">
          <Field orientation="horizontal">
            <FieldLabel htmlFor="fs-light">Light</FieldLabel>
            <RadioGroupItem id="fs-light" value="light" />
          </Field>
          <Field orientation="horizontal">
            <FieldLabel htmlFor="fs-dark">Dark</FieldLabel>
            <RadioGroupItem id="fs-dark" value="dark" />
          </Field>
          <Field orientation="horizontal">
            <FieldLabel htmlFor="fs-system">System</FieldLabel>
            <RadioGroupItem id="fs-system" value="system" />
          </Field>
        </RadioGroup>
      </FieldSet>
    </div>
  ),
}

export const WithSeparator: Story = {
  render: () => (
    <div className="w-[360px]">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="sep-email">Email</FieldLabel>
          <Input id="sep-email" type="email" placeholder="you@example.com" />
        </Field>
        <FieldSeparator>or</FieldSeparator>
        <Field>
          <FieldLabel htmlFor="sep-username">Username</FieldLabel>
          <Input id="sep-username" placeholder="johndoe" />
        </Field>
      </FieldGroup>
    </div>
  ),
}

export const Disabled: Story = {
  render: () => (
    <Field className="w-[320px]" data-disabled="true">
      <FieldLabel htmlFor="dis-input">Display name</FieldLabel>
      <Input id="dis-input" placeholder="Readonly value" disabled defaultValue="Jane Doe" />
      <FieldDescription>You cannot change this field.</FieldDescription>
    </Field>
  ),
}
