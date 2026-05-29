import { Separator } from '@acronis-platform/shadcn-uikit/react'

export function SeparatorHorizontal() {
  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-sm font-medium">Section 1</h4>
        <p className="text-sm text-muted-foreground">This is the first section of content.</p>
      </div>
      <Separator />
      <div>
        <h4 className="text-sm font-medium">Section 2</h4>
        <p className="text-sm text-muted-foreground">
          This is the second section of content.
        </p>
      </div>
    </div>
  )
}
