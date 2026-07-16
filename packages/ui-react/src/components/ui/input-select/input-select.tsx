import * as React from 'react';
import { Select as SelectPrimitive } from '@base-ui/react/select';
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  CircleWarningIcon,
  InboxIcon,
  MagnifierIcon,
} from '@acronis-platform/icons-react/stroke-mono';

import { cn } from '@/lib/utils';
import { usePortalContainer } from '@/lib/portal-container';

// The next-gen select, themed by the dedicated `--ui-input-select-*` tier (global /
// normal / error / dropdown). It composes Base UI `Select` and adds the field
// furniture (label, required, description, error) and the dropdown machinery
// (in-dropdown search, sections/groups, single + multiple items, loading/empty/error
// status). The trigger box wires each state to its own token — idle / hover / open
// (`data-popup-open`) + focus ring / disabled — and switches to the error border +
// `--ui-focus-error` ring when `aria-invalid` is set. Selection mode (single vs
// multiple) flows from the `multiple` prop on the root via `InputSelectModeContext`:
// single items toggle the row background and show a trailing check; multiple items
// keep the row background and show a leading checkbox.

const InputSelectModeContext = React.createContext(false);

interface InputSelectFilterContextValue {
  /** Current in-dropdown search query. */
  query: string;
  /** Update the search query. */
  setQuery: (query: string) => void;
}

const InputSelectFilterContext =
  React.createContext<InputSelectFilterContextValue | null>(null);

/**
 * Read the live in-dropdown search query (and its setter) from the nearest
 * `InputSelect`. Flat item lists filter themselves; use this for hierarchical
 * (tree) dropdowns that need to compute their own visibility.
 */
function useInputSelectFilter(): InputSelectFilterContextValue {
  const context = React.useContext(InputSelectFilterContext);
  if (!context) {
    throw new Error('useInputSelectFilter must be used within <InputSelect>.');
  }
  return context;
}

function InputSelect<Value, Multiple extends boolean | undefined = false>(
  props: SelectPrimitive.Root.Props<Value, Multiple>
) {
  const { onOpenChange } = props;
  const [query, setQuery] = React.useState('');
  const filter = React.useMemo(() => ({ query, setQuery }), [query]);

  // Reset the query when the popup closes so it reopens unfiltered.
  const handleOpenChange = React.useCallback<
    NonNullable<SelectPrimitive.Root.Props<Value, Multiple>['onOpenChange']>
  >(
    (open, eventDetails) => {
      onOpenChange?.(open, eventDetails);
      if (!open) {
        setQuery('');
      }
    },
    [onOpenChange]
  );

  return (
    <InputSelectModeContext.Provider value={Boolean(props.multiple)}>
      <InputSelectFilterContext.Provider value={filter}>
        <SelectPrimitive.Root {...props} onOpenChange={handleOpenChange} />
      </InputSelectFilterContext.Provider>
    </InputSelectModeContext.Provider>
  );
}
InputSelect.displayName = 'InputSelect';

const InputSelectGroup = SelectPrimitive.Group;

/** Vertical field stack: label, trigger, description/error. */
const InputSelectField = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<'div'>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex w-full min-w-[var(--ui-input-select-global-container-width-min)] flex-col gap-[var(--ui-input-select-global-container-gap)]',
      className
    )}
    {...props}
  />
));
InputSelectField.displayName = 'InputSelectField';

const InputSelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label> & {
    /** Appends a required `*` after the label text. */
    required?: boolean;
  }
>(({ className, children, required, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn(
      'flex gap-[var(--ui-input-select-global-container-label-gap)] text-sm leading-4 text-[var(--ui-input-select-global-label-color-idle)] data-[disabled]:text-[var(--ui-input-select-global-label-color-disabled)]',
      className
    )}
    {...props}
  >
    {children}
    {required && (
      <span
        aria-hidden="true"
        className="text-[var(--ui-input-select-global-required-color)]"
      >
        *
      </span>
    )}
  </SelectPrimitive.Label>
));
InputSelectLabel.displayName = 'InputSelectLabel';

const InputSelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      'group flex h-[var(--ui-input-select-global-box-height)] w-full min-w-0 items-center gap-[var(--ui-input-select-global-box-gap)] rounded-[var(--ui-input-select-global-box-border-radius)] border bg-[var(--ui-input-select-global-box-color-idle)] border-[var(--ui-input-select-normal-box-border-color-idle)] px-[var(--ui-input-select-global-box-padding-x)] text-sm leading-6 text-[var(--ui-input-select-global-value-color-idle)] outline-none transition-colors',
      'not-data-[disabled]:hover:bg-[var(--ui-input-select-global-box-color-hover)] not-data-[disabled]:hover:border-[var(--ui-input-select-normal-box-border-color-hover)]',
      'focus-visible:border-[var(--ui-input-select-normal-box-border-color-hover)] focus-visible:ring-[3px] focus-visible:ring-[var(--ui-focus-primary)]',
      'data-[popup-open]:border-[var(--ui-input-select-normal-box-border-color-hover)] data-[popup-open]:ring-[3px] data-[popup-open]:ring-[var(--ui-focus-primary)]',
      'data-[disabled]:cursor-not-allowed data-[disabled]:border-[var(--ui-input-select-normal-box-border-color-disabled)] data-[disabled]:bg-[var(--ui-input-select-global-box-color-disabled)] data-[disabled]:text-[var(--ui-input-select-global-value-color-disabled)]',
      // Error treatment (driven by `aria-invalid`).
      'aria-invalid:border-[var(--ui-input-select-error-box-border-color-idle)] not-data-[disabled]:aria-invalid:hover:border-[var(--ui-input-select-error-box-border-color-hover)] aria-invalid:focus-visible:border-[var(--ui-input-select-error-box-border-color-hover)] aria-invalid:focus-visible:ring-[var(--ui-focus-error)] aria-invalid:data-[popup-open]:border-[var(--ui-input-select-error-box-border-color-hover)] aria-invalid:data-[popup-open]:ring-[var(--ui-focus-error)]',
      className
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon className="flex shrink-0 items-center text-[var(--ui-input-select-normal-icon-expand-color-idle)] group-data-[disabled]:text-[var(--ui-input-select-normal-icon-expand-color-disabled)]">
      <ChevronDownIcon
        size={16}
        className="transition-transform group-data-[popup-open]:rotate-180"
      />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
));
InputSelectTrigger.displayName = 'InputSelectTrigger';

const InputSelectValue = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Value>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Value>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Value
    ref={ref}
    className={cn(
      'min-w-0 flex-1 truncate text-start text-[var(--ui-input-select-global-value-color-idle)] data-[placeholder]:text-[var(--ui-input-select-global-placeholder-color-idle)]',
      'group-data-[disabled]:!text-[var(--ui-input-select-global-value-color-disabled)] group-data-[disabled]:data-[placeholder]:!text-[var(--ui-input-select-global-placeholder-color-disabled)]',
      className
    )}
    {...props}
  />
));
InputSelectValue.displayName = 'InputSelectValue';

const InputSelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Popup>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Popup> & {
    sideOffset?: number;
    align?: SelectPrimitive.Positioner.Props['align'];
    side?: SelectPrimitive.Positioner.Props['side'];
    /**
     * Container to portal the dropdown into. Defaults to the document body;
     * pass an element to scope the portal (e.g. a shadow root, so the popup
     * inherits styles defined there).
     */
    portalContainer?: SelectPrimitive.Portal.Props['container'];
  }
>(
  (
    {
      className,
      children,
      sideOffset = 4,
      align = 'start',
      side = 'bottom',
      portalContainer,
      ...props
    },
    ref
  ) => {
    const ctxContainer = usePortalContainer();
    const resolvedContainer = portalContainer ?? ctxContainer;

    return (
    <SelectPrimitive.Portal container={resolvedContainer}>
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
            'max-h-[var(--available-height)] min-w-[var(--anchor-width)] overflow-y-auto rounded-[var(--ui-input-select-dropdown-container-border-radius)] border border-[var(--ui-input-select-dropdown-container-border-color)] bg-[var(--ui-input-select-dropdown-container-color)] py-[var(--ui-input-select-dropdown-container-padding-y)] text-sm shadow-md outline-none',
            className
          )}
          {...props}
        >
          {children}
        </SelectPrimitive.Popup>
      </SelectPrimitive.Positioner>
    </SelectPrimitive.Portal>
    );
  }
);
InputSelectContent.displayName = 'InputSelectContent';

/**
 * In-dropdown search row (magnifier + input). By default it drives the
 * `InputSelect` filter context — flat `InputSelectItem`s filter themselves, and
 * tree dropdowns read the query via `useInputSelectFilter`. Pass `value`/`onChange`
 * to control the query externally.
 */
