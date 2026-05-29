import * as React from 'react'
import { Filter } from '@acronis-platform/shadcn-uikit/react'
import { Button } from '@acronis-platform/shadcn-uikit/react'
import { Card, CardContent, CardHeader, CardTitle } from '@acronis-platform/shadcn-uikit/react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from '@acronis-platform/shadcn-uikit/react'

export function FilterMultipleGroups() {
  const [statusFilters, setStatusFilters] = React.useState<string[]>([])
  const [categoryFilters, setCategoryFilters] = React.useState<string[]>([])

  const toggleStatusFilter = (status: string) => {
    setStatusFilters((prev) =>
      prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]
    )
  }

  const toggleCategoryFilter = (category: string) => {
    setCategoryFilters((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    )
  }

  const clearAllFilters = () => {
    setStatusFilters([])
    setCategoryFilters([])
  }

  const totalFilters = statusFilters.length + categoryFilters.length

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Advanced Filtering</span>
          <div className="flex gap-2 items-center">
            <Filter count={totalFilters} active={totalFilters > 0}>
              All Filters
            </Filter>
            {totalFilters > 0 && (
              <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                Clear All
              </Button>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex gap-2 flex-wrap">
            <DropdownMenu>
              <DropdownMenuTrigger render={<Filter count={statusFilters.length} active={statusFilters.length > 0} />}>
                Status
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {['Active', 'Pending', 'Completed', 'Cancelled'].map((status) => (
                  <DropdownMenuCheckboxItem
                    key={status}
                    checked={statusFilters.includes(status.toLowerCase())}
                    onCheckedChange={() => toggleStatusFilter(status.toLowerCase())}
                  >
                    {status}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger render={<Filter count={categoryFilters.length} active={categoryFilters.length > 0} />}>
                Category
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {['Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports'].map(
                  (category) => (
                    <DropdownMenuCheckboxItem
                      key={category}
                      checked={categoryFilters.includes(category.toLowerCase())}
                      onCheckedChange={() => toggleCategoryFilter(category.toLowerCase())}
                    >
                      {category}
                    </DropdownMenuCheckboxItem>
                  )
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {totalFilters > 0 && (
            <div className="p-4 bg-muted rounded-md space-y-2">
              {statusFilters.length > 0 && (
                <p className="text-sm">
                  <strong>Status:</strong> {statusFilters.join(', ')}
                </p>
              )}
              {categoryFilters.length > 0 && (
                <p className="text-sm">
                  <strong>Category:</strong> {categoryFilters.join(', ')}
                </p>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
