'use client';

import { Fragment, useState } from 'react';
import {
  Button,
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
  Sheet,
  SheetBody,
  SheetClose,
  SheetCloseButton,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  Spinner,
} from '@acronis-platform/ui-react';
import { useShadowMount } from '@/components/ShadowDemo';

type ContentState = 'content' | 'loading' | 'empty';

const properties = [
  { label: 'Status', value: 'Protected' },
  { label: 'Last backup', value: '5 minutes ago' },
  { label: 'Owner', value: 'ken99@example.com' },
  { label: 'Plan', value: 'Total protection' },
];

const STATES: { id: ContentState; label: string }[] = [
  { id: 'content', label: 'Details' },
  { id: 'loading', label: 'Loading' },
  { id: 'empty', label: 'Empty' },
];

export function SheetDetailPanelDemo() {
  const mount = useShadowMount();
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<ContentState>('content');

  const show = (s: ContentState) => {
    setState(s);
    setOpen(true);
  };

  return (
    <div className="flex flex-wrap gap-2">
      {STATES.map((s) => (
        <Button key={s.id} variant="secondary" onClick={() => show(s.id)}>
          {s.label}
        </Button>
      ))}

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" portalContainer={mount}>
          <SheetHeader>
            <SheetTitle>Workload details</SheetTitle>
            <SheetCloseButton />
          </SheetHeader>
          <SheetBody>
            {state === 'loading' ? (
              <div className="flex h-40 items-center justify-center">
                <Spinner />
              </div>
            ) : state === 'empty' ? (
              <Empty>
                <EmptyHeader>
                  <EmptyTitle>Nothing to show</EmptyTitle>
                  <EmptyDescription>
                    This workload has no details yet.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : (
              <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-sm">
                {properties.map((p) => (
                  <Fragment key={p.label}>
                    <dt className="text-muted-foreground">{p.label}</dt>
                    <dd className="font-medium">{p.value}</dd>
                  </Fragment>
                ))}
              </dl>
            )}
          </SheetBody>
          <SheetFooter>
            <SheetClose render={<Button variant="ghost">Close</Button>} />
            <Button>Edit</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