const InputSelectSearch = React.forwardRef<
  HTMLInputElement,
  React.ComponentPropsWithoutRef<'input'>
>(({ className, value, onChange, onKeyDown, ...props }, ref) => {
  const filter = React.useContext(InputSelectFilterContext);
  return (
    <div className="flex items-center gap-[var(--ui-input-select-dropdown-dropdown-search-gap)] px-[var(--ui-input-select-dropdown-dropdown-search-padding-x)] py-[var(--ui-input-select-dropdown-dropdown-search-padding-y)]">
      <MagnifierIcon
        size={16}
        className="shrink-0 text-[var(--ui-glyph-on-surface-primary)]"
      />
      <input
        ref={ref}
        type="search"
        value={value ?? filter?.query ?? ''}
        onChange={(event) => {
          onChange?.(event);
          filter?.setQuery(event.currentTarget.value);
        }}
        // Base UI Select's typeahead would consume printable keys before they
        // reach this input, so stop those from bubbling — but let navigation and
        // selection keys (Arrow*/Home/End/Enter/Escape, all multi-char `key`
        // names) through so the user can move from the search box into the
        // filtered list and pick a result with the keyboard.
        onKeyDown={(event) => {
          onKeyDown?.(event);
          if (event.key.length === 1) {
            event.stopPropagation();
          }
        }}
        className={cn(
          'min-w-0 flex-1 border-0 bg-transparent p-0 text-sm leading-6 text-[var(--ui-input-select-dropdown-dropdown-search-label-color-value)] outline-none placeholder:text-[var(--ui-input-select-dropdown-dropdown-search-label-color-placeholder)] [&::-webkit-search-cancel-button]:appearance-none',
          className
        )}
        {...props}
      />
    </div>
  );
});
InputSelectSearch.displayName = 'InputSelectSearch';

/** A section (group) of items with an optional header. Divided by a top border. */
const InputSelectSection = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Group>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Group>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Group
    ref={ref}
    className={cn(
      'flex flex-col border-t border-[var(--ui-input-select-dropdown-section-container-border-color)] py-[var(--ui-input-select-dropdown-section-container-padding-y)] first:border-t-0',
      className
    )}
    {...props}
  />
));
InputSelectSection.displayName = 'InputSelectSection';

const InputSelectSectionLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.GroupLabel>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.GroupLabel>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.GroupLabel
    ref={ref}
    className={cn(
      'px-[var(--ui-input-select-dropdown-section-container-header-padding-x)] py-[var(--ui-input-select-dropdown-section-container-header-padding-y)] text-sm font-semibold leading-6 text-[var(--ui-input-select-dropdown-section-label-group-color)]',
      className
    )}
    {...props}
  />
));
InputSelectSectionLabel.displayName = 'InputSelectSectionLabel';

/**
 * Width (px) of the leading nesting spacer for a 1-based tree `indent` level, per
 * the Figma "InputSelectDropdownTenants" spec: level 1 reserves 16 px (enough for a
 * single chevron) and each deeper level adds 24 px — 16 / 40 / 64 for levels 1–3.
 * The tenant icon therefore starts at the same x-position whether or not the row is
 * expandable, because the chevron lives right-aligned inside this reserved space.
 */
const NESTING_BASE = 16;
const NESTING_STEP = 24;
function nestingWidth(indent: number): number {
  return NESTING_BASE + (indent - 1) * NESTING_STEP;
}

export interface InputSelectItemProps
  extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item> {
  /** Optional leading icon rendered before the label text. Colored by `--ui-input-select-dropdown-item-global-icon-tenant`. */
  icon?: React.ReactNode;
  /** 1-based nesting level (0 / omitted = no indent). Levels 1–3 reserve 16 / 40 / 64 px. */
  indent?: number;
  /**
   * Text used to match the in-dropdown search query. Defaults to the string
   * `children`. When a query is active and this text doesn't match, the row hides
   * itself — unless `hidden` is passed explicitly (tree dropdowns compute their own
   * visibility). Rows stay mounted while hidden to keep Base UI's selection index
   * stable.
   */
  textValue?: string;
}

const InputSelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  InputSelectItemProps
>(({ className, children, icon, indent, textValue, hidden, ...props }, ref) => {
  const multiple = React.useContext(InputSelectModeContext);
  const filter = React.useContext(InputSelectFilterContext);
  const query = filter?.query.trim().toLowerCase() ?? '';
  const label = textValue ?? (typeof children === 'string' ? children : undefined);
  const autoHidden =
    query.length > 0 && label !== undefined && !label.toLowerCase().includes(query);
  return (
    <SelectPrimitive.Item
      ref={ref}
      hidden={hidden ?? autoHidden}
      className={cn(
        'group/item relative flex cursor-default items-center gap-[var(--ui-input-select-dropdown-item-global-container-gap)] px-[var(--ui-input-select-dropdown-item-global-container-padding-x)] py-[var(--ui-input-select-dropdown-item-global-container-padding-y)] leading-6 text-[var(--ui-input-select-dropdown-item-global-label-color)] outline-none select-none',
        'bg-[var(--ui-input-select-dropdown-item-unselected-container-color-idle)] data-[highlighted]:bg-[var(--ui-input-select-dropdown-item-unselected-container-color-hover)]',
        // Single-select rows tint when selected; multiple-select rows keep the
        // unselected background (the leading checkbox carries the state).
        !multiple &&
          'data-[selected]:bg-[var(--ui-input-select-dropdown-item-selected-container-color-idle)] data-[selected]:data-[highlighted]:bg-[var(--ui-input-select-dropdown-item-selected-container-color-hover)]',
        'data-[disabled]:pointer-events-none data-[disabled]:bg-[var(--ui-input-select-dropdown-item-unselected-container-color-disabled)]',
        className
      )}
      {...props}
    >
      {multiple && (
        <span
          aria-hidden="true"
          className="flex size-[var(--ui-checkbox-global-box-size)] shrink-0 items-center justify-center rounded-[var(--ui-checkbox-global-box-border-radius)] border-[length:var(--ui-checkbox-global-box-border-width)] border-[var(--ui-checkbox-unchecked-box-border-color-idle)] bg-[var(--ui-checkbox-unchecked-box-color-idle)] text-transparent group-data-[selected]/item:border-[var(--ui-checkbox-checked-box-border-color-idle)] group-data-[selected]/item:bg-[var(--ui-checkbox-checked-box-color-idle)] group-data-[selected]/item:text-[var(--ui-checkbox-checked-icon-color-idle)]"
        >
          <CheckIcon size={16} />
        </span>
      )}
      {typeof indent === 'number' && indent > 0 && (
        <span
          aria-hidden="true"
          className="size-4 shrink-0"
          style={{ minWidth: nestingWidth(indent) }}
        />
      )}
      {icon && (
        <span className="flex shrink-0 items-center text-[var(--ui-input-select-dropdown-item-global-icon-tenant)]">
          {icon}
        </span>
      )}
      <SelectPrimitive.ItemText className="min-w-0 flex-1 truncate">
        {children}
      </SelectPrimitive.ItemText>
      {!multiple && (
        <SelectPrimitive.ItemIndicator className="flex shrink-0 items-center text-[var(--ui-input-select-dropdown-item-global-icon-checked)]">
          <CheckIcon size={16} />
        </SelectPrimitive.ItemIndicator>
      )}
    </SelectPrimitive.Item>
  );
});
InputSelectItem.displayName = 'InputSelectItem';

export interface InputSelectExpanderProps
  extends React.ComponentPropsWithoutRef<'button'> {
  /** Whether the group is currently expanded. */
  expanded: boolean;
  /** Called when the user clicks the row to toggle expand/collapse. */
  onToggle: () => void;
  /** Optional leading icon rendered after the chevron. */
  icon?: React.ReactNode;
  /** 1-based nesting level (0 / omitted = level 1). Levels 1–3 reserve 16 / 40 / 64 px; the chevron sits right-aligned inside. */
  indent?: number;
}

/**
 * A non-selectable row that acts as an expand/collapse toggle for a tree group.
 * Visually identical to `InputSelectItem` but is **not** a `SelectPrimitive.Item`,
 * so clicking it won't set the select value.
 *
 * When collapsing a group, keep its child `InputSelectItem`s mounted and toggle
 * their `hidden` prop rather than unmounting them: Base UI's Select tracks the
 * selection by list index, so removing the selected row from the DOM makes a
 * sibling inherit its index and render a phantom check. `hidden` rows keep the
 * indices stable and are skipped by keyboard navigation.
 */
const InputSelectExpander = React.forwardRef<
  HTMLButtonElement,
  InputSelectExpanderProps
