'use client';

import * as React from 'react';
import { Combobox as ComboboxPrimitive } from '@base-ui/react/combobox';
import {
  CheckIcon,
  ChevronDownIcon,
  TimesIcon,
} from '@acronis-platform/icons-react/stroke-mono';

import { cn } from '@/lib/utils';

// A searchable single/multi-select built on Base UI's Combobox primitive. The
// legacy `combobox` was only a hardcoded Popover + cmdk demo; this is a real,
// reusable component. There is no `--ui-combobox-*` tier, so it reuses the
// `--ui-input-select-*` tokens (already imported) — the field box, dropdown
// container, and items match InputSelect, the non-searchable sibling. The Root
// auto-extracts `{ value, label }` items and filters them by the input value.

function Combobox<Value, Multiple extends boolean | undefined = false>(
  props: ComboboxPrimitive.Root.Props<Value, Multiple>
) {
  return <ComboboxPrimitive.Root {...props} />;
}
Combobox.displayName = 'Combobox';

export interface ComboboxInputProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof ComboboxPrimitive.Input>,
    'className'
  > {
  className?: string;
  /** Wrapper (box) className. */
  containerClassName?: string;
  /** Show a clear (✕) button while the field has a value. */
  clearable?: boolean;
}

// The field box: a typeable input + a clear button (optional) + a chevron trigger.
const ComboboxInput = React.forwardRef<
  HTMLInputElement,
  ComboboxInputProps
>(({ className, containerClassName, clearable, ...props }, ref) => (
  // InputGroup (not a plain div) is the popup's anchor, so the dropdown aligns to
  // the box's left edge rather than to the bare input inside the box padding.
  <ComboboxPrimitive.InputGroup
    className={cn(
      'group flex h-[var(--ui-input-select-global-box-height)] w-full min-w-0 items-center gap-[var(--ui-input-select-global-box-gap)] rounded-[var(--ui-input-select-global-box-border-radius)] border bg-[var(--ui-input-select-global-box-color-idle)] border-[var(--ui-input-select-normal-box-border-color-idle)] px-[var(--ui-input-select-global-box-padding-x)] text-sm leading-6 transition-colors',
      'not-has-disabled:hover:bg-[var(--ui-input-select-global-box-color-hover)] not-has-disabled:hover:border-[var(--ui-input-select-normal-box-border-color-hover)]',
      'has-[input:focus-visible]:border-[var(--ui-input-select-normal-box-border-color-hover)] has-[input:focus-visible]:ring-[3px] has-[input:focus-visible]:ring-[var(--ui-focus-primary)]',
      'has-disabled:cursor-not-allowed has-disabled:border-[var(--ui-input-select-normal-box-border-color-disabled)] has-disabled:bg-[var(--ui-input-select-global-box-color-disabled)]',
      'has-[input[aria-invalid=true]]:border-[var(--ui-input-select-error-box-border-color-idle)] has-[input[aria-invalid=true]:focus-visible]:ring-[var(--ui-focus-error)]',
      containerClassName
    )}
  >
    <ComboboxPrimitive.Input
      ref={ref}
      className={cn(
        'min-w-0 flex-1 bg-transparent text-[var(--ui-input-select-global-value-color-idle)] outline-none placeholder:text-[var(--ui-input-select-global-placeholder-color-idle)] disabled:cursor-not-allowed disabled:text-[var(--ui-input-select-global-value-color-disabled)]',
        className
      )}
      {...props}
    />
    {clearable && (
      <ComboboxPrimitive.Clear
        aria-label="Clear"
        className="flex shrink-0 cursor-pointer items-center text-[var(--ui-input-select-normal-icon-expand-color-idle)] outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--ui-focus-primary)] data-[disabled]:hidden"
      >
        <TimesIcon size={16} />
      </ComboboxPrimitive.Clear>
    )}
    <ComboboxPrimitive.Trigger
      aria-label="Toggle"
      className="flex shrink-0 cursor-pointer items-center text-[var(--ui-input-select-normal-icon-expand-color-idle)] outline-none group-has-disabled:text-[var(--ui-input-select-normal-icon-expand-color-disabled)]"
    >
      <ChevronDownIcon
        size={16}
        className="transition-transform group-has-[input[aria-expanded=true]]:rotate-180"
      />
    </ComboboxPrimitive.Trigger>
  </ComboboxPrimitive.InputGroup>
));
ComboboxInput.displayName = 'ComboboxInput';

export interface ComboboxContentProps
  extends React.ComponentPropsWithoutRef<typeof ComboboxPrimitive.Popup> {
  sideOffset?: number;
  align?: ComboboxPrimitive.Positioner.Props['align'];
  side?: ComboboxPrimitive.Positioner.Props['side'];
  /** Container to portal into (e.g. a shadow root, so the popup inherits styles). */
  portalContainer?: ComboboxPrimitive.Portal.Props['container'];
}

