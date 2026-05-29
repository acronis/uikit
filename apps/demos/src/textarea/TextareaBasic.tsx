import { Textarea } from '@acronis-platform/shadcn-uikit/react'

export function TextareaBasic() {
  return (
    <div className="space-y-4">
      <Textarea placeholder="Enter your text here..." />
      <Textarea placeholder="With default value" defaultValue="This is some default text" />
    </div>
  )
}
