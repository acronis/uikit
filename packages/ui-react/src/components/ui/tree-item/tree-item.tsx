'use client';

import * as React from 'react';
import { mergeProps } from '@base-ui/react/merge-props';
import { useRender } from '@base-ui/react/use-render';
import {
  ChevronRightIcon,
  SquareDashedIcon,
} from '@acronis-platform/icons-react/stroke-mono';

import { cn } from '@/lib/utils';
import { Checkbox } from '../checkbox';

// A single row of a tree / nested-list UI (a file tree, a nested nav), mirroring
// the Figma "TreeItem" component. It is deliberately *one row* and nothing more:
// the Figma node has no nested list, no expand/collapse interaction, and no
// `expanded` variant — `isExpandable` is a purely visual chevron affordance. The
// consumer composes several `TreeItem`s, owns the expand/collapse state, and
// renders the nested level itself. Same scope decision as `Breadcrumb`, which
// ships the nav/ol/li primitives without owning the trail.
//
// For the same reason no `role="treeitem"` is forced here: a real ARIA tree
// needs a `role="tree"` owner, `aria-expanded`, `aria-level`, and roving
// tabindex — all of which live in the composition, not in a standalone row.
// Forcing the role on an orphan row would produce an *invalid* tree rather than
// an accessible one. The row is a plain `<div>` (polymorphic via `render`, so a
// consumer can make it the `<li role="treeitem">` its own tree needs), and it is
// not put in the tab order — pass `tabIndex` through if you focus it.
//
// ── Tokens ──
// No `Tree` tier exists in @acronis-platform/tokens-pd, and the Figma node's own
// spacing variables still live in the pre-next-gen `componentLegacy/tree/*` and
// `componentLegacy/sidebar/*` namespaces (never migrated). Color therefore comes
// from the semantic tier — `--ui-text-on-surface-primary` (title),
// `--ui-glyph-on-surface-primary` (chevron + leading icon),
// `--ui-background-surface-hover` / `--ui-background-surface-active` (row
// background), `--ui-focus-primary` (focus ring) — and the *layout* numbers are
// plain Tailwind utilities matching the design's pixel values (8px gap /
// padding, 128px min row width, 4px slot padding, 16px minimum extras well).
// That split is the existing convention: the no-fallback rule covers colors,
// which must never be hand-authored, while `button.tsx` likewise writes its
// focus ring as a literal `ring-[3px]`.
//
// ── States ──
// The Figma `state` axis (idle / hover / active / focus) is not four CSS
// pseudo-classes. Its `active` swatch renders the *same* background as
// `variant=selected` (the generated reference code applies the selected
// background class for it), so it previews a selected row rather than a
// mousedown. There are consequently three real looks: transparent (idle),
// `hover:` (pointer), and the highlighted `--ui-background-surface-active`
// fill driven by the `selected` **prop**. No `:active` pseudo-state is invented,
// because the design draws none distinct from `selected`.
const rowClasses = [
  'flex min-w-32 items-center gap-2 rounded-sm px-2 py-2 transition-colors',
  'hover:bg-[var(--ui-background-surface-hover)]',
  // Figma's focus state is the library-standard 3px ring, flush to the row edge
  // (`button.tsx`, `BreadcrumbLink`), on the row's own 2px `rounded-sm` corner.
  'focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--ui-focus-primary)]',
].join(' ');

/** Shared wrapper for the three fixed-size leading slots (4px vertical inset). */
const slotClasses = 'flex shrink-0 items-center py-1';

