import { Input } from '@acronis-platform/shadcn-uikit/react'

export function InputDisabled() {
  return (
    <div className="space-y-4">
      <Input placeholder="Disabled input" disabled />
      <Input placeholder="Disabled with value" defaultValue="Cannot edit this" disabled />
    </div>
  )
}
