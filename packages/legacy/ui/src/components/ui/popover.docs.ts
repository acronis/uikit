/** Props for the PopoverContent component */
export interface PopoverContentProps {
  /** Horizontal alignment relative to the trigger */
  align?: 'start' | 'center' | 'end'
  /** Which side of the trigger to display the popover */
  side?: 'top' | 'bottom' | 'left' | 'right' | 'inline-end' | 'inline-start'
  /** Distance in pixels from the trigger */
  sideOffset?: number
  /** Whether to render inside a portal (default: true) */
  portal?: boolean
  className?: string
}
