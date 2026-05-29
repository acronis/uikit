import { toast } from '@acronis-platform/shadcn-uikit/react'
import { Button } from '@acronis-platform/shadcn-uikit/react'

export function SonnerInfo() {
  return (
    <div className="flex flex-wrap gap-3">
      <Button onClick={() => toast.info('New update available')}>Info</Button>
      <Button
        onClick={() =>
          toast.info('System notification', {
            description: 'A new version is available for download.',
          })
        }
      >
        Info with Description
      </Button>
    </div>
  )
}
