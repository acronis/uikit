'use client';

import { Stack } from '@acronis-platform/ui-react';

const Box = ({ children }: { children: React.ReactNode }) => (
  <div className="rounded-md bg-[var(--ui-background-surface-secondary)] px-4 py-2 text-sm">
    {children}
  </div>
);

export function StackDemo() {
  return (
    <Stack direction="horizontal" gap="sm">
      <Box>One</Box>
      <Box>Two</Box>
      <Box>Three</Box>
    </Stack>
  );
}
