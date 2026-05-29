import { toast } from '@acronis-platform/shadcn-uikit/react'
import { Button } from '@acronis-platform/shadcn-uikit/react'

export function SonnerRichContent() {
  return (
    <Button
      onClick={() =>
        toast(
          <div className="flex flex-col gap-2">
            <div className="font-semibold">New message received</div>
            <div className="text-sm">
              <strong>John Doe:</strong> Hey, are you available for a quick call?
            </div>
          </div>
        )
      }
    >
      Rich Content Toast
    </Button>
  )
}
