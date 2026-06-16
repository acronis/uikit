import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

// A compact label for a status, category, or keyword. `variant` wires the
// container fill, border, label, and icon to the dedicated `--ui-tag-*`
// component tier from @acronis-platform/tokens-pd (one token per part, per
// variant). Geometry — radius, border width, gap, padding, max/min width, icon
// size — comes from `--ui-tag-global-*`; `size` only changes the height (24px
// `default` / 20px `sm`), padding is uniform. The `ai` variant paints a gradient
// border (`--ui-tag-ai-container-border-color`) over its solid tinted fill via
// the padding-box / border-box background-clip trick (the border stays
// transparent so the border-box gradient shows through). The fill is wrapped in
// a `linear-gradient(color, color)` so it's a background *image* layer — a plain
// background-color is only valid in the final layer of the `background`
// shorthand, and as a non-final layer would invalidate the whole declaration.
const tagVariants = cva(
  'inline-flex min-w-[var(--ui-tag-global-container-width-min)] max-w-[var(--ui-tag-global-container-width-max)] items-center gap-[var(--ui-tag-global-container-gap)] overflow-hidden rounded-[var(--ui-tag-global-container-border-radius)] border-[length:var(--ui-tag-global-container-border-width)] border-solid border-transparent px-[var(--ui-tag-global-container-padding-x)] align-middle text-xs font-semibold leading-4 [&_svg]:size-[var(--ui-tag-global-md-icon-size)] [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        info: 'bg-[var(--ui-tag-info-container-color)] border-[var(--ui-tag-info-container-border-color)] text-[var(--ui-tag-info-label-color)] [&_svg]:text-[var(--ui-tag-info-icon-color)]',
        success:
          'bg-[var(--ui-tag-success-container-color)] border-[var(--ui-tag-success-container-border-color)] text-[var(--ui-tag-success-label-color)] [&_svg]:text-[var(--ui-tag-success-icon-color)]',
        warning:
          'bg-[var(--ui-tag-warning-container-color)] border-[var(--ui-tag-warning-container-border-color)] text-[var(--ui-tag-warning-label-color)] [&_svg]:text-[var(--ui-tag-warning-icon-color)]',
        critical:
          'bg-[var(--ui-tag-critical-container-color)] border-[var(--ui-tag-critical-container-border-color)] text-[var(--ui-tag-critical-label-color)] [&_svg]:text-[var(--ui-tag-critical-icon-color)]',
        danger:
          'bg-[var(--ui-tag-danger-container-color)] border-[var(--ui-tag-danger-container-border-color)] text-[var(--ui-tag-danger-label-color)] [&_svg]:text-[var(--ui-tag-danger-icon-color)]',
        neutral:
          'bg-[var(--ui-tag-neutral-container-color)] border-[var(--ui-tag-neutral-container-border-color)] text-[var(--ui-tag-neutral-label-color)] [&_svg]:text-[var(--ui-tag-neutral-icon-color)]',
        ai: 'text-[var(--ui-tag-ai-label-color)] [&_svg]:text-[var(--ui-tag-ai-icon-color)] [background:linear-gradient(var(--ui-tag-ai-container-color),var(--ui-tag-ai-container-color))_padding-box,var(--ui-tag-ai-container-border-color)_border-box]',
      },
      size: {
        default: 'h-[var(--ui-tag-global-md-container-height)]',
        sm: 'h-[var(--ui-tag-global-sm-container-height)]',
      },
    },
    defaultVariants: {
      variant: 'neutral',
      size: 'default',
    },
  }
);

export interface TagProps
  extends
    React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof tagVariants> {
  /** Optional leading icon, rendered at 16px before the label. */
  icon?: React.ReactNode;
}

const Tag = React.forwardRef<HTMLSpanElement, TagProps>(
  ({ className, variant, size, icon, children, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(tagVariants({ variant, size }), className)}
      {...props}
    >
      {icon}
      <span className="min-w-0 truncate">{children}</span>
    </span>
  )
);
Tag.displayName = 'Tag';

export { Tag, tagVariants };
