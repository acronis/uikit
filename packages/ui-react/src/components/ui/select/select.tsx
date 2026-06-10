import * as React from 'react';
import { Select as SelectPrimitive } from '@base-ui/react/select';
import { CheckIcon, ChevronDownIcon } from '@acronis-platform/icons-react/stroke-mono';

import { cn } from '@/lib/utils';

// A select: a Base UI `Select` themed with the shared `--ui-form-*` token tier
// (the same tier Input/Search use). The trigger is the Figma "Select" box —
// 32px tall, bordered, rounded — and wires each state to its own token:
// idle / hover (`--ui-form-border-hover`) / open+focus (`--ui-form-border-active`
// + a 3px `--ui-focus-primary` ring) / disabled. The chevron uses
// `--ui-form-icon-idle` and rotates when the popup is open. The popup and items
// aren't in the Figma spec, so they use the shared semantic surface vocabulary
// (`bg-background`, `bg-accent`, `border-border`). Label, description, and error
// message are composed by the consumer (a Field component is future work).

const Select = SelectPrimitive.Root;

const SelectGroup = SelectPrimitive.Group;

const SelectValue = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Value>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Value>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Value
    ref={ref}
    className={cn(
      'min-w-0 flex-1 truncate text-left text-[var(--ui-form-text-value)] data-[placeholder]:text-[var(--ui-form-text-placeholder)]',
      // Disabled wins over the value/placeholder color regardless of variant order.
      'group-data-[disabled]:!text-[var(--ui-form-text-disabled)]',
      className
    )}
    {...props}
  />
));
SelectValue.displayName = 'SelectValue';

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      'group flex h-8 w-full min-w-0 items-center gap-2 rounded border bg-[var(--ui-form-background-idle)] border-[var(--ui-form-border-idle)] px-3 text-sm leading-6 text-[var(--ui-form-text-value)] outline-none transition-colors',
      'not-data-[disabled]:hover:border-[var(--ui-form-border-hover)]',
      'focus-visible:border-[var(--ui-form-border-active)] focus-visible:ring-[3px] focus-visible:ring-[var(--ui-focus-primary)]',
      'data-[popup-open]:border-[var(--ui-form-border-active)] data-[popup-open]:ring-[3px] data-[popup-open]:ring-[var(--ui-focus-primary)]',
      'data-[disabled]:cursor-not-allowed data-[disabled]:border-[var(--ui-form-border-disabled)] data-[disabled]:bg-[var(--ui-form-background-disabled)] data-[disabled]:text-[var(--ui-form-text-disabled)]',
      className
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon className="flex shrink-0 items-center text-[var(--ui-form-icon-idle)] group-data-[disabled]:text-[var(--ui-form-icon-disabled)]">
      <ChevronDownIcon
        size={16}
        className="transition-transform group-data-[popup-open]:rotate-180"
      />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
));
SelectTrigger.displayName = 'SelectTrigger';

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Popup>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Popup> & {
    sideOffset?: number;
    align?: SelectPrimitive.Positioner.Props['align'];
    side?: SelectPrimitive.Positioner.Props['side'];
  }
>(({ className, children, sideOffset = 4, align = 'start', side = 'bottom', ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Positioner
      sideOffset={sideOffset}
      align={align}
      side={side}
      alignItemWithTrigger={false}
      className="z-50 outline-none"
    >
      <SelectPrimitive.Popup
        ref={ref}
        className={cn(
          'max-h-[var(--available-height)] min-w-[var(--anchor-width)] overflow-y-auto rounded border border-border bg-background py-1 text-sm text-foreground shadow-md outline-none',
          className
        )}
        {...props}
      >
        {children}
      </SelectPrimitive.Popup>
    </SelectPrimitive.Positioner>
  </SelectPrimitive.Portal>
));
SelectContent.displayName = 'SelectContent';

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      'relative flex cursor-default items-center gap-2 py-1.5 pr-8 pl-3 leading-6 outline-none select-none',
      'data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground',
      'data-[disabled]:pointer-events-none data-[disabled]:text-[var(--ui-form-text-disabled)]',
      className
    )}
    {...props}
  >
    <SelectPrimitive.ItemText className="min-w-0 flex-1 truncate">
      {children}
    </SelectPrimitive.ItemText>
    <SelectPrimitive.ItemIndicator className="absolute right-2 flex items-center text-[var(--ui-form-icon-idle)]">
      <CheckIcon size={16} />
    </SelectPrimitive.ItemIndicator>
  </SelectPrimitive.Item>
));
SelectItem.displayName = 'SelectItem';

const SelectGroupLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.GroupLabel>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.GroupLabel>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.GroupLabel
    ref={ref}
    className={cn('px-3 py-1.5 text-xs text-muted-foreground', className)}
    {...props}
  />
));
SelectGroupLabel.displayName = 'SelectGroupLabel';

export {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectGroupLabel,
};
