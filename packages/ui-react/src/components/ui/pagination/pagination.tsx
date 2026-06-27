import * as React from 'react';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  EllipsisIcon,
} from '@acronis-platform/icons-react/stroke-mono';

import { cn } from '@/lib/utils';

// Ported from `@acronis-platform`'s `pagination`. Markup-only (no Base UI
// primitive). The page links are styled directly with semantic tokens (rather than
// the Button cva, whose min-width tokens don't fit a compact square link): neutral
// foreground page numbers, the active surface for the current page, and the hover
// surface on hover.
function Pagination({ className, ...props }: React.ComponentProps<'nav'>) {
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      className={cn('mx-auto flex w-full justify-center', className)}
      {...props}
    />
  );
}

const PaginationContent = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<'ul'>
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn('flex flex-row items-center gap-1', className)}
    {...props}
  />
));
PaginationContent.displayName = 'PaginationContent';

const PaginationItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<'li'>
>(({ className, ...props }, ref) => <li ref={ref} className={className} {...props} />);
PaginationItem.displayName = 'PaginationItem';

export interface PaginationLinkProps extends React.ComponentProps<'a'> {
  /** Marks the current page (sets aria-current and the selected treatment). */
  isActive?: boolean;
}

const paginationLinkClassName = (isActive?: boolean) =>
  cn(
    'inline-flex h-8 min-w-8 select-none items-center justify-center rounded-md px-2 text-sm font-medium text-[var(--ui-text-on-surface-primary)] transition-colors outline-none',
    'focus-visible:ring-2 focus-visible:ring-[var(--ui-focus-primary)]',
    isActive
      ? 'bg-[var(--ui-background-surface-active)]'
      : 'hover:bg-[var(--ui-background-surface-hover)]'
  );

const PaginationLink = ({
  className,
  isActive,
  ...props
}: PaginationLinkProps) => (
  <a
    aria-current={isActive ? 'page' : undefined}
    className={cn(paginationLinkClassName(isActive), className)}
    {...props}
  />
);
PaginationLink.displayName = 'PaginationLink';

const PaginationPrevious = ({
  className,
  ...props
}: PaginationLinkProps) => (
  <PaginationLink
    aria-label="Go to previous page"
    className={className}
    {...props}
  >
    <ChevronLeftIcon size={16} />
  </PaginationLink>
);
PaginationPrevious.displayName = 'PaginationPrevious';

const PaginationNext = ({ className, ...props }: PaginationLinkProps) => (
  <PaginationLink aria-label="Go to next page" className={className} {...props}>
    <ChevronRightIcon size={16} />
  </PaginationLink>
);
PaginationNext.displayName = 'PaginationNext';

const PaginationEllipsis = ({
  className,
  ...props
}: React.ComponentProps<'span'>) => (
  <span
    aria-hidden
    className={cn(
      'flex h-8 w-8 items-center justify-center text-[var(--ui-text-on-surface-secondary)]',
      className
    )}
    {...props}
  >
    <EllipsisIcon size={16} />
    <span className="sr-only">More pages</span>
  </span>
);
PaginationEllipsis.displayName = 'PaginationEllipsis';

export {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
};
