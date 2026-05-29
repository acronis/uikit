import { Separator } from '@acronis-platform/shadcn-uikit/react'

export function SeparatorInLists() {
  return (
    <div className="space-y-1">
      <div className="p-2">
        <h4 className="text-sm font-medium">List Item 1</h4>
        <p className="text-sm text-muted-foreground">Description for item 1</p>
      </div>
      <Separator />
      <div className="p-2">
        <h4 className="text-sm font-medium">List Item 2</h4>
        <p className="text-sm text-muted-foreground">Description for item 2</p>
      </div>
      <Separator />
      <div className="p-2">
        <h4 className="text-sm font-medium">List Item 3</h4>
        <p className="text-sm text-muted-foreground">Description for item 3</p>
      </div>
    </div>
  )
}
