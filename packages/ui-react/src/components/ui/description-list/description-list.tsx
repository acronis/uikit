import * as React from 'react';

import { cn } from '@/lib/utils';

// A key/value data list — rows of `label → value`, where the value can be plain
// text, a status (leading icon + value + a muted description), or action links.
// Built from the Figma "Service status" design (Cyber-Compliance node
// 3001-20448). Semantic HTML: a `<dl>` of `<div>`-grouped `<dt>`/`<dd>` rows.
// No `--ui-description-list-*` tier — it composes the shared semantic tokens:
//   • label / value      -> text-foreground (--ui-text-on-surface-primary)
//   • description         -> text-muted-foreground (--ui-text-on-surface-secondary)
//   • row divider         -> border-border (--ui-border-on-surface-border)
//   • status icon color   -> caller-provided (--ui-text-on-status-*)
//   • action links        -> compose the `Link` component
// The 2-column row grid uses a fixed label column (overridable per item via
// className / the `--description-list-label` custom property).

const DescriptionList = React.forwardRef<
  HTMLDListElement,
  React.HTMLAttributes<HTMLDListElement>
>(({ className, ...props }, ref) => (
  <dl ref={ref} className={cn('w-full', className)} {...props} />
));
DescriptionList.displayName = 'DescriptionList';

const DescriptionListItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      // `px-6` insets the content while the `border-t` divider stays full-bleed
      // (the Figma card look). Override the padding via className when the
      // surrounding container already pads (e.g. `-mx-6` inside a padded body).
      'grid grid-cols-[var(--description-list-label,14rem)_minmax(0,1fr)] gap-x-4 border-t border-border px-6 py-3 text-sm leading-6',
      className
    )}
    {...props}
  />
));
DescriptionListItem.displayName = 'DescriptionListItem';

const DescriptionListLabel = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement>
>(({ className, ...props }, ref) => (
  <dt ref={ref} className={cn('text-foreground', className)} {...props} />
));
DescriptionListLabel.displayName = 'DescriptionListLabel';

const DescriptionListValue = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement>
>(({ className, ...props }, ref) => (
  <dd
    ref={ref}
    className={cn(
      'flex min-w-0 items-start gap-2 text-foreground [&>svg]:mt-0.5 [&>svg]:size-4 [&>svg]:shrink-0',
      className
    )}
    {...props}
  />
));
DescriptionListValue.displayName = 'DescriptionListValue';

const DescriptionListValueDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn('text-muted-foreground', className)} {...props} />
));
DescriptionListValueDescription.displayName = 'DescriptionListValueDescription';

const DescriptionListActions = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-wrap items-center gap-4', className)}
    {...props}
  />
));
DescriptionListActions.displayName = 'DescriptionListActions';

export {
  DescriptionList,
  DescriptionListItem,
  DescriptionListLabel,
  DescriptionListValue,
  DescriptionListValueDescription,
  DescriptionListActions,
};
