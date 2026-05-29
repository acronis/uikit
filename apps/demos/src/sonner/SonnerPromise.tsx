import { toast } from '@acronis-platform/shadcn-uikit/react'
import { Button } from '@acronis-platform/shadcn-uikit/react'

export function SonnerPromise() {
  return (
    <Button
      onClick={() => {
        const promise = () =>
          new Promise((resolve) => setTimeout(() => resolve({ name: 'Sonner' }), 2000))

        toast.promise(promise, {
          loading: 'Loading...',
          success: (data: any) => {
            return `${data.name} toast has been added`
          },
          error: 'Error',
        })
      }}
    >
      Promise Toast
    </Button>
  )
}
