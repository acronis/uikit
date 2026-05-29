import React from 'react'
import { cn } from '@/lib/utils'

interface BaseIconProps extends React.SVGProps<SVGSVGElement> {
  children: React.ReactNode
  className?: string
  size?: number
}

/**
 * Base icon wrapper component that provides consistent sizing and styling.
 *
 * When the child is a React element (e.g. an SVG component imported via
 * `?react`), we clone it and merge our props in so we avoid double-nesting
 * `<svg>` inside `<svg>`.  For raw path/content children we still render a
 * wrapper `<svg>`.
 */
export function BaseIcon({ children, className, size, viewBox = '0 0 16 16', ...props }: BaseIconProps) {
  const cls = cn(!size && 'size-4', 'shrink-0', className)
  const sizeProps = size ? { width: size, height: size } : {}

  // SVG components from ?react imports are valid React elements — clone them
  // with our styling props so only a single <svg> is emitted.
  const child = React.Children.count(children) === 1
    ? (React.Children.toArray(children)[0] as React.ReactElement)
    : null

  if (child && React.isValidElement(child)) {
    return React.cloneElement(child as React.ReactElement<Record<string, unknown>>, {
      className: cls,
      ...sizeProps,
      ...props,
    })
  }

  return (
    <svg
      className={cls}
      viewBox={viewBox}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...sizeProps}
      {...props}
    >
      {children}
    </svg>
  )
}

/**
 * Alternative: Icon wrapper that accepts an SVG path
 */
interface IconProps extends Omit<React.SVGProps<SVGSVGElement>, 'path'> {
  path: string | React.ReactNode
  className?: string
  viewBox?: string
  size?: number
}

export function Icon({ path, className, size, viewBox = '0 0 16 16', ...props }: IconProps) {
  return (
    <svg
      className={cn(!size && 'size-4', 'shrink-0', className)}
      viewBox={viewBox}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...(size ? { width: size, height: size, ...props } : props)}
    >
      {typeof path === 'string' ? <path d={path} /> : path}
    </svg>
  )
}
