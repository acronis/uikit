import * as React from 'react';
import {
  BriefcaseIcon,
  BuildingIcon,
  CheckIcon,
  FolderIcon,
  InboxIcon,
  NodeTreeIcon,
} from '@acronis-platform/icons-react/stroke-mono';
import { TriangleWarningYellowIcon } from '@acronis-platform/icons-react/stroke-multi';

import { cn } from '@/lib/utils';
import { Avatar } from '../avatar';
import { Link } from '../link';
import { Loading } from '../loading';
import { Popover, PopoverContent, PopoverTrigger } from '../popover';
import {
  InputSelectExpander,
  InputSelectRowContent,
  InputSelectSearchField,
  InputSelectSectionLabelView,
  InputSelectSectionView,
} from '../input-select/input-select-list';

// The tenant-search dropdown from the Figma "InputSelectDropdownTenants" node
// (3064:21461): a 256px panel with an in-panel search row, an optional "Recent"
// section, a "Browse" section holding a nested tenant tree, and the three status
// replacements for the list region (loading / empty / error).
//
// It is hosted in this repo's generic `Popover` shell rather than a Base UI
// `Select`: the tenant picker is a *tree* of toggles + selectable leaves, not a
// listbox, so Base UI Select's index-based listbox semantics (roving option
// indices, `hidden`-but-mounted rows) don't apply. Positioning, dismissal, focus
// return and RTL side flipping all come from `PopoverContent` /
// `Popover.Positioner` — nothing here re-implements them.
//
// Everything below the popup chrome is the shared presentational layer already
// extracted from `input-select` (`input-select-list.tsx`): the search row, the
// section/section-label boxes, the row layout and the tree expander. This
// component owns only the state that layer deliberately doesn't: the query, the
// expanded-node set, the selection and the keyboard roving focus.

/** Tenant kinds drawn in the Figma node; each maps to a fixed 16px leading icon. */
export type TenantSearchTenantType =
  | 'all-clients'
  | 'client'
  | 'partner'
  | 'folder'
  | 'unit';

export interface TenantSearchItem {
  /** Stable identifier; also the selection value. */
  id: string;
  /** Row label; also what the search query matches against. */
  label: string;
  /** Tenant kind — picks the leading icon. */
  tenantType: TenantSearchTenantType;
  /** Nested tenants. A node with children renders as an expand/collapse toggle. */
  children?: TenantSearchItem[];
}

/** Status axis, mirroring the Figma `variant` property (`data` → `idle`). */
export type TenantSearchPopoverStatus = 'idle' | 'loading' | 'empty' | 'error';

const TENANT_TYPE_ICONS = {
  'all-clients': BriefcaseIcon,
  client: BriefcaseIcon,
  partner: BuildingIcon,
  folder: FolderIcon,
  unit: NodeTreeIcon,
} as const;

function TenantTypeIcon({ type }: { type: TenantSearchTenantType }) {
  const Icon = TENANT_TYPE_ICONS[type];
  return <Icon size={16} />;
}

/**
 * Prune the tree to nodes that match `query`, keeping every ancestor of a match
 * so the path to it stays reachable. A node that matches keeps its whole subtree
 * (the user searched for that tenant — they still want to browse under it).
 */
function filterItems(
  items: TenantSearchItem[],
  query: string
): TenantSearchItem[] {
  if (!query) return items;
  const out: TenantSearchItem[] = [];
  for (const item of items) {
    if (item.label.toLowerCase().includes(query)) {
      out.push(item);
      continue;
    }
    const children = item.children ? filterItems(item.children, query) : [];
    if (children.length > 0) out.push({ ...item, children });
  }
  return out;
}

/**
 * Which of the two lists a row belongs to. "Recent" is by definition a subset
 * of "Browse", so the same tenant id legitimately appears in both sections —
 * every internal lookup key is therefore namespaced by section (`rowKey`), and
 * only the public `value` / `onValueChange` contract uses the bare `item.id`.
 */
type TenantSearchSection = 'recent' | 'browse';

function rowKey(section: TenantSearchSection, id: string): string {
  return `${section}:${id}`;
}

/** Every row key in the tree — used to force-expand while a query is active. */
function collectRowKeys(
  items: TenantSearchItem[],
  section: TenantSearchSection,
  into: Set<string>
): Set<string> {
  for (const item of items) {
    into.add(rowKey(section, item.id));
    if (item.children) collectRowKeys(item.children, section, into);
  }
  return into;
}

interface FlatRow {
  /** Section-namespaced key; unique even when a tenant is in both sections. */
  key: string;
  /** 0-based depth in the tree. */
  depth: number;
  hasNestedItems: boolean;
  /** Parent row key, or `null` at the top level of its section. */
  parentKey: string | null;
}

