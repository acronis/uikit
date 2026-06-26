'use client';

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@acronis-platform/ui-react';

export function CardDemo() {
  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Backup status</CardTitle>
        <CardDescription>Last successful run 5 minutes ago.</CardDescription>
      </CardHeader>
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
