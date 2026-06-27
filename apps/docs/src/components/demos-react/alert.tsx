'use client';

import {
  Alert,
  AlertActions,
  AlertContent,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Button,
} from '@acronis-platform/ui-react';
import {
  CircleCheckIcon,
  CircleInfoIcon,
  CircleWarningIcon,
} from '@acronis-platform/icons-react/stroke-mono';

export function AlertDemo() {
  return (
    <div className="flex flex-col gap-3" style={{ width: 420 }}>
      <Alert variant="info">
        <AlertIcon>
          <CircleInfoIcon size={16} />
        </AlertIcon>
        <AlertContent>
          <AlertTitle>Heads up!</AlertTitle>
          <AlertDescription>
            You can add components to your app using the CLI.
          </AlertDescription>
        </AlertContent>
      </Alert>
      <Alert variant="success">
        <AlertIcon>
          <CircleCheckIcon size={16} />
        </AlertIcon>
        <AlertContent>
          <AlertTitle>Saved</AlertTitle>
          <AlertDescription>Your changes were saved.</AlertDescription>
        </AlertContent>
      </Alert>
      <Alert variant="destructive">
        <AlertIcon>
          <CircleWarningIcon size={16} />
        </AlertIcon>
        <AlertContent>
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Your session has expired. Please log in again.
          </AlertDescription>
        </AlertContent>
      </Alert>
      <Alert variant="info">
        <AlertIcon>
          <CircleInfoIcon size={16} />
        </AlertIcon>
        <AlertContent>
          <AlertTitle>Protect non-compliant devices</AlertTitle>
          <AlertDescription>
            Ensure a protection plan is applied and a scan has completed within
            the last 24 hours.
          </AlertDescription>
        </AlertContent>
        <AlertActions className="self-center">
          <Button>View devices</Button>
        </AlertActions>
      </Alert>
    </div>
  );
}