/** Rows currently rendered (and therefore keyboard-reachable), in visual order. */
function flattenVisible(
  items: TenantSearchItem[],
  expanded: ReadonlySet<string>,
  section: TenantSearchSection,
  depth = 0,
  parentKey: string | null = null,
  into: FlatRow[] = []
): FlatRow[] {
  for (const item of items) {
    const hasNestedItems = Boolean(item.children && item.children.length > 0);
    const key = rowKey(section, item.id);
    into.push({ key, depth, hasNestedItems, parentKey });
    if (hasNestedItems && expanded.has(key)) {
      flattenVisible(item.children!, expanded, section, depth + 1, key, into);
    }
  }
  return into;
}

function isRtl(element: HTMLElement | null): boolean {
  if (!element) return false;
  try {
    return window.getComputedStyle(element).direction === 'rtl';
  } catch {
    return false;
  }
}

export interface TenantSearchPopoverContentProps extends Omit<
  React.ComponentPropsWithoutRef<typeof PopoverContent>,
  'children' | 'value' | 'defaultValue'
> {
  /** Tenant tree rendered under the "Browse" section. */
  items: TenantSearchItem[];
  /** Optional flat list rendered under "Recent"; the section is hidden when empty. */
  recentItems?: TenantSearchItem[];
  /** Controlled selected tenant id. */
  value?: string;
  /** Fired with the tenant id when a selectable row is activated. */
  onValueChange?: (id: string) => void;
  /** Which region replaces the list. `idle` renders the sections (Figma's `data`). */
  status?: TenantSearchPopoverStatus;
  /** Backs the error state's retry action. */
  onRetry?: () => void;
  /** Controlled search query. */
  query?: string;
  /** Fired when the user types in the search row. */
  onQueryChange?: (query: string) => void;
  /** Search input placeholder. */
  searchPlaceholder?: string;
  /** Accessible name for the search input (it has no visible label). */
  searchLabel?: string;
  /** "Recent" section heading. */
  recentLabel?: string;
  /** "Browse" section heading. */
  browseLabel?: string;
  /** Copy shown in the `loading` state. */
  loadingLabel?: string;
  /** Copy shown in the `empty` state, and when a query matches nothing. */
  emptyLabel?: string;
  /** Copy shown in the `error` state. */
  errorLabel?: string;
  /** Label of the `error` state's retry action. */
  retryLabel?: string;
}

const TenantSearchPopoverContent = React.forwardRef<
  HTMLDivElement,
  TenantSearchPopoverContentProps
