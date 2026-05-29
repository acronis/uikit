import { Input } from '@acronis-platform/shadcn-uikit/react'

export function InputBasic() {
  return (
    <div className="space-y-4">
      <Input placeholder="Enter text..." />
      <Input placeholder="With default value" defaultValue="Default value" />
    </div>
  )
}
