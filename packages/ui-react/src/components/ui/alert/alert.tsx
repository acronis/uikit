import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

// Ported from `@acronis-platform/shadcn-uikit`'s `alert`
// (packages/ui-legacy/src/components/ui/alert.tsx) and reconciled with the Figma
// design (node 5337-71774): a rounded banner with a *full* border in the strong
// status color, a pale status surface, foreground text, and only the icon tinted
// with the status color. No Base UI primitive — semantic markup with
// `role="alert"`. Each variant maps to the `--ui-*` status tokens: the pale
// surface (`--ui-background-status-*`) + the saturated border/icon
// (`--ui-background-status-strong-*`). `destructive` uses the danger tokens; `ai`
// has no `strong` surface token, so it uses its solid text token for the
// border + icon.
const alertVariants = cva(
  'relative flex w-full items-start gap-3 rounded-md border p-4 text-foreground',
  {
    variants: {
      variant: {
        info: 'border-[var(--ui-background-status-strong-info)] bg-[var(--ui-background-status-info)] [&_[data-slot=alert-icon]]:text-[var(--ui-background-status-strong-info)]',
        success:
          'border-[var(--ui-background-status-strong-success)] bg-[var(--ui-background-status-success)] [&_[data-slot=alert-icon]]:text-[var(--ui-background-status-strong-success)]',
        warning:
          'border-[var(--ui-background-status-strong-warning)] bg-[var(--ui-background-status-warning)] [&_[data-slot=alert-icon]]:text-[var(--ui-background-status-strong-warning)]',
        critical:
          'border-[var(--ui-background-status-strong-critical)] bg-[var(--ui-background-status-critical)] [&_[data-slot=alert-icon]]:text-[var(--ui-background-status-strong-critical)]',
        destructive:
          'border-[var(--ui-background-status-strong-danger)] bg-[var(--ui-background-status-danger)] [&_[data-slot=alert-icon]]:text-[var(--ui-background-status-strong-danger)]',
        ai: 'border-[var(--ui-text-on-status-ai)] bg-[var(--ui-background-status-ai)] [&_[data-slot=alert-icon]]:text-[var(--ui-text-on-status-ai)]',
        neutral:
          'border-[var(--ui-background-status-strong-neutral)] bg-[var(--ui-background-status-neutral)] [&_[data-slot=alert-icon]]:text-[var(--ui-background-status-strong-neutral)]',
      },
    },
    defaultVariants: {
      variant: 'info',
    },
  }
);

export interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant, ...props }, ref) => (
    <div
      ref={ref}
      role="alert"
      data-slot="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  )
);
Alert.displayName = 'Alert';

const AlertIcon = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  // Color is set by the Alert variant (targets [data-slot=alert-icon]). The icon
  // sits in a line-height-matched box (h-6 = leading-6) and is centered in it, so
  // it optically aligns with the first line of the title/description.
  <div
    ref={ref}
    data-slot="alert-icon"
    className={cn('flex h-6 shrink-0 items-center', className)}
    {...props}
  />
));
AlertIcon.displayName = 'AlertIcon';

const AlertContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="alert-content"
    className={cn('flex min-w-0 flex-1 flex-col gap-0.5', className)}
    {...props}
  />
));
AlertContent.displayName = 'AlertContent';

const AlertTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    data-slot="alert-title"
    className={cn('mb-0 text-sm font-semibold leading-6', className)}
    {...props}
  />
));
AlertTitle.displayName = 'AlertTitle';

const AlertDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="alert-description"
    className={cn('text-sm font-normal leading-6', className)}
    {...props}
  />
));
AlertDescription.displayName = 'AlertDescription';

// Action slot for alert buttons. Two placements (see the Figma): as a direct
// child of Alert after AlertContent it sits at the right edge (AlertContent is
// flex-1) — add `self-center` to center it vertically; placed inside AlertContent
// (under the description) it flows below the text.
const AlertActions = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="alert-actions"
    className={cn('flex items-center gap-2', className)}
    {...props}
  />
));
AlertActions.displayName = 'AlertActions';

export {
  Alert,
  AlertIcon,
  AlertContent,
  AlertTitle,
  AlertDescription,
  AlertActions,
};
