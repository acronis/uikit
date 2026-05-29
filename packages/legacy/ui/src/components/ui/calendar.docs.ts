/** Props for the Calendar component (extends react-day-picker DayPicker props) */
export interface CalendarProps {
  /** Visual variant for navigation buttons */
  buttonVariant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'ghost' | 'link' | 'translucent'
  /** Show days outside the current month */
  showOutsideDays?: boolean
  /** Layout style for the month/year caption */
  captionLayout?: 'label' | 'dropdown' | 'dropdown-months' | 'dropdown-years'
  className?: string
}