export interface TreeItemProps extends React.ComponentPropsWithoutRef<'div'> {
  /**
   * The row's label. Rendered as the row's own text, so it is a prop with the
   * literal only as its default (never inlined) — pass a localized string.
   *
   * Note this shadows the native `title` tooltip attribute on the underlying
   * `<div>`: the Figma component names this property `title`, and it is the
   * row's visible label, not a tooltip.
   */
  title?: string;
  /** Show the leading icon slot. */
  hasIcon?: boolean;
  /**
   * The leading icon. Only rendered when `hasIcon` is true; falls back to the
   * design's `SquareDashedIcon` placeholder, which is what the Figma node shows.
   */
  icon?: React.ReactNode;
  /** Show a leading `Checkbox`. */
  hasCheckbox?: boolean;
  /**
   * Props forwarded verbatim to the leading `Checkbox` — this row holds no
   * checked state of its own, so control it from here (`checked` /
   * `onCheckedChange`) exactly as you would a standalone `Checkbox`. Defaults
   * its `aria-label` to `title`, since the box renders without a visible label.
   */
  checkboxProps?: React.ComponentPropsWithoutRef<typeof Checkbox>;
  /**
   * Show the leading expand chevron. Purely a visual affordance: this row does
   * not implement expand/collapse and renders no nested list — the consumer owns
   * that state and composes the child rows.
   */
  isExpandable?: boolean;
  /** Render the trailing extras slot (`children`) at all. */
  hasExtras?: boolean;
  /**
   * Whether the row is selected. Drives the persistent highlighted background —
   * the same fill Figma's `state=active` swatch previews.
   */
  selected?: boolean;
  /**
   * Trailing extras — action buttons, a count badge. Only rendered when
   * `hasExtras` is true.
   */
  children?: React.ReactNode;
  /**
   * Replace the rendered `<div>` with another element or component (Base UI
   * composition) — e.g. the `<li role="treeitem">` of a real ARIA tree.
   */
  render?: useRender.RenderProp;
}

const TreeItem = React.forwardRef<HTMLDivElement, TreeItemProps>(
  (
    {
      className,
      title = 'Title',
      hasIcon = false,
      icon,
      hasCheckbox = false,
      checkboxProps,
      isExpandable = true,
      hasExtras = true,
      selected = false,
      render,
      children,
      ...props
    },
    ref
  ) => {
    // Hoisted out of the `mergeProps` literal: `data-*` keys aren't part of the
    // Base UI element prop type, so they only pass the excess-property check
    // when spread in (the same shape `StepperItem` / `CardFilter` use).
    const attributes = {
      'data-slot': 'tree-item',
      ...(selected ? { 'data-selected': '' } : {}),
    };

    return useRender({
      render,
      ref,
      defaultTagName: 'div',
      props: mergeProps<'div'>(
        {
          ...attributes,
          className: cn(
            rowClasses,
            selected && 'bg-[var(--ui-background-surface-active)]',
            className
          ),
          children: (
            <>
              {isExpandable && (
                <span
                  aria-hidden="true"
                  data-slot="tree-item-expander"
                  className={cn(
                    slotClasses,
                    'text-[var(--ui-glyph-on-surface-primary)]'
                  )}
                >
                  {/* Direction-sensitive artwork: an inline-end-pointing
                      chevron has to mirror under `dir="rtl"`, which logical
                      layout utilities cannot do on their own. */}
                  <ChevronRightIcon size={16} className="rtl:rotate-180" />
                </span>
              )}
              {hasCheckbox && (
                <span data-slot="tree-item-checkbox" className={slotClasses}>
                  <Checkbox aria-label={title} {...checkboxProps} />
                </span>
              )}
              {hasIcon && (
                <span
                  data-slot="tree-item-icon"
                  className={cn(
                    slotClasses,
                    'text-[var(--ui-glyph-on-surface-primary)]'
                  )}
                >
                  {icon ?? <SquareDashedIcon size={16} />}
                </span>
              )}
              <span
                data-slot="tree-item-title"
                className="min-w-0 flex-1 truncate text-sm leading-6 font-normal text-[var(--ui-text-on-surface-primary)]"
              >
                {title}
              </span>
              {hasExtras && (
                <span
                  data-slot="tree-item-extras"
                  className="flex min-w-4 shrink-0 items-center justify-end"
                >
                  {children}
                </span>
              )}
            </>
          ),
        },
        props
      ),
    });
  }
);
TreeItem.displayName = 'TreeItem';

export { TreeItem };
