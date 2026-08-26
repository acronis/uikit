import * as React from 'react';
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  MagnifierIcon,
} from '@acronis-platform/icons-react/stroke-mono';

import { cn } from '@/lib/utils';

// Presentational half of the InputSelect dropdown list: the search row, the
// section/section-label boxes, the inner item-row layout, and the tree expander.
// Nothing here reads Base UI's Select context or renders a `SelectPrimitive.*`
// element, so each piece can be composed into a non-Select surface (e.g. a
// Popover-hosted list) as-is. The Select-coupled wrappers live in
// `input-select.tsx` and delegate their markup down to these.

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

/**
 * The search row's markup (magnifier + input) as a plain controlled component.
 * It owns no query state and reads no context — the caller supplies `value` and
 * `onChange`.
 */
const InputSelectSearchField = React.forwardRef<
  HTMLInputElement,
  React.ComponentPropsWithoutRef<'input'>
>(({ className, ...props }, ref) => (
  <div className="flex items-center gap-[var(--ui-input-select-dropdown-dropdown-search-gap)] px-[var(--ui-input-select-dropdown-dropdown-search-padding-x)] py-[var(--ui-input-select-dropdown-dropdown-search-padding-y)]">
    <MagnifierIcon
      size={16}
      className="shrink-0 text-[var(--ui-glyph-on-surface-primary)]"
    />
    <input
      ref={ref}
      type="search"
      className={cn(
        'min-w-0 flex-1 border-0 bg-transparent p-0 text-sm leading-6 text-[var(--ui-input-select-dropdown-dropdown-search-label-color-value)] outline-none placeholder:text-[var(--ui-input-select-dropdown-dropdown-search-label-color-placeholder)] [&::-webkit-search-cancel-button]:appearance-none',
        className
      )}
      {...props}
    />
  </div>
));
InputSelectSearchField.displayName = 'InputSelectSearchField';

/** The section (group) box — border-divided vertical stack of rows. */
const InputSelectSectionView = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<'div'>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex flex-col border-t border-[var(--ui-input-select-dropdown-section-container-border-color)] py-[var(--ui-input-select-dropdown-section-container-padding-y)] first:border-t-0',
      className
    )}
    {...props}
  />
));
InputSelectSectionView.displayName = 'InputSelectSectionView';

/** The section header text box. Matches `Select.GroupLabel`'s default `div` element. */
const InputSelectSectionLabelView = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<'div'>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'px-[var(--ui-input-select-dropdown-section-container-header-padding-x)] py-[var(--ui-input-select-dropdown-section-container-header-padding-y)] text-sm font-semibold leading-6 text-[var(--ui-input-select-dropdown-section-label-group-color)]',
      className
    )}
    {...props}
  />
));
InputSelectSectionLabelView.displayName = 'InputSelectSectionLabelView';

export interface InputSelectRowContentProps {
  /**
   * Multiple-selection mode: renders the leading checkbox glyph. The glyph's
   * checked state is driven by the `group/item` ancestor's `data-selected`
   * attribute, so the caller owns the outer row element.
   */
  multiple?: boolean;
  /** 1-based nesting level (0 / omitted = no indent). Levels 1–3 reserve 16 / 40 / 64 px. */
  indent?: number;
  /** Optional leading icon rendered before the label. */
  icon?: React.ReactNode;
  /** The label element (e.g. a `Select.ItemText`). */
  labelSlot: React.ReactNode;
  /** Optional trailing element (e.g. a selected-state check indicator). */
  trailingSlot?: React.ReactNode;
}

/**
 * Inner layout of a dropdown row: leading checkbox glyph, nesting spacer, leading
 * icon, label slot, trailing slot. Deliberately excludes the outer row element —
 * the background/highlight classes and the `group/item` marker belong on whatever
 * selectable element the caller renders.
 */
function InputSelectRowContent({
  multiple,
  indent,
  icon,
  labelSlot,
  trailingSlot,
}: InputSelectRowContentProps) {
  return (
    <>
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
      {labelSlot}
      {trailingSlot}
    </>
  );
}
InputSelectRowContent.displayName = 'InputSelectRowContent';

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

export {
  InputSelectSearchField,
  InputSelectSectionView,
  InputSelectSectionLabelView,
  InputSelectRowContent,
  InputSelectExpander,
};
