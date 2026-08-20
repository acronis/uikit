import * as React from 'react';
import { mergeProps } from '@base-ui/react/merge-props';
import { useRender } from '@base-ui/react/use-render';
import { cva, type VariantProps } from 'class-variance-authority';
import { SquareArrowUpRightIcon } from '@acronis-platform/icons-react/stroke-mono';

import { cn } from '@/lib/utils';

// Mirrors the Figma "Link" component set: an inline text link (semibold, 14/24) with
// an optional trailing external-link icon (`external`). Themed by the `--ui-link-*`
// tier, whose per-surface sets map to the Figma `background` variant — `normal` for
// ordinary surfaces, `inverse` for links over a backdrop/scrim. Each state wires its
// own text color (`--ui-link-<surface>-text-color-*`); on `normal` the external icon
// gets its own color too (`--ui-link-normal-external-icon-color-*`, kept separate from
// the text per the tier). Text decoration is shared across surfaces
// (`--ui-link-global-text-decoration-*`; underline on hover only). Focus paints a 3px
// `--ui-focus-primary` ring on both surfaces. Polymorphic via Base UI `useRender` —
// pass `render` to render a router `Link` instead of the default `<a>`.
//
// Two things the `inverse` surface deliberately does NOT have, both per the Figma set,
// and both therefore inert props there rather than half-applied ones:
//   - No external icon: the `SquareArrowUpRight` layer exists only in the five
//     `background=normal` variants, so `external` renders nothing — same as toggling
//     Figma's `External` on an inverse instance. tokens-pd does emit
//     `--ui-link-inverse-external-icon-color-*`, but the design never uses it, so it is
//     left unreferenced rather than used to invent an icon.
//   - No disabled state: the Figma set has only four enabled inverse variants and marks
//     the fifth unsupported ("disable state not supported onBackdrop"), so `disabled` is
//     discarded rather than applied without its color. Consumers that need an inert link
//     on a backdrop should omit it instead.
//
// The Figma container has a fixed 32px height for grid alignment
// (`--ui-link-global-container-height`); it is intentionally NOT applied here so the
// link flows inline within prose.
const linkVariants = cva(
  'inline-flex items-center gap-[var(--ui-link-global-container-gap)] rounded-sm text-sm font-semibold leading-6 outline-none transition-colors [&_svg]:size-4 [&_svg]:shrink-0 [text-decoration:var(--ui-link-global-text-decoration-idle)] hover:[text-decoration:var(--ui-link-global-text-decoration-hover)] active:[text-decoration:var(--ui-link-global-text-decoration-active)] focus-visible:ring-[3px] focus-visible:ring-[var(--ui-focus-primary)] aria-disabled:pointer-events-none aria-disabled:[text-decoration:var(--ui-link-global-text-decoration-disabled)]',
  {
    variants: {
      variant: {
        normal:
          'text-[var(--ui-link-normal-text-color-idle)] [&_svg]:text-[var(--ui-link-normal-external-icon-color-idle)] hover:text-[var(--ui-link-normal-text-color-hover)] hover:[&_svg]:text-[var(--ui-link-normal-external-icon-color-hover)] active:text-[var(--ui-link-normal-text-color-active)] active:[&_svg]:text-[var(--ui-link-normal-external-icon-color-active)] aria-disabled:text-[var(--ui-link-normal-text-color-disabled)] aria-disabled:[&_svg]:text-[var(--ui-link-normal-external-icon-color-disabled)]',
        // Text color only — no icon classes (the surface has no external icon) and no
        // `aria-disabled:` color: Figma marks the disabled state unsupported on a
        // backdrop ("disable state not supported onBackdrop") and the tier ships no
        // `--ui-link-inverse-*-disabled` token to reference. `disabled` still renders
        // the link inert; only its color stays at the idle value.
        inverse:
          'text-[var(--ui-link-inverse-text-color-idle)] hover:text-[var(--ui-link-inverse-text-color-hover)] active:text-[var(--ui-link-inverse-text-color-active)]',
      },
    },
    defaultVariants: {
      variant: 'normal',
    },
  }
);

export interface LinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement>,
    VariantProps<typeof linkVariants> {
  /**
   * Which surface the link sits on (Figma's `background`): `normal` for ordinary
   * surfaces, `inverse` for a backdrop/scrim or other dark brand surface.
   */
  variant?: 'normal' | 'inverse';
  /**
   * Append a trailing external-link icon (e.g. for links that leave the app).
   * Has no effect on `variant="inverse"` — the design defines no external icon for
   * links on a backdrop.
   */
  external?: boolean;
  /**
   * Render the link inert: disabled color, removed from the tab order, no navigation.
   * Ignored entirely on `variant="inverse"` — the design defines no disabled state on
   * a backdrop, so the link renders exactly as an enabled one (still navigable and
   * focusable). Omit the link, or use `variant="normal"`, when you need it inert.
   */
  disabled?: boolean;
  /**
   * Replace the rendered `<a>` with another element or component (Base UI
   * composition) — e.g. a router `Link`. Props and class names are merged onto it.
   */
  render?: useRender.RenderProp;
}

const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ className, variant, external, disabled, href, children, render, ...props }, ref) => {
    // The `inverse` surface exists only in the four enabled Figma variants, so neither
    // of the two props the design leaves out of it has any effect there: `disabled` is
    // discarded outright (the link stays navigable, focusable and hoverable, with no
    // `aria-disabled`) and `external` renders no icon.
    const isInverse = variant === 'inverse';
    const isDisabled = disabled && !isInverse;

    return useRender({
      render,
      ref,
      defaultTagName: 'a',
      props: mergeProps<'a'>(
        {
          className: cn(linkVariants({ variant }), className),
          href: isDisabled ? undefined : href,
          'aria-disabled': isDisabled || undefined,
          tabIndex: isDisabled ? -1 : undefined,
          children: (
            <>
              {children}
              {external && !isInverse && <SquareArrowUpRightIcon size={16} />}
            </>
          ),
        },
        props
      ),
    });
  }
);
Link.displayName = 'Link';

export { Link, linkVariants };
