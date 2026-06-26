'use client';

import {
  Button,
  Dialog,
  DialogBody,
  DialogClose,
  DialogCloseButton,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@acronis-platform/ui-react';
import { useShadowMount } from '@/components/ShadowDemo';

export function DialogDemo() {
  const mount = useShadowMount();
  return (
    <Dialog>
      <DialogTrigger render={<Button variant="secondary">Open dialog</Button>} />
      <DialogContent portalContainer={mount}>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogCloseButton />
        </DialogHeader>
        <DialogBody>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
        </DialogBody>
        <DialogFooter>
          <DialogClose render={<Button variant="ghost">Cancel</Button>} />
          <Button variant="destructive">Delete account</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
