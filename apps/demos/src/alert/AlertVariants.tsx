import {
  Alert,
  AlertIcon,
  AlertContent,
  AlertTitle,
  AlertDescription,
} from '@acronis-platform/shadcn-uikit/react'
import {
  SuccessIcon,
  WarningIcon,
  CriticalIcon,
  DangerIcon,
  InfrastructureIcon,
  InfoIcon,
  AiSparklesIcon
} from '@acronis-platform/shadcn-uikit/react'

export function AlertVariants() {
  return (
    <div className="flex flex-col gap-4">
      <Alert variant="ai">
        <AlertIcon>
          <AiSparklesIcon />
        </AlertIcon>
        <AlertContent>
          <AlertDescription>This is an AI-powered alert message.</AlertDescription>
        </AlertContent>
      </Alert>

      <Alert variant="neutral">
        <AlertIcon>
          <InfrastructureIcon />
        </AlertIcon>
        <AlertContent>
          <AlertDescription>This is a neutral informational alert message.</AlertDescription>
        </AlertContent>
      </Alert>

      <Alert variant="success">
        <AlertIcon>
          <SuccessIcon />
        </AlertIcon>
        <AlertContent>
          <AlertDescription>Operation completed successfully!</AlertDescription>
        </AlertContent>
      </Alert>

      <Alert variant="warning">
        <AlertIcon>
          <WarningIcon />
        </AlertIcon>
        <AlertContent>
          <AlertDescription>Please review this warning before proceeding.</AlertDescription>
        </AlertContent>
      </Alert>

      <Alert variant="critical">
        <AlertIcon>
          <CriticalIcon />
        </AlertIcon>
        <AlertContent>
          <AlertDescription>
            Critical issue detected that requires immediate attention.
          </AlertDescription>
        </AlertContent>
      </Alert>

      <Alert variant="destructive">
        <AlertIcon>
          <DangerIcon />
        </AlertIcon>
        <AlertContent>
          <AlertDescription>Danger! This action cannot be undone.</AlertDescription>
        </AlertContent>
      </Alert>

      <Alert variant="info">
        <AlertIcon>
          <InfoIcon />
        </AlertIcon>
        <AlertContent>
          <AlertTitle>System Update Available</AlertTitle>
          <AlertDescription>
            A new version is ready to install. Click here to update now.
          </AlertDescription>
        </AlertContent>
      </Alert>
    </div>
  )
}
