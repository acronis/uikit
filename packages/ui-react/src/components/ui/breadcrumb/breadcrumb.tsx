import * as React from 'react';
import { mergeProps } from '@base-ui/react/merge-props';
import { useRender } from '@base-ui/react/use-render';
import { ChevronRightIcon, EllipsisIcon } from '@acronis-platform/icons-react/stroke-mono';

import { cn } from '@/lib/utils';

// Composable breadcrumb primitives mirroring the Figma "Breadcrumb" component.
// Colors are wired to the next-gen `--ui-breadcrumb-*` tokens from
// @acronis-platform/tokens-pd: links use `--ui-breadcrumb-link-label-<state>`
// (idle gray, darkening on hover/active), the current page uses
// `--ui-breadcrumb-page-label-color`, and the chevron separator uses
// `--ui-breadcrumb-separator-icon-color` sized by `--ui-breadcrumb-separator-icon-size`
// (16px). The inter-item gap is `--ui-breadcrumb-list-gap` (4px). Type is
// 14px / 24px line-height to match the design's `body/default`.

export interface BreadcrumbProps extends React.ComponentPropsWithoutRef<'nav'> {
  /**
   * Replace the rendered `<nav>` with another element or component
   * (Base UI composition). Accepts a React element or a render function.
   */
  render?: useRender.RenderProp;
}

const Breadcrumb = React.forwardRef<HTMLElement, BreadcrumbProps>(
  ({ render, ...props }, ref) => {
    return useRender({
      render,
      ref,
      defaultTagName: 'nav',
      props: mergeProps<'nav'>({ 'aria-label': 'breadcrumb' }, props),
    });
  }
);
Breadcrumb.displayName = 'Breadcrumb';

const BreadcrumbList = React.forwardRef<
  HTMLOListElement,
  React.ComponentPropsWithoutRef<'ol'>
>(({ className, ...props }, ref) => (
  <ol
    ref={ref}
    className={cn(
      'flex flex-wrap items-center gap-[var(--ui-breadcrumb-list-gap)] break-words text-sm font-normal leading-6',
      className
    )}
    {...props}
  />
));
BreadcrumbList.displayName = 'BreadcrumbList';

const BreadcrumbItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentPropsWithoutRef<'li'>
>(({ className, ...props }, ref) => (
  <li
    ref={ref}
    className={cn(
      'inline-flex items-center gap-[var(--ui-breadcrumb-list-gap)]',
      className
    )}
    {...props}
  />
));
BreadcrumbItem.displayName = 'BreadcrumbItem';

export interface BreadcrumbLinkProps
  extends React.ComponentPropsWithoutRef<'a'> {
  /**
   * Replace the rendered `<a>` with another element or component (e.g. a
   * router `Link`) via Base UI composition.
   */
  render?: useRender.RenderProp;
}

const BreadcrumbLink = React.forwardRef<HTMLAnchorElement, BreadcrumbLinkProps>(
  ({ className, render, ...props }, ref) => {
    return useRender({
      render,
      ref,
      defaultTagName: 'a',
      props: mergeProps<'a'>(
        {
          className: cn(
            'rounded-sm text-[var(--ui-breadcrumb-link-label-idle)] no-underline transition-colors hover:text-[var(--ui-breadcrumb-link-label-hover)] hover:underline active:text-[var(--ui-breadcrumb-link-label-active)] focus-visible:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ui-focus-brand)] focus-visible:ring-offset-2 ring-offset-background',
            className
          ),
        },
        props
      ),
    });
  }
);
BreadcrumbLink.displayName = 'BreadcrumbLink';

const BreadcrumbPage = React.forwardRef<
  HTMLSpanElement,
  React.ComponentPropsWithoutRef<'span'>
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    role="link"
    aria-disabled="true"
    aria-current="page"
    className={cn('text-[var(--ui-breadcrumb-page-label-color)]', className)}
    {...props}
  />
));
BreadcrumbPage.displayName = 'BreadcrumbPage';

const BreadcrumbSeparator = ({
  children,
  className,
  ...props
}: React.ComponentPropsWithoutRef<'li'>) => (
  <li
    role="presentation"
    aria-hidden="true"
    className={cn(
      'inline-flex items-center text-[var(--ui-breadcrumb-separator-icon-color)] [&>svg]:size-[var(--ui-breadcrumb-separator-icon-size)]',
      className
    )}
    {...props}
  >
    {children ?? <ChevronRightIcon size={16} />}
  </li>
);
BreadcrumbSeparator.displayName = 'BreadcrumbSeparator';

const BreadcrumbEllipsis = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'span'>) => (
  <span
    role="presentation"
    aria-hidden="true"
    className={cn(
      'inline-flex size-4 items-center justify-center text-[var(--ui-breadcrumb-link-label-idle)]',
      className
    )}
    {...props}
  >
    <EllipsisIcon size={16} />
    <span className="sr-only">More</span>
  </span>
);
BreadcrumbEllipsis.displayName = 'BreadcrumbEllipsis';

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
};
