import { toast } from '@acronis-platform/shadcn-uikit/react'
import { Button } from '@acronis-platform/shadcn-uikit/react'

export function SonnerMultiple() {
  return (
    <Button
      onClick={() => {
        toast.success('First notification')
        setTimeout(() => toast.info('Second notification'), 200)
        setTimeout(() => toast.warning('Third notification'), 400)
        setTimeout(() => toast.error('Fourth notification'), 600)
      }}
    >
      Show Multiple Toasts
    </Button>
  )
}
