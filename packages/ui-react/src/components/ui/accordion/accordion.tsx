'use client';

import * as React from 'react';
import { Accordion as AccordionPrimitive } from '@base-ui/react/accordion';
import { ChevronDownIcon } from '@acronis-platform/icons-react/stroke-mono';

import { cn } from '@/lib/utils';

// Ported from `@acronis-platform/shadcn-uikit`'s `accordion`. A vertical set of
// disclosure sections built on Base UI's Accordion. Markup-only — the item divider
// uses the shared border token (bare `border-b` renders transparent in ui-react,
// so it must name `border-border`); text inherits the foreground.
const Accordion = AccordionPrimitive.Root;

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn('border-b border-border', className)}
    {...props}
  />
));
AccordionItem.displayName = 'AccordionItem';

const AccordionTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref as React.Ref<HTMLElement>}
      className={cn(
        'flex flex-1 items-center justify-between py-4 text-sm font-medium outline-none transition-all hover:underline focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-[var(--ui-focus-primary)] [&[data-panel-open]>svg]:rotate-180',
        className
      )}
      {...props}
    >
      {children}
      <ChevronDownIcon
        size={16}
        className="shrink-0 text-[var(--ui-text-on-surface-secondary)] transition-transform duration-200"
      />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
));
AccordionTrigger.displayName = 'AccordionTrigger';

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Panel>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Panel>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Panel
    ref={ref}
    className="overflow-hidden text-sm transition-[height] duration-200 ease-out data-[ending-style]:h-0 data-[starting-style]:h-0"
    {...props}
  >
    <div className={cn('pb-4 pt-0 text-[var(--ui-text-on-surface-secondary)]', className)}>
      {children}
    </div>
  </AccordionPrimitive.Panel>
));
AccordionContent.displayName = 'AccordionContent';

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
