import { toast } from '@acronis-platform/shadcn-uikit/react'
import { Button } from '@acronis-platform/shadcn-uikit/react'

export function SonnerWithCancel() {
  return (
    <Button
      onClick={() =>
        toast('Are you sure?', {
          description: 'This action cannot be undone.',
          cancel: {
            label: 'Cancel',
            onClick: () => console.log('Cancelled'),
          },
          action: {
            label: 'Continue',
            onClick: () => toast.success('Action completed'),
          },
        })
      }
    >
      Toast with Cancel
    </Button>
  )
}
