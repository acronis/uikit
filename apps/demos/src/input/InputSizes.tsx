import { Input } from '@acronis-platform/shadcn-uikit/react'

export function InputSizes() {
  return (
    <div className="space-y-4">
      <Input className="h-10 text-sm" placeholder="Small input (40px)" />
      <Input placeholder="Default input (48px)" />
      <Input className="h-14 text-base" placeholder="Large input (56px)" />
    </div>
  )
}
