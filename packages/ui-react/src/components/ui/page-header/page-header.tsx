import * as React from 'react';
import { mergeProps } from '@base-ui/react/merge-props';
import { useRender } from '@base-ui/react/use-render';
import { CircleInfoIcon, EllipsisIcon } from '@acronis-platform/icons-react/stroke-mono';

import { cn } from '@/lib/utils';
import { Button, type ButtonProps } from '../button';
import { ButtonIcon } from '../button-icon';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../dropdown-menu';
import { Tag } from '../tag';
import { Tooltip, TooltipContent, TooltipTrigger } from '../tooltip';

// The page header region from the Figma "PageHeader" component (shadcn-uikit /
// ui-react file, node 2905-7678): a title row (title left, an optional edit
// icon-button, a tags slot, an actions slot) and an optional description row
// (text + an optional edit icon-button), capped at 512px. The design's
// breadcrumb is a separate sibling above PageHeader (see the "Breakpoints"
// page composition), not one of its own parts — render a `Breadcrumb` next to
// it, don't nest one inside. Title uses the design's `headings/title` style
// (24px/32px, regular) in `--ui-text-on-surface-primary`; the description uses
// `link/default` (14px/24px, regular) in `--ui-text-on-surface-secondary` — the
// only two colors here. The edit affordance is a plain `ButtonIcon` the
// consumer places as a sibling; PageHeader doesn't own a dedicated part for it
// since it's the same atom either row.

// Detects whether a row's full-width content (measured off-screen, at natural
// size) exceeds the space actually available to it — the Figma "Breakpoints"
// page requires an all-or-nothing collapse (fit everything, or collapse), not
// a partial "show however many fit" reflow. Re-measures on resize and after
// every render (children content, e.g. tag count, isn't in a dependency array).
// Unlike `useIsOverflowing` in sidebar-primary.tsx (which measures one element
// against itself and returns a bare boolean), this compares a hidden
// full-size clone against the live container and returns the refs alongside
// the collapsed flag.
function useRowOverflow() {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const measureRef = React.useRef<HTMLDivElement>(null);
  const [collapsed, setCollapsed] = React.useState(false);

  React.useEffect(() => {
    const container = containerRef.current;
    const measure = measureRef.current;
    if (!container || !measure) return;

    const recalc = () =>
      setCollapsed(measure.scrollWidth > container.clientWidth);

    recalc();
    const observer = new ResizeObserver(recalc);
    observer.observe(container);
    return () => observer.disconnect();
  });

  return { containerRef, measureRef, collapsed };
}

const PageHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="page-header"
    role="banner"
    className={cn('flex w-full flex-col items-start gap-1', className)}
    {...props}
  />
));
PageHeader.displayName = 'PageHeader';

// The title row: title, optional edit button, tags slot, actions slot.
const PageHeaderRow = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="page-header-row"
    className={cn('flex w-full items-center gap-2', className)}
    {...props}
  />
));
PageHeaderRow.displayName = 'PageHeaderRow';

type PageHeaderTitleProps = React.HTMLAttributes<HTMLHeadingElement> & {
  as?: 'h1' | 'h2';
};

const PageHeaderTitle = React.forwardRef<
  HTMLHeadingElement,
  PageHeaderTitleProps
>(({ as: Heading = 'h1', className, ...props }, ref) => (
  <Heading
    ref={ref}
    data-slot="page-header-title"
    className={cn(
      'shrink-0 whitespace-nowrap text-2xl font-normal leading-8 text-foreground',
      className
    )}
    {...props}
  />
));
PageHeaderTitle.displayName = 'PageHeaderTitle';

type TagElement = React.ReactElement<{ children?: React.ReactNode }>;

// The tags slot: grows to share the row's remaining width with the actions
// slot (so actions stay flush right even when tags are omitted entirely).
// Per the Figma "Breakpoints" page annotation: if all tags don't fit, show
// only the first tag and fold the rest under a "+#" tag whose tooltip lists
// their labels on hover — not a partial "show however many fit" reflow.
const PageHeaderTags = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const items = React.Children.toArray(children) as TagElement[];
  const { containerRef, measureRef, collapsed } = useRowOverflow();
  const showOverflow = collapsed && items.length > 1;
  const hiddenItems = showOverflow ? items.slice(1) : [];

  const tagsChildren = (
    <>
      {showOverflow ? (
        <>
          {items[0]}
          <Tooltip>
            <TooltipTrigger render={<Tag icon={<CircleInfoIcon size={16} />} />}>
              {`+${hiddenItems.length}`}
            </TooltipTrigger>
            <TooltipContent>
              <ul>
                {hiddenItems.map((item, index) => (
                  <li key={index}>{item.props?.children}</li>
                ))}
              </ul>
            </TooltipContent>
          </Tooltip>
        </>
      ) : (
        items
      )}
      {items.length > 1 && (
        <div
          ref={measureRef}
          aria-hidden
          className="invisible absolute flex items-center gap-2"
        >
          {items}
        </div>
      )}
    </>
  );

  return useRender({
    ref: [ref, containerRef],
    defaultTagName: 'div',
    props: {
      'data-slot': 'page-header-tags',
      ...mergeProps<'div'>(
        {
          className: cn(
            'flex min-w-0 flex-1 items-center gap-2 overflow-hidden',
            className
          ),
          children: tagsChildren,
        },
        props
      ),
    },
  });
});
PageHeaderTags.displayName = 'PageHeaderTags';

