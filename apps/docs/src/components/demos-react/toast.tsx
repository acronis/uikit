'use client';

import { Button, Toaster, toast } from '@acronis-platform/ui-react';

export function ToastDemo() {
  return (
    <div className="flex flex-wrap gap-3">
      <Button
        variant="secondary"
        onClick={() =>
          toast('Event created', {
            description: 'Monday, January 3rd at 6:00 PM',
          })
        }
      >
        Info
      </Button>
      <Button
        variant="secondary"
        onClick={() =>
          toast.success('Profile saved', {
            description: 'Your changes have been saved.',
          })
        }
      >
        Success
      </Button>
      <Button
        variant="secondary"
        onClick={() =>
          toast.warning('Disk space low', {
            description: 'Less than 10% remaining.',
          })
        }
      >
        Warning
      </Button>
      <Button
        variant="secondary"
        onClick={() =>
          toast.critical('Backup incomplete', {
            description: 'Three workloads were skipped.',
          })
        }
      >
        Critical
      </Button>
      <Button
        variant="secondary"
        onClick={() =>
          toast.danger('Delete failed', {
            description: 'Please try again or contact support.',
          })
        }
      >
        Danger
      </Button>
      <Button
        variant="secondary"
        onClick={() =>
          toast.info('Event created', {
            description: 'Monday, January 3rd at 6:00 PM',
            actions: [
              { label: 'View', onClick: () => {} },
              { label: 'Undo', onClick: () => {} },
            ],
          })
        }
      >
        With actions
      </Button>
      <Toaster limit={5} />
    </div>
  );
}
