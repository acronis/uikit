/** Props for the Alert component */
export interface AlertProps {
  /** Visual style variant indicating the alert's severity */
  variant?: 'info' | 'success' | 'warning' | 'critical' | 'destructive' | 'ai' | 'neutral'
  className?: string
}
