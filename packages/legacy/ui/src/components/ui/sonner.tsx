import {
  SuccessIcon,
  InfoIcon,
  WarningIcon,
  // CriticalIcon,
  DangerIcon,
} from '@/components/icons/auto-generated'
import { useTheme } from 'next-themes'
import { Toaster as Sonner } from 'sonner'

export type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      richColors
      className="toaster group"
      style={{
        '--normal-bg': 'hsl(var(--av-card))',
        '--normal-border': 'hsl(var(--av-border))',
        '--normal-text': 'hsl(var(--av-foreground))',
        '--success-bg': 'hsl(var(--av-status-success-bg))',
        '--success-border': 'hsl(var(--av-status-success))',
        '--success-text': 'hsl(var(--av-foreground))',
        '--info-bg': 'hsl(var(--av-status-info-bg))',
        '--info-border': 'hsl(var(--av-status-info))',
        '--info-text': 'hsl(var(--av-foreground))',
        '--warning-bg': 'hsl(var(--av-status-warning-bg))',
        '--warning-border': 'hsl(var(--av-status-warning))',
        '--warning-text': 'hsl(var(--av-foreground))',
        '--error-bg': 'hsl(var(--av-status-danger-bg))',
        '--error-border': 'hsl(var(--av-destructive))',
        '--error-text': 'hsl(var(--av-foreground))',
      } as React.CSSProperties}
      icons={{
        success: <SuccessIcon className="h-4 w-4 text-success-accent" />,
        info: <InfoIcon className="h-4 w-4 text-info-accent" />,
        warning: <WarningIcon className="h-4 w-4 text-warning-accent" />,
        error: <DangerIcon className="h-4 w-4 text-destructive" />,
        loading: <InfoIcon className="h-4 w-4 text-info-accent animate-spin" />,
      }}
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:text-foreground group-[.toaster]:rounded-[4px] group-[.toaster]:shadow-[var(--toast-shadow)] group-[.toaster]:w-[384px]',
          description: 'group-[.toast]:text-foreground group-[.toast]:text-sm',
          actionButton:
            'group-[.toast]:bg-transparent group-[.toast]:text-primary group-[.toast]:hover:text-primary/90 group-[.toast]:font-semibold group-[.toast]:border-0',
          cancelButton:
            'group-[.toast]:bg-transparent group-[.toast]:text-foreground group-[.toast]:hover:bg-muted',
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
export { toast } from 'sonner'
