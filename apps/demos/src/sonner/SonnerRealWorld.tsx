import { toast } from '@acronis-platform/shadcn-uikit/react'
import { Button } from '@acronis-platform/shadcn-uikit/react'

export function SonnerRealWorld() {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <Button
          onClick={() =>
            toast.success('File uploaded', {
              description: 'document.pdf has been uploaded successfully.',
              action: {
                label: 'View',
                onClick: () => console.log('View file'),
              },
            })
          }
        >
          File Upload Success
        </Button>
      </div>
      <div className="flex items-center gap-3">
        <Button
          onClick={() =>
            toast.error('Connection lost', {
              description: 'Unable to connect to the server. Retrying...',
              action: {
                label: 'Retry',
                onClick: () => toast.info('Reconnecting...'),
              },
            })
          }
        >
          Connection Error
        </Button>
      </div>
      <div className="flex items-center gap-3">
        <Button
          onClick={() =>
            toast.info('New comment', {
              description: 'Sarah commented on your post.',
              action: {
                label: 'View',
                onClick: () => console.log('View comment'),
              },
            })
          }
        >
          Social Notification
        </Button>
      </div>
      <div className="flex items-center gap-3">
        <Button
          onClick={() =>
            toast.warning('Session expiring', {
              description: 'Your session will expire in 5 minutes.',
              action: {
                label: 'Extend',
                onClick: () => toast.success('Session extended'),
              },
            })
          }
        >
          Session Warning
        </Button>
      </div>
    </div>
  )
}
