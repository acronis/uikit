import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

// A 32px tinted rounded square holding a single 16px icon — the icon-only
// counterpart of a tag: a compact, non-interactive marker that carries meaning
// through its glyph rather than a text label.
//
// It is NOT a wrapper around `Tag`. The Figma node (`TagIcon`, a component set
// under the "Avatar" frame) is a standalone 32x32 square: no label slot, no
// border, an 8px radius, and a completely different token tier from `Tag`'s
// `--ui-tag-*` status palette. It draws its tint from the shared Avatar
// palette instead — `--ui-avatar-color-<scheme>` for the container and
// `--ui-avatar-label-color-<scheme>` for the glyph — which is why `color`
// names a palette scheme rather than a semantic status.
//
// Geometry comes from the design's variable bindings where a token exists:
// padding is `gap/gap-8` -> `--ui-gap-8`. The 32px box (`size/size-32`) and the
// 8px radius (an unbound literal in Figma) have no token in tokens-pd, so they
// use the equivalent Tailwind scale utilities (`size-8`, `rounded-lg`) — see the
// tokens.yaml note in packages/ui-spec/components/tag-icon.
//
// Only `violet` is exposed: the Figma component set declares eight Color
// variants (Blue, Violet, Teal, Gray, Red, Orange, Yellow, Green) but the
// Avatar tier in @acronis-platform/tokens-pd defines five (violet, teal, red,
// orange, yellow) and none of blue/gray/green. Rather than hand-author the
// missing values, the prop is scoped to the reviewed scheme; the remaining
// schemes are additive once design ships their tokens.
const tagIconVariants = cva(
  'inline-flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-lg ' +
    'p-[var(--ui-gap-8)] align-middle [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:pointer-events-none',
  {
    variants: {
      color: {
        violet:
          'bg-[var(--ui-avatar-color-violet)] text-[var(--ui-avatar-label-color-violet)]',
      },
    },
    defaultVariants: {
      color: 'violet',
    },
  }
);

// `color` is omitted from the span attributes before the cva variant is mixed
// in: React's HTMLAttributes still carries the deprecated presentational
// `color` attribute (`string`), which is not assignable to the variant's
// `'violet'` union, so the two interfaces cannot be extended side by side.
export interface TagIconProps
  extends
    Omit<React.HTMLAttributes<HTMLSpanElement>, 'color'>,
    VariantProps<typeof tagIconVariants> {
  /** The icon to render, centered at 16px. Backs Figma's `Icon` slot. */
  icon?: React.ReactNode;
}

/**
 * An icon-only tag: a 32px tinted rounded square containing a single 16px icon.
 *
 * Presentational by default — it renders a plain `<span>` with no role and no
 * text of its own. When the glyph carries meaning that is not repeated nearby,
 * pass an `aria-label` (or `role="img"` + `aria-label`) through; when it is
 * decorative, leave it as is so assistive tech skips it.
 */
const TagIcon = React.forwardRef<HTMLSpanElement, TagIconProps>(
  ({ className, color, icon, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(tagIconVariants({ color }), className)}
      {...props}
    >
      {icon}
    </span>
  )
);
TagIcon.displayName = 'TagIcon';

export { TagIcon, tagIconVariants };
