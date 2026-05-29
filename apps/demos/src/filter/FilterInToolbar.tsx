import { Filter } from '@acronis-platform/shadcn-uikit/react'
import { Button } from '@acronis-platform/shadcn-uikit/react'

export function FilterInToolbar() {
  return (
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <div className="flex gap-2">
        <Filter count={3}>Filters</Filter>
        <Button variant="outline" size="sm">
          Sort
        </Button>
        <Button variant="outline" size="sm">
          Export
        </Button>
      </div>
      <div className="text-sm text-muted-foreground">Showing 24 of 156 items</div>
    </div>
  )
}
