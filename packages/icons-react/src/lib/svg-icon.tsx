import * as React from 'react';

/**
 * Props common to every icon, minus the `size` axis. The concrete `size` union
 * is NOT declared here: it is generated per pack from design-assets (see
 * `scripts/generate-icons.ts`), so a pack/group/asset changing its defined
 * dimensions flows into the types with no change to this file.
 */
export interface IconBaseProps extends Omit<React.SVGProps<SVGSVGElement>, 'children' | 'size'> {
  /**
   * Accessible label. When set, the icon is exposed as `role="img"` with this
   * label (and a `<title>`); otherwise it is `aria-hidden` (decorative).
   */
  title?: string;
}

/**
 * Advanced/base props. Generated packs re-declare `IconProps` narrowing `size`
 * to the exact dimensions design-assets defines for that pack; this permissive
 * version is for direct `SvgIcon` use.
 */
export interface IconProps extends IconBaseProps {
  size?: number;
}

/** One resolved dimension's artwork, derived from design-assets at generation time. */
interface SizeSpec {
  /** Inner geometry (scale/stroke/color rules already applied by the design-assets executor). */
  inner: React.ReactNode;
  /** Rendered width/height in px for this dimension. */
  w: string;
  h: string;
  /** Uniform stroke width (viewBox units) lifted to the root; omitted when non-uniform. */
  strokeWidth?: string;
}

export interface SvgIconProps extends IconBaseProps {
  /** Render dimension; unconstrained here — generated components narrow it. */
  size?: number;
  /** Per-dimension artwork resolved from design-assets (`values.<dimension>` → executed binary). */
  sizes: Record<number, SizeSpec>;
  /** The canonical dimension to render when `size` is omitted. */
  defaultSize: number;
}

/**
 * Shared renderer for generated icon components. Dimensions, stroke, and color
 * are resolved from `@acronis-platform/design-assets` at generation time (one
 * entry in `sizes` per design-defined dimension), so a dimension with distinct
 * artwork renders its own geometry rather than the canonical scaled. This
 * renderer stays agnostic to which dimensions exist — it renders whatever the
 * generated `sizes`/`defaultSize` describe. Root paint defaults (`fill`/`stroke`
 * / line caps) are passed as props by each generated component.
 */
export const SvgIcon = React.forwardRef<SVGSVGElement, SvgIconProps>(
  function SvgIcon({ size, title, sizes, defaultSize, ...rest }, ref) {
    // Generated components always pass a `defaultSize` present in `sizes`; the
    // fallbacks guard direct (advanced) `SvgIcon` use so a size/defaultSize
    // absent from `sizes` degrades instead of throwing on `spec.w`.
    const spec =
      sizes[size ?? defaultSize] ?? sizes[defaultSize] ?? Object.values(sizes)[0];
    if (!spec) return null;
    const a11y = title
      ? { role: 'img', 'aria-label': title }
      : { 'aria-hidden': true, focusable: false };

    return (
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        width={spec.w}
        height={spec.h}
        {...(spec.strokeWidth != null ? { strokeWidth: spec.strokeWidth } : {})}
        {...a11y}
        {...rest}
      >
        {title ? <title>{title}</title> : null}
        {spec.inner}
      </svg>
    );
  }
);
