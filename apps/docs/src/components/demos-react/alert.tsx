'use client';

import {
  Alert,
  AlertActions,
  AlertClose,
  AlertContent,
  AlertDescription,
  AlertIcon,
  AlertText,
  AlertTitle,
  Button,
} from '@acronis-platform/ui-react';

export function AlertDemo() {
  return (
    <div className="flex flex-col gap-3" style={{ width: 420 }}>
      {(['info', 'success', 'warning', 'critical', 'danger'] as const).map(
        (variant) => (
          <Alert key={variant} variant={variant}>
            <AlertIcon />
            <AlertContent>
              <AlertText>
                <AlertTitle>Title</AlertTitle>
                <AlertDescription>Description</AlertDescription>
              </AlertText>
            </AlertContent>
            <AlertClose />
          </Alert>
        )
      )}
      <Alert variant="critical">
        <AlertIcon />
        <AlertContent>
          <AlertText>
            <AlertTitle>Protect non-compliant devices</AlertTitle>
            <AlertDescription>
              Ensure a protection plan is applied and a scan has completed
              within the last 24 hours.
            </AlertDescription>
          </AlertText>
          <AlertActions>
            <Button variant="secondary">View devices</Button>
            <Button variant="ghost">Dismiss for now</Button>
          </AlertActions>
        </AlertContent>
        <AlertClose />
      </Alert>
      <Alert variant="success">
        <AlertIcon />
        <AlertContent>
          <AlertText>
            <AlertTitle>Your changes were saved</AlertTitle>
          </AlertText>
        </AlertContent>
      </Alert>
    </div>
  );
}
