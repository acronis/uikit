import { toast } from '@acronis-platform/shadcn-uikit/react'
import { Button } from '@acronis-platform/shadcn-uikit/react'

export function SonnerPositions() {
  return (
    <div className="grid grid-cols-3 gap-3">
      <Button onClick={() => toast('Top Left', { position: 'top-left' })}>Top Left</Button>
      <Button onClick={() => toast('Top Center', { position: 'top-center' })}>Top Center</Button>
      <Button onClick={() => toast('Top Right', { position: 'top-right' })}>Top Right</Button>
      <Button onClick={() => toast('Bottom Left', { position: 'bottom-left' })}>
        Bottom Left
      </Button>
      <Button onClick={() => toast('Bottom Center', { position: 'bottom-center' })}>
        Bottom Center
      </Button>
      <Button onClick={() => toast('Bottom Right', { position: 'bottom-right' })}>
        Bottom Right
      </Button>
    </div>
  )
}
