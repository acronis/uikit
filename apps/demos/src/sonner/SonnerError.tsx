import { toast } from '@acronis-platform/shadcn-uikit/react'
import { Button } from '@acronis-platform/shadcn-uikit/react'

export function SonnerError() {
  return (
    <div className="flex flex-wrap gap-3">
      <Button onClick={() => toast.error('Something went wrong')}>Error</Button>
      <Button
        onClick={() =>
          toast.error('Failed to save', {
            description: 'There was an error saving your changes. Please try again.',
          })
        }
      >
        Error with Description
      </Button>
    </div>
  )
}
