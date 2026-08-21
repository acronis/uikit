import * as React from 'react';
import { Avatar as AvatarPrimitive } from '@base-ui/react/avatar';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

// Wraps Base UI's Avatar primitive (Root / Image / Fallback), themed by the
// dedicated next-gen `--ui-avatar-*` token tier from @acronis-platform/tokens-pd.
// A 32px circle (`--ui-avatar-global-avatar-size` / `-border-border-radius`) with a 2px
// ring (`-border-border-width` / `-border-color`) — the ring is what visually
// separates avatars when they overlap in an `AvatarGroup`. When no image is set
// (or it fails to load) the `AvatarFallback` shows initials.
//
// `variant`/`label`/`icon` are a convenience for the common no-photo case (the
// Figma component has no "image" variant at all — just Text/Icon): with no
// `children` composed, Avatar auto-renders either `label` (Text) or `icon`
// (Icon). Composing `AvatarImage`/`AvatarFallback` as `children` — for the real
// photo-with-fallback case — always takes precedence over both.
//
// The ring is a `box-shadow`, not a CSS `border`: Figma draws the 2px stroke
// with `strokeAlign: OUTSIDE`, so the 32px is the *colored circle* and the ring
// sits outside it. A CSS border would be drawn inside the border-box, shrinking
// the visible circle to 28px (PLTFRM-92393). A box-shadow ring paints outside
// without inflating the 32px layout box, so the `AvatarGroup` overlap step
// (32px − 6px gap) still matches the design.
//
// It is written as a raw `[box-shadow:…]` arbitrary property, not Tailwind's
// `shadow-[…]` utility: the utility routes the value through `--tw-shadow-color`
// (`0 0 0 var(--tw-shadow-color, <spread>) <color>`), which resolves
// inconsistently for a spread-only ring across engine versions. The raw property
// emits the literal declaration so every renderer draws the same 2px outset ring.
//
// `color` selects one of the eight Figma color schemes; it tints the fallback
// background (`--ui-avatar-color-<scheme>`) and the initials
// (`--ui-avatar-label-color-<scheme>`). Initials use the 12px/16px/600 caption
// style baked into the design (`text-xs font-semibold leading-4`).
const avatarVariants = cva(
  'relative inline-flex shrink-0 select-none items-center justify-center overflow-hidden ' +
    'size-[var(--ui-avatar-global-avatar-size)] rounded-[var(--ui-avatar-global-avatar-border-border-radius)] ' +
    '[box-shadow:0_0_0_var(--ui-avatar-global-avatar-border-border-width)_var(--ui-avatar-global-avatar-border-color)] ' +
    'text-xs font-semibold leading-4',
  {
    variants: {
      color: {
        teal: 'bg-[var(--ui-avatar-color-teal)] text-[var(--ui-avatar-label-color-teal)]',
        violet:
          'bg-[var(--ui-avatar-color-violet)] text-[var(--ui-avatar-label-color-violet)]',
        red: 'bg-[var(--ui-avatar-color-red)] text-[var(--ui-avatar-label-color-red)]',
        yellow:
          'bg-[var(--ui-avatar-color-yellow)] text-[var(--ui-avatar-label-color-yellow)]',
        orange:
          'bg-[var(--ui-avatar-color-orange)] text-[var(--ui-avatar-label-color-orange)]',
        blue: 'bg-[var(--ui-avatar-color-blue)] text-[var(--ui-avatar-label-color-blue)]',
        gray: 'bg-[var(--ui-avatar-color-gray)] text-[var(--ui-avatar-label-color-gray)]',
        green:
          'bg-[var(--ui-avatar-color-green)] text-[var(--ui-avatar-label-color-green)]',
      },
    },
    defaultVariants: {
      color: 'teal',
    },
  }
);

export type AvatarImageProps = React.ComponentPropsWithoutRef<
  typeof AvatarPrimitive.Image
>;

/** The avatar image; hidden by Base UI until it loads, revealing the fallback. */
const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  AvatarImageProps
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn('size-full object-cover', className)}
    {...props}
  />
));
AvatarImage.displayName = 'AvatarImage';

export type AvatarFallbackProps = React.ComponentPropsWithoutRef<
  typeof AvatarPrimitive.Fallback
>;

/** Shown when there's no image (or it fails) — typically the user's initials. */
const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  AvatarFallbackProps
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn('flex size-full items-center justify-center', className)}
    {...props}
  />
));
AvatarFallback.displayName = 'AvatarFallback';

export interface AvatarProps
  extends
    React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>,
    VariantProps<typeof avatarVariants> {
  /**
   * Selects the auto-rendered fallback content when no `children` are
   * composed: initials (`label`) or an `icon`. Ignored once `children` (e.g.
   * `AvatarImage`/`AvatarFallback`) are composed directly.
   */
  variant?: 'text' | 'icon';
  /** Initials shown for the `text` variant when no `children` are composed. */
  label?: string;
  /** Icon shown for the `icon` variant when no `children` are composed. */
  icon?: React.ReactNode;
}

/**
 * A user/entity avatar: a colored circle showing an image, initials, or an
 * icon. Compose `AvatarImage`/`AvatarFallback` for the photo-with-fallback
 * case, or use `variant`/`label`/`icon` for a quick text or icon badge; stack
 * several in `AvatarGroup`.
 */
const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  AvatarProps
>(
  (
    {
      className,
      color,
      variant = 'text',
      label = 'SB',
      icon,
      children,
      ...props
    },
    ref
  ) => (
    <AvatarPrimitive.Root
      ref={ref}
      className={cn(avatarVariants({ color }), className)}
      {...props}
    >
      {children !== undefined ? (
        children
      ) : variant === 'icon' ? (
        icon
      ) : (
        <AvatarFallback>{label}</AvatarFallback>
      )}
    </AvatarPrimitive.Root>
  )
);
Avatar.displayName = 'Avatar';

export type AvatarGroupProps = React.HTMLAttributes<HTMLDivElement>;

/**
 * Overlapping stack of avatars. Each avatar after the first is pulled left by
 * `--ui-avatar-global-avatar-group-gap` (a negative offset), so their 2px
 * borders form the layered look; later avatars render above earlier ones.
 */
const AvatarGroup = React.forwardRef<HTMLDivElement, AvatarGroupProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex items-center [&>*:not(:first-child)]:ms-[var(--ui-avatar-global-avatar-group-gap)]',
        className
      )}
      {...props}
    />
  )
);
AvatarGroup.displayName = 'AvatarGroup';

export { Avatar, AvatarImage, AvatarFallback, AvatarGroup, avatarVariants };
