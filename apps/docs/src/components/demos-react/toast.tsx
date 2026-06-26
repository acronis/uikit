'use client';

import { Button, Toaster, toast } from '@acronis-platform/ui-react';
import { useShadowMount } from '@/components/ShadowDemo';

export function ToastDemo() {
  const mount = useShadowMount();
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
        Default
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
          toast.error('Delete failed', {
            description: 'Please try again or contact support.',
          })
        }
      >
        Error
      </Button>
      <Button
        variant="secondary"
        onClick={() =>
          toast.info('Event created', {
            description: 'Monday, January 3rd at 6:00 PM',
            action: { label: 'Undo', onClick: () => {} },
          })
        }
      >
        With action
      </Button>
      <Toaster portalContainer={mount} />
    </div>
  );
}
