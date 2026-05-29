import * as React from 'react'
import { useForm } from '@tanstack/react-form'
import { zodValidator } from '@tanstack/zod-form-adapter'
import * as z from 'zod'
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
} from '@acronis-platform/shadcn-uikit/react'
import { Input } from '@acronis-platform/shadcn-uikit/react'
import { Button } from '@acronis-platform/shadcn-uikit/react'

const usernameSchema = z.string().min(2, 'Username must be at least 2 characters.')

export function FormTanstackBasic() {
  const form = useForm({
    defaultValues: { username: '' },
    validatorAdapter: zodValidator(),
    onSubmit: async ({ value }) => {
      alert(JSON.stringify(value, null, 2))
    },
  })

  return (
    <div className="w-full max-w-md">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
        className="space-y-4"
      >
        <form.Field name="username" validators={{ onChange: usernameSchema }}>
          {(field) => (
            <Field data-invalid={field.state.meta.isTouched && field.state.meta.errors.length > 0 ? 'true' : undefined}>
              <FieldLabel htmlFor={field.name}>Username</FieldLabel>
              <Input
                id={field.name}
                placeholder="Enter username"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                aria-invalid={field.state.meta.isTouched && field.state.meta.errors.length > 0}
              />
              <FieldDescription>This is your public display name.</FieldDescription>
              {field.state.meta.isTouched && (
                <FieldError errors={field.state.meta.errors.map((e) => ({ message: e?.toString() }))} />
              )}
            </Field>
          )}
        </form.Field>

        <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
          {([canSubmit, isSubmitting]) => (
            <Button type="submit" disabled={!canSubmit || isSubmitting}>
              {isSubmitting ? 'Submitting…' : 'Submit'}
            </Button>
          )}
        </form.Subscribe>
      </form>
    </div>
  )
}
