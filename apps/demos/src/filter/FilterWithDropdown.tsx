import * as React from 'react'
import { Filter } from '@acronis-platform/shadcn-uikit/react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from '@acronis-platform/shadcn-uikit/react'

export function FilterWithDropdown() {
  const [statusFilters, setStatusFilters] = React.useState<string[]>([])

  const toggleStatusFilter = (status: string) => {
    setStatusFilters((prev) =>
      prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Filter count={statusFilters.length} active={statusFilters.length > 0} />}>
        Status
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem
          checked={statusFilters.includes('active')}
          onCheckedChange={() => toggleStatusFilter('active')}
        >
          Active
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={statusFilters.includes('pending')}
          onCheckedChange={() => toggleStatusFilter('pending')}
        >
          Pending
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={statusFilters.includes('completed')}
          onCheckedChange={() => toggleStatusFilter('completed')}
        >
          Completed
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={statusFilters.includes('cancelled')}
          onCheckedChange={() => toggleStatusFilter('cancelled')}
        >
          Cancelled
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
