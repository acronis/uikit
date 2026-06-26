'use client';

import { Progress } from '@acronis-platform/ui-react';

export function ProgressDemo() {
  return (
    <div className="flex w-80 flex-col gap-4">
      <Progress value={25} />
      <Progress value={50} />
      <Progress value={75} />
      <Progress value={null} />
    </div>
  );
}
