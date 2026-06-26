import * as React from 'react';
import { Tabs as TabsPrimitive } from '@base-ui/react/tabs';

import { cn } from '@/lib/utils';

// Ported from `@acronis-platform/shadcn-uikit`'s `tabs`
// (packages/ui-legacy/src/components/ui/tabs.tsx). A bordered segmented-control
// tab group built on the Base UI Tabs primitive (keyboard nav, roving focus,
// ARIA come from Base UI). No `--ui-tabs-*` token tier exists yet, so this
// design-pending v1 themes from the shared semantic tokens:
//   • trigger idle   -> border-secondary + text-secondary (brand outline segment)
//   • trigger active -> bg-secondary + text-primary-foreground (data-[active])
//     — pure-white label (glyph-on-brand-primary), like the default Button;
//     NOT text-secondary-foreground, which is a dimmed 60% white.
//   • focus ring     -> var(--ui-focus-primary)
// NB: the brand action blue is the `secondary` bridge (--ui-background-brand-
// secondary, the same blue Button's primary uses); `primary` bridges to the
// dark navy --ui-background-brand-primary, so it is NOT used here.
// The legacy active treatment was a `bg-primary/10` tint; the opacity hack is
// dropped for a token-pure filled segment. Reconcile (and a possible
// `--ui-tabs-*` tier / underline-indicator variant) with
// `/figma-component Tabs <url> --update` once a mockup lands.

const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn('inline-flex items-stretch rounded-md', className)}
    {...props}
  />
));
TabsList.displayName = 'TabsList';

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Tab>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Tab>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Tab
    ref={ref}
    className={cn(
      '-mr-px inline-flex flex-1 items-center justify-center whitespace-nowrap border border-secondary px-2 py-1 text-sm font-semibold text-secondary transition-colors first:rounded-l-md last:-mr-0 last:rounded-r-md outline-none focus-visible:ring-2 focus-visible:ring-[var(--ui-focus-primary)] disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-secondary data-[active]:text-primary-foreground',
      className
    )}
    {...props}
  />
));
TabsTrigger.displayName = 'TabsTrigger';

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Panel>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Panel>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Panel
    ref={ref}
    className={cn(
      'mt-2 outline-none focus-visible:ring-2 focus-visible:ring-[var(--ui-focus-primary)]',
      className
    )}
    {...props}
  />
));
TabsContent.displayName = 'TabsContent';

export { Tabs, TabsList, TabsTrigger, TabsContent };
