import * as React from 'react'
import { Dialog as BaseDialog } from '@base-ui/react'
import { CloseIcon } from '@/components/icons'

import { cn } from '@/lib/utils'

// Re-export Root as Dialog so callers use <Dialog open={...}> identical to Radix usage
const Dialog = BaseDialog.Root

const DialogTrigger = BaseDialog.Trigger

const DialogPortal = BaseDialog.Portal

const DialogClose = BaseDialog.Close

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof BaseDialog.Backdrop>,
  React.ComponentPropsWithoutRef<typeof BaseDialog.Backdrop>
>(({ className, ...props }, ref) => (
  <BaseDialog.Backdrop
    ref={ref}
    className={cn(
      'fixed inset-0 z-50 bg-black/80 data-[open]:animate-in data-[closed]:animate-out data-[closed]:fade-out-0 data-[open]:fade-in-0',
      className
    )}
    {...props}
  />
))
DialogOverlay.displayName = 'DialogOverlay'

const DialogContent = React.forwardRef<
  React.ElementRef<typeof BaseDialog.Popup>,
  React.ComponentPropsWithoutRef<typeof BaseDialog.Popup> & {
    portal?: boolean
  }
>(({ className, children, portal = true, ...props }, ref) => {
  // Base UI requires Popup to be rendered inside a Portal for proper stacking context.
  // When portal=false the caller opts out (e.g. inline usage in tests).
  const popup = (
    <>
      <DialogOverlay />
      <BaseDialog.Popup
        ref={ref}
        className={cn(
          'fixed left-[50%] top-[50%] z-50 flex w-full max-w-lg translate-x-[-50%] translate-y-[-50%] flex-col overflow-hidden rounded bg-muted shadow-[0px_10px_20px_rgba(36,49,67,0.9)] duration-200 data-[open]:animate-in data-[closed]:animate-out data-[closed]:fade-out-0 data-[open]:fade-in-0 data-[closed]:zoom-out-95 data-[open]:zoom-in-95 data-[closed]:slide-out-to-left-1/2 data-[closed]:slide-out-to-top-dialog-offset data-[open]:slide-in-from-left-1/2 data-[open]:slide-in-from-top-dialog-offset',
          className
        )}
        {...props}
      >
        {children}
      </BaseDialog.Popup>
    </>
  )

  return portal ? <BaseDialog.Portal>{popup}</BaseDialog.Portal> : popup
})
DialogContent.displayName = 'DialogContent'

const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'flex h-16 items-center gap-4 border-b border-border bg-card px-5 py-4',
      className
    )}
    {...props}
  />
)
DialogHeader.displayName = 'DialogHeader'

const DialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'flex h-16 items-center justify-end gap-4 border-t border-border bg-card px-6 py-4',
      className
    )}
    {...props}
  />
)
DialogFooter.displayName = 'DialogFooter'

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof BaseDialog.Title>,
  React.ComponentPropsWithoutRef<typeof BaseDialog.Title>
>(({ className, ...props }, ref) => (
  <BaseDialog.Title
    ref={ref}
    className={cn(
      'flex-1 text-2xl font-normal leading-8 text-foreground',
      className
    )}
    {...props}
  />
))
DialogTitle.displayName = 'DialogTitle'

const DialogCloseButton = React.forwardRef<
  React.ElementRef<typeof BaseDialog.Close>,
  React.ComponentPropsWithoutRef<typeof BaseDialog.Close>
>(({ className, ...props }, ref) => (
  <BaseDialog.Close
    ref={ref}
    className={cn(
      'rounded p-1 text-[#2668C5] opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none',
      className
    )}
    {...props}
  >
    <CloseIcon className="h-6 w-6" />
    <span className="sr-only">Close</span>
  </BaseDialog.Close>
))
DialogCloseButton.displayName = 'DialogCloseButton'

const DialogBody = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex-1 overflow-auto p-6', className)} {...props} />
)
DialogBody.displayName = 'DialogBody'

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof BaseDialog.Description>,
  React.ComponentPropsWithoutRef<typeof BaseDialog.Description>
>(({ className, ...props }, ref) => (
  <BaseDialog.Description
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
))
DialogDescription.displayName = 'DialogDescription'

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogCloseButton,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogBody,
  DialogDescription,
}