>(
  (
    {
      className,
      items,
      recentItems,
      value,
      onValueChange,
      status = 'idle',
      onRetry,
      query: queryProp,
      onQueryChange,
      searchPlaceholder = 'Search',
      searchLabel = 'Search tenants',
      recentLabel = 'Recent',
      browseLabel = 'Browse',
      loadingLabel = 'Data is loading…',
      emptyLabel = 'No data found',
      errorLabel = 'Something went wrong.',
      retryLabel = 'Try again',
      side = 'bottom',
      align = 'start',
      sideOffset = 4,
      ...props
    },
    ref
  ) => {
    const instanceId = React.useId();
    const recentLabelId = `${instanceId}-recent`;
    const browseLabelId = `${instanceId}-browse`;
    const [uncontrolledQuery, setUncontrolledQuery] = React.useState('');
    const query = queryProp ?? uncontrolledQuery;
    const normalizedQuery = query.trim().toLowerCase();

    const [expanded, setExpanded] = React.useState<ReadonlySet<string>>(
      () => new Set<string>()
    );
    const [activeKey, setActiveKey] = React.useState<string | null>(null);

    const rowRefs = React.useRef(new Map<string, HTMLElement>());
    const listRef = React.useRef<HTMLDivElement | null>(null);

    const filteredRecent = React.useMemo(
      () => filterItems(recentItems ?? [], normalizedQuery),
      [recentItems, normalizedQuery]
    );
    const filteredItems = React.useMemo(
      () => filterItems(items, normalizedQuery),
      [items, normalizedQuery]
    );

    // A query has to reveal its matches, so while one is active every node counts
    // as expanded; the user's own expanded set is preserved for when it clears.
    const effectiveExpanded = React.useMemo(() => {
      if (!normalizedQuery) return expanded;
      const all = collectRowKeys(filteredRecent, 'recent', new Set<string>());
      return collectRowKeys(filteredItems, 'browse', all);
    }, [normalizedQuery, expanded, filteredRecent, filteredItems]);

    const flatRows = React.useMemo(
      () => [
        ...flattenVisible(filteredRecent, effectiveExpanded, 'recent'),
        ...flattenVisible(filteredItems, effectiveExpanded, 'browse'),
      ],
      [filteredRecent, filteredItems, effectiveExpanded]
    );

    const hasResults = flatRows.length > 0;
    // The Figma `variant` axis drives the status region; a query that matches
    // nothing is the same "nothing to show" surface, so it reuses `empty`.
    const resolvedStatus: TenantSearchPopoverStatus =
      status !== 'idle' ? status : hasResults ? 'idle' : 'empty';

    const setQuery = (next: string) => {
      onQueryChange?.(next);
      if (queryProp === undefined) setUncontrolledQuery(next);
    };

    const toggle = (key: string) => {
      setExpanded((previous) => {
        const next = new Set(previous);
        if (next.has(key)) next.delete(key);
        else next.add(key);
        return next;
      });
    };

    const focusRow = (key: string | undefined) => {
      if (!key) return;
      setActiveKey(key);
      rowRefs.current.get(key)?.focus();
    };

    // Roving tabindex: exactly one row is tabbable. Falls back to the first row
    // whenever the remembered one is filtered/collapsed away.
    const rovingKey =
      activeKey && flatRows.some((row) => row.key === activeKey)
        ? activeKey
        : flatRows[0]?.key;

    const handleListKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (flatRows.length === 0) return;
      const currentIndex = flatRows.findIndex((row) => row.key === rovingKey);
      const current = flatRows[currentIndex];
      const rtl = isRtl(listRef.current);
      const forwardKey = rtl ? 'ArrowLeft' : 'ArrowRight';
      const backwardKey = rtl ? 'ArrowRight' : 'ArrowLeft';

      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          focusRow(
            flatRows[Math.min(currentIndex + 1, flatRows.length - 1)]?.key
          );
          return;
        case 'ArrowUp':
          event.preventDefault();
          focusRow(flatRows[Math.max(currentIndex - 1, 0)]?.key);
          return;
        case 'Home':
          event.preventDefault();
          focusRow(flatRows[0]?.key);
          return;
        case 'End':
          event.preventDefault();
          focusRow(flatRows[flatRows.length - 1]?.key);
          return;
        default:
          break;
      }

      if (!current) return;

      if (event.key === forwardKey) {
        event.preventDefault();
        if (!current.hasNestedItems) return;
        if (effectiveExpanded.has(current.key)) {
          focusRow(flatRows[currentIndex + 1]?.key);
        } else {
          toggle(current.key);
        }
        return;
      }

      if (event.key === backwardKey) {
        event.preventDefault();
        if (current.hasNestedItems && effectiveExpanded.has(current.key)) {
          toggle(current.key);
        } else if (current.parentKey) {
          focusRow(current.parentKey);
        }
      }
    };

    const registerRow = (key: string) => (element: HTMLElement | null) => {
      if (element) rowRefs.current.set(key, element);
      else rowRefs.current.delete(key);
    };

    function renderRows(
      nodes: TenantSearchItem[],
      depth: number,
      section: TenantSearchSection
    ): React.ReactNode[] {
      return nodes.flatMap((item) => {
        const hasNestedItems = Boolean(
          item.children && item.children.length > 0
        );
        const key = rowKey(section, item.id);
        // Level 1 (16px) is the chevron slot, so a leaf at the same depth as an
        // expandable sibling reserves it too and both leading icons line up.
        const indent = depth + 1;
        const rowProps = {
          role: 'treeitem' as const,
          // Named explicitly rather than from content: an expanded row `aria-owns`
          // its child group, and name-from-content would then concatenate every
          // descendant label into the parent's accessible name.
          'aria-label': item.label,
          'aria-level': depth + 1,
          tabIndex: rovingKey === key ? 0 : -1,
          onFocus: () => setActiveKey(key),
        };

        if (hasNestedItems) {
          const isExpanded = effectiveExpanded.has(key);
          // Namespaced by both instance and section so the DOM id stays unique
          // when the same tenant is listed under Recent *and* Browse.
          const groupId = `${instanceId}-${section}-${item.id}-group`;
          return [
            <InputSelectExpander
              key={key}
              ref={registerRow(key)}
              expanded={isExpanded}
              onToggle={() => toggle(key)}
              indent={indent}
              icon={<TenantTypeIcon type={item.tenantType} />}
              aria-owns={isExpanded ? groupId : undefined}
              {...rowProps}
            >
              {item.label}
            </InputSelectExpander>,
            isExpanded ? (
              <div key={groupId} id={groupId} role="group">
                {renderRows(item.children!, depth + 1, section)}
              </div>
            ) : null,
          ];
        }

        const selected = value === item.id;
        return [
          // `group/item` + a literal `data-selected` attribute are the wrapper
          // contract `InputSelectRowContent`'s `group-data-[selected]/item:*`
          // classes are written against; they also drive the selected row tint.
          <div
            key={key}
            ref={registerRow(key)}
            aria-selected={selected}
            data-selected={selected ? '' : undefined}
            onClick={() => onValueChange?.(item.id)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                onValueChange?.(item.id);
              }
            }}
            className={cn(
              'group/item relative flex cursor-default items-center gap-[var(--ui-input-select-dropdown-item-global-container-gap)] px-[var(--ui-input-select-dropdown-item-global-container-padding-x)] py-[var(--ui-input-select-dropdown-item-global-container-padding-y)] leading-6 text-[var(--ui-input-select-dropdown-item-global-label-color)] outline-none select-none',
              'bg-[var(--ui-input-select-dropdown-item-unselected-container-color-idle)] hover:bg-[var(--ui-input-select-dropdown-item-unselected-container-color-hover)]',
              'data-[selected]:bg-[var(--ui-input-select-dropdown-item-selected-container-color-idle)] data-[selected]:hover:bg-[var(--ui-input-select-dropdown-item-selected-container-color-hover)]'
            )}
            {...rowProps}
          >
            <InputSelectRowContent
              multiple={false}
              indent={indent}
              icon={<TenantTypeIcon type={item.tenantType} />}
              labelSlot={
                <span className="min-w-0 flex-1 truncate">{item.label}</span>
              }
              trailingSlot={
                selected ? (
                  <span className="flex shrink-0 items-center text-[var(--ui-input-select-dropdown-item-global-icon-checked)]">
                    <CheckIcon size={16} />
                  </span>
                ) : undefined
              }
            />
          </div>,
        ];
      });
    }

    const statusRegion = (
      <div
        className="flex min-h-[var(--ui-input-select-dropdown-container-status-width-min)] flex-col items-center justify-center gap-[var(--ui-input-select-dropdown-container-status-gap)] border-t border-[var(--ui-input-select-dropdown-section-container-border-color)] px-[var(--ui-input-select-dropdown-container-status-padding-x)] py-[var(--ui-input-select-dropdown-container-status-padding-y)] text-center text-sm leading-6 text-[var(--ui-input-select-dropdown-item-global-label-color)]"
        data-status={resolvedStatus}
      >
        {resolvedStatus === 'loading' && <Loading label={loadingLabel} />}
        {resolvedStatus === 'empty' && (
          <>
            <Avatar
              color="blue"
              variant="icon"
              icon={<InboxIcon size={16} />}
              aria-hidden="true"
            />
            <span>{emptyLabel}</span>
          </>
        )}
        {resolvedStatus === 'error' && (
          <>
            <Avatar
              color="yellow"
              variant="icon"
              icon={<TriangleWarningYellowIcon size={16} />}
              aria-hidden="true"
            />
            <span>{errorLabel}</span>
            <Link render={<button type="button" />} onClick={onRetry}>
              {retryLabel}
            </Link>
          </>
        )}
      </div>
    );

    return (
      <PopoverContent
        ref={ref}
        side={side}
        align={align}
        sideOffset={sideOffset}
        className={cn(
          'w-64 min-w-64 max-w-none overflow-hidden py-[var(--ui-input-select-dropdown-container-padding-y)] shadow-md',
          className
        )}
        {...props}
      >
        <InputSelectSearchField
          aria-label={searchLabel}
          placeholder={searchPlaceholder}
          value={query}
          onChange={(event) => setQuery(event.currentTarget.value)}
          onKeyDown={(event) => {
            if (event.key === 'ArrowDown') {
              event.preventDefault();
              focusRow(flatRows[0]?.key);
            }
          }}
        />
        {resolvedStatus === 'idle' ? (
          <div
            ref={listRef}
            className="max-h-80 overflow-y-auto"
            onKeyDown={handleListKeyDown}
          >
            {filteredRecent.length > 0 && (
              <InputSelectSectionView>
                <InputSelectSectionLabelView id={recentLabelId}>
                  {recentLabel}
                </InputSelectSectionLabelView>
                <div role="tree" aria-labelledby={recentLabelId}>
                  {renderRows(filteredRecent, 0, 'recent')}
                </div>
              </InputSelectSectionView>
            )}
            <InputSelectSectionView>
              <InputSelectSectionLabelView id={browseLabelId}>
                {browseLabel}
              </InputSelectSectionLabelView>
              <div role="tree" aria-labelledby={browseLabelId}>
                {renderRows(filteredItems, 0, 'browse')}
              </div>
            </InputSelectSectionView>
          </div>
        ) : (
          statusRegion
        )}
      </PopoverContent>
    );
  }
);
TenantSearchPopoverContent.displayName = 'TenantSearchPopoverContent';

/** Root — the Base UI Popover root, re-exported so the parts read as one set. */
const TenantSearchPopover = Popover;

/** The anchor that opens the panel. Thin alias of `PopoverTrigger`. */
const TenantSearchPopoverTrigger = PopoverTrigger;

export {
  TenantSearchPopover,
  TenantSearchPopoverTrigger,
  TenantSearchPopoverContent,
};
