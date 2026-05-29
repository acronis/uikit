import * as React from 'react'
import { cn } from '@/lib/utils'

const PageContent = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  ({ className, ...props }, ref) => (
    <main ref={ref} className={cn('flex-1 p-6', className)} {...props} />
  )
)
PageContent.displayName = 'PageContent'

export { PageContent }