const ComboboxContent = React.forwardRef<
  React.ElementRef<typeof ComboboxPrimitive.Popup>,
  ComboboxContentProps
>(
  (
    { className, children, sideOffset = 4, align = 'start', side = 'bottom', portalContainer, ...props },
    ref
  ) => (
    <ComboboxPrimitive.Portal container={portalContainer}>
      <ComboboxPrimitive.Positioner
        sideOffset={sideOffset}
        align={align}
        side={side}
        className="z-50 outline-none"
      >
        <ComboboxPrimitive.Popup
          ref={ref}
          className={cn(
            'max-h-[var(--available-height)] min-w-[var(--anchor-width)] overflow-y-auto rounded-[var(--ui-input-select-dropdown-container-border-radius)] border border-[var(--ui-input-select-dropdown-container-border-color)] bg-[var(--ui-input-select-dropdown-container-color)] py-[var(--ui-input-select-dropdown-container-padding-y)] text-sm shadow-md outline-none',
            className
          )}
          {...props}
        >
          {children}
        </ComboboxPrimitive.Popup>
      </ComboboxPrimitive.Positioner>
    </ComboboxPrimitive.Portal>
  )
);
ComboboxContent.displayName = 'ComboboxContent';

const ComboboxList = React.forwardRef<
  React.ElementRef<typeof ComboboxPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof ComboboxPrimitive.List>
>(({ className, ...props }, ref) => (
  <ComboboxPrimitive.List
    ref={ref}
    className={cn('flex flex-col', className)}
    {...props}
  />
));
ComboboxList.displayName = 'ComboboxList';

const ComboboxItem = React.forwardRef<
  React.ElementRef<typeof ComboboxPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof ComboboxPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <ComboboxPrimitive.Item
    ref={ref}
    className={cn(
      'relative flex cursor-default items-center gap-[var(--ui-input-select-dropdown-item-global-container-gap)] px-[var(--ui-input-select-dropdown-item-global-container-padding-x)] py-[var(--ui-input-select-dropdown-item-global-container-padding-y)] leading-6 text-[var(--ui-input-select-dropdown-item-global-label-color)] outline-none select-none',
      'bg-[var(--ui-input-select-dropdown-item-unselected-container-color-idle)] data-[highlighted]:bg-[var(--ui-input-select-dropdown-item-unselected-container-color-hover)]',
      'data-[selected]:bg-[var(--ui-input-select-dropdown-item-selected-container-color-idle)] data-[selected]:data-[highlighted]:bg-[var(--ui-input-select-dropdown-item-selected-container-color-hover)]',
      'data-[disabled]:pointer-events-none data-[disabled]:bg-[var(--ui-input-select-dropdown-item-unselected-container-color-disabled)]',
      className
    )}
    {...props}
  >
    <span className="min-w-0 flex-1 truncate">{children}</span>
    <ComboboxPrimitive.ItemIndicator className="flex shrink-0 items-center text-[var(--ui-input-select-normal-icon-expand-color-hover)]">
      <CheckIcon size={16} />
    </ComboboxPrimitive.ItemIndicator>
  </ComboboxPrimitive.Item>
));
ComboboxItem.displayName = 'ComboboxItem';

const ComboboxEmpty = React.forwardRef<
  React.ElementRef<typeof ComboboxPrimitive.Empty>,
  React.ComponentPropsWithoutRef<typeof ComboboxPrimitive.Empty>
>(({ className, ...props }, ref) => (
  <ComboboxPrimitive.Empty
    ref={ref}
    className={cn(
      'px-[var(--ui-input-select-dropdown-item-global-container-padding-x)] py-[var(--ui-input-select-dropdown-item-global-container-padding-y)] text-center text-sm leading-6 text-[var(--ui-input-select-normal-description-color-idle)] empty:m-0 empty:p-0',
      className
    )}
    {...props}
  />
));
ComboboxEmpty.displayName = 'ComboboxEmpty';

const ComboboxGroup = ComboboxPrimitive.Group;

const ComboboxGroupLabel = React.forwardRef<
  React.ElementRef<typeof ComboboxPrimitive.GroupLabel>,
  React.ComponentPropsWithoutRef<typeof ComboboxPrimitive.GroupLabel>
>(({ className, ...props }, ref) => (
  <ComboboxPrimitive.GroupLabel
    ref={ref}
    className={cn(
      'px-[var(--ui-input-select-dropdown-section-container-header-padding-x)] py-[var(--ui-input-select-dropdown-section-container-header-padding-y)] text-sm font-semibold leading-6 text-[var(--ui-input-select-dropdown-section-label-group-color)]',
      className
    )}
    {...props}
  />
));
ComboboxGroupLabel.displayName = 'ComboboxGroupLabel';

export {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxGroupLabel,
};
