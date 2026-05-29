import * as React from 'react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

export interface SecondaryMenuProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export interface SecondaryMenuGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  children: React.ReactNode
}

export interface SecondaryMenuItemProps extends React.ComponentPropsWithoutRef<'button'> {
  active?: boolean
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
  tag?: string
  asChild?: boolean
}

const SecondaryMenu = React.forwardRef<HTMLDivElement, SecondaryMenuProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex h-full w-[240px] flex-col bg-white border-r border-[rgba(38,104,197,0.1)]',
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)
SecondaryMenu.displayName = 'SecondaryMenu'

const SecondaryMenuGroup = React.forwardRef<HTMLDivElement, SecondaryMenuGroupProps>(
  ({ className, title, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('flex flex-col border-b border-[rgba(38,104,197,0.1)]', className)}
        {...props}
      >
        {title && (
          <div className="flex items-center px-6 pt-4 pb-2">
            <h3 className="text-[11px] font-bold leading-4 tracking-wider uppercase text-[rgba(36,49,67,0.7)]">
              {title}
            </h3>
          </div>
        )}
        {children}
      </div>
    )
  }
)
SecondaryMenuGroup.displayName = 'SecondaryMenuGroup'

const SecondaryMenuItem = React.forwardRef<HTMLButtonElement, SecondaryMenuItemProps>(
  (
    {
      className,
      active = false,
      disabled = false,
      icon,
      iconPosition = 'left',
      tag,
      children,
      ...props
    },
    ref
  ) => {
    const iconElement = icon && (
      <div
        className={cn(
          'flex h-4 w-4 shrink-0 items-center justify-center',
          active && 'text-[#243143]',
          !active && !disabled && 'text-[#2668C5]',
          disabled && 'text-[rgba(36,49,67,0.4)]'
        )}
      >
        {icon}
      </div>
    )

    const tagElement = tag && (
      <Badge
        variant="outline"
        className="h-4 rounded-full border-[#9BC225] bg-[#F5F9E9] px-2 py-0 text-[10px] font-bold leading-4 tracking-wider text-[#407009]"
      >
        {tag}
      </Badge>
    )

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(
          'flex w-full items-center gap-4 px-6 py-3 text-left text-sm font-semibold leading-6 transition-colors',
          active && 'bg-[rgba(38,104,197,0.05)] text-[#243143]',
          !active && !disabled && 'text-[#2668C5] hover:bg-[rgba(38,104,197,0.02)]',
          disabled && 'cursor-not-allowed text-[rgba(36,49,67,0.7)] opacity-70',
          className
        )}
        {...props}
      >
        {iconPosition === 'left' && iconElement}
        <span className="flex-1 min-w-0">{children}</span>
        {tag && tagElement}
        {iconPosition === 'right' && iconElement}
      </button>
    )
  }
)
SecondaryMenuItem.displayName = 'SecondaryMenuItem'

const SecondaryMenuContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn('flex-1 overflow-y-auto', className)}
      {...props}
    >
      {children}
    </div>
  )
})
SecondaryMenuContent.displayName = 'SecondaryMenuContent'

const SecondaryMenuHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn('flex items-center border-b border-[rgba(38,104,197,0.1)] px-6 py-4', className)}
      {...props}
    >
      {children}
    </div>
  )
})
SecondaryMenuHeader.displayName = 'SecondaryMenuHeader'

const SecondaryMenuFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn('flex items-center border-t border-[rgba(38,104,197,0.1)] px-6 py-4', className)}
      {...props}
    >
      {children}
    </div>
  )
})
SecondaryMenuFooter.displayName = 'SecondaryMenuFooter'

export {
  SecondaryMenu,
  SecondaryMenuGroup,
  SecondaryMenuItem,
  SecondaryMenuContent,
  SecondaryMenuHeader,
  SecondaryMenuFooter,
}
