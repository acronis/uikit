import * as React from 'react'
import { Menu } from '@base-ui/react'
import { CheckIcon, ChevronRightIcon, CircleIcon } from '@/components/icons'

import { cn } from '@/lib/utils'

const DropdownMenu = Menu.Root

const DropdownMenuTrigger = Menu.Trigger

const DropdownMenuGroup = Menu.Group

const DropdownMenuPortal = Menu.Portal

// Base UI uses Menu.SubmenuRoot instead of a flat Sub component.
// SubmenuTrigger must be a direct child of the parent Menu.Popup,
// and it must be wrapped in Menu.SubmenuRoot to establish the submenu context.
const DropdownMenuSub = Menu.SubmenuRoot

const DropdownMenuRadioGroup = Menu.RadioGroup

const DropdownMenuSubTrigger = React.forwardRef<
  HTMLElement,
  Omit<Menu.SubmenuTrigger.Props, 'ref'> & {
    inset?: boolean
  }
>(({ className, inset, children, ...props }, ref) => (
  <Menu.SubmenuTrigger
    ref={ref}
    className={cn(
      'flex cursor-default select-none items-center gap-4 px-4 py-2 text-sm leading-6 outline-none transition-colors hover:bg-accent focus:bg-accent data-[open]:bg-accent [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
      inset && 'pl-8',
      className
    )}
    {...props}
  >
    {children}
    <ChevronRightIcon className="ml-auto" />
  </Menu.SubmenuTrigger>
))
DropdownMenuSubTrigger.displayName = 'DropdownMenuSubTrigger'

const DropdownMenuSubContent = React.forwardRef<
  HTMLDivElement,
  Omit<Menu.Popup.Props, 'ref'> & {
    sideOffset?: number
  }
>(({ className, sideOffset = 4, ...props }, ref) => (
  <Menu.Positioner sideOffset={sideOffset}>
    <Menu.Popup
      ref={ref}
      className={cn(
        'z-50 min-w-[8rem] overflow-hidden rounded bg-popover py-2 text-popover-foreground shadow-[0px_10px_20px_rgba(36,49,67,0.2)] data-[open]:animate-in data-[closed]:animate-out data-[closed]:fade-out-0 data-[open]:fade-in-0 data-[closed]:zoom-out-95 data-[open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
        className
      )}
      {...props}
    />
  </Menu.Positioner>
))
DropdownMenuSubContent.displayName = 'DropdownMenuSubContent'

const DropdownMenuContent = React.forwardRef<
  HTMLDivElement,
  Omit<Menu.Popup.Props, 'ref'> & {
    portal?: boolean
    sideOffset?: number
    align?: 'start' | 'center' | 'end'
    side?: 'top' | 'bottom' | 'left' | 'right' | 'inline-end' | 'inline-start'
  }
>(({ className, portal = true, sideOffset = 4, align, side, ...props }, ref) => {
  const positioner = (
    <Menu.Positioner sideOffset={sideOffset} align={align} side={side}>
      <Menu.Popup
        ref={ref}
        className={cn(
          'z-50 min-w-[8rem] overflow-y-auto overflow-x-hidden rounded bg-popover py-2 text-popover-foreground shadow-[0px_10px_20px_rgba(36,49,67,0.2)] data-[open]:animate-in data-[closed]:animate-out data-[closed]:fade-out-0 data-[open]:fade-in-0 data-[closed]:zoom-out-95 data-[open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
          className
        )}
        {...props}
      />
    </Menu.Positioner>
  )

  return portal ? <Menu.Portal>{positioner}</Menu.Portal> : positioner
})
DropdownMenuContent.displayName = 'DropdownMenuContent'

const DropdownMenuItem = React.forwardRef<
  HTMLElement,
  Omit<Menu.Item.Props, 'ref'> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <Menu.Item
    ref={ref}
    className={cn(
      'relative flex cursor-default select-none items-center gap-4 px-4 py-2 text-sm leading-6 outline-none transition-colors hover:bg-primary/10 focus:bg-primary/10 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
      inset && 'pl-8',
      className
    )}
    {...props}
  />
))
DropdownMenuItem.displayName = 'DropdownMenuItem'

const DropdownMenuCheckboxItem = React.forwardRef<
  HTMLElement,
  Omit<Menu.CheckboxItem.Props, 'ref'>
>(({ className, children, checked, ...props }, ref) => (
  <Menu.CheckboxItem
    ref={ref}
    className={cn(
      'relative flex cursor-default select-none items-center py-2 pl-10 pr-4 text-sm leading-6 outline-none transition-colors hover:bg-accent focus:bg-accent data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      className
    )}
    checked={checked}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <Menu.CheckboxItemIndicator>
        <CheckIcon className="h-4 w-4" />
      </Menu.CheckboxItemIndicator>
    </span>
    {children}
  </Menu.CheckboxItem>
))
DropdownMenuCheckboxItem.displayName = 'DropdownMenuCheckboxItem'

const DropdownMenuRadioItem = React.forwardRef<
  HTMLElement,
  Omit<Menu.RadioItem.Props, 'ref'>
>(({ className, children, ...props }, ref) => (
  <Menu.RadioItem
    ref={ref}
    className={cn(
      'relative flex cursor-default select-none items-center py-2 pl-10 pr-4 text-sm leading-6 outline-none transition-colors hover:bg-accent focus:bg-accent data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <Menu.RadioItemIndicator>
        <CircleIcon className="h-2 w-2 fill-current" />
      </Menu.RadioItemIndicator>
    </span>
    {children}
  </Menu.RadioItem>
))
DropdownMenuRadioItem.displayName = 'DropdownMenuRadioItem'

// Menu.GroupLabel requires a Menu.Group parent (Base UI constraint), but shadcn's
// DropdownMenuLabel is used standalone. Render a plain div to match the original API.
const DropdownMenuLabel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('px-4 py-2 text-sm font-semibold leading-6', inset && 'pl-8', className)}
    {...props}
  />
))
DropdownMenuLabel.displayName = 'DropdownMenuLabel'

// Base UI has no built-in Separator in Menu — render a plain div with role="separator"
const DropdownMenuSeparator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    role="separator"
    className={cn('-mx-1 my-1 h-px bg-muted', className)}
    {...props}
  />
))
DropdownMenuSeparator.displayName = 'DropdownMenuSeparator'

const DropdownMenuShortcut = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => {
  return <span className={cn('ml-auto text-xs tracking-widest opacity-60', className)} {...props} />
}
DropdownMenuShortcut.displayName = 'DropdownMenuShortcut'

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
}
