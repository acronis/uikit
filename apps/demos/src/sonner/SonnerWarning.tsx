import { toast } from '@acronis-platform/shadcn-uikit/react'
import { Button } from '@acronis-platform/shadcn-uikit/react'

export function SonnerWarning() {
  return (
    <div className="flex flex-wrap gap-3">
      <Button onClick={() => toast.warning('Low disk space')}>Warning</Button>
      <Button
        onClick={() =>
          toast.warning('Storage warning', {
            description: 'Your storage is almost full. Please free up some space.',
          })
        }
      >
        Warning with Description
      </Button>
    </div>
  )
}