>(({ className, children, expanded, onToggle, icon, indent, ...props }, ref) => (
  <button
    ref={ref}
    type="button"
    onClick={onToggle}
    aria-expanded={expanded}
    className={cn(
      'group/item relative flex w-full cursor-default items-center gap-[var(--ui-input-select-dropdown-item-global-container-gap)] px-[var(--ui-input-select-dropdown-item-global-container-padding-x)] py-[var(--ui-input-select-dropdown-item-global-container-padding-y)] text-start leading-6 text-[var(--ui-input-select-dropdown-item-global-label-color)] outline-none select-none',
      'bg-[var(--ui-input-select-dropdown-item-unselected-container-color-idle)] hover:bg-[var(--ui-input-select-dropdown-item-unselected-container-color-hover)]',
      className
    )}
    {...props}
  >
    <span
      aria-hidden="true"
      className="flex shrink-0 items-center justify-end text-[var(--ui-input-select-dropdown-item-global-icon-collapse)]"
      style={{
        minWidth:
          typeof indent === 'number' && indent > 0 ? nestingWidth(indent) : NESTING_BASE,
      }}
    >
      {expanded ? <ChevronDownIcon size={16} /> : <ChevronRightIcon size={16} />}
    </span>
    {icon && (
      <span className="flex shrink-0 items-center text-[var(--ui-input-select-dropdown-item-global-icon-tenant)]">
        {icon}
      </span>
    )}
    <span className="min-w-0 flex-1 truncate">{children}</span>
  </button>
));
InputSelectExpander.displayName = 'InputSelectExpander';

const InputSelectDescription = React.forwardRef<
  HTMLParagraphElement,
  React.ComponentPropsWithoutRef<'p'>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      'text-xs leading-4 text-[var(--ui-input-select-normal-description-color-idle)]',
      className
    )}
    {...props}
  />
));
InputSelectDescription.displayName = 'InputSelectDescription';

const InputSelectError = React.forwardRef<
  HTMLParagraphElement,
  React.ComponentPropsWithoutRef<'p'>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      'text-xs leading-4 text-[var(--ui-input-select-error-error-msg-color)]',
      className
    )}
    {...props}
  />
));
InputSelectError.displayName = 'InputSelectError';

export interface InputSelectStatusProps
  extends React.ComponentPropsWithoutRef<'div'> {
  /** Which status to show. Drives the leading icon. */
  variant: 'loading' | 'empty' | 'error';
  /** Optional trailing action (e.g. a "Try again" button) — shown for `error`. */
  action?: React.ReactNode;
}

/** Loading / empty / error status row shown instead of items inside the dropdown. */
const InputSelectStatus = React.forwardRef<HTMLDivElement, InputSelectStatusProps>(
  ({ className, variant, children, action, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex min-h-[var(--ui-input-select-dropdown-container-status-width-min)] flex-col items-center justify-center gap-[var(--ui-input-select-dropdown-container-status-gap)] border-t border-[var(--ui-input-select-dropdown-section-container-border-color)] px-[var(--ui-input-select-dropdown-container-status-padding-x)] py-[var(--ui-input-select-dropdown-container-status-padding-y)] text-center text-sm leading-6 text-[var(--ui-input-select-dropdown-item-global-label-color)]',
        className
      )}
      {...props}
    >
      {variant === 'loading' && (
        <span
          aria-hidden="true"
          className="size-6 animate-spin rounded-full border-2 border-[var(--ui-glyph-on-surface-primary)] border-t-transparent"
        />
      )}
      {variant === 'empty' && <InboxIcon size={24} className="text-[var(--ui-glyph-on-status-info)]" />}
      {variant === 'error' && <CircleWarningIcon size={24} className="text-[var(--ui-glyph-on-status-warning)]" />}
      {children}
      {variant === 'error' && action}
    </div>
  )
);
InputSelectStatus.displayName = 'InputSelectStatus';

export {
  InputSelect,
  InputSelectField,
  InputSelectLabel,
  InputSelectTrigger,
  InputSelectValue,
  InputSelectContent,
  InputSelectSearch,
  InputSelectGroup,
  InputSelectSection,
  InputSelectSectionLabel,
  InputSelectItem,
  InputSelectExpander,
  InputSelectDescription,
  InputSelectError,
  InputSelectStatus,
  useInputSelectFilter,
};
