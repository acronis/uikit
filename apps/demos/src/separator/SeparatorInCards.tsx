import { Separator } from '@acronis-platform/shadcn-uikit/react'

export function SeparatorInCards() {
  return (
    <div className="max-w-md rounded-lg border p-6">
      <div className="space-y-4">
        <div>
          <h4 className="font-semibold">Card Header</h4>
          <p className="text-sm text-muted-foreground">This is the header section</p>
        </div>
        <Separator />
        <div>
          <h4 className="font-semibold">Card Content</h4>
          <p className="text-sm text-muted-foreground">This is the main content area</p>
        </div>
        <Separator />
        <div>
          <h4 className="font-semibold">Card Footer</h4>
          <p className="text-sm text-muted-foreground">This is the footer section</p>
        </div>
      </div>
    </div>
  )
}
