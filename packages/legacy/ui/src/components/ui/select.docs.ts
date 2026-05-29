/** Props for the SelectContent component */
export interface SelectContentProps {
  /** Align the selected item with the trigger (default: false) */
  alignItemWithTrigger?: boolean
  /** Which side of the trigger to display the dropdown */
  side?: 'top' | 'bottom'
  /** Distance in pixels from the trigger */
  sideOffset?: number
  /** Whether to render inside a portal (default: true) */
  portal?: boolean
  className?: string
  children?: React.ReactNode
}
