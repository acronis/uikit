import { Separator } from '@acronis-platform/shadcn-uikit/react'

export function SeparatorVertical() {
  return (
    <div className="flex h-20 items-center space-x-4">
      <div className="text-sm">Item 1</div>
      <Separator orientation="vertical" />
      <div className="text-sm">Item 2</div>
      <Separator orientation="vertical" />
      <div className="text-sm">Item 3</div>
    </div>
  )
}
