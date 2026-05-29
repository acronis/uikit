import * as React from 'react'

import { cn } from '@/lib/utils'

interface AspectRatioProps extends React.ComponentPropsWithoutRef<'div'> {
  ratio?: number
}

const AspectRatio = React.forwardRef<HTMLDivElement, AspectRatioProps>(
  ({ ratio = 1, className, style, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('relative w-full', className)}
      style={{ paddingBottom: `${100 / ratio}%`, ...style }}
    >
      <div style={{ position: 'absolute', inset: 0 }} {...props} />
    </div>
  )
)
AspectRatio.displayName = 'AspectRatio'

export { AspectRatio }
