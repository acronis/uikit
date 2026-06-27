'use client';

import {
  Button,
  Sheet,
  SheetBody,
  SheetClose,
  SheetCloseButton,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@acronis-platform/ui-react';
import { useShadowMount } from '@/components/ShadowDemo';

export function SheetDemo() {
  const mount = useShadowMount();
  return (
    <Sheet>
      <SheetTrigger render={<Button variant="secondary">Open details</Button>} />
      <SheetContent side="right" portalContainer={mount}>
        <SheetHeader>
          <SheetTitle>Workload details</SheetTitle>
          <SheetCloseButton />
        </SheetHeader>
        <SheetBody>
          <SheetDescription>
            Inspect and act on the selected workload without leaving the page.
          </SheetDescription>
          <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-sm">
            <dt className="text-muted-foreground">Status</dt>
            <dd className="font-medium">Protected</dd>
            <dt className="text-muted-foreground">Last backup</dt>
            <dd className="font-medium">5 minutes ago</dd>
          </dl>
        </SheetBody>
        <SheetFooter>
          <SheetClose render={<Button variant="ghost">Close</Button>} />
          <Button>Edit</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
