'use client';

import * as React from 'react';
import { Collapsible as CollapsiblePrimitive } from '@base-ui/react/collapsible';
import { ChevronRightIcon } from '@acronis-platform/icons-react/stroke-mono';

import { cn } from '@/lib/utils';

// The shared disclosure primitive behind Card's and Section's `isCollapsable`
// variant (Figma file lrU3ydIyvPYQNE6ixdsKtJ, node 10561:83806). Built directly
// on Base UI's Collapsible — Root/Trigger/Panel own all open/close state, ARIA
// wiring, and height animation; this component only adds the chevron rotation
// and the `collapsible=false` bypass. It never imposes visual styling beyond
// what the disclosure mechanic itself requires: no padding/background/border on
// Root or Content, no position/hover opinion on Trigger beyond its chevron's
// glyph color (--ui-glyph-on-surface-primary, matching the Figma ButtonCollapse
// reference exactly). Every other visual decision (header layout, spacing,
// background, borders) stays owned by the consumer composing this primitive
// into their own component (Card, Section, ...).

interface AccordionContainerState {
  open: boolean;
}

type AccordionContainerChildren =
  | React.ReactNode
  | ((state: AccordionContainerState) => React.ReactNode);

type AccordionContainerBaseProps = Omit<
  React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.Root>,
  'children'
>;

interface AccordionContainerProps extends AccordionContainerBaseProps {
  /**
   * Whether the disclosure exists at all. When `false`, `children` render
   * directly with no trigger and no panel wrapper — the Figma
   * `isCollapsable=false` state has no disclosure UI.
   * @default false
   */
  collapsible?: boolean;
  /**
   * Accepts a plain node, or a render-prop function receiving the current
   * `{ open }` state — for content outside `AccordionContainer.Content` (e.g.
   * a header) that still needs to know whether the panel is expanded, even
   * when this component owns the open state itself (uncontrolled).
   */
  children?: AccordionContainerChildren;
}

interface AccordionContainerContextValue {
  collapsible: boolean;
}

const AccordionContainerContext = React.createContext<AccordionContainerContextValue>({
  collapsible: false,
});

const useAccordionContainerContext = () => React.useContext(AccordionContainerContext);

const AccordionContainer = React.forwardRef<HTMLDivElement, AccordionContainerProps>(
  (
    {
      collapsible = false,
      open: openProp,
      defaultOpen = false,
      onOpenChange,
      disabled,
      className,
      render,
      children,
      ...props
    },
    ref
  ) => {
    const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
    const isControlled = openProp !== undefined;
    const open = isControlled ? openProp : uncontrolledOpen;

    const handleOpenChange = React.useCallback<
      NonNullable<AccordionContainerBaseProps['onOpenChange']>
    >(
      (nextOpen, eventDetails) => {
        if (!isControlled) {
          setUncontrolledOpen(nextOpen);
        }
        onOpenChange?.(nextOpen, eventDetails);
      },
      [isControlled, onOpenChange]
    );

    const resolvedChildren =
      typeof children === 'function' ? children({ open }) : children;

    const contextValue = React.useMemo<AccordionContainerContextValue>(
      () => ({ collapsible }),
      [collapsible]
    );

    if (!collapsible) {
      return (
        <AccordionContainerContext.Provider value={contextValue}>
          {resolvedChildren}
        </AccordionContainerContext.Provider>
      );
    }

    return (
      <AccordionContainerContext.Provider value={contextValue}>
        <CollapsiblePrimitive.Root
          ref={ref}
          render={render}
          className={className}
          open={open}
          onOpenChange={handleOpenChange}
          disabled={disabled}
          {...props}
        >
          {resolvedChildren}
        </CollapsiblePrimitive.Root>
      </AccordionContainerContext.Provider>
    );
  }
);
AccordionContainer.displayName = 'AccordionContainer';

type AccordionContainerTriggerProps = React.ComponentPropsWithoutRef<
  typeof CollapsiblePrimitive.Trigger
>;

const AccordionContainerTrigger = React.forwardRef<
  HTMLButtonElement,
  AccordionContainerTriggerProps
>(({ className, children, ...props }, ref) => {
  const { collapsible } = useAccordionContainerContext();

  if (!collapsible) {
    return null;
  }

  return (
    <CollapsiblePrimitive.Trigger
      ref={ref}
      className={cn(
        'inline-flex size-8 shrink-0 cursor-pointer items-center justify-center border-0 bg-transparent p-0 text-[var(--ui-glyph-on-surface-primary)]',
        '[&[data-panel-open]>svg]:rotate-90 [&:not([data-panel-open])>svg]:rtl:rotate-180',
        className
      )}
      {...props}
    >
      {children ?? <ChevronRightIcon size={16} className="transition-transform duration-200" />}
    </CollapsiblePrimitive.Trigger>
  );
});
AccordionContainerTrigger.displayName = 'AccordionContainerTrigger';

type AccordionContainerContentProps = React.ComponentPropsWithoutRef<
  typeof CollapsiblePrimitive.Panel
>;

const AccordionContainerContent = React.forwardRef<
  React.ElementRef<typeof CollapsiblePrimitive.Panel>,
  AccordionContainerContentProps
>(({ className, children, ...props }, ref) => {
  const { collapsible } = useAccordionContainerContext();

  if (!collapsible) {
    return <>{children}</>;
  }

  return (
    <CollapsiblePrimitive.Panel
      ref={ref}
      className={cn(
        'overflow-hidden transition-[height] duration-200 ease-out data-[ending-style]:h-0 data-[starting-style]:h-0',
        className
      )}
      {...props}
    >
      {children}
    </CollapsiblePrimitive.Panel>
  );
});
AccordionContainerContent.displayName = 'AccordionContainerContent';

const AccordionContainerRoot = Object.assign(AccordionContainer, {
  Trigger: AccordionContainerTrigger,
  Content: AccordionContainerContent,
});

export {
  AccordionContainerRoot as AccordionContainer,
  AccordionContainerTrigger,
  AccordionContainerContent,
  type AccordionContainerProps,
  type AccordionContainerTriggerProps,
  type AccordionContainerContentProps,
  type AccordionContainerState,
};
