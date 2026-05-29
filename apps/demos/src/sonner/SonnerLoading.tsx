import { toast } from '@acronis-platform/shadcn-uikit/react'
import { Button } from '@acronis-platform/shadcn-uikit/react'

export function SonnerLoading() {
  return (
    <Button
      onClick={() => {
        const id = toast.loading('Loading...', {
          description: 'Please wait while we process your request.',
        })
        setTimeout(() => {
          toast.success('Completed!', {
            id,
            description: 'Your request has been processed.',
          })
        }, 2000)
      }}
    >
      Show Loading Toast
    </Button>
  )
}
