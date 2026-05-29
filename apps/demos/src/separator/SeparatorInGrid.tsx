import { Separator } from '@acronis-platform/shadcn-uikit/react'

export function SeparatorInGrid() {
  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="space-y-2">
        <h4 className="text-sm font-medium">Column 1</h4>
        <Separator />
        <p className="text-sm text-muted-foreground">Content for column 1</p>
      </div>
      <div className="space-y-2">
        <h4 className="text-sm font-medium">Column 2</h4>
        <Separator />
        <p className="text-sm text-muted-foreground">Content for column 2</p>
      </div>
      <div className="space-y-2">
        <h4 className="text-sm font-medium">Column 3</h4>
        <Separator />
        <p className="text-sm text-muted-foreground">Content for column 3</p>
      </div>
    </div>
  )
}
