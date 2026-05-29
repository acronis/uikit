import { cn } from '@/lib/utils'

function Empty({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="empty"
      className={cn(
        'flex w-full max-w-[448px] flex-col items-center justify-center text-center text-[hsl(var(--empty-foreground))]',
        className
      )}
      {...props}
    />
  )
}

function EmptyIcon({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="empty-icon"
      className={cn(
        'mb-4 flex h-[var(--empty-icon-size,72px)] w-[var(--empty-icon-size,72px)] items-center justify-center [&_svg]:h-full [&_svg]:w-full',
        className
      )}
      {...props}
    />
  )
}

function EmptyHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="empty-header"
      className={cn('flex w-full flex-col items-center gap-2 text-center', className)}
      {...props}
    />
  )
}

function EmptyTitle({ className, ...props }: React.ComponentProps<'h3'>) {
  return (
    <h3
      data-slot="empty-title"
      className={cn('text-lg font-normal leading-6', className)}
      {...props}
    />
  )
}

function EmptyDescription({ className, ...props }: React.ComponentProps<'p'>) {
  return (
    <p data-slot="empty-description" className={cn('text-sm leading-6', className)} {...props} />
  )
}

function EmptyActions({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="empty-actions"
      className={cn('mt-4 flex flex-col items-center gap-4', className)}
      {...props}
    />
  )
}

function EmptyLinks({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="empty-links"
      className={cn('flex flex-col items-center gap-2', className)}
      {...props}
    />
  )
}

export { Empty, EmptyIcon, EmptyHeader, EmptyTitle, EmptyDescription, EmptyActions, EmptyLinks }
