'use client';

import { InputText, Label } from '@acronis-platform/ui-react';

export function LabelDemo() {
  return (
    <div className="flex w-64 flex-col gap-2">
      <Label htmlFor="demo-email">Email address</Label>
      <InputText id="demo-email" placeholder="name@acronis.com" />
    </div>
  );
}
