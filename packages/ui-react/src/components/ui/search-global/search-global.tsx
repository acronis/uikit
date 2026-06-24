import * as React from 'react';
import { MagnifierIcon } from '@acronis-platform/icons-react/stroke-mono';

import { cn } from '@/lib/utils';

// A global ("search anything") field: a 48px pill with a gradient border (the
// dedicated `--ui-search-global-*` token tier), a leading magnifier, a borderless
// native input, and a trailing keyboard-shortcut hint (⌘K by default).
//
// The border is a brand gradient, not a flat color, so it can't go through
// `border-color`. Instead a private `--sg-border` custom property holds the
// active gradient and the box paints it with the standard padding-box/border-box
// double-background trick (box fill in padding-box, gradient in border-box over a
// transparent border). State swaps only the gradient: idle
// (`--ui-search-global-border-color-idle`) / hover / active (`:active`, the
// darkest). Focus reuses the idle gradient plus a 3px `--ui-focus-primary` ring
// via `focus-within`, mirroring the Figma focused state. The magnifier +
// placeholder take the AI-purple `--ui-search-global-icon-color` /
// `-placeholoder-color` (the token tier keeps Figma's "placeholoder" spelling);
// the shortcut is `--ui-search-global-shortcut-color`.

export interface SearchGlobalProps extends React.ComponentPropsWithoutRef<'input'> {
  /** Keyboard-shortcut hint shown at the trailing edge (decorative). Pass `null` to hide. */
  shortcut?: React.ReactNode;
}

const SearchGlobal = React.forwardRef<HTMLInputElement, SearchGlobalProps>(
  (
    {
      className,
      type = 'search',
      placeholder = 'Search anything',
      shortcut = '⌘K',
      'aria-label': ariaLabel = 'Search',
      ...props
    },
    ref
  ) => (
    <div
      className={cn(
        'inline-flex h-[var(--ui-search-global-box-height)] w-[var(--ui-search-global-box-width)] min-w-[var(--ui-search-global-box-width-min)] max-w-[var(--ui-search-global-box-width-max)] items-center gap-[var(--ui-search-global-box-gap)]',
        'rounded-[var(--ui-search-global-box-border-radius)] border-[length:var(--ui-search-global-box-border-width)] border-solid border-transparent px-[var(--ui-search-global-box-padding-x)]',
        // Gradient border via padding-box (box fill) + border-box (the `--sg-border` gradient).
        '[--sg-border:var(--ui-search-global-border-color-idle)] hover:[--sg-border:var(--ui-search-global-border-color-hover)] active:[--sg-border:var(--ui-search-global-border-color-active)]',
        '[background:linear-gradient(var(--ui-search-global-box-color),var(--ui-search-global-box-color))_padding-box,var(--sg-border)_border-box]',
        'transition-[background] focus-within:ring-[3px] focus-within:ring-[var(--ui-focus-primary)]',
        className
      )}
    >
      <MagnifierIcon
        size={16}
        className="shrink-0 text-[var(--ui-search-global-icon-color)]"
      />
      <input
        ref={ref}
        type={type}
        placeholder={placeholder}
        aria-label={ariaLabel}
        className="ui-search-global-placeholoder-text-style h-full min-w-0 flex-1 border-0 bg-transparent p-0 text-foreground outline-none placeholder:text-[var(--ui-search-global-placeholoder-color)] [&::-webkit-search-cancel-button]:appearance-none"
        {...props}
      />
      {shortcut != null && (
        <span
          aria-hidden
          className="ui-search-global-shortcut-text-style shrink-0 whitespace-nowrap text-[var(--ui-search-global-shortcut-color)]"
        >
          {shortcut}
        </span>
      )}
    </div>
  )
);
SearchGlobal.displayName = 'SearchGlobal';

export { SearchGlobal };
