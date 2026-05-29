import { Textarea } from '@acronis-platform/shadcn-uikit/react'

export function TextareaDisabled() {
  return (
    <div className="space-y-4">
      <Textarea placeholder="Disabled textarea" disabled />
      <Textarea
        placeholder="Disabled with value"
        defaultValue="This textarea is disabled and cannot be edited"
        disabled
      />
    </div>
  )
}
