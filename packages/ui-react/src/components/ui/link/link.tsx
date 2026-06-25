import * as React from 'react';
import { mergeProps } from '@base-ui/react/merge-props';
import { useRender } from '@base-ui/react/use-render';
import { SquareArrowUpRightIcon } from '@acronis-platform/icons-react/stroke-mono';

import { cn } from '@/lib/utils';

// Mirrors the Figma "Link" component: an inline text link (semibold, 14/24) with an
// optional trailing external-link icon (`external`). Themed by the `--ui-link-*`
// tier — each state wires its own text color (`--ui-link-color-*`), text decoration
// (`--ui-link-text-decoration-*`; underline on hover only) and external-icon color
// (`--ui-link-external-icon-color-*`, kept separate from the text per the tier).
// Focus paints a 3px `--ui-focus-primary` ring. Polymorphic via Base UI `useRender`
// — pass `render` to render a router `Link` instead of the default `<a>`. `disabled`
// makes it inert: disabled color, removed from the tab order, no navigation.
//
// The Figma container has a fixed 32px height for grid alignment
// (`--ui-link-container-height`); it is intentionally NOT applied here so the link
// flows inline within prose.
export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Append a trailing external-link icon (e.g. for links that leave the app). */
  external?: boolean;
  /** Render the link inert: disabled color, removed from the tab order, no navigation. */
  disabled?: boolean;
  /**
   * Replace the rendered `<a>` with another element or component (Base UI
   * composition) — e.g. a router `Link`. Props and class names are merged onto it.
   */
  render?: useRender.RenderProp;
}

const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ className, external, disabled, href, children, render, ...props }, ref) =>
    useRender({
      render,
      ref,
      defaultTagName: 'a',
      props: mergeProps<'a'>(
        {
          className: cn(
            'inline-flex items-center gap-[var(--ui-link-container-gap)] rounded-sm text-sm font-semibold leading-6 outline-none transition-colors [text-underline-position:from-font] [&_svg]:size-4 [&_svg]:shrink-0',
            'text-[var(--ui-link-color-idle)] [text-decoration:var(--ui-link-text-decoration-idle)] [&_svg]:text-[var(--ui-link-external-icon-color-idle)]',
            'hover:text-[var(--ui-link-color-hover)] hover:[text-decoration:var(--ui-link-text-decoration-hover)] hover:[&_svg]:text-[var(--ui-link-external-icon-color-hover)]',
            'active:text-[var(--ui-link-color-active)] active:[text-decoration:var(--ui-link-text-decoration-active)] active:[&_svg]:text-[var(--ui-link-external-icon-color-active)]',
            'focus-visible:ring-[3px] focus-visible:ring-[var(--ui-focus-primary)]',
            'aria-disabled:pointer-events-none aria-disabled:text-[var(--ui-link-color-disabled)] aria-disabled:[text-decoration:var(--ui-link-text-decoration-disabled)] aria-disabled:[&_svg]:text-[var(--ui-link-external-icon-color-disabled)]',
            className
          ),
          href: disabled ? undefined : href,
          'aria-disabled': disabled || undefined,
          tabIndex: disabled ? -1 : undefined,
          children: (
            <>
              {children}
              {external && <SquareArrowUpRightIcon size={16} />}
            </>
          ),
        },
        props
      ),
    })
);
Link.displayName = 'Link';

export { Link };
