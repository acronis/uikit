import { RotateIcon } from '@acronis-platform/shadcn-uikit'

interface LoadingMessageProps {
  title?: string
  description?: string
}

export function LoadingMessage({ 
  title = 'Gathering info',
  description = "I'm processing your request..."
}: LoadingMessageProps) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 space-y-2">
      <div className="flex items-center gap-2">
        <RotateIcon className="h-4 w-4 animate-spin text-primary" />
        <p className="font-semibold text-sm">{title}</p>
      </div>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  )
}
