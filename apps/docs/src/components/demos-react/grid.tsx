'use client';

import { Grid } from '@acronis-platform/ui-react';

const Box = ({ children }: { children: React.ReactNode }) => (
  <div className="rounded-md bg-[var(--ui-background-surface-secondary)] px-4 py-6 text-center text-sm">
    {children}
  </div>
);

export function GridDemo() {
  return (
    <div style={{ width: 520 }}>
      <Grid cols={3}>
        {Array.from({ length: 6 }, (_, i) => (
          <Box key={i}>Cell {i + 1}</Box>
        ))}
      </Grid>
    </div>
  );
}
