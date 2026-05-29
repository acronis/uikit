import * as React from 'react'
import { useForm } from '@tanstack/react-form'
import { zodValidator } from '@tanstack/zod-form-adapter'
import * as z from 'zod'
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldGroup,
} from '@acronis-platform/shadcn-uikit/react'
import { Input } from '@acronis-platform/shadcn-uikit/react'
import { Textarea } from '@acronis-platform/shadcn-uikit/react'
import { Button } from '@acronis-platform/shadcn-uikit/react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@acronis-platform/shadcn-uikit/react'

const schema = z.object({
  username: z.string().min(2, 'At least 2 characters.').max(30, 'Max 30 characters.'),
  email: z.string().email('Enter a valid email address.'),
  role: z.string().min(1, 'Please select a role.'),
  bio: z.string().max(160, 'Max 160 characters.').optional(),
})

type FormValues = z.infer<typeof schema>

export function FieldTanstackForm() {
  const [submitted, setSubmitted] = React.useState<FormValues | null>(null)

  const form = useForm({
    defaultValues: { username: '', email: '', role: '', bio: '' },
    validatorAdapter: zodValidator(),
    validators: { onChange: schema },
    onSubmit: async ({ value }) => setSubmitted(value as FormValues),
  })

  if (submitted) {
    return (
      <div className="w-full max-w-md rounded-lg border p-6 space-y-3">
        <p className="text-sm font-medium text-green-600">Saved!</p>
        <pre className="text-xs bg-muted rounded p-3 overflow-auto">
          {JSON.stringify(submitted, null, 2)}
        </pre>
        <Button variant="outline" size="sm" onClick={() => setSubmitted(null)}>
          Edit again
        </Button>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
      >
        <FieldGroup>
          <form.Field name="username" validators={{ onChange: schema.shape.username }}>
            {(field) => (
              <Field data-invalid={field.state.meta.isTouched && field.state.meta.errors.length > 0 ? 'true' : undefined}>
                <FieldLabel htmlFor={field.name}>Username</FieldLabel>
                <Input
                  id={field.name}
                  placeholder="johndoe"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  aria-invalid={field.state.meta.isTouched && field.state.meta.errors.length > 0}
                />
                <FieldDescription>Your public display name.</FieldDescription>
                {field.state.meta.isTouched && (
                  <FieldError errors={field.state.meta.errors.map((e) => ({ message: e?.toString() }))} />
                )}
              </Field>
            )}
          </form.Field>

          <form.Field name="email" validators={{ onChange: schema.shape.email }}>
            {(field) => (
              <Field data-invalid={field.state.meta.isTouched && field.state.meta.errors.length > 0 ? 'true' : undefined}>
                <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                <Input
                  id={field.name}
                  type="email"
                  placeholder="jane@example.com"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  aria-invalid={field.state.meta.isTouched && field.state.meta.errors.length > 0}
                />
                {field.state.meta.isTouched && (
                  <FieldError errors={field.state.meta.errors.map((e) => ({ message: e?.toString() }))} />
                )}
              </Field>
            )}
          </form.Field>

          <form.Field name="role" validators={{ onChange: schema.shape.role }}>
            {(field) => (
              <Field data-invalid={field.state.meta.isTouched && field.state.meta.errors.length > 0 ? 'true' : undefined}>
                <FieldLabel htmlFor={field.name}>Role</FieldLabel>
                <Select
                  value={field.state.value}
                  onValueChange={(val) => field.handleChange(val ?? '')}
                >
                  <SelectTrigger id={field.name} onBlur={field.handleBlur}>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="editor">Editor</SelectItem>
                    <SelectItem value="viewer">Viewer</SelectItem>
                  </SelectContent>
                </Select>
                {field.state.meta.isTouched && (
                  <FieldError errors={field.state.meta.errors.map((e) => ({ message: e?.toString() }))} />
                )}
              </Field>
            )}
          </form.Field>

          <form.Field name="bio" validators={{ onChange: schema.shape.bio }}>
            {(field) => (
              <Field>
                <FieldLabel htmlFor={field.name}>Bio</FieldLabel>
                <Textarea
                  id={field.name}
                  placeholder="Tell us a little about yourself"
                  className="resize-none"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                />
                <FieldDescription>Up to 160 characters.</FieldDescription>
                {field.state.meta.isTouched && (
                  <FieldError errors={field.state.meta.errors.map((e) => ({ message: e?.toString() }))} />
                )}
              </Field>
            )}
          </form.Field>

          <form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting]}>
            {([canSubmit, isSubmitting]) => (
              <Button type="submit" disabled={!canSubmit || isSubmitting}>
                {isSubmitting ? 'Saving…' : 'Save profile'}
              </Button>
            )}
          </form.Subscribe>
        </FieldGroup>
      </form>
    </div>
  )
}
