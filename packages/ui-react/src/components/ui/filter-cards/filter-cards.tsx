import * as React from 'react';
import { mergeProps } from '@base-ui/react/merge-props';
import { useRender } from '@base-ui/react/use-render';

import { cn } from '@/lib/utils';

// Mirrors the Figma "FilterCards" component: a horizontal row of `CardFilter`
// items (Figma's nested "ListCards" slot maps to `children`) that fills its
// container and distributes the available width evenly across however many
// cards are passed in, matching the "fill container" sizing Figma applies to
// each CardFilter instance inside this composition — it overrides CardFilter's
// own fixed 224px width. The only styling this container owns is the 16px
// inter-card gap (`--ui-gap-16`) and `items-stretch`, so every card matches
// the row's tallest sibling even if one card's label wraps onto a second
// line; there is no dedicated `--ui-filter-cards-*` token tier.
//
// Cards only shrink down to their own content's natural (min-content) width —
// there is no `min-w-0` override, so the browser's default `min-width: auto`
// on flex items applies. Once the cards' combined min-content width exceeds
// the row, the row overflows its container rather than clipping any card's
// content; the consumer is responsible for giving the row a scrollable
// container (e.g. `overflow-x-auto`) if that's the desired behavior for a
// given layout — FilterCards itself never adds scroll or wrap.
export interface FilterCardsProps extends React.ComponentPropsWithoutRef<'div'> {
  /**
   * Replace the rendered `<div>` with another element or component
   * (Base UI composition).
   */
  render?: useRender.RenderProp;
}

const FilterCards = React.forwardRef<HTMLDivElement, FilterCardsProps>(
  ({ className, render, ...props }, ref) => {
    return useRender({
      render,
      ref,
      defaultTagName: 'div',
      props: mergeProps<'div'>(
        {
          className: cn(
            'flex w-full items-stretch gap-[var(--ui-gap-16)] [&>*]:flex-1',
            className
          ),
        },
        props
      ),
    });
  }
);
FilterCards.displayName = 'FilterCards';

export { FilterCards };
