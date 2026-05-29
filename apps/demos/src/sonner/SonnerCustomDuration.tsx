import { toast } from '@acronis-platform/shadcn-uikit/react'
import { Button } from '@acronis-platform/shadcn-uikit/react'

export function SonnerCustomDuration() {
  return (
    <div className="flex flex-wrap gap-3">
      <Button onClick={() => toast('This will disappear in 1 second', { duration: 1000 })}>
        1 Second
      </Button>
      <Button onClick={() => toast('This will stay for 10 seconds', { duration: 10000 })}>
        10 Seconds
      </Button>
      <Button onClick={() => toast('This will stay forever', { duration: Infinity })}>
        Infinite
      </Button>
    </div>
  )
}
