'use client';

import { ProgressCircle } from '@acronis-platform/ui-react';

export function ProgressCircleDemo() {
  return (
    <div className="flex flex-wrap items-center gap-8">
      <ProgressCircle value={25} size="md" showValue />
      <ProgressCircle value={50} size="md" showValue />
      <ProgressCircle value={75} size="md" showValue />
      <ProgressCircle value={100} size="md" showIcon />
      <div className="flex items-center gap-2">
        <ProgressCircle value={81} size="sm" />
        <span className="text-sm">81%</span>
      </div>
    </div>
  );
}
