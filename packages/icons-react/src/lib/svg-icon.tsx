import * as React from 'react';

export interface IconProps extends Omit<
  React.SVGProps<SVGSVGElement>,
  'children'
> {
  /** Rendered size in px. Defaults to 24 — the canonical asset size. */
  size?: number;
  /**
   * Accessible label. When set, the icon is exposed as `role="img"` with this
   * label; otherwise it is `aria-hidden` (decorative). Default: decorative.
   */
  title?: string;
}

export interface SvgIconProps extends IconProps {
  /**
   * Map of rendered size (px) → stroke width in viewBox user units, derived
   * from the design-assets scale + stroke rules at generation time. Applied to
   * the `<svg>` (stroke packs only); falls back to the canonical (24) value.
   */
  strokeWidthBySize?: Record<number, number>;
  children: React.ReactNode;
}

/**
 * Shared renderer for generated icon components. The design-assets master is a
 * 24px vector; the scale + stroke rules are baked into `strokeWidthBySize` (by
 * the generator) so one source renders at any size with the designed stroke
 * weight. Paint defaults (`currentColor`, `fill: none`, line caps) are supplied
 * by each pack's generated wrapper and can be overridden per call.
 */
export const SvgIcon = React.forwardRef<SVGSVGElement, SvgIconProps>(
  function SvgIcon(
    {
      size = 24,
      viewBox = '0 0 24 24',
      strokeWidthBySize,
      title,
      children,
      ...rest
    },
    ref
  ) {
    const a11y = title
      ? { role: 'img', 'aria-label': title }
      : { 'aria-hidden': true, focusable: false };
    const strokeWidth = strokeWidthBySize
      ? (strokeWidthBySize[size] ?? strokeWidthBySize[24])
      : undefined;

    return (
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox={viewBox}
        {...(strokeWidth != null ? { strokeWidth } : {})}
        {...a11y}
        {...rest}
      >
        {title ? <title>{title}</title> : null}
        {children}
      </svg>
    );
  }
);
