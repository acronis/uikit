/** Props for the DropdownMenuContent component */
export interface DropdownMenuContentProps {
  /** Whether to render inside a portal (default: true) */
  portal?: boolean
  /** Distance in pixels from the trigger */
  sideOffset?: number
  /** Horizontal alignment relative to the trigger */
  align?: 'start' | 'center' | 'end'
  /** Which side of the trigger to display the menu */
  side?: 'top' | 'bottom' | 'left' | 'right' | 'inline-end' | 'inline-start'
  className?: string
}

/** Props for the DropdownMenuItem component */
export interface DropdownMenuItemProps {
  /** Indent the item to align with items that have icons */
  inset?: boolean
  className?: string
}
