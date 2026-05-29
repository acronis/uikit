import { Separator } from '@acronis-platform/shadcn-uikit/react'

export function SeparatorWithText() {
  return (
    <div className="space-y-4">
      <p className="text-sm">Content above separator</p>
      <div className="flex items-center">
        <Separator className="flex-1" />
        <span className="px-4 text-sm text-muted-foreground">OR</span>
        <Separator className="flex-1" />
      </div>
      <p className="text-sm">Content below separator</p>
    </div>
  )
}