type ActionElement = React.ReactElement<
  Omit<ButtonProps, 'render'> & {
    // Only the element form is meaningful once folded — a function-form
    // render receives Button's own state shape, not the "More" menu item's.
    render?: React.ReactElement;
  }
>;

// Fold only reduces a secondary action to a generic "Menu Item" label — the
// Figma "Breakpoints" page annotation and its "More" menu mockup only cover a
// plain button with a single click action. A trigger-style component (e.g.
// ButtonMenu, which opens its own menu rather than firing one action) has no
// single action to reduce to, so it's excluded even if given `variant="secondary"`.
const isSecondaryAction = (item: ActionElement) =>
  item.type === Button && item.props?.variant === 'secondary';

// The actions slot: grows to share the row's remaining width with the tags
// slot. Per the Figma "Breakpoints" page annotation: if all buttons don't
// fit, fold all secondary buttons under a single "More" ButtonIcon — primary
// buttons are never hidden.
const PageHeaderActions = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const items = React.Children.toArray(children) as ActionElement[];
  const secondaryItems = items.filter(isSecondaryAction);
  const { containerRef, measureRef, collapsed } = useRowOverflow();
  const showOverflow = collapsed && secondaryItems.length > 0;

  // Each secondary item becomes zero or one output items: dropped, except
  // the first (in original order), which becomes the "More" menu holding
  // all of them — hence `flatMap` over `map`/`filter`.
  const moreButton = (
    <DropdownMenu key="page-header-actions-more">
      <DropdownMenuTrigger
        render={
          <ButtonIcon variant="secondary" aria-label="More actions">
            <EllipsisIcon size={16} />
          </ButtonIcon>
        }
      />
      <DropdownMenuContent align="end">
        {secondaryItems.map((secondaryItem, index) => {
          const { variant, children, ...rest } = secondaryItem.props;
          return (
            <DropdownMenuItem
              key={index}
              {...(rest as React.ComponentPropsWithoutRef<typeof DropdownMenuItem>)}
            >
              {children}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const collapseSecondaryActions = (item: ActionElement) => {
    if (!isSecondaryAction(item)) return [item];
    const isFirstSecondaryAction = item === secondaryItems[0];
    return isFirstSecondaryAction ? [moreButton] : [];
  };

  const visibleItems = showOverflow
    ? items.flatMap(collapseSecondaryActions)
    : items;

  const actionsChildren = (
    <>
      {visibleItems}
      {secondaryItems.length > 0 && (
        <div
          ref={measureRef}
          aria-hidden
          className="invisible absolute flex items-center gap-4"
        >
          {items}
        </div>
      )}
    </>
  );

  return useRender({
    ref: [ref, containerRef],
    defaultTagName: 'div',
    props: {
      'data-slot': 'page-header-actions',
      ...mergeProps<'div'>(
        {
          className: cn(
            'flex min-w-0 flex-1 items-center justify-end gap-4 overflow-hidden',
            className
          ),
          children: actionsChildren,
        },
        props
      ),
    },
  });
});
PageHeaderActions.displayName = 'PageHeaderActions';

// The description row: caps the text (+ its optional edit button) at 512px,
// matching the Figma's explicit "Description max width 512px" note.
const PageHeaderDescriptionRow = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="page-header-description-row"
    className={cn('flex max-w-lg items-start gap-2', className)}
    {...props}
  />
));
PageHeaderDescriptionRow.displayName = 'PageHeaderDescriptionRow';

const PageHeaderDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    data-slot="page-header-description"
    className={cn(
      'min-w-0 flex-1 text-sm font-normal leading-6 text-muted-foreground',
      className
    )}
    {...props}
  />
));
PageHeaderDescription.displayName = 'PageHeaderDescription';

export {
  PageHeader,
  PageHeaderRow,
  PageHeaderTitle,
  PageHeaderTags,
  PageHeaderActions,
  PageHeaderDescriptionRow,
  PageHeaderDescription,
  useRowOverflow,
};
