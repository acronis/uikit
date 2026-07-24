'use client';

import { Button, DialogFooterDefault, Link } from '@acronis-platform/ui-react';

export function DialogFooterDefaultDemo() {
  return (
    <div className="flex flex-col gap-4">
      <DialogFooterDefault>
        <Button variant="secondary">Cancel</Button>
        <Button>Save</Button>
      </DialogFooterDefault>
      <DialogFooterDefault description="Changes are saved automatically as you type.">
        <Button variant="secondary">Cancel</Button>
        <Button>Save</Button>
      </DialogFooterDefault>
      <DialogFooterDefault link={<Link href="#">Learn more</Link>}>
        <Button variant="secondary">Cancel</Button>
        <Button>Save</Button>
      </DialogFooterDefault>
    </div>
  );
}
