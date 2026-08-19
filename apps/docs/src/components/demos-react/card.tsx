'use client';

import { Button, Card, CardContent, CardFooter, CardHeader } from '@acronis-platform/ui-react';

export function CardDemo() {
  return (
    <Card className="w-[350px]">
      <CardHeader
        title="Backup status"
        description="Last successful run 5 minutes ago."
        hasDescription
        isSwitchable
        defaultSwitchChecked
      />
      <CardContent>
        <p className="text-sm">
          All 24 workloads are protected and up to date.
        </p>
      </CardContent>
      <CardFooter className="gap-2">
        <Button>View report</Button>
        <Button variant="secondary">Run now</Button>
      </CardFooter>
    </Card>
  );
}
