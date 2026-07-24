'use client';

import { Loading } from '@acronis-platform/ui-react';

export function LoadingDemo() {
  return (
    <div className="flex flex-wrap items-center gap-6">
      <Loading variant="inline" />
      <Loading variant="onSurfacePrimary" />
      <Loading variant="onSurfaceSecondary" />
      <div className="bg-[#191b23] p-6">
        <Loading variant="onScreen" />
      </div>
    </div>
  );
}
