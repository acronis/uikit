import * as React from 'react';
import { Dialog as DialogPrimitive } from '@base-ui/react/dialog';
import { TimesIcon } from '@acronis-platform/icons-react/stroke-mono';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';
import { usePortalContainer } from '@/lib/portal-container';

// Initial version ported from `@acronis-platform/shadcn-uikit`'s `sheet`
// (packages/ui-legacy/src/components/ui/sheet.tsx). A modal side panel — the
// same Base UI Dialog primitive the `Dialog` component uses (keyboard, focus
// trap, scroll lock, ARIA come from Base UI), but anchored to a screen edge with
// a slide transition. In the Vue kit this was `Details`; it's re-exported under
// `Details*` aliases for a 1:1 drop-in. No `--ui-sheet-*` token tier exists yet,
// so this design-pending v1 mirrors the Dialog family's semantic theming.
// Sheets do NOT render a backdrop — they open on top of the page — so the
// `SheetOverlay`/`DetailsOverlay` export is retained for drop-in compat but is
// no longer part of the default `SheetContent` render.
//   • panel    -> bg-muted        = --ui-background-surface-secondary
//   • header / footer -> bg-background = --ui-background-surface-primary bars,
//     divided by border-border
//   • title    -> text-foreground / description -> text-muted-foreground
//   • close    -> text-muted-foreground → hover text-foreground, focus ring
//     var(--ui-focus-primary)
// Enter/exit slide animations use `tw-animate-css` (imported in styles/index.css),
// keyed to Base UI's data-[open] / data-[closed] state attributes. Reconcile
// against the real design with `/figma-component Sheet <url> --update`
// (Cyber-Compliance node 3442-31542) once the mockup is ready for dev.

const sheetVariants = cva(
  'fixed z-50 flex flex-col overflow-hidden bg-muted text-foreground shadow-lg duration-300 data-[open]:animate-in data-[closed]:animate-out',
  {
    variants: {
      side: {
        top: 'inset-x-0 top-0 max-h-[80vh] border-b border-border data-[open]:slide-in-from-top data-[closed]:slide-out-to-top',
        bottom:
          'inset-x-0 bottom-0 max-h-[80vh] border-t border-border data-[open]:slide-in-from-bottom data-[closed]:slide-out-to-bottom',
        left: 'inset-y-0 left-0 h-full w-3/4 border-r border-border data-[open]:slide-in-from-left data-[closed]:slide-out-to-left sm:max-w-md',
        right:
          'inset-y-0 right-0 h-full w-3/4 border-l border-border data-[open]:slide-in-from-right data-[closed]:slide-out-to-right sm:max-w-md',
      },
    },
    defaultVariants: {
      side: 'right',
    },
  }
);

const Sheet = DialogPrimitive.Root;

const SheetTrigger = DialogPrimitive.Trigger;

const SheetPortal = DialogPrimitive.Portal;

const SheetClose = DialogPrimitive.Close;

const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Backdrop>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Backdrop>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Backdrop
    ref={ref}
    className={cn(
      'fixed inset-0 z-50 duration-200 data-[open]:animate-in data-[open]:fade-in-0 data-[closed]:animate-out data-[closed]:fade-out-0',
      className
    )}
    {...props}
  />
));
SheetOverlay.displayName = 'SheetOverlay';

export interface SheetContentProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Popup>,
    VariantProps<typeof sheetVariants> {
  /** Screen edge the panel anchors to. Defaults to `right`. */
  side?: VariantProps<typeof sheetVariants>['side'];
  /**
   * Render the content inside a portal (default `true`). Base UI requires the
   * Popup to sit in a Portal for correct stacking; set `false` for inline usage
   * (e.g. when the caller supplies its own `SheetPortal`, or in tests).
   */
  portal?: boolean;
  /**
   * Portal container. Pass a shadow-root mount for isolated-style previews
   * (the docs demos do this via `useShadowMount`).
   */
  portalContainer?: DialogPrimitive.Portal.Props['container'];
  /** Keep the content mounted while closed (Base UI `Portal` prop). */
  keepMounted?: DialogPrimitive.Portal.Props['keepMounted'];
}

const SheetContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Popup>,
  SheetContentProps
>(
  (
    {
      className,
      children,
      side,
      portal = true,
      portalContainer,
      keepMounted,
      ...props
    },
    ref
  ) => {
    const ctxContainer = usePortalContainer();
    const resolvedContainer = portalContainer ?? ctxContainer;

    const popup = (
      <DialogPrimitive.Popup
        ref={ref}
        className={cn(sheetVariants({ side }), className)}
        {...props}
      >
        {children}
      </DialogPrimitive.Popup>
    );

    return portal ? (
      <DialogPrimitive.Portal container={resolvedContainer} keepMounted={keepMounted}>
        {popup}
      </DialogPrimitive.Portal>
    ) : (
      popup
    );
  }
);
SheetContent.displayName = 'SheetContent';

const SheetHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex h-16 shrink-0 items-center gap-4 border-b border-border bg-background px-5 py-4',
      className
    )}
    {...props}
  />
));
SheetHeader.displayName = 'SheetHeader';

const SheetFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex h-16 shrink-0 items-center justify-end gap-4 border-t border-border bg-background px-6 py-4',
      className
    )}
    {...props}
  />
));
SheetFooter.displayName = 'SheetFooter';

const SheetBody = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('flex-1 overflow-auto p-6', className)} {...props} />
));
SheetBody.displayName = 'SheetBody';

const SheetTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      'flex-1 text-lg font-semibold leading-7 text-foreground',
      className
    )}
    {...props}
  />
));
SheetTitle.displayName = 'SheetTitle';

const SheetDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
));
SheetDescription.displayName = 'SheetDescription';

const SheetCloseButton = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Close>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Close>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Close
    ref={ref}
    className={cn(
      'rounded p-1 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ui-focus-primary)] disabled:pointer-events-none',
      className
    )}
    {...props}
  >
    <TimesIcon size={24} />
    <span className="sr-only">Close</span>
  </DialogPrimitive.Close>
));
SheetCloseButton.displayName = 'SheetCloseButton';

export {
  Sheet,
  SheetTrigger,
  SheetPortal,
  SheetClose,
  SheetCloseButton,
  SheetOverlay,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetBody,
  SheetTitle,
  SheetDescription,
  sheetVariants,
};